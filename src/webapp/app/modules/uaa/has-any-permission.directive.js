(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaHasAnyPermission', hasAnyPermission);

    hasAnyPermission.$inject = ['$compile','currentUser', 'uaaService'];

    function hasAnyPermission($compile,currentUser, uaaService) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var permissions = attrs.uaaHasAnyPermission.replace(/\s+/g, '').split(',');

            var isDenyDisable = element.attr("uaa-deny-disable") != undefined;
            var denyMessage = element.attr("uaa-deny-message");
            var setVisible = function () {
                    if (denyMessage != undefined) {
                        removeMessage();
                    }

                    if (isDenyDisable) {
                        element.removeAttr("disabled");
                    } else {
                        element.removeClass('hidden');
                    }

                },
                setHidden = function () {
                    if (denyMessage != undefined) {
                        showMessage(denyMessage);
                    }

                    if (isDenyDisable) {
                        element.attr("disabled", "disabled");
                    } else {
                        element.addClass('hidden');
                    }
                },
                showMessage = function () {
                    var message = denyMessage.length > 0 ? denyMessage : "User not has permissions " + permissions + "!";
                    element.after($compile("<h3 class='uaa-has-any-permission-message text-center'>" + message + "</h3>")(scope));
                },
                removeMessage = function () {
                    element.siblings(".uaa-has-any-permission-message").remove();
                },
                defineVisibility = function (reset) {
                    if (reset) {
                        setVisible();
                    }

                    if (currentUser.hasAnyPermission(permissions)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (permissions.length > 0) {
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
