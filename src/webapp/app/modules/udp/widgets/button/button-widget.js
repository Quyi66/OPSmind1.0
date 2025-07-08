/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/13/2017
 */
(function () {
    'use strict';

    var app = angular.module('oplus.udp');

    app.run(['widgetFactory', 'widgetInteraction', 'widgetUiHelper', 'widgetSecurity', buttonWidget]);

    /**
     *
     * @param widgetFactory {widgetFactory}
     * @param widgetInteraction {widgetInteraction}
     * @param {widgetUiHelper} widgetUiHelper
     * @param {widgetSecurity} widgetSecurity
     */
    function buttonWidget(widgetFactory, widgetInteraction, widgetUiHelper, widgetSecurity) {
        widgetFactory.defineWidget({
            type: 'button',
            group: 'control',
            widthMode: 'wm-inline',
            eventProperty: 'interaction.event',
            configController: ButtonWidgetConfigCtrl,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl
            }
        });

        function ButtonWidgetConfigCtrl(scope, props) {
            upgradeWidgetProps(props);
        }

        function upgradeWidgetProps(props) {
            // upgrade_20180608();
            widgetInteraction.upgradeWidgetProps(props);

            // function upgrade_20180608() {
            //     props.display = props.display || {};
            //     if (props.display.css) {
            //         props.display.color = props.display.css;
            //         delete props.display.css;
            //     }
            //     if (props.label) {
            //         props.display.label = props.label;
            //         props.display.icon = props.icon;
            //         delete props.label;
            //         delete props.icon;
            //     }
            // }
        }


        /**
         *
         * @param {object} props Widget properties
         * @param {object} props.display Display options
         * @param {object} props.interaction Interaction config
         * @param {object} props.statecontrol State control config
         * @returns {string} HTML
         */
        function getTemplateForCompilation(props) {
            upgradeWidgetProps(props);
            var display = props.display || {};
            var button = widgetUiHelper.buildButton(display);
            if (props.statecontrol) {
                var value = JSON.stringify(props.statecontrol);
                button.attr('udp-state-control', value);
            }
            // var variables = {'@': scope.$widget.$pageScope.pageParams};
            var variables = JSON.stringify({'@': '__PAGEPARAMS'});
            if (display.iconSize) {
                button.addClass('opx-btn-size-' + display.iconSize);
            }
            if (props.interaction) {
                button.attr('udp-widget-interaction', JSON.stringify(props.interaction))
                    .attr('variables', variables);
            }
            // widgetSecurity.changeAccessState(button,props.accesscontrol);
            // widgetSecurity.addUaaAttribute(button, props.accesscontrol);
            return button.prop('outerHTML');
        }

        /**
         *
         * @param scope
         * @param element
         * @param props
         * @param props.interaction
         */
        function onInitControl(scope, element, props) {
            upgradeWidgetProps(props);
            // For state control
            // TODO: move to widget.directive


        }
    }
})();
