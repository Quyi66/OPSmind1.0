/**
 *
 * @author yangbin
 */
(function () {
    'use strict';

    angular.module('oplus.os').controller('flowCtrl', flowCtrl);

    flowCtrl.$inject = ['$scope', '$state', 'flowService', '$stateParams', '$location', 'messageService', 'userPref', 'currentUser', '$translate'];

    function flowCtrl($scope, $state, flowService, $stateParams, $location, messageService, userPref, currentUser, $translate) {
        var that = this;
        that.flowList = [];
        that.createFlow = createFlow;
        that.changeActiveFlow = changeActiveFlow;
        that.activeFlow = $location.path().split("/")[2];
        console.log("activeFlow: ", that.activeFlow);
        that.orderName = userPref.readItem('jaoFlowOrderName', 'updatedAt');
        that.orderMethod = userPref.readItem('jaoFlowOrderMethod', false);
        that.changeFlowOrderBy = changeFlowOrderBy;
        that.createInstance = createInstance;
        that.editFlow = editFlow;
        that.deleteFlow = deleteFlow;

        function createInstance(flow) {
            changeActiveFlow(flow);
            if (currentUser.hasPermission('jao:run')) {
                $state.go('app.os.flow_list.instance', {id: flow.id, flow: flow});
            } else {
                messageService.alertError($translate.instant('common.uaa.no_permission_title'), $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.save')}));
            }
        }

        function changeFlowOrderBy(jaoFlowOrderName) {
            userPref.saveItem('jaoFlowOrderName', jaoFlowOrderName);
            var jaoFlowOrderMethod = !(userPref.readItem('jaoFlowOrderMethod', false));
            userPref.saveItem('jaoFlowOrderMethod', jaoFlowOrderMethod);
            that.orderName = jaoFlowOrderName;
            that.orderMethod = jaoFlowOrderMethod;
        }

        function changeActiveFlow(flow) {
            that.activeFlow = flow.id;
        }

        function createFlow() {
            if (currentUser.hasPermission('jao:edit')) {
                $state.go('app.os.flow_list.flow_new');
            } else {
                messageService.alertError($translate.instant('common.uaa.no_permission_title'), $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.save')}));
            }
        }

        function initFlowList() {
            flowService.findAllFlows().then(function (flows) {
                //Todo 考虑新增流程标识。过滤流程
                that.flowList = _.filter(flows, function (rec) {
                    if (rec.name.indexOf("系统") > 0 || rec.name.indexOf("升级") > 0) {
                        return rec.name;
                    }
                });
                //that.flowList = filterFlows;
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('jao.messages.cannot_get_flow_instance_list'), err.message);
            });
        }

        initFlowList();

        function editFlow(id) {
            if (currentUser.hasPermission('jao:edit')) {
                $state.go('app.os.flow_list.flow_edit', {id: id});
            } else {
                messageService.alertError($translate.instant('common.uaa.no_permission_title'), $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.edit')}));
            }
        }


        function deleteFlow(name, id) {
            if (currentUser.hasPermission('jao:edit')) {
                messageService.confirmDanger(
                    $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                    $translate.instant('common.messages.operation.body', {
                        operation: $translate.instant('common.entity.action.delete'),
                        obj: $translate.instant('jao.common.flow')
                    }),
                    function () {
                        jaoFlowService.deleteFlow(id).then(function () {
                            $state.go('app.os.flow_list', null, {reload: true});
                        }).catch(function (err) {
                            messageService.toast('error', $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.delete')}), err.message);
                        });
                    },
                    null,
                    $translate.instant('common.messages.operation.ok_label', {operation: $translate.instant('common.entity.action.delete')}));
            } else {
                messageService.alertError($translate.instant('common.uaa.no_permission_title'), $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.delete')}));
            }
        }
    }
})();
