//HEAD 
(function(app) {
try { app = angular.module("oplus.layout"); }
catch(err) { app = angular.module("oplus.layout", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/layout/home/admin/home.html","<div class=\"h-full text-light\">\n" +
    "    <div class=\"op-blank-slate bg-dark\">\n" +
    "        <div class=\"op-blank-slate-icon\"><i class=\"fad fa-users-crown fa-5x\"></i></div>\n" +
    "        <h3 class=\"text-center text-muted\">{{'adm.title' | translate}}</h3>\n" +
    "        <p>{{'adm.sys_admin.desc' | translate}}</p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")
}]);
})();