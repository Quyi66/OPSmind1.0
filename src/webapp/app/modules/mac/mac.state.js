/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-01-03.
 */
(function () {
    'use strict';

    angular.module('oplus.mac').config(['$stateProvider',
        function ($stateProvider) {
            configRoutes($stateProvider);
        }]);

    function configRoutes($stateProvider) {
        $stateProvider
            // .state('app.mac', {
            //     url: '/gfs',
            //     views: {
            //         'mainView': {
            //             templateUrl: 'app/modules/gfs/gfs-index.html'
            //         }
            //     }
            // })
        ;
    }
})();
