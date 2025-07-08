/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-01-03
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name gfsGfileList
     * @description
     * Use as file management or file selector.
     * ```html
     * <gfs-gfile-list repo-type="string" repo="string" dir="string" options="object">
     * ```
     * @param {string=} repoType Repository type. "git" (default), "staticfs"
     * @param {string=} repo Repository name. It is not used in multi-tenant environment, it is always tenant repo.
     * @param {string} dir Two-way binding to current dir
     * @param {object=} options
     * @param {object=} options.base If defined, only files and directories within it are shown.
     * Null or empty indicates root of repository. If not defined, files are restricted in `dir`.
     * @param {boolean=} options.changeUrl Navigator mode will change URL (state) on directory transition
     * @param {boolean=} options.showActions Show action buttons (delete, edit) with each file.
     * @param {boolean=} options.allowAddFile Default is false
     * @param {boolean=} options.useSelector Selector mode adds checkbox to select files.
     * @param {boolean=} options.downloadButton Use with useSelector
     * @param {string=} options.filter Comma separated file name. It supports wildcard of *. Example: ".zip,test*.yml"
     * @param {[string]|[{id:string,path:string}]|{id:string,path:string}|string=} options.preSelected Paths of pre-selected files in selector mode
     * @param {boolean=} options.multipleSelect Valid when useSelector. Default is false
     * @param {function([{id:string,path:string,name:string,config:string}])=} options.onFileSelect Use with useSelector.
     * @param {boolean=} options.includeStage True to include stage files, only available with git repo type.
     * @param {string} options.dirSize "children" number of children dirs or files, "size" directory size, "hidden" not show, default is "hidden"
     * @param {boolean=} options.canSelectDirectory Default is false
     * Callback function, parameter is array of selected file(s).
     */
    angular.module('oplus.gfs').component('gfsGfileList', {
        templateUrl: 'app/modules/gfs/gfile-list.html',
        controller: ['$scope', '$element', '$timeout', '$state', '$filter', '$uibModal', '$translate', 'gfileService', 'gfsActionHelper', 'messageService', '$sessionStorage', 'currentUser', GfileListComponentCtrl],
        bindings: {
            hideDir: '<', hideDesc: '<', repoType: '<', repo: '<', dir: '=', options: '<'
        }
    });

    /**
     * Used with component.
     * @param $scope
     * @param $element
     * @param $timeout
     * @param $state
     * @param $filter
     * @param $uibModal
     * @param $translate
     * @param {gfileService} gfileService
     * @param {gfsActionHelper} gfsActionHelper
     * @param {messageService} messageService
     * @param $sessionStorage
     * @param currentUser
     */
    function GfileListComponentCtrl($scope, $element, $timeout, $state, $filter, $uibModal, $translate, gfileService, gfsActionHelper, messageService, $sessionStorage, currentUser) {
        // console.log('Init GfileListComponentCtrl');
        var that = this;
        var PARENT_DIR = '..';
        if (!this.repoType) {
            throw new Error("Need specify `repo-type` for component `gfs-gfile-list`");
        }
        var options = {
            base: '',
            allowAddFile: false,
            useSelector: false,
            changeUrl: false,
            showStatus: true,//是否显示非审核区状态
            showStageStatus: false,//是否显示审核区文件状态
            showActions: false,
            jumpToApprove: false,
            filter: undefined,
            downloadButton: false,
            refreshButton: false,
            searchButton: false,
            preSelected: [],
            multipleSelect: false,
            onFileSelect: angular.noop,
            canApprove: false,
            canTestRun: false,
            canSelectDirectory: false
        };
        var basePath;

        that.options = angular.extend(options, that.options);

        // console.log('GfileListComponent', JSON.stringify(that.options));
        if (that.repoType === 'staticfs') {
            that.options.canTestRun = false;
        }
        that.fileFilter = options.filter;
        that.dir = that.dir || '';
        that.hideDesc = that.hideDesc || false;
        // Save selected files
        // For multiple selection, key is file path, value is file object.
        // For single section, it is selected file object
        that.selectionMap = {};
        that.clipboard = {
            data: {}, canPaste: false
        };
        that.fileList = [];
        that.goFile = goFile;
        that.goDir = goDir;
        that.gotoStage = gotoStage;
        that.addFile = addFile;
        that.syncFile = syncFile;
        that.repoSettings = repoSettings;
        that.repoList = repoList;
        that.gitPull = gitPull;
        that.gitPush = gitPush;
        that.editFile = editFile;
        that.editDir = editDir;
        that.deleteFiles = deleteFiles;
        that.downloadFiles = downloadFiles;
        that.refreshPage = refreshList;
        that.testRun = testRun;
        that.refreshList = refreshList;
        that.clickRevEntry = clickRevEntry;
        that.showRevList = showRevList;
        that.showFileStatus = showFileStatus;
        that.selectFile = selectFile;
        that.selectAll = selectAll;
        that.addFolder = addFolder;
        that.refresh = refresh;
        // that.repair = repair;
        that.repairJgit = repairJgit;
        that.goBaseRepo = goBaseRepo;
        that.addOnlineFile = addOnlineFile;
        that.downloadFile = downloadFile;
        that.singleDownloadFile = singleDownloadFile;
        that.singleDownloadDir = singleDownloadDir;
        that.checkApproveHistory = checkApproveHistory;
        that.afterChangeStatus = afterChangeStatus;
        that.getSelectedFiles = getSelectedFiles;
        that.showApprovalHistory = showApprovalHistory;
        that.cut = cut;
        that.paste = paste;
        that.refreshFileStatusMark = 0;
        that.isGFSModuleAdmin = currentUser.hasPermission('gfs:*');
        that.$onInit = init;
        that.$onDestroy = onDestroy;
        that.search = search;
        that.searchText = "";

        function init() {
            if (angular.isDefined(options.base)) {
                basePath = new Path(options.base);
            } else {
                basePath = new Path(that.dir);
            }

            if ($sessionStorage['oplus-gfs-clipboard']) {
                that.clipboard = $sessionStorage['oplus-gfs-clipboard'];
            }

            initFileSelector();
            // console.log('listFiles', {repo: that.repo, dir: that.dir, options: that.options});
            listFiles(that.repo, that.dir);
            $element.on('click', '.opx-table-th[data-sort]', function (e) {
                var elem = $(this);
                var attr = elem.data('sort');
                $timeout(function () {
                    sortBy(attr, elem);
                });
            });
        }

        // support current file library list info search
        function search() {
            var search = this.searchText;
            if (search !== "") {
                that.fileList = that.fileList.filter(function (file) {
                    for (var key in file) {
                        if (file[key] !== null && file[key] !== "" && file[key].toString().indexOf(search) > -1) {
                            return true;
                        }
                    }
                })
            } else {
                refreshList();
            }
        }

        function onDestroy() {
            $element.off('click', '*');
        }


        // init();

        function afterChangeStatus() {
            resetSelection();

            listFiles(that.repo, that.dir);
        }

        function initFileSelector() {
            if (!options.useSelector) {
                return;
            }
            // Clone original data defined as options.useSelector to avoid change without confirm
            var preSelected = angular.copy(options.preSelected) || [];
            // console.log('initFileSelector',preSelected,options.preSelected);
            var stopWatch = true;
            // Init selected items
            if (options.multipleSelect) {
                that._multiSelect = true;
            } else {
                that._singleSelect = true;
            }
            preSelected = unifyPreSelectedToObjectArray(preSelected);
            if (that._multiSelect) {
                _.forEach(preSelected, function (file) {
                    that.selectionMap[file.path] = file;
                });
            } else {
                that.selectionMap = {};
                if (that._singleSelect && preSelected.length > 0) {
                    var file = preSelected[0];
                    that.selectionMap[file.path] = file;
                }
            }
            // console.log('preSelected', JSON.stringify(preSelected), JSON.stringify(that.selectionMap));
            syncModelToCallback();
            $scope.$watch('$ctrl.selectionMap', function (newVal, oldVal) {
                if (stopWatch || newVal == oldVal) {
                    return;
                }
                syncModelToCallback();
            }, true);
            stopWatch = false;

            /**
             * Unify the pre selected data model to array format [{path:string,...}]
             * @param preSelected
             * @returns {{path:string=, other:*}[]}
             */
            function unifyPreSelectedToObjectArray(preSelected) {
                var fileArray = [];
                if (_.isEmpty(preSelected)) {
                } else if (angular.isArray(preSelected)) {
                    // Array of object of file or string of file paths
                    fileArray = preSelected;
                } else if (angular.isString(preSelected)) {
                    // If model is string of single file path or multiple file paths separated by |
                    // Convert to array first
                    fileArray = preSelected.split(/\|\s*/);
                } else if (angular.isObject(preSelected)) {
                    // If model is a single selected object file
                    fileArray = [preSelected];
                } else {
                    console.warn("Unknown incoming pre-selected model '" + JSON.stringify(preSelected) + "'");
                }
                fileArray.forEach(function (file, index) {
                    // If model is list of paths
                    if (angular.isString(file)) {
                        fileArray[index] = {path: file};
                    }
                });
                return fileArray;
            }

            function syncModelToCallback() {
                if (angular.isFunction(options.onFileSelect)) {
                    var fileArray = [];
                    var exportAttrs = ['id', 'path', 'name', 'config'];

                    // console.log('syncModelToCallback');
                    var files = _.values(that.selectionMap);
                    _.each(files, function (file) {
                        fileArray.push(_.pick(file, exportAttrs));
                    });

                    options.onFileSelect(fileArray);
                    // console.log('syncModelToCallback', that.selectionMap, output);
                }
            }
        }

        /**
         * get all selected files
         * @returns {Array}
         */
        function getSelectedFiles() {
            return _.values(that.selectionMap);
        }

        function refreshList() {
            listFiles(that.repo, that.dir);
        }

        /**
         *
         * @param file file or patchAction
         */
        function showFileStatus(file) {
            var isPatch = typeof file === 'string';
            if (!isPatch && !file.isOwner && !that.isGFSModuleAdmin) {
                return;
            }

            if (!isPatch && that.options.canApprove && file._stageExists) {
                gfsActionHelper.openApprove(file, that.afterChangeStatus, that.refreshFileStatusMark);
            } else {
                var isVisible = $element.find('.dropdown-menu').is(':visible');
                var toOpenDropdown = !isVisible;
                if (toOpenDropdown) {
                    that.refreshFileStatusMark++;
                    // console.log(that.refreshFileStatusMark);
                }
                that.currentFile = isPatch ? file : file.path;
            }
        }

        function showRevList(filePath) {
            that.currentFile = filePath;
        }

        function checkApproveHistory(file) {
            gfsActionHelper.openApproveHistory(file);
        }

        function clickRevEntry(filePath) {
            // that.popover.open = '';//(that.popover.open === filePath) ? '' : filePath;
        }

        function cut() {
            that.clipboard.data = that.selectionMap;
            that.clipboard.canPaste = false;

            that.selectionMap = {};

            //cookie clipboard info for page refresh
            $sessionStorage['oplus-gfs-clipboard'] = that.clipboard;

            messageService.toast('success', $translate.instant("gfs.common.cut"), $translate.instant("gfs.list.cut_info"));
            console.dir(that.clipboard.data);
            console.log(that.dir)
        }

        /**
         * paste outside the cut folder
         * @returns {boolean}
         */
        function canPaste() {
            var cutPaths = _.keys(that.clipboard.data);
            if (cutPaths.length) {
                var cutDir = that.clipboard.data[cutPaths[0]].dir || '';
                var pasteDir = that.dir;

                console.log('paste dir', pasteDir);
                console.log('cut dir', cutDir);
                var isPasteInCutFolders = cutPaths.some(function (path) {
                    return that.options.base !== pasteDir && pasteDir.indexOf(path) !== -1;
                });
                console.log('paste dir', pasteDir);
                console.log('cut dir', cutDir);
                console.log('isPasteInCutFolders', isPasteInCutFolders);
                return !isPasteInCutFolders && cutDir !== pasteDir;
            }

            return false;
        }

        function paste() {
            if (!canPaste()) {
                return;
            }

            var filePaths = _.values(that.clipboard.data).map(function (file) {
                return file.path;
            });

            // console.dir(_.values(that.clipboard.data));
            gfileService.moveFiles(that.repoType, that.repo, that.dir, filePaths).then(function (data) {
                that.clipboard.data = {};
                messageService.toast('success', $translate.instant("gfs.list.moved_success"));
                refreshList();
            }).catch(function (err) {
                messageService.confirmDanger($translate.instant("gfs.list.moved_fail"), err.toString());
            });
        }

        function refreshClipboard() {
            // console.log('Run refreshClipboard');
            that.clipboard.canPaste = canPaste();
        }

        function resetSelection() {
            that.selectionMap = {};
            that.clipboard.data = [];
            that.clipboard.canPaste = false;

            $sessionStorage['oplus-gfs-clipboard'] = that.clipboard;
        }

        function selectFile(file) {
            // console.log("Run selectFile");
            if (that._multiSelect) {
                // Toggle checkbox state
                if (that.selectionMap[file._key]) {
                    delete that.selectionMap[file._key];
                } else {
                    that.selectionMap[file._key] = file;
                }
            } else {
                that.selectionMap = {};
                that.selectionMap[file.path] = file;
            }

            that.selectedFiles = _.values(that.selectionMap);
        }

        function selectAll() {
            if (that.allChecked) {
                // that.selectionMap = {};
                that.fileList.forEach(function (f) {
                    //Bug fix excluded file cannot be selected
                    if (!f.directory && !f._excluded && !f._isParentDir) {
                        // if (f.id && !f.directory) {
                        that.selectionMap[f._key] = f;
                    } else {
                        // fix multi select of folders
                        if (!f._isParentDir) {
                            selectFile(f);
                        }
                    }
                });
            } else {
                that.selectionMap = {};
            }
            that.selectedFiles = _.values(that.selectionMap);
        }

        function downloadFile() {

            var selectionMap = that.selectionMap;
            if (_.isEmpty(selectionMap)) {
                return;
            }

            var paths = _.values(selectionMap).map(function (file) {
                return file.path;
            });

            if (paths.length === 1) {
                paths = paths[0];
            }

            gfsActionHelper.downloadFile({repoType: that.repoType, repo: that.repo, path: paths});

        }

        function singleDownloadFile(file) {
            var repoType = file.repoType || "staticfs";
            gfsActionHelper.downloadFile({
                repo: file.repo, repoType: repoType, path: file.path, saveFilename: file.name
            });
        }

        function singleDownloadDir(file) {
            gfileService.downloadFiles(that.repoType, that.repo, [file.path], file.name)
        }

        function addFile() {
            var config = {
                repoType: this.repoType, repo: this.repo, dir: this.dir, callback: refreshList
            };
            gfsActionHelper.openFileEditor(config, true, true);
        }

        function addFolder() {
            var config = {repoType: this.repoType, repo: this.repo, dir: this.dir, callback: refreshList};
            gfsActionHelper.openFolderEditor(config, true, false);
        }

        function refresh() {
            refreshList();
            messageService.toast('success', $translate.instant("gfs.basic.refesh_repo"));
        }

        // function repair() {
        //     gfileService.repair(that.repoType, that.repo).then(function (data) {
        //         if (data) {
        //             messageService.toast('success', $translate.instant("gfs.basic.repair.success"));
        //         } else {
        //             messageService.toast('error', $translate.instant("gfs.basic.repair.failed"));
        //         }
        //     }).catch(function (err) {
        //         messageService.toast('error', $translate.instant("gfs.basic.repair.failed") + err);
        //     });
        // }
        function goBaseRepo() {
            $state.go('app.gfs.git_repo_dir', {repo: that.repo, dir: 'oplus'});
        }

        function addOnlineFile() {
            var config = {repoType: this.repoType, repo: this.repo, dir: this.dir, callback: refreshList};
            gfsActionHelper.openFileOnlineEditor(config, true, false);
        }

        function repairJgit() {
            var config = {repoType: this.repoType, repo: this.repo, dir: this.dir, callback: refreshList};
            gfsActionHelper.openRepairJgitEditor(config, true, false);
        }

        function syncFile() {
            var config = {repoType: this.repoType, repo: this.repo, dir: this.dir, callback: refreshList};
            gfsActionHelper.openSyncFileEditor(config, true, false);
        }

        function repoSettings() {
            var config = {repoType: this.repoType, repo: this.repo, dir: this.dir, callback: refreshList};
            gfsActionHelper.openRepoSettings(config);
        }

        function repoList() {
            var config = {repoType: this.repoType, repo: this.repo, dir: this.dir, callback: refreshList};
            gfsActionHelper.openRepoList(config);
        }

        function gitPull() {
            gfileService.gitPull(that.repoType, that.repo).then(function (data) {
                if (data.result === "success") {
                    messageService.toast('success', $translate.instant("gfs.basic.pull_success"));
                    $timeout(function () {
                        refreshList();
                    }, 2000)
                } else {
                    messageService.toast('error', $translate.instant("gfs.basic.pull_failed"));
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("gfs.basic.pull_failed") + err);
            });
        }

        function gitPush() {
            gfileService.gitPush(that.repoType, that.repo).then(function (data) {
                if (data.result === "success") {
                    messageService.toast('success', $translate.instant("gfs.basic.push_success"));
                    $timeout(function () {
                        refreshList();
                    }, 2000)
                } else {

                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("gfs.basic.push_failed") + err);
            });
        }

        function editFile(file) {
            var config = {
                repoType: file.repoType || 'staticfs',
                repo: file.repo,
                dir: this.dir,
                id: file.id,
                path: file.path,
                callback: refreshList
            };
            gfsActionHelper.openFileEditor(config, false, true);
        }

        function editDir(file) {
            var config = {
                name: file.name,
                desc: file.description, // Only allow script library to edit folder info(Default param is git)
                repoType: 'git',
                repo: file.repo,
                dir: this.dir,
                id: file.id,
                path: file.path,
                callback: refreshList
            };
            gfsActionHelper.openFolderEditor(config, false, false);
        }

        /**
         *  if files is null then use selected files
         * @param files
         */
        function deleteFiles(files) {
            files = files ? files : _.values(that.selectionMap);

            var filePaths = files.map(function (file) {
                return file.path;
            });

            messageService.confirm($translate.instant("gfs.list.delete_sure"), $translate.instant("gfs.list.delete_sure_info"), function () {
                gfileService.deleteFiles(that.repoType, that.repo, filePaths).then(function (data) {
                    messageService.toast('success', $translate.instant("gfs.list.delete_success"));
                    resetSelection();
                    refreshList();
                }).catch(function (err) {
                    messageService.confirmDanger($translate.instant("gfs.list.delete_success"), err.toString());
                });
            });
        }

        /**
         * batch download files
         * @param files
         */
        function downloadFiles(files) {
            files = files ? files : _.values(that.selectionMap);

            var filePaths = files.map(function (file) {
                return file.path;
            });

            var currentTime = $filter('date')(new Date(), "yyyyMMddHHmmss");
            gfileService.downloadFiles(that.repoType, that.repo, filePaths, currentTime);
            resetSelection();

            // messageService.confirm('下载确认', '确定下载文件吗？', function () {
            //     var currentTime = $filter('date')(new Date(), "yyyyMMddHHmmss");
            //     gfileService.downloadFiles(that.repoType, that.repo, filePaths, currentTime);
            //     resetSelection();
            // });
        }

        function testRun(file) {
            // console.log('---------------');
            // console.dir(file);
            gfsActionHelper.openTestRun({path: file.path, repoType: file.repoType, repo: file.repo});
        }

        function sortBy(attr, elem) {
            if (!that.fileList) {
                return;
            }
            that.sortConfig = that.sortConfig || {};
            var order = that.sortConfig.order;
            that.sortConfig.order = (order === 'desc' || !order) ? 'asc' : 'desc';
            that.fileList.sort(function (a, b) {
                if (a.directory && !b.directory) return -1; else if (!a.directory && b.directory) return 1; else if (a.directory && b.directory) {
                    if (a.name === PARENT_DIR) return -1;
                    if (b.name === PARENT_DIR) return 1;
                }
                var valA = a[attr], valB = b[attr];
                var result = valA < valB ? -1 : (valA > valB ? 1 : 0);
                if (order === 'desc') {
                    result = 0 - result;
                }
                return result;
            });
            elem.closest('.op-table-thead').find('.op-table-th').removeClassMatch(/sorting_.*/);
            elem.addClass('sorting_' + order);
        }

        function listFiles(repo, dir) {
            that.repo = repo;
            that.dir = dir;
            that.emptyFolder = false;
            // that.currentDir = dir;
            if (basePath.isInclude(dir)) {
                // console.log('listFiles', that.repoType);
                var opts = {includeStage: that.options.includeStage && that.repoType === 'git'};
                gfileService.listFiles(repo, dir || '', that.repoType, opts).then(function (fileList) {
                    that.fileList = _.sortBy(fileList, ['directory', 'name'], ['desc', 'asc']);
                    // If not root dir
                    var parent = basePath.parentDir(dir);
                    if (parent !== null) {
                        that.fileList.unshift({
                            name: PARENT_DIR,
                            directory: true,
                            lastModified: '',
                            dir: parent,
                            path: parent,
                            _isParentDir: true,
                            _selectable: false
                        });
                    }
                    var filterRegex;
                    if (that.options.fileFilter) {
                        if (angular.isString(that.options.fileFilter)) {
                            var regex = that.options.fileFilter.replace(/\s*,\s*/g, ')|(').replace(/^/, '(').replace(/$/, ')').replace(/\*/g, '.*');
                            filterRegex = RegExp(regex);
                        }
                    }
                    that.fileList.forEach(function (f, index) {
                        f._key = f.path;
                        if (filterRegex) {
                            //TODO: need support more complex filters
                            if (!filterRegex.test(f.name)) {
                                f._excluded = true;
                            }
                        }
                        gfileService.detectStatus(f);
                        parseFileCss(f, that.options.showStageStatus);

                        //异常提示
                        if (f.conflict === 'RecordNotFound') {
                            f._warnCss = 'fa fa-question text-warning';
                            f._warnText = $translate.instant("gfs.list.record_not_found_info");
                        } else if (f.conflict === 'FileNotFound') {
                            f._warnCss = 'fa fa-exclamation text-danger';
                            f._warnText = $translate.instant("gfs.list.file_not_found_info");
                        }
                        var showIndicatorForRejectedStage = !false;
                        if (f._stageStatus && that.repoType !== 'stage') {
                            if (f._stageStatus === 'REJECTED' && !showIndicatorForRejectedStage) {
                            } else {
                                f._stageIndicator = {
                                    // color: f._stageStatus === 'REJECTED' ? 'warning' : 'primary',
                                    text: $translate.instant("gfs.list.new_version") + '：' + f._stageStatusText
                                };
                            }
                        }

                        //文件或文件夹图标
                        if (f._isParentDir) {
                            f._iconCss = 'fa fa-level-up fa-fw text-muted';
                        } else if (f.directory) {
                            f._iconCss = 'fa fa-folder fa-fw text-muted';
                        } else {
                            f._iconCss = 'fal fa-file fa-fw text-muted';
                        }
                        f._selectable = !f._excluded && !f._isParentDir;//support batch delete/move/modify/approve
                        // f._selectable = !f._excluded && !f.directory && (that.repoType === 'git' ? f.onlineStatus === 'PUBLISHED' : true);
                        if (f.directory) {
                            if (that.options.dirSize === 'size') f._size = $filter('filesize')(f.size, 0); else if (that.options.dirSize === 'children') f._size = f.size; else f._size = '';
                        } else {
                            f._size = $filter('filesize')(f.size, 0);
                        }

                        f.isOwner = currentUser.loginId === f.createdBy;
                        f.canUpdate = f.isOwner || currentUser.hasPermission('gfs:edit');
                        f.canDelete = f.isOwner || currentUser.hasPermission('gfs:edit');

                    });
                    that.fileList.forEach(function (f, index) {
                        if (f.path === 'oplus' && that.hideDir === true) {
                            that.fileList.splice(index, 1);
                        }
                    })
                    if (that.fileList.length === 0 || (that.fileList.length === 1 && that.fileList[0]._isParentDir)) {
                        that.emptyFolder = true;
                    }
                    // setTimeout(function () {
                    //     $('.js-file-list').DataTable({dom: 't', paging: false});
                    // }, 500);
                    // console.dir(that.fileList);
                }).catch(function (err) {
                    throw new FatalError(err);
                });

                that.breadcrumbs = basePath.splitBreadcrumbs(dir);
            } else {
                alert('Try to dir "' + dir + '" but is restricted directory ' + basePath.baseDir);
            }

            refreshClipboard();

            /**
             *
             *  _masterStatus: DISABLED (.gfs-master-disabled), PUBLISHED (.gfs-master-published),
             * _stageStatus: REJECTED (.gfs-stage-rejected), (.gfs-stage-exist)
             * _conflict: RecordNotFound (.gfs-missing-rec), FileNotFound (.gfs-missing-file)
             * @param file
             * @param showStageStatus
             */
            function parseFileCss(file, showStageStatus) {
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
                var list = [];
                var master = {'DISABLED': 'gfs-master-disabled', 'PUBLISHED': 'gfs-master-published'};
                var stage = {'REJECTED': 'gfs-stage-rejected'};
                var warn = {'RecordNotFound': 'gfs-missing-rec', 'FileNotFound': 'gfs-missing-file'};
                if (showStageStatus && file._stageExists) {
                    list.push({css: 'gfs-stage-exist', desc: $translate.instant("gfs.list.have_new_version")});
                    list.push({
                        css: stage[file._stageStatus], desc: STAGE_STATUS_DEFS[file._stageStatus].text
                    });
                }
                list.push({css: '', desc: file.repoType});
                if (file.repoType === 'GIT' && file.onlineStatus) {
                    list.push({
                        css: master[file.onlineStatus], desc: MASTER_STATUS_DEFS[file.onlineStatus].text
                    });
                }
                if (file.conflict) {
                    list.push({css: warn[file.conflict], desc: file.conflict});
                }
                file._statusClass = _.map(list, 'css').join(' ');
                file._statusDesc = _.map(list, 'desc').join(' ');
            }
        }

        function goDir(dir) {
            if (options.changeUrl) {
                $state.go($state.current, {repo: that.repo || '$tnt', dir: dir});
            } else {
                listFiles(that.repo, dir);
            }
        }

        function gotoStage(file) {
            if (that.options.jumpToApprove && file._stageExists) {
                $state.go('app.gfs.git_repo_dir_approve', {repo: that.repo || '$tnt', dir: file.dir});
            }
        }

        function goFile(file) {
            // console.log('goFile',file);
            if (file.directory) {
                goDir(file.path);
            } else if (file.conflict !== 'FileNotFound') {
                gfileService.openFileContentViewer(file.repoType || that.repoType, file.repo || that.repo, file.path);
            }
        }

        function showApprovalHistory() {
            gfsActionHelper.openAllApproveHistory();
        }
    }

    /**
     *
     * @param {string} baseDir The base directory within which all paths are restricted
     * @constructor
     */
    function Path(baseDir) {
        var that = this;
        var BASE_NAME = '';
        this.baseDir = baseDir = baseDir || '';
        this.splitBreadcrumbs = splitBreadcrumbs;
        this.isInclude = isInclude;
        this.parentDir = parentDir;

        /**
         * Split a path to sub-directories.
         * @param {string} dirPath Path of a directory relative to root
         * @returns {[{name:string, path:string}]} Name is sub-directory name, path is sub-directory path
         */
        function splitBreadcrumbs(dirPath) {
            // console.log(dirPath)
            var baseDir = that.baseDir;
            var crumbs = [];
            var dirs = [''];
            if (dirPath) {
                if (baseDir) {
                    if (dirPath.indexOf(baseDir) === 0) {
                        // If path is inside of base dir, trim leading base dir to get base-relative path
                        dirPath = dirPath.substring(baseDir.length);
                    } else {
                        // If path is outside of base dir
                        return [];
                    }
                } else {
                    // If base is root
                }
                // Now we get dir path relative to base
                dirs = dirPath.split('/');
                if (!baseDir) {
                    dirs.unshift('');
                }
            }
            var currentPath = baseDir || '';
            for (var i = 0; i < dirs.length; i++) {
                var seg = dirs[i];
                currentPath = currentPath + seg;
                crumbs.push({name: seg ? seg : BASE_NAME, path: currentPath});
                if (i < dirs.length - 1 && currentPath !== '') {
                    currentPath += '/';
                }
            }
            return crumbs;
        }

        /**
         *
         * @param path
         * @returns {string|null} Null if parent is out of base dir
         */
        function parentDir(path) {
            if (!path) return null;
            // Remove last dir (self) from path
            var arr = path.split('/');
            arr.splice(-1, 1);
            var parent = arr.join('/');
            if (isInclude(parent)) {
                return parent;
            } else {
                return null;
            }
        }

        function isInclude(dir) {
            return !baseDir || dir.indexOf(baseDir) === 0;
        }
    }
})();
