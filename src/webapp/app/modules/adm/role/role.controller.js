(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('RoleController', RoleController);

    RoleController.$inject = ['$state', '$scope', '$timeout', '$compile', 'Role', 'RoleSearch', 'dataTable','$q'];

    function RoleController($state, $scope, $timeout, $compile, Role, RoleSearch, dataTable,$q) {

     /*  (function initRoles() {
            Role.query(function (result) {
                dataTable.initTable(".role-table", tableColumnConfig, result);
            });
        })();
*/

        var tableColumnConfig = [
            {mData: 'name', title: '名称'},
            {mData: 'description', title: '描述'},
            {
                mData: 'id', title: '操作',
                class: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {

                    var param = angular.toJson({id: row.id});
                    return '<div class="btn-group">' +
                        ' <button type="submit" ui-sref=role.role-detail(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.view"></span>' +
                        ' </button>' +
                        '&nbsp;&nbsp;' +
                        ' <button type="submit" ui-sref=role.edit(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                        ' </button>' +
                        '&nbsp;&nbsp;' +
                        ' <button type="submit" ui-sref=role.delete(' + param + ') class="btn btn-danger btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                        ' </button>' +
                        '</div>';
                },
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
                }
            }
        ];

       $scope.tableConfig = {
            data: [getPromise, ''],
            columns: tableColumnConfig,
            order: [[1, 'desc']],
            buttons: ['reload']
        }

        function getPromise() {
            var deferred = $q.defer();
            Role.query(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }

    }
})();
