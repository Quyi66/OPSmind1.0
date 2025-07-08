/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/28, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdDataView
     * @description
     * View UMD data.
     * ```html
     * <umd-data-view the-data="object"
     *                model-def="{attrs:[]}"
     *                view-type="string"
     *                options="{selectionConfig:{}}" />
     * @param {string} viewType  View type (list, detail, selector, editor), default is 'detail'
     * @param {[]|{}} theData Two-way binding of model data.
     * @param {{attrs:[]}} theModel Model definition
     * @param {[]} theModel.attrs Definition of model attributes
     * @param {object=} options
     * @param {object=} options.selectionConfig Used with table format view. See opxDatatable selection config.
     * @param {function(object)} options.onTableLoaded Used with table format view. Parameter is table config.
     * @param {boolean=} options.editMode Used with `detail` view Type, default is false
     *
     * ```
     */
    angular.module('oplus.commons').component('umdDataView', {
        bindings: {
            viewType: '<',
            theData: '=',
            modelDef: '<',
            options: '<'
        },
        templateUrl: 'app/modules/commons/umd/umd-data-view.component.html',
        controller: ['$scope', '$element', '$q', 'udmUtil', 'dataEx', 'widgetInteraction', 'modalHelper', umdDataViewCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {udmUtil} udmUtil
     * @param {dataEx} dataEx
     * @param {widgetInteraction} widgetInteraction
     * @param {modalHelper} modalHelper
     */
    function umdDataViewCtrl($scope, $element, $q, udmUtil, dataEx, widgetInteraction, modalHelper) {
        var that = this;
        this.$onInit = onInit;
        this.viewType = this.viewType || 'detail';
        this.options = this.options || {};
        this.clickOperation = clickOperation;
        this.clickTableItem = clickTableItem;
        var inited = false;

        function onInit() {
            // prepareView(that.theData,that.modelDef);
            $scope.$watch('$ctrl.theData', function (n, o) {
                // console.log('watch theData', that.theData, that.modelDef)
                that.viewData = n;
                if (!that.options.editMode)
                    that.viewData = angular.copy(n);
            });
            
            $scope.$watch('$ctrl.modelDef', function (newVal, oldVal) {
                // console.log('watch modelDef', that.theData, that.modelDef)
                prepareView();
            }, true);
        }

        function clickTableItem(action, rowIndex, column) {
            // console.log('clickTableItem: action=%o, rowIndex=%o', action, rowIndex);
            var modalInstance = modalHelper.openModal({
                template: '<div class="modal-header"><h4 class="modal-title">{{$ctrl.title}}</h4>' +
                    '<button type="button" ng-click="$ctrl.close()" class="btn btn-default opx-btn-flat opx-btn-icon op-close-window"><i class="far fa-times"></i></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<umd-data-view view-type="\'detail\'" the-data="$ctrl.theData" model-def="$ctrl.modelDef"></umd-data-view>' +
                    '</div>',
                controller: [function () {
                    var self = this;
                    //TODO: rowData is NOT always the whole data for this record. How to get full data?
                    var rowData = that.tableConfig.getTableData()[rowIndex];
                    this.title = rowData[column];
                    // Get full data
                    var detailView = _.find(that.modelDef.views, {type: 'detail'});
                    $q.when(dataEx.evalVarExpr(detailView.data, rowData)).then(function (data) {
                        self.theData = data;
                        self.modelDef = that.modelDef;
                    });
                    this.close = function () {
                        modalInstance.dismiss();
                    }
                }],
                controllerAs: '$ctrl'
            });
        }

        /**
         *
         * @param operation
         * @param {string} operation.type
         * @param {object} operation.config
         * @param {Event} event
         */
        function clickOperation(operation, event) {
            var config = operation.config;
            var values = that.theData;
            var options = {element: $(event.currentTarget)};
            widgetInteraction.handleInteraction($scope, config, values, options);
        }

        function prepareView(data, model) {
            // if (inited || !data || !model) {
            if (inited || !that.modelDef) {
                return;
            }
            // console.log('prepareView', {data: data, model: model, viewType: that.viewType});
            inited = true;
            if (that.viewType === 'detail' || that.viewType === 'editor') {
                detailView();
                return;
            }
            tableView();

            function tableView() {
                var columns = [];
                var viewDef = _.find(that.modelDef.views, {type: that.viewType});
                if (!viewDef.config.columns || viewDef.config.columns.length === 0) {
                    that.error = 'No column defined';
                    return;
                }
                viewDef.config.columns.forEach(function (col) {
                    var code = angular.isString(col) ? col : col.attr;
                    var attr = _.find(that.modelDef.attrs, {code: code});
                    if (!attr) {
                        return;
                    }
                    var column = {
                        data: code,
                        title: attr ? (attr.title || code) : code
                    };
                    if (attr.display) {
                        if (attr.display.onclick || attr.display.converter) {
                            column.render = function (data, type, row, meta) {
                                var html = data;
                                if (attr.display.converter) {
                                    html = dataEx.evalVarExpr(attr.display.converter, row);
                                }
                                if (attr.display.onclick) {
                                    html = '<a class="text-primary" ng-click="$ctrl.clickTableItem(\'' + attr.display.onclick + '\',' + meta.row + ',\'' + attr.code + '\')">' + html + '</a>'
                                }
                                return html;
                            };
                        }
                    }
                    columns.push(column);
                });
                if (that.viewType === 'list') {
                    that.tableConfig = {columns: columns, data: that.theData, buttons: ['reload', 'excel']};
                } else if (that.viewType === 'selector') {
                    var selection = that.options.selectionConfig;
                    that.tableConfig = { columns: columns, data: that.theData, selection: selection };
                    that.options.tableInstance = that.tableConfig;
                }
                if (angular.isFunction(that.options.onTableLoaded)) {
                    that.options.onTableLoaded(that.tableConfig);
                }
            }

            function detailView() {
                $q.when(that.theData).then(function (data) {
                    that.theData = data;
                    that.viewData = that.theData;
                    that.operations = that.modelDef.operations;
                    that.groupedAttrs = udmUtil.groupModelAttrs(that.modelDef.attrs);
                    if (!that.options.editMode) {
                        that.viewData = angular.copy(that.theData);
                        that.groupedAttrs.forEach(function (ga) {
                            _.forEach(ga.attrs, function (attr) {
                                if (attr.display && attr.display.converter) {
                                    that.viewData[attr.code] = dataEx.evalVarExpr(attr.display.converter, data);
                                }
                            });
                        });
                    }
                });
            }
        }
    }
})();
