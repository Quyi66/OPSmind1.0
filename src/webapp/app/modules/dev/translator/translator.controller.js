/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2022/01/04
 */

(function () {
        'use strict';


        angular.module('oplus.dev').controller('DevTranslatorCtrl', DevTranslatorCtrl);

        DevTranslatorCtrl.$inject = ['$scope', '$q', '$state', 'restUtils', 'translatorService', 'modalHelper', 'messageService'];

        /**
         *
         * @param $scope
         * @param $q
         * @param $state
         * @param {restUtils} restUtils
         * @param {translatorService} translatorService
         * @param {modalHelper} modalHelper
         * @param {messageService} messageService
         * @constructor
         */
        function DevTranslatorCtrl($scope, $q, $state, restUtils, translatorService, modalHelper, messageService) {
            var that = this;
            var forceReload;

            this.langs = [
                {code: 'zh-cn', title: '中文简体', primary: true},
                {code: 'zh-tw', title: '中文正體'},
                {code: 'en', title: 'English'},
                // {code: 'fr', title: 'French'},
            ];

            this.persistenceData = []

            this.visibleCols = []

            var ALL_MODULES = { key: 'ALL', count: 0 };
            this.modules = [ALL_MODULES];
            this.selectedModule = ALL_MODULES.key;
            this.searchModuleTxt = '';

            this.$onInit = onInit;
            this.clickFileRef = clickFileRef;
            this.editTranslation = editTranslation;
            this.reloadExternal = reloadExternal;
            this.saveAll = saveAll;
            this.selectModule = selectModule;
            this.changeColVisibility = changeColVisibility;
            this.onCopySuccess = onCopySuccess;
            this.remove = remove;

            function saveAll() {
                var data = [];
                that.persistenceData.forEach(function (item) {
                    data.push({key: item.code, trans: item.trans});
                });
                translatorService.saveAllTrans(data).then(function (result) {
                    var html = '<ul>' +
                        '<li>Languages: ' + result.langs.join(', ') + '</li>' +
                        '<li>Files: ' + result.fileCount + '</li>' +
                        '<li>Keys: ' + result.keyCount + '</li>' +
                        '</ul>';
                    messageService.toast('success', 'Success', JSON.stringify(result));
                }).catch(function (err) {
                    messageService.toast('error', 'Error', err.message);
                });
            }

            function reloadExternal(needConfirm) {
                if (needConfirm) {
                    messageService.confirm('Confirm Reload', 'Reload data will lose any unsaved change. Are you sure?', function ok() {
                        doReload();
                    });
                }
                else doReload()

                function doReload() {
                    forceReload = true;
                    that.tableConfig.reloadData();
                    console.log('reloadExternal: call done');
                }
            }

            function onInit() {
                loadData();

                var columns = [
                    {
                        title: 'Copy',
                        render: function (data, type, row, meta) {
                            return '<button class="btn btn-default" ngclipboard ngclipboard-success="$ctrl.onCopySuccess();" ' +
                                    'data-clipboard-text="' + row.key + '"> <i class="fa fa-copy"></i> Copy </button> ';
                        }
                    },
                    {
                        title: 'Key',
                        data: 'key',
                        render: function (data, type, row, meta) {
                            if (!data) {
                                return '';
                            }
                            var html = `<a class="text-primary" ng-click="$ctrl.editTranslation('${data}')">${data}</a>`;
                            return html;
                        }
                    }];
                that.langs.forEach(function (lang) {
                    lang.colIndex = columns.push({
                        title: lang.title,
                        data: 'trans.' + lang.code,
                        visible: lang.primary || false,
                        width: '30%',
                        render: function (data, type, row, meta) {
                            return data;
                        }
                    }) - 1;
                });
                columns = columns.concat([
                    {
                        title: '文件引用',
                        data: 'refs',
                        render: function (data, type, row, meta) {
                            var count = _.filter(data, function (o) { return o.refererType === 'file'}).length;
                            if (count === 0) return '';
                            var html = '<span class="badge badge-primary badge-pill" ng-click="$ctrl.clickFileRef(\'' + row.key + '\')">' + count + '</span>';
                            return html;
                        }
                    },
                    {
                        title: '数据库引用', data: 'refs',
                        render: function (data, type, row, meta) {
                            var count = _.filter(data, function (o) { return o.refererType !== 'file'}).length;
                            if (count === 0) return '';
                            var html = '<span class="badge badge-primary badge-pill" ng-click="$ctrl.clickFileRef(\'' + row.key + '\')">' + count + '</span>';
                            return html;
                        }
                    },
                    {
                        title: 'Action',
                        render: function (data, type, row, meta) {
                            var renameBtn = `<button type="button" class="btn btn-warning me-2" ng-click="$ctrl.editTranslation('${row.key}', false, true)">` +
                                                '<i class="fa fa-eraser"></i> Rename </button>'
                            var removeBtn = `<button type="button" class="btn btn-danger me-2" ng-click="$ctrl.remove('${row.key}')">` +
                                                '<i class="fa fa-trash-alt"></i> Remove </button>'
                            return `${_.filter(row.refs, function (o) { return o.refererType !== 'file'}).length > 0 ? '' : renameBtn}${Object.values(row.refs).length > 0 ? '' : removeBtn}`;
                        }
                    }
                ]);
                this.tableConfig = {
                    // selection: {labelData: 'key', valueData: 'key'},
                    data: loadData,
                    columns: columns,
                    buttons: ['reload']
                };
            }

            function editTranslation(transKey, isAdd, isRename) {
                // console.log('editTranslation: key=%o,rowId=%o', transKey, rowId);
                var rawData = _.find(that.persistenceData, { key: transKey }) || {key: undefined, trans: {}, refs: []};
                var modalInstance = modalHelper.openModal({
                    templateUrl: 'app/modules/dev/translator/edit-row-modal.html',
                    controller: ['onCopySuccess', '$scope', function (onCopySuccess, $scope) {
                        var self = this;
                        this.onCopySuccess = onCopySuccess;
                        this.scope = $scope;
                        this.langs = that.langs;
                        this.isAdd = isAdd || false;
                        this.isRename = isRename || false;
                        this.editData = angular.copy(rawData);
                        this.isLoading = false;
                        this.primaryLang = _.find(self.langs, function (f) { return f.primary })
                        this.validation = {
                            valid: false,
                            error: {}
                        }
                        this.cancel = function () {
                            modalInstance.dismiss();
                        };

                        this.scope.$watch('$ctrl.editData.key', function (n, o) {
                            if (!n) return;
                            if (!(self.isAdd || self.isRename)) {
                                self.validation.valid = true;
                                return;
                            }

                            checkKeyCompliant();
                            checkKeyDuplicate();
                            if (self.isRename) checkPrimaryLangDuplicate(rawData);

                            function checkKeyCompliant() {
                                self.validation.error['pattern'] = !/\.[a-zA-Z_]+/g.test(n) || n.endsWith('.');
                            }

                            function checkKeyDuplicate() {
                                var findTrans = _.find(that.persistenceData, function (f) { return f.key === n });
                                var findPrefixTrans = _.find(that.persistenceData, function (f) { return f.key.startsWith(n) });
                                if (!self.isRename) self.validation.error['duplicated'] = !!findTrans;
                                else {
                                    self.validation.error['duplicated'] = (n === rawData.key || (findTrans ? findTrans.trans[self.primaryLang.code] !== rawData.trans[self.primaryLang.code] : false));
                                    self.validation.merge = (findTrans ? findTrans.trans[self.primaryLang.code] === rawData.trans[self.primaryLang.code] : false);
                                }
                                
                                self.validation.valid = _.every(self.validation.error, e => !e);
                            }
                        }, true);


                        this.scope.$watch('$ctrl.editData.trans[$ctrl.primaryLang.code]', function (n, o) {
                            checkPrimaryLangDuplicate(self.editData);
                        })

                        function checkPrimaryLangDuplicate(data) {
                            self.validation.duplicatedTrans = _.filter(that.persistenceData, function (f) { return f.trans[self.primaryLang.code] === data.trans[self.primaryLang.code] });
                            self.validation.duplicatedTrans = self.validation.duplicatedTrans.map(m => {
                                return Object.assign(m, {
                                    fileRefCount: m.refs.filter(f => f.type === 'file').length,
                                    dbRefCount: m.refs.filter(f => f.type !== 'file').length,
                                })
                            })
                        }

                        this.save = function () {
                            self.isLoading = true;
                            if (self.isRename) {
                                translatorService.rename(rawData.key, self.editData.key).then(function (res) {
                                    messageService.alertSuccess('Success', res);
                                    // _.remove(that.persistenceData, function(item) { return item.key === rawData.key });
                                    // that.persistenceData.unshift(self.editData);
                                    that.reloadExternal(false);
                                    // that.tableConfig.reloadData();
                                    modalInstance.close(self.editData);
                                }).catch(function (e) {
                                    messageService.alertError('Error', e);
                                }).finally(function () {
                                    self.isLoading = false;
                                })
                            }
                            else {
                                translatorService.save(self.editData).then(function (res) {
                                    messageService.alertSuccess('Success', res);
                                    if (!transKey) that.persistenceData.unshift(self.editData);
                                    else _.merge(that.persistenceData, [self.editData]);
                                    that.tableConfig.reloadData();
                                    modalInstance.close(self.editData);
                                }).catch(function (e) {
                                    messageService.alertError('Error', e);
                                }).finally(function () {
                                    self.isLoading = false;
                                })
                            }
                            
                        }

                        this.merge = function () {
                            translatorService.merge(rawData.key, self.editData.key).then(function (res) {
                                messageService.alertSuccess('Success', res);
                                that.reloadExternal(false);
                                modalInstance.close(self.editData);
                            }).catch(function (e) {
                                messageService.alertError('Error', e);
                            }).finally(function () {
                                self.isLoading = false;
                            })
                        }

                        this.translate = function () {
                            if (!self.editData.trans[self.primaryLang.code]) {
                                messageService.toast('error', 'No Content');
                                return;
                            }

                            var needTranslateArr = _.filter(self.langs, function (f) {return !f.primary});
                            needTranslateArr.forEach(function (item) {
                                translatorService.translate(self.editData.trans[self.primaryLang.code], item.code).then(function (res) {
                                    self.editData.trans[item.code] = res;
                                })
                            })
                        }
                    }],
                    controllerAs: '$ctrl',
                    resolve: {
                        onCopySuccess: function () {
                            return onCopySuccess;
                        }
                    }
                });
            }

            function clickFileRef(key) {
                var keyRefs = _.find(that.persistenceData, function (o) {
                    return o.key === key;
                });
                var modalInstance = modalHelper.openModal({
                    template: '<div class="modal-header">' +
                        '<h4 class="modal-title">{{$ctrl.keyRefs.key}}</h4>' +
                        '<button class="btn-close" ng-click="$ctrl.close()"></button> ' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<table class="table opx-table">' +
                        '<thead>' +
                        '<tr>' +
                        '<th>Type</th>' +
                        '<th>Referer</th>' +
                        '<th>Count</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr ng-repeat="ref in $ctrl.keyRefs.refs">' +
                        '<td>{{ref.refererType}}</td>' +
                        '<td>{{ref.referer}}</td>' +
                        '<td>{{ref.count}}</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>',
                    resolve: {
                        keyRefs: function () {
                            return keyRefs;
                        }
                    },
                    controller: ['keyRefs', function (keyRefs) {
                        this.keyRefs = keyRefs;
                        this.close = function () {
                            modalInstance.dismiss();
                        }
                    }],
                    controllerAs: '$ctrl'
                }, {resizable: !true});
            }

            function loadData() {
                var d = $q.defer();
                console.log('loadData: forceReload=%o', forceReload);
                if (forceReload === true || that.persistenceData.length === 0) {
                    messageService.toast('primary', 'Data Loading...')
                    var promise = translatorService.listAllTrans(forceReload);
                    forceReload = false;
                    promise.then(function (data) {
                        that.persistenceData = data;
                        ALL_MODULES.count = data.length;
                        var moduleKeys = _.filter(_.uniq(_.map(data, function (m) { return m.key.substr(0, m.key.indexOf('.')) })), f => f)
                        that.modules = _.concat(ALL_MODULES, _.map(moduleKeys, function (m) {
                            return {
                                key: m,
                                count: filterData(m).length
                            }
                        }));
                        // that.selectedModule = that.modules && that.modules.length > 0 ? that.modules[0] : '';
                        d.resolve(filterData(that.selectedModule));
                        messageService.toast('success', 'Data Load Completed')
                    }).catch(function (err) {
                        d.reject(err);
                    }).finally(function () {
                        forceReload = false;
                    });
                } else {
                    ALL_MODULES.count = that.persistenceData.length;
                        var moduleKeys = _.filter(_.uniq(_.map(that.persistenceData, function (m) { return m.key.substr(0, m.key.indexOf('.')) })), f => f)
                    that.modules = _.concat(ALL_MODULES, _.map(moduleKeys, function (m) {
                        return {
                            key: m,
                            count: filterData(m).length
                        }
                    }));
                    d.resolve(filterData(that.selectedModule));
                }
                return d.promise;

                function filterData(prefix) {
                    var tmpData = _.cloneDeep(that.persistenceData);
                    if (prefix === ALL_MODULES.key) return tmpData;
                    return _.filter(tmpData, function (f) { return f.key.startsWith(prefix) })
                }
            }

            function selectModule(module) {
                that.selectedModule = module;
                that.tableConfig.reloadData();
                that.tableConfig.getTableApi().page(0)
            }

            function changeColVisibility(lang) {
                lang.visibility = !lang.visibility;
                that.tableConfig.getTableApi().column(lang.colIndex).visible(lang.visibility);
            }

            function onCopySuccess() {
                messageService.toast('success', 'Copy Successfully!')
            }

            function remove(key) {
                messageService.confirmDanger('Info', 'Are you sure you want to remove the key?', function () {
                    translatorService.remove(key).then(function (res) {
                        messageService.alertSuccess('Success', res);
                        _.remove(that.persistenceData, function(item) { return item.key === key });
                        that.tableConfig.reloadData();
                    }).catch(function (e) {
                        messageService.alertError('Error', e);
                    }).finally(function () {
                        self.isLoading = false;
                    })
                })
            }
        }
    }
)();
