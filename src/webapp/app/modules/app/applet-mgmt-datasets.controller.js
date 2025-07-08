(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtDatasetsCtrl', AppletMgmtDatasetsCtrl);

    AppletMgmtDatasetsCtrl.$inject = ['$stateParams'];

    function AppletMgmtDatasetsCtrl($stateParams) {
        this.appletCode = $stateParams.appletCode;
    }
})();
