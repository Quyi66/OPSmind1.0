/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */
(function () {
    'use strict';
    angular.module('oplus.udp').controller('PageDesignerCtrl', PageDesignerCtrl);

    PageDesignerCtrl.$inject = ['$scope', '$rootScope', '$translate', '$timeout', '$state', '$stateParams',
        '$uibModal',
        'pageService',
        'messageService', 'themeService', 'currentUser', 'widgetDnd'];

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $translate
     * @param $timeout
     * @param $state
     * @param $stateParams
     * @param $uibModal
     * @param {pageService} pageService
     * @param {messageService} messageService
     * @param {themeService} themeService
     * @param {currentUser} currentUser
     * @param {widgetDnd} widgetDnd
     * @constructor
     */
    function PageDesignerCtrl($scope, $rootScope, $translate, $timeout, $state, $stateParams, $uibModal,
                              pageService, messageService, themeService, currentUser, widgetDnd) {
        var pageId = $stateParams.pageId || '';
        var appletCode = $stateParams.appletCode || '';
        if (!appletCode) {
            messageService.alertError('Error', 'ProgramError: Need parameter `appletCode`');
            return;
        }
        var modalInstance, folderModalInstance, code = "";
        var ctrl = $scope;
        var WIDGET_HOVER_DELAY_MS = 400;
        ctrl.pageTemplates = [{code: 'leftright', icon: 'fa-list'}, {
            code: 'apppage',
            icon: 'fa-window-alt'
        }, {code: 'blank', icon: 'fa-file'}];
        // 20200430: To identify this is page scope. It is used to find page scope.
        // In view mode, page scope is in udp-page-view.
        // In design mode, when drag a new widget to canvas, need this scope to compile in widget-dnd.onEnd
        // ctrl._THIS_IS_PAGE_ = true;
        // ctrl.pageParams = {};
        ctrl.pageId = pageId;
        ctrl.appletCode = appletCode;
        ctrl.showWidgetOutline = false;
        ctrl.showMoreSpace = true;
        ctrl.inMode = 'edit';
        ctrl.showToolbox = !$rootScope.$global.userPref['udp.pd.hideToolbox'];
        ctrl.genSourceCode = genSourceCode;
        ctrl.saveAsTemplate = saveAsTemplate;
        ctrl.savePage = savePage;
        ctrl.configPage = configPage;
        ctrl.selectPageTemplate = selectPageTemplate;
        ctrl.toggleToolbox = toggleToolbox;
        ctrl.hasEditPermission = hasEditPermission;
        ctrl.onClickBackBtn = onClickBackBtn;

        if (pageId) {
            pageService.findPage(pageId, {disableI18n: true}).then(function (page) {
                ctrl.page = page;
                code = ctrl.page.code;
                // Dismiss open modal, e.g. when click edit from a dialog page view
                //LEO@20211225: Do NOT dismiss open modal rudely because in window UI mode, page designer is open from a modaless modal.
                // pageService.dismissModal();
                pageService.beginEditPage(ctrl.page);
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('common.term.error'), err.message);
            });
        } else {
            // If this is a new page, open dialog to choose template
            ctrl.page = {
                action: "r,w",
                setting: {}
            };
            openPageTemplateDialog();
        }

        $scope.$on('udpPageLoaded', function () {
            widgetDnd.initCanvasDnd($scope);
            handleCanvasClickEvent();
        });
        $scope.$on('$destroy', function () {
            pageService.endEditPage();
            var pageContainer = $(pageService.PAGE_WRAPPER_SELECTOR);
            pageContainer.off('click').off('mouseleave').off('mouseover').off('mouseenter');
        });

        function handleCanvasClickEvent() {
            var timer;
            var pageContainer = $(pageService.PAGE_WRAPPER_SELECTOR);
            pageContainer.on('mouseover', '.uwidget', function (e, t) {
                // Stop highlight during dragging or resizing
                // https://stackoverflow.com/questions/15098584/check-if-mouse-button-is-down-while-hovering
                if (e.buttons !== 0) {
                    return;
                }
                var elem = $(this);
                if (!needHandleMouseMove(elem))
                    return;
                var allWidgets = $('.uwidget', pageContainer);
                timer = setTimeout(function detectMouseHoverOnWidget() {
                    allWidgets.removeClass('hover');
                    if (timer) {
                        alignUwButtons();
                        elem.addClass('hover');
                    }

                    function alignUwButtons() {
                        var self = elem;
                        var buttons = elem.find('>.uw-buttons');
                        var target = pageContainer;
                        var distanceX = (self.offset().left + buttons.outerWidth()) - (target.offset().left + target.outerWidth());
                        buttons.css('right', distanceX > 0 ? 0 : '');
                    }
                }, WIDGET_HOVER_DELAY_MS);
                e.stopPropagation();
            }).on('mouseleave', '.uwidget', function (e) {
                var elem = $(this);
                if (!needHandleMouseMove(elem)) {
                    return;
                }
                elem.removeClass('hover');
                if (timer) {
                    clearTimeout(timer);
                    timer = undefined;
                }
                e.stopPropagation();
            });
            pageContainer.on('click', '.uw-config .js-uw-embed-style a',
                function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    var elemToChangeStyle = $this.closest('.uwidget').find('.js-uw-style');
                    var cssRegEx = elemToChangeStyle.data('customcss');
                    if (cssRegEx) {
                        elemToChangeStyle.removeClassMatch(new RegExp(cssRegEx))
                    }
                    // var body = $('> .uw-body', elemToChangeStyle);
                    var css = $this.attr('rel');
                    elemToChangeStyle.addClass(css);
                }
            );

            function needDebug(e) {
                return e.target.$$hashKey === 'object:243';
            }

            function needHandleMouseMove(elem) {
                if ($('.udp-pd-widget-pinned').length > 0) {
                    return false;
                }
                //20210416: If this is a widget embedded in custom page
                return elem.closest('udp-page-view[page-id]').length <= 0;
            }
        }


        function toggleToolbox() {
            // console.log('toggleToolbox');
            ctrl.showToolbox = !ctrl.showToolbox;
            $rootScope.$global.userPref['udp.pd.hideToolbox'] = !$rootScope.$global.userPref['udp.pd.hideToolbox'];
            // Need ensure hide/show toolbox before broadcast event
            // TODO: a temp solution
            var $pd = $('#pd-palette-zone');
            if (ctrl.showToolbox) {
                $pd.removeClass('ng-hide');
            } else {
                $pd.addClass('ng-hide');
            }
            // $timeout(function () {
            // Broadcast on rootScope to resize all widgets
            $rootScope.$broadcast('WIDGET_RESIZE', {from: 'TOGGLE_TOOLBOX', reHeight: false});
            // });
        }

        function saveAsTemplate() {
            alert('TODO');
        }

        function openPageTemplateDialog() {
            modalInstance = $uibModal.open({
                templateUrl: 'app/modules/udp/page-tpl-selector.html',
                scope: $scope,
                size: 'md'
            });
        }

        function genSourceCode() {
            ctrl.sourceCode = pageService.genSourceCode();
        }

        function selectPageTemplate(template) {
            modalInstance.close();
            pageService.loadPageTemplate(template).then(function (html) {
                ctrl.page = {
                    action: "r,w",
                    html: html,
                    setting: {},
                    home: 0
                };
                ctrl.newPageHtml = ctrl.page.html;
                pageService.beginEditPage(ctrl.page);
            }).catch(function (err) {
                throw err;
            });
        }


        function configPage() {
            modalInstance = $uibModal.open({
                // templateUrl: 'app/modules/udp/page-setting.html',
                template:
                    '<div class="modal-header"><h4 class="modal-title">{{\'udp.page.actions.setting\'|translate}}</h4></div>' +
                    '<div class="modal-body op-smartform form-horizontal">' +
                    '<udp-page-setting page="$ctrl.page"></udp-page-setting>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-primary opx-btn-ok" ng-click="$ctrl.doSubmit()">{{\'common.action.ok\'|translate}}</button>' +
                    '<button type="button" class="btn btn-default opx-btn-cancel" ng-click="$ctrl.doCancel()">{{\'common.action.cancel\'|translate}}</button>' +
                    '</div>',
                controller: ['page', PageSettingDialogCtrl],
                controllerAs: '$ctrl',
                resolve: {
                    page: function () {
                        return angular.copy(ctrl.page);
                    }
                },
                size: 'lg'
            });
            modalInstance.result.then(function confirm(page) {
                angular.extend(ctrl.page, page);
                console.log('ctrl.page', ctrl.page.setting);
            }, function cancel() {
            });

            function PageSettingDialogCtrl(page) {
                var vm = this;
                // console.log('page', page);
                vm.page = page;
                vm.doSubmit = doSubmit;
                vm.doCancel = doCancel;

                function doCancel() {
                    modalInstance.dismiss();
                }

                function doSubmit(event) {
                    modalInstance.close(vm.page);
                }
            }
        }

        function savePage() {
            // console.log('inMode===========', ctrl.inMode, ctrl.sourceCode);
            if (ctrl.inMode === 'source') {
                ctrl.page.html = ctrl.sourceCode;
            } else {
                ctrl.page.html = pageService.genSourceCode();
            }
            if (!ctrl.page.appletCode && ctrl.appletCode) ctrl.page.appletCode = ctrl.appletCode

            pageService.savePage(ctrl.page).then(function (page) {
                code = ctrl.page.code;
                messageService.toast('success', $translate.instant('udp.designer.edit.save_success'));
                if (!pageId) {
                    $state.go('app.appman.page.edit', {pageId: page.id, appletCode: ctrl.appletCode});
                } else if (ctrl.inMode === 'source') {
                    console.warn('TODO: need reload page');
                }
            }).catch(function (err) {
                messageService.toast('error',$translate.instant('common.term.error'),err.message);
            });
        }

        function hasEditPermission(action) {
            return currentUser.hasPermission("udp:edit:*") /*&& currentUser.hasOperationPermisson(action, 'w')*/;
        }

        function onClickBackBtn() {
            if (ctrl.appletCode) $state.go('app.appman.page', {appletCode: ctrl.appletCode});
            else $state.go('app.udp');
        }
    }
})();
