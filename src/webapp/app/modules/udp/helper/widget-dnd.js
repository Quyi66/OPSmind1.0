/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */

(function () {
    'use strict';

    angular.module('oplus.udp')
        .service('widgetDnd', widgetDnd);

    widgetDnd.$inject = ['$compile', 'widgetUiHelper'];

    /**
     * @ngdoc service
     * @name widgetDnd
     * @param $compile
     * @param widgetUiHelper {widgetUiHelper}
     * @description
     * Handle widget drag and drop.
     */
    function widgetDnd($compile, widgetUiHelper) {
        var WIDGET_DRAG_HANDLE = '.uw-drag';
        // LEO@20171230: Do not use placeholder
        // var SORTABLE_PLACEHOLDER = 'ui-sortable-placeholder';
        // var useJqueryUi = false;
        var SORTABLE_GROUP_NAME = 'rowandcol';
        var swapThreshold = 0.5;
        var columnTarget = '#pd-canvas-zone .uw-row',
            flexTarget = '#pd-canvas-zone .uw-column, #pd-canvas-zone',
            rowTarget = '#pd-canvas-zone .uw-column, #pd-canvas-zone',
            floatTarget = '#pd-canvas-zone',
            widgetTarget = '#pd-canvas-zone .uw-column, #pd-canvas-zone .uw-float';
        this.initPaletteDnd = initPaletteDnd;
        this.initCanvasDnd = initCanvasDnd;

        function toggleDraggingStatus(isDragging) {
            var canvasZone = $('#pd-canvas-zone');
            if (isDragging) {
                canvasZone.addClass('udp-pd-dragging');
            } else {
                canvasZone.removeClass('udp-pd-dragging');
            }
        }


        /**
         * Init drag and drop for widget symbol in palette
         */
        function initPaletteDnd() {
            $('.js-udp-palette-group').each(function () {
                var elem = $(this);
                new Sortable(elem[0], {
                    group: {
                        name: SORTABLE_GROUP_NAME,
                        pull: 'clone',
                        put: false // Do not allow items to be put into this list
                    },
                    // handle:'.uw-drag',
                    // To disable sorting: set sort to false
                    sort: false,
                    animation: 300,
                    onStart: function (event) {
                        toggleDraggingStatus(true);
                    },
                    onEnd: function dragStop(event) {
                        toggleDraggingStatus(false);
                        var placeholder = angular.element(event.item);
                        var isReverted = placeholder.closest('#pd-palette-zone').length > 0;
                        if (isReverted) {
                            // console.log('Revert invalid drop');
                            return false;
                        }
                        var type = $(event.item).attr('uw-type');
                        var isLayout = widgetUiHelper.isLayoutWidget(type);
                        var widget;
                        if (isLayout) {
                            widget = $('<div widget-layout="' + type + '"></div>').widgetUid();
                        } else {
                            widget = $('<uwidget></uwidget>');
                            widget.attr('uw-type', placeholder.attr('uw-type'))
                                .attr('uw-props', placeholder.attr('uw-props'));
                            widget.widgetUid();
                        }
                        // Replace helper with clone before $compile because widget may use parent DOM info when link
                        // e.g., layout-col need find parent uw-row to determine resize containment
                        placeholder.replaceWith(widget);
                        // Find page scope by any element within <udp-page-view>
                        var pageScope = angular.element('udp-page-view > *').scope();
                        // console.log('compile_begin...', pageScope, widget.prop('outerHTML'));
                        if (!pageScope){
                            console.error('Cannot find page scope from udp-page-view');
                        }
                        $compile(widget)(pageScope);
                        // console.log('compile_end...');
                        makeRowColSortable(widget);
                    }
                });

            });
        }

        /**
         * Init drag and drop for widgets in canvas
         * Only float layout need draggable, others are sortable.
         */
        function initCanvasDnd(scope) {
            var canvas = $('#pd-canvas-zone');
            var $rows = canvas.find('[widget-layout="layout-row"]'),
                $columns = canvas.find('[widget-layout="layout-col"]'),
                $flexes = canvas.find('[widget-layout="layout-flex"]'),
                $floats = canvas.find('[widget-layout="layout-float"]'),
                $widgets = canvas.find('uwidget.uwidget');
            var elements = [
                // {objs: $rows, target: rowTarget},
                // {objs: $widgets, target: widgetTarget},
                {objs: $floats, target: floatTarget},
                // {objs: $flexes, target: flexTarget},
                // {objs: $columns, target: columnTarget}
            ];
            elements.forEach(function (el) {
                el.objs.each(function () {
                    var obj = $(this);
                    // var isFloat = obj.attr('widget-layout') === 'layout-float';
                    // var isFlex = obj.attr('widget-layout') === 'layout-flex';
                    var options = {
                        // handle: WIDGET_DRAG_HANDLE,
                        // helper:'clone',
                        // revert: 'invalid',
                        start: function () {
                            console.log('initCanvasDnd.dragStart');
                        },
                        stop: function (e, t) {
                            // if (!isFloat) {
                            //     // A temp way to remove jquery ui plugin generated style (position, size)
                            //     t.helper.removeAttr('style');//.before('\n');
                            // }
                        }
                    };
                    // if (isFloat) {
                    //     options.handle = undefined;//'.uw-body,.uw-drag';
                    // } else {
                    //     if (isFlex) {
                    //         options.connectToSortable = '#pd-canvas-zone, #pd-canvas-zone :not(#' + obj.attr('id') + ') .uw-column';
                    //         options.connectToSortable = '#pd-canvas-zone :not(#' + obj.attr('id') + ') .uw-column';
                    //         // options.connectToSortable = '#pd-canvas-zone';
                    //         console.log('options.sortable', options.connectToSortable);
                    //     } else {
                    //         options.connectToSortable = el.target;
                    //     }
                    // }
                    obj.draggable(options);
                });
            });
            // var cssLayoutFloat = "uwtype-layout-float";
            // $("#xpd-canvas-zone").droppable({
            //     accept: '.' + cssLayoutFloat,
            //     drop: function (event, ui) {
            //         console.log('drop stop', ui, $(this).offset());
            //         if (ui.helper.hasClass(cssLayoutFloat)) {
            //             var clone = $('<div widget-layout="layout-float"></div>').widgetUid();
            //             //TODO: bug, clone position is inaccurate as the drop position
            //             clone.attr('style', ui.helper.attr('style'));
            //             $('#pd-canvas-zone').append($compile(clone)(scope));
            //             // Make the float sortable as widget container
            //             // TODO: will it duplicate sortable??
            //             makeRowColSortable();
            //             // ui.helper.replaceWith(clone);
            //         }
            //     }
            // });
            makeCanvasSortable();
            makeRowColSortable();
            makeFloatResizable();
        }

        function makeFloatResizable() {
            $('[widget-layout="layout-float"]', '#pd-canvas-zone')
                .resizable();
        }

        function makeCanvasSortable() {
            new Sortable(document.getElementById('pd-canvas-zone').querySelector('.js-page-content'), {
                group: SORTABLE_GROUP_NAME,
                handle: '.uw-drag',
                swapThreshold: swapThreshold
            });
        }

        function makeRowColSortable(element) {
            var selectors = [
                {
                    source: '#pd-canvas-zone .uw-row',
                    target: 'page,col'
                },
                {
                    source: '#pd-canvas-zone .uw-column:not(.uw-flex)',
                    target: 'row'
                },
                {
                    source: '#pd-canvas-zone .uw-float',
                    target: 'page'
                },
                {
                    source: '#pd-canvas-zone .uw-include-container',
                    target: 'page'
                },
                {
                    source: '#pd-canvas-zone .uw-flex',
                    target: 'page,col'
                }
            ];
            selectors.forEach(function (selector) {
                $(selector.source).each(function () {
                    // var elem = $(this);
                    var sortOptions = {
                        group: SORTABLE_GROUP_NAME,
                        handle: '.uw-drag',
                        animation: 300,
                        fallbackOnBody: true,
                        swapThreshold: swapThreshold,
                        onStart: function () {
                            toggleDraggingStatus(true);
                        }, onEnd: function () {
                            toggleDraggingStatus(false);
                        }
                    };
                    // var isFlex = elem.hasClass('uw-flex');
                    // if (isFlex) {
                    // console.log('widget',elem,elem.closest('.uwtype-layout-flex'));
                    // var widgetId = elem.closest('.uwtype-layout-flex').attr('id');
                    // sortOptions.connectWith = '#pd-canvas-zone, #pd-canvas-zone :not(#' + widgetId + ') .uw-flex';
                    // sortOptions.connectWith = '#w-15868656053151 .uw-flex';
                    // }
                    new Sortable(this, sortOptions);
                });
            });
        }
    }
})();
