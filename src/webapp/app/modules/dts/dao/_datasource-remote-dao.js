/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @description
     * @private
     */
    angular.module('oplus.dts').service('_datasourceRemoteDao', datasourceRemoteDao);

    datasourceRemoteDao.$inject = ['restUtils','currentUser'];

    /**
     * DAO for remote database
     * @param restUtils {restUtils}
     */
    function datasourceRemoteDao(restUtils,currentUser) {

        var module = "dts";
        
        this.findAllDatasources = function () {
            return restUtils.callApi(module,'GET', '/api/dts/datasources');
        };


         this.findDatasource = function (id) {
             return restUtils.callApi(module,'GET', '/api/dts/datasources/{id}', {id: id});
         };


         this.saveDatasource = function (datasource) {
             if(!datasource.id) {
                 datasource.createdBy = currentUser.loginId;
                 datasource.creatorName = currentUser.displayName;
                 datasource.modifiedBy = currentUser.loginId;
                 datasource.modifierName = currentUser.displayName;
                 return restUtils.callApi(module,'POST', '/api/dts/datasources', null, datasource);
             }else{
                 datasource.modifiedBy = currentUser.loginId;
                 datasource.modifierName = currentUser.displayName;
                 return restUtils.callApi(module,'PUT', '/api/dts/datasources', null, datasource);
             }

         };


         this.deleteDatasource = function (id) {
             return restUtils.callApi(module,'DELETE', '/api/dts/datasources/{id}', {id: id} );
         };


    }
})();
