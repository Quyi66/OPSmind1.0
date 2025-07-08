(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaDataHasPermission', hasPermission);

    hasPermission.$inject = ['$compile', 'currentUser', 'uaaService'];

    function hasPermission($compile, currentUser, uaaService) {
        var directive = {
            restrict: 'A',
            scope: {
                uaaDataHasPermission: '@'
            },
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var permissionObj, isDenyDisable, denyMessage,
                totalPermissions = [];


            var init = function () {
                    var permissionStr = attrs.uaaDataHasPermission.replace(/\s+/g, '');
                    isDenyDisable = element.attr("uaa-deny-disable") != undefined;
                    denyMessage = element.attr("uaa-deny-message");
                    if (permissionStr) {
                        permissionObj = JSON.parse(permissionStr);

                        //total can be empty if the permission not ready before directive compile
                        if (permissionObj.total) {
                            totalPermissions = permissionObj.total.split(",");
                        }
                    } else {
                        console.log("Value of attribute uaa-data-has-permission should not be empty.");
                    }
                },
                setVisible = function () {
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
                    var message = denyMessage.length > 0 ? denyMessage : "User not has data permission " + permissionObj.target + "!";
                    element.after($compile("<h3 class='uaa-data-has-permission-message text-center'>" + message + "</h3>"))(scope);
                },
                removeMessage = function () {
                    element.siblings(".uaa-data-has-permission-message").remove();
                },
                defineVisibility = function (reset) {
                    if (reset) {
                        setVisible();
                    }

                    if (_.includes(totalPermissions, permissionObj.target)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            init();
            if (permissionObj != undefined) {
                defineVisibility(true);

                scope.$watch(function () {
                    return currentUser.isAuthenticated;
                }, function () {
                    defineVisibility(true);
                });


                //support permission data not ready before directive compile
                if (totalPermissions.length === 0) {
                    // console.log("Start watch");
                    scope.$watch(function () {
                        return scope.uaaDataHasPermission;
                    }, function () {
                        init();
                        defineVisibility(true);
                    });
                }
            }
        }
    }
})();
