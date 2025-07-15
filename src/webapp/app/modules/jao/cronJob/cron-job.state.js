/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function(){
    angular.module('oplus.jao').config(['$stateProvider',
        function ($stateProvider) {
            configRoutes($stateProvider);
        }]);

    function configRoutes($stateProvider) {
        $stateProvider
            .state('app.jao.cron_job.new', {
                url: '/{id}/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/jao/cronJob/cron-job-dialog.html',
                        controller: 'CronJobDialogCtrl',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            cronJobData: function () {
                                return {
                                    jobDesc: "",
                                    scheduleConf:"",
                                    jobType:"",
                                    jobId:"",
                                    id:$stateParams.id
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', null, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })

    }
})();