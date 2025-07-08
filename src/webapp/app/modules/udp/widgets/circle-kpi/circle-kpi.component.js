/**
 *
 * @author yangbin 2023/05/15
 */
(function () {
    'use strict';


    angular.module('oplus.udp').component('circleKpi', {
        bindings: {
            theModel: '=theModel',
            _options: '<options'
        },
        templateUrl: 'app/modules/udp/widgets/circle-kpi/circle-kpi.html',
        controller: ['$scope', '$timeout', 'messageService', '$rootScope', '$translate', '$state', 'dataEx', 'pageDataUtil', 'widgetValues', circleKpiComponent]
    });


    function circleKpiComponent($scope, $timeout, messageService, $rootScope, $translate, $state, dataEx, pageDataUtil, widgetValues) {
        var that = this;
        that.options = this._options || {data: undefined, init: true};
        that.parseList = this.theModel ? this.theModel : [];
        that.$onInit = onInit;

        function onInit() {
            // console.log("this.theModel : ", this.theModel);
            // console.log("that.parseList: ", that.parseList);
            $timeout(function () {
                ///that.parseList = this.theModel;
                formatParseList();
            }, 1000);

            // if (that.options.data) {
            //     $timeout(function () {
            //         that.parseList = initPageParam(that.options.data);
            //
            //     }, 1000);
            // } else {
            //     testData();
            //     initParseList();
            //     formatParseList();
            // }
        }

        that.parseIcon = [
            {name: "資料斷點", icon: "fa-database", icon_with: "fa-ban", merge: true},
            {name: "認列空間", icon: "fa-database", icon_with: "fa-cog", merge: true},
            {name: "異地備援開機", icon: "fa-server", icon_with: undefined, merge: false},
            {name: "DRP檔", icon: "fa-folder-open", icon_with: "fa-plus-circle", merge: true},
            {name: "結果回報", icon: "fa-file-upload", icon_with: undefined, merge: false}
        ];

        function formatParseList() {
            if (that.parseList.length <= 3 && that.options.init) {
                that.parseList.push(autoAddParseRecord("資料斷點", 1));
                that.parseList.push(autoAddParseRecord("認列空間", 2));
            }
            initParseList();
            angular.forEach(that.parseList, function (v, k) {
                var iconMap = _.find(that.parseIcon, function (k) {
                    return k.name === v.name;
                });
                _.merge(v, iconMap);
            });
        }


        function autoAddParseRecord(name, order) {
            return {
                name: name,
                order: order,
                taskCount: 1,
                status: 'completed',
                hosts: []
            }

        }

        function initParseList() {
            that.parseList = _.sortBy(that.parseList, function (k) {
                return k.order;
            });
        }

        function initPageParam(initval) {
            //Todo 判断传入的变量类型。
            var valueObj = pageDataUtil.getPageScopeValues($scope);
            return dataEx.evalVarExpr(initval, valueObj);
        }

        function testData() {
            that.parseList = [
                {
                    "name": "異地備援開機",
                    "order": 3,
                    "taskCount": 5,
                    "status": "completed",
                    "hosts": [
                        {
                            "key": "2c92833f86ca2ae80186fd7bb1ab642d",
                            "value": "120.78.220.228",
                            "assetType": "Windows"
                        }
                    ]
                },
                {
                    "name": "結果回報",
                    "order": 5,
                    "taskCount": 1,
                    "status": "running",
                    "hosts": [
                        {
                            "key": "2c92833f86ca2ae80186fd7bb1ab642d",
                            "value": "120.78.220.228",
                            "assetType": "Windows"
                        }
                    ]
                },
                {
                    "name": "DRP檔",
                    "order": 4,
                    "taskCount": 1,
                    "status": "running",
                    "hosts": []
                }
            ]
        }
    }

})();
