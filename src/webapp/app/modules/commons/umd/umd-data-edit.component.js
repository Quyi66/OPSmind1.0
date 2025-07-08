/**
 * @ Author: chy
 * @ Create Time: 2023-05-30 13:55:32
 * @ Description:  
 */


(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdDataView
     * @description
     * Edit UMD data.
     * ```html
     * <umd-data-edit model-code="string"
     *                options="{}" />
     * @param {string} modelCode  Data Model Code
     * @param {object=} options
     *
     * ```
     */
    angular.module('oplus.commons').component('umdDataEdit', {
        bindings: {
            modelCode: '<',
            dataId: '<?',
            options: '<'
        },
        templateUrl: 'app/modules/commons/umd/umd-data-edit.component.html',
        controller: ['$scope', '$stateParams', 'udmUtil', 'dataEx', 'widgetInteraction',
            'modalHelper', 'dcDataService', 'messageService', '$translate',
            umdDataEditCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {udmUtil} udmUtil
     * @param {dataEx} dataEx
     * @param {widgetInteraction} widgetInteraction
     * @param {modalHelper} modalHelper
     */
    function umdDataEditCtrl($scope, $stateParams, udmUtil, dataEx, widgetInteraction,
        modalHelper, dcDataService, messageService, $translate) {
        var that = this;
        this.$onInit = onInit;
        this.options = this.options || {};
        this.data = {};
        this.allChecked = true;

        this.dataId = this.dataId || $scope.$parent.$widget.$pageScope.pageParams._dataId || undefined;
        var inited = false;

        function onInit() {
            prepareView();
            $scope.$watch('$ctrl.data', function (n, o) {
                if (!n || !that.model || !that.model['attrs'] || n === o) return;
                that.allChecked = _.every(_.filter(that.model.attrs,
                    function (f) { return f.type !== 'group' && f.required }),
                    function (e) {
                        return that.data[e.code] !== null && that.data[e.code] !== undefined;
                    })
            }, true);
        }

        function prepareView() {
            if (inited) return;
            inited = true;

            dcDataService.queryModelByCode(that.modelCode).then(function (data) {
                that.model = {
                    attrs: angular.fromJson(data.attrs)
                };

                if (that.dataId) {
                    dcDataService.queryDataById(that.dataId).then(function (data) {
                        if (!data) return;
                        that.data = angular.extend(data.dataJson && angular.fromJson(data.dataJson) || {});
                    })
                }
            });

            that.save = function () {
                var data = {
                    dataModel: that.modelCode,
                    dataOwner: $stateParams.appletCode,
                    dataOwnerId: $stateParams.appletCode,
                    dataJson: angular.toJson(that.data),
                }

                if (that.dataId) {
                    data.id = that.dataId;
                    data.updateTime = new Date()
                }

                messageService.confirm(
                    $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.action.save')}),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.action.save'), obj: $translate.instant('common.table.config.data') }),
                    function() {
                        dcDataService.saveDcData(data).then(function (data) {
                            messageService.toast("success", $translate.instant('common.messages.operation.success', {
                                operation: $translate.instant('common.action.save')
                            }));

                            that.close();
                        })
                    }
                )
            }

            that.close = function () {
                var method = that.recursionBack($scope);
                if (method) method[0].call(that, method[1]);
            }

            that.recursionBack = function (scope) { 
                if (!scope.$parent) return [window.history.go, [-1]];
                if (scope.$close) return [scope.$close, [true]];
                return that.recursionBack(scope.$parent);
            }
        }
    }
})();
