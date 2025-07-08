//HEAD 
(function(app) {
try { app = angular.module("oplus.adm"); }
catch(err) { app = angular.module("oplus.adm", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/adm/config-index.html","<div class=\"opx-layout-hflex\" uaa-has-permission=\"adm:view:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <div class=\"opx-sidebar\">\n" +
    "        <nav class=\"opx-sidebar-header navbar\">\n" +
    "            <span class=\"navbar-brand\"> {{'adm.title' | translate}}</span>\n" +
    "        </nav>\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <div class=\"opx-treenav\">\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.adm.config.param\" ui-sref-active=\"active\"><i class=\"fa fa-fw fa-brackets-curly\"></i>\n" +
    "                        {{'adm.menu.params' | translate}}</a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.adm.config.tenant\" ui-sref-active=\"active\"><i class=\"fa fa-fw fa-sitemap\"></i>\n" +
    "                        {{'adm.menu.tenants' | translate}}</a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.adm.config.team\" ui-sref-active=\"active\"><i class=\"fa fa-fw fa-sitemap\"></i>\n" +
    "                        {{'adm.menu.teams' | translate}}</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--页面内容块-->\n" +
    "    <div ui-view=\"config_main_view\" class=\"opx-flex-fill scroll-y\">\n" +
    "        <div class=\"bg-light p-5 d-flex justify-content-center h-100 align-items-center\">\n" +
    "            <div class=\"card op-feature-card\">\n" +
    "                <div class=\"card-img-top\"><i\n" +
    "                        class=\"fad fa-brackets-curly\"></i></div>\n" +
    "                <a class=\"card-body\" style=\"height:8rem;\"\n" +
    "                   ui-sref-active=\"active\">\n" +
    "                    <h3 class=\"card-title\">{{'adm.menu.params' | translate}}</h3>\n" +
    "                    <p class=\"card-text\">{{'adm.content.mcd_config_index1' | translate}}</p>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"card op-feature-card ms-5\">\n" +
    "                <div class=\"card-img-top\"><i\n" +
    "                        class=\"fa fa-sitemap fa-fw fa-5x\"></i></div>\n" +
    "                <a class=\"card-body\" style=\"height:8rem;\">\n" +
    "                    <h3 class=\"card-title\">{{'adm.content.data_maintenance' | translate}}</h3>\n" +
    "                    <p class=\"card-text\">{{'adm.content.mcd_config_index2' | translate}}</p>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"card op-feature-card ms-5\">\n" +
    "                <div class=\"card-img-top\"><i\n" +
    "                        class=\"fa fa-sitemap fa-fw fa-5x\"></i></div>\n" +
    "                <a class=\"card-body\" style=\"height:8rem;\">\n" +
    "                    <h3 class=\"card-title\">{{'adm.menu.teams' | translate}}</h3>\n" +
    "                    <p class=\"card-text\">{{'adm.content.mcd_config_index3' | translate}}</p>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/configuration/configuration.html","<nav class=\"navbar navbar-expand navbar-light bg-light\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb my-0 bg-transparent\">\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"jhi_configuration.title\">Configuration</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\" uaa-has-permission=\"sysadmin:framework:*\">\n" +
    "    <div class=\"mb-5\">\n" +
    "        <span data-translate=\"jhi_configuration.filter\">Filter (by prefix)</span>\n" +
    "        <input type=\"text\" ng-model=\"filter\" class=\"form-control\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"card card-default\" ng-hide=\"filteredConfig.length === 0\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <div class=\"card-title\">\n" +
    "                <span>Spring configuration</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <table class=\"table table-sm table-striped table-bordered\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th ng-click=\"predicate = 'prefix'; reverse=!reverse\" class=\"w-50\"><span data-translate=\"jhi_configuration.table.prefix\">Prefix</span></th>\n" +
    "                    <th data-translate=\"jhi_configuration.table.properties\" class=\"w-50\">Properties</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "\n" +
    "                <tr ng-repeat=\"entry in filtered = (vm.configuration | filter:filter | orderBy:predicate:reverse)\">\n" +
    "                    <td><span>{{entry.prefix}}</span></td>\n" +
    "                    <td>\n" +
    "                        <div class=\"row\" ng-repeat=\"(key, value) in entry.properties\">\n" +
    "                            <div class=\"col-4\">{{key}}</div>\n" +
    "                            <div class=\"col-8\">\n" +
    "                                <span class=\"pull-right badge bg-success break\">{{value}}</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"card card-default\" ng-repeat=\"(key, value) in vm.allConfiguration\" ng-hide=\"filtered.length === 0\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <div class=\"card-title\">\n" +
    "                <span>{{key}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <table class=\"table table-sm table-striped table-bordered\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th class=\"w-50\">Property</th>\n" +
    "                    <th class=\"w-50\">Value</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                <tr ng-repeat=\"item in filtered = (value | filter:filter)\">\n" +
    "                    <td class=\"break\">{{item.key}}</td>\n" +
    "                    <td class=\"break\">\n" +
    "                        <span class=\"pull-right badge bg-success break\">{{item.val}}</span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/dict/dict-dialog.html","<form class=\"form-horizontal\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <div>\n" +
    "            <label class=\"modal-title\">Rest Api</label>\n" +
    "        </div>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" ng-click=\"dismissModal()\">×</button>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <uib-tabset>\n" +
    "            <uib-tab>\n" +
    "                <uib-tab-heading><i class='fa fa-link'></i> URL <span class=\"badge bg-warning\">GET</span>\n" +
    "                </uib-tab-heading>\n" +
    "                <div class=\"p-2\">\n" +
    "                    <p>\n" +
    "                        接口访问地址\n" +
    "                    </p>\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\"\n" +
    "                               ng-model=\"getUrl\" id=\"js-text1\">\n" +
    "<!--                        <span class=\"input-group-btn\">-->\n" +
    "                            <button type=\"button\"\n" +
    "                                    class=\"btn btn-defaul\"\n" +
    "                                    ngclipboard=\"\"\n" +
    "                                    data-clipboard-target=\"#js-text1\">\n" +
    "                                <i class=\"fa fa-clipboard\"></i></button>\n" +
    "                            <button type=\"button\"\n" +
    "                                    class=\"btn btn-info\"\n" +
    "                                    ng-click=\"getDictByCode()\">\n" +
    "                            <i class=\"fa fa-send\"></i>测试</button>\n" +
    "\n" +
    "<!--                        </span>-->\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "                    <br>\n" +
    "                    <p>\n" +
    "                        结果\n" +
    "                    </p>\n" +
    "                    <div style=\"font-variant: all-petite-caps; max-height: 300px;overflow-y: scroll;\">\n" +
    "                        <pre style=\"word-wrap: break-word; white-space: pre-wrap;\">{{folder}}</pre>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "        </uib-tabset>\n" +
    "    </div>\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/adm/dict/dict-edit.html","\n" +
    "<form name=\"editForm\" role=\"form\" class=\"form-horizontal\" novalidate ng-submit=\"vm.save()\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\"  for=\"field_pLabel\">目录</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input type=\"text\" readonly=\"readonly\" class=\"form-control\" name=\"pLabel\" id=\"field_pLabel\"\n" +
    "                   ng-model=\"vm.pLabel\"\n" +
    "            />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"vm.dict.type == '0'\" class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\" >接口编码</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input placeholder=\"命名模式 以英文模式 moudle_folder_..这样的格式\" type=\"text\" class=\"form-control\" name=\"value\"\n" +
    "                   ng-model=\"vm.dict.value\" required\n" +
    "            />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\" for=\"field_label\">名称</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"label\" id=\"field_label\"\n" +
    "                   ng-model=\"vm.dict.label\" required\n" +
    "            />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"vm.dict.type == '1'\" class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\" for=\"field_value\">值</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"value\" id=\"field_value\"\n" +
    "                   ng-model=\"vm.dict.value\" required\n" +
    "            />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\" for=\"field_sort\">排序</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input type=\"number\" class=\"form-control\" name=\"sort\" id=\"field_sort\"\n" +
    "                   ng-model=\"vm.dict.sort\" required\n" +
    "            />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\" for=\"field_type\">类型</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "\n" +
    "            <select  id=\"field_type\" class=\"form-select\" ng-model=\"vm.dict.type\">\n" +
    "                <option value=\"0\">文件夹</option>\n" +
    "                <option value=\"1\">字典</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\"  for=\"field_description\">描述</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <textarea class=\"form-control\" name=\"description\" id=\"field_description\"  ng-model=\"vm.dict.description\">\n" +
    "\n" +
    "            </textarea>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\">状态</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <label class=\"radio-inline\">\n" +
    "                <input type=\"radio\" name=\"authMode\" value=\"0\" ng-model=\"vm.dict.disabled\">\n" +
    "                <span>启用</span>\n" +
    "            </label>\n" +
    "            <label class=\"radio-inline\">\n" +
    "                <input type=\"radio\" name=\"authMode\" value=\"1\" ng-model=\"vm.dict.disabled\">\n" +
    "                <span>禁用</span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-8 col-sm-offset-2\">\n" +
    "            <button type=\"submit\" ng-disabled=\"editForm.$invalid || vm.isSaving\" class=\"btn btn-primary pull-right\">\n" +
    "                <span class=\"glyphicon glyphicon-save\"></span>&nbsp;<span data-translate=\"common.action.save\">保存</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/adm/dict/dicts.html","<style>\n" +
    "    span.fancytree-active span.fancytree-title {\n" +
    "        background-color: #d4d4d4 !important;\n" +
    "        color: #0a0a0a !important;\n" +
    "    }\n" +
    "\n" +
    "    span.fancytree-active span.fancytree-icon {\n" +
    "        color: #0a0a0a !important;\n" +
    "    }\n" +
    "\n" +
    "    .context-menu-hover {\n" +
    "        background-color: #d4d4d4 !important;\n" +
    "        color: #0a0a0a !important;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"op-listview hbox hbox-auto-x\"  uaa-has-permission=\"sysadmin:dict:*\">\n" +
    "\n" +
    "    <!-- column -->\n" +
    "    <div class=\"col w-md pt-3\" style=\"width:333px;\">\n" +
    "        <div class=\"vbox b-r\">\n" +
    "            <div>\n" +
    "                <form class=\"navbar-form navbar-left no-padding \" role=\"search\" style=\"padding:unset\">\n" +
    "                    <div class=\"form-group p-l-sm m-l-sm\">\n" +
    "                        <input placeholder=\"请输入菜单名称\" id=\"searchDict\" type=\"text\" class=\"form-control rounded\" ng-model=\"query\" style=\"width:275px;margin-right: 5px;\">\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "                <a title=\"添加模块目录\" class=\"btn btn-default navbar-btn\" ng-click=\"vm.createModule()\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row-row\">\n" +
    "                <div class=\"cell scrollable hover\">\n" +
    "                    <div class=\"cell-inner bg-white\">\n" +
    "                        <div class=\"list-group no-border op-udp-page-list\">\n" +
    "                            <div id=\"dictTree\" style=\"padding:15px;\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- column -->\n" +
    "    <div class=\"col\" style=\"width: 100%;\">\n" +
    "        <div class=\"vbox\">\n" +
    "            <div class=\"row-row\">\n" +
    "                <div ng-if=\"!vm.isDict\" class=\"cell\">\n" +
    "                    <div id=\"templateId\" class=\"cell-inner dk\">\n" +
    "                        <div style=\"position:relative\" class=\"vbox h-full\">\n" +
    "                            <div class=\"op-blank-slate\">\n" +
    "                                <div class=\"op-blank-slate-body\">\n" +
    "                                    <div class=\"op-blank-slate-icon\">\n" +
    "                                        <i class=\"fa fa-inbox op-fa-8x\"></i>\n" +
    "                                    </div>\n" +
    "                                    <h4>点击或者右键左边菜单编辑</h4>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"vm.isDict\" style=\"padding-top: 25px;\">\n" +
    "                    <div ng-include=\"'app/modules/adm/dict/dict-edit.html'\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/docs/docs.html","<div ng-if=\"vm.gatewayPath != null\">\n" +
    "    <iframe ng-src=\"{{vm.gatewayPath}}\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\"\n" +
    "            width=\"100%\" height=\"900\" scrolling=\"auto\" target='_top' title=\"Swagger UI\">\n" +
    "    </iframe>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/logs/logs.html","<nav class=\"navbar navbar-expand navbar-light bg-light\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb my-0 bg-transparent\">\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"jhi_logs.title\">Logs</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\" uaa-has-permission=\"sysadmin:framework:*\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <div class=\"card-title\">\n" +
    "                <span data-translate=\"jhi_logs.title\">Logs</span>\n" +
    "\n" +
    "                <span class=\"pull-right\" data-translate=\"jhi_logs.nbloggers\" translate-values=\"{total: '{{ vm.loggers.length }}'}\">There are {{ vm.loggers.length }} loggers.</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <span data-translate=\"jhi_logs.filter\">Filter</span>\n" +
    "            <input type=\"text\" ng-model=\"filter\" class=\"form-control\">\n" +
    "\n" +
    "            <table class=\"table table-sm table-striped table-bordered\">\n" +
    "                <thead>\n" +
    "                <tr title=\"click to order\">\n" +
    "                    <th ng-click=\"predicate = 'name'; reverse=!reverse\"><span data-translate=\"jhi_logs.table.name\">Name</span></th>\n" +
    "                    <th ng-click=\"predicate = 'level'; reverse=!reverse\"><span data-translate=\"jhi_logs.table.level\">Level</span></th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "\n" +
    "                <tr ng-repeat=\"logger in vm.loggers | filter:filter | orderBy:predicate:reverse\">\n" +
    "                    <td>\n" +
    "                        <small>{{logger.name | characters:140}}</small>\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <button ng-click=\"vm.changeLevel(logger.name, 'TRACE')\" ng-class=\"(logger.level=='TRACE') ? 'btn-danger' : 'btn-default'\" class=\"btn btn-xs\">TRACE</button>\n" +
    "                        <button ng-click=\"vm.changeLevel(logger.name, 'DEBUG')\" ng-class=\"(logger.level=='DEBUG') ? 'btn-warning' : 'btn-default'\" class=\"btn btn-xs\">DEBUG</button>\n" +
    "                        <button ng-click=\"vm.changeLevel(logger.name, 'INFO')\" ng-class=\"(logger.level=='INFO') ? 'btn-info' : 'btn-default'\" class=\"btn btn-xs\">INFO</button>\n" +
    "                        <button ng-click=\"vm.changeLevel(logger.name, 'WARN')\" ng-class=\"(logger.level=='WARN') ? 'btn-success' : 'btn-default'\" class=\"btn btn-xs\">WARN</button>\n" +
    "                        <button ng-click=\"vm.changeLevel(logger.name, 'ERROR')\" ng-class=\"(logger.level=='ERROR') ? 'btn-danger' : 'btn-default'\" class=\"btn btn-xs\">ERROR</button>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/adm/module/business-module-delete-dialog.html","<form name=\"deleteForm\" ng-submit=\"businessModuleDeleteVm.confirmDelete(businessModuleDeleteVm.businessModule.id)\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\" data-translate=\"entity.delete.title\">Confirm delete operation</h4>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"businessModuleDeleteVm.clear()\">\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "        <p data-translate=\"sys_businessModule.delete.question\" translate-values=\"{name: '{{businessModuleDeleteVm.businessModule.name}}'}\">Are you sure you want to delete this Business Module?</p>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"businessModuleDeleteVm.clear()\">\n" +
    "            <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"deleteForm.$invalid\" class=\"btn btn-danger\">\n" +
    "            <span data-translate=\"common.action.delete\">Delete</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/adm/module/business-module-detail.html","<nav class=\"navbar navbar-light bg-light b-b\">\n" +
    "    <div class=\"navbar-header\" style=\"width: 100%; padding-left: 20px;\">\n" +
    "        <ol class=\"breadcrumb\">\n" +
    "            <li>\n" +
    "                <a ui-sref=\"businessModule\" data-translate=\"sys_businessModule.home.title\">Business Module Management</a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <span data-translate=\"sys_businessModule.detail.title\">Business Module Detail</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">\n" +
    "                <span data-translate=\"sys_businessModule.detail.title\">Business Module Detail</span>\n" +
    "            </h3>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <uib-tabset class=\"tab-container row wrapper\" active=\"1\">\n" +
    "                <uib-tab index=\"1\" heading=\"基本信息\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <dl class=\"dl-horizontal jh-entity-details\">\n" +
    "                            <dt><span>ID</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{businessModuleDetailVm.businessModule.id}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_businessModule.name\">Name</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{businessModuleDetailVm.businessModule.name}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_businessModule.code\">code</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{businessModuleDetailVm.businessModule.code}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_businessModule.description\">Description</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{businessModuleDetailVm.businessModule.description}}</span>\n" +
    "                            </dd>\n" +
    "                        </dl>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "                <uib-tab index=\"2\" heading=\"配置信息\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <pre style=\"height:300px\">{{businessModuleDetailVm.businessModule.permission}}</pre>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "                <uib-tab index=\"3\" heading=\"数据查询\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <pre style=\"height:300px\">{{businessModuleDetailVm.businessModule.dataSql}}</pre>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "        </div>\n" +
    "        <div class=\"card-footer text-right\">\n" +
    "            <button type=\"button\" ui-sref=\"businessModule\" class=\"btn btn-default\">\n" +
    "                <span class=\"fa fa-arrow-left\"></span>&nbsp;<span data-translate=\"common.action.back\"> Back</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/module/business-module-dialog.html","<style>\n" +
    "    .help-block {\n" +
    "        margin: 0px;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myBusinessModuleLabel\">\n" +
    "        <span data-translate=\"sys_businessModule.home.createLabel\" ng-show=\"businessModuleDialogVm.businessModule.id == null\">Create BusinessModule</span>\n" +
    "        <span data-translate=\"sys_businessModule.home.editLabel\" ng-show=\"businessModuleDialogVm.businessModule.id != null\">Edit BusinessModule</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"businessModuleDialogVm.clear()\">\n" +
    "        &times;\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "<form name=\"editForm\" role=\"form\" novalidate ng-submit=\"businessModuleDialogVm.save()\" show-validation>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <!--        <jhi-alert-error></jhi-alert-error>-->\n" +
    "        <uib-tabset class=\"tab-container row wrapper\" active=\"1\">\n" +
    "            <uib-tab index=\"1\" heading=\"基本信息\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\" data-translate=\"sys_businessModule.name\" for=\"field_name\">Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"name\" id=\"field_name\" required ng-minlength=1 ng-maxlength=50 ng-model=\"businessModuleDialogVm.businessModule.name\"/>\n" +
    "                        <p class=\"help-block\">\n" +
    "                            <span ng-show=\"editForm.name.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                            <span ng-show=\"editForm.name.$error.maxlength\" data-translate=\"entity.validation.maxlength\" translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-class=\"{'has-error':editForm.code.$error.pattern}\">\n" +
    "                        <label class=\"control-label\" data-translate=\"sys_businessModule.code\" for=\"field_code\">Code</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"code\" id=\"field_code\" required ng-minlength=1 ng-maxlength=100\n" +
    "                               ng-pattern=\"/^[_a-z0-9-]*$/\" ng-model=\"businessModuleDialogVm.businessModule.code\" ng-disabled=\"businessModuleDialogVm.businessModule.id != null\"/>\n" +
    "                        <p class=\"help-block\">\n" +
    "                            <span ng-show=\"editForm.code.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                            <span ng-show=\"editForm.code.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                                  translate-value-max=\"100\">This field cannot be longer than 100 characters.</span>\n" +
    "                            <span ng-show=\"editForm.code.$error.pattern\">只允许数字（0-9）、小写字母（a-z）、下划线（_)、横线（-).</span>\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\" data-translate=\"sys_businessModule.description\" for=\"field_description\">Description</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\" ng-minlength=1 ng-maxlength=100 ng-model=\"businessModuleDialogVm.businessModule.description\"/>\n" +
    "                        <p class=\"help-block\">\n" +
    "                            <span ng-show=\"editForm.desc.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                                  translate-value-max=\"100\">This field cannot be longer than 100 characters.</span>\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"2\" heading=\"元素\">\n" +
    "                <div>\n" +
    "                    <div class=\"form-group col-md-2\">\n" +
    "                        <label>资源名</label>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group col-md-2\">\n" +
    "                        <label>资源类型</label>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group col-md-2\">\n" +
    "                        <label>数据库表名</label>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group col-md-3\">\n" +
    "                        <label>描述</label>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group col-md-2\">\n" +
    "                        <button class=\"btn btn-info pull-right\" type=\"button\" ng-click=\"businessModuleDialogVm.businessModule.elements.push({})\"><i class=\"fa fa-plus\"></i></button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"row\" ng-repeat=\"element in businessModuleDialogVm.businessModule.elements track by $index\" ng-show=\"!element.isRemoved\">\n" +
    "                        <div class=\"form-group col-md-2\">\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"elementName\" placeholder=\"资源名\" ng-model=\"element.name\" required/>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group col-md-2\">\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"elementCompany\" placeholder=\"资源类型\" ng-model=\"element.type\" required/>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group col-md-2\">\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"elementCompany\" placeholder=\"数据库表名\" ng-model=\"element.dbTable\" required/>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group col-md-3\">\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"elementCredentials\" placeholder=\"描述\" ng-model=\"element.description\" required/>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group col-md-1 text-left\">\n" +
    "                            <button class=\"btn btn-default\" type=\"button\" ng-click=\"element.isRemoved=true;\"><i class=\"fa fa-times\"></i></button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"3\" heading=\"权限配置\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <textarea ui-codemirror=\"{mode:'javascript', lineNumbers:false, theme:'opluscode', lineWrapping:true}\"\n" +
    "                              rows=\"6\" required ng-model=\"businessModuleDialogVm.businessModule.permission\"></textarea>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"4\" heading=\"数据查询\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <textarea ui-codemirror=\"{mode:'javascript', lineNumbers:false, theme:'opluscode', lineWrapping:true}\"\n" +
    "                              rows=\"6\" required ng-model=\"businessModuleDialogVm.businessModule.dataSql\"></textarea>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "        </uib-tabset>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"businessModuleDialogVm.clear()\">\n" +
    "            <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "        </button>\n" +
    "        <button type=\"submit\" ng-disabled=\"editForm.$invalid || businessModuleDialogVm.isSaving\" class=\"btn btn-primary\">\n" +
    "            <span data-translate=\"common.action.save\">Save</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/adm/module/business-modules.html","<nav class=\"navbar navbar-expand navbar-light bg-light b-b\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb bg-transparent my-0\">\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"sys_businessModule.home.title\">Business Module Management</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\" uaa-has-permission=\"sysadmin:module:*\">\n" +
    "\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <div class=\"card-title\">\n" +
    "                <span>模块列表</span>\n" +
    "                <span class=\"pull-right m-t-n-xs\">\n" +
    "                    <button class=\"btn btn-default\" ui-sref=\"businessModule.new\">\n" +
    "                        <span class=\"fa fa-plus\"></span> <span data-translate=\"sys_businessModule.home.createLabel\">Create a new Business Module</span>\n" +
    "                    </button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"card-body\">\n" +
    "            <div class=\"table-responsive\">\n" +
    "                <table class=\"business-module-table table table-striped table-hover\"></table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/param/param-delete-dialog.html","<form name=\"deleteForm\" ng-submit=\"vm.confirmDelete(vm.param.id)\">\n" +
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

$templateCache.put("app/modules/adm/param/param-detail.html","<nav class=\"navbar navbar-light bg-light b-b\">\n" +
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
    "</nav>\n" +
    "<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">\n" +
    "                <span data-translate=\"sys_param.detail.title\">Param Detail</span>\n" +
    "            </h3>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <uib-tabset class=\"tab-container row wrapper\" active=\"1\">\n" +
    "                <uib-tab index=\"1\" heading=\"基本信息\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <dl class=\"dl-horizontal jh-entity-details\">\n" +
    "                            <dt><span>ID</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.param.id}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_param.domain\">Domain</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.param.domain}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_param.name\">Name</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.param.name}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_param.value\">value</span></dt>\n" +
    "                            <dd>\n" +
    "                                <div id=\"jsoneditor\" style=\"width: 400px; height: 400px;\" ng-if=\"vm.param.useJsonEditor\"></div>\n" +
    "                                <textarea rows=\"10\" cols=\"200\" readonly ng-if=\"!vm.param.useJsonEditor\">{{vm.param.value}}</textarea>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_param.description\">Description</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.param.description}}</span>\n" +
    "                            </dd>\n" +
    "                        </dl>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "            </uib-tabset>\n" +
    "        </div>\n" +
    "        <div class=\"card-footer text-right\">\n" +
    "            <button type=\"button\" ui-sref=\"param\" class=\"btn btn-default opx-btn-cancel\">\n" +
    "                {{'entity.action.back'|translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/param/param-dialog.html","<style>\n" +
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
    "    <div class=\"modal-body\">\n" +
    "        <form name=\"editForm\" role=\"form\" novalidate ng-submit=\"vm.save()\" show-validation>\n" +
    "        <!--        <jhi-alert-error></jhi-alert-error>-->\n" +
    "        <!--<uib-tabset class=\"tab-container row wrapper\" active=\"1\">-->\n" +
    "        <!--<uib-tab index=\"1\" heading=\"基本信息\">-->\n" +
    "        <!--<div class=\"col-md-12\">-->\n" +
    "        <div class=\"alert alert-success js-uw-style\" data-customcss=\"alert.*\">\n" +
    "            <button type=\"button\" class=\"btn-close pull-right\" data-dismiss=\"alert\"></button>\n" +
    "            <div>\n" +
    "                <h4>提示</h4>\n" +
    "                建议配置的与部署环境相关的，不需要经常修改的参数，比如ip，文件路径，接口地址等等\n" +
    "                <div>禁止配置需要频繁修改或者与安全相关的参数，比如数据库的账号密码,调用接口验证的token等等</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_param.domain\" for=\"field_domain\">Domain</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"domain\" id=\"field_domain\" required ng-minlength=1\n" +
    "                   ng-maxlength=50 ng-model=\"vm.param.domain\" ng-readonly=\"vm.param.editValueOnly\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span>使用提供参数值的微服务名称命名</span>\n" +
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
    "                <span>使用小写单词加下划线命名,名称含义需和实际用途一致.</span>\n" +
    "                <!--<span ng-show=\"editForm.name.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>-->\n" +
    "                <!--<span ng-show=\"editForm.name.$error.maxlength\" data-translate=\"entity.validation.maxlength\"-->\n" +
    "                <!--translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>-->\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <!--<label class=\"control-label\" data-translate=\"sys_param.name\" for=\"is_encrypt\">IsEncrypt</label>-->\n" +
    "            <!--<input type=\"text\" class=\"form-control\" name=\"name\" id=\"is_encrypt\" required ng-minlength=1-->\n" +
    "                   <!--ng-maxlength=50 ng-model=\"vm.param.name\"/>-->\n" +
    "            <label class=\"control-label\">机密</label>\n" +
    "            <div class=\"form-control\">\n" +
    "                <label class=\"radio-inline\">\n" +
    "                    <input type=\"radio\" name=\"isEncrypt\" value=\"1\" ng-model=\"vm.param.isEncrypt\" class=\"ng-valid ng-not-empty ng-touched ng-dirty ng-valid-parse\" aria-invalid=\"false\">\n" +
    "                    <span>启用</span>\n" +
    "                </label>\n" +
    "                <label class=\"radio-inline\">\n" +
    "                    <input type=\"radio\" name=\"isEncrypt\" value=\"0\" ng-model=\"vm.param.isEncrypt\" class=\"ng-valid ng-not-empty ng-dirty ng-touched\" aria-invalid=\"false\">\n" +
    "                    <span>禁用</span>\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span>参数值是否机密</span>\n" +
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
    "                <span ng-show=\"editForm.value.$error.pattern\">只允许数字（0-9）、小写字母（a-z）、下划线（_)、横线（-).</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_param.description\" for=\"field_description\">Description</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\" ng-minlength=1\n" +
    "                   ng-maxlength=100 ng-model=\"vm.param.description\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                            <span ng-show=\"editForm.desc.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                                  translate-value-max=\"100\">This field cannot be longer than 100 characters.</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <!--</div>-->\n" +
    "        <!--</uib-tab>-->\n" +
    "        <!--</uib-tabset>-->\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "                    <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "                </button>\n" +
    "                <button type=\"submit\" ng-disabled=\"editForm.$invalid || vm.isSaving\" class=\"btn btn-primary\">\n" +
    "                    <span data-translate=\"common.action.save\">Save</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/adm/param/params.html","<nav class=\"navbar navbar-expand navbar-light bg-light b-b\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb bg-transparent my-0\">\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"sys_param.home.title\">Parameter Configuration</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "\n" +
    "<div class=\"wrapper\" ng-if=\"paramVm.isOplusAdminUI\" uaa-has-permission=\"sysadmin:param:*\">\n" +
    "    <div class=\"card-body\">\n" +
    "        <opx-datatable table-config=\"tableConfig\">\n" +
    "            <button class=\"btn btn-default\" ui-sref=\"param.new\">\n" +
    "                <span class=\"fa fa-plus\"></span> <span data-translate=\"sys_param.home.createLabel\">Create a new Param</span>\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-if=\"!paramVm.isOplusAdminUI\">\n" +
    "    <h3 class=\"text-danger text-center mt-5\">请到管理系统(oplus-admin)访问此功能</h3>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/permission/permission-delete-dialog.html","<form name=\"deleteForm\" ng-submit=\"vm.confirmDelete(vm.permission.id)\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\" data-translate=\"entity.delete.title\">Confirm delete operation</h4>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"vm.clear()\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "        <p data-translate=\"sys_permission.delete.question\" translate-values=\"{domain: '{{vm.permission.domain }}',action: '{{vm.permission.action }}',target: '{{vm.permission.target }}'}\">\n" +
    "            Are you sure you want to delete this Permission?\n" +
    "        </p>\n" +
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

$templateCache.put("app/modules/adm/permission/permission-detail.html","<nav class=\"navbar navbar-expand navbar-light bg-light\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb my-auto bg-transparent\">\n" +
    "            <li class=\"breadcrumb-item\">\n" +
    "                <a ui-sref=\"permission\" data-translate=\"sys_permission.home.title\">Permission Management</a>\n" +
    "            </li>\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"sys_permission.detail.title\">Permission Detail</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">\n" +
    "\n" +
    "                <span data-translate=\"sys_permission.detail.title\">User Detail</span>\n" +
    "            </h3>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <dl class=\"dl-horizontal jh-entity-details\">\n" +
    "                <dt><span data-translate=\"sys_permission.domain\">Domain</span></dt>\n" +
    "                <dd>\n" +
    "                    <span>{{vm.permission.domain}}</span>\n" +
    "                </dd>\n" +
    "                <dt><span data-translate=\"sys_permission.action\">Action</span></dt>\n" +
    "                <dd>\n" +
    "                    <span>{{vm.permission.action}}</span>\n" +
    "                </dd>\n" +
    "                <dt><span data-translate=\"sys_permission.target\">Target</span></dt>\n" +
    "                <dd>\n" +
    "                    <span>{{vm.permission.target}}</span>\n" +
    "                </dd>\n" +
    "                <dt><span data-translate=\"sys_permission.description\">Description</span></dt>\n" +
    "                <dd>\n" +
    "                    <span>{{vm.permission.description}}</span>\n" +
    "                </dd>\n" +
    "                <!--<dt><span data-translate=\"permission.configJson\">Config Json</span></dt>-->\n" +
    "                <!--<dd>-->\n" +
    "                    <!--<span>{{vm.permission.configJson}}</span>-->\n" +
    "                <!--</dd>-->\n" +
    "                <!--<dt><span data-translate=\"permission.role\">Role</span></dt>-->\n" +
    "                <!--<dd>-->\n" +
    "                    <!--<a ui-sref=\"role.role-detail({id:vm.permission.roleId})\">{{vm.permission.roleId}}</a>-->\n" +
    "                <!--</dd>-->\n" +
    "            </dl>\n" +
    "        </div>\n" +
    "        <div class=\"card-footer text-right\">\n" +
    "            <button type=\"button\" ui-sref=\"permission\" class=\"btn btn-default\">\n" +
    "                <span class=\"fa fa-arrow-left\"></span>&nbsp;<span data-translate=\"common.action.back\"> Back</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/permission/permission-dialog.html","<style>\n" +
    "    .help-block {\n" +
    "        margin: 0px;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myPermissionLabel\">\n" +
    "        <span data-translate=\"sys_permission.home.createPermission\" ng-show=\"vm.permission.id == null\">Create Permission</span>\n" +
    "        <span data-translate=\"sys_permission.home.editPermission\" ng-show=\"vm.permission.id != null\">Edit Permission</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "    <div class=\"modal-body wrapper-lg\">\n" +
    "        <form name=\"editForm\" role=\"form\" novalidate show-validation>\n" +
    "        <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_permission.domain\" for=\"field_domain\">Domain</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"domain\" id=\"field_domain\" required ng-minlength=1 ng-maxlength=50 ng-model=\"vm.permission.domain\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span ng-show=\"editForm.domain.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                <span ng-show=\"editForm.domain.$error.maxlength\" data-translate=\"entity.validation.maxlength\" translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_permission.action\" for=\"field_action\">Action</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"action\" id=\"field_action\" required ng-minlength=1 ng-maxlength=50 ng-model=\"vm.permission.action\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span ng-show=\"editForm.action.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                <span ng-show=\"editForm.action.$error.maxlength\" data-translate=\"entity.validation.maxlength\" translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_permission.target\" for=\"field_target\">Target</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"target\" id=\"field_target\" ng-minlength=1 ng-maxlength=50 ng-model=\"vm.permission.target\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span ng-show=\"editForm.target.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                <span ng-show=\"editForm.target.$error.maxlength\" data-translate=\"entity.validation.maxlength\" translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\" data-translate=\"sys_permission.description\" for=\"field_description\">Description</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\" required ng-minlength=1 ng-maxlength=100 ng-model=\"vm.permission.description\"/>\n" +
    "            <p class=\"help-block\">\n" +
    "                <span ng-show=\"editForm.description.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                <span ng-show=\"editForm.description.$error.maxlength\" data-translate=\"entity.validation.maxlength\" translate-value-max=\"100\">This field cannot be longer than 100 characters.</span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <!--<div class=\"form-group\">-->\n" +
    "            <!--<label class=\"control-label\" data-translate=\"sys_permission.configJson\" for=\"field_configJson\">Config Json</label>-->\n" +
    "            <!--<input type=\"text\" class=\"form-control\" name=\"configJson\" id=\"field_configJson\" ng-model=\"vm.permission.configJson\"/>-->\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "        <!--<div class=\"form-group\">-->\n" +
    "            <!--<label data-translate=\"sys_permission.role\" for=\"field_role\">Role</label>-->\n" +
    "            <!--<select class=\"form-select\" id=\"field_role\" name=\"role\" ng-model=\"vm.permission.roleId\" ng-options=\"role.id as role.id for role in vm.roles\"            >-->\n" +
    "                <!--<option value=\"\"></option>-->\n" +
    "            <!--</select>-->\n" +
    "        <!--</div>-->\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "            <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "        </button>\n" +
    "        <button type=\"button\" ng-disabled=\"editForm.$invalid || vm.isSaving\" class=\"btn btn-primary\" ng-click=\"vm.save()\">\n" +
    "            <span data-translate=\"common.action.save\">Save</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/adm/permission/permissions.html","<nav class=\"navbar navbar-expand navbar-light bg-light\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb my-auto bg-transparent\">\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"sys_permission.home.title\">Permission Management</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\" uaa-has-permission=\"sysadmin:perm:*\">\n" +
    "    <div class=\"card-body\">\n" +
    "        <opx-datatable table-config=\"tableConfig\">\n" +
    "            <button class=\"btn btn-default\" ui-sref=\"permission.new\">\n" +
    "                <span class=\"fa fa-plus\"></span> <span data-translate=\"sys_permission.home.createLabel\">Create a new Permission</span>\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/role/role-allocate-perm.html","<nav class=\"navbar navbar-expand navbar-light bg-light\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb bg-transparent my-auto\">\n" +
    "            <li class=\"breadcrumb-item\">\n" +
    "                <a ui-sref=\"role\" data-translate=\"sys_role.home.title\">Role Management</a>\n" +
    "            </li>\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span>权限分配</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-body\">\n" +
    "            <opx-datatable table-config=\"allocatePermVm.tableConfig\"></opx-datatable>\n" +
    "            <div class=\"mt-3\">\n" +
    "                <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" ng-click=\"allocatePermVm.clear()\">\n" +
    "                    <span data-translate=\"common.action.back\">Back</span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" ng-click=\"allocatePermVm.save()\" class=\"btn btn-primary opx-btn-ok\">\n" +
    "                    <span data-translate=\"common.action.save\">Save</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "       <!-- <div class=\"card-body\">\n" +
    "            <div class=\"table-responsive\">\n" +
    "                <table class=\"op-datatable role-perm-table table table-striped stripe table-hover\"></table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card-footer text-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ng-click=\"allocatePermVm.clear()\">\n" +
    "                <span data-translate=\"common.action.back\">Back</span>\n" +
    "            </button>\n" +
    "            <button type=\"button\" ng-click=\"allocatePermVm.save()\" class=\"btn btn-primary\">\n" +
    "                <span data-translate=\"common.action.save\">Save</span>\n" +
    "            </button>\n" +
    "        </div>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/role/role-delete-dialog.html","<form name=\"deleteForm\" ng-submit=\"vm.confirmDelete(vm.role.id)\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\" data-translate=\"entity.delete.title\">Confirm delete operation</h4>\n" +
    "        <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"vm.clear()\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "        <p data-translate=\"sys_role.delete.question\" translate-values=\"{name: '{{vm.role.name}}'}\">Are you sure you want to delete this Role?</p>\n" +
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

$templateCache.put("app/modules/adm/role/role-detail.html","<nav class=\"navbar navbar-expand navbar-light bg-light\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb bg-transparent my-auto\">\n" +
    "            <li class=\"breadcrumb-item\">\n" +
    "                <a ui-sref=\"role\" data-translate=\"sys_role.home.title\">Role Management</a>\n" +
    "            </li>\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"sys_role.detail.title\">Role Detail</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">\n" +
    "                <span data-translate=\"sys_role.detail.title\">Role Detail</span>\n" +
    "            </h3>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <uib-tabset class=\"tab-container\" active=\"1\">\n" +
    "                <uib-tab index=\"1\" heading=\"基本信息\">\n" +
    "                    <div>\n" +
    "                        <dl class=\"dl-horizontal jh-entity-details\">\n" +
    "                            <dt><span data-translate=\"sys_role.name\">Name</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.role.name}}</span>\n" +
    "                            </dd>\n" +
    "                            <!--<dt><span data-translate=\"sys_role.visibility\">Visibility</span></dt>-->\n" +
    "                            <!--<dd>-->\n" +
    "                            <!--<span>{{vm.role.visibility}}</span>-->\n" +
    "                            <!--</dd>-->\n" +
    "                            <dt><span data-translate=\"sys_role.description\">Description</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.role.description}}</span>\n" +
    "                            </dd>\n" +
    "                        </dl>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "                <uib-tab index=\"2\" heading=\"角色权限\">\n" +
    "                    <div ng-show=\"vm.role.permissions != null && vm.role.permissions.length > 0\">\n" +
    "                        <span class=\"badge bg-secondary m-r-sm\" ng-repeat=\"permission in vm.role.permissions\">{{permission.domain}}:{{permission.action}}:{{permission.target}}</span>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "            </uib-tabset>\n" +
    "        </div>\n" +
    "        <div class=\"card-footer text-right\">\n" +
    "            <button type=\"button\" ui-sref=\"role\" class=\"btn btn-default\">\n" +
    "                <span class=\"fa fa-arrow-left\"></span>&nbsp;<span data-translate=\"common.action.back\"> Back</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/role/role-dialog.html","<style>\n" +
    "    .help-block {\n" +
    "        margin: 0px;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myRoleLabel\">\n" +
    "        <span data-translate=\"sys_role.home.createRole\" ng-show=\"vm.role.id == null\">Create Role</span>\n" +
    "        <span data-translate=\"sys_role.home.editRole\" ng-show=\"vm.role.id != null\">Edit Role</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "    <form name=\"editForm\" role=\"form\" novalidate show-validation>\n" +
    "        <uib-tabset class=\"tab-container wrapper\" active=\"1\">\n" +
    "            <uib-tab index=\"1\" heading=\"基本信息\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" data-translate=\"sys_role.name\" for=\"field_name\">Name</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"name\" id=\"field_name\" required ng-minlength=1 ng-maxlength=50 ng-model=\"vm.role.name\"/>\n" +
    "                    <p class=\"help-block\">\n" +
    "                        <span ng-show=\"editForm.name.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                        <span ng-show=\"editForm.name.$error.maxlength\" data-translate=\"entity.validation.maxlength\" translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <!--<div class=\"form-group\">-->\n" +
    "                <!--<label class=\"control-label\" data-translate=\"sys_role.visibility\" for=\"field_visibility\">Visibility</label>-->\n" +
    "                <!--<input type=\"text\" class=\"form-control\" name=\"visibility\" id=\"field_visibility\" ng-model=\"vm.role.visibility\"/>-->\n" +
    "                <!--</div>-->\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" data-translate=\"sys_role.description\" for=\"field_description\">Description</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\" required ng-minlength=1 ng-maxlength=100 ng-model=\"vm.role.description\"/>\n" +
    "                    <p class=\"help-block\">\n" +
    "                        <span ng-show=\"editForm.description.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                        <span ng-show=\"editForm.description.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                              translate-value-max=\"100\">This field cannot be longer than 100 characters.</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"2\" heading=\"角色权限\">\n" +
    "                <div class=\"row\" ng-if=\"vm.permissions != null && vm.permissions.length > 0\">\n" +
    "                    <div class=\"col-xs-6 col-sm-4 col-md-4\" ng-repeat=\"permission in vm.permissions\">\n" +
    "                        <label class=\"i-checks\">\n" +
    "                            <input type=\"checkbox\"\n" +
    "                                   name=\"{{permission.id}}\"\n" +
    "                                   ng-checked=\"permission.isChecked\"\n" +
    "                                   ng-click=\"permission.isChecked = !permission.isChecked\"/> <i></i>\n" +
    "                        </label>\n" +
    "                        <span class=\"\">{{permission.domain}} : {{permission.action}} : {{permission.target}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </uib-tab>\n" +
    "            <uib-tab index=\"3\" heading=\"角色用户\" select=\"vm.showTenantSelect()\">\n" +
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

$templateCache.put("app/modules/adm/role/roles.html","<nav class=\"navbar navbar-light\">\n" +
    "    <div class=\"navbar-nav\">\n" +
    "        <ol class=\"breadcrumb\">\n" +
    "            <span data-translate=\"sys_role.home.title\">Role Management</span>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"card-body\" uaa-has-permission=\"sysadmin:role:*\">\n" +
    "    <opx-datatable table-config=\"tableConfig\">\n" +
    "        <button class=\"btn btn-default\" ui-sref=\"role.allocate-perm\">\n" +
    "            <span class=\"fa fa-th-list\"></span>\n" +
    "            权限分配\n" +
    "        </button>\n" +
    "        <button class=\"btn btn-default\" ui-sref=\"role.new\">\n" +
    "            <span class=\"fa fa-plus\"></span> <span data-translate=\"sys_role.home.createLabel\">Create a new Role</span>\n" +
    "        </button>\n" +
    "    </opx-datatable>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/subordinate/subordinate-config.html","<nav class=\"navbar navbar-expand navbar-light bg-light\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb my-0 bg-transparent\">\n" +
    "            <li class=\"breadcrumb-item\">\n" +
    "                <a ui-sref=\"subordinate\" data-translate=\"subordinate.home.title\">Subordinate Management</a>\n" +
    "            </li>\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"subordinate.config.title\">Subordinate Config</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <div class=\"card-title\">\n" +
    "                <span>关系列表</span>\n" +
    "\n" +
    "                <button type=\"button\" ng-disabled=\"subordinateConfigVm.views.currentLeader == null || vm.isSaving\" class=\"btn btn-primary btn-sm pull-right\" ng-click=\"subordinateConfigVm.views.save()\">\n" +
    "                    <span data-translate=\"common.action.save\">Save</span>\n" +
    "                </button>\n" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-default btn-sm pull-right m-r-sm\" data-dismiss=\"modal\" ng-click=\"subordinateConfigVm.views.cancel()\">\n" +
    "                    <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-5 col-sm-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>请选择上级</label>\n" +
    "\n" +
    "                        <tm-select-user-tree check-type=\"radio\"\n" +
    "                                             default-selected=\"subordinateConfigVm.views.currentLeaders\"\n" +
    "                                             on-select=\"subordinateConfigVm.views.onLeaderChosen\">\n" +
    "                        </tm-select-user-tree>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 hidden-sm text-center\" style=\"margin-top: 30%;\">\n" +
    "                    <i class=\"fa fa-sitemap fa-rotate-270 fa-2x\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-5 col-sm-12\">\n" +
    "                    <div class=\"form-group\" ng-show=\"subordinateConfigVm.views.currentLeader != null\">\n" +
    "                        <label>请选择下属</label>\n" +
    "                        <tm-select-user-tree check-type=\"checkbox\"\n" +
    "                                             default-selected=\"subordinateConfigVm.views.selectedUsers\"\n" +
    "                                             disabled-users=\"subordinateConfigVm.views.disabledUsers\"\n" +
    "                                             on-select=\"subordinateConfigVm.views.onUserChosen\">\n" +
    "                        </tm-select-user-tree>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/subordinate/subordinate-list.html","<nav class=\"navbar navbar-light bg-light b-b\">\n" +
    "    <div class=\"navbar-header\" style=\"width: 100%; padding-left: 20px;\">\n" +
    "        <ol class=\"breadcrumb\">\n" +
    "            <li>\n" +
    "                <span data-translate=\"subordinate.home.title\">Subordinate Management</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <div class=\"card-title\">\n" +
    "                <span>关系列表</span>\n" +
    "                <span class=\"pull-right m-t-n-xs\">\n" +
    "                    <button class=\"btn btn-default\" ui-sref=\"subordinate.config\">\n" +
    "                        <span class=\"fa fa-cog\"></span><span class=\"m-l-sm\" data-translate=\"subordinate.home.edit\">Config Subordinate RelationShip</span>\n" +
    "                    </button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"card-body\">\n" +
    "            <div class=\"table-responsive\">\n" +
    "                <table class=\"jh-table table table-striped\">\n" +
    "                    <thead>\n" +
    "                    <tr jh-sort=\"vm.predicate\" ascending=\"vm.reverse\" callback=\"vm.transition()\">\n" +
    "                        <th jh-sort-by=\"leaderFullName\"><span data-translate=\"subordinate.leaderFullName\">Leader Name</span> <span class=\"fa fa-sort\"></span></th>\n" +
    "                        <th jh-sort-by=\"userFullName\"><span data-translate=\"subordinate.userFullName\">User Name</span> <span class=\"fa fa-sort\"></span></th>\n" +
    "                        <!--<th></th>-->\n" +
    "                    </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                    <tr ng-repeat=\"subordinate in vm.subordinates track by subordinate.id\">\n" +
    "                        <td>{{subordinate.leaderFullName}}</td>\n" +
    "                        <td>{{subordinate.userFullName}}</td>\n" +
    "                        <!--<td class=\"text-right\">-->\n" +
    "                            <!--<div class=\"btn-group flex-btn-group-container\">-->\n" +
    "                                <!--<button type=\"submit\" ui-sref=\"subordinate.delete({id:subordinate.id})\" class=\"btn btn-danger btn-sm\">-->\n" +
    "                                    <!--<span class=\"fa fa-times-circle\"></span>-->\n" +
    "                                    <!--<span class=\"hidden-sm-down\" data-translate=\"common.action.delete\"></span>-->\n" +
    "                                <!--</button>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</td>-->\n" +
    "                    </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "            <div class=\"text-center\">\n" +
    "                <jhi-item-count page=\"vm.page\" total=\"vm.queryCount\" items-per-page=\"vm.itemsPerPage\"></jhi-item-count>\n" +
    "                <uib-pagination class=\"pagination-sm\" total-items=\"vm.totalItems\" items-per-page=\"vm.itemsPerPage\" ng-model=\"vm.page\" ng-change=\"vm.transition()\"></uib-pagination>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/adm/subordinate/subordinates.html","<nav class=\"navbar navbar-expand navbar-light bg-light\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb my-0 bg-transparent\">\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"subordinate.home.title\">Subordinate Management</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\" uaa-has-permission=\"sysadmin:subordinate:*\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <div class=\"card-title\">\n" +
    "                <span>关系列表</span>\n" +
    "                <span class=\"pull-right m-t-n-xs\">\n" +
    "                    <button class=\"btn btn-default\" ui-sref=\"subordinate.config\">\n" +
    "                        <span class=\"fa fa-cog\"></span><span class=\"ms-3\" data-translate=\"subordinate.home.edit\">Config Subordinate RelationShip</span>\n" +
    "                    </button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"card-body\">\n" +
    "            <div id=\"subordinateTree\" class=\"tm-select-user-tree\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/sysinfo.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">About</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body op-smartform\" ng-if=\"!$ctrl.isNew\" style=\"height:30rem;\">\n" +
    "    <uib-tabset class=\"tab-container h-100\" type=\"mdc-op\" active=\"1\">\n" +
    "        <uib-tab index=\"1\">\n" +
    "            <uib-tab-heading>版本信息</uib-tab-heading>\n" +
    "            <div class=\"modal-body\">\n" +
    "                <table class=\"table opx-table\">\n" +
    "                    <thead>\n" +
    "                    <tr>\n" +
    "                        <th>{{'adm.content.sysinfo_name' | translate}}</th>\n" +
    "                        <th>{{'adm.content.sysinfo_edition' | translate}}</th>\n" +
    "                        <th>{{'adm.content.sysinfo_pack_time' | translate}}</th>\n" +
    "                        <th>{{'adm.content.sysinfo_code_edition' | translate}}</th>\n" +
    "                    </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                    <tr ng-repeat=\"version in $ctrl.viewVersions track by $index\">\n" +
    "                        <td>{{version.module}}</td>\n" +
    "                        <td>{{version.version}}</td>\n" +
    "                        <td>{{version.build ? '#' + version.build : ''}}</td>\n" +
    "                        <td></td>\n" +
    "                    </tr>\n" +
    "                    <tr ng-repeat=\"version in $ctrl.serverVersions track by $index\">\n" +
    "                        <td>{{version.projectName}}</td>\n" +
    "                        <td>{{version.projectVersion}}</td>\n" +
    "                        <td>{{version.buildTime ? '#' + version.buildTime : ''}}</td>\n" +
    "                        <td>{{version.codeVersion ? version.codeVersion : ''}}</td>\n" +
    "                    </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab ng-if=\"$ctrl.isEnableLicense\">\n" +
    "            <uib-tab-heading>授权许可</uib-tab-heading>\n" +
    "            <div>\n" +
    "                <span>授权给：<span>{{$ctrl.license.licenseContent.subject}}</span></span><br><br>\n" +
    "                <span>激活码到期时间：<span>{{$ctrl.license.licenseContent.notAfter}}</span></span><br><br>\n" +
    "                <span>授权MAC地址：<span>{{$ctrl.license.licenseContent.extra.macList}}</span></span><br><br>\n" +
    "                <span>授权模块信息：<span>{{$ctrl.license.licenseContent.extra.modules}}</span></span><br><br>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab ng-if=\"$ctrl.isEnableLicense\">\n" +
    "            <uib-tab-heading>更新激活码</uib-tab-heading>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <p class=\"help-block  text-danger\">\n" +
    "                        {{$ctrl.msg}}\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" op-help-info=\"请提供部署主机mac地址给厂商获取激活码\">激活码</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                        <textarea class=\"form-control\" ng-model=\"$ctrl.license.activationCode\" rows=\"11\"\n" +
    "                                  style=\"resize: none;\" required></textarea>\n" +
    "                </div>\n" +
    "            </div> -->\n" +
    "\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" op-help-info=\"请提供部署主机mac地址给厂商获取授权文件\">授权文件</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <label class=\"btn btn-outline-primary\">\n" +
    "                        <input type=\"file\" ngf-select ngf-max-size=\"$ctrl.ngf.maxSize\" ngf-pattern=\"$ctrl.ngf.pattern\"\n" +
    "                            ng-model=\"$ctrl.fileInfo.file\" name=\"file\" style=\"display:none;\"\">\n" +
    "                        {{'gfs.basic.select_file' | translate}}\n" +
    "                    </label>\n" +
    "\n" +
    "                    <div class=\"align-content-center ml-3\">\n" +
    "                        <strong>{{ $ctrl.fileInfo.file.name }}</strong>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <p class=\"help-block\" style=\"margin-top: 1rem\">\n" +
    "                        {{'gfs.basic.file_max_size' | translate}}{{$ctrl.ngf.maxSize}}<strong>{{$ctrl.ngf.pattern}}</strong>。\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <button class=\"btn btn-primary opx-btn-ok float-end\" type=\"button\" ng-click=\"$ctrl.register()\">更新激活码\n" +
    "                </button>\n" +
    "            </div>\n" +
    "\n" +
    "        </uib-tab>\n" +
    "    </uib-tabset>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/adm/tenant-config/tenant-config-export.html","<form ng-submit=\"$export.doExport()\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\">{{'adm.content.export_page' | translate}}</h4>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div style=\"width: 470px;\">\n" +
    "            <div id=\"tenantConfigExportTree\" style=\"height: 400px;\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <button class=\"btn btn-default\" type=\"button\" ng-click=\"$export.cancelImport()\">{{'common.action.cancel'|translate}}</button>\n" +
    "            <button class=\"btn btn-primary\" type=\"submit\" uaa-has-permission=\"sysadmin:tenant:*\" >{{'adm.content.start_export' | translate}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>")

$templateCache.put("app/modules/adm/tenant-config/tenant-config-import.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar bg-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"tenantConfig\">{{'adm.content.data_maintenance' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active\">{{'adm.content.import_config' | translate}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"hbox hbox-auto-xs hbox-auto-sm wrapper\">\n" +
    "        <div class=\"wrapper\">\n" +
    "            <div class=\"card card-default\">\n" +
    "                <div class=\"card-header\">\n" +
    "                    <div class=\"card-title\">\n" +
    "                        <span>{{'adm.content.import_config_info' | translate}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <form class=\"form-group form-control-wrapper\">\n" +
    "                        <div class=\"alert alert-success js-uw-style\" data-customcss=\"alert.*\">\n" +
    "                            <button type=\"button\" class=\"btn-close\" data-dismiss=\"alert\">×</button>\n" +
    "                            <div>\n" +
    "                                <h4><span data-translate=\"adm.content.tips\"></span></h4>\n" +
    "                                <span data-translate=\"adm.content.desc\"></span>\n" +
    "\n" +
    "                                <div><span data-translate=\"adm.content.desc_1\"></span></div>\n" +
    "                                <div><span data-translate=\"adm.content.desc_2\"></span></div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <label class=\"control-label\" data-translate=\"adm.content.tenant_info\"></label>\n" +
    "\n" +
    "                        <div class=\"row \">\n" +
    "                            <div class=\"col-sm-3\">\n" +
    "                                <select class=\"form-select \"\n" +
    "                                        ng-model=\"$import.views.tenantDTO\"\n" +
    "                                        ng-options=\"tenant as tenant.name for tenant in $import.tenants\">\n" +
    "                                    <option value=\"\">{{'adm.content.select_tenant' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-sm-2\" style=\"max-width: 12.66667%\">\n" +
    "                                <div class=\"opx-check-group btn-group\">\n" +
    "                                    <input type=\"radio\" name=\"update\" ng-model=\"$import.views.update\"\n" +
    "                                           id=\"as_status_1\" value=\"0\">\n" +
    "                                    <label for=\"as_status_1\">{{'adm.content.update' | translate}}</label>\n" +
    "                                    <input type=\"radio\" name=\"update\" ng-model=\"$import.views.update\"\n" +
    "                                           id=\"as_status_2\" value=\"1\">\n" +
    "                                    <label for=\"as_status_2\">{{'adm.content.new' | translate}}</label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-sm-1\" uaa-has-permission=\"adm:edit:*\">\n" +
    "                                <button class=\"btn btn-success form-control\" ng-disabled=\"!displayImport\"\n" +
    "                                        ng-click=\"$import.doImport()\"> {{'common.action.import' | translate}}\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"form-group form-control-wrapper\">\n" +
    "                        <!--<label class=\"control-label\" data-translate=\"app.setting.title\"></label>-->\n" +
    "                        <label class=\"control-label\"> 导入类型</label>\n" +
    "\n" +
    "                        <div class=\"row \">\n" +
    "                            <div class=\"col-sm-3\">\n" +
    "                                <select class=\"form-select \"\n" +
    "                                        ng-model=\"$import.views.type\"\n" +
    "                                        ng-options=\"handle as handle.label for handle in $import.types\">\n" +
    "                                    <option value=\"\">{{'adm.content.select_import_type' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group form-control-wrapper\" ng-if=\"$import.views.update === '1'\">\n" +
    "                        <label class=\"control-label\" data-translate=\"app.setting.title\"></label>\n" +
    "\n" +
    "                        <div class=\"row \">\n" +
    "                            <div class=\"col-sm-3\">\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input name=\"title\" class=\"form-control\"\n" +
    "                                           ng-model=\"$import.views.title\"\n" +
    "                                           required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group form-control-wrapper\" ng-if=\"$import.views.update === '1'\">\n" +
    "                        <label class=\"control-label\">{{'app.setting.code' | translate}}</label>\n" +
    "\n" +
    "                        <div class=\"row \">\n" +
    "                            <div class=\"col-sm-3\">\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input name=\"name\" class=\"form-control \"\n" +
    "                                           ng-model=\"$import.views.name\"\n" +
    "                                           required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"$import.views.tenantDTO\">\n" +
    "                        <div class=\"form-group\" style=\"padding-top: 15px;padding-bottom: 10px\">\n" +
    "                            <button type=\"button\" class=\"btn btn-outline-primary\" udp-file-browser\n" +
    "                                    ng-model=\"$import.selectedFile\"\n" +
    "                                    on-change=\"$import.parseFile\">\n" +
    "                                <i class=\"fa fa-folder-open-o\"></i> {{'adm.content.select_import_file' | translate}}\n" +
    "                            </button>\n" +
    "                            <strong>{{$import.selectedFile.name}}</strong>\n" +
    "                        </div>\n" +
    "                        <div>\n" +
    "                            <div id=\"tenantConfigTree\" ng-show=\"displayTree\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/adm/tenant-config/tenant-config-index.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light bg-light\">\n" +
    "        <span class=\"navbar-brand\">{{'adm.content.data_maintenance' | translate}}</span>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <opx-datatable table-config=\"tableConfig\">\n" +
    "            <div uaa-has-permission=\"sysadmin:tenant:*\">\n" +
    "                <button class=\"btn btn-primary\" ui-sref=\"tenantConfig.tenant_import\">\n" +
    "                    <span class=\"fa fa-plus\"></span> <span>{{'common.action.import' | translate}}</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/tenant/tenant-delete-dialog.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" data-translate=\"entity.delete.title\">Confirm delete operation</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <!--<jhi-alert-error></jhi-alert-error>-->\n" +
    "    <p data-translate=\"sys_tenant.delete.question\" translate-values=\"{name: '{{vm.tenant.name}}'}\">Are you sure you want to delete this Tenant?</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "        <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "    </button>\n" +
    "    <button type=\"button\" ng-click=\"vm.confirmDelete(vm.tenant.id)\" class=\"btn btn-danger\">\n" +
    "        <span data-translate=\"common.action.delete\">Delete</span>\n" +
    "    </button>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/tenant/tenant-detail.html","<nav class=\"navbar navbar-light bg-light b-b\">\n" +
    "    <div class=\"navbar-header\" style=\"width: 100%; padding-left: 20px;\">\n" +
    "        <ol class=\"breadcrumb\">\n" +
    "            <li>\n" +
    "                <a ui-sref=\"tenant\" data-translate=\"sys_tenant.home.title\">Tenant Management</a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <span data-translate=\"sys_tenant.detail.title\">Tenant Detail</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">\n" +
    "                <span data-translate=\"sys_tenant.detail.title\">Tenant Detail</span>\n" +
    "            </h3>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <uib-tabset class=\"tab-container row wrapper\" active=\"1\">\n" +
    "                <uib-tab index=\"1\" heading=\"基本信息\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <dl class=\"dl-horizontal jh-entity-details\">\n" +
    "                            <dt><span>ID</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.tenant.id}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_tenant.name\">Name</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.tenant.name}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_tenant.code\">code</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.tenant.code}}</span>\n" +
    "                            </dd>\n" +
    "                            <dt><span data-translate=\"sys_tenant.description\">Description</span></dt>\n" +
    "                            <dd>\n" +
    "                                <span>{{vm.tenant.description}}</span>\n" +
    "                            </dd>\n" +
    "                        </dl>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "                <uib-tab index=\"2\" heading=\"配置信息\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <pre style=\"height:300px\">{{vm.tenant.config}}</pre>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "        </div>\n" +
    "        <div class=\"card-footer text-right\">\n" +
    "            <button type=\"button\" ui-sref=\"tenant\" class=\"btn btn-default\">\n" +
    "                <span class=\"fa fa-arrow-left\"></span>&nbsp;<span data-translate=\"common.action.back\"> Back</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/adm/tenant/tenant-dialog.html","<style>\n" +
    "    .help-block {\n" +
    "        margin: 0;\n" +
    "    }\n" +
    "</style>\n" +
    "<form name=\"editForm\" role=\"form\" novalidate ng-submit=\"tenantEditVm.save()\" show-validation>\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <div class=\"card-title\">\n" +
    "                <span data-translate=\"sys_tenant.home.createTenant\" ng-show=\"tenantEditVm.tenant.id == null\">Create Tenant</span>\n" +
    "                <span data-translate=\"sys_tenant.home.editTenant\" ng-show=\"tenantEditVm.tenant.id != null\">Edit Tenant</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"card-body\">\n" +
    "            <uib-tabset active=\"1\">\n" +
    "                <uib-tab index=\"1\" heading=\"基本信息\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" data-translate=\"sys_tenant.name\" for=\"field_name\">Name</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"name\" id=\"field_name\" required ng-minlength=1 ng-maxlength=50 ng-model=\"tenantEditVm.tenant.name\"/>\n" +
    "                            <p class=\"help-block\">\n" +
    "                                <span ng-show=\"editForm.name.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                                <span ng-show=\"editForm.name.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                                      translate-value-max=\"50\">This field cannot be longer than 50 characters.</span>\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\" ng-class=\"{'has-error':editForm.code.$error.pattern}\">\n" +
    "                            <label class=\"control-label\" data-translate=\"sys_tenant.code\" for=\"field_code\">Code</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"code\" id=\"field_code\" required ng-minlength=1 ng-maxlength=100\n" +
    "                                   ng-pattern=\"/^[_a-z0-9-]*$/\" ng-model=\"tenantEditVm.tenant.code\" ng-disabled=\"tenantEditVm.tenant.id != null\"/>\n" +
    "                            <p class=\"help-block\">\n" +
    "                                <span ng-show=\"editForm.code.$error.required\" data-translate=\"entity.validation.required\">This field is required.</span>\n" +
    "                                <span ng-show=\"editForm.code.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                                      translate-value-max=\"100\">This field cannot be longer than 100 characters.</span>\n" +
    "                                <span ng-show=\"editForm.code.$error.pattern\">只允许数字（0-9）、小写字母（a-z）、下划线（_)、横线（-).</span>\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" data-translate=\"sys_tenant.description\" for=\"field_description\">Description</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\" ng-minlength=1 ng-maxlength=100 ng-model=\"tenantEditVm.tenant.description\"/>\n" +
    "                            <p class=\"help-block\">\n" +
    "                            <span ng-show=\"editForm.desc.$error.maxlength\" data-translate=\"entity.validation.maxlength\"\n" +
    "                                  translate-value-max=\"100\">This field cannot be longer than 100 characters.</span>\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "                <uib-tab index=\"2\" heading=\"配置信息\">\n" +
    "                    <div class=\"col-md-12 mt-3\">\n" +
    "                        <textarea class=\"form-control\" ui-codemirror=\"{mode:'javascript', lineNumbers:false, theme:'opluscode', lineWrapping:true}\"\n" +
    "                                  rows=\"10\" ng-model=\"tenantEditVm.tenant.config\"></textarea>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "                <uib-tab index=\"3\" heading=\"用户列表\" ng-if=\"tenantEditVm.tenant.id\" select=\"tenantEditVm.isShowTenantUser=true;\">\n" +
    "                    <div class=\"col-md-12 mt-3\" ng-if=\"tenantEditVm.isShowTenantUser\">\n" +
    "                        <div style=\"margin-bottom: -35px;\">\n" +
    "                            <button class=\"btn btn-info\" type=\"button\" link-tenant-user tenant-id=\"{{tenantEditVm.tenant.id}}\" on-update=\"tenantEditVm.onAddUser\">添加用户</button>\n" +
    "                        </div>\n" +
    "                        <tenant-user-list tenant-id=\"tenantEditVm.tenant.id\"></tenant-user-list>\n" +
    "                    </div>\n" +
    "                </uib-tab>\n" +
    "            </uib-tabset>\n" +
    "        </div>\n" +
    "        <div class=\"card-footer text-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"tenantEditVm.clear()\">\n" +
    "                <span data-translate=\"common.action.cancel\">Cancel</span>\n" +
    "            </button>\n" +
    "            <button type=\"submit\" ng-disabled=\"editForm.$invalid || tenantEditVm.isSaving\" class=\"btn btn-primary\">\n" +
    "                <span data-translate=\"common.action.save\">Save</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/adm/tenant/tenant-export.html","<form ng-submit=\"$export.doExport()\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\">{{'adm.content.export_page' | translate}}</h4>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div style=\"width: 470px;\">\n" +
    "            <div id=\"tenantConfigExportTree\" style=\"height: 400px;\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <button class=\"btn btn-default\" type=\"button\" ng-click=\"$export.cancelImport()\">{{'common.action.cancel'|translate}}</button>\n" +
    "            <button class=\"btn btn-primary\" type=\"submit\" uaa-has-permission=\"sysadmin:tenant:*\" >{{'adm.content.start_export' | translate}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/adm/tenant/tenant-import.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar bg-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"tenant\" data-translate=\"sys_tenant.home.title\">Tenant Management</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active\">{{'adm.content.import_config' | translate}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"hbox hbox-auto-xs hbox-auto-sm wrapper\">\n" +
    "        <div class=\"wrapper\">\n" +
    "            <div class=\"card card-default\">\n" +
    "                <div class=\"card-header\">\n" +
    "                    <div class=\"card-title\">\n" +
    "                        <span>{{'adm.content.import_config_info' | translate}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <form class=\"form-group form-control-wrapper\">\n" +
    "                        <div class=\"alert alert-success js-uw-style\" data-customcss=\"alert.*\">\n" +
    "                            <button type=\"button\" class=\"btn-close\" data-dismiss=\"alert\"></button>\n" +
    "                            <div>\n" +
    "                                <h4><span data-translate=\"adm.content.tips\"></span></h4>\n" +
    "                                <span data-translate=\"adm.content.desc\"></span>\n" +
    "\n" +
    "                                <div><span data-translate=\"adm.content.desc_1\"></span></div>\n" +
    "                                <div><span data-translate=\"adm.content.desc_2\"></span></div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <label class=\"control-label\" data-translate=\"adm.content.tenant_info\"></label>\n" +
    "\n" +
    "                        <div class=\"row \">\n" +
    "                            <div class=\"col-sm-3\">\n" +
    "                                <select class=\"form-select \"\n" +
    "                                        ng-model=\"$import.views.tenantDTO\"\n" +
    "                                        ng-options=\"tenant as tenant.name for tenant in $import.tenants\">\n" +
    "                                    <option value=\"\">{{'adm.content.select_tenant' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-sm-2\" style=\"max-width: 12.66667%\">\n" +
    "                                <div class=\"opx-check-group btn-group\">\n" +
    "                                    <input type=\"radio\" name=\"update\" ng-model=\"$import.views.update\"\n" +
    "                                           id=\"as_status_1\" value=\"0\">\n" +
    "                                    <label for=\"as_status_1\">{{'adm.content.update' | translate}}</label>\n" +
    "                                    <input type=\"radio\" name=\"update\" ng-model=\"$import.views.update\"\n" +
    "                                           id=\"as_status_2\" value=\"1\">\n" +
    "                                    <label for=\"as_status_2\">{{'adm.content.new' | translate}}</label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-sm-1\" uaa-has-permission=\"adm:edit:*\">\n" +
    "                                <button class=\"btn btn-success form-control\" ng-disabled=\"!displayImport\"\n" +
    "                                        ng-click=\"$import.doImport()\"> {{'common.action.import' | translate}}\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"form-group form-control-wrapper\">\n" +
    "                        <!--<label class=\"control-label\" data-translate=\"app.setting.title\"></label>-->\n" +
    "                        <label class=\"control-label\"> 导入类型</label>\n" +
    "\n" +
    "                        <div class=\"row \">\n" +
    "                            <div class=\"col-sm-3\">\n" +
    "                                <select class=\"form-select \"\n" +
    "                                        ng-model=\"$import.views.type\"\n" +
    "                                        ng-options=\"handle as handle.label for handle in $import.types\">\n" +
    "                                    <option value=\"\">{{'adm.content.select_import_type' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group form-control-wrapper\" ng-if=\"$import.views.update === '1'\">\n" +
    "                        <label class=\"control-label\" data-translate=\"app.setting.title\"></label>\n" +
    "\n" +
    "                        <div class=\"row \">\n" +
    "                            <div class=\"col-sm-3\">\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input name=\"title\" class=\"form-control\"\n" +
    "                                           ng-model=\"$import.views.title\"\n" +
    "                                           required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group form-control-wrapper\" ng-if=\"$import.views.update === '1'\">\n" +
    "                        <label class=\"control-label\">{{'app.setting.code' | translate}}</label>\n" +
    "\n" +
    "                        <div class=\"row \">\n" +
    "                            <div class=\"col-sm-3\">\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input name=\"name\" class=\"form-control \"\n" +
    "                                           ng-model=\"$import.views.name\"\n" +
    "                                           required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"$import.views.tenantDTO\">\n" +
    "                        <div class=\"form-group\" style=\"padding-top: 15px;padding-bottom: 10px\">\n" +
    "                            <button type=\"button\" class=\"btn btn-outline-primary\" udp-file-browser\n" +
    "                                    ng-model=\"$import.selectedFile\"\n" +
    "                                    on-change=\"$import.parseFile\">\n" +
    "                                <i class=\"fa fa-folder-open-o\"></i> {{'adm.content.select_import_file' | translate}}\n" +
    "                            </button>\n" +
    "                            <strong>{{$import.selectedFile.name}}</strong>\n" +
    "                        </div>\n" +
    "                        <div>\n" +
    "                            <div id=\"tenantConfigTree\" ng-show=\"displayTree\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/adm/tenant/tenants.html","<nav class=\"navbar navbar-expand navbar-light bg-light b-b\">\n" +
    "    <div class=\"collapse navbar-collapse ms-0\">\n" +
    "        <ol class=\"breadcrumb bg-transparent my-0\">\n" +
    "            <li class=\"breadcrumb-item active\">\n" +
    "                <span data-translate=\"sys_tenant.home.title\">Tenant Management</span>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "<div class=\"wrapper\" uaa-has-permission=\"sysadmin:tenant:*\" ui-view=\"tenant\">\n" +
    "    <div class=\"card card-default\">\n" +
    "        <div class=\"card-body\">\n" +
    "            <opx-datatable table-config=\"tableConfig\">\n" +
    "                <button class=\"btn btn-default\" ui-sref=\"tenant.new\">\n" +
    "                    <span class=\"fa fa-plus\"></span> <span data-translate=\"sys_tenant.home.createLabel\">Create a new Tenant</span>\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-default\" ui-sref=\"tenant.tenant_import\">\n" +
    "                    <span class=\"fa fa-plus\"></span> <span>{{'common.action.import' | translate}}</span>\n" +
    "                </button>\n" +
    "            </opx-datatable>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "")
}]);
})();