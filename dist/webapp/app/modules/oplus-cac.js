/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    angular.module('oplus.cac', ['oplus.commons', 'vs-repeat']);
})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {

    "use strict";

    angular.module("oplus.cac").factory("cacService", cacService);

    cacService.$inject = ["$http", "cacDao", 'currentUser'];

    function cacService($http, cacDao, currentUser) {

        function prepareDatatable(selector, options) {
            var defaultOptions = {
                autoWidth: false,
                deferRender: true,
                processing: true,
                lengthMenu: [10, 25, 50, 100],
                colReorder: true,
                stateSave: true,//datatable分页刷新后 固定在当前页
                retrieve: true,//和destroy一起，用于屏蔽Cannot reinitialise DataTable提示的
                destroy: true,
                serverSide: false,//true表示服务器端分页，false表示前端分页
                pagingType: "full_numbers",
                //dom: '<"dataTables_header"<"dataTables_toolbar" <"dataTables_controls" r>f>>t<"dataTables_footer row"<"col-md-6" <"pull-left" l><"pull-left" i>><"col-md-6"p>><"clearfix">',
                dom: '<"dataTables_header"<"dataTables_toolbar" <"dataTables_controls" >f>>t<"dataTables_footer row"<"col-md-6" <"pull-left" l><"pull-left" i>><"col-md-6"p>><"clearfix">',
                createdRow: function (row, data, dataIndex) {
                },
                initComplete: function () {
                }
            };

            var tableOption = $.extend(true, {}, defaultOptions);
            if (options != null) {
                $.extend(true, tableOption, options);
            }
            return angular.element(selector).DataTable(tableOption);
        }

        function deleteAuditJsonAttr(json) {
            //删除json的属性
            for (var i = 0; i < json.length; i++) {
                delete json[i].templateRuleNames;
                delete json[i].templateHostNames;
                delete json[i].templateScriptNames;
                delete json[i].isExpanded;
                delete json[i].expandField;
            }
            return json;
        }

        //将后台返回的List数据组装成datatable要求的数据格式
        function assembleTable(ciList) {
            var tableObj = {
                aaData: [],
                totalRecords: 0
            };
            tableObj.aaData = ciList;
            tableObj.totalRecords = ciList.length;
            return tableObj
        }

        //组装datatable的url地址
        function assembleDataTableUrl(apiUrl) {
            var token = currentUser.authToken;
            //dataSrc处理服务器返回的数据格式，如果服务器返回的是数组类型，dataSrc就设为""
            var ajaxObj = {
                url: window.$oplus.appConfig.apiBaseUrls.cac + apiUrl,
                dataSrc: "",
                headers: {
                    "Authorization": 'Bearer ' + token
                    // "X-JWT-Authorization": 'Bearer ' + token
                }
            };
            return ajaxObj;
        }

        //更新auditParams
        function updateAuditParams(auditParams) {
            return cacDao.updateAuditParams(auditParams);
        }

        //查询巡检项白名单
        function getCheckWhiteList(templateId) {
            return cacDao.getCheckWhiteList(templateId);
        }

        //删除巡检项白名单
        function deleteCheckWhiteList(id) {
            return cacDao.deleteCheckWhiteList(id);
        }

        //校验检项白名单
        function findByCheckWhiteList(checkWhiteList) {
            return cacDao.findByCheckWhiteList(checkWhiteList);
        }

        //增加巡检项白名单
        function saveCheckWhiteList(checkWhiteList) {
            return cacDao.saveCheckWhiteList(checkWhiteList);
        }

        //判读字符串是否包含中文
        function isChinese(str) {
            var regex = /.*[\u4e00-\u9fa5]+.*$/;
            if (regex.test(str)) {
                return true;
            }
            return false;
        }

        // 计算文件大小函数(保留两位小数),Size为字节大小
        // size：初始文件大小
        function getFileSize(size) {
            if (!size)
                return "";

            var num = 1024.00; //byte

            if (size < num) {
                return size + "B";
            }
            if (size < Math.pow(num, 2)) {
                return (size / num).toFixed(2) + "K"; //kb
            }
            if (size < Math.pow(num, 3)) {
                return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
            }
            if (size < Math.pow(num, 4)) {
                return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
            }
            return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T

        }


        var service = {
            prepareDatatable: prepareDatatable,
            deleteAuditJsonAttr: deleteAuditJsonAttr,
            assembleTable: assembleTable,
            assembleDataTableUrl: assembleDataTableUrl,
            updateAuditParams: updateAuditParams,
            getCheckWhiteList: getCheckWhiteList,
            deleteCheckWhiteList: deleteCheckWhiteList,
            findByCheckWhiteList: findByCheckWhiteList,
            saveCheckWhiteList: saveCheckWhiteList,
            // getFileSize: getFileSize,
            isChinese: isChinese,
            playbookScripType: 'playbook',
            otherScriptType: 'adhoc',
            scriptZipType: 'zip' //区分脚本类型
        };
        return service;
    }


})();


/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //任务管理主控制器
    cacModule.controller('cacCtrl', CacCtrl);
    cacModule.controller('cac3Ctrl', CacCtrl);
    CacCtrl.$inject = ['$state', '$element', '$timeout', '$location','Param'];


    function CacCtrl($state, $element, $timeout, $location,Param) {
        var vm = this;
        vm.views = {
            chosed: "",
            emailMenuEnabled:"",
        };

        //巡检邮件配置菜单-开关
        Param.getByDomainAndName('cac', 'cac_mailbox_info').then(function (result) {
            let jsonObject = JSON.parse(result.value);
            vm.views.emailMenuEnabled = jsonObject.emailMenuEnabled;
        }).catch(function (err) {
            throw err;
        });

        var pathUrl = $location.path();

        if (pathUrl.indexOf('job') > -1 || pathUrl.indexOf('result') > -1) {
            vm.views.chosed = 'history';
        }

        if (pathUrl.indexOf('check-list') > -1 || pathUrl.indexOf('check-result') > -1) {
            vm.views.chosed = 'check_log';
        }

        if ($state.current.name === 'app.cac') {
            $state.go("app.cac.template.square");
        }
        if ($state.current.name === 'app.cac3') {
            $state.go("app.cac3.templates.list");
        }
        // $timeout(function () {
        //     document.getElementsByClassName("ui-resizable")[0].style.width = "128px";
        //     document.getElementsByClassName("cacIndexPageWrapper")[2].style = "left:128px"
        // },100)
    }
})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac', {
                url: '/cac',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/cac/cac-index.html',
                        controller: 'cacCtrl',
                        controllerAs: 'cacVm'
                    }
                }
            })
            .state('app.cac3', {
                url: '/cac3',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/cac/cac3-index.html',
                        controller: 'cac3Ctrl',
                        controllerAs: 'cacVm'
                    }
                }
            })
        ;
    }])
    ;
})();

(function() {
    'use strict';

    angular
        .module('oplus.cac')
            .directive('eEchart', eEchart);
    function eEchart(){
        return {
            restrict : 'A',
            link : link
        };
    }

    function link($scope, element, attrs){
        var myChart = echarts5.init(element[0], attrs.theme);
        $scope.$watch(attrs['ecData'], function(){
            var option = $scope.$eval(attrs.ecData);
            if(angular.isObject(option)) {
                myChart.setOption(option);
            }
        }, true);

        $scope.getDom = function(){
            return {
                'height' : element[0].offsetHeight,
                'width' : element[0].offsetWidth
            }
        };

        $scope.$watch($scope.getDom, function(){
            myChart.resize();
        }, true)
    }
})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    'use strict';
    angular.module('oplus.cac').provider('cacDao', cacDaoProvider);

    cacDaoProvider.$inject = [];

    function cacDaoProvider() {
        var useLocalDb = false;//window.$oplus.appConfig.modules.cac.useLocalDb;
        this.useLocalDb = function (value) {
            useLocalDb = value;
        };

        this.$get = ['_cacLocalDao', '_cacRemoteDao', cacDaoFactory];

        function cacDaoFactory(cacLocalDao, cacRemoteDao) {
            if (useLocalDb) {
                return cacLocalDao;
            } else {
                return cacRemoteDao;
            }
        }
    }
})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    'use strict';
    var app = angular.module('oplus.cac');

    app.service('_cacLocalDao', cacLocalDao);

    cacLocalDao.$inject = ['$q', '$http', 'localDaoFactory'];

    /**
     * DAO for local database (localStorage)
     * @param $q
     * @param localDaoFactory
     */
    function cacLocalDao($q, $http, localDaoFactory) {
        var STORAGE_KEY = 'oplus.cac';
        var STORAGE_KEY_RULE = 'oplus.cac.rule';

        var dao = localDaoFactory.createDao(STORAGE_KEY);
        var ruleDao = localDaoFactory.createDao(STORAGE_KEY_RULE);

        var that = this;

        /*rule巡检规则增删改查*/
        this.findAllRules = findAllRules;
        this.deleteRule = deleteRule;
        this.updateRule = updateRule;
        this.addRule = addRule;

        /*template巡检模板增删改查*/
        this.findAllTemplates = findAllTemplates;
        this.deleteTemplate = deleteTemplate;
        this.updateTemplate = updateTemplate;
        this.addTemplate = addTemplate;

        /*job巡检任务增删改查*/
        this.findAllJobs = findAllJobs;
        this.deleteJob = deleteJob;
        this.updateJob = updateJob;
        this.addJob = addJob;
        this.run = run;


        /*script巡检脚本*/
        this.uploadFile = uploadFile;
        this.addScript = addScript;
        this.deleteScript = deleteScript;

        function findAllRules() {
            //声明承诺
            var deferred = $q.defer();
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/rule_lists.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });

            return deferred.promise;   // 返回承诺

        }

        function deleteRule(id) {
            var deferred = $q.defer();//声明承诺
            deferred.resolve(null);//请求成功
            return deferred.promise;   // 返回承诺

        }

        function updateRule(rule) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }

        function addRule(rule) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }


        function findAllTemplates() {
            //声明承诺
            var deferred = $q.defer();
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/template_lists.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });

            return deferred.promise;   // 返回承诺

        }

        function deleteTemplate(id) {
            var deferred = $q.defer();//声明承诺
            deferred.resolve(null);//请求成功
            return deferred.promise;   // 返回承诺

        }

        function updateTemplate(template) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }

        function addTemplate(template) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }


        function findAllJobs() {
            //声明承诺
            var deferred = $q.defer();
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/template_lists.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });

            return deferred.promise;   // 返回承诺

        }

        function deleteJob(id) {
            var deferred = $q.defer();//声明承诺
            deferred.resolve(null);//请求成功
            return deferred.promise;   // 返回承诺

        }

        function updateJob(job) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }

        function addJob(job) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }


        function run(job) {
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺

        }

        function uploadFile(form){
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺
        }

        function addScript(script){
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺
        }

        function deleteScript(script){
            var deferred = $q.defer();//声明承诺
            $http.get('app/modules/cac/api/test.json').success(function (result, status) {
                deferred.resolve(result);//请求成功
            }).error(function () {
                deferred.reject(); //请求失败
            });
            return deferred.promise;   // 返回承诺
        }


    }
})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    'use strict';

    var app = angular.module('oplus.cac');

    app.service('_cacRemoteDao', cacRemoteDao);

    cacRemoteDao.$inject = ['$q', '$http', 'localDaoFactory', 'restUtils', '$translate'];

    function cacRemoteDao($q, $http, localDaoFactory, restUtils, $translate) {

        var module = "cac";
        var cmModule = 'cm';
        var gitModule = 'gfs';


        /*rule巡检规则增删改查*/
        this.findAllRules = findAllRules;
        this.deleteRule = deleteRule;
        this.queryRule = queryRule;
        this.updateRule = updateRule;
        this.addRule = addRule;
        this.checkRuleName = checkRuleName;
        this.getRuleByIds = getRuleByIds;
        this.uploadRule = uploadRule;

        /*巡检主机增删改查*/
        this.addHost = addHost;
        this.deleteHost = deleteHost;
        this.uploadHostExcel = uploadHostExcel;
        this.getHostListByCategory = getHostListByCategory;
        this.getAllCategory = getAllCategory;

        /*template巡检模板增删改查*/
        this.deleteTemplate = deleteTemplate;
        this.addTemplate = addTemplate;
        this.getTemplateById = getTemplateById;
        this.getTemplates = getTemplates;
        this.getHosts = getHosts;
        this.getSquareTemplates = getSquareTemplates;

        /*job巡检任务增删改查*/
        this.deleteJob = deleteJob;
        this.getJob = getJob;
        this.queryJob = queryJob;
        this.addJob = addJob;
        this.run = run;


        /*scritp巡检脚本*/
        this.uploadFile = uploadFile;
        this.addScript = addScript;
        this.updateScript = updateScript;
        this.deleteScript = deleteScript;
        this.deleteScriptFile = deleteScriptFile;
        this.checkScript = checkScript;
        this.getScriptContentByName = getScriptContentByName;
        this.getScriptByIds = getScriptByIds;


        /*result巡检结果*/
        this.getResultsByJobId = getResultsByJobId;
        this.analyseMetric = analyseMetric;
        this.queryOutput = queryOutput;
        this.getOutputsByTaskId = getOutputsByTaskId;
        this.getOutputsByTaskId_test = getOutputsByTaskId_test;
        this.getMetrics = getMetrics;


        this.updateAuditParams = updateAuditParams;
        this.getCheckWhiteList = getCheckWhiteList;
        this.deleteCheckWhiteList = deleteCheckWhiteList;
        this.findByCheckWhiteList = findByCheckWhiteList;
        this.saveCheckWhiteList = saveCheckWhiteList;
        this.prepareDatatableOutPut = prepareDatatableOutPut;
        this.getStructuralDiagram = getStructuralDiagram;
        this.structuralDiagramPrimaryInfo = structuralDiagramPrimaryInfo;
        this.structuralDiagramHostItemInfo = structuralDiagramHostItemInfo;
        this.getTeamsInfo = getTeamsInfo;
        this.saveTeamsInfo = saveTeamsInfo;
        this.getCacTeamConfig = getCacTeamConfig;

        function findAllRules() {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/rules', null);
        }

        function checkRuleName(ruleName) {
            //TODO 校验ruleName
            return restUtils.callApi(module, 'GET', '/api/cac/audit/rules', null, ruleName);
        }

        function deleteRule(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/audit/rules/{id}', {id: id});
        }

        function queryRule(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/rules/{id}', {id: id});
        }

        function updateRule(rule) {
            return restUtils.callApi(module, 'PUT', '/api/cac/audit/rules', null, rule);
        }

        function addRule(rule) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/rules', null, rule);
        }

        function getRuleByIds(ruleIds) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/rules/ruleIds', null, ruleIds);
        }

        //上传巡检规则
        function uploadRule(form) {
            var d = $q.defer();
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/rules/uploadRule';
            $http({
                method: 'POST',
                url: url,
                data: form,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                transformResponse: function (data) {  // 转换response,这样传回来的是就是：String，默认是json
                    return data;
                }
            }).then(function (resp) {
                d.resolve(resp.data);
            }).catch(function (err) {
                d.resolve($translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.upload')}));
                console.log(err);
                d.reject(err);
            });
            return d.promise;
        }


        function deleteHost(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/audit/hosts/{id}', {id: id});
        }

        function addHost(host) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/hosts', null, host);
        }

        function getAllCategory() {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/hosts/category');
        }

        function getHostListByCategory(category) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/hosts/getHostListByCategory/{category}', {category: category});
        }

        function uploadHostExcel(form) {
            var d = $q.defer();
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/hosts/uploadHost';
            $http({
                method: 'POST',
                url: url,
                data: form,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                transformResponse: function (data) {  // 转换response,这样传回来的是就是：String，默认是json
                    return data;
                }

            }).then(function (resp) {
                d.resolve(resp.data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }


        function addTemplate(template) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/templates', null, template)
        }


        function uploadFile(form) {
            var d = $q.defer();
            var url = window.$oplus.appConfig.apiBaseUrls.git + '/api/git/cac/upload';
            $http({
                method: 'POST',
                url: url,
                data: form,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                transformResponse: function (data) {  // 转换response,这样传回来的是就是：String，默认是json
                    return data;
                }

            }).then(function (resp) {
                d.resolve(resp.data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }


        function deleteTemplate(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/v2/templates/{id}', {id: id})
        }

        function getTemplates() {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/templates', null)
        }

        function getSquareTemplates() {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/templates/square', null)
        }

        function getTemplateById(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/templates/{id}', {id: id})
        }

        function getHosts() {
            return restUtils.callApi(cmModule, 'GET', '/api/cm/ci/hosts', null)
        }

        function getJob(jobId) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/jobs/{jobId}', {jobId: jobId})
        }

        function queryJob(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/jobs/{id}', {id: id})
        }

        function addJob(job) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs', null, job)
        }


        function run(job) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs/run', null, job)
            // if (!window.$oplus.appConfig.modules.cac.useCacV1) {
            //     return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs/run', null, job)
            // } else {
            //     return restUtils.callApi(module, 'POST', '/api/cac/audit/jobs/run', null, job)
            // }
        }

        function deleteJob(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/v2/jobs/{id}', {id: id})
        }

        function addScript(scripts) {
            /*if (scripts.length > 0) {
                for (var i = 0; i < scripts.length; i++) {
                    if(i==scripts.length-1){
                       return restUtils.callApi(module, 'POST', '/api/cac/audit/scripts', null, scripts[i])
                    }
                    restUtils.callApi(module, 'POST', '/api/cac/audit/scripts', null, scripts[i])
                }
            }*/
            return restUtils.callApi(module, 'POST', '/api/cac/audit/scripts', null, scripts)
        }

        function updateScript(script) {
            return restUtils.callApi(module, 'PUT', '/api/cac/audit/scripts', null, script);
        }

        function deleteScript(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/audit/scripts/{id}', {id: id})
        }

        function deleteScriptFile(filename) {
            return restUtils.callApi(gitModule, 'DELETE', '/api/git/delete/{filename}/', {filename: filename})
        }

        function checkScript(fileName) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/scripts/checkScriptName/{fileName}/', {fileName: fileName})
        }

        function getScriptByIds(scriptIds) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/scripts/scriptIds/', null, scriptIds)
        }

        function getScriptContentByName(scriptName) {
            return restUtils.callApi(gitModule, 'GET', '/api/git/getScriptContentByName/{scriptName}/', {scriptName: scriptName});
        }


        function getResultsByJobId(jobId, start, length) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/check-items/map/{jobId}?start=' + start + '&length=' + length, {jobId: jobId});
        }

        function analyseMetric(ansibleResult) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/metrics/analyze', null, ansibleResult);
        }

        function queryOutput(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/check-items/{id}/', {id: id});
        }

        function getOutputsByTaskId(taskId) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/outputs/taskId/{taskId}/', {taskId: taskId});
        }


        function getOutputsByTaskId_test(taskId) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/outputs/test/{taskId}/', {taskId: taskId});
        }

        function getMetrics(jobId) {
            return restUtils.callApi(module, 'GET', '/api/cac/audit/metrics/jobId/{jobId}', {jobId: jobId});
        }

        function updateAuditParams(auditParams) {
            return restUtils.callApi(module, 'POST', '/api/cac/audit/jobs/getNewAuditParams', null, auditParams);
        }

        function getCheckWhiteList(templateId) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/check-white-list/all/{templateId}', {templateId: templateId});
        }

        function deleteCheckWhiteList(id) {
            return restUtils.callApi(module, 'DELETE', '/api/cac/v2/check-white-list/delete/{id}', id);
        }

        function findByCheckWhiteList(checkWhiteList) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/check-white-list/one', null, checkWhiteList);
        }

        function saveCheckWhiteList(checkWhiteList) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/check-white-list/save', null, checkWhiteList);
        }

        function prepareDatatableOutPut(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/jobs/result-v2/{id}', {id: id});
        }

        function getStructuralDiagram(id) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/jobs/structural-diagram/{id}', {id: id});
        }

        function structuralDiagramPrimaryInfo(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs/structural-diagram/primary-info', null, data);
        }

        function structuralDiagramHostItemInfo(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/jobs/structural-diagram/host-item-info', null, data);
        }

        function getTeamsInfo() {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/get/teams-info', null);
        }

        function saveTeamsInfo(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/save/teams-info', null, data);
        }

        function getCacTeamConfig(templateId) {
            return restUtils.callApi(module, 'GET', '/api/cac/v2/get/cac-team-config/{templateId}', {templateId: templateId});

        }

    }
})();


/**
 * @Auther: zml
 * @Date: 2018/4/21
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检规则************************************************/
            .state('app.cac.rule', {
                url: '/rule',
                cache: false,
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/rule/rule-list.html',
                        controller: 'CacRuleListCtrl',
                        controllerAs: 'cacRuleListCtrlVm'
                    }
                }
            })
        ;
    }])
    ;
})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacRuleService", cacRuleService);

    cacRuleService.$inject = ["cacDao"];

    function cacRuleService(cacDao) {

        function deleteRule(id) {
            return cacDao.deleteRule(id);   // 返回承诺
        }

        //根据Id查询Rule
        function queryRule(id) {
            return cacDao.queryRule(id);
        }

        //上传规则
        function uploadRule(form) {
            return cacDao.uploadRule(form);
        }

        function updateRule(rule) {
            return cacDao.updateRule(rule);
        }

        function addRule(rules) {
            return cacDao.addRule(rules);
        }

        function checkRuleName(ruleName) {
            return cacDao.checkRuleName(ruleName);
        }

        var service = {
            deleteRule: deleteRule,
            queryRule: queryRule,
            uploadRule: uploadRule,
            updateRule: updateRule,
            addRule: addRule,
            checkRuleName: checkRuleName
        };
        return service;


    }


})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacRuleListCtrl', CacRuleListCtrl);
    CacRuleListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$filter', 'cacRuleService', '$compile', '$uibModal', 'messageService', '$state', 'currentUser', 'dataTable', '$translate'];

    function CacRuleListCtrl($scope, $timeout, cacService, $filter, cacRuleService, $compile, $uibModal, messageService, $state, currentUser, dataTable, $translate) {
        var vm = this;
        vm.views = {
            editRule: editRule,
            addRule: addRule,
            findRule: findRule,
            deleteRule: deleteRule,
            tableInstance: null,
            exportRules: exportRules,
            uploadRuleExcel: uploadRuleExcel
        };


        function exportRules(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/rules/exportRules';   //请求的URl
            var xhr = new XMLHttpRequest();		//定义http请求对象
            xhr.open("GET", url, true);
            var token = currentUser.authToken;
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            // xhr.setRequestHeader("X-JWT-Authorization", "Bearer " + token);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send();
            xhr.responseType = "blob";  // 返回类型blob
            xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                if (this.status === 200) {
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    $timeout(function () {
                        var a = document.createElement('a');
                        a.download = "Rules.xlsx";			//自定义下载文件名称
                        a.href = reader.result;
                        $("body").append(a);
                        a.click();
                    }, 100);
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                }
            }
        }

        //上传规则Excel表格，对应数据
        function uploadRuleExcel($file) {
            if ($file != null) {
                //console.log($file.name);
                var form = new FormData();
                form.append("files", $file);//files表示后台对应接收参数
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.import') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.import'), obj: $translate.instant('cac.common.rule') }),
                    function () {
                        cacRuleService.uploadRule(form).then(function (result) {
                            if (result == "success") {
                                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.import') }));
                            } else {
                                //0表示提示不会关掉。不写这个参数，提示框会立马消失掉！
                                messageService.toast("error", result);
                            }
                            angular.element("#cacRuleTable").dataTable().fnDestroy();
                            init();
                        }).catch(function (err) {
                            throw err;
                        });
                });
            }
        }

        //添加规则
        function addRule() {
            doEditRules(null);
        }

        //编辑规则
        function editRule(event) {
            var ruleJson = $(event.currentTarget).attr("rule");
            doEditRules(ruleJson);
        }

        function doEditRules(rule) {
            var rule = decodeURI(rule);//url解码
            $uibModal.open({
                templateUrl: 'app/modules/cac/rule/rule-edit.html',
                controller: 'CacRuleEditCtrl',
                controllerAs: 'cacRuleEditVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    entity: function () {
                        return {
                            rule: rule == "undefined" ? null : angular.fromJson(rule)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {
                //关闭模态框时执行，result是关闭时传递过来的参数
                var action = result.action;
                if (action != "cancel") {
                    //重置（默认或者设置为true）或者保持分页信息（设置为false）
                    vm.views.tableInstance.ajax.reload(null, false);
                }
            }, function () {

            }).catch(function (err) {
                throw err;
            });
        }

        //删除规则
        function deleteRule(id) {
            if (id != null) {
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.delete') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.delete'), obj: $translate.instant('cac.common.rule') }),
                    function () {
                        doDeleteRule(id, function () {
                            vm.views.tableInstance.ajax.reload(null, false);
                        });
                });
            }
        }

        function doDeleteRule(id, callBack) {
            cacRuleService.deleteRule(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        //查看规则
        function findRule(rule) {
            var rule = decodeURI(rule);//url解码
            // console.log("查看：" + rule);
            $uibModal.open({
                templateUrl: 'app/modules/cac/rule/rule-find.html',
                controller: 'CacRuleFindCtrl',
                controllerAs: 'cacRuleFindVm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    entity: function () {
                        return {
                            rule: angular.fromJson(rule)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {

            }, function () {

            }).catch(function (err) {
                throw err;
            });
        }

        var tableOption = {
            id: 'cacRuleTable',
            //destroy:true,//可以多次初始化表格
            order: [[2, 'desc'], [1, 'desc']],
            aoColumns: [
                {
                    mData: 'ruleName', title: $translate.instant('cac.rule.name'), width: '100px', className: 'cac-text-overflow',
                    render: function (data, type, row, meta) {
                        return '<span title=\'' + row.ruleName + '\'>' + row.ruleName + '</span>';
                    }
                },
                {
                    mData: 'ruleExpression', title: $translate.instant('cac.rule.detail.expr'), className: 'cac-text-overflow', width:'900px',
                    render: function (data, type, row, meta) {
                        return '<span style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;max-width:900px;" title=\'' + row.ruleExpression + '\'>' + row.ruleExpression + '</span>';
                    }
                },
                {
                    mData: 'applicability', title: $translate.instant('cac.rule.detail.applicability'), className: 'cac-text-overflow',
                    render: function (data, type, row, meta) {
                        if (row.applicability != null) {
                            return '<span title=\'' + row.applicability + '\'>' + row.applicability + '</span>';
                        } else {
                            return '';
                        }

                    }
                },
                // {
                //     mData: 'label', title: '标签', className: 'cac-text-overflow', width: '15%',
                //     render: function (data, type, row, meta) {
                //         if(row.label != null){
                //             var label = row.label.replace(/"/g,' ').replace("[", "").replace("]", "").replace(/'/g, "");
                //             return '<span title=\'' + label + '\'>' + label + '</span>';
                //         }else{
                //             return '';
                //         }
                //
                //     }
                // },
                {mData: 'createdAt', title: $translate.instant('common.entity.detail.create_at'), visible: false, order: 'desc'},
                {
                    mData: 'updatedAt', title: $translate.instant('common.entity.detail.update_at'), order: 'desc', width: '8rem',
                    render: function (data, type, row, meta) {
                        var action = '';
                        if (row.updatedAt == null || row.updatedAt == '') {
                            var createdTime = $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm');
                            actionHtml = '<span>' + createdTime + '</span>'
                        } else {
                            var updatedTime = $filter('date')(row.updatedAt, 'yyyy-MM-dd HH:mm');
                            actionHtml = '<span>' + updatedTime + '</span>'
                        }
                        return actionHtml;
                    }
                },
                /*{mData: 'description', title: '说明'},*/
                {mData: 'createdBy', title: $translate.instant('common.entity.detail.create_by')},
                {
                    mData: 'id',
                    title: $translate.instant('common.entity.detail.operation'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    width: '6rem',
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        //var code = "'" + row.modelCode + "'";
                        var rule = encodeURI(angular.toJson(row));

                        //TODO 外部代码中，ng-click函数的文本类型参数不能包含单引号，否则 angularjs $compile时会报错。
                        // 临时解决方案为把参数文本作为dom元素属性，点击事件获取此属性
                        // 合理的解决方案是ng-click事件传递对象id，js根据id查找对应记录

                        var actionHtml =
                            // '<div class="btn-group">' +
                            '<button type="button" class="btn btn-default btn-sm"  uaa-has-permission="cac:*:*" title="{{\'common.entity.action.edit\' | translate}}" rule="' + rule + '" ng-click="cacRuleListCtrlVm.views.editRule($event)">' +
                            '<span class="fa fa-pencil"></span>' +
                            '</button>\n' +
                            '<button type="button" class="btn btn-default btn-sm" uaa-has-permission="cac:*:*" title="{{\'common.entity.action.delete\' | translate}}" ng-click="cacRuleListCtrlVm.views.deleteRule(' + id + ')">' +
                            '<span class="fa fa-times"></span>' +
                            '</button>';
                        // '</div>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        function init() {

            dataTable.initTable(".rule-table", tableOption.aoColumns, undefined, {
                scrollX: true,
                order: [[2, 'desc'], [1, 'desc']],
                ajax: {
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/rules',
                    dataSrc: ""
                }
            }).then(function (apiInstance) {
                vm.views.tableInstance = apiInstance;
            }).catch(function (err) {
                throw err;
            });
        }

        $scope.$watch(vm.views.tableInstance, function (value) {
            var val = value || null;
            if (val) {
                vm.views.tableInstance.fnClearTable();
                vm.views.tableInstance.fnAddData($scope.$eval(vm.views.tableInstance));
            }
        });
        init();

    }


    //新建、编辑规则Controller
    cacModule.controller('CacRuleEditCtrl', CacRuleEditCtrl);
    CacRuleEditCtrl.$inject = ['$uibModalInstance', '$timeout', '$compile', '$scope', 'cacRuleService', 'messageService', 'entity', '$translate'];

    function CacRuleEditCtrl($uibModalInstance, $timeout, $compile, $scope, cacRuleService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            rule: entity.rule,
            cancel: cancel,
            save: save,
            uniqueFlag: false,
            option: {}
        };

        $timeout(function () {
            vm.views.option = {
                mode: 'javascript',
                lineNumbers: true,
                theme: 'opluscode',
                lineWrapping: true
            }
        });


        function save() {
            console.log(vm.views.rule);
            cacRuleService.addRule(vm.views.rule).then(function () {
                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
                $uibModalInstance.close({action: "edit"});
            }).catch(function (err) {
                throw err;
            });

        }

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }


        //注意这里用的是cacRuleEditVm而不是vm!
        /*$scope.$watch('cacRuleEditVm.views.rule.ruleName', function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.views.uniqueFlag = false;
                return;
            }
            vm.views.uniqueFlag = cacRuleService.checkRuleName(newValue);
        }, true);*/


    }


    //查看规则Controller
    cacModule.controller('CacRuleFindCtrl', CacRuleFindCtrl);
    CacRuleFindCtrl.$inject = ['$uibModalInstance', 'entity'];

    function CacRuleFindCtrl($uibModalInstance, entity) {
        var vm = this;

        vm.views = {
            rule: entity.rule,
            close: close
        };

        function close() {
            $uibModalInstance.close();
        }

    }


})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //新建、编辑规则Controller
    cacModule.controller('CacRuleEditCtrl', CacRuleEditCtrl);
    CacRuleEditCtrl.$inject = ['$uibModalInstance', '$timeout', '$compile', '$scope', 'cacRuleService', 'messageService', 'entity', '$translate'];

    function CacRuleEditCtrl($uibModalInstance, $timeout, $compile, $scope, cacRuleService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            rule: entity.rule,
            cancel: cancel,
            save: save,
            uniqueFlag: false,
            option: {},
            showApplicability: false,
            labels: [
                $translate.instant('cac.rule.labels.0'),
                $translate.instant('cac.rule.labels.1'),
                $translate.instant('cac.rule.labels.2'),
                $translate.instant('cac.rule.labels.3'),
                $translate.instant('cac.rule.labels.4'),
                $translate.instant('cac.rule.labels.5'),
                $translate.instant('cac.rule.labels.6'),
                $translate.instant('cac.rule.labels.7'),
                $translate.instant('cac.rule.labels.8'),
            ]
        };

        if (vm.views.rule == null){
            vm.views.rule = {label: []};
        } else if (vm.views.rule.label == null) {
            vm.views.rule.label = [];
        } else {
            vm.views.rule.label = JSON.parse(vm.views.rule.label);
        }

        $timeout(function () {
            vm.views.option = {
                mode: 'text/javascript',
                lineNumbers: true,
                theme: 'opluscode',
                lineWrapping: true
            }
        });

        function save() {
            vm.views.rule.label = JSON.stringify(vm.views.rule.label);
            cacRuleService.addRule(vm.views.rule).then(function () {
                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
                $uibModalInstance.close({action: "edit"});
            }).catch(function (err) {
                throw err;
            });
        }

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }


        //注意这里用的是cacRuleEditVm而不是vm!
        /*$scope.$watch('cacRuleEditVm.views.rule.ruleName', function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.views.uniqueFlag = false;
                return;
            }
            vm.views.uniqueFlag = cacRuleService.checkRuleName(newValue);
        }, true);*/


    }
})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检主机************************************************/
            .state('app.cac.host', {
                url: '/host',
                cache: false,
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/host/host-list.html',
                        controller: 'CacHostListCtrl',
                        controllerAs: 'cacHostListCtrlVm'
                    }
                }
            })
        ;
    }])
    ;
})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacHostListCtrl', CacHostListCtrl);
    CacHostListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$filter', 'cacHostService', '$compile', '$uibModal', 'messageService', '$state', 'currentUser', 'dataTable', '$translate'];

    function CacHostListCtrl($scope, $timeout, cacService, $filter, cacHostService, $compile, $uibModal, messageService, $state, currentUser, dataTable, $translate) {
        var vm = this;
        vm.views = {
            tableInstance: null,
            addHost: addHost,
            editHost: editHost,
            deleteHost: deleteHost,
            uploadHostExcel: uploadHostExcel,
            exportHosts: exportHosts
        };

        var tableOption = {
            id: 'cacHostTable',
            aoColumns: [
                {mData: 'hostName', title: $translate.instant('cac.host.name')},
                {mData: 'hostKey', title: 'IP'},
                // {mData: 'hostUser', title: '主机用户名'},
                {mData: 'category', title: $translate.instant('common.term.category')},
                {mData: 'description', title: $translate.instant('common.entity.detail.description')},
                {
                    mData: 'id',
                    title: $translate.instant('common.entity.detail.operation'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        var host = encodeURI(angular.toJson(row));
                        var actionHtml =
                            '<div class="btn-group">' +
                            '<button type="button" class="btn btn-default btn-sm"  title="{{\'common.entity.action.edit\' | translate}}" uaa-has-permission="cac:*:*" ng-click="cacHostListCtrlVm.views.editHost(\'' + host + '\')">' +
                            '<span class="fa fa-pencil"></span>' +
                            '</button>' +
                            '<button type="button" class="btn btn-default btn-sm" title="{{\'common.entity.action.delete\' | translate}}" uaa-has-permission="cac:*:*" ng-click="cacHostListCtrlVm.views.deleteHost(' + id + ')">' +
                            '<span class="fa fa-times"></span>' +
                            '</button>' +
                            '</div>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        //根据id,删除主机信息
        function deleteHost(id) {
            if (id != null) {
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.delete') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.delete'), obj: $translate.instant('cac.common.host') }),
                    function () {
                        doDeleteHost(id, function () {
                            vm.views.tableInstance.ajax.reload(null, false);
                            messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.delete') }));
                        });
                });
            }
        }

        //回调函数，删除成功后，刷新表格并提示删除成功！
        function doDeleteHost(id, callBack) {
            cacHostService.deleteHost(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        function addHost() {
            saveHost(null);
        }

        function editHost(host) {
            saveHost(host);
        }


        function saveHost(host) {
            var host = decodeURI(host);//url解码
            $uibModal.open({
                templateUrl: 'app/modules/cac/host/host-edit.html',
                controller: 'CacHostEditCtrl',
                controllerAs: 'cacHostEditVm',
                backdrop: 'static',
                size: 'md',//设置模态框大小
                resolve: {
                    entity: function () {
                        return {
                            host: host == "undefined" ? null : angular.fromJson(host)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {
                //关闭模态框时执行，result是关闭时传递过来的参数
                var action = result.action;
                if (action != "cancel") {
                    //重置（默认或者设置为true）或者保持分页信息（设置为false）
                    vm.views.tableInstance.ajax.reload(null, false);
                }
            }, function () {

            }).catch(function (err) {
                throw err;
            });
        }

        //上传主机Excel表格，对应数据
        function uploadHostExcel($file) {
            if ($file != null) {
                //console.log($file.name);
                var form = new FormData();
                form.append("files", $file);//files表示后台对应接收参数
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.import') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.import'), obj: $translate.instant('cac.common.host') }),
                    function () {
                        cacHostService.uploadHostExcel(form).then(function (data) {
                            if (data == 'success') {
                                vm.views.tableInstance.ajax.reload(null, false);
                                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.import') }));
                            } else {
                                messageService.toast("error", data);
                            }
                        }).catch(function (err) {
                            throw err;
                        });
                });
            }
        }

        function exportHosts(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/hosts/exportHosts';   //请求的URl
            var xhr = new XMLHttpRequest();		//定义http请求对象
            xhr.open("GET", url, true);
            var token = currentUser.authToken;
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            // xhr.setRequestHeader("X-JWT-Authorization", "Bearer " + token);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send();
            xhr.responseType = "blob";  // 返回类型blob
            xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                if (this.status === 200) {
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    $timeout(function () {
                        var a = document.createElement('a');
                        a.download = "Hosts.xlsx";			//自定义下载文件名称
                        a.href = reader.result;
                        $("body").append(a);
                        a.click();
                    }, 100);
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                }
            }
        }

        function init() {
            dataTable.initTable(".host-table", tableOption.aoColumns, undefined, {
                scrollX: true,
                ajax: {
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/hosts',
                    dataSrc: ""
                }
            }).then(function (apiInstance) {
                vm.views.tableInstance = apiInstance;
            }).catch(function (err) {
                throw err;
            });
        }

        init();


    }

    //新建、编辑主机Controller
    cacModule.controller('CacHostEditCtrl', CacHostEditCtrl);
    CacHostEditCtrl.$inject = ['$uibModalInstance', '$timeout', '$compile', '$scope', 'cacHostService', 'messageService', 'entity', '$translate'];

    function CacHostEditCtrl($uibModalInstance, $timeout, $compile, $scope, cacHostService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            host: entity.host,
            cancel: cancel,
            save: save
        };


        function save() {
            //console.log(vm.views.host);
            cacHostService.addHost(vm.views.host).then(function () {
                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
                $uibModalInstance.close({action: "edit"});
            }).catch(function (err) {
                throw err;
            });

        }

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }


    }

})
();

/**
 * @Auther: zml
 * @Date: 2019/12/30
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacHostService", cacHostService);

    cacHostService.$inject = ["cacDao"];

    function cacHostService(cacDao) {

        function deleteHost(id) {
            return cacDao.deleteHost(id);   // 返回承诺
        }

        function addHost(hosts) {
            return cacDao.addHost(hosts);
        }

        function uploadHostExcel(form) {
            return cacDao.uploadHostExcel(form);
        }

        function getAllCategory() {
            return cacDao.getAllCategory();
        }

        function getHostListByCategory(category) {
            return cacDao.getHostListByCategory(category);
        }


        var service = {
            deleteHost: deleteHost,
            addHost: addHost,
            uploadHostExcel: uploadHostExcel,
            getAllCategory: getAllCategory,
            getHostListByCategory: getHostListByCategory
        };
        return service;


    }


})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检模板************************************************/
            .state('app.cac.template', {
                url: '/template',
               // params:{"display":false},
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/template-index.html',
                        controller: 'CacTemplateIndexCtrl',
                        controllerAs: 'cacTemplateIndexCtrlVm'
                    }
                }
            })
            .state('app.cac.template.square', {
                url: '/square',
                views: {
                    'template-view': {
                        templateUrl: 'app/modules/cac/template/template-square.html',
                        controller: 'CacTemplateSquareCtrl',
                        controllerAs: 'CacTemplateSquareCtrlVm'
                    }
                }
            })
            .state('app.cac.template_add', {
                url: '/add',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/template-edit.html',
                        controller: 'CacEditTemplateCtrl',
                        controllerAs: 'cacEditTemplateCtrlVm'
                    }
                }
            })
            .state('app.cac.template_edit', {
                url: '/:templateId/edit',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/template-edit.html',
                        controller: 'CacEditTemplateCtrl',
                        controllerAs: 'cacEditTemplateCtrlVm'
                    }
                }

            })
            .state('app.cac.template_dashboard', {
                url: '/:templateId/:templateName/dashboard',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/template-dashboard.html',
                        controller: 'CacDashboardTemplateCtrl',
                        controllerAs: 'cacDashboardTemplateCtrlVm'
                    }
                }

            })
            .state('app.cac.template_teams', {
                url: '/:templateId/:templateName/teams',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/cac-team-config.html',
                        controller: 'CacTeamConfigCtrl',
                        controllerAs: 'cacTeamConfigCtrlVm'
                    }
                }

            })
            .state('app.cac.template.list', {
                url: '/list',
                views: {
                    'template-view': {
                        templateUrl: 'app/modules/cac/template/template-list.html',
                        controller: 'CacTemplateListCtrl',
                        controllerAs: 'cacTemplateListCtrlVm'
                    }
                }
            })
        ;
    }])
    ;
})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacTemplateService", cacTemplateService);

    cacTemplateService.$inject = ["cacDao"];

    function cacTemplateService(cacDao) {

        function deleteTemplate(id) {
            return cacDao.deleteTemplate(id);
        }


        function getTemplates() {
            return cacDao.getTemplates();
        }

        function updateTemplate(template) {
            return cacDao.updateTemplate(template);
        }

        function addTemplate(template) {
            return cacDao.addTemplate(template);
        }

        function getTemplateById(id) {
            return cacDao.getTemplateById(id);
        }

        function getHosts() {
            return cacDao.getHosts();
        }

        //重新组装主机返回的json数据
        //todo 后续要改参数名，name,ip。。。。
        function assembleHost(auditParams) {
            if (auditParams != null) {
                var host_obj = {
                    id: '',
                    hostName: '',
                    hostIp: ''
                };
                for (var i = 0; i < auditParams.length; i++) {
                    var param_hosts = auditParams[i].hosts;
                    if (param_hosts != null) {
                        for (var j = 0; j < param_hosts.length; j++) {
                            host_obj.id = param_hosts[j].id
                            host_obj.hostName = param_hosts[j].hostname;
                            host_obj.hostIp = param_hosts[j].ip;
                        }

                    }
                    auditParams[i].hosts = host_obj;
                }
            }
            return auditParams
        }

        function getSquareTemplates() {
            return cacDao.getSquareTemplates();
        }

        function getTeamsInfo() {
            return cacDao.getTeamsInfo();
        }

        function saveTeamsInfo(data) {
            return cacDao.saveTeamsInfo(data);
        }

        function getCacTeamConfig(templateId) {
            return cacDao.getCacTeamConfig(templateId);
        }

        var service = {
            deleteTemplate: deleteTemplate,
            getTemplates: getTemplates,
            updateTemplate: updateTemplate,
            addTemplate: addTemplate,
            getTemplateById: getTemplateById,
            getHosts: getHosts,
            assembleHost: assembleHost,
            getSquareTemplates: getSquareTemplates,
            getTeamsInfo: getTeamsInfo,
            saveTeamsInfo: saveTeamsInfo,
            getCacTeamConfig: getCacTeamConfig
        };
        return service;


    }


})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');


    //模型控制器
    cacModule.controller('CacTemplateListCtrl', CacTemplateListCtrl);
    CacTemplateListCtrl.$inject = ['$scope', '$timeout', '$state', 'cacService', 'cacTemplateService', '$compile', 'messageService', '$filter', '$http', 'dataTable', 'currentUser', '$translate', 'Param'];

    function CacTemplateListCtrl($scope, $timeout, $state, cacService, cacTemplateService, $compile, messageService, $filter, $http, dataTable, currentUser, $translate, Param) {
        var vm = this;
        vm.views = {
            deleteTemplate: deleteTemplate,
            // editTemplate: editTemplate,
            // findTemplate: findTemplate,
            run: run,
            dashboardSwitch: "",
            teamsSwitch: ""
            // tableInstance: null
        };
        vm.reloadTable = function () {
            // console.log('reloadTable');
        }
        var columnDefs = [
            {
                data: 'templateName',
                title: $translate.instant('common.entity.detail.name'),
                render: function (data, type, row, meta) {
                    var content = data;
                    if (row.description) {
                        content += '<p class="help-block">' + row.description + '</p>';
                    }
                    return '<a class="d-block" href="" ui-sref="app.cac.job.list({templateId:\'' + row.id + '\'})">' + content + '</a>';
                }
            },
            {
                data: 'auditParams',
                title: $translate.instant('cac.template.detail.audit_params'),
                render: function (data, type, row, meta) {
                    var auditParams = angular.fromJson(row.auditParams);
                    var html = '';
                    for (var i = 0; i < auditParams.length; i++) {
                        var auditParam = auditParams[i];
                        html += '{{"cac.common.host" | translate}}: <strong>' + auditParam.hosts.length + '</strong>, ' +
                            '{{"cac.common.script" | translate}}: <strong>' + auditParam.scripts.length + '</strong> ' +
                            '<br/>';

                    }
                    return '<span class="cac_table_col_project" style="line-height: 15px!important;">' + html + '</span>';
                }
            },
            // {data: 'scriptType', title: '脚本类型'},
            // /*{data: 'description', title: '描述'},*/
            {
                data: 'createdAt',
                title: $translate.instant('cac.template.detail.last_time'),
                type: 'html',
                render: function (data, type, row, meta) {
                    var actionHtml = "";
                    var executedAt = row.executedAt;
                    if (executedAt != null) {
                        executedAt = $filter('date')(row.executedAt, 'yyyy-MM-dd HH:mm:ss');
                        var jobId = "'" + row.jobId + "'";
                        actionHtml = '<a class="cac-td-hover" title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac.result({jobId:' + jobId + '})">' + executedAt + '</a>';
                    } else {
                        executedAt = $translate.instant('cac.common.not_run');
                        //<span hidden>-1</span>是让未执行的模板排在最后
                        actionHtml = '<a class="cac-td-hover" disabled="disabled" title="{{\'cac.messages.template_not_run\' | translate}}"><span hidden>-1</span>' + executedAt + '</a>';
                    }
                    return actionHtml;
                }
            },
            {
                data: 'executedBy',
                title: $translate.instant('cac.template.detail.executed_by')
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                // type: 'num',
                render: function (data, type, row, meta) {
                    var id = "'" + row.id + "'";
                    // var template = encodeURI(angular.toJson(row));
                    return '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.run\' | translate}}" ng-click="cacTemplateListCtrlVm.views.run(' + id + ')">' +
                        '<i class="fa fa-caret-square-right"></i>' +
                        '</a>\n' +
                        '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.edit\' | translate}}"  ui-sref="app.cac.template_edit({templateId:\'' + row.id + '\'})">' +
                        '<i class="fa fa-pencil"></i>' +
                        '</a>\n' +
                        '<a ng-if="\'yes\' === cacTemplateListCtrlVm.views.dashboardSwitch" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="dashboard"  ui-sref="app.cac.template_dashboard({templateId:\'' + row.id + '\',templateName:\'' + row.templateName + '\'})">' +
                        '<i class="fa fa-tachometer-alt"></i>' +
                        '</a>\n' +
                        '<a ng-if="\'yes\' === cacTemplateListCtrlVm.views.teamsSwitch" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="teams"  ui-sref="app.cac.template_teams({templateId:\'' + row.id + '\',templateName:\'' + row.templateName + '\'})" uaa-has-permission="sysadmin:*:*">' +
                        '<i class="fa fa-users-cog"></i>' +
                        '</a>\n' +
                        '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.delete\' | translate}}"  ng-click="cacTemplateListCtrlVm.views.deleteTemplate(' + id + ',' + row.createdBy + ')">' +
                        '<i class="fa fa-trash-alt"></i>' +
                        '</a>';
                }
            }
        ];
        init();

        function init() {
            Param.getByDomain('cac').then(function (result) {
                const elementMap = new Map();
                result.forEach(item => elementMap.set(item.name, item.value));
                vm.views.dashboardSwitch = elementMap.get('dashboard_switch')  || 'no';
                vm.views.teamsSwitch = elementMap.get('teams_switch')  || 'no';
            }).catch(function (err) {
                throw err;
            });

            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/templates';
            var dataSrc = "";
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     url = 'app/modules/cac/api/template.json';
            //     dataSrc = "aaData";
            // }
            vm.tableConfig = {
                columns: columnDefs,
                data: [function () {
                    return $http.get(url);
                }, dataSrc, false],
                order: [[2, 'desc']]
            }

            // dataTable.initTable("#cacTemplateTable", tableOption.aoColumns, undefined, {
            //     scrollX: true,
            //     order: [[2, 'desc']],
            //     ajax: {
            //         url: url,
            //         dataSrc: dataSrc
            //     }
            // }).then(function (apiInstance) {
            //     vm.views.tableInstance = apiInstance;
            // }).catch(function (err) {
            //     throw err;
            // });
        }

        function deleteTemplate(id, owner) {
            if (id != null) {
                if (currentUser.isSameUser(owner) || currentUser.hasPermission('cac:edit')) {
                    messageService.confirm(
                        $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.delete') }),
                        $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.delete'), obj: $translate.instant('cac.common.template') }),
                        function () {
                            doDeleteTemplate(id, function () {
                                vm.tableConfig.reloadData();
                                // vm.views.tableInstance.ajax.reload(null, false);
                            });
                    });
                } else {
                    messageService.alertError(
                        $translate.instant('common.uaa.no_permission'),
                        $translate.instant('cac.messages.cannot_delete'))
                }
            }
        }

        function doDeleteTemplate(id, callBack) {
            cacTemplateService.deleteTemplate(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }


        // function editTemplate(template) {
        //     template = angular.fromJson(decodeURI(template));
        //     $state.go("app.cac.template_edit", {template: template});
        // }

        // function findTemplate(template) {
        //     template = angular.fromJson(decodeURI(template));
        //     $state.go("app.cac.template.findTemplate", {template: template});
        // }

        function run(templateId) {
            // template = angular.fromJson(decodeURI(template));
            if (currentUser.hasPermission("cac:run")) {
                $state.go("app.cac.job_add", {templateId: templateId});
            } else {
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_run'))
            }
        }
    }
})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');


    //模型控制器
    cacModule.controller('CacTemplateIndexCtrl', CacTemplateIndexCtrl);
    CacTemplateIndexCtrl.$inject = ['$scope', '$timeout', '$state', 'cacService', 'cacTemplateService', '$compile', 'messageService', '$filter', '$http', '$stateParams'];

    function CacTemplateIndexCtrl($scope, $timeout, $state, cacService, cacTemplateService, $compile, messageService, $filter, $http, $stateParams) {
        //var vm = this;
        /*if ($stateParams.display) {
            $state.go("app.cac.template.list");
        } else {
            $state.go("app.cac.template.square");
        }*/
    }
})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacEditTemplateCtrl', CacEditTemplateCtrl);
    CacEditTemplateCtrl.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'cacTemplateService', '$uibModal', 'messageService', 'cacService', 'gfsActionHelper', 'cmActions', 'currentUser', '$translate'];

    /**
     * @param {gfsActionHelper} gfsActionHelper
     */
    function CacEditTemplateCtrl($scope, $timeout, $state, $stateParams, cacTemplateService, $uibModal, messageService, cacService, gfsActionHelper, cmActions, currentUser, $translate) {
        var vm = this;
        var templateId = $stateParams.templateId;

        vm.views = {
            deleteTemplate: deleteTemplate,
            // selectCacTemplateRules: selectCacTemplateRules,
            // selectCacTemplateHosts: selectCacTemplateHosts,
            // selectCacTemplateScripts: selectCacTemplateScripts,
            // selectScripts: selectScripts,
            deleteParams: deleteParams,
            addParams: addParams,
            removeScript: removeScript,
            changePlaybook: changePlaybook,
            back: back,
            save: save,
            templateRuleNames: "",
            templateHostNames: "",
            templateScriptNames: "",
            auditParams: [],
            auditParam: {},
            templateScripts: [],
            tableInstance: null,
            index: 0,
            template: {
                "scriptType": cacService.playbookScripType
            },
            showAuditParamsDetails: showAuditParamsDetails,
            detailFlag: [],
            playbookConstant: cacService.playbookScripType,
            templateNameFlag: false,
            jobStatus: $stateParams.jobStatus,
            fileSelectorConfig: {
                repoType: 'git',
                viewMode: 'dialog',
                initDir: $translate.instant('cac.common.run_scrip_path'),
                multipleSelect: false,
                showFileConfig: true,
                doNotShowTagsParam: true
            }
        };

        //$on用于截获来自父级作用域的事件----获取job任务模块传过来的template值
        $scope.$on("templateEdit", function (event, data) {
            vm.views.template = data;
            vm.views.auditParams = angular.fromJson(vm.views.template.auditParams);
            resolveAuditParams();
        });

        $scope.$on("to-template", function (event, data) {
            vm.views.auditParams = cacService.deleteAuditJsonAttr(vm.views.auditParams);
            // vm.views.auditParams = deleteHostAttr(vm.views.auditParams);
            changeHostKeyNameAndAddScriptName(vm.views.auditParams);
            vm.views.template.auditParams = angular.toJson(vm.views.auditParams);
            deleteHostAttr(vm.views.auditParams);
            //子Controller将数据传递到父Controller
            $scope.$emit("template", vm.views.template);

        });

        function deleteHostAttr(auditParams) {
            // auditParams.forEach(function (auditParam) {
            //     var hosts= [];
            //     auditParam.hosts.forEach(function (host) {
            //         hosts.push({"key":host.hostKey,"value":host.value,"assetType":host.assetType,});
            //     });
            //     auditParam.hosts = hosts;
            // });
            return auditParams;
        }

        function changeHostKeyNameAndAddScriptName(auditParams) {
            auditParams.forEach(function (auditParam) {
                // var hosts= [];
                // auditParam.hosts.forEach(function (host) {
                //     hosts.push({"hostKey":host.key,"value":host.value,"assetType":host.assetType});
                // });
                // auditParam.hosts = hosts;
                auditParam.scripts.forEach(function (script) {
                    script.scriptName = script.scriptPath;
                });
            });
            return auditParams;
        }

        // function addScriptName(auditParams) {
        //     auditParams.forEach(function (auditParam) {
        //         auditParam.scripts.forEach(function (script) {
        //             script.scriptName = script.scriptPath;
        //         });
        //     });
        //     return auditParams;
        // }

        initCacV2();

        function initCacV2() {
            $scope.cacV2 = {
                // enabled: !window.$oplus.appConfig.modules.cac.useCacV1,
                enabled: true,
                selectScripts: selectGfsScripts
            };

            function selectGfsScripts(item, $index, scriptType, ev) {
                var theScripts = vm.views.auditParams[$index].scripts;
                var selected = [];
                _.forEach(theScripts, function (script) {
                    selected.push({id: script.id, path: script.scriptName, config: script.scriptParams});
                });

                var isPlaybook = scriptType === 'playbook';
                var config = {
                    repoType: 'git',
                    dir: '',
                    useSelector: true,
                    multipleSelect: !isPlaybook,
                    preSelected: selected,
                    fileFilter: isPlaybook ? '.zip,site.yaml,site.yml' : null,
                    onConfirm: onConfirmSelect
                };
                gfsActionHelper.openFileSelector($scope, config);

                function onConfirmSelect(scripts) {
                    //console.log('onConfirmSelect', scripts);
                    // var index = $index;
                    theScripts.length = 0;
                    // if (isPlaybook) {
                    // scripts = [scripts];
                    // }
                    _.forEach(scripts, function (script) {
                        theScripts.push({
                            id: script.id,
                            scriptName: script.path,
                            scriptPath: script.path,
                            scriptParams: script.config
                        });
                    });
                    // console.log(theScripts,vm.views.auditParams[$index].scripts)
                    // vm.views.auditParams[index].templateScriptNames = resolveArrToString(theScripts, "scriptName");
                }
            }
        }

        function showAuditParamsDetails($index) {
            //angular.element(".list-view-pf-expand").removeClass("active");
            vm.views.detailFlag[$index] = true;
            //vm.views.auditParams[$index] = vm.views.customScope.toggleExpandItemField(vm.views.auditParams[$index], name);
            vm.views.auditParams[$index] = vm.views.customScope.toggleExpandItemField(vm.views.auditParams[$index]);
            if (vm.views.auditParams[$index].isExpanded) {
                angular.element(".list-view-pf-expand." + $index).addClass("active");
            } else {
                angular.element(".list-view-pf-expand." + $index).removeClass("active");
            }
        }

        vm.views.customScope = {
            toggleExpandItemField: function (item, field) {
                //if (item.isExpanded && item.expandField === field) {
                item.isCollapsed = !item.isCollapsed;
                return item;
            }
        };

        function deleteParams($index, ev) {
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('common.messages.operation.title', {
                    operation: $translate.instant('common.entity.action.delete'),
                    obj: $translate.instant('cac.common.param')
                }),
                function () {
                    vm.views.auditParams.splice($index, 1);
                    if (vm.views.auditParams.length == 0) {
                        initParams();
                    }
                });
        }

        function addParams(ev) {
            initParams();
        }


        //返回模板template列表
        function back() {
            $state.go("app.cac.template.list", {display: true}, {reload: false});
        }

        //保存模板template
        function save() {

            if (vm.views.template.templateName == null || vm.views.template.templateName == "") {
                messageService.toast("error", $translate.instant('cac.messages.input', {name: $translate.instant('cac.template.name')}));
                return;
            }
            vm.views.auditParams = cacService.deleteAuditJsonAttr(vm.views.auditParams);
            //vm.views.auditParams = cacTemplateService.assembleHost(vm.views.auditParams);

            changeHostKeyNameAndAddScriptName(vm.views.auditParams);
            vm.views.template.auditParams = angular.toJson(vm.views.auditParams);
            cacTemplateService.addTemplate(vm.views.template).then(
                function (data) {
                    vm.views.template = data;
                    messageService.toast("success", $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.save')}));

                    vm.views.auditParams = angular.fromJson(vm.views.template.auditParams);
                    deleteHostAttr(vm.views.auditParams);
                    resolveAuditParams();

                    $timeout(function () {
                        $state.go("app.cac.template.list");
                    }, 200);

                    // $state.go("app.cac.job_add", {templateId: vm.views.template.id});
                }
            ).catch(function (err) {
                throw err;
            });


        }


        function deleteTemplate(id) {
            if (id != null) {
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                    $translate.instant('common.messages.operation.body', {
                        operation: $translate.instant('common.entity.action.delete'),
                        obj: $translate.instant('cac.common.template')
                    }), function () {
                        doDeleteTemplate(id, function () {
                            vm.views.tableInstance.ajax.reload(null, true);
                        });
                    });
            }
        }

        function doDeleteTemplate(id, callBack) {
            cacTemplateService.deleteTemplate(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        //选择巡检规则（取消规则）
        // function selectCacTemplateRules(item, $index, ev) {
        //     var oEvent = ev || event;
        //     //js阻止事件冒泡
        //     oEvent.cancelBubble = true;
        //     oEvent.stopPropagation();
        //     $uibModal.open({
        //         templateUrl: 'app/modules/cac/template/template-rule-list.html',
        //         controller: 'CacTemplateRuleCtrl',
        //         controllerAs: 'cacTemplateRuleVm',
        //         backdrop: 'static',
        //         size: 'lg',
        //         resolve: {
        //             entity: function () {
        //                 return {
        //                     rules: item.ruleExpressions,
        //                     index: $index
        //                 };
        //             }
        //         }
        //     }).result.then(function (result) {
        //         var action = result.action;
        //         if (action != "cancel") {
        //             var index = result.index;
        //             vm.views.auditParams[index].ruleExpressions = result.selectedRules;
        //             vm.views.auditParams[index].templateRuleNames = resolveArrToString(result.selectedRules, "ruleName");
        //         }
        //     }).catch(function (err) {
        //         throw err;
        //     });
        // }

        //选择巡检主机
        // function selectCacTemplateHosts(item, $index, ev) {
        //     var hostSelectConfig = {preSelectedHosts:[],preSelectorGroup:''};
        //     _.forEach(vm.views.auditParams[$index].hosts,function(host){
        //         hostSelectConfig.preSelectedHosts.push(host.hostKey);
        //     });
        //
        //     cmActions.openHostSelector(hostSelectConfig,function(selectedHosts){
        //         vm.views.auditParams[$index].hosts = selectedHosts;
        //         vm.views.auditParams[$index].templateHostNames = resolveArrToString(selectedHosts, "hostKey");
        //     });
        //
        //     /*
        //     $uibModal.open({
        //         templateUrl: 'app/modules/cac/template/template-host-list.html',
        //         controller: 'CacTemplateHostCtrl',
        //         controllerAs: 'cacTemplateHostVm',
        //         backdrop: 'static',
        //         size: 'lg',
        //         resolve: {
        //             entity: function () {
        //                 return {
        //                     hosts: item.hosts,
        //                     index: $index
        //                 };
        //             }
        //         }
        //     }).result.then(function (result) {
        //         var action = result.action;
        //         if (action != "cancel") {
        //             var index = result.index;
        //             vm.views.auditParams[index].hosts = result.selectedHosts;
        //             vm.views.auditParams[index].templateHostNames = resolveArrToString(result.selectedHosts, "hostKey");
        //         } else {
        //             var index = result.index;
        //             vm.views.auditParams[index].hosts = result.selectedHosts;
        //             vm.views.auditParams[index].templateHostNames = resolveArrToString(result.selectedHosts, "hostKey");
        //         }
        //     }, function () {
        //
        //     });*/
        // }

        function selectScripts(result) {
            var action = result.action;
            if (action != "cancel") {
                var index = result.index;
                vm.views.auditParams[index].scripts = result.selectedScripts;
                vm.views.auditParams[index].templateScriptNames = resolveArrToString(result.selectedScripts, "scriptName");
            }
        }

        // //选择巡检脚本
        // function selectCacTemplateScripts(item, $index, scriptType, ev) {
        //     $uibModal.open({
        //         templateUrl: 'app/modules/cac/template/template-script-list.html',
        //         controller: 'CacTemplateScriptCtrl',
        //         controllerAs: 'cacTemplateScriptVm',
        //         backdrop: 'static',
        //         size: 'md',
        //         resolve: {
        //             entity: function () {
        //                 return {
        //                     scripts: item.scripts,
        //                     index: $index,
        //                     scriptType: scriptType
        //                 };
        //             }
        //         }
        //     }).result.then(function (result) {
        //         var action = result.action;
        //         if (action != "cancel") {
        //             var index = result.index;
        //             vm.views.auditParams[index].scripts = result.selectedScripts;
        //             vm.views.auditParams[index].templateScriptNames = resolveArrToString(result.selectedScripts, "scriptName");
        //         }
        //     }).catch(function (err) {
        //         throw err;
        //     });
        // }

        //根据数组属性，将数组转换为逗号分隔的字符串
        function resolveArrToString(arr, name) {
            var result = "";
            if (arr != null && arr.length > 0) {
                var templateArr = [];
                for (var i in arr) {
                    templateArr.push(arr[i][name]);
                }

                result = templateArr.join(",");
            }
            return result;
        }

        function initParams() {
            var auditParam = {
                scripts: [],
                ruleExpressions: [],
                hosts: [],
                isExpanded: true
            };
            vm.views.auditParams.push(auditParam);
            var index = vm.views.auditParams.length - 1;
            $timeout(function () {
                angular.element(".list-view-pf-expand." + index).addClass("active")
            });
        }

        function resolveAuditParams() {
            for (var i = 0; i < vm.views.auditParams.length; i++) {
                vm.views.auditParams[i].templateHostNames = resolveArrToString(vm.views.auditParams[i].hosts, "key");
                vm.views.auditParams[i].templateRuleNames = resolveArrToString(vm.views.auditParams[i].ruleExpressions, "ruleName");
                vm.views.auditParams[i].templateScriptNames = resolveArrToString(vm.views.auditParams[i].scripts, "scriptName");
            }
        }

        //当选择脚本类型为playbook时，如果有多个选项，则截取第一个选项
        function changePlaybook() {
            if (vm.views.auditParams.length > 1) {
                vm.views.auditParams = vm.views.auditParams.splice(0, 1);
            }
        }

        //根据脚本id，移除不需要的脚本
        function removeScript(scriptId, index) {
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('common.messages.operation.body', {
                    operation: $translate.instant('common.entity.action.delete'),
                    obj: $translate.instant('cac.common.template')
                }),
                function () {
                    for (var i = 0; i < vm.views.auditParams[index].scripts.length; i++) {
                        if (vm.views.auditParams[index].scripts[i].id == scriptId) {
                            vm.views.auditParams[index].scripts.splice(i, 1);
                            break;
                        }
                    }
                });

        }

        function init() {
            if (templateId != null) {
                cacTemplateService.getTemplateById(templateId).then(function (data) {
                    vm.views.template = data;
                    if (vm.views.template.auditParams != "") {
                        vm.views.auditParams = angular.fromJson(vm.views.template.auditParams);
                        vm.views.auditParams = deleteHostAttr(vm.views.auditParams);
                        resolveAuditParams();
                    }
                }).catch(function (err) {
                    throw err;
                });
                vm.views.permission = currentUser.isSameUser(vm.views.template.createdBy) ? "cac:view" : "cac:edit";
                vm.views.uuaMessage = $translate.instant('common.uaa.no_permission_title');
            } else {
                vm.views.permission = "cac:edit:*";
                vm.views.uuaMessage = $translate.instant('common.uaa.no_permission_title');
                initParams();
            }
        }

        init();
    }

})
();

(function () {
    var cacModule = angular.module('oplus.cac');

    cacModule.controller('CacDashboardTemplateCtrl', CacDashboardTemplateCtrl);
    CacDashboardTemplateCtrl.$inject = ['$scope', '$timeout', '$state', '$stateParams'];

    function CacDashboardTemplateCtrl($scope, $timeout, $state, $stateParams) {
        var vm = this;
        vm.params = {
            template_id: $stateParams.templateId,
            template_name: $stateParams.templateName
        }

    }

})
();

(function () {
        var cacModule = angular.module('oplus.cac');

        cacModule.controller('CacTeamConfigCtrl', CacTeamConfigCtrl);
        CacTeamConfigCtrl.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'cacTemplateService', 'messageService', '$translate'];

        function CacTeamConfigCtrl($scope, $timeout, $state, $stateParams, cacTemplateService, messageService, $translate) {
            var vm = this;
            vm.views = {
                templateId: $stateParams.templateId,
                templateName: $stateParams.templateName,
                teamsInfoData: [],
                choice_data: choice_data,
            }
            getTeamsInfo();//初始化
            function getTeamsInfo() {
                cacTemplateService.getTeamsInfo().then(function (data) {
                    if (Object.keys(data).length > 0) {
                        for (var key in data) {
                            vm.views.teamsInfoData.push({
                                'templateId': vm.views.templateId,
                                'teamId': key,
                                'teamName': data[key]
                            });
                        }
                        getSelectTeamData();
                    }
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
                });
            }

            function choice_data(teamData) {//保存数据
                cacTemplateService.saveTeamsInfo(teamData).then(function () {
                    console.log("save==", teamData);
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
                });
            }

            function getSelectTeamData() {//获取点击过的数据并回显
                cacTemplateService.getCacTeamConfig(vm.views.templateId).then(function (data) {
                    if (Object.keys(data).length > 0) {
                        for (var key in data) {
                            for (var i =0 ; i < vm.views.teamsInfoData.length ;i++){
                                if(key == vm.views.teamsInfoData[i].teamId){
                                    vm.views.teamsInfoData[i].isChecked = true
                                    break;
                                }
                            }
                        }
                    }
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
                });
            }

        }
    }
)
();

/**
 * @Auther: zml
 * @Date: 2018/4/25
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacFindTemplateCtrl', CacFindTemplateCtrl);
    CacFindTemplateCtrl.$inject = [ '$state', '$stateParams', 'cacTemplateService', '$uibModal', 'messageService'];

    function CacFindTemplateCtrl( $state, $stateParams, cacTemplateService, $uibModal, messageService) {
        var vm = this;
        vm.views = {
            back: back,
            templateRuleNames: "",
            templateHostNames: "",
            auditParams: angular.fromJson($stateParams.template.auditParams),
            templateScripts: [],
            template: $stateParams.template
        };

        //返回模板template列表
        function back() {
            $state.go("app.cac.template", {display:true}, {reload:false});
        }


        //根据数组属性，将数组转换为逗号分隔的字符串
        function resolveArrToString(arr, name) {
            var result = "";
            if (arr != null && arr.length > 0) {
                var templateArr = [];
                for (var i in arr) {
                    templateArr.push(arr[i][name]);
                }
                result = templateArr.join(",");
            }

            return result;
        }

        function init(){
            for(var i=0;i<vm.views.auditParams.length;i++){
                vm.views.auditParams[i].templateHostNames = resolveArrToString(vm.views.auditParams[i].hosts,"hostName");
                vm.views.auditParams[i].templateRuleNames = resolveArrToString(vm.views.auditParams[i].ruleExpressions,"ruleName");
                vm.views.auditParams[i].templateScriptNames = resolveArrToString(vm.views.auditParams[i].scripts,"scriptName");
            }
        }

        init();

    }


})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模板主机模型控制器
    cacModule.controller('CacTemplateHostCtrl', CacTemplateHostCtrl);
    CacTemplateHostCtrl.$inject = ['$scope', '$timeout', 'entity', 'cacService', '$compile', '$uibModalInstance', '$http', 'cacHostService','$translate'];

    function CacTemplateHostCtrl($scope, $timeout, entity, cacService, $compile, $uibModalInstance, $http, cacHostService,$translate) {
        var vm = this;

        vm.views = {
            tableInstance: null,
            categoryName: "",
            category: "",//分类
            existingHosts: entity.hosts,//编辑时，从模板页面传过来的主机。用于点击取消按钮时的回显
            checkedHosts: [],//已选主机用于回显，默认等于模板页面传过来的主机。总的已选的主机
            categoryCheckedHosts: [],//每个组已选主机
            allHosts: [],//数据库中总的主机列表,第一次表格数据的时候就保存起来，当刷新表格的时候，如果allHosts中有数据，则保持之前的数据不变,
            tableHosts: [],//表格中的数据
            index: entity.index,
            selectAll: false,//是否全选
            checkAllHosts: false,//"全部"按钮是否全选
            old_category: "",//上一次category的值
            allCategory: [],
            selectRecord: selectRecord,
            cancel: cancel,
            save: save,
            refreshTableByCategory: refreshTableByCategory,
            checkCategory: checkCategory
        };

        initDefaultCheckHost();

        function initDefaultCheckHost() {
            if (vm.views.existingHosts) {
                for (var i in vm.views.existingHosts) {
                    var host = vm.views.existingHosts[i];
                    vm.views.checkedHosts.push(host);
                }
            }
        }

        function cancel() {
            $uibModalInstance.close({
                action: "cancel",
                selectedHosts: vm.views.existingHosts,
                index: vm.views.index
            });
        }

        //初始化创建表格
        var tableOption = {
            id: 'cac-template-host-table',
            order: [[1, 'asc']],
            aoColumns: [
                {
                    mData: 'id',
                    width: '3rem',
                    title: '<div class="checkbox checkbox-inline checkbox-primary" title="'+$translate.instant('common.entity.detail.select_all')+'"><input type="checkbox" id="selectAllTableHosts"><label for="selectAllTableHosts"></label></div>',
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var checkedStr = "";
                        var host = encodeURI(angular.toJson(row));
                        //addAllHosts(host);
                        if (hasSelected(host)) {
                            checkedStr = ' checked="true" ';
                        }
                        actionHtml = '<div class="checkbox checkbox-inline">' +
                            '<input id="check_' + meta.row + '" type="checkbox" ' + checkedStr + ' class="checkboxHost" host = "' + host + '" ng-click="cacTemplateHostVm.views.selectRecord(\'' + host + '\')">' +
                            '<label for="check_' + meta.row + '"></label></div>';

                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                },
                {mData: 'hostName', title: $translate.instant('app_pms.common.header.hostname')},
                {mData: 'hostKey', title: 'IP'},
                // {mData: 'hostUser', title: '主机用户名'},
                {mData: 'category', title: $translate.instant('cac.template.group')}
                // {mData: 'hostPassword', title: '密码', visible: false}
            ],
            //每一次绘datatables时候调用的方法
            fnPreDrawCallback: function (oSettings) {
                // debugger
            }//,
            /* fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                 debugger
             }*/
        };

        //获取全部的主机类别
        getAllCategory();


        function getAllCategory() {
            cacHostService.getAllCategory().then(function (data) {
                vm.views.allCategory = data;
            }).catch(function (err) {
                throw err;
            });
        }

        init();

        //默认选择的页码为1，换页时判断页面是否一致，修改全选框checked的状态
        var selectedPage = 1;

        function init() {

            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/host.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
                $http({
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/hosts/getHostListByCategory/' + vm.views.category
                }).success(function (ciList, status, header, config, statusText) {
                    vm.views.tableHosts = ciList;
                    if (vm.views.category == "") {
                        vm.views.allHosts = ciList;
                    }
                    tableOption.ajax = function (data, callback, settings) {
                        callback(
                            cacService.assembleTable(ciList)
                        );
                    };

                    $timeout(function () {
                        vm.views.tableInstance = cacService.prepareDatatable(".cac-template-host-dialog .cac-template-host-table", tableOption);

                        if (vm.views.category != "") {
                            if (vm.views.tableHosts.length > 0 && vm.views.tableHosts.length == vm.views.categoryCheckedHosts.length) {
                                vm.views.selectAll = true;
                                angular.element("#selectAllTableHosts").prop("checked", true);
                            }
                        }
                        //为全选框绑定单击事件
                        angular.element("#selectAllTableHosts").on("click", function () {
                            //被点击时，改变全选状态
                            vm.views.selectAll = !vm.views.selectAll;
                            //获取当前页码的数据行的复选框
                            var checkList = angular.element(".checkboxHost");
                            for (var i = 0; i < checkList.length; i++) {
                                //设置数据复选框与全选框勾选状态一致
                                checkList[i].checked = vm.views.selectAll;
                                var host = checkList[i].getAttribute("host");
                                if (vm.views.selectAll == true && !hasSelected(host)) {
                                    //全选时且当前主机选择状态为false时
                                    selectRecord(host);
                                } else if (vm.views.selectAll == false && hasSelected(host)) {
                                    //取消全选，且当前主机选择状态为true时
                                    selectRecord(host);
                                }
                            }
                        });

                        //给表格页码选择组件绑定单击事件
                        angular.element("#cac-template-host-table_paginate").click(function () {
                            //获取页码按钮列表
                            var list = angular.element("#cac-template-host-table_paginate").find(" >.pagination > .paginate_button");
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].getAttribute("class") == "paginate_button active") {
                                    //获取当前激活状态的页码按钮的页码
                                    var newPage = list[i].children[0].getAttribute("data-dt-idx");
                                    if (selectedPage != newPage) {
                                        //当页码变化时，全选框默认状态设置为true，遍历表格当前页面数据勾选状态，若存在非勾选状态的数据，则改变全选框状态为false
                                        angular.element("#selectAllTableHosts").prop("checked", true);
                                        vm.views.selectAll = true;
                                        var checkList = angular.element(".checkboxHost");
                                        for (var i = 0; i < checkList.length; i++) {
                                            if (!checkList[i].checked) {
                                                angular.element("#selectAllTableHosts").prop("checked", false);
                                                vm.views.selectAll = false;
                                                break;
                                            }
                                        }
                                        //修改新页码为当前选择页码
                                        selectedPage = newPage;
                                    }
                                }
                            }
                        });
                    }, 10);
                }).error(function (data, header, config, status) {
                    console.log("Finish  $http ajax error");
                });
            }
        // }


        /**
         * 根据主机分组名，刷新表格数据
         *      如果是全部主机，并且是全新。
         *          则保持每个分组的全选
         *          否则切换到分组时，不保存全选
         * @param category
         */
        function refreshTableByCategory(category) {
            vm.views.category = category;
            if (vm.views.old_category != category) {
                $(".cac-template-host-dialog .cac-template-host-table").dataTable().fnDestroy();
                vm.views.categoryCheckedHosts = [];
                vm.views.selectAll = false;
                angular.element("#selectAllTableHosts").prop("checked", false);
                init();
                if (category == "" && vm.views.checkedHosts.length == vm.views.allHosts.length) {
                    vm.views.selectAll = true;
                    angular.element("#selectAllTableHosts").prop("checked", true);
                } else if (category != "" && vm.views.categoryCheckedHosts.length == vm.views.tableHosts) {
                    vm.views.selectAll = true;
                    angular.element("#selectAllTableHosts").prop("checked", true);
                }
                vm.views.old_category = category;
            }
        }


        /**
         *  li 主机分组菜单栏点击事件
         * @param category
         */
        function checkCategory(category) {
            vm.views.category = category;
            if (vm.views.old_category != category) {
                $(".cac-template-host-dialog .cac-template-host-table").dataTable().fnDestroy();
                vm.views.allHosts = [];
                init();
                vm.views.old_category = category;
            }
        }


        /**
         *  根据checkbox input属性host的值，判断是选择该主机还是取消选则该主机
         * @param event 表格中checkbox input框设定的属性
         */
        function selectRecord(event) {

            var hostAttr = '';
            if ($(event.currentTarget).attr("host") == undefined) {
                hostAttr = event;
            } else {
                hostAttr = $(event.currentTarget).attr("host");
            }
            var host = decodeURI(hostAttr);
            host = angular.fromJson(host);

            if (vm.views.checkedHosts == null) {
                vm.views.checkedHosts = [];
            }
            var hasFound = false;
            for (var i in vm.views.checkedHosts) {
                if (vm.views.checkedHosts[i].id == host.id) {
                    hasFound = true;
                    vm.views.checkedHosts.splice(i, 1);//已选定的行，再次点击时取消选定
                    //设置为非全选样式
                    vm.views.checkAllHosts = false;
                    angular.element("#selectAllTableHosts").prop("checked", false);
                }
            }

            if (!hasFound) {
                vm.views.checkedHosts.push(host);
                if (vm.views.checkedHosts.length == vm.views.allHosts.length) {
                    // vm.views.selectAll = true;
                    vm.views.checkAllHosts = true;
                    angular.element("#selectAllTableHosts").prop("checked", true);
                }
            }

            var categoryFound = false;
            //分组时，已选中的数据,每次分组的时候都要置空，并且循环总的数据，如果存在该分组的数据，就将该数据存放到categoryCheckedHosts中
            for (var i in vm.views.categoryCheckedHosts) {
                if (vm.views.categoryCheckedHosts[i].id == host.id) {
                    categoryFound = true;
                    vm.views.categoryCheckedHosts.splice(i, 1);//已选定的行，再次点击时取消选定
                    //设置为非全选样式
                    vm.views.selectAll = false;
                    angular.element("#selectAllTableHosts").prop("checked", false);
                }
            }

            if (!categoryFound) {
                vm.views.categoryCheckedHosts.push(host);
                if (vm.views.categoryCheckedHosts.length == vm.views.tableHosts.length) {
                    vm.views.selectAll = true;
                    angular.element("#selectAllTableHosts").prop("checked", true);
                }
            }
        }

        /**
         * 回显已选中主机
         * 初始化表格的时候，判断主机host是否已经被选（是否存在于vm.views.checkedHosts中）
         * 将已选中的主机放入该分组的已选主机中，如果该分组的已选主机等于该分组总的主机，则全选
         * host ： 被编码后的json字符串
         * vm.views.checkedHosts : 表示已选中的数据
         * vm.views.existingHosts : 表示模板页面传递过来的主机
         *
         * */
        function hasSelected(host) {
            var host = decodeURI(host);
            host = angular.fromJson(host);
            var result = false;
            for (var i in vm.views.checkedHosts) {
                if (host.id == vm.views.checkedHosts[i].id) {
                    result = true;

                    var index = vm.views.categoryCheckedHosts.findIndex(function (v) {
                        return host.id === v.id;
                    });

                    if (index < 0) {
                        vm.views.categoryCheckedHosts.push(host);
                    }

                }
            }
            return result;
        }


        //保存选择
        function save() {
            $uibModalInstance.close({
                action: "confirm",
                selectedHosts: vm.views.checkedHosts,
                index: vm.views.index
            });
        }


        /**
         * datatable全选。
         *  1、首先将全部数据放入allHosts中
         *  2、绑定全选的点击事件，判断是否是全选
         *      2.1、全选，循环allHosts，将未选中的数据选中
         *      2.2、取消全选，循环allHosts，将已选中的数据取消选中
         *      2.3、将表格销毁在重建
         * */
        function addAllHosts(host) {
            var host = angular.fromJson(decodeURI(host));
            var isExit = false;
            for (var i = 0; i < vm.views.allHosts.length; i++) {
                if (vm.views.allHosts[i].id == host.id) {
                    isExit = true;
                    break;
                }
            }
            if (!isExit) {
                vm.views.allHosts.push(host);
            }
        }


    }


})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模板规则模型控制器
    cacModule.controller('CacTemplateRuleCtrl', CacTemplateRuleCtrl);
    CacTemplateRuleCtrl.$inject = ['$scope', '$timeout', 'entity', 'cacService', '$compile', '$uibModalInstance', '$http', '$translate'];

    function CacTemplateRuleCtrl($scope, $timeout, entity, cacService, $compile, $uibModalInstance, $http, $translate) {
        var vm = this;

        vm.views = {
            existingRules: entity.rules == null ? [] : entity.rules,//编辑时，从模板页面传过来的规则。用于点击取消按钮时的回显
            index: entity.index,
            newRules: [],//已选规则用于回显，默认等于模板页面传过来的规则。总的已选的规则
            selectAll: false,
            selectRecord: selectRecord,
            hasSelected: hasSelected,
            save: save,
            cancel: cancel,
            category: "",
            label: "",
            categoryList: [],
            labelList: [
                $translate.instant('cac.rule.labels.0'),
                $translate.instant('cac.rule.labels.1'),
                $translate.instant('cac.rule.labels.2'),
                $translate.instant('cac.rule.labels.3'),
                $translate.instant('cac.rule.labels.4'),
                $translate.instant('cac.rule.labels.5'),
                $translate.instant('cac.rule.labels.6'),
                $translate.instant('cac.rule.labels.7'),
                $translate.instant('cac.rule.labels.8'),
            ],
            selectRule: selectRule
        };

        initDefaultCheckRule();

        function initDefaultCheckRule() {
            if (vm.views.existingHosts) {
                for (var i in vm.views.existingRules) {
                    var rule = vm.views.existingRules[i];
                    vm.views.newRules.push(rule);
                }
            }
        }

        function selectRule() {
            $(".cac-template-rule-dialog .cac-template-rule-table").dataTable().fnDestroy();
            init();
        }

        function filterRule(ciList, category, label) {
            var tableObj = cacService.assembleTable(ciList);
            var ruleList = [];
            if (category == "") {
                if (label == "") {
                    return tableObj;
                } else {
                    var bool = true;
                    for (var i in ciList) {
                        if (ciList[i].label != null) {
                            for (var j = 0; j < label.length; j++) {
                                if (ciList[i].label.indexOf(label[j]) < 0) {
                                    bool = false;
                                    break;
                                }
                            }
                            if (bool) {
                                ruleList.push(ciList[i]);
                            }
                            bool = true;
                        }
                    }
                }
            } else {
                if (label == "") {
                    for (var i in ciList) {
                        if (ciList[i].category == category) {
                            ruleList.push(ciList[i]);
                        }
                    }
                } else {
                    var bool = true;
                    for (var i in ciList) {
                        if (ciList[i].label != null && ciList[i].category == category) {
                            for (var j = 0; j < label.length; j++) {
                                if (ciList[i].label.indexOf(label[j]) < 0) {
                                    bool = false;
                                    break;
                                }
                            }
                            if (bool) {
                                ruleList.push(ciList[i]);
                            }
                            bool = true;
                        }
                    }
                }
            }
            tableObj.aaData = ruleList;
            tableObj.totalRecords = ruleList.length;
            return tableObj;
        }

        function cancel() {
            $uibModalInstance.close({
                action: "cancel",
                selectedHosts: vm.views.existingRules,
                index: vm.views.index
            });
        }

        function selectRecord(event) {
            var ruleJson = '';
            if ($(event.currentTarget).attr("rule") == undefined) {
                ruleJson = event;
            } else {
                ruleJson = $(event.currentTarget).attr("rule");
            }
            var rule = decodeURI(ruleJson);
            rule = angular.fromJson(rule);
            var hasFound = false;
            for (var i in vm.views.newRules) {
                if (vm.views.newRules[i].id == rule.id) {
                    hasFound = true;
                    vm.views.newRules.splice(i, 1);//已选定的行，再次点击时取消选定
                }
            }

            if (!hasFound) {
                vm.views.newRules.push(rule);
            }

        }

        //判断规则rule是否已经被选
        function hasSelected(rule) {
            var rule = decodeURI(rule);
            rule = angular.fromJson(rule);
            var result = false;

            for (var i in vm.views.existingRules) {
                if (rule.id == vm.views.existingRules[i].id) {
                    result = true;
                    var index = vm.views.newRules.findIndex(function (v) {
                        return rule.id === v.id;
                    });

                    if (index < 0) {
                        vm.views.newRules.push(rule);
                    }
                    break;
                }
            }
            return result;
        }

        //保存选择
        function save() {
            //_.difference(vm.views.newRules, vm.views.existingRules);
            $uibModalInstance.close({
                action: "confirm",
                selectedRules: vm.views.newRules,
                index: vm.views.index
            });
        }

        var tableOption = {
            id: 'cac-template-rule-table',
            order: [[3, 'desc'], [2, 'desc']],
            aoColumns: [
                {
                    mData: 'id',
                    title: '<div class="checkbox checkbox-primary checkbox-inline" title="{{\'common.entity.detail.select_all\' | translate}}">' +
                        '<input type="checkbox" id="selectAll"><label for="selectAll"></label>' +
                        '</div>',
                    className: 'text-center',
                    width: '10%',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        //取出所有规则分类
                        if (vm.views.categoryList.indexOf(row.category) < 0) {
                            vm.views.categoryList.push(row.category);
                        }

                        var rule = encodeURI(angular.toJson(row));
                        var checkedStr = ' ';
                        if (hasSelected(rule)) {
                            checkedStr = ' checked="true" ';
                        }
                        //TODO 外部代码中，ng-click函数的文本类型参数不能包含单引号，否则angularjs $compile时会报错。
                        // 临时解决方案为把参数文本作为dom元素属性，点击事件获取此属性
                        // 合理的解决方案是ng-click事件传递对象id，js根据id查找对应记录
                        var actionHtml = '<div class="checkbox checkbox-inline" >' +
                            '<input type="checkbox" class="checkboxRule" title="' + data + '"' + checkedStr + ' rule="' + rule +
                            '" ng-click="cacTemplateRuleVm.views.selectRecord($event)" id="' + meta.row + '"><label for="' + meta.row + '"></label>' +
                            '</div>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                },
                {
                    mData: 'ruleName',
                    title: $translate.instant('cac.rule.detail.name'),
                    width: "180px",
                    className: 'cac-text-overflow',
                    render: function (data) {
                        var actionHtml = '<span style="overflow:hidden;text-overflow: ellipsis;" class="cac-text-overflow" title=\'' + data + '\' >' + data + '</span>';
                        return actionHtml;
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                },
                {mData: 'createdAt', title: $translate.instant('common.entity.detail.create_at'), visible: false, order: 'desc'},
                {mData: 'updatedAt', title: $translate.instant('common.entity.detail.update_at'), visible: false, order: 'desc'},
                {
                    mData: 'ruleExpression',
                    title: $translate.instant('cac.rule.detail.expr'),
                    className: 'cac-text-overflow',
                    render: function (data) {
                        var actionHtml = '<span style="overflow:hidden;text-overflow: ellipsis;" class="cac-text-overflow" title=\'' + data + '\' >' + data + '</span>';
                        return actionHtml;
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        //默认选择的页码为1，换页时判断页面是否一致，修改全选框checked的状态
        var selectedPage = 1;

        function init() {
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/rule.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
                $http({
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/rules'
                }).success(function (ciList, status, header, config, statusText) {
                    tableOption.ajax = function (data, callback, settings) {
                        callback(
                            filterRule(ciList, vm.views.category, vm.views.label)
                        );
                    };

                    $timeout(function () {
                        cacService.prepareDatatable(".cac-template-rule-dialog .cac-template-rule-table", tableOption);
                        //为全选框绑定单击事件
                        angular.element("#selectAll").on("click", function () {
                            //被点击时，改变全选状态
                            vm.views.selectAll = !vm.views.selectAll;
                            //获取当前页码的数据行的复选框
                            var checkList = angular.element(".checkboxRule");
                            for (var i = 0; i < checkList.length; i++) {
                                //设置数据复选框与全选框勾选状态一致
                                checkList[i].checked = vm.views.selectAll;
                                var rule = checkList[i].getAttribute("rule");
                                if (vm.views.selectAll == true && !hasSelected(rule)) {
                                    //全选时且当前规则选择状态为false时
                                    selectRecord(rule);
                                } else if (vm.views.selectAll == false && hasSelected(rule)) {
                                    //取消全选，且当前规则选择状态为true时
                                    selectRecord(rule);
                                }
                            }
                        });
                        //给表格页码选择组件绑定单击事件
                        angular.element("#cac-template-rule-table_paginate").click(function () {
                            //获取页码按钮列表
                            var list = angular.element("#cac-template-rule-table_paginate").find(" >.pagination > .paginate_button");
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].getAttribute("class") == "paginate_button active") {
                                    //获取当前激活状态的页码按钮的页码
                                    var newPage = list[i].children[0].getAttribute("data-dt-idx");
                                    if (selectedPage != newPage) {
                                        //当页码变化时，全选框默认状态设置为true，遍历表格当前页面数据勾选状态，若存在非勾选状态的数据，则改变全选框状态为false
                                        angular.element("#selectAll").prop("checked", true);
                                        vm.views.selectAll = true;
                                        var checkList = angular.element(".checkboxRule");
                                        for (var i = 0; i < checkList.length; i++) {
                                            if (!checkList[i].checked) {
                                                angular.element("#selectAll").prop("checked", false);
                                                vm.views.selectAll = false;
                                                break;
                                            }
                                        }
                                        //修改新页码为当前选择页码
                                        selectedPage = newPage;
                                    }
                                }
                            }
                        });
                    }, 10);
                }).error(function (data, header, config, status) {
                    console.log("Finish  $http ajax error");
                });
            }
        // }

        init();
    }

})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模板脚本模型控制器
    cacModule.controller('CacTemplateScriptCtrl', CacTemplateScriptCtrl);
    CacTemplateScriptCtrl.$inject = ['$scope', '$timeout', 'entity', 'cacService', '$compile', '$uibModalInstance', '$http', '$translate'];

    function CacTemplateScriptCtrl($scope, $timeout, entity, cacService, $compile, $uibModalInstance, $http, $translate) {
        var vm = this;

        vm.views = {
            existingScripts: entity.scripts == null ? [] : entity.scripts,//编辑时，从模板页面传过来的脚本。用于点击取消按钮时的回显
            index: entity.index,
            scriptType: entity.scriptType,
            newScripts: [],//已选脚本用于回显，默认等于模板页面传过来的脚本。总的已选的脚本
            selectRecord: selectRecord,
            save: save,
            cancel: cancel
        };
        initDefaultCheckScript();

        function initDefaultCheckScript() {
            if (vm.views.existingScripts) {
                for (var i in vm.views.existingScripts) {
                    var script = vm.views.existingScripts[i];
                    vm.views.newScripts.push(script);
                }
            }
        }

        function cancel() {
            $uibModalInstance.close({
                action: "confirm",
                selectedScripts: vm.views.existingScripts,
                index: vm.views.index
            });
        }


        function selectRecord(script) {
            var script = decodeURI(script);
            script = angular.fromJson(script);

            if (vm.views.scriptType == cacService.playbookScripType) {
                vm.views.existingScripts = [];
                vm.views.newScripts = [];
                vm.views.existingScripts.push(script);
                vm.views.newScripts.push(script);
            } else {
                var hasFound = false;
                for (var i in vm.views.newScripts) {
                    if (vm.views.newScripts[i].id == script.id) {
                        hasFound = true;
                        vm.views.newScripts.splice(i, 1);//已选定的行，再次点击时取消选定
                    }
                }

                if (!hasFound) {
                    vm.views.newScripts.push(script);
                }
            }



        }

        function hasSelected(script) {
            var script = decodeURI(script);
            script = angular.fromJson(script);
            var result = false;

            for (var i in vm.views.newScripts) {
                if (script.id == vm.views.newScripts[i].id) {
                    result = true;
                    var index = vm.views.newScripts.findIndex(function (v) {
                        return script.id === v.id;
                    });

                    if (index < 0) {
                        vm.views.newScripts.push(script);
                    }
                    break;
                }
            }

            return result;
        }

        //保存选择
        function save() {
            //找到给定数组中其他参数数组没有的元素，然后将这些元素组成新数组返回。vm.views.newScripts用来检查的数组，vm.views.existingScripts用来排出的数组。
            // _.difference(vm.views.newScripts, vm.views.existingScripts);
            $uibModalInstance.close({
                action: "confirm",
                selectedScripts: vm.views.newScripts,
                index: vm.views.index
            });
        }


        var tableOption = {
            id: 'cac-template-script-table',
            order: [[3, 'desc'],[2, 'desc']],
            aoColumns: [
                {
                    mData: 'id', title: $translate.instant('common.entity.detail.select'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {

                        var script = encodeURI(angular.toJson(row));

                        var checkedStr = "";
                        if (hasSelected(script)) {
                            checkedStr = ' checked="true" ';
                        }

                        actionHtml = '<label class="i-checks" >' +
                            '<input type="checkbox" ' + checkedStr + ' ng-click="cacTemplateScriptVm.views.selectRecord(\'' + script + '\')"><i></i>' +
                            '</label>';

                        if (vm.views.scriptType == cacService.playbookScripType) {
                            actionHtml = '<label class="i-checks" >' +
                                '<input name="scriptId" type="radio" ' + checkedStr + ' ng-click="cacTemplateScriptVm.views.selectRecord(\'' + script + '\')"><i></i>' +
                                '</label>';
                        }


                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                },
                {mData: 'scriptName', title: $translate.instant('cac.script.name'), width: "180px"},
                {mData: 'createdAt', title: $translate.instant('common.entity.detail.create_at'), visible: false, order:'desc'},
                {mData: 'updatedAt', title: $translate.instant('common.entity.detail.update_at'), visible: false, order:'desc'},
                {mData: 'scriptParams', title: $translate.instant('cac.script.detail.param')}
            ]
        };

        function init() {
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/script.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/scripts/';
                if(vm.views.scriptType==cacService.playbookScripType){
                    url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/scripts/getScriptsBy/' + cacService.scriptZipType;
                }
                $http({
                    url: url
                }).success(function (ciList, status, header, config, statusText) {
                    tableOption.ajax = function (data, callback, settings) {
                        callback(
                            cacService.assembleTable(ciList)
                        );
                    };

                    $timeout(function () {
                        //初始化datatables，并保存实例
                        cacService.prepareDatatable(".cac-template-script-dialog .cac-template-script-table", tableOption);
                    }, 10);
                }).error(function (data, header, config, status) {
                    console.log("Finish  $http ajax error");
                });
            }
        // }

        init();
    }


})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacTemplateSquareCtrl', CacTemplateSquareCtrl);
    CacTemplateSquareCtrl.$inject = ['$scope', '$timeout', '$state', 'cacService', 'cacTemplateService', '$compile', 'messageService', '$filter', '$http', 'currentUser', 'cacResultService', '$translate', 'Param'];

    function CacTemplateSquareCtrl($scope, $timeout, $state, cacService, cacTemplateService, $compile, messageService, $filter, $http, currentUser, cacResultService, $translate, Param) {
        var vm = this;


        vm.views = {
            deleteTemplate: deleteTemplate,
            editTemplate: editTemplate,
            findTemplate: findTemplate,
            run: run,
            dashboardSwitch: "",
            teamsSwitch: ""
        };

        function init() {
            Param.getByDomain('cac').then(function (result) {
                let elementMap = new Map();
                result.forEach(item => elementMap.set(item.name, item.value));
                vm.views.dashboardSwitch = elementMap.get('dashboard_switch')  || 'no';
                vm.views.teamsSwitch = elementMap.get('teams_switch')  || 'no';
            }).catch(function (err) {
                throw err;
            });

            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     //使用假数据
            //     var templateUrl = "app/modules/cac/api/template.json";
            //     $http.get(templateUrl).then(function (data) {
            //         vm.views.templateList = data;
            //         for (var i = 0; i < vm.views.templateList.length; i++) {
            //             vm.views.templateList[i].auditParams = angular.fromJson(vm.views.templateList[i].auditParams);
            //         }
            //     }).catch(function (err) {
            //         throw err;
            //     });
            // } else {
            cacTemplateService.getSquareTemplates().then(function (data) {
                vm.views.templateList = data;
                vm.views.templateSquareList = data;
                for (var i = 0; i < vm.views.templateSquareList.length; i++) {
                    vm.views.templateSquareList[i].auditParams = angular.fromJson(vm.views.templateSquareList[i].auditParams);
                    var hostLength = 0;
                    // var rulesLength = 0;
                    var scriptsLength = 0;
                    //todo 未去重
                    for (var j = 0; j < vm.views.templateSquareList[i].auditParams.length; j++) {
                        hostLength += vm.views.templateSquareList[i].auditParams[j].hosts.length;
                        // rulesLength += vm.views.templateSquareList[i].auditParams[j].ruleExpressions.length;
                        scriptsLength += vm.views.templateSquareList[i].auditParams[j].scripts.length;
                    }
                    vm.views.templateList[i].hostLength = hostLength;
                    vm.views.templateList[i].scriptsLength = scriptsLength;
                    var executedAt = $filter('date')(vm.views.templateList[i].executedAt, 'yyyy-MM-dd HH:mm:ss');
                    vm.views.templateList[i].executedTime = moment(executedAt).fromNow();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        // }

        function deleteTemplate(id) {
            if (id != null) {
                var owner = "";
                vm.views.templateList.forEach(function (template) {
                    if (template.id == id) {
                        owner = template.createdBy;
                    }
                });
                if (currentUser.isSameUser(owner) || currentUser.hasPermission('cac:edit')) {
                    messageService.confirm(
                        $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                        $translate.instant('common.messages.operation.body', {
                            operation: $translate.instant('common.entity.action.delete'),
                            obj: $translate.instant('cac.common.template')
                        }), function () {
                            doDeleteTemplate(id, function () {
                                init();
                            });
                        });

                } else {
                    messageService.alertError($translate.instant('common.uaa.no_permission_title'), $translate.instant('cac.messages.cannot_delete'))
                }
            }
        }

        function doDeleteTemplate(id, callBack) {
            cacTemplateService.deleteTemplate(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }


        function editTemplate(template) {
            template = angular.fromJson(decodeURI(template));
            $state.go("app.cac.template_edit", {template: template});

        }

        function findTemplate(template) {
            template = angular.fromJson(decodeURI(template));
            $state.go("app.cac.template.findTemplate", {template: template});
        }


        function run(template) {
            template = angular.fromJson(decodeURI(template));
            $state.go("app.cac.job_add", {templateId: template.id});
        }

        init();

    }

})
();

/**
 * @Auther: zml
 * @Date: 2018/5/23
 */
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.template-user', {
                url: '/template-user',
                data: {
                    authorities: ['ROLE_USER'],
                    // pageTitle: $translate.instant('cac.index.template')
                },
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/cac/template/user/template-user-index.html',
                        controller: 'CacTemplateUserCtrl',
                        controllerAs: 'cacTemplateUserCtrlVm'
                    }
                },
                resolve: {}
            })
            .state('app.template-user.list', {
                url: '/template-user/list',
                data: {
                    authorities: ['ROLE_USER'],
                    // pageTitle: $translate.instant('cac.index.template')
                },
                views: {
                    'template': {
                        templateUrl: 'app/modules/cac/template/user/template-user-list.html',
                        controller: 'CacTemplateListCtrl',
                        controllerAs: 'cacTemplateListCtrlVm'
                    }
                },
                resolve: {}
            })
        ;
    }])
    ;
})();

/**
 * @Auther: zml
 * @Date: 2018/5/23
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacTemplateUserService", cacTemplateUserService);

    cacTemplateUserService.$inject = ["cacDao"];

    function cacTemplateUserService(cacDao) {

        function getTemplates() {
            return cacDao.getTemplates();
        }
        var service = {
            getTemplates: getTemplates
        }
        return service;
    }


})();


/**
 * @Auther: zml
 * @Date: 2018/5/23
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //template模块普通用户 控制器
    cacModule.controller('CacTemplateUserCtrl', CacTemplateUserCtrl);
    CacTemplateUserCtrl.$inject = ['cacTemplateUserService', '$rootScope', '$scope', '$interval', '$timeout', '$state', '$stateParams', '$uibModal'];

    function CacTemplateUserCtrl(cacTemplateUserService, $rootScope, $scope, $interval, $timeout, $state, $stateParams, $uibModal) {
        var vm = this;

        vm.views = {
            getTemplates: getTemplates,
            templateList: [],
            auditParams: []
        }

        function getTemplates() {
            cacTemplateUserService.getTemplates().then(function (data) {
                vm.views.templateList = data;
                for (var i = 0; i < vm.views.templateList.length; i++) {
                    vm.views.templateList[i].auditParams = angular.fromJson(vm.views.templateList[i].auditParams);
                }

            }).catch(function (err) {
                throw err;
            });
        }

        function init() {
            vm.views.getTemplates();
        }

        init();
    }

    cacModule.controller('CacTemplateUserListCtrl', CacTemplateUserListCtrl);
    CacTemplateUserListCtrl.$inject = ['cacTemplateUserService', '$scope', '$interval', '$timeout', '$state', '$stateParams', '$uibModal'];

    function CacTemplateUserListCtrl(cacTemplateUserService, $scope, $interval, $timeout, $state, $stateParams, $uibModal) {
        var vm = this;


    }
})();

/**
 * @Auther: zml
 * @Date: 2018/5/24
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检任务************************************************/
            .state('app.cac.job', {
                url: '/job',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/job/job-index.html',
                        controller: 'CacJobCtrl',
                        controllerAs: 'cacJobCtrlVm'
                    }
                }

            })
            .state('app.cac.job_add', {
                url: '/job/:templateId/add',
                params: {
                    "job": null,
                    "jobStatus": "adding"
                },
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/job/job-run.html',
                        controller: 'CacJobRunCtrl',
                        controllerAs: 'cacJobRunCtrlVm'
                    }
                }

            })
            .state('app.cac.job.list', {
                url: '/jobList/:templateId',
                views: {
                    'jobList': {
                        templateUrl: 'app/modules/cac/job/job-list.html',
                        controller: 'CacJobListCtrl',
                        controllerAs: 'cacJobListCtrlVm'
                    }
                }

            })
        ;
    }])
    ;
})
();

/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacJobService", cacJobService);

    cacJobService.$inject = ["cacDao"];

    function cacJobService(cacDao) {

        function deleteJob(id) {
            return cacDao.deleteJob(id);   // 返回承诺
        }

        //根据Id查询Job
        function queryJob(id) {
            return cacDao.queryJob(id);
        }

        function getJob(id) {
            return cacDao.getJob(id);
        }

        function updateJob(job) {
            return cacDao.updateJob(job);
        }

        function addJob(job) {
            return cacDao.addJob(job);
        }

        function run(job) {
            return cacDao.run(job);
        }

        var service = {
            getJob: getJob,
            queryJob: queryJob,
            deleteJob: deleteJob,
            updateJob: updateJob,
            addJob: addJob,
            run: run
        }
        return service;


    }


})();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacJobCtrl', CacJobCtrl);
    CacJobCtrl.$inject = ['$state', '$stateParams', 'cacTemplateService', '$timeout', '$uibModal', 'userPref', 'Param'];

    function CacJobCtrl($state, $stateParams, cacTemplateService, $timeout, $uibModal, userPref, Param) {
        var vm = this;

        vm.views = {
            clearFilter: clearFilter,
            templateOrder: userPref.readItem('templateOrder', '-templateName'),
            changeTemplateOrder: changeTemplateOrder,
            templateList: [],
            structuralSwitch: ""
        };

        function clearFilter() {
            vm.views.templateName = '';
        }

        function getAllTemplate() {
            cacTemplateService.getTemplates().then(function (data) {
                vm.views.templateList = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function init() {
            Param.getByDomainAndName('cac', 'structural_switch').then(function (result) {
                vm.views.structuralSwitch = result.value;
            }).catch(function (err) {
                throw err;
            });

            getAllTemplate();
            var urlParam = $stateParams.template;
            if (urlParam == null) {
                //$state.go("app.cac.job.jobList", {});
            } else {
                $state.go("app.cac.job.addJob", {template: urlParam});
            }
        }

        function changeTemplateOrder(templateOrder) {
            userPref.saveItem('templateOrder', templateOrder);
            vm.views.templateOrder = userPref.readItem('templateOrder', '-templateName');
        }

        init();

    }

    //模型控制器
    cacModule.controller('CacJobListCtrl', CacJobListCtrl);
    CacJobListCtrl.$inject = ['$q', '$scope', '$http', '$timeout', '$state', 'cacService', 'cacTemplateService', '$compile', '$uibModal', '$stateParams', '$filter', 'currentUser', 'dataTable', '$httpParamSerializerJQLike', '$translate'];

    function CacJobListCtrl($q, $scope, $http, $timeout, $state, cacService, cacTemplateService, $compile, $uibModal, $stateParams, $filter, currentUser, dataTable, $httpParamSerializerJQLike, $translate) {
        var vm = this;

        vm.views = {
            template: {},
            tableInstance: null,
            findJobStatus: findJobStatus,
            templateId: $stateParams.templateId,
            // refreshTable: refreshTable
            // refresh: "刷新列表"
        };


        var columnDefs = [
            {
                data: 'templateName',
                title: $translate.instant('cac.common.template')
            },
            {
                data: 'auditParams',
                title: $translate.instant('cac.template.detail.audit_params'),
                render: function (data, type, row, meta) {
                    var auditParams = angular.fromJson(row.auditParams);
                    var html = '';
                    for (var i = 0; i < auditParams.length; i++) {
                        var auditParam = auditParams[i];
                        html += '{{\'cac.common.script\' | translate}}：<strong>' + auditParam.scripts.length + '</strong>，' +
                            '{{\'cac.common.host\' | translate}}：<strong>' + auditParam.hosts.length + '</strong>' +
                            '<br>';
                    }
                    return '<div>' + html + '</div>';
                }
            },
            {
                data: 'createdAt',
                title: $translate.instant('common.entity.detail.start_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'endedAt',
                title: $translate.instant('common.entity.detail.end_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.endedAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'createdBy',
                title: $translate.instant('cac.job.detail.create_at'),
            },
            {
                data: 'id',
                title: $translate.instant('cac.job.detail.status'),
                render: function (data, type, row, meta) {
                    var id = "'" + row.id + "'";
                    var jobStatus = row.jobStatus;
                    var actionHtml = "";
                    if (jobStatus === "ERROR") {
                        actionHtml = '<button type="button" class="btn btn-danger rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacJobListCtrlVm.views.findJobStatus(' + id + ')">' +
                            '{{\'cac.result.status.error\' | translate}}</button>';
                    } else if (jobStatus === "OK") {
                        actionHtml = '<button type="button" class="btn btn-success rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacJobListCtrlVm.views.findJobStatus(' + id + ')">' +
                            '{{\'cac.result.status.ok\' | translate}}</button>';
                    } else {
                        actionHtml = '<button type="button" class="btn btn-primary rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacJobListCtrlVm.views.findJobStatus(' + id + ')">' +
                            '{{\'cac.result.status.running\' | translate}}</button>';
                    }
                    return actionHtml;
                }
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var isEnbled = '';
                    if ("WAITING" === row.jobStatus) {
                        isEnbled = 'disabled';
                    }
                    return '<a type="button"  ng-if="\'yes\' === cacJobCtrlVm.views.structuralSwitch" uaa-has-permission="cac:edit:*" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac.structural_diagram({jobId:\'' + row.id + '\'})"><i class="fa fa-sitemap"></i></a>' +
                        // '<a type="button" uaa-has-permission="cac:edit:*" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac.data_driven({jobId:\'' + row.id + '\'})"><i class="fa fa-sitemap"></i></a>'+
                        '<a type="button" uaa-has-permission="cac:edit:*" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac.result({jobId:\'' + row.id + '\'})"><i class="fa fa-grip-horizontal"></i></a>';
                }
            }
        ];
        var tableOption = {
            // id: 'cacJobTable',
            // order: [[2, 'desc']],
            // serverSide: true,
            // stateSave: false,
            aoColumns: columnDefs
            // fnPreDrawCallback: function (oSettings) {
            //     // debugger
            // }//,
        };
        this.tableConfig = {
            columns: columnDefs,
            data: [function (dtDataToServer) {
                var d = $q.defer();
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/jobs/page/' + vm.views.templateId;
                //https://stackoverflow.com/questions/24710503/how-do-i-post-urlencoded-form-data-with-http-without-jquery/30970229#30970229
                $http({
                    url: url,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                    },
                    data: $httpParamSerializerJQLike(dtDataToServer)
                }).then(function (res) {
                    var result = res.data;
                    result.draw = dtDataToServer.draw;
                    d.resolve(result);
                    //console.log(result);
                }, function (err) {
                    d.reject(err);
                    throw err;
                });
                return d.promise;
            }, '', true],
            order: [[2, 'desc']],
            buttons: ['reload']
        };

        // function refreshTable() {
        //     if (vm.views.isRefreshing) {
        //         return;
        //     }
        //     // console.log(angular.element("#cacJobTable").DataTable().clear());
        //     // console.log(angular.element("#cacJobTable").dataTable().fnDestroy());
        //     vm.views.isRefreshing = true;
        //     vm.views.refreshClass = "icon-spining";
        //     init();
        // }

        function init() {
            if (vm.views.templateId == null || vm.views.templateId == '' || vm.views.templateId == undefined) {
                vm.views.templateId = 'all';
            }

            // dataTable.initTable("#cacJobTable", tableOption.aoColumns, undefined, {
            //     scrollX: true,
            //     order: [[2, 'desc']],
            //     serverSide: true,
            //     stateSave: false,
            //     initComplete: function () {
            //         var groupSelecthtml = '<div class="text-left" style="margin-top: -26px">' +
            //             '<button  ng-click="cacJobListCtrlVm.views.refreshTable()" class="btn btn-default btn-sm" style="width: auto">' +
            //             '刷新列表 <i ng-if="cacJobListCtrlVm.views.isRefreshing" ' +
            //             'class="fa fa-sync {{cacJobListCtrlVm.views.refreshClass}}"></i></button>' +
            //             '</div>';
            //         $compile(groupSelecthtml)($scope).appendTo("#cacJobTable_filter");
            //     },
            //     ajax: {
            //         url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/jobs/page/' + vm.views.templateId,
            //         dataSrc: "data",
            //         type: "POST",
            //         dataType: "json",
            //         async: false
            //     }
            // }).then(function (apiInstance) {
            //     vm.views.tableInstance = apiInstance;
            //     vm.views.isRefreshing = false;
            //     vm.views.refreshClass = "";
            // }).catch(function (err) {
            //     throw err;
            // });

            var template = $stateParams.template;
            if (template != null) {
                $state.go("app.cac.job.addJob", {template: template});
            }
        }

        function findJobStatus(id) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/job/job-run-log.html',
                controller: 'CacJobRunLogCtrl',
                controllerAs: 'cacJobRunLogVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: id
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

        init();
    }
})
();

/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacJobRunCtrl', CacJobRunCtrl);
    CacJobRunCtrl.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'cacJobService', '$http', 'messageService', 'cacService', 'restUtils', '$translate'];

    function CacJobRunCtrl($scope, $timeout, $state, $stateParams, cacJobService, $http, messageService, cacService, restUtils, $translate) {
        var vm = this;
        var template = $stateParams.template == null ? {} : $stateParams.template;

        vm.views = {
            job: {},
            template: template,
            save: save,
            run: run,
            back: back
        };

        //接收子页面传过来的数据
        $scope.$on("template", function (event, data) {
            vm.views.job.auditParams = data.auditParams;
            vm.views.job.templateName = data.templateName;
            vm.views.job.templateId = data.id;
            vm.views.job.scriptType = data.scriptType;
        });

        function back() {
            $state.go("app.cac.template.list", {display: true}, {reload: false});
        }

        function run() {
            //向下广播，子页面接收到到信息之后作出处理，并用$scope.$on()接收
            $scope.$broadcast("to-template", {});
            //校验是否为空
            if (vm.views.job.templateName == null || vm.views.job.templateName == "") {
                messageService.toast("error", $translate.instant('cac.message.input', { name: $translate.instant('cac.template.name') }));
                return;
            }
            if (vm.views.job.auditParams == undefined) {
                messageService.toast("error", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('cac.common.square') }));
                return;
            } else {
                var arr = angular.fromJson(vm.views.job.auditParams);
                if (arr.length > 0) {
                    for (var i = 0; i < arr.length; i++) {
                        var index = i + 1;
                        if (arr[i].hosts.length == 0) {
                            vm.views.info = $translate.instant('cac.messages.pls_select_host', { index: index });
                            messageService.toast("error", vm.views.info);
                            return;
                        } else if (arr[i].scripts.length == 0) {
                            vm.views.info = $translate.instant('cac.messages.pls_select_script', { index: index });
                            messageService.toast("error", vm.views.info);
                            return;
                        } else if (vm.views.job.scriptType != cacService.playbookScripType && arr[i].ruleExpressions.length == 0) {
                            // vm.views.info = "请选择检查项" + index + "的规则";
                            // messageService.toast("error", vm.views.info);
                            // return;
                        }
                    }
                } else if (arr.length == 0) {
                    vm.views.info = $translate.instant('cac.messages.pls_add_check');
                    messageService.toast("error", vm.views.info);
                    angular.element('.cac-job-run-btn').html("<i class=\"fa fa-play\"></i> {{'cac.template.run' | translate}}");
                    return;
                }
            }

            angular.element('.cac-job-run-btn').text($translate.instant('cac.messages.running'));
            /*
                        //检查规则、主机、脚本是否发生过变化
                        cacService.updateAuditParams(vm.views.job.auditParams).then(function (data) {
                           // vm.views.job.auditParams = angular.toJson(data);
                            vm.views.job.auditParams = data;
                            //获取子controller传递过来的template
                            //执行之前先保存job,在执行(后台已执行)

                        }).catch(function (data) {
                                console.log("$http通过检查规则重新获取auditParams失败！"+data);
                        });*/
            cacJobService.run(vm.views.job).then(function (data) {
                messageService.toast("success", $translate.instant('cac.messages.checking'));
                $state.go("app.cac.job.list", {templateId: vm.views.job.templateId});
            }).catch(function (data) {
                angular.element('.cac-job-run-btn').html("<i class=\"fa fa-play\"></i> {{'cac.template.run' | translate}}");
                //data.message获取主要异常信息
                //data.stack获取详细异常信息
                messageService.toast("error", data.message);
            });
        }


        function save() {
            //触发点击事件，子controller（template controller）向父controller传递数据
            //$scope.$broadcast("to-template", {});
            $timeout(function () {
                //获取子controller传递过来的template
                if (vm.views.job.auditParams == undefined) {
                    return;
                } else {
                    cacService.deleteAuditJsonAttr(angular.fromJson(vm.views.job.auditParams));
                }
                cacJobService.addJob(vm.views.job).then(function () {
                    messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
                }).catch(function (data) {
                    messageService.toast("error", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('common.entity.action.save') }) + "：" + data);
                });

                $state.go("app.cac.job", {});
            }, 1000);
        }

        init();

        function init() {
            if ($stateParams.template != null) {
                vm.views.job = {};
                vm.views.job.templateName = $stateParams.template.templateName;
                vm.views.job.auditParams = $stateParams.template.auditParams;
            }
        }

    }

})
();

/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacJobRunLogCtrl', CacJobRunLogCtrl);
    CacJobRunLogCtrl.$inject = ['cacJobService', 'params', '$uibModalInstance'];

    function CacJobRunLogCtrl(cacJobService, params, $uibModalInstance) {
        var that = this;
        this.jobId = params.jobId;
        this.cancel = cancel;
        init();

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
            cacJobService.queryJob(that.jobId).then(function (cacJob) {
                that.runId = cacJob.taskId;
            });
        }
    }
})
();

/**
 * @Auther: zml
 * @Date: 2018/4/21
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        // if (window.$oplus.appConfig.modules.cac && !window.$oplus.appConfig.modules.cac.useCacV1) {
        if (window.$oplus.appConfig.modules.cac) {
            $stateProvider
                .state('app.cac.script', {
                    url: '/gfs/{dir:any}',
                    views: {
                        'cacList': {
                            templateUrl: 'app/modules/gfs/repo-navi.html',
                            controller: 'GfsRepoNavCtrl',
                            controllerAs: '$ctrl'
                        }
                    },
                    resolve: {
                        repoType: function () {
                            return 'git';
                        }
                    }
                });
        } else {
            $stateProvider
                /***********************************************巡检脚本************************************************/
                .state('app.cac.script', {
                    url: '/script',
                    cache: false,
                    views: {
                        'cacList': {
                            templateUrl: 'app/modules/cac/script/script-list.html',
                            controller: 'CacScriptListCtrl',
                            controllerAs: 'cacScriptListCtrlVm'
                        }
                    }
                }).state('app.cac.scripts_upload', {
                url: '/script/upload',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/script/scripts-upload.html',
                        controller: 'CacScriptsUploadCtrl',
                        controllerAs: 'cacScriptsUploadCtrlVm'
                    }
                }
            });
        }
    }]);
})();

/**
 * @Auther: zml
 * @Date: 2018/5/11
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacScriptService", cacScriptService);

    cacScriptService.$inject = ["cacDao"];

    function cacScriptService(cacDao) {

        function deleteScript(id) {
            return cacDao.deleteScript(id);
        }

        //根据Id查询Script
        function queryScript(id) {
            return cacDao.queryScript(id);
        }

        function updateScript(script) {
            return cacDao.updateScript(script);
        }

        function addScript(scripts) {
            return cacDao.addScript(scripts);
        }

        function uploadFile(form) {
            return cacDao.uploadFile(form);
        }

        function checkScript(fileName) {
            return cacDao.checkScript(fileName);
        }

        function getScriptContentByName(fileName) {
            return cacDao.getScriptContentByName(fileName);
        }


        function deleteScriptFile(filename) {
            return cacDao.deleteScriptFile(filename);
        }


        var service = {
            deleteScript: deleteScript,
            deleteScriptFile: deleteScriptFile,
            queryScript: queryScript,
            getScriptContentByName: getScriptContentByName,
            updateScript: updateScript,
            addScript: addScript,
            uploadFile: uploadFile,
            checkScript: checkScript
        }
        return service;


    }


})();

/**
 * @Auther: zml
 * @Date: 2018/5/14
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacScriptListCtrl', CacScriptListCtrl);
    CacScriptListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$http', 'cacScriptService', '$compile', '$uibModal', 'messageService', '$translate'];

    function CacScriptListCtrl($scope, $timeout, cacService, $http, cacScriptService, $compile, $uibModal, messageService, $translate) {
        var vm = this;
        vm.views = {
            editScript: editScript,
            editScriptContent: editScriptContent,
            addScript: addScript,
            findScript: findScript,
            deleteScript: deleteScript,
            deleteScriptFile: deleteScriptFile,
            tableInstance: null
        }


        function addScript() {
            doUploadScripts(null);
        }

        function editScriptContent(scriptName) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/script/script-content-edit.html',
                controller: 'CacScriptEditCtrl',
                controllerAs: 'cacScriptEditVm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    entity: function () {
                        return {
                            scriptName: scriptName
                        }
                    }
                }
            }).result.then(function (result) {
                //关闭模态框时执行，result是关闭时传递过来的参数
                var action = result.action;
                if (action != "cancel") {
                    //重置（默认或者设置为true）或者保持分页信息（设置为false）
                    vm.views.tableInstance.ajax.reload(null, false);
                }
            }).catch(function (err) {
                throw err;
            });
        }

        //编辑脚本
        function editScript(script) {
            var script = decodeURI(script);//url解码
            $uibModal.open({
                templateUrl: 'app/modules/cac/script/script-edit.html',
                controller: 'CacScriptEditCtrl',
                controllerAs: 'cacScriptEditVm',
                backdrop: 'static',
                size: 'md',//设置模态框大小
                resolve: {
                    entity: function () {
                        return {
                            script: script == "undefined" ? null : angular.fromJson(script)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {
                //关闭模态框时执行，result是关闭时传递过来的参数
                var action = result.action;
                if (action != "cancel") {
                    //重置（默认或者设置为true）或者保持分页信息（设置为false）
                    vm.views.tableInstance.ajax.reload(null, false);
                }
            }).catch(function (err) {
                throw err;
            });
        }

        //添加脚本
        function addScript() {
            var script = decodeURI(script);//url解码
           // console.log(script);
            $uibModal.open({
                templateUrl: 'app/modules/cac/script/script-upload.html',
                controller: 'CacScriptUploadCtrl',
                controllerAs: 'cacScriptUploadVm',
                backdrop: 'static',
                size: 'md',//设置模态框大小
                resolve: {
                    entity: function () {
                        return {
                            script: script == "undefined" ? null : angular.fromJson(script)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {
                //关闭模态框时执行，result是关闭时传递过来的参数
                var action = result.action;
                vm.views.tableInstance.ajax.reload(null, false);
                /*if (action != "cancel") {
                    //重置（默认或者设置为true）或者保持分页信息（设置为false）
                    vm.views.tableInstance.ajax.reload(null, false);
                }*/
            }).catch(function (err) {
                throw err;
            });
        }

        //删除脚本,数据库记录
        function deleteScript(id, filename) {
            if (id != null) {
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.delete') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.delete'), obj: $translate.instant('cac.common.script') }),
                    function () {
                        deleteScriptFile(id, filename);
                });
            }

        }

        //删除服务器上脚本文件
        function deleteScriptFile(id, filename) {
            cacScriptService.deleteScriptFile(filename).then(function (data) {
                doDeleteScript(id, function () {
                    vm.views.tableInstance.ajax.reload(null, false);
                    messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.delete') }));
                });

            }).catch(function (err) {
                throw err;
            });
        }

        function doDeleteScript(id, callBack) {
            cacScriptService.deleteScript(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        //查看脚本
        function findScript(script) {
            var script = decodeURI(script);//url解码
            // console.log("查看：" + script);
            $uibModal.open({
                templateUrl: 'app/modules/cac/script/script-find.html',
                controller: 'CacScriptFindCtrl',
                controllerAs: 'cacScriptFindVm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    entity: function () {
                        return {
                            script: angular.fromJson(script)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {

            }).catch(function (err) {
                throw err;
            });
        }

        var tableOption = {
            id: 'cacScriptTable',
            order: [[2, 'desc'],[1, 'desc']],
            aoColumns: [
                {mData: 'scriptName', title: $translate.instant('cac.script.name')},
                {mData: 'createdAt', title: $translate.instant('common.entity.detail.create_at'), visible: false, order:'desc'},
                {mData: 'updatedAt', title: $translate.instant('common.entity.detail.update_at'), visible: false, order:'desc'},
                {mData: 'scriptParams', title: $translate.instant('cac.script.detail.param')},
                {mData: 'scriptSize', title: $translate.instant('cac.script.detail.size')},
                {mData: 'createdBy', title: $translate.instant('cac.script.detail.create_by')},
                {
                    mData: 'id',
                    title: $translate.instant('cac.script.detail.view'),
                    render: function (data, type, row, meta) {
                        var scriptName = "'" + row.scriptName + "'";
                        if (row.scriptType == cacService.playbookScripType) {
                            return "";
                        } else {
                            var actionHtml =
                                '<button class="btn btn-success btn-sm" ng-click="cacScriptListCtrlVm.views.editScriptContent(' + scriptName + ')">{{\'cac.script.detail.view\' | translate}}</button>';
                            return actionHtml;
                        }

                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }

                },
                /*{mData: 'description', title: '描述'},*/
                {
                    mData: 'id',
                    title: $translate.instant('common.entity.detail.operation'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        var filename = "'" + row.scriptName + "'";
                        var script = encodeURI(angular.toJson(row));
                        var actionHtml =
                            '<div class="btn-group">' +
                            '<button type="button" class="btn btn-default btn-sm"  title="{{\'common.entity.action.edit\' | translate}}" uaa-has-permission="cac:*:*" ng-click="cacScriptListCtrlVm.views.editScript(\'' + script + '\')">' +
                            '<span class="fa fa-pencil"></span>' +
                            '</button>' +
                            '<button type="button" class="btn btn-default btn-sm" title="{{\'common.entity.action.delete\' | translate}}" uaa-has-permission="cac:*:*" ng-click="cacScriptListCtrlVm.views.deleteScript(' + id + ',' + filename + ')">' +
                            '<span class="fa fa-times"></span>' +
                            '</button>' +
                            '</div>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        function init() {
            dataTable.initTable(".script-table", tableOption.aoColumns, undefined, {
                scrollX: true,
                order: [[2, 'desc'], [1, 'desc']],
                ajax: {
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/scripts',
                    dataSrc: ""
                }
            }).then(function (apiInstance) {
                vm.views.tableInstance = apiInstance;
            }).catch(function (err) {
                throw err;
            });
        }

        init();

    }


    //添加脚本Controller
    cacModule.controller('CacScriptUploadCtrl', CacScriptUploadCtrl);
    CacScriptUploadCtrl.$inject = ['$scope', '$uibModalInstance', 'cacService', '$http', 'cacScriptService', 'messageService', 'entity', '$translate'];

    function CacScriptUploadCtrl($scope, $uibModalInstance, cacService, $http, cacScriptService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            scriptList: [],
            cancel: cancel,
            save: save,
            reduceScript: reduceScript,
            addScript: addScript,
            changeAttach: changeAttach,
            files: [],
            saveAndNew: saveAndNew,
            isExit: false,
            isChinese: false,
            script: {}
        };

        function saveAndNew() {
            vm.views.save(true);
            vm.views.scriptList = [];
            initFileInput();
        }


        function save(continue_new) {
            console.log(vm.views.scriptList);
            var form = new FormData();
            var file = angular.element(".file")[0].files[0];
            form.append("files", file);//files表示后台对应接收参数

            //传入出了file以外的实体，后台也用String来接，然后用jsonObject来转换
            /* var scriptList = JSON.stringify(vm.views.scriptList);
            form.append("script", scriptList);*/
            //传一个file以外的字符传到后台，newDir表示文件选择的git路径
            form.append("newDir", "");
            //var isSuccess = cacScriptService.uploadFile(form);
            cacScriptService.uploadFile(form).then(function (data) {
                if (data == 'true') {
                    if (vm.views.isExit) {
                        //如果存在该文件时，cac后台更新该记录
                        cacScriptService.updateScript(vm.views.script).then(function () {
                            messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.upload') }));
                            if (!continue_new) {
                                $uibModalInstance.close({action: "edit"});
                            } else {
                                angular.element(".file").val(null);
                                vm.views.script = {};
                                vm.views.isExit = false;

                            }
                        }).catch(function (err) {
                            throw err;
                        });
                    } else {
                        cacScriptService.addScript(vm.views.script).then(function () {
                            messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.upload') }));
                            if (!continue_new) {
                                $uibModalInstance.close({action: "edit"});
                            }
                        }).catch(function (err) {
                            throw err;
                        });
                    }
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.upload_script_fail'));
                }

            }).catch(function (data) {
                //0表示提示不会关掉。不写这个参数，提示框会立马消失掉！
                messageService.toast("error", data);
            });

        }

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function changeAttach($file) {
            if ($file != null) {
                //vm.views.files[$index] = $file;
                //vm.views.scriptList[$index].scriptName = $file.name;
                var fileName = $file.name;
                var isChinese = cacService.isChinese(fileName);
                if(isChinese){
                    vm.views.isChinese = true;
                    $scope.addScriptForm.$invalid = true;
                }else{
                    vm.views.isChinese = false;
                    $scope.addScriptForm.$invalid = false;
                }
                // vm.views.script.scriptSize = cacService.getFileSize($file.size);
                cacScriptService.checkScript($file.name).then(function (data) {
                    if (data) {
                        vm.views.script = data;
                        vm.views.isExit = true;
                    } else {
                        vm.views.isExit = false;
                    }
                    var splitArray = $file.name.split(".");
                    vm.views.script.scriptName = $file.name;
                    //获取后缀名
                    vm.views.script.scriptFormat = splitArray[splitArray.length - 1];
                    if (vm.views.script.scriptFormat == cacService.scriptZipType) {
                        vm.views.script.scriptType = cacService.playbookScripType;
                    } else {
                        vm.views.script.scriptType = cacService.otherScriptType;
                    }
                }).catch(function (err) {
                    throw err;
                });

            }
        }

        function reduceScript($index) {
            angular.element(".file" + $index).val(null);
            vm.views.scriptList.splice($index, 1);
        }

        function addScript() {
            initFileInput();
        }

        function initFileInput() {
            var scriptObj = {
                scriptParams: "",
                scriptName: "",
                scriptFormat: ""
            };
            vm.views.scriptList.push(scriptObj);
        }

        function init() {
            initFileInput();
        }

        init();


    }


    //编辑脚本Controller
    cacModule.controller('CacScriptEditCtrl', CacScriptEditCtrl);
    CacScriptEditCtrl.$inject = ['$uibModalInstance', '$timeout', '$http', 'cacScriptService', 'messageService', 'entity', '$translate'];

    function CacScriptEditCtrl($uibModalInstance, $timeout, $http, cacScriptService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            script: entity.script,
            scriptName: entity.scriptName,
            cancel: cancel,
            save: save,
            saveScriptContent: saveScriptContent,
            option: {}
        };

        init();

        function init() {
            if (vm.views.scriptName != undefined && vm.views.scriptName != "" && vm.views.scriptName != null) {
                getScriptContentByName(vm.views.scriptName);
            }
        }

        function getScriptContentByName(scriptName) {
            cacScriptService.getScriptContentByName(scriptName).then(function (data) {
                vm.views.scriptContent = data;
            }).catch(function (err) {
                throw err;
            });
        }

        $timeout(function () {
            vm.views.option = {
                mode: 'text/x-sh',
                lineNumbers: true,
                theme: 'opluscode',
                lineWrapping: true
            }
        });

        function saveScriptContent() {

        }

        function save() {
            cacScriptService.addScript(vm.views.script).then(function () {
                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
                $uibModalInstance.close({action: "edit"});
            }).catch(function (err) {
                throw err;
            });


        }

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

    }


    //查看脚本Controller
    cacModule.controller('CacScriptFindCtrl', CacScriptFindCtrl);
    CacScriptFindCtrl.$inject = ['$uibModalInstance', 'entity'];

    function CacScriptFindCtrl($uibModalInstance, entity) {
        var vm = this;

        vm.views = {
            script: entity.script,
            cancel: cancel
        };

        function cancel() {
            $uibModalInstance.close();
        }

    }


})
();

/**
 * @Auther: zml
 * @Date: 2018/6/1
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //多文件上传模型控制器
    cacModule.controller('CacScriptsUploadCtrl', CacScriptsUploadCtrl);
    CacScriptsUploadCtrl.$inject = ['$scope', '$timeout', 'cacService', 'cacScriptService', '$compile', '$uibModal', 'messageService'];

    function CacScriptsUploadCtrl($scope, $timeout, cacService, cacScriptService, $compile, $uibModal, messageService) {
        var vm = this;
        vm.views = {
            scriptsList: []
        }

    }


})
();

/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac.result', {
                url: '/result/:jobId',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/result/job-result-overview.html',
                        controller: 'JobResultOverviewCtrl',
                        controllerAs: 'jobResultOverviewCtrlVm'
                    }
                }

            })
            .state('app.cac.structural_diagram', {
                url: '/:jobId/structural_diagram',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/result/structural-diagram.html',
                        controller: 'structuralDiagramCtrl',
                        controllerAs: 'structuralDiagramCtrlVm'
                    }
                }
            })
            .state('app.cac.data_driven', {
                url: '/:jobId/data_driven',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/result/data-driven.html',
                        controller: 'dataDrivenCtrl',
                        controllerAs: 'dataDrivenCtrlVm'
                    }
                }

            })
            .state('app.cac.result.list', {
                url: '/:scriptType/list',
                views: {
                    'cacResult': {
                        templateUrl: 'app/modules/cac/result/result-list.html',
                        controller: 'CacResultListCtrl',
                        controllerAs: 'cacResultListCtrlVm'
                    }
                }

            })
            .state('app.cac.result.output', {
                url: '/:jobId/:taskId/:templateId/output',
                views: {
                    'cacResult': {
                        templateUrl: 'app/modules/cac/result/result-output-list.html',
                        controller: 'CacResultOutputListCtrl',
                        controllerAs: 'cacResultOutputListCtrlVm'
                    }
                }
            })
            .state('app.cac.result.view', {
                url: '/statistics/view',
                // params: {
                //     job_id: ''
                // },
                views: {
                    // 'profileView': {
                    //     template:
                    //         '<udp-page-view class="flex-fill scroll-y"' +
                    //         ' page-id="\'/cac/assets/udp/cac-results\'" page-source="file" page-params="{\'job_id\':\'ff8080817dbda18e017dbe271bf70018\'}" uaa-has-permission="cac:view:*" uaa-deny-message="{{\'common.uaa.no_permission\' | translate}}"></udp-page-view>' +
                    //         '</div>'
                    // }
                    'profileView': {
                        templateUrl: 'app/modules/cac/result/job-result-statistics-view.html',
                        controller: 'JobResultStatisticsOverviewCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
        ;
    }])
    ;
})();

/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    "use strict";

    angular.module("oplus.cac").factory("cacResultService", cacResultService);

    cacResultService.$inject = ["$uibModal", "cacDao"];

    function cacResultService($uibModal, cacDao) {

        function getResultsByJobId(jobId, start, length) {
            return cacDao.getResultsByJobId(jobId, start, length);
        }

        function getJob(jobId) {
            return cacDao.getJob(jobId);
        }

        function getMetricByJobIdAndHostKey(jobId, hostKey, ruleName, metricName, metricStatus, ruleExpression) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/result/job-result-to-rule.html',
                controller: 'JobResultToRuleCtrl',
                controllerAs: 'jobResultToRuleCtrlVm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    entity: function () {
                        return {
                            jobId: jobId,
                            hostKey: hostKey,
                            ruleName: ruleName,
                            metricName: metricName,
                            metricStatus: metricStatus,
                            ruleExpression: ruleExpression
                        };
                    }
                }
            });
        }

        function getMetricByJobIdAndHostKeyAndRule(jobId, hostKey, ruleName, ruleExpression) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/result/job-result-to-rule.html',
                controller: 'JobResultToRuleCtrl',
                controllerAs: 'jobResultToRuleCtrlVm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    entity: function () {
                        return {
                            jobId: jobId,
                            hostKey: hostKey,
                            ruleName: ruleName,
                            ruleExpression: ruleExpression
                        };
                    }
                }
            });
        }

        function getCheckItemById(checkItem) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/result/job-result-to-rule.html',
                controller: 'JobResultToRuleCtrl',
                controllerAs: 'jobResultToRuleCtrlVm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    entity: function () {
                        return checkItem;
                    }
                }
            });
        }

        function analyseMetric(result) {
            cacDao.analyseMetric(result);
        }

        function getOutputsByTaskId(taskId) {
            return cacDao.getOutputsByTaskId(taskId);
        }

        function getOutputsByTaskId_test(taskId) {
            return cacDao.getOutputsByTaskId_test(taskId);
        }

        function getMetrics(jobId) {
            return cacDao.getMetrics(jobId);
        }

        function queryOutput(outputId) {
            return cacDao.queryOutput(outputId);
        }

        function prepareDatatableOutPut(id) {
            return cacDao.prepareDatatableOutPut(id);
        }

        function getStructuralDiagram(id) {
            return cacDao.getStructuralDiagram(id);
        }

        function structuralDiagramHostItemInfo(data) {
            return cacDao.structuralDiagramHostItemInfo(data);
        }

        function structuralDiagramPrimaryInfo(data) {
            return cacDao.structuralDiagramPrimaryInfo(data);
        }

        var service = {
            getCheckItemById: getCheckItemById,
            getResultsByJobId: getResultsByJobId,
            getJob: getJob,
            getMetricByJobIdAndHostKey: getMetricByJobIdAndHostKey,
            getMetricByJobIdAndHostKeyAndRule: getMetricByJobIdAndHostKeyAndRule,
            analyseMetric: analyseMetric,
            queryOutput: queryOutput,
            getOutputsByTaskId: getOutputsByTaskId,
            getOutputsByTaskId_test: getOutputsByTaskId_test,
            getMetrics: getMetrics,
            prepareDatatableOutPut: prepareDatatableOutPut,
            getStructuralDiagram: getStructuralDiagram,
            structuralDiagramPrimaryInfo: structuralDiagramPrimaryInfo,
            structuralDiagramHostItemInfo: structuralDiagramHostItemInfo
        };
        return service;
    }


})();

/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //主控制器
    cacModule.controller('JobResultOverviewCtrl', ResultCtrl);
    ResultCtrl.$inject = ['cacResultService', '$http', 'currentUser', '$scope', 'cacService', '$timeout', '$state', '$stateParams', '$uibModal', '$translate', 'messageService'];

    function ResultCtrl(cacResultService, $http, currentUser, $scope, cacService, $timeout, $state, $stateParams, $uibModal, $translate, messageService) {
        var vm = this;
        var jobId = $stateParams.jobId;

        vm.params = {
            "job_id": $stateParams.jobId
        }
        vm.jobStatus = {
            "OK": {title: $translate.instant('cac.result.status.ok'), style: 'success'},
            "RUNNING": {title: $translate.instant('cac.result.status.running'), style: 'primary'},
            "ERROR": {title: $translate.instant('cac.result.status.error'), style: 'danger'}
        };

        vm.views = {
            job: {},
            auditParams: [],
            results: {},
            hosts: [],
            allhosts: [],
            rules: [],
            resultList: [],
            data_table: [],
            data_row: [],
            start: 0,//分页加载网格
            length: 5000,//每次加载十个主机
            // analyseMetric: analyseMetric,
            loadMore: loadMore,
            playbookScripType: cacService.playbookScripType,
            getMetricByJobIdAndHostKey: getMetricByJobIdAndHostKey,
            getMetricByJobIdAndHostKeyAndRule: getMetricByJobIdAndHostKeyAndRule,
            exportExcel: exportExcel,
            showHostKey: false,
            showRuleName: false,
            showLog: showLog,
            clickResult: clickResult,
            resultView: "outline",
            profileView: 'normal',
            isLoading: false,
            changeResultView: changeResultView,
            /* changeProfileView: changeProfileView*/
        };

        //巡检项-白名单
        vm.checkWhiteList = function () {
            var instance = $uibModal.open({
                parent: 'consultant',
                templateUrl: 'app/modules/cac/result/check-white-list.html',
                controller: ['$scope', '$uibModalInstance', 'messageService', function ($scope, $uibModalInstance, messageService) {
                    var that = this;
                    that.cancel = cancel;
                    that.deleteCheckWhiteList = deleteCheckWhiteList;

                    function cancel() {
                        $uibModalInstance.close({action: "cancel"});
                    }

                    var tableColumnConfig = [
                        {mData: 'templateName', title: $translate.instant('cac.white_list.template_name')},
                        {mData: 'hostKey', title: $translate.instant('cac.white_list.host_name')},
                        {mData: 'checkName', title: $translate.instant('cac.profile.check_item')},
                        {mData: 'scriptPath', title: $translate.instant('cac.white_list.patrol_script_path')},
                        {
                            mData: 'id', title: $translate.instant('cac.white_list.operate'),
                            className: 'text-center',
                            searchable: false,
                            orderable: false,
                            render: function (data, type, row, meta) {
                                var id = angular.toJson({id: row.id});
                                return '<div class="btn-group">' +
                                    ' <button type="button" class="btn btn-default btn-sm" ng-click=\'$ctrl.deleteCheckWhiteList(' + id + ')\' title="' + $translate.instant("cac.profile.remove_white_list") + '">' +
                                    '   <i class="fa fa-trash-alt"></i>' +
                                    ' </button>&nbsp;' +
                                    '</div>';
                            }
                        }
                    ];
                    $scope.tableConfig = {
                        data: [getPromise],
                        columns: tableColumnConfig,
                        order: [[1, 'desc']],
                        buttons: ['reload']
                    }

                    function getPromise() {
                        return cacService.getCheckWhiteList(vm.views.job.templateId);
                    }


                    function deleteCheckWhiteList(id) {
                        messageService.confirm($translate.instant('common.entity.delete.title'), $translate.instant("cac.profile.remove_white_list"), function () {
                            cacService.deleteCheckWhiteList(id).then(function (data) {
                                $uibModalInstance.close({action: "cancel"});
                                $timeout(function () {
                                    vm.checkWhiteList();
                                }, 100);
                                messageService.toast("success", $translate.instant('common.messages.operation.success'));
                            }).catch(function (err) {
                                messageService.alertWarning("warning", $translate.instant('common.messages.operation.failed'));
                                //console.log("err=== {}", err);
                            });
                        });
                    }

                }],
                controllerAs: '$ctrl',
                size: 'md',
                backdrop: true
            });
        }

        function clickResult(id, rule) {
            var scriptPath = "";
            vm.views.auditParams.forEach(function (mode, index) {
                mode.scripts.forEach(function (mode2, index2) {
                    scriptPath = mode2.scriptPath;
                    return;
                })
            });
            $timeout(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/cac/result/job-result-to-rule.html',
                    controller: 'JobResultToRuleCtrl',
                    controllerAs: 'jobResultToRuleCtrlVm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: id,
                                name: rule.checkItem,
                                //白名单-所需参数
                                templateId: vm.views.job.templateId,
                                templateName: vm.views.job.templateName,
                                scriptPath: scriptPath
                            };
                        }
                    }
                });
            }, 200);
            // console.log(id);
            // console.log(rule);
            // cacResultService.getCheckItemById(id);
        }

        function changeResultView() {
            if (vm.views.resultView === "list") {
                $state.go("app.cac.result", {jobId: vm.views.job.id});
                vm.views.resultView = "outline";
            } else {
                $state.go("app.cac.result.output", {
                    jobId: vm.views.job.id,
                    taskId: vm.views.job.taskId,
                    templateId: vm.views.job.templateId
                });
                vm.views.resultView = "list";
            }
        }

        /*  function changeProfileView() {
              if (vm.views.profileView === "profile") {
                  $state.go("app.cac.result", {jobId: vm.views.job.id});
                  vm.views.profileView = "normal";
              } else {
                  $state.go("app.cac.result.view", {jobId: vm.views.job.id});
                  vm.views.profileView = "profile";
              }
          }*/

        //用来测试分析的
        function analyseMetric() {
            var result = {};
            result.josResult = vm.views.job.jobResult;
            result.jobStatus = vm.views.job.jobStatus;
            result.taskId = vm.views.job.taskId;
            cacResultService.getOutputsByTaskId_test(vm.views.job.taskId).then(function (data) {
                result.outputs = data;
            }).catch(function (err) {
                console.log("err=== {}", err);
            });

            result.metrics = cacResultService.getMetrics(vm.views.job.id).then(function (data) {
                result.metrics = data;
            }).catch(function (err) {
                console.log("err=== {}", err);
            });

            $timeout(function () {
                cacResultService.analyseMetric(angular.fromJson(result));
            }, 3000);
        }

        //打开执行日志
        function showLog() {
            $uibModal.open({
                templateUrl: 'app/modules/cac/job/job-run-log.html',
                controller: 'CacJobRunLogCtrl',
                controllerAs: 'cacJobRunLogVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: jobId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

        //将结果导出Excel
        function exportExcel(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL（防止跳转页面）

            var instance = $uibModal.open({
                template: '<div class="modal-header">'+
                    '<button type="button" class="btn-close" data-dismiss="modal" title="'+$translate.instant('common.file.close_prompt')+'" ng-click="$ctrl.cancel()" style="margin-left: 95%;"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="op-blank-slate">' +
                    '<div class="op-blank-slate-icon">' +
                    '<i class="fa fa-4x fa-pulse fa-spinner fa-fw"></i>' +
                    '</div>' +
                    '<p class="op-flashing-text">'+$translate.instant('common.file.file_downloading')+'</p>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope','$uibModalInstance',downloadExcel],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: 'static'
            });

            function downloadExcel($scope,$uibModalInstance){
                var _downloadExcel = this;

                _downloadExcel.$onInit = initDownloadExcel;
                _downloadExcel.cancel = cancel;
                function cancel() {
                    $uibModalInstance.close({action: "cancel"});
                }

                function initDownloadExcel(){
                    var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/results/export/' + jobId;//请求的URl
                    var xhr = new XMLHttpRequest();//定义http请求对象
                    xhr.open("GET", url, true);
                    var token = currentUser.authToken;
                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.setRequestHeader("Language", $translate.use());
                    xhr.send();
                    xhr.responseType = "blob";  // 返回类型blob
                    xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                        if (this.status === 200) {
                            var blob = this.response;
                            var reader = new FileReader();
                            reader.readAsDataURL(blob);
                            $timeout(function () {
                                var d = new Date();
                                var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                                var a = document.createElement('a');
                                a.download = vm.views.job.templateName + datetime + ".xlsx";
                                a.href = reader.result;
                                $("body").append(a);
                                a.click();
                                $uibModalInstance.close(true);
                            }, 100);
                        } else {
                            $uibModalInstance.close(true);
                            messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                        }
                    }
                }

            }
        }

        function getMetricByJobIdAndHostKey(jobId, hostKey, ruleName, metricName, metricStatus) {
            cacResultService.getMetricByJobIdAndHostKey(jobId, hostKey, ruleName, metricName, metricStatus);
        }

        function getMetricByJobIdAndHostKeyAndRule(jobId, hostKey, ruleName, ruleExpression) {
            cacResultService.getMetricByJobIdAndHostKeyAndRule(jobId, hostKey, ruleName, ruleExpression);
        }

        function getJob(jobId) {
            cacResultService.getJob(jobId).then(function (data) {
                vm.views.job = data;
                vm.views.auditParams = angular.fromJson(vm.views.job.auditParams);
                if (vm.views.job.jobStatus != 'ERROR') {
                    getResultsByJobId(jobId);
                }
            }).catch(function (err) {
                throw err;
            });
        }

        function mockResult(hostSum, ruleSum) {
            var hosts = [];
            for (var i = 1; i <= hostSum; i++) {
                hosts.push({
                    unreachable: "REACHABLE",
                    hostKey: "host-" + i
                });
            }

            var rules = [];
            for (var j = 1; j <= ruleSum; j++) {
                rules.push({
                    ruleName: "rule-" + j,
                    applicability: "",
                    ruleExpression: "ruleExpression-" + j
                });
            }

            var results = [];
            _.forEach(hosts, function (host) {
                _.forEach(rules, function (rule) {
                    results.push(
                        {
                            hostKey: host.hostKey,
                            ruleName: rule.ruleName,
                            auditResult: $translate.instant('cac.result.audit_result.rule_not_square')
                        }
                    );
                });
            });

            return {
                hosts: hosts,
                rules: rules,
                results: results
            };
        }

        function getResultsByJobId(jobId) {
            vm.views.isLoading = true;
            // if (jobId == 'ff808081717c84890171853c38b11e2c' || window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     //if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     // $http({
            //     //     url: "app/modules/cac/api/result.json",
            //     //     method: 'GET'
            //     // }).then(function (data) {
            //     //     vm.views.results = data.data;
            //     //     vm.views.hosts = vm.views.results.hosts;
            //     //     vm.views.rules = vm.views.results.rules;
            //     //     vm.views.resultList = vm.views.results.results;
            //     //     $timeout(function () {
            //     //         showTable();
            //     //     });
            //     // });
            //
            //     vm.views.results = mockResult(5000, 100);
            //     vm.views.hosts = vm.views.results.hosts;
            //     vm.views.rules = vm.views.results.rules;
            //     vm.views.resultList = vm.views.results.results;
            //     $timeout(function () {
            //         showTable();
            //     });
            // } else {
            cacResultService.getResultsByJobId(jobId, vm.views.start, vm.views.length).then(function (data) {
                vm.views.results = data;
                vm.views.results.hosts = _.sortBy(vm.views.results.hosts, ['hostKey']);
                /*if (vm.views.job.scriptType == vm.views.playbookScripType) {
                    vm.views.hostResults = data.hostKey;
                    vm.views.checkItems = data.checkItem;
                    vm.views.hosts = data.hosts;
                    $timeout(function () {
                        showPlaybookTable();
                    });
                } else {
                    vm.views.hosts = vm.views.results.hosts;
                    vm.views.rules = vm.views.results.rules;
                    vm.views.resultList = vm.views.results.results;
                    $timeout(function () {
                        showTable();
                    });
                }*/
                vm.views.hosts = vm.views.results.hosts;
                vm.views.rules = vm.views.results.rules;
                // console.log(angular.toJson(vm.views.rules));
                vm.views.resultList = vm.views.results.results;
                $timeout(function () {
                    vm.views.isLoading = false;
                    showTable();
                });


            }).catch(function (err) {
                throw err;
            });
        }

        // }

        function init() {
            if (jobId != null) {
                getJob(jobId);
            }
        }

        init();

        /**
         * 1、先循环模板中的主机列表
         * 2、循环主机检查结果，根据主机获取该主机的全部检查项
         * 3、循环全部的检查项，如果该检查项在第二步中的存在，则判断检查成功与否。否则未检查
         *
         */
        function showPlaybookTable() {
            for (var i = 0; i < vm.views.hostResults.length; i++) {
                var hostCheckItems = vm.views.hostResults[i].checkItem;
                var hostKey = vm.views.hostResults[i].hostKey;
                var tr_obj = {};
                tr_obj.hostKey = hostKey;
                tr_obj.hostStatus = vm.views.hostResults[i].unreachable;
                var td_arrs = [];
                for (var j = 0; j < vm.views.checkItems.length; j++) {
                    //组装表格中每个td的数据
                    var td_obj = {};
                    td_obj.checkItem = vm.views.checkItems[j].checkItem;
                    //cac_result结果表中的状态由'true','false','人工判断'和'规则未检查'四种状态
                    var flag = null;
                    for (var k = 0; k < hostCheckItems.length; k++) {
                        if (vm.views.checkItems[j].checkItem == hostCheckItems[k].checkItem) {
                            if (hostCheckItems[k].auditResult == 'OK') {
                                flag = 'true';
                                break;
                            } else if (hostCheckItems[k].auditResult == 'FAILED') {
                                flag = 'false';
                                break;
                            } else if (hostCheckItems[k].auditResult == $translate.instant('cac.result.audit_result.check')) {
                                flag = $translate.instant('cac.result.audit_result.check');
                                break;
                            } else if (hostCheckItems[k].auditResult == $translate.instant('cac.result.audit_result.skipping')) {
                                flag = $translate.instant('cac.result.audit_result.skipping');
                                break;
                            }
                        }
                    }
                    td_obj.flag = flag;
                    td_arrs.push(td_obj);
                }
                tr_obj.checkItems = td_arrs;
                vm.views.data_table.push(tr_obj);
            }
        }

        function showTable() {
            var startTime = (new Date()).getTime();

            console.log("Start show table startTime = " + startTime);

            var hostRuleResultMap = {};
            var tableRecords = [];

            if (vm.views.resultList.length == 0) {
                vm.views.data_table = tableRecords;
            } else {
                for (var listIndex = 0; listIndex < vm.views.resultList.length; listIndex++) {
                    var result = vm.views.resultList[listIndex];
                    //cac_result结果表中的状态由'true','false','人工判断'和'规则未检查'四种状态
                    if (result.auditResult == 'OK') {
                        result.flag = 'true';
                    } else if (result.auditResult == 'FAILED') {
                        result.flag = 'false';
                    } else if (result.auditResult == 'CHECK') {
                        result.flag = $translate.instant('cac.result.audit_result.check');
                    } else if (result.auditResult == 'SKIPPING') {
                        result.flag = $translate.instant('cac.result.audit_result.skipping');
                    }
                    var key = result.hostKey + "-" + result.checkItem;
                    hostRuleResultMap[key] = result;

                }
                console.log("Hosts size = " + vm.views.hosts.length);
                console.log("Rule size = " + vm.views.rules.length);
                for (var hIndex = 0; hIndex < vm.views.hosts.length; hIndex++) {

                    var host = vm.views.hosts[hIndex];
                    var record = {
                        hostKey: host.hostKey,
                        hostStatus: host.unreachable,
                        isUnreachable: (host.unreachable === 'UNREACHABLE' || host.unreachable === 'unreachable') && host.unreachable !== "SKIPPING",
                        isSkipping: host.unreachable === "SKIPPING",
                        rules: []
                    };
                    tableRecords.push(record);

                    var data_row = record.rules;

                    for (var rIndex = 0; rIndex < vm.views.rules.length; rIndex++) {
                        // console.log("Size 2 = " + vm.views.rules.length);

                        var rule = vm.views.rules[rIndex];
                        //不能rule_obj = vm.views.rules[rIndex]这样直接赋值。
                        var rule_obj = {
                            hostKey: record.hostKey,
                            hostStatus: record.hostStatus
                        };

                        rule_obj.checkItem = rule.checkItem;
                        var key = host.hostKey + "-" + rule.checkItem;
                        var result = hostRuleResultMap[key];
                        if (result) {
                            rule_obj.id = result.id;
                            rule_obj.flag = result.flag;
                        } else {
                            rule_obj.id = "";
                            rule_obj.flag = "-";

                        }
                        var flag = rule_obj.flag;

                        var skipping = $translate.instant('cac.result.audit_result.skipping');
                        rule_obj.class = flag == 'true' ? 'bg-success' : (flag == 'false' ? 'bg-danger' : (flag == $translate.instant('cac.result.audit_result.check') ? 'bg-warning' : (flag == $translate.instant('cac.common.inapplicable') ? 'cac-bg-grey' : (flag == skipping ? 'bg-info' : 'bg-light'))));
                        rule_obj.iconClass = flag == 'true' ? 'fa-check' : (flag == 'false' ? 'fa-times' : (flag == $translate.instant('cac.result.audit_result.check') ? 'fa-user-md' : (flag == $translate.instant('cac.common.inapplicable') ? 'fa-minus' : (flag == skipping ? 'fa-adjust' : 'fa-question'))));
                        // rule_obj.title = vm.views.job.scriptType + "!=" + vm.views.playbookScripType + "?" + rule_obj.ruleExpression + ":" + rule_obj.checkItem;
                        rule_obj.title = rule_obj.checkItem;
                        data_row.push(rule_obj);
                    }
                }

                var finishTime = (new Date()).getTime();
                console.log("Finish show table, finishTime = " + finishTime + " time cost = " + (finishTime - startTime) / 1000);
                vm.views.data_table = tableRecords;
                //  console.log(JSON.stringify(vm.views.data_table));
            }

        }

        function loadMore() {
            if (vm.views.hosts.length >= vm.views.length) {
                vm.views.start += vm.views.length;
                cacResultService.getResultsByJobId(jobId, vm.views.start, vm.views.length).then(function (data) {
                    vm.views.results = data;
                    vm.views.hosts = vm.views.results.hosts;
                    if (vm.views.hosts.length > 0) {
                        if (vm.views.job.scriptType == vm.views.playbookScripType) {
                            /*vm.views.hostResults = data.hostKey;
                            vm.views.checkItems = data.checkItem;
                            $timeout(function () {
                                showPlaybookTable();
                            });*/
                        } else {
                            vm.views.rules = vm.views.results.rules;
                            vm.views.resultList = vm.views.results.results;
                            $timeout(function () {
                                showTable();
                            });
                        }
                    }

                }).catch(function (err) {
                    throw err;
                });
            }

        }
    }


    //滚动指令
    cacModule.directive('whenScrolled', function () {
        return function (scope, elm, attr) {
            // 内层DIV的滚动加载
            var raw = elm[0];
            elm.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 5) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    });


})();

/**
 * @Auther: mr.kongqi@gmail.com
 * @Date: 2021/12/15
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //主控制器
    cacModule.controller('JobResultStatisticsOverviewCtrl', JobResultStatisticsOverviewCtrl);
    JobResultStatisticsOverviewCtrl.$inject = ['cacResultService', '$http', '$scope', 'cacService', '$timeout', '$state', '$stateParams', '$uibModal', '$translate'];

    function JobResultStatisticsOverviewCtrl(cacResultService, $http, $scope, cacService, $timeout, $state, $stateParams, $uibModal, $translate) {
        var vm = this;
        vm.params = {
            "job_id": $stateParams.jobId
        }
    }

})();

/**
 * @Auther: zml
 * @Date: 2018/5/17
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacResultListCtrl', CacResultListCtrl);
    CacResultListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$compile', '$uibModal', '$stateParams', '$filter', 'cacResultService', 'currentUser', '$translate'];

    function CacResultListCtrl($scope, $timeout, cacService, $compile, $uibModal, $stateParams, $filter, cacResultService, currentUser, $translate) {
        var vm = this;
        var jobId = $stateParams.jobId;
        var scriptType = $stateParams.scriptType;

        vm.views = {
            findMetric: findMetric,
            tableInstance: null,
            executeRule: executeRule,
            playbookScripType: cacService.playbookScripType,
            isPlaybookType: scriptType == cacService.playbookScripType ? true : false,
            ruleExpressionList: []
        };

        var tableOption = {
            id: 'cacResultTable',
            order: [[2, 'desc']],
            serverSide: true,
            stateSave: false,
            aoColumns: [
                {mData: 'hostKey', title: $translate.instant('cac.common.host'), width: '15%'},
                {
                    mData: 'ruleName', title: $translate.instant('cac.template.detail.audit_params'), width: '25%', className: 'cac-text-overflow',
                    render: function (data, type, row, meta) {
                        var actionHtml = '<span class="cac-td-hover" title=\'' + row.ruleName + '\' >' + row.ruleName + '</span>';
                        return actionHtml;
                    }
                },
                {
                    mData: 'ruleExpression',
                    title: $translate.instant('cac.common.rule'),
                    width: '40%',
                    className: 'cac-text-overflow',
                    render: function (data, type, row, meta) {
                        var rule = encodeURI(angular.toJson(row));
                        /*ng-click="cacResultListCtrlVm.views.executeRule($event)"*/
                        var actionHtml = '<span class="cac-td-hover" title=\"' + row.ruleExpression + '\"  rule="' + rule + '" >' + row.ruleExpression + '</span>';
                        return actionHtml;
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                },
                {
                    mData: 'auditResult', title: $translate.instant('cac.common.result'), width: '10%',
                    render: function (data, type, row, meta) {
                        if (row.auditResult == 'true') {
                            var actionHtml = '<span class="badge bg-success">{{\'cac.result.audit_result.pass\' | translate}}</span>';
                        } else if (row.auditResult == 'false') {
                            var actionHtml = '<span class="badge bg-danger">{{\'cac.result.audit_result.failed\' | translate}}</span>';
                        } else if (row.auditResult == $translate.instant('cac.result.audit_result.check')) {
                            var actionHtml = '<span class="badge bg-warning">{{\'cac.result.audit_result.check\' | translate}}</span>';
                        } else if (row.auditResult ==  $translate.instant('cac.result.audit_result.skipping')) {
                            var actionHtml = '<span class="badge bg-secondary">{{\'cac.result.audit_result.skipping\' | translate}}</span>';
                        } else {
                            var actionHtml = '<span class="label cac-bg-light-grey">{{\'common.messages.no_data\' | translate}}</span>';
                        }

                        return actionHtml;
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                },
                /*{
                    mData: 'endedAt', title: '结束时间',
                    render: function (data, type, row, meta) {
                        var endedAt = $filter('date')(row.endedAt, 'yyyy-MM-dd HH:mm:ss');
                        return endedAt;
                    }
                },*/
                {
                    mData: 'id',
                    title: $translate.instant('common.entity.detail.operation'),
                    className: 'text-center',
                    width: '10%',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var hostKey = "'" + row.hostKey + "'";
                        var ruleName = "'" + row.ruleName + "'";
                        var auditResult = "'" + row.auditResult + "'";
                        vm.views.ruleExpressionList.push(row.ruleExpression);
                        var indexOfRuleExpression = vm.views.ruleExpressionList.indexOf(row.ruleExpression);
                        //var result = encodeURI(angular.toJson(row));
                        var actionHtml = '<div class="btn-group">' +
                            '<button type="button" class="btn btn-default btn-sm" ng-click="cacResultListCtrlVm.views.findMetric(' + hostKey + ',' + ruleName + ',' + auditResult + ',' + indexOfRuleExpression + ')">' +
                            '{{\'cac.result.detail.view_metric\' | translate}}</button>' +
                            '</div>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        function init() {
            //console.log(vm.views.isPlaybookType);
            if (vm.views.isPlaybookType) {
                var columnDefs = [
                    {mData: 'hostKey', title: $translate.instant('cac.common.host')},
                    {
                        mData: 'checkItem', title: $translate.instant('cac.result.detail.check_item')
                    },
                    {
                        mData: 'auditResult', title: $translate.instant('cac.common.result'),
                        render: function (data, type, row, meta) {
                            if (row.auditResult == 'true') {
                                var actionHtml = '<span class="badge bg-success">{{\'cac.result.audit_result.pass\' | translate}}</span>';
                            } else if (row.auditResult == 'false') {
                                var actionHtml = '<span class="badge bg-danger">{{\'cac.result.audit_result.failed\' | translate}}</span>';
                            } else if (row.auditResult == $translate.instant('cac.result.audit_result.check')) {
                                var actionHtml = '<span class="badge bg-warning">{{\'cac.result.audit_result.check\' | translate}}</span>';
                            } else if (row.auditResult == $translate.instant('cac.result.audit_result.skipping')) {
                                var actionHtml = '<span class="badge bg-secondary">{{\'cac.result.audit_result.skipping\' | translate}}</span>';
                            } else {
                                var actionHtml = '<span class="label cac-bg-light-grey">{{\'common.messages.no_data\' | translate}}</span>';
                            }

                            return actionHtml;
                        },
                        createdCell: function (nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {
                        mData: 'id',
                        title: $translate.instant('common.entity.detail.operation'),
                        className: 'text-center',
                        searchable: false,
                        orderable: false,
                        render: function (data, type, row, meta) {
                            // var hostKey = "'" + row.hostKey + "'";
                            // var checkItem = "'" + row.checkItem + "'";
                            // var auditResult = "'" + row.auditResult + "'";
                            var id = "'" + row.id + "'";
                            var actionHtml = '<div class="btn-group">' +
                                '<button type="button" class="btn btn-default btn-sm" ng-click="cacResultListCtrlVm.views.findMetric(' + id + ')">' +
                                '{{\'cac.result.detail.view_metric\' | translate}}</button>' +
                                '</div>';
                            return actionHtml;
                        },
                        createdCell: function (nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }
                ];
                tableOption = {
                    id: 'cacResultTable',
                    order: [[2, 'desc']],
                    serverSide: true,
                    stateSave: false,
                    aoColumns: columnDefs
                };
            }

            //window.$oplus.appConfig.modules.cac.useLocalDb
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/history-result.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
                /* tableOption.ajax = cacService.assembleDataTableUrl('/api/cac/audit/results/list/' + jobId);
                 $timeout(function () {
                     vm.views.tableInstance = cacService.prepareDatatable(".cac-result-table-list", tableOption);
                 }, 10);*/

                var token = currentUser.authToken;
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/results/list/' + jobId + '/' + scriptType;

                tableOption.ajax = {
                    url: url,
                    dataSrc: "data",
                    type: "get",
                    dataType: "json",
                    async: false,
                    headers: {
                        "Authorization": 'Bearer ' + token
                        // "X-JWT-Authorization": 'Bearer ' + token
                    }
                };
                $timeout(function () {
                    //初始化datatables，并保存实例
                    vm.views.tableInstance = cacService.prepareDatatable(".cac-result-table-list", tableOption);
                }, 100);


            }
        // }

        function findMetric(hostKey, checkItem, resultStatus, indexOfRuleExpression) {
            cacResultService.getCheckItemById({id:id});
            // var ruleExpression = vm.views.ruleExpressionList[indexOfRuleExpression];
            // if (vm.views.isPlaybookType) {
            //     cacResultService.getMetricByJobIdAndHostKey(jobId, hostKey, null, checkItem, resultStatus, ruleExpression);
            // } else {
            //     cacResultService.getMetricByJobIdAndHostKey(jobId, hostKey, checkItem, null, resultStatus,ruleExpression);
            // }
        }

        function executeRule(event) {
            var ruleJson = $(event.currentTarget).attr("rule");
            $uibModal.open({
                templateUrl: 'app/modules/cac/result/result-execute-rule.html',
                controller: 'CacResultExecuteRuleCtrl',
                controllerAs: 'cacResultExecuteVm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    entity: function () {
                        return {
                            rule: decodeURI(ruleJson)
                        };
                    }
                }
            });
        }

        init();

    }

})
();

/**
 * @Auther: zml
 * @Date: 2018/5/18
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('JobResultToRuleCtrl', JobResultToRuleCtrl);
    JobResultToRuleCtrl.$inject = ['$http', 'entity', '$timeout', 'cacService', '$uibModalInstance', 'dataTable', 'cacResultService', '$translate'];

    function JobResultToRuleCtrl($http, entity, $timeout, cacService, $uibModalInstance, dataTable, cacResultService, $translate) {
        var vm = this;
        vm.saveAndDelCheckWhiteList=saveAndDelCheckWhiteList;
        vm.checkWhiteListID="";
        vm.views = {
            id: entity.id,
            checkItemName: entity.name,
            tableInstance: null,
            cancel: cancel
        };
        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
            if (vm.views.id) {
                cacResultService.queryOutput(vm.views.id).then(function (data) {
                    if(entity.templateId && entity.templateName && entity.scriptPath){
                        vm.checkWhiteList=data;//用来查询是否匹配白名单
                        vm.param={
                            templateId : entity.templateId,
                            hostId : vm.checkWhiteList.hostId,
                            checkName: vm.checkWhiteList.name
                        }
                        cacService.findByCheckWhiteList(vm.param).then(function (whiteList) {
                            if("" == whiteList){
                                vm.checkWhiteListType="add";
                                vm.btnStyle ='btn-info';
                            }else{
                                vm.btnStyle ='btn-danger';
                                vm.checkWhiteListType="del";
                                vm.checkWhiteListID =whiteList.id;
                            }
                        }).catch(function (err) {
                            throw err;
                        });
                    }

                    vm.views.metricStatus = data.status;
                    vm.views.metricName = data.name;
                    vm.views.metricValue = data.output;
                    if (vm.views.metricStatus == 'OK') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.pass');
                        vm.views.metricStatusClass = "badge bg-success";
                    } else if (vm.views.metricStatus == 'CHECK') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.check');
                        vm.views.metricStatusClass = "badge bg-warning";
                    } else if (vm.views.metricStatus == 'SKIPPING') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.skipping');
                        vm.views.metricStatusClass = "badge bg-secondary";
                    } else if (vm.views.metricStatus == 'FAILED') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.failed');
                        vm.views.metricStatusClass = "badge bg-danger";
                    } else {
                        vm.views.metricStatus = $translate.instant('common.messages.no_data');
                        vm.views.metricStatusClass = "label cac-bg-light-grey";
                    }
                }).catch(function (err) {
                    throw err;
                });
            } else {
                vm.views.metricStatus = $translate.instant('common.messages.no_data');
                vm.views.metricStatusClass = "label cac-bg-light-grey";
                vm.views.metricName = vm.views.checkItemName;
            }

        }

        init();

        function saveAndDelCheckWhiteList(){
            if("add" == vm.checkWhiteListType){
                vm.btnStyle ='btn-danger';
                vm.checkWhiteListType="del";
                vm.add={
                    templateId : entity.templateId,
                    templateName : entity.templateName,
                    scriptPath: entity.scriptPath,
                    hostId : vm.checkWhiteList.hostId,
                    hostKey : vm.checkWhiteList.hostKey,
                    checkName: vm.checkWhiteList.name
                }
                cacService.saveCheckWhiteList(vm.add).then(function (whiteList) {
                    console.log("add success ",whiteList)
                }).catch(function (err) {
                    throw err;
                });
            }else{
                vm.btnStyle ='btn-info';
                vm.checkWhiteListType="add";
                cacService.deleteCheckWhiteList({id:vm.checkWhiteListID}).then(function (data) {
                    console.log("delete success ",data)
                }).catch(function (err) {
                    console.log("err=== {}",err);
                });
            }
        }
    }

})
();

/**
 * @Auther: zml
 * @Date: 2018/5/18
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacResultExecuteRuleCtrl', CacResultExecuteRuleCtrl);
    CacResultExecuteRuleCtrl.$inject = ['$state', 'entity', '$timeout', 'cacService', '$uibModalInstance', '$translate'];

    function CacResultExecuteRuleCtrl($state, entity, $timeout, cacService, $uibModalInstance, $translate) {
        var vm = this;
        var ruleTemp = entity.rule;
        vm.views = {
            ruleValue: entity.rule,
            tableInstance: null,
            cancel: cancel,
            reset: reset,
            execute: execute
        };

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function reset() {
            vm.views.ruleValue = ruleTemp;
        }

        function execute() {
            vm.views.ruleValue = $translate.instant('common.messages.operation.success', { operation: $translate.instant('cac.common.run') });
        }

    }


})
();

/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacResultOutputLogCtrl', CacResultOutputLogCtrl);
    CacResultOutputLogCtrl.$inject = ['cacService', 'cacResultService', 'entity', '$uibModal', '$uibModalInstance'];

    function CacResultOutputLogCtrl(cacService, cacResultService, entity, $uibModal, $uibModalInstance) {

        var vm = this;

        vm.views = {
            id: entity.id,
            cancel: cancel,
            output: {}
        };


        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
            cacResultService.queryOutput(vm.views.id).then(function (data) {
                vm.views.output = data;
                /*if (vm.views.output.jobResult == null || vm.views.job.jobResult == "") {
                    vm.views.isResult = true;
                }*/
            }).catch(function (err) {
                throw err;
            });

        }

        init();
    }
})
();

/**
 * @Auther: zml
 * @Date: 2018/7/19
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacResultOutputListCtrl', CacResultOutputListCtrl);
    CacResultOutputListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$compile', '$uibModal', '$stateParams', 'cacResultService', '$translate', 'cacTemplateService', '$state'];

    function CacResultOutputListCtrl($scope, $timeout, cacService, $compile, $uibModal, $stateParams, cacResultService, $translate, cacTemplateService, $state) {
        var vm = this;
        var taskId = $stateParams.taskId;
        var jobId = $stateParams.jobId;
        var templateId = $stateParams.templateId;
        vm.saveAndDelCheckWhiteList = saveAndDelCheckWhiteList;

        vm.views = {
            tableInstance: null,
            jobId: $stateParams.jobId,
            getCheckItemById: getCheckItemById
        };


        function saveAndDelCheckWhiteList(data) {
            if ("n" == data.type) {
                var scriptPath = "";
                cacTemplateService.getTemplateById(templateId).then(function (data) {
                    vm.templateData = data;
                    var auditParams = angular.fromJson(data.auditParams);
                    if (auditParams.length > 0) {
                        auditParams.forEach(function (mode, index) {
                            mode.scripts.forEach(function (mode2, index2) {
                                scriptPath = mode2.scriptPath;
                                return;
                            })
                        });
                    }
                }).catch(function (err) {
                    throw err;
                });

                $timeout(function () {
                    if ("" != scriptPath) {
                        var param = {
                            templateId: templateId,
                            templateName: vm.templateData.templateName,
                            scriptPath: scriptPath,
                            hostId: data.hostId,
                            hostKey: data.hostKey,
                            checkName: data.checkName,
                        }
                        cacService.saveCheckWhiteList(param).then(function (whiteList) {
                            console.log("add success ", whiteList)
                        }).catch(function (err) {
                            throw err;
                        });
                    }
                }, 200);


            }/*else{
                cacService.deleteCheckWhiteList({id:vm.checkWhiteListID}).then(function (data) {
                    console.log("delete success ",data)
                }).catch(function (err) {
                    console.log("err=== {}",err);
                });
            }*/

        }

        function getCheckItemById(id) {
            if (templateId != null) {
                var scriptPath = "";
                cacTemplateService.getTemplateById(templateId).then(function (data) {
                    vm.templateData = data;
                    var auditParams = angular.fromJson(data.auditParams);
                    if (auditParams.length > 0) {
                        auditParams.forEach(function (mode, index) {
                            mode.scripts.forEach(function (mode2, index2) {
                                scriptPath = mode2.scriptPath;
                                var param = {
                                    id: id,
                                    scriptPath: scriptPath,
                                    templateName: vm.templateData.templateName,
                                    templateId: vm.templateData.id
                                }
                                cacResultService.getCheckItemById(param);
                                return;
                            })
                        });
                    }
                }).catch(function (err) {
                    throw err;
                });
            }
        }

        function init() {
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/result-output.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
            /*tableOption.ajax = cacService.assembleDataTableUrl('/api/cac/v2/jobs/result/' + jobId);*/
            /* tableOption.ajax = cacService.assembleDataTableUrl('/api/cac/v2/jobs/result-v2/' + jobId+","+templateId);
             $timeout(function () {
                 vm.views.tableInstance = cacService.prepareDatatable(".cac-output-table-list", tableOption);
             }, 10);*/

            var tableColumns = [
                {mData: 'hostKey', title: $translate.instant('cac.common.host')},
                {
                    mData: 'name',
                    title: $translate.instant('cac.template.detail.audit_params'),
                    render: function (data, type, row, meta) {
                        var checkItem = '';
                        if (row.name != null) {
                            checkItem = row.name;
                        }
                        var actionHtml = '<span title = "' + checkItem + '">' + checkItem + '</span>';
                        return actionHtml;
                    }

                },
                {
                    mData: 'status', title: $translate.instant('cac.common.result'),
                    render: function (data, type, row, meta) {
                        if (row.status == 'OK') {
                            var actionHtml = '<span class="badge bg-success">{{\'cac.result.audit_result.pass\' | translate}}</span>';
                        } else if (row.status == 'FAILED') {
                            var actionHtml = '<span class="badge bg-danger">{{\'cac.result.audit_result.failed\' | translate}}</span>';
                        } else if (row.status == 'CHECK') {
                            var actionHtml = '<span class="badge bg-warning">{{\'cac.result.audit_result.check\' | translate}}</span>';
                        } else if (row.status == 'SKIPPING') {
                            var actionHtml = '<span class="badge bg-info">{{\'cac.result.audit_result.skipping\' | translate}}</span>';
                        } else {
                            var actionHtml = '<span class="label cac-bg-light-grey">{{\'common.messages.no_data\' | translate}}</span>';
                        }
                        return actionHtml;
                    }
                },
                /*{
                    mData: 'whetherWhiteList',
                    title: $translate.instant('cac.profile.white_list'),
                    render: function (data, type, row, meta) {
                        var arr =row.whetherWhiteList.split(",");
                        var white_list_html;
                        if (arr[0] == 'y') {
                            white_list_html = '<span class="badge bg-info">{{\'task_scheduling.yes\' | translate}}</span>';
                        } else {
                            white_list_html = '<span class="badge bg-light">{{\'task_scheduling.no\' | translate}}</span>';
                        }
                        return white_list_html;
                    }
                },*/
                /*{
                    mData: 'whetherWhiteList',
                    title: $translate.instant('cac.profile.white_list'),
                    render: function (data, type, row, meta) {
                        /!*var arr =row.whetherWhiteList.split(",");*!/
                        var add = angular.toJson({type: 'n',hostId : row.hostId,hostKey : row.hostKey,checkName: row.name});
                        var del = angular.toJson({type: 'y',id : arr[1]});
                        var id = "'" + row.id + "'";
                        var white_list_html;
                        if (arr[0] == 'y') {
                            white_list_html = '<span ng-click=\'cacResultOutputListCtrlVm.saveAndDelCheckWhiteList(' + del + ')\' class="badge bg-info">{{\'task_scheduling.yes\' | translate}}</span>';
                        } else {
                            white_list_html = '<span ng-click=\'cacResultOutputListCtrlVm.saveAndDelCheckWhiteList(' + add + ')\' class="badge bg-light">{{\'task_scheduling.no\' | translate}}</span>';
                        }
                        return white_list_html;
                    }
                },*/
                {
                    mData: 'output',
                    title: $translate.instant('cac.result.output'),
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        var actionHtml = "";
                        if (row.output == null || row.output == "") {
                            actionHtml = '<span ng-click="cacResultOutputListCtrlVm.views.getCheckItemById(' + id + ')">{{\'common.term.none\' | translate}}</span>';
                        } else {
                            actionHtml = '<span ng-click="cacResultOutputListCtrlVm.views.getCheckItemById(' + id + ')">' +
                                (row.output || '').substr(0, 100) +
                                '</span>';
                        }

                        return actionHtml;
                    }
                }

            ];


            vm.tableConfig = {
                data: [getPromise],
                columns: tableColumns,
                order: [[1, 'desc']],
                buttons: ['reload']
            }

            function getPromise() {
                return cacResultService.prepareDatatableOutPut(jobId + "," + templateId);
            }

        }

        // }

        init();

    }

})
();

/**
 * @author luohuanjiang@famessoft.com, created on 2024/06/26
 */
(function () {
    'use strict';

    angular.module('oplus.cac').controller('structuralDiagramCtrl', structuralDiagramCtrl);

    structuralDiagramCtrl.$inject = ['$scope', 'cacResultService', '$stateParams', '$uibModal', '$q', '$translate', 'currentUser', '$timeout'];

    function structuralDiagramCtrl($scope, cacResultService, $stateParams, $uibModal, $q, $translate, currentUser, $timeout) {
        var vm = this;
        vm.$onInit = onInit;
        var jobId = $stateParams.jobId;
        var biaoji = "";

        vm.views = {
            job: {},
            exportExcel: exportExcel,
            downloadBtn: downloadBtn
        }
        vm.params = {
            "job_id": $stateParams.jobId
        }

        function onInit() {
            if (jobId != null) {
                getJob(jobId);
                cacResultService.getStructuralDiagram(jobId).then(function (_data) {
                    let oneCounts = 0;
                    let towCounts = 0;
                    let rootCounts = 0;//根目录下有多少一级目录
                    let pd = true;

                    var dom = document.getElementById("eechart5");
                    var myChart = echarts5.init(dom);

                    myChart.on('dblclick', function (params) {
                        if ("sub" === params.data.type) {
                            var instance = $uibModal.open({
                                templateUrl: 'app/modules/cac/result/structural-one-desc.html',
                                controller: ['$scope', '$uibModalInstance', '$q', function ($scope, $uibModalInstance, $q) {
                                    var that = this;
                                    that.cancel = cancel;
                                    that.counts = [];
                                    that.maps = {
                                        jobId: jobId,
                                        primaryService: params.data.name
                                    };

                                    var tableColumns = [
                                        {
                                            data: 'name',
                                            title: $translate.instant("cac.structural.secondary_service_name")
                                        },
                                        {data: 'contItem', title: $translate.instant("cac.structural.item_err_count")},
                                        {data: 'contHost', title: $translate.instant("cac.structural.item_host_count")},
                                    ];

                                    that.tableConfig = {
                                        data: [getPromise],
                                        columns: tableColumns,
                                        order: [[0, 'desc']],
                                        buttons: ['reload']
                                    }

                                    function cancel() {
                                        $uibModalInstance.close({action: "cancel"});
                                    }

                                    function getPromise() {
                                        let deferred = $q.defer();
                                        cacResultService.structuralDiagramPrimaryInfo(that.maps).then(function (data) {
                                            that.counts[0] = data.primaryData.length;
                                            that.counts[1] = data.itemTotal;
                                            that.counts[2] = data.hostTotal;
                                            deferred.resolve(data.primaryData);
                                        }).catch(function (err) {
                                            throw err;
                                        });
                                        return deferred.promise;
                                    }
                                }],
                                controllerAs: '$ctrl',
                                size: 'lg',
                                backdrop: true
                            });

                        }
                    })

                    myChart.on('click', function (params) {
                        if ("item" === params.data.type) {
                            var instance = $uibModal.open({
                                templateUrl: 'app/modules/cac/result/structural-two-desc.html',
                                controller: ['$scope', '$uibModalInstance', '$q', function ($scope, $uibModalInstance, $q) {
                                    var that = this;
                                    that.cancel = cancel;
                                    that.counts = [];
                                    that.maps = {
                                        jobId: jobId,
                                        primaryService: params.data.value.split("::")[0],
                                        secondaryService: params.data.value.split("::")[1]
                                    };
                                    that.descYW = descYW;

                                    var tableColumnsItem = [
                                        {data: 'item', title: $translate.instant("cac3.table_fields.patrol_item_name")},
                                        {
                                            data: 'count',
                                            title: $translate.instant("common.term.failed") + $translate.instant("app_um.scan_host_count"),
                                            render: function (data, type, row, meta) {
                                                var html = '<div class="btn-group">' +
                                                    '    <button class="btn btn-danger btn-sm" ng-click="$ctrl.descYW(\'' + row.host + '\',\'' + $translate.instant("app_uim.user.table.header.hostname") + '\')">' + row.count + '</button>' +
                                                    '</div>'
                                                return html
                                            }
                                        }
                                    ];
                                    var tableColumnsHost = [
                                        {data: 'host', title: $translate.instant("app_uim.user.table.header.hostname")},
                                        {
                                            data: 'count',
                                            title: $translate.instant("common.term.failed") + $translate.instant("cac.result.detail.check_item"),
                                            render: function (data, type, row, meta) {
                                                var html = '<div class="btn-group">' +
                                                    '    <button class="btn btn-danger btn-sm" ng-click="$ctrl.descYW(\'' + row.item + '\',\'' + $translate.instant("cac3.table_fields.patrol_item_name") + '\')">' + row.count + '</button>' +
                                                    '</div>'
                                                return html
                                            }
                                        }
                                    ];
                                    that.tableConfigItem = {
                                        data: [getPromiseItem],
                                        columns: tableColumnsItem,
                                        order: [[1, 'desc']],
                                        buttons: ['reload']
                                    }

                                    that.tableConfigHost = {
                                        data: [getPromiseHost],
                                        columns: tableColumnsHost,
                                        order: [[1, 'desc']],
                                        buttons: ['reload']
                                    }

                                    function cancel() {
                                        $uibModalInstance.close({action: "cancel"});
                                    }

                                    function getPromiseItem() {
                                        let deferred = $q.defer();
                                        cacResultService.structuralDiagramHostItemInfo(that.maps).then(function (data) {
                                            that.counts[0] = data.itemLists.length;
                                            deferred.resolve(data.itemLists);
                                        }).catch(function (err) {
                                            throw err;
                                        });
                                        return deferred.promise;
                                    }

                                    function getPromiseHost() {
                                        let deferred = $q.defer();
                                        cacResultService.structuralDiagramHostItemInfo(that.maps).then(function (data) {
                                            that.counts[1] = data.hostLists.length;
                                            deferred.resolve(data.hostLists);
                                        }).catch(function (err) {
                                            throw err;
                                        });
                                        return deferred.promise;
                                    }

                                    function descYW(hostAndItem, name) {
                                        var results = hostAndItem.split(",");
                                        let hostAndItemData = results.map(item => ({name: item}));
                                        var instance = $uibModal.open({
                                            template: '' +
                                                '<div class="modal-header">' +
                                                '   <h3 class="modal-title">' + name + '{{ \'common.entity.action.list\' | translate}}</h3>' +
                                                '   <a ng-click="$ctrlItemAndHost.cancel()">' +
                                                '       <i class="fa fa-times" style="font-size: 20px;"></i>' +
                                                '   </a>' +
                                                '</div>' +
                                                '<div class="modal-body">' +
                                                '       <opx-datatable table-config="$ctrlItemAndHost.tableConfig">' +
                                                '       </opx-datatable>' +
                                                '</div>',
                                            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                                var ctrlThat = this;
                                                ctrlThat.cancel = cancel;

                                                function cancel() {
                                                    $uibModalInstance.close({action: "cancel"});
                                                }

                                                var tableColumns = [
                                                    {data: 'name', title: name},
                                                ];

                                                ctrlThat.tableConfig = {
                                                    data: hostAndItemData,
                                                    columns: tableColumns
                                                }

                                            }],
                                            controllerAs: '$ctrlItemAndHost',
                                            size: 'sm',
                                            backdrop: true
                                        });

                                    }

                                }],
                                controllerAs: '$ctrl',
                                size: 'lg',
                                backdrop: true
                            });
                        }
                    });

                    function recursionFun(data) {

                        for (let i = 0; i < data.length; i++) {
                            if (data[i].type == 'root') {
                                rootCounts = data[i].children.length;//根目录
                            }
                            if (data[i].type == 'sub') {
                                oneCounts++;//获取一级业务数量
                            }
                            if (data[i].type == 'item') {
                                // data[i].symbolSize = 20;
                                // data[i].itemStyle = {color: '#dc3545'};
                                towCounts++;//获取二级业务数量
                            }

                            if (data[i].children.length > 0) {
                                recursionFun(data[i].children);
                            }
                        }

                        if (rootCounts === oneCounts && pd && towCounts > 20) {
                            const compareHeight = 40 * (towCounts - 20);
                            const customHeight = 620
                            var currentHeight = compareHeight + customHeight;
                            dom.style.height = currentHeight + 'px';
                            myChart.resize();
                            pd = false;
                        }
                        return data;
                    }

                    $scope.option = {
                        toolbox: {
                            show: true,
                            feature: {
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        series: [
                            {
                                type: 'tree',
                                data: recursionFun(_data),
                                top: '2%',
                                left: '33%',
                                bottom: '2%',
                                right: '40%',
                                itemStyle: {
                                    borderColor: '#99512F',
                                    borderWidth: 2,
                                    backgroundColor: '#ffffff'
                                },
                                lineStyle: {
                                    color: '#99512F',
                                    width: 2,
                                    curveness: 0.3
                                },
                                symbolSize: 7,
                                label: {
                                    position: 'left',
                                    formatter: function (params) {
                                        if ("root" === params.data.type) {
                                            return [`{root_name|${params.data.name}}`, ' ', `{root_count|${params.data.count}}`].join('');
                                        }
                                        if ("sub" === params.data.type) {
                                            return [`{sub_name|${params.data.name}}`, ' ', `{sub_count|${params.data.count}}`].join('');
                                        }
                                    },
                                    rich: {
                                        root_name: {
                                            verticalAlign: 'middle',
                                            align: 'right',
                                            borderColor: '#000000',
                                            borderWidth: 0,
                                            borderRadius: 6,
                                            padding: [5, 10, 5, 10],
                                            backgroundColor: '#ff5e63',
                                            color: '#ffffff',
                                            distance: 10,
                                        },
                                        root_count: {
                                            padding: [7, 10, 4, 8],
                                            color: '#ffffff',
                                            backgroundColor: '#dc3545',
                                            fontWeight: 'bold',
                                            borderRadius: 50,
                                        },
                                        sub_count: {
                                            padding: [7, 10, 4, 8],
                                            color: '#ffffff',
                                            backgroundColor: '#dc3545',
                                            fontWeight: 'bold',
                                            borderRadius: 50,
                                        },
                                        sub_name: {
                                            verticalAlign: 'middle',
                                            align: 'right',
                                            borderColor: '#000000',
                                            borderWidth: 0,
                                            borderRadius: 6,
                                            padding: [5, 10, 5, 10],
                                            backgroundColor: '#ff5e63',
                                            color: '#ffffff',
                                        },
                                    }
                                },
                                leaves: {
                                    label: {
                                        //position: ['-20%', '-70%'],
                                        position: 'right',
                                        formatter: function (params) {
                                            return [`{count|${params.data.count}}`, ' ', `{name|${params.data.name}}`].join('');
                                        },
                                        rich: {
                                            count: {
                                                padding: [7, 10, 4, 8],
                                                color: '#ffffff',
                                                backgroundColor: '#dc3545',
                                                fontWeight: 'bold',
                                                borderRadius: 50,
                                            },
                                            name: {
                                                verticalAlign: 'middle',
                                                align: 'left',
                                                show: true,
                                                fontSize: 10,
                                                fontWeight: 400,
                                                borderColor: '#99512F',
                                                borderWidth: 1,
                                                borderRadius: 6,
                                                padding: [5, 10, 5, 10],
                                                backgroundColor: '#ffffff',
                                                color: 'black',
                                                distance: 10,
                                            },
                                        },
                                    }
                                },
                                animationDurationUpdate: 750
                            }
                        ],
                    };
                }).catch(function (err) {
                    throw err;
                });
            }
        }

        function downloadBtn(event, type) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL（防止跳转页面）
            var dom = document.getElementById("eechart5");
            var myChart = echarts5.init(dom);
            var url = myChart.getDataURL({
                type: 'png',
                pixelRatio: 2,
                backgroundColor: '#fff'
            });
            var link = document.createElement('a');
            link.href = url;
            link.download = vm.views.job.templateName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        function getJob(jobId) {
            cacResultService.getJob(jobId).then(function (data) {
                vm.views.job = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function exportExcel(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL（防止跳转页面）
            var instance = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<button type="button" class="btn-close" data-dismiss="modal" title="' + $translate.instant('common.file.close_prompt') + '" ng-click="$ctrl.cancel()" style="margin-left: 95%;"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="op-blank-slate">' +
                    '<div class="op-blank-slate-icon">' +
                    '<i class="fa fa-4x fa-pulse fa-spinner fa-fw"></i>' +
                    '</div>' +
                    '<p class="op-flashing-text">' + $translate.instant('common.file.file_downloading') + '</p>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope', '$uibModalInstance', downloadExcel],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: 'static'
            });

            function downloadExcel($scope, $uibModalInstance) {
                var _downloadExcel = this;

                _downloadExcel.$onInit = initDownloadExcel;
                _downloadExcel.cancel = cancel;

                function cancel() {
                    $uibModalInstance.close({action: "cancel"});
                }

                function initDownloadExcel() {
                    var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/results/export/' + jobId;//请求的URl
                    var xhr = new XMLHttpRequest();//定义http请求对象
                    xhr.open("GET", url, true);
                    var token = currentUser.authToken;
                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.setRequestHeader("Language", $translate.use());
                    xhr.send();
                    xhr.responseType = "blob";  // 返回类型blob
                    xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                        if (this.status === 200) {
                            var blob = this.response;
                            var reader = new FileReader();
                            reader.readAsDataURL(blob);
                            $timeout(function () {
                                var d = new Date();
                                var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                                var a = document.createElement('a');
                                a.download = vm.views.job.templateName + datetime + ".xlsx";
                                a.href = reader.result;
                                $("body").append(a);
                                a.click();
                                $uibModalInstance.close(true);
                            }, 100);
                        } else {
                            $uibModalInstance.close(true);
                            messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                        }
                    }
                }

            }
        }
    }
})();

/**
 * @author luohuanjiang@famessoft.com, created on 2024/06/26
 */
(function () {
    'use strict';

    angular.module('oplus.cac').controller('structuralDiagramCtrls', structuralDiagramCtrls);

    structuralDiagramCtrls.$inject = ['$scope', 'cacResultService', '$stateParams', '$uibModal', '$q', '$translate', 'currentUser', '$timeout'];

    function structuralDiagramCtrls($scope, cacResultService, $stateParams, $uibModal, $q, $translate, currentUser, $timeout) {
        var vm = this;
        vm.$onInit = onInit;
        var jobId = $stateParams.jobId;
        var biaoji = "";

        vm.views = {
            job: {},
            exportExcel: exportExcel,
            downloadBtn: downloadBtn
        }
        vm.params = {
            "job_id": $stateParams.jobId
        }

        function onInit() {
            if (jobId != null) {
                getJob(jobId);
                cacResultService.getStructuralDiagram(jobId).then(function (_data) {
                    let towCounts = 0;

                    function recursionFun(data) {
                        for (let i = 0; i < data.length; i++) {
                            // 根据type标识符判断当前阶段是否需要竖向
                            if (data[i].type == 'item') {
                                // let kuan = 35;
                                // let output = getEnglishIndices(data[i].name);
                                // data[i].name = '\n\n' + output.processedString;
                                // if (output.englishLengths > 5) {
                                //     kuan = (output.englishLengths * 8);
                                // }
                                let jieQu = 10;
                                if (data[i].name.length > jieQu) {
                                    //data[i].name = '\n\n' + data[i].name.substr(0, jieQu) + '..';
                                    data[i].name = '\n\n' + getJoinStr(data[i].name);
                                } else {
                                    data[i].name = '\n\n' + data[i].name;
                                }
                                data[i].symbolSize = 30;
                                //data[i].itemStyle = {color: '#dc3545'}; //单独设置节点样式'
                                towCounts++;//获取二级业务数量
                            }
                            if (data[i].type == 'sub') {
                                data[i].symbolSize = 30;
                                //data[i].itemStyle = {color: '#dc3545'}; //单独设置节点样式'
                                // let width = getTextWidth(data[i].name, '13px Arial');
                                // width = width < 50 ? 50 : (width + 20);
                                // data[i].symbolSize = [width, 50];
                            }
                            if (data[i].type == 'root') {
                                let width = getTextWidth(data[i].name, '13px Arial');
                                data[i].symbolSize = [width, 50];
                                data[i].itemStyle = {color: '#259662'}; //单独设置节点样式'
                                data[i].symbol = 'rect'; // 节点标记形状
                            }

                            if (data[i].children.length > 0) {
                                recursionFun(data[i].children);
                            }
                        }
                        return data;
                    }

                    function getLeaveData(data, leaveData) {
                        for (let i = 0; i < data.length; i++) {
                            const item = data[i];
                            if (item.children.length > 0) getLeaveData(item.children, leaveData);
                            else {
                                leaveData.push(item);
                            }
                        }
                    }

                    function getTextWidth(text, font) {
                        // 创建一个canvas元素
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        // 设置字体
                        ctx.font = font;
                        // 测量文本宽度
                        const width = ctx.measureText(text).width;
                        // 返回宽度
                        return width;
                    }

                    function getJoinStr(originalString) {
                        //let indicesToInsert = [6, 8, 10, 12, 14];
                        let indicesToInsert = [10, 10, 10, 10];
                        let resultString = "";
                        let dangQianStr = "";
                        for (let i = 0; i < indicesToInsert.length; i++) {
                            if (i !== 0 && dangQianStr === "") {
                                continue
                            }
                            resultString += i === 0 ? originalString.slice(i, indicesToInsert[i]) : "\n" + dangQianStr.slice(0, indicesToInsert[i]);
                            dangQianStr = i === 0 ? originalString.slice(indicesToInsert[i], originalString.length) : dangQianStr.slice(indicesToInsert[i], dangQianStr.length);
                        }
                        return resultString;
                    }

                    function getEnglishIndices(str) {
                        let indices = []; // 用于存储英文单词的起始和结束下标
                        let startIndex = null; // 英文单词的起始下标
                        for (let i = 0; i < str.length; i++) {
                            const char = str[i];
                            if (/[A-Za-z]/.test(char) && startIndex === null) {
                                startIndex = i;
                            } else if (!/[A-Za-z]/.test(char) && startIndex !== null) {
                                indices.push({start: startIndex, end: i - 1}); // 结束下标是上一个英文字符的索引
                                startIndex = null; // 重置起始下标以寻找下一个英文单词
                            } else if (i === str.length - 1 && /[A-Za-z]/.test(char) && startIndex !== null) {
                                indices.push({start: startIndex, end: i}); // 结束下标是当前索引
                            }
                        }
                        let result = processString(str, indices);
                        return result;
                    }

                    function processString(str, indices) {
                        let englishLengths = 0;
                        for (let i = 0; i < indices.length; i++) {
                            let index = indices[i].end + i + 1;
                            let temp = (indices[i].end + 1) - indices[i].start;
                            englishLengths = englishLengths > temp ? englishLengths : temp;
                            str = str.slice(0, index) + '\n' + str.slice(index);
                        }
                        let newStr = str.replace(/[\u4e00-\u9fa5]/g, function (match) {
                            return match + '\n';
                        });
                        newStr = newStr.trim();
                        return {
                            processedString: newStr,
                            englishLengths: englishLengths
                        };
                    }


                    var dom = document.getElementById("eechart5");
                    var tooltip = document.getElementById('tooltip');
                    var myChart = echarts5.init(dom);

                    // let debouncedMouseMove = _.debounce(function (params) {
                    //     // 编写逻辑
                    //     if (params.data.type === "item") {
                    //         if (params.data.name != biaoji) {
                    //             biaoji = params.data.name;
                    //         } else {
                    //             biaoji = "";
                    //             return;
                    //         }
                    //         tooltip.style.display = 'block';
                    //         tooltip.style.left = (params.event.event.clientX - 145) + "px"; // 偏移一些距离，以便 tooltip 不会紧贴着鼠标指针
                    //         tooltip.style.top = (params.event.event.clientY - 260) + "px"; // 考虑到 tooltip 的高度，以便它不会超出容器
                    //         tooltip.textContent = params.data.title;
                    //     }
                    // }, 100); // 500 毫秒内只执行一次

                    // myChart.on('mousemove', function (event) {
                    //     debouncedMouseMove(event); // 传递 ECharts 的 mousemove 事件参数给防抖函数
                    // });
                    //
                    // dom.addEventListener('mouseleave', function () {
                    //     tooltip.style.display = 'none';
                    // });

                    function calculateWidth(data) {
                        let leaveData = [];
                        getLeaveData(data, leaveData);
                        let font = '20px Arial';

                        return 150 * leaveData.length;

                        // return _.reduce(leaveData, function (prev, curr, idx) {
                        //     if (idx === 1) prev = getTextWidth(curr.title, font)
                        //     return prev + getTextWidth(curr.title, font)

                        // })
                    }

                    myChart.on('dblclick', function (params) {
                        if ("sub" === params.data.type) {
                            var instance = $uibModal.open({
                                templateUrl: 'app/modules/cac/result/structural-one-desc.html',
                                controller: ['$scope', '$uibModalInstance', '$q', function ($scope, $uibModalInstance, $q) {
                                    var that = this;
                                    that.cancel = cancel;
                                    that.counts = [];
                                    that.maps = {
                                        jobId: jobId,
                                        primaryService: params.data.name
                                    };

                                    var tableColumns = [
                                        {
                                            data: 'name',
                                            title: $translate.instant("cac.structural.secondary_service_name")
                                        },
                                        {data: 'contItem', title: $translate.instant("cac.structural.item_err_count")},
                                        {data: 'contHost', title: $translate.instant("cac.structural.item_host_count")},
                                    ];

                                    that.tableConfig = {
                                        data: [getPromise],
                                        columns: tableColumns,
                                        order: [[0, 'desc']],
                                        buttons: ['reload']
                                    }

                                    function cancel() {
                                        $uibModalInstance.close({action: "cancel"});
                                    }

                                    function getPromise() {
                                        let deferred = $q.defer();
                                        cacResultService.structuralDiagramPrimaryInfo(that.maps).then(function (data) {
                                            that.counts[0] = data.primaryData.length;
                                            that.counts[1] = data.itemTotal;
                                            that.counts[2] = data.hostTotal;
                                            deferred.resolve(data.primaryData);
                                        }).catch(function (err) {
                                            throw err;
                                        });
                                        return deferred.promise;
                                    }
                                }],
                                controllerAs: '$ctrl',
                                size: 'lg',
                                backdrop: true
                            });

                        }
                    })

                    myChart.on('click', function (params) {
                        if ("item" === params.data.type) {
                            var instance = $uibModal.open({
                                templateUrl: 'app/modules/cac/result/structural-two-desc.html',
                                controller: ['$scope', '$uibModalInstance', '$q', function ($scope, $uibModalInstance, $q) {
                                    var that = this;
                                    that.cancel = cancel;
                                    that.counts = [];
                                    that.maps = {
                                        jobId: jobId,
                                        primaryService: params.data.value.split("::")[0],
                                        secondaryService: params.data.value.split("::")[1]
                                    };
                                    that.descYW = descYW;

                                    var tableColumnsItem = [
                                        {data: 'item', title: $translate.instant("cac3.table_fields.patrol_item_name")},
                                        {
                                            data: 'count',
                                            title: $translate.instant("common.term.failed") + $translate.instant("app_um.scan_host_count"),
                                            render: function (data, type, row, meta) {
                                                var html = '<div class="btn-group">' +
                                                    '    <button class="btn btn-danger btn-sm" ng-click="$ctrl.descYW(\'' + row.host + '\',\'' + $translate.instant("app_uim.user.table.header.hostname") + '\')">' + row.count + '</button>' +
                                                    '</div>'
                                                return html
                                            }
                                        }
                                    ];
                                    var tableColumnsHost = [
                                        {data: 'host', title: $translate.instant("app_uim.user.table.header.hostname")},
                                        {
                                            data: 'count',
                                            title: $translate.instant("common.term.failed") + $translate.instant("cac.result.detail.check_item"),
                                            render: function (data, type, row, meta) {
                                                var html = '<div class="btn-group">' +
                                                    '    <button class="btn btn-danger btn-sm" ng-click="$ctrl.descYW(\'' + row.item + '\',\'' + $translate.instant("cac3.table_fields.patrol_item_name") + '\')">' + row.count + '</button>' +
                                                    '</div>'
                                                return html
                                            }
                                        }
                                    ];
                                    that.tableConfigItem = {
                                        data: [getPromiseItem],
                                        columns: tableColumnsItem,
                                        order: [[1, 'desc']],
                                        buttons: ['reload']
                                    }

                                    that.tableConfigHost = {
                                        data: [getPromiseHost],
                                        columns: tableColumnsHost,
                                        order: [[1, 'desc']],
                                        buttons: ['reload']
                                    }

                                    function cancel() {
                                        $uibModalInstance.close({action: "cancel"});
                                    }

                                    function getPromiseItem() {
                                        let deferred = $q.defer();
                                        cacResultService.structuralDiagramHostItemInfo(that.maps).then(function (data) {
                                            that.counts[0] = data.itemLists.length;
                                            deferred.resolve(data.itemLists);
                                        }).catch(function (err) {
                                            throw err;
                                        });
                                        return deferred.promise;
                                    }

                                    function getPromiseHost() {
                                        let deferred = $q.defer();
                                        cacResultService.structuralDiagramHostItemInfo(that.maps).then(function (data) {
                                            that.counts[1] = data.hostLists.length;
                                            deferred.resolve(data.hostLists);
                                        }).catch(function (err) {
                                            throw err;
                                        });
                                        return deferred.promise;
                                    }

                                    function descYW(hostAndItem, name) {
                                        var results = hostAndItem.split(",");
                                        let hostAndItemData = results.map(item => ({name: item}));
                                        var instance = $uibModal.open({
                                            template: '' +
                                                '<div class="modal-header">' +
                                                '   <h3 class="modal-title">' + name + '{{ \'common.entity.action.list\' | translate}}</h3>' +
                                                '   <a ng-click="$ctrlItemAndHost.cancel()">' +
                                                '       <i class="fa fa-times" style="font-size: 20px;"></i>' +
                                                '   </a>' +
                                                '</div>' +
                                                '<div class="modal-body">' +
                                                '       <opx-datatable table-config="$ctrlItemAndHost.tableConfig">' +
                                                '       </opx-datatable>' +
                                                '</div>',
                                            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                                var ctrlThat = this;
                                                ctrlThat.cancel = cancel;

                                                function cancel() {
                                                    $uibModalInstance.close({action: "cancel"});
                                                }

                                                var tableColumns = [
                                                    {data: 'name', title: name},
                                                ];

                                                ctrlThat.tableConfig = {
                                                    data: hostAndItemData,
                                                    columns: tableColumns
                                                }

                                            }],
                                            controllerAs: '$ctrlItemAndHost',
                                            size: 'sm',
                                            backdrop: true
                                        });

                                    }

                                }],
                                controllerAs: '$ctrl',
                                size: 'lg',
                                backdrop: true
                            });
                        }
                    });


                    $scope.option = {
                        // tooltip 不生效（手动实现效果）
                        //  tooltip: {
                        //      show: true,
                        //      trigger: 'item',
                        //      triggerOn: 'mousemove',
                        //  },
                        series: [
                            {
                                type: 'tree',
                                data: recursionFun(_data),
                                initialTreeDepth: 2, //默认树展开的层数
                                // width: calculateWidth(_data),
                                left: '0%',
                                right: '0%',
                                top: '5%',
                                bottom: '20%',
                                // roam: true, //移动+缩放  'scale' 或 'zoom'：只能够缩放。 'move' 或 'pan'：只能够平移。
                                // scaleLimit: { //缩放比例
                                //     min: 0.7,//最小的缩放值
                                //     max: 4,//最大的缩放值
                                // },
                                //symbolSize: [100, 60], //设置框的大小
                                symbol: 'circle', // 节点标记形状
                                // symbolOffset: function (text, obj) { 
                                //     if (obj.data.children.length > 0) return [];
                                //     return [0, obj.dataIndex % 2 == 0 ? 20 : -15];
                                // },
                                // emphasis: {
                                //     focus: 'descendant'
                                // },
                                edgeShape: 'polyline', //设置连接线曲线还是折线，默认情况下是曲线，curve曲线 polyline直线
                                orient: 'vertical', //树整体的方向horizontal横向 vertical竖向
                                expandAndCollapse: true,
                                itemStyle: {
                                    color: '#dc3545',//节点颜色 全局
                                    borderColor: '#333',
                                    borderWidth: 0.1,
                                    overflow: 'truncate',
                                },
                                //lable 设置含有子节点的样式
                                label: {
                                    show: true,
                                    position: 'inside',
                                    textStyle: {
                                        fontSize: 10,
                                        color: '#fff',
                                        //fontWeight: 'bold'
                                    },
                                    verticalAlign: 'middle',
                                    align: 'center',
                                    height: 10,//控制1 2级节点的行高间距
                                    // width: 210,
                                    formatter: function (params) {
                                        if ("root" === params.data.type) {
                                            return [`{root_name|${params.data.name}\n}`,, `{root_count|${params.data.count}\n\n}`].join('');
                                        }
                                        if ("sub" === params.data.type) {
                                            return [`{sub_count|${params.data.count}\n\n}`, `{sub_name|${params.data.name}}`].join('');
                                        }
                                        if ("item" === params.data.type || "sub" === params.data.type) {
                                            return [`{count|${params.data.count}}`, `{name|${params.data.name}}`].join('');
                                        }
                                    },
                                    rich: {
                                        root_name:{
                                          fontSize: 10,
                                          padding: [2, 5, 6, 5],
                                          height:10,
                                          lineHeight: 12
                                        },
                                        root_count: {
                                            padding: [2, 5, 2, 5],
                                            marginTop:10,
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: 12,
                                            backgroundColor: '#BF221F',
                                            borderRadius: 5,
                                            lineHeight: 12
                                        },
                                        count: {
                                            //padding: [2, 5, 2, 5],
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: 12,
                                            //backgroundColor: '#BF221F',
                                            //borderRadius: 5,
                                            lineHeight: 12//todo
                                        },
                                        name: {
                                            color: 'black',
                                            fontSize: 10,
                                        },
                                        sub_count: {
                                            padding: [2, 5, 2, 5],
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: 12,
                                            lineHeight: 12//todo
                                        },
                                        sub_name: {
                                            lineHeight: 12,//todo
                                            align: 'left',
                                            fontSize: 10,
                                            borderColor: '#99512F',
                                            borderWidth: 0.6,
                                            borderRadius: 6,
                                            padding: [3, 6, 3, 6],
                                            backgroundColor: '#ffffff',
                                            color: 'black',
                                            distance: 10
                                        },
                                    }
                                },
                                leaves: {
                                    // 设置末节点的样式
                                    label: {
                                        position: 'inside',
                                        color: '#fff',
                                        // verticalAlign: 'middle',
                                        // align: 'center',
                                        height: 10,
                                        //width: 100,
                                        //fontWeight: 'bold'
                                    },

                                },
                                lineStyle: {
                                    color: '#99512F', //连接线的颜色
                                    width: 2,
                                },
                                animationDurationUpdate: 750,
                            },
                        ],
                    };

                    (function initAfterSetOption() {
                        let critical_value = 10;
                        if (towCounts >= critical_value) {
                            //二级业务超过critical_value,echarts生成完成后设置总宽度
                            let a_count = towCounts > critical_value ? (towCounts - critical_value) : (critical_value - towCounts);
                            let b_count = a_count * 150;
                            dom.style.width = (b_count + window.innerWidth) + 'px'; // 设置宽度
                            // 调用resize方法以确保echarts图表适配新的容器大小
                            myChart.resize();
                        }
                    })();

                }).catch(function (err) {
                    throw err;
                });
            }
        }

        function downloadBtn(event, type) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL（防止跳转页面）
            var dom = document.getElementById("eechart5");
            var myChart = echarts5.init(dom);
            var url = myChart.getDataURL({
                type: 'png',
                pixelRatio: 2,
                backgroundColor: '#fff'
            });
            var link = document.createElement('a');
            link.href = url;
            link.download = vm.views.job.templateName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        function getJob(jobId) {
            cacResultService.getJob(jobId).then(function (data) {
                vm.views.job = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function exportExcel(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL（防止跳转页面）
            var instance = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<button type="button" class="btn-close" data-dismiss="modal" title="' + $translate.instant('common.file.close_prompt') + '" ng-click="$ctrl.cancel()" style="margin-left: 95%;"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="op-blank-slate">' +
                    '<div class="op-blank-slate-icon">' +
                    '<i class="fa fa-4x fa-pulse fa-spinner fa-fw"></i>' +
                    '</div>' +
                    '<p class="op-flashing-text">' + $translate.instant('common.file.file_downloading') + '</p>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope', '$uibModalInstance', downloadExcel],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: 'static'
            });

            function downloadExcel($scope, $uibModalInstance) {
                var _downloadExcel = this;

                _downloadExcel.$onInit = initDownloadExcel;
                _downloadExcel.cancel = cancel;

                function cancel() {
                    $uibModalInstance.close({action: "cancel"});
                }

                function initDownloadExcel() {
                    var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/results/export/' + jobId;//请求的URl
                    var xhr = new XMLHttpRequest();//定义http请求对象
                    xhr.open("GET", url, true);
                    var token = currentUser.authToken;
                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.setRequestHeader("Language", $translate.use());
                    xhr.send();
                    xhr.responseType = "blob";  // 返回类型blob
                    xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                        if (this.status === 200) {
                            var blob = this.response;
                            var reader = new FileReader();
                            reader.readAsDataURL(blob);
                            $timeout(function () {
                                var d = new Date();
                                var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                                var a = document.createElement('a');
                                a.download = vm.views.job.templateName + datetime + ".xlsx";
                                a.href = reader.result;
                                $("body").append(a);
                                a.click();
                                $uibModalInstance.close(true);
                            }, 100);
                        } else {
                            $uibModalInstance.close(true);
                            messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                        }
                    }
                }

            }
        }
    }
})();

/**
 * @author luohuanjiang@famessoft.com, created on 2024/06/26
 */
(function () {
    'use strict';

    angular.module('oplus.cac').controller('dataDrivenCtrl', dataDrivenCtrl);

    dataDrivenCtrl.$inject = ['$scope'];

    function dataDrivenCtrl($scope) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit(){

        }
    }
})();


(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac.export', {
                url: '/export',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/export/asset-model.html',
                        controller: 'CacAssetModelController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.export.list', {
                url: '/list',
                views: {
                    'config-view': {
                        templateUrl: 'app/modules/cac/export/asset-model-export.html',
                        controller: 'CacAssetModelExportController',
                        controllerAs: 'vm'
                    }
                }
            })

        ;
    }])
    ;
})
();

/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacAssetModelService', CacAssetModelService);

    CacAssetModelService.$inject = ['restUtils'];

    function CacAssetModelService(restUtils) {
        var module = "cac";

        this.getAssetModel =getAssetModel;
        this.getSelectAssetModel=getSelectAssetModel;
        this.saveSelectAssetModel =saveSelectAssetModel;

        function getAssetModel() {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/get/asssets-model-types', null, null);
        }
        function getSelectAssetModel(){
            return restUtils.callApi(module, 'POST', '/api/cac/v2/get/assets-model-data', null, null);
        }

        function saveSelectAssetModel(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/save/assets-model-data',null,data);

        }
    }

})();

(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacAssetModelController', CacAssetModelController);
    CacAssetModelController.$inject = ['$scope','$state','messageService','$http','$stateParams'];

    function CacAssetModelController($scope, $state,messageService, $http, $stateParams) {
    }
})
();


(function () {
    angular.module('oplus.cac').controller('CacAssetModelExportController', CacAssetModelExportController);

    CacAssetModelExportController.$inject = ['$scope', '$timeout', '$state', 'CacAssetModelService','$http', 'messageService', 'currentUser', '$translate'];


    function CacAssetModelExportController($scope, $timeout, $state, CacAssetModelService,$http, messageService, currentUser, $translate) {
        var vm = this;
        vm.assetsModelTypes = [];//资产模板类型
        vm.assetsModelData ={};
        vm.choice_data=choice_data;

        getAssetModel();//初始化
        function getAssetModel(){
            CacAssetModelService.getAssetModel().then(function (data) {
                if(Object.keys(data).length > 0){
                    for (var key in data) {
                        vm.assetsModelTypes.push(key);
                        vm.assetsModelData[key] = data[key];
                    }
                    getSelectAssetModel();
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
            });
        }

        function getSelectAssetModel(){//获取点击过的数据并回显
            CacAssetModelService.getSelectAssetModel().then(function (data) {
                if(Object.keys(data).length > 0){
                    for (var key in data) {
                       if(!vm.assetsModelData[key]){
                           continue;
                       }
                       for (var i =0 ; i < vm.assetsModelData[key].length ;i++){
                           for (var j = 0 ; j < data[key].length ;j++){
                               if(vm.assetsModelData[key][i].code == data[key][j].code){
                                   vm.assetsModelData[key][i].isChecked=true
                                   break;
                               }
                           }
                       }
                    }

                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
            });
        }




        function choice_data(modelData){//保存数据
            CacAssetModelService.saveSelectAssetModel(modelData).then(function () {
                console.log("save==",modelData);
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
            });
        }

    }
})
();


(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac.email', {
                url: '/email',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/email/email-recipient.html',
                        controller: 'CacEmailController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.email.list', {
                url: '/list',
                views: {
                    'email-view': {
                        templateUrl: 'app/modules/cac/email/email-recipient-list.html',
                        controller: 'CacEmailRecipientController',
                        controllerAs: 'vm'
                    }
                }
            })

        ;
    }])
    ;
})
();


(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacEmailController', CacEmailController);
    CacEmailController.$inject = ['$scope','$state','messageService','$http','$stateParams'];

    function CacEmailController($scope, $state,messageService, $http, $stateParams) {
    }
})
();

(function () {
    angular.module('oplus.cac').controller('CacEmailRecipientController', CacEmailRecipientController);

    CacEmailRecipientController.$inject = ['$scope', '$state', '$http', 'messageService', 'currentUser', '$translate', 'sscEmailService', '$uibModal'];


    function CacEmailRecipientController($scope, $state, $http, messageService, currentUser, $translate, sscEmailService, $uibModal) {
        var vm = this;

        sscEmailService.getCacEmailSwitch().then(function (data) {
            vm.s = data;
            vm.isTheEmailEnabled = data.isTheEmailEnabled === "yes";
        });

        $scope.on_off = function () {
            vm.s.isTheEmailEnabled = vm.isTheEmailEnabled ? "yes" : "no";
            sscEmailService.saveCacEmailSwitch(vm.s);
        }

        vm.customContent = function () {
            var instance = $uibModal.open({
                template: '' +
                    '<div class="modal-header">' +
                    '   <h3 class="modal-title">自定义附件名称</h3>' +
                    '   <a ng-click="$ctrl.cancel()">' +
                    '       <i class="fa fa-times" style="font-size: 20px;"></i>' +
                    '   </a>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '   <div class="bg-light p-3" >' +
                    '       <input type="text" class="form-control" ng-model="$ctrl.content">' +
                    '   </div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button class="btn btn-primary pull-right" style="margin-right: 6px;" ng-click="$ctrl.save()"><i class="fa fa-check"></i> 保存 </button>' +
                    '</div>',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    var that = this;
                    that.cancel = cancel;
                    that.content = angular.copy(vm.s.customFileName);;
                    that.save = save;

                    function cancel() {
                        $uibModalInstance.close({action: "cancel"});
                    }

                    function save(){
                        vm.s.customFileName = that.content;
                        sscEmailService.saveCacEmailSwitch(vm.s);
                        that.cancel();
                    }
                }],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: 'static'
            });

        }

    }
})
();


(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.inspection', {
                url: '/inspection',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/inspection/inspection.html',
                        controller: 'CacInspectionController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.inspection.list', {
                url: '/list',
                views: {
                    'inspection-view': {
                        templateUrl: 'app/modules/cac/inspection/inspection-list.html',
                        controller: 'CacInspectionListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.inspection.add', {
                url: '/add',
                views: {
                    'inspection-view': {
                        templateUrl: 'app/modules/cac/inspection/inspection-edit.html',
                        controller: 'CacInspectionEditController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.inspection.edit', {
                url: '/:id/edit',
                views: {
                    'inspection-view': {
                        templateUrl: 'app/modules/cac/inspection/inspection-edit.html',
                        controller: 'CacInspectionEditController',
                        controllerAs: 'vm'
                    }
                }
            })

    }])

})
();
/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacInspectionService', CacInspectionService);

    CacInspectionService.$inject = ['restUtils','$q','$http'];

    function CacInspectionService(restUtils,$q,$http) {
        var MODULE = "cac";

        this.getAllInspection =getAllInspection;
        this.getInspectionById =getInspectionById;
        this.saveORUpdateInspection =saveORUpdateInspection;
        this.deleteInspection=deleteInspection;
        this.uniqueValidation =uniqueValidation;

        function getAllInspection() {
            return restUtils.callApi(MODULE, 'GET','/api/cac/v3/get-inspection', null);
        }

        function getInspectionById(id) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/get-inspection/{id}', {id: id})
        }

        function saveORUpdateInspection(inspection,id) {
            if(null == id || "" == id){
                return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/get-inspection', null, inspection);
            }else{
                return restUtils.callApi(MODULE, 'PUT', '/api/cac/v3/get-inspection', null, inspection);
            }
        }

        function deleteInspection(id) {
            return restUtils.callApi(MODULE, 'DELETE', '/api/cac/v3/get-inspection/{id}',{id: id});
        }

        function uniqueValidation(inspection){
            return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/get-inspection/unique-validation', null, inspection);
        }

        /*var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/results/export/' + jobId;//请求的URl
        function test(inspection){
            var deferred = $q.defer();
            $http.post("api/cac/v3/get-inspection/unique-validation", pageDefine)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };*/

    }

})();

(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacInspectionController', CacInspectionController);
    CacInspectionController.$inject = ['$scope','$state','messageService','$http','$stateParams'];

    function CacInspectionController($scope, $state,messageService, $http, $stateParams) {
    }
})
();

(function () {
    angular.module('oplus.cac').controller('CacInspectionListController', CacInspectionListController);

    CacInspectionListController.$inject = ['$scope', 'CacInspectionService', '$state', '$http', 'messageService', 'currentUser', '$translate', '$filter', '$timeout', '$uibModal', 'modalHelper', 'CacCheckLogService'];


    function CacInspectionListController($scope, CacInspectionService, $state, $http, messageService, currentUser, $translate, $filter, $timeout, $uibModal, modalHelper, CacCheckLogService) {
        var vm = this;

        this.deleteInspection = deleteInspection;
        this.downloadTemplate = downloadTemplate;
        this.exportInspectionItems = exportInspectionItems;
        vm.selectedInstpections = [];

        function deleteInspection(id, name, owner) {
            if (currentUser.isSameUser(owner) || currentUser.hasPermission('cac:edit')) {
                CacCheckLogService.isItRunning(id).then(function (data) {
                    if (data) {
                        messageService.toast("warning", $translate.instant('cac3.information.prompt.thePatrolItemIsBeingExecutedAndCannotBeDelete'));
                    } else {
                        messageService.confirm($translate.instant('common.entity.delete.title'), $translate.instant("cac3.information.prompt.deletePatrolitem", {name: name}), function () {
                            CacInspectionService.deleteInspection(id).then(function () {
                                messageService.toast("success", $translate.instant('common.messages.operation.success'));
                                $state.go('app.cac3.inspection.list', null, {reload: true});
                            }).catch(function (err) {
                                messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                                throw err;
                            });
                        });
                    }
                }).catch(function (err) {
                    messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                    throw err;
                });
            } else {
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_delete'))
            }
        };

        var tableColumns = [
            {
                data: 'name', title: $translate.instant('cac3.table_fields.patrol_item_name'),
                render: function (data, type, row, meta) {
                    return '<span' +
                        ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 200px;"' +
                        ' title=' + row.name + '>' + row.name + '</span>';
                }
            },
            {data: 'description', title: $translate.instant('cac3.table_fields.patrol_item_description')},
            /* {data: 'checkScriptType',title: "检查脚本类型"},
             {data: 'fixScriptType',title: "修复脚本类型"},*/
            {
                data: 'checkScriptPath', title: $translate.instant('cac3.table_fields.check_script_name'),
                render: function (data, type, row, meta) {
                    return row.checkScriptPath.split('/').pop().toLowerCase();
                }

            },
            {
                data: 'fixScriptPath', title: $translate.instant('cac3.table_fields.fix_script_name'),
                render: function (data, type, row, meta) {
                    if (null === row.fixScriptPath || "" === row.fixScriptPath) {
                        return;
                    }
                    return row.fixScriptPath.split('/').pop().toLowerCase();
                }
            },
            {
                data: 'needCheck', title: $translate.instant('cac3.table_fields.whetherToCheckManually'),
                render: function (data, type, row, meta) {
                    var needCheck = row.needCheck;
                    return needCheck == 0 ? '<span class="badge badge-secondary">{{\'cac3.title.no\' | translate}}</span>' : '<span class="badge badge-primary">{{\'cac3.title.yes\' | translate}}</span>';
                }
            },
            {data: 'createdBy', title: $translate.instant('common.attr.created_by')},
            {
                data: 'createdAt',
                title: $translate.instant('common.attr.created_at'),
                type: 'html',
                render: function (data, type, row, meta) {
                    return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {data: 'updatedBy', title: $translate.instant('common.attr.updated_by')},
            {
                data: 'updatedAt',
                title: $translate.instant('common.attr.updated_at'),
                type: 'html',
                render: function (data, type, row, meta) {
                    return $filter('date')(row.updatedAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'key',
                title: $translate.instant('common.entity.detail.operation'),
                class: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    return '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac3.table_fields.performSinglePatrolInspection\' | translate}}" ng-click="vm.runInspection({id:\'' + row.id + '\'},{templateName:\'' + row.name + '\'})">' +
                        '<i class="fa fa-caret-square-right"></i>' +
                        '</a>\n' +
                        '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac3.button.edit_inspection_items\' | translate}}"  ui-sref="app.cac3.inspection.edit({id:\'' + row.id + '\'})">' +
                        '<i class="fa fa-pencil"></i>' +
                        '</a>\n' +
                        '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac3.table_fields.deleteInspectionItems\' | translate}}"  ng-click="vm.deleteInspection(\'' + row.id + '\',\'' + row.name + '\',\'' + row.createdBy + '\')">' +
                        '<i class="fa fa-trash-alt"></i>' +
                        '</a>';
                }
            }
        ];

        vm.tableConfig = {
            data: [getPromise],
            columns: tableColumns,
            order: [[7, 'desc']],
            buttons: ['reload'],
            selection: {
                valueData: 'id', labelData: 'name', preselected: this.selectedInstpections, stateFn: function (row) {
                    //row表示查询出来的值进行处理。
                    //return row.status !== 0 ? 'disabled' : '';
                    return '';
                }
            },
        }

        function getPromise() {
            return CacInspectionService.getAllInspection();
        }

        function exportInspectionItems(event) {
            messageService.confirm($translate.instant('cac3.button.export_inspection_items'), vm.selectedInstpections.length > 0 ? $translate.instant('cac3.information.prompt.export_selected_inspection_items') : $translate.instant('cac3.information.prompt.export_all_inspection_items'), function () {
                event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/get-inspection/export-inspection-items';//请求的URl
                var xhr = new XMLHttpRequest()
                xhr.open('POST', url)
                var token = currentUser.authToken;
                xhr.setRequestHeader("Authorization", "Bearer " + token);
                xhr.setRequestHeader('Content-type', 'application/json')
                xhr.send(JSON.stringify(vm.selectedInstpections))
                xhr.responseType = "blob";  // 返回类型blob
                xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                    if (this.status === 200) {
                        var blob = this.response;
                        var reader = new FileReader();
                        reader.readAsDataURL(blob);
                        $timeout(function () {
                            var a = document.createElement('a');
                            a.download = "patrol_item_template.xlsx";
                            a.href = reader.result;
                            $("body").append(a);
                            a.click();
                        }, 100);
                    } else {
                        messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                    }
                }
                $state.go('app.cac3.inspection.list', null, {reload: true});
            });
        }

        function downloadTemplate(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/get-inspection/download-template';//请求的URl
            var xhr = new XMLHttpRequest();//定义http请求对象
            xhr.open("GET", url, true);
            var token = currentUser.authToken;
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send();
            xhr.responseType = "blob";  // 返回类型blob
            xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                if (this.status === 200) {
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    $timeout(function () {
                        var a = document.createElement('a');
                        a.download = "patrol_item_template.xlsx";
                        a.href = reader.result;
                        $("body").append(a);
                        a.click();
                    }, 100);
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                }
            }
        }

        vm.importInspection = function () {
            var instance = $uibModal.open({
                templateUrl: 'app/modules/cac/inspection/inspection-upload.html',
                controller: ['$http', '$scope', '$uibModalInstance', function ($http, $scope, $uibModalInstance) {
                    var that = this;
                    that.cancel = cancel;

                    function cancel() {
                        $uibModalInstance.close({action: "cancel"});
                    }

                    $scope.$watch('file', function (newVal, oldVal) {
                        that.fileName = newVal;
                    });


                    $scope.submit = function () {
                        var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/get-inspection/bulk-import';//请求的URl
                        var fd = new FormData();
                        fd.append("excelFile", $scope.file);
                        $http({
                            method: 'POST',
                            url: url,
                            data: fd,
                            headers: {'Content-Type': undefined},
                            transformRequest: angular.identity
                        }).success(function (response) {
                            onSuccess(response);
                        }).error(function (response) {
                            onError(response);
                        })
                    };

                    function onSuccess(result) {
                        $state.go('app.cac3.inspection.list', null, {reload: true});
                        var contents = result.success.statistics + "</br></br>Failed column information:</br>" + "<div class=''>" + result.success.message + "</div>";
                        messageService.alertSuccess(result.success.code, contents);
                        $uibModalInstance.close(result);
                    }

                    function onError(result) {
                        $state.go('app.cac3.inspection.list', null, {reload: true});
                        messageService.alertError(result.error.code, result.error.message);
                        $uibModalInstance.close(result);

                    }

                }],
                controllerAs: '$ctrl',
                size: 'md',
                backdrop: true
            });

        }


        vm.runInspection = function (id, name) {
            if (currentUser.hasPermission("cac:run")) {
                var modal = modalHelper.openModal({
                    templateUrl: 'app/modules/cac/inspection/inspection-run.html',
                    controller: ['$scope', '$uibModalInstance', 'selected', 'templateName', '$compile', '$timeout', 'CacInspectionService', 'messageService', DynamicInspectionSelectorCtrl],
                    controllerAs: '$ctrl',
                    size: 'md',
                    resolve: {
                        selected: function () {
                            return id;
                        },
                        templateName: function () {
                            return name;
                        }
                    }
                });
                modal.result.then(function close(result) {
                }, function dismiss() {
                });
            } else {
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_run'))
            }
        }

        function DynamicInspectionSelectorCtrl($scope, $uibModalInstance, selected, templateName, $compile, $timeout, CacInspectionService, messageService) {

            var _ctrl = this;
            _ctrl.clear = clear;
            _ctrl.runJob = runJob;
            _ctrl.hostList = [];
            _ctrl.itemList = [];

            function clear() {
                $uibModalInstance.close({action: "cancel"});
                $uibModalInstance.dismiss({action: "cancel"});
            }

            function runJob() {
                if (isEmpty()) {
                    return;
                }

                clear();

                _ctrl.itemList.push(selected.id)
                var threeCheckLog = {
                    hostJson: angular.toJson(_ctrl.hostList),
                    itemJson: angular.toJson(_ctrl.itemList),
                    name: templateName.templateName
                };
                CacCheckLogService.runCheckLog(threeCheckLog).then(function (data) {
                    $state.go("app.cac3.check_log.list", {templateId: 'inspection_all'});
                }).catch(function (err) {
                    messageService.toast('error', 'Error', err.message);
                });
            }

            function isEmpty() {
                if (_ctrl.hostList.length === 0) {
                    messageService.toast('warning', $translate.instant("cmd.messages.select_host"));
                    return true;
                }
                return false;
            }

        }
    }
})
();

(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacInspectionEditController', CacInspectionEditController);
    CacInspectionEditController.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'CacInspectionService', '$uibModal', 'messageService', 'currentUser', '$translate','CacCheckLogService'];

    function CacInspectionEditController($scope, $timeout, $state, $stateParams, CacInspectionService, $uibModal, messageService, currentUser, $translate,CacCheckLogService) {
        var vm = this;
        var inspectionId = $stateParams.id;
        vm.clear = clear;
        vm.save = save;

        vm.views = {
            fileSelectorConfigCheck: {
                repoType: 'git',
                viewMode: 'dialog',
                initDir: "oplus/oplus-cac/system_inspection/check/scripts",
                multipleSelect: false,
                showFileConfig: true,
                doNotShowTagsParam: true
            },
            fileSelectorConfigFix: {
                repoType: 'git',
                viewMode: 'dialog',
                initDir: "oplus/oplus-cac/system_inspection/fix/scripts",
                multipleSelect: false,
                showFileConfig: true,
                doNotShowTagsParam: true
            },
            auditParams:[{
                inspectionScripts: [],
                repairScripts: [],
                hosts: []
            }],

        }

        function save() {
            vm.isSaving = true;

            if(vm.inspection.name.indexOf(",") != -1 || vm.inspection.name.indexOf("|") != -1){
                messageService.toast("warning",  $translate.instant('cac3.information.prompt.thereAreSpecialSymbolsInTheName'));
                onSaveError();
                return;
            }

            var scripts =vm.views.auditParams[0];
            if (scripts.inspectionScripts.length === 0) {
                messageService.toast("warning",  $translate.instant('cac3.information.prompt.patrolScriptCannotBeEmpty'));
                onSaveError();
                return;
            }else if(scripts.repairScripts.length === 0 || typeof vm.inspection.fixScriptPath === 'undefined' || null === vm.inspection.fixScriptPath){
                vm.inspection.fixScriptPath="";
                vm.inspection.fixParams = null;
            }


            scripts.inspectionScripts.forEach(function (val, index) {
                vm.inspection.checkScriptPath = val.scriptPath;
                vm.inspection.checkParams = val.scriptParams;
            });

            scripts.repairScripts.forEach(function (val, index) {
                vm.inspection.fixScriptPath = val.scriptPath;
                vm.inspection.fixParams = val.scriptParams;
            });

            let checkScriptPath = vm.inspection.checkScriptPath.indexOf(".") !== -1;
            let fixScriptPath = "" === vm.inspection.fixScriptPath ? true : vm.inspection.fixScriptPath.indexOf(".") !== -1;
            if(!checkScriptPath || !fixScriptPath){
                messageService.toast("error",  $translate.instant('cac3.information.prompt.theScriptMustBeFile'));
                onSaveError();
                return;
            }

            if(vm.inspection.checkScriptPath === vm.inspection.fixScriptPath){
                messageService.toast("error",  $translate.instant('cac3.information.prompt.fixScriptCheckScriptInconsistent'));
                onSaveError();
                return;
            }

            vm.inspection.checkScriptType =vm.inspection.checkScriptPath.split('.').pop().toLowerCase();
            vm.inspection.fixScriptType =vm.inspection.fixScriptPath.split('.').pop().toLowerCase();
            vm.inspection.exceptionHosts = angular.toJson(scripts.hosts);



            CacInspectionService.uniqueValidation(vm.inspection).then(function (data) {
                if("" !== data.msg){
                    messageService.alertError("error",data.msg)
                    onSaveError();
                }else{
                    if("" !== vm.inspection.id && null !== vm.inspection.id && typeof(vm.inspection.id)!="undefined"){
                        CacCheckLogService.isItRunning(vm.inspection.id).then(function(data){
                            if(data){
                                messageService.toast("warning",  $translate.instant('cac3.information.prompt.thePatrolItemIsBeingExecutedAndCannotBeModified'));
                                onSaveError();
                            }else{
                                saveAndUpdate();
                            }
                        }).catch(function (err) {
                            messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                            throw err;
                        });
                    }else{
                        saveAndUpdate();
                    }
                }
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
        }

        function saveAndUpdate() {
            CacInspectionService.saveORUpdateInspection(vm.inspection,vm.inspection.id).then(function (data) {
                if("" === data){
                    messageService.toast("error",  $translate.instant('cac3.information.prompt.thePatrolItemIsBeingExecutedAndCannotBeModified'));
                    onSaveError();
                }else{
                    messageService.toast("success",  $translate.instant("app.setting.messages.info.appCreated"));
                    clear();
                }
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
        }


        function init() {
            if (inspectionId != null) {
                CacInspectionService.getInspectionById(inspectionId).then(function (data) {
                    vm.inspection = data;
                    var tempFixScriptPath =[{'scriptPath':vm.inspection.fixScriptPath,'scriptParams':vm.inspection.fixParams}];
                    if(null === vm.inspection.fixScriptPath || "" === vm.inspection.fixScriptPath){
                        tempFixScriptPath =[];
                    }
                    $timeout(function () {
                        vm.views.auditParams=[{
                            inspectionScripts: [{'scriptPath':vm.inspection.checkScriptPath,'scriptParams':vm.inspection.checkParams}],
                            repairScripts: tempFixScriptPath,
                            hosts: angular.fromJson(vm.inspection.exceptionHosts)
                        }];
                    }, 200);
                }).catch(function (err) {
                    throw err;
                });
            }
        }
        init();

        function onSaveError() {
            vm.isSaving = false;
        }

        function clear() {
            $state.go('app.cac3.inspection.list', {});
        }

    }
})
();


(function () {
    'use strict';

    angular.module('oplus.cac').component('inspectionDynamicSelector', {
        templateUrl: 'app/modules/cac/inspection/inspection-dynamic-selector.html',
        controller: ['$scope','inspectionActions','CacInspectionService','messageService','$translate', InspectionDynamicSelectorCtrl],
        bindings: {
            threeCheckItemIds: '=theModel'
        }
    });


    function InspectionDynamicSelectorCtrl($scope, inspectionActions,CacInspectionService,messageService,$translate) {
        var vm = this;
        vm.$onInit = onInit;
        vm.inspectionListCi =inspectionListCi;
        vm.getViewsData -=getViewsData;
        vm.emptyItems = emptyItems;
        vm.removeItem = removeItem;


        vm.inspectionLists = [];//获取全量的巡检项数据
        vm.inspectionViewList = [];//通过获取到巡检项id映射出name

        function onInit() {
            CacInspectionService.getAllInspection().then(function (data) {
                vm.inspectionLists = data;
                if(vm.threeCheckItemIds.length > 0){
                    getViewsData();
                }
            }).catch(function (err) {
                throw err;
            });
        }


        function inspectionListCi(){
            inspectionActions.openInspectionSelector(vm.threeCheckItemIds,function (inspections) {
                vm.threeCheckItemIds = inspections;
                vm.inspectionViewList = [];
                getViewsData();
            })
        }
        
        function getViewsData() {
           /* vm.inspectionLists = _.filter(vm.inspectionLists,function(il){
                return vm.threeCheckItemIds.indexOf(il.id) > -1;
            });*/

            _.map(vm.inspectionLists,function(il){
                if(vm.threeCheckItemIds.indexOf(il.id) > -1){
                    vm.inspectionViewList.push({"id":il.id,"name":il.name});
                }
            });
        }

        function emptyItems() {
            messageService.confirm($translate.instant('acm.common.selector.confirm'), $translate.instant('cac3.information.prompt.confirmToRemoveAllPatrolItems'), function () {
                vm.threeCheckItemIds =[];
                vm.inspectionViewList =[];
            });
        }

        function removeItem(id) {

            for(let index in vm.inspectionViewList){
                if(id === vm.inspectionViewList[index].id){
                    vm.inspectionViewList.splice(index, 1);
                    break;
                }
            }

            for(let index in vm.threeCheckItemIds){
                if(id === vm.threeCheckItemIds[index]){
                    vm.threeCheckItemIds.splice(index, 1);
                    break;
                }
            }
        }


        vm.myFilter = function(item) {
            return !vm.filter || item['name'].indexOf(vm.filter) > -1;
        }

    }
})();

(function () {
    'use strict';

    angular.module('oplus.cac').service('inspectionActions', inspectionActions);

    inspectionActions.$inject = ['$uibModal','CacInspectionService','$timeout','$translate'];


    function inspectionActions($uibModal,CacInspectionService,$timeout,$translate) {

        this.openInspectionSelector = openInspectionSelector;

        function openInspectionSelector(preselected, callback) {
            var instance = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<h3 class="modal-title">{{ \'task_scheduling.operating_param\' | translate}}</h3>' +
                    '<a type="button" class="btn-close" style="margin: 10px;float: right;" data-dismiss="modal" ng-click="$ctrl.cancel()"></a>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="op-smartform form-vertical op-bold-label col-sm-12 ms-1">' +
                    '<opx-datatable table-config="$ctrl.tableConfig">' +
                    '<i class="fa fa-list-alt"></i> <span>{{\'cac3.navigation.patrol_item_list\' | translate}}</span>' +
                    '</opx-datatable>' +
                    '</div>' +
                    '<div class="modal-footer text-right">' +
                    '<button type="submit" class="btn btn-primary opx-btn-ok" ng-click="$ctrl.confirm()">{{\'common.entity.action.confirm\' | translate}}</button>' +
                    '<button type="reset" class="btn btn-default opx-btn-cancel" ng-click="$ctrl.cancel()">{{\'common.entity.action.cancel\' | translate}}</button>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope','$uibModalInstance',function ($scope,$uibModalInstance) {
                    var that = this;

                    that.threeCheckItemIds = angular.copy(preselected);

                    that.cancel =function() {
                        instance.dismiss();
                    }

                    that.confirm = function () {
                        instance.close(that.threeCheckItemIds);
                    }

                    //巡检项
                    $timeout(function () {
                        var tableColumns = [
                            {data: 'name',title: $translate.instant('cac3.table_fields.patrol_item_name')},
                            {data: 'description',title: $translate.instant('cac3.table_fields.patrol_item_description')},
                            {
                                data: 'checkScriptPath', title: $translate.instant('cac3.table_fields.check_script_name'),
                                render: function (data, type, row, meta) {
                                    return row.checkScriptPath.split('/').pop().toLowerCase();
                                }

                            },
                            {
                                data: 'fixScriptPath', title: $translate.instant('cac3.table_fields.fix_script_name'),
                                render: function (data, type, row, meta) {
                                    if (null === row.fixScriptPath || "" === row.fixScriptPath) {
                                        return;
                                    }
                                    return row.fixScriptPath.split('/').pop().toLowerCase();
                                }
                            },
                        ];

                        that.tableConfig = {
                            data: [getPromise],
                            columns: tableColumns,
                            order: [[0, 'desc']],
                            buttons: ['reload'],
                            selection: {
                                valueData: 'id', labelData: 'name', preselected: that.threeCheckItemIds, stateFn: function (row) {
                                    return;
                                }
                            },
                        }

                        function getPromise() {
                            return CacInspectionService.getAllInspection();
                        }
                    }, 300);

                }],
                controllerAs: '$ctrl',
                size: 'lg',
                backdrop: true
            });

            instance.result.then(function close(result) {
                callback(result);
                }, function dismiss() {
            });
        }


    }
})();


(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.templates', {
                url: '/templates',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/templates/templates.html',
                        controller: 'CacCheckLogListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.templates.list', {
                url: '/list',
                views: {
                    'templates-view': {
                        templateUrl: 'app/modules/cac/templates/templates-list.html',
                        controller: 'CacTemplatesListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.templates.add', {
                url: '/add',
                views: {
                    'templates-view': {
                        templateUrl: 'app/modules/cac/templates/templates-edit.html',
                        controller: 'CacTemplatesEditController',
                        controllerAs: 'vm'
                    }
                },resolve: {
                    entity: function () {
                        return {
                            createdAt: null,
                            createdBy: null,
                            description: null,
                            executedAt: null,
                            executedBy: null,
                            globalParameters: null,
                            hostsJson: null,
                            icon: null,
                            name: null,
                            overwrite: 0,
                            paramsJson: null,
                            tenantId: null,
                            threeCheckItemIds: [],
                            thumbcolor: null,
                            updatedAt: null,
                            updatedBy: null,
                            id: null
                        };
                    }
                }
            })
            .state('app.cac3.templates.edit', {
                url: '/:id/edit',
                views: {
                    'templates-view': {
                        templateUrl: 'app/modules/cac/templates/templates-edit.html',
                        controller: 'CacTemplatesEditController',
                        controllerAs: 'vm'
                    }
                },resolve: {
                    entity: ['CacTemplatesService','$stateParams', function(CacTemplatesService,$stateParams) {
                        return CacTemplatesService.getTemplatesById($stateParams.id);
                    }]
                }

            })

        ;
    }])
    ;
})
();
/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacTemplatesService', CacTemplatesService);

    CacTemplatesService.$inject = ['restUtils'];

    function CacTemplatesService(restUtils) {
        var MODULE = "cac";

        this.getAllTemplates = getAllTemplates;
        this.getTemplatesById = getTemplatesById;
        this.uniqueValidation = uniqueValidation;
        this.saveORUpdateTemplates = saveORUpdateTemplates;
        this.deleteTemplates = deleteTemplates;

        function getAllTemplates() {
            return restUtils.callApi(MODULE, 'GET','/api/cac/v3/get-templates', null);
        }

        function getTemplatesById(id) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/get-templates/{id}', {id: id})
        }

        function uniqueValidation(templates){
            return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/get-templates/unique-validation', null, templates);
        }

        function saveORUpdateTemplates(templates,id) {
            if(null == id || "" == id){
                return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/get-templates', null, templates);
            }else{
                return restUtils.callApi(MODULE, 'PUT', '/api/cac/v3/get-templates', null, templates);
            }
        }

        function deleteTemplates(id) {
            return restUtils.callApi(MODULE, 'DELETE', '/api/cac/v3/get-templates/{id}',{id: id});
        }

    }

})();

(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacTemplatesController', CacTemplatesController);
    CacTemplatesController.$inject = ['$scope','$state','messageService','$http','$stateParams'];

    function CacTemplatesController($scope, $state,messageService, $http, $stateParams) {
    }
})
();


(function () {
    angular.module('oplus.cac').controller('CacTemplatesListController', CacTemplatesListController);

    CacTemplatesListController.$inject = ['$scope', 'CacTemplatesService', '$state','$http', 'messageService', 'currentUser', '$translate','$filter','CacCheckLogService'];


    function CacTemplatesListController($scope, CacTemplatesService, $state,$http, messageService, currentUser, $translate,$filter,CacCheckLogService) {
        var vm = this;
        vm.deleteTemplates = deleteTemplates;
        vm.runTemplates = runTemplates;

        function deleteTemplates(id,name,owner){
            if (currentUser.isSameUser(owner) || currentUser.hasPermission('cac:edit')) {
                CacCheckLogService.isItRunning(id).then(function(data){
                    if(data){
                        messageService.toast("warning",  $translate.instant('cac3.information.prompt.theTempleteBeingExecutedAndCannotBeDelete'));
                    }else{
                        messageService.confirm($translate.instant('common.entity.delete.title'),$translate.instant("cac3.information.prompt.deleteCheckTemplete",{name:name}), function () {
                            CacTemplatesService.deleteTemplates(id).then(function () {
                                messageService.toast("success", $translate.instant('common.messages.operation.success'));
                                $state.go('app.cac3.templates.list', null, {reload: true});
                            }).catch(function (err) {
                                messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                                throw err;
                            });
                        });
                    }
                }).catch(function (err) {
                    messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                    throw err;
                });
            }else {
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_delete'))
            }
        }

        function runTemplates(id,name){
            if (currentUser.hasPermission("cac:run")) {
                messageService.confirm($translate.instant('cac3.title.confirmExecution'),$translate.instant("cac3.information.prompt.runCheckTemplete",{name:name}), function () {
                    CacCheckLogService.runCheckLogTemplateId(id).then(function () {
                        $state.go("app.cac3.check_log.list",  {templateId:id});
                    }).catch(function (err) {
                        messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                        throw err;
                    });
                });
            }else{
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_run'))
            }
        }

        initData();
        function initData() {
            var tableColumns = [
                {
                    data: 'name',
                    title: $translate.instant('common.entity.detail.name'),
                    render: function (data, type, row, meta) {
                        var content = data;
                        if (row.description) {
                            content += '<p class="help-block">' + row.description + '</p>';
                        }
                        return '<a class="d-block" href="" ui-sref="">' + content + '</a>';
                    }
                },
                {
                    data: 'hosts',
                    title: $translate.instant('cac3.title.hostAndItems'),
                    render: function (data, type, row, meta) {
                        var host = angular.fromJson(row.hostsJson);
                        var item = row.threeCheckItemIds;
                        var html = '{{\'cac3.title.hostItem\' | translate}}: <strong>' + host.length + '</strong>, ' +
                                '{{\'cac3.title.patrolInspectionItems\' | translate}}: <strong>' + item.length + '</strong> ' +
                                '<br/>';
                        return '<span class="cac_table_col_project" style="line-height: 15px!important;">' + html + '</span>';
                    }
                },
                {data: 'createdBy',title: $translate.instant('common.attr.created_by')},
                {
                    data: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    type: 'html',
                    render: function (data, type, row, meta) {
                        return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                    }
                },
                {data: 'executedBy',title: $translate.instant('cac3.table_fields.executor')},
                {
                    data: 'executedAt',
                    title: $translate.instant('cac3.table_fields.executorTime'),
                    type: 'html',
                    render: function (data, type, row, meta) {
                        return $filter('date')(row.executedAt, 'yyyy-MM-dd HH:mm:ss');
                    }
                },
                {
                    data: 'key',
                    title: $translate.instant('common.entity.detail.operation'),
                    class: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.run\' | translate}}" ng-click="vm.runTemplates(\'' + row.id +'\',\'' +row.name +'\')">' +
                            '<i class="fa fa-caret-square-right"></i>' +
                            '</a>\n' +
                            '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.edit\' | translate}}"  ui-sref="app.cac3.templates.edit({id:\'' + row.id + '\'})">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</a>\n' +
                            '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.delete\' | translate}}"  ng-click="vm.deleteTemplates(\'' + row.id +'\',\'' +row.name +'\',\'' +row.createdBy +'\')">' +
                            '<i class="fa fa-trash-alt"></i>' +
                            '</a>';
                    }
                }
            ];

            vm.tableConfig = {
                data: [getPromise],
                columns: tableColumns,
                order: [[0, 'desc']],
                buttons: ['reload'],
            }

            function getPromise() {
                return CacTemplatesService.getAllTemplates();
            }
        }

    }
})
();

(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacTemplatesEditController', CacTemplatesEditController);
    CacTemplatesEditController.$inject = ['$scope', '$timeout', '$state', 'CacTemplatesService', '$uibModal', 'messageService', 'currentUser', '$translate','CacInspectionService','CacCheckLogService','entity'];

    function CacTemplatesEditController($scope, $timeout, $state, CacTemplatesService, $uibModal, messageService, currentUser, $translate,CacInspectionService,CacCheckLogService,entity) {
        var vm = this;

        vm.clear = clear;
        vm.save = save;

        vm.views = {
            auditParams: [{
                hosts: null === entity.hostsJson ? [] : angular.fromJson(entity.hostsJson)
            }],
            templates: entity
        }

        function save(){
            vm.isSaving = true;
            var hostsInfo =vm.views.auditParams[0];//主机信息
            if(hostsInfo.hosts.length === 0){
                messageService.toast("warning",  $translate.instant('cac3.information.prompt.host_info_notnull'));
                onSaveError();
                return;
            }
            if(vm.views.templates.threeCheckItemIds.length === 0){
                messageService.toast("warning",  $translate.instant('cac3.information.prompt.inspection_item_notnull'));
                onSaveError();
                return;
            }

            vm.views.templates.hostsJson = angular.toJson(hostsInfo.hosts);

            CacTemplatesService.uniqueValidation(vm.views.templates).then(function (data) {
                if("" !== data){
                    messageService.toast("error",  $translate.instant('cac3.information.prompt.add_duplicate_template_name'));
                    onSaveError();
                }else{
                    if("" !== vm.views.templates.id && null !== vm.views.templates.id && typeof(vm.views.templates.id)!="undefined"){
                        CacCheckLogService.isItRunning(vm.views.templates.id).then(function(data){
                            if(data){
                                messageService.toast("warning",  $translate.instant('cac3.information.prompt.cannot_be_modified_during_execution'));
                                onSaveError();
                            }else{
                                saveAndUpdate();
                            }
                        }).catch(function (err) {
                            messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                            throw err;
                        });
                    }else{
                        saveAndUpdate();
                    }
                }
            }).catch(function (err) {
                onSaveError();
                throw err;
            });

        }

        function saveAndUpdate() {
            vm.views.templates.globalParameters = null === vm.views.templates.globalParameters ? "" : vm.views.templates.globalParameters;
            CacTemplatesService.saveORUpdateTemplates(vm.views.templates,vm.views.templates.id).then(function (data) {
                if("" === data || null === data){
                    messageService.toast("error",  $translate.instant('cac3.information.prompt.add_duplicate_inspection_name'));
                    onSaveError();
                }else{
                    messageService.toast("success",  $translate.instant("cmd.messages.save_success"));
                    clear();
                }
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        function clear() {
            $state.go('app.cac3.templates.list', {});
        }

    }

})
();

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.check_log', {
                url: '/check_log',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/log/check-log-index.html',
                        controller: 'CacCheckLogController',
                        controllerAs: 'cacCheckLogCtrlVm'
                    }
                }

            })
            .state('app.cac3.check_log.list', {
                url: '/check-list/:templateId',
                views: {
                    'checkView': {
                        templateUrl: 'app/modules/cac/log/check-log-list.html',
                        controller: 'CacCheckLogListController',
                        controllerAs: 'cacCheckLogListCtrlVm'
                    }
                }

            })
        ;
    }])
    ;
})
();

/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacCheckLogService', CacCheckLogService);

    CacCheckLogService.$inject = ['restUtils','$q','$http'];

    function CacCheckLogService(restUtils,$q,$http) {
        var MODULE = "cac";

        this.runCheckLog = runCheckLog;
        this.runCheckLogTemplateId = runCheckLogTemplateId;
        this.getCheckLog = getCheckLog;
        this.isItRunning = isItRunning;
        //执行单项巡检
        function runCheckLog(threeCheckLog){
            return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/check-log/run', null, threeCheckLog);
        }

        //执行巡检模板
        function runCheckLogTemplateId(templateId) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-log/run/{templateId}',{templateId: templateId});
        }

        function getCheckLog(logId) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-log/{logId}', {logId: logId})
        }

        function isItRunning(id) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-item-result/is-it-running/{id}', {id: id})
        }





    }


})();

(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacCheckLogController', CacCheckLogController);
    CacCheckLogController.$inject = ['$state', '$stateParams', 'CacTemplatesService', '$timeout', '$uibModal', 'userPref'];

    function CacCheckLogController($state, $stateParams, CacTemplatesService, $timeout, $uibModal, userPref) {
        var vm = this;

        vm.views = {
            clearFilter: clearFilter,
            templateOrder: userPref.readItem('templateOrder', '-name'),
            changeTemplateOrder: changeTemplateOrder,
            templateList: []
        };

        function clearFilter() {
            vm.views.name = '';
        }

        function getAllTemplate() {
            CacTemplatesService.getAllTemplates().then(function (data) {
                vm.views.templateList = data;
            }).catch(function (err) {
                throw err;
            });
        }


        function changeTemplateOrder(templateOrder) {
            userPref.saveItem('templateOrder', templateOrder);
            vm.views.templateOrder = userPref.readItem('templateOrder', '-name');
        }
        getAllTemplate();

    }

    //模型控制器
    cacModule.controller('CacCheckLogListController', CacCheckLogListController);
    CacCheckLogListController.$inject = ['$q', '$scope', '$http', '$timeout', '$state', 'CacTemplatesService', '$compile', '$uibModal', '$stateParams', '$filter', 'currentUser', 'dataTable', '$httpParamSerializerJQLike', '$translate'];

    function CacCheckLogListController($q, $scope, $http, $timeout, $state, CacTemplatesService, $compile, $uibModal, $stateParams, $filter, currentUser, dataTable, $httpParamSerializerJQLike, $translate) {
        var vm = this;
        vm.scope = $scope;
        vm.views = {
            template: {},
            tableInstance: null,
            findCheckLogStatus: findCheckLogStatus,
            templateId: $stateParams.templateId,
            // refreshTable: refreshTable
            // refresh: "刷新列表"
        };


        var columnDefs = [
            {
                data: 'name',
                title: $translate.instant('common.entity.detail.name')
            },
            {
                data: 'hostJson',
                title: $translate.instant('cac3.title.hostAndItems'),
                render: function (data, type, row, meta) {
                    var host = angular.fromJson(row.hostJson);
                    var item = angular.fromJson(row.itemJson);
                    var html = '{{\'cac3.title.hostItem\' | translate}}: <strong>' + host.length + '</strong>, ' +
                        '{{\'cac3.title.patrolInspectionItems\' | translate}}: <strong>' + item.length + '</strong> ' +
                        '<br/>';
                    return '<span class="cac_table_col_project" style="line-height: 15px!important;">' + html + '</span>';
                }
            },
            {
                data: 'createdAt',
                title: $translate.instant('common.entity.detail.start_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'endAt',
                title: $translate.instant('common.entity.detail.end_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.endAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'createdBy',
                title: $translate.instant('cac.job.detail.create_at'),
            },
            {
                data: 'id',
                title: $translate.instant('cac.job.detail.status'),
                render: function (data, type, row, meta) {
                    var taskId = "'" + row.taskId + "'";
                    var status = row.status;
                    var actionHtml = "";
                    if (status === "ERROR") {
                        actionHtml = '<button type="button" class="btn btn-danger rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacCheckLogListCtrlVm.views.findCheckLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.error\' | translate}}</button>';
                    } else if (status === "SUCCESS") {
                        actionHtml = '<button type="button" class="btn btn-success rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacCheckLogListCtrlVm.views.findCheckLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.ok\' | translate}}</button>';
                    } else {
                        actionHtml = '<button type="button" class="btn btn-primary rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacCheckLogListCtrlVm.views.findCheckLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.running\' | translate}}</button>';
                    }
                    return actionHtml;
                }
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var isEnbled = '';
                    if (row.status !== "SUCCESS") {
                        isEnbled = 'disabled';
                    }
                    return '<button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac3.check_result({logId:\'' + row.id + '\'})"><i class="fa fa-grip-horizontal"></i></button>';
                }
            }
        ];
        this.tableConfig = {
            columns: columnDefs,
            data: [function (dtDataToServer) {
                var d = $q.defer();
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/check-log/page/' + vm.views.templateId;
                $http({
                    url: url,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                    },
                    data: $httpParamSerializerJQLike(dtDataToServer)
                }).then(function (res) {
                    var result = res.data;
                    result.draw = dtDataToServer.draw;
                    d.resolve(result);
                    //console.log(result);
                }, function (err) {
                    d.reject(err);
                    throw err;
                });
                return d.promise;
            }, '', true],
            order: [[2, 'desc']],
            buttons: ['reload']
        };

        function init() {
            if (vm.views.templateId == null || vm.views.templateId == '' || vm.views.templateId == undefined) {
                vm.views.templateId = 'all';
            }
        }

        function findCheckLogStatus(taskId) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/log/check-log-result.html',
                controller: 'CacCheckLogResultCtrl',
                controllerAs: 'cacCheckLogResultVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: taskId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

        init();
    }
})
();

/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacCheckLogResultCtrl', CacCheckLogResultCtrl);
    CacCheckLogResultCtrl.$inject = ['params', '$uibModalInstance'];

    function CacCheckLogResultCtrl(params, $uibModalInstance) {
        var that = this;

        that.runId = params.jobId;
        this.cancel = cancel;

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

    }
})
();

/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.check_result', {
                url: '/check-result/:logId',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/results/check-result-overview.html',
                        controller: 'CheckResultOverviewCtrl',
                        controllerAs: 'checkResultOverviewVm'
                    }
                }

            })
            .state('app.cac3.check_result.output', {
                url: '/:logId/output',
                views: {
                    'cacCheckResult': {
                        templateUrl: 'app/modules/cac/results/check-result-output-list.html',
                        controller: 'CacCheckResultOutputListCtrl',
                        controllerAs: 'cacCheckResultOutputListCtrlVm'
                    }
                }
            })
        ;
    }])
    ;
})();

/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    'use strict';

    angular.module("oplus.cac").service("CheckResultService", CheckResultService);

    CheckResultService.$inject = ["restUtils"];

    function CheckResultService(restUtils) {
        var MODULE = "cac";

        this.getCheckResultsByJobId =getCheckResultsByJobId;
        this.getBylogIdAllData =getBylogIdAllData;
        this.getByIdCheckResult =getByIdCheckResult;

        function getCheckResultsByJobId(logId, start, length) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-item-result/map/{logId}?start=' + start + '&length=' + length, {logId: logId});
        }

        function getBylogIdAllData(logId) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-item-result/v3/{logId}', {logId: logId});
        }

        function getByIdCheckResult(id){
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-item-result/{id}', {id: id});

        }

    }


})();

/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //主控制器
    cacModule.controller('CheckResultOverviewCtrl', CheckResultOverviewCtrl);
    CheckResultOverviewCtrl.$inject = ['CheckResultService', '$http','currentUser', '$scope', 'cacService', '$timeout', '$state', '$stateParams', '$uibModal', '$translate','CacCheckLogService'];

    function CheckResultOverviewCtrl(CheckResultService, $http,currentUser, $scope, cacService, $timeout, $state, $stateParams, $uibModal, $translate,CacCheckLogService) {
        var vm = this;
        var logId = $stateParams.logId;

        vm.params = {
            "check_log_id": $stateParams.logId
        }

        vm.status = {
            "OK": {title: $translate.instant('cac.result.status.ok'), style: 'success'},
            "RUNNING": {title: $translate.instant('cac.result.status.running'), style: 'primary'},
            "SUCCESS": {title: $translate.instant('cac.result.status.ok'), style: 'success'},
            "ERROR": {title: $translate.instant('cac.result.status.error'), style: 'danger'}
        };

        vm.views = {
            checkLog: {},
            isLoading: false,
            resultList: [],
            data_table: [],
            results: {},
            hosts: [],
            loadMore: loadMore,
            changeResultView: changeResultView,
            clickResult: clickResult,
            rules: [],
            auditParams: [
                {
                    hosts:[],
                    items:[]
                }
            ],
            showLog: showLog,
            exportExcel: exportExcel,
            showHostKey: false,
            showItem: false,
            profileView: 'normal',
            start: 0,//分页加载网格
            length: 5000,//每次加载十个主机
        };


        function getJob(logId) {
            CacCheckLogService.getCheckLog(logId).then(function (data) {
                vm.views.checkLog = data;
                vm.views.auditParams[0].hosts =angular.fromJson(vm.views.checkLog.hostJson);
                vm.views.auditParams[0].items =angular.fromJson(vm.views.checkLog.itemJson);
                if(null === vm.views.checkLog.templateId){
                    vm.views.checkLog.templateId="inspection_all";
                }
                if (vm.views.checkLog.status != 'ERROR') {
                    getResultsByJobId(logId);
                }
            }).catch(function (err) {
                throw err;
            });
        }

        function init() {
            if (logId != null) {
                getJob(logId);
            }
        }
        init();

        function getResultsByJobId(logId) {
            vm.views.isLoading = true;

            CheckResultService.getCheckResultsByJobId(logId, vm.views.start, vm.views.length).then(function (data) {
                vm.views.results = data;
                vm.views.results.hosts = _.sortBy(vm.views.results.hosts, ['hostKey']);
                vm.views.hosts = vm.views.results.hosts;
                vm.views.rules = vm.views.results.rules;
                vm.views.resultList = vm.views.results.results;
                $timeout(function () {
                    vm.views.isLoading = false;
                    showTable();
                });
            }).catch(function (err) {
                throw err;
            });
        }

        function showTable() {
            var startTime = (new Date()).getTime();

            //console.log("Start show table startTime = " + startTime);

            var hostRuleResultMap = {};
            var tableRecords = [];

            if (vm.views.resultList.length == 0) {
                vm.views.data_table = tableRecords;
            } else {
                for (var listIndex = 0; listIndex < vm.views.resultList.length; listIndex++) {
                    var result = vm.views.resultList[listIndex];
                    //cac_result结果表中的状态由'true','false','人工判断'和'规则未检查'四种状态
                    if (result.status == 'OK') {
                        result.flag = 'true';
                    } else if (result.status == 'FAILED') {
                        result.flag = 'false';
                    } else if (result.status == 'CHECK') {
                        result.flag = $translate.instant('cac.result.audit_result.check');
                    }
                    var key = result.hostKey + "-" + result.itemName;
                    hostRuleResultMap[key] = result;

                }
                console.log("Hosts size = " + vm.views.hosts.length);
                console.log("Rule size = " + vm.views.rules.length);
                for (var hIndex = 0; hIndex < vm.views.hosts.length; hIndex++) {

                    var host = vm.views.hosts[hIndex];
                    var record = {
                        hostKey: host.hostKey,
                        hostStatus: host.unreachable,
                        isUnreachable: (host.unreachable === 'UNREACHABLE' || host.unreachable === 'unreachable') && host.unreachable !== "SKIPPING",
                        isSkipping: host.unreachable === "SKIPPING",
                        rules: []
                    };
                    tableRecords.push(record);

                    var data_row = record.rules;

                    for (var rIndex = 0; rIndex < vm.views.rules.length; rIndex++) {
                        var rule = vm.views.rules[rIndex];

                        var rule_obj = {
                            hostKey: record.hostKey,
                            hostStatus: record.hostStatus
                        };

                        rule_obj.itemName = rule.itemName;
                        var key = host.hostKey + "-" + rule.itemName;
                        var result = hostRuleResultMap[key];
                        if (result) {
                            rule_obj.id = result.id;
                            rule_obj.flag = result.flag;
                        } else {
                            rule_obj.id = "";
                            rule_obj.flag = "-";

                        }
                        var flag = rule_obj.flag;

                        var skipping = $translate.instant('cac.result.audit_result.skipping');
                        rule_obj.class = flag == 'true' ? 'bg-success' : (flag == 'false' ? 'bg-danger' : (flag == $translate.instant('cac3.title.manualJudgment') ? 'bg-warning' : (flag == $translate.instant('cac3.title.inapplicable') ? 'cac-bg-grey' : 'bg-light')));
                        rule_obj.iconClass = flag == 'true' ? 'fa-check' : (flag == 'false' ? 'fa-times' : (flag == $translate.instant('cac3.title.manualJudgment') ? 'fa-exclamation' : (flag == $translate.instant('cac3.title.inapplicable') ? 'fa-minus' :  'fa-question')));
                        rule_obj.title = rule_obj.itemName;
                        data_row.push(rule_obj);
                    }
                }

                var finishTime = (new Date()).getTime();
                vm.views.data_table = tableRecords;
            }

        }

        function changeResultView() {
            if (vm.views.resultView === "list") {
                $state.go("app.cac3.check_result", {logId: vm.views.checkLog.id});
                vm.views.resultView = "outline";
            } else {
                $state.go("app.cac3.check_result.output", {logId: vm.views.checkLog.id});
                vm.views.resultView = "list";
            }
        }

        function clickResult(id, rule) {
            $timeout(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/cac/results/check-result-to-rule.html',
                    controller: 'CheckResultToRuleCtrl',
                    controllerAs: 'checkResultToRuleCtrlVm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: id,
                                name: rule.itemName,
                            };
                        }
                    }
                });
            }, 200);
        }

        //打开执行日志
        function showLog() {
            $uibModal.open({
                templateUrl: 'app/modules/cac/log/check-log-result.html',
                controller: 'CacCheckLogResultCtrl',
                controllerAs: 'cacCheckLogResultVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: vm.views.checkLog.taskId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

        function loadMore() {
            if (vm.views.hosts.length >= vm.views.length) {
                vm.views.start += vm.views.length;
                CheckResultService.getCheckResultsByJobId(logId, vm.views.start, vm.views.length).then(function (data) {
                    vm.views.results = data;
                    vm.views.hosts = vm.views.results.hosts;
                    if (vm.views.hosts.length > 0) {
                        vm.views.rules = vm.views.results.rules;
                        vm.views.resultList = vm.views.results.results;
                        $timeout(function () {
                            showTable();
                        });
                    }

                }).catch(function (err) {
                    throw err;
                });
            }
        }

        //将结果导出Excel
        function exportExcel(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/check-item-result/export/' + logId;//请求的URl
            var xhr = new XMLHttpRequest();//定义http请求对象
            xhr.open("GET", url, true);
            var token = currentUser.authToken;
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send();
            xhr.responseType = "blob";  // 返回类型blob
            xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                if (this.status === 200) {
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    $timeout(function () {
                        var d = new Date();
                        var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                        var a = document.createElement('a');
                        a.download =vm.views.checkLog.name+datetime+".xlsx";
                        a.href = reader.result;
                        $("body").append(a);
                        a.click();
                    }, 100);
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                }
            }
        }
    }

    //滚动指令
    cacModule.directive('whenScrolled', function () {
        return function (scope, elm, attr) {
            // 内层DIV的滚动加载
            var raw = elm[0];
            elm.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 5) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    });


})();

/**
 * @Auther: zml
 * @Date: 2018/7/19
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacCheckResultOutputListCtrl', CacCheckResultOutputListCtrl);
    CacCheckResultOutputListCtrl.$inject = ['$scope', '$timeout', 'CheckResultService', '$compile', '$uibModal', '$stateParams', '$translate','cacTemplateService','$state','messageService','CacFixLogService'];

    function CacCheckResultOutputListCtrl($scope, $timeout, CheckResultService , $compile, $uibModal, $stateParams, $translate,cacTemplateService,$state,messageService,CacFixLogService) {
        var vm = this;

        var logId = $stateParams.logId;
        vm.getCheckItemById =getCheckItemById;

        vm.fixSelectedIds = [];
        vm.runFix = runFix;

        function getCheckItemById(id,itemName) {
            $timeout(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/cac/results/check-result-to-rule.html',
                    controller: 'CheckResultToRuleCtrl',
                    controllerAs: 'checkResultToRuleCtrlVm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: id,
                                name: itemName,
                            };
                        }
                    }
                });
            }, 200);
        }

        function init() {

            var tableColumns = [
                {mData: 'hostKey', title: $translate.instant('cac.common.host')},
                {
                    mData: 'itemName',
                    title: $translate.instant('cac.template.detail.audit_params'),
                    render: function (data, type, row, meta) {
                        var checkItem = '';
                        if (row.itemName != null) {
                            checkItem = row.itemName;
                        }
                        var actionHtml = '<span title = "' + checkItem + '">' + checkItem + '</span>';
                        return actionHtml;
                    }

                },
                {
                    mData: 'fixPathIsNull', title: $translate.instant('cac3.title.fixScript'),
                    render: function (data, type, row, meta) {
                        if (row.fixPathIsNull) {
                            var actionHtml = '<span class="badge bg-secondary">{{\'cac3.title.thing\' | translate}}</span>';
                        } else  {
                            var actionHtml = '<span class="badge bg-info">{{\'cac3.title.have\' | translate}}</span>';
                        }
                        return actionHtml;
                    }
                },
                {
                    mData: 'status', title: $translate.instant('cac.common.result'),
                    render: function (data, type, row, meta) {
                        if (row.status == 'OK') {
                            var actionHtml = '<span class="badge bg-success">{{\'cac.result.audit_result.pass\' | translate}}</span>';
                        } else if (row.status == 'FAILED') {
                            var actionHtml = '<span class="badge bg-danger">{{\'cac.result.audit_result.failed\' | translate}}</span>';
                        } else if (row.status == 'CHECK') {
                            var actionHtml = '<span class="badge bg-warning">{{\'cac.result.audit_result.check\' | translate}}</span>';
                        } else {
                            var actionHtml = '<span class="label cac-bg-light-grey">{{\'common.messages.no_data\' | translate}}</span>';
                        }
                        return actionHtml;
                    }
                },
                {
                    mData: 'output',
                    title: $translate.instant('cac.result.output'),
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        var itemName = "'" + row.itemName + "'";
                        var actionHtml = "";
                        if (row.output == null || row.output == "") {
                            actionHtml = '<span ng-click="cacCheckResultOutputListCtrlVm.getCheckItemById(' + id + ',' + itemName + ')">{{\'common.term.none\' | translate}}</span>';
                        } else {
                            actionHtml = '<span ng-click="cacCheckResultOutputListCtrlVm.getCheckItemById(' + id + ',' + itemName + ')">' +
                                (row.output || '').substr(0, 100) +
                                '</span>';
                        }

                        return actionHtml;
                    }
                }

            ];


            vm.tableConfig = {
                data: [getPromise],
                columns: tableColumns,
                order: [[1, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: 'id', labelData: 'name', preselected: vm.fixSelectedIds, stateFn: function (row) {
                        if(row.status === "FAILED" && !row.fixPathIsNull){
                            return '';
                        }else{
                            return 'disabled';
                        }
                    }
                },
            }

            function getPromise() {
                return CheckResultService.getBylogIdAllData(logId);
            }

        }

        init();

        function runFix(){
            messageService.confirm($translate.instant('cac3.title.confirmExecution'),$translate.instant('cac3.title.performRepairTour'), function () {
                var threeFixLog ={};
                threeFixLog.logId =logId;
                threeFixLog.itemResultJson=angular.toJson(vm.fixSelectedIds);
                CacFixLogService.fixItemList(threeFixLog).then(function () {
                    $state.go('app.cac3.fix.list', null, {reload: true});
                }).catch(function (err) {
                    messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                    throw err;
                });
            });
        }

    }

})
();

/**
 * @Auther: zml
 * @Date: 2018/5/18
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CheckResultToRuleCtrl', CheckResultToRuleCtrl);
    CheckResultToRuleCtrl.$inject = ['$http', 'entity', '$timeout', 'cacService', '$uibModalInstance', 'dataTable', 'CheckResultService', '$translate'];

    function CheckResultToRuleCtrl($http, entity, $timeout, cacService, $uibModalInstance, dataTable, CheckResultService, $translate) {
        var vm = this;
        vm.views = {
            id: entity.id,
            checkItemName: entity.name,
            tableInstance: null,
            cancel: cancel
        };
        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
            if (vm.views.id) {
                CheckResultService.getByIdCheckResult(vm.views.id).then(function (data) {
                    vm.views.metricStatus = data.status;
                    vm.views.metricName = data.itemName;
                    vm.views.metricValue = data.output;
                    if (vm.views.metricStatus == 'OK') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.pass');
                        vm.views.metricStatusClass = "badge bg-success";
                    } else if (vm.views.metricStatus == 'CHECK') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.check');
                        vm.views.metricStatusClass = "badge bg-warning";
                    } else if (vm.views.metricStatus == 'SKIPPING') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.skipping');
                        vm.views.metricStatusClass = "badge bg-default";
                    } else if (vm.views.metricStatus == 'FAILED') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.failed');
                        vm.views.metricStatusClass = "badge bg-danger";
                    } else {
                        vm.views.metricStatus = $translate.instant('common.messages.no_data');
                        vm.views.metricStatusClass = "label cac-bg-light-grey";
                    }
                }).catch(function (err) {
                    throw err;
                });
            } else {
                vm.views.metricStatus = $translate.instant('common.messages.no_data');
                vm.views.metricStatusClass = "label cac-bg-light-grey";
                vm.views.metricName = vm.views.checkItemName;
            }

        }

        init();
    }

})
();
/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacFixLogService', CacFixLogService);

    CacFixLogService.$inject = ['restUtils','$q','$http'];

    function CacFixLogService(restUtils,$q,$http) {
        var MODULE = "cac";

        this.getAllFixItem =getAllFixItem;
        this.fixItemList =fixItemList;
        this.getByFixLogIdAllData =getByFixLogIdAllData;

        function getAllFixItem() {
            return restUtils.callApi(MODULE, 'GET','/api/cac/v3/fix-item', null);
        }

        function fixItemList(list) {
            return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/fix-log/run', null, list);
        }


        function getByFixLogIdAllData(fixLogId) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/fix-item-result/v3/{fixLogId}', {fixLogId: fixLogId});
        }




    }


})();


(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检任务************************************************/
            .state('app.cac3.fix', {
                url: '/fix',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/fix/fix-log-index.html',
                        controller: 'CacFixLogController',
                        controllerAs: 'cacFixLogCtrlVm'
                    }
                }

            })
            .state('app.cac3.fix.list', {
                url: '/fix-list',
                views: {
                    'fixView': {
                        templateUrl: 'app/modules/cac/fix/fix-log-list.html',
                        controller: 'CacFixLogListController',
                        controllerAs: 'cacFixLogListCtrlVm'
                    }
                }

            })
        ;
    }])
    ;
})
();

(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacFixLogController', CacFixLogController);
    CacFixLogController.$inject = [];

    function CacFixLogController() {

    }

    //模型控制器
    cacModule.controller('CacFixLogListController', CacFixLogListController);
    CacFixLogListController.$inject = ['$q', '$scope', '$http', '$timeout', '$state', '$uibModal', '$filter', '$translate','CacFixLogService'];

    function CacFixLogListController($q, $scope, $http, $timeout, $state, $uibModal, $filter, $translate,CacFixLogService) {
        var vm = this;
        vm.scope = $scope;

        vm.findFixLogStatus = findFixLogStatus;
        vm.fixDataShow =fixDataShow;


        var columnDefs = [
            {
                data: 'name',
                title: $translate.instant('common.entity.detail.name')
            },
            {
                data: 'hostJson',
                title: $translate.instant('cac3.table_fields.repairItems'),
                render: function (data, type, row, meta) {
                    var fix = angular.fromJson(row.itemResultJson);
                    var html = '{{\'cac3.table_fields.repairItems\' | translate}}: <strong>' + fix.length + '</strong>' +
                        '<br/>';
                    return '<span class="cac_table_col_project" style="line-height: 15px!important;">' + html + '</span>';
                }
            },
            {
                data: 'createdAt',
                title: $translate.instant('common.entity.detail.start_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'endAt',
                title: $translate.instant('common.entity.detail.end_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.endAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'createdBy',
                title: $translate.instant('cac.job.detail.create_at'),
            },
            {
                data: 'id',
                title: $translate.instant('cac.job.detail.status'),
                render: function (data, type, row, meta) {
                    var taskId = "'" + row.taskId + "'";
                    var status = row.status;
                    var actionHtml = "";
                    if (status === "ERROR") {
                        actionHtml = '<button type="button" class="btn btn-danger rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacFixLogListCtrlVm.findFixLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.error\' | translate}}</button>';
                    } else if (status === "SUCCESS") {
                        actionHtml = '<button type="button" class="btn btn-success rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacFixLogListCtrlVm.findFixLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.ok\' | translate}}</button>';
                    } else {
                        actionHtml = '<button type="button" class="btn btn-primary rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacFixLogListCtrlVm.findFixLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.running\' | translate}}</button>';
                    }
                    return actionHtml;
                }
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var isEnbled = '';
                    if (row.status !== "SUCCESS") {
                        isEnbled = 'disabled';
                    }
                    return '<button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ng-click="cacFixLogListCtrlVm.fixDataShow(\'' + row.id + '\')"><i class="fa fa-grip-horizontal"></i></button>';
                }
            }
        ];
        this.tableConfig = {
            columns: columnDefs,
            data: [getPromise],
            order: [[2, 'desc']],
            buttons: ['reload']
        };

        function getPromise() {
            return CacFixLogService.getAllFixItem();
        }

        function findFixLogStatus(taskId) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/fix/fix-log-result.html',
                controller: 'CacFixLogResultCtrl',
                controllerAs: 'cacFixLogResultVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: taskId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

        function fixDataShow(fixLogId){
            $uibModal.open({
                templateUrl: 'app/modules/cac/fix/fix-data-show.html',
                controller: 'FixDataShowController',
                controllerAs: 'fixDataShowControllerVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    fix: function () {
                        return {
                            fixLogId: fixLogId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

    }
})
();

/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacFixLogResultCtrl', CacFixLogResultCtrl);
    CacFixLogResultCtrl.$inject = ['params', '$uibModalInstance'];

    function CacFixLogResultCtrl(params, $uibModalInstance) {
        var that = this;

        that.runId = params.jobId;
        this.cancel = cancel;

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

    }
})
();

/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').controller('FixDataShowController', FixDataShowController);

    FixDataShowController.$inject = ['$scope', '$state', 'messageService','CacFixLogService','$translate','fix','$uibModalInstance'];

    function FixDataShowController($scope, $state, messageService,CacFixLogService,$translate,fix,$uibModalInstance) {
        var that = this;
        that.fixLogId=fix.fixLogId;

        init();
        this.cancel = cancel;

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
           var tableColumns = [
               {mData: 'hostKey', title: $translate.instant('cac.common.host')},
               {
                   mData: 'fixName',
                   title: $translate.instant('cac3.table_fields.repairItemName'),
                   render: function (data, type, row, meta) {
                       var checkItem = '';
                       if (row.fixName != null) {
                           checkItem = row.fixName;
                       }
                       var actionHtml = '<span title = "' + checkItem + '">' + checkItem + '</span>';
                       return actionHtml;
                   }

               },
               {
                   mData: 'status', title: $translate.instant('cac.common.result'),
                   render: function (data, type, row, meta) {
                       if (row.status == 'OK') {
                           var actionHtml = '<span class="badge bg-success">{{\'cac.result.audit_result.pass\' | translate}}</span>';
                       } else if (row.status == 'FAILED') {
                           var actionHtml = '<span class="badge bg-danger">{{\'cac.result.audit_result.failed\' | translate}}</span>';
                       } else {
                           var actionHtml = '<span class="label cac-bg-light-grey">{{\'common.messages.no_data\' | translate}}</span>';
                       }
                       return actionHtml;
                   }
               },
               {mData: 'output', title: $translate.instant('cac.result.output')},
            ];

            that.tableConfig = {
                data: [getPromise],
                columns: tableColumns,
                order: [[0, 'desc']],
                buttons: ['reload']
            }

            function getPromise() {
               return CacFixLogService.getByFixLogIdAllData(that.fixLogId);
            }
        }
    }
})();


(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.export', {
                url: '/export',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/exports/asset-configure.html',
                        controller: 'CacAssetConfigureController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.export.list', {
                url: '/list',
                views: {
                    'configure-view': {
                        templateUrl: 'app/modules/cac/exports/asset-configure-export.html',
                        controller: 'CacAssetConfigureExportController',
                        controllerAs: 'vm'
                    }
                }
            })

        ;
    }])
    ;
})
();

/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacAssetConfigureExportService', CacAssetConfigureExportService);

    CacAssetConfigureExportService.$inject = ['restUtils'];

    function CacAssetConfigureExportService(restUtils) {
        var module = "cac";

        this.saveAssetConfigureData =saveAssetConfigureData;
        this.getAssetConfigureTypes=getAssetConfigureTypes;
        this.getAssetConfigureData =getAssetConfigureData;

        function saveAssetConfigureData(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v3/save/asssets-configure-data',null,data);

        }

        function getAssetConfigureTypes() {
            return restUtils.callApi(module, 'POST', '/api/cac/v3/get/asssets-configure-types', null, null);
        }

        function getAssetConfigureData(){
            return restUtils.callApi(module, 'POST', '/api/cac/v3/get/asssets-configure-data', null, null);
        }

    }

})();

(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacAssetConfigureController', CacAssetConfigureController);
    CacAssetConfigureController.$inject = ['$scope','$state','messageService','$http','$stateParams'];

    function CacAssetConfigureController($scope, $state,messageService, $http, $stateParams) {
    }
})
();


(function () {
    angular.module('oplus.cac').controller('CacAssetConfigureExportController', CacAssetConfigureExportController);

    CacAssetConfigureExportController.$inject = ['$scope', '$timeout', '$state', 'CacAssetConfigureExportService','$http', 'messageService', 'currentUser', '$translate'];


    function CacAssetConfigureExportController($scope, $timeout, $state, CacAssetConfigureExportService,$http, messageService, currentUser, $translate) {
        var vm = this;
        vm.assetsModelTypes = [];//资产模板类型
        vm.assetsModelData ={};
        vm.choice_data=choice_data;

        getAssetModel();//初始化
        function getAssetModel(){
            CacAssetConfigureExportService.getAssetConfigureTypes().then(function (data) {
                if(Object.keys(data).length > 0){
                    for (var key in data) {
                        vm.assetsModelTypes.push(key);
                        vm.assetsModelData[key] = data[key];
                    }
                    getSelectAssetModel();
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
            });
        }

        function getSelectAssetModel(){//获取点击过的数据并回显
            CacAssetConfigureExportService.getAssetConfigureData().then(function (data) {
                if(Object.keys(data).length > 0){
                    for (var key in data) {
                       if(!vm.assetsModelData[key]){
                           continue;
                       }
                       for (var i =0 ; i < vm.assetsModelData[key].length ;i++){
                           for (var j = 0 ; j < data[key].length ;j++){
                               if(vm.assetsModelData[key][i].code == data[key][j].code){
                                   vm.assetsModelData[key][i].isChecked=true
                                   break;
                               }
                           }
                       }
                    }

                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
            });
        }




        function choice_data(modelData){//保存数据
            CacAssetConfigureExportService.saveAssetConfigureData(modelData).then(function () {
                console.log("save==",modelData);
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
            });
        }

    }
})
();
