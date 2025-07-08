/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/1/2018
 */
(function () {
    'use strict';

    /**
     * @param props {string}
     *
     */
    angular.module('oplus.udp').component('udpWidgetInteractionJobConfig', {
        bindings: {
            props: '='
        },
        transclude: true,
        templateUrl: 'app/modules/udp/helper/widget-interaction-job-config.html',
        controller: ['$scope', function ($scope) {
            var that = this;

            that.props = angular.extend({
                evalObject: true,
            }, that.props || {})

            $scope.$watch('$ctrl.selectedJob.$paramsConfig', watchJobParamsChange, true);

            function watchJobParamsChange(newVal, oldVal) {
                if (!newVal) return;
                // console.log('watch',newVal,oldVal);
                var paramsConfig = newVal;
                that.props.params = that.props.params || {};
                // Assign default value from configuration to params properties
                var params = Object.keys(paramsConfig);
                params.forEach(function (name) {
                    if (!that.props.params[name]) {
                        that.props.params[name] = paramsConfig[name].defaultValue;
                    }
                });
                // Remove params not in params config
                that.props.params = _.pick(that.props.params, params);
            }
        }]
    });
})();
