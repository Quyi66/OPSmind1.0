/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/28/2017
 */
(function () {
    /**
     * @ngdoc component
     * @description
     * ```
     * <uinput-setting-basic props="" options={disableName:boolean,disableBinding:boolean}>
     * ```
     * @param {object} props Two-way binding
     */
    angular.module('oplus.udp').component('uinputSettingBasic', {
        bindings: {
            props: '=',
            options: '<'
        },
        templateUrl: 'app/modules/udp/widgets/uinput-setting-basic.html',
        controller: ['$scope', 'restUtils', 'messageService', UinputSettingBasic]
    });
    /**
     * @param $scope
     * @param {restUtils} restUtils
     * @param {messageService} messageService
     */
    function UinputSettingBasic($scope, restUtils, messageService) {
    }
})();