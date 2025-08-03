(function () {
    angular.module('oplus.cac').controller('CacEmailV2RecipientTestController', CacEmailV2RecipientTestController);

    CacEmailV2RecipientTestController.$inject = ['$scope', '$state'];

    function CacEmailV2RecipientTestController($scope, $state) {
        var vm = this;
        
        vm.testManage = function(templateId) {
            $state.go('app.cac.emailv2.recipient-manage', {templateId: templateId});
        };
    }
})();