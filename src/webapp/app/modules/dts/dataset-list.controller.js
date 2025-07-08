// /**
//  *
//  * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017
//  */
// (function () {
//     'use strict';

//     /**
//      * @ngdoc
//      * @name DatasetEditCtrl
//      */
//     angular.module('oplus.dts').controller('DatasetListCtrl', DatasetListCtrl);

//     DatasetListCtrl.$inject = ['$scope', '$rootScope', '$compile', '$state', '$stateParams', 'messageService', 'datasourceService', 'datasetService', 'apiService', '$uibModal'];

//     /**
//      *
//      * @param $scope
//      * @param $rootScope
//      * @param $compile
//      * @param $state
//      * @param $stateParams
//      * @param messageService {messageService}
//      * @param datasourceService {datasourceService}
//      * @param datasetService {datasetService}
//      * @param apiService
//      * @param $uibModal
//      * @constructor
//      */
//     function DatasetListCtrl($scope, $rootScope, $compile, $state, $stateParams, messageService, datasourceService, datasetService, apiService, $uibModal) {

//         $scope.createDataset = createDataset;
//         $scope.editDataset = editDataset;
//         $scope.copyDataset = copyDataset;
//         $scope.delDataset = delDataset;
//         $scope.onAppletSelectorChange = onAppletSelectorChange;
//         $scope.showRestApi = showRestApi;

//         $scope.appletCode = '';

//         var datasourceName = $stateParams['datasourceName'];
//         var tempType = $stateParams['tempType'];
//         var datasetId = $stateParams['id'];
//         var isNew = $state.current.url.indexOf("new") != -1;
//         findByDatasource(datasourceName);

//         function findByDatasource(datasourceName) {
//             datasetService.findByDatasource(datasourceName, { appletCode: $scope.appletCode }).then(function (data) {
//                 $scope.datasets = data;
//                 if (!isNew) {
//                     if (datasetId) {
//                         angular.forEach($scope.datasets, function (obj) {
//                             if (datasetId == obj.id) {
//                                 setTimeout(function () {
//                                     editDataset(obj);
//                                 }, 200)
//                             }
//                         })
//                     } else {
//                         if ($scope.datasets.length > 0) {
//                             setTimeout(function () {
//                                 //       editDataset($scope.datasets[0]);
//                             }, 200)
//                         }
//                     }
//                 } else {
//                     setTimeout(function () {
//                         createDataset();
//                     }, 200)
//                 }

//             });
//         }


//         function createDataset() {
//             var folders = ["数据库", "服务器", "接口", ""];
//             if (datasourceName && _.indexOf(folders, datasourceName) == -1) {
//                 $state.go('app.dts.datasource_datasets.dts_dataset_new', {
//                     type: tempType,
//                     datasourceName: datasourceName
//                 });
//             }
//         }

//         function editDataset(dataset) {
//             angular.forEach($scope.datasets, function (obj) {
//                 obj.selected = false;
//             })
//             dataset.selected = true;
//             $state.go('app.dts.datasource_datasets.dts_dataset_edit', {type: dataset.type, id: dataset.id});
//         }

//         function copyDataset(dataset) {

//             messageService.prompt("", "请输入code", "", function (value) {
//                 datasetService.copyDataset(dataset.id, value).then(
//                     function (obj) {
//                         messageService.toast('success', dataset.name + '复制成功！');
//                         setTimeout(function () {
//                             $state.go('app.dts.datasource_datasets.dts_dataset_edit', {
//                                 type: obj.type,
//                                 id: obj.id
//                             }, {reload: true});
//                         }, 200);
//                     }
//                 )
//             }, "");

//         }

//         function delDataset(dataset) {

//             messageService.confirm('删除', '确认删除源' + dataset.name + '？', function () {
//                 datasetService.deleteDataset(dataset.id).then(function () {
//                     messageService.toast('success', dataset.name + '删除成功！');
//                     $state.go("app.dts.datasource_datasets", {
//                         datasourceName: datasourceName,
//                         tempType: tempType
//                     }, {reload: true});
//                 });

//             }, function () {

//             });

//         }

//         function onAppletSelectorChange(applet) {
//             $scope.appletCode = applet.name;
//             findByDatasource(datasourceName);
//         }

//         function showRestApi(dataset) {

//             var modalInstance = $uibModal.open({
//                 animation: false,
//                 templateUrl: 'app/modules/dts/rest-share.html',
//                 controller: ['dataset', '$scope', RestApiCtrl],
//                 controllerAs: '$ctrl',
//                 resolve: {
//                     dataset: function () {
//                         return dataset;
//                     }
//                 },
//                 size: 'md'
//             });

//             function RestApiCtrl(dataset, $scope) {
//                 var prefix = window.$oplus.appConfig.apiBaseUrls.dts;
//                 if (prefix) {
//                     prefix += "/";
//                 } else {
//                     prefix = window.location.protocol + "//" + window.location.host + window.location.pathname;
//                 }
//                 $scope.restApi = prefix + "api/dts/query/data/" + dataset.code;

//                 var getUrl = $scope.restApi;
//                 var params = {};

//                 if (dataset.params) {
//                     getUrl += "?params=%7B";
//                     angular.forEach(dataset.params, function (detail, key) {
//                         if (detail.type == "array") {
//                             params[key] = detail.defaultValue.split(",");
//                         } else {
//                             params[key] = detail.defaultValue;
//                         }

//                     })
//                     var paramsToString = angular.toJson(params);
//                     getUrl += paramsToString.substring(1, paramsToString.length - 1);
//                     getUrl += "%7D";
//                 }

//                 $scope.getUrl = getUrl;
//                 $scope.params = {"params": params};

//                 $scope.curlGetUrl = 'curl -X GET --header "Accept: */*"  "' + encodeURI(getUrl) + '"';
//                 $scope.curlPostUrl = 'curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d \'' + angular.toJson($scope.params) + '\' "' + $scope.restApi + '"';


//                 $scope.dismissModal = function () {
//                     modalInstance.close();
//                 }

//                 $scope.publish = function () {
//                     console.log(dataset);

//                     var path = "/api/dts/query/data/" + dataset.code;
//                     var api = {
//                         "get": {
//                             "tags": [
//                                 dataset.tags
//                             ],
//                             "summary": dataset.name,
//                             "description": dataset.description,
//                             "operationId": "getMetaColumnUsingGET",
//                             "consumes": [
//                                 "application/json"
//                             ],
//                             "produces": [
//                                 "*/*"
//                             ],
//                             "parameters": [
//                                 {
//                                     "name": "orderBy",
//                                     "in": "query",
//                                     "description": "排序",
//                                     "required": false,
//                                     "type": "string"
//                                 },
//                                 {
//                                     "name": "page",
//                                     "in": "query",
//                                     "description": "第几页",
//                                     "required": false,
//                                     "type": "integer",
//                                     "format": "int32"
//                                 },
//                                 {
//                                     "name": "size",
//                                     "in": "query",
//                                     "description": "每页条数",
//                                     "required": false,
//                                     "type": "integer",
//                                     "format": "int32"
//                                 },
//                                 {
//                                     "name": "params",
//                                     "in": "query",
//                                     "description": "请求参数",
//                                     "required": false,
//                                     "type": "string",
//                                     "default": angular.toJson(params)
//                                 },
//                                 {
//                                     "name": "filter",
//                                     "in": "query",
//                                     "description": "搜索",
//                                     "required": false,
//                                     "type": "string"
//                                 }
//                             ],
//                             "responses": {
//                                 "200": {
//                                     "description": "OK",
//                                     "schema": {
//                                         "type": "object"
//                                     }
//                                 },
//                                 "401": {
//                                     "description": "Unauthorized"
//                                 },
//                                 "403": {
//                                     "description": "Forbidden"
//                                 },
//                                 "404": {
//                                     "description": "Not Found"
//                                 }
//                             },
//                             "x-auth-type": "Application & Application User",
//                             "x-throttling-tier": "Unlimited"
//                         },
//                         "post": {
//                             "tags": [
//                                 dataset.tags
//                             ],
//                             "summary": dataset.name,
//                             "description": path,
//                             "operationId": "queryMetaColumnUsingPOST",
//                             "consumes": [
//                                 "application/json"
//                             ],
//                             "produces": [
//                                 "*/*"
//                             ],
//                             "parameters": [
//                                 {
//                                     "in": "body",
//                                     "name": "options",
//                                     "description": "options",
//                                     "required": false,
//                                     "schema": {
//                                         "type": "object",
//                                         "properties": {
//                                             "filter": {
//                                                 "type": "string",
//                                                 "description": "过滤"
//                                             },
//                                             "orderBy": {
//                                                 "type": "string",
//                                                 "description": "排序列：name desc, title asc"
//                                             },
//                                             "page": {
//                                                 "type": "integer",
//                                                 "format": "int32",
//                                                 "description": "分页页码"
//                                             },
//                                             "params": {
//                                                 "type": "object",
//                                                 "default": angular.toJson(params),
//                                                 "description": "查询参数{'key'：'value'，'key1'：'value1'}"
//                                             },
//                                             "size": {
//                                                 "type": "integer",
//                                                 "format": "int32",
//                                                 "description": "每页条数"
//                                             }
//                                         },
//                                     }
//                                 }
//                             ],
//                             "responses": {
//                                 "200": {
//                                     "description": "OK",
//                                     "schema": {
//                                         "type": "object"
//                                     }
//                                 },
//                                 "201": {
//                                     "description": "Created"
//                                 },
//                                 "401": {
//                                     "description": "Unauthorized"
//                                 },
//                                 "403": {
//                                     "description": "Forbidden"
//                                 },
//                                 "404": {
//                                     "description": "Not Found"
//                                 }
//                             },
//                             "x-auth-type": "Application & Application User",
//                             "x-throttling-tier": "Unlimited"
//                         }
//                     }

//                     apiService.findSwaggerApi().then(
//                         function (apiDocs) {
//                             console.log("--------update before Api--------");
//                             console.log(apiDocs);
//                             apiDocs.paths[path] = api;
//                             saveSwaggerApi(apiDocs);
//                         }
//                     ).catch(function (err) {
//                         messageService.toast('error', dataset.name + '发布失败！' + err);
//                         throw err;
//                     })

//                 }

//                 function findStoreApi() {
//                     apiService.findStoreApi().then(
//                         function (data) {

//                         }
//                     ).catch(function (err) {
//                         throw err;
//                     })
//                 }


//                 function saveSwaggerApi(apiDocs) {

//                     apiService.saveSwaggerApi(apiDocs).then(
//                         function (data) {
//                             console.log("--------update after Api--------");
//                             console.log(data);
//                             messageService.toast('success', dataset.name + '发布成功！');
//                         }
//                     ).catch(function (err) {
//                         messageService.toast('error', dataset.name + '发布失败！' + err);
//                         throw err;
//                     })

//                 }

//             }


//         }


//     }
// })();
