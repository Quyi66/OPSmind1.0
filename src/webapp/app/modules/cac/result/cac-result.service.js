/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacResultService", cacResultService);

    cacResultService.$inject = ["$uibModal", "cacDao", "restUtils"];

    function cacResultService($uibModal, cacDao, restUtils) {

        function getResultsByJobId(jobId, start, length) {
            // 使用v3 API替代v2 API，避免404错误
            return restUtils.callApi('cac', 'GET', '/api/cac/v3/check-item-result/map/{logId}?start=' + start + '&length=' + length, {logId: jobId});
        }

        function getJob(jobId) {
            return cacDao.getJob(jobId);
        }

        function getMetricByJobIdAndHostKey(jobId, hostKey, ruleName, metricName, metricStatus, ruleExpression) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/result/job-result-to-rule.html',
                controller: 'JobResultToRuleCtrl',
                controllerAs: 'jobResultToRuleCtrlVm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    entity: function () {
                        return {
                            jobId: jobId,
                            hostKey: hostKey,
                            ruleName: ruleName,
                            metricName: metricName,
                            metricStatus: metricStatus,
                            ruleExpression: ruleExpression
                        };
                    }
                }
            });
        }

        function getMetricByJobIdAndHostKeyAndRule(jobId, hostKey, ruleName, ruleExpression) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/result/job-result-to-rule.html',
                controller: 'JobResultToRuleCtrl',
                controllerAs: 'jobResultToRuleCtrlVm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    entity: function () {
                        return {
                            jobId: jobId,
                            hostKey: hostKey,
                            ruleName: ruleName,
                            ruleExpression: ruleExpression
                        };
                    }
                }
            });
        }

        function getCheckItemById(checkItem) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/result/job-result-to-rule.html',
                controller: 'JobResultToRuleCtrl',
                controllerAs: 'jobResultToRuleCtrlVm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    entity: function () {
                        return checkItem;
                    }
                }
            });
        }

        function analyseMetric(result) {
            cacDao.analyseMetric(result);
        }

        function getOutputsByTaskId(taskId) {
            return cacDao.getOutputsByTaskId(taskId);
        }

        function getOutputsByTaskId_test(taskId) {
            return cacDao.getOutputsByTaskId_test(taskId);
        }

        function getMetrics(jobId) {
            return cacDao.getMetrics(jobId);
        }

        function queryOutput(outputId) {
            return cacDao.queryOutput(outputId);
        }

        function prepareDatatableOutPut(id) {
            return cacDao.prepareDatatableOutPut(id);
        }

        function getStructuralDiagram(id) {
            return cacDao.getStructuralDiagram(id);
        }

        function structuralDiagramHostItemInfo(data) {
            return cacDao.structuralDiagramHostItemInfo(data);
        }

        function structuralDiagramPrimaryInfo(data) {
            return cacDao.structuralDiagramPrimaryInfo(data);
        }

        var service = {
            getCheckItemById: getCheckItemById,
            getResultsByJobId: getResultsByJobId,
            getJob: getJob,
            getMetricByJobIdAndHostKey: getMetricByJobIdAndHostKey,
            getMetricByJobIdAndHostKeyAndRule: getMetricByJobIdAndHostKeyAndRule,
            analyseMetric: analyseMetric,
            queryOutput: queryOutput,
            getOutputsByTaskId: getOutputsByTaskId,
            getOutputsByTaskId_test: getOutputsByTaskId_test,
            getMetrics: getMetrics,
            prepareDatatableOutPut: prepareDatatableOutPut,
            getStructuralDiagram: getStructuralDiagram,
            structuralDiagramPrimaryInfo: structuralDiagramPrimaryInfo,
            structuralDiagramHostItemInfo: structuralDiagramHostItemInfo
        };
        return service;
    }


})();
