//HEAD 
(function(app) {
try { app = angular.module("oplus.acm"); }
catch(err) { app = angular.module("oplus.acm", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/acm/acm-ci-data-view.html","<form class=\"op-smartform form-vertical\">\n" +
    "    <umd-data-view the-data=\"$ctrl.theData\" model-def=\"$ctrl.theModel\" options=\"{editMode:$ctrl.editMode}\"></umd-data-view>\n" +
    "    <div ng-if=\"$ctrl.editMode\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary opx-btn-ok\" ng-click=\"$ctrl.save($ctrl.theData)\"  uaa-has-permission=\"acm:edit:*\">{{ 'common.entity.action.save' | translate}}</button>\n" +
    "    </div>\n" +
    "</form>")

$templateCache.put("app/modules/acm/acm-ci-filter.html","<div ng-if=\"!$ctrl.showResult\" class=\"form op-smartform\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{ 'acm.common.filter.attr' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select op-select class=\"form-select\" ng-model=\"$ctrl.attrCode\">\n" +
    "                <option value=\"IP\">IP</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">{{ 'acm.common.filter.match_data' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <textarea class=\"form-control\" rows=\"10\" ng-model=\"$ctrl.searchText\"></textarea>\n" +
    "            <p class=\"help-block\">{{ 'acm.common.filter.match_comment' | translate}}</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"from-group op-align-horizontal\">\n" +
    "        <label class=\"control-label\">{{ 'acm.common.filter.other_separator' | translate}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <div class=\"checkbox checkbox-inline\" ng-repeat=\"delim in $ctrl.delimDefs track by $index\">\n" +
    "                <input type=\"checkbox\" id=\"aas-delim-{{$index}}\" multiple\n" +
    "                       checkbox-model=\"$ctrl.searchDelims\" checkbox-value=\"delim.value\">\n" +
    "                <label for=\"aas-delim-{{$index}}\">{{delim.label}}</label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <button type=\"button\" ng-click=\"$ctrl.doSearch()\" class=\"btn btn-primary\" ng-disabled=\"!$ctrl.searchText\"><i\n" +
    "                class=\"fa fa-search\"></i> {{ 'acm.common.filter.finding' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.showResult\">\n" +
    "    <div class=\"alert alert-danger mb-3\" ng-if=\"$ctrl.notFounds.length>0\">\n" +
    "        {{ 'acm.common.filter.data_not_found' | translate}}\n" +
    "        <ul class=\"mb-0 list list-unstyled\">\n" +
    "            <li ng-repeat=\"item in $ctrl.notFounds\">{{item}}</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <umd-data-view view-type=\"'selector'\" the-data=\"$ctrl.searchResult\" model-def=\"$ctrl.assetModel\"></umd-data-view>\n" +
    "    <!--    <opx-datatable table-config=\"$ctrl.tableConfig\">-->\n" +
    "    <button type=\"button\" ng-click=\"$ctrl.showResult=false\" class=\"btn btn-outline-primary mb-3\">{{ 'acm.common.filter.enter_again' | translate}}</button>\n" +
    "    <!--    </opx-datatable>-->\n" +
    "</div>")

$templateCache.put("app/modules/acm/acm-ci-model-config.html","<form class=\"op-smartform form-vertical\" name=\"modelConfigForm\">\n" +
    "    <uib-tabset class=\"tab-container\" type=\"mdc-op\">\n" +
    "        <uib-tab>\n" +
    "            <uib-tab-heading>{{ 'acm.common.header.base_info' | translate}}</uib-tab-heading>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{ 'acm.common.header.assert_code' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" ng-model=\"$ctrl.modelConfig.code\" class=\"form-control\"\n" +
    "                           ng-disabled=\"$ctrl.DISABLE_CODE\"\n" +
    "                           ng-class=\"{'is-invalid':$ctrl.VALIDATE_CODE_ERROR}\">\n" +
    "                    <div class=\"invalid-feedback\"\n" +
    "                         ng-if=\"$ctrl.VALIDATE_CODE_ERROR\">\n" +
    "                        {{ 'acm.common.text.assert_code_validate_comment' | translate}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{ 'acm.common.header.model_name' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" ng-model=\"$ctrl.modelConfig.title\" class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{ 'acm.common.header.model_icon' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <op-iconpicker ng-model=\"$ctrl.modelConfig.icon\"></op-iconpicker>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">{{ 'acm.common.header.is_automation' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <select class=\"form-select w-sm\" ng-model=\"$ctrl.modelConfig.isAuto\"\n" +
    "                            ng-change=\"$ctrl.internalAttr($ctrl.modelConfig.isAuto)\"\n" +
    "                            ng-options=\"choose.value as choose.label for choose in $ctrl.IS_AUTO_MAP\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" ng-if=\"$ctrl.SHOW_TEMPLATE\">\n" +
    "                <label class=\"control-label\">{{ 'acm.common.header.model_template' | translate}}</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <select class=\"form-select w-sm\" ng-model=\"$ctrl.modelConfig.template_id\"\n" +
    "                            ng-options=\"choose.id as choose.title for choose in $ctrl.CIT_LIST\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab>\n" +
    "            <uib-tab-heading>{{ 'acm.common.header.model_attr' | translate}}</uib-tab-heading>\n" +
    "            <umd-config-attrs ng-model=\"$ctrl.modelConfig.attrs\" class=\"d-block\"></umd-config-attrs>\n" +
    "        </uib-tab>\n" +
    "        <uib-tab>\n" +
    "            <uib-tab-heading>{{ 'acm.common.header.view_info' | translate}}</uib-tab-heading>\n" +
    "            <umd-config-view model-def=\"$ctrl.modelConfig\"></umd-config-view>\n" +
    "        </uib-tab>\n" +
    "    </uib-tabset>\n" +
    "    <div>\n" +
    "        <button type=\"button\" class=\"btn btn-primary opx-btn-ok\"\n" +
    "                ng-click=\"$ctrl.save($ctrl.modelConfig)\"\n" +
    "                ng-disabled=\"!modelConfigForm.$valid || $ctrl.VALIDATE_CODE_ERROR\" uaa-has-permission=\"acm:edit:*\">\n" +
    "            {{ 'common.entity.action.save' | translate}}\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-default opx-btn-cancel\"\n" +
    "                ng-click=\"$ctrl.go_back($ctrl.modelConfig)\">{{ 'common.entity.action.cancel' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</form>")

$templateCache.put("app/modules/acm/acm-device-selector.html","<div ng-if=\"$ctrl.viewAs==='dropdown'\" class=\"dropdown\" style=\"z-index: 1030\">\n" +
    "    <button class=\"btn btn-outline-default\" title=\"{{'jao.job.selector.select_device' | translate}}\"\n" +
    "            data-bs-toggle=\"dropdown\" opx-popdrop\n" +
    "            data-bs-auto-close=\"outside\"\n" +
    "            ng-disabled=\"$ctrl.readonly\">\n" +
    "        <i class=\"far fa-server fa-fw\"></i>\n" +
    "        <span ng-if=\"$ctrl.theHosts|isEmpty\">{{$ctrl.theOptions.label || ''}}</span>\n" +
    "        <span ng-if=\"$ctrl.theHosts|isNotEmpty\">\n" +
    "            <strong class=\"text-primary\">{{$ctrl.theHosts[0].value || $ctrl.theHosts[0]}}</strong>\n" +
    "            <span class=\"badge bg-secondary mb-2\" ng-if=\"$ctrl.theHosts.length>1\">{{$ctrl.theHosts.length}}</span>\n" +
    "        </span>\n" +
    "        <i class=\"far fa-angle-down\"></i>\n" +
    "    </button>\n" +
    "    <div class=\"dropdown-menu\" style=\"width:26rem;padding:.5rem;max-height:30rem;overflow:auto;\">\n" +
    "        <acm-list-ci asset-types=\"$ctrl.assetType\" the-model=\"$ctrl.theHosts\" options=\"$ctrl.theOptions\"\n" +
    "                     mcheck-type=\"$ctrl.mcheckType\"></acm-list-ci>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.viewAs==='btndlg'\">\n" +
    "    <div ng-if=\"$ctrl.theHosts.length>0\">\n" +
    "        <div class=\"d-flex flex-nowrap align-items-center\">\n" +
    "            <div class=\"btn btn-sm btn-default d-inline-block op-hover-trigger\"\n" +
    "                 ng-class=\"{'pe-none': $ctrl.readonly}\"\n" +
    "                 style=\"position:relative;width:10em;\">\n" +
    "            <span class=\"op-hover-to-show pull-right\" ng-click=\"$ctrl.emptyItems()\"\n" +
    "                  ng-show=\"!$ctrl.readonly\"\n" +
    "                  title=\"{{'common.umd_config.move_all' | translate}}\"><i\n" +
    "                    class=\"fa fa-times\"></i></span>\n" +
    "                <span class=\"d-block\"\n" +
    "                      ng-click=\"$ctrl.openDeviceSelectorDialog()\">{{ 'acm.common.selector.total' | translate}}<strong>{{$ctrl.theHosts.length}}</strong>{{ 'acm.common.selector.item' | translate}}</span>\n" +
    "            </div>\n" +
    "            <op-searchbox search-text=\"$ctrl.filter\" class=\"ms-auto autohide\"></op-searchbox>\n" +
    "        </div>\n" +
    "        <ul class=\"list list-unstyled list-inline\" style=\"max-height:10rem; overflow-y:auto;\">\n" +
    "            <li ng-repeat=\"host in $ctrl.theHosts | filter: $ctrl.filter track by $index\"\n" +
    "                class=\"op-hover-trigger mb-3\">\n" +
    "                <div class=\"badge bg-secondary op-text-normal op-cursor-default py-2 px-2\">\n" +
    "                    {{host.value || host}}\n" +
    "                    <span ng-if=\"host.runType.length>0\"> [{{host.runType}}]</span>\n" +
    "                    <span ng-if=\"host.runType.length>0\" style=\"color: #10d070;\">({{host.total_hosts}})</span>\n" +
    "                    <!--<a ng-click=\"$ctrl.removeItem($index)\" class=\"text-muted op-hover-to-show\">&times;</a>-->\n" +
    "                    <a ng-click=\"$ctrl.removeItem($index)\" ng-show=\"!$ctrl.readonly\">&times;</a>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!$ctrl.theHosts || $ctrl.theHosts.length===0\" __class=\"op-blank-slate bg-light p-3\">\n" +
    "        <!--        <div class=\"op-blank-slate-icon\"><i class=\"fal fa-server\" style=\"font-size:4rem;\"></i></div>-->\n" +
    "        <button type=\"button\" class=\"btn btn-outline-default\" ng-click=\"$ctrl.openDeviceSelectorDialog()\"><i\n" +
    "                class=\"fal fa-server\" ng-disabled=\"$ctrl.readonly\"></i> {{$ctrl.theOptions.label || ''}}\n" +
    "        </button>\n" +
    "        <!--        </div>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/acm/acm-list-ci-condition.html","<div ng-if=\"$ctrl.options.view==='dropdown'\" class=\"dropdown\">\n" +
    "    <button class=\"btn btn-outline-default\" data-bs-toggle=\"dropdown\">\n" +
    "        <span ng-if=\"$ctrl.selectTag|isEmpty\"><i\n" +
    "                class=\"far fa-server fa-fw\"></i> {{ 'acm.common.list.select_dynamic_tag' | translate}}</span>\n" +
    "        <span ng-if=\"$ctrl.selectTag|isNotEmpty\"><i class=\"far fa-server fa-fw\"></i> {{$ctrl.selectTag}}</span>\n" +
    "    </button>\n" +
    "    <div class=\"dropdown-menu\" style=\"min-width: 12rem;max-height:300px; overflow-y:auto;padding: 0px !important;\"\n" +
    "         -menu>\n" +
    "        <ul class=\"list-group\">\n" +
    "            <li class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n" +
    "                ng-click=\"$ctrl.options.clickCallback('@@');$ctrl.selectTag=null;\">\n" +
    "                &nbsp;\n" +
    "            </li>\n" +
    "            <li class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n" +
    "                ng-repeat=\"tag in $ctrl.tags\"\n" +
    "                ng-click=\"$ctrl.options.clickCallback(tag.name);$ctrl.selectTag=tag.name\">\n" +
    "                {{tag.name}}\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div id=\"cm_dynamic_tag_card_div\" ng-if=\"$ctrl.options.view==='card'\" class=\"flex-fill scroll-y\">\n" +
    "    <div class=\"card udp-card-mode __opx-autocolor \" style=\"background-color:transparent;color:rgb(0, 0, 0)\">\n" +
    "        <div class=\"card-body\" style=\"background-color:rgba(231, 230, 230, 0.18);color:rgb(0, 0, 0)\">\n" +
    "            <ul class=\"list list-unstyled list-inline\">\n" +
    "                <li class=\"mb-2\" ng-repeat=\"tag in $ctrl.tags\">\n" +
    "                    <button type=\"button\" class=\"btn  btn-sm\"\n" +
    "                            ng-class=\"tag.status?'btn-primary':'btn-secondary'\"\n" +
    "                            ng-click=\"tag.status=!tag.status;$ctrl.setTag('$'+tag.name)\"\n" +
    "                            value=\"${{tag.name}}\">\n" +
    "                        {{tag.name}} &nbsp;&nbsp;\n" +
    "                    </button>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.options.view==='list'\" class=\"flex-fill scroll-y\">\n" +
    "    <ul class=\"list-group\">\n" +
    "        <li class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n" +
    "            ng-click=\"$ctrl.options.clickCallback('@@');$ctrl.selectTag=null;\">\n" +
    "            &nbsp;\n" +
    "        </li>\n" +
    "        <li class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n" +
    "            ng-repeat=\"tag in $ctrl.tags\"\n" +
    "            ng-click=\"$ctrl.options.clickCallback(tag.name);$ctrl.selectTag=tag.name\">\n" +
    "            {{tag.name}}\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>")

$templateCache.put("app/modules/acm/acm-list-ci-group.html","<div ng-if=\"$ctrl.options.showAs==='dropdown'\" class=\"dropdown\">\n" +
    "    <button class=\"btn btn-outline-default\" data-bs-toggle=\"dropdown\" data-bs-auto-close=\"outside\">\n" +
    "        <span ng-if=\"$ctrl.selectedGroup|isEmpty\"><!--<i class=\"far fa-server fa-fw\"></i> -->{{$ctrl.options.dropdownText}} {{ 'acm.common.list.choose_group' | translate}}</span>\n" +
    "        <span ng-if=\"$ctrl.selectedGroup|isNotEmpty\">{{ 'acm.common.list.group' | translate}}\n" +
    "            <strong class=\"text-primary\">{{$ctrl.selectedGroup[0]}}</strong>\n" +
    "            <span class=\"badge bg-secondary mb-2\" ng-if=\"$ctrl.options.selector==='multiple'\">{{$ctrl.selectedGroup.length}}</span>\n" +
    "        </span>\n" +
    "    </button>\n" +
    "    <div class=\"dropdown-menu\">\n" +
    "        <div style=\"width:21rem; max-height:300px; overflow-y:auto;\" id=\"{{$ctrl.treeId}}\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.options.showAs!=='dropdown'\" id=\"{{$ctrl.treeId}}\"></div>\n" +
    "")

$templateCache.put("app/modules/acm/acm-list-ci-instance.html","<div ng-if=\"$ctrl.useOpxDatatable\" class=\"flex-fill scroll-y\">\n" +
    "    <div class=\"opx-layout-vflex\">\n" +
    "        <div class=\"mb-3 d-flex align-items-center bg-light px-3 py-2\">\n" +
    "            <strong class=\"me-3\">{{ 'acm.common.list.filter' | translate}}</strong>\n" +
    "            <acm-list-ci-group  ng-model=\"$ctrl.theModel\"\n" +
    "                               options=\"{groupCallBack:$ctrl.onClickGroup,showAs:'dropdown'}\"\n" +
    "                               ci-type=\"$ctrl.ciType\"\n" +
    "                               class=\"me-3\"></acm-list-ci-group>\n" +
    "            <acm-list-ci-tag\n" +
    "                             ng-model=\"$ctrl.theModel\"\n" +
    "                             options=\"{tagCallback:$ctrl.onClickTag,view:'dropdown'}\"\n" +
    "                             ci-type=\"$ctrl.ciType\"\n" +
    "                             class=\"me-3\"></acm-list-ci-tag>\n" +
    "            <!--<acm-list-ci-condition-->\n" +
    "            <!--options=\"{clickCallback:$ctrl.onClickTagDynamicTag,view:'dropdown'}\"-->\n" +
    "            <!--asset-type=\"$ctrl.ciType\">-->\n" +
    "            <!--</acm-list-ci-condition>-->\n" +
    "        </div>\n" +
    "        <opx-datatable table-config=\"$ctrl.tableConfig\"></opx-datatable>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<udp-page-view page-id=\"'$CUSTOM_PAGE$'\" page-source=\"code\" ng-if=\"!$ctrl.useOpxDatatable\"\n" +
    "               udp-page-data=\"$ctrl.udpPageData\"\n" +
    "               udp-callback-on-loaded=\"$ctrl.callbackOnLoaded\" class=\"flex-fill scroll-y\">\n" +
    "    <div class=\"opx-layout-vflex\">\n" +
    "        <div class=\"mb-3 d-flex align-items-center bg-light px-3 py-2\">\n" +
    "            <strong class=\"me-3\" style=\"width: 2rem;\">{{ 'acm.common.list.filter' | translate}}</strong>\n" +
    "            <acm-list-ci-group ng-model=\"$ctrl.theModel\"\n" +
    "                               options=\"{groupCallBack:$ctrl.onClickGroup,showAs:'dropdown'}\"\n" +
    "                               ci-type=\"$ctrl.ciType\"\n" +
    "                               class=\"me-3\"></acm-list-ci-group>\n" +
    "            <acm-list-ci-tag ng-model=\"$ctrl.theModel\"\n" +
    "                             options=\"{tagCallback:$ctrl.onClickTag,view:'dropdown'}\"\n" +
    "                             ci-type=\"$ctrl.ciType\"\n" +
    "                             class=\"me-3\"></acm-list-ci-tag>\n" +
    "\n" +
    "            <!--            <acm-device-selector the-model=\"$ctrl.theModel\" options=\"{groupCallBack:$ctrl.onClickGroup,tagCallback:$ctrl.onClickTag, view:'dropdown'}\" view-as=\"dropdown\" ci-types=\"$ctrl.ciType\" ></acm-device-selector>-->\n" +
    "            <!--<acm-list-ci-condition-->\n" +
    "            <!--options=\"{clickCallback:$ctrl.onClickTagDynamicTag,view:'dropdown'}\"-->\n" +
    "            <!--asset-type=\"$ctrl.ciType\">-->\n" +
    "            <!--</acm-list-ci-condition>-->\n" +
    "        </div>\n" +
    "        <div ng-if=\"datatableProps\">\n" +
    "            <uwidget uw-type=\"datatable\" id=\"datatable\" uw-props=\"datatableProps\"></uwidget>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</udp-page-view>\n" +
    "")

$templateCache.put("app/modules/acm/acm-list-ci-recently.html","<udp-page-view page-id=\"'$CUSTOM_PAGE$'\" page-source=\"code\" ng-if=\"!$ctrl.useOpxDatatable\"\n" +
    "               udp-page-data=\"$ctrl.udpPageData\"\n" +
    "               udp-callback-on-loaded=\"$ctrl.callbackOnLoaded\" class=\"flex-fill scroll-y\">\n" +
    "    <div class=\"opx-layout-vflex\">\n" +
    "<!--                <div ng-if=\"datatableProps\">-->\n" +
    "<!--                    <uwidget uw-type=\"datatable\" id=\"w-15874343408751\" uw-props=\"datatableProps\"></uwidget>-->\n" +
    "<!--                </div>-->\n" +
    "\n" +
    "        <div class=\"card-body\">\n" +
    "            <opx-datatable table-config=\"$ctrl.tableConfig\">\n" +
    "            </opx-datatable>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</udp-page-view>")

$templateCache.put("app/modules/acm/acm-list-ci-tag.html","<div ng-if=\"$ctrl.options.view==='dropdown'\" class=\"dropdown\">\n" +
    "    <button class=\"btn btn-outline-default\" data-bs-toggle=\"dropdown\">\n" +
    "        <span ng-if=\"$ctrl.selectTag|isEmpty\" ><i class=\"far fa-server fa-fw\"></i> {{ 'acm.common.list.choose_tag' | translate}}</span>\n" +
    "        <span ng-if=\"$ctrl.selectTag|isNotEmpty\" ><i class=\"far fa-server fa-fw\"></i> {{$ctrl.selectTag}}</span>\n" +
    "    </button>\n" +
    "    <div class=\"dropdown-menu\" style=\"min-width: 12rem;max-height:300px; overflow-y:auto;padding: 0px !important;\">\n" +
    "        <ul class=\"list-group\" >\n" +
    "            <li class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n" +
    "                ng-click=\"$ctrl.options.tagCallback('@@');$ctrl.selectTag=null;\">\n" +
    "                &nbsp;\n" +
    "            </li>\n" +
    "            <li class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n" +
    "                ng-repeat=\"tag in $ctrl.tags\"\n" +
    "                ng-click=\"$ctrl.options.tagCallback([{key:tag.name, value:tag.name}]);$ctrl.selectTag=tag.name\">\n" +
    "                {{tag.name}}\n" +
    "                <span class=\"badge bg-primary badge-pill\">{{tag.hostCount}}</span>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div id=\"cm_tag_card_div\" ng-if=\"$ctrl.options.view==='card'\" class=\"flex-fill scroll-y\">\n" +
    "    <div class=\"card udp-card-mode __opx-autocolor \" style=\"background-color:transparent;color:rgb(0, 0, 0)\">\n" +
    "        <div class=\"card-body\" style=\"background-color:rgba(231, 230, 230, 0.18);color:rgb(0, 0, 0)\">\n" +
    "            <ul class=\"list list-unstyled list-inline\" >\n" +
    "                <li class=\"mb-2\" ng-repeat=\"tag in $ctrl.tags\">\n" +
    "                    <button type=\"button\" class=\"btn  btn-sm\"\n" +
    "                            ng-class=\"tag.status?'btn-primary':'btn-secondary'\"\n" +
    "                            ng-click=\"tag.status=!tag.status;$ctrl.setTag('#'+tag.name, tag.assetType)\"\n" +
    "                            value=\"{{tag}}\">\n" +
    "                        {{tag.name}} &nbsp;&nbsp;\n" +
    "                        <span class=\"badge bg-secondary badge-pill\">{{tag.hostCount}}</span>\n" +
    "                    </button>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-if=\"$ctrl.options.view==='list'\" class=\"flex-fill scroll-y\">\n" +
    "    <ul class=\"list-group\" >\n" +
    "        <li class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n" +
    "            ng-click=\"$ctrl.options.tagCallback('@@');$ctrl.selectTag=null;\">\n" +
    "            &nbsp;\n" +
    "        </li>\n" +
    "        <li class=\"list-group-item list-group-item-action d-flex justify-content-between align-items-center\"\n" +
    "            ng-repeat=\"tag in $ctrl.tags\"\n" +
    "            ng-click=\"$ctrl.options.tagCallback(tag.name);$ctrl.selectTag=tag.name\"\n" +
    "            >\n" +
    "            {{tag.name}}\n" +
    "            <span class=\"badge bg-primary badge-pill\">{{tag.hostCount}}</span>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/acm/acm-list-ci.html","<div class=\"h-full opx-layout-vflex\">\n" +
    "    <div style=\"display: flex;flex-direction: row; align-items: center;\">\n" +
    "        <select ng-if=\"$ctrl.ciTypeDefs.length>1\" class=\"form-select w-sm\" ng-model=\"$ctrl.activeCiType\">\n" +
    "            <option ng-repeat=\"citype in $ctrl.ciTypeDefs track by $index\" value=\"{{citype.code}}\">{{citype.title}}\n" +
    "            </option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pt-2\">\n" +
    "        <div class=\"card udp-card-mode __opx-autocolor \">\n" +
    "            <div class=\"card-header\">\n" +
    "                <i class=\"fa fa-briefcase-medical text-muted\"></i>\n" +
    "                <span>已选主机</span>\n" +
    "                <span class=\"pl-3  badge bg-danger rounded-pill\" style=\"padding-bottom: 1px;padding-top: 3px;\"\n" +
    "                      ng-click=\"$ctrl.changeShowHosts()\">{{ $ctrl.theHostsByCiType ? $ctrl.theHostsByCiType.length : 0 }}\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\" ng-if=\"$ctrl.theHostsByCiType.length > 0 && $ctrl.showHosts\">\n" +
    "                <div class=\"uw-flex uw-column align-items-start\">\n" +
    "                    <div class=\"uw-body\">\n" +
    "                        <div class=\"uw-content \">\n" +
    "                            <ul class=\"list list-unstyled list-inline\" style=\"max-height:10rem; overflow-y:auto;\">\n" +
    "                                <li ng-repeat=\"host in $ctrl.theHostsByCiType | filter: $ctrl.filter track by $index\"\n" +
    "                                    class=\"op-hover-trigger mb-3\">\n" +
    "                                    <div class=\"badge bg-secondary op-text-normal op-cursor-default py-2 px-2\">\n" +
    "                                        {{host.value}}\n" +
    "                                        <a ng-click=\"$ctrl.removeItem(host, $index)\"  style=\"color: #495057\">x</a>\n" +
    "                                    </div>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"$ctrl.activeCiType\" class=\"opx-flex-fill\">\n" +
    "        <ul class=\"nav nav-mdc-op mb-3\">\n" +
    "            <li ng-repeat=\"(mode,def) in $ctrl.selectModeDefs\" ng-class=\"{'active':$ctrl._currentMode===mode}\"\n" +
    "                class=\"nav-item\"><a class=\"nav-link\" ng-click=\"$ctrl._currentMode=mode\"><i\n" +
    "                    class=\"fa fa-fw {{def.icon}}\"></i> {{def.title}}</a></li>\n" +
    "        </ul>\n" +
    "        <acm-list-ci-instance ng-if=\"$ctrl.selectModeDefs['host']\"\n" +
    "                              ng-show=\"$ctrl._currentMode==='host'\"\n" +
    "                              ci-type=\"$ctrl.activeCiType\"\n" +
    "                              the-model=\"$ctrl.theModel\"\n" +
    "                              the-hosts-by-ci-type=\"$ctrl.theHostsByCiType\"\n" +
    "                              options=\"$ctrl.options\"></acm-list-ci-instance>\n" +
    "        <acm-list-ci-group ng-if=\"$ctrl.selectModeDefs['group']\"\n" +
    "                           ng-show=\"$ctrl._currentMode==='group'\"\n" +
    "                           ci-type=\"$ctrl.activeCiType\"\n" +
    "                           ng-model=\"$ctrl.theModel\"\n" +
    "                           the-hosts-by-ci-type=\"$ctrl.theHostsByCiType\"\n" +
    "                           options=\"$ctrl.options\"\n" +
    "                           mcheck-type=\"$ctrl.mcheckType\" class=\"flex-fill scroll-y\"></acm-list-ci-group>\n" +
    "        <acm-list-ci-tag ng-if=\"$ctrl.selectModeDefs['tag']\" ng-show=\"$ctrl._currentMode==='tag'\"\n" +
    "                         ci-type=\"$ctrl.activeCiType\"\n" +
    "                         ng-model=\"$ctrl.theModel\"\n" +
    "                         the-hosts-by-ci-type=\"$ctrl.theHostsByCiType\"\n" +
    "                         options=\"{view:'card'}\"\n" +
    "                         mcheck-type=\"$ctrl.mcheckType\"></acm-list-ci-tag>\n" +
    "        <acm-ci-filter ng-if=\"$ctrl.selectModeDefs['input']\"\n" +
    "                       ng-show=\"$ctrl._currentMode==='input'\"\n" +
    "                       ci-type=\"$ctrl.activeCiType\"\n" +
    "                       ng-model=\"$ctrl.theModel\"></acm-ci-filter>\n" +
    "        <acm-list-ci-recently ng-if=\"$ctrl.selectModeDefs['recently']\"\n" +
    "                              ng-show=\"$ctrl._currentMode==='recently'\"\n" +
    "                              ci-type=\"$ctrl.activeCiType\"\n" +
    "                              options=\"$ctrl.options\"\n" +
    "                              ng-model=\"$ctrl.theModel\"\n" +
    "                              mcheck-type=\"$ctrl.mcheckType\"></acm-list-ci-recently>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/acm/acm-permission.html","<team-res-table-permission module-data=\"$ctrl.moduleData\" app-module=\"$ctrl.appModule\"\n" +
    "                           show-permission-r-w-x=\"$ctrl.showPermissionRWX\" uaa-has-permission=\"acm:distribute:*\" uaa-deny-message=\"{{'common.uaa.no_permission' | translate}}\"></team-res-table-permission>\n" +
    "")

$templateCache.put("app/modules/acm/host-selector.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"> 选择主机</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"Close\" style=\"pointer-events: auto;\"\n" +
    "            ng-click=\"cmHostSelectorCtrlVm.views.cancel()\"><span aria-hidden=\"true\"></span></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body cm-host-dialog\">\n" +
    "    <div >\n" +
    "        <div class=\"opx-flex-fill table-responsive\">\n" +
    "            <table id=\"cm-host-table\" class=\"cm-table table opx-table\"></table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer text-right\">\n" +
    "    <button type=\"reset\" class=\"btn btn-default\" ng-click=\"cmHostSelectorCtrlVm.views.cancel()\">{{'common.action.cancel'|translate}}</button>\n" +
    "    <button type=\"submit\" class=\"btn btn-success\" ng-click=\"cmHostSelectorCtrlVm.views.confirm()\">{{'common.action.ok'|translate}}</button>\n" +
    "</div>\n" +
    "")
}]);
})();