/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-04-02
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoHostSelector
     * @deprecated Use acm-device-selector
     * @description
     * ```html
     * <jao-host-selector the-model="array" options="">
     * ```
     * @param {[{key:string, hostname:string, ip:string}|string]} theModel Two-way binding of selected hosts
     * @param {{useString:boolean}=} options
     * TODO: refactor all use string by default
     */
    angular.module('oplus.jao').component('jaoHostSelector', {
        bindings: {
            theHosts: '=theModel',
            options: '<',
            onSelect: '<',
            assetType:'<'
        },
        templateUrl: 'app/modules/jao/flow/host-selector.html',
        controller: ['$scope', 'cmActions', 'messageService', '$translate', HostSelector]
    });

    /**
     * @param $scope
     * @param {cmActions} cmActions
     * @param {messageService} messageService
     */
    function HostSelector($scope, cmActions, messageService, $translate) {
        var that = this;
        this.removeItem = removeItem;
        this.openSelectorDialog = openSelectorDialog;
        this.clearAll = clearAll;
        this.options = this.options || {useString: false};


        function clearAll() {
            messageService.confirm(
                $translate.instant('common.messages.operation.title'),
                $translate.instant('jao.messages.remove_all_hosts'),
                function () {
                    that.theHosts = [];
                });
        }

        function openSelectorDialog() {
            var preSelected = [];

            that.theHosts.forEach(function (host) {
                preSelected.push(that.theOptions.useString ? host.key : host);
            });
            cmActions.openHostSelectorV2(preSelected, this.assetType, function (hosts) {
                that.theHosts = [];
                hosts.forEach(function (host) {
                    that.theHosts.push(that.theOptions.useString ? host.key : host);
                });
            });
        }

        function removeItem(index) {
            that.theHosts.splice(index, 1);
        }
    }
})();