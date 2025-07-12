/**
 *
 * @author Joker Liu (qdjoker@126.com), created on 04/27/2020
 */
(function () {

    /**
     * @ngdoc module
     * @name oplus.app
     */
    angular.module('oplus.app', [
        'oplus.commons',
        'oplus.uaa'
    ]);
})();

/**
 * @author Joker Liu (qdjoker@126.com), created on 04/27/2020
 */

(function () {
    'use strict';
    angular.module('oplus.app').config(appletStates);
    appletStates.$inject = ['$stateProvider', '$urlRouterProvider'];

    /**
     *
     * @param {$stateProvider} $stateProvider
     * @param {$urlRouterProvider} $urlRouterProvider
     */
    function appletStates($stateProvider, $urlRouterProvider) {
        appletMgmtStates();
        appletCrudStates();
        if (!window.$oplus.appConfig.useWindowUI) {
            appletViewStatesForNormalMode();
        }

        $stateProvider
            .state('app.applet_help', {
                url: '/applets/{appletCode}/help',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/app/applet-help.html',
                        controller: 'AppletHelpCtrl',
                        controllerAs: 'appHelpVm'
                    }
                }
            });

        function appletViewStatesForNormalMode() {
            $stateProvider
                .state('app.applet_view', {
                    url: '/applets/{appletCode}',
                    views: {
                        'mainView': {
                            template: '<applet-content the-applet="theApplet"></applet-content>',
                            //TODO: optimize with ui-router and component?
                            controller: ['$scope', 'theApplet', function ($scope, theApplet) {
                                $scope.theApplet = theApplet;
                            }]
                        }
                    },
                    resolve: {
                        theApplet: ['$stateParams', 'appletRunman', function ($stateParams, appletRunman) {
                            //console.log('app.applet_view')
                            return appletRunman.prepareAppletWindowContent($stateParams.appletCode);
                        }]
                    }
                })
                .state('app.applet_view.open_menu', {
                    url: '/menu/:pageId?:p',
                    views: {
                        // Use root
                        //https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views
                        // 'mainView@app': {
                        'applet_main_view': {
                            templateUrl: 'app/modules/udp/page-view-applet.html',
                            controller: 'PageViewCtrl'
                        }
                    },
                    resolve: {
                        pageId: ['$stateParams', function ($stateParams) {
                            return $stateParams.pageId;
                        }],
                        pageParams: [function () {
                            return {};
                        }]
                    }
                })
                .state('app.applet_view.open_page', {
                    url: '/page/:pageId?:p',
                    views: {
                        // Use root
                        //https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views
                        // 'mainView@app': {
                        'applet_main_view': {
                            templateUrl: 'app/modules/udp/page-view-applet.html',
                            controller: 'PageViewCtrl'
                        }
                    },
                    resolve: {
                        pageId: ['$stateParams', function ($stateParams) {
                            return $stateParams.pageId;
                        }],
                        pageParams: [function () {
                            return {};
                        }]
                    }
                });
        }

        function appletCrudStates() {
            $stateProvider
                .state('app.applist', {
                    url: '/applets',
                    views: {
                        'mainView': {
                            template: '<div ui-view="applist_main_view" class="h-100"><applet-list></applet-list></div>'
                        }
                    },
                    useAsApplet: {
                        code: 'applets',
                        type: 'PrivateTool',
                        title: 'app.nav.applet',
                        icon: 'fa-oplus-applet',
                        color: '#2196F3',
                        showIn: {desktop: 100},
                        windowSize: 'md'
                    }
                })
                // .state('app.applist.list', {
                //     url: '/list',
                //     views: {
                //         'applist_main_view': {
                //             template: '<applet-list></applet-list>'
                //         }
                //     }
                // })
                .state('app.applist.create', {
                    url: '/create',
                    views: {
                        'applist_main_view': {
                            templateUrl: 'app/modules/app/applet-setting.html',
                            controller: 'AppletSettingCtrl',
                            controllerAs: 'appSettingVm'
                        }
                    }
                });
            // .state('app.applet_edit', {
            //     url: '/applets/{appletCode}/edit',
            //     views: {
            //         'applist_main_view': {
            //             templateUrl: 'app/modules/app/applet-setting.html',
            //             controller: 'AppletSettingCtrl',
            //             controllerAs: 'appSettingVm'
            //         }
            //     }
            // });

        }

        function appletMgmtStates() {
            $stateProvider
                .state('app.appman', {
                    url: '/applets/{appletCode}/mgmt',
                    //TODO: If use as applet, udp page edit does not display properly
                    __useAsApplet: {
                        type: 'PrivateTool',
                        code: 'appeditor',
                        title: 'Applet Editor',
                        icon: 'fa-magic',
                        color: '#00739D'
                    },
                    views: {
                        'mainView': {
                            templateUrl: 'app/modules/app/applet-mgmt.html',
                            controller: 'AppletSettingCtrl',
                            controllerAs: 'appSettingVm'
                        }
                    }
                })
                .state('app.appman.setting', {
                    url: '/setting',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-setting.html',
                            controller: 'AppletSettingCtrl',
                            controllerAs: 'appSettingVm'
                        }
                    }
                })
                .state('app.appman.page', {
                    url: '/pages',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-mgmt-pages.html',
                            controller: 'AppletMgmtPagesCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.page.create', {
                    url: '/new',
                    views: {
                        // 'content@': {
                        // 'app_mgmt_page_view': {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/udp/page-designer.html',
                            controller: 'PageDesignerCtrl'
                        }
                    }
                })
                .state('app.appman.page.edit', {
                    url: '/:pageId/edit',
                    views: {
                        // 'app_mgmt_page_view': {
                        // 'content@': {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/udp/page-designer.html',
                            controller: 'PageDesignerCtrl'
                        }
                    }
                })
                .state('app.appman.dataset', {
                    url: '/dataset',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-mgmt-datasets.html'
                        }
                    }
                })
                .state('app.appman.dataset.create', {
                    url: '/new',
                    views: {
                        'dts_dataset_list': {
                            templateUrl: 'app/modules/app/applet-mgmt-datasets-edit.html',
                            controller: 'AppletMgmtDatasetsEditCtrl'
                        }
                    }
                })
                .state('app.appman.dataset.edit', {
                    url: '/:id/edit',
                    views: {
                        'dts_dataset_list': {
                            templateUrl: 'app/modules/app/applet-mgmt-datasets-edit.html',
                            controller: 'AppletMgmtDatasetsEditCtrl'
                        }
                    },
                    cache: false
                })
                .state('app.appman.job', {
                    url: '/jobs',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-mgmt-jobs.html',
                            controller: 'AppletMgmtJobsCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.job.view', {
                    url: '/jobs/{id}/view',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/job-edit.html',
                            controller: 'jaoJobEditCtrl',
                            controllerAs: '$ctrl'
                        }
                    },
                    cache: false
                })
                .state('app.appman.job.edit', {
                    url: '/jobs/{id}/edit',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/job-edit.html',
                            controller: 'jaoJobEditCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.job.create', {
                    url: '/jobs/new/{type}',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/job-edit.html',
                            controller: 'jaoJobEditCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.datamodel', {
                    url: '/data/models',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-mgmt-datamodels.html',
                            controller: 'AppletMgmtDataModelsCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.datamodel.create', {
                    url: '/data/model/add/{id}',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/datamodel/dc-data-add.html',
                            controller: 'jaodcDataCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.datamodel.edit', {
                    url: '/data/model/edit/{id}',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/datamodel/dc-data-add.html',
                            controller: 'jaodcDataCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.datamodel.view', {
                    url: '/data/model/view/{id}',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/datamodel/dc-data-add.html',
                            controller: 'jaodcDataCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                });
        }
    }
})();

(function () {
  'use strict';

  angular.module('oplus.udp').service('appletHelper', ['runningState', '$timeout', 'userPref', 'appletRegistry', '$state', 'modalHelper', '$location', appletHelper]);

  function appletHelper(runningState, $timeout, userPref, appletRegistry, $state, modalHelper, $location) {
    var that = this;

    var MAX_CSS = 'maximized';
    var ACTIVE_CSS = 'active';
    var APPLET_WINDOW_CSS = 'op-applet-window';
    var APPLET_WINDOW_ID_PREFIX = 'js-applet-window-';
    var USER_PREF_WINDOW_LAYOUTS = 'windowLayouts';
    var updateLocationWhenActivate = true;

    
    /**
     * Find applet modal window.
     * @param {string} appletCode
     * @return {angular.element} Element of modal or null
     */
    that.findAppletModal = function(appletCode) {
      var elem = $('#' + APPLET_WINDOW_ID_PREFIX + appletCode);
      if (elem.length === 0) return null;
      return elem;
    }

    that.buildOptions = function (applet) {
      var options = {
        resizable: true,
        onModalessActivated: function () {
          //LEO@20220105: activateRunningApplet will change URL
          $timeout(function () {
              // activateRunningApplet(appletCode);
          });
        }
      };
      // console.log('....applet.windowSize', applet.windowSize);
      // applet.windowSize = 'full';
      // applet.windowSize = applet.windowSize || 'md';
      options.specSize = 'FILL_CONTENT';
      if (applet.windowSize) {
          var body = $('body');
          var headerHeight = 0;
          var aspectRatio = body.width() / (body.height() - headerHeight);
          // aspectRatio = 1.618;
          options.specSize = {
              width: '90%',
              aspectRatio: aspectRatio,
              // height: 'calc(100% - ' + headerHeight + 'px)'
          };
          if (applet.windowSize === 'md') {
              options.specSize.width = '80%';
              // options.specSize.height = '46rem'; // High enough to contain 10 rows table
          } else if (applet.windowSize === 'full') {
              options.specSize = {width: '100%', height: '100%'};
          }
      }
      // if (openWithMaxWindow) {
      //     options.specSize = 'FILL_CONTENT';
      // }
      
      
      return options;
    }

    that.appletModalOpened = function (appletCode, updateLocationWhenActivate) {
      var modalElem = $('.modal').eq(0);
      modalElem.attr('id', APPLET_WINDOW_ID_PREFIX + appletCode)
        .data('appletcode', appletCode);
      // arrangeWindowPosition(modalElem);
      // restoreWindowLayout(appletCode);
      that.activateRunningApplet(appletCode, updateLocationWhenActivate);
    }

    that.appletModalRendered = function (appletCode) {
        // console.log('appletRunman.openAppletWindow: AppletWindowRendered');
        runningState.emptyBreadcrumb(appletCode);
    }

    /**
     * Hide an applet and show its icon on taskbar
     * @param appletCode
     */
    that.minimizeAppletWindow = function(appletCode) {
      // console.warn('minimizeAppletWindow:' + appletCode);
      var runningApplet = _.find(runningState.allRunningApplets(), {
        code: appletCode
      });
      if (runningApplet) {

        runningApplet.active = false;
      }
      var win = that.findAppletModal(appletCode);
      if (win) {
        win.removeClass(MAX_CSS).removeClass(ACTIVE_CSS).hide();
      }
    }

    that.saveWindowLayout = function(appletCode) {
        var modal = that.findAppletModal(appletCode);
        if (!modal) return;
        var pos = modal.position();
        var container = $('body');
        var containerSize = {width: container.width(), height: container.height()};
        var layout = {
            left: (pos.left / containerSize.width) * 100 + '%',
            top: (pos.top / containerSize.height) * 100 + '%',
            width: (modal.width() / containerSize.width) * 100 + '%',
            height: (modal.height() / containerSize.height) * 100 + '%'
        };
        var layouts = userPref.readItem(USER_PREF_WINDOW_LAYOUTS, {});
        layouts[appletCode] = layout;
        userPref.saveItem(USER_PREF_WINDOW_LAYOUTS, layouts);
    }

    that.closeAppletWindow = function(appletCode) {
      // console.log('appletRunman.closeAppletWindow: applet=%c%s', 'color:orange', appletCode);
      exitStickyState();
      runningState.removeAppletFromRunning(appletCode);
      bringNextWindowToFront();

      function exitStickyState() {
        var def = appletRegistry.findAppletDef(appletCode);
        // LEO@20211216: Exit sticky states when closing, otherwise we cannot re-open the applet.
        // To exit sticky state, we need go to another state, sticky-states will put this state into inactives list.
        // Only inactive states can be exited.
        var currentStateName = def._resolvedState;
        var plugin = $state.router.getPlugin('sticky-states');
        //https://github.com/ui-router/sticky-states/issues/5
        // The code previously didn't allow exitSticky for a state that is currently active, but is scheduled to be inactivated during the new transition. This should be fixed now.
        $timeout(function () {
          // console.log('ExitStickyState', {state: currentStateName, inactives: plugin.inactives()});
          plugin.exitSticky(currentStateName);
        });
      }

      function bringNextWindowToFront() {
        var nextWin;
        var maxZindex = 0;
        $('.' + APPLET_WINDOW_CSS).each(function () {
          var elem = $(this);
          if (elem.data('appletcode') !== appletCode) {
            var zindex = parseInt(elem.css('z-index'));
            if (zindex >= maxZindex) {
              maxZindex = zindex;
              nextWin = elem;
            }
          }
          elem.removeClass(ACTIVE_CSS);
        });
        if (nextWin) {
          nextWin.addClass(ACTIVE_CSS);
          var nextCode = nextWin.data('appletcode');
          // console.log('appletRunman.bringNextWindowToFront: applet=%s, window=%o', nextCode, nextWin);
          that.activateRunningApplet(nextCode, true);
        } else {
          $state.go('app.home')
        }
      }
    }

    
    /**
     * Activate an opened applet, it will
     * - highlight dock icon
     * - bring window to front
     * - update location url
     * @param {string} appletCode
     */
    that.activateRunningApplet = function (appletCode, updateLocationWhenActivate) {
        // console.log('appletRunman.activateRunningApplet: %c%s', 'color:orange', appletCode);
        runningState.allRunningApplets().forEach(function (o) {
            o.active = o.code === appletCode;
        });
        var win = that.findAppletModal(appletCode);
        if (!win) {
            console.error('ProgramError: Cannot find window of running applet [%s]. Now try close applet window to exit state.', appletCode);
            that.closeAppletWindow(appletCode);
            return;
        }
        //LEO@20211225: Use timeout. uibmodal will dynamic change modal z-index, use timeout to wait z-index change
        // To reproduce the issue, open applet from applet list window twice.
        $timeout(function () {
            modalHelper.bringModalessToFront(win);
        });
        // Update location URL.
        // Also, this is a must to change state to exist sticky state of closed window
        if (updateLocationWhenActivate) {
            // console.warn('............updateLocationWhenActivate', JSON.stringify(runningState.allRunningApplets()));
            var url = runningState.findRunningApplet(appletCode).url;
            $location.url(url);
        }
    }


  }

}
)();
/**
 * @author Joker Liu (qdjoker@126.com), created on 2/12/2020.
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/12, change to component
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name appletList
     * @description
     * ```html
     * <applet-list options="{viewAs:string}">
     * ```
     * @param {string} options.viewAs 'launcher'
     */
    angular.module('oplus.commons').component('appletList', {
        bindings: {
            options: '<'
        },
        templateUrl: 'app/modules/app/applet-list.component.html',
        controller: ['$scope', '$rootScope', '$state', '$timeout', '$uibModal', 'messageService', 'udpTagsService',
            'appletService', 'themeService', 'currentUser', 'userPref', 'appletRunman', 'appletRegistry', 'appletSecurity', '$translate', AppletListCtrl]
    });

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $timeout
     * @param $uibModal
     * @param {messageService} messageService
     * @param {appletService} appletService
     * @param {themeService} themeService
     * @param {currentUser} currentUser
     * @param {userPref} userPref
     * @param {appletRunman} appletRunman
     * @param {appletRegistry} appletRegistry
     * @param {appletSecurity} appletSecurity
     * @constructor
     */
    function AppletListCtrl($scope, $rootScope, $state, $timeout, $uibModal, messageService, udpTagsService, appletService, themeService, currentUser, userPref, appletRunman, appletRegistry, appletSecurity, $translate) {
        var that = this;//$scope;
        var isUpdatingOrder = false;
        var EVENT_SHOW_DISABLED_CHANGED = 'ShowDisabledChange';
        var USER_PREF_SHOW_DISABLED_KEY = 'applet.showDisabled';
        var STATUS_OFFLINE = 'O';
        this.options = this.options || {};
        this.sort = ['default'];
        this.selectTags = [];
        this.openApplet = openApplet;
        this.editApplet = editApplet;
        this.isInSortMode = false;
        this.sortApplet = sortApplet;
        this.toggleDisabledApplets = toggleDisabledApplets;
        this.showDisabled = userPref.readItem(USER_PREF_SHOW_DISABLED_KEY, false);
        this.$onInit = onInit;

        this.setTag = setTag;

        this.defalutTags = [{
            "id": "system",
            "name": "系统内置",
            "tenantId": currentUser.tenantId,
            "type": "System"
        }];

        function setTag(event, tag) {
            var element = $(event.target);
            var sTagElement = angular.element("#applet_tag_list_ul li .btn-primary");
            if (sTagElement.length > 0) {
                angular.forEach(sTagElement, function (value, key) {
                    var tagValue = value.value;
                    if (tagValue) {
                        var tagMap = angular.fromJson(tagValue);
                        if (tagMap.id !== tag.id) {
                            angular.element(value).toggleClass("btn-primary", false);
                            angular.element(value).toggleClass("btn-secondary", true);
                        }
                    }
                });
            }
            var isChecked = element.hasClass("btn-primary");
            if (isChecked) {
                element.toggleClass("btn-primary", false);
                element.toggleClass("btn-secondary", true);
                that.selectTags = [];
            } else {
                element.toggleClass("btn-secondary", false);
                element.toggleClass("btn-primary", true);
                that.selectTags = [];
                that.selectTags.push(tag);
            }
            appletRegistry.loadAllAppletDefs(true, that.selectTags).then(function (result) {
                that.applets = filterApplet(result);
            });
        }

        function onInit() {
            if (!appletSecurity.canViewAppletList()) {
                that.ctrlError = $translate.instant('common.uaa.no_permission');
                return;
            }

            loadApplets();
            loadTags();
            if (that.options.viewAs === 'launcher') {
                $scope.$on(EVENT_SHOW_DISABLED_CHANGED, function (event, arg) {
                    that.showDisabled = arg.showDisabled;
                    loadApplets();
                });
            }
            $scope.$on('APPLET_CHANGED', function () {
                loadApplets();
            });

        }


        function loadTags() {
            udpTagsService.findTagsByTenantId().then(function (result) {
                that.tags = [].concat(that.defalutTags).concat(result);
            });
        }

        function openApplet(code, $event) {
            appletRunman.openApplet(code);
            if (that.options.viewAs !== 'launcher') {
                $event.stopPropagation();
            }
        }


        function editApplet(code, event) {
            // In window mode, prevent activate applet list window self again.
            event.preventDefault();
            event.stopPropagation();
            $state.go('app.appman.setting', {appletCode: code});
        }

        function loadApplets() {
            // that.query = $.trim(query) ? query : null;
            appletService.getMyRolesInAllApplets().then(function (roles) {
                Object.keys(roles).forEach(function (appletCode) {
                    currentUser.setAppletRoles(appletCode, roles[appletCode]);
                });
                return appletRegistry.loadAllAppletDefs(true, that.selectTags);
            }).then(function (appletDefs) {
                that.applets = filterApplet(appletDefs);
            }).catch(function (e) {
                messageService.alertError('Error', e.message);
            });
        }

        function filterApplet(appletDefs) {
            var tags = _.map(that.selectTags, "id");
            var all = [];
            if (!tags || _.isEmpty(tags)) {
                all = [].concat(appletDefs);
            } else if (tags && _.indexOf(tags, "system") >= 0) {
                if (tags.length === 1) {
                    all = _.filter(appletDefs, function (app) {
                        return app.tag === "system";
                    });
                } else {
                    all = [].concat(appletDefs);
                }
            } else {
                all = _.filter(appletDefs, function (app) {
                    return app.tag !== "system";
                });
            }
            _.remove(all, function (o) {
                return o.type === 'PrivateTool' || (!that.showDisabled && o.status === STATUS_OFFLINE);
            });
            // var hasPermission = currentUser.hasPermission('app:edit:*');
            _.forEach(all, function (applet) {
                if (applet.sourceType !== 'CodeDefined') {
                    // var isOwner = currentUser.loginId === applet.createdBy;
                    // applet._canUpdate = isOwner || hasPermission;
                    applet._canUpdate = appletSecurity.canUpdateApplet(applet.code);
                }
            });
            return all;
        }

        function toggleDisabledApplets() {
            that.showDisabled = !that.showDisabled;
            userPref.saveItem(USER_PREF_SHOW_DISABLED_KEY, that.showDisabled);
            loadApplets();
            // When toggle visibility in applet list, applet launcher should change as well
            $rootScope.$broadcast(EVENT_SHOW_DISABLED_CHANGED, {showDisabled: that.showDisabled});
        }


        function sortApplet() {
            that.isInSortMode = !that.isInSortMode;
            if (!that.isInSortMode) {
                $(".applet-container").sortable("destroy");
            } else {
                // if (that.sort[0] !== 'default') {
                //     that.sort = ['default'];
                //     loadApplets(that.sort).then(function () {
                //         makeSortable();
                //     });
                // } else {
                makeSortable();
                // }
            }
        }

        function cancelSort() {
            that.isInSortMode = false;
            $(".applet-container").sortable("destroy");
        }

        function makeSortable(total) {
            // if (total <= 1 || isUpdatingOrder || that.isInSortMode) {
            //     return;
            // }
            that.isInSortMode = true;

            // Sortable.create($(".applet-container")[0], {
            //     filter: '.ignore-elements',
            //     handle: 'opx-applet-item',
            //     swapThreshold: 1,
            //     // Element dragging ended
            //     onEnd: function ( /**Event*/ evt) {
            //         var itemEl = evt.item; // dragged HTMLElement
            //         evt.to; // target list
            //         evt.from; // previous list
            //         evt.oldIndex; // element's old index within old parent
            //         evt.newIndex; // element's new index within new parent
            //         evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
            //         evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
            //         evt.clone // the clone element
            //         evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving

            //         debugger;
            //     },
            // })

            // return;

            $(".applet-container").sortable({
                axis: false,
                cancel: '.ignore-elements', 
                items: '>div.d-block:not(".ignore-elements")',
                cursor: 'move',
                // placeholder: "sortableFormElementHighlight",
                opacity: 0.8,
                delay: 100,
                revert: false,
                start: function (event, ui) {
                    // console.log("Sort start");
                    ui.item.addClass("active");
                },
                stop: function (event, ui) {
                    ui.item.removeClass("active");

                    var sourceType = ui.item.data('type');

                    var currentOrder = ui.item.data('order');
                    var prevItem = ui.item.prev().length ? ui.item.prev() : null;
                    var nextItem = ui.item.next().length ? ui.item.next() : null;
                    var prevOrder = prevItem ? parseInt(prevItem.data('order') || 0) : 0;
                    var nextOrder = nextItem ? parseInt(nextItem.data('order') || 0) : 0;


                    if ((prevItem && prevOrder > currentOrder) || (nextItem && currentOrder > nextOrder)) {
                        if (prevOrder === 0 && nextOrder !== 0) {
                            currentOrder = nextOrder - 10000;
                        }
                        else if (!prevItem) {
                            currentOrder = nextOrder - 10000;
                        } else if (!nextItem) {
                            currentOrder = prevOrder + 10000;
                        } else {
                            currentOrder = Math.ceil((prevOrder + nextOrder) / 2);
                        }
                        ui.item.data('order', currentOrder);
                        isUpdatingOrder = true;
                        appletService.updateAppletOrder(ui.item.data('id'), currentOrder).then(function () {
                            isUpdatingOrder = false;
                            // messageService.toast('success', '更新成功');
                        }).catch(function (e) {
                            messageService.toast('error', 'Error', e.message);
                        });
                    }
                }
            });
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/24, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opxAppletItem
     * @description
     * ```html
     * ```
     */
    angular.module('oplus.commons').component('opxAppletItem', {
        transclude: true,
        bindings: {
            appletDef: '<',
            onClickApplet: '&'
        },
        templateUrl: 'app/modules/app/applet-item.component.html',
        controller: ['$scope', AppletItemCtrl]
    });

    function AppletItemCtrl($scope) {
        var that = this;
        var appletDef = that.appletDef;
        this.$onInit = onInit;
        this.clickApplet = clickApplet;

        function onInit() {
            appletDef._colors = calcColor({color: appletDef.color, theme: appletDef.theme}, appletDef.status);
        }

        function clickApplet($event) {
            that.onClickApplet({applet: appletDef, $event: $event});
        }

        /**
         *
         * @param {{color:string, theme:string}} setting
         * @param {string} appletStatus
         * @return {{iconBackColor: string, iconColor: string}}
         */
        function calcColor(setting, appletStatus) {
            var result = {iconColor: '#aaa', iconBackColor: '#666'};
            if (appletStatus === 'O') {
                return result;
            }
            if (setting.color) {
                result.iconColor = setting.color;
            }
            var main = tinycolor(result.iconColor);
            var isMainBright = main.getBrightness() > 200;
            if (isMainBright) {
                result.iconBackColor = main.darken(30).toRgbString();
            } else {
                result.iconBackColor = result.iconColor;
                result.iconColor = tinycolor.mix('#fff', result.iconColor, 50).toRgbString();
            }
            return result;
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/17, created
 */
(function () {
        'use strict';
        // var useDeferIntercept = !!window.$oplus.appConfig.useWindowUI;

        angular.module('oplus.udp').config(['$urlRouterProvider',
            function appletStates($urlRouterProvider) {
                // Bootstrap ui-router after applet defs async loaded in applet-init.run
                // https://ui-router.github.io/ng1/docs/latest/classes/url.urlrouterprovider.html
                // Call this method before UI-Router has bootstrapped. It will stop UI-Router from performing the initial url sync.
                // This can be useful to perform some asynchronous initialization before the router starts. Once the initialization is complete, call listen to tell UI-Router to start watching and synchronizing the URL.
                $urlRouterProvider.deferIntercept();
            }
        ]);

        angular.module('oplus.udp').service('windowInit', ['$q', '$state', '$rootScope', '$urlRouter', 'messageService', 'currentUser', 'appletRunman', 'appletRouter', 'appletService', 'appletRegistry', 'windowStateHandler', windowInit]);

        /**
         *
         * @param $q
         * @param $state
         * @param $rootScope
         * @param $urlRouter
         * @param {messageService} messageService
         * @param {currentUser} currentUser
         * @param appletRunman
         * @param appletRouter
         * @param appletService
         * @param appletRegistry
         * @param windowStateHandler
         */
        function windowInit($q, $state, $rootScope, $urlRouter, messageService, currentUser, appletRunman, appletRouter, appletService, appletRegistry, windowStateHandler) {
            this.initRun = initRun;
            this.initAppletDefsAndRouters = initAppletDefsAndRouters;
            $rootScope.$on('APPLET_CHANGED', function () {
                //console.log('windowInit: on APPLET_CHANGED');
                initAppletDefsAndRouters();
            });

            /**
             * This shall be called by `angular.module().run()`
             * @return {Promise<[string]>}
             */
            function initRun() {
                windowStateHandler.initStateListeners();
                // appletRouter.initRouters(appletRegistry.getCodeDefinedAppletDefs());
                return initAppletDefsAndRouters();
            }

            /**
             * Load and init applet definitions
             * @return {Promise<[string]>} Applet codes whose router changed
             */
            function initAppletDefsAndRouters() {
                if (!window.$oplus.appConfig.useWindowUI) {
                    $urlRouter.listen();
                    $urlRouter.sync();
                    return $q.resolve([]);
                }
                var d = $q.defer();
                // console.log('windowInit.initAppletDefsAndRouters: currentUser.isAuthenticated=' + currentUser.isAuthenticated);
                appletRegistry.loadAllAppletDefs(true).then(function (allDefs) {
                    // appletRegistry.initAppletDefs(defs);
                    // var allDefs = appletRegistry.getAppletDefs();
                    var changes = appletRouter.initRouters(allDefs);
                    // console.log('%c[WindowInit]%c Routers inited for %s applets: %s', 'color:teal', '', allDefs.length, _.map(allDefs, 'code').join(','));
                    // if (useDeferIntercept) {
                    $urlRouter.listen();
                    $urlRouter.sync();
                    // }
                    d.resolve(changes);
                }).catch(function (err) {
                    messageService.alertError('Error', 'Cannot init window: ' + err.message);
                    d.reject(err);
                })
                return d.promise;
            }
        }
    }
)();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/11, created
 */
(function () {
    'use strict';
    angular.module('oplus.udp').service('appletRunman',
        ['$q', '$rootScope', '$translate', '$state', '$timeout', '$location', 'modalHelper', 'messageService', 'runningState', 'appletService', 'appletHelper', 'appletRegistry', 'userPref', 'appletRouter', 'currentUser', 'appletSecurity', 'widgetInteraction', appletRunman]);

    /**
     * @ngdoc service
     * @name appletRunman
     * @description
     * Management of running applet
     * @param {$q} $q
     * @param {$rootScope} $rootScope
     * @param $translate
     * @param {$state} $state
     * @param {$timeout} $timeout
     * @param {$location} $location
     * @param {modalHelper} modalHelper
     * @param {messageService} messageService
     * @param {runningState} runningState
     * @param {appletService} appletService
     * @param {appletRegistry} appletRegistry
     * @param {userPref} userPref
     * @param {appletRouter} appletRouter
     * @param {currentUser} currentUser
     * @param {appletSecurity} appletSecurity
     */
    function appletRunman($q, $rootScope, $translate, $state, $timeout, $location, modalHelper, messageService, runningState, appletService, appletHelper, appletRegistry, userPref, appletRouter, currentUser, appletSecurity, widgetInteraction) {
        var that = this;
        var APPLET_WINDOW_CSS = 'op-applet-window';
        var APPLET_WINDOW_ID_PREFIX = 'js-applet-window-';
        var USER_PREF_WINDOW_LAYOUTS = 'windowLayouts';

        this.prepareAppletWindowContent = prepareAppletWindowContent;
        // this.maximizeAppletWindow = maximizeAppletWindow;
        this.openApplet = openApplet;
        this.openAppletWindow = openAppletWindow;

        /**
         * Open an applet by code.
         * If applet is running, activate it.
         *
         * @param {string} appletCode
         */
        function openApplet(appletCode) {
            if (runningState.findRunningApplet(appletCode)) {
                appletHelper.activateRunningApplet(appletCode, true);
                return;
            }
            var appletDef = appletRegistry.findAppletDef(appletCode);
            if (appletDef.entry.type === 'InternalState') {
                $state.go(appletDef.entry.value);
            } else if (appletDef.entry.type === 'ExternalState') {
                //$state.go(appletRouter.getAppletState(appletCode), {appletCode: appletCode});
                if (appletDef.entry.value) {
                    widgetInteraction.openUrlLink({
                        url: appletDef.entry.value,
                        target: appletDef.entry.target || '_blank'
                    }, appletDef.entry.params, {applet: appletDef})
                } else {
                    var msg = 'Entry value is not specified for this applet ' + appletDef.code;
                    messageService.alertError('Error', msg);
                }
            } else {
                $state.go(appletRouter.getAppletState(appletCode), {appletCode: appletCode});
            }
            /*else if (window.$oplus.appConfig.useWindowUI) {
                $state.go('app.appletwindow_' + appletCode);
            } else {
                $state.go('app.applet_view', {appletCode: appletCode});
            }*/
        }

        /**
         *
         * @param appletCode
         * @return {Promise<[string]>}
         */
        function getAppletRoles(appletCode) {
            var d = $q.defer();
            d.resolve([]);
            return d.promise;
        }

        /**
         * Read applet definition and prepare its attributes to display on window.
         * @param {string} appletCode
         * @return {Promise<AppletDefinition>}
         */
        function prepareAppletWindowContent(appletCode) {
            var appletDef = appletRegistry.findAppletDef(appletCode);
            var promise;
            if (appletDef && appletDef.sourceType === 'CodeDefined') {
                promise = $q.when(appletDef);
            } else {
                promise = findDbDefinedApplet();
            }
            var d = $q.defer();
            var result;
            promise.then(function (applet) {
                result = applet;
                return appletService.getMyRolesInApplet(appletCode);
            }).then(function (roles) {
                currentUser.setAppletRoles(appletCode, roles);
                d.resolve(result);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;

            function findDbDefinedApplet() {
                var d = $q.defer();
                appletService.findAppletByCode(appletCode).then(function (applet) {
                    // console.log('appletRunman.prepareAppletWindowContent: applet=%o',angular.copy(applet));
                    if (!applet) {
                        d.reject(new Error('Cannot find applet ' + appletCode));
                        return;
                    }

                    applet = angular.merge({setting: {nav: {}}}, applet);
                    applet.icon = applet.setting.icon;
                    applet.code = applet.code || applet.name;
                    applet.windowSize = applet.setting.windowSize;
                    applet.entry = parseEntry(applet);
                    // applet.entryType = appletService.getEntryTypeFromEntry(applet.entry);
                    if (!applet.entry) {
                        var msg = 'Entry is not specified for this applet ' + applet.code;
                        messageService.alertError('Error', msg);
                        return d.reject(new Error(msg));
                    }

                    _.merge(applet, parseNav(applet.setting.nav));
                    d.resolve(applet);
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            }

            /**
             *
             * @param {{entry:{type:string,value:string}|string,entryParams:string}} applet
             * @return {{type:string,value:string,params:object}}
             */
            function parseEntry(applet) {
                var result;
                var entry = applet.entry;
                if (angular.isObject(entry)) {
                    result = {type: entry.type, value: entry.value};
                } else if (angular.isString(entry)) {
                    result = {};
                    if (entry.indexOf('#') === 0) {
                        console.warn('TODO: hardcode change to app.cac');
                        result.value = 'app.cac';
                        result.type = 'InternalState';
                    } else {
                        result.type = entry.indexOf('.') > 0 ? 'InternalState' : 'udp';
                        result.value = entry;
                    }
                }
                if (result && applet.entryParams) {
                    result.params = JSON.parse(applet.entryParams);
                }
                delete applet.entryParams;
                return result;
            }

            /**
             *
             * @param navSetting
             * @return {{navCss: string, navPos: string, theme: string, showNavOnHome: boolean, showNav: boolean}}
             */
            function parseNav(navSetting) {
                var applet = {navCss: '', theme: '', navPos: '', showNav: false, showNavOnHome: false};
                var hasItems = navSetting.items && navSetting.items.length > 0;
                // if (window.$oplus.appConfig.useWindowUI) {
                //     applet.navCss = 'bg-light';
                // } else if (navSetting.theme) {
                applet.navCss = 'bg-' + navSetting.theme;
                applet.theme = navSetting.theme || 'light';
                // }
                applet.navPos = navSetting.position === 'left' ? 'left' : 'top';
                if (hasItems) {
                    if (navSetting.hide !== true) {
                        applet.showNav = true;
                    }
                    if (navSetting.hideOnHome !== true) {
                        applet.showNavOnHome = true;
                    }
                }
                return applet;
            }
        }

        /**
         * Activate an existing or open a new applet window.
         * If an applet is not opened, open it.
         * If an applet is opened, activate it and put to front.
         * @param appletCode
         * @return {Promise} When window is rendered
         */
        function openAppletWindow(appletCode) {
            // console.log('openAppletWindow...', appletCode);
            if (runningState.findRunningApplet(appletCode)) {
                appletHelper.activateRunningApplet(appletCode, true);
                return $q.when(null);
            }
            // return doOpenAppletWindow(appletCode);

            // function doOpenAppletWindow(appletCode) {
            var d = $q.defer();
            var modalInstance;
            prepareAppletWindowContent(appletCode).then(function (applet) {
                if (applet.sourceType !== 'CodeDefined' && !appletSecurity.canUseApplet(appletCode)) {
                    applet.launchError = $translate.instant('common.uaa.no_permission');
                }
                var config = {
                    modaless: true,
                    windowClass: APPLET_WINDOW_CSS,
                    templateUrl: 'app/modules/app/window/applet-window-modal.html',
                    resolve: {
                        theApplet: function () {
                            return applet;
                        }
                    },
                    controller: 'AppletModalCtrl',
                    controllerAs: '$ctrl'
                };
                
                modalInstance = modalHelper.openModal(config, appletHelper.buildOptions(applet));
                modalInstance.opened.then(function () {
                    appletHelper.appletModalOpened(appletCode, true);
                });
                modalInstance.rendered.then(function () {
                    appletHelper.appletModalRendered(appletCode);
                    d.resolve();
                });
            }).catch(function (err) {
                console.error(err);
                d.reject(err);
            });

            return d.promise;


            function restoreWindowLayout(appletCode) {
                var layouts = userPref.readItem(USER_PREF_WINDOW_LAYOUTS, {});
                var layout = layouts[appletCode];
                var modal = appletHelper.findAppletModal(appletCode);
                if (!modal || !layout) return;
                modal.css(layout);
            }

            function arrangeWindowPosition(modalElem) {
                var positions = [];
                $('.' + APPLET_WINDOW_CSS).each(function () {
                    var elem = $(this);
                    if (!elem.is(modalElem)) {
                        var pos = elem.position();
                        positions.push(pos);
                    }
                });
                var self = modalElem.position();
                if (positions.length > 0) {
                    var max = _.maxBy(positions, function (o) {
                        return o.left;
                    });
                    // console.log('max', max);
                    if (max) {
                        modalElem.css({
                            left: max.left + 40,
                            top: max.top + 40
                        });
                    }
                }
                // }
            }
        }



    }
    
    angular.module('oplus.udp').controller('AppletModalCtrl',AppletModalCtrl);
    
    AppletModalCtrl.$inject = ['theApplet', 'runningState', 'modalHelper', 'appletHelper', '$uibModalInstance', '$sce'];
    
    /**
     *
     * @param {{code:string,title:string,icon:string,color:string,theme:string,entry:{}}} theApplet
     * @constructor
     */
    function AppletModalCtrl(theApplet, runningState, modalHelper, appletHelper, $uibModalInstance, $sce) {
        var that = this;
        // var useWindowUI = window.$oplus.appConfig.useWindowUI;
        this.applet = theApplet;
        this.minimizeWindow = minimizeWindow;
        this.restoreOrMaxWindow = restoreOrMaxWindow;
        this.closeWindow = closeWindow;
        this.$onInit = onInit;

        function onInit() {
            runningState.addAppletToRunning(theApplet);

            if (that.applet && that.applet.entry.type === 'ExternalState') {
                that.url = $sce.trustAsResourceUrl(that.applet.entry.value);
            }
        }

        function restoreOrMaxWindow() {
            modalHelper.maximizeOrRestoreModal(appletHelper.findAppletModal(theApplet.code));
        }

        function closeWindow($event) {
            appletHelper.saveWindowLayout(that.applet.code);
            $uibModalInstance.dismiss();
            appletHelper.closeAppletWindow(that.applet.code);
            // Stop propagation to try activating window
            $event.stopPropagation();
        }

        function minimizeWindow($event) {
            appletHelper.minimizeAppletWindow(that.applet.code);
            $event.stopPropagation();
        }
    }
}
)();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/20, extracted from windowStateHandler
 */
(function () {
        'use strict';
        angular.module('oplus.udp').service('windowStateHandler', ['$q', '$rootScope', '$state', '$timeout', '$location', 'appletRunman', 'runningState', 'appletService', 'appletRegistry', 'messageService', 'appletHelper', windowStateHandler]);

        /**
         * @ngdoc service
         * @name windowStateHandler
         * @description
         * Management of running applet
         * @param {$q} $q
         * @param {$rootScope} $rootScope
         * @param {$state} $state
         * @param {$timeout} $timeout
         * @param {$location} $location
         * @param {appletRunman} appletRunman
         * @param {runningState} runningState
         * @param {appletService} appletService
         * @param {appletRegistry} appletRegistry
         * @param {messageService} messageService
         */
        function windowStateHandler($q, $rootScope, $state, $timeout, $location, appletRunman, runningState, appletService, appletRegistry, messageService, appletHelper) {
            this.initStateListeners = initStateListeners;

            function initStateListeners() {
                $rootScope.$on('$stateChangeError', function onErrorHandle(event, toState, toParams, fromState, fromParams, error) {
                    // var match = /^(TenantNotFound|TenantNotActivated):(.*)/.exec(error.detail.message);
                    // if (match) {
                    //     var tenantCode = match[2].trim();
                    //     messageService.alertError('Error', 'Invalid tenant "' + tenantCode + '". Please check the URL is correct. ' + error.detail.message);
                    // }
                });

                $rootScope.$on('$stateChangeSuccess', function onErrorHandle(event, toState, toParams, fromState, fromParams) {
                });
                // $rootScope.$on('$stateChangeError', function (event, unfoundState, fromState, fromParams, options) {
                //     console.error('$stateChangeError', {
                //         unfoundState: unfoundState,
                //         fromState: fromState,
                //         fromParams: fromParams,
                //         options: options
                //     });
                // });
                $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl, newState, oldState) {
                    // console.log('$locationChangeSuccess: url=%s', newUrl);
                });
                $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                    console.error('$stateNotFound ', unfoundState);
                });
                $rootScope.$on('$stateChangeStart', function hideDesktop(event, toState, toParams, fromState, fromParams) {
                    // console.log('$stateChangeStart');
                    // Set value before state changed, i.e. not in `$stateChangeSuccess`
                    $rootScope.$global.hideDesktop = toState.data && toState.data.hideDesktop;
                });
                $rootScope.$on('$stateChangeSuccess', function handleWindowAndPageView(event, toState, toParams, fromState, fromParams) {
                    var stateName = toState.name;
                    var toApplet = detectToApplet();
                    runningState.activeAppletCode = toApplet ? toApplet.code : undefined;
                    if (toApplet) {
                        // console.log('%cToAppletState:%c [%s]-->%c[%s]', 'color:orange', '', fromState.name, 'color:orange', stateName);
                        // Use substring to remove #
                        var url = $state.href(stateName, toParams).substring(1);
                        // LEO@20220104: widget interaction may append arbitrary URL query parameters which is not defined in state
                        // `$state.href(...)` will ignore the query parameters.
                        // We use `runningState.urlByWidgetInteraction` to keep URL invoked by `widgetInteraction.openPageInSelf`
                        // NOTE: There is a minor issue: in widgetInteraction.changePageParam, it will only update URL search by $location.search(...)
                        // For example, from `/apw/acm/menu/JVKEFJ?citype=windows_server` to `/apw/acm/menu/JVKEFJ?citype=linux`
                        // In this case, the state does not change, so "$stateChangeSuccess" will not be called and the applet url will not change
                        if (runningState.urlByWidgetInteraction) {
                            url = runningState.urlByWidgetInteraction;
                            // Use once and remove it
                            runningState.urlByWidgetInteraction = undefined;
                        }
                        updateAppletRunningState(toApplet.code, {url: url});
                        if (toApplet.type !== 'ByPredefinedState') {
                            // Start new breadcrumbs if click a menu
                            if (toApplet.action === 'open_menu') {
                                runningState.emptyBreadcrumb(toApplet.code);
                            }
                            //Push a placeholder title
                            runningState.pushBreadcrumb(toApplet.code, {title: '', url: url});
                        }
                    } else {
                        // If this is a normal view, minimize all applet window
                        // console.log('%cToNoneAppletState:%c [%s]-->%c[%s]', 'color:red', '', fromState.name, 'color:red', stateName);
                        runningState.allRunningApplets().forEach(function (applet) {
                            appletHelper.minimizeAppletWindow(applet.code);
                        });
                    }
                    if ($rootScope.$global.isAdminUI) {
                        $rootScope.$global.hideMasterContent = false;
                    } else if (window.$oplus.appConfig.useWindowUI) {
                        $rootScope.$global.hideMasterContent = !!toApplet || toState.name === 'app.home';
                    } else {
                        $rootScope.$global.hideMasterContent = toState.name === 'app.home';
                        handleHistoryForSpaMode();
                    }

                    /**
                     * If current state is for applet window
                     * @return {null|{code: string, action: string, type: string}} null if not.
                     * `type` is applet state type
                     * `action` is either open_page or open_menu.
                     * `code` is applet code
                     */
                    function detectToApplet() {
                        // 1. Check if next state is dynamic applet window
                        var APPLET_STATE_DETECT_REGEX = /^app\.appletwindow_([^.]+)\.?(open_page|open_menu)?/;
                        var matches = APPLET_STATE_DETECT_REGEX.exec(stateName);
                        if (matches) {
                            return {
                                type: '__ByDynamicState',
                                code: matches[1],
                                action: matches[2]
                            };
                        }
                        // 2. Check if next state is predefined window state
                        // Check appletRegistry.allAppletDefs is not empty, in case of appletDefs are not loaded from remote, if we refresh URL directly in browser
                        var def = appletRegistry.findAppletDef(function (o) {
                            return o.entry.type === 'InternalState' && (stateName === o.entry.value || stateName.indexOf(o.entry.value + '.') === 0);
                        }, true);
                        if (def) {
                            return {
                                type: 'ByPredefinedState',
                                code: def.code
                            };
                        }
                        // 3. Check if next URL is applet window
                        //NOTE: Use state.href instead of $location.url() because at this time location url is not refreshed to new state
                        var m = /\/apw\/([^\/?#]+)/.exec($state.href(toState.name));
                        if (m) {
                            return {
                                type: '__UDP',
                                code: m[1]
                            };
                        }
                        return null;
                    }


                    /**
                     *
                     * @param appletCode
                     * @param {{url:string}} state
                     */
                    function updateAppletRunningState(appletCode, state) {
                        var applet = runningState.findRunningApplet(appletCode);
                        if (applet) {
                            applet.url = state.url;
                        }
                    }


                    //TODO: has problem, need recode!!!
                    function handleHistoryForSpaMode() {
                        // console.log('PageViewCtrl.state', $state.$current.name);
                        // Save history for page change in _self which is the same state
                        var toKeepHistory = false;
                        if ((fromState.name === 'app.applet_view' || fromState.name === 'app.applet_view.open_menu' || fromState.name === 'app.applet_view.open_page')
                            && toState.name === 'app.applet_view.open_page') {
                            toKeepHistory = true;
                        }
                        if (!toKeepHistory) {
                            runningState.emptyHistory();
                        }
                        // var statesToKeepHistory = ['app.udp_pageview', 'app.applet_view.open_page', '__app.applet_view'];
                        // if (statesToKeepHistory.indexOf(stateName) < 0) {
                        //     runningState.emptyHistory();
                        // }
                    }
                });
            }
        }
    }

)();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/17, created
 */
(function () {
        'use strict';
        angular.module('oplus.udp').service('appletRouter', ['$state', '$stateRegistry', appletRouter]);
        angular.module('oplus.udp').config(['$urlRouterProvider', '$uiRouterProvider',
            function ($urlRouterProvider, $uiRouterProvider) {
                var StickyStatesPlugin = window['@uirouter/sticky-states'].StickyStatesPlugin;
                $uiRouterProvider.plugin(StickyStatesPlugin);
            }]);

        /**
         * @ngdoc service
         * @name appletRouter
         * @description
         * Config state routers for window mode.
         * @param {$state} $state
         * @param {$stateRegistry} $stateRegistry
         */
        function appletRouter($state, $stateRegistry) {
            var useStickyForCodeDefinedApplet = true;
            var useStickyForUdpApplet = true;
            var modifiedStates = [];
            this.initRouters = initRouters;
            this.getAppletWindowUiView = getAppletWindowUiView;
            this.getAppletState = getAppletState;
            this.detectIfCurrentStateIsApplet = detectIfCurrentStateIsApplet;
            var useWindowUI = window.$oplus.appConfig.useWindowUI;

            /**
             * Detect if current state is applet mode.
             * @return {null|{appletCode: string, action: string}} Null if not in applet mode.
             */
            function detectIfCurrentStateIsApplet(stateName) {
                var APPLET_STATE_REGEX = /^app\.appletwindow_([^.]+)\.?(open_page|open_menu)?/;
                var matches = APPLET_STATE_REGEX.exec(stateName);
                if (matches) {
                    return {appletCode: matches[1], action: matches[2]};
                }
                return null;
            }

            function getAppletWindowUiView(appletCode) {
                return useWindowUI ? 'appletwindow_view_' + appletCode : 'applet_main_view';
            }

            function getAppletState(appletCode, action) {
                var state = useWindowUI ? 'app.appletwindow_' + appletCode : 'app.applet_view';
                if (action) {
                    state += '.' + action;
                }
                return state;
            }

            /**
             * Init state routers with applet definition.
             * @param {[AppletDefinition]} defs
             * @return {[string]} Applet codes whose router changed
             */
            function initRouters(defs) {
                var changes = [];
                if (!window.$oplus.appConfig.useWindowUI) {
                    return changes;
                }
                defs.forEach(function (def) {
                    var appletCode = initAppletRouterState(def);
                    if (appletCode) {
                        changes.push(appletCode);
                    }
                });
                return changes;

                /**
                 * Init or update dynamic routers.
                 * @param {AppletDefinition} appletDef
                 * @return {string|null} appletCode if router changed, null if not changed
                 */
                function initAppletRouterState(appletDef) {
                    if (!useWindowUI) {
                        return null;
                    }
                    if (!appletDef.entry.type && /^#\/|\./.test(appletDef.entry.value)) {
                        appletDef.entry.type = 'InternalState';
                    }
                    var appletCode = appletDef.code;
                    if (appletDef.entry.type === 'InternalState') {
                        updateStateForCodeDefinedApplet(appletCode, appletDef.entry.value);
                    } else if (appletDef.entry.type === 'ExternalState') {
                        //Todo Need a new routing method for ExternalState
                    } else {
                        createDynamicStateForUdpApplet(appletCode);
                    }
                    return appletCode;
                }
                function createDynamicStateForUdpApplet(appletCode) {
                    var allStates = [];
                    var windowState = {
                        // name: 'app.appletwindow_' + appletCode,
                        name: getAppletState(appletCode),
                        url: '/apw/' + appletCode,
                        // Add sticky to root state only
                        sticky: useStickyForUdpApplet,
                        onEnter: ['$rootScope', '$state', '$stateParams', 'appletRunman', function ($rootScope, $state, $stateParams, appletRunman) {
                            // console.log('WaitWindowRendered:OpenAppletWithDynamicState: state=%s', $state.current.name);
                            return appletRunman.openAppletWindow(appletCode);
                        }]
                        // resolve: {
                        //     _WaitWindowRendered_: ['$rootScope', '$stateParams', 'appletRunman', function ($rootScope, $stateParams, appletRunman) {
                        //         // console.log('WaitWindowRendered:OpenAppletWithDynamicState')
                        //         return appletRunman.openAppletWindow(appletCode);
                        //     }]
                        // }
                    };
                    allStates.push(windowState);
                    var pageState = {
                        // name: 'app.appletwindow_' + appletCode + '.open_page',
                        name: getAppletState(appletCode, 'open_page'),
                        url: '/page/:pageId?:p',
                        views: {},
                        resolve: {
                            pageId: ['$stateParams', function ($stateParams) {
                                return $stateParams.pageId;
                            }],
                            pageParams: [function () {
                                return {};
                            }]
                        }
                    }
                    pageState.views[getAppletWindowUiView(appletCode) + '@'] = {
                        templateUrl: 'app/modules/udp/page-view-applet.html',
                        controller: 'PageViewCtrl'
                    };
                    var menuState = _.extend({}, pageState, {
                        // name: 'app.appletwindow_' + appletCode + '.open_menu',
                        name: getAppletState(appletCode, 'open_menu'),
                        url: '/menu/:pageId?:p'
                    });
                    allStates.push(pageState);
                    allStates.push(menuState);
                    allStates.forEach(function (state) {
                        if ($stateRegistry.get(state.name)) {
                            $stateRegistry.deregister(state.name);
                        }
                        $stateRegistry.register(state);
                    });
                }

                function updateStateForCodeDefinedApplet(appletCode, stateName) {
                    var oldStateDecl = $state.get(stateName);
                    if (!oldStateDecl) {
                        console.warn('updateStateForCodeDefinedApplet: Cannot find state of "%s" for applet "%s"', stateName, appletCode);
                    }
                    if (modifiedStates.indexOf(stateName) > -1) {
                        // console.log('...UpdateSystemDefinedState.OmitModifiedState: applet=' + appletCode + ', state=' + stateName);
                        return;
                    }
                    // console.log('appletRouter.updateStateForCodeDefinedApplet', {appletCode: appletCode, stateName: stateName});
                    modifiedStates.push(stateName);
                    var childrenStateDecls = _.filter($stateRegistry.get(), function (o) {
                        return o.name.indexOf(stateName + '.') === 0;
                    });
                    var newStateDecl = {
                        name: stateName,
                        url: oldStateDecl.url,
                        sticky: useStickyForCodeDefinedApplet,
                        views: {},
                        resolve: {
                            _WaitWindowRendered_: ['$rootScope', '$stateParams', 'appletRunman', function ($rootScope, $stateParams, appletRunman) {
                                // console.log('WaitWindowRendered:OpenAppletByPredefinedState')
                                return appletRunman.openAppletWindow(appletCode);
                            }]
                        }
                    };
                    var newViewName = 'modal_main_view_' + appletCode + '@';
                    newStateDecl.views[newViewName] = oldStateDecl.views['mainView'];
                    $stateRegistry.deregister(stateName);
                    [newStateDecl].concat(childrenStateDecls).forEach(function (o) {
                        $stateRegistry.register(o);
                    });
                }
            }
        }
    }
)();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/14, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').provider('stateProviderRef', [stateProviderRefProvider]);

    /**
     * @ngdoc provider
     * @name stateProviderRefProvider
     * @description
     * @deprecated
     * Use $stateRegistry instead.
     */
    function stateProviderRefProvider() {
        var refs = {};
        this.injectStateProvider = function ($stateProvider) {
            refs['$stateProvider'] = $stateProvider;
        };
        this.$get = [function () {
            return {
                get: function () {
                    return refs['$stateProvider'];
                }
            };
        }];
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/15, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').provider('modalState', ['$stateProvider', modalStateProvider]);

    /**
     * @ngdoc provider
     * @name modalState
     * @description
     */
    function modalStateProvider($stateProvider) {
        var provider = this;
        this.$get = function () {
            return provider;
        }
        this.state = function (stateName, options) {
            var modalInstance;
            $stateProvider.state(stateName, {
                url: options.url,
                onEnter: ['$state', 'modalHelper', function ($state, modalHelper) {
                    console.log('onEnter modal');
                    var modalConfig = Object.values(options.views)[0];
                    modalConfig.modaless = true;
                    modalInstance = modalHelper.openModal(modalConfig);
                    modalInstance.result['finally'](function () {
                        modalInstance = null;
                        if ($state.$current.name === stateName) {
                            $state.go('^');
                        }
                    });
                }],
                onExit: function () {
                    if (modalInstance) {
                        modalInstance.close();
                    }
                }
            });
            return provider;
        };
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/12, created
 */
(function () {
    'use strict';
    angular.module('oplus.udp').service('appletRegistry', ['$q', '$translate', '$state', 'restUtils', 'currentUser', 'themeService', 'appletRouter', appletRegistry]);


    /**
     * @ngdoc service
     * @name appletRegistry
     * @description
     * Contains all the registered applets
     * @param {$q} $q
     * @param {$translate} $translate
     * @param {$state} $state
     * @param {restUtils} restUtils
     * @param {currentUser} currentUser
     * @param {themeService} themeService
     * @param {appletRouter} appletRouter
     */
    function appletRegistry($q, $translate, $state, restUtils, currentUser, themeService, appletRouter) {
        /**
         *
         * @type {[AppletDefinition]}
         */
        var codeDefinedApps = [];
        /**
         * @type {[AppletDefinition]}
         */
        var allAppletDefs;
        var that = this;
        var dbLoaded = false;
        this.CODE_DEFINED_APPLET_CODE_PREFIX = '__';
        this.findAppletDef = findAppletDef;
        this.loadAllAppletDefs = loadAllAppletDefs;
        this.getAppletDefs = getAppletDefs;
        this.getDesktopApplets = getDesktopApplets;
        this.getDockApplets = getDockApplets;
        initCodeDefinedApplets();

        /**
         * Get applets shown on desktop
         * @return {[AppletDefinition]}
         */
        function getDesktopApplets() {
            return _.sortBy(_.filter(getAppletDefs(), function (def) {
                return def.showIn && angular.isNumber(def.showIn.desktop);
            }), [function (o) {
                return o.showIn.desktop;
            }]);
        }

        /**
         * Get applets shown on dock
         * @return {[AppletDefinition]}
         */
        function getDockApplets() {
            return _.sortBy(_.filter(getAppletDefs(), function (def) {
                return def.showIn && angular.isNumber(def.showIn.dock);
            }), [function (o) {
                return o.showIn.dock;
            }]);
        }

        function getAppletDefs() {
            return allAppletDefs;
        }

        /**
         * Find all applet definitions including code defined and db defined
         * If user is not authenticated, only code defined loaded.
         * @param {boolean=} forceReload
         * @param {Object=tag} tag
         * @return {Promise<[AppletDefinition]>}
         */
        function loadAllAppletDefs(forceReload, tag) {
            if (dbLoaded && !forceReload) {
                return $q.when(allAppletDefs);
            }
            var query = tag ? _.map(tag, "id").join(",") : "";
            var d = $q.defer();
            var result = [];
            var toLoadDb = false;
            var promise;
            if (currentUser.isAuthenticated) {
                toLoadDb = true;
                promise = restUtils.callApi('udp', 'GET', '/api/udp/applets?isPaging=true', null, {query: query});
            } else {
                console.warn('appletRegistry.loadAllAppletDefs: User has not signed in');
                promise = $q.when([]);
            }
            promise.then(function (records) {
                dbLoaded = toLoadDb;
                _.forEach(records, function (rec) {
                    result.push(dbRecordToAppletDefinition(rec));
                });
                if (toLoadDb) {
                    console.log('appletRegistry.loadAllAppletDefs: %d applet loaded from DB', records.length);
                }
                allAppletDefs = [].concat(codeDefinedApps).concat(result);
                resolveAppState(allAppletDefs);
                d.resolve(allAppletDefs);
            }).catch(function (e) {
                d.reject(e);
            });
            return d.promise;

            function resolveAppState(defs) {
                // console.log('appletRegistry.resolveAppState: %d applets', defs.length);
                defs.forEach(function (def) {
                    if (def.entry.type === 'InternalState' || (!def.entry.type && /^#\/|\./.test(def.entry.value))) {
                        def._resolvedState = def.entry.value;
                    } else if (def.entry.type === 'ExternalState' || (!def.entry.type && /^#\/|\./.test(def.entry.value))) {
                        //def._resolvedState = window.$oplus.appConfig.useWindowUI ? 'app.appletwindow_' + def.code : 'app.applet_view';
                        //def._resolvedState = appletRouter.getAppletState(def.code);
                        //Todo external state router config
                    } else {
                        // def._resolvedState = window.$oplus.appConfig.useWindowUI ? 'app.appletwindow_' + def.code : 'app.applet_view';
                        def._resolvedState = appletRouter.getAppletState(def.code);
                    }
                });
            }

            function dbRecordToAppletDefinition(rec) {
                var setting = JSON.parse(rec.setting);
                var def = {
                    id: rec.id,
                    code: rec.code || rec.name,
                    title: rec.title,
                    type: rec.type,
                    status: rec.status,
                    version: rec.version,
                    order: rec.order,
                    icon: setting.icon,
                    color: setting.color,
                    windowSize: setting.windowSize,
                    entry: {type: rec.entryType, value: rec.entry, params: rec.entryParams},
                };

                if (def.code === 'cac') {
                    console.warn('Hardcode change cac entry to app.cac');
                    def.entry = {type: 'InternalState', value: 'app.cac'};
                } else if ((!def.entry.type && /^#\/|\app./.test(def.entry.value))) {
                    def.entry = {type: 'InternalState', value: def.entry.value};
                } else if ((!def.entry.type && /^http[s]?:\/\//.test(def.entry.value))) {
                    def.entry = {type: 'ExternalState', value: def.entry.value, params: def.entry.params, target: setting.target || undefined};
                }
                if (def.code.toString().indexOf('ipam') >= 0) {
                    def.entry = {type: 'ExternalState', value: rec.entry, params: rec.entryParams};
                }
                return def;
            }
        }


        /**
         * Init code defined applets from router states
         */
        function initCodeDefinedApplets() {
            var allStates = $state.get();
            var appletStates = _.filter(allStates, function (o) {
                return !!o.useAsApplet;
            });
            var defs = _.map(appletStates, function (state) {
                var def = state.useAsApplet;
                return {
                    code: that.CODE_DEFINED_APPLET_CODE_PREFIX + def.code,
                    title: $translate.instant(def.title) || def.code,
                    icon: def.icon,
                    color: def.color,
                    type: def.type || 'Application',
                    sourceType: 'CodeDefined',
                    showIn: def.showIn,
                    windowSize: def.windowSize,
                    entry: {type: 'InternalState', value: state.name},
                    tag: "system"
                };
            });
            defs.forEach(function (def) {
                defineApplet(def);
            });
            //console.log('%cappletRegistry.initCodeDefinedApplets: %d', 'color:teal', defs.length);
        }

        /**
         *
         * @param {AppletDefinition} appDef
         */
        function defineApplet(appDef) {
            if (!appDef.code) {
                throw new TypeError('Applet code is required');
            }
            if (_.find(codeDefinedApps, {code: appDef.code})) {
                return;
            }
            codeDefinedApps.push(appDef);
        }

        /**
         *
         * @param condition
         * @param {boolean=} ignoreWarning
         * @return {AppletDefinition}
         */
        function findAppletDef(condition, ignoreWarning) {
            var predicate;
            if (angular.isString(condition)) {
                predicate = {code: condition};
            } else {
                predicate = condition;
            }
            // if (!code) return undefined;
            // Find from builtin first in case of remote applet defs not loaded
            // var result = _.find(codeDefinedApps, predicate);
            var result = _.find(allAppletDefs, predicate);
            // if (!result) {
            //     result = _.find(that.allAppletDefs, predicate);
            // }
            if (!result && !ignoreWarning) {
                console.warn('Cannot find applet definition:', {
                    condition: condition,
                    allAppletDefs: allAppletDefs
                });
            }
            return result;
        }
    }

    /**
     * Reference of core attributes for applet definition
     * @constructor
     */
    function AppletDefinition() {
        this.code = '';
        this.title = '';
        /**
         * It supports:
         * - `Application`:
         * - `Library`:
         * @type {string}
         */
        this.type = '';
        /**
         * Two values:
         * - `CodeDefined`: applet is statically defined by code
         * - `DbDefined`: applet is dynamically defined in database
         * @type {string}
         */
        this.sourceType = '';
        this.icon = '';
        this.color = '';
        this.showIn = {desktop: 0, dock: 0};
        /**
         * Entry point of the applet.
         *
         * `type` supports:
         * - `state`: entry value is a ui-router state name, e.g. `app.gfs`
         * - `udp`: entry value is a udp page
         * @type {{type: string, value: string}}
         */
        this.entry = {type: '', value: '', params: ''}

        /**
         * Resolved router state for entry
         * @type {string}
         */
        this._resolvedState = '';
        this.windowSize = '';

    }

    /**
     *
     * @constructor
     */
    function AppletDisplay() {
        this.code = '';
        this.title = '';
        this.icon = '';
        this.color = '';
    }
})();

(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name appletContent
     * @description
     * Applet window layout.
     * ```
     * <applet-content the-applet="object" on-close="function">
     * ```
     */
    angular.module('oplus.commons').component('appletContent', {
        bindings: {
            theApplet: '<',
            onClose: '&'
        },
        templateUrl: 'app/modules/app/window/applet-content.component.html',
        controller: ['$timeout', '$rootScope', '$element', '$state', '$translate', 'messageService', 'appletRunman', 'runningState', 'appletRouter', AppletContentCtrl]
    });

    /**
     *
     * @param $timeout
     * @param {$rootScope} $rootScope
     * @param $element
     * @param $state
     * @param $translate
     * @param {messageService} messageService
     * @param {appletRunman} appletRunman
     * @param {runningState} runningState
     * @param {appletRouter} appletRouter
     * @constructor
     */
    function AppletContentCtrl($timeout, $rootScope, $element, $state, $translate, messageService, appletRunman, runningState, appletRouter) {
        var that = this;
        this.applet = this.theApplet;
        this.appletCode = this.applet.code || this.applet.name;
        this.useWindowUI = window.$oplus.appConfig.useWindowUI;
        this.menuItems = [];
        this.uiView = appletRouter.getAppletWindowUiView(this.applet.code);
        this.$onInit = onInit;
        this.navTo = navTo;

        function onInit() {
            $element.addClass('js-applet-content').attr('data-applet-code', that.applet.code);
            if (that.applet.entry.type === 'InternalState') {
                return;
            }
            for (let i = 0; i < that.applet.setting.nav.items.length; i++) {
                let item = that.applet.setting.nav.items[i];
                if (item.hide)
                    continue;
                let state = appletRouter.getAppletState(that.applet.code, 'open_menu');
                let menu = {
                    icon: item.icon,
                    title: item.name,
                    entry: item.entry,
                    url: $state.href(state, {pageId: item.entry}),
                    // https://github.com/angular-ui/ui-router/issues/2944#issuecomment-242780318
                    // ui-sref doesn't watch the state expression for perf reasons.
                    // We added a ui-state and ui-state-params directives to allow dynamic links:
                    // sref: (that.useDynamicState ? ('app.applet_view_' + that.applet.code + '.menu') : 'app.applet_view.open_menu')
                    state: state
                }
                that.menuItems.push(menu);
            }

            detectIfShowMainEntry();

            /**
             * If press F5 at open_menu or open_page state, it should not load main entry page defined in template.
             */
            function detectIfShowMainEntry() {
                that.showMainEntry = false;
                // NOTE: If no $timeout, the $state.current.name is empty
                $timeout(function () {
                    var appletMainState = appletRouter.getAppletState(that.applet.code);
                    // console.log('onInit: currentState=%s, appletMainState=%s', $state.current.name, appletMainState);
                    if ($state.current.name === appletMainState) {
                        that.showMainEntry = true;
                    }
                }, 100);
            }
        }

        function navTo(menuItem) {
            that.menuItems.forEach(function (o) {
                o.active = false;
            });
            menuItem.active = true;
            $state.go(menuItem.state, {pageId: menuItem.entry});
        }
    }
})();

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

/**
 *
 * @author chy, created on 2020 / 10 / 12
 *
 */
(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtJobsCtrl', AppletMgmtJobsCtrl);

    AppletMgmtJobsCtrl.$inject = ['$stateParams'];

    function AppletMgmtJobsCtrl($stateParams) {
        this.appletCode = $stateParams.appletCode;
    }
})();

/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 * @author chy , created on 2021/10/13.
 */
(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtPagesCtrl', AppletMgmtPagesCtrl);

    AppletMgmtPagesCtrl.$inject = ['$stateParams'];

    function AppletMgmtPagesCtrl($stateParams) {
        this.appletCode = $stateParams.appletCode;
    }
})();

(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtDatasetsCtrl', AppletMgmtDatasetsCtrl);

    AppletMgmtDatasetsCtrl.$inject = ['$stateParams'];

    function AppletMgmtDatasetsCtrl($stateParams) {
        this.appletCode = $stateParams.appletCode;
    }
})();

(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtDatasetsEditCtrl', AppletMgmtDatasetsEditCtrl);

    AppletMgmtDatasetsEditCtrl.$inject = ['$stateParams'];

    function AppletMgmtDatasetsEditCtrl($stateParams) {
        this.appletCode = $stateParams['appletCode'];
        //console.log('AppletMgmtDatasetEditCtrl',this.appletCode);
    }
})();

/**
 * @author mr.kongqi@gmail.com,2021/9/3 14:00,created
 */
(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtDataModelsCtrl', AppletMgmtDataModelsCtrl);

    AppletMgmtDataModelsCtrl.$inject = ['$scope', '$state', 'jaoJobService', '$stateParams', '$location', 'messageService', 'userPref', 'dcDataService', '$translate','appletSecurity'];

    /**
     *
     * @param $scope
     * @param $state
     * @param {jaoJobService} jaoJobService
     * @param $stateParams
     * @param $location
     * @param {messageService} messageService
     * @param {userPref} userPref
     * @param {dcDataService} dcDataService
     * @param $translate
     * @param {appletSecurity} appletSecurity
     * @constructor
     */
    function AppletMgmtDataModelsCtrl($scope, $state, jaoJobService, $stateParams, $location, messageService, userPref, dcDataService, $translate,appletSecurity) {
        var that = this;
        that.selectedCommands = [];
        that.deleteDcModel = deleteDcModel;
        that.refreshModes = refreshModes;
        that.deleteModels = deleteModels;

        that.selectedModels = []

        that.appletCode = $stateParams.appletCode;

        var columnDefs = [
            {
                data: 'code',
                title: $translate.instant('jao.dc.detail.code'),
                render: function (data, type, row, meta) {
                    return '<a class="d-block text-wrap" ui-sref="app.appman.datamodel.view({id:\'' + row.id + '\'})">' + data + '</a>';
                }
            },
            {data: 'appletCode', title: $translate.instant('jao.dc.detail.owner_application')},
            {data: 'dataMode', title: $translate.instant('jao.dc.detail.mode')},
            {
                data: 'updateBy',
                title: $translate.instant('common.entity.detail.update_by')
            },
            {
                data: 'updateAt',
                title: $translate.instant('common.entity.detail.update_at'),
                render: function (data, type, row, meta) {
                    var date = row.updateAt;
                    return $$.formatDate(date, 'YYYY-MM-DD hh:mm:ss');
                }
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    if (!appletSecurity.canModifyAppletResource(row['appletCode'])){
                        return '';
                    }

                    var id = "'" + row.id + "'";
                    var code = "'" + row.code + "'";
                    return ' <button type="submit" ui-sref=app.appman.datamodel.edit({id:\'' + row.id + '\'}) class="btn btn-default opx-btn-icon opx-btn-flat" uaa-has-permission="jao:edit:*" title="{{\'common.entity.action.edit\' | translate}}">' +
                        '     <i class="fa fa-pencil"></i>' +
                        ' </button>' +
                        ' <button type="submit" ng-click="$ctrl.deleteDcModel(' + id + ',' + code + ')" class="btn btn-default opx-btn-icon opx-btn-flat" uaa-has-permission="jao:edit:*" title="{{\'common.entity.action.delete\' | translate}}">' +
                        '     <i class="fa fa-trash-alt"></i>' +
                        ' </button>';
                }
            }
        ];
        that.tableConfig = {
            columns: columnDefs,
            data: [dcModelList],
            selection: {
                valueData: 'id', labelData: 'name', preselected: that.selectedModels
            },
            order: [[1, 'desc'], [4, 'desc']],
            buttons: []
        };

        function dcModelList() {
            return dcDataService.dcModelList(that.appletCode);
        }

        function deleteDcModel(id, code) {
            //console.log("id is " + id + "code is " + code)
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('jao.messages.delete_model', {code: code}),
                function () {
                    dcDataService.deleteModelById(id).then(function (data) {
                        messageService.toast('success', $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.delete')}));
                        $state.reload();
                    }).catch(function (err) {
                        messageService.alertError($translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.delete')}), err.message);
                        throw err;
                    })
                })
        }

        function refreshModes() {
            dcDataService.dcModelList().then(function (data) {
                that.tableConfig.data = data;
            })
        }

        function deleteModels() {
            var ids = that.selectedModels.map(function (m) {
                return m;
            });
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('jao.messages.delete_models'),
                function () {
                    dcDataService.deleteModels(ids).then(function (data) {
                        messageService.toast('success', $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.delete')}));
                        $state.reload();
                    }).catch(function (err) {
                        messageService.alertError($translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.delete')}), err.message);
                        throw err;
                    })
                })
        }

    }
})();

(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletHelpCtrl', AppletHelpCtrl);

    AppletHelpCtrl.$inject = ['$stateParams', '$translate', 'appletService', 'messageService'];

    /**
     *
     * @param $stateParams
     * @param appletService {appletService}
     * @constructor
     */
    function AppletHelpCtrl($stateParams, $translate, appletService, messageService) {
        var vm = this;//$scope;
        vm.isHelpDocExisting = true;

        function init() {
            if ($stateParams.appletCode) {
                appletService.findAppletByCode($stateParams.appletCode).then(function (result) {
                    var helpDocUrl = result.helpDocUrl;
                    if (helpDocUrl) {
                        if (helpDocUrl.indexOf(".pdf") != -1) {
                            viewPdf(helpDocUrl);
                        }
                    } else {
                        vm.isHelpDocExisting = false;
                    }
                }).catch(function () {
                    messageService.alertWarning($translate.instant("app.help.messages.warn.findAppletByCode.error"), $translate.instant("app.help.messages.warn.findAppletByCode.noExit"));
                });
            } else {
                messageService.alertWarning($translate.instant("app.help.messages.warn.findAppletByCode.error"), $translate.instant("app.help.messages.warn.findAppletByCode.noName"));
            }
        }

        init();


        /**
         * view pdf
         * @param helpDocUrl
         */
        function viewPdf(helpDocUrl) {
            PDFObject.embed(getDocFileUrl(helpDocUrl), "#pdf-container");
        }

        function getDocFileUrl(helpDocUrl) {
            return appletService.getHelpDocDownloadUrl(helpDocUrl);
        }
    }
})();

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


            /**
             * Get roles of current user in an applet
             * @param {string} appletCode
             * @return {Promise<[string]>}
             */
            function getMyRolesInApplet(appletCode) {
                return restUtils.callApi('udp', 'GET', '/api/udp/applets/{appletCode}/my-roles', {appletCode: appletCode});
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
                return restUtils.callApi('udp', 'POST', '/api/udp/applet/tenant/{tenantUserId}', {tenantUserId: tenantUserId}, applets);
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
                        var result = {code: applet.name, title: applet.title};
                        modal.close(result);
                        _.remove(that.history, {code: applet.name});
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
                restUtils.callApi('udp', 'DELETE', '/api/udp/applets/{id}', {id: id}).then(function (data) {
                    d.resolve(data);
                    broadcastAppletChanged();
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            }

            function deleteAppletAdm(id) {
                var d = $q.defer();
                restUtils.callApi('adm', 'DELETE', '/api/adm/applet/{id}', {id: id}).then(function (data) {
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
                return restUtils.callApi('udp', 'GET', '/api/udp/applets/name/{name}' + (options.disableI18n ? '?__noi18n' : ''), {name: code})
                    .then(function (applet) {
                        if (applet) {
                            applet.setting = JSON.parse(applet.setting);
                            return $q.resolve(applet);
                        } else {
                            if (options.alertIfFail) {
                                messageService.alertError($translate.instant("app.service.messages.error.findAppletByCode.title"), $translate.instant("app.service.messages.error.findAppletByCode.body", {name: code}));
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

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/2/18, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').service('appletSecurity', ['currentUser', appletSecurity]);

    /**
     * @ngdoc service
     * @name appletSecurity
     * @param {currentUser} currentUser
     * @description
     */
    function appletSecurity(currentUser) {
        // Access control
        this.canViewAppletList = canViewAppletList;
        this.canCreateApplet = canCreateApplet;
        this.canUpdateApplet = canUpdateApplet;
        this.canModifyAppletResource = canModifyAppletResource;
        this.canDevelopApplet = canDevelopApplet;
        this.canDeleteApplet = canDeleteApplet;
        this.canPublishApplet = canPublishApplet;
        this.canUseApplet = canUseApplet;

        function canViewAppletList() {
            return currentUser.isAuthenticated;
        }

        function canCreateApplet(appletCode) {
            return currentUser.hasPermission('app:edit:*');
        }

        function canUpdateApplet(appletCode) {
            return currentUser.hasAnyRole(['ROLE_DEVELOPER', 'ROLE_ADMIN'], appletCode);
        }

        function canModifyAppletResource(appletCode) {
            return canUpdateApplet(appletCode);
        }

        function canDevelopApplet(appletCode) {
            return currentUser.hasAnyRole(['ROLE_DEVELOPER'], appletCode);
        }

        function canDeleteApplet(appletCode, appletOwnerId) {
            return currentUser.loginId === appletOwnerId || currentUser.hasAnyRole(['ROLE_ADMIN','ROLE_PRIVUSER','ROLE_DEVELOPER'], appletCode);
        }

        function canPublishApplet(appletCode, appletOwnerId) {
            return canDeleteApplet(appletCode, appletOwnerId);
        }

        function canUseApplet(appletCode) {
            return currentUser.hasAnyRole(['ROLE_USER'], appletCode);
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/13, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name appletConfigAccess
     * @description
     * ```html
     * <applet-config-access ng-model="">
     * ```
     * @param {{}} ngModel
     */
    angular.module('oplus.commons').component('appletConfigAccess', {
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            theModel: '=ngModel'
        },
        templateUrl: 'app/modules/app/applet-config-access.component.html',
        controller: ['$scope', '$element', '$translate', 'messageService', AppletConfigAccessCtrl]
    });

    function AppletConfigAccessCtrl($scope, $element, $translate, messageService) {
        var that = this;
        var USER_BY_SYSTEM = 'SYSTEM';
        var USER_BY_MANUAL = 'MANUAL';
        // console.log('AppletConfigAccessCtrl: ngModel=%o', JSON.stringify(this.theModel));
        // this.theModel = this.theModel || {};
        this.$onInit = onInit;
        this.addRole = addRole;
        this.removeRole = removeRole;
        this.userMethods = [
            {value: USER_BY_SYSTEM, _title: $translate.instant('app.setting.ac.user_by_system')},
            {value: USER_BY_MANUAL, _title: $translate.instant('app.setting.ac.user_by_manual')}
        ]
        var defaultRoles = {
            ROLE_USER: {
                method: USER_BY_SYSTEM
            },
            ROLE_PRIVUSER: {
                method: USER_BY_SYSTEM
            },
            ROLE_DEVELOPER: {
                method: USER_BY_SYSTEM
            },
            ROLE_ADMIN: {
                method: USER_BY_SYSTEM
            }
        };

        function onInit() {
            // ngModel --> $modelValue --> Formatters --> $viewValue --> $render().
            // Widget --> $viewValue --> Parsers --> Validators? --> $modelValue --> ngModel.
            that.ngModelCtrl.$formatters.push(formatInput);
            that.ngModelCtrl.$render = renderViewValue;
            that.ngModelCtrl.$parsers.push(parseOutput);
            $scope.$watch('$ctrl.viewData', function (newVal, oldVal) {
                if (!newVal) return;
                // Custom controls might also pass objects to this method.
                // In this case, we should make a copy of the object before passing it to $setViewValue.
                // This is because ngModel does not perform a deep watch of objects,
                // it only looks for a change of identity.
                that.ngModelCtrl.$setViewValue(angular.copy(newVal));
            }, true)
        }

        function renderViewValue() {
            that.viewData = that.ngModelCtrl.$viewValue;
        }

        function formatInput(modelValue) {
            if (!modelValue) {
                return;
            }
            var allRoles = _.merge({}, defaultRoles, modelValue.roles);
            var viewValue = {roles: []};
            Object.keys(allRoles).forEach(function (roleName) {
                var role = _.merge({name: roleName}, allRoles[roleName]);
                if (defaultRoles[roleName]) {
                    role._builtin = true;
                }
                viewValue.roles.push(role);
            });
            return viewValue;
        }

        /**
         *
         * @param {{roles:[{name:string,method:string,users:[string]}]}} viewValue
         * @return {{roles: {"ROLE_NAME":{method:string,users:[string]}}}}
         */
        function parseOutput(viewValue) {
            var modelValue = {roles: {}};
            viewValue.roles.forEach(function (role) {
                modelValue.roles[role.name] = {method: role.method, users: role.users};
            });
            return modelValue;
        }

        /**
         *
         * @param {string} roleName
         */
        function removeRole(roleName) {
            messageService.confirm('Remove', 'Remove the role?', function () {
                _.remove(that.viewData.roles, {name: roleName});
            });
        }

        function addRole() {
            var role = {name: 'NEW_ROLE', method: USER_BY_MANUAL};
            var find = _.find(that.viewData.roles, {name: role.name});
            if (!find) {
                that.viewData.roles.push(role);
            }
        }
    }
})();

/**
 *
 * @author chy, created on 2021/10/12
 */
(function () {
    'use strict';
    /**
     * @usage
     * ```
     * <udp-applet-selector
     * applet-code="string"
     * on-change="function"
     * excluded="[string]"
     * options="{viewAs:string,showAll:boolean,includeAllAndNull:boolean}"/>
     * ```
     * @param {[string]} excluded Applet codes to be excluded
     * @param {function} onChange Callback on selection changes
     * @param {string} options.viewAs "dropdown"(default) or "list"
     * @param {boolean} options.showAll True to include unpublished applets. Default is false.
     * @param {boolean} options.includeAllAndNull True to include all and null applet. Default is false
     * @param {boolean} options.showFilter True to show search box to filter applets
     */
    angular.module('oplus.app').component('appletSelector', {
        bindings: {
            excluded: '<',
            appletCode: '=',
            onChange: '&',
            options: '<'
        },
        templateUrl: 'app/modules/app/helper/applet-selector.html',
        controller: ['$scope', 'appletService', '$translate', 'userPref', AppletSelectorCtrl]
    });

    /**
     *
     * @param $scope
     * @param {appletService} appletService
     * @param $translate
     * @param {userPref} userPref
     * @constructor
     */
    function AppletSelectorCtrl($scope, appletService, $translate, userPref) {
        var that = this;
        var excluded = that.excluded || [];
        that.options = _.extend({}, {viewAs: 'dropdown', showAll: false}, that.options);
        this.selectItem = selectItem;
        this.$onInit = onInit;

        function onInit() {
            $scope.$watch('$ctrl.appletCode', function (newVal, oldVal) {
                if (angular.isFunction(that.onChange())) {
                    var applet = _.find(that.applets, {name: newVal});
                    if (applet && angular.isFunction(that.onChange)) {
                        // Use onChange()(page) instead ot onChange(page)
                        // https://stackoverflow.com/a/26244600/1524900
                        that.onChange()(applet);
                    }
                }
            });

            appletService.findApplets().then(function (applets) {
                _.remove(applets, function (o) {
                    return excluded.indexOf(o.name) >= 0;
                });
                _.each(applets, function (applet) {
                    applet.setting = JSON.parse(applet.setting);
                });
                that.applets = _.orderBy(_.filter(applets, function (f) {
                    return that.options.showAll ? true : f.status === 'P';
                }), 'name');
                // that.applets = _.orderBy(applets, 'name');

                if (that.options.includeAllAndNull) {
                    that.applets.unshift({
                        name: '$NULL$',
                        title: $translate.instant('applet.selector.unsorted'),
                        setting: {icon: ''}
                    });
                    that.applets.unshift({
                        name: '',
                        title: $translate.instant('applet.selector.all'),
                        setting: {icon: ''}
                    });
                }

                if (!that.appletCode) {
                    that.appletCode = '';
                }
            }).catch(function (err) {
                throw err;
            });
        }

        function selectItem(applet) {
            that.appletCode = applet.name;
            that.selectedItem = applet.name;
        }
    }
})();