/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    'use strict';
    var app = angular.module('oplus.cac');

    app.service('_cacLocalDao', cacLocalDao);

    cacLocalDao.$inject = ['$q', '$http', 'localDaoFactory'];

    /**
     * DAO for local database (localStorage)
     * @param $q
     * @param localDaoFactory
     */
    function cacLocalDao($q, $http, localDaoFactory) {
        var STORAGE_KEY = 'oplus.cac';
        var STORAGE_KEY_RULE = 'oplus.cac.rule';

        var dao = localDaoFactory.createDao(STORAGE_KEY);
        var ruleDao = localDaoFactory.createDao(STORAGE_KEY_RULE);

        var that = this;

        /*rule巡检规则增删改查*/
        this.findAllRules = findAllRules;
        this.deleteRule = deleteRule;
        this.updateRule = updateRule;
        this.addRule = addRule;

        /*template巡检模板增删改查*/
        this.findAllTemplates = findAllTemplates;
        this.deleteTemplate = deleteTemplate;
        this.updateTemplate = updateTemplate;
        this.addTemplate = addTemplate;

        /*job巡检任务增删改查*/
        this.findAllJobs = findAllJobs;
        this.deleteJob = deleteJob;
        this.updateJob = updateJob;
        this.addJob = addJob;
        this.run = run;


        /*script巡检脚本*/
        this.uploadFile = uploadFile;
        this.addScript = addScript;
        this.deleteScript = deleteScript;

        function findAllRules() {
            //声明承诺
            var deferred = $q.defer();
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/rule_lists.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });

            return deferred.promise;   // 返回承诺

        }

        function deleteRule(id) {
            var deferred = $q.defer();//声明承诺
            deferred.resolve(null);//请求成功
            return deferred.promise;   // 返回承诺

        }

        function updateRule(rule) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }

        function addRule(rule) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }


        function findAllTemplates() {
            //声明承诺
            var deferred = $q.defer();
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/template_lists.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });

            return deferred.promise;   // 返回承诺

        }

        function deleteTemplate(id) {
            var deferred = $q.defer();//声明承诺
            deferred.resolve(null);//请求成功
            return deferred.promise;   // 返回承诺

        }

        function updateTemplate(template) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }

        function addTemplate(template) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }


        function findAllJobs() {
            //声明承诺
            var deferred = $q.defer();
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/template_lists.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });

            return deferred.promise;   // 返回承诺

        }

        function deleteJob(id) {
            var deferred = $q.defer();//声明承诺
            deferred.resolve(null);//请求成功
            return deferred.promise;   // 返回承诺

        }

        function updateJob(job) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }

        function addJob(job) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }


        function run(job) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }

        function uploadFile(form){
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺
        }

        function addScript(script){
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺
        }

        function deleteScript(script){
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺
        }


    }
})();
