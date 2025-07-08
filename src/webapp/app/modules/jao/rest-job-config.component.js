/**
 * @author Chen rongji, created on 2020-03-25
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoRestJobConfig
     */
    angular.module('oplus.jao').component('jaoRestJobConfig', {
        templateUrl: 'app/modules/jao/rest-job-config.html',
        controller: ['dataEx', RestJobConfigCtrl],
        bindings: {
            jobConfig: '=theModel',
            isEditMode: '=editMode',
            options: '<',
            configInterceptor: '<'
        }
    });

    /**
     * Used with component.
     * @param {dataEx} dataEx
     */
    function RestJobConfigCtrl(dataEx) {
        this.configInterceptor = this.configInterceptor || {};
        this.configInterceptor.parseParams = function (jobConfig) {
            return dataEx.extractVars(jobConfig.curl);
        }
    }
})();
