/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/23/2017
 */
(function () {
    'use strict';

    angular.module('oplus.uaa').service('permissionResolver', permissionResolver);

    permissionResolver.$inject = [];

    /**
     * @ngdoc
     * @name permissionResolver
     */
    function permissionResolver() {
        var permissions = [];
        this.hasPermission = hasPermission;
        this.setPermissions = setPermissions;

        function resolvePermissions(permissionsStringArray) {
            permissions.length = 0;
            for (var i = 0; i < permissionsStringArray.length; ++i) {
                var permission = new WildcardPermission(permissionsStringArray[i]);
                permissions.push(permission);
            }
        }

        /**
         *
         * @param {string[]} permissionsStringArray
         */
        function setPermissions(permissionsStringArray) {
            resolvePermissions(permissionsStringArray);
        }

        /**
         *
         * @param {string} permissionString String in shiro format of "domain:action:target"
         * @returns {boolean}
         */
        function hasPermission(permissionString) {
            if (!permissionString) {
                return false;
            }
            var permission = new WildcardPermission(permissionString);
            for (var i = 0; i < permissions.length; ++i) {
                if (permissions[i].implies(permission)) {
                    return true;
                }
            }
            return false;
        }
    }

    function toParts(permissionString) {
        var parts = [];
        var levels = permissionString.split(':');

        for (var i = 0; i < levels.length; ++i) {
            parts.push(levels[i].split(','));
        }
        return parts;
    }

    function containsAll(source, vals) {
        for (var i = 0; i < vals.length; ++i) {
            if (source.indexOf(vals[i]) === -1) {
                return false;
            }
        }
        return true;
    }


    function WildcardPermission(permissionString) {
        var parts = toParts(permissionString);
        this.asParts = function () {
            return parts;
        };
        this.implies = function (other) {
            var i;
            for (i = 0; i < other.asParts().length; ++i) {
                if (parts.length - 1 < i) {
                    return true;
                } else {

                    if (parts[i].indexOf('*') === -1 && !containsAll(parts[i], other.asParts()[i])) {
                        return false;
                    }
                }
            }

            for (; i < parts.length; ++i) {
                if (parts[i].indexOf('*') === -1) {
                    return false;
                }
            }
            return true;
        };
    }
})();
