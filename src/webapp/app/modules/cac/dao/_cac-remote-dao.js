/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    'use strict';

    var app = angular.module('oplus.cac');

    app.service('_cacRemoteDao', cacRemoteDao);

    cacRemoteDao.$inject = ['$q', '$http', 'localDaoFactory', 'restUtils', '$translate'];

    function cacRemoteDao($q, $http, localDaoFactory, restUtils, $translate) {

        var module = "cac";
        var cmModule = 'cm';
        var gitModule = 'gfs';


        /*rule巡检规则增删改查*/
        this.findAllRules = findAllRules;
        this.deleteRule = deleteRule;
        this.queryRule = queryRule;
        this.updateRule = updateRule;
        this.addRule = addRule;
        this.checkRuleName = checkRuleName;
        this.getRuleByIds = getRuleByIds;
        this.uploadRule = uploadRule;

        /*巡检主机增删改查*/
        this.addHost = addHost;
        this.deleteHost = deleteHost;
        this.uploadHostExcel = uploadHostExcel;
        this.getHostListByCategory = getHostListByCategory;
        this.getAllCategory = getAllCategory;

        /*template巡检模板增删改查*/
        this.deleteTemplate = deleteTemplate;
        this.addTemplate = addTemplate;
        this.getTemplateById = getTemplateById;
        this.updateTemplate = updateTemplate;
        this.getTemplates = getTemplates;
        this.updateTemplateSendSms = updateTemplateSendSms;
        this.getHosts = getHosts;
        this.getSquareTemplates = getSquareTemplates;

        /*job巡检任务增删改查*/
        this.deleteJob = deleteJob;
        this.getJob = getJob;
        this.queryJob = queryJob;
        this.addJob = addJob;
        this.run = run;


        /*scritp巡检脚本*/
        this.uploadFile = uploadFile;
        this.addScript = addScript;
        this.updateScript = updateScript;
        this.deleteScript = deleteScript;
        this.deleteScriptFile = deleteScriptFile;
        this.checkScript = checkScript;
        this.getScriptContentByName = getScriptContentByName;
        this.getScriptByIds = getScriptByIds;


        /*result巡检结果*/
        this.getResultsByJobId = getResultsByJobId;
        this.analyseMetric = analyseMetric;
        this.queryOutput = queryOutput;
        this.getOutputsByTaskId = getOutputsByTaskId;
        this.getOutputsByTaskId_test = getOutputsByTaskId_test;
        this.getMetrics = getMetrics;


        this.updateAuditParams = updateAuditParams;
        this.getCheckWhiteList = getCheckWhiteList;
        this.deleteCheckWhiteList = deleteCheckWhiteList;
        this.findByCheckWhiteList = findByCheckWhiteList;
        this.saveCheckWhiteList = saveCheckWhiteList;
        this.prepareDatatableOutPut = prepareDatatableOutPut;
        this.getStructuralDiagram = getStructuralDiagram;
        this.structuralDiagramPrimaryInfo = structuralDiagramPrimaryInfo;
        this.structuralDiagramHostItemInfo = structuralDiagramHostItemInfo;
        this.getTeamsInfo = getTeamsInfo;
        this.saveTeamsInfo = saveTeamsInfo;
        this.getCacTeamConfig = getCacTeamConfig;

        function findAllRules() {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/rules', null);
        }

        function checkRuleName(ruleName) {
            //TODO 校验ruleName
            return restUtils.callApi(module, 'GET', '/api/cac/audit/rules', null, ruleName);
        }

        function deleteRule(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/audit/rules/{id}', {id: id});
        }

        function queryRule(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/rules/{id}', {id: id});
        }

        function updateRule(rule) {
            return restUtils.callApi(module, 'PUT', '/api/cac/audit/rules', null, rule);
        }

        function addRule(rule) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/rules', null, rule);
        }

        function getRuleByIds(ruleIds) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/rules/ruleIds', null, ruleIds);
        }

        //上传巡检规则
        function uploadRule(form) {
            var d = $q.defer();
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/rules/uploadRule';
            $http({
                method: 'POST',
                url: url,
                data: form,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                transformResponse: function (data) {  // 转换response,这样传回来的是就是：String，默认是json
                    return data;
                }
            }).then(function (resp) {
                d.resolve(resp.data);
            }).catch(function (err) {
                d.resolve($translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.upload')}));
                console.log(err);
                d.reject(err);
            });
            return d.promise;
        }


        function deleteHost(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/audit/hosts/{id}', {id: id});
        }

        function addHost(host) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/hosts', null, host);
        }

        function getAllCategory() {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/hosts/category');
        }

        function getHostListByCategory(category) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/hosts/getHostListByCategory/{category}', {category: category});
        }

        function uploadHostExcel(form) {
            var d = $q.defer();
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/hosts/uploadHost';
            $http({
                method: 'POST',
                url: url,
                data: form,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                transformResponse: function (data) {  // 转换response,这样传回来的是就是：String，默认是json
                    return data;
                }

            }).then(function (resp) {
                d.resolve(resp.data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }


        function addTemplate(template) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/templates', null, template)
        }


        function uploadFile(form) {
            var d = $q.defer();
            var url = window.$oplus.appConfig.apiBaseUrls.git + '/api/git/cac/upload';
            $http({
                method: 'POST',
                url: url,
                data: form,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                transformResponse: function (data) {  // 转换response,这样传回来的是就是：String，默认是json
                    return data;
                }

            }).then(function (resp) {
                d.resolve(resp.data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }


        function deleteTemplate(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/v2/templates/{id}', {id: id})
        }

        function getTemplates() {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/templates', null)
        }

        function getSquareTemplates() {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/templates/square', null)
        }

        function getTemplateById(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/templates/{id}', {id: id})
        }

        function updateTemplate(template) {
            // 仅更新传入字段，后端按id处理
            return restUtils.callApi(module, 'PUT', '/api/cac/v2/templates', null, template)
        }

        function updateTemplateSendSms(templateId, sendSms) {
            // Use query parameter instead of payload: ?sendSms=true|false
            return restUtils.callApi(module, 'PUT', '/api/cac/v2/templates/{templateId}/send-sms', {templateId: templateId}, null, { params: { sendSms: sendSms } });
        }

        function getHosts() {
            return restUtils.callApi(cmModule, 'GET', '/api/cm/ci/hosts', null)
        }

        function getJob(jobId) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/jobs/{jobId}', {jobId: jobId})
        }

        function queryJob(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/jobs/{id}', {id: id})
        }

        function addJob(job) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs', null, job)
        }


        function run(job) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs/run', null, job)
            // if (!window.$oplus.appConfig.modules.cac.useCacV1) {
            //     return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs/run', null, job)
            // } else {
            //     return restUtils.callApi(module, 'POST', '/api/cac/audit/jobs/run', null, job)
            // }
        }

        function deleteJob(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/v2/jobs/{id}', {id: id})
        }

        function addScript(scripts) {
            /*if (scripts.length > 0) {
                for (var i = 0; i < scripts.length; i++) {
                    if(i==scripts.length-1){
                       return restUtils.callApi(module, 'POST', '/api/cac/audit/scripts', null, scripts[i])
                    }
                    restUtils.callApi(module, 'POST', '/api/cac/audit/scripts', null, scripts[i])
                }
            }*/
            return restUtils.callApi(module, 'POST', '/api/cac/audit/scripts', null, scripts)
        }

        function updateScript(script) {
            return restUtils.callApi(module, 'PUT', '/api/cac/audit/scripts', null, script);
        }

        function deleteScript(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/audit/scripts/{id}', {id: id})
        }

        function deleteScriptFile(filename) {
            return restUtils.callApi(gitModule, 'DELETE', '/api/git/delete/{filename}/', {filename: filename})
        }

        function checkScript(fileName) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/scripts/checkScriptName/{fileName}/', {fileName: fileName})
        }

        function getScriptByIds(scriptIds) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/scripts/scriptIds/', null, scriptIds)
        }

        function getScriptContentByName(scriptName) {
            return restUtils.callApi(gitModule, 'GET', '/api/git/getScriptContentByName/{scriptName}/', {scriptName: scriptName});
        }


        function getResultsByJobId(jobId, start, length) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/check-items/map/{jobId}?start=' + start + '&length=' + length, {jobId: jobId});
        }

        function analyseMetric(ansibleResult) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/metrics/analyze', null, ansibleResult);
        }

        function queryOutput(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/check-items/{id}/', {id: id});
        }

        function getOutputsByTaskId(taskId) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/outputs/taskId/{taskId}/', {taskId: taskId});
        }


        function getOutputsByTaskId_test(taskId) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/outputs/test/{taskId}/', {taskId: taskId});
        }

        function getMetrics(jobId) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/metrics/jobId/{jobId}', {jobId: jobId});
        }

        function updateAuditParams(auditParams) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/jobs/getNewAuditParams', null, auditParams);
        }

        function getCheckWhiteList(templateId) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/check-white-list/all/{templateId}', {templateId: templateId});
        }

        function deleteCheckWhiteList(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/v2/check-white-list/delete/{id}', id);
        }

        function findByCheckWhiteList(checkWhiteList) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/check-white-list/one', null, checkWhiteList);
        }

        function saveCheckWhiteList(checkWhiteList) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/check-white-list/save', null, checkWhiteList);
        }

        function prepareDatatableOutPut(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/jobs/result-v2/{id}', {id: id});
        }

        function getStructuralDiagram(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/jobs/structural-diagram/{id}', {id: id});
        }

        function structuralDiagramPrimaryInfo(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs/structural-diagram/primary-info', null, data);
        }

        function structuralDiagramHostItemInfo(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs/structural-diagram/host-item-info', null, data);
        }

        function getTeamsInfo() {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/get/teams-info', null);
        }

        function saveTeamsInfo(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/save/teams-info', null, data);
        }

        function getCacTeamConfig(templateId) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/get/cac-team-config/{templateId}', {templateId: templateId});

        }

    }
})();

