/**
 *
 * 点击指令，在新标签打开帮助文档
 *
 * 跟据浏览器url识别当前所处功能模块，假如此模块存在帮助文档，则跳转模块帮助文档，否则打开当前租户的默认帮助文档
 *
 * @author Joker Liu (qdjoker@126.com), created on 8/6/2020
 */
(function () {
    'use strict';
    angular.module('oplus.commons').directive('opHelpDoc', ['$http', opHelpDoc]);

    function opHelpDoc($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                if (!window.$oplus.appConfig.ui.enableHelpDoc) {
                    $(element).addClass('hidden');
                    return;
                }

                $(element).on('click', function () {
                    var helpPath = window.$oplus.appConfig.ui.help;
                    var helpHash = getHelpDocHash();
                    //console.log('hash', window.location.hash);

                    // console.log('helpHash', helpHash);
                    if (helpHash) {
                        //   help/#/udp/index
                        //   help/#/admin/tenant/index
                        window.open(helpPath.split('#/')[0] + helpHash);
                    } else {
                        //console.log('Open default');
                        window.open(helpPath);
                    }
                });

                /**
                 * http://localhost/oplus-admin/#/
                 * http://localhost/oplus-admin/#/dts
                 * http://localhost/oplus-admin/#/admin/tenant
                 *
                 * 跟据浏览器url获取帮助文档内部导航路径(hash路径)
                 */
                function getHelpDocHash() {
                    //has of home page is '/'
                    var hashArr = window.location.hash.split('/');

                    if (hashArr.length > 1 && hashArr[1]) {
                        var module = hashArr[1];
                        //系统管理功能为两级目录：/admin/user、/admin/data-permission
                        var secondPart = '';
                        if ('admin' === module) {
                            secondPart += ('/' + hashArr[2]);
                        }

                        return '#/' + module + secondPart + '/overview'
                    } else {
                        return '';
                    }
                }
            }
        }
    }
})();
