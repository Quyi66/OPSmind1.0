/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017
 */
(function () {
    'use strict';
    /**
     * @ngdoc
     * @name DatasetEditCtrl
     */
    angular.module('oplus.dts').component('datasetEdit', {
        templateUrl: 'app/modules/dts/dataset-edit.component.html', controller: DatasetEditCtrl, bindings: {
            editState: '<', appletCode: '<'
        }
    });

    DatasetEditCtrl.$inject = ['$scope', '$rootScope', '$compile', '$state', '$stateParams', 'messageService', 'datasourceService', 'datasetService', '$templateRequest', 'restUtils', '$translate'];

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $compile
     * @param $state
     * @param $stateParams
     * @param messageService {messageService}
     * @param datasourceService {datasourceService}
     * @param datasetService {datasetService}
     * @param $templateRequest
     * @param restUtils
     * @constructor
     */
    function DatasetEditCtrl($scope, $rootScope, $compile, $state, $stateParams, messageService, datasourceService, datasetService, $templateRequest, restUtils, $translate) {
        var id = $stateParams['id'];
        var datasourceName = $stateParams['datasourceName'];
        var type = $stateParams['tempType'];

        $scope.appletCode = this.appletCode || '';
        $scope.editState = this.editState || 'app.dts.datasource_datasets.dts_dataset_edit';

        $scope.isAction = false;
        $scope.editAction = false;
        $scope.editing = false;
        $scope.isRunning = false;
        $scope.saveDataset = saveDataset;
        $scope.getParams = getParams;
        $scope.queryMeta = queryMeta;
        $scope.exportData = exportData;
        $scope.download = download;
        $scope.addQueryParam = addQueryParam;
        $scope.removeQueryParam = removeQueryParam;
        $scope.changeParam = changeParam;
        $scope.addColumns = addColumns;
        $scope.removeColumn = removeColumn;
        $scope.changeColumn = changeColumn;
        $scope.changeColumnDesc = changeColumnDesc;
        $scope.confirmChange = confirmChange;
        $scope.selectDatasets = {
            query: []
        };
        $scope.cmOption = {
            lineNumbers: true, lineWrapping: true, indentWithTabs: true, theme: 'opluscode', mode: 'sql'
        };

        if (type === "join") {
            loadDatasets();
        }

        loadDataset(id);

        function loadDatasources() {
            datasourceService.findAllDatasources().then(function (data) {
                $scope.datasources = data;
                angular.forEach($scope.datasources, function (v) {
                    if ($scope.dataset) {
                        if (v.name === $scope.dataset.datasource) {
                            $scope.selectedDatasource = v;
                        }
                    }
                })
            });
        }

        function loadDataset(id) {
            if (id) {
                $scope.editing = true;
                datasetService.findDataset(id).then(function (data) {
                    $scope.dataset = data;
                    if ($scope.dataset.options == null && $scope.dataset.type === "jdbc") {
                        $scope.dataset.options = {
                            proc: false
                        };
                    } else if ($scope.dataset.type === "join") {
                        $scope.selectDatasets.query = $scope.dataset.query.split(",");
                    }
                    loadDatasources();
                    $scope.editAction = true;
                }).catch(function (err) {
                    throw err;
                });
            } else {
                $scope.isAction = true;
                if (type === "jdbc") {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            proc: false
                        }
                    };
                } else if (type === "join") {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            joinKeys: "", joinType: "join"
                        }
                    };
                } else if (type === 'es') {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            proc: false
                        }
                    };
                } else if (type === 'orientdb') {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            proc: false
                        }
                    };
                } else if (type === "rest") {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            encoder: "UTF-8", unicode: false
                        }
                    };

                }
                loadDatasources();
            }
        }

        function loadDatasets() {
            datasetService.findAllDatasets().then(function (data) {
                $scope.datasets = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function saveDataset() {
            if ($scope.selectedDatasource) {
                try {
                    $scope.dataset.datasource = $scope.selectedDatasource.name;
                    $scope.dataset.type = $scope.selectedDatasource.type;
                    if ($stateParams.appletCode) $scope.dataset.appletCode = $stateParams.appletCode;
                    datasetService.saveDataset($scope.dataset).then(function (obj) {
                        $scope.dataset = obj;
                        messageService.toast('success', 'Saved');
                        setTimeout(function () {
                            $state.go($scope.editState, {
                                type: $scope.dataset.type, id: $scope.dataset.id
                            }, {
                                reload: true
                            });
                        }, 200);
                    }).catch(function (err) {
                        messageService.alert('error', err.message);
                    });
                } catch (e) {
                    messageService.alert($translate.instant('dts.status.fail'), e.message);
                }
            } else {
                messageService.alert('error', $translate.instant('dts.dataset.edit.choose_dataset'));
            }
        }

        function getParams() {
            var params = {};
            if (type === "join") {
                params = {
                    type: type, query: $scope.dataset.query
                }
            }

            datasetService.getParams(params).then(function (data) {
                $scope.dataset.params = data.paramsConfig;
            }).catch(function (err) {
                messageService.alert($translate.instant('dts.status.fail'), err.message);
            });
        }

        function download() {
            $state.go('app.gfs.staticfs_dir', {repo: '$tnt', dir: 'ASYNC_EXPORT_EXCEL'})
        }

        function exportData() {
            if (!$scope.dataset || !$scope.dataset.options.columns || !$scope.dataset.code || !$scope.dataset.name) {
                messageService.alert($translate.instant('dts.status.fail'), $translate.instant('udp.w.datatable.action.export_result_fail'));
            }
            var columns = []
            _.forEach($scope.dataset.options.columns, function (value, key) {
                var filed = {
                    "label": key, "value": key
                }
                columns.push(filed);
            });
            var queryParams = {
                "dataset": $scope.dataset.code,
                "filter": "",
                "params": {},
                "filename": $scope.dataset.name,
                "columns": columns
            }
            // console.log(queryParams)
            // console.log($scope.dataset)
            restUtils.callApi('dts', 'POST', '/api/dts/export/excel', null, queryParams).then(function (data) {
                download();
                messageService.toast("success", $translate.instant('udp.designer.actions.export_excel_success'));
                // messageService.alert($translate.instant('dts.datasource.success'), "后台异步导出Excel中，请至脚本库中下载，下载地址为：<br/><br/>" + data.path);
            }).catch(function (err) {
                messageService.alert($translate.instant('dts.status.fail'), err.message);
            });
        }

        function queryMeta(queryType, dataType) {
            type = dataType;
            var params = {};
            angular.forEach($scope.dataset.params, function (detail, key) {
                if (detail.type === "array") {
                    params[key] = detail.defaultValue.split(",");
                } else if (detail.type === "number") {
                    params[key] = Number(detail.defaultValue);
                } else if (detail.type === "date") {
                    params[key] = Date(detail.defaultValue);
                } else {
                    params[key] = detail.defaultValue;
                }
            });

            var queryParams = {};

            if (type === "jdbc") {
                queryParams = {
                    options: $scope.dataset.options,
                    type: $scope.dataset.type,
                    dataSource: $scope.selectedDatasource.name,
                    params: params,
                    query: $scope.dataset.query
                }
            } else if (type === "join") {
                queryParams = {
                    type: $scope.dataset.type,
                    params: params,
                    options: $scope.dataset.options,
                    query: $scope.dataset.query
                }
            } else if (type === "es") {
                queryParams = {
                    type: $scope.dataset.type,
                    params: params,
                    dataSource: $scope.selectedDatasource.name,
                    query: $scope.dataset.query,
                    options: $scope.dataset.options
                }
            } else if (type === "orientdb") {
                queryParams = {
                    params: params
                }
                restUtils.callApi('dts', 'POST', '/api/dts/q/meta/' + $scope.dataset.code + "/", null, queryParams).then(function (data) {
                    showData(data);
                }).catch(function (err) {
                    messageService.alert($translate.instant('dts.status.fail'), err.message);
                });
                return;
            } else if (type === "rest") {
                queryParams = {
                    type: $scope.dataset.type,
                    params: params,
                    dataSource: $scope.selectedDatasource.name,
                    query: $scope.dataset.query,
                    encoder: $scope.dataset.options.encoder,
                    options: $scope.dataset.options
                }

            }

            if (queryType === "param" && type === "jdbc") {
                datasetService.queryParams(queryParams).then(function (data) {
                    $scope.dataset.params = data.paramsConfig;
                }).catch(function (err) {
                    messageService.alert($translate.instant('dts.status.fail'), err.message);
                });
            } else {
                if (queryType === "data") {
                    $scope.isRunning = true;
                }

                datasetService.testQuery(queryParams).then(function (data) {
                    if (queryType === "param") {
                        $scope.dataset.params = data.paramsConfig;
                    } else if (queryType === "data") {
                        $scope.isRunning = false;
                        showData(data);
                    } else if (queryType === "field") {
                        $scope.dataset.options.columns = $scope.dataset.options.columns || {};
                        angular.forEach(data.fields, function (obj) {
                            $scope.dataset.options.columns[obj.name] = $scope.dataset.options.columns[obj.name] || "";
                        })
                    }

                }).catch(function (err) {
                    $scope.isRunning = false;
                    messageService.alert($translate.instant('dts.status.fail'), err.message);
                });
            }


        }

        function showData(data) {

            var columns = [];

            $scope.fields = {};

            angular.forEach(data.fields, function (obj) {
                columns.push({
                    "data": obj.name, "title": obj.name, "defaultContent": ''
                });
                $scope.fields[obj.name] = obj.name;
            })

            if (columns.length === 0) {
                $("#dataTable").html("");
                messageService.alert($translate.instant('dts.status.point'), $translate.instant('dts.status.not_get_data'));
                return;
            }

            $scope.tableOption = {
                data: data.records, columns: columns, searching: false, paging: true, scrollX: true, order: [], // Disable default ordering
                autoWidth: true, colResize: false
            };

            var table = '<table id="table" class="table table-striped"></table>';

            $("#dataTable").html($compile(table)($scope));

            callJQPlugin($("#table"), "DataTable", $scope.tableOption);

        }

        //根据插件名称，调用jquery插件
        function callJQPlugin(element, type, option) {

            var linkOptions = [];
            linkOptions.push(option);
            return element[type].apply(element, linkOptions);
        }

        function addQueryParam() {
            $scope.dataset.params = $scope.dataset.params || {};
            $scope.dataset.params[""] = {};
        }

        function removeQueryParam(name) {
            delete $scope.dataset.params[name];
        }

        function changeParam(index, name) {

            var i = 0;
            var params = {};

            angular.forEach($scope.dataset.params, function (detail, key) {


                if (index === i) {
                    params[name] = detail;
                } else {
                    params[key] = detail;
                }
                i++;

            })

            $scope.dataset.params = params;

        }

        function addColumns() {
            $scope.dataset.options.columns = $scope.dataset.options.columns || {};
            $scope.dataset.options.columns[""] = "";
        }


        function removeColumn(name) {
            delete $scope.dataset.options.columns[name];
        }

        function changeColumn(index, name) {
            var i = 0;
            var columns = {};
            angular.forEach($scope.dataset.options.columns, function (detail, key) {
                if (index === i) {
                    columns[name] = detail;
                } else {
                    columns[key] = detail;
                }
                i++;
            })
            $scope.dataset.options.columns = columns;
        }

        function changeColumnDesc(name, detail) {
            $scope.dataset.options.columns[name] = detail;
        }

        function confirmChange() {
            $scope.dataset.query = $scope.selectDatasets.query.join(",");
        }


        var regex = /^[a-zA-Z0-9_]{1,}$/;
        $scope.$watch('dataset.code', function (code, oldCode) {
            if (!id) {
                if (code) {
                    if (!regex.test(code)) {
                        $scope.dataset.code = oldCode;
                    } else {
                        $scope.dataset.code = angular.uppercase(code);
                    }
                }
            }
        })
    }
})();
