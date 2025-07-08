/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/09/14, created
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name acmCiFilter
     * @description
     * This component searches asset by specified attribute and input values.
     * ```
     * <acm-ci-filter ng-model="[]" ci-type="string" options=""/>
     * @param {[]} ngModel The search result
     * @param {string} ciType The asset type in which to search for
     * ```
     */
    angular.module('oplus.acm').component('acmCiFilter', {
        bindings: {
            ngModel: '=',
            options: '<',
            ciType: '<ciType'
        },
        templateUrl: 'app/modules/acm/acm-ci-filter.html',
        controller: ['$element', '$scope', '$q', 'acmService','$translate', AcmCiFilterCtrl]
    });

    /**
     *
     * @param $element
     * @param $scope
     * @param $q
     * @param {acmService} acmService
     * @param {$translate} $translate
     * @constructor
     */
    function AcmCiFilterCtrl($element, $scope, $q, acmService,$translate) {
        var that = this;
        this.$onInit = onInit;
        this.doSearch = doSearch;
        this.delimDefs = [{value: 'space', label: $translate.instant('acm.common.filter.blank_space'), reg: '\\s'}, {value: 'comma', label: $translate.instant('acm.common.filter.comma'), reg: ','}];
        this.searchDelims = [];
        //TODO: not hardcode
        this.attrCode = 'IP';

        function onInit() {
        }

        function doSearch() {
            if (!that.searchText) {
                return;
            }
            // that.ciType = 'linux';
            var regstr = '\\n';
            that.searchDelims.forEach(function (d) {
                var def = _.find(that.delimDefs, {value: d});
                if (def) {
                    regstr += def.reg;
                }
            });
            regstr = '[' + regstr + ']';
            var parts = that.searchText.split(new RegExp(regstr));
            var values = [];
            parts.forEach(function (part) {
                part = part.trim();
                if (part) {
                    values.push(part);
                }
            });
            acmService.findCitByCode(that.ciType).then(function (model) {
                that.assetModel = model;
                return acmService.findCiByAttr(that.ciType, that.attrCode, values);
            }).then(function (data) {
                that.notFounds = _.difference(values, _.map(data, that.attrCode));
                that.searchResult = data;
                that.ngModel = [];
                data.forEach(function (o) {
                    //TODO: the `.IP` is hardcoded!!!
                    //TODO: change key to value, value to label
                    that.ngModel.push({key: o.id, value: o.IP, assetType: that.ciType});
                });
                that.showResult = true;
            }).catch(function (err) {
                throw err;
            });
        }
    }

})();
