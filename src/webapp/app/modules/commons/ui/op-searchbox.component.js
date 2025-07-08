/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 5/30/2018
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opSearchbox
     * @description
     * A combo input box to filter display results.
     * @usage
     * ```html
     * <op-searchbox on-search="function()" search-text="string" options="object"/>
     * ```
     * @param {function} onSearch Function to do search with parameter of searchText. An empty search text shall clear the filter and display default un-filtered results.
     * @param {string} searchText Text to search. Two-way binding to the input control.
     * @param {string=} id A global unique id must exist if options.keepHistory or rememberLast
     * @param {object=} options
     * @param {boolean=} options.autoExpand
     * @param {boolean=} options.keepHistory Save last search in session storage
     * @param {boolean=} options.rememberLast Remember and auto load last search in session storage. id must exist.
     */
    angular.module('oplus.commons').component('opSearchbox', {
        templateUrl: 'app/modules/commons/ui/op-searchbox.html',
        transclude: true,
        bindings: {
            onSearch: '&?',
            // id: '@',
            searchText: '=',
            options: '<'
            // // https://juristr.com/blog/2015/02/learning-ng-verify-presence-of-directive-props/
            // // Define your function to be optional: &?. This way the function will only be defined if it actually has been passed in the HTML.
            // onClear: '&?'
        },
        controller: ['$scope', '$element', '$timeout', OpSearchBoxCtrl]
    });

    /**
     *
     * @param {string} key
     * @param {boolean} useSession
     * @constructor
     */
    function LocalCache(key, useSession) {
        var storage = useSession ? sessionStorage : localStorage;
        this.read = read;
        this.write = write;
        this.clear = clear;
        this.save = save;

        function save(property, value) {
            var item = read({});
            item[property] = value;
            storage.setItem(key, JSON.stringify(item));
        }

        function read(defaults) {
            var obj;
            try {
                obj = JSON.parse(storage.getItem(key));
            } catch (err) {
            }
            if (!obj || _.isEmpty(obj)) {
                obj = defaults;
            }
            return obj;
        }

        /**
         *
         * @param {object} value
         */
        function write(value) {
            var item = read({});
            _.assign(item, value);
            storage.setItem(key, JSON.stringify(item));
        }

        function clear() {
            storage.removeItem(key);
        }
    }

    /**
     *
     * @param $scope
     * @param $element
     * @param $timeout
     */
    function OpSearchBoxCtrl($scope, $element, $timeout) {
        var that = this;
        this.inputId = _.uniqueId('searchbox_');
        this.options = this.options || {};
        this.setFocus = setFocus;
        this.selectHistory = selectHistory;
        this.clearHistory = clearHistory;
        this.checkFocus = checkFocus;
        var elemId = $element.attr('id');
        var toRememberLast = this.options.rememberLast && elemId,
            toKeepHistory = this.options.keepHistory && elemId;
        var input = $element.find('input.form-control');
        var STORAGE_KEY = 'oplus.op-searchbox',
            sessionCache = new LocalCache(STORAGE_KEY, true),
            historyCache = new LocalCache(STORAGE_KEY),
            lastSearch = sessionCache.read({});
        this.searchHistory = historyCache.read({})[elemId] || [];

        if (toRememberLast) {
            var last = lastSearch[elemId];
            if (last) {
                that.searchText = last;
            }
        }
        input.on('keydown', function (event) {
            if (event.which === 27) { // 27 = esc key
                $scope.$apply(function () {
                    that.searchText = undefined;
                    if (toRememberLast) {
                        saveLastSearch(undefined);
                    }
                });
                event.preventDefault();
            }
        }).on('blur', function (event) {
            // that.isFocused = false;
            if (toKeepHistory) {
                addSearchHistory(that.searchText);
            }
        });

        if (that.onSearch) {
            var timer;
            $scope.$watch('$ctrl.searchText', function (newVal, oldVal) {
                // if (newVal) {
                //     that.isFocused = true;
                // }
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function () {
                    that.onSearch();
                    if (toRememberLast) {
                        saveLastSearch(newVal);
                    }
                }, 500);
            });
        }
        $scope.$on('$destroy', function () {
            input.off('keydown').off('blur');
        });

        function checkFocus() {
            // that.isFocused = false;
            // var find = $element.find('.input-group');
            // console.log('checkFocus',find.hasClass('focused'));
        }

        function saveLastSearch(text) {
            lastSearch[elemId] = text ? text : undefined;
            sessionCache.write(lastSearch);
        }

        function addSearchHistory(text) {
            if (!text) return;
            _.remove(that.searchHistory, function (o) {
                return o === text;
            });
            that.searchHistory.unshift(text);
            that.searchHistory.length = Math.min(that.searchHistory.length, 10);
            historyCache.save(elemId, that.searchHistory);
        }

        function clearHistory() {
            that.searchHistory = [];
            historyCache.save(elemId, undefined);
        }

        function selectHistory(selected) {
            that.searchText = selected;
            addSearchHistory(selected);
            saveLastSearch(selected);
        }

        function setFocus() {
            that.isFocused = true;
            // https://stackoverflow.com/questions/15859113/focus-not-working
            setTimeout(function () {
                input.focus();
            }, 500);
        }
    }
})();
