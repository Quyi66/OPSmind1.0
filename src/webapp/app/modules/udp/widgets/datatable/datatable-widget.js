/**
 * Widget for table with data source
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/18/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['$q', '$timeout', '$compile', 'modalHelper', 'debugTimer', 'conditionalFormat', 'widgetFactory', 'datasetService', 'widgetDataUtil', 'dataEx', 'widgetInteraction', 'widgetUiHelper', 'datatableWidgetUpdater', 'widgetSecurity', 'messageService', 'pageDataUtil', 'udpModuleConfig', 'devel', '$translate', 'datatableUtil', datatableWidget]);

    /**
     * Field definition model for reference
     * @type {{css: string, hidden: boolean, scale: number, label: string, align: string, type: string, mcheckParam: string, formatter: string, mcheckType: string, defaultContent: string, dynamic: boolean, dynamicDef: string, cutoff: number, accum: string, convertFn: string, wrap: string, mcheck: boolean, order: string}}
     */
    var FieldModelRef = {
        // The dataset field binding to. It will be used as default display/export value, field name for sorting, query.
        field: 'field_name_of_record',
        // TODO: rename to dataDis
        convertFn: '',
        type: 'number,string,date', // auto from dataset fields
        // Field data for server side processing. Now used for server side export.
        // A plain javascript can be interpreted by java 8 Nashorn
        dataSsp: '',
        // Display
        label: '',
        hidden: false,
        defaultContent: '',
        orderable: true,
        order: '-,asc,desc',
        // Styles
        align: '-,left,center,right',
        wrap: '-,wrap',
        css: 'pre code any-css',
        // Value format
        cutoff: 0,
        formatter: '',
        scale: 0,
        // Stats
        accum: 'MIN,MAX,COUNT,SUM,AVERAGE', // for type==='number'
        // For dynamic field
        dynamic: false,
        dynamicDef: 'yaml:array_of_dynamic_fields', // YAML or JS represents above attributes
        // For checkbox field
        mcheck: false,
        mcheckParam: 'page_param_to_sync', // Name of page parameter to which selected items are synced to
        mcheckType: '-,csv,json,map'      // Data type of output parameter
    };

    /**
     *
     * @param {widgetFactory} widgetFactory
     * @param {datasetService} datasetService
     * @param $q
     * @param $timeout
     * @param {conditionalFormat} conditionalFormat
     * @param {debugTimer} debugTimer
     * @param $compile
     * @param modalHelper
     * @param {widgetDataUtil} widgetDataUtil
     * @param {dataEx} dataEx
     * @param {widgetInteraction} widgetInteraction
     * @param {widgetUiHelper} widgetUiHelper
     * @param {datatableWidgetUpdater} datatableWidgetUpdater
     * @param {messageService} messageService
     * @param {widgetSecurity} widgetSecurity
     * @param {pageDataUtil} pageDataUtil
     * @param {udpModuleConfig} udpModuleConfig
     * @param {devel} devel
     * @param $translate
     * @param {datatableUtil} datatableUtil
     */
    function datatableWidget($q, $timeout, $compile, modalHelper, debugTimer, conditionalFormat, widgetFactory, datasetService, widgetDataUtil, dataEx, widgetInteraction, widgetUiHelper, datatableWidgetUpdater, widgetSecurity, messageService, pageDataUtil, udpModuleConfig, devel, $translate, datatableUtil) {
        var VFIELD = '__v';
        var enableAdjustHeight = !false;
        var SELECTED_CSS = 'selected';
        var convertOnTheFly,
            useColumnResponsive;
        useColumnResponsive = false;
        convertOnTheFly = false;
        var selectedUseDropdown = true;
        // LEO@20200308: If number of columns exceeds this, the table will use responsive columns.
        // In Chrome 80, a table of 69 column will produce a 10~20 seconds Long Task!
        // During the Long Task, the browser is totally no response.
        // It seems that the browser is doing some internal work like rendering page (FMP),
        // so Chrome DevTools does not tell what JS is doing the task.
        // - DevTools can indicates exact JS code if Long Task caused by user code.
        // Only a message hint in console: [Violation] Forced reflow while executing JavaScript took 214ms
        // **There is no such issue in Edge and IE 11.**
        // After hours of investigation, I doubt there is some bug of DataTables in Chrome to calculate the table size.
        // Therefore, for the reason both of performance and UX, use responsive columns are needed.
        var FORCE_RESPONSIVE_COLUMNS = 20;

        widgetFactory.defineWidget({
            type: 'datatable',
            name: $translate.instant('udp.w.datatable.name'),
            resizable: enableAdjustHeight ? 'h' : null,
            configController: DatatableWidgetConfigCtrl,
            group: 'data',
            widthMode: 'wm-full',
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onReloadData: onReloadData,
                onInitControl: onInitControl,
                makePrintable: makePrintable,
                onResize: onResize
            }
        });

        function makePrintable(element, props, options) {
            options = options || {};
            // function handleDataTable() {
            var d = $q.defer();
            var cloneDataTableWrappers = element.find('.dataTables_wrapper');

            if (options.fulldata) {
                // Disable pagination of original datatable and copy data to cloned table
                var promises = [];
                var tableWrappers = $('body').find('.dataTables_wrapper');
                tableWrappers.each(function (i, e) {
                    var table = $('.dataTables_scrollBody table.dataTable', e);
                    promises.push(getDatatableFullData(table, i));
                });
                $q.all(promises).then(function () {
                    restoreHiddenHeader();
                    d.resolve();
                }).catch(function (err) {
                    d.reject(err);
                })
            } else {
                cloneDataTableWrappers.each(function (i, e) {
                    var table = $('.dataTables_scrollBody table.dataTable', e);
                    // In scrollable datatable, there will be two `table.dataTable`,
                    // one with class dataTables_scrollHead, one with class dataTables_scrollBody
                    cloneDataTableWrappers.eq(i).replaceWith(table[0].outerHTML);
                    restoreHiddenHeader();
                });
                d.resolve();
            }
            return d.promise;

            function restoreHiddenHeader() {
                element.find('table.dataTable > thead').find('tr, tr th, tr div').removeAttr('style');
            }

            /**
             *
             * @param table {tableWrappers}
             * @param i {number} Index of datatable
             * @returns {promise}
             */
            function getDatatableFullData(table, i) {
                var d = $q.defer();
                var dt = table.DataTable();
                // on('draw') must be placed before draw()
                dt.on('draw', function () {
                    cloneDataTableWrappers.eq(i).replaceWith(table[0].outerHTML);
                    d.resolve();
                });
                // Fetch full data by disabling page length and forcing redraw
                dt.page.len(-1).draw();
                return d.promise;
            }

            // }
        }

        /**
         *
         * TODO: change fields.name to columns.field?
         *
         * @param scope
         * @param props
         */
        function DatatableWidgetConfigCtrl(scope, props) {
            datatableWidgetUpdater.updateProps(scope.uwProps);
            scope.uwProps.fields = scope.uwProps.fields || [];
            scope.uwProps.display = scope.uwProps.display || {};
            scope.rules = scope.uwProps.display.rules = scope.uwProps.display.rules || [];
            scope.current = { index: 0 };
            // scope.cssList = [{css: 'pre', label: $translate.instant('udp.w.datatable.css_pre')}, {css: 'code', label: $translate.instant('udp.w.datatable.css_code')}];
            scope.previewFieldsData = previewFieldsData;
            scope.addField = addField;
            scope.addAllFields = addAllFields;
            scope.removeAllFields = removeAllFields;
            scope.removeField = removeField;
            scope.addRule = addRule;
            scope.removeRule = removeRule;
            scope.selectRule = selectRule;
            scope.showDataConverter = {};
            scope.sortableOptions = {
                // handle: '.op-drag-handle',
                placeholder: 'ui-sortable-placeholder',
                'ui-floating': true,
                stop: function (e, ui) {
                    // Use ui.item.sortable.dropindex instead of ui.item.index()
                    // https://github.com/angular-ui/ui-sortable/issues/273
                    // var newIndex = ui.item.index();
                    var newIndex = ui.item.sortable.dropindex;
                    if (angular.isNumber(newIndex)) {
                        scope.current.index = newIndex;
                    }
                }
            };
            scope.uwProps.fields.forEach(function (f, index) {
                if (f.convertFn || f.dataSsp) {
                    scope.showDataConverter[index] = true;
                }
            });

            function previewFieldsData(fields, values) {
                var table = angular.element('<table class="table table-bordered"></table>');
                var trHeader = angular.element('<tr class="bg-light"></tr>').appendTo(table);
                var trDisplay = angular.element('<tr class="_display"></tr>').appendTo(table);
                var trExport = angular.element('<tr class="_export table-warning"></tr>').appendTo(table);
                fields.forEach(function (def) {
                    if (!def.hidden) {
                        trHeader.append(angular.element('<th></th>').html(def.label));
                        var displayValue, exportValue;
                        if (def.field) {
                            exportValue = displayValue = dataEx.pathValue(values, def.field);
                        }
                        if (def.convertFn) {
                            displayValue = dataEx.evalVarExpr(def.convertFn, values);
                        }
                        trDisplay.append(angular.element('<td></td>').html(displayValue));
                        if (def.dataSsp) {
                            exportValue = dataEx.evalVarExpr('js:' + def.dataSsp, values);
                        }
                        trExport.append(angular.element('<td></td>').html(exportValue));
                    }
                });
                messageService.alert($translate.instant('udp.dataex.data_preview'), '<div class="udp-data-preview table-responsive">' + table.prop('outerHTML') + '</div>');
            }

            function selectRule(index) {
                scope.currentRule = scope.rules[index];
            }

            function removeRule(index) {
                messageService.confirm('', $translate.instant('udp.wc.condfmt.remove_rule'), function () {
                    scope.rules.splice(index, 1);
                });
            }

            function addRule() {
                scope.currentRule = {};
                scope.rules.push(scope.currentRule)
            }

            function addField() {
                scope.inserted = { field: '', label: undefined };
                scope.uwProps.fields.push(scope.inserted);
                scope.current.index = scope.uwProps.fields.length - 1;
            }

            function removeAllFields() {
                scope.uwProps.fields = [];
                scope.current.index = -1;
            }

            function addAllFields(fields) {
                fields.forEach(function (field) {
                    if (!_.find(scope.uwProps.fields, function (f) {
                        return f['field'] === field.name;
                    })) {
                        scope.uwProps.fields.push({ field: field.name/*, alias: field.alias || undefined*/ });
                    }
                });
            }

            function removeField(index) {
                messageService.confirmWarning($translate.instant('udp.wc.common.remove_field'), $translate.instant('udp.wc.common.remove_field_confirm'), function () {
                    $timeout(function () {
                        scope.uwProps.fields.splice(index, 1);
                    });
                });
            }
        }

        function isValidProps(props) {
            var dataset = props['dataset'], fields = props['fields'];
            return !(!dataset || !fields || fields.length === 0);
        }

        /**
         * Create a skeleton HTML table element
         * @param {[FieldModelRef]} fields
         * @param {object} display
         * @param {boolean} display.noBorder
         * @param {boolean} display.noGrid
         * @param {boolean} display.noHeader
         * @param {string} display.width
         * @param {boolean} display.autoWidth
         * @param {boolean} needDtSelect
         * @param {boolean} isServerPage
         * @param {boolean} tableOnly True to only create table, not selection mark
         * @returns {string} HTML
         */
        function createTableHtml(fields, display, needDtSelect, isServerPage, tableOnly) {
            var css = '',
                hasMcheck = false,
                tfoot = '<tfoot><tr>';
            var header = display.noHeader ? ' style="display:none";' : '';
            var thead = '<thead' + header + '><tr>';
            if (useColumnResponsive) {
                thead += '<th></th>';
            }
            var isEditMode = widgetUiHelper.isEditMode();
            fields.forEach(function (f, i) {
                if (!f.hidden) {
                    var cssClasses = [];
                    var label = f.label || /*f.alias ||*/ f.field || '';
                    if (f.mcheck) {
                        hasMcheck = true;
                        label = '<div class="checkbox checkbox-inline checkbox-primary">' +
                            '<input type="checkbox" class="js-mcheck-all"' +
                            ' data-mcheck-param="' + f.mcheckParam + '">' +
                            '<label></label></div>';
                    } else if (f.dynamic) {
                        label = '<i class="far fa-ellipsis-h"></i>';
                    } else {
                        var action = '';
                        if (!isServerPage || (isServerPage && f.orderable)) {
                            // action = '<span class="js-column-action op-hover-to-show btn __btn-sm btn-secondary rounded-circle opx-btn-flat opx-btn-icon" style="opacity:0.5;"><i class="fa fa-ellipsis-v"></i></span>';
                        }
                        if (isServerPage && f.searchable) {
                            cssClasses.push('op-searchable');
                        }
                        label = '<div class="d-flex justify-content-between op-hover-trigger"><span class="js-column-label flex-fill">' + label + '</span>' + action + '</div>';
                    }
                    thead += '<th data-field-index="' + i + '" class="' + cssClasses.join(' ') + '">' + label + '</th>';
                    var th = $('<th></th>');
                    if (f.accum) {
                        th.attr({
                            'data-accum': f.accum,
                            'data-format': JSON.stringify({ type: f.type, formatter: f.formatter, scale: f.scale })
                        });
                    }
                    tfoot += th.prop('outerHTML');
                }
            });
            thead += '</tr></thead>';
            tfoot += '</tr></tfoot>';
            // Default style is "opx-table table table-hover"
            // if (display.style === 'simple')
            css += ' opx-table table-hover';
            // if (!display.noBorder) {
            //     css += ' table-bordered';
            // }
            if (display.noGrid) {
                css += ' table-borderless';
            }
            if (display.autoWidth) {
                css += ' table-autowidth';
            }
            var width = display.width ? display.width + 'px' : '100%';
            var htmlSelmark = '';
            if (hasMcheck && needDtSelect !== false) {
                if (devel.needMobileView()) {
                    htmlSelmark += '<div class="js-dt-selmark"><ul class="list list-inline m-0 wrapper-xs" ng-if="_selectedItems.length>0">' +
                        '<li class="small"><span ng-bind-html="\'common.datatable.selected_items_count\'|translate:{count:_selectedItems.length}"></span>' +
                        '</li>' +
                        '</ul></div>';
                } else {
                    if (selectedUseDropdown) {
                        htmlSelmark += '<div class=" js-dt-selmark d-inline-block">' +
                            '<div class="dropdown" ng-if="_selectedItems.length > 0">' +
                            '<button type="button" data-bs-toggle="dropdown" class="btn btn-default opx-btn-flat"><span ng-bind-html="\'common.datatable.selected_items_count\'|translate:{count:_selectedItems.length}"></span><span class="caret"></span></button>' +
                            '<div class="dropdown-menu" ng-if="_selectedItems.length>0" style="max-height:20rem;overflow-y:auto;">' +
                            '<a ng-repeat="item in _selectedItems track by $index" class="dropdown-item d-flex py-2 px-3"><span class="me-auto">{{item.value}}</span><span ng-click="removeSelectedItem($index)"><i class="fa fa-times"></i></span></a>' +
                            '</div></div></div>';
                    } else {
                        htmlSelmark += '<div class="js-dt-selmark"><ul class="list list-inline m-0 wrapper-xs" ng-if="_selectedItems.length>0">' +
                            '<li class="small"><span ng-bind-html="\'common.datatable.selected_items_count\'|translate:{count:_selectedItems.length}"></span></li>' +
                            '<li ng-repeat="item in _selectedItems track by $index"><span class="badge bg-primary op-dt-select-chip">{{item.value}} <a ng-click="removeSelectedItem($index)"></a></span></li>' +
                            '</ul></div>';
                    }
                }
            }
            var html = (tableOnly ? '' : htmlSelmark)
                + '<table class="table js_udp_table ' + css + '" style="width:' + width + '">'
                + thead + (display.footer ? tfoot : '')
                + '</table>';
            return html;
        }

        function isServerSide(props) {
            return props.dataset && !props.dataset._type && props.dataset.serverPage;
        }

        /**
         * Get template HTML code for actual display with real data.
         * @param {{fields:[],display:{}}} props
         */
        function getTemplateForCompilation(props) {
            datatableWidgetUpdater.updateProps(props);
            if (!isValidProps(props)) {
                throw new WidgetNotConfiguredError($translate.instant('udp.wc.error.missing_dataset_or_field'));
            }
            var fields = props.fields, display = props.display || {};
            display.autoWidth = true;
            var isServerPage = isServerSide(props);
            if (getDynamicField(props)) {
                return createTableHtml(fields, display, true, isServerPage, false);
            } else {
                return createTableHtml(fields, display, true, isServerPage, false);
            }
        }


        /**
         *
         * @param {Scope} scope
         * @param {jQuery} elem
         */
        function onReloadData(scope, elem) {
            // If this is a datatable
            var dt = getDataTable(elem);
            var $dtWrapper = $('.dataTables_wrapper', elem);
            if ($dtWrapper.length > 0) {
                // Do not reset paging
                dt.ajax.reload(null, false);
            }
        }

        function getDataTable(elem) {
            return elem.data('theTable');
        }

        /**
         * Get dynamic field definition
         * @param props
         * @return {object|null}
         */
        function getDynamicField(props) {
            var fields = props.fields || [];
            var dynamicField = _.find(fields, function (f) {
                return f.dynamic === true;
            });
            return dynamicField;
        }

        function onResize(element, size) {
            var content = element.find('.uw-content');
            var body = content.find('.dataTables_scrollBody');
            if (body.length === 0) {
                body = content.find('.js-dt-table').css('overflow-y', 'auto');
            }
            content.css('overflow-y', 'auto');
            if (widgetUiHelper.isEditMode()) {
                var footer = content.find('.js-dt-footer');
                var tbodyHeight = calcFlexBodyHeight(content, body, footer);
                var display = {};
                display.bodyHeight = tbodyHeight;
                widgetUiHelper.upgradeWidgetProps(element, { display: display });
                //https://datatables.net/forums/discussion/22810/dynamically-changing-the-height-of-the-sscrolly
                $('.dataTables_scrollBody', element).outerHeight(display.bodyHeight).css('max-height', '');
            }

            /**
             * Calculate height in px of a flexible full height
             * @param {jQuery} $container The element contains body and bottom
             * @param {jQuery} $body The element to calculate height
             * @param {jQuery} $bottom Bottom element next to body
             */
            function calcFlexBodyHeight($container, $body, $bottom) {
                var fullHeight = $container.height();
                var bottomHeight = $bottom.outerHeight(true);
                var flexTop = $body.offset().top;
                var containerTop = $container.offset().top;
                var space = flexTop - containerTop + bottomHeight;
                console.log('calcFlexBodyHeight', {
                    contentHeight: fullHeight,
                    containerTop: containerTop,
                    flexTop: flexTop,
                    bottomHeight: bottomHeight
                });
                return Math.floor(fullHeight - space);
            }
        }

        function onInitControl(scope, element, props) {
            var PRECISE = 'precise', FUZZY = 'fuzzy';
            var isEditMode = widgetUiHelper.isEditMode();
            datatableWidgetUpdater.updateProps(props);
            if (!isValidProps(props)) {
                return;
            }
            // var pageParams = widgetUiHelper.findPageScope(scope).pageParams;
            var _timer = {};
            // Initial data for dynamic column
            var dynamicInitData;
            var allFields;
            var dataset = props['dataset'];
            props = props || {};

            var theTable, previousScope,
                display = props.display || {},
                isLayoutArranged = false,
                rules = display.rules;
            display.autoWidth = true;
            // pivot = props.pivot || {};
            var mcheckField = _.find(props.fields, { mcheck: true });
            scope.openCustomFilter = openCustomFilter;
            scope.refreshTable = refreshTable;
            scope.serverExport = serverExport;
            scope.toggleColumnFilter = toggleColumnFilter;
            scope.isColumnFilterOpen = false;
            scope.isColumnFilterButtonOpen = false;
            scope.removeSelectedItem = removeSelectedItem;
            scope.$on('$destroy', onDestroy);
            if (mcheckField) {
                scope.$watch(function (scope) {
                    var pageParams = pageDataUtil.findPageParams(scope)
                    if (!pageParams) {
                        return null;
                    }
                    return pageParams[mcheckField.mcheckParam];
                }, function (newVal, oldVal) {
                    scope.selectedItems = parseSelectedItems(newVal);
                }, true);
            }
            addCustomFilter();

            initColumns(props).then(function (columns) {
                // scope.isColumnFilterButtonOpen = checkShowFileColumn(columns);
                var options = initDisplayOptions(display, columns);
                options.order = initOrders(props.fields);
                saveDatatableOptions(options);
                theTable = $('table', element).DataTable(options);
                // Manually search on serverside
                if (dataset.serverPage) {
                    //TODO: refactor with column search
                    var custGlobalSearchSelector = '.dataTables_filter input.js-cust-global-search';
                    element.on('keyup', custGlobalSearchSelector, function (e) {
                        var value = this.value;
                        var input = $(this);
                        if (e.keyCode === 13 && value) {
                            theTable.search(value).draw();
                            input.addClass('udp-input-filtered');
                        }
                    }).on('input', custGlobalSearchSelector, function (e) {
                        var value = this.value;
                        var input = $(this);
                        // Clear filter if input is empty
                        if (!value) {
                            theTable.search(value).draw();
                            input.removeClass('udp-input-filtered');
                        }
                    });
                }
                initEllipsis(theTable);
                // TODO: check if it causes detached DOM
                element.data('theTable', theTable);
                theTable.on("column-resized.dt", onColResize);
                if (widgetUiHelper.isEditMode()) {
                    theTable.on("length.dt", onPageLengthChange);
                }
                if (mcheckField) {
                    addEventForMcheck();
                }
                addEventForClickRow();
                addEventForOpenPage();
            }).catch(function (err) {
                widgetUiHelper.showWidgetError(element, '', err.message);
            });


            function checkShowFileColumn(columns) {
                return !!_.find(columns, function (e) {
                    return e.searchable;
                });
            }

            function toggleColumnFilter() {
                //TODO: There are two tr.js-cust-column-search-wrapper, another is inside .dataTables_scrollBody
                var $tr = $('.dataTables_scrollHeadInner tr.js-cust-column-search-wrapper', element);
                var numOfVisibleCols = $tr.prev('tr').find('th:visible').length;//.each(function () {
                $tr.find('td').each(function (index) {
                    $(this).css('display', index < numOfVisibleCols ? '' : 'none');
                });
                $tr.toggleClass('hidden');
                scope.isColumnFilterOpen = !$tr.hasClass('hidden');
            }

            function serverExport() {
                messageService.confirm($translate.instant('udp.w.datatable.export'), $translate.instant('udp.w.datatable.export_confirm'), function () {
                    var fields = props.fields || [];
                    var exportColumns = [];
                    fields.forEach(function (f) {
                        if (!f.hidden && !f.mcheck) {
                            var value = f.field;
                            if (!value && f.dataSsp) {
                                value = '`' + f.dataSsp + '`';
                            }
                            exportColumns.push({ label: f.label || f.field, value: value || '' });
                        }
                    });
                    var columnSearchValues = {};
                    theTable.columns().every(function (colIndex) {
                        var col = this;
                        var colSetting = getColumnSetting(colIndex);
                        if (colSetting.searchable && colSetting.name && col.search()) {
                            columnSearchValues[colSetting.name] = col.search();
                        }
                        // if (col.name() && col.search()) {
                        //     columnSearchValues[col.name()] = col.search();
                        // }
                    });
                    var globalSearchValue = theTable.search();
                    var searchableColumnNames = getSearchableColumnNames();
                    var filter = datasetService.buildQueryFilter(globalSearchValue, searchableColumnNames, columnSearchValues);
                    var exportSetting = {
                        dataset: props.dataset.id,
                        filter: filter,
                        params: scope.$widget.wParams,
                        columns: exportColumns,
                        filename: props.title || $('title').text()
                    };
                    datasetService.exportData(exportSetting);
                });

                function getSearchableColumnNames() {
                    var dtColumns = getTableSettings().aoColumns;
                    var result = [];
                    dtColumns.forEach(function (col, index) {
                        if (col.searchable)
                            result.push(col.name);
                    });
                    return result;
                }

                function getColumnSetting(index) {
                    return getTableSettings().aoColumns[index];
                }
            }

            function refreshTable() {
                onReloadData(scope, element);
            }

            function openCustomFilter() {
                var dt = theTable;
                var instance = modalHelper.openModal(
                    {
                        templateUrl: 'app/modules/udp/widgets/datatable/datatable-filter-modal.html',
                        controller: ['$scope', DataTableFilterCtrl],
                        controllerAs: 'vm',
                        size: 'md'
                    },
                    {
                        onOk: function (filter) {
                            applyFilter(dt, filter);
                            dt.draw();
                        }
                    });

                /**
                 *
                 * @param dt DataTable API
                 * @param {object} filter
                 * @param {string} filter.type
                 * @param {string} filter.mode
                 * @param {string} filter.case
                 * @param {string} filter.content
                 */
                function applyFilter(dt, filter) {
                    // filter.type = MULTI_PRECISE;
                    getTableSettings()._customFilter = filter;
                    scope.hasCustomFilter = true;
                }

                function DataTableFilterCtrl($scope) {
                    var that = this;
                    var dtColumns = getTableSettings().aoColumns;
                    var columns = [];
                    dtColumns.forEach(function (col, index) {
                        if (col._title && (!dataset.serverPage || (dataset.serverPage === true && col.searchable))) {
                            columns.push({
                                index: col.idx,
                                title: col._title,
                                searchable: col.searchable
                            });
                        }
                    });
                    this.filter = getTableSettings()._customFilter || { type: PRECISE };
                    this.columns = columns;
                    this.cancel = function cancel() {
                        instance.dismiss('cancel');
                    };
                    this.confirm = function confirm() {
                        instance.close(that.filter);
                    };
                    this.clearCustomFilter = function () {
                        clearCustomFilter();
                        that.cancel();
                    }
                }
            }

            function saveDatatableOptions(options) {
                // element.data('datatableoptions', JSON.stringify(options, function (key, val) {
                //     if (typeof val === 'function') {
                //         return val.toString();
                //     }
                //     return val;
                // }));
            }

            function removeSelectedItem(index) {
                if (scope._selectedItems) {
                    var key = scope._selectedItems.splice(index, 1)[0];
                    theTable.rows('.' + SELECTED_CSS).every(function () {
                        var row = this;
                        var tr = $(row.node());
                        var keyValue = key.key || key;
                        if (tr.data('op_selected_value') === keyValue) {
                            var checkbox = tr.find('.js-mcheck-single');
                            selectRows(checkbox, false);
                        }
                    });
                }
            }

            /**
             * Toggle rows check status.
             * Sync between checkboxes and page parameters.
             * @param {jquery} checkboxes Checkbox elements to select
             * @param {boolean=} forcedValue Use this value if specified, otherwise use checkbox property.
             */
            function selectRows(checkboxes, forcedValue) {
                var useForce = angular.isDefined(forcedValue);
                $timeout(function () {
                    var changes = [];
                    checkboxes.each(function () {
                        var checkbox = $(this),
                            tr = checkbox.closest('tr'),
                            label = checkbox.attr('data-label'),
                            value = datatableUtil.htmlAttrToValue(checkbox.attr('data-value'));
                        var isChecked;
                        if (useForce) {
                            isChecked = forcedValue;
                            checkbox.prop('checked', forcedValue);
                        } else {
                            isChecked = checkbox.prop('checked');
                        }
                        var change = {};
                        change.label = label;
                        change.value = value;
                        change.checked = isChecked;
                        changes.push(change);

                        // changes[key] = isChecked;

                        if (isChecked) {
                            tr.data('op_selected_value', value).addClass(SELECTED_CSS);
                        } else {
                            tr.removeData('op_selected_value').removeClass(SELECTED_CSS);
                        }
                    });
                    mergePageParams(changes, mcheckField.mcheckParam, mcheckField.mcheckType, mcheckField.mcheckCIType);
                });

                /**
                 *
                 * @param changes
                 * @param {string} paramName
                 * @param {string} paramType '': Array, 'csv': Array in CSV, 'json': Array in JSON
                 * @param {string} mcheckCIType {string} mcheckCIType  acm ci type
                 */
                function mergePageParams(changes, paramName, paramType, mcheckCIType) {
                    var newVal, labelVal, changed = {}, itemArray, labelArray, valueArray;
                    var pageParams = pageDataUtil.findPageParams(scope);
                    // var pageParams = widgetDataUtil.getPageScopeValues(scope);
                    labelArray = parseSelectedItems(pageParams[paramName + "_labels"]);
                    valueArray = parseSelectedItems(pageParams[paramName]);
                    itemArray = [];
                    scope._selectedItems = scope._selectedItems || [];
                    _.forEach(changes, function (change) {
                        var checked = change.checked, label = change.label, value = change.value;
                        if (checked) {
                            if (labelArray.indexOf(value) === -1) {
                                labelArray.push(value);
                                //valueArray.push(value);
                                if (mcheckCIType) {
                                    //TODO: rename key to value, rename value to label
                                    //TODO: do not hard code assetType!
                                    itemArray.push({ "key": value, "value": label, "assetType": mcheckCIType });
                                    scope._selectedItems.push({
                                        "key": value,
                                        "value": label,
                                        "assetType": mcheckCIType
                                    });

                                } else {
                                    itemArray.push({ "key": value, "value": label });
                                    scope._selectedItems.push({ "key": value, "value": label });
                                }


                            }
                        } else {
                            _.remove(labelArray, function (o) {
                                return o === value;
                            });
                            _.remove(valueArray, function (o) {
                                if (o.key) return o.key === value;
                                return o === value
                            });
                            _.remove(scope._selectedItems, function (o) {
                                if (o.key) return o.key === value;
                                return o === value
                            });
                        }
                    });
                    if (paramType === 'csv') {
                        var ipArray = _.map(itemArray, "key");
                        var newArray = _.union(valueArray, ipArray);
                        newVal = newArray.length > 0 ? newArray.join(',') : undefined;
                        labelVal = labelArray.length > 0 ? labelArray.join(',') : undefined;
                    } else if (paramType === 'json') {
                        var ipArray2 = _.map(itemArray, "key");
                        var newArray2 = _.union(valueArray, ipArray);
                        newVal = JSON.stringify(JSON.stringify(newArray2));
                        labelVal = JSON.stringify(JSON.stringify(labelArray));
                    } else if (paramType === 'map') {
                        newVal = _.union(valueArray, itemArray);
                        labelVal = labelArray;
                    } else {
                        var ipArray3 = _.map(itemArray, "key");
                        if (ipArray3 && ipArray3.length > 0)
                            valueArray.push(JSON.parse(ipArray3));
                        newVal = valueArray;
                        labelVal = labelArray;
                    }
                    changed[paramName] = newVal;
                    changed[paramName + "_labels"] = labelVal;
                    pageParams[paramName] = newVal;
                    pageParams[paramName + "_labels"] = labelVal;
                    // Do not use itemArray directly since it may share reference with pageParams
                    // scope.selectedItems = [].concat(itemArray);
                    widgetInteraction.changePageParams(scope, { changeUrl: false, params: changed });
                }
            }

            function onDestroy() {
                if (theTable) {
                    theTable.off('click').off('column-resized.dt').off('length.dt').off('*');
                    theTable.destroy(true);
                }
                $('table', element).off('click');
                $('th .js-column-label', element).off('click');
                element.off('*');
                element.removeData('theTable');
            }

            function onPageLengthChange(e, settings, len) {
                props.display.pagelen = len;
                element.attr('uw-props', JSON.stringify(props));
            }

            function onColResize(event, columnIndex, newColumnWidth) {
                // Use `:first` because there are two .dataTable when scrollY enabled
                var table = element.find('.dataTable:first');
                var tableWidth = table.width(), colWidthSum = 0;
                var cols = table.find('thead th');
                props.display.width = tableWidth;
                // NOTE: column index does not equal to field index when some field is hidden
                cols.each(function (i, elem) {
                    var col = $(elem);
                    var field = props.fields[parseInt(col.data('fieldIndex'))];
                    if (i === cols.length - 1) {
                        field.width = 100 - colWidthSum;
                    } else {
                        // var width = _.round(col.outerWidth() / tableWidth * 100, 4);
                        var width = col.outerWidth() / tableWidth * 100;
                        field.width = width;
                        colWidthSum += width;
                    }
                });
                element.attr('uw-props', JSON.stringify(props));
            }

            function initOrders(fields) {
                var orders = [];
                _.filter(fields || [], function (o) {
                    return !o.hidden;
                }).forEach(function (field, i) {
                    if (field.order) {
                        orders.push([i, field.order]);
                    }
                });
                return orders;
            }

            function addCustomFilter() {
                // Only works for client-side processing
                // https://datatables.net/forums/discussion/28621/fn-datatable-ext-search-push-not-call
                // $.fn.dataTableExt.search.push(
                //     function renderFilter(settings, data, dataIndex, row, counter) {
                //         if (dataIndex !== counter || dataIndex < 100) return true;
                //         else return false;
                //     }
                // );

                if ($.fn.dataTable.ext.search.length === 0) {
                    $.fn.dataTable.ext.search.push(
                        function customFilter(settings, data, dataIndex) {
                            var filter = settings._customFilter || {};
                            if (!filter || !filter.column) {
                                return true;
                            }
                            if (!filter.content) {
                                return true;
                            }
                            var caseSensitive = !!filter.case;
                            var columnIndex = filter.column;
                            var toFilter = data[columnIndex];
                            if (!caseSensitive) {
                                toFilter = toFilter.toLowerCase();
                            }
                            var records = filter.content.split('\n');
                            var match = _.find(records, function (s) {
                                if (!caseSensitive) {
                                    s = s.toLowerCase();
                                }
                                if (filter.type === FUZZY) {
                                    return toFilter.indexOf(s) > -1;
                                } else if (filter.type === PRECISE) {
                                    return toFilter === s;
                                }
                            });
                            return !!match;
                        }
                    );
                }
            }

            function getTableSettings() {
                return theTable.settings()[0];
            }

            function clearCustomFilter() {
                getTableSettings()._customFilter = undefined;
                scope.hasCustomFilter = false;
                theTable.draw();
            }

            function initDisplayOptions(display, columns) {
                display = display || {};
                var pagination = display.pagination,
                    tbodyHeight = display.bodyHeight,
                    stripe = display.stripe;
                var headerDom;
                //https://datatables.net/reference/option/dom
                // l: length, f: filter, t: table, i: info, p: pagination, r: processing
                // B: buttons, R: ColReorder, S: Scroller, P: SearchPanes
                if (display.noSearch) {
                    headerDom = "<'op-datatable-header'<'js-dt-custctrls flex-fill'><'js-dt-selected'>>";
                } else {
                    // headerDom = "<'op-datatable-header'<'js-dt-custctrls inline'><'pull-right' fB><'js-dt-selected'>>";
                    headerDom = "<'op-datatable-header'<'js-dt-custctrls flex-fill'><'js-dt-filter-zone d-flex align-items-center' fB><'js-dt-selected'>>";
                }
                var footerDom = "<'js-dt-footer op-datatable-footer'<li><p>>";
                if (pagination === 'none') {
                    footerDom = "<'js-dt-footer op-datatable-footer'>";
                } else if (devel.needMobileView()) {
                    footerDom = "<'js-dt-footer op-datatable-footer'<l><p>>";
                }
                var options = {
                    ajax: ajaxFn,
                    // rowId:'for-responsive',
                    //20180816: use deferRender to improve performance
                    // https://datatables.net/forums/discussion/46654/why-the-deferrender-default-value-is-set-as-false
                    // The key downside is that if you expect all nodes to be available in the API (e.g. rows().nodes()) they won't be if deferRender is enabled.
                    deferRender: true,
                    processing: true,
                    columns: columns,
                    dom: headerDom + "<'js-dt-table flex-fill'tr>" + footerDom,
                    searchHighlight: true,
                    serverSide: dataset['serverPage'] === true /*&& pivot._enabled === false*/,
                    lengthMenu: [5, 10, 20, 50, 100, 200, 500, 1000, 2000],
                    pageLength: display.pagelen || 10,
                    order: [],
                    createdRow: createdRowCallback,
                    // footerCallback: footerCallback,
                    drawCallback: drawCallback,
                    initComplete: initComplete
                };
                if (display.footer) {
                    options.footerCallback = footerCallback
                }
                if (dataset.serverPage) {
                    options.searchDelay = 10000000;
                    options.processing = true;
                    // options.searching = false;
                }
                options.buttons = [];
                if (devel.needMobileView() || (FORCE_RESPONSIVE_COLUMNS > 0 && columns.length > FORCE_RESPONSIVE_COLUMNS)) {
                    options.responsive = {
                        details: {
                            type: useColumnResponsive ? 'column' : 'inline'
                        }
                    };
                } else {
                    options.responsive = false;
                }
                // if (display.buttons && display.buttons.indexOf("excel") > -1) {
                if (display.showexport) {
                    var title = props.title || '*';
                    var excel = {
                        // extend: 'excel',
                        extend: 'excelHtml5',
                        text: '<i class="far fa-file-download"></i>',
                        autoFilter: true,
                        filename: title,
                        title: null,
                        // messageBottom: location.href,
                        customize: datatableUtil.customizeExcelExport,
                        exportOptions: {
                            orthogonal: 'export'
                        }
                    };
                    if (!dataset.serverPage)
                        options.buttons.push(excel);
                }
                if (display.noSearch) {
                    options.searching = false;
                }
                if (display.noPageSize) {
                    options.lengthChange = false;
                }
                if (pagination === 'none') {
                    options.paging = false;
                } else {
                    if (devel.needMobileView()) {
                        options.pagingType = 'listbox';
                    } else {
                        // options.pagingType = (pagination === 'default' || pagination === '') ? 'simple_numbers' : pagination;
                        options.pagingType = (pagination === 'default' || !pagination) ? 'input' : pagination;
                    }
                }
                if (stripe) {
                    options.stripeClasses = stripe.split(',');
                }
                if (tbodyHeight && enableAdjustHeight) {
                    options.scrollY = tbodyHeight + 'px';
                    options.scrollCollapse = true;
                }
                if (widgetUiHelper.isEditMode() && !display.autoWidth) {
                    // TODO: when .colResize is defined, scrollX will be disabled
                    options.colResize = {
                        minColumnWidth: 10,
                        resizeTable: true
                    };
                    options.autoWidth = false;
                    options.scrollX = false;
                } else {
                    options.autoWidth = display.autoWidth === true;
                    options.colResize = false;
                    if (!devel.needMobileView()) {
                        options.scrollX = true;
                    }
                }
                addEventOnTableUIReady();
                return options;

                function addEventOnTableUIReady() {
                    $('table', element).on('preInit.dt', function () {
                        arrangeTableUiElements();
                    });
                }

                function arrangeTableUiElements(settings) {
                    // Arrange selection chips
                    // if (selectedUseDropdown) {
                    element.find('.js-dt-selmark').prependTo(element.find('.js-dt-filter-zone'));
                    // https://stackoverflow.com/questions/44646567/keep-bootstrap-dropdown-open-when-clicked-inside
                    element.on('click', '.js-dt-selmark .dropdown-menu', function (e) {
                        e.stopPropagation();
                    });
                    // } else {
                    //     element.find('.js-dt-selmark').appendTo(element.find('.js-dt-selected'));
                    // }
                    // Arrange params controls
                    element.find('.uw-params').appendTo(element.find('.js-dt-custctrls'));
                    // Append dropdown list to custom filter
                    var $dtFilter = element.find('.dataTables_filter');
                    var btnFilter = '', btnRefresh = '', btnServerExport = '', btnColumnFilter = '';
                    if (dataset.serverPage) {
                        var colTitles = _.map(_.filter(columns, { searchable: true }), function (o) {
                            return o._title;
                        });
                        var searchHtml = '<input type="search" class="js-cust-global-search form-control __form-control-sm" title="' + $translate.instant('udp.w.datatable.search_desc', { fields: colTitles.join(', ') }) + '">';

                        $dtFilter.find('input').replaceWith(searchHtml);
                        // element.find('.js-dt-filter-zone').attr('disabled', 'disabled');
                    }

                    if (display.exfilter) {
                        btnFilter = '<button class="btn opx-btn-icon" ng-class="hasCustomFilter?\'btn-primary\':\'btn-default opx-btn-flat\'" ng-click="openCustomFilter()" title="{{\'udp.w.datatable.exfilter.title\'|translate}}"><i class="far fa-file-search"></i></button>';
                    }
                    if (display.showrefresh) {
                        btnRefresh = '<button class="btn btn-default opx-btn-icon opx-btn-flat" ng-click="refreshTable()" title="{{\'udp.w.datatable.action.refresh\'|translate}}"><i class="far fa-sync"></i></button>';
                    }
                    if (dataset.serverPage && display.showexport) {
                        btnServerExport = '<button type="button" class="btn btn-default opx-btn-icon opx-btn-flat" ng-click="serverExport()" title="{{\'udp.w.datatable.action.export\'|translate}}"><i class="far fa-file-export"></i></button>';
                    }
                    if (display.exfilter) {
                        // 字段设定中，若不存在可搜索字段则不显示字段搜索按钮
                        // btnColumnFilter = '<button type="button" ng-show="isColumnFilterButtonOpen" class="btn btn-default opx-btn-icon opx-btn-flat text-muted js-col-filter ms-0" title="{{udp.w.datatable.action.search_by_column|translate}}" ng-click="toggleColumnFilter()"><i ng-class="isColumnFilterOpen?\'text-primary fa fa-filter\':\'far fa-filter\'" style="font-size:12px;"></i></button>';
                        btnColumnFilter = '<button type="button" class="btn btn-default opx-btn-icon opx-btn-flat text-muted js-col-filter ms-0" title="{{udp.w.datatable.action.search_by_column|translate}}" ng-click="toggleColumnFilter()"><i ng-class="isColumnFilterOpen?\'text-primary fa fa-filter\':\'far fa-filter\'" style="font-size:12px;"></i></button>';
                    }

                    var $btnToolbar = $('<div class="__btn-group">' +
                        // '<div class="btn-group op-btn-group-join">' + btnFilter + dropdown + '</div>' +
                        btnColumnFilter +
                        btnServerExport +
                        btnFilter +
                        '<div class="btn-group js-buttons">' + btnRefresh + '</div>' +
                        '</div>');
                    var inputLabel = $dtFilter.find('>label');
                    inputLabel.after($btnToolbar);
                    $compile($btnToolbar)(scope);
                    // Move built-in dt-buttons to btn-toolbar
                    var $dtButtons = element.find('.dt-buttons');
                    $btnToolbar.find('.js-buttons').append($dtButtons.children());
                    inputLabel.append(
                        $btnToolbar.find('.js-col-filter').css('position', 'absolute').css('right', '0').css('top', '0px'));
                    $dtButtons.remove();
                }
            }

            /**
             * Parse value of selected items to array.
             * @param preSelected
             * @return {[]}
             */
            function parseSelectedItems(preSelected) {

                var mcheckType = mcheckField.mcheckType;
                var selectedItems = [];
                if (angular.isString(preSelected)) {
                    // NOTE: When the string is empty, split returns an array
                    // containing one empty string, rather than an empty array.
                    if (preSelected !== '') {
                        if (mcheckType === 'json') {
                            selectedItems = JSON.parse(preSelected);
                        } else {
                            selectedItems = preSelected.split(',');
                        }
                    }
                } else if (angular.isArray(preSelected)) {
                    selectedItems = [].concat(preSelected);
                } else if (!preSelected) {
                    selectedItems = [];
                } else if (angular.isDefined(preSelected)) {
                    console.warn('Cannot recognize preselected values `' + JSON.stringify(preSelected) + '`');
                }
                return selectedItems;
            }

            /**
             * Config datatables column settings.
             * @param {[{hidden:boolean,defaultContent:string,field:string,label:string}]} fields
             * @param {number} fields.width
             * @param {string=} fields.formatter
             * @param {number=} fields.scale
             * @param {string=} fields.wrap
             * @param {string=} fields.align
             * @param {string=} fields.css
             * @param {number=} fields.cutoff
             * @param {boolean} isAutoWidth
             * @returns {Array} Datatables `columns`
             * @see https://datatables.net/reference/option/columns
             */
            function configColumns(fields, isAutoWidth) {
                var columns = [];
                // var pageParams = widgetUiHelper.findPageScope(scope).pageParams;
                if (useColumnResponsive) {
                    columns.push({
                        className: 'control',
                        orderable: false,
                        searchable: false,
                        targets: 0
                    });
                }

                fields.forEach(function (f, i) {
                    // Add a unique name if this field has convertFn
                    if (!f['hidden']) {
                        // var dataProperty = f['field'] || (VFIELD + i);
                        var dataProperty = f.convertFn ? (VFIELD + i) : f.field;
                        if (!dataProperty) {
                            throw new Error('[ConfigError] Must config either `convertFn` or `field` for field: `' + JSON.stringify(f) + '`');
                        }
                        var column = {};
                        //https://datatables.net/reference/option/columns.data
                        // In datatables, dot is notation for nested property
                        column.data = dataProperty.replace(/\./gi, '\\.');
                        column.name = f.field;
                        if (dataset.serverPage) {
                            // On server side mode, need set orderable and searchable explicitly
                            column.orderable = !!f.orderable && !!f.field;
                            column.searchable = !!f.searchable && !!f.field;
                        }
                        column.searchable = !!f.searchable && !!f.field;
                        if (f.mcheck) {
                            column.searchable = column.orderable = false;
                            column.className = 'text-right';
                            column.searchable = false;
                            column.orderDataType = 'dom-checkbox';
                            // 20181213: setting column width in absolute 24px will make it unexpected wide
                            // in some responsive cases because other columns are auto calculated in %
                            // So we set this mcheck column to a minimum width and let table to stretch
                            // the cell.
                            // column.width = '24px';
                            column.width = '0.001%';
                            column.render = function mcheckColumnRender(data, type, row, meta) {
                                var pageParams;
                                var state;
                                // pageParams = widgetUiHelper.findPageScope(scope).pageParams;
                                pageParams = pageDataUtil.findPageParams(scope);
                                var dataLabel, dataValue;
                                if (angular.isObject(data)) {
                                    if (data.hasOwnProperty('label') && data.hasOwnProperty('value')) {
                                        dataLabel = data.label;
                                        dataValue = data.value;
                                    } else if (f.mcheckUnionFiled) {
                                        dataLabel = row[f.mcheckUnionFiled];
                                        dataValue = data;
                                    } else {
                                        //TODO: why add - ??
                                        var convertData = Object.values(data).join("-");
                                        dataLabel = convertData;
                                        dataValue = convertData;
                                    }
                                    state = data['$state'];
                                } else if (angular.isString(data)) {
                                    if (f.mcheckUnionFiled) {
                                        dataLabel = row[f.mcheckUnionFiled];
                                        dataValue = data;
                                    } else {
                                        dataLabel = data;
                                        dataValue = data;
                                    }
                                } else {
                                    dataLabel = data;
                                    dataValue = data;
                                }
                                var selectedItems = parseSelectedItems(pageParams[mcheckField.mcheckParam]);
                                var isChecked = false;
                                if (f.mcheckUnionFiled) {
                                    var itemArray = _.map(selectedItems, "key");
                                    var newItemArray = _.compact(itemArray);
                                    if (newItemArray.length > 0) {
                                        isChecked = newItemArray.indexOf(dataValue) >= 0;
                                    } else {
                                        isChecked = selectedItems.indexOf(dataValue) >= 0;
                                    }
                                } else {
                                    isChecked = selectedItems.indexOf(dataValue) >= 0;
                                }
                                if (isChecked) {
                                    scope._selectedItems = scope._selectedItems || [];
                                    var checkedArray = _.compact(_.map(scope._selectedItems, "key"));
                                    if (checkedArray.length > 0) {
                                        if (checkedArray.indexOf(dataValue) === -1) {
                                            scope._selectedItems.push({ "key": dataValue, "value": dataLabel });
                                            pageParams[mcheckField.mcheckParam + "_labels"] = _.map(scope._selectedItems, "key");
                                        }
                                    } else {
                                        if (scope._selectedItems.indexOf(dataValue) === -1) {
                                            // scope._selectedItems.push(dataValue);
                                            // pageParams[mcheckField.mcheckParam + "_labels"] = scope._selectedItems;
                                            scope._selectedItems.push({ "key": dataValue, "value": dataLabel });
                                            pageParams[mcheckField.mcheckParam + "_labels"] = _.map(scope._selectedItems, "key");
                                        }
                                    }
                                    var tr = $(theTable.row(meta.row).node());
                                    // tr.data('op_selected_value', dataLabel).addClass(SELECTED_CSS);
                                    tr.data('op_selected_value', dataValue).addClass(SELECTED_CSS);
                                }
                                if (state === 'hidden') {
                                    return '';
                                }
                                return datatableUtil.buildSingleCheckbox(row, function () {
                                    return dataValue;
                                }, function () {
                                    return dataLabel;
                                }, function () {
                                    return state;
                                }, { isLegacy: true, checked: isChecked }
                                );

                                // return '<div class="checkbox checkbox-inline" title="' + dataLabel + '">' +
                                //     '<input type="checkbox" ' + (isChecked ? 'checked' : '') +
                                //     ' class="js-mcheck-single"' +
                                //     (state === 'disabled' ? ' disabled ' : '') +
                                //     ' data-label="' + dataLabel + '"' +
                                //     ' data-value="' + dataValue + '">' +
                                //     '<label></label></div>';
                            }
                        } else {
                            // Set column.title only for not mcheck
                            //20200912: column.title will override custom column header. Use a _title for later retrieve title.
                            // column.title = f.label || /*f.alias || */f.field || '';
                            column._title = f.label || /*f.alias || */f.field || '';
                            column.defaultContent = f['defaultContent'] || '';
                            if (f.cutoff && f.cutoff > 0) {
                                column.render = $.fn.dataTable.render.ellipsis(f.cutoff);
                            } else if (f.width && !isAutoWidth) {
                                column.width = f.width + '%';
                            }
                            if (convertOnTheFly) {
                                // TODO: not work, render will be called for all data
                                column.render = function (data, type, row, meta) {
                                    var s = '$$$' + meta.col;
                                    if (angular.isDefined(row[s])) {
                                        return row[s];
                                    } else {
                                        var converted;
                                        converted = widgetDataUtil.convertFields([row], [{
                                            source: f.field,
                                            convertFn: f.convertFn
                                        }], null, { includeAllFields: false })[0];
                                        converted = _.values(converted)[0];
                                        if (f.formatter || f.scale) {
                                            converted = formatData(f, converted);
                                        }
                                        row[s] = converted;
                                        return converted;
                                    }
                                };
                            } else {
                                if (f.isrestricted && udpModuleConfig.restrictedMode) {
                                    column.render = function (data, type, row) {
                                        var s = data + '';
                                        return '<span class="udp-isrestricted">' + s.substr(0, 1) + _.pad('', s.length - 1, '*') + '</span>';
                                    }
                                } else if (f.formatter || f.scale) {
                                    column.render = function (data, type, row) {
                                        return formatData(f, data);
                                    };
                                } else if (f.linelimit > 0) {
                                    if (f.wrap !== 'nowrap') {
                                        column.render = function (data, type, row) {
                                            if (type === 'display')
                                                return '<div class="udp-linelimit">' + wrapText(data, type) + '</div>';
                                            return wrapText(data, type);
                                        }
                                    } else {
                                        column.render = function (data, type, row) {
                                            return '<div class="udp-linelimit">' + data + '</div>';
                                        }
                                    }
                                } else if (f.wrap !== 'nowrap') {
                                    column.render = function (data, type, row) {
                                        return wrapText(data, type);
                                    }
                                }
                            }
                            if (!column.className) {
                                column.className = f.wrap ? f.wrap : '';
                            }
                            if (f.align) {
                                column.className += (column.className && ' ') + 'text-' + f.align;
                            }
                            if (f.css) {
                                column.className += (column.className && ' ') + f.css;
                            }
                            column.createdCell = createdCellCallback;
                        }
                        // column.visible = f['hidden'] !== true;
                        columns.push(column);
                    }
                });
                return columns;

                function wrapText(data, type) {
                    return datatableUtil.wrapText(data, type);
                    // if (type !== 'display' && type !== 'export')
                    //     return data;
                    // if (!angular.isString(data)) {
                    //     return data;
                    // }
                    // return data.replace(/\n/g, type === 'display' ? '<br>' : '\r');
                }

                function createdCellCallback(tdNode, cellData, rowData, rowIndex, colIndex) {
                    var rules = angular.copy(display.cellrules);
                    if (!rules || rules.length === 0) return;
                    rules.forEach(function (r) {
                        r.expr = r.expr.replace(/\$COL_NAME/g, '"' + columns[colIndex]._title + '"')
                            .replace(/\$COL_INDEX/g, colIndex)
                            .replace(/\$VALUE/g, JSON.stringify(cellData));
                        // console.log(r.expr);
                    });
                    conditionalFormat.evaluateRules(rules, rowData, {}, function (itemIndex, rule) {
                        $(tdNode).addClass(rule.css).attr('style', rule.style);
                    });
                }
            }

            /**
             *
             * @param f
             * @param {string} f.type
             * @param {string} f.formatter
             * @param {number} f.scale
             * @param data
             * @returns {*}
             */
            function formatData(f, data) {
                if (f.type === 'date') {
                    return moment(data).format(f.formatter);
                } else {
                    // Use excel custom format
                    // https://exceljet.net/custom-number-formats
                    // https://www.ablebits.com/office-addins-blog/2016/07/07/custom-excel-number-format/
                    // https://searchengineland.com/easy-to-advanced-uses-of-cell-formatting-in-excel-130203
                    var parts = f.formatter.split(';');
                    var num = numeral(data / (f.scale || 1));
                    var part = parts[0];
                    var numValue = num.value();
                    if (numValue > 0 && part) {
                        return formatColor(num, part);
                    }
                    part = parts[1];
                    if (numValue < 0 && parts[1]) {
                        return formatColor(num, part);
                    }
                    return num.format(f.formatter);
                }

                function formatColor(num, part) {
                    var format = part, color;
                    var match = part.match(/(\[(.*)\])(.*)/);
                    if (match) {
                        color = match[2];
                        format = match[3];
                    }
                    var formattedNum = num.format(format);
                    if (color)
                        return '<span style="color:' + color + '">' + formattedNum + '</span>';
                    else
                        return formattedNum;
                }
            }

            function initColumns(props) {
                var d = $q.defer();
                var display = props.display || {}, columns;
                allFields = props['fields'];
                var dynamicField = getDynamicField(props);
                if (dynamicField) {
                    // var ddRes = dataEx.evalVarExpr(dynamicField.dynamicDef, pageDataUtil.getPageScopeValues(scope));
                    var ddRes = dataEx.evalVarExpr(dynamicField.dynamicDef, pageDataUtil.getPageScopeValues(scope), { errorForUnresolvedVar: true });
                    if (!ddRes) {
                        throw new Error($translate.instant('udp.w.datatable.error.dynamicdef_eval_failed', { def: dynamicField.dynamicDef }));
                    } else if (ddRes instanceof UnresolvedVarError) {
                        throw new Error($translate.instant('udp.w.datatable.error.dynamicdef_unresolved_var', { message: ddRes.message }));
                    } else if (angular.isFunction(ddRes.then)) {
                        // This is promise
                        ddRes.then(function (result) {
                            calcDynamicFields(result, d);
                        });
                    } else {
                        calcDynamicFields(ddRes, d);
                    }
                } else {
                    columns = configColumns(allFields, display.autoWidth);
                    d.resolve(columns);
                }

                return d.promise;

                /**
                 * Calculate dynamic fields. It will merge definition from dynamic def and query data result.
                 * @param {[]} dfieldDefs
                 * @param {string} dfieldDefs[].field
                 * @param {string} dfieldDefs[].label
                 * @param {string} dfieldDefs[]converter
                 * @param {string} dfieldDefs[].css
                 * @param {boolean} dfieldDefs[].show
                 * @param {boolean} dfieldDefs[].hide
                 * @param defer
                 */
                function calcDynamicFields(dfieldDefs, defer) {
                    queryData({ length: 10, start: 0 }, []).then(function (data) {
                        dynamicInitData = data;
                        var records = data.data;
                        var sampleRecord;
                        if (records.length === 0) {
                            // defer.reject(new Error('数据集没有数据'));
                            sampleRecord = {};
                        } else {
                            sampleRecord = records[0];
                        }
                        allFields = mergeDynamicFields(props.fields, sampleRecord, dfieldDefs);
                        if (records.length > 10) dynamicInitData.data = transformData(dynamicInitData.data, allFields);
                        columns = configColumns(allFields, true);
                        var html = createTableHtml(allFields, display, true, isServerSide(props), true);
                        element.find('table.js_udp_table').replaceWith(html);
                        defer.resolve(columns);

                    }).catch(function (err) {
                        defer.reject(err);
                    });


                    /**
                     * Merge dynamic fields with defined fields.
                     * @param {[{dynamic:boolean, field:string, label:string, dynamicDef:string}]} fields Fields defined in `props.fields`
                     * @param {object} record A record to fetch dynamic fields
                     * @param {[{field:string,label:string,converter:string,css:string,hide:boolean,show:boolean}]} dfieldDefs Definitions of dynamic field
                     * @returns {Array} Merged field definitions
                     */
                    function mergeDynamicFields(fields, record, dfieldDefs) {
                        var result = [];
                        // Iterate fields from static props
                        fields.forEach(function (f) {
                            if (!f.dynamic) {
                                result.push(f);
                                return;
                            }
                            // Iterate fields from dynamic data
                            var dfields = [], otherfields = [];
                            var wildcard = _.find(dfieldDefs, { field: '*' }) || {};
                            var recordProps = Object.keys(record);
                            dfieldDefs.forEach(function (df) {
                                if (df.field === '*') {
                                    return;
                                }
                                var copy = angular.copy(df);
                                copy.convertFn = df.converter;
                                dfields.push(copy);
                            });
                            if (!wildcard.hide) {
                                recordProps.forEach(function (recField) {
                                    if (recField.indexOf(VFIELD) !== 0) {
                                        var item = _.find(dfields, { field: recField });
                                        if (!item) {
                                            otherfields.push({ field: recField });
                                        }
                                    }
                                });
                            }
                            // recordProps.forEach(function (recField) {
                            //     var def = _.find(dfieldDefs, {field: recField});
                            //     // if (recField==='path')
                            //     // console.log('path',dfieldDefs,JSON.stringify(def),def);
                            //     if (def) {
                            //         if (!def.hide && def.show !== false) {
                            //             dfields.push({
                            //                 field: recField,
                            //                 label: def.label || recField,
                            //                 css: def.css,
                            //                 seq: def.seq,
                            //                 convertFn: def.data,
                            //                 orderable: def.orderable !== false,
                            //                 searchable: def.searchable !== false
                            //             });
                            //         }
                            //     } else {
                            //         // Cannot find definition for the dynamic field
                            //         if (wildcard.hide === true) {
                            //         } else if (recField.indexOf(VFIELD) !== 0) {
                            //             dfields.push({
                            //                 field: recField,
                            //                 label: recField,
                            //                 orderable: true,
                            //                 searchable: true
                            //             });
                            //         }
                            //     }
                            // });
                            dfields = dfields.sort(function (a, b) {
                                if (!angular.isNumber(a.seq) && !angular.isNumber(b.seq)) {
                                    return 0;
                                }
                                if (angular.isNumber(a.seq) && !angular.isNumber(b.seq)) {
                                    return -1;
                                }
                                if (!angular.isNumber(a.seq) && angular.isNumber(b.seq)) {
                                    return 1;
                                }
                                if (angular.isNumber(a.seq) && angular.isNumber(b.seq)) {
                                    return a.seq - b.seq;
                                }
                                return 0;
                            });
                            result = result.concat(dfields).concat(otherfields);
                            // dfields.forEach(function (f) {
                            //     result.push(f);
                            // });
                        });
                        // console.log(JSON.stringify(result));
                        return result;
                    }
                }
            }

            function drawCallback() {
            }

            function initComplete(settings, json) {
                var columnDefs = settings.aoColumns;
                // Footer has padding. Remove it if it's empty
                var footer = element.find('.js-dt-footer');
                if (footer.length > 0 && footer.html().length === 0) {
                    footer.remove();
                }
                addColumnSearch();
                restrictSortOnIcon();

                /**
                 * Add column search.
                 * NOTE: this method shall be called after init completed
                 * https://datatables.net/examples/api/multi_filter.html
                 */
                function addColumnSearch() {
                    var newTr = $('<tr></tr>').addClass('js-cust-column-search-wrapper hidden');
                    var SHOW_DISABLED_SEARCH = true;
                    //20210421: Some widget param control like host uinput may contains udp generated datatable
                    var headers = $('.uw-body > .uw-content > .dataTables_wrapper > .js-dt-table .dataTables_scrollHeadInner thead tr th', element);
                    headers.each(function (i, elem) {
                        var orgTd = $(this);
                        // var colSearchEnabled = !orgTd.hasClassMatch(/sorting_disabled/);
                        var colSearchEnabled = columnDefs[i].bSearchable !== false;//!orgTd.hasClassMatch(/sorting_disabled/);
                        var newTd;
                        newTd = $('<td></td>').appendTo(newTr);
                        if (colSearchEnabled || SHOW_DISABLED_SEARCH)
                            newTd.html('<input type="search" class="js-cust-column-search form-control __form-control-sm" title="' + (colSearchEnabled ? $translate.instant('udp.w.datatable.action.search_placeholder') : '') + '" ' + (colSearchEnabled ? '' : 'disabled') + ' />')
                        if (colSearchEnabled) {
                            $('input', newTd).on('keyup change', function (e) {
                                var input = $(this);
                                var type = e.type;
                                var value = this.value;
                                if ((type === 'change' && !value) || (e.keyCode === 13 && theTable.column(i).search() !== value)) {
                                    theTable.column(i)
                                        .search(value)
                                        .draw();
                                    var col = $('.dataTables_scrollHeadInner thead tr th', element).eq(i);
                                    if (value) {
                                        col.addClass('udp-col-filtered');
                                        input.addClass('udp-input-filtered');
                                    } else {
                                        col.removeClass('udp-col-filtered');
                                        input.removeClass('udp-input-filtered');
                                    }
                                }
                            });
                        }
                    });
                    $('.dataTables_scrollHeadInner thead', element).append(newTr);
                }

                function restrictSortOnIcon() {
                    // https://stackoverflow.com/questions/27318162/datatables-1-10-sort-only-by-cliking-sort-icons-in-th
                    // NOTE: seems element.on NOT work.
                    // element.on('click', 'th .js-column-label', function (event) {
                    // $('th .js-column-label, th .js-cust-column-search', element).on('click', function (event) {
                    // Stop event when clicking element inside th (not th self)
                    $('th *', element).on('click', function (event) {
                        var elem = $(event.target);
                        // If not checkbox (input)
                        if (!elem.is('input')) {
                            event.stopImmediatePropagation();
                            event.stopPropagation();
                            // event.preventDefault();
                            // return false;
                        }
                    });
                    $('th .js-column-action', element).on('click', function (event) {
                        $('tr.js-cust-column-search-wrapper', element).toggleClass('hidden');
                        event.stopImmediatePropagation();
                    });
                }
            }

            function footerCallback(tfoot, data, start, end, display) {
                var api = this.api();
                $('th', tfoot).each(function (index, elem) {
                    var $th = $(this);
                    var accum = $th.data('accum');
                    if (accum) {
                        var value;
                        var colDataArr = api.column(index).data();
                        if (accum === 'SUM') {
                            value = colDataArr.reduce(function (a, b) {
                                return parseInt(a) + parseInt(b);
                            }, 0);
                        } else if (accum === 'COUNT') {
                            value = colDataArr.length;
                        } else if (accum === 'MAX') {
                            value = _.max(colDataArr);
                        } else if (accum === 'MIN') {
                            value = _.min(colDataArr);
                        } else if (accum === 'AVERAGE') {
                            value = colDataArr.reduce(function (a, b) {
                                return a + b;
                            }, 0) / colDataArr.length;
                        }
                        var format = $th.data('format');
                        if (format && (format.formatter || format.scale)) {
                            value = formatData(format, value);
                        }
                        $th.html(value);
                    }
                });
            }

            /**
             * This function is called when a TR element is created (and all TD child
             * elements have been inserted), or registered if using a DOM source, allowing
             * manipulation of the TR element (adding classes etc).
             *
             * DESIGN NOTE:
             * -------------
             * LEO@20171106
             * We use `$compile` in `createdRow`.
             * The scope must be manually destroyed, otherwise it will prevent rows from GC.
             * This will cause increasing Detached DOM trees and scope retained, eventually memory leak.
             * To solve this, we need also modify jquery.dataTables.js (1.10.15) line 3514 from
             * `body.children().detach();` to `body.children().remove();`
             * https://datatables.net/forums/discussion/37911/detach-versus-remove-on-draw-fndraw
             * https://stackoverflow.com/questions/46926591/big-memory-leak-if-in-angularjs-we-use-compile-in-createdrow-in-jquery-datata
             * LEO@20171117:
             * Sadly we found that using `remove()` instead of `detach()` invalid the compiled elements after filter table.
             * Now we have to manually handle the `udp-page-link` by listening to `click` event.
             *
             * @param {HTMLElement} row "TR" element for the current row
             * @param {array} data Raw data array for this row
             * @param {number} dataIndex The index of this row in the internal aoData array
             *
             */
            function createdRowCallback(row, data, dataIndex) {
                var USE_COMPILE = false;
                var $row = $(row);
                var begin = Date.now();
                if (USE_COMPILE) {
                    $compile($row.contents())(previousScope);
                    $row = null;
                    _timer.$compile = (_timer.$compile || 0) + (Date.now() - begin);
                } else {
                    if (rules && rules.length > 0) {
                        conditionalFormat.evaluateRules(rules, data, {/*$row$: dataIndex + 1*/ },
                            function (itemIndex, rule) {
                                if (rule.theme === '_CUSTOM') {
                                    $row.css('background-color', rule.backColor)
                                        .css('color', rule.fontColor);
                                } else {
                                    $row.addClass(rule.theme);
                                }

                            });
                    }
                    _timer.evaluateRules = (_timer.evaluateRules || 0) + (Date.now() - begin);
                    if (!isEditMode) {
                        // State control should be placed before access control
                        $row.find('[data-statecontrol],[udp-state-control]').each(function () {
                            var btn = $(this);
                            widgetUiHelper.changeElementState(btn, null, scope, data);
                        });
                        $row.find('[data-accesscontrol]').each(function () {
                            var btn = $(this);
                            widgetSecurity.changeAccessState(btn, btn.data('accesscontrol'));
                        });
                    }
                }
            }

            function addEventForOpenPage() {
                var tbody = $('table tbody', element);
                // Use click event to handle udp-page-link
                tbody.on('click', '[udp-page-link],[udp-widget-interaction]', clickWidgetInteraction);

                function clickWidgetInteraction(e) {
                    e.stopPropagation();
                    var elem = $(this);
                    if (elem.is(':disabled')) {
                    }
                    var attr = elem.attr('udp-widget-interaction');
                    if (attr) {
                        var config;
                        var values;
                        // If this table is responsive, use previous tr ('.parent') to get row data
                        var tr = elem.closest('tr');
                        if (tr.hasClass('child')) {
                            tr = tr.prev();
                        }
                        var pageScopeValues = widgetDataUtil.getPageScopeValues(scope);
                        values = _.merge({}, theTable.row(tr).data(), pageScopeValues);
                        //LEO@20210417: Replace return line with \\n for multiline value
                        attr = attr.replace(/\n/g, '\\\\n');
                        attr = upgradeOldQuotedVars(attr);
                        try {
                            config = dataEx.evalVarJson(attr, values, { toEvalObject: true });
                            if (angular.isString(config)) {
                                config = JSON.parse(config);
                            }
                            // console.log('evaluateInteractionConfig config=%s, values=%s', JSON.stringify(config), JSON.stringify(values));
                        } catch (err) {
                            console.error('Error to parse attribute `udp-widget-interaction` ' + attr, err.message);
                            return;
                        }
                        // widgetInteraction.handleInteraction(scope, config, widgetDataUtil.getPageScopeValues(scope), {element: e.currentTarget});
                        widgetInteraction.handleInteraction(scope, config, values, { element: e.currentTarget });
                        return;
                    }
                    // For compatible with old setting
                    attr = elem.attr('udp-page-link');
                    if (attr) {
                        widgetInteraction.openPage(JSON.parse(attr), {}, { current: e.currentTarget });
                    }

                    function upgradeOldQuotedVars(expr) {
                        // In versions before 0.6.3, button interaction in datatable supports JS vars in pageId,
                        // but is generated on initialization (not on the click).
                        // In that case, we wrap variables with quotes like `function(){if ("${var}"==="ABC") return "1234";}`
                        // Old version params does not support var JS.
                        // To find quote wrapped ${var} but not followed with : (which is a param value)
                        var result = expr.replace(/([^:])(\\")(\${.*?})(\\")/g, '$1$3');
                        // if (expr !== result)
                        //     console.log('upgradeOldQuotedVars\n OLD--->\n', expr, 'NEW===>\n', result);
                        return result;
                    }
                }
            }

            function addEventForMcheck() {
                var table = $('table', element);
                table.on('click', '.js-mcheck-all', function (e) {
                    var checked = $(this).prop('checked');
                    selectRows(table.find('td .js-mcheck-single').not("[disabled]"), checked);
                    e.stopPropagation();
                });
                table.on('click', '.js-mcheck-single', function (e) {
                    var checkbox = $(this);
                    selectRows(checkbox);
                    e.stopPropagation();
                });
            }

            function addEventForClickRow() {
                var config = props.interaction || {};
                if (config.click) {
                    var tbody = $('table tbody', element);
                    tbody.on('click', 'tr', function (e) {
                        var tr = $(this);
                        if (tr.hasClass('active')) {
                            tr.removeClass('active');
                        } else {
                            theTable.$('tr.active').removeClass('active');
                            tr.addClass('active');
                        }
                        var data = theTable.row(tr).data();//fnGetData(this);//tr.data();
                        if (config.click === 'param') {
                            widgetInteraction.changePageParams(scope, config, data);
                        } else if (config.click === 'page') {
                            widgetInteraction.openPage(config, data, { current: e.currentTarget });
                        }
                        e.stopPropagation();
                    });
                }
            }


            /**
             *
             * https://datatables.net/reference/option/ajax
             * https://datatables.net/manual/server-side
             * @param {{draw:number,columns:[],order:[],search:{value:string,regex:boolean},start:number,length:number}} dataToServer Data to send to the server when serverSide is on
             * @param {function} callback Callback function that must be executed when the required data has been obtained. That data should be passed into the callback as the only parameter
             * @param {DataTables.Settings} settings DataTables settings object
             */
            function ajaxFn(dataToServer, callback, settings) {
                //20210812: Do not use init data because it only has 10 records
                //20220527: Dataset used Rest Api will send 2 same request without paged (like acm-linux),
                //          SOLUTION: if the dynamic data length gt 10 (init dynamic data size), return the data
                if (dynamicInitData && dynamicInitData.data.length > 10) {
                    callback(dynamicInitData);
                    // Init data used only once, it shall be cleared
                    dynamicInitData = undefined;
                } else {
                    queryData(dataToServer, allFields).then(function (data) {
                        processData(data);
                    }).catch(function (err) {
                        // 当数据加载失败时，需要调用 callback 传入空数据来关闭 processing 指示器
                        callback({
                            draw: dataToServer.draw,
                            data: [],
                            recordsTotal: 0,
                            recordsFiltered: 0
                        });
                        console.error('DataTable ajax error:', err);
                    });

                }

                function processData(data) {
                    if (previousScope) {
                        previousScope.$destroy();
                        previousScope = null;
                    }
                    previousScope = scope.$new(false);
                    var _begin = Date.now();
                    callback(data);
                    _timer.callback = Date.now() - _begin;
                    console.debug('ajaxFn', data.data.length, 'records', 'timer(ms)', _timer);
                    debugTimer.print().reset();
                }
            }

            /**
             * Query data for Datatable
             * @param {{length:number=, start:number=}} dataToServer
             * @param {[]} fields Fields to transform data
             * @returns {promise<{data:[],draw:*,recordsFiltered:number,recordsTotal:number}>} Datatable format
             */
            function queryData(dataToServer, fields) {
                var d = $q.defer();
                var params = widgetDataUtil.getWidgetParamValues(element);

                // 2020/03/01: If dataset._type is datax, need pass page scope params
                // 2020/03/03: Assigning page scope params to widget params will trigger widget reload data
                // 2023/05/12 :TODO Need to fix it or use merge?
                if (dataset._type === 'datax' && scope) {
                    // _.assign(params, pageDataUtil.getPageScopeValues(scope));
                    _.merge(params, pageDataUtil.getPageScopeValues(scope));
                }

                var _begin = Date.now();
                datasetService.queryDataTable(dataset, params, dataToServer, false).then(function (data) {
                    _timer.query = Date.now() - _begin;
                    if (widgetUiHelper.isEditMode()) {
                        // Limit to 20 records in edit mode to improve performance
                        data.data.splice(20);
                    }
                    if (!convertOnTheFly) {
                        data.data = transformData(data.data, fields);
                    }
                    widgetUiHelper.removeWidgetError(element);
                    d.resolve(data);
                }).catch(function (e) {
                    var msg = $translate.instant('udp.wc.dataset.error_detail', {
                        params: JSON.stringify(params),
                        message: e.message
                    });
                    widgetUiHelper.showWidgetError(element, msg, $translate.instant('udp.wc.dataset.error_title', { dataset: dataset.id }));
                    // 返回空数据结构以便 DataTable 能正确处理错误情况
                    d.resolve({
                        data: [],
                        recordsTotal: 0,
                        recordsFiltered: 0
                    });
                });
                return d.promise;


            }
            /**
             * Transform raw data records with convert function
             * @param records {[]} Raw data records
             * @param fields Fields definition
             * @returns {[]} Converted data records
             */
            function transformData(records, fields) {
                var rules = [];
                if (!fields || fields.length === 0) return records;
                fields.forEach(function (field) {
                    if (!field.dynamic)
                        rules.push({
                            source: field.field,
                            convertFn: field.convertFn
                        });
                });
                var _begin = Date.now();
                var values = widgetDataUtil.getPageScopeValues(scope);
                var result = widgetDataUtil.convertFields(records, rules, values, {
                    includeAllFields: '',
                    keepLinkAsIs: true,
                    valueOfUnresolvedVar: ''
                });
                _timer.convertField = (_timer.convertField || 0) + Date.now() - _begin;
                return result;
            }
        }
    }

    //TODO: move to plugin
    function initEllipsis(dt) {
        dt.on('click.ellipsis', 'span.ellipsis', function (e) {
            var $td = $(this).parent('td');
            var cell = dt.cell($td);
            var css = 'udp-modal-detail';
            var idx = cell.index().column;
            var title = $(dt.column(idx).header()).html();
            var modalTemplate =
                '<div class="modal fade">' +
                '  <div class="modal-dialog">' +
                '    <div class="modal-content">' +
                '      <div class="modal-header">' +
                '        <button type="button" class="btn-close" data-dismiss="modal"></button>' +
                '        <h4 class="modal-title"></h4>' +
                '      </div>' +
                '      <div class="modal-body"><div class="' + css + '" style="word-break: break-all"></div></div>' +
                '      <div class="modal-footer">' +
                '        <button type="button" class="btn btn-primary" data-dismiss="modal">{{\'common.action.close\'|translate}}</button>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>';
            var $modal = $(modalTemplate);
            $('.modal-title', $modal).html(title);
            $('.' + css, $modal).html(cell.data());
            $modal.modal();
        })
    }
})();
