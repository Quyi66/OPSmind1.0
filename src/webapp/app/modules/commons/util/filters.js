(function () {
    'use strict';
    angular.module('oplus.commons')
        .filter('fromNow', function () {
            return fromNow;
        })
        .filter('isEmpty', function () {
            return isEmpty;
        })
        .filter('isNotEmpty', function () {
            return isNotEmpty;
        })
        .filter("filesize", function () {
            return filesize;
        })
        .filter('anysize', function () {
            return anysize;
        })
        .filter('replace', function () {
            return replace;
        })
        .filter('length', function () {
            return length;
        })
        .filter('diff', ['utils', function (utils) {
            return function diff(now, before) {
                return utils.formatDuration(before, now);
            };
        }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (html) {
                if (angular.isString(html))
                    return $sce.trustAsHtml(html);
                return html;
            }
        }])
        .filter('filterAny', function () {
            return filterAny;
        });

    /**
     * @ngdoc filter
     * @name filesize
     * https://github.com/meyfa/angular-filesize-filter/blob/master/angular-filesize-filter.js
     * @param bytes
     * @param precision
     * @returns {string}
     */
    function filesize(bytes, precision) {
        /**
         * An array of units, starting at bytes and ending with yottabytes.
         */
        var units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        // validate 'bytes'
        if (isNaN(parseFloat(bytes))) {
            return "-";
        }
        if (bytes < 1) {
            return "0 B";
        }
        // validate 'precision'
        if (isNaN(precision)) {
            precision = 1;
        }
        var unitIndex = Math.floor(Math.log(bytes) / Math.log(1000)),
            value = bytes / Math.pow(1000, unitIndex);
        return value.toFixed(precision) + " " + units[unitIndex];
    }

    /**
     * @ngdoc filter
     * @name fromNow
     * @description
     * Calculate time span from specified date to now.
     * @param {date|string} date A date or parsable date string
     * @returns {*}
     */
    function fromNow(date) {
        if (!date) {
            return '';
        }
        return moment(date).fromNow();
    }

    /**
     * @ngdoc filter
     * @description
     * If an object is not empty.
     * @param {object} object
     * @returns {boolean}
     */
    function isNotEmpty(object) {
        return !_.isEmpty(object);
    }

    /**
     * @ngdoc filter
     * @description
     * If an object is empty.
     * @param {object} object
     * @returns {boolean}
     */
    function isEmpty(object) {
        return _.isEmpty(object);
    }

    /**
     * @ngdoc filter
     * @name anysize
     * @description
     * Calculate size of anything in terms of:
     * - array: length of array
     * - object: number of keys
     * - string: length of string
     * - other: 0
     *
     * @param any
     * @returns {number|*}
     */
    function anysize(any) {
        if (!any) {
            return 0;
        } else if (angular.isDate(any)) {
            return 0;
        } else if (angular.isObject(any)) {
            return Object.keys(any).length;
        } else if (angular.isArray(any)) {
            return any.length;
        } else if (angular.isString(any)) {
            return any.length;
        }
        return 0;
    }

    /**
     *
     * @param {string} str
     * @param {string|RegExp} pattern
     * @param {string} replacement
     * @returns {*}
     */
    function replace(str, pattern, replacement) {
        if (!str) {
            return str;
        }
        return str.replace(pattern, replacement);
    }

    /**
     *  length of array 、 string  or object`s keys
     * @param source {array|string|object}
     */
    function length(source) {
        //[object Number]
        var sourceType = Object.prototype.toString.call(source).match(/\[object\s+(\w+)\]/)[1];
        if (sourceType === 'Array' || sourceType === 'String') {
            return source.length;
        } else if (sourceType === 'Object') {
            return _.keys(source).length;
        } else {
            return -1;
        }
    }

    /**
     * now - before
     * @param now
     * @param before
     * @param unit
     * https://stackoverflow.com/questions/18623783/get-the-time-difference-between-two-datetimes
     * @return {String} in hh:mm:ss
     */
    function diff(now, before, unit) {
        if (now <= 0) {
            return '';
        }
        var mEnd = moment(now <= 0 ? Date.now() : now);
        var mStart = moment(before <= 0 ? Date.now() : before);
        if (mEnd.isValid() && mStart.isValid()) {
            var ms = mEnd.diff(mStart);
            var d = moment.duration(ms);
            return Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        }
        return now - before;
    }

    /**
     *
     * @param array
     * @param {string} fieldsToFilter Comma separated fields
     * @param textToFilter
     * @return {array}
     */
    function filterAny(array, fieldsToFilter, textToFilter) {
        // console.log(fieldsToFilter, textToFilter);
        if (!textToFilter) {
            return array;
        }
        var fields = fieldsToFilter.split(',');
        return _.filter(array, function (o) {
            return _.findIndex(fields, function (f) {
                if (angular.isDefined(o[f]) && o[f] !== null) {
                    return (o[f] + '').indexOf(textToFilter) > -1;
                }
                return false;
            }) > -1;
        });
    }
})();
