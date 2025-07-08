(function () {
    'use strict';

    angular.module('oplus.acm').component('acmPermission', {
        templateUrl: 'app/modules/acm/acm-permission.html',
        controller: ['$scope', '$element', '$http', 'restUtils', '$state', 'messageService', 'acmService', '$translate', acmPermissionCtrl]
    });

    acmPermissionCtrl.$inject = ['$scope', '$element', '$http', 'restUtils', '$state', 'messageService', 'acmService', '$translate'];

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
     */
    function acmPermissionCtrl($scope, $element, $http, restUtils, $state, messageService, acmService, $translate) {
        var that = this;
        that.appModule = "ACM";
        that.showPermissionRWX=['r','w','x'];

        // $http.get('app/modules/acm/assets/test-permission.json').success(function (result) {
        acmService.getTablePermission().then(function (result) {
            that.moduleData = result;
        });

    }
})();
