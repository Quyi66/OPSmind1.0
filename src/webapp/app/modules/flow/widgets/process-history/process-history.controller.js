/**
 * @ Author: chy
 * @ Create Time: 2022-11-28 17:05:57
 * @ Description:  
 */

flowProcessHistoryCtrl.$inject = ['$translate', '$state', '$stateParams', 'messageService', 'flow.Service'];
export default function flowProcessHistoryCtrl($translate, $state, $stateParams, messageService, flowService) {
  var that = this;

  that.processId = $stateParams.processId || that.processId || undefined;
  that.processName = $stateParams.processName || that.processName || undefined;

  var columnDefs = [
    {
      data: 'version',
      title: $translate.instant('app.setting.version'),
      render: function (data, type, row) {
        var html = data;
        if (data === row.currentVersion) html = `<span class="badge badge-success">${data}({{"flow.process.current_version" | translate}})</span>`
        else html = `<span class="badge badge-primary">${data}</span>`
        return html;
      }
    },
    {
      data: 'versionRemarks',
      title: $translate.instant('flow.process.version_remarks'),
      render: function (data) {
        return data || '-----';
      }
    },
    {
      data: 'operator',
      title: $translate.instant('jao.job.detail.operator')
    },
    {
      data: 'createTime',
      title: $translate.instant('common.attr.created_at'),
      render: function (data) {
        return !isNaN(Date.parse(data)) ? $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss') : '-----';
      }
    },
    {
      title: $translate.instant('common.action.action'),
      render: function (data, type, row, meta) {
        var html = ''
          +`<button type="button" uaa-has-permission="flow:edit:*" class="btn btn-outline-success rounded-pill btn-sm" ng-disabled="${row.version === row.currentVersion}" ng-click="$ctrl.changeVersion('${row.processDetailId}', $event)" title="{{\'flow.process.change_version\'|translate}}"><i class="fa fa-edit"></i> {{\'flow.process.change_version\' | translate}}</button>`
          +`<button type="button" class="btn btn-outline-primary rounded-pill btn-sm ml-1" ng-click="$ctrl.design('${row.processDetailId}', $event)" title="{{\'flow.process.design\'|translate}}"><i class="fa fa-pencil-ruler"></i> {{\'flow.process.design\' | translate}}</button>`
          return html;
      }
    },
  ];

  that.fetchData = () => {
    return flowService.fetchProcessVersions(that.processId)
  }

  that.tableConfig = {
    columns: columnDefs,
    data: that.fetchData,
    buttons: ['reload']
  }

  that.changeVersion = function (id) {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.action.action')}),
      $translate.instant('flow.process.change_version_alert'),
      res => {
        flowService.changeVersion({processId: that.processId, detailId: id}).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.action.action')
          }));
          that.tableConfig.reloadData();
        }).catch(err => {
          messageService.alert("Error", $translate.instant(err._errorData.message));
        });
      })
  }

  that.design = function (id) {
    $state.go('app.flow.design', {type: 'edit', processId: that.processId, detailId: id, processName: that.processName});
  }

  that.back = function () {
    window.history.go(-1);
  }
}