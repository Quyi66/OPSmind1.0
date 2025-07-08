(function () {
    'use strict';

    angular.module('oplus.main').controller('ErrorController', ErrorController);
    ErrorController.$inject = ['$rootScope', 'entity'];

    function ErrorController($rootScope, entity) {
        this.errorMessage = entity.errorMessage;
    }
})();
