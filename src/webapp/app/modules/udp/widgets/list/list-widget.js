/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/10/2017
 */
(function () {
    angular.module('oplus.udp').run(['i18nService', '$translate', 'widgetFactory', 'widgetDataUtil', 'widgetInteraction', 'widgetUiHelper', 'repeatedItemsWidgetBuilder', 'devel', listWidget]);


    /**
     *
     * @param {i18nService} i18nService
     * @param {$translate} $translate
     * @param {widgetFactory} widgetFactory
     * @param {widgetDataUtil} widgetDataUtil
     * @param {widgetInteraction} widgetInteraction
     * @param {widgetUiHelper} widgetUiHelper
     * @param {repeatedItemsWidgetBuilder} repeatedItemsWidgetBuilder
     * @param {devel} devel
     */
    function listWidget(i18nService, $translate, widgetFactory, widgetDataUtil, widgetInteraction, widgetUiHelper, repeatedItemsWidgetBuilder, devel) {
        widgetFactory.defineWidget({
            type: 'list',
            group: 'data',
            resizable: 'h,w',
            widthMode: 'wm-full',
            configController: ListWidgetConfigCtrl,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl,
                onReloadData: onReloadData
            }
        });

        var generatorConfig = {enableItemCss: false, itemAttrs: ['title', 'text', 'icon', 'badge']};

        function ListWidgetConfigCtrl(scope, props) {
            upgradeWidgetProps(props);
            scope.params = [
                {name: 'title'},
                {name: 'text'},
                {name: 'badge'},
                {name: 'icon'}
            ]
            i18nService.translateWithPrefixAndKey(scope.params, 'udp.w.list.config.', 'name', 'title');
            scope.controlStyles = [
                {value: "", title: "list"},
                {value: "label", title: "label"},
                {value: "pills", title: "pill"},
                {value: "navbar", title: "navbar"},
                {value: "tabs", title: "tab"},
                {value: "indicator", title: "indicator"}
            ]
            i18nService.translateWithPrefixAndKey(scope.controlStyles, 'udp.w.list.config.control_', 'title', 'title');
        }

        function upgradeWidgetProps(props) {
            widgetInteraction.upgradeWidgetProps(props);
        }


        function onReloadData(scope, element) {
            var riwb = element.data('theBuilder');
            return riwb.reloadData(scope, element);
        }

        function getTemplateForCompilation(props) {
            var display = props.display || {};
            if (!widgetDataUtil.isDatasetConfigGood(props.dataset)) {
                throw new WidgetNotConfiguredError($translate.instant('udp.wc.error.missing_dataset_or_field'));
            }
            var filterHtml = '', listHtml, html;
            if (display.filter) {
                filterHtml += '<op-searchbox on-search="doSearch(searchText)" search-text="searchText" on-clear="doSearch()"></op-searchbox>';
            }

            var style = '',
                ngClass = ' ng-class="{active:current.index===$index}" ',
                ngRepeat = ' ng-repeat="item in items | filter:searchText track by $index" ',
                ngClick = ' ng-click="clickItem(item._data,$event,$index)" ';

            if (display.control === 'label') {
                listHtml = '<ul class="list list-unstyled list-inline">' +
                    '<li ' + ngRepeat + ' class="mb-2">' +
                    '<a href="javascript:void(0);" ' + ngClass + ngClick + ' class="badge bg-secondary py-2 px-3 op-text-normal">{{item.title}}</a>' +
                    '</li></ul>';
            } else if (display.control === 'navbar') {
                listHtml = '<nav class="navbar navbar-expand navbar-light bg-light">' +
                    '<ul class="navbar-nav">' +
                    '<li ' + ngRepeat + ' class="nav-item">' +
                    '<a ' + ngClass + ngClick + ' class="nav-link">{{item.title}}</a>' +
                    '</li></ul>' +
                    '</nav>';
            } else if (display.control === 'tabs' || display.control === 'pills' || display.control === 'indicator') {
                var css = {tabs: 'nav-tabs', pills: 'nav-pills', indicator: 'nav-mdc-op'};
                listHtml = '<ul class="nav ' + css[display.control] + '">' +
                    '<li ' + ngRepeat + ' class="nav-item">' +
                    '<a class="nav-link"' + ngClass + ngClick + '>' +
                    '<i class="fa {{item.icon}}" ng-if="item.icon"></i> {{item.title}}</a>' +
                    '</li></ul>';
            } else {
                var isHorizontal = false;
                // if (display.height > 0) {
                //     style = 'style="height:' + display.height + 'px;"';
                // }
                //TODO: I need show popover actions when hold and hide it when click anywhere outside,
                // but uib-popover does not support this combination
                // https://stackoverflow.com/questions/36789948/how-to-use-a-different-combination-of-triggers-for-uib-popover
                // Now we can only dismiss the popover by clicking one action
                listHtml = '<div class="list-group uw-content-data flex-fill scroll-y">' +
                    '<a class="list-group-item {{item._css}}" ' + ngClass + ngRepeat +
                    ngClick + ' on-hold="showActions($index)" ' +
                    // ' uib-popover uib-popover-template="popoverTplUrl" popover-is-open="item._popover" popover-trigger="\'none\'" popover-class="op-action-bar" popover-append-to-body="false" popover-placement="top"' +
                    '>' +
                    '<div class="pull-left text-center m-r" ng-if="item.icon">' +
                    '<i class="fa fa-2x {{item.icon}}"></i>' +
                    '</div>' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                    '  <h4>{{item.title}}</h4>' +
                    '  <span class="badge bg-secondary badge-pill" ng-if="item.badge">{{item.badge}}</span>' +
                    '</div>' +
                    '<p ng-bind-html="item.text"></p>' +
                    '</a>' +
                    '</div>';
                html = '<div class="d-flex flex-column h-100">' + filterHtml + listHtml + '</div>';
                return html;
            }
            html = filterHtml + listHtml;
            return html;
        }

        function onInitControl(scope, element, props) {
            if (!widgetDataUtil.isDatasetConfigGood(props.dataset)) {
                return;
            }
            scope.showActions = showActions;
            scope.popoverTplUrl = 'app/modules/udp/widgets/list/list-widget-actions.html';
            scope.copyText = function () {
                // console.log('copyText', scope.activeItemIndex);
                if (scope.activeItemIndex >= 0)
                    scope.items[scope.activeItemIndex]._popover = undefined;
            };
            var riwb = repeatedItemsWidgetBuilder.newInstance(generatorConfig);
            element.data('theBuilder', riwb);
            return riwb.renderDynamicData(scope, element, props);

            function showActions(index) {
                // console.log('showActions');
                scope.items.forEach(function (item) {
                    item._popover = undefined;
                });
                scope.items[index]._popover = true;
                scope.activeItemIndex = index;
            }
        }
    }
})();
