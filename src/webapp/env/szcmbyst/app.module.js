(function () {

    'use strict';

    angular.module('app', [
        'ngStorage',
        'ngAnimate',
        'ngSanitize',
        'ngLocale',
        'ui.router',
        'oplus.commons',
        'oplus.main',
        'oplus.uaa',
        'oplus.tm'
    ])
        .config(['tmDaoProvider', function (tmDaoProvider) {
            tmDaoProvider.useLocalDb(window.$oplus.appConfig.modules.tm.useLocalDb);
        }]);

})();
