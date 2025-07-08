/**
 *
 * @author chenrongji, created on 2021-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('jaoFlowInstanceListCtrl', JaoFlowInstanceListCtrl);

    JaoFlowInstanceListCtrl.$inject = ['$scope', '$rootScope', 'dataTable', '$filter', '$compile', '$state', '$timeout', '$uibModal', 'messageService', 'jaoFlowService', '$stateParams', '$translate'];

    function JaoFlowInstanceListCtrl($scope, $rootScope, dataTable, $filter, $compile, $state, $timeout, $uibModal, messageService, jaoFlowService, $stateParams, $translate) {
        var that = this;
        that.viewInstance = viewInstance;
        that.$onInit = init;

        function init() {
            initTable();

        }

        function initTable() {
            var columnDefs = [
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
            that.tableConfig = {
                data: [function () {
                    return jaoFlowService.findFlowInstances($stateParams.id);
                }],
                columns: columnDefs,
                order: [[3, 'desc']],
                buttons: ['reload']
            };
        }


        function viewInstance(id) {
            $state.go('app.jao.flow_list.instance_view', {id: id});
        }
    }
})();
