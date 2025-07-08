/**
 * @author yangbin
 * @date 2022-09-17 created
 */
(function () {
    'use strict';

    angular.module('oplus.udp').component('flowInstanceList', {
        bindings: {
            flowId: '=flowId'
        },
        templateUrl: 'app/modules/udp/widgets/flow-manager/flow-instance-list.html',
        controller: ['$scope', 'messageService', '$location', '$translate', '$timeout', '$filter', 'userPref', '$compile',
            '$state', 'pageDataUtil', 'jaoFlowService', 'currentUser', FlowInstanceListCtrl],
        controllerAs: '$ctrl'
    });


    function FlowInstanceListCtrl($scope, messageService, $location, $translate, $timeout, $filter, userPref, $compile, $state, pageDataUtil, jaoFlowService, currentUser) {
        var that = this;
        that.flowId = this.flowId ? this.flowId : undefined;
        that.viewInstance = viewInstance;
        $scope.instanceViewTag = false;
        that.$onInit = init;


        $scope.$on("recordFlow", function (event, data) {
            $scope.instanceViewTag = false;
            that.flowId = data;
            $scope.tableConfig.reloadData();
            $scope.tableConfig.data = [function () {
                return jaoFlowService.findFlowInstances(that.flowId);
            }];
        });


        function init() {
            initTable();
        }


        function initTableCol() {
            return [
                {mData: 'name', title: $translate.instant('common.entity.detail.name')},
                {
                    mData: 'hosts', title: $translate.instant('jao.flow.detail.hosts'),
                    render: function (data, type, row, meta) {
                        var hosts = angular.fromJson(row.hosts);
                        return hosts.length;
                    }
                },
                {
                    mData: 'stepIds', title: $translate.instant('jao.flow.detail.steps'),
                    render: function (data, type, row, meta) {
                        return angular.fromJson(row.stepIds).length;
                    }
                },
                {
                    mData: 'createdAt', title: $translate.instant('jao.flow.detail.start_time'), type: 'html',
                    render: function (data, type, row, meta) {
                        return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                    }
                },
                {mData: 'createdBy', title: $translate.instant('jao.flow.detail.create_by')},
                {
                    mData: 'id',
                    title: $translate.instant('common.entity.detail.operation'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        return '<a class="btn btn-default btn-sm" title="{{\'common.entity.action.detail\' | translate}}" ng-click="$ctrl.viewInstance(' + id + ')">{{\'common.entity.action.detail\' | translate}}</a>';
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ];

        }

        function initTable() {
            $scope.tableConfig = {
                data: [function () {
                    return jaoFlowService.findFlowInstances(that.flowId);
                }],
                columns: initTableCol(),
                order: [[3, 'desc']],
                buttons: ['reload']
            };
        }


        function viewInstance(id) {
            $scope.instanceOption = {
                flowInstanceId: id
            };
            $scope.instanceViewTag = true;
            $scope.$broadcast("instanceView", $scope.instanceOption);
        }
    }
})();
