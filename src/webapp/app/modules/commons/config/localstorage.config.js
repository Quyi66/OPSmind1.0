(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .config(localStorageConfig);

    localStorageConfig.$inject = ['$localStorageProvider', '$sessionStorageProvider'];

    function localStorageConfig($localStorageProvider, $sessionStorageProvider) {
        $localStorageProvider.setKeyPrefix('oplus-');
        $sessionStorageProvider.setKeyPrefix('oplus-');
    }
})();
