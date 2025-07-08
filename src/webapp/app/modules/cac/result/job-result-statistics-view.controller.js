/**
 * @Auther: mr.kongqi@gmail.com
 * @Date: 2021/12/15
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //主控制器
    cacModule.controller('JobResultStatisticsOverviewCtrl', JobResultStatisticsOverviewCtrl);
    JobResultStatisticsOverviewCtrl.$inject = ['cacResultService', '$http', '$scope', 'cacService', '$timeout', '$state', '$stateParams', '$uibModal', '$translate'];

    function JobResultStatisticsOverviewCtrl(cacResultService, $http, $scope, cacService, $timeout, $state, $stateParams, $uibModal, $translate) {
        var vm = this;
        vm.params = {
            "job_id": $stateParams.jobId
        }
    }

})();
