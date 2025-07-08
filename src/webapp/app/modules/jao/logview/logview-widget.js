/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/02/21
 */
(function () {
    angular.module('oplus.jao').run(['widgetFactory', 'widgetDataUtil', 'widgetUiHelper', 'messageService', 'jaoJobService', 'modalHelper', '$translate', 'pageDataUtil', 'dataEx', logviewWidget]);
    var LOG_TYPE_JOB_RESULT = 'job_result';

    /**
     * Widget to view log. Now support job result log.
     *
     * @param {widgetFactory} widgetFactory
     * @param {widgetDataUtil} widgetDataUtil
     * @param {widgetUiHelper} widgetUiHelper
     * @param {messageService} messageService
     * @param {jaoJobService} jaoJobService
     * @param {modalHelper} modalHelper
     * @param $translate
     * @param {pageDataUtil} pageDataUtil
     */
    function logviewWidget(widgetFactory, widgetDataUtil, widgetUiHelper, messageService, jaoJobService, modalHelper, $translate, pageDataUtil, dataEx) {
        widgetFactory.defineWidget({
            type: 'logview',
            name: $translate.instant('jao.log.view'),
            desc: $translate.instant('jao.log.desc'),
            group: 'control',
            // widthMode: 'w-inline',
            configHtmlFile: 'app/modules/jao/logview/logview-widget-config.html',
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onReloadData: onReloadData,
                onInitControl: onInitControl
            }
        });

        function onReloadData(scope, element, props) {
            scope.runId = widgetDataUtil.getWidgetParamValues(element)['runId'];
            if(!scope.runId){
                scope.runId = scope.$widget.$pageScope.pageParams.runId;
            }
            scope.jobId = props.jobId;
            scope.pageParams = {job_id: props.jobId};
            var dataset = props.dataset || {};
            if (dataset.source === 'opslog') {
                // console.log('opslog',dataset.opslog.action_column);
                scope.options = {
                    actionColumn: dataset.opslog.action_column,
                    varValues: pageDataUtil.getPageScopeValues(scope)
                };
                scope.status = evalVar(scope, dataset.opslog.filter_status);
                scope.day = evalVar(scope, dataset.opslog.filter_day);
                // Just query the current data by default
                if (!scope.day) scope.day = 1;
            }
        }

        function getViewTemplateByData(props) {
            var dataset = props.dataset || {};
            if (dataset.source === 'jaorunlist') {
                return '<udp-page-view page-id="\'/jao/assets/udp/runlogs\'" page-source="file" page-params="pageParams"></udp-page-view>';
            } else if (dataset.source === 'jaolastrun') {
                return '<jao-job-result-view job-id="jobId"/>';
            } else if (dataset.source === 'opslog') {
                var opslog = dataset.opslog || {};
                return  '<br>'
                    + '<div class="text-right">'
                    + '<span>{{"udp.w.daterange.name" | translate}}：</span>'
                    + '<select class="form-select d-inline-block w-auto" id="opsLogDate">'
                    + '<option value="all">All</option>'
                    + '<option value="1" selected>Today</option>'
                    + '<option value="7">Last 7 Days</option>'
                    + '<option value="30">Last 30 Days</option>'
                    + '<option value="365">Last Year</option>'
                    + '</select>'
                    + '</div>'
                    + '</br>'
                    + '<jao-operation-log-list with-module="\'' + (opslog.module || '') + '\'" with-action="\'' + (opslog.action || '') + '\'" with-filter-status="status" with-filter-day="day" options="options"></jao-operation-log-list>'
                    + '</div>';
                // return '<jao-operation-log-list with-module="\'' + (opslog.module || '') + '\'" with-action="\'' + (opslog.action || '') + '\'" with-filter-status="status" with-filter-day="day" options="options"></jao-operation-log-list>';
                // return '<jao-operation-log-list with-module="\'' + (opslog.module || '') + '\'" with-action="\'' + (opslog.action || '') + '\'" options="options"></jao-operation-log-list>';
            } else {
                return '<jao-job-result-view run-id="runId"/>';
            }
        }

        function evalVar(scope, initval) {
            var valueObj = pageDataUtil.getPageScopeValues(scope);
            return dataEx.evalVarExpr(initval, valueObj);
        }

        function onInitControl(scope, element, props) {
            onReloadData(scope, element, props);
            scope.openDialog = openDialog;
            var body = getViewTemplateByData(props);

            function openDialog() {
                var modal = modalHelper.openModal({
                    template: '<div class="modal-header">' +
                        '<h4 class="modal-title"></h4>' +
                        '<button type="button" class="btn-close" data-dismiss="modal" ng-click="close()"></button>' +
                        '</div>' +
                        '<div class="modal-body op-smartform">' + body +
                        '</div>',
                    controller: ['$scope', function ($scope) {
                        $scope.runId = scope.runId;
                        $scope.jobId = scope.jobId;
                        $scope.close = function () {
                            modal.dismiss();
                        }
                    }],
                    size: 'xl'
                }, {resizable: true});
            }
        }

        function getTemplateForCompilation(props) {
            var display = props.display || {viewas: 'plain', button: {}};
            if (display.viewas === 'dialog') {
                var buttonsConfig = _.assign({
                    label: $translate.instant('common.entity.action.view'),
                    color: 'btn-default'
                }, display.button);
                var $button = widgetUiHelper.buildButton(buttonsConfig, {});
                $button.attr('ng-click', 'openDialog()');
                return $button.prop('outerHTML');
            } else {
                return getViewTemplateByData(props);
            }
            return '<pre>{{log.contents|json}}</pre>';
        }
    }
})();

