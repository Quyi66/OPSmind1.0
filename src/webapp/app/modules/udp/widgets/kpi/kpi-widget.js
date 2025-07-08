/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/16/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').run(['$q', '$translate', 'i18nService', 'themeService', 'conditionalFormat', 'widgetFactory', 'widgetDataUtil', 'widgetInteraction', 'widgetValues', 'widgetUiHelper', 'repeatedItemsWidgetBuilder', kpiWidget]);


    /**
     * @param $q
     * @param $translate
     * @param {i18nService} i18nService
     * @param {conditionalFormat} conditionalFormat
     * @param {widgetFactory} widgetFactory
     * @param {widgetDataUtil} widgetDataUtil
     * @param {widgetInteraction} widgetInteraction
     * @param {widgetValues} widgetValues
     * @param {themeService} themeService
     * @param {widgetUiHelper} widgetUiHelper
     * @param {repeatedItemsWidgetBuilder} repeatedItemsWidgetBuilder
     */
    function kpiWidget($q, $translate, i18nService, themeService, conditionalFormat, widgetFactory, widgetDataUtil, widgetInteraction, widgetValues, widgetUiHelper, repeatedItemsWidgetBuilder) {
        var VERSION = '1.2';
        widgetFactory.defineWidget({
            type: 'kpi',
            name: 'udp.w.kpi.name',
            group: 'data',
            widthMode: 'wm-full',
            version: VERSION,
            configController: KpiWidgetConfigCtrl,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onReloadData: onReloadData,
                onInitControl: onInitControl
            }
        });

        function KpiWidgetConfigCtrl(scope, props) {
            upgradeWidgetProps(props);
            scope.titlePositions = [
                {key: 'top'},
                {key: ''},
                {key: 'right'},
                {key: 'none'}
            ];
            scope.textPositions = [
                {key: ''},
                {key: 'none'}
            ];
            var attrs = [
                {
                    name: 'text'
                },
                {
                    name: 'title'
                },
                {
                    name: 'icon'
                },
                {
                    name: 'detail'
                }];
            i18nService.translateWithPrefixAndKey(attrs, 'udp.w.kpi.config.', 'name', 'title');
            scope.attrs = attrs;
        }

        var generatorConfig = {
            enableItemCss: true,
            itemAttrs: [
                {name: 'title'},
                {name: 'text'},
                {name: 'icon'},
                {name: 'detail', lazyLoad: true}
            ],
            itemsProcessFn: function (items) {
                if (angular.isArray(items)) {
                    items.forEach(function (item) {
                        //20210222: If icon does not contain fontawesome prefix of 'fa,fas,far,fal,fad,fab', add 'fa'
                        if (item.icon) {
                            if (/(\s|^)fa[srldb]?(\s|$)/.test(item.icon) === false) {
                                item.icon = 'fa ' + item.icon;
                            }
                        }
                    });
                }
            }
        };

        /**
         *
         * @param scope
         * @param scope.items
         * @param scope.items._data
         * @param scope.items._css
         * @param element
         * @returns {promise}
         */
        function onReloadData(scope, element) {
            var riwb = element.data('theBuilder');
            return riwb.reloadData(scope, element);
            // return repeatedItemsWidgetBuilder.reloadData(generatorConfig, scope, element);
        }

        function upgradeWidgetProps(props) {
            var display = props.display || {},
                rules = display.rules || [],
                interaction = props.interaction || {};
            if (!props._v || props._v === '1.0') {
                rules.forEach(function (rule) {
                    if (rule.css) {
                        rule.theme = rule.css;
                        delete rule.css;
                    }
                    if (rule.bgcolor) {
                        rule.backColor = rule.bgcolor;
                        delete rule.bgcolor;
                    }
                });
                if (display.css) {
                    display.theme = display.css;
                    delete display.css;
                    delete display.color;
                }
                delete props.kpiName;
                delete props.kpiValue;
            }
            if (props._v === '1.1' || props._v === '1.2') {
                if (display.hideIcon === true) {
                    display.icon = 'none';
                    delete display.hideIcon;
                }
            }
            // 20180601
            if (interaction.defaultOpen) {
                interaction.activeByIndex = {enabled: true, index: interaction.defaultOpen};
                delete interaction.defaultOpen;
            }
            // 20180606
            widgetInteraction.upgradeWidgetProps(props);
            props._v = VERSION;
        }

        function getTemplateForCompilation(props) {
            upgradeWidgetProps(props);
            if (!props.dataset || !props.fields) {
                throw new WidgetNotConfiguredError($translate.instant('udp.wc.error.missing_dataset_or_field'));
            }

            var display = props.display || {}, fields = props.fields || {};
            var width = display.rowNum || 1;
            var spanCss = 'col-even-' + width,
                cardCss = 'udp-kpi-card opx-autocolor';
            if (display.icon) {
                cardCss += ' udp-kpi-icon-' + display.icon;
            }
            if (display.title === 'none') {
                cardCss += ' udp-kpi-title-none';
            }
            if (display.title === 'right') {
                cardCss += ' udp-kpi-card-h';
            }
            var search = '';
            if (display.search) {
                search = '<op-searchbox ng-if="items.length>=0" on-search="doSearch(searchText)" search-text="searchText" on-clear="doSearch()"></op-searchbox>';
            }
            var card = '';
            // var infoIcon = '<div ngclipboard data-clipboard-text="{{kpi.detail}}" ng-if="_hasDetail" xxxng-mouseleave="popoverOpened=false" style="position:absolute;right:4px;bottom:4px;" class="js-popover-toggle"' + popoverAttr + '><i class="fa fa-info-circle" ng-mouseover="showDetail(kpi,$event);"></i></div>';
            var infoIcon = '<div ng-if="_hasDetail" style="position:absolute;right:4px;bottom:4px;" class="js-popover-toggle"><i class="fa fa-info-circle" ng-mouseover="showDetail(kpi,$event);"></i></div>';
            card += '<div ng-repeat="kpi in items track by $index" class="' + spanCss + '">' +
                '<div class="' + cardCss + ' {{kpi._css}}" ng-class="{active:current.index===$index,\'udp-kpi-icon-none\':!kpi.icon}" ng-style="{\'background-color\':kpi._styles.backColor}">' +
                infoIcon;
            var titleStyle = fields.title.size ? ' style="font-size:' + getFontSize(fields.title.size) + '" ' : '',
                textStyle = fields.text.size ? ' style="font-size:' + getFontSize(fields.text.size) + '" ' : '';
            var link = '<a ng-click="clickItem(kpi._data,$event,$index)" ng-style="{color:kpi._styles.fontColor}">';
            // var label = display.text === 'none' ? '' : '<p class="kpi-text small" ng-bind-html="kpi.text || \'&nbsp;\'"' + textStyle + '></p>';
            // var title = display.title === 'none' ? '' : '<div class="kpi-title" ng-bind-html="kpi.title || \'&nbsp;\'"' + titleStyle + '></div>';
            var label = display.text === 'none' ? '' : '<p class="kpi-text small" ng-bind-html="kpi.text | trusted"' + textStyle + '></p>';
            var title = display.title === 'none' ? '' : '<div class="kpi-title" ng-bind-html="kpi.title | trusted"' + titleStyle + '></div>';
            var icon = display.icon === 'none' ? '' : '<div class="kpi-icon" ng-if="kpi.icon"><i class="{{kpi.icon}}"></i></div>';
            card += link + icon;
            if (display.title === 'top') {
                card += '<div>' + title + label + '</div>';
            } else {
                card += '<div>' + label + title + '</div>';
            }
            card += '</a>' +
                '</div>' +
                '</div>';
            return search + '<div class="udp-kpi-list row op-row-colspace uw-content-data">' + card + '</div>';
            function getFontSize(size) {
                if (angular.isNumber(size)) {
                    if (size < 5) {
                        return Math.round(size * 100) + '%';
                    } else {
                        return size + 'px';
                    }
                } else {
                    return size;
                }

            }
        }

        function onInitControl(scope, element, props) {
            upgradeWidgetProps(props);
            scope.showDetail = showDetail;
            scope._hasDetail = !!(props.fields && props.fields.detail && (props.fields.detail.field || props.fields.detail.convertFn));
            var riwb = repeatedItemsWidgetBuilder.newInstance(generatorConfig);


            element.data('theBuilder', riwb);
            return riwb.renderDynamicData(scope, element, props);

            function showDetail(kpi, event) {
                var oneCard = $(event.target).closest('.udp-kpi-card');
                var pop = initDetailPopover();
                if (!kpi._loaded) {
                    updatePopoverContent(pop, '<i class="text-muted fa fa-spin fa-cog"></i>');
                    // toggle.attr('data-content', '&nbsp;');
                }
                loadDetail().then(function (val) {
                    kpi.detail = val;
                }).catch(function (err) {
                    kpi.detail = err.message;
                }).finally(function () {
                    kpi._loaded = true;
                    updatePopoverContent(pop, kpi.detail);
                    // toggle.attr('data-content', kpi.detail);
                });

                function loadDetail() {
                    if (!kpi._loaded) {
                        return riwb.evalLazyAttr(kpi._data, 'detail', scope);
                    } else {
                        return $q.when(kpi.detail);
                    }
                }

                function updatePopoverContent(pop, text) {
                    pop.data('bs.popover').options.content = text || '&nbsp;';
                    pop.popover('show');
                }

                /**
                 * https://gist.github.com/timneutkens/115d96b97187a6cf6d1f4bce9c0d6e74
                 * https://stackoverflow.com/questions/15989591/how-can-i-keep-bootstrap-popover-alive-while-the-popover-is-being-hovered
                 */
                function initDetailPopover() {
                    var pop = $('.js-popover-toggle', oneCard);
                    if (!pop.data('bs.popover')) {
                        var settings = {
                            placement: 'bottom',
                            container: element,
                            html: true,
                            trigger: 'manual',
                            animation: false
                        };
                        pop.popover(settings);
                        pop.on('mouseenter', function () {
                            var self = $(this);
                            self.popover("show");
                            $(".popover").on('mouseleave', function () {
                                self.popover('hide');
                            });
                        }).on('mouseleave', function () {
                            var self = this;
                            setTimeout(function () {
                                if (!$('.popover:hover').length) {
                                    $(self).popover('hide');
                                }
                            }, 200);
                        });
                    }
                    pop.popover('show');
                    return pop;
                }

                function displayDetailInBox() {
                    var box = $('<div class="udp-kpi-card-detail" style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);"></div>');
                    box.html(kpi.detail);
                    var card = $(event.target).closest('.udp-kpi-card');
                    card.append(box);
                }
            }
        }
    }
})();
