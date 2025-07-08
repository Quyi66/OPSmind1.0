(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.syslog', {
                url: '/syslog',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/syslog/syslog.html';
                        },
                        controller: 'udpSyslogCtrl'
                    }
                }
            })
        ;
    }]);
})();
