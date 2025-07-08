/*!
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 05/15/2020
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('dateTime', dateTime);
    dateTime.$inject = ['$filter'];

    function dateTime($filter) {
        var _dateFilter = $filter('date');

        /**
         *
         * @param timeStr 时间字符串 HH:mm/HH:mm:ss
         * @description 时间字符串转Date对象，使用当前时间补全日期
         */
        this.timeToDate = function (timeStr) {
            if (timeStr) {
                return new Date(_dateFilter(new Date(), 'yyyy-MM-dd') + "T" + timeStr);
            } else {
                return;
            }
        };

        /**
         *
         * @param timeStr 时间字符串 HH:mm/HH:mm:ss
         * @description 时间字符串使用当前时间补全日期转成Date对象，然后按照指定pattern格式化
         * @example 去除秒：formatTimeStr('12:30:45','HH:mm')
         */
        this.formatTime = function (timeStr, pattern) {
            if (timeStr) {
                return _dateFilter(this.timeToDate(timeStr), pattern);
            } else {
                return '';
            }
        };

        /**
         * pattern 预定义格式有：
         * 匹配java类型的三个预定义格式：localTime(HH:mm),localDate('yyyy-MM-dd'),localDateTime('yyyy-MM-ddTHH:mm:ss').
         * 页面常用展示格式:dateTime('yyyy-MM-dd HH:mm')，date('yyyy-MM-dd'),fullTime('HH:mm:ss'),time('HH:mm')
         *
         * @param date{string|number|Date}
         * @param pattern 日期格式 yyy-MM-dd HH:mm:ss,
         * @returns {string}
         * @description 日期对象、毫秒值、字符串格式化输出。日期字符串必须带有年月日，时间不要求。
         */
        this.formatDate = function (date, pattern) {
            if (date) {
                if (pattern === 'localTime' || pattern === 'time') {
                    pattern = 'HH:mm';
                } else if (pattern === 'localDate' || pattern === 'date') {
                    pattern = 'yyyy-MM-dd';
                } else if (pattern === 'localDateTime') {
                    pattern = 'yyyy-MM-ddTHH:mm:ss';
                } else if (pattern === 'dateTime') {
                    pattern = 'yyyy-MM-dd HH:mm';
                } else if (pattern === 'fullTime') {
                    pattern = 'HH:mm:ss';
                }
                return _dateFilter(date, pattern);
            } else {
                return '';
            }
        }
    }
})();

