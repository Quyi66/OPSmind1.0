(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .directive('showValidation', showValidation);

    function showValidation () {
        return {
            restrict: 'A',
            require: 'form',
            link: linkFunc
        };

        function linkFunc (scope, element, attrs, formCtrl) {
            element.find('.form-group').each(function() {
                var $formGroup = angular.element(this);
                var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

                if ($inputs.length > 0) {
                    $inputs.each(function() {
                        var $input = angular.element(this);
                        var inputName = $input.attr('name');
                        scope.$watch(function() {
                            return formCtrl[inputName].$invalid && formCtrl[inputName].$dirty;
                        }, function(isInvalid) {
                            $formGroup.toggleClass('has-error', isInvalid);
                        });
                    });
                }
            });
        }
    }
})();
