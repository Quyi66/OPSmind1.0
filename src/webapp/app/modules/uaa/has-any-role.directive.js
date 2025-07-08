(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaHasAnyRole', hasAnyRole);

    hasAnyRole.$inject = ['currentUser', 'uaaService'];

    function hasAnyRole(currentUser, uaaService) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var roles = attrs.uaaHasAnyRole.replace(/\s+/g, '').split(',');

            var isDenyDisable = element.attr("uaa-deny-disable") != undefined;
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

                    if (currentUser.hasAnyRole(roles)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (roles.length > 0) {
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
