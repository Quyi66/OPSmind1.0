/**
 * @Auther: zml
 * @Date: 2018/5/11
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacScriptService", cacScriptService);

    cacScriptService.$inject = ["cacDao"];

    function cacScriptService(cacDao) {

        function deleteScript(id) {
            return cacDao.deleteScript(id);
        }

        //根据Id查询Script
        function queryScript(id) {
            return cacDao.queryScript(id);
        }

        function updateScript(script) {
            return cacDao.updateScript(script);
        }

        function addScript(scripts) {
            return cacDao.addScript(scripts);
        }

        function uploadFile(form) {
            return cacDao.uploadFile(form);
        }

        function checkScript(fileName) {
            return cacDao.checkScript(fileName);
        }

        function getScriptContentByName(fileName) {
            return cacDao.getScriptContentByName(fileName);
        }


        function deleteScriptFile(filename) {
            return cacDao.deleteScriptFile(filename);
        }


        var service = {
            deleteScript: deleteScript,
            deleteScriptFile: deleteScriptFile,
            queryScript: queryScript,
            getScriptContentByName: getScriptContentByName,
            updateScript: updateScript,
            addScript: addScript,
            uploadFile: uploadFile,
            checkScript: checkScript
        }
        return service;


    }


})();
