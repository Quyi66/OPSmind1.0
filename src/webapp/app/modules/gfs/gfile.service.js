/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-01-03.
 */

(function () {
    'use strict';
    var app = angular.module('oplus.gfs');

    app.service('gfileService', gfileService);

    gfileService.$inject = ['$q', 'restUtils', 'currentUser', 'modalHelper', '$translate', 'Upload', 'OpDownload'];

    /**
     * @ngdoc service
     * @name gfileService
     * 20200413: NOTE
     * Use lots of encodeURIComponent because at now (20200413) upload file name with Chinese character
     * cannot properly handled with spring mvc4 (used by zuul)
     * @param $q
     * @param {restUtils} restUtils
     * @param {currentUser} currentUser
     * @param {modalHelper} modalHelper
     * @param {$translate} $translate
     * @param {Upload} Upload
     * @param {OpDownload} OpDownload
     */
    function gfileService($q, restUtils, currentUser, modalHelper, $translate, Upload, OpDownload) {
        var USE_TENANT_REPO = true;
        var DEFAULT_BUILTIN_INIT_PAYLOAD = {
            src: '/opt/oplus/source/playbook.zip',
            dest: '',
            is_keep_folder: false
        };
        var that = this;
        // this.STATUS_DEFS = {
        //     '': {
        //         text: $translate.instant("gfs.service.pending_review"),
        //         color: 'primary',
        //         actions: ['PUBLISH', 'REJECT']
        //     },
        //     'NULL': {
        //         text: $translate.instant("gfs.service.pending_review"),
        //         color: 'primary',
        //         actions: ['PUBLISH', 'REJECT']
        //     },
        //     'PUBLISHED': {
        //         text: $translate.instant("gfs.service.published"),
        //         color: 'success',
        //         actions: ['DISABLE']
        //     },
        //     'REJECTED': {text: $translate.instant("gfs.service.rejected"), color: 'warning', actions: ['PUBLISH']},
        //     'DISABLED': {
        //         text: $translate.instant("gfs.service.terminated"),
        //         color: 'secondary',
        //         actions: ['PUBLISH']
        //     }
        // };

        // this.STAGE_STATUS_DEFS = {
        //     '': {
        //         text: $translate.instant("gfs.service.pending_review"),
        //         color: 'primary',
        //         actions: ['APPROVE', 'REJECT', 'REVERT']
        //     },
        //     'NULL': {
        //         text: $translate.instant("gfs.service.pending_review"),
        //         color: 'primary',
        //         actions: ['APPROVE', 'REJECT', 'REVERT']
        //     },
        //     'REJECTED': {
        //         text: $translate.instant("gfs.service.rejected"),
        //         color: 'warning',
        //         actions: ['APPROVE', 'REVERT']
        //     }
        // }

        // this.MASTER_STATUS_DEFS = {
        //     'PUBLISHED': {text: $translate.instant("gfs.service.enabled"), color: 'success', actions: ['DISABLE']},
        //     'DISABLED': {text: $translate.instant("gfs.service.disabled"), color: 'secondary', actions: ['PUBLISH']}
        // };

        // this.ACTION_DEFS = [
        //     {
        //         name: 'PUBLISH',
        //         text: $translate.instant("gfs.service.enable"),
        //         status: 'PUBLISHED',
        //         icon: 'fa fa-fw fa-check text-success',
        //         permission: {owner: true, codes: ['gfs:edit']}
        //     },
        //     {
        //         name: 'APPROVE',
        //         text: $translate.instant("gfs.service.release"),
        //         status: 'PUBLISHED',
        //         icon: 'fa fa-fw fa-check text-success',
        //         permission: {codes: ['gfs:approve']}
        //     },
        //     {
        //         name: 'REJECT',
        //         text: $translate.instant("gfs.service.reject"),
        //         status: 'REJECTED',
        //         icon: 'fa fa-fw fa-ban text-danger',
        //         permission: {codes: ['gfs:approve']}
        //     },
        //     {
        //         name: 'DISABLE',
        //         text: $translate.instant("gfs.service.disable"),
        //         status: 'DISABLED',
        //         icon: 'fa fa-fw fa-pause text-secondary',
        //         permission: {owner: true, codes: ['gfs:edit']}
        //     },
        //     {
        //         name: 'REVERT',
        //         text: $translate.instant("gfs.service.cancel_changes"),
        //         status: 'REVERT',
        //         icon: 'fa fa-fw fa-undo text-danger',
        //         permission: {owner: true, codes: ['gfs:approve']}
        //     }
        // ];

        // Data operation
        this.listFiles = listFiles;
        this.createFile = createFile;
        this.getFileInfo = getFileInfo;
        this.updateFileInfo = updateFileInfo;
        this.deleteFiles = deleteFiles;
        this.gitPull = gitPull;
        this.gitPush = gitPush;
        this.repair = repair;
        this.resetJgit = resetJgit;
        this.jgitInfo = jgitInfo;
        this.downloadFiles = downloadFiles;
        this.moveFiles = moveFiles;
        this.downloadFile = downloadFile;
        this.changeFileStatus = changeFileStatus;
        this.getFileRevisions = getFileRevisions;
        this.fileRevusions = fileRevusions;
        this.getFileDiff = getFileDiff;
        this.addFolder = addFolder;
        this.syncFile = syncFile;
        this.editFolder = editFolder;
        // Approve/Reject
        this.approveStage = approveStage;
        this.rejectStage = rejectStage;
        // UI operation
        this.openFileContentViewer = openFileContentViewer;
        this.detectStatus = detectStatus;
        this.detectActions = detectActions;
        this.detectActionOfApprove = detectActionOfApprove;
        this.getWholeActionsByRepoType = getWholeActionsByRepoType;
        this.isFileContentEditable = isFileContentEditable;
        this.getFileApproveHistory = getFileApproveHistory;
        this.getAllFileApproveHistory = getAllFileApproveHistory;
        this.getApproveDetail = getApproveDetail;
        this.getPlaybookInfo = getPlaybookInfo;
        this.checkFileExist = checkFileExist;
        this.shellCheck = shellCheck;
        this.initGitRepo = initGitRepo;
        this.initBuiltinRepo = initBuiltinRepo;
        this.loadCurrentRepo = loadCurrentRepo;
        this.delExternalRepo = delExternalRepo;
        this.delBatchExternalRepo = delBatchExternalRepo;

        /**
         * 审批通过
         *
         * @param files
         * @param comment
         * @returns {promise}
         */
        function approveStage(files, comment) {
            return changeFileStatus(files[0].repoType, files[0].repo, files, 'PUBLISHED', comment)
        }

        /**
         * 检测脚本
         * @param repoType
         * @param repo
         * @param files
         * @returns {Promise}
         */
        function shellCheck(repoType, repo, files) {
            var filePaths = files.map(function (file) {
                return file.path;
            });
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/{repoType}/f/{repo}/shellcheck/{path}', {
                repoType: repoType,
                repo: repo,
                path: filePaths
            });
        }

        /**
         * 初始化同步外部Git库
         */
        function initGitRepo(repo, externalRepo, progressCallback) {
            var d = $q.defer();
            var url = restUtils.getApiUrl('gfs', '/api/gfs/v2/git/f/{repo}/remote/repos/init', {repo: getRepo(repo)});
            Upload.upload({
                url: url, data: externalRepo
            }).then(function (resp) {
                d.resolve(resp.data);
            }, function (resp) {
                var error = restUtils.guessError(resp);
                d.reject(error);
            }, function (evt) {
                if (angular.isFunction(progressCallback)) {
                    var progressPct = parseInt(100.0 * evt.loaded / evt.total);
                    progressCallback(progressPct);
                }
            });
            return d.promise;
        }

        /**
         * 初始化 Git 内置仓库（按租户ID）
         * POST /api/gfs/v2/git/f/{tenantId}/init
         * @param {string} tenantId 租户ID
         * @param {{src:string,dest:string,is_keep_folder:boolean}} payload
         * @returns {Promise}
         */
        function initBuiltinRepo(tenantId, payload) {
            if (angular.isObject(tenantId) && !payload) {
                payload = tenantId;
                tenantId = null;
            }
            if (!tenantId) {
                tenantId = currentUser.tenantId || (window.$oplus && window.$oplus.appConfig && window.$oplus.appConfig.tenantId);
            }
            if (!tenantId) {
                return $q.reject(new Error('TenantIdNotFound: cannot initialize built-in repo without tenantId'));
            }
            var body = angular.extend({}, DEFAULT_BUILTIN_INIT_PAYLOAD, payload);
            return restUtils.callApi('gfs', 'POST', '/api/gfs/v2/git/f/{tenantId}/init', {
                tenantId: tenantId
            }, body);
        }

        function loadCurrentRepo(repoType, repo) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/{repoType}/f/{repo}/current/repo', {
                repoType: repoType,
                repo: repo
            });
        }

        function delExternalRepo(repoType, repo, repoName) {
            return restUtils.callApi('gfs', 'DELETE', '/api/gfs/v2/{repoType}/f/{repo}/current/repo/{repoName}', {
                repoType: repoType,
                repo: repo,
                repoName: repoName
            });
        }

        function delBatchExternalRepo(repoType, repo, repoIds) {
            return restUtils.callApi('gfs', 'PUT', '/api/gfs/v2/{repoType}/f/{repo}/current/repos', {
                repoType: repoType,
                repo: repo
            }, repoIds);
        }

        /**
         * 审批拒绝
         *
         * @param files
         * @param comment
         * @returns {promise}
         */
        function rejectStage(files, comment) {
            return changeFileStatus(files[0].repoType, files[0].repo, files, 'REJECTED', comment)

        }

        /**
         *
         * @param repoType
         * @param repo
         * @param files {Array}
         * @param status
         * @param comment
         * @returns {promise}
         */
        function changeFileStatus(repoType, repo, files, status, comment) {
            // console.log('changeFileStatus', arguments);

            var filePaths = files.map(function (file) {
                return file.path;
            });

            return restUtils.callApi('gfs', 'PUT', '/api/gfs/v2/{repoType}/f/{repo}/attr', {
                repoType: repoType,
                repo: repo
            }, {onlineStatus: status, comment: comment, srcPaths: filePaths});
        }

        /**
         * Detect file status. It will add extra attributes `_statusCss`, `_statusText`
         * @param {object} file
         */
        function detectStatus(file) {
            var MASTER_STATUS_DEFS = {
                'PUBLISHED': {
                    text: $translate.instant("gfs.service.enabled"), color: 'success', actions: ['DISABLE']
                }, 'DISABLED': {
                    text: $translate.instant("gfs.service.disabled"), color: 'secondary', actions: ['PUBLISH']
                }
            };
            var STAGE_STATUS_DEFS = {
                '': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'NULL': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'REJECTED': {
                    text: $translate.instant("gfs.service.rejected"),
                    color: 'warning',
                    actions: ['APPROVE', 'REVERT']
                }
            };
            var STAGE_STATUS_DEFS = {
                '': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'NULL': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'REJECTED': {
                    text: $translate.instant("gfs.service.rejected"),
                    color: 'warning',
                    actions: ['APPROVE', 'REVERT']
                }
            };
            var STAGE_STATUS_DEFS = {
                '': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'NULL': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'REJECTED': {
                    text: $translate.instant("gfs.service.rejected"),
                    color: 'warning',
                    actions: ['APPROVE', 'REVERT']
                }
            }
            if (!file.directory && file.conflict !== 'RecordNotFound') {
                var fileStatus = file.onlineStatus || '';
                var def;
                if (file.repoType === 'STAGE') {
                    def = STAGE_STATUS_DEFS[fileStatus];
                } else if (file.repoType === 'GIT') {
                    def = MASTER_STATUS_DEFS[fileStatus];
                } else {
                    return;
                }

                if (!def) {
                    throw new Error('Unknown file status [' + fileStatus + ']');
                }
                if (file.repoType !== 'STAGE') {
                    file._statusCss = def.color;
                    file._statusText = def.text;
                }
                if (file._stageExists || file.repoType === 'STAGE') {
                    def = STAGE_STATUS_DEFS[file._stageStatus || ''];
                    file._stageStatusColor = def.color;
                    file._stageStatusText = def.text;
                }
            }
        }

        /**
         * Detect available actions for the file in a certain status
         * @param {object} file
         * @param {string} file.onlineStatus
         * @returns {Array}
         * @see {@link gfileService.ACTION_DEFS}
         */
        function detectActions(file) {
            var ACTION_DEFS = [{
                name: 'PUBLISH',
                text: $translate.instant("gfs.service.enable"),
                status: 'PUBLISHED',
                icon: 'fa fa-fw fa-check text-success',
                permission: {owner: true, codes: ['gfs:edit']}
            }, {
                name: 'APPROVE',
                text: $translate.instant("gfs.service.release"),
                status: 'PUBLISHED',
                icon: 'fa fa-fw fa-check text-success',
                permission: {codes: ['gfs:approve']}
            }, {
                name: 'REJECT',
                text: $translate.instant("gfs.service.reject"),
                status: 'REJECTED',
                icon: 'fa fa-fw fa-ban text-danger',
                permission: {codes: ['gfs:approve']}
            }, {
                name: 'DISABLE',
                text: $translate.instant("gfs.service.disable"),
                status: 'DISABLED',
                icon: 'fa fa-fw fa-pause text-secondary',
                permission: {owner: true, codes: ['gfs:edit']}
            }, {
                name: 'REVERT',
                text: $translate.instant("gfs.service.cancel_changes"),
                status: 'REVERT',
                icon: 'fa fa-fw fa-undo text-danger',
                permission: {owner: true, codes: ['gfs:approve']}
            }];
            var MASTER_STATUS_DEFS = {
                'PUBLISHED': {
                    text: $translate.instant("gfs.service.enabled"), color: 'success', actions: ['DISABLE']
                }, 'DISABLED': {
                    text: $translate.instant("gfs.service.disabled"), color: 'secondary', actions: ['PUBLISH']
                }
            };
            var STAGE_STATUS_DEFS = {
                '': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'NULL': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'REJECTED': {
                    text: $translate.instant("gfs.service.rejected"),
                    color: 'warning',
                    actions: ['APPROVE', 'REVERT']
                }
            }
            var fileStatus = file._stageStatus || file.onlineStatus || '';
            var actions = _.filter(ACTION_DEFS, function (o) {
                var defs = (file._stageStatus || file.repoType === 'STAGE') ? STAGE_STATUS_DEFS : MASTER_STATUS_DEFS;
                return _.indexOf(defs[fileStatus].actions, o.name) > -1;
            });
            return actions;
        }

        /**
         * get action name by approve result
         * @param file
         * @returns {*|*|Array}
         */
        function detectActionOfApprove(file) {
            var ACTION_DEFS = [{
                name: 'PUBLISH',
                text: $translate.instant("gfs.service.enable"),
                status: 'PUBLISHED',
                icon: 'fa fa-fw fa-check text-success',
                permission: {owner: true, codes: ['gfs:edit']}
            }, {
                name: 'APPROVE',
                text: $translate.instant("gfs.service.release"),
                status: 'PUBLISHED',
                icon: 'fa fa-fw fa-check text-success',
                permission: {codes: ['gfs:approve']}
            }, {
                name: 'REJECT',
                text: $translate.instant("gfs.service.reject"),
                status: 'REJECTED',
                icon: 'fa fa-fw fa-ban text-danger',
                permission: {codes: ['gfs:approve']}
            }, {
                name: 'DISABLE',
                text: $translate.instant("gfs.service.disable"),
                status: 'DISABLED',
                icon: 'fa fa-fw fa-pause text-secondary',
                permission: {owner: true, codes: ['gfs:edit']}
            }, {
                name: 'REVERT',
                text: $translate.instant("gfs.service.cancel_changes"),
                status: 'REVERT',
                icon: 'fa fa-fw fa-undo text-danger',
                permission: {owner: true, codes: ['gfs:approve']}
            }];
            var fileStatus = file.onlineStatus || file.approverStatus || '';
            var actions = _.filter(ACTION_DEFS, function (o) {
                return o.status === fileStatus && o.name !== 'PUBLISH';
            });

            return (actions[0] || {}).text;
        }

        /**
         *  Get all available actions by repo type
         * @param repoType
         * @returns {Array}
         */
        function getWholeActionsByRepoType(repoType) {
            var ACTION_DEFS = [{
                name: 'PUBLISH',
                text: $translate.instant("gfs.service.enable"),
                status: 'PUBLISHED',
                icon: 'fa fa-fw fa-check text-success',
                permission: {owner: true, codes: ['gfs:edit']}
            }, {
                name: 'APPROVE',
                text: $translate.instant("gfs.service.release"),
                status: 'PUBLISHED',
                icon: 'fa fa-fw fa-check text-success',
                permission: {codes: ['gfs:approve']}
            }, {
                name: 'REJECT',
                text: $translate.instant("gfs.service.reject"),
                status: 'REJECTED',
                icon: 'fa fa-fw fa-ban text-danger',
                permission: {codes: ['gfs:approve']}
            }, {
                name: 'DISABLE',
                text: $translate.instant("gfs.service.disable"),
                status: 'DISABLED',
                icon: 'fa fa-fw fa-pause text-secondary',
                permission: {owner: true, codes: ['gfs:edit']}
            }, {
                name: 'REVERT',
                text: $translate.instant("gfs.service.cancel_changes"),
                status: 'REVERT',
                icon: 'fa fa-fw fa-undo text-danger',
                permission: {owner: true, codes: ['gfs:approve']}
            }];
            var MASTER_STATUS_DEFS = {
                'PUBLISHED': {
                    text: $translate.instant("gfs.service.enabled"), color: 'success', actions: ['DISABLE']
                }, 'DISABLED': {
                    text: $translate.instant("gfs.service.disabled"), color: 'secondary', actions: ['PUBLISH']
                }
            };
            var STAGE_STATUS_DEFS = {
                '': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'NULL': {
                    text: $translate.instant("gfs.service.pending_review"),
                    color: 'primary',
                    actions: ['APPROVE', 'REJECT', 'REVERT']
                }, 'REJECTED': {
                    text: $translate.instant("gfs.service.rejected"),
                    color: 'warning',
                    actions: ['APPROVE', 'REVERT']
                }
            }
            var defs = repoType.toUpperCase() === 'STAGE' ? STAGE_STATUS_DEFS : MASTER_STATUS_DEFS;
            var allActionCodes = [];
            _.values(defs).forEach(function (def) {
                allActionCodes = allActionCodes.concat(def.actions)
            });

            return _.filter(ACTION_DEFS, function (o) {
                return _.indexOf(allActionCodes, o.name) > -1;
            });
        }

        function deleteFiles(repoType, repo, filePaths) {
            // console.log('deleteFiles', arguments);
            return restUtils.callApi('gfs', 'PUT', '/api/gfs/v2/{repoType}/r/{repo}/file', {
                repoType: repoType,
                repo: repo || '$tnt'
            }, filePaths);
        }

        function gitPull(repoType, repo) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/{repoType}/f/{repo}/remote/repos/pull', {
                repoType: repoType,
                repo: repo || '$tnt'
            });
        }

        function gitPush(repoType, repo) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/{repoType}/f/{repo}/remote/repos/push', {
                repoType: repoType,
                repo: repo || '$tnt'
            });
        }

        function repair(repoType, repo) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/jgit/{repo}/status/repair', {
                repoType: repoType,
                repo: repo || '$tnt'
            });
        }

        function resetJgit(repoType, repo) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/jgit/{repo}/reset', {
                repoType: repoType,
                repo: repo || '$tnt'
            });
        }

        function jgitInfo(repoType, repo) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/jgit/{repo}/status', {
                repoType: repoType,
                repo: repo || '$tnt'
            });
        }

        function downloadFiles(repoType, repo, filePaths, currentTime) {
            var url = restUtils.getApiUrl('gfs', '/api/gfs/v2/{repoType}/r/{repo}/batch/download', {
                repoType: repoType,
                repo: repo || '$tnt'
            });
            OpDownload.download(url, currentTime + ".zip", 'POST', null, filePaths);
        }

        // function deleteFile(file, repoType) {
        //     console.log('deleteFile', file, repoType);
        //     if (file.id) {
        //         return restUtils.callApi('gfs', 'DELETE',
        //             '/api/gfs/v2/{repoType}/f/{id}', {id: file.id,
        //                 repoType: file.repoType || repoType});
        //     } else {
        //         return restUtils.callApi('gfs', 'DELETE',
        //             '/api/gfs/v2/{repoType}/r/{repo}/file/{path}', {
        //                 repoType: file.repoType || repoType,
        //                 path: encodeURIComponent(file.path),
        //                 repo: file.repo
        //             });
        //     }
        // }

        /**
         * move files and folders to target folder
         * @param repoType
         * @param repo
         * @param targetPath {string} path of target folder
         * @param filePath {Array} files' or folders' paths
         */
        function moveFiles(repoType, repo, targetPath, filePaths) {
            return restUtils.callApi('gfs', 'PUT', '/api/gfs/v2/{type}/f/{repo}/moveto' + (targetPath ? '?targetPath={targetPath}' : ''), {
                repo: repo, type: repoType, targetPath: targetPath
            }, filePaths);
        }

        function getPlaybookInfo(repo, path) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/task/git/f/{repo}/file/{path}', {
                repo: getRepo(repo),
                path: path
            });
        }

        /**
         * 查询审批历史
         * @param repo
         * @param filePath
         * @returns {promise}
         */
        function getFileApproveHistory(repo, filePath) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/git/f/{repo}/history/{path}', {
                repo: repo, path: filePath
            }, {});
        }

        function getAllFileApproveHistory(repo) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/git/f/{repo}/history', {
                repo: repo
            }, {});
        }

        function getApproveDetail(repo, approvalId) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/git/f/{repo}/history/{approvalId}', {
                repo: repo, approvalId: approvalId
            }, {});
        }

        function openFileContentViewer(repoType, repo, path, saveFilename) {
            var instance = modalHelper.openModal({
                templateUrl: 'app/modules/gfs/gfile-content-modal.html',
                size: 'lg',
                controllerAs: '$ctrl',
                controller: ['$scope', function ($scope) {
                    this.repoType = repoType || 'git';
                    this.repo = repo;
                    this.path = path;
                    this.saveFilename = saveFilename;
                    this.cancel = function () {
                        instance.dismiss();
                    }
                }]
            }, {resizable: true});
        }


        /**
         * If use tenant as repo, the server will use tenant ID as repo name and ignore the request parameter `repo`.
         * We change the repo to '$tnt' just to let developer know that.
         * @param repo
         * @returns {*}
         */
        function getRepo(repo) {
            return USE_TENANT_REPO ? '$tnt' : repo;
        }

        /**
         * Download file(s) by repository path.
         * @param config
         * @param {string} config.repoType
         * @param {string} config.repo
         * @param {string|[string]} config.path Repository relative path(s) of file to download
         */
        function downloadFile(config) {
            var url;
            if (angular.isArray(config.path)) {
                url = restUtils.getApiUrl('gfs', '/api/gfs/v2/{repoType}/r/{repo}/download', {
                    repoType: config.repoType, repo: getRepo(config.repo)
                });
                OpDownload.download(url, null, 'POST', null, config.path);
            } else {
                url = restUtils.getApiUrl('gfs', '/api/gfs/v2/{repoType}/r/{repo}/download/{path}', {
                    repoType: config.repoType, repo: getRepo(config.repo), path: encodeURIComponent(config.path)
                });
                var path = config.path;
                var saveFilename = config.saveFilename;
                var filename = path.substr(path.lastIndexOf("/") + 1)
                OpDownload.download(url, saveFilename ? saveFilename : filename);
            }

            // }
            // return url;
            // Do NOT use window.open because it will not bring jwt token to server
            // and the request will be rejected by server.
            // console.log(url);
            // OpDownload.download(url);
            // window.open(url);
        }

        /**
         *
         * @param {string} repoType
         * @param {string} repo
         * @param {*|{syncMode: string, dir}} fileInfo
         * @param progressCallback
         * @param {File} fileInfo.file The file to upload
         * @param {string} fileInfo.description
         * @param {string} fileInfo.config
         * @param {string} fileInfo.config
         * @param {string} fileInfo.tags
         * @param {string=} fileInfo.unzipMode "ExtractToDir", "ExtractWithoutDir"
         * @returns {Promise<any>}
         */
        function createFile(repoType, repo, fileInfo, progressCallback) {
            // console.log('createFile: repo', repo, 'fileInfo', fileInfo);
            var d = $q.defer();
            var url = restUtils.getApiUrl('gfs', '/api/gfs/v2/{repoType}/r/{repo}/file', {
                repo: getRepo(repo),
                repoType: repoType
            });
            Upload.upload({
                url: url, // data: {file: fileInfo.file, options: Upload.json(fileInfo.options), dir: fileInfo.dir}
                data: fileInfo
            }).then(function (resp) {
                d.resolve(resp.data);
            }, function (resp) {
                var error = restUtils.guessError(resp);
                d.reject(error);
            }, function (evt) {
                var progressPct = parseInt(100.0 * evt.loaded / evt.total);
                progressCallback && progressCallback(progressPct);
            });
            return d.promise;
        }

        function addFolder(config, folderName, folderDesc) {
            var path = config.dir ? (config.dir + "/" + folderName) : folderName;
            return restUtils.callApi('gfs', 'POST', '/api/gfs/v2/{repoType}/r/{repo}/dir/{path}', {
                repoType: config.repoType, path: path, repo: config.repo
            }, {"description": folderDesc});
        }

        function syncFile(repoType, repo, fileInfo) {
            return restUtils.callApi('gfs', 'POST', '/api/gfs/v2/{repoType}/f/{repo}/init', {
                repoType: repoType, repo: repo
            }, {
                "src": fileInfo.path,
                "dest": fileInfo.dir ? "/" + fileInfo.dir : fileInfo.dir,
                "is_keep_folder": fileInfo.syncMode === "ExtractToDir"
            });
        }

        function editFolder(config, folderName, folderDesc) {
            var path = config.dir ? (config.dir + "/" + folderName) : folderName;
            return restUtils.callApi('gfs', 'PUT', '/api/gfs/v2/git/r/{repo}/dir', {
                repo: config.repo
            }, {"description": folderDesc, "dir": path});
        }

        function getFileRevisions(id, repo, path) {
            if (id) {
                return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/git/f/{id}/rev', {id: id});
            } else {
                return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/git/r/{repo}/rev/{path}', {
                    repo: getRepo(repo),
                    path: path
                });
            }
        }

        function fileRevusions(repo, revId, path) {
            return restUtils.callApi('gfs', 'POST', '/api/gfs/v2/git/r/{repo}/rev/rollback/{revId}', {
                repo: getRepo(repo), revId: revId
            }, path.split(","));
        }

        function getFileDiff(repo, path, updated, previous) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/git/r/{repo}/diff/{path}', {
                repo: getRepo(repo),
                path: path
            }, {updated: updated, previous: previous});
        }

        function checkFileExist(repo, pathList) {
            return restUtils.callApi('gfs', 'POST', '/api/gfs/v2/git/checkfiles/{repo}', {repo: repo}, pathList);
        }

        /**
         *
         * @param repoType
         * @param path
         * @param withContent {Boolean} whether return file content
         * @returns {promise}
         */
        function getFileInfo(repoType, repo, path, withContent) {
            return restUtils.callApi('gfs', 'GET', '/api/gfs/v2/{type}/f/{repo}/file/{path}', {
                type: repoType || 'GIT', repo: repo || '$tnt', path: path
            }, {isContent: withContent});
        }

        function updateFileInfo(repoType, repo, path, fileInfo) {
            if (_.isEmpty(fileInfo)) {
                throw new TypeError("fileInfo cannot be empty in gfileService.updateFileInfo");
            }

            // var repoType = 'git';
            return restUtils.callApi('gfs', 'PUT', '/api/gfs/v2/{type}/f/{repo}/file/{path}', {
                type: repoType,
                repo: repo || '$tnt',
                path: path
            }, fileInfo);
        }

        /**
         * List files in repo dir
         * @param {string} repo Repository name
         * @param {string=} dir Empty for root working directory
         * @param {string=} repoType "git" (default), "stage" or "staticfs"
         * @param {object=} options
         * @param {boolean=} options.includeStage Only available with git repo type.
         * @returns {promise<[{_stageIsThis:boolean,_stageStatus:string,_stageExists:boolean,_stageNeedApprove:boolean}]>}
         */
        function listFiles(repo, dir, repoType, options) {
            options = options || {};
            repoType = repoType || 'git';
            repo = repo || "$tnt";
            var d = $q.defer();
            var apiPath = '/api/gfs/v2/{repoType}/r/{repo}/dir/{dir}';
            var includeGitAndStage = repoType === 'git' && options.includeStage;
            if (includeGitAndStage) {
                apiPath = apiPath + '?useStage=true';
            }
            restUtils.callApi('gfs', 'GET', apiPath, {
                repo: getRepo(repo), dir: encodeURIComponent(dir), repoType: repoType
            }, {})
                .then(function (files) {
                    if (includeGitAndStage || repoType === 'stage') {
                        parseStageFiles(files);
                    }
                    // console.log(files);
                    d.resolve(files);
                })
                .catch(function (err) {
                    d.reject(err);
                });
            return d.promise;

            function parseStageFiles(files) {
                var stageFiles = _.remove(files, {repoType: 'STAGE'});
                stageFiles.forEach(function (sfile) {
                    var main = _.find(files, {path: sfile.path});
                    // main._stage = main.stage || {};
                    if (!main) {
                        main = sfile;
                        main._stageIsThis = true;
                        files.push(sfile);
                    }
                    main._stageExists = true;
                    main._stageStatus = sfile.onlineStatus;
                    if (sfile.onlineStatus !== 'REJECTED') {
                        main._stageNeedApprove = true;
                    }
                });
            }
        }

        /**
         * judge whether file can be edit by mine type
         * @param mime
         */
        function isFileContentEditable(mime) {
            var supportMines = [/^text\/.*/, /^application\/x\-sh$/, /^application\/json$/, /^application\/octet-stream$/];
            return supportMines.some(function (pattern) {
                return mime.match(pattern);
            });
        }
    }
})();
