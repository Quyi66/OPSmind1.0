(function () {
    'use strict';

    angular.module('oplus.commons').service('i18nService', i18nService);
    angular.module('oplus.commons').run(['customFunctions', '$translate', function (cf, $translate) {
        cf.defineFunction('translate', {
            func: function (translationId) {
                return $translate.instant(translationId)
            },
            group: 'dev',
            sample: 'translate(translationId)',
            desc: ""
        });
    }]);
    i18nService.$inject = ['$q', '$translate', 'tmhDynamicLocale', 'LANGUAGES'];

    /**
     * @ngdoc service
     * @param $q
     * @name i18nService
     * @param {$translate} $translate
     * @param tmhDynamicLocale
     * @param {LANGUAGES} LANGUAGES
     */
    function i18nService($q, $translate, tmhDynamicLocale, LANGUAGES) {
        this.initLanguage = initLanguage;
        this.text = text;
        this.getAllLanguages = getAllLanguages;
        this.getUserLastUsedLanguage = getUserLastUsedLanguage
        this.translateWithPrefixAndKey = translateWithPrefixAndKey;
        this.addLocaleForPivot = addLocaleForPivot;
        this.translateTwp = translateTwp;


        // TODO temporary solution
        var converterZhCnToZhTwP = OpenCC.Converter({ from: 'cn', to: 'twp' });

        /**
         * Use Opencc-Js to translate zh-CN to zh-TW(Phrases)
         * @param {*} obj Data Object to translate
         * @param {*} dataKeys Json Data Keys that need to be translated
         * @returns
         */
        function translateTwp(obj, dataKeys, force) {
            if (!obj) return obj;
            var currentLang = $translate.use();
            if (currentLang === 'zh-tw' || force === true) {
                var beginTranslateTs, res;
                beginTranslateTs = Date.now();
                if (dataKeys && angular.isArray(dataKeys) && dataKeys.length > 0) {
                    if (angular.isArray(obj))
                        obj.forEach(function (item) {
                            dataKeyHandler(item, dataKeys);
                        })
                    else if (angular.isObject(obj))
                        dataKeyHandler(obj, dataKeys);

                    res = obj;
                }
                else
                    res = JSON.parse(converterZhCnToZhTwP(JSON.stringify(obj)));

                // console.log('%c[OpenccJs]%c Translate used:', 'color:teal', '', Date.now() - beginTranslateTs + 'ms');
                return res;
            }
            else return obj;

            function dataKeyHandler(objItem, dataKeys) {
                dataKeys.forEach(function (key) {
                    if (objItem[key]) objItem[key] = converterZhCnToZhTwP(objItem[key])
                })
            }
        }

        /**
         * Init application language from default or specified language
         * @param {string=} langKey Force to use specified language
         * @return {Promise<string>} Language key
         */
        function initLanguage(langKey) {
            var promise;
            if (langKey) {
                promise = $q.when(langKey);
            } else {
                promise = getUserLastUsedLanguage();
            }
            return $q.when(promise.then(function (language) {
                // console.log('initUserLanguage: use ' + language);
                $translate.use(language);
                tmhDynamicLocale.set(language);
                moment.locale(language);
                return language;
            }));
        }

        function addLocaleForPivot(lang, translations) {
            var theLocale = $.pivotUtilities.locales[lang] = {
                localeStrings: translations,
                aggregators: $.pivotUtilities.aggregators,
                renderers: $.pivotUtilities.renderers
            };
            var c3r = $.pivotUtilities.c3_renderers;
            if (c3r) {
                theLocale.c3_renderers = $.pivotUtilities.c3_renderers;
                theLocale.renderers = $.extend(theLocale.renderers, theLocale.c3_renderers);
            }
            return theLocale;
        }

        /**
         * Translate input data by one key field and prefix.
         * It iterates every data. It translates with prefix + key field value and assign to target field.
         * It will mutate the input data.
         * @param {array|object} data
         * @param {string} prefix  Translation prefix
         * @param {string} keyField The field whose value will be appended to prefix as translation ID
         * @param {string} targetField The field to which the translated value will be assigned
         * @return Translated data
         */
        function translateWithPrefixAndKey(data, prefix, keyField, targetField) {
            if (angular.isArray(data)) {
                data.forEach(function (o) {
                    o[targetField] = $translate.instant(prefix + o[keyField]);
                });
            } else if (angular.isObject(data)) {
                Object.keys(data).forEach(function (prop) {
                    var item = data[prop];
                    var field = keyField === '$$KEY' ? prop : data[prop][keyField];
                    data[prop][targetField] = $translate.instant(prefix + field);
                });
            }
            return data;
        }

        /**
         *
         * @return {Promise<[String]>} All language codes
         */
        function getAllLanguages() {
            var deferred = $q.defer();
            deferred.resolve(_.map(LANGUAGES, 'code'));
            return deferred.promise;
        }

        /**
         *
         * @return {Promise<string>}
         */
        function getUserLastUsedLanguage() {
            var d = $q.defer();
            var language = $translate.storage().get($translate.storageKey());
            if (!language) {
                language = navigator.language.toLowerCase();
            }
            if (!_.find(LANGUAGES, {code: language})) {
                language = window.$oplus.appConfig.i18n.defaultLanguage;
            }
            d.resolve(language);
            return d.promise;
        }

        // this.token = token;

        /**
         * Translate by key
         * @param {string} key It can be a translation id or translation id wrapped with `#{}`
         */
        function token(key) {
            if (!key) {
                return key;
            }
            var matches = /#{(.*?)}/.exec(key);
            if (matches) {
                key = matches[1];
            }
            return $translate.instant(key);
        }

        /**
         * Translate text with `#{translationId}` inside
         * @param {string} str Input string
         * @returns {string}
         */
        function text(str) {
            if (!str || !angular.isString(str)) {
                return str;
            }
            var matches = str.match(/#{(.*?)}/g);
            if (matches) {
                matches.forEach(function (match) {
                    // Extract id from `#{translationId}`

                    var translationId = match.substring(2, match.length - 1);
                    if(translationId.includes("=")){
                        console.info("i18n translation contain critical code:", translationId);
                        return;
                    }
                    str = str.replace(new RegExp(match, 'g'), $translate.instant(translationId));
                });
            }
            return str;
        }
    }
})();
