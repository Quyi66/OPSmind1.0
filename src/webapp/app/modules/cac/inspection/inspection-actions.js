(function () {
    'use strict';

    angular.module('oplus.cac').service('inspectionActions', inspectionActions);

    inspectionActions.$inject = ['$uibModal','CacInspectionService','$timeout','$translate'];


    function inspectionActions($uibModal,CacInspectionService,$timeout,$translate) {

        this.openInspectionSelector = openInspectionSelector;

        function openInspectionSelector(preselected, callback) {
            var instance = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<h3 class="modal-title">{{ \'task_scheduling.operating_param\' | translate}}</h3>' +
                    '<a type="button" class="btn-close" style="margin: 10px;float: right;" data-dismiss="modal" ng-click="$ctrl.cancel()"></a>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="op-smartform form-vertical op-bold-label col-sm-12 ms-1">' +
                    '<opx-datatable table-config="$ctrl.tableConfig">' +
                    '<i class="fa fa-list-alt"></i> <span>{{\'cac3.navigation.patrol_item_list\' | translate}}</span>' +
                    '</opx-datatable>' +
                    '</div>' +
                    '<div class="modal-footer text-right">' +
                    '<button type="submit" class="btn btn-primary opx-btn-ok" ng-click="$ctrl.confirm()">{{\'common.entity.action.confirm\' | translate}}</button>' +
                    '<button type="reset" class="btn btn-default opx-btn-cancel" ng-click="$ctrl.cancel()">{{\'common.entity.action.cancel\' | translate}}</button>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope','$uibModalInstance',function ($scope,$uibModalInstance) {
                    var that = this;

                    that.threeCheckItemIds = angular.copy(preselected);

                    that.cancel =function() {
                        instance.dismiss();
                    }

                    that.confirm = function () {
                        instance.close(that.threeCheckItemIds);
                    }

                    //巡检项
                    $timeout(function () {
                        var tableColumns = [
                            {data: 'name',title: $translate.instant('cac3.table_fields.patrol_item_name')},
                            {data: 'description',title: $translate.instant('cac3.table_fields.patrol_item_description')},
                            {
                                data: 'checkScriptPath', title: $translate.instant('cac3.table_fields.check_script_name'),
                                render: function (data, type, row, meta) {
                                    return row.checkScriptPath.split('/').pop().toLowerCase();
                                }

                            },
                            {
                                data: 'fixScriptPath', title: $translate.instant('cac3.table_fields.fix_script_name'),
                                render: function (data, type, row, meta) {
                                    if (null === row.fixScriptPath || "" === row.fixScriptPath) {
                                        return;
                                    }
                                    return row.fixScriptPath.split('/').pop().toLowerCase();
                                }
                            },
                        ];

                        that.tableConfig = {
                            data: [getPromise],
                            columns: tableColumns,
                            order: [[0, 'desc']],
                            buttons: ['reload'],
                            selection: {
                                valueData: 'id', labelData: 'name', preselected: that.threeCheckItemIds, stateFn: function (row) {
                                    return;
                                }
                            },
                        }

                        function getPromise() {
                            return CacInspectionService.getAllInspection();
                        }
                    }, 300);

                }],
                controllerAs: '$ctrl',
                size: 'lg',
                backdrop: true
            });

            instance.result.then(function close(result) {
                callback(result);
                }, function dismiss() {
            });
        }


    }
})();
