/**
 *
 * Modified based on
 * https://github.com/gabrieltomescu/bootstrap-responsive-tabs
 * http://home.golden.net/~tomescu/bootstrap-responsive-tabs/demo/
 * @author Leo Liao (leoliaolei@gmail.com), created on 1/2/2019
 */
(function ($) {
    $.fn.responsiveTabs = function (options) {
        var settings = $.extend({
            // These are the defaults.
            minTabWidth: "80",
            maxTabWidth: "150"
        }, options);
        var methods = {destroy: destroy, setActive: setActive};

        function destroy() {
            //TODO
        }

        function setActive(index) {
            //TODO
        }

        // Main functions for each instantiated responsive tabs
        this.each(function () {
            initElement($(this));
        });

        function initElement(ulElem) {
            var THIS = {
                activeTabIndex: 0,
                $ddMenu: undefined,
                $tabMenu: $(ulElem)
            };
            var $container = $('<div class="rt-tabs-container"></div>');
            THIS.$tabMenu.addClass("rt-tabs").wrap($container).wrap('<div class="rt-tabs-wrapper"></div>');
            // Wait some time for element rendering to get correct width
            setTimeout(function () {
                setup();
            }, 50);

            function updateTabs() {
                var totalWidth = THIS.$tabMenu.width();
                // Determine which tabs to show/hide
                var $tabItems = THIS.$tabMenu.children('li');
                var usedWidth = 0, numVisibleVerticalTabs = 0;
                var activeTabWidth = $tabItems.eq(THIS.activeTabIndex).outerWidth();
                for (var i = 0; i < $tabItems.length; i++) {
                    var thisTab = $tabItems.eq(i);
                    var tabIndex = i;// horizontalTab.index();//attr("tab-id");
                    var ddTab = THIS.$ddMenu.find(".js-tab[tab-index=" + tabIndex + "]");
                    var visible;
                    // isVisible = i < numVisibleHorizontalTabs;
                    var tabWidth = thisTab.outerWidth();
                    usedWidth += tabWidth;
                    // console.log('check', usedWidth, tabWidth, totalWidth, thisTab.prop('outerHTML'));

                    if (tabIndex < THIS.activeTabIndex) {
                        visible = usedWidth + activeTabWidth <= totalWidth;
                    } else if (tabIndex === THIS.activeTabIndex) {
                        visible = true;
                    } else {
                        visible = usedWidth <= totalWidth;
                    }
                    if (visible === false) {
                        numVisibleVerticalTabs++;
                    }
                    // console.log('activeId', TABS_OBJECT.activeTabId, tabId, isVisible, horizontalTab.text());
                    // console.log('usedWidth', menuWidth, horizontalTab.width(), horizontalTab.text(), usedWidth, isVisible);


                    thisTab.toggleClass('invisible', !visible);
                    ddTab.toggleClass('invisible', visible);
                }

                // Toggle the Tabs dropdown if there are more tabs than can fit in the tabs horizontal container
                var hasVerticalTabs = (numVisibleVerticalTabs > 0);
                THIS.$tabMenu.closest('.rt-tabs-container').toggleClass('rt-has-more', hasVerticalTabs);
                if (hasVerticalTabs)
                    THIS.$ddMenu.siblings(".dropdown-toggle").find(".count").html('<span class="badge bg-secondary">' + numVisibleVerticalTabs + '</span>');

                // Make 'active' tab always visible in horizontal container
                // and hidden in vertical container
                var activeTab = THIS.$tabMenu.find(".js-tab[tab-index=" + THIS.activeTabIndex + "]");
                var activeTabCurrentIndex = activeTab.index();
                var activeTabDefaultIndex = activeTab.attr("tab-index");
                var lastVisibleHorizontalTab = THIS.$tabMenu.find(".js-tab:visible").last();
                var lastVisibleTabIndex = lastVisibleHorizontalTab.index();

                if ((activeTabCurrentIndex < activeTabDefaultIndex) && (activeTabCurrentIndex < lastVisibleTabIndex)) {
                    activeTab.insertAfter(lastVisibleHorizontalTab);
                }
            }

            function setup() {
                // Reset all tabs for calc function
                var $tabs = THIS.$tabMenu.children('li');

                // Stop function if there are no tabs in container
                if ($tabs.length === 0) {
                    return;
                }

                // Mark each tab with a 'tab-id' for easy access
                $tabs.each(function (i) {
                    var tabIndex = $(this).index();
                    $(this)
                        .addClass("js-tab")
                        // .attr("tab-id", i + 1)
                        .attr("tab-index", tabIndex);
                });

                // Attach a dropdown to the right of the tabs bar
                // This will be toggled if tabs can't fit in a given viewport size

                // $tabsWrapper used
                var $tabsWrapper = THIS.$tabMenu.parent();
                $tabsWrapper.after('<div class="dropdown rt-tabs-dropdown js-rt-tabs-dropdown"> \
              <a href="javascript:void(0);" class="dropdown-toggle" data-bs-toggle="dropdown"><i class="fa fa-chevron-circle-right"></i></a> \
              <ul class="dropdown-menu dropdown-menu-end" role="menu"> \
              <div class="dropdown-header visible-xs">\
                <p class="count">Tabs</p> \
                <button type="button" class="btn-close" data-dismiss="dropdown"><span aria-hidden="true"></span></button> \
                <div class="divider visible-xs"></div> \
              </div> \
              </ul> \
            </div>');

                // Clone each tab into the dropdown
                // TABS_OBJECT.tabsVerticalContainer = TABS_OBJECT.tabsHorizontalContainer.siblings(".rt-tabs-dropdown").find(".dropdown-menu");
                var cloned = $tabs.clone();
                THIS.$ddMenu = $tabsWrapper.siblings(".rt-tabs-dropdown").find(".dropdown-menu").append(cloned);
                // cloned.appendTo(THIS.$ddMenu);
                // LEO:Mimic click
                cloned.on('click', 'a', function (e) {
                    var $li = $(this).parent();
                    var tabIndex = parseInt($li.attr('tab-index'));
                    var $tabItem = $tabs.eq(tabIndex);
                    $tabItem.find('a').trigger('click');
                    e.preventDefault();
                });

                // Update tabs
                updateTabs();
            }


            /**
             * Change Tab
             */
            change_tab();

            function change_tab(e) {
                var $container = THIS.$tabMenu.closest(".rt-tabs-container");
                // console.log('$container',$container);
                $container.on("click", ".rt-tabs .js-tab", function (e) {
                    var target = $(e.target);
                    THIS.activeTabIndex = parseInt($(this).attr('tab-index'));

                    // Update tab 'active' class for horizontal container if tab is clicked
                    // from dropdown. Otherwise Bootstrap handles the normal 'active' class placement.
                    var verticalTabSelected = target.parents(".dropdown-menu").length > 0;
                    if (verticalTabSelected) {
                        THIS.$tabMenu.find(".js-tab").removeClass("active");
                        var activeH = THIS.$tabMenu.find(".js-tab[tab-index=" + THIS.activeTabIndex + "]");
                        // console.log('activeH', activeH);
                        activeH.addClass("active");
                    }

                    THIS.$ddMenu.find(".js-tab").removeClass("active");

                    // Call 'sort_tabs' to re-arrange tabs based on their original index positions
                    // Call 'update_tabs' to resize tabs and determine which one to show/hide
                    // sortTabs(THIS.$tabMenu);
                    // sortTabs(THIS.$ddMenu);
                    updateTabs();
                });
            }

            // Update tabs on window resize
            var timer;
            $(window).resize(function () {
                // wait_for_repeating_events(function () {
                timer = setTimeout(function () {
                    updateTabs();
                    clearTimeout(timer);
                }, 500);
                // /*}, 300, "Resize Tabs"*/);
            });

            // Helper function to sort tabs base on their original index positions
            function sortTabs($tabsContainer) {
                var $tabs = $tabsContainer.find(".js-tab");
                $tabs.sort(function (a, b) {
                    return +a.getAttribute('tab-index') - +b.getAttribute('tab-index');
                });
                $tabsContainer.detach(".js-tab").append($tabs);
            }
        }
    };
})(jQuery);
