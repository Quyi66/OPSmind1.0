/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/02/21
 */
(function () {
    angular.module('oplus.jao').run(['$window', '$uibModal', 'widgetFactory', 'widgetUiHelper', 'jaoJobService', 'widgetInteraction', 'messageService', '$translate', jobWidget]);

    /**
     *
     * @param $window
     * @param $uibModal
     * @param {widgetFactory} widgetFactory
     * @param {widgetUiHelper} widgetUiHelper
     * @param {jaoJobService} jaoJobService
     * @param {messageService} messageService
     * @param {widgetInteraction} widgetInteraction
     * @param $translate
     */
    function jobWidget($window, $uibModal, widgetFactory, widgetUiHelper,
                       jaoJobService, widgetInteraction, messageService, $translate) {
        widgetFactory.defineWidget({
            type: 'jjob',
            name: $translate.instant('jao.common.job'),
            desc: $translate.instant('jao.job.widget.desc'),
            eventProperty: 'event',
            group: 'control',
            widthMode: 'wm-full',
            configController: JobWidgetConfigCtrl,
            configHtmlFile: 'app/modules/jao/widgets/job/job-widget-config.html',
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl
            }
        });

        function JobWidgetConfigCtrl(scope, props) {
            scope.uwProps.interaction = scope.uwProps.interaction || {};
            // if (!scope.uwProps.interaction.callId) {
            //     scope.uwProps.interaction.callId = 'NotSafeCallId' + Date.now();
            // }
        }

        function validateConfig(props) {
            return props.job && props.job.id;
        }

        /**
         *
         * @param props {*} Widget configuration properties in JSON object
         * @param props.job
         * @param props.wparams
         * @param props.display
         * @param props.display.formLayout
         * @param props.display.okButtonStyle
         * @param props.display.okButtonLabel
         * @returns {string} Widget content HTML
         */
        function getTemplateForCompilation(props) {
            if (!validateConfig(props)) {
                throw new WidgetNotConfiguredError($translate.instant('jao.job.widget.not_configured'));
            }
            var wparams = props.wparams || [],
                display = props.display || {},
                buttons = display.buttons || {};
            var $form = angular.element('<form class="op-smartform"></form>');
            if (display.formLayout) {
                $form.addClass('form-' + display.formLayout);
            }
            wparams.forEach(function (param) {
                var control = widgetUiHelper.buildParamInputControl(param.name, param);
                $form.append(control);
            });
            var buttonsConfig = _.assign({
                label: $translate.instant('jao.job.widget.start_run'),
                color: 'btn-default'
            }, buttons.ok);
            var $okButton = widgetUiHelper.buildButton(buttonsConfig, {});
            $okButton
                .addClass('js-submit')
                .attr('type', 'button')
                .attr('ng-click', 'startJob()');
            var buttonPosClasses = {
                'left': 'justify-content-left',
                'right': 'justify-content-end',
                'center': 'justify-content-center'
            };
            var $buttons = angular.element('<div class="op-form-actions d-flex align-items-center"></div>')
                .addClass(buttonPosClasses[buttons.position])
                .append($okButton);
            $form.append($buttons);
            return $form.prop('outerHTML');
        }

        function onInitControl(scope, element, props) {
            scope.jobId = (props.job || {}).id;
            scope.startJob = startJob;
            var display = props.display || {};

            function startJob(showDropdown) {
                var jobId = scope.jobId;
                if (!jobId) {
                    throw new Error('ProgramError: Cannot find job ID from widget properties');
                }
                if (showDropdown) {
                    return;
                }
                var params = scope.$widget.wParams;
                // console.log('startJob', params);
                if (widgetUiHelper.isEditMode()) {
                    messageService.alert(
                        $translate.instant('jao.job.run'),
                        $translate.instant('jao.messages.job_widget_edit_run', {
                            jobId: jobId,
                            params: JSON.stringify(params)
                        }));
                } else if (display.confirm) {
                    messageService.confirm(
                        $translate.instant('jao.job.run'),
                        display.confirmText || $translate.instant('common.messages.operation.body', {
                            operation: $translate.instant('jao.common.run'),
                            obj: $translate.instant('jao.common.job')
                        }),
                        function () {
                            doSubmit(jobId, params, props.interaction);
                        });
                } else {
                    doSubmit(jobId, params, props.interaction);
                }
            }

            /**
             *
             * @param jobId
             * @param params
             * @param interaction Interaction props
             */
            function doSubmit(jobId, params, interaction) {
                interaction = interaction || {};
                var jobInteraction = {actions: ['job'], job: jobConfig};
                var mergedInteraction = _.merge({}, interaction, {actions: []});
                mergedInteraction.actions.unshift('job');
                var jobConfig = {
                    code: jobId,
                    params: params,
                    waitJobCompletion: !!interaction.when,
                    showOutput: !!(props.intx && props.intx.showOutput),
                    postproc: {}
                };
                mergedInteraction.job = jobConfig;
                widgetInteraction.handleInteraction(scope, mergedInteraction, {}, {element: element.find('.js-submit')});
            }
        }
    }
})();
