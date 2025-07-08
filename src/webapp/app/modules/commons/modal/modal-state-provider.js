/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/15, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').provider('modalState', ['$stateProvider', modalStateProvider]);

    /**
     * @ngdoc provider
     * @name modalState
     * @description
     */
    function modalStateProvider($stateProvider) {
        var provider = this;
        this.$get = function () {
            return provider;
        }
        this.state = function (stateName, options) {
            var modalInstance;
            $stateProvider.state(stateName, {
                url: options.url,
                onEnter: ['$state', 'modalHelper', function ($state, modalHelper) {
                    console.log('onEnter modal');
                    var modalConfig = Object.values(options.views)[0];
                    modalConfig.modaless = true;
                    modalInstance = modalHelper.openModal(modalConfig);
                    modalInstance.result['finally'](function () {
                        modalInstance = null;
                        if ($state.$current.name === stateName) {
                            $state.go('^');
                        }
                    });
                }],
                onExit: function () {
                    if (modalInstance) {
                        modalInstance.close();
                    }
                }
            });
            return provider;
        };
    }
})();
