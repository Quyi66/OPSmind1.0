//HEAD 
(function(app) {
try { app = angular.module("oplus.jao"); }
catch(err) { app = angular.module("oplus.jao", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/jao/ansible-progress.html","<div class=\"card\">\n" +
    "    <!--    <div class=\"card-header\">-->\n" +
    "    <!--        执行主机-->\n" +
    "    <!--    </div>-->\n" +
    "    <div class=\"card-body\">\n" +
    "        <opx-datatable table-config=\"$ctrl.tableConfig\">\n" +
    "            <!--<button class=\"btn btn-sm\" ng-class=\"$ctrl.pause ? 'btn-info' : 'btn-warning'\" ng-click=\"$ctrl.pauseJob($ctrl.pause)\">-->\n" +
    "                <!--<i ng-class=\"$ctrl.pause ? 'fa fa-play-circle' : 'fa fa-pause'\"></i>-->\n" +
    "                <!--<span>{{$ctrl.pause ? '继续作业' : '暂停作业'}}</span>-->\n" +
    "            <!--</button>-->\n" +
    "            <button class=\"btn btn-danger btn-sm ms-auto\" ng-click=\"$ctrl.terminationAllHosts()\">\n" +
    "                <i class=\"fa fa-ban\"></i>\n" +
    "                <span>{{'jao.result.terminate_all' | translate}}</span>\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/ansible/ansible-log-viewer.component.html","<op-code-editor the-model=\"$ctrl.content\"\n" +
    "                options=\"{theme: 'opluscode', syntax: 'ansiblelog', readonly: true, linewrap: false, toolbar: true}\"\n" +
    "                class=\"flex-fill\"\n" +
    "                __style=\"height:100%\" on-loaded=\"$ctrl.editorLoaded\">\n" +
    "    <button type=\"button\" class=\"me-2 btn opx-btn-icon\" ng-click=\"$ctrl.toggleScroll()\"\n" +
    "            ng-class=\"$ctrl.autoScroll ? 'btn-default active' : 'btn-outline-default' \"><i class=\"fa fa-arrows-alt-v\"></i>\n" +
    "    </button>\n" +
    "    <a type=\"button\" class=\"me-2 btn opx-btn-icon btn-outline-default\" href=\"{{ $ctrl.download() }}\">\n" +
    "        <i class=\"fa fa-file-download\"></i>\n" +
    "    </a>\n" +
    "    <button type=\"button\" class=\"me-2 btn\" ng-click=\"$ctrl.viewBatch(batch)\" ng-repeat=\"batch in $ctrl.allBatches\"\n" +
    "            ng-class=\"$ctrl.activeBatch === batch ? 'btn-primary active' : 'btn-outline-default' \"><span>{{batch}}</span>\n" +
    "    </button>\n" +
    "</op-code-editor>")

$templateCache.put("app/modules/jao/ansible/playbook-info.html","<!--<pre>{{$ctrl.nodes|json}}</pre>-->\n" +
    "<div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/approve/approve-list.html","<job-approve-list approve-type=\"'approve'\" uaa-has-permission=\"jao:approve:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\"></job-approve-list>")

$templateCache.put("app/modules/jao/approve/approve-my-list.html","<job-approve-list approve-type=\"'my'\"></job-approve-list>")

$templateCache.put("app/modules/jao/command/command-approve-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cmd.index.approve' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <div uaa-has-permission=\"cmd:approve:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\" class=\"p-3\">\n" +
    "        <opx-datatable table-config=\"$ctrl.tableConfig\">\n" +
    "            <button class=\"btn btn-outline-primary\" ng-click=\"$ctrl.batchApprove()\"\n" +
    "                    ng-disabled=\"$ctrl.tableConfig.selectedItems.length<1\">\n" +
    "                <i class=\"fa fa-check\"></i>\n" +
    "                {{'cmd.approve.button_batch_approve' | translate}}\n" +
    "            </button>\n" +
    "        </opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/command/command-approve-modal.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{'cmd.approve.command_approve' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" ng-click=\"$ctrl.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body op-bold-label op-smartform\" ng-if=\"$ctrl.type === 'single'\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"form-control-wrapper\"><span class=\"badge bg-primary\">{{$ctrl.action}}</span></div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'common.entity.detail.name' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\"> {{$ctrl.thisCommand.name}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'common.entity.detail.type' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\"> {{$ctrl.thisCommand.type}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\" ng-if=\"!$ctrl.thisCommand.command\">\n" +
    "        <label class=\"control-label\">{{'common.entity.action.detail' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <pre class=\"p-2 bg-light\">{{$ctrl.thisCommand.unapprovedCommand}}</pre>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!!$ctrl.thisCommand.command\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Old:</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <pre class=\"p-2 bg-light\">{{$ctrl.thisCommand.command}}</pre>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">New:</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <pre class=\"p-2 bg-light\">{{$ctrl.thisCommand.unapprovedCommand}}</pre>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\" ng-if=\"$ctrl.thisCommand.description\">\n" +
    "        <label class=\"control-label\">{{'common.entity.detail.description' | translate}}:</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            {{$ctrl.thisCommand.description}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-body cac-history-find-dialog\" ng-if=\"$ctrl.type === 'batch'\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <strong class=\"control-label\">{{ 'acm.common.selector.total' | translate}}<strong>{{$ctrl.selected.length}}</strong>{{ 'acm.common.selector.item' | translate}}</strong>\n" +
    "    </div>\n" +
    "    <div class=\"accordion-item\" ng-repeat=\"command in $ctrl.selected\">\n" +
    "        <div class=\"accordion-header\" id=\"headingOne\">\n" +
    "            <div class=\"card card-default\">\n" +
    "                <div class=\"card-body\">\n" +
    "                    <a class=\"accordion-button\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#href{{command.id}}\" aria-expanded=\"true\" aria-controls=\"collapseOne\">\n" +
    "                        <strong class=\"d-inline-block\">{{command.name}}</strong>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div id=\"href{{command.id}}\" class=\"accordion-body collapse\">\n" +
    "            <div class=\"accordion-body\" style=\"padding-left: 15px\" >\n" +
    "                <div>\n" +
    "                    <label class=\"control-label\">{{'common.entity.detail.operation' | translate}}:</label>\n" +
    "                    <span ng-if=\"!command.command\">{{'cmd.approve.add_command' | translate}}</span>\n" +
    "                    <span ng-if=\"!!command.command\">{{'cmd.approve.edit_command' | translate}}</span>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <label class=\"control-label\">{{'common.entity.detail.type' | translate}}：</label>\n" +
    "                    <span>{{command.type}}</span>\n" +
    "                </div>\n" +
    "                <div ng-if=\"!command.command\">\n" +
    "                    <label>{{'common.entity.action.detail' | translate}}:</label>\n" +
    "                    <div class=\"bg-light p-3\">\n" +
    "                                <pre class=\"pre_command\"\n" +
    "                                     style=\"white-space: pre-wrap\">{{command.unapprovedCommand}}</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"!!command.command\">\n" +
    "                    <label>Old:</label>\n" +
    "                    <div class=\"bg-light p-3\">\n" +
    "                        <pre class=\"pre_command\" style=\"white-space: pre-wrap\">{{command.command}}</pre>\n" +
    "                    </div>\n" +
    "                    <label>New:</label>\n" +
    "                    <div class=\"bg-light p-3\">\n" +
    "                                    <pre class=\"pre_command\"\n" +
    "                                         style=\"white-space: pre-wrap\">{{command.unapprovedCommand}}</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <label>{{'common.entity.detail.description' | translate}}:</label>\n" +
    "                    <div class=\"bg-light p-3\">\n" +
    "                        <pre class=\"pre_command\" style=\"white-space: pre-wrap\">{{command.description}}</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer d-flex flex-row-reverse\">\n" +
    "    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\" ng-click=\"$ctrl.isApprove(false)\">\n" +
    "        <i class=\"fa fa-times\"></i> {{'cmd.approve.approve_failed' | translate}}\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"ms-auto btn btn-success\" ng-click=\"$ctrl.isApprove(true)\">\n" +
    "        <i class=\"fa fa-check\"></i> {{'cmd.approve.approve_success' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div>\n" +
    "    <div style=\"padding-left: 15px\">\n" +
    "        <label>{{'cmd.approve.reason' | translate}}:</label>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer d-flex\">\n" +
    "        <op-code-editor id=\"field_value\" the-model=\"$ctrl.unapprovedReason\" style=\"height:10rem;\"></op-code-editor>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/command/command-console-dynamic.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{'cmd.index.log' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\" style=\"pointer-events: auto;\"\n" +
    "            ng-click=\"$ctrl.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body cm-host-dialog\">\n" +
    "    <div>\n" +
    "        <opx-datatable table-config=\"$ctrl.tableConfig\"></opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer text-right\">\n" +
    "    <button type=\"reset\" class=\"btn btn-default\" ng-click=\"$ctrl.cancel()\">{{'common.entity.action.back' | translate}}</button>\n" +
    "</div>")

$templateCache.put("app/modules/jao/command/command-console.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">\n" +
    "                    Console\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class=\"opx-flex-fill p-3\">\n" +
    "        <div class=\"navbar-nav ms-auto\" style=\"float:right\">\n" +
    "            <div>\n" +
    "                <button type=\"button\" ng-click=\"vm.history()\"\n" +
    "                        class=\"btn btn-primary\"><i\n" +
    "                        class=\"fad fa-history fa-fw\"></i>{{'cmd.index.log' | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <label class=\"control-label\" for=\"field_type\">{{'common.entity.variable.host' | translate}}</label>\n" +
    "        <acm-device-selector ci-types=\"'[auto]'\" the-model=\"vm.hosts\" mcheck-type=\"'map'\"></acm-device-selector>\n" +
    "\n" +
    "        <form name=\"editForm\" role=\"form\" novalidate ng-submit=\"vm.runCommand()\">\n" +
    "            <fieldset ng-disabled=\"vm.viewMode==='view'\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" for=\"field_type\">{{'cmd.list.grammar' | translate}}</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <select id=\"field_type\" name=\"type\" class=\"form-select w-md\" ng-model=\"vm.command.type\"\n" +
    "                                ng-mouseleave=\"vm.cacheConsoleData()\">\n" +
    "                            <option value=\"{{type}}\" ng-repeat=\"type in vm.allTypes\">\n" +
    "                                {{type}}\n" +
    "                            </option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\"\n" +
    "                    <label class=\"control-label\" for=\"field_value\">{{'cmd.index.command' | translate}}</label>\n" +
    "                    <op-code-editor id=\"field_value\" ng-mouseleave=\"vm.cacheConsoleData()\" the-model=\"vm.command.cmd\" style=\"height:30rem;\"></op-code-editor>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "\n" +
    "        <div class=\"navbar-nav ms-auto\" style=\"float:right\">\n" +
    "            <div>\n" +
    "                <button type=\"button\" ng-click=\"vm.runCommand()\"\n" +
    "                        class=\"btn btn-primary opx-btn-ok\">{{'cmd.list.button_run' | translate}}\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" ng-click=\"vm.clear()\">\n" +
    "                    {{'common.entity.action.back' | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/command/command-edit.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\"><a\n" +
    "                        ui-sref=\"app.jao_cmd.command_list\">{{'cmd.list.command_list' | translate}}</a></li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\" ng-if=\"vm.viewMode==='view'\">\n" +
    "                    {{'common.entity.action.detail' | translate}}\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\" ng-if=\"vm.viewMode==='create'\">\n" +
    "                    {{'common.entity.action.create' | translate}}\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\" ng-if=\"vm.viewMode==='edit'\">\n" +
    "                    {{'common.entity.action.edit' | translate}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div class=\"navbar-nav ms-auto\" uaa-has-permission=\"cmd:edit:*\">\n" +
    "            <div ng-if=\"vm.viewMode==='view'\">\n" +
    "                <button class=\"btn btn-outline-primary\" ui-sref=\"app.jao_cmd.command_edit({id:vm.command.id})\"><i\n" +
    "                        class=\"fa fa-pencil\"></i> {{'cmd.approve.edit_command' | translate}}\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-outline-primary\" ui-sref=\"app.jao_cmd.command_list\"><i\n" +
    "                        class=\"fa fa-chevron-left\"></i> {{'common.action.back' | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            <div ng-if=\"vm.viewMode!=='view'\">\n" +
    "                <button type=\"button\" ng-disabled=\"editForm.$invalid || vm.isSaving\" ng-click=\"vm.save()\"\n" +
    "                        class=\"btn btn-primary opx-btn-ok\">{{'common.entity.action.save' | translate}}\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" ng-click=\"vm.clear()\">\n" +
    "                    {{'common.entity.action.back' | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill p-3\">\n" +
    "        <form name=\"editForm\" role=\"form\" novalidate ng-submit=\"vm.save()\">\n" +
    "            <fieldset ng-disabled=\"vm.viewMode==='view'\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" for=\"field_name\">{{'common.entity.detail.name' | translate}}</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <input type=\"text\" class=\"form-control w-md\" name=\"name\" id=\"field_name\" required ng-minlength=1\n" +
    "                               ng-maxlength=50 ng-model=\"vm.command.name\"/>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" for=\"field_type\">{{'cmd.list.grammar' | translate}}</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <select id=\"field_type\" name=\"type\" class=\"form-select w-md\" ng-model=\"vm.command.type\">\n" +
    "                            <option value=\"{{type}}\" ng-repeat=\"type in vm.allTypes\">\n" +
    "                                {{type}}\n" +
    "                            </option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\" for=\"field_value\">{{'common.entity.action.detail' | translate}}</label>\n" +
    "                    <op-code-editor id=\"field_value\" the-model=\"vm.command.command\" style=\"height:10rem;\"\n" +
    "                                    options=\"{syntax:vm.command.type, readonly:vm.viewMode==='view'}\"></op-code-editor>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\"\n" +
    "                           for=\"field_description\">{{'common.entity.detail.description' | translate}}</label>\n" +
    "                    <textarea type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\"\n" +
    "                              ng-minlength=1\n" +
    "                              ng-maxlength=1000 ng-model=\"vm.command.description\"\n" +
    "                              style=\"min-height: 60px; max-height: 290px;\"></textarea>\n" +
    "                    <p class=\"help-block\" ng-show=\"editForm.description.$error.maxlength\"\n" +
    "                       data-translate=\"entity.validation.maxlength\"\n" +
    "                       translate-value-max=\"1000\">This field cannot be longer than 1000 characters.\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\" ng-if=\"vm.viewMode==='view'\">\n" +
    "                    <label class=\"control-label\"\n" +
    "                           for=\"field_unapprovedReason\">{{'cmd.approve.reason' | translate}}</label>\n" +
    "                    <textarea type=\"text\" class=\"form-control\" name=\"unapprovedReason\" id=\"field_unapprovedReason\"\n" +
    "                              ng-minlength=1\n" +
    "                              ng-maxlength=1000 ng-model=\"vm.command.unapprovedReason\"\n" +
    "                              style=\"min-height: 60px; max-height: 290px;\"></textarea>\n" +
    "                    <p class=\"help-block\" ng-show=\"editForm.unapprovedReason.$error.maxlength\"\n" +
    "                       data-translate=\"entity.validation.maxlength\"\n" +
    "                       translate-value-max=\"1000\">This field cannot be longer than 1000 characters.\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/command/command-index.html","<div class=\"js-applet-window h-100\">\n" +
    "    <div class=\"js-applet-content opx-layout-hflex\" data-appletcode=\"cmd\" uaa-is-authenticated\n" +
    "         uaa-deny-message=\"{{'jao.command_index' | translate}}\">\n" +
    "        <div class=\"opx-sidebar\">\n" +
    "<!--            <nav class=\"navbar opx-sidebar-header opx-sidebar-header-fixed navbar-light\">-->\n" +
    "<!--                <span class=\"opx-navbar-title\">{{'cmd.index.do_cmd' | translate}}</span>-->\n" +
    "<!--            </nav>-->\n" +
    "            <div class=\"opx-sidebar-body\">\n" +
    "                <div class=\"opx-treenav\">\n" +
    "                    <div class=\"opx-treenav-item\">\n" +
    "                        <a ui-sref=\"app.jao_cmd.command_list\" ui-sref-active=\"active\"><i\n" +
    "                                class=\"fad fa-terminal fa-fw\"></i>\n" +
    "                            {{'cmd.index.list' | translate}}</a>\n" +
    "                    </div>\n" +
    "                    <div class=\"opx-treenav-item\">\n" +
    "                        <a ui-sref=\"app.jao_cmd.job_list({type:'command'})\" ui-sref-active=\"active\"><i\n" +
    "                                class=\"fad fa-cog fa-fw\"></i>\n" +
    "                            {{'cmd.index.command_job' | translate}}</a>\n" +
    "                    </div>\n" +
    "                    <div class=\"opx-treenav-item\">\n" +
    "                        <a ui-sref=\"app.jao_cmd.command_review\" ui-sref-active=\"active\"><i\n" +
    "                                class=\"fad fa-badge-check fa-fw\"></i>{{'cmd.index.approve' | translate}}</a>\n" +
    "                    </div>\n" +
    "                    <div class=\"opx-treenav-item\">\n" +
    "                        <a ui-sref=\"app.jao_cmd.logs\" ui-sref-active=\"active\"><i\n" +
    "                                class=\"fad fa-history fa-fw\"></i>\n" +
    "                            {{'cmd.index.log' | translate}}</a>\n" +
    "                    </div>\n" +
    "                    <div class=\"opx-treenav-item\" uaa-has-permission=\"sysadmin:*:*\">\n" +
    "                        <a ui-sref=\"app.jao_cmd.console\" ui-sref-active=\"active\"><i\n" +
    "                                class=\"fad fa-pencil\"></i>\n" +
    "                            Console</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"opx-flex-fill\" ui-view=\"cmd_main_view\">\n" +
    "            <div class=\"bg-light p-5 h-100 d-flex justify-content-center align-items-center\">\n" +
    "                <div class=\"rounded-lg bg-secondary p-3 text-center text-light d-flex align-items-center justify-content-center\"\n" +
    "                     style=\"width:10rem;height:10rem;opacity: .5;\"><i\n" +
    "                        class=\"fad fa-fw fa-7x fa-terminal\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/command/command-job-config.html","<fieldset ng-disabled=\"!$ctrl.isEditMode\">\n" +
    "    <legend>{{'cmd.job.set_command' | translate}}</legend>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"d-flex mb-3\">\n" +
    "            <label class=\"control-label\">{{'cmd.job.steps' | translate}}</label>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <div class=\"card card-default op-action-card op-w-full\" ng-repeat=\"task in $ctrl.jobConfig.tasks\">\n" +
    "                <div class=\"card-body\">\n" +
    "\n" +
    "                    <div class=\"form-group op-align-horizontal\">\n" +
    "                        <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'cmd.index.command' | translate}}</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <jao-dynamic-command-selector the-model=\"task.commands\" the-data=\"$ctrl.commandList\"\n" +
    "                                                          class=\"w-full\"></jao-dynamic-command-selector>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group op-align-horizontal\">\n" +
    "                        <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'common.entity.variable.host' | translate}}<span\n" +
    "                                op-help-info=\"{{'jao.job.script.host_info' | translate}}\"></span></label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <div class=\"w-full\">\n" +
    "                                <!--<acm-device-selector the-model=\"task.hosts\"></acm-device-selector>-->\n" +
    "                                <acm-device-selector ci-types=\"'[auto]'\" the-model=\"task.hosts\" mcheck-type=\"'map'\"></acm-device-selector>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</fieldset>\n" +
    "")

$templateCache.put("app/modules/jao/command/command-job-edit.html","<div class=\"opx-layout-vflex\" uaa-has-permission=\"cmd:view:*\"\n" +
    "     ng-class=\"{'opx-readonly':!$ctrl.isEditMode}\">\n" +
    "    <nav class=\"navbar navbar-light bg-light\">\n" +
    "        <span class=\"navbar-brand\" ng-if=\"$ctrl.isEditMode\">{{'jao.command_job_edit_html.edit_job' | translate}}</span>\n" +
    "        <span class=\"navbar-brand\" ng-if=\"!$ctrl.isEditMode\">{{'jao.command_job_edit_html.job_settings' | translate}}</span>\n" +
    "    </nav>\n" +
    "    <form class=\"op-smartform form-vertical  op-bold-label p-5 bg-white opx-flex-fill scroll-y\" name=\"jobForm\"\n" +
    "          id=\"js-cmd-edit-{{$ctrl.job.id||'new'}}\">\n" +
    "        <fieldset ng-disabled=\"!$ctrl.isEditMode\">\n" +
    "            <legend>{{'cmd.job.job_set' | translate}}</legend>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'common.entity.detail.title' | translate}} <span\n" +
    "                        class=\"cac-text-required\">*</span></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input class=\"form-control\" ng-model=\"$ctrl.job.title\" required ng-minlength=1>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'common.entity.detail.description' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <textarea class=\"form-control\" ng-model=\"$ctrl.job.description\" rows=\"3\"></textarea>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "        <!-- Type specific config begin -->\n" +
    "        <jao-command-job-config the-model=\"$ctrl.jobConfig\"\n" +
    "                                ng-if=\"$ctrl.job.type=='command'\" edit-mode=\"$ctrl.isEditMode\"></jao-command-job-config>\n" +
    "        <fieldset ng-if=\"!$ctrl.isEditMode\" >\n" +
    "            <legend>{{'cmd.job.run_job' | translate}}</legend>\n" +
    "            <div class=\"align-items-center justify-content-start\">\n" +
    "                <div class=\"ms-auto\" style=\"float: right\">\n" +
    "                    <button class=\"btn btn-outline-primary\" ng-click=\"$ctrl.runJob()\"\n" +
    "                            ng-disabled=\"$ctrl.jobInRunning\">\n" +
    "                        <i class=\"fa fa-hand-pointer-o\" aria-hidden=\"true\"></i>\n" +
    "                        {{'cmd.job.run_job' | translate}}\n" +
    "                    </button>\n" +
    "                    <a ng-if=\"!$ctrl.isEditMode\" uaa-has-permission=\"cmd:edit:*\"\n" +
    "                       type=\"button\" class=\"btn btn-outline-primary\"\n" +
    "                       ui-sref=\"app.jao_cmd.job_list.edit({id:$ctrl.job.id})\">\n" +
    "                        <i class=\"fa fa-pencil\"></i>\n" +
    "                        {{'cmd.job.edit_job' | translate}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <button type=\"button\" class=\"btn btn-outline-danger\" style=\"float: left\" uaa-has-permission=\"cmd:edit:*\"\n" +
    "                        ng-click=\"$ctrl.deleteJob()\">\n" +
    "                    <i class=\"fa fa-trash-alt\"></i>\n" +
    "                    {{'cmd.job.delete_job' | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"overflow-auto w-100 mt-3 mb-3 p-3 bg-secondary text-light code text-break\"\n" +
    "                 ng-if=\"$ctrl.runResult|isNotEmpty\"\n" +
    "                 style=\"white-space: pre-wrap;max-height: 20rem; overflow:auto;\">{{$ctrl.runResult|json}}\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "        <div class=\"ms-auto\" ng-if=\"$ctrl.isEditMode\">\n" +
    "            <div style=\"float: right\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary opx-btn-ok\"\n" +
    "                        ng-click=\"$ctrl.save()\"\n" +
    "                        ng-disabled=\"jobForm.$invalid\">{{'cmd.job.save_job' | translate}}\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\"\n" +
    "                        ng-click=\"$ctrl.cancel()\">{{'cmd.job.button_cancel' | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/command/command-job-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cmd.index.command_job' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-layout-hflex\" uaa-is-authenticated>\n" +
    "        <div class=\"opx-sidebar\" style=\"width: 15rem;\">\n" +
    "            <nav class=\"navbar opx-sidebar-header opx-sidebar-header-fixed\">\n" +
    "                <op-searchbox search-text=\"$ctrl.jobFilter\" style=\"width:10rem;\" class=\"me-2\"></op-searchbox>\n" +
    "                <div class=\"dropdown ms-auto\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle opx-btn-icon\"\n" +
    "                            data-bs-toggle=\"dropdown\">\n" +
    "                        <i class=\"fa fa-line-height\"></i>\n" +
    "                    </button>\n" +
    "                    <div class=\"dropdown-menu dropdown-menu-end\">\n" +
    "                        <a class=\"dropdown-item\"\n" +
    "                           ng-click=\"$ctrl.changeJobOrderBy('title')\">{{'common.entity.detail.name' | translate}}\n" +
    "                            <i style=\"float: right;padding-top: 4px\"\n" +
    "                               ng-class=\"$ctrl.orderMethod ? 'fa fa-sort-alpha-down-alt':'fa fa-sort-alpha-up'\"\n" +
    "                               ng-if=\"$ctrl.orderName == 'title'\"></i>\n" +
    "                        </a>\n" +
    "                        <a class=\"dropdown-item\"\n" +
    "                           ng-click=\"$ctrl.changeJobOrderBy('updatedAt')\">{{'common.entity.detail.update_at' | translate}}\n" +
    "                            <i style=\"float: right;padding-top: 4px\"\n" +
    "                               ng-class=\"$ctrl.orderMethod ? 'fa fa-sort-alpha-down-alt':'fa fa-sort-alpha-up'\"\n" +
    "                               ng-if=\"$ctrl.orderName == 'updatedAt'\"></i>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button type=\"button\" class=\"btn btn-default btn-sm opx-btn-icon\" ng-click=\"$ctrl.createJob()\"\n" +
    "                        title=\"{{'cmd.job.create_job' | translate}}\"\n" +
    "                        uaa-has-permission=\"cmd:edit:*\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </button>\n" +
    "            </nav>\n" +
    "            <div class=\"opx-sidebar-body\">\n" +
    "                <div class=\"list-group list-group-flush op-styled-highlight\">\n" +
    "                    <a ng-repeat=\"job in $ctrl.jobTypeList | filter:$ctrl.jobFilter | orderBy:[$ctrl.orderName,'createdAt']:$ctrl.orderMethod\"\n" +
    "                       ui-sref=\"{{$ctrl.viewUrl}}\"\n" +
    "                       ng-click=\"$ctrl.changeActiveJob(job)\"\n" +
    "                       ng-class=\"{'active':job.id == $ctrl.activeJob}\"\n" +
    "                       class=\"list-group-item list-group-item-action\" title=\"{{job.title}}\"\n" +
    "                       style=\"position:relative;\">\n" +
    "                        <h5 class=\"text-ellipsis\">{{job.title}}</h5>\n" +
    "                        <div class=\"small text-muted\">{{(job.updatedAt || job.createdAt) | date }}\n" +
    "                        </div>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"opx-flex-fill fade-in\" ui-view=\"jaoJobDetailView\">\n" +
    "            <div class=\"h-100 bg-light op-blank-slate\">\n" +
    "                <div class=\"op-blank-slate-icon\">\n" +
    "                    <i class=\"fa fa-inbox op-fa-8x\"></i>\n" +
    "                </div>\n" +
    "                <p></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/command/command-list-approve-detail.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{'cmd.approve.info.detail' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" ng-click=\"$ctrl.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body op-bold-label op-smartform\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'common.entity.detail.status' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\"> {{$ctrl.command.status}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'cmd.approve.checkAt' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\"> {{$ctrl.command.checkAt}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'cmd.approve.reason' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\"> {{$ctrl.command.unapprovedReason}}</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer d-flex flex-row-reverse\">\n" +
    "    <button type=\"button\" class=\"ms-auto btn btn-outline-primary\" ng-click=\"$ctrl.cancel()\">\n" +
    "        <i class=\"fa fa-chevron-left\"></i> {{'common.action.back' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/command/command-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cmd.index.list' | translate}}</div>\n" +
    "        <div class=\"ms-auto\" uaa-has-permission=\"cmd:edit:*\">\n" +
    "            <button class=\"btn btn-outline-primary\" ui-sref=\"app.jao_cmd.command_new\">\n" +
    "                <i class=\"fa fa-plus\"></i>\n" +
    "                {{'cmd.list.button_create_command' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"p-3\" uaa-has-permission=\"cmd:view:*\" uaa-deny-message=\"没有查看命令列表的权限\">\n" +
    "        <div class=\"table-responsive\">\n" +
    "            <opx-datatable table-config=\"$ctrl.tableConfig\">\n" +
    "                <button class=\"btn btn-primary\"\n" +
    "                        ng-disabled=\"!$ctrl.tableConfig.selectedItems.length>0\"\n" +
    "                        ng-click=\"$ctrl.runCommands('runCommand')\">\n" +
    "                    <i class=\"fa fa-caret-square-right fa-fw\"></i> {{'cmd.list.button_run' | translate}}\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-default\" uaa-has-permission=\"cmd:edit:*\"\n" +
    "                        ng-disabled=\"!$ctrl.tableConfig.selectedItems.length>0\"\n" +
    "                        ng-click=\"$ctrl.runCommands('createJob')\">\n" +
    "                    {{'cmd.list.button_create_job' | translate}}\n" +
    "                </button>\n" +
    "            </opx-datatable>\n" +
    "        </div>\n" +
    "        <div class=\"ms-auto\" style=\"float: left\" uaa-has-permission=\"cmd:edit:*\">\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/command/command-logs.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'cmd.index.log' | translate}}</div>\n" +
    "    </nav>\n" +
    "    <udp-page-view uaa-has-permission=\"cmd:view:*\" page-id=\"'/jao/assets/udp/runlogs'\" page-source=\"file\"\n" +
    "                   page-params=\"{type:'command'}\"></udp-page-view>\n" +
    "</div>")

$templateCache.put("app/modules/jao/command/command-run.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myParamLabel\">\n" +
    "        <span ng-if=\"$ctrl.type == 'runCommand'\">{{'cmd.list.button_run' | translate}}</span>\n" +
    "        <span ng-if=\"$ctrl.type != 'runCommand'\">{{'cmd.list.button_create_job' | translate}}</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" ng-click=\"$ctrl.clear()\"></button>\n" +
    "</div>\n" +
    "\n" +
    "<form name=\"editForm\" role=\"form\" novalidate ng-submit=\"$ctrl.saveJob()\" show-validation>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"form-group\" ng-if=\"$ctrl.type == 'createJob'\">\n" +
    "            <label class=\"control-label\" for=\"field_name\">{{'common.entity.detail.title' | translate}}</label>\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"name\" id=\"field_name\" required ng-minlength=1\n" +
    "                   ng-maxlength=50 ng-model=\"$ctrl.title\"/>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-if=\"$ctrl.type == 'createJob'\">\n" +
    "            <label class=\"control-label\" for=\"field_description\">{{'common.entity.detail.description' | translate}}</label>\n" +
    "            <textarea type=\"text\" class=\"form-control\" name=\"description\" id=\"field_description\" rows=\"5\"\n" +
    "                      ng-model=\"$ctrl.description\"></textarea>\n" +
    "        </div>\n" +
    "        <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'common.entity.variable.host' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <div class=\"w-full\">\n" +
    "                <!--                <jao-host-selector the-model=\"$ctrl.hostList\"></jao-host-selector>-->\n" +
    "                <!--<acm-device-selector the-model=\"$ctrl.hostList\"></acm-device-selector>-->\n" +
    "                <acm-device-selector the-model=\"$ctrl.hostList\" ci-types=\"'[auto]'\" mcheck-type=\"'map'\" is-selected=\"true\"></acm-device-selector>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"submit\" ng-disabled=\"editForm.$invalid\" class=\"btn btn-primary opx-btn-ok\" data-dismiss=\"modal\"\n" +
    "                ng-if=\"$ctrl.type == 'createJob'\">{{'cmd.job.save_job' | translate}}\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-primary opx-btn-ok\" ng-click=\"$ctrl.runJob()\"\n" +
    "                ng-if=\"$ctrl.type == 'runCommand'\">{{'cmd.job.run_job' | translate}}\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" data-dismiss=\"modal\" ng-click=\"$ctrl.clear()\">{{'cmd.job.button_cancel' | translate}}</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/jao/command/commandselector/command-dynamic-selector.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"> {{'cmd.job.button_command' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\" style=\"pointer-events: auto;\"\n" +
    "            ng-click=\"$ctrl.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body cm-host-dialog\">\n" +
    "    <div >\n" +
    "        <div class=\"opx-flex-fill table-responsive\">\n" +
    "            <table id=\"command-list-table\" class=\"cm-table table opx-table\"></table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer text-right\">\n" +
    "    <button type=\"reset\" class=\"btn btn-default\" ng-click=\"$ctrl.cancel()\">{{'cmd.job.button_cancel' | translate}}</button>\n" +
    "    <button type=\"submit\" class=\"btn btn-success\" ng-click=\"$ctrl.confirm()\">{{'cmd.job.button_sure' | translate}}</button>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/command/commandselector/command-selector.html","<style type=\"text/css\">\n" +
    "    .pre_command { margin: 0; padding: 0; border: none; }\n" +
    "    .pre_command {\n" +
    "        max-height: 200px;\n" +
    "        background: #f8f9fa;\n" +
    "        margin: 5px auto;\n" +
    "        line-height: 25px;\n" +
    "        overflow-y: auto;\n" +
    "        font-size: 14px;\n" +
    "    }\n" +
    "    /*定义滚动条轨道*/\n" +
    "    .pre_command::-webkit-scrollbar-track { background-color: #f8f9fa; }\n" +
    "    /*定义滚动条高宽及背景*/\n" +
    "    .pre_command::-webkit-scrollbar { width: 5px; }\n" +
    "    /*定义滚动条按钮*/\n" +
    "    .pre_command::-webkit-scrollbar-thumb { border-radius: 5px; background-color: #e9ecef; }\n" +
    "</style>\n" +
    "<div ng-if=\"$ctrl.theCommand.length>0\">\n" +
    "    <div class=\"d-flex flex-nowrap align-items-center\">\n" +
    "        <div class=\"btn btn-sm btn-default d-inline-block op-hover-trigger\" style=\"position:relative;width:10em;\">\n" +
    "            <span class=\"op-hover-to-show pull-right\" ng-click=\"$ctrl.clearAllCommand()\" title={{'cmd.messages.remove_all' | translate}}><i\n" +
    "                    class=\"fa fa-times\"></i></span>\n" +
    "            <span class=\"d-block\"\n" +
    "                  ng-click=\"$ctrl.openCommandDialog()\">{{ 'acm.common.selector.total' | translate}}<strong>{{$ctrl.theCommand.length}}</strong>{{ 'acm.common.selector.item' | translate}}</span>\n" +
    "        </div>\n" +
    "        <op-searchbox search-text=\"$ctrl.filter\" class=\"ms-auto autohide\"></op-searchbox>\n" +
    "    </div>\n" +
    "    <pre class=\"pre_command\" ng-repeat=\"command in $ctrl.theCommand | filter: $ctrl.filter track by $index\">{{command.cmd}}</pre>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.theCommand.length===0\" class=\"op-blank-slate bg-light p-3\">\n" +
    "    <div class=\"op-blank-slate-icon\"><i class=\"fal fa-file-alt\" style=\"font-size:4rem;\"></i></div>\n" +
    "    <div>\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"$ctrl.openCommandDialog()\">{{'cmd.job.button_command' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/cronJob/cron-job-dialog.html","<style>\n" +
    "    .jao-cron-input-style{\n" +
    "        width: 94%;\n" +
    "        margin: auto;\n" +
    "        margin-bottom: 16px;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"modal-header m-t-xs\">\n" +
    "    <h4 class=\"modal-title\" id=\"myAssetNetworkLabel\">\n" +
    "        <span ng-show=\"!vm.cron.id\">{{ 'task_scheduling.add_CRON' | translate}}</span>\n" +
    "        <span ng-show=\"vm.cron.id\">{{ 'task_scheduling.edit_CRON' | translate}}  ID: {{vm.cron.id}}</span>\n" +
    "        <span>\n" +
    "            <a type=\"button\" class=\"btn-close\" style=\"margin: 10px;float: right;\" data-dismiss=\"modal\" ng-click=\"vm.cancel()\"></a>\n" +
    "        </span>\n" +
    "    </h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"form-group jao-cron-input-style\">\n" +
    "        <label class=\"control-label\">\n" +
    "            {{ 'task_scheduling.datatable.job_desc' | translate}} <span class=\"text-danger\">*</span>\n" +
    "        </label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input type=\"text\" class=\"form-control\" ng-model=\"vm.cron.jobDesc\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group jao-cron-input-style\">\n" +
    "        <label class=\"control-label\">\n" +
    "            {{ 'task_scheduling.output_log' | translate}} <span class=\"text-danger\">*</span>\n" +
    "        </label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select class=\"form-select\"  ng-model=\"vm.cron.logOutput\">\n" +
    "               <option ng-repeat=\"option in logOutputs\" value=\"{{option.value}}\">\n" +
    "                    {{option.label}}\n" +
    "                </option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group jao-cron-input-style\">\n" +
    "        <label class=\"control-label\">\n" +
    "            {{ 'task_scheduling.is_encrypt' | translate}} <span class=\"text-danger\">*</span>\n" +
    "        </label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select class=\"form-select\"  ng-model=\"vm.cron.isEncrypt\" ng-disabled=\"vm.jaoHighPower\">\n" +
    "                <option ng-repeat=\"option in isEncrypts\" value=\"{{option.value}}\">\n" +
    "                    {{option.label}}\n" +
    "                </option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group jao-cron-input-style\">\n" +
    "        <label class=\"control-label\">\n" +
    "            {{ 'task_scheduling.datatable.schedule_conf' | translate}} <span class=\"text-danger\">*</span>\n" +
    "        </label>\n" +
    "        <div class=\"input-group\">\n" +
    "                  <input type=\"text\" class=\"form-control\" ng-model=\"vm.cron.scheduleConf\">\n" +
    "<!--            <span class=\"input-group-btn\">-->\n" +
    "                 <button ng-click=\"vm.CronDialogBox()\" style=\"height: 30px;border: 1px solid #ced4da;\" class=\"btn btn-default\"\n" +
    "                         title=\"{{ 'task_scheduling.title_desc_one' | translate}}\">\n" +
    "                    <i class=\"fa fa-calendar-alt\"></i>\n" +
    "                </button>\n" +
    "<!--            </span>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group jao-cron-input-style\">\n" +
    "        <label class=\"control-label\">\n" +
    "            {{ 'adm.menu.appres' | translate}}</span>\n" +
    "        </label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select class=\"form-select\" ng-model=\"vm.cron.appCode\">\n" +
    "                <option value=\"\">\n" +
    "                </option>\n" +
    "                <option ng-repeat=\"option in appletsList\" value=\"{{option.name}}\">\n" +
    "                    {{option.title}}\n" +
    "                </option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group jao-cron-input-style\">\n" +
    "        <label class=\"control-label\">\n" +
    "            {{ 'task_scheduling.execution_job_type' | translate}} <span class=\"text-danger\">*</span>\n" +
    "        </label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select class=\"form-select \" ng-model=\"vm.cron.jobType\" ng-change=\"showTemplate()\">\n" +
    "                <option ng-repeat=\"option in jobTypes\" value=\"{{option.value}}\">\n" +
    "                    {{option.label}}\n" +
    "                </option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group jao-cron-input-style\">\n" +
    "        <label class=\"control-label\">\n" +
    "            {{ 'task_scheduling.select_execute_job' | translate}} <span class=\"text-danger\">*</span>\n" +
    "        </label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "\n" +
    "            <select ng-if=\"vm.displayType\" op-select class=\"form-select\" ng-model=\"vm.cron.jobId\" ng-change=\"showJobParameter()\">\n" +
    "                <option ng-repeat=\"option in jobList\" value=\"{{option.id}}\">\n" +
    "                    {{option.id.length > 20 ? option.templateName : option.title}}\n" +
    "                </option>\n" +
    "            </select>\n" +
    "            <div ng-if=\"!vm.displayType && 'cac' === vm.cron.jobType\" class=\"form-control-wrapper\">\n" +
    "                <select ng-model=\"vm.ccfIds\" class=\"form-select\"\n" +
    "                        op-select multiple\n" +
    "                        ng-options=\"city.id as city.templateName for city in jobList\"></select>\n" +
    "            </div>\n" +
    "            <div ng-if=\"!vm.displayType && 'cmd' === vm.cron.jobType\" class=\"form-control-wrapper\">\n" +
    "                <select ng-model=\"vm.ccfIds\" class=\"form-select\"\n" +
    "                        op-select multiple\n" +
    "                        ng-options=\"city.id as city.name for city in jobList\"></select>\n" +
    "            </div>\n" +
    "<!--            <div ng-if=\"!vm.displayType && 'flows' === vm.cron.jobType\" class=\"form-control-wrapper\">-->\n" +
    "<!--                <select ng-model=\"vm.ccfIds\" class=\"form-select\"-->\n" +
    "<!--                        op-select multiple-->\n" +
    "<!--                        ng-options=\"city.id as city.name for city in jobList\"></select>-->\n" +
    "<!--            </div>-->\n" +
    "            <div ng-if=\"!vm.displayType && 'flows' === vm.cron.jobType\" class=\"form-control-wrapper\">\n" +
    "                <select op-select class=\"form-select\" ng-model=\"vm.ccfIds[0]\">\n" +
    "                    <option ng-repeat=\"option in jobList\" value=\"{{option.id}}\">\n" +
    "                        {{option.name}}\n" +
    "                    </option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- 新增：选择作业团队\n" +
    "    <div class=\"form-group jao-cron-input-style\">\n" +
    "        <label class=\"control-label\">\n" +
    "            {{ 'task_scheduling.select_job_team' | translate}} <span class=\"text-danger\">*</span>\n" +
    "        </label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select class=\"form-select\" ng-model=\"vm.cron.teamId\" required>\n" +
    "                <option value=\"\">{{ 'task_scheduling.select_job_team_placeholder' | translate}}</option>\n" +
    "                <option ng-repeat=\"team in teamList\" value=\"{{team.id}}\">\n" +
    "                    {{team.name}}\n" +
    "                </option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div> -->\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <div class=\"form-group w-100 m-b-sm\">\n" +
    "        <button class=\"btn btn-outline-primary\" style=\"margin-left:3%;\" ng-if=\"vm.cron.jobId != '' || vm.cron.jobType == 'cmd' || vm.cron.jobType == 'cac'\"\n" +
    "                title=\"{{ 'task_scheduling.title_desc_two' | translate}}\" ng-click=\"vm.JobOperatingParam()\"><i\n" +
    "                class=\"fa fa-diagnoses\"></i>\n" +
    "            {{ 'task_scheduling.operating_param' | translate}}\n" +
    "        </button>\n" +
    "        <button type=\"reset\" class=\"btn btn-default pull-right\" style=\"margin-right: 20px;\" ng-click=\"vm.cancel()\">\n" +
    "            <i class=\"fa fa-reply\"></i>\n" +
    "            {{ 'common.entity.action.back' | translate}}\n" +
    "        </button>\n" +
    "        <button class=\"btn btn-primary pull-right\" style=\"margin-right: 6px;\" ng-click=\"vm.save()\"\n" +
    "                ng-disabled=\"(!vm.cron.jobId && vm.ccfIds.length < 1) || !vm.cron.jobType || !vm.cron.scheduleConf || !vm.cron.jobDesc || !vm.cron.logOutput || !vm.cron.isEncrypt\">\n" +
    "            <i class=\"fa fa-check\"></i>\n" +
    "            {{ 'common.entity.action.save' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/cronJob/cron-job-list.html","<div class=\"opx-layout-vflex h-full\" ng-controller=\"CronJobController as $ctrl\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">任务调度管理</div>\n" +
    "        <div class=\"ms-auto\" style=\"display: flex; align-items: center;\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"$ctrl.openNewTaskModal()\" uaa-has-permission=\"jao:edit:*\" style=\"margin-right: 5px;\">\n" +
    "                <i class=\"fa fa-plus\"></i> 新增任务\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-warning\" ng-click=\"$ctrl.testNewTask()\" title=\"测试新增任务\" style=\"margin-right: 5px;\">\n" +
    "                <i class=\"fa fa-bug\"></i> 测试新增\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-danger\" ng-click=\"$ctrl.showDebugInfo()\" title=\"显示调试信息\" style=\"margin-right: 5px;\">\n" +
    "                <i class=\"fa fa-info\"></i> 调试信息\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-success\" ng-click=\"alert('按钮点击测试')\" title=\"简单测试\" style=\"margin-right: 5px;\">\n" +
    "                <i class=\"fa fa-check\"></i> 简单测试\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-outline-secondary\" ng-click=\"$ctrl.batchStartStopCron()\" ng-show=\"$ctrl.selectedCrons && $ctrl.selectedCrons.length > 0\" uaa-has-permission=\"jao:edit:*\">\n" +
    "                <i class=\"fa fa-play-pause\"></i> 批量启停\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-outline-info\" ng-click=\"$ctrl.debugApiConnection()\" title=\"测试API连接\">\n" +
    "                <i class=\"fa fa-bug\"></i> 调试\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    \n" +
    "    <div class=\"flex-fill p-3\">\n" +
    "        <div class=\"card\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <!-- 调试信息 -->\n" +
    "                <div class=\"alert alert-info\" ng-if=\"$ctrl.debugMode\">\n" +
    "                    <h5>调试信息:</h5>\n" +
    "                    <p>控制器状态: {{ $ctrl ? '已加载' : '未加载' }}</p>\n" +
    "                    <p>表格配置: {{ $ctrl.tableConfig ? '已配置' : '未配置' }}</p>\n" +
    "                    <p>API基础URL: {{ $ctrl.apiBaseUrl || '未设置' }}</p>\n" +
    "                </div>\n" +
    "                \n" +
    "                <!-- 数据表格 -->\n" +
    "                <div ng-if=\"$ctrl.tableConfig\">\n" +
    "                    <opx-datatable table-config=\"$ctrl.tableConfig\" class=\"table-responsive\"></opx-datatable>\n" +
    "                </div>\n" +
    "                \n" +
    "                <!-- 加载状态 -->\n" +
    "                <div ng-if=\"!$ctrl.tableConfig\" class=\"text-center p-4\">\n" +
    "                    <i class=\"fa fa-spinner fa-spin\"></i> 正在初始化...\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/cronJob/cron.html","<style>\n" +
    "    .zdy div {\n" +
    "        float: left;\n" +
    "    }\n" +
    "\n" +
    "    .icheckbox_square-blue,\n" +
    "    .iradio_square-blue {\n" +
    "        display: inline-block;\n" +
    "        vertical-align: middle;\n" +
    "        margin: 0;\n" +
    "        padding: 0;\n" +
    "        width: 22px;\n" +
    "        height: 22px;\n" +
    "        background: url(content/images/cron/blue.png) no-repeat;\n" +
    "        border: none;\n" +
    "        cursor: pointer;\n" +
    "    }\n" +
    "\n" +
    "    .icheckbox_square-blue {\n" +
    "        background-position: 0 0;\n" +
    "    }\n" +
    "\n" +
    "    .icheckbox_square-blue.hover {\n" +
    "        background-position: -24px 0;\n" +
    "    }\n" +
    "\n" +
    "    .icheckbox_square-blue.checked {\n" +
    "        background-position: -48px 0;\n" +
    "    }\n" +
    "\n" +
    "    .icheckbox_square-blue.disabled {\n" +
    "        background-position: -72px 0;\n" +
    "        cursor: default;\n" +
    "    }\n" +
    "\n" +
    "    .icheckbox_square-blue.checked.disabled {\n" +
    "        background-position: -96px 0;\n" +
    "    }\n" +
    "\n" +
    "    .iradio_square-blue {\n" +
    "        background-position: -120px 0;\n" +
    "    }\n" +
    "\n" +
    "    .iradio_square-blue.hover {\n" +
    "        background-position: -144px 0;\n" +
    "    }\n" +
    "\n" +
    "    .iradio_square-blue.checked {\n" +
    "        background-position: -168px 0;\n" +
    "    }\n" +
    "\n" +
    "    .iradio_square-blue.disabled {\n" +
    "        background-position: -192px 0;\n" +
    "        cursor: default;\n" +
    "    }\n" +
    "\n" +
    "    .iradio_square-blue.checked.disabled {\n" +
    "        background-position: -216px 0;\n" +
    "    }\n" +
    "\n" +
    "    /* HiDPI support */\n" +
    "    @media (-o-min-device-pixel-ratio: 5/4), (-webkit-min-device-pixel-ratio: 1.25), (min-resolution: 120dpi), (min-resolution: 1.25dppx) {\n" +
    "        .icheckbox_square-blue,\n" +
    "        .iradio_square-blue {\n" +
    "            background-image: url(content/images/cron/blue@2x.png);\n" +
    "            -webkit-background-size: 240px 24px;\n" +
    "            background-size: 240px 24px;\n" +
    "        }\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"container-fluid\">\n" +
    "    <div style=\"margin-left: -18px;width: 850px;height: 400px;margin-left: -100px;margin-right: 98px;\">\n" +
    "        <div class=\"card card-primary\">\n" +
    "            <div class=\"card-header\">\n" +
    "                <h3 class=\"card-title\">{{ 'task_scheduling.cron_control.generator' | translate}}</h3>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <uib-tabset type=\"mdc-op mb-4\">\n" +
    "                    <uib-tab heading=\"{{ 'task_scheduling.cron_control.second' | translate}}\"\n" +
    "                             onclick=\"test('t_second');\">\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"{{ 'task_scheduling.cron_control.branch' | translate}}\" onclick=\"test('t_min');\">\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"{{ 'task_scheduling.cron_control.hour' | translate}}\" onclick=\"test('t_hour');\">\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"{{ 'task_scheduling.cron_control.day' | translate}}\" onclick=\"test('t_day');\">\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"{{ 'task_scheduling.cron_control.month' | translate}}\" onclick=\"test('t_month');\">\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"{{ 'task_scheduling.cron_control.week' | translate}}\" onclick=\"test('t_week');\">\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"{{ 'task_scheduling.cron_control.year' | translate}}\" onclick=\"test('t_year');\">\n" +
    "                    </uib-tab>\n" +
    "                </uib-tabset>\n" +
    "                <div id=\"cronTabContent\">\n" +
    "                    <!--秒start-->\n" +
    "                    <div id=\"t_second\">\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" checked=\"checked\" id=\"r_second\" name=\"second\" class=\"firstradio\"/>&nbsp;\n" +
    "                                &nbsp; {{ 'task_scheduling.cron_control.secondly' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        <input type=\"radio\" name=\"second\" class=\"cycleradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.cycle' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-max=\"59\" value=\"0\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"second\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large\"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.second' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.reach' | translate}}\n" +
    "                                        <input type=\"text\" data-max=\"59\" value=\"0\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"second\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\"  icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.second' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        <input type=\"radio\" name=\"second\" class=\"loopradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.loop' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-max=\"59\" value=\"0\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"second\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.second' | translate}} {{\n" +
    "                                        'task_scheduling.cron_control.start' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.each' | translate}}\n" +
    "                                        <input type=\"text\" data-max=\"59\" value=\"0\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"second\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.second' | translate}} {{\n" +
    "                                        'task_scheduling.datatable.execute_once' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"second\" class=\"choiceradio\"/>&nbsp; &nbsp;{{\n" +
    "                                'task_scheduling.cron_control.custom' | translate}} </p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"secondList zdy\" id=\"l_second\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!--秒end-->\n" +
    "                    <!--分start-->\n" +
    "                    <div id=\"t_min\">\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" checked=\"checked\" id=\"r_minute\" name=\"min\" class=\"firstradio\"/>&nbsp;\n" +
    "                                &nbsp; {{ 'task_scheduling.cron_control.branchly' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        <input type=\"radio\" name=\"min\" class=\"cycleradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.cycle' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-max=\"59\" value=\"0\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"min\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.branch' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.reach' | translate}}\n" +
    "                                        <input type=\"text\" data-max=\"59\" value=\"0\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"min\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\"  icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.branch' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        <input type=\"radio\" name=\"min\" class=\"loopradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.loop' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-max=\"59\" value=\"0\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"min\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.branch' | translate}} {{\n" +
    "                                        'task_scheduling.cron_control.start' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.each' | translate}}\n" +
    "                                        <input type=\"text\" data-max=\"59\" value=\"0\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"min\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.branch' | translate}} {{\n" +
    "                                        'task_scheduling.datatable.execute_once' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"min\" class=\"choiceradio\"/>&nbsp; &nbsp;{{\n" +
    "                                'task_scheduling.cron_control.custom' | translate}} </p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"minList zdy\" id=\"l_min\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!--分end-->\n" +
    "                    <!--时start-->\n" +
    "                    <div id=\"t_hour\">\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" checked=\"checked\" id=\"r_hour\" name=\"hour\" class=\"firstradio\"/>&nbsp;\n" +
    "                                &nbsp; {{ 'task_scheduling.cron_control.each' | translate}} {{\n" +
    "                                'task_scheduling.cron_control.hour' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        <input type=\"radio\" name=\"hour\" class=\"cycleradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.cycle' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"hour\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"hour\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.hour' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.reach' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"hour\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"hour\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\"  icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.hour' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        <input type=\"radio\" name=\"hour\" class=\"loopradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.loop' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"hour\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"hour\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.hour' | translate}} {{\n" +
    "                                        'task_scheduling.cron_control.start' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.each' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"hour\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"hour\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.hour' | translate}} {{\n" +
    "                                        'task_scheduling.datatable.execute_once' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"hour\" class=\"choiceradio\"/>&nbsp; &nbsp;{{\n" +
    "                                'task_scheduling.cron_control.custom' | translate}} </p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"hourList zdy\" id=\"l_hour\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!--时end-->\n" +
    "                    <!--日start-->\n" +
    "                    <div id=\"t_day\">\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" checked=\"checked\" id=\"r_day\" name=\"day\" class=\"firstradio\"/>&nbsp;\n" +
    "                                &nbsp; {{ 'task_scheduling.cron_control.dayly' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"day\" class=\"noconfirmradio\"/>&nbsp; &nbsp; {{\n" +
    "                                'task_scheduling.cron_control.month_list.one' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"day\" class=\"lastdayradio\"/>&nbsp; &nbsp; {{\n" +
    "                                'task_scheduling.cron_control.month_list.two' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        <input type=\"radio\" name=\"day\" class=\"cycleradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.cycle' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"day\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"day\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.day' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.reach' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"day\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"day\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\"  icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.day' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        <input type=\"radio\" name=\"day\" class=\"loopradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.loop' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"day\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"day\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.day' | translate}} {{\n" +
    "                                        'task_scheduling.cron_control.start' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.each' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"day\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"day\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.day' | translate}} {{\n" +
    "                                        'task_scheduling.datatable.execute_once' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-6\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"nearspin\">\n" +
    "                                        <input type=\"radio\" name=\"day\" class=\"nearradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.monthly' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.month_list.three' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"day\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"day\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.day' | translate}}\n" +
    "                                        {{'task_scheduling.cron_control.last_working_day' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"day\" class=\"choiceradio\"/>&nbsp; &nbsp;{{\n" +
    "                                'task_scheduling.cron_control.custom' | translate}} </p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"dayList zdy\" id=\"l_day\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!--日end-->\n" +
    "                    <!--月start-->\n" +
    "                    <div id=\"t_month\">\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" checked=\"checked\" id=\"r_month\" name=\"month\" class=\"firstradio\"/>&nbsp;\n" +
    "                                &nbsp; {{ 'task_scheduling.cron_control.monthly' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        <input type=\"radio\" name=\"month\" class=\"cycleradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.cycle' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"month\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"month\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.month' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.reach' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"month\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"month\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\"  icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.month' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        <input type=\"radio\" name=\"month\" class=\"loopradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.loop' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"month\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"month\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.month' | translate}} {{\n" +
    "                                        'task_scheduling.cron_control.start' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.each' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"month\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"month\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.month' | translate}} {{\n" +
    "                                        'task_scheduling.datatable.execute_once' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"month\" class=\"choiceradio\"/>&nbsp; &nbsp;{{\n" +
    "                                'task_scheduling.cron_control.custom' | translate}} </p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"monthList zdy\" id=\"l_month\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!--月end-->\n" +
    "                    <!--周start-->\n" +
    "                    <div id=\"t_week\">\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" checked=\"checked\" id=\"r_week\" name=\"week\" class=\"firstradio\"/>&nbsp;\n" +
    "                                &nbsp; {{ 'task_scheduling.cron_control.weekly' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"week\" class=\"noconfirmradio\"/>&nbsp; &nbsp; {{\n" +
    "                                'task_scheduling.cron_control.week_list.one' | translate}} </p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        <input type=\"radio\" name=\"week\" class=\"cycleradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.cycle' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from_week' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"percent\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"week\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        {{'task_scheduling.cron_control.to_the_week' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"percent\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"week\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\"  icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        <input type=\"radio\" name=\"week\" class=\"loopradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.loop' | translate}} &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.from_week' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"percent\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"week\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.start' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"loopspin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.every_other' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"percent\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"week\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                        {{ 'task_scheduling.cron_control.sky' | translate}}{{\n" +
    "                                        'task_scheduling.datatable.execute_once' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"designspin\">\n" +
    "                                        <input type=\"radio\" name=\"week\" class=\"designradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.specify' | translate}}&nbsp;\n" +
    "                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{'task_scheduling.cron_control.clause' |\n" +
    "                                        translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"percent\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"week\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a> {{\n" +
    "                                        'task_scheduling.cron_control.circumferential' |\n" +
    "                                        translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"designspin\">\n" +
    "                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ 'task_scheduling.cron_control.week' |\n" +
    "                                        translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"percent\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"week\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-12 col-md-6\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"lastspin\">\n" +
    "                                        <input type=\"radio\" name=\"week\" class=\"lastradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.week_list.two' | translate}}\n" +
    "                                        <input type=\"text\" data-rule=\"percent\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"week\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"week\" class=\"choiceradio\"/>&nbsp; &nbsp;{{\n" +
    "                                'task_scheduling.cron_control.custom' | translate}} </p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"weekList zdy\" id=\"l_week\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!--周end-->\n" +
    "                    <!--年start-->\n" +
    "                    <div id=\"t_year\">\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" checked=\"checked\" id=\"r_year\" name=\"year\" class=\"unselectradio\"/>&nbsp;\n" +
    "                                &nbsp; {{ 'task_scheduling.cron_control.not_specified' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p><input type=\"radio\" name=\"year\" class=\"firstradio\"/>&nbsp; &nbsp; {{\n" +
    "                                'task_scheduling.cron_control.yearly' | translate}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"radiocheck\">\n" +
    "                            <p></p>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        <input type=\"radio\" name=\"year\" class=\"cycleradio\"/> &nbsp; &nbsp;{{\n" +
    "                                        'task_scheduling.cron_control.cycle' | translate}}&nbsp; {{\n" +
    "                                        'task_scheduling.cron_control.from' | translate}}\n" +
    "                                        <input type=\"text\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"year\" value=\"2015\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\" icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i\n" +
    "                                                class=\"  icon-plus-sign icon-large\"></i></a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-12 col-sm-6 col-md-3\">\n" +
    "                                    <div data-trigger=\"spinner\" class=\"cyclespin\">\n" +
    "                                        {{ 'task_scheduling.cron_control.reach' | translate}}\n" +
    "                                        <input type=\"text\" style=\"width:50px;display: initial;\"\n" +
    "                                               class=\"form-control numberspinner\" name=\"year\" value=\"2016\"/>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"down\"><i\n" +
    "                                                class=\"  icon-minus-sign icon-large \"></i></a>\n" +
    "                                        <a href=\"javascript:;\" data-spin=\"up\"><i class=\"icon-plus-sign icon-large\"></i></a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!--年end-->\n" +
    "                </div>\n" +
    "                <div class=\"card card-primary\" style=\"height: 210px;\">\n" +
    "                    <div class=\"card-header\">\n" +
    "                        <h3 class=\"card-title\">{{ 'task_scheduling.cron_control.expression_result' | translate}}</h3>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <div class=\"table-responsive\">\n" +
    "                            <table class=\"table table-bordered\">\n" +
    "                                <thead>\n" +
    "                                <tr>\n" +
    "                                    <th>{{ 'task_scheduling.cron_control.second' | translate}}</th>\n" +
    "                                    <th>{{ 'task_scheduling.cron_control.branch' | translate}}</th>\n" +
    "                                    <th>{{ 'task_scheduling.cron_control.hour' | translate}}</th>\n" +
    "                                    <th>{{ 'task_scheduling.cron_control.day' | translate}}</th>\n" +
    "                                    <th>{{ 'task_scheduling.cron_control.month' | translate}}</th>\n" +
    "                                    <th>{{ 'task_scheduling.cron_control.week' | translate}}</th>\n" +
    "                                    <th>{{ 'task_scheduling.cron_control.year' | translate}}</th>\n" +
    "                                </tr>\n" +
    "                                </thead>\n" +
    "                                <tbody>\n" +
    "                                <tr>\n" +
    "                                    <td><span name=\"v_second\">*</span></td>\n" +
    "                                    <td><span name=\"v_min\">*</span></td>\n" +
    "                                    <td><span name=\"v_hour\">*</span></td>\n" +
    "                                    <td><span name=\"v_day\">*</span></td>\n" +
    "                                    <td><span name=\"v_month\">*</span></td>\n" +
    "                                    <td><span name=\"v_week\">?</span></td>\n" +
    "                                    <td><span name=\"v_year\"></span></td>\n" +
    "                                </tr>\n" +
    "                                </tbody>\n" +
    "                            </table>\n" +
    "                        </div>\n" +
    "                        <div class=\"well well-sm\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"\">\n" +
    "                                    <b>{{ 'task_scheduling.datatable.schedule_conf' | translate}}：</b>\n" +
    "                                </div>\n" +
    "                                <div>\n" +
    "                                    <span>\n" +
    "                                    <input type=\"text\" name=\"cron\" style=\"width: 40%;height: 30px;\"\n" +
    "                                           ng-model=\"$ctrl.cron\" id=\"cron\"/>\n" +
    "                                    <input type=\"hidden\" id=\"transCron\" name=\"transCron\" value=\"\"/>\n" +
    "                                    </span>\n" +
    "                                    <span style=\"position: absolute; margin-left: 2px;\">\n" +
    "                                        <button class=\"btn btn-primary\" ng-click=\"$ctrl.scheduleConf()\"> <i\n" +
    "                                                class=\"fa fa-check\"></i> {{ 'task_scheduling.cron_control.save_cron' | translate}} </button>\n" +
    "                                       <button type=\"reset\" class=\"btn btn-primary\" ng-click=\"$ctrl.nextRunTime()\"> <i\n" +
    "                                               class=\"fa fa-history\"></i> {{'task_scheduling.datatable.nextExecutionTime' | translate}} </button>\n" +
    "                                        <button type=\"reset\" class=\"btn btn-default\" ng-click=\"$ctrl.cancel()\"> <i\n" +
    "                                                class=\"fa fa-reply\"></i> {{'common.entity.action.back' | translate}} </button>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<script>\n" +
    "    // Cron 表达式生成器初始化\n" +
    "    // 初始化函数已移至外部 init.js 文件\n" +
    "    // 这里只保留必要的初始化调用\n" +
    "    $(function () {\n" +
    "        // 延迟初始化，确保外部函数已加载\n" +
    "        setTimeout(function () {\n" +
    "            if (typeof window.cronInit === 'function') {\n" +
    "                window.cronInit();\n" +
    "            }\n" +
    "        }, 100);\n" +
    "    });\n" +
    "</script>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/jao/datamodel/dc-data-add.html","<div class=\"opx-layout-vflex\" uaa-is-authenticated uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\"><a ui-sref=\"app.appman.datamodel\">{{'jao.index.data_model' | translate}}</a></li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">\n" +
    "                    {{ ({view: 'jao.dc.view', create: 'jao.dc.create', edit: 'jao.dc.edit'}[$ctrl.viewMode]) | translate }}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div class=\"navbar-nav ms-auto\" ng-if=\"$ctrl.viewMode==='view'\" uaa-has-permission=\"jao:edit:*\">\n" +
    "            <button class=\"btn btn-outline-primary\" ui-sref=\"app.appman.datamodel.edit({id:$ctrl.id})\"><i\n" +
    "                    class=\"fa fa-pencil\"></i> {{'jao.dc.edit' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill p-3\">\n" +
    "        <jao-ci-model-editor dc-code=\"$ctrl.id\" view-mode=\"$ctrl.viewMode\">\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/datamodel/dc-data-view.html","<umd-data-view the-data=\"$ctrl.theData\" model-def=\"$ctrl.theModel\"></umd-data-view>")

$templateCache.put("app/modules/jao/datamodel/dc-model-config.html","<form class=\"op-smartform form-vertical\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'jao.dc.detail.code' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input ng-disabled=\"$ctrl.viewMode==='view' || $ctrl.viewMode==='edit'\" type=\"text\" ng-model=\"$ctrl.modelConfig.code\"\n" +
    "                   class=\"form-control\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'common.entity.detail.name' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input ng-disabled=\"$ctrl.viewMode==='view'\" type=\"text\" ng-model=\"$ctrl.modelConfig.title\"\n" +
    "                   class=\"form-control\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "<!--    <div class=\"form-group\">-->\n" +
    "<!--        <label class=\"control-label\">{{'jao.dc.detail.owner_application' | translate}}</label>-->\n" +
    "<!--        <div class=\"form-control-wrapper\">-->\n" +
    "<!--            <select ng-disabled=\"$ctrl.viewMode==='view'\" class=\"form-select w-sm\" style=\"width: 16rem;\"-->\n" +
    "<!--                    ng-model=\"$ctrl.modelConfig.appletCode\"-->\n" +
    "<!--                    ng-options=\"app.name as app.title for app in $ctrl.apps\">-->\n" +
    "<!--            </select>-->\n" +
    "<!--        </div>-->\n" +
    "<!--    </div>-->\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'jao.dc.detail.mode' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <div class=\"opx-check-group opx-secondary btn-group\">\n" +
    "                <input ng-repeat-start=\"option in dcDataTypes track by $index\" type=\"radio\" name=\"mc_datamode\"\n" +
    "                       value=\"{{option.value}}\"\n" +
    "                       ng-model=\"$ctrl.modelConfig.dataMode\"\n" +
    "                       id=\"mc_datamode_{{$index}}\">\n" +
    "                <label ng-repeat-end for=\"mc_datamode_{{$index}}\">{{option.label}}</label>\n" +
    "            </div>\n" +
    "            <!--            <select class=\"form-select op-w-sm\"-->\n" +
    "            <!--                    ng-model=\"$ctrl.modelConfig.dataMode\"-->\n" +
    "            <!--                    ng-disabled=\"$ctrl.viewMode==='view'\">-->\n" +
    "            <!--                <option ng-repeat=\"option in dcDataTypes\" value=\"{{option.value}}\">-->\n" +
    "            <!--                    {{option.label}}-->\n" +
    "            <!--                </option>-->\n" +
    "            <!--            </select>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <fieldset class=\"mt-3\" ng-disabled=\"$ctrl.viewMode==='view'\">\n" +
    "        <legend>{{'jao.dc.detail.attr' | translate}}</legend>\n" +
    "        <umd-config-attrs ng-model=\"$ctrl.modelConfig.attrs\" class=\"d-block\"></umd-config-attrs>\n" +
    "    </fieldset>\n" +
    "\n" +
    "    <div class=\"op-form-actions\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary opx-btn-ok\" ng-click=\"$ctrl.save($ctrl.modelConfig)\"\n" +
    "                ng-show=\"$ctrl.viewMode==='edit' || $ctrl.viewMode==='create'\">{{'common.entity.action.save' | translate}}\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-default opx-btn-cancel\" ui-sref=\"app.appman.datamodel\">\n" +
    "            {{'common.entity.action.back' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</form>")

$templateCache.put("app/modules/jao/datamodel/dc-selector.html","<div ng-if=\"$ctrl.getData().length > 0\">\n" +
    "    <div class=\"d-flex flex-nowrap align-items-center\">\n" +
    "        <div class=\"btn btn-sm btn-default d-inline-block op-hover-trigger\"\n" +
    "                ng-class=\"{'pe-none': $ctrl.readonly}\"\n" +
    "                style=\"position:relative;width:10em;\">\n" +
    "        <span class=\"op-hover-to-show pull-right\" ng-click=\"$ctrl.emptyItems()\"\n" +
    "                ng-show=\"!$ctrl.readonly\"\n" +
    "                title=\"{{'common.umd_config.move_all' | translate}}\"><i\n" +
    "                class=\"fa fa-times\"></i></span>\n" +
    "            <span class=\"d-block\"\n" +
    "                    ng-click=\"$ctrl.openDeviceSelectorDialog()\">{{ 'acm.common.selector.total' | translate}}<strong>{{$ctrl.getData().length}}</strong>{{ 'acm.common.selector.item' | translate}}</span>\n" +
    "        </div>\n" +
    "        <op-searchbox search-text=\"$ctrl.filter\" class=\"ms-auto autohide\"></op-searchbox>\n" +
    "    </div>\n" +
    "    <ul class=\"list list-unstyled list-inline\" style=\"max-height:10rem; overflow-y:auto;\">\n" +
    "        <li ng-repeat=\"data in $ctrl.getData() | filter: $ctrl.filter track by $index\"\n" +
    "            class=\"op-hover-trigger mb-3\">\n" +
    "            <div class=\"badge bg-secondary op-text-normal op-cursor-default py-2 px-2\">\n" +
    "                {{data}}\n" +
    "                <a ng-click=\"$ctrl.removeItem($index)\" ng-show=\"!$ctrl.readonly\">&times;</a>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div ng-if=\"!$ctrl.getData() || $ctrl.getData().length === 0\" __class=\"op-blank-slate bg-light p-3\">\n" +
    "    <!--        <div class=\"op-blank-slate-icon\"><i class=\"fal fa-server\" style=\"font-size:4rem;\"></i></div>-->\n" +
    "    <button type=\"button\" class=\"btn btn-outline-default\" ng-click=\"$ctrl.openDeviceSelectorDialog()\"><i\n" +
    "            class=\"fal fa-server\" ng-disabled=\"$ctrl.readonly\"></i> {{$ctrl.theOptions.thisLabel || ''}}\n" +
    "    </button>\n" +
    "    <!--        </div>-->\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/flow/flow-edit.html","<!--<style>\n" +
    "    .i-switch {\n" +
    "        background-color: #007bff;\n" +
    "    }\n" +
    "    .i-switch i:before{\n" +
    "        background-color: #6f6d85;\n" +
    "    }\n" +
    "</style>-->\n" +
    "<div class=\"opx-layout-vflex\" uaa-has-permission=\"{{$ctrl.pagePermission}}\"\n" +
    "     uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <span class=\"opx-navbar-title\">{{'jao.flow.edit' | translate}}</span>\n" +
    "        <div class=\"ms-auto\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary opx-btn-ok\"\n" +
    "                    ng-click=\"$ctrl.save()\" ng-if=\"!$ctrl.isInstance\"\n" +
    "                    ng-disabled=\"flowForm.$invalid\" uaa-has-permission=\"jao:edit:*\">\n" +
    "                {{'common.entity.action.save' | translate}}\n" +
    "            </button>\n" +
    "            <button ng-if=\"$ctrl.isInstance\" type=\"button\" class=\"btn btn-primary opx-btn-ok\"\n" +
    "                    ng-click=\"$ctrl.startFlow()\"\n" +
    "                    ng-disabled=\"flowForm.$invalid\" uaa-has-permission=\"jao:run:*\">{{'jao.flow.run' | translate}}\n" +
    "            </button>\n" +
    "            <button type=\"button\" class=\"btn btn-default\"\n" +
    "                    ng-click=\"$ctrl.cancel()\">{{'common.entity.action.cancel' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <form class=\"op-smartform form-vertical  op-bold-label p-5 bg-white opx-flex-fill scroll-y\" name=\"flowForm\"\n" +
    "          id=\"js-flow-edit-{{$ctrl.flow.id||'new'}}\">\n" +
    "        <fieldset>\n" +
    "            <legend>{{'jao.flow.detail.base' | translate}}</legend>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'common.entity.detail.title' | translate}} <span\n" +
    "                        class=\"cac-text-required\">*</span></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input class=\"form-control\" ng-model=\"$ctrl.flow.name\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'common.entity.detail.description' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <textarea class=\"form-control\" ng-model=\"$ctrl.flow.description\" rows=\"3\"></textarea>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'jao.common.host' | translate}}<span\n" +
    "                        op-help-info=\"{{'jao.flow.detail.host_info' | translate}}\"></span></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"w-full\">\n" +
    "                        <div class=\"mt-3\">\n" +
    "                            <!--                            <jao-host-selector the-model=\"$ctrl.flow.hosts\"></jao-host-selector>-->\n" +
    "                            <acm-device-selector the-model=\"$ctrl.flow.hosts\" ci-types=\"'[auto]'\"\n" +
    "                                                 mcheck-type=\"'map'\"></acm-device-selector>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "        <!-- TODO:暂时只考虑脚本作业 -->\n" +
    "        <fieldset ng-disabled=\"$ctrl.isInstance\">\n" +
    "            <legend>{{'jao.flow.detail.step_settings' | translate}}</legend>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"d-flex mb-3\">\n" +
    "                    <label class=\"control-label\" ng-click=\"$ctrl.changeStepFold()\">{{'jao.flow.detail.step' | translate}}\n" +
    "                        <i class=\"fa fa-angle-double-down\" ng-if=\"!$ctrl.isFoldAllSteps\"></i>\n" +
    "                        <i class=\"fa fa-angle-double-left\" ng-if=\"$ctrl.isFoldAllSteps\"></i>\n" +
    "                    </label>\n" +
    "                    <button class=\"btn btn-sm btn-default ms-3\"\n" +
    "                            ng-click=\"$ctrl.addStep()\"><i class=\"text-primary fa fa-plus-circle\"></i>\n" +
    "                        {{'jao.flow.detail.step.create' | translate}}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"card card-default op-action-card op-w-full\" ng-repeat=\"step in $ctrl.flow.steps\">\n" +
    "                        <div class=\"card-header\" ng-click=\"$ctrl.stepFoldList[$index] = !$ctrl.stepFoldList[$index]\">\n" +
    "                            <h4 class=\"card-title\">{{'jao.flow.detail.step' | translate}} {{$index + 1}} <span\n" +
    "                                    ng-if=\"$ctrl.stepFoldList[$index]\"> : {{step.name}}</span></h4>\n" +
    "                            <button class=\"btn btn-sm btn-default pull-right\"\n" +
    "                                    ng-disabled=\"$ctrl.flow.steps.length == 1\"\n" +
    "                                    ng-click=\"$ctrl.removeStep($index)\">{{'jao.flow.detail.step.delete' | translate}}\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                        <div class=\"card-body\" ng-if=\"!$ctrl.stepFoldList[$index]\">\n" +
    "                            <div class=\"form-group op-align-horizontal\">\n" +
    "                                <label class=\"control-label\">{{'jao.flow.detail.step.name' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input type=\"text\" class=\"form-control op-w-sm\" ng-model=\"step.name\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group op-align-horizontal\">\n" +
    "                                <label class=\"control-label\">{{'jao.flow.detail.auto_next' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <!--<label class=\"i-switch pull-right\">\n" +
    "                                        <input type=\"checkbox\" ng-model=\"step.autoNext\" checked>\n" +
    "                                        <i></i>\n" +
    "                                    </label>-->\n" +
    "                                    <div class=\"checkbox checkbox-primary\">\n" +
    "                                        <input type=\"checkbox\" ng-model=\"step.autoNext\" id=\"je_secret_0\"\n" +
    "                                               class=\"ng-pristine ng-untouched ng-valid ng-empty\" aria-invalid=\"false\">\n" +
    "                                        <label for=\"je_secret_0\"></label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group op-align-horizontal\" ng-if=\"step.type == 'script'\">\n" +
    "                                <label class=\"control-label\">{{'jao.common.script' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <gfs-file-selector the-model=\"step.config.tasks[0].scripts\" class=\"w-full\"\n" +
    "                                                       model-converter=\"{type: 'attrmap', attrmap: {'location': 'path', 'argline': 'config', tag: 'tag'}, modelType: 'array'}\"\n" +
    "                                                       config=\"$ctrl.fileSelectorConfig\"></gfs-file-selector>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group op-align-horizontal\">\n" +
    "                                <label class=\"control-label\"\n" +
    "                                       op-help-info=\"{{'jao.job.script.verbose_info' | translate}}\">{{'jao.job.script.verbose' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <select ng-model=\"step.config.verbosity\" id=\"je_verbosity\" aria-label=\"选择输入\"\n" +
    "                                            class=\"form-select op-w-auto\">\n" +
    "                                        <option value=0>{{'jao.job.run.ansible.verbose.normal' | translate}}</option>\n" +
    "                                        <option class=\"\" value=1>{{'jao.job.run.ansible.verbose.detailed' | translate}}</option>\n" +
    "                                        <option class=\"\" value=2>{{'jao.job.run.ansible.verbose.more_details' | translate}}</option>\n" +
    "                                        <option class=\"\" value=3>{{'jao.job.run.ansible.verbose.debug' | translate}}</option>\n" +
    "                                        <option class=\"\" value=4>{{'jao.job.run.ansible.verbose.connection_debugging' | translate}}</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group op-align-horizontal\">\n" +
    "                                <label class=\"control-label\"\n" +
    "                                       op-help-info=\"{{'jao.job.process.timeout_info' | translate}}\">\n" +
    "                                    {{'jao.job.process.timeout' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <div class=\"input-group w-sm\">\n" +
    "                                        <input type=\"number\" ng-model=\"step.config.taskTimeout\" class=\"form-control\"\n" +
    "                                               min=\"-1\"\n" +
    "                                               step=\"1\">\n" +
    "                                        <div class=\"input-group-append\"><span\n" +
    "                                                class=\"input-group-text\">{{'common.term.second' | translate}}</span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "        <fieldset>\n" +
    "            <legend>{{'jao.job.detail.params' | translate}}<span\n" +
    "                    op-help-info=\"{{'jao.job.detail.params_info' | translate}}\"></span></legend>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"d-flex\">\n" +
    "                    <button class=\"btn btn-sm btn-default\" title=\"{{'jao.job.detail.analysis_param_info' | translate}}\"\n" +
    "                            ng-click=\"$ctrl.addParamAuto()\"><i class=\"fa fa-brackets-curly text-primary\"></i>\n" +
    "                        {{'jao.job.detail.analysis_param' | translate}}\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-sm btn-default opx-btn-icon ms-auto\"\n" +
    "                            title=\"{{'jao.job.detail.add_param' | translate}}\">\n" +
    "                        <i class=\"fa fa-plus\" ng-click=\"$ctrl.addParam()\"></i></button>\n" +
    "                </div>\n" +
    "                <table class=\"op-param-table table\" ng-if=\"$ctrl.flow.globalParams|isNotEmpty\">\n" +
    "                    <thead>\n" +
    "                    <tr>\n" +
    "                        <th>{{'jao.job.detail.params' | translate}}</th>\n" +
    "                        <th>{{'jao.job.detail.display_name' | translate}}</th>\n" +
    "                        <th>{{'common.entity.detail.description' | translate}}</th>\n" +
    "                        <th op-help-info=\"{{'jao.job.detail.default_info' | translate}}\">\n" +
    "                            {{'jao.job.detail.default' | translate}}\n" +
    "                        </th>\n" +
    "                        <th>{{'jao.common.secret' | translate}}</th>\n" +
    "                    </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                    <tr ng-repeat=\"param in $ctrl.flow.globalParams track by $index\">\n" +
    "                        <td><input class=\"form-control\" ng-model=\"param.name\" required=\"true\"></td>\n" +
    "                        <td><input class=\"form-control\" ng-model=\"param.label\"></td>\n" +
    "                        <td><input class=\"form-control\" ng-model=\"param.description\"></td>\n" +
    "                        <td><input class=\"form-control\" ng-model=\"param.defaultValue\"></td>\n" +
    "                        <td>\n" +
    "                            <div class=\"checkbox checkbox-primary\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"param.secret\" id=\"je_secret_{{$index}}\">\n" +
    "                                <label for=\"je_secret_{{$index}}\"></label>\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                        <td class=\"text-right\">\n" +
    "                            <button class=\"btn btn-sm btn-default opx-btn-icon \"\n" +
    "                                    title=\"{{'jao.job.detail.delete_param' | translate}}\"\n" +
    "                                    ng-click=\"$ctrl.deleteParam(param)\">\n" +
    "                                <i class=\"fa fa-minus\"></i>\n" +
    "                            </button>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "    </form>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/flow/flow-host-view.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">\n" +
    "        <span>{{'jao.flow.host_output' | translate}}</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "            ng-click=\"$ctrl.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>IP </p>\n" +
    "    <p>\n" +
    "        <span class=\"badge bg-secondary\">{{$ctrl.hostKey}}</span>\n" +
    "    </p>\n" +
    "    <p>{{'jao.common.output' | translate}}</p>\n" +
    "    <div class=\"opx-layout-hflex\" style=\"height: 100%; min-width: 400px;\">\n" +
    "        <div class=\"opx-flex-fill px-3\">\n" +
    "            <div class=\"opx-flex-fill scroll-y list-group\">\n" +
    "                <div ng-repeat=\"task in $ctrl.hostResult track by $index\"\n" +
    "                     class=\"list-group-item p-3\">\n" +
    "                    <h4><span class=\"badge bg-{{$ctrl.statusDefs[task.status].color}}\">{{task.status}}</span>\n" +
    "                        {{task.task}}</h4>\n" +
    "                    <pre class=\"bg-light p-3\" ng-if=\"task.output\">{{task.output}}</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--<pre class=\"cac-job-result-pre\">{{'asdfasd'}}</pre>-->\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"$ctrl.cancel()\">{{'common.entity.action.close' | translate}}</button>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/jao/flow/flow-instance-list.html","<div class=\"h-full\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'jao.flow.list' | translate}}</div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class=\"p-3\">\n" +
    "        <opx-datatable table-config=\"$ctrl.tableConfig\"></opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/jao/flow/flow-instance-view.html","<style>\n" +
    "    @keyframes rotating{\n" +
    "        from{transform:rotate(0)}\n" +
    "        to{transform:rotate(360deg)}\n" +
    "    }\n" +
    "    .icon-spining {animation:rotating 1.2s linear infinite}\n" +
    "    #host-container td {\n" +
    "        color: black;\n" +
    "    }\n" +
    "    .flow-turn{\n" +
    "        width: 100%;\n" +
    "        height: 20px;\n" +
    "        position: relative;\n" +
    "        /*left: calc(50% - 100px);*/\n" +
    "        top:  calc(50% - 10px);\n" +
    "        transform: perspective(800px) rotateX(0deg);\n" +
    "        transition: .7s;\n" +
    "        transform-style: preserve-3d;\n" +
    "    }\n" +
    "    .flow-turn:hover{\n" +
    "        transform:perspective(800px) rotateX(180deg);\n" +
    "    }\n" +
    "    .flow-turn:hover .flow-turn-front{\n" +
    "        display: none;\n" +
    "    }\n" +
    "    .flow-turn:hover .flow-turn-back{\n" +
    "        display: block;\n" +
    "    }\n" +
    "    .flow-turn-front{\n" +
    "        width: 50px;\n" +
    "        height: 100%;\n" +
    "        /*background-color:#f00;*/\n" +
    "        position: relative;\n" +
    "        display: block;\n" +
    "        left: 0;\n" +
    "        top: 0;\n" +
    "        transform: translateZ(1px);\n" +
    "    }\n" +
    "    .flow-turn-back{\n" +
    "        width: 50px;\n" +
    "        height: 100%;\n" +
    "        position: relative;\n" +
    "        display: none;\n" +
    "        top: 0;\n" +
    "        left: 0;\n" +
    "        /*background-color: #0f0;*/\n" +
    "        transform: translateZ(-1px) rotateX(180deg);\n" +
    "    }\n" +
    "</style>\n" +
    "<style type=\"text/css\">\n" +
    "    th, td, tr {\n" +
    "        border: 1px solid #cdd;\n" +
    "        height: 30px;\n" +
    "        width: 100px;\n" +
    "        text-align: center;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"opx-layout-vflex\"  uaa-has-permission=\"jao:view:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <nav class=\"navbar bg-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <!--<a ui-sref=\"app.jao.flow_list.flow_instance_list({flowId: $ctrl.flowInstance.flowId})\">{{'jao.flow.list' | translate}}</a>-->\n" +
    "                    <a ui-sref=\"app.jao.flow_list.instance_list({id: $ctrl.flowInstance.jobFlowId})\">{{'jao.flow.list' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active\">\n" +
    "                    {{$ctrl.flowInstance.name}}\n" +
    "                </li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"scroll-y opx-flex-fill p-3\">\n" +
    "        <div class=\"card mb-3\"   style=\"height: 50px\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <ul class=\"list-unstyled d-flex align-items-center\">\n" +
    "                    <li class=\"ms-3\">\n" +
    "                        <strong>{{'jao.flow.detail.step' | translate}}：</strong>{{$ctrl.flowInstance.steps.length}}\n" +
    "                    </li>\n" +
    "                    <li class=\"ms-3\">\n" +
    "                        <strong>{{'jao.flow.detail.hosts' | translate}}：</strong>{{$ctrl.flowInstance.hosts.length}}\n" +
    "                    </li>\n" +
    "                    <li class=\"ms-3\">\n" +
    "                        <strong>{{'common.entity.detail.start_at' | translate}}：</strong>{{$ctrl.flowInstance.createdAt | date:'yyyy-MM-dd HH:mm:ss'}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card card-default\">\n" +
    "            <div class=\"card-header\">\n" +
    "                <div class=\"card-title\">\n" +
    "                    {{'jao.result.name' | translate}}\n" +
    "                    <!--<button  ng-click=\"$ctrl.refreshTable()\" class=\"btn btn-default btn-sm\" style=\"margin-top:-4px;margin-bottom:4px;margin-left:5px\">-->\n" +
    "                        <!--刷新列表 <i ng-if=\"$ctrl.isRefreshing\"-->\n" +
    "                        <!--class=\"fa fa-sync {{$ctrl.refreshClass}}\"></i></button>-->\n" +
    "                    <ul class=\"text-right list-unstyled list-inline small mb-3\" style=\"margin-top: -21px;height: 10px;\">\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-info\"><i class=\"fa fa-running\"></i></span>\n" +
    "                            {{'jao.status.job.running' | translate}}\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-success\"><i class=\"fa fa-check\"></i></span>\n" +
    "                            {{'jao.status.job.completed' | translate}}\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-danger\"><i class=\"fa fa-times\"></i></span>\n" +
    "                            {{'jao.status.job.failed' | translate}}\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"btn btn-sm opx-btn-icon btn-warning\"><i class=\"fa fa-exclamation\"></i></span>\n" +
    "                            {{'jao.status.job.not_run' | translate}}\n" +
    "                        </li>\n" +
    "                        <!--<li>-->\n" +
    "                            <!--<span class=\"btn btn-sm opx-btn-icon cac-bg-grey\"><i class=\"fa fa-minus\"></i></span>-->\n" +
    "                            <!--跳过-->\n" +
    "                        <!--</li>-->\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"table-responsive\">\n" +
    "                <table id=\"host-status-table\"  style=\"z-index: 2\" class=\"table opx-table\"></table>\n" +
    "            </div>\n" +
    "            <div class=\"p-3\">\n" +
    "                <opx-datatable table-config=\"$ctrl.dataTableConfig\"></opx-datatable>\n" +
    "                <!--        <div class=\"table-responsive\">-->\n" +
    "                <!--            <table id=\"cacTemplateTable\" class=\"template-table table opx-table\"></table>-->\n" +
    "                <!--        </div>-->\n" +
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

$templateCache.put("app/modules/jao/flow/flow-list.html","<div class=\"opx-layout-hflex\" uaa-is-authenticated uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <div class=\"opx-sidebar\" style=\"width: 15rem;\">\n" +
    "        <nav class=\"navbar opx-sidebar-header opx-sidebar-header-fixed\">\n" +
    "            <op-searchbox search-text=\"$ctrl.jobFilter\" style=\"width:10rem;\" class=\"me-2\"></op-searchbox>\n" +
    "            <div class=\"dropdown ms-auto\">\n" +
    "                <button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle opx-btn-icon\"\n" +
    "                        data-bs-toggle=\"dropdown\">\n" +
    "                    <i class=\"fa fa-line-height\"></i>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu dropdown-menu-end\">\n" +
    "                    <li>\n" +
    "                        <a ng-click=\"$ctrl.changeFlowOrderBy('name')\">{{'common.entity.detail.name' | translate}}\n" +
    "                            <i style=\"float: right;padding-top: 4px\"\n" +
    "                               ng-class=\"$ctrl.orderMethod ? 'fa fa-sort-alpha-down-alt':'fa fa-sort-alpha-up'\"\n" +
    "                               ng-if=\"$ctrl.orderName == 'name'\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a ng-click=\"$ctrl.changeJobOrderBy('updatedAt')\">{{'common.entity.detail.update_at' | translate}}\n" +
    "                            <i style=\"float: right;padding-top: 4px\"\n" +
    "                               ng-class=\"$ctrl.orderMethod ? 'fa fa-sort-alpha-down-alt':'fa fa-sort-alpha-up'\"\n" +
    "                               ng-if=\"$ctrl.orderName == 'updatedAt'\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <button uaa-has-permission=\"jao:edit:*\" type=\"button\" class=\"btn btn-default btn-sm opx-btn-icon\" ng-click=\"$ctrl.createFlow()\"\n" +
    "                    title=\"{{'jao.flow.create' | translate}}\">\n" +
    "                <i class=\"fa fa-plus\"></i>\n" +
    "            </button>\n" +
    "        </nav>\n" +
    "        <div class=\"opx-sidebar-body\" uaa-has-permission=\"jao:view:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "            <div class=\"list-group list-group-flush op-styled-highlight\">\n" +
    "                <a ng-repeat=\"flow in $ctrl.flowList | filter:$ctrl.jobFilter | orderBy:[$ctrl.orderName,'createdAt']:$ctrl.orderMethod\"\n" +
    "                   ng-class=\"{'active':flow.id == $ctrl.activeFlow}\"\n" +
    "                   class=\"list-group-item list-group-item-action op-hover-trigger ng-scope\" title=\"{{flow.name}}\"\n" +
    "                   style=\"position:relative;\">\n" +
    "                    <div ui-sref=\"app.jao.flow_list.instance_list({id: flow.id})\" ng-click=\"$ctrl.changeActiveFlow(flow)\">\n" +
    "                        <h5 class=\"text-ellipsis\">{{flow.name}}</h5>\n" +
    "                        <div class=\"small text-muted\">\n" +
    "                            {{(flow.updatedAt||flow.createdAt) | date }}\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"op-hover-to-show\" style=\"position:absolute;right:0.25rem;bottom:0.25rem;\">\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"$ctrl.createInstance(flow)\"\n" +
    "                                title=\"{{'jao.flow.run' | translate}}\">\n" +
    "                            <i class=\"fa fa-play-circle\"></i></button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"$ctrl.editFlow(flow.id)\" title=\"{{'common.entity.action.edit' | translate}}\">\n" +
    "                            <i class=\"fa fa-pencil\"></i></button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"$ctrl.deleteFlow(flow.name, flow.id)\"\n" +
    "                                class=\"m-r-sm\" title=\"{{'common.entity.action.delete' | translate}}\">\n" +
    "                            <i class=\"fa fa-trash-alt\"></i></button>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill fade-in\" ui-view=\"jaoFlowDetailView\">\n" +
    "        <div class=\"h-100 bg-light op-blank-slate\">\n" +
    "            <div class=\"op-blank-slate-icon\">\n" +
    "                <i class=\"fa fa-inbox op-fa-8x\"></i>\n" +
    "            </div>\n" +
    "            <p>{{'jao.flow.view' | translate}}</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/flow/flow-step.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light bg-light\">\n" +
    "        <span class=\"navbar-brand\">{{'jao.flow.detail.step.run' | translate}}: {{$ctrl.step.name}}</span>\n" +
    "        <div class=\"ms-auto\">\n" +
    "            <span type=\"button\" class=\"btn btn-primary opx-btn-ok\"\n" +
    "                    ng-click=\"$ctrl.runStep()\" uaa-has-permission=\"jao:job-run:*\">{{'jao.flow.detail.step.run' | translate}}\n" +
    "            </span>\n" +
    "            <span type=\"button\" class=\"btn btn-default\" ng-click=\"$ctrl.cancel()\">\n" +
    "                {{'common.entity.action.cancel' | translate}}\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <form class=\"op-smartform form-vertical  op-bold-label p-5 bg-white opx-flex-fill scroll-y\" name=\"stepForm\">\n" +
    "        <fieldset>\n" +
    "            <legend>{{'jao.flow.detail.step_settings' | translate}}</legend>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'jao.common.host' | translate}}<span\n" +
    "                        op-help-info=\"{{'jao.flow.detail.step_settings_info' | translate}}\"></span></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"mt-3\">\n" +
    "                        <jao-dynamic-host-selector the-model=\"$ctrl.runHosts\" the-data=\"$ctrl.hostStatusList\"></jao-dynamic-host-selector>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"card card-default op-action-card op-w-full\">\n" +
    "                    <fieldset class=\"card-body\">\n" +
    "                        <div class=\"form-group op-align-horizontal\">\n" +
    "                            <label class=\"control-label\">{{'jao.flow.detail.auto_next' | translate}}</label>\n" +
    "                            <div class=\"form-control-wrapper\">\n" +
    "                                <div class=\"checkbox checkbox-primary\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"$ctrl.step.autoNext\" id=\"je_secret_0\" class=\"ng-pristine ng-untouched ng-valid ng-empty\" aria-invalid=\"false\">\n" +
    "                                    <label for=\"je_secret_0\"></label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group op-align-horizontal\" ng-if=\"$ctrl.step.type == 'script'\">\n" +
    "                            <label class=\"control-label\">{{'jao.common.script' | translate}}</label>\n" +
    "                            <div class=\"form-control-wrapper\">\n" +
    "                                <gfs-file-selector the-model=\"$ctrl.step.config.tasks[0].scripts\" class=\"w-full\"\n" +
    "                                                   model-converter=\"{type: 'attrmap', attrmap: {'location': 'path', 'argline': 'config'}, modelType: 'array'}\"\n" +
    "                                                   config=\"$ctrl.fileSelectorConfig\"></gfs-file-selector>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group op-align-horizontal\">\n" +
    "                            <label class=\"control-label\"\n" +
    "                                   op-help-info=\"{{'jao.job.script.verbose_info' | translate}}\">{{'jao.job.script.verbose' | translate}}</label>\n" +
    "                            <div class=\"form-control-wrapper\">\n" +
    "                                <select ng-model=\"$ctrl.step.config.verbosity\" id=\"je_verbosity\" aria-label=\"选择输入\"\n" +
    "                                        class=\"form-select op-w-auto\">\n" +
    "                                    <option value=0 >{{'jao.job.run.ansible.verbose.normal' | translate}}</option>\n" +
    "                                    <option class=\"\" value=1>{{'jao.job.run.ansible.verbose.detailed' | translate}}</option>\n" +
    "                                    <option class=\"\" value=2>{{'jao.job.run.ansible.verbose.more_details' | translate}}</option>\n" +
    "                                    <option class=\"\" value=3>{{'jao.job.run.ansible.verbose.debug' | translate}}</option>\n" +
    "                                    <option class=\"\" value=4>{{'jao.job.run.ansible.verbose.connection_debugging' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group op-align-horizontal\">\n" +
    "                            <label class=\"control-label\"\n" +
    "                                   op-help-info=\"{{'jao.job.process.timeout_info' | translate}}\">\n" +
    "                                {{'jao.job.process.timeout' | translate}}</label>\n" +
    "                            <div class=\"form-control-wrapper\">\n" +
    "                                <div class=\"input-group w-sm\">\n" +
    "                                    <input type=\"number\" ng-model=\"$ctrl.step.config.taskTimeout\" class=\"form-control\" min=\"-1\"\n" +
    "                                           step=\"1\">\n" +
    "                                    <div class=\"input-group-append\"><span class=\"input-group-text\">{{'common.term.second' | translate}}</span></div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </fieldset>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "        <fieldset>\n" +
    "            <legend>{{'jao.job.detail.params' | translate}}<span op-help-info=\"{{'jao.job.detail.params_info' | translate}}\"></span></legend>\n" +
    "            <div class=\"form-group\">\n" +
    "                <table class=\"op-param-table table\" ng-if=\"$ctrl.globalParams\">\n" +
    "                    <thead>\n" +
    "                    <tr>\n" +
    "                        <th>{{'jao.common.param' | translate}}</th>\n" +
    "                        <th>{{'jao.job.detail.display_name' | translate}}</th>\n" +
    "                        <th>{{'common.entity.detail.description' | translate}}</th>\n" +
    "                        <th op-help-info=\"{{'jao.job.detail.default_info' | translate}}\">{{'jao.job.detail.default' | translate}}</th>\n" +
    "                        <th>{{'jao.common.secret' | translate}}</th>\n" +
    "                    </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                    <tr ng-repeat=\"param in $ctrl.globalParams track by $index\">\n" +
    "                        <td><input class=\"form-control\" ng-model=\"param.name\" ng-disabled=\"true\"></td>\n" +
    "                        <td><input class=\"form-control\" ng-model=\"param.label\" ng-disabled=\"true\"></td>\n" +
    "                        <td><input class=\"form-control\" ng-model=\"param.description\" ng-disabled=\"true\"></td>\n" +
    "                        <td><input class=\"form-control\" ng-model=\"param.defaultValue\"></td>\n" +
    "                        <td>\n" +
    "                            <div class=\"checkbox checkbox-primary\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"param.secret\" id=\"je_secret_{{$index}}\">\n" +
    "                                <label for=\"je_secret_{{$index}}\"></label>\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "    </form>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/flow/host-dynamic-selector.html","<div class=\"h-full\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">{{'jao.messages.select_host' | translate}}</div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class=\"p-3\">\n" +
    "        <opx-datatable table-config=\"$ctrl.tableConfig\"></opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer text-right\">\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"$ctrl.confirm()\">{{'common.entity.action.confirm' | translate}}</button>\n" +
    "    <button type=\"reset\" class=\"btn btn-default\" ng-click=\"$ctrl.cancel()\">{{'common.entity.action.cancel' | translate}}</button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/jao/flow/host-selector.html","<div ng-if=\"$ctrl.theHosts.length>0\">\n" +
    "    <div class=\"d-flex flex-nowrap align-items-center\">\n" +
    "        <div class=\"btn btn-sm btn-default d-inline-block op-hover-trigger\" style=\"position:relative;width:10em;\">\n" +
    "            <span class=\"op-hover-to-show pull-right\" ng-click=\"$ctrl.clearAll()\" title=\"{{'jao.flow.detail.remove_all' | translate}}\"><i\n" +
    "                class=\"fa fa-times\"></i></span>\n" +
    "            <span class=\"d-block\"\n" +
    "                  ng-click=\"$ctrl.openSelectorDialog()\">{{ 'acm.common.selector.total' | translate}}<strong>{{$ctrl.theHosts.length}}</strong>{{ 'acm.common.selector.item' | translate}}</span>\n" +
    "        </div>\n" +
    "        <!--        <div class=\"btn-group\">-->\n" +
    "        <!--            <button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"$ctrl.openSelectorDialog()\">共<strong>{{$ctrl.theHosts.length}}</strong>项-->\n" +
    "        <!--            </button>-->\n" +
    "        <!--            <button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"$ctrl.clearAll()\" title=\"移除所有\"><i-->\n" +
    "        <!--                    class=\"fa fa-times\"></i></button>-->\n" +
    "        <!--        </div>-->\n" +
    "<!--        <op-searchbox search-text=\"$ctrl.filter\" class=\"ms-auto autohide\"></op-searchbox>-->\n" +
    "    </div>\n" +
    "    <ul class=\"list list-unstyled list-inline\" style=\"max-height:10rem; overflow-y:auto;\">\n" +
    "        <li ng-repeat=\"host in $ctrl.theHosts | filter: $ctrl.filter track by $index\"\n" +
    "            class=\"op-hover-trigger mb-3\">\n" +
    "            <div class=\"badge bg-secondary op-text-normal op-cursor-default py-2 px-2\">{{$ctrl.options.useString ? host : host.host}}\n" +
    "                <a ng-click=\"$ctrl.removeItem($index)\" >&times;</a>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.theHosts.length === 0\" class=\"op-blank-slate bg-light p-3\">\n" +
    "    <div class=\"op-blank-slate-icon\"><i class=\"fal fa-server\" style=\"font-size:4rem;\"></i></div>\n" +
    "    <div>\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"$ctrl.openSelectorDialog()\">{{'jao.messages.select_host' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/helper/aap-template-selector.html","<div class=\"d-flex flex-column\">\n" +
    "    <div class=\"mb-2\">\n" +
    "        <button type=\"button\" class=\"btn btn-outline-default\" ng-click=\"$ctrl.openSelectorDialog()\"><i class=\"fal fa-server\"\n" +
    "                ng-disabled=\"$ctrl.readonly\"></i> {{$ctrl.theOptions.thisLabel || ''}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"$ctrl.getData()\">\n" +
    "        <ul class=\"list list-unstyled list-inline mb-0\" style=\"max-height:10rem; overflow-y:auto;\">\n" +
    "            <li class=\"op-hover-trigger\">\n" +
    "                <div class=\"badge bg-secondary op-text-normal op-cursor-default py-2 px-2\">\n" +
    "                    {{ $ctrl.getData().name }}\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"help-block w-100 mt-4\" ng-if=\"$ctrl.theData\">\n" +
    "        <div class=\"\"> {{ \"jao.job.script.aap_template.notice\" | translate }}: </summary>\n" +
    "        <ul class=\"pl-3\">\n" +
    "            <li class=\"list-unstyled\">{{ \"jao.job.script.aap_template.notice.0\" | translate }}</li>\n" +
    "            <li class=\"list-unstyled\">{{ \"jao.job.script.aap_template.notice.1\" | translate }}</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group w-25 mt-4\" style=\"min-width: 300px;\" ng-if=\"false\">\n" +
    "        <label class=\"control-label w-100\">{{ 'jao.job.run.ansible-playbook' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <textarea class=\"form-control\" ng-model=\"$ctrl.theData.argline\"></textarea>\n" +
    "\n" +
    "            <details class=\"help-block\">\n" +
    "                <summary>{{'jao.job.script.param' | translate}}</summary>\n" +
    "                {{'jao.job.script.param_info.0' | translate}}\n" +
    "                <div>\n" +
    "                    {{'jao.job.script.param_info.1' | translate}}\n" +
    "                    <ul>\n" +
    "                        <li>{{'jao.job.script.param_info.2' | translate}}</li>\n" +
    "                        <li>{{'jao.job.script.param_info.3' | translate}}</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </details>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/helper/job-selector.html","<div class=\"form-group\">\n" +
    "    <label class=\"control-label\">{{'jao.job.select' | translate}}</label>\n" +
    "    <div class=\"form-control-wrapper\">\n" +
    "        <div class=\"input-group\">\n" +
    "            <!--            <select chosen=\"{width:'calc(100% - 2rem)'}\" class=\"form-select\" ng-model=\"$ctrl.theModel\"-->\n" +
    "            <!--                    ng-options=\"job.id as job.title for job in $ctrl.jobs\">-->\n" +
    "            <!--                <option value=\"\"></option>-->\n" +
    "            <!--            </select>-->\n" +
    "            <select op-select style=\"width:0\" class=\"form-select flex-fill\" ng-model=\"$ctrl.theModelFake\"\n" +
    "                    ng-disabled=\"$ctrl.disabled\"\n" +
    "                    ng-options=\"job.id as job.title for job in $ctrl.jobs\">\n" +
    "            </select>\n" +
    "            <div class=\"input-group-append\">\n" +
    "                <button type=\"button\" ng-if=\"$ctrl.showEdit\"\n" +
    "                        class=\"btn btn-outline-default opx-btn-icon no-animate\" title=\"{{'jao.job.edit_job_def' | translate}} {{$ctrl.theModelFake}}\" ng-click=\"$ctrl.editJobDef()\">\n" +
    "                    <i class=\"fa fa-pencil\"></i>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--        <span class=\"badge bg-secondary\" ng-if=\"$ctrl.selectedJob.id\">{{$ctrl.selectedJob.id}}</span>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/jao/jao-index.html","<div class=\"opx-layout-hflex\" uaa-is-authenticated uaa-deny-message=\"{{'common.uaa.no_permission_desc' | translate}}\">\n" +
    "    <div class=\"opx-sidebar bg-light\">\n" +
    "        <!--        <nav class=\"navbar opx-sidebar-header opx-sidebar-header-fixed\">-->\n" +
    "        <!--            <span class=\"opx-navbar-title\">{{'jao.index.do_job' | translate}}</span>-->\n" +
    "        <!--        </nav>-->\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <div class=\"opx-treenav\">\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.jao.job_list_v2({type:'script'})\" ui-sref-active=\"active\"><i\n" +
    "                            class=\"fad fa-laptop-code fa-fw\"></i> {{'jao.index.list' | translate}}</a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.jao.flow_list\" ui-sref-active=\"active\"><i\n" +
    "                            class=\"fad fa-water fa-fw\"></i> {{'jao.index.schedule' | translate}}</a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.jao.myApprove\" ui-sref-active=\"active\"><i class=\"fad fa-hand-paper fa-fw\"></i>\n" +
    "                        {{'jao.index.my_approve' | translate}}</a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.jao.jobApprove\" ui-sref-active=\"active\"><i class=\"fad fa-clipboard-check fa-fw\"></i>\n" +
    "                        {{'jao.index.approve' | translate}}</a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.jao.runlogs\" ui-sref-active=\"active\"><i class=\"fad fa-history fa-fw\"></i>\n" +
    "                        {{'jao.index.run_logs' | translate}}</a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.jao.stats\" ui-sref-active=\"active\"><i class=\"fad fa-analytics fa-fw\"></i>\n" +
    "                        {{'jao.index.stats' | translate}}</a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.jao.cron_job\" ui-sref-active=\"active\"><i class=\"fad fa-calendar-alt fa-fw\"></i>\n" +
    "                        {{'jao.index.cron' | translate}}</a>\n" +
    "                </div>\n" +
    "                <!-- <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.jao.data_model\" ui-sref-active=\"active\"><i class=\"fad fa-bring-front fa-fw\"></i>\n" +
    "                        {{'jao.index.data_model' | translate}}</a>\n" +
    "                </div> -->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill fade-in\" ui-view=\"jaoMainView\">\n" +
    "        <div class=\"opx-align-center\">\n" +
    "            <div class=\"rounded-circle bg-secondary opx-align-center\"\n" +
    "                 style=\"width:10rem;height:10rem;opacity: .5;\"><i\n" +
    "                    class=\"text-light fad fa-fw fa-7x fa-oplus-jao\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/job-edit.html","<div class=\"opx-layout-vflex\" uaa-has-permission=\"{{$ctrl.pagePermission}}\"\n" +
    "     uaa-deny-message=\"{{'jao.job_edit' | translate}}\"\n" +
    "     ng-class=\"{'opx-readonly':!$ctrl.isEditMode}\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\">\n" +
    "                    <a ui-sref=\"app.appman.job\">{{'jao.index.list' | translate}}</a>\n" +
    "                </li>\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">{{'jao.job.edit' | translate}}</li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div class=\"ms-auto\">\n" +
    "            <div class=\"dropdown\" ng-if=\"$ctrl.job.id\">\n" +
    "                <a class=\"btn btn-default opx-btn-icon opx-btn-flat\" title=\"{{'jao.job.history' | translate}}\"\n" +
    "                   ng-click=\"$ctrl.listRunLogs()\"\n" +
    "                   data-bs-toggle=\"dropdown\"><i class=\"fa fa-list-alt\"></i></a>\n" +
    "                <div class=\"dropdown-menu\">\n" +
    "                    <div class=\"dropdown-header\">{{'jao.job.recent_10_history' | translate}}</div>\n" +
    "                    <a class=\"dropdown-item\" ng-repeat=\"log in $ctrl.runLogs | limitTo: 10\" href=\"\"\n" +
    "                       ng-click=\"$ctrl.viewRunResult(log.id)\">{{log.startTime\n" +
    "                    | fromNow }} <span\n" +
    "                            class=\"text-muted\">{{log.username}}</span></a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <button ng-if=\"$ctrl.isEditMode\"\n" +
    "                    type=\"button\" class=\"btn btn-danger opx-btn-icon opx-btn-flat\"\n" +
    "                    ng-click=\"$ctrl.deleteJob()\" uaa-has-permission=\"jao:edit:*\"\n" +
    "                    title=\"{{'jao.job.delete' | translate}}\"><i\n" +
    "                    class=\"fa fa-trash-alt\"></i>\n" +
    "            </button>\n" +
    "            <button ng-if=\"$ctrl.isEditMode\"\n" +
    "                    type=\"button\" class=\"btn btn-primary opx-btn-ok\"\n" +
    "                    ng-click=\"$ctrl.save()\"\n" +
    "                    ng-disabled=\"jobForm.$invalid\" uaa-has-permission=\"jao:edit:*\"> {{'jao.job.save' | translate}}\n" +
    "            </button>\n" +
    "            <button ng-if=\"$ctrl.isEditMode\"\n" +
    "                    type=\"button\" class=\"btn btn-default opx-btn-cancel\"\n" +
    "                    ng-click=\"$ctrl.cancel()\">{{'common.entity.action.back' | translate}}\n" +
    "            </button>\n" +
    "            <a ng-if=\"!$ctrl.isEditMode\"\n" +
    "               type=\"button\" class=\"btn btn-outline-primary\"\n" +
    "               ui-sref=\"app.appman.job.edit({id:$ctrl.job.id})\" uaa-has-permission=\"jao:edit:*\"><i\n" +
    "                    class=\"fa fa-fw fa-pencil\"></i> {{'jao.job.edit' | translate}}\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"bg-white opx-flex-fill scroll-y p-3\">\n" +
    "        <form class=\"op-smartform form-vertical op-bold-label\" name=\"jobForm\"\n" +
    "              op-sectioned-form\n" +
    "              id=\"js-job-edit-{{$ctrl.job.id||'new'}}\">\n" +
    "            <fieldset ng-disabled=\"!$ctrl.isEditMode\">\n" +
    "                <legend>{{'jao.job.detail.base' | translate}}</legend>\n" +
    "                <!--                <div class=\"form-group\">-->\n" +
    "                <!--                    <label class=\"control-label\">Code</label>-->\n" +
    "                <!--                    <div class=\"form-control-wrapper\">-->\n" +
    "                <!--                        <input type=\"text\" class=\"form-control\" ng-change=\"$ctrl.checkCode()\"-->\n" +
    "                <!--                             ng-model=\"$ctrl.job.code\">-->\n" +
    "                <!--                        <p class=\"help-block\">标记作业的唯一代码，字母开头，只允许数字、小写字母、下划线、连线</p>-->\n" +
    "                <!--                    </div>-->\n" +
    "                <!--                </div>-->\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">{{'common.entity.detail.title' | translate}} <span\n" +
    "                            class=\"cac-text-required\">*</span></label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <input class=\"form-control\" ng-model=\"$ctrl.job.title\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">{{'common.entity.detail.description' | translate}}</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <textarea class=\"form-control\" ng-model=\"$ctrl.job.description\" rows=\"3\"></textarea>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "            <!-- Type specific config begin -->\n" +
    "            <jao-script-job-config ng-if=\"$ctrl.job.type=='script'\"\n" +
    "                                   the-model=\"$ctrl.jobConfig\"\n" +
    "                                   edit-mode=\"$ctrl.isEditMode\"\n" +
    "                                   config-interceptor=\"$ctrl.jobConfigInterceptor\"></jao-script-job-config>\n" +
    "            <jao-rest-job-config ng-if=\"$ctrl.job.type=='rest'\"\n" +
    "                                 the-model=\"$ctrl.jobConfig\"\n" +
    "                                 edit-mode=\"$ctrl.isEditMode\"\n" +
    "                                 config-interceptor=\"$ctrl.jobConfigInterceptor\"></jao-rest-job-config>\n" +
    "            <jao-command-job-config ng-if=\"$ctrl.job.type=='command'\"\n" +
    "                                    the-model=\"$ctrl.jobConfig\"\n" +
    "                                    edit-mode=\"$ctrl.isEditMode\"></jao-command-job-config>\n" +
    "            <jao-process-job-config ng-if=\"$ctrl.job.type==='process'\"\n" +
    "                                    the-model=\"$ctrl.jobConfig\"\n" +
    "                                    edit-mode=\"$ctrl.isEditMode\"\n" +
    "                                    config-interceptor=\"$ctrl.jobConfigInterceptor\"></jao-process-job-config>\n" +
    "            <!-- Type specific config end -->\n" +
    "            <fieldset ng-disabled=\"!$ctrl.isEditMode\" ng-if=\"$ctrl.job.type!='command'\">\n" +
    "                <legend>{{'jao.job.detail.params' | translate}}<span\n" +
    "                        op-help-info=\"{{'jao.job.detail.params_info' | translate}}\"></span></legend>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"d-flex\">\n" +
    "                        <button class=\"btn btn-outline-primary\"\n" +
    "                                title=\"{{'jao.job.detail.analysis_param_info' | translate}}\"\n" +
    "                                ng-click=\"$ctrl.addParamAuto()\"><i class=\"fa fa-brackets-curly\"></i>\n" +
    "                            {{'jao.job.detail.analysis_param' | translate}}\n" +
    "                        </button>\n" +
    "                        <button class=\"btn btn-sm btn-default opx-btn-icon ms-auto me-3\"\n" +
    "                                title=\"{{'jao.job.detail.add_param' | translate}}\"\n" +
    "                                ng-if=\"$ctrl.isEditMode\">\n" +
    "                            <i class=\"fa fa-plus\" ng-click=\"$ctrl.addParam()\"></i></button>\n" +
    "                    </div>\n" +
    "                    <table class=\"op-param-table table\" ng-if=\"$ctrl.job.params|isNotEmpty\">\n" +
    "                        <thead>\n" +
    "                        <tr>\n" +
    "                            <th>{{'jao.common.param' | translate}}</th>\n" +
    "                            <th>{{'jao.job.detail.display_name' | translate}}</th>\n" +
    "                            <th>{{'common.entity.detail.description' | translate}}</th>\n" +
    "                            <th op-help-info=\"{{'jao.job.detail.default_info' | translate}}\">\n" +
    "                                {{'jao.job.detail.default' | translate}}\n" +
    "                            </th>\n" +
    "                            <th>{{'common.entity.detail.type' | translate}}</th>\n" +
    "                            <th>{{'jao.common.secret' | translate}}</th>\n" +
    "                            <th class=\"text-right\" ng-if=\"$ctrl.isEditMode\">\n" +
    "                                <!--                            <button class=\"btn btn-sm btn-default opx-btn-icon \" title=\"添加参数\"-->\n" +
    "                                <!--                                    ng-if=\"$ctrl.isEditMode\">-->\n" +
    "                                <!--                                <i class=\"fa fa-plus\" ng-click=\"$ctrl.addParam()\"></i></button>-->\n" +
    "                            </th>\n" +
    "                        </tr>\n" +
    "                        </thead>\n" +
    "                        <tbody>\n" +
    "                        <tr ng-repeat=\"param in $ctrl.job.params track by $index\">\n" +
    "                            <td><input class=\"form-control\" ng-model=\"param.name\" required=\"true\"></td>\n" +
    "                            <td><input class=\"form-control\" ng-model=\"param.label\"></td>\n" +
    "                            <td><input class=\"form-control\" ng-model=\"param.description\"></td>\n" +
    "                            <td><input class=\"form-control\" ng-model=\"param.defaultValue\"></td>\n" +
    "                            <td>\n" +
    "                                <select class=\"form-select\" ng-model=\"param.type\"\n" +
    "                                        ng-options=\"def.type as def.title for def in $ctrl.paramTypeList\">\n" +
    "                                </select>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                                <div class=\"checkbox checkbox-primary\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"param.secret\" id=\"je_secret_{{$index}}\">\n" +
    "                                    <label for=\"je_secret_{{$index}}\"></label>\n" +
    "                                </div>\n" +
    "                            </td>\n" +
    "                            <td class=\"text-right\" ng-if=\"$ctrl.isEditMode\">\n" +
    "                                <button class=\"btn btn-sm btn-default opx-btn-icon \"\n" +
    "                                        title=\"{{'jao.job.delete_param' | translate}}\"\n" +
    "                                        ng-click=\"$ctrl.deleteParam(param)\">\n" +
    "                                    <i class=\"fa fa-minus\"></i>\n" +
    "                                </button>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "            <fieldset>\n" +
    "                <legend>{{'jao.job.detail.audit_and_log' | translate}}</legend>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">{{'jao.job.detail.approve_and_review' | translate}}</label>\n" +
    "                    <div class=\"form-control-wrapper op-combo\">\n" +
    "                        <div class=\"checkbox checkbox-secondary\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"$ctrl.job.needApprove\" id=\"je_needApprove\"\n" +
    "                                   ng-disabled=\"!$ctrl.isEditMode || $ctrl.job.needReview\">\n" +
    "                            <label for=\"je_needApprove\"\n" +
    "                                   op-help-info=\"{{'jao.job.detail.approve_info' | translate}}\">{{'jao.job.detail.approve' | translate}}</label>\n" +
    "                        </div>\n" +
    "                        <div class=\"checkbox checkbox-secondary\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"$ctrl.job.needReview\" id=\"je_needReview\"\n" +
    "                                   ng-disabled=\"!$ctrl.isEditMode || $ctrl.job.needApprove\">\n" +
    "                            <label for=\"je_needReview\"\n" +
    "                                   op-help-info=\"{{'jao.job.detail.review_info' | translate}}\">{{'jao.job.detail.review' | translate}}</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"$ctrl.job.type!='command'\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">{{'jao.job.detail.log' | translate}}</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <div class=\"checkbox checkbox-secondary\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"$ctrl.jobConfig.audit.enabled\" id=\"je_auditenabled\"\n" +
    "                                       ng-disabled=\"!$ctrl.isEditMode\">\n" +
    "                                <label for=\"je_auditenabled\"\n" +
    "                                       op-help-info=\"{{'jao.job.detail.log_info' | translate}}\">{{'jao.job.detail.enable_log' | translate}}</label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"op-form-subgroup d-flex\" ng-if=\"$ctrl.jobConfig.audit.enabled\">\n" +
    "                            <div class=\"form-control-wrapper op-combo\">\n" +
    "                                <label class=\"control-label\"\n" +
    "                                       op-help-info=\"{{'jao.job.detail.module_info' | translate}}\">{{'jao.job.detail.module' | translate}}</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.jobConfig.audit.module\"\n" +
    "                                       maxlength=\"50\">\n" +
    "                                <label class=\"control-label\"\n" +
    "                                       op-help-info=\"{{'jao.job.detail.action_info' | translate}}\">{{'jao.job.detail.action' | translate}}</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.jobConfig.audit.action\"\n" +
    "                                       maxlength=\"100\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">{{'jao.job.detail.delayed' | translate}}</label>\n" +
    "                    <div class=\"form-control-wrapper op-combo\">\n" +
    "                        <div class=\"checkbox checkbox-secondary\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"$ctrl.job.needDelayed\" id=\"je_needDelayed\"\n" +
    "                                   ng-disabled=\"!$ctrl.isEditMode\">\n" +
    "                            <label for=\"je_needDelayed\"\n" +
    "                                   op-help-info=\"{{'jao.job.detail.delayed_info' | translate}}\">{{'jao.job.detail.need_delayed' | translate}}</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "            <fieldset ng-if=\"$ctrl.isEditMode\" uaa-has-permission=\"jao:edit\">\n" +
    "                <legend>{{'jao.job.detail.test' | translate}}</legend>\n" +
    "                <div class=\"d-flex mb-3 align-items-center justify-content-start\">\n" +
    "                    <div ng-if=\"$ctrl.jobStatus\">\n" +
    "                        <button class=\"btn btn-default rounded-pill jao-jobrun-status-btn status-{{$ctrl.jobStatus.name}} ani-outlined\"\n" +
    "                                ng-click=\"$ctrl.viewRunResult($ctrl.runId)\"\n" +
    "                                style=\"width:8rem; font-size:1rem;\">\n" +
    "                            <i class=\"fa fa-fw text-{{$ctrl.jobStatus.color}}\" ng-class=\"$ctrl.jobStatus.icon\"></i>\n" +
    "                            <span>{{$ctrl.jobStatus.title}}</span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                    <div class=\"ms-auto\">\n" +
    "                        <button class=\"btn btn-outline-primary\" ng-click=\"$ctrl.runJob()\" style=\"width:10rem;\"\n" +
    "                                ng-disabled=\"$ctrl.jobInRunning\" uaa-has-permission=\"jao:run:*\">\n" +
    "                            <i class=\"fa fa-fw fa-chevron-right\"></i>\n" +
    "                            {{'jao.job.detail.run_test' | translate}}\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                    <!--                <i class=\"fa fa-spinner fa-pulse text-primary\"></i>-->\n" +
    "                    <!--                <i class=\"fa fa-check-circle text-success\"></i>-->\n" +
    "                    <!--                <i class=\"fa fa-exclamation-triangle text-danger\"></i>-->\n" +
    "                    <!--                <div class=\"ms-auto\" ng-if=\"$ctrl.job.type=='script' && $ctrl.runResult.runId\">-->\n" +
    "                    <!--                    <button type=\"button\" class=\"btn btn-default\"-->\n" +
    "                    <!--                            ng-click=\"$ctrl.viewRunResult($ctrl.runResult.runId)\">-->\n" +
    "                    <!--                        &lt;!&ndash;                        <span class=\"jao-jobrun {{$ctrl.jobStatus}}\"></span>&ndash;&gt;-->\n" +
    "                    <!--                        <i ng-class=\"$ctrl.jobStatus.css\"></i>-->\n" +
    "                    <!--                        {{$ctrl.jobStatus.title}}-->\n" +
    "                    <!--                    </button>-->\n" +
    "                    <!--                </div>-->\n" +
    "                </div>\n" +
    "                <div class=\"overflow-auto w-100 mt-3 mb-3 p-3 bg-secondary text-light code text-break\"\n" +
    "                     ng-if=\"$ctrl.runResult|isNotEmpty\"\n" +
    "                     style=\"white-space: pre-wrap;max-height: 20rem; overflow:auto;\">{{$ctrl.runResult | json}}\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "            <!--            <fieldset ng-if=\"$ctrl.job.id && $ctrl.job.type!='command'\">-->\n" +
    "            <!--                <legend>API</legend>-->\n" +
    "            <!--                <div class=\"form-group d-flex\">-->\n" +
    "            <!--                    <div class=\"me-5\">-->\n" +
    "            <!--                        <i class=\"fa fa-directions fa-3x text-muted\"></i>-->\n" +
    "            <!--                    </div>-->\n" +
    "            <!--                    <div class=\"flex-fill\">-->\n" +
    "            <!--                        执行作业API-->\n" +
    "            <!--                        <pre class=\"p-2 bg-light w-100\" style=\"white-space: pre-wrap; \">{{$ctrl.apiCurl}}</pre>-->\n" +
    "            <!--                    </div>-->\n" +
    "            <!--                </div>-->\n" +
    "            <!--            </fieldset>-->\n" +
    "            <!--            <div class=\"mt-5\">-->\n" +
    "            <!--                <button ng-if=\"$ctrl.isEditMode\"-->\n" +
    "            <!--                        type=\"button\" class=\"btn btn-outline-danger\"-->\n" +
    "            <!--                        ng-click=\"$ctrl.deleteJob()\" uaa-has-permission=\"jao:edit:*\"><i class=\"fa fa-trash-alt\"></i>-->\n" +
    "            <!--                    删除此作业-->\n" +
    "            <!--                </button>-->\n" +
    "            <!--            </div>-->\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/job-list-v1.html","<div class=\"opx-layout-hflex\" uaa-is-authenticated uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <div class=\"opx-sidebar\" style=\"width: 15rem;\">\n" +
    "        <nav class=\"navbar opx-sidebar-header opx-sidebar-header-fixed border-bottom\">\n" +
    "<!--            <div class=\"dropdown\">-->\n" +
    "<!--                <button class=\"btn btn-secondary dropdown-toggle\" data-bs-toggle=\"dropdown\">-->\n" +
    "<!--                    {{$ctrl.typeList[$ctrl.selectedType].title}}-->\n" +
    "<!--                    <i class=\"fa fa-angle-down fa-fw\"></i></button>-->\n" +
    "<!--                <ul class=\"dropdown-menu\">-->\n" +
    "<!--                    <li ng-repeat=\"(type,def) in $ctrl.typeList\">-->\n" +
    "<!--                        <a href=\"\" ng-click=\"$ctrl.selectedType=type\"><i class=\"fa fa-fw {{def.icon}}\"></i>-->\n" +
    "<!--                            {{def.title}}</a>-->\n" +
    "<!--                    </li>-->\n" +
    "<!--                </ul>-->\n" +
    "<!--            </div>-->\n" +
    "            <!--            <input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.jobFilter\">-->\n" +
    "            <op-searchbox search-text=\"$ctrl.jobFilter\" style=\"width:10rem;\" class=\"me-2\"></op-searchbox>\n" +
    "            <div class=\"dropdown ms-auto\">\n" +
    "                <button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle opx-btn-icon\"\n" +
    "                        data-bs-toggle=\"dropdown\">\n" +
    "                    <i class=\"fa fa-line-height\"></i>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu dropdown-menu-end\">\n" +
    "                    <li>\n" +
    "                        <a ng-click=\"$ctrl.changeJobOrderBy('title')\">{{'common.entity.detail.name' | translate}}\n" +
    "                            <i style=\"float: right;padding-top: 4px\"\n" +
    "                               ng-class=\"$ctrl.orderMethod ? 'fa fa-sort-alpha-down-alt':'fa fa-sort-alpha-up'\"\n" +
    "                               ng-if=\"$ctrl.orderName == 'title'\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a ng-click=\"$ctrl.changeJobOrderBy('updatedAt')\">{{'common.entity.detail.update_at' | translate}}\n" +
    "                            <i style=\"float: right;padding-top: 4px\"\n" +
    "                                  ng-class=\"$ctrl.orderMethod ? 'fa fa-sort-alpha-down-alt':'fa fa-sort-alpha-up'\"\n" +
    "                                  ng-if=\"$ctrl.orderName == 'updatedAt'\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-sm opx-btn-icon\" ng-click=\"$ctrl.createJob()\" title=\"{{'jao.job.create' | translate}}\"\n" +
    "                    uaa-has-permission=\"jao:edit:*\">\n" +
    "                <i class=\"fa fa-plus\"></i>\n" +
    "            </button>\n" +
    "        </nav>\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <div class=\"list-group list-group-flush op-styled-highlight\">\n" +
    "                <a ng-repeat=\"job in $ctrl.jobTypeList | filter:$ctrl.jobFilter | orderBy:[$ctrl.orderName,'createdAt']:$ctrl.orderMethod\"\n" +
    "                   ui-sref=\"{{$ctrl.viewUrl}}\"\n" +
    "                   ng-click=\"$ctrl.changeActiveJob(job)\"\n" +
    "                   ng-class=\"{'active':job.id == $ctrl.activeJob}\"\n" +
    "                   class=\"list-group-item list-group-item-action\" title=\"{{job.title}}\"\n" +
    "                   style=\"position:relative;\">\n" +
    "                    <h5 class=\"text-ellipsis\">{{job.title}}</h5>\n" +
    "                    <div class=\"small text-muted\">{{(job.updatedAt||job.createdAt) | date }}\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill fade-in\" ui-view=\"jaoJobDetailView\">\n" +
    "        <div class=\"h-100 bg-light op-blank-slate\">\n" +
    "            <div class=\"op-blank-slate-icon\">\n" +
    "                <i class=\"fa fa-inbox op-fa-8x\"></i>\n" +
    "            </div>\n" +
    "            <p>{{'jao.job.detail_view' | translate}}</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/job-list.component.html","<div class=\"opx-layout-hflex\">\n" +
    "    <div class=\"opx-sidebar border-right bg-light\" style=\"width:12rem;\" ng-if=\"$ctrl.showNavigation\">\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <applet-selector applet-code=\"$ctrl.appletCode\" on-change=\"$ctrl.onAppletSelectorChange\"\n" +
    "                             options=\"{viewAs:'list', showAll:true, includeAllAndNull:true, showFilter:true}\">\n" +
    "            </applet-selector>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill scroll-y\" uaa-is-authenticated\n" +
    "         uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "        <nav class=\"navbar navbar-light\" ng-if=\"$ctrl.showApplet\">\n" +
    "            <div class=\"navbar-nav\">\n" +
    "                <ol class=\"breadcrumb\">\n" +
    "                    <li class=\"breadcrumb-item active opx-navbar-title\">{{'jao.index.list' | translate}}</li>\n" +
    "                </ol>\n" +
    "            </div>\n" +
    "            <div uaa-has-permission=\"jao:edit:*\" class=\"dropdown ms-auto\">\n" +
    "                <a class=\"btn btn-primary opx-btn-flat dropdown-toggle\" title=\"{{'jao.job.create' | translate}}\"\n" +
    "                   data-bs-toggle=\"dropdown\"\n" +
    "                   href=\"javascript:void(0);\"><i\n" +
    "                        class=\"fa fa-plus\"></i> {{'jao.job.create' | translate}}</a>\n" +
    "                <div class=\"dropdown-menu\">\n" +
    "                    <a class=\"dropdown-item\" ng-repeat=\"(type,def) in $ctrl.jobTypeList\"\n" +
    "                       ui-sref=\"app.appman.job.create({type:type,appletCode:$ctrl.appletCode})\"><i\n" +
    "                            class=\"fa fa-fw {{def.icon}}\"></i> {{def.title}}</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <button uaa-has-permission=\"jao:edit:*\" ng-click=\"$ctrl.deleteJob()\"\n" +
    "                    class=\"btn btn-default opx-btn-flat ms-2\"\n" +
    "                    title=\"{{'common.entity.action.delete' | translate}}\"\n" +
    "                    ng-disabled=\"!$ctrl.tableConfig.selectedItems.length>0\"><i class=\"fa fa-trash\"></i></button>\n" +
    "        </nav>\n" +
    "\n" +
    "        <applet-selector\n" +
    "                style=\"margin-top: 10px;display: flex;text-align: center;justify-content: flex-end;flex-grow: 0;\"\n" +
    "                applet-code=\"$ctrl.appletCode\" on-change=\"$ctrl.onAppletSelectorChange\"\n" +
    "                options=\"{ includeAllAndNull:true}\"\n" +
    "                class=\"op-w-full col\"\n" +
    "                ng-if=\"false\"></applet-selector>\n" +
    "\n" +
    "        <div class=\"opx-flex-fill p-3\">\n" +
    "            <opx-datatable table-config=\"$ctrl.tableConfig\">\n" +
    "                <button ng-if=\"$ctrl.showNavigation\" type=\"button\" class=\"btn btn-secondary\"\n" +
    "                        ng-disabled=\"$ctrl.tableConfig.selectedItems.length<1\"\n" +
    "                        ng-click=\"$ctrl.moveJobs()\"><i class=\"fa fa-sign-in\"></i>\n" +
    "                    {{'jao.page.action.move_job' | translate}}\n" +
    "                </button>\n" +
    "            </opx-datatable>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/job-list.html","<job-list show-applet=\"true\" show-navigation=\"true\"></job-list>\n" +
    "")

$templateCache.put("app/modules/jao/job-quick-run.html","<div id=\"js-job-quick-run\">\n" +
    "    <div class=\"op-smartform form-vertical op-bold-label\" id=\"ajs-param-list\">\n" +
    "        <udp-input ng-repeat=\"param in $ctrl.params track by $index\" type=\"string\"\n" +
    "                   label=\"{{param.label||param.name}}\" showlabel=\"true\"\n" +
    "                   desc=\"{{param.description}}\" showdesc=\"true\" ng-model=\"param.defaultValue\"\n" +
    "                   control=\"input\" ng-readonly=\"$ctrl.runType === 'approveLimitParams'\"></udp-input>\n" +
    "    </div>\n" +
    "    <div class=\"d-flex align-items-center\">\n" +
    "        <div class=\"pull-left\" ng-if=\"$ctrl.jobStatus\">\n" +
    "            <button class=\"btn btn-default rounded-pill jao-jobrun-status-btn status-{{$ctrl.jobStatus.name}} ani-outlined\"\n" +
    "                    ng-click=\"$ctrl.viewRunResult($ctrl.runId)\">\n" +
    "                <i class=\"fa fa-fw text-{{$ctrl.jobStatus.color}}\" ng-class=\"$ctrl.jobStatus.icon\"></i>\n" +
    "                <span>{{$ctrl.jobStatus.title}}</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"ms-auto\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"$ctrl.runJobJao()\" ng-disabled=\"$ctrl.jobInRunningState\"\n" +
    "                    uaa-has-permission=\"jao:run:*\">\n" +
    "                <i class=\"fa fa-fw fa-chevron-right\"></i>\n" +
    "                {{'jao.job.run' | translate}}\n" +
    "            </button>\n" +
    "\n" +
    "                <button class=\"btn btn-secondary\" type=\"button\" ng-click=\"$ctrl.dismiss()\">{{'common.entity.action.cancel' | translate}}</button>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/job-result-modal.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{'jao.result.name' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\"\n" +
    "            ng-click=\"$ctrl.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <jao-job-result-view run-id=\"$ctrl.runId\"></jao-job-result-view>\n" +
    "</div>\n" +
    "<div class=\"modal-footer text-right\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" ng-click=\"$ctrl.cancel()\">{{'common.entity.action.close' | translate}}</button>\n" +
    "</div>")

$templateCache.put("app/modules/jao/job-result-view.html","<div ng-if=\"$ctrl.error\">\n" +
    "    <div class=\"alert alert-danger\">{{$ctrl.error}}</div>\n" +
    "</div>\n" +
    "<div class=\"h-100\" ng-if=\"!$ctrl.error\">\n" +
    "    <div class=\"position-absolute mt-3\" style=\"right:0;\"\n" +
    "         ng-if=\"$ctrl.autoRefreshEnabled\">\n" +
    "        <button ng-click=\"$ctrl.toggleAutoRefresh()\" class=\"btn\"\n" +
    "                ng-class=\"$ctrl.autoRefresh?'btn-secondary':'btn-default'\"\n" +
    "                title=\"{{'common.entity.action.refresh' | translate}}\"><i\n" +
    "                class=\"far fa-sync-alt\" ng-class=\"{'fa-spin':$ctrl.autoRefresh}\"></i>\n" +
    "        </button>\n" +
    "        <!--        <button ng-click=\"$ctrl.refresh()\" class=\"btn btn-outline-primary\" title=\"{{'common.entity.action.refresh' | translate}}\"><i-->\n" +
    "        <!--                class=\"fa fa-sync-alt\"></i> {{'common.entity.action.refresh' | translate}}-->\n" +
    "        <!--        </button>-->\n" +
    "    </div>\n" +
    "    <uib-tabset class=\"tab-container h-100 scroll-y op-tab-pane-scroll\" type=\"mdc-op\">\n" +
    "        <uib-tab>\n" +
    "            <uib-tab-heading><i class=\"fa fa-info-circle\"></i> {{'jao.result.detail.summary' | translate}}\n" +
    "            </uib-tab-heading>\n" +
    "            <div ng-if=\"!$ctrl.result\" op-loading=\"\"></div>\n" +
    "            <div ng-if=\"$ctrl.result\">\n" +
    "                <div class=\"mb-3 clearfix d-flex align-items-center\">\n" +
    "                <span class=\"badge bg-{{$ctrl.JOB_STATUS[$ctrl.result.status].color}}\"\n" +
    "                      title=\"{{'jao.result.detail.status' | translate}}\">{{$ctrl.result.status}}</span>\n" +
    "                    <div ng-bind-html=\"$ctrl.result._stats\" class=\"ms-3 d-flex align-items-center\"></div>\n" +
    "                    <span class=\"text-muted ms-auto small\">{{$ctrl.runId}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"mb-3 d-flex align-items-center\">\n" +
    "                <span class=\"badge bg-secondary\"\n" +
    "                      title=\"{{'jao.result.detail.duration' | translate}}\">{{($ctrl.result.endTime) | diff:$ctrl.result.startTime}}</span>\n" +
    "                    <span class=\"ms-3 text-muted\">{{$ctrl.result.startTime | date:'yyyy-MM-dd HH:mm:ss'}}</span> <span\n" +
    "                        class=\"ps-3 pe-3\"><i class=\"fa fa-long-arrow-right\"></i></span> <span\n" +
    "                        class=\"text-muted\">{{($ctrl.result.endTime) | date:'HH:mm:ss'}}</span>\n" +
    "                    <button class=\"btn js-op-button btn-secondary btn-sm ms-auto small\"\n" +
    "                            ng-if=\"'WAITING,RUNNING,CALLBACK'.indexOf($ctrl.result.status) === -1 && $ctrl.result.jobType === 'script' \"\n" +
    "                            ng-click=\"$ctrl.rerunJob($ctrl.runId)\"\n" +
    "                    >\n" +
    "                        <i class=\"fa fa-rocket\">&nbsp;{{'jao.log.rerun' | translate}}</i>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <pre class=\"mb-3 text-danger\" ng-if=\"$ctrl.result.error\"\n" +
    "                     style=\"max-height:10em;overflow:auto;\">{{::$ctrl.result.error}}</pre>\n" +
    "            </div>\n" +
    "            <div>\n" +
    "                <div ng-repeat=\"batch in $ctrl.result.detail.batches\" class=\"card mb-3\">\n" +
    "                    <div class=\"card-header bg-light d-flex align-items-center\">\n" +
    "                    <span class=\"small text-{{$ctrl.JOB_STATUS[batch.status].color}} me-3\"\n" +
    "                          title=\"{{$ctrl.JOB_STATUS[batch.status].title}}\"><i\n" +
    "                            class=\"fa fa-circle\"></i></span>\n" +
    "                        <span>{{batch.batch}}</span>\n" +
    "                        <span class=\"ms-auto\">{{'jao.common.host' | translate}} <span\n" +
    "                                class=\"badge bg-secondary rounded-pill\">{{batch.machineCount}}</span></span>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <div ng-repeat=\"(name,step) in batch.steps\"\n" +
    "                             class=\"jao-runstep d-flex flex-row align-items-start\">\n" +
    "                            <div style=\"min-width:8em;\" class=\"px-3\"><span\n" +
    "                                    class=\"small text text-{{$ctrl.JOB_STATUS[step.status].color}}\"\n" +
    "                                    title=\"{{$ctrl.JOB_STATUS[step.status].title}}\"><i\n" +
    "                                    class=\"fa fa-circle\"></i></span>\n" +
    "                                <span class=\"jao-runstep-name\">{{$ctrl.STEP_NAMES[name]}}</span>\n" +
    "                            </div>\n" +
    "                            <!--                        <div class=\"jao-runstep-message flex-fill\" ng-bind-html=\"step.message | markdown\"-->\n" +
    "                            <!--                        style=\"max-height:10em;overflow:auto;\"></div>-->\n" +
    "                            <pre class=\"jao-runstep-message flex-fill\"\n" +
    "                                 style=\"max-height:10em;overflow:auto;\">{{step.message}}</pre>\n" +
    "                            <span class=\"badge bg-secondary font-weight-normal ms-auto\">{{(step.end || $ctrl.dateNow) | diff:step.start}}</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"$ctrl.result.status==='RUNNING' && ($ctrl.result.jobType==='script' || $ctrl.result.jobType==='command' || $ctrl.result.jobType==='process')\">\n" +
    "                <jao-ansible-progress run-id=\"$ctrl.runId\" auto-refresh=\"$ctrl.autoRefresh\"></jao-ansible-progress>\n" +
    "            </div>\n" +
    "            <!--        <div class=\"mt-3\">-->\n" +
    "            <!--            &lt;!&ndash; Bad performance for 10M result  &ndash;&gt;-->\n" +
    "            <!--            <a href=\"\" ng-click=\"$ctrl.showDetailJson=!$ctrl.showDetailJson\">查看详情 <i-->\n" +
    "            <!--                    class=\"fa fa-angle-{{$ctrl.showDetailJson?'up':'down'}}\"></i></a>-->\n" +
    "            <!--            <pre ng-if=\"$ctrl.showDetailJson\" class=\"bg-light p-3\">{{$ctrl.result | json}}</pre>-->\n" +
    "            <!--        </div>-->\n" +
    "        </uib-tab>\n" +
    "        <uib-tab ng-if=\"$ctrl.result.jobType==='process'\">\n" +
    "            <uib-tab-heading><i class=\"fa fa-random\"></i> {{'jao.result.detail.process' | translate}}</uib-tab-heading>\n" +
    "            <jao-process-modeler process-model=\"$ctrl.processModel\"\n" +
    "                                 options=\"{readonly:true,showElems:'diagram'}\"\n" +
    "                                 register-modeler=\"$ctrl.registerModeler($modeler)\"></jao-process-modeler>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab\n" +
    "                ng-if=\"$ctrl.result.jobType==='script' || $ctrl.result.jobType==='command'|| $ctrl.result.jobType==='process'\">\n" +
    "            <uib-tab-heading><i class=\"fa fa-list\"></i> {{'jao.result.detail.host_view' | translate}}</uib-tab-heading>\n" +
    "            <jao-ao-view contents=\"$ctrl.ansibleContents\"></jao-ao-view>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab\n" +
    "                ng-if=\"$ctrl.result.jobType==='script' || $ctrl.result.jobType==='command'|| $ctrl.result.jobType==='process'\">\n" +
    "            <uib-tab-heading><i class=\"fa fa-table\"></i> {{'jao.result.detail.list_view' | translate}}</uib-tab-heading>\n" +
    "            <jao-ao-view-table contents=\"$ctrl.ansibleContents\"></jao-ao-view-table>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab\n" +
    "                ng-if=\"$ctrl.result.jobType==='script' || $ctrl.result.jobType==='command'|| $ctrl.result.jobType==='process'\">\n" +
    "            <uib-tab-heading><i class=\"fa fa-brackets-curly\"></i> {{'jao.result.detail.raw_output' | translate}}\n" +
    "            </uib-tab-heading>\n" +
    "            <a href=\"{{$ctrl.getDownloadURL()}}\" class=\"btn btn-outline-default ms-auto\"><i\n" +
    "                    class=\"fa fa-file-export\"></i> {{'jao.result.detail.download_ansible_output' | translate}}</a>\n" +
    "            <pre>{{$ctrl.ansibleRawOutput}}</pre>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab\n" +
    "                ng-if=\"$ctrl.result.jobType==='script' || $ctrl.result.jobType==='command'|| $ctrl.result.jobType==='process'\">\n" +
    "            <uib-tab-heading><i class=\"fa fa-list-alt\"></i> Output</uib-tab-heading>\n" +
    "            <ansible-log-viewer run-id=\"$ctrl.runId\"></ansible-log-viewer>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab ng-if=\"$ctrl.result.jobType==='rest'\">\n" +
    "            <uib-tab-heading>{{'jao.result.detail.api_output' | translate}}</uib-tab-heading>\n" +
    "            <ul class=\"mb-3 list-inline list-unstyled\">\n" +
    "                <li title=\"{{'jao.result.detail.status_code' | translate}}\"><span\n" +
    "                        class=\"badge bg-{{$ctrl.JOB_STATUS[$ctrl.result.status].color}}\">{{$ctrl.result.detail.statusCode}}</span>\n" +
    "                </li>\n" +
    "                <li title=\"{{'jao.result.detail.content_type' | translate}}\"><span\n" +
    "                        class=\"\">{{$ctrl.result.detail.contentType}}</span></li>\n" +
    "            </ul>\n" +
    "            <pre ng-if=\"$ctrl.result.error\" class=\"alert alert-danger\">{{$ctrl.result.error}}</pre>\n" +
    "            <div ng-if=\"!$ctrl.result.error\">\n" +
    "                <pre ng-if=\"!$ctrl.result.error\" class=\"bg-light p-3\">{{$ctrl.result.data | json}}</pre>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "    </uib-tabset>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/logs/clean-log.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\" id=\"myParamLabel\">\n" +
    "        <span>{{'jao.job.runlogs.clean.confirm.title' | translate}}</span>\n" +
    "    </h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"vm.clear()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "<form name=\"editForm\" role=\"form\" novalidate ng-submit=\"vm.save()\">\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">{{'jao.job.runlogs.clean.policies.choose' | translate}}</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <select class=\"form-select \" ng-model=\"vm.choose_clean_policy\">\n" +
    "                    <option ng-repeat=\"option in vm.clean_policies\" value={{option.policy}}>\n" +
    "                        {{option.desc}}\n" +
    "                    </option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"submit\" class=\"btn btn-primary\" uaa-has-permission=\"jao:edit:*\">\n" +
    "            <span>{{'jao.job.runlogs.clean.start' | translate}}</span>\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"vm.clear()\">\n" +
    "            <span>{{'common.action.cancel' | translate}}</span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "")

$templateCache.put("app/modules/jao/logview/ao-view-export-template.html","<style type=\"text/css\">\n" +
    "    html {\n" +
    "        font-family: \"Microsoft YaHei\", sans-serif;\n" +
    "        color: #333;\n" +
    "    }\n" +
    "\n" +
    "    pre {\n" +
    "        font-family: \"Cascadia Code\", Consolas, \"Courier New\", monospace;\n" +
    "        padding: 0.5em;\n" +
    "        background-color: #f0f0f0;\n" +
    "    }\n" +
    "\n" +
    "    a, a:visited, a:focus {\n" +
    "        text-decoration: none;\n" +
    "        color: #007bff;\n" +
    "    }\n" +
    "\n" +
    "    a:hover {\n" +
    "        text-decoration: underline;\n" +
    "    }\n" +
    "\n" +
    "    ul.jao-host-list {\n" +
    "        padding-left: 1rem;\n" +
    "    }\n" +
    "\n" +
    "    ul.jao-host-list > li {\n" +
    "        list-style-type: none;\n" +
    "    }\n" +
    "\n" +
    "    ul.jao-host-list > li.jao-unreachable {\n" +
    "        list-style-type: \"\\274C\" !important;\n" +
    "        list-style-position: inside;\n" +
    "    }\n" +
    "\n" +
    "    .alert-danger {\n" +
    "        color: #721c24;\n" +
    "        background-color: #f8d7da;\n" +
    "        border-color: #f5c6cb;\n" +
    "    }\n" +
    "\n" +
    "    .text-danger, .jao-unreachable, li.jao-unreachable > a {\n" +
    "        color: #dc3545 !important;\n" +
    "    }\n" +
    "\n" +
    "    .jao-play, .jao-task, .jao-host {\n" +
    "        padding-left: 1em;\n" +
    "    }\n" +
    "\n" +
    "    /*\n" +
    "    https://www.htmlsymbols.xyz/ascii-symbols\n" +
    "    http://unicode.org/emoji/charts/full-emoji-list.html\n" +
    "    */\n" +
    "    .jao-play > h3:before {\n" +
    "        content: '\\1F4D8';\n" +
    "        padding-right: 0.5em;\n" +
    "    }\n" +
    "\n" +
    "    .jao-host > h4 {\n" +
    "        color: steelblue;\n" +
    "    }\n" +
    "\n" +
    "    .jao-host > h4:before {\n" +
    "        /*content: '\\1F5A5';*/\n" +
    "        /*padding-right: 0.5em;*/\n" +
    "    }\n" +
    "\n" +
    "    .jao-task > h5:before {\n" +
    "        content: '\\27A5';\n" +
    "        padding-right: 0.5em;\n" +
    "    }\n" +
    "\n" +
    "    .jao-back-toc {\n" +
    "        float: right;\n" +
    "    }\n" +
    "</style>\n" +
    "<div>\n" +
    "    <h2 id=\"toc\">{{'common.term.index' | translate}}</h2>\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"batchNodes in $ctrl.exdata.allBatches track by $index\">\n" +
    "            <a href=\"#playbook-{{$index}}\">Playbook {{$index+1}}</a>\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"playNode in batchNodes track by $index\">\n" +
    "                    <a href=\"#playbook-{{$parent.$index}}-play-{{$index}}\">{{playNode.title}}</a>\n" +
    "                    <ul class=\"jao-host-list\">\n" +
    "                        <li ng-repeat=\"hostNode in playNode.children track by $index\"\n" +
    "                            ng-class=\"{'jao-unreachable':hostNode.data.unreachable}\">\n" +
    "                            <!--                            <strong ng-if=\"hostNode.data.unreachable\" class=\"text-danger\"></strong>-->\n" +
    "                            <a href=\"#playbook-{{$parent.$parent.$index}}-play-{{$parent.$index}}-host-{{$index}}\">{{hostNode.title}}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div>\n" +
    "        <div ng-repeat=\"batchNodes in $ctrl.exdata.allBatches track by $index\" class=\"jao-playbook\">\n" +
    "            <h2 id=\"playbook-{{$index}}\">Playbook {{$index+1}}</h2>\n" +
    "            <div ng-repeat=\"playNode in batchNodes track by $index\" class=\"jao-play\">\n" +
    "                <h3 id=\"playbook-{{$parent.$index}}-play-{{$index}}\">{{playNode.title}}</h3>\n" +
    "                <div ng-repeat=\"hostNode in playNode.children track by $index\" class=\"jao-host\">\n" +
    "                    <h4 id=\"playbook-{{$parent.$parent.$index}}-play-{{$parent.$index}}-host-{{$index}}\"\n" +
    "                        ng-class=\"{'jao-unreachable':hostNode.data.unreachable}\">\n" +
    "                        {{hostNode.title}}</h4>\n" +
    "                    <div ng-repeat=\"task in hostNode.tasks track by $index\" class=\"jao-task\">\n" +
    "                        <h5>{{'jao.common.task' | translate}}：{{task.name}} <a href=\"#toc\" class=\"jao-back-toc\">{{'common.entity.action.back' | translate}} &#x2191;</a></h5>\n" +
    "                        <pre ng-if=\"task.output\"\n" +
    "                             ng-class=\"{'alert-danger':hostNode.data.unreachable}\">{{task.output}}</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/logview/ao-view-export-tpl-v1.html","<style type=\"text/css\">\n" +
    "    html {\n" +
    "        font-family: \"Microsoft YaHei\", sans-serif;\n" +
    "        color: #333;\n" +
    "    }\n" +
    "\n" +
    "    pre {\n" +
    "        font-family: \"Cascadia Code\", Consolas, \"Courier New\", monospace;\n" +
    "        padding: 0.5em;\n" +
    "        background-color: #f0f0f0;\n" +
    "    }\n" +
    "\n" +
    "    a, a:visited, a:focus {\n" +
    "        text-decoration: none;\n" +
    "        color: #007bff;\n" +
    "    }\n" +
    "\n" +
    "    a:hover {\n" +
    "        text-decoration: underline;\n" +
    "    }\n" +
    "\n" +
    "    ul.jao-host-list {\n" +
    "        padding-left: 1rem;\n" +
    "    }\n" +
    "\n" +
    "    ul.jao-host-list > li {\n" +
    "        list-style-type: none;\n" +
    "    }\n" +
    "\n" +
    "    ul.jao-host-list > li.jao-unreachable {\n" +
    "        list-style-type: \"\\274C\" !important;\n" +
    "        list-style-position: inside;\n" +
    "    }\n" +
    "\n" +
    "    .alert-danger {\n" +
    "        color: #721c24;\n" +
    "        background-color: #f8d7da;\n" +
    "        border-color: #f5c6cb;\n" +
    "    }\n" +
    "\n" +
    "    .text-danger, .jao-unreachable, li.jao-unreachable > a {\n" +
    "        color: #dc3545 !important;\n" +
    "    }\n" +
    "\n" +
    "    .jao-play, .jao-task, .jao-host {\n" +
    "        padding-left: 1em;\n" +
    "    }\n" +
    "\n" +
    "    /*\n" +
    "    https://www.htmlsymbols.xyz/ascii-symbols\n" +
    "    http://unicode.org/emoji/charts/full-emoji-list.html\n" +
    "    */\n" +
    "    .jao-play > h3:before {\n" +
    "        content: '\\1F4D8';\n" +
    "        padding-right: 0.5em;\n" +
    "    }\n" +
    "\n" +
    "    .jao-host > h4 {\n" +
    "        color: steelblue;\n" +
    "    }\n" +
    "\n" +
    "    .jao-host > h4:before {\n" +
    "        /*content: '\\1F5A5';*/\n" +
    "        /*padding-right: 0.5em;*/\n" +
    "    }\n" +
    "\n" +
    "    .jao-task > h5:before {\n" +
    "        content: '\\27A5';\n" +
    "        padding-right: 0.5em;\n" +
    "    }\n" +
    "\n" +
    "    .jao-back-toc {\n" +
    "        float: right;\n" +
    "    }\n" +
    "</style>\n" +
    "<div>\n" +
    "    <h2 id=\"toc\">{{'common.term.index' | translate}}</h2>\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"batchNodes in $ctrl.exdata.allBatches track by $index\">\n" +
    "            <a href=\"#playbook-{{$index}}\">Playbook {{$index+1}}</a>\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"playNode in batchNodes track by $index\">\n" +
    "                    <a href=\"#playbook-{{$parent.$index}}-play-{{$index}}\">{{playNode.title}}</a>\n" +
    "                    <ul class=\"jao-host-list\">\n" +
    "                        <li ng-repeat=\"hostNode in playNode.children track by $index\"\n" +
    "                            ng-class=\"{'jao-unreachable':hostNode.data.unreachable}\">\n" +
    "                            <!--                            <strong ng-if=\"hostNode.data.unreachable\" class=\"text-danger\"></strong>-->\n" +
    "                            <a href=\"#playbook-{{$parent.$parent.$index}}-play-{{$parent.$index}}-host-{{$index}}\">{{hostNode.title}}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div>\n" +
    "        <div ng-repeat=\"batchNodes in $ctrl.exdata.allBatches track by $index\" class=\"jao-playbook\">\n" +
    "            <h2 id=\"playbook-{{$index}}\">Playbook {{$index+1}}</h2>\n" +
    "            <div ng-repeat=\"playNode in batchNodes track by $index\" class=\"jao-play\">\n" +
    "                <h3 id=\"playbook-{{$parent.$index}}-play-{{$index}}\">{{playNode.title}}</h3>\n" +
    "                <div ng-repeat=\"hostNode in playNode.children track by $index\" class=\"jao-host\">\n" +
    "                    <h4 id=\"playbook-{{$parent.$parent.$index}}-play-{{$parent.$index}}-host-{{$index}}\"\n" +
    "                        ng-class=\"{'jao-unreachable':hostNode.data.unreachable}\">\n" +
    "                        {{hostNode.title}}</h4>\n" +
    "                    <div ng-repeat=\"task in hostNode.tasks track by $index\" class=\"jao-task\">\n" +
    "                        <h5>{{'jao.common.task' | translate}}：{{task.name}} <a href=\"#toc\" class=\"jao-back-toc\">{{'common.entity.action.back' | translate}} &#x2191;</a></h5>\n" +
    "                        <pre ng-if=\"task.output\"\n" +
    "                             ng-class=\"{'alert-danger':hostNode.data.unreachable}\">{{task.output}}</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/logview/ao-view-table.html","<opx-datatable table-config=\"$ctrl.tableConfig\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select ng-model=\"$ctrl.playFilter\" class=\"form-select\" ng-change=\"$ctrl.reload()\"\n" +
    "                    ng-options=\"play.name as play.name for play in $ctrl.plays\">\n" +
    "                <option value=\"\" ng-if=\"$ctrl.plays.length>1\">{{'common.term.all' | translate}}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</opx-datatable>")

$templateCache.put("app/modules/jao/logview/ao-view.component.html","<div class=\"opx-layout-hflex\" style=\"height: 100%; min-width: 400px;\">\n" +
    "    <div class=\"opx-sidebar border\" style=\"width: 14rem;\">\n" +
    "        <nav class=\"opx-sidebar-header opx-sidebar-header-fixed px-3\">\n" +
    "            <op-searchbox on-search=\"$ctrl.filterHost($ctrl.filterText)\" search-text=\"$ctrl.filterText\"\n" +
    "                          xxxstyle=\"width:8em;\" class=\"d-flex align-items-center\">\n" +
    "                <div class=\"dropdown ms-3\">\n" +
    "                    <button type=\"button\" class=\"btn btn-sm btn-default opx-btn-icon opx-btn-flat\"\n" +
    "                            data-bs-toggle=\"dropdown\"><i\n" +
    "                            class=\"fa fa-ellipsis-v\"></i></button>\n" +
    "                    <div class=\"dropdown-menu\">\n" +
    "                        <a class=\"dropdown-item\" ng-click=\"$ctrl.exportData()\"><i\n" +
    "                                class=\"far fa-fw fa-file-export me-3\"></i><span>{{'jao.log.export_html' | translate}}</span></a>\n" +
    "                        <a class=\"dropdown-item d-flex align-items-center\" ng-if=\"$ctrl.contents.length>1\"\n" +
    "                           ng-click=\"$ctrl.toggleMergeMode()\"><i\n" +
    "                                class=\"far fa-fw fa-object-ungroup me-3\"></i><span>{{'jao.log.merge_mode' | translate}}</span>\n" +
    "                            <i class=\"ms-auto fa fa-check\" ng-if=\"$ctrl.isBatchMerged\"></i></a>\n" +
    "                        <a class=\"dropdown-item\" ng-click=\"$ctrl.expandOrCollapseAll()\"><i class=\"far fa-fw me-3\"\n" +
    "                                                                                           ng-class=\"$ctrl.isExpandedAll?'fa-compress-alt':'fa-expand-alt'\"></i><span>{{($ctrl.isExpandedAll ? 'jao.job.log.collapse_all' : 'jao.job.log.expand_all') | translate}}</span></a>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </op-searchbox>\n" +
    "        </nav>\n" +
    "        <div class=\"opx-sidebar-body js-aoview-tree\" style=\"max-height: 495px\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill px-3\">\n" +
    "        <pre ng-if=\"$ctrl.detailView==='rawOutput'\">{{$ctrl.output | json}}</pre>\n" +
    "        <div ng-if=\"$ctrl.selectedNode.type==='play'\">{{$ctrl.selectedNode.title}}</div>\n" +
    "        <div ng-if=\"$ctrl.selectedNode.type==='host'\" class=\"h-100 opx-layout-vflex\">\n" +
    "            <div class=\"d-flex flex-row align-items-center mb-3\">\n" +
    "                <h4 class=\"me-3 mb-0\">{{$ctrl.selectedNode.title}}</h4>\n" +
    "                <ul class=\"list-inline list-unstyled me-auto mb-0\">\n" +
    "                    <li ng-repeat=\"(key,value) in $ctrl.nodeTasksStats\">\n" +
    "                    <span class=\"op-cursor-hand\"\n" +
    "                          ng-class=\"$ctrl.statusFilter==key?'badge bg-'+$ctrl.statusDefs[key].color:'font-weight-bold small text-'+$ctrl.statusDefs[key].color\"\n" +
    "                          ng-click=\"$ctrl.toggleStatusFilter(key)\"\n" +
    "                          title=\"{{$ctrl.statusDefs[key].tooltip}}\">{{$ctrl.statusDefs[key].text}} {{value}}</span>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <op-searchbox search-text=\"$ctrl.outputFilterText\" style=\"width:8em;\"></op-searchbox>\n" +
    "            </div>\n" +
    "            <div class=\"opx-flex-fill scroll-y __list-group\">\n" +
    "                <div ng-repeat=\"task in $ctrl.selectedNode.data.tasks | filter: {status:$ctrl.statusFilter}\n" +
    "                | filterAny:'name,output':$ctrl.outputFilterText track by $index\"\n" +
    "                     __class=\"list-group-item p-3\"\n" +
    "                     class=\"card mb-3\"\n" +
    "                     ng-class=\"{'list-group-item-warning':task.status==='unreachable','list-group-item-danger':task.status==='failed','list-group-item-light':task.status==='ignored' || task.status==='skipped'}\">\n" +
    "                    <div class=\"card-header d-flex align-items-center\">\n" +
    "                        <div>\n" +
    "                            <span ng-if=\"task.delegateHost\" class=\"badge bg-secondary\">{{task.delegateHost}}</span>\n" +
    "                            {{task.name}}\n" +
    "                        </div>\n" +
    "                        <div class=\"ms-auto\">\n" +
    "                            <span class=\"badge bg-{{$ctrl.statusDefs[task.status].color}}\">{{$ctrl.statusDefs[task.status].text}}</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-body\" ng-if=\"task.output\">\n" +
    "                        <pre class=\"py-3 text-break mb-0\">{{task.output}}</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/logview/ao-view.html","<div class=\"opx-layout-hflex\" style=\"height: 100%; min-width: 400px;\">\n" +
    "    <div class=\"opx-sidebar border\" style=\"width: 14rem;\">\n" +
    "        <nav class=\"opx-sidebar-header opx-sidebar-header-fixed px-3\">\n" +
    "            <op-searchbox on-search=\"$ctrl.filterHost($ctrl.filterText)\" search-text=\"$ctrl.filterText\"\n" +
    "                          xxxstyle=\"width:8em;\" class=\"d-flex align-items-center\">\n" +
    "                <div class=\"dropdown ms-3\">\n" +
    "                    <button type=\"button\" class=\"btn btn-sm btn-default opx-btn-icon opx-btn-flat\"\n" +
    "                            data-bs-toggle=\"dropdown\"><i\n" +
    "                            class=\"fa fa-ellipsis-v\"></i></button>\n" +
    "                    <div class=\"dropdown-menu\">\n" +
    "                        <a class=\"dropdown-item\" ng-click=\"$ctrl.exportData()\"><i\n" +
    "                                class=\"far fa-fw fa-file-export me-3\"></i><span>{{'jao.log.export_html' | translate}}</span></a>\n" +
    "                        <a class=\"dropdown-item d-flex align-items-center\" ng-if=\"$ctrl.contents.length>1\"\n" +
    "                           ng-click=\"$ctrl.toggleMergeMode()\"><i\n" +
    "                                class=\"far fa-fw fa-object-ungroup me-3\"></i><span>{{'jao.log.merge_mode' | translate}}</span>\n" +
    "                            <i class=\"ms-auto fa fa-check\" ng-if=\"$ctrl.isBatchMerged\"></i></a>\n" +
    "                        <a class=\"dropdown-item\" ng-click=\"$ctrl.expandOrCollapseAll()\"><i class=\"far fa-fw me-3\"\n" +
    "                                                                                           ng-class=\"$ctrl.isExpandedAll?'fa-compress-alt':'fa-expand-alt'\"></i><span>{{($ctrl.isExpandedAll ? 'jao.job.log.collapse_all' : 'jao.job.log.expand_all') | translate}}</span></a>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </op-searchbox>\n" +
    "        </nav>\n" +
    "        <div class=\"opx-sidebar-body js-aoview-tree\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill px-3\">\n" +
    "        <pre ng-if=\"$ctrl.detailView==='rawOutput'\">{{$ctrl.output | json}}</pre>\n" +
    "        <div ng-if=\"$ctrl.selectedNode.type==='play'\">{{$ctrl.selectedNode.title}}</div>\n" +
    "        <div ng-if=\"$ctrl.selectedNode.type==='host'\" class=\"h-100 opx-layout-vflex\">\n" +
    "            <div class=\"d-flex flex-row align-items-center mb-3\">\n" +
    "                <h4 class=\"me-3 mb-0\">{{$ctrl.selectedNode.title}}</h4>\n" +
    "                <ul class=\"list-inline list-unstyled me-auto mb-0\">\n" +
    "                    <li ng-repeat=\"(key,value) in $ctrl.nodeTasksStats\">\n" +
    "                    <span class=\"op-cursor-hand\"\n" +
    "                          ng-class=\"$ctrl.statusFilter==key?'badge bg-'+$ctrl.statusDefs[key].color:'font-weight-bold small text-'+$ctrl.statusDefs[key].color\"\n" +
    "                          ng-click=\"$ctrl.toggleStatusFilter(key)\"\n" +
    "                          title=\"{{$ctrl.statusDefs[key].tooltip}}\">{{$ctrl.statusDefs[key].text}} {{value}}</span>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <op-searchbox search-text=\"$ctrl.outputFilterText\" style=\"width:8em;\"></op-searchbox>\n" +
    "            </div>\n" +
    "            <div class=\"opx-flex-fill scroll-y __list-group\">\n" +
    "                <div ng-repeat=\"task in $ctrl.selectedNode.data.tasks | filter: {status:$ctrl.statusFilter}\n" +
    "                | filterAny:'name,output':$ctrl.outputFilterText track by $index\"\n" +
    "                     __class=\"list-group-item p-3\"\n" +
    "                     class=\"card mb-3\"\n" +
    "                     ng-class=\"{'list-group-item-warning':task.status==='unreachable','list-group-item-danger':task.status==='failed','list-group-item-light':task.status==='ignored' || task.status==='skipped'}\">\n" +
    "                    <div class=\"card-header d-flex align-items-center\">\n" +
    "                        <div>\n" +
    "                            <span ng-if=\"task.delegateHost\" class=\"badge bg-secondary\">{{task.delegateHost}}</span>\n" +
    "                            {{task.name}}\n" +
    "                        </div>\n" +
    "                        <div class=\"ms-auto\">\n" +
    "                            <span class=\"badge bg-{{$ctrl.statusDefs[task.status].color}}\">{{$ctrl.statusDefs[task.status].text}}</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-body\" ng-if=\"task.output\">\n" +
    "                        <pre class=\"py-3 text-break mb-0\">{{task.output}}</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/logview/logview-widget-config.html","<uib-tabset class=\"tab-container\">\n" +
    "    <uib-tab>\n" +
    "        <uib-tab-heading><i class='fa fa-database'></i> {{'udp.wc.tab.data' | translate}}</uib-tab-heading>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">{{'jao.log.data_from' | translate}}</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <select class=\"form-select\" ng-model=\"uwProps.dataset.source\">\n" +
    "                    <option value=\"jaorunlist\">{{'jao.log.jao_run_list' | translate}}</option>\n" +
    "                    <option value=\"jaolastrun\">{{'jao.log.jao_last_run' | translate}}</option>\n" +
    "                    <option value=\"jaorunid\">{{'jao.log.jao_run_id' | translate}}</option>\n" +
    "                    <option value=\"opslog\">{{'jao.log.jao_oplog_list' | translate}}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"uwProps.dataset.source==='opslog'\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'jao.log.opslog.module' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" ng-model=\"uwProps.dataset.opslog.module\" class=\"form-control\">\n" +
    "                    <!-- <p class=\"help-block\">{{'jao.log.opslog.module_desc' | translate}}</p> -->\n" +
    "                    <!--                    <p class=\"help-block\"></p>-->\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'jao.log.opslog.operation' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <udp-data-converter the-model=\"uwProps.dataset.opslog.operation\" options=\"{kinds:'js,str'}\"\n" +
    "                                        class=\"op-w-full\"></udp-data-converter>\n" +
    "                    <!--                    <p class=\"help-block\">{{'jao.log.opslog.operation_desc' | translate}}</p>-->\n" +
    "                    <!--                    <p class=\"help-block\"></p>-->\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'jao.log.opslog.filter_status' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <udp-data-converter the-model=\"uwProps.dataset.opslog.filter_status\" options=\"{kinds:'js,str'}\"\n" +
    "                                        class=\"op-w-full\"></udp-data-converter>\n" +
    "                    <p class=\"help-block\">{{'jao.log.opslog.filter_status_desc' | translate}}</p>\n" +
    "                    <p class=\"help-block\"></p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'jao.log.opslog.filter_day' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <udp-data-converter the-model=\"uwProps.dataset.opslog.filter_day\" options=\"{kinds:'js,str'}\"\n" +
    "                                        class=\"op-w-full\"></udp-data-converter>\n" +
    "                    <p class=\"help-block\">{{'jao.log.opslog.filter_day_desc' | translate}}</p>\n" +
    "                    <p class=\"help-block\"></p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'jao.log.opslog.action_column' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <udp-data-converter the-model=\"uwProps.dataset.opslog.action_column\"\n" +
    "                                        class=\"w-full\"\n" +
    "                                        options=\"{kinds:'link',varTypes:'field'}\"></udp-data-converter>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"uwProps.dataset.source==='jaorunlist'||uwProps.dataset.source==='jaolastrun'\">\n" +
    "            <jao-job-selector the-model=\"uwProps.jobId\" selected-job=\"selectedJob\"></jao-job-selector>\n" +
    "        </div>\n" +
    "        <div ng-if=\"uwProps.dataset.source==='jaorunid'\">\n" +
    "            <div ng-bind-html=\"'jao.log.need_param' | translate\"></div>\n" +
    "        </div>\n" +
    "    </uib-tab>\n" +
    "    <uib-tab>\n" +
    "        <uib-tab-heading><i class='fa fa-random'></i> {{'udp.wc.tab.interaction' | translate}}</uib-tab-heading>\n" +
    "        <udp-widget-config-interaction the-model=\"uwProps.interaction\"\n" +
    "                                       options=\"{supports:'page,param,job,ajax,link,event,func,code'}\"\n" +
    "                                       param-vars=\"\">\n" +
    "        </udp-widget-config-interaction>\n" +
    "    </uib-tab>\n" +
    "    <uib-tab>\n" +
    "        <uib-tab-heading><i class='fa fa-paint-brush'></i> {{'udp.wc.tab.style' | translate}}</uib-tab-heading>\n" +
    "        <udp-widget-config-display options=\"{palette:false}\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'jao.log.show_mode' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <select class=\"form-select\" ng-model=\"uwProps.display.viewas\">\n" +
    "                        <option value=\"dialog\">{{'jao.log.show_mode.dialog' | translate}}</option>\n" +
    "                        <option value=\"plain\">{{'jao.log.show_mode.plain' | translate}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"uwProps.display.viewas==='dialog'\">\n" +
    "                <udp-button-style-config ng-model=\"uwProps.display.button\"></udp-button-style-config>\n" +
    "            </div>\n" +
    "        </udp-widget-config-display>\n" +
    "    </uib-tab>\n" +
    "    <uib-tab heading=\"{{'jao.log.props_code' | translate}}\">\n" +
    "        <udp-widget-props-viewer the-model=\"uwProps\"></udp-widget-props-viewer>\n" +
    "    </uib-tab>\n" +
    "</uib-tabset>")

$templateCache.put("app/modules/jao/process-job-config.html","<fieldset>\n" +
    "    <legend>{{'jao.job.process.title' | translate}}</legend>\n" +
    "    <jao-process-modeler process-model=\"$ctrl.jobConfig.processModel\"\n" +
    "                         register-modeler=\"$ctrl.registerDesigner($modeler)\"\n" +
    "                         options=\"{readonly:!$ctrl.isEditMode,canvasCss:$ctrl.isEditMode?'bg-secondary':'bg-light'}\"\n" +
    "                         style=\"height:600px; display: block\" class=\"mb-3\"></jao-process-modeler>\n" +
    "</fieldset>\n" +
    "<fieldset ng-disabled=\"!$ctrl.isEditMode\">\n" +
    "    <legend>{{'jao.job.process.run_settings' | translate}}</legend>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\" op-help-info=\"{{'jao.job.process.callback_info' | translate}}\">{{'jao.job.process.callback' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input class=\"form-control\" ng-model=\"$ctrl.jobConfig.callback\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\"\n" +
    "               op-help-info=\"{{'jao.job.process.timeout_info' | translate}}\">{{'jao.job.process.timeout' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <div class=\"input-group w-sm\">\n" +
    "                <input type=\"number\" ng-model=\"$ctrl.jobConfig.taskTimeout\" class=\"form-control\" min=\"-1\"\n" +
    "                       step=\"1\">\n" +
    "                <div class=\"input-group-append\"><span class=\"input-group-text\">{{'common.term.second' | translate}}</span></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</fieldset>\n" +
    "")

$templateCache.put("app/modules/jao/process/process-modeler.html","<div class=\"h-100 scroll-y\">\n" +
    "    <div class=\"jao-pmd-canvas opx-flex-fill p-3\" ng-class=\"$ctrl.options.canvasCss\" ng-if=\"$ctrl.showElems==='diagram'\">\n" +
    "        <!--                    <button class=\"btn btn-sm btn-default opx-btn-icon\" ng-click=\"$ctrl.drawLines()\"><i-->\n" +
    "        <!--                            class=\"far fa-sync-alt\"></i></button>-->\n" +
    "        <div class=\"jao-pmd-node-container\"\n" +
    "             ui-sortable=\"$ctrl.sortableOptions\" ng-model=\"$ctrl.processModel.tasks\">\n" +
    "            <div ng-repeat=\"task in $ctrl.processModel.tasks track by $index\"\n" +
    "                 class=\"card jao-pmd-task-node\"\n" +
    "                 id=\"js-pm-tasknode-{{task.id}}\"\n" +
    "                 tabindex=\"-1\"\n" +
    "                 ng-class=\"{'active':$ctrl.selectedTaskNodes.indexOf($index)>=0}\"\n" +
    "                 ng-click=\"$ctrl.clickTaskNode(task,$index)\">\n" +
    "                <div class=\"card-header p-2 d-flex align-items-center\">\n" +
    "                    <i class=\"text-muted fal {{$ctrl.moduleDefs[task[task.type||'module'].name].icon}} fa-fw me-2\"></i>\n" +
    "                    <span>{{task.name}}</span>\n" +
    "                    <span class=\"ms-auto small text-secondary\">{{$ctrl.moduleDefs[task[task.type || 'module'].name].title}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"card-body p-2 scroll-y\">\n" +
    "                    <div ng-repeat=\"(param,value) in task[task.type||'module'].params track by $index\"\n" +
    "                         class=\"small\">\n" +
    "                        <strong>{{param}}</strong>\n" +
    "                        <div class=\"text-ellipsis\" title=\"{{value}}\">{{value}}</div>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"task.withHosts\"><i class=\"far fa-fw fa-server\"></i>\n" +
    "                        <ul class=\"list-inline list-unstyled d-inline-block mb-0\">\n" +
    "                            <li ng-repeat=\"host in task.withHosts\">\n" +
    "                                <span class=\"badge bg-secondary\">{{host}}</span>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"task.when\" title=\"{{'jao.job.process.when' | translate}}\"><i class=\"far fa-fw fa-filter\"></i> <code\n" +
    "                            class=\"\">{{task.when}}</code></div>\n" +
    "                    <div ng-if=\"task.outputVar\" title=\"{{'jao.job.process.output_var' | translate}}\"><i class=\"far fa-fw fa-brackets-curly\"></i> <span\n" +
    "                            class=\"badge bg-info\">{{task.outputVar}}</span></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div id=\"jao-pmd-line-wrapper\"></div>\n" +
    "    </div>\n" +
    "    <uib-tabset class=\"tab-container h-100\" active=\"1\" type=\"mdc-op\" ng-if=\"$ctrl.showElems!=='diagram'\">\n" +
    "        <uib-tab index=\"2\" ng-if=\"$ctrl.showElems.indexOf('inventory')>-1\">\n" +
    "            <uib-tab-heading><i class=\"far fa-server\"></i> {{'jao.job.process.host_resource' | translate}}</uib-tab-heading>\n" +
    "            <fieldset ng-disabled=\"$ctrl.options.readonly\">\n" +
    "                <div class=\"mb-3\">\n" +
    "                    <button class=\"btn btn-primary\" ng-click=\"$ctrl.addServerGroup()\"><i class=\"fa fa-plus\"></i> {{'jao.job.process.create_group' | translate}}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div class=\"card mb-3\" ng-repeat=\"group in $ctrl.processModel.inventory track by $index\">\n" +
    "                    <div class=\"card-header d-flex p-2 bg-light border-bottom\">\n" +
    "                        <input type=\"text\" ng-model=\"group.group\" class=\"form-control me-auto font-weight-bold\">\n" +
    "                        <button class=\"ms-3 btn btn-default opx-btn-icon opx-btn-flat\" ng-click=\"$ctrl.removeServerGroup($index)\" title=\"{{'jao.job.process.delete_group' | translate}}\"><i\n" +
    "                                class=\"fa fa-trash-alt\"></i></button>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-body p-3\">\n" +
    "                        <acm-device-selector the-model=\"group.hosts\" mcheck-type=\"'map'\"></acm-device-selector>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab index=\"1\">\n" +
    "            <uib-tab-heading><i class=\"far fa-random\"></i> {{'jao.common.flow' | translate}}</uib-tab-heading>\n" +
    "            <div class=\"opx-layout-hflex\">\n" +
    "                <div class=\"jao-pmd-canvas opx-flex-fill p-3\" ng-class=\"$ctrl.options.canvasCss\">\n" +
    "                    <!--                    <button class=\"btn btn-sm btn-default opx-btn-icon\" ng-click=\"$ctrl.drawLines()\"><i-->\n" +
    "                    <!--                            class=\"far fa-sync-alt\"></i></button>-->\n" +
    "                    <div class=\"jao-pmd-node-container\"\n" +
    "                         ui-sortable=\"$ctrl.sortableOptions\" ng-model=\"$ctrl.processModel.tasks\">\n" +
    "                        <div ng-repeat=\"task in $ctrl.processModel.tasks track by $index\"\n" +
    "                             class=\"card jao-pmd-task-node\"\n" +
    "                             id=\"js-pm-tasknode-{{task.id}}\"\n" +
    "                             tabindex=\"-1\"\n" +
    "                             ng-class=\"{'active':$ctrl.selectedTaskNodes.indexOf($index)>=0}\"\n" +
    "                             ng-click=\"$ctrl.clickTaskNode(task,$index)\">\n" +
    "                            <div class=\"card-header p-2 d-flex align-items-center\">\n" +
    "                                <i class=\"text-muted fal {{$ctrl.moduleDefs[task[task.type||'module'].name].icon}} fa-fw me-2\"></i>\n" +
    "                                <span>{{task.name}}</span>\n" +
    "                                <span class=\"ms-auto small text-secondary\">{{$ctrl.moduleDefs[task[task.type || 'module'].name].title}}</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"card-body p-2 scroll-y\">\n" +
    "                                <div ng-repeat=\"(param,value) in task[task.type||'module'].params track by $index\"\n" +
    "                                     class=\"small\">\n" +
    "                                    <strong>{{param}}</strong>\n" +
    "                                    <div class=\"text-ellipsis\" title=\"{{value}}\">{{value}}</div>\n" +
    "                                </div>\n" +
    "                                <div ng-if=\"task.withHosts\"><i class=\"far fa-fw fa-server\"></i>\n" +
    "                                    <ul class=\"list-inline list-unstyled d-inline-block mb-0\">\n" +
    "                                        <li ng-repeat=\"host in task.withHosts\">\n" +
    "                                            <span class=\"badge bg-secondary\">{{host}}</span>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                                <div ng-if=\"task.when\" title=\"{{'jao.job.process.when' | translate}}\"><i class=\"far fa-fw fa-filter\"></i> <code\n" +
    "                                        class=\"\">{{task.when}}</code></div>\n" +
    "                                <div ng-if=\"task.outputVar\" title=\"{{'jao.job.process.output_var' | translate}}\"><i class=\"far fa-fw fa-brackets-curly\"></i> <span\n" +
    "                                        class=\"badge bg-info\">{{task.outputVar}}</span></div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div id=\"jao-pmd-line-wrapper\"></div>\n" +
    "                </div>\n" +
    "                <fieldset ng-disabled=\"$ctrl.options.readonly\" ng-if=\"$ctrl.showElems.indexOf('details')>-1\">\n" +
    "                    <div id=\"js-pm-task-detail\" class=\"card ms-3 op-smartform\" style=\"width:15rem;\">\n" +
    "                        <div class=\"card-header bg-light p-2\" ng-if=\"!$ctrl.options.readonly\">\n" +
    "                            {{'jao.job.process.operate_settings' | translate}}\n" +
    "                            <button class=\"btn btn-sm btn-primary opx-btn-icon opx-btn-flat\" title=\"{{'jao.job.process.create_task' | translate}}\"\n" +
    "                                    ng-click=\"$ctrl.addTask()\"><i\n" +
    "                                    class=\"fa fa-plus\"></i></button>\n" +
    "                            <button class=\"btn btn-sm btn-danger opx-btn-icon opx-btn-flat\" title=\"{{'jao.job.process.delete_task' | translate}}\"\n" +
    "                                    ng-click=\"$ctrl.removeTask()\"><i\n" +
    "                                    class=\"fa fa-trash-alt\"></i></button>\n" +
    "                        </div>\n" +
    "                        <div class=\"card-body p-2\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'common.entity.detail.name' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.activeTask.name\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <!--                <div class=\"form-group\">-->\n" +
    "                            <!--                    <label class=\"control-label\">操作</label>-->\n" +
    "                            <!--                    <div class=\"form-control-wrapper\">-->\n" +
    "                            <!--                        <select class=\"form-select\" ng-model=\"$ctrl.activeTask.type\">-->\n" +
    "                            <!--                            <option value=\"module\">调用模块</option>-->\n" +
    "                            <!--                        </select>-->\n" +
    "                            <!--                    </div>-->\n" +
    "                            <!--                </div>-->\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'common.entity.detail.operation' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <select class=\"form-select\" ng-model=\"$ctrl.activeTask.module.name\"\n" +
    "                                            ng-options=\"key as def.title + ' ('+key + ')' for (key,def) in $ctrl.moduleDefs\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'jao.job.process.operate_param' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <div class=\"w-full\">\n" +
    "                                        <div ng-repeat=\"(key,value) in $ctrl.moduleDefs[$ctrl.activeTask.module.name].params\">\n" +
    "                                            <span class=\"badge bg-secondary\">{{key}}</span>\n" +
    "                                            <input type=\"text\" class=\"form-control\"\n" +
    "                                                   ng-model=\"$ctrl.activeTask.module.params[key]\">\n" +
    "                                            <p class=\"help-block\">\n" +
    "                                                {{$ctrl.moduleDefs[$ctrl.activeTask.module.name].params[key].desc}}</p>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'jao.job.process.output_var' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.activeTask.outputVar\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'jao.job.process.when' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.activeTask.when\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <div class=\"checkbox checkbox-primary\">\n" +
    "                                        <input type=\"checkbox\" ng-model=\"$ctrl.activeTask.ignoreErrors\"\n" +
    "                                               id=\"pd-task-ignoreerror\">\n" +
    "                                        <label for=\"pd-task-ignoreerror\">{{'jao.job.process.ignore_error' | translate}}</label>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"checkbox checkbox-primary ms-5\">\n" +
    "                                        <input type=\"checkbox\" ng-model=\"$ctrl.activeTask.runOnce\"\n" +
    "                                               id=\"pd-task-runonce\">\n" +
    "                                        <label for=\"pd-task-runonce\">{{'jao.job.process.run_once' | translate}}</label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label\">{{'jao.job.process.operate_resource' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <select op-select multiple class=\"form-select\" ng-disabled=\"$ctrl.options.readonly\"\n" +
    "                                            ng-model=\"$ctrl.activeTask.withHosts\"\n" +
    "                                            ng-options=\"item.group as item.group for item in $ctrl.processModel.inventory\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </fieldset>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "        <!--    <uib-tab>-->\n" +
    "        <!--        <uib-tab-heading><i class=\"far fa-brackets-curly\"></i> 参数</uib-tab-heading>-->\n" +
    "        <!--        <op-param-table param-list=\"$ctrl.processModel.params\"></op-param-table>-->\n" +
    "        <!--        <pre>{{$ctrl.processModel.params | json}}</pre>-->\n" +
    "        <!--    </uib-tab>-->\n" +
    "        <uib-tab ng-if=\"$ctrl.showElems.indexOf('source')>-1\">\n" +
    "            <uib-tab-heading><i class=\"far fa-code\"></i> Source</uib-tab-heading>\n" +
    "            <pre class=\"bg-light p-3\">{{$ctrl.processModel | json}}</pre>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab heading=\"Playbook\" ng-if=\"$ctrl.showElems.indexOf('playbook')>-1\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <div class=\"card\">\n" +
    "                        <div class=\"card-header\">site.yml</div>\n" +
    "                        <div class=\"card-body\">\n" +
    "                            <pre>{{$ctrl.generatedPlaybook}}</pre>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col\">\n" +
    "                    <div class=\"card col\">\n" +
    "                        <div class=\"card-header\">hosts</div>\n" +
    "                        <div class=\"card-body\">\n" +
    "                            <pre>{{$ctrl.generatedInventory}}</pre>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "    </uib-tabset>\n" +
    "</div>")

$templateCache.put("app/modules/jao/rest-job-config.html","<fieldset  ng-disabled=\"!$ctrl.isEditMode\">\n" +
    "    <legend>{{'jao.job.rest.title' | translate}}</legend>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\" for=\"rje_query\">{{'jao.job.rest.curl' | translate}}</label>\n" +
    "        <div class=\"\">\n" +
    "            <textarea ng-model=\"$ctrl.jobConfig.curl\"\n" +
    "                ui-codemirror=\"{mode:'shell', lineNumbers:false, theme:'opluscode', lineWrapping:true}\"\n" +
    "                rows=\"6\" id=\"rje_query\"></textarea>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "<!--    <div class=\"form-group\">-->\n" +
    "<!--        <div class=\"checkbox checkbox-inline\">-->\n" +
    "<!--            <input type=\"checkbox\" id=\"rje_enable_post_action\" ng-model=\"$ctrl.jobConfig.postActionEnabled\"><label for=\"rje_enable_post_action\">调用REST后对数据进行二次处理</label>-->\n" +
    "<!--        </div>-->\n" +
    "<!--    </div>-->\n" +
    "<!--    <div class=\"form-group\">-->\n" +
    "<!--        <label class=\"control-label\" for=\"rje_post_action\">处理脚本</label>-->\n" +
    "<!--        <div class=\"\">-->\n" +
    "<!--            <textarea ng-model=\"$ctrl.jobConfig.postAction\"-->\n" +
    "<!--                ui-codemirror=\"{mode:'javascript', lineNumbers:true, theme:'opluscode', lineWrapping:true}\"-->\n" +
    "<!--                rows=\"6\" id=\"rje_post_action\"></textarea>-->\n" +
    "<!--        </div>-->\n" +
    "<!--    </div>-->\n" +
    "</fieldset>")

$templateCache.put("app/modules/jao/script-job-config.html","<fieldset ng-disabled=\"!$ctrl.isEditMode\" ng-init=\"$ctrl.display = 0\">\n" +
    "    <legend ng-click=\"$ctrl.display = $ctrl.display + 1\">{{'jao.job.script.title' | translate}}</legend>\n" +
    "    <!--使用参数配置默认的执行工具-->\n" +
    "    <!--<div class=\"form-group\">-->\n" +
    "        <!--<label class=\"control-label\">执行工具</label>-->\n" +
    "        <!--<div class=\"form-control-wrapper d-inline-block\">-->\n" +
    "            <!--<div class=\"opx-check-group opx-secondary btn-group\">-->\n" +
    "                <!--<input type=\"radio\" name=\"job_engine\" value=\"ansible\"-->\n" +
    "                       <!--ng-model=\"$ctrl.jobConfig.engine\"-->\n" +
    "                       <!--id=\"job_engine_ansible\">-->\n" +
    "                <!--<label for=\"job_engine_ansible\">&lt;!&ndash;<img src=\"app/modules/jao/assets/udp/logo-ansible-black.svg\" style=\"height:32px;\">&ndash;&gt; Ansible</label>-->\n" +
    "                <!--&lt;!&ndash;                <label for=\"job_engine_ansible\"><img src=\"app/modules/jao/assets/udp/logo-ansible.svg\" style=\"height:48px;\"> ansible</label>&ndash;&gt;-->\n" +
    "                <!--<input type=\"radio\" name=\"job_engine\" value=\"tower\"-->\n" +
    "                       <!--ng-model=\"$ctrl.jobConfig.engine\"-->\n" +
    "                       <!--id=\"job_engine_tower\">-->\n" +
    "                <!--<label for=\"job_engine_tower\">&lt;!&ndash;<img src=\"app/modules/jao/assets/udp/logo-ansible-red.svg\" style=\"height:32px;\"> &ndash;&gt;Tower</label>-->\n" +
    "            <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'jao.job.script.type' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper d-inline-block\">\n" +
    "            <div class=\"opx-check-group opx-secondary btn-group\">\n" +
    "                <input type=\"radio\" name=\"job_scriptType\" value=\"playbook\"\n" +
    "                       ng-model=\"$ctrl.jobConfig.scriptType\"\n" +
    "                       id=\"job_scriptType_playbook\">\n" +
    "                <label for=\"job_scriptType_playbook\">{{'jao.job.script.type.playbook' | translate}}</label>\n" +
    "                <input type=\"radio\" name=\"job_scriptType\" value=\"adhoc\"\n" +
    "                       ng-model=\"$ctrl.jobConfig.scriptType\"\n" +
    "                       id=\"job_scriptType_adhoc\">\n" +
    "                <label for=\"job_scriptType_adhoc\">{{'jao.job.script.type.adhoc' | translate}}</label>\n" +
    "\n" +
    "                <input type=\"radio\" name=\"job_scriptType\" value=\"template\"\n" +
    "                       ng-model=\"$ctrl.jobConfig.scriptType\"\n" +
    "                       ng-if=\"$ctrl.scriptEngine == 'aap'\"\n" +
    "                       id=\"job_scriptType_template\">\n" +
    "                <label for=\"job_scriptType_template\"\n" +
    "                        ng-if=\"$ctrl.scriptEngine == 'aap'\">{{'jao.job.script.type.aap_template' | translate}}</label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <!--多步骤功能暂未实现-->\n" +
    "        <!--<div class=\"d-flex mb-3\">-->\n" +
    "            <!--<label class=\"control-label\">步骤</label>-->\n" +
    "            <!--<button class=\"btn btn-sm btn-default ms-3\" ng-if=\"$ctrl.isEditMode\"-->\n" +
    "                    <!--ng-click=\"$ctrl.addTask()\"><i class=\"text-primary fa fa-plus-circle\"></i> 添加步骤-->\n" +
    "            <!--</button>-->\n" +
    "        <!--</div>-->\n" +
    "        <div>\n" +
    "            <div class=\"card card-default op-action-card op-w-full\" ng-repeat=\"task in $ctrl.jobConfig.tasks\">\n" +
    "                <div class=\"card-header\" ng-if=\"$ctrl.jobConfig.tasks.length>1\">\n" +
    "                    <h4 class=\"card-title\"><span\n" +
    "                            class=\"badge bg-secondary rounded-circle\">{{$ctrl.jobConfig.tasks.length > 1 ? $index + 1 : ''}}</span>\n" +
    "                    </h4>\n" +
    "                    <button class=\"btn btn-sm btn-default pull-right\" ng-if=\"$ctrl.isEditMode\"\n" +
    "                            ng-click=\"$ctrl.removeTask($index)\">{{'jao.job.script.delete_step' | translate}}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div class=\"card-body\" ng-if=\"$ctrl.jobConfig.scriptType !== 'template'\">\n" +
    "                    <div class=\"form-group op-align-horizontal\">\n" +
    "                        <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'jao.common.script' | translate}}</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <gfs-file-selector the-model=\"task.scripts\" class=\"w-full\"\n" +
    "                                               model-converter=\"{type: 'attrmap', attrmap: {'location': 'path', 'argline': 'config', tag: 'tag'}, modelType: 'array'}\"\n" +
    "                                               config=\"$ctrl.fileSelectorConfig\"></gfs-file-selector>\n" +
    "                            <details class=\"help-block\">\n" +
    "                                <summary>{{'jao.job.script.param' | translate}}</summary>\n" +
    "                                {{'jao.job.script.param_info.0' | translate}}\n" +
    "                                <div ng-if=\"$ctrl.jobConfig.scriptType==='playbook'\">\n" +
    "                                    {{'jao.job.script.param_info.1' | translate}}\n" +
    "                                    <ul>\n" +
    "                                        <li>{{'jao.job.script.param_info.2' | translate}}</li>\n" +
    "                                        <li>{{'jao.job.script.param_info.3' | translate}}</li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </details>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group op-align-horizontal\">\n" +
    "                        <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">{{'jao.common.host' | translate}}<span\n" +
    "                                op-help-info=\"{{'jao.job.script.host_info' | translate}}\"></span></label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <div class=\"w-full\">\n" +
    "                                <div class=\"opx-check-group opx-secondary btn-group\">\n" +
    "                                    <input type=\"radio\" name=\"hostsMode_{{$index}}\"\n" +
    "                                           ng-model=\"task.hostsMode\"\n" +
    "                                           id=\"hosts_by_param_{{$index}}\"\n" +
    "                                           value=\"param\"><label for=\"hosts_by_param_{{$index}}\"><i\n" +
    "                                        class=\"fa fa-brackets-curly\"></i> {{'jao.job.script.by_param' | translate}}</label>\n" +
    "                                    <input type=\"radio\" name=\"hostsMode_{{$index}}\"\n" +
    "                                           ng-model=\"task.hostsMode\"\n" +
    "                                           id=\"hosts_defined_{{$index}}\"\n" +
    "                                           value=\"\"><label for=\"hosts_defined_{{$index}}\"><i class=\"fa fa-list-ul\"></i>\n" +
    "                                    {{'jao.job.script.defined_param' | translate}}</label>\n" +
    "                                </div>\n" +
    "                                <div class=\"mt-3\" ng-if=\"task.hostsMode != 'param'\">\n" +
    "<!--                                    <jao-host-selector the-model=\"task.hosts\"></jao-host-selector>-->\n" +
    "                                    <acm-device-selector the-model=\"task.hosts\" mcheck-type=\"mcheckType\" ci-types=\"'[auto]'\"></acm-device-selector>\n" +
    "                                </div>\n" +
    "                                <div class=\"mt-3 d-flex\" ng-if=\"task.hostsMode == 'param'\">\n" +
    "                                    <!--                                    <select class=\"form-select w-auto\" ng-model=\"task.hostsType\" title=\"主机类型\">-->\n" +
    "                                    <!--                                        <option value=\"\">按主机</option>-->\n" +
    "                                    <!--                                        <option value=\"group\">按分组</option>-->\n" +
    "                                    <!--                                    </select>-->\n" +
    "                                    <label class=\"control-label w-auto ms-3\">{{'jao.job.script.param_name' | translate}}</label>\n" +
    "                                    <input type=\"text\" class=\"form-control op-w-sm\"\n" +
    "                                           ng-model=\"task.hostsParam\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                \n" +
    "                <div class=\"card-body\" ng-if=\"$ctrl.jobConfig.scriptType === 'template'\">\n" +
    "                    <div class=\"form-group op-align-horizontal mb-0\">\n" +
    "                        <label class=\"control-label font-weight-bold text-left\" style=\"width:4rem;\">\n" +
    "                            {{'cac.common.template' | translate}}\n" +
    "                            <!-- <span op-help-info=\"{{'jao.job.script.host_info' | translate}}\"></span> -->\n" +
    "                        </label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <aap-template-selector class=\"w-100\" the-model=\"task.template\"></aap-template-selector>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\" op-help-info=\"{{'jao.job.process.callback_info' | translate}}\">{{'jao.job.process.callback' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input class=\"form-control\" ng-model=\"$ctrl.jobConfig.callback\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\" op-help-info=\"{{'jao.job.process.timeout_info' | translate}}\">{{'jao.job.process.timeout' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <div class=\"input-group w-sm\">\n" +
    "                <input type=\"number\" ng-model=\"$ctrl.jobConfig.taskTimeout\" class=\"form-control\" min=\"-1\"\n" +
    "                       step=\"1\">\n" +
    "                <div class=\"input-group-append\"><span class=\"input-group-text\">{{'common.term.second' | translate}}</span></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "<!--        <label class=\"control-label\" ng-if=\"$ctrl.display > 10\">{{'jao.job.script.verbose' | translate}}</label>-->\n" +
    "<!--        <div class=\"form-control-wrapper d-inline-block\" ng-if=\"$ctrl.display > 10\">-->\n" +
    "<!--            <div class=\"input-group\" ng-click=\"$ctrl.jobConfig.verbosity = $ctrl.isVerbosity ? 1 : 0\">-->\n" +
    "<!--                <input type=\"checkbox\" ng-model=\"$ctrl.isVerbosity\" >-->\n" +
    "<!--            </div>-->\n" +
    "<!--        </div>-->\n" +
    "    </div>\n" +
    "    <div class=\"form-group\" ng-if=\"$ctrl.scriptEngine == 'aap'\">\n" +
    "        <label class=\"control-label\"\n" +
    "               op-help-info=\"aap执行容器镜像\">aap执行环境</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select aria-label=\"选择输入\" class=\"form-select op-w-auto\"\n" +
    "                    ng-model=\"$ctrl.jobConfig.executionEnvironment\"\n" +
    "                    ng-options=\"ee.id as ee.name for ee in $ctrl.executionEnvironments\">\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\"\n" +
    "               op-help-info=\"{{'jao.job.script.verbose_info' | translate}}\">{{'jao.job.script.verbose' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select ng-model=\"$ctrl.jobConfig.verbosity\" id=\"template-verbosity\" aria-label=\"选择输入\"\n" +
    "                    class=\"form-select op-w-auto\">\n" +
    "                <option class=\"\" value=0>{{'jao.job.run.ansible.verbose.normal' | translate}}</option>\n" +
    "                <option class=\"\" value=1>{{'jao.job.run.ansible.verbose.detailed' | translate}}</option>\n" +
    "                <option class=\"\" value=2>{{'jao.job.run.ansible.verbose.more_details' | translate}}</option>\n" +
    "                <option class=\"\" value=3>{{'jao.job.run.ansible.verbose.debug' | translate}}</option>\n" +
    "                <option class=\"\" value=4>{{'jao.job.run.ansible.verbose.connection_debugging' | translate}}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</fieldset>\n" +
    "")

$templateCache.put("app/modules/jao/script-test-run.html","<div class=\"op-bold-label\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <strong>{{$ctrl.fileInfo.path}}</strong>\n" +
    "            <span class=\"text-muted ms-3\" ng-if=\"$ctrl.fileInfo.config\">{{$ctrl.fileInfo.config}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"$ctrl.fileParams | isNotEmpty\" class=\"form-group\">\n" +
    "        <table class=\"table op-param-table\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th class=\"font-weight-bold\">{{'jao.job.script.param_settings' | translate}}</th>\n" +
    "                <th></th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"(name, value) in $ctrl.fileParams track by $index\">\n" +
    "                <td class=\"text-right\"><span class=\"badge bg-secondary op-text-normal\">{{name}}</span></td>\n" +
    "                <td class=\"w-100\"><input type=\"text\" class=\"form-control\" ng-model=\"$ctrl.fileParams[name]\"></td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\"\n" +
    "               op-help-info=\"{{'jao.job.script.verbose_info' | translate}}\">{{'jao.job.script.verbose' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select ng-model=\"$ctrl.verbosity\" id=\"template-verbosity\" aria-label=\"选择输入\"\n" +
    "                    class=\"form-select op-w-auto\">\n" +
    "                <option class=\"\" value=0>{{'jao.job.run.ansible.verbose.normal' | translate}}</option>\n" +
    "                <option class=\"\" value=1>{{'jao.job.run.ansible.verbose.detailed' | translate}}</option>\n" +
    "                <option class=\"\" value=2>{{'jao.job.run.ansible.verbose.more_details' | translate}}</option>\n" +
    "                <option class=\"\" value=3>{{'jao.job.run.ansible.verbose.debug' | translate}}</option>\n" +
    "                <option class=\"\" value=4>{{'jao.job.run.ansible.verbose.connection_debugging' | translate}}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{'jao.job.script.test_hosts' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <acm-device-selector the-model=\"$ctrl.hosts\" class=\"w-100\"\n" +
    "                                 options=\"{label:('jao.job.script.select_hosts' | translate)}\"\n" +
    "                                 ci-types=\"'[auto]'\"></acm-device-selector>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"d-flex align-items-center\" id=\"js-script-test-run\">\n" +
    "        <div class=\"ms-auto\">\n" +
    "    <span ng-if=\"!!$ctrl.jobStatus.title\"\n" +
    "          class=\"me-3 op-cursor-hand jao-jobrun-status-icon status-{{$ctrl.jobStatus.name}}\"\n" +
    "          title=\"{{$ctrl.jobStatus.title}}\"\n" +
    "          ng-click=\"$ctrl.viewRunResult()\"></span>\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"$ctrl.submit()\"\n" +
    "                    ng-disabled=\"$ctrl.isRunning\"><i\n" +
    "                    class=\"fa fa-chevron-right fa-fw\"></i> {{'jao.job.run' | translate}}\n" +
    "            </button>\n" +
    "            <button type=\"button\" class=\"btn btn-default opx-btn-cancel ms-3\" ng-click=\"$ctrl.cancel()\">\n" +
    "                {{'common.entity.action.close' | translate}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/widgets/approveList/job-approve-list.html","<div class=\"opx-layout-vflex\" uaa-is-authenticated uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item active opx-navbar-title\">{{$ctrl.title}}</li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <div uaa-has-permission=\"jao:edit:*\" class=\"dropdown ms-auto\">\n" +
    "            <div class=\"dropdown-menu dropdown-menu-left\">\n" +
    "                <a class=\"dropdown-item\" ng-repeat=\"(type,def) in $ctrl.jobTypeList\"\n" +
    "                   ui-sref=\"app.appman.job.create({type:type})\">\n" +
    "                    <i class=\"fa fa-fw {{def.icon}}\"></i>{{def.title}}</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <button ng-if=\"$ctrl.approveType === 'my'\" ng-click=\"$ctrl.deleteJob()\"\n" +
    "                class=\"btn btn-default opx-btn-flat ms-2\" title=\"{{'common.entity.action.delete' | translate}}\"\n" +
    "                ng-disabled=\"!$ctrl.tableConfig.selectedItems.length > 0\"><i class=\"fa fa-trash\"></i></button>\n" +
    "    </nav>\n" +
    "\n" +
    "    <opx-datatable table-config=\"$ctrl.tableConfig\" class=\"p-3\">\n" +
    "    </opx-datatable>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/widgets/approveModal/job-approve-modal.html","<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">{{'jao.index.approve' | translate}}</h3>\n" +
    "  <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" ng-click=\"$ctrl.dismiss()\"></button>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "  <!-- 提交审批界面 -->\n" +
    "  <form ng-if=\"$ctrl.needApprove || $ctrl.approveType === 'approve'\">\n" +
    "      <div class=\"form-group\" ng-if=\"$ctrl.appName\">\n" +
    "          <label class=\"control-label\">{{'jao.job.widget.applet' | translate}} :</label>\n" +
    "          <label class=\"control-label\">{{ $ctrl.appName | translate}}</label>\n" +
    "      </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{'jao.approve.detail.job_name' | translate}} :</label>\n" +
    "      <label class=\"control-label\">{{$ctrl.resolve.job.title}}</label>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{'jao.approve.detail.approve_mode' | translate}} :</label>\n" +
    "      <div class=\"form-control-wrapper d-inline-block\">\n" +
    "        <div class=\"opx-check-group opx-secondary btn-group\">\n" +
    "          <input type=\"radio\" name=\"job_approveMode\" value=\"noLimitParams\"\n" +
    "                ng-model=\"$ctrl.approve.approveMode\"\n" +
    "                ng-disabled=\"$ctrl.approveType === 'approve'\"\n" +
    "                id=\"job_approveMode_noLimitParams\">\n" +
    "          <label for=\"job_approveMode_noLimitParams\">{{'jao.approve.detail.no_limit_params' | translate}}</label>\n" +
    "          <input type=\"radio\" name=\"job_approveMode\" value=\"limitParams\"\n" +
    "                ng-model=\"$ctrl.approve.approveMode\"\n" +
    "                ng-if=\"$ctrl.paramsArr.length > 0\"\n" +
    "                ng-disabled=\"$ctrl.approveType === 'approve'\"\n" +
    "                id=\"job_approveMode_limitParams\">\n" +
    "          <label for=\"job_approveMode_limitParams\" ng-if=\"$ctrl.paramsArr.length > 0\">{{'jao.approve.detail.limit_params' | translate}}</label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"list-group\" ng-if=\"$ctrl.approve.approveMode === 'limitParams'\" style=\"margin: 1em 0 0 5em;\">\n" +
    "        <div ng-repeat=\"item in $ctrl.paramsArr\">\n" +
    "          <span class=\"badge bg-secondary text-light\"\n" +
    "                style=\"max-width:100%; overflow-wrap:break-word; white-space: pre-line; text-align: left; margin-bottom: 0.5em;\"\n" +
    "              >{{item[0]}} : {{item[1]}}\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"$ctrl.approve.jobId\">\n" +
    "      <label class=\"control-label\">{{ 'jao.job.type.script' | translate}} :</label>\n" +
    "      <div class=\"form-control-wrapper d-inline-block\">\n" +
    "          <a ui-sref=\"app.appman.job.view({id:$ctrl.approve.jobId,appletCode:$ctrl.approve.appletCode})\" target=\"_dialog\">\n" +
    "            <button type=\"button\" class=\"btn btn-outline-primary\"><i class=\"fa fa-eye\"></i> {{ 'common.action.view' | translate}}</button>\n" +
    "          </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\"  ng-if=\"$ctrl.approve.jobType === 'script'\" ng-repeat=\"scriptPath in $ctrl.scriptPathList\">\n" +
    "      <label class=\"control-label\">{{ 'gfs.modal.script_content' | translate}} :</label>\n" +
    "      <div class=\"form-control-wrapper d-inline-block\">\n" +
    "          <button type=\"button\" ng-click=\"$ctrl.goFile(scriptPath)\" class=\"btn btn-outline-primary\"><i class=\"fa fa-eye\" ></i>\n" +
    "              {{scriptPath}}</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"$ctrl.approve.approveMode !== 'limitParams'\">\n" +
    "      <label class=\"control-label\">{{'jao.approve.detail.valid_hour' | translate}} :</label>\n" +
    "      <div class=\"form-control-wrapper d-inline-block\">\n" +
    "        <div class=\"input-group w-sm\">\n" +
    "          <input type=\"number\" ng-model=\"$ctrl.approve.validHour\" class=\"form-control\" min=\"1\" max=\"999\"\n" +
    "                  step=\"1\" op-help-info=\"{{'jao.approve.detail.valid_hour_info' | translate}}\"\n" +
    "                  ng-disabled=\"$ctrl.approveType === 'approve'\">\n" +
    "          <div class=\"input-group-append\"><span class=\"input-group-text\">{{'common.term.hour' | translate}}</span></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{'common.entity.detail.description' | translate}} :</label>\n" +
    "      <div class=\"form-control-wrapper\">\n" +
    "        <textarea class=\"form-control\" ng-model=\"$ctrl.approve.description\" ng-disabled=\"$ctrl.approveType === 'approve'\" rows=\"3\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"$ctrl.approveType === 'approve' && $ctrl.approve.status > 0\">\n" +
    "      <label class=\"control-label\">{{'jao.approve.detail.expiration_time' | translate}} :</label>\n" +
    "      <div class=\"form-control-wrapper\">\n" +
    "        {{ (($ctrl.approve.expirationTime === 'expired') ? 'jao.approve.detail.expired' : ($ctrl.approve.expirationTime ? $ctrl.approve.expirationTime :  '-----')) | translate | date:'yyyy-MM-dd HH:mm:ss'}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"$ctrl.approveType === 'approve' && $ctrl.approve.status > 0\">\n" +
    "      <label class=\"control-label\">{{'jao.approve.detail.approver' | translate}} :</label>\n" +
    "      <div class=\"form-control-wrapper\">\n" +
    "        {{$ctrl.approve.approver}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"$ctrl.approveType === 'approve' && $ctrl.approve.status > 0\">\n" +
    "      <label class=\"control-label\">{{'jao.approve.detail.approve_time' | translate}} :</label>\n" +
    "      <div class=\"form-control-wrapper\">\n" +
    "        {{$ctrl.approve.approveTime | date:'yyyy-MM-dd HH:mm:ss' }}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "\n" +
    "  <div ng-if=\"!$ctrl.needApprove && $ctrl.approveType !== 'approve'\">\n" +
    "    <p>{{'jao.approve.tips.0' | translate}}</p>\n" +
    "    <p>{{'jao.approve.tips.1' | translate}}</p>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\" ng-if=\"$ctrl.approveType !== 'approve'\">\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" ng-click=\"$ctrl.dismiss()\">{{'common.entity.action.close' | translate}}</button>\n" +
    "\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"$ctrl.submitApprove()\"\n" +
    "            ng-if=\"$ctrl.needApprove\"> {{'jao.approve.submit_btn' | translate}}</button>\n" +
    "\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" ng-click=\"$ctrl.cancelApprove()\"\n" +
    "            ng-if=\"$ctrl.checkResult.isApproving && !$ctrl.needApprove\"\n" +
    "            ng-show=\"$ctrl.approveType === 'my'\">\n" +
    "            <i class=\"fa fa-times-circle\"></i> {{'jao.approve.cancel' | translate}}</button>\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"$ctrl.goToMyApprove()\"\n" +
    "            ng-if=\"$ctrl.checkResult.isApproving && !$ctrl.needApprove\"> {{'jao.approve.view_btn' | translate}}</button>\n" +
    "\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"$ctrl.reApprove()\"\n" +
    "            ng-if=\"$ctrl.checkResult.canReApprove && !$ctrl.needApprove\">\n" +
    "            <i class=\"fa fa-redo-alt\"></i> {{'jao.approve.re_approve_btn' | translate}}</button>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\" ng-if=\"$ctrl.approveType === 'approve'\">\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" ng-click=\"$ctrl.dismiss()\">\n" +
    "        {{'common.entity.action.close' | translate}}</button>\n" +
    "\n" +
    "    <button class=\"btn btn-success\" type=\"button\" ng-click=\"$ctrl.passApprove()\"\n" +
    "        ng-if=\"$ctrl.approve.status === 0\">\n" +
    "        <i class=\"fa fa-check-circle\"></i> {{'jao.approve.pass_approve' | translate}}</button>\n" +
    "    <button class=\"btn btn-danger\" type=\"button\" ng-click=\"$ctrl.refuseApprove()\"\n" +
    "        ng-if=\"$ctrl.approve.status === 0\">\n" +
    "        <i class=\"fa fa-minus-octagon\"></i> {{'jao.approve.refuse' | translate}}</button>\n" +
    "\n" +
    "    <button class=\"btn btn-danger\" type=\"button\" ng-click=\"$ctrl.discardApprove()\"\n" +
    "        ng-if=\"$ctrl.approve.status === 1 && $ctrl.approve.expirationTime !== 'expired'\">\n" +
    "        <i class=\"fa fa-minus-octagon\"></i> {{'jao.approve.discard' | translate}}</button>\n" +
    "</div>")

$templateCache.put("app/modules/jao/widgets/delayed/job-delayed.html","<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">{{'jao.job.detail.need_delayed' | translate}}</h3>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" ng-click=\"$ctrl.dismiss()\"></button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "    <input class=\"form-control ng-valid ng-not-empty ng-dirty ng-valid-date ng-touched\"\n" +
    "           step=1 type=\"datetime-local\"\n" +
    "           ng-model=\"$ctrl.cronTime\"  aria-invalid=\"false\" style=\"\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <!--<button class=\"btn btn-secondary\" type=\"button\" ng-click=\"$ctrl.pushJobToSchedule()\">{{'common.entity.action.cancel' | translate}}</button>-->\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"$ctrl.pushJobToSchedule()\"\n" +
    "            >{{'jao.job.detail.submit_delayed' | translate}}</button>\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"$ctrl.rungOnce()\"\n" +
    "    >{{'jao.job.detail.run_once' | translate}}</button>\n" +
    "</div>")

$templateCache.put("app/modules/jao/widgets/hostselector2/device-dynamic-selector.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"> {{'jao.messages.select_host' | translate}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\" style=\"pointer-events: auto;\"\n" +
    "            ng-click=\"$ctrl.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body cm-host-dialog\">\n" +
    "    <div >\n" +
    "        <select class=\"form-select col-sm-3\" ng-model=\"$ctrl.selectedStatus\"\n" +
    "                ng-options=\"status.title for status in $ctrl.statusList\">\n" +
    "         </select>\n" +
    "        <div class=\"opx-flex-fill table-responsive\">\n" +
    "            <table id=\"flow-host-table\" class=\"cm-table table opx-table\"></table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer text-right\">\n" +
    "    <button type=\"reset\" class=\"btn btn-default\" ng-click=\"$ctrl.cancel()\">{{'common.entity.action.cancel' | translate}}</button>\n" +
    "    <button type=\"submit\" class=\"btn btn-success\" ng-click=\"$ctrl.confirm()\">{{'common.entity.action.confirm' | translate}}</button>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/jao/widgets/hostselector2/device-selector-widget-config.html","<uib-tabset class=\"tab-container\">\n" +
    "    <uib-tab>\n" +
    "        <uib-tab-heading><i class='fa fa-cog'></i> {{'jao.job.detail.base' | translate}}</uib-tab-heading>\n" +
    "        <!--        <div class=\"form-group\">-->\n" +
    "        <!--            <label class=\"control-label\">选项</label>-->\n" +
    "        <!--            <div class=\"form-control-wrapper\">-->\n" +
    "        <!--                <div class=\"checkbox checkbox-inline checkbox-primary\">-->\n" +
    "        <!--                    <input type=\"checkbox\" ng-model=\"uwProps.core.multipleSelect\"-->\n" +
    "        <!--                           id=\"js_hswc_multipleselect\"><label for=\"js_hswc_multipleselect\">允许多选</label>-->\n" +
    "        <!--                </div>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </div>-->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">{{'jao.job.selector.sync_param' | translate}}</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"uwProps.core.exportParam\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">{{'jao.job.selector.param_type' | translate}}</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <select class=\"form-select\" ng-model=\"uwProps.core.exportType\">\n" +
    "                    <option value=\"string\">{{'common.entity.variable.string' | translate}}</option>\n" +
    "                    <option value=\"array\">{{'common.entity.variable.array' | translate}}</option>\n" +
    "                    <option value=\"map\">{{'jao.job.selector.param_type.map' | translate}}</option>\n" +
    "                    <!--                    <option value=\"object\" ng-if=\"!uwProps.core.multipleSelect\">单个对象</option>-->\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">{{'jao.job.selector.device_type' | translate}}</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <select class=\"form-select\" ng-model=\"uwProps.core.assetType\"  op-select multiple ng-options=\"mode.value as mode.title for mode in selectCIT\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-show=\"false\">\n" +
    "            <label class=\"control-label\">{{'jao.job.selector.data_type' | translate}}</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <select class=\"form-select\" ng-model=\"uwProps.core.dataType\">\n" +
    "                    <option value=\"all\">{{'jao.job.selector.data_type.all' | translate}}</option>\n" +
    "                    <option value=\"auto\">{{'jao.job.selector.data_type.auto' | translate}}</option>\n" +
    "                    <option value=\"no_auto\">{{'jao.job.selector.data_type.no_auto' | translate}}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--        <div class=\"form-group\">-->\n" +
    "        <!--            <label class=\"control-label\"></label>-->\n" +
    "        <!--            <div class=\"form-control-wrapper\">-->\n" +
    "        <!--                <div class=\"checkbox checkbox-inline\">-->\n" +
    "        <!--                    <input type=\"checkbox\" ng-model=\"uwProps.core.rememberSelection\" id=\"js_hswc_rememberselection\"><label for=\"js_hswc_rememberselection\">记住上次选择</label>-->\n" +
    "        <!--                </div>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </div>-->\n" +
    "    </uib-tab>\n" +
    "    <!--    <uib-tab>-->\n" +
    "    <!--        <uib-tab-heading><i class='fa fa-random'></i> {{'udp.wc.tab.interaction'|translate}}</uib-tab-heading>-->\n" +
    "    <!--    </uib-tab>-->\n" +
    "    <!--    <uib-tab>-->\n" +
    "    <!--        <uib-tab-heading><i class='fa fa-lock'></i> 访问控制</uib-tab-heading>-->\n" +
    "    <!--    </uib-tab>-->\n" +
    "    <uib-tab>\n" +
    "        <uib-tab-heading><i class='fa fa-paint-brush'></i> {{'jao.log.style' | translate}}</uib-tab-heading>\n" +
    "        <udp-widget-config-display options=\"{palette:false}\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'common.term.tag' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" class=\"form-control op-w-sm\" ng-model=\"uwProps.display.label\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--            <div class=\"form-group\">-->\n" +
    "            <!--                <label class=\"control-label\">显示模式</label>-->\n" +
    "            <!--                <div class=\"form-control-wrapper\">-->\n" +
    "            <!--                    <select class=\"form-select op-w-sm\" ng-model=\"uwProps.display.viewMode\">-->\n" +
    "            <!--                        <option value=\"btnpop\">按钮和弹框</option>-->\n" +
    "            <!--                        <option value=\"grouplist\">分组选择列表</option>-->\n" +
    "            <!--                        <option value=\"taglist\">标签选择列表</option>-->\n" +
    "            <!--                        <option value=\"hostselectlist\">分组和主机选择列表</option>-->\n" +
    "            <!--                    </select>-->\n" +
    "            <!--                </div>-->\n" +
    "            <!--            </div>-->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'jao.job.selector.display_mode' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <select class=\"form-select op-w-sm\" ng-model=\"uwProps.display.viewAs\"\n" +
    "                            ng-options=\"mode.value as mode.title for mode in viewModeDefs\">\n" +
    "                        <option value=\"\"></option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--            <div class=\"form-group\">-->\n" +
    "            <!--                <label class=\"control-label\">选择方式</label>-->\n" +
    "            <!--                <div class=\"form-control-wrapper\">-->\n" +
    "            <!--                    <div class=\"opx-check-group btn-group\">-->\n" +
    "            <!--                        <input ng-repeat-start=\"(mode,def) in selectModeDefs track by $index\" type=\"checkbox\"-->\n" +
    "            <!--                               value=\"{{mode}}\" id=\"form-check-{{$index}}\"-->\n" +
    "            <!--                               ng-model=\"checkedModes\">-->\n" +
    "            <!--                        <label ng-repeat-end for=\"form-check-{{$index}}\">{{def.title}}</label>-->\n" +
    "            <!--                    </div>-->\n" +
    "            <!--                </div>-->\n" +
    "            <!--            </div>-->\n" +
    "        </udp-widget-config-display>\n" +
    "    </uib-tab>\n" +
    "    <uib-tab>\n" +
    "        <uib-tab-heading><i class='fa fa-random'></i> {{'jao.job.selector.interaction_settings' | translate}}</uib-tab-heading>\n" +
    "        <udp-widget-config-interaction the-model=\"uwProps.interaction\"\n" +
    "                                       options=\"{supports:'page,param',enableAutoActive:true}\"\n" +
    "                                       param-vars=\"mapValue\">\n" +
    "        </udp-widget-config-interaction>\n" +
    "    </uib-tab>\n" +
    "    <uib-tab heading=\"{{'jao.log.props_code' | translate}}\">\n" +
    "        <udp-widget-props-viewer the-model=\"uwProps\"></udp-widget-props-viewer>\n" +
    "    </uib-tab>\n" +
    "</uib-tabset>")

$templateCache.put("app/modules/jao/widgets/hostselector2/jao-device-selector.html","<div ng-if=\"$ctrl.theHosts.length>0\">\n" +
    "    <div class=\"d-flex flex-nowrap align-items-center\">\n" +
    "        <div class=\"btn btn-sm btn-default d-inline-block op-hover-trigger\" style=\"position:relative;width:10em;\">\n" +
    "            <span class=\"op-hover-to-show pull-right\" ng-click=\"$ctrl.clearAll()\" title=\"{{'jao.flow.detail.remove_all' | translate}}\"><i\n" +
    "                class=\"fa fa-times\"></i></span>\n" +
    "            <span class=\"d-block\"\n" +
    "                  ng-click=\"$ctrl.openSelectorDialog()\">{{'jao.flow.in_total' | translate:{ count: $ctrl.theHosts.length } }}</span>\n" +
    "        </div>\n" +
    "        <!--        <div class=\"btn-group\">-->\n" +
    "        <!--            <button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"$ctrl.openSelectorDialog()\">共<strong>{{$ctrl.theHosts.length}}</strong>项-->\n" +
    "        <!--            </button>-->\n" +
    "        <!--            <button type=\"button\" class=\"btn btn-sm btn-default\" ng-click=\"$ctrl.clearAll()\" title=\"移除所有\"><i-->\n" +
    "        <!--                    class=\"fa fa-times\"></i></button>-->\n" +
    "        <!--        </div>-->\n" +
    "        <op-searchbox search-text=\"$ctrl.filter\" class=\"ms-auto autohide\"></op-searchbox>\n" +
    "    </div>\n" +
    "    <ul class=\"list list-unstyled list-inline\" style=\"max-height:10rem; overflow-y:auto;\">\n" +
    "        <li ng-repeat=\"host in $ctrl.theHosts | filter: $ctrl.filter track by $index\"\n" +
    "            class=\"op-hover-trigger mb-3\">\n" +
    "            <div class=\"badge bg-secondary op-text-normal op-cursor-default py-2 px-2\">{{$ctrl.options.useString?host:host.key}}\n" +
    "                <a ng-click=\"$ctrl.removeItem($index)\" class=\"text-muted op-hover-to-show\"></a></div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.theHosts.length===0\" class=\"op-blank-slate bg-light p-3\">\n" +
    "    <div class=\"op-blank-slate-icon\"><i class=\"fal fa-server\" style=\"font-size:4rem;\"></i></div>\n" +
    "    <div>\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"$ctrl.openSelectorDialog()\">{{'jao.job.selector.select_device' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/jao/widgets/job/job-widget-config.html","<uib-tabset class=\"tab-container\">\n" +
    "    <uib-tab>\n" +
    "        <uib-tab-heading><i class='fa fa-database'></i> {{'udp.wc.tab.data' | translate}}</uib-tab-heading>\n" +
    "        <jao-job-selector the-model=\"uwProps.job.id\" selected-job=\"selectedJob\"></jao-job-selector>\n" +
    "        <udp-params-control-config the-model=\"uwProps.wparams\" options=\"{labelByDefault:true}\"\n" +
    "                                   params-config=\"selectedJob.$paramsConfig\"></udp-params-control-config>\n" +
    "    </uib-tab>\n" +
    "    <uib-tab>\n" +
    "        <uib-tab-heading><i class='fa fa-random'></i> {{'jao.job.selector.interaction_settings' | translate}}\n" +
    "        </uib-tab-heading>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">{{'jao.messages.need_submit_confirm' | translate}}</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <div class=\"input-group-text\"><input type=\"checkbox\"\n" +
    "                                                         ng-model=\"uwProps.display.confirm\"></div>\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"uwProps.display.confirmText\"\n" +
    "                           ng-disabled=\"!uwProps.display.confirm\"\n" +
    "                           placeholder=\"{{'jao.messages.confirm_dialog_msg' | translate}}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <div class=\"checkbox checkbox-inline\"><input type=\"checkbox\" ng-model=\"uwProps.intx.showOutput\"\n" +
    "                                                             id=\"jwc_showoutput\"><label for=\"jwc_showoutput\"\n" +
    "                                                                                        op-help-info=\"{{'jao.job.widget.show_output_desc'|translate}}\">{{'jao.job.widget.show_output' | translate}}</label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <fieldset>\n" +
    "            <legend>{{'jao.job.widget.after' | translate}}</legend>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <select class=\"form-select op-w-sm\" ng-model=\"uwProps.interaction.when\">\n" +
    "                        <option value=\"\">{{'jao.job.widget.after.run' | translate}}</option>\n" +
    "                        <option value=\"completed\">{{'jao.job.widget.after.completed' | translate}}</option>\n" +
    "                        <!--                        <option value=\"error\">{{'jao.job.widget.after.error' | translate}}</option>-->\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <udp-widget-config-interaction the-model=\"uwProps.interaction\"\n" +
    "                                           options=\"{supports:'page,param,event,func'}\"\n" +
    "                                           param-vars=\"\">\n" +
    "            </udp-widget-config-interaction>\n" +
    "        </fieldset>\n" +
    "    </uib-tab>\n" +
    "    <uib-tab>\n" +
    "        <uib-tab-heading><i class='fa fa-paint-brush'></i> {{'jao.log.style' | translate}}</uib-tab-heading>\n" +
    "        <udp-widget-config-display>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{'jao.job.widget.form_layout' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <select class=\"form-select w-sm\" ng-model=\"uwProps.display.formLayout\">\n" +
    "                        <option value=\"horizontal\">{{'jao.job.widget.form_layout.horizontal' | translate}}</option>\n" +
    "                        <option value=\"vertical\">{{'jao.job.widget.form_layout.vertical' | translate}}</option>\n" +
    "                        <option value=\"inline\">{{'jao.job.widget.form_layout.inline' | translate}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--            <div class=\"form-group\" ng-if=\"uwProps.display.formLayout!=='inline'\">-->\n" +
    "            <!--                <label class=\"control-label\">列数</label>-->\n" +
    "            <!--                <div class=\"form-control-wrapper op-w-sm\">-->\n" +
    "            <!--                    <input type=\"number\" class=\"form-control\" ng-model=\"uwProps.display.columns\" min=\"1\" max=\"3\">-->\n" +
    "            <!--                </div>-->\n" +
    "            <!--            </div>-->\n" +
    "            <fieldset>\n" +
    "                <legend>{{'jao.job.widget.button_style' | translate}}</legend>\n" +
    "                <udp-button-style-config ng-model=\"uwProps.display.buttons.ok\"></udp-button-style-config>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">{{'jao.job.widget.button_pos' | translate}}</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <select class=\"form-select op-w-sm\" ng-model=\"uwProps.display.buttons.position\">\n" +
    "                            <option value=\"left\">{{'jao.job.widget.button_pos.left' | translate}}</option>\n" +
    "                            <option value=\"center\">{{'jao.job.widget.button_pos.center' | translate}}</option>\n" +
    "                            <option value=\"right\">{{'jao.job.widget.button_pos.right' | translate}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "        </udp-widget-config-display>\n" +
    "    </uib-tab>\n" +
    "    <uib-tab heading=\"{{'jao.log.props_code' | translate}}\">\n" +
    "        <udp-widget-props-viewer the-model=\"uwProps\"></udp-widget-props-viewer>\n" +
    "    </uib-tab>\n" +
    "</uib-tabset>")

$templateCache.put("app/modules/jao/widgets/jobParam/job-param.html","<div class=\"op-smartform form-vertical op-bold-label col-sm-12 ms-1\">\n" +
    "  <div class=\"form-group\" ng-repeat=\"param in $ctrl.paramsFake track by $index\" >\n" +
    "    <udp-input  ng-if=\"param.type !== 'host' && !param.dcSelector\"\n" +
    "                datatype=\"string\" \n" +
    "                label=\"{{ param.label || param.name || Object.entries(param)[0] }}\" \n" +
    "                showlabel=\"true\" \n" +
    "                desc=\"{{ (param.description || param.desc).startsWith('uw-prop=') ? '' : (param.description || param.desc) }}\"\n" +
    "                showdesc=\"true\" \n" +
    "                ng-model=\"$ctrl.theModel[param.name]\" \n" +
    "                the-config=\"{rows: 1}\"\n" +
    "                ismultiple=\"{{ param.uWidgetProp ? param.uWidgetProp.ismultiple : false }}\"\n" +
    "                sourcedef=\"{{ param.uWidgetProp ? param.uWidgetProp.sourcedef : '' }}\"\n" +
    "                control=\"{{ param.uWidgetProp ? param.uWidgetProp.control : (param.type === 'string_pwd' ? 'password' : 'textarea') }}\"\n" +
    "                readonly=\"{{ $ctrl.readonly }}\">\n" +
    "    </udp-input>\n" +
    "\n" +
    "    <label ng-if=\" param.dcSelector \">{{ param.label || param.name || Object.entries(param)[0] || param.dcSelector.name | translate }}</label>\n" +
    "    <dc-selector  options=\"param.dcSelector\"\n" +
    "                  ng-if=\" param.dcSelector \"\n" +
    "                  the-model=\"$ctrl.theModel[param.name]\"\n" +
    "                  readonly=\"$ctrl.readonly\">\n" +
    "    </dc-selector>\n" +
    "\n" +
    "    <label ng-if=\" param.type === 'host' \">Hosts</label>\n" +
    "    <acm-device-selector  view-as=\"btndlg\" ci-types=\"'[auto]'\"\n" +
    "                          ng-if=\" param.type === 'host' \"\n" +
    "                          the-model=\"$ctrl.theModel[param.name]\"\n" +
    "                          readonly=\"$ctrl.readonly\">\n" +
    "    </acm-device-selector>\n" +
    "\n" +
    "  </div>\n" +
    "</div>")
}]);
})();