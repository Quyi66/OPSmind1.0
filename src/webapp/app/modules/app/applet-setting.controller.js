/**
 * @author Joker Liu (qdjoker@126.com), created on 2/12/2020.
 */
(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletSettingCtrl', AppletSettingCtrl);

    AppletSettingCtrl.$inject = ['$q', '$rootScope', '$state', '$stateParams', '$translate', 'messageService', 'appletService', 'OpUpload', 'currentUser', 'appletSecurity', 'udpTagsService'];

    /**
     *
     * @param $q
     * @param $rootScope
     * @param $state
     * @param $stateParams
     * @param $translate
     * @param messageService {messageService}
     * @param appletService {appletService}
     * @param OpUpload
     * @param currentUser
     * @param {appletSecurity} appletSecurity
     * @constructor
     */
    function AppletSettingCtrl($q, $rootScope, $state, $stateParams, $translate, messageService, appletService, OpUpload, currentUser, appletSecurity, udpTagsService) {

        var that = this;//$scope;
        that.sortableOptions = {
            handle: '.op-drag-handle'
        };
        that.applet = {};
        that.tags = [];
        that.entryTypes = appletService.getAllEntryTypes();
        that.entryType = that.entryTypes[0].code;
        that.removeNavItem = removeNavItem;
        that.save = save;
        that.delete = deleteApplet;
        that.uploadHelpDoc = uploadHelpDoc;
        that.getHelpDocName = getHelpDocName;
        that.removeHelpDoc = removeHelpDoc;
        var existingHelpDocUrl;//缓存文档路径，用于替换操作

        var defaultOption = {
            setting: {
                icon: 'fa-question-circle',
                // theme: 'default',//应用主题
                nav: {
                    theme: 'light',//导航主题风格
                    position: 'left',
                    hide: false,//是否隐藏
                    hideOnHome: false,//不显示在首页
                    items: []
                },
                // accessControl: {roles: {}}
            },
            version: '1.0',
            status: 'C'//Composing;Published;Deleted
        };

        var defaultAccessControl = {roles: {}};

        /**
         * query app by name
         */
        function init() {
            udpTagsService.findTagsByTenantId().then(function (result) {
                that.tags = result;
            });
            if ($stateParams.appletCode) {
                appletService.findAppletByCode($stateParams.appletCode, {disableI18n: true}).then(function (result) {
                    that.applet = result;
                    that.applet.accessControl = !that.applet.accessControl ? defaultAccessControl : JSON.parse(result.accessControl)
                    existingHelpDocUrl = result.helpDocUrl;
                    //to adjust the existing app which not have nav setting
                    that.applet.setting = $.extend(true, defaultOption.setting, that.applet.setting);
                    that.applet.isOwner = currentUser.loginId === that.applet.createdBy;
                    that.applet.canDelete = appletSecurity.canDeleteApplet(that.applet.code, that.applet.createdBy);
                    that.applet.canUpdate = that.applet.isOwner || currentUser.hasPermission('app:edit:*');
                    that.entryType = appletService.getEntryTypeFromEntry(that.applet.entry);
                }).catch(function (e) {
                    messageService.alertError($translate.instant("app.setting.messages.error.queryApp"), e.message);
                });
            } else {
                that.applet = defaultOption;
                that.applet.canUpdate = currentUser.hasPermission('app:edit:*');
                that.applet.accessControl = defaultAccessControl;
            }
        }

        init();


        /**
         * app code id unique
         */
        function save() {
            if (that.applet.id) {
                doSave();
            } else {
                appletService.isNameInUse(that.applet.name).then(function (result) {
                    if (result) {
                        messageService.confirmWarning($translate.instant("app.setting.messages.warn.codeUse.title"), $translate.instant("app.setting.messages.warn.codeUse.body"))
                    } else {
                        doSave();
                    }
                }).catch(function (e) {
                    messageService.alertError($translate.instant("app.setting.messages.error.jugeCode"), e.message);
                    //console.log(e);
                });
            }
        }

        // function cancel() {
        //     $state.go('app.appman');
        // }

        /**
         * reload app list after saving
         */
        function doSave() {
            var promiseArr = [appletService.saveApplet(that.applet)];
            if (tempHelpDocFileId && existingHelpDocUrl !== tempHelpDocPath) {
                promiseArr.push(OpUpload.confirm('applet', 'help', [tempHelpDocFileId]));
            }

            //替换帮助文档，需要清理已有文档
            if (existingHelpDocUrl && tempHelpDocPath && existingHelpDocUrl !== tempHelpDocPath) {
                removeFileFromDisk(existingHelpDocUrl);
            }

            $q.all(promiseArr).then(function () {
                existingHelpDocUrl = tempHelpDocPath;

                messageService.toast('success', $translate.instant("app.setting.messages.info.appCreated"));
            }).catch(function (e) {
                messageService.alertError($translate.instant("app.setting.messages.error.appCreated"), e.message);
            });
        }

        /**
         * delete by id
         */
        function deleteApplet() {
            messageService.confirm($translate.instant("common.entity.delete.title"), $translate.instant("app.setting.messages.warn.deleteApp.question", {"title": that.applet.title}), function () {
                appletService.deleteAppletAdm(that.applet.id).then(function () {
                    messageService.toast('success', $translate.instant("app.setting.messages.info.deletedApp"));
                    $rootScope.$broadcast('APPLET_CHANGED');
                    $state.go('app.applist', {}, {reload: true});
                }).catch(function (e) {
                    messageService.alertError($translate.instant("app.setting.messages.error.deletedApp"), e.message);
                    //console.log(e);
                });
            });
        }

        /**
         * get doc name for show
         * @returns {string}
         */
        function getHelpDocName() {
            if (that.applet.helpDocUrl) {
                return OpUpload.getOriginalNameFromPath(that.applet.helpDocUrl);
            } else {
                return '';
            }
        }


        /**
         * 临时上传帮助文档
         * @param files
         */
        var tempHelpDocFileId;
        var tempHelpDocPath;

        function uploadHelpDoc(file) {
            if (file != null) {
                if (file.size > 10000 * 1024) {//图片大小不能超过2000kb
                    messageService.confirm($translate.instant("app.setting.messages.warn.uploadFile.title"), $translate.instant("app.setting.messages.warn.uploadFile.body"), function () {
                    });
                    return;
                }

                OpUpload.preUpload('applet', 'help', [file]).then(function (result) {
                    tempHelpDocPath = result.data[0].path;
                    tempHelpDocFileId = result.data[0].id;

                    that.applet.helpDocUrl = tempHelpDocPath;
                    messageService.toast('success', $translate.instant("app.setting.messages.info.uploadFile"));

                    // refreshAvatar(filePath, true);
                }).catch(function (e) {
                    messageService.alertError($translate.instant("app.setting.messages.error.uploadFile"), e.message);
                    //console.log(e);
                });
            } else {
                messageService.toast('warning', $translate.instant("app.setting.messages.warn.uploadFile"));
            }
        }

        /**
         * 移除帮助文档
         */
        function removeHelpDoc() {
            that.applet.helpDocUrl = '';
            tempHelpDocFileId = null;
            tempHelpDocPath = '_delete';
            messageService.toast('success', $translate.instant("app.setting.messages.info.removeDoc1") + (existingHelpDocUrl ? $translate.instant("app.setting.messages.info.removeDoc2") : ''));

        }

        /**
         * make name not empty to satisfy form validate
         * @param item nav item
         */
        function removeNavItem(item) {
            item.isRemoved = true;
            item.name = '-';
        }

        /**
         * remove file from disk
         * @param fileUrl
         */
        function removeFileFromDisk(fileUrl) {
            return OpUpload.delete('applet', 'help', null, [fileUrl]).then(function () {
                console.log('file[' + fileUrl + ']successfully removed from disk');
            }).catch(function (e) {
                messageService.alertError($translate.instant("app.setting.messages.error.removeFile"), e.message);
                //console.log('file[' + fileUrl + ']failed removed from disk', e);
            });
        }

    }
})();
