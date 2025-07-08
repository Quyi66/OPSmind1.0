/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/15/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name  udpDsfieldSelector
     * @description
     * Select dataset field.
     * @usage
     * ```html
     * <udp-dsfield-selector the-model="object" fields="array" options="object"/>
     * ```
     *
     * @param {object|string} theModel Two-way binding. If `options.disableConverter` is true, the model value is a string of field name.
     * @param {string} theModel.field Field name.
     * @param {string} theModel.convertFn A dataEx expression
     * @param {[{name:string, type:string}]} fields List of available fields.
     * @param {object} options
     * @param {boolean} options.disableConverter True to disable converter. Default is false.
     * @param {boolean} options.converter Converter config options, see options in {@link udpDataConverter}
     */
    var udpDsfieldSelectorComponent = {
        templateUrl: 'app/modules/udp/widgets/dsfield-selector.html',
        bindings: {
            theModel: '=',
            fields: '<',
            options: '<'
        },
        controller: ['$scope', function (scope) {
            var defaultOpts = {converter: {kinds: 'js,str', varTypes: 'field'}};
            var that = this;
            this.options = _.merge({}, defaultOpts, this.options);
            // var valueToWatch = this.disableConverter ? '$ctrl.theModel' : '$ctrl.theModel.field';
            // scope.$watch('$ctrl.modelField', function (newVal, oldVal) {
            //     if (newVal===oldVal) return;
            //     if (that.options.disableConverter){
            //        that.theModel=newVal;
            //     }else{
            //         that.theModel.field=newVal;
            //     }
            // });
            // scope.$watch(valueToWatch, function (newVal, oldVal) {
            // var field = _.find(that.fields, {name: newVal});
            // if (field && field.alias) {
            //     that.theModel.alias = field.alias;
            // }
            // if (field && field.type !== 'string') {
            //     that.theModel.type = field.type;
            // } else {
            //     // When remove a field, theModel becomes undefined
            //     if (that.theModel)
            //         delete that.theModel.type;
            // }
            // });
        }]
    };
    angular.module('oplus.udp').component('udpDsfieldSelector', udpDsfieldSelectorComponent);
})();
