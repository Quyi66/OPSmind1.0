/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/2/24, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opErrorMessage
     * @description
     * ```html
     * ```
     */
    angular.module('oplus.commons').component('opErrorMessage', {
        bindings: {
            message:'<'
        },
        templateUrl: 'app/modules/....html',
        controller: ['$scope', '$element', opErrorMessageCtrl]
    });

    function opErrorMessageCtrl($scope, $element) {
        //TODO
        // $element.html('<div></div>');
    }
})();
