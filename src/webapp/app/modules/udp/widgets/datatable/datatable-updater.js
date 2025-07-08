/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 3/29/2018
 */

(function () {
    'use strict';
    angular.module('oplus.udp').service('datatableWidgetUpdater', datatableWidgetUpdater);

    /**
     * @ngdoc
     * @name datatableWidgetUpdater
     */
    function datatableWidgetUpdater() {
        this.updateProps = function (props) {
            if (props.dataset) {
                if (props.dataset.hideParams) {
                    props.dataset.paramView = 'hidden';
                    delete props.dataset.hideParams;
                }
            }

            var fields = props.fields || [];
            fields.forEach(function (f) {
                if (!f['field'] && f['name']) {
                    f['field'] = f['name'];
                    delete f['name'];
                }
            });
        }
    }
})();