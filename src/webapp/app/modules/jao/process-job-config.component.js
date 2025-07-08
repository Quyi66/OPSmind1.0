/**
 * @author Leo Liao (leoliaolei@gmail.com), 2021/05/26, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoProcessJobConfig
     */
    angular.module('oplus.jao').component('jaoProcessJobConfig', {
        templateUrl: 'app/modules/jao/process-job-config.html',
        controller: ['$scope', '$state', 'dataEx', jaoProcessJobConfigCtrl],
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
     * @param {dataEx} dataEx
     */
    function jaoProcessJobConfigCtrl($scope, $state, dataEx) {
        var that = this;
        //https://stackoverflow.com/questions/43072304/how-to-triger-function-in-child-component-from-parent-component-in-angularjs
        this.registerDesigner = function (designer) {
            this.designer = designer;
        }
        this.jobConfig.processModel = this.jobConfig.processModel || {};
        this.configInterceptor = this.configInterceptor || {};
        this.configInterceptor.onPresave = function (jobConfig) {
            var result = that.designer.validateModel();
            jobConfig.playbook = result.playbook;
            jobConfig.inventory = result.inventory;
        };
        this.configInterceptor.parseParams = function (jobConfig) {
            var s = JSON.stringify(jobConfig.processModel);
            return dataEx.extractVars(s);
        }
    }
})();
