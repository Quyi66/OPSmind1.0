//HEAD 
(function(app) {
try { app = angular.module("oplus.dev"); }
catch(err) { app = angular.module("oplus.dev", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("app/modules/dev/dev-acm.html","<div class=\"opx-layout-hflex\">\n" +
    "    <div class=\"p-3 bg-white border-right\">\n" +
    "        <div class=\"mb-3\">\n" +
    "            <button class=\"btn btn-default\" ng-click=\"acmVm.selectedDevices=['/','/CentOS']\">Set selectedArray</button>\n" +
    "        </div>\n" +
    "        <pre>{{acmVm | json}}</pre>\n" +
    "    </div>\n" +
    "    <div class=\"p-3 flex-fill scroll-y\">\n" +
    "        <!--        <div class=\"card mb-3\">-->\n" +
    "        <!--            <div class=\"card-header\">资产多行搜索</div>-->\n" +
    "        <!--            <div class=\"card-body\">-->\n" +
    "        <!--                <acm-ci-filter ng-model=\"$ctrl.searchResult\"></acm-ci-filter>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </div>-->\n" +
    "        <!--        <div class=\"card mb-3\">-->\n" +
    "        <!--            <div class=\"card-header\">资产模型编辑器</div>-->\n" +
    "        <!--            <div class=\"card-body\">-->\n" +
    "        <!--                <acm-ci-model-editor cit-code=\"\"></acm-ci-model-editor>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </div>-->\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">资产列表 <code>&lt;acm-list-ci&gt;</code></div>\n" +
    "            <div class=\"card-body\" style=\"max-height: 300px; overflow-y:auto;\">\n" +
    "                <acm-list-ci asset-types=\"'linux'\" the-model=\"acmVm.selectedDevices\"\n" +
    "                             options=\"{selectMode:acmVm.selectMode, selector:'multiple'}\"></acm-list-ci>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">选择器component <code>&lt;acm-device-selector&gt;</code></div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <div class=\"mb-3\">按钮对话框形式（一般用于选择执行对象，支持设备、分组、标签、输入）</div>\n" +
    "                <acm-device-selector view-as=\"btndlg\" the-model=\"acmVm.selectedDevices\" ci-types=\"'[all]'\"\n" +
    "                                 options=\"{label:'所有类型'}\" class=\"d-block mb-3\"></acm-device-selector>\n" +
    "                <acm-device-selector view-as=\"btndlg\" the-model=\"acmVm.selectedDevices\" ci-types=\"'[auto]'\"\n" +
    "                                 options=\"{label:'所有支持自动化的类型'}\"></acm-device-selector>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <div>Dropdown形式（一般用于表格过滤，只能选择分组、标签）</div>\n" +
    "                <div>显示linux和network_device</div>\n" +
    "                <acm-device-selector view-as=\"dropdown\" the-model=\"acmVm.selectedDevices\"\n" +
    "                                 ci-types=\"'linux,network_device'\"></acm-device-selector>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">使用uinput输入控件 <code>&lt;udp-input type=\"device\"&gt;</code></div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <udp-input type=\"host\" ng-model=\"acmVm.selectedDevices\" control=\"device\"\n" +
    "                           devicetype=\"linux,network_device\"></udp-input>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">使用udp widget <code>&lt;uwidget uw-type=\"hostselector\"&gt;</code></div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <div>\n" +
    "                    按钮对话框形式\n" +
    "                    <uwidget uw-type=\"device-selector\" uw-props=\"acmVm.hostselectorPropsOfBtndlg\"></uwidget>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    Dropdown形式\n" +
    "                    <uwidget uw-type=\"device-selector\" uw-props=\"acmVm.hostselectorPropsOfDropdown\"></uwidget>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">通过js代码调用设备选择器</div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <button class=\"btn btn-default\" ng-click=\"acmVm.selectDevice()\">{{'jao.job.selector.select_device' | translate}}</button>\n" +
    "                TODO\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--        <div class=\"card mb-3\">-->\n" +
    "        <!--            <div class=\"card-header\">通过列表</div>-->\n" +
    "        <!--            <div class=\"card-body\" style=\"height:10rem;overflow-y:auto;\">-->\n" +
    "        <!--                <acm-list-ci-group></acm-list-ci-group>-->\n" +
    "        <!--                TODO-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </div>-->\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-colors.html","<div class=\"wrapper\">\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">背景颜色</div>\n" +
    "        <div class=\"card-body d-flex flex-row flex-wrap\">\n" +
    "            <div ng-repeat=\"theme in colorsVm.cardThemes\" class=\"wrapper bg-{{theme.id}} opx-autocolor\" style=\"width:20rem;\">\n" +
    "                <a class=\"d-block\">\n" +
    "                    <h4>{{theme.title}}</h4>\n" +
    "                    <div class=\"small text-muted\">bg-{{theme.id}}</div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">udp-theme-selector</div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <udp-theme-selector the-model=\"colorsVm.theTheme\" customizable=\"true\"></udp-theme-selector>\n" +
    "            <code>{{colorsVm.theTheme}}</code>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">udp-css-editor</div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <udp-css-editor the-model=\"colorsVm.theCss\" customizable=\"true\"></udp-css-editor>\n" +
    "            <code>{{colorsVm.theTheme}}</code>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">udp-color-picker\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <div class=\"m-b\">Color: <code>{{color || 'N/A'}}</code></div>\n" +
    "            <udp-color-picker ng-model=\"color\"></udp-color-picker>\n" +
    "            <table class=\"table table-sm table-bordered\">\n" +
    "                <tbody>\n" +
    "                <tr ng-repeat=\"row in colorsVm.paletteColors\">\n" +
    "                    <td ng-repeat=\"color in row track by $index\" style=\"background-color:{{color}};color:white;\">{{color}}</td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-condfmt.html","<div class=\"card card-default\">\n" +
    "    <div class=\"card-header\">\n" +
    "        <h3 class=\"card-title\">Rules</h3>\n" +
    "    </div>\n" +
    "    <div class=\"card-body\">\n" +
    "        <div class=\"m-b\"><code>{{rules}}</code></div>\n" +
    "        <udp-widget-config-format-rule the-model=\"rules\"\n" +
    "                                       formats=\"{theme:true,backColor:true,fontColor:true,css:true}\"></udp-widget-config-format-rule>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-css.html","<div class=\"h-full scroll-y p-3\">\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">控件大小</div>\n" +
    "        <div class=\"card-body op-smartform form-inline\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">form-control</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" class=\"form-control op-w-md\">\n" +
    "                    <select class=\"form-select op-w-md ms-2\">\n" +
    "                        <option value=\"\">1</option>\n" +
    "                    </select>\n" +
    "                    <button class=\"ms-2 btn btn-primary\">btn-sm</button>\n" +
    "                    <a href=\"\" class=\"ms-2 btn btn-primary\">a.btn</a>\n" +
    "                    <button class=\"ms-2 btn btn-outline-default\"><i class=\"fa fa-pencil\"></i> btn-sm</button>\n" +
    "                    <button class=\"ms-2 btn btn-default opx-btn-icon\"><i class=\"fa fa-pencil\"></i></button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">form-control-sm</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" class=\"form-control form-control-sm op-w-md\">\n" +
    "                    <select class=\"form-control form-select-sm op-w-md ms-2\">\n" +
    "                        <option value=\"\">1</option>\n" +
    "                    </select>\n" +
    "                    <button class=\"ms-2 btn btn-sm btn-primary\">btn-sm</button>\n" +
    "                    <a href=\"\" class=\"ms-2 btn btn-sm btn-primary\">a.btn-sm</a>\n" +
    "                    <button class=\"ms-2 btn btn-sm btn-outline-default\"><i class=\"fa fa-pencil\"></i> btn-sm\n" +
    "                    </button>\n" +
    "                    <button class=\"ms-2 btn btn-sm btn-default opx-btn-icon\"><i class=\"fa fa-pencil\"></i></button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card\">\n" +
    "        <div class=\"card-header\">按钮样式</div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <div class=\"mb-3\">\n" +
    "                <button type=\"button\" ng-click=\"cssVm.useDarkTheme=!cssVm.useDarkTheme\"\n" +
    "                        class=\"btn\"\n" +
    "                        ng-class=\"cssVm.useDarkTheme?'btn-dark':'btn-outline-default'\">Use Dark Theme\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            <table class=\"table table-bordered\" ng-class=\"{'bg-dark':cssVm.useDarkTheme}\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th>Color</th>\n" +
    "                    <!--                    <th ng-repeat=\"btnCss in cssVm.btnClasses\"><code>{{btnCss}}</code></th>-->\n" +
    "                    <th ng-repeat=\"color in cssVm.btnColors\">{{color}}</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                <tr ng-repeat=\"btnCss in cssVm.btnClasses\">\n" +
    "                    <!--                <tr ng-repeat=\"color in cssVm.btnColors\">-->\n" +
    "                    <!--                    <td class=\"bg-{{color}}\">{{color}}</td>-->\n" +
    "                    <td><code>{{btnCss}}</code></td>\n" +
    "                    <!--                    <td ng-repeat=\"btnCss in cssVm.btnClasses\">-->\n" +
    "                    <td ng-repeat=\"color in cssVm.btnColors\">\n" +
    "                        <div ng-repeat=\"btnSize in cssVm.btnSizes\" class=\"mb-2\">\n" +
    "                            <button type=\"button\"\n" +
    "                                    title=\"btn {{btnSize}} {{btnCss | replace:'?':color}}\"\n" +
    "                                    class=\"btn {{btnSize}} {{btnCss | replace:'?':color}}\"><i\n" +
    "                                    ng-if=\"btnCss.indexOf('opx-btn-icon')>=0\"\n" +
    "                                    class=\"fa fa-pencil\"></i>{{btnCss.indexOf('opx-btn-icon') >= 0 ? '' : color}}\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "            <!--            <table class=\"table table-bordered\">-->\n" +
    "            <!--                <thead>-->\n" +
    "            <!--                <tr>-->\n" +
    "            <!--                    <th>Color</th>-->\n" +
    "            <!--                    <th ng-repeat=\"btnCss in cssVm.btnClasses\"><code>{{btnCss}}</code></th>-->\n" +
    "            <!--                </tr>-->\n" +
    "            <!--                </thead>-->\n" +
    "            <!--                <tbody>-->\n" +
    "            <!--                <tr ng-repeat=\"color in cssVm.btnColors\">-->\n" +
    "            <!--                    <td class=\"bg-{{color}}\">{{color}}</td>-->\n" +
    "            <!--                    <td ng-repeat=\"btnCss in cssVm.btnClasses\">-->\n" +
    "            <!--                        <div ng-repeat=\"btnSize in cssVm.btnSizes\" class=\"mb-2\">-->\n" +
    "            <!--                            <button type=\"button\"-->\n" +
    "            <!--                                    title=\"btn {{btnSize}} {{btnCss | replace:'?':color}}\"-->\n" +
    "            <!--                                    class=\"btn {{btnSize}} {{btnCss | replace:'?':color}}\"><i-->\n" +
    "            <!--                                    ng-if=\"btnCss.indexOf('opx-btn-icon')>=0\"-->\n" +
    "            <!--                                    class=\"fa fa-pencil\"></i>{{btnCss.indexOf('opx-btn-icon') >= 0 ? '' : color}}-->\n" +
    "            <!--                            </button>-->\n" +
    "            <!--                        </div>-->\n" +
    "            <!--                    </td>-->\n" +
    "            <!--                </tr>-->\n" +
    "            <!--                </tbody>-->\n" +
    "            <!--            </table>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-customfunc.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">Custom Function</div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill p-3\">\n" +
    "        <div class=\"card\">\n" +
    "            <div class=\"card-header\">$$.toTableHtml</div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <div ng-repeat=\"html in customfuncVm.htmls track by $index\">\n" +
    "                    <strong>{{html.title}}</strong>\n" +
    "                    <div ng-bind-html=\"html.html\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-dataex.html","<button uaa-has-permission=\"udp:edit\">Permi</button>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-sm-6\">\n" +
    "        <div class=\"card card-default\">\n" +
    "            <div class=\"card-header\">\n" +
    "                <div class=\"card-title\">数据转换输入</div>\n" +
    "            </div>\n" +
    "            <div class=\"card-body op-smartform form-horizontal\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">变量值</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <code>{{dataVm.selectedItem.vars}}</code>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">选择测试项</label>\n" +
    "                    <div class=\"form-control-wrapper op-combo\">\n" +
    "                        <select class=\"form-select\"\n" +
    "                                ng-model=\"dataVm.selectedItem\"\n" +
    "                                ng-options=\"expr as (expr.expr|limitTo:100) for expr in dataVm.exprs\"></select>\n" +
    "                        <udp-data-converter the-model=\"dataVm.selectedItem.expr\" class=\"\"\n" +
    "                                            options=\"{kinds:'js,str,yaml,json,link',varTypes:'pageparam,global'}\"></udp-data-converter>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">表达式</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <div class=\"form-text\"><code>{{dataVm.selectedItem.expr}}</code></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">说明</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <div class=\"form-text text-muted\">{{dataVm.selectedItem.desc}}</div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">变量替换后</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <div id=\"js-dd-preview\" class=\"p-2 bg-light code\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <button type=\"button\" class=\"btn btn-outline-primary\" ng-click=\"dataVm.evalExpr()\"><i class=\"fa fa-function\"></i> 解析\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div class=\"mt-3 bg-light\" ng-if=\"dataVm.exprResult\">{{dataVm.exprResult}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"card card-default\">\n" +
    "    <div class=\"card-header\">\n" +
    "        <h4 class=\"card-title\">ConvertData</h4>\n" +
    "    </div>\n" +
    "    <div class=\"card-body\">\n" +
    "        <table class=\"table table-bordered table-sm\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>data</th>\n" +
    "                <th>format</th>\n" +
    "                <th>dataType</th>\n" +
    "                <th>formatter</th>\n" +
    "                <th>result</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"value in dataVm.valuesToConvert track by $index\">\n" +
    "                <td>{{value.data | json}}</td>\n" +
    "                <td>{{value.format}}</td>\n" +
    "                <td>{{value.dataTypes}}</td>\n" +
    "                <td>{{value.formatter}}</td>\n" +
    "                <td>{{value.result | json}}</td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-editor.html","<div class=\"p-3\">\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">代码编辑器 <code>op-code-editor</code></div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Syntax</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <select ng-model=\"editorVm.syntax\" class=\"form-select\"\n" +
    "                            ng-options=\"syntax as syntax for syntax in editorVm.availSyntaxes\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <textarea ng-model=\"editorVm.theCode\" class=\"form-control mb-3 code\" rows=\"5\"></textarea>\n" +
    "            <op-code-editor the-model=\"editorVm.theCode\" style=\"height:20rem;\"\n" +
    "                            options=\"{syntax:editorVm.syntax,readonly:!true,toolbar:true}\"></op-code-editor>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<button type=\"button\" class=\"btn btn-primary\" ng-click=\"editorVm.openModal()\">Open Modal</button>")

$templateCache.put("app/modules/dev/dev-form.html","<div class=\"row wrapper\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "        <div class=\"card card-default\">\n" +
    "            <div class=\"card-header\">\n" +
    "                <h4 class=\"card-title\">内嵌布局：<code>.form-inline</code></h4></div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <form class=\"op-smartform form-inline\">\n" +
    "                    <ng-include src=\"'dev/dev-form-content.html'\"></ng-include>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-6\">\n" +
    "        <div class=\"card card-default\">\n" +
    "            <div class=\"card-header\">\n" +
    "                <h4 class=\"card-title\">水平布局：<code>.form-horizontal</code></h4>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <form class=\"op-smartform form-horizontal\">\n" +
    "                    <ng-include src=\"'dev/dev-form-content.html'\"></ng-include>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-6\">\n" +
    "        <div class=\"card card-default\">\n" +
    "            <div class=\"card-header\">\n" +
    "                <h4 class=\"card-title\">垂直布局：<code>.form-vertical</code></h4>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <form class=\"op-smartform form-vertical\">\n" +
    "                    <ng-include src=\"'dev/dev-form-content.html'\"></ng-include>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--<div class=\"col-sm-6\">-->\n" +
    "    <!--<div class=\"card card-default\">-->\n" +
    "    <!--<div class=\"card-header\">-->\n" +
    "    <!--<h4 class=\"card-title\">两列垂直布局 form-vertical</h4>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--<div class=\"card-body\">-->\n" +
    "    <!--<form class=\"form-vertical with-cols-2\">-->\n" +
    "    <!--<ng-include src=\"'dev/dev-form-content.html'\"></ng-include>-->\n" +
    "    <!--<ng-include src=\"'dev/dev-form-content.html'\"></ng-include>-->\n" +
    "    <!--</form>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "</div>\n" +
    "<script type=\"text/ng-template\" id=\"dev/dev-form-content.html\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">OP下拉选择</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <op-select the-model=\"$ctrl.select\" multiple option-groups=\"formVm.cssGroups\"></op-select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">单行文本输入</label>\n" +
    "        <div class=\"form-control-wrapper\"><input type=\"text\" class=\"form-control\">\n" +
    "            <p class=\"help-block\">对输入控件的说明和帮助文字</p>\n" +
    "        </div>\n" +
    "        <!--        <p class=\"help-block\">对输入控件的说明和帮助文字</p>-->\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">标签很长的单行文本输入</label>\n" +
    "        <div class=\"form-control-wrapper\"><input type=\"text\" class=\"form-control\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">复选框</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <div class=\"checkbox checkbox-inline\"><input type=\"checkbox\" id=\"js-checkbox1\" name=\"checkboxes\"><label\n" +
    "                    for=\"js-checkbox1\">复选1</label>\n" +
    "            </div>\n" +
    "            <div class=\"checkbox checkbox-inline\"><input type=\"checkbox\" id=\"js-checkbox2\" name=\"checkboxes\"><label\n" +
    "                    for=\"js-checkbox2\">复选2</label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">单选框</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <div class=\"radio radio-inline\"><input type=\"radio\" id=\"js-radio1\" name=\"radios\"><label\n" +
    "                    for=\"js-radio1\">单选1</label></div>\n" +
    "            <div class=\"radio radio-inline\"><input type=\"radio\" id=\"js-radio2\" name=\"radios\"><label\n" +
    "                    for=\"js-radio2\">单选2</label></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">普通单选</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select class=\"form-select op-w-sm\">\n" +
    "                <option>Item 1</option>\n" +
    "                <option>Item 2</option>\n" +
    "                <option>Item 3</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">OP下拉单选</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select op-select class=\"form-select op-w-sm\" ng-model=\"formVm.myselect\">\n" +
    "                <option>Item 1</option>\n" +
    "                <option>Item 2</option>\n" +
    "                <option>Item 3</option>\n" +
    "            </select>\n" +
    "            <!--            <p class=\"help-block\">当页面有滚动条的时候，Chosen控件存在位置偏移的问题</p>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">数字输入</label>\n" +
    "        <div class=\"form-control-wrapper\"><input type=\"number\" class=\"form-control\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">输入组合</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <div class=\"input-group-text\"><input type=\"checkbox\"></div>\n" +
    "                <input type=\"text\" class=\"form-control\">\n" +
    "                <button type=\"button\" class=\"btn btn-outline-default\">单位 <i\n" +
    "                        class=\"fa fa-angle-down\"></i></button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">多个控件组合</label>\n" +
    "        <div class=\"form-control-wrapper op-combo\">\n" +
    "            <div class=\"input-group op-w-sm\">\n" +
    "                <div class=\"input-group-text\"><input type=\"checkbox\"></div>\n" +
    "                <input type=\"text\" class=\"form-control\">\n" +
    "                <button type=\"button\" class=\"btn btn-outline-default\">单位 <i\n" +
    "                        class=\"fa fa-angle-down\"></i></button>\n" +
    "            </div>\n" +
    "            <input type=\"text\" class=\"form-control\">\n" +
    "            <udp-color-picker ng-model=\"color\" title=\"背景色\"></udp-color-picker>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">颜色选择</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <udp-color-picker ng-model=\"color\" title=\"背景色\" class=\"me-3\"></udp-color-picker>\n" +
    "            <udp-color-picker ng-model=\"color\" title=\"前景色\"></udp-color-picker>\n" +
    "            <!--<input type=\"color\" class=\"form-control\">-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">范围</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input type=\"range\" class=\"form-range\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">控件op-w-sm</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input type=\"text\" class=\"form-control op-w-sm\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">控件op-w-md</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input type=\"text\" class=\"form-control op-w-md\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">控件op-w-lg</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input type=\"text\" class=\"form-control op-w-lg\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">Select2 {{formVm.selectValue}}</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select op-select class=\"form-select\" ng-model=\"formVm.selectValue\">\n" +
    "                <option value=\"111\">AAA</option>\n" +
    "                <option value=\"222\">BBB</option>\n" +
    "                <option value=\"333\">CCC</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">Select op-w-md</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <select op-select class=\"form-select op-w-md\" ng-model=\"formVm.selectValue\">\n" +
    "                <option>Item 1</option>\n" +
    "                <option>Item 2</option>\n" +
    "                <option>Item 3</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">多行文本输入</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <textarea class=\"form-control\" rows=\"10\"></textarea>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group op-align-horizontal\">\n" +
    "        <label class=\"control-label\">强制水平排列</label>\n" +
    "        <div class=\"form-control-wrapper\">\n" +
    "            <input type=\"text\" class=\"form-control\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--    <div class=\"form-group op-align-vertical\">-->\n" +
    "    <!--        <label class=\"control-label\">强制垂直排列</label>-->\n" +
    "    <!--        <div class=\"form-control-wrapper\">-->\n" +
    "    <!--            <input type=\"text\" class=\"form-control\">-->\n" +
    "    <!--        </div>-->\n" +
    "    <!--    </div>-->\n" +
    "    <div class=\"form-group op-form-actions\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary opx-btn-ok me-3\">{{'common.action.ok' | translate}}</button>\n" +
    "        <button type=\"button\" class=\"btn btn-default opx-btn-cancel\">{{'common.action.cancel' | translate}}</button>\n" +
    "    </div>\n" +
    "</script>\n" +
    "")

$templateCache.put("app/modules/dev/dev-i18n.html","#{城市}: {{i18nVm.stringText}}")

$templateCache.put("app/modules/dev/dev-icon.html","<div class=\"p-3\">\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">Oplus Icons</h3>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\" ng-repeat=\"(key, def) in iconVm.oplusIcons track by $index\">\n" +
    "            Type:{{key}}\n" +
    "            <ul class=\"list list-inline\">\n" +
    "                <li ng-repeat=\"icon in def.icons track by $index\">\n" +
    "                    <div class=\"text-center\"><i class=\"fa fa-oplus-{{icon}} fa-fw fa-3x\"></i>\n" +
    "                        <p>{{icon}}</p></div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">Icon-font</h3>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <span class=\"iconfont icon-huawei\"></span>\n" +
    "            <span class=\"iconfont icon-cisco\"></span>\n" +
    "            <span class=\"iconfont icon-portal-icon-fenghuobiaoshi\"></span>\n" +
    "            <span class=\"iconfont icon-icon_logo\"></span>\n" +
    "            <span class=\"iconfont icon-H3C\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">图标使用规范</h3>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <div class=\"op-smartform form-inline\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">样式</label>\n" +
    "                    <div class=\"form-control-wrapper op-combo\">\n" +
    "                        <select ng-model=\"iconVm.theBtnColor\" class=\"form-select\"\n" +
    "                                ng-options=\"def.color as def.color for def in iconVm.btnColors\">\n" +
    "                        </select>\n" +
    "                        <select ng-model=\"iconVm.theBtnStyle\" class=\"form-select\"\n" +
    "                                ng-options=\"def.style as def.title for def in iconVm.btnStyles\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <ul class=\"list list-inline mt-5\">\n" +
    "                <li ng-repeat=\"def in iconVm.standardIcons\">\n" +
    "                    <button class=\"btn btn{{iconVm.theBtnStyle?'-'+iconVm.theBtnStyle:''}}-{{iconVm.theBtnColor}}\"><i\n" +
    "                            class=\"far {{def.icon}}\"></i> {{def.text}}\n" +
    "                    </button>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-content mb-3\">\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 class=\"modal-title\" ng-init=\"iconVm.selectedIcon='fa-check-circle'\">Icon Picker</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\" style=\"height:15rem;overflow:auto\">\n" +
    "            <div class=\"alert alert-info\">在对话框里面，图标选择器要能显示完整</div>\n" +
    "            <div class=\"d-flex flex-row align-items-center\">\n" +
    "                <div style=\"width:8rem;\">\n" +
    "                    <div class=\"border rounded bg-light d-inline-flex flex-column align-items-center justify-content-center\"\n" +
    "                         style=\"width:4rem;height:4rem;\">\n" +
    "                        <i class=\"fa fa-4x\" ng-class=\"iconVm.selectedIcon\"></i>\n" +
    "                    </div>\n" +
    "                    <p>\n" +
    "                        <span class=\"badge bg-secondary\">{{iconVm.selectedIcon}}</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div>\n" +
    "                    <op-iconpicker ng-model=\"iconVm.selectedIcon\"></op-iconpicker>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-click=\"iconVm.selectedIcon=undefined;\"\n" +
    "                            title=\"Clear the icon\"><i\n" +
    "                            class=\"far fa-trash-alt\"></i>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-index.html","<div class=\"opx-layout-hflex\">\n" +
    "    <div class=\"opx-sidebar\">\n" +
    "        <div class=\"opx-sidebar-header opx-sidebar-header-fixed border-bottom\">\n" +
    "            <div class=\"opx-navbar-title\">开发测试</div>\n" +
    "        </div>\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <div class=\"opx-treenav\">\n" +
    "                <div class=\"opx-treenav-item\" ng-repeat=\"com in components | orderBy:'toString()' track by $index\">\n" +
    "                    <a ui-sref=\"app.dev.component({component:com})\" ui-sref-active=\"active\">{{com}}</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--    <nav class=\"opx-layout-vflex-header navbar navbar-expand navbar-light bg-light border-bottom\">-->\n" +
    "    <!--        <div class=\"opx-navbar-title\">开发测试</div>-->\n" +
    "    <!--        <ul class=\"navbar-nav\">-->\n" +
    "    <!--            <li class=\"nav-item\" ng-repeat=\"com in components | orderBy:'toString()' track by $index\">-->\n" +
    "    <!--                <a class=\"nav-link\" ui-sref=\"app.dev.component({component:com})\">{{com}}</a>-->\n" +
    "    <!--            </li>-->\n" +
    "    <!--        </ul>-->\n" +
    "    <!--    </nav>-->\n" +
    "    <div class=\"opx-flex-fill scroll-y h-full bg-light\" ui-view=\"component\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-interaction.html","<h2>Interaction</h2>\n" +
    "\n" +
    "<div>\n" +
    "    <button class=\"btn js-op-button icon-only opx-btn-flat btn-primary opx-btn-icon btn-sm\" title=\"编辑\"\n" +
    "            ng-click=\"click($event)\"\n" +
    "            data-display=\"{&quot;label&quot;:&quot;编辑&quot;,&quot;icon&quot;:&quot;fa-pencil&quot;,&quot;color&quot;:&quot;primary&quot;,&quot;style&quot;:&quot;flat&quot;,&quot;layout&quot;:&quot;icon-only&quot;}\"\n" +
    "            udp-widget-interaction=\"{&quot;actions&quot;:[&quot;page&quot;],&quot;page&quot;:{&quot;params&quot;:&quot;{\\&quot;id\\&quot;:\\&quot;ff80808178d96c5a0178d96e8fbf0003\\&quot;,\\&quot;name\\&quot;:\\&quot;LUN容量及个数\\&quot;,\\&quot;value\\&quot;:\\&quot;独享\n" +
    "200G*10 RAID10\n" +
    "100G*3  RAID10\n" +
    "与DB2共享\n" +
    "200G*39 RAID10\n" +
    "100G*12 RAID10\n" +
    "2G*6    RAID10\\&quot;}&quot;,&quot;pageId&quot;:&quot;oy1KFI&quot;,&quot;target&quot;:&quot;_dialog&quot;}}\"><i\n" +
    "            class=\"fa fa-pencil\"></i></button>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-jao.html","<div class=\"p-3\">\n" +
    "    <section>\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">实时输出</div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <button class=\"btn btn-secondary\" ng-click=\"jaoVm.openStaticLog()\">打开静态日志</button>\n" +
    "                <button class=\"btn btn-secondary\" ng-click=\"jaoVm.openRealtimeLog()\">打开实时日志</button>\n" +
    "                <!--                <jao-process-modeler process-model=\"jaoVm.testProcessModel\" options=\"{readonly:true}\"></jao-process-modeler>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">流程编排</div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <button class=\"btn btn-secondary\" ng-click=\"jaoVm.openProcessModal()\">打开流程图</button>\n" +
    "                <!--                <jao-process-modeler process-model=\"jaoVm.testProcessModel\" options=\"{readonly:true}\"></jao-process-modeler>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">状态、图标、颜色、样式</div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <h5 class=\"card-title\">执行按钮</h5>\n" +
    "                <ul id=\"js-btnlist\" class=\"list-inline list-unstyled mb-0\">\n" +
    "                    <li>\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\"><i\n" +
    "                                class=\"fa fa-fw fa-chevron-right\"></i> 开始执行\n" +
    "                        </button>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <button type=\"button\" class=\"btn btn-outline-primary\"><i\n" +
    "                                class=\"fa fa-fw fa-chevron-right\"></i> 开始执行\n" +
    "                        </button>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <button type=\"button\" class=\"btn btn-primary opx-btn-icon\"><i\n" +
    "                                class=\"far fa-fw fa-play-circle\"></i></button>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <button type=\"button\" class=\"btn btn-default opx-btn-icon\"><i\n" +
    "                                class=\"fa fa-fw fa-play-circle\"></i></button>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <h5 class=\"card-title\">状态指示（点击改变按钮状态）</h5>\n" +
    "                <!--                <select class=\"form-select\" ng-model=\"jaoVm.btnRunStyle\">-->\n" +
    "                <!--                    <option value=\"GLOW\">呼吸</option>-->\n" +
    "                <!--                    <option value=\"OUTLINE\">边框</option>-->\n" +
    "                <!--                    <option value=\"INNER_ICON\">图标</option>-->\n" +
    "                <!--                </select>-->\n" +
    "                <ul class=\"list-inline list-unstyled mb-0\">\n" +
    "                    <li ng-repeat=\"(status, statusDef) in jaoVm.allRunStatusDefs\"><span\n" +
    "                            class=\"jao-jobrun-status-icon status-{{statusDef.name}}\"\n" +
    "                            title=\"{{statusDef.title}}\" ng-click=\"jaoVm.changeButtonStyle(status)\"></span>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <h5 class=\"card-title\">按钮加状态</h5>\n" +
    "                <ul class=\"list-inline list-unstyled mb-0\">\n" +
    "                    <li ng-repeat=\"statusDef in jaoVm.allRunStatusDefs\">\n" +
    "                        <button class=\"btn btn-default rounded-pill jao-jobrun-status-btn ani-outlined status-{{statusDef.name}}\">\n" +
    "                            <i class=\"fa fa-fw text-{{statusDef.color}}\" ng-class=\"statusDef.icon\"></i>\n" +
    "                            <span>{{statusDef.title}}</span>\n" +
    "                        </button>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <h5 class=\"card-title\">Ansible任务状态</h5>\n" +
    "                <ul class=\"list-inline list-unstyled mb-0\">\n" +
    "                    <li ng-repeat=\"def in jaoVm.taskStatusDefs\"><i class=\"{{def.icon}} text-{{def.color}}\"\n" +
    "                                                                   title=\"{{def.tooltip}}\"></i>\n" +
    "                        {{def.text}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <h5 class=\"card-title\">Ansible主机状态</h5>\n" +
    "                <ul class=\"list-inline list-unstyled mb-0\">\n" +
    "                    <li ng-repeat=\"def in jaoVm.hostStatusDefs\"><i class=\"{{def.icon}} text-{{def.color}}\"\n" +
    "                                                                   title=\"{{def.tooltip}}\"></i>\n" +
    "                        {{def.text}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </section>\n" +
    "    <section>\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">查看Ansible输出</div>\n" +
    "            <div class=\"card-body\" style=\"height:30rem;\">\n" +
    "                <!--                <jao-ao-view contents=\"jaoVm.contents\"></jao-ao-view>-->\n" +
    "                <jao-job-result-view result-data=\"jaoVm.resultData\"></jao-job-result-view>\n" +
    "                <!--                <jao-job-result-view run-id=\"'86d64e47b3c044e4993788a45b05cd54'\"-->\n" +
    "                <!--                                     xxxresult-data=\"jaoVm.resultData\"></jao-job-result-view>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--        <div class=\"card mb-3\">-->\n" +
    "        <!--            <div class=\"card-header\">解析Playbook</div>-->\n" +
    "        <!--            <div class=\"card-body scroll-y\" style=\"height:400px;\">-->\n" +
    "        <!--                <jao-playbook-view playbook=\"jaoVm.playbookPath\"></jao-playbook-view>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </div>-->\n" +
    "    </section>\n" +
    "    <section>\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">测试运行</div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <jao-script-test-run file=\"jaoVm.scriptFile\"></jao-script-test-run>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </section>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-layout_h.html","<div class=\"opx-layout-hflex bg-white\">\n" +
    "    <div class=\"opx-sidebar opx-collapsible w-lg\">\n" +
    "        <!--折叠按钮、标题和搜索-->\n" +
    "        <nav class=\"opx-sidebar-header opx-sidebar-header-fixed border-bottom\">\n" +
    "            <op-searchbox options=\"{autoExpand:true}\" search-text=\"layoutVm.searchText\" >\n" +
    "                <span class=\"opx-sidebar-title\">左右布局示例</span>\n" +
    "            </op-searchbox>\n" +
    "            <!--            <input type=\"text\" class=\"form-control w-full opx-sidebar-search\" placeholder=\"请输入搜索关键字\">-->\n" +
    "        </nav>\n" +
    "        <div class=\"opx-sidebar-body\">\n" +
    "            <div class=\"list-group list-group-flush\">\n" +
    "                <a class=\"list-group-item list-group-item-light list-group-item-action\"\n" +
    "                   ng-repeat=\"link in layoutVm.links\">\n" +
    "                    <i class=\"fa fa-datasource-es\"></i>\n" +
    "                    <span class=\"ms-2 opx-sidebar-collapsed-hidden\">{{link.label}}</span>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill scroll-y wrapper\">\n" +
    "        <div class=\"table-responsive\">\n" +
    "            <table class=\"table table-bordered\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th>Column</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                <tr>\n" +
    "                    <td>\n" +
    "                        <span>===============================================================================================================================*****************************************======================================================================================</span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <!--示例代码开始-->\n" +
    "        <div class=\"p-3\">\n" +
    "            <h1 class=\"\">左右布局示例</h1>\n" +
    "            <hr class=\"my-4\">\n" +
    "            <p>基本示例代码:</p>\n" +
    "            <pre class=\"bg-light wrapper\">\n" +
    "                &lt;div class=&quot;opx-layout-hflex&quot;&gt;\n" +
    "                    &lt;div&gt;\n" +
    "                        左侧\n" +
    "                    &lt;/div&gt;\n" +
    "                    &lt;div class=&quot;opx-flex-fill&quot;&gt;\n" +
    "                        右侧\n" +
    "                    &lt;/div&gt;\n" +
    "                &lt;/div&gt;\n" +
    "            </pre>\n" +
    "            <p>最外层<code>opx-layout-hflex</code>的高度为父容器的100%。</p>\n" +
    "            <p>页面可以划分多列,每一个<code>div</code>元素代表一列,列宽默认自适应其内容。通常你需要给其中一列添加<code>opx-flex-fill</code>类来让其占满剩余宽度。其它列设置固定宽度或者不做任何设置让其自适应内容\n" +
    "            </p>\n" +
    "            <p>每一列<code>div</code>在高度上撑满父容器，超高内容会被隐藏。你可通过添加工具类<code>scroll-y</code>实现上下滚动。</p>\n" +
    "            <p>上下滚动示例代码:</p>\n" +
    "            <pre class=\"bg-light wrapper\">\n" +
    "                &lt;div class=&quot;opx-layout-hflex&quot;&gt;\n" +
    "                    &lt;div class=&quot;scroll-y&quot;&gt;\n" +
    "                        左侧超高上下滚动\n" +
    "                    &lt;/div&gt;\n" +
    "                    &lt;div class=&quot;opx-flex-fill scroll-y&quot;&gt;\n" +
    "                        右侧超高上下滚动\n" +
    "                    &lt;/div&gt;\n" +
    "                &lt;/div&gt;\n" +
    "            </pre>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"p-3\">\n" +
    "            <h1 class=\"\">左侧带导航菜单左右布局示例</h1>\n" +
    "            <hr class=\"my-4\">\n" +
    "            <p>示例代码:</p>\n" +
    "            <pre class=\"bg-light wrapper\">\n" +
    "                &lt;div class=&quot;opx-layout-hflex&quot;&gt;\n" +
    "                   &lt;!--导航菜单作为最左列--&gt;\n" +
    "                   &lt;div class=&quot;opx-sidebar opx-collapsible w-lg&quot;&gt;\n" +
    "                        &lt;nav class=&quot;opx-sidebar-header opx-sidebar-header-fixed&quot;&gt;\n" +
    "                            &lt;span class=&quot;opx-sidebar-title&quot;&gt;左右布局导航菜单示例&lt;/span&gt;\n" +
    "                        &lt;/nav&gt;\n" +
    "                        &lt;div class=&quot;opx-sidebar-body&quot;&gt;\n" +
    "                            &lt;div class=&quot;list-group list-group-flush&quot;&gt;\n" +
    "                                &lt;a class=&quot;list-group-item list-group-item-light list-group-item-action&quot; ng-repeat=&quot;link in layoutVm.links&quot;&gt;\n" +
    "                                    &lt;span class=&quot;opx-sidebar-collapsed-show text-center&quot;&gt;&lt;i class=&quot;fa fa-datasource-es&quot;&gt;&lt;/i&gt;&lt;/span&gt;\n" +
    "                                    &lt;span class=&quot;opx-sidebar-expand-show&quot;&gt;{{link.label}}&lt;/span&gt;\n" +
    "                                &lt;/a&gt;\n" +
    "                            &lt;/div&gt;\n" +
    "                        &lt;/div&gt;\n" +
    "                    &lt;/div&gt;\n" +
    "                    &lt;div class=&quot;opx-flex-fill scroll-y&quot;&gt;\n" +
    "                        右侧超高上下滚动\n" +
    "                    &lt;/div&gt;\n" +
    "                &lt;/div&gt;\n" +
    "            </pre>\n" +
    "            <p><code>opx-sidebar</code>是导航菜单的父容器,它的高度默认撑满父容器。它下面有两个直接子元素<code>opx-sidebar-header</code>和<code>opx-sidebar-body</code>。\n" +
    "            </p>\n" +
    "            <p>\n" +
    "                菜单支持折叠和展开，你只需要给<code>opx-sidebar</code>添加类<code>opx-collapsible</code>,框架会自动帮你生成折叠按钮。菜单处于展开状态，隐藏包含<code>opx-sidebar-expand-hidden</code>类的元素；菜单处于折叠状态隐藏包含<code>opx-sidebar-collapsed-hidden</code>类的元素。\n" +
    "            </p>\n" +
    "            <p>当<code>opx-sidebar</code>中内容高度大于100%时,它内部会出现纵向滚动条。可以通过给<code>opx-sidebar-header</code>添加<code>opx-sidebar-header-fixed</code>类来固定<code>opx-sidebar-header</code>使其不随其它内容一起滚动。\n" +
    "            </p>\n" +
    "            <p><code>opx-sidebar-header</code>通常会放置两种内容：标题或搜索框。这两个可以单独放置，也可以同时放置。上面的示例代码只有标题，只有搜索框的示例代码如下：</p>\n" +
    "            <pre class=\"wrapper bg-light\">\n" +
    "                &lt;!--你需要自行监听搜索框内容变化来实现过滤效果--&gt;\n" +
    "                &lt;nav class=&quot;opx-sidebar-header border-bottom&quot;&gt;\n" +
    "                    &lt;input type=&quot;text&quot; class=&quot;form-control w-full&quot; placeholder=&quot;请输入搜索关键字&quot;&gt;\n" +
    "                &lt;/nav&gt;\n" +
    "            </pre>\n" +
    "            <br>\n" +
    "            <p>两者同时存在的情况比较特殊，宽度不够用，显示效果也不好。所以框架会自动生成切换按钮来切换两者显示,默认展示标题。示例代码如下：</p>\n" +
    "            <pre class=\"wrapper bg-light\">\n" +
    "                 &lt;nav class=&quot;opx-sidebar-header border-bottom&quot;&gt;\n" +
    "                    &lt;span class=&quot;opx-sidebar-title&quot;&gt;左右布局示例&lt;/span&gt;\n" +
    "                    &lt;input type=&quot;text&quot; class=&quot;form-control w-full opx-sidebar-search&quot; placeholder=&quot;请输入搜索关键字&quot;&gt;\n" +
    "                 &lt;/nav&gt;\n" +
    "            </pre>\n" +
    "        </div>\n" +
    "        <!--        <div class=\"text-center wrapper\" style=\"min-height: 800px;\">-->\n" +
    "        <!--            <p>超高内容 - 宽度自适应内容</p>-->\n" +
    "        <!--        </div>-->\n" +
    "        <!--        <p class=\"text-center wrapper\">底部</p>-->\n" +
    "        <!-- 示例代码结束-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/dev/dev-layout_v.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light navbar-expand bg-light\">\n" +
    "        <div class=\"navbar-brand\">上下布局示例</div>\n" +
    "        <div class=\"ms-auto\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary\"><i class=\"fa fa-rocket\"></i> 右侧按钮\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-flex-fill scroll-y bg-white\">\n" +
    "        <!--示例代码开始-->\n" +
    "        <div class=\"p-5\">\n" +
    "            <h1 class=\"\">上下布局示例</h1>\n" +
    "            <hr class=\"my-4\">\n" +
    "            <p>上下布局通常是指：页面被分成上下两部分，其中一部分内容高度固定（一般是上半部分），另一部分内容高度不确定（可能占不满剩余高度，可能超出剩余高度）。</p>\n" +
    "            <br>\n" +
    "            <p>跟据滚动效果可以划分两类场景：整体滚动和局部滚动。</p>\n" +
    "\n" +
    "            <p>因为内容超限需要滚动时候，父容器出现滚动条，拖动滚动条上下两部分跟随滚动。</p>\n" +
    "            <p>超高整体滚动示例代码:</p>\n" +
    "            <pre class=\"bg-light\">\n" +
    "                    &lt;div class=&quot;opx-layout-vflex scroll-y&quot;&gt;\n" +
    "                        &lt;div&gt;Header&lt;/div&gt;\n" +
    "                        &lt;div class=&quot;opx-flex-fill&quot;&gt;\n" +
    "                            Body\n" +
    "                        &lt;/div&gt;\n" +
    "                    &lt;/div&gt;\n" +
    "            </pre>\n" +
    "            <br>\n" +
    "            <p>局部滚动是因为内容超限需要滚动时时，滚动条出现在超限的那一部分，拖动滚动条只滚动自身内容。</p>\n" +
    "            <p>超高局部滚动示例代码:</p>\n" +
    "            <pre class=\"bg-light\">\n" +
    "                   &lt;div class=&quot;opx-layout-vflex&quot;&gt;\n" +
    "                        &lt;div&gt;Header&lt;/div&gt;\n" +
    "                        &lt;div class=&quot;opx-flex-fill scroll-y&quot;&gt;\n" +
    "                            Body，超高部分\n" +
    "                        &lt;/div&gt;\n" +
    "                    &lt;/div&gt;\n" +
    "            </pre>\n" +
    "        </div>\n" +
    "        end\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-layout.html","<div class=\"opx-layout-hflex\">\n" +
    "    <div class=\"opx-layout-vflex bg-light\">\n" +
    "        <div class=\"opx-sidebar opx-resizable opx-collapsible  w-lg\"  ng-class=\"{'opx-sidebar-collapsed':layoutVm.sidebarCollapsed}\">\n" +
    "            <!--        <div class=\"opx-sidebar-header opx-sidebar-header-fixed border-bottom\" ng-if=\"!layoutVm.hideSidebarHeader\">-->\n" +
    "            <!--            <div>标题</div>-->\n" +
    "            <!--            <input type=\"text\" class=\"form-control op-w-sm\">-->\n" +
    "            <!--            <button type=\"button\" class=\"btn btn-default opx-btn-icon\"><i class=\"fa fa-bars\"></i></button>-->\n" +
    "            <!--            <button type=\"button\" class=\"btn btn-default opx-btn-icon\"><i class=\"fa fa-ellipsis-v\"></i></button>-->\n" +
    "            <!--        </div>-->\n" +
    "            <nav class=\"opx-sidebar-header bg-light\"\n" +
    "                 ng-if=\"!layoutVm.hideSidebarHeader\">\n" +
    "                <button type=\"button\" class=\"btn btn-default opx-btn-icon opx-sidebar-toggler\"\n" +
    "                        title=\"点此可以收起或展开sidebar。最好能够保存sidebar的收起或展开状态，下次用户进入的时候能够自动收起或展开。\"\n" +
    "                        ng-click=\"layoutVm.sidebarCollapsed=!layoutVm.sidebarCollapsed\"><i class=\"fa\"\n" +
    "                                                                                           ng-class=\"layoutVm.sidebarCollapsed?'fa-chevron-right':'fa-bars'\"></i>\n" +
    "                </button>\n" +
    "                <input ng-if=\"layoutVm.sidebarHeaderMode==='form'\" type=\"text\" class=\"form-control op-w-sm\">\n" +
    "                <button ng-if=\"layoutVm.sidebarHeaderMode==='form'\" type=\"button\" class=\"btn btn-default opx-btn-icon\">\n" +
    "                    <i class=\"fa fa-plus\" title=\"sidebar-header里面的按钮不要超过两个，如果有更多的操作，放到dropdown下拉框里面。\"></i></button>\n" +
    "                <div ng-if=\"layoutVm.sidebarHeaderMode==='text'\" class=\"me-auto\" title=\"文字标题左对齐\">文字标题</div>\n" +
    "                <div class=\"dropdown\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default opx-btn-icon dropdown-toggle\" data-bs-toggle=\"dropdown\"><i\n" +
    "                            class=\"fa fa-ellipsis-v\" title=\"用dropdown下拉框来显示更多的操作\"></i></button>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li class=\"dropdown-header\">sidebar-header样式</li>\n" +
    "                        <li><a ng-click=\"layoutVm.sidebarHeaderMode='form'\">带搜索框</a></li>\n" +
    "                        <li><a ng-click=\"layoutVm.sidebarHeaderMode='text'\">纯文字标题</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </nav>\n" +
    "            <div class=\"opx-sidebar-body\">\n" +
    "                <div class=\"list-group list-group-flush\">\n" +
    "                    <a class=\"list-group-item list-group-item-action\"\n" +
    "                       ng-click=\"layoutVm.hideSidebarHeader=!layoutVm.hideSidebarHeader\">切换header\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"list-group\" ng-if=\"layoutVm.showSidebarNav\">\n" +
    "                    <a class=\"list-group-item list-group-action\" ng-repeat=\"link in layoutVm.links\">{{link.label}}</a>\n" +
    "                </div>\n" +
    "                <div style=\"height:800px; background-color:#eee;\" class=\"wrapper\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"opx-layout-vflex opx-flex-fill scroll-y bg-white\">\n" +
    "        <nav class=\"navbar navbar-light navbar-expand bg-light\">\n" +
    "            <div class=\"navbar-brand\">页面左右布局</div>\n" +
    "            <ul class=\"navbar-nav\">\n" +
    "                <li class=\"nav-item\"><a class=\"nav-link\" href=\"javascript:void(0);\">普通Link</a></li>\n" +
    "            </ul>\n" +
    "            <div class=\"nav-item\">\n" +
    "                <button class=\"btn btn-secondary\">左侧按钮</button>\n" +
    "            </div>\n" +
    "            <div class=\"navbar-text\">这是内容区域的工具条，可以设为固定位置或者随内容滚动</div>\n" +
    "            <div class=\"ms-auto\">\n" +
    "                <button type=\"button\" class=\"btn btn-secondary opx-btn-icon opx-btn-flat\"><i\n" +
    "                        class=\"fa fa-share\"></i></button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary opx-btn-icon opx-btn-flat\"><i\n" +
    "                        class=\"fa fa-plus\"></i></button>\n" +
    "                <button type=\"button\" class=\"btn btn-danger opx-btn-icon opx-btn-flat\"><i\n" +
    "                        class=\"fa fa-trash\"></i></button>\n" +
    "                <button type=\"button\" class=\"btn btn-default opx-btn-icon \"><i\n" +
    "                        class=\"fa fa-ellipsis-v\"></i></button>\n" +
    "                <button type=\"button\" class=\"btn btn-primary\"><i class=\"fa fa-rocket\"></i> 右侧按钮\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </nav>\n" +
    "        <section style=\"min-height:1000px;background-color:#eee;\" class=\"p-3\">\n" +
    "            <p>这个页面只是用来演示常见的页面左右布局要素，并非可以照抄HTML代码，在实现中要通过angular标签尽量简化HTML代码。</p>\n" +
    "            <p>设计要求</p>\n" +
    "            <ol>\n" +
    "                <li>内容区域和sidebar都可以单独滚动</li>\n" +
    "                <li>sidebar如果设置了<code>.opx-sidebar-header-fixed</code>， 那么只有sidebar-body滚动，sidebar-header固定保持不动。</li>\n" +
    "                <!--                <li>sidebar如果设置了<code>.opx-resizable</code>，可以左右拖动宽度</li>-->\n" +
    "            </ol>\n" +
    "            <p>侧栏的导航菜单要使用侧栏菜单组件，或者设计一个样式<code>.opx-vertical-nav</code>用于垂直布局的层级导航菜单，这里用<code>list-group</code>只是简单示例</p>\n" +
    "        </section>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-message.html","<div class=\"p-3\">\n" +
    "    <div class=\"mb-3\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"messageVm.openConfirm()\">确认框</button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"messageVm.openAlert()\">提示框</button>\n" +
    "    </div>\n" +
    "    <div class=\"mb-3\">\n" +
    "        <!--        <label class=\"control-label\">对话框大小</label>-->\n" +
    "        <!--        <div class=\"form-control-wrapper\">-->\n" +
    "        <!--            <select class=\"form-select w-sm d-inline-block\" ng-model=\"messageVm.modalSize\"-->\n" +
    "        <!--                    ng-options=\"size as size for size in messageVm.modalSizes\"></select>-->\n" +
    "        <button class=\"btn btn-default me-3\" ng-click=\"messageVm.openModal(size)\"\n" +
    "                ng-repeat=\"size in messageVm.modalSizes\">Modal对话框 {{size}}\n" +
    "        </button>\n" +
    "        <!--        </div>-->\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">Loading</div>\n" +
    "        <div class=\"card-body\" style=\"height:10rem;\">\n" +
    "            <div class=\"op-blank-slate\">\n" +
    "                <div class=\"op-blank-slate-icon\">\n" +
    "                    <i class=\"fa fa-4x fa-pulse fa-spinner fa-fw\"></i>\n" +
    "                </div>\n" +
    "                <p class=\"op-flashing-text\">正在加载</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-3\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-body\">\n" +
    "                    <div style=\"opacity: .25; text-align: center;\">\n" +
    "                        <div class=\"lds-ellipsis\">\n" +
    "                            <div></div>\n" +
    "                            <div></div>\n" +
    "                            <div></div>\n" +
    "                            <div></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <h5>style:default</h5>\n" +
    "                    <div op-loading></div>\n" +
    "                    <h5>style:ellipsis</h5>\n" +
    "                    <div op-loading=\"{style:'ellipsis'}\"></div>\n" +
    "                    <h5>style:spinner</h5>\n" +
    "                    <div op-loading=\"{style:'spinner'}\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-3\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-body op-blank-slate\">\n" +
    "                    <div class=\"op-blank-slate-body\">\n" +
    "                        <div class=\"op-blank-slate-icon\">\n" +
    "                            <i class=\"fa fa-4x fa-inbox\"></i>\n" +
    "                        </div>\n" +
    "                        <p>空白内容提示，用于在没有内容的时候丰富页面显示，应该左右上下居中</p>\n" +
    "                        <button class=\"btn btn-primary\" type=\"button\">新建内容</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-2\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-body op-blank-slate\">\n" +
    "                    <div class=\"op-blank-slate-body\">\n" +
    "                        <div class=\"op-blank-slate-icon\">\n" +
    "                            <i class=\"fa fa-4x fa-inbox\"></i>\n" +
    "                        </div>\n" +
    "                        <p>空白内容提示，用于在没有内容的时候丰富页面显示，应该左右上下居中</p>\n" +
    "                        <button class=\"btn btn-primary\" type=\"button\">新建内容</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-misc.html","<div class=\"p-3\">\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">\n" +
    "            <h3 class=\"card-title\">Regexp</h3>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <textarea class=\"form-control code\" ng-model=\"testString\" rows=\"5\"></textarea>\n" +
    "                <button class=\"m-t btn btn-primary\" ng-click=\"parseRegexp()\">解析</button>\n" +
    "            </div>\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"(key, value) in parseResult track by $index\">\n" +
    "                    <span ng-if=\"key!=='resultJson'\">{{key}}: {{value}}</span>\n" +
    "                    <pre ng-if=\"key==='resultJson'\">{{value | json}}</pre>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-modal.html","<div class=\"p-3\">\n" +
    "    <section>\n" +
    "        <div class=\"card mb-3\">\n" +
    "            <div class=\"card-header\">Modal</div>\n" +
    "            <div class=\"card-body\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label\">Options</label>\n" +
    "                    <div class=\"form-control-wrapper\">\n" +
    "                        <div class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"modalVm.isModaless\" id=\"dm_modaless\"><label\n" +
    "                                for=\"dm_modaless\">Modaless</label>\n" +
    "                        </div>\n" +
    "                        <div class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"modalVm.isResizable\" id=\"dm_resizable\"><label\n" +
    "                                for=\"dm_resizable\">Resizable</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button class=\"btn btn-default me-3\" ng-click=\"modalVm.openModal({size:size})\"\n" +
    "                        ng-repeat=\"size in modalVm.modalSizes\">Size = {{size||'default'}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"mb-3\">\n" +
    "\n" +
    "        </div>\n" +
    "    </section>\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-nav.html","<div class=\"bg-white\">\n" +
    "    <nav class=\"navbar navbar-light bg-light\">\n" +
    "        <div class=\"navbar-brand\">页头样式</div>\n" +
    "        <div class=\"navbar-nav\">\n" +
    "            <ol class=\"breadcrumb\">\n" +
    "                <li class=\"breadcrumb-item\"><a href=\"javascript:void(0)\">首页</a></li>\n" +
    "                <li class=\"breadcrumb-item\"><a href=\"javascript:void(0)\">一级菜单</a></li>\n" +
    "                <li class=\"breadcrumb-item active\">二级菜单</li>\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "        <ul class=\"navbar-nav ms-5\">\n" +
    "            <li class=\"nav-item\"><a class=\"nav-link\"><i class=\"fa fa-chevron-left\"></i></a></li>\n" +
    "            <li class=\"nav-item\"><a class=\"nav-link\">连接</a></li>\n" +
    "        </ul>\n" +
    "        <div class=\"form-inline ms-auto\">\n" +
    "            <div class=\"dropdown\">\n" +
    "                <a class=\"btn btn-default opx-btn-icon\" title=\"执行历史\"\n" +
    "                   data-bs-toggle=\"dropdown\"><i class=\"fa fa-ellipsis-v\"></i></a>\n" +
    "                <div class=\"dropdown-menu dropdown-menu-left\" style=\"max-height:10rem; overflow-y:auto;\">\n" +
    "                    <div class=\"dropdown-header\">最近10次执行记录</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Label</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <input type=\"text\" class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"btn-group\">\n" +
    "                <a class=\"btn btn-default opx-btn-icon\"><i class=\"fa fa-link\"></i></a>\n" +
    "                <a class=\"btn btn-default\">文字连接</a>\n" +
    "                <a class=\"btn btn-default\"><i class=\"fa fa-link\"></i> 文字</a>\n" +
    "            </div>\n" +
    "            <button class=\"btn btn-default opx-btn-icon\"><i class=\"fa fa-rocket-launch\"></i></button>\n" +
    "            <button class=\"btn btn-default\"><i class=\"fa fa-trash\"></i> 删除内容</button>\n" +
    "            <button class=\"btn btn-outline-primary\"><i class=\"fa fa-plus\"></i> 添加内容</button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class=\"p-3\">\n" +
    "        <section>\n" +
    "            <div class=\"card card-default\">\n" +
    "                <div class=\"card-header\">\n" +
    "                    <h4 class=\"card-title\">Tabs样式</h4></div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <div ng-repeat=\"style in navVm.tabStyles track by $index\" class=\"mb-5\">\n" +
    "                        <h4>{{style.name}}</h4>\n" +
    "                        <ul class=\"nav {{style.css}}\" op-tab-bar style=\"width:100%;\" op-tab-bar>\n" +
    "                            <li class=\"nav-item\" ng-repeat=\"item in navVm.tabItems track by $index\"><a class=\"nav-link\"\n" +
    "                                                                                                       ng-click=\"navVm.activeItem=$index\"\n" +
    "                                                                                                       ng-class=\"{active:navVm.activeItem===$index}\">{{item}}</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </section>\n" +
    "        <section>\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-body\">\n" +
    "                    <h4> op-searchbox</h4>\n" +
    "                    <op-searchbox search-text=\"searchText\"></op-searchbox>\n" +
    "                    <h4> op-searchbox autohide</h4>\n" +
    "                    <op-searchbox search-text=\"searchText\" class=\"autohide\"></op-searchbox>\n" +
    "                    <h4> op-searchbox sm</h4>\n" +
    "                    <op-searchbox search-text=\"searchText\" class=\"autohide\"></op-searchbox>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </section>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-popdrop.html","<div class=\"opx-layout-vflex\">\n" +
    "    <nav class=\"navbar navbar-light\">\n" +
    "        <div class=\"opx-navbar-title\">Popup and Dropdown</div>\n" +
    "    </nav>\n" +
    "    <div>\n" +
    "        <div style=\"height:15rem;overflow-y:auto\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <h4 class=\"modal-title\">\n" +
    "                        Modal Title\n" +
    "                    </h4>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body bg-secondary\" style=\"height:10rem; overflow-y:auto;\">\n" +
    "                    <div class=\"alert alert-info\">\n" +
    "                        Modal body is fixed height and scrollable. Want to make dropdown menu fully visible.\n" +
    "                    </div>\n" +
    "                    <button type=\"button\" class=\"btn btn-info\" data-bs-toggle=\"popover\" title=\"Popover title\"\n" +
    "                            data-bs-content=\"And here's some amazing content. It's very engaging. Right?\" opx-dropdown>\n" +
    "                        Bootstrap5 Popover\n" +
    "                    </button>\n" +
    "                    <div class=\"dropdown\">\n" +
    "                        <button class=\"btn btn-primary dropdown-toggle\" type=\"button\" data-bs-toggle=\"dropdown\"\n" +
    "                                data-bs-auto-close=\"false\">\n" +
    "                            Dropdown\n" +
    "                        </button>\n" +
    "                        <div class=\"dropdown-menu\">\n" +
    "                            <div class=\"p-3\" style=\"width:10rem;height:12rem;\">\n" +
    "                                Dropdown Content\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"dropdown\">\n" +
    "                        <button class=\"btn btn-primary dropdown-toggle\" type=\"button\" data-bs-toggle=\"dropdown\"\n" +
    "                                data-bs-auto-close=\"false\">\n" +
    "                            Dropdown2\n" +
    "                        </button>\n" +
    "                        <div class=\"dropdown-menu\">\n" +
    "                            <div class=\"p-3\" style=\"width:10rem;height:12rem;\">\n" +
    "                                Dropdown Content\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div>\n" +
    "                Other element\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"opx-flex-fill p-3\">\n" +
    "        <div class=\"modal-content\" style=\"height:12rem;\">\n" +
    "            <div class=\"modal-header\"><h4 class=\"modal-title\">Dropdown</h4></div>\n" +
    "            <div class=\"modal-body bg-secondary\">\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    Height of the modal body is limited.\n" +
    "                    The dropdown should not cause scroll and always visible.\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <div class=\"dropdown\">\n" +
    "                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-bs-toggle=\"dropdown\">\n" +
    "                            Bootstrap3\n" +
    "                            Dropdown\n" +
    "                        </button>\n" +
    "                        <div class=\"dropdown-menu\">\n" +
    "                            <div ng-include=\"'dropdown-content.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"dropdown\">\n" +
    "                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-bs-toggle=\"dropdown\">\n" +
    "                            Bootstrap5\n" +
    "                            Dropdown\n" +
    "                        </button>\n" +
    "                        <div class=\"dropdown-menu\">\n" +
    "                            <div ng-include=\"'dropdown-content.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"dropdown\">\n" +
    "                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-bs-toggle=\"dropdown\"\n" +
    "                                opx-popdrop>Opx Dropdown\n" +
    "                        </button>\n" +
    "                        <div class=\"dropdown-menu\">\n" +
    "                            <div ng-include=\"'dropdown-content.html'\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <button type=\"button\" class=\"btn btn-info\" data-bs-toggle=\"popover\" title=\"Popover title\"\n" +
    "                            data-bs-content=\"And here's some amazing content. It's very engaging. Right?\" opx-popdrop>\n" +
    "                        Bootstrap5 Popover\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <span op-help-info=\"Use bootstrap5 popover and dropdown. <code>opx-popdrop</code> to handle popover and dropdown.{{'common.action.ok'|translate}}\">Help</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<script type=\"text/ng-template\" id=\"dropdown-content.html\">\n" +
    "    <div class=\"p-3 bg-info\" style=\"width:10rem;height:12rem;\">Dropdown content</div>\n" +
    "</script>\n" +
    "\n" +
    "")

$templateCache.put("app/modules/dev/dev-select.html","<div class=\"row wrapper h-100 scroll-y\">\n" +
    "    <div class=\"card col\">\n" +
    "        <div class=\"card-header\">\n" +
    "            Single Selection\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <ul class=\"list-unstyled bg-light p-3\">\n" +
    "                <li>selectedCity: <code>{{selectVm.selectedCity | json}}</code></li>\n" +
    "            </ul>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Chip Style <code>.opx-check-group</code> </label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"opx-check-group opx-secondary btn-group\">\n" +
    "                        <input ng-repeat-start=\"city in selectVm.cities track by $index\"\n" +
    "                               type=\"radio\" name=\"formSelectedCity\" value=\"{{city.code}}\"\n" +
    "                               id=\"form-radio-opt-{{$index}}\"\n" +
    "                               ng-model=\"selectVm.selectedCity\">\n" +
    "                        <label ng-repeat-end for=\"form-radio-opt-{{$index}}\">{{city.name}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Button Group Style <code>.opx-check-group.btn-group</code></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"opx-check-group btn-group opx-primary\">\n" +
    "                        <input ng-repeat-start=\"city in selectVm.cities track by $index\"\n" +
    "                               type=\"radio\" name=\"formSelectedCityBtnGroup\" value=\"{{city.code}}\"\n" +
    "                               id=\"form_radiobtngroup_opt_{{$index}}\"\n" +
    "                               ng-model=\"selectVm.selectedCity\">\n" +
    "                        <label ng-repeat-end for=\"form_radiobtngroup_opt_{{$index}}\">{{city.name}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Style <code>.radio</code> </label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div ng-repeat=\"city in selectVm.cities track by $index\"\n" +
    "                         class=\"radio radio-inline radio-primary\">\n" +
    "                        <input type=\"radio\" value=\"{{city.code}}\" id=\"form-radio2-opt-{{$index}}\"\n" +
    "                               name=\"formSeclectedCity2\"\n" +
    "                               ng-model=\"selectVm.selectedCity\">\n" +
    "                        <label for=\"form-radio2-opt-{{$index}}\">{{city.name}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card col\">\n" +
    "        <div class=\"card-header\">Multiple Selection</div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <ul class=\"list-unstyled bg-light p-3\">\n" +
    "                <li>selectedCityObject: <code>{{selectVm.selectedCityObject | json}}</code></li>\n" +
    "                <li>selectedCityList: <code>{{selectVm.selectedCityList | json}}</code></li>\n" +
    "                <li>selectedCityString: <code>{{selectVm.selectedCityString | json}}</code></li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Object result</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div ng-repeat=\"city in selectVm.cities track by $index\"\n" +
    "                         class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                        <input type=\"checkbox\" value=\"{{city.code}}\" id=\"form-check-{{$index}}\"\n" +
    "                               ng-model=\"selectVm.selectedCityObject[city.code]\">\n" +
    "                        <label for=\"form-check-{{$index}}\">{{city.name}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Array result</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div ng-repeat=\"city in selectVm.cities track by $index\"\n" +
    "                         class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                        <input type=\"checkbox\" id=\"form-check2-{{$index}}\" multiple\n" +
    "                               checkbox-model=\"selectVm.selectedCityList\" checkbox-value=\"city.code\">\n" +
    "                        <label for=\"form-check2-{{$index}}\">{{city.name}}</label>\n" +
    "                    </div>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\"\n" +
    "                            ng-click=\"selectVm.selectedCityList=['beijing','shanghai']\">Manual Set\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Array result (chip style)</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div ng-repeat=\"city in selectVm.cities track by $index\"\n" +
    "                         class=\"checkbox checkbox-inline checkbox-primary op-select-chip\">\n" +
    "                        <input type=\"checkbox\" id=\"form-check2-{{$index}}\" multiple\n" +
    "                               checkbox-model=\"selectVm.selectedCityList\" checkbox-value=\"city.code\">\n" +
    "                        <label for=\"form-check2-{{$index}}\">{{city.name}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Chip Style</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"opx-check-group\">\n" +
    "                        <input type=\"checkbox\" id=\"form-check4-{{$index}}\" xxmultiple\n" +
    "                               ng-repeat-start=\"city in selectVm.cities track by $index\"\n" +
    "                               value=\"{{city.code}}\"\n" +
    "                               ng-model=\"selectVm.selectedCityObject[city.code]\"\n" +
    "                               xxcheckbox-model=\"selectVm.selectedCityList\" checkbox-value=\"city.code\">\n" +
    "                        <label ng-repeat-end for=\"form-check4-{{$index}}\">{{city.name}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Button Group Style</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"opx-check-group btn-group\">\n" +
    "                        <input type=\"checkbox\" id=\"form-check5-{{$index}}\" xxmultiple\n" +
    "                               ng-repeat-start=\"city in selectVm.cities track by $index\"\n" +
    "                               value=\"{{city.code}}\"\n" +
    "                               ng-model=\"selectVm.selectedCityObject[city.code]\"\n" +
    "                               xxcheckbox-model=\"selectVm.selectedCityList\" checkbox-value=\"city.code\">\n" +
    "                        <label ng-repeat-end for=\"form-check5-{{$index}}\">{{city.name}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">String result: NOT WORK</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div ng-repeat=\"city in selectVm.cities track by $index\"\n" +
    "                         class=\"checkbox checkbox-inline checkbox-primary\">\n" +
    "                        <input type=\"checkbox\" id=\"form-check3-{{$index}}\" multiple\n" +
    "                               value=\"{{city.code}}\"\n" +
    "                               checkbox-model=\"selectVm.selectedCityString\" checkbox-value=\"city.code\"\n" +
    "                               model-datatype=\"dsv\" model-datatype-option=\"comma\">\n" +
    "                        <label for=\"form-check3-{{$index}}\">{{city.name}}</label>\n" +
    "                    </div>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\"\n" +
    "                            ng-click=\"selectVm.selectedCityString='beijing,shanghai'\">Manual Set\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Select (Array)</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <select ng-model=\"selectVm.selectedCityList\" class=\"form-select\"\n" +
    "                            op-select multiple\n" +
    "                            ng-options=\"city.code as city.name for city in selectVm.cities\"></select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Select (CSV)</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <select ng-model=\"selectVm.selectedCityString\" class=\"form-select\"\n" +
    "                            op-select=\"{datatype:'string'}\" multiple\n" +
    "                            ng-options=\"city.code as city.name for city in selectVm.cities\"></select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Checkbox <code>.input-group</code></label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <div class=\"input-group-text\">\n" +
    "                            <div class=\"checkbox\">\n" +
    "                                <input type=\"checkbox\" value=\"foo\" id=\"dc_checkbox_foo\">\n" +
    "                                <label for=\"dc_checkbox_foo\"></label>\n" +
    "                            </div>\n" +
    "                            <input type=\"text\" class=\"form-control\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card col\">\n" +
    "        <div class=\"card-header\">表格内</div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <h5>In table</h5>\n" +
    "            <table class=\"table\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th>\n" +
    "                        <div class=\"checkbox checkbox-inline\">\n" +
    "                            <input type=\"checkbox\" id=\"th-check\">\n" +
    "                            <label for=\"th-check\"></label>\n" +
    "                        </div>\n" +
    "                    </th>\n" +
    "                    <th>\n" +
    "                        <div class=\"radio radio-inline\">\n" +
    "                            <input type=\"radio\" id=\"th-radio\">\n" +
    "                            <label for=\"th-radio\"></label>\n" +
    "                        </div>\n" +
    "                    </th>\n" +
    "                    <th>City</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                <tr ng-repeat=\"city in selectVm.cities track by $index\">\n" +
    "                    <td>\n" +
    "                        <div class=\"checkbox checkbox-inline\">\n" +
    "                            <input type=\"checkbox\" value=\"{{city.code}}\" id=\"td-check-{{$index}}\"\n" +
    "                                   ng-model=\"selectVm.selectedCityObject[city.code]\">\n" +
    "                            <label for=\"td-check-{{$index}}\">{{$index === 10 ? city.name : ''}}</label>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <div class=\"radio radio-inline\">\n" +
    "                            <input type=\"radio\" name=\"tableSelectedCity\" value=\"{{city.code}}\"\n" +
    "                                   id=\"td-radio-{{$index}}\"\n" +
    "                                   ng-model=\"selectVm.selectedCity\">\n" +
    "                            <label for=\"td-radio-{{$index}}\"></label>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        {{city.name}}\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-table.html","<div class=\"p-3\">\n" +
    "    <uib-tabset class=\"tab-container\" type=\"mdc-op\">\n" +
    "\n" +
    "        <uib-tab heading=\"Simple\" index=\"1\">\n" +
    "            <div class=\"card mb-3\">\n" +
    "                <div class=\"card-header\">Promise数据</div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <button type=\"button\" ng-click=\"tableVm.reloadTableData()\" class=\"btn btn-default\">Reload Table Data\n" +
    "                    </button>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">输入JSON格式数组</label>\n" +
    "                        <div class=\"form-control-wrapper\">\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <input type=\"text\" ng-model=\"tableVm.selected\" class=\"form-control\">\n" +
    "                                <div class=\"input-group-append\">\n" +
    "                                    <button type=\"button\" ng-click=\"tableVm.setTableSelected(tableVm.selected)\"\n" +
    "                                            class=\"btn btn-outline-default\">\n" +
    "                                        Set Selected Items\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <p>格式为<code>[{\"id\":\"...\"}]</code></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <opx-datatable table-config=\"tableVm.tableConfig\"></opx-datatable>\n" +
    "                    <div class=\"alert alert-light mt-3\">\n" +
    "                        tableVm.tableConfig.selectedItems=\n" +
    "                        <pre>{{tableVm.tableConfig.selectedItems | json}}</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <!--        <uib-tab heading=\"长内容和导出Excel\" index=\"2\">-->\n" +
    "        <!--            <div class=\"alert alert-info\">多行内容，很长的内容，以及导出Excel的样式</div>-->\n" +
    "        <!--            <div class=\"card mb-3\">-->\n" +
    "        <!--                <div class=\"card-body\">-->\n" +
    "        <!--                    <opx-datatable table-config=\"tableVm.longContentTableConfig\">-->\n" +
    "        <!--                    </opx-datatable>-->\n" +
    "        <!--                </div>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </uib-tab>-->\n" +
    "\n" +
    "        <!--        <uib-tab heading=\"静态HTML\">-->\n" +
    "        <!--            <div class=\"card mb-3\">-->\n" +
    "        <!--                <div class=\"card-header\">静态HTML</div>-->\n" +
    "        <!--                <div class=\"card-body\">-->\n" +
    "        <!--                    <div class=\"table-responsive\">-->\n" +
    "        <!--                        <table id=\"dev-table-html\" class=\"table opx-table\">-->\n" +
    "        <!--                            <thead>-->\n" +
    "        <!--                            <tr>-->\n" +
    "        <!--                                <th>账号</th>-->\n" +
    "        <!--                                <th>姓名</th>-->\n" +
    "        <!--                                <th>部门</th>-->\n" +
    "        <!--                                <th>最后修改时间</th>-->\n" +
    "        <!--                                <th class=\"text-center\">操作</th>-->\n" +
    "        <!--                            </tr>-->\n" +
    "        <!--                            </thead>-->\n" +
    "        <!--                            <tbody>-->\n" +
    "        <!--                            <tr>-->\n" +
    "        <!--                                <td>chenshubin</td>-->\n" +
    "        <!--                                <td>陈树彬</td>-->\n" +
    "        <!--                                <td>玖誉\\DB</td>-->\n" +
    "        <!--                                <td>2020-04-16T01:41:31Z</td>-->\n" +
    "        <!--                                <td class=\"text-center\">-->\n" +
    "        <!--                                    <div class=\"btn-group\">-->\n" +
    "        <!--                                        <button type=\"button\" ng-click=\"showClickMessage('你选择了陈树彬')\"-->\n" +
    "        <!--                                                class=\"btn btn-default btn-sm\">查看-->\n" +
    "        <!--                                        </button>-->\n" +
    "        <!--                                    </div>-->\n" +
    "        <!--                                </td>-->\n" +
    "        <!--                            </tr>-->\n" +
    "        <!--                            </tbody>-->\n" +
    "        <!--                        </table>-->\n" +
    "        <!--                    </div>-->\n" +
    "        <!--                </div>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </uib-tab>-->\n" +
    "        <!--        <uib-tab heading=\"很多列的表格\">-->\n" +
    "        <!--            <div class=\"card mb-3\">-->\n" +
    "        <!--                <div class=\"card-body\">-->\n" +
    "        <!--                    <opx-datatable table-config=\"tableVm.manyColTableConfig\"></opx-datatable>-->\n" +
    "        <!--                </div>-->\n" +
    "        <!--            </div>-->\n" +
    "        <!--        </uib-tab>-->\n" +
    "    </uib-tabset>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/dev-test.html","selectedCityList: {{testVm.selectedCityList}}\n" +
    "<div class=\"form-group\">\n" +
    "    <label class=\"control-label\">op-smart-select</label>\n" +
    "    <div class=\"form-control-wrapper\">\n" +
    "        <op-smart-select ng-model=\"testVm.selectedCityList\" the-items=\"testVm.cities\"\n" +
    "                         options=\"{valueData:'code',labelData:'name',viewAs:'chip'}\"></op-smart-select>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-tree.html","<style type=\"text/css\">\n" +
    "    .tree-zone .card-body {\n" +
    "        max-height: 30rem;\n" +
    "        overflow: auto;\n" +
    "    }\n" +
    "\n" +
    "    .info-zone .card-body {\n" +
    "        max-height: 10rem;\n" +
    "        overflow: auto;\n" +
    "    }\n" +
    "</style>\n" +
    "<div class=\"h-100 bg-white p-3\">\n" +
    "    <div class=\"mt-3 mb-3 row info-zone\">\n" +
    "        <div class=\"col\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-header\">\n" +
    "                    <code>selectedItem</code>\n" +
    "                </div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <pre class=\"p-3 bg-dark text-light\">{{treeVm.selectedItem | json}}</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-header\">\n" +
    "                    <code>clickItem</code>\n" +
    "                </div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <pre class=\"p-3 bg-dark text-light\">{{treeVm.clickItem | json}}</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row tree-zone\">\n" +
    "        <div class=\"col\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-header\"></div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <opx-tree tree-config=\"treeVm.treeConfig1\" ng-model=\"treeVm.selectedItem\"></opx-tree>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-header\"></div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <opx-tree tree-config=\"treeVm.treeConfig2\" ng-model=\"treeVm.selectedItem\"></opx-tree>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col\">\n" +
    "            <div class=\"card\">\n" +
    "                <div class=\"card-header\"></div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <opx-tree tree-config=\"treeVm.treeConfig3\" ng-model=\"treeVm.selectedItem\"></opx-tree>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-uaa.html","<div class=\"p-3\">\n" +
    "    <div class=\"m-b\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"uaaVm.login('ADMIN')\"><i\n" +
    "                class=\"fa fa-user-circle-o\"></i>\n" +
    "            以管理员登录\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-info\" ng-click=\"uaaVm.login()\"><i class=\"fa fa-user-o\"></i> 以普通用户登录\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-warning\" ng-click=\"uaaVm.logout()\"><i class=\"fa fa-sign-out\"></i> Log out\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"m-b\">\n" +
    "        Current User:\n" +
    "        <code>{{$root.$global.currentUser}}</code>\n" +
    "        <ul class=\"list list-unstyled\">\n" +
    "            <li>ID: <span class=\"badge bg-secondary\">{{$root.$global.currentUser.loginId}}</span></li>\n" +
    "            <li>用户名: <span class=\"badge bg-secondary\">{{$root.$global.currentUser.displayName}}</span></li>\n" +
    "            <li>头像: <img ng-src=\"{{$root.$global.currentUser.avatar}}\"/></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-success\" ng-if=\"$root.$global.currentUser.isAuthenticated\">\n" +
    "        这段文字只有登录用户才能看到\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-danger\" ng-if=\"!$root.$global.currentUser.isAuthenticated\">\n" +
    "        还未登录\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\" for=\"du_perm\">是否有权限: <span\n" +
    "                class=\"badge bg-info\">{{$root.$global.currentUser.hasPermission(uaaVm.permission)}}</span></label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"du_perm\" ng-model=\"uaaVm.permission\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\" for=\"du_role\">是否有角色: <span\n" +
    "                class=\"badge bg-info\">{{$root.$global.currentUser.hasRole(uaaVm.role)}}</span></label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"du_role\" ng-model=\"uaaVm.role\">\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-udp.html","<div class=\"p-3 bg-light\">\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">uinput通用输入</div>\n" +
    "        <div class=\"card-body op-smartform op-bold-label\">\n" +
    "            <p>根据参数自动生成控件</p>\n" +
    "            {{udpVm.uinputValues}}\n" +
    "            <udp-input ng-repeat=\"param in udpVm.uinputParams track by $index\"\n" +
    "                       type=\"{{param.type}}\" control=\"{{udpVm.typeCtrls[param.type]||'input'}}\"\n" +
    "                       ng-model=\"udpVm.uinputValues[param.name]\"\n" +
    "                       label=\"{{param.label}}\" showlabel=\"true\"\n" +
    "                       desc=\"{{param.desc}}\" showdesc=\"true\"></udp-input>\n" +
    "            <!--            <udp-input type=\"{{udpVm.singleParam.type}}\" control=\"input\" ng-model=\"udpVm.uinputValues[udpVm.singleParam.name]\"-->\n" +
    "            <!--                       label=\"{{udpVm.singleParam.label}}\" showlabel=\"true\"-->\n" +
    "            <!--                       desc=\"{{udpVm.singleParam.desc}}\" showdesc=\"true\"></udp-input>-->\n" +
    "            <!--            <udp-input type=\"number\" control=\"input\" ng-model=\"udpVm.static\"-->\n" +
    "            <!--                       label=\"static number\" showlabel=\"true\"-->\n" +
    "            <!--                       desc=\"属性没有用变量\" showdesc=\"true\"></udp-input>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">Uinput使用变量</div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <udp-input control=\"{{udpVm.selectCtrl1.control}}\" sourcedef=\"{{udpVm.selectCtrl1.sourcedef}}\"\n" +
    "                       ismultiple=\"'true'\" ng-model=\"udpVm.select_1\"></udp-input>\n" +
    "            <udp-input control=\"{{udpVm.selectCtrl2.control}}\" sourcedef=\"{{udpVm.selectCtrl2.sourcedef}}\"\n" +
    "                       ng-model=\"udpVm.select_2\"></udp-input>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">手写udp页面</div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <udp-page-view page=\"udpVm.customPage\"></udp-page-view>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--    <div class=\"card mb-3\">-->\n" +
    "    <!--        <div class=\"card-header\">内嵌本地页面</div>-->\n" +
    "    <!--        <div class=\"card-body\">-->\n" +
    "    <!--            <udp-page-view page-id=\"udpVm.localPageId\" page-params=\"udpVm.pageParams\"></udp-page-view>-->\n" +
    "    <!--        </div>-->\n" +
    "    <!--    </div>-->\n" +
    "    <!--    <div class=\"card\">-->\n" +
    "    <!--        <div class=\"card-header\">内嵌页面，无navbar</div>-->\n" +
    "    <!--        <div class=\"card-body\">-->\n" +
    "    <!--            <udp-page-view page-id=\"udpVm.pageId\" page-params=\"udpVm.pageParams\"-->\n" +
    "    <!--                           options=\"{navbar:false}\"></udp-page-view>-->\n" +
    "    <!--        </div>-->\n" +
    "    <!--    </div>-->\n" +
    "    <!--    <div class=\"card mb-3\">-->\n" +
    "    <!--        <div class=\"card-header\">内嵌页面</div>-->\n" +
    "    <!--        <div class=\"card-body\">-->\n" +
    "    <!--            <udp-page-view page-id=\"udpVm.pageId\" page-params=\"udpVm.pageParams\"></udp-page-view>-->\n" +
    "    <!--        </div>-->\n" +
    "    <!--    </div>-->\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-umd.html","<div class=\"p-3\">\n" +
    "    <h2>Universal Modeled Data</h2>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header d-flex bg-light\">\n" +
    "            <span>Model Config</span>\n" +
    "            <div class=\"ms-auto\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary opx-btn-ok\" ng-click=\"umdVm.saveModel()\"\n" +
    "                        ng-disabled=\"!modelConfigForm.$valid\">保存模型\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-outline-default\" ng-click=\"umdVm.showModelJson()\">查看模型定义JSON\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <form class=\"op-smartform form-vertical\" name=\"modelConfigForm\">\n" +
    "                <uib-tabset class=\"tab-container\" type=\"mdc-op\" active=\"3\">\n" +
    "                    <uib-tab>\n" +
    "                        <uib-tab-heading>Basic Info</uib-tab-heading>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\">Code</label>\n" +
    "                            <div class=\"form-control-wrapper\">\n" +
    "                                <input type=\"text\" ng-model=\"umdVm.modelConfig.code\" class=\"form-control\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\">Title</label>\n" +
    "                            <div class=\"form-control-wrapper\">\n" +
    "                                <input type=\"text\" ng-model=\"umdVm.modelConfig.title\" class=\"form-control\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab>\n" +
    "                        <uib-tab-heading>Attributes</uib-tab-heading>\n" +
    "                        <span class=\"text-danger\" ng-if=\"!modelConfigForm.modelAttrs.$valid\"><i\n" +
    "                                class=\"fa fa-exclamation-circle\"></i></span>\n" +
    "                        <umd-config-attrs ng-model=\"umdVm.modelConfig.attrs\" name=\"modelAttrs\"\n" +
    "                                          fffng-model-options=\"{allowInvalid:true}\"\n" +
    "                                          options=\"{placement:'#js-model-attrs-config'}\"\n" +
    "                                          xxxregister-instance=\"umdVm.registerInstance($instance)\"></umd-config-attrs>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"3\">\n" +
    "                        <uib-tab-heading>Views</uib-tab-heading>\n" +
    "                        <umd-config-view model-def=\"umdVm.modelConfig\"></umd-config-view>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab index=\"4\">\n" +
    "                        <uib-tab-heading>Operations</uib-tab-heading>\n" +
    "                        <umd-config-operation operation-defs=\"umdVm.modelConfig.operations\"></umd-config-operation>\n" +
    "                    </uib-tab>\n" +
    "                </uib-tabset>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-header\">\n" +
    "            列表查看\n" +
    "        </div>\n" +
    "        <div class=\"card-body\">\n" +
    "            <button type=\"button\" ng-click=\"umdVm.reloadListData()\" class=\"btn btn-default\">Reload Table Data</button>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Input values and mark as selected</label>\n" +
    "                <div class=\"form-control-wrapper\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input type=\"text\" ng-model=\"umdVm.selected\" class=\"form-control\">\n" +
    "                        <div class=\"input-group-append\">\n" +
    "                            <button type=\"button\" ng-click=\"umdVm.markItemsAsSelected(umdVm.selected)\"\n" +
    "                                    class=\"btn btn-outline-default\">Mark as Selected\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <p class=\"help-block\">dev-umd.html:selectedItems = <code>{{umdVm.viewInstance.tableConfig.selectedItems | json}}</code></p>\n" +
    "            </div>\n" +
    "            <umd-data-view view-type=\"'selector'\"\n" +
    "                           model-def=\"umdVm.modelConfig\"\n" +
    "                           the-data=\"umdVm.listDataFn\"\n" +
    "                           options=\"{selectionConfig:umdVm.selectionConfig,tableInstance:umdVm.viewInstance}\"></umd-data-view>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--    <div class=\"card mt-3\">-->\n" +
    "    <!--        <div class=\"card-header\">Model View</div>-->\n" +
    "    <!--        <div class=\"card-body\">-->\n" +
    "    <!--            <umd-data-detail the-data=\"umdVm.detailedData\" the-model=\"umdVm.modelConfig\"></umd-data-detail>-->\n" +
    "    <!--        </div>-->\n" +
    "    <!--    </div>-->\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-virtualscroll.html","<div class=\"p-5 h-100 scroll-y\">\n" +
    "    <div id=\"js_table_container\" class=\"bg-white h-100\" style=\"overflow:auto;\">\n" +
    "        <table class=\"table table-striped\">\n" +
    "            <tbody xvs-repeat=\"{size:48, scrollParent:'#js_table_container'}\">\n" +
    "            <tr ng-repeat=\"dataItem in vsVm.dataList\" style=\"height:48px;\">\n" +
    "                <td ng-repeat=\"(key, value) in dataItem\" nowrap=\"nowrap\">{{value}}</td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/dev/dev-widgets.html","<div class=\"wrapper bg-light\">\n" +
    "    <div class=\"page-header\">\n" +
    "        <h1>Page for widgets test\n" +
    "            <small>uwidget is awesome</small>\n" +
    "        </h1>\n" +
    "    </div>\n" +
    "    <div class=\"card mb-3\">\n" +
    "        <div class=\"card-body\">\n" +
    "<!--            <uwidget uw-type=\"fileselector\" uw-props=\"widgetsVm.fileselectorProps\"></uwidget>-->\n" +
    "            <gfs-file-selector the-model=\"widgetsVm.selectedFiles\"></gfs-file-selector>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"card\">\n" +
    "        <div class=\"card-body\">\n" +
    "            <uwidget uw-type=\"hostselector\" uw-props=\"widgetsVm.hostselectorProps\"></uwidget>\n" +
    "            <uwidget uw-type=\"uinput\" uw-props=\"widgetsVm.hostselectorProps\"></uwidget>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("app/modules/dev/test-modal.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{$ctrl.theMode}}</h4>\n" +
    "    <button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\"\n" +
    "            ng-click=\"$ctrl.cancel()\">\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"bg-light p-3\" style=\"height:10rem;\">modal-body</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-outline-primary\" ng-click=\"$ctrl.openModal({modaless:false})\">Open Another Modal\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"$ctrl.openModal({modaless:true})\">Open Another Modaless\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-default opx-btn-ok\" ng-click=\"$ctrl.cancel()\">Close\n" +
    "    </button>\n" +
    "</div>\n" +
    "")

$templateCache.put("app/modules/dev/translator/edit-row-modal.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">Edit Translation</h4>\n" +
    "    <button class=\"btn-close\" ng-click=\"$ctrl.cancel()\"></button>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <form class=\"op-smartform form-vertical\" ng-cloak>\n" +
    "        <div class=\"form-group\" ng-if=\"$ctrl.isAdd || $ctrl.isRename\">\n" +
    "            <label class=\"control-label\">Key</label>\n" +
    "            <input name=\"key\" class=\"form-control\" ng-model=\"$ctrl.editData.key\" required></input>\n" +
    "            <div class=\"alert alert-danger mt-3\" ng-show=\"$ctrl.validation.error.pattern\">\n" +
    "                Key 需至少包含一个 [.] 符号, 首个 [.] 符号前的字符将作为文件名, 且不能以 [.] 结尾\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger mt-3\" ng-show=\"$ctrl.validation.error.duplicated\">\n" +
    "                该 Key 已存在\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-primary mt-3\" ng-show=\"$ctrl.validation.merge\">\n" +
    "                Merge -- 将删除当前 Key 并将所有文件引用中的当前 Key 替换为输入的新 Key\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"card text-white bg-warning\" ng-show=\"$ctrl.validation.duplicatedTrans.length > 1\">\n" +
    "            <div class=\"card-header\">\n" +
    "                检索到主语言 {{$ctrl.primaryLang.title}} 存在重复项\n" +
    "            </div>\n" +
    "            <div class=\"list-group list-group-flush\" ng-repeat=\"item in $ctrl.validation.duplicatedTrans track by $index\">\n" +
    "                <button class=\"list-group-item text-left\" \n" +
    "                    ngclipboard ngclipboard-success=\"$ctrl.onCopySuccess();\"\n" +
    "                    data-clipboard-text=\"{{item.key}}\"\n" +
    "                    ng-class=\"{active: item.key === $ctrl.rawData.key}\">\n" +
    "                    <i class=\"fa fa-copy\"></i>\n" +
    "                    {{item.key}} : {{item.trans[$ctrl.primaryLang.code]}} : 文件引用: {{item.fileRefCount}} 数据库引用: {{item.dbRefCount}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\" ng-repeat=\"lang in $ctrl.langs track by $index\" ng-if=\"!$ctrl.isRename\">\n" +
    "            <label class=\"control-label\">{{lang.title}}</label>\n" +
    "            <div class=\"form-control-wrapper\">\n" +
    "                <textarea class=\"form-control\" ng-model=\"$ctrl.editData.trans[lang.code]\" rows=\"5\"></textarea>\n" +
    "                <button class=\"btn btn-primary opx-btn-ok mt-3\" ng-click=\"$ctrl.translate()\" ng-if=\"lang.primary\">Translate</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary opx-btn-ok\" ng-show=\"!$ctrl.validation.merge\" ng-click=\"$ctrl.save()\" ng-disabled=\"$ctrl.isLoading || !$ctrl.validation.valid\">Save</button>\n" +
    "    <button class=\"btn btn-primary opx-btn-ok\" ng-show=\"$ctrl.validation.merge\" ng-click=\"$ctrl.merge()\" ng-disabled=\"$ctrl.isLoading || !$ctrl.validation.valid\">Merge</button>\n" +
    "    <button class=\"btn btn-default opx-btn-cancel\" ng-click=\"$ctrl.cancel()\">Cancel</button>\n" +
    "</div>")

$templateCache.put("app/modules/dev/translator/trans-index.html","<!-- <div class=\"opx-layout-vflex\"> -->\n" +
    "    <nav class=\"navbar navbar-light bg-light\">\n" +
    "        <div class=\"opx-navbar-title\">Translator</div>\n" +
    "    </nav>\n" +
    "    <div class=\"opx-layout-hflex\" style=\"height: calc(100% - 40px);\">\n" +
    "        <div class=\"opx-sidebar border-right bg-light\" style=\"width:12rem;\">\n" +
    "            <div class=\"opx-sidebar-body\">\n" +
    "                <div class=\"list-group list-group-flush op-styled-highlight op-styled-highlight-right\">\n" +
    "                    <op-searchbox search-text=\"$ctrl.searchModule\" style=\"width:10rem;\" class=\"m-3\"></op-searchbox>\n" +
    "\n" +
    "                    <a ng-repeat=\"module in $ctrl.modules | filter:$ctrl.searchModule track by $index\"\n" +
    "                    href=\"\"\n" +
    "                    class=\"list-group-item list-group-item-action op-hover-trigger d-flex justify-content-between align-items-center\"\n" +
    "                    title=\"{{module.key || 'Untitled'}}\"\n" +
    "                    ng-class=\"{'active': ((!$ctrl.selectedModule && !module) || module.key === $ctrl.selectedModule)}\"\n" +
    "                    ng-click=\"$ctrl.selectModule(module.key)\"> \n" +
    "                        <div class=\"text-ellipsis m-0\">{{ module.key || 'Untitled' }}</div>\n" +
    "                        <span class=\"badge badge-primary badge-pill\">{{ module.count }}</span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "<!--        <opx-tree tree-config=\"$ctrl.treeConfig\"></opx-tree>-->\n" +
    "        <div class=\"opx-flex-fill\">\n" +
    "            <opx-datatable table-config=\"$ctrl.tableConfig\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"$ctrl.editTranslation(null, true)\"> \n" +
    "                    <i class=\"fa fa-plus-circle\"></i> Add </button>\n" +
    "                <!-- <button type=\"button\" class=\"btn btn-primary\" ng-click=\"$ctrl.saveAll()\"> \n" +
    "                    <i class=\"fa fa-save\"></i> Save </button> -->\n" +
    "                <button type=\"button\" class=\"btn btn-outline-default\" ng-click=\"$ctrl.reloadExternal(true)\">\n" +
    "                    <i class=\"fa fa-sync\"></i> Reload External\n" +
    "                </button>\n" +
    "\n" +
    "                <div class=\"dropdown\">\n" +
    "                    <button type=\"button\" class=\"btn btn-outline-default dropdown-toggle\" data-bs-toggle=\"dropdown\" opx-popdrop>\n" +
    "                        <i class=\"fa fa-sort\" aria-hidden=\"true\"></i>\n" +
    "                        <span class=\"caret\">Select to show other languages</span>\n" +
    "                    </button>\n" +
    "                    <div class=\"dropdown-menu dropdown-menu-end\">\n" +
    "                        <a class=\"dropdown-item\" ng-if=\"!lang.primary\" ng-repeat=\"lang in $ctrl.langs track by $index\"\n" +
    "                            ng-click=\"$ctrl.changeColVisibility(lang)\">{{ lang.code }}\n" +
    "                            <span style=\"float: right;padding-top: 4px\" ng-if=\"lang.visibility\" class=\"fa fa-check\"></span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </opx-datatable>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "<!-- </div> -->")
}]);
})();