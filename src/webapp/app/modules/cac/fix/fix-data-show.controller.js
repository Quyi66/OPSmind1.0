/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').controller('FixDataShowController', FixDataShowController);

    FixDataShowController.$inject = ['$scope', '$state', 'messageService','CacFixLogService','$translate','fix','$uibModalInstance'];

    function FixDataShowController($scope, $state, messageService,CacFixLogService,$translate,fix,$uibModalInstance) {
        var that = this;
        that.fixLogId=fix.fixLogId;

        init();
        this.cancel = cancel;

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
           var tableColumns = [
               {mData: 'hostKey', title: $translate.instant('cac.common.host')},
               {
                   mData: 'fixName',
                   title: $translate.instant('cac3.table_fields.repairItemName'),
                   render: function (data, type, row, meta) {
                       var checkItem = '';
                       if (row.fixName != null) {
                           checkItem = row.fixName;
                       }
                       var actionHtml = '<span title = "' + checkItem + '">' + checkItem + '</span>';
                       return actionHtml;
                   }

               },
               {
                   mData: 'status', title: $translate.instant('cac.common.result'),
                   render: function (data, type, row, meta) {
                       if (row.status == 'OK') {
                           var actionHtml = '<span class="badge bg-success">' + $translate.instant('cac.result.audit_result.pass') + '</span>';
                       } else if (row.status == 'FAILED') {
                           var actionHtml = '<span class="badge bg-danger">' + $translate.instant('cac.result.audit_result.failed') + '</span>';
                       } else {
                           var actionHtml = '<span class="label cac-bg-light-grey">' + $translate.instant('common.messages.no_data') + '</span>';
                       }
                       return actionHtml;
                   }
               },
               {mData: 'output', title: $translate.instant('cac.result.output')},
            ];

            that.tableConfig = {
                data: [getPromise],
                columns: tableColumns,
                order: [[0, 'desc']],
                buttons: ['reload']
            }

            function getPromise() {
               return CacFixLogService.getByFixLogIdAllData(that.fixLogId);
            }
        }
    }
})();
