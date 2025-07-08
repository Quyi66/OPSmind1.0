/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 11/7/2017
 */
(function () {
    'use strict';

    var app = angular.module('oplus.commons', ['toaster', 'ui.bootstrap', 'vs-repeat', 'ngFileUpload']);
    app.provider('commonsConfig', function CommonsConfigProvider() {
        // console.log('CommonsConfigProvider');
        var defaultUnresolvedVar;

        this.setDataExDefaultUnresolvedVar = function (value) {
            defaultUnresolvedVar = value;
            // console.log('setDataExDefaultUnresolvedVar="' + defaultUnresolvedVar + '"');
        }

        this.$get = [function () {
            return {
                getDataExDefaultUnresolvedVar: function () {
                    // console.log('getDataExDefaultUnresolvedVar="' + defaultUnresolvedVar + '"');
                    return defaultUnresolvedVar;
                }
            }
        }];
    });
})();
