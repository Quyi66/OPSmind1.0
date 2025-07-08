/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacJobService", cacJobService);

    cacJobService.$inject = ["cacDao"];

    function cacJobService(cacDao) {

        function deleteJob(id) {
            return cacDao.deleteJob(id);   // 返回承诺
        }

        //根据Id查询Job
        function queryJob(id) {
            return cacDao.queryJob(id);
        }

        function getJob(id) {
            return cacDao.getJob(id);
        }

        function updateJob(job) {
            return cacDao.updateJob(job);
        }

        function addJob(job) {
            return cacDao.addJob(job);
        }

        function run(job) {
            return cacDao.run(job);
        }

        var service = {
            getJob: getJob,
            queryJob: queryJob,
            deleteJob: deleteJob,
            updateJob: updateJob,
            addJob: addJob,
            run: run
        }
        return service;


    }


})();
