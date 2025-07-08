(function() {
    'use strict';

    angular.module('oplus.adm').controller('DictController', DictController);

    DictController.$inject = ['$scope','$state','Dict','messageService'];

    function DictController($scope,$state,Dict,messageService) {

        var vm = this;
        vm.dict = {};
        vm.save = save;
        vm.del = del;
        vm.createModule = createModule;
        vm.isDict = false;
        vm.pLabel = "";

        var map = {};
        var dictList = [];
        var mapDicts = {};
        var activeKey = "";

        var treeOption = {
            checkbox: false,
            extensions: ["glyph", "wide", "filter"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome4",
                map: {
                    folder: "fa-folder-o",
                    folderOpen: "fa-folder-open-o",
                    doc: "fa-file-text",
                    docOpen: "fa-file-text"
                }
            },
            filter: {
                autoApply: true,   // Re-apply last filter if lazy data is loaded
                autoExpand: false, // Expand all branches that contain matches while filtered
                counter: true,     // Show a badge with number of matching child nodes near parent icons
                fuzzy: false,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
                hideExpandedCounter: true,  // Hide counter badge if parent is expanded
                hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
                highlight: true,   // Highlight matches by wrapping inside <mark> tags
                leavesOnly: false, // Match end nodes only
                nodata: true,      // Display a 'no data' status node if result is empty
                mode: "dimm"       // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
            },
            activate: function(event, data) {
                $scope.$apply(function () {
                    vm.isDict = true;
                    vm.dict = mapDicts[data.node.data.id];
                    if(data.node.data.pid) {
                        vm.pLabel = mapDicts[data.node.data.pid].label;
                    }else{
                        vm.pLabel = "模块目录";
                    }
                });
            }
        };

        initDictTree();

        function initDictTree() {
            Dict.query(function(data) {
                treeOption.source = convertDataToFancyTreeNode(data);
                $("#dictTree").fancytree(treeOption);
                $.contextMenu({
                    selector: "#dictTree span.fancytree-title",
                    items: {
                        "add": {name: "新增", disabled:function(key,opt){
                                var node = $.ui.fancytree.getNode(opt.$trigger);
                                if(node.type == "1") {
                                    return true;
                                }
                                return false;
                            },
                            callback: function(key, opt){
                                var node = $.ui.fancytree.getNode(opt.$trigger);

                                $scope.$apply(function () {
                                    vm.pLabel = node.data.label;
                                    var sort = getSort(node.data.id);
                                    vm.dict = {
                                        disabled:0,
                                        sort:sort,
                                        pid:node.data.id,
                                        type:"1"
                                    }
                                })
                            }
                        },
                        "delete": {name: "删除",
                            callback: function(key, opt){
                                var node = $.ui.fancytree.getNode(opt.$trigger);
                                del(node.data);
                            }
                        },
                        "url": {name: "API",disabled:function(key,opt){
                            var node = $.ui.fancytree.getNode(opt.$trigger);
                            if(node.type == "1") {
                                return true;
                            }
                            return false;
                         },
                            callback: function(key, opt){
                                var node = $.ui.fancytree.getNode(opt.$trigger);
                                showRestApi(node.data);
                            }
                        }
                    }
                });
                $("#searchDict").keyup(function(e){
                    var n,
                        tree = $.ui.fancytree.getTree(),
                        args = "autoApply autoExpand fuzzy hideExpanders highlight leavesOnly nodata".split(" "),
                        opts = {},
                        filterFunc = $("#branchMode").is(":checked") ? tree.filterBranches : tree.filterNodes,
                        match = $(this).val();
                    if(match) {
                        $.each(args, function(i, o) {
                            opts[o] = $("#" + o).is(":checked");
                        });
                        opts.mode = $("#hideMode").is(":checked") ? "hide" : "dimm";
                        if(e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === ""){
                            $("button#btnResetSearch").click();
                            return;
                        }
                        if($("#regex").is(":checked")) {
                            // Pass function to perform match
                            n = filterFunc.call(tree, function(node) {
                                return new RegExp(match, "i").test(node.title);
                            }, opts);
                        } else {
                            // Pass a string to perform case insensitive matching
                            n = filterFunc.call(tree, match, opts);
                        }
                        $("button#btnResetSearch").attr("disabled", false);
                        $("span#matches").text("(" + n + " matches)");
                    }else{
                        tree.clearFilter();
                    }
                }).focus();
            });
        }

        function refreshDictTree() {
            map = {};
            dictList = [];
            mapDicts = {};
            Dict.query(function(data) {
                var tree = $("#dictTree").fancytree("getTree");
                tree.options.source= convertDataToFancyTreeNode(data);
                tree.reload();
                setTimeout(function () {
                    tree.activateKey(activeKey);
                },300)
            });
        }

        function convertDataToFancyTreeNode(data) {

            data.forEach(function (item) {
                map[item.id] = item;
            });
            mapDicts = angular.copy(map);

            data.forEach(function (item) {
                item["key"] = item.id;
                item["id"] = item.id;
                item["type"] = item.type;
                item["title"] = item.label;
                item["selected"] = false;
                //0 folder 1 dict
                if (item.type == "0") {
                    item["folder"] = true;
                    item["expanded"] = false;
                }
            });

            data.forEach(function (item) {
                var parent = map[item.pid];
                if (parent) {
                    (parent.children || ( parent.children = [] )).push(item);
                } else {
                    dictList.push(item);
                }
            });

            return dictList;

        }



        function save () {
            if (vm.dict.id !== null) {
                Dict.update(vm.dict, onSaveSuccess, onSaveError);
            } else {
                Dict.save(vm.dict, onSaveSuccess, onSaveError);
            }
        }

        function del(dict){
            var isDel =confirm("确定删除"+dict.label+"吗？");
            if (isDel) {
                activeKey = vm.dict.pid;
                var idList = [];
                idList.push(vm.dict.id);
                var children = map[vm.dict.id].children;

                if(vm.dict.type == "0" && children) {
                    pushChildrenIds(children,idList);
                }

                Dict.delDicts(idList).then(
                    function () {
                        refreshDictTree();
                    },function () {

                    }
                )

            }
        }

        function pushChildrenIds(children,idList) {
            angular.forEach(children,function (obj) {
                idList.push(obj.id);
                if (obj.type == "0") {
                    if (obj.children != null && obj.children.length > 0) {
                        pushChildrenIds(obj.children,idList);
                    }
                }
            })
        }
        
        function getSort(id) {

            var sort = 0;

            var mapSorts = angular.copy(dictList);
            if(id) {
                mapSorts = angular.copy(map[id].children);
            }

            var dictObj = {sort:0};
            angular.forEach(mapSorts,function (obj) {

                if(!id) {
                    if(!obj.pid) {
                        dictObj = obj;
                    }
                }else{
                    dictObj = obj;
                }
            })

            sort = Number(dictObj.sort)+1;

            return sort;

        }


        function createModule() {
            activeKey = "";
            var tree = $("#dictTree").fancytree("getTree");
            tree.activateKey(activeKey);
            var sort = getSort(null);
            vm.isDict = true;
            vm.dict = {type:"0",disabled:0,sort:sort}
            vm.pLabel = "模块目录";
        }

        function onSaveSuccess (data) {
            activeKey = data.id;
            messageService.toast('success', 'Saved');
            refreshDictTree();
        }

        function onSaveError (error) {
            messageService.toast('error', error.data.title);
            refreshDictTree();
        }



        function showRestApi(dict) {
            $state.go("dict.api",{id:dict.id});
        }
     }

})();
