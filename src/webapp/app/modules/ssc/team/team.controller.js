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
                    { mData: 'name', title: $translate.instant('team.name') },
                    { mData: 'code', title: $translate.instant('team.code') },
                    { mData: 'description', title: $translate.instant('team.description') },
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
                            var id = angular.toJson({ id: row.id });
                            return ' <button type="submit" ui-sref=app.ssc.config.team.edit(' + id + ') class="btn btn-default btn-sm">' +
                                '     <span class="hidden-sm-down">编辑</span>' +
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
