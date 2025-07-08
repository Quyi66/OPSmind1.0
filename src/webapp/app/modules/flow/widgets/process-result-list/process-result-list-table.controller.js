/**
 * @ Author: chy
 * @ Create Time: 2022-07-07 10:42:10
 * @ Description:
 */

import { escape } from "lodash";

flowProcessResultListTableCtrl.$inject = ['$scope', '$translate', '$stateParams', 'flow.Service', '$state', '$uibModal', 'widgetInteraction', 'messageService', '$compile'];
export default function flowProcessResultListTableCtrl($scope, $translate, $stateParams, flowService, $state, $uibModal, widgetInteraction, messageService, $compile) {
  var that = this;

  that.options = that.options || $stateParams.options || {
    inPage: false
  }

  that.processId = $stateParams.processId || that.processId || undefined;

  var columnDefs = [
    {
      data: 'versionRemarks',
      title: $translate.instant('flow.process.version_remarks'),
      render: function (data) {
        return data || '-----';
      }
    },
    {
      data: 'runRemarks',
      title: $translate.instant('flow.result.run_remark'),
      render: function (data) {
        return data || '-----';
      }
    },
    {
      data: 'operator',
      title: $translate.instant('jao.job.detail.operator')
    },
    {
      data: 'startTime',
      title: $translate.instant('common.entity.detail.start_at'),
      render: function (data) {
        return !isNaN(Date.parse(data)) ? $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss') : '-----';
      }
    },
    {
      data: 'endTime',
      title: $translate.instant('common.entity.detail.end_at'),
      render: function (data) {
        return !isNaN(Date.parse(data)) ? $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss') : '-----';
      }
    },
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
      data: 'runStatus',
      title: $translate.instant('common.entity.detail.status'),
      render: function (data, type, row) {
        var html = data;
        if (data === 1) {
          if (row.incidents && row.incidents.length > 0)
            html = `<span class="badge badge-danger op-cursor-hand pop">{{"app_vcm.entity.status.red" | translate}}</span>`
          else
            html = '<span class="badge badge-primary">{{"jao.status.job.running" | translate}}</span>'
        }
        else if (data === 2) html = '<span class="badge badge-danger">{{"jao.status.job.failed" | translate}}</span>'
        else if (data === 3) html = '<span class="badge badge-success">{{"common.term.completed" | translate}}</span>'
        else if (data === 4) html = '<span class="badge badge-secondary">{{"common.entity.action.cancel" | translate}}</span>'
        return html;
      },
      createdCell: function (nTd, data, row) {
        $compile(nTd)($scope);

        if (data === 1) {
          var popoverTriggerList = [].slice.call(nTd.querySelectorAll('span.pop'))
          that.popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            var incident = row.incidents[0];
            return new bootstrap.Popover(popoverTriggerEl, {
              html: true,
              placement: 'auto',
              content: `
                <p>${incident.taskName}</p>
                <p>${escape(incident.message)}</p>
                <p>${$$.formatDate(incident.timestamp, 'YYYY-MM-DD HH:mm:ss')}</p>`
            })
          })
        }
      }

    },
    {
      title: $translate.instant('common.action.action'),
      render: function (data, type, row, meta) {
        var html = '<button type="button" class="btn btn-outline-success rounded-pill btn-sm" ng-click="$ctrl.detail(\'' + row.id + '\', $event)" title="{{\'common.action.view\'|translate}}"><i class="fa fa-eye"></i> {{\'common.action.view\' | translate}}</button>';

        if (that.options.customBtns && that.options.customBtns.length > 0) {
          that.options.customBtns.forEach(btn => {
            html += ` 
              <button type="button" 
                      class="btn btn-outline-${btn.color} rounded-pill btn-sm" 
                      ng-click="$ctrl.customBtn('${angular.toJson(btn.interaction).replace(/[\']/g, '\\\'').replace(/[\"]/g, '&quot;')}', '${row.id}', $event)" 
                      title="${btn.label}">
                <i class="fa ${btn.icon}"></i> ${btn.label}
              </button>
                      `;
          })

        }

        if (row.runStatus !== 1)
          html += '<button type="button" uaa-has-permission="flow:edit:*" class="btn btn-outline-danger rounded-pill btn-sm ml-2" ng-click="$ctrl.delete(\'' + row.id + '\', $event)" title="{{\'common.action.delete\'|translate}}"><i class="fa fa-trash-alt"></i> {{\'common.action.delete\' | translate}}</button>';

        return html;
      }
    },
  ];

  that.fetchData = () => {
    return flowService.fetchRunDetails(that.processId)
  }

  that.tableConfig = {
    columns: columnDefs,
    data: that.fetchData,
    buttons: ['reload'],
    selection: {
      valueData: 'id', labelData: 'startTime'
    },
  }

  $scope.$watch('$ctrl.tableConfig.getTableData()', function (n, o) {
    that.hasRunningInstance = n && n.some(e => e.runStatus === 1);
  }, true);

  that.detail = function (id, e) {
    var row = that.tableConfig.getTableData().find(function (f) { return f.id === id });

    if (that.options.viewBtn && that.options.viewBtn['pageId']) {
      var current = angular.element(e.currentTarget).parents('process-result-list-table').length > 0 ? 
                      angular.element(e.currentTarget).parents('process-result-list-table') :
                      angular.element(e.currentTarget).parents('process-result-list')
                      
      that.options.viewBtn['params'] = angular.toJson(angular.extend(that.options.viewBtn['params'] && angular.fromJson(that.options.viewBtn['params']) || {}, {
        processId: that.processId,
        detailId: row.processDetailId,
        instanceId: row.processInstanceId,
      }))

      var widget = findWidget($scope);
      widgetInteraction.openPage(that.options.viewBtn, {}, {
        current: current,
        scope: widget.$pageScope,
      })
    }
    else if (that.options.inPage) {
      $uibModal.open({
        template: `
          <div class="modal-header">
              <p class="modal-title"></p>
              <button type="button" class="btn btn-default op-close-window opx-btn-flat opx-btn-icon" 
                      data-dismiss="modal" ng-click="$ctrl.close()">
                <i class="far fa-times"></i>
              </button>
          </div>
          <div class="modal-body">
              <flow-result-viewer 
                class="in-page"
                options="{inPage: true, viewMode: 'fixed'}"
                process-id="'${that.processId}'" 
                detail-id="'${row.processDetailId}'" 
                instance-id="'${row.processInstanceId}'">
            </flow-result-viewer>
          </div>
        `,
        controller: ['$uibModalInstance', function ($uibModalInstance) {
          this.close = () => { $uibModalInstance.close() }
        }],
        controllerAs: '$ctrl',
        backdrop: 'static',
        size: 'xl'
      });
    }
    else {
      $state.go('app.flow.result_detail', {
        processId: that.processId,
        instanceId: row.processInstanceId,
        detailId: row.processDetailId
      });
    }
  }


  that.delete = function (id, e) {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.action.delete')}),
      $translate.instant('flow.run_detail.delete_alert'),
      res => {
        flowService.deleteRunDetail(id).then(res => {
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
      $translate.instant('flow.run_detail.delete_alert'),
      res => {
        flowService.deleteRunDetailBatch(that.tableConfig.selectedItems).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('common.action.delete')
          }));
          that.tableConfig.reloadData()
        });
      })
  }

  that.terminateProcess = function () {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('jao.common.terminate')}),
      $translate.instant('flow.process.terminate_all_confirm'),
      res => {
        flowService.terminateProcess(that.processId).then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('jao.common.terminate')
          }));
          that.tableConfig.reloadData()
        });
      })
  }

  $scope.$on('refreshRunDetailList.opflow', function ($e) {
    that.tableConfig.reloadData();
  })

  that.customBtn = (interaction, id, e) => {
    interaction = angular.fromJson(interaction)
    if (!interaction || !interaction.actions || interaction.actions.length === 0) return;

    var row = that.tableConfig.getTableData().find(function (f) { return f.id === id });

    if (interaction.actions.indexOf('page') >= 0) {
      interaction.page['params'] = angular.toJson(angular.extend(interaction.page['params'] && angular.fromJson(interaction.page['params']) || {}, {
        processId: that.processId,
        detailId: row.processDetailId,
        instanceId: row.processInstanceId,
      }))
    }

    var current = angular.element(e.currentTarget).parents('process-result-list-table').length > 0 ? 
                    angular.element(e.currentTarget).parents('process-result-list-table') :
                    angular.element(e.currentTarget).parents('process-result-list')

    var widget = findWidget($scope);
    
    widgetInteraction.handleInteraction(
      widget.$pageScope,
      interaction,
      widget.$pageScope.pageParams,
      { element: current }
    )
  }

  function findWidget(scope) {
    if (scope.$widget) return scope.$widget;
    else return findWidget(scope.$parent);
  }

  $scope.$on('$destroy', function () {
    clearPopover();
  });


  function clearPopover() {
    var popover = bootstrap.Popover.getInstance('.popover');

    while (popover != null) {
      popover.dispose();
      popover = bootstrap.Popover.getInstance('.popover');
    }
  }

}