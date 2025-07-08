//HEAD 
(function(app) {
try { app = angular.module("oplus.cac"); }
catch(err) { app = angular.module("oplus.cac", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/cac/cac-index.html","<div class=\"opx-layout-hflex\" __uaa-has-permission=\"cac:view:*\">\n" +
    "    <div class=\"opx-sidebar bg-light\">\n" +
    "<!--        <nav class=\"navbar opx-sidebar-header opx-sidebar-header-fixed\">-->\n" +
    "<!--            <a class=\"opx-navbar-title\" ng-click=\"cacVm.views.chosed = ''\" ui-sref=\"app.cac.template.square\" ui-sref-opts=\"{reload:'app.cac.template.square'}\">{{'cac.index.square' | translate}}</a>-->\n" +
    "<!--        </nav>-->\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <div class=\"opx-treenav\">\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref-active=\"active\" ng-click=\"cacVm.views.chosed = 'square'\" title=\"{{'cac.common.square' | translate}}{{'app_uim.menu.dashboard' | translate}}\"\n" +
    "                       ui-sref=\"app.cac.template.square\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac.template',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-th-large\"></i> {{'cac.common.square' | translate}}{{'app_uim.menu.dashboard' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref-active=\"active\" ng-click=\"cacVm.views.chosed = 'template'\" title=\"{{'cac.index.template' | translate}}\"\n" +
    "                       ui-sref=\"app.cac.template.list\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac.template',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-list-alt\"></i> {{'cac.index.template' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ng-click=\"cacVm.views.chosed = 'history'\"\n" +
    "                       ng-class=\"cacVm.views.chosed == 'history' ? 'active' : ''\"\n" +
    "                       title=\"{{'cac.index.job' | translate}}\"\n" +
    "                       ui-sref=\"app.cac.job.list({templateId:''})\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac.job',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-history\"></i> {{'cac.index.job' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"cac:edit:*\">\n" +
    "                    <a ui-sref-active=\"active\" ng-click=\"cacVm.views.chosed = 'config'\" title=\"{{'cac.index.template' | translate}}\"\n" +
    "                       ui-sref=\"app.cac.export.list\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac.export',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-cog\"></i> {{'cac.index.patrol_configuration' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\" uaa-has-permission=\"cac:edit:*\" ng-if=\"cacVm.views.emailMenuEnabled === 'yes'\">\n" +
    "                    <a ui-sref-active=\"active\" ng-click=\"cacVm.views.chosed = 'email'\" title=\"{{'cac.common.mail_configuration' | translate}}\"\n" +
    "                       ui-sref=\"app.cac.email.list\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac.email',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-envelope\"></i> {{'cac.common.mail_configuration' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill scroll-y\" ui-view=\"cacList\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/cac3-index.html","<div class=\"opx-layout-hflex\" __uaa-has-permission=\"cac:view:*\">\n" +
    "    <div class=\"opx-sidebar bg-light\">\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <div class=\"opx-treenav\">\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref-active=\"active\" ng-click=\"cacVm.views.chosed = 'templates'\" title=\"{{'cac3.navigation.patrol_item_template' | translate}}\"\n" +
    "                       ui-sref=\"app.cac3.templates.list\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac3.templates',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-warehouse\"></i> {{'cac3.navigation.patrol_item_template' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref-active=\"active\" ng-click=\"cacVm.views.chosed = 'inspection'\" title=\"{{'cac3.navigation.patrol_item_list' | translate}}\"\n" +
    "                       ui-sref=\"app.cac3.inspection.list\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac3.inspection',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-list-alt\"></i> {{'cac3.navigation.patrol_item_list' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a\n" +
    "                       ng-click=\"cacVm.views.chosed = 'check_log'\" title=\"{{'cac3.navigation.inspection_results' | translate}}\"\n" +
    "                       ng-class=\"cacVm.views.chosed == 'check_log' ? 'active' : ''\"\n" +
    "                       title=\"{{'cac3.navigation.inspection_results' | translate}}\"\n" +
    "                       ui-sref=\"app.cac3.check_log.list({templateId:''})\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac3.check_log',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-history\"></i> {{'cac3.navigation.inspection_results' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref-active=\"active\" ng-click=\"cacVm.views.chosed = 'fix'\" title=\"{{'cac3.navigation.repair_results' | translate}}\"\n" +
    "                       ui-sref=\"app.cac3.fix.list\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac3.fix',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-toolbox\"></i> {{'cac3.navigation.repair_results' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref-active=\"active\" ng-click=\"cacVm.views.chosed = 'export'\" title=\"{{'cac3.navigation.export_configuration' | translate}}\"\n" +
    "                       ui-sref=\"app.cac3.export.list\"\n" +
    "                       ui-sref-opts=\"{reload:'app.cac3.export',notify:true}\">\n" +
    "                        <i class=\"fad fa-fw fa-cogs\"></i> {{'cac3.navigation.export_configuration' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill scroll-y\" ui-view=\"cac3List\">\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/cac/email/email-recipient-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cac.common.mail_configuration' | translate}}</div>\n" +
    "        <div class=\"form-check form-switch\">\n" +
    "            <input class=\"form-check-input\" style=\"width:3rem;height:1.4rem;cursor: pointer;float: right;margin-left: 10px;\" type=\"checkbox\" value=\"true\" ng-click=\"on_off()\" ng-model=\"vm.isTheEmailEnabled\"/>\n" +
    "<!--            <button title=\"自定义附件名称\" class=\"btn btn-outline-primary\" ng-click=\"vm.customContent()\" style=\"height: 24px;line-height: 10px;margin-top: 2px;\"><i-->\n" +
    "<!--                    class=\"fa fa-envelope\"></i>-->\n" +
    "<!--                自定义-->\n" +
    "<!--            </button>-->\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <udp-page-view class=\"flex-fill scroll-y\" page-id=\"'/cac/assets/udp/cac-email'\" page-source=\"file\"\n" +
    "                       uaa-has-permission=\"cac:view:*\"\n" +
    "                       uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "        </udp-page-view>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/email/email-recipient.html","<div class=\"h-100\" ui-view=\"email-view\" uaa-has-permission=\"cac:view:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/export/asset-model-export.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cac.export.title' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <div class=\"alert alert-success\" role=\"alert\">\n" +
    "            <button type=\"button\" class=\"btn-close pull-right\" data-dismiss=\"alert\"></button>\n" +
    "            <div>\n" +
    "                <h4><strong>{{'cac.export.info_msg' | translate}} </strong></h4>\n" +
    "                <div>{{'cac.export.info_msg_two' | translate}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-repeat=\"assetsModelType in vm.assetsModelTypes\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-header\" style=\"line-height: 30px;background-color: #d1e7dd;margin: -1px;\">\n" +
    "                    {{assetsModelType}}\n" +
    "                    <!--{{$index}}-->\n" +
    "                   <!-- {{'cac.export.model_title' | translate}}-->\n" +
    "                </div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-3\"  ng-repeat=\"assetModel in vm.assetsModelData[assetsModelType]\" style=\"margin-top: 5px;\">\n" +
    "                            <div class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                                <input type=\"checkbox\"\n" +
    "                                       ng-checked=\"assetModel.isChecked\"\n" +
    "                                       ng-click=\"vm.choice_data(assetModel)\" />\n" +
    "                                <label class=\"\">{{assetModel.title}}</label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/export/asset-model.html","<div class=\"h-100\" ui-view=\"config-view\" uaa-has-permission=\"cac:view:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/exports/asset-configure-export.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cac.export.title' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <div class=\"alert alert-success\" role=\"alert\">\n" +
    "            <button type=\"button\" class=\"btn-close pull-right\" data-dismiss=\"alert\"></button>\n" +
    "            <div>\n" +
    "                <h4><strong>{{'cac.export.info_msg' | translate}} </strong></h4>\n" +
    "                <div>{{'cac.export.info_msg_two' | translate}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-repeat=\"assetsModelType in vm.assetsModelTypes\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-header\" style=\"line-height: 30px;background-color: #d1e7dd;margin: -1px;\">\n" +
    "                    {{assetsModelType}}\n" +
    "                </div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-3\"  ng-repeat=\"assetModel in vm.assetsModelData[assetsModelType]\" style=\"margin-top: 5px;\">\n" +
    "                            <div class=\"checkbox checkbox-inline checkbox-primary \">\n" +
    "                                <input type=\"checkbox\"\n" +
    "                                       ng-checked=\"assetModel.isChecked\"\n" +
    "                                       ng-click=\"vm.choice_data(assetModel)\" style=\"cursor: pointer;\"/>\n" +
    "                                <label>{{assetModel.title}}</label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/exports/asset-configure.html","<div class=\"h-100\" ui-view=\"configure-view\" uaa-has-permission=\"cac:view:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/fix/fix-data-show.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        {{'cac.job.detail.status' | translate}}\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"fixDataShowControllerVm.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <opx-datatable table-config=\"fixDataShowControllerVm.tableConfig\">\n" +
    "    </opx-datatable>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" data-dismiss=\"modal\" ng-click=\"fixDataShowControllerVm.cancel()\">{{'common.entity.action.close' | translate}}</button>\n" +
    "</div>")

$templateCache.put("app/modules/cac/fix/fix-log-index.html","<div class=\"opx-layout-hflex cac-job-index\">\n" +
    "    <div class=\"opx-flex-fill scroll-x scroll-y\" ui-view=\"fixView\" xxstyle=\"overflow: auto\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/fix/fix-log-list.html","<div class=\"h-full\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cac.index.job' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <div class=\"p-3\">\n" +
    "        <opx-datatable table-config=\"cacFixLogListCtrlVm.tableConfig\"></opx-datatable>\n" +
    "    </div>\n" +
    "\n" +
    "</div>")

$templateCache.put("app/modules/cac/fix/fix-log-result.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        {{'cac.job.detail.status' | translate}}\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"cacFixLogResultVm.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <jao-job-result-view run-id=\"cacFixLogResultVm.runId\"></jao-job-result-view>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" data-dismiss=\"modal\" ng-click=\"cacFixLogResultVm.cancel()\">{{'common.entity.action.close' | translate}}</button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/host/host-edit.html","<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-=\"true\"\n" +
    "            ng-click=\"cacHostEditVm.views.cancel()\">\n" +
    "        &times;\n" +
    "    </button>\n" +
    "\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        {{cacHostEditVm.views.host.id == null ? (\"cac.host.create\" | translate) : (\"cac.host.edit\" | translate)}}\n" +
    "    </h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <form name=\"addHostForm \" class=\"form-horizontal\" enctype=\"multipart/form-data\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">{{'cac.host.name' | translate}}</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"cacHostEditVm.views.host.hostName\" required/>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">IP</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"cacHostEditVm.views.host.hostKey\" required/>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "<!--        <div class=\"form-group\">-->\n" +
    "<!--            <label class=\"col-sm-2 control-label\">主机用户</label>-->\n" +
    "<!--            <div class=\"col-sm-10\">-->\n" +
    "<!--                <input type=\"text\" class=\"form-control\" ng-model=\"cacHostEditVm.views.host.hostUser\"/>-->\n" +
    "<!--            </div>-->\n" +
    "<!--        </div>-->\n" +
    "        <!--  <div class=\"form-group\" ng-if=\"cacHostEditVm.views.host.id == null\">\n" +
    "            <label class=\"col-sm-2 control-label\">用户密码</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"cacHostEditVm.views.host.hostPassword\" required/>\n" +
    "            </div>\n" +
    "        </div>-->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">{{'common.term.category' | translate}}</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"cacHostEditVm.views.host.category\"/>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">{{'common.entity.detail.description' | translate}} </label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <textarea type=\"textarea\" class=\"form-control\" placeholder=\"\"\n" +
    "                          ng-model=\"cacHostEditVm.views.host.description\" row=\"5\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cacHostEditVm.views.cancel()\">{{'common.entity.action.cancel' | translate}}\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-success\" ng-click=\"cacHostEditVm.views.save()\"\n" +
    "            ng-disabled=\"addHostForm.$invalid\">{{'common.entity.action.save' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/host/host-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light bg-light\">\n" +
    "        <div class=\"navbar-item\">\n" +
    "            <button class=\"btn btn-primary btn-sm cac-title-button-l\" uaa-has-permission=\"cac:*:*\"\n" +
    "                    ng-click=\"cacHostListCtrlVm.views.addHost()\"><i class=\"fa fa-plus m-r-xs\"></i>{{'cac.host.create' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"ms-auto\">\n" +
    "            <!-- <input type=\"file\" style=\"display: none\" class=\"cac-host-file\" ngf-select ngf-change=\"cacHostListCtrlVm.views.uploadHostExcel()\">-->\n" +
    "            <!-- <input type=\"file\" style=\"display: none;\" class=\"emptyFile\" >-->\n" +
    "            <button id=\"uploadHostExcel\" type=\"file\" ngf-select\n" +
    "                    ngf-change=\"cacHostListCtrlVm.views.uploadHostExcel($file)\"\n" +
    "                    class=\"btn btn-default btn-sm\">\n" +
    "                <i class=\"fa fa-upload\"></i> {{'common.entity.action.import' | translate}}\n" +
    "            </button>\n" +
    "            <!--<a href=\"app/modules/cac/host/host-template.xlsx\">-->\n" +
    "            <!--<botton type=\"button\"-->\n" +
    "            <!--class=\"btn btn-default btn-sm\">-->\n" +
    "            <!--<i class=\"fa fa-download\"></i>模板下载-->\n" +
    "            <!--</botton>-->\n" +
    "            <!--</a>-->\n" +
    "            <button ng-click=\"cacHostListCtrlVm.views.exportHosts($event)\"\n" +
    "                    class=\"btn btn-default btn-sm\">\n" +
    "                <i class=\"fa fa-download\"></i> {{'common.entity.action.export' | translate}}\n" +
    "            </button>\n" +
    "            <!-- ng-click=\"cacHostListCtrlVm.views.clickUploadFileButton()\"-->\n" +
    "            <!--  <a href=\"#\" ng-click=\"cacRuleListCtrlVm.views.exportRules($event)\">\n" +
    "                  <button class=\"btn btn-default btn-sm\">\n" +
    "                      <i class=\"fa fa-download\"></i> 导出\n" +
    "                  </button>\n" +
    "              </a>-->\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill wrapper\">\n" +
    "        <!--        <div class=\"card card-default\">-->\n" +
    "        <!--            <div class=\"card-body\">-->\n" +
    "        <!--                <div class=\"table-responsive\">-->\n" +
    "        <table id=\"cacHostTable\"\n" +
    "               class=\"opx-table table host-table\"></table>\n" +
    "        <!--                </div>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </div>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/inspection/inspection-dynamic-selector.html","<div ng-if=\"$ctrl.threeCheckItemIds.length > 0\">\n" +
    "    <div class=\"d-flex flex-nowrap align-items-center\">\n" +
    "        <div class=\"btn btn-sm btn-default d-inline-block op-hover-trigger\" style=\"position:relative;width:10em;\">\n" +
    "            <span class=\"op-hover-to-show pull-right\" ng-click=\"$ctrl.emptyItems()\" title=\"{{'common.umd_config.move_all' | translate}}\" role=\"button\" tabindex=\"0\"><i class=\"fa fa-times\"></i></span>\n" +
    "            <span class=\"d-block\" ng-click=\"$ctrl.inspectionListCi()\" role=\"button\" tabindex=\"0\">{{ 'acm.common.selector.total' | translate}}<strong>{{$ctrl.threeCheckItemIds.length}}</strong>{{ 'acm.common.selector.item' | translate}}</span>\n" +
    "        </div>\n" +
    "        <op-searchbox search-text=\"$ctrl.filter\" class=\"ms-auto autohide\"></op-searchbox>\n" +
    "    </div>\n" +
    "    <ul class=\"list list-unstyled list-inline\" style=\"max-height:10rem; overflow-y:auto;\">\n" +
    "        <li ng-repeat=\"inspection in $ctrl.inspectionViewList | filter : $ctrl.myFilter\"\n" +
    "            class=\"op-hover-trigger mb-3\">\n" +
    "            <div class=\"badge bg-secondary op-text-normal op-cursor-default py-2 px-2\">\n" +
    "                {{inspection.name}}\n" +
    "                <a ng-click=\"$ctrl.removeItem(inspection.id)\" >&times;</a>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div ng-if=\"!$ctrl.threeCheckItemIds || $ctrl.threeCheckItemIds.length === 0\" __class=\"op-blank-slate bg-light p-3\">\n" +
    "    <button type=\"button\" class=\"btn btn-outline-default\" ng-click=\"$ctrl.inspectionListCi()\"><i\n" +
    "            class=\"fal fa-euro-sign\"></i> {{ 'cac3.title.patrolInspectionItems' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/inspection/inspection-edit.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"app.cac3.inspection.list({display:true})\">{{'cac3.navigation.patrol_item_list' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">{{vm.inspection.id == null ? (\"cac3.button.new_inspection_items\" | translate):\n" +
    "                    (\"cac3.button.edit_inspection_items\" | translate)}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div class=\"navbar-nav ms-auto\" uaa-has-permission=\"cac:edit:*\">\n" +
    "            <button type=\"button\" ng-disabled=\"editForm.$invalid || vm.isSaving\" ng-click=\"vm.save()\"\n" +
    "                    class=\"btn btn-primary opx-btn-ok\">{{'common.entity.action.save' | translate}}\n" +
    "            </button>\n" +
    "            <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" ng-click=\"vm.clear()\">\n" +
    "                {{'common.entity.action.back' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill scroll-y p-3\" uaa-has-permission=\"cac:edit:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "        <form name=\"editForm\" role=\"form\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'cac3.table_fields.patrol_item_name' | translate}} <span class=\"text-danger\">*</span></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" class=\"form-control\"\n" +
    "                           ng-model=\"vm.inspection.name\" required>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'common.entity.detail.description' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <textarea type=\"text\" class=\"form-control uneditable-input\"\n" +
    "                              ng-model=\"vm.inspection.description\">\n" +
    "                    </textarea>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'cac3.title.manualInspection' | translate}}</label>\n" +
    "                <div class=\"form-control\">\n" +
    "                    <label class=\"radio-inline\">\n" +
    "                        <input type=\"radio\" name=\"needCheck\" ng-value=\"1\" ng-model=\"vm.inspection.needCheck\" >\n" +
    "                        <span>{{'cac3.title.yes' | translate}}</span>\n" +
    "                    </label>\n" +
    "                    <label class=\"radio-inline\">\n" +
    "                        <input type=\"radio\" name=\"needCheck\" ng-value=\"0\" ng-model=\"vm.inspection.needCheck\">\n" +
    "                        <span>{{'cac3.title.no' | translate}}</span>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"card-body mb-5\" ng-repeat=\"item in vm.views.auditParams\" style=\"border: 1px solid #ced4da;\">\n" +
    "                <div class=\"form-group op-align-horizontal\">\n" +
    "                    <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'cac3.title.patrolScript' | translate}} <span class=\"text-danger\">*</span></label>\n" +
    "                    <gfs-file-selector the-model=\"item.inspectionScripts\" class=\"w-full\"\n" +
    "                                       model-converter=\"{type: 'attrmap', attrmap: {'scriptPath': 'path', 'scriptParams': 'config'}, modelType: 'array'}\"\n" +
    "                                       config=\"vm.views.fileSelectorConfigCheck\"></gfs-file-selector>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group op-align-horizontal\">\n" +
    "                    <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'cac3.title.fixScript' | translate}}</label>\n" +
    "                    <gfs-file-selector the-model=\"item.repairScripts\" class=\"w-full\"\n" +
    "                                       model-converter=\"{type: 'attrmap', attrmap: {'scriptPath': 'path', 'scriptParams': 'config'}, modelType: 'array'}\"\n" +
    "                                       config=\"vm.views.fileSelectorConfigFix\"></gfs-file-selector>\n" +
    "                </div>\n" +
    "                <div class=\"form-group op-align-horizontal\">\n" +
    "                    <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\"><i class=\"fa fa-laptop\"></i> {{'cac3.title.whiteList' | translate}}</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <div class=\"w-full\">\n" +
    "                            <div class=\"mt-3\">\n" +
    "                                <acm-device-selector the-model=\"item.hosts\" ci-types=\"'[auto]'\" mcheck-type=\"'map'\"></acm-device-selector>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/inspection/inspection-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cac3.navigation.patrol_item_list' | translate}}</div>\n" +
    "        <div class=\"navbar-nav ms-auto\" uaa-has-permission=\"cac:edit:*\">\n" +
    "            <a href=\"#\" ng-click=\"vm.downloadTemplate($event)\">\n" +
    "                <button class=\"btn btn-secondary\">\n" +
    "                    <i class=\"fa fa-download\"></i> {{'cac3.button.template_download' | translate}}\n" +
    "                </button>\n" +
    "            </a>\n" +
    "            <a href=\"javascript:;\" ng-click=\"vm.exportInspectionItems($event)\">\n" +
    "                <button class=\"btn btn-success\">\n" +
    "                    <i class=\"fa fa-file-import\"></i> {{'cac3.button.export_inspection_items' | translate}}\n" +
    "                </button>\n" +
    "            </a>\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"vm.importInspection()\">\n" +
    "                <i class=\"fa fa-file-upload\"></i> {{'cac3.button.import_patrol_items' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <opx-datatable table-config=\"vm.tableConfig\">\n" +
    "            <button class=\"btn btn-primary\"\n" +
    "                    ui-sref=\"app.cac3.inspection.add\"><i class=\"fa fa-plus\"></i> {{'cac3.button.new_inspection_items' | translate}}\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/inspection/inspection-run.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myParamLabel\">\n" +
    "        {{'cac3.button.runInspection' | translate}}\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" ng-click=\"$ctrl.clear()\"></button>\n" +
    "</div>\n" +
    "\n" +
    "<form name=\"editForm\" role=\"form\" show-validation>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <div class=\"w-full\">\n" +
    "                <acm-device-selector the-model=\"$ctrl.hostList\" ci-types=\"'[auto]'\" mcheck-type=\"'map'\" is-selected=\"true\"></acm-device-selector>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary opx-btn-ok\" ng-click=\"$ctrl.runJob()\">\n" +
    "            {{'cac3.table_fields.performSinglePatrolInspection' | translate}}\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" data-dismiss=\"modal\" ng-click=\"$ctrl.clear()\">{{'cmd.job.button_cancel' | translate}}</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/cac/inspection/inspection-upload.html","<form  name=\"uploadForm\" enctype=\"multipart/form-data\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4 class=\"modal-title\" id=\"myUploadLabel\" >{{'cac3.button.bulkImport' | translate}}</h4>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group\" >\n" +
    "                <div class=\"col-sm-9\">\n" +
    "                    <div class=\"pull-right\" ngf-select ng-model=\"file\" name=\"file\"  multiple>\n" +
    "                        <button style=\"padding-top: 2px;padding-bottom: 2px\" type=\"button\" class=\"btn btn-success\"><i class=\"fa fa-plus\"></i></button>\n" +
    "                    </div>\n" +
    "                    <div class=\"pull-right\" style=\"width: 80%\">\n" +
    "                        <span>{{'cac3.title.fileName' | translate}}:</span>\n" +
    "                        <input type=\"text\" style=\"width: 90%\" placeholder=\"{{'cac3.title.pleaseSelectFile' | translate}}\"\n" +
    "                               name=\"name\" ng-model=\"$ctrl.fileName.name\" required/>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"$ctrl.cancel()\" >\n" +
    "            <i class=\"fa fa-reply\"></i>{{'common.action.back' | translate}}\n" +
    "        </button>\n" +
    "        <button type=\"button\" ng-disabled=\"uploadForm.$invalid\" class=\"btn btn-primary\" ng-click=\"submit()\">\n" +
    "            <i class=\"fa fa-file-import\"></i>{{'common.action.import' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/cac/inspection/inspection.html","<div class=\"h-100\" ui-view=\"inspection-view\" uaa-has-permission=\"cac:view:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/job/job-index.html","<div class=\"opx-layout-hflex cac-job-index\">\n" +
    "    <div class=\"opx-sidebar border-right bg-light\">\n" +
    "        <nav class=\"opx-sidebar-header border-bottom\">\n" +
    "            <input type=\"text\" class=\"form-control xtemplate-filter\"\n" +
    "                   ng-model=\"cacJobCtrlVm.views.templateName\">\n" +
    "            <div class=\"dropdown\">\n" +
    "                <button type=\"button\" class=\"btn dropdown-toggle\" data-bs-toggle=\"dropdown\">\n" +
    "                    <i class=\"fa fa-sort\" aria-hidden=\"true\"></i>\n" +
    "                    <!--<span class=\"caret\"></span>-->\n" +
    "                </button>\n" +
    "                <div class=\"dropdown-menu dropdown-menu-end\">\n" +
    "                    <a class=\"dropdown-item\"\n" +
    "                       ng-click=\"cacJobCtrlVm.views.changeTemplateOrder('-templateName')\">{{'cac.job.order.name_down' | translate}}\n" +
    "                        <span style=\"float: right;padding-top: 4px\" class=\"fa fa-check\"\n" +
    "                              ng-if=\"cacJobCtrlVm.views.templateOrder == '-templateName'\"></span>\n" +
    "                    </a>\n" +
    "                    <a class=\"dropdown-item\"\n" +
    "                       ng-click=\"cacJobCtrlVm.views.changeTemplateOrder('templateName')\">{{'cac.job.order.name_up' | translate}}\n" +
    "                        <span style=\"float: right;padding-top: 4px\" class=\"fa fa-check\"\n" +
    "                              ng-if=\"cacJobCtrlVm.views.templateOrder == 'templateName'\"></span>\n" +
    "                    </a>\n" +
    "                    <a class=\"dropdown-item\"\n" +
    "                       ng-click=\"cacJobCtrlVm.views.changeTemplateOrder('executedAt')\">{{'cac.job.order.execute_at_up' | translate}}\n" +
    "                        <span style=\"float: right;padding-top: 4px\" class=\"fa fa-check\"\n" +
    "                              ng-if=\"cacJobCtrlVm.views.templateOrder == 'executedAt'\"></span>\n" +
    "                    </a>\n" +
    "                    <a class=\"dropdown-item\"\n" +
    "                       ng-click=\"cacJobCtrlVm.views.changeTemplateOrder('-executedAt')\">{{'cac.job.order.execute_at_down' | translate}}\n" +
    "                        <span style=\"float: right;padding-top: 4px\" class=\"fa fa-check\"\n" +
    "                              ng-if=\"cacJobCtrlVm.views.templateOrder == '-executedAt'\"></span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--<button style=\"width: 50px;\" class=\"btn btn-default btn-sm\" ng-click=\"cacJobCtrlVm.views.templateOrderEdit()\"> 排序</button>-->\n" +
    "        </nav>\n" +
    "        <div class=\"opx-flex-fill scroll-y\">\n" +
    "            <div class=\"opx-treenav\">\n" +
    "                <!--<li style=\"padding-left: 8px;top: 6px;padding-right: 8px\">-->\n" +
    "                <!--<label style=\"width: 100%\">-->\n" +
    "                <!--<input type=\"search\" class=\"form-control template-filter\"-->\n" +
    "                <!--ng-model=\"cacJobCtrlVm.views.templateName\">-->\n" +
    "                <!--</label>-->\n" +
    "                <!--</li>-->\n" +
    "                <a class=\"opx-treenav-item\"\n" +
    "                   ui-sref-active=\"active\"\n" +
    "                   ui-sref=\"app.cac.job.list({templateId:''})\"\n" +
    "                   ng-click=\"cacJobCtrlVm.views.clearFilter()\">\n" +
    "                    <i class=\"fa fa-list-alt\"></i>\n" +
    "                    {{'common.term.all' | translate}}\n" +
    "                </a>\n" +
    "                <a class=\"opx-treenav-item\"\n" +
    "                   ng-repeat=\"item in cacJobCtrlVm.views.templateList | filter:{templateName:cacJobCtrlVm.views.templateName} | orderBy: cacJobCtrlVm.views.templateOrder\"\n" +
    "                   ui-sref-active=\"active\"\n" +
    "                   ui-sref=\"app.cac.job.list({templateId:'{{item.id}}'})\">\n" +
    "                    {{item.templateName}}\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"op-blank-slate\"\n" +
    "                 ng-if=cacJobCtrlVm.views.templateList==null||cacJobCtrlVm.views.templateList.length==0>\n" +
    "                <div style=\"padding-top: 20px\"><i class=\"fa fa-cog fa-spin\"></i> {{'common.entity.loading' | translate}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill scroll-x scroll-y\" ui-view=\"jobList\" xxstyle=\"overflow: auto\">\n" +
    "        <!-- <div class=\"card card-default\" ng-controller=\"CacJobListCtrl as cacJobListCtrlVm\">\n" +
    "             <div class=\"card-header\" hidden>\n" +
    "                 <div class=\"card-title\">\n" +
    "                     <span hidden>模板执行历史记录</span>\n" +
    "                     &lt;!&ndash;<button class=\"btn btn-default btn-sm pull-right\" ui-sref=\"app.cac.job.addJob\"><i class=\"fa fa-plus m-r-xs\"></i> 新增任务</button>&ndash;&gt;\n" +
    "                 </div>\n" +
    "             </div>\n" +
    "             <div class=\"card-body\">\n" +
    "                 <div class=\"table-responsive\">\n" +
    "                     <table id=\"cacJobTable\"\n" +
    "                            class=\"job-table table table-striped table-hover table-bordered cac-table-line-height\"></table>\n" +
    "                 </div>\n" +
    "             </div>\n" +
    "         </div>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/job/job-list.html","<!--<style type=\"text/css\">-->\n" +
    "<!--@keyframes rotating{-->\n" +
    "<!--    from{transform:rotate(0)}-->\n" +
    "<!--    to{transform:rotate(360deg)}-->\n" +
    "<!--}-->\n" +
    "<!--.icon-spining {animation:rotating 1.2s linear infinite}-->\n" +
    "\n" +
    "<!--</style>-->\n" +
    "<div class=\"h-full\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cac.index.job' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <!--    <div class=\"card card-default\">-->\n" +
    "    <!--<div class=\"card-header\" hidden>-->\n" +
    "    <!--<div class=\"card-title\">-->\n" +
    "    <!--<span hidden>任务列表</span>-->\n" +
    "    <!--<button class=\"btn btn-default btn-sm pull-right\" ui-sref=\"app.cac.job.addJob\"><i class=\"fa fa-plus m-r-xs\"></i> 新增任务</button>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <div class=\"p-3\">\n" +
    "        <opx-datatable table-config=\"cacJobListCtrlVm.tableConfig\"></opx-datatable>\n" +
    "    </div>\n" +
    "    <!--    <div class=\"table-responsive\">-->\n" +
    "    <!--        <table id=\"cacJobTable\" class=\"table opx-table\"></table>-->\n" +
    "    <!--    </div>-->\n" +
    "    <!--    <div class=\"op-blank-slate\" ng-if=cacJobListCtrlVm.views.tableInstance==null>-->\n" +
    "    <!--        &lt;!&ndash;<i class=\"fa fa-cog fa-spin\"></i><p class=\"op-blank-slate-body\">正在加载数据...</p>&ndash;&gt;-->\n" +
    "    <!--        <div class=\"op-blank-slate-icon\"><i class=\"fa fa-cog fa-spin fa-4x\"></i></div>-->\n" +
    "    <!--        <p>正在加载数据...</p>-->\n" +
    "    <!--    </div>-->\n" +
    "\n" +
    "\n" +
    "</div>")

$templateCache.put("app/modules/cac/job/job-run-log.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        {{'cac.job.detail.status' | translate}}\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"cacJobRunLogVm.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <jao-job-result-view run-id=\"cacJobRunLogVm.runId\"></jao-job-result-view>\n" +
    "<!--    <p class=\"mb-3\">作业ID :<span class=\"badge bg-secondary ms-5\">{{cacJobRunLogVm.views.job.taskId || '无法获取'}}</span></p>-->\n" +
    "\n" +
    "<!--    <div class=\"op-blank-slate\" ng-show=\"!cacJobRunLogVm.views.isResult\">-->\n" +
    "<!--        <div class=\"op-blank-slate-icon\"><i class=\"fa fa-inbox fa-4x\"></i></div>-->\n" +
    "<!--        <p>无日志</p>-->\n" +
    "<!--    </div>-->\n" +
    "<!--    <jao-ansible-output contents=\"cacJobRunLogVm.views.job.jsonResult\" ng-if=\"cacJobRunLogVm.views.isResult\" style=\"display: block;height: 450px;\"></jao-ansible-output>-->\n" +
    "<!--    &lt;!&ndash;<pre class=\"cac-job-result-pre\" ng-if=\"!cacJobRunLogVm.views.isResult\">{{cacJobRunLogVm.views.isResult}}</pre>&ndash;&gt;-->\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" data-dismiss=\"modal\" ng-click=\"cacJobRunLogVm.cancel()\">{{'common.entity.action.close' | translate}}</button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/job/job-run.html","<div class=\"opx-layout-vflex scriptTableDiv\" uaa-has-permission=\"cac:run:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <nav class=\"navbar bg-light\">\n" +
    "        {{'cac.template.run' | translate}}\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill scroll-y p-3\">\n" +
    "        <!--        <div class=\"job-form\">-->\n" +
    "        <form class=\"form-horizontal\" name=\"jobForm\">\n" +
    "            <div ng-include=\"'app/modules/cac/template/template-edit-content.html'\"\n" +
    "                 ng-controller=\"CacEditTemplateCtrl as cacEditTemplateCtrlVm\"></div>\n" +
    "            <!--<div class=\"form-group\">-->\n" +
    "            <!--<label class=\"col-sm-2 control-label cac-control-label\">任务描述</label>-->\n" +
    "            <!--<div class=\"col-sm-10\">-->\n" +
    "            <!--<textarea type=\"text\" class=\"form-control\" rows=\"3\"-->\n" +
    "            <!--ng-model=\"cacJobRunCtrlVm.views.job.description\"></textarea>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--<div class=\"form-group\">\n" +
    "                <div class=\"col-sm-offset-1 col-sm-11\">\n" +
    "                    <p ng-show=\"true\" class=\"cac-text-required\">{{cacJobRunCtrlVm.views.info}}</p>\n" +
    "                </div>\n" +
    "            </div>-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary cac-job-run-btn\" ng-click=\"cacJobRunCtrlVm.views.run()\"\n" +
    "                        ng-disabled=\"jobForm.$invalid\" data-loading-text=\"{{'cac.messages.running' | translate}}\"><i class=\"fa fa-play\"></i> {{'cac.template.run' | translate}}\n" +
    "                </button>\n" +
    "                <button type=\"cancel\" class=\"btn btn-default\" ng-click=\"cacJobRunCtrlVm.views.back()\">{{'common.entity.action.back' | translate}}</button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <!--    </div>-->\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/log/check-log-index.html","<div class=\"opx-layout-hflex cac-job-index\">\n" +
    "    <div class=\"opx-sidebar border-right bg-light\">\n" +
    "        <nav class=\"opx-sidebar-header border-bottom\">\n" +
    "            <input type=\"text\" class=\"form-control xtemplate-filter\"\n" +
    "                   ng-model=\"cacCheckLogCtrlVm.views.name\">\n" +
    "            <div class=\"dropdown\">\n" +
    "                <button type=\"button\" class=\"btn dropdown-toggle\" data-bs-toggle=\"dropdown\">\n" +
    "                    <i class=\"fa fa-sort\" aria-hidden=\"true\"></i>\n" +
    "                </button>\n" +
    "                <div class=\"dropdown-menu dropdown-menu-end\">\n" +
    "                    <a class=\"dropdown-item\"\n" +
    "                       ng-click=\"cacCheckLogCtrlVm.views.changeTemplateOrder('-name')\">{{'cac.job.order.name_down' |\n" +
    "                        translate}}\n" +
    "                        <span style=\"float: right;padding-top: 4px\" class=\"fa fa-check\"\n" +
    "                              ng-if=\"cacCheckLogCtrlVm.views.templateOrder == '-name'\"></span>\n" +
    "                    </a>\n" +
    "                    <a class=\"dropdown-item\"\n" +
    "                       ng-click=\"cacCheckLogCtrlVm.views.changeTemplateOrder('name')\">{{'cac.job.order.name_up' |\n" +
    "                        translate}}\n" +
    "                        <span style=\"float: right;padding-top: 4px\" class=\"fa fa-check\"\n" +
    "                              ng-if=\"cacCheckLogCtrlVm.views.templateOrder == 'name'\"></span>\n" +
    "                    </a>\n" +
    "                    <a class=\"dropdown-item\"\n" +
    "                       ng-click=\"cacCheckLogCtrlVm.views.changeTemplateOrder('executedAt')\">{{'cac.job.order.execute_at_up'\n" +
    "                        | translate}}\n" +
    "                        <span style=\"float: right;padding-top: 4px\" class=\"fa fa-check\"\n" +
    "                              ng-if=\"cacCheckLogCtrlVm.views.templateOrder == 'executedAt'\"></span>\n" +
    "                    </a>\n" +
    "                    <a class=\"dropdown-item\"\n" +
    "                       ng-click=\"cacCheckLogCtrlVm.views.changeTemplateOrder('-executedAt')\">{{'cac.job.order.execute_at_down'\n" +
    "                        | translate}}\n" +
    "                        <span style=\"float: right;padding-top: 4px\" class=\"fa fa-check\"\n" +
    "                              ng-if=\"cacCheckLogCtrlVm.views.templateOrder == '-executedAt'\"></span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </nav>\n" +
    "        <div class=\"opx-flex-fill scroll-y\">\n" +
    "            <div class=\"opx-treenav\">\n" +
    "                <a class=\"opx-treenav-item\"\n" +
    "                   ui-sref-active=\"active\"\n" +
    "                   ui-sref=\"app.cac3.check_log.list({templateId:''})\"\n" +
    "                   ng-click=\"cacCheckLogCtrlVm.views.clearFilter()\">\n" +
    "                    <i class=\"fa fa-list-alt\"></i>\n" +
    "                    {{'common.term.all' | translate}}\n" +
    "                </a>\n" +
    "                <a class=\"opx-treenav-item\"\n" +
    "                   ui-sref=\"app.cac3.check_log.list({templateId:'inspection_all'})\"\n" +
    "                   ui-sref-active=\"active\"\n" +
    "                   ng-click=\"cacCheckLogCtrlVm.views.clearFilter()\">\n" +
    "                    <i class=\"fa fa-list-alt\"></i>\n" +
    "                    {{'cac3.title.patrolInspectionItems' | translate}}\n" +
    "                </a>\n" +
    "                <a class=\"opx-treenav-item\"\n" +
    "                   ng-repeat=\"item in cacCheckLogCtrlVm.views.templateList | filter:{name:cacCheckLogCtrlVm.views.name} | orderBy: cacCheckLogCtrlVm.views.templateOrder\"\n" +
    "                   ui-sref-active=\"active\"\n" +
    "                   ui-sref=\"app.cac3.check_log.list({templateId:'{{item.id}}'})\">\n" +
    "                    {{item.name}}\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"op-blank-slate\"\n" +
    "                 ng-if=cacCheckLogCtrlVm.views.templateList==null||cacCheckLogCtrlVm.views.templateList.length==0>\n" +
    "                <div style=\"padding-top: 20px\"><i class=\"fa fa-cog fa-spin\"></i> {{'common.entity.loading' | translate}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill scroll-x scroll-y\" ui-view=\"checkView\" xxstyle=\"overflow: auto\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/log/check-log-list.html","<div class=\"h-full\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cac.index.job' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <div class=\"p-3\">\n" +
    "        <opx-datatable table-config=\"cacCheckLogListCtrlVm.tableConfig\"></opx-datatable>\n" +
    "    </div>\n" +
    "\n" +
    "</div>")

$templateCache.put("app/modules/cac/log/check-log-result.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        {{'cac.job.detail.status' | translate}}\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"cacCheckLogResultVm.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <jao-job-result-view run-id=\"cacCheckLogResultVm.runId\"></jao-job-result-view>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" data-dismiss=\"modal\" ng-click=\"cacCheckLogResultVm.cancel()\">{{'common.entity.action.close' | translate}}</button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/result/check-white-list.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        <span>{{ 'cac.profile.white_list' | translate}}</span>\n" +
    "        <!--<span>\n" +
    "            <a type=\"button\" class=\"btn-close\" style=\"margin: 10px;float: right;\" data-dismiss=\"modal\" ng-click=\"$ctrl.cancel()\"></a>\n" +
    "        </span>-->\n" +
    "    </h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <opx-datatable table-config=\"tableConfig\">\n" +
    "    </opx-datatable>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"$ctrl.cancel()\" >\n" +
    "        <span class=\"fa fa-arrow-left\">{{'common.entity.action.back' | translate}}</span>\n" +
    "    </button>\n" +
    "</div>")

$templateCache.put("app/modules/cac/result/data-driven.html","<div class=\"container\" id=\"container\" style=\"height: 100%;\">\n" +
    "    <div id=\"D3svg\" style=\"height: 100%;\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<script>\n" +
    "    var container;\n" +
    "    var zoom;\n" +
    "    var rootData;\n" +
    "    var depthInfo;\n" +
    "    var rootName; //根节点名称\n" +
    "\n" +
    "    jQuery(document).ready(function () {\n" +
    "        var child = document.getElementById(\"D3svg\");\n" +
    "        child.innerHTML = '';\n" +
    "        getData();\n" +
    "    });\n" +
    "\n" +
    "    function getData() {\n" +
    "        rootData = {\n" +
    "            \"downward\": {\n" +
    "                \"direction\": \"downward\",\n" +
    "                \"name\": \"origin\",\n" +
    "                \"children\": [{\n" +
    "                    \"name\": \"业务系统A\",\n" +
    "                    \"amount\": \"100\",\n" +
    "                    \"hasHumanholding\": true,\n" +
    "                    \"hasChildren\": true,\n" +
    "                    \"isExpand\": true,\n" +
    "                    \"children\": [{\n" +
    "                        \"name\": \"公司1-1\",\n" +
    "                        \"hasHumanholding\": false,\n" +
    "                        \"hasChildren\": true,\n" +
    "                        \"amount\": \"100\",\n" +
    "                        \"children\": []\n" +
    "                    },\n" +
    "                        {\n" +
    "                            \"name\": \"公司1-2\",\n" +
    "                            \"hasHumanholding\": false,\n" +
    "                            \"hasChildren\": true,\n" +
    "                            \"amount\": \"100\",\n" +
    "                            \"children\": []\n" +
    "                        },\n" +
    "                        {\n" +
    "                            \"name\": \"公司1-3测试数据测试长度\",\n" +
    "                            \"hasHumanholding\": false,\n" +
    "                            \"hasChildren\": true,\n" +
    "                            \"amount\": \"100\",\n" +
    "                            \"children\": []\n" +
    "                        }\n" +
    "                    ]\n" +
    "                },\n" +
    "                    {\n" +
    "                        \"name\": \"业务系统B\",\n" +
    "                        \"amount\": \"100\",\n" +
    "                        \"hasHumanholding\": true,\n" +
    "                        \"hasChildren\": true,\n" +
    "                        \"isExpand\": true,\n" +
    "                        \"children\": [{\n" +
    "                            \"name\": \"公司2-1\",\n" +
    "                            \"hasHumanholding\": false,\n" +
    "                            \"hasChildren\": true,\n" +
    "                            \"amount\": \"100\",\n" +
    "                            \"children\": []\n" +
    "                        },\n" +
    "                            {\n" +
    "                                \"name\": \"公司2-2\",\n" +
    "                                \"hasHumanholding\": false,\n" +
    "                                \"hasChildren\": true,\n" +
    "                                \"amount\": \"100\",\n" +
    "                                \"children\": []\n" +
    "                            }\n" +
    "                        ]\n" +
    "                    },\n" +
    "                    {\n" +
    "                        \"name\": \"业务系统C\",\n" +
    "                        \"amount\": \"100\",\n" +
    "                        \"hasHumanholding\": true,\n" +
    "                        \"hasChildren\": true,\n" +
    "                        \"isExpand\": true,\n" +
    "                        \"children\": [{\n" +
    "                            \"name\": \"公司3-1\",\n" +
    "                            \"hasHumanholding\": false,\n" +
    "                            \"hasChildren\": true,\n" +
    "                            \"amount\": \"100\",\n" +
    "                            \"children\": []\n" +
    "                        },\n" +
    "                            {\n" +
    "                                \"name\": \"公司3-2\",\n" +
    "                                \"hasHumanholding\": false,\n" +
    "                                \"hasChildren\": true,\n" +
    "                                \"amount\": \"100\",\n" +
    "                                \"children\": []\n" +
    "                            }\n" +
    "                        ]\n" +
    "                    }\n" +
    "                ]\n" +
    "            },\n" +
    "        }\n" +
    "        rootName = 'RHEL系统基础巡检';\n" +
    "        drawing();\n" +
    "    };\n" +
    "    function drawing() {\n" +
    "        var _this = this;\n" +
    "        var rootRectWidth = 0; //根节点rect的宽度\n" +
    "        var downwardLength = 0,\n" +
    "            upwardLength = 0;\n" +
    "        var forUpward = true\n" +
    "\n" +
    "        var treeChart = function (d3Object) {\n" +
    "            this.d3 = d3Object;\n" +
    "            this.directions = ['downward'];\n" +
    "        };\n" +
    "\n" +
    "\n" +
    "        treeChart.prototype.drawChart = function () {\n" +
    "            // First get tree data for both directions.\n" +
    "            this.treeData = {};\n" +
    "            var that = this;\n" +
    "            that.directions.forEach(function (direction) {\n" +
    "                that.treeData[direction] = _this.rootData[direction];\n" +
    "            });\n" +
    "            // rootName = 'RHEL系统基础巡检';\n" +
    "            rootRectWidth = _this.rootName.length * 15;\n" +
    "            //获得downward第一级节点的个数\n" +
    "            downwardLength = _this.rootData.downward.children.length;\n" +
    "            that.graphTree(that.getTreeConfig());\n" +
    "        };\n" +
    "\n" +
    "        treeChart.prototype.getTreeConfig = function () {\n" +
    "            var treeConfig = {\n" +
    "                'margin': {\n" +
    "                    'top': 10,\n" +
    "                    'right': 5,\n" +
    "                    'bottom': 0,\n" +
    "                    'left': 30\n" +
    "                }\n" +
    "            }\n" +
    "\n" +
    "            treeConfig.centralHeight = 100; //高度间距\n" +
    "            treeConfig.centralWidth = 700;//宽度间距\n" +
    "            treeConfig.linkLength = 120;\n" +
    "            treeConfig.duration = 500; //动画时间\n" +
    "            return treeConfig;\n" +
    "        };\n" +
    "\n" +
    "        treeChart.prototype.graphTree = function (config) {\n" +
    "            var that = this;\n" +
    "            var d3 = this.d3;\n" +
    "            var linkLength = config.linkLength;\n" +
    "            var duration = config.duration;\n" +
    "            var hasChildNodeArr = [];\n" +
    "            var id = 0;\n" +
    "\n" +
    "            //折线\n" +
    "            var diagonal = function (obj) {\n" +
    "                var s = obj.source;\n" +
    "                var t = obj.target;\n" +
    "                return (\n" +
    "                    \"M\" +\n" +
    "                    s.x +\n" +
    "                    \",\" +\n" +
    "                    s.y +\n" +
    "                    \"L\" +\n" +
    "                    s.x +\n" +
    "                    \",\" +\n" +
    "                    (s.y + (t.y - s.y) / 2) +\n" +
    "                    \"L\" +\n" +
    "                    t.x +\n" +
    "                    \",\" +\n" +
    "                    (s.y + (t.y - s.y) / 2) +\n" +
    "                    \"L\" +\n" +
    "                    t.x +\n" +
    "                    \",\" +\n" +
    "                    t.y\n" +
    "                );\n" +
    "            }\n" +
    "\n" +
    "            var zoom = d3_old.behavior.zoom()\n" +
    "                .scaleExtent([0.5, 2])\n" +
    "                .on('zoom', redraw);\n" +
    "            var svg = d3_old.select('#D3svg')\n" +
    "                .append('svg')\n" +
    "                .attr('width', '100%')\n" +
    "                .attr('height', '100%')\n" +
    "                .on('mousedown', disableRightClick)\n" +
    "                .call(zoom)\n" +
    "                .on('dblclick.zoom', null);\n" +
    "            var treeG = svg.append('g')\n" +
    "                .attr('class', 'gbox')\n" +
    "                .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');\n" +
    "\n" +
    "            //箭头(下半部分)\n" +
    "            var markerDown = svg.append(\"marker\")\n" +
    "                .attr(\"id\", \"resolvedDown\")\n" +
    "                .attr(\"markerUnits\", \"strokeWidth\") //设置为strokeWidth箭头会随着线的粗细发生变化\n" +
    "                .attr(\"markerUnits\", \"userSpaceOnUse\")\n" +
    "                .attr(\"viewBox\", \"0 0 12 12\") //坐标系的区域\n" +
    "                .attr(\"refX\", 30) //箭头坐标\n" +
    "                .attr(\"refY\", 6)\n" +
    "                .attr(\"markerWidth\", 12) //标识的大小\n" +
    "                .attr(\"markerHeight\", 12)\n" +
    "                .attr(\"orient\", \"90\") //绘制方向，可设定为：auto（自动确认方向）和 角度值\n" +
    "                .attr(\"stroke-width\", 2) //箭头宽度\n" +
    "                .append(\"path\")\n" +
    "\n" +
    "                .attr(\"d\", \"M2,2 L12,6 L2,10 L4,6 L2,2\") //箭头的路径\n" +
    "                .attr('fill', '#000'); //箭头颜色\n" +
    "\n" +
    "\n" +
    "\n" +
    "            // Initialize the tree nodes and update chart.\n" +
    "            for (var d in this.directions) {\n" +
    "                var direction = this.directions[d];\n" +
    "                var data = that.treeData[direction];\n" +
    "                data.x0 = config.centralWidth;\n" +
    "                data.y0 = config.centralHeight;\n" +
    "                data.children.forEach(collapse);\n" +
    "                update(data, data, treeG);\n" +
    "            }\n" +
    "\n" +
    "            function update(source, originalData, g) {\n" +
    "                console.log('source', source)\n" +
    "                console.log('originalData', originalData)\n" +
    "\n" +
    "                var direction = originalData['direction'];\n" +
    "                forUpward = direction == 'upward';\n" +
    "                var node_class = direction + 'Node';\n" +
    "                var link_class = direction + 'Link';\n" +
    "                var downwardSign = (forUpward) ? -1 : 1;\n" +
    "                var nodeColor = (forUpward) ? '#37592b' : '#51a56e';\n" +
    "\n" +
    "                var isExpand = true;\n" +
    "                var statusUp = true;\n" +
    "                var statusDown = true;\n" +
    "                var nodeSpace = 80;\n" +
    "                var tree = d3_old.layout.tree().sort(sortByDate).nodeSize([nodeSpace, 0]);\n" +
    "                var nodes = tree.nodes(originalData);\n" +
    "                var links = tree.links(nodes);\n" +
    "                var offsetX = -config.centralWidth;\n" +
    "\n" +
    "                nodes.forEach(function (d) {\n" +
    "                    d.y = downwardSign * (d.depth * linkLength) + config.centralHeight;\n" +
    "                    d.x = d.x - offsetX;\n" +
    "                    if (d.name == 'origin') {\n" +
    "                        d.x = config.centralWidth;\n" +
    "                        d.y += downwardSign * 0; // 上下两树图根节点之间的距离\n" +
    "                    }\n" +
    "                });\n" +
    "\n" +
    "                // Update the node.\n" +
    "                var node = g.selectAll('g.' + node_class)\n" +
    "                    .data(nodes, function (d) {\n" +
    "                        return d.id || (d.id = ++id);\n" +
    "                    });\n" +
    "                var nodeEnter = node.enter().append('g')\n" +
    "                    .attr('class', node_class)\n" +
    "                    .attr('transform', function (d) {\n" +
    "                        return 'translate(' + source.x0 + ',' + source.y0 + ')';\n" +
    "                    })\n" +
    "                    .style('cursor', function (d) {\n" +
    "                        return (d.name == 'origin') ? '' : (d.children || d._children) ? 'pointer' : '';\n" +
    "                    });\n" +
    "                // .on('click', click);\n" +
    "\n" +
    "\n" +
    "                nodeEnter.append(\"svg:rect\")\n" +
    "                    .attr(\"x\", function (d) {\n" +
    "                        return (d.name == 'origin') ? -(rootRectWidth / 2) : -60;\n" +
    "                    })\n" +
    "                    .attr(\"y\", function (d) {\n" +
    "                        return (d.name == 'origin') ? -20 : forUpward ? -52 : 2;\n" +
    "                    })\n" +
    "                    .attr(\"width\", function (d) {\n" +
    "                        return (d.name == 'origin') ? rootRectWidth : (d.depth === 1) ? 120 : 30;\n" +
    "                        //return (d.name == 'origin') ? rootRectWidth : 120;\n" +
    "                    })\n" +
    "                    .attr(\"height\", function (d) {\n" +
    "                        return d.depth === 2 ? 160 : 40;\n" +
    "                    })\n" +
    "                    .attr(\"rx\", 5)\n" +
    "                    .style(\"stroke\", function (d) {\n" +
    "                        return (d.name == 'origin') ? \"#51a56e\" : \"#CCC\";\n" +
    "                    })\n" +
    "                    .style(\"fill\", function (d) {\n" +
    "                        return (d.name == 'origin') ? \"#51a56e\" : \"#FFF\"; //节点背景色\n" +
    "                    });\n" +
    "\n" +
    "                nodeEnter.append('circle')\n" +
    "                    .attr('r', 1e-6);\n" +
    "\n" +
    "                nodeEnter.append(\"text\")\n" +
    "                    .attr(\"class\", \"linkname\")\n" +
    "                    .attr(\"x\", function (d) {\n" +
    "                        return (d.name == 'origin') ? '0' : \"-55\";\n" +
    "                    })\n" +
    "                    .attr('dy', function (d) {//11 todo\n" +
    "                        if (d.name == 'origin') {\n" +
    "                            return '.35em'\n" +
    "                        } else if (forUpward) {\n" +
    "                            return '-40'\n" +
    "                        } else if (d.name.length < 11) {\n" +
    "                            return '25'\n" +
    "                        } else if (d.name.length < 21) {\n" +
    "                            return '19'\n" +
    "                        } else {\n" +
    "                            return '14'\n" +
    "                        }\n" +
    "                    })\n" +
    "                    .attr(\"text-anchor\", function (d) {\n" +
    "                        return (d.name == 'origin') ? 'middle' : \"start\";\n" +
    "                    })\n" +
    "                    .attr('fill', '#000')\n" +
    "                    .text(function (d) {\n" +
    "                        if (d.name == 'origin') {\n" +
    "                            return rootName;\n" +
    "                        }\n" +
    "                        if (d.repeated) {\n" +
    "                            return '[Recurring] ' + d.name;\n" +
    "                        }\n" +
    "                        console.log(d.name,d.name.length)\n" +
    "                        return (d.name.length > 5) ? d.name.substr(0, 10) : d.name;\n" +
    "                    })\n" +
    "                    .style({\n" +
    "                        'fill-opacity': 1e-6,\n" +
    "                        'fill': function (d) {\n" +
    "                            if (d.name == 'origin') {\n" +
    "                                return '#fff';\n" +
    "                            }\n" +
    "                        },\n" +
    "                        'font-size': function (d) {\n" +
    "                            return (d.name == 'origin') ? 14 : 11;\n" +
    "                        },\n" +
    "                        'cursor': \"pointer\"\n" +
    "                    })\n" +
    "                    .on('click', function (d) {\n" +
    "                        that.toOtherCompany(d)\n" +
    "                    });\n" +
    "\n" +
    "                nodeEnter.append(\"text\")\n" +
    "                    .attr(\"class\", \"linkname\")\n" +
    "                    .attr(\"x\", \"-55\")\n" +
    "                    .attr(\"dy\", function (d) {\n" +
    "                        if (d.name == 'origin') {\n" +
    "                            return '.35em'\n" +
    "                        } else if (forUpward) {\n" +
    "                            return '-29'\n" +
    "                        } else if (d.name.length < 21) {\n" +
    "                            return '30'\n" +
    "                        } else {\n" +
    "                            return '26'\n" +
    "                        }\n" +
    "                    })\n" +
    "                    .attr(\"text-anchor\", function () {\n" +
    "                        return (d.name == 'origin') ? 'middle' : \"start\";\n" +
    "                    })\n" +
    "                    .text(function (d) {\n" +
    "                        return (d.name.length > 20) ? d.name.substr(10, 10) : d.name.substr(10, d.name\n" +
    "                            .length - 10);\n" +
    "                    })\n" +
    "                    .style({\n" +
    "                        'font-size': function (d) {\n" +
    "                            return (d.name == 'origin') ? 14 : 11;\n" +
    "                        },\n" +
    "                    })\n" +
    "                    .on('click', function (d) {\n" +
    "                        that.toOtherCompany(d)\n" +
    "                    });\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "                // Transition nodes to their new position.原有节点更新到新位置\n" +
    "                var nodeUpdate = node.transition()\n" +
    "                    .duration(duration)\n" +
    "                    .attr('transform', function (d) {\n" +
    "                        return (d.depth == 2) ? 'translate(' +( d.x + 44 ) + ',' + d.y + ')' : 'translate(' + d.x  + ',' + d.y + ')';\n" +
    "                    });\n" +
    "                nodeUpdate.select('circle')\n" +
    "                    .attr('r', function (d) {\n" +
    "                        return (d.name == 'origin') ? 0 : (hasChildNodeArr.indexOf(d) == -1) ? 0 : 6;\n" +
    "                    })\n" +
    "                    .attr('cy', function (d) {\n" +
    "                        return (d.name == 'origin') ? -20 : (forUpward) ? -58 : 47;\n" +
    "                    })\n" +
    "                    .style('fill', function (d) {\n" +
    "                        return hasChildNodeArr.indexOf(d) != -1 ? \"#fff\" : \"\";\n" +
    "                    })\n" +
    "                    .style('stroke', function (d) {\n" +
    "                        return hasChildNodeArr.indexOf(d) != -1 ? \"#ccc\" : \"\";\n" +
    "                    })\n" +
    "                    .style('stroke-width', function (d) {\n" +
    "                        if (d.repeated) {\n" +
    "                            return 5;\n" +
    "                        }\n" +
    "                    });\n" +
    "\n" +
    "                //代表是否展开的+-号\n" +
    "                nodeEnter.append(\"svg:text\")\n" +
    "                    .attr(\"class\", \"isExpand\")\n" +
    "                    .attr(\"x\", \"0\")\n" +
    "                    .attr(\"dy\", function (d) {\n" +
    "                        return forUpward ? -53 : 52;\n" +
    "                    })\n" +
    "                    .attr(\"text-anchor\", \"middle\")\n" +
    "                    .style(\"fill\", \"#000\")\n" +
    "                    .text(function (d) {\n" +
    "                        if (d.name == 'origin') {\n" +
    "                            return '';\n" +
    "                        }\n" +
    "                        //return hasChildNodeArr.indexOf(d) != -1 ? \"+\" : \"\";\n" +
    "                        return hasChildNodeArr.indexOf(d) != -1 ? \"-\" : \"\";\n" +
    "                    })\n" +
    "                    .on('click', click)\n" +
    "\n" +
    "\n" +
    "                nodeUpdate.select('text').style('fill-opacity', 1)\n" +
    "\n" +
    "                var nodeExit = node.exit().transition()\n" +
    "                    .duration(duration)\n" +
    "                    .attr('transform', function (d) {\n" +
    "                        return 'translate(' + source.x + ',' + source.y + ')';\n" +
    "                    })\n" +
    "                    .remove();\n" +
    "                nodeExit.select('circle')\n" +
    "                    .attr('r', 1e-6)\n" +
    "                nodeExit.select('text')\n" +
    "                    .style('fill-opacity', 1e-6);\n" +
    "\n" +
    "                var link = g.selectAll('path.' + link_class)\n" +
    "                    .data(links, function (d) {\n" +
    "                        return d.target.id;\n" +
    "                    });\n" +
    "\n" +
    "                link.enter().insert('path', 'g')\n" +
    "                    .attr('class', link_class)\n" +
    "                    .attr('stroke', function (d) {\n" +
    "                        // return '#51a56e'\n" +
    "                        return '#ccc'\n" +
    "                    })\n" +
    "                    .attr('fill', \"none\")\n" +
    "                    .attr('stroke-width', '1px')\n" +
    "                    .attr('opacity', 0.5)\n" +
    "                    .attr('d', function (d) {\n" +
    "                        var o = {\n" +
    "                            x: source.x0,\n" +
    "                            y: source.y0\n" +
    "                        };\n" +
    "                        return diagonal({\n" +
    "                            source: o,\n" +
    "                            target: o\n" +
    "                        });\n" +
    "                    })\n" +
    "                    .attr(\"marker-end\", function (d) {\n" +
    "                        return forUpward ? \"url(#resolvedUp)\" : \"url(#resolvedDown)\";\n" +
    "                    }) //根据箭头标记的id号标记箭头;\n" +
    "                    .attr(\"id\", function (d, i) {\n" +
    "                        return \"mypath\" + i;\n" +
    "                    })\n" +
    "                link.transition()\n" +
    "                    .duration(duration)\n" +
    "                    .attr('d', diagonal);\n" +
    "                link.exit().transition()\n" +
    "                    .duration(duration)\n" +
    "                    .attr('d', function (d) {\n" +
    "                        var o = {\n" +
    "                            x: source.x,\n" +
    "                            y: source.y\n" +
    "                        };\n" +
    "                        return diagonal({\n" +
    "                            source: o,\n" +
    "                            target: o\n" +
    "                        });\n" +
    "                    })\n" +
    "                    .remove();\n" +
    "                nodes.forEach(function (d) {\n" +
    "                    d.x0 = d.x;\n" +
    "                    d.y0 = d.y;\n" +
    "                });\n" +
    "\n" +
    "                function Change_modal(d) {\n" +
    "                    console.log(123412)\n" +
    "                    that.Modal = true\n" +
    "                    console.log(d)\n" +
    "                }\n" +
    "\n" +
    "\n" +
    "                function click(d) {\n" +
    "                    if (forUpward) {\n" +
    "\n" +
    "                    } else {\n" +
    "                        if (d._children) {\n" +
    "                            console.log('对外投资--ok')\n" +
    "                        } else {\n" +
    "                            console.log('对外投资--no')\n" +
    "                        }\n" +
    "                    }\n" +
    "\n" +
    "                    isExpand = !isExpand;\n" +
    "                    if (d.name == 'origin') {\n" +
    "                        return;\n" +
    "                    }\n" +
    "                    console.log(d, 'ddd')\n" +
    "                    if (d.children) {\n" +
    "                        d._children = d.children;\n" +
    "                        d.children = null;\n" +
    "                        d3_old.select(this).text('+')\n" +
    "                    } else {\n" +
    "                        d.children = d._children;\n" +
    "                        d._children = null;\n" +
    "                        // expand all if it's the first node\n" +
    "                        if (d.name == 'origin') {\n" +
    "                            d.children.forEach(expand);\n" +
    "                        }\n" +
    "                        d3_old.select(this).text('-')\n" +
    "                    }\n" +
    "                    update(d, originalData, g);\n" +
    "                }\n" +
    "            }\n" +
    "\n" +
    "\n" +
    "            function expand(d) {\n" +
    "                if (d._children) {\n" +
    "                    d.children = d._children;\n" +
    "                    d.children.forEach(expand);\n" +
    "                    d._children = null;\n" +
    "                }\n" +
    "            }\n" +
    "\n" +
    "\n" +
    "            function collapse(d) {\n" +
    "                if (d.children && d.children.length != 0) {\n" +
    "                    d._children = d.children;\n" +
    "                    d._children.forEach(collapse);\n" +
    "                    //d.children = null; //默认展开（打开关闭）\n" +
    "                    hasChildNodeArr.push(d);\n" +
    "                }\n" +
    "            }\n" +
    "\n" +
    "\n" +
    "            function redraw() {\n" +
    "                treeG.attr('transform', 'translate(' + d3_old.event.translate + ')' +\n" +
    "                    ' scale(' + d3_old.event.scale + ')');\n" +
    "            }\n" +
    "\n" +
    "            function disableRightClick() {\n" +
    "                // stop zoom\n" +
    "                if (d3_old.event.button == 2) {\n" +
    "                    console.log('No right click allowed');\n" +
    "                    d3_old.event.stopImmediatePropagation();\n" +
    "                }\n" +
    "            }\n" +
    "\n" +
    "\n" +
    "            function sortByDate(a, b) {\n" +
    "                var aNum = a.name.substr(a.name.lastIndexOf('(') + 1, 4);\n" +
    "                var bNum = b.name.substr(b.name.lastIndexOf('(') + 1, 4);\n" +
    "                return d3_old.ascending(aNum, bNum) ||\n" +
    "                    d3_old.ascending(a.name, b.name) ||\n" +
    "                    d3_old.ascending(a.id, b.id);\n" +
    "            }\n" +
    "        };\n" +
    "\n" +
    "        var d3GenerationChart = new treeChart(d3);\n" +
    "        d3GenerationChart.drawChart();\n" +
    "    }\n" +
    "</script>")

$templateCache.put("app/modules/cac/result/job-result-overview.html","<style>\n" +
    "    #host-container td {\n" +
    "        color: black;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated th.row-header {\n" +
    "        width: auto;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated.table > tbody > tr > td {\n" +
    "        width: 50px;\n" +
    "        border-top: 1px solid #dddddd;\n" +
    "        border-left: 1px solid #dddddd;\n" +
    "        border-right: 1px solid #dddddd;\n" +
    "        vertical-align: middle;\n" +
    "        text-align: center;\n" +
    "        /*color: rgba(255, 255, 255, 0.8);*/\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated.table > tbody > tr > td:first-child {\n" +
    "        border-left: 0;\n" +
    "        width: auto !important;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated.table > tbody > tr > td {\n" +
    "        /*padding: 15.5px;*/\n" +
    "        height: 50px;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated th.rotate-45 {\n" +
    "        height: 120px;\n" +
    "        width: 50px;\n" +
    "        min-width: 50px;\n" +
    "        max-width: 50px;\n" +
    "        position: relative;\n" +
    "        vertical-align: bottom;\n" +
    "        padding: 0;\n" +
    "        font-size: 12px;\n" +
    "        line-height: 1.2;\n" +
    "        -ms-transform: skew(-45deg, 0deg);\n" +
    "        -moz-transform: skew(-45deg, 0deg);\n" +
    "        -webkit-transform: skew(-45deg, 0deg);\n" +
    "        -o-transform: skew(-45deg, 0deg);\n" +
    "        transform: skew(-45deg, 0deg);\n" +
    "        left: 60px; /* 80 * tan(45) / 2 = 40 where 80 is the height on the cell and 45 is the transform angle*/\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated th.rotate-45 > div {\n" +
    "        position: relative;\n" +
    "        top: 0px;\n" +
    "        height: 100%;\n" +
    "        overflow: hidden;\n" +
    "        border-left: 1px solid #dddddd;\n" +
    "        border-right: 1px solid #dddddd;\n" +
    "        /*border-top: 1px solid #dddddd;*/\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated th.rotate-45 span {\n" +
    "        -ms-transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        -moz-transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        -webkit-transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        -o-transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        position: absolute;\n" +
    "        bottom: 55px;\n" +
    "        left: -46px;\n" +
    "        display: inline-block;\n" +
    "        width: 140px;\n" +
    "        text-align: left;\n" +
    "        white-space: nowrap;\n" +
    "        text-overflow: ellipsis;\n" +
    "        overflow: hidden;\n" +
    "    }\n" +
    "\n" +
    "</style>\n" +
    "<div class=\"opx-layout-vflex\" xxx__uaa-has-permission=\"cac:view:*\"\n" +
    "     xxx__uaa-deny-message=\"{{'common.uaa.no_permission'}}\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"app.cac.job.list({templateId:jobResultOverviewCtrlVm.views.job.templateId})\">{{'cac.index.job'\n" +
    "                        | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">\n" +
    "                    {{jobResultOverviewCtrlVm.views.job.templateName}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div><!--<a ui-sref=\"app.cac.result.view({jobId:jobResultOverviewCtrlVm.views.job.id})\"\n" +
    "                class=\"btn btn-outline-default ms-auto\"\n" +
    "                ng-click=\"jobResultOverviewCtrlVm.views.changeProfileView()\">\n" +
    "            <i class=\"fa\"\n" +
    "               ng-class=\"jobResultOverviewCtrlVm.views.profileView === 'profile' ? 'fa-th-list':'fa-stream'\"></i>\n" +
    "            {{jobResultOverviewCtrlVm.views.profileView === 'profile' ? ('cac.view.statistics' | translate) : ('cac.view.summary' | translate)}}</a>\n" +
    "            -->\n" +
    "            <!-- <a href=\"{{jobResultOverviewCtrlVm.views.exportExcel()}}\" class=\"btn btn-outline-default ms-auto\"><i\n" +
    "                     class=\"fa fa-file-export\"></i> {{'cac.result.detail.export' | translate}} </a>-->\n" +
    "\n" +
    "            <a href=\"#\" ng-click=\"jobResultOverviewCtrlVm.views.exportExcel($event)\">\n" +
    "                <button class=\"btn btn-default btn-sm\">\n" +
    "                    <i class=\"fa fa-file-export\"></i> {{'cac.result.detail.export' | translate}}\n" +
    "                </button>\n" +
    "            </a>\n" +
    "\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <!--<div class=\"scroll-y opx-flex-fill p-3\" ui-view=\"profileView\"\n" +
    "         ng-if=\"jobResultOverviewCtrlVm.views.profileView === 'profile'\"></div>-->\n" +
    "    <div class=\"scroll-y opx-flex-fill p-3\" ng-if=\"jobResultOverviewCtrlVm.views.profileView === 'normal'\"\n" +
    "         __when-scrolled=\"jobResultOverviewCtrlVm.views.loadMore()\">\n" +
    "\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <ul class=\"list-unstyled d-flex align-items-center\">\n" +
    "                    <li>\n" +
    "                        <button type=\"button\"\n" +
    "                                class=\"rounded-pill btn btn-sm btn-{{jobResultOverviewCtrlVm.jobStatus[jobResultOverviewCtrlVm.views.job.jobStatus].style}}\"\n" +
    "                                ng-click=\"jobResultOverviewCtrlVm.views.showLog()\">\n" +
    "                            {{jobResultOverviewCtrlVm.jobStatus[jobResultOverviewCtrlVm.views.job.jobStatus].title}}\n" +
    "                        </button>\n" +
    "                    </li>\n" +
    "                    <li class=\"ms-3\">\n" +
    "                        <strong>{{'common.entity.detail.start_at' | translate}}：</strong>{{jobResultOverviewCtrlVm.views.job.createdAt\n" +
    "                        | date:'yyyy-MM-dd HH:mm:ss'}}\n" +
    "                    </li>\n" +
    "                    <li class=\"ms-3\">\n" +
    "                        <strong>{{'common.entity.detail.end_at' | translate}}：</strong>{{jobResultOverviewCtrlVm.views.job.endedAt\n" +
    "                        | date:'yyyy-MM-dd HH:mm:ss'}}\n" +
    "                    </li>\n" +
    "                    <!--                    <li class=\"ms-auto\">-->\n" +
    "                    <!--                        <a class=\"btn btn-default btn-sm\"-->\n" +
    "                    <!--                           ui-sref=\"app.cac.output({taskId:jobResultOverviewCtrlVm.views.job.taskId,jobId:jobResultOverviewCtrlVm.views.job.id})\">-->\n" +
    "                    <!--                            <i class=\"fa fa-file\"></i> 主机脚本输出-->\n" +
    "                    <!--                        </a>-->\n" +
    "                    <!--                    </li>-->\n" +
    "                </ul>\n" +
    "                <!--<div class=\"list-group\">-->\n" +
    "\n" +
    "                <table class=\"table\" ng-repeat=\"item in jobResultOverviewCtrlVm.views.auditParams\">\n" +
    "                    <tbody>\n" +
    "                    <tr>\n" +
    "                        <th style=\"width:8rem;\">\n" +
    "                            <div>{{'cac.common.host' | translate}} <span\n" +
    "                                    class=\"rounded-pill badge bg-secondary\">{{item.hosts.length}}</span>\n" +
    "                                <div ng-if=\"item.hosts.length > 10\">\n" +
    "                                    <button class=\"btn btn-default btn-sm\"\n" +
    "                                            ng-click=\"jobResultOverviewCtrlVm.views.showHostKey = true\"\n" +
    "                                            ng-if=\"!jobResultOverviewCtrlVm.views.showHostKey && item.hosts.length > 10\">\n" +
    "                                        {{'common.entity.action.more' | translate}} <i\n" +
    "                                            class=\"fa fa-angle-down\"></i></button>\n" +
    "                                    <button class=\"btn btn-default btn-sm\"\n" +
    "                                            ng-click=\"jobResultOverviewCtrlVm.views.showHostKey = false\"\n" +
    "                                            ng-if=\"jobResultOverviewCtrlVm.views.showHostKey\">\n" +
    "                                        {{'common.entity.action.collapse' | translate}} <i\n" +
    "                                            class=\"fa fa-angle-up\"></i>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </th>\n" +
    "                        <td>\n" +
    "                            <ul class=\"list list-unstyled list-inline\">\n" +
    "                                <li ng-repeat=\"host in item.hosts\"\n" +
    "                                    ng-if=\"$index <= 10 || jobResultOverviewCtrlVm.views.showHostKey\">\n" +
    "                                    <span class=\"badge bg-secondary\">{{host.hostKey}}</span>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <!-- 取消使用规则巡检 -->\n" +
    "                    <!--<tr>-->\n" +
    "                    <!--<th>规则 <span class=\"rounded-pill badge bg-secondary\">{{item.ruleExpressions.length}}</span>-->\n" +
    "                    <!--<div ng-if=\"item.ruleExpressions.length > 10\">-->\n" +
    "                    <!--<button class=\"btn btn-default btn-sm\"-->\n" +
    "                    <!--ng-click=\"jobResultOverviewCtrlVm.views.showRuleName = true\"-->\n" +
    "                    <!--ng-if=\"!jobResultOverviewCtrlVm.views.showRuleName && item.ruleExpressions.length > 10\">-->\n" +
    "                    <!--查看更多 <i class=\"fa fa-angle-down\"></i>-->\n" +
    "                    <!--</button>-->\n" +
    "                    <!--<button class=\"btn btn-default btn-sm\"-->\n" +
    "                    <!--ng-click=\"jobResultOverviewCtrlVm.views.showRuleName = false\"-->\n" +
    "                    <!--ng-if=\"jobResultOverviewCtrlVm.views.showRuleName\">-->\n" +
    "                    <!--收起 <i class=\"fa fa-angle-up\"></i>-->\n" +
    "                    <!--</button>-->\n" +
    "                    <!--</div>-->\n" +
    "                    <!--</th>-->\n" +
    "                    <!--<td>-->\n" +
    "                    <!--<ul class=\"list list-unstyled list-inline\">-->\n" +
    "                    <!--<li ng-repeat=\"rule in item.ruleExpressions\"-->\n" +
    "                    <!--ng-if=\"$index <= 10 || jobResultOverviewCtrlVm.views.showRuleName\">-->\n" +
    "                    <!--<span class=\"badge bg-secondary\">{{rule.ruleName}}</span>-->\n" +
    "                    <!--</li>-->\n" +
    "                    <!--</ul>-->\n" +
    "                    <!--</td>-->\n" +
    "                    <!--</tr>-->\n" +
    "                    <tr>\n" +
    "                        <th>{{'cac.common.script' | translate}}</th>\n" +
    "                        <td>\n" +
    "                            <ul class=\"list list-unstyled list-inline\">\n" +
    "                                <li ng-repeat=\"script in item.scripts\"><span\n" +
    "                                        class=\"badge bg-secondary\">{{script.scriptPath}}</span>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "                <!--<div class=\"list-group-item col-sm-12\" ng-repeat=\"item in jobResultOverviewCtrlVm.views.auditParams\">-->\n" +
    "                <!--&lt;!&ndash;<h4 class=\"list-group-item-heading col-sm-1\">项 目 {{$index+1}}</h4>&ndash;&gt;-->\n" +
    "                <!--<div class=\"col-sm-12\">-->\n" +
    "                <!--<label class=\"col-sm-1\">主机</label>-->\n" +
    "                <!--<div class=\"col-sm-11\">-->\n" +
    "                <!--<ul class=\"list list-unstyled list-inline\">-->\n" +
    "                <!--<li ng-repeat=\"host in item.hosts\"><span-->\n" +
    "                <!--class=\"badge bg-secondary\">{{host.hostKey}}</span>-->\n" +
    "                <!--</li>-->\n" +
    "                <!--</ul>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--<div class=\"list-group-item-text\">-->\n" +
    "                <!--<div class=\"col-sm-12\"-->\n" +
    "                <!--ng-if=\"jobResultOverviewCtrlVm.views.job.scriptType!='jobResultOverviewCtrlVm.views.playbookScripType'\">-->\n" +
    "                <!--<label class=\"col-sm-1\">规则</label>-->\n" +
    "                <!--<div class=\"col-sm-11\">-->\n" +
    "                <!--<ul class=\"list list-unstyled list-inline\">-->\n" +
    "                <!--<li ng-repeat=\"rule in item.ruleExpressions\"><span class=\"badge bg-secondary\">{{rule.ruleName}}</span>-->\n" +
    "                <!--</li>-->\n" +
    "                <!--</ul>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--<div class=\"col-sm-12\">-->\n" +
    "                <!--<label class=\"col-sm-1\">脚本</label>-->\n" +
    "                <!--<div class=\"col-sm-11\">-->\n" +
    "                <!--<ul class=\"list list-unstyled list-inline\">-->\n" +
    "                <!--<li ng-repeat=\"script in item.scripts\"><span class=\"badge bg-secondary\">{{script.scriptName}}</span>-->\n" +
    "                <!--</li>-->\n" +
    "                <!--</ul>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--</div>-->\n" +
    "                <!--</div>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <udp-page-view class=\"flex-fill scroll-y\" page-id=\"'/cac/assets/udp/cac-results'\" page-source=\"file\"\n" +
    "                               page-params=\"jobResultOverviewCtrlVm.params\"\n" +
    "                               uaa-has-permission=\"cac:view:*\"\n" +
    "                               uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "                </udp-page-view>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"card card-default\">\n" +
    "            <div class=\"card-header\">\n" +
    "                <div class=\"card-title\">\n" +
    "                    <div class=\"pull-right\">\n" +
    "                        <a class=\"btn btn-default btn-sm\" ng-click=\"jobResultOverviewCtrlVm.checkWhiteList()\">\n" +
    "                            <i class=\"fa fa fa-adjust\"></i>\n" +
    "                            {{'cac.profile.whitelist_list' | translate}}\n" +
    "                        </a>\n" +
    "\n" +
    "                        <a class=\"btn btn-default btn-sm\" ng-click=\"jobResultOverviewCtrlVm.views.changeResultView()\">\n" +
    "                            <i class=\"fa\"\n" +
    "                               ng-class=\"jobResultOverviewCtrlVm.views.resultView === 'list'?'fa-th-large':'fa-list'\"></i>\n" +
    "                            {{jobResultOverviewCtrlVm.views.resultView === 'list' ? ('cac.result.detail.summary_view' |\n" +
    "                            translate) : ('cac.result.detail.list_view' | translate)\n" +
    "                            }}\n" +
    "                        </a>\n" +
    "\n" +
    "                        <!--<a class=\"btn btn-default btn-sm\"-->\n" +
    "                        <!--ui-sref=\"app.cac.result.output({jobId:jobResultOverviewCtrlVm.views.job.id,taskId:jobResultOverviewCtrlVm.views.job.taskId})\"-->\n" +
    "                        <!--title=\"列表\">切换到列表视图</a>-->\n" +
    "                    </div>\n" +
    "                    <h3>\n" +
    "                        <strong>\n" +
    "                            {{'cac.result.detail.check_item' | translate}}{{'common.entity.action.detail' | translate}}\n" +
    "                        </strong>\n" +
    "                    </h3>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\" ui-view=\"cacResult\">\n" +
    "                <p ng-if=\"jobResultOverviewCtrlVm.views.data_table.length==0 && jobResultOverviewCtrlVm.views.isLoading == false\"\n" +
    "                   class=\"text-muted\"\n" +
    "                   style=\"text-align: center\"><i\n" +
    "                        class=\"fa fa-inbox\"></i>{{'common.messages.no_data' | translate}}</p>\n" +
    "\n" +
    "\n" +
    "                <div ng-if=\"jobResultOverviewCtrlVm.views.data_table.length>0\">\n" +
    "                    <ul class=\"text-right list-unstyled list-inline small mb-3\">\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-success\"><i class=\"fa fa-check\"></i></span>\n" +
    "                            {{'cac.result.audit_result.pass' | translate}}\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-danger\"><i class=\"fa fa-times\"></i></span>\n" +
    "                            {{'cac.result.audit_result.failed' | translate}}\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-warning\"><i class=\"fa fa-user-md\"></i></span>\n" +
    "                            {{'cac.result.audit_result.check' | translate}}\n" +
    "                        </li>\n" +
    "                        <!--<li>-->\n" +
    "                        <!--<span class=\"btn btn-sm opx-btn-icon cac-bg-grey\"><i class=\"fa fa-minus\"></i></span>-->\n" +
    "                        <!--不适用-->\n" +
    "                        <!--</li>-->\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-info\"><i class=\"fa fa fa-adjust\"></i></span>\n" +
    "                            {{'cac.profile.white_list' | translate}}\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-default\"><i class=\"fa fa-question\"></i></span>\n" +
    "                            {{'common.messages.no_data' | translate}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "\n" +
    "                    <div id=\"metric-container\" style=\"width: 100%; height:20rem; overflow:auto;\">\n" +
    "                        <table class=\"table table-border table-header-rotated\" style=\"max-width: 100%; width: auto;\">\n" +
    "                            <thead>\n" +
    "                            <tr>\n" +
    "                                <th class=\"border-0\"></th>\n" +
    "                                <th class=\"rotate-45\" style=\"border-top: 0px;\"\n" +
    "                                    ng-repeat=\"rule in ::jobResultOverviewCtrlVm.views.rules track by $index\">\n" +
    "                                    <div title=\"{{::rule.checkItem}}\">\n" +
    "                                        <span>{{::rule.checkItem}}</span>\n" +
    "                                    </div>\n" +
    "                                </th>\n" +
    "                            </tr>\n" +
    "                            </thead>\n" +
    "                            <tbody vs-repeat=\"{autoresize:true, latch:false, scrollParent:'#metric-container'}\">\n" +
    "                            <tr ng-repeat=\"item in jobResultOverviewCtrlVm.views.data_table track by item.hostKey\">\n" +
    "                                <td class=\"cac-result-first-td text-center\" title=\"{{::item.hostKey}}\"\n" +
    "                                    style=\"width: 290px!important;display: flex;align-items: center;justify-content: center;\"\n" +
    "                                    ng-class=\"{'text-danger':item.isUnreachable,'text-muted':item.isSkipping}\">\n" +
    "                                    <span ng-if=\"::item.isUnreachable\"\n" +
    "                                          title=\"{{'cac.result.audit_result.unreachable' | translate}}\"><i\n" +
    "                                            class=\"fa fa-ban\"></i></span>\n" +
    "                                    <span ng-if=\"::item.isSkipping\"\n" +
    "                                          title=\"{{'cac.result.audit_result.skipping' | translate}}\"><i\n" +
    "                                            class=\"fa fa-forward\"></i></span>\n" +
    "                                    {{::item.hostKey}}\n" +
    "                                </td>\n" +
    "                                <td class=\"text-center opx-autocolor {{::rule.class}}\" title=\"{{::rule.title}}\"\n" +
    "                                    ng-repeat=\"rule in ::item.rules track by $index\"\n" +
    "                                    ng-click=\"::jobResultOverviewCtrlVm.views.clickResult(rule.id,rule)\">\n" +
    "                                    <i class=\"fa {{::rule.iconClass}}\"></i>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"jobResultOverviewCtrlVm.views.data_table.length==0&&jobResultOverviewCtrlVm.views.isLoading\"\n" +
    "                     class=\"op-blank-slate\">\n" +
    "                    <!--                    <input type=\"search\" class=\"form-control input-sm\" placeholder=\"\" aria-controls=\"cacResultTable\">-->\n" +
    "                    <div class=\"op-blank-slate-icon\"><i class=\"fa fa-inbox fa-4x\"></i></div>\n" +
    "                    <p>{{'common.entity.loading' | translate}}</p>\n" +
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
    "\n" +
    "")

$templateCache.put("app/modules/cac/result/job-result-statistics-view.html","<div>\n" +
    "    <udp-page-view class=\"flex-fill scroll-y\" page-id=\"'/cac/assets/udp/cac-results'\" page-source=\"file\"\n" +
    "                   page-params=\"$ctrl.params\"\n" +
    "                   uaa-has-permission=\"cac:view:*\"\n" +
    "                   uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    </udp-page-view>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/result/job-result-to-rule.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"> {{jobResultToRuleCtrlVm.views.hostKey}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\"\n" +
    "            ng-click=\"jobResultToRuleCtrlVm.views.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body cac-history-find-dialog\">\n" +
    "    <div>\n" +
    "        <!--ng-hide=\"jobResultToRuleCtrlVm.views.ruleName == null || jobResultToRuleCtrlVm.views.ruleName == 'null'\">-->\n" +
    "        <strong class=\"d-inline-block\" style=\"width:6em;\">{{'cac.template.detail.audit_params' | translate}}</strong>\n" +
    "        <span> {{jobResultToRuleCtrlVm.views.metricName}}</span>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <strong class=\"d-inline-block\" style=\"width:6em;\">{{'cac.common.result' | translate}}</strong>\n" +
    "        <span ng-class='jobResultToRuleCtrlVm.views.metricStatusClass'> {{jobResultToRuleCtrlVm.views.metricStatus}}</span>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <strong>{{'cac.result.output' | translate}}</strong>\n" +
    "    </div>\n" +
    "    <div class=\"bg-light p-3\">\n" +
    "        <pre style=\"white-space: pre-wrap\">{{jobResultToRuleCtrlVm.views.metricValue}}</pre>\n" +
    "    </div>\n" +
    "    <!--<form name=\"cac-select-history-find-form\">-->\n" +
    "    <!--<div class=\"table-responsive\">-->\n" +
    "    <!--&lt;!&ndash;<table id=\"cacHistoryFindTable\"&ndash;&gt;-->\n" +
    "    <!--&lt;!&ndash;class=\"cac-history-find-table table opx-table\">&ndash;&gt;-->\n" +
    "    <!--&lt;!&ndash;</table>&ndash;&gt;-->\n" +
    "    <!--<table class=\"table opx-table\">-->\n" +
    "    <!--<thead>-->\n" +
    "    <!--<tr>-->\n" +
    "    <!--<th>检查项</th>-->\n" +
    "    <!--&lt;!&ndash;<th>检查结果</th>&ndash;&gt;-->\n" +
    "    <!--<th>脚本输出</th>-->\n" +
    "    <!--</tr>-->\n" +
    "    <!--</thead>-->\n" +
    "    <!--<tbody>-->\n" +
    "    <!--<tr ng-repeat=\"row in jobResultToRuleCtrlVm.views.tableData\" class=\"op-hover-trigger\">-->\n" +
    "    <!--<td style=\"width:2rem;\">-->\n" +
    "    <!--{{row.metricName}}-->\n" +
    "    <!--</td>-->\n" +
    "    <!--&lt;!&ndash;<td>&ndash;&gt;-->\n" +
    "    <!--&lt;!&ndash;<label ng-class='jobResultToRuleCtrlVm.views.metricStatusClass' style='white-space: pre;'>{{jobResultToRuleCtrlVm.views.metricStatus}}</label>&ndash;&gt;-->\n" +
    "    <!--&lt;!&ndash;</td>&ndash;&gt;-->\n" +
    "    <!--<td class=\"cac-text-overflow\">-->\n" +
    "    <!--<span class='code' style='white-space: pre' title=\"{{row.metricValue}}\">{{row.metricValue}}</span>-->\n" +
    "    <!--</td>-->\n" +
    "    <!--</tr>-->\n" +
    "    <!--<td valign=\"top\" colspan=\"2\" class=\"text-center\" ng-if=\"jobResultToRuleCtrlVm.views.tableData.length == 0\"><p class=\"text-muted\"><i class=\"fa fa-inbox\"></i> 没有数据</p></td>-->\n" +
    "    <!--</tbody>-->\n" +
    "    <!--</table>-->\n" +
    "\n" +
    "    <!--&lt;!&ndash; ng-if=\"!cacResultFindMetricVm.views.ruleTableData\"&ndash;&gt;-->\n" +
    "    <!--&lt;!&ndash;  <table ng-if=\"cacResultFindMetricVm.views.ruleTableData\" class=\"table opx-table\">-->\n" +
    "    <!--<thead>-->\n" +
    "    <!--<tr>-->\n" +
    "    <!--<th>指标名称</th>-->\n" +
    "    <!--<th>指标结果</th>-->\n" +
    "    <!--</tr>-->\n" +
    "    <!--</thead>-->\n" +
    "    <!--<tbody>-->\n" +
    "    <!--<tr ng-repeat=\"row in cacResultFindMetricVm.views.ruleTableData\" class=\"op-hover-trigger\">-->\n" +
    "    <!--<td style=\"width:2rem;\">-->\n" +
    "    <!--{{row.metricName}}-->\n" +
    "    <!--</td>-->\n" +
    "    <!--<td>-->\n" +
    "    <!--<span class='code' style='white-space: pre;'>{{row.metricValue}}</span>-->\n" +
    "    <!--</td>-->\n" +
    "    <!--</tr>-->\n" +
    "    <!--</tbody>-->\n" +
    "    <!--</table>&ndash;&gt;-->\n" +
    "    <!--</div>-->\n" +
    "    <!--</form>-->\n" +
    "</div>\n" +
    "<div class=\"modal-footer\" style=\"display: block;\">\n" +
    "    <div ng-if=\"jobResultToRuleCtrlVm.checkWhiteList\" class=\"pull-left\">\n" +
    "        <a class=\"btn {{jobResultToRuleCtrlVm.btnStyle}}\"\n" +
    "           ng-click=\"jobResultToRuleCtrlVm.saveAndDelCheckWhiteList()\">\n" +
    "            <i class=\"fa\"\n" +
    "               ng-class=\"jobResultToRuleCtrlVm.checkWhiteListType === 'add' ? 'fa-plus' : 'fa-trash-alt'\"></i>\n" +
    "            {{jobResultToRuleCtrlVm.checkWhiteListType === 'add' ? ('cac.profile.add_white_list' | translate) :\n" +
    "            ('cac.profile.remove_white_list' | translate)}}\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"pull-right\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"jobResultToRuleCtrlVm.views.cancel()\">\n" +
    "            {{'common.entity.action.close' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/result/result-execute-rule.html","\n" +
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\" ng-click=\"cacResultExecuteVm.views.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "    <h4 class=\"modal-title\"> {{'cac.index.history_rule' | translate}}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body cac-history-find-dialog\">\n" +
    "    <form name=\"ruleExecuteForm\" class=\"form-horizontal\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">{{'cac.common.rule' | translate}}</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <textarea type=\"textarea\" class=\"form-control\" placeholder=\"\" required=\"\"\n" +
    "                          ng-model=\"cacResultExecuteVm.views.ruleValue\" row=\"3\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">{{'cac.common.result' | translate}}</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <textarea type=\"textarea\" class=\"form-control\" placeholder=\"\"\n" +
    "                          ng-model=\"cacResultExecuteVm.views.ruleValue\" row=\"3\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cacResultExecuteVm.views.cancel()\">{{'common.entity.action.close' | translate}}\n" +
    "    </button>\n" +
    "\n" +
    "    <button type=\"submit\" class=\"btn btn-success\" ng-click=\"cacResultExecuteVm.views.execute()\"\n" +
    "            ng-disabled=\"ruleExecuteForm.$invalid\">\n" +
    "        {{'cac.result.detail.re_execute' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/result/result-list.html","<div class=\"wrapper\">\n" +
    "    <div class=\"table-responsive w-full\">\n" +
    "        <table id=\"cacResultTable\" class=\"cac-result-table-list table opx-table\"></table>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/result/result-output-list.html","<!--<div>-->\n" +
    "    <!--<nav class=\"navbar bg-light\">-->\n" +
    "        <!--<div class=\"navbar-nav\">-->\n" +
    "            <!--<ol class=\"breadcrumb\">-->\n" +
    "                <!--<li class=\"breadcrumb-item\">-->\n" +
    "                    <!--<a ui-sref=\"app.cac.result({jobId:cacResultOutputListCtrlVm.views.jobId})\">巡检结果</a>-->\n" +
    "                <!--</li>-->\n" +
    "                <!--<li class=\"breadcrumb-item active\">-->\n" +
    "                    <!--主机脚本输出-->\n" +
    "                <!--</li>-->\n" +
    "            <!--</ol>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</nav>-->\n" +
    "    <!--<div class=\"p-3\">-->\n" +
    "        <!-- <div class=\"card-header\">\n" +
    "             <div class=\"card-title\">\n" +
    "                 模板列表\n" +
    "             </div>\n" +
    "         </div>-->\n" +
    "        <!--<div class=\"table-responsive\">-->\n" +
    "            <!--<table id=\"cacResultOutputTable\" class=\"cac-output-table-list table opx-table\"></table>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "<!--</div>-->\n" +
    "\n" +
    "<!--<div class=\"wrapper\">-->\n" +
    "<!--    <div class=\"card card-default\">-->\n" +
    "<!--        <div class=\"card-body\">-->\n" +
    "            <!--<div class=\"table-responsive w-full\">\n" +
    "                <table  id=\"cacResultOutputTable\" class=\"cac-output-table-list table opx-table\"></table>\n" +
    "            </div>-->\n" +
    "<opx-datatable table-config=\"cacResultOutputListCtrlVm.tableConfig\">\n" +
    "</opx-datatable>\n" +
    "<!--        </div>-->\n" +
    "<!--    </div>-->\n" +
    "<!--</div>-->\n" +
    "")

$templateCache.put("app/modules/cac/result/result-output-log.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        <span>{{'cac.result.output' | translate}}</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "            ng-click=\"cacResultOutputLogCtrlVm.views.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{'cac.result.detail.job_id' | translate}} </p>\n" +
    "    <p>\n" +
    "        <span class=\"badge {{cacResultOutputLogCtrlVm.views.output.id!=null?'badge-default':'badge-warning'}}\">{{cacResultOutputLogCtrlVm.views.output.id || ('common.term.none' | translate)}}</span>\n" +
    "    </p>\n" +
    "\n" +
    "    <p>{{'cac.result.output' | translate}}</p>\n" +
    "    <!--<div class=\"op-blank-slate\" ng-if=\"cacResultOutputListCtrlVm.views.isResult\">\n" +
    "        <div class=\"op-blank-slate-icon\"><i class=\"fa fa-inbox fa-4x\"></i></div>\n" +
    "        <p>无日志</p>\n" +
    "    </div>-->\n" +
    "    <pre class=\"cac-job-result-pre\">{{cacResultOutputLogCtrlVm.views.output.output}}</pre>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cacResultOutputLogCtrlVm.views.cancel()\">{{'common.entity.action.close' | translate}}</button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/result/structural-diagram.html","<div class=\"opx-layout-vflex\" xxx__uaa-has-permission=\"cac:view:*\"\n" +
    "     xxx__uaa-deny-message=\"{{'common.uaa.no_permission'}}\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"app.cac.job.list({templateId:structuralDiagramCtrlVm.views.job.templateId})\">{{'cac.index.job'\n" +
    "                    | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">\n" +
    "                    {{structuralDiagramCtrlVm.views.job.templateName}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "\n" +
    "        <div>\n" +
    "            <a href=\"#\" ng-click=\"structuralDiagramCtrlVm.views.exportExcel($event)\">\n" +
    "                <button class=\"btn btn-default btn-sm\">\n" +
    "                    <i class=\"fa fa-file-export\"></i> {{'cac.result.detail.export' | translate}}\n" +
    "                </button>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"scroll-y opx-flex-fill p-3\">\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <udp-page-view class=\"flex-fill scroll-y\" page-id=\"'/cac/assets/udp/cac-kpi'\" page-source=\"file\"\n" +
    "                               page-params=\"structuralDiagramCtrlVm.params\"\n" +
    "                               uaa-has-permission=\"cac:view:*\"\n" +
    "                               uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "                </udp-page-view>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "<!--        <div class=\"card mb-3\">-->\n" +
    "<!--            <div class=\"card-body\">-->\n" +
    "<!--                <a href=\"#\" ng-click=\"structuralDiagramCtrlVm.views.downloadBtn($event,'images')\">-->\n" +
    "<!--                    {{'cac.structural.download_images' | translate}}-->\n" +
    "<!--                </a>-->\n" +
    "<!--                <a href=\"#\" ng-click=\"structuralDiagramCtrlVm.views.downloadBtn($event,'resetting')\">-->\n" +
    "<!--                    {{'cac.structural.resetting' | translate}}-->\n" +
    "<!--                </a>-->\n" +
    "<!--            </div>-->\n" +
    "<!--        </div>-->\n" +
    "\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-body\" style=\"width: 100%; overflow-x: auto;\">\n" +
    "<!--                <div id=\"tooltip\">Tooltip content will appear here</div>-->\n" +
    "                <div class=\"chart-size\" e-echart ec-data=\"option\" theme=\"macarons\" id=\"eechart5\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<style>\n" +
    "    /*#tooltip {*/\n" +
    "    /*    position: absolute;*/\n" +
    "    /*    display: none;*/\n" +
    "    /*    border: 1px solid #ddd;*/\n" +
    "    /*    background-color: #dc3545;*/\n" +
    "    /*    padding: 5px;*/\n" +
    "    /*    border-radius: 4px;*/\n" +
    "    /*    font-size: 14px;*/\n" +
    "    /*    color: #fff;*/\n" +
    "    /*    z-index: 1000;*/\n" +
    "    /*}*/\n" +
    "\n" +
    "    /*#tooltip::before {*/\n" +
    "    /*    content: \"\";*/\n" +
    "    /*    position: absolute;*/\n" +
    "    /*    top: 50%;*/\n" +
    "    /*    left: -10px; !* 根据箭头大小和边框调整 *!*/\n" +
    "    /*    margin-top: -2px; !* 箭头中心与 tooltip 边框对齐 *!*/\n" +
    "    /*    border-width: 5px;*/\n" +
    "    /*    border-style: solid;*/\n" +
    "    /*    border-color: transparent #dc3545 transparent transparent; !* 边框颜色，最后一个是箭头颜色 *!*/\n" +
    "    /*    transform: translateY(-50%); !* 确保箭头垂直居中 *!*/\n" +
    "    /*}*/\n" +
    "\n" +
    "    .chart-size {\n" +
    "        width: 100%;\n" +
    "        height: 620px;\n" +
    "    }\n" +
    "</style>\n" +
    "")

$templateCache.put("app/modules/cac/result/structural-one-desc.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{'cac.profile.inspection_results_profile' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\"\n" +
    "            ng-click=\"$ctrl.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div style=\"margin: 10px;\">\n" +
    "        <p>\n" +
    "            <span style=\"font-weight: bolder; font-size: 14px;\">\n" +
    "                <span>{{ $ctrl.maps.primaryService }}</span>\n" +
    "            </span>\n" +
    "        </p>\n" +
    "        <div class=\"d-flex align-items-center\">\n" +
    "            <div>\n" +
    "                <p>\n" +
    "                    <span style=\"font-size: 14px;\">{{'cac.structural.secondary_service' | translate}}：\n" +
    "                        <span>{{$ctrl.counts[0]}}</span>\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    <span style=\"font-size: 14px;\">{{'cac.structural.item_err_total' | translate}}：\n" +
    "                        <span>{{$ctrl.counts[1]}}</span>\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    <span style=\"font-size: 14px;\">{{'cac.structural.item_host_total' | translate}}：\n" +
    "                        <span>{{$ctrl.counts[2]}}</span>\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "            <div class=\"ml-auto\"><i class=\"fad fa-desktop fa-5x text-secondary\"></i></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <opx-datatable table-config=\"$ctrl.tableConfig\">\n" +
    "    </opx-datatable>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default\" ng-click=\"$ctrl.cancel()\">{{'common.action.close' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "<!--<style>-->\n" +
    "<!--    .modal-dialog.modal-lg {-->\n" +
    "<!--        height: 45rem;-->\n" +
    "<!--    }-->\n" +
    "<!--</style>-->")

$templateCache.put("app/modules/cac/result/structural-two-desc.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{'cac.profile.inspection_results_profile' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\"\n" +
    "            ng-click=\"$ctrl.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div style=\"margin: 10px;\">\n" +
    "        <p>\n" +
    "            <span style=\"font-weight: bolder; font-size: 14px;\">\n" +
    "                <span>{{ $ctrl.maps.secondaryService }}</span>\n" +
    "            </span>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <span style=\"font-size: 14px;\">{{'cac.structural.primary_service' | translate}}：\n" +
    "                <span>{{ $ctrl.maps.primaryService }}</span>\n" +
    "            </span>\n" +
    "        </p>\n" +
    "        <div class=\"d-flex align-items-center\">\n" +
    "            <div>\n" +
    "                <p>\n" +
    "                    <span style=\"font-size: 14px;\">{{'common.term.failed' | translate}}{{'cac.result.detail.check_item' | translate}}：\n" +
    "                        <span>{{$ctrl.counts[0]}}</span>\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    <span style=\"font-size: 14px;\">{{'common.term.failed' | translate}}{{'cac3.title.hostItem' | translate}}：\n" +
    "                        <span>{{$ctrl.counts[1]}}</span>\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "            <div class=\"ml-auto\"><i class=\"fad fa-desktop fa-5x text-secondary\"></i></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <uib-tabset class=\"tab-container\" type=\"mdc-op\" active=\"1\">\n" +
    "        <uib-tab index=\"1\">\n" +
    "            <uib-tab-heading>{{'common.term.failed' | translate}}{{'cac.result.detail.check_item' | translate}}</uib-tab-heading>\n" +
    "            <opx-datatable table-config=\"$ctrl.tableConfigItem\">\n" +
    "            </opx-datatable>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab index=\"2\">\n" +
    "            <uib-tab-heading>{{'common.term.failed' | translate}}{{'cac3.title.hostItem' | translate}}</uib-tab-heading>\n" +
    "            <opx-datatable table-config=\"$ctrl.tableConfigHost\">\n" +
    "            </opx-datatable>\n" +
    "        </uib-tab>\n" +
    "    </uib-tabset>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default\" ng-click=\"$ctrl.cancel()\">{{'common.action.close' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "<!--<style>-->\n" +
    "<!--    .modal-dialog.modal-lg {-->\n" +
    "<!--        height: 45rem;-->\n" +
    "<!--    }-->\n" +
    "<!--</style>-->")

$templateCache.put("app/modules/cac/results/check-result-output-list.html","<opx-datatable table-config=\"cacCheckResultOutputListCtrlVm.tableConfig\">\n" +
    "    <button class=\"btn btn-primary\"\n" +
    "            ng-disabled=\"!cacCheckResultOutputListCtrlVm.fixSelectedIds.length>0\"\n" +
    "            ng-click=\"cacCheckResultOutputListCtrlVm.runFix()\">\n" +
    "        <i class=\"fa fa-caret-square-right fa-fw\"></i> {{'cac3.title.performRepairs' | translate}}\n" +
    "    </button>\n" +
    "</opx-datatable>\n" +
    "")

$templateCache.put("app/modules/cac/results/check-result-overview.html","<style>\n" +
    "    #host-container td {\n" +
    "        color: black;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated th.row-header {\n" +
    "        width: auto;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated.table > tbody > tr > td {\n" +
    "        width: 50px;\n" +
    "        border-top: 1px solid #dddddd;\n" +
    "        border-left: 1px solid #dddddd;\n" +
    "        border-right: 1px solid #dddddd;\n" +
    "        vertical-align: middle;\n" +
    "        text-align: center;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated.table > tbody > tr > td:first-child {\n" +
    "        border-left: 0;\n" +
    "        width: auto !important;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated.table > tbody > tr > td {\n" +
    "        height: 50px;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated th.rotate-45 {\n" +
    "        height: 120px;\n" +
    "        width: 50px;\n" +
    "        min-width: 50px;\n" +
    "        max-width: 50px;\n" +
    "        position: relative;\n" +
    "        vertical-align: bottom;\n" +
    "        padding: 0;\n" +
    "        font-size: 12px;\n" +
    "        line-height: 1.2;\n" +
    "        -ms-transform: skew(-45deg, 0deg);\n" +
    "        -moz-transform: skew(-45deg, 0deg);\n" +
    "        -webkit-transform: skew(-45deg, 0deg);\n" +
    "        -o-transform: skew(-45deg, 0deg);\n" +
    "        transform: skew(-45deg, 0deg);\n" +
    "        left: 60px;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated th.rotate-45 > div {\n" +
    "        position: relative;\n" +
    "        top: 0px;\n" +
    "        height: 100%;\n" +
    "        overflow: hidden;\n" +
    "        border-left: 1px solid #dddddd;\n" +
    "        border-right: 1px solid #dddddd;\n" +
    "    }\n" +
    "\n" +
    "    .table-header-rotated th.rotate-45 span {\n" +
    "        -ms-transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        -moz-transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        -webkit-transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        -o-transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        transform: skew(45deg, 0deg) rotate(315deg);\n" +
    "        position: absolute;\n" +
    "        bottom: 55px;\n" +
    "        left: -46px;\n" +
    "        display: inline-block;\n" +
    "        width: 140px;\n" +
    "        text-align: left;\n" +
    "        white-space: nowrap;\n" +
    "        text-overflow: ellipsis;\n" +
    "        overflow: hidden;\n" +
    "    }\n" +
    "\n" +
    "</style>\n" +
    "<div class=\"opx-layout-vflex\" xxx__uaa-has-permission=\"cac:view:*\"\n" +
    "     xxx__uaa-deny-message=\"{{'common.uaa.no_permission'}}\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"app.cac3.check_log.list({templateId:checkResultOverviewVm.views.checkLog.templateId})\">{{'cac.index.job' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">\n" +
    "                    {{checkResultOverviewVm.views.checkLog.name}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div  uaa-has-permission=\"cac:edit:*\">\n" +
    "            <a href=\"#\" ng-click=\"checkResultOverviewVm.views.exportExcel($event)\">\n" +
    "                <button class=\"btn btn-default btn-sm\">\n" +
    "                    <i class=\"fa fa-file-export\"></i> {{'cac.result.detail.export' | translate}}\n" +
    "                </button>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"scroll-y opx-flex-fill p-3\" ng-if=\"checkResultOverviewVm.views.profileView === 'normal'\"\n" +
    "         __when-scrolled=\"checkResultOverviewVm.views.loadMore()\">\n" +
    "\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <ul class=\"list-unstyled d-flex align-items-center\">\n" +
    "                    <li>\n" +
    "                        <button type=\"button\"\n" +
    "                                class=\"rounded-pill btn btn-sm btn-{{checkResultOverviewVm.status[checkResultOverviewVm.views.checkLog.status].style}}\"\n" +
    "                                ng-click=\"checkResultOverviewVm.views.showLog()\">\n" +
    "                            {{checkResultOverviewVm.status[checkResultOverviewVm.views.checkLog.status].title}}\n" +
    "                        </button>\n" +
    "                    </li>\n" +
    "                    <li class=\"ms-3\">\n" +
    "                        <strong>{{'common.entity.detail.start_at' | translate}}：</strong>{{checkResultOverviewVm.views.checkLog.createdAt | date:'yyyy-MM-dd HH:mm:ss'}}\n" +
    "                    </li>\n" +
    "                    <li class=\"ms-3\">\n" +
    "                        <strong>{{'common.entity.detail.end_at' | translate}}：</strong>{{checkResultOverviewVm.views.checkLog.endAt | date:'yyyy-MM-dd HH:mm:ss'}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <table class=\"table\"ng-repeat=\"item in checkResultOverviewVm.views.auditParams\">\n" +
    "                    <tbody>\n" +
    "                    <tr>\n" +
    "                        <th style=\"width:8rem;\">\n" +
    "                            <div>{{'cac.common.host' | translate}} <span\n" +
    "                                    class=\"rounded-pill badge bg-secondary\">{{item.hosts.length}}</span>\n" +
    "                                <div ng-if=\"item.hosts.length > 10\">\n" +
    "                                    <button class=\"btn btn-default btn-sm\"\n" +
    "                                            ng-click=\"checkResultOverviewVm.views.showHostKey = true\"\n" +
    "                                            ng-if=\"!checkResultOverviewVm.views.showHostKey && item.hosts.length > 10\">\n" +
    "                                        {{'common.entity.action.more' | translate}} <i\n" +
    "                                            class=\"fa fa-angle-down\"></i></button>\n" +
    "                                    <button class=\"btn btn-default btn-sm\"\n" +
    "                                            ng-click=\"checkResultOverviewVm.views.showHostKey = false\"\n" +
    "                                            ng-if=\"checkResultOverviewVm.views.showHostKey\">\n" +
    "                                        {{'common.entity.action.collapse' | translate}} <i\n" +
    "                                            class=\"fa fa-angle-up\"></i>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </th>\n" +
    "                        <td>\n" +
    "                            <ul class=\"list list-unstyled list-inline\">\n" +
    "                                <li ng-repeat=\"host in item.hosts\"\n" +
    "                                    ng-if=\"$index <= 10 || checkResultOverviewVm.views.showHostKey\">\n" +
    "                                    <span class=\"badge bg-secondary\">{{host.value}}</span>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                    <tr>\n" +
    "                        <th style=\"width:8rem;\">\n" +
    "                            <div>{{'cac3.title.patrolInspectionItems' | translate}} <span\n" +
    "                                    class=\"rounded-pill badge bg-secondary\">{{item.items.length}}</span>\n" +
    "                                <div ng-if=\"item.items.length > 10\">\n" +
    "                                    <button class=\"btn btn-default btn-sm\"\n" +
    "                                            ng-click=\"checkResultOverviewVm.views.showItem = true\"\n" +
    "                                            ng-if=\"!checkResultOverviewVm.views.showItem && item.items.length > 10\">\n" +
    "                                        {{'common.entity.action.more' | translate}} <i\n" +
    "                                            class=\"fa fa-angle-down\"></i></button>\n" +
    "                                    <button class=\"btn btn-default btn-sm\"\n" +
    "                                            ng-click=\"checkResultOverviewVm.views.showItem = false\"\n" +
    "                                            ng-if=\"checkResultOverviewVm.views.showItem\">\n" +
    "                                        {{'common.entity.action.collapse' | translate}} <i\n" +
    "                                            class=\"fa fa-angle-up\"></i>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </th>\n" +
    "                        <td>\n" +
    "                            <ul class=\"list list-unstyled list-inline\">\n" +
    "                                <li ng-repeat=\"inspection in item.items\"\n" +
    "                                    ng-if=\"$index <= 10 || checkResultOverviewVm.views.showItem\">\n" +
    "                                    <span class=\"badge bg-secondary\">{{inspection.name}}</span>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <udp-page-view class=\"flex-fill scroll-y\" page-id=\"'/cac/assets/udp/cac3-results'\" page-source=\"file\"\n" +
    "                               page-params=\"checkResultOverviewVm.params\"\n" +
    "                               uaa-has-permission=\"cac:view:*\"\n" +
    "                               uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "                </udp-page-view>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"card card-default\">\n" +
    "            <div class=\"card-header\">\n" +
    "                <div class=\"card-title\">\n" +
    "                    <div class=\"pull-right\">\n" +
    "\n" +
    "                        <a class=\"btn btn-default btn-sm\" ng-click=\"checkResultOverviewVm.views.changeResultView()\">\n" +
    "                            <i class=\"fa\"\n" +
    "                               ng-class=\"checkResultOverviewVm.views.resultView === 'list'?'fa-th-large':'fa-list'\"></i>\n" +
    "                            {{checkResultOverviewVm.views.resultView === 'list' ? ('cac.result.detail.summary_view' | translate) : ('cac.result.detail.list_view' | translate)\n" +
    "                            }}\n" +
    "                        </a>\n" +
    "\n" +
    "                    </div>\n" +
    "                    <h3>\n" +
    "                        <strong>\n" +
    "                        {{'cac.result.detail.check_item' | translate}}{{'common.entity.action.detail' | translate}}\n" +
    "                        </strong>\n" +
    "                    </h3>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\" ui-view=\"cacCheckResult\">\n" +
    "                <p ng-if=\"checkResultOverviewVm.views.data_table.length==0 && checkResultOverviewVm.views.isLoading == false\"\n" +
    "                   class=\"text-muted\"\n" +
    "                   style=\"text-align: center\"><i\n" +
    "                        class=\"fa fa-inbox\"></i>{{'common.messages.no_data' | translate}}</p>\n" +
    "\n" +
    "\n" +
    "                <div ng-if=\"checkResultOverviewVm.views.data_table.length>0\">\n" +
    "                    <ul class=\"text-right list-unstyled list-inline small mb-3\">\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-success\"><i class=\"fa fa-check\"></i></span>\n" +
    "                            {{'cac.result.audit_result.pass' | translate}}\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-danger\"><i class=\"fa fa-times\"></i></span>\n" +
    "                            {{'cac.result.audit_result.failed' | translate}}\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-warning\"><i class=\"fa fa-exclamation\"></i></span>\n" +
    "                            {{'cac.result.audit_result.check' | translate}}\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-default\"><i class=\"fa fa-question\"></i></span>\n" +
    "                            {{'common.messages.no_data' | translate}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "\n" +
    "                    <div id=\"metric-container\" style=\"width: 100%; height:20rem; overflow:auto;\">\n" +
    "                        <table class=\"table table-border table-header-rotated\" style=\"max-width: 100%; width: auto;\">\n" +
    "                            <thead>\n" +
    "                            <tr>\n" +
    "                                <th class=\"border-0\"></th>\n" +
    "                                <th class=\"rotate-45\" style=\"border-top: 0px;\"\n" +
    "                                    ng-repeat=\"rule in ::checkResultOverviewVm.views.rules track by $index\">\n" +
    "                                    <div title=\"{{::rule.itemName}}\">\n" +
    "                                        <span>{{::rule.itemName}}</span>\n" +
    "                                    </div>\n" +
    "                                </th>\n" +
    "                            </tr>\n" +
    "                            </thead>\n" +
    "                            <tbody vs-repeat=\"{autoresize:true, latch:false, scrollParent:'#metric-container'}\">\n" +
    "                            <tr ng-repeat=\"item in checkResultOverviewVm.views.data_table track by item.hostKey\">\n" +
    "                                <td class=\"cac-result-first-td text-center\" title=\"{{::item.hostKey}}\"\n" +
    "                                    style=\"width: 150px!important;\"\n" +
    "                                    ng-class=\"{'text-danger':item.isUnreachable,'text-muted':item.isSkipping}\">\n" +
    "                                    <span ng-if=\"::item.isUnreachable\"\n" +
    "                                          title=\"{{'cac.result.audit_result.unreachable' | translate}}\"><i\n" +
    "                                            class=\"fa fa-ban\"></i></span>\n" +
    "                                    <span ng-if=\"::item.isSkipping\"\n" +
    "                                          title=\"{{'cac.result.audit_result.skipping' | translate}}\"><i\n" +
    "                                            class=\"fa fa-forward\"></i></span>\n" +
    "                                    {{::item.hostKey}}\n" +
    "                                </td>\n" +
    "                                <td class=\"text-center opx-autocolor {{::rule.class}}\" title=\"{{::rule.title}}\"\n" +
    "                                    ng-repeat=\"rule in ::item.rules track by $index\"\n" +
    "                                    ng-click=\"::checkResultOverviewVm.views.clickResult(rule.id,rule)\">\n" +
    "                                    <i class=\"fa {{::rule.iconClass}}\"></i>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"checkResultOverviewVm.views.data_table.length==0&&checkResultOverviewVm.views.isLoading\"\n" +
    "                     class=\"op-blank-slate\">\n" +
    "                    <div class=\"op-blank-slate-icon\"><i class=\"fa fa-inbox fa-4x\"></i></div>\n" +
    "                    <p>{{'common.entity.loading' | translate}}</p>\n" +
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
    "\n" +
    "")

$templateCache.put("app/modules/cac/results/check-result-to-rule.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"> {{checkResultToRuleCtrlVm.views.hostKey}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\"\n" +
    "            ng-click=\"checkResultToRuleCtrlVm.views.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body cac-history-find-dialog\">\n" +
    "    <div>\n" +
    "        <strong class=\"d-inline-block\" style=\"width:6em;\">{{'cac.template.detail.audit_params' | translate}}</strong>\n" +
    "        <span> {{checkResultToRuleCtrlVm.views.metricName}}</span>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <strong class=\"d-inline-block\" style=\"width:6em;\">{{'cac.common.result' | translate}}</strong>\n" +
    "        <span ng-class='checkResultToRuleCtrlVm.views.metricStatusClass'> {{checkResultToRuleCtrlVm.views.metricStatus}}</span>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <strong>{{'cac.result.output' | translate}}</strong>\n" +
    "    </div>\n" +
    "    <div class=\"bg-light p-3\">\n" +
    "        <pre style=\"white-space: pre-wrap\">{{checkResultToRuleCtrlVm.views.metricValue}}</pre>\n" +
    "    </div>\n" +
    "   \n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <p class=\"text-right\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"checkResultToRuleCtrlVm.views.cancel()\">{{'common.entity.action.close' | translate}}</button>\n" +
    "    </p>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/rule/rule-edit.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        {{cacRuleEditVm.views.rule.id == null ? ('cac.rule.create' | translate) : ('cac.rule.edit' | translate)}}\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "            ng-click=\"cacRuleEditVm.views.cancel()\">\n" +
    "        &times;\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <form name=\"addRuleForm \">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">{{'common.entity.detail.name' | translate}} <span\n" +
    "                    class=\"cac-text-required\">*</span></label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"ruleName\" ng-model=\"cacRuleEditVm.views.rule.ruleName\"\n" +
    "                   required>\n" +
    "            <span class=\"cac-warning\" ng-show=\"cacRuleEditVm.views.uniqueFlag\">{{'common.entity.validation.unique' | translate}}</span>\n" +
    "        </div>\n" +
    "<!--        <div class=\"form-group\">-->\n" +
    "<!--            <label class=\"control-label\">标签 </label>-->\n" +
    "<!--            <select data-placeholder=\"请选择标签\" multiple=\"\" style=\"width: 100%\" chosen=\"\"-->\n" +
    "<!--                    ng-model=\"cacRuleEditVm.views.rule.label\">-->\n" +
    "<!--                <option class=\"\" value=\"{{label}}\" ng-repeat=\"label in cacRuleEditVm.views.labels\">-->\n" +
    "<!--                    {{label}}-->\n" +
    "<!--                </option>-->\n" +
    "<!--            </select>-->\n" +
    "<!--        </div>-->\n" +
    "        <div class=\"form-group cac-rule-expression\">\n" +
    "            <label class=\"control-label ruleExpression\">{{'cac.rule.detail.expr' | translate}} <span class=\"cac-text-required\">*</span></label>\n" +
    "            <textarea ui-codemirror=\"cacRuleEditVm.views.option\" class=\"cac-job-result-pre\"\n" +
    "                      ng-model=\"cacRuleEditVm.views.rule.ruleExpression\" required></textarea>\n" +
    "            <!--ng-pattern=\"/\\$_?[a-zA-Z!(]+[%&,=?$|\\.:{}\\x22\\w+-<>!()\\u4e00-\\u9fa5\\/]*/g\"-->\n" +
    "        </div>\n" +
    "        <div class=\"form-group cac-rule-applicability\">\n" +
    "            <label class=\"control-label ruleExpression\">\n" +
    "                <a ng-click=\"cacRuleEditVm.views.showApplicability=!cacRuleEditVm.views.showApplicability\">{{'cac.rule.detail.applicability' | translate}}\n" +
    "                    <i class=\"fa fa-plus-square\" ng-if=\"!cacRuleEditVm.views.showApplicability\"></i>\n" +
    "                    <i class=\"fa fa-minus-square-o\" ng-if=\"cacRuleEditVm.views.showApplicability\"></i>\n" +
    "                </a>\n" +
    "            </label>\n" +
    "            <textarea ui-codemirror=\"cacRuleEditVm.views.option\" class=\"cac-job-result-pre\"\n" +
    "                      ng-model=\"cacRuleEditVm.views.rule.applicability\"\n" +
    "                      ng-if=\"cacRuleEditVm.views.showApplicability\"></textarea>\n" +
    "        </div>\n" +
    "\n" +
    "        <!--<div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">说  明  </label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <textarea type=\"textarea\" class=\"form-control\" placeholder=\"\"\n" +
    "                          ng-model=\"cacRuleEditVm.views.rule.description\" row=\"3\"></textarea>\n" +
    "            </div>\n" +
    "        </div>-->\n" +
    "\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-primary opx-btn-ok\" ng-click=\"cacRuleEditVm.views.save()\"\n" +
    "            ng-disabled=\"addRuleForm.$invalid\">{{'common.entity.acton.save' | translate}}\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cacRuleEditVm.views.cancel()\">{{'common.entity.action.cancel' | translate}}\n" +
    "    </button>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/rule/rule-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light bg-light\">\n" +
    "        <div class=\"nav-item\">\n" +
    "            <button class=\"btn btn-primary btn-sm cac-title-button-l\"\n" +
    "                    uaa-has-permission=\"cac:*:*\"\n" +
    "                    ng-click=\"cacRuleListCtrlVm.views.addRule()\"><i class=\"fa fa-plus m-r-xs\"></i> {{'cac.rule.create' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"nav-item ms-auto\">\n" +
    "            <botton id=\"uploadRuleExcel\" type=\"file\" ngf-select\n" +
    "                    ngf-change=\"cacRuleListCtrlVm.views.uploadRuleExcel($file)\"\n" +
    "                    class=\"btn btn-default btn-sm\">\n" +
    "                <i class=\"fa fa-upload\"></i> {{'common.entity.action.import' | translate}}\n" +
    "            </botton>\n" +
    "            <a href=\"#\" ng-click=\"cacRuleListCtrlVm.views.exportRules($event)\">\n" +
    "                <button class=\"btn btn-default btn-sm\">\n" +
    "                    <i class=\"fa fa-download\"></i> {{'common.entity.action.export' | translate}}\n" +
    "                </button>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"table-responsive bg-white w-full wrapper\">\n" +
    "        <table id=\"cacRuleTable\" class=\"rule-table table opx-table\"></table>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/script/script-content-edit.html","\n" +
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "            ng-click=\"cacScriptEditVm.views.cancel()\">\n" +
    "        &times;\n" +
    "    </button>\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        {{cacScriptEditVm.views.scriptName}}\n" +
    "    </h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-sm-12\">\n" +
    "                <textarea ui-codemirror=\"cacScriptEditVm.views.option\" class=\"cac-script-codemirror\"\n" +
    "                          ng-model=\"cacScriptEditVm.views.scriptContent\" ng-disabled=\"disabled\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cacScriptEditVm.views.cancel()\">{{'common.entity.action.cancel' | translate}}\n" +
    "    </button>\n" +
    "    <!--<button type=\"button\" class=\"btn btn-success\" ng-click=\"cacScriptEditVm.views.saveScriptContent()\">\n" +
    "        保存\n" +
    "    </button>-->\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/script/script-edit.html","\n" +
    "\n" +
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "            ng-click=\"cacScriptEditVm.views.cancel()\">\n" +
    "        &times;\n" +
    "    </button>\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        {{'cac.script.edit' | translate}}\n" +
    "    </h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <form name=\"editScriptForm \" class=\"form-horizontal\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">{{'cac.script.name' | translate}} <span class=\"cac-text-required\">*</span></label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"scriptName\"\n" +
    "                       ng-model=\"cacScriptEditVm.views.script.scriptName\"><!--readonly-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">{{'cac.script.detail.param' | translate}} </label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" \n" +
    "                       ng-model=\"cacScriptEditVm.views.script.scriptParams\">\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">{{'cac.script.notice.0' | translate}} </label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <p><strong>{{'cac.script.notice.1' | translate}}</strong>  </p>\n" +
    "                <p>{{'cac.script.notice.2' | translate}}</p>\n" +
    "                <p>{{'cac.script.notice.3' | translate}}</p>\n" +
    "                <p>{{'cac.script.notice.4' | translate}}</p>\n" +
    "                <p>{{'cac.script.notice.5' | translate}}</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!--<div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">脚本类型 <span class=\"text-required\">*</span></label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" \n" +
    "                       ng-model=\"cacScriptEditVm.views.script.scriptType\" required>\n" +
    "            </div>\n" +
    "        </div>-->\n" +
    "        <!--<div class=\"form-group\">-->\n" +
    "            <!--<label class=\"col-sm-2 control-label\">创建人</label>-->\n" +
    "            <!--<div class=\"col-sm-10\">-->\n" +
    "                <!--<input type=\"text\" class=\"form-control\" -->\n" +
    "                       <!--ng-model=\"cacScriptEditVm.views.script.createdBy\">-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">脚本说明</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <textarea type=\"textarea\" class=\"form-control\"  rows=\"3\"\n" +
    "                       ng-model=\"cacScriptEditVm.views.script.description\" >\n" +
    "                </textarea>\n" +
    "            </div>\n" +
    "        </div>-->\n" +
    "\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cacScriptEditVm.views.cancel()\">{{'common.entity.action.cancel' | translate}}\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-success\" ng-click=\"cacScriptEditVm.views.save()\"\n" +
    "            ng-disabled=\"editScriptForm.$invalid\">\n" +
    "        {{'common.entity.action.save' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/script/script-list.html","<div class=\"op-layout-v\">\n" +
    "    <nav class=\"op-header-nav\">\n" +
    "        <ol class=\"breadcrumb\">\n" +
    "            <li>\n" +
    "                <button class=\"btn btn-primary btn-sm cac-title-button-l\" uaa-has-permission=\"cac:*:*\"\n" +
    "                        ng-click=\"cacScriptListCtrlVm.views.addScript()\"><i class=\"fa fa-plus m-r-xs\"></i> {{'cac.script.upload.title' | translate}}</button>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </nav>\n" +
    "    <div class=\"op-viewport\" style=\"padding:0px;top:49px;\">\n" +
    "        <div class=\"card card-default\">\n" +
    "            <!--<div class=\"card-header\">-->\n" +
    "                <!--<div class=\"card-title\">-->\n" +
    "                <!--<span hidden>脚本列表</span>-->\n" +
    "                <!--<button class=\"btn btn-primary btn-sm cac-title-button-l\" uaa-has-permission=\"cac:*:*\"-->\n" +
    "                   <!--ng-click=\"cacScriptListCtrlVm.views.addScript()\"><i class=\"fa fa-plus m-r-xs\"></i> 上传脚本</button>-->\n" +
    "                <!--&lt;!&ndash;<button class=\"btn btn-default btn-sm pull-right\" ui-sref=\"app.cac.scripts_upload\"><i class=\"fa fa-plus m-r-xs\"></i> 上传脚本q</button>&ndash;&gt;-->\n" +
    "                <!--</div>-->\n" +
    "            <!--</div>-->\n" +
    "            <div class=\"card-body\">\n" +
    "                <div class=\"table-responsive\">\n" +
    "                    <table id=\"cacScriptTable\" class=\"script-table table opx-table\"></table>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/script/script-upload.html","\n" +
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "            ng-click=\"cacScriptUploadVm.views.cancel()\">\n" +
    "        &times;\n" +
    "    </button>\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        {{'cac.script.upload.title' | translate}}\n" +
    "    </h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <form name=\"addScriptForm \" class=\"form-horizontal\" enctype=\"multipart/form-data\">\n" +
    "\n" +
    "         <!--<div class=\"fileDiv{{$index}}\" ng-repeat=\"item in cacScriptUploadVm.views.scriptList\">-->\n" +
    "             <div class=\"form-group\">\n" +
    "                 <label class=\"col-sm-2 control-label\">{{'cac.script.upload.file' | translate}}</label>\n" +
    "                 <div class=\"col-sm-10\">\n" +
    "                     <input type=\"file\" id=\"file{{$index}}\" class=\"file\" ngf-select ngf-change=\"cacScriptUploadVm.views.changeAttach($file,$index)\">\n" +
    "                     <p ng-show=\"cacScriptUploadVm.views.isExit\" class=\"cac-text-required\">{{'cac.script.upload.exists' | translate}}</p>\n" +
    "                     <p ng-show=\"cacScriptUploadVm.views.isChinese\" class=\"text-danger\">{{'cac.script.upload.has_chinese' | translate}}</p>\n" +
    "                    <!--{{cacScriptUploadVm.views.files[$index].name}}-->\n" +
    "                 </div>\n" +
    "             </div>\n" +
    "\n" +
    "             <!--<div class=\"col-sm-8\">\n" +
    "                 <a class=\"btn btn-info\" ng-click=\"cacScriptUploadVm.views.addScript()\"><i class=\"fa fa-plus\"></i> </a>\n" +
    "                 <a class=\"btn btn-info\" ng-click=\"cacScriptUploadVm.views.reduceScript($index)\"><i class=\"fa fa-minus\"></i> </a>\n" +
    "             </div>-->\n" +
    "             <div class=\"form-group\" hidden>\n" +
    "                 <label class=\"col-sm-2 control-label\">{{'cac.script.name' | translate}}</label>\n" +
    "                 <div class=\"col-sm-10\">\n" +
    "                     <input type=\"text\" name=\"file\" ng-model=\"cacScriptUploadVm.views.script.scriptName\" readonly/>\n" +
    "                 </div>\n" +
    "             </div>\n" +
    "             <div class=\"form-group\" hidden>\n" +
    "                 <label class=\"col-sm-2 control-label\">{{'cac.script.detail.type' | translate}}</label>\n" +
    "                 <div class=\"col-sm-10\">\n" +
    "                     <input type=\"text\" name=\"file\" ng-model=\"cacScriptUploadVm.views.script.scriptFormat\" readonly/>\n" +
    "                 </div>\n" +
    "             </div>\n" +
    "            <!-- <div class=\"form-group\">\n" +
    "                 <label class=\"col-sm-2 control-label\">脚本大小</label>\n" +
    "                 <div class=\"col-sm-10\">\n" +
    "                     <input type=\"text\" class=\"form-control\" ng-model=\"cacScriptUploadVm.views.script.scriptSize\"\n" +
    "                            readonly/>\n" +
    "                 </div>\n" +
    "             </div>-->\n" +
    "             <div class=\"form-group\">\n" +
    "                 <label class=\"col-sm-2 control-label\">{{'cac.script.detail.param' | translate}}</label>\n" +
    "                 <div class=\"col-sm-10\">\n" +
    "                     <input type=\"text\" class=\"form-control\" ng-model=\"cacScriptUploadVm.views.script.scriptParams\"/>\n" +
    "                 </div>\n" +
    "             </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"col-sm-2 control-label\">{{'cac.script.notice.0' | translate}} </label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <p><strong>{{'cac.script.notice.1' | translate}}</strong>  </p>\n" +
    "                <p>{{'cac.script.notice.2' | translate}}</p>\n" +
    "                <p>{{'cac.script.notice.3' | translate}}</p>\n" +
    "                <p>{{'cac.script.notice.4' | translate}}</p>\n" +
    "                <p>{{'cac.script.notice.5' | translate}}</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "            <!-- <div class=\"form-group\">\n" +
    "                 <label class=\"col-sm-2 control-label\">脚本分类</label>\n" +
    "                 <div class=\"col-sm-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"cacScriptUploadVm.views.script.scriptType\" />\n" +
    "                 </div>\n" +
    "             </div>\n" +
    "-->\n" +
    "         <!--</div>-->\n" +
    "\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cacScriptUploadVm.views.cancel()\">{{'common.entity.action.cancel' | translate}}</button>\n" +
    "    <button type=\"button\" class=\"btn btn-success\" ng-click=\"cacScriptUploadVm.views.save()\"\n" +
    "            ng-disabled=\"addScriptForm.$invalid\">\n" +
    "         {{'cac.script.upload.begin' | translate}}</button>\n" +
    "    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"cacScriptUploadVm.views.saveAndNew(false)\"\n" +
    "            ng-disabled=\"addScriptForm.$invalid\">\n" +
    "        {{'cac.script.upload.begin_and_new' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/template/cac-team-config.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"app.cac.template.list({display:true})\">{{'cac.index.template' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">{{cacTeamConfigCtrlVm.views.templateName}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <div class=\"alert alert-success\" role=\"alert\">\n" +
    "            <button type=\"button\" class=\"btn-close pull-right\" data-dismiss=\"alert\"></button>\n" +
    "            <div>\n" +
    "                <h4><strong>{{'cac.team.config_title' | translate}} </strong></h4>\n" +
    "                <div>{{'cac.team.config_msg' | translate}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-body\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-3\"  ng-repeat=\"teamData in cacTeamConfigCtrlVm.views.teamsInfoData\" style=\"margin-top: 5px;\">\n" +
    "                            <div class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                                <input type=\"checkbox\" style=\"cursor: pointer;\"\n" +
    "                                       ng-checked=\"teamData.isChecked\"\n" +
    "                                       ng-click=\"cacTeamConfigCtrlVm.views.choice_data(teamData)\" />\n" +
    "                                <label class=\"\">{{teamData.teamName}}</label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/template/template-dashboard.html","<div class=\"opx-layout-vflex\">\n" +
    "<!--    \"-->\n" +
    "    <udp-page-view class=\"flex-fill scroll-y\" page-id=\"'/cac/assets/udp/cac-dashboard'\" page-source=\"file\"\n" +
    "                   page-params=\"cacDashboardTemplateCtrlVm.params\"\n" +
    "                   uaa-has-permission=\"cac:view:*\"\n" +
    "                   uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    </udp-page-view>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/template/template-edit-content.html","<div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\"><!--<span class=\"cac-text-required\">*</span>-->{{'common.entity.detail.name' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input type=\"text\" class=\"form-control\"\n" +
    "                   ng-model=\"cacEditTemplateCtrlVm.views.template.templateName\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'common.entity.detail.description' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <textarea type=\"text\" class=\"form-control uneditable-input\"\n" +
    "                      ng-model=\"cacEditTemplateCtrlVm.views.template.description\">\n" +
    "            </textarea>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- 取消普通脚本类型，巡检脚本类型统一playbook -->\n" +
    "    <!--<div class=\"form-group\">-->\n" +
    "        <!--<label class=\"control-label\">脚本类型</label>-->\n" +
    "        <!--<div class=\"form-control-wrapper\">-->\n" +
    "            <!--<div class=\"opx-check-group btn-group\">-->\n" +
    "                <!--<input type=\"radio\" name=\"scriptType\" ng-model=\"cacEditTemplateCtrlVm.views.template.scriptType\"-->\n" +
    "                       <!--ng-disabled=\"cacEditTemplateCtrlVm.views.template.id\"-->\n" +
    "                       <!--id=\"tec-type-playbook\"-->\n" +
    "                       <!--value=\"playbook\" ng-click=\"cacEditTemplateCtrlVm.views.changePlaybook()\"><label-->\n" +
    "                    <!--for=\"tec-type-playbook\">Ansible-->\n" +
    "                <!--Playbook</label>-->\n" +
    "                <!--<input type=\"radio\" name=\"scriptType\" ng-model=\"cacEditTemplateCtrlVm.views.template.scriptType\"-->\n" +
    "                       <!--id=\"tec-type-script\"-->\n" +
    "                       <!--ng-disabled=\"cacEditTemplateCtrlVm.views.template.id\"-->\n" +
    "                       <!--value=\"adhoc\"><label for=\"tec-type-script\">普通脚本</label>-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <div class=\"form-group\" ng-if=\"cacEditTemplateCtrlVm.views.jobStatus != 'adding'\">\n" +
    "        <label class=\"control-label\">{{'common.entity.detail.icon' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <op-iconpicker ng-model=\"cacEditTemplateCtrlVm.views.template.icon\"></op-iconpicker>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--<div class=\"form-group\">-->\n" +
    "    <!--<label class=\"control-label\">颜色</label>-->\n" +
    "    <!--<div class=\"form-control-wrapper\">-->\n" +
    "    <!--<select class=\"form-select\" ng-model=\"cacEditTemplateCtrlVm.views.template.thumbcolor\"-->\n" +
    "    <!--ng-options=\"color as color for color in colors | orderBy:'toString()'\"></select>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--<div class=\"col-sm-6\" style=\"top: -20px\">-->\n" +
    "    <!--<div class=\"card udp-card udp-card-with-icon\" style=\"width:300px;height: 100px\">-->\n" +
    "    <!--<div class=\"card-body opx-autocolor\" ng-class=\"cacEditTemplateCtrlVm.views.template.thumbcolor || 'bg-light'\" style=\"height: 100%;padding: 15px;padding-top: 20px\">-->\n" +
    "    <!--<h3 class=\"mb-3 font-weight-bold text-ellipsis\" title=\"{{cacEditTemplateCtrlVm.views.template.templateName}}\">{{cacEditTemplateCtrlVm.views.template.templateName}} </h3>-->\n" +
    "    <!--<div class=\"udp-card-icon\" style=\"right: 30px;top: 10px\"><i class=\"fa\" ng-class=\"cacEditTemplateCtrlVm.views.template.icon\"></i>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <div class=\"\">\n" +
    "        <!--            <label class=\"col-sm-1 control-label \"></label>-->\n" +
    "<!--        <div class=\"m-b-sm clearfix\">-->\n" +
    "<!--            <a class=\"btn btn-default pull-right\"-->\n" +
    "<!--               ng-if=\"cacEditTemplateCtrlVm.views.template.scriptType!=cacEditTemplateCtrlVm.views.playbookConstant\"-->\n" +
    "<!--               ng-click=\"cacEditTemplateCtrlVm.views.addParams()\" title=\"添加检查项\">-->\n" +
    "<!--                <i class=\"fa fa-plus\"></i>添加检查项</a>-->\n" +
    "<!--            &lt;!&ndash;            <p class=\"pull-right text-danger m-t-xs\">注：请选择对应的主机和脚本 &nbsp;</p>&ndash;&gt;-->\n" +
    "<!--        </div>-->\n" +
    "        <div class=\"card card-default op-action-card\"\n" +
    "             ng-repeat=\"item in cacEditTemplateCtrlVm.views.auditParams track by $index\">\n" +
    "            <div class=\"card-header\" ng-click=\"cacEditTemplateCtrlVm.views.showAuditParamsDetails($index)\">\n" +
    "                <div style=\"flex:1\">\n" +
    "<!--                        <span class=\"d-inline-block\" style=\"width:8em;\"><strong>检查项{{$index+1}}</strong>-->\n" +
    "<!--                        <span class=\"fa\" ng-class=\"item.isCollapsed?'fa-angle-right':'fa-angle-down'\"></span>-->\n" +
    "<!--                        </span>-->\n" +
    "                    <!--<span ng-if=\"cacEditTemplateCtrlVm.views.template.scriptType!=cacEditTemplateCtrlVm.views.playbookConstant\"-->\n" +
    "                          <!--style=\"margin-right:1em;\"><span><i class=\"fa fa-random\"></i> 规则 </span>-->\n" +
    "                            <!--<strong style=\"font-size: large\">{{item.ruleExpressions.length}} </strong></span>-->\n" +
    "                    <span style=\"margin-right:1em;\"><span><i class=\"fa fa-laptop\"></i> {{'cac.common.host' | translate}} </span>\n" +
    "                        <strong style=\"font-size: large\">{{item.hosts.length}}</strong></span>\n" +
    "                    <span><span><i class=\"fa fa-file-code-o\"></i> {{'cac.common.script' | translate}} </span>\n" +
    "                        <strong style=\"font-size: large\">{{item.scripts.length}} </strong></span>\n" +
    "                </div>\n" +
    "<!--                <div class=\"text-right opx-flex-fill\">-->\n" +
    "<!--                    <a class=\"btn btn-default btn-sm\" uaa-has-permission=\"cac:*:*\"-->\n" +
    "<!--                       ng-click=\"cacEditTemplateCtrlVm.views.deleteParams($index)\" title=\"删除检查项\"><i-->\n" +
    "<!--                            class=\"fa fa-close\"></i></a>-->\n" +
    "<!--                </div>-->\n" +
    "            </div>\n" +
    "            <div class=\"card-body\" ng-if=\"!item.isCollapsed\"\n" +
    "                 ng-init=\"cacEditTemplateCtrlVm.views.showRuleName = false;cacEditTemplateCtrlVm.views.showHostName = false\">\n" +
    "                <!--<section class=\"m-b-sm\"-->\n" +
    "                         <!--ng-if=\"cacEditTemplateCtrlVm.views.template.scriptType!=cacEditTemplateCtrlVm.views.playbookConstant\">-->\n" +
    "                    <!--<div class=\"m-b-sm\" style=\"width:6em;\" ng-init=\"\">-->\n" +
    "                        <!--规则 {{item.ruleExpressions.length || ''}}-->\n" +
    "                        <!--<a class=\"btn btn-default btn-sm opx-btn-icon\" uaa-has-permission=\"cac:*:*\"-->\n" +
    "                           <!--ng-click=\"cacEditTemplateCtrlVm.views.selectCacTemplateRules(item,$index)\">-->\n" +
    "                            <!--<i class=\"fa fa-plus\"></i></a>-->\n" +
    "                        <!--<div ng-if=\"item.ruleExpressions.length > 9\">-->\n" +
    "                            <!--<button class=\"btn btn-default btn-sm\"-->\n" +
    "                                    <!--ng-click=\"cacEditTemplateCtrlVm.views.showRuleName = true\"-->\n" +
    "                                    <!--ng-if=\"!cacEditTemplateCtrlVm.views.showRuleName && item.ruleExpressions.length > 9\">-->\n" +
    "                                <!--查看更多<i class=\"fa fa-angle-down\"></i>-->\n" +
    "                            <!--</button>-->\n" +
    "                            <!--<button class=\"btn btn-default btn-sm\" ng-if=\"cacEditTemplateCtrlVm.views.showRuleName\"-->\n" +
    "                                    <!--ng-click=\"cacEditTemplateCtrlVm.views.showRuleName = false\">-->\n" +
    "                                <!--收起 <i class=\"fa fa-angle-up\"></i>-->\n" +
    "                            <!--</button>-->\n" +
    "                        <!--</div>-->\n" +
    "                    <!--</div>-->\n" +
    "                    <!--<div class=\"bg-light wrapper-xs\">-->\n" +
    "                        <!--<div class=\"op-blank-slate p-3\" ng-if=\"item.ruleExpressions.length===0\">-->\n" +
    "                            <!--<div class=\"op-blank-slate-body\">-->\n" +
    "                                <!--<div class=\"op-blank-slate-icon\">-->\n" +
    "                                    <!--<i class=\"fa fa-3x fa-random\"></i>-->\n" +
    "                                <!--</div>-->\n" +
    "                                <!--<p>没有定义规则</p>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</div>-->\n" +
    "                        <!--<ul class=\"list list-unstyled list-inline\">-->\n" +
    "                            <!--<li ng-repeat=\"rule in item.ruleExpressions\" style=\"padding:2px 4px;\"-->\n" +
    "                                <!--ng-if=\"$index < 10 || cacEditTemplateCtrlVm.views.showRuleName\">-->\n" +
    "                                <!--<span class=\"badge bg-secondary\">{{rule.ruleName}}</span>-->\n" +
    "                            <!--</li>-->\n" +
    "                        <!--</ul>-->\n" +
    "                    <!--</div>-->\n" +
    "                <!--</section>-->\n" +
    "\n" +
    "                <!--<section class=\"m-b-sm\">-->\n" +
    "                    <!--<div class=\"m-b-sm\" style=\"width:6em;\">主机-->\n" +
    "                        <!--<a class=\"btn btn-default btn-sm opx-btn-icon\" uaa-has-permission=\"cac:*:*\"-->\n" +
    "                           <!--ng-click=\"cacEditTemplateCtrlVm.views.selectCacTemplateHosts(item,$index)\">-->\n" +
    "                            <!--<i class=\"fa fa-plus\"></i></a>-->\n" +
    "                        <!--<div ng-if=\"item.hosts.length > 9\">-->\n" +
    "                            <!--<button class=\"btn btn-default btn-sm\"-->\n" +
    "                                    <!--ng-click=\"cacEditTemplateCtrlVm.views.showHostKey = true\"-->\n" +
    "                                    <!--ng-if=\"!cacEditTemplateCtrlVm.views.showHostKey && item.hosts.length > 9\">-->\n" +
    "                                <!--查看更多 <i class=\"fa fa-angle-down\"></i>-->\n" +
    "                            <!--</button>-->\n" +
    "                            <!--<button class=\"btn btn-default btn-sm\"-->\n" +
    "                                    <!--ng-click=\"cacEditTemplateCtrlVm.views.showHostKey = false\"-->\n" +
    "                                    <!--ng-if=\"cacEditTemplateCtrlVm.views.showHostKey\">-->\n" +
    "                                <!--收起 <i class=\"fa fa-angle-up\"></i>-->\n" +
    "                            <!--</button>-->\n" +
    "                        <!--</div>-->\n" +
    "                    <!--</div>-->\n" +
    "                    <!--<div class=\"bg-light wrapper-xs\">-->\n" +
    "                        <!--<div class=\"op-blank-slate p-3\" ng-if=\"item.hosts==''\">-->\n" +
    "                            <!--<div class=\"op-blank-slate-body\">-->\n" +
    "                                <!--<div class=\"op-blank-slate-icon\">-->\n" +
    "                                    <!--<i class=\"fa fa-3x fa-laptop\"></i>-->\n" +
    "                                <!--</div>-->\n" +
    "                                <!--<p>没有定义主机</p>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</div>-->\n" +
    "                        <!--<ul class=\"list list-unstyled list-inline\">-->\n" +
    "                            <!--<li ng-repeat=\"host in item.hosts\" style=\"padding:2px 4px;\"-->\n" +
    "                                <!--ng-if=\"$index < 10 || cacEditTemplateCtrlVm.views.showHostKey\">-->\n" +
    "                                <!--<span class=\"badge bg-secondary\">{{host.hostKey}}</span>-->\n" +
    "                            <!--</li>-->\n" +
    "                        <!--</ul>-->\n" +
    "                    <!--</div>-->\n" +
    "                <!--</section>-->\n" +
    "                <div class=\"form-group op-align-horizontal\">\n" +
    "                    <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'cac.common.script' | translate}}</label>\n" +
    "                    <gfs-file-selector the-model=\"item.scripts\" class=\"w-full\"\n" +
    "                                       model-converter=\"{type: 'attrmap', attrmap: {'scriptPath': 'path', 'scriptParams': 'config'}, modelType: 'array'}\"\n" +
    "                                       config=\"cacEditTemplateCtrlVm.views.fileSelectorConfig\"></gfs-file-selector>\n" +
    "                </div>\n" +
    "                <div class=\"form-group op-align-horizontal\">\n" +
    "                    <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'cac.common.host' | translate}}</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <div class=\"w-full\">\n" +
    "                            <div class=\"mt-3\">\n" +
    "                                <!--<jao-host-selector the-model=\"item.hosts\"></jao-host-selector>-->\n" +
    "                                <!--<acm-device-selector the-model=\"item.hosts\" mcheck-type=\"'map'\"></acm-device-selector>-->\n" +
    "                                <acm-device-selector the-model=\"item.hosts\" ci-types=\"'[auto]'\" mcheck-type=\"'map'\"></acm-device-selector>\n" +
    "                                <!--<acm-device-selector the-model=\"item.hosts\"></acm-device-selector>-->\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!--<section class=\"m-b-sm\">-->\n" +
    "                    <!--<div class=\"m-b-sm\" style=\"width:6em;\">-->\n" +
    "                        <!--脚本-->\n" +
    "                        <!--&lt;!&ndash;                        <a ng-if=\"!cacV2.enabled\" class=\"btn btn-default btn-sm opx-btn-icon\"&ndash;&gt;-->\n" +
    "                        <!--&lt;!&ndash;                           uaa-has-permission=\"cac:*:*\"&ndash;&gt;-->\n" +
    "                        <!--&lt;!&ndash;                           ng-click=\"cacEditTemplateCtrlVm.views.selectCacTemplateScripts(item,$index,cacEditTemplateCtrlVm.views.template.scriptType)\">&ndash;&gt;-->\n" +
    "                        <!--&lt;!&ndash;                            <i class=\"fa fa-plus\"></i></a>&ndash;&gt;-->\n" +
    "                        <!--<a ng-if=\"cacV2.enabled\" class=\"btn btn-default btn-sm opx-btn-icon\"-->\n" +
    "                           <!--ng-click=\"cacV2.selectScripts(item,$index,cacEditTemplateCtrlVm.views.template.scriptType)\">-->\n" +
    "                            <!--<i class=\"fa fa-plus\"></i>-->\n" +
    "                        <!--</a>-->\n" +
    "                    <!--</div>-->\n" +
    "                    <!--<div class=\"bg-light wrapper-xs\">-->\n" +
    "                        <!--<div class=\"op-blank-slate p-3\" ng-if=\"item.scripts.length===0\">-->\n" +
    "                            <!--<div class=\"op-blank-slate-body\">-->\n" +
    "                                <!--<div class=\"op-blank-slate-icon\">-->\n" +
    "                                    <!--<i class=\"fa fa-3x fa-file-code-o\"></i>-->\n" +
    "                                <!--</div>-->\n" +
    "                                <!--<p>没有定义脚本</p>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</div>-->\n" +
    "                        <!--<table ng-if=\"item.scripts.length>0\" class=\"table table-sm op-param-table\">-->\n" +
    "                            <!--<tbody>-->\n" +
    "                            <!--<tr ng-repeat=\"script in item.scripts\" style=\"vertical-align: middle\">-->\n" +
    "                                <!--<td>{{script.scriptName}}</td>-->\n" +
    "                                <!--<td style=\"width:100%;\"><input type=\"text\" class=\"form-control\" title=\"脚本参数\"-->\n" +
    "                                                               <!--placeholder=\"脚本参数\"-->\n" +
    "                                                               <!--ng-model=\"script.scriptParams\"-->\n" +
    "                                                               <!--name=\"script_{{$index}}\"></td>-->\n" +
    "                                <!--<td style=\"vertical-align: middle\">-->\n" +
    "                                    <!--<button class=\"btn btn-default btn-sm opx-btn-icon\"-->\n" +
    "                                            <!--ng-click=\"cacEditTemplateCtrlVm.views.removeScript(script.id,$parent.$index)\">-->\n" +
    "                                        <!--<i class=\"fa fa-close\" style=\"cursor: pointer\"></i>-->\n" +
    "                                    <!--</button>-->\n" +
    "                                <!--</td>-->\n" +
    "                            <!--</tr>-->\n" +
    "                            <!--</tbody>-->\n" +
    "                        <!--</table>-->\n" +
    "                    <!--</div>-->\n" +
    "                <!--</section>-->\n" +
    "            </div>\n" +
    "            <!--<div class=\"card-body\" ng-if=\"!item.isCollapsed\">-->\n" +
    "                <!--<div class=\"form-group op-align-horizontal\">-->\n" +
    "                    <!--<label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">执行频率</label>-->\n" +
    "                        <!--<div class=\"d-inline-block\">-->\n" +
    "                            <!--<div class=\"opx-check-group opx-secondary btn-group\">-->\n" +
    "                                <!--<select ng-model=\"$ctrl.execRate\" class=\"form-select\">-->\n" +
    "                                    <!--<option value=\"once\">执行一次</option>-->\n" +
    "                                    <!--<option value=\"year\">每年</option>-->\n" +
    "                                    <!--<option value=\"month\">每月</option>-->\n" +
    "                                    <!--<option value=\"week\">每周</option>-->\n" +
    "                                    <!--<option value=\"day\">每日</option>-->\n" +
    "                                <!--</select>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</div>-->\n" +
    "                        <!--<div class=\"d-inline-block\">-->\n" +
    "                            <!--<label style=\"margin-left: 10px\">起始日期</label>-->\n" +
    "                            <!--<div class=\"form-control-wrapper d-inline-block\">-->\n" +
    "                                <!--<div class=\"opx-check-group opx-secondary btn-group\">-->\n" +
    "                                    <!--<input class=\"form-control\" type=\"date\" ng-init=\"$ctrl.jobExec={}\">-->\n" +
    "                                <!--</div>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</div>-->\n" +
    "                        <!--<div ng-if=\"$ctrl.execRate === 'year'\" class=\"d-inline-block\">-->\n" +
    "                            <!--<label style=\"margin-left: 10px\">月</label>-->\n" +
    "                            <!--<div class=\"form-control-wrapper d-inline-block\">-->\n" +
    "                                <!--<div class=\"opx-check-group opx-secondary btn-group\">-->\n" +
    "                                    <!--<select ng-model=\"$ctrl.jobExec.month\" class=\"form-select\">-->\n" +
    "                                        <!--<option value=\"1\">1</option>-->\n" +
    "                                        <!--<option value=\"2\">2</option>-->\n" +
    "                                        <!--<option value=\"3\">3</option>-->\n" +
    "                                        <!--<option value=\"4\">4</option>-->\n" +
    "                                        <!--<option value=\"5\">5</option>-->\n" +
    "                                        <!--<option value=\"6\">6</option>-->\n" +
    "                                        <!--<option value=\"7\">7</option>-->\n" +
    "                                        <!--<option value=\"8\">8</option>-->\n" +
    "                                        <!--<option value=\"9\">9</option>-->\n" +
    "                                        <!--<option value=\"10\">10</option>-->\n" +
    "                                        <!--<option value=\"11\">11</option>-->\n" +
    "                                        <!--<option value=\"12\">12</option>-->\n" +
    "                                    <!--</select>-->\n" +
    "                                <!--</div>-->\n" +
    "                            <!--</div></div>-->\n" +
    "                        <!--<div ng-if=\"$ctrl.execRate === 'week'\" style=\"margin-left: 10px\" class=\"d-inline-block\">-->\n" +
    "                            <!--<label>周</label>-->\n" +
    "                            <!--<div class=\"form-control-wrapper d-inline-block\">-->\n" +
    "                                <!--<div class=\"opx-check-group opx-secondary btn-group\">-->\n" +
    "                                    <!--<select ng-model=\"$ctrl.jobExec.week\" class=\"form-select\">-->\n" +
    "                                        <!--<option value=\"1\">周一</option>-->\n" +
    "                                        <!--<option value=\"2\">周二</option>-->\n" +
    "                                        <!--<option value=\"3\">周三</option>-->\n" +
    "                                        <!--<option value=\"4\">周四</option>-->\n" +
    "                                        <!--<option value=\"5\">周五</option>-->\n" +
    "                                        <!--<option value=\"6\">周六</option>-->\n" +
    "                                        <!--<option value=\"7\">周日</option>-->\n" +
    "                                    <!--</select>-->\n" +
    "                                <!--</div>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</div>-->\n" +
    "                        <!--<div ng-if=\"$ctrl.execRate === 'month' || $ctrl.execRate === 'year'\" style=\"margin-left: 10px\" class=\"d-inline-block\"-->\n" +
    "                             <!--uib-popover=\"\" uib-popover-html=\"'0表示每月最后一天'\" popover-trigger=\"'mouseenter'\">-->\n" +
    "                            <!--<label>日</label>-->\n" +
    "                            <!--<div class=\"form-control-wrapper d-inline-block\">-->\n" +
    "                                <!--<div class=\"opx-check-group opx-secondary btn-group\">-->\n" +
    "                                    <!--<input type=\"number\" ng-model=\"$ctrl.jobExec.day\" min=\"0\"-->\n" +
    "                                           <!--step=\"1\" max=\"31\" class=\"form-control\">-->\n" +
    "                                <!--</div>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</div>-->\n" +
    "                        <!--<div ng-if=\"$ctrl.execRate\" style=\"margin-left: 10px\" class=\"d-inline-block\">-->\n" +
    "                            <!--<label>时</label>-->\n" +
    "                            <!--<div class=\"form-control-wrapper d-inline-block\">-->\n" +
    "                                <!--<div class=\"opx-check-group opx-secondary btn-group\">-->\n" +
    "                                    <!--<input type=\"time\" ng-model=\"$ctrl.jobExec.time\" class=\"form-control\">-->\n" +
    "                                <!--</div>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</div>-->\n" +
    "                    <!--</div>-->\n" +
    "                <!--</div>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/template/template-edit.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"app.cac.template.list({display:true})\">{{'cac.index.template' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">{{cacEditTemplateCtrlVm.views.template.id == null ? (\"cac.template.create\" | translate):\n" +
    "                    (\"cac.template.edit\" | translate)}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill scroll-y p-3\" uaa-has-permission=\"{{cacEditTemplateCtrlVm.views.permission}}\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "        <form class=\"form-vertical op-smartform\" name=\"templateForm\">\n" +
    "            <div ng-include=\"'app/modules/cac/template/template-edit-content.html'\"></div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"op-form-actions\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary opx-btn-ok\" ng-click=\"cacEditTemplateCtrlVm.views.save()\"\n" +
    "                            ng-disabled=\"templateForm.$invalid\">{{'common.entity.action.save' | translate}}\n" +
    "                    </button>\n" +
    "                    <button type=\"cancel\" class=\"btn btn-default opx-btn-cancel\" ng-click=\"cacEditTemplateCtrlVm.views.back()\">\n" +
    "                        {{'common.entity.action.back' | translate}}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/template/template-host-list.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"> {{'cac.index.select_hosts' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\" style=\"pointer-events: auto;\"\n" +
    "            ng-click=\"cacTemplateHostVm.views.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body cac-template-host-dialog\">\n" +
    "    <div class=\"opx-layout-hflex\">\n" +
    "        <div class=\"p-2\">\n" +
    "            <div class=\"opx-sidebar-body\">\n" +
    "                <div class=\"list-group\">\n" +
    "                    <a ui-sref-active=\"active\" ng-class=\"{active:cacTemplateHostVm.views.category==''}\"\n" +
    "                        class=\"list-group-item list-group-item-action\"\n" +
    "                        ng-click=\"cacTemplateHostVm.views.refreshTableByCategory('')\">\n" +
    "                        <i class=\"fa fa-list-alt\"></i>\n" +
    "                        {{'common.term.all' | translate}}\n" +
    "                    </a>\n" +
    "                    <a ui-sref-active=\"active\" ng-class=\"{active:cacTemplateHostVm.views.category=='{{category}}'}\"\n" +
    "                       ng-repeat=\"category in cacTemplateHostVm.views.allCategory | filter:cacTemplateHostVm.views.categoryName\"\n" +
    "                       ng-click=\"cacTemplateHostVm.views.refreshTableByCategory(category)\"\n" +
    "                       class=\"list-group-item list-group-item-action\">\n" +
    "                        {{category}}\n" +
    "                    </a>\n" +
    "                    <a ui-sref-active=\"active\" ng-class=\"{active:cacTemplateHostVm.views.category=='adhoc'}\"\n" +
    "                       ng-click=\"cacTemplateHostVm.views.refreshTableByCategory('adhoc')\"\n" +
    "                       class=\"list-group-item list-group-item-action\">\n" +
    "                        {{'common.term.others' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"opx-flex-fill table-responsive\">\n" +
    "            <table id=\"cac-template-host-table\" class=\"cac-template-host-table table opx-table\"></table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer text-right\">\n" +
    "        <button type=\"reset\" class=\"btn btn-default\" ng-click=\"cacTemplateHostVm.views.cancel()\">{{'common.entity.action.cancel' | translate}}</button>\n" +
    "        <button type=\"submit\" class=\"btn btn-success\" ng-click=\"cacTemplateHostVm.views.save()\">{{'common.entity.action.save' | translate}}</button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/template/template-index.html","<div class=\"h-100\" ui-view=\"template-view\" uaa-has-permission=\"cac:view:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <!-- <div ng-include=\"'app/modules/cac/template/template-list.html'\" ng-controller=\"CacTemplateListCtrl as cacTemplateListCtrlVm\"></div>-->\n" +
    "    <!--<div class=\"template-table-div\" ng-controll er=\"CacTemplateListCtrl as cacTemplateListCtrlVm\">\n" +
    "        <div class=\"wrapper\">\n" +
    "            <div class=\"card card-default\">\n" +
    "                <div class=\"card-header\">\n" +
    "                    <div class=\"card-title\">\n" +
    "                        <span hidden>模板列表</span>\n" +
    "                        <button class=\"btn btn-primary btn-sm pull-right cac-title-button-l\"\n" +
    "                                uaa-has-permission=\"cac:*:*\"\n" +
    "                                ui-sref=\"app.cac.template_add\"><i class=\"fa fa-plus m-r-xs\"></i> 新增模板</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <div class=\"table-responsive\">\n" +
    "                        <table class=\"template-table table table-striped table-hover table-bordered cac-table-line-height\"></table>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>-->\n" +
    " <!--   <div ng-controller=\"CacTemplateSquareCtrl as CacTemplateSquareCtrlVm\">\n" +
    "        <p ng-if=CacTemplateSquareCtrlVm.views.templateList==null||CacTemplateSquareCtrlVm.views.templateList.length==0>\n" +
    "            没有数据</p>\n" +
    "\n" +
    "        <div class=\"col-sm-3\" ng-repeat=\"template in CacTemplateSquareCtrlVm.views.templateList\"\n" +
    "             ui-sref=\"app.cac.result({jobId:template.jobId})\"\n" +
    "             ng-class=\"(template.hours==null||template.hours=='')?'cac-disable-click':'cac-click'\">\n" +
    "            <div class=\"card-default cac-div-card\">\n" +
    "                <div>\n" +
    "                    <div class=\"card-header\"\n" +
    "                         ng-class=\"(template.jobStatus==''||template.jobStatus==null)?'bg-secondary':(template.jobStatus=='success'?'bg-success':(template.jobStatus=='failure'?'bg-danger':'bg-warning'))\">\n" +
    "\n" +
    "                        <div class=\"cac-template-square-tile-l cac-template-tile\">\n" +
    "                            <span class=\"h4\" title=\"{{template.templateName}}\">{{template.templateName}} </span>\n" +
    "                        </div>\n" +
    "                        <div class=\"cac-template-square-tile-r pull-right cac-template-tile\">\n" +
    "                            &lt;!&ndash; <span ng-if=\"template.jobStatus==null||template.jobStatus==''\" class=\"fa fa-info text-info cac-template-square-font\" title=\"该模板还未执行\"></span>\n" +
    "                            <span ng-if=\"template.jobStatus==='running'\" class=\"fa fa-exclamation text-warning cac-template-square-font\" title=\"正在执行\"></span>\n" +
    "                            <span ng-if=\"template.jobStatus==='success'\" class=\"fa fa-check text-success cac-template-square-font\" title=\"执行成功\"></span>\n" +
    "                            <span ng-if=\"template.jobStatus==='error'\" class=\"fa fa-times text-danger cac-template-square-font\" title=\"执行失败\"></span>&ndash;&gt;\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"cac-template-square-tile-info cac-template-tile\">\n" +
    "                <span class=\"fa fa-clock-o cac-template-square-info-font\"\n" +
    "                      ng-if=\"template.hours===null||template.hours===''\"> 未执行</span>\n" +
    "                            <span class=\"fa fa-clock-o cac-template-square-info-font\" ng-if=\"template.hours!=null\"> {{template.created_at}}执行</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"card-body cac-template-square-body\">\n" +
    "                    <div class=\"cac-template-square-info\">\n" +
    "                        <p>{{template.hostLength}}</p>\n" +
    "                        <p>设备</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"cac-template-square-info cac-template-square-info-last\">\n" +
    "                        <p>{{template.rulesLength}}</p>\n" +
    "                        <p>规则</p>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>-->\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/template/template-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cac.index.template' | translate}}</div>\n" +
    "        <div class=\"navbar-nav ms-auto\">\n" +
    "            <button class=\"btn btn-primary\"\n" +
    "                    ui-sref=\"app.cac.template_add\"><i class=\"fa fa-plus\"></i> {{'cac.template.create' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill wrapper\">\n" +
    "        <opx-datatable table-config=\"cacTemplateListCtrlVm.tableConfig\" reload-fn=\"cacTemplateListCtrlVm.reloadTable\"></opx-datatable>\n" +
    "<!--        <div class=\"table-responsive\">-->\n" +
    "<!--            <table id=\"cacTemplateTable\" class=\"template-table table opx-table\"></table>-->\n" +
    "<!--        </div>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/template/template-rule-list.html","\n" +
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"> {{'cac.index.select_rules' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\" ng-click=\"cacTemplateRuleVm.views.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body cac-template-rule-dialog\">\n" +
    "    <div>\n" +
    "        <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'common.term.category' | translate}} :</label>\n" +
    "            <select ng-change=\"cacTemplateRuleVm.views.selectRule()\"\n" +
    "                    ng-model=\"cacTemplateRuleVm.views.category\"\n" +
    "                    chosen=\"{placeholder_text: {{'common.messages.select' | translate:{ obj: {{'common.term.category' | translate}} } }}  }\" style=\"width: 100%\">\n" +
    "                <option value=\"\" selected>{{'common.term.all' | translate}}</option>\n" +
    "                <option class=\"\" value=\"{{category}}\" ng-repeat=\"category in cacTemplateRuleVm.views.categoryList\">\n" +
    "                </option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'common.term.tag' | translate}} :</label>\n" +
    "        <select ng-change=\"cacTemplateRuleVm.views.selectRule()\"\n" +
    "                ng-model=\"cacTemplateRuleVm.views.label\"\n" +
    "                chosen=\"{placeholder_text: {{'common.messages.select' | translate:{ obj: {{'common.term.tag' | translate}} } }} }\" multiple\n" +
    "                style=\"width: 100%\">\n" +
    "            <option value=\"\" selected>{{'common.term.all' | translate}}</option>\n" +
    "            <option class=\"\" value=\"{{label}}\" ng-repeat=\"label in cacTemplateRuleVm.views.labelList\">\n" +
    "                {{label}}\n" +
    "            </option>\n" +
    "        </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <form name=\"cac-select-template-rule-form\">\n" +
    "        <div class=\"table-responsive\">\n" +
    "            <table id=\"cac-template-rule-table\" class=\"cac-template-rule-table table opx-table cac-table\"></table>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <p class=\"text-right\">\n" +
    "        <button type=\"submit\" class=\"btn btn-primary opx-btn-ok\" ng-click=\"cacTemplateRuleVm.views.save()\">{{'common.entity.action.confirm' | translate}}</button>\n" +
    "        <button type=\"reset\" class=\"btn btn-default\" ng-click=\"cacTemplateRuleVm.views.cancel()\">{{'common.entity.action.cancel' | translate}}</button>\n" +
    "    </p>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/template/template-script-list.html","\n" +
    "<div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\" ng-click=\"cacTemplateScriptVm.views.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "    <h4 class=\"modal-title\"> {{'cac.index.select_scripts' | translate}}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body cac-template-script-dialog\">\n" +
    "    <form name=\"cac-select-template-script-form\">\n" +
    "        <div class=\"table-responsive\">\n" +
    "            <table id=\"cac-template-script-table\" class=\"cac-template-script-table table opx-table\"></table>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <p class=\"text-right\">\n" +
    "        <button type=\"reset\" class=\"btn btn-default\" ng-click=\"cacTemplateScriptVm.views.cancel()\">{{'common.entity.action.cancel' | translate}}</button>\n" +
    "        <button type=\"submit\" class=\"btn btn-success\" ng-click=\"cacTemplateScriptVm.views.save()\">{{'common.entity.action.save' | translate}}</button>\n" +
    "    </p>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/template/template-square.html","<div class=\"h-100 bg-secondary p-5\">\n" +
    "    <div class=\"op-blank-slate\"\n" +
    "         ng-if=CacTemplateSquareCtrlVm.views.templateList==null>\n" +
    "        <div class=\"op-blank-slate-icon\">\n" +
    "            <i class=\"fa fa-cog fa-spin fa-4x\"></i>\n" +
    "        </div>\n" +
    "        <p class=\"op-blank-slate-body\">{{'common.entity.loading' | translate}}</p>\n" +
    "    </div>\n" +
    "    <div class=\"row bg-secondary\">\n" +
    "        <div class=\"col-sm-3 mb-5\"\n" +
    "             ng-repeat=\"template in CacTemplateSquareCtrlVm.views.templateList | orderBy:'executedAt' \">\n" +
    "            <div class=\"card border-0 shadow bg-light opx-autocolor card udp-card udp-card-with-icon op-hover-trigger mb-5 mt-3 border-0 shadow-sm\">\n" +
    "                <div class=\"card-body bg-light\" style=\"margin-bottom: 5px\"\n" +
    "                     ng-class=\"(template.jobId==null||template.jobId=='')?'cac-disable-click':'cac-click'\"\n" +
    "                     ui-sref=\"app.cac.result({jobId:template.jobId})\">\n" +
    "                    <h3 class=\"mb-3 font-weight-bold text-ellipsis\" title=\"{{template.templateName}}\">\n" +
    "                        {{template.templateName}} </h3>\n" +
    "                    <!--<div>-->\n" +
    "                    <!--<div class=\"d-inline-block\"-->\n" +
    "                    <!--ng-class=\"(template.jobStatus==''||template.jobStatus==null)?'bg-secondary':(template.jobStatus=='success'?'bg-success':(template.jobStatus=='failure'?'bg-danger':'bg-warning'))\"-->\n" +
    "                    <!--style=\"width:1rem;height:1rem;display: inline-block; border-radius: 50%;\"></div>-->\n" +
    "                    <!--<div class=\"text-muted d-inline-block\">-->\n" +
    "                    <!--<span ng-if=\"template.hours===null||template.hours===''\"> 未执行</span>-->\n" +
    "                    <!--<span ng-if=\"template.hours!=null\"> {{template.created_at}}执行</span>-->\n" +
    "                    <!--</div>-->\n" +
    "                    <!--</div>-->\n" +
    "                    <!--                    <div class=\"udp-card-icon\">-->\n" +
    "                    <div style=\"transition: all 0.3s linear;position: absolute;top: 0;right: 0.5rem;font-size: 2rem;opacity: 0.25;\">\n" +
    "                        <i class=\"fa\" ng-class=\"template.icon ||'fas fa-server'\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"card-footer px-3 py-2 xbg-light xopx-autocolor\">\n" +
    "                    <div class=\"d-flex align-items-center justify-content-between\">\n" +
    "                        <div>\n" +
    "                            <div class=\"font-weight-bold\">\n" +
    "                                <div class=\"d-inline-block\"\n" +
    "                                     ng-class=\"(template.executedBy==null||template.executedBy=='')?\n" +
    "                                     'bg-secondary':'bg-warning'\"\n" +
    "                                     style=\"width:0.8rem;height:0.8rem;display: inline-block; border-radius: 50%;\">\n" +
    "                                </div>\n" +
    "                                <div class=\"text-muted d-inline-block\">\n" +
    "                                    <small ng-if=\"template.executedBy===null||template.executedBy===''\">{{'cac.common.not_run' | translate}}</small>\n" +
    "                                    <small ng-if=\"template.executedBy!=null\">\n" +
    "                                        {{template.executedTime}}{{'cac.common.run' | translate}}</small>\n" +
    "                                </div>\n" +
    "                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{template.hostLength}}&nbsp;<small>{{'cac.common.device' | translate}}</small>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"op-hover-to-show text-nowrap dropdown \" style=\"right:0;\">\n" +
    "                            <button class=\"btn btn-sm btn-default opx-btn-icon dropdown-toggle\" type=\"button\"\n" +
    "                                    data-bs-toggle=\"dropdown\"><i\n" +
    "                                    class=\"fa fa-ellipsis-v\"></i>\n" +
    "                            </button>\n" +
    "                            <ul class=\"dropdown-menu dropdown-menu-end\"\n" +
    "                                style=\"min-width: auto;padding: 4px;width: 80px;\">\n" +
    "                                <li>\n" +
    "                                    <a ui-sref=\"app.cac.job_add({templateId:template.id})\">\n" +
    "                                        <i class=\"fa fa-play-circle\"></i> {{'cac.template.run' | translate}}\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a uaa-has-permission=\"cac:edit:*\"\n" +
    "                                       ui-sref=\"app.cac.template_edit({templateId:template.id})\">\n" +
    "                                        <i class=\"fa fa-pencil\"></i> {{'cac.template.edit' | translate}}\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li  ng-if=\"'yes' === CacTemplateSquareCtrlVm.views.dashboardSwitch\">\n" +
    "                                    <a uaa-has-permission=\"cac:view:*\"\n" +
    "                                       ui-sref=\"app.cac.template_dashboard({templateId:template.id,templateName:template.templateName})\">\n" +
    "                                        <i class=\"fa fa-tachometer-alt\"></i> {{'udp.w.gauge.name' | translate}}\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li  ng-if=\"'yes' === CacTemplateSquareCtrlVm.views.teamsSwitch\">\n" +
    "                                    <a uaa-has-permission=\"sysadmin:*:*\"\n" +
    "                                       ui-sref=\"app.cac.template_teams({templateId:template.id,templateName:template.templateName})\">\n" +
    "                                        <i class=\"fa fa-users-cog\"></i> {{'acm.common.text.choose_team' | translate}}\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a uaa-has-permission=\"cac:edit:*\"\n" +
    "                                       ng-click=\"CacTemplateSquareCtrlVm.views.deleteTemplate(template.id)\">\n" +
    "                                        <i class=\"fa fa-trash-alt\"></i> {{'cac.template.delete' | translate}}\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                            <!--<a class=\"btn btn-default btn-sm\" title=\"执行\" ui-sref=\"app.cac.job_add({templateId:template.id})\"><i class=\"fa fa-play-circle\"></i></a>-->\n" +
    "                        </div>\n" +
    "                        <!--<div style=\"width:20%\">-->\n" +
    "                        <!--<a class=\"btn btn-default btn-sm\" title=\"编辑\" ui-sref=\"app.cac.template_edit({templateId:template.id})\"><i class=\"fa fa-pencil\"></i></a>-->\n" +
    "                        <!--</div>-->\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/template/user/template-user-index.html","<nav class=\"navbar navbar-light bg-light\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li>\n" +
    "                    <a ui-sref=\"app.cac.template\">{{'cac.index.square' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"active\">\n" +
    "                    <a ui-sref=\"app.cac.template.templateList\">{{'cac.index.template' | translate}}</a>\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div class=\"btn-group pull-right m-t-sm\" role=\"group\" aria-label=\"...\">\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ui-sref=\"app.cac.script\"><i class=\"fa fa-calendar m-r-sm\"></i>{{'cac.template.user.script_config' | translate}}</button>\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ui-sref=\"app.cac.rule\"><i class=\"fa fa-calendar m-r-sm\"></i>{{'cac.common.rule_config' | translate}}</button>\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ui-sref=\"app.cac.job\">{{'cac.template.user.square_config' | translate}}<i class=\"fa fa-cogs ms-2\"></i></button>\n" +
    "        </div>\n" +
    "</nav>\n" +
    "<div class=\"hbox hbox-auto-xs hbox-auto-sm\" ui-view=\"template\">\n" +
    "    <div class=\"cac-template-user-list\" ng-repeat=\"item in cacTemplateUserCtrlVm.views.templateList\">\n" +
    "        <div class=\"cac-template-user-card col-sm-3\">\n" +
    "            <div class=\"card-header\">\n" +
    "                <div class=\"card-title\" title=\"{{item.templateName}}\">\n" +
    "                    {{item.templateName}}\n" +
    "                </div>\n" +
    "                <div class=\"card-header-pic\">\n" +
    "                    <span class=\"fa fa-check\"></span>\n" +
    "                </div>\n" +
    "                <span class=\"card-time-info\">{{'cac.template.user.execute_by' | translate}}</span>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <div class=\"col-sm-4 card-body-info\">\n" +
    "                    <span>13{{item.auditParams.hosts.script}}</span>\n" +
    "                    <span>{{'cac.common.device' | translate}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-4 card-body-info\">\n" +
    "                    <span>8{{item.auditParams.hosts.ruleExpressions}}</span>\n" +
    "                    <span>{{'cac.common.rule' | translate}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-4 card-body-info\">\n" +
    "                    <span>0{{item.auditParams.hosts.length}}</span>\n" +
    "                    <span>{{'cac.common.not_compliance' | translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/cac/template/user/template-user-list.html","")

$templateCache.put("app/modules/cac/templates/templates-edit.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"app.cac3.templates.list({display:true})\">{{'cac3.navigation.patrol_item_list' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">{{vm.views.templates.id == null ? ('cac3.title.newPatrolTemplate' | translate) : ('cac3.title.editPatrolTemplate' | translate)}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div class=\"navbar-nav ms-auto\" uaa-has-permission=\"cac:edit:*\">\n" +
    "            <button type=\"button\" ng-disabled=\"editForm.$invalid || vm.isSaving\" ng-click=\"vm.save()\"\n" +
    "                    class=\"btn btn-primary opx-btn-ok\">{{'common.entity.action.save' | translate}}\n" +
    "            </button>\n" +
    "            <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" ng-click=\"vm.clear()\">\n" +
    "                {{'common.entity.action.back' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill scroll-y p-3\" uaa-has-permission=\"cac:edit:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "        <form name=\"editForm\" role=\"form\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'common.entity.detail.name' | translate}}<span class=\"text-danger\">*</span></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" class=\"form-control\"\n" +
    "                           ng-model=\"vm.views.templates.name\" required>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'common.entity.detail.description' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <textarea type=\"text\" class=\"form-control uneditable-input\"\n" +
    "                              ng-model=\"vm.views.templates.description\">\n" +
    "                    </textarea>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'cac3.title.enableGlobalParameters' | translate}}</label>\n" +
    "                <div class=\"form-control\">\n" +
    "                    <label class=\"radio-inline\">\n" +
    "                        <input type=\"radio\" name=\"overwrite\" ng-value=\"0\" ng-model=\"vm.views.templates.overwrite\" >\n" +
    "                        <span>{{'cac3.title.yes' | translate}}</span>\n" +
    "                    </label>\n" +
    "                    <label class=\"radio-inline\">\n" +
    "                        <input type=\"radio\" name=\"overwrite\" ng-value=\"1\" ng-model=\"vm.views.templates.overwrite\">\n" +
    "                        <span>{{'cac3.title.no' | translate}}</span>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-if=\"vm.views.templates.overwrite == 0\">\n" +
    "                <label class=\"control-label\">{{'cac3.title.customParameterList' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" class=\"form-control\"\n" +
    "                           ng-model=\"vm.views.templates.globalParameters\" placeholder=\"key1=value1 key2=value2 ...\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"card-body mb-5\" ng-repeat=\"item in vm.views.auditParams\" style=\"border: 1px solid #ced4da;\">\n" +
    "                <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\"><i class=\"fa fa-laptop\"></i> {{'common.entity.variable.host' | translate}}<span class=\"text-danger\">*</span></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"w-full\">\n" +
    "                        <div class=\"mt-3\">\n" +
    "                            <acm-device-selector the-model=\"item.hosts\" ci-types=\"'[auto]'\" mcheck-type=\"'map'\"></acm-device-selector>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"card-body mb-5\" style=\"border: 1px solid #ced4da;\" style=\"border: 1px solid #ced4da;\">\n" +
    "                <label class=\"control-label font-weight-bold text-left\" style=\"width:6rem;\"><i class=\"fa fa-euro-sign\"></i> {{'cac3.title.patrolInspectionItems' | translate}}<span class=\"text-danger\">*</span></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"w-full\">\n" +
    "                        <div class=\"mt-3\">\n" +
    "                            <inspection-dynamic-selector the-model=\"vm.views.templates.threeCheckItemIds\"></inspection-dynamic-selector>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/templates/templates-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cac3.navigation.patrol_item_template' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <div class=\"card-body\">\n" +
    "        <opx-datatable table-config=\"vm.tableConfig\">\n" +
    "            <button class=\"btn btn-primary\"\n" +
    "                    ui-sref=\"app.cac3.templates.add\"><i class=\"fa fa-plus\"></i> {{'cac3.button.new_template' | translate}}\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/cac/templates/templates.html","<div class=\"h-100\" ui-view=\"templates-view\" uaa-has-permission=\"cac:view:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "</div>\n" +
    "\n" +
    "")
}]);
})();