/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/30/2017
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpDataConverter
     * @description
     * A data converter combo input
     *
     * ```html
     * <udp-data-converter the-model="string"
     *                     options="{kinds:string,varTypes:string}"
     *                     disabled="boolean"/>
     *
     * @param {string} theModel Two-way binding of conversion expression
     * @param {object} options
     * @param {string=} options.kinds  Allowed kinds separated by comma, like `js,yaml,str,link`
     * @param {string=} options.varTypes Supported variable types separated by comma, like `field,pageparam,global`.
     * ```
     * @see {@link dataEx.kinds}
     */
    angular.module('oplus.udp').component('udpDataConverter', {
        templateUrl: 'app/modules/udp/helper/data-converter.html',
        bindings: {
            theModel: '=',
            options: '<',
            disabled: '<'
        },
        controller: ['$scope', '$translate', 'modalHelper', 'dataEx', DataConverterInputCtrl]
    });

    /**
     *
     * @param $scope
     * @param $translate
     * @param {modalHelper} modalHelper
     * @param {dataEx} dataEx
     * @constructor
     */
    function DataConverterInputCtrl($scope, $translate, modalHelper, dataEx) {
        var that = this;
        this.kindDefs = _.keyBy(dataEx.kindDefs, 'value');
        Object.keys(this.kindDefs).forEach(function (kind) {
            that.kindDefs[kind].label = $translate.instant('udp.dataex.type.' + kind);
        });
        this.showBuilder = showBuilder;
        this.remove = remove;
        $scope.$watch('$ctrl.theModel', function (newVal) {
            that.meta = dataEx.getExprMeta(newVal);
        });

        function remove() {
            that.theModel = undefined;
        }

        function showBuilder() {
            modalHelper.openModal({
                templateUrl: 'app/modules/udp/helper/data-converter-config-modal.html',
                backdrop: 'static',//disables modal closing by click on the backdrop
                resolve: {
                    convertFn: function () {
                        return that.theModel;
                    }
                },
                size: 'lg',
                scope: $scope,
                controller: 'DataConverterConfigCtrl',
                // controller: ['$scope', 'messageService', 'modalHelperInstance', 'dataEx', 'customFunctions', 'convertFn', DataConverterConfigCtrl],
                controllerAs: 'vm'
            }, {
                onOk: function (value) {
                    that.theModel = value;
                }
            });
        }
    }
})();
