
/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //任务管理主控制器
    cacModule.controller('cacCtrl', CacCtrl);
    cacModule.controller('cac3Ctrl', CacCtrl);
    CacCtrl.$inject = ['$state', '$element', '$timeout', '$location'];


    function CacCtrl($state, $element, $timeout, $location) {
        var vm = this;
        vm.views = {
            chosed: "",
            emailMenuEnabled: "yes", // 默认启用邮件配置菜单，与现场版本保持一致
        };

        var pathUrl = $location.path();

        if (pathUrl.indexOf('job') > -1 || pathUrl.indexOf('result') > -1) {
            vm.views.chosed = 'history';
        }

        if (pathUrl.indexOf('check-list') > -1 || pathUrl.indexOf('check-result') > -1) {
            vm.views.chosed = 'check_log';
        }

        if ($state.current.name === 'app.cac') {
            $state.go("app.cac.template.square");
        }
        if ($state.current.name === 'app.cac3') {
            $state.go("app.cac3.templates.list");
        }
        // $timeout(function () {
        //     document.getElementsByClassName("ui-resizable")[0].style.width = "128px";
        //     document.getElementsByClassName("cacIndexPageWrapper")[2].style = "left:128px"
        // },100)
    }
})();
