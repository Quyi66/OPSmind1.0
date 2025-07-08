//HEAD 
(function(app) {
try { app = angular.module("oplus.main"); }
catch(err) { app = angular.module("oplus.main", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/main/accessdenied.html","<div ng-cloak>\n" +
    "    <div class=\"row\">\n" +
    "       <div class=\"col-md-8 offset-md-2\">\n" +
    "            <h1 data-translate=\"jhi_error.title\">Error Page!</h1>\n" +
    "\n" +
    "            <div class=\"alert alert-danger\" data-translate=\"jhi_error.http.403\">You are not authorized to access this page.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/main/error.html","<div class=\"h-100 d-flex justify-content-center flex-column align-items-center bg-light\">\n" +
    "    <div class=\"alert alert-danger\">\n" +
    "        <h1>Error</h1>\n" +
    "        <p>{{errorVm.errorMessage}}</p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")
}]);
})();