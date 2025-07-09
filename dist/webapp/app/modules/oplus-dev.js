/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/21/2017.
 */
(function () {
    'use strict';
    /**
     * Module used for development and test purpose
     */
    angular.module('oplus.dev', ['oplus.udp', 'oplus.uaa', 'oplus.dts']);
})();
/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/21/2017.
 */
(function () {
    'use strict';
    angular.module('oplus.dev').config(['$stateProvider',
        function ($stateProvider) {
            configRoutesForDebug($stateProvider);
        }]);

    function configRoutesForDebug($stateProvider) {
        $stateProvider
            .state('app.dev', {
                url: '/dev',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/dev/dev-index.html',
                        controller: 'DevIndexCtrl'
                    }
                }
            })
            .state('app.translator', {
                url: '/translator',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/dev/translator/trans-index.html',
                        controller: 'DevTranslatorCtrl',
                        controllerAs:'$ctrl'
                    }
                }
            })
            .state('app.dev.component', {
                url: '/:component',
                views: {
                    'component': {
                        templateUrl: function ($stateParams) {
                            return 'app/modules/dev/dev-' + $stateParams.component + '.html'
                        },
                        controller: 'DevComponentCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            });
    }
})();
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/22/2017
 */

(function () {
        'use strict';

        angular.module('oplus.dev').controller('DevIndexCtrl', ['$scope', function ($scope) {
            $scope.components = ['form', 'nav', 'select', 'css', 'colors', 'widgets', 'i18n',
                'dataex', 'editor', 'misc', 'uaa', 'message', 'virtualscroll',
                'condfmt', 'interaction', 'table', 'udp', 'popdrop',
                'jao', 'umd', 'acm', 'customfunc', 'icon', 'test', 'modal', 'tree'];
        }]);

        angular.module('oplus.dev').controller('DevComponentCtrl', DevComponentCtrl);

        DevComponentCtrl.$inject = ['$scope', '$q', '$state', '$interval', '$timeout', '$uibModal', 'cmActions', 'debugTimer', 'widgetInteraction', 'datasetService', '$stateParams',
            'themeService', 'dataEx', 'uaaService', 'messageService', 'currentUser', '$compile', '$http', '$filter', 'jaoJobService', 'gfileService', 'jaoUtil', 'processBuilder', 'modalHelper', 'restUtils'];

        /**
         *
         * @param $scope
         * @param $q
         * @param $state
         * @param $interval
         * @param $timeout
         * @param $uibModal
         * @param {cmActions} cmActions
         * @param {debugTimer} debugTimer
         * @param {widgetInteraction} widgetInteraction
         * @param {datasetService} datasetService
         * @param $stateParams
         * @param {themeService} themeService
         * @param {dataEx} dataEx
         * @param {uaaService} uaaService
         * @param {messageService} messageService
         * @param {currentUser} currentUser
         * @param $compile
         * @param $http
         * @param $filter
         * @param {jaoJobService} jaoJobService
         * @param {gfileService} gfileService
         * @param {jaoUtil} jaoUtil
         * @param {processBuilder} processBuilder
         * @param {modalHelper} modalHelper
         * @param {restUtils} restUtils
         * @constructor
         */
        function DevComponentCtrl($scope, $q, $state, $interval, $timeout, $uibModal, cmActions, debugTimer, widgetInteraction, datasetService, $stateParams,
                                  themeService, dataEx, uaaService,
                                  messageService, currentUser, $compile, $http, $filter, jaoJobService, gfileService, jaoUtil, processBuilder, modalHelper, restUtils) {
            var component = $stateParams.component;
            if (component) {
                try {
                    eval(component + '()');
                } catch (err) {
                    console.warn(err);
                }
            }

            function form() {
                var vm = $scope.formVm = {};
                vm.cssGroups = [
                    {
                        group: 'text',
                        label: '文本',
                        options: [
                            {css: 'pre', desc: '保留换行'},
                            {css: 'bold', desc: '加粗'},
                            {css: 'large', desc: '加大'},
                            {css: 'code', desc: '等宽字体'}
                        ]
                    }, {
                        group: 'layout',
                        label: '布局',
                        options: [
                            {css: 'mt-3', desc: '上方外侧留空白'},
                            {css: 'me-3', desc: '右方外侧留空白'},
                            {css: 'mb-3', desc: '下方外侧留空白'},
                            {css: 'ms-3', desc: '左方外侧留空白'},
                            {css: 'm-3', desc: '四周外侧留空白'},
                            {css: 'p-3', desc: '内容四周内侧留空白'}]
                    }, {
                        group: 'color',
                        label: '字体颜色',
                        options: [
                            {css: 'text-primary', desc: '重点'},
                            {css: 'text-success', desc: '成功'},
                            {css: 'text-info', desc: '提示'},
                            {css: 'text-warning', desc: '警告'},
                            {css: 'text-danger', desc: '危险'}
                        ]
                    }, {
                        group: 'bgcolor',
                        label: '背景颜色',
                        options: [
                            {css: 'bg-white', desc: '白色'},
                            {css: 'bg-light', desc: '浅色'},
                            {css: 'bg-dark', desc: '深色'},
                            {css: 'bg-black', desc: '黑色'},
                            {css: 'bg-primary', desc: '重点'},
                            {css: 'bg-success', desc: '成功'},
                            {css: 'bg-info', desc: '提示'},
                            {css: 'bg-warning', desc: '警告'},
                            {css: 'bg-danger', desc: '危险'}
                        ]
                    }
                ];
            }

            function condfmt() {
            }

            function umd() {
                var vm = $scope.umdVm = {};
                vm.selectionConfig = {
                    labelData: 'hostname',
                    valueData: function (row) {
                        var val = {ip: row.ip, hostname: row.hostname, citype: 'linux'};
                        val = row.ip;
                        return val;
                    },
                    // preselected: '10.0.1.1,10.0.1.4,10.0.1.13',
                    // selectedDatatype: 'String'
                    // preselected: [{value: '10.0.1.1'}, {value: '10.0.1.4'}, {value: '10.0.1.13'}],
                    // selectedDatatype: 'ObjectArray',
                    // preselected:['10.0.1.1', '10.0.1.4', '10.0.1.13'],
                    // selectedDatatype: 'Array'
                };
                vm.showModelJson = function () {
                    modalHelper.openModal({
                        template: '<div class="modal-header"><h4 class="modal-title">Model Config JSON</h4></div>' +
                            '<div class="modal-body" style="height:20rem;"><op-code-editor the-model="$ctrl.modelConfig" options="{syntax:\'javascript\',readonly:true}" class="h-100 scroll-y"></op-code-editor></div>',
                        controller: [function () {
                            this.modelConfig = JSON.stringify(vm.modelConfig, null, '  ');
                        }],
                        controllerAs: '$ctrl'
                    },{resizable:true});
                }
                vm.saveModel = function () {
                    var isValid = $scope.modelConfigForm.modelAttrs.$valid;
                    if (!isValid) {
                        alert('Data is invalid');
                    } else {
                        alert('Save data to database');
                    }
                }
                // restUtils.callApi('acm', 'GET', '/api/acm/cit/vo/citid/ff8080817b51ce10017b51d3f3460000', {code: 'linux'}).then(function (data) {
                $http.get('app/modules/acm/assets/test-model-config.json').success(function (data) {
                    vm.modelConfig = data;
                }).catch(function (err) {
                    console.error(err);
                });
                $http.get('app/modules/acm/assets/test-data-list.json').success(function (data) {
                    vm.detailedData = data[0];
                }).error(function (err) {
                    console.error(err);
                });
                var mockPrefix = 1;
                vm.viewInstance = {};
                vm.reloadListData = function () {
                    vm.viewInstance.tableConfig.reloadData();
                }
                vm.markItemsAsSelected = function (selected) {
                    var items = JSON.parse(selected);
                    vm.viewInstance.tableConfig.markItemsSelected(items);
                }
                vm.listDataFn = function () {
                    var d = $q.defer();
                    $http.get('app/modules/acm/assets/test-data-list.json').success(function (data) {
                        d.resolve(data);
                    });
                    // $timeout(function () {
                    //     var data = [];
                    //     for (var i = mockPrefix; i <= mockPrefix + 100; i++) {
                    //         var record = {
                    //             ip: '10.0.' + mockPrefix + '.' + i,
                    //             hostname: 'mock' + i + '.oplus-example.com',
                    //             admin: 'zhangsan',
                    //             online_status: i % 2 === 0 ? 'online' : 'offline'
                    //         }
                    //         data.push(record);
                    //     }
                    //     d.resolve(data);
                    //     mockPrefix++;
                    // }, 500);
                    return d.promise;
                }
            }

            function acm() {
                var vm = $scope.acmVm = {};
                vm.selectedDevices = [];
                vm.selectMode = "all";
                // vm.selectMode = 'host,group';
                vm.hostselectorPropsOfDropdown = {
                    hosttype: "group",
                    display: {
                        viewAs: 'dropdown',
                    }
                }
                vm.hostselectorPropsOfBtndlg = {
                    hosttype: "group",
                    display: {
                        viewAs: 'btndlg'
                    }
                }
            }

            function popdrop() {
                var vm = $scope.popdropVm = {};

            }

            function interaction() {
                var ajaxParams = {
                    'constant': 'ABC',
                    'repeatVar': '${@.selectedIds}',
                    'pageVar': '${@.selectedIds}',
                    'fieldVar': '${fieldVar}',
                    'globalVar': '${#.user}'
                };
                var ajax = {
                    method: 'GET',
                    url: 'http://localhost:8088/src/webapp/index.html?id=${@.selectedIds}',
                    repeat: {var: '${@.selectedIds}', enabled: true},
                    params: JSON.stringify(ajaxParams)
                };
                var config = {actions: ['ajax'], ajax: ajax};
                var values = {'@': {selectedIds: 'AAA,BBB,CCC'}, 'fieldVar': 'FIELDVAR', '#': {user: 'LEO'}};
                widgetInteraction.handleInteraction($scope, config, values);
            }

            function nav() {
                var vm = $scope.navVm = {};
                vm.tabStyles = [
                    {name: 'tabs', css: 'nav-tabs'},
                    {name: 'pills', css: 'nav-pills'},
                    {name: 'Material Design', css: 'nav-mdc-op'}];
                vm.tabItems = [];
                for (var i = 0; i < 20; i++) {
                    vm.tabItems.push('Nav' + i);
                }
            }

            function layout() {
                var vm = $scope.layoutVm = {};

                vm.sidebarHeaderMode = 'text';
            }

            function test() {
                var vm = $scope.testVm = {};
                vm.cities = [
                    {code: 'beijing', name: '北京'},
                    {code: 'shanghai', name: '上海'},
                    {code: 'none', name: ''},
                    {code: 20, name: '020'},
                    {code: 'guangzhou', name: '广州'}
                ];
                vm.selectedCityList = [];
                vm.selectedCityString = 'shanghai,20';
            }

            function select() {
                var vm = $scope.selectVm = {};
                vm.cities = [
                    {code: 'beijing', name: '北京'},
                    {code: 'shanghai', name: '上海'},
                    {code: 'none', name: ''},
                    {code: 20, name: '020'},
                    {code: 'guangzhou', name: '广州'}
                ];
                vm.selectedCityList = [];
                vm.selectedCityString = 'shanghai,20';
            }

            function i18n() {
                var vm = $scope.i18nVm = {};
                vm.stringText = '#{广州}';
                var testData;
                var content = [];
                for (var i = 0; i < 10; i++) {
                    content.push({title: 'title-' + i});
                }
                testData = {
                    foo: 'foo',
                    bar: 'bar',
                    object: {title: 'obj-title', name: 'obj-name'},
                    array: content
                };
                // testData = content;
                var fields = ['title', 'label', 'foo', 'array.title', 'object.name', 'array'];
                // fields = ['array.title']
                // fields = ['title'];
                var updateDataProperty = function (data, field, fn) {
                    if (angular.isUndefined(data)) {
                        return;
                    }
                    if (angular.isArray(data)) {
                        data.forEach(function (item) {
                            updateDataProperty(item, field, fn);
                        });
                    } else if (angular.isObject(data)) {
                        var paths = field.split('.');
                        var currentPath = paths.shift();
                        var pathValue = data[currentPath];
                        if (!angular.isObject(pathValue)) {
                            fn(data, currentPath);
                        } else {
                            updateDataProperty(pathValue, paths.join('.'), fn);
                        }
                    }
                };
                fields.forEach(function (field) {
                    updateDataProperty(testData, field, function (obj, path) {
                        console.log('fn...', {obj: obj, path: path});
                        obj[path] = obj[path] + '---' + path;
                    })
                    // if (angular.isObject(testData)) {
                    //     var value;
                    //     parts.forEach(function (part) {
                    //         value = testData[part];
                    //         if (angular.isObject(value)) {
                    //
                    //         }
                    //
                    //     });
                    // }
                });
                console.log('Result....', testData);
            }

            function css() {
                var vm = $scope.cssVm = {};
                vm.btnColors = _.map(themeService.getDefinedThemes(), 'id');
                // vm.btnColors = ['btn-default', 'btn-primary', 'btn-secondary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger', 'btn-light', 'btn-dark', 'btn-black', 'btn-link'];
                // vm.btnClasses = [];
                // btnColors.forEach(function (color) {
                //     btnStyles.forEach(function (style) {
                //         var css = style.replace(/\?/g, color);
                //         vm.btnClasses.push(css);
                //     });
                // });
                vm.btnSizes = ['btn-lg', '', 'btn-sm', 'disabled'];
                vm.btnClasses = ['btn-?', 'btn-? opx-btn-flat', 'btn-? opx-btn-icon', 'btn-? opx-btn-icon opx-btn-flat', 'btn-? opx-btn-icon rounded-circle', 'btn-outline-?', 'btn-outline-? opx-btn-icon', 'btn-outline-? opx-btn-icon rounded-circle'];

            }

            function udp() {
                var vm = $scope.udpVm = {};
                vm.pageId = "JxfFnv";
                vm.pageParams = {stockId: 'SH600519'};
                vm.localPageId = 'jao/pages/runlog-list';
                vm.customPage = {html: "<div>Hello World</div>", title: "手写UDP页面"};
                vm.uinputValues = {};
                vm.uinputParams = [
                    {type: 'string', name: 'string_var', defaultValue: '', label: '字符串', desc: '字符串类型'},
                    {type: 'number', name: 'number_var', defaultValue: '', label: '数值类型', desc: '数值类型控件'},
                    {type: 'boolean', name: 'boolean_var', defaultValue: '', label: '布尔类型'},
                    {type: 'date', name: 'date_var', defaultValue: '', label: '日期', desc: '日期类型'},
                    {type: 'host', name: 'host_var', defaultValue: '', label: '主机', desc: '主机类型'}
                ];
                vm.singleParam =
                    {type: 'string', name: 'string_var', defaultValue: '', label: '字符串', desc: '字符串类型'};
                vm.typeCtrls = {
                    'string': 'input',
                    'number': 'input',
                    'boolean': 'checkbox',
                    'host': 'host'
                };
                vm.selectCtrl1 = {control: 'select', sourcedef: 'yaml:- [gz, 广州]\n- [bj, 北京]'};
                $timeout(function () {
                    vm.selectCtrl2 = {control: 'select', sourcedef: 'yaml:- [gz, 广州]\n- [bj, 北京]'};
                }, 1000);
            }

            function dataex() {
                var vm = $scope.dataVm = {};
                vm.exprs = [
                    {
                        expr: 'js:function(){var notExist; return notExist.foo;}',
                        vars: {},
                        desc: 'JS内部错误',
                        defaultSelected: true
                    },
                    {
                        expr: 'js:function(){var data=${notExistVar}; return data;}',
                        vars: {},
                        desc: '变量notExistVar没有定义，没有默认值'
                    },
                    {
                        expr: 'str:{film:"${notExistVar} ${series}"}',
                        vars: {year: 2004, series: 'Supremacy', name: 'The Bourne'},
                        desc: '变量notExistVar没有定义，没有默认值'
                    },
                    {
                        expr: 'str:{film:"${notExistVar || \'Hello\'} ${series}"}',
                        vars: {year: 2004, series: 'Supremacy', name: 'The Bourne'},
                        desc: '变量notExistVar没有定义，使用默认值"Hello"'
                    },
                    {
                        expr: 'js:{film:"${name} ${series}"}',
                        vars: {year: 2004, series: 'Supremacy', name: 'The Bourne'},
                        desc: '错误示例：JS表达式中的变量不能直接放在字符串里面'
                    },
                    {
                        expr: 'js:{film:${name}+" "+${series},year:${year}}',
                        vars: {year: 2004, series: 'Supremacy', name: 'The Bourne'},
                        desc: 'JS表达式中拼接字符串的正确方式'
                    },
                    {
                        expr: 'js:function(){return {film:${name}+" "+${series},year:${year}}}',
                        vars: {year: 2004, series: 'Supremacy', name: 'The Bourne'},
                        desc: '通过函数return返回值，函数体没有后面的()'
                    },
                    {
                        expr: 'js:function(){return {film:${name}+" "+${series},year:${year}}}()',
                        vars: {year: 2004, series: 'Supremacy', name: 'The Bourne'},
                        desc: '函数体可以包括()。主要用以兼容旧版本。'
                    },
                    {
                        expr: 'js:$$.qdata("DEMO_TIME_DS",{numOfRec:1},"timestamp",0,null)',
                        desc: '获取一个数据集的值'
                    },
                    {
                        expr: 'js:$$.addDate(${@.date_monthForNav}||new Date(),parseInt(${@.month_offset}),"months")',
                        vars: {'@': {month_offset: 1}},
                        ignores: ['@.date_monthForNav'],
                        desc: ''
                    },
                    {
                        // expr: 'link:<button class="btn js-op-button btn-primary btn-sm" title="对话框打开" ng-click="click($event)" data-display="{&quot;label&quot;:&quot;对话框打开&quot;,&quot;icon&quot;:&quot;fa-laptop&quot;,&quot;color&quot;:&quot;btn-primary&quot;,&quot;layout&quot;:&quot;icon-left&quot;}" udp-widget-interaction="{&quot;actions&quot;:[&quot;page&quot;,&quot;event&quot;],&quot;page&quot;:{&quot;pageId&quot;:&quot;1514646438451&quot;,&quot;params&quot;:&quot;{\\&quot;param_passIn\\&quot;:\\&quot;js:${key}\\&quot;}&quot;,&quot;target&quot;:&quot;_dialog&quot;},&quot;event&quot;:{&quot;name&quot;:&quot;ttt&quot;}}"> <i class="fa fa-laptop"></i> 对话框打开</button>\n',
                        expr: 'link:<button class="btn js-op-button btn-primary btn-sm" title="对话框打开" ng-click="click($event)" data-display="{&quot;label&quot;:&quot;对话框打开&quot;,&quot;icon&quot;:&quot;fa-laptop&quot;,&quot;color&quot;:&quot;btn-primary&quot;,&quot;layout&quot;:&quot;icon-left&quot;}" udp-widget-interaction="{&quot;actions&quot;:[&quot;page&quot;,&quot;event&quot;],&quot;page&quot;:{&quot;pageId&quot;:&quot;1514646438451&quot;,&quot;params&quot;:&quot;{\\&quot;param_passIn\\&quot;:\\&quot;js:${key}\\&quot;}&quot;,&quot;target&quot;:&quot;_dialog&quot;},&quot;event&quot;:{&quot;name&quot;:&quot;ttt&quot;}}"> <i class="fa fa-laptop"></i> 对话框打开</button>\n' +
                            '<button class="btn js-op-button btn-default btn-sm" title="下方打开" ng-click="click($event)" data-display="{&quot;label&quot;:&quot;下方打开&quot;,&quot;layout&quot;:&quot;icon-right&quot;,&quot;icon&quot;:&quot;fa-angle-down&quot;}" udp-widget-interaction="{&quot;actions&quot;:[&quot;page&quot;],&quot;page&quot;:{&quot;pageId&quot;:&quot;${key}&quot;,&quot;target&quot;:&quot;#detail&quot;,&quot;params&quot;:&quot;{}&quot;}}">下方打开 <i class="fa fa-angle-down"></i> </button>\n' +
                            '<button class="btn js-op-button btn-default opx-btn-icon btn-sm" title="新窗口打开" ng-click="click($event)" data-display="{&quot;label&quot;:&quot;新窗口打开&quot;,&quot;icon&quot;:&quot;fa-share-square-o&quot;,&quot;layout&quot;:&quot;icon-only&quot;}" udp-widget-interaction="{&quot;actions&quot;:[&quot;page&quot;],&quot;page&quot;:{&quot;pageId&quot;:&quot;1514016300675-8&quot;,&quot;target&quot;:&quot;_blank&quot;,&quot;params&quot;:&quot;{}&quot;}}"> <i class="fa fa-share-square-o"></i> </button>',
                        vars: {'key': 'AAAA'},
                        desc: 'LINK表达式'
                    },
                    {
                        expr: 'link:<button class="btn btn-default">Simple Button</button>',
                        vars: {'key': 'AAAA'}
                    },
                    {
                        expr: 'link:<button class="btn btn-info" data-accesscontrol="{&quot;enabled&quot;:true, &quot;by&quot;:&quot;permission&quot;,&quot;allow&quot;:&quot;test:*&quot;,&quot;state&quot;:&quot;disabled&quot;}">Access Control by Permission</button>',
                        vars: {'key': 'AAAA'}
                    },
                    {
                        expr: '<button class="btn js-op-button btn-default btn-sm" title="编辑" ng-click="click($event)" data-display="{&quot;label&quot;:&quot;编辑&quot;}" udp-widget-interaction="{&quot;actions&quot;:[&quot;page&quot;],&quot;page&quot;:{&quot;params&quot;:&quot;{\\&quot;name\\&quot;:\\&quot;${name}\\&quot;,\\&quot;url\\&quot;:\\&quot;${url}\\&quot;,\\&quot;description\\&quot;:\\&quot;${description}\\&quot;,\\&quot;need_approval\\&quot;:\\&quot;${need_approval}\\&quot;,\\&quot;show_type\\&quot;:\\&quot;${show_type}\\&quot;,\\&quot;post_type\\&quot;:\\&quot;${post_type}\\&quot;,\\&quot;id\\&quot;:\\&quot;${id}\\&quot;,\\&quot;created_by\\&quot;:\\&quot;${created_by}\\&quot;,\\&quot;created_at\\&quot;:\\&quot;${created_at}\\&quot;,\\&quot;config\\&quot;:\\&quot;${config}\\&quot;}&quot;,&quot;pageId&quot;:&quot;1540786246911&quot;,&quot;target&quot;:&quot;_dialog&quot;}}">编辑</button>',
                        vars: {'config': '{"method":"post","mediaType":"application/json; charset=utf-8"}'}
                    },
                    {
                        expr: 'link:<button class="btn" udp-widget-interaction="{&quot;actions&quot;:[&quot;page&quot;,&quot;event&quot;],&quot;page&quot;:{&quot;pageId&quot;:&quot;1514646438451&quot;,&quot;params&quot;:&quot;{\\&quot;param_passIn\\&quot;:\\&quot;js:${key}\\&quot;}&quot;,&quot;target&quot;:&quot;_dialog&quot;},&quot;event&quot;:{&quot;name&quot;:&quot;ttt&quot;}}"> Simple Interaction</button>',
                        vars: {'key': 'AAAA'}
                    }
                ];
                vm.evalExpr = function () {
                    var result = dataEx.evalVarExpr(vm.selectedItem.expr, vm.selectedItem.vars, {
                        debugKey: 'dateex-dev-debug',
                        ignores: vm.selectedItem.ignores
                    });
                    console.log('evalExpr', {result: result});
                    if (result && angular.isFunction(result.then)) {
                        result.then(function (data) {
                            vm.exprResult = data;
                        });
                    } else {
                        vm.exprResult = result;
                    }
                };
                $scope.$watch('dataVm.selectedItem', function (newVal, oldVal) {
                    if (!newVal) return;
                    var preview = $('#js-dd-preview');
                    preview.html(dataEx.evalVarExpr(newVal.expr, newVal.vars));
                    $compile(preview)($scope);
                }, true);
                vm.selectedItem = _.find(vm.exprs, {defaultSelected: true});

                function joinDs() {
                    var apiUrl = 'http://39.108.158.150/njs/fda/api/xueqiu', stockId = 'SH603883';
                    var dsFin = {
                        id: 'DEMO_REST_DS',
                        params: {url: apiUrl + '?url=https://xueqiu.com/stock/f10/finmainindex.json?symbol=' + stockId + '&page=1&size=100}'},
                        filter: 0,
                        fields: 'list'
                    };
                    var dsBal = {
                        id: 'DEMO_REST_DS',
                        params: {url: apiUrl + '?url=https://xueqiu.com/stock/f10/balsheet.json?symbol=' + stockId + '&page=1&size=100}'},
                        filter: 0,
                        fields: 'list'
                    };
                    $$.joinDs([dsFin, dsBal], ['reportdate']).then(function (res) {
                        // console.log(res);
                    }).catch(function (err) {
                        console.error(err);
                    });
                }

                vm.valuesToConvert = [
                    {data: 'ABC', format: 'date', expect: null},
                    {data: 12345, format: 'date'},
                    {data: '2018年12月01日', format: 'date'},
                    {data: '2018年12月01日', format: 'date', formatter: 'YYYY年MM月DD日'},
                    {data: '2018-12-01', format: 'date'},
                    {data: '2018-12-01', format: 'number'},
                    {data: '2018年12月01日', format: 'number'},
                    {data: 'abc', format: 'number'},
                    {data: '54321', format: 'number'},
                    {data: '76%', format: 'number'},
                    {data: '1e+3', format: 'number'},
                    {data: '123,000.01', format: 'number'},
                    {data: null, format: 'number'},
                    {data: undefined, format: 'number'},
                    {data: 12345, format: 'string'},
                    {data: new Date(), format: 'string'},
                    {data: null, format: 'string'},
                    {data: undefined, format: 'string'},
                    {data: '2018-07-18', format: 'string', dataType: 'date', formatter: 'YYYY年M月D日'},
                    {data: '2018-07-23 21:00:00', format: 'string', dataType: 'date', formatter: 'YYYY-MM-DD HH:mm:ss'},
                    {data: 'true', format: 'boolean'},
                    {data: 'True', format: 'boolean'},
                    {data: '1', format: 'boolean'},
                    {data: 'yes', format: 'boolean'}
                ];
                vm.valuesToConvert.forEach(function (value) {
                    value.result = dataEx.convertData(value.data, value.format, {
                        formatter: value.formatter,
                        dataType: value.dataType
                    });
                });
                // console.log(vm.valuesToConvert);
            }


            function widgets() {
                var vm = $scope.widgetsVm = {};
                vm.hostselectorProps = {a: 'aaa'};

                // $scope.datasetProps = {"id": "上证指数相关性"};
                // $scope.selectedDs = {};
                // // $scope.theModel=new Date();
                // vm.navProps = {
                //     items: [
                //         {title: '表格', type: 'page', link: {pageId: '1503980638114', params: ''}},
                //         {title: '图形', type: 'page', link: {pageId: '15038194354842'}, active: true},
                //         {title: '实时数据', type: 'page', link: {pageId: '15038194354849'}},
                //         {title: 'item4', link: {}}
                //     ],
                //     display: {
                //         target: '#js-nav-target'
                //     }
                // };
                // $scope.kpiProps = {
                //     dataset: {
                //         id: '各省GDP'
                //     },
                //     kpiName: {field: '地区'},
                //     kpiValue: {field: '2015年'},
                //     link: '',
                //     display: {
                //         defaultColor: 'bg-light',
                //         width: 'col-sm-2',
                //     }
                // };
                // $scope.jobProps = {
                //     title: '一键作业',
                //     display: {cardMode: true},
                //     job: 'mockjob-1',
                //     params: [
                //         {name: 'username', label: '用户名', control: 'userlist'},
                //         {name: 'host', label: '主机', control: 'serverlist'},
                //         {name: 'note', label: '说明', control: 'textarea'}
                //     ]
                // };
                // $scope.linechartProps = {
                //     "yAxis": [
                //         {
                //             "field": "SSE",
                //             "label": "上证指数"
                //         },
                //         {
                //             "field": "CPI",
                //             "convertFn": "parseFloat(${CPI})"
                //         },
                //         {
                //             "field": "1-Yr Int Rate",
                //             "label": "1年期利率"
                //         }
                //     ],
                //     "display": {
                //         "cardMode": true,
                //         "pointRadius": 1
                //     },
                //     "dataset": {id: "上证指数相关性"},
                //     "xAxis": {
                //         "field": "Month",
                //         "order": "asc",
                //         "label": "月份"
                //     },
                //     "yAxes": [
                //         {
                //             "field": "SSE",
                //             "label": "上证指数",
                //             "position": "left"
                //         },
                //         {
                //             "field": "CPI",
                //             "label": "CPI",
                //             "position": "right",
                //             "convertFn": ""
                //         },
                //         {
                //             "field": "IntRate",
                //             "label": "1年利率",
                //             "position": "right",
                //             "convertFn": ""
                //         },
                //         {
                //             "label": "CPI-Int",
                //             "position": "right",
                //             "convertFn": "${CPI}-${IntRate}"
                //         }
                //     ]
                // };
                //
                // $scope.barchartProps = {
                //     dataset: {id: "各省GDP"},
                //     xAxis: {field: '地区'},
                //     yAxes: [{field: '2015年', convertFn: ''}]
                // };
                // $scope.piechartProps = {
                //     dataset: {id: "各省GDP"},
                //     xAxis: {field: '地区'},
                //     yAxes: [{field: '2015年'}]
                // };
                // $scope.datatableProps = {
                //     dataset: {id: "各省GDP"},
                //     fields: [
                //         {name: "地区", label: "地区"},
                //         {name: "2015年", label: "2015"},
                //         {
                //             name: "Action",
                //             label: "Action",
                //             defaultContent: '<button class="btn btn-default" ng-click="testClick()">Click</button>'
                //         }
                //     ],
                //     display: {
                //         height: '200px'
                //     }
                // };
                // $scope.chinaMapProps = {
                //     title: '中国地图',
                //     dataset: {id: "各省GDP"},
                //     xAxis: {field: '地区', label: '地区'},
                //     yAxes: [{field: '2015年', label: '2015年GDP', convertFn: ''}],
                //     display: {
                //         cardMode: true,
                //         height: '400px'
                //     }
                // };
                // $scope.routeProps = {
                //     title: '路线图',
                //     dataset: {id: "Route"},
                //     _fields: {
                //         from: {field: 'FROM_CITY', convertFn: ''},
                //         to: {field: 'TO_CITY', convertFn: ''},
                //         value: {field: 'VALUE', convertFn: ''}
                //     },
                //     display: {
                //         cardMode: true,
                //         zoomable: true,
                //         height: '400px',
                //         mapType: 'china'
                //     }
                // };
            }

            function colors() {
                var vm = $scope.colorsVm = {};
                vm.theTheme = {};
                vm.paletteColors = themeService.getColorPickerPalette();
                // vm.cardThemes = themeService.getCardThemes();
            }

            function editor() {
                var vm = $scope.editorVm = {};
                vm.availSyntaxes = ['javascript', 'ansiblelog', 'xml'];
                // vm.theCode = 'function() {\n' +
                //     '  console.log("Hello World");\n' +
                //     '}';
                vm.syntax = 'ansiblelog';
                vm.openModal = function () {
                    var modalInstance = modalHelper.openModal({
                        modaless: true,
                        size: 'md',
                        template: '<div class="modal-header"><h4 class="modal-title">Console</h4>\n' +
                            '    <button type="button" class="btn-default opx-btn-flat opx-btn-icon op-close-window" ng-click="$ctrl.close()"\n' +
                            '            data-dismiss="modal"><i class="far fa-times"></i></button></div>' +
                            '<div class="modal-body">' +
                            '<op-code-editor the-model="$ctrl.content" options="{theme:\'opluscode\',syntax:\'ansiblelog\',readonly:true}"></op-code-editor>' +
                            '</div>',
                        controller: [function () {
                            this.content = vm.theCode;
                            this.close = function () {
                                modalInstance.dismiss();
                            };
                        }],
                        controllerAs: '$ctrl'
                    }, {resizable: true});
                }
                $http.get('app/modules/dev/testdata/test-codemirror-ansible-log.txt').then(function (resp) {
                    vm.theCode = resp.data;
                });
            }

            function misc() {
                $scope.testString = '127.0.0.1 | SUCCESS => {\\n    "changed": true, \\n    "rc": 0, \\n    "stderr": "", \\n    "stdout": "####begin\\\\nhost#mem_total=number#mem_used=number#mem_rate=number#cpu_total=number#cpu_idle=number#cpu_use=number\\\\niZwz9hzt4px5hkdhj4y3s7Z#3951#3276#82.91571753986332574000#105998997#104870213#1.06490064240890883200\\\\n####end\\\\n", \\n    "stdout_lines": [\\n        "####begin", \\n        "host#mem_total=number#mem_used=number#mem_rate=number#cpu_total=number#cpu_idle=number#cpu_use=number", \\n        "iZwz9hzt4px5hkdhj4y3s7Z#3951#3276#82.91571753986332574000#105998997#104870213#1.06490064240890883200", \\n        "####end"\\n    ]\\n}';
                $scope.parseRegexp = function () {
                    var str = $scope.testString;
                    var matches = /(\S*) \| (\w*) => (.*)/.exec(str);
                    var result;
                    if (matches) {
                        var json = matches[3].replace(/([^\\n])\\n/g, '$1\n');
                        // console.log(json);
                        result = {hostkey: matches[1], status: matches[2], resultJson: JSON.parse(json)}
                    }

                    $scope.parseResult = result;
                };
            }

            function customfunc() {
                var vm = $scope.customfuncVm = {};
                var dataList = [
                    {
                        title: 'Array of Object',
                        data: [
                            {
                                ip: '192.168.1.1',
                                hostname: 'host1',
                                admin: 'zhangsan'
                            },
                            {
                                ip: '192.168.1.2',
                                hostname: 'host2',
                                admin: 'lisi'
                            }
                        ]
                    }, {
                        title: 'String',
                        data: '192.168.1.1'
                    }, {
                        title: 'Array of String',
                        data: ['192.168.1.1', '192.168.1.2']
                    }, {
                        title: 'Array of Array',
                        data: [['192.168.1.1', 'host1', 'zhangsan'], ['192.168.1.2', 'host2', 'lisi']]
                    }
                ];
                var htmls = [];
                dataList.forEach(function (item) {
                    htmls.push({title: item.title, html: $$.toTableHtml(item.data)});
                });
                vm.htmls = htmls;
            }

            function message() {
                var vm = $scope.messageVm = {};
                vm.openConfirm = function () {
                    messageService.confirm('Confirm', "Call by messageService.confirm", function () {
                        alert('You click OK');
                    }, function () {
                        alert('You click Cancel');
                    });
                };
                vm.openAlert = function () {
                    messageService.alert('Alert', 'Call by messageService.alert');
                };
            }

            function uaa() {
                $scope.uaaVm = {
                    login: function (role) {
                        var expTimestamp = 3 * 24 * 60 * 60 * 1000 + Date.now();
                        if (role === 'ROLE_ADMIN')
                            currentUser.setUserInfo({
                                loginId: 'devadmin',
                                displayName: 'Dev Admin',
                                roles: ["ROLE_ADMIN"],
                                permissions: ["*"]
                            }, expTimestamp);
                        else
                            currentUser.setUserInfo({
                                loginId: 'devuser',
                                displayName: 'Dev User',
                                roles: ["ROLE_USER"],
                                permissions: []
                            }, expTimestamp);
                    },
                    logout: function () {
                        currentUser.clearUserInfo();
                    }
                };
            }

            function tree() {
                var vm = $scope.treeVm = {};
                vm.treeConfig1 = {
                    data: function () {
                        var apiPath = '/app/modules/dev/testdata/opx-tree-test1.json';
                        return restUtils.callApi('', 'GET', apiPath);
                    },
                    dataAlgorithm: 'ByPath',
                    algorithmConfig: {leadingSeparator: true},
                    mcheckType: 'not-used',
                    selector: 'single',
                    // selector: 'multiple',
                    selectionData: function (node) {
                        return {value: node.key, label: node.title}
                    },
                    onClickNode: function (data) {
                        vm.clickItem = data;
                    },
                    nodeRender: function (node) {
                        node.title = node.title || '&nbsp;'
                        if (node.data) {
                            node.title = node.data.name || node.key;
                            if (node.data.total)
                                node.title += '<span class="ms-2 badge bg-secondary">' + node.data.total + '</span>'
                        }
                    }
                }
                vm.treeConfig2 = {
                    data: function () {
                        var apiPath = '/app/modules/dev/testdata/opx-tree-test2.json';
                        return restUtils.callApi('', 'GET', apiPath);
                    },
                    dataAlgorithm: 'ByPath',
                    algorithmConfig: {pathField: 'key', pathSeparator: '.', leadingSeparator: false},
                    mcheckType: 'not-used',
                    selector: 'single',
                    onClickNode: function (data) {
                        vm.clickItem = data;
                    }
                };
                vm.treeConfig3 = {
                    data: function () {
                        var d = $q.defer();
                        var apiPath = 'http://81.71.132.81/oplus-dts/api/dts/q/data/ACM_GET_ALL_GROUP/';
                        restUtils.callApi('', 'GET', apiPath).then(function (data) {
                            d.resolve(_.filter(data.records, {ci_type: 'linux'}));
                        }).catch(function (err) {
                            d.reject(err);
                        });
                        return d.promise;
                    },
                    algorithmConfig: {leadingSeparator: true},
                    mcheckType: 'not-used',
                    selector: 'single',
                    onClickNode: function (data) {
                        vm.clickItem = data;
                    },
                    nodeRender: function (node) {
                        node.title = node.title || '&nbsp;'
                        if (node.data) {
                            node.title = node.data.name || node.key;
                            if (node.data.total)
                                node.title += '<span class="ms-2 badge bg-secondary">' + node.data.total + '</span>'
                        }
                    }
                }
            }

            function modal() {
                var vm = $scope.modalVm = {};
                vm.modalSizes = ['sm', '', 'md', 'lg', 'xl'];
                var modalConfig = {
                    // template: '<div class="modal-header">' +
                    //     '<h4 class="modal-title">Modal Header</h4>' +
                    //     '<button class="btn-close" ng-click="$ctrl.cancel()"><i class="fa fa-times"></i></button>' +
                    //     '</div>' +
                    //     '<div class="modal-body">Body...</div>',
                    templateUrl: 'app/modules/dev/test-modal.html',
                    controllerAs: '$ctrl'
                };
                var modalOptions = {
                    resizable: true
                };
                vm.openModal = function (options) {
                    var size = options.size;
                    var modaless = angular.isDefined(options.modaless) ? options.modaless : vm.isModaless;
                    var instance = modalHelper.openModal({
                        modaless: modaless,
                        templateUrl: 'app/modules/dev/test-modal.html',
                        controller: ['$scope', function ($scope) {
                            var that = this;
                            this.openModal = vm.openModal;
                            this.text = '';
                            this.theMode = modaless ? 'modaless' : 'modal',
                                this.modalSizes = vm.modalSizes;
                            for (var i = 0; i < 3; i++) {
                                that.text += 'line ' + i + '\n';
                            }
                            this.cancel = function () {
                                instance.dismiss();
                            };
                        }],
                        controllerAs: '$ctrl',
                        size: size
                    }, {resizable: vm.isResizable});
                }
            }

            function jao() {
                var vm = $scope.jaoVm = {};
                vm.openStaticLog = function () {
                    $http.get('app/modules/dev/testdata/test-codemirror-ansible-log.txt').then(function (resp) {
                        var content = resp.data;
                        jaoJobService.openRealtimeConsole({content: content});
                    });
                };
                vm.openRealtimeLog = function () {
                    var runId = '4e455862d36a415f8f62bbbc4a752da0';
                    jaoJobService.openRealtimeConsole({runId: runId});
                };
                vm.openProcessModal = function () {
                    var modal = modalHelper.openModal({
                        template: '<div class="modal-header"><h4 class="modal-title">流程图</h4></div>' +
                            '<div class="modal-body">' +
                            '<jao-process-modeler process-model="$ctrl.processModel"' +
                            ' options="$ctrl.modelerOptions"' +
                            ' register-modeler="$ctrl.registerModeler($modeler)"></jao-process-modeler></div>' +
                            '<div class="modal-footer">' +
                            '<button class="btn btn-default opx-btn-cancel" ng-click="$ctrl.close()">关闭</button>' +
                            '</div>',
                        controller: ['$scope', function ($scope) {
                            var modeler;
                            var that = this;
                            this.processModel = vm.testProcessModel;
                            this.modelerOptions = {readonly: true, showElems: ['inventory'], canvasCss: 'bg-secondary'};
                            this.close = function () {
                                modal.dismiss();
                            };
                            this.registerModeler = function (m) {
                                modeler = m;
                            }
                            var stop = $interval(function updateStatus() {
                                var taskIds = _.map(that.processModel.tasks, function (t) {
                                    return t.id;
                                });
                                var id = taskIds[Math.floor(Math.random() * taskIds.length)];
                                modeler.highlightTask(id);
                            }, 3000);
                            $scope.$on('$destroy', function () {
                                $interval.cancel(stop);
                                stop = undefined;
                            });

                        }],
                        controllerAs: '$ctrl',
                        size: 'lg'
                    }, {draggable: true, resizable: true});
                }
                $http.get('app/modules/jao/process/test-process.json').then(function (res) {
                    vm.testProcessModel = res.data;
                }, function (err) {
                    throw err;
                });
                vm.allRunStatusDefs = jaoUtil.jobStatusDefs;
                vm.scriptFile = {repoType: 'git', repo: '$tnt', path: 'demo/list-users.sh'};
                vm.playbookPath = '巡检/system_check_all/site.yml';
                vm.playbookPath = '补丁管理/oplus-vap/site.yml';
                // vm.playbookPath='巡检/basic-linux-check/site.yml';
                vm.selectedHosts = [];
                vm.hostStatusDefs = jaoUtil.hostStatusDefs;
                vm.taskStatusDefs = jaoUtil.taskStatusDefs;
                vm.runStatus = 'default';
                vm.changeButtonStyle = function (status) {
                    // var style = 'INNER_ICON';
                    var style = 'OUTLINE';
                    // var style = 'GLOW';
                    $('#js-btnlist button').each(function (elem) {
                        jaoUtil.changeRunStatusStyle($(this), status, {style: style});
                    });
                }
                for (var i = 0; i < 200; i++) {
                    var ip = _.random(10, 200) +
                        '.' + _.random(10, 200) +
                        '.' + _.random(10, 200) +
                        '.' + _.random(10, 200);
                    vm.selectedHosts.push({key: ip});
                }
                var jsonFile = 'job-result-view-test.json';
                jsonFile = 'job-result-view-gmcc20210328.json';
                jsonFile = 'job-result-view-cac_debug.json';
                jsonFile = 'job-result-view-command.json';
                $http.get('app/modules/dev/testdata/' + jsonFile).then(function (resp) {
                    vm.resultData = resp.data;
                }, function (resp) {
                    console.error(resp);
                });
                // gfileService.getPlaybookInfo('$tnt', '补丁管理/oplus-vap/site.yml').then(function (data) {
                //     console.log(data);
                // }).catch(function (err) {
                //     throw err;
                // });
            }

            function virtualscroll() {
                console.log("Run virtualscroll function");
                var vm = $scope.vsVm = {};
                vm.dataList = [];
                for (var i = 0; i < 1000; i++) {
                    var dataItem = {};
                    vm.dataList.push(dataItem);
                    for (var j = 0; j < 20; j++) {
                        dataItem['attr_' + j] = (i + 1) + ', ' + (j + 1);
                    }
                }
            }

            function icon() {
                var vm = $scope.iconVm = {};
                vm.oplusIcons = {features: {icons: ['udp', 'udp-page', 'dts', 'dts-dataset', 'jao', 'jao-job', 'acm', 'gfs', 'gfs-script', 'gfs-staticfs', 'applet']}}
                vm.btnColors = [{color: 'primary'}, {color: 'default'}, {color: 'secondary'}, {color: 'danger'}];
                vm.btnStyles = [{style: 'outline', title: 'outline'}, {style: '', title: 'Default'}];
                vm.standardIcons = [
                    {icon: 'fa-list', text: '列表'},
                    {icon: 'fa-grip-horizontal', text: '查看详情'},
                    {icon: 'fa-pencil', text: '编辑'},
                    {icon: 'fa-trash-alt', text: '删除'},
                    {icon: 'fa-chevron-right', text: '运行'},
                    {icon: 'fa-plus', text: '新建'},
                    {icon: 'fa-search', text: '搜索'},
                    {icon: 'fa-sync-alt', text: '刷新'}
                ];
            }

            function table() {
                var vm = $scope.tableVm = {};
                vm.clickEdit = function (message) {
                    messageService.toast('success', 'clickEdit', message);
                };
                vm.clickDelete = function (message) {
                    messageService.toast('danger', 'clickDelete', message);
                }
                vm.reloadTableData = function () {
                    vm.tableConfig.reloadData();
                }
                vm.setTableSelected = function (selected) {
                    var items = JSON.parse(selected);
                    vm.tableConfig.markItemsSelected(items);
                }
                var sample = {
                    "Lpar&Domain名称": 1,
                    "阵列机房号": "深圳市南山区",
                    "应用辅助IP": "无",
                    "资源池负责人": "李四1",
                    "状态": "现网",
                    "管理口IP": [
                        "172.16.0.9"
                    ],
                    "服务器型号": "9119-MHE-1",
                    "移动负责人": "张三1",
                    "硬盘大小*数量(IOU板数量)": "fas",
                    "厂商/应用联系人/手机号": "亚信_电子渠道/张山/18888888888",
                    "硬件微码级别": "IBM,FW840.23 (SC840_118)",
                    "id": "ff80808178f3ea860178f3eb96b30000",
                    "Kernel": "4.4.180-102-default",
                    "mutualTrust": 1,
                    "承载应用": "短厅\\短厅手机业务\\能力开放\\集团考核",
                    "备注/(对应刀框序列号)": "无",
                    "品牌": "redhat",
                    "阵列序列号": 1,
                    "zone(仅适用于oracle小型机)": "global1",
                    "网管机IP": "无",
                    "IP": "a001.oplus-example.com",
                    "机架号": "AC1",
                    "系统软件数据库及版本": "oracle 12C 64bit",
                    "处理器主频(GHz)": 4.25,
                    "资源池": "深圳资源池",
                    "主机名": "VM-0-9-sles",
                    "内存(GB)": 7854,
                    "一级分类域": "A1域",
                    "总容量": "11312G",
                    "阵列型号": "DS 1",
                    "阵列连接情况": "现网",
                    "备注": "无",
                    "连接的光纤交换机": "GDNG3BOSS_HY_HX_HDS8510A/10.252.187.175  位置：深圳市南山区\nGDNG3BOSS_HY_HX_HDS8510B/10.252.187.177  位置：河源高新区移动二机楼4F-401机房、AG10",
                    "阵列设备号": "无",
                    "内存个数": "无",
                    "内网系统IP1": "127.0.0.1",
                    "每处理器核数": 4,
                    "接维时间": "无",
                    "connLatestStatus": 1,
                    "设备类型": "小型机",
                    "网卡绑定子网卡": "无",
                    "处理器个数": 4,
                    "机房号": "深圳市南山区",
                    "应用类别": "测试",
                    "移动资产标签": "GMCC 1",
                    "处理器类型": [
                        "0",
                        "AuthenticAMD",
                        "AMD EPYC Processor",
                        "1",
                        "AuthenticAMD",
                        "AMD EPYC Processor",
                        "2",
                        "AuthenticAMD",
                        "AMD EPYC Processor",
                        "3",
                        "AuthenticAMD",
                        "AMD EPYC Processor"
                    ],
                    "OS": "SLES1",
                    "路径": "/Shenzhen/DefaultOplus/VM5",
                    "是否为测试机": "否",
                    "维保类型": "原厂,设备未验收，维保时间待定",
                    "所在部门": "渠道室1",
                    "hostKey": "a001.oplus-example.com",
                    "LUN容量及个数": "独享\n200G*10 RAID10\n100G*3  RAID10\n与DB2共享\n200G*39 RAID10\n100G*12 RAID10\n2G*6    RAID10",
                    "是否归卓望维护（操作系统是否属于卓望维护则属于归卓望维护）": "是",
                    "系统名称": "渠道生产平台",
                    "集群版本": "oracle 12.1.0.2.0",
                    "集群类型": "主机NG3QD-880-1-DB01与主机NG3QD-880-1-DB02互为RAC",
                    "SN序列号": "84D0EC1",
                    "Oplus纳管ip": "a001.oplus-example.com",
                    "总核数/总线程数": 128,
                    "外网系统IP1": "a001.oplus-example.com",
                    "网卡绑定类型": {
                        "features": {
                            "tx_sit_segmentation": "off [fixed]",
                            "tx_checksumming": "on",
                            "tx_checksum_ip_generic": "on",
                            "l2_fwd_offload": "off [fixed]",
                            "large_receive_offload": "off [fixed]",
                            "tx_vlan_stag_hw_insert": "off [fixed]",
                            "highdma": "on [fixed]",
                            "tx_vlan_offload": "off [fixed]",
                            "tcp_segmentation_offload": "on",
                            "rx_checksumming": "on [fixed]",
                            "tx_ipip_segmentation": "off [fixed]",
                            "rx_fcs": "off [fixed]",
                            "tx_scatter_gather_fraglist": "off [fixed]",
                            "ntuple_filters": "off [fixed]",
                            "tx_lockless": "off [fixed]",
                            "scatter_gather": "on",
                            "hw_tc_offload": "off [fixed]",
                            "tx_nocache_copy": "off",
                            "udp_fragmentation_offload": "on",
                            "loopback": "off [fixed]",
                            "generic_segmentation_offload": "on",
                            "tx_gre_segmentation": "off [fixed]",
                            "generic_receive_offload": "on",
                            "fcoe_mtu": "off [fixed]",
                            "tx_tcp_ecn_segmentation": "on",
                            "tx_scatter_gather": "on",
                            "rx_vlan_stag_hw_parse": "off [fixed]",
                            "tx_tcp6_segmentation": "on",
                            "tx_checksum_sctp": "off [fixed]",
                            "tx_tcp_segmentation": "on",
                            "tx_checksum_fcoe_crc": "off [fixed]",
                            "tx_udp_tnl_segmentation": "off [fixed]",
                            "rx_vlan_filter": "on [fixed]",
                            "rx_vlan_stag_filter": "off [fixed]",
                            "rx_vlan_offload": "off [fixed]",
                            "busy_poll": "on [fixed]",
                            "tx_checksum_ipv6": "off [fixed]",
                            "rx_all": "off [fixed]",
                            "tx_fcoe_segmentation": "off [fixed]",
                            "tx_checksum_ipv4": "off [fixed]",
                            "tx_gso_robust": "on [fixed]",
                            "receive_hashing": "off [fixed]",
                            "vlan_challenged": "off [fixed]",
                            "netns_local": "off [fixed]"
                        },
                        "ipv4": {
                            "broadcast": "172.16.15.255",
                            "address": "172.16.0.9",
                            "netmask": "255.255.240.0",
                            "network": "172.16.0.0"
                        },
                        "hw_timestamp_filters": [],
                        "module": "virtio_net",
                        "promisc": false,
                        "pciid": "virtio0",
                        "active": true,
                        "timestamping": [
                            "tx_software",
                            "rx_software",
                            "software"
                        ],
                        "macaddress": "52:54:00:0c:62:5b",
                        "type": "ether",
                        "device": "eth0",
                        "mtu": 1500
                    },
                    "二级分类域": "深圳资源池",
                    "connRate": 100,
                    "登录方式": "ssh",
                    "能否随时停机": "否",
                    "primaryKey": "a001.oplus-example.com"
                };
                vm.manyColTableConfig = {
                    columns: _.map(Object.keys(sample), function (e) {
                        return {data: e, title: e};
                    }),
                    data: [function () {
                        return $http.get('app/modules/dev/testdata/table-manycol.json');
                    }, 'data.records', false]
                };

                vm.selectedItems = [{
                    "id": "ff8080817879376501791252882200a5"
                }, {"id": "ff808081781bb2370178488afe050014"}];
                vm.longContentTableConfig = {
                    columns: [
                        {
                            data: 'play'
                        },
                        {
                            data: 'task'
                        },
                        {
                            data: 'hostKey'
                        },
                        {
                            data: 'status',
                            render: function (data, type, row, meta) {
                                var colors = {
                                    ok: 'success',
                                    skipped: 'secondary',
                                    failed: 'danger',
                                    changed: 'info'
                                };
                                return '<span class="badge bg-' + colors[data] + '">' + data + '</span>';
                            }
                        },
                        {
                            data: 'output',
                            className: 'text-wrap',
                            _extra: {linelimit: true, linebreak: true}
                        }
                    ],
                    data: [function () {
                        return $http.get('/app/modules/dev/testdata/table-long-content.json');
                    }, ''],
                    buttons: ['excel', 'reload'],
                    selection: {labelData: 'fullName', valueData: 'login'}
                };
                vm.tableConfig = {
                    columns: [
                        {data: 'login', title: '账号'},
                        {data: 'fullName', title: '姓名'},
                        {
                            data: 'department',
                            title: '部门',
                            _extra: {autoFilter: true}
                        },
                        {data: 'lastModifiedDate', title: '更新时间'},
                        {
                            title: '操作',
                            class: 'text-center',
                            searchable: false,
                            orderable: false,
                            render: function (data, type, row, meta) {
                                var message = '选择了' + row['login'] + ': ' + row['fullName'];
                                return '<button type="button" ng-click="tableVm.clickEdit(\'' + message + '\')" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"><i class="far fa-pencil"></i></button> ' +
                                    '<button type="button" ng-click="tableVm.clickDelete(\'' + message + '\')" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"><i class="far fa-trash-alt"></i></button>';
                            }
                        }
                    ],
                    data: [function () {
                        return $http.get('app/modules/dev/testdata/table-users.json');
                    }, 'data'],
                    buttons: ['excel', 'colvis', 'reload'],
                    order: [[4, 'desc']],
                    selection: {
                        valueData: function (row) {
                            var val = {id: row.id, login: row.login, name: row.fullName};
                            return val;
                        },
                        valueComparator: function (self, other) {
                            return self.id === other.id;
                        },
                        labelData: 'fullName',
                        preselected: vm.selectedItems
                    }
                };
                vm.clickButton = function () {
                    messageService.alert('选中', vm.selectedUsers);
                }
            }
        }
    }
)();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2022/01/04
 */

(function () {
        'use strict';


        angular.module('oplus.dev').controller('DevTranslatorCtrl', DevTranslatorCtrl);

        DevTranslatorCtrl.$inject = ['$scope', '$q', '$state', 'restUtils', 'translatorService', 'modalHelper', 'messageService'];

        /**
         *
         * @param $scope
         * @param $q
         * @param $state
         * @param {restUtils} restUtils
         * @param {translatorService} translatorService
         * @param {modalHelper} modalHelper
         * @param {messageService} messageService
         * @constructor
         */
        function DevTranslatorCtrl($scope, $q, $state, restUtils, translatorService, modalHelper, messageService) {
            var that = this;
            var forceReload;

            this.langs = [
                {code: 'zh-cn', title: '中文简体', primary: true},
                {code: 'zh-tw', title: '中文正體'},
                {code: 'en', title: 'English'},
                // {code: 'fr', title: 'French'},
            ];

            this.persistenceData = []

            this.visibleCols = []

            var ALL_MODULES = { key: 'ALL', count: 0 };
            this.modules = [ALL_MODULES];
            this.selectedModule = ALL_MODULES.key;
            this.searchModuleTxt = '';

            this.$onInit = onInit;
            this.clickFileRef = clickFileRef;
            this.editTranslation = editTranslation;
            this.reloadExternal = reloadExternal;
            this.saveAll = saveAll;
            this.selectModule = selectModule;
            this.changeColVisibility = changeColVisibility;
            this.onCopySuccess = onCopySuccess;
            this.remove = remove;

            function saveAll() {
                var data = [];
                that.persistenceData.forEach(function (item) {
                    data.push({key: item.code, trans: item.trans});
                });
                translatorService.saveAllTrans(data).then(function (result) {
                    var html = '<ul>' +
                        '<li>Languages: ' + result.langs.join(', ') + '</li>' +
                        '<li>Files: ' + result.fileCount + '</li>' +
                        '<li>Keys: ' + result.keyCount + '</li>' +
                        '</ul>';
                    messageService.toast('success', 'Success', JSON.stringify(result));
                }).catch(function (err) {
                    messageService.toast('error', 'Error', err.message);
                });
            }

            function reloadExternal(needConfirm) {
                if (needConfirm) {
                    messageService.confirm('Confirm Reload', 'Reload data will lose any unsaved change. Are you sure?', function ok() {
                        doReload();
                    });
                }
                else doReload()

                function doReload() {
                    forceReload = true;
                    that.tableConfig.reloadData();
                    console.log('reloadExternal: call done');
                }
            }

            function onInit() {
                loadData();

                var columns = [
                    {
                        title: 'Copy',
                        render: function (data, type, row, meta) {
                            return '<button class="btn btn-default" ngclipboard ngclipboard-success="$ctrl.onCopySuccess();" ' +
                                    'data-clipboard-text="' + row.key + '"> <i class="fa fa-copy"></i> Copy </button> ';
                        }
                    },
                    {
                        title: 'Key',
                        data: 'key',
                        render: function (data, type, row, meta) {
                            if (!data) {
                                return '';
                            }
                            var html = `<a class="text-primary" ng-click="$ctrl.editTranslation('${data}')">${data}</a>`;
                            return html;
                        }
                    }];
                that.langs.forEach(function (lang) {
                    lang.colIndex = columns.push({
                        title: lang.title,
                        data: 'trans.' + lang.code,
                        visible: lang.primary || false,
                        width: '30%',
                        render: function (data, type, row, meta) {
                            return data;
                        }
                    }) - 1;
                });
                columns = columns.concat([
                    {
                        title: '文件引用',
                        data: 'refs',
                        render: function (data, type, row, meta) {
                            var count = _.filter(data, function (o) { return o.refererType === 'file'}).length;
                            if (count === 0) return '';
                            var html = '<span class="badge badge-primary badge-pill" ng-click="$ctrl.clickFileRef(\'' + row.key + '\')">' + count + '</span>';
                            return html;
                        }
                    },
                    {
                        title: '数据库引用', data: 'refs',
                        render: function (data, type, row, meta) {
                            var count = _.filter(data, function (o) { return o.refererType !== 'file'}).length;
                            if (count === 0) return '';
                            var html = '<span class="badge badge-primary badge-pill" ng-click="$ctrl.clickFileRef(\'' + row.key + '\')">' + count + '</span>';
                            return html;
                        }
                    },
                    {
                        title: 'Action',
                        render: function (data, type, row, meta) {
                            var renameBtn = `<button type="button" class="btn btn-warning me-2" ng-click="$ctrl.editTranslation('${row.key}', false, true)">` +
                                                '<i class="fa fa-eraser"></i> Rename </button>'
                            var removeBtn = `<button type="button" class="btn btn-danger me-2" ng-click="$ctrl.remove('${row.key}')">` +
                                                '<i class="fa fa-trash-alt"></i> Remove </button>'
                            return `${_.filter(row.refs, function (o) { return o.refererType !== 'file'}).length > 0 ? '' : renameBtn}${Object.values(row.refs).length > 0 ? '' : removeBtn}`;
                        }
                    }
                ]);
                this.tableConfig = {
                    // selection: {labelData: 'key', valueData: 'key'},
                    data: loadData,
                    columns: columns,
                    buttons: ['reload']
                };
            }

            function editTranslation(transKey, isAdd, isRename) {
                // console.log('editTranslation: key=%o,rowId=%o', transKey, rowId);
                var rawData = _.find(that.persistenceData, { key: transKey }) || {key: undefined, trans: {}, refs: []};
                var modalInstance = modalHelper.openModal({
                    templateUrl: 'app/modules/dev/translator/edit-row-modal.html',
                    controller: ['onCopySuccess', '$scope', function (onCopySuccess, $scope) {
                        var self = this;
                        this.onCopySuccess = onCopySuccess;
                        this.scope = $scope;
                        this.langs = that.langs;
                        this.isAdd = isAdd || false;
                        this.isRename = isRename || false;
                        this.editData = angular.copy(rawData);
                        this.isLoading = false;
                        this.primaryLang = _.find(self.langs, function (f) { return f.primary })
                        this.validation = {
                            valid: false,
                            error: {}
                        }
                        this.cancel = function () {
                            modalInstance.dismiss();
                        };

                        this.scope.$watch('$ctrl.editData.key', function (n, o) {
                            if (!n) return;
                            if (!(self.isAdd || self.isRename)) {
                                self.validation.valid = true;
                                return;
                            }

                            checkKeyCompliant();
                            checkKeyDuplicate();
                            if (self.isRename) checkPrimaryLangDuplicate(rawData);

                            function checkKeyCompliant() {
                                self.validation.error['pattern'] = !/\.[a-zA-Z_]+/g.test(n) || n.endsWith('.');
                            }

                            function checkKeyDuplicate() {
                                var findTrans = _.find(that.persistenceData, function (f) { return f.key === n });
                                var findPrefixTrans = _.find(that.persistenceData, function (f) { return f.key.startsWith(n) });
                                if (!self.isRename) self.validation.error['duplicated'] = !!findTrans;
                                else {
                                    self.validation.error['duplicated'] = (n === rawData.key || (findTrans ? findTrans.trans[self.primaryLang.code] !== rawData.trans[self.primaryLang.code] : false));
                                    self.validation.merge = (findTrans ? findTrans.trans[self.primaryLang.code] === rawData.trans[self.primaryLang.code] : false);
                                }
                                
                                self.validation.valid = _.every(self.validation.error, e => !e);
                            }
                        }, true);


                        this.scope.$watch('$ctrl.editData.trans[$ctrl.primaryLang.code]', function (n, o) {
                            checkPrimaryLangDuplicate(self.editData);
                        })

                        function checkPrimaryLangDuplicate(data) {
                            self.validation.duplicatedTrans = _.filter(that.persistenceData, function (f) { return f.trans[self.primaryLang.code] === data.trans[self.primaryLang.code] });
                            self.validation.duplicatedTrans = self.validation.duplicatedTrans.map(m => {
                                return Object.assign(m, {
                                    fileRefCount: m.refs.filter(f => f.type === 'file').length,
                                    dbRefCount: m.refs.filter(f => f.type !== 'file').length,
                                })
                            })
                        }

                        this.save = function () {
                            self.isLoading = true;
                            if (self.isRename) {
                                translatorService.rename(rawData.key, self.editData.key).then(function (res) {
                                    messageService.alertSuccess('Success', res);
                                    // _.remove(that.persistenceData, function(item) { return item.key === rawData.key });
                                    // that.persistenceData.unshift(self.editData);
                                    that.reloadExternal(false);
                                    // that.tableConfig.reloadData();
                                    modalInstance.close(self.editData);
                                }).catch(function (e) {
                                    messageService.alertError('Error', e);
                                }).finally(function () {
                                    self.isLoading = false;
                                })
                            }
                            else {
                                translatorService.save(self.editData).then(function (res) {
                                    messageService.alertSuccess('Success', res);
                                    if (!transKey) that.persistenceData.unshift(self.editData);
                                    else _.merge(that.persistenceData, [self.editData]);
                                    that.tableConfig.reloadData();
                                    modalInstance.close(self.editData);
                                }).catch(function (e) {
                                    messageService.alertError('Error', e);
                                }).finally(function () {
                                    self.isLoading = false;
                                })
                            }
                            
                        }

                        this.merge = function () {
                            translatorService.merge(rawData.key, self.editData.key).then(function (res) {
                                messageService.alertSuccess('Success', res);
                                that.reloadExternal(false);
                                modalInstance.close(self.editData);
                            }).catch(function (e) {
                                messageService.alertError('Error', e);
                            }).finally(function () {
                                self.isLoading = false;
                            })
                        }

                        this.translate = function () {
                            if (!self.editData.trans[self.primaryLang.code]) {
                                messageService.toast('error', 'No Content');
                                return;
                            }

                            var needTranslateArr = _.filter(self.langs, function (f) {return !f.primary});
                            needTranslateArr.forEach(function (item) {
                                translatorService.translate(self.editData.trans[self.primaryLang.code], item.code).then(function (res) {
                                    self.editData.trans[item.code] = res;
                                })
                            })
                        }
                    }],
                    controllerAs: '$ctrl',
                    resolve: {
                        onCopySuccess: function () {
                            return onCopySuccess;
                        }
                    }
                });
            }

            function clickFileRef(key) {
                var keyRefs = _.find(that.persistenceData, function (o) {
                    return o.key === key;
                });
                var modalInstance = modalHelper.openModal({
                    template: '<div class="modal-header">' +
                        '<h4 class="modal-title">{{$ctrl.keyRefs.key}}</h4>' +
                        '<button class="btn-close" ng-click="$ctrl.close()"></button> ' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<table class="table opx-table">' +
                        '<thead>' +
                        '<tr>' +
                        '<th>Type</th>' +
                        '<th>Referer</th>' +
                        '<th>Count</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr ng-repeat="ref in $ctrl.keyRefs.refs">' +
                        '<td>{{ref.refererType}}</td>' +
                        '<td>{{ref.referer}}</td>' +
                        '<td>{{ref.count}}</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>',
                    resolve: {
                        keyRefs: function () {
                            return keyRefs;
                        }
                    },
                    controller: ['keyRefs', function (keyRefs) {
                        this.keyRefs = keyRefs;
                        this.close = function () {
                            modalInstance.dismiss();
                        }
                    }],
                    controllerAs: '$ctrl'
                }, {resizable: !true});
            }

            function loadData() {
                var d = $q.defer();
                console.log('loadData: forceReload=%o', forceReload);
                if (forceReload === true || that.persistenceData.length === 0) {
                    messageService.toast('primary', 'Data Loading...')
                    var promise = translatorService.listAllTrans(forceReload);
                    forceReload = false;
                    promise.then(function (data) {
                        that.persistenceData = data;
                        ALL_MODULES.count = data.length;
                        var moduleKeys = _.filter(_.uniq(_.map(data, function (m) { return m.key.substr(0, m.key.indexOf('.')) })), f => f)
                        that.modules = _.concat(ALL_MODULES, _.map(moduleKeys, function (m) {
                            return {
                                key: m,
                                count: filterData(m).length
                            }
                        }));
                        // that.selectedModule = that.modules && that.modules.length > 0 ? that.modules[0] : '';
                        d.resolve(filterData(that.selectedModule));
                        messageService.toast('success', 'Data Load Completed')
                    }).catch(function (err) {
                        d.reject(err);
                    }).finally(function () {
                        forceReload = false;
                    });
                } else {
                    ALL_MODULES.count = that.persistenceData.length;
                        var moduleKeys = _.filter(_.uniq(_.map(that.persistenceData, function (m) { return m.key.substr(0, m.key.indexOf('.')) })), f => f)
                    that.modules = _.concat(ALL_MODULES, _.map(moduleKeys, function (m) {
                        return {
                            key: m,
                            count: filterData(m).length
                        }
                    }));
                    d.resolve(filterData(that.selectedModule));
                }
                return d.promise;

                function filterData(prefix) {
                    var tmpData = _.cloneDeep(that.persistenceData);
                    if (prefix === ALL_MODULES.key) return tmpData;
                    return _.filter(tmpData, function (f) { return f.key.startsWith(prefix) })
                }
            }

            function selectModule(module) {
                that.selectedModule = module;
                that.tableConfig.reloadData();
                that.tableConfig.getTableApi().page(0)
            }

            function changeColVisibility(lang) {
                lang.visibility = !lang.visibility;
                that.tableConfig.getTableApi().column(lang.colIndex).visible(lang.visibility);
            }

            function onCopySuccess() {
                messageService.toast('success', 'Copy Successfully!')
            }

            function remove(key) {
                messageService.confirmDanger('Info', 'Are you sure you want to remove the key?', function () {
                    translatorService.remove(key).then(function (res) {
                        messageService.alertSuccess('Success', res);
                        _.remove(that.persistenceData, function(item) { return item.key === key });
                        that.tableConfig.reloadData();
                    }).catch(function (e) {
                        messageService.alertError('Error', e);
                    }).finally(function () {
                        self.isLoading = false;
                    })
                })
            }
        }
    }
)();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/4, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').service('translatorService', ['$q', '$http', 'restUtils', 'i18nService', translatorService]);

    /**
     * @ngdoc service
     * @name translatorService
     * @description
     */
    function translatorService($q, $http, restUtils, i18nService) {
        this.listAllTrans = listAllTrans;
        this.saveAllTrans = saveAllTrans;
        this.translate = translate;
        this.save = save;
        this.rename = rename;
        this.merge = merge;
        this.remove = remove;

        /**
         *
         * @param {[{key:string,trans:{'zh-cn':string,'zh-tw':string,'en':string}}]} trans All translation data
         * @return {Promise<{langs:[string], keyCount:number, fileCount:number}>}
         */
        function saveAllTrans(trans) {
            return restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/translations', null, trans);
        }

        /**
         *
         * @return {Promise<[{key:string,"zh-cn":string,"zh-tw":string,refs:[{}]}]>}
         */
        function listAllTrans(forceReload) {
            var d = $q.defer();
            var translations;
            var begin = Date.now();
            restUtils.callApi('', 'GET', 'http://localhost:3001/api/i18n/translations').then(function (data) {
                console.log('LoadTranslations: %d ms', Date.now() - begin);
                begin = Date.now();
                translations = data;
                var apiPath = 'http://localhost:3001/api/i18n/references';
                if (forceReload) {
                    apiPath += '?forceReload=true';
                }
                return restUtils.callApi('', 'GET', apiPath);
            }).then(function (references) {
                console.log('LoadReferences: %d ms', Date.now() - begin);
                translations.forEach(function (trans) {
                    var key = trans.key;
                    var find = _.find(translations, {key: key});
                    if (find) {
                        find.refs = references[key] ? references[key].refs : [];
                    }
                });
                d.resolve(translations);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function _listAllTrans() {
            var d = $q.defer();
            restUtils.callApi('', 'GET', 'http://localhost:3001/api/i18n/translations').then(function (data) {
                d.resolve(data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function translate(text, to) {
            var defer = $q.defer();
            if (to === 'zh-tw') defer.resolve(i18nService.translateTwp(text, null, true));
            else {
                restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/translate', null, { text: text, to: to })
                    .then(function (res) {
                        defer.resolve(res);
                })
                .catch(function (e) {
                    defer.reject(e);
                });
            } 
            return defer.promise;
        }

        // {key: string, trans: Array[{langCode: string}, ...]}
        function save(editData) {
            var defer = $q.defer();
            restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/save', null, editData)
                .then(function (res) {
                    defer.resolve(res);
            })
            .catch(function (e) {
                defer.reject(e);
            });
            return defer.promise;
        }

        // {key: string, trans: Array[{langCode: string}, ...]}
        function rename(oldKey, newKey) {
            var defer = $q.defer();
            restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/rename', null, {oldKey: oldKey, newKey: newKey})
                .then(function (res) {
                    defer.resolve(res);
                })
                .catch(function (e) {
                    defer.reject(e);
                });
            return defer.promise;
        }

        // {key: string, trans: Array[{langCode: string}, ...]}
        function merge(oldKey, newKey) {
            var defer = $q.defer();
            restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/merge', null, {oldKey: oldKey, newKey: newKey})
                .then(function (res) {
                    defer.resolve(res);
                })
                .catch(function (e) {
                    defer.reject(e);
                });
            return defer.promise;
        }

        // {key: string, trans: Array[{langCode: string}, ...]}
        function remove(key) {
            var defer = $q.defer();
            restUtils.callApi('', 'POST', 'http://localhost:3001/api/i18n/remove', null, { key })
                .then(function (res) {
                    defer.resolve(res);
                })
                .catch(function (e) {
                    defer.reject(e);
                });
            return defer.promise;
        }
    }
})();
