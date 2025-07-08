/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('sscEngineService', sscEngineService);

    sscEngineService.$inject = ['$q', 'restUtils'];

    function sscEngineService($q, restUtils) {
        var module = "jao";

        this.queryProjects = queryProjects;
        this.queryProjectDetails = queryProjectDetails;
        this.queryOrganizations = queryOrganizations;
        this.queryCredentials = queryCredentials;
        this.queryInstance_groups = queryInstance_groups;
        this.queryExecution_environments = queryExecution_environments;
        this.queryProjectBaseDir = queryProjectBaseDir

        function queryProjects() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/projects');
        }

        function queryProjectDetails(id) {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/projects/{id}/details', {id: id});
        }

        function queryOrganizations() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/organizations');
        }

        function queryCredentials() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/credentials');
        }

        function queryInstance_groups() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/instance_group');
        }

        function queryExecution_environments() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/execution_environments');
        }

        function queryProjectBaseDir() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/project_base_dir');
        }

    }

})();

