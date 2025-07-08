/**
 * @author yangbin@famessoft.com, created on 2020/09/10
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('TeamDao', TeamDao);

    TeamDao.$inject = ['$http', 'restUtils'];

    /**
     * DAO for remote database
     * @param $http
     * @param restUtils {restUtils}
     */
    function TeamDao($http, restUtils) {

        var module = "portal";
        
        this.findTeamById = findTeamById;
        this.findTeams = findTeams;
        this.deleteTeamById = deleteTeamById;
        this.saveTeam = saveTeam;

        function findTeamById(id) {
            return restUtils.callApi(module, 'GET', '/api/team/{id}', {id: id});
        }

        function findTeams() {
            return restUtils.callApi(module, 'GET', '/api/team');
        }

        function deleteTeamById(id) {
            return restUtils.callApi(module, 'DELETE', '/api/team/{id}', {id: id});
        }

        function saveTeam(team) {
            return restUtils.callApi(module,'POST', '/api/team', null, team);

        }


    }
})();
