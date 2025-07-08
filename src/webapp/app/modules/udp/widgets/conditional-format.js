/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/15/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').service('conditionalFormat', conditionalFormat);

    conditionalFormat.$inject = ['dataEx'];

    /**
     * @ngdoc
     * @name conditionalFormat
     * @param dataEx {dataEx}
     */
    function conditionalFormat(dataEx) {
        this.evaluateRules = evaluateRules;

        /**
         * Test data items against rules. The rule matching use stop-if-match strategy.
         * For one data item, if one rule matched, the remained rules will be omitted.
         * @param {[object]} rules Conditional formatting rules
         * @param {string} rules.expr Rule expression in javascript statement, which shall return a boolean value
         * @param {[object]} data A list of data items to be tested against rules
         * @param {object} ruleArgs Arguments used in evaluating rule expression. TODO: it seems useless?
         * @param {function<number,object>} matchCallback Function called when a rule matched. Function parameters: data item index, matched rule
         */
        function evaluateRules(rules, data, ruleArgs, matchCallback) {
            var dataItems = angular.isArray(data) ? data : [data];
            var fns = rulesToFunctions();
            if (rules && rules.length > 0)
                dataItems.forEach(function (dataItem, itemIndex) {
                    var args = [dataEx, dataItem].concat(_.values(ruleArgs));
                    for (var i = 0; i < fns.length; i++) {
                        var fn = fns[i];
                        // console.log(fn,args);
                        // Stop if a rule matched
                        if (angular.isFunction(fn) && fn.apply(this, args) === true) {
                            // console.log('matched');
                            matchCallback(itemIndex, rules[i]);
                            return;
                        }
                    }
                });

            /**
             * Convert rule objects to functions
             * @returns {Array}
             */
            function rulesToFunctions() {
                var fns = [];
                if (rules) {
                    for (var i = 0; i < rules.length; i++) {
                        var fn = dataEx.strToFunc(rules[i].expr);
                        fns.push(fn);
                    }
                }
                return fns;
            }
        }
    }
})();
