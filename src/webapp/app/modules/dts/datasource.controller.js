/**
 * @Deprecated Use {widgets/datasourceList}
 */ 

// /**
//  * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
//  */
// (function () {
//     'use strict';

//     angular.module('oplus.dts').controller('DatasourceCtrl', DatasourceCtrl);

//     DatasourceCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$uibModal', 'messageService', 'datasourceService', 'datasetService', 'apiService', 'currentUser'];

//     /**
//      *
//      * @param $scope
//      * @param $state
//      * @param $uibModal
//      * @param messageService {messageService}
//      * @constructor
//      */
//     function DatasourceCtrl($scope, $rootScope, $state, $stateParams, $timeout, $uibModal, messageService, datasourceService, datasetService, apiService, currentUser) {

//         var datasourceName = $stateParams['datasourceName'];

//         var activeKey = "";
//         $scope.options = {
//             // extensions: ["glyph", "wide"],
//             source: [],
//             selectMode: 3,
//             glyph: {
//                 preset: "awesome5",
//                 map: {
//                     doc:'fa fa-table',
//                     docOpen:'fa fa-table',
//                     folder: "fa fa-dice-d20",
//                     folderOpen: "fa fa-dice-d20"
//                 }
//             },
//             activate: function (event, data) {
//                 //     $state.go("app.dts");
//                 $scope.selectNode = data.node.data;
//                 if ($scope.selectNode.pName != "") {
//                     // findByDatasource($scope.selectNode.name);
//                     $state.go("app.dts.datasource_datasets", {
//                         datasourceName: $scope.selectNode.name,
//                         tempType: $scope.selectNode.tempType
//                     });
//                 }
//             }
//         }


//         $scope.sourceTypeList = [
//             {
//                 "pId": "",
//                 "pName": "",
//                 "type": "jdbc",
//                 "name": "JDBC数据库",
//                 "id": "jdbc",
//                 "title": "JDBC数据库",
//                 "folder": true,
//                 "children": []
//             },
//             {
//                 "pId": "",
//                 "pName": "",
//                 "type": "join",
//                 "name": "多数据集",
//                 "id": "join",
//                 "title": "多数据集",
//                 "folder": true,
//                 "children": []
//             },
//             {
//                 "pId": "",
//                 "pName": "",
//                 "type": "es",
//                 "name": "ElasticSearch",
//                 "id": "es",
//                 "title": "ElasticSearch",
//                 "folder": true,
//                 "children": []
//             },
//             {
//                 "pId": "",
//                 "pName": "",
//                 "type": "file",
//                 "name": "文件",
//                 "id": "file",
//                 "title": "文件",
//                 "folder": true,
//                 "children": []
//             },
//             {
//                 "pId": "",
//                 "pName": "",
//                 "type": "mongo",
//                 "name": "MongoDB",
//                 "id": "mongo",
//                 "title": "MongoDB",
//                 "folder": true,
//                 "children": []
//             },
//             {
//                 "pId": "",
//                 "pName": "",
//                 "type": "hbase",
//                 "name": "HBase",
//                 "id": "hbase",
//                 "title": "HBase",
//                 "folder": true,
//                 "children": []
//             },
//             {
//                 "pId": "",
//                 "pName": "",
//                 "type": "rest",
//                 "name": "REST API",
//                 "id": "rest",
//                 "title": "REST API",
//                 "folder": true,
//                 "children": []
//             },
//             {
//                 "pId": "",
//                 "pName": "",
//                 "type": "orientdb",
//                 "name": "OrientDB",
//                 "id": "orient",
//                 "title": "OrientDB",
//                 "folder": true,
//                 "children": []
//             }
//         ];

//         $scope.sourceType = [];


//         $scope.createDatasource = createDatasource;

//         init();

//         function init() {
//             initSourceType();
//             initSource();
//         }

//         function initSourceType() {
//             angular.forEach($scope.sourceTypeList, function (obj) {
//                 if ($scope.dts.sourceTypes.indexOf(obj.type) != -1) {
//                     $scope.sourceType.push(obj);
//                 }
//             })
//         }

//         function initSource() {
//             initFancyTree();
//             initDatasource();
//         }


//         function findByDatasource() {
//             datasetService.findByDatasource($scope.selectNode.name).then(function (data) {
//                 $scope.datasets = data;
//             });
//         }

//         function initDatasource() {

//             datasourceService.findAllDatasources().then(function (data) {

//                 var jdbcList = [];
//                 var joinList = [];
//                 var esList = [];
//                 var fileList = [];
//                 var mongoList = [];
//                 var hbaseList = [];
//                 var restList = [];
//                 var orientdbList = [];

//                 angular.forEach(data, function (obj) {
//                     obj['key'] = obj.id;
//                     if (obj['type'] == 'jdbc') {
//                         obj["pId"] = "jdbc";
//                         obj["pName"] = "数据库";
//                         obj["tempType"] = "jdbc";
//                         obj["title"] = obj.name;
//                         jdbcList.push(obj);
//                     } else if (obj['type'] == 'join') {
//                         obj["pId"] = "join";
//                         obj["pName"] = "多数据集";
//                         obj["tempType"] = "join";
//                         obj["title"] = obj.name;
//                         joinList.push(obj);
//                     } else if (obj['type'] == 'es') {
//                         obj["pId"] = "es";
//                         obj["pName"] = "ElasticSearch";
//                         obj["tempType"] = "es";
//                         obj["title"] = obj.name;
//                         esList.push(obj);
//                     } else if (obj['type'] == 'file') {
//                         obj["pId"] = "file";
//                         obj["pName"] = "文件";
//                         obj["tempType"] = "file";
//                         obj["title"] = obj.name;
//                         fileList.push(obj);
//                     } else if (obj['type'] == 'mongo') {
//                         obj["pId"] = "mongo";
//                         obj["pName"] = "MongoDB";
//                         obj["tempType"] = "mongo";
//                         obj["title"] = obj.name;
//                         mongoList.push(obj);
//                     } else if (obj['type'] == 'hbase') {
//                         obj["pId"] = "hbase";
//                         obj["pName"] = "HBase";
//                         obj["tempType"] = "hbase";
//                         obj["title"] = obj.name;
//                         hbaseList.push(obj);
//                     } else if (obj['type'] == 'rest') {
//                         obj["pId"] = "rest";
//                         obj["pName"] = "REST API";
//                         obj["tempType"] = "rest";
//                         obj["title"] = obj.name;
//                         restList.push(obj);
//                     } else if (obj['type'] == 'orientdb') {
//                         obj["pId"] = "orientdb";
//                         obj["pName"] = "OrientDB";
//                         obj["tempType"] = "orientdb";
//                         obj["title"] = obj.name;
//                         orientdbList.push(obj);
//                     }

//                     if (datasourceName) {
//                         if (obj["name"] == datasourceName) {
//                             activeKey = obj.id;
//                         }
//                     }


//                 })

//                 angular.forEach($scope.sourceType, function (obj, index) {
//                     if (obj['type'] == 'jdbc') {
//                         $scope.sourceType[index].children = jdbcList;
//                     } else if (obj['type'] == 'join') {
//                         $scope.sourceType[index].children = joinList;
//                     } else if (obj['type'] == 'es') {
//                         $scope.sourceType[index].children = esList;
//                     } else if (obj['type'] == 'file') {
//                         $scope.sourceType[index].children = fileList;
//                     } else if (obj['type'] == 'mongo') {
//                         $scope.sourceType[index].children = mongoList;
//                     } else if (obj['type'] == 'hbase') {
//                         $scope.sourceType[index].children = hbaseList;
//                     } else if (obj['type'] == 'rest') {
//                         $scope.sourceType[index].children = restList;
//                     } else if (obj['type'] == 'orientdb') {
//                         $scope.sourceType[index].children = orientdbList;
//                     }
//                 })


//                 if (activeKey == "" && data.length != 0) {
//                     activeKey = data[0].id;
//                 }

//                 changeFancyTree();

//             }).catch(function (err) {
//                 throw err;
//             })
//         }

//         function createDatasource() {

//         }


//         function initFancyTree() {

//             $scope.options["source"] = $scope.sourceType;

//             $('#dts-datasource-tree').fancytree(_.merge({}, window.$oplus.fancytreeDefault, $scope.options));
//             //$("#dts-datasource-tree").fancytree("getTree").activateKey(activeKey);
//             $("#dts-datasource-tree").fancytree("getRootNode").visit(function (node) {
//                 node.setExpanded(true);
//             });

//             $.contextMenu({
//                 selector: "#dts-datasource-tree span.fancytree-title",
//                 events: {
//                     show: function (opt) {
//                         var node = $.ui.fancytree.getNode(opt.$trigger);
//                         if (node.folder) {
//                             return false;
//                         }
//                         return currentUser.hasPermission('dts:edit')
//                     }
//                 },
//                 items: {
//                     "edit": {
//                         name: "编辑", icon: "edit",
//                         callback: function (key, opt) {
//                             var node = $.ui.fancytree.getNode(opt.$trigger);
//                             editDataResource(node.data.id);
//                         }
//                     },
//                     "delete": {
//                         name: "删除", icon: "delete",
//                         callback: function (key, opt) {
//                             var node = $.ui.fancytree.getNode(opt.$trigger);
//                             delDataResource(node.data);
//                         }
//                     }
//                 }
//             });

//         }

//         function editDataResource(id) {
//             $state.go("app.dts_datasource_edit", {id: id})
//         }

//         function delDataResource(datasource) {
//             activeKey = datasource.pId;
//             messageService.confirm('删除', '确认删除数据源' + datasource.name + '？', function () {
//                 datasourceService.deleteDatasource(datasource.id).then(function () {
//                     initSource();
//                 });

//             }, function () {

//             });
//         }

//         function changeFancyTree() {
//             var tree = $("#dts-datasource-tree").fancytree("getTree");
//             tree.options.source = $scope.sourceType;
//             tree.reload();

//             tree.activateKey(activeKey + "");
//             $("#dts-datasource-tree").fancytree("getRootNode").visit(function (node) {
//                 node.setExpanded(true);
//             });
//         }

//         $scope.isShowSourceType = function (sourceType) {
//             console.log(sourceType);
//             return true;
//         }

//     }


// })();
