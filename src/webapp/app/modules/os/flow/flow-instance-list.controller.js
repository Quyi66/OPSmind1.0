/**
 *
 * @author chenrongji, created on 2021-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('flowInstanceListCtrl', FlowInstanceListCtrl);

    FlowInstanceListCtrl.$inject = ['$scope', '$rootScope', 'dataTable', '$filter', '$compile', '$state', '$timeout', '$uibModal', 'messageService', 'flowService', '$stateParams', '$translate'];

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param dataTable
     * @param $filter
     * @param $compile
     * @param $state
     * @param $timeout
     * @param $uibModal
     * @param messageService
     * @param flowService
     * @param $stateParams
     * @param $translate
     * @constructor
     */
    function FlowInstanceListCtrl($scope, $rootScope, dataTable, $filter, $compile, $state, $timeout, $uibModal, messageService, flowService, $stateParams, $translate) {
        var that = this;
        that.$onInit = onInit;
        that.instances = [];
        that.viewInstance = viewInstance;

        var tableOption = {
            aoColumns: [
                {mData: 'name', title: $translate.instant('common.entity.detail.name')},
                {
                    mData: 'hosts', title: $translate.instant('jao.flow.detail.hosts'),
                    render: function (data, type, row, meta) {
                        var hosts = angular.fromJson(row.hosts);
                        return hosts.length;
                    }
                },
                {
                    mDate: 'stepIds', title: $translate.instant('jao.flow.detail.steps'),
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
                        var actionHtml =
                            '<a class="btn btn-default btn-sm" title="{{\'common.entity.action.detail\' | translate}}" ng-click="$ctrl.viewInstance(' + id + ')">{{\'common.entity.action.detail\' | translate}}</a>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        function viewInstance(id) {
            $state.go('app.os.flow_list.instance_view', {id: id});
        }

        function onInit() {
            var url = window.$oplus.appConfig.apiBaseUrls.jao + '/api/jao/flows/' + $stateParams.id + '/instances';
            var dataSrc = "";
            dataTable.initTable("#jaoFlowInstanceTable", tableOption.aoColumns, undefined, {
                scrollX: true,
                order: [[3, 'desc']],
                ajax: {
                    url: url,
                    dataSrc: dataSrc
                }
            }).then(function (apiInstance) {
                that.instance = apiInstance;
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('jao.messages.cannot_get_flow_instance_list'), err.message);
            });
        }
    }
})
();
