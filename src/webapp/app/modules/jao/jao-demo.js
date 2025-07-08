/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/06/22, created
 */
(function () {
    'use strict';

    angular.module('oplus.jao').service('jaoDemo', ['modalHelper', '$http', '$interval', 'jaoJobService', jaoDemo]);

    /**
     * @ngdoc service
     * @name jaoDemo
     * @param {modalHelper} modalHelper
     * @param $http
     * @param $interval
     * @param {jaoJobService} jaoJobService
     */
    function jaoDemo(modalHelper, $http, $interval, jaoJobService) {
        this.demoRunProcess = demoRunProcess;

        function demoRunProcess(jobId) {
            modalHelper.closeTop();
            var modal = modalHelper.openModal({
                template: '<div class="modal-header"><h4 class="modal-title">【DEV】{{ \'jao.jao_demo.app_publishing\' | translate}}</h4></div>' +
                    '<div class="modal-body">' +
                    '<jao-process-modeler process-model="$ctrl.processModel"' +
                    ' options="$ctrl.modelerOptions"' +
                    ' register-modeler="$ctrl.registerModeler($modeler)"></jao-process-modeler></div>' +
                    '<div class="modal-footer">' +
                    '<button class="btn btn-default opx-btn-cancel" ng-click="$ctrl.close()">{{ \'jao.jao_demo.app_publishing\' | translate}}</button>' +
                    '</div>',
                controller: ['$scope', function ($scope) {
                    var modeler;
                    var that = this;
                    this.modelerOptions = {readonly: true, showElems: ['inventory'], canvasCss: 'bg-secondary'};
                    this.close = function () {
                        modal.dismiss();
                    };
                    this.registerModeler = function (m) {
                        modeler = m;
                    }

                    $scope.$on('$destroy', function () {
                        if (that.stop) {
                            $interval.cancel(that.stop);
                            that.stop = undefined;
                        }
                    });
                    jaoJobService.findJobById(jobId).then(function (job) {
                        that.processModel = JSON.parse(job.configJson).processModel;
                        that.count = 0;
                        that.stop = $interval(function updateStatus() {
                            var taskIds = _.map(that.processModel.tasks, function (t) {
                                return t.id;
                            });
                            var id = taskIds[Math.floor(Math.random() * taskIds.length)];
                            id = taskIds[that.count++];
                            modeler.highlightTask(id);
                            if (that.count >= taskIds.length) {
                                $interval.cancel(that.stop);
                                that.stop = undefined;
                            }
                        }, 5000);
                    }).catch(function (err) {
                        throw err;
                    });
                    // $http.get('app/modules/jao/process/test-process.json').then(function (res) {
                    //     that.processModel = res.data;
                    // }, function (err) {
                    //     throw err;
                    // });
                }],
                controllerAs: '$ctrl',
                size: 'xl'
            }, {draggable: true, resizable: true});
        }


    }
})();
