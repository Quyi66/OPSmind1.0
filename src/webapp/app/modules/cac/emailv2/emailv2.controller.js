(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacEmailV2Controller', CacEmailV2Controller);
    CacEmailV2Controller.$inject = ['$scope','$state','messageService','$http','$stateParams'];

    function CacEmailV2Controller($scope, $state,messageService, $http, $stateParams) {
    }
})();