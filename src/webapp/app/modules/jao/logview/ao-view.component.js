/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/10/13
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name jaoAoView
     * @desc Ansible output viewer to replace old jao-ansible-output
     * @usage
     * ```
     * <jao-ao-view contents="object[]">
     * ```
     * @param {object[]} contents List of ansible log contents in format of `{plays,tasks,}`
     */
    angular.module('oplus.jao').component('jaoAoView', {
        bindings: {
            contents: '<'
        },
        templateUrl: 'app/modules/jao/logview/ao-view.component.html',
        controller: ['$templateRequest', '$http', '$element', '$scope', '$filter', '$timeout', '$compile', 'messageService', 'jaoUtil', AoViewCtrl]
    });

    /**
     *
     * @param {$templateRequest} $templateRequest
     * @param $http
     * @param $element
     * @param $scope
     * @param $filter
     * @param $timeout
     * @param $compile
     * @param {messageService} messageService
     * @param {jaoUtil} jaoUtil
     */
    function AoViewCtrl($templateRequest, $http, $element, $scope, $filter, $timeout, $compile, messageService, jaoUtil) {
        var that = this;
        var allBatches = [];
        var showIcon = true;
        this.filterText = '';
        this.filterHost = filterHost;
        this.exportData = exportData;
        this.expandOrCollapseAll = expandOrCollapseAll;
        this.statusDefs = jaoUtil.taskStatusDefs;
        this.toggleMergeMode = toggleMergeMode;
        this.isBatchMerged = true;
        this.isExpandedAll = false;
        this.showRawOutput = showRawOutput;
        this.toggleStatusFilter = toggleStatusFilter;
        this.changeBatch = changeBatch;
        this.$onInit = function () {
            $scope.$watch('$ctrl.contents', function (newVal, oldVal) {
                if (newVal) {
                    generateTree(newVal, that.isBatchMerged);
                }
            }, true);
        };

        function changeBatch(batchId) {
            that.selectedBatchId = batchId;
            // Update stats
            var map = {};
            if (that.selectedNode && that.selectedNode.data && that.selectedNode.data.tasks) {
                that.selectedNode.data.tasks.forEach(function (task) {
                    if (!batchId || task.batchId === batchId) {
                        if (angular.isNumber(map[task.status])) {
                            map[task.status]++;
                        } else {
                            map[task.status] = 1;
                        }
                    }
                });
            }
            that.nodeTasksStats = map;
        }

        function toggleStatusFilter(key) {
            if (that.statusFilter === key) {
                that.statusFilter = undefined;
            } else {
                that.statusFilter = key;
            }
        }

        function expandOrCollapseAll() {
            that.isExpandedAll = !that.isExpandedAll;
            $element.find('.js-tree').each(function () {
                var tree = $.ui.fancytree.getTree(this);
                tree.expandAll(that.isExpandedAll);
            });
        }

        function filterHost(input) {
            $element.find('.js-tree').each(function () {
                var tree = $.ui.fancytree.getTree(this);
                if (input) {
                    tree.filterNodes(input);
                } else {
                    tree.clearFilter();
                }
            });
        }

        function showRawOutput(index) {
            that.detailView = 'rawOutput';
            that.selectedNode = undefined;
            if (!angular.isDefined(index)) {
                that.output = that.contents;
            } else {
                that.output = that.contents[index];
            }
        }

        function toggleMergeMode() {
            that.isExpandedAll = false;
            that.isBatchMerged = !that.isBatchMerged;
            generateTree(that.contents, that.isBatchMerged);
        }

        function exportData() {
            that.exdata = {allBatches: allBatches};
            $templateRequest('app/modules/jao/logview/ao-view-export-template.html').then(function (data) {
                var elem = $compile('<div>' + data + '</div>')($scope);
                $timeout(function () {
                    var html = elem.prop('outerHTML');
                    html =
                        '<html lang="zh-cn">' +
                        '<head>' +
                        '<meta charset="UTF-8"/>' +
                        '<title>{{\'jao.log.script_output\' | translate}}</title>' +
                        '</head>' +
                        '<body>' + html + '</body>' +
                        '</html>';
                    saveAs(new Blob([html]), 'AnsibleOutput.html');
                });
            }).catch(function (err) {
                throw err;
            })
        }

        /**
         *
         * @param {object[]} outputs Batches of Ansible output in JSON string
         * @param {boolean} mergeBatches
         */
        function generateTree(outputs, mergeBatches) {
            var treeContainer = $element.find('.js-aoview-tree');
            treeContainer.find('.js-tree').fancytree('destroy');
            treeContainer.empty();
            var aoList = toAoList(outputs);
            if (!mergeBatches && aoList.length > 1) {
                allBatches = [];
                aoList.forEach(function (ao, index) {
                    var nodes = constructTreeNodes(ao, nodes);
                    allBatches.push(nodes);
                    buildTree(treeContainer, nodes, index);
                });
            } else {
                var allNodes = [];
                aoList.forEach(function (ao, index) {
                    var nodes = constructTreeNodes(ao);
                    nodes.forEach(function (playNode) {
                        var playNodeInAll = _.find(allNodes, {title: playNode.title});
                        if (!playNodeInAll) {
                            playNodeInAll = playNode;
                            allNodes.push(playNodeInAll);
                        } else {
                            playNode.children.forEach(function (hostNode) {
                                var existingHostNode = _.find(playNodeInAll.children, {title: hostNode.title});
                                if (!existingHostNode) {
                                    playNodeInAll.children.push(hostNode);
                                } else {
                                    // 合并同一主机的任务列表
                                    existingHostNode.tasks = existingHostNode.tasks.concat(hostNode.tasks);
                                    // 重新生成任务的 order 序号
                                    existingHostNode.tasks.forEach(function (t, idx) {
                                        t.order = idx;
                                    });
                                    // 合并状态图标与状态数据
                                    if (hostNode.data && hostNode.data.unreachable) {
                                        existingHostNode.extraClasses = 'text-danger';
                                        existingHostNode.icon = hostNode.icon;
                                        existingHostNode.iconTooltip = hostNode.iconTooltip;
                                        existingHostNode.data = existingHostNode.data || {};
                                        existingHostNode.data.unreachable = true;
                                    } else if (hostNode.icon && hostNode.icon.indexOf('fail') >= 0) {
                                        if (!existingHostNode.data || !existingHostNode.data.unreachable) {
                                            existingHostNode.icon = hostNode.icon;
                                            existingHostNode.iconTooltip = hostNode.iconTooltip;
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
                allBatches = [allNodes];
                buildTree(treeContainer, allNodes, null);
            }
            $compile(treeContainer.find('[ng-click]'))($scope);

            function sortNodes(treeNodes) {
                treeNodes.forEach(function (playNode) {
                    playNode.children.sort(compare);
                });

                function compare(a, b) {
                    if (a.type === 'host' && b.type === 'host') {
                        if (a.data.unreachable && !b.data.unreachable) {
                            return -1;
                        } else if (!a.data.unreachable && b.data.unreachable) {
                            return 1;
                        }
                        var x = a.title.toLowerCase(),
                            y = b.title.toLowerCase();
                        return x === y ? 0 : x > y ? 1 : -1;
                    }
                }
            }

            /**
             *
             * @param {jQuery} treeContainer
             * @param {[object]} nodes
             * @param {number=} index Index of tree in this component
             */
            function buildTree(treeContainer, nodes, index) {
                sortNodes(nodes);
                var config = {
                    source: nodes,
                    click: function (event, data) {
                        var node = data.node;
                        if (node.type === 'play') {
                            node.toggleExpanded();
                        }
                        // },
                        // activate: function (event, data) {
                        //     var node = data.node;
                        if (node.type === 'host') {
                            $timeout(function () {
                                that.detailView = 'host';
                                that.selectedNode = node;
                                that.statusFilter = '';

                                // 查找该主机下所有不重复的任务批次 ID
                                var batchIds = [];
                                node.data.tasks.forEach(function (task) {
                                    if (task.batchId && batchIds.indexOf(task.batchId) === -1) {
                                        batchIds.push(task.batchId);
                                    }
                                });
                                that.hostBatchIds = batchIds;
                                // 默认选中首个批次
                                if (batchIds.length > 0) {
                                    that.selectedBatchId = batchIds[0];
                                } else {
                                    that.selectedBatchId = undefined;
                                }

                                var map = {};
                                node.data.tasks.forEach(function (task) {
                                    if (!that.selectedBatchId || task.batchId === that.selectedBatchId) {
                                        if (angular.isNumber(map[task.status])) {
                                            map[task.status]++;
                                        } else {
                                            map[task.status] = 1;
                                        }
                                    }
                                });
                                // console.log('tasks',node.data.tasks);
                                that.nodeTasksStats = map;
                            });
                        }
                    }
                };
                if (showIcon === false) {
                    config.icon = false;
                }
                config = _.extend({}, window.$oplus.fancytreeDefault, config);
                var treeTitle = angular.isNumber(index) ? 'Playbook ' + (index + 1) : 'Playbook';
                var tree = $('<div class="js-tree jao-aoview-tree"><h4 class="px-3 op-cursor-hand"' +
                    ' ng-click="$ctrl.showRawOutput(' + (angular.isNumber(index) ? index : '') + ')"><i class="fa fa-book-alt"></i> ' +
                    treeTitle +
                    '</h4></div>').appendTo(treeContainer);
                tree.fancytree(config);
                // Sort host
                // $.ui.fancytree.getTree(tree).visit(function (node) {
                //     if (node.type === 'play') {
                //         node.sortChildren(function (a, b) {
                //             if (a.data.unreachable && !b.data.unreachable) {
                //                 return -1;
                //             } else if (!a.data.unreachable && b.data.unreachable) {
                //                 return 1;
                //             }
                //             var x = a.title.toLowerCase(),
                //                 y = b.title.toLowerCase();
                //             return x === y ? 0 : x > y ? 1 : -1;
                //         }, true);
                //     }
                // });
            }

            function toAoList(outputs) {
                var list = [];
                outputs.forEach(function (output) {
                    // if (angular.isString(output)) {
                    //     try {
                    //         list.push(JSON.parse(output));
                    //     } catch (err) {
                    //         throw new Error('Cannot parse JSON: `' + output + '` due to ' + err.message);
                    //     }
                    // } else {
                    list.push(output);
                    // }
                });
                return list;
            }

            function constructTreeNodes(ao, nodesToMerge) {
                var nodes = [];
                that.hostStatusList = [];
                ao.plays.forEach(function (p) {
                    var play = p.play;
                    var playNode = {
                        title: play.name,
                        icon: 'fa fa-play-circle',
                        type: 'play',
                        expanded: true,
                        folder: true,
                        data: {},
                        children: []
                    };
                    if (showIcon === false) {
                        playNode.icon = false;
                    }
                    nodes.push(playNode);
                    p.tasks.forEach(function (t) {
                        var taskName = t.task.name;
                        var delegateCheck = ' -> ';
                        t.hosts.forEach(function (host) {
                            var parsedHost = jaoUtil.parseHost(host.hostKey);
                            var hostNode = _.find(playNode.children, {title: parsedHost.targetHost});
                            if (!hostNode) {
                                hostNode = {
                                    title: parsedHost.targetHost,
                                    icon: jaoUtil.hostStatusDefs.ok.icon + ' text-' + jaoUtil.hostStatusDefs.ok.color,
                                    // icon: false,
                                    type: 'host',
                                    tasks: [],
                                    data: {}
                                };
                                playNode.children.push(hostNode);
                            }
                            var output = host.stdout || host.stderr || host.msg;
                            if (output && angular.isString(output)) {
                                if (/(^{.+}$)|(^\[.+]$)/.test(output)) {
                                    try {
                                        output = $filter('json')(JSON.parse(output));
                                    } catch (err) {
                                        console.log(err.message);
                                    }
                                }
                            }

                            var status = jaoUtil.parseHostStatus(host);
                            if (status === 'unreachable') {
                                hostNode.extraClasses = 'text-danger';
                                hostNode.icon = jaoUtil.hostStatusDefs.unreachable.icon + ' text-' + jaoUtil.hostStatusDefs.unreachable.color;
                                hostNode.iconTooltip = jaoUtil.hostStatusDefs.unreachable.text;
                                hostNode.data.unreachable = true;
                            } else if (status === 'failed') {
                                hostNode.icon = jaoUtil.hostStatusDefs.failed.icon + ' text-' + jaoUtil.hostStatusDefs.failed.color;
                                // hostNode.extraClasses = 'text-danger';
                                hostNode.iconTooltip = jaoUtil.hostStatusDefs.failed.text;
                                // hostNode.data.hasFailedTask = true;
                            } else if (host.hostKey.indexOf('->') > 0) {
                                // delegate host
                                // hostNode.icon = 'fa fa-desktop text-primary';
                            }
                            if (showIcon === false) {
                                hostNode.icon = false;
                            }
                            hostNode.tasks.push({
                                name: taskName,
                                status: status,
                                output: output,
                                order: hostNode.tasks.length,
                                delegateHost: parsedHost.delegateHost,
                                batchId: ao._batchId
                            });
                        });
                    });
                });
                return nodes;
            }
        }
    }
})();