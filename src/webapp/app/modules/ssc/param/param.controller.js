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
