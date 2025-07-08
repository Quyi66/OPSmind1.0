/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/29/2018
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name udpMediaSelector
     * @description
     * Select media
     */
    angular.module('oplus.udp').component('udpMediaSelector', {
        templateUrl: 'app/modules/udp/helper/media-selector.html',
        bindings: {
            theModel: '=',
            options: '<'
        },
        controller: ['themeService', MediaSelectorCtrl]
    });

    function MediaSelectorCtrl() {
        var that = this;
        var iconFiles = ['air-conditioner.svg',
            'bulb.svg',
            'electricity-meter.svg',
            'elevator.svg',
            'monitor.svg',
            'movement-sensor.svg',
            'smoke-sensor.svg',
            'thermometer.svg'];
        var iconUrlPrefix = './content/medialib/icons/';
        this.images = [];
        iconFiles.forEach(function (icon) {
            that.images.push({source: icon, url: iconUrlPrefix + icon})
        });
        this.mediaTypes = [
            {type: 'fa', name: 'Font Icon'},
            {type: 'img', name: 'Icon'}
        ];
    }
})();
