//HEAD 
(function(app) {
try { app = angular.module("oplus.ssc"); }
catch(err) { app = angular.module("oplus.ssc", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/ssc/applet-manage/applet-manage-copy.html","<form name=\"copyForm\" ng-submit=\"$ctrl.confirmCopy()\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\">{{'adm.content.copy_applet' | translate}}</h4>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"$ctrl.clear()\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'ssc.applet.manage.copy.new.name' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"title\" ng-model=\"$ctrl.applet.title\" required>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'ssc.applet.manage.copy.new.code' | translate}} </label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"name\" ng-model=\"$ctrl.applet.name\" required>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"$ctrl.clear()\">\n" +
    "            <span>{{'common.action.cancel'|translate}}</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"copyForm.$invalid\" class=\"btn btn-warning\">\n" +
    "            <span>{{'common.action.copy'|translate}}</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/applet-manage/applet-manage-delete.html","<form name=\"deleteForm\" ng-submit=\"vm.confirmDelete(vm.applet.id)\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\">{{'adm.content.ok_delete' | translate}}</h4>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"vm.clear()\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "        <p>{{'ssc.applet.manage.copy.delete' | translate}}</p>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "            <span>{{'common.action.cancel'|translate}}</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"deleteForm.$invalid\" class=\"btn btn-danger\">\n" +
    "            <span>{{'common.action.delete'|translate}}</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/applet-manage/applet-manage-detail.html","<form name=\"editForm\" class=\"form-horizontal op-smartform\" role=\"form\" novalidate show-validation>\n" +
    "\n" +
    "    <div class=\"wrapper\">\n" +
    "        <div class=\"card card-default\">\n" +
    "            <nav class=\"navbar navbar-light\">\n" +
    "                <div class=\"opx-navbar-title\">{{'ssc.applet.manage.detail' | translate}}</div>\n" +
    "                <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\"\n" +
    "                        ng-click=\"$ctrl.clear()\">\n" +
    "                </button>\n" +
    "            </nav>\n" +
    "\n" +
    "            <div class=\"modal-body\">\n" +
    "\n" +
    "                <uib-tabset class=\"tab-container wrapper\" active=\"1\">\n" +
    "                    <uib-tab index=\"1\" heading=\"{{'ssc.applet.manage.detail.basic'|translate}}\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'ssc.applet.manage.detail.basic.name' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" name=\"title\" ng-model=\"$ctrl.applet.title\"\n" +
    "                                           readonly>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'ssc.applet.manage.detail.basic.code' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" name=\"name\" ng-model=\"$ctrl.applet.name\"\n" +
    "                                           readonly>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'ssc.applet.manage.detail.basic.version' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" name=\"version\"\n" +
    "                                           ng-model=\"$ctrl.applet.version\" readonly>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'common.attr.created_at' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" name=\"createdAt\"\n" +
    "                                           ng-model=\"$ctrl.applet.createdAt\" readonly>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"2\" heading=\"{{'ssc.applet.manage.detail.page'|translate}}\">\n" +
    "                        <page-list show-applet=\"false\" applet-code=\"$ctrl.applet.name\"\n" +
    "                                   options=\"{enableEdit:false}\"></page-list>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"3\" heading=\"{{'ssc.applet.manage.detail.dts'|translate}}\">\n" +
    "                        <opx-datatable table-config=\"$ctrl.dtsTableConfig\"></opx-datatable>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"4\" heading=\"{{'ssc.applet.manage.detail.jao'|translate}}\">\n" +
    "                        <job-list show-applet=\"false\" applet-code=\"$ctrl.applet.name\"></job-list>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"5\" heading=\"{{'ssc.applet.manage.detail.dcModel'|translate}}\">\n" +
    "                        <opx-datatable table-config=\"$ctrl.dcModelTableConfig\"></opx-datatable>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"6\" heading=\"{{'ssc.applet.manage.detail.jobFlow'|translate}}\">\n" +
    "                        <opx-datatable table-config=\"$ctrl.jobFlowTableConfig\"></opx-datatable>\n" +
    "                    </uib-tab>\n" +
    "                </uib-tabset>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/ssc/applet-manage/applet-manage-export.html","<form ng-submit=\"$ctrl.doExport()\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\">{{'ssc.applet.manage.export' | translate}}</h4>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div style=\"padding-top: 20px; display: flex; justify-content: center;\">\n" +
    "            <label class=\"control-label\">{{'ssc.applet.manage.export.tip' | translate}}: </label>\n" +
    "            <select ng-model=\"$ctrl.containsScript\" class=\"form-select op-w-auto\" style=\"width: 50%\">\n" +
    "                <option value=true>{{'ssc.applet.manage.export.tip.yes' | translate}}</option>\n" +
    "                <option value=false>{{'ssc.applet.manage.export.tip.no' | translate}}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <button class=\"btn btn-default\" type=\"button\" ng-click=\"$ctrl.cancelExport()\">\n" +
    "                {{'common.action.cancel' | translate}}\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-primary\" type=\"submit\"> {{'common.action.export' | translate}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/applet-manage/applet-manage-import.html","<form ng-submit=\"$ctrl.doImport()\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\">{{'ssc.applet.manage.import' | translate}}</h4>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"form-group\" >\n" +
    "            <label class=\"control-label pr-2\">{{'ssc.applet.manage.import.select' | translate}}</label>\n" +
    "            <select ng-model=\"$ctrl.importType\" class=\"form-select op-w-auto \" style=\"width: 35%; display: inline !important;\">\n" +
    "                <option value=\"mod\">{{'ssc.applet.manage.import.select.mod' | translate}}</option>\n" +
    "                <option value=\"del\">{{'ssc.applet.manage.import.select.init' | translate}}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\" style=\"padding-top: 15px;padding-bottom: 10px\">\n" +
    "            <button type=\"button\" class=\"btn btn-outline-primary\" udp-file-browser\n" +
    "                    ng-model=\"$ctrl.selectedFile\"\n" +
    "                    on-change=\"$ctrl.preUpload\">\n" +
    "                <i class=\"fa fa-folder-open-o\"></i> {{'adm.content.select_import_file' | translate}}\n" +
    "            </button>\n" +
    "            <strong>{{$ctrl.selectedFile.name}}</strong>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-6\">\n" +
    "                <div id=\"appletTree\" ng-show=\"appletDisplay\" style=\"min-height: 200px;\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"col-6\">\n" +
    "                <div id=\"scriptsTree\" ng-show=\"scriptsDisplay\" style=\"min-height: 200px;\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <button class=\"btn btn-default\" type=\"button\" ng-click=\"$ctrl.cancelImport()\">\n" +
    "                {{'common.action.cancel' | translate}}\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-primary\" type=\"submit\"> {{'common.action.import' | translate}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/applet-manage/applet-manage.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'ssc.applet.manage' | translate}}</div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class=\"mb-1\">\n" +
    "        <ul class=\"nav nav-mdc-op\" op-tab-bar style=\"width:100%;\" op-tab-bar>\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a class=\"nav-link\" ng-click=\"$ctrl.activeTab = 'app'\" ng-class=\"{active: $ctrl.activeTab === 'app'}\">\n" +
    "                    {{'ssc.applet.manage.applet' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a class=\"nav-link\" ng-click=\"$ctrl.activeTab = 'can'\" ng-class=\"{active: $ctrl.activeTab === 'can'}\">\n" +
    "                    {{'ssc.applet.manage.trash' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"card-body\" ng-if=\"$ctrl.activeTab === 'app'\">\n" +
    "        <opx-datatable table-config=\"appletsTableConfig\">\n" +
    "            <button class=\"btn btn-primary\"\n" +
    "                    ng-disabled=\"!appletsTableConfig.selectedItems.length>0\"\n" +
    "                    ng-click=\"$ctrl.exportApplet(appletsTableConfig.selectedItems)\"\n" +
    "                  >\n" +
    "                <i class=\"fa fa-caret-square-right fa-fw\"></i> {{'ssc.applet.manage.export' | translate}}\n" +
    "            </button>\n" +
    "\n" +
    "            <button class=\"btn btn-default\" uaa-has-permission=\"cmd:edit:*\"\n" +
    "                    ui-sref=\"app.ssc.config.applet-manage.import\">\n" +
    "                <i class=\"fa fa-caret-square-right fa-fw\"></i> {{'ssc.applet.manage.import' | translate}}\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"card-body\" ng-if=\"$ctrl.activeTab === 'can'\">\n" +
    "        <opx-datatable table-config=\"recycledAppletsTableConfig\">\n" +
    "            <button class=\"btn btn-danger\"\n" +
    "                ng-click=\"$ctrl.clearRecycle()\">\n" +
    "                <i class=\"fa fa-trash-alt\"></i> {{'ssc.applet.manage.trash.empty' | translate}}\n" +
    "            </button>\n" +
    "\n" +
    "            <button class=\"btn btn-danger\" ng-disabled=\"!recycledAppletsTableConfig.selectedItems.length>0\"\n" +
    "                ng-click=\"$ctrl.deleteSelectedRecycle()\">\n" +
    "                <i class=\"fa fa-trash-alt\"></i> {{'ssc.applet.manage.trash.delete' | translate}}\n" +
    "            </button>\n" +
    "\n" +
    "            <button class=\"btn btn-warning\" ng-disabled=\"!recycledAppletsTableConfig.selectedItems.length>0\"\n" +
    "                ng-click=\"$ctrl.recoverSelectedRecycle()\">\n" +
    "                <i class=\"fa fa-redo\"></i> {{'adm.applet.recover' | translate}}\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/appres/appres-index.html","<div class=\"opx-layout-vflex\" uaa-has-permission=\"adm:view:*\" uaa-deny-message=\"无权访问\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">{{'adm.appres.title' | translate}}</li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <ul class=\"navbar-nav me-auto ms-5\">\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a ui-sref=\"app.ssc.appres.page\" ui-sref-active=\"active\" class=\"nav-link px-3\"><i\n" +
    "                        class=\"fa fa-oplus-udp-page\"></i>\n" +
    "                    {{'udp.page.title' | translate}}</a>\n" +
    "            </li>\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a ui-sref=\"app.ssc.appres.dataset\" ui-sref-active=\"active\" class=\"nav-link px-3\"><i\n" +
    "                        class=\"fa fa-oplus-dts-dataset\"></i>\n" +
    "                    {{'dts.dataset.title' | translate}}</a>\n" +
    "            </li>\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a ui-sref=\"app.ssc.appres.job\" ui-sref-active=\"active\" class=\"nav-link px-3\"><i\n" +
    "                        class=\"fa fa-oplus-jao-job\"></i>\n" +
    "                    {{'jao.term.job' | translate}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </nav>\n" +
    "    <div ui-view=\"appres_main_view\" class=\"opx-flex-fill scroll-y\">\n" +
    "        <div class=\"bg-light p-5 d-flex flex-column justify-content-center h-100\">\n" +
    "            <div class=\"text-center p-5\">{{'adm.appres.desc' | translate}}</div>\n" +
    "            <div class=\"d-flex justify-content-center\">\n" +
    "                <a class=\"card op-feature-card\" ui-sref=\"app.ssc.appres.page\">\n" +
    "                    <div class=\"card-img-top\"><i\n" +
    "                            class=\"fad fa-oplus-udp-page\"></i></div>\n" +
    "                    <div class=\"card-body\" ui-sref-active=\"active\">\n" +
    "                        <h3 class=\"card-title\">{{ 'udp.page.title' | translate}}</h3>\n" +
    "                        <p class=\"card-text\">{{ 'udp.page.desc' | translate}}</p>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "                <a class=\"card op-feature-card ms-5\" ui-sref=\"app.ssc.appres.dataset\">\n" +
    "                    <div class=\"card-img-top\"><i\n" +
    "                            class=\"fad fa-oplus-dts-dataset\"></i></div>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <h3 class=\"card-title\">{{ 'dts.dataset.title' | translate}}</h3>\n" +
    "                        <p class=\"card-text\">{{ 'dts.dataset.desc' | translate}}</p>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "                <a class=\"card op-feature-card ms-5\" ui-sref=\"app.ssc.appres.job\">\n" +
    "                    <div class=\"card-img-top\"><i\n" +
    "                            class=\"fad fa-oplus-jao-job\"></i></div>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <h3 class=\"card-title\">{{ 'jao.job.title' | translate}}</h3>\n" +
    "                        <p class=\"card-text\">{{ 'jao.job.desc' | translate}}</p>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/ssc/email/email.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{ 'adm.content.electronic_mail_config' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <form class=\"op-smartform form-vertical\" ng-submit=\"submitForm()\">\n" +
    "            <div class=\"form-group col-6\">\n" +
    "                <label class=\"control-label\">{{ 'acm.common.header.user_name' | translate}}<span class=\"text-danger align-middle\"> * </span></label>\n" +
    "                <input type=\"email\" class=\"form-control\" placeholder=\"Enter email\" ng-model=\"vm.emails.username\" required>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-6\">\n" +
    "                <label class=\"control-label\">{{ 'common.menu.account.password' | translate}}<span class=\"text-danger align-middle\"> * </span></label>\n" +
    "                <input type=\"test\" style=\"-webkit-text-security: disc;\"  class=\"form-control\" placeholder=\"Password\" ng-model=\"vm.emails.password\" required>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-6\">\n" +
    "                <label class=\"control-label\">{{ 'adm.content.mail_server' | translate}}<span class=\"text-danger align-middle\"> * </span></label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Mail server\" ng-model=\"vm.emails.host\" required>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-6\">\n" +
    "                <label class=\"control-label\">{{ 'adm.content.server_port' | translate}}<span class=\"text-danger align-middle\"> * </span></label>\n" +
    "                <input type=\"number\" class=\"form-control\" placeholder=\"Server port\" ng-model=\"vm.port\" required>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-6\">\n" +
    "                <label class=\"control-label\">{{ 'adm.content.sender_name' | translate}}<span class=\"text-danger align-middle\"> * </span></label>\n" +
    "                <input type=\"email\" class=\"form-control\" placeholder=\"The value is the same as the user name\" ng-model=\"vm.emails.from\" required>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-6\">\n" +
    "                <div class=\"form-control-wrapper pull-left\">\n" +
    "                    <label class=\"control-label\">\n" +
    "                        {{ 'adm.content.debug_mode' | translate}}\n" +
    "                    </label>\n" +
    "                    <div class=\"form-check form-switch\">\n" +
    "                        <input class=\"form-check-input\" style=\"width:3rem;height:1.4rem;cursor: pointer;\" type=\"checkbox\" value=\"true\" ng-model=\"vm.debug_on_off\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-control-wrapper pl-5\">\n" +
    "                    <label class=\"control-label\">\n" +
    "                        {{ 'adm.content.ssl_auth' | translate}}\n" +
    "                    </label>\n" +
    "                    <div class=\"form-check form-switch\">\n" +
    "                        <input class=\"form-check-input\" style=\"width:3rem;height:1.4rem;cursor: pointer;\" type=\"checkbox\" value=\"true\" ng-model=\"vm.ssl_on_off\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-6\">\n" +
    "                <label class=\"control-label\">{{ 'adm.content.type_of_receiver' | translate}}</label>\n" +
    "                <select class=\"form-select \" ng-model=\"vm.emails.recipient_type\">\n" +
    "                    <option ng-repeat=\"option in recipientTypes\" value=\"{{option.value}}\">\n" +
    "                        {{option.label}}\n" +
    "                    </option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary opx-btn-ok me-3\">{{ 'common.entity.action.save' | translate}}</button>\n" +
    "                <button type=\"button\" class=\"btn btn-default me-3\" ng-click=\"testEmail()\">\n" +
    "                    <i class=\"fa fa-shipping-fast\"></i> {{ 'adm.content.test_run' | translate}}</button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/ssc/engine/engine-aap.html","<div class=\"opx-layout-vflex\" uaa-has-permission=\"adm:view:*\" uaa-deny-message=\"无权访问\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">{{'adm.engine.title' | translate}}</li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <form class=\"op-smartform form-vertical\">\n" +
    "            <div class=\"form-group col-6\">\n" +
    "                <label class=\"control-label\">OPlus Execute Engine&nbsp;<code>Ansible or Ansible Automation Platform</code></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"opx-check-group btn-group opx-primary\">\n" +
    "                        <input ng-repeat-start=\"engine in vm.ansible_engines track by $index\"\n" +
    "                               type=\"radio\" name=\"formSelectedCityBtnGroup\" value=\"{{engine.value}}\"\n" +
    "                               id=\"form_radiobtngroup_opt_{{$index}}\"\n" +
    "                               ng-model=\"vm.usedEngine\"\n" +
    "                               ng-change=\"vm.changeEngine()\">\n" +
    "                        <label ng-repeat-end for=\"form_radiobtngroup_opt_{{$index}}\">{{engine.name}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"vm.scriptEngine === 'ansible'\">\n" +
    "                <div class=\"form-group col-6\">\n" +
    "                    <label class=\"control-label\">Enable Host Forks&nbsp;</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <div class=\"form-check form-switch\">\n" +
    "                            <label>\n" +
    "                                <input class=\"form-check-input\" style=\"width:4rem;height:1.4rem;cursor: pointer;\"\n" +
    "                                       ng-model=\"vm.jaoParamMap.is_fork.value\"\n" +
    "                                       type=\"checkbox\" />\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-6\">\n" +
    "                    <label class=\"control-label\">Host Forks Size &nbsp;</label>\n" +
    "                    <div class=\"input-group op-w-sm\">\n" +
    "                        <label>\n" +
    "                            <input type=\"number\" autocomplete=\"off\" class=\"form-control\" min=\"100\" ng-model=\"vm.jaoParamMap.forks.value\"/>\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-6\">\n" +
    "                    <label class=\"control-label\">Sync Git Project Before Starting Job &nbsp;</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <div class=\"form-check form-switch\">\n" +
    "                            <label>\n" +
    "                                <input class=\"form-check-input\" style=\"width:4rem;height:1.4rem;cursor: pointer;\"\n" +
    "                                       ng-model=\"vm.jaoParamMap.sync_script_git.value\"\n" +
    "                                       type=\"checkbox\" />\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-6\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary opx-btn-ok me-3\" ng-click=\"vm.saveAnsibleConfig()\">\n" +
    "                        {{ 'common.entity.action.save' | translate}}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"vm.scriptEngine === 'aap'\">\n" +
    "                <div class=\"form-group col-6\">\n" +
    "                    <label class=\"control-label\">AAP Clear&nbsp;</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <div class=\"form-check form-switch\">\n" +
    "                            <label>\n" +
    "                                <input class=\"form-check-input\" style=\"width:4rem;height:1.4rem;cursor: pointer;\"\n" +
    "                                       value=\"vm.ataParamMap.tower_clear\"\n" +
    "                                       type=\"checkbox\" ng-model=\"vm.ataParamMap.tower_clear.value\"/>\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group col-6\">\n" +
    "                    <label class=\"control-label\">AAP Web Login Config</label>\n" +
    "                    <div class=\"form-control-wrapper op-combo\">\n" +
    "                        <div class=\"p-3 \">\n" +
    "                            <label class=\"control-label\">Login Host</label>\n" +
    "                            <div class=\"input-group op-w-sm\">\n" +
    "                                <label>\n" +
    "                                    <input type=\"text\" class=\"form-control\" ng-model=\"vm.ataParamMap.tower_host.value\"/>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                            <p class=\"help-block\">\n" +
    "                                <span>{{ 'adm.engine.aap.web.web_login_host' | translate}}</span>\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                        <div class=\"p-3 \">\n" +
    "                            <label class=\"control-label\">Login Name</label>\n" +
    "                            <div class=\"input-group op-w-sm\">\n" +
    "                                <label>\n" +
    "                                    <input type=\"text\" class=\"form-control\"\n" +
    "                                           ng-model=\"vm.ataParamMap.tower_login_config.value.web_login_name\"/>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                            <p class=\"help-block\">\n" +
    "                                <span>{{ 'adm.engine.aap.web.web_login_name' | translate}}</span>\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                        <div class=\"p-3 \">\n" +
    "                            <label class=\"control-label\">Login Password</label>\n" +
    "                            <div class=\"input-group op-w-sm\">\n" +
    "                                <label>\n" +
    "                                    <input type=\"password\" autocomplete=\"off\" class=\"form-control\"\n" +
    "                                           ng-model=\"vm.ataParamMap.tower_login_config.value.web_login_pwd\"/>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                            <p class=\"help-block\">\n" +
    "                                <span>{{ 'adm.engine.aap.web.web_login_pwd' | translate}}</span>\n" +
    "                            </p>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"vm.isConnectAap\">\n" +
    "                    <div class=\"col-md-12\" >\n" +
    "                        <label class=\"control-label\">AAP Servers&nbsp;<code>{{ 'adm.engine.aap.servers' | translate}}</code></label>\n" +
    "\n" +
    "                        <table id=\"mytable\" class=\"opx-table table table-hover dataTable no-footer\">\n" +
    "\n" +
    "                            <thead>\n" +
    "                            <th style=\"display:none\">index</th>\n" +
    "                            <th style=\"width:10%;\">host</th>\n" +
    "                            <th style=\"width:5%;\">port</th>\n" +
    "                            <th style=\"width:15%;\">username</th>\n" +
    "                            <th style=\"width:15%;\">password</th>\n" +
    "                            <th style=\"width:10%;\">操作</th>\n" +
    "                            </thead>\n" +
    "\n" +
    "                            <tbody>\n" +
    "                            <tr ng-repeat=\"cs in vm.ataParamMap.tower_login_config.value.cluster_servers\">\n" +
    "                                <td style=\"display:none\">{{$index + 1}}</td>\n" +
    "                                <td>\n" +
    "                                    <label>\n" +
    "                                        <input name=\"host{{$index}}\" ng-model=\"cs.host\">\n" +
    "                                    </label>\n" +
    "                                </td>\n" +
    "                                <td>\n" +
    "                                    <label>\n" +
    "                                        <input name=\"port{{$index}}\" ng-model=\"cs.port\"/>\n" +
    "                                    </label>\n" +
    "                                </td>\n" +
    "                                <td>\n" +
    "                                    <label>\n" +
    "                                        <input name=\"username{{$index}}\" ng-model=\"cs.username\">\n" +
    "                                    </label>\n" +
    "                                </td>\n" +
    "                                <td>\n" +
    "                                    <label>\n" +
    "                                        <input name=\"password{{$index}}\" type=\"password\" ng-model=\"cs.password\">\n" +
    "                                    </label>\n" +
    "                                </td>\n" +
    "                                <td>\n" +
    "                                    <div class=\"buttons\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteClusterServe($index)\">\n" +
    "                                            Delete\n" +
    "                                        </button>\n" +
    "                                        <button type=\"button\" class=\"btn btn-info\" ng-click=\"addClusterServer()\">Add\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-12\" >\n" +
    "                        <label class=\"control-label\">AAP Execute Config&nbsp;<code>{{ 'adm.engine.aap.config' | translate}}</code></label>\n" +
    "\n" +
    "                        <div class=\"form-control-wrapper op-combo\">\n" +
    "                            <div class=\"p-3 \">\n" +
    "                                <label class=\"control-label\">Git Project</label>\n" +
    "                                <div class=\"input-group op-w-sm\">\n" +
    "                                    <select op-select class=\"form-select flex-fill\" ng-model=\"vm.ataParamMap.tower_config.value.git_project_id\"\n" +
    "                                            ng-options=\"project.id as project.name for project in vm.queryProjects | filter:{scm_type:'git'}\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"p-3 \">\n" +
    "                                <label class=\"control-label\">Organization</label>\n" +
    "                                <div class=\"input-group op-w-sm\">\n" +
    "                                    <select op-select class=\"form-select flex-fill\"\n" +
    "                                            ng-model=\"vm.ataParamMap.tower_config.value.organization_id\"\n" +
    "                                            ng-options=\"organization.id as organization.name for organization in vm.queryOrganizations\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"p-3 \">\n" +
    "                                <label class=\"control-label\">Manual Project</label>\n" +
    "                                <div class=\"input-group op-w-sm\">\n" +
    "                                    <select op-select=\"scm_type\" class=\"form-select flex-fill\"\n" +
    "                                            ng-model=\"vm.ataParamMap.tower_config.value.template_project_id\"\n" +
    "                                            ng-change=\"vm.changeProjectPath()\"\n" +
    "                                            ng-options=\"project.id as project.name for project in vm.queryProjects | filter:{scm_type:'!git'}\">\n" +
    "\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"p-3 col-3\">\n" +
    "                                <label class=\"control-label\">Manual Project Path</label>\n" +
    "                                <div class=\"op-w-full\">\n" +
    "                                    <input class=\"form-control\" ng-model=\"vm.ataParamMap.tower_config.value.project_path\" disabled/>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                        <div class=\"form-control-wrapper op-combo\">\n" +
    "                            <div class=\"p-3 \">\n" +
    "                                <label class=\"control-label\">Credential</label>\n" +
    "                                <div class=\"input-group op-w-sm\">\n" +
    "                                    <select class=\"form-select flex-fill\"\n" +
    "                                            ng-model=\"vm.ataParamMap.tower_config.value.template_credentials_id\"\n" +
    "                                            op-select=\"{datatype:'string'}\" multiple\n" +
    "                                            ng-options=\"credential.id as credential.name for credential in vm.queryCredentials\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"p-3 \">\n" +
    "                                <label class=\"control-label\">Instance Group</label>\n" +
    "                                <div class=\"input-group op-w-sm\">\n" +
    "                                    <select op-select class=\"form-select flex-fill\"\n" +
    "                                            ng-model=\"vm.ataParamMap.tower_config.value.instance_group\"\n" +
    "                                            ng-options=\"ig.name as ig.name for ig in vm.queryInstance_groups\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"p-3 \">\n" +
    "                                <label class=\"control-label\">Execution Environment</label>\n" +
    "                                <div class=\"input-group op-w-sm\">\n" +
    "                                    <select op-select class=\"form-select flex-fill\"\n" +
    "                                            ng-model=\"vm.ataParamMap.tower_config.value.execution_environment\"\n" +
    "                                            ng-options=\"ee.id as ee.name for ee in vm.queryExecution_environments\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"p-3\">\n" +
    "                                <label class=\"control-label\">Template Become Enabled</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <div class=\"form-check form-switch\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"form-check-input\" style=\"width:4rem;height:1.4rem;cursor: pointer;\"\n" +
    "                                                   value=\"vm.tower_config.template_become\"\n" +
    "                                                   type=\"checkbox\" ng-model=\"vm.ataParamMap.tower_config.value.template_become\"/>\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"p-3\">\n" +
    "                                <label class=\"control-label\">Sync Git Project Before Starting Job</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <div class=\"form-check form-switch\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"form-check-input\" style=\"width:4rem;height:1.4rem;cursor: pointer;\"\n" +
    "                                                   value=\"vm.tower_config.sync_git_project_before_starting_job\"\n" +
    "                                                   type=\"checkbox\" ng-model=\"vm.ataParamMap.tower_config.value.sync_git_project_before_starting_job\"/>\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"p-3\">\n" +
    "                                <label class=\"control-label\">Encrypt Host Pass</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <div class=\"form-check form-switch\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"form-check-input\" style=\"width:4rem;height:1.4rem;cursor: pointer;\"\n" +
    "                                                   value=\"vm.tower_config.encrypt_host_pass\"\n" +
    "                                                   type=\"checkbox\" ng-model=\"vm.ataParamMap.tower_config.value.encrypt_host_pass\"/>\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-control-wrapper op-combo\">\n" +
    "                            <button type=\"submit\" class=\"btn btn-outline-primary ml-3 mt-3\" ng-click=\"vm.openEEUploaderPage()\">\n" +
    "                                Execution Environment Upload\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-6\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary opx-btn-ok ml-3\" ng-click=\"vm.saveAapConfig()\">\n" +
    "                        {{ 'common.entity.action.save' | translate}}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/engine/engine-ansible.html","")

$templateCache.put("app/modules/ssc/engine/engine.html","<div class=\"opx-layout-vflex\" uaa-has-permission=\"adm:view:*\" uaa-deny-message=\"无权访问\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">{{'adm.engine.title' | translate}}</li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <ul class=\"navbar-nav me-auto ms-5\">\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a ui-sref=\"app.ssc.engine.ansible\" ui-sref-active=\"active\" class=\"nav-link px-3\"><i\n" +
    "                        class=\"fab fa-redhat\"></i>\n" +
    "                    Ansible</a>\n" +
    "            </li>\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a ui-sref=\"app.ssc.engine.aap\" ui-sref-active=\"active\" class=\"nav-link px-3\"><i\n" +
    "                        class=\"fab fab fa-adn\"></i>\n" +
    "                    AAP</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </nav>\n" +
    "    <div ui-view=\"appres_main_view\" class=\"opx-flex-fill scroll-y\">\n" +
    "        <div class=\"bg-light p-5 d-flex flex-column justify-content-center h-100\">\n" +
    "            <div class=\"text-center p-5\">{{'adm.engine.title' | translate}}</div>\n" +
    "            <div class=\"d-flex justify-content-center\">\n" +
    "                <a class=\"card op-feature-card\" ui-sref=\"app.ssc.engine.ansible\">\n" +
    "                    <div class=\"card-img-top\"><i\n" +
    "                            class=\"fab fa-redhat\"></i></div>\n" +
    "                    <div class=\"card-body\" ui-sref-active=\"active\">\n" +
    "                        <h3 class=\"card-title\">Ansible</h3>\n" +
    "                        <p class=\"card-text\">Ansible config</p>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "                <a class=\"card op-feature-card ms-5\" ui-sref=\"app.ssc.engine.aap\">\n" +
    "                    <div class=\"card-img-top\"><i\n" +
    "                            class=\"fab fab fa-adn\"></i></div>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <h3 class=\"card-title\">Ansible Automation Platform</h3>\n" +
    "                        <p class=\"card-text\">Ansible Automation Platform config</p>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/ssc/param/app/param-delete.html","<form name=\"deleteForm\" ng-submit=\"vm.confirmDelete(vm.param.id)\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\">{{'adm.content.ok_delete' | translate}}</h4>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"vm.clear()\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "        <p>{{'adm.content.are_you_sure_to_delete' | translate}}</p>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "            <span>{{'common.action.cancel'|translate}}</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"deleteForm.$invalid\" class=\"btn btn-danger\">\n" +
    "            <span>{{'common.action.delete'|translate}}</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/param/app/param-detail.html","<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <nav class=\"navbar navbar-light\">\n" +
    "            <div class=\"opx-navbar-title\">{{'adm.content.param_desc' | translate}}</div>\n" +
    "        </nav>\n" +
    "        <!--<div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">\n" +
    "                <span>{{'adm.content.param_desc' | translate}}</span>\n" +
    "            </h3>\n" +
    "        </div>-->\n" +
    "        <div class=\"card-body\">\n" +
    "            <uib-tabset class=\"tab-container row wrapper\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <dl class=\"dl-horizontal jh-entity-details\">\n" +
    "                            <dt><span>ID:</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.param.id}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span>{{'adm.content.param_name' | translate}}:</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.param.name}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span >{{'adm.content.param_value' | translate}}:</span></dt>\n" +
    "                            <dd>\n" +
    "                                <textarea rows=\"10\" cols=\"170\" readonly>{{vm.param.value}}</textarea>\n" +
    "                            </dd>\n" +
    "                            <dt><span>{{'common.entity.detail.description' | translate}}:</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.param.description}}</span>\n" +
    "                            </dd>\n" +
    "                        </dl>\n" +
    "                    </div>\n" +
    "            </uib-tabset>\n" +
    "        </div>\n" +
    "        <div class=\"card-footer text-right\">\n" +
    "            <button type=\"button\" ui-sref=\"app.ssc.config.param\" class=\"btn btn-default\">\n" +
    "                <span class=\"fa fa-arrow-left\"></span>&nbsp;<span>{{'common.entity.action.back' | translate}}</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/param/app/param-dialog.html","<style>\n" +
    "    .help-block {\n" +
    "        margin: 0px;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myParamLabel\" ng-if=\"!vm.detailSign\">\n" +
    "        <span  ng-show=\"vm.param.id == null\">{{'adm.content.add_param' | translate}}</span>\n" +
    "        <span  ng-show=\"vm.param.id != null\">{{'adm.content.update_param' | translate}}</span>\n" +
    "    </h4>\n" +
    "    <h4 class=\"modal-title\" ng-if=\"vm.detailSign\">\n" +
    "        <span>{{'adm.content.param_desc' | translate}}</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "<form name=\"editForm\" role=\"form\" novalidate ng-submit=\"vm.save()\" show-validation>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"form-group\" ng-if=\"vm.detailSign\">\n" +
    "            <label class=\"control-label\"  for=\"field_name\">ID</label>\n" +
    "            <input type=\"text\" class=\"form-control\" ng-model=\"vm.param.id\" ng-disabled=\"vm.detailSign\"/>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\"  for=\"field_name\">{{'adm.content.param_name' | translate}}</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"name\" id=\"field_name\" required ng-minlength=1\n" +
    "                   ng-maxlength=50 ng-model=\"vm.param.name\" ng-disabled=\"vm.detailSign\"/>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error':editForm.value.$error.pattern}\">\n" +
    "            <label class=\"control-label\" for=\"field_value\">{{'adm.content.param_value' | translate}}</label>\n" +
    "            <textarea type=\"text\" class=\"form-control\" name=\"value\" id=\"field_value\" rows=\"5\"\n" +
    "                      ng-model=\"vm.param.value\" ng-disabled=\"vm.detailSign\"></textarea>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span ng-show=\"editForm.value.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                <span ng-show=\"editForm.value.$error.pattern\">{{'adm.content.param_value_tips' | translate}}</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\"  for=\"field_description\">{{'common.entity.detail.description' | translate}}</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\" ng-minlength=1\n" +
    "                   ng-maxlength=100 ng-model=\"vm.param.description\" ng-disabled=\"vm.detailSign\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                            <span ng-show=\"editForm.desc.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                                  translate-value-max=\"100\">This field cannot be longer than 100 characters.</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\" ng-if=\"vm.detailSign\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\" >\n" +
    "            <span class=\"fa fa-arrow-left\">{{'common.entity.action.back' | translate}}</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\" ng-if=\"!vm.detailSign\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\" >\n" +
    "            <span >{{'common.action.cancel'|translate}}</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"editForm.$invalid || vm.isSaving\" class=\"btn btn-primary\" uaa-has-permission=\"adm:edit:*\">\n" +
    "            <span >{{'common.action.save'|translate}}</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/param/param.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'adm.menu.params' | translate}}</div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class=\"mb-1\">\n" +
    "        <ul class=\"nav nav-mdc-op\" op-tab-bar style=\"width:100%;\" op-tab-bar>\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a class=\"nav-link\" ng-click=\"activeTab = 'sysParams'\" ng-class=\"{active: activeTab === 'sysParams'}\">{{ 'adm.content.sys_param_config' | translate }}</a>\n" +
    "            </li>\n" +
    "\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a class=\"nav-link\" ng-click=\"activeTab = 'appParams'\" ng-class=\"{active: activeTab === 'appParams'}\">{{ 'adm.content.app_param_config' | translate }}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"card-body\" ng-show=\"activeTab === 'sysParams'\" uaa-has-permission=\"sysadmin:param:*\">\n" +
    "        <opx-datatable table-config=\"sysTableConfig\">\n" +
    "            <button class=\"btn btn-outline-primary\" ui-sref=\"app.ssc.config.param.new_sys\">\n" +
    "                <span class=\"fa fa-plus\"></span> <span>{{'adm.content.add' | translate}}</span>\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"card-body\" ng-show=\"activeTab === 'appParams'\" uaa-has-permission=\"adm:edit:*\">\n" +
    "        <opx-datatable table-config=\"appTableConfig\">\n" +
    "            <button class=\"btn btn-outline-primary\" ui-sref=\"app.ssc.config.param.new_app\">\n" +
    "                <span class=\"fa fa-plus\"></span> <span> {{'adm.content.add' | translate}} </span>\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/param/sys/param-delete-dialog.html","<form name=\"deleteForm\" ng-submit=\"vm.confirmDelete(vm.param.id)\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\" data-translate=\"entity.delete.title\">Confirm delete operation</h4>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"vm.clear()\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "        <p data-translate=\"sys_param.delete.question\" translate-values=\"{name: '{{vm.param.name}}'}\">Are you sure you want to delete this Tenant?</p>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "            <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"deleteForm.$invalid\" class=\"btn btn-danger\">\n" +
    "            <span data-translate=\"common.action.delete\">Delete</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/param/sys/param-detail.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myParamLabel\">\n" +
    "        <span data-translate=\"sys_param.detail.title\">Param Detail</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "<!-- <nav class=\"navbar navbar-light bg-light b-b\">\n" +
    "    <div class=\"navbar-header\" style=\"width: 100%; padding-left: 20px;\">\n" +
    "        <ol class=\"breadcrumb\">\n" +
    "            <li>\n" +
    "                <a ui-sref=\"param\" data-translate=\"sys_param.home.title\">Param Management</a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <span data-translate=\"sys_param.detail.title\">Param Detail</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "\n" +
    "</nav> -->\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"wrapper\">\n" +
    "        <div class=\"card card-default\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <uib-tabset class=\"tab-container row wrapper\" active=\"1\" style=\"padding-left: 3px\">\n" +
    "                    <uib-tab index=\"1\" heading=\"{{'ssc.params.sys.detail.basic'|translate}}\">\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <dl class=\"dl-horizontal jh-entity-details\">\n" +
    "                                <dt><span>ID</span></dt>\n" +
    "                                <dd>\n" +
    "                                    <span>{{vm.param.id}}</span>\n" +
    "                                </dd>\n" +
    "                                <dt><span data-translate=\"sys_param.domain\">Domain</span></dt>\n" +
    "                                <dd>\n" +
    "                                    <span>{{vm.param.domain}}</span>\n" +
    "                                </dd>\n" +
    "                                <dt><span data-translate=\"sys_param.name\">Name</span></dt>\n" +
    "                                <dd>\n" +
    "                                    <span>{{vm.param.name}}</span>\n" +
    "                                </dd>\n" +
    "                                <dt><span data-translate=\"sys_param.value\">value</span></dt>\n" +
    "                                <dd>\n" +
    "                                    <div id=\"jsoneditor\" style=\"width: 400px; height: 400px;\" ng-if=\"vm.param.useJsonEditor\"></div>\n" +
    "                                    <textarea rows=\"10\" cols=\"100\" readonly ng-if=\"!vm.param.useJsonEditor\">{{vm.param.value}}</textarea>\n" +
    "                                </dd>\n" +
    "                                <dt><span data-translate=\"sys_param.description\">Description</span></dt>\n" +
    "                                <dd>\n" +
    "                                    <span>{{vm.param.description}}</span>\n" +
    "                                </dd>\n" +
    "                            </dl>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                </uib-tabset>\n" +
    "            </div>\n" +
    "            <div class=\"card-footer text-right\">\n" +
    "                <button type=\"button\" ng-click=\"vm.clear()\" class=\"btn btn-default opx-btn-cancel\">\n" +
    "                    {{'entity.action.back'|translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/param/sys/param-dialog.html","<style>\n" +
    "    .help-block {\n" +
    "        margin: 0px;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myParamLabel\">\n" +
    "        <span data-translate=\"sys_param.home.createParam\" ng-show=\"vm.param.id == null\">Create Param</span>\n" +
    "        <span data-translate=\"sys_param.home.editParam\" ng-show=\"vm.param.id != null\">Edit Param</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "    <form name=\"editForm\" role=\"form\" novalidate ng-submit=\"vm.save()\" show-validation>\n" +
    "        <!--        <jhi-alert-error></jhi-alert-error>-->\n" +
    "        <!--<uib-tabset class=\"tab-container row wrapper\" active=\"1\">-->\n" +
    "        <!--<uib-tab index=\"1\" heading=\"基本信息\">-->\n" +
    "        <!--<div class=\"col-md-12\">-->\n" +
    "        <div class=\"alert alert-success js-uw-style\" data-customcss=\"alert.*\">\n" +
    "            <button type=\"button\" class=\"btn-close pull-right\" data-dismiss=\"alert\"></button>\n" +
    "            <div>\n" +
    "                <h4>{{'ssc.params.sys.dialog.tips'|translate}}</h4>\n" +
    "                {{'ssc.params.sys.dialog.tips.desc'|translate}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_param.domain\" for=\"field_domain\">Domain</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"domain\" id=\"field_domain\" required ng-minlength=1\n" +
    "                   ng-maxlength=50 ng-model=\"vm.param.domain\" ng-readonly=\"vm.param.editValueOnly\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span> {{'ssc.params.sys.dialog.domain.tips'|translate}}</span>\n" +
    "                <!--<span ng-show=\"editForm.domain.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>-->\n" +
    "                <!--<span ng-show=\"editForm.domain.$error.maxlength\" data-translate=\"entity.validation.maxlength\"-->\n" +
    "                <!--translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>-->\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_param.name\" for=\"field_name\">Name</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"name\" id=\"field_name\" required ng-minlength=1\n" +
    "                   ng-maxlength=50 ng-model=\"vm.param.name\" ng-readonly=\"vm.param.editValueOnly\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span> {{'ssc.params.sys.dialog.name.tips'|translate}}</span>\n" +
    "                <!--<span ng-show=\"editForm.name.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>-->\n" +
    "                <!--<span ng-show=\"editForm.name.$error.maxlength\" data-translate=\"entity.validation.maxlength\"-->\n" +
    "                <!--translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>-->\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <!--<label class=\"control-label\" data-translate=\"sys_param.name\" for=\"is_encrypt\">IsEncrypt</label>-->\n" +
    "            <!--<input type=\"text\" class=\"form-control\" name=\"name\" id=\"is_encrypt\" required ng-minlength=1-->\n" +
    "            <!--ng-maxlength=50 ng-model=\"vm.param.name\"/>-->\n" +
    "            <label class=\"control-label\">{{'ssc.params.sys.dialog.encryption'|translate}}</label>\n" +
    "            <div class=\"form-control\">\n" +
    "                <label class=\"radio-inline\">\n" +
    "                    <input type=\"radio\" name=\"isEncrypt\" value=\"1\" ng-model=\"vm.param.isEncrypt\"\n" +
    "                           class=\"ng-valid ng-not-empty ng-touched ng-dirty ng-valid-parse\" aria-invalid=\"false\">\n" +
    "                    <span>{{'ssc.params.sys.dialog.encrypt.enable'|translate}}</span>\n" +
    "                </label>\n" +
    "                <label class=\"radio-inline\">\n" +
    "                    <input type=\"radio\" name=\"isEncrypt\" value=\"0\" ng-model=\"vm.param.isEncrypt\"\n" +
    "                           class=\"ng-valid ng-not-empty ng-dirty ng-touched\" aria-invalid=\"false\">\n" +
    "                    <span>{{'ssc.params.sys.dialog.encrypt.disable'|translate}}</span>\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span>{{'ssc.params.sys.dialog.encrypt.tips'|translate}}</span>\n" +
    "                <!--<span ng-show=\"editForm.name.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>-->\n" +
    "                <!--<span ng-show=\"editForm.name.$error.maxlength\" data-translate=\"entity.validation.maxlength\"-->\n" +
    "                <!--translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>-->\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error':editForm.value.$error.pattern}\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_param.value\" for=\"field_value\">Value</label>\n" +
    "            <div id=\"jsoneditor\" style=\"width: 400px; height: 400px;\" ng-if=\"vm.param.useJsonEditor\"></div>\n" +
    "            <textarea type=\"text\" class=\"form-control\" name=\"value\" id=\"field_value\" rows=\"5\"\n" +
    "                      ng-model=\"vm.param.value\" ng-readonly=\"1 === secret\" ng-if=\"!vm.param.useJsonEditor\"></textarea>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span ng-show=\"editForm.value.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                <!--<span ng-show=\"editForm.value.$error.maxlength\" data-translate=\"entity.validation.maxlength\"-->\n" +
    "                <!--translate-value-max=\"4000\">This field cannot be longer than 4000 characters.</span>-->\n" +
    "                <span ng-show=\"editForm.value.$error.pattern\">{{'ssc.params.sys.dialog.value.tips' | translate}}</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_param.description\"\n" +
    "                   for=\"field_description\">Description</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\" ng-minlength=1\n" +
    "                   ng-maxlength=100 ng-model=\"vm.param.description\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                            <span ng-show=\"editForm.desc.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                                  translate-value-max=\"100\">{{'ssc.params.sys.dialog.desc.tips' | translate}}</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <!--</div>-->\n" +
    "        <!--</uib-tab>-->\n" +
    "        <!--</uib-tabset>-->\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "                <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "            </button>\n" +
    "            <button type=\"submit\" ng-disabled=\"editForm.$invalid || vm.isSaving\" class=\"btn btn-primary\">\n" +
    "                <span data-translate=\"common.action.save\">Save</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/ssc/ssc-index.html","<div class=\"opx-layout-hflex\">\n" +
    "    <div class=\"opx-sidebar\">\n" +
    "        <!--        <nav class=\"opx-sidebar-header navbar\">-->\n" +
    "        <!--            <a ui-sref=\"app.ssc\"><span class=\"opx-navbar-title\">{{ 'ssc.title' | translate}}</span></a>-->\n" +
    "        <!--        </nav>-->\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <div class=\"opx-treenav\">\n" +
    "\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"sysadmin:user:*\">\n" +
    "                    <a ui-sref=\"app.ssc.user\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-fw fa-users-cog\"></i> {{'sys_userManagement.home.title' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"adm:view:*\">\n" +
    "                    <a ui-sref=\"app.ssc.config.team\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-fw fa-sitemap\"></i> {{'adm.menu.teams' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"adm:view:*\">\n" +
    "                    <a ui-sref=\"app.ssc.config.applet-manage\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-fw fa-archive\"></i> {{'ssc.applet.manage' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"adm:view:*\">\n" +
    "                    <a ui-sref=\"app.ssc.config.tag\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-fw fa-tags\"></i> {{'adm.menu.tags' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"adm:view:*\">\n" +
    "                    <a ui-sref=\"app.ssc.config.param\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-brackets-curly fa-fw\"></i> {{'adm.menu.params' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"adm:view:*\">\n" +
    "                    <a ui-sref=\"app.ssc.appres\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-fw fa-boxes\"></i> {{ 'adm.menu.appres' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"adm:view:*\">\n" +
    "                    <a ui-sref=\"app.ssc.config.email\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-fw fa-mail-bulk\"></i> {{ 'adm.content.electronic_mail' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"dts:view:*\">\n" +
    "                    <a ui-sref=\"app.ssc.datasource\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-fw fa-code-merge\"></i> {{ 'dts.datasource.title' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <!--                <div class=\"opx-treenav-item\" uaa-has-permission=\"sysadmin:dataperm:*\">-->\n" +
    "                <!--                    <a ui-sref=\"app.ssc.dataPermission\" ui-sref-active=\"active\">-->\n" +
    "                <!--                      <i class=\"fa fa-fw fa-tags\"></i> {{'global.menu.admin.dataPermissionManagement' | translate}}-->\n" +
    "                <!--                    </a>-->\n" +
    "                <!--                </div>-->\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"adm:view:*\">\n" +
    "                    <a ui-sref=\"app.ssc.engine\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-car-battery\"></i> {{'adm.engine.title' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"adm:view:*\">\n" +
    "                    <a ui-sref=\"app.ssc.config.syslog\" ui-sref-active=\"active\">\n" +
    "                        <i class=\"fa fa-fw fa-clock\"></i> {{'sys_log.sys_log' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill scroll-y\" ui-view=\"ssc_main\">\n" +
    "        <div class=\"opx-align-center\">\n" +
    "            <div class=\"rounded-circle bg-secondary opx-align-center\" style=\"width:10rem;height:10rem;opacity: .5\">\n" +
    "                <i class=\"text-light fad fa-cog fa-7x\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--        <div class=\"bg-light p-5 h-100 d-flex justify-content-center align-items-center\">-->\n" +
    "        <!--            <div class=\"rounded-lg bg-secondary p-3 text-center text-light d-flex align-items-center justify-content-center\"-->\n" +
    "        <!--                 style=\"width:10rem;height:10rem;opacity: .5;\"><i-->\n" +
    "        <!--                    class=\"fad fa-fw fa-7x fa-cog\"></i>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </div>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/syslog/syslog.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'sys_log.sys_log' | translate}}</div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class=\"mb-1\">\n" +
    "        <ul class=\"nav nav-mdc-op\" op-tab-bar style=\"width:100%;\" op-tab-bar>\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a class=\"nav-link\" ng-click=\"activeTab = 'login'\" ng-class=\"{active: activeTab === 'login'}\">{{'sys_log.login_log' | translate}}</a>\n" +
    "            </li>\n" +
    "\n" +
    "            <li class=\"nav-item\">\n" +
    "                <a class=\"nav-link\" ng-click=\"activeTab = 'operation'\" ng-class=\"{active: activeTab === 'operation'}\">{{'sys_log.operation_log' | translate}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"card-body\" ng-show=\"activeTab === 'login'\" uaa-has-permission=\"sysadmin:param:*\">\n" +
    "        <opx-datatable table-config=\"sysTableConfig\">\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"card-body\" ng-show=\"activeTab === 'operation'\" uaa-has-permission=\"sysadmin:param:*\">\n" +
    "        <opx-datatable table-config=\"operationTableConfig\">\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/tags/tag-delete.html","<form name=\"deleteForm\" ng-submit=\"vm.confirmDelete(vm.tag.id)\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\">{{'adm.content.ok_delete' | translate}}</h4>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"vm.clear()\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "        <p>{{'adm.content.are_you_sure_to_delete' | translate}}</p>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "            <span>{{'common.action.cancel'|translate}}</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"deleteForm.$invalid\" class=\"btn btn-danger\">\n" +
    "            <span>{{'common.action.delete'|translate}}</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/tags/tag-detail.html","<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <nav class=\"navbar navbar-light\">\n" +
    "            <div class=\"opx-navbar-title\">{{'adm.content.udp_tag_detail'|translate}}: {{vm.tag.name}}</div>\n" +
    "            <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "            </button>\n" +
    "        </nav>\n" +
    "\n" +
    "        <div class=\"card-body\" style=\"padding-top: 50px\">\n" +
    "            <opx-datatable table-config=\"vm.tableConfig\">\n" +
    "                <button class=\"btn btn-primary\"\n" +
    "                        ng-disabled=\"!vm.selected.length>0\"\n" +
    "                        ng-click=\"vm.removeAppletByTags()\">\n" +
    "                    <i class=\"fa fa-caret-square-right fa-fw\"></i> {{'adm.content.udp_tag_detail_remove'|translate}}\n" +
    "                </button>\n" +
    "            </opx-datatable>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/tags/tag-dialog.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myParamLabel\" ng-if=\"!vm.detailSign\">\n" +
    "        <span ng-show=\"vm.tag.id == null\">{{'adm.content.udp_tag_add'|translate}}</span>\n" +
    "        <span ng-show=\"vm.tag.id != null\">{{'adm.content.udp_tag_edit'|translate}}</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "<form name=\"editForm\" role=\"form\" novalidate ng-submit=\"vm.save()\" show-validation>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" for=\"field_name\">{{'adm.content.udp.tag.name'|translate}}</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"name\" id=\"field_name\" ng-model=\"vm.tag.name\" required/>\n" +
    "        </div>\n" +
    "<!--        <div class=\"form-group\">-->\n" +
    "<!--            <label class=\"control-label\" for=\"field_name\">{{'adm.content.udp_tag_type'|translate}}</label>-->\n" +
    "<!--            <select class=\"form-select op-w-sm\" name=\"type\" ng-model=\"vm.tag.type\" required>-->\n" +
    "<!--                <option value=\"S\">{{'adm.content.udp_tag_type.system'|translate}}</option>-->\n" +
    "<!--                <option value=\"C\">{{'adm.content.udp_tag_type.custom'|translate}}</option>-->\n" +
    "<!--            </select>-->\n" +
    "<!--        </div>-->\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "            <span>{{'common.action.cancel'|translate}}</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"editForm.$invalid || vm.isSaving\" class=\"btn btn-primary\"\n" +
    "                uaa-has-permission=\"adm:edit:*\">\n" +
    "            <span>{{'common.action.save'|translate}}</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/tags/tag.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'adm.content.upd_tags' | translate}}</div>\n" +
    "        <div class=\"ms-auto\" uaa-has-permission=\"adm:edit:*\">\n" +
    "            <button class=\"btn btn-outline-primary\" ui-sref=\"app.ssc.config.tag.new\">\n" +
    "                <span class=\"fa fa-plus\"></span> <span>{{'adm.content.add_tag' | translate}} </span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <opx-datatable table-config=\"tableConfig\"/>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/team/team-delete-dialog.html","<form name=\"deleteForm\" ng-submit=\"vm.confirmDelete(vm.team.id)\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\" data-translate=\"entity.delete.title\">Confirm delete operation</h4>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"vm.clear()\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "        <p data-translate=\"team.delete.question\" translate-values=\"{name: '{{vm.team.name}}'}\">Are you sure you want to delete this Team?</p>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "            <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"deleteForm.$invalid\" class=\"btn btn-danger\">\n" +
    "            <span data-translate=\"common.action.delete\">Delete</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/ssc/team/team-dialog.html","<style>\n" +
    "    .help-block {\n" +
    "        margin: 0px;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myTeamLabel\">\n" +
    "        <span data-translate=\"team.home.createTeam\" ng-show=\"vm.team.id == null\">Create Team</span>\n" +
    "        <span data-translate=\"team.home.editTeam\" ng-show=\"vm.team.id != null\">Edit Team</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "        &times;\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "    <form name=\"editForm\" team=\"form\" novalidate show-validation>\n" +
    "        <uib-tabset class=\"tab-container wrapper\" active=\"1\">\n" +
    "            <uib-tab index=\"1\" heading=\"基本信息\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" data-translate=\"team.name\" for=\"field_name\">Name</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"name\" id=\"field_name\" required ng-minlength=1\n" +
    "                           ng-maxlength=50 ng-model=\"vm.team.name\"/>\n" +
    "                    <p class=\"help-block\">\n" +
    "                        <span ng-show=\"editForm.name.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                        <span ng-show=\"editForm.name.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                              translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" data-translate=\"team.code\" for=\"field_code\">Code</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"code\" id=\"field_code\" ng-model=\"vm.team.code\"/>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" data-translate=\"team.description\"\n" +
    "                           for=\"field_description\">Description</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\" required\n" +
    "                           ng-minlength=1\n" +
    "                           ng-maxlength=100 ng-model=\"vm.team.description\"/>\n" +
    "                    <p class=\"help-block\">\n" +
    "                        <span ng-show=\"editForm.description.$error.required\"\n" +
    "                              data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                        <span ng-show=\"editForm.description.$error.maxlength\"\n" +
    "                              data-translate=\"entity.validation.maxlength\"\n" +
    "                              translate-value-max=\"100\">This field cannot be longer than 100 characters.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"2\" heading=\"用户\">\n" +
    "                <div class=\"row\" ng-if=\"vm.users && vm.users.length > 0\">\n" +
    "                    <span class=\"col-xs-6 col-sm-4 col-md-3\" ng-repeat=\"user in vm.users\">\n" +
    "                        <label class=\"i-checks\">\n" +
    "                            <input type=\"checkbox\"\n" +
    "                                   name=\"{{user.id}}\"\n" +
    "                                   ng-checked=\"user.isChecked\"\n" +
    "                                   ng-click=\"user.isChecked = !user.isChecked\"/> <i></i>\n" +
    "                        </label>\n" +
    "                        <span class=\"\">{{user.fullName}}</span>\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "        </uib-tabset>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "        <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "    </button>\n" +
    "    <button type=\"button\" ng-disabled=\"editForm.$invalid || vm.isSaving\" class=\"btn btn-primary\" ng-click=\"vm.save()\">\n" +
    "        <span data-translate=\"common.action.save\">Save</span>\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/ssc/team/team.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'adm.menu.teams' | translate}}</div>\n" +
    "        <div class=\"ms-auto\" uaa-has-permission=\"adm:edit:*\">\n" +
    "            <button class=\"btn btn-outline-primary\" ui-sref=\"app.ssc.config.team.new\">\n" +
    "                <span class=\"fa fa-plus\"></span> <span>{{'team.home.createTeam' | translate}}</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <!--<div class=\"card-body\">\n" +
    "        <div class=\"table-responsive\">\n" +
    "            <table class=\"team-table table table-striped table-hover\"></table>\n" +
    "        </div>\n" +
    "    </div>-->\n" +
    "    <div class=\"card-body\">\n" +
    "        <opx-datatable table-config=\"tableConfig\"></opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/user/api-key/api-key-edit-dialog.html","<div class=\"modal-header\">\n" +
    "  <h4 class=\"modal-title\">Apply ApiKey</h4>\n" +
    "  <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" ng-click=\"$ctrl.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <div class=\"form op-smartform\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{'common.entity.detail.name' | translate}}</label>\n" +
    "      <div class=\"form-control-wrapper\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.apiKey.name\"></input>\n" +
    "        <p class=\"help-block\" ng-if=\"!$ctrl.apiKey.name\">{{'common.entity.validation.required' | translate}}</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{'sys_userManagement.apikey.target_api' | translate}}</label>\n" +
    "      <div class=\"form-control-wrapper\">\n" +
    "        <textarea row=\"10\" class=\"form-control\" ng-model=\"$ctrl.apiKey.targetApi\"></textarea>\n" +
    "        <p class=\"help-block\" ng-if=\"!$ctrl.apiKey.targetApi\">{{'common.entity.validation.required' | translate}}</p>\n" +
    "        <p class=\"help-block\">(Split By < , >)</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group op-align-horizontal\">\n" +
    "      <!-- <label class=\"control-label\">{{'.' | translate}}</label> -->\n" +
    "      <div class=\"form-control-wrapper\">\n" +
    "          <div class=\"checkbox checkbox-inline\">\n" +
    "              <input type=\"checkbox\" id=\"cbxIsEternal\" \n" +
    "                ng-checked=\"$ctrl.apiKey.isEternal\"\n" +
    "                ng-click=\"$ctrl.apiKey.isEternal = !$ctrl.apiKey.isEternal\">\n" +
    "              <label for=\"cbxIsEternal\">{{'sys_userManagement.apikey.eternal_expired' | translate}}</label>\n" +
    "          </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"!$ctrl.apiKey.isEternal\">\n" +
    "      <label class=\"control-label\">{{'sys_userManagement.apikey.expire_count' | translate}}</label>\n" +
    "      <div class=\"form-control-wrapper\">\n" +
    "          <input type=\"number\" minlength=\"1\" maxlength=\"4\" class=\"form-control\" ng-model=\"$ctrl.apiKey.expireCount\"></input>\n" +
    "          <p class=\"help-block\"></p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"!$ctrl.apiKey.isEternal\">\n" +
    "      <label class=\"control-label\">{{'app_um.user.expired_date' | translate}}</label>\n" +
    "      <div class=\"form-control-wrapper\">\n" +
    "          <input type=\"datetime-local\" class=\"form-control\" ng-model=\"$ctrl.apiKey.expireTime\"></input>\n" +
    "          <p class=\"help-block\"></p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer text-right\">\n" +
    "  <button type=\"submit\" class=\"btn btn-primary opx-btn-ok\" ng-disabled=\"!$ctrl.apiKey.name || !$ctrl.apiKey.targetApi\" ng-click=\"$ctrl.confirm()\">确定</button>\n" +
    "  <button type=\"reset\" class=\"btn btn-default opx-btn-cancel\" ng-click=\"$ctrl.cancel()\">取消</button>\n" +
    "</div>")

$templateCache.put("app/modules/ssc/user/tenant-user-list-component.html","<opx-datatable table-config=\"tenantUserListVm.tableConfig\"></opx-datatable>\n" +
    "<!--<div class=\"table-responsive\">-->\n" +
    "<!--    <table class=\"op-datatable tenant-user-list table table-striped table-hover\"></table>-->\n" +
    "<!--</div>-->\n" +
    "")

$templateCache.put("app/modules/ssc/user/user-management-allocate-role.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"app.ssc.user\">{{'sys_userManagement.home.title' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">\n" +
    "                    {{'sys_userManagement.allocateRole' | translate}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill p-3\">\n" +
    "        <opx-datatable table-config=\"allocateRoleVm.tableConfig\"></opx-datatable>\n" +
    "        <div class=\"mt-3\">\n" +
    "            <button type=\"button\" ng-click=\"allocateRoleVm.save()\" class=\"btn btn-primary opx-btn-ok\">\n" +
    "                <span data-translate=\"common.action.save\">Save</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/ssc/user/user-management-delete.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" data-translate=\"entity.delete.title\">Confirm delete operation</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "            ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <!--        <jhi-alert-error></jhi-alert-error>-->\n" +
    "    <p data-translate=\"sys_userManagement.delete.question\" translate-values=\"{login: '{{vm.user.login}}'}\">Are you sure you want to delete this User?</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "        <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"vm.confirmDelete()\">\n" +
    "        <span data-translate=\"common.action.delete\">Delete</span>\n" +
    "    </button>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/user/user-management-detail.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        <span data-translate=\"sys_userManagement.detail.title\">User Detail</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\"></button>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "    <uib-tabset class=\"tab-container wrapper\" active=\"1\">\n" +
    "        <uib-tab index=\"1\" heading=\"{{'app.setting.basicInfo' | translate}}\">\n" +
    "            <div class=\"row\">\n" +
    "                <dl class=\"dl-horizontal jh-entity-details\">\n" +
    "                    <dt><span data-translate=\"sys_userManagement.login\">Login</span></dt>\n" +
    "                    <dd>\n" +
    "                        <span>{{vm.user.login}}</span>\n" +
    "                        <span class=\"badge bg-danger\" ng-show=\"!vm.user.activated\" data-translate=\"sys_userManagement.deactivated\">Deactivated</span>\n" +
    "                        <span class=\"badge bg-success\" ng-show=\"vm.user.activated\" data-translate=\"sys_userManagement.activated\">Activated</span>\n" +
    "                    </dd>\n" +
    "                    <dt><span data-translate=\"sys_userManagement.fullName\">Full Name</span></dt>\n" +
    "                    <dd>{{vm.user.fullName}}</dd>\n" +
    "                    <dt><span data-translate=\"sys_userManagement.department\">Department</span></dt>\n" +
    "                    <dd>{{vm.user.department}}</dd>\n" +
    "\n" +
    "                    <dt><span data-translate=\"sys_userManagement.email\">Email</span></dt>\n" +
    "                    <dd>{{vm.user.email}}</dd>\n" +
    "                    <dt><span data-translate=\"sys_userManagement.mobile\">Mobile</span></dt>\n" +
    "                    <dd>{{vm.user.mobile}}</dd>\n" +
    "                    <dt><span data-translate=\"sys_userManagement.telephoneNumber\">TelephoneNumber</span></dt>\n" +
    "                    <dd>{{vm.user.telephoneNumber}}</dd>\n" +
    "                </dl>\n" +
    "                <dl class=\"dl-horizontal jh-entity-details\">\n" +
    "                    <dt><span data-translate=\"sys_userManagement.langKey\">Lang Key</span></dt>\n" +
    "                    <dd>{{vm.user.langKey}}</dd>\n" +
    "                    <dt><span data-translate=\"sys_userManagement.authMode\">Auth Mode</span></dt>\n" +
    "                    <dd>\n" +
    "                        <span class=\"badge bg-info\" ng-show=\"vm.user.authMode === 'LOCAL'\" data-translate=\"sys_userManagement.authModeOption.local\">Local</span>\n" +
    "                        <span class=\"badge bg-info\" ng-show=\"vm.user.authMode === 'AD'\" data-translate=\"sys_userManagement.authModeOption.ad\">Active Directory</span>\n" +
    "                        <span class=\"badge bg-info\" ng-show=\"vm.user.authMode === 'MIX'\" data-translate=\"sys_userManagement.authModeOption.adAndLocal\">Mix</span>\n" +
    "                        <span class=\"badge bg-info\" ng-show=\"vm.user.authMode === 'UN'\"  data-translate=\"sys_userManagement.unifiedAuthentication\">Unified Authentication</span>\n" +
    "                    </dd>\n" +
    "                    <dt><span data-translate=\"sys_userManagement.createInfo\">Created Info</span></dt>\n" +
    "                    <dd>\n" +
    "                        <span class=\"badge bg-secondary\">{{vm.user.createdBy}}</span>\n" +
    "                        <span class=\"ms-4\">{{vm.user.createdDate | date:'yyyy-MM-dd HH:mm' }}</span>\n" +
    "                    </dd>\n" +
    "                    <dt><span data-translate=\"sys_userManagement.lastModify\">Last Modify</span></dt>\n" +
    "                    <dd>\n" +
    "                        <span class=\"badge bg-secondary\">{{vm.user.lastModifiedBy}}</span>\n" +
    "                        <span class=\"ms-4\">{{vm.user.lastModifiedDate | date:'yyyy-MM-dd HH:mm'}}</span>\n" +
    "                    </dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab index=\"2\" heading=\"{{'sys_userManagement.userRole' | translate}}\">\n" +
    "            <div class=\"col-md-12\" ng-if=\"vm.user.roles != null && vm.user.roles.length > 0\">\n" +
    "                <span class=\"m-r-sm\" ng-repeat=\"role in vm.user.roles\">\n" +
    "                    <span class=\"badge bg-info\">{{role.description}}</span>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab index=\"3\" heading=\"{{'sys_userManagement.userJurisdiction' | translate}}\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "            <span class=\"m-r-sm mb-3\" ng-repeat=\"permission in vm.permissions\">\n" +
    "                 <span class=\"label text-default\">{{permission.domain}} : {{permission.action}} : {{permission.target}}</span>\n" +
    "            </span>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "    </uib-tabset>\n" +
    "</div>\n" +
    "<div class=\"modal-footer text-right\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" ng-click=\"vm.clear()\">\n" +
    "        <span class=\"fa fa-arrow-left\"></span>&nbsp;\n" +
    "        <span data-translate=\"common.action.back\"> Back</span>\n" +
    "    </button>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/user/user-management-edit.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myUserLabel\" ng-if=\"!vm.detailSign\">\n" +
    "        <span data-translate=\"sys_userManagement.home.createUser\" ng-show=\"vm.user.id == null\">Create User</span>\n" +
    "        <span data-translate=\"sys_userManagement.home.editUser\" ng-show=\"vm.user.id != null\">Edit User</span>\n" +
    "    </h4>\n" +
    "    <h4 class=\"modal-title\" ng-if=\"vm.detailSign\">\n" +
    "        <span data-translate=\"sys_userManagement.detail.title\">User Detail</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "            ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <form name=\"editForm\" class=\"form-horizontal op-smartform\" role=\"form\" novalidate show-validation>\n" +
    "        <uib-tabset class=\"tab-container\" type=\"mdc-op\" active=\"1\">\n" +
    "            <uib-tab index=\"1\" heading=\"{{'app.setting.basicInfo' | translate}}\">\n" +
    "                <div class=\"alert alert-danger\" ng-show=\"vm.doNotMatch\"\n" +
    "                     data-translate=\"global.messages.error.dontmatch\">\n" +
    "                    The password and its confirmation do not match!\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" data-translate=\"sys_userManagement.login\">Login</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"login\" required\n" +
    "                               ng-disabled=\"vm.user.id != null\"\n" +
    "                               ng-model=\"vm.user.login\" ng-minlength=1 ng-maxlength=50\n" +
    "                               ng-pattern=\"/^[_'.A-Za-z0-9-]*$/\">\n" +
    "                        <p class=\"help-block\">\n" +
    "                                    <span ng-show=\"editForm.login.$error.required\"\n" +
    "                                          data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                            <span ng-show=\"editForm.login.$error.maxlength\"\n" +
    "                                  data-translate=\"entity.validation.maxlength\"\n" +
    "                                  translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" data-translate=\"sys_userManagement.fullName\">Full\n" +
    "                        Name</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"fullName\" ng-model=\"vm.user.fullName\"\n" +
    "                               required ng-maxlength=\"50\" ng-disabled=\"vm.detailSign\">\n" +
    "                        <p class=\"help-block\">\n" +
    "                    <span ng-show=\"editForm.fullName.$error.required\" data-translate=\"entity.validation.required\">\n" +
    "                        This field is required.\n" +
    "                    </span>\n" +
    "                            <span ng-show=\"editForm.fullName.$error.maxlength\"\n" +
    "                                  data-translate=\"entity.validation.maxlength\" translate-value-max=\"50\">\n" +
    "                        This field cannot be longer than 50 characters.\n" +
    "                    </span>\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <div class=\"form-group\" ng-if=\"vm.user.id != null && !vm.detailSign\">\n" +
    "                    <a ng-if=\"!vm.editPassword\" class=\"text-primary\"\n" +
    "                       ng-click=\"vm.editPassword = true\" data-translate=\"sys_userManagement.updatePassword\">Update\n" +
    "                        Password</a>\n" +
    "                    <a ng-if=\"vm.editPassword\" class=\"text-primary\"\n" +
    "                       ng-click=\"vm.editPassword = false\" data-translate=\"sys_userManagement.cancelUpdatePassword\">Cancel\n" +
    "                        Update Password</a>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-if=\"vm.editPassword\">\n" +
    "                    <label class=\"control-label\" for=\"password\"\n" +
    "                           data-translate=\"global.form.newpassword\">New password</label>\n" +
    "                    <i class=\"fa fa-info-circle text-warning ms-2\" style=\"position: absolute;left: 58px;cursor: pointer;\" title=\"{{'global.messages.validate.newpassword.qualified' | translate}}\"></i>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <input type=\"password\" class=\"form-control\" id=\"password\" name=\"password\"\n" +
    "                               placeholder=\"{{'global.form.newpassword.placeholder' | translate}}\"\n" +
    "                               ng-model=\"vm.user.password\" ng-minlength=8 ng-maxlength=32 required>\n" +
    "                        <div ng-show=\"editForm.password.$dirty && editForm.password.$invalid\">\n" +
    "                            <p class=\"help-block\"\n" +
    "                               ng-show=\"editForm.password.$error.required\"\n" +
    "                               data-translate=\"global.messages.validate.newpassword.required\">\n" +
    "                                Your password is required.\n" +
    "                            </p>\n" +
    "                            <p class=\"help-block\"\n" +
    "                               ng-show=\"editForm.password.$error.minlength\"\n" +
    "                               data-translate=\"global.messages.validate.newpassword.minlength\">\n" +
    "                                Your password is required to be at least 8 characters.\n" +
    "                            </p>\n" +
    "                            <p class=\"help-block\"\n" +
    "                               ng-show=\"editForm.password.$error.maxlength\"\n" +
    "                               data-translate=\"global.messages.validate.newpassword.maxlength\">\n" +
    "                                Your password cannot be longer than 32 characters.\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                       <!-- <div\n" +
    "                           ng-show=\"vm.qualifiedPswd && !editForm.password.$error.minlength && !editForm.password.$error.maxlength\"\n" +
    "                           data-translate=\"global.messages.validate.newpassword.qualified\">\n" +
    "                            The value must contain a combination of uppercase and lowercase letters, digits, and special characters\n" +
    "                        </div>-->\n" +
    "                        <div>\n" +
    "                            <ng-password-meter password=\"vm.user.password\"></ng-password-meter>\n" +
    "                        </div>\n" +
    "                        <!--                        <password-strength-bar-->\n" +
    "                        <!--                                password-to-check=\"vm.registerAccount.password\"></password-strength-bar>-->\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-if=\"vm.editPassword\">\n" +
    "                    <label class=\"control-label\" for=\"confirmPassword\"\n" +
    "                           data-translate=\"global.form.confirmpassword\">New password confirmation</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <input type=\"password\" class=\"form-control\" id=\"confirmPassword\" name=\"confirmPassword\"\n" +
    "                               placeholder=\"{{'global.form.confirmpassword.placeholder' | translate}}\"\n" +
    "                               ng-model=\"vm.confirmPassword\" ng-minlength=8 ng-maxlength=32 required>\n" +
    "                        <div ng-show=\"editForm.confirmPassword.$dirty && editForm.confirmPassword.$invalid\">\n" +
    "                            <p class=\"help-block\"\n" +
    "                               ng-show=\"editForm.confirmPassword.$error.required\"\n" +
    "                               data-translate=\"global.messages.validate.confirmpassword.required\">\n" +
    "                                Your confirmation password is required.\n" +
    "                            </p>\n" +
    "                            <p class=\"help-block\"\n" +
    "                               ng-show=\"editForm.confirmPassword.$error.minlength\"\n" +
    "                               data-translate=\"global.messages.validate.confirmpassword.minlength\">\n" +
    "                                Your confirmation password is required to be at least 8 characters.\n" +
    "                            </p>\n" +
    "                            <p class=\"help-block\"\n" +
    "                               ng-show=\"editForm.confirmPassword.$error.maxlength\"\n" +
    "                               data-translate=\"global.messages.validate.confirmpassword.maxlength\">\n" +
    "                                Your confirmation password cannot be longer than 32 characters.\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\" ng-if=\"!vm.detailSign\">\n" +
    "                    <a class=\"control-label\"\n" +
    "                       ng-click=\"vm.showOtherInfo = !vm.showOtherInfo\">\n" +
    "                        <span ng-show=\"!vm.showOtherInfo\" data-translate=\"sys_userManagement.otherInformation\">Other Information</span>\n" +
    "                        <span ng-show=\"vm.showOtherInfo\" data-translate=\"sys_userManagement.putAwayInformation\">Put Away Information</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div ng-show=\"vm.showOtherInfo || vm.detailSign\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\"\n" +
    "                               data-translate=\"sys_userManagement.email\">Email</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <input type=\"email\" class=\"form-control\" name=\"email\" ng-model=\"vm.user.email\"\n" +
    "                                   ng-maxlength=\"100\" ng-disabled=\"vm.detailSign\">\n" +
    "                            <p class=\"help-block\">\n" +
    "                                <!--                                <span ng-show=\"editForm.email.$error.required\" data-translate=\"entity.validation.required\">-->\n" +
    "                                <!--                                    This field is required.-->\n" +
    "                                <!--                                </span>-->\n" +
    "                                <span ng-show=\"editForm.email.$error.maxlength\"\n" +
    "                                      data-translate=\"entity.validation.maxlength\" translate-value-max=\"100\">\n" +
    "                                    This field cannot be longer than 100 characters.\n" +
    "                                </span>\n" +
    "                                <span ng-show=\"editForm.email.$error.email\"\n" +
    "                                      data-translate=\"global.messages.validate.email.invalid\">\n" +
    "                                    Your email is invalid.\n" +
    "                                </span>\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\"\n" +
    "                               data-translate=\"sys_userManagement.department\">Department</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"department\"\n" +
    "                                   ng-model=\"vm.user.department\" ng-maxlength=\"500\" ng-disabled=\"vm.detailSign\">\n" +
    "                            <p class=\"help-block\" ng-show=\"editForm.department.$error.maxlength\"\n" +
    "                               data-translate=\"entity.validation.maxlength\" translate-value-max=\"500\">\n" +
    "                                This field cannot be longer than 500 characters.\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\"\n" +
    "                               data-translate=\"sys_userManagement.mobile\">Mobile</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"mobile\" ng-model=\"vm.user.mobile\"\n" +
    "                                   ng-maxlength=\"50\" ng-disabled=\"vm.detailSign\">\n" +
    "                            <p class=\"help-block\" ng-show=\"editForm.mobile.$error.maxlength\"\n" +
    "                               data-translate=\"entity.validation.maxlength\" translate-value-max=\"50\">\n" +
    "                                This field cannot be longer than 50 characters.\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\"\n" +
    "                               data-translate=\"sys_userManagement.telephoneNumber\">Telephone</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"telephoneNumber\"\n" +
    "                                   ng-model=\"vm.user.telephoneNumber\" ng-maxlength=\"50\" ng-disabled=\"vm.detailSign\">\n" +
    "                            <p class=\"help-block\" ng-show=\"editForm.telephoneNumber.$error.maxlength\"\n" +
    "                               data-translate=\"entity.validation.maxlength\" translate-value-max=\"50\"\n" +
    "                               ng-disabled=\"vm.detailSign\">\n" +
    "                                This field cannot be longer than 50 characters.\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\" for=\"activated\"\n" +
    "                               data-translate=\"sys_userManagement.state\">State</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <div class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                                <input ng-disabled=\"vm.user.id === null || vm.detailSign\" type=\"checkbox\" id=\"activated\"\n" +
    "                                       name=\"activated\" ng-model=\"vm.user.activated\">\n" +
    "                                <label data-translate=\"sys_userManagement.activated\" for=\"activated\">Activated</label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\" data-translate=\"sys_userManagement.authMode\">Auth\n" +
    "                            Mode</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <div class=\"opx-radio-group\">\n" +
    "                                <input type=\"radio\" name=\"authMode\" value=\"LOCAL\" ng-model=\"vm.user.authMode\"\n" +
    "                                       id=\"umd_authmode_1\" ng-disabled=\"vm.detailSign\">\n" +
    "                                <label data-translate=\"sys_userManagement.authModeOption.local\"\n" +
    "                                       for=\"umd_authmode_1\">Local</label>\n" +
    "                                <input type=\"radio\" name=\"authMode\" value=\"AD\" ng-model=\"vm.user.authMode\"\n" +
    "                                       id=\"umd_authmode_2\" ng-disabled=\"vm.detailSign\">\n" +
    "                                <label data-translate=\"sys_userManagement.authModeOption.ad\" for=\"umd_authmode_2\">Active\n" +
    "                                    Directory</label>\n" +
    "                                <input type=\"radio\" name=\"authMode\" value=\"UN\" ng-model=\"vm.user.authMode\"\n" +
    "                                       id=\"umd_authmode_4\" ng-disabled=\"vm.detailSign\">\n" +
    "                                <label for=\"umd_authmode_4\" data-translate=\"sys_userManagement.unifiedAuthentication\">Unified\n" +
    "                                    Authentication</label>\n" +
    "                                <input type=\"radio\" name=\"authMode\" value=\"MIX\" ng-model=\"vm.user.authMode\"\n" +
    "                                       id=\"umd_authmode_3\" ng-disabled=\"vm.detailSign\">\n" +
    "                                <label data-translate=\"sys_userManagement.authModeOption.adAndLocal\"\n" +
    "                                       for=\"umd_authmode_3\">Mixed</label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"2\" heading=\"{{'sys_userManagement.roles' | translate}}\">\n" +
    "                <div ng-if=\"vm.roles != null && vm.roles.length > 0\">\n" +
    "                    <div ng-repeat=\"role in vm.roles track by $index\" ng-if=\"vm.isShowRole(role)\">\n" +
    "                        <div class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                            <input type=\"checkbox\" id=\"umd_role_{{$index}}\"\n" +
    "                                   name=\"{{role.id}}\"\n" +
    "                                   ng-checked=\"role.isChecked\"\n" +
    "                                   ng-click=\"role.isChecked = !role.isChecked\" ng-disabled=\"vm.detailSign\"/>\n" +
    "                            <label for=\"umd_role_{{$index}}\">{{role.description}}</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"7\" heading=\"{{'app.nav.applet' | translate}}\">\n" +
    "                <div ng-if=\"vm.applets != null && vm.applets.length > 0\"  class=\"form-control-wrapper op-combo flex-wrap\">\n" +
    "                    <div ng-repeat=\"applet in vm.applets track by $index\">\n" +
    "                        <div class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                            <input\n" +
    "                                    class=\"ng-pristine ng-untouched ng-valid ng-empty\"\n" +
    "                                    type=\"checkbox\" id=\"applet_{{$index}}\"\n" +
    "                                   name=\"{{applet.id}}\"\n" +
    "                                   ng-checked=\"applet._user_applet\"\n" +
    "                                   ng-click=\"applet._user_applet = !applet._user_applet\" ng-disabled=\"vm.detailSign\"/>\n" +
    "                            <label for=\"applet_{{$index}}\">{{applet.title}}</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"3\" heading=\"{{'sys_userManagement.userJurisdiction' | translate}}\" ng-if=\"vm.detailSign\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-3\" ng-repeat=\"permission in vm.permissions\">\n" +
    "                        <span class=\"\">{{permission.domain}} : {{permission.action}} : {{permission.target}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"4\" heading=\"{{'adm.tenantName' | translate}}\" ng-if=\"vm.isTenantAdminUI && !vm.user.id\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-4\" ng-repeat=\"tenant in vm.tenants track by $index\">\n" +
    "                        <div class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                            <input type=\"checkbox\"\n" +
    "                                   name=\"{{tenant.id}}\"\n" +
    "                                   ng-checked=\"tenant.isChecked\"\n" +
    "                                   ng-click=\"tenant.isChecked = !tenant.isChecked\"/>\n" +
    "                            <label title=\"{{tenant.description}}\">{{tenant.code}}</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"5\" heading=\"{{'OTP' | translate}}\" ng-if=\"vm.user.id\">\n" +
    "                <div class=\"modal-body m-auto\">\n" +
    "                    <img class=\"\" ng-src=\"{{::vm.qrcodeUrl}}\" ng-if=\"vm.qrcodeStatus === 'existed'\">\n" +
    "                    <a class=\"m-l-md text-info \" ng-click=\"vm.generateQRCode()\"\n" +
    "                       ng-if=\"vm.qrcodeStatus === 'unexisted' && !vm.detailSign\">二维码不存在，点击重新生成</a>\n" +
    "                    <div op-loading=\"{style:'spinner'}\" ng-if=\"vm.qrcodeStatus === 'generating'\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body m-auto\" style=\"padding-left:70px\" ng-if=\"!vm.detailSign\">\n" +
    "                    <button type=\"submit\" ng-if=\"vm.qrcodeStatus === 'existed'\" class=\"btn btn-primary opx-btn-cancel\"\n" +
    "                            data-translate=\"sys_userSettings.form.aginotp\" ng-click=\"vm.generateQRCode()\">重新生成OTP二维码\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "\n" +
    "            <uib-tab index=\"6\" heading=\"ApiKey\" ng-if=\"vm.detailSign\">\n" +
    "                <div class=\"modal-body m-auto\">\n" +
    "                    <button class=\"btn btn-outline-primary\" ng-click=\"vm.applyApiKey()\"><i class=\"fa fa-plus\"></i> {{'common.action.create' | translate}}</button>\n" +
    "                    <opx-datatable table-config=\"vm.apiKeyTableConfig\"></opx-datatable>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "        </uib-tabset>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\" ng-if=\"vm.detailSign\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "        <span class=\"fa fa-arrow-left\">{{'common.entity.action.back' | translate}}</span>\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\" ng-if=\"!vm.detailSign\">\n" +
    "    <button type=\"button\" class=\"btn btn-primary opx-btn-ok\" ng-disabled=\"editForm.$invalid\" ng-click=\"vm.save()\">\n" +
    "        <span data-translate=\"common.action.save\">Save</span>\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "        <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/ssc/user/user-management-link-tenant-user.html","<style>\n" +
    "    .help-block {\n" +
    "        margin: 0px;\n" +
    "    }\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myUserLabel\">\n" +
    "        <span>{{'sys_userManagement.associatedUser' | translate}}</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "            ng-click=\"addTenantUserVm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"alert alert-primary\" role=\"alert\">\n" +
    "        {{'sys_userManagement.userDoesNotExist' | translate}} <button class=\"btn btn-sm btn-info mt-n2 ms-4\" ng-click=\"addTenantUserVm.clear()\"  create-user tenant-id=\"{{addTenantUserVm.tenantId}}\" on-update=\"addTenantUserVm.onAddUser\" >{{'sys_userManagement.home.createUser' | translate}}</button>\n" +
    "    </div>\n" +
    "   <!-- <form name=\"editForm\" class=\"form-horizontal\" role=\"form\" novalidate show-validation>\n" +
    "        <div class=\"table-responsive\">\n" +
    "            <table id=\"select-tenant-user-table\" class=\"select-tenant-user-table table table-striped table-hover\"></table>\n" +
    "        </div>\n" +
    "    </form>-->\n" +
    "    <opx-datatable table-config=\"tableConfig\"></opx-datatable>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"addTenantUserVm.clear()\">\n" +
    "        <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "    </button>\n" +
    "    <button type=\"button\" ng-disabled=\"editForm.$invalid\" ng-click=\"addTenantUserVm.save()\" class=\"btn btn-primary\">\n" +
    "        <span data-translate=\"common.action.save\">Save</span>\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/ssc/user/user-management.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'sys_userManagement.home.title' | translate}}</div>\n" +
    "        <div class=\"ms-auto\" uaa-has-permission=\"sysadmin:user:*\">\n" +
    "            <button class=\"btn btn-default\" ui-sref=\"app.ssc.user-allocate-role\">\n" +
    "                <i class=\"fa fa-fw fa-user-tag\"></i> {{'sys_userManagement.allocateRole' | translate}}\n" +
    "            </button>\n" +
    "            <!--关联用户-->\n" +
    "            <button class=\"btn btn-primary\" type=\"button\" ng-if=\"!vm.isAdminUI\" link-tenant-user\n" +
    "                    tenant-id=\"{{vm.tenantId}}\" on-update=\"vm.onAddUser\">\n" +
    "                <i class=\"fa fa-fw fa-plus\"></i> {{'sys_userManagement.home.createUser' | translate}}\n" +
    "            </button>\n" +
    "            <!--创建用户-->\n" +
    "            <button class=\"btn btn-primary\" ng-if=\"vm.isAdminUI\" create-user tenant-id=\"{{vm.tenantId}}\"\n" +
    "                    on-update=\"vm.onAddUser\">\n" +
    "                <i class=\"fa fa-fw fa-plus\"></i> {{'sys_userManagement.home.createUser' | translate}}\n" +
    "            </button>\n" +
    "            <button ng-hide=\"vm.isLdapSyncing\" class=\"btn btn-info\" ng-click=\"vm.syncLdapUsers()\"\n" +
    "                    ng-if=\"vm.enableSyncLdapUser\">\n" +
    "                <i class=\"fa fa-fw fa-sync\"></i>\n" +
    "                <span>{{vm.isLdapSyncing ? ('sys_userManagement.synchronizing' | translate) : ('sys_userManagement.syncDomainAccount' | translate)}}</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class=\"card-body\" uaa-has-permission=\"sysadmin:user:*\">\n" +
    "        <opx-datatable table-config=\"vm.tableConfig\"></opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/ssc/user/user-select-component.html","<style>\n" +
    "    .modal-dialog.modal-md {\n" +
    "        height: 90%;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"form-group col-xs-12 col-sm-12 col-md-10 col-lg-10\" ng-if=\"opUserSelectVm.filterType == 'inner'\">\n" +
    "        <!--<label for=\"exampleInputName2\">Name</label>-->\n" +
    "        <input name=\"userFilter\" class=\"form-control no-border b-b rounded-0\"\n" +
    "               ng-model=\"opUserSelectVm.views.filterContent\" ng-change=\"opUserSelectVm.views.filterUser()\"\n" +
    "               placeholder=\"{{'sys_userManagement.searchKeywords' | translate}}\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"{{opUserSelectVm.views.departmentTreeId}}\" class=\"op-user-select-tree\"></div>\n" +
    "")

$templateCache.put("app/modules/ssc/user/user-select-dialog.html","<style>\n" +
    "    .op-user-select-dialog .op-user-select-container {\n" +
    "        margin-top: -20px;\n" +
    "        min-height: 300px;\n" +
    "        max-height: 550px;\n" +
    "        padding-top: 20px;\n" +
    "    }\n" +
    "\n" +
    "    .op-user-select-dialog .op-user-select-container .op-user-select-tree {\n" +
    "        overflow-y: scroll;\n" +
    "        max-height: 500px;\n" +
    "    }\n" +
    "\n" +
    "</style>\n" +
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{userSelectDialogVm.params.title}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\" ng-click=\"userSelectDialogVm.views.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body op-user-select-dialog\">\n" +
    "    <div class=\"op-user-select-container\">\n" +
    "        <op-user-select-tree check-type=\"userSelectDialogVm.params.checkType\"\n" +
    "                             default=\"userSelectDialogVm.params.default\"\n" +
    "                             disabled=\"userSelectDialogVm.params.disabled\"\n" +
    "                             exclude-login=\"userSelectDialogVm.params.excludeLogin\"\n" +
    "                             expand-all=\"userSelectDialogVm.params.expandAll\"\n" +
    "                             filter-type=\"userSelectDialogVm.params.filterType\"\n" +
    "                             get-selected-hook=\"userSelectDialogVm.views.registerSelectedUserHook\"\n" +
    "                             on-select=\"userSelectDialogVm.views.onUserSelected\">\n" +
    "        </op-user-select-tree>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <p class=\"text-right\">\n" +
    "        <button type=\"reset\" class=\"btn btn-default\" ng-click=\"userSelectDialogVm.views.cancel()\">{{'common.action.cancel'|translate}}</button>\n" +
    "        <button type=\"submit\" class=\"btn btn-info\" ng-click=\"userSelectDialogVm.views.save()\">{{'common.action.save'|translate}}</button>\n" +
    "    </p>\n" +
    "</div>\n" +
    "\n" +
    "")
}]);
})();