/**
 * @ Author: chy
 * @ Create Time: 2022-07-08 10:48:59
 * @ Description:  
 */

flowProcessDesignCtrl.$inject = ['$scope', '$translate', 'flow.Service', '$state', '$stateParams', 'messageService', '$uibModal'];
export default function flowProcessDesignCtrl($scope, $translate, flowService, $state, $stateParams, messageService, $uibModal) {
  var that = this;

  const modelerTypes = {
      edit: "edit",
      add: "add"
  }


  that.options = that.options || {
    inPage: false
  }
  

  if (that.options.inPage) {
    that.type = $scope.$parent.$widget.$pageScope.pageParams.designType || that.options.designType || modelerTypes.edit;
    that.processId = $scope.$parent.$widget.$pageScope.pageParams.processId || that.processId || undefined;
    that.detailId = $scope.$parent.$widget.$pageScope.pageParams.detailId || that.detailId || undefined;
    that.process = $scope.$parent.$widget.$pageScope.pageParams.process || that.options.process || undefined;
    that.process = that.process && angular.fromJson(that.process);
    that.processName = that.process.processName || '';
  }
  else {
    that.type = $stateParams.type || modelerTypes.edit;
    that.processId = $stateParams.processId || that.processId || undefined;
    that.detailId = $stateParams.detailId || undefined;
    that.processName = $stateParams.processName || undefined;
  }
  

  that.tabs = [
    { name: 'modeler', title: 'Modeler' },
    { name: 'xml' ,title: 'Bpmn Xml' }
  ];

  that.activeTab = that.tabs[0].name;

  (async function init() {
    that.processDetail = await flowService.fetchProcessDetail(that.processId, that.detailId);
    if ((!that.process || !that.process.id) && !!that.processId)
      that.process = await flowService.fetchProcess(that.processId)
  }());

  that.$initWatch = $scope.$watch('$ctrl.bpmnModeler', function (n, o) {
      if (n) {
        that.linting = that.bpmnModeler.get('linting');
        $scope.$watch('$ctrl.linting._issues', function (n, o) {
          that.hasError = (n && Object.values(n).flatMap(fm => fm).some(s => s.category === 'error'))
        })
        that.$initWatch(); //Deregister
      }
  })

  that.changeTabs = function (tab) {
    $scope.$broadcast('refreshBpmnXml.opflow'); 
    that.activeTab = tab;
  }

  $scope.$on('saveProcessDetail.opflow', function (event, xml, processId) {
    if (that.type === modelerTypes.edit)
    {
      var modal = that.openEditDialog('processDetail', that.processDetail);

      modal.result.then(
        (result) => {
          flowService.editProcessDetail({
            id: that.processDetail.id,
            processXml: xml,
            remarks: result && result.remark || '',
            copyScenes: result && result.copyScenes || false,
          }).then(function (res) {
            messageService.toast("success", $translate.instant('common.messages.operation.success', {
              operation: $translate.instant('common.entity.action.save')
            }));
          }).catch(err => {
            messageService.alert("Error", $translate.instant(err._errorData.message));
          })
        }, () => {}
      );

      
    }
    else if (that.type === modelerTypes.add)
    {
      var modal = that.openEditDialog('process', {
        processKey: `opflow-${processId.toLowerCase().replace('_', '-')}`
      });

      modal.result.then(
        (result) => {
          result.bpmnXml = xml;
          flowService.createProcess(result).then(res => {
            messageService.toast("success", $translate.instant('common.messages.operation.success', {
              operation: $translate.instant('common.entity.action.save')
            }));
            that.back();
          });
        }, () => {}
      );
    }
  })

  that.edit = () => {
    var modal = that.openEditDialog('process', that.process);

    modal.result.then(
      (result) => {
        flowService.editProcess(result).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.entity.action.save')
          }));
          that.process = result;
        });
      }, () => {}
    );
  }

  that.openEditDialog = (mode, data) => {
    return $uibModal.open({
      templateUrl: 'app/modules/flow/widgets/process-edit-dialog/process-edit-dialog.html',
      controller: 'flowProcessEditDialogCtrl',
      controllerAs: '$ctrl',
      backdrop: 'static',
      size: 'md',
      resolve: {
        title: () => 'common.entity.action.edit',
        mode: () => mode,
        data: () => data,
      }
    });
  }

  that.save = function () {
    $scope.$broadcast('refreshBpmnXml.opflow', function (xml, processId) {
      $scope.$emit('saveProcessDetail.opflow', xml, processId);
    });
  }

  that.back = function () {
    window.history.go(-1);
  }

}