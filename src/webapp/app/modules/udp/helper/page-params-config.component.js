/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/9/2017
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name udpPageParamsConfig
     * @description
     * Configuration of page parameters
     * ````
     * <udp-page-params-config params-json="" options="">
     * ````
     * @param {string|object} paramsJson Parameter name-value pairs in JSON string or object
     * @param {object} options
     * @param {object} options.converter
     *
     */
    angular.module('oplus.udp').component('udpPageParamsConfig', {
        bindings: {
            paramsJson: '=',
            options: '<'
        },
        templateUrl: 'app/modules/udp/helper/page-params-config.html',
        controller: ['$scope',
            function PageParamConfigCtrl($scope) {
                var that = this;
                var changeFromJson = false;
                that.options = that.options || {};
                if (!that.options.converter) {
                    that.options.converter = {kinds: 'js,str', varTypes: 'pageparam,global'};
                }
                $scope.$watch('$ctrl.paramsJson', function (newVal, oldVal) {
                    // Stop $watch $ctrl.params for now
                    changeFromJson = true;
                    var params;
                    if (angular.isObject(newVal)) {
                        params = newVal;
                    } else {
                        try {
                            params = JSON.parse(newVal || '{}');
                        } catch (err) {
                            console.error('Failed parsing params JSON `' + newVal + '` due to ' + err.message);
                        }
                    }
                    that.params = [];
                    Object.keys(params).forEach(function (name) {
                        that.params.push({name: name, value: params[name]});
                    });
                    // Resume $watch
                    changeFromJson = false;
                });
                $scope.$watch('$ctrl.params', function (newVal, oldVal) {
                    if (changeFromJson)
                        return;
                    var obj = {};
                    var params = newVal;
                    params.forEach(function (param) {
                        obj[param.name] = param.value;
                    });
                    that.paramsJson = JSON.stringify(obj);
                }, true);
            }]
    });
})();
