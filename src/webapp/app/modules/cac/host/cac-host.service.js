/**
 * @Auther: zml
 * @Date: 2019/12/30
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacHostService", cacHostService);

    cacHostService.$inject = ["cacDao"];

    function cacHostService(cacDao) {

        function deleteHost(id) {
            return cacDao.deleteHost(id);   // 返回承诺
        }

        function addHost(hosts) {
            return cacDao.addHost(hosts);
        }

        function uploadHostExcel(form) {
            return cacDao.uploadHostExcel(form);
        }

        function getAllCategory() {
            return cacDao.getAllCategory();
        }

        function getHostListByCategory(category) {
            return cacDao.getHostListByCategory(category);
        }


        var service = {
            deleteHost: deleteHost,
            addHost: addHost,
            uploadHostExcel: uploadHostExcel,
            getAllCategory: getAllCategory,
            getHostListByCategory: getHostListByCategory
        };
        return service;


    }


})();
