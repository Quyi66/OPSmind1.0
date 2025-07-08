/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/11/07
 */

(function () {
    'use strict';
    bootstrapDropdownEx();

    function bootstrapDropdownEx() {
        avoidCloseOnClickInside();
        dropdownAppendToBody();
        triggerByHover();

        /**
         * Hover to trigger bootstrap dropdown
         */
        function triggerByHover() {
            var $body = $('body');
            var timer;
            $body.on('mouseenter', '.dropdown.op-hover-dropdown .dropdown-toggle', function (e) {
                var elem = $(this);
                // Add delay to detect user intent
                //https://stackoverflow.com/questions/14818438/delay-javascript-hover-action
                timer = setTimeout(function () {
                    var dropdown = elem.closest('.dropdown');
                    dropdown.addClass('open');
                    tryAppendDropdownToBody(dropdown);
                }, 300);
            }).on('mouseleave', '.dropdown.op-hover-dropdown', function (e) {
                var dropdown = $(this).closest('.dropdown');
                if (timer)
                    clearTimeout(timer);
                dropdown.removeClass('open');
                tryRestoreDropdownFromBody(dropdown);
            }).on('click.bs.dropdown', '.op-hover-dropdown .op-dropdown-item', function (e) {
                var dropdown = $(this).closest('.dropdown');
                dropdown.removeClass('open');
                tryRestoreDropdownFromBody(dropdown);
            });
        }


        /**
         * Don't close bootstrap dropdown when click inside. The dropdown menu shall be marked `.js-inside-click` class.
         * https://stackoverflow.com/questions/25089297/avoid-dropdown-menu-close-on-click-inside/25196101#25196101
         */
        function avoidCloseOnClickInside() {
            $('body').on("click.bs.dropdown", '.dropdown-menu.js-inside-click', function (e) {
                var elem = $(e.target);
                var needClose = elem.closest('.js-dropdown-click-to-close').length > 0;
                if (needClose) {
                    // Do default
                } else {
                    e.stopPropagation();
                }
            });
        }

        function tryAppendDropdownToBody(dropdown) {
            var menu = dropdown.find('.dropdown-menu.op-append-to-body');
            if (menu.length === 0) {
                return;
            }

            // detach it and append it to the body
            $('body').append(menu.detach());

            // grab the new offset position
            var eOffset = dropdown.offset();
            // make sure to place it where it would normally go (this could be improved)
            menu.css({
                'z-index': '9999999',
                'display': 'block',
                'top': eOffset.top + dropdown.outerHeight(),
                'left': eOffset.left
            });
            dropdown.data('menu', menu);
        }

        function tryRestoreDropdownFromBody(dropdown) {
            var menu = dropdown.data('menu');
            if (menu) {
                dropdown.append(menu.detach());
                menu.hide();
            }
        }

        /**
         * Append dropdown to body
         * https://stackoverflow.com/questions/31029300/how-to-append-a-single-dropdown-menu-to-body-in-bootstrap
         */
        function dropdownAppendToBody() {
            var $body = $('body');
            $body.on('show.bs.dropdown', function (e) {
                var dropdown = $(e.target);
                tryAppendDropdownToBody(dropdown);
            });

            // and when you hide it, reattach the drop down, and hide it normally
            $body.on('hide.bs.dropdown', function (e) {
                var dropdown = $(e.target);
                tryRestoreDropdownFromBody(dropdown);
            });
        }
    }
})();