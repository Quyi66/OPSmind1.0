/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/31/2017
 */
(function () {
    'use strict';

    angular.module('oplus.dts').service('datasourceService', datasourceService);


    datasourceService.$inject = ['datasourceDao', 'restUtils', '$translate'];

    /**
     * Service for datasource
     * @param datasourceDao {localDaoFactory}
     * @param $q
     * @param restUtils {restUtils}
     */
    function datasourceService(datasourceDao, restUtils, $translate) {

        this.getJdbcDrivers = getJdbcDrivers;
        this.findAllDatasources = datasourceDao.findAllDatasources;
        this.findDatasource = datasourceDao.findDatasource;
        this.saveDatasource = datasourceDao.saveDatasource;
        this.deleteDatasource = datasourceDao.deleteDatasource;
        this.testConnectivity = testConnectivity;
        this.doQuery = doQuery;

        /**
         *
         * @returns {[{className:string, urlTemplate:string}]} JDBC drivers
         */
        function getJdbcDrivers() {
            return [
                {
                    dbName: "MySQL 5.x, MariaDB",
                    className: "com.mysql.jdbc.Driver",
                    urlTemplate: "jdbc:mysql://<server>:<port>/<databaseName>",
                    validationQuery: "SELECT 1 from dual"
                },
                {
                    dbName: "Oracle 11g",
                    className: "oracle.jdbc.driver.OracleDriver",
                    urlTemplate: "jdbc:oracle:thin:@<server>:<port>:<sid_name>",
                    validationQuery: "SELECT 1 from dual"
                },
                {
                    dbName: "Microsoft SQL Server",
                    className: "com.microsoft.sqlserver.jdbc.SQLServerDriver",
                    urlTemplate: "jdbc:sqlserver://<server>:<port>;DatabaseName=<databaseName>",
                    validationQuery: "SELECT 'x'"
                },
                {
                    dbName: "IBM DB2",
                    className: "com.ibm.db2.jcc.DB2Driver",
                    urlTemplate: "jdbc:db2://<server>:<port>/<databaseName>",
                    validationQuery: "SELECT 1 FROM sysibm.sysdummy1"
                },
                {
                    dbName: "Voltdb",
                    className: "org.voltdb.jdbc.Driver",
                    urlTemplate: "jdbc:voltdb://<server>:<port>",
                    validationQuery: "SELECT 1"
                },
                {
                    dbName: "Apache Hive",
                    className: "org.apache.hive.jdbc.HiveDriver",
                    urlTemplate: "jdbc:hive2://<server>:<port>/<databaseName>",
                    validationQuery: "SELECT 1"
                },
                {
                    dbName: "Gauss",
                    className: "com.huawei.gauss.jdbc.ZenithDriver",
                    urlTemplate: "jdbc:zenith:@<server>:<port>",
                    validationQuery: "SELECT 1 from dual"
                }
                // {
                //     dbName: $translate.instant('dts.datasource.other'),
                //     className: "other",
                //     urlTemplate: $translate.instant('dts.datasource.fill_corresponding') + "jdbc" + $translate.instant('dts.datasource.connect'),
                //     validationQuery: "SELECT 1"
                // }
            ];
        }

        /**
         * Execute query on a datasource.
         * API:
         * `POST /api/dts/q/data/{datasetId}`
         * @param datasetId {string} ID of dataset
         * @param params
         * @returns {*|promise}
         */
        function doQuery(datasetId, params) {
            return restUtils.callApi('dts', 'post', '/api/dts/q/data/{datasetId}', {datasetId: datasetId}, {params: params})
        }

        /**
         * Test datasource connectivity
         * Call API
         * `POST /api/dts/datasources/test` or
         * `GET /api/dts/datasources/test/{id}`
         * @param datasource {string|object} Datasource ID or object.
         * @returns {promise}
         */
        function testConnectivity(datasource) {
            if (!datasource) {
                throw new Error('Empty argument `datasource`');
            }
            if (angular.isString(datasource)) {
                return restUtils.callApi('dts', 'GET', '/api/dts/datasources/test/{id}', {id: datasource}, null);
            } else {
                return restUtils.callApi('dts', 'POST', '/api/dts/datasources/test', null, datasource);
            }
        }
    }
})();
