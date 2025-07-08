/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/4, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').service('translatorService', ['$q', '$http', 'restUtils', 'i18nService', translatorService]);

    /**
     * @ngdoc service
     * @name translatorService
     * @description
     */
    function translatorService($q, $http, restUtils, i18nService) {
        this.listAllTrans = listAllTrans;
        this.saveAllTrans = saveAllTrans;
        this.translate = translate;
        this.save = save;
        this.rename = rename;
        this.merge = merge;
        this.remove = remove;

        /**
         *
         * @param {[{key:string,trans:{'zh-cn':string,'zh-tw':string,'en':string}}]} trans All translation data
         * @return {Promise<{langs:[string], keyCount:number, fileCount:number}>}
         */
        function saveAllTrans(trans) {
            return restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/translations', null, trans);
        }

        /**
         *
         * @return {Promise<[{key:string,"zh-cn":string,"zh-tw":string,refs:[{}]}]>}
         */
        function listAllTrans(forceReload) {
            var d = $q.defer();
            var translations;
            var begin = Date.now();
            restUtils.callApi('', 'GET', 'http://localhost:3001/api/i18n/translations').then(function (data) {
                console.log('LoadTranslations: %d ms', Date.now() - begin);
                begin = Date.now();
                translations = data;
                var apiPath = 'http://localhost:3001/api/i18n/references';
                if (forceReload) {
                    apiPath += '?forceReload=true';
                }
                return restUtils.callApi('', 'GET', apiPath);
            }).then(function (references) {
                console.log('LoadReferences: %d ms', Date.now() - begin);
                translations.forEach(function (trans) {
                    var key = trans.key;
                    var find = _.find(translations, {key: key});
                    if (find) {
                        find.refs = references[key] ? references[key].refs : [];
                    }
                });
                d.resolve(translations);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function _listAllTrans() {
            var d = $q.defer();
            restUtils.callApi('', 'GET', 'http://localhost:3001/api/i18n/translations').then(function (data) {
                d.resolve(data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function translate(text, to) {
            var defer = $q.defer();
            if (to === 'zh-tw') defer.resolve(i18nService.translateTwp(text, null, true));
            else {
                restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/translate', null, { text: text, to: to })
                    .then(function (res) {
                        defer.resolve(res);
                })
                .catch(function (e) {
                    defer.reject(e);
                });
            } 
            return defer.promise;
        }

        // {key: string, trans: Array[{langCode: string}, ...]}
        function save(editData) {
            var defer = $q.defer();
            restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/save', null, editData)
                .then(function (res) {
                    defer.resolve(res);
            })
            .catch(function (e) {
                defer.reject(e);
            });
            return defer.promise;
        }

        // {key: string, trans: Array[{langCode: string}, ...]}
        function rename(oldKey, newKey) {
            var defer = $q.defer();
            restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/rename', null, {oldKey: oldKey, newKey: newKey})
                .then(function (res) {
                    defer.resolve(res);
                })
                .catch(function (e) {
                    defer.reject(e);
                });
            return defer.promise;
        }

        // {key: string, trans: Array[{langCode: string}, ...]}
        function merge(oldKey, newKey) {
            var defer = $q.defer();
            restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/merge', null, {oldKey: oldKey, newKey: newKey})
                .then(function (res) {
                    defer.resolve(res);
                })
                .catch(function (e) {
                    defer.reject(e);
                });
            return defer.promise;
        }

        // {key: string, trans: Array[{langCode: string}, ...]}
        function remove(key) {
            var defer = $q.defer();
            restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/remove', null, { key })
                .then(function (res) {
                    defer.resolve(res);
                })
                .catch(function (e) {
                    defer.reject(e);
                });
            return defer.promise;
        }
    }
})();
