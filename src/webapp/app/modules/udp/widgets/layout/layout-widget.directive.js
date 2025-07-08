/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/18/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @usage
     * ```
     * <div widget-layout uw-type="string" uw-props="string">
     * ```
     * @param uw-type {string} Value of `layout-row`, `layout-col`, `layout-float`
     * @param uw-props {string}
     *
     * @description
     * Supported properties
     * - for `layout-float`: {{css:string, zindex:number}}
     * - for `layout-col`: {{css:string: span:number}}
     * - for `layout-row`: {{css:string}}
     *
     */
    angular.module('oplus.udp').directive('widgetLayout', widgetLayout)
        .run(['widgetFactory', 'i18nService', '$translate', defineLayoutWidgets]);

    widgetLayout.$inject = ['widgetUiHelper', 'themeService', 'widgetSecurity', '$compile'];

    /**
     *
     * @param widgetFactory
     * @param {i18nService} i18nService
     * @param {$i18nService} $translate
     */
    function defineLayoutWidgets(widgetFactory, i18nService, $translate) {
        widgetFactory.defineWidget({
            type: 'layout-flex',
            group: 'layout',
            configController: LayoutFlexWidgetConfigCtrl
            // configHtmlFile: 'app/modules/udp/widgets/layout-col/layout-col-widget-config.html',
            // configController: 'LayoutColWidgetConfigCtrl'
        });
        widgetFactory.defineWidget({
            type: 'layout-float',
            group: 'layout',
            configController: 'WidgetConfigCtrl'
        });
        // widgetFactory.defineWidget({
        //     type: 'layout-row',
        //     group: 'layout',
        //     tag: 'deprecated',
        //     configController: 'WidgetConfigCtrl'
        // });
        // widgetFactory.defineWidget({
        //     type: 'layout-col',
        //     group: 'layout',
        //     tag: 'deprecated',
        //     configController: 'LayoutColWidgetConfigCtrl'
        // });
        function LayoutFlexWidgetConfigCtrl($scope, props) {
            $scope.grids = [];
            var col = $translate.instant('udp.w.layout-flex.column');
            for (var i = 1; i <= 12; i++) {
                $scope.grids.push({value: i + '', label: i + col});
            }
            $scope.percents = [
                {value: '12', title: 'full'},
                {value: '6', title: '1_2'},
                {value: '4', title: '1_3'},
                {value: '3', title: '1_4'},
                {value: 'e5', title: '1_5'},
                {value: '2', title: '1_6'},
                {value: 'e7', title: '1_7'},
                {value: 'e8', title: '1_8'},
                {value: 'e9', title: '1_9'},
                {value: 'e10', title: '1_10'},
                {value: 'e11', title: '1_11'},
                {value: '1', title: '1_12'}
            ];
            i18nService.translateWithPrefixAndKey($scope.percents, 'udp.w.layout-flex.config.span_', 'title', 'title');
        }
    }

    /**
     *
     * @param {widgetUiHelper} widgetUiHelper
     * @param {themeService} themeService
     * @param {widgetSecurity} widgetSecurity
     * @param {$compile} $compile
     * @returns {{restrict: string, transclude: boolean, template: template, link: link, controller: controller, controllerAs: string}}
     */
    function widgetLayout(widgetUiHelper, themeService, widgetSecurity, $compile) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {},
            bindToController: {
                uwProps: '<',
                // use @widgetLayout for uwType because at this time the template has no uw-type and controller cannot get ctrl.uwType
                uwType: '@widgetLayout'
            },
            controller: 'WidgetCtrl',
            controllerAs: '$widget',
            template: templateFn,
            link: linkFn
        };

        /**
         *
         * @param element
         * @param attrs
         * @param {string} attrs.widgetLayout  `widget-layout`
         * @param {string} attrs.uwType
         * @param {string} attrs.uwProps
         * @returns {string}
         */
        function templateFn(element, attrs) {
            var buttonsHtml = '', bodyHtml;
            // 20200521: Use attrs.widgetLayout, not attrs.uwType because at this time uwType is undefined
            var type = attrs.widgetLayout;
            var props = JSON.parse(attrs.uwProps || '{}');
            // console.log('type', type, props);
            if (type === 'layout-row') {
                // element.addClass('container-fluid');
                bodyHtml = '<div class="uw-row row" ng-transclude></div>';
            } else if (type === 'layout-col') {
                bodyHtml = '<div class="uw-column" ng-transclude></div>'
            } else if (type === 'layout-float') {
                bodyHtml = '<div class="uw-float" ng-transclude></div>'
            } else if (type === 'layout-flex') {
                if (props.flex && props.flex.border && props.flex.border === 'custom') {
                    var style = 'border:' + props.flex.borderSize + ' solid ' + props.flex.borderColor;
                    if(props.flex.borderRadius){
                        style += ';border-radius:' + props.flex.borderRadius;
                    }
                    bodyHtml = '<div class="uw-flex uw-column" style="' + style + '" ng-transclude></div>';

                } else {
                    bodyHtml = '<div class="uw-flex uw-column" ng-transclude></div>'
                }
            } else {
                return '<div class="alert alert-danger">Unsupported widget layout <strong>' + type + '</strong></div>';
            }
            var $wrapper = $('<div></div>');
            var $body = $(bodyHtml);
            if (widgetUiHelper.isEditMode()) {
                buttonsHtml = widgetUiHelper.buildWidgetButtons(type);
            } else {
                widgetUiHelper.addStateControlAttr($body, props);
                // console.log('$body',$body);
            }
            $wrapper.append(buttonsHtml).append($body);
            var html = $wrapper.html();
            return html;
        }

        function linkFn(scope, element, attrs, ctrl) {
            var props = ctrl.uwProps || {},
                display = props.display || {},
                type = ctrl.uwType,
                isEditMode = widgetUiHelper.isEditMode();
            migrateOldSpan(props);
            widgetUiHelper.updateLayoutWidgetElementAttrs(type, props, element, scope);
            //20200511: card-header may contains variables in format of [[@.]]
            $compile(element.find('>.card >.card-header').contents())(scope);
            if (type === 'layout-float') {
                element.resizable();
                element.draggable();
            } else if (type === 'layout-col' || type === 'layout-flex') {
                if (isEditMode) {
                    makeColResizable(type === 'layout-flex');
                }
            }
            // if (!widgetUiHelper.isEditMode()) {
            //     widgetUiHelper.changeElementState(element, props.statecontrol, scope);
            // }
            // if (!isEditMode) {
            //     widgetUiHelper.changeElementState(element, props.statecontrol, scope);
            //     widgetSecurity.changeAccessState(element, props.accesscontrol);
            // }


            function makeColResizable(isFlex) {
                // var column = element.find('.uw-column');
                // var container = element.closest(isFlex?'.uw-column,#pd-canvas-zone':'.uw-row');
                // container="parent";
                // console.log('container',element,container.length);
                var snapToGrid = true, resizeDir = 'e';
                element.resizable({
                    handles: resizeDir,
                    containment: 'parent',
                    // helper: "resizable-helper",
                    // alsoResize:element,
                    stop: function (e, ui) {
                        var container = element.parent();
                        if (snapToGrid) {
                            var span = Math.ceil(ui.size.width / container.width() * 12);
                            // Remove position (left) styles
                            element.attr('style', '');
                            props = widgetUiHelper.upgradeWidgetProps(element, {span: span});
                            widgetUiHelper.updateLayoutWidgetElementAttrs(type, props, element, scope);
                        } else {
                            var width = ui.size.width / container.width() * 100;
                            // Round to 5%
                            // https://stackoverflow.com/questions/18953384/javascript-round-up-to-the-next-multiple-of-5
                            var percent = Math.ceil(width / 5) * 5 + '%';
                            element.css('width', percent);
                        }
                        // TODO: if a widget is first time copied/pasted to this layout, it cannot $on this event. But can after refresh page.
                        scope.$broadcast('WIDGET_RESIZE', {from: 'RESIZE_COLUMN', reHeight: false});
                    }
                });
            }

            function migrateOldSpan(props) {
                if (angular.isNumber(props.span)) {
                    props.span = '' + props.span;
                }
            }
        }
    }
})();
