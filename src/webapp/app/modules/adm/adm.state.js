/**
 * @author wuqiang@famessoft.com , created on 2020-08-07.
 */
(function () {
    'use strict';

    angular.module('oplus.adm').config(['$stateProvider',
        function ($stateProvider) {
            configRoutes($stateProvider);
        }]);

    function configRoutes($stateProvider) {
        $stateProvider
            .state('app.adm', {
                url: '/adm',
                views: {
                    'mainView': {
                        template: '<div ui-view="adm_main_view" class="w-100 h-100"></div>',
                    }
                }
            })
            .state('app.adm.config', {
                url: '/config',
                views: {
                    'adm_main_view': {
                        templateUrl: 'app/modules/adm/config-index.html',
                        controller: 'admCtrl',
                        controllerAs: 'admVm'
                    }
                }
            })
        ;
    }
})();
