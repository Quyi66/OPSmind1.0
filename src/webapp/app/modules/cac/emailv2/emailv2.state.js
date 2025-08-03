(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac.emailv2', {
                url: '/emailv2',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/emailv2/emailv2-index.html',
                        controller: 'CacEmailV2Controller',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.emailv2.template-list', {
                url: '/templates',
                views: {
                    'emailv2-view': {
                        templateUrl: 'app/modules/cac/emailv2/email-template-list.html',
                        controller: 'EmailTemplateListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.emailv2.recipient-list', {
                url: '/recipients/:templateId',
                views: {
                    'emailv2-view': {
                        templateUrl: 'app/modules/cac/emailv2/email-recipient-list.html',
                        controller: 'CacEmailV2RecipientController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.emailv2.recipient-manage', {
                url: '/manage/:templateId',
                views: {
                    'emailv2-view': {
                        templateUrl: 'app/modules/cac/emailv2/email-recipient-manage.html',
                        controller: 'CacEmailV2RecipientManageController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.emailv2.test', {
                url: '/test',
                views: {
                    'emailv2-view': {
                        templateUrl: 'app/modules/cac/emailv2/email-recipient-test.html',
                        controller: 'CacEmailV2RecipientTestController',
                        controllerAs: 'vm'
                    }
                }
            })
        ;
    }])
    ;
})();