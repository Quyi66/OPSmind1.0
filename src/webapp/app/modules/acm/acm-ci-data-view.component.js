/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/30, created
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name acmCiDataView
     * @description
     * ```html
     * <acm-ci-data-view cit-code="">
     * ```
     */
    angular.module('oplus.acm').component('acmCiDataView', {
        bindings: {
            ciId: '=ciId',
            editMode: '<'
        },
        templateUrl: 'app/modules/acm/acm-ci-data-view.html',
        controller: ['$scope', '$element', '$http', 'restUtils', '$state', 'messageService', 'acmService', '$translate', '$uibModalStack', acmCiViewCtrl]
    });

    acmCiViewCtrl.$inject = ['$scope', '$element', '$http', 'restUtils', '$state', 'messageService', 'acmService', '$translate'];

    /**
     *
     * @param $scope
     * @param $element
     * @param $http
     * @param restUtils
     * @param $state
     * @param messageService
     * @param acmService
     * @param $translate
     * @param $uibModalStack
     */
    function acmCiViewCtrl($scope, $element, $http, restUtils, $state, messageService, acmService, $translate, $uibModalStack) {
        var that = this;
        this.save = save;
        that.theData = acmService.getAcmCIByCId(this.ciId);
        acmService.getAcmCITByCId(this.ciId).then(function (result) {
            that.theModel = result;
        });


        function save(data) {
            acmService.saveAcmData(JSON.stringify(data)).then(function (result) {
                var top = $uibModalStack.getTop();
                if (top) {
                    $uibModalStack.dismiss(top.key);
                }
                messageService.toast("success", $translate.instant('common.messages.operation.success'));
                $state.reload();
            }).catch(function (err) {
                messageService.toast("error", $translate.instant('common.messages.operation.failed'), err.message);
            });
        }
    }
})();
