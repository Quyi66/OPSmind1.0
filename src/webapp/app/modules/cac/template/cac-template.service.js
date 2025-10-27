/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacTemplateService", cacTemplateService);

    cacTemplateService.$inject = ["cacDao"];

    function cacTemplateService(cacDao) {

        function deleteTemplate(id) {
            return cacDao.deleteTemplate(id);
        }


        function getTemplates() {
            return cacDao.getTemplates();
        }

        function updateTemplate(template) {
            return cacDao.updateTemplate(template);
        }

        function updateTemplateSendSms(templateId, sendSms) {
            return cacDao.updateTemplateSendSms(templateId, sendSms);
        }

        function addTemplate(template) {
            return cacDao.addTemplate(template);
        }

        function getTemplateById(id) {
            return cacDao.getTemplateById(id);
        }

        function getHosts() {
            return cacDao.getHosts();
        }

        //重新组装主机返回的json数据
        //todo 后续要改参数名，name,ip。。。。
        function assembleHost(auditParams) {
            if (auditParams != null) {
                var host_obj = {
                    id: '',
                    hostName: '',
                    hostIp: ''
                };
                for (var i = 0; i < auditParams.length; i++) {
                    var param_hosts = auditParams[i].hosts;
                    if (param_hosts != null) {
                        for (var j = 0; j < param_hosts.length; j++) {
                            host_obj.id = param_hosts[j].id
                            host_obj.hostName = param_hosts[j].hostname;
                            host_obj.hostIp = param_hosts[j].ip;
                        }

                    }
                    auditParams[i].hosts = host_obj;
                }
            }
            return auditParams
        }

        function getSquareTemplates() {
            return cacDao.getSquareTemplates();
        }

        function getTeamsInfo() {
            return cacDao.getTeamsInfo();
        }

        function saveTeamsInfo(data) {
            return cacDao.saveTeamsInfo(data);
        }

        function getCacTeamConfig(templateId) {
            return cacDao.getCacTeamConfig(templateId);
        }

        var service = {
            deleteTemplate: deleteTemplate,
            getTemplates: getTemplates,
            updateTemplate: updateTemplate,
            addTemplate: addTemplate,
            getTemplateById: getTemplateById,
            getHosts: getHosts,
            assembleHost: assembleHost,
            getSquareTemplates: getSquareTemplates,
            getTeamsInfo: getTeamsInfo,
            saveTeamsInfo: saveTeamsInfo,
            getCacTeamConfig: getCacTeamConfig,
            updateTemplateSendSms: updateTemplateSendSms
        };
        return service;


    }


})();
