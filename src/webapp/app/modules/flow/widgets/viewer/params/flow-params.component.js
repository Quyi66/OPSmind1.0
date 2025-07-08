/**
 * @ Author: chy
 * @ Create Time: 2023-05-28 09:32:04
 * @ Description:  
 */

import paramTypes from '../../../constants/param-type.constants'
import taskType from '../../../constants/task-type.constants'
import viewerEvents from '../../../constants/viewer-events.constants'

flowParamsCtrl.$inject = ['$scope', '$stateParams', '$translate', 'flow.Service', 'messageService'];
export default function flowParamsCtrl($scope, $stateParams, $translate, flowService, messageService) {
  var that = this;

  that.selectedJobs = {};
  that.selectedProcess = {};
  that.isCollapsed = that.needCollapse && true || false;
  that.isEditingParams = that.needEdit && false || true;;
  that.instanceId = that.instanceId || $stateParams.instanceId || undefined;

  that.processId = $stateParams.processId;

  that.paramTypes = paramTypes;
  that.taskType = taskType;

  that.approveArr = `yaml:- [ROLE_ADMIN, 系统管理员]\n- [ROLE_PRIVUSER, 高权用户]\n- [ROLE_APPROVER, 流程审批人员]`

  that.allChecked = false;
  that.editingParamTmp = null;

  $scope.$watch('$ctrl.currentNode', function (n, o) {
    if (!(n && o && n.element && o.element) || n.element.id === o.element.id) return;
    that.isCollapsed = that.needCollapse ? true : false;
    that.isEditingParams = that.needEdit ? false : true;

    n.params = n.params.filter(f => (that.needEdit ? 'RUNNING' : 'EXEC') === f.step);

    angular.element('flow-params .operation udp-input input, flow-params .operation udp-input textarea').attr('disabled', !that.isEditingParams)
    o && o.task && that.editingParamTmp && (that.params[o.task.taskId] = that.editingParamTmp);
    that.editingParamTmp = undefined;
  }, true);

  $scope.$watch('$ctrl.params', function (n, o) { 
    if (!n) return;
    that.paramsFake = _.cloneDeep(n);

    if (that.paramsArr && that.paramsFake && that.paramsArr.length !== Object.entries(that.paramsFake).length) {
      that.paramsArr.filter(f => Object.keys(that.paramsFake).indexOf(f[0]) === -1).forEach(item => {
        that.paramsFake[item[0]] = {
          type: item[1].taskType
        }
      })
    }

    Object.entries(that.paramsFake).forEach(entry => {
      var item = entry[1];
      var currentParam = that.paramsArr.find(f => f[0] === entry[0]);
      if (!currentParam) {
        delete that.params[entry[0]];
        delete that.paramsFake[entry[0]];
        return;
      }
      var paramOption = that.paramsArr.find(f => f[0] === entry[0])[1];

      if (!paramOption.needParams) {
        item.checked = true;
        return;
      }

      if (item.type === that.taskType.JobTask) {
        if (!item.jobId && that.selectedJobs[entry[0]]) return;
        // 2024-05-11 23:32:05 【ID1000125】【Oplus】流程管理的输入参数可以为空
        // if (item.jobId && item.params && Object.values(item.params).every(e => {
        //   return e instanceof Array ? e.length > 0 : e;
        // })) item.checked = true;
        // else item.checked = false;
        item.checked = true;
      }
      else if (item.type === that.taskType.SubProcessTask) {
        if (!item.processId && that.selectedProcess[entry[0]]) return;
        if (item.processId && item.sceneId && item.sceneParams) item.checked = true;
        else item.checked = false;
      }
      else
      {
        for (var idx in paramOption.params) {
          var param = paramOption.params[idx];
          if (param.required && !item[param.name]) {
            item.checked = false;
            return;
          }
          else if (param.required && param.type === that.paramTypes.HOST && item[param.name].length === 0)
          {
            item.checked = false;
            return;
          }
          else item.checked = true;
        }
      }
    })

    that.paramsChanged && that.paramsChanged({paramsFake: that.paramsFake});
  }, true);

  $scope.$watch('$ctrl.selectedJobs', (n, o) => {
    if (!n) return;
    Object.entries(n).forEach(entry => {
      if (that.params[entry[0]] && entry[1])
        that.params[entry[0]].jobName = entry[1].title;
    })
  }, true);

  $scope.$watch('$ctrl.selectedProcess', (n, o) => {
    if (!n) return;

    Object.entries(n).forEach(entry => {
      if (that.params[entry[0]] && entry[1]) {
        that.params[entry[0]].processName = entry[1].processName;
        that.params[entry[0]].processDetailId = entry[1].processDetailId;
      }
    })
  }, true);

  that.fetchParams = async (processId) => {
    var data = await flowService.fetchProcessParams(processId);
    return Object.entries(data.paramsMap);
  }

  $scope.$watch('$ctrl.selectedScene', (n, o) => {
    if (!n) return;

    Object.entries(n).forEach(async entry => {
      if (that.params[entry[0]] && that.params[entry[0]].sceneId && entry[1]) {
        that.params[entry[0]].paramsArr = await that.fetchParams(that.params[entry[0]].processId);
        $scope.$emit(viewerEvents.buildExecParams, that.params[entry[0]].paramsArr, angular.fromJson(entry[1].value), (data) => {
          that.params[entry[0]].sceneParams = data;
        });
      }
    })
  }, true);


  that.editParam = () => {
    that.isEditingParams = !that.isEditingParams;
    angular.element('flow-params .operation udp-input input, flow-params .operation udp-input textarea').attr('disabled', false);
    that.editingParamTmp = _.cloneDeep(that.params[that.currentNode.task.taskId]);
  }


  that.cancelEditParam = () => {
    that.isEditingParams = !that.isEditingParams;
    angular.element('flow-params .operation udp-input input, flow-params .operation udp-input textarea').attr('disabled', true);
    that.params[that.currentNode.task.taskId] = that.editingParamTmp;
    that.editingParamTmp = undefined;
  }

  that.saveParam = () => {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.action.save')}),
      $translate.instant('flow.variable.save_alert'),
      function (res) {
        flowService.modifyRunningVariable({
          instanceId: that.instanceId,
          taskId: that.currentNode.task.taskId,
          variable: that.buildExecParams()
        }).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.action.save')
          }));

          that.isEditingParams = !that.isEditingParams;
          angular.element('flow-params .operation udp-input input, flow-params .operation udp-input textarea').attr('disabled', true);
          that.editingParamTmp = undefined;
        }).catch(err => {
          messageService.toast("error", $translate.instant('common.messages.operation.failed', {
            operation: $translate.instant('common.action.save')
          }));
        })
      });
  }

  that.buildExecParams = function () {
    var execParam = {};
    var currentParamDefined = that.paramsArr.find(f => f[0] === that.currentNode.task.taskId);
    if (!currentParamDefined) return;

    var type = currentParamDefined[1].taskType;
    var neededParams = currentParamDefined[1].params;
    var inputParam = that.params[currentParamDefined[0]];

    neededParams.forEach(param => {
      if (param.type === this.paramTypes.JOB)
        execParam[param.name] = {
          jobId: inputParam.jobId,
          jobName: inputParam.jobName
        };
      else if (param.type === this.paramTypes.JSON)
        execParam[param.name] = angular.toJson(inputParam.params);
      else if (param.type === this.paramTypes.HOST)
        execParam[param.name] = angular.toJson(inputParam[param.name]);
      else if (param.type === this.paramTypes.PROCESS)
        execParam[param.name] = {
          processId: inputParam.processId,
          processName: inputParam.processName,
          processDetailId: inputParam.processDetailId,
          sceneParams: inputParam.sceneParams,
        };
      else
        execParam[param.name] = inputParam[param.name];
    })
    
    return execParam;
  }
}