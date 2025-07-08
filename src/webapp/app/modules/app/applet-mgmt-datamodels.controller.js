/**
 * @author mr.kongqi@gmail.com,2021/9/3 14:00,created
 */
(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtDataModelsCtrl', AppletMgmtDataModelsCtrl);

    AppletMgmtDataModelsCtrl.$inject = ['$scope', '$state', 'jaoJobService', '$stateParams', '$location', 'messageService', 'userPref', 'dcDataService', '$translate','appletSecurity'];

    /**
     *
     * @param $scope
     * @param $state
     * @param {jaoJobService} jaoJobService
     * @param $stateParams
     * @param $location
     * @param {messageService} messageService
     * @param {userPref} userPref
     * @param {dcDataService} dcDataService
     * @param $translate
     * @param {appletSecurity} appletSecurity
     * @constructor
     */
    function AppletMgmtDataModelsCtrl($scope, $state, jaoJobService, $stateParams, $location, messageService, userPref, dcDataService, $translate,appletSecurity) {
        var that = this;
        that.selectedCommands = [];
        that.deleteDcModel = deleteDcModel;
        that.refreshModes = refreshModes;
        that.deleteModels = deleteModels;

        that.selectedModels = []

        that.appletCode = $stateParams.appletCode;

        var columnDefs = [
            {
                data: 'code',
                title: $translate.instant('jao.dc.detail.code'),
                render: function (data, type, row, meta) {
                    return '<a class="d-block text-wrap" ui-sref="app.appman.datamodel.view({id:\'' + row.id + '\'})">' + data + '</a>';
                }
            },
            {data: 'appletCode', title: $translate.instant('jao.dc.detail.owner_application')},
            {data: 'dataMode', title: $translate.instant('jao.dc.detail.mode')},
            {
                data: 'updateBy',
                title: $translate.instant('common.entity.detail.update_by')
            },
            {
                data: 'updateAt',
                title: $translate.instant('common.entity.detail.update_at'),
                render: function (data, type, row, meta) {
                    var date = row.updateAt;
                    return $$.formatDate(date, 'YYYY-MM-DD hh:mm:ss');
                }
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    if (!appletSecurity.canModifyAppletResource(row['appletCode'])){
                        return '';
                    }

                    var id = "'" + row.id + "'";
                    var code = "'" + row.code + "'";
                    return ' <button type="submit" ui-sref=app.appman.datamodel.edit({id:\'' + row.id + '\'}) class="btn btn-default opx-btn-icon opx-btn-flat" uaa-has-permission="jao:edit:*" title="{{\'common.entity.action.edit\' | translate}}">' +
                        '     <i class="fa fa-pencil"></i>' +
                        ' </button>' +
                        ' <button type="submit" ng-click="$ctrl.deleteDcModel(' + id + ',' + code + ')" class="btn btn-default opx-btn-icon opx-btn-flat" uaa-has-permission="jao:edit:*" title="{{\'common.entity.action.delete\' | translate}}">' +
                        '     <i class="fa fa-trash-alt"></i>' +
                        ' </button>';
                }
            }
        ];
        that.tableConfig = {
            columns: columnDefs,
            data: [dcModelList],
            selection: {
                valueData: 'id', labelData: 'name', preselected: that.selectedModels
            },
            order: [[1, 'desc'], [4, 'desc']],
            buttons: []
        };

        function dcModelList() {
            return dcDataService.dcModelList(that.appletCode);
        }

        function deleteDcModel(id, code) {
            //console.log("id is " + id + "code is " + code)
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('jao.messages.delete_model', {code: code}),
                function () {
                    dcDataService.deleteModelById(id).then(function (data) {
                        messageService.toast('success', $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.delete')}));
                        $state.reload();
                    }).catch(function (err) {
                        messageService.alertError($translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.delete')}), err.message);
                        throw err;
                    })
                })
        }

        function refreshModes() {
            dcDataService.dcModelList().then(function (data) {
                that.tableConfig.data = data;
            })
        }

        function deleteModels() {
            var ids = that.selectedModels.map(function (m) {
                return m;
            });
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('jao.messages.delete_models'),
                function () {
                    dcDataService.deleteModels(ids).then(function (data) {
                        messageService.toast('success', $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.delete')}));
                        $state.reload();
                    }).catch(function (err) {
                        messageService.alertError($translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.delete')}), err.message);
                        throw err;
                    })
                })
        }

    }
})();
