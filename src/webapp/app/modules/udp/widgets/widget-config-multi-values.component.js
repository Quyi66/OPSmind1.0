/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/28/2018
 */
(function () {
    /**
     * @ngdoc component
     * @name udpWidgetConfigMultiValues
     * @description
     * Config repeat metrics.
     */
    angular.module('oplus.udp').component('udpWidgetConfigMultiValues', {
        templateUrl: 'app/modules/udp/widgets/widget-config-multi-values.html',
        bindings: {
            theModel: '=',
            options: '<',
            fields: '<'
        },
        controller: ['themeService', WidgetConfigRepeatMetricsCtrl]
    });

    /**
     *
     * @param {themeService} themeService
     */
    function WidgetConfigRepeatMetricsCtrl(themeService) {
        var that = this;
        this.current = {index: -1, item: undefined};
        this.addMetric = addMetric;
        this.removeMetric = removeMetric;
        this.selectMetric = selectMetric;
        this.theModel = this.theModel || [];
        if (this.theModel.length === 0) {
            addMetric();
        } else {
            selectMetric(0);
        }

        function selectMetric(index) {
            that.current.index = index;
            that.current.item = that.theModel[that.current.index];
        }

        function addMetric() {
            that.theModel.push({});
            selectMetric(that.theModel.length - 1);
        }

        function removeMetric(index) {
            that.theModel.splice(index, 1);
            selectMetric(index > 0 ? index - 1 : that.theModel.length - 1);
        }
    }
})();
