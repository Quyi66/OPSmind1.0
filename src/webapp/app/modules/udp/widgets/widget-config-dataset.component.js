/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/12/2017
 */

(function () {
    'use strict';


    /**
     * @ngdoc component
     * @name udpWidgetConfigDataset
     * @description
     * ```html
     * <udp-widget-config-dataset props="expression" selected-ds="expression" options=""/>
     * ```
     * @param {DatasetModelRef} props
     * The model data-bind widget dataset properties to.
     * @param {object} props.params Dataset parameters, parameter name as key, parameter control setting as value
     * `{label:string,control:string,value:string,format:string}`
     * @param {string} props.metafields dataEx
     * @param {object} selectedDs Current selected dataset including meta info
     * @param {[{name:string, type:string}]} selectedDs.fields Field definitions
     * @param {object} selectedDs.paramsConfig Key is param name, value is {desc:string, type:string, required:boolean}
     * @param {object} selectedDs.sampleRecord A sample record
     * @param {object} options
     * @param {boolean=} options.disableConfirm If need confirmation before changing dataset
     * @param {boolean=} options.allowDynamicDs If allow dynamic dataset
     */
    var udpWidgetConfigDataset = {
        templateUrl: 'app/modules/udp/widgets/widget-config-dataset.html',
        bindings: {
            selectedDs: '=',
            theModel: '=props',
            options: '<'
        },
        controller: ['$q', '$translate', '$scope', '$attrs', '$timeout',
            'datasetService', 'datasourceService', 'messageService', 'dataEx',
            'widgetDataUtil', '$stateParams', 'dcDataService', DatasetConfigCtrl]
    };

    angular.module('oplus.udp').component('udpWidgetConfigDataset', udpWidgetConfigDataset);

    /**
     * @param $q
     * @param $scope
     * @param $attrs
     * @param $timeout
     * @param datasetService {datasetService}
     * @param messageService {messageService}
     * @param {dataEx} dataEx
     * @param {widgetDataUtil} widgetDataUtil
     * @constructor
     */
    function DatasetConfigCtrl($q, $translate, $scope, $attrs, $timeout, datasetService,
        datasourceService, messageService, dataEx, widgetDataUtil, $stateParams, dcDataService) {
        if (!$attrs['selectedDs'] || !$attrs['props']) {
            throw new Error('Attribute "selected-ds" and "props" are required for directive <udp-widget-config-dataset>');
        }
        var that = this;
        var oldSelect;
        // that.paramHelper = {};
        // that.pageControls = [];
        /**
         *
         * @type {DatasetModelRef}
         */
        that.theModel = angular.extend({ _type: '' }, that.theModel || {});

        that.confirmChange = confirmChange;
        that.choseDataset = {};
        that.testDataset = testDataset;

        that.tmpParams = {};
        // For dataset transform mode: value as column
        // that.valcol = {};
        that.$onInit = function () {
            loadDatasets().then(function () {
                loadDatamodels().then(function () {
                    confirmChange(that.theModel.id);
                }).catch(function (err) {
                    messageService.alertError($translate.instant('udp.wc.dataset.error.cannot_get_data'), err.message);
                });
            }).catch(function (err) {
                messageService.alertError($translate.instant('udp.wc.dataset.error.cannot_get_dataset'), err.message);
            });
            // if (that.theModel.trans && that.theModel.trans.mode==='valcol'){
            //     _.forIn(that.theModel.trans['valcol'],function(value,key){
            //         that.valcol[key]={field:value};
            //     });
            // }
            // $scope.$watch('$ctrl.valcol', function (newVal, oldVal) {
            //     if (!that.theModel.trans) {
            //         return;
            //     }
            //     if (that.theModel.trans.mode === 'valcol' && newVal !== oldVal) {
            //         that.theModel.trans.valcol = {};
            //         _.forIn(newVal, function (value, key) {
            //             that.theModel.trans.valcol[key] = value.field;
            //         });
            //     }
            // }, true);
        };

        $scope.$watch('$ctrl.theModel._type', function (n, o) { 
            if (!angular.isString(n) || !angular.isString(o) || n === o) return;

            if (that.theModel.params && that.theModel.params.length > 0)
                that.tmpParams[o] = that.theModel.params;
            
            that.theModel.params = that.tmpParams[n] || [];

        }, true)

        that.editDatamodel = editDatamodel;
        that.editDataset = editDataset;
        that.newDataset = newDataset;

        function editDatamodel() {
            if (that.choseDatamodel) {
                window.open("#/applets/" + that.choseDatamodel.appletCode + "/mgmt/data/models/data/model/edit/" + that.choseDatamodel.id, '_blank');
            }
        }

        function editDataset() {
            if (that.choseDataset) {
                /*window.open("#/dts/" + that.choseDataset.type + "/datasources/" + that.choseDataset.datasource + "/datasets/" + that.choseDataset.id + "/edit", '_blank');*/
                window.open("#/applets/" + that.choseDataset.appletCode + "/mgmt/dataset/" + that.choseDataset.id + "/edit", '_blank');
            }
        }

        function newDataset() {
            if (that.choseDataset) {
                window.open("#/dts/" + that.choseDataset.type + "/datasources/" + that.choseDataset.datasource + "/datasets/new", '_blank');
            } else {
                window.open("#/dts", '_blank');
            }
        }

        function testDataset() {

        }

        function confirmChange() {
            var options = that.options || {};
            if (oldSelect && oldSelect.id && !options.disableConfirm) {
                messageService.confirm($translate.instant('udp.wc.dataset.change_dataset'),$translate.instant('udp.wc.dataset.change_dataset_confirm'),
                    function ok() {
                        // ctrl.$apply(function () {
                        //TODO: $timeout and $apply is necessary?
                        // $timeout(function () {
                        oldSelect = {
                            _type: that.theModel._type,
                            id: that.theModel.id
                        };
                        if (that.theModel._type === 'datamodel')
                            convertDatamodelMeta();
                        else
                            loadDatasetMeta(that.theModel.id);
                        // });
                    }, function cancel() {
                        $scope.$apply(function () {
                            that.theModel._type = oldSelect._type;
                            that.theModel.id = oldSelect.id;

                            if (that.theModel._type === 'datamodel')
                                convertDatamodelMeta();
                            else
                                loadDatasetMeta(that.theModel.id);
                        });
                    });
            } else {
                oldSelect = {
                    _type: that.theModel._type,
                    id: that.theModel.id
                };

                if (that.theModel._type === 'datamodel')
                    convertDatamodelMeta();
                else
                    loadDatasetMeta(that.theModel.id);
            }
        }

        function loadDatasets() {
            var d = $q.defer();
            /*datasetService.findAllDatasets().then(function (data) {
                that.datasets = data;
                confirmChange(that.theModel.id);
                d.resolve();
            }).catch(function (err) {
                d.reject(err);
            });*/

            datasetService.findDatasetsByApplet($stateParams.appletCode).then(function (data) {
                if('oplus_core' != $stateParams.appletCode){
                    datasetService.findDatasetsByApplet('oplus_core').then(function (data2) {
                        that.datasets =data.concat(data2)
                        d.resolve();
                    }).catch(function (err2) {
                        d.reject(err2);
                    });
                }else{
                    that.datasets = data;
                    d.resolve();
                }
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }


        function loadDatamodels() {
            var d = $q.defer();
            /*datasetService.findAllDatasets().then(function (data) {
                that.datasets = data;
                confirmChange(that.theModel.id);
                d.resolve();
            }).catch(function (err) {
                d.reject(err);
            });*/

            dcDataService.dcModelList($stateParams.appletCode).then(function (data) {
                if('oplus_core' != $stateParams.appletCode){
                    dcDataService.dcModelList('oplus_core').then(function (data2) {
                        that.datamodels = data.concat(data2)
                        d.resolve();
                    }).catch(function (err2) {
                        d.reject(err2);
                    });
                }else{
                    that.datamodels = data;
                    d.resolve();
                }
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }


        /**
         * Fetch dataset meta from server
         * @param {string} code
         * @returns {promise.<{fields:[],paramsConfig:{}}>}
         */
        function fetchDatasetMeta(code) {
            var d = $q.defer();
            var selectedDs;
            selectedDs = _.find(that.datasets, {'code': code});
            that.choseDataset = angular.copy(selectedDs);
            // If dataset exists and no meta fetched
            if (selectedDs && !selectedDs.fields) {
                var queryParams = {};
                if (selectedDs.params) {
                    Object.keys(selectedDs.params).forEach(function (param) {
                        queryParams[param]=selectedDs.params[param].defaultValue;
                    });
                }
                // Init query params with model params initval for querying meta
                var modelParams = that.theModel.params;
                // Compatible with deprecated object type paramsConfig
                if (!angular.isArray(modelParams)) {
                    modelParams = [];
                }
                modelParams.forEach(function (p) {
                    if (!angular.isUndefined(queryParams[p.name])) {
                        queryParams[p.name] = p.initval;
                    }
                });
                // console.log('fetchDatasetMeta', JSON.stringify({
                //     selectedDs: selectedDs.params,
                //     queryParams: queryParams,
                //     theModel: that.theModel.params
                // }));
                datasetService.queryDatasetMeta(selectedDs.code, queryParams).then(function (meta) {
                    selectedDs.fields = meta.fields || [];
                    selectedDs.paramsConfig = meta.paramsConfig || {};
                    selectedDs.sampleRecord = meta.sampleRecord;
                    d.resolve(selectedDs);
                }).catch(function (err) {
                    d.reject(err);
                    // throw err;
                });
            } else {
                d.resolve(selectedDs);
            }
            return d.promise;
        }

        /**
         * Load meta info for dataset in `ctrl.selectedDs`.
         */
        function loadDatasetMeta(code) {
            if (that.theModel._type !== 'datax') {
                fetchDatasetMeta(code).then(function (ds) {
                    that.selectedDs = ds;
                }).catch(function (err) {
                    messageService.alertError($translate.instant('udp.wc.dataset.error.cannot_get_meta'), err.message);
                });
            }
        }


        function convertDatamodelMeta() {
            var selectedDs = _.find(that.datamodels, {'code': that.theModel.id});
            that.choseDatamodel = angular.copy(selectedDs);
            // If dataset exists and no meta fetched
            if (selectedDs && !selectedDs.fields) {
                var dcAttrs = angular.fromJson(selectedDs.attrs)

                selectedDs.fields = _.map(_.filter(dcAttrs, function (f) { return f.type !== 'group'; }), function (m) {
                    return {
                        name: m.code,
                        alias: m.title,
                        type: m.input['datatype'] || 'string',
                    }
                })

                selectedDs.paramsConfig = {};
                selectedDs.sampleRecord = [];
            }

            that.selectedDs = selectedDs;
        }
    }

    /**
     *
     * @type {{datax: {}, joinx: {}, id: string, type: string, trans: {mode: string, valcoll: {keyAs: string, colAs: string, valAs: string, descAs:string}}}}
     */
    var DatasetModelRef = {
        id: '',
        type: '',
        joinx: {},
        datax: {},
        datamodel: {},
        trans: {
            mode: 'undefine, rotate, valcol',
            valcol: {
                keyAs: '',
                colAs: '',
                valAs: '',
                descAs: ''
            },
            rotate: {
                oldKeyCol: '', // Old key column
                newKeyCol: ''  // New key column
            }
        }
    }
})();
