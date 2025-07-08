/**
 * @author Leo Liao (leoliaolei@gmail.com), 2020-02-28, extracted from gfs-action.directive.js
 */
(function () {
    'use strict';

    angular.module('oplus.gfs').service('gfsActionHelper', ['gfileService', '$translate', '$state', 'restUtils', 'messageService', 'modalHelper', 'dateTime', gfsActionHelper]);

    /**
     * @ngdoc service
     * @name gfsActionHelper
     * @description
     * A helper service to deal with UI related work. It intents to encapsulate the trivial code of handling modal.
     * @param {gfileService} gfileService
     * @param $translate
     * @param $state
     * @param {restUtils} restUtils
     * @param messageService
     * @param modalHelper
     * @param dateTime
     */
    function gfsActionHelper(gfileService, $translate, $state, restUtils, messageService, modalHelper, dateTime) {
        this.openFileSelector = openFileSelector;
        this.openFileEditor = openFileEditor;
        this.downloadFile = downloadFile;
        this.openFolderEditor = openFolderEditor;
        this.openFileOnlineEditor = openFileOnlineEditor;
        this.openSyncFileEditor = openSyncFileEditor;
        this.openRepairJgitEditor = openRepairJgitEditor;
        this.openRepoSettings = openRepoSettings;
        this.openRepoList = openRepoList;
        this.openTestRun = openTestRun;
        this.openApproveHistory = openApproveHistory;
        this.openAllApproveHistory = openAllApproveHistory;
        this.openApprove = openApprove;

        /**
         *
         * @param {object} config
         * @param isNew Whether to update the file
         * @param isFile Is it a file
         * @param {string=} config.id Mandatory for edit file
         * @param {string=} config.dir Optional for new file
         * @param {string=} config.repo Mandatory for new file
         * @param {string=} config.path File path relative to repo
         * @param {string} config.repoType
         * @param {function=} config.callback Callback when saved
         */
        function openFileEditor(config, isNew, isFile) {
            var modal = modalHelper.openModal({
                templateUrl: "app/modules/gfs/gfile-edit-modal.html",
                size: isNew ? 'md' : 'lg',
                controllerAs: '$ctrl',
                controller: 'GfileEditCtrl',
                backdrop: 'static',
                resolve: {
                    config: function () {
                        var cfg = {
                            cancel: function () {
                                modal.dismiss();
                            },
                            success: function (data) {
                                modal.close(data);
                            }
                        };
                        cfg.repoType = config.repoType;
                        cfg.repo = config.repo;
                        cfg.dir = config.dir;
                        cfg.path = config.path;
                        cfg.id = config.id;
                        cfg.isFile = isFile;
                        return cfg;
                    }
                }
            })
            // var modal = modalHelper.openModal({
            //     templateUrl: 'app/modules/gfs/gfile-edit-modal.html',
            //     size: isNew ? 'md' : 'lg',
            //     controllerAs: '$ctrl',
            //     controller: 'GfileEditCtrl',
            //     backdrop: 'static',
            //     resolve: {
            //         config: function () {
            //             var cfg = {
            //                 cancel: function () {
            //                     modal.dismiss();
            //                 },
            //                 success: function (data) {
            //                     modal.close(data);
            //                 }
            //             };
            //             cfg.repoType = config.repoType;
            //             cfg.repo = config.repo;
            //             cfg.dir = config.dir;
            //             cfg.path = config.path;
            //             cfg.id = config.id;
            //             cfg.isFile = isFile;
            //             return cfg;
            //         }
            //     }
            // });
            modal.result.then(function close(result) {
                messageService.toast('success', $translate.instant("gfs.common.operation_success"));
                config.callback && config.callback(result);
            }, function dismiss() {
            });
        }

        function openFileOnlineEditor(config, isNew, isFile) {
            var modal = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-add-file-modal.html',
                controllerAs: '$ctrl',
                controller: 'GfileEditCtrl',
                backdrop: 'static',
                resolve: {
                    config: function () {
                        var cfg = {
                            cancel: function () {
                                modal.dismiss();
                            },
                            success: function (data) {
                                modal.close(data);
                            }
                        };
                        cfg.scriptContent = config.scriptContent;
                        cfg.name = config.name;
                        cfg.repoType = config.repoType;
                        cfg.repo = config.repo;
                        cfg.dir = config.dir;
                        cfg.path = config.path;
                        cfg.id = config.id;
                        cfg.isFile = isFile;
                        return cfg;
                    }
                }
            });
            modal.result.then(function close(result) {
                config.callback && config.callback(result);
            }, function dismiss() {
            });
        }

        function openSyncFileEditor(config, isNew, isFile) {
            var modal = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-sync-file-modal.html',
                controllerAs: '$ctrl',
                controller: 'GfileEditCtrl',
                backdrop: 'static',
                resolve: {
                    config: function () {
                        var cfg = {
                            cancel: function () {
                                modal.dismiss();
                            },
                            success: function (data) {
                                modal.close(data);
                            }
                        };
                        cfg.scriptContent = config.scriptContent;
                        cfg.name = config.name;
                        cfg.repoType = config.repoType;
                        cfg.repo = config.repo;
                        cfg.dir = config.dir;
                        cfg.path = config.path;
                        cfg.id = config.id;
                        cfg.isFile = isFile;
                        return cfg;
                    }
                }
            });
            modal.result.then(function close(result) {
                config.callback && config.callback(result);
            }, function dismiss() {
            });
        }

        function openRepairJgitEditor(config){
            var modal = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-repair-jgit-modal.html',
                controllerAs: '$ctrl',
                controller: 'GfileEditCtrl',
                backdrop: 'static',
                resolve: {
                    config: function () {
                        var cfg = {
                            cancel: function () {
                                modal.dismiss();
                            },
                            success: function (data) {
                                modal.close(data);
                            }
                        };
                        cfg.repoType = config.repoType;
                        cfg.repo = config.repo;
                        cfg.dir = config.dir;
                        cfg.path = config.path;
                        cfg.repair = true;
                        return cfg;
                    }
                }
            });
            modal.result.then(function close(result) {
                config.callback && config.callback(result);
            }, function dismiss() {
            });
        }

        function openRepoSettings(config) {
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
                            },
                            success: function (data) {
                                modal.close(data);
                            }
                        };
                        cfg.name = config.name;
                        cfg.repoType = config.repoType;
                        cfg.repo = config.repo;
                        cfg.dir = config.dir;
                        cfg.path = config.path;
                        cfg.id = config.id;
                        return cfg;
                    }
                }
            });
            modal.result.then(function close(result) {
                config.callback && config.callback(result);
            }, function dismiss() {
            });
        }

        function openRepoList(config) {
            var modal = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-repo-list.html',
                controllerAs: '$ctrl',
                size: 'md',
                controller: 'GfileEditCtrl',
                backdrop: 'static',
                resolve: {
                    config: function () {
                        var cfg = {
                            cancel: function () {
                                modal.dismiss();
                            },
                            success: function (data) {
                                modal.close(data);
                            }
                        };
                        cfg.name = config.name;
                        cfg.repoType = config.repoType;
                        cfg.repo = config.repo;
                        cfg.dir = config.dir;
                        cfg.path = config.path;
                        cfg.id = config.id;
                        return cfg;
                    }
                }
            });
            modal.result.then(function close(result) {
                config.callback && config.callback(result);
            }, function dismiss() {
            });
        }

        function saveScriptFile() {

        }

        function openFolderEditor(config, isNew, isFile) {
            var modal = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-edit-dir-modal.html',
                size: isNew ? 'sm' : 'sm',
                controllerAs: '$ctrl',
                controller: 'GfileEditCtrl',
                backdrop: 'static',
                resolve: {
                    config: function () {
                        var cfg = {
                            cancel: function () {
                                modal.dismiss();
                            },
                            success: function (data) {
                                modal.close(data);
                            }
                        };
                        cfg.name = config.name;
                        cfg.desc = config.desc;
                        cfg.repoType = config.repoType;
                        cfg.repo = config.repo;
                        cfg.dir = config.dir;
                        cfg.path = config.path;
                        cfg.id = config.id;
                        cfg.isEdit = isNew;
                        cfg.isFile = isFile;
                        return cfg;
                    }
                }
            });
            modal.result.then(function close(result) {
                config.callback && config.callback(result);
            }, function dismiss() {
            });
        }

        /**
         * Download file(s) by repository path.
         * @param config
         * @param {string} config.repoType
         * @param {string} config.repo
         * @param {string|[string]} config.path Repository relative path of file to download
         */
        function downloadFile(config) {
            gfileService.downloadFile(config);
        }

        /**
         *
         * @param scope
         * @param {object} config
         * @param {string=} config.repoType 'git' or 'staticfs'
         * @param {string=} config.repo Repository name
         * @param {string=} config.dir Which directory to locate files. Default is repository root.
         * @param {[string]|string|{id:string}|[{id:string}]=} config.preSelected Pre-selected files. It can be ID, ID list, object, object list.
         * @param {boolean=} config.multipleSelect Default is false (for single selection)
         * @param {string=} config.fileFilter Only show files matching pattern defined in filter
         * @param {function([{id:string,path:string,name:string,config:string}])=} config.onConfirm Callback when selection confirmed.
         */
        function openFileSelector(scope, config) {
            var modal = modalHelper.openModal({
                template: '<div class="modal-header">' +
                    '<h4 class="modal-title">{{\'gfs.helper.select_file\' | translate}}</h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal" ng-click="$ctrl.cancel()"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<gfs-gfile-list repo-type="\'' + config.repoType + '\'" hide-dir=false hide-desc=true repo="\'' + (config.repo || '$tnt') + '\'" dir="\'' + (config.dir || '') + '\'" options="$ctrl.options"></gfs-gfile-list>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button class="btn btn-primary" ng-click="$ctrl.submit()"><i class="fa fa-check"></i>' + $translate.instant("gfs.common.sure") + '</button>' +
                    '<button class="btn btn-default" ng-click="$ctrl.cancel()">' + $translate.instant("gfs.common.cancel") + '</button>' +
                    '</div>',
                size: 'lg',
                controller: ['$scope', function GfileSelectorCtrl($scope) {
                    var that = this;
                    this.submit = submit;
                    this.cancel = cancel;
                    this.selected = [];
                    this.options = {
                        useSelector: true,
                        preSelected: config.preSelected || [],
                        fileFilter: config.fileFilter,
                        multipleSelect: config.multipleSelect,
                        includeStage: true,
                        onFileSelect: onSelect
                    };

                    function onSelect(selected) {
                        that.selected = selected;
                        // console.log('onSelect', selected);
                    }

                    function cancel() {
                        modal.dismiss();
                    }

                    function submit() {
                        modal.close(that.selected);
                    }
                }],
                controllerAs: '$ctrl',
                scope: scope
            });
            modal.result.then(function (result) {
                config.onConfirm && config.onConfirm(result);
            }, function () {
            });
        }

        /**
         *
         * @param {object} file
         * @param {string=} file.id Optional
         * @param {string=} file.path File path relative to repo
         * @param {string} file.repoType Repo type
         */
        function openTestRun(file) {
            var instance = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/script-test-run-modal.html',
                size: 'md',
                controllerAs: '$ctrl',
                controller: function () {
                    this.file = file;
                    this.cancel = cancel;
                    this.onClose = onClose;

                    function cancel() {
                        instance.dismiss();
                    }

                    function onClose() {
                        instance.close();
                    }
                }
            }, {resizable: true});
            instance.result.then(function close(result) {
            }, function dismiss() {
            });
            instance.rendered.then(function () {
                $('.modal-dialog').eq(0)
                    .draggable({handle: '.modal-header:eq(0)'});
            });
        }

        function openAllApproveHistory() {
            var instance = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-approve-history-modal.html',
                size: 'lg',
                controllerAs: '$ctrl',
                backdrop: 'static',
                controller: ['$scope', function ($scope) {
                    var that = this;
                    this.historys = [];
                    this.historyModal = "all";
                    this.cancel = cancel;
                    this.onClose = onClose;
                    this.showApprovalDetail = showApprovalDetail;
                    gfileService.getAllFileApproveHistory("$tnt").then(function (result) {
                        that.historys = result.result;
                        parseHistories(that.historys);
                        // console.log("historys:", that.historys)
                    }).catch(function (e) {
                        throw e;
                    });

                    $scope.$watch('cleanInstance', function (newVal, oldVal) {
                        if (newVal) {
                            instance.dismiss();
                        }
                    })

                    function parseHistories(historys) {
                        historys.forEach(function (record) {
                            record.action = gfileService.detectActionOfApprove(record);
                            record.actionDate = dateTime.formatDate(record.updatedAt, 'dateTime');
                        });
                    }

                    function cancel() {
                        instance.dismiss();
                    }

                    function onClose() {
                        instance.close();
                    }

                    function showApprovalDetail(approvalId) {
                        var instance = modalHelper.openModal({
                            templateUrl: 'app/modules/gfs/gfile-approve-history-modal.html',
                            size: 'lg',
                            controllerAs: '$ctrl',
                            backdrop: 'static',
                            controller: function () {
                                var that = this;
                                this.detail = {};
                                this.historyModal = "approvalDetail";
                                this.goFile = goFile;
                                this.cancel = cancel;
                                this.onClose = onClose;
                                gfileService.getApproveDetail("$tnt", approvalId).then(function (result) {
                                    if (result._status === "ok") {
                                        that.detail = result.result;
                                        parseHistories(that.detail);
                                    }
                                    // console.log("detail:", that.detail)
                                }).catch(function (e) {
                                    throw e;
                                });

                                $scope.$watch('cleanInstance', function (newVal, oldVal) {
                                    if (newVal) {
                                        instance.dismiss();
                                    }
                                })

                                function parseHistories(detail) {
                                    detail.action = gfileService.detectActionOfApprove(detail);
                                    detail.actionDate = dateTime.formatDate(detail.approverAt, 'dateTime');
                                }

                                function goFile(record) {
                                    $scope.cleanInstance = true;
                                    var subRecord = record.substring(0, record.lastIndexOf("/"));
                                    $state.go('app.gfs.git_repo_dir', {repo: '$tnt', dir: subRecord})
                                }

                                function cancel() {
                                    instance.dismiss();
                                }

                                function onClose() {
                                    instance.close();
                                }
                            }
                        });
                        instance.result.then(function close(result) {
                        }, function dismiss() {
                        });
                        instance.rendered.then(function () {
                            $('.modal-dialog').eq(0)
                                .draggable({handle: '.modal-header:eq(0)'});
                        });
                    }
                }]
            });
            instance.result.then(function close(result) {
            }, function dismiss() {
            });
            instance.rendered.then(function () {
                $('.modal-dialog').eq(0)
                    .draggable({handle: '.modal-header:eq(0)'});
            });
        }

        function openApproveHistory(file) {
            var instance = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-approve-history-modal.html',
                size: 'lg',
                controllerAs: '$ctrl',
                backdrop: 'static',
                controller: function () {
                    var that = this;
                    this.historys = [];
                    this.file = file;
                    this.historyModal = "singleFile";
                    this.cancel = cancel;
                    this.onClose = onClose;
                    gfileService.getFileApproveHistory(file.repo, file.path).then(function (result) {
                        that.historys = result.result;
                        parseHistories(that.historys);
                    }).catch(function (e) {
                        throw e;
                    });

                    function parseHistories(historys) {
                        historys.forEach(function (record) {
                            record.action = gfileService.detectActionOfApprove(record);
                            record.actionDate = dateTime.formatDate(record.updatedAt, 'dateTime');
                        });
                    }

                    function cancel() {
                        instance.dismiss();
                    }

                    function onClose() {
                        instance.close();
                    }
                }
            });
            instance.result.then(function close(result) {
            }, function dismiss() {
            });
            instance.rendered.then(function () {
                $('.modal-dialog').eq(0)
                    .draggable({handle: '.modal-header:eq(0)'});
            });
        }

        function openApprove(file, afterChangeStatus, refreshFileStatusMark) {
            var instance = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-approve-modal.html',
                size: 'lg',
                controllerAs: '$ctrl',
                backdrop: 'static',
                controller: function () {
                    var that = this;
                    this.file = file;
                    this.cancel = cancel;

                    this.afterChangeStatus = function (action) {
                        if (action === 'success') {
                            afterChangeStatus ? afterChangeStatus() : null;
                            instance.close();
                        } else if (action === 'cancel') {
                            instance.dismiss();
                        }
                    };

                    this.refreshFileStatusMark = function () {
                        refreshFileStatusMark ? refreshFileStatusMark() : null;
                    };

                    function cancel() {
                        instance.dismiss();
                    }

                    function onClose() {
                        instance.close();
                    }
                }
            });
            instance.result.then(function close(result) {
            }, function dismiss() {
            });
            instance.rendered.then(function () {
                $('.modal-dialog').eq(0)
                    .draggable({handle: '.modal-header:eq(0)'});
            });
        }
    }
})();
