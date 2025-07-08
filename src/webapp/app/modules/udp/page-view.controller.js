/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */
(function () {
    'use strict';
    angular.module('oplus.udp').controller('PageViewCtrl', PageViewCtrl);

    PageViewCtrl.$inject = ['$scope', '$state', 'pageId', 'pageParams', 'pageService', 'runningState'];

    /**
     * @param $scope
     * @param {string} pageId
     * @param {object=} pageParams Page parameters
     * @param {pageService} pageService
     * @param {runningState} runningState
     */
    function PageViewCtrl($scope, $state, pageId, pageParams, pageService, runningState) {
        $scope.pageId = pageId;
        $scope.pageParams = pageParams;
        $scope.closePageInModal = closePageInModal;
        // console.log('PageViewCtrl', pageId, pageParams);
        var resizeId;
        $(window).resize(function () {
            clearTimeout(resizeId);
            resizeId = setTimeout(function resizedEnded() {
                $scope.$broadcast('WIDGET_RESIZE', {from: 'WINDOW_RESIZE'});
            }, 500);
        });

        function closePageInModal() {
            pageService.dismissModal();
            $scope.$destroy();
        }
    }
})();
