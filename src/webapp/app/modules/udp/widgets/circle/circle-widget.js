/**
 * This is a sample widget
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/27/2018
 */

(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['widgetFactory', 'widgetDataUtil', 'widgetUiHelper', 'messageService', 'echartsWidgetBuilder', 'echartsFactory', circleWidget]);

    /**
     *
     * @param {widgetDataUtil} widgetDataUtil
     * @param {widgetFactory} widgetFactory
     * @param {widgetUiHelper} widgetUiHelper
     * @param {messageService} messageService
     * @param {echartsWidgetBuilder} echartsWidgetBuilder
     * @param {echartsFactory} echartsFactory
     */
    function circleWidget(widgetFactory, widgetDataUtil, widgetUiHelper, messageService, echartsWidgetBuilder, echartsFactory) {
        var builderConfig = {
            DEFAULT_HEIGHT: '240px',
            CHART_OBJ_CSS: 'js-chart-obj',
            CHART_LIST_CSS: 'js-chart-list',
            multiCharts: true,
            /**
             * Check widget configuration
             * @return {boolean}
             */
            checkWidgetProps: function checkWidgetProps(props) {
                return (props['dataset'] || {}).id && props.fields && props.fields.metrics;
            },
            configGraphic: configGraphic
        };

        var chartBuilder = echartsFactory.createBuilder('circle', builderConfig);

        widgetFactory.defineWidget({
            type: 'circle',
            name: '环形图',
            desc: '由环形、文字和图标构成，和饼图类似。用于显示进度、百分比，以及少于5个指标的数据展示',
            group: 'data',
            resizable: 'hw',
            // resizeSelector: '.udp-resize-handler',
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onReloadData: onReloadData,
                onInitControl: onInitControl,
                onResize: chartBuilder.onResize
            }
        });

        function configGraphic(chartOption, record, props, getFieldValue) {
            var fields = props.fields;
            var showTotal = true, showIcon = true, showTitle = true;
            if (showTitle && fields.displayText) {
                var displayTextBottom = fields.displayText.posY || '30%';
                var displayTextLeft = fields.displayText.posX || 'center';
                var displayText =
                    {
                        type: 'text',
                        z: 1,
                        style: {
                            text: getFieldValue(record, fields.displayText),
                            fill: fields.displayText.color,
                            fontSize: fields.displayText.size * 100 || 14
                        },
                        left: displayTextLeft,
                        bottom: displayTextBottom
                    };
                chartOption.graphic.elements.push(displayText);
            }
            if (showTotal && fields.mainText) {
                var mainTextTop = fields.mainText.posY || '30%';
                var mainTextLeft = fields.mainText.posX || 'center';
                var mainText =
                    {
                        type: 'text',
                        // draggable: true,
                        z: 1,//On top of image
                        style: {
                            text: getFieldValue(record, fields.mainText),
                            fill: fields.mainText.color,
                            fontSize: fields.mainText.size * 100 || 24
                        },
                        left: mainTextLeft,
                        top: mainTextTop
                        // ondragend: onPointDragging,
                    };

                chartOption.graphic.elements.push(mainText);
            }
            if (showIcon && fields.icon) {
                var size = fields.icon.size || 64;
                var imageUrl = './content/medialib/icons/' + getFieldValue(record, fields.icon) + '.svg';
                var icon =
                    {
                        type: 'image',
                        style: {
                            image: imageUrl,
                            // y:20,
                            width: size,
                            height: size
                        },
                        left: 'center',
                        top: 'middle'
                    };
                chartOption.graphic.elements.push(icon);
            }
            if (showTitle && fields.title) {
                var titleText = fields.title.text;
                if(titleText){
                    chartOption.title = {
                        text: titleText,
                        top: fields.title.top === 'custom' ? fields.title.topCustom:fields.title.top ,
                        left: fields.title.left === 'custom' ? fields.title.leftCustom:fields.title.left ,
                        textStyle: {//主标题的属性
                            color: fields.title.color,//颜色
                            fontSize: fields.title.size,//大小
                            fontWeight: '700'
                        }
                    };
                }
            }
            if (showTitle && fields.name) {
                var titleText2 = getFieldValue(record,fields.name);
                if(titleText2){
                    chartOption.title = {
                        text: titleText2,
                        top: fields.title.top === 'custom' ? fields.title.topCustom:fields.title.top ,
                        left: fields.title.left === 'custom' ? fields.title.leftCustom:fields.title.left ,
                        textStyle: {//主标题的属性
                            color: fields.title.color,//颜色
                            fontSize: fields.title.size,//大小
                            fontWeight: '700'
                        }
                    };
                }
            }
        }

        /**
         * 定义Widget的模板，和定义Angular页面模板的方式是一样的，返回模板的HTML。
         * @param {Object} props 当前Widget的属性
         * @return {String} HTML模板
         */
        function getTemplateForCompilation(props) {
            return chartBuilder.getTemplateForCompilation(props);
        }

        /**
         * 可选的
         * 控件会监听widgetValues.events.WidgetEvent事件，
         * 当事件名称和控件的eventtorefresh或者dataset.eventtorefresh属性相同时，将调用此方法
         * @param {Scope} scope 当前Widget所在的scope
         * @param {jQuery} element 当前Widget的元素
         */
        function onReloadData(scope, element) {
            return chartBuilder.onReloadData(scope, element);
        }

        /**
         * 在这个方法中，可以做以下的事：
         * - 获取数据
         * - 初始化控件，比如jQuery控件
         * - 监听事件
         * @param {Scope} scope 当前Widget所在的scope
         * @param {jQuery} element 当前Widget的元素
         * @param {Object} props 当前Widget的配置属性
         * @param {object} props.fields
         */
        function onInitControl(scope, element, props) {
            return chartBuilder.onInitControl(scope, element, props);
        }
    }
})();
