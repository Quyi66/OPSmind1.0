/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-09-15
 */
(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name jaoJobRunButton
     */
    angular.module('oplus.jao').directive('jaoJobRunButton', jobRunButtonDirective);

    function jobRunButtonDirective() {
        return {
            restrict: 'A',
            replace: true,
            scope: {},
            // template: templateFactory,
            link: linkFn,
            controller: ['$scope', '$attrs', RunButtonCtrl]
        };

        function linkFn(scope, elem, attrs, ctrl) {
            var config = scope.$eval(attrs.jaoJobRunButton);
            console.log(config);

        }

        function RunButtonCtrl() {
        }
    }
})();
