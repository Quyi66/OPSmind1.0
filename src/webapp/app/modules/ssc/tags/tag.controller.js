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
