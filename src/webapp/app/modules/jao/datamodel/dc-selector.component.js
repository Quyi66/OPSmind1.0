(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name dataModelSelector
     * @description
     * This component provides a button or dropdown to select device.
     * ```html
     * <dc-selector the-model="array"
     * options="{label:string}">
     * @param {[{key:string, hostname:string, ip:string}|string]} theModel Two-way binding of selected hosts
     * @param {string|[string]} ciTypes Array or CSV of enabled CI types. Default is {@link acmUtil.DEFAULT_DEVICE_TYPE}.
     * `[all]` for all types, `[auto]` for automation enabled types.
     * @param {{label:string, useString:boolean}=} options
     * @param {string} options.label Label text shown on button or dropdown.
     * "btndlg" for button and dialog, usually used for select device instance or group etc.
     * "dropdown" for dropdown, usually used for filtering.
     * ```
     * TODO: only load data after dropdown click
     * 
     * 
     * job-param:
     * dc - selector = {
        "code": "DR_EMC",
        "viewRows": ["name"],
        "value": "name"
        }
     */
    angular.module('oplus.jao').component('dcSelector', {
        bindings: {
            theData: '=theModel',
            readonly: '=',
            _options: '<options'
            // onSelect: '<'
        },
        templateUrl: 'app/modules/jao/datamodel/dc-selector.html',
        controller: ['$scope', 'cmActions', 'messageService', 'acmUtil', '$translate', 'acmService', '$uibModal', 'dcDataService', DcSelectorCtrl]
    });

    /**
     * @param $scope
     * @param {cmActions} cmActions
     * @param {messageService} messageService
     * @param {acmUtil} acmUtil
     * @param {$translate} $translate
     */
    function DcSelectorCtrl($scope, cmActions, messageService, acmUtil, $translate, acmService, $uibModal, dcDataService) {
        var that = this;
        var defaultOptions = {
            selector: 'multiple',
            thisLabel: $translate.instant('acm.common.selector.choose'),
            useString: false
        };

        // NOTE: Assignment to this._options will create a new object.
        // In HTML `$ctrl._options` still reference to old one
        // this._options = _.merge({}, defaultOptions, this._options);
        this.theOptions = _.merge({}, defaultOptions, this._options);

        this.openDeviceSelectorDialog = openDeviceSelectorDialog;
        this.removeItem = removeItem;
        this.emptyItems = emptyItems;
        this.$onInit = onInit;

        that.getData = function () {
            if (that.theOptions.valueType === 'string')
                return !that.theData ? [] : that.theData.split(',');
            else
                return that.theData;
        }

        that.doEmpty = function () {
            if (that.theOptions.valueType === 'string')
                that.theData = "";
            else
                that.theData = [];
        }

        that.setData = function (arr) {
            if (that.theOptions.valueType === 'string')
                that.theData = arr.join();
            else
                that.theData = arr;
        }

        function onInit() {
            dcDataService.queryModelByCode(that.theOptions.code).then(function (res) {
                that.modelDef = {
                    attrs: angular.fromJson(res.attrs),
                    views: [{
                        "type": "selector",
                        "config": {
                            "columns": that.theOptions.viewRows
                        }
                    }]
                };
            })
        }

        function emptyItems() {
            messageService.confirm($translate.instant('acm.common.selector.confirm'), $translate.instant('acm.common.selector.delete_confirm'), function () {
                that.doEmpty();
            });
        }

        function openDeviceSelectorDialog() {
            if (that.readonly) return;

            dcDataService.queryDataListByCode(that.theOptions.code).then(function (res) {
                that.dcData = _.map(res, function (m) {
                    return angular.fromJson(m.dataJson);
                });

                var preSelected = [];

                that.getData().forEach(function (data) {
                    preSelected.push(data);
                });

                var modal = $uibModal.open({
                    template: '' +
                        '<div class="modal-header">' +
                            '<h4 class="modal-title">{{\'jao.job.selector.select_device\' | translate}}</h4>' +
                            '<button type="button" class="btn-close" data-dismiss="modal"  ng-click="$ctrl.cancel()"><span aria-hidden="true"></span></button>' +
                        '</div>' +

                        '<div class="modal-body">' +
                            '<umd-data-view the-data="$ctrl.data" model-def="$ctrl.model" view-type="\'selector\'" options="$ctrl.viewOptions"></umd-data-view>' +
                        '</div>' +
                        
                        '<div class="modal-footer text-right">' +
                            '<button type="submit" class="btn btn-primary opx-btn-ok" ng-click="$ctrl.confirm()">{{\'common.action.confirm\' | translate}}</button>' +
                            '<button type="reset" class="btn btn-default opx-btn-cancel" ng-click="$ctrl.cancel()">{{\'common.action.cancel\' | translate}}</button>' +
                        '</div>',
                    controller: ['$scope', function ($scope) {
                        this.data = that.dcData;
                        this.model = that.modelDef;
                        this.viewOptions = {
                            selectionConfig: {
                                "valueData": that.theOptions.value,
                                "labelData": that.theOptions.label,
                                "preselected": preSelected
                            },
                            tableInstance: {}
                        };
                        this.cancel = function () {
                            modal.dismiss();
                        };
                        this.confirm = function () {
                            modal.close(this.viewOptions.tableInstance.selectedItems);
                        }
                    }],
                    controllerAs: '$ctrl',
                    backdrop: 'static',
                    size: 'lg'
                });
                modal.result.then(function close(result) {
                    var dataTmp = [];
                    result.forEach(function (item) {
                        dataTmp.push(item);
                    });
                    dataTmp = _.uniqWith(dataTmp, _.isEqual);

                    that.setData(dataTmp);
                    
                }, function dismiss() {
                });
            })
        }

        function removeItem(index) {
            var arrTmp = that.getData();
            arrTmp.splice(index, 1);
            that.setData(arrTmp);
        }
    }
})();
