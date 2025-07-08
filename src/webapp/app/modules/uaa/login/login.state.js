(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('app.login_main', {
                url: '/login',
                data: {
                    hideDesktop: true
                },
                views: {
                    'navbar@': {template: ''},
                    'content@': {
                        templateUrl: 'app/modules/uaa/login/login-main.html',
                        controller: 'LoginMainController',
                        controllerAs: 'loginMainVm'
                    }
                }
            })
            .state('app.login_certification', {
                animation: true,
                url: '/login-certification?code&state',
                views: {
                    'navbar@': {template: ''},
                    'content@': {
                        templateUrl: 'app/modules/uaa/login/login-certification.html',
                        controller: 'LoginCertController',
                        controllerAs: 'loginCertVm'
                    }
                }
            });
    }
})();

