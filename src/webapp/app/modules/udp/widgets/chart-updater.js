(function () {
    'use strict';
    angular.module('oplus.udp').service('chartUpdater', chartUpdater);
    chartUpdater.$inject = ['widgetInteraction'];

    /**
     * @ngdoc
     * @name chartUpdater
     * @param {widgetInteraction} widgetInteraction
     */
    function chartUpdater(widgetInteraction) {
        this.upgradeProps = upgradeProps;

        function upgradeProps(props) {
            if (!props) {
                return;
            }
            widgetInteraction.upgradeWidgetProps(props);
            props.display = props.display || {};
            renameLabelToLegend();
            useAxesDefinition();

            function renameLabelToLegend() {
                var yAxes = props.yAxes || [];
                yAxes.forEach(function (yaxis) {
                    // Rename label to legend
                    if (!yaxis.legend && yaxis.label) {
                        yaxis.legend = yaxis.label;
                        delete yaxis.label;
                    }
                });
            }

            function useAxesDefinition() {
                var yAxes = props.yAxes || [];
                props.display.yaxes = props.display.yaxes || [];
                if (props.display.yaxes.length === 0) {
                    // Before 20180317, only two y-axis supported and defined with `position` in props.yAxes[]
                    // Now y-axes are defined in `props.display.yaxes` and yAxes refer to axis index with `axisIndex`
                    yAxes.forEach(function (yaxis) {
                        var index;
                        if (yaxis.position === 'right') {
                            index = _.findIndex(props.display.yaxes, {position: 'right'});
                            if (index < 0) {
                                props.display.yaxes.push({position: 'right', label: ''});
                                index = props.display.yaxes.length - 1;
                            }
                        } else {
                            index = _.findIndex(props.display.yaxes, {position: 'left'});
                            if (index < 0) {
                                props.display.yaxes.push({position: 'left', label: ''});
                                index = props.display.yaxes.length - 1;
                            }
                        }
                        delete yaxis.position;
                        // No need saving 0 index for simplicity
                        if (index > 0)
                            yaxis.axisIndex = index;
                    });
                }
            }
        }
    }
})();