(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaHasRole', hasRole);

    hasRole.$inject = ['currentUser', 'uaaService'];

    function hasRole(currentUser, uaaService) {
        return {
            restrict: 'A',
            link: linkFunc
        };

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var role = attrs.uaaHasRole.replace(/\s+/g, '');

            var isDenyDisable = element.attr("uaa-deny-disable") !== undefined;
            var setVisible = function () {
                    if (isDenyDisable) {
                        element.removeAttr("disabled");
                    } else {
                        element.removeClass('hidden');
                    }
                },
                setHidden = function () {
                    if (isDenyDisable) {
                        element.attr("disabled", "disabled");
                    } else {
                        element.addClass('hidden');
                    }
                },
                defineVisibility = function (reset) {

                    if (reset) {
                        setVisible();
                    }

                    if (currentUser.hasRole(role)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (role.length > 0) {
                defineVisibility(true);

                scope.$watch(function () {
                    return currentUser.isAuthenticated;
                }, function () {
                    defineVisibility(true);
                });
            }
        }
    }
})();
