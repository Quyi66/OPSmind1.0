/**
 * Created by chenshubin on 2017/12/25.
 */
(function () {

    /**
     * @ngdoc service
     * @name utils
     * @memberof oplus.commons
     * @description
     * common method for utils
     * TODO: rename to more specific name like timeUtils
     */
    angular.module('oplus.commons').service('utils', utils);

    function utils() {
        this.formatDuration = formatDuration;

        /**
         * Convert a duration or a diff of two time to format of `hh:mm:ss`
         * Example:
         * ```
         * formatDuration(125) === '0:02:05'
         * formatDuration('2021-04-17 11:00:00', '2021-04-17 11:01:23') === '0:01:23'
         * ```
         * @param {number|Date|String} start A duration (in seconds) or a start time (format supported by moment)
         * @param {number|Date|String=} end A end time
         * @return {String}
         */
        function formatDuration(start, end) {
            // console.log('formatDuration',start,end);
            var durationMs, duration;
            if (angular.isNumber(start) && !angular.isNumber(end)) {
                durationMs = start * 1000;
            } else if (start === 0 || end === 0) {
                return '';
            } else {
                var endMm = moment(end);
                var startMm = moment(start);
                if (endMm.isValid() && startMm.isValid()) {
                    durationMs = endMm.diff(startMm);
                } else {
                    return 'NA';
                }
            }
            duration = moment.duration(durationMs);
            return Math.floor(duration.hours()) + moment.utc(durationMs).format(":mm:ss");
        }

        // /**
        //  * TODO: move to ui utils
        //  * @param data
        //  * @return {[]}
        //  */
        // this.toFancyTreeData = function (data) {
        //     data.forEach(function (item) {
        //         item["title"] = item.name;
        //         item["key"] = item.id;
        //         item["folder"] = true;
        //     });
        //     var map = {};
        //     data.forEach(function (item) {
        //         map[item.id] = item;
        //     });
        //     var val = [];
        //     data.forEach(function (item) {
        //         var parent = map[item.pId];
        //         if (parent) {
        //             (parent.children || (parent.children = [])).push(item);
        //         } else {
        //             val.push(item);
        //         }
        //     });
        //     return val;
        // }


    }

})();