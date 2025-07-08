/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017
 */
(function () {
    'use strict';
    angular.module('oplus.dts').controller('DatasourceEditCtrl', DatasourceEditCtrl);

    DatasourceEditCtrl.$inject = ['$scope', '$compile', '$timeout', '$state', '$stateParams', 'messageService', 'datasourceService', '$templateRequest', 'restUtils', '$translate'];

    /**
     *
     * @param $scope
     * @param $compile
     * @param $timeout
     * @param $state
     * @param $stateParams
     * @param messageService {messageService}
     * @param datasourceService {datasourceService}
     * @param $templateRequest0
     * @param restUtils {restUtils}
     * @constructor
     */
    function DatasourceEditCtrl($scope, $compile, $timeout, $state, $stateParams, messageService, datasourceService, $templateRequest, restUtils, $translate) {
        var id = $stateParams['id'];
        var datasourceType = $stateParams['type'];
        $scope.editing = false;
        var oldPass = "";
        // $scope.selected = {className:"com.ibm.db2.jcc.DB2Driver"};
        $scope.selected = {};

        $scope.saveDatasource = saveDatasource;
        $scope.testConnectivity = testConnectivity;
        $scope.cancel = cancel;

        var dsTypeHandler = {
            initProps: function () {

                if ($scope.datasource.type === 'jdbc') {


                    $scope.jdbcDrivers = datasourceService.getJdbcDrivers();
                    // $scope.datasource.config = $scope.datasource.config || {};

                    if ($scope.datasource.config) {
                        var driver = _.find($scope.jdbcDrivers, {className: $scope.datasource.config.driver});
                        if (driver) {
                            $scope.selected.className = angular.copy($scope.datasource.config.driver);
                        } else {
                            $scope.selected.className = "other";
                        }
                    } else {
                        $scope.datasource.config = {
                            driver: angular.copy($scope.selected.className)
                        }
                    }

                    $scope.changeJdbcDriver = function () {
                        $scope.datasource.config.driver = angular.copy($scope.selected.className);
                        var className = $scope.datasource.config.driver;
                        var driver = _.find($scope.jdbcDrivers, {className: className});
                        $scope.selectedDriver = driver;
                        $scope.datasource.config.validationQuery = $scope.selectedDriver.validationQuery;
                        if (!id) {
                            $scope.datasource.config.url = $scope.selectedDriver.urlTemplate;
                        }
                    }

                    oldPass = $scope.datasource.config.password;

                } else if ($scope.datasource.type === 'es') {
                    $scope.datasource.config = $scope.datasource.config || {query: '{"query":{"match_all":{}}}'};
                }

            },
            beforeSave: function () {
                if ($scope.datasource.type === 'jdbc') {
                    if (oldPass == $scope.datasource.config.password) {
                        delete $scope.datasource.config.password;
                    }
                }
            }
        };
        loadDatasource();

        function loadDatasource() {
            if (!id) {
                $scope.datasource = {type: datasourceType};
                dsTypeHandler.initProps();
            } else {
                $scope.editing = true;
                datasourceService.findDatasource(id).then(function (datasource) {
                    $scope.datasource = datasource;

                    dsTypeHandler.initProps();
                }).catch(function (err) {
                    throw err;
                });
            }
        }

        function saveDatasource() {

            dsTypeHandler.beforeSave();

            datasourceService.saveDatasource($scope.datasource).then(function (obj) {
                $scope.editing = true;
                $scope.datasource = obj;
                // oldPass = $scope.datasource.config.password;

                dsTypeHandler.initProps();
                messageService.toast('success', 'Saved');
                /*$state.go('app.dts_datasource_list');*/
            }).catch(function (err) {
                throw err;
            });

        }

        /**
         * 测试链接
         */
        function testConnectivity() {

            if (!$scope.datasource.id) {
                messageService.toast('info', $translate.instant('dts.datasource.please_save_dataset'));
                return;
            }


            datasourceService.testConnectivity($scope.datasource).then(function (data) {


                messageService.alertSuccess($translate.instant('dts.datasource.success'), $translate.instant('dts.datasource.test_success'));
                $scope.datasourceResponseData = data;


            }).catch(function (err) {
                messageService.alertError($translate.instant('dts.datasource.fail'), err.message);
            });

        }

        function cancel() {
            history.go(-1);
        }

        /**
         * the check of jdbc name
         * @type {RegExp}
         */
        var regex = /^[a-zA-Z0-9_]{1,}$/;
        $scope.$watch('datasource.name', function (name, oldName) {
            if (!id && $scope.datasource.type == "jdbc") {
                if (name) {
                    if (!regex.test(name)) {
                        $scope.datasource.name = oldName;
                    }
                }

            }

        })

    }
})();
