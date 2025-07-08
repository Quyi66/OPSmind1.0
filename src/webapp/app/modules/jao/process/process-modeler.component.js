/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/5/24, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name processModeler
     * @description
     * ```html
     * <jao-process-modeler process-model="object"
     *     register-modeler="&function($modeler)"
     *     options="{readonly:boolean=, canvasCss:string=}"/>
     * @param {function($modeler)} registerModeler A function in parent controller to register the process controller.
     * @param {object} processModel Two-way binding of process model definition.
     * @param {object} options
     * @param {boolean=} options.readonly `true` is read only mode. Default is `false`.
     * @param {string=} options.canvasCss Extra CSS classes added to canvas
     * ```
     */
    angular.module('oplus.jao').component('jaoProcessModeler', {
        bindings: {
            processModel: '=',
            //https://stackoverflow.com/questions/43072304/how-to-triger-function-in-child-component-from-parent-component-in-angularjs
            registerModeler: '&',
            options: '<'
        },
        templateUrl: 'app/modules/jao/process/process-modeler.html',
        controller: ['$scope', '$element', '$interval', '$timeout', 'messageService', 'processBuilder', 'jaoJobService', '$translate', processModelerCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param $interval
     * @param $timeout
     * @param {messageService} messageService
     * @param {processBuilder} processBuilder
     * @param {jaoJobService} jaoJobService
     */
    function processModelerCtrl($scope, $element, $interval, $timeout, messageService, processBuilder, jaoJobService, $translate) {
        var that = this;
        // console.log(this.options.readonly);
        // _.merge(this.options, {readonly: false}, this.options);
        // console.log(this.options.readonly);
        this.lines = [];
        this.moduleDefs = processBuilder.getModuleDefs();
        this.sortableOptions;
        this.selectedTaskNodes = [];
        this.intervals = [];
        this.showElems = this.options.showElems || ['inventory', 'details', 'source', 'playbook'];
        this.clickTaskNode = clickTaskNode;
        this.addTask = addTask;
        this.removeTask = removeTask;
        this.addServerGroup = addServerGroup;
        this.removeServerGroup = removeServerGroup;
        this.validateModel = validateModel;
        this.drawLines = drawLines;
        this.highlightTask = highlightTask;
        this.$onInit = onInit;
        this.registerModeler({
            $modeler: {
                validateModel: validateModel,
                highlightTask: highlightTask
            }
        });

        function onInit() {
            // console.log(that.options);
            that.sortableOptions = {
                disabled: !!that.options.readonly,
                cursor: 'move',
                tolerance: "pointer",
                distance: 10,
                placeholder: "jao-pmd-task-placeholder jao-pmd-task-node card",
                start: function (event, ui) {
                    var itemIndex = ui.item.sortable.index;
                    $timeout(function () {
                        clickTaskNode(that.processModel.tasks[itemIndex], itemIndex);
                    });
                },
                update: function (event, ui) {
                    var itemIndex = ui.item.sortable.dropindex;
                    $timeout(function () {
                        clickTaskNode(that.processModel.tasks[itemIndex], itemIndex);
                    });
                }
            };
            // if (that.options.demoJobId) {
            //     jaoJobService.findJobById(that.options.demoJobId).then(function (job) {
            //         that.processModel = JSON.parse(job.configJson).processModel;
            //     }).catch(function (err) {
            //         throw new FatalError(err);
            //     });
            // }
            if (that.processModel) {
                buildDiagram();
            } else {
                var unregister = $scope.$watch('$ctrl.processModel', function (newVal, oldVal) {
                    if (!oldVal && newVal) {
                        unregister();
                        buildDiagram();
                    }
                });
            }
        }

        // function run() {
        //     if (that.runId) {
        //         that.intervals.push($interval(function () {
        //             updateRunStatus(that.runId);
        //         }, 3000));
        //     }
        //
        //     function updateRunStatus(runId) {
        //         var runStatus = getRunStatus(runId);
        //         var matches = /\[(.*?)\]/.exec(runStatus.currentTask);
        //         var currentTaskId;
        //         if (matches) {
        //             currentTaskId = matches[1];
        //             highlightTask(currentTaskId);
        //         }
        //
        //         function getRunStatus(runId) {
        //             var tasks = _.map(that.processModel.tasks, function (t) {
        //                 return '[' + t.id + ']' + t.name;
        //             });
        //             var task = tasks[Math.floor(Math.random() * tasks.length)];
        //             var runStatus = {currentTask: task};
        //             return runStatus;
        //
        //         }
        //     }
        // }

        function buildDiagram() {
            initProcessModelData(that.processModel);
            $timeout(function () {
                // Use timeout to wait task node rendered
                drawLines({action: 'all'});
            });
            watchPositionAndSize();
            $scope.$on('$destroy', function () {
                that.intervals.forEach(function (stop) {
                    $interval.cancel(stop);
                    stop = undefined;
                })
                that.intervals = [];
            });

            /**
             * Leader-line use absolute coordinates related to browser viewport.
             * We need re-position lines in following cases:
             * - canvas size (width) changes
             * - canvas position (x) changes
             * - lines are drawn on invisible canvas (like in tab), and canvas becomes visible
             */
            function watchPositionAndSize() {
                var wrapper = $('#jao-pmd-line-wrapper');
                var isHidden = wrapper.is(':hidden');
                that.intervals.push($interval(function () {
                    var wrapper = $('#jao-pmd-line-wrapper');
                    if (isHidden && wrapper.is(':visible')) {
                        console.log('drawLines');
                        drawLines({action: 'all'});
                        isHidden = false;
                        return;
                    }
                    var rect = wrapper[0].getBoundingClientRect();
                    // When element is hidden, x,y,width,height is zero
                    if (rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0) {
                        return;
                    }
                    if (!that.rect) {
                        that.rect = rect;
                    }
                    if (rect.x !== that.rect.x || rect.width !== that.rect.width) {
                        // console.log('redraw lines...', JSON.stringify(rect), JSON.stringify(that.rect));
                        drawLines({action: 'all'});
                        that.rect = rect;
                    }
                }, 500));
            }
        }

        function validateModel() {
            $('.jao-pmd-task-node').removeClass('error');
            try {
                var result = {
                    playbook: processBuilder.toPlaybook(that.processModel),
                    inventory: processBuilder.toInventory(that.processModel)
                };
                that.generatedPlaybook = result.playbook;
                that.generatedInventory = result.inventory;
                return result;
            } catch (err) {
                var taskId = err.message;
                $('#js-pm-tasknode-' + taskId).addClass('error');
                throw new Error('Task ' + taskId + ' not well defined');
            }
        }

        /**
         * Normalize process model data.
         * @param {ProcessDef} pd
         */
        function initProcessModelData(pd) {
            pd.tasks = pd.tasks || [];
            pd.params = pd.params || [];
            pd.inventory = pd.inventory || [];
            pd.tasks.forEach(function (task) {
                if (!task.id) {
                    task.id = uniqueId();
                }
            });
        }

        function uniqueId() {
            return _.uniqueId(Date.now() + '_');
        }

        /**
         *
         * @param {[string]} taskIds
         */
        function highlightTask(taskIds) {
            $('.jao-pmd-task-node').removeClass('highlight');
            taskIds.forEach(function (id) {
                $('#js-pm-tasknode-' + id).addClass('highlight');
            });
        }

        /**
         *
         */
        function drawLines() {
            $('.leader-line').remove();
            // console.log('drawLines');
            // that.lines.forEach(function (line) {
            //     try {
            //         line.remove();
            //     } catch (err) {
            //     }
            // });
            that.lines = [];
            var tasks = that.processModel.tasks;
            for (var i = 0; i < tasks.length - 1; i++) {
                var startId = 'js-pm-tasknode-' + tasks[i].id;
                var endId = 'js-pm-tasknode-' + tasks[i + 1].id;
                var line = new LeaderLine({
                    start: document.getElementById(startId),
                    end: document.getElementById(endId),
                    // element:document.getElementById('js-process-canvas'),
                    size: 2,
                    color: '#DCDCDC',
                    startSocket: 'right',
                    endSocket: 'left',
                    // endPlug:'arrow3',
                    // path: 'magnet'
                    path: 'grid'
                });
                that.lines.push(line);
            }
            fixScrollPosition();
        }

        function fixScrollPosition() {
            var lines = that.lines;
            // Handle scroll
            // https://jsfiddle.net/2sfxvy8k/
            var wrapper = $('#jao-pmd-line-wrapper');
            // Reset wrapper
            wrapper.css('transform', 'none');
            var rect = wrapper[0].getBoundingClientRect();
            // Move to the origin of coordinates as the document
            wrapper.css('transform', 'translate(' +
                ((rect.left + window.pageXOffset) * -1) + 'px, ' +
                ((rect.top + window.pageYOffset) * -1) + 'px)');
            wrapper.append($('body > .leader-line'));
            lines.forEach(function (line) {
                line.position();
            });
        }

        function addTask() {
            that.activeTask = {id: uniqueId()};
            that.processModel.tasks.push(that.activeTask);
            clickTaskNode(that.activeTask, that.processModel.tasks.length - 1);
            $timeout(function () {
                drawLines({action: 'add', taskIndex: that.processModel.tasks.length - 1});
            });
        }

        function removeTask() {
            var index = _.findIndex(that.processModel.tasks, function (o) {
                return o.id === that.activeTask.id;
            });
            that.processModel.tasks.splice(index, 1);
            that.selectedTaskNodes.length = 0;
            that.activeTask = undefined;
            $timeout(function () {
                drawLines({action: 'remove', taskIndex: index});
            });
        }

        function addServerGroup() {
            that.activeServerGroup = {hosts: []};
            that.processModel.inventory.push(that.activeServerGroup);
        }

        function removeServerGroup(index) {
            messageService.confirm(
                $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.delete') }),
                $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.delete'), obj: $translate.instant('jao.job.process.server_group') }),
                function () {
                    that.processModel.inventory.splice(index, 1);
                });
        }

        function clickTaskNode(task, index) {
            if (that.showElems.indexOf('details') < 0) {
                return;
            }
            that.activeTask = task;
            that.selectedTaskNodes.length = 0;
            that.selectedTaskNodes.push(index);
        }

        function blurTaskNode(index) {
            that.activeTask = undefined;
            that.selectedTaskNodes.length = 0;
        }
    }
})
();
