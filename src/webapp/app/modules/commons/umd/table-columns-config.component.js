/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/29, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name tableColumnsConfig
     * @description
     * Configure view for model.
     * ```html
     * ```
     */
    angular.module('oplus.commons').component('tableColumnsConfig', {
        bindings: {
            theModel:'=',
            theFields: '<',
            options:'<'
        },
        templateUrl: 'app/modules/commons/umd/table-columns-config.html',
        controller: ['$scope', '$element', 'udmUtil', udmModelCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {udmUtil} udmUtil
     */
    function udmModelCtrl($scope, $element, udmUtil) {
        var that = this;
        this.$onInit = onInit;
        this.attrsByCode = {};

        function onInit() {


        }
    }
})();
