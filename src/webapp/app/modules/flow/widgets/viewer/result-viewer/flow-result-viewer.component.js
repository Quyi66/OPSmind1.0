/**
 * @ Author: chy
 * @ Create Time: 2023-04-07 11:10:55
 * @ Description:  
 */

import taskType from '../../../constants/task-type.constants'
import viewerEvents from '../../../constants/viewer-events.constants'

flowResultViewerCtrl.$inject = ['$scope', '$translate', 'flow.Service', '$state', '$q', 'messageService', '$interval', 'widgetInteraction', 'widgetValues', '$uibModal'];
export default function flowResultViewerCtrl($scope, $translate, flowService, $state, $q, messageService, $interval, widgetInteraction, widgetValues, $uibModal) {
  var that = this;

  that.markers = {
    active: 'active',
    completed: 'completed',
    warning: 'warning',
    error: 'error',
  }
  that.taskType = taskType;

  const defaultOptions = {
    inPage: false,
    viewMode: 'fixed',

    refreshInterval: 5
  };

  that.options = that.options && angular.extend(defaultOptions, that.options) || defaultOptions;

  if (that.options.inPage && $scope.$parent.$widget) {
    that.processId = $scope.$parent.$widget.$pageScope.pageParams.processId || that.processId;
    that.detailId = $scope.$parent.$widget.$pageScope.pageParams.detailId || that.detailId;
    that.instanceId = $scope.$parent.$widget.$pageScope.pageParams.instanceId || that.instanceId;
  }

  that.currentInstanceId = that.instanceId || undefined;

  that.currentNode = {}
  that.processAttrs = undefined;
  that.isInitedParams = false;

  that.getProcessProgress = () => {
    flowService.getProcessProgress(that.currentInstanceId).then(res => {
      that.progressDetail = res;

      if (that.options.inPage && $scope.$parent.$widget && that.options.pageParamName) {
        $scope.$parent.$widget.$pageScope.pageParams[that.options.pageParamName] = that.progressDetail;
        if (that.options.pageEvent)
          $scope.$parent.$widget.$pageScope.$broadcast(widgetValues.events.WidgetEvent, { eventName: that.options.pageEvent });
      }

      that.assignCurrentNode();


      !that.isInitedParams && that.progressDetail &&
        flowService.fetchProcessParams(that.processId).then(function (data) {
          that.params = Object.fromEntries(Object.keys(data.paramsMap).map(m => [m, {
            type: data.paramsMap[m].taskType
          }]))
          that.paramsArr = Object.entries(data.paramsMap);

          that.progressDetail.allTasks.forEach(item => {
            if (item.type === taskType.JobTask) {
              const { job, jobParam } = item.variables;
              const { jobId, jobName } = job;

              angular.extend(that.params[item.taskId], {
                jobId, jobName, 
                params: angular.fromJson(jobParam)
              })
            }
            else if (item.type === taskType.SubProcessTask) {
              const { process } = item.variables;

              angular.extend(that.params[item.taskId], process)
            }
            else
              angular.extend(that.params[item.taskId], item.variables)
          });
        });

      that.isInitedParams = true

      that.isRunning = [...res.activeTasks].length > 0;
      if (that.progressInterval.$$state.status === 0 && res.activeTasks.length === 0)
        $interval.cancel(that.progressInterval)
    })
  }
  
  flowService.fetchProcess(that.processId).then(function (data) {
    that.process = data;
  });

  that.queryDetail = (needReRender) => {
    flowService.fetchProcessDetail(that.processId, that.detailId || null).then(function (data) {
      that.processDetail = data;
      if (needReRender) {
        that.broadcastReRenderAsync(data.processXml).then(res => {
          that.getProcessProgress();
        })
      }
    });
  }

  that.currentInstanceId && that.queryDetail();

  that.queryRunningRunDetails = () => {
    if (that.options.inPage) {
      flowService.fetchRunningRunDetails(that.processId).then(function (data) {
        that.runningInstanceList = data;
        if (data.length > 0 && !that.currentInstance) {
          that.currentInstance = data[0];
          that.changeInstance();
        }

        if (data.length === 0 && !that.currentInstance)
          that.queryDetail()
      });
    }
  }

  that.currentInstanceId || that.queryRunningRunDetails();
  
  // $scope.$watch('$ctrl.processAttrs', (n, o) => {
  //   if (that.options.inPage && n && n.singleton !== 'true')
  //   {
  //     flowService.fetchRunningRunDetails(that.processId).then(function (data) {
  //       that.runningInstanceList = data;
  //       if (data.length > 0) {
  //         that.currentInstance = data[0];
  //         that.changeInstance();
  //       }
  //     });
  //   }
  // });

  that.startInterval = () => {
    that.getProcessProgress();
    that.progressInterval = $interval(() => {
      that.getProcessProgress()
    }, that.options.refreshInterval * 1000)
  }

  that.currentInstanceId && that.startInterval();


  $scope.$on('$destroy', function () {
    $interval.cancel(that.progressInterval)
  });

  that.paramsChangedFunc = function (paramsFake) {
    
  }

  that.changeInstance = () => {
    if (that.currentInstance)
    {
      that.currentInstanceId = that.currentInstance.processInstanceId;

      if (that.detailId !== that.currentInstance.processDetailId) {
        that.detailId = that.currentInstance.processDetailId;
        that.queryDetail(true);
      }

      if (!that.progressInterval || that.progressInterval.$$state.status === 2)
        that.startInterval()
    }
  }

  that.terminateInstance = () => {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('jao.common.terminate')}),
      $translate.instant('flow.process.terminate_confirm'),
      () => {
        flowService.terminateInstance(that.currentInstanceId).then(function (data) {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.entity.detail.operation')
          }));
          that.queryDetail(true);
          that.isRunning = false;
        })
      },
    )
  }


  that.setViewerStyle = (nodes, marker) => {
    var canvas = that.bpmnViewer.get('canvas');
    var elements = canvas.getRootElement().children;
    if (elements && elements.length > 0 && nodes && nodes.length > 0) { //节点高亮
      nodes.forEach(item => {
        var element = elements.find(f => f.id === item.taskId);
        Object.values(that.markers).forEach(item => {
          canvas.removeMarker(element, item);
        })
        canvas.addMarker(element, marker);

        if (!item.type) return;

        var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute("x", 77);
        t.setAttribute("y", 75);
        t.setAttribute("class", "fa mark-label");

        if (marker === that.markers.completed) {
          t.innerHTML = unescape('%uf058');
        }
        else if (marker === that.markers.active) {
          t.innerHTML = unescape('%uf013');
        }
        else if (marker === that.markers.warning) {
          t.innerHTML = unescape('%uf06a');
        }
        else if (marker === that.markers.error) {
          t.innerHTML = unescape('%uf06a');
        }

        $(canvas.getGraphics(element)).find('.mark-label').remove()
        canvas.getGraphics(element).appendChild(t);

        // const ele = document.querySelector(`.${marker}`).querySelector('.djs-visual rect');
        // if (ele) {
        //   ele.setAttribute('stroke-dasharray', '4,4');
        // }
      });
    }
  }


  that.assignCurrentNode = (e) => {
    if (!that.currentNode) that.currentNode = {};

    if (that.bpmnViewer && that.progressDetail)
    {
      that.setViewerStyle(that.progressDetail.activeTasks, that.markers.active)
      that.setViewerStyle(that.progressDetail.completedTasks, that.markers.completed)
      that.setViewerStyle(that.progressDetail.historyIncidents, that.markers.warning)
      that.setViewerStyle(that.progressDetail.incidents, that.markers.error)
    }

    if (e) {
      that.currentNode.element = e.element;
      if (that.progressDetail) {
        var findInActiveTask = that.progressDetail.activeTasks.find(f => f.taskId === e.element.id);
        that.currentNode.task = findInActiveTask && findInActiveTask || that.progressDetail.allTasks.find(f => f.taskId === e.element.id);
        that.currentNode.state =  that.progressDetail.incidents.find(f => f.taskId === e.element.id) ? 'error' :
                                  that.progressDetail.historyIncidents.find(f => f.taskId === e.element.id) ? 'warning' :
                                  that.progressDetail.activeTasks.find(f => f.taskId === e.element.id) ? 'active' :
                                  that.progressDetail.completedTasks.find(f => f.taskId === e.element.id) ? 'completed' :
                                  that.progressDetail.waitingTasks.find(f => f.taskId === e.element.id) ? 'waiting' :
                                  ''
        that.currentNode.incident = that.progressDetail.incidents.find(f => f.taskId === e.element.id) || 
                                    that.progressDetail.historyIncidents.find(f => f.taskId === e.element.id);
      }
      
      $scope.$digest();
    }
    else if (that.currentNode.element)
    {
      if (that.progressDetail) {
        var findInActiveTask = that.progressDetail.activeTasks.find(f => f.taskId === that.currentNode.element.id);
        that.currentNode.task = findInActiveTask && findInActiveTask || that.progressDetail.allTasks.find(f => f.taskId === that.currentNode.element.id);
        that.currentNode.state =  that.progressDetail.incidents.find(f => f.taskId === that.currentNode.element.id) ? 'error' :
                                  that.progressDetail.historyIncidents.find(f => f.taskId === that.currentNode.element.id) ? 'warning' :
                                  that.progressDetail.activeTasks.find(f => f.taskId === that.currentNode.element.id) ? 'active' :
                                  that.progressDetail.completedTasks.find(f => f.taskId === that.currentNode.element.id) ? 'completed' :
                                  that.progressDetail.waitingTasks.find(f => f.taskId === that.currentNode.element.id) ? 'waiting' :
                                  ''
        that.currentNode.incident = that.progressDetail.incidents.find(f => f.taskId === that.currentNode.element.id)|| 
                                    that.progressDetail.historyIncidents.find(f => f.taskId === that.currentNode.element.id);
      }
    }


    var currentTask = that.currentNode.element && that.paramsArr && that.paramsArr.find(f => f[0] === that.currentNode.element.id);
    currentTask && that.currentNode.task && angular.extend(that.currentNode.task, currentTask[1])
    that.currentNode.params = currentTask && currentTask[1].needParams && currentTask[1].params || {};
  }



  that.bindEvents = function () {
    var eventBus = that.bpmnViewer.get('eventBus');
    var overlays = that.bpmnViewer.get('overlays');
    var canvas = that.bpmnViewer.get('canvas');

    if (!that.currentNode.element) {
      that.currentNode = { element: canvas.getRootElement() }
    }

    eventBus.on('element.hover', (e) => {
      if (e.element.type === "bpmn:UserTask") {
        if (this.nodeDetail[e.element.id]) {
          this.detailInfo = this.nodeDetail[e.element.id];
          //悬浮框不能直接调用,因为这样调用的话popoverEl.innerHTML一直获取的是上一条数据，因为每次在调用这个方法的时候其实popover标签的变量还没有渲染  
          //this.genNodeDetailBox(this.nodeDetail[e.element.id], e, overlays);
          //任何修改data的语句后,页面渲染用setTimeout(function(){console.log(233)},0)就可以了
          setTimeout(() => {
            //console.log("节点类型:" + e.element.type);
            if (e.element.type === "bpmn:UserTask") {
              this.genNodeDetailBox(e, overlays);
            }
          }, 10)
        } else {
          // getOneActivityVoByProcessInstanceIdAndActivityId({
          //   procInstId: "1b6cc49f0bb211ecaf8f0862662f0797",
          //   elementId: e.element.id
          // }).then(res => {
          //this.nodeDetail[e.element.id] = res.data;
          res.data.approver = "1;2";
          // this.detailInfo = res.data;
          // this.genNodeDetailBox(e, overlays);
          setTimeout(() => {
            //console.log("节点类型:" + e.element.type);
            if (e.element.type === "bpmn:UserTask") {
              this.genNodeDetailBox(e, overlays);
            }
          }, 10)
          // });
        }
      }
    });

    eventBus.on('element.out', (e) => {
      overlays.clear();
    });

    eventBus.on('element.click', (e) => {
      that.assignCurrentNode(e);
    })

    eventBus.on('bpmnElement.added', (e) => {
      
    });

  }

  that.jobDetailView = (e) => {
    var page = {
      pageId: '/jao/assets/udp/run-result',
      target: '_dialog',
      size: 'lg',
      params: {
        runId: that.currentNode.task.runId
      }
    }

    widgetInteraction.openPage(page, {}, {
      current: angular.element(e.currentTarget).parents('flow-result-viewer'),
      scope: $scope.$parent.$widget && $scope.$parent.$widget.$pageScope || $scope
    })
  }

  that.processDetailView = () => {
    var modal = $uibModal.open({
      template: `
        <div class="modal-header">
          <h4 class="modal-title"></h4>
          <button type="button" class="btn-close" data-dismiss="modal"  ng-click="$ctrl.cancel()"><span aria-hidden="true"></span></button>
        </div>
        <div class="modal-body" style="padding:0">
          <flow-result-viewer process-id = "'${that.currentNode.task.variables.process.processId}'"
                              detail-id="'${that.currentNode.task.variables.process.processDetailId}'"
                              instance-id="'${that.currentNode.task.subInstanceId}'"
                              options="{inPage: true, viewMode: 'drawer'}"
                              style="height: 100%; width: 100%"></flow-result-viewer>
        </div>
      `,
      backdrop: 'static',
      size: 'lg',
      controllerAs: '$ctrl',
      controller: ['$scope', function ($scope) {
          this.cancel = function () {
              modal.dismiss();
          };
      }],
    })
      
    //   .result.then(function () {
    //   $state.go('^', {}, {
    //     reload: false
    //   });
    // }, function () {
    //   $state.go('^');
    // });


    // var page = {
    //   pageId: '/flow/result/detail',
    //   target: '_dialog',
    //   size: 'lg',
    //   params: {
    //     processId: that.currentNode.task.variables.process.processId,
    //     detailId: that.currentNode.task.variables.process.detailId,
    //     instanceId: that.currentNode.task.subInstanceId,
    //   }
    // }

    // widgetInteraction.openPage(page, {}, {
    //   current: angular.element(e.currentTarget).parents('flow-result-viewer'),
    //   scope: $scope.$parent.$widget && $scope.$parent.$widget.$pageScope || $scope
    // })
  }

  that.retryTask = () => {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('flow.task.retry')}),
      $translate.instant('flow.task.retry_alert'),
      function (res) {
        flowService.retryTask(that.currentInstanceId, that.currentNode.task.externalTaskId, that.currentNode.task.taskId).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.entity.detail.operation')
          }));
          that.getProcessProgress();
        })
      });
  }

  that.completeTask = () => {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.detail.operation')}),
      $translate.instant('flow.task.complete_alert'),
      function (res) {
        flowService.completeTask(that.currentInstanceId, that.currentNode.task.externalTaskId, that.currentNode.task.workerId).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.entity.detail.operation')
          }));
          that.getProcessProgress();
        })
      });
  }

  that.formatDate = $$.formatDate;

  that.back = function () {
    $state.go('app.flow.result_list.table', {processId: that.processId});
  }

  $scope.$on(viewerEvents.emitBpmnViewer, (e, data) => {
    that.bpmnViewer = data;
    that.bindEvents();
    that.assignCurrentNode();
  })

  $scope.$on(viewerEvents.emitProcessAttrs, (e, data) => {
    that.processAttrs = data;
  })

  that.broadcastReRenderAsync = (bpmnXml) => {
    var defer = $q.defer();
    $scope.$broadcast(viewerEvents.broadcastReRender, bpmnXml, defer);
    return defer.promise;
  }

}