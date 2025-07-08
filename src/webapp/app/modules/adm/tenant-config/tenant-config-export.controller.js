(function () {
    'use strict';

    angular.module('oplus.adm').controller('TenantConfigExportCtrl', TenantConfigExportCtrl);

    TenantConfigExportCtrl.$inject = ['$scope', '$timeout', 'tenantConfigService', '$uibModalInstance', 'entity', 'handleType'];
    function TenantConfigExportCtrl($scope, $timeout, tenantConfigService, $uibModalInstance, entity, handleType) {
        var vm = this;
        $scope.displayTree = false;
        vm.doExport = doExport;
        vm.cancelImport = cancelImport;
        vm.tenantConfigs = {};
        vm.allConfigMap = {};
        vm.views = {
            tenantDTO: {},
            udpAppletList: [],
            udpPageList: [],
            dtsDatasetList: [],
            jaoJobDefinitionList: []
        };


        function doExport() {
            var tree = $("#tenantConfigExportTree").fancytree("getTree");
            var selNodes = tree.getSelectedNodes();
            if (selNodes) {
                var selectNodes = [];
                for (var i in selNodes) {
                    var nodeName = selNodes[i];
                    if (nodeName.type != "folder") {
                        var parentNode = nodeName.parent;
                        var parentNodeName = parentNode.title;
                        if (parentNodeName == "Page") {
                            vm.views.udpPageList.push(nodeName.data.value)
                        } else if (parentNodeName == "Applet") {
                            vm.views.udpAppletList.push(nodeName.data.value)
                        } else if (parentNodeName == "DTS") {
                            vm.views.dtsDatasetList.push(nodeName.data.value)
                        } else {
                            vm.views.jaoJobDefinitionList.push(nodeName.data.value)
                        }
                    }
                }
            }
            if(handleType === 1){
                tenantConfigService.exportConfigAnalysis(vm.views).then(function (result) {
                    tenantConfigService.exportPages(result);
                    $uibModalInstance.close();
                }).catch(function (err) {
                    throw err;
                });
            }else{
                tenantConfigService.exportConfigRelation(vm.views).then(function (result) {
                    tenantConfigService.exportPages(result);
                    $uibModalInstance.close();
                }).catch(function (err) {
                    throw err;
                });
            }

        }


        var treeOption = {
            checkbox: true,
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
            }
        };


        //嵌套转换
        function convertDataToFancyTreeNode(rawNodeList) {
            var nodeList = [];
            for (var i in rawNodeList) {
                var rawNode = rawNodeList[i];
                var node = {
                    key: rawNode.id,
                    id: rawNode.id,
                    type: rawNode.type,
                    selected: false,
                    title: rawNode.name,
                    value: rawNode.value
                };

                if (handleType === 2) {

                    if (rawNode.isRoot || rawNode.id === "Applet") {
                        if (rawNode.type == "folder") {
                            node.folder = true;
                            node.expanded = false;
                            if (rawNode.children != null && rawNode.children.length > 0) {
                                node.children = convertDataToFancyTreeNode(rawNode.children);
                            }
                        }
                    }
                    if(rawNode.id !== "Page" && rawNode.id !=="DTS" && rawNode.id  !=="Job"){
                        nodeList.push(node);
                    }
                } else {
                    nodeList.push(node);
                    if (rawNode.type == "folder") {
                        node.folder = true;
                        node.expanded = false;
                        if (rawNode.children != null && rawNode.children.length > 0) {
                            node.children = convertDataToFancyTreeNode(rawNode.children);
                        }
                    }
                }


            }
            return nodeList;
        }

        function cancelImport() {
            $uibModalInstance.dismiss();
        }


        function initTree() {
            $timeout(function () {
                vm.tenantConfigs = entity;
                vm.views.tenantDTO = vm.tenantConfigs.tenantDTO;
                treeOption.source = convertDataToFancyTreeNode(vm.tenantConfigs);
                if (treeOption.source.length > 0) {
                    $scope.displayTree = true;
                }
                $("#tenantConfigExportTree").fancytree(treeOption);
            });
        }

        initTree()
    }
})();
