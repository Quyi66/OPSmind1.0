/**
 * @author yangbin
 * @date 2022-09-17 created
 */
(function () {
    'use strict';


    angular.module('oplus.udp').controller('flowImportCtrl', FlowImportCtrl);

    FlowImportCtrl.$inject = ['$scope','messageService', '$translate', '$uibModalInstance', 'pageDataUtil', 'jaoFlowService', 'appletCode'];

    function FlowImportCtrl($scope, messageService, $translate, $uibModalInstance,
                            pageDataUtil, jaoFlowService, appletCode) {
        var that = this;
        that.importFlow = importFlow;

        that.flow = {
            appCode: appletCode,
            file: {}
        };

        that.cancel = function () {
            $uibModalInstance.dismiss();
        };


        function importFlow() {
            jaoFlowService.importFlow(that.flow).then(function (data) {
                $uibModalInstance.close(data);
            }).catch(function (err) {
                throw err;
            });
        }
    }
})();
