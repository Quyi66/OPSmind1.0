/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/5/20, created
 */
(function () {
    'use strict';
    angular.module('oplus.adm').component('sysinfo', {
        templateUrl: 'app/modules/adm/sysinfo.html',
        controller: ['$http','licenseService','messageService', SysinfoCtrl],
        bindings: {
            hideLogo: '<'
        }
    });

    /**
     * @ngdoc component
     * @name sysinfo
     * @description
     * Display system information like version of modules.
     * ```html
     * <sysinfo/>
     * ```
     * @param {$http} $http
     */
    function SysinfoCtrl($http,licenseService,messageService) {
        var that = this;
        that.hideLogo = that.hideLogo || false;
        that.msg = "";
        that.isEnableLicense = false;
        that.register = register;

        that.ngf = {
            pattern: '', maxSize: '1MB'
        };

        that.fileInfo = {};


        this.$onInit = function () {
            initLicense();
            fetchVersion();
        }

        function fetchVersion() {

            fetchViewVersion();

            fetchServerVersion();

            function fetchViewVersion() {
                $http.get('app/modules/VERSION.json').then(function (res) {
                    var version = res.data;
                    var versions = version.versions;
                    var builds = version.builds;
                    var result = [];
                    Object.keys(versions).forEach(function (module) {
                        result.push({module: module, version: versions[module], build: builds[module]});
                    });
                    that.viewVersions = _.sortBy(result, ['module']);
                });
            }

            function fetchServerVersion() {
                var result = [];
                $http.get(window.$oplus.appConfig.apiBaseUrls.com + '/api/com/oplus/version').then(
                    function (res) {
                        pushServerVersions(result, res.data);
                        $http.get(window.$oplus.appConfig.apiBaseUrls.dts + '/api/dts/oplus/version').then(
                            function (res) {
                                pushServerVersions(result, res.data);
                                $http.get(window.$oplus.appConfig.apiBaseUrls.portal + '/api/portal/oplus/version').then(
                                    function (res) {
                                        pushServerVersions(result, res.data);
                                        that.serverVersions = result;
                                       // console.log("serverVersions", that.serverVersions);
                                    }
                                );
                            }
                        );
                    }
                );
            }

            function pushServerVersions(result, versions) {
                angular.forEach(versions, function (module) {
                    if (module.projectName && !_.find(result, {projectName: module.projectName})) {
                        result.push(module);
                    }
                });
            }

        }


        function initLicense() {
            licenseService.isEnabled().then(function (data){
                that.isEnableLicense = data;
                if(that.isEnableLicense) {
                    licenseService.license().then(function (data){
                        that.license = data;
                    },function (error){

                    });
                }
            })
        }

        function register() {
            licenseService.register(that.fileInfo.file).then(function (data) {
                messageService.toast("success", "激活码已更新！");
                that.msg = "";
                initLicense();
            },function (error) {
                that.msg = error.title;
            });
        }


    }
})();
