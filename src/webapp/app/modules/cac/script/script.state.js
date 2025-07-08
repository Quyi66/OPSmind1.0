/**
 * @Auther: zml
 * @Date: 2018/4/21
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        // if (window.$oplus.appConfig.modules.cac && !window.$oplus.appConfig.modules.cac.useCacV1) {
        if (window.$oplus.appConfig.modules.cac) {
            $stateProvider
                .state('app.cac.script', {
                    url: '/gfs/{dir:any}',
                    views: {
                        'cacList': {
                            templateUrl: 'app/modules/gfs/repo-navi.html',
                            controller: 'GfsRepoNavCtrl',
                            controllerAs: '$ctrl'
                        }
                    },
                    resolve: {
                        repoType: function () {
                            return 'git';
                        }
                    }
                });
        } else {
            $stateProvider
                /***********************************************巡检脚本************************************************/
                .state('app.cac.script', {
                    url: '/script',
                    cache: false,
                    views: {
                        'cacList': {
                            templateUrl: 'app/modules/cac/script/script-list.html',
                            controller: 'CacScriptListCtrl',
                            controllerAs: 'cacScriptListCtrlVm'
                        }
                    }
                }).state('app.cac.scripts_upload', {
                url: '/script/upload',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/script/scripts-upload.html',
                        controller: 'CacScriptsUploadCtrl',
                        controllerAs: 'cacScriptsUploadCtrlVm'
                    }
                }
            });
        }
    }]);
})();
