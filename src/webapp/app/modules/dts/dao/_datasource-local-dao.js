/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    /**
     * @private
     */
    angular.module('oplus.dts').service('_datasourceLocalDao', datasourceLocalDao);

    datasourceLocalDao.$inject = [ 'localDaoFactory'];

    function datasourceLocalDao(localDaoFactory) {

        var dao = localDaoFactory.createDao('oplus.dts.datasources');

        this.findAllDatasources = dao.findAllEntities;
        this.findDatasource = dao.findEntity;
        this.saveDatasource = dao.saveEntity;
        this.deleteDatasource = dao.deleteEntity;


    }


})();
