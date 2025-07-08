/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/25/2017
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('userPref', userPref);

    /**
     * @ngdoc service
     * @name userPref
     * @description
     * Read and write user preference data.
     * @example
     * var setting = userPref.readItem('udp.someParamForUdp');
     * setting.bar="abc123"
     * userPref.saveItem('udp.someParamForUdp',setting.bar)
     */
    function userPref() {
        var STORAGE_KEY = 'oplus.userpref';
        var pref;
        load();
        this.load = load;
        this.merge = merge;
        this.saveItem = saveItem;
        this.readItem = readItem;

        /**
         * Merge incoming preference with existing.
         * @param {object} obj Preference items to merge
         */
        function merge(obj) {
            angular.extend(pref, obj);
            save();
        }

        /**
         * Save one preference item.
         * @param {string} name Item name
         * @param {*} value Item value
         */
        function saveItem(name, value) {
            pref[name] = value;
            save();
        }

        /**
         * Read one preference item
         * @param {string} name Item name
         * @param {*} defaultValue Default value if not found this item
         * @returns {*} Item value
         */
        function readItem(name, defaultValue) {
            return pref[name] || defaultValue;
        }

        /**
         * Load user preference from local storage
         * @returns {object} User preference object
         * @private
         */
        function load() {
            pref = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return pref;
        }

        /**
         * Persist preference data to local storage.
         * @private
         */
        function save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
        }
    }
})();
