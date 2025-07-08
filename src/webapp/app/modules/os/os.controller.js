/**
 * @author  yangbin@famaessoft.com
 * created by  2022/08/17
 */
(function () {
    var osModule = angular.module('oplus.os');

    //任务管理主控制器
    osModule.controller('osCtrl', OSCtrl);
    OSCtrl.$inject = ['$state', '$element', '$timeout', '$location'];

    function OSCtrl($state, $element, $timeout, $location) {
        var vm = this;
        var pathUrl = $location.path();
        if ((pathUrl.length-pathUrl.indexOf("os")) <= 4) {
            $state.go("app.os.list");
        }
    }
})();
