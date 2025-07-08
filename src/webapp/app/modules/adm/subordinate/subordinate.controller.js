(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('SubordinateController', SubordinateController);

    SubordinateController.$inject = ['$state', 'Subordinate'];

    function SubordinateController($state, Subordinate) {

        var vm = this;

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
                    doc: "far fa-user",
                    docOpen: "far fa-user"
                }
            },
            filter: {  // override default settings
                counter: false, // No counter badges
                mode: "hide",  // "dimm": Grayout unmatched nodes, "hide": remove unmatched nodes
                autoExpand: true,
                leavesOnly: true
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
                    title: rawNode.name
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


        function init() {
            Subordinate.getSubordinateTree().then(function (result) {
                treeOption.source = convertDataToFancyTreeNode(result.data);
                $("#subordinateTree").fancytree(treeOption);
            });
        }

        init();
    }
})();
