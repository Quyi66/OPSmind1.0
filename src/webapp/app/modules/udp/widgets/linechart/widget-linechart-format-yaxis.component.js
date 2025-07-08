(function () {
    'use strict';
    angular.module('oplus.udp').component('udpWidgetLinechartFormatYaxis', {
        templateUrl: 'app/modules/udp/widgets/linechart/widget-linechart-format-yaxis.html',
        transclude: true,
        bindings: {
            model: '=theModel'
        },
        controller: ['messageService', '$translate', udpWidgetLinechartFormatYaxisCtrl]
    });

    /**
     *
     * @param {messageService} messageService
     * @param $translate
     * @constructor
     */
    function udpWidgetLinechartFormatYaxisCtrl(messageService, $translate) {
        var ctrl = this;

        ctrl.addRule = addRule;
        ctrl.removeRule = removeRule;
        ctrl.selectYAxis = selectYAxis;
        ctrl.selectVisualMap = selectVisualMap;
        ctrl.startZone = null;
        ctrl.endZone = null;
        ctrl.model.visualMap = ctrl.model.visualMap || [];
        // init
        selectYAxis(0);

        function addRule() {
            if (ctrl.currentPiece.gt === null || ctrl.currentPiece.lte === null || ctrl.currentPiece.color === null) {
                messageService.alertError($translate.instant('common.term.error'),$translate.instant('udp.w.echart.missing_range_or_color_error'));
                return;
            }
            ctrl.currentVisualMap.pieces.push(ctrl.currentPiece);
            ctrl.currentPiece = {};
        }

        function removeRule(index) {
            messageService.confirmWarning('', $translate.instant('udp.w.echart.remove_range_confirm'), function () {
                ctrl.currentVisualMap.pieces.splice(index, 1);
                ctrl.currentPiece = {};
            });
        }

        function selectYAxis(index) {
            ctrl.currentYaxisIndex = index;
            ctrl.model.visualMap[index] = ctrl.model.visualMap[index] || {pieces: []};
            ctrl.currentVisualMap = ctrl.model.visualMap[index];
        }

        function selectVisualMap(index) {
            ctrl.currentPiece = ctrl.currentVisualMap.pieces[index];
        }

    }
})();
