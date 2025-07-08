/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacInspectionService', CacInspectionService);

    CacInspectionService.$inject = ['restUtils','$q','$http'];

    function CacInspectionService(restUtils,$q,$http) {
        var MODULE = "cac";

        this.getAllInspection =getAllInspection;
        this.getInspectionById =getInspectionById;
        this.saveORUpdateInspection =saveORUpdateInspection;
        this.deleteInspection=deleteInspection;
        this.uniqueValidation =uniqueValidation;

        function getAllInspection() {
            return restUtils.callApi(MODULE, 'GET','/api/cac/v3/get-inspection', null);
        }

        function getInspectionById(id) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/get-inspection/{id}', {id: id})
        }

        function saveORUpdateInspection(inspection,id) {
            if(null == id || "" == id){
                return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/get-inspection', null, inspection);
            }else{
                return restUtils.callApi(MODULE, 'PUT', '/api/cac/v3/get-inspection', null, inspection);
            }
        }

        function deleteInspection(id) {
            return restUtils.callApi(MODULE, 'DELETE', '/api/cac/v3/get-inspection/{id}',{id: id});
        }

        function uniqueValidation(inspection){
            return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/get-inspection/unique-validation', null, inspection);
        }

        /*var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/results/export/' + jobId;//请求的URl
        function test(inspection){
            var deferred = $q.defer();
            $http.post("api/cac/v3/get-inspection/unique-validation", pageDefine)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };*/

    }

})();