(function () {
    'use strict';

    angular.module('oplus.adm').controller('TenantConfigImportCtrl', TenantConfigImportCtrl);

    TenantConfigImportCtrl.$inject = ['$scope', '$timeout', 'pageService', '$window', 'tenantConfigService', 'messageService', '$translate'];
    function TenantConfigImportCtrl($scope, $timeout, pageService, $window, tenantConfigService, messageService, $translate) {
        var vm = this;
        $scope.displayTree = false;
        $scope.displayImport = false;

        vm.doImport = doImport;
        vm.parseFile = parseFile;
        vm.selectedFile = {};
        vm.tenantConfigs = {};

        vm.views = {
            name: null,
            title: null,
            update: 0,
            type: null,
            tenantDTO: null,
            udpAppletList: [],
            udpPageList: [],
            dtsDatasetList: [],
            jaoJobDefinitionList: []
        };
        vm.types = [
            {
                label: "系统自动识别组件关系导入",
                value: "2"
            }, {
                label: "根据关联关系导入",
                value: "1"
            }
        ];


        function doImport() {
            var tree = $("#tenantConfigTree").fancytree("getTree");
            var selNodes = tree.getSelectedNodes();
            //Todo 设定当操作类型为根据关系导入时候，无法导入单个组件(page, job, dts)
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
            if (vm.views.type.value === "1") {
                tenantConfigService.importPagesRelation(vm.views).then(function (result) {
                    messageService.toast("success", $translate.instant("adm.content.data_import_success"));
                }).catch(function (err) {
                    messageService.toast("error", $translate.instant("adm.content.data_import_error"));
                });
            } else {
                tenantConfigService.importPagesAnalysis(vm.views).then(function (result) {
                    messageService.toast("success", $translate.instant("adm.content.data_import_success"));
                }).catch(function (err) {
                    messageService.toast("error", $translate.instant("adm.content.data_import_error"));
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
                var node = {
                    key: rawNode.id,
                    id: rawNode.id,
                    type: rawNode.type,
                    selected: false,
                    title: rawNode.name,
                    value: rawNode.value
                };
                nodeList.push(node);
                if (rawNode.type == "folder") {
                    node.folder = true;
                    node.expanded = false;
                    if (rawNode.children != null && rawNode.children.length > 0) {
                        node.children = convertDataToFancyTreeNode(rawNode.children);
                    }
                }
            }
            return nodeList;
        }


        var tree;

        function parseFile(file) {
            vm.selectedFile = file;
            var reader = new $window.FileReader();
            reader.onload = function (ev) {
                $timeout(function () {
                    var content = ev.target.result;
                    vm.tenantConfigs = pageService.parseExportFile(content);
                    treeOption.source = convertDataToFancyTreeNode(vm.tenantConfigs);
                    if (treeOption.source.length > 0) {
                        $scope.displayTree = true;
                    }
                    if (tree) {
                        tree = $("#tenantConfigTree").fancytree("getTree");
                        tree.options.source = treeOption.source;
                        tree.reload();
                    } else {
                        tree = $("#tenantConfigTree").fancytree(treeOption);
                    }
                });

            };
            reader.readAsText(file);
        }


        function init() {
            tenantConfigService.findAllTenantConfigs().then(function (result) {
                vm.tenants = result;
            }).catch(function (err) {
                throw err;
            });
        }

        init();
    }
})();
