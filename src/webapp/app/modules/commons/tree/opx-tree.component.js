/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2022/01/08
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name opxTree
     * @description
     * A generic tree builder
     * @usage
     * ```
     * <opx-tree ng-model="array"
     *           tree-config="{data:[],selector:string,onClickNode:function,nodeRender:function}">
     * @param {[string]=} ngModel Two-way binding model of selected nodes.
     * Array of node path or CSV string of node path
     * @param {object} treeConfig Config of the tree
     * @param {*} treeConfig.data Data for the tree. It can be one of following format:
     * - a function returns array, object or promise. If it returns promise, the promise result should be array or object as well.
     * - an array:  each item is a node
     * - an object: only support dts query result format object, i.e. `{total:number, records:[{}]}`. Each item in `records` is a node
     * @param {function(string)} treeConfig.onClickNode Callback function when activate/click a node. Argument is node key.
     * @param {function(object)} treeConfig.nodeRender
     * @param {string} treeConfig.selector "multiple" or "single"
     * @param {function} selectionData
     * ```
     */
    angular.module('oplus.commons').component('opxTree', {
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            treeConfig: '<',
            selectedNodes: '=ngModel'
        },
        templateUrl: 'app/modules/commons/tree/opx-tree.component.html',
        controller: ['$q', '$scope', '$translate', OpxTreeCtrl]
    });

    /**
     *
     * @param $q
     * @param $scope
     * @param {$translate} $translate
     * @constructor
     */
    function OpxTreeCtrl($q, $scope, $translate) {
        var that = this;
        this.treeId = _.uniqueId('js-group-tree-');
        var defaultConfig = {
            rootNodeTitle: '~',
            dataAlgorithm: 'ByPath',
            algorithmConfig: {
                pathField: 'path',
                pathSeparator: '/'
            },
            selector: '',
        };
        that.treeConfig = _.merge({}, defaultConfig, that.treeConfig);
        var pathConfig = that.treeConfig.algorithmConfig;
        var normPathField = '__path';

        function getTreeElem() {
            return $('#' + that.treeId);
        }

        $scope.$watch('$ctrl.treeConfig', function (newVal, oldVal) {
            if (!newVal) {
                return;
            }
            onInit(newVal);
        }, true);
        $scope.$on('$destroy', function () {
            var tree = $.ui.fancytree.getTree(getTreeElem());
            if (tree) {
                // console.log('Destroy tree: %o', tree);
                tree.destroy();
            }
        });

        /**
         *
         * @param {function|[]|object} dataFn
         * @return {Promise<[object]>} Actual data for tree nodes
         */
        function loadAndNormalizeData(dataFn) {
            var d = $q.defer();
            if (angular.isFunction(dataFn)) {
                var result = dataFn();
                // Data is a function returning promise
                if (result && angular.isFunction(result.then)) {
                    result.then(function (data) {
                        d.resolve(normalizeData(data));
                    }).catch(function (err) {
                        d.reject(err);
                    })
                } else {
                    d.resolve(normalizeData(result));
                }
            } else {
                d.resolve(normalizeData(dataFn));
            }
            return d.promise;

            function normalizeData(data) {
                // data = [
                //     {"title": "Node 1", "key": "1", "folder": true, "path": "/Node1"},
                //     {
                //         "title": "Folder 2",
                //         "key": "2",
                //         "folder": true,
                //         "path": "/Folder2",
                //         "children": [
                //             {"title": "Node 2.1", "key": "3", "path": "/Folder2/Node2.1",},
                //             {"title": "Node 2.2", "key": "4", "path": "/Folder2/Node2.2",}
                //         ]
                //     },
                //     {
                //         "title": "Folder3",
                //         "key": "3",
                //         "folder": true,
                //         "path": "/Folder2/Folder3",
                //         "children": [
                //             {"title": "Node 2.1", "key": "3", "path": "/Folder2/Node2.1",},
                //             {"title": "Node 2.2", "key": "4", "path": "/Folder2/Node2.2",}
                //         ]
                //     }
                // ];

                if (angular.isArray(data)) {
                    return data;
                } else if (isOplusDtsFormat(data)) {
                    return data.records;
                }
                throw new TypeError('Unsupported data format for tree');
            }

            /**
             *
             * @param {records:[],total:number} data
             * @return {boolean}
             */
            function isOplusDtsFormat(data) {
                return angular.isObject(data) && angular.isArray(data.records) && angular.isNumber(data.total);
            }
        }

        function onInit(treeConfig) {
            loadAndNormalizeData(treeConfig.data).then(function (data) {
                // console.log('loadData: data=%o', data);
                createTree(data);
                if (that.ngModelCtrl) {
                    // Specify how UI should be updated. Triggered by $modelValue change
                    // $modelValue -> $formatters -> $viewValue -> $render
                    that.ngModelCtrl.$render = function () {
                        // Use $modelValue instead when need detect model change from outside.
                        // Use that.selectedNodes can not reflect chagne immediately. Maybe there is delay to digest?
                        var tree = $.ui.fancytree.getTree(getTreeElem());
                        if (tree) {
                            tree.visit(function (node) {
                                node.setSelected(_.indexOf(that.ngModelCtrl.$modelValue, node.key) > -1);
                            });
                        }
                    };
                }
            }).catch(function (err) {
                throw err;
            });
        }

        /**
         *
         * @param {[{"pathField":string}]} records With path key
         */
        function createTree(records) {
            console.log("records : ", records);
            var treeNodes;
            if (that.treeConfig.dataAlgorithm === 'ByPath') {
                treeNodes = buildTreeNodesFromRecordsByPath(records);
            }
            else if (that.treeConfig.dataAlgorithm === 'Normal') {
                treeNodes = records;
            }
            else {
                throw new Error('ProgramError: Unsupported tree data algorithm "' + that.treeConfig.dataAlgorithm + '"');
            }
            var addAll = !!that.treeConfig.insertAllNode;
            if (addAll) {
                var keyOfAll = '@@';
                var nodeOfAll = {
                    title: $translate.instant('acm.common.list.all'),
                    key: keyOfAll,
                    value: keyOfAll,
                    // assetType: that.assetType,
                    icon: 'fa fa-folders text-muted',
                    directory: false
                };
                treeNodes.unshift(nodeOfAll);
            }
            var treeElem = getTreeElem();
            if (that.treeConfig.selector === 'multiple' || that.treeConfig.selector === 'single') {
                treeElem.addClass('op-as-selector');
            }
            renderFancytree(treeElem, treeNodes);
        }

        /**
         * Convert to fancytree data
         * [Pass Data with the 'source' Option](https://github.com/mar10/fancytree/wiki/TutorialLoadData#pass-data-with-the-source-option)
         * @param {[]} records
         * @return {[NodeData]} Array of Fancytree [NodeData](https://wwwendt.de/tech/fancytree/doc/jsdoc/global.html#NodeData)
         */
        function buildTreeNodesFromRecordsByPath(records) {
            var leadingSeparator = pathConfig.leadingSeparator;
            var pathField = pathConfig.pathField;

            console.log("leadingSeparator: ", leadingSeparator);
            console.log("pathField: ", pathField);
            var absPaths = _.map(records, function (o) {
                // Assign path to another field, avoid modifying original path value
                o[normPathField] = o[pathField];
                return o[normPathField];
            });
            console.log("absPaths: ", absPaths);
            if (angular.isUndefined(leadingSeparator)) {
                if (absPaths.length > 0) {
                    pathConfig.leadingSeparator = absPaths[0].indexOf(pathConfig.pathSeparator) === 0;
                }
            }
            if (leadingSeparator) {
                records.forEach(function (o) {
                    // Normalize path. If path has leading separator, the root path (e.g., `/`) shall be normalized as ''
                    if (o[normPathField] === pathConfig.pathSeparator) {
                        o[normPathField] = '';
                    }
                });
            }
            var treeUtil = new TreeDataUtil(pathConfig.pathSeparator);
            var treeNodes = treeUtil.pathToHierarchy(absPaths, {
                    segmentField: '__pathPart',
                    childrenField: 'children',
                    leadingSeparator: leadingSeparator
                },
                function dataRender(node, pathSegment, fullPath) {
                    node['data'] = _.find(records, function (o) {
                        return o[normPathField] === fullPath;
                    })
                });
            console.log('treeNodes=%o', treeNodes);
            // debugger;
            // debugger;
            treeUtil.traverse(treeNodes, 'children', null,
                function nodeRender(self, parent) {
                    self.expanded = true;
                    self.folder = true;
                    var pathSegment = self['__pathPart'];
                    self.title = pathSegment;
                    if (!parent) {
                        // self.title = that.treeConfig.rootNodeTitle;
                        if (leadingSeparator) {
                            self.key = pathConfig.pathSeparator;
                        } else {
                            self.key = pathSegment;
                        }
                    } else {
                        self.key = parent.key + (parent.key !== pathConfig.pathSeparator ? pathConfig.pathSeparator : '') + pathSegment;
                    }
                    if (angular.isFunction(that.treeConfig.nodeRender)) {
                        that.treeConfig.nodeRender(self);
                    }
                    if (that.ngModelCtrl) {
                        //Todo list map 类型判断是否包含
                        if (_.indexOf(that.ngModelCtrl.$modelValue, self.key) > -1) {
                            self.selected = true;
                        }
                    }
                });

            return treeNodes;
        }

        function renderFancytree(elem, treeNodes) {
            var autoSelectChildren = true;
            var config = {
                source: treeNodes,
                // checkbox: !!that.treeConfig.selector,
                click: function onClick(event, data) {
                    if (data.targetType !== 'title') {
                        return;
                    }
                    var node = data.node;
                    var param = {
                        key: node.key,
                        data: node.data
                    };
                    that.treeConfig.onClickNode && that.treeConfig.onClickNode(param);
                    if (that.treeConfig.selector === 'multiple' || that.treeConfig.selector === 'single') {
                        if (that.treeConfig.selector === 'multiple') {
                            node.toggleSelected();
                            if (autoSelectChildren) {
                                if (node.isSelected()) {
                                    node.visit(function (childNode) {
                                        childNode.setSelected(true);
                                    });
                                }
                            }
                        } else {
                            data.tree.selectAll(false);
                            node.setSelected(true);
                        }
                        var selectedNodes = data.tree.getSelectedNodes();
                        var selResult = [];
                        selectedNodes.forEach(function (node) {
                            var obj;
                            if (angular.isFunction(that.treeConfig.selectionData)) {
                                obj = that.treeConfig.selectionData(node);
                            } else {
                                obj = {
                                    value: node.key,
                                    label: node.title
                                };
                            }
                            selResult.push(obj);
                        });

                        $scope.$apply(function () {
                            // $setViewValue -> $viewValue -> $parsers -> $modelValue
                            if (!that.treeConfig.mcheckType || that.treeConfig.mcheckType === 'jsonarray') {
                                that.ngModelCtrl.$setViewValue(_.map(selResult, "value"));
                            } else {
                                that.ngModelCtrl.$setViewValue(selResult);
                            }
                        });
                    } else {
                        console.log('This is not selector, do nothing');
                    }
                }
            };
            // console.log('fancytree: config=%o', config);
            elem.fancytree(_.merge({}, window.$oplus.fancytreeDefault, config));
        }
    }

    function TreeDataUtil(pathSeparator) {
        this.traverse = traverse;
        this.pathToHierarchy = pathToHierarchy;

        /**
         * Traverse tree data
         * @param treeNodes
         * @param {string} childrenField Name of children property.
         * @param {object} parent
         * @param {function(object,object)} nodeRender A function to render node. First parameter is self node, second is parent node
         */
        function traverse(treeNodes, childrenField, parent, nodeRender) {
            treeNodes.forEach(function (self) {
                // console.log('....traverse: self=%o',JSON.stringify(self));
                if (self !== null && self !== undefined) {
                    nodeRender(self, parent);
                    var children = self[childrenField];
                    if (angular.isArray(children)) {
                        traverse(children, childrenField, self, nodeRender);
                    }
                }
            });
        }

        /**
         * Convert flat paths to hierarchy tree data.
         * https://gist.github.com/stephanbogner/4b590f992ead470658a5ebf09167b03d
         * @param {[string]} absPaths Array of paths.
         * @param {object=} options How to generate the hierarchy
         * @param {string=} options.segmentField The field to save value of path segment. Default is "title"
         * @param {string=} options.childrenField The field to save values of children. Default is "children"
         * @param {boolean=} options.leadingSeparator
         * @param {function(object,string,string)=} dataRender Render the node data
         * @return {[{"<segmentField>":string, "<childrenField>":[{'<segmentField>':string,'<childrenField>':[{}]}]}]} Array of tree nodes
         */
        function pathToHierarchy(absPaths, options, dataRender) {
            // Adapted from http://brandonclapp.com/arranging-an-array-of-flat-paths-into-a-json-tree-like-structure/
            var treeNodes = [];
            options = _.merge({}, {
                segmentField: 'title',
                childrenField: 'children'
            }, options);
            var segmentedPaths = [];
            absPaths.forEach(function (path) {
                var segments;
                var isRoot = path === pathSeparator || path === '';
                if (isRoot) {
                    segmentedPaths.push({path: '', segments: ['']});
                } else if (path) {
                    segments = path.split(pathSeparator);
                    segmentedPaths.push({path: path, segments: segments});
                } /*else {
                    console.warn('Illegal path of %s. Path cannot be empty and must start with slash `%s`', path, pathSeparator);
                }*/
            });
            var leadingSeparator = options.leadingSeparator;
            for (var i = 0; i < segmentedPaths.length; i++) {
                var pathSegments = segmentedPaths[i].segments;
                var currentLevel = treeNodes;
                var fullPath = '';
                for (var j = 0; j < pathSegments.length; j++) {
                    var segment = pathSegments[j];
                    if (segment !== '') {
                        if (leadingSeparator) {
                            fullPath += pathSeparator + segment;
                        } else {
                            // Do not prepend leading path separator
                            fullPath += (j > 0 ? pathSeparator : '') + segment;
                        }
                    }
                    var existingPath = _.find(currentLevel, function (o) {
                        return o[options.segmentField] === segment;
                    })
                    if (existingPath) {
                        currentLevel = existingPath.children;
                    } else {
                        var newNode = {};
                        newNode[options.segmentField] = segment;
                        // newNode[options.propOfValue] = segment;
                        newNode[options.childrenField] = [];
                        if (angular.isFunction(dataRender)) {
                            dataRender(newNode, segment, fullPath);
                        }
                        currentLevel.push(newNode);
                        currentLevel = newNode[options.childrenField];
                    }
                }
            }
            // console.log('flatPathToHierarchy: result=%o', JSON.stringify(resultTree));
            return treeNodes;
        }
    }
})();
