/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-03-22
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoScriptJobConfig
     */
    angular.module('oplus.jao').component('jaoScriptJobConfig', {
        templateUrl: 'app/modules/jao/script-job-config.html',
        controller: ['$scope', '$state', 'gfsActionHelper', 'messageService', 'dataEx','Param','sscEngineService', ScriptJobConfigCtrl],
        bindings: {
            jobConfig: '=theModel',
            isEditMode: '=editMode',
            options: '<',
            configInterceptor: '<'
        }
    });

    /**
     * Used with component.
     * @param $scope
     * @param $state
     * @param {gfsActionHelper} gfsActionHelper
     * @param {messageService} messageService
     * @param {dataEx} dataEx
     */
    function ScriptJobConfigCtrl($scope, $state, gfsActionHelper, messageService, dataEx,Param, sscEngineService) {
        var that = this;
        this.fileSelectorConfig = {
            repoType: 'git',
            viewMode: 'dialog',
            multipleSelect: true,
            showFileConfig: true
        };

        $scope.mcheckType = "map";
        if (!that.jobConfig.tasks || that.jobConfig.tasks.length === 0) {
            addTask();
        }
        // aap execution environment
        {
            Param.getByDomainAndName('jao', 'script_engine').then(function (result) {
                var value = result && result.value;
                that.scriptEngine = value;
                if (value === 'aap') {
                    return sscEngineService.queryExecution_environments().then(function (response) {
                        console.log("========== app execution_environment ==========");
                        that.executionEnvironments = angular.fromJson(response).results;
                    });
                }
                that.executionEnvironments = [];
            });
        }


        this.addScript = addScript;
        this.removeScript = removeScript;
        this.addTask = addTask;
        this.removeTask = removeTask;
        this.onSelectScript = onSelectScript;
        this.configInterceptor = this.configInterceptor || {};
        this.configInterceptor.parseParams = function (jobConfig) {
            var paramList = [];
            jobConfig.tasks.forEach(function (task) {
                if (jobConfig.scriptType === 'template') {
                    paramList = paramList.concat(dataEx.extractVars(JSON.stringify(_.map(Object.keys(jsyaml.load(task.template.extra_vars)), function(m) { return '${' + m + '}'; }))));
                }
                else {
                    task.scripts.forEach(function (script) {
                        paramList = paramList.concat(dataEx.extractVars(script.argline));
                    });
                    if (task.hostsMode === "param") {
                        paramList.push(task.hostsParam);
                    }
                }
            });
            return paramList;
        }

        function removeTask(index) {
            if (that.jobConfig.tasks.length > 1) {
                that.jobConfig.tasks.splice(index, 1);
            }
        }

        function addTask() {
            var defaultTask = {
                scripts: [],
                hosts: [],
                hostsMode: 'param'
            };
            if (!that.jobConfig.tasks || that.jobConfig.tasks.length === 0) {
                that.jobConfig.tasks = [defaultTask];
            } else {
                that.jobConfig.tasks.push(defaultTask);
            }
        }

        function onSelectScript(file, task) {
            task.scripts = task.scripts || [];
            task.scripts.push({location: file.path, argline: file.config});
        }

        function addScript(task) {
            task.scripts = task.scripts || [];
            var config = {
                multipleSelect: false,
                onConfirm: function (file) {
                    task.scripts.push({location: file.path, argline: file.config});
                }
            };
            gfsActionHelper.openFileSelector($scope, config);
        }

        function removeScript(task, index) {
            task.scripts.splice(index, 1);
        }
    }
})();
