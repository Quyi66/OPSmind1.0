//HEAD 
(function(app) {
try { app = angular.module("oplus.mac"); }
catch(err) { app = angular.module("oplus.mac", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/mac/message/mac-message-fixed.html","<style>\n" +
    "    mac-message-fixed .op-badge { \n" +
    "        color: white;\n" +
    "        background-color: #dc3545; \n" +
    "        position: absolute;\n" +
    "        border-radius: 999px;\n" +
    "        width: 1.2rem;\n" +
    "        height: 1.2rem;\n" +
    "        right: 0;\n" +
    "        top: 0;\n" +
    "        font-size: 12px;\n" +
    "        line-height: 1.2rem;\n" +
    "        text-align: center;\n" +
    "    }\n" +
    "\n" +
    "    mac-message-fixed {\n" +
    "      /* overflow: hidden; */\n" +
    "      background-color: #fff !important;\n" +
    "      color: #4b9cf3;\n" +
    "      border: 1px solid #ccc;\n" +
    "      border-radius: 999px;\n" +
    "      position: fixed;\n" +
    "      bottom: 2rem;\n" +
    "      right: 2rem;\n" +
    "      width: 4rem;\n" +
    "      height: 4rem;\n" +
    "      z-index: 2147000000;\n" +
    "\n" +
    "      box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);\n" +
    "      transition: box-shadow .08s linear,min-width .15s cubic-bezier(0.4,0,0.2,1);\n" +
    "    }\n" +
    "\n" +
    "    mac-message-fixed:hover{\n" +
    "      box-shadow: 0 1px 3px 0 rgba(60,64,67,0.302), 0 4px 8px 3px rgba(60,64,67,0.149);\n" +
    "      background-color: #fafafb;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"dropup w-100 h-100\">\n" +
    "    <a class=\"dropdown-toggle w-100 h-100 row justify-content-center align-content-center no-gutters\" data-bs-toggle=\"dropdown\">\n" +
    "        <i class=\"fa fa-3x fa-envelope\"></i>\n" +
    "        <span class=\"op-badge\" ng-if=\"$ctrl.newMessageCount > 0\">{{$ctrl.newMessageCount > 99 ? 99 : $ctrl.newMessageCount}}</span>\n" +
    "    </a>\n" +
    "    \n" +
    "    <mac-message-panel class=\"dropdown-menu dropdown-menu-end\" new-message-count=\"$ctrl.newMessageCount\"></mac-message-panel>\n" +
    "</div>")

$templateCache.put("app/modules/mac/message/mac-message-header.html","<style>\n" +
    "    mac-message-header .op-badge { \n" +
    "        background-color: #dc3545; \n" +
    "        position: absolute;\n" +
    "        border-radius: 999px;\n" +
    "        width: 0.5rem;\n" +
    "        height: 0.5rem;\n" +
    "        right: 0.2rem;\n" +
    "        top: 0.4rem;\n" +
    "    }\n" +
    "</style>\n" +
    "<li class=\"nav-item dropdown\">\n" +
    "    <a class=\"nav-link dropdown-toggle\" data-bs-toggle=\"dropdown\">\n" +
    "        <i class=\"fa fa-bell\"></i>\n" +
    "        <span class=\"op-badge\" ng-if=\"$ctrl.newMessageCount > 0\"></span>\n" +
    "    </a>\n" +
    "    <mac-message-panel class=\"dropdown-menu dropdown-menu-end\" new-message-count=\"$ctrl.newMessageCount\"></mac-message-panel>\n" +
    "</li>")

$templateCache.put("app/modules/mac/message/mac-message-panel.html","<div style=\"min-width: 20rem;height: 20rem;overflow-y: scroll;\" ng-click=\"$ctrl.stopPropagation($event)\">\n" +
    "    <div ng-repeat=\"item in $ctrl.messages track by item.id\" >\n" +
    "        <div class=\"card\" style=\"width: 90%;margin:0.4rem auto;\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <h5 class=\"card-title\">From: {{item.addresserName}}</h5>\n" +
    "                <h6 class=\"card-subtitle mb-2 text-muted\">{{item.createAt}}</h6>\n" +
    "                <!-- <p class=\"card-text\">{{$ctrl.getMessageText(item.content)}}</p> -->\n" +
    "                <p class=\"card-text\">{{item.content}}</p>\n" +
    "\n" +
    "                <div class=\"d-flex justify-content-between\">\n" +
    "                    <button type=\"button\" class=\"btn btn-link\" ng-if=\"item.status === 0\" ng-click=\"$ctrl.handleMessage(item,false)\">{{'mac.action.ignore' | translate}}</button>\n" +
    "                    <button type=\"button\" class=\"btn\" \n" +
    "                            ng-class=\"{'btn-primary': item.status === 0, 'btn-secondary': item.status === 1}\"\n" +
    "                            ng-click=\"$ctrl.handleMessage(item, true)\">\n" +
    "                        {{ (item.status === 0 ? 'mac.action.handle' : 'mac.action.view') | translate }}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "                <i class=\"fa fa-circle position-absolute\" style=\"top:0.4rem;right:0.4rem;\"\n" +
    "                    ng-class=\"{'text-danger': item.status === 0, 'text-secondary': item.status === 1}\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\" ng-if=\"$ctrl.messages.length > 0 && $ctrl.hasMore\">\n" +
    "        <a class=\"dropdown-item text-primary card-link\" ng-click=\"$ctrl.fetchMoreMessages()\">{{'mac.action.more' | translate}}</a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\" ng-if=\"$ctrl.messages.length > 0 && !$ctrl.hasMore\">\n" +
    "        <span class=\"text-secondary\">{{'mac.message.no_more' | translate}}</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"opx-content text-center justify-content-center align-content-center flex-wrap\" \n" +
    "          ng-if=\"$ctrl.messages.length === 0\">\n" +
    "        <p class=\"col-md-12\">{{'mac.message.no_news' | translate}}</p>\n" +
    "        <a class=\"op-jumbo-link col-md-12 text-primary\" ng-click=\"$ctrl.fetchMessages($ctrl.pageNum, $ctrl.pageSize, false)\">{{'mac.message.view_history' | translate}}</a>\n" +
    "    </div>\n" +
    "</div>")
}]);
})();