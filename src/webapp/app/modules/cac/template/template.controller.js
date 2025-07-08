/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');


    //模型控制器
    cacModule.controller('CacTemplateIndexCtrl', CacTemplateIndexCtrl);
    CacTemplateIndexCtrl.$inject = ['$scope', '$timeout', '$state', 'cacService', 'cacTemplateService', '$compile', 'messageService', '$filter', '$http', '$stateParams'];

    function CacTemplateIndexCtrl($scope, $timeout, $state, cacService, cacTemplateService, $compile, messageService, $filter, $http, $stateParams) {
        //var vm = this;
        /*if ($stateParams.display) {
            $state.go("app.cac.template.list");
        } else {
            $state.go("app.cac.template.square");
        }*/
    }
})
();
