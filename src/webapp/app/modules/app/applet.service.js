/**
 * @author Joker Liu (qdjoker@126.com), created on 2/12/2020.
 */

(function () {
    'use strict';
    var app = angular.module('oplus.app');

    app.service('appletService', appletService);

    appletService.$inject = ['$rootScope', '$http', '$q', '$translate', 'modalHelper', 'restUtils', 'messageService', 'currentUser'];

    /**
     * @ngdoc service
     * @name appletService
     * @param $http
     * @param $q
     * @param {restUtils} restUtils
     * @param {$translate} $translate
     * @param {modalHelper} modalHelper
     * @param messageService {messageService}
     * @param currentUser {currentUser}
     */
    function appletService($rootScope, $http, $q,
        $translate, modalHelper,
        restUtils, messageService, currentUser) {
        // var that = this, clipboards = [];
        // var appletInEdit = undefined;
        // this.PAGE_WRAPPER_SELECTOR = '.js-applet-wrapper';

        // CRUD
        var ADM_MODULE = "adm";

        this.findAppletByCode = findAppletByCode;
        this.findApplets = findApplets;
        this.saveApplet = saveApplet;
        this.deleteApplet = deleteApplet;
        this.deleteAppletAdm = deleteAppletAdm;
        this.isNameInUse = isNameInUse;
        // this.downloadHelpDoc = downloadHelpDoc;
        this.getHelpDocDownloadUrl = getHelpDocDownloadUrl;
        this.updateAppletOrder = updateAppletOrder;
        this.getAllEntryTypes = getAllEntryTypes;
        this.getEntryTypeFromEntry = getEntryTypeFromEntry;
        this.openAppletSelectorModal = openAppletSelectorModal;
        this.getMyRolesInApplet = getMyRolesInApplet;
        this.getMyRolesInAllApplets = getMyRolesInAllApplets;
        this.saveAppletsByTenantUser = saveAppletsByTenantUser;
        this.findAppletsByTenantUser = findAppletsByTenantUser;
        this.saveAppletsByTeam = saveAppletsByTeam;
        this.findAppletsByTeam = findAppletsByTeam;


        /**
         * Get roles of current user in an applet
         * @param {string} appletCode
         * @return {Promise<[string]>}
         */
        function getMyRolesInApplet(appletCode) {
            return restUtils.callApi('udp', 'GET', '/api/udp/applets/{appletCode}/my-roles', { appletCode: appletCode });
        }

        /**
         * Get roles of current user in all applets
         * @return {Promise<{"appletCode":[string]}>}
         */
        function getMyRolesInAllApplets() {
            return restUtils.callApi('udp', 'GET', '/api/udp/applets/my-roles');
        }

        /**
         * save当前用户的Applets
         * @returns {Promise}
         */
        function saveAppletsByTenantUser(applets, tenantUserId) {
            return restUtils.callApi('udp', 'POST', '/api/udp/applet/tenant/{tenantUserId}', { tenantUserId: tenantUserId }, applets);
        }


        /**
         * 查看用户的Applets
         * @returns {Promise}
         */
        function findAppletsByTenantUser(tenantUserId, login) {
            return restUtils.callApi('udp', 'GET', '/api/udp/applets/tenant/user', null, {
                tenantUserId: tenantUserId,
                login: login
            });
        }

        /**
         * 批量为团队成员授权应用
         * @param {Array} applets - 应用列表 (包含 _team_applet 标记)
         * @param {string} teamId - 团队ID
         * @returns {Promise}
         */
        function saveAppletsByTeam(applets, teamId) {
            // 提取选中的应用ID列表
            var appletIds = [];
            for (var i = 0; i < applets.length; i++) {
                if (applets[i]._team_applet) {
                    appletIds.push(applets[i].id);
                }
            }
            // 构建请求体: { teamId, appletIds }
            var requestBody = {
                teamId: teamId,
                appletIds: appletIds
            };
            return restUtils.callApi('udp', 'POST', '/api/udp/applets/batch-team-members-permission', null, requestBody);
        }

        /**
         * 查看团队的Applets
         * @param {string} teamId - 团队ID
         * @returns {Promise}
         */
        function findAppletsByTeam(teamId) {
            return restUtils.callApi('udp', 'GET', '/api/udp/applets/team/{teamId}', { teamId: teamId });
        }

        /**
         * Open applet selector modal.
         * @param {function({code:string,title:string})} onSubmit Callback function when click submit/ok button.
         * Function argument is the code, title of selected applet.
         * @param {object} options
         * @param {string} options.label Label text displayed on top of selector control
         */
        function openAppletSelectorModal(onSubmit, options) {
            options = options || {};
            var label = options.label ? options.label : '{{"applet.selector.select_applet"|translate}}';
            var config = {
                template: '<div class="modal-header">' +
                    '<h4 class="modal-title">{{"applet.selector.title"|translate}}</h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal" ng-click="$ctrl.cancel()"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="form-group">' +
                    '<label class="control-label">' + label + '</label>' +
                    '<div class="form-control-wrapper"><applet-selector applet-code="$ctrl.appletCode" on-change="$ctrl.onChange" options="{showAll:true,includeAllAndNull:false}"></applet-selector></div>' +
                    '</div>' +
                    '<div ng-if="$ctrl.history.length>0">' +
                    '<ul class="list list-inline">' +
                    '<li class="" ng-repeat="item in $ctrl.history track by $index">' +
                    '<a href="" class="badge bg-secondary" ng-click="$ctrl.appletCode=item.code">{{item.title}}</a>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" ng-disabled="!$ctrl.appletCode" class="btn btn-primary opx-btn-ok" ng-click="$ctrl.submit()">{{"common.action.ok"|translate}}</button>' +
                    '<button type="button" class="btn btn-default opx-btn-cancel" ng-click="$ctrl.cancel()">{{"common.action.cancel"|translate}}</button>' +
                    '</div>',
                controller: ['userPref', AppletSelectorModalCtrl],
                controllerAs: '$ctrl'
            };
            var modal = modalHelper.openModal(config, {
                onOk: function (applet) {
                    onSubmit(applet);
                }
            });

            /**
             *
             * @param {userPref} userPref
             * @constructor
             */
            function AppletSelectorModalCtrl(userPref) {
                var that = this;
                var HISTORY_STORAGE_KEY = 'appletSelector';
                this.history = (userPref.load()[HISTORY_STORAGE_KEY]) || [];
                this.cancel = function () {
                    modal.dismiss();
                }
                this.submit = function () {
                    var applet = that.selectedApplet;
                    var result = { code: applet.name, title: applet.title };
                    modal.close(result);
                    _.remove(that.history, { code: applet.name });
                    that.history.unshift(result);
                    userPref.saveItem(HISTORY_STORAGE_KEY, that.history.slice(0, 10));
                }
                this.onChange = function (applet) {
                    that.selectedApplet = applet;
                }
            }
        }

        function deleteApplet(id) {
            var d = $q.defer();
            restUtils.callApi('udp', 'DELETE', '/api/udp/applets/{id}', { id: id }).then(function (data) {
                d.resolve(data);
                broadcastAppletChanged();
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function deleteAppletAdm(id) {
            var d = $q.defer();
            restUtils.callApi('adm', 'DELETE', '/api/adm/applet/{id}', { id: id }).then(function (data) {
                d.resolve(data);
                broadcastAppletChanged();
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function findApplets() {
            return restUtils.callApi('udp', 'GET', '/api/udp/applets?isPaging=true', null);
        }

        function saveApplet(app) {
            var applet = angular.copy(app);
            assertAuthentication();
            if (!applet.id) {
                applet.author = currentUser.displayName;
                applet.createdBy = currentUser.loginId;
                applet.createdName = currentUser.displayName;
                applet.modifiedBy = currentUser.loginId;
                applet.modifiedName = currentUser.displayName;
            } else {
                applet.modifiedBy = currentUser.loginId;
                applet.modifiedName = currentUser.displayName;
            }

            //clean removed nav items
            var nav = applet.setting.nav;
            if (nav.items && nav.items.length > 0) {
                nav.items = _.filter(nav.items, function (element) {
                    return !element.isRemoved;
                });
            }

            //save setting as json string
            applet.setting = JSON.stringify(applet.setting);
            applet.accessControl = JSON.stringify(applet.accessControl);

            // console.log("applet = " + JSON.stringify(vm.applet));

            var promise = restUtils.callApi('udp', applet.id ? 'PUT' : 'POST', '/api/udp/applets', null, applet);
            return $q.when(promise, function () {
                broadcastAppletChanged();
            });
            // var d = $q.defer();
            // restUtils.callApi('udp', applet.id ? 'PUT' : 'POST', '/api/udp/applets', null, applet).then(function (data) {
            //     d.resolve(data);
            //     broadcastAppletChanged();
            // }).catch(function (err) {
            //     d.reject(err);
            // });
            // return d.promise;
        }

        function broadcastAppletChanged() {
            //console.log('appletService: broadcastAppletChanged');
            $rootScope.$broadcast('APPLET_CHANGED');
        }

        function updateAppletOrder(id, order) {
            var d = $q.defer();
            restUtils.callApi('udp', 'PUT', '/api/udp/applets/orders', null, {
                id: id,
                order: order
            }).then(function (data) {
                d.resolve(data);
                broadcastAppletChanged();
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function getAllEntryTypes() {
            return [
                {
                    name: $translate.instant("app.service.customPage"),
                    code: 'udp-page'
                },
                {
                    name: $translate.instant("app.service.internalPage"),
                    code: 'inner-page'
                },
                {
                    name: $translate.instant("app.service.externalPage"),
                    code: 'outer-page'
                }
            ];
        }

        function getEntryTypeFromEntry(entry) {
            if (!entry) {
                return null;
            }
            // var allEntries = getAllEntryTypes();
            if (entry.type) {
                return entry.type;
            }
            if (entry) {
                if (/^#\/|\app./.test(entry)) {
                    return 'inner-page';
                } else if (/^http[s]?:\/\//.test(entry)) {
                    return 'outer-page';
                }
            }

            return 'udp-page';
        }

        function assertAuthentication() {
            if (!currentUser.isAuthenticated) {
                messageService.alertError($translate.instant("app.uaa.no_permission_title"), $translate.instant("app.uaa.no_permission_desc"));
                throw new Error('401');
            }
        }

        /**
         * Load applet definition from DB.
         * @param code
         * @param {object=} options
         * @param {boolean=} options.alertIfFail Show error if fail to load applet
         * @param {boolean=} options.disableI18n
         * @returns {Promise<object>} An applet object from DB
         *
         */
        function findAppletByCode(code, options) {
            options = options || {};
            return restUtils.callApi('udp', 'GET', '/api/udp/applets/name/{name}' + (options.disableI18n ? '?__noi18n' : ''), { name: code })
                .then(function (applet) {
                    if (applet) {
                        applet.setting = JSON.parse(applet.setting);
                        return $q.resolve(applet);
                    } else {
                        if (options.alertIfFail) {
                            messageService.alertError($translate.instant("app.service.messages.error.findAppletByCode.title"), $translate.instant("app.service.messages.error.findAppletByCode.body", { name: code }));
                        }
                        return $q.reject(new Error($translate.instant("app.service.messages.error.findAppletByCode.title") + code));
                    }
                }).catch(function (err) {
                    if (err._errorCode === 404) {
                        return $q.reject(new Error($translate.instant("app.service.messages.error.findAppletByCode.title") + code));
                    }
                    return $q.reject(err);
                });
        }

        /**
         * download help foc
         * @param helpDocUrl
         */
        function downloadHelpDoc(helpDocUrl) {
            if (helpDocUrl) {
                helpDocUrl = getHelpDocDownloadUrl(helpDocUrl);
                if (helpDocUrl.indexOf('.doc') != -1 && typeof ActiveXObject !== 'undefined') {
                    var word = new ActiveXObject("Word.Application");
                    word.Visible = true;
                    word.Documents.Open(helpDocUrl);
                } else {
                    window.open(helpDocUrl);
                }
            }
        }

        /**
         * construct absolute url
         * @param relativeUrl
         */
        function getHelpDocDownloadUrl(relativeUrl) {
            return window.$oplus.appConfig.apiBaseUrls.upload + relativeUrl;
        }

        /**
         * 验证name是否被占用
         * @param name
         */
        function isNameInUse(name) {
            var defered = $q.defer();

            findAppletByCode(name).then(function (result) {
                defered.resolve(result);
            }, function (result) {
                defered.resolve(false);
            });

            return defered.promise;
        }


        function getStyles() {
            var styles = [
                {
                    name: ""
                }
            ];

        }
    }
}
)();
