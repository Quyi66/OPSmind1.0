/**
 * @author mr.kongqi@gmail.com,2021/9/3 14:00,created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name acmCiDataView
     * @description
     * ```html
     * <acm-ci-data-view cit-code="">
     * ```
     */
    angular.module('oplus.jao').component('jaoCiDataView', {
        bindings: {
            ciId: '<'
        },
        templateUrl: 'app/modules/jao/datamodel/dc-data-view.html',
        controller: ['$scope', '$element', '$http', jaoCiViewCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param $http
     */
    function jaoCiViewCtrl($scope, $element, $http) {
        var that = this;
        //TODO: load model data
        $http.get('app/modules/jao/assets/model-view.json').success(function (data) {
            that.theData = data;
        }).error(function (err) {
            throw err;
        });
        $http.get('app/modules/jao/assets/model-config.json').success(function (data) {
            that.theModel = data;
        }).error(function (err) {
            throw err;
        });
    }
})();
