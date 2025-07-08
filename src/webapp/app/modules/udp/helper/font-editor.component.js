/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/29/2018
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name udpFontEditor
     * @description
     * Select font size
     * @attr options.unit 'scale', `px` (font size in pixel),`defined` like xx-small | x-small | small | medium | large | x-large | xx-large
     */
    angular.module('oplus.udp').component('udpFontEditor', {
        templateUrl: 'app/modules/udp/helper/font-editor.html',
        bindings: {
            theModel: '=',
            options: '<'
        },
        controller: ['$translate', FontEditorCtrl]
    });

    function FontEditorCtrl($translate) {
        this.sizeList = [{size: undefined, label: $translate.instant('common.term.default')}];
        this.options = this.options || {};
        var unit = this.options.unit;
        if (unit === 'defined') {
            this.sizeList = this.sizeList.concat([
                {size: 'xx-small', label: 'xx-small'},
                {size: 'x-small', label: 'x-small'},
                {size: 'small', label: 'small'},
                {size: 'large', label: 'large'},
                {size: 'x-large', label: 'x-large'},
                {size: 'xx-large', label: 'xx-large'}
            ]);

        } else if (unit === 'px') {
            for (var i = 48; i > 8; i--) {
                this.sizeList.push({size: i, label: i + 'px'});
            }
        } else {
            for (var j = 0.5; j < 2; j += 0.2) {
                this.sizeList.push({size: j, label: Math.round((j * 100)) + '%'});
            }
        }
    }
})();
