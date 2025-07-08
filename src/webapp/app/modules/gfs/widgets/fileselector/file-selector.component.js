/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-04-05
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name gfsFileSelector
     * @description
     * ```html
     * <gfs-file-selector the-model="string" config="object" model-converter="object">
     * ```
     * @param {[{path:string, config:string=, id:string=}]} theModel Two-way binding of selected files
     * @param {object} config
     * @param {string} config.viewMode "dialog" (default), "browser"
     * @param {boolean} config.multipleSelect
     * @param {string} config.repoType "git" (default), "staticfs"
     * @param {boolean=} config.showFileConfig Show file config as input
     * @param {boolean=} config.doNotShowTagsParam do not show tags param
     * @param {boolean=} config.downloadButton Show download button
     * @param {string} config.initDir Initial dir
     * @param {string} config.base The outermost dir allowed to navigate
     * @param {object} modelConverter Converter between model and file data
     * @param {string} modelConverter.type "singleattr" or "attrmap"
     * @param {string=} modelConverter.singleattr Attribute used as model value
     * @param {object=} modelConverter.attrmap Key is model attribute name, value is file attribute name (id, path, name, config)
     * @param {string} modelConverter.modelType Model value type, "string","array","object"
     *
     */
    angular.module('oplus.gfs').component('gfsFileSelector', {
        bindings: {
            theModel: '=',
            config: '<',
            modelConverter: '<',
            disableFileButton: '<',
            ifGroupDiv: '<'
        },
        templateUrl: 'app/modules/gfs/widgets/fileselector/file-selector.html',
        controller: ['$scope', 'gfsActionHelper', 'gfileService', 'messageService', '$translate', '$compile', 'modalHelper', FileSelectorCtrl]
    });

    /**
     * @param $scope
     * @param {gfsActionHelper} gfsActionHelper
     */
    function FileSelectorCtrl($scope, gfsActionHelper, gfileService, messageService, $translate, $compile, modalHelper) {
        this.disableFile = this.disableFile === true ? this.disableFile : false;
        this.ifGroupDiv = this.ifGroupDiv === false ? this.ifGroupDiv : true;
        var that = this;
        this.config = this.config || {};
        var isDialogMode = this.config.viewMode === 'dialog';
        // console.log(this.config);
        var fileDialogConfig = {
            // Base
            repoType: this.config.repoType || 'git',
            repo: this.config.repo || '$tnt',
            dir: this.config.initDir || '',
            base: this.config.base || '',
            multipleSelect: this.config.multipleSelect,
            downloadButton: this.config.downloadButton,
            refreshButton: this.config.refreshButton,
            searchButton: this.config.searchButton,
            // Extra
            onConfirm: onFileSelect
        };
        // Set initial dir
        this.currentDir = this.config.initDir || this.config.base || '';
        //TODO: need code refactor
        this.gfileListOptions = {
            // Base
            repoType: this.config.repoType || 'git',
            repo: this.config.repo || '$tnt',
            // dir: this.config.dir || '',
            base: this.config.base || '',
            multipleSelect: this.config.multipleSelect,
            downloadButton: this.config.downloadButton,
            refreshButton: this.config.refreshButton,
            searchButton: this.config.searchButton,
            // Different from dialog config
            preSelected: convertModelFiles(that.theModel, false),
            // Extra
            useSelector: true,
            showActions: true,
            onFileSelect: onFileSelect
        };
        this.removeFile = removeFile;
        this.openSelectorDialog = openSelectorDialog;
        this.groups = !angular.isArray(that.theModel) ? that.theModel.groups : [];
        this.fileList = [];
        this.lines = [];
        this.sortableOptions;
        this.selectedTaskNodes = [];
        this.intervals = [];
        this.addServerGroup = addServerGroup;
        this.removeServerGroup = removeServerGroup;
        this.openTextModal = openTextModal;
        // this.openTextInput = openTextInput;
        if (isDialogMode) {
            var files = convertModelFiles(this.theModel, false);
            var fileNames = [];
            files.forEach(function (value) {
                fileNames.push(value.path);
            });
            gfileService.checkFileExist("$tnt", fileNames).then(function (result) {
                that.fileStatusMap = result;
            }).catch(function (err) {
                throw new Error('Can not get file status, beacuse ' + err)
            });
            buildSelectedFileList(files);
            $scope.$watch('$ctrl.fileList', function (newVal, oldVal) {
                if (newVal === oldVal) return;
                var keys = Object.keys(that.modelConverter);
                if (keys.indexOf("groups") > 0) {
                    that.theModel.scripts = convertModelFiles(newVal, true);
                    that.theModel.groups = that.groups;
                } else {
                    that.theModel = convertModelFiles(newVal, true);
                }
            }, true);
        }

        function onFileSelect(selectedFiles) {
            if (isDialogMode) {
                buildSelectedFileList(selectedFiles);
            } else {
                var keys = Object.keys(that.modelConverter);
                if (keys.indexOf("groups") > 0) {
                    that.theModel.scripts = convertModelFiles(selectedFiles, true);
                    that.theModel.groups = that.groups;
                } else {
                    that.theModel = convertModelFiles(selectedFiles, true);

                }
            }
        }

        /**
         * modelType  | converterType        | multiple  | modelValue
         * --------------------------------------------------------
         * string     | singleattr(path/id)  | false     | "path"
         * string     | singleattr(path/id)  | true      | "path1,path2"
         * array      | singleattr(path/id)  | true      | ["path1","path2"]
         * array      | attrmap              | true      | [{location:path2},{location:path2}]
         * object     | attrmap              | false     | {location:path2}
         *
         * @param converter
         * @param values
         * @returns {boolean}
         */
        function validateConverter(converter, values, fileToModel) {
            var isMultiple = that.config.multipleSelect;
            var modelType = converter.modelType;
            var converterType = converter.type;
            if (converterType !== 'singleattr' && converterType !== 'attrmap') {
                throw new Error('Only support "singleattr" or "attrmap" converter. The converter type is: ' + converterType);
            }
            if (modelType === 'string') {
                if (converterType !== 'singleattr') {
                    throw new Error('String type model only supports "singleattr" converter. The converter type is: ' + converterType);
                } else if (!angular.isString(values)) {
                    throw new Error('String type model with non-string values: ' + JSON.stringify(values));
                }
            } else if (modelType === 'array') {
                if (!angular.isArray(values)) {
                    throw new Error('Array type model with non-array values: ' + JSON.stringify(values));
                }
            } else if (modelType === 'object') {
                if (!angular.isObject(values) || angular.isArray(values)) {
                    throw new Error('Object type model with non-object values: ' + JSON.stringify(values));
                }
            }
        }

        /**
         * Convert between outer model files and inner files
         * @param {[]} values Model files or selected files
         * @param {boolean} fileToModel false from model to file, true from file to model
         * @returns {[]|*}
         */
        function convertModelFiles(values, fileToModel) {
            var delimiter = '|';
            var modelConverter = that.modelConverter;
            // console.log('convertModelFiles', fileToModel, JSON.stringify(values), modelConverter);
            if (_.isEmpty(values) || !modelConverter) {
                return values;
            }
            if (!fileToModel) {
                try {
                    validateConverter(modelConverter, values, fileToModel);
                } catch (err) {
                    throw new Error('Invalid converter \'' + JSON.stringify(modelConverter) + '\': ' + err.message);
                }
            }
            var valueArray = values;
            var fileArray = [];
            // If file to model, incoming values is always array
            // If model to file, incoming values may be array, object, or string
            if (!fileToModel) {
                // Convert values to array
                if (modelConverter.modelType === 'string') {
                    if (angular.isString(values)) {
                        valueArray = values.split(delimiter);
                    } else if (!angular.isArray(values)) {
                        valueArray = [values];
                    }
                } else if (modelConverter.modelType === 'object') {
                    valueArray = [values];
                } else if (modelConverter.modelType === 'map') {
                    if (!angular.isArray(values)) {
                        valueArray = values.scripts;
                    } else {
                        valueArray = values;
                    }
                }
            }
            var converterType = modelConverter.type;
            if (converterType === 'attrmap') {
                var attrsMap = modelConverter['attrmap'];
                var modelAttrs = Object.keys(attrsMap);
                valueArray.forEach(function (file) {
                    //scripts group
                    var converted = {};
                    fileArray.push(converted);
                    modelAttrs.forEach(function (modelAttr) {
                        var fileAttr = attrsMap[modelAttr];
                        converted[fileToModel ? modelAttr : fileAttr] = file[fileToModel ? fileAttr : modelAttr];
                    });
                });
            } else if (converterType === 'singleattr') {
                var attr = modelConverter['singleattr'];
                // modelType is string
                // console.log('values', values, fileToModel);
                // if (!fileToModel) {
                //     values = values.split(delimiter);
                // }
                valueArray.forEach(function (file) {
                    var converted;
                    if (fileToModel) {
                        converted = file[attr];
                    } else {
                        converted = {};
                        converted[attr] = file;
                    }
                    fileArray.push(converted);
                });
            }


            // console.log('fileArray', fileArray, fileToModel);
            if (fileToModel) {
                if (modelConverter.modelType === 'string') {
                    // console.log('fileArray', fileArray.join(delimiter));
                    return fileArray.join(delimiter);
                } else if (modelConverter.modelType === 'object') {
                    return fileArray[0];
                }
            }

            return fileArray;
        }

        /**
         * @param {[{id:string,path:string,name:string,config:string}]} files
         */
        function buildSelectedFileList(files) {
            that.fileList = files;
        }

        function openSelectorDialog() {
            fileDialogConfig.preSelected = convertModelFiles(that.theModel, false);
            // if (that.theModel.scripts) {
            //     fileDialogConfig.preSelected = convertModelFiles(that.theModel.scripts, false);
            // } else {
            //     fileDialogConfig.preSelected = convertModelFiles(that.theModel, false);
            // }

            // console.log('openSelectorDialog',JSON.stringify(fileDialogConfig));
            gfsActionHelper.openFileSelector($scope, fileDialogConfig);
        }

        function removeFile(index) {
            that.fileList.splice(index, 1);
        }


        function addServerGroup() {
            var file_groups = that.groups;
            if (!file_groups) {
                that.groups = [];
            }
            that.groups.push({"group": "", "group_vars": ""});
        }


        function removeServerGroup(group_index) {
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('common.messages.operation.body', {
                    operation: $translate.instant('common.entity.action.delete'),
                    obj: $translate.instant('jao.job.process.server_group')
                }),
                function () {
                    that.groups.splice(group_index, 1);
                });
        }


        function openTextModal(param, group_index, param_type) {
            var title;
            if (param_type === "group_vars") {
                title = "Group Vars";
            } else if (param_type === "host_vars") {
                title = "Host Vars";
            }
            var modal = modalHelper.openModal({
                    template: '<div class="modal-body">' +
                        '<div class="modal-header"><h4 class="modal-title">'+ title +'</h4></div>' +
                        '<div class="modal-body" style="height:20rem;">' +
                        '<textarea class="form-control h-100 ng-valid ng-dirty ng-valid-parse ng-empty ng-touched" ng-model="$ctrl.modelConfig" rows="20" aria-invalid="false" style=""></textarea>' +
                        '    </div>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button class="btn btn-primary opx-btn-ok" ng-click="$ctrl.confirm()">确认</button>' +
                        '<button class="btn btn-default opx-btn-cancel" ng-click="$ctrl.close()">取消</button>' +
                        '</div>',
                    controller: ['$scope', function () {
                        this.modelConfig = param;
                        this.close = function () {
                            modal.dismiss();
                        };
                        this.confirm = function confirm() {
                            modal.close(this.modelConfig);
                        };
                    }],
                    controllerAs: '$ctrl'
                }, {
                    resizable: true, onOk: function (modelConfig) {
                        if (param_type === "group_vars") {
                            that.groups[group_index].group_vars = modelConfig;
                        } else if (param_type === "host_vars") {
                            that.groups[group_index].host_vars = modelConfig;
                        }
                    }
                }
            );
        }
    }
})
();