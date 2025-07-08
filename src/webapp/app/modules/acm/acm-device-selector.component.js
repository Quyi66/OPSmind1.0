/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-04-02
 * @author Leo Liao (leoliaolei@gmail.com), 2021-04-21, rename from jao-host-selector
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name acmDeviceSelector
     * @description
     * This component provides a button or dropdown to select device.
     * ```html
     * <acm-device-selector ci-types="CSV|array" the-model="array" view-as="@string"
     * options="{label:string}">
     * @param {[{key:string, hostname:string, ip:string}|string]} theModel Two-way binding of selected hosts
     * @param {string|[string]} ciTypes Array or CSV of enabled CI types. Default is {@link acmUtil.DEFAULT_DEVICE_TYPE}.
     * `[all]` for all types, `[auto]` for automation enabled types.
     * @param {{label:string, useString:boolean}=} options
     * @param {string} options.label Label text shown on button or dropdown.
     * @param {string} viewAs How the component display.
     * "btndlg" for button and dialog, usually used for select device instance or group etc.
     * "dropdown" for dropdown, usually used for filtering.
     * ```
     * TODO: only load data after dropdown click
     */
    angular.module('oplus.acm').component('acmDeviceSelector', {
        bindings: {
            theHosts: '=theModel',
            viewAs: '@',
            assetType: '<ciTypes',
            mcheckType: '<',
            isSelected: '<',
            readonly: '=',
            _options: '<options'
            // onSelect: '<'
        },
        templateUrl: 'app/modules/acm/acm-device-selector.html',
        controller: ['$scope', 'cmActions', 'messageService', 'acmUtil', '$translate', 'acmService', AcmDeviceSelectorCtrl]
    });

    /**
     * @param $scope
     * @param {cmActions} cmActions
     * @param {messageService} messageService
     * @param {acmUtil} acmUtil
     * @param {$translate} $translate
     * @param acmService
     */
    function AcmDeviceSelectorCtrl($scope, cmActions, messageService, acmUtil, $translate, acmService) {
        var that = this;
        var defaultOptions = {
            // viewType: this.viewType || 'table',
            // selectMode: 'all',
            selector: 'multiple',
            label: $translate.instant('acm.common.selector.choose'),
            useString: false
        };
        // this.assetType = this.assetType || acmUtil.DEFAULT_DEVICE_TYPE;
        this.theHosts && (this.theHosts = angular.fromJson(this.theHosts));

        // NOTE: Assignment to this._options will create a new object.
        // In HTML `$ctrl._options` still reference to old one
        // this._options = _.merge({}, defaultOptions, this._options);
        this.theOptions = _.merge({}, defaultOptions, this._options);
        if (this._options && this.viewAs) {
            this.theHosts = this.theHosts ? this.theHosts[0] === '@@' ? this.theHosts : [] : [];
        }
        var viewModeDef = acmUtil.findViewModeDef(this.viewAs);
        this.viewAs = viewModeDef.value;
        this.theOptions.selectMode = viewModeDef.selectMode;
        this.openDeviceSelectorDialog = openDeviceSelectorDialog;
        this.removeItem = removeItem;
        this.emptyItems = emptyItems;
        this.$onInit = onInit;

        function onInit() {
            if (angular.isArray(that.assetType) && that.assetType.length > 0) {
                that.enabledCiTypes = that.assetType;
            } else if (that.assetType &&  that.assetType.length > 0) {
                that.enabledCiTypes = that.assetType.split(',');
            } else {
                acmService.tabTitle("select").then(function (result) {
                    that.enabledCiTypes = _.map(result, function (o) {
                        return o.value;
                    });
                    that.assetType = that.enabledCiTypes;
                });
            }
            if (that.isSelected) {
                openDeviceSelectorDialog();
            }
        }

        function emptyItems() {
            messageService.confirm($translate.instant('acm.common.selector.confirm'), $translate.instant('acm.common.selector.delete_confirm'), function () {
                that.theHosts = [];
            });
        }

        function openDeviceSelectorDialog() {
            if (that.readonly) return;
            var preSelected = [];
            if (!that.theHosts) {
                that.theHosts = [];
            }

            that.theHosts.forEach(function (host) {
                preSelected.push(that.theOptions.useString ? host.key : host);
            });
            cmActions.openDeviceSelectorV4(preSelected, that.assetType, that.theOptions, that.mcheckType, function (hosts) {
                 that.theHosts = [];
                // console.log('openDeviceSelectorDialog', {useString: that.theOptions.useString, hosts: hosts});
                // var oldHost = _.head(preSelected);
                // var way = "add";
                // hosts.forEach(function (host) {
                //     if (oldHost) {
                //         if (oldHost.assetType !== host.assetType) {
                //             way = "diff";
                //             that.theHosts = [];
                //         }
                //     }
                // });
                hosts.forEach(function (host) {
                    // if (way === "diff") {
                    //     if (host.assetType !== oldHost.assetType) {
                    //         that.theHosts.push(that.theOptions.useString ? host.key : host);
                    //     }
                    // } else {
                    //     that.theHosts.push(that.theOptions.useString ? host.key : host);
                    // }
                    that.theHosts.push(that.theOptions.useString ? host.key : host);
                });
                that.theHosts = _.uniqWith(that.theHosts, _.isEqual);
            });
        }

        function removeItem(index) {
            that.theHosts.splice(index, 1);
        }
    }
})();
