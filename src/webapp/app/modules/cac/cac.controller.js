
/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //任务管理主控制器
    cacModule.controller('cacCtrl', CacCtrl);
    cacModule.controller('cac3Ctrl', CacCtrl);
    CacCtrl.$inject = ['$state', '$element', '$timeout', '$location','Param'];


    function CacCtrl($state, $element, $timeout, $location,Param) {
        var vm = this;
        vm.views = {
            chosed: "",
            emailMenuEnabled:"",
        };

        //巡检邮件配置菜单-开关
        Param.getByDomainAndName('cac', 'cac_mailbox_info').then(function (result) {
            let jsonObject = JSON.parse(result.value);
            vm.views.emailMenuEnabled = jsonObject.emailMenuEnabled;
        }).catch(function (err) {
            throw err;
        });

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
