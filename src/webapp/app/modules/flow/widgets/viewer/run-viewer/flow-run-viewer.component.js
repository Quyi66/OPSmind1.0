/**
 * @ Author: chy
 * @ Create Time: 2023-04-13 17:34:25
 * @ Description:  
 */

import paramTypes from '../../../constants/param-type.constants'
import taskType from '../../../constants/task-type.constants'
import viewerEvents from '../../../constants/viewer-events.constants'

angular.module('oplus.commons').run(['customFunctions', 'flow.Service', function (cf, flowService) {
  cf.defineFunction('execProcess', {
    func: async function (processId, remarks, params) {
      var data = await flowService.fetchProcessParams(processId);

      return flowService.execProcess({
        id: processId,
        remarks: remarks || '',
        params: flowService.buildExecParams(Object.entries(data.paramsMap), params)
      });

    },
    group: 'data',
    sample: ''
  });
}]);

flowRunViewerCtrl.$inject = ['$scope', '$translate', 'flow.Service', '$state', '$q', 'messageService', '$uibModal', 'widgetInteraction', '$timeout'];
export default function flowRunViewerCtrl($scope, $translate, flowService, $state, $q, messageService, $uibModal, widgetInteraction, $timeout) {
  var that = this;

  that.sceneMode = {
    add: 'add',
    edit: 'edit'
  }

  that.markers = {
    checked: 'checked',
    error: 'error'
  }

  that.paramTypes = paramTypes;

  that.taskType = taskType;

  that.options = that.options || {}
  that.currentNode = {}
  that.params = {}
  that.sceneList = []
  that.paramsChanged = false;
  that.processAttrs = that.currentScene = undefined;

  if (that.options.inPage) {
    that.processId = $scope.$parent.$widget.$pageScope.pageParams.processId || that.processId || undefined;
  }

  that.allChecked = false;

  that.paramsChangedFunc = function (paramsFake) {
    that.setViewerMarkers(paramsFake);
    that.allChecked = that.paramsArr &&
                      that.paramsArr.length > 0 && 
                      Object.values(paramsFake).length === that.paramsArr.length &&
                      Object.values(paramsFake).every(e => e.checked);
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

  that.queryDetail();

  that.fetchParams = (processId, fetchScene) => { 
    flowService.fetchProcessParams(processId).then(function (data) {
      that.params = Object.fromEntries(Object.keys(data.paramsMap).map(m => [m, {
        type: data.paramsMap[m].taskType
      }]))
      that.paramsArr = Object.entries(data.paramsMap);

      if (fetchScene) {
        flowService.fetchScenes(that.processId).then(function (data) {
          that.sceneList = data;
          if (that.sceneList.some(s => s.isDefault)) {
            that.currentScene = that.sceneList.find(f => f.isDefault);
            that.changeScene();
          }
        });
      }
    });
  }

  that.fetchParams(that.processId, true);

  that.queryRunningRunDetails = () => {
    var defer = $q.defer();
    flowService.fetchRunningRunDetails(that.processId)
      .then(function (data) {
        defer.resolve(data);
      })
      .catch(err => {
        defer.reject(err);
      });
  }

  that.execProcess = async (e) => {
    //console.log(flowService.buildExecParams(that.paramsArr, that.params))

    if (that.processAttrs['singleton'] === 'true') {
      var runningRunDetailsList = await that.queryRunningRunDetails();
      if (runningRunDetailsList && runningRunDetailsList.length > 0) {
        messageService.alert($translate.instant('flow.process.singleton_alert'))
        return;
      }
    }

    var modal = $uibModal.open({
      templateUrl: 'app/modules/flow/widgets/process-edit-dialog/process-edit-dialog.html',
      controller: 'flowProcessEditDialogCtrl',
      controllerAs: '$ctrl',
      backdrop: 'static',
      size: 'md',
      resolve: {
        title: () => 'jao.common.run',
        mode: () => 'runDetail',
        data: () => {},
      }
    });
    
    modal.result.then(
      (result) => {
        flowService.execProcess({
          id: that.processId,
          remarks: result && result.remark || '',
          params: flowService.buildExecParams(that.paramsArr, that.params)
        }).then(function (res) {
          messageService.alert($translate.instant('common.messages.operation.success'),
            $translate.instant('common.messages.operation.success', {
              operation: $translate.instant('jao.common.run')
            }),
            () => {
              if (!that.options.inPage) {
                $state.go('app.flow.result_detail', {
                  processId: that.processId,
                  instanceId: res,
                  detailId: that.detailId
                })
              } else if (that.options.runLanding && that.options.runLanding.pageId) {

                that.options.runLanding['params'] = angular.toJson(angular.extend(that.options.runLanding['params'] && angular.fromJson(that.options.runLanding['params']) || {}, {
                  processId: that.processId,
                  detailId: row.detailId,
                  instanceId: res,
                }))

                widgetInteraction.openPage(that.options.runLanding, {}, {
                  current: angular.element(e.currentTarget).parents('flow-run-viewer'),
                  scope: $scope.$parent.$widget.$pageScope
                })
              }
            });
        }).catch(err => {
          messageService.alert("Error", $translate.instant(err._errorData));
        })
      }, () => {}
    );
  }

  that.saveScene = (mode) => {
    var modal = $uibModal.open({
      templateUrl: 'app/modules/flow/widgets/scene-edit-dialog/scene-edit-dialog.html',
      controller: 'flowSceneEditDialogCtrl',
      controllerAs: '$ctrl',
      backdrop: 'static',
      size: 'sm',
      resolve: {
        mode: () => mode,
        scene: () => mode === that.sceneMode.add ? {} : (_.cloneDeep(that.currentScene) || {}),
        allChecked: () => that.allChecked,
      }
    });

    modal.result.then(
      (result) => {
        if (mode === that.sceneMode.add) {
          var newScene = {
            processDetailId: that.processDetail.id,
            name: result.name,
            value: angular.toJson(that.params),
            isDefault: result.isDefault
          }

          flowService.createScene(newScene).then(res => {
            messageService.toast("success", $translate.instant('common.messages.operation.success', {
              operation: $translate.instant('common.entity.action.save')
            }));
            newScene.id = res;
            that.sceneList.unshift(newScene);
            that.currentScene = newScene;
          }).catch(err => {
            messageService.alert('error', $translate.instant(angular.fromJson(err.message).message));
          });
        }
        else {
          if (result.needCover) {
            result.value = result.needCover ? angular.toJson(that.params) : result.value
          }

          flowService.editScene(result).then(res => {
            messageService.toast("success", $translate.instant('common.messages.operation.success', {
              operation: $translate.instant('common.entity.action.save')
            }));
            var thisScene = that.sceneList.find(f => f.id === result.id);
            thisScene && (thisScene.name = result.name);
            that.currentScene = result;
          }).catch(err => {
            messageService.alert('error', $translate.instant(err._errorData.message));
          });
        }
        
      }, () => {}
    );
  }

  that.changeScene = () => {
    if (that.currentScene && that.currentScene.value) {
      that.params = angular.fromJson(that.currentScene.value);
    }
  }

  that.deleteScene = () => {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.action.delete')}),
      $translate.instant('flow.scene.delete_alert'),
      function (res) {
        flowService.deleteScene(that.currentScene.id).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.action.delete')
          }));
          _.remove(that.sceneList, v => v.id === that.currentScene.id)
          that.currentScene = that.sceneList.length > 0 && that.sceneList[0] || undefined;
          that.changeScene();
        })
      }
    );
  }

  that.setViewerMarkers = (paramsFake) => {
    if (that.bpmnViewer) {
      var checkedArr = Object.entries(paramsFake).map(m => [that.paramsArr.find(f => f[0] === m[0])[1].taskId, m[1].checked])
      that.setViewerStyle(checkedArr.filter(f => f[1]).map(m => m[0]), that.markers.checked)
      that.setViewerStyle(checkedArr.filter(f => !f[1]).map(m => m[0]), that.markers.error)
    }
  }

  that.setViewerStyle = (nodes, marker) => {
    var canvas = that.bpmnViewer.get('canvas');
    var elements = canvas.getRootElement().children;
    if (elements && elements.length > 0 && nodes && nodes.length > 0) { //节点高亮
      nodes.forEach(item => {
        var element = elements.find(f => f.id === item);
        Object.values(that.markers).forEach(item => {
          canvas.removeMarker(element, item);
        })
        canvas.addMarker(element, marker);

        var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute("x", 77);
        t.setAttribute("y", 75);
        t.setAttribute("class", "fa mark-label");

        if (marker === that.markers.checked) {
          t.innerHTML = unescape('%uf058');
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
    var beforeNode = undefined;
    if (!that.currentNode) that.currentNode = {};
    else beforeNode = _.cloneDeep(that.currentNode);

    if (e) {
      that.currentNode.element = e.element;
    }

    var currentTask = that.currentNode.element && that.paramsArr.find(f => f[0] === that.currentNode.element.id);
    that.currentNode.task = currentTask && currentTask[1] || {};
    that.currentNode.params = currentTask && currentTask[1].needParams ? currentTask[1].params : {};
    
    if (beforeNode && currentTask && that.params[currentTask[0]] && that.params[currentTask[0]]['type'] === taskType.JobTask) {
      var beforeTask = beforeNode.element && that.paramsArr.find(f => f[0] === beforeNode.element.id);
      if (beforeTask) {
        var jobId = that.params[currentTask[0]]['jobId'];
        var beforeJobId = that.params[beforeTask[0]]['jobId'];

        if (jobId === beforeJobId) {
          that.params[currentTask[0]]['jobId'] = '';
          $timeout(() => {
            that.params[currentTask[0]]['jobId'] = jobId;
          }, 10)
        }
      }
    }
    // $scope.$digest();
  }



  that.bindEvents = function () {
    var eventBus = that.bpmnViewer.get('eventBus');
    var overlays = that.bpmnViewer.get('overlays');
    var canvas = that.bpmnViewer.get('canvas');

    if (!that.currentNode.element) {
      that.currentNode = { element: canvas.getRootElement() }
    }
    
    // that.setViewerMarkers(that.params);

    eventBus.on('element.hover', (e) => {
      if (e.element.type === "bpmn:UserTask") {
        if (this.nodeDetail[e.element.id]) {
          this.detailInfo = this.nodeDetail[e.element.id];
          //悬浮框不能直接调用,因为这样调用的话popoverEl.innerHTML一直获取的是上一条数据，因为每次在调用这个方法的时候其实popover标签的变量还没有渲染  
          //this.genNodeDetailBox(this.nodeDetail[e.element.id], e, overlays);
          //任何修改data的语句后,页面渲染用setTimeout(function(){console.log(233)},0)就可以了
          setTimeout(() => {
            console.log("节点类型:" + e.element.type);
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
            console.log("节点类型:" + e.element.type);
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


  that.back = function () {
    $state.go('app.flow.list');
  }

  $scope.$on(viewerEvents.emitBpmnViewer, (e, data) => {
    that.bpmnViewer = data;
    that.bindEvents();
  })

  $scope.$on(viewerEvents.emitProcessAttrs, (e, data) => {
    that.processAttrs = data;
  })

  $scope.$on(viewerEvents.buildExecParams, (e, paramsArr, params, callback) => {
    callback(flowService.buildExecParams(paramsArr, params))
  })

  that.broadcastReRenderAsync = (bpmnXml) => {
    var defer = $q.defer();
    $scope.$broadcast(viewerEvents.broadcastReRender, bpmnXml, defer);
    return defer.promise;
  }

}