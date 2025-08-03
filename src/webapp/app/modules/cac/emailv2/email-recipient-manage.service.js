(function () {
    'use strict';

    angular.module('oplus.cac').factory('CacEmailV2RecipientManageService', CacEmailV2RecipientManageService);

    CacEmailV2RecipientManageService.$inject = ['$http', '$q', 'restUtils'];

    function CacEmailV2RecipientManageService($http, $q, restUtils) {
        var module = 'cac';
        
        var service = {
            getTemplate: getTemplate,
            getAllTemplates: getAllTemplates,
            getRecipients: getRecipients,
            addRecipient: addRecipient,
            updateRecipient: updateRecipient,
            deleteRecipient: deleteRecipient,
            syncRecipientToTemplates: syncRecipientToTemplates
        };

        return service;

        // 获取单个模版信息
        function getTemplate(templateId) {
            return restUtils.callApi(module, 'GET', '/api/cac/templates/{templateId}', {templateId: templateId});
        }

        // 获取所有模版列表
        function getAllTemplates() {
            return restUtils.callApi(module, 'GET', '/api/cac/templates');
        }

        // 获取指定模版的收件人列表
        function getRecipients(templateId) {
            return restUtils.callApi(module, 'GET', '/api/cac/templates/{templateId}/recipients', {templateId: templateId});
        }

        // 新增收件人
        function addRecipient(recipientData) {
            return restUtils.callApi(module, 'POST', '/api/cac/recipients', null, recipientData);
        }

        // 更新收件人
        function updateRecipient(recipientId, recipientData) {
            return restUtils.callApi(module, 'PUT', '/api/cac/recipients/{recipientId}', {recipientId: recipientId}, recipientData);
        }

        // 删除收件人
        function deleteRecipient(recipientId, templateIds) {
            var requestData = {
                recipientId: recipientId,
                templateIds: templateIds
            };
            return restUtils.callApi(module, 'DELETE', '/api/cac/recipients/{recipientId}', {recipientId: recipientId}, requestData);
        }

        // 同步收件人到多个模版
        function syncRecipientToTemplates(action, recipientData, templateIds) {
            var requestData = {
                action: action,
                recipient: recipientData,
                templateIds: templateIds
            };
            return restUtils.callApi(module, 'POST', '/api/cac/recipients/sync', null, requestData);
        }
    }
})();