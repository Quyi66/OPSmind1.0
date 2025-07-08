/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-01-03
 */
(function () {
    'use strict';
    angular.module('oplus.gfs').controller('GfileEditCtrl', GfileEditCtrl);

    GfileEditCtrl.$inject = ['$scope', '$state', '$q', 'gfileService', 'config', 'messageService', '$timeout', '$translate', 'modalHelper'];

    /**
     *
     * @param $scope
     * @param $state
     * @param {gfileService} gfileService
     * @param {object} config
     * @param messageService
     * @param $timeout
     * @param $translate
     * @param modalHelper
     * @param {string=} config.path For update file
     * @param {string=} config.repoType
     * @param {string=} config.repo For new file
     * @param {string=} config.dir For new file
     * @param {function=} config.success Callback when edit succeeds
     * @param {function=} config.cancel Callback when edit canceled
     * @constructor
     */
    function GfileEditCtrl($scope, $state, $q, gfileService, config, messageService, $timeout, $translate, modalHelper) {
        var that = this;
        //render code mirror when show content tab
        this.isShowFileContent = false;
        this.isFileContentEditable = false;
        this.isEditFileContent = false;
        this.repoType = config.repoType;
        this.repo = config.repo;
        this.ngf = {
            pattern: '', maxSize: config.repoType === 'git' ? '100MB' : '1024MB'
        };
        this.isSaving = false;
        this.close = close;
        this.cancel = cancel;
        this.saveClose = saveClose;
        this.fixJGit = fixJGit;
        this.resetJGit = resetJGit;
        this.refreshJGit = refreshJGit;
        this.saveSettingsClose = saveSettingsClose;
        this.resetSettingClose = resetSettingClose;
        this.saveSyncClose = saveSyncClose;
        this.saveDirClose = saveDirClose;
        this.showFileContent = showFileContent;
        this.editFileContent = editFileContent;
        this.delExternalRepo = delExternalRepo;
        this.openRepoSettings = openRepoSettings;
        this.deleteModels = deleteModels;
        this.goRepo = goRepo;
        that.selectedModels = []

        loadFile(config);

        var columnDefs = [{
            data: 'repoUrl', title: $translate.instant('gfs.git.type'), render: function (data, type, row, meta) {
                var repoName = "'" + row.repoName + "'";
                if (row.id) {
                    return '<p ng-click="$ctrl.goRepo(' + repoName + ')" class="badge badge-pill badge-info" ><i class="fa fab fa-gitlab">' + " " + $translate.instant('gfs.git.external_repo') + '</i></p>'
                } else {
                    return '<p ng-click="$ctrl.goRepo(' + "" + ')" class="badge badge-pill badge-secondary"><i class="fa fa-code-branch">' + " " + $translate.instant('gfs.git.built_repo') + '</i></p>'
                }
            }
        }, {
            data: 'repoName', title: $translate.instant('gfs.git.repo_name')
        }, {
            data: 'repoUrl', title: $translate.instant('gfs.git.repo_url')
        }, {
            data: 'updatedBy', title: $translate.instant('common.entity.detail.update_by')
        }, {
            data: 'updatedAt',
            title: $translate.instant('common.entity.detail.update_at'),
            render: function (data, type, row, meta) {
                var date = row.updatedAt;
                if (date) {
                    return $$.formatDate(date, 'YYYY-MM-DD hh:mm:ss');
                } else {
                    return $$.formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss');
                }
            }
        }, {
            data: 'id',
            title: $translate.instant('common.entity.detail.operation'),
            className: 'text-center',
            searchable: false,
            orderable: false,
            render: function (data, type, row, meta) {
                var id = "'" + row.id + "'";
                var repoName = "'" + row.repoName + "'";
                var isExternalRepo = "disabled=" + row.externalRepo + "";
                if (row.externalRepo) {
                    isExternalRepo = "";
                }
                // var repoClass = "'{" + "}'";
                // if (!row.externalRepo) {
                //     repoClass = "'{" + "disabled" + ":" + "disabled" + "}'";
                // }
                // console.log(repoClass)
                return ' <button ' + isExternalRepo + ' type="submit" ng-click="$ctrl.openRepoSettings(' + id + ')" class="btn btn-default opx-btn-icon opx-btn-flat" uaa-has-permission="gfs:edit:*" title="{{\'common.entity.action.edit\' | translate}}">' + '     <i class="fa fa-pencil"></i>' + ' </button>' + ' <button ' + isExternalRepo + ' type="submit" ng-click="$ctrl.delExternalRepo(' + repoName + ')" class="btn btn-default opx-btn-icon opx-btn-flat" uaa-has-permission="gfs:edit:*" title="{{\'common.entity.action.delete\' | translate}}">' + '     <i class="fa fa-trash-alt"></i>' + ' </button>';
            }
        }];

        that.tableConfig = {
            columns: columnDefs, data: [externalRepos], selection: {
                valueData: 'id', labelData: 'repoName', preselected: that.selectedModels, stateFn: function (row) {
                    return row.repoUrl.indexOf('.git') > -1 ? '' : 'disabled';
                }
            }, order: [[4, 'desc']], buttons: ['reload']
        };

        function goRepo(dir) {
            cancel();
            $state.go('app.gfs.git_repo_dir', {repo: that.repo, dir: dir});
        }

        function externalRepos() {
            return gfileService.loadCurrentRepo(that.repoType, that.repo);
        }

        function delExternalRepo(repoName) {
            messageService.confirmDanger($translate.instant("gfs.list.delete_sure"), $translate.instant("gfs.git.delete_confirm_reponame", {repoName: repoName}), function () {
                gfileService.delExternalRepo(that.repoType, that.repo, repoName).then(function (data) {
                    if (data.result === "success") {
                        refreshRepo();
                    }
                }).catch(function (err) {
                    messageService.error(err);
                });
            })
        }

        function deleteModels() {
            messageService.confirmDanger($translate.instant("gfs.list.delete_sure"), $translate.instant("gfs.git.delete_confirm_select", {count: that.selectedModels.length}), function () {
                gfileService.delBatchExternalRepo(that.repoType, that.repo, that.selectedModels).then(function (data) {
                    if (data.result === "success") {
                        refreshRepo();
                        messageService.toast("success", $translate.instant('gfs.git.delete_success'));
                    } else {
                        messageService.toast("warn", $translate.instant('gfs.git.delete_fail'));
                    }
                }).catch(function (err) {
                    messageService.error(err);
                });
            });
        }

        function openRepoSettings(id) {
            var config = {repoType: that.repoType, repo: that.repo, id: id};
            var modal = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-repo-settings.html',
                controllerAs: '$ctrl',
                controller: 'GfileEditCtrl',
                backdrop: 'static',
                resolve: {
                    config: function () {
                        var cfg = {
                            cancel: function () {
                                modal.dismiss();
                            }, success: function (data) {
                                modal.close(data);
                            }
                        };
                        cfg.repoType = config.repoType;
                        cfg.repo = config.repo;
                        cfg.id = config.id;
                        return cfg;
                    }
                }
            });
            cancel();
            modal.result.then(function close(result) {
                config.callback && config.callback(result);
            }, function dismiss() {
            });
        }

        function loadFile(config) {
            var id = config.id;
            if (id) {
                gfileService.loadCurrentRepo(that.repoType, that.repo).then(function (data) {
                    that.repoList = data;
                    that.repoList.forEach(function (item) {
                        if (item.id === id) {
                            that.externalRepo = item;
                            that.externalRepo.jobInterval = parseInt(that.externalRepo.jobInterval) || 10;
                            that.externalRepo.canEdit = false;
                        }
                    })
                });
            } else {
                that.externalRepo = {authType: 'https', jobInterval: 10, repoName: '', canEdit: true};
            }
            that.path = config.path;
            that.isNew = !config.path;
            that.fileInfo = {dir: config.dir, syncMode: ''};
            that.isShowFileContent = false;
            that.isEdit = config.isEdit;
            that.dirInfo = {name: config.name, desc: config.desc}
            that.jgitInfo = "";

            if (config.repair) {
                gfileService.jgitInfo(that.repoType, that.repo).then(function (data) {
                    that.jgitInfo = JSON.stringify(data, null, 4);
                });
            }

            if (config.path && config.isFile) {
                gfileService.getFileInfo(that.repoType, that.repo, that.path, true).then(function (data) {
                    that.fileInfo = data;
                    that.isFileContentEditable = gfileService.isFileContentEditable(that.fileInfo.fileContent.mime)
                    // var filename = that.fileInfo.file.name;
                    // that.fileInfo._ext = filename.split('.').pop().toLowerCase();
                }).catch(function (err) {
                    throw err;
                })
            }

            if (that.isNew) {
                // TODO 压缩文件不支持批量解压上传，待优化
                $scope.$watch('$ctrl.fileInfo.file[0].name', function (newVal, oldVal) {
                    that.isZipFile = false;
                    if ((newVal === oldVal || !newVal) || (that.fileInfo.file && that.fileInfo.file.length > 1)) return;
                    that.isZipFile = _.endsWith(newVal, '.zip');
                });
            }
        }

        function showFileContent() {
            console.log('showFileContent', that.isShowFileContent);
            $timeout(function () {
                that.isShowFileContent = true;
            });
        }

        function editFileContent() {
            if (!that.isEditFileContent) {
                that.isEditFileContent = true;
            }

            if (that.isShowFileContent) {
                that.isShowFileContent = false;

                $timeout(function () {
                    that.isShowFileContent = true;
                });
            }
        }

        function cancel() {
            config.cancel && config.cancel();
        }

        function close() {
            config.cancel && config.cancel();
        }

        function saveClose() {
            that.isSaving = true;
            if (that.isNew) {
                if (!that.fileInfo.file) {
                    gfileService.createFile(that.repoType, that.repo, that.fileInfo, function (progress) {
                        that.progress = progress;
                    }).then(function (data) {
                        that.isSaving = false;
                        config.success && config.success(data);
                        // messageService.toast('success', '操作成功');
                    }).catch(function (err) {
                        that.isSaving = false;
                        throw new FatalError(err);
                    });
                } else {
                    var allPromises = [];
                    angular.forEach(that.fileInfo.file, function (f) {
                        var fileInfoCopy = angular.copy(that.fileInfo);
                        fileInfoCopy.file = f;
                        var promise = gfileService.createFile(that.repoType, that.repo, fileInfoCopy, function (progress) {
                            f.progress = progress;
                        }).then(function (data) {
                            config.success && config.success(data);
                            return data;
                        }).catch(function (err) {
                            throw new FatalError(err);
                        }).finally(function () {
                            if (allPromises.length === that.fileInfo.file.length) {
                                that.isSaving = false;
                            }
                        });
                        allPromises.push(promise);
                    });

                    that.isSaving = true;

                    return $q.all(allPromises).then(function (results) {
                        return results;
                    }).catch(function (error) {
                        throw error;
                    });
                }
            } else {
                that.fileInfo.isContent = that.isEditFileContent;
                if (that.isEditFileContent) {
                    that.fileInfo.scriptContent = that.fileInfo.fileContent.content;
                }
                gfileService.updateFileInfo(that.repoType, that.repo, that.path, that.fileInfo).then(function (data) {
                    // messageService.toast('success', '操作成功');
                    that.isSaving = false;
                    config.success && config.success(data);
                }).catch(function (err) {
                    that.isSaving = false;
                    throw err;
                });
            }
        }

        function fixJGit() {
            gfileService.repair(that.repoType, that.repo).then(function (data) {
                if (data) {
                    messageService.toast('success', $translate.instant("gfs.basic.repair.success"));
                    gfileService.jgitInfo(that.repoType, that.repo).then(function (data) {
                        that.jgitInfo = JSON.stringify(data, null, 4);
                    });
                } else {
                    messageService.toast('error', $translate.instant("gfs.basic.repair.failed"));
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("gfs.basic.repair.failed") + err);
            });
        }

        function resetJGit() {
            gfileService.resetJgit(that.repoType, that.repo).then(function (data) {
                if (data) {
                    gfileService.jgitInfo(that.repoType, that.repo).then(function (data) {
                        that.jgitInfo = JSON.stringify(data, null, 4);
                    });
                    messageService.toast('success', $translate.instant("gfs.modal.jgit_reset_success"));
                } else {
                    messageService.toast('error', $translate.instant("gfs.modal.jgit_reset_failed"));
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("gfs.modal.jgit_reset_failed") + err);
            });
        }

        function refreshJGit() {
            gfileService.jgitInfo(that.repoType, that.repo).then(function (data) {
                if (data) {
                    that.jgitInfo = JSON.stringify(data, null, 4);
                    messageService.toast('success', $translate.instant("gfs.basic.refresh.success"));
                } else {
                    messageService.toast('error', $translate.instant("gfs.basic.refresh.failed"));
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("gfs.basic.refresh.failed") + err);
            });
        }

        function saveSettingsClose() {
            if (!that.externalRepo.jobInterval) {
                that.externalRepo.jobInterval = 10;
            }
            messageService.confirmDanger($translate.instant("gfs.settings.init_repo_confirm"), $translate.instant("gfs.settings.init_repo_confirm_info", {repoUrl: that.externalRepo.repoUrl}), function () {
                gfileService.initGitRepo(that.repo, that.externalRepo).then(function (data) {
                    that.isSaving = false;
                    config.success && config.success(data);
                    refreshState();
                    messageService.toast('success', $translate.instant('gfs.settings.init_repo_success'));
                }).catch(function (err) {
                    that.isSaving = false;
                    // throw err;
                    messageService.toast('error', $translate.instant('gfs.settings.init_repo_error') + ":" + err);
                });
            })
        }

        function resetSettingClose() {
            that.externalRepo = {"enableExternal": false}
            messageService.confirmDanger($translate.instant("gfs.settings.reset_repo_confirm"), $translate.instant("gfs.settings.reset_repo_confirm_info"), function () {
                gfileService.initGitRepo(that.repo, that.externalRepo).then(function (data) {
                    that.isSaving = false;
                    config.success && config.success(data);
                    refreshState();
                    messageService.toast('success', $translate.instant('gfs.settings.reset_repo_success'));
                }).catch(function (err) {
                    that.isSaving = false;
                    // throw err;
                    messageService.toast('error', $translate.instant('gfs.settings.reset_repo_error') + ":" + err);
                });
            })
        }

        function refreshRepo() {
            $timeout(function () {
                that.tableConfig.reloadData();
            }, 1000);
        }

        function refreshState() {
            $timeout(function () {
                $state.reload();
            }, 1000);
        }

        function saveDirClose() {
            if (that.isEdit) {
                gfileService.addFolder(config, that.folderName, that.folderDesc).then(function (progress) {
                    that.progress = progress;
                }).then(function (data) {
                    config.success && config.success(data);
                    // messageService.toast('success', '操作成功');
                }).catch(function (err) {
                    throw new FatalError(err);
                });
            } else {
                gfileService.editFolder(config, that.dirInfo.name, that.dirInfo.desc).then(function (progress) {
                    that.progress = progress;
                }).then(function (data) {
                    config.success && config.success(data);
                    // messageService.toast('success', '操作成功');
                }).catch(function (err) {
                    throw new FatalError(err);
                });
            }
        }

        function saveSyncClose() {
            gfileService.syncFile(that.repoType, that.repo, that.fileInfo, function (progress) {
                that.progress = progress;
            }).then(function (data) {
                that.isSaving = false;
                config.success && config.success(data);
                // messageService.toast('success', '操作成功');
            }).catch(function (err) {
                that.isSaving = false;
                throw new FatalError(err);
            });
        }
    }
})();
