/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name datasetList
     */
    angular.module('oplus.dts').component('datasetList', {
        templateUrl: 'app/modules/dts/dataset-list.component.html',
        controller: DatasetListCtrl,
        bindings: {
            showApplet: '<',
            appletCode: '<',
            createState: '<',
            editState: '<',
            datasetState: '<',
            uiViewUrl: '<',
            options: '<'
        }
    });

    DatasetListCtrl.$inject = ['$scope', '$translate', '$rootScope', '$compile', '$state', '$stateParams', 'messageService', 'datasourceService', 'datasetService', 'apiService', '$uibModal', 'appletService','appletSecurity'];

    /**
     *
     * @param $scope
     * @param $translate
     * @param $rootScope
     * @param $compile
     * @param $state
     * @param $stateParams
     * @param messageService {messageService}
     * @param datasourceService {datasourceService}
     * @param datasetService {datasetService}
     * @param apiService
     * @param $uibModal
     * @param {appletService} appletService
     * @param {appletSecurity} appletSecurity
     * @constructor
     */
    function DatasetListCtrl($scope, $translate, $rootScope, $compile, $state, $stateParams, messageService, datasourceService, datasetService, apiService, $uibModal, appletService,appletSecurity) {
        var that = this;
        this.options = this.options || {};
        this.createDataset = createDataset;
        this.editDataset = editDataset;
        this.copyDataset = copyDataset;
        this.deleteDataset = deleteDataset;
        this.onAppletSelectorChange = onAppletSelectorChange;
        this.showRestApi = showRestApi;
        this.moveDataset = moveDataset;
        this.showApplet = this.showApplet || false;
        this.appletCode = this.appletCode || '';
        this.uiViewUrl = this.uiViewUrl || 'edit_dataset';
        this.createState = this.createState || 'app.dts.datasource_datasets.dts_dataset_new';
        this.editState = this.editState || 'app.dts.dataset.edit';
        this.datasetState = this.datasetState || 'app.dts.datasource_datasets';
        this.tableConfig = {
            tableId: 'dts-datasetlist',
            data: function () {
                // return datasetService.findByDatasource(datasourceName, {
                var appletCode = $stateParams.appletCode || that.appletCode;
                return datasetService.findDatasetsByApplet(appletCode);
            },
            columns: [{
                data: 'code',
                title: $translate.instant('dts.dataset.attr.code'),
                render: function (data, type, row, meta) {
                    var html = row.code;
                    return '<a class="d-block text-wrap"  ng-click="$ctrl.editDataset(\'' + row.id + '\')">' + html + '</a>';
                }
            },
                {data: 'name', title: $translate.instant('dts.dataset.attr.name')},
                {
                    data: 'datasource',
                    title: $translate.instant('dts.dataset.attr.datasource'),
                    _extra: {autoFilter: true}
                },
                {data: 'appletCode', title: $translate.instant('dts.dataset.attr.applet'), searchable: false},
                {data: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    data: 'modifiedAt',
                    title: $translate.instant('common.attr.updated_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                }
            ],
            selection: {labelData: 'title', valueData: 'id'},
            order: [[6, 'desc']]
        }

        var datasourceName = $stateParams['datasourceName'];
        var tempType = $stateParams['tempType'];
        var datasetId = $stateParams['id'];
        var isNew = $state.current.url.indexOf("new") !== -1;
        if (this.options.enableEdit) {
            this.tableConfig.columns.push({
                title: $translate.instant('common.action.action'),
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    if (!appletSecurity.canModifyAppletResource(row['appletCode'])){
                       return '';
                    }
                    var html = ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-table" ng-click="$ctrl.editDataset(\'' + row.id + '\')" title="{{\'common.action.modify\'|translate}}" uaa-has-permission="dts:edit"><i class="fa fa-pencil"></i></button>' +
                        // ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-table" ng-click="$ctrl.showRestApi(dataset)" title="API" uaa-has-permission="dts:view"><i class="fa fa-share-alt"></i></button>' +
                        ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-table" ng-click="$ctrl.copyDataset(\'' + row.id + '\',\'' + row.name + '\')" title="{{\'common.action.copy\'|translate}}" uaa-has-permission="dts:edit"><i class="fa fa-copy"></i></button>' +
                        ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-table" ng-click="$ctrl.deleteDataset(\'' + row.id + '\')" class="m-r-sm" title="{{\'dts.operate.delete\' | translate}}" uaa-has-permission="dts:edit"><i class="fa fa-trash-alt"></i></button>';
                    return html;
                }
            });
        }

        // findByDatasource(datasourceName);

        function findByDatasource(datasourceName) {
            datasetService.findAllDatasets(datasourceName, {
                appletCode: that.appletCode
            }).then(function (data) {
                that.datasets = data;
                if (!isNew) {
                    if (datasetId) {
                        angular.forEach(that.datasets, function (obj) {
                            if (datasetId == obj.id) {
                                setTimeout(function () {
                                    editDataset(obj);
                                }, 200)
                            }
                        })
                    } else {
                        if (that.datasets.length > 0) {
                            setTimeout(function () {
                                //       editDataset(that.datasets[0]);
                            }, 200)
                        }
                    }
                } else {
                    setTimeout(function () {
                        createDataset();
                    }, 200)
                }

            });
        }


        function createDataset() {
            var folders = [$translate.instant('dts.list.database'), $translate.instant('dts.list.server'), $translate.instant('dts.list.api'), ""];
            if (datasourceName && _.indexOf(folders, datasourceName) == -1) {
                $state.go(that.createState, {
                    type: tempType,
                    datasourceName: datasourceName
                });
            }
        }

        function editDataset(id) {
            var state = that.editState;
            console.log('editDataset', {state: state, id: id, appletCode: that.appletCode});
            $state.go(state, {id: id/*, appletCode: that.appletCode*/});
        }

        function moveDataset() {
            appletService.openAppletSelectorModal(function (applet) {
                messageService.confirm($translate.instant('dts.dataset.action.move_dataset'),
                    $translate.instant('dts.dataset.action.move_dataset_confirm', {
                        applet: applet.title,
                        recordNum: that.tableConfig.selectedItems.length
                    }),
                    function () {
                        var code = applet.code;
                        datasetService.moveDataset(that.tableConfig.selectedItems, applet.code).then(function () {
                            reloadData();
                        }).catch(function (err) {
                            throw err;
                        });
                    })
            });
        }

        function copyDataset(dataset_id, dataset_name) {
            messageService.prompt("", $translate.instant('dts.list.please_input') + "code", "", function (value) {
                datasetService.copyDataset(dataset_id, value).then(
                    function (obj) {
                        messageService.toast('success', dataset_name + $translate.instant('dts.list.copy_success'));
                        setTimeout(function () {
                            $state.go(that.editState, {
                                type: obj.type,
                                id: obj.id
                            }, {
                                reload: true
                            });
                        }, 200);
                    }
                )
            }, "");

        }

        function deleteDataset(datasetId) {
            messageService.confirm($translate.instant('dts.dataset.action.delete'), $translate.instant('dts.dataset.action.delete_confirm', {name: datasetId}), function () {
                datasetService.deleteDataset(datasetId).then(function () {
                    // messageService.toast('success', '删除成功');
                    reloadData();
                });
            });
        }

        function onAppletSelectorChange(applet) {
            that.appletCode = applet.name;
            reloadData();
        }

        function reloadData() {
            that.tableConfig.reloadData();
        }

        function showRestApi(dataset) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'app/modules/dts/rest-share.html',
                controller: ['dataset', '$scope', RestApiCtrl],
                controllerAs: '$ctrl',
                resolve: {
                    dataset: function () {
                        return dataset;
                    }
                },
                size: 'md'
            });

            function RestApiCtrl(dataset, $scope) {
                var prefix = window.$oplus.appConfig.apiBaseUrls.dts;
                if (prefix) {
                    prefix += "/";
                } else {
                    prefix = window.location.protocol + "//" + window.location.host + window.location.pathname;
                }
                that.restApi = prefix + "api/dts/query/data/" + dataset.code;

                var getUrl = that.restApi;
                var params = {};

                if (dataset.params) {
                    getUrl += "?params=%7B";
                    angular.forEach(dataset.params, function (detail, key) {
                        if (detail.type == "array") {
                            params[key] = detail.defaultValue.split(",");
                        } else {
                            params[key] = detail.defaultValue;
                        }

                    })
                    var paramsToString = angular.toJson(params);
                    getUrl += paramsToString.substring(1, paramsToString.length - 1);
                    getUrl += "%7D";
                }

                that.getUrl = getUrl;
                that.params = {
                    "params": params
                };

                that.curlGetUrl = 'curl -X GET --header "Accept: */*"  "' + encodeURI(getUrl) + '"';
                that.curlPostUrl = 'curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d \'' + angular.toJson(that.params) + '\' "' + that.restApi + '"';


                that.dismissModal = function () {
                    modalInstance.close();
                }

                that.publish = function () {
                    console.log(dataset);

                    var path = "/api/dts/query/data/" + dataset.code;
                    var api = {
                        "get": {
                            "tags": [
                                dataset.tags
                            ],
                            "summary": dataset.name,
                            "description": dataset.description,
                            "operationId": "getMetaColumnUsingGET",
                            "consumes": [
                                "application/json"
                            ],
                            "produces": [
                                "*/*"
                            ],
                            "parameters": [{
                                "name": "orderBy",
                                "in": "query",
                                "description": $translate.instant('dts.list.sort'),
                                "required": false,
                                "type": "string"
                            },
                                {
                                    "name": "page",
                                    "in": "query",
                                    "description": $translate.instant('dts.list.which_page'),
                                    "required": false,
                                    "type": "integer",
                                    "format": "int32"
                                },
                                {
                                    "name": "size",
                                    "in": "query",
                                    "description": $translate.instant('dts.list.page_count'),
                                    "required": false,
                                    "type": "integer",
                                    "format": "int32"
                                },
                                {
                                    "name": "params",
                                    "in": "query",
                                    "description": $translate.instant('dts.list.request_param'),
                                    "required": false,
                                    "type": "string",
                                    "default": angular.toJson(params)
                                },
                                {
                                    "name": "filter",
                                    "in": "query",
                                    "description": $translate.instant('dts.list.search'),
                                    "required": false,
                                    "type": "string"
                                }
                            ],
                            "responses": {
                                "200": {
                                    "description": "OK",
                                    "schema": {
                                        "type": "object"
                                    }
                                },
                                "401": {
                                    "description": "Unauthorized"
                                },
                                "403": {
                                    "description": "Forbidden"
                                },
                                "404": {
                                    "description": "Not Found"
                                }
                            },
                            "x-auth-type": "Application & Application User",
                            "x-throttling-tier": "Unlimited"
                        },
                        "post": {
                            "tags": [
                                dataset.tags
                            ],
                            "summary": dataset.name,
                            "description": path,
                            "operationId": "queryMetaColumnUsingPOST",
                            "consumes": [
                                "application/json"
                            ],
                            "produces": [
                                "*/*"
                            ],
                            "parameters": [{
                                "in": "body",
                                "name": "options",
                                "description": "options",
                                "required": false,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "filter": {
                                            "type": "string",
                                            "description": $translate.instant('dts.list.filter')
                                        },
                                        "orderBy": {
                                            "type": "string",
                                            "description": $translate.instant('dts.list.sort_column') + "：name desc, title asc"
                                        },
                                        "page": {
                                            "type": "integer",
                                            "format": "int32",
                                            "description": $translate.instant('dts.list.page_number')
                                        },
                                        "params": {
                                            "type": "object",
                                            "default": angular.toJson(params),
                                            "description": $translate.instant('dts.list.query_param') + "{'key'：'value'，'key1'：'value1'}"
                                        },
                                        "size": {
                                            "type": "integer",
                                            "format": "int32",
                                            "description": $translate.instant('dts.list.page_count')
                                        }
                                    },
                                }
                            }],
                            "responses": {
                                "200": {
                                    "description": "OK",
                                    "schema": {
                                        "type": "object"
                                    }
                                },
                                "201": {
                                    "description": "Created"
                                },
                                "401": {
                                    "description": "Unauthorized"
                                },
                                "403": {
                                    "description": "Forbidden"
                                },
                                "404": {
                                    "description": "Not Found"
                                }
                            },
                            "x-auth-type": "Application & Application User",
                            "x-throttling-tier": "Unlimited"
                        }
                    }

                    apiService.findSwaggerApi().then(
                        function (apiDocs) {
                            console.log("--------update before Api--------");
                            console.log(apiDocs);
                            apiDocs.paths[path] = api;
                            saveSwaggerApi(apiDocs);
                        }
                    ).catch(function (err) {
                        messageService.toast('error', dataset.name + $translate.instant('dts.list.publish_failed') + err);
                        throw err;
                    })

                }

                function findStoreApi() {
                    apiService.findStoreApi().then(
                        function (data) {

                        }
                    ).catch(function (err) {
                        throw err;
                    })
                }


                function saveSwaggerApi(apiDocs) {

                    apiService.saveSwaggerApi(apiDocs).then(
                        function (data) {
                            console.log("--------update after Api--------");
                            console.log(data);
                            messageService.toast('success', dataset.name + $translate.instant('dts.list.publish_success'));
                        }
                    ).catch(function (err) {
                        messageService.toast('error', dataset.name + $translate.instant('dts.list.publish_failed') + err);
                        throw err;
                    })
                }
            }
        }
    }
})();
