/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/19/2017
 */
(function () {
    'use strict';
    angular.module('oplus.udp').directive('udpExpandableEditor', ['$uibModal', '$timeout', expandableEditor]);

    function expandableEditor($uibModal, $timeout) {
        return {
            restrict: 'A',
            scope: {
                model: '=udpExpandableEditor'
            },
            link: function (scope, elem, attrs) {
                var instance;
                elem.on('click', function () {
                    instance = $uibModal.open({
                        templateUrl: 'app/modules/udp/helper/expandable-editor.html',
                        resolve: {
                            model: function () {
                                return scope.model;
                            }
                        },
                        controller: ['$scope', 'model', function ($scope, model) {
                            $scope.model = model;
                            $scope.cancel = function () {
                                instance.dismiss();
                            };
                            $scope.submit = function () {
                                instance.close($scope.model);
                            };
                        }]
                    });
                    instance.result.then(function (value) {
                        scope.model = value;
                    });
                    instance.rendered.then(function () {
                        $('.modal-dialog').eq(0)
                            .draggable({handle: '.modal-header:eq(0)'});
                    });
                });
                scope.$on('$destroy', function () {
                    elem.off('click');
                });
            }
        };
    }
})();
