/**
 * @author mr.kongqi@gmail.com,2022/2/24 21:00,created
 */
(function () {
    'use strict';

    angular.module('oplus.search').config(['$stateProvider',
        function ($stateProvider) {
            configRoutes($stateProvider);
        }]);

    function configRoutes($stateProvider) {
        $stateProvider
            .state('app.search', {
                url: '/search',
                useAsApplet: {
                    type: 'PrivateTool',
                    code: 'search',
                    title: 'System Search Center',
                    icon: 'fa-search',
                    color: '#333'
                },
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/search/search-index.html',
                        controller: 'SearchCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
    }

})();
