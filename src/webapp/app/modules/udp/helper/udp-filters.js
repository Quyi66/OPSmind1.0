/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 11/20/2017
 */
(function () {
    angular.module('oplus.udp')
        .filter('pathValue', ['dataEx', pathValueFilter]);

    /**
     *
     * @param dataEx {dataEx}
     * @returns {Function}
     */
    function pathValueFilter(dataEx) {
        return function (obj, path) {
            return dataEx.pathValue(obj, path);
        }
    }
})();
