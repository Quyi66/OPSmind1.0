/**
 * @Auther: zml
 * @Date: 2018/4/25
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacFindTemplateCtrl', CacFindTemplateCtrl);
    CacFindTemplateCtrl.$inject = [ '$state', '$stateParams', 'cacTemplateService', '$uibModal', 'messageService'];

    function CacFindTemplateCtrl( $state, $stateParams, cacTemplateService, $uibModal, messageService) {
        var vm = this;
        vm.views = {
            back: back,
            templateRuleNames: "",
            templateHostNames: "",
            auditParams: angular.fromJson($stateParams.template.auditParams),
            templateScripts: [],
            template: $stateParams.template
        };

        //返回模板template列表
        function back() {
            $state.go("app.cac.template", {display:true}, {reload:false});
        }


        //根据数组属性，将数组转换为逗号分隔的字符串
        function resolveArrToString(arr, name) {
            var result = "";
            if (arr != null && arr.length > 0) {
                var templateArr = [];
                for (var i in arr) {
                    templateArr.push(arr[i][name]);
                }
                result = templateArr.join(",");
            }

            return result;
        }

        function init(){
            for(var i=0;i<vm.views.auditParams.length;i++){
                vm.views.auditParams[i].templateHostNames = resolveArrToString(vm.views.auditParams[i].hosts,"hostName");
                vm.views.auditParams[i].templateRuleNames = resolveArrToString(vm.views.auditParams[i].ruleExpressions,"ruleName");
                vm.views.auditParams[i].templateScriptNames = resolveArrToString(vm.views.auditParams[i].scripts,"scriptName");
            }
        }

        init();

    }


})
();
