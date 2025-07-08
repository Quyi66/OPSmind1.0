/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-01-03
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name gfs-gfile-content
     * @description
     *
     * there are two way to assign the target file: by file object or by path and repo
     *
     * ```html
     * <gfs-gfile-content path="string" repo-type="string" repo="string" file="object?" options="object">
     *
     * ```
     * @param {object=} file file Object
     * @param {string=} path
     * @param {string=} repoType Repository type
     * @param {{showExtraInfo:boolean, editable:boolean}} options
     */
    angular.module('oplus.gfs').component('gfsGfileContent', {
        bindings: {
            file: '<', path: '<', repoType: '<', repo: '<', saveFilename: '<', options: '<'
        },
        templateUrl: 'app/modules/gfs/gfile-content.html',
        controller: ['$scope', '$timeout', 'gfileService', 'gfsActionHelper', 'restUtils', 'modalHelper', GfileContentCtrl]
    });

    /**
     * @param $scope
     * @param {gfileService} gfileService
     * @param {gfsActionHelper} gfsActionHelper
     */
    function GfileContentCtrl($scope, $timeout, gfileService, gfsActionHelper, restUtils, modalHelper) {
        var VIEW_MODE_RAW = 'raw', VIEW_MODE_RENDER = 'render';
        var that = this;
        this.options = this.options || {};
        this.mode = '';
        this.cmModes = ['javascript', 'xml', 'shell'];
        this.downloadFile = downloadFile;
        this.editFile = editFile;
        this.switchViewMode = switchViewMode;
        this.cmOptions = {
            lineNumbers: true,
            theme: this.options.editable ? 'opluscode' : 'default',
            lineWrapping: true,
            readOnly: !this.options.editable,
            onLoad: function (cm) {
                // Hack to get the cm instance
                that.modeChanged = function () {
                    cm.setOption('mode', that.mode.toLowerCase());
                }
            }
        };

        this.$onInit = function () {
            if (that.file) {
                // console.log('Init GfileContentCtrl by file Object');
                init();
            } else if (that.path) {
                refreshContent()
            } else {
                throw new Error('ProgramError: Both file and path are empty.')
            }
        };

        function refreshContent() {
            gfileService.getFileInfo(that.repoType, that.repo, that.path, true).then(function (data) {
                // console.log(data)
                that.relFile = data
                that.file = data.fileContent;
                that.file.path = data.path;
                init();
            }).catch(function (err) {
                throw err;
            });
        }

        /**
         *
         * @param {object} file
         * @param {string} file.name
         * @param {string} file.content
         * @param {string} file.mime
         * @param {string} file.content
         */
        function determineViewMode(file) {
            var mime = file.mime;
            that.viewMode = VIEW_MODE_RENDER;
            if (mime.indexOf('image') === 0) {
                that.renderView = 'image';
            } else if (mime.indexOf('html') > -1) {
                that.renderView = 'html';
                $timeout(function () {
                    var doc = document.getElementById('js-html-content').contentWindow.document;
                    doc.open();
                    doc.write(file.content);
                    doc.close();
                });
            } else if (mime.indexOf('markdown') > -1) {
                that.renderView = 'markdown';
                if (that.options.editable) that.viewMode = that.options.editable === false ? VIEW_MODE_RENDER : VIEW_MODE_RAW;
            } else if (isPlaybook(that.file)) {
                that.renderView = 'playbook';
                that.viewMode = VIEW_MODE_RAW;
            } else if (mime.indexOf('sheet') > -1) {
                that.renderView = 'sheet';
                $timeout(function () {
                    readSheet(file)
                })
            } else {
                that.viewMode = VIEW_MODE_RAW;
            }
            console.log(that.viewMode)

            function isPlaybook(file) {
                var filename = file.name;
                if (filename.endsWith('.yml') || filename.endsWith('.yaml')) {
                    try {
                        var items = jsyaml.load(file.content);
                        if (angular.isArray(items) && items.length > 0) {
                            var keyItem = _.find(items, function (o) {
                                return o.hosts || o.name;
                            });
                            return !!keyItem;
                        }
                    } catch (e) {
                        return false;
                    }
                }
                return false;
            }
        }

        function readSheet(file) {
            // TODO This repos has been abandoned, using https://github.com/dream-num/univer
            LuckyExcel.transformExcelToLuckyByUrl(file.url, file.name, function (exportJson, luckysheetfile) {
                if (exportJson.sheets == null || exportJson.sheets.length === 0) {
                    console.log("Failed to read the content of the excel file, currently does not support xls files!");
                    return;
                }
                window.luckysheet.destroy();
                window.luckysheet.create({
                    container: 'js-sheet-content',
                    showinfobar: false,
                    lang: 'zh_tw',
                    data: exportJson.sheets,
                    title: exportJson.info.name,
                    userInfo: exportJson.info.name.creator
                });
            })
            modalHelper.maximizeOrRestoreModal()
        }

        function init() {
            var apiPath = encodeURIComponent(that.file.downloadUri);
            var mime = that.file.mime;
            that.file.url = restUtils.getApiUrl('gfs', apiPath);
            determineViewMode(that.file);
            that.cmOptions.mode = detectCmMode(that.file.name) || '';
            that.cmOptions.readOnly = !that.options.editable || !gfileService.isFileContentEditable(mime);
        }

        function switchViewMode() {
            that.viewMode = that.viewMode === VIEW_MODE_RAW ? VIEW_MODE_RENDER : VIEW_MODE_RAW;
        }

        function downloadFile() {
            gfsActionHelper.downloadFile({
                repo: that.file.repo, repoType: that.repoType, path: that.file.path, saveFilename: that.saveFilename
            });
        }

        function editFile() {
            var config = {
                repoType: that.relFile.repoType || 'staticfs',
                repo: that.relFile.repo,
                dir: that.relFile.dir,
                id: that.relFile.id,
                path: that.relFile.path,
                callback: refreshContent
            };
            gfsActionHelper.openFileEditor(config, false, true);
        }

        function detectCmMode(filename) {
            if (!CodeMirror) return;
            var info = CodeMirror.findModeByFileName(filename);
            if (info) {
                return info.mode;
            }
        }
    }
})();
