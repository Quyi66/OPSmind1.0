/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/30/2018
 */
(function () {
    'use strict';

    angular.module('oplus.udp').run(['$q', 'themeService', 'conditionalFormat', 'widgetFactory', 'widgetDataUtil', 'widgetInteraction', 'widgetUiHelper', cardWidget]);
    angular.module('oplus.udp').filter('fancyNumber', function () {
        return fancyNumber;
    });

    function fancyNumber(input) {
        if (!input)
            return '';
        var result = '', str = input + '';
        for (var i = 0; i < str.length; i++) {
            var ch = str.charAt(i);
            if ('0123456789'.indexOf(ch) >= 0) {
                result += '<span class="digit">' + ch + '</span>';
            } else {
                result += ch;
            }
        }
        result += '';
        return result;
    }


    /**
     * @param $q
     * @param conditionalFormat {conditionalFormat}
     * @param widgetFactory {widgetFactory}
     * @param widgetDataUtil {widgetDataUtil}
     * @param widgetInteraction {widgetInteraction}
     * @param themeService {themeService}
     * @param widgetUiHelper {widgetUiHelper}
     */
    function cardWidget($q, themeService, conditionalFormat, widgetFactory, widgetDataUtil, widgetInteraction, widgetUiHelper) {
        widgetFactory.defineWidget({
            type: 'card',
            name: '数字卡片',
            desc: '用于简洁醒目的显示文字和数据',
            group: 'data',
            resizable: 'hw',
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onReloadData: onReloadData,
                onInitControl: onInitControl
            }
        });

        function onInitControl(scope, element, props) {
            return onReloadData(scope, element, props);
        }

        function getTemplateForCompilation(props) {
            if (!props.dataset) {
                throw new WidgetNotConfiguredError('数据集没有设置好');
            }
            var display = props.display || {};
            var htmlValue, htmlLabel, html;
            html = '<div class="udp-card" ng-style="card.style">' +
                '<div class="udp-card-image" ng-if="image.url"><img src="{{image.url}}" ng-style="image.style"></div>' +
                '<div class="udp-card-text">' +
                '<div ng-repeat="metric in metrics">';
            var ngBind = 'metric.value', valueClass = 'm-b-none';
            if (display.fancyStyle) {
                ngBind += ' | fancyNumber';
                valueClass += ' udp-fancy-number ' + display.fancyStyle;
            }
            htmlValue = '<p class="' + valueClass + '" ng-style="metric.style" ng-bind-html="' + ngBind + '"></p>';
            htmlLabel = '<p>{{metric.label}}</p>';
            if (display.layout === 'bottom') {
                html += htmlLabel + htmlValue;
            } else {
                html += htmlValue + htmlLabel;
            }
            html += '</div></div></div>';
            return html;
        }

        function onReloadData(scope, element, props) {
            var fields = props.fields || {};
            var display = props.display || {};
            scope.metrics = [];
            scope.card = {style: {'background-color': display.bgcolor}};
            // console.log(scope.card);
            widgetDataUtil.queryAndConvertData(scope, element, props).then(function (data) {
                if (data.records.length > 0) {
                    var record = data.records[0];
                    (fields.metrics || []).forEach(function (metric, index) {
                        scope.metrics.push({
                            value: record[metric.__valueKey],
                            label: metric.label,
                            style: {color: metric.color, 'font-size': metric.fontSize}
                        });
                    });
                    var imageField = fields.image;
                    if (imageField) {
                        scope.image = {
                            //TODO: hardcode url prefix
                            url: './content/medialib/' + record[imageField.__valueKey],
                            style: {width: imageField.width}
                        };
                    }
                }
            }).catch(function (err) {
                throw err;
            });
        }
    }
})();
