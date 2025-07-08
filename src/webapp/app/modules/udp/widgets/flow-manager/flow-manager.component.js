/**
 * @author yangbin
 * @date 2022-09-17 created
 */
(function () {
    'use strict';

    angular.module('oplus.udp').component('flowManager', {
        bindings: {
            _options: '<options'
        },
        templateUrl: 'app/modules/udp/widgets/flow-manager/flow-manager.html',
        controller: ['$scope', 'messageService', '$location', '$translate', '$timeout', 'userPref', '$compile', '$uibModal',
            '$state', 'pageDataUtil', 'modalHelper', 'jaoFlowService', 'currentUser', FlowManagerCtrl],
        controllerAs: '$ctrl'
    });


    function FlowManagerCtrl($scope, messageService, $location, $translate, $timeout,
                             userPref, $compile, $uibModal, $state, pageDataUtil, modalHelper, jaoFlowService, currentUser) {
        var that = this;
        that.options = this._options ? this._options : undefined;

        that.$onInit = onInit;
        that.flowList = [];
        that.createFlow = createFlow;
        that.changeActiveFlow = changeActiveFlow;

        that.assignPermission = false;

        that.activeFlow = $location.path().split("/")[2];
        that.orderName = userPref.readItem('jaoFlowOrderName', 'updatedAt');
        that.orderMethod = userPref.readItem('jaoFlowOrderMethod', false);


        that.changeFlowOrderBy = changeFlowOrderBy;
        that.createInstance = createInstance;
        that.editFlow = editFlow;
        that.deleteFlow = deleteFlow;
        that.exportFlow = exportFlow;
        that.importFlow = importFlow;
        that.assignFlow = assignFlow;

        that.addTag = false;
        that.editTag = false;
        that.recordTag = false;
        that.exportTag = false;
        that.runTag = false;
        that.assignTag = false;

        function onInit() {
            initFlowList(that.options.applet);
        }

        function assignFlow() {
            that.addTag = false;
            that.editTag = false;
            that.recordTag = false;
            that.exportTag = false;
            that.runTag = false;
            $scope.assginFlowAppletCode = that.options.appletCode;
            that.assignTag = true;
            $scope.$broadcast("assginFlow", $scope.assginFlowAppletCode);

            //Todo 查看权限细化
            // if (currentUser.hasPermission('jao:edit')) {
            // } else {
            //     messageService.alertError($translate.instant('common.uaa.no_permission_title'), $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.save')}));
            // }

        }

        function exportFlow() {
            that.editTag = false;
            that.recordTag = false;
            that.addTag = false;
            that.runTag = false;
            that.assignTag = false;

            $scope.exportFlowAppletCode = that.options.appletCode;
            that.exportTag = true;
            $scope.$broadcast("exportFlow", $scope.exportFlowAppletCode);
        }


        $scope.$on("startFlow", function (event, data) {
            changeActiveFlow(data);
        });

        function importFlow() {
            var modal = $uibModal.open({
                templateUrl: 'app/modules/udp/widgets/flow-manager/flow-import.html',
                size: 'md',
                backdrop: 'static',
                controller: 'flowImportCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    appletCode: function () {
                        return that.options.applet;
                    }
                }
            });
            modal.result.then(function close(result) {
                messageService.toast('success', $translate.instant("gfs.common.operation_success"));
                onInit();
            }, function dismiss() {
            });
        }

        function createInstance(id) {

            that.addTag = false;
            that.editTag = false;
            that.recordTag = false;
            that.exportTag = false;
            that.assignTag = false;
            $scope.runOptions = {
                selector: 'multiple',
                appletCode: that.options.applet,
                flowTemplate: id,
                hostScope: "step",
                hostGroup: true,
                scriptsOption: "multiple",
                runJob: true
            };
            that.runTag = true;
            $scope.$broadcast("runFlow", $scope.createOptions);
        }

        function changeFlowOrderBy(jaoFlowOrderName) {
            userPref.saveItem('jaoFlowOrderName', jaoFlowOrderName);
            var jaoFlowOrderMethod = !(userPref.readItem('jaoFlowOrderMethod', false));
            userPref.saveItem('jaoFlowOrderMethod', jaoFlowOrderMethod);
            that.orderName = jaoFlowOrderName;
            that.orderMethod = jaoFlowOrderMethod;
        }

        function changeActiveFlow(flow) {
            that.editTag = false;
            that.addTag = false;
            that.exportTag = false;
            that.runTag = false;
            that.assignTag = false;
            that.activeFlowId = flow.id;
            $scope.activeChooseFlowId = flow.id;

            that.recordTag = true;
            $scope.$broadcast("recordFlow", $scope.activeChooseFlowId);
        }

        function createFlow() {
            that.editTag = false;
            that.recordTag = false;
            that.exportTag = false;
            that.runTag = false;
            that.assignTag = false;
            $scope.createOptions = {
                selector: 'multiple',
                appletCode: that.options.applet,
                flowTemplate: undefined,
                hostScope: "step",
                hostGroup: true,
                scriptsOption: "multiple",
                runJob: false
            };

            that.addTag = true;
            $scope.$broadcast("createFlow", $scope.createOptions);
        }

        function initFlowList(applet) {
            jaoFlowService.findAllFlows(applet).then(function (flows) {
                that.flowList = flows;
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('jao.messages.cannot_get_flow_instance_list'), err.message);
            });
        }

        function editFlow(id) {
            that.addTag = false;
            that.recordTag = false;
            that.exportTag = false;
            that.runTag = false;
            that.assignTag = false;
            $scope.createOptions = {
                selector: 'multiple',
                appletCode: that.options.applet,
                flowTemplate: id,
                hostScope: "step",
                hostGroup: true,
                scriptsOption: "multiple",
                runJob: false
            };
            that.editTag = true;
            $scope.$broadcast("editFlow", $scope.createOptions);
        }


        function deleteFlow(name, id) {
            messageService.confirmDanger(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('common.messages.operation.body', {
                    operation: $translate.instant('common.entity.action.delete'),
                    obj: $translate.instant('jao.common.flow')
                }),
                function () {
                    jaoFlowService.deleteFlow(id).then(function () {
                        onInit();
                    }).catch(function (err) {
                        messageService.toast('error', $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.delete')}), err.message);
                    });
                },
                null,
                $translate.instant('common.messages.operation.ok_label', {operation: $translate.instant('common.entity.action.delete')}));

        }
    }
})();
