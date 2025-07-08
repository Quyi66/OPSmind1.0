/**
 *
 * @author Joker.Liu create on 2020/03/27
 */
(function () {
    'use strict';
    /**
     * @ngdoc directive
     * @name opDatatable
     * @description
     * init <table> to jquery datatable
     * @restrict C
     * @example
     *  <table class="oplus-datatable table table-striped table-hover" columns="xxx" datas="xxx" options="xxx"></table>
     * @param {array} column define
     * @param {array} table datas, if this data is queried asynchronous, the initial value should be undefiend;  if the options.ajax.url is not empty, the directive will ignore table datas
     * @param {object} options
     */
    angular.module('oplus.commons').directive('opDatatable', ['$compile', 'dataTable', opDatatable]);

    function opDatatable($compile, dataTable) {
        return {
            restrict: 'C',
            scope: {

            },
            bindToController: {
                columns: '<',
                datas: '<',
                options: '<'
            },
            controller: function () {

            },
            controllerAs: 'opDatatableVm',
            link: function (scope, element, attrs, ctrl) {
                console.log("Run link");
                if (ctrl.options && options.ajax && options.ajax.url) {
                    dataTable.initTable(element, ctrl.columns, undefined, ctrl.options);
                } else {
                    scope.$watch('opDatatableVm.datas', function (newVal, oldVal) {
                        if (newVal) {
                            dataTable.initTable(element, ctrl.columns, ctrl.datas, ctrl.options);
                        }
                    });
                }
            }
        };

    }
})();
