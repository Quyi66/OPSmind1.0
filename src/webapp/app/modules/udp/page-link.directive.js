/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/12/2017
 */
(function () {
    'use strict';
    /**
     * @ngdoc
     *
     * @usage
     * <ANY udp-page-link="string"></ANY>
     *
     * @param udpPageLink {{pageId:string, params:object, target:string}}
     *
     * @description
     * To open page
     */
    angular.module('oplus.udp').directive('udpPageLink', pageLink);

    pageLink.$inject = ['widgetInteraction'];

    /**
     *
     * @param widgetInteraction {widgetInteraction}
     */
    function pageLink(widgetInteraction) {
        return {
            restrict: 'A',
            scope: {
                udpPageLink: '<'
            },
            link: function (scope, elem, attrs) {
                var config = scope.udpPageLink;
                elem.on('click.pagelink', function (e) {
                    // console.log('click.pagelink', config);
                    // var pageId = config.pageId, params = config.params, target = config.target;
                    // console.log('pageLink', typeof config, pageId);
                    widgetInteraction.openPage(config, {}, {current: e.currentTarget});
                    e.preventDefault();
                });
                scope.$on('$destroy', function () {
                    elem.off('click.pagelink');
                })
            }
        }
    }
})();
