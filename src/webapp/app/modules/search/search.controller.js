/**
 * @author mr.kongqi@gmail.com,2022/2/24 21:00,created
 */
(function () {
    'use strict';

    angular.module('oplus.search').controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$scope', '$rootScope', '$cacheFactory', '$state', '$stateParams', '$translate', 'modalHelper', 'searchService', 'currentUser'];

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $cacheFactory
     * @param searchService
     * @param currentUser
     * @param $stateParams
     * @param $translate
     * @param modalHelper
     * @constructor
     */
    function SearchCtrl($scope, $rootScope, $cacheFactory, $state, $stateParams, $translate, modalHelper, searchService, currentUser) {

        var that = this;

        that.keyword = "";
        that.searchMap = {}
        that.searchResultCount = undefined;
        that.search = search;
        that.clean = clean;
        that.historySearch = historySearch;
        that.showSearchStyle = showSearchStyle;
        that.cleanHistorySearch = cleanHistorySearch;
        that.showDetail = showDetail;
        that.showView = showView;
        // that.searchCache = initCache;
        // that.getHistoryCache = getHistoryCache;
        // that.localStorage = window.localStorage;
        // that.sessionStorage = window.sessionStorage;
        that.historySearchRecord = [];
        that.historySearchType = "local";
        that.loading = false;
        that.searchType = "";
        that.searchTypes = {
            "": $translate.instant("search.type.all"),
            "jao": $translate.instant("search.type.jao"),
            "gfs": $translate.instant("search.type.gfs"),
            "udp": $translate.instant("search.type.udp"),
            "dts": $translate.instant("search.type.dts"),
            "acm": $translate.instant("search.type.acm")
        };

        init();

        function init() {
            that.historySearchRecord = getSearchHistory(that.historySearchType);
        }

        function showDetail(search) {
            console.log("search link is:", search.link, "search params is :", search.linkParams)
            $state.go(search.link, JSON.parse(search.linkParams || {}), {reload: true});
        }

        function showView(widgetInteraction) {
            var info = JSON.parse(widgetInteraction);
            var modalInstance = modalHelper.openModal({
                template: '<div class="modal-header">' +
                    '<h4 class="modal-title"></h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal" ng-click="$ctrl.close()"><i class="fa fa-times"></i></button>' +
                    '</div>' +
                    '<div class="modal-body"><udp-page-view page-id="\'' + info.page.pageId + '\'"></udp-page-view></div>',
                controller: [function () {
                    this.close = function () {
                        modalInstance.dismiss();
                    }
                }],
                controllerAs: '$ctrl',
                size: 'lg'
            }, {resizable: true});
        }

        function showSearchStyle(module) {
            return {
                "bg-primary": module === "一键作业" || module === "脚本管理",
                "bg-success": module === "数据模型",
                "bg-info": module === "自助页面",
                "bg-warning": module === "数据服务",
                "bg-danger": module === "命令管理" || module === "资产管理",
            };
        }

        $scope.$watch('$ctrl.keyword', function (newVal, oldVal) {
            if (!newVal) {
                clean();
            }
        })

        function search(keyword) {
            if (keyword) {
                that.loading = true;
                saveSearchHistory(that.historySearchType, keyword);
                searchService.search(that.searchType, keyword, 0, 100).then(function (result) {
                    convertData(result)
                    that.loading = false;
                    that.historySearchRecord = getSearchHistory(that.historySearchType);
                }).catch(function (err) {
                    that.searchResultCount = 0;
                    that.loading = false;
                    that.historySearchRecord = getSearchHistory(that.historySearchType);
                    throw err;
                })

            }
        }

        function saveSearchHistory(storage, keyword) {
            var history = storage === that.historySearchType ? sessionStorage.getItem("searchHistory") : localStorage.getItem("searchHistory");
            var login = window.$oplus.appConfig.tenantId + "-" + currentUser.loginId;
            if (history) {
                var r = JSON.parse(history);
                var loginHistory = r[login];
                if (loginHistory.indexOf(keyword) <= -1) {
                    loginHistory.push(keyword)
                }
                if (loginHistory.length >= 10) {
                    loginHistory.shift();
                }
                r[login] = loginHistory;
                storage === that.historySearchType ? sessionStorage.setItem('searchHistory', JSON.stringify(r)) : localStorage.setItem('searchHistory', JSON.stringify(r));
            } else {
                var newLoginHistory = {};
                newLoginHistory[login] = new Array(keyword);
                storage === that.historySearchType ? sessionStorage.setItem('searchHistory', JSON.stringify(newLoginHistory)) : localStorage.setItem('searchHistory', JSON.stringify(newLoginHistory));
            }
        }

        function getSearchHistory(storage) {
            var history = storage === that.historySearchType ? sessionStorage.getItem("searchHistory") : localStorage.getItem("searchHistory");
            var login = window.$oplus.appConfig.tenantId + "-" + currentUser.loginId;
            return history ? JSON.parse(history)[login] : [];
        }

        /**
         * deal with search result
         * @param result
         */
        function convertData(result) {
            var tempResult = [];
            that.searchMap = {}
            that.searchResultCount = result.content.length;
            result.content.forEach(function (r) {
                var moduleName = r.moduleName;
                if (moduleName in that.searchMap) {
                    tempResult = that.searchMap[moduleName];
                    r.moduleData = filterAttr(r.moduleData, r.filterAttrs)
                    tempResult.push(r);
                } else {
                    tempResult = [];
                    r.moduleData = filterAttr(r.moduleData, r.filterAttrs)
                    tempResult.push(r);
                    that.searchMap[moduleName] = tempResult;
                }
            })
            console.log("result:", that.searchMap)
        }

        function filterAttr(attrs, filterAttrs) {
            var filterMap = {};
            if (!isJson(attrs)) return filterMap;
            var attrMap = JSON.parse(attrs)
            for (var key in attrMap) {
                if (filterAttrs.indexOf(key) !== -1) {
                    if (isJson(attrMap[key])) {
                        var newAttrMap = JSON.parse(attrMap[key]);
                        for (var k in newAttrMap) {
                            filterMap[k] = newAttrMap[k];
                        }
                    } else {
                        filterMap[key] = attrMap[key];
                    }
                }
            }
            return filterMap;
        }

        function isJson(str) {
            if (typeof str == 'string') {
                try {
                    var obj = JSON.parse(str);
                    return !!(typeof obj == 'object' && obj);
                } catch (e) {
                    return false;
                }
            } else {
                return false;
            }
        }

        /**
         * clean all search result
         */
        function clean() {
            that.loading = false;
            that.keyword = "";
            that.searchMap = {}
            that.searchResultCount = undefined;
            that.historySearchRecord = getSearchHistory(that.historySearchType);
        }

        /**
         * history keyword search
         * @param record
         */
        function historySearch(record) {
            that.keyword = record;
            search(record)
        }

        /**
         * clean all search history
         */
        function cleanHistorySearch() {
            var history = sessionStorage.getItem("searchHistory");
            var login = window.$oplus.appConfig.tenantId + "-" + currentUser.loginId;
            if (history) {
                var r = JSON.parse(history);
                r[login] = [];
                sessionStorage.setItem('searchHistory', JSON.stringify(r));
                that.historySearchRecord = getSearchHistory(that.historySearchType);
            }
        }

        // function initCache() {
        //     try {
        //         that.searchCache = $cacheFactory('searchCache')
        //     } catch (e) {
        //         that.searchCache = $cacheFactory.get('searchCache');
        //     }
        // }
        //
        // function saveHistoryCache(keyword) {
        //     var history = that.searchCache.get("history");
        //     if (history) {
        //         if (history.indexOf(keyword) <= -1) {
        //             history.push(keyword)
        //         }
        //         if (history.length >= 10) {
        //             history.shift();
        //         }
        //         that.searchCache.put('history', history);
        //     } else {
        //         that.searchCache.put('history', new Array(keyword));
        //     }
        // }
        //
        // function getHistoryCache() {
        //     return that.searchCache ? that.searchCache.get("history") : [];
        // }

    }
})();
