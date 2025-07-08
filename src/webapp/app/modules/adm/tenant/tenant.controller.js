(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('TenantController', TenantController);

    TenantController.$inject = ['$scope', '$timeout', '$compile', 'Tenant', 'messageService', 'dataTable','$q','$translate','$uibModal'];

    function TenantController($scope, $timeout, $compile, Tenant, messageService, dataTable,$q,$translate,$uibModal) {

        var vm = this;
        vm.exportPages = exportPages;

        /*(function initTenants() {
            Tenant.query({}, function (result, headers) {
                // console.log("Tenant.query result = " + JSON.stringify(result));
                dataTable.initTable(".tenant-table", tableColumnConfig, result);
            }, function onError(error) {
                messageService.alertError("Query tenant fail.", error.data.message);
            });
        })();*/
        function exportPages(id, type) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'app/modules/adm/tenant/tenant-export.html',
                controller: 'TenantExportCtrl',
                controllerAs: '$export',
                size: 'md',
                resolve: {
                    entity: function () {
                        return Tenant.findTenantConfigsById(id);
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

        var tableColumnConfig = [
            {mData: 'accessToken', title: 'Access Token'},
            {mData: 'name', title: '名称'},
            {mData: 'code', title: '编码'},
            {mData: 'userCount', title: '用户数', class: 'text-center'},
            {mData: 'description', title: '描述'},
            {
                mData: 'id', title: '操作',
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var id = "'" + row.id + "'";
                    var param = angular.toJson({id: row.id});
                    return '<div class="btn-group" uaa-has-permission="sysadmin:tenant:*">' +
                            ' <button type="button" ng-click="tenantVm.exportPages(' + id + ', 1)" class="btn btn-default btn-sm"  title="' + $translate.instant("adm.content.analysis_export") + '">' +
                            '   <i class="fa fa-angle-double-down"></i>' +
                            ' </button>&nbsp;' +
                            '  <button type="button" ng-click="tenantVm.exportPages(' + id + ', 2)" class="btn btn-default btn-sm"  title="' + $translate.instant("adm.content.analysis_export") + '">' +
                            '   <i class="fa fa-sort-amount-down-alt"></i>' +
                            ' </button>&nbsp;&nbsp;' +
                            ' <button type="submit" ui-sref=tenant.edit(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                            ' </button>&nbsp;' +
                            ' <button type="submit" ui-sref=tenant.delete(' + param + ') class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                            ' </button>' +
                            '</div>';
                }
            }
        ];


        $scope.tableConfig = {
            data: [getPromise],
            columns: tableColumnConfig,
            order: [[1, 'desc']],
            buttons: ['reload']
        }

        function getPromise() {
            var deferred = $q.defer();
            Tenant.query(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }
    }
})();
