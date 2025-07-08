/**
 * @author wuqiang@famessoft.com , created on 2021-03-17.
 */
(function () {
    'use strict';

    angular.module('oplus.jao').service('commandService', ['restUtils', commandService]);

    /**
     * Service for command
     */
    function commandService(restUtils) {
        var module = "jao";
        this.findCommandByTenantId = findCommandByTenantId;
        this.saveCommand = saveCommand;
        this.findCommandById = findCommandById;
        this.deleteCommand = deleteCommand;
        this.findAllUnapprovedCommand = findAllUnapprovedCommand;
        this.findAllApproveCommand = findAllApproveCommand;
        this.approveCommand = approveCommand;
        this.findByTenantIdAndCreatedBy = findByTenantIdAndCreatedBy;

        function findCommandByTenantId() {
            return restUtils.callApi(module, 'GET', '/api/jao/command/tenantId');
        }

        function findByTenantIdAndCreatedBy() {
            return restUtils.callApi(module, 'GET', '/api/jao/command/tenantId/user');
        }

        function saveCommand(command) {
            if (!command.id) {
                return restUtils.callApi(module, 'POST', '/api/jao/command', null, command);
            } else {
                return restUtils.callApi(module, 'PUT', '/api/jao/command', null, command);
            }
        }

        function findCommandById(id) {
            return restUtils.callApi(module, 'GET', '/api/jao/command/{id}', {id: id});
        }

        function deleteCommand(id) {
            return restUtils.callApi(module, 'DELETE', '/api/jao/command/{id}', {id: id});
        }

        function findAllUnapprovedCommand() {
            return restUtils.callApi(module, 'GET', '/api/jao/command/unapproved');
        }

        function findAllApproveCommand() {
            return restUtils.callApi(module, 'GET', '/api/jao/command/approve');
        }

        function approveCommand(command) {
            return restUtils.callApi(module, 'PUT', '/api/jao/command/approve', null, command);
        }
    }
})();
