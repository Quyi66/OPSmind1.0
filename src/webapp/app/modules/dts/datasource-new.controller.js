/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 11/8/2017
 */
(function () {
    'use strict';
    angular.module('oplus.dts').controller('DatasourceNewCtrl', DatasourceNewCtrl);
    DatasourceNewCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$translate'];

    function DatasourceNewCtrl($scope, $rootScope, $state, $stateParams, $translate) {
        var ctrl = this;
        ctrl.dsTypeList = [
            {type: 'jdbc', label: 'JDBC' + $translate.instant('dts.list.database'), icon: 'fa-database'},
            {type: 'join', label: $translate.instant('dts.list.multiple_datasets'), icon: 'fa-random'},
            // {type: 'es', label: 'ElasticSearch'},
            // {type: 'file', label: $translate.instant('dts.list.document')},
            // {type: 'mongo', label: 'MongoDB'},
            // {type: 'hbase', label: 'HBase'},
            {type: 'rest', label: 'REST API', icon: 'fa-cloud-download'}
            // {type: 'orientdb', label: 'orientdb'}
        ];
        ctrl.gotoState = gotoState;
        ctrl.dsTypes = [];
        initDsTypes();

        function initDsTypes() {
            angular.forEach(ctrl.dsTypeList, function (obj) {
                // if ($rootScope.dts.sourceTypes.indexOf(obj.type) != -1) {
                //     ctrl.dsTypes.push(obj);
                // }
            })
        }

        // type  标识进入当前页面的类型 方便跳转到不同 state 的 view 为空则做默认跳转
        // --  ssc  整合配置项后 小应用窗口化跳转 (app.ssc)
        ctrl.type = $stateParams['type'];
        ctrl.breadcrumbState = 'app.dts';
        ctrl.createState = 'app.dts_datasource_new.type';

        if (ctrl.type && ctrl.type === 'ssc') {
            ctrl.breadcrumbState = 'app.ssc.datasource';
            ctrl.createState = 'app.ssc.datasource_create.type';
        }

        function gotoState(state, params) {
            $state.go(state, params);
        }

    }
})();
