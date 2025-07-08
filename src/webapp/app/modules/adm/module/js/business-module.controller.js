(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('BusinessModuleController', BusinessModuleController);

    BusinessModuleController.$inject = ['$scope', '$timeout', '$compile', 'BusinessModule', 'messageService', 'dataTable'];

    function BusinessModuleController($scope, $timeout, $compile, BusinessModule, messageService, dataTable) {

        var vm = this;
        initBusinessModules();

        var tableColumnConfig = [
            {mData: 'name', title: '名称'},
            {mData: 'code', title: '编码'},
            {mData: 'description', title: '描述'},
            {
                mData: 'id', title: '操作',
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {

                    var param = angular.toJson({id: row.id});
                    return '<div class="btn-group">' +
                        ' <button type="submit" ui-sref=businessModule.detail(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.view"></span>' +
                        ' </button>' +
                        ' <button type="submit" ui-sref=businessModule.edit(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                        ' </button>' +
                        ' <button type="submit" ui-sref=businessModule.delete(' + param + ') class="btn btn-danger btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                        ' </button>' +
                        '</div>';
                },
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
                }
            }
        ];


        function initBusinessModules() {

            BusinessModule.query({}, function (result, headers) {
                // console.log("BusinessModule.query result = " + JSON.stringify(result));
                dataTable.initTable(".business-module-table", tableColumnConfig, result);
            }, function onError(error) {
                messageService.alertError("Query business module fail.", error.data.message);
            });
        }
    }
})();
