(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('PermissionController', PermissionController);

    PermissionController.$inject = ['$scope', '$compile', 'Permission', 'dataTable','$q'];

    function PermissionController($scope, $compile, Permission, dataTable,$q) {

        /*(function initPermission() {
            Permission.query(function (result) {
                dataTable.initTable(".permission-table", tableColumnConfig, result);
            });
        })();*/

        var tableColumnConfig = [
            {mData: 'domain', title: '主体'},
            {mData: 'action', title: '操作'},
            {mData: 'target', title: '目标'},
            {mData: 'description', title: '描述'},
            {
                mData: 'id', title: '操作',
                class: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var param = angular.toJson({id: row.id});
                    return '<div class="btn-group">' +
                        '    <button type="submit" ui-sref=permission.permission-detail(' + param + ') class="btn btn-default btn-sm">' +
                        '        <span class="hidden-sm-down" data-translate="common.action.view"></span>' +
                        '    </button>&nbsp;&nbsp;' +
                        '    <button type="submit" ui-sref=permission.edit(' + param + ') class="btn btn-default btn-sm">' +
                        '        <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                        '    </button>&nbsp;&nbsp;' +
                        '    <button type="submit" ui-sref=permission.delete(' + param + ') class="btn btn-danger btn-sm">' +
                        '        <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                        '    </button>' +
                        '</div>';
                },
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
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
            Permission.query(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }
    }
})();
