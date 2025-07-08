/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/05/12, created
 */
(function () {
    'use strict';

    angular.module('oplus.commons').directive('opxDatatable', opxDatatableDirective);
    opxDatatableDirective.$inject = ['opDatatable'];

    /**
     * @ngdoc directive
     * @name opxDatatable
     * @element E
     * @description 用于创建常用表格的指令。
     *
     * > ATTENTION: Use directive instead of component, because component scope is always isolated.
     * > We need access invoker's scope in table's row action.
     *
     * **使用方法**
     *
     * ```html
     * <opx-datatable table-config="{
     *     data: function|[],
     *     columns:[{}],
     *     order:[[]],
     *     buttons:[string],
     *     selection:{labelData:string|function, valueData:string|function, preselected:*},
     *     responsive: boolean
     *  }"></opx-datatable>
     * ```
     *
     * `tableConfig`是表格的配置，格式如下:
     * - `data` {@type function<promise>|array} 表格数据来源设定，支持以下格式
     *     - [dataArray] {@type [object]} 实际数据数组
     *     - fnPromise {@type function<promise>} 获取数据的函数，返回值为[object]格式的数据或Promise
     *     - [fnPromise, dataSrc, isServerSide] {@type []} 一个数组，包含异步函数，数据路径，是否服务端请求三个设定。
     *          - `[0]`: {function|array|object}，第一个元素为表格的数据，
     *            它可以是一个返回异步数据Promise的函数，或者是数据数组，或者数据对象（通过data[1]指定的路径来提取数据）。
     *          - `[1]`: {string}，如果data[0]的最终返回值是Object，那么第二个元素为从`data[0]`中获取表格实际数据的路径。
     *          - `[2]`: {boolean}，第三个元素表示是否为服务器端处理。
     * - `columns` {@type [object]} 表格列的定义。
     *   [数据格式参考DataTable](https://datatables.net/reference/option/columns)。最关键的属性是`data`和`title`
     *    扩展属性放在`_extra`里面，包括
     *    - linelimit: boolean, default is false. When work without render function
     *    - linebreak: boolean, default is true
     *    - autoFilter: boolean, default is false
     * - `order` {@type array} 表格的排序设定，例如`[[ 0, 'asc' ], [ 1, 'asc' ]]`
     *    [数据格式参考DataTable](https://datatables.net/reference/option/order)
     *
     * - `selection` {@type object} 表格的行选择设定。
     *   如果设定了`selection`，在表格的每行第一列会显示一个复选框。
     *   - `selection.valueData` {@type string|function} 必须，选定行的实际值。
     *     如果是`string`，代表字段名称，选定行的字段值将作为选定值。
     *     如果是`function`，代表数据获取函数，函数参数为该行的数据，函数返回值将作为选定值。
     *   - `selection.labelData` {@type string|function} 可选，选定行的显示值。
     *     在表格上方有下拉框显示已经选中的值，显示值可以与实际值不同。设置方式与`valueData`相同。
     *   - `selection.valueComparator` {@type function} 可选，用以比较两个值是否相等。例如valueData的格式是[{key:'foo',title:'foo'}]
     *     preselected是[{key:'foo',title:'foo updated'}]，如果只要`key`相同则认为数据相同，那么可以设定`valueComparator`为
     *     `function(a,b){return a.key===b.key;}`
     *   - `selection.preselected` {@type array|string} 可选，预先选定的值。
     *   - `selection.selectedDatatype` {@type string} 可选，选定值的数据格式。如果设置了数据格式，那么数据格式必须和预选值相匹配。
     *      如果没有设置格式，但设置了预选值，将根据预选值猜测数据格式。数据格式支持
     *      - Array: 简单数组（默认）
     *      - ObjectArray: 数组的每个元素为{value:string, label:string} 格式
     *      - String: 逗号分隔的字符串
     *      @see {@link ArrayConvertor#types}
     * - `buttons` {@type [string]} 按钮设置。支持reload, excel
     * - `tableId` {@type string} 可选，如果设置了tableId，分页、搜素等属性将保存
     * - `responsive` {@type boolean} 是否使用响应式，默认为true
     *
     * 表格初始化完成后，`tableConfig`中会添加以下方法和属性
     * - `reloadData` {@type function} 刷新表格记录的函数，无参数。它将重新加载`data`的设置刷新表格数据。
     * - `getTableData` {@type function} 获取表格的完整数据，返回一个数组，每个元素为一行的数据。
     * - `selectedItems` {@type array|string} 选中的数据，格式符合为`selection.selectedDatatype`中定义的数据格式
     * - `markItemsSelected` {@type function} 参数为[value] 控制选择表格记录
     * - `getTableApi` {@type function} 返回原始的DataTables API Instance
     *
     *  @param {opDatatable} opDatatable
     */
    function opxDatatableDirective(opDatatable) {
        return {
            restrict: 'E',
            // 20210911: DO NOT use isolated scope
            // scope: {
            //     tableConfig: '<'
            // },
            link: linkFn
        };

        function linkFn(scope, element, attrs, ctrl) {
            var tableConfigVar = attrs['tableConfig'];
            var unregister = scope.$watch(tableConfigVar, function (newVal, oldVal) {
                if (newVal) {
                    // Only init once
                    unregister();
                    initTable(newVal);
                }
            });

            function initTable(tableConfig) {
                //scope[NORMALIZED_SELECTED_ITEMS] format `[]`
                var NORMALIZED_SELECTED_ITEMS = '__selectedItemsInArray__';
                var children = element.children();
                var table = $('<table class="opx-table table table-hover"></table>');
                table.appendTo(element);
                if (tableConfig.tableId) {
                    table.attr('id', tableConfig.tableId);
                }
                var builder = opDatatable.buildTable(table, scope).fromData(tableConfig.data);
                var selectConfig = tableConfig.selection;
                var dataConverter;
                try {
                    builder.withColumn(tableConfig.columns)
                        .withButton(tableConfig.buttons)
                        .withCustomControl(children)
                        .withOrder(tableConfig.order)
                        .withOptions(tableConfig.options || {})
                        .withStateSave();
                    // .withOption('stateSave', tableConfig.stateSave);
                    if (selectConfig) {
                        dataConverter = new ArrayConvertor(selectConfig.selectedDatatype, selectConfig.preselected);
                        scope[NORMALIZED_SELECTED_ITEMS] = dataConverter.formatInput(selectConfig.preselected);
                        // console.log('selected',JSON.stringify(scope[NORMALIZED_SELECTED_ITEMS]));
                        builder.withSelection({
                            labelData: selectConfig.labelData,
                            valueData: selectConfig.valueData,
                            preselected: scope[NORMALIZED_SELECTED_ITEMS],
                            valueComparator: selectConfig.valueComparator,
                            stateFn: selectConfig.stateFn
                        });
                    }
                    if (!tableConfig.responsive) {
                        builder.withOption('responsive', false);
                    }
                } catch (err) {
                    //TODO: need prompt error to user
                    throw err;
                }
                var tableBuilder = builder.render();
                // console.log('DONE tableBuilder.render()', {builder: tableBuilder});
                tableConfig.reloadData = function () {
                    tableBuilder.reloadData();
                }
                tableConfig.reloadDataSync = function (){
                    tableBuilder.reloadDataSync();
                }
                tableConfig.getTableApi = function () {
                    return tableBuilder.getTableApi();
                }
                tableConfig.getTableData = function () {
                    return Array.from(tableBuilder.getTableData());
                }
                // console.log('tableConfig.selectedItems', tableConfig.selectedItems);
                if (selectConfig) {
                    tableConfig.markItemsSelected = function (values) {
                        return tableBuilder.markItemsSelected(values);
                    };
                    scope.$watch(NORMALIZED_SELECTED_ITEMS, function (newVal, oldVal) {
                        // console.log('watch __selectedItemsInArray__', {newVal: newVal});
                        tableConfig.selectedItems = dataConverter.parseOutput(newVal);
                    }, true);
                }
            }

            function ArrayConvertor(dataType, preselected) {
                var exportType = dataType;
                var that = this;
                this.types = {String: 'String', Array: 'Array'/*, ObjectArray: 'ObjectArray'*/};
                this.formatInput = formatInput;
                this.parseOutput = parseOutput;
                if (!exportType) {
                    if (angular.isString(preselected)) {
                        exportType = that.types.String;
                    } else if (angular.isArray(preselected)) {
                        exportType = that.types.Array;
                    } else if (angular.isUndefined(preselected)) {
                        exportType = that.types.Array;
                    }
                }
                if (!exportType) {
                    console.warn('preselected is ', preselected);
                    throw new TypeError('Cannot determine export typeL from ArrayConverter(dataType, preselected)');
                }

                /**
                 * Supported input value:
                 * - Default array: `["abc","xyz"]`
                 * - Default string: `"abc,xyz"`
                 * - Object array: `[{value: "abc", label: "ABC"}, {value: "xyz", label: "XYZ"}]`
                 * - Object array alt: `[{value: "abc"}, {value: "xyz"}]`
                 * - JSON: `"[{\"value\": \"abc\", \"label\": \"ABC\"}, {\"value\": \"xyz\", \"label\": \"XYZ\"}]"`
                 *
                 *
                 * Inner value is type of object array `[{value:*,label:string}]`
                 *
                 * @param exportValue
                 * @return []
                 */
                function formatInput(exportValue) {
                    var innerValue = [];
                    exportType = exportType || that.types.Array;
                    if (exportType === that.types.String) {
                        if (angular.isString(exportValue)) {
                            innerValue = _.map(exportValue.split(','), function (o) {
                                return o;
                            });
                        } else {
                            throw new TypeError('Export type is String but incoming value is not String');
                        }
                    } else if (exportType === that.types.Array) {
                        if (angular.isArray(exportValue)) {
                            innerValue = exportValue;
                        } else if (angular.isDefined(exportValue)) {
                            throw new TypeError('Export type is Array but incoming value is not array');
                        }
                    } else {
                        throw new TypeError('Unsupported export type ' + exportType);
                    }
                    return innerValue;
                }

                function parseOutput(innerValue) {
                    if (exportType === that.types.String) {
                        return innerValue.join(',');
                    } else if (exportType === that.types.Array) {
                        return innerValue;
                    } else {
                        throw new TypeError('Unsupported export type ' + exportType + ', available types are ' + _.values(that.types));
                    }
                }
            }
        }
    }
})();
