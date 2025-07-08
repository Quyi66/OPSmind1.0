/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/28, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').service('udmUtil', [udmUtil]);

    /**
     * @ngdoc service
     * @name udmUtil
     * @description
     */
    function udmUtil() {
        var that = this;
        this.groupModelAttrs = groupModelAttrs;
        this.defaultGroup = 'Default';

        /**
         * Group attributes.
         * @param {[{code:string=, title:string=, type:string=}]} modelAttrs
         * @returns {[{group:string, attrs:[{}]}]}
         */
        function groupModelAttrs(modelAttrs) {
            // console.log('groupModelAttrs',modelAttrs);
            // if (!angular.isArray(modelAttrs)) {
            //     throw new Error('ProgramError: modelAttrs must be an array');
            // }
            var result = [];
            if (modelAttrs.length === 0 || modelAttrs[0].type !== 'group') {
                modelAttrs.unshift({title: that.defaultGroup, type: 'group'});
            }
            var currentGroup = that.defaultGroup;
            modelAttrs.forEach(function (attr) {
                if (attr.type === 'group') {
                    currentGroup = attr.title;
                    result.push({group: currentGroup, attrs: []});
                } else {
                    _.find(result, {group: currentGroup}).attrs.push(attr);
                }
            });
            return result;
        }
    }
})();
