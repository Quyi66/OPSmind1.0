/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/13.
 */

(function () {
    angular.module('oplus.adm', []);
})();

/**
 * @author wuqiang@famessoft.com , created on 2020-08-07.
 */
(function () {
    'use strict';

    angular.module('oplus.adm').config(['$stateProvider',
        function ($stateProvider) {
            configRoutes($stateProvider);
        }]);

    function configRoutes($stateProvider) {
        $stateProvider
            .state('app.adm', {
                url: '/adm',
                views: {
                    'mainView': {
                        template: '<div ui-view="adm_main_view" class="w-100 h-100"></div>',
                    }
                }
            })
            .state('app.adm.config', {
                url: '/config',
                views: {
                    'adm_main_view': {
                        templateUrl: 'app/modules/adm/config-index.html',
                        controller: 'admCtrl',
                        controllerAs: 'admVm'
                    }
                }
            })
        ;
    }
})();

/**
 *
 * @author wuqiang@famessoft.com , created on 2020-08-07.
 */
(function () {
    'use strict';

    angular.module('oplus.adm').controller('admCtrl', admCtrl);

    admCtrl.$inject = ['tenantUtil'];

    function admCtrl(tenantUtil) {
        var vm = this;

        vm.isOplusAdminUI = tenantUtil.isOplusAdminUI();
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig ($stateProvider) {
        $stateProvider.state('admin', {
            abstract: true,
            parent: 'app',
            url: '/admin'
        });
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/5/20, created
 */
(function () {
    'use strict';
    angular.module('oplus.adm').component('sysinfo', {
        templateUrl: 'app/modules/adm/sysinfo.html',
        controller: ['$http','licenseService','messageService', SysinfoCtrl],
        bindings: {
            hideLogo: '<'
        }
    });

    /**
     * @ngdoc component
     * @name sysinfo
     * @description
     * Display system information like version of modules.
     * ```html
     * <sysinfo/>
     * ```
     * @param {$http} $http
     */
    function SysinfoCtrl($http,licenseService,messageService) {
        var that = this;
        that.hideLogo = that.hideLogo || false;
        that.msg = "";
        that.isEnableLicense = false;
        that.register = register;

        that.ngf = {
            pattern: '', maxSize: '1MB'
        };

        that.fileInfo = {};


        this.$onInit = function () {
            initLicense();
            fetchVersion();
        }

        function fetchVersion() {

            fetchViewVersion();

            fetchServerVersion();

            function fetchViewVersion() {
                $http.get('app/modules/VERSION.json').then(function (res) {
                    var version = res.data;
                    var versions = version.versions;
                    var builds = version.builds;
                    var result = [];
                    Object.keys(versions).forEach(function (module) {
                        result.push({module: module, version: versions[module], build: builds[module]});
                    });
                    that.viewVersions = _.sortBy(result, ['module']);
                });
            }

            function fetchServerVersion() {
                var result = [];
                $http.get(window.$oplus.appConfig.apiBaseUrls.com + '/api/com/oplus/version').then(
                    function (res) {
                        pushServerVersions(result, res.data);
                        $http.get(window.$oplus.appConfig.apiBaseUrls.dts + '/api/dts/oplus/version').then(
                            function (res) {
                                pushServerVersions(result, res.data);
                                $http.get(window.$oplus.appConfig.apiBaseUrls.portal + '/api/portal/oplus/version').then(
                                    function (res) {
                                        pushServerVersions(result, res.data);
                                        that.serverVersions = result;
                                       // console.log("serverVersions", that.serverVersions);
                                    }
                                );
                            }
                        );
                    }
                );
            }

            function pushServerVersions(result, versions) {
                angular.forEach(versions, function (module) {
                    if (module.projectName && !_.find(result, {projectName: module.projectName})) {
                        result.push(module);
                    }
                });
            }

        }


        function initLicense() {
            licenseService.isEnabled().then(function (data){
                that.isEnableLicense = data;
                if(that.isEnableLicense) {
                    licenseService.license().then(function (data){
                        that.license = data;
                    },function (error){

                    });
                }
            })
        }

        function register() {
            licenseService.register(that.fileInfo.file).then(function (data) {
                messageService.toast("success", "激活码已更新！");
                that.msg = "";
                initLicense();
            },function (error) {
                that.msg = error.title;
            });
        }


    }
})();

(function () {
    'use strict';

    angular.module('oplus.adm').controller('TenantExportCtrl', TenantExportCtrl);

    TenantExportCtrl.$inject = ['$scope', '$timeout', 'Tenant', '$uibModalInstance', 'entity', 'handleType'];
    function TenantExportCtrl($scope, $timeout, Tenant, $uibModalInstance, entity, handleType) {
        var vm = this;
        $scope.displayTree = false;
        vm.doExport = doExport;
        vm.cancelImport = cancelImport;
        vm.tenantConfigs = {};
        vm.allConfigMap = {};
        vm.views = {
            tenantDTO: {},
            udpAppletList: [],
            udpPageList: [],
            dtsDatasetList: [],
            jaoJobDefinitionList: []
        };


        function doExport() {
            var tree = $("#tenantConfigExportTree").fancytree("getTree");
            var selNodes = tree.getSelectedNodes();
            if (selNodes) {
                var selectNodes = [];
                for (var i in selNodes) {
                    var nodeName = selNodes[i];
                    //console.log("nodeName : ", nodeName);
                    if (nodeName.type != "folder") {
                        var parentNode = nodeName.parent;
                        var parentNodeName = parentNode.title;
                        if (parentNodeName == "Page") {
                            vm.views.udpPageList.push(nodeName.data.value)
                        } else if (parentNodeName == "Applet") {
                            vm.views.udpAppletList.push(nodeName.data.value)
                        } else if (parentNodeName == "DTS") {
                            vm.views.dtsDatasetList.push(nodeName.data.value)
                        } else {
                            vm.views.jaoJobDefinitionList.push(nodeName.data.value)
                        }
                    }
                }
            }
            if(handleType === 1){
                //console.log("vm.views: ", vm.views);
                Tenant.exportConfigAnalysis(vm.views).then(function (result) {
                    Tenant.exportPages(result);
                    $uibModalInstance.close();
                }).catch(function (err) {
                    throw err;
                });
            }else{
                //console.log("vm.views: ", vm.views);
                Tenant.exportConfigRelation(vm.views).then(function (result) {
                    Tenant.exportPages(result);
                    $uibModalInstance.close();
                }).catch(function (err) {
                    throw err;
                });
            }

        }


        var treeOption = {
            checkbox: true,
            extensions: ["glyph", "wide", "filter"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome5",
                map: {
                    folder: "far fa-folder",
                    folderOpen: "far fa-folder-open",
                    doc: "far fa-file",
                    docOpen: "far fa-file"
                }
            }
        };


        //嵌套转换
        function convertDataToFancyTreeNode(rawNodeList) {
            var nodeList = [];
            for (var i in rawNodeList) {
                var rawNode = rawNodeList[i];
                var node = {
                    key: rawNode.id,
                    id: rawNode.id,
                    type: rawNode.type,
                    selected: false,
                    title: rawNode.name,
                    value: rawNode.value
                };

                if (handleType === 2) {

                    if (rawNode.isRoot || rawNode.id === "Applet") {
                        if (rawNode.type == "folder") {
                            node.folder = true;
                            node.expanded = false;
                            if (rawNode.children != null && rawNode.children.length > 0) {
                                node.children = convertDataToFancyTreeNode(rawNode.children);
                            }
                        }
                    }
                    if(rawNode.id !== "Page" && rawNode.id !=="DTS" && rawNode.id  !=="Job"){
                        nodeList.push(node);
                    }
                } else {
                    nodeList.push(node);
                    if (rawNode.type == "folder") {
                        node.folder = true;
                        node.expanded = false;
                        if (rawNode.children != null && rawNode.children.length > 0) {
                            node.children = convertDataToFancyTreeNode(rawNode.children);
                        }
                    }
                }


            }
            return nodeList;
        }

        function cancelImport() {
            $uibModalInstance.dismiss();
        }


        function initTree() {
            $timeout(function () {
                vm.tenantConfigs = entity;
                vm.views.tenantDTO = vm.tenantConfigs.tenantDTO;
                treeOption.source = convertDataToFancyTreeNode(vm.tenantConfigs);
                if (treeOption.source.length > 0) {
                    $scope.displayTree = true;
                }
                $("#tenantConfigExportTree").fancytree(treeOption);
            });
        }

        initTree()
    }
})();

(function () {
    'use strict';

    angular.module('oplus.adm').controller('TenantImportCtrl', TenantImportCtrl);

    TenantImportCtrl.$inject = ['$scope', '$timeout', 'pageService', '$window', 'Tenant', 'messageService', '$translate'];
    function TenantImportCtrl($scope, $timeout, pageService, $window, Tenant, messageService, $translate) {
        var vm = this;
        $scope.displayTree = false;
        $scope.displayImport = false;

        vm.doImport = doImport;
        vm.parseFile = parseFile;
        vm.selectedFile = {};
        vm.tenantConfigs = {};

        vm.views = {
            name: null,
            title: null,
            update: 0,
            type: null,
            tenantDTO: null,
            udpAppletList: [],
            udpPageList: [],
            dtsDatasetList: [],
            jaoJobDefinitionList: []
        };
        vm.types = [
            {
                label: "系统自动识别组件关系导入",
                value: "2"
            }, {
                label: "根据关联关系导入",
                value: "1"
            }
        ];


        function doImport() {
            var tree = $("#tenantConfigTree").fancytree("getTree");
            var selNodes = tree.getSelectedNodes();
            //Todo 设定当操作类型为根据关系导入时候，无法导入单个组件(page, job, dts)
            if (selNodes) {
                var selectNodes = [];
                for (var i in selNodes) {
                    var nodeName = selNodes[i];
                    if (nodeName.type != "folder") {
                        var parentNode = nodeName.parent;
                        var parentNodeName = parentNode.title;
                        if (parentNodeName == "Page") {
                            vm.views.udpPageList.push(nodeName.data.value)
                        } else if (parentNodeName == "Applet") {
                            vm.views.udpAppletList.push(nodeName.data.value)
                        } else if (parentNodeName == "DTS") {
                            vm.views.dtsDatasetList.push(nodeName.data.value)
                        } else {
                            vm.views.jaoJobDefinitionList.push(nodeName.data.value)
                        }
                    }
                }
            }
            if (vm.views.type.value === "1") {
                Tenant.importPagesRelation(vm.views).then(function (result) {
                    messageService.toast("success", $translate.instant("adm.content.data_import_success"));
                }).catch(function (err) {
                    messageService.toast("error", $translate.instant("adm.content.data_import_error"));
                });
            } else {
                Tenant.importPagesAnalysis(vm.views).then(function (result) {
                    messageService.toast("success", $translate.instant("adm.content.data_import_success"));
                }).catch(function (err) {
                    messageService.toast("error", $translate.instant("adm.content.data_import_error"));
                });
            }

        }


        var treeOption = {
            checkbox: true,
            extensions: ["glyph", "wide", "filter"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome5",
                map: {
                    folder: "far fa-folder",
                    folderOpen: "far fa-folder-open",
                    doc: "far fa-file",
                    docOpen: "far fa-file"
                }
            },
            select: function (event, data) {//选择或取消选择
                $scope.displayImport = data.node.selected;
                //强制生效双向绑定
                $scope.$apply();
            }
        };


        //嵌套转换
        function convertDataToFancyTreeNode(rawNodeList) {
            var nodeList = [];
            for (var i in rawNodeList) {
                var rawNode = rawNodeList[i];
                var node = {
                    key: rawNode.id,
                    id: rawNode.id,
                    type: rawNode.type,
                    selected: false,
                    title: rawNode.name,
                    value: rawNode.value
                };
                nodeList.push(node);
                if (rawNode.type == "folder") {
                    node.folder = true;
                    node.expanded = false;
                    if (rawNode.children != null && rawNode.children.length > 0) {
                        node.children = convertDataToFancyTreeNode(rawNode.children);
                    }
                }
            }
            return nodeList;
        }


        var tree;

        function parseFile(file) {
            vm.selectedFile = file;
            var reader = new $window.FileReader();
            reader.onload = function (ev) {
                $timeout(function () {
                    var content = ev.target.result;
                    vm.tenantConfigs = pageService.parseExportFile(content);
                    treeOption.source = convertDataToFancyTreeNode(vm.tenantConfigs);
                    if (treeOption.source.length > 0) {
                        $scope.displayTree = true;
                    }
                    if (tree) {
                        tree = $("#tenantConfigTree").fancytree("getTree");
                        tree.options.source = treeOption.source;
                        tree.reload();
                    } else {
                        tree = $("#tenantConfigTree").fancytree(treeOption);
                    }
                });

            };
            reader.readAsText(file);
        }

        //console.log("vm.types : ", vm.types);
        function init() {
            Tenant.findAllTenantConfigs().then(function (result) {
                //console.log(result)
                vm.tenants = result;
            }).catch(function (err) {
                throw err;
            });
        }

        init();
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('TenantDialogController', TenantDialogController);

    TenantDialogController.$inject = ['$scope', '$state', '$timeout', 'entity', 'Tenant', 'messageService'];

    function TenantDialogController($scope, $state, $timeout, entity, Tenant, messageService) {
        var vm = this;

        vm.tenant = entity;
        vm.clear = clear;
        vm.save = save;
        vm.onAddUser = onAddUser;

        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();
        });

        function init() {
        }

        init();

        function clear() {
            $state.go('^', {}, {reload: true});
        }

        function save() {

            vm.isSaving = true;

            if (vm.tenant.id !== null) {
                Tenant.update(vm.tenant, onSaveSuccess, onSaveError);
            } else {
                Tenant.save(vm.tenant, onSaveSuccess, onSaveError);
            }
        }

        /**
         * when linked use to tenant
         * @param users array or null(cancel)
         */
        function onAddUser(users) {
            if (users) {
                //notify component of user list to refresh
                $scope.$broadcast('TENANT-USER:LINKED');
            }
        }

        function onSaveSuccess(result) {
            vm.isSaving = false;
            $state.go('^', {}, {reload: true});
        }

        function onSaveError(e) {
            vm.isSaving = false;
            var message = (e && e.data) ? e.data.title : JSON.stringify(e);
            messageService.confirm('保存失败', message);
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('TenantDetailController', TenantDetailController);

    TenantDetailController.$inject = ['$scope', '$rootScope', '$filter', 'previousState', 'entity'];

    function TenantDetailController($scope, $rootScope, $filter, previousState, entity) {
        var vm = this;

        vm.tenant = entity;
        vm.previousState = previousState.name;
        // vm.tenant.configJson = $filter('json')(vm.tenant.config);


        var unsubscribe = $rootScope.$on('oplusApp:tenantUpdate', function (event, result) {
            vm.tenant = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('TenantDeleteController', TenantDeleteController);

    TenantDeleteController.$inject = ['$uibModalInstance', 'entity', 'Tenant', 'messageService'];

    function TenantDeleteController($uibModalInstance, entity, Tenant, messageService) {
        var vm = this;

        vm.tenant = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            //console.log("Delete id = " + id);
            Tenant.delete({id: id},
                function () {
                    messageService.toast("success", "删除成功");
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "此租户关联其它资源，删除失败!");
                });
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('tenant', {
                parent: 'admin',
                url: '/tenant',
                data: {
                    authorities: [],
                    pageTitle: 'tenant.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/tenant/tenants.html',
                        controller: 'TenantController',
                        controllerAs: 'tenantVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('tenant');
                    //     $translatePartialLoader.addPart('global');
                    //     $translatePartialLoader.addPart('user-management');
                    //     return $translate.refresh();
                    // }]
                }
            })
            // .state('tenant.detail', {
            //     url: '/{id}',
            //     data: {
            //         authorities: [],
            //         pageTitle: 'tenant.detail.title'
            //     },
            //     views: {
            //         'content@': {
            //             templateUrl: 'app/modules/adm/tenant/tenant-detail.html',
            //             controller: 'TenantDetailController',
            //             controllerAs: 'vm'
            //         }
            //     },
            //     resolve: {
            //         translatePartialLoader: ['$translate', function ($translate) {
            //             $translatePartialLoader.addPart('tenant');
            //             return $translate.refresh();
            //         }],
            //         entity: ['$stateParams', 'Tenant', function ($stateParams, Tenant) {
            //             return Tenant.get({id: $stateParams.id}).$promise;
            //         }],
            //         previousState: ["$state", function ($state) {
            //             var currentStateData = {
            //                 name: $state.current.name || 'tenant',
            //                 params: $state.params,
            //                 url: $state.href($state.current.name, $state.params)
            //             };
            //             return currentStateData;
            //         }]
            //     }
            // })
            .state('tenant.edit', {
                url: '/{id}/edit',
                data: {
                    authorities: []
                },
                views: {
                    'tenant': {
                        templateUrl: 'app/modules/adm/tenant/tenant-dialog.html',
                        controller: 'TenantDialogController',
                        controllerAs: 'tenantEditVm'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'Tenant', function ($stateParams, Tenant) {
                        return Tenant.get({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('tenant.new', {
                url: '/new',
                data: {
                    authorities: []
                },
                views: {
                    'tenant': {
                        templateUrl: 'app/modules/adm/tenant/tenant-dialog.html',
                        controller: 'TenantDialogController',
                        controllerAs: 'tenantEditVm'
                    }
                },
                resolve: {
                    entity: function () {
                        return {
                            name: null,
                            code: null,
                            description: null,
                            accessToken: null,
                            id: null
                        };
                    }
                }
            })
            .state('tenant.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/tenant/tenant-delete-dialog.html',
                        controller: 'TenantDeleteController',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            entity: ['Tenant', function (Tenant) {
                                return Tenant.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('tenant', null, {reload: 'tenant'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('tenant.tenant_import', {
                url:'/import',
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/tenant/tenant-import.html',
                        controller: 'TenantImportCtrl',
                        controllerAs: '$import'
                    }
                }
            });;
    }

})();

(function () {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Tenant', Tenant);

    Tenant.$inject = ['$resource', 'currentUser','restUtils','$http'];

    function Tenant($resource, currentUser,restUtils,$http) {
        var resourceUrl = 'api/tenants/:id';

        var service = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': {method: 'PUT'}
        });



        service.exportConfigRelation = function(obj) {
            return restUtils.callApi('adm', 'POST', '/api/adm/tenant-config/export/relation', null, obj);
        }

        service.exportConfigAnalysis = function(obj) {
            return restUtils.callApi('adm', 'POST', '/api/adm/tenant-config/export/analysis', null, obj);
        }

        service.importPagesRelation = function(obj) {
            return restUtils.callApi('adm', 'POST', '/api/adm/tenant-config/import/relation', null, obj);
        }

        service.importPagesAnalysis = function(obj) {
            return restUtils.callApi('adm', 'POST', '/api/adm/tenant-config/import/analysis', null, obj);
        }

        service.findAllTenantConfigs = function() {
            return restUtils.callApi('adm', 'GET', '/api/adm/tenant-configs');
        }

        service.findTenantConfigsById = function (id) {
            return restUtils.callApi('adm', 'GET', '/api/adm/tenant-config/tree/{id}', {id: id});
        }

        service.exportPages = function(tenantConfig) {
            var blob = new Blob([angular.toJson(tenantConfig)], {type: 'text/plain;charset=utf-8'});
            return saveAs(blob, 'oplus-tenant-config.json');
        }
        return service;

    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('TenantController', TenantController);

    TenantController.$inject = ['$scope', '$timeout', '$compile', 'Tenant', 'messageService', 'dataTable','$q','$translate','$uibModal'];

    function TenantController($scope, $timeout, $compile, Tenant, messageService, dataTable,$q,$translate,$uibModal) {

        var vm = this;
        vm.exportPages = exportPages;

        /*(function initTenants() {
            Tenant.query({}, function (result, headers) {
                // console.log("Tenant.query result = " + JSON.stringify(result));
                dataTable.initTable(".tenant-table", tableColumnConfig, result);
            }, function onError(error) {
                messageService.alertError("Query tenant fail.", error.data.message);
            });
        })();*/
        function exportPages(id, type) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'app/modules/adm/tenant/tenant-export.html',
                controller: 'TenantExportCtrl',
                controllerAs: '$export',
                size: 'md',
                resolve: {
                    entity: function () {
                        return Tenant.findTenantConfigsById(id);
                    },
                    handleType: function(){
                        return type;
                    }
                }
            });
            modalInstance.result.then(function () {
                console.info('Modal close ' + new Date());
            }, function (err) {
                //throw err;
            });
        }

        var tableColumnConfig = [
            {mData: 'accessToken', title: 'Access Token'},
            {mData: 'name', title: '名称'},
            {mData: 'code', title: '编码'},
            {mData: 'userCount', title: '用户数', class: 'text-center'},
            {mData: 'description', title: '描述'},
            {
                mData: 'id', title: '操作',
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var id = "'" + row.id + "'";
                    var param = angular.toJson({id: row.id});
                    return '<div class="btn-group" uaa-has-permission="sysadmin:tenant:*">' +
                            ' <button type="button" ng-click="tenantVm.exportPages(' + id + ', 1)" class="btn btn-default btn-sm"  title="' + $translate.instant("adm.content.analysis_export") + '">' +
                            '   <i class="fa fa-angle-double-down"></i>' +
                            ' </button>&nbsp;' +
                            '  <button type="button" ng-click="tenantVm.exportPages(' + id + ', 2)" class="btn btn-default btn-sm"  title="' + $translate.instant("adm.content.analysis_export") + '">' +
                            '   <i class="fa fa-sort-amount-down-alt"></i>' +
                            ' </button>&nbsp;&nbsp;' +
                            ' <button type="submit" ui-sref=tenant.edit(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                            ' </button>&nbsp;' +
                            ' <button type="submit" ui-sref=tenant.delete(' + param + ') class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                            ' </button>' +
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
            var deferred = $q.defer();
            Tenant.query(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }
    }
})();

/**
 * @author yangbin@famessoft.com, created on 2020/09/10
 */
(function () {
    'use strict';

    /**
     * @ngdoc
     * @private
     */
    angular.module('oplus.adm').service('tenantConfigDao', tenantConfigDao);

    tenantConfigDao.$inject = ['$http', 'restUtils'];

    /**
     * DAO for remote database
     * @param $http
     * @param restUtils {restUtils}
     */
    function tenantConfigDao($http, restUtils) {

        var module = "adm";

        this.exportPages = exportPages;
        this.exportConfigRelation = exportConfigRelation;
        this.exportConfigAnalysis = exportConfigAnalysis;
        this.importPagesRelation = importPagesRelation;
        this.importPagesAnalysis = importPagesAnalysis;
        this.findTenantConfigsById = findTenantConfigsById;
        this.findAllTenantConfigs = findAllTenantConfigs;

        function importPagesRelation(obj) {
            return restUtils.callApi(module, 'POST', '/api/adm/tenant-config/import/relation', null, obj);
        }

        function importPagesAnalysis(obj) {
            return restUtils.callApi(module, 'POST', '/api/adm/tenant-config/import/analysis', null, obj);
        }


        function findTenantConfigsById(id) {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-config/tree/{id}', {id: id});
        }

        function findAllTenantConfigs() {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-configs');
        }

        function exportConfigRelation(obj) {
            return restUtils.callApi(module, 'POST', '/api/adm/tenant-config/export/relation', null, obj);
        }

        function exportConfigAnalysis(obj) {
            return restUtils.callApi(module, 'POST', '/api/adm/tenant-config/export/analysis', null, obj);
        }

        function exportPages(tenantConfig) {
            var blob = new Blob([angular.toJson(tenantConfig)], {type: 'text/plain;charset=utf-8'});
            return saveAs(blob, 'oplus-tenant-config.json');
        }


    }
})();

/**
 * @author yangbin
 */
(function () {
    'use strict';
    angular.module('oplus.adm').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('tenantConfig', {
                parent: 'admin',
                url: '/tenant-config',
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/tenant-config/tenant-config-index.html',
                        controller: 'AdmTenantConfigCtrl',
                        controllerAs: 'admTenantConfigVm'
                    }
                }
            })
            .state('tenantConfig.tenant_import', {
                url:'/tenant-config/import',
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/tenant-config/tenant-config-import.html',
                        controller: 'TenantConfigImportCtrl',
                        controllerAs: '$import'
                    }
                }
            });
    }]);
})();

/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/10
 */
(function () {
    'use strict';

    angular.module('oplus.adm').service('tenantConfigService', tenantConfigService);


    tenantConfigService.$inject = ['tenantConfigDao'];

    /**
     * Service for param
     * @param tenantConfigDao {localDaoFactory}
     * @param $q
     * @param restUtils {restUtils}
     */
    function tenantConfigService(tenantConfigDao) {
        this.exportConfigRelation = tenantConfigDao.exportConfigRelation;
        this.exportConfigAnalysis = tenantConfigDao.exportConfigAnalysis;
        this.exportPages = tenantConfigDao.exportPages;
        this.importPagesRelation = tenantConfigDao.importPagesRelation;
        this.importPagesAnalysis = tenantConfigDao.importPagesAnalysis;
        this.findTenantConfigsById = tenantConfigDao.findTenantConfigsById;
        this.findAllTenantConfigs = tenantConfigDao.findAllTenantConfigs;
        this.exportConfig = tenantConfigDao.exportConfig;

    }

})();


(function () {
    'use strict';

    angular.module('oplus.adm').controller('AdmTenantConfigCtrl', AdmTenantConfigCtrl);

    AdmTenantConfigCtrl.$inject = ['$scope', '$uibModal', '$compile', 'dataTable', 'tenantConfigService', '$translate','$http','$q'];
    function AdmTenantConfigCtrl($scope, $uibModal, $compile, dataTable, tenantConfigService, $translate,$http,$q) {
        var vm = this;
        vm.exportPages = exportPages;

        function exportPages(id, type) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'app/modules/adm/tenant-config/tenant-config-export.html',
                controller: 'TenantConfigExportCtrl',
                controllerAs: '$export',
                size: 'md',
                resolve: {
                    entity: function () {
                        return tenantConfigService.findTenantConfigsById(id);
                    },
                    handleType: function(){
                        return type;
                    }
                }
            });
            modalInstance.result.then(function () {
                console.info('Modal close ' + new Date());
            }, function (err) {
                //throw err;
            });
        }

        var tableOption = {
            aoColumns: [
                //{mData: 'accessToken', title: 'Access Token'},
                {mData: 'name', title: $translate.instant("common.entity.detail.name")},
                {mData: 'code', title: $translate.instant("adm.content.code")},
                {mData: 'description', title: $translate.instant("common.entity.detail.description")},
                {
                    mData: 'id',
                    title: $translate.instant("common.entity.detail.operation"),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        var actionHtml =
                            '<span>' +
                            '<a uaa-has-permission="sysadmin:tenant:*" class="btn btn-default btn-sm"  title="' + $translate.instant("adm.content.analysis_export") + '" ' +
                            ' ng-click="admTenantConfigVm.exportPages(' + id + ', 1)">' +
                            '<i class="fa fa-angle-double-down"></i>' +
                            '</a></span>' +
                            '<span  style="padding-left: 5px" >' +
                            '<a uaa-has-permission="sysadmin:tenant:*" class="btn btn-default btn-sm"title="' + $translate.instant("adm.content.relation_export") + '" ' +
                            ' ng-click="admTenantConfigVm.exportPages(' + id + ', 2)">' +
                            '<i class="fa fa-sort-amount-down-alt"></i>' +
                            '</a></span>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };
        $scope.tableConfig = {
            columns: tableOption.aoColumns,
            data: [function () {
                var d = $q.defer();
                var url = window.$oplus.appConfig.apiBaseUrls.portal + '/api/tenants';
                $http({
                    url: url,
                    method: 'GET',
                }).then(function (res) {
                    var result = res.data;
                     d.resolve(result);
                }, function (err) {
                    d.reject(err);
                    throw err;
                });
                return d.promise;
            }],
            order: [[1, 'desc']],
            buttons: ['reload']
        };

        /*function init() {
            var url = window.$oplus.appConfig.apiBaseUrls.portal + '/api/tenants';
            var dataSrc = "";
            dataTable.initTable("#tenantConfigTable", tableOption.aoColumns, undefined, {
                scrollX: true,
                order: [[1, 'desc']],
                ajax: {
                    url: url,
                    dataSrc: dataSrc
                }
            }).then(function (apiInstance) {
                vm.result = apiInstance;
                console.log()
            }).catch(function (err) {
                throw err;
            });
        }

        init();*/
    }
})();

(function () {
    'use strict';

    angular.module('oplus.adm').controller('TenantConfigImportCtrl', TenantConfigImportCtrl);

    TenantConfigImportCtrl.$inject = ['$scope', '$timeout', 'pageService', '$window', 'tenantConfigService', 'messageService', '$translate'];
    function TenantConfigImportCtrl($scope, $timeout, pageService, $window, tenantConfigService, messageService, $translate) {
        var vm = this;
        $scope.displayTree = false;
        $scope.displayImport = false;

        vm.doImport = doImport;
        vm.parseFile = parseFile;
        vm.selectedFile = {};
        vm.tenantConfigs = {};

        vm.views = {
            name: null,
            title: null,
            update: 0,
            type: null,
            tenantDTO: null,
            udpAppletList: [],
            udpPageList: [],
            dtsDatasetList: [],
            jaoJobDefinitionList: []
        };
        vm.types = [
            {
                label: "系统自动识别组件关系导入",
                value: "2"
            }, {
                label: "根据关联关系导入",
                value: "1"
            }
        ];


        function doImport() {
            var tree = $("#tenantConfigTree").fancytree("getTree");
            var selNodes = tree.getSelectedNodes();
            //Todo 设定当操作类型为根据关系导入时候，无法导入单个组件(page, job, dts)
            if (selNodes) {
                var selectNodes = [];
                for (var i in selNodes) {
                    var nodeName = selNodes[i];
                    if (nodeName.type != "folder") {
                        var parentNode = nodeName.parent;
                        var parentNodeName = parentNode.title;
                        if (parentNodeName == "Page") {
                            vm.views.udpPageList.push(nodeName.data.value)
                        } else if (parentNodeName == "Applet") {
                            vm.views.udpAppletList.push(nodeName.data.value)
                        } else if (parentNodeName == "DTS") {
                            vm.views.dtsDatasetList.push(nodeName.data.value)
                        } else {
                            vm.views.jaoJobDefinitionList.push(nodeName.data.value)
                        }
                    }
                }
            }
            if (vm.views.type.value === "1") {
                tenantConfigService.importPagesRelation(vm.views).then(function (result) {
                    messageService.toast("success", $translate.instant("adm.content.data_import_success"));
                }).catch(function (err) {
                    messageService.toast("error", $translate.instant("adm.content.data_import_error"));
                });
            } else {
                tenantConfigService.importPagesAnalysis(vm.views).then(function (result) {
                    messageService.toast("success", $translate.instant("adm.content.data_import_success"));
                }).catch(function (err) {
                    messageService.toast("error", $translate.instant("adm.content.data_import_error"));
                });
            }

        }


        var treeOption = {
            checkbox: true,
            extensions: ["glyph", "wide", "filter"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome5",
                map: {
                    folder: "far fa-folder",
                    folderOpen: "far fa-folder-open",
                    doc: "far fa-file",
                    docOpen: "far fa-file"
                }
            },
            select: function (event, data) {//选择或取消选择
                $scope.displayImport = data.node.selected;
                //强制生效双向绑定
                $scope.$apply();
            }
        };


        //嵌套转换
        function convertDataToFancyTreeNode(rawNodeList) {
            var nodeList = [];
            for (var i in rawNodeList) {
                var rawNode = rawNodeList[i];
                var node = {
                    key: rawNode.id,
                    id: rawNode.id,
                    type: rawNode.type,
                    selected: false,
                    title: rawNode.name,
                    value: rawNode.value
                };
                nodeList.push(node);
                if (rawNode.type == "folder") {
                    node.folder = true;
                    node.expanded = false;
                    if (rawNode.children != null && rawNode.children.length > 0) {
                        node.children = convertDataToFancyTreeNode(rawNode.children);
                    }
                }
            }
            return nodeList;
        }


        var tree;

        function parseFile(file) {
            vm.selectedFile = file;
            var reader = new $window.FileReader();
            reader.onload = function (ev) {
                $timeout(function () {
                    var content = ev.target.result;
                    vm.tenantConfigs = pageService.parseExportFile(content);
                    treeOption.source = convertDataToFancyTreeNode(vm.tenantConfigs);
                    if (treeOption.source.length > 0) {
                        $scope.displayTree = true;
                    }
                    if (tree) {
                        tree = $("#tenantConfigTree").fancytree("getTree");
                        tree.options.source = treeOption.source;
                        tree.reload();
                    } else {
                        tree = $("#tenantConfigTree").fancytree(treeOption);
                    }
                });

            };
            reader.readAsText(file);
        }


        function init() {
            tenantConfigService.findAllTenantConfigs().then(function (result) {
                vm.tenants = result;
            }).catch(function (err) {
                throw err;
            });
        }

        init();
    }
})();

(function () {
    'use strict';

    angular.module('oplus.adm').controller('TenantConfigExportCtrl', TenantConfigExportCtrl);

    TenantConfigExportCtrl.$inject = ['$scope', '$timeout', 'tenantConfigService', '$uibModalInstance', 'entity', 'handleType'];
    function TenantConfigExportCtrl($scope, $timeout, tenantConfigService, $uibModalInstance, entity, handleType) {
        var vm = this;
        $scope.displayTree = false;
        vm.doExport = doExport;
        vm.cancelImport = cancelImport;
        vm.tenantConfigs = {};
        vm.allConfigMap = {};
        vm.views = {
            tenantDTO: {},
            udpAppletList: [],
            udpPageList: [],
            dtsDatasetList: [],
            jaoJobDefinitionList: []
        };


        function doExport() {
            var tree = $("#tenantConfigExportTree").fancytree("getTree");
            var selNodes = tree.getSelectedNodes();
            if (selNodes) {
                var selectNodes = [];
                for (var i in selNodes) {
                    var nodeName = selNodes[i];
                    if (nodeName.type != "folder") {
                        var parentNode = nodeName.parent;
                        var parentNodeName = parentNode.title;
                        if (parentNodeName == "Page") {
                            vm.views.udpPageList.push(nodeName.data.value)
                        } else if (parentNodeName == "Applet") {
                            vm.views.udpAppletList.push(nodeName.data.value)
                        } else if (parentNodeName == "DTS") {
                            vm.views.dtsDatasetList.push(nodeName.data.value)
                        } else {
                            vm.views.jaoJobDefinitionList.push(nodeName.data.value)
                        }
                    }
                }
            }
            if(handleType === 1){
                tenantConfigService.exportConfigAnalysis(vm.views).then(function (result) {
                    tenantConfigService.exportPages(result);
                    $uibModalInstance.close();
                }).catch(function (err) {
                    throw err;
                });
            }else{
                tenantConfigService.exportConfigRelation(vm.views).then(function (result) {
                    tenantConfigService.exportPages(result);
                    $uibModalInstance.close();
                }).catch(function (err) {
                    throw err;
                });
            }

        }


        var treeOption = {
            checkbox: true,
            extensions: ["glyph", "wide", "filter"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome5",
                map: {
                    folder: "far fa-folder",
                    folderOpen: "far fa-folder-open",
                    doc: "far fa-file",
                    docOpen: "far fa-file"
                }
            }
        };


        //嵌套转换
        function convertDataToFancyTreeNode(rawNodeList) {
            var nodeList = [];
            for (var i in rawNodeList) {
                var rawNode = rawNodeList[i];
                var node = {
                    key: rawNode.id,
                    id: rawNode.id,
                    type: rawNode.type,
                    selected: false,
                    title: rawNode.name,
                    value: rawNode.value
                };

                if (handleType === 2) {

                    if (rawNode.isRoot || rawNode.id === "Applet") {
                        if (rawNode.type == "folder") {
                            node.folder = true;
                            node.expanded = false;
                            if (rawNode.children != null && rawNode.children.length > 0) {
                                node.children = convertDataToFancyTreeNode(rawNode.children);
                            }
                        }
                    }
                    if(rawNode.id !== "Page" && rawNode.id !=="DTS" && rawNode.id  !=="Job"){
                        nodeList.push(node);
                    }
                } else {
                    nodeList.push(node);
                    if (rawNode.type == "folder") {
                        node.folder = true;
                        node.expanded = false;
                        if (rawNode.children != null && rawNode.children.length > 0) {
                            node.children = convertDataToFancyTreeNode(rawNode.children);
                        }
                    }
                }


            }
            return nodeList;
        }

        function cancelImport() {
            $uibModalInstance.dismiss();
        }


        function initTree() {
            $timeout(function () {
                vm.tenantConfigs = entity;
                vm.views.tenantDTO = vm.tenantConfigs.tenantDTO;
                treeOption.source = convertDataToFancyTreeNode(vm.tenantConfigs);
                if (treeOption.source.length > 0) {
                    $scope.displayTree = true;
                }
                $("#tenantConfigExportTree").fancytree(treeOption);
            });
        }

        initTree()
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('subordinate', {
                parent: 'admin',
                url: '/subordinate',
                data: {
                    pageTitle: 'oplusApp.subordinate.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/subordinate/subordinates.html',
                        controller: 'SubordinateController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    page: {
                        value: '1',
                        squash: true
                    },
                    sort: {
                        value: 'id,asc',
                        squash: true
                    },
                    search: null
                },
                resolve: {
                    pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                        return {
                            page: PaginationUtil.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort),
                            search: $stateParams.search
                        };
                    }],
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('subordinate');
                    //     $translatePartialLoader.addPart('global');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('subordinate.config', {
                url: '/config',
                data: {
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/subordinate/subordinate-config.html',
                        controller: 'SubordinateConfigController',
                        controllerAs: 'subordinateConfigVm'
                    }
                }
            })
            .state('subordinate.delete', {
                url: '/{id}/delete',
                data: {
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/subordinate/subordinate-delete-dialog.html',
                        controller: 'SubordinateDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Subordinate', function (Subordinate) {
                                return Subordinate.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('subordinate', null, {reload: 'subordinate'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
    }

})();

(function () {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Subordinate', Subordinate);

    Subordinate.$inject = ['$resource', '$q', '$http'];

    function Subordinate($resource, $q, $http) {
        var resourceUrl = 'api/subordinates/:id';

        var resource = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': {method: 'PUT'}
        });


        function getUserByLeader(leaderId) {
            var deferred = $q.defer();

            $http.get('api/subordinates/' + leaderId + '/users').then(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        function getSubordinateTree() {
            var deferred = $q.defer();

            $http.get('api/subordinates/tree').then(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        return {
            query: resource.query,
            get: resource.get,
            update: resource.update,
            getUserByLeader: getUserByLeader,
            getSubordinateTree: getSubordinateTree
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('SubordinateController', SubordinateController);

    SubordinateController.$inject = ['$state', 'Subordinate'];

    function SubordinateController($state, Subordinate) {

        var vm = this;

        var treeOption = {
            checkbox: false,
            extensions: ["glyph", "wide", "filter"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome5",
                map: {
                    folder: "far fa-folder",
                    folderOpen: "far fa-folder-open",
                    doc: "far fa-user",
                    docOpen: "far fa-user"
                }
            },
            filter: {  // override default settings
                counter: false, // No counter badges
                mode: "hide",  // "dimm": Grayout unmatched nodes, "hide": remove unmatched nodes
                autoExpand: true,
                leavesOnly: true
            }
        };

        //嵌套转换
        function convertDataToFancyTreeNode(rawNodeList) {
            var nodeList = [];
            for (var i in rawNodeList) {
                var rawNode = rawNodeList[i];

                var node = {
                    key: rawNode.id,
                    id: rawNode.id,
                    type: rawNode.type,
                    selected: false,
                    title: rawNode.name
                };

                nodeList.push(node);

                if (rawNode.type == "folder") {
                    node.folder = true;
                    node.expanded = false;
                    if (rawNode.children != null && rawNode.children.length > 0) {
                        node.children = convertDataToFancyTreeNode(rawNode.children);
                    }
                }
            }

            return nodeList;
        }


        function init() {
            Subordinate.getSubordinateTree().then(function (result) {
                treeOption.source = convertDataToFancyTreeNode(result.data);
                $("#subordinateTree").fancytree(treeOption);
            });
        }

        init();
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('SubordinateConfigController', SubordinateConfigController);

    SubordinateConfigController.$inject = ['$state', '$timeout', 'Subordinate', 'messageService'];

    function SubordinateConfigController($state, $timeout, Subordinate, messageService) {

        var vm = this;

        vm.views = {
            currentLeader: null,
            currentLeaders: [],
            selectedUsers: [],
            disabledUsers: [],
            onLeaderChosen: onLeaderChosen,
            onUserChosen: onUserChosen,
            save: save,
            cancel: cancel
        };


        function onLeaderChosen(users) {
            // console.log("Users = " + JSON.stringify(users));
            if (users != null && users.length > 0) {
                vm.views.currentLeader = users[0];
                vm.views.disabledUsers = users;
                $timeout(function () {
                    getSubordinate(vm.views.currentLeader.id)
                });
            } else {
                // console.log("currentLeader is null");
                vm.views.currentLeader = null;
                $timeout(function () {
                    vm.views.disabledUsers = [];
                    vm.views.selectedUsers = [];
                });
            }
        }

        function onUserChosen(users) {
            // console.log("onUserChosen Users = " + JSON.stringify(users));
            vm.views.selectedUsers = users;
        }

        //query user by leader
        function getSubordinate(leaderLogin) {
            vm.views.selectedUsers = [];
            Subordinate.getUserByLeader(leaderLogin).then(function (result) {
                // console.log("result = " + JSON.stringify(result.data));

                vm.views.selectedUsers = result.data;
            });
            // relationships: ['Subordinate', function (Subordinate) {
            //     return Subordinate.query().$promise;
            // }],
        }

        function save() {
            if (vm.views.currentLeader != null) {
                vm.isSaving = true;

                var userIds = [];
                var selectedUsers = vm.views.selectedUsers;
                if (selectedUsers != null && selectedUsers.length > 0) {
                    for (var i in selectedUsers) {
                        var selectedUser = selectedUsers[i];
                        userIds.push(selectedUser.id);
                    }
                }

                var updateParam = {leaderId: vm.views.currentLeader.id, userIds: userIds};

                Subordinate.update(updateParam, function () {
                    vm.isSaving = false;
                    messageService.toast("success", "保存成功");
                });
            }
        }

        function cancel() {
            $state.go("subordinate");
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('RoleDialogController', RoleDialogController);

    RoleDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Role', 'Permission', 'User', 'messageService'];

    function RoleDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, Role, Permission, User, messageService) {
        var vm = this;

        vm.role = entity;
        vm.clear = clear;
        vm.save = save;

        vm.permissions = [];
        vm.users = [];

        var selectedUserMap = {};

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        function init() {
            Permission.query(function (result) {
                var selectedPermissions = entity.permissions;
                if (selectedPermissions != null && selectedPermissions.length > 0) {
                    var allPermissionMap = {};
                    for (var j in result) {
                        allPermissionMap[result[j].id] = result[j];
                    }
                    for (var i in selectedPermissions) {
                        var selectedId = selectedPermissions[i].id;
                        if (allPermissionMap[selectedId] != undefined) {
                            allPermissionMap[selectedId].isChecked = true;
                        } else {
                            console.log("Permission [" + selectedId + "] not exists!");
                        }
                    }
                }
                vm.permissions = result;
            });

            var selectedUsers = entity.users;
            for (var i in selectedUsers) {
                var user = selectedUsers[i];
                user.isChecked = true;
                selectedUserMap[user.tenantUserId] = user;
            }

            initUsers();
        }

        init();

        function initUsers() {
            User.getAllUsersBasicInfo().then(function (result) {
                if (result != undefined && result.length > 0) {
                    //push all user info selectedUserMap
                    for (var j in result) {
                        var user = result[j];
                        var tenantUserId = user.tenantUserId;
                        var selectedUser = selectedUserMap[tenantUserId];
                        if (selectedUser != undefined) {
                            result[j] = selectedUser;
                            // console.log("Find selected user " + selectedUser.fullName + "--" + selectedUser.isChecked);
                        } else {
                            selectedUserMap[tenantUserId] = user;
                        }
                    }
                }
                vm.users = result;
            });
        }

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {

            vm.isSaving = true;
            //collect all selected permissions
            var selectedPermissions = [];
            for (var i in vm.permissions) {
                if (vm.permissions[i].isChecked) {
                    selectedPermissions.push(vm.permissions[i]);
                }
            }
            vm.role.permissions = selectedPermissions;

            //collect all selected users
            var selectedUsers = [];
            for (var i in selectedUserMap) {
                if (selectedUserMap[i].isChecked) {
                    selectedUsers.push(selectedUserMap[i]);
                }
            }
            vm.role.users = selectedUsers;

            if (vm.role.id !== null) {
                Role.update(vm.role, onSaveSuccess, onSaveError);
            } else {
                Role.save(vm.role, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            messageService.toast('success', '保存成功');
            $scope.$emit('oplusApp:roleUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('RoleDetailController', RoleDetailController);

    RoleDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Role', 'Permission', 'User'];

    function RoleDetailController($scope, $rootScope, $stateParams, previousState, entity, Role, Permission, User) {
        var vm = this;

        vm.role = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('oplusApp:roleUpdate', function(event, result) {
            vm.role = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('RoleDeleteController', RoleDeleteController);

    RoleDeleteController.$inject = ['$uibModalInstance', 'entity', 'Role', 'messageService'];

    function RoleDeleteController($uibModalInstance, entity, Role, messageService) {
        var vm = this;

        vm.role = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            Role.delete({id: id},
                function () {
                    messageService.toast("success", "删除成功");
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "该角色正在被用户使用,无法删除!");
                });
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('RoleAllocatePermController', RoleAllocatePermController);

    RoleAllocatePermController.$inject = ['$scope', '$state', '$q', 'User', 'Role', 'Permission', 'currentUser', 'opDatatable', 'messageService'];

    function RoleAllocatePermController($scope, $state, $q, User, Role, Permission, currentUser, opDatatable, messageService) {
        var vm = this;
        vm.roles = {};

        vm.save = save;
        vm.clear = clear;

        function constructCheckboxHtml(roleId, permissionName) {
            var roleIdWrap = "'" + roleId + "'";
            var permissionNameWrap = "'" + permissionName + "'";
            var dataPath = 'allocatePermVm.roles[' + roleIdWrap + '][' + permissionNameWrap + ']';
            var html =
                '<div class="checkbox checkbox-inline checkbox-primary">' +
                '    <input type="checkbox" name="' + roleId + '-' + permissionName + '"' +
                '           ng-checked="' + dataPath + '"' +
                '           ng-click="' + dataPath + '=!' + dataPath + ';"/>' +
                '<label></label>' +
                '</div>';
            return html;
        }

        function init() {
            prepareColumn().then(function (permissionNames) {
                var tableColumnConfig = [{data: 'permission', title: '权限'}];
                prepareTableData(permissionNames).then(function (data) {
                    vm.dataList = [];
                    permissionNames.forEach(function (permission) {
                        var dataMap = {};
                        dataMap['permission'] = permission;
                        data.forEach(function (role) {
                            dataMap[role.id] = role[permission];
                            vm.roles[role.id] = role;
                        });
                        vm.dataList.push(dataMap);
                    });

                    vm.rolesBackup = _.cloneDeep(vm.roles);

                    data.forEach(function (role) {
                        tableColumnConfig.push({
                            data: role.id, title: role.name, class: 'text-center', orderable: false,
                            render: function (data, type, row, meta) {
                                return constructCheckboxHtml(role.id, row.permission);
                            }
                        });
                    });

                    vm.tableConfig = {
                        data: vm.dataList,
                        columns: tableColumnConfig
                    }

                    // console.dir(permissionNames);
                    // console.dir(tableColumnConfig);
                    // console.dir(data);
                    /*opDatatable.buildTable('.role-perm-table', $scope)
                        .fromData(vm.dataList)
                        .withColumn(tableColumnConfig)
                        .withOption('fixedColumns', {
                            leftColumns: 1
                        })
                        .withOption('scrollY', '350px')
                        .withOption('scrollX', true)
                        .withOption('scrollCollapse', true)
                        .withOption('paging', false)
                        .render();*/
                });
            });
        }

        init();

        function prepareTableData(permissionNames) {
            return Role.query({isWithPermission: true}).$promise.then(function (result) {
                var roles = [];

                for (var i in result) {
                    var role = result[i];
                    if (role.id) {
                        var rowData = {
                            id: role.id
                        };
                        fillRowDataByPermissionName(rowData, permissionNames, role.permissions);
                        rowData.name = role.description;
                        rowData.description = role.description;

                        roles.push(rowData);
                    }
                }

                return roles;
            });
        }

        function fillRowDataByPermissionName(row, allPermissionNames, rolePermissions) {
            for (var i in allPermissionNames) {
                row[allPermissionNames[i]] = false;
            }

            if (rolePermissions) {
                for (var i in rolePermissions) {
                    row[getPermissionName(rolePermissions[i])] = true;
                }
            }
        }

        var permissionMap = {};

        function prepareColumn() {
            var defer = $q.defer();
            Permission.query(function (permissions) {
                var permissionsNames = permissions.map(function (permission) {
                    var name = getPermissionName(permission);
                    permissionMap[name] = permission;
                    return name;
                });

                defer.resolve(permissionsNames);
            });

            return defer.promise;
        }


        function getPermissionName(permission) {
            return permission.domain + ':' + permission.action + ':' + permission.target
        }

        function save() {
            var changedRoles = collectChangeRole();
            if (changedRoles.length) {
                var toUpdateRoles = [];
                changedRoles.forEach(function (role) {
                    var toUpdateRole = {id: role.id, permissions: []};
                    toUpdateRoles.push(toUpdateRole);
                    for (var key in role) {
                        if (key.indexOf(':') != -1 && role[key]) {
                            toUpdateRole.permissions.push(permissionMap[key]);
                        }
                    }
                });
                console.dir(toUpdateRoles);

                Role.updateRolePermissions(toUpdateRoles).then(function () {
                    messageService.toast('success', '保存成功.');
                    $state.go('^', {}, {reload: true});
                }).catch(function () {
                    messageService.toast('error', '保存失败.');
                });
            } else {
                messageService.toast('warning', '没有需要保存的记录.');
            }
            // console.dir(changedUsers)
        }

        function collectChangeRole() {
            var changedRoles = [];
            for (var i in vm.rolesBackup) {
                if (isRoleChanged(vm.rolesBackup[i], vm.roles[i])) {
                    changedRoles.push(vm.roles[i]);
                }
            }

            return changedRoles;
        }

        /**
         * is any property value change
         * @param before
         * @param after
         * @returns {boolean}
         */
        function isRoleChanged(before, after) {
            for (var i in before) {
                if (before[i] !== after[i]) {
                    return true;
                }
            }

            return false;
        }

        function clear() {
            $state.go('^');
        }

    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('role', {
                parent: 'admin',
                url: '/role?page&sort&search',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'role.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/role/roles.html',
                        controller: 'RoleController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    page: {
                        value: '1',
                        squash: true
                    },
                    sort: {
                        value: 'id,asc',
                        squash: true
                    },
                    search: null
                },
                resolve: {
                    pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                        return {
                            page: PaginationUtil.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort),
                            search: $stateParams.search
                        };
                    }],
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('role');
                    //     $translatePartialLoader.addPart('global');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('role.role-detail', {
                url: '/role/{id}',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'role.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/role/role-detail.html',
                        controller: 'RoleDetailController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('role');
                    //     return $translate.refresh();
                    // }],
                    entity: ['$stateParams', 'Role', function ($stateParams, Role) {
                        return Role.get({id: $stateParams.id}).$promise;
                    }],
                    previousState: ["$state", function ($state) {
                        var currentStateData = {
                            name: $state.current.name || 'role',
                            params: $state.params,
                            url: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }]
                }
            })
            .state('role.role-detail.edit', {
                url: '/detail/edit',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/role/role-dialog.html',
                        controller: 'RoleDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Role', function (Role) {
                                return Role.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: false});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('role.new', {
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/role/role-dialog.html',
                        controller: 'RoleDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    visibility: null,
                                    target: null,
                                    description: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('role', null, {reload: 'role'});
                    }, function () {
                        $state.go('role');
                    });
                }]
            })
            .state('role.edit', {
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/role/role-dialog.html',
                        controller: 'RoleDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Role', function (Role) {
                                return Role.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('role', null, {reload: 'role'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('role.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/role/role-delete-dialog.html',
                        controller: 'RoleDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Role', function (Role) {
                                return Role.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('role', null, {reload: 'role'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('role.allocate-perm', {
                url: '/role/allocate-perm',
                data: {
                    authorities: [],
                    pageTitle: 'role.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/role/role-allocate-perm.html',
                        controller: 'RoleAllocatePermController',
                        controllerAs: 'allocatePermVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('role');
                    //     return $translate.refresh();
                    // }]
                }
            });
    }

})();

(function() {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Role', Role);

    Role.$inject = ['$resource','$http','$q'];

    function Role ($resource,$http,$q) {
        var resourceUrl =  'api/roles/:id';

        var service = $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });


        service.updateRolePermissions = function (roles) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/roles/permissions", roles)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };


        return service;

    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .factory('RoleSearch', RoleSearch);

    RoleSearch.$inject = ['$resource'];

    function RoleSearch($resource) {
        var resourceUrl =  'api/_search/roles/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('RoleController', RoleController);

    RoleController.$inject = ['$state', '$scope', '$timeout', '$compile', 'Role', 'RoleSearch', 'dataTable','$q'];

    function RoleController($state, $scope, $timeout, $compile, Role, RoleSearch, dataTable,$q) {

     /*  (function initRoles() {
            Role.query(function (result) {
                dataTable.initTable(".role-table", tableColumnConfig, result);
            });
        })();
*/

        var tableColumnConfig = [
            {mData: 'name', title: '名称'},
            {mData: 'description', title: '描述'},
            {
                mData: 'id', title: '操作',
                class: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {

                    var param = angular.toJson({id: row.id});
                    return '<div class="btn-group">' +
                        ' <button type="submit" ui-sref=role.role-detail(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.view"></span>' +
                        ' </button>' +
                        '&nbsp;&nbsp;' +
                        ' <button type="submit" ui-sref=role.edit(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                        ' </button>' +
                        '&nbsp;&nbsp;' +
                        ' <button type="submit" ui-sref=role.delete(' + param + ') class="btn btn-danger btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                        ' </button>' +
                        '</div>';
                },
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
                }
            }
        ];

       $scope.tableConfig = {
            data: [getPromise, ''],
            columns: tableColumnConfig,
            order: [[1, 'desc']],
            buttons: ['reload']
        }

        function getPromise() {
            var deferred = $q.defer();
            Role.query(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }

    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('PermissionDialogController', PermissionDialogController);

    PermissionDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Permission', 'Role'];

    function PermissionDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Permission, Role) {
        var vm = this;

        vm.permission = entity;
        vm.clear = clear;
        vm.save = save;
        vm.roles = Role.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.permission.id !== null) {
                Permission.update(vm.permission, onSaveSuccess, onSaveError);
            } else {
                Permission.save(vm.permission, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('oplusApp:permissionUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('PermissionDetailController', PermissionDetailController);

    PermissionDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Permission', 'Role'];

    function PermissionDetailController($scope, $rootScope, $stateParams, previousState, entity, Permission, Role) {
        var vm = this;

        vm.permission = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('oplusApp:permissionUpdate', function(event, result) {
            vm.permission = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('PermissionDeleteController', PermissionDeleteController);

    PermissionDeleteController.$inject = ['$uibModalInstance', 'entity', 'Permission', 'messageService'];

    function PermissionDeleteController($uibModalInstance, entity, Permission, messageService) {
        var vm = this;

        vm.permission = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            Permission.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "该权限正在被角色使用,无法删除!");
                });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('permission', {
            parent: 'admin',
            url: '/permission?page&sort&search',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'permission.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/permission/permissions.html',
                    controller: 'PermissionController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('permission');
                //     $translatePartialLoader.addPart('global');
                //     return $translate.refresh();
                // }]
            }
        })
        .state('permission.permission-detail', {
            url: '/permission/{id}',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'permission.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/permission/permission-detail.html',
                    controller: 'PermissionDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('permission');
                //     return $translate.refresh();
                // }],
                entity: ['$stateParams', 'Permission', function($stateParams, Permission) {
                    return Permission.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'permission',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('permission.permission-detail.edit', {
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/permission/permission-dialog.html',
                    controller: 'PermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Permission', function(Permission) {
                            return Permission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('permission.new', {
            url: '/new',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/permission/permission-dialog.html',
                    controller: 'PermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                domain: null,
                                action: null,
                                target: null,
                                description: null,
                                configJson: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('permission', null, { reload: 'permission' });
                }, function() {
                    $state.go('permission');
                });
            }]
        })
        .state('permission.edit', {
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/permission/permission-dialog.html',
                    controller: 'PermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Permission', function(Permission) {
                            return Permission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('permission', null, { reload: 'permission' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('permission.delete', {
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/permission/permission-delete-dialog.html',
                    controller: 'PermissionDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Permission', function(Permission) {
                            return Permission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('permission', null, { reload: 'permission' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();

(function() {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Permission', Permission);

    Permission.$inject = ['$resource','$q','$http'];

    function Permission ($resource,$q,$http) {
        var resourceUrl =  'api/permissions/:id';

        var service = $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });

        return service;

    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .factory('PermissionSearch', PermissionSearch);

    PermissionSearch.$inject = ['$resource'];

    function PermissionSearch($resource) {
        var resourceUrl =  'api/_search/permissions/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('PermissionController', PermissionController);

    PermissionController.$inject = ['$scope', '$compile', 'Permission', 'dataTable','$q'];

    function PermissionController($scope, $compile, Permission, dataTable,$q) {

        /*(function initPermission() {
            Permission.query(function (result) {
                dataTable.initTable(".permission-table", tableColumnConfig, result);
            });
        })();*/

        var tableColumnConfig = [
            {mData: 'domain', title: '主体'},
            {mData: 'action', title: '操作'},
            {mData: 'target', title: '目标'},
            {mData: 'description', title: '描述'},
            {
                mData: 'id', title: '操作',
                class: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var param = angular.toJson({id: row.id});
                    return '<div class="btn-group">' +
                        '    <button type="submit" ui-sref=permission.permission-detail(' + param + ') class="btn btn-default btn-sm">' +
                        '        <span class="hidden-sm-down" data-translate="common.action.view"></span>' +
                        '    </button>&nbsp;&nbsp;' +
                        '    <button type="submit" ui-sref=permission.edit(' + param + ') class="btn btn-default btn-sm">' +
                        '        <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                        '    </button>&nbsp;&nbsp;' +
                        '    <button type="submit" ui-sref=permission.delete(' + param + ') class="btn btn-danger btn-sm">' +
                        '        <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                        '    </button>' +
                        '</div>';
                },
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
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
            var deferred = $q.defer();
            Permission.query(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('ParamDialogController', ParamDialogController);

    ParamDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Param'];

    function ParamDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, Param) {
        var vm = this;

        vm.param = entity;
        vm.clear = clear;
        vm.save = save;

        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();

            if (vm.param.useJsonEditor) {
                // create the editor
                var container = angular.element("#jsoneditor")
                vm.editor = new JSONEditor(container[0], {
                    sensitiveDataLabel: vm.param.sensitiveFields.split(','),
                    enableSort: false,
                    enableTransform: false,
                    limitDragging: true,
                })
                vm.editor.set(angular.fromJson(vm.param.value))
            }
            

        });

        if (vm.param.id && 1 === vm.param.isEncrypt) {
            $scope.secret = 1;
        } else if (!vm.param.id) {
            vm.param.isEncrypt = 0;
        }

        function clear() {
            $uibModalInstance.dismiss({action: "cancel"});
        }

        function save() {

            vm.isSaving = true;

            // get json
            if (vm.param.useJsonEditor) {
                vm.param.value = angular.toJson(vm.editor.get());
            }
            
            if (vm.param.id !== null) {
                Param.update(vm.param, onSaveSuccess, onSaveError);
            } else {
                Param.save(vm.param, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            $uibModalInstance.close({action: "save"});
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('ParamDetailController', ParamDetailController);

    ParamDetailController.$inject = ['$scope', '$rootScope', '$filter', '$timeout', 'previousState', 'entity'];

    function ParamDetailController($scope, $rootScope, $filter, $timeout, previousState, entity) {
        var vm = this;

        vm.param = entity;
        vm.previousState = previousState.name;
        // vm.param.configJson = $filter('json')(vm.param.config);

        $timeout(function () {
            if (vm.param.useJsonEditor) {
                // create the editor
                var container = angular.element("#jsoneditor")
                vm.editor = new JSONEditor(container[0], {
                    mode: 'view',
                    sensitiveDataLabel: vm.param.sensitiveFields.split(','),
                    enableSort: false,
                    enableTransform: false,
                    limitDragging: true,
                })
                vm.editor.set(angular.fromJson(vm.param.value))
            }
        });

        var unsubscribe = $rootScope.$on('oplusApp:paramUpdate', function (event, result) {
            vm.param = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('ParamDeleteController', ParamDeleteController);

    ParamDeleteController.$inject = ['$uibModalInstance', 'entity', 'Param', 'messageService'];

    function ParamDeleteController($uibModalInstance, entity, Param, messageService) {
        var vm = this;

        vm.param = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            Param.delete({id: id},
                function () {
                    messageService.toast("success", "删除成功");
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "删除失败!");
                });
        }
    }

})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('param', {
                parent: 'admin',
                url: '/param',
                data: {
                    authorities: [],
                    pageTitle: 'param.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/param/params.html',
                        controller: 'ParamController',
                        controllerAs: 'paramVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('param');
                    //     $translatePartialLoader.addPart('global');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('param.new', {
                url: '/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/param/param-dialog.html',
                        controller: 'ParamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    domain: null,
                                    name: null,
                                    value: null,
                                    description: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('param');
                    });
                }]
            })
            .state('param.edit', {
                url: '/{id}/edit',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/param/param-dialog.html',
                        controller: 'ParamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('param.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/param/param-delete-dialog.html',
                        controller: 'ParamDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('param', null, {reload: 'param'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('param.detail', {
                url: '/{id}',
                data: {
                    authorities: [],
                    pageTitle: 'param.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/param/param-detail.html',
                        controller: 'ParamDetailController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('param');
                    //     return $translate.refresh();
                    // }],
                    entity: ['$stateParams', 'Param', function ($stateParams, Param) {
                        return Param.get({id: $stateParams.id}).$promise;
                    }],
                    previousState: ["$state", function ($state) {
                        var currentStateData = {
                            name: $state.current.name || 'param',
                            params: $state.params,
                            url: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }]
                }
            });
    }

})();

(function () {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Param', Param);

    Param.$inject = ['$resource', '$http', '$q'];

    function Param($resource, $http, $q) {
        var resourceUrl = 'api/params/:id';

        var service = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': {method: 'PUT'}
        });

        service.getByDomainAndName = function (domain, name) {
            var deferred = $q.defer();
            $http.get("api/params/" + domain + "/" + name)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        service.getByDomain = function (domain) {
            var deferred = $q.defer();
            $http.get("api/params/query?domain=" + domain)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
        service.batchUpdate = function (paramList) {
            var deferred = $q.defer();
            $http.post("api/params/multi-update",paramList)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        return service;
    }

})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('ParamController', ParamController);

    ParamController.$inject = ['$scope', '$timeout', '$compile', 'Param', 'messageService', 'dataTable', 'tenantUtil','$q'];

    function ParamController($scope, $timeout, $compile, Param, messageService, dataTable, tenantUtil,$q) {
        var vm = this;

        vm.isOplusAdminUI = tenantUtil.isOplusAdminUI();

       /* (function initParams() {
            Param.query({}, function (result, headers) {
                dataTable.initTable(".param-table", tableColumnConfig, result);
            });
        })();*/

        var tableColumnConfig = [
            {mData: 'domain', title: '主体'},
            {mData: 'name', title: '参数名'},
            {
                mData: 'value', title: '参数值', className: 'cac-text-overflow', width: '400px',
                render: function (data, type, row, meta) {
                    return '<span' +
                        ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 400px;"' +
                        ' title=/""' + row.value + '"/">' + row.value + '</span>';
                }
            },
            {
                mData: 'description', title: '描述', className: 'cac-text-overflow', width: '400px',
                render: function (data, type, row, meta) {
                    return '<span' +
                        ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 400px;"' +
                        ' title="' + row.description + '">' + row.description + '</span>';
                }
            },
            {
                mData: 'id', title: '操作',
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {

                    var param = angular.toJson({ id: row.id });
                    
                    var btns = '' +
                        ' <button type="submit" ui-sref=param.detail(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.view"></span>' +
                        ' </button>&nbsp;&nbsp;' +
                        ' <button type="submit" ui-sref=param.edit(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                        ' </button>&nbsp;&nbsp;';

                    if (!row.cannotDelete)
                        btns += '' +
                            ' <button type="submit" ui-sref=param.delete(' + param + ') class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                            ' </button>';

                    return '<div class="btn-group">' +
                        btns +
                        '</div>';
                },
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
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
            var deferred = $q.defer();
            Param.query(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('BusinessModuleDialogController', BusinessModuleDialogController);

    BusinessModuleDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'BusinessModule'];

    function BusinessModuleDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, BusinessModule) {
        var vm = this;

        vm.businessModule = entity;
        vm.clear = clear;
        vm.save = save;

        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();
        });

        function init() {
        }

        init();

        function clear() {
            $uibModalInstance.dismiss({action: "cancel"});
        }

        function save() {

            vm.isSaving = true;

            // console.log("businessModule = " + JSON.stringify(vm.businessModule));
            var allElements = vm.businessModule.elements;
            if (allElements != undefined && allElements.length > 0) {
                var activeElements = [];
                allElements.filter(function (element) {
                    return !!element.isRemoved;
                });
                vm.businessModule.elements = activeElements;
            }

            if (vm.businessModule.id !== null) {
                BusinessModule.update(vm.businessModule, onSaveSuccess, onSaveError);
            } else {
                BusinessModule.save(vm.businessModule, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            $uibModalInstance.close({action: "save"});
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('BusinessModuleDetailController', BusinessModuleDetailController);

    BusinessModuleDetailController.$inject = ['$scope', 'entity'];

    function BusinessModuleDetailController($scope, entity) {
        var vm = this;

        vm.businessModule = entity;
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('BusinessModuleDeleteController', BusinessModuleDeleteController);

    BusinessModuleDeleteController.$inject = ['$uibModalInstance', 'entity', 'BusinessModule', 'messageService'];

    function BusinessModuleDeleteController($uibModalInstance, entity, BusinessModule, messageService) {
        var vm = this;

        vm.businessModule = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            BusinessModule.delete({id: id},
                function () {
                    messageService.toast("success", "删除成功");
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "删除失败!");
                });
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('businessModule', {
                parent: 'admin',
                url: '/businessModule',
                data: {
                    authorities: [],
                    pageTitle: 'businessModule.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/module/business-modules.html',
                        controller: 'BusinessModuleController',
                        controllerAs: 'businessModuleVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('business-module');
                    //     $translatePartialLoader.addPart('global');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('businessModule.detail', {
                url: '/{id}',
                data: {
                    authorities: [],
                    pageTitle: 'businessModule.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/module/business-module-detail.html',
                        controller: 'BusinessModuleDetailController',
                        controllerAs: 'businessModuleDetailVm'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'BusinessModule', function ($stateParams, BusinessModule) {
                        return BusinessModule.get({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('businessModule.edit', {
                url: '/{id}/edit',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/module/business-module-dialog.html',
                        controller: 'BusinessModuleDialogController',
                        controllerAs: 'businessModuleDialogVm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['BusinessModule', function (BusinessModule) {
                                return BusinessModule.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('businessModule.new', {
                url: '/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/module/business-module-dialog.html',
                        controller: 'BusinessModuleDialogController',
                        controllerAs: 'businessModuleDialogVm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    id: null,
                                    name: null,
                                    code: null,
                                    description: null,
                                    permission: null,
                                    dataSql: null,
                                    elements: []
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('businessModule');
                    });
                }]
            })
            .state('businessModule.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/module/business-module-delete-dialog.html',
                        controller: 'BusinessModuleDeleteController',
                        controllerAs: 'businessModuleDeleteVm',
                        size: 'md',
                        resolve: {
                            entity: ['BusinessModule', function (BusinessModule) {
                                return BusinessModule.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('businessModule', null, {reload: 'businessModule'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
    }

})();

(function () {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('BusinessModule', BusinessModule);

    BusinessModule.$inject = ['$resource', '$http', '$q'];

    function BusinessModule($resource, $http, $q) {
        var resourceUrl = 'api/business-modules/:id';

        var service = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': {method: 'PUT'}
        });

        return service;

    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('BusinessModuleController', BusinessModuleController);

    BusinessModuleController.$inject = ['$scope', '$timeout', '$compile', 'BusinessModule', 'messageService', 'dataTable'];

    function BusinessModuleController($scope, $timeout, $compile, BusinessModule, messageService, dataTable) {

        var vm = this;
        initBusinessModules();

        var tableColumnConfig = [
            {mData: 'name', title: '名称'},
            {mData: 'code', title: '编码'},
            {mData: 'description', title: '描述'},
            {
                mData: 'id', title: '操作',
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {

                    var param = angular.toJson({id: row.id});
                    return '<div class="btn-group">' +
                        ' <button type="submit" ui-sref=businessModule.detail(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.view"></span>' +
                        ' </button>' +
                        ' <button type="submit" ui-sref=businessModule.edit(' + param + ') class="btn btn-default btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                        ' </button>' +
                        ' <button type="submit" ui-sref=businessModule.delete(' + param + ') class="btn btn-danger btn-sm">' +
                        '     <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                        ' </button>' +
                        '</div>';
                },
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
                }
            }
        ];


        function initBusinessModules() {

            BusinessModule.query({}, function (result, headers) {
                // console.log("BusinessModule.query result = " + JSON.stringify(result));
                dataTable.initTable(".business-module-table", tableColumnConfig, result);
            }, function onError(error) {
                messageService.alertError("Query business module fail.", error.data.message);
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('logs', {
            parent: 'admin',
            url: '/logs',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'logs.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/logs/logs.html',
                    controller: 'LogsController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('logs');
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .factory('LogsService', LogsService);

    LogsService.$inject = ['$resource'];

    function LogsService ($resource) {
        var service = $resource('management/logs', {}, {
            'findAll': { method: 'GET', isArray: true},
            'changeLevel': { method: 'PUT'}
        });

        return service;
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('LogsController', LogsController);

    LogsController.$inject = ['LogsService'];

    function LogsController (LogsService) {
        var vm = this;

        vm.changeLevel = changeLevel;
        vm.loggers = LogsService.findAll();

        function changeLevel (name, level) {
            LogsService.changeLevel({name: name, level: level}, function () {
                vm.loggers = LogsService.findAll();
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig ($stateProvider) {
        $stateProvider.state('docs', {
            parent: 'admin',
            url: '/docs',
            data: {
                pageTitle: 'global.menu.admin.apidocs'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/docs/docs.html',
                    controller: 'DocsController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('DocsController', DocsController);

    DocsController.$inject = ['$scope', '$sce'];

    function DocsController($scope, $sce) {
        var vm = this;

        vm.gatewayPath = $sce.trustAsResourceUrl(window.$oplus.appConfig.apiBaseUrls.portal + '/swagger-ui.html');
    }

})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('DictApiCtrl', DictApiCtrl);

    DictApiCtrl.$inject = ['$scope','$uibModalInstance','Dict','dict'];

    function DictApiCtrl( $scope, $uibModalInstance,Dict,dict) {

        $scope.folder = "";
        var prefix = window.$oplus.appConfig.apiBaseUrls.portal;
        if (prefix) {
            prefix += "/";
        } else {
            prefix = window.location.protocol + "//" + window.location.host + window.location.pathname;
        }

        $scope.restApi = prefix + "api/dicts/"+dict.value;

        var getUrl = $scope.restApi;

        $scope.getUrl = getUrl;

        $scope.curlGetUrl = 'curl -X GET --header "Accept: */*"  "' + encodeURI(getUrl) + '"';

        $scope.dismissModal = function () {
            $uibModalInstance.close();
        }

        $scope.getDictByCode = function () {
            Dict.getDictByCode(dict.value).then(
                function (data) {
                    $scope.folder = JSON.stringify(data, null, 2);
                },function () {

                }
            )

        }

    }

})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('dict', {
            parent: 'admin',
            url: '/dict',
            data: {
                pageTitle: 'oplusApp.dict.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/dict/dicts.html',
                    controller: 'DictController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('dict');
                //     $translatePartialLoader.addPart('global');
                //     return $translate.refresh();
                // }]
            }
        })
        .state('dict.api', {
            url: '/api/{id}',
            data: {
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/dict/dict-dialog.html',
                    controller: 'DictApiCtrl',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        dict: ['Dict', function(Dict) {
                            return Dict.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('dict', {}, { reload: false });
                }, function() {
                    $state.go('dict');
                });
            }]
        })
    }

})();

(function() {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Dict', Dict);

    Dict.$inject = ['$resource','$http','$q'];

    function Dict ($resource,$http,$q) {
        var resourceUrl =  'api/dicts/:id';

        var service = $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });

        service.delDicts = function (idList) {
            var deferred = $q.defer();//声明承诺
            $http({
                method: 'DELETE',
                url: 'api/dicts/delete',
                params:{'idList':idList}
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        };

        service.getDictByCode = function (code) {
            var deferred = $q.defer();//声明承诺
            var url = 'api/dicts/code/'+code;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        };

        return service;

    }
})();

(function() {
    'use strict';

    angular.module('oplus.adm').controller('DictController', DictController);

    DictController.$inject = ['$scope','$state','Dict','messageService'];

    function DictController($scope,$state,Dict,messageService) {

        var vm = this;
        vm.dict = {};
        vm.save = save;
        vm.del = del;
        vm.createModule = createModule;
        vm.isDict = false;
        vm.pLabel = "";

        var map = {};
        var dictList = [];
        var mapDicts = {};
        var activeKey = "";

        var treeOption = {
            checkbox: false,
            extensions: ["glyph", "wide", "filter"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome4",
                map: {
                    folder: "fa-folder-o",
                    folderOpen: "fa-folder-open-o",
                    doc: "fa-file-text",
                    docOpen: "fa-file-text"
                }
            },
            filter: {
                autoApply: true,   // Re-apply last filter if lazy data is loaded
                autoExpand: false, // Expand all branches that contain matches while filtered
                counter: true,     // Show a badge with number of matching child nodes near parent icons
                fuzzy: false,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
                hideExpandedCounter: true,  // Hide counter badge if parent is expanded
                hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
                highlight: true,   // Highlight matches by wrapping inside <mark> tags
                leavesOnly: false, // Match end nodes only
                nodata: true,      // Display a 'no data' status node if result is empty
                mode: "dimm"       // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
            },
            activate: function(event, data) {
                $scope.$apply(function () {
                    vm.isDict = true;
                    vm.dict = mapDicts[data.node.data.id];
                    if(data.node.data.pid) {
                        vm.pLabel = mapDicts[data.node.data.pid].label;
                    }else{
                        vm.pLabel = "模块目录";
                    }
                });
            }
        };

        initDictTree();

        function initDictTree() {
            Dict.query(function(data) {
                treeOption.source = convertDataToFancyTreeNode(data);
                $("#dictTree").fancytree(treeOption);
                $.contextMenu({
                    selector: "#dictTree span.fancytree-title",
                    items: {
                        "add": {name: "新增", disabled:function(key,opt){
                                var node = $.ui.fancytree.getNode(opt.$trigger);
                                if(node.type == "1") {
                                    return true;
                                }
                                return false;
                            },
                            callback: function(key, opt){
                                var node = $.ui.fancytree.getNode(opt.$trigger);

                                $scope.$apply(function () {
                                    vm.pLabel = node.data.label;
                                    var sort = getSort(node.data.id);
                                    vm.dict = {
                                        disabled:0,
                                        sort:sort,
                                        pid:node.data.id,
                                        type:"1"
                                    }
                                })
                            }
                        },
                        "delete": {name: "删除",
                            callback: function(key, opt){
                                var node = $.ui.fancytree.getNode(opt.$trigger);
                                del(node.data);
                            }
                        },
                        "url": {name: "API",disabled:function(key,opt){
                            var node = $.ui.fancytree.getNode(opt.$trigger);
                            if(node.type == "1") {
                                return true;
                            }
                            return false;
                         },
                            callback: function(key, opt){
                                var node = $.ui.fancytree.getNode(opt.$trigger);
                                showRestApi(node.data);
                            }
                        }
                    }
                });
                $("#searchDict").keyup(function(e){
                    var n,
                        tree = $.ui.fancytree.getTree(),
                        args = "autoApply autoExpand fuzzy hideExpanders highlight leavesOnly nodata".split(" "),
                        opts = {},
                        filterFunc = $("#branchMode").is(":checked") ? tree.filterBranches : tree.filterNodes,
                        match = $(this).val();
                    if(match) {
                        $.each(args, function(i, o) {
                            opts[o] = $("#" + o).is(":checked");
                        });
                        opts.mode = $("#hideMode").is(":checked") ? "hide" : "dimm";
                        if(e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === ""){
                            $("button#btnResetSearch").click();
                            return;
                        }
                        if($("#regex").is(":checked")) {
                            // Pass function to perform match
                            n = filterFunc.call(tree, function(node) {
                                return new RegExp(match, "i").test(node.title);
                            }, opts);
                        } else {
                            // Pass a string to perform case insensitive matching
                            n = filterFunc.call(tree, match, opts);
                        }
                        $("button#btnResetSearch").attr("disabled", false);
                        $("span#matches").text("(" + n + " matches)");
                    }else{
                        tree.clearFilter();
                    }
                }).focus();
            });
        }

        function refreshDictTree() {
            map = {};
            dictList = [];
            mapDicts = {};
            Dict.query(function(data) {
                var tree = $("#dictTree").fancytree("getTree");
                tree.options.source= convertDataToFancyTreeNode(data);
                tree.reload();
                setTimeout(function () {
                    tree.activateKey(activeKey);
                },300)
            });
        }

        function convertDataToFancyTreeNode(data) {

            data.forEach(function (item) {
                map[item.id] = item;
            });
            mapDicts = angular.copy(map);

            data.forEach(function (item) {
                item["key"] = item.id;
                item["id"] = item.id;
                item["type"] = item.type;
                item["title"] = item.label;
                item["selected"] = false;
                //0 folder 1 dict
                if (item.type == "0") {
                    item["folder"] = true;
                    item["expanded"] = false;
                }
            });

            data.forEach(function (item) {
                var parent = map[item.pid];
                if (parent) {
                    (parent.children || ( parent.children = [] )).push(item);
                } else {
                    dictList.push(item);
                }
            });

            return dictList;

        }



        function save () {
            if (vm.dict.id !== null) {
                Dict.update(vm.dict, onSaveSuccess, onSaveError);
            } else {
                Dict.save(vm.dict, onSaveSuccess, onSaveError);
            }
        }

        function del(dict){
            var isDel =confirm("确定删除"+dict.label+"吗？");
            if (isDel) {
                activeKey = vm.dict.pid;
                var idList = [];
                idList.push(vm.dict.id);
                var children = map[vm.dict.id].children;

                if(vm.dict.type == "0" && children) {
                    pushChildrenIds(children,idList);
                }

                Dict.delDicts(idList).then(
                    function () {
                        refreshDictTree();
                    },function () {

                    }
                )

            }
        }

        function pushChildrenIds(children,idList) {
            angular.forEach(children,function (obj) {
                idList.push(obj.id);
                if (obj.type == "0") {
                    if (obj.children != null && obj.children.length > 0) {
                        pushChildrenIds(obj.children,idList);
                    }
                }
            })
        }
        
        function getSort(id) {

            var sort = 0;

            var mapSorts = angular.copy(dictList);
            if(id) {
                mapSorts = angular.copy(map[id].children);
            }

            var dictObj = {sort:0};
            angular.forEach(mapSorts,function (obj) {

                if(!id) {
                    if(!obj.pid) {
                        dictObj = obj;
                    }
                }else{
                    dictObj = obj;
                }
            })

            sort = Number(dictObj.sort)+1;

            return sort;

        }


        function createModule() {
            activeKey = "";
            var tree = $("#dictTree").fancytree("getTree");
            tree.activateKey(activeKey);
            var sort = getSort(null);
            vm.isDict = true;
            vm.dict = {type:"0",disabled:0,sort:sort}
            vm.pLabel = "模块目录";
        }

        function onSaveSuccess (data) {
            activeKey = data.id;
            messageService.toast('success', 'Saved');
            refreshDictTree();
        }

        function onSaveError (error) {
            messageService.toast('error', error.data.title);
            refreshDictTree();
        }



        function showRestApi(dict) {
            $state.go("dict.api",{id:dict.id});
        }
     }

})();

(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('jhi-configuration', {
            parent: 'admin',
            url: '/configuration',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'configuration.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/configuration/configuration.html',
                    controller: 'JhiConfigurationController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('configuration');
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .factory('JhiConfigurationService', JhiConfigurationService);

    JhiConfigurationService.$inject = ['$filter', '$http', '$q'];

    function JhiConfigurationService($filter, $http, $q) {
        var service = {
            get: get,
            getEnv: getEnv,
            hotReloadShiro: hotReloadShiro
        };

        return service;

        function get() {
            return $http.get('management/configprops').then(getConfigPropsComplete);

            function getConfigPropsComplete(response) {
                var properties = [];
                angular.forEach(response.data, function (data) {
                    properties.push(data);
                });
                var orderBy = $filter('orderBy');
                return orderBy(properties, 'prefix');
            }
        }

        function getEnv() {
            return $http.get('management/env').then(getEnvComplete);

            function getEnvComplete(response) {
                var properties = {};
                angular.forEach(response.data, function (val, key) {
                    var vals = [];
                    angular.forEach(val, function (v, k) {
                        vals.push({key: k, val: v});
                    });
                    properties[key] = vals;
                });
                return properties;
            }
        }

        function hotReloadShiro() {
            //console.log("Run hotReloadShiro");
            return $http.get('api/shiro/reload').then(function (result, status) {
                return "Success";
            });
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('JhiConfigurationController', JhiConfigurationController);

    JhiConfigurationController.$inject = ['$filter', 'JhiConfigurationService'];

    function JhiConfigurationController(filter, JhiConfigurationService) {
        var vm = this;

        vm.allConfiguration = null;
        vm.configuration = null;


        JhiConfigurationService.get().then(function (configuration) {
            vm.configuration = configuration;
        });
        JhiConfigurationService.getEnv().then(function (configuration) {
            vm.allConfiguration = configuration;
        });
    }
})();
