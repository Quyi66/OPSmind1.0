/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/28, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdConfigView
     * @description
     * Configure view of model.
     * ```html
     * <umd-config-view model-def="{views:[],attrs:[]}"/>
     * @param modelDef Model definition
     * @param modelDef.theViews Config of views. This will be modified.
     * @param modelDef.theAttrs Config of attributes
     * ```
     */
    angular.module('oplus.commons').component('umdConfigView', {
        bindings: {
            modelDef: '<'
        },
        templateUrl: 'app/modules/commons/umd/umd-config-view.component.html',
        controller: ['$scope', '$element', 'modalHelper', '$translate', UmdConfigViewCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {modalHelper} modalHelper
     * @param {$translate} $translate
     */
    function UmdConfigViewCtrl($scope, $element, modalHelper, $translate) {
        var that = this;
        this.attrsByCode = {};
        this.availAttrs = [];
        this.VIEW_DEFS = {
            list: {title: $translate.instant('umd.view.summary_list'), icon: 'fa-th-list', format: 'table'},
            selector: {title: $translate.instant('umd.view.selector_list'), icon: 'fa-tasks', format: 'table'},
            detail: {title: $translate.instant('umd.view.detail'), icon: 'fa-list-alt', format: 'form'},
            editor: {title: $translate.instant('umd.view.editor'), icon: 'fa-pen-square', format: 'form'}
        };
        this.attrsSortableOptions = {helper: "clone"};
        this.$onInit = onInit;
        this.clickView = clickView;
        this.previewView = previewView;
        this.toggleSelectionOfAttr = toggleSelectionOfAttr;
        this.toggleSelectionOfAllAttrs = toggleSelectionOfAllAttrs;

        /**
         * Select or unselect all attributes
         * @param {boolean} status
         */
        function toggleSelectionOfAllAttrs(status) {
            if (status === false) {
                that.currentView.config.columns = [];
                that.availAttrs.forEach(function (attr) {
                    delete attr._selected;
                });
            } else {
                that.availAttrs.forEach(function (attr) {
                    var col = _.find(that.currentView.config.columns, {attr: attr.code});
                    if (!col) {
                        that.currentView.config.columns.push({attr: attr.code});
                        attr._selected = true;
                    }
                });
            }
        }

        /**
         * Select or unselect an attribute
         * @param {string} attrCode
         */
        function toggleSelectionOfAttr(attrCode) {
            var columns = that.currentView.config.columns;
            var attr = _.find(that.availAttrs, {code: attrCode});
            var colIndex = _.findIndex(columns, {attr: attrCode});
            if (colIndex > -1) {
                columns.splice(colIndex, 1);
                delete attr._selected;
            } else {
                columns.push({attr: attr.code});
                attr._selected = true;
            }
        }

        function previewView(viewType) {
            var records = mockPreviewData();
            // var viewType = that.currentView.type;
            var component, data;
            if (viewType === 'detail') {
                component = '<umd-data-view the-data="$ctrl.data" model-def="$ctrl.model" view-type="\'detail\'" options="{editMode:!true}"></umd-data-view>';
                data = records[0];
            } else if (viewType === 'editor') {
                component = '<umd-data-view the-data="$ctrl.data" model-def="$ctrl.model" view-type="\'editor\'" options="{editMode:true}"></umd-data-view>';
                data = records[0];
            } else if (viewType === 'list') {
                component = '<umd-data-view the-data="$ctrl.data" model-def="$ctrl.model" view-type="\'list\'"></umd-data-view>';
                data = records;
            } else if (viewType === 'selector') {
                component = '<umd-data-view the-data="$ctrl.data" model-def="$ctrl.model" view-type="\'selector\'" options="$ctrl.viewOptions"></umd-data-view>';
                data = records;
            }

            var modal = modalHelper.openModal({
                template: '<div class="modal-header"><h4 class="modal-title">{{ \'umd.view.preview\' | translate}}</h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal" ng-click="$ctrl.cancel()"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    component +
                    '</div>',
                controller: [function () {
                    this.data = data;
                    this.model = that.modelDef;
                    this.viewOptions = {
                        selectionConfig: {
                            valueData: 'ip'
                        }
                    };
                    this.cancel = function () {
                        modal.dismiss();
                    }
                }],
                controllerAs: '$ctrl'
            }, {resizable: true});
        }

        function mockPreviewData() {
            var result = [];
            for (var i = 0; i < 10; i++) {
                var rec = {};
                result.push(rec);
                that.modelDef.attrs.forEach(function (attr) {
                    var value;
                    if (attr.type === 'group') {
                        return;
                    }
                    var datatype = 'string';
                    var control = 'input';
                    if (attr.input) {
                        control = attr.input.control || 'input';
                        datatype = attr.input.datatype;
                    }
                    if (datatype === 'number') {
                        value = 123;
                    } else if (datatype === 'datetime' || control === 'datepicker') {
                        value = new Date();
                    } else if (datatype === 'boolean') {
                        value = true;
                    } else if (datatype === 'json') {
                        value = {foo: 'foo', bar: 'bar2'};
                    } else {
                        value = 'ABCD';
                    }
                    rec[attr.code] = value;
                });
            }
            return result;
        }

        /**
         * Click one view by type.
         * @param {string} type View type
         */
        function clickView(type) {
            var view = _.find(that.modelDef.views, {type: type});
            if (!view) {
                view = {type: type, config: {}};
                // if (that.VIEW_DEFS[type].format === 'table') {
                //     view.config = {columns: []};
                // }
                that.modelDef.views.push(view);
            }
            view.config = view.config || {};
            if (that.VIEW_DEFS[type].format === 'table') {
                view.config.columns = view.config.columns || [];
                view.config.columns.forEach(function (col, index) {
                    if (angular.isString(col)) {
                        view.config.columns[index] = {attr: col};
                    }
                });
            }
            that.currentView = view;
            // that.viewConfigJson = JSON.stringify(that.currentView.config, null, "  ");
        }

        function onInit() {
            // $scope.$watch('$ctrl.viewConfigJson', function (newVal, oldVal) {
            //     var configJson = newVal;
            //     if (!configJson) return;
            //     try {
            //         that.currentView.config = JSON.parse(configJson);
            //     } catch (ex) {
            //         console.error(ex.message);
            //     }
            // });
            $scope.$watch('$ctrl.currentView', function (newVal, oldVal) {
                if (!newVal) {
                    return;
                }
                initAttrs();
            }, false);
            $scope.$watch('$ctrl.modelDef.attrs', function (newVal, oldVal) {
                if (!newVal) {
                    return;
                }
                that.attrsByCode = {};
                that.modelDef.attrs.forEach(function (attr) {
                    if (attr.type !== 'group') {
                        that.attrsByCode[attr.code] = attr;
                    }
                });
                initAttrs();

                if (!that.modelDef.views) {
                    that.modelDef.views = [];
                }
            }, true);

            function initAttrs() {
                if (!that.currentView || !that.modelDef.attrs) {
                    return;
                }
                that.availAttrs = [];
                that.modelDef.attrs.forEach(function (attr) {
                    if (attr.type !== 'group') {
                        that.availAttrs.push(angular.copy(attr));
                    }
                });
                that.modelDef.views.forEach(function (view) {
                    var config = view.config;
                    if (config && config.columns) {
                        // Remove non-exist attrs
                        var removed = _.remove(config.columns, function (col) {
                            return !_.find(that.availAttrs, {code: col.attr});
                        });
                    }
                });
                that.availAttrs.forEach(function (attr) {
                    attr._selected = !!_.find(that.currentView.config.columns, function (col) {
                        return col.attr === attr.code;
                    });
                });
            }
        }
    }
})();
