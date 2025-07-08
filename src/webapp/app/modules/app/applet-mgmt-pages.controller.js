/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 * @author chy , created on 2021/10/13.
 */
(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtPagesCtrl', AppletMgmtPagesCtrl);

    AppletMgmtPagesCtrl.$inject = ['$stateParams'];

    function AppletMgmtPagesCtrl($stateParams) {
        this.appletCode = $stateParams.appletCode;
    }
})();
