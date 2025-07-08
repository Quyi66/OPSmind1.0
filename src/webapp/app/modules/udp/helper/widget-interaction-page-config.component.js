/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/13/2017
 */
(function ($) {
    'use strict';
    /**
     * @param props {string}
     *
     */
    angular.module('oplus.udp').component('udpPageLinkConfig', {
        bindings: {
            props: '='
        },
        transclude: true,
        templateUrl: 'app/modules/udp/helper/widget-interaction-page-config.html',
        controller: ['$translate', WidgetInteractionPageConfigCtrl]
    });

    function WidgetInteractionPageConfigCtrl($translate) {
        var that = this;
        var flex = $translate.instant('udp.w.layout-flex.name');
        findAllTargets();

        function findAllTargets() {
            that.targets = [
                {key: '_dialog', title: ''},
                {key: '_self', title: ''},
                {key: '_blank', title: ''}
            ];
            that.targets.forEach(function (o) {
                o.title = $translate.instant('udp.wc.intx.page.target' + o.key);
            });
            $('.uw-column, .uw-float').each(function () {
                var id = $(this).attr('id');
                if (id) {
                    that.targets.push({key: '#' + id, title: flex + ' #' + id});
                }
            });
        }
    }
})(jQuery);
