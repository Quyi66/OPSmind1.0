/**
 * @ Author: chy
 * @ Create Time: 2022-07-07 10:42:10
 * @ Description:
 */
var Ids = require('ids')['default']

flowProcessListCtrl.$inject = ['$translate', '$uibModal', 'flow.Service', '$state', 'messageService'];
export default function flowProcessListCtrl($translate, $uibModal, flowService, $state, messageService) {
  var that = this;
  
  const modelerTypes = {
    edit: "edit",
    add: "add"
  }

  var columnDefs = [
    // {
    //   data: 'id',
    //   title: $translate.instant('udp.w.layout-flex.config.id'),
    // },
    // {
    //   data: 'processKey',
    //   title: $translate.instant('flow.process.key')
    // },
    {
      data: 'processName',
      title: $translate.instant('flow.process.name')
    },
    {
      data: 'processAbbr',
      title: $translate.instant('flow.process.abbr')
    },
    {
      data: 'remarks',
      title: $translate.instant('gfs.modal.remark')
    },
    {
      data: 'createTime',
      title: $translate.instant('common.attr.created_at'),
      render: function (data) {
        return !isNaN(Date.parse(data)) ? $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss') : '-----';
      }
    },
    {
      title: $translate.instant('gfs.list.history_version'),
      render: function (data, type, row, meta) {
        var html = ''
                +'<button type="button" class="btn btn-outline-primary rounded-pill btn-sm" ng-click="$ctrl.historyVersion(\'' + row.id + '\')" title="{{\'gfs.list.history_version\'|translate}}"><i class="fa fa-eye"></i> {{\'gfs.list.history_version\' | translate}}</button>'
          return html;
      }
    },
    {
      title: $translate.instant('common.action.action'),
      render: function (data, type, row, meta) {
        var html = ''
                + '<button type="button" uaa-has-permission="flow:edit:*" class="btn btn-outline-secondary rounded-pill btn-sm" ng-click="$ctrl.edit(\'' + row.id + '\')" title="{{\'common.action.edit\'|translate}}"><i class="fa fa-edit"></i> {{\'common.action.edit\' | translate}}</button>'
                + '<button type="button" class="btn btn-outline-primary rounded-pill btn-sm ml-1" ng-click="$ctrl.design(\'' + row.id + '\')" title="{{\'flow.process.design\'|translate}}"><i class="fa fa-pencil-ruler"></i> {{\'flow.process.design\' | translate}}</button>'
                + '<button type="button" uaa-has-permission="flow:run:*" class="btn btn-outline-success rounded-pill btn-sm ml-1" ng-click="$ctrl.exec(\'' + row.id + '\')" title="{{\'jao.common.run\'|translate}}"><i class="fa fa-play-circle"></i> {{\'jao.common.run\' | translate}}</button>'
                + '<p style="margin-top:10px;"></p>'
                + '<button type="button" uaa-has-permission="flow:edit:*" class="btn btn-warning rounded-pill btn-sm ml-1" ng-click="$ctrl.clone(\'' + row.id + '\')" title="{{\'flow.process.clone\'|translate}}"><i class="fa fa-clone"></i> {{\'flow.process.clone\' | translate}}</button>'
                // + '<button type="button" uaa-has-permission="flow:edit:*" class="btn btn-primary rounded-pill btn-sm ml-1" ng-click="$ctrl.copy(\'' + row.id + '\')" title="{{\'common.action.copy\'|translate}}"><i class="fa fa-copy"></i> {{\'common.action.copy\' | translate}}</button>'
                + '<button type="button" uaa-has-permission="flow:edit:*" class="btn btn-danger rounded-pill btn-sm ml-1" ng-click="$ctrl.delete(\'' + row.id + '\')" title="{{\'common.action.delete\'|translate}}"><i class="fa fa-trash-alt"></i> {{\'common.action.delete\' | translate}}</button>';
          return html;
      }
    },
  ];

  that.tableConfig = {
    columns: columnDefs,
    data: flowService.fetchProcesses,
    buttons: ['reload'],
    selection: {
      valueData: 'id', labelData: 'processName'
    },
  }


  that.add = function (id) {
    $state.go('app.flow.design', {type: modelerTypes.add});
  }

  that.design = function (id) {
    var row = that.tableConfig.getTableData().find(function (f) { return f.id === id });
    $state.go('app.flow.design', {type: modelerTypes.edit, processId: id, processName: row.processName});
  }

  that.exec = function (id) {
    var row = that.tableConfig.getTableData().find(function (f) { return f.id === id });
    $state.go('app.flow.exec', { processId: id, detailId: row.processDetailId });
  }

  that.edit = function (id) {
    var row = that.tableConfig.getTableData().find(function (f) { return f.id === id });

    var modal = $uibModal.open({
      templateUrl: 'app/modules/flow/widgets/process-edit-dialog/process-edit-dialog.html',
      controller: 'flowProcessEditDialogCtrl',
      controllerAs: '$ctrl',
      backdrop: 'static',
      size: 'md',
      resolve: {
        title: null,
        mode: () => 'process',
        data: () => id && _.cloneDeep(row) || null,
      }
    });
  
    modal.result.then(
      (result) => {
        if (id && row)
          flowService.editProcess(result).then(res => {
            messageService.toast("success", $translate.instant('common.messages.operation.success', {
              operation: $translate.instant('common.entity.action.save')
            }));
            that.tableConfig.reloadData()
          });
    },() => { }
    );
  }

  
  function nextId(prefix) {
    var ids = new Ids([32, 32, 1])
    return ids.nextPrefixed(prefix)
  }

  that.clone = function (id) {
    var row = that.tableConfig.getTableData().find(function (f) { return f.id === id });

    var newProcessId = nextId('Process_');

    var modal = $uibModal.open({
      templateUrl: 'app/modules/flow/widgets/process-edit-dialog/process-edit-dialog.html',
      controller: 'flowProcessEditDialogCtrl',
      controllerAs: '$ctrl',
      backdrop: 'static',
      size: 'md',
      resolve: {
        title: () => 'flow.process.clone',
        mode: () => 'processClone',
        data: () => id && _.cloneDeep(row) || null,
      }
    });
  
    modal.result.then(
      (result) => {
        if (id && row)
          result.processKey = `opflow-${newProcessId.toLowerCase().replace('_', '-')}`;
          flowService.cloneProcess(result).then(res => {
            messageService.toast("success", $translate.instant('common.messages.operation.success', {
              operation: $translate.instant('common.entity.action.save')
            }));
            that.tableConfig.reloadData()
          })
            .catch(err => {
              messageService.toast("error", err._errorData.message);
          });
    },() => { }
    );
  }

  // that.copy = async function (id) {
  //   var row = that.tableConfig.getTableData().find(function (f) { return f.id === id });

  //   var newProcessId = nextId('Process_');

  //   var processNodes = await flowService.fetchProcessNodes(id);

  //   debugger;

  //   return;

  //   var modal = $uibModal.open({
  //     templateUrl: 'app/modules/flow/widgets/process-edit-dialog/process-edit-dialog.html',
  //     controller: 'flowProcessEditDialogCtrl',
  //     controllerAs: '$ctrl',
  //     backdrop: 'static',
  //     size: 'md',
  //     resolve: {
  //       title: () => 'flow.process.clone',
  //       mode: () => 'processClone',
  //       data: () => id && _.cloneDeep(row) || null,
  //     }
  //   });
  
  //   modal.result.then(
  //     (result) => {
  //       if (id && row)
  //         result.processKey = `opflow-${newProcessId.toLowerCase().replace('_', '-')}`;
  //         flowService.cloneProcess(result).then(res => {
  //           messageService.toast("success", $translate.instant('common.messages.operation.success', {
  //             operation: $translate.instant('common.entity.action.save')
  //           }));
  //           that.tableConfig.reloadData()
  //         })
  //           .catch(err => {
  //             messageService.toast("error", err._errorData.message);
  //         });
  //   },() => { }
  //   );
  // }

  that.delete = function (id) {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.action.delete')}),
      $translate.instant('flow.process.delete_alert'),
      res => {
        flowService.deleteProcess(id).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.action.delete')
          }));
          that.tableConfig.reloadData()
        });
      })
  }


  that.deleteBatch = function () {
    if (!that.tableConfig.selectedItems || that.tableConfig.selectedItems.length == 0)
      return;

    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.action.delete')}),
      $translate.instant('flow.process.delete_alert'),
      res => {
        flowService.deleteProcessBatch(that.tableConfig.selectedItems).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.action.delete')
          }));
          that.tableConfig.reloadData()
        });
      })
  }


  that.exportBatch = function () {
    if (!that.tableConfig.selectedItems || that.tableConfig.selectedItems.length == 0)
      return;

    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.action.export')}),
      $translate.instant('udp.w.datatable.export_confirm'),
      res => {
        flowService.exportProcess(that.tableConfig.selectedItems)
      })
  }


  that.historyVersion = function (id) {
    var row = that.tableConfig.getTableData().find(function (f) { return f.id === id });
    $state.go('app.flow.history', { processId: id, processName: row.processName });
  }

}