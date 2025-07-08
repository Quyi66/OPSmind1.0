/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/31/2017
 */
(function () {
    angular.module('oplus.commons').service('debugTimer', debugTimer);

    /**
     * @ngdoc service
     * @name debugTimer
     * @description
     * Timer for debug
     */
    function debugTimer() {
        var timers = {}, counters = {}, debugVars = {};
        this.add = add;
        this.reset = rest;
        this.print = print;
        this.newDebugVar = newDebugVar;
        this.getDebugVar = getDebugVar;

        /**
         * Initialize a map object for debug.
         * @param {string} name The identity of the map
         */
        function newDebugVar(name, val) {
            debugVars[name] = val;
        }

        function getDebugVar(name, defaultVal) {
            var val = debugVars[name];
            if (angular.isUndefined(val)) {
                debugVars[name]=defaultVal;
            }
            return debugVars[name];
        }

        /**
         * Add current time to timer.
         * @param timerName
         * @param {number} begin Begin timestamp in millsecond
         */
        function add(timerName, begin) {
            timers[timerName] = (timers[timerName] || 0) + Date.now() - begin;
            counters[timerName] = (counters[timerName] || 0) + 1;
        }

        /**
         * Clear all timers and counters.
         */
        function rest() {
            timers = {};
            counters = {};
        }

        /**
         * Print current timer info including time consumed and count of calls.
         * @param {string=} level `info` for `console.log`, other for `console.debug`
         */
        function print(level) {
            if (level === 'info')
                console.log('debugTimer: timers', timers, "counters", counters);
            else
                console.debug('debugTimer: timers', timers, "counters", counters);
            return this;
        }
    }
})();
