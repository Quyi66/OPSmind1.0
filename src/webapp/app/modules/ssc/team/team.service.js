(function () {
    'use strict';

    angular.module('oplus.ssc').service('Team', Team);


    Team.$inject = ['TeamDao', '$q', '$http'];


    function Team(TeamDao, $q, $http) {

        this.findTeamById = TeamDao.findTeamById;
        this.findTeams = TeamDao.findTeams;
        this.deleteTeamById = TeamDao.deleteTeamById;

        this.getAllUsersBasicInfo = function (tenantId) {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users/basic" + (tenantId === undefined ? "" : ("?tenantId=" + tenantId)))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        this.saveTeam = TeamDao.saveTeam;
    }

})();

