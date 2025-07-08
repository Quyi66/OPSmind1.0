(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('DocsController', DocsController);

    DocsController.$inject = ['$scope', '$sce'];

    function DocsController($scope, $sce) {
        var vm = this;

        vm.gatewayPath = $sce.trustAsResourceUrl(window.$oplus.appConfig.apiBaseUrls.portal + '/swagger-ui.html');
    }

})();
