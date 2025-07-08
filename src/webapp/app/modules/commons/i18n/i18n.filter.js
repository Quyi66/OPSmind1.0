(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .filter('findLanguageFromKey', ['LANGUAGES', findLanguageFromKey])

    function findLanguageFromKey(LANGUAGES) {
        return findLanguageFromKeyFilter;

        function findLanguageFromKeyFilter(lang) {
            return _.find(LANGUAGES, {code: lang}).title;
        }
    }


    angular.module('oplus.commons')
        .filter('ttt', ['$filter', tttFilter]);

    /**
     * @ngdoc filter
     * @name ttt
     */
    function tttFilter($filter) {
        return function (value, defaultValue) {
            var result = $filter("translate")(value)
            //If translate returns the same key sent we return null
            if (result === value) {
                return defaultValue;
            }
            return result;
        }
    }
})();
