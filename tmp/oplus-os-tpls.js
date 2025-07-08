//HEAD 
(function(app) {
try { app = angular.module("oplus.os"); }
catch(err) { app = angular.module("oplus.os", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/os/flow/flow-edit.html","<div class=\"opx-layout-vflex\" uaa-has-permission=\"{{$ctrl.pagePermission}}\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <span class=\"opx-navbar-title\">{{'jao.flow.edit' | translate}}</span>\n" +
    "        <div class=\"ms-auto\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary opx-btn-ok\"\n" +
    "                    ng-click=\"$ctrl.save()\" ng-if=\"!$ctrl.isInstance\"\n" +
    "                    ng-disabled=\"flowForm.$invalid\" uaa-has-permission=\"jao:edit:*\">{{'common.entity.action.save' | translate}}\n" +
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
    "                            <!--  TODO:update this's selector  -->\n" +
    "                            <acm-device-selector the-model=\"$ctrl.flow.hosts\" ci-types=\"'[auto]'\" mcheck-type=\"'map'\"></acm-device-selector>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "        <!--  TODO:暂时只考虑脚本作业 -->\n" +
    "        <fieldset ng-disabled=\"$ctrl.isInstance\">\n" +
    "            <legend>{{'jao.flow.detail.step_settings' | translate}}</legend>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"d-flex mb-3\">\n" +
    "                    <label class=\"control-label\" ng-click=\"$ctrl.changeStepFold()\">{{'jao.flow.detail.step' | translate}}\n" +
    "                        <i class=\"fa fa-angle-double-down\" ng-if=\"!$ctrl.isFoldAllSteps\"></i>\n" +
    "                        <i class=\"fa fa-angle-double-left\" ng-if=\"$ctrl.isFoldAllSteps\"></i>\n" +
    "                    </label>\n" +
    "                    <button class=\"btn btn-sm btn-default ms-3\"\n" +
    "                            ng-click=\"$ctrl.addStep()\"><i class=\"text-primary fa fa-plus-circle\"></i> {{'jao.flow.detail.step.create' | translate}}\n" +
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
    "                                                       model-converter=\"{type: 'attrmap', attrmap: {'location': 'path', 'argline': 'config'}, modelType: 'array'}\"\n" +
    "                                                       config=\"$ctrl.fileSelectorConfig\"></gfs-file-selector>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group op-align-horizontal\">\n" +
    "                                <label class=\"control-label\">{{'jao.job.script.verbose' | translate}}</label>\n" +
    "                                <div class=\"form-control-wrapper\">\n" +
    "                                    <div class=\"checkbox checkbox-primary\">\n" +
    "                                        <input type=\"checkbox\" ng-model=\"step.config.verbosity\" id=\"je_verbosity\"\n" +
    "                                               class=\"ng-pristine ng-untouched ng-valid ng-empty\" aria-invalid=\"false\">\n" +
    "                                        <label for=\"je_verbosity\"></label>\n" +
    "                                    </div>\n" +
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
    "                                        <div class=\"input-group-append\"><span class=\"input-group-text\">{{'common.term.second' | translate}}</span></div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "        <fieldset>\n" +
    "            <legend>{{'jao.job.detail.params' | translate}}<span op-help-info=\"{{'jao.job.detail.params_info' | translate}}\"></span></legend>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"d-flex\">\n" +
    "                    <button class=\"btn btn-sm btn-default\" title=\"{{'jao.job.detail.analysis_param_info' | translate}}\"\n" +
    "                            ng-click=\"$ctrl.addParamAuto()\"><i class=\"fa fa-brackets-curly text-primary\"></i>\n" +
    "                        {{'jao.job.detail.analysis_param' | translate}}\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-sm btn-default opx-btn-icon ms-auto\" title=\"{{'jao.job.detail.add_param' | translate}}\">\n" +
    "                        <i class=\"fa fa-plus\" ng-click=\"$ctrl.addParam()\"></i></button>\n" +
    "                </div>\n" +
    "                <table class=\"op-param-table table\" ng-if=\"$ctrl.flow.globalParams|isNotEmpty\">\n" +
    "                    <thead>\n" +
    "                    <tr>\n" +
    "                        <th>{{'jao.job.detail.params' | translate}}</th>\n" +
    "                        <th>{{'jao.job.detail.display_name' | translate}}</th>\n" +
    "                        <th>{{'common.entity.detail.description' | translate}}</th>\n" +
    "                        <th op-help-info=\"{{'jao.job.detail.default_info' | translate}}\">{{'jao.job.detail.default' | translate}}</th>\n" +
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
    "                            <button class=\"btn btn-sm btn-default opx-btn-icon \" title=\"{{'jao.job.detail.delete_param' | translate}}\"\n" +
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

$templateCache.put("app/modules/os/flow/flow-host-view.html","<div class=\"modal-header\">\n" +
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

$templateCache.put("app/modules/os/flow/flow-instance-list.html","<div class=\"wrapper h-100\">\n" +
    "    <div class=\"table-responsive\">\n" +
    "        <table id=\"jaoFlowInstanceTable\" class=\"table opx-table\"></table>\n" +
    "    </div>\n" +
    "    <!--<div class=\"op-blank-slate\" ng-if=\"$ctrl.instances===null\">-->\n" +
    "        <!--<div class=\"op-blank-slate-icon\"><i class=\"fa fa-cog fa-spin fa-4x\"></i></div>-->\n" +
    "        <!--<p>没有数据</p>-->\n" +
    "    <!--</div>-->\n" +
    "    <div  class=\"op-blank-slate\" ng-if=\"$ctrl.instances===null\">\n" +
    "        <div class=\"op-blank-slate-icon\"><i class=\"fa fa-cog fa-spin fa-4x\"></i></div>\n" +
    "        <p>{{'common.entity.loading' | translate}}</p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "")

$templateCache.put("app/modules/os/flow/flow-instance-view.html","<style>\n" +
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
    "            <div class=\"opx-flex-fill wrapper\">\n" +
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

$templateCache.put("app/modules/os/flow/flow-list.html","<div class=\"opx-layout-hflex\" uaa-is-authenticated uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\">\n" +
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
    "            <button type=\"button\" class=\"btn btn-default btn-sm opx-btn-icon\" ng-click=\"$ctrl.createFlow()\"\n" +
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
    "                    <div ui-sref=\"app.os.flow_list.instance_list({id: flow.id})\" ng-click=\"$ctrl.changeActiveFlow(flow)\">\n" +
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
    "    <div class=\"opx-flex-fill fade-in\" ui-view=\"flowDetailView\">\n" +
    "        <div class=\"h-100 bg-light op-blank-slate\">\n" +
    "            <div class=\"op-blank-slate-icon\">\n" +
    "                <i class=\"fa fa-inbox op-fa-8x\"></i>\n" +
    "            </div>\n" +
    "            <p>{{'jao.flow.view' | translate}}</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/os/flow/flow-step.html","<div class=\"opx-layout-vflex\">\n" +
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
    "                    <fieldset ng-disabled=\"true\" class=\"card-body\">\n" +
    "                        <div class=\"form-group op-align-horizontal\">\n" +
    "                            <label class=\"control-label font-weight-bold text-left\" style=\"width:10rem;\">{{'jao.flow.detail.auto_next' | translate}}</label>\n" +
    "                            <div class=\"form-control-wrapper\">\n" +
    "                                <div class=\"checkbox checkbox-primary\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"$ctrl.step.autoNext\" id=\"je_secret_0\" class=\"ng-pristine ng-untouched ng-valid ng-empty\" aria-invalid=\"false\">\n" +
    "                                    <label for=\"je_secret_0\"></label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group op-align-horizontal\" ng-if=\"$ctrl.step.type == 'script'\">\n" +
    "                            <label class=\"control-label font-weight-bold text-left\" style=\"width:10rem;\">{{'jao.common.script' | translate}}</label>\n" +
    "                            <div class=\"form-control-wrapper\">\n" +
    "                                <gfs-file-selector the-model=\"$ctrl.step.config.tasks[0].scripts\" class=\"w-full\"\n" +
    "                                                   model-converter=\"{type: 'attrmap', attrmap: {'location': 'path', 'argline': 'config'}, modelType: 'array'}\"\n" +
    "                                                   config=\"$ctrl.fileSelectorConfig\"></gfs-file-selector>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group op-align-horizontal\">\n" +
    "                            <label class=\"control-label font-weight-bold text-left\" style=\"width:10rem;\">{{'jao.job.script.verbose' | translate}}</label>\n" +
    "                            <div class=\"checkbox checkbox-primary\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"$ctrl.step.config.verbosity\" id=\"je_verbosity\" class=\"ng-pristine ng-untouched ng-valid ng-empty\" aria-invalid=\"false\">\n" +
    "                                <label for=\"je_verbosity\"></label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group op-align-horizontal\">\n" +
    "                            <label class=\"control-label font-weight-bold text-left\" style=\"width:10rem;\"\n" +
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

$templateCache.put("app/modules/os/os-index.html","<div class=\"opx-layout-hflex\">\n" +
    "    <div class=\"opx-sidebar bg-light\">\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <div class=\"opx-treenav\">\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.os.list\" ui-sref-active=\"active\"><i\n" +
    "                            class=\"fad fa-water fa-fw\"></i> 首页</a>\n" +
    "                </div>\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.os.flow_list\" ui-sref-active=\"active\"><i class=\"fad fa-hand-paper fa-fw\"></i>\n" +
    "                        流程编辑</a>\n" +
    "                </div>\n" +
    "<!--                <div class=\"opx-treenav-item\">-->\n" +
    "<!--                    <a ui-sref=\"app.jao.jobApprove\" ui-sref-active=\"active\"><i class=\"fad fa-clipboard-check fa-fw\"></i>-->\n" +
    "<!--                        流程审核</a>-->\n" +
    "<!--                </div>-->\n" +
    "                <div class=\"opx-treenav-item\">\n" +
    "                    <a ui-sref=\"app.os.runlogs\" ui-sref-active=\"active\"><i class=\"fad fa-history fa-fw\"></i>\n" +
    "                        操作记录</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill fade-in\" ui-view=\"osMainView\">\n" +
    "        <div class=\"opx-align-center\">\n" +
    "            <div class=\"rounded-circle bg-secondary opx-align-center\"\n" +
    "                 style=\"width:10rem;height:10rem;opacity: .5;\"><i\n" +
    "                    class=\"text-light fad fa-fw fa-7x fa-oplus-jao\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/os/os-list.html","<div class=\"opx-layout-vflex\">\n" +
    "    <div class=\"scroll-y opx-flex-fill p-3\">\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-body\">\n" +
    "                <udp-page-view class=\"flex-fill scroll-y\" page-id=\"'/os/assets/os-index'\"\n" +
    "                               options=\"{navbar:false}\"></udp-page-view>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "")
}]);
})();