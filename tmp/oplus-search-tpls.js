//HEAD 
(function(app) {
try { app = angular.module("oplus.search"); }
catch(err) { app = angular.module("oplus.search", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/search/search-index.html","<div class=\"app search-app-header-fixed\">\n" +
    "    <div id=\"content\" class=\"app-content\" role=\"main\" style=\"margin: 20px\">\n" +
    "        <div class=\"app-content-body \">\n" +
    "            <div class=\"search-tab-content\">\n" +
    "                <h1 class=\"m-n font-thin h3\" style=\"text-align: center;margin: 20px 0\">\n" +
    "                    <i class=\"fab fa-searchengin fa-2x\"></i>\n" +
    "                    &nbsp;<strong>Oplus System Search Center</strong>\n" +
    "                </h1>\n" +
    "            </div>\n" +
    "            <div class=\"search-tab-content\">\n" +
    "                <form action=\"#\" class=\"search-m-b-md\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input type=\"text\" ng-model=\"$ctrl.keyword\" class=\"form-control input-lg search\"\n" +
    "                               placeholder=\"Search keyword\">\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <select id=\"field_type\" name=\"type\" class=\"form-select op-w-sm search\"\n" +
    "                                    class=\"search-major\"\n" +
    "                                    ng-model=\"$ctrl.searchType\">\n" +
    "                                <option class=\"search-major\" value=\"{{key}}\"\n" +
    "                                        ng-repeat=\"(key,value) in $ctrl.searchTypes\">\n" +
    "                                    {{value}}\n" +
    "                                </option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <span class=\"input-group-btn\"><button\n" +
    "                                class=\"btn btn-lg btn-secondary search\" type=\"button\"\n" +
    "                                ng-click=\"$ctrl.search($ctrl.keyword)\">\n" +
    "                            <i class=\"fa fa-search\" style=\"margin-right: 5px\"></i>Search</button></span>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "                <p class=\"search-m-b-md\" ng-if=\"$ctrl.searchResultCount > 0 && $ctrl.keyword\">\n" +
    "                    <span><strong\n" +
    "                            style=\"color: #2a9292\">{{$ctrl.searchResultCount}}</strong> Results found for keyword: <strong>{{$ctrl.keyword}}</strong></span>\n" +
    "                    <span class=\"text-secondary\" style=\"float: right\">\n" +
    "                        <i class=\"fa fa-trash\" style=\"margin-right: 2px\"></i>\n" +
    "                        <a ng-click=\"$ctrl.clean()\">{{'search.index.clean_result' | translate}}</a></span>\n" +
    "                </p>\n" +
    "                <div class=\"search-tab-container\"\n" +
    "                     ng-if=\"$ctrl.searchResultCount === undefined && $ctrl.historySearchRecord.length > 0 && !$ctrl.loading\">\n" +
    "                    <p class=\"search-m-b-md\"><i class=\"fa fa-history\"\n" +
    "                                                style=\"margin-right: 2px\"></i><strong>{{'search.index.history_record' | translate}}:</strong>\n" +
    "                        <span class=\"text-secondary\" style=\"float: right\"><i class=\"fa fa-trash\"\n" +
    "                                                                             style=\"margin-right: 2px\"></i>\n" +
    "                        <a ng-click=\"$ctrl.cleanHistorySearch()\">{{'search.index.clean_history_record' | translate}}</a></span>\n" +
    "                    </p>\n" +
    "                    <div class=\"udp-linelimit\">\n" +
    "                        <a class=\"badge badge-secondary\" style=\"margin: 0 15px 10px;padding: 5px 10px;\"\n" +
    "                           ng-repeat=\"record in $ctrl.historySearchRecord track by $index\"\n" +
    "                           target=\"_blank\" ng-click=\"$ctrl.historySearch(record)\">{{record}}</a><br>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"tab-container search-tab-container\" ng-if=\"$ctrl.searchResultCount > 0\">\n" +
    "                    <ul class=\"nav nav-tabs search-nav search-nav-tabs\">\n" +
    "                        <li ng-class=\"{'active': $index === 0}\"\n" +
    "                            ng-repeat=\"(key, value) in $ctrl.searchMap track by $index\">\n" +
    "                            <a href data-toggle=\"tab\" data-target=\"#href{{key}}\">\n" +
    "                                {{key}}<span class=\"badge badge-sm search-m-l-xs search-message\"\n" +
    "                                             ng-class=\"$ctrl.showSearchStyle(key)\">{{value.length}}</span>\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                    <div class=\"tab-content search-tab-content\">\n" +
    "                        <div ng-class=\"{'tab-pane' :true,'active': $index === 0}\" id=\"href{{k}}\"\n" +
    "                             ng-repeat=\"(k, v) in $ctrl.searchMap track by $index\">\n" +
    "                            <ul class=\"list-group no-borders pull-in m-b-none\">\n" +
    "                                <li class=\"list-group-item\" style=\"border: none\"\n" +
    "                                    ng-repeat=\"search in v track by $index\">\n" +
    "                                    <span class=\"h4 text-primary m-b-sm m-t-sm block\">\n" +
    "<!--                                          <a class=\"search-highlight-text\">{{search.moduleName}}</a>-->\n" +
    "                                          <a class=\"search-highlight-text\" ng-click=\"$ctrl.showDetail(search)\"\n" +
    "                                             ng-if=\"search.linkType === 'route'\">{{search.highlight}}</a>\n" +
    "                                          <a class=\"search-highlight-text\"\n" +
    "                                             udp-widget-interaction=\"{{search.linkParams}}\"\n" +
    "                                             ng-if=\"search.linkType === 'page'\">{{search.highlight}}</a>\n" +
    "                                           <span class=\"fa fa-eye search-view\"\n" +
    "                                                 ng-if=\"search.linkType === 'page'\"\n" +
    "                                                 udp-widget-interaction=\"{{search.linkParams}}\"\n" +
    "                                                 ng-click=\"$event\"></span>\n" +
    "                                            <span class=\"fa fa-eye search-view\"\n" +
    "                                                  ng-if=\"search.linkType === 'route'\"\n" +
    "                                                  ng-click=\"$ctrl.showDetail(search)\"></span>\n" +
    "                                    </span>\n" +
    "                                    <div class=\"card-body\">\n" +
    "                                        <div class=\"row\">\n" +
    "                                            <div class=\"col-3\"\n" +
    "                                                 ng-repeat=\"(k,v) in (search.moduleData) track by $index\"\n" +
    "                                                 style=\"margin-top: 5px;width: auto\">\n" +
    "                                                <span class=\"search-major\">{{k}}</span>&nbsp;:&nbsp;\n" +
    "                                                <span ng-class=\"{'search-highlight search-major':v.indexOf($ctrl.keyword)!==-1 && v.indexOf('+')===-1}\">\n" +
    "                                                    {{v}}</span>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <p ng-class=\" {'search-show-data':!$last}\"><span\n" +
    "                                            class=\"search-label search-bg-primary search-pos-rlt search-m-r search-inline search-wrapper-xs\"><i\n" +
    "                                            class=\"search-arrow right arrow-primary\"></i>  Module:</span>\n" +
    "                                        <a class=\"search-highlight-text\"\n" +
    "                                           ng-click=\"$ctrl.showDetail(search.module)\">{{search.tag}}</a>\n" +
    "                                    </p>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"card-body\" style=\"height:10rem;\" ng-if=\"$ctrl.loading\">\n" +
    "                    <div class=\"op-blank-slate\">\n" +
    "                        <div class=\"op-blank-slate-icon\">\n" +
    "                            <i class=\"fa fa-4x fa-pulse fa-spinner fa-fw\"></i>\n" +
    "                        </div>\n" +
    "                        <p class=\"op-flashing-text\">{{'search.index.searching' | translate}}</p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"card\" style=\"border: none; margin-top: 100px\" ng-if=\"$ctrl.searchResultCount===0\">\n" +
    "                    <div class=\"card-body op-blank-slate\">\n" +
    "                        <div class=\"op-blank-slate-body\">\n" +
    "                            <div class=\"op-blank-slate-icon\">\n" +
    "                                <i class=\"fa fa-4x fa-inbox\"></i>\n" +
    "                            </div>\n" +
    "                            <p>{{'search.index.by_keyword' | translate}}<strong style=\"color: red\">&nbsp;{{$ctrl.keyword}}&nbsp;</strong>\n" +
    "                                {{'search.index.not_found' | translate}}\n" +
    "                            </p>\n" +
    "                            <button class=\"btn m-b-xs btn-sm btn-danger\" ng-click=\"$ctrl.clean()\">\n" +
    "                                <i class=\"fa fa-trash\" style=\"margin-right: 5px\"></i>{{'search.index.clean' | translate}}\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")
}]);
})();