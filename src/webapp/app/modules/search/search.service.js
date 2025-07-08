/**
 * @author mr.kongqi@gmail.com,2022/2/25 14:00,created
 */
(function () {
    'use strict';

    angular.module('oplus.search').service('searchService', searchService);

    searchService.$inject = ['restUtils']

    function searchService(restUtils) {

        var module = "search";

        this.search = search;

        function search(searchModule, keyword, page, size) {
            return restUtils.callApi(module, 'GET', '/api/es/search?keyword={keyword}&page={page}&size={size}&module={module}',
                {"module": searchModule, "keyword": keyword, "page": page, "size": size}, null);
        }
    }
})();
