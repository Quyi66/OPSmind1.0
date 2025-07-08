(function () {
    'use strict';
    //TODO: duplicate with udpWidgetConfigChartMetrics?
    angular.module('oplus.udp').component('udpWidgetConfigChartAxes', {
        templateUrl: 'app/modules/udp/widgets/widget-config-chart-axes.html',
        bindings: {
            model: '=theModel',
            props: '=uwProps',
            fields: '<'
        },
        controller: ['$translate', WidgetConfigChartAxesCtrl]
    });

    function WidgetConfigChartAxesCtrl($translate) {
        var ctrl = this;
        this.styles = {
            lineTypes: [{name: 'solid', label: $translate.instant('udp.w.echart.line.type_solid')},
                {name: 'dashed', label: $translate.instant('udp.w.echart.line.type_dashed')},
                {name: 'dotted', label: $translate.instant('udp.w.echart.line.type_dotted')}]
        };
        ctrl.yaxes = [{index: 0, key: 'left', title: $translate.instant('udp.w.echart.axis.left_y')}, {index: 1, key: 'right', title: $translate.instant('udp.w.echart.axis.right_y')}];
        ctrl.selectYAxis = selectYAxis;
        ctrl.addYAxis = addYAxis;
        ctrl.removeYAxis = removeYAxis;
        ctrl.props.yAxes2 = ctrl.props.yAxes2 || [];

        if (ctrl.props.yAxes2.length === 0) {
            addYAxis();
        } else {
            selectYAxis(0);
        }
        // $scope.$watch('uwProps.display.yaxes', function (newVal, oldVal) {
        //
        // });

        function selectYAxis(index) {
            ctrl.currentYaxesIndex = index;
            ctrl.currentYaxis = ctrl.props.yAxes2[ctrl.currentYaxesIndex];
        }

        function addYAxis() {
            ctrl.props.yAxes2.push({});
            selectYAxis(ctrl.props.yAxes2.length - 1);
        }

        function removeYAxis(index) {
            ctrl.props.yAxes2.splice(index, 1);
            selectYAxis(index > 0 ? index - 1 : ctrl.props.yAxes2.length - 1);
        }
    }
})();