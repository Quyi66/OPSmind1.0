(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.engine', {
                url: '/engine',
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/ssc/engine/engine-aap.html',
                        controller: 'EngineAAPController',
                        controllerAs: 'vm'
                    }
                }
            })
    }]);
})();
