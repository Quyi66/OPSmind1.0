/**
 * @author yangbin@famessoft.com, created on 2022/07/27
 *
 */
(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.email', {
                url: '/email',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/email/email.html';
                        },
                        controller: 'sscEmailCtrl',
                        controllerAs:'vm'
                    }
                }
            })
        ;
    }]);
})();
