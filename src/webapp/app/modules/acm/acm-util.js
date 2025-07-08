/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2021/04/20
 */
(function () {
    'use strict';

    angular.module('oplus.acm').service('acmUtil', acmUtil);

    acmUtil.$inject = ['$q','$translate'];

    /**
     * @ngdoc service
     * @name acmUtil
     */
    function acmUtil($q, $translate) {
        var that = this;
        this.DEFAULT_DEVICE_TYPE = 'linux';
        this.selectModeDefs = {
            //TODO: rename host to instance
            host: {title: $translate.instant('acm.common.filter.according_equipment'), icon: 'fa-list'},
            group: {title: $translate.instant('acm.common.filter.according_group'), icon: 'fa-code'},
            tag: {title: $translate.instant('acm.common.filter.according_tag'), icon: 'fa-tags'},
            input: {title: $translate.instant('acm.common.filter.according_input'), icon: 'fa fa-pencil'},
            recently: {title: $translate.instant('acm.common.filter.according_recently'), icon: 'fa fa-history'}
        };
        // this.tabTitle = {
        //     linux: {title: '主机列表', icon: 'fa-list'},
        //     fiber_optic_switch: {title: '光纤交换机', icon: 'fa-list'},
        //     network_switch: {title: '网络交换机', icon: 'fa-list'}
        // };
        this.viewModeDefs = [
            {value: 'btndlg', title: $translate.instant('acm.common.filter.button_dialog'), isDefault: true, selectMode: 'host,group,tag,input,recently'},
            {value: 'dropdown', title: $translate.instant('acm.common.filter.drop-down_box'), selectMode: 'group,tag'}
            // {value: 'group', title: '分组'}
        ];
        this.findViewModeDef = function (mode) {
            var def = _.find(that.viewModeDefs, {value: mode});
            if (!def) {
                def = _.find(that.viewModeDefs, {isDefault: true});
            }
            return def;
        }
    }
})();
