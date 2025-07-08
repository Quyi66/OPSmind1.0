/**
 *
 * @author leoliaolei@gmail.com, 2020/02/21, created
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name jao-job-selector
     * @usage
     * ```
     * <jao-job-selector the-model="string" selected-job="object">
     * ```
     * @param {string} theModel Two-way binding ID of selected job
     * @param {object} selectedJob Two-way binding object of selected job
     */
    angular.module('oplus.jao').component('jaoJobSelector', {
        bindings: {
            selectedJob: '=',
            theModel: '=',
            showEdit: '<',
            disabled: '<',
        },
        templateUrl: 'app/modules/jao/helper/job-selector.html',
        controller: ['$scope', 'jaoJobService', '$stateParams', '$timeout', JobSelectorCtrl]
    });

    /**
     *
     * @param $scope
     * @param jaoJobService {jaoJobService}
     * @constructor
     */
    function JobSelectorCtrl($scope, jaoJobService, $stateParams, $timeout) {
        var that = this;
        this.editJobDef = editJobDef;
        this.showEdit = typeof this.showEdit === 'boolean' ? this.showEdit : true;
        this.disabled = typeof this.disabled === 'boolean' ? this.disabled : false;

        that.theModelFake = undefined;

        /** 
         * 20230428 
         * When 'theModel' is initialized before the job list api loaded
         * The select ui will be blank 
         * So these code will hack it by a fake 'theModel'
         * */ 
        $scope.$watch('$ctrl.theModelFake', function (newVal, oldVal) {
            that.theModel = newVal || that.theModel;
        });

        $scope.$watch('$ctrl.theModel', function (newVal, oldVal) {
            if (that.jobs) {
                that.selectedJob = newVal ? _.find(that.jobs, { id: newVal }) : undefined;
                that.theModelFake = newVal || that.theModel;
            }
        });

       /* jaoJobService.findAllJobs().then(function (jobs) {
            that.jobs = angular.isArray(jobs) ? jobs : jobs.records;
            that.jobs.forEach(function (job) {
                job.$paramsConfig = toParamsConfig(job.params);
            });
            that.jobs = _.orderBy(that.jobs, ['title']);
            that.selectedJob = that.theModel ? _.find(that.jobs, {id: that.theModel}) : undefined;
        }).catch(function (err) {
            //TODO: need notify error
            throw err;
        });*/

        jaoJobService.findAllJobs('',$stateParams.appletCode).then(function (jobs) {
            that.jobs = angular.isArray(jobs) ? jobs : jobs.records;
            that.jobs.forEach(function (job) {
                job.$paramsConfig = toParamsConfig(job.params);
            });
            that.jobs = _.orderBy(that.jobs, ['title']);
            that.theModelFake = that.theModel || undefined;
            that.selectedJob = that.theModel ? _.find(that.jobs, { id: that.theModel }) : undefined;
            // $scope.$broadcast(LOAD_EVENT);
        }).catch(function (err) {
            //TODO: need notify error
            throw err;
        });

        function editJobDef() {
            if (that.theModel) {
                jaoJobService.gotoEditJob(that.theModel, that.selectedJob.appletCode);
            }
        }

        function toParamsConfig(params) {
            var paramsConfig = {};
            if (params && params.length > 0) {
                params.forEach(function (param) {
                    paramsConfig[param.name] = {
                        defaultValue: param.defaultValue,
                        format: param.type,
                        label: param.label,
                        desc: param.description
                    };
                });
            }
            return paramsConfig;
        }
    }
})();
