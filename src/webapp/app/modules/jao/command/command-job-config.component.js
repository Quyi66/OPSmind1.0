/**
 * @author wuqiang@famessoft.com , created on 2021-03-19.
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoCommandJobConfig
     */
    angular.module('oplus.jao').component('jaoCommandJobConfig', {
        templateUrl: 'app/modules/jao/command/command-job-config.html',
        controller: ['$scope', '$state', 'gfsActionHelper', 'messageService', 'commandService', CommandJobConfigCtrl],
        bindings: {
            jobConfig: '=theModel',
            isEditMode: '=editMode',
            options: '<'
        }
    });

    /**
     * Used with component.
     * @param $scope
     * @param $state
     * @param {gfsActionHelper} gfsActionHelper
     * @param {messageService} messageService
     */
    function CommandJobConfigCtrl($scope, $state, gfsActionHelper, messageService,commandService) {
        var that = this;
        that.commandList = [];
        that.commands = [];

        (function initData() {
            commandService.findAllApproveCommand().then(function (data) {
                that.commandList = data;
            }).catch(function (err) {
                throw err;
            });
            if (that.jobConfig.tasks === undefined) {
                that.jobConfig.tasks = [];
                var defaultTask = {
                    commands: [],
                    hosts: [],
                    hostsMode: 'param'
                };
                that.jobConfig.tasks.push(defaultTask);
            }
        })();
    }
})();
