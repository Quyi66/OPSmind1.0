/**
 *
 * @author chenrongji, created on 2020-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('jaoJobCtrl', JaoJobCtrl);

    JaoJobCtrl.$inject = ['$scope', '$state', 'jaoJobService', '$stateParams', '$location', 'messageService', 'userPref',  '$translate'];

    /**
     *
     * @param $scope
     * @param $state
     * @param {jaoJobService} jaoJobService
     * @param $stateParams
     * @param $location
     * @param {messageService} messageService
     * @param {userPref} userPref
     * @param $translate
     * @constructor
     */
    function JaoJobCtrl($scope, $state, jaoJobService, $stateParams, $location, messageService, userPref,  $translate) {
        var that = this;
        var typeList = {
            script: {title: $translate.instant('jao.job.type.script'), icon: 'fa-laptop-code'},
            rest: {title: $translate.instant('jao.job.type.rest'), icon: 'fa-cloud-upload'},
            command: {title: $translate.instant('jao.job.type.command'), icon: 'fa fa-cog'}
        };
        if ($stateParams.type === "") {
            $state.go('app.jao', {type: typeList[0].type});
        }
        that.jobList = [];
        that.selectedType = $stateParams.type;
        if (that.selectedType === "command") {
            that.viewUrl = "app.jao_cmd.job_list.view({id: job.id})";
        } else {
            that.viewUrl = "app.jao.job_list.job_view({id: job.id})";
        }
        that.jobTypeList = [];
        that.createJob = createJob;
        that.changeActiveJob = changeActiveJob;
        that.activeJob = $location.path().split("/")[3];
        that.orderName = userPref.readItem('jaoJobOrderName', 'modifiedAt');
        that.orderMethod = userPref.readItem('jaoJobOrderMethod', false);
        that.changeJobOrderBy = changeJobOrderBy;

        function changeJobOrderBy(jaoJobOrderName) {
            userPref.saveItem('jaoJobOrderName', jaoJobOrderName);
            var jaoJobOrderMethod = !(userPref.readItem('jaoJobOrderMethod', false));
            userPref.saveItem('jaoJobOrderMethod', jaoJobOrderMethod);
            that.orderName = jaoJobOrderName;
            that.orderMethod = jaoJobOrderMethod;
        }


        $scope.$watch('$ctrl.selectedType', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $state.go('app.jao', {type: newVal});
            }
        });

        function changeActiveJob(job) {
            that.activeJob = job.id;
        }

        function createJob() {
            if (that.selectedType === "") {
                return;
            } else {
                that.activeJob = "";
                if (that.selectedType === "command") {
                    $state.go('app.jao_cmd.job_list.create', {type: that.selectedType});
                } else {
                    $state.go('app.jao.job_list.job_new', {type: that.selectedType});
                }
            }
        }

        function initJobList() {
            that.jobTypeList = [];
            if (that.jobList != null && that.jobList.length !== 0) {
                var jobs = that.jobList;
                for (var i in jobs) {
                    if (jobs[i].type === that.selectedType) {
                        that.jobTypeList.push(jobs[i]);
                    }
                }
            } else {
                if (that.selectedType === "command") {
                    jaoJobService.findAllJobs(that.selectedType, "").then(function (jobs) {
                        that.jobList = jobs;
                        for (var i in jobs) {
                            if (jobs[i].type === that.selectedType) {
                                that.jobTypeList.push(jobs[i]);
                            }
                        }
                    }).catch(function (err) {
                        messageService.toast('error', $translate.instant('jao.messages.no_list_data'), err.message);
                    });
                } else {
                    jaoJobService.findAllJobs().then(function (jobs) {
                        that.jobList = jobs;
                        for (var i in jobs) {
                            if (jobs[i].type === that.selectedType) {
                                that.jobTypeList.push(jobs[i]);
                            }
                        }
                    }).catch(function (err) {
                        messageService.toast('error', $translate.instant('jao.messages.no_list_data'), err.message);
                    });
                }

            }
        }

        initJobList();
    }
})();
