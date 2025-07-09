/**
 *
 * @author Joker Liu (qdjoker@126.com), created on 04/27/2020
 */
(function () {

    /**
     * @ngdoc module
     * @name oplus.app
     */
    angular.module('oplus.ssc', [
        'oplus.commons',
        'oplus.uaa'
    ]);
})();

/**
 * @author chy 2021-12-17
 */

(function () {
    'use strict';
    angular.module('oplus.ssc').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc', {
                url: '/ssc',
                useAsApplet: {
                    type:'PrivateTool',
                    code: 'ssc',
                    title: 'System Settings Center',
                    icon: 'fa-cog',
                    color: '#333'
                },
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/ssc/ssc-index.html'
                    }
                }
            })

            // AppRes
            .state('app.ssc.appres', {
                url: '/appres',
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/ssc/appres/appres-index.html'
                    }
                }
            })
            .state('app.ssc.appres.job', {
                url: '/job',
                views: {
                    'appres_main_view': {
                        template: '<job-list show-applet="false" show-navigation="true" applet-code="$ctrl.appletCode" class="d-block h-100 scroll-y"></job-list>'
                    }
                }
            })
            .state('app.ssc.appres.page', {
                url: '/page',
                views: {
                    'appres_main_view': {
                        template: '<page-list show-applet="true" applet-code="$ctrl.appletCode" class="d-block h-100"></page-list>'
                    }
                }
            })
            .state('app.ssc.appres.dataset', {
                url: '/dataset',
                views: {
                    'appres_main_view': {
                        template: '<dataset-list show-applet="true"' +
                            ' ui-view-url="\'edit_dataset\'"' +
                            ' create-state="\'app.dts.datasource_datasets.dts_dataset_new\'"' +
                            ' edit-state="\'app.dts.datasource_datasets.dts_dataset_edit\'"' +
                            ' dataset-state="\'app.dts.datasource_datasets\'"></dataset-list>'
                    }
                }
            })


            // Datasource
            .state('app.ssc.datasource', {
                url: '/datasource',
                views: {
                    'ssc_main': {
                        template: '<datasource-list ' +
                            ' create-state="\'app.ssc.datasource_create\'" ' +
                            ' create-params="{type: \'ssc\'}" ' +
                            ' edit-state="\'app.ssc.datasource.edit\'" ' +
                            ' ></datasource-list> '
                    }
                }
            })
            .state('app.ssc.datasource_create', {
                url: '/datasource/create?type',
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/dts/datasource-new.html',
                        controller: 'DatasourceNewCtrl',
                        controllerAs: 'ctrl'
                    }
                }
            })
            .state('app.ssc.datasource_create.type', {
                url: '/:type',
                templateUrl: 'app/modules/dts/datasource-edit.html',
                controller: 'DatasourceEditCtrl'
            })
            .state('app.ssc.datasource.edit', {
                url: '/:id/edit',
                views: {
                    'dts_main_datasource_content': {
                        controller: 'DatasourceEditCtrl',
                        templateUrl: 'app/modules/dts/datasource-edit.html'
                    }
                }
            })

            // Config
            .state('app.ssc.config', {
                url: '/config',
                views: {
                    'ssc_main': {
                        template: '<div ui-view="ssc_config"></div>'
                    }
                }
            })
        ;
    }]);
})();

/**
 * @author wuqiang@famessoft.com, created on 2020/08/10
 */
(function () {
    'use strict';

    /**
     * @ngdoc
     * @private
     */
    angular.module('oplus.ssc').service('paramDao', paramRemoteDao);

    paramRemoteDao.$inject = ['$http', 'restUtils'];

    /**
     * DAO for remote database
     * @param $http
     * @param restUtils {restUtils}
     */
    function paramRemoteDao($http, restUtils) {

        var module = "adm";

        this.findParamByTenantId = findParamByTenantId;
        this.findAllParam = findAllParam;
        this.findParamById = findParamById;
        this.saveParam = saveParam;
        this.deleteParam = deleteParam;

        function findParamByTenantId() {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-param');
        }

        function findAllParam(options) {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-param');
        }

        function saveParam(id) {
            if (!id) {
                return restUtils.callApi(module, 'POST', '/api/adm/tenant-param', null, id);
            } else {
                return restUtils.callApi(module, 'PUT', '/api/adm/tenant-param', null, id);
            }
        }

        function findParamById(id) {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-param/{id}', {id: id});
        }

        function deleteParam(id) {
            return restUtils.callApi(module, 'DELETE', '/api/adm/tenant-param/{id}', {id: id});
        }



    }
})();

(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.param', {
                url: '/params',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/param/param.html';
                        },
                        controller: 'admParamCtrl',
                    }
                }
            })
            .state('app.ssc.config.param.new_app', {
                url: '/app/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/app/param-dialog.html',
                        controller: 'tenantParamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    value: null,
                                    tenantId: null,
                                    description: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.edit_app', {
                url: '/app/{id}/edit',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/app/param-dialog.html',
                        controller: 'tenantParamDialogController',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    value: null,
                                    tenantId: null,
                                    description: null,
                                    id: $stateParams.id
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.delete_app', {
                url: '/app/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/app/param-delete.html',
                        controller: 'tenantParamDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    value: null,
                                    tenantId: null,
                                    description: null,
                                    id: $stateParams.id
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.param', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.detail_app', {
                url: '/app/{id}/detail',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/app/param-dialog.html',
                        controller: 'tenantParamDetailController',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    value: null,
                                    tenantId: null,
                                    description: null,
                                    id: $stateParams.id
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })

            .state('app.ssc.config.param.new_sys', {
                url: '/sys/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/sys/param-dialog.html',
                        controller: 'SscParamDialogController',
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
                        $state.go('^', {}, {
                            reload: result.action != "cancel"
                        });
                    }, function () {
                        $state.go('app.ssc.config.param');
                    });
                }]
            })
            .state('app.ssc.config.param.edit_sys', {
                url: '/sys/{id}/edit',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/sys/param-dialog.html',
                        controller: 'SscParamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({
                                    id: $stateParams.id
                                }).$promise;
                            }]
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {
                            reload: result.action != "cancel"
                        });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.delete_sys', {
                url: '/sys/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/sys/param-delete-dialog.html',
                        controller: 'SscParamDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({
                                    id: $stateParams.id
                                }).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.param', null, {
                            reload: 'app.ssc.config.param'
                        });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.detail_sys', {
                url: '/sys/{id}/detail',
                data: {
                    authorities: [],
                    pageTitle: 'param.detail.title'
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/sys/param-detail.html',
                        controller: 'SscParamDetailController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({
                                    id: $stateParams.id
                                }).$promise;
                            }],
                            previousState: ["$state", function ($state) {
                                var currentStateData = {
                                    name: $state.current.name || 'app.ssc.config.param',
                                    params: $state.params,
                                    url: $state.href($state.current.name, $state.params)
                                };
                                return currentStateData;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.param', null, {reload: 'app.ssc.config.param'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
        ;
    }]);
})();

/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/10
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('paramService', paramService);



    paramService.$inject = ['paramDao'];

    /**
     * Service for param
     * @param paramDao {localDaoFactory}
     * @param $q
     * @param restUtils {restUtils}
     */
    function paramService(paramDao) {

        this.findParamByTenantId = paramDao.findParamByTenantId;
        this.findAllParam = paramDao.findAllParam;
        this.findParamById = paramDao.findParamById;
        this.saveParam = paramDao.saveParam;
        this.deleteParam = paramDao.deleteParam;

    }

})();


/**
 *
 * @author wuqiang@famessoft.com , created on 2020-08-07.
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('admParamCtrl', admParamCtrl);

    admParamCtrl.$inject = ['$scope', '$state', '$compile', '$stateParams', '$location', '$q', 'paramService', 'Param', '$translate'];

    function admParamCtrl($scope, $state, $compile, $stateParams, $location, $q, paramService, Param, $translate) {
        $scope.activeTab = 'sysParams';

        sysControlQuery();
        appControlQuery();

        function sysControlQuery() {
            var tableColumnConfig = [
                {mData: 'domain', title: $translate.instant("ssc.params.sys.list.domain")},
                {mData: 'name', title: $translate.instant("ssc.params.sys.list.param.name")},
                {
                    mData: 'value',
                    title: $translate.instant("ssc.params.sys.list.param.value"),
                    className: 'cac-text-overflow',
                    width: '400px',
                    render: function (data, type, row, meta) {
                        return '<span' +
                            ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 400px;"' +
                            ' title=/""' + row.value + '"/">' + row.value + '</span>';
                    }
                },
                {
                    mData: 'description',
                    title: $translate.instant("ssc.params.sys.list.desc"),
                    className: 'cac-text-overflow',
                    width: '400px',
                    render: function (data, type, row, meta) {
                        return '<span' +
                            ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 400px;"' +
                            ' title="' + row.description + '">' + row.description + '</span>';
                    }
                },
                {
                    mData: 'id',
                    title: $translate.instant("ssc.params.sys.list.action"),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {

                        var param = angular.toJson({ id: row.id });

                        var btns = '' +
                            ' <button type="submit" ui-sref=app.ssc.config.param.detail_sys(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down" data-translate="common.action.view"></span>' +
                            ' </button>&nbsp;&nbsp;' +
                            ' <button type="submit" ui-sref=app.ssc.config.param.edit_sys(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                            ' </button>&nbsp;&nbsp;';

                        if (!row.cannotDelete)
                            btns += '' +
                                ' <button type="submit" ui-sref=app.ssc.config.param.delete_sys(' + param + ') class="btn btn-danger btn-sm">' +
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

            $scope.sysTableConfig = {
                data: [sysGetPromise],
                columns: tableColumnConfig,
                order: [[1, 'desc']],
                buttons: ['reload']
            }

            function sysGetPromise() {
                var deferred = $q.defer();
                Param.query(function (result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            }
        }

        function appControlQuery() {
            var tableColumnConfig = [
                {mData: 'name', title: $translate.instant("adm.content.param_name")},
                {mData: 'value', title: $translate.instant("adm.content.param_value")},
                {mData: 'description', title: $translate.instant("common.entity.detail.description")},
                {
                    mData: 'id', title: $translate.instant("common.entity.detail.operation"),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {

                        var param = angular.toJson({id: row.id});
                        return ' <button uaa-has-permission="adm:view:*" type="submit" ui-sref=app.ssc.config.param.detail_app(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down">'+$translate.instant("common.entity.action.view")+'</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" type="submit" ui-sref=app.ssc.config.param.edit_app(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down">'+$translate.instant("common.entity.action.edit")+'</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" type="submit" ui-sref=app.ssc.config.param.delete_app(' + param + ') class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down">'+$translate.instant("common.entity.action.delete")+'</span>' +
                            ' </button>';
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                }
            ];


            $scope.appTableConfig = {
                data: [appGetPromise, ''],
                columns: tableColumnConfig,
                order: [[1, 'desc']],
                buttons: ['reload']
            }

            function appGetPromise() {
                return paramService.findParamByTenantId();
            }
        }

    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('SscParamDialogController', ParamDialogController);

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
        .module('oplus.ssc')
        .controller('SscParamDetailController', ParamDetailController);

    ParamDetailController.$inject = ['$scope', '$rootScope', '$filter', '$timeout', '$uibModalInstance', 'previousState', 'entity'];

    function ParamDetailController($scope, $rootScope, $filter, $timeout, $uibModalInstance, previousState, entity) {
        var vm = this;

        vm.param = entity;
        vm.clear = clear;
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


        function clear() {
            $uibModalInstance.dismiss({action: "cancel"});
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('SscParamDeleteController', ParamDeleteController);

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
                    messageService.toast("success", $translate.instant("adm.content.delete_success"));
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                });
        }
    }

})();

/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/12
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('tenantParamDialogController', tenantParamDialogController);

    tenantParamDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'paramService', 'entity'];

    function tenantParamDialogController($timeout, $scope, $stateParams, $uibModalInstance, paramService, entity) {
        var vm = this;
        vm.clear = clear;
        vm.param = entity;
        var id = entity.id;
        vm.save = save;
        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();
        });


        function clear() {
            $uibModalInstance.close({action: "cancel"});
            $uibModalInstance.dismiss({action: "cancel"});
        }

        function save() {
            vm.isSaving = true;
            paramService.saveParam(vm.param).then(function (result) {
                onSaveSuccess(result);
                onSaveError();
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
        }

        if (id !== null) {
            paramService.findParamById(id).then(function (data) {
                return vm.param = data;
            }).catch(function (err) {
                throw err;
            });
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

/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/12
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('tenantParamDeleteController', tenantParamDeleteController);

    tenantParamDeleteController.$inject = ['$uibModalInstance', 'entity', 'messageService','paramService','$translate'];

    function tenantParamDeleteController($uibModalInstance, entity, messageService,paramService,$translate) {
        var vm = this;

        vm.param = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            paramService.deleteParam(id).then(function () {
                messageService.toast("success", $translate.instant("adm.content.delete_success"));
                $uibModalInstance.close(true);
            }).catch(function (err) {
                messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                $uibModalInstance.close(true);
                throw err;
            });
        }
    }

})();

/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/13
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('tenantParamDetailController', tenantParamDetailController);

    tenantParamDetailController.$inject = ['$scope','$stateParams','paramService','entity','$uibModalInstance'];

    function tenantParamDetailController($scope,$stateParams,paramService,entity,$uibModalInstance) {
        var vm = this;
        vm.clear = clear;
        vm.param = entity;
        var id = entity.id;

        vm.detailSign = true;//标记为详情

        if (id !== null) {
            findById(id);
        }

        function findById(id) {
            paramService.findParamById(id).then(function (data) {
                vm.param = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function clear() {
            $uibModalInstance.close({action: "cancel"});
            $uibModalInstance.dismiss({action: "cancel"});
        }
    }
})();

/**
 * @author yangbin@famessoft.com, created on 2020/09/10
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('TeamDao', TeamDao);

    TeamDao.$inject = ['$http', 'restUtils'];

    /**
     * DAO for remote database
     * @param $http
     * @param restUtils {restUtils}
     */
    function TeamDao($http, restUtils) {

        var module = "portal";
        
        this.findTeamById = findTeamById;
        this.findTeams = findTeams;
        this.deleteTeamById = deleteTeamById;
        this.saveTeam = saveTeam;

        function findTeamById(id) {
            return restUtils.callApi(module, 'GET', '/api/team/{id}', {id: id});
        }

        function findTeams() {
            return restUtils.callApi(module, 'GET', '/api/team');
        }

        function deleteTeamById(id) {
            return restUtils.callApi(module, 'DELETE', '/api/team/{id}', {id: id});
        }

        function saveTeam(team) {
            return restUtils.callApi(module,'POST', '/api/team', null, team);

        }


    }
})();

(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.team', {
                url: '/team',
                views: {
                    'ssc_config': {
                        templateUrl: 'app/modules/ssc/team/team.html',
                        controller: 'TeamController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.ssc.config.team.edit', {
                url: '/{id}/edit',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/team/team-dialog.html',
                        controller: 'TeamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Team', function (Team) {
                                return Team.findTeamById($stateParams.id);
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.team', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.team.new', {
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/team/team-dialog.html',
                        controller: 'TeamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    tenantId: null,
                                    description: null,
                                    code: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.team', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('app.ssc.config.team');
                    });
                }]
            })
            .state('app.ssc.config.team.delete', {
                // url: '/{id}/{name}/delete',
                url: '/{id}/delete',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/team/team-delete-dialog.html',
                        controller: 'TeamDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: function () {
                                return {
                                    id: $stateParams.id,
                                    // name: $stateParams.name,
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.team', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
        ;
    }]);
})();

(function () {
    'use strict';

    angular.module('oplus.ssc').service('Team', Team);


    Team.$inject = ['TeamDao', '$q', '$http'];


    function Team(TeamDao, $q, $http) {

        this.findTeamById = TeamDao.findTeamById;
        this.findTeams = TeamDao.findTeams;
        this.deleteTeamById = TeamDao.deleteTeamById;

        this.getAllUsersBasicInfo = function (tenantId) {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users/basic" + (tenantId === undefined ? "" : ("?tenantId=" + tenantId)))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        this.saveTeam = TeamDao.saveTeam;
    }

})();


(function () {
    'use strict';

    angular.module('oplus.ssc').controller('TeamController', TeamController);

    TeamController.$inject = ['$scope', '$uibModal', '$compile', 'dataTable', 'Team', '$translate'];

    function TeamController($scope, $uibModal, $compile, dataTable, Team, $translate) {

        /*(function initTeam() {
            Team.findTeams().then(function (data) {
                dataTable.initTable(".team-table", tableColumnConfig, data);
            }).catch(function (err) {
                throw err;
            });
        })();*/

        controlQuery();

        function controlQuery() {
            var tableColumnConfig =
                [
                    {mData: 'name', title: $translate.instant('team.name')},
                    {mData: 'code', title: $translate.instant('team.code')},
                    {mData: 'description', title: $translate.instant('team.description')},
                    {
                        mData: 'updatedAt',
                        title: $translate.instant('team.update_time'),
                        render: function (data, type, row, meta) {
                            if (data) {
                                return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        mData: 'id',
                        title: $translate.instant('team.operation'),
                        class: 'text-center',
                        searchable: false,
                        // orderable: false,
                        render: function (data, type, row, meta) {
                            // var param = angular.toJson({id: row.id, tenant_id: row.tenantId, name: row.name});
                            var id = angular.toJson({id: row.id});
                            return ' <button type="submit" ui-sref=app.ssc.config.team.edit(' + id + ') class="btn btn-default btn-sm">' +
                                '     <span class="hidden-sm-down" data-translate="common.action.edit"></span>' +
                                ' </button>' +
                                ' <button type="submit" ui-sref=app.ssc.config.team.delete(' + id + ') class="btn btn-danger btn-sm">' +
                                '     <span class="hidden-sm-down" data-translate="common.action.delete"></span>' +
                                ' </button>';
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
                return Team.findTeams();
            }
        }


    }

})();

(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('TeamDialogController', TeamDialogController);

    TeamDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Team', 'currentUser', 'messageService'];

    function TeamDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, Team, currentUser, messageService) {
        var vm = this;
        vm.team = entity;
        vm.clear = clear;
        vm.save = save;
        vm.users = [];
        var selectedUserMap = {};

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        init();

        function init() {
            initUsers();
            var selectedUsers = entity.users;
            for (var i in selectedUsers) {
                var user = selectedUsers[i];
                user.isChecked = true;
                selectedUserMap[user.tenantUserId] = user;
            }
        }


        function initUsers() {
            var tid = currentUser.tenantId;
            Team.getAllUsersBasicInfo(tid).then(function (result) {
                if (result !== undefined && result.length > 0) {
                    //push all user info selectedUserMap
                    for (var j in result) {
                        var user = result[j];
                        var tenantUserId = user.tenantUserId;
                        var selectedUser = selectedUserMap[tenantUserId];
                        if (selectedUser !== undefined) {
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
            var selectedUsers = [];
            for (var i in selectedUserMap) {
                if (selectedUserMap[i].isChecked) {
                    selectedUsers.push(selectedUserMap[i]);
                }
            }
            vm.team.users = selectedUsers;
            Team.saveTeam(vm.team).then(function (result) {
                onSaveSuccess(result);
            }).catch(function (err) {
                onSaveError(err);
                throw err;
            });
        }

        function onSaveSuccess(result) {
            messageService.toast('success', 'success');
            $uibModalInstance.close(true);
            vm.isSaving = false;
        }

        function onSaveError(err) {
            messageService.toast('error', "fail:" + err.message);
            vm.isSaving = false;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('TeamDeleteController', TeamDeleteController);

    TeamDeleteController.$inject = ['$uibModalInstance', 'entity', 'Team', '$translate', 'messageService'];

    function TeamDeleteController($uibModalInstance, entity, Team, $translate, messageService) {
        var vm = this;

        vm.team = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            Team.deleteTeamById(id).then(function () {
                messageService.toast("success", $translate.instant('team.deleted'));
                $uibModalInstance.close(true);
            }).catch(function (err) {
                messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                $uibModalInstance.close(true);
                throw err;
            });
        }
    }
})();

/**
 * @author yangbin@famessoft.com, created on 2022/07/27
 *
 */
(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.tag', {
                url: '/tags',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/tags/tag.html';
                        },
                        controller: 'udpTagsCtrl'
                    }
                }
            })
            .state('app.ssc.config.tag.new', {
                url: '/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/tags/tag-dialog.html',
                        controller: 'udpTagDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'sm',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    tenantId: null,
                                    type: "C",
                                    id: null
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action !== "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.tag.edit', {
                url: '/{id}/edit',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/tags/tag-dialog.html',
                        controller: 'udpTagDialogController',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            entity: ['udpTagsService', function (udpTagsService) {
                                return udpTagsService.findTagById($stateParams.id)
                            }]
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action !== "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.tag.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/tags/tag-delete.html',
                        controller: 'udpTagDeleteController',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    tenantId: null,
                                    id: $stateParams.id
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.tag.detail', {
                url: '/{id}/detail',
                onEnter: ['$stateParams', '$state', '$uibModal', 'udpTagsService', function ($stateParams, $state, $uibModal, udpTagsService) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/tags/tag-detail.html',
                        controller: 'udpTagDetailController',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return udpTagsService.findTagById($stateParams.id);
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
        ;
    }]);
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('udpTagsService', udpTagsService);

    udpTagsService.$inject = ['$q', 'restUtils'];

    function udpTagsService($q, restUtils) {
        var module = "udp";
        this.findTagsByTenantId = findTagsByTenantId;
        this.findTagsByTenantIdAndTotal = findTagsByTenantIdAndTotal;
        this.findAppletByTagId = findAppletByTagId;
        this.findTagById = findTagById;
        this.findTagByName = findTagByName;
        this.saveTag = saveTag;
        this.deleteTagById = deleteTagById;
        this.deleteAppletMapperByTagId = deleteAppletMapperByTagId;

        /**
         * param tagId, appletIds.
         * @param param
         */
        function deleteAppletMapperByTagId(param){
            return restUtils.callApi(module, 'POST', '/api/udp/tags/mapper/remove', null, param);
        }

        function findTagsByTenantIdAndTotal() {
            return restUtils.callApi(module, 'GET', '/api/udp/tags/total');
        }

        function findAppletByTagId(tagId) {
            return restUtils.callApi('udp', 'GET', '/api/udp/tags/applet/{id}', {id:tagId});
        }

        function findTagsByTenantId() {
            return restUtils.callApi(module, 'GET', '/api/udp/tags');
        }

        function saveTag(tag) {
            if (!tag.id) {
                return restUtils.callApi(module, 'POST', '/api/udp/tags', null, tag);
            } else {
                return restUtils.callApi(module, 'PUT', '/api/udp/tags', null, tag);
            }
        }

        function findTagById(id) {
            return restUtils.callApi(module, 'GET', '/api/udp/tags/id/{id}', {id: id});
        }

        function findTagByName(name) {
            return restUtils.callApi(module, 'GET', '/api/udp/tags/name/{name}', {name: name});
        }

        function deleteTagById(id) {
            return restUtils.callApi(module, 'DELETE', '/api/udp/tags/{id}', {id: id});
        }
    }

})();


/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('udpTagsCtrl', udpTagsCtrl);

    udpTagsCtrl.$inject = ['$scope', '$state', '$compile', '$stateParams', '$location', 'messageService', 'udpTagsService', 'dataTable', '$translate'];

    function udpTagsCtrl($scope, $state, $compile, $stateParams, $location, messageService, udpTagsService, dataTable, $translate) {

        controlQuery();

        function controlQuery() {
            var tableColumnConfig = [
                {mData: 'name', title: $translate.instant("adm.content.udp.tag.name")},
                {mData: 'count', title: $translate.instant("adm.content.udp_tag_count")},
                {
                    mData: 'id', title: $translate.instant("common.entity.detail.operation"),
                    className: 'text-right',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var param = angular.toJson({id: row.id});
                        return ' <button uaa-has-permission="adm:view:*" type="submit" ui-sref=app.ssc.config.tag.detail(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.view") + '</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" type="submit" ui-sref=app.ssc.config.tag.edit(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.edit") + '</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" type="submit" ui-sref=app.ssc.config.tag.delete(' + param + ') class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.delete") + '</span>' +
                            ' </button>';
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                }
            ];

            $scope.tableConfig = {
                data: [getTagsByTenantId, ''],
                columns: tableColumnConfig,
                order: [[0, 'desc']],
                buttons: ['reload']
            };
        }

        function getTagsByTenantId() {
            return udpTagsService.findTagsByTenantIdAndTotal();
        }

    }
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('udpTagDialogController', udpTagDialogController);

    udpTagDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'udpTagsService', 'entity'];

    function udpTagDialogController($timeout, $scope, $stateParams, $uibModalInstance, udpTagsService, entity) {
        var vm = this;
        vm.clear = clear;
        vm.tag = entity;
        var id = entity.id;
        vm.save = save;
        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();
        });


        function clear() {
            $uibModalInstance.close({action: "cancel"});
            $uibModalInstance.dismiss({action: "cancel"});
        }

        function save() {
            vm.isSaving = true;
            udpTagsService.saveTag(vm.tag).then(function (result) {
                onSaveSuccess(result);
                onSaveError();
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
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

/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('udpTagDeleteController', udpTagDeleteController);

    udpTagDeleteController.$inject = ['$uibModalInstance', 'entity', 'messageService','udpTagsService','$translate'];

    function udpTagDeleteController($uibModalInstance, entity, messageService,udpTagsService,$translate) {
        var vm = this;

        vm.tag = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            udpTagsService.deleteTagById(id).then(function () {
                messageService.toast("success", $translate.instant("adm.content.delete_success"));
                $uibModalInstance.close(true);
            }).catch(function (err) {
                messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                $uibModalInstance.close(true);
                throw err;
            });
        }
    }

})();

/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('udpTagDetailController', udpTagDetailController);

    udpTagDetailController.$inject = ['$scope', '$stateParams', 'entity', '$uibModalInstance', 'udpTagsService', 'messageService', '$translate'];

    function udpTagDetailController($scope, $stateParams, entity, $uibModalInstance, udpTagsService, messageService, $translate) {
        var vm = this;

        vm.tag = entity;
        vm.selected = [];

        vm.clear = clear;
        vm.removeAppletByTags = removeAppletByTags;

        function removeAppletByTags() {
            //根据tagid。 appletid集合
            var appletIds = vm.selected.join(",");
            var param = {tagId: vm.tag.id, appletId: appletIds};
            messageService.confirm($translate.instant("common.entity.delete.title"), $translate.instant("adm.content.are_you_sure_to_delete_by_applet"), function () {
                udpTagsService.deleteAppletMapperByTagId(angular.toJson(param)).then(function () {
                    messageService.toast("success", $translate.instant("adm.content.delete_success"));
                    $uibModalInstance.close(true);
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    $uibModalInstance.close(true);
                    throw err;
                });
            });

        }


        function clear() {
            $uibModalInstance.close({action: "cancel"});
            $uibModalInstance.dismiss({action: "cancel"});
        }

        controlQuery();

        function controlQuery() {
            var tableColumnConfig = [
                {
                    mData: 'title',
                    title: $translate.instant("app.list.title"),
                    render: function (data, type, row, meta) {
                        if (data.startsWith("#{")) {
                            var title = data.substring(2, data.length - 1);
                            return $translate.instant(title);
                        }
                        return data;
                    }
                },

                {mData: 'name', title: $translate.instant("app.setting.code")},
                {mData: 'version', title: $translate.instant("app.setting.version")},
                {mData: 'status', title: $translate.instant("app.setting.status")},
                {mData: 'author', title: $translate.instant('common.attr.created_by')},
                {mData: 'createdAt', title: $translate.instant('common.attr.created_at')}
            ];
            vm.tableConfig = {
                data: [getAppletByTagId, ''],
                columns: tableColumnConfig,
                order: [[1, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: 'id', labelData: 'title'
                }
            };
        }

        $scope.$watch('vm.tableConfig.selectedItems', function (newVal, oldVal) {
            vm.selected = newVal;
        }, true);

        function getAppletByTagId() {
            return udpTagsService.findAppletByTagId(vm.tag.id);
        }
    }
})();

/**
 * @author yangbin@famessoft.com, created on 2023/10/08
 *
 */
(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.applet-manage', {
                url: '/applet-manage',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/applet-manage/applet-manage.html';
                        },
                        controller: 'appletManageCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.ssc.config.applet-manage.detail', {
                url: '/{id}/detail',
                onEnter: ['$stateParams','$state','$uibModal', 'appletManageService', function ($stateParams, $state, $uibModal, appletManageService) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/applet-manage/applet-manage-detail.html',
                        controller: 'appletManageDetailCtrl',
                        controllerAs: '$ctrl',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return appletManageService.findApplteById($stateParams.id);
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.applet-manage.copy', {
                url: '/{id}/copy',
                onEnter: ['$stateParams', '$state', '$uibModal', 'appletManageService', function ($stateParams, $state, $uibModal, appletManageService) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/applet-manage/applet-manage-copy.html',
                        controller: 'appletManageCopyCtrl',
                        controllerAs: '$ctrl',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return appletManageService.findApplteById($stateParams.id);
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })

            .state('app.ssc.config.applet-manage.import', {
                url: '/import',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'app/modules/ssc/applet-manage/applet-manage-import.html',
                        controller: 'appletManageImportCtrl',
                        controllerAs: '$ctrl',
                        backdrop: 'static',
                        size: 'md'
                    }).result.then(function () {
                        $state.go('^', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.applet-manage.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/applet-manage/applet-manage-delete.html',
                        controller: 'appletManageDeleteCtrl',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    tenantId: null,
                                    id: $stateParams.id
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
    }]);
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('appletManageService', appletManageService);

    appletManageService.$inject = ['$q', 'restUtils', '$filter', 'OpDownload', 'Upload'];

    function appletManageService($q, restUtils, $filter, OpDownload, Upload) {

        var UDP_MODULE = "udp";
        var ADM_MODULE = "adm";
        this.findAllApplet = findAllApplet;
        this.findApplteById = findApplteById;

        this.exportPages = exportPages;
        this.exportAppletByIds = exportAppletByIds;
        this.importApplets = importApplets;

        this.deleteAppletById = deleteAppletById;
        this.copyApplet = copyApplet;

        this.findAllRecycledApplet = findAllRecycledApplet;
        this.deleteRecycledApplet = deleteRecycledApplet;
        this.deleteRecycledApplets = deleteRecycledApplets;
        this.clearRecycledApplets = clearRecycledApplets;
        this.recoverRecycledApplet = recoverRecycledApplet;

        this.importAppletAndScripts = importAppletAndScripts;

        function deleteAppletById(id) {
            return restUtils.callApi(ADM_MODULE, 'DELETE', '/api/adm/applet/{id}', {id: id});
        }

        function copyApplet(data) {
            return restUtils.callApi(ADM_MODULE, 'POST', '/api/adm/applet/copy', null, data);
        }

        function findApplteById(id) {
            return restUtils.callApi(ADM_MODULE, 'GET', '/api/adm/applet/id/{id}', {id: id});
        }

        function findAllRecycledApplet() {
            return restUtils.callApi(ADM_MODULE, 'GET', '/api/adm/applet/recycled');
        }

        function deleteRecycledApplet(appletCode) {
            return restUtils.callApi(ADM_MODULE, 'DELETE', '/api/adm/applet/recycled/{appletCode}', {appletCode: appletCode});
        }

        function deleteRecycledApplets(appletCodes) {
            return restUtils.callApi(ADM_MODULE, 'GET', '/api/adm/applet/recycled/delete', null, {appletCodes: appletCodes});
        }

        function recoverRecycledApplet(appletCodes) {
            return restUtils.callApi(ADM_MODULE, 'GET', '/api/adm/applet/recycled/recover', null, {appletCodes: appletCodes});
        }

        function clearRecycledApplets() {
            return restUtils.callApi(ADM_MODULE, 'POST', '/api/adm/applet/recycled/clear');
        }


        function findAllApplet() {
            return restUtils.callApi(UDP_MODULE, 'GET', '/api/udp/applets');
        }

        function exportAppletByIds(appletVm, currentTime) {
            var url = restUtils.getApiUrl('adm', '/api/adm/applet/export/relation');
            OpDownload.download(url, "applet-manager-" + currentTime + ".zip", 'POST', null, appletVm);
        }

        function importApplets(importType, udpAppletList) {

            return restUtils.callApi(ADM_MODULE, 'POST', '/api/adm/applet/import/relation/{importType}',
                {importType: importType},
                udpAppletList);
        }

        function exportPages(appletsTree) {
            var dateDate = $filter("date")(new Date(), "yyyyMMddHHmmss");
            var blob = new Blob([angular.toJson(appletsTree)], {type: 'text/plain;charset=utf-8'});
            return saveAs(blob, 'oplus-applet-list-' + dateDate + '.json');
        }

        function importAppletAndScripts(fileInfo) {
            var d = $q.defer();
            var url = restUtils.getApiUrl('adm', '/api/adm/applet/pre-upload/scripts');
            Upload.upload({
                url: url, // data: {file: fileInfo.file, options: Upload.json(fileInfo.options), dir: fileInfo.dir}
                file: fileInfo
            }).then(function (resp) {
                d.resolve(resp.data);
            }, function (resp) {
                var error = restUtils.guessError(resp);
                d.reject(error);
            });
            return d.promise;
        }
    }


})();


/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageCtrl', appletManageCtrl);

    appletManageCtrl.$inject = ['$scope', '$rootScope', '$state', '$filter', '$compile', '$stateParams', '$uibModal', '$location', 'messageService', 'appletManageService', 'dataTable', '$translate'];

    function appletManageCtrl($scope, $rootScope, $state, $filter, $compile, $stateParams, $uibModal, $location, messageService, appletManageService, dataTable, $translate) {
        var vm = this;
        vm.$onInit = onInit;

        vm.activeTab = 'app';
        $scope.appletsTableConfig = {};
        vm.exportApplet = exportApplet;

        function onInit() {
            appletControlQuery();
            recycledAppletsControlQuery();
        }

        function exportApplet(ids){
           $uibModal.open({
                templateUrl: 'app/modules/ssc/applet-manage/applet-manage-export.html',
                controller: 'appletManageExportCtrl',
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    ids: function() { return ids; }
                }
            });
        }

        function appletControlQuery() {
            var tableColumnConfig = [
                {mData: 'name', title: "Code"},
                {mData: 'title', title: $translate.instant('ssc.applet.manage.list.title')},
                {
                    data: 'status',
                    title: $translate.instant('ssc.applet.manage.list.status'),
                    render: function (data, type, row, meta) {
                        if (data === 'P') {
                            return "<span class='badge bg-success'>" + $translate.instant("ssc.applet.manage.list.status.enabled") + "</span>"
                        }
                        return "<span class='badge bg-danger'>" + $translate.instant("ssc.applet.manage.list.status.disabled") + "</span>";
                    }
                },

                {mData: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    mData: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                },

                {
                    mData: 'modifiedAt',
                    title: $translate.instant('common.attr.updated_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                },


                {
                    mData: 'id', title: $translate.instant("common.entity.detail.operation"),
                    className: 'text-right',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var param = angular.toJson({id: row.id});
                        return ' <button uaa-has-permission="adm:view:*" type="submit" ui-sref=app.ssc.config.applet-manage.detail(' + param + ') class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.view") + '</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" type="submit" ui-sref=app.ssc.config.applet-manage.copy(' + param + ') class="btn btn-warning btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.copy") + '</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" type="submit" ui-sref=app.ssc.config.applet-manage.delete(' + param + ') class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.delete") + '</span>' +
                            ' </button>';
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                }
            ];

            $scope.appletsTableConfig = {
                data: [appletManageService.findAllApplet, ''],
                columns: tableColumnConfig,
                selection: {
                    valueData: 'id', labelData: 'title', preselected: []
                },
                order: [[0, 'desc']],
                buttons: ['reload']
            };

        }


        function recycledAppletsControlQuery() {
            var tableColumnConfig = [
                {
                    mData: 'appletCode',
                    title: "Code"
                },
                {
                    mData: 'title',
                    title: $translate.instant('ssc.applet.manage.list.title')
                },
                {
                    mData: 'createBy',
                    title: $translate.instant('common.attr.created_by')
                },
                {
                    data: 'createTime',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                },

                {
                    mData: 'id',
                    title: $translate.instant("common.entity.detail.operation"),
                    className: 'text-right',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return ' <button uaa-has-permission="adm:edit:*" ng-click="$ctrl.recoverRecycle(\'' + row.appletCode + '\')" class="btn btn-warning btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("adm.applet.recover") + '</span>' +
                            ' </button>' +
                            ' <button uaa-has-permission="adm:edit:*" ng-click="$ctrl.deleteRecycle(\'' + row.appletCode + '\')" class="btn btn-danger btn-sm">' +
                            '     <span class="hidden-sm-down">' + $translate.instant("common.entity.action.delete") + '</span>' +
                            ' </button>';
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                }
            ];

            $scope.recycledAppletsTableConfig = {
                data: [appletManageService.findAllRecycledApplet, ''],
                columns: tableColumnConfig,
                selection: {
                    valueData: 'appletCode',
                    labelData: 'title',
                    preselected: []
                },

                order: [
                    [0, 'desc']
                ],
                buttons: ['reload']
            };
        }


        vm.deleteRecycle = function (appletCode) {
            messageService.confirm($translate.instant('common.entity.action.delete'), $translate.instant('adm.content.are_you_sure_to_delete_by_applet'), function () {
                appletManageService.deleteRecycledApplet(appletCode).then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });
        }

        vm.deleteSelectedRecycle = function () {
            messageService.confirm($translate.instant('common.entity.action.delete'), $translate.instant('adm.content.are_you_sure_to_delete_by_applet'), function () {
                var items = $scope.recycledAppletsTableConfig.selectedItems;
                appletManageService.deleteRecycledApplets(items).then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });

        }


        vm.recoverRecycle = function (appletCode) {
            messageService.confirm($translate.instant('adm.applet.recover'), $translate.instant('adm.content.are_you_sure_to_recover_by_applet'), function () {
                appletManageService.recoverRecycledApplet(appletCode).then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                    broadcastAppletChanged();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });
        }

        vm.recoverSelectedRecycle = function () {
            messageService.confirm($translate.instant('adm.applet.recover'), $translate.instant('adm.content.are_you_sure_to_recover_by_applet'), function () {

                var items = $scope.recycledAppletsTableConfig.selectedItems;

                appletManageService.recoverRecycledApplet(items).then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                    broadcastAppletChanged();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });

        }

        function broadcastAppletChanged() {
            $rootScope.$broadcast('APPLET_CHANGED');
        }

        vm.clearRecycle = function () {
            messageService.confirm($translate.instant('common.entity.action.delete'), $translate.instant('adm.content.are_you_sure_to_delete_by_applet'), function () {
                appletManageService.clearRecycledApplets().then(function (res) {
                    messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                    $scope.recycledAppletsTableConfig.reloadData();
                }).catch(function (err) {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                    throw err;
                });
            });
        }
    }
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageImportCtrl', appletManageImportCtrl);

    appletManageImportCtrl.$inject = ['$scope', '$state', '$compile', '$window',
        '$stateParams', '$uibModalInstance', '$location', '$timeout', 'messageService',
        'pageService', 'appletManageService', 'dataTable', '$translate'];

    function appletManageImportCtrl($scope, $state, $compile, $window, $stateParams, $uibModalInstance, $location, $timeout, messageService, pageService, appletManageService, dataTable, $translate) {
        var vm = this;

        $scope.displayTree = false;
        $scope.displayImport = false;
        vm.doImport = doImport;
        vm.cancelImport = cancelImport;
        vm.preUpload = preUpload;
        vm.selectedFile = {};

        function cancelImport() {
            $uibModalInstance.dismiss();
        }

        vm.appletTreeList = [];
        vm.scriptTreeList = [];
        vm.udpAppletList = [];
        vm.paths = [];
        vm.importType = "mod";
        vm.scriptsPath = undefined;
        function getAllNodesData(tree) {
            var result = [];
            function recursiveTraversal(node) {
                result.push(node.toDict());
                if (node.hasChildren()) {
                    node.children.forEach(child => recursiveTraversal(child));
                }
            }

            tree.getRootNode().children.forEach(node => recursiveTraversal(node));
            return result;
        }


        function doImport() {
            var tree = $("#appletTree").fancytree("getTree");
            var selNodes = getAllNodesData(tree);
            if (selNodes) {
                for (var i in selNodes) {
                    var nodeName = selNodes[i];
                    if (nodeName.type !== "folder") {
                        vm.udpAppletList.push(nodeName.data.value);
                    }
                }
            }
            vm.udpAppletList.forEach(e => {e.scriptsDir=vm.scriptsPath});
            appletManageService.importApplets(vm.importType, vm.udpAppletList).then(function (result) {
                messageService.toast("success", $translate.instant("adm.content.data_import_success"));
                $uibModalInstance.dismiss();
            }).catch(function (err) {
                messageService.toast("error", $translate.instant("adm.content.data_import_error"));
            });
        }


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
                var title = rawNode.name;
                if (title.indexOf("#{") >= 0) {
                    title = $translate.instant(title.substring(2, title.length - 1));
                }
                if(rawNode.zipScriptPath){
                    vm.scriptsPath = rawNode.zipScriptPath;
                }
                var node = {
                    key: rawNode.id,
                    id: rawNode.id,
                    type: rawNode.type,
                    selected: false,
                    title: title,
                    value: rawNode.value
                };
                nodeList.push(node);
                if (rawNode.type === "folder") {
                    node.folder = true;
                    node.expanded = true;
                    if (rawNode.children != null && rawNode.children.length > 0) {
                        node.children = convertDataToFancyTreeNode(rawNode.children);
                    }
                }
            }
            return nodeList;
        }


        function preUpload(file) {
            vm.selectedFile = file;
            if (vm.selectedFile) {
                appletManageService.importAppletAndScripts(vm.selectedFile).then(function (data) {
                    vm.isSaving = false;
                    if (data) {
                        parseApplet(data.Applet);
                        parseScripts(data.Scripts);
                    }
                }).catch(function (err) {
                    vm.isSaving = false;
                    throw new FatalError(err);
                });
            }
        }


        var appletTree;

        function parseApplet(content) {
            vm.appletTreeList = content;
            treeOption.source = convertDataToFancyTreeNode(content);
            if (treeOption.source.length > 0) {
                $scope.appletDisplay = true;
            }
            if (appletTree) {
                appletTree = $("#appletTree").fancytree("getTree");
                appletTree.options.source = treeOption.source;
                appletTree.reload();
            } else {
                appletTree = $("#appletTree").fancytree(treeOption);
            }
        }

        var scriptsTree;

        function parseScripts(content) {
            vm.scriptTreeList = content;
            treeOption.source = convertDataToFancyTreeNode(content);
            if (treeOption.source.length > 0) {
                $scope.scriptsDisplay = true;
            }
            if (scriptsTree) {
                scriptsTree = $("#scriptsTree").fancytree("getTree");
                scriptsTree.options.source = treeOption.source;
                scriptsTree.reload();
            } else {
                scriptsTree = $("#scriptsTree").fancytree(treeOption);
            }
        }
    }
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageExportCtrl', appletManageExportCtrl);

    appletManageExportCtrl.$inject = ['$scope',
         '$uibModalInstance',  'messageService',
         'appletManageService',  '$filter', 'ids'];

    function appletManageExportCtrl($scope, $uibModalInstance, messageService,
                                     appletManageService, $filter, ids) {
        var vm = this;
        vm.doExport = doExport;
        vm.cancelExport = cancelExport;
        vm.containsScript = false;

        function cancelExport() {
            $uibModalInstance.dismiss();
        }
        function doExport() {
            var appletVm = {
                "appletIds": ids,
                "containsScript":  vm.containsScript
            }
            var currentTime = $filter('date')(new Date(), "yyyyMMddHHmmss");
            appletManageService.exportAppletByIds(appletVm , currentTime);
            $uibModalInstance.close(true);
        }
    }
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageDetailCtrl', appletManageDetailCtrl);

    appletManageDetailCtrl.$inject = ['$scope', '$state', '$stateParams', '$translate', '$uibModalInstance', 'messageService', 'entity'];

    function appletManageDetailCtrl($scope, $state, $stateParams, $translate, $uibModalInstance, messageService, entity) {
        var vm = this;
        vm.applet = entity;
        vm.showApplet = false;


        vm.$onInit = onInit;
        vm.clear = clear;

        function onInit() {
            dtsTable(vm.applet.aouDatasetList);
            dcModelTable(vm.applet.aouDcDataModelDTOList);
            jobFlowTable(vm.applet.aouFlowDTOList);
        }

        function clear() {
            $uibModalInstance.dismiss();
        }

        function dtsTable(list) {
            var tableColumnConfig = [
                {mData: 'code', title: $translate.instant('dts.dataset.attr.code')},
                {mData: 'name', title: $translate.instant('dts.dataset.attr.name')},
                {mData: 'datasource', title: $translate.instant('dts.dataset.attr.datasource')},
                {mData: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    data: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                }
            ];
            vm.dtsTableConfig = {
                data: list,
                columns: tableColumnConfig,
                order: [[1, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: 'id', labelData: 'title'
                }
            };
        }


        function dcModelTable(list) {
            var tableColumnConfig = [
                {mData: 'code', title: $translate.instant('jao.dc.detail.code')},
                {mData: 'title', title: $translate.instant('ssc.applet.manage.detail.dc.name')},
                {mData: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    data: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                }
            ];
            vm.dcModelTableConfig = {
                data: list,
                columns: tableColumnConfig,
                order: [[1, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: 'id', labelData: 'title'
                }
            };
        }


        function jobFlowTable(list) {
            var tableColumnConfig = [
                {mData: 'name', title: $translate.instant('jao.flow.detail.name')},
                {
                    data: 'stepIds',
                    title: $translate.instant('cmd.job.steps'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        var stepList = angular.fromJson(data);
                        if (stepList) {
                            return stepList.length;
                        }
                        return 0;
                    }
                },
                {mData: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    data: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                }
            ];
            vm.jobFlowTableConfig = {
                data: list,
                columns: tableColumnConfig,
                order: [[1, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: 'id', labelData: 'title'
                }
            };
        }
    }
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageCopyCtrl', appletManageCopyCtrl);

    appletManageCopyCtrl.$inject = ['$scope', '$state', '$stateParams', '$uibModalInstance', '$translate', 'messageService', 'appletManageService', 'entity', 'currentUser'];

    function appletManageCopyCtrl($scope, $state, $stateParams, $uibModalInstance, $translate, messageService, appletManageService, entity, currentUser) {
        var vm = this;

        vm.applet = entity;
        vm.clear = clear;
        vm.confirmCopy = confirmCopy;

        vm.applet.title = vm.applet.title + ' Copy';
        vm.applet.name = vm.applet.name + 'Copy';

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmCopy() {
            var data = {
                id: vm.applet.id, 
                title: vm.applet.title,
                name: vm.applet.name,
                author: currentUser.displayName,
                createdBy: currentUser.loginId,
                createdName: currentUser.displayName,
                modifiedBy: currentUser.loginId,
                modifiedName: currentUser.displayName,
            }

            appletManageService.copyApplet(data).then(function () {
                messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                $uibModalInstance.close(true);
            }).catch(function (err) {
                messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                $uibModalInstance.close(true);
                throw err;
            });
        }
    }
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageDeleteCtrl', appletManageDeleteCtrl);

    appletManageDeleteCtrl.$inject = ['$scope', '$state', '$stateParams', '$uibModalInstance', '$translate', 'messageService', 'appletManageService', 'entity'];

    function appletManageDeleteCtrl($scope, $state, $stateParams, $uibModalInstance, $translate, messageService, appletManageService, entity) {
        var vm = this;

        vm.applet = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            appletManageService.deleteAppletById(id).then(function () {
                messageService.toast("success", $translate.instant("adm.content.delete_success"));
                $uibModalInstance.close(true);
            }).catch(function (err) {
                messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                $uibModalInstance.close(true);
                throw err;
            });
        }
    }
})();

/**
 * @author yangbin@famessoft.com, created on 2022/07/27
 *
 */
(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.email', {
                url: '/email',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/email/email.html';
                        },
                        controller: 'sscEmailCtrl',
                        controllerAs:'vm'
                    }
                }
            })
        ;
    }]);
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('sscEmailService', sscEmailService);

    sscEmailService.$inject = ['$q', 'restUtils'];

    function sscEmailService($q, restUtils) {
        var module = "portal";
        this.getEmailConfig = getEmailConfig;
        this.saveEmailConfig = saveEmailConfig;
        this.runEmailConfig = runEmailConfig;
        this.getCacEmailSwitch = getCacEmailSwitch;
        this.saveCacEmailSwitch = saveCacEmailSwitch;


        function getEmailConfig() {
            return restUtils.callApi(module, 'GET', '/api/email-config');
        }

        function saveEmailConfig(emails) {
            return restUtils.callApi(module, 'POST', '/api/email-config',null,emails);
        }

        function runEmailConfig(recipient) {
            return restUtils.callApi(module, 'GET', '/api/email-config/{recipient}', {recipient:recipient});
        }

        function getCacEmailSwitch() {
            return restUtils.callApi(module, 'GET', '/api/email-config/cac-on-off');
        }

        function saveCacEmailSwitch(S) {
            return restUtils.callApi(module, 'POST', '/api/email-config/cac-on-off', null,S);
        }

    }

})();


/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict'

    angular.module('oplus.ssc').controller('sscEmailCtrl', sscEmailCtrl);

    sscEmailCtrl.$inject = ['$scope', '$state', 'messageService', '$translate', 'sscEmailService', '$uibModal'];

    function sscEmailCtrl($scope, $state, messageService, $translate, sscEmailService, $uibModal) {
        var vm = this;

        vm.emails = {};
        vm.change = {};//变更对比

        sscEmailService.getEmailConfig().then(function (data) {
            vm.emails = data;
            vm.change = angular.copy(data);

            vm.port = parseInt(data.port);
            vm.debug_on_off = "yes" === data.debug_on_off;
            vm.ssl_on_off = "yes" === data.ssl_on_off;


        });

        $scope.recipientTypes = [
            {label: "TO", value: 'to'},
            {label: "CC", value: 'cc'},
            {label: "BCC", value: 'bcc'}
        ];
        //to 表示发送，表示期望得到该收件人的响应。
        //cc 表示抄送,表示没有期待对邮件做出回复
        //bcc 表示密件抄送。在群发邮件时，收信人彼此不认识，为了保护收信人的隐私，可以在地址栏To中填上自己，然后将所有收信人都填在Bcc中

        $scope.submitForm = function () {
            messageService.confirm($translate.instant('adm.prompt.change_operation'), $translate.instant('adm.prompt.cwtstc'), function () {
                vm.emails.port = vm.port + "";
                vm.emails.debug_on_off = vm.debug_on_off ? "yes" : "no";
                vm.emails.ssl_on_off = vm.ssl_on_off ? "yes" : "no";

                sscEmailService.saveEmailConfig(vm.emails).then(function (data) {
                    if ("200" === data.code) {
                        messageService.toast('success', $translate.instant('adm.prompt.success_change'));
                        vm.change = angular.copy(vm.emails);
                    } else {
                        messageService.toast('error', data.msg);
                    }
                }).catch(function (err) {
                    messageService.toast('error', err);
                });
            });
        }

        $scope.testEmail = function () {
            vm.emails.port = vm.port + "";
            vm.emails.debug_on_off = vm.debug_on_off ? "yes" : "no";
            vm.emails.ssl_on_off = vm.ssl_on_off ? "yes" : "no";

            let changeBoolean = true;

            _.mapKeys(vm.emails, function (val, key) {
                if(vm.emails[key] !== vm.change[key]){
                    changeBoolean = false;
                }
            });

            if(changeBoolean){
                var instance = $uibModal.open({
                    template: '' +
                        '<div class="modal-header">' +
                        '   <h3 class="modal-title">{{ \'adm.prompt.petrea\' | translate}}</h3>' +
                        '   <a ng-click="$ctrl.cancel()">' +
                        '       <i class="fa fa-times" style="font-size: 20px;"></i>' +
                        '   </a>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '   <form class="op-smartform form-vertical" ng-submit="$ctrl.recipientSubmit()">' +
                        '       <div class="form-group">\n' +
                        '           <label class="control-label">{{ \'adm.prompt.recipient_email_address\' | translate}}</label>\n' +
                        '           <input type="email" class="form-control" ng-model="$ctrl.recipientAddress" required>\n' +
                        '       </div>' +
                        '       <div class="form-group">\n' +
                        '           <button type="submit" class="btn btn-default me-3">{{ \'adm.prompt.send\' | translate}}</button>' +
                        '       </div>' +
                        '   </form>' +
                        '</div>',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        var that = this;
                        that.cancel = cancel;
                        that.recipientSubmit = recipientSubmit;
                        that.recipientAddress = "";

                        function recipientSubmit(){
                            sscEmailService.runEmailConfig(that.recipientAddress).then(function(data){
                                if("200" === data.code){
                                    messageService.toast('success', $translate.instant('adm.prompt.sent_success'));
                                    cancel();
                                }else{
                                    messageService.toast('error', data.msg);
                                }
                            }).catch(function(err){
                                throw err;
                            })
                        }

                        function cancel() {
                            $uibModalInstance.close({action: "cancel"});
                        }
                    }],
                    controllerAs: '$ctrl',
                    size: 'sm',
                    backdrop: true
                });
            }else{
                messageService.alertWarning($translate.instant('adm.prompt.save_change'), $translate.instant('adm.prompt.techcpstecf'));
            }
        }

    }
})();

(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.engine', {
                url: '/engine',
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/ssc/engine/engine-aap.html',
                        controller: 'EngineAAPController',
                        controllerAs: 'vm'
                    }
                }
            })
    }]);
})();

/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('sscEngineService', sscEngineService);

    sscEngineService.$inject = ['$q', 'restUtils'];

    function sscEngineService($q, restUtils) {
        var module = "jao";

        this.queryProjects = queryProjects;
        this.queryProjectDetails = queryProjectDetails;
        this.queryOrganizations = queryOrganizations;
        this.queryCredentials = queryCredentials;
        this.queryInstance_groups = queryInstance_groups;
        this.queryExecution_environments = queryExecution_environments;
        this.queryProjectBaseDir = queryProjectBaseDir

        function queryProjects() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/projects');
        }

        function queryProjectDetails(id) {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/projects/{id}/details', {id: id});
        }

        function queryOrganizations() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/organizations');
        }

        function queryCredentials() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/credentials');
        }

        function queryInstance_groups() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/instance_group');
        }

        function queryExecution_environments() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/execution_environments');
        }

        function queryProjectBaseDir() {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/project_base_dir');
        }

    }

})();


(function () {
    'use strict';

    angular.module('oplus.ssc').controller('EngineController', EngineController);

    EngineController.$inject = ['$scope', '$uibModal', '$compile', 'dataTable', '$translate', 'Param', 'sscEngineService', '$timeout'];

    function EngineController($scope, $uibModal, $compile, dataTable, $translate, Param, sscEngineService, $timeout) {
        var vm = this;

    }

})();

(function () {
    'use strict';

    angular.module('oplus.ssc').controller('EngineAAPController', EngineAAPController);

    EngineAAPController.$inject = ['$scope', '$uibModal', '$compile', 'dataTable', '$translate', 'Param', 'sscEngineService', 'messageService', 'widgetInteraction'];

    function EngineAAPController($scope, $uibModal, $compile, dataTable, $translate, Param, sscEngineService, messageService, widgetInteraction) {
        var vm = this;
        vm.ansible_engines = [
            {
                name: 'Ansible',
                value: 'ansible'
            },
            {
                name: 'Ansible Automation Platform',
                value: 'aap'
            }
        ];

        vm.$onInit = onInit;
        vm.changeEngine = changeEngine;
        vm.openEEUploaderPage = openEEUploaderPage;
        vm.saveAapConfig = saveAapConfig;
        vm.saveAnsibleConfig = saveAnsibleConfig;
        vm.connectAap = connectAap
        vm.jaoParamKeys = []
        vm.jaoParamJsonKeys = ['is_fork','forks','sync_script_git']
        vm.ataParamKeys = ['tower_host']
        // value值为json字符串的配置项
        vm.ataParamJsonKeys = ['tower_clear','tower_config','tower_login_config','task_timeout']
        vm.jaoParamMap = {};
        vm.ataParamMap = {};
        vm.isConnectAap = false;
        vm.EEUploadPageConfig = {
            pageId: 'o9R4Os', 
            target: '_dialog' 
        } ;

        function onInit() {
            Param.getByDomainAndName('jao', 'script_engine').then(function (result) {
                vm.scriptEngineParam = result;
                vm.usedEngine = vm.scriptEngineParam.value;
                vm.scriptEngine = vm.scriptEngineParam.value;
                if (vm.scriptEngine === 'ansible') {
                    loadAnsibleConfig()
                } else if (vm.scriptEngine === 'aap') {
                    loadAapConfig();
                }
            });
        }


        /**
         * 验证aap配置账号密码是否能连接
         */
        function connectAap() {
            if (hasAapAccount()) {
                sscEngineService.queryProjectBaseDir().then(function(result){
                    vm.isConnectAap = true;
                    var aapConfig = angular.fromJson(result);
                    vm.aapProjectBaseDir = aapConfig.project_base_dir;
                    getAapInfo();
                    messageService.toast('success', 'connect aap success');
                },function(){
                    messageService.toast('error', 'account error,can not connect aap');
                });
            }
        }

        function hasAapAccount() {
            if (!vm.ataParamMap)  return false;
            if (!vm.ataParamMap['tower_host'])  return false;
            if (!vm.ataParamMap['tower_login_config']) return false;
            if (!vm.ataParamMap['tower_login_config']['value']['web_login_name']) return false;
            if (!vm.ataParamMap['tower_login_config']['value']['web_login_pwd']) return false;
            return true;
        }

        function openEEUploaderPage() {
            widgetInteraction.openPage(vm.EEUploadPageConfig, {}, {
                // current: angular.element(e.currentTarget).parents('flow-run-viewer'),
                // scope: $scope
            })
        }

        function loadAnsibleConfig() {
            Param.getByDomain('jao').then(function(params){
                _.forEach(params,function(obj){
                    if (vm.jaoParamKeys.indexOf(obj.name) !== -1) {
                        vm.jaoParamMap[obj.name] = obj;
                    } else if (vm.jaoParamJsonKeys.indexOf(obj.name) !== -1) {
                        obj.value = JSON.parse(obj.value);
                        vm.jaoParamMap[obj.name] = obj;
                    }
                })
            })
        }

        function loadAapConfig() {
            Param.getByDomain('ata').then(function(params){
                _.forEach(params,function(obj){
                    if (vm.ataParamKeys.indexOf(obj.name) !== -1) {
                        vm.ataParamMap[obj.name] = obj;
                    } else if (vm.ataParamJsonKeys.indexOf(obj.name) !== -1) {
                        obj.value = JSON.parse(obj.value);
                        vm.ataParamMap[obj.name] = obj;
                    }
                })
                connectAap();
            })
        }
        function changeEngine() {
            messageService.confirm($translate.instant('adm.prompt.change_operation'), $translate.instant('adm.prompt.cwtstc'), function () {
                saveJaoEngineParam(vm.usedEngine);
            });
        }


        $scope.addClusterServer = function () {
            vm.cs = {
                "host": "",
                "port": "",
                "username": "",
                "password": ""
            };
            vm.ataParamMap.tower_login_config.value.cluster_servers.push(vm.cs);
        };


        $scope.deleteClusterServe = function (index) {
            if (vm.ataParamMap.tower_login_config.value.cluster_servers.length <= 1) {
                alert("can not delete the last node ")
            } else {
                vm.ataParamMap.tower_login_config.value.cluster_servers.splice(index, 1);
            }
        };


        function saveJaoEngineParam() {
            if (vm.scriptEngineParam) {
                vm.scriptEngineParam.value = vm.usedEngine;
                Param.update(vm.scriptEngineParam, function() {
                    messageService.toast('success', $translate.instant('adm.prompt.success_change'));
                    vm.scriptEngine = vm.usedEngine;
                    onInit();
                }, function() {
                    messageService.toast('Error', $translate.instant('adm.prompt.failed_change'));
                });
            }
        }

        function saveAapConfig() {
            messageService.confirm($translate.instant('adm.prompt.change_operation'), $translate.instant('adm.prompt.cwtstc'), function () {
                var saveAtaParams = [];
                for (var key in vm.ataParamMap) {
                    var param = vm.ataParamMap[key];
                    if (vm.ataParamJsonKeys.indexOf(key) !== -1) {
                        param.value = angular.toJson(param.value);
                    }
                    saveAtaParams.push(param);
                }
                Param.batchUpdate(saveAtaParams).then(function(result){
                    onInit();
                    messageService.toast('success', $translate.instant('adm.prompt.success_change'));
                },function(){
                    messageService.toast('Error', $translate.instant('adm.prompt.failed_change'));
                });
            });
        }

        function saveAnsibleConfig(){
            messageService.confirm($translate.instant('adm.prompt.change_operation'), $translate.instant('adm.prompt.cwtstc'), function () {
                var saveJaoParams = [];
                for (var key in vm.jaoParamMap) {
                    var param = vm.jaoParamMap[key];
                    saveJaoParams.push(param);
                }
                Param.batchUpdate(saveJaoParams).then(function(result){
                    onInit();
                    messageService.toast('success', $translate.instant('adm.prompt.success_change'));
                },function(){
                    messageService.toast('Error', $translate.instant('adm.prompt.failed_change'));
                });
            });
        }

        vm.changeProjectPath = changeProjectPath

        function changeProjectPath() {
            var project = _.find(vm.queryProjects,{id: vm.ataParamMap.tower_config.value.template_project_id})
            vm.ataParamMap.tower_config.value.project_path = vm.aapProjectBaseDir + '/' + project.local_path;
        }

        function getAapInfo() {
            sscEngineService.queryProjects().then(function (result) {
                vm.queryProjects = angular.fromJson(result).results;
            });

            sscEngineService.queryOrganizations().then(function (result) {
                    vm.queryOrganizations = angular.fromJson(result).results;
                }
            );
            sscEngineService.queryCredentials().then(function (result) {
                    vm.queryCredentials = angular.fromJson(result).results;
                }
            );
            sscEngineService.queryExecution_environments().then(function (result) {
                    vm.queryExecution_environments = angular.fromJson(result).results;
                }
            );
            sscEngineService.queryInstance_groups().then(function (result) {
                    vm.queryInstance_groups = angular.fromJson(result).results;
                }
            );


        }

    }

})();

(function () {
    'use strict';

    angular.module('oplus.ssc').controller('EngineAnsibleController', EngineAnsibleController);

    EngineAnsibleController.$inject = ['$scope', '$uibModal', '$compile', 'dataTable', '$translate', 'Param', 'sscEngineService'];

    function EngineAnsibleController($scope, $uibModal, $compile, dataTable, $translate, Param, sscEngineService) {
        var vm = this;

    }


})();

(function() {
    'use strict';
    angular
        .module('oplus.ssc')
        .factory('ApiKey', ApiKey);

    ApiKey.$inject = ['$resource', '$http', '$q'];

    function ApiKey ($resource, $http, $q) {
        var service = $resource('api/apikey/:id', {}, {
            'get': {
                method: 'GET',
                transformResponse: res => res ? angular.fromJson(res) : res,
            },
            'save': {
                method: 'POST',
                transformResponse: res => res,
            },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' },
        });


        service.enableApiKey = function (id) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/apikey/enable/" + id)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.discardApiKey = function (id) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/apikey/discard/" + id)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.generateApiKey = function (id) {
            var deferred = $q.defer(); //声明承诺
            $http({
                method: 'POST',
                url: `api/apikey/generate/${id}`,
                transformResponse: res => res,
            })
            .success(function (data) {
                deferred.resolve(data); //请求成功
            })
            .error(function (data) {
                deferred.reject(data); //请求成功
            });
            return deferred.promise; // 返回承诺
        };

        return service;

    }
})();

/**
 * @ Author: chy
 * @ Create Time: 2023-03-27 17:45:45
 * @ Description:  
 */
(function () {
  'use strict';

  angular
    .module('oplus.ssc')
    .controller('apiKeyEditDialogCtrl', apiKeyEditDialogCtrl);
  
  apiKeyEditDialogCtrl.$inject = ['$translate', '$uibModalInstance', 'apiKey'];
  function apiKeyEditDialogCtrl($translate, $uibModalInstance, apiKey) {
    var that = this;
  
    that.apiKey = apiKey;
    that.isEdit = !!apiKey;

    if (that.apiKey && !that.apiKey.isEternal)
    {
      that.apiKey.expireCount = Number(that.apiKey.expireCount) >= 0 ? Number(that.apiKey.expireCount) : 0;
      that.apiKey.expireTime = new Date(that.apiKey.expireTime);
    }

    that.cancel = function () {
      $uibModalInstance.dismiss();
    };

    that.confirm = function () {
      $uibModalInstance.close(that.apiKey);
    }
  }
})();
/*!
 *
 *
 * 编辑租户用户
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name viewTenantUser
     * @description  show user detail dialog when click the directive
     * ```html
     * <xxx
     * view-tenant-user
     * tenant-user-id="${tenantUserId}"
     * onCancel="${onCancelCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('viewTenantUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantUserId: '@',//租户用户id
                onUpdate: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', 'User', ViewTenantUserCtrl],
            controllerAs: 'viewTenantUserVm'
        }
    });

    //任务协作人选择控制器
    function ViewTenantUserCtrl($scope, $element, $uibModal, User) {
        var vm = this;

        function init() {
            // console.log('tenantUserId', $scope.tenantUserId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-detail.html',
                    controller: 'UserManagementDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['User', function (User) {
                            return User.get({tenantUserId: $scope.tenantUserId}).$promise;
                        }]
                    }
                }).result.then(function (user) {
                    onCancel(user || {});
                }, function () {
                    onCancel();
                });
            });
        }

        init();

        function onCancel(user) {
            $scope.onCancel && $scope.onCancel(user);
        }
    }
})();



/*!
 * 用户选择弹出框
 * @author Joker liu (qdjoker@hpcmb.com), created on 03/05/2019
 */

(function () {
    var tmModule = angular.module('oplus.ssc');

    //值班人选择控制器
    tmModule.controller('OpUserSelectDialogCtrl', OpUserSelectDialogCtrl);
    OpUserSelectDialogCtrl.$inject = ['$uibModalInstance', "params"];

    function OpUserSelectDialogCtrl($uibModalInstance, params) {
        var vm = this;

        vm.views = {
            onUserSelected: onUserSelected,
            registerSelectedUserHook: registerSelectedUserHook,
            cancel: cancel,
            save: save
        };

        vm.params = params;
        var getSelectedUsersFn = null;

        //选中回调
        function onUserSelected(currentSelected, totalSelected) {
            if(vm.params.onUserSelected){
                vm.params.onUserSelected(currentSelected, totalSelected);
            }
        }

        function registerSelectedUserHook(hookFn) {
            getSelectedUsersFn = hookFn;
            // console.log("Run registerSelectedUserHook");
        }

        //取消
        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        //保存选择
        function save() {
            var selectedResult = getSelectedUsersFn();
            // console.log("selectedResult = " + JSON.stringify(selectedResult));
            $uibModalInstance.close({action: "confirm", users: selectedResult.users, ids: selectedResult.ids, selectedUser: selectedResult.selectedUser});
        }
    }
})();

/*!
 * 用户树，按照用户部门层级关系组织。
 * 支持单选和多选
 * 支持选中通知和主动获取当前已选择
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 03/05/2018
 */

(function () {

    /**
     * @ngdoc component
     * @name opUserSelectTree
     * @description Organize all users in a tree structure, you can select in single or multiple way.
     * you can be noticed on every select action. Or proactively get the currently selected users.
     *
     * ```html
     * <op-user-select-tree
     * checkType="checkbox"
     * filterType="inner"
     * default="vm.defaultSelected"
     * disabled="vm.defaultDisabled"
     * excludeLogin=false
     * expandAll=false
     * onSelect="vm.onUserSelect"
     * getSelectedHook="vm.getSelectedUsers">
     * ```
     * ```js
     * function onUserSelect(currentSelect, totalSelected){
     *
     * }
     *
     * function getSelectedUsers(getUserFn){
     *
     *     //{ids: selectedUserIds, users: selectedUsers, selectedUser: selectedUsers[0]}
     *     //selectedUser property is used for single select to get the selected user quickly
     *     var currentSelectObj = getUserFn();
     * }
     * ```
     */
    angular.module('oplus.ssc').component('opUserSelectTree', {
        templateUrl: 'app/modules/ssc/user/user-select-component.html',
        replace: true,
        controller: ['$scope', 'currentUser', 'User', UserSelectCtrl],
        controllerAs: 'opUserSelectVm',
        bindings: {
            checkType: '<',//checkbox(多选)/radio(单选)/none(不做选择)，默认值checkbox
            filterType: '<',//过滤方式：inner/outer/none，默认值inner
            filterContent: "<",//外部过滤条件，filterType='outer'生效
            default: '<',//默认选中用户列表，默认值[]
            disabled: '<',//默认禁止用户列表，默认值[]
            excludeLogin: '<',//是否排除当前登录用户，默认值false
            expandAll: '<',//是否展开所有，默认值true
            onSelect: '&',//任意节点被选中后，执行此函数， onSelect(currentSelect, totalSelected)
            getSelectedHook: '&'//函数的包装函数，用于主动获取当前已选元素 return {ids:xxx, users:xxx};
        }
    });

    //任务协作人选择控制器
    function UserSelectCtrl($scope, currentUser, User) {
        var vm = this;

        vm.views = {
            filterContent: '',
            departmentTreeId: "opUserSelectTree" + new Date().getMilliseconds(),
            filterUser: filterUser
        };

        var treeSelector = "#" + vm.views.departmentTreeId;
        var userList = null;//后端返回的原始数据
        var allUserMapping = {};//用户id和用户的映射
        var selectedUserIds = [];//已选用户,默认选中
        var disabledUserIds = {};//禁止用户不能勾选
        var excludeUserIds = [];//被排除用户，不会显示
        var isReloading = false;//标志是否正在重载，避免重复
        var isMultiTenant = window.$oplus.appConfig.useMultiTenant;

        vm.$onInit = function () {
            // console.log("Run opUserSelectTree $onInit");

            vm.checkType = vm.checkType == undefined ? "checkbox" : vm.checkType;
            vm.filterType = vm.filterType == undefined ? "inner" : vm.filterType;
            vm.expandAll = !!vm.expandAll;
            vm.default = vm.default || [];
            vm.disabled = vm.disabled || [];

            if (vm.excludeLogin) {
                excludeUserIds.push(isMultiTenant ? currentUser.tenantUserId : currentUser.id);
            }

            selectedUserIds = vm.default.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });

            console.log("selectedUserIds = " + JSON.stringify(selectedUserIds));
            disabledUserIds = vm.disabled.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });

            initTree();

            if (vm.filterType == "outer") {
                $scope.$watch("opUserSelectVm.filterContent", function () {
                    if (vm.filterContent != undefined) {
                        filterUser();
                    }
                });
            }

            vm.getSelectedHook()(getSelectedUsers);
        };

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
                    doc: "far fa-user",
                    docOpen: "fas fa-user"
                }
            },
            filter: {  // override default settings
                counter: false, // No counter badges
                mode: "hide",  // "dimm": Grayout unmatched nodes, "hide": remove unmatched nodes
                autoExpand: true,
                leavesOnly: true
            },
            select: function (event, data) {//选择或取消选择
                $scope.$apply(function () {
                    vm.onSelect()(data.node.data, getSelectedUsers().users);
                });
            }
        };

        function initTree() {
            // console.log("Run initTree");
            if (vm.checkType == 'checkbox') {
                treeOption.checkbox = true;
                treeOption.selectMode = 3;
            } else if (vm.checkType == 'radio') {
                treeOption.checkbox = 'radio';
                treeOption.selectMode = 1;
            } else if (vm.checkType == 'none') {
                treeOption.checkbox = false;
            }

            User.getUserTree().then(function (result) {
                userList = result;
                treeOption.source = convertTreeData(result);
                $(treeSelector).fancytree(treeOption);
            });
        }


        //重新渲染树
        function reloadTree() {
            if (isReloading) {
                return;
            }
            isReloading = true;

            selectedUserIds = vm.default.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });

            disabledUserIds = vm.disabled.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });

            //重新生成tree data
            treeOption.source = convertTreeData(userList);

            var tree = $(treeSelector).fancytree("getTree");
            //取消已选
            tree.visit(function (node) {
                node.setSelected(false);
            });
            tree.reload(treeOption.source);
            // console.log("..............   Run reloadTree start   ..............");

            isReloading = false;
        }

        //过滤用户
        function filterUser() {
            $(treeSelector).fancytree("getTree").filterNodes(vm.views.filterContent);
        }

        //嵌套转换，初始化数据
        function convertTreeData(rawData) {
            // console.log("Run convertTreeData");
            var nodeList = [];
            rawData.forEach(function (user) {
                var tenantUserId = isMultiTenant ? user.tenantUserId : user.id;
                if (_.indexOf(excludeUserIds, tenantUserId) == -1) {//跳过排除用户
                    var node = {
                        key: tenantUserId,
                        type: user.type,
                        selected: _.indexOf(selectedUserIds, tenantUserId) != -1,
                        unselectable: _.indexOf(disabledUserIds, tenantUserId) != -1,
                        title: user.type == "folder" ? user.name : user.fullName,
                        data: user
                    };

                    //收集所有用户
                    allUserMapping[tenantUserId] = user;
                    nodeList.push(node);

                    //处理文件夹
                    if (user.type == "folder") {
                        node.folder = true;
                        node.expanded = vm.expandAll;
                        if (vm.checkType == 'radio') {
                            node.checkbox = false;
                        }

                        var children = [];
                        if (user.children != null && user.children.length > 0) {
                            // console.log("Parent Node name = " + user.name);
                            node.children = convertTreeData(user.children);
                        }
                    }
                }
            });

            return nodeList;
        }

        function getSelectedUsers() {
            var selectedUsers = [];
            $(treeSelector).fancytree("getTree").findAll(function (node) {
                if (node.isSelected()) {
                    selectedUsers.push(node.data);
                }
            });

            selectedUserIds = selectedUsers.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });
            // console.log("selectedUserIds = " + selectedUserIds.length);
            return {ids: selectedUserIds, users: selectedUsers, selectedUser: selectedUsers[0]};
        }
    }
})();



(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('LinkTenantUserController', LinkTenantUserController);

    LinkTenantUserController.$inject = ['$scope', '$timeout', '$compile', '$uibModalInstance', 'tenantId', 'onAddUser', 'User', 'messageService', 'dataTable','$translate'];

    function LinkTenantUserController($scope, $timeout, $compile, $uibModalInstance, tenantId, onAddUser, User, messageService, dataTable,$translate) {
        var vm = this;

        vm.selectUser = selectUser;
        vm.clear = clear;
        vm.save = save;
        //把创建用户事件传递到调用关联用户的调用者
        vm.onAddUser = onAddUser;

       /* (function init() {
            loadUsers();
        })();*/

        var selectedUsers = {};

        function selectUser(userId) {
            selectedUsers[userId] = !selectedUsers[userId];
            console.log("selectedUsers = " + JSON.stringify(selectedUsers));
        }

        /*function loadUsers() {
            // console.log("Run load users for tenant " + tenantId);
            User.getNotAssociatedTenantUsers(tenantId).then(function (result) {
                dataTable.initTable(".select-tenant-user-table", tableColumnConfig, result, {order: [[1, 'desc']]});
            });
        }*/

        var tableColumnConfig = [
            {
                mData: 'id', title: $translate.instant("sys_userManagement.choice"),
                searchable: false,
                orderable: false,
                render: function (data, type, user, meta) {

                    var userIdWrapp = "'" + data + "'";
                    return '<label class="i-checks"><input type="checkbox" ' + (selectedUsers[data] ? 'checked' : '') + ' ng-click="addTenantUserVm.selectUser(' + userIdWrapp + ')"/><i></i></label>';
                }/*,
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
                }*/
            },
            {data: 'login', title: $translate.instant("sys_userManagement.login")},
            {data: 'fullName', title:  $translate.instant("sys_userManagement.fullName")},
            {data: 'department', title:  $translate.instant("sys_userManagement.department")},
        ];

        $scope.tableConfig = {
            data: [getPromise, ''],
            columns: tableColumnConfig,
            order: [[1, 'desc']],
            buttons: ['reload']
        }

        function getPromise() {
            return User.getNotAssociatedTenantUsers(tenantId);
        }


        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function onSaveSuccess(result) {
            vm.isSaving = false;
            $uibModalInstance.close(result);
            messageService.toast("success", $translate.instant("sys_userManagement.operationSuccess"));
        }

        function onSaveError(result) {
            vm.isSaving = false;
            // console.log(JSON.stringify(result));
            messageService.toast("error",  $translate.instant("sys_userManagement.operationError",{msg:result.data.title}));
        }

        function save() {
            // console.log("save vm.user.roles = " + JSON.stringify(vm.user.roles));
            vm.isSaving = true;

            //collect all selected roles
            var selectedUserIds = [];
            for (var i in selectedUsers) {
                if (selectedUsers[i]) {
                    selectedUserIds.push(i);
                }
            }
            if (selectedUserIds.length > 0) {
                User.associatedTenantUsers(tenantId, selectedUserIds).then(function () {
                    onSaveSuccess();
                }, function (result) {
                    onSaveError(result);
                });
            } else {
                $uibModalInstance.close();
                messageService.toast("warning", $translate.instant("sys_userManagement.noUserSelected"));
            }
        }

    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementEditController', UserManagementEditController);

    UserManagementEditController.$inject = ['$stateParams', '$uibModal', '$uibModalInstance', 'User', 'Role', 'Tenant', 'ApiKey', 'appletService', 'tenantUtil', 'messageService', 'currentUser', 'entity', '$translate', 'viewType', '$timeout', '$q', '$scope'];

    function UserManagementEditController($stateParams, $uibModal, $uibModalInstance, User, Role, Tenant, ApiKey, appletService, tenantUtil, messageService, currentUser, entity, $translate, viewType, $timeout, $q, $scope) {
        var vm = this;

        vm.roles = [];
        vm.tenants = [];
        vm.permissions = [];
        vm.applets = [];
        vm.isShowRole = isShowRole;
        vm.qualifiedPswd = true;

        // OTP二维码
        vm.generateQRCode = generateQRCode;
        vm.cancel = cancel;
        vm.userId = entity.id;
        vm.qrcodeUrl = window.$oplus.appConfig.apiBaseUrls.upload + entity.qrcodeImagePath;
        vm.qrcodeStatus = "generating";
        $timeout(initQRCodeStatus(), 0);


        $scope.$watch('vm.user.password', function (newVal, oldVal) {
            var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*><_.-]).{8,32}$/,
                str = newVal;
            if (pattern.test(str)) {
                vm.qualifiedPswd = false;
            } else {
                vm.qualifiedPswd = true;
            }
        }, true);

        function generateQRCode() {
            vm.qrcodeStatus = "generating";
            User.generateQRCode(vm.userId).then(function (user) {
                vm.qrcodeUrl = window.$oplus.appConfig.apiBaseUrls.upload + user.qrcodeImagePath;
                vm.qrcodeStatus = "existed";
            })
        }

        function initQRCodeStatus() {
            if (!vm.qrcodeUrl) {
                vm.qrcodeStatus = "unexisted"
            } else {
                var image = new Image();
                image.src = vm.qrcodeUrl;
                image.onload = function () {
                    vm.qrcodeStatus = "existed"
                };
                image.onerror = function () {
                    vm.qrcodeStatus = "unexisted"
                }
            }
        }

        function initUserApplet(tenantUserId, login) {
            if (!tenantUserId) {
                tenantUserId = "";
            }
            if (!login) {
                login = "";
            }
            appletService.findAppletsByTenantUser(tenantUserId, login).then(function (applets) {
                vm.applets = applets;
            }).catch(function (err) {
                throw err;
            });
        }

        function cancel() {
            $uibModalInstance.close({action: "cancel", qrcodeUrl: vm.qrcodeUrl});
        }

        vm.detailSign = viewType == 'detail' ? true : false;
        console.log("What type? ===", viewType, "---- result Value? ===", vm.detailSign)

        vm.user = entity;
        vm.editPassword = true;
        vm.user.authMode = vm.user.authMode == null ? 'LOCAL' : vm.user.authMode;
        vm.isTenantAdminUI = tenantUtil.isTenantAdminUI();

        if (vm.user.id) {
            vm.editPassword = false;
        }

        vm.clear = clear;
        vm.save = save;


        function init() {
            //Query role and init permissions
            Role.query({isWithPermission: true}, function (roles) {
                if (entity.roles != null && entity.roles.length > 0) {
                    var allRoleMap = {};
                    for (var i in roles) {
                        allRoleMap[roles[i].id] = roles[i];
                    }

                    for (var i in entity.roles) {
                        if (allRoleMap[entity.roles[i].id]) {
                            allRoleMap[entity.roles[i].id].isChecked = true;
                        }
                    }
                }

                vm.roles = roles;
                vm.permissions = collectPermissions(roles);
            });
            initUserApplet(entity.tenantUserId, entity.login);
            //Query tenants
            if (vm.isTenantAdminUI) {
                Tenant.query(null, function (result) {
                    vm.tenants = result;
                });
            }
            // vm.apiKeyTableConfig.reloadData();
        }

        init();


        //超级管理员ROLE_ADMIN不允许分配给租户用户
        function isShowRole(role) {
            if (role.name != "ROLE_ADMIN") {
                return true;
            }

            return entity.tenantId == "$default";
        }

        function collectPermissions(roles) {
            var permissions = [];
            var permissionMap = {};
            for (var i in roles) {
                var role = roles[i];
                if (role.isChecked && role.permissions != null && role.permissions.length > 0) {
                    for (var j in role.permissions) {
                        var permission = role.permissions[j];
                        if (permissionMap[permission.id] == null) {
                            permissions.push(permission);
                            permissionMap[permission.id] = permission;
                        }
                    }
                }
            }

            return permissions;
        }


        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function onSaveSuccess(result) {
            var tenantUserId;
            if (_.isArray(result)) {
                tenantUserId = _.find(result, function(o) { return o.tenantId === currentUser.tenantId; }).tenantUserId;
            } else {
                tenantUserId = result.tenantUserId;
            }
            appletService.saveAppletsByTenantUser(vm.applets, tenantUserId);
            vm.isSaving = false;
            $uibModalInstance.close(result);
            messageService.toast("success", $translate.instant("sys_userManagement.operationSuccess"));
        }

        function onSaveError(result) {
            vm.isSaving = false;
            // console.log(JSON.stringify(result));
            messageService.toast("error", $translate.instant("sys_userManagement.operationError", {msg: result.data.title}));
        }

        function save() {
            if (vm.qualifiedPswd && vm.editPassword) {
                messageService.alert($translate.instant('common.color.warning'), $translate.instant('global.messages.validate.newpassword.qualified'));
                return;
            }

            if (vm.user.password !== vm.confirmPassword) {
                vm.doNotMatch = 'ERROR';
                return;
            }

            // console.log("save vm.user.roles = " + JSON.stringify(vm.user.roles));
            vm.isSaving = true;

            //collect all selected roles
            var selectedRoles = [];
            for (var i in vm.roles) {
                if (vm.roles[i].isChecked) {
                    selectedRoles.push(vm.roles[i]);
                }
            }
            vm.user.roles = selectedRoles;

            if (vm.user.id !== null) {
                User.update(vm.user, onSaveSuccess, onSaveError);
            } else {
                vm.user.tenantIds = vm.tenants.filter(function (tenant) {
                    return tenant.isChecked
                }).map(function (tenant) {
                    return tenant.id
                });
                User.save(vm.user, onSaveSuccess, onSaveError);
            }
        }

        var apiKeyTableColumnConfig = [
            // { data: 'key', title: 'Key' },
            {data: 'name', title: $translate.instant('common.entity.detail.name')},
            {
                data: 'targetApi',
                title: $translate.instant('sys_userManagement.apikey.target_api'),
                render: function (data) {
                    return data.split(',').map(m => {
                        return `<span class="badge bg-secondary">${m}</span>`
                    }).join("</br>")
                }
            },
            {data: 'expireCount', title: $translate.instant("sys_userManagement.apikey.expire_count")},
            {
                data: 'expireTime',
                title: $translate.instant('app_um.user.expired_date'),
                render: function (data) {
                    return !isNaN(Date.parse(data)) ? $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss') : (data === 'expired') ? $translate.instant('jao.approve.detail.expired') : '-----';
                }
            },
            {
                title: $translate.instant('common.action.action'),
                render: function (data, type, row, meta) {
                    var html = ''
                        + '<button type="button" class="btn btn-outline-success rounded-pill btn-sm" ng-click="vm.generateApiKey(\'' + row.id + '\')" title="{{\'jao.job.id_gen.re_generate\'|translate}}"><i class="fa fa-edit"></i> {{\'jao.job.id_gen.re_generate\' | translate}}</button>'
                        + '<button type="button" class="btn btn-outline-secondary rounded-pill btn-sm" ng-click="vm.editApiKey(\'' + row.id + '\')" title="{{\'common.action.edit\'|translate}}"><i class="fa fa-edit"></i> {{\'common.action.edit\' | translate}}</button>'
                        + '<button type="button" ng-if="' + !row.enabled + '" class="btn btn-outline-primary rounded-pill btn-sm ml-1" ng-click="vm.enableApiKey(\'' + row.id + '\')" title="{{\'common.entity.action.enable\'|translate}}"><i class="fa fa-pencil-ruler"></i> {{\'common.entity.action.enable\' | translate}}</button>'
                        + '<button type="button" ng-if="' + row.enabled + '" class="btn btn-outline-warning rounded-pill btn-sm ml-1" ng-click="vm.discardApiKey(\'' + row.id + '\')" title="{{\'common.entity.action.disable\'|translate}}"><i class="fa fa-play-circle"></i> {{\'common.entity.action.disable\' | translate}}</button>'
                        + '<button type="button" class="btn btn-outline-danger rounded-pill btn-sm ml-1" ng-click="vm.deleteApiKey(\'' + row.id + '\')" title="{{\'common.action.delete\'|translate}}"><i class="fa fa-play-circle"></i> {{\'common.action.delete\' | translate}}</button>';
                    return html;
                }
            }
        ]

        vm.apiKeyTableConfig = {
            data: [getPromise],
            columns: apiKeyTableColumnConfig,
            // order: [[1, 'desc']],
            buttons: ['reload']
        }

        function getPromise() {
            var deferred = $q.defer();
            ApiKey.query({id: entity.tenantUserId}, function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }


        function saveApiKey(id) {
            var row = vm.apiKeyTableConfig.getTableData().find(function (f) {
                return f.id === id
            });

            var modal = $uibModal.open({
                templateUrl: 'app/modules/ssc/user/api-key/api-key-edit-dialog.html',
                controller: 'apiKeyEditDialogCtrl',
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    apiKey: [function () {
                        if (id && row) return row;
                        return {
                            tenantUserId: entity.tenantUserId,
                            isEternal: true
                        };
                    }]
                }
            });

            modal.result.then(
                (result) => {
                    if (id && row)
                        ApiKey.update(result, res => {
                            messageService.toast('success', $translate.instant('sys_userManagement.operationSuccess'))
                            vm.apiKeyTableConfig.reloadData()
                        });
                    else
                        ApiKey.save(result, res => {
                            vm.alertKey(Object.values(res.toJSON()).join(''))
                            vm.apiKeyTableConfig.reloadData()
                        });
                }, () => {
                }
            );
        }

        vm.generateApiKey = function (id) {
            ApiKey.generateApiKey(id).then(res => {
                vm.alertKey(res)
            });
        }

        vm.alertKey = function (appkey) {
            messageService.alertSuccess('Success',
                'Please remember your key.</br>' +
                '<code style="word-break: break-all">' + appkey + '</code>'
            );
        }

        vm.applyApiKey = function () {
            saveApiKey()
        }

        vm.editApiKey = function (id) {
            saveApiKey(id)
        }

        vm.deleteApiKey = function (id) {
            messageService.confirmDanger(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('common.messages.operation.body', {
                    operation: $translate.instant('common.entity.action.delete'),
                    obj: 'ApiKey'
                }),
                function () {
                    ApiKey.delete({id: id}, res => {
                        messageService.toast('success', $translate.instant('sys_userManagement.operationSuccess'))
                        vm.apiKeyTableConfig.reloadData()
                    })
                },
                null,
                $translate.instant('common.messages.operation.ok_label', {operation: $translate.instant('common.entity.action.delete')})
            );

        }

        vm.enableApiKey = function (id) {
            ApiKey.enableApiKey(id).then(res => {
                messageService.toast('success', $translate.instant('sys_userManagement.operationSuccess'))
                vm.apiKeyTableConfig.reloadData()
            })
        }

        vm.discardApiKey = function (id) {
            ApiKey.discardApiKey(id).then(res => {
                messageService.toast('success', $translate.instant('sys_userManagement.operationSuccess'))
                vm.apiKeyTableConfig.reloadData()
            })
        }
    }

})();

(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementDetailController', UserManagementDetailController);

    UserManagementDetailController.$inject = ['$uibModalInstance', 'User', 'entity'];

    function UserManagementDetailController($uibModalInstance, User, entity) {
        var vm = this;

        vm.user = entity;
        vm.clear = clear;

        function init() {
            vm.permissions = [];
            var permissionMap = {};
            for (var i in vm.user.roles) {
                var role = vm.user.roles[i];
                if (role.permissions != null && role.permissions.length > 0) {
                    for (var j in role.permissions) {
                        var permission = role.permissions[j];
                        if (permissionMap[permission.id] == null) {
                            vm.permissions.push(permission);
                            permissionMap[permission.id] = permission;
                        }
                    }
                }
            }
        }

        init();


        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementDeleteController', UserManagementDeleteController);

    UserManagementDeleteController.$inject = ['$uibModalInstance', 'entity', 'User'];

    function UserManagementDeleteController($uibModalInstance, entity, User) {
        var vm = this;

        vm.user = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete() {
            User.delete({tenantUserId: vm.user.tenantUserId},
                function () {
                    $uibModalInstance.close(vm.user);
                });
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementAllocateRoleController', UserManagementAllocateRoleController);

    UserManagementAllocateRoleController.$inject = ['$scope', '$state', '$q', 'User', 'Role', 'tenantUtil', 'currentUser', 'opDatatable', 'messageService', '$translate'];

    function UserManagementAllocateRoleController($scope, $state, $q, User, Role, tenantUtil, currentUser, opDatatable, messageService, $translate) {
        var vm = this;
        vm.users = {};

        vm.save = save;
        vm.clear = clear;

        function constructCheckboxHtml(tenantUserId, roleName) {
            var tenantUserIdWrap = "'" + tenantUserId + "'";
            var roleNameWrap = "'" + roleName + "'";
            var dataPath = 'allocateRoleVm.users[' + tenantUserIdWrap + '][' + roleNameWrap + ']';
            var html =
                '<div class="checkbox checkbox-inline checkbox-primary">' +
                '    <input type="checkbox" name="' + tenantUserId + '-' + roleName + '"' +
                '           ng-checked="' + dataPath + '"' +
                '           ng-click="' + dataPath + '=!' + dataPath + ';"/>' +
                '<label></label>' +
                '</div>';
            return html;
        }

        function init() {
            prepareColumn().then(function (roleNames) {
                var tableColumnConfig = [{data: 'fullName', title: $translate.instant("sys_userManagement.username")}];
                for (var i in roleNames) {
                    var name = roleNames[i];
                    //租户系统不允许分配管理员角色
                    if (name !== 'ROLE_ADMIN' || tenantUtil.isOplusAdminUI()) {
                        (function (name) {
                            tableColumnConfig.push({
                                data: name, title: roleMap[name].description, class: 'text-center', orderable: false,
                                render: function (data, type, user, meta) {

                                    return constructCheckboxHtml(user.tenantUserId, name);
                                }
                            });
                        })(name);
                    }
                }

                prepareTableData(roleNames).then(function (data) {
                    data.forEach(function (user) {
                        vm.users[user.tenantUserId] = user;
                    });
                    vm.usersBackup = _.cloneDeep(vm.users);

                    // console.dir(roleNames);
                    // console.dir(tableColumnConfig);
                    // console.dir(data);
                    vm.tableConfig = {
                        data: data,
                        columns: tableColumnConfig
                    }
                    // opDatatable.buildTable('.user-role-table', $scope)
                    //     .fromData(data)
                    //     .withColumn(tableColumnConfig)
                    //     .withOption('fixedColumns', {
                    //         leftColumns: 1
                    //     })
                    //     .withOption('scrollY', '350px')
                    //     .withOption('scrollX', true)
                    //     .withOption('scrollCollapse', true)
                    //     .withOption('paging', false)
                    //     .render();
                });
            });
        }

        init();

        function prepareTableData(roleNames) {
            return User.getTenantUsers(currentUser.tenantId).then(function (result) {
                var users = [];
                for (var i in result) {
                    var user = result[i];
                    var rowData = {
                        tenantUserId: user.tenantUserId
                    };
                    fillRowDataByRoleName(rowData, roleNames, user.roles);
                    rowData.login = user.login;
                    rowData.fullName = user.fullName;

                    users.push(rowData);
                }

                return users;
            });
        }

        function fillRowDataByRoleName(row, allRoleNames, userRoles) {
            for (var i in allRoleNames) {
                row[allRoleNames[i]] = false;
            }

            if (userRoles) {
                for (var i in userRoles) {
                    row[userRoles[i].name] = true;
                }
            }
        }

        var roleMap = {};

        function prepareColumn() {
            var defer = $q.defer();
            Role.query({}, function (roles) {
                var roleNames = roles.map(function (role) {
                    var name = role.name;
                    roleMap[name] = role;
                    return name;
                });

                defer.resolve(roleNames);
            });

            return defer.promise;
        }


        function save() {
            var changedUsers = collectChangeUser();
            if (changedUsers.length) {
                var toUpdateUsers = [];
                changedUsers.forEach(function (user) {
                    var toUpdateUser = {tenantUserId: user.tenantUserId, roles: []};
                    toUpdateUsers.push(toUpdateUser);
                    for (var key in user) {
                        if (key.indexOf('ROLE') != -1 && user[key]) {
                            toUpdateUser.roles.push(roleMap[key]);
                        }
                    }
                });

                console.dir(toUpdateUsers);

                User.updateTenantUserRoles(toUpdateUsers).then(function () {
                    messageService.toast('success', $translate.instant("sys_userManagement.preservationSuccess"));
                    $state.go('^', {}, {reload: true});
                }).catch(function () {
                    messageService.toast('error', $translate.instant("sys_userManagement.preservationError"));
                });
            } else {
                messageService.toast('warning', $translate.instant("sys_userManagement.notPreservation"));
            }
            // console.dir(changedUsers)
        }

        function collectChangeUser() {
            var changedUsers = [];
            for (var i in vm.usersBackup) {
                if (isUserChanged(vm.usersBackup[i], vm.users[i])) {
                    changedUsers.push(vm.users[i]);
                }
            }

            return changedUsers;
        }

        /**
         * is any property value change
         * @param before
         * @param after
         * @returns {boolean}
         */
        function isUserChanged(before, after) {
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
        .module('oplus.ssc')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('app.ssc.user', {
                url: '/user-management?tenantId',
                data: {
                    authorities: [],
                    pageTitle: 'sys_userManagement.home.title'
                },
                reloadOnSearch: false,
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/ssc/user/user-management.html',
                        controller: 'UserManagementController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('user-management');
                    //     return $translate.refresh();
                    // }]

                }
            })
            // .state('user-management.new', {
            //     url: '/new?',
            //     data: {
            //         authorities: []
            //     },
            //     onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
            //         $uibModal.open({
            //             templateUrl: 'app/modules/adm/user/user-management-dialog.html',
            //             controller: 'UserManagementEditController',
            //             controllerAs: 'vm',
            //             backdrop: 'static',
            //             size: 'lg',
            //             resolve: {
            //                 entity: function () {
            //                     //firstName: null, lastName: null,
            //                     return {
            //                         id: null,
            //                         tenantId: $stateParams.tenantId,
            //                         login: null,
            //                         fullName: null,
            //                         email: null,
            //                         authMode: 'LOCAL',
            //                         activated: true,
            //                         langKey: null,
            //                         createdBy: null,
            //                         createdDate: null,
            //                         lastModifiedBy: null,
            //                         lastModifiedDate: null,
            //                         resetDate: null,
            //                         resetKey: null,
            //                         roles: null
            //                     };
            //                 }
            //             }
            //         }).result.then(function () {
            //             $state.go('user-management', {tenantId: $stateParams.tenantId}, {reload: true});
            //         }, function () {
            //             $state.go('user-management');
            //         });
            //     }]
            // })
            // .state('user-management.new-tenant-user', {
            //     url: '/new-tenant-user',
            //     data: {
            //         authorities: []
            //     },
            //     onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
            //         $uibModal.open({
            //             templateUrl: 'app/modules/adm/user/user-management-tenant-user-dialog.html',
            //             controller: 'LinkTenantUserController',
            //             controllerAs: 'addTenantUserVm',
            //             backdrop: 'static',
            //             size: 'lg',
            //             resolve: {
            //                 tenantId: function () {
            //                     return $stateParams.tenantId;
            //                 }
            //             }
            //         }).result.then(function () {
            //             $state.go('user-management', {tenantId: $stateParams.tenantId}, {reload: true});
            //         }, function () {
            //             $state.go('user-management');
            //         });
            //     }]
            // })
            .state('app.ssc.user.edit', {
                url: '/{tenantUserId}/{viewType}',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/user/user-management-edit.html',
                        controller: 'UserManagementEditController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            entity: ['User', function (User) {
                                return User.get({tenantUserId: $stateParams.tenantUserId}).$promise;
                            }],
                            viewType: function () {
                                return $stateParams.viewType;
                            }
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.user', null, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.user.detail', {
                url: '/{tenantUserId}',
                data: {
                    authorities: [],
                    pageTitle: 'user-management.detail.title'
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/user/user-management-detail.html',
                        controller: 'UserManagementDetailController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['User', function (User) {
                                return User.get({tenantUserId: $stateParams.tenantUserId}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.user', null, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.user.delete', {
                url: '/{tenantUserId}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/user/user-management-delete.html',
                        controller: 'UserManagementDeleteController',
                        controllerAs: 'vm',
                        size: 'sm`',
                        resolve: {
                            entity: ['User', function (User) {
                                return User.get({tenantUserId: $stateParams.tenantUserId}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.user', null, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.user-allocate-role', {
                url: '/allocate-role',
                data: {
                    authorities: [],
                    pageTitle: 'user-management.allocate-role.title'
                },
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/ssc/user/user-management-allocate-role.html',
                        controller: 'UserManagementAllocateRoleController',
                        controllerAs: 'allocateRoleVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('user-management');
                    //     return $translate.refresh();
                    // }]
                }
            });
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['$scope', 'currentUser', 'User', 'Ldap', 'messageService', 'tenantUtil', 'restUtils','$translate'];

    /**
     *
     * @param $scope
     * @param currentUser
     * @param User
     * @param Ldap
     * @param messageService
     * @param tenantUtil
     * @param {restUtils} restUtils
     * @constructor
     */
    function UserManagementController($scope, currentUser, User, Ldap, messageService, tenantUtil, restUtils,$translate) {
        var vm = this;

        vm.isLdapSyncing = false;
        vm.enableSyncLdapUser = window.$oplus.appConfig.modules.uaa && window.$oplus.appConfig.modules.uaa.enableAdLogin && currentUser.hasPermission("sysadmin:*");
        vm.tenantId = currentUser.tenantId;
        vm.isAdminUI = tenantUtil.isOplusAdminUI();

        vm.syncLdapUsers = syncLdapUsers;
        vm.activeUser = activeUser;
        vm.onAddUser = onAddUser;

        var tableColumnConfig = [
            {data: 'login', title: $translate.instant("sys_userManagement.login")},
            {data: 'fullName', title:  $translate.instant("sys_userManagement.fullName")},
            {data: 'department', title:  $translate.instant("sys_userManagement.department")},
            {
                data: 'tenantCodes', title: $translate.instant("adm.tenantName"), bVisible: tenantUtil.isTenantAdminUI(),
                render: function (data, type, user, meta) {
                    var tenantContent = '';
                    if (tenantUtil.isTenantAdminUI()) {
                        var codes = data.split(',');
                        // console.log('code:', data, user.login);
                        angular.forEach(codes, function (code) {
                            if (code !== 'default') {
                                tenantContent = tenantContent + '<a class="badge bg-info text-white me-3">' + code + '</a>';
                            }
                        });
                    }
                    return tenantContent;
                }
            },

            {
                data: 'activated', title: $translate.instant("sys_userManagement.state"), class: 'text-center',
                render: function (data, type, user, meta) {
                    var isDisabled = (currentUser.loginId === user.login);

                    return '<button class="btn btn-danger btn-sm" ng-click=vm.activeUser("' + encodeURI(JSON.stringify(user)) + '",true) ng-show=' + !user.activated + ' data-translate="sys_userManagement.deactivated">' +
                        'Deactivated' +
                        '</button>' +
                        '<button class="btn btn-success btn-sm"  ng-click=vm.activeUser("' + encodeURI(JSON.stringify(user)) + '",false)  ng-show=' + user.activated + ' ng-disabled=' + isDisabled + ' data-translate="sys_userManagement.activated">' +
                        'Activated' +
                        '</button>';
                }
            },
            {
                data: 'authMode', title: $translate.instant("sys_userManagement.authMode"),
                render: function (data, type, user, meta) {
                    var authModeBtn;
                    if (user.authMode === 'AD') {
                        authModeBtn = '<span class="badge bg-info"  data-translate="sys_userManagement.authModeOption.ad">Active Directory</span>';
                    } else if (user.authMode === 'MIX') {
                        authModeBtn = '<span class="badge bg-dark" data-translate="sys_userManagement.authModeOption.adAndLocal">Mixed</span>';
                    } else if (user.authMode === 'UN') {
                        authModeBtn = '<span class="badge bg-warning" data-translate="sys_userManagement.unifiedAuthentication">Unified Authentication</span>';
                    } else {
                        authModeBtn = '<span class="badge bg-info"  data-translate="sys_userManagement.authModeOption.local">Local</span>';
                    }
                    return authModeBtn;
                }
            },
            {
                data: 'roles', title: $translate.instant("sys_userManagement.roles"),
                render: function (data, type, user, meta) {
                    var roleContent = "";
                    angular.forEach(user.roles, function (role) {
                        roleContent += '<label class="badge bg-secondary me-2">' + role.description + '</label>'
                    });
                    return '<span style="white-space: normal;">' + roleContent + '</span>';
                }
            },
            {data: 'lastModifiedDate', title: $translate.instant("sys_userManagement.lastModificationTime")},
            {
                data: 'id', title: $translate.instant("common.action.action"),
                searchable: false,
                render: function (data, type, user, meta) {

                    var param = angular.toJson({tenantUserId: user.tenantUserId,viewType: 'edit'});
                    var param2 = angular.toJson({tenantUserId: user.tenantUserId,viewType: 'detail'});
                    var isDisableDelete = (currentUser.loginId == user.login);
                    return '    <button type="submit"\n' +
                        '            ui-sref=app.ssc.user.edit(' + param2 + ')' +
                        '            class="btn btn-default btn-sm"><i class="fa fa-view"></i>' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.view"></span>' +
                        '    </button>\n' +
                        '    <button type="submit"\n' +
                        '            ui-sref=app.ssc.user.edit(' + param + ')' +
                        '            class="btn btn-default btn-sm">' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.edit"></span>' +
                        '    </button>\n' +
                        '    <button type="submit"' +
                        '            ui-sref=app.ssc.user.delete(' + param + ')' +
                        '            class="btn btn-danger btn-sm"\n' +
                        '            ng-disabled=' + isDisableDelete + '>' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.delete"></span>' +
                        '    </button>';
                }
            }
        ];
        vm.tableConfig = {
            data: function () {
                var tenantId = currentUser.tenantId;
                var countByTenant = tenantUtil.isTenantAdminUI();
                return restUtils.callAjax('GET', window.$oplus.appConfig.apiBaseUrls.portal + "/api/users"
                    + (tenantId ? ("?tenantId=" + tenantId) : "")
                    + (countByTenant ? ((tenantId ? '&' : '?') + "statistics=true") : ""))
            },
            columns: tableColumnConfig
        }

        function onAddUser(users) {
            if (users) {
                reloadTable();
            }
        }

        function reloadTable() {
            vm.tableConfig.reloadData();
        }

        function activeUser(stringUser, isActivated) {
            var user = JSON.parse(decodeURI(stringUser));
            user.activated = isActivated;
            User.update(user, function () {
                reloadTable();
            });
        }

        function syncLdapUsers() {
            messageService.confirm($translate.instant("sys_userManagement.operationConfirm"), $translate.instant("sys_userManagement.confirmSynchronizing"), function () {
                vm.isLdapSyncing = true;
                Ldap.syncLdapUsers(function (data) {
                    messageService.toast('success', $translate.instant("sys_userManagement.synchronizingSuccess"));
                    vm.isLdapSyncing = false;
                    reloadTable();
                }, function (error) {
                    vm.isLdapSyncing = false;
                    messageService.alertError($translate.instant("sys_userManagement.error"), angular.toJson(error.data));
                })
            });
        }
    }
})();

/*!
 *
 *
 * 租户用户列表
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name tenantUserList
     * @description show user of per tenant
     *
     * ```html
     * <op-user-select-tree
     * checkType="checkbox"
     * filterType="inner"
     * default="vm.defaultSelected"
     * disabled="vm.defaultDisabled"
     * excludeLogin=false
     * expandAll=false
     * onSelect="vm.onUserSelect"
     * getSelectedHook="vm.getSelectedUsers">
     * ```
     */
    angular.module('oplus.ssc').component('tenantUserList', {
        templateUrl: 'app/modules/ssc/user/tenant-user-list-component.html',
        replace: true,
        controller: ['$scope', 'currentUser', 'User',  'restUtils','$translate', TenantUserListCtrl],
        controllerAs: 'tenantUserListVm',
        bindings: {
            tenantId: '<',//租户id
            onUpdate: '&'//更新回调
        }
    });

    /**
     *
     * @param $scope
     * @param currentUser
     * @param User
     * @param {restUtils} restUtils
     * @constructor
     */
    function TenantUserListCtrl($scope, currentUser, User,  restUtils,$translate) {
        var vm = this;

        vm.$onInit = function () {
            // initTable(vm.tenantId);

            $scope.$on('TENANT-USER:LINKED', function (event) {
                vm.tableConfig.reloadData();
            });
        };


        vm.onUpdateUser = function (user) {
            if (user) {
                vm.tableConfig.reloadData();
            }
        };

        // var tableOptions;
        var tableColumnConfig = [
            {data: 'login', title: $translate.instant("sys_userManagement.login")},
            {data: 'fullName', title:  $translate.instant("sys_userManagement.fullName")},
            {data: 'department', title:  $translate.instant("sys_userManagement.department")},
            {
                data: 'roles', title: $translate.instant("sys_userManagement.roles"),
                render: function (data, type, user, meta) {
                    var roleContent = "";
                    angular.forEach(user.roles, function (role) {
                        roleContent += '【' + role.description + '】 '
                    });
                    return '<span style="white-space: normal;">' + roleContent + '</span>';
                }
            },
            {
                data: 'authMode', title: $translate.instant("sys_userManagement.authMode"),
                render: function (data, type, user, meta) {
                    var authModeBtn;
                    if (user.authMode == 'AD') {
                        authModeBtn = '<span class="badge bg-info">' + $translate.instant("sys_userManagement.tenantUserList.domainAccount") + '</span>';
                    } else if (user.authMode == 'MIX') {
                        authModeBtn = '<span class="badge bg-info">' + $translate.instant("sys_userManagement.tenantUserList.blend") + '</span>';
                    } else if (user.authMode === 'UN') {
                        authModeBtn = '<span class="badge bg-info">' + $translate.instant("sys_userManagement.tenantUserList.unifiedAuthentication") + '</span>';
                    } else {
                        authModeBtn = '<span class="badge bg-info" >' + $translate.instant("sys_userManagement.tenantUserList.local") + '</span>';
                    }
                    return authModeBtn;
                }
            },
            {data: 'lastModifiedDate', title: $translate.instant("sys_userManagement.lastModificationTime")},
            {
                data: 'id', title: $translate.instant("common.action.action"),
                class: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, user, meta) {
                    return '<div class="btn-group">' +
                        '    <button class="btn btn-default btn-sm" type="button"  view-tenant-user tenant-user-id="' + user.tenantUserId + '">' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.view"></span>' +
                        '    </button>' +
                        '    <button class="btn btn-default btn-sm"  type="button" edit-tenant-user tenant-user-id="' + user.tenantUserId + '" on-update="tenantUserListVm.onUpdateUser">' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.edit"></span>' +
                        '    </button>' +
                        '    <button class="btn btn-danger btn-sm" type="button" delete-tenant-user tenant-user-id="' + user.tenantUserId + '" on-delete="tenantUserListVm.onUpdateUser"' +
                        '            ng-disabled=' + (currentUser.loginId === user.login) + '>' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.delete"></span>' +
                        '    </button>' +
                        '</div>'
                }
            }
        ];
        this.tableConfig = {
            data: function () {
                return restUtils.callAjax('GET', window.$oplus.appConfig.apiBaseUrls.portal + "/api/users" + (vm.tenantId ? ("?tenantId=" + vm.tenantId) : ""));
            },
            columns: tableColumnConfig
        }
    }
})();



/*!
 *
 *
 * 关联基础用户到租户
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name linkTenantUser
     * @description  show user link dialog when click the directive
     * parameter of onUpdate can be null(cancel) or User objects(save)
     * ```html
     * <xxx
     * link-tenant-user
     * tenant-id="${tenantId}"
     * onUpdate="${onUpdateCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('linkTenantUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantId: '@',//租户用户id
                onUpdate: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', 'User',  LinkTenantUserCtrl],
            controllerAs: 'linkTenantUserVm'
        }
    });

    //任务协作人选择控制器
    function LinkTenantUserCtrl($scope, $element, $uibModal, User ) {
        var vm = this;

        function init() {
            // console.log('tenantId', $scope.tenantId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-link-tenant-user.html',
                    controller: 'LinkTenantUserController',
                    controllerAs: 'addTenantUserVm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tenantId: function () {
                            return $scope.tenantId;
                        },
                        onAddUser: function () {
                            return onUpdate;
                        }
                    }
                }).result.then(function (users) {
                    onUpdate(users || []);
                }, function () {
                    onUpdate();
                });
            });
        }

        init();

        function onUpdate(users) {
            $scope.onUpdate && $scope.onUpdate(users);
        }
    }
})();



/*!
 *
 *
 * 编辑租户用户
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name editTenantUser
     * @description  show user edit dialog when click the directive
     * parameter of onUpdate can be null(cancel) or User object(save)
     * ```html
     * <xxx
     * edit-tenant-user
     * tenant-user-id="${tenantUserId}"
     * onUpdate="${onUpdateCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('editTenantUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantUserId: '@',//租户用户id
                onUpdate: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', 'User',  EditTenantUserCtrl],
            controllerAs: 'editTenantUserVm'
        }
    });

    //任务协作人选择控制器
    function EditTenantUserCtrl($scope, $element, $uibModal, User ) {
        var vm = this;

        function init() {
            // console.log('tenantUserId', $scope.tenantUserId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-edit.html',
                    controller: 'UserManagementEditController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['User', function (User) {
                            return User.get({tenantUserId: $scope.tenantUserId}).$promise;
                        }],
                        viewType: function () {
                            return 'directive-edit';
                        }
                    }
                }).result.then(function (user) {
                    onUpdate(user || {});
                }, function () {
                    onUpdate();
                });
            });
        }

        init();

        function onUpdate(user) {
            $scope.onUpdate && $scope.onUpdate(user);
        }
    }
})();



/*!
 *
 *
 * 删除租户用户
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name deleteTenantUser
     * @description  show user delete dialog when click the directive
     * ```html
     * <xxx
     * delete-tenant-user
     * tenant-user-id="${tenantUserId}"
     * onDelete="${onDeleteCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('deleteTenantUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantUserId: '@',//租户用户id
                onDelete: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', 'User',  DeleteTenantUserCtrl],
            controllerAs: 'deleteTenantUserVm'
        }
    });

    //任务协作人选择控制器
    function DeleteTenantUserCtrl($scope, $element, $uibModal, User ) {
        var vm = this;

        function init() {
            // console.log('tenantUserId', $scope.tenantUserId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-delete.html',
                    controller: 'UserManagementDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['User', function (User) {
                            return User.get({tenantUserId: $scope.tenantUserId}).$promise;
                        }]
                    }
                }).result.then(function (user) {
                    onDelete(user || {});
                }, function () {
                    onDelete();
                });
            });
        }

        init();

        function onDelete(user) {
            $scope.onDelete && $scope.onDelete(user);
        }
    }
})();



/*!
 *
 *
 * 关联基础用户到租户
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name createUser
     * @description  show user link dialog when click the directive
     * parameter of onUpdate can be null(cancel) or User objects(save)
     * ```html
     * <xxx
     * link-tenant-user
     * tenant-id="${tenantId}"
     * onUpdate="${onUpdateCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('createUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantId: '@',//租户用户id
                onUpdate: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', CreateUserCtrl],
            controllerAs: 'createUserVm'
        }
    });

    //任务协作人选择控制器
    function CreateUserCtrl($scope, $element, $uibModal) {
        var vm = this;

        function init() {
            // console.log('tenantId', $scope.tenantId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-edit.html',
                    controller: 'UserManagementEditController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tenantId: function () {
                            return $scope.tenantId;
                        },
                        entity: function () {
                            //firstName: null, lastName: null,
                            return {
                                id: null,
                                tenantId: $scope.tenantId,
                                login: null,
                                fullName: null,
                                email: null,
                                authMode: 'LOCAL',
                                activated: true,
                                langKey: null,
                                createdBy: null,
                                createdDate: null,
                                lastModifiedBy: null,
                                lastModifiedDate: null,
                                resetDate: null,
                                resetKey: null,
                                roles: null
                            };
                        },
                        viewType: function () {
                            return 'directive-create';
                        }
                    }
                }).result.then(function (users) {
                    onUpdate(users || []);
                }, function () {
                    onUpdate();
                });
            });
        }

        init();

        function onUpdate(users) {
            $scope.onUpdate && $scope.onUpdate(users);
        }
    }
})();



(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.syslog', {
                url: '/syslog',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/syslog/syslog.html';
                        },
                        controller: 'udpSyslogCtrl'
                    }
                }
            })
        ;
    }]);
})();

(function () {
    'use strict';

    angular.module('oplus.ssc').controller('udpSyslogCtrl', udpSyslogCtrl);

    udpSyslogCtrl.$inject = ['$scope', '$state', '$compile', '$stateParams', '$location', 'messageService', 'udpTagsService', '$q', 'SyslogService', 'OperationlogService', '$translate'];

    function udpSyslogCtrl($scope, $state, $compile, $stateParams, $location, messageService, udpTagsService, $q, SyslogService, OperationlogService, $translate) {
        $scope.activeTab = 'login';

        sysLoginQuery();
        operationLoginQuery();

        function sysLoginQuery() {
            var tableColumnConfig = [
                // {mData: 'userId', title: "用户ID"},
                {mData: 'username', title: $translate.instant('sys_log.login_user')},
                {mData: 'loginTime', title: $translate.instant('sys_log.login_time')},
                {
                    mData: 'ipAddress', title: "IP",
                    render: function (data, type, row, meta) {
                        var spanClass = "badge bg-light";
                        return '<span type="text"  data-placement="left" class="' + spanClass + '" ' +
                            'title="' + row.ipAddress + '" ' +
                            '>' + row.ipAddress + '</span>';
                    }
                },
                {mData: 'geoLocation', title: $translate.instant('sys_log.address')},
                {
                    mData: 'loginStatus', title: $translate.instant('sys_log.login_status'),
                    render: function (data, type, row, meta) {
                        var spanClass = "badge bg-success";
                        if (row.loginStatus === "failed") {
                            spanClass = "badge bg-danger";
                        }
                        return '<span type="text"  data-placement="left" class="' + spanClass + '" ' +
                            'title="' + row.loginStatus + '" ' +
                            '>' + row.loginStatus + '</span>';
                    }
                },
                {
                    mData: 'deviceInfo',
                    title: $translate.instant('sys_log.device_info'),
                    render: function (data, type, row) {
                        if (!data) return '';
                        return '<span type="text" style="display:inline-block; max-width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;"  data-placement="left" ' +
                            ' title="' + data + '" ' +
                            '>' + data + '</span>';
                    }
                }
                // {mData: 'remark', title: "备注"},
            ];

            SyslogService.query(function (result) {
                $scope.sysTableConfig = {
                    data: result.content,
                    columns: tableColumnConfig,
                    order: [[1, 'desc']]
                };
            });
        }

        function operationLoginQuery() {
            var tableColumnConfig = [
                // {mData: 'id', title: "用户ID"},
                {mData: 'operator', title: $translate.instant('sys_log.operator')},
                {mData: 'operateTime', title: $translate.instant('sys_log.operate_time')},
                {mData: 'appModule', title: $translate.instant('sys_log.app_module')},
                {
                    mData: 'operationType', title: $translate.instant('sys_log.operation_type'),
                    render: function (data, type, row, meta) {
                        var spanClass = "badge bg-success";
                        if (row.operationType === "DELETE") {
                            spanClass = "badge bg-danger";
                        } else if (row.operationType === "UPDATE") {
                            spanClass = "badge bg-warning";
                        } else if (row.operationType === "CREATE") {
                            spanClass = "badge bg-secondary";
                        } else if (row.operationType === "EXECUTE") {
                            spanClass = "badge bg-primary";
                        } else if (row.operationType === "QUERY") {
                            spanClass = "badge bg-info";
                        }
                        return '<span type="text"  data-placement="left" class="' + spanClass + '" ' +
                            'title="' + row.operationType + '" ' +
                            '>' + row.operationType + '</span>';
                    }
                },
                {mData: 'description', title: $translate.instant('sys_log.description')},
                {
                    mData: 'status', title: $translate.instant('sys_log.status'),
                    render: function (data, type, row, meta) {
                        var spanClass = "badge bg-success";
                        if (row.status === "failed") {
                            spanClass = "badge bg-danger";
                        }
                        return '<span type="text"  data-placement="left" class="' + spanClass + '" ' +
                            'title="' + row.status + '" ' +
                            '>' + row.status + '</span>';
                    }
                }
            ];

            OperationlogService.query(function (result) {
                $scope.operationTableConfig = {
                    data: result,
                    columns: tableColumnConfig,
                    order: [[1, 'desc']]
                };
            });
        }
    }
})();

(function () {
    'use strict';
    angular
        .module('oplus.ssc')
        .factory('SyslogService', SyslogService);

    SyslogService.$inject = ['$resource', '$http', '$q'];

    function SyslogService($resource, $http, $q) {
        var resourceUrl = 'api/login-logs/:id';

        var service = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: false},
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
        .module('oplus.ssc')
        .factory('OperationlogService', OperationlogService);

    OperationlogService.$inject = ['$resource', '$http', '$q'];

    function OperationlogService($resource, $http, $q) {
        var resourceUrl = 'api/operation-logs/:id';

        var service = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: false},
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
