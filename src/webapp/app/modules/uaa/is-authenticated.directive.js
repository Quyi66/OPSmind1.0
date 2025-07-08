(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaIsAuthenticated', isAuthenticated);

    isAuthenticated.$inject = ['$compile', 'currentUser', 'uaaService'];

    /**
     * @ngdoc directive
     * @name uaaIsAuthenticated
     * @param $compile
     * @param currentUser
     * @param uaaService
     * @return {{link: linkFunc, restrict: string}}
     */
    function isAuthenticated($compile, currentUser, uaaService) {
        return {
            restrict: 'A',
            link: linkFunc
        };

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }
            //TODO: change element.attr with attrs?
            var denyToDisable = angular.isDefined(element.attr("uaa-deny-disable"));
            var denyWithMessage = element.attr("uaa-deny-message");
            // determineStatus();
            scope.$watch(function () {
                return currentUser.isAuthenticated;
            }, function () {
                var isDenied = !currentUser.isAuthenticated;
                configMessageOfDenial(isDenied);
                configDisabledOfDenial(isDenied);
            });

            function configDisabledOfDenial(isDenied) {
                if (denyToDisable) {
                    if (isDenied) {
                        element.attr("disabled", "disabled");
                    } else {
                        element.removeAttr("disabled");
                    }
                } else {
                    if (isDenied) {
                        element.addClass('hidden');
                    } else {
                        element.removeClass('hidden');
                    }
                }
            }

            function configMessageOfDenial(isDenied) {
                if (!angular.isDefined(denyWithMessage)) return;
                if (isDenied) {
                    var message = denyWithMessage.length > 0 ? denyWithMessage : "User is not authenticated";
                    var el = $compile('<div class="js-uaa-denied-message text-center p-3"><i class="fa fa-ban"></i> ' + message + '</div>')(scope);
                    element.after(el);
                } else {
                    element.siblings(".js-uaa-denied-message").remove();
                }
            }
        }
    }
})();
