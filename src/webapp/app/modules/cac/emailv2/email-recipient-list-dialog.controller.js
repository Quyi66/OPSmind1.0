(function () {
    'use strict';

    angular
        .module('oplus.cac')
        .controller('CacEmailV2RecipientListDialogController', CacEmailV2RecipientListDialogController);

    CacEmailV2RecipientListDialogController.$inject = ['$scope', '$uibModalInstance', '$uibModal', '$translate', 'templateId', 'CacEmailV2RecipientManageService'];

    function CacEmailV2RecipientListDialogController($scope, $uibModalInstance, $uibModal, $translate, templateId, CacEmailV2RecipientManageService) {
        var vm = this;

        // 初始化
        vm.templateId = templateId;
        vm.recipients = [];
        vm.loading = false;
        vm.searchText = '';
        vm.currentPage = 1;
        vm.pageSize = 10;
        vm.totalItems = 0;

        // 方法
        vm.loadRecipients = loadRecipients;
        vm.addRecipient = addRecipient;
        vm.editRecipient = editRecipient;
        vm.deleteRecipient = deleteRecipient;
        vm.close = close;
        vm.cancel = cancel;
        vm.refresh = refresh;

        // 初始化加载
        activate();

        function activate() {
            loadRecipients();
        }

        function loadRecipients() {
            vm.loading = true;
            
            var params = {
                templateId: vm.templateId,
                page: vm.currentPage,
                size: vm.pageSize,
                search: vm.searchText
            };

            CacEmailV2RecipientManageService.getRecipients(params)
                .then(function(response) {
                    if (response.data && response.data.records) {
                        vm.recipients = response.data.records;
                        vm.totalItems = response.data.total || 0;
                    } else {
                        vm.recipients = [];
                        vm.totalItems = 0;
                    }
                })
                .catch(function(error) {
                    console.error('加载收件人列表失败:', error);
                    vm.recipients = [];
                    vm.totalItems = 0;
                })
                .finally(function() {
                    vm.loading = false;
                });
        }

        function addRecipient() {
            openRecipientDialog(null, 'add');
        }

        function editRecipient(recipient) {
            openRecipientDialog(recipient, 'edit');
        }

        function deleteRecipient(recipient) {
            if (confirm($translate.instant('common.message.confirm_delete'))) {
                CacEmailV2RecipientManageService.deleteRecipient(recipient.id)
                    .then(function() {
                        loadRecipients();
                    })
                    .catch(function(error) {
                        console.error('删除收件人失败:', error);
                    });
            }
        }

        function openRecipientDialog(recipient, action) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/modules/cac/emailv2/email-recipient-dialog.html',
                controller: 'CacEmailV2RecipientDialogController',
                controllerAs: 'vm',
                size: 'md',
                backdrop: 'static',
                resolve: {
                    recipient: function() {
                        return recipient;
                    },
                    action: function() {
                        return action;
                    },
                    currentTemplate: function() {
                        return { id: vm.templateId };
                    },
                    templates: function() {
                        return [];
                    }
                }
            });

            modalInstance.result.then(function(result) {
                if (result && result.action === 'save') {
                    loadRecipients();
                }
            });
        }

        function refresh() {
            vm.currentPage = 1;
            loadRecipients();
        }

        function close() {
            $uibModalInstance.close({ action: 'close' });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        // 监听搜索
        $scope.$watch('vm.searchText', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                vm.currentPage = 1;
                loadRecipients();
            }
        });

        // 监听分页
        $scope.$watch('vm.currentPage', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                loadRecipients();
            }
        });
    }
})();