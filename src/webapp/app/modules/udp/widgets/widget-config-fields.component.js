/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/20/2017
 */

(function () {
    'use strict';

    /**
     * @ngdoc
     * @description
     * @usage
     * ```html
     * <udp-widget-config-fields props="string" dataset-fields="string" options="string" />
     * ```
     * @param {string} ngModel Assignable angular expression to data-bind widget field setting to
     * @param {string} datasetFields Fields of current selected dataset in format of [{name:string, type:string}]
     * @param {string} options {fieldDefs:[{name:string,title:string}]}
     */
    angular.module('oplus.udp').component('udpWidgetConfigFields', {
        templateUrl: 'app/modules/udp/widgets/widget-config-fields.html',
        bindings: {
            datasetFields: '=',
            options: '<',
            props: '='
        },
        controller: ['$scope', '$attrs', WidgetFieldsConfigCtrl]
    });

    function WidgetFieldsConfigCtrl($scope, $attrs) {
        if (!$attrs['datasetFields'] || !$attrs['props']) {
            throw new Error('Attribute "dataset-fields" and "props" are required for directive <udp-widget-config-dataset>');
        }
    }
})();
