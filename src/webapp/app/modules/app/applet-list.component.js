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
                // 如果 _user_applet 为 true，直接允许编辑
                if (applet._user_applet === true) {
                    applet._canUpdate = true;
                } else if (applet.sourceType !== 'CodeDefined') {
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
