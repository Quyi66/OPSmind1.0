/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/16/2018
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpWidgetConfigDatasetJoinx
     * @description
     * ```html
     * <udp-widget-config-dataset-joinx props="expression" selected-ds="expression" options=""/>
     * ```
     *
     */
    var udpWidgetConfigDatasetJoinx = {
        templateUrl: 'app/modules/udp/widgets/widget-config-dataset-joinx.html',
        bindings: {
            theModel: '=',
            selectedDs: '=',
            params: '<',
            datasets: '<',
            options: '<'
        },
        controller: ['$q', '$translate','$scope', '$attrs', '$timeout', 'datasetService', 'messageService', 'dataEx', 'widgetDataUtil', DatasetJoinxConfigCtrl]
    };

    angular.module('oplus.udp').component('udpWidgetConfigDatasetJoinx', udpWidgetConfigDatasetJoinx);

    /**
     * @param $q
     * @param $translate
     * @param $scope
     * @param $attrs
     * @param $timeout
     * @param datasetService {datasetService}
     * @param messageService {messageService}
     * @param {dataEx} dataEx
     * @param {widgetDataUtil} widgetDataUtil
     * @constructor
     */
    function DatasetJoinxConfigCtrl($q,$translate, $scope, $attrs, $timeout, datasetService, messageService, dataEx, widgetDataUtil) {
        var ctrl = this;
        var activeRelation = {dsIndex: undefined, relIndex: undefined};
        // Since HTML use orderBy which changes field index, we user field name to locate field
        var sortOldIndex, fieldInEdit = {dsIndex: undefined, fieldName: undefined};
        /**
         *
         * @type {{dses:[{code:string,relations:[{left:string,right:string}],fields:object<{excluded:boolean,rename:string}>]}}
         */
        ctrl.theModel = ctrl.theModel || {};
        ctrl.sortableOptions = {
            handle: '.op-drag-handle',
            'ui-floating': true,
            placehodler: 'ui-sortable-placeholder'
        };
        ctrl.$onInit = $onInit;
        ctrl.addDataset = addDataset;
        ctrl.removeDataset = removeDataset;
        ctrl.addRelation = addRelation;
        ctrl.removeRelation = removeRelation;
        ctrl.chooseRelation = chooseRelation;
        ctrl.setRelationField = setRelationField;
        ctrl.activeRelation = activeRelation;
        ctrl.fieldInEdit = fieldInEdit;
        ctrl.toggleField = toggleField;
        ctrl.renameField = renameField;
        ctrl.saveRename = saveRename;
        ctrl.cancelRename = cancelRename;
        ctrl.onSortStart = onSortStart;
        ctrl.onSortStop = onSortStop;

        function onSortStart(event, ui) {
            sortOldIndex = ui.item.index();
        }

        function onSortStop(event, ui) {
            // Use ui.item.sortable.dropindex instead of ui.item.index()
            // https://github.com/angular-ui/ui-sortable/issues/273
            // var newIndex = ui.item.index();
            var index = ui.item.sortable.dropindex;
            if (index !== sortOldIndex) {
                parseFieldsInRelation(index);
                parseFieldsInRelation(index + 1);
                parseFieldsInRelation(index - 1);
            }
            sortOldIndex = undefined;
        }

        function renameField(dsIndex, fieldName) {
            fieldInEdit.dsIndex = dsIndex;
            fieldInEdit.fieldName = fieldName;
            var field = _.find(ctrl.graphDs[dsIndex].fields, {name: fieldName});
            field._tempRename = field.rename || field.name;
        }

        function saveRename(field) {
            if (field._tempRename) {
                field.rename = field._tempRename;
            }
            if (field.rename === field.name) {
                field.rename = undefined;
            }
            fieldInEdit.dsIndex = undefined;
            fieldInEdit.fieldName = undefined;
        }

        function cancelRename(field) {
            field.rename = undefined;
            field._tempRename = undefined;
            fieldInEdit.dsIndex = undefined;
            fieldInEdit.fieldName = undefined;
        }

        function toggleField(dsIndex, fieldName) {
            var field = _.find(ctrl.graphDs[dsIndex].fields, {name: fieldName});
            if (field) {
                field.excluded = !field.excluded;
            }
        }

        function removeRelation(dsIndex, relIndex) {
            if (ctrl.graphDs[dsIndex].relations.length === 1) {
                messageService.alert($translate.instant('udp.wc.dataset.joinx.remove_relation'),$translate.instant('udp.wc.dataset.joinx.error.at_least_one_relation'));
            } else {
                messageService.confirm($translate.instant('udp.wc.dataset.joinx.remove_relation'),$translate.instant('udp.wc.dataset.joinx.remove_relation_confirm'), function () {
                    ctrl.graphDs[dsIndex].relations.splice(relIndex, 1);
                    chooseRelation(dsIndex, relIndex < 1 ? ctrl.graphDs[dsIndex].relations.length - 1 : relIndex - 1);
                    parseFieldsInRelation(dsIndex);
                    parseFieldsInRelation(dsIndex - 1);
                });
            }
        }

        function addRelation(dsIndex) {
            var modelDs = ctrl.graphDs[dsIndex];
            modelDs.relations = modelDs.relations || [];
            var incompleteRel = _.findIndex(modelDs.relations, function (o) {
                return !o.left || !o.right;
            });
            var relIndex;
            if (incompleteRel > -1) {
                relIndex = incompleteRel;
            } else {
                modelDs.relations.push({});
                relIndex = modelDs.relations.length - 1;
                parseFieldsInRelation(dsIndex);
            }
            chooseRelation(dsIndex, relIndex);
        }

        function chooseRelation(dsIndex, relIndex) {
            activeRelation.dsIndex = dsIndex;
            activeRelation.relIndex = relIndex;
            // console.log('activeRelation', activeRelation);
        }

        function setRelationField(dsIndex, field) {
            // console.log('setRelationField', activeRelation, dsIndex, field);
            var currentRel = ctrl.graphDs[activeRelation.dsIndex].relations[activeRelation.relIndex];
            if (activeRelation.dsIndex === dsIndex + 1) {
                currentRel.left = field;
                currentRel.hasError = false;
                parseFieldsInRelation(dsIndex);
            } else if (activeRelation.dsIndex === dsIndex) {
                currentRel.right = field;
                currentRel.hasError = false;
                parseFieldsInRelation(dsIndex);
            }
        }

        function $onInit() {
            loadDatasets().then(function () {
                return modelToGraph(ctrl.theModel);
            }).then(function () {
                parseParamsConfig();
                $scope.$watch('$ctrl.graphDs', function (newVal, oldVal) {
                    graphToModel(newVal);
                    parseFields();
                }, true);
            }).catch(function (err) {
                messageService.alertError($translate.instant('udp.wc.dataset.error.cannot_get_dataset'), err.message);
            });
        }

        function removeDataset(index) {
            ctrl.graphDs.splice(index, 1);
            chooseRelation(undefined, undefined);
            parseParamsConfig();
        }

        function addDataset() {
            ctrl.graphDs = ctrl.graphDs || [];
            var dsCode = ctrl.selectedDsCode;
            var index = _.findIndex(ctrl.graphDs, {code: dsCode});
            if (index < 0)
                fetchDatasetMeta(dsCode).then(function (ds) {
                    var obj = _.assign({relations: [{}]}, ds);
                    ctrl.graphDs.push(obj);
                    chooseRelation(ctrl.graphDs.length - 1, 0);
                    parseParamsConfig();
                }).catch(function(err){
                    messageService.alertError($translate.instant('udp.wc.dataset.error.cannot_get_meta'), err.message);
                });
        }

        function graphToModel() {
            var datasets = ctrl.graphDs;
            ctrl.theModel.dses = [];
            if (datasets && datasets.length > 0) {
                datasets.forEach(function (graphDs, index) {
                    var modelDs = {};
                    modelDs.code = graphDs.code;//.push({code: ds.code});
                    modelDs.relations = [];
                    graphDs.relations.forEach(function (rel) {
                        modelDs.relations.push({left: rel.left, right: rel.right});
                    });
                    // Save fields as object
                    modelDs.fields = {};
                    graphDs.fields.forEach(function (field) {
                        if (field.excluded || field.rename)
                            modelDs.fields[field.name] = {
                                excluded: field.excluded ? true : undefined,
                                rename: field.rename || undefined
                            };
                    });
                    ctrl.theModel.dses.push(modelDs);
                });
            }
        }

        // function determineFields(fields, relation) {
        //     fields.forEach(function (field) {
        //         var index = _.findIndex(relation, function (o) {
        //             return o.right === field.name;
        //         });
        //         field.inRelation = index > -1;
        //     });
        // }
        function parseFields() {
            var fields = [];
            ctrl.graphDs.forEach(function (ds) {
                if (ds.fields) {
                    ds.fields.forEach(function (field) {
                        if (!field.excluded) {
                            var fieldName = field.rename || field.name;
                            if (!_.find(fields, {name: fieldName})) {
                                // add alias by lbb -- 20190220
                                fields.push({name: fieldName, type: field.type, desc: field.desc,alias:field.alias});
                            }
                        }
                    });
                }
            });
            ctrl.selectedDs = ctrl.selectedDs || {};
            ctrl.selectedDs.fields = fields;
        }

        function parseParamsConfig() {
            ctrl.selectedDs = ctrl.selectedDs || {};
            ctrl.selectedDs.paramsConfig = {};
            for (var i = ctrl.graphDs.length - 1; i > -1; i--) {
                var ds = ctrl.graphDs[i];
                _.assign(ctrl.selectedDs.paramsConfig, ds.paramsConfig);
            }
        }

        function checkRelationValidility(dsIndex) {
            if (ctrl.graphDs[dsIndex].relations) {
                ctrl.graphDs[dsIndex].relations.forEach(function (rel) {
                    if (rel.left && dsIndex > 0) {
                        var fieldExist = _.findIndex(ctrl.graphDs[dsIndex - 1].fields, {name: rel.left});
                        if (fieldExist < 0) {
                            rel.hasError = true;
                        }
                    }
                });
            }
        }

        /**
         * Parse if field is a relation field.
         * It addes `inRightRel` and `inLeftRel` properties to each field.
         * @param dsIndex
         */
        function parseFieldsInRelation(dsIndex) {
            // console.log('parseGraphFieldsRelation', dsIndex);
            if (dsIndex < 0 || dsIndex >= ctrl.graphDs.length) {
                return;
            }
            checkRelationValidility(dsIndex);
            var fields = ctrl.graphDs[dsIndex].fields;
            fields.forEach(function (field) {
                // Not last
                if (dsIndex < ctrl.graphDs.length - 1) {
                    var inLeftRel = _.findIndex(ctrl.graphDs[dsIndex + 1].relations, function (o) {
                        return o.left === field.name;
                    });
                    field.inLeftRel = inLeftRel > -1;
                }
                // Not first
                if (dsIndex > 0) {
                    var inRightRel = _.findIndex(ctrl.graphDs[dsIndex].relations, function (o) {
                        return o.right === field.name;
                    });
                    field.inRightRel = inRightRel > -1;
                }
            });
        }

        function modelToGraph(model) {
            ctrl.graphDs = [];
            var promises = [];
            if (model && model.dses) {
                model.dses.forEach(function (modelDs, index) {
                    promises.push(processOneModel(modelDs, index));
                });
            }
            return $q.all(promises);

            function processOneModel(modelDs, index) {
                var d = $q.defer();
                var ds = {code: modelDs.code, relations: modelDs.relations};
                ctrl.graphDs.push(ds);
                fetchDatasetMeta(modelDs.code).then(function (dsMeta) {
                    ds.name = dsMeta.name;
                    ds.fields = dsMeta.fields;
                    ds.paramsConfig = dsMeta.paramsConfig;
                    // Assign field values in modelDs to graphDs
                    // `fields` in modelDs is object, in graphDs is array
                    Object.keys(modelDs.fields).forEach(function (name) {
                        var f = _.find(ds.fields, {name: name});
                        if (f) {
                            _.assign(f, modelDs.fields[name]);
                        }
                    });
                    parseFieldsInRelation(index);
                    d.resolve();
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            }

        }

        function loadDatasets() {
            var d = $q.defer();
            if (ctrl.datasets) {
                d.resolve();
            } else {
                datasetService.findAllDatasets().then(function (data) {
                    ctrl.datasets = data;
                    d.resolve();
                }).catch(function (err) {
                    d.reject(err);
                });
            }
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
            selectedDs = _.find(ctrl.datasets, {'code': code});
            // If dataset exists and no meta fetched
            if (selectedDs && !selectedDs.fields) {
                // Init query params with model params initval for querying meta
                var modelParams = ctrl.params,
                    queryParams = {};
                // Compatible with deprecated object type paramsConfig
                if (!angular.isArray(modelParams)) {
                    modelParams = [];
                }
                modelParams.forEach(function (p) {
                    queryParams[p.name] = p.initval;
                });
                datasetService.queryDatasetMeta(selectedDs.code, queryParams).then(function (meta) {
                    selectedDs.fields = meta.fields || [];
                    selectedDs.paramsConfig = meta.paramsConfig || {};
                    d.resolve(selectedDs);
                }).catch(function (err) {
                    d.reject(err);
                });
            } else {
                d.resolve(selectedDs);
            }
            return d.promise;
        }
    }
})();
