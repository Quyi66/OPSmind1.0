/**
 * Modified from https://github.com/summernote/awesome-summernote/issues/33
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/09/13
 */
(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {

    // fontawesome icon picker plugin
    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        'faicon': function (context) {
            var iconStyle = 'fa';
            var self = this;
            var ui = $.summernote.ui;
            var options = context.options;

            // font-awesome: version 4.7.0; removed aliases
            // var fa_icons = {
            //     "address-book": "\uf2b9",
            //     "address-card": "\uf2bb",
            //     "adjust": "\uf042",
            //     "adn": "\uf170",
            //     "align-center": "\uf037",
            //     "align-justify": "\uf039",
            //     "align-left": "\uf036",
            //     "align-right": "\uf038",
            //     "amazon": "\uf270",
            //     "ambulance": "\uf0f9",
            //     "american-sign-language-interpreting": "\uf2a3",
            //     "anchor": "\uf13d",
            //     "android": "\uf17b",
            //     "angellist": "\uf209",
            //     "angle-double-down": "\uf103",
            //     "angle-double-left": "\uf100",
            //     "angle-double-right": "\uf101",
            //     "angle-double-up": "\uf102",
            //     "angle-down": "\uf107",
            //     "angle-left": "\uf104",
            //     "angle-right": "\uf105",
            //     "angle-up": "\uf106",
            //     "apple": "\uf179",
            //     "archive": "\uf187",
            //     "area-chart": "\uf1fe",
            //     "arrow-circle-down": "\uf0ab",
            //     "arrow-circle-left": "\uf0a8"
            // };

            // add context menu button
            context.memo('button.faicon', function () {
                return ui.buttonGroup({
                    className: 'note-ext-faicon',
                    children: [
                        ui.button({
                            // className: 'dropdown-toggle',
                            contents: '<i class="far fa-smile"/>' + ' ' + ui.icon(options.icons.caret, 'span'),
                            tooltip: 'Icon',
                            data: {
                                toggle: 'dropdown'
                            },
                            click: function (e) {
                                // Cursor position must be saved because is lost when search is clicked
                                context.invoke('editor.saveRange');
                                var elem = $(this);
                                if (!elem.data('iconpicker')) {
                                    createIconPicker(elem);
                                }

                                function createIconPicker(elem) {
                                    var options = {
                                        icons: window['@oplus/icons'],
                                        hideOnSelect: true,
                                        inputSearch: true,
                                        component: '.js-iconpicker-component',
                                        defaultValue: undefined,
                                        // fontAwesome5: true,
                                        fullClassFormatter: function (e) {
                                            return iconStyle + ' ' + e;
                                        },
                                        // container: 'body',
                                        placement: 'bottomLeft'
                                    };
                                    elem.iconpicker(options);
                                    elem.on('iconpickerSelected', function (event) {
                                        var iconClass = event.iconpickerValue;
                                        var iconName = iconClass.substring(3);
                                        var hexcode;
                                        for (var i = 0; i < window['@oplus/icons'].length; i++) {
                                            if (window['@oplus/icons'][i].name === iconName) {
                                                hexcode = window['@oplus/icons'][i].unicode;
                                                break;
                                            }
                                        }
                                        hexcode = '&#x' + hexcode;
                                        context.invoke('faicon.insertIcon', iconName, hexcode);
                                    });
                                }
                            }
                        })
                        // ui.dropdown({
                        //     className: 'dropdown-faicon',
                        //     items: [
                        //         '<li>',
                        //         '<div class="xxxbtn-group">',
                        //         '  <div class="note-ext-faicon-search">',
                        //         '  <input type="text" placeholder="search..." class="form-control" />',
                        //         '  </div>',
                        //         '  <div class="note-ext-faicon-list" />',
                        //         '</div>',
                        //         '</li>'
                        //     ].join(''),
                        //     callback: function ($dropdown) {
                        //         self.$search = $('.note-ext-faicon-search :input', $dropdown);
                        //         self.$list = $('.note-ext-faicon-list', $dropdown);
                        //     }
                        // })
                    ]
                }).render();
            });
            //
            //
            // // You can create elements for plugin
            // self.initialize = function () {
            //     //LEO@20200913: to work with angular-summernote
            //     if (!self.$search) {
            //         return
            //     }
            //     var $search = self.$search;
            //     var $list = self.$list;
            //
            //     // fill/activate the elements in the inline dialog.
            //     self.$search.keyup(function () {
            //         self.filter($search.val());
            //     });
            //
            //     // create icons by list
            //     $.each(fa_icons, function (icon_name, hex_code) {
            //         $list.append('<button title="' + icon_name + '" data-hexcode="' + hex_code + '"><i class="fa fa-' + icon_name + '"></i></button>');
            //     });
            //
            //     $("button", $list).click(function (event) {
            //         var $button = $(this);
            //         event.preventDefault(); // else, editor form is submitted
            //         context.invoke('faicon.insertIcon', $button.attr('title'), $button.data("hexcode"));
            //     });
            // };


            // // apply search filter on each key press in search input
            // self.filter = function (filter) {
            //     var $icons = $('button', self.$list);
            //     var rx_filter;
            //
            //     if (filter === '') {
            //         $icons.show();
            //     } else {
            //         rx_filter = new RegExp(filter);
            //         $icons.each(function () {
            //             var $item = $(this);
            //
            //             if (rx_filter.test($item.attr('title'))) {
            //                 $item.show();
            //             } else {
            //                 $item.hide();
            //             }
            //         });
            //     }
            // };

            /**
             *
             * https://www.zhihu.com/question/21390312
             * https://en.wikipedia.org/wiki/Numeric_character_reference
             * https://en.wikipedia.org/wiki/List_of_Unicode_characters
             * @param iconName
             * @param hexCode NCR in format "&#Xhhhh"
             */
            self.insertIcon = function (iconName, hexCode) {
                // var $fa = $('<span class="ext-faicon-subst fa">' + hex_code + '</span>').attr("data-icon", icon_name);
                // LEO@20200913: Use hex code as HTML entity in order to make content selectable.
                // Pure <span class="fa fa-icon"></span> cannot select text.
                var $fa = $('<span class="' + iconStyle + ' __' + iconName + '">' + hexCode + '</span>');

                // We restore cursor position and element is inserted in correct pos.
                context.invoke('editor.restoreRange');
                context.invoke('editor.focus');
                context.invoke('editor.insertNode', $fa[0]);
            };
        }
    });
}));