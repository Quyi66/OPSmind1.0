/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageImportCtrl', appletManageImportCtrl);

    appletManageImportCtrl.$inject = ['$scope', '$state', '$compile', '$window',
        '$stateParams', '$uibModalInstance', '$location', '$timeout', 'messageService',
        'pageService', 'appletManageService', 'dataTable', '$translate'];

    function appletManageImportCtrl($scope, $state, $compile, $window, $stateParams, $uibModalInstance, $location, $timeout, messageService, pageService, appletManageService, dataTable, $translate) {
        var vm = this;

        $scope.displayTree = false;
        $scope.displayImport = false;
        vm.doImport = doImport;
        vm.cancelImport = cancelImport;
        vm.preUpload = preUpload;
        vm.selectedFile = {};

        function cancelImport() {
            $uibModalInstance.dismiss();
        }

        vm.appletTreeList = [];
        vm.scriptTreeList = [];
        vm.udpAppletList = [];
        vm.paths = [];
        vm.importType = "mod";
        vm.scriptsPath = undefined;
        function getAllNodesData(tree) {
            var result = [];
            function recursiveTraversal(node) {
                result.push(node.toDict());
                if (node.hasChildren()) {
                    node.children.forEach(child => recursiveTraversal(child));
                }
            }

            tree.getRootNode().children.forEach(node => recursiveTraversal(node));
            return result;
        }


        function doImport() {
            var tree = $("#appletTree").fancytree("getTree");
            var selNodes = getAllNodesData(tree);
            if (selNodes) {
                for (var i in selNodes) {
                    var nodeName = selNodes[i];
                    if (nodeName.type !== "folder") {
                        vm.udpAppletList.push(nodeName.data.value);
                    }
                }
            }
            vm.udpAppletList.forEach(e => {e.scriptsDir=vm.scriptsPath});
            appletManageService.importApplets(vm.importType, vm.udpAppletList).then(function (result) {
                messageService.toast("success", $translate.instant("adm.content.data_import_success"));
                $uibModalInstance.dismiss();
            }).catch(function (err) {
                messageService.toast("error", $translate.instant("adm.content.data_import_error"));
            });
        }


        var treeOption = {
            checkbox: false,
            extensions: ["glyph", "wide", "filter"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome5",
                map: {
                    folder: "far fa-folder",
                    folderOpen: "far fa-folder-open",
                    doc: "far fa-file",
                    docOpen: "far fa-file"
                }
            },
            select: function (event, data) {//选择或取消选择
                $scope.displayImport = data.node.selected;
                //强制生效双向绑定
                $scope.$apply();
            }
        };


        //嵌套转换
        function convertDataToFancyTreeNode(rawNodeList) {
            var nodeList = [];
            for (var i in rawNodeList) {
                var rawNode = rawNodeList[i];
                var title = rawNode.name;
                if (title.indexOf("#{") >= 0) {
                    title = $translate.instant(title.substring(2, title.length - 1));
                }
                if(rawNode.zipScriptPath){
                    vm.scriptsPath = rawNode.zipScriptPath;
                }
                var node = {
                    key: rawNode.id,
                    id: rawNode.id,
                    type: rawNode.type,
                    selected: false,
                    title: title,
                    value: rawNode.value
                };
                nodeList.push(node);
                if (rawNode.type === "folder") {
                    node.folder = true;
                    node.expanded = true;
                    if (rawNode.children != null && rawNode.children.length > 0) {
                        node.children = convertDataToFancyTreeNode(rawNode.children);
                    }
                }
            }
            return nodeList;
        }


        function preUpload(file) {
            vm.selectedFile = file;
            if (vm.selectedFile) {
                appletManageService.importAppletAndScripts(vm.selectedFile).then(function (data) {
                    vm.isSaving = false;
                    if (data) {
                        parseApplet(data.Applet);
                        parseScripts(data.Scripts);
                    }
                }).catch(function (err) {
                    vm.isSaving = false;
                    throw new FatalError(err);
                });
            }
        }


        var appletTree;

        function parseApplet(content) {
            vm.appletTreeList = content;
            treeOption.source = convertDataToFancyTreeNode(content);
            if (treeOption.source.length > 0) {
                $scope.appletDisplay = true;
            }
            if (appletTree) {
                appletTree = $("#appletTree").fancytree("getTree");
                appletTree.options.source = treeOption.source;
                appletTree.reload();
            } else {
                appletTree = $("#appletTree").fancytree(treeOption);
            }
        }

        var scriptsTree;

        function parseScripts(content) {
            vm.scriptTreeList = content;
            treeOption.source = convertDataToFancyTreeNode(content);
            if (treeOption.source.length > 0) {
                $scope.scriptsDisplay = true;
            }
            if (scriptsTree) {
                scriptsTree = $("#scriptsTree").fancytree("getTree");
                scriptsTree.options.source = treeOption.source;
                scriptsTree.reload();
            } else {
                scriptsTree = $("#scriptsTree").fancytree(treeOption);
            }
        }
    }
})();
