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
