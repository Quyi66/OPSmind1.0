/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/11/02
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name acmListGroup
     * @desc Select host group
     * @usage
     * ```
     * <acm-list-ci-group ci-type="string" ng-model="array" options="object">
     * ```
     * @param {[string]=} ngModel Two-way binding model of selected groups.
     * Array of group path or CSV string of group path
     * @param {function(string)} options.clickCallback Callback function when activate/click a group. Argument is group key.
     * @param {{selector:string=,showAs:string,dropdownText:string=}=} options
     * @param {string} options.selector "multiple" or "single"
     */
    angular.module('oplus.acm').component('acmListCiGroup', {
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            selectedGroups: '=ngModel',
            theHostsByCiType: '=',
            options: '<',
            assetType: '<ciType',
            mcheckType: '<'
        },
        templateUrl: 'app/modules/acm/acm-list-ci-group.html',
        controller: ['$scope', 'restUtils', '$translate', AcmListCiGroupCtrl]
    });

    /**
     *
     * @param $scope
     * @param {restUtils} restUtils
     * @param {$translate} $translate
     * @constructor
     */
    function AcmListCiGroupCtrl($scope, restUtils, $translate) {
        var that = this;

        this.options = this.options || {};
        this.selectedGroups = this.selectedGroups || [];
        this.selectedGroup = this.selectedGroup || [];
        this.theHostsByCiType = this.theHostsByCiType || [];

        this.$onInit = onInit;
        this.treeId = _.uniqueId('js-group-tree-');

        var autoSelectChildren = !true;

        function getTreeElem() {
            return $('#' + that.treeId);
        }

        function onInit() {
            //TODO: move the callApi to acmService
            restUtils.callApi('acm', 'GET', '/api/acm/query/group/view/' + that.assetType).then(function (data) {
                var groupPaths = data;
                initTree(groupPaths);
                var tree = $.ui.fancytree.getTree(getTreeElem());
                if (tree) {
                    tree.visit(function (node) {
                        //Note: if selectedGroups is not array[object]?
                        var finds = _.findKey(that.selectedGroups, function (o) {
                            return o.key === node.key;
                        });
                        if (finds) {
                            node.setSelected(true);
                        }
                    });
                }

                // if (that.ngModelCtrl) {
                //     // Specify how UI should be updated. Triggered by $modelValue change
                //     // $modelValue -> $formatters -> $viewValue -> $render
                //
                //     that.ngModelCtrl.$render = function () {
                //         // Use $modelValue instead when need detect model change from outside.
                //         // Use that.selectedGroups can not reflect chagne immediately. Maybe there is delay to digest?
                //         var tree = $.ui.fancytree.getTree(getTreeElem());
                //         if (tree) {
                //             tree.visit(function (node) {
                //                 node.setSelected(_.indexOf(that.ngModelCtrl.$modelValue, node.key) > -1);
                //             });
                //         }
                //     };
                // }
                $scope.$on('$destroy', function () {
                    var tree = $.ui.fancytree.getTree(getTreeElem());
                    if (tree)
                        tree.destroy();
                });
            }).catch(function (err) {
                throw err;
            });

            /**
             *
             * @param {[string]} uniqPaths Unique group paths
             */
            function initTree(uniqPaths) {
                var groups = [];
                uniqPaths.forEach(function (path) {
                    if (path && path.startsWith('/')) {
                        if (path === '/') {
                            groups.push(['']);
                        } else {
                            groups.push(path.split(/\/+/));
                        }
                    } else {
                        console.warn('Illegal group path of `' + path + '`. Path cannot be empty and must start with slash `/`');
                    }
                });
                var treeUtil = new TreeUtil();

                var groupTreeData = treeUtil.fromFlatPath(groups, {propOfName: 'title'}, that.assetType);
                treeUtil.traverse(groupTreeData, 'children', null,
                    function (group, parentGroup) {
                        group.expanded = true;
                        group.folder = true;
                        if (!parentGroup) {
                            group.title = '~';
                            group.key = '/';
                            group.value = '/';
                            group.assetType = that.assetType;
                        } else {
                            group.key = parentGroup.key + (parentGroup.key !== '/' ? '/' : '') + group.title;
                        }
                        if (that.selectedGroups) {
                            var finds = _.findKey(that.selectedGroups, function (o) {
                                return o.key === group.key;
                            });
                            if (finds) {
                                group.selected = true;
                            }
                            // //Todo list map 类型判断是否包含
                            // if (_.indexOf(that.ngModelCtrl.$modelValue, group.key) > -1) {
                            //     group.selected = true;
                            // }
                        }
                    });
                var treeElem = getTreeElem();
                var keyOfAll = '@@';
                if (that.options.selector === 'multiple' || that.options.selector === 'single') {
                    treeElem.addClass('op-as-selector');
                }
                var nodeOfAll = {
                    title: $translate.instant('acm.common.list.all'),
                    key: keyOfAll,
                    value: keyOfAll,
                    assetType: that.assetType,
                    icon: 'fa fa-folders text-muted',
                    directory: false
                };
                groupTreeData.unshift(nodeOfAll);
                buildTree(treeElem, groupTreeData);
                return treeElem;
            }

            $scope.$on("theHostsByCiType", function ($event, type, group) {
                if (type === "group") {
                    var tree = $.ui.fancytree.getTree(getTreeElem());
                    if (tree) {
                        tree.visit(function (node) {
                            if (group.key === node.key) {
                                node.setSelected(false);
                                _.remove(that.selectedGroups, function (data) {
                                    return data.key === group.key;
                                });
                                that.ngModelCtrl.$setViewValue(that.selectedGroups);
                            }
                        });
                    }
                }
            })
        }

        function buildTree(elem, treeData) {
            var config = {
                source: treeData,
                // checkbox: !!that.options.selector,
                click: function onClick(event, data) {
                    if (data.targetType === 'title') {
                        var node = data.node;
                        var param = [{
                            key: node.key,
                            value: node.key,
                            assetType: node.data.assetType
                        }];

                        if (that.mcheckType === undefined || that.mcheckType === 'jsonarray') {
                            that.options.groupCallBack && that.options.groupCallBack(_.map(param, "key"));
                        } else {
                            that.options.groupCallBack && that.options.groupCallBack(param);
                        }
                        if (that.options.selector === 'multiple' || that.options.selector === 'single') {
                            if (that.options.selector === 'multiple') {
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

                            if (node.isSelected()) {
                                var nodeMap = {};
                                nodeMap.key = node.key;
                                nodeMap.value = node.key + "(" + node.data.assetType + ")";
                                nodeMap.assetType = node.data.assetType;
                                that.selectedGroups.push(nodeMap);
                                that.theHostsByCiType.push(nodeMap);
                            } else {
                                _.remove(that.selectedGroups, function (data) {
                                    return data.key === node.key;
                                });
                                _.remove(that.theHostsByCiType, function (data) {
                                    return data.key === node.key;
                                });

                            }

                            $scope.$apply(function () {
                                // $setViewValue -> $viewValue -> $parsers -> $modelValue
                                if (that.mcheckType === undefined || that.mcheckType === 'jsonarray') {
                                    that.ngModelCtrl.$setViewValue(_.map(that.selectedGroups, "value"));
                                } else {
                                    that.ngModelCtrl.$setViewValue(that.selectedGroups);
                                }
                            });
                        }
                    }
                }
            };
            elem.fancytree(_.merge({}, window.$oplus.fancytreeDefault, config));
        }
    }

    function TreeUtil() {
        this.traverse = traverse;
        this.fromFlatPath = fromFlatPath;

        /**
         * Traverse tree data
         * @param array
         * @param {string} propOfChildren Name of children property.
         * @param parent
         * @param callback
         */
        function traverse(array, propOfChildren, parent, callback) {
            array.forEach(function (self) {
                if (self !== null && self !== undefined) {
                    callback(self, parent);
                    var children = self[propOfChildren];
                    if (angular.isArray(children)) {
                        traverse(children, propOfChildren, self, callback);
                    }
                }
            });
        }

        /**
         * Build tree data from flat path
         * @param {[[string]]} paths Array of paths. Each path item is an array of path segments.
         * @param {object=} options
         * @param {string} options.propOfPath
         * @param {string} options.propOfName
         * @param {string} options.propOfChildren
         * @param {assetType} assetType
         * https://gist.github.com/stephanbogner/4b590f992ead470658a5ebf09167b03d
         * @return {[{_propOfName:string,_propOfChildren:[{_propOfName:string,_propOfChildren:[...]}]}]}
         */
        function fromFlatPath(paths, options, assetType) {
            // Adapted from http://brandonclapp.com/arranging-an-array-of-flat-paths-into-a-json-tree-like-structure/
            var tree = [];
            options = _.merge({}, {
                propOfPath: 'path', propOfValue: 'value', propOfType: 'assetType',
                propOfName: 'name', propOfChildren: 'children'
            }, options);

            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var currentLevel = tree;
                for (var j = 0; j < path.length; j++) {
                    var part = path[j];

                    var existingPath = findWhere(currentLevel, options.propOfName, part);
                    if (existingPath) {
                        currentLevel = existingPath.children;
                    } else {
                        var newPart = {};
                        newPart[options.propOfName] = part;
                        newPart[options.propOfValue] = part;
                        newPart[options.propOfType] = assetType;
                        newPart[options.propOfChildren] = [];
                        currentLevel.push(newPart);
                        currentLevel = newPart[options.propOfChildren];
                    }
                }
            }
            return tree;

            function findWhere(array, key, value) {
                // Adapted from https://stackoverflow.com/questions/32932994/findwhere-from-underscorejs-to-jquery
                var t = 0; // t is used as a counter
                while (t < array.length && array[t][key] !== value) {
                    t++;
                }// find the index where the id is the as the aValue

                if (t < array.length) {
                    return array[t]
                } else {
                    return false;
                }
            }
        }
    }

})();
