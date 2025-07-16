/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/4/2017
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('messageService', ['toaster', '$timeout', '$translate', messageService]);
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
    function messageService(toaster, $timeout, $translate) {
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
        this.confirm = function (title, body, okCallback, cancelCallback) {
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
            if (typeof alertify !== 'undefined' && alertify && alertify.prompt) {
                alertify.prompt(title, body, defaultValue,
                    function (evt, value) {
                        $timeout(function () {
                            okCallback(value);
                        });
                    },
                    function () {
                        $timeout(function () {
                            cancelCallback && cancelCallback();
                        });
                    });
            } else {
                console.error('alertify is not available for prompt');
            }
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
            var icon = '';
            if (style === 'danger') {
                icon = '<i class="fa fa-exclamation-triangle fa-3x text-danger me-3"></i>';
            }
            message = '<div class="' + css + '">' + icon + '<div>' + (message || '') + '</div></div>';
            return message;
        }

        function callConfirm(style, title, message, okCallback, cancelCallback, okLabel) {
            var setting = {
                'title': title || '',
                'message': formatMessage(style, message),
                'onok': function () {
                    $timeout(function () {
                        okCallback && okCallback();
                    })
                },
                'oncancel': function () {
                    $timeout(function () {
                        cancelCallback && cancelCallback();
                    })
                }
            };
            // if (okLabel) {
            setting.labels = {
                ok: okLabel ? okLabel : $translate.instant('common.action.ok'),
                cancel: $translate.instant('common.action.cancel')
            };
            // }
            if (style === 'danger') {
                setting.defaultFocus = 'cancel';
            }
            if (typeof alertify !== 'undefined' && alertify && alertify.confirm) {
                alertify.confirm().setting(setting).show(true, 'opx-' + style);
            } else {
                console.error('alertify is not available for confirm');
            }
            // return;
            // alertify.confirm(title || '', formatMessage(style, message),
            //     function () {
            //         $timeout(function () {
            //             okCallback && okCallback();
            //         });
            //     }, function () {
            //         $timeout(function () {
            //             cancelCallback && cancelCallback();
            //         })
            //     }).set('reverseButtons', true);
        }

        function callAlert(style, title, message, callback) {
            if (typeof alertify !== 'undefined' && alertify && alertify.alert) {
                alertify.alert().set({
                    label: $translate.instant('common.entity.action.close'),
                    onshow: function (e) {
                        $('.ajs-button.btn-primary').addClass('btn-default').removeClass('btn-primary');
                    }
                });
                alertify.alert(title, formatMessage(style, message), function () {
                    $timeout(function () {
                        callback && callback();
                    });
                });
            } else {
                console.error('alertify is not available for alert');
            }
        }

        function init() {
            // 确保 alertify 已经加载
            if (typeof alertify !== 'undefined' && alertify && alertify.defaults) {
                alertify.defaults.transition = "none";
                alertify.defaults.theme.ok = "btn btn-primary";
                alertify.defaults.theme.cancel = "btn btn-default";
                alertify.defaults.theme.input = "form-control";
                // console.log('messageService.init()...........',{$translate:$translate.instant('common.action.cancel')});
                // alertify.defaults.glossary.ok = $translate.instant('common.action.ok');
                // alertify.defaults.glossary.cancel = $translate.instant('common.action.cancel');
                console.log('✅ alertify initialized successfully');
            } else {
                // 限制重试次数，避免无限循环
                if (!init.retryCount) init.retryCount = 0;
                if (init.retryCount < 50) { // 最多重试5秒
                    init.retryCount++;
                    console.warn('alertify is not loaded yet, initialization will be retried later (' + init.retryCount + '/50)');
                    setTimeout(init, 100);
                } else {
                    console.error('❌ alertify failed to load after 50 retries, message dialogs may not work properly');
                }
            }
        }
    }
})();
