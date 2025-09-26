/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/4/2017
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('messageService', ['toaster', '$timeout', '$translate', '$uibModal', '$sce', messageService]);
    angular.module('oplus.commons').run(['customFunctions', 'messageService', function (cf, messageService) {
        cf.defineFunction('alert', {
            func: function (title, body, callback) {
                return messageService.alert(title, body, callback)
            },
            group: 'dev',
            sample: 'alert(title, body, callback)',
            desc: ""
        });

        cf.defineFunction('toast', {
            func: function (type, title, body) {
                return messageService.toast(type, title, body)
            },
            group: 'dev',
            sample: 'toast(type, title, body)',
            desc: ""
        });
    }]);

    /**
     * @ngdoc service
     * @name messageService
     * @param {toaster} toaster
     * @param $timeout
     * @description
     * Provides unified message and notification functions like alert, confirm, prompt, notification.
     */
    function messageService(toaster, $timeout, $translate, $uibModal, $sce) {
        init();
        /**
         * Display message in a modal dialog which has one OK button.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} [callback=] Callback when user clicks OK.
         */
        this.alert = function (title, body, callback) {
            callAlert(null, title, body, callback);
        };

        /**
         * Display error message in a modal dialog which has one OK button.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} [callback=] Callback when user clicks OK.
         */
        this.alertError = function (title, body, callback) {
            callAlert('danger', title, body, callback);
        };
        /**
         * Display success message in a modal dialog which has one OK button.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} [callback=] Callback when user clicks OK.
         */
        this.alertSuccess = function (title, body, callback) {
            callAlert('success', title, body, callback);
        };
        /**
         * Display warning message in a modal dialog which has one OK button.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} [callback=] Callback function called when user clicks OK.
         */
        this.alertWarning = function (title, body, callback) {
            callAlert('warning', title, body, callback);
        };

        /**
         * Display a confirmation modal dialog which has OK and cancel buttons.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} okCallback Callback when user clicks OK
         * @param {function} [cancelCallback] Callback when user clicks cancel
         */
        var _confirmOpen = false;
        this.confirm = function (title, body, okCallback, cancelCallback) {
            if (_confirmOpen) {
                return { result: Promise.resolve('ignored') };
            }
            _confirmOpen = true;
            // 使用 $uibModal 替代 alertify，确保模态框在正确的层级显示，样式与alert保持一致
            var modalRef = $uibModal.open({
                template:
                    '<div class="modal-header border-0" style="padding: 1rem 1.5rem 0.5rem; background-color: #f8f9fa;">' +
                    '   <h5 class="modal-title" style="font-weight: normal; color: #333; margin: 0;">{{$ctrl.title}}</h5>' +
                    '   <button type="button" ng-click="$ctrl.cancel()" aria-label="Close" style="background:none;border:none;font-size:1rem;color:#999;padding:0;line-height:1;">' +
                    '       <span aria-hidden="true">×</span>' +
                    '   </button>' +
                    '</div>' +
                    '<div class="modal-body" style="padding: 1rem 1.5rem; background-color: #f8f9fa;">' +
                    '   <div ng-bind-html="$ctrl.body" style="color: #333; font-size: 14px; line-height: 1.4;"></div>' +
                    '</div>' +
                    '<div class="modal-footer border-0" style="padding: 0 1.5rem 1.5rem; background-color: #f8f9fa; justify-content: flex-end;">' +
                    '   <button type="button" class="btn" ng-click="$ctrl.cancel()" style="background-color: #e9ecef; border-color: #e9ecef; color: #333; padding: 0.5rem 1rem; margin-right: 0.5rem;">{{$ctrl.cancelLabel}}</button>' +
                    '   <button type="button" class="btn" ng-click="$ctrl.ok()" style="background-color: #007bff; border-color: #007bff; color: white; padding: 0.5rem 1rem;">{{$ctrl.okLabel}}</button>' +
                    '</div>',
                controller: ['$uibModalInstance', function($uibModalInstance) {
                    var ctrl = this;
                    ctrl.title = title;
                    ctrl.body = $sce.trustAsHtml(body); // 安全地渲染HTML内容
                    ctrl.okLabel = $translate.instant('common.action.ok');
                    ctrl.cancelLabel = $translate.instant('common.action.cancel');

                    var handled = false;
                    ctrl.ok = function() {
                        if (handled) return; handled = true;
                        // 优化体验：点击后稍作停留再关闭（避免“秒关”突兀），再执行回调
                        var DELAY = 250; // 毫秒，和以往延迟感保持一致
                        $timeout(function(){
                            $uibModalInstance.close('ok');
                        }, DELAY);
                        $timeout(function () {
                            try { okCallback && okCallback(); } catch (e) { /* swallow */ }
                        }, DELAY + 10);
                    };

                    ctrl.cancel = function() {
                        if (handled) return; handled = true;
                        try { cancelCallback && cancelCallback(); } finally {
                            $uibModalInstance.dismiss('cancel');
                        }
                    };
                }],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: 'static',
                keyboard: true
            });
            // 确保关闭后释放锁
            var reset = function(){ _confirmOpen = false; };
            if (modalRef && modalRef.result && modalRef.result.finally) {
                modalRef.result.finally(reset);
            } else {
                // 兼容性：降级释放
                $timeout(reset, 0);
            }
            return modalRef;
        };
        /**
         * Display a confirmation modal dialog using alertify (legacy method)
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} okCallback Callback when user clicks OK
         * @param {function} [cancelCallback] Callback when user clicks cancel
         */
        this.confirmAlertify = function (title, body, okCallback, cancelCallback) {
            callConfirm(null, title, body, okCallback, cancelCallback);
        };

        /**
         * Display a confirmation modal dialog in warning style which has OK and cancel buttons.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} okCallback Callback when user clicks OK
         * @param {function=} cancelCallback Callback when user clicks cancel
         */
        this.confirmWarning = function (title, body, okCallback, cancelCallback) {
            callConfirm('warning', title, body, okCallback, cancelCallback);
        };
        /**
         * Display a confirmation modal dialog in danger style which has OK and cancel buttons.
         * Use cases like deletion confirmation.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} okCallback Callback when user clicks OK
         * @param {function} cancelCallback Callback when user clicks cancel
         * @param {string=} okLabel Label of OK button
         */
        this.confirmDanger = function (title, body, okCallback, cancelCallback, okLabel) {
            callConfirm('danger', title, body, okCallback, cancelCallback, okLabel);
        };

        /**
         * Display a modal dialog with user input control, OK and cancel buttons.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {string} defaultValue Default value for user input
         * @param {function} okCallback Callback when user clicks OK, parameter is user input value
         * @param {function} cancelCallback Callback when user clicks cancel
         */
        this.prompt = function (title, body, defaultValue, okCallback, cancelCallback) {
            // 使用 $uibModal 替代 alertify，确保模态框在正确的层级显示，样式与alert保持一致
            return $uibModal.open({
                template:
                    '<div class="modal-header border-0" style="padding: 1rem 1.5rem 0.5rem; background-color: #f8f9fa;">' +
                    '   <h5 class="modal-title" style="font-weight: normal; color: #333; margin: 0;">{{$ctrl.title}}</h5>' +
                    '   <button type="button" ng-click="$ctrl.cancel()" aria-label="Close" style="background:none;border:none;font-size:1rem;color:#999;padding:0;line-height:1;">' +
                    '       <span aria-hidden="true">×</span>' +
                    '   </button>' +
                    '</div>' +
                    '<div class="modal-body" style="padding: 1rem 1.5rem; background-color: #f8f9fa;">' +
                    '   <div class="d-flex align-items-start">' +
                    '       <div style="margin-right: 1rem; display: flex; align-items: center;">' +
                    '           <svg width="50" height="50" viewBox="0 0 50 50" style="margin-right: 8px;">' +
                    '               <circle cx="25" cy="25" r="20" fill="#17a2b8"/>' +
                    '               <text x="25" y="32" text-anchor="middle" fill="white" font-size="18" font-weight="bold">?</text>' +
                    '           </svg>' +
                    '           <svg width="40" height="40" viewBox="0 0 40 40">' +
                    '               <circle cx="20" cy="20" r="16" fill="#17a2b8"/>' +
                    '               <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">?</text>' +
                    '           </svg>' +
                    '       </div>' +
                    '       <div style="flex: 1; padding-top: 0.5rem;">' +
                    '           <div ng-bind-html="$ctrl.body" style="color: #333; font-size: 14px; line-height: 1.4; margin-bottom: 1rem;"></div>' +
                    '           <input type="text" class="form-control" ng-model="$ctrl.inputValue" placeholder="{{$ctrl.placeholder}}" autofocus style="font-size: 14px;">' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="modal-footer border-0" style="padding: 0 1.5rem 1.5rem; background-color: #f8f9fa; justify-content: flex-end;">' +
                    '   <button type="button" class="btn" ng-click="$ctrl.cancel()" style="background-color: #e9ecef; border-color: #e9ecef; color: #333; padding: 0.5rem 1rem; margin-right: 0.5rem;">{{$ctrl.cancelLabel}}</button>' +
                    '   <button type="button" class="btn" ng-click="$ctrl.ok()" style="background-color: #007bff; border-color: #007bff; color: white; padding: 0.5rem 1rem;">{{$ctrl.okLabel}}</button>' +
                    '</div>',
                controller: ['$uibModalInstance', function($uibModalInstance) {
                    var ctrl = this;
                    ctrl.title = title;
                    ctrl.body = $sce.trustAsHtml(body);
                    ctrl.inputValue = defaultValue || '';
                    ctrl.placeholder = defaultValue || '';
                    ctrl.okLabel = $translate.instant('common.action.ok');
                    ctrl.cancelLabel = $translate.instant('common.action.cancel');

                    ctrl.ok = function() {
                        $uibModalInstance.close('ok');
                        $timeout(function() {
                            okCallback && okCallback(ctrl.inputValue);
                        });
                    };

                    ctrl.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                        $timeout(function() {
                            cancelCallback && cancelCallback();
                        });
                    };
                }],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: true
            });
        };

        /**
         * Display a piece of message in floating layer.
         *
         * @param {string} type Value of `error`, `success`, `info`, `warning`
         * @param {string} title Succinct title text less than 20 characters
         * @param {string=} body Detailed message
         */
        this.toast = function (type, title, body) {
            var timeout;
            if (type === 'error' || type === 'warning') {
                timeout = 0;
            } else {
                timeout = 3;
            }
            //TODO: toaster cannot display `&nbsp;` or ` `, use full space for temp
            toaster.pop({type: type, title: title || '　', body: body, timeout: timeout * 1000});
        };

        function formatMessage(style, message) {
            if (!angular.isString(message))
                message = JSON.stringify(message);
            var css = 'd-flex align-items-center overflow-auto';//style ? 'alert alert-' + style : 'alert';
            // 移除所有图标，包括danger样式的图标
            message = '<div class="' + css + '"><div>' + (message || '') + '</div></div>';
            return message;
        }

        function callConfirm(style, title, message, okCallback, cancelCallback, okLabel) {
            // 统一使用 $uibModal，避免 alertify API 差异导致的运行时错误
            var isDanger = style === 'danger';
            var okText = okLabel ? okLabel : $translate.instant('common.action.ok');
            var cancelText = $translate.instant('common.action.cancel');

            var okBtnStyle = isDanger
                ? 'background-color: #dc3545; border-color: #dc3545; color: #fff;'
                : 'background-color: #007bff; border-color: #007bff; color: #fff;';

            return $uibModal.open({
                template:
                    '<div class="modal-header border-0" style="padding: 1rem 1.5rem 0.5rem; background-color: #f8f9fa;">' +
                    '   <h5 class="modal-title" style="font-weight: normal; color: #333; margin: 0;">{{$ctrl.title}}</h5>' +
                    '   <button type="button" ng-click="$ctrl.cancel()" aria-label="Close" style="background:none;border:none;font-size:1rem;color:#999;padding:0;line-height:1;">' +
                    '       <span aria-hidden="true">×</span>' +
                    '   </button>' +
                    '</div>' +
                    '<div class="modal-body" style="padding: 1rem 1.5rem; background-color: #f8f9fa;">' +
                    '   <div ng-bind-html="$ctrl.body" style="color: #333; font-size: 14px; line-height: 1.4;"></div>' +
                    '</div>' +
                    '<div class="modal-footer border-0" style="padding: 0 1.5rem 1.5rem; background-color: #f8f9fa; justify-content: flex-end;">' +
                    '   <button type="button" class="btn" ng-click="$ctrl.cancel()" style="background-color: #e9ecef; border-color: #e9ecef; color: #333; padding: 0.5rem 1rem; margin-right: 0.5rem;">{{$ctrl.cancelLabel}}</button>' +
                    '   <button type="button" class="btn" ng-click="$ctrl.ok()" style="' + okBtnStyle + ' padding: 0.5rem 1rem;">{{$ctrl.okLabel}}</button>' +
                    '</div>',
                controller: ['$uibModalInstance', function($uibModalInstance) {
                    var ctrl = this;
                    ctrl.title = title || '';
                    ctrl.body = $sce.trustAsHtml(formatMessage(style, message));
                    ctrl.okLabel = okText;
                    ctrl.cancelLabel = cancelText;

                    ctrl.ok = function() {
                        $uibModalInstance.close('ok');
                        $timeout(function () {
                            okCallback && okCallback();
                        });
                    };
                    ctrl.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                        $timeout(function () {
                            cancelCallback && cancelCallback();
                        });
                    };
                }],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: true
            });
        }

        function callAlert(style, title, message, callback) {
            // 使用 $uibModal 替代 alertify，确保模态框在正确的层级显示
            var iconClass = 'fa-info-circle';
            var iconColor = '#17a2b8'; // info blue
            var isError = false;

            if (style === 'danger') {
                iconClass = 'fa-exclamation-triangle';
                iconColor = '#dc3545'; // danger red
                isError = true;
            } else if (style === 'success') {
                iconClass = 'fa-check-circle';
                iconColor = '#28a745'; // success green
            } else if (style === 'warning') {
                iconClass = 'fa-exclamation-triangle';
                iconColor = '#ffc107'; // warning yellow
            }

            var template;
            if (isError) {
                // 错误样式：移除SVG图标，使用formatMessage中的FontAwesome图标
                template =
                    '<div class="modal-header border-0" style="padding: 1rem 1.5rem 0.5rem; background-color: #f8f9fa;">' +
                    '   <h5 class="modal-title" style="font-weight: normal; color: #333; margin: 0;">{{$ctrl.title}}</h5>' +
                    '   <button type="button" ng-click="$ctrl.close()" aria-label="Close" style="background:none;border:none;font-size:1rem;color:#999;padding:0;line-height:1;">' +
                    '       <span aria-hidden="true">×</span>' +
                    '   </button>' +
                    '</div>' +
                    '<div class="modal-body" style="padding: 1rem 1.5rem; background-color: #f8f9fa;">' +
                    '   <div ng-bind-html="$ctrl.message" style="color: #333; font-size: 14px; line-height: 1.4;"></div>' +
                    '</div>' +
                    '<div class="modal-footer border-0" style="padding: 0 1.5rem 1.5rem; background-color: #f8f9fa; justify-content: flex-end;">' +
                    '   <button type="button" class="btn" ng-click="$ctrl.close()" style="background-color: #6c757d; border-color: #6c757d; color: white; padding: 0.5rem 1.5rem;">{{$ctrl.closeLabel}}</button>' +
                    '</div>';
            } else {
                // 成功、警告、信息样式：移除图标，只显示文本
                template =
                    '<div class="modal-header border-0" style="padding: 1rem 1.5rem 0.5rem; background-color: #f8f9fa;">' +
                    '   <h5 class="modal-title" style="font-weight: normal; color: #333; margin: 0;">{{$ctrl.title}}</h5>' +
                    '   <button type="button" ng-click="$ctrl.close()" aria-label="Close" style="background:none;border:none;font-size:1rem;color:#999;padding:0;line-height:1;">' +
                    '       <span aria-hidden="true">×</span>' +
                    '   </button>' +
                    '</div>' +
                    '<div class="modal-body" style="padding: 1rem 1.5rem; background-color: #f8f9fa;">' +
                    '   <div ng-bind-html="$ctrl.message" style="color: #333; font-size: 14px; line-height: 1.4;"></div>' +
                    '</div>' +
                    '<div class="modal-footer border-0" style="padding: 0 1.5rem 1.5rem; background-color: #f8f9fa; justify-content: flex-end;">' +
                    '   <button type="button" class="btn" ng-click="$ctrl.close()" style="background-color: #6c757d; border-color: #6c757d; color: white; padding: 0.5rem 1.5rem;">{{$ctrl.closeLabel}}</button>' +
                    '</div>';
            }

            return $uibModal.open({
                template: template,
                controller: ['$uibModalInstance', function($uibModalInstance) {
                    var ctrl = this;
                    ctrl.title = title;
                    ctrl.message = $sce.trustAsHtml(formatMessage(style, message));
                    ctrl.iconClass = iconClass;
                    ctrl.iconColor = iconColor;
                    ctrl.closeLabel = $translate.instant('common.entity.action.close');

                    ctrl.close = function() {
                        $uibModalInstance.close('ok');
                        $timeout(function() {
                            callback && callback();
                        });
                    };
                }],
                controllerAs: '$ctrl',
                size: 'md',
                backdrop: true
            });
        }

        function init() {
            // 确保 alertify 已经加载
            if (typeof window.alertify !== 'undefined' && window.alertify) {
                // 确保 defaults 对象存在
                if (!window.alertify.defaults) {
                    window.alertify.defaults = {
                        transition: "none",
                        theme: {
                            ok: "btn btn-primary",
                            cancel: "btn btn-default",
                            input: "form-control"
                        }
                    };
                } else {
                    window.alertify.defaults.transition = "none";
                    window.alertify.defaults.theme.ok = "btn btn-primary";
                    window.alertify.defaults.theme.cancel = "btn btn-default";
                    window.alertify.defaults.theme.input = "form-control";
                }
                // console.log('messageService.init()...........',{$translate:$translate.instant('common.action.cancel')});
                // window.alertify.defaults.glossary.ok = $translate.instant('common.action.ok');
                // window.alertify.defaults.glossary.cancel = $translate.instant('common.action.cancel');
                console.log('✅ alertify initialized successfully');
            } else {
                // 限制重试次数，避免无限循环
                if (!init.retryCount) init.retryCount = 0;
                if (init.retryCount < 10) { // 减少重试次数到1秒
                    init.retryCount++;
                    console.warn('alertify is not loaded yet, initialization will be retried later (' + init.retryCount + '/10)');
                    setTimeout(init, 100);
                } else {
                    console.error('❌ alertify failed to load after 10 retries, message dialogs may not work properly');
                    console.error('Available global objects:', Object.keys(window).filter(k => k.includes('alert')));
                    console.error('window.alertify:', window.alertify);
                }
            }
        }
    }
})();
