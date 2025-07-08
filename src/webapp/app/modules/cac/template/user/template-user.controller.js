
/**
 * @Auther: zml
 * @Date: 2018/5/23
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //template模块普通用户 控制器
    cacModule.controller('CacTemplateUserCtrl', CacTemplateUserCtrl);
    CacTemplateUserCtrl.$inject = ['cacTemplateUserService', '$rootScope', '$scope', '$interval', '$timeout', '$state', '$stateParams', '$uibModal'];

    function CacTemplateUserCtrl(cacTemplateUserService, $rootScope, $scope, $interval, $timeout, $state, $stateParams, $uibModal) {
        var vm = this;

        vm.views = {
            getTemplates: getTemplates,
            templateList: [],
            auditParams: []
        }

        function getTemplates() {
            cacTemplateUserService.getTemplates().then(function (data) {
                vm.views.templateList = data;
                for (var i = 0; i < vm.views.templateList.length; i++) {
                    vm.views.templateList[i].auditParams = angular.fromJson(vm.views.templateList[i].auditParams);
                }

            }).catch(function (err) {
                throw err;
            });
        }

        function init() {
            vm.views.getTemplates();
        }

        init();
    }

    cacModule.controller('CacTemplateUserListCtrl', CacTemplateUserListCtrl);
    CacTemplateUserListCtrl.$inject = ['cacTemplateUserService', '$scope', '$interval', '$timeout', '$state', '$stateParams', '$uibModal'];

    function CacTemplateUserListCtrl(cacTemplateUserService, $scope, $interval, $timeout, $state, $stateParams, $uibModal) {
        var vm = this;


    }
})();
