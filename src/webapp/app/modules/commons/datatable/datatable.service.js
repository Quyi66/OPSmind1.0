/**
 *
 * @author Joker.Liu create on 2020/03/27
 */
(function () {
        'use strict';

        /**
         * @memberof oplus.commons
         * @ngdoc service
         * @name dataTable
         * @description
         * Service to init jquery datatable
         */
        angular.module('oplus.commons').service('dataTable', dataTable);
        dataTable.$inject = ['$q', '$timeout', '$filter', 'currentUser','$translate'];

        function dataTable($q, $timeout, $filter, currentUser,$translate) {

            /**
             * init datatable and return api instance
             * It is recommended to call this method after getting table data by $http, but you can also set ajax url in some special case.
             * The http request send by  $http will be catch by the web framework and adding some necessary headers
             *
             * use options.buttons['colvis'] to control column selector button
             * use options.buttons['excelHtml5'] to control excel export button
             * use options.disableSearch to remove input for searching
             *
             * eg:
             * 1. none server side
             * var datatableApi = dataTable.initTable(".demo-table", columnDefines, tableDatas);
             * 2. server side
             *  var datatableApi = dataTable.initTable(".demo-table", columnDefines, {},{
             *      serverSide: true,
             *      ajax: {url: 'http://xxx/demo/table'}
             *  });
             *
             * @param selector jquery selector
             * @param columns columns define
             * @param datas table datas
             * @param options raw option of jquery dataTables, if you not have special config, let it empty,
             * @deprecated Use {OpDatatable}
             * @returns {*} instance of datatable api
             */
            function initTable(selector, columns, datas, options) {
                var deferred = $q.defer();

                options = options ? options : {};

                var defaultOptions = {
                    order: [[0, 'asc']],
                    autoWidth: true,
                    deferRender: true,
                    processing: true,
                    lengthMenu: [10, 25, 50, 100],
                    // scrollX: true,
                    // scrollY: 600,//高度最大为600px,再大就上下滚动显示
                    // scrollCollapse: true,
                    // stateSave: true,
                    colReorder: true,
                    // destroy: true,//销毁已有实例，重新创建新的实例
                    // retrieve: true,//加载已有实例
                    serverSide: false,
                    // columns: [],
                    // ordering: true,//启用或禁止排序
                    // order: [[ 0, 'asc' ], [ 1, 'asc' ]],//列默认排序
                    // "orderFixed": {//始终被排序的列
                    //     "pre": [ 0, 'asc' ],//相对于用户手动排序，具有高优先级
                    //     "post": [ 1, 'asc' ]//低优先级
                    // }
                    buttons: [],
                    pagingType: "full_numbers",
                    dom: '<"dataTables_header pt-3"<"dataTables_toolbar" <"dataTables_accurate_query pull-left m-t-sm"><"dataTables_controls" r><"dataTables_buttons pull-right m-r-sm" B>'
                        + (options.disableSearch ? '' : 'f')
                        + '>>t<"dataTables_footer row"<"col-md-6" <"pull-left" l><"pull-left" i>><"col-md-6"p>><"clearfix">',
                    createdRow: function (row, data, dataIndex) {
                    },
                    // ajaxSource: 'app/api/datatable.json',
                    // ajax: {
                    //     url: "app/api/datatable.json",
                    //     type: "GET",
                    //     dataSrc: "aaData"
                    // },
                    ajax: function (data, callback) {
                        callback(
                            {
                                totalRecords: datas.length,
                                aaData: datas
                            }
                        );
                    }
                };


                var tableOption = $.extend(true, {aoColumns: columns}, defaultOptions);

                //query table data by jquery ajax, server side must in that way
                //serverSide must be false when datas not empty
                if (typeof options.ajax === "object") {
                    //Define properties for jQuery.ajax.
                    // console.log("authToken = " + currentUser.authToken);
                    // console.log("tenantId = " + currentUser.tenantId);
                    $.extend(true, tableOption, {
                        ajax: {
                            dataSrc: "data",
                            dataType: "json",
                            headers: {
                                "Authorization": 'Bearer ' + currentUser.authToken,
                                "Tenant-id": currentUser.tenantId
                            }
                        }
                    });
                }

                $.extend(true, tableOption, options);

                //列选择
                var colvisBtn = tableOption.buttons.indexOf('colvis');
                if (colvisBtn !== -1) {
                    tableOption.buttons.splice(colvisBtn, 1,
                        {
                            extend: 'colvis',
                            className: "btn-sm",
                            text: '<i class="icon fa fa-columns" data-toggle="tooltip" data-placement="bottom" title="'+$translate.instant('common.table.select_column')+'"></i>',
                            columnText: function (dt, idx, title) {
                                return (idx + 1) + ': ' + title;
                            }
                        }
                    );
                }

                //导出表格
                var excelHtml5Btn = tableOption.buttons.indexOf('excelHtml5');
                if (excelHtml5Btn !== -1) {
                    tableOption.buttons.splice(excelHtml5Btn, 1,
                        {
                            extend: 'excelHtml5',
                            className: "btn-sm",
                            title: 'data_export_' + $filter('date')((new Date()), "yyyy-MM-dd_HH-mm-ss"),
                            text: '<i class="icon fa fa-file-excel-o" data-toggle="tooltip" data-placement="bottom" title="'+$translate.instant('common.table.table_export')+'"></i>'
                        }
                    );
                }

                $timeout(function () {
                    //the difference between $( selector ).DataTable() and $( selector ).dataTable(). The former returns a DataTables API instance, while the latter returns a jQuery object.
                    // var api = $(selector).DataTable();
                    var api = new $.fn.dataTable.Api(selector);
                    //if the target table has been initialized
                    if (api.init()) {
                        console.log("Run fnDestroy");
                        $(selector).dataTable().fnDestroy();
                    }

                    deferred.resolve(angular.element(selector).DataTable(tableOption));
                }, 100);

                return deferred.promise;
            }


            return {
                initTable: initTable
            };

        }
    }

)();
