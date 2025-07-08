/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/4/2017
 */
(function () {
    'use strict';
    angular.module('oplus.udp').run(['$location', '$translate', 'widgetFactory', 'widgetInteraction', 'widgetDataUtil', 'widgetUiHelper', '$stateParams', '$timeout', 'widgetDataInterface', 'devel', 'pageDataUtil', navWidget]);

    /**
     * This widget makes a [bootstrap togglable nav tab](https://getbootstrap.com/docs/3.3/javascript/#tabs).
     * Nav items are pre configured. Nav content will be cached.
     *
     * How to make a specific nav item active by default?
     * 1. Assign a `key` to the nav widget, e.g. 'navbar'
     * 2. Assign a unique `key` to each nav item, e.g. 'item_abc'. If a nav item has no `key`, the 0 based index will be used as key.
     * 3. Assign the value of page params 'navbar' to 'item_abc'.
     * This can be achieved by `$widget.$pageScope.pageParams['navbar']='item_abc'` or URL query: `http://host/page/?navbar=item_abc`
     *
     * @param $location
     * @param $translate
     * @param {widgetFactory} widgetFactory
     * @param {widgetInteraction} widgetInteraction
     * @param {widgetUiHelper} widgetUiHelper
     * @param {widgetDataUtil} widgetDataUtil
     * @param $stateParams
     * @param $timeout
     * @param {widgetDataInterface} widgetDataInterface
     * @param devel
     * @param {pageDataUtil} pageDataUtil
     */
    function navWidget($location, $translate, widgetFactory, widgetInteraction, widgetDataUtil, widgetUiHelper, $stateParams, $timeout, widgetDataInterface, devel, pageDataUtil) {
        widgetFactory.defineWidget({
            type: 'nav',
            group: 'layout',
            resizable: 'h',
            widthMode: 'wm-full',
            configController: NavWidgetConfigCtrl,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl
            }
        });

        /**
         *
         * @param $scope
         * @param props
         * @constructor
         */
        function NavWidgetConfigCtrl($scope, props) {
            var currentPageId = $scope.currentPageId = $stateParams.pageId;
            $scope.onPageSelectorChange = onPageSelectorChange;
            $scope.addNavItem = addNavItem;
            $scope.deleteNavItem = deleteNavItem;
            $scope.sortStop = sortStop;
            $scope.selectNavItem = selectNavItem;
            $scope.uwProps.items = $scope.uwProps.items || [];
            if ($scope.uwProps.items.length === 0) {
                $scope.addNavItem();
            } else {
                $scope.selectNavItem(0);
            }
            widgetDataInterface.findAllPagesInfo().then(function (pages) {
                _.remove(pages, function (o) {
                    return o.id === currentPageId;
                });
                $scope.pages = pages;
            }).catch(function (err) {
                throw err;
            });

            function onPageSelectorChange(page) {
                $scope.selectedPage = page;
                if (!$scope.itemInEdit.title) {
                    $scope.itemInEdit.title = page.title;
                }
            }

            function addNavItem() {
                $scope.itemInEdit = {};
                $scope.uwProps.items.push($scope.itemInEdit);
                $scope.selectNavItem($scope.uwProps.items.length - 1);
            }

            function deleteNavItem(index) {
                $scope.uwProps.items.splice(index, 1);
                $scope.selectNavItem(index - 1 < 0 ? 0 : index - 1);
            }

            function selectNavItem(index) {
                $scope.itemInEdit = $scope.uwProps.items[index];
                $scope.indexInEdit = index;
            }

            function sortStop(e, ui) {
                // Use ui.item.sortable.dropindex instead of ui.item.index()
                // https://github.com/angular-ui/ui-sortable/issues/273
                // var newIndex = ui.item.index();
                var newIndex = ui.item.sortable.dropindex;
                if (angular.isNumber(newIndex)) {
                    $scope.selectNavItem(newIndex);
                }
            }
        }

        function getTemplateForCompilation(props) {
            var items = props.items || [];
            // if (items.length === 0) {
            //     throw new WidgetNotConfiguredError('请设定导航菜单项');
            // }
            props.display = props.display || {};
            var style = props.display.style;
            // var ngClass = "'nav-'+(props.display.style||'tabs')";
            var infoText = '';
            var navCss = style === 'navbar' ? 'navbar-nav' : 'nav nav-' + (props.display.style || 'tabs');
            //TODO: opx-layout-vflex will cause problem for demo KPI and calendar page, need further investigation.
            var html =
                '<div class="h-100 xxopx-layout-vflex">' +
                (style === 'navbar' ? '<nav class="navbar navbar-expand navbar-light bg-light">' : '') +
                '  <ul class="' + navCss + '" op-tab-bar>' +
                '    <li class="nav-item" ng-repeat="item in props.items track by $index">' +
                '      <a class="nav-link" ng-class="{active:selected===$index}" ng-click="clickItem($index,$event)" href="{{item.__url}}"><span ng-bind-html="item.title"></span>';
            if (widgetUiHelper.isEditMode()) {
                infoText = '<p class="text-center">' + $translate.instant('udp.w.nav.config.content_placeholder') + '</p>';
            } else {
                html += '<span class="ms-2 op-cursor-hand" title="{{\'common.action.refresh\'|translate}}" ng-if="selected===$index" ng-click="refreshItem($index,$event)"><i class="fa fa-sync text-muted" style="font-size: 80%;"></i></span>';
            }
            html +=
                '      </a>' +
                '    </li>' +
                '  </ul>' +
                (style === 'navbar' ? '</nav>' : '') +
                (!props.contentTarget ? '  <div class="js-nav-content udp-nav-content opx-flex-fill">' + infoText + '</div>' : '') +
                '</div>';
            return html;
        }


        function onInitControl(scope, element, props) {
            var oldIndex = -1;
            var idPrefix = '_nav-';
            var items = props.items || [];
            var elementId = _.uniqueId();//element.attr('id');
            var pageParams = widgetUiHelper.findPageScope(scope).pageParams;
            // console.log('onInitControl',JSON.stringify(pageParams));
            if (!props.items || props.items.length === 0) {
                props.items = [{link: {}, title: 'Link'}]
            }
            props.items.forEach(function (item) {
                if (item.link) {
                    var link = widgetInteraction.evalPageConfig(item.link, widgetDataUtil.getPageScopeValues(scope));
                    item.__url = pageDataUtil.constructUrl(link.pageId, link.params, true);
                }
            });
            // scope.selected = -1;
            scope.props = props;
            scope.clickItem = clickItem;
            scope.refreshItem = refreshItem;
            if (props.key) {
                // For navigate with browser backward and forward
                // TODO: a input widget which changing page params and location will make nav strange behavior
                scope.$on('$locationChangeSuccess', function navigateWithHistory() {
                    // console.log('activeItemByKey from locationChangeSuccess')
                    activeItemByKey();
                });
                if (items.length > 0) {
                    // console.log('activeItemByKey first time')
                    activeItemByKey();
                }
            } else {
                // console.log('activeItemByKey no key');
                //TODO: optimize the if else
                activeItemByKey();
            }

            /**
             * Activate nav item by location search
             */
            function activeItemByKey() {
                var index = 0;
                var navKey = props.key;
                if (navKey) {
                    var itemKey = $location.search()[navKey] || pageParams[navKey];
                    if (itemKey) {
                        index = _.findIndex(props.items, {key: itemKey});
                        if (index < 0) {
                            // Try use item index as key
                            var number = parseInt(itemKey);
                            if (angular.isNumber(number)) {
                                index = number;
                            }
                        }
                    }
                }
                clickItem(index < 0 ? 0 : index);
            }

            function refreshItem(index, $event) {
                if ($event) $event.preventDefault();
                var itemDivId = generateId(index);
                var item = scope.props.items[index];
                if (!item) return;
                var interaction = item.interaction;
                if (_.isEmpty(interaction)) {
                    return refreshItem_v1(index, $event);
                }
                var contentArea = findTargetElement(interaction, -1);
                var itemDiv = '#' + itemDivId;
                contentArea.find(itemDiv).remove();
                contentArea.append('<div id="' + itemDivId + '" class="h-100"></div>');
                var pageScopeValues = widgetDataUtil.getPageScopeValues(scope);
                var int = angular.extend({}, interaction, {page: {target: itemDiv, ignoreMobileView: true}});
                widgetInteraction.handleInteraction(scope, int, pageScopeValues, {});
                // var config;
                // if (interaction.type === 'url') {
                //     config = {actions: [widgetInteraction.ACTIONS.LINK], link: interaction};
                // } else {
                //     config = {actions: [widgetInteraction.ACTIONS.PAGE], page: interaction};
                // }
                // // console.log('config',config);
                // widgetInteraction.handleInteraction(scope, config, pageScopeValues, {scope: scope});
            }

            function refreshItem_v1(index, $event) {
                if ($event) $event.preventDefault();
                var nowDivId = generateId(index);
                var item = items[index];
                if (!item) return;
                widgetInteraction.handleInteraction(scope, interaction, {});
                var contentArea = element.find('.js-nav-content').eq(0);
                var itemDiv = '#' + nowDivId;
                contentArea.find(itemDiv).remove();
                contentArea.append('<div id="' + nowDivId + '" class="h-100"></div>');
                var interaction = angular.extend({}, item.link || {}, {target: itemDiv, ignoreMobileView: true});
                var config;
                if (interaction.type === 'url') {
                    config = {actions: [widgetInteraction.ACTIONS.LINK], link: interaction};
                } else {
                    config = {actions: [widgetInteraction.ACTIONS.PAGE], page: interaction};
                }
                // console.log('config',config);
                widgetInteraction.handleInteraction(scope, config, widgetDataUtil.getPageScopeValues(scope), {scope: scope});
            }

            function getContentArea() {
                var contentArea;
                if (props.contentTarget) {
                    contentArea = $(props.contentTarget).eq(0);
                } else {
                    contentArea = element.find('.js-nav-content').eq(0);
                }
                return contentArea;
            }

            function findTargetElement(interaction, index) {
                var contentArea;
                if (_.isEmpty(interaction)) {
                    contentArea = element.find('.js-nav-content').eq(0);
                    if (index < 0) {
                        return contentArea;
                    }
                    return contentArea.find('#' + generateId(index));
                } else {
                    var pageTarget = interaction.page.target;
                    var targetIsDiv = pageTarget.indexOf('#') === 0;
                    contentArea = $(pageTarget);
                    // Hide old nav content
                    // contentArea.find('#' + generateId(oldIndex)).hide();
                    // If nav content has been loaded before, make it visible
                    return contentArea.find('#' + generateId(index));
                }
            }

            function clickItem(index, $event) {
                // Stop href behavior
                if ($event) $event.preventDefault();
                if (oldIndex === index) {
                    return;
                }
                scope.selected = index;
                var item = scope.props.items[index];
                var interaction = item.interaction;
                if (_.isEmpty(interaction)) {
                    return clickItem_v1(index, $event);
                }
                if (interaction.actions.indexOf(widgetInteraction.ACTIONS.PAGE)) {
                    var target = findTargetElement(interaction, index);
                    if (target.length > 0) {
                        target.show();
                    } else {
                        refreshItem(index, $event);
                    }
                    oldIndex = index;
                }
            }

            function clickItem_v1(index, $event) {
                // Stop href behavior
                if ($event) $event.preventDefault();
                if (oldIndex === index) {
                    return;
                }
                var contentArea = getContentArea();
                scope.selected = index;
                // Hide old nav content
                contentArea.find('#' + generateId(oldIndex)).hide();
                // If nav content has been loaded before, make it visible
                var target = contentArea.find('#' + generateId(index));
                if (target.length > 0) {
                    target.show();
                } else {
                    refreshItem(index, $event);
                }
                oldIndex = index;
                // Update location will cause wired jumping nav items in CMB. Disable it for now
                updateLocation();

                function updateLocation() {
                    var item = props.items[index];
                    if (!item) return;
                    var navKey = props.key;
                    if (navKey) {
                        var key = item.key || ('' + index);
                        // console.log('updateLocation', key);
                        widgetUiHelper.findPageScope(scope).pageParams[navKey] = key;
                        $location.search(navKey, key);
                    }
                }
            }

            function generateId(index) {
                return idPrefix + elementId + '-' + index;
            }
        }
    }
})();