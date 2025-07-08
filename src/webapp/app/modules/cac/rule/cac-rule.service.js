/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacRuleService", cacRuleService);

    cacRuleService.$inject = ["cacDao"];

    function cacRuleService(cacDao) {

        function deleteRule(id) {
            return cacDao.deleteRule(id);   // 返回承诺
        }

        //根据Id查询Rule
        function queryRule(id) {
            return cacDao.queryRule(id);
        }

        //上传规则
        function uploadRule(form) {
            return cacDao.uploadRule(form);
        }

        function updateRule(rule) {
            return cacDao.updateRule(rule);
        }

        function addRule(rules) {
            return cacDao.addRule(rules);
        }

        function checkRuleName(ruleName) {
            return cacDao.checkRuleName(ruleName);
        }

        var service = {
            deleteRule: deleteRule,
            queryRule: queryRule,
            uploadRule: uploadRule,
            updateRule: updateRule,
            addRule: addRule,
            checkRuleName: checkRuleName
        };
        return service;


    }


})();
