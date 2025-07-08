/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */

(function () {
    'use strict';

    angular.module('oplus.udp').service('widgetFactory', widgetFactory);
    widgetFactory.$inject = ['devel'];

    /**
     * @ngdoc
     * @name widgetFactory
     * @description
     * This is not angular factory.
     * It is a factory (or registry) to define (create) and lookup (find) widgets.
     * @param {devel} devel
     */
    function widgetFactory(devel) {
        var registry = [],
            typeNames = {},
            disabledWidgets = [];
        if (window.$oplus.appConfig.modules.udp) {
            disabledWidgets = window.$oplus.appConfig.modules.udp.noWidgets || [];
        }
        this.defineWidget = defineWidget;
        this.getWidgetsByGroup = getWidgetsByGroup;
        this.lookupWidgetDef = lookupWidgetDef;
        this.findEventWidgets = findEventWidgets;

        /**
         * Find all widget definitions that can generate event.
         * @return {[{type:string,eventProperty:string}]} Widget type and event property
         * @deprecated This function does not recognize all events
         */
        function findEventWidgets() {
            var eventWidgetDefs = _.filter(registry, function (widgetDef) {
                return !!widgetDef.eventProperty;
            });
            return _.map(eventWidgetDefs, function (widgetDef) {
                return {type: widgetDef.type, eventProperty: widgetDef.eventProperty};
            });
        }

        /**
         * Get widget definitions by group
         * @param group
         * @returns {Array}
         */
        function getWidgetsByGroup(group) {
            var isDevMode = devel.isClientInDevMode();
            return registry.filter(function (w) {
                return w.group === group && (w.tag !== 'deprecated') && (isDevMode ? true : w.tag !== 'dev');
            });
        }

        /**
         * Define a new widget type in registry.
         *
             * @param {object} def - Widget definition
             * @param {string} def.type - Unique widget type
             * @param {string} def.name - Display name for this widget type
             * @param {string} def.version - Version number
             * @param {string} def.group - Widget group
             * @param {string=} def.desc - Widget description
             * @param {string=} def.tag - Tag string, if tag is `dev`, only available in development mode {@link devel.isClientInDevMode}
             * @param {string=} def.resizable - If this widget allows resizing. Comma separated `h` for height, `w` for width.
             * @param {string=} def.resizeSelector
             * @param {string} def.eventProperty - If not empty, the widget is able to generate event. The property is where the page to find the event name.
             * @param {string=} def.configHtmlFile - File for widget config html
             * @param {string|function} def.configController - Angular controller name or a function with parameter `scope` and `props`
             * @param {object} def.controlRenderer - Template to build widget HTML content
             * @param {function} def.controlRenderer.getTemplateForCompilation - {function(props)} A function returns widget skeleton HTML code, parameter is widget props.
             * @param {function} def.controlRenderer.getConfig - {function(props)=} A function returns widget d-inline-block configuration HTML code, parameter is widget props.
             * @param {function} def.controlRenderer.onInitControl - {function(scope,element,props)=} A function renders widget dynamic behavior with parameter is element, widget props.
             * @param {function} def.controlRenderer.onReloadData - {function(element,scope)} A function to reload widget data with parameter element.
             * @param {function<jQuery,object,object>} def.controlRenderer.makePrintable - A function returns jquery DOM for printable display of this widget.
         * [jQuery] makePrintable([element)
         * `element` - jQuery element for widget
         * @param {function} def.cleanupForSave - A function returns jquery DOM for saving this widget
         */
        function defineWidget(def) {
            var type = def.type;
            if (disabledWidgets.indexOf(type) >= 0) {
                return;
            }
            var w = _.find(registry, {type: type});
            if (w) {
                console.warn('Widget type "%s" registered already', type);
            } else {
                registry.push(def);
                typeNames[def.type] = def.name;
            }
        }

        /**
         * Find widget definition.
         * @param {String} type - Widget type
         * @return {object} [Widget definition]{@link defineWidget}
         * @throws If widget type is not defined
         */
        function lookupWidgetDef(type) {
            var w = _.find(registry, {type: type});
            if (!w) {
                throw new Error('Widget type "' + type + '" is not registered. Registered widgets are [' + _.map(registry, 'type') + '].');
            }
            return w;
        }
    }
})();
