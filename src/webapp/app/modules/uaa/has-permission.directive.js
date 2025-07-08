(function () {
    'use strict';
    /**
     * @ngdoc
     * @name uaaHasPermission
     */
    angular.module('oplus.uaa').directive('uaaHasPermission', hasPermission);

    hasPermission.$inject = ['$compile','currentUser', 'uaaService'];

    function hasPermission($compile,currentUser, uaaService) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var permission = attrs.uaaHasPermission.replace(/\s+/g, '');

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
                    var message = denyMessage.length > 0 ? denyMessage : "User not has permission " + permission + "!";
                    element.after($compile("<div class='uaa-has-permission-message text-center p-3'><i class='fa fa-key'></i> " + message + "</div>")(scope));

                },
                removeMessage = function () {
                    element.siblings(".uaa-has-permission-message").remove();
                },
                defineVisibility = function (reset) {
                    if (reset) {
                        setVisible();
                    }

                    if (currentUser.hasPermission(permission)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (permission.length > 0) {
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
