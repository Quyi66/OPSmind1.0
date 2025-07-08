/**
 * @author Jocker Liu, 2020/10/28, created
 * @author Leo Liao(leoliaolei@gmail.com), 2021/05/07, massive code refactor and enhancement
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('datatableUtil', datatableUtil);
    datatableUtil.$inject = [];

    /**
     * @ngdoc service
     * @name datatableUtil
     */
    function datatableUtil() {
        this.wrapText = _wrapText;
        this.customizeExcelExport = _excelCustomize;
        this.buildSingleCheckbox = buildSingleCheckbox;
        this.htmlAttrToValue = htmlAttrToValue;
        this.valueToHtmlAttr = valueToHtmlAttr;

        /**
         * Convert value to HTML attribute value
         * @param any
         * @return {string}
         */
        function valueToHtmlAttr(any) {
            return JSON.stringify(any);
        }

        /**
         * Convert HTML attribute value to actual value
         * @param {string} str
         * @return {*}
         */
        function htmlAttrToValue(str) {
            try {
                return JSON.parse(str);
            } catch (err) {
                console.error('Cannot parse value %o as JSON', str);
            }
        }


        /**
         * Build checkbox HTML for a table row
         * @param {object} row Data of table row
         * @param {function(object)|string} valueData
         * @param {function(object)|string} labelData
         * @param {function(object)} stateFn A function returns 'disabled' or 'hidden'
         * @param {{isLegacy:boolean}=} options
         * @return {string} Checkbox HTML
         */
        function buildSingleCheckbox(row, valueData, labelData, stateFn, options) {
            options = options || {isLegacy: false, checked: false};
            var value = angular.isFunction(valueData) ? valueData(row) : row[valueData];
            var label = angular.isFunction(labelData) ? labelData(row) : row[labelData];
            var disabledHtml = '';
            if (angular.isFunction(stateFn)) {
                var state = stateFn(row);
                if (state === 'disabled') {
                    disabledHtml = ' disabled ';
                } else if (state === 'hidden') {
                    return '';
                }
            }
            // 20210911: Straight string concatenation is not safe when attribute value contains quotation mark.
            // Use attr() to properly set attribute value.
            // NOT THIS: '<input type="checkbox" class="js-mcheck-single" value="' + value + '" data-label="' + label + '" ' + disabledHtml + '>'
            var htmlValue = valueToHtmlAttr(value);

            var checkbox = $('<input type="checkbox" class="js-mcheck-single" ' + disabledHtml + '>')
                .attr('data-label', label)
                .attr(options.isLegacy ? 'data-value' : 'value', htmlValue);

            //Note 202403 set checkbox is checked by selected
            if (options.checked) {
                checkbox.attr('checked', true);
            }
            // if (selectedItemsInJson.indexOf(htmlValue) > -1) {
            //     // It seems prop('checked', true) cannot populate the checked attribute in HTML
            //     checkbox.attr('checked', true);
            //     // 20210911: Strange! table instance can be accessed in render.
            //     var tr = $(builder._dtInstance.row(meta.row).node());
            //     tr.data('op_selected_value', value).addClass(TR_SELECTED_CSS);
            // }


            return '<div class="checkbox checkbox-inline checkbox-primary">' +
                checkbox.prop('outerHTML') +
                '<label></label>' +
                '</div>';
        }

        function _wrapText(data, type) {
            if (angular.isUndefined(data)) {
                return '';
            }
            if (type !== 'display' && type !== 'export')
                return data;
            if (!angular.isString(data)) {
                return data;
            }
            //https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3
            // Total number of characters that a cell can contain 32767 characters
            if (type === 'export' && data.length > 32767) {
                data = '[' + $translate.instant('common.table.length_limit_exceeded') + ']\n' + data.substr(0, 32000);
            }
            return data.replace(/\n/g, type === 'display' ? '<br>' : '\r');
        }


        /**
         * https://datatables.net/forums/discussion/41778
         * https://datatables.net/reference/button/excelHtml5
         * @param xlsx
         */
        function _excelCustomize(xlsx) {
            var sheet = xlsx.xl.worksheets['sheet1.xml'];
            //32 - Bold, grey background, thin black border
            $('row:first c', sheet).attr('s', '32');

            $('row', sheet).each(function (rowIndex) {
                var $row = $(this);
                $('c', $row).each(function (colIndex) {
                    if (rowIndex > 0) {
                        var $cell = $(this);
                        //55 - Wrapped text (since 1.2.2)
                        $cell.attr('s', 55);
                        // $cell.text($cell.text().replace('\n','<br>'));
                        // var size = $cell.text().length;
                        //https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3
                        // Total number of characters that a cell can contain 32767 characters
                        // if (size > 32767) {
                        // TODO: $cell.text() does not work
                        //     $cell.text('[数据超长]' + $cell.text().substr(0, 32000));
                        // }
                    }
                });


                // if ($('is t', this).text()) {
                //wrap text
                // $(this).attr('s', '55');

                //append the concat formula
                // $(this).append('<f>' + $('is t', this).text() + '</f>');
                //remove the inlineStr
                // $('is', this).remove();
                // }
            });
        }
    }

    angular.module('oplus.commons').service('opDatatable', opDatatable);
    opDatatable.$inject = ['currentUser', '$compile', '$filter', '$timeout', '$http', '$q', 'messageService', '$translate', 'datatableUtil'];

    /**
     * `scope[SELECTED_ITEMS_SCOPE_NAME]` stores selected items for display in dropdown, data format: `[{value:*, label:string}]`
     * `builder.selectedItems` is a reference to incoming preselected defined in `withSelection(setting.preselected)`
     * for export, data format `[*]`
     *
     * @ngdoc service
     * @name opDatatable
     * Borrowed from https://github.com/l-lin/angular-datatables/tree/angular1
     * @param {currentUser} currentUser
     * @param $compile
     * @param $filter
     * @param $timeout
     * @param $http
     * @param $q
     * @param {messageService} messageService
     * @param $translate
     * @param {datatableUtil} datatableUtil
     */
    function opDatatable(currentUser, $compile, $filter, $timeout, $http, $q, messageService, $translate, datatableUtil) {
        var TR_SELECTED_CSS = 'selected';
        var STATE_SAVE_KEY = 'oplus.datatables';
        var STATE_SAVE_LIMIT = 10;
        var STATE_SAVE_EXPIRY_MINUTES = 1 * 60;
        this.buildTable = buildTable;


        /**
         *
         * @param {string|jQuery} selector jQuery qualified selector of `table` element
         * @param {angular.scope} scope
         */
        function buildTable(selector, scope) {
            var table = $(selector);
            if (table.length === 0) {
                throw new Error('ProgramError: Cannot find table element by selector `' + selector + '`');
            }

            return {
                fromData: fromData
            };

            /**
             * Init data for table. The data can be these format:
             * 1. `fnPromise<function>` a function returning a promise of data array.
             * 2. `[fnPromise<function>, dataSrc<string>, isServerSide<boolean>]` The format of function returned promise
             * data can be data array or data object. In case of data object, use `dataSrc` indicate the path to pick data array.
             * 3. `[dataRecord<object>]` Array of concrete data record.
             * @parm data The data source for table.
             * @returns {_TheBuilder}
             */
            function fromData(data) {
                if (angular.isFunction(data)) {
                    return fromFnPromise(data);
                } else if (angular.isArray(data)) {
                    var fnPromise, dataSrc, isServerSide;
                    if (angular.isFunction(data[0])) {
                        fnPromise = data[0];
                        dataSrc = data.length > 1 ? data[1] : '';
                        isServerSide = data.length > 2 ? data[2] : false;
                    } else {
                        fnPromise = function () {
                            return $q.when(data)
                        };
                    }
                    return fromFnPromise(fnPromise, dataSrc, isServerSide);
                }
                throw new TypeError('Parameter data of `fromData` must be a function or array, it is ' + (typeof data));
            }

            /**
             * Data from promise.
             * @param fnPromise the function that returns a promise to fetch the data
             * @param {string|null|undefined=} dataSrc Defines the property from the data source object to read.
             * https://datatables.net/reference/option/ajax.dataSrc
             * @param {boolean=} isServerSide
             */
            function fromFnPromise(fnPromise, dataSrc, isServerSide) {
                var builder = new _TheBuilder(selector, scope);
                builder._dtOptions.ajax = ajaxFn;
                if (isServerSide === true) {
                    builder._dtOptions.serverSide = true;
                    // builder._dtOptions.deferRender = true;
                }
                return builder;

                function ajaxFn(dataToServer, callback, settings) {
                    // Move includes element before ajax which may take long time
                    builder._features.forEach(function (feature) {
                        if (angular.isFunction(feature.beforeData)) {
                            feature.beforeData(builder);
                        }
                    });
                    // $q.when ensure a promise
                    var promise = $q.when(fnPromise(dataToServer));
                    promise.then(function (result) {
                        if (dataSrc) {
                            result = _.get(result, dataSrc);
                        }
                        if (angular.isArray(result)) {
                            callback({data: result});
                        } else if (angular.isArray(result.data)) {
                            //TODO: why try result.data? compatible with $http?
                            console.warn('%cDEPRECATED USAGE:%c try get data from `data` property', 'color:red', '');
                            callback(result);
                        } else {
                            var error = 'Unknown data format for table. The valid data format is an array of object, or its `data` property is an array.'
                            console.warn(error, result);
                            throw new Error(error + '\nPlease check the console output.');
                        }
                    }).catch(function (err) {
                        messageService.toast('error', $translate.instant('common.table.unable_get_table_data'), err.message);
                    });
                }
            }
        }

        /**
         * Create a table builder.
         * @param selector
         * @param scope
         * @private
         */
        function _TheBuilder(selector, scope) {
            this.SELECTED_ITEMS_SCOPE_NAME = '__selected__items__';
            var builder = this;
            this._selector = selector;
            this._scope = scope;
            this._dtOptions = {buttons: []};
            /**
             * The datatable instance
             * @see {@link https://datatables.net/reference/api/}
             * @private
             */
            this._dtInstance = null;
            this._features = [];
            this.getTableApi = getTableApi;
            // this._getTableElem = _getTableElem;
            // this._addFeature = _addFeature;
            this.withOption = withOption;
            this.withOptions = withOptions;
            this.withOrder = withOrder;
            this.withColumn = withColumn;
            this.withStateSave = withStateSave;
            this.withButton = withButton;
            this.withSelection = withSelection;
            this.withCustomControl = withCustomControl;
            this.render = renderDataTable;
            this.reloadData = reloadData;
            this.reloadDataSync = reloadDataSync;
            this.getTableData = getTableData;
            this.markItemsSelected = markItemsSelected;

            function getTableApi() {
                return builder._dtInstance;
            }

            // this.api = {
            //     reloadData: reloadData,
            //     markItemsSelected: markItemsSelected
            // };

            function getCustControlElem(builder) {
                var selector = '.js-dt-custctrls';
                return _getTableWrapper().find(selector);
                // return $(builder._dtInstance.table().container()).find(selector);
            }

            /**
             * Add extra feature to table
             * @param feature
             * @param {function(_TheBuilder)} feature.beforeInit Called before `DataTable()`
             * @param {function(_TheBuilder)} feature.beforeData Called after DataTable created and before ajax data call
             * @param {function(_TheBuilder)} feature.afterInit Called in DataTable `initComplete`
             * @param {function(_TheBuilder)} feature.onDestroy Called on scope destroy
             */
            function _addFeature(feature) {
                // var builder = this;
                builder._features.push(feature);
                return builder;
            }

            function _getTableWrapper() {
                return _getTableElem().closest('.dataTables_wrapper');

            }

            function _getTableElem() {
                // var builder = this;
                return $(builder._selector);
            }

            /**
             * Add items to selected. It compares by JSON stringified item `value`
             * @param {[{value:*}]} items
             */
            function markItemsSelected(items) {
                // console.log('markItemsSelected');
                var selectedValuesInJson = _.map(items, function (o) {
                    // return JSON.stringify(o.value);
                    return JSON.stringify(o);
                });
                var checkboxes = [];
                builder._dtInstance.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var checkbox = $('.js-mcheck-single', this.node());
                    var rowValue = checkbox.attr('value');
                    var valueComparator = builder._selectionSetting.valueComparator;
                    var found = false;
                    if (angular.isFunction(valueComparator)) {
                        found = _.find(items, function (o) {
                            return valueComparator(o, datatableUtil.htmlAttrToValue(rowValue));
                        });
                    } else {
                        found = selectedValuesInJson.indexOf(rowValue) > -1;
                    }
                    if (found) {
                        checkboxes.push(checkbox);
                    }
                });
                selectRows(scope, checkboxes, true);
            }

            function reloadData() {
                builder._dtInstance.ajax.reload(function () {
                    if (builder.selectedItems instanceof Array) builder.selectedItems.length = 0;
                    if (scope[builder.SELECTED_ITEMS_SCOPE_NAME] instanceof Array) scope[builder.SELECTED_ITEMS_SCOPE_NAME].length = 0;
                }, false);
            }

            function reloadDataSync() {
                new Promise(function (resolve, reject) {
                    builder._dtInstance.ajax.reload(function () {
                        resolve();
                    }, false);
                }).then(function () {
                    if (builder.selectedItems instanceof Array) builder.selectedItems.length = 0;
                    if (scope[builder.SELECTED_ITEMS_SCOPE_NAME] instanceof Array) scope[builder.SELECTED_ITEMS_SCOPE_NAME].length = 0;
                    _reloadTable();
                });
            }

            function _reloadTable() {
                var tableElem = _getTableElem();
                $('th *', tableElem).on('click', function (event) {
                    var elem = $(event.target);
                    // If not checkbox (input)
                    if (!elem.is('input')) {
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        // event.preventDefault();
                        // return false;
                    }
                });
                // $('th .js-column-action', tableElem).on('click', function (event) {
                //     $('tr.js-cust-column-search-wrapper', tableElem).toggleClass('hidden');
                //     event.stopImmediatePropagation();
                // });
                //---- Create column auto filter
                //http://live.datatables.net/tamixov/1/edit
                // 重新渲染下拉菜单数据时，清空原有的数据
                var $tableWrapper = _getTableWrapper();
                var $select = $tableWrapper.find('.js-dt-filter-zone select');
                if ($select.length > 0) {
                    $select.remove();
                }
                builder._dtOptions.columns.forEach(function (columnDef, index) {
                    var extra = columnDef._extra || {};
                    if (extra.autoFilter) {
                        var $tableWrapper = _getTableWrapper();
                        builder._dtInstance.columns(index).every(function () {
                            var column = this;
                            var $select = $('<select class="form-select d-inline-block w-auto">' +
                                '<option value="">' + $(column.header()).text() + '</option></select>');
                            if (extra.autoFilterKey) {
                                $select.addClass('js-autofilter');
                                $select.data('filterKey', extra.autoFilterKey);
                            }
                            var ctrl = $select.prependTo($tableWrapper.find('.js-dt-filter-zone'));
                            //TODO: need remove the event listener on destroy
                            // console.log('columnDef', columnDef);
                            var select = ctrl.on('change', function () {
                                var elem = $(this);
                                var val = $.fn.dataTable.util.escapeRegex(
                                    elem.val()
                                );
                                column.search(val ? '^' + val + '$' : '', true, false).draw();
                            });
                            column.nodes().map(function (node, index) {
                                return node.innerText;
                            }).unique().sort().each(function (d, j) {
                                // Filter Option is empty
                                if (d) {
                                    select.append('<option value="' + d + '">' + d + '</option>')
                                }
                            });
                        });
                        var savedState = getSavedState();
                        if (savedState) {
                            var filters = $tableWrapper.find('.js-autofilter');
                            var autofilters = savedState.autofilters || {};
                            Object.keys(autofilters).forEach(function (key) {
                                filters.each(function () {
                                    var $select = $(this);
                                    if ($select.data('filterKey') === key) {
                                        $select.val(autofilters[key]);
                                    }
                                });
                            });
                        }
                    }
                });
            }


            function getTableData() {
                // var builder = this;
                return builder._dtInstance.data() || [];
            }

            /**
             *
             * @returns {_TheBuilder}
             */
            function renderDataTable() {
                // var builder = this;
                var tableElem = _getTableElem();
                if ($.fn.DataTable.isDataTable(tableElem)) {
                    return;
                }
                builder._features.forEach(function (feature) {
                    feature.beforeInit && feature.beforeInit(builder);
                });
                var dtOptions = _createDtOptions();

                addEventOnTableUIReady(tableElem);
                builder._dtInstance = tableElem.DataTable(dtOptions);
                // tableElem.on('destroy.dt', function (e, settings) {
                //     builder._features.forEach(function (feature) {
                //         feature.onDestroy && feature.onDestroy(builder);
                //     });
                // });
                builder._scope.$on('$destroy', function () {
                    builder._features.forEach(function (feature) {
                        feature.onDestroy && feature.onDestroy(builder);
                    });
                });

                return builder;

                function addEventOnTableUIReady(table) {
                    table.on('preInit.dt', function (event) {
                        var wrapper = _getTableWrapper();
                        addClearFilterButton(wrapper);
                    });

                    function addClearFilterButton($wrapper) {
                        var inputFilter = $wrapper.find('.dataTables_filter .js-dt-filter');
                        if (inputFilter.length > 0) {
                            var btnResetSearch = '<button type="button" class="btn btn-default opx-btn-icon opx-btn-flat op-dt-clearfilter" ng-click="clearSearch()"><i class="far fa-times"></i></button>';
                            scope.clearSearch = function () {
                                builder._dtInstance.search('').draw();
                                inputFilter.focus();
                            }
                            inputFilter.after($compile(btnResetSearch)(scope)).addClass('op-filter-with-button');
                        }
                    }
                }
            }

            function withStateSave() {
                var options = builder._dtOptions;
                if (!_getTableElem().attr('id')) {
                    options.stateSave = false;
                    return;
                }
                options.stateSave = true;
                options.stateSaveCallback = function (settings, data) {
                    var states = loadAllStates();
                    // Because we save custom data like autofilter, do not assign data to states[settings.sInstance] directly
                    states[settings.sInstance] = _.extend({}, states[settings.sInstance], data);
                    var keys = Object.keys(states);
                    if (keys.length > STATE_SAVE_LIMIT) {
                        keys.sort(function (a, b) {
                            return states[b].time - states[a].time
                        });
                        for (var i = keys.length - 1; i >= STATE_SAVE_LIMIT; i--) {
                            delete states[keys[i]];
                        }
                    }
                    if (STATE_SAVE_EXPIRY_MINUTES > 0) {
                        Object.keys(states).forEach(function (key) {
                            // Remove states if expired
                            if (Date.now() - states[key].time > STATE_SAVE_EXPIRY_MINUTES * 60 * 1000) {
                                delete states[key];
                            }
                        });
                    }
                    return saveAllStates(states);
                };
                options.stateLoadCallback = function (settings) {
                    var states = loadAllStates();
                    return states[settings.sInstance] || {};
                };
                options.stateSaveParams = function (settings, data) {
                    var filters = _getTableWrapper().find('.js-autofilter');
                    if (filters.length > 0) {
                        data.autofilters = {};
                        filters.each(function () {
                            var $select = $(this);
                            var key = $select.data('filterKey');
                            data.autofilters[key] = $select.val();
                        });
                    }
                };
                return builder;
            }

            /**
             * Add the option to the datatables options
             * @param key the key of the option
             * @param value an object or a function of the option
             */
            function withOption(key, value) {
                // var builder = this;
                if (angular.isString(key)) {
                    builder._dtOptions[key] = value;
                }
                return builder;
            }


            function withOptions(obj) {
                Object.entries(obj).forEach(function (entry) {
                    var key = entry[0], value = entry[1];
                    if (angular.isString(key)) {
                        builder._dtOptions[key] = value;
                    }
                })

                return builder;
            }

            /**
             * Create table with buttons.
             * @param {[]} buttons Supported buttons include "excel" to export table in Excel, "reload" to reload table data
             * @returns {_TheBuilder}
             */
            function withButton(buttons) {
                buttons = angular.isString(buttons) ? [buttons] : buttons;
                if (angular.isArray(buttons)) {
                    buttons.forEach(function (button) {
                        if ('colvis' === button) {
                            builder._dtOptions.buttons.push({
                                extend: 'colvis',
                                text: '<i class="far fa-columns" title="' + $translate.instant('common.table.select_column') + '"></i>',
                                className: "__btn-sm btn-default opx-btn-icon opx-btn-flat",
                                columnText: function (dt, idx, title) {
                                    return (idx + 1) + ': ' + title;
                                }
                            });
                        } else if ('excelHtml5' === button || 'excel' === button) {
                            var caption = _getTableElem().data('caption') || 'DataExport';
                            builder._dtOptions.buttons.push({
                                extend: 'excelHtml5',
                                text: '<i class="far fa-file-download" title="' + $translate.instant('common.table.data_output') + '"></i>',
                                className: "__btn-sm btn-default opx-btn-icon opx-btn-flat",
                                filename: caption + '_' + $filter('date')((new Date()), "yyyyMMdd"),
                                title: null,
                                autoFilter: true,
                                customize: datatableUtil.customizeExcelExport,
                                exportOptions: {orthogonal: 'export'}
                            });
                        } else if ('reload' === button) {
                            builder._dtOptions.buttons.push({
                                extend: '',
                                text: '<i class="far fa-sync-alt" title="' + $translate.instant('common.table.refresh_table') + '"></i>',
                                className: "__btn-sm btn-default opx-btn-icon opx-btn-flat",
                                title: $translate.instant('common.table.refresh_table'),
                                action: function (event, dt, node, cfg) {
                                    var that = this;
                                    var refreshIcon = $(node).find('i');
                                    that.disable(); // disable button
                                    refreshIcon.addClass('fa-spin');
                                    dt.ajax.reload(function () {
                                        that.enable();
                                        refreshIcon.removeClass('fa-spin');
                                    }, false);
                                }
                            });
                        } else {
                            throw new Error('UnSupported button : ' + button.toString());
                        }
                    });
                }
                return builder;
            }

            /**
             * With a checkbox in front of each row.
             * Added by Leo 20210507.
             * The value of selected items is in format of [{value:*, label:string}] and stored in element's `scope[SELECTED_ITEMS_SCOPE_NAME]`
             * @param setting
             * @param {string|function} setting.valueData Value of selected item
             * @param {string|function} setting.labelData Label of selected item
             * @param {string|function<*,*>=} setting.valueComparator  A function to compare two values if equal.
             * It is used to program select checkbox. If not specified, it will compare by JSON string.
             * Parameter 1 is self value data, parameter 2 is value taken from checkbox.
             * @param {[{value:*,label:string=}]} setting.preselected Reference of variable to hold selected items
             * @param {function} setting.stateFn A function to determine checkbox state.
             * Function support parameter `row` as row data.
             * Return value is string "disabled" to disable the checkbox, "hidden" to hide the checkbox.
             * @returns {_TheBuilder}
             */
            function withSelection(setting) {
                if (!setting) {
                    return builder;
                }
                if (!setting.valueData || (!angular.isString(setting.valueData) && !angular.isFunction(setting.valueData))) {
                    throw new TypeError('Parameter `setting.valueData` in `withSelection(setting)` must be non-empty string or function');
                }
                if (setting.labelData && (!angular.isString(setting.labelData) && !angular.isFunction(setting.labelData))) {
                    throw new TypeError('Parameter `setting.labelData` in `withSelection(setting)` is either empty, string or function');
                }
                if (setting.preselected && !angular.isArray(setting.preselected)) {
                    throw new TypeError('Parameter `setting.preselected` in withSelection(setting` must be array');
                    // if (setting.preselected.length > 0) {
                    //     var sample = setting.preselected[0];
                    //     if (!sample.hasOwnProperty('value')) {
                    //         throw new TypeError('Parameter `setting.preselected` in withSelection(setting` must be format of `[{value:*,label:string=}]`');
                    //     }
                    // }
                }
                builder.selectedItems = setting.preselected;
                var stateFn = setting.stateFn;
                builder._selectionSetting = setting;
                builder._dtOptions.columns = builder._dtOptions.columns || [];
                // scope[builder.SELECTED_ITEMS_SCOPE_NAME] = selectedItems;
                // builder.selectedItems = selectedItems;
                scope[builder.SELECTED_ITEMS_SCOPE_NAME] = [];
                builder._dtOptions.columns.unshift({
                    //https://datatables.net/forums/discussion/41269/requested-unknown-parameter-error-with-createdcell-in-conjunction-with-render
                    data: null,
                    title: '<div class="checkbox checkbox-inline checkbox-primary"><input type="checkbox" class="js-mcheck-all"><label></label></div>',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var valueData = setting.valueData;
                        var labelData = setting.labelData;
                        return datatableUtil.buildSingleCheckbox(row, valueData, labelData, stateFn);
                    }
                });
                _addFeature({
                    onDestroy: function (builder) {
                        var wrapper = _getTableWrapper();
                        wrapper.off();
                    },
                    afterInit: function () {
                        var wrapper = _getTableWrapper();
                        $compile(buildSelectionMark(scope))(scope)
                            .prependTo(wrapper.find('.js-dt-selmark'));
                        wrapper.on('click', 'input.js-mcheck-all', function (e) {
                            var checked = $(this).prop('checked');
                            $timeout(function () {
                                selectRows(builder._scope, wrapper.find('td input.js-mcheck-single').not('[disabled]'), checked);
                            });
                            e.stopPropagation();
                        }).on('click', 'input.js-mcheck-single', function (e) {
                            var checkbox = $(this);
                            $timeout(function () {
                                selectRows(builder._scope, checkbox, null);
                            });
                            e.stopPropagation();
                        }).on('click', '.js-dt-selmark .dropdown-menu', function (e) {
                            // https://stackoverflow.com/questions/44646567/keep-bootstrap-dropdown-open-when-clicked-inside
                            e.stopPropagation();
                        });
                        if (setting.preselected) {
                            // console.log('afterInit.markItemsSelected', {preselected: setting.preselected});
                            markItemsSelected(setting.preselected);
                        }

                        /**
                         * Build selection mark dropdown.
                         * @param scope
                         * @returns {string} The dropdown HTML
                         */
                        function buildSelectionMark(scope) {
                            var bulkSelectionHtml = '<div class="dropdown" ng-if="' + builder.SELECTED_ITEMS_SCOPE_NAME + '.length > 0">' +
                                '<button type="button" data-bs-toggle="dropdown" class="btn __btn-sm btn-default opx-btn-flat"><span ng-bind-html="\'common.datatable.selected_items_count\' | translate:{count:' + builder.SELECTED_ITEMS_SCOPE_NAME + '.length}"></span> <i class="fa fa-angle-down"></i></button>' +
                                '<div class="dropdown-menu" ng-if="' + builder.SELECTED_ITEMS_SCOPE_NAME + '.length>0" style="max-width:20rem;max-height:25rem;overflow-y:auto;">' +
                                '<div class="dropdown-item" ng-repeat="item in ' + builder.SELECTED_ITEMS_SCOPE_NAME + ' track by $index">' +
                                '<span class="d-flex py-2 px-3">' +
                                '<span class="me-auto text-ellipsis">{{item.label||item.value}}</span>' +
                                '<button class="ms-1 btn btn-sm btn-danger opx-btn-icon opx-btn-flat" ng-click="removeSelectedItem($index)" __style="width:1rem;text-align:center;"><i class="fa fa-times"></i></button>' +
                                '</span>' +
                                '</div>' +
                                '</div></div>';
                            scope.removeSelectedItem = function (index) {
                                var removedItem = scope[builder.SELECTED_ITEMS_SCOPE_NAME].splice(index, 1)[0];
                                // console.log('buildSelMark.dtInstance',dtInstance);
                                builder._dtInstance.rows('.' + TR_SELECTED_CSS).every(function () {
                                    var row = this;
                                    var tr = $(row.node());
                                    if (tr.data('op_selected_value') === removedItem.value) {
                                        var checkbox = tr.find('.js-mcheck-single');
                                        selectRows(scope, checkbox, false);
                                    }
                                });
                            };
                            return bulkSelectionHtml;
                        }
                    }
                });
                return builder;
            }

            /**
             * Toggle rows checkbox state and row css style.
             * Sync between checkboxes and page parameters.
             * @param scope
             * @param {angular.element|[angular.element]} checkboxes Checkbox elements to select
             * @param {boolean=} forcedState Use this value if specified, otherwise use checkbox property.
             */
            function selectRows(scope, checkboxes, forcedState) {
                var isForced = _.isBoolean(forcedState);
                if (angular.isArray(checkboxes)) {
                    checkboxes.forEach(function (checkbox) {
                        selectOne(checkbox);
                    });
                } else {
                    checkboxes.each(function () {
                        selectOne($(this));
                    });
                }
                builder.selectedItems.length = 0;
                scope[builder.SELECTED_ITEMS_SCOPE_NAME].forEach(function (o) {
                    builder.selectedItems.push(o.value);
                });

                function selectOne(checkbox) {
                    var tr = checkbox.closest('tr');
                    var isChecked;
                    var value = checkbox.attr('value');
                    var item = {
                        value: datatableUtil.htmlAttrToValue(value),
                        label: checkbox.data('label')
                    };
                    if (isForced) {
                        isChecked = forcedState;
                        checkbox.prop('checked', forcedState);
                    } else {
                        isChecked = checkbox.prop('checked');
                    }
                    _.remove(scope[builder.SELECTED_ITEMS_SCOPE_NAME], function (o) {
                        return datatableUtil.valueToHtmlAttr(o.value) === value;
                    });
                    if (isChecked) {
                        scope[builder.SELECTED_ITEMS_SCOPE_NAME].push(item);
                        tr.data('op_selected_value', item.value).addClass(TR_SELECTED_CSS);
                    } else {
                        tr.removeData('op_selected_value').removeClass(TR_SELECTED_CSS);
                    }
                }
            }

            /**
             * Create DataTable options used in `.DataTable(options)`
             * @param {{noSearch:boolean,pagination:string}}config
             */
            function _createDtOptions(config) {
                var headerDom;
                // var builder = this;
                config = config || {filter: 'right'};
                //https://datatables.net/reference/option/dom
                // l: length, f: filter, t: table, i: info, p: pagination, r: processing
                // B: buttons, R: ColReorder, S: Scroller, P: SearchPanes
                var domFilterLeft = "<'js-dt-filter-zone form-inline' fB<'js-dt-selmark'>>";
                var domFilterRight = "<'js-dt-filter-zone form-inline' <'js-dt-selmark'>fB>";
                var domCustCtrls = "<'js-dt-custctrls op-smartform form-inline flex-fill'>";
                if (config.filter === 'left') {
                    domCustCtrls = "<'js-dt-custctrls justify-content-end op-smartform form-inline flex-fill'>";
                    headerDom = "<'op-datatable-header'" + domFilterLeft + domCustCtrls + ">";
                } else {
                    headerDom = "<'op-datatable-header'" + domCustCtrls + domFilterRight + ">";
                }
                var footerDom = "<'js-dt-footer op-datatable-footer'<li><p>>";
                if (config.pagination === 'none') {
                    footerDom = "<'js-dt-footer op-datatable-footer'>";
                }
                var dom = headerDom + "<'js-dt-table table-responsive flex-fill'tr>" + footerDom;
                var dtOptions = {
                    // autoWidth: true,
                    autoWidth: false,
                    // deferRender: true,
                    lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
                    pageLength: 10,
                    // scrollX: true,
                    // scrollY: 600,//高度最大为600px,再大就上下滚动显示
                    // scrollCollapse: true,
                    serverSide: false,
                    buttons: [],
                    // pagingType: "simple_numbers",
                    // pagingType: 'listbox',
                    pagingType: 'input',
                    dom: dom,
                    renderer: 'bootstrap',
                    // processing: true,
                    //https://datatables.net/blog/2014-10-22
                    searchHighlight: true,
                    responsive: {
                        details: {
                            type: 'inline',
                            renderer: $.fn.dataTable.Responsive.renderer.listHiddenNodes()
                        }
                    },
                    drawCallback: function (settings) {
                        hideFooterWhenEmpty();

                        function hideFooterWhenEmpty() {
                            var wrapper = _getTableWrapper();
                            var isEmpty = wrapper.find('.dataTables_empty').length === 1;
                            var footer = wrapper.find('.js-dt-footer');
                            if (isEmpty) {
                                footer.hide();
                            } else {
                                footer.show();
                            }
                        }
                    },
                    createdRow: function (row, data, dataIndex) {
                        if (builder._scope) {
                            // console.log(builder._selector,builder._scope);
                            $compile(row)(builder._scope);
                        }
                    },
                    initComplete: function (settings, json) {
                        builder._features.forEach(function (feature) {
                            feature.afterInit && feature.afterInit(builder);
                        });
                    }
                };
                var allOptions = $.extend(true, {}, dtOptions, builder._dtOptions);
                return allOptions;
            }

            function loadAllStates() {
                return JSON.parse(localStorage.getItem(STATE_SAVE_KEY) || '{}');
            }

            function getSavedState() {
                if (builder._dtOptions.stateSave) {
                    var tableId = _getTableElem().attr('id');
                    if (tableId) {
                        var allStates = loadAllStates();
                        return allStates[tableId];
                    }
                }
                return null;
            }

            function saveAllStates(all) {
                if (angular.isObject(all)) {
                    localStorage.setItem(STATE_SAVE_KEY, JSON.stringify(all));
                }
            }

            /**
             * Prepend custom controls to table header.
             * Added by Leo 20210507.
             * @param {string|angular.element} ctrl HTML content or selector of custom controls.
             * If this is HTML content, it will be compiled to support angularjs.
             * @returns {*}
             */
            function withCustomControl(ctrl) {
                // var builder = this;
                _addFeature({
                    beforeData: function (builder) {
                        var container = getCustControlElem(builder);
                        var elem = $(ctrl).prependTo(container);
                        if (angular.isString(ctrl)) {
                            // Compile only if custom control is not compiled
                            $compile(elem)(scope);
                        }
                    }
                })
                return builder;
            }

            /**
             * @param {[[]]} order In format of [[0, 'asc'],[1, 'desc']]
             */
            function withOrder(order) {
                // var builder = this;
                if (!order) {
                    // Override default [[0, 'asc']]
                    builder._dtOptions.order = [];
                    return this;
                }
                if (!angular.isArray(order)) {
                    throw new Error('The parameter orders must be an array');
                }
                builder._dtOptions.order = order;
                return builder;
            }

            function withColumn(columns) {
                // var builder = this;
                if (!angular.isArray(columns)) {
                    throw new Error('ProgramError: The parameter columns must be a array');
                }
                // Do not mutate incoming columns
                builder._dtOptions.columns = angular.copy(columns);
                builder._dtOptions.columns.forEach(function (col) {
                    if (angular.isUndefined(col.defaultContent)) {
                        col.defaultContent = '';
                    }
                    if (angular.isUndefined(col.title)) {
                        col.title = col.data || '';
                    }
                    if (!col.render) {
                        var extra = _.extend({}, {linebreak: true, linelimit: false}, col._extra);
                        col.render = function (data, type, row, meta) {
                            var text = data;
                            if (extra.linebreak === true) {
                                text = datatableUtil.wrapText(data, type);
                                // console.log(text);
                            }
                            if (type === 'display' && extra.linelimit === true) {
                                return '<div class="udp-linelimit">' + text + '</div>';
                            }
                            return text;
                        }
                    }
                });
                _addFeature({
                    beforeInit: function wrapColumn(builder) {
                        var tableElem = _getTableElem();
                        var thead = '';
                        builder._dtOptions.columns.forEach(function (column, index) {
                            var action = '';
                            thead += '<th data-col-index="' + index + '"><div class="d-flex justify-content-between op-hover-trigger"><span class="js-column-label flex-fill">' + column.title + '</span>' + action + '</div></th>';
                            delete column.title;
                        });
                        thead = '<thead><tr>' + thead + '</tr></thead>';
                        tableElem.remove('thead');
                        tableElem.prepend(thead);
                    },
                    afterInit: function (builder) {
                        _reloadTable();
                    }
                });
                return builder;
            }
        }
    }
})
();
