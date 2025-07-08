(function () {
    'use strict';

    angular.module('oplus.commons')
        .factory('translationStorageProvider', translationStorageProvider);

    translationStorageProvider.$inject = ['$cookies', '$log', 'LANGUAGES'];

    function translationStorageProvider($cookies, $log, LANGUAGES) {

        return {
            get: get,
            put: put
        };

        function get(name) {
            var code = $cookies.getObject(name);
            if (!_.find(LANGUAGES, {code: code})) {
                $log.info('Resetting invalid cookie language "' + code + '" to preferred language "' + window.$oplus.appConfig.i18n.defaultLanguage + '"');
                $cookies.putObject(name, window.$oplus.appConfig.i18n.defaultLanguage);
            }
            return code;
        }

        function put(name, value) {
            $cookies.putObject(name, value);
        }

    }
})();
