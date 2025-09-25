/**
 *
 * @author Joker Liu (qdjoker@126.com), created on 04/27/2020
 */
(function () {

    /**
     * @ngdoc module
     * @name oplus.app
     */
    angular.module('oplus.ssc', [
        'oplus.commons',
        'oplus.uaa',
        // 复用 CAC 模块提供的模板与团队关联接口
        'oplus.cac'
    ]);
})();
