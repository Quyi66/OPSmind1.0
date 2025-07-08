/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/05/2018
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpPageActions
     * @description
     * ```html
     * <udp-page-actions options="object">
     * ```
     * @param {object=} options
     */
    angular.module('oplus.udp').component('udpPageActions', {
        bindings: {
            pageId: '<',
            pageUrl: '<',
            pageTitle: '<',
            pageAction: '<',
            options: '<'
        },
        templateUrl: 'app/modules/udp/page-actions.html',
        controller: ['$scope', '$translate', '$element', '$state', 'runningState', '$timeout', '$location', '$window', '$uibModal', '$uibModalStack', /*'$uibModalInstance',*/
            'pageService', 'pageDataUtil', 'messageService', 'currentUser', 'devel', 'zhaohu', PageActionsCtrl]
    });


    /**
     * @param $scope
     * @param $translate
     * @param {$element} $element
     * @param $state
     * @param {runningState} runningState
     * @param $timeout
     * @param $location
     * @param $window
     * @param $uibModal
     * @param $uibModalStack
     * @param {pageService} pageService
     * @param {pageDataUtil} pageDataUtil
     * @param {currentUser} currentUser
     * @param {messageService} messageService
     * @param {devel} devel
     * @param {zhaohu} zhaohu
     */
    function PageActionsCtrl($scope, $translate, $element, $state, runningState, $timeout, $location, $window, $uibModal, $uibModalStack,
                             pageService, pageDataUtil, messageService,
                             currentUser, devel, zhaohu) {
        var that = this;
        var isOutermostPage = $element.parents('udp-page-view').length === 0;
        var isInModal = $element.parents('.modal').length > 0;
        var defaultOptions = {
            enableManagement: !false,
            enableShare: !false,
            enableExport: !false,
            enableActions: false
        };

        this.pageInfo = {
            id: that.pageId,
            title: that.pageTitle,
            url: that.pageUrl,
            action: that.pageAction
        };
        // this.currentUser = currentUser;
        // this.history = runningState.allHistory();
        // this.sharePage = sharePage;
        // this.deletePage = deletePage;
        this.hasEditPermission = hasEditPermission;
        this.exportPage = exportPage;
        this.clonePage = clonePage;
        this.openPage = openPage;

        var isApplet = $state.current.name.indexOf('app.applet_') === 0;
        this.display = _.merge({}, defaultOptions, this.options, {
            enableActions: this.pageInfo.view !== 'app' && !isApplet,
            enableZoom: !isOutermostPage || isInModal
        });

        function hasEditPermission(action) {
            return currentUser.hasPermission("udp:edit:*") /*&& currentUser.hasOperationPermisson(action, 'w')*/;
        }

        function openPage() {
            var url = pageInfo.url;
            $timeout(function () {
                // console.log('openPageInSelf');
                window.location.href = url;
            });
        }

        function clonePage() {
            var pageId = pageInfo.id;
            pageService.clonePage(pageId).then(function (pages) {
                messageService.toast('success', $translate.instant('udp.page.clone.clone_success'));
            }).catch(function (e) {
                messageService.toast('error', e.message);
            });
        }

        function exportPage(format) {
            pageService.exportCurrentView(format, that.pageTitle);
        }

        function deletePage() {
            messageService.confirmDanger(
                $translate.instant('common.term.delete'), $translate.instant('udp.page.delete.delete_confirm', {title: that.pageTitle}), function () {
                    pageService.deletePage(that.pageId);
                    messageService.toast('success', $translate.instant('udp.page.delete.delete_result'));
                }, function () {
                });
        }

        function sharePage(pageId, integration) {
            var templateUrl = 'app/modules/udp/page-share-modal.html';
            // if (integration === 'zhdyh') {
            //     templateUrl = 'app/modules/udp/integration/zhdyh-share.html';
            // }
            var uibModalInstance = $uibModal.open({
                templateUrl: templateUrl,
                controller: ['runningState', 'pageInfo', SharePageCtrl],
                controllerAs: 'vm',
                resolve: {
                    pageInfo: function () {
                        return pageInfo;
                    }
                },
                size: 'md'
            });

            /**
             * @param {runningState} runningState
             * @param {object} pageInfo
             * @constructor
             */
            function SharePageCtrl(runningState, pageInfo) {
                var that = this;
                this.pageInfo = pageInfo;
                this.sendEmail = sendEmail;
                this.cancel = cancel;
                this.shareZhdyh = shareZhdyh;
                this.shareMethods = {
                    'url': {title: $translate.instant('udp.page.share.copy_url')},
                    'email': {title: $translate.instant('udp.page.share.send_email')}
                };
                this.methodKeys = Object.keys(this.shareMethods);
                this.method = this.methodKeys[0];

                function sendEmail() {
                    that.isSending = true;
                    pageService.emailPage(that.to, pageInfo.title, function () {
                        that.isSending = false;
                    });
                }

                function cancel() {
                    uibModalInstance.close();
                }

                /**
                 * Share with Zhaohu 订阅号
                 */
                function shareZhdyh() {
                    zhaohu.sendUrlCard({
                        title: pageInfo.title,
                        content: pageInfo.url,
                        type: 'url'
                    }).then(function () {
                        messageService.toast('success', $translate.instant('udp.page.share.send_card_success'));
                        uibModalInstance.close();
                    }).catch(function (err) {
                        messageService.toast('error', err.message);
                    });
                }
            }
        }
    }
})();
