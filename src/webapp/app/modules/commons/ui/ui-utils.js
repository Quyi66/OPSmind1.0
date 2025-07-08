/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 1/18/2019
 */

// var previousScrollY = 0;
(function () {
    'use strict';

    // fixModalScrollOnIOS();

    /**
     * https://stackoverflow.com/questions/43563795/bootstrap-modal-background-scroll-on-ios
     */
    // function fixModalScrollOnIOS() {
    //     $(document).on('show.bs.modal', function () {
    //         previousScrollY = window.scrollY;
    //         $('html').addClass('modal-open').css({
    //             marginTop: -previousScrollY,
    //             overflow: 'hidden',
    //             left: 0,
    //             right: 0,
    //             top: 0,
    //             bottom: 0,
    //             position: 'fixed'
    //         });
    //     }).on('hidden.bs.modal', function () {
    //         $('html').removeClass('modal-open').css({
    //             marginTop: 0,
    //             overflow: 'visible',
    //             left: 'auto',
    //             right: 'auto',
    //             top: 'auto',
    //             bottom: 'auto',
    //             position: 'static'
    //         });
    //         window.scrollTo(0, previousScrollY);
    //     });
    // }

    window.$oplus = window.$oplus || {};
    window.$oplus.fancytreeDefault = {
        extensions: ['wide', 'glyph', 'filter'],
        // LEO@20201008: set toggleEffect=false to avoid title movement during animation with "wide" extension
        // line 5500 in jquery.fancytree-all.js
        toggleEffect: false,
        strings: {noData: 'no data'},
        //https://github.com/mar10/fancytree/wiki/ExtGlyph
        glyph: {
            preset: "awesome5",
            map: {
                doc: "fas fa-file",
                docOpen: "fas fa-file",
                folder: "fas fa-folder text-muted",
                folderOpen: "fas fa-folder-open text-muted",
                expanderClosed: "far fa-angle-right",
                expanderOpen: "far fa-angle-down",
                nodata: "far fa-inbox"
            }
        },
        filter: {
            counter: false,
            autoExpand: true,
            mode: "hide",
            highlight: false
        }
    };
})();