/**
 * @Auther: zml
 * @Date: 2018/6/1
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //多文件上传模型控制器
    cacModule.controller('CacScriptsUploadCtrl', CacScriptsUploadCtrl);
    CacScriptsUploadCtrl.$inject = ['$scope', '$timeout', 'cacService', 'cacScriptService', '$compile', '$uibModal', 'messageService'];

    function CacScriptsUploadCtrl($scope, $timeout, cacService, cacScriptService, $compile, $uibModal, messageService) {
        var vm = this;
        vm.views = {
            scriptsList: []
        }

    }


})
();
