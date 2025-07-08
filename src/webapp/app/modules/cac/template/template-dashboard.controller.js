(function () {
    var cacModule = angular.module('oplus.cac');

    cacModule.controller('CacDashboardTemplateCtrl', CacDashboardTemplateCtrl);
    CacDashboardTemplateCtrl.$inject = ['$scope', '$timeout', '$state', '$stateParams'];

    function CacDashboardTemplateCtrl($scope, $timeout, $state, $stateParams) {
        var vm = this;
        vm.params = {
            template_id: $stateParams.templateId,
            template_name: $stateParams.templateName
        }

    }

})
();
