/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/9, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name ansibleLogViewer
     * @description
     * View realtime or static ansible log.
     * Use `runId` for realtime log or `content` for static log
     * ```html
     * <ansible-log-viewer run-id="string" content="string">
     * ```
     * @param {string} runId
     * @param {string} content
     */
    angular.module('oplus.commons').component('ansibleLogViewer', {
        bindings: {
            runId: '<',
            content: '<'
        },
        templateUrl: 'app/modules/jao/ansible/ansible-log-viewer.component.html',
        controller: ['$scope', '$element', '$timeout', '$interval', 'messageService', 'jaoJobService', ansibleLogViewerCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param $timeout
     * @param $interval
     * @param {messageService} messageService
     * @param {jaoJobService} jaoJobService
     */
    function ansibleLogViewerCtrl($scope, $element, $timeout, $interval, messageService, jaoJobService) {
        var that = this;
        var batchData = {};
        var ONLY_ONE_BATCH = 'default';
        var websocket;
        this.editorLoaded = editorLoaded;
        this.$onInit = onInit;
        this.parseCurrentLine = parseCurrentLine;
        this.toggleScroll = toggleScroll;
        this.autoScroll = true;
        this.viewBatch = viewBatch;

        function viewBatch(batchId) {
            if (that.activeBatch !== batchId) {
                that.activeBatch = batchId;
                var batchContent = batchData[batchId].content;
                that.cmInstance.setValue(batchContent);
            }
        }

        function toggleScroll() {
            that.autoScroll = !that.autoScroll;
        }

        function parseCurrentLine() {
            var cm = that.cmInstance;
            var current = cm.getCursor();
            var currentLine = current.line;
            // console.log('parseCurrentLine');
            var content = cm.getLine(currentLine);
            // console.log('parseCurrentLine:content=%o', content.length);

            var data = parseOneLineAnsible(content);
            var body;
            if (angular.isString(data)) {
                body = '<pre>' + data + '</pre>';
            } else if (angular.isObject(data)) {
                body = '<ul class="list list-unstyled">';
                var excludedKeys = ['stdout_lines', 'stderr_lines'];
                Object.keys(data).forEach(function (key) {
                    if (excludedKeys.indexOf(key) > -1) {
                        return;
                    }
                    var value = data[key];
                    if (angular.isObject(value)) {
                        value = JSON.stringify(value);
                    }
                    body += '<li><strong>' + key + '</strong><pre class="bg-light" style="padding:.25rem 1rem;">' + value + '</pre></li>'
                });
                body += '</ul>';
            }
            messageService.alert('Info', body);

            function parseOneLineAnsible(line) {
                // console.log('parseOneLineAnsible...');
                var begin = Date.now();
                var matches = line.match(/^(\w+):\s*\[(.*?)].*=>\s*(.*?)$/);
                // console.log('regex.match string of %o chars in %o ms', line.length, Date.now() - begin);
                begin = Date.now();
                var data;
                if (matches) {
                    begin = Date.now();
                    var output = JSON.parse(matches[3]);
                    // console.log('Parse string of %o chars in %o ms', matches[3].length, Date.now() - begin);
                    data = {
                        status: matches[1],
                        host: matches[2]
                    };
                    _.merge(data, output);
                } else {
                    data = line;
                }
                return data;
            }
        }

        function checkVisible() {
            return $element.is(':visible');
        }

        function editorLoaded(cm) {
            window._debugCm = cm;
            that.cmInstance = cm;
            $timeout(function () {
                gotoLastLine();
            }, 200);
            cm.on('dblclick', function (event) {
                parseCurrentLine();
                // console.log('dblclick...%o',event);
            });
        }

        function onInit() {
            $scope.$watch('$ctrl.runId', function (newVal, oldVal) {
                that.oldRunId = oldVal;
                openWebsocketWhenVisible();
            });
            $scope.$on('$destroy', function () {
                closeWebsocket();
                if (that.cmInstance) {
                    that.cmInstance.off('dblclick');
                }
            });
            var stop = $interval(function () {
                openWebsocketWhenVisible();
                if (websocket) {
                    $interval.cancel(stop);
                }
            }, 1000);
        }

        function closeWebsocket() {
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        }

        function gotoLastLine() {
            if (that.autoScroll) {
                that.cmInstance.scrollIntoView(that.cmInstance.lastLine(), 0);
            }
        }
        function openWebsocketWhenVisible() {
            if (websocket) {
                if (!that.runId) {
                    return;
                } else {
                    if (that.runId === that.oldRunId) {
                        return;
                    }
                }
            }
            if (!that.runId) return;
            if (!checkVisible() && that.runId === that.oldRunId) return;
            websocket = new WebSocket(jaoJobService.getRunlogWebsocketUrl(that.runId));

            websocket.onopen = function () {
                console.log('websocket opened: status=%o', websocket.readyState);
            };

            /**
             *
             * @param {{data:string}} event
             * @param {string} event.data A JSON string in format of `{batchId:string, message:string}`
             */
            var cm2 = that.cmInstance;
            cm2.setValue("");
            websocket.onmessage = function onMessage(event) {
                var dataJson = event.data;
                var batchId, message;
                try {
                    var dataObj = JSON.parse(dataJson);
                    batchId = dataObj.batchId;
                    message = dataObj.message;
                } catch (err) {
                    console.warn('Cannot parse batchId from websocket data %o', event.data);
                    batchId = ONLY_ONE_BATCH;
                    message = dataJson;
                }
                if (!that.activeBatch) {
                    that.activeBatch = batchId;
                }
                // Save batch data
                batchData[batchId] = batchData[batchId] || {content: ''};
                batchData[batchId].content += message;
                $scope.$apply(function () {
                    that.allBatches = _.keys(batchData);
                });
                cm2 = that.cmInstance;
                var lastLine = cm2.lastLine();
                // console.warn('append %o', message);
                // Bug fix: large JSON file load problem, memory leak gc
                // Reference: https://github.com/codemirror/CodeMirror/issues/1774
                // Solve: upgrade codemirror version to 5.65.3
                cm2.replaceRange(message, CodeMirror.Pos(lastLine));
                gotoLastLine();

                // if (that.oldRunId === that.runId && that.activeBatch === batchId) {
                //     // Append message to cm and scroll to last line
                //     // https://stackoverflow.com/questions/18946546/how-do-you-append-text-in-codemirror
                //
                // } else {
                //     cm2 = that.cmInstance;
                //     var lastLine2 = cm2.lastLine();
                //     cm2.replaceRange(message, CodeMirror.Pos(lastLine2));
                //     gotoLastLine();
                // }
            };
            websocket.onclose = function () {
                console.log('websocket closed: status=%o', websocket.readyState);
            };
            websocket.onerror = function (event) {
                console.error(event);
            };
        }

        that.download = function () {
            return window.$oplus.appConfig.apiBaseUrls.jao + "/api/jao/runlogs/ansible/" + that.runId;
        }
    }
})();
