
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac.email', {
                url: '/email',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/email/email-recipient.html',
                        controller: 'CacEmailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.email.list', {
                url: '/list',
                views: {
                    'email-view': {
                        templateUrl: 'app/modules/cac/email/email-recipient-list.html',
                        controller: 'CacEmailRecipientController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.email.list2', {
                url: '/list2',
                views: {
                    'email-view': {
                        templateUrl: 'app/modules/cac/emailv2/email-recipient-list.html',
                        controller: 'CacEmailV2RecipientController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.email.manage', {
                url: '/manage/:templateId',
                views: {
                    'email-view': {
                        templateUrl: 'app/modules/cac/email/email-recipient-manage.html',
                        controller: 'CacEmailRecipientManageController',
                        controllerAs: 'vm'
                    }
                }
            })


        ;
    }])
    ;
})
();
