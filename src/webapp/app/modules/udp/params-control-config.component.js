/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/12/2017
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @description
     * Configure controls for parameters input. Use cases like dataset parameters, job parameters.
     * ```
     * <udp-params-control-config the-model="[]" params-config="{}" options="{}"/>
     * ```
     * @attr {{param_name:{defaultValue:string,format:string,required:boolean,desc:string}}} paramConfig Specifications of parameter definition
     * @attr {[{name:string, label:string, control:string,initval:string,source:string,desc:string}]} theModel Two-way data-bind to parameters configuration
     * @attr {object=} options
     * @attr {boolean=} options.labelByDefault If show label by default
     */
    angular.module('oplus.udp').component('udpParamsControlConfig', {
        templateUrl: 'app/modules/udp/params-control-config.html',
        bindings: {
            theModel: '=',
            paramsConfig: '<',
            options: '<'
        },
        controller: ['$scope', '$attrs', '$translate', ParamsControlConfigCtrl]
    });

    /**
     * @param $scope
     * @param $attrs
     * @constructor
     */
    function ParamsControlConfigCtrl($scope, $attrs, $translate) {
        if (!$attrs['theModel']) {
            throw new Error('Attribute "the-model" required for directive <udp-params-control-config>');
        }
        var that = this;
        var options = {
            labelByDefault: false
        };

        // this.$onInit = function () {
        _.extend(options, this.options);
        var required = $translate.instant('common.term.required');

        $scope.$watch('$ctrl.paramsConfig', function (newVal, oldVal) {
            if (newVal === oldVal) return;
            var paramsConfig = newVal;
            if (paramsConfig) {
                Object.keys(paramsConfig).forEach(function (name) {
                    var param = paramsConfig[name];
                    param.$title = (param.required ? '(' + required + ') ' : '') +
                        (param.label ? '[' + param.label + '] ' : '') +
                        (param.desc || '');
                });
            }
            paramsConfigToModel(newVal);
        }, true);

        // };

        /**
         * Sync values from parameter specification to model.
         * @param {{param_name:{defaultValue:string,format:string}}} paramsConfig Parameter specification
         */
        function paramsConfigToModel(paramsConfig) {
            that.theModel = that.theModel || [];
            // ctrl.paramsHelper = {};
            var names = Object.keys(paramsConfig);
            // Init params helper and values from spec
            names.forEach(function (name) {
                var spec = paramsConfig[name];
                var model = _.find(that.theModel, {name: name});
                if (!model) {
                    model = {name: name};
                    if (options.labelByDefault) {
                        model.showlabel = true;
                        model.label = spec.label || name;
                        if (spec.desc)
                            model.desc = spec.desc
                    }
                    that.theModel.push(model);
                }
                model.initval = model.initval || spec.defaultValue;
                model.format = model.format || spec.type;
                // ctrl.paramsHelper[name] = {required: config.required, desc: config.desc};
                if (!that.current) {
                    that.current = model;
                }
            });
            // Remove parameters not defined in spec
            _.remove(that.theModel, function (o) {
                return names.indexOf(o.name) < 0;
            });
        }
    }
})();
