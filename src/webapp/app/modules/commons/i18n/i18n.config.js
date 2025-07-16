/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2021/08/23
 */
(function () {
    'use strict';
    angular.module('oplus.commons')
        .config(['$httpProvider', i18nInterceptorConfig])
        .config(['$translateProvider', 'tmhDynamicLocaleProvider', i18nTranslateConfig]);

    /**
     *
     * LEO@20111118: Do NOT use $translatePartialLoaderProvider. It is an async loader which fetch data via `$http`.
     * Translation code in `run` might execute before language loaded.
     * We use sync loader instead.
     * @param {$translateProvider} $translateProvider
     * @param {tmhDynamicLocaleProvider} tmhDynamicLocaleProvider
     * @param {$translatePartialLoaderProvider} $translatePartialLoaderProvider
     */
    function i18nTranslateConfig($translateProvider, tmhDynamicLocaleProvider) {
        // console.log('i18nTranslateConfig')
        addTranslations();
        setUserLanguage();
        configTranslateProvider();

        function addTranslations() {
            // 使用 StaticFilesLoader 替代直接设置翻译
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '/common.json'
            });
        }

        /**
         * Set preferred language for current user
         */
        function setUserLanguage() {
            var defaultLanguage = getDefaultLanguage();
            // console.log('defaultLanguage:%s',defaultLanguage);
            $translateProvider.preferredLanguage(defaultLanguage);
        }

        function getDefaultLanguage() {
            var browserLang = navigator.language.toLowerCase();
            // 简化逻辑，直接返回默认语言
            return 'zh-cn';
        }

        function configTranslateProvider() {
            // if (window.$oplus.appConfig.i18n.isDebugLanguage) {
            //     $translateProvider.postProcess(function (translationId, translation, interpolatedTranslation, params, lang) {
            //         return '<span style="color: #cccccc">' + translationId + '(' + lang + '):</span> ' +
            //             (interpolatedTranslation ? interpolatedTranslation : translation);
            //     });
            // }
            // $translateProvider.useStorage('translationStorageProvider');
            $translateProvider.useLocalStorage();
            $translateProvider.useSanitizeValueStrategy('escaped');
            $translateProvider.storageKey('oplus.locale');
            // $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

            tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular-locale_{{locale}}.js');
            tmhDynamicLocaleProvider.useCookieStorage();
            tmhDynamicLocaleProvider.storageKey('oplus.locale');
        }
    }


    // /**
    //  *
    //  * @param {i18nService} i18nService
    //  * @param $translate
    //  */
    // function initUserLanguage(i18nService, $translate) {
    //     i18nService.getUserLastUsedLanguage().then(function (language) {
    //         console.log('initUserLanguage: use ' + language);
    //         $translate.use(language);
    //         moment.locale(language);
    //     });
    // }

    /**
     *
     * @param $httpProvider
     */
    function i18nInterceptorConfig($httpProvider) {
        // console.log('i18nInterceptorConfig');
        $httpProvider.interceptors.push(['$q', '$injector', i18nInterceptor]);

        /**
         *
         * @param $q
         * @param $injector
         * @see https://docs.angularjs.org/api/ng/service/$http#interceptors
         */
        function i18nInterceptor($q, $injector) {
            var i18nService;
            var TRANSLATE_STATIC_HTML = true;
            var TRANSLATE_API_DATA = true;
            var apiDataDefs = [
                {urlPattern: /api\/udp\/pages/, fields: ['html', 'title', 'content.title']},
                {urlPattern: /\/assets\/udp\/.*\.json/, fields: ['html','title']},
                {urlPattern: /api\/udp\/applets\/name\/.+/, fields: ['title', 'setting']},
                {urlPattern: /api\/udp\/applets/, fields: ['title']},
                {urlPattern: /api\/adm\/applet\/id/, fields: ['title']},
                {urlPattern: /api\/jao\/jobs\?/, fields: ['title', 'description']},
                {urlPattern: /api\/jao\/jobs\/app\?/, fields: ['title', 'description']},
                {urlPattern: /api\/jao\/jobs\/recently\?/, fields: ['jobTitle']},
                {urlPattern: /api\/jao\/jobs\?appletCode=/, fields: ['title']},
                {urlPattern: /api\/jao\/dc\/model/, fields: ['attrs', 'title']},
                {urlPattern: /api\/dts\/datasets\/findby\/applet/, fields: ['name']},
                {urlPattern: /api\/dts\/q\/data\/JAO_LIST_OPERATION_LOG\//, fields: ['action'], arrField: 'records'},
                {urlPattern: /api\/dts\/q\/data\/JAO_LIST_RUN_LOGS\//, fields: ['job_title'], arrField: 'records'},
            ];
            var htmlDefs = [
                {urlPattern: /^app\/.*\.html$/}
            ];
            var openccI18nDefs = [
                // { urlPattern: / Regex Pattern / [, dataKeys: [ Data Keys need to be translated ]](optional) }
                { urlPattern: /http[s]?:\/\/.*(\/gfs\/api\/gfs\/v2\/.*\/r\/.*\/.*)/, dataKeys: ['name', 'description'] },
                // { urlPattern: /http[s]?:\/\/.*(\/udp\/api\/udp\/pages\/.*)/, dataKeys: ['html'] }
            ];
            var noI18nPageUrl = [
                {urlPattern: /applets\/.*\/mgmt\/data\/models\/data\/model\/edit/ }
            ]

            var NO_I18N_INDICATOR = '__noi18n';
            return {
                // optional method
                request: function (config) {
                    // do something on success
                    return config;
                },
                // optional method
                requestError: function (rejection) {
                    return $q.reject(rejection);
                },
                /**
                 *
                 * @param {{status: number, statusText: string, config:{method:string,url:string, headers:{}}, data: string|*}} resp
                 * {
                 *   "data": "<div id=\"toast-container\" ng-class=\"[config.position, config.animation]\"><div ng-repeat=\"toaster in toasters\" class=\"toast\" ng-class=\"toaster.type\" ng-click=\"click($event, toaster)\" ng-mouseover=\"stopTimer(toaster)\" ng-mouseout=\"restartTimer(toaster)\"><div ng-if=\"toaster.showCloseButton\" ng-click=\"click($event, toaster, true)\" ng-bind-html=\"toaster.closeHtml\"></div><div ng-class=\"config.title\">{{toaster.title}}</div><div ng-class=\"config.message\" ng-switch on=\"toaster.bodyOutputType\"><div ng-switch-when=\"trustedHtml\" ng-bind-html=\"toaster.html\"></div><div ng-switch-when=\"template\"><div ng-include=\"toaster.bodyTemplate\"></div></div><div ng-switch-when=\"templateWithData\"><div ng-include=\"toaster.bodyTemplate\"></div></div><div ng-switch-when=\"directive\"><div directive-template directive-name=\"{{toaster.html}}\" directive-data=\"{{toaster.directiveData}}\"></div></div><div ng-switch-default >{{toaster.body}}</div></div></div></div>",
                 *   "status": 200,
                 *   "config": {
                 *      "method": "GET",
                 *      "cache": {},
                 *      "url": "angularjs-toaster/toast.html",
                 *      "headers": {
                 *      }
                 *   },
                 *   "statusText": "OK"
                 * }
                 */
                response: function (resp) {
                    var url = resp.config.url;
                    var href = location.href;
                    if (url.indexOf(NO_I18N_INDICATOR) > -1) {
                        return resp;
                    }

                    // Lazy load i18nService to avoid circular dependency
                    if (!i18nService) {
                        try {
                            i18nService = $injector.get('i18nService');
                        } catch (e) {
                            // Service not ready yet, skip translation
                            return resp;
                        }
                    }

                    if (TRANSLATE_STATIC_HTML) {
                        for (var j = 0; j < htmlDefs.length; j++) {
                            var html = htmlDefs[j];
                            if (html.urlPattern.test(url)) {
                                resp.data = i18nService.text(resp.data);
                                return resp;
                            }
                        }
                    }
                    if (TRANSLATE_API_DATA) {
                        for (var i = 0; i < noI18nPageUrl.length; i++) {
                            var def = noI18nPageUrl[i];
                            if (def.urlPattern.test(href)) {
                                return resp;
                            }
                        }

                        for (var i = 0; i < apiDataDefs.length; i++) {
                            var def = apiDataDefs[i];
                            if (def.urlPattern.test(url)) {
                                var data = resp.data;
                                if (data && def.arrField)
                                    data = resp.data[def.arrField];

                                if (angular.isString(data)) {
                                    resp.data = i18nService.text(data);
                                } else if (angular.isArray(data)) {
                                    def.fields.forEach(function (field) {
                                        data.forEach(function (record) {
                                            updateDataField(record, field, transField);
                                        });
                                    });
                                } else if (angular.isObject(data)) {
                                    def.fields.forEach(function (field) {
                                        updateDataField(data, field, transField);
                                    });
                                }
                                break;
                            }
                        }
                    }

                    // opencc
                    if (i18nService) {
                        _.forEach(openccI18nDefs, function (item) {
                            if (item.urlPattern.test(url)) {
                                if (item.dataKeys)
                                    resp.data = i18nService.translateTwp(resp.data, item.dataKeys);
                            } else
                                resp.data = i18nService.translateTwp(resp.data);
                        });
                    }

                    return resp;
                },
                responseError: function (rejection) {
                    return $q.reject(rejection);
                }
            };

            function transField(record, field) {
                record[field] = i18nService.text(record[field]);
            }

            function updateDataField(data, field, fn) {
                if (angular.isUndefined(data)) {
                    return;
                }
                if (angular.isArray(data)) {
                    data.forEach(function (item) {
                        updateDataField(item, field, fn);
                    });
                } else if (angular.isObject(data)) {
                    var paths = field.split('.');
                    var currentPath = paths.shift();
                    var pathValue = data[currentPath];
                    if (!angular.isObject(pathValue)) {
                        fn(data, currentPath);
                    } else {
                        updateDataField(pathValue, paths.join('.'), fn);
                    }
                }
            }
        }
    }
})();
