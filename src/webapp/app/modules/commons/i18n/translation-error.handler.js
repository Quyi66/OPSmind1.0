(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('translationErrorHandler', translationErrorHandler);

    translationErrorHandler.$inject = ['$q', '$log'];

    function translationErrorHandler($q, $log) {
        return function (part, lang, response) {
            $log.error('The "' + lang + '/' + part + '" part was not loaded.');
            return $q.when({});
        };
    }

})();
