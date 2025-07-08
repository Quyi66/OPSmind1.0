/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/19/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').service('themeService', ['$translate', 'i18nService', themeService]);

    /**
     * @ngdoc service
     * @name themeService
     * Color determination
     * Page theme
     * Page backColor, page.fontColor
     * card theme
     * card backColor, card.fontColor
     * @param {$translate} $translate
     * @param {i18nService} i18nService
     */
    function themeService($translate, i18nService) {
        var DEFAULT_PALETTE = 'default';
        var CHART_PALETTES = {};
        CHART_PALETTES['default'] = {
            title: $translate.instant('common.palette.default'),
            // Echarts 4 Light
            // colors: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF']
            // Office 2016 Paper
            // colors:['#A5B592','#F3A447','#E7BC29','#D092A7','#9C85C0','#809EC2']
            // Tableau 10 (2016) https://www.tableau.com/about/blog/2016/7/colors-upgrade-tableau-10-56782
            colors: ['#4e79a7', '#59a14f', '#9c755f', '#f28e2b', '#edc948', '#bab0ac', '#e15759', '#b07aa1', '#76b7b2', '#ff9da7']
        };
        // http://docs.splunk.com/Documentation/SplunkCloud/6.6.3/AdvancedDev/CustomVizDesign#Color
        // 'splunk': {
        //     title: 'Splunk Categorical',
        //     colors: [
        //         '#1e93c6',
        //         '#f2b827',
        //         '#d6563c',
        //         '#6a5c9e',
        //         '#31a35f',
        //         '#ed8440',
        //         '#3863a0',
        //         '#a2cc3e',
        //         '#cc5068',
        //         '#73427f'
        //     ]
        // },
        // 'servicenow': {
        //     //https://docs.servicenow.com/bundle/kingston-performance-analytics-and-reporting/page/use/reporting/concept/c_ChartColors.html
        //     title: 'ServiceNow',
        //     colors: ['#278ECF',
        //         '#4BD762',
        //         '#FFCA1F',
        //         '#FF9416',
        //         '#D42AE8',
        //         '#535AD7',
        //         '#FF402C',
        //         '#83BFFF',
        //         '#6EDB8F',
        //         '#FFE366']
        // },
        //https://github.com/grafana/grafana/blob/new-color-palette/public/app/core/utils/colors.ts#L77
        // 'grafana':{
        //      title:'Grafana',
        //      colors:[
        //         '#5195CE',
        //         '#D683CE',
        //         '#629E51',
        //         '#EA6460',
        //         '#F2C96D',
        //         '#EF843C',
        //         '#64B0C8',
        //         '#BA43A9',
        //         '#7EB26D',
        //         '#E24D42',
        //         '#EAB839',
        //         '#F9934E',
        //         '#447EBC',
        //         '#E5A8E2',
        //         '#9AC48A',
        //         '#F29191',
        //         '#F4D598',
        //         '#F9BA8F',
        //         '#6ED0E0',
        //         '#806EB7',
        //         '#508642',
        //         '#BF1B00',
        //         '#CCA300',
        //         '#E0752D',
        //         '#82B5D8',
        //         '#705DA0',
        //         '#B7DBAB',
        //         '#890F02',
        //         '#E5AC0E',
        //         '#99440A',
        //         '#1F78C1',
        //         '#AEA2E0',
        //         '#3F6833',
        //         '#58140C',
        //         '#967302',
        //         '#C15C17',
        //         '#0A50A1',
        //         '#962D82',
        //         '#65C5DB',
        //         '#FCE2DE',
        //         '#0A437C',
        //         '#614D93',
        //         '#70DBED',
        //         '#F9E2D2',
        //         '#052B51',
        //         '#F9D9F9',
        //         '#2F575E',
        //         '#FCEACA',
        //         '#6D1F62',
        //         '#CFFAFF',
        //         '#3F2B5B',
        //         '#E0F9D7',
        //         '#511749',
        //         '#DEDAF7',
        //         '#584477',
        //         '#BADFF4',
        //      ]
        // },
        //https://api.highcharts.com/highcharts/colors
        // 'highcharts': {
        //     title: 'HighCharts',
        //     colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
        // },
        CHART_PALETTES['office'] = {
            title: 'Office 2016',
            colors: ['#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'/*, '#264478', '#9e480e', '#636363', '#997300'*/]
        };
        CHART_PALETTES['blue'] = {
            title: $translate.instant('common.palette.blue'),
            colors: [/*'#0D47A1','#1565C0',*/'#1976D2','#1E88E5','#2196F3','#42A5F5','#64B5F6','#90CAF9','#BBDEFB']
        };
        CHART_PALETTES['yellow'] = {
            title: $translate.instant('common.palette.yellow'),
            colors: ['#FFCA08', '#F8931D', '#CE8D3E', '#EC7016', '#E64823', '#9C6A6A']
        };
        CHART_PALETTES['greent'] = {
            title: $translate.instant('common.palette.green'),
            colors: ['#549E39', '#8AB833', '#C0CF3A', '#029676', '#4AB5C4', '#0989B1']
        };
        var NAMED_CSS_DEFS = [
            {
                group: 'layout',
                label: $translate.instant('common.css.layout'),
                list: [
                    {
                        cssClass: 'mt-3',
                        desc: $translate.instant('common.css.m_top'),
                        previewCss: 'css-preview-mt-3'
                    },
                    {
                        cssClass: 'me-3',
                        desc: $translate.instant('common.css.m_right'),
                        previewCss: 'css-preview-me-3'
                    },
                    {
                        cssClass: 'mb-3',
                        desc: $translate.instant('common.css.m_bottom'),
                        previewCss: 'css-preview-mb-3'
                    },
                    {
                        cssClass: 'ms-3',
                        desc: $translate.instant('common.css.m_left'),
                        previewCss: 'css-preview-ms-3'
                    },
                    {
                        cssClass: 'm-3',
                        desc: $translate.instant('common.css.m_all'),
                        previewCss: 'css-preview-m-3'
                    },
                    {
                        cssClass: 'op-pl',
                        desc: $translate.instant('common.css.p_left'),
                        previewCss: 'css-preview-op-pl'
                    },
                    {
                        cssClass: 'op-pr',
                        desc: $translate.instant('common.css.p_right'),
                        previewCss: 'css-preview-op-pr'
                    },
                    {
                        cssClass: 'p-3',
                        desc: $translate.instant('common.css.p_all'),
                        previewCss: 'css-preview-p-3'
                    }
                ]
            }, {
                group: 'text',
                label: $translate.instant('common.css.text'),
                list: [
                    {cssClass: 'pre', desc: $translate.instant('common.css.text_pre')},
                    {cssClass: 'bold', desc: $translate.instant('common.css.text_bold')},
                    {cssClass: 'large', desc: $translate.instant('common.css.text_large')},
                    {cssClass: 'code', desc: $translate.instant('common.css.text_code')}
                ]
            }, {
                group: 'appearance',
                label: $translate.instant('common.css.appearance'),
                list: [
                    {cssClass: 'shadow', desc: $translate.instant('common.css.shadow'), previewCss: 'shadow'}
                ]
            }, {
                group: 'color',
                label: $translate.instant('common.css.color'),
                list: [
                    {cssClass: 'text-primary', desc: $translate.instant('common.color.primary')},
                    {cssClass: 'text-secondary', desc: $translate.instant('common.color.secondary')},
                    {cssClass: 'text-success', desc: $translate.instant('common.color.success')},
                    {cssClass: 'text-info', desc: $translate.instant('common.color.info')},
                    {cssClass: 'text-warning', desc: $translate.instant('common.color.warning')},
                    {cssClass: 'text-danger', desc: $translate.instant('common.color.danger')},
                    {cssClass: 'text-muted', desc: $translate.instant('common.color.muted')},
                    {
                        cssClass: 'text-light',
                        desc: $translate.instant('common.color.light'),
                        previewCss: 'text-light bg-dark'
                    }
                ]
            }, {
                group: 'bgcolor',
                label: $translate.instant('common.css.bgcolor'),
                list: [
                    {cssClass: 'bg-white', desc: $translate.instant('common.color.white')},
                    {cssClass: 'bg-light', desc: $translate.instant('common.color.light')},
                    {
                        cssClass: 'bg-dark',
                        desc: $translate.instant('common.color.dark'),
                        previewCss: 'text-light bg-dark'
                    },
                    {
                        cssClass: 'bg-black',
                        desc: $translate.instant('common.color.black'),
                        previewCss: 'text-light bg-black'
                    },
                    {
                        cssClass: 'bg-primary',
                        desc: $translate.instant('common.color.primary'),
                        previewCss: 'text-light bg-primary'
                    },
                    {
                        cssClass: 'bg-secondary',
                        desc: $translate.instant('common.color.secondary'),
                        previewCss: 'text-light bg-secondary'
                    },
                    {
                        cssClass: 'bg-success',
                        desc: $translate.instant('common.color.success'),
                        previewCss: 'text-light bg-success'
                    },
                    {
                        cssClass: 'bg-info',
                        desc: $translate.instant('common.color.info'),
                        previewCss: 'text-light bg-info'
                    },
                    {
                        cssClass: 'bg-warning',
                        desc: $translate.instant('common.color.warning'),
                        previewCss: 'text-dark bg-warning'
                    },
                    {
                        cssClass: 'bg-danger',
                        desc: $translate.instant('common.color.danger'),
                        previewCss: 'text-light bg-danger'
                    }
                ]
            }
        ];
        var PAGE_THEMES, CARD_THEMES;
        var THEME_COLORS = [
            {id: 'default', colorHex: '#333'},
            // {id: 'white', colorHex: '#fff'},
            // {id: 'black', colorHex: '#000000'},
            {id: 'light', colorHex: '#f8f9fa', cardTheme: true, pageTheme: true},
            {id: 'dark', colorHex: '#212529', cardTheme: true, pageTheme: true},
            {id: 'primary', colorHex: '#007bff', cardTheme: true},
            {id: 'secondary', colorHex: '#6c757d', cardTheme: true},
            {id: 'success', colorHex: '#28a745', cardTheme: true},
            {id: 'info', colorHex: '#17a2b8', cardTheme: true},
            {id: 'warning', colorHex: '#ffc107', cardTheme: true},
            {id: 'danger', colorHex: '#dc3545', cardTheme: true}
        ];
        i18nService.translateWithPrefixAndKey(THEME_COLORS, 'common.color.', 'id', 'title');
        PAGE_THEMES = _.map(_.filter(THEME_COLORS, {pageTheme: true}), function (o) {
            return {id: o.id, title: o.title};
        });
        CARD_THEMES = _.map(_.filter(THEME_COLORS, {cardTheme: true}), function (o) {
            return {id: o.id, title: o.title};
        });
        var FONT_FAMILY = '"Open Sans", "Microsoft Yahei Light", "Microsoft Yahei", "Helvetica", "Arial", sans-serif';

        this.getNamedCssDefs = getNamedCssDefs;
        this.getNamedCssClasses = getNamedCssClasses;
        this.calcColors = calcColors;
        this.getColorPickerPalette = getColorPickerPalette;
        this.getChartPalettes = getChartPalettes;
        this.getColorValuesByChartPalette = getColorValuesByChartPalette;
        this.getColorValueByTheme = getColorValueByTheme;
        this.getFontFamily = getFontFamily;
        this.getDefinedThemes = getDefinedThemes;
        this.getPageThemes = getPageThemes;
        this.isCardColorEnabled = isCardColorEnabled;

        function isCardColorEnabled() {
            return true;
        }

        /**
         * Get CSS definitions for CSS editor.
         * @return {[{group: string, label: string, list: [{cssClass: string, desc: string, previewCss: string}]}]}
         */
        function getNamedCssDefs() {
            return NAMED_CSS_DEFS;
        }

        /**
         * Get CSS class list.
         * @return {[string]} List of CSS classes
         */
        function getNamedCssClasses() {
            var classList = [];
            NAMED_CSS_DEFS.forEach(function (group) {
                group.list.forEach(function (def) {
                    classList.push(def.cssClass);
                });
            });
            return classList;
        }

        /**
         *
         * @param baseColors
         * @param {object} options
         * @param {number} options.lightNum Number of light colors
         * @param {number} options.darkNum Number of dark colors
         * @param {number} options.level Gradient level
         * @returns {[[string]]} 2D array of colors
         */
        function calcGradientColors(baseColors, options) {
            options = options || {};
            var lightenNum = options.lightNum || 3, darkenNum = options.darkNum || 2, amount = options.level || 9;
            var colors = [], row = [];
            for (var i = 1; i <= lightenNum + darkenNum; i++) {
                row = [];
                baseColors.forEach(function (baseColor) {
                    if (i > lightenNum) {
                        row.push(tinycolor(baseColor).darken((i - lightenNum) * amount).toHexString());
                    } else {
                        row.push(tinycolor(baseColor).lighten((lightenNum - i + 1) * amount).toHexString());
                    }
                });
                colors.push(row);
            }
            return colors;
        }

        /**
         * Get palette for color picker.
         * @returns {[[string]]} A table-like color values. Column for color series, row for color shade.
         */
        function getColorPickerPalette() {
            //20200703: office 2016 color palette, manually extracted
            var OFFICE_2016 = [
                ['#FFFFFF', '#000000', '#E7E6E6', '#44546A', '#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'],
                ['#f2f2f2', '#7f7f7f', '#d0cece', '#d6dce4', '#d9e2f3', '#e9e4e2', '#ededed', '#fff2cc', '#deebf6', '#e2efd9'],
                ['#d8d8d8', '#595959', '#aeabab', '#adb9ca', '#b4c6e7', '#f7cbac', '#dbdbdb', '#fee599', '#bdd7ee', '#c5e0b3'],
                ['#bfbfbf', '#3f3f3f', '#757070', '#adb9ca', '#8eaadb', '#f4b183', '#c9c9c9', '#ffd965', '#9cc3e5', '#a8d08d'],
                ['#a5a5a5', '#262626', '#3a3838', '#323f4f', '#2f5496', '#c55a11', '#7b7b7b', '#bf9000', '#2e75b5', '#538135'],
                ['#7f7f7f', '#0c0c0c', '#171616', '#222a35', '#1f3864', '#833c0b', '#525252', '#7f6000', '#1e4e79', '#375623'],
                ['#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0']
            ];
            return OFFICE_2016;
        }


        /**
         * Get color value in hex by theme
         * @param {string} theme Theme ID
         * @return {string|null} Hex value
         */
        function getColorValueByTheme(theme) {
            var find = _.find(THEME_COLORS, {id: theme});
            if (find) {
                return find.colorHex;
            }
            return null;
        }

        /**
         * Calculate colors for background, font, border based on page and widget display setting
         * @param {scope} widgetScope Widget scope
         * @returns {{backColor: string, fontColor: string, borderColor: string}}
         */
        function calcColors(widgetScope) {
            var widgetDisplay = widgetScope.$widget.uwProps.display || {};
            var pageDisplay = widgetScope.$widget.$pageScope.$ctrl.page.setting || {};
            var colors = {backColor: '', fontColor: '', borderColor: ''};
            if (pageDisplay.theme && pageDisplay.theme !== '_CUSTOM') {
                colors.backColor = getColorValueByTheme(pageDisplay.theme);
            } else {
                if (pageDisplay.fontColor) {
                    colors.fontColor = pageDisplay.fontColor;
                }
                if (pageDisplay.backColor) {
                    colors.backColor = pageDisplay.backColor;
                }
            }
            if ((widgetDisplay.boxMode || widgetDisplay.cardMode) && widgetDisplay.theme && widgetDisplay.theme !== '_CUSTOM') {
                if (isCardColorEnabled()) {
                    colors.backColor = getColorValueByTheme(widgetDisplay.theme);
                } else {
                }
            } else {
                if (widgetDisplay.fontColor) {
                    colors.fontColor = widgetDisplay.fontColor;
                }
                if (widgetDisplay.backColor) {
                    colors.backColor = widgetDisplay.backColor;
                }
            }
            // Fallback
            if (!colors.backColor) {
                colors.backColor = '#fff';
            }
            if (!colors.fontColor) {
                // For dark theme, use 60% opacity
                colors.fontColor = tinycolor.mostReadable(colors.backColor, ['#333', 'rgba(255, 255, 255, 0.6)'], {includeFallbackColors: true}).toRgbString();//HexString();
            }
            colors.borderColor = tinycolor(colors.fontColor).setAlpha(0.2).toRgbString();
            return colors;
        }

        /**
         * Get defined themes.
         * @returns {[{id:string,title:string}]}
         */
        function getDefinedThemes(customizable) {
            if (customizable)
                return THEME_COLORS.concat([{id: '_CUSTOM', title: $translate.instant('common.color.custom')}]);
            return THEME_COLORS;
        }

        function getChartPalettes() {
            return CHART_PALETTES;
        }

        /**
         *
         * @param {boolean} customizable Allow custom theme
         * @returns {[{id:string,title:string}]}
         */
        function getPageThemes(customizable) {
            if (customizable) {
                return PAGE_THEMES.concat([{id: '_CUSTOM', title: $translate.instant('common.color.custom')}]);
            }
            return PAGE_THEMES;
        }

        function getFontFamily() {
            return FONT_FAMILY;
        }

        /**
         * @param paletteId
         * @returns {[string]} List of color values
         */
        function getColorValuesByChartPalette(paletteId) {
            var palette = CHART_PALETTES[paletteId] || CHART_PALETTES[DEFAULT_PALETTE];
            return palette.colors;
        }
    }
})();
