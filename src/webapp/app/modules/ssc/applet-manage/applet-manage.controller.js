/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageCtrl', appletManageCtrl);

    appletManageCtrl.$inject = ['$scope', '$rootScope', '$state', '$filter', '$compile', '$stateParams', '$uibModal', '$location', 'messageService', 'appletManageService', 'dataTable', '$translate'];

    function appletManageCtrl($scope, $rootScope, $state, $filter, $compile, $stateParams, $uibModal, $location, messageService, appletManageService, dataTable, $translate) {
        var vm = this;
        vm.$onInit = onInit;

        vm.activeTab = 'app';
        $scope.appletsTableConfig = {};
        vm.exportApplet = exportApplet;

        function onInit() {
            appletControlQuery();
            recycledAppletsControlQuery();
        }

        function exportApplet(ids){
           $uibModal.open({
                templateUrl: 'app/modules/ssc/applet-manage/applet-manage-export.html',
                controller: 'appletManageExportCtrl',
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    ids: function() { return ids; }
                }
            });
        }

        function appletControlQuery() {
            var tableColumnConfig = [
                {mData: 'name', title: "Code"},
                {mData: 'title', title: $translate.instant('ssc.applet.manage.list.title')},
                {
                    data: 'status',
                    title: $translate.instant('ssc.applet.manage.list.status'),
                    render: function (data, type, row, meta) {
                        if (data === 'P') {
                            return "<span class='badge bg-success'>" + $translate.instant("ssc.applet.manage.list.status.enabled") + "</span>"
                        }
                        return "<span class='badge bg-danger'>" + $translate.instant("ssc.applet.manage.list.status.disabled") + "</span>";
                    }
                },

                {mData: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    mData: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                },

                {
                    mData: 'modifiedAt',
                    title: $translate.instant('common.attr.updated_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                },


                {
                    mData: 'id', title: $translate.instant("common.entity.detail.operation"),
                    className: 'text-right',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var param = angular.toJson({id: row.id});
                        return ' <button uaa-has-permission="adm:view:*" type="submit" ui-sref=app.ssc.config.applet-manage.detail(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.view") + '</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" type="submit" ui-sref=app.ssc.config.applet-manage.copy(' + param + ') class="btn btn-warning btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.copy") + '</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" type="submit" ui-sref=app.ssc.config.applet-manage.delete(' + param + ') class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.delete") + '</span>' +
                            ' </button>';
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                }
            ];

            $scope.appletsTableConfig = {
                data: [appletManageService.findAllApplet, ''],
                columns: tableColumnConfig,
                selection: {
                    valueData: 'id', labelData: 'title', preselected: []
                },
                order: [[0, 'desc']],
                buttons: ['reload']
            };

        }


        function recycledAppletsControlQuery() {
            var tableColumnConfig = [
                {
                    mData: 'appletCode',
                    title: "Code"
                },
                {
                    mData: 'title',
                    title: $translate.instant('ssc.applet.manage.list.title')
                },
                {
                    mData: 'createBy',
                    title: $translate.instant('common.attr.created_by')
                },
                {
                    data: 'createTime',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                },

                {
                    mData: 'id',
                    title: $translate.instant("common.entity.detail.operation"),
                    className: 'text-right',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return ' <button uaa-has-permission="adm:edit:*" ng-click="$ctrl.recoverRecycle(\'' + row.appletCode + '\')" class="btn btn-warning btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("adm.applet.recover") + '</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" ng-click="$ctrl.deleteRecycle(\'' + row.appletCode + '\')" class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.delete") + '</span>' +
                            ' </button>';
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                }
            ];

            $scope.recycledAppletsTableConfig = {
                data: [appletManageService.findAllRecycledApplet, ''],
                columns: tableColumnConfig,
                selection: {
                    valueData: 'appletCode',
                    labelData: 'title',
                    preselected: []
                },

                order: [
                    [0, 'desc']
                ],
                buttons: ['reload']
            };
        }


        vm.deleteRecycle = function (appletCode) {
            messageService.confirm($translate.instant('common.entity.action.delete'), $translate.instant('adm.content.are_you_sure_to_delete_by_applet'), function () {
                appletManageService.deleteRecycledApplet(appletCode).then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });
        }

        vm.deleteSelectedRecycle = function () {
            messageService.confirm($translate.instant('common.entity.action.delete'), $translate.instant('adm.content.are_you_sure_to_delete_by_applet'), function () {
                var items = $scope.recycledAppletsTableConfig.selectedItems;
                appletManageService.deleteRecycledApplets(items).then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });

        }


        vm.recoverRecycle = function (appletCode) {
            messageService.confirm($translate.instant('adm.applet.recover'), $translate.instant('adm.content.are_you_sure_to_recover_by_applet'), function () {
                appletManageService.recoverRecycledApplet(appletCode).then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                    broadcastAppletChanged();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });
        }

        vm.recoverSelectedRecycle = function () {
            messageService.confirm($translate.instant('adm.applet.recover'), $translate.instant('adm.content.are_you_sure_to_recover_by_applet'), function () {

                var items = $scope.recycledAppletsTableConfig.selectedItems;

                appletManageService.recoverRecycledApplet(items).then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                    broadcastAppletChanged();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });

        }

        function broadcastAppletChanged() {
            $rootScope.$broadcast('APPLET_CHANGED');
        }

        vm.clearRecycle = function () {
            messageService.confirm($translate.instant('common.entity.action.delete'), $translate.instant('adm.content.are_you_sure_to_delete_by_applet'), function () {
                appletManageService.clearRecycledApplets().then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });
        }
    }
})();
