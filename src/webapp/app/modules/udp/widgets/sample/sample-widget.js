/**
 * This is a sample widget
 * @author Leo Liao (leoliaolei@gmail.com), created on 3/30/2018
 */

(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['widgetFactory', 'messageService', 'widgetDataUtil', sampleWidget]);

    /**
     *
     * Widget属性定义在uw-props里面，规范
     *
     *
     * @param {widgetFactory} widgetFactory
     * @param {messageService} messageService
     * @param {widgetDataUtil} widgetDataUtil
     */
    function sampleWidget(widgetFactory, messageService, widgetDataUtil) {

        // Define a widget
        widgetFactory.defineWidget({
            // [Must] Widget type, it must be globally unique
            type: 'sample',
            // Widget display name, it should be defined in i18n file
            name: 'Sample',
            // [Must] Widget group displayed in page designer toolbox
            group: 'text',
            // Widget description, it should be defined in i18n file
            desc: 'This is a sample widget used for development',
            // If a widget has tag of 'dev', it will be enabled in Dev mode only.
            tag: 'dev',
            // 是否允许拖拽缩放，可以取值'h'（高度拖拽），'w'（宽度拖拽），'h,w'（高度和宽度都可以），null（不允许）
            // 缩放只在编辑时有效，在查看时不能缩放
            resizable: null,
            // widget默认宽度
            widthMode:'wm-inline or wm-block',
            // 控件的配置页面的controller，可以是一个函数，也可以是一个字符串代表已经注入的Controller
            configController: SampleWidgetConfigCtrl,
            // 组件设置页面的HTML文件位置，默认为'app/modules/udp/widgets/<widget_type>/<widget_type>-widget-config.html'
            configHtmlFile: '',
            // 内容生成器
            controlRenderer: {
                // [必须]，控件的静态模板，类似于定义一个页面的template
                getTemplateForCompilation: getTemplateForCompilation,
                // 可选，用于刷新控件的数据
                onReloadData: onReloadData,
                // 可选，用于初始化页面控件和数据。如果没有的话，只是一个静态模板。旧版本用的是`renderDynamicData`
                onInitControl: onInitControl,
                // 可选，用于生成导出页面
                makePrintable: makePrintable,
                // 可选，当控件缩放需要特别处理时需要定义
                onResize: onResize
            }
        });

        /**
         * 定义Widget的模板，和定义Angular页面模板的方式是一样的，返回模板的HTML。
         * @param {Object} props 当前Widget的属性
         * @return {String} HTML模板
         * @throws {WidgetNotConfiguredError} 如果组件必须的属性没有定义完整，抛出此异常
         */
        function getTemplateForCompilation(props) {
            return '<div>{{message}} {{timestamp}} Thi is a sample widget</div>'
        }

        /**
         * 可选的
         * 控件会监听widgetValues.events.WidgetEvent事件，
         * 当事件名称和控件的eventtorefresh或者dataset.eventtorefresh属性相同时，将调用此方法
         * @param {Scope} scope 当前Widget所在的scope
         * @param {jQuery} element 当前Widget的元素
         * @param {object} props 当前Widget的属性
         */
        function onReloadData(scope, element, props) {
            scope.timestamp = new Date();
        }

        /**
         * 在这个方法中，可以做以下的事：
         * - 获取数据
         * - 初始化控件，比如jQuery控件
         * - 监听事件
         * 通过`widgetDataUtil.queryData()`可以方便的获取数据。
         * @param {Scope} scope 当前Widget所在的scope
         * @param {jQuery} element 当前Widget的元素
         * @param {object} props 当前Widget的配置属性
         */
        function onInitControl(scope, element, props) {
            scope.message = 'Welcome';
            scope.timestamp = new Date();
        }

        /**
         * 直接修改element对象，使之成为可供导出的形式
         * @param {jQuery} element
         * @param {object} props Widget properties
         * @param {object=} options
         */
        function makePrintable(element, props, options) {
        }

        /**
         * 当控件自身无法自适应页面或者内容格宽度，需要特别处理时需要定义
         * @param {jQuery} element Widget element
         * @param size
         */
        function onResize(element, size) {
        }
    }

    /**
     * 可以通过scope.uwProps来设置属性值。TODO：直接修改props有用吗？
     * @param {Scope} scope  配置页面的Scope
     * @param {Object} props Widget的配置属性
     */
    function SampleWidgetConfigCtrl(scope, props) {
        scope.sampleData = 'Hello';
        /**
         * [可选] 配置对话框打开后对属性进行处理，例如对字符进行解码
         * @param props
         */
        this.afterInit = function (props) {
        };
        /**
         * [可选]配置对话框点击保存后，在实际保存之前对属性进行处理，例如对字符进行转码
         * @param props
         */
        this.beforeSave = function (props) {
        };
    }
})();