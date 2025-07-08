(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtDatasetsEditCtrl', AppletMgmtDatasetsEditCtrl);

    AppletMgmtDatasetsEditCtrl.$inject = ['$stateParams'];

    function AppletMgmtDatasetsEditCtrl($stateParams) {
        this.appletCode = $stateParams['appletCode'];
        //console.log('AppletMgmtDatasetEditCtrl',this.appletCode);
    }
})();
