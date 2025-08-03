(function () {
    angular.module('oplus.cac').controller('CacEmailV2RecipientDialogController', CacEmailV2RecipientDialogController);

    CacEmailV2RecipientDialogController.$inject = ['$scope', '$uibModalInstance', 'messageService', '$translate', 'recipient', 'action', 'currentTemplate', 'templates', 'CacEmailV2RecipientManageService'];

    function CacEmailV2RecipientDialogController($scope, $uibModalInstance, messageService, $translate, recipient, action, currentTemplate, templates, CacEmailV2RecipientManageService) {
        var vm = this;
        
        vm.action = action;
        vm.currentTemplate = currentTemplate;
        vm.templates = templates;
        vm.recipientData = {};
        vm.selectedTemplates = {};
        vm.isTemplateExpanded = false;
        
        // 初始化
        init();
        
        function init() {
            // 初始化收件人数据
            if (recipient) {
                vm.recipientData = angular.copy(recipient);
            } else {
                vm.recipientData = {
                    email: '',
                    name: ''
                };
            }
            
            // 初始化模版选择状态
            initTemplateSelection();
        }
        
        // 初始化模版选择状态
        function initTemplateSelection() {
            vm.selectedTemplates = {};
            
            // 默认选中当前模版
            if (vm.currentTemplate) {
                vm.selectedTemplates[vm.currentTemplate.template_id] = true;
            }
        }
        
        // 切换模版扩展面板
        vm.toggleTemplateExpansion = function() {
            vm.isTemplateExpanded = !vm.isTemplateExpanded;
        };
        
        // 获取选中的模版数量
        vm.getSelectedTemplateCount = function() {
            var count = 0;
            for (var templateId in vm.selectedTemplates) {
                if (vm.selectedTemplates[templateId]) {
                    count++;
                }
            }
            return count;
        };
        
        // 获取选中的模版ID列表
        function getSelectedTemplateIds() {
            var selectedIds = [];
            for (var templateId in vm.selectedTemplates) {
                if (vm.selectedTemplates[templateId]) {
                    selectedIds.push(templateId);
                }
            }
            return selectedIds;
        }
        
        // 保存
        vm.save = function() {
            var selectedTemplateIds = getSelectedTemplateIds();
            
            var requestData = {
                action: vm.action,
                recipient: vm.recipientData,
                templateIds: selectedTemplateIds,
                currentTemplateId: vm.currentTemplate.template_id
            };
            
            // 根据操作类型执行不同的逻辑
            switch (vm.action) {
                case 'add':
                    addRecipient(requestData);
                    break;
                case 'edit':
                    editRecipient(requestData);
                    break;
                case 'delete':
                    deleteRecipient(requestData);
                    break;
            }
        };
        
        // 新增收件人
        function addRecipient(requestData) {
            CacEmailV2RecipientManageService.syncRecipientToTemplates('add', requestData.recipient, requestData.templateIds)
                .then(function(response) {
                    messageService.toast('success', '收件人新增成功，已同步到 ' + requestData.templateIds.length + ' 个模版');
                    $uibModalInstance.close({ action: 'add', data: requestData });
                })
                .catch(function(error) {
                    console.error('Failed to add recipient:', error);
                    messageService.toast('error', '收件人新增失败：' + (error.message || '未知错误'));
                });
        }
        
        // 编辑收件人
        function editRecipient(requestData) {
            CacEmailV2RecipientManageService.syncRecipientToTemplates('edit', requestData.recipient, requestData.templateIds)
                .then(function(response) {
                    messageService.toast('success', '收件人编辑成功，已同步到 ' + requestData.templateIds.length + ' 个模版');
                    $uibModalInstance.close({ action: 'edit', data: requestData });
                })
                .catch(function(error) {
                    console.error('Failed to edit recipient:', error);
                    messageService.toast('error', '收件人编辑失败：' + (error.message || '未知错误'));
                });
        }
        
        // 删除收件人
        function deleteRecipient(requestData) {
            CacEmailV2RecipientManageService.syncRecipientToTemplates('delete', requestData.recipient, requestData.templateIds)
                .then(function(response) {
                    messageService.toast('success', '收件人删除成功，已从 ' + requestData.templateIds.length + ' 个模版中移除');
                    $uibModalInstance.close({ action: 'delete', data: requestData });
                })
                .catch(function(error) {
                    console.error('Failed to delete recipient:', error);
                    messageService.toast('error', '收件人删除失败：' + (error.message || '未知错误'));
                });
        }
        
        // 取消
        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();