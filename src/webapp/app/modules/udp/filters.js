/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/05/28.
 */
(function () {
    'use strict';
    angular.module('oplus.commons')
        .filter('customStockColorNumber', function () {
            return customStockColorNumber;
        })
        .filter('markdown', function () {
            return markdown;
        })
        .filter('tolist', function () {
            return tolist;
        })
        //TODO: custom filter prefix with $?
        .filter('$fromJson', function () {
            return $fromJson;
        })
        .filter('$joinArray', function () {
            return $joinArray;
        })
        .filter('safefilter', ['$filter', function ($filter) {
            return function (any, expression) {
                try {
                    return $filter('filter')(any, expression);
                } catch (err) {
                    return any;
                }
            }
        }]);

    /**
     * @ngdoc filter
     * @name $fromJson
     * @description
     * Parse string from JSON.
     * @param str
     * @param defaultValue
     * @returns {any}
     */
    function $fromJson(str, defaultValue) {
        if (defaultValue && !str) {
            return defaultValue;
        }
        if (!angular.isString(str)) {
            return str;
        }
        try {
            return JSON.parse(str);
        } catch (err) {
            console.warn('Cannot parse JSON string `{}`', str);
            return defaultValue;
        }
    }

    function $joinArray(array, separator) {
        if (!array) {
            return array;
        }
        return array.join(separator);
    }

    /**
     * @ngdoc filter
     * @name tolist
     * @description
     * Convert text to HTML list
     * @param {string} text Plain text
     * @param {string} delimiter Delimiter to split the text list
     * @returns {string} HTML
     */
    function tolist(text, delimiter, style) {
        if (!text) {
            return text;
        }
        var list = text.split(delimiter);
        var html = '';
        html += '<ul>';
        list.forEach(function (item) {
            html += '<li>' + item + '</li>';
        });
        html += '</ul>';
        return html;
    }

    /**
     * @ngdoc filter
     * @name markdown
     * @description
     * Convert markdown to HTML.
     * @param {string} md String in markdown
     * @returns {string} HTML
     */
    function markdown(md) {
        if (angular.isUndefined(marked) || !md) {
            return md;
        }
        //https://marked.js.org/using_advanced#options
        return marked(md, {gfm: true, breaks: false});
    }
})();