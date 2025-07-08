/**
 * @Auther: zml
 * @Date: 2018/5/23
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacTemplateUserService", cacTemplateUserService);

    cacTemplateUserService.$inject = ["cacDao"];

    function cacTemplateUserService(cacDao) {

        function getTemplates() {
            return cacDao.getTemplates();
        }
        var service = {
            getTemplates: getTemplates
        }
        return service;
    }


})();
