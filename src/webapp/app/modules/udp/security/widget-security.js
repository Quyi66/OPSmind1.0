/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/17/2018
 */
(function () {
    'use strict';

    angular.module('oplus.udp').service('widgetSecurity', widgetSecurity);

    widgetSecurity.$inject = ['currentUser'];

    /**
     * @ngdoc service
     * @name widgetSecurity
     * @description
     * Utilities for widget security
     * @param {currentUser} currentUser
     */
    function widgetSecurity(currentUser) {
        var BY_ROLE = 'role', BY_PERM = 'permission';
        var STATE_DISABLED = 'disabled', STATE_NOTICE = 'notice';
        this.addUaaAttribute = addUaaAttribute;
        this.changeAccessState = changeAccessState;

        /**
         * @param {boolean} enabled If access control is enabled. Do nothing if it's `false`.
         * @param {string} by Access controlled by what measure, `"role"` will add `uaa-has-any-role`
         * or `"permission"` will add `uaa-has-any-permission`
         * @param {string} allow What value is allowed to access
         * @param {string} state What state the element shall be when no access,
         * - `""` to hide the element,
         * - `"disabled"` to disable the element (only works for element supporting `disabled` attribute)
         * - `"notice"` to show an access denied message inside element
         */
        function AccessControl(enabled, by, allow, state) {
            this.enabled = enabled;
            this.by = by;
            this.allow = allow;
            this.state = state;
        }

        function getWidgetAppletCode(element) {
            var elements = document.querySelectorAll('[data-applet-code]');
            var values = [];

            for (var i = 0; i < elements.length; i++) {
                var value = elements[i].getAttribute('data-applet-code');
                values.push(value);
            }
            if (values.length > 0) {
                return values[0];
            }
            // datatable component cannot get appletCode
            return element.closest('.js-applet-content').data('appletCode');
        }

        /**
         * Change element state based on config of access control
         * @param {angular.element} element
         * @param {AccessControl} ac Config of access control
         */
        function changeAccessState(element, ac) {
            if (_.isEmpty(ac)) {
                return;
            }
            var appletCode = getWidgetAppletCode(element);
            var pass = canAccess(ac, appletCode);
            if (!pass) {
                if (ac.state === STATE_DISABLED) {
                    disableElement(element);
                } else if (ac.state === STATE_NOTICE) {
                    disableElement(element);
                    element.html('<div class="text-center"><i class="fa fa-lock"></i> {{"common.uaa.no_permission"|translate}}</div>');
                } else {
                    element.remove();
                }
            }

            return pass;

            function disableElement(element) {
                // element.attr('disabled', 'disabled').addClass('disabled');
                element.find('[udp-state-control]').removeAttr('udp-state-control');
                var removedAttrs = ['udp-widget-interaction', 'ng-click'];
                [element, element.children()].forEach(function (item) {
                    // element.children().attr('disabled','disabled').addClass('disabled');
                    item.addClass('disabled')
                        .attr('disabled', 'disabled');
                    // Remove attribute to prevent user hack by changing DOM
                    removedAttrs.forEach(function (attr) {
                        if (item.attr(attr)) {
                            item.attr(attr, 'disabled');
                        }
                    });
                });
            }
        }

        /**
         * Add UAA attribute `uaa-has-any-role` or `uaa-has-any-permission` to an element
         * based on specified access control config.
         * @param {jQuery} element Element
         * @param {AccessControl} ac Access control config. Do nothing if it's null.
         */
        function addUaaAttribute(element, ac) {
            if (!ac || !ac.enabled) return;
            if (ac.by === BY_PERM) {
                element.attr('uaa-has-any-permission', ac.allow);
            } else if (ac.by === BY_ROLE) {
                element.attr('uaa-has-any-role', ac.allow);
            }
        }

        /**
         * Can current user access
         * @param {AccessControl} ac Access control config.
         * @param {string} appletCode
         * @returns {boolean}
         */
        function canAccess(ac, appletCode) {
            if (!ac || !ac.enabled) {
                return true;
            }
            var allow = (ac.allow || '').split(',');
            if (ac.by === BY_ROLE) {
                return currentUser.hasAnyRole(allow, appletCode);
            }
            if (ac.by === BY_PERM) {
                return currentUser.hasAnyPermission(allow);
            }
            return true;
        }
    }
})();
