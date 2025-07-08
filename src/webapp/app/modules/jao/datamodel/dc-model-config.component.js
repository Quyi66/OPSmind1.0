/**
 * @author mr.kongqi@gmail.com,2021/9/3 14:00,created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoCiModelEditor
     * @description
     * ```html
     * <jao-ci-model-editor cit-code="">
     * ```
     */
    angular.module('oplus.jao').component('jaoCiModelEditor', {
        bindings: {
            dcCode: '<',
            viewMode: '<'
        },
        templateUrl: 'app/modules/jao/datamodel/dc-model-config.html',
        controller: ['$scope', '$state', '$element', '$http', '$stateParams', 'messageService', 'dcDataService', '$translate', 'appletService', jaoCiModelEditorCtrl]
    });

    /**
     *
     * @param $scope
     * @param $state
     * @param $element
     * @param $http
     * @param $stateParams
     * @param messageService
     * @param dcDataService
     * @param appletService
     * @param $translate
     */
    function jaoCiModelEditorCtrl($scope, $state, $element, $http, $stateParams, messageService, dcDataService, $translate, appletService) {
        var that = this;
        // init the drop-down menu data
        dcDataType();

        // 当新建时初始化数据
        if (that.viewMode === "create") {
            initData();
        }

        // 加载所有应用下拉选择
        // loadApplets();

        openDcData(that.dcCode);

        this.save = save;
        this.showJson = showJson;
        this.openDcData = openDcData;
        //TODO: load model data
        that.apps = []

        // function loadApplets() {
        //     appletService.findApplets().then(function (applets) {
        //         that.apps = applets;
        //         that.apps.unshift({name: 'choose_apps', title: $translate.instant('jao.dc.detail.choose_apps')})
        //         that.modelConfig = {'dataMode': '', 'appletCode': "choose_apps"}
        //     }).catch(function (err) {
        //         throw err;
        //     })
        // }

        function initData() {
            console.log("init data")
            $http.get('app/modules/jao/assets/model-config.json').success(function (data) {
                that.modelConfig = data;
                if (that.modelConfig.attrs) {
                    that.modelConfig.attrs = []
                }
            }).error(function (err) {
                throw err;
            });
        }

        function dcDataType() {
            $scope.dcDataTypes = [
                // {label: '', value: ''},
                {label: 'REPLACE(' + $translate.instant('jao.dc.type.replace') + ')', value: 'REPLACE'},
                {label: 'APPEND(' + $translate.instant('jao.dc.type.append') + ')', value: 'APPEND'},
                {label: 'COVER(' + $translate.instant('jao.dc.type.cover') + ')', value: 'COVER'},
            ];
        }

        function save(dcData) {
            var code = dcData.code;
            var dataMode = dcData.dataMode;
            var appletCode = $stateParams.appletCode;
            that.modelConfig.appletCode = $stateParams.appletCode;
            // dcData.appletCode = $stateParams.appletCode;
            if (!code) {
                messageService.toast('error', $translate.instant('common.messages.input', {obj: $translate.instant('jao.common.data_model')}))
                return;
            }
            if (!appletCode || appletCode === "choose_apps") {
                messageService.toast('error', $translate.instant('common.messages.select', {obj: $translate.instant('jao.dc.detail.owner_application')}))
                return;
            }
            if (!dataMode) {
                messageService.toast('error', $translate.instant('common.messages.select', {obj: $translate.instant('jao.dc.detail.mode')}))
                return;
            }
            dcData.attrs = JSON.stringify(dcData.attrs);

            var saveMethod = dcDataService.saveDcModel;
            if (dcData.id) saveMethod = dcDataService.updateDcModel

            saveMethod(dcData).then(function (result) {
                if (result._result === "OK")
                    messageService.toast("success", $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.save')}))
                else
                    messageService.toast("error", $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.save')}))
                $state.go("app.appman.datamodel")
            }).catch(function (err) {
                throw err;
            })
        }

        function openDcData(dcCode) {
            if (!dcCode) return;
            // console.log("开始根据id查询结果，id为" + dcCode)
            dcDataService.queryModelById(dcCode).then(function (result) {
                that.modelConfig = result
                that.modelConfig.attrs = JSON.parse(result.attrs)
                console.log("modelConfig is" + JSON.stringify(that.modelConfig.attrs));
            }).catch(function (err) {
                throw err;
            })
        }

        function showJson() {
            messageService.alert($translate.instant('jao.messages.model_show_json'), '<pre>' + JSON.stringify(that.modelConfig, null, '  ') + '</pre>');
        }

    }
})();
