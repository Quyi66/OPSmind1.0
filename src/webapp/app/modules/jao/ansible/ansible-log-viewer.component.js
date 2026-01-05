/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/9, created
 * @modified Virtual scroll optimization for large log data, 2024
 */
(function () {
    'use strict';

    // ============ 性能配置 ============
    var PERFORMANCE_CONFIG = {
        BATCH_UPDATE_INTERVAL: 100,
        MAX_LINES_PER_BATCH: 500,
        SCROLL_THROTTLE_INTERVAL: 100,
        MAX_LINES: 100000,
        LINE_HEIGHT: 18,
        SEARCH_DEBOUNCE: 500,
        MAX_SEARCH_RESULTS: 5000
    };

    angular.module('oplus.commons').component('ansibleLogViewer', {
        bindings: {
            runId: '<',
            content: '<'
        },
        templateUrl: 'app/modules/jao/ansible/ansible-log-viewer.component.html',
        controller: ['$scope', '$element', '$timeout', '$interval', 'messageService', 'jaoJobService', ansibleLogViewerCtrl]
    });

    function throttle(func, wait) {
        var lastTime = 0;
        var timeout = null;
        return function () {
            var context = this;
            var args = arguments;
            var now = Date.now();
            if (now - lastTime >= wait) {
                lastTime = now;
                func.apply(context, args);
            } else if (!timeout) {
                timeout = setTimeout(function () {
                    lastTime = Date.now();
                    timeout = null;
                    func.apply(context, args);
                }, wait - (now - lastTime));
            }
        };
    }

    function debounce(func, wait) {
        var timeout = null;
        return function () {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        };
    }

    function ansibleLogViewerCtrl($scope, $element, $timeout, $interval, messageService, jaoJobService) {
        var that = this;
        var batchData = {};
        var ONLY_ONE_BATCH = 'default';
        var websocket;

        // ============ 核心数据 ============
        var allLines = [];
        var rawMessageQueue = [];
        var pendingLines = [];
        var processingTimer = null;
        var renderTimer = null;
        var isProcessing = false;
        var isRendering = false;
        var lineIdCounter = 0;

        // ============ 搜索状态（使用 Set 优化查找性能）============
        var searchResultIndices = [];    // 匹配行的索引数组
        var searchMatchSet = {};         // 匹配行索引的快速查找（使用对象模拟 Set）
        var currentSearchIndex = -1;
        var currentMatchLineIndex = -1;  // 当前高亮的行索引

        // ============ 公开的属性和方法 ============
        this.lines = [];
        this.lineHeight = PERFORMANCE_CONFIG.LINE_HEIGHT;
        this.searchText = '';
        this.searchResultCount = 0;
        this.currentResultIndex = 0;

        this.$onInit = onInit;
        this.$onDestroy = onDestroy;
        this.toggleScroll = toggleScroll;
        this.autoScroll = true;
        this.viewBatch = viewBatch;
        this.onLineDblClick = onLineDblClick;
        this.getLineClass = getLineClass;

        // 搜索相关
        this.onSearchInput = debounce(doSearch, PERFORMANCE_CONFIG.SEARCH_DEBOUNCE);
        this.nextResult = nextResult;
        this.prevResult = prevResult;
        this.onSearchKeydown = onSearchKeydown;
        this.onSearchChange = onSearchChange;

        var throttledScroll = throttle(function () {
            if (that.autoScroll) {
                scrollToBottom();
            }
        }, PERFORMANCE_CONFIG.SCROLL_THROTTLE_INTERVAL);

        function scrollToBottom() {
            var container = $element.find('.virtual-log-container')[0];
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }

        function scrollToArrayIndex(arrayIndex) {
            var container = $element.find('.virtual-log-container')[0];
            if (container) {
                var scrollTop = arrayIndex * PERFORMANCE_CONFIG.LINE_HEIGHT;
                container.scrollTop = scrollTop - container.clientHeight / 2;
            }
        }

        // Helper function to find array index by lineNum
        function findArrayIndexByLineNum(lineNum) {
            for (var i = 0; i < allLines.length; i++) {
                if (allLines[i].lineNum === lineNum) {
                    return i;
                }
            }
            return -1;
        }

        // ==================== 搜索功能（优化版）====================

        function doSearch() {
            var keyword = that.searchText;

            // 清除之前的搜索结果（不修改行对象）
            searchResultIndices = [];  // 现在存储 lineNum
            searchMatchSet = {};       // key 是 lineNum
            currentSearchIndex = -1;
            currentMatchLineIndex = -1;

            if (!keyword || keyword.length < 2) {
                that.searchResultCount = 0;
                that.currentResultIndex = 0;
                $scope.$applyAsync();
                return;
            }

            // 搜索（不区分大小写）- 使用 lineNum 作为标识
            var lowerKeyword = keyword.toLowerCase();
            for (var j = 0; j < allLines.length && searchResultIndices.length < PERFORMANCE_CONFIG.MAX_SEARCH_RESULTS; j++) {
                if (allLines[j].text.toLowerCase().indexOf(lowerKeyword) >= 0) {
                    var lineNum = allLines[j].lineNum;
                    searchResultIndices.push(lineNum);
                    searchMatchSet[lineNum] = true;
                }
            }

            that.searchResultCount = searchResultIndices.length;

            if (searchResultIndices.length > 0) {
                currentSearchIndex = 0;
                that.currentResultIndex = 1;
                currentMatchLineIndex = searchResultIndices[0];
                // 计算滚动位置：找到对应行在数组中的索引
                var arrayIndex = findArrayIndexByLineNum(currentMatchLineIndex);
                if (arrayIndex >= 0) {
                    scrollToArrayIndex(arrayIndex);
                }
            }

            $scope.$applyAsync();
        }

        /**
         * 输入变化时的回调 - 当输入清空时自动清除搜索高亮
         */
        function onSearchChange() {
            if (!that.searchText || that.searchText.length < 2) {
                // 输入为空或少于2字符，清除搜索结果
                searchResultIndices = [];
                searchMatchSet = {};
                currentSearchIndex = -1;
                currentMatchLineIndex = -1;
                that.searchResultCount = 0;
                that.currentResultIndex = 0;
            }
        }

        function nextResult() {
            if (searchResultIndices.length === 0) return;

            currentSearchIndex = (currentSearchIndex + 1) % searchResultIndices.length;
            that.currentResultIndex = currentSearchIndex + 1;
            currentMatchLineIndex = searchResultIndices[currentSearchIndex];
            var arrayIndex = findArrayIndexByLineNum(currentMatchLineIndex);
            if (arrayIndex >= 0) {
                scrollToArrayIndex(arrayIndex);
            }
            $scope.$applyAsync();
        }

        function prevResult() {
            if (searchResultIndices.length === 0) return;

            currentSearchIndex = (currentSearchIndex - 1 + searchResultIndices.length) % searchResultIndices.length;
            that.currentResultIndex = currentSearchIndex + 1;
            currentMatchLineIndex = searchResultIndices[currentSearchIndex];
            var arrayIndex = findArrayIndexByLineNum(currentMatchLineIndex);
            if (arrayIndex >= 0) {
                scrollToArrayIndex(arrayIndex);
            }
            $scope.$applyAsync();
        }

        function onSearchKeydown($event) {
            if ($event.keyCode === 13) { // Enter
                $event.preventDefault();
                // 直接从输入框获取最新值，避免 ng-model debounce 延迟
                var currentValue = $event.target.value;
                if (currentValue !== that.searchText) {
                    that.searchText = currentValue;
                    doSearch();
                } else if (searchResultIndices.length === 0) {
                    doSearch();
                } else if ($event.shiftKey) {
                    prevResult();
                } else {
                    nextResult();
                }
            } else if ($event.keyCode === 27) { // Escape
                $event.target.value = '';
                that.searchText = '';
                searchResultIndices = [];
                searchMatchSet = {};
                currentSearchIndex = -1;
                currentMatchLineIndex = -1;
                that.searchResultCount = 0;
                that.currentResultIndex = 0;
                $scope.$applyAsync();
            }
        }

        // ==================== 语法高亮（优化版）====================

        function getLineClass(line) {
            if (!line || !line.text) return '';

            var classes = [];
            var lineNum = line.lineNum;

            // 搜索高亮（使用 lineNum 进行匹配）
            if (lineNum === currentMatchLineIndex) {
                classes.push('log-search-current');
            } else if (searchMatchSet[lineNum]) {
                classes.push('log-search-match');
            }

            // 语法高亮（缓存结果避免重复正则匹配）
            if (!line._class) {
                var text = line.text;
                if (text.match(/^ok:/)) line._class = 'log-ok';
                else if (text.match(/^changed:/)) line._class = 'log-changed';
                else if (text.match(/^fatal:/)) line._class = 'log-fatal';
                else if (text.match(/^skipping:/)) line._class = 'log-skipping';
                else if (text.match(/FAILED!|UNREACHABLE!/)) line._class = 'log-failed';
                else if (text.match(/^TASK \[/)) line._class = 'log-task';
                else if (text.match(/^PLAY \[/)) line._class = 'log-play';
                else if (text.match(/\[WARNING\]/)) line._class = 'log-warning';
                else if (text.match(/^PLAY RECAP/)) line._class = 'log-recap';
                else line._class = '';
            }

            if (line._class) {
                classes.push(line._class);
            }

            return classes.join(' ');
        }

        // ==================== 双击解析 ====================

        function onLineDblClick(line) {
            if (!line || !line.text) return;
            var text = line.text;
            if (text.length > 100000) {
                messageService.alert('提示', '行内容过大，无法解析');
                return;
            }

            var data = parseOneLineAnsible(text);
            var body;
            if (angular.isString(data)) {
                body = '<pre style="max-height:400px;overflow:auto;">' + escapeHtml(data) + '</pre>';
            } else {
                body = '<ul class="list list-unstyled" style="max-height:400px;overflow:auto;">';
                Object.keys(data).forEach(function (key) {
                    if (['stdout_lines', 'stderr_lines'].indexOf(key) > -1) return;
                    var value = data[key];
                    if (angular.isObject(value)) value = JSON.stringify(value, null, 2);
                    if (typeof value === 'string' && value.length > 10000) value = value.substring(0, 10000) + '\n... [截断]';
                    body += '<li><strong>' + escapeHtml(key) + '</strong><pre class="bg-light" style="padding:.25rem 1rem;max-height:200px;overflow:auto;">' + escapeHtml(String(value)) + '</pre></li>';
                });
                body += '</ul>';
            }
            messageService.alert('详情', body);
        }

        function parseOneLineAnsible(lineText) {
            var matches = lineText.match(/^(\w+):\s*\[(.*?)].*=>\s*(.*?)$/);
            if (matches) {
                try {
                    var output = JSON.parse(matches[3]);
                    return _.merge({ status: matches[1], host: matches[2] }, output);
                } catch (e) { }
            }
            return lineText;
        }

        function escapeHtml(text) {
            var div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // ==================== 批次切换 ====================

        function viewBatch(batchId) {
            if (that.activeBatch !== batchId) {
                that.activeBatch = batchId;
                allLines = batchData[batchId] ? batchData[batchId].lines.slice() : [];
                that.lines = allLines;
                // 清除搜索状态
                searchResultIndices = [];
                searchMatchSet = {};
                currentSearchIndex = -1;
                currentMatchLineIndex = -1;
                that.searchResultCount = 0;
                that.currentResultIndex = 0;
                $scope.$applyAsync();
            }
        }

        function toggleScroll() {
            that.autoScroll = !that.autoScroll;
        }

        // ==================== 生命周期 ====================

        function onInit() {
            $scope.$watch('$ctrl.runId', function (newVal, oldVal) {
                that.oldRunId = oldVal;
                openWebsocketWhenVisible();
            });
            $scope.$on('$destroy', onDestroy);
            var stop = $interval(function () {
                openWebsocketWhenVisible();
                if (websocket) $interval.cancel(stop);
            }, 1000);
        }

        function onDestroy() {
            closeWebsocket();
            clearTimers();
        }

        function closeWebsocket() {
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
            websocket = null;
        }

        function clearTimers() {
            if (processingTimer) { clearTimeout(processingTimer); processingTimer = null; }
            if (renderTimer) { clearTimeout(renderTimer); renderTimer = null; }
        }

        function checkVisible() {
            return $element.is(':visible');
        }

        // ==================== 消息处理 ====================

        function scheduleProcessing() {
            if (!processingTimer && !isProcessing && rawMessageQueue.length > 0) {
                processingTimer = setTimeout(processMessages, 0);
            }
        }

        function processMessages() {
            processingTimer = null;
            if (isProcessing || rawMessageQueue.length === 0) return;

            isProcessing = true;
            var processedCount = 0;
            var maxLines = PERFORMANCE_CONFIG.MAX_LINES_PER_BATCH;

            while (rawMessageQueue.length > 0 && processedCount < maxLines) {
                var msgObj = rawMessageQueue.shift();
                var message = msgObj.message;
                var batchId = msgObj.batchId;

                var lines = message.split('\n');
                if (lines[lines.length - 1] === '') lines.pop();

                var linesToProcess = lines.length;
                if (processedCount + linesToProcess > maxLines) {
                    linesToProcess = maxLines - processedCount;
                    var remaining = lines.slice(linesToProcess);
                    if (remaining.length > 0) {
                        rawMessageQueue.unshift({ message: remaining.join('\n') + '\n', batchId: batchId });
                    }
                    lines = lines.slice(0, linesToProcess);
                }

                var lineObjects = lines.map(function (text) {
                    lineIdCounter++;
                    return { id: 'L' + lineIdCounter, lineNum: lineIdCounter, text: text };
                });

                if (!batchData[batchId]) batchData[batchId] = { lines: [] };
                batchData[batchId].lines = batchData[batchId].lines.concat(lineObjects);

                if (that.activeBatch === batchId) {
                    pendingLines = pendingLines.concat(lineObjects);
                }

                processedCount += linesToProcess;
            }

            isProcessing = false;
            scheduleRender();

            if (rawMessageQueue.length > 0) {
                scheduleProcessing();
            }
        }

        function scheduleRender() {
            if (!renderTimer && !isRendering && pendingLines.length > 0) {
                renderTimer = setTimeout(doRender, PERFORMANCE_CONFIG.BATCH_UPDATE_INTERVAL);
            }
        }

        function doRender() {
            renderTimer = null;
            if (isRendering || pendingLines.length === 0) return;

            isRendering = true;

            var linesToRender = pendingLines.splice(0, PERFORMANCE_CONFIG.MAX_LINES_PER_BATCH);
            allLines = allLines.concat(linesToRender);

            if (allLines.length > PERFORMANCE_CONFIG.MAX_LINES) {
                allLines = allLines.slice(allLines.length - PERFORMANCE_CONFIG.MAX_LINES);
            }

            that.lines = allLines;
            isRendering = false;

            if (that.autoScroll) {
                $timeout(scrollToBottom, 20);
            }

            $scope.$applyAsync(function () {
                that.allBatches = _.keys(batchData);
            });

            if (pendingLines.length > 0) {
                scheduleRender();
            }
        }

        function bufferMessage(message, batchId) {
            rawMessageQueue.push({ message: message, batchId: batchId });
            scheduleProcessing();
        }

        // ==================== WebSocket ====================

        function openWebsocketWhenVisible() {
            if (websocket) {
                if (!that.runId) return;
                if (that.runId === that.oldRunId) return;
            }
            if (!that.runId) return;
            if (!checkVisible() && that.runId === that.oldRunId) return;

            allLines = [];
            rawMessageQueue = [];
            pendingLines = [];
            that.lines = [];
            lineIdCounter = 0;
            batchData = {};
            searchResultIndices = [];
            searchMatchSet = {};
            currentSearchIndex = -1;
            currentMatchLineIndex = -1;
            that.searchText = '';
            that.searchResultCount = 0;
            that.currentResultIndex = 0;
            clearTimers();

            websocket = new WebSocket(jaoJobService.getRunlogWebsocketUrl(that.runId));

            websocket.onopen = function () {
                console.log('WebSocket opened');
            };

            websocket.onmessage = function (event) {
                var dataJson = event.data;
                var batchId, message;

                try {
                    var dataObj = JSON.parse(dataJson);
                    batchId = dataObj.batchId;
                    message = dataObj.message;
                } catch (err) {
                    batchId = ONLY_ONE_BATCH;
                    message = dataJson;
                }

                if (!that.activeBatch) {
                    that.activeBatch = batchId;
                }

                bufferMessage(message, batchId);
            };

            websocket.onclose = function () {
                console.log('WebSocket closed');
                while (rawMessageQueue.length > 0 || pendingLines.length > 0) {
                    if (rawMessageQueue.length > 0) { isProcessing = false; processMessages(); }
                    if (pendingLines.length > 0) { isRendering = false; doRender(); }
                }
            };

            websocket.onerror = function (event) {
                console.error('WebSocket error:', event);
            };
        }

        that.download = function () {
            return window.$oplus.appConfig.apiBaseUrls.jao + "/api/jao/runlogs/ansible/" + that.runId;
        };
    }
})();
