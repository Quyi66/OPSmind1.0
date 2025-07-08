(function () {
    'use strict';

    angular.module('oplus.adm').controller('AdmTenantConfigCtrl', AdmTenantConfigCtrl);

    AdmTenantConfigCtrl.$inject = ['$scope', '$uibModal', '$compile', 'dataTable', 'tenantConfigService', '$translate','$http','$q'];
    function AdmTenantConfigCtrl($scope, $uibModal, $compile, dataTable, tenantConfigService, $translate,$http,$q) {
        var vm = this;
        vm.exportPages = exportPages;

        function exportPages(id, type) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'app/modules/adm/tenant-config/tenant-config-export.html',
                controller: 'TenantConfigExportCtrl',
                controllerAs: '$export',
                size: 'md',
                resolve: {
                    entity: function () {
                        return tenantConfigService.findTenantConfigsById(id);
                    },
                    handleType: function(){
                        return type;
                    }
                }
            });
            modalInstance.result.then(function () {
                console.info('Modal close ' + new Date());
            }, function (err) {
                //throw err;
            });
        }

        var tableOption = {
            aoColumns: [
                //{mData: 'accessToken', title: 'Access Token'},
                {mData: 'name', title: $translate.instant("common.entity.detail.name")},
                {mData: 'code', title: $translate.instant("adm.content.code")},
                {mData: 'description', title: $translate.instant("common.entity.detail.description")},
                {
                    mData: 'id',
                    title: $translate.instant("common.entity.detail.operation"),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        var actionHtml =
                            '<span>' +
                            '<a uaa-has-permission="sysadmin:tenant:*" class="btn btn-default btn-sm"  title="' + $translate.instant("adm.content.analysis_export") + '" ' +
                            ' ng-click="admTenantConfigVm.exportPages(' + id + ', 1)">' +
                            '<i class="fa fa-angle-double-down"></i>' +
                            '</a></span>' +
                            '<span  style="padding-left: 5px" >' +
                            '<a uaa-has-permission="sysadmin:tenant:*" class="btn btn-default btn-sm"title="' + $translate.instant("adm.content.relation_export") + '" ' +
                            ' ng-click="admTenantConfigVm.exportPages(' + id + ', 2)">' +
                            '<i class="fa fa-sort-amount-down-alt"></i>' +
                            '</a></span>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };
        $scope.tableConfig = {
            columns: tableOption.aoColumns,
            data: [function () {
                var d = $q.defer();
                var url = window.$oplus.appConfig.apiBaseUrls.portal + '/api/tenants';
                $http({
                    url: url,
                    method: 'GET',
                }).then(function (res) {
                    var result = res.data;
                     d.resolve(result);
                }, function (err) {
                    d.reject(err);
                    throw err;
                });
                return d.promise;
            }],
            order: [[1, 'desc']],
            buttons: ['reload']
        };

        /*function init() {
            var url = window.$oplus.appConfig.apiBaseUrls.portal + '/api/tenants';
            var dataSrc = "";
            dataTable.initTable("#tenantConfigTable", tableOption.aoColumns, undefined, {
                scrollX: true,
                order: [[1, 'desc']],
                ajax: {
                    url: url,
                    dataSrc: dataSrc
                }
            }).then(function (apiInstance) {
                vm.result = apiInstance;
                console.log()
            }).catch(function (err) {
                throw err;
            });
        }

        init();*/
    }
})();
