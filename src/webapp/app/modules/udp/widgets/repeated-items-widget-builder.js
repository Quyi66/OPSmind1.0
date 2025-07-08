/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 5/29/2018, extracted from KpiWidget
 */
(function () {
    'use strict';

    angular.module('oplus.udp').service('repeatedItemsWidgetBuilder', repeatedItemsWidgetBuilder);

    repeatedItemsWidgetBuilder.$inject = ['$q', 'conditionalFormat', 'widgetDataUtil', 'widgetInteraction'];

    /**
     * @ngdoc
     * @name repeatedItemsWidgetBuilder
     * @description
     * A generic builder for widget with repeated items like list-group, nav-pills.
     * @param {$q} $q
     * @param conditionalFormat {conditionalFormat}
     * @param widgetDataUtil {widgetDataUtil}
     * @param widgetInteraction {widgetInteraction}
     */
    function repeatedItemsWidgetBuilder($q, conditionalFormat, widgetDataUtil, widgetInteraction) {
        this.newInstance = newInstance;

        function newInstance(config) {
            return new Builder(config);
        }

        /**
         *
         * @param config
         * @param {boolean} config.enableItemCss
         * @param {[string|object]} config.itemAttrs Attributes
         * @param {string} config.itemAttrs[].name
         * @param {boolean=} config.itemAttrs[].lazyLoad
         * @param {function=} config.itemsProcessFn A function to process data items
         * @constructor
         */
        function Builder(config) {
            // var theData;
            var fields;
            this.reloadData = reloadData;
            this.renderDynamicData = renderDynamicData;
            this.evalLazyAttr = evalLazyAttr;

            /**
             * Evaluate value of lazy load attribute
             * @param {string} attr Attribute name defined in constructor config
             */
            function evalLazyAttr(rowData, attr, scope) {
                var field = attr;
                var d = $q.defer();
                var rules = [];
                rules.push({source: fields[field].field, target: field, convertFn: fields[field].convertFn});

                var items = widgetDataUtil.convertFields([rowData], rules, widgetDataUtil.getPageScopeValues(scope));
                // console.log('evalLazyAttr', rowData, attr, rules, items);
                var item = items[0];
                var val = item[field];
                // console.log('val',val);
                if (val && angular.isFunction(val.then)) {
                    val.then(function (v) {
                        d.resolve(v);
                    }).catch(function (err) {
                        d.reject(err);
                    });
                } else {
                    d.resolve(val);
                }
                return d.promise;
            }

            /**
             * Queries, converts data and saves in `scope.items`.
             * @param scope
             * @param {array} scope.items Each item contains properties defined in constructor parameter `config.itemAttrs`.
             * @param {object} scope.items._data Additional property of raw data.
             * @param {string} scope.items._css Additional property of css class.
             * @param {angular.element} element
             * @returns {promise}
             */
            function reloadData(scope, element) {
                var d = $q.defer();
                var props = scope.$widget.uwProps || {};
                widgetInteraction.upgradeWidgetProps(props);
                var display = props.display || {};
                fields = getFieldDefs(config.itemAttrs, props);
                widgetDataUtil.queryData(element, props, scope).then(function (data) {
                    // console.log('data',data);
                    var rules = [], items;
                    // theData = data;
                    config.itemAttrs.forEach(function (attr) {
                        var field = angular.isString(attr) ? attr : attr.name;
                        if (!attr.lazyLoad && fields[field]) {
                            rules.push({
                                source: fields[field].field,
                                target: field,
                                convertFn: fields[field].convertFn
                            });
                        }
                    });
                    items = widgetDataUtil.convertFields(data.records, rules, widgetDataUtil.getPageScopeValues(scope), {includeAllFields: '_data'});
                    items.forEach(function (item) {
                        // Handle promise
                        config.itemAttrs.forEach(function (attr) {
                            var attrName;
                            if (angular.isString(attr)) {
                                attrName = attr;
                            } else {
                                attrName = attr.name;
                            }
                            var val = item[attrName];
                            if (val && angular.isFunction(val.then)) {
                                val.then(function (v) {
                                    item[attrName] = v;
                                });
                            }
                        });
                    });
                    // console.log('items', items, data.records);
                    if (data.records.length === 0) {
                        items = props._sampleData || [{
                            _css: 'bg-light',
                            icon: 'fa-inbox',
                            text: 'No data',
                            title: '?',
                            detail: 'Dataset has no data'
                        }];
                    }
                    // 20180620: for compatible with old display.css
                    var theme = display.theme || display.css;
                    data.records.forEach(function (record, i) {
                        // items[i]._data = record;
                        if (theme === '_CUSTOM') {
                            items[i]._css = '';
                            items[i]._styles = {
                                backColor: display.backColor,
                                fontColor: display.fontColor
                            };
                            items[i]._style = {
                                'background-color': display.backColor
                            };
                            items[i]._titleStyle = {
                                'color': display.fontColor
                            }
                        } else if (theme) {
                            items[i]._style = null;
                            if (config.enableItemCss)
                                items[i]._css = 'bg-' + theme;
                            else
                                items[i]._css = '';
                            items[i]._styles = {};
                        }
                    });
                    conditionalFormat.evaluateRules(display.rules, data.records, {},
                        function (itemIndex, rule) {
                            if (rule.theme === '_CUSTOM') {
                                items[itemIndex]._css = '';
                                items[itemIndex]._style = {
                                    'background-color': rule.backColor,
                                    'color': rule.fontColor
                                };
                                items[itemIndex]._styles = {
                                    backColor: rule.backColor,
                                    fontColor: rule.fontColor
                                };
                            } else if (rule.theme) {
                                items[itemIndex]._css = 'bg-' + rule.theme;
                                items[itemIndex]._style = null;
                                items[itemIndex]._styles = {};
                            }
                        });
                    scope.items = items;
                    if (angular.isFunction(config.itemsProcessFn)) {
                        config.itemsProcessFn(scope.items);
                    }
                    d.resolve();
                }).catch(function (e) {
                    d.reject(e);
                });
                return d.promise;
            }

            /**
             *
             * @param {[string]} itemAttrs
             * @param props
             * @returns {*|{}}
             */
            function getFieldDefs(itemAttrs, props) {
                var fields = props.fields || {};
                // Set default value to fields to avoid undefined error
                var defaultVal = {};
                itemAttrs.forEach(function (attr) {
                    defaultVal[attr] = {};
                });
                _.merge(fields, defaultVal);
                return fields;
            }

            /**
             * Query and convert data.
             * @param scope
             * @param element
             * @param props
             * @returns {Promise}
             */
            function renderDynamicData(scope, element, props) {
                var d = $q.defer();
                // console.log('props',props.interaction);
                widgetInteraction.upgradeWidgetProps(props);
                config = config || {};
                var abf = getActiveByField();
                var canActivate = widgetInteraction.isActionConfigured(props.interaction);
                scope.clickItem = clickItem;
                scope.doSearch = doSearch;
                scope.current = {index: -1};

                // console.log('renderDynamicData.reloadData...');
                reloadData(scope, element).then(function () {
                    d.resolve();
                    if (canActivate) {
                        // console.log('......from reloadData');
                        activateItem();
                    }
                }).catch(function (err) {
                    d.reject(err);
                });
                if (canActivate && abf && abf.valueIsPageParam) {
                    scope.$watch('$widget.$pageScope.pageParams.' + abf.param, function (newVal, oldVal) {
                        // console.log('......from $watch');
                        tryActivateItemByFieldValue(abf.field, newVal);
                    });
                }
                return d.promise;

                function activateItem() {
                    var activated = false;
                    if (abf) {
                        // console.log('activateItem: abf=%o',abf);
                        if (abf.valueIsPageParam) {
                            activated = tryActivateItemByFieldValue(abf.field, scope.$widget.$pageScope.pageParams[abf.value]);
                        } else {
                            activated = tryActivateItemByFieldValue(abf.field, abf.value);
                        }
                    }
                    if (!activated) {
                        var abi = (props.interaction || {}).activeByIndex || {};
                        if (abi.enabled) {
                            var index = abi.index;
                            if (index >= 1 && index <= scope.items.length) {
                                clickItem(scope.items[index - 1]._data, {}, index - 1);
                            }
                        }
                    }
                }

                /**
                 * Get settings of active by field
                 * @returns {{field:string,value:string,valueIsPageParam:boolean}|null}
                 */
                function getActiveByField() {
                    var abf = (props.interaction || {}).activeByField || {};
                    if (!abf.enabled) {
                        return null;
                    }
                    if (abf.field && abf.value) {
                        var value = abf.value;
                        var matches = abf.value.match(/\${@\.(.*?)}/);
                        if (matches) {
                            value = matches[1];
                        }
                        return {field: abf.field, value: value, valueIsPageParam: !!matches};
                    }
                    return null;
                }


                /**
                 * @param {string} value Field value
                 * @param {string} field Field name
                 * @return {boolean} true for item activated (or no item), false for no matching item
                 */
                function tryActivateItemByFieldValue(field, value) {
                    // console.log('tryActivateItemByFieldValue: items=%o',scope.items);
                    if (scope.items) {
                        for (var i = 0; i < scope.items.length; i++) {
                            var item = scope.items[i];
                            if (item._data[field] === value) {
                                // console.log('clickItem from field value: field=%s, value=%s', field, value);
                                clickItem(item._data, {}, i);
                                return true;
                            }
                        }
                        return false;
                    }
                    return true;
                }

                function doSearch(text) {
                    if (!scope.items) return;
                    if (text) {
                        var reg = new RegExp(text, 'i');
                        scope.items.forEach(function (item) {
                            if (reg.test(item.title) || reg.test(item.text)) {
                                if (item._css)
                                    item._css = item._css.replace(/notmatch/g, '');
                                // console.log(item._css);
                            } else {
                                item._css = item._css + ' notmatch';
                            }
                        });
                    } else {
                        scope.items.forEach(function (item) {
                            if (item._css)
                                item._css = item._css.replace(/notmatch/g, '');
                        });
                    }
                }

                /**
                 *
                 * @param {object} data Item raw data
                 * @param event
                 * @param {number} index Item index in item list, starting from 0
                 */
                function clickItem(data, event, index) {
                    // console.log('clickItem: data=%o,index=%o',data,index);
                    //LEO@20211216: A temp workaround to address the issue of
                    // if (!element.is(':visible')){
                    //     return;
                    // }
                    var interaction = props.interaction || {};
                    if (widgetInteraction.isActionConfigured(interaction)) {
                        scope.current.index = index;
                    }
                    // console.log('clickItem: interaction=%o', interaction);
                    widgetInteraction.handleInteraction(scope, interaction, data, {element: event.currentTarget});
                }
            }
        }
    }
})();
