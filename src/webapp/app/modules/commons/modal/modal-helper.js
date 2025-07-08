/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/06/10, created
 */
(function () {
        'use strict';

        angular.module('oplus.commons').service('modalHelper', ['$uibModal', '$timeout', '$uibModalStack', modalHelper]);

        /**
         * @ngdoc service
         * @name modalHelper
         * @param $uibModal
         * @param $timeout
         * @param $uibModalStack
         */
        function modalHelper($uibModal, $timeout, $uibModalStack) {
            var MODALESS_CSS = 'opx-modaless';
            var MAX_CSS = 'maximized';
            var ENABLE_RESIZE_CSS = 'op-enable-resize';
            this.openModal = openModal;
            this.closeTop = closeTop;
            this.maximizeOrRestoreModal = maximizeOrRestoreModal;
            // this.openSimpleModal = openSimpleModal;
            this.bringModalessToFront = bringModalessToFront;

            /**
             * Bootstrap modal structure is
             * .modal
             *   .modal-dialog
             *      .modal-content
             *        - .modal-header
             *        - .modal-body
             *        - .modal-footer
             * In modal mode, .modal is always 100% width and height, the target of drag/resize is `.modal-dialog`
             * In modaless mode, the target of drag/resize is `.modal` element
             * @param {*} any Anything inside modal or modal itself. It shall be a valid jquery selector.
             * @return {{modaless:boolean, element:jQuery}}
             */
            function getDragResizeTarget(any) {
                var modal;
                var target;
                var isModaless = false;
                if (any) {
                    modal = $(any);
                } else {
                    modal = $('.modal').eq(0);
                }
                if (modal.length === 0) {
                    console.warn('ProgramError: Cannot find .modal as draggable and resizable target');
                    return null;
                }
                if (!modal.hasClass('modal')) {
                    modal = modal.closest('.modal');
                }
                // If this is modaless, target is modal
                // If this is modal, target is modal-dialog
                if (modal.hasClass(MODALESS_CSS)) {
                    isModaless = true;
                    target = modal;
                } else {
                    target = modal.find('.modal-dialog');
                }
                return {element: target, modaless: isModaless};
            }

            /**
             *
             * @param {jQuery} theModal Modaless modal with class '.modal.opx-modaless'
             */
            function bringModalessToFront(theModal) {
                var reset = false;

                if (reset) {
                    resetAllModalessZindexFromZero(theModal);
                } else {
                    swapModalessZindex(theModal);
                }

                function swapModalessZindex(theModal) {
                    var modals = [];
                    var theZindex;
                    $('.' + MODALESS_CSS).each(function () {
                        var elem = $(this);
                        var zindex = parseInt(elem.css('z-index'));
                        modals.push({zindex: zindex, elem: elem});
                        if (elem.is(theModal)) {
                            theZindex = zindex;
                        }
                    });
                    // console.warn('swapModalessZindex: theZindex=%o', theZindex);
                    var sortedModals = _.sortBy(modals, ['zindex']);
                    var maxZindex = sortedModals[sortedModals.length - 1].zindex;
                    for (var i = 0; i < sortedModals.length; i++) {
                        var o = sortedModals[i];
                        if (o.zindex > theZindex) {
                            o.elem.css('z-index', sortedModals[i - 1].zindex);
                            o.elem.removeClass('active');
                        }
                    }
                    // sortedModals.forEach(function (o, index) {
                    //     o.elem.css('z-index', zindex++).removeClass('active');
                    // });
                    // console.log('....bringModalessToTop: ',modal);
                    theModal.css('z-index', maxZindex).addClass('active').show();
                }

                function resetAllModalessZindexFromZero(theModal) {
                    // Rewrite z-index from 0
                    // 20220109: when a modaless is opened by a modal, rewrite z-index from 0 will cause problem.
                    // Modaless z-index changed, but modal's not.
                    var modals = [];
                    $('.' + MODALESS_CSS).each(function () {
                        var elem = $(this);
                        if (!elem.is(theModal)) {
                            modals.push({zIndex: parseInt(elem.css('z-index')), elem: elem});
                        }
                    });
                    var zindex = 1;
                    _.sortBy(modals, ['zIndex']).forEach(function (o, index) {
                        o.elem.css('z-index', zindex++).removeClass('active');
                    });
                    // console.log('....bringModalessToTop: ',modal);
                    theModal.css('z-index', zindex).addClass('active').show();
                }
            }

            function openSimpleModal(config) {
                //TODO
            }

            function calcMaxLayout(isModaless) {
                var headerHeight = '40px';
                var styles = {
                    left: '0',
                    top: isModaless ? headerHeight : '0',
                    width: '100%',
                    height: 'calc(100% - ' + headerHeight + ')'
                };
                return {styles: styles};
            }

            /**
             * Maximize or restore window size.
             * @param {*} any Anything inside the modal. It shall be a valid jQuery selector.
             * @param {boolean=} forceMax true to force maximize window, otherwise toggle between maximize and restore
             * @return {boolean} true for maximized
             */
            function maximizeOrRestoreModal(any, forceMax) {
                var ret = getDragResizeTarget(any);
                var target = ret.element;
                var isModaless = ret.modaless;
                var dataKey = 'origstyles';
                if (forceMax === true || !target.hasClass(MAX_CSS)) {
                    var pos = target.position();
                    target.data(dataKey, {left: pos.left, top: pos.top, width: target.width(), height: target.height()})
                    var maxLayout = calcMaxLayout(isModaless);
                    target.addClass(MAX_CSS)
                        .addClass(ENABLE_RESIZE_CSS)
                        .css(maxLayout.styles);
                } else {
                    var styles = target.data(dataKey);
                    target.removeClass(MAX_CSS).css(styles);
                }
                var maximized = target.hasClass(MAX_CSS);
                setMaxIconAndCss(target, maximized);
                return maximized;
            }

            function setMaxIconAndCss(modalElem, maximized) {
                var iconElem = modalElem.find('.js-maxrestore i');
                console.log('setMaxIconAndCss: iconElem=%o', iconElem.length);
                if (maximized) {
                    iconElem.removeClass('fa-window').addClass('fa-window-restore');
                } else {
                    iconElem.removeClass('fa-window-restore').addClass('fa-window');
                }
            }


            function closeTop() {
                // Close top modal if exists
                var top = $uibModalStack.getTop();
                if (top) {
                    $uibModalStack.dismiss(top.key);
                }
            }

            /**
             * Open a modal dialog. By default it is static, draggable, resizable
             * @param {object} config
             * @param {string=} config.template
             * @param {string=} config.templateUrl
             * @param {*} config.controller
             * @param {string=} config.controllerAs
             * @param {string=} config.size
             * @param {boolean} config.modaless Default is false
             * @param {string=} config.position 'center'
             * @param {object=} options
             * @param {function(*)=} options.onOk Function to call when close the modal with result data. Parameter is result.
             * @param {function=} options.onCancel Function to call when close the modal with cancel. No parameter.
             * @param {boolean=} options.draggable Default is true
             * @param {boolean=} options.resizable Default is false
             * @param {string|{width:string,height:string,aspectRatio:number}} options.specSize
             * @param {function=} options.onModalessActivated Callback function executed when modaless activated
             * @returns {*} Modal instance
             */
            function openModal(config, options) {
                config = _.extend({}, {
                    backdrop: 'static',
                    // backdropClass: 'op-fixed-backdrop',
                    modaless: false
                }, config);
                // config = _.extend({}, {backdrop: false, modaless: false}, config);
                options = _.extend({}, {draggable: true, resizable: false}, options);
                if (!config.controller) {
                    config.controller = [function () {
                        this.cancel = function () {
                            modalInstance.dismiss();
                        }
                    }];
                    config.controllerAs = '$ctrl';
                }
                if (config.modaless) {
                    config.backdrop = false;
                    // Default: true - Indicates whether the dialog should be closable by hitting the ESC key.
                    config.keyboard = false;
                    config.windowClass = MODALESS_CSS + ' ' + (config.windowClass || '');
                }
                var modalInstance = $uibModal.open(config);
                modalInstance.result.then(function close(result) {
                    if (angular.isFunction(options.onOk)) {
                        options.onOk(result);
                    }
                }, function dismiss() {
                    if (angular.isFunction(options.onCancel)) {
                        options.onCancel();
                    }
                });
                modalInstance.opened.then(function () {
                    // console.log('modalHelper.opened....');
                    var target = getDragResizeTarget().element;
                    if (config.size) {
                        target.addClass('modal-' + config.size);
                    }
                    resetModalSize(options.specSize, target);
                    if (options.specSize === 'FILL_CONTENT') {
                        // setMaxIconAndCss(target,true);
                    } else if (config.modaless) {
                        resetModalPosition(target);
                    }
                });
                modalInstance.rendered.then(function () {
                    function moveModalBackdropBack() {
                        // If we open a modaless from a modal
                        // uibModal will dynamically increase z-index of the modal backdrop
                        // We need move the backdrop back
                        //TODO: still has problem
                        // modal_1 --> open modaless_1, modal_1 is still clickable
                        // open modal_2 from modal_1 or modaless_1
                        // close modal_2, modal_1 is NOT clickable
                        var modals = $('.modal:not(.opx-modaless)');
                        var zindexes = _.map(modals, function (elem) {
                            return parseInt($(elem).css('z-index'));
                        });
                        var max = _.max(zindexes);
                        $('.modal-backdrop').css('z-index', max - 10);
                    }

                    if (config.modaless) {
                        moveModalBackdropBack();
                    }
                    // console.log('modalHelper.rendered...........')
                    var target = getDragResizeTarget();
                    if (options.specSize === 'FILL_CONTENT') {
                        // maximizeOrRestoreModal(target,true);
                    }
                    var targetEl = target.element;
                    if (options.draggable) {
                        targetEl.draggable({
                            handle: '.modal-header:eq(0)',
                            start: function (event, ui) {
                                targetEl.removeClass(MAX_CSS);
                                setMaxIconAndCss(targetEl, false);
                            }
                        });
                    }
                    if (options.resizable) {
                        // targetEl.resizable({minHeight: 400, minWidth: 640, handles: 'all'});
                        targetEl.resizable({
                            minHeight: 160, minWidth: 200, handles: 'all',
                            start: function (event, ui) {
                                targetEl.removeClass(MAX_CSS);
                                setMaxIconAndCss(targetEl, false);
                            }
                        });
                        buildModalControlButtons(targetEl);
                    }
                    if (config.modaless) {
                        // targetEl.on('click', '.modal-header', function activateModaless() {
                        targetEl.on('click', '.modal-content', function activateModaless() {
                            bringModalessToFront(targetEl);
                            options.onModalessActivated && options.onModalessActivated();
                        });
                    }

                    function buildModalControlButtons(modal) {
                        // Dynamic add button
                        var modalHeader = modal.find('.modal-header');
                        var buttonClose = modalHeader.find('.btn-close');
                        if (buttonClose.length === 0) {
                            buttonClose = modalHeader.find('.op-close-window');
                        }
                        if (buttonClose.length === 0) {
                            console.warn('Cannot find close button in modal-header. `.modal-header` is %c%s', 'color:orange', modalHeader.prop('outerHTML'));
                        } else {
                            buttonClose.removeClass('btn-close').addClass('btn btn-default op-close-window opx-btn-flat opx-btn-icon').html('<i class="far fa-times"></i>');
                        }
                        if (options.minimizable) {
                            var buttonMin = $('<button type="button" class="btn btn-default opx-btn-flat opx-btn-icon js-min" ng-click="$ctrl.minimizeWindow($event)"><i class="far fa-minus"></i></button>');
                            insertButton(buttonMin);
                        }
                        if (options.resizable) {
                            var buttonMax = $('<button type="button" class="btn btn-default opx-btn-flat opx-btn-icon js-maxrestore" ng-click="$ctrl.maximizeWindow($event)"><i class="far fa-window"></i></button>');
                            buttonMax.on('click', function () {
                                var modalElem = $(this).closest('.modal');
                                var maximized = maximizeOrRestoreModal(modalElem);
                                setMaxIconAndCss(modalElem, maximized);
                            });
                            insertButton(buttonMax);
                        }

                        function insertButton(button) {
                            if (buttonClose.length > 0) {
                                button.insertBefore(buttonClose);
                            } else {
                                button.appendTo(modalHeader);
                            }
                        }
                    }
                });
                return modalInstance;

                function resetModalPosition(target) {
                    var pos = centerInContainer(target, $('body'), {top: 40});
                    target.css(pos);

                    /**
                     * Place an element in center of container
                     * @param target
                     * @param container
                     * @param {{top:number}} offset
                     * @return {{top: string, left: string}} In percent
                     */
                    function centerInContainer(target, container, offset) {
                        var containerSize = {width: container.width(), height: container.height()};
                        var SPACE = 16;
                        var tolerance = SPACE / 4;
                        var left = (containerSize.width - target.width()) / 2;
                        var top = (containerSize.height - target.height()) / 2;
                        var targetHeight = target.height();
                        if (target.height() === 0) {
                            // Content is not rendered yet
                            top = SPACE * 2;
                        }
                        // console.log('target.size: width=%s,height=%s', target.width(), target.height());
                        var refWindow = getTopModaless();
                        if (refWindow) {
                            var pos = refWindow.position();
                            if (Math.abs(pos.left - left) < tolerance) {
                                left += SPACE;
                            }
                            if (Math.abs(pos.top - top) < tolerance) {
                                top += SPACE;
                            }
                        }
                        // debugger;
                        // top = top + offset.top;
                        var leftPercent = (left / containerSize.width) * 100;
                        var topPercent = (top / containerSize.height) * 100;
                        return {left: leftPercent + '%', top: topPercent + '%'};
                    }

                    function getTopModaless() {
                        var top;
                        var max = 0;
                        $('.' + MODALESS_CSS).each(function () {
                            var elem = $(this);
                            var zIndex = parseInt(elem.css('z-index'));
                            // console.log('zindex', zIndex);
                            if (zIndex > max && !elem.is(target)) {
                                max = zIndex;
                                top = elem;
                            }
                        });
                        return top;
                    }
                }

                /**
                 *
                 * It will change target style of width and height
                 * @param {string|object} size
                 * @param target
                 * @param {string|number} size.height
                 * @param {string|number} size.width
                 * @param {number} size.aspectRatio
                 */
                function resetModalSize(size, target) {
                    if (size === 'FILL_CONTENT') {
                        var styles = calcMaxLayout(true).styles;
                        target.css(styles);
                        return;
                    }
                    if (!angular.isObject(size)) {
                        return;
                    }
                    if (!size.width && !size.height) {
                        return;
                    }
                    var result = {height: 0, width: 0, left: -1};
                    if (size.height) {
                        result.height = size.height;
                        target.css('height', result.height);
                    }
                    if (size.width) {
                        result.width = size.width;
                        target.css('width', result.width);
                    }
                    var container = $('body');
                    var containerSize = {width: container.width(), height: container.height()};
                    if (result.width && result.height) {
                        // Ignore aspect ratio
                    } else if (size.aspectRatio) {
                        var width, height;
                        if (result.height) {
                            width = target.height() * size.aspectRatio;
                            if (width > containerSize.width) {
                                width = containerSize.width;
                                height = width / size.aspectRatio;
                            }
                            target.css({width: width, height: height});
                        } else if (result.width) {
                            height = target.width() / size.aspectRatio;
                            if (height > containerSize.height) {
                                height = containerSize.height;
                                width = height * size.aspectRatio;
                            }
                            target.css({width: width, height: height});
                        }
                    }
                }
            }
        }
    }

)();
