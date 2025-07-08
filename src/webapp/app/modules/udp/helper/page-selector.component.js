/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/13/2017
 */
(function () {
    'use strict';
    /**
     * @usage
     * ```
     * <udp-page-selector page-id="string"
     * on-change="function"
     * excluded="[string]"
     * options="{converter:{kinds:string,varTypes:string}"/>
     * ```
     * @param {[string]} excluded Page ids to be excluded
     * @param {string} options.converter.kinds Comma separated converter kinds, `js,str,yaml,link`
     * @param {string} options.converter.varTypes Comma separated var types, `field,pageparam,global`
     */
    angular.module('oplus.udp').component('udpPageSelector', {
        bindings: {
            excluded: '<',
            pageId: '=',
            onChange: '&',
            options: '<'
        },
        templateUrl: 'app/modules/udp/helper/page-selector.html',
        controller: ['$scope', 'widgetDataInterface','pageService','$stateParams', function ($scope, widgetDataInterface,pageService,$stateParams) {
            var that = this;
            var excluded = that.excluded || [];
            that.options = that.options || {};
            if (!that.options.converter) {
                that.options.converter = {kinds: 'str', varTypes: 'pageparam,global'};
            }
            $scope.$watch('$ctrl.pageId', function (newVal, oldVal) {
                if (angular.isFunction(that.onChange())) {
                    var page = _.find(that.pages, {id: newVal});
                    if (page) {
                        // Use onChange()(page) instead ot onChange(page)
                        // https://stackoverflow.com/a/26244600/1524900
                        that.onChange()(page);
                    }
                }
            });
           /* widgetDataInterface.findAllPagesInfo().then(function (pages) {
                _.remove(pages, function (o) {
                    return excluded.indexOf(o.id) >= 0;
                });
                that.pages = _.orderBy(pages, 'title');
                // that.pages = pages;
            }).catch(function (err) {
                throw err;
            });*/

            pageService.findPages({
                page: 0,
                size: 1000,
                appletCode: $stateParams.appletCode
            }).then(function (data){
                var pages =data.content;
                _.remove(pages, function (o) {
                    return excluded.indexOf(o.id) >= 0;
                });
                var dataa = _.orderBy(pages, 'title');
                if('oplus_core' != $stateParams.appletCode){
                    final_data(dataa);
                }else{
                    that.pages =dataa;
                }
                // that.pages = pages;
            }).catch(function (err) {
                throw err;
            });

            function final_data(dataa){
                pageService.findPages({
                    page: 0,
                    size: 1000,
                    appletCode: 'oplus_core'
                }).then(function (data2){
                    var pages2 =data2.content;
                    _.remove(pages2, function (o) {
                        return excluded.indexOf(o.id) >= 0;
                    });
                    var oplusCore = _.orderBy(pages2, 'title');
                    that.pages =dataa.concat(oplusCore)
                }).catch(function (err) {
                    throw err;
                });
            }

        }]
    });
})();