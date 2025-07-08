(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('ParamController', ParamController);

    ParamController.$inject = ['$scope', '$timeout', '$compile', 'Param', 'messageService', 'dataTable', 'tenantUtil','$q'];

    function ParamController($scope, $timeout, $compile, Param, messageService, dataTable, tenantUtil,$q) {
        var vm = this;

        vm.isOplusAdminUI = tenantUtil.isOplusAdminUI();

       /* (function initParams() {
            Param.query({}, function (result, headers) {
                dataTable.initTable(".param-table", tableColumnConfig, result);
            });
        })();*/

        var tableColumnConfig = [
            {mData: 'domain', title: '主体'},
            {mData: 'name', title: '参数名'},
            {
                mData: 'value', title: '参数值', className: 'cac-text-overflow', width: '400px',
                render: function (data, type, row, meta) {
                    return '<span' +
                        ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 400px;"' +
                        ' title=/""' + row.value + '"/">' + row.value + '</span>';
                }
            },
            {
                mData: 'description', title: '描述', className: 'cac-text-overflow', width: '400px',
                render: function (data, type, row, meta) {
                    return '<span' +
                        ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 400px;"' +
                        ' title="' + row.description + '">' + row.description + '</span>';
                }
            },
            {
                mData: 'id', title: '操作',
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {

                    var param = angular.toJson({ id: row.id });
                    
                    var btns = '' +
                        ' <button type="submit" ui-sref=param.detail(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.view"></span>' +
                        ' </button>&nbsp;&nbsp;' +
                        ' <button type="submit" ui-sref=param.edit(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                        ' </button>&nbsp;&nbsp;';

                    if (!row.cannotDelete)
                        btns += '' +
                            ' <button type="submit" ui-sref=param.delete(' + param + ') class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                            ' </button>';

                    return '<div class="btn-group">' +
                        btns +
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
            Param.query(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }
    }
})();
