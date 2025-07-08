/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/23/2018
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpWidgetConfigDatasetDatax
     * @description
     * ```html
     * <udp-widget-config-dataset-datax the-model="expression" selected-ds="expression"/>
     * ```
     * @param {object} theModel Widget property `dataset.datax`
     * @param {object} selectedDs Widget property `dataset`
     *
     */
    angular.module('oplus.udp').component('udpWidgetConfigDatasetDatax', {
        templateUrl: 'app/modules/udp/widgets/widget-config-dataset-datax.html',
        bindings: {
            theModel: '=',
            selectedDs: '='
        },
        controller: ['$scope', '$translate', '$uibModal', 'messageService', 'dataEx', DatasetDataxConfigCtrl]
    });

    /**
     * @param $scope
     * @param $translate
     * @param $uibModal
     * @param {messageService} messageService
     * @param {dataEx} dataEx
     * @constructor
     */
    function DatasetDataxConfigCtrl($scope, $translate, $uibModal, messageService, dataEx) {
        var that = this;
        that.theModel = that.theModel || {};
        // metaparams saves parsed variables in datax definition.
        // Key is var name, value is string var value
        that.theModel.metaparams = that.theModel.metaparams || {};
        that.$onInit = $onInit;
        that.testExpr = testExpr;
        that.removeInputVar = removeInputVar;
        // TODO: selectedDs is two-way binding, but can work with undefined value?
        if (!that.selectedDs) {
            that.selectedDs = {};
        }
        initParamsConfig();

        function removeInputVar(key) {
            delete that.theModel.metaparams[key];
        }

        /**
         * Test expression.
         */
        function testExpr() {
            var result = dataEx.evalVarExpr(that.theModel.expr, that.theModel.metaparams, {
                // debugKey: 'wcdc.js',
                errorForUnresolvedVar: true
            });
            if (_.isError(result) && result instanceof UnresolvedVarError) {
                var unresolvedVar = result.message;
                var title = $translate.instant('udp.wc.dataset.datax.test_input_var') + unresolvedVar;
                var input = prompt(title);
                if (input) {
                    that.theModel.metaparams[unresolvedVar] = input;
                    that.testExpr();
                }
            } else if (result && angular.isFunction(result.then)) {
                // Is promise
                result.then(function (data) {
                    showTestResult(data);
                    // messageService.alert('结果', JSON.stringify(data));
                }).catch(function (err) {
                    messageService.alert($translate.instant('common.term.error'), err.message);
                });
            } else {
                showTestResult(result);
                // messageService.alert('结果', JSON.stringify(result));
            }
        }


        function assignMetaFields() {
            var sampleData = dataEx.evalVarExpr(that.theModel.metafields, {});
            var fields = [];
            if (sampleData)
                Object.keys(sampleData).forEach(function (f) {
                    var type = typeof sampleData[f];
                    //TODO: refactor with code in dataset.service.js `queryDatasetMeta`
                    if (angular.isDate(sampleData[f])) {
                        type = 'date';
                    } else if (angular.isArray(sampleData[f])) {
                        type = 'array';
                    }
                    fields.push({name: f, type: type});
                });
            that.selectedDs = that.selectedDs || {};
            that.selectedDs.fields = fields;
        }

        function $onInit() {
            assignMetaFields();
        }

        function showTestResult(data) {
            var instance = $uibModal.open({
                templateUrl: 'app/modules/udp/widgets/widget-config-dataset-datax-result-modal.html',
                backdrop: 'static',//disables modal closing by click on the backdrop
                size: 'lg',
                // scope: $scope,
                controller: ['$scope', function ($scope) {
                    $scope.result = data;
                    $scope.cancelModal = function () {
                        instance.dismiss('cancel');
                    };
                    $scope.useAsFields = function () {
                        instance.close();
                    }
                }]
            });
            instance.result.then(function (value) {
                parseResultFields(data);
                initParamsConfig();
            });
            instance.rendered.then(function () {
                $('.modal-dialog').eq(0)
                    .draggable({handle: '.modal-header:eq(0)'});
            });
        }

        function initParamsConfig() {
            that.selectedDs.paramsConfig = that.selectedDs.paramsConfig || {};
            var paramsConfig = that.selectedDs.paramsConfig;
            // console.log('paramsConfig',paramsConfig,that.theModel.metaparams);
            Object.keys(that.theModel.metaparams).forEach(function (name) {
                // Exclude page and global params.
                if (name.indexOf('@.') < 0 && name.indexOf('#.') < 0) {
                    var value = that.theModel.metaparams[name];
                    paramsConfig[name] = {defaultValue: value, format: typeof value};
                    paramsConfig[name] = _.extend({}, paramsConfig[name], {
                        defaultValue: value,
                        format: typeof value
                    });
                }
            });
            // Remove params not in metaparams
            Object.keys(paramsConfig).forEach(function (key) {
                if (angular.isUndefined(that.theModel.metaparams[key])) {
                    delete paramsConfig[key];
                }
            });
        }

        function parseResultFields(data) {
            // console.log('parseResultFields', data);
            var record;
            if (angular.isArray(data) && data.length > 0) {
                record = parseRecordWithAllFields(data);
            } else if (angular.isObject(data) && data.total && data.records && data.records.length > 0) {
                record = parseRecordWithAllFields(data.records);
            } else if (angular.isObject(data)) {
                record = data;
            }
            if (record) {
                that.theModel.metafields = 'yaml:' + jsyaml.safeDump(record, {
                    'styles': {},
                    'sortKeys': true
                });
                assignMetaFields();
            }

            /**
             * ```
             * [{a:1},{b:2}] --> {a:1, b:2}
             * ```
             * @param array
             * @returns {*}
             */
            function parseRecordWithAllFields(array) {
                var result = {};
                array.forEach(function (item) {
                    result = _.merge(result, item);
                })
                return result;
            }
        }
    }
})();
