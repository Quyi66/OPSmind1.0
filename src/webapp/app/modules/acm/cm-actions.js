/**
 * 主机选择器
 * @author Breckin,created on 04/07/2020
 */
(function () {
    'use strict';

    angular.module('oplus.acm').service('cmActions', cmActions);

    cmActions.$inject = ['$uibModal'];

    /**
     * @ngdoc service
     * @name cmActions
     * @param $uibModal
     */
    function cmActions($uibModal) {
        // this.openHostSelector = openHostSelector;
        this.openHostSelectorV2 = openHostSelectorV2;
        // this.openDeviceSelectorV3 = openDeviceSelectorV3;
        this.openDeviceSelectorV4 = openDeviceSelectorV4;

        /**
         *
         * @param preselected
         * @param {string} assetType
         * @param {object} options
         * @param mcheckType
         * @param {string} options.selectMode
         * @param callback
         */
        function openDeviceSelectorV4(preselected, assetType, options, mcheckType, callback) {
            options = _.merge({selectMode: 'all'}, options);
            var modal = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<h4 class="modal-title">{{\'jao.job.selector.select_device\' | translate}}</h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal"  ng-click="$ctrl.cancel()"><span aria-hidden="true"></span></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<acm-list-ci asset-types="\'' + assetType + '\'"  the-model="$ctrl.selected" options="{selectMode:\'' + options.selectMode + '\',selector:\'' + options.selector + '\',dataType:\'' + options.dataType + '\'}"  mcheck-type="\'' + mcheckType + '\'"></acm-list-ci></div>' +
                    '<div class="modal-footer text-right">' +
                    '<button type="submit" class="btn btn-primary opx-btn-ok" ng-click="$ctrl.confirm()">{{\'common.action.confirm\' | translate}}</button>' +
                    '<button type="reset" class="btn btn-default opx-btn-cancel" ng-click="$ctrl.cancel()">{{\'common.action.cancel\' | translate}}</button>' +
                    '</div>',
                controller: ['$scope', function ($scope) {
                    this.selected = preselected;
                    this.cancel = function () {
                        modal.dismiss();
                    };
                    this.confirm = function () {
                        modal.close(this.selected);
                    }
                }],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg'
            });
            modal.result.then(function close(result) {
                callback(result);
            }, function dismiss() {
            });
        }

        /**
         *
         * @param preselected
         * @param {string} assetType
         * @param {object} options
         * @param {string} options.selectMode
         * @param callback
         */
        function openDeviceSelectorV3(preselected, assetType, options, callback) {
            options = _.merge({selectMode: 'all'}, options);
            var modal = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<h4 class="modal-title">{{\'jao.job.selector.select_device\' | translate}}</h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal"  ng-click="$ctrl.cancel()"><span aria-hidden="true"></span></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<acm-list-ci asset-type="\'' + assetType + '\'"  the-model="$ctrl.selected" options="{selectMode:\'' + options.selectMode + '\',selector:\'' + options.selector + '\'}"></acm-list-ci></div>' +
                    '<div class="modal-footer text-right">' +
                    '<button type="submit" class="btn btn-primary opx-btn-ok" ng-click="$ctrl.confirm()">确定</button>' +
                    '<button type="reset" class="btn btn-default opx-btn-cancel" ng-click="$ctrl.cancel()">取消</button>' +
                    '</div>',
                controller: ['$scope', function ($scope) {
                    this.selected = preselected;
                    this.cancel = function () {
                        modal.dismiss();
                    };
                    this.confirm = function () {
                        //console.log('selected', this.selected);
                        modal.close(this.selected);
                    }
                }],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg'
            });
            modal.result.then(function close(result) {
                callback(result);
            }, function dismiss() {
            });
        }

        function openHostSelectorV2(preselected, assetType, callback) {
            var modal = $uibModal.open({
                templateUrl: 'app/modules/acm/select-host-modal.html',
                controller: ['$scope', function ($scope) {
                    this.selected = preselected;
                    this.assetType = assetType;
                    this.cancel = function () {
                        modal.dismiss();
                    };
                    this.confirm = function () {
                        modal.close(this.selected);
                    }
                }],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg'
            });
            modal.result.then(function close(result) {
                callback(result);
            }, function dismiss() {
            });
        }

        // /**
        //  *
        //  * @param config {preSelectedHosts:[],preSelectorGroup:''}
        //  * @param callback
        //  */
        // function openHostSelector(config, callback) {
        //     var defaultConfig = {preSelectedHosts: [], preSelectorGroup: ''};
        //     _.merge(defaultConfig, config);
        //     $uibModal.open({
        //         templateUrl: 'app/modules/cm/common/host-selector.html',
        //         controller: 'CMHostSelectorCtrl',
        //         controllerAs: 'cmHostSelectorCtrlVm',
        //         backdrop: 'static',
        //         size: 'lg',
        //         resolve: {
        //             entity: function () {
        //                 return {
        //                     config: defaultConfig,
        //                 };
        //             }
        //         }
        //     }).result.then(function (result) {
        //         var action = result.action;
        //         if (action != "cancel") {
        //             callback(result.selectedHosts);
        //         }
        //     }, function () {
        //
        //     });
        // }
    }
})();
