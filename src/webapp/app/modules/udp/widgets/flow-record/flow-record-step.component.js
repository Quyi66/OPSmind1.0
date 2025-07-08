/**
 * @author yangbin
 * @date 2022-09-30 created
 */
(function () {
    'use strict';


    angular.module('oplus.udp').component('flowRecordStep', {
        bindings: {
            theFlow: '=theModel',
            _options: '<options'
        },
        templateUrl: 'app/modules/udp/widgets/flow-record/flow-record.html',
        controller: ['$scope', '$timeout', '$interval', 'messageService', '$rootScope', '$translate', '$state', 'dataEx', 'pageDataUtil', 'jaoFlowService', FlowRecordStepCtrl]
    });


    function FlowRecordStepCtrl($scope, $timeout, $interval, messageService, $rootScope, $translate, $state, dataEx, pageDataUtil, jaoFlowService) {
        var that = this;
    }
})();
