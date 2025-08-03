(function () {
    angular.module('oplus.cac').controller('CacEmailV2RecipientManageController', CacEmailV2RecipientManageController);

    CacEmailV2RecipientManageController.$inject = ['$scope', '$state', '$stateParams', '$http', 'messageService', 'currentUser', '$translate', '$uibModal', 'CacEmailV2RecipientManageService'];

    function CacEmailV2RecipientManageController($scope, $state, $stateParams, $http, messageService, currentUser, $translate, $uibModal, CacEmailV2RecipientManageService) {
        var vm = this;
        
        vm.templateId = $stateParams.templateId;
        vm.currentTemplate = null;
        vm.recipients = [];
        vm.templates = [];
        
        // 初始化
        init();
        
        function init() {
            loadCurrentTemplate();
            loadRecipients();
            loadAllTemplates();
        }
        
        // 加载当前模版信息
        function loadCurrentTemplate() {
            CacEmailV2RecipientManageService.getTemplate(vm.templateId).then(function(response) {
                vm.currentTemplate = response;
            }).catch(function(error) {
                console.error('Failed to load template:', error);
                // 使用模拟数据作为后备
                vm.currentTemplate = {
                    template_id: vm.templateId,
                    template_name: '模版名称 ' + vm.templateId
                };
            });
        }
        
        // 加载收件人列表
        function loadRecipients() {
            CacEmailV2RecipientManageService.getRecipients(vm.templateId).then(function(response) {
                vm.recipients = response;
            }).catch(function(error) {
                console.error('Failed to load recipients:', error);
                // 使用模拟数据作为后备
                vm.recipients = [
                    {
                        id: 1,
                        email: 'user1@example.com',
                        name: '用户1',
                        created_at: new Date()
                    },
                    {
                        id: 2,
                        email: 'user2@example.com', 
                        name: '用户2',
                        created_at: new Date()
                    }
                ];
            });
        }
        
        // 加载所有模版列表
        function loadAllTemplates() {
            CacEmailV2RecipientManageService.getAllTemplates().then(function(response) {
                vm.templates = response;
            }).catch(function(error) {
                console.error('Failed to load templates:', error);
                // 使用模拟数据作为后备
                vm.templates = [
                    { template_id: '1', template_name: '模版1' },
                    { template_id: '2', template_name: '模版2' },
                    { template_id: '3', template_name: '模版3' }
                ];
            });
        }
        
        // 新增收件人
        vm.addRecipient = function() {
            openRecipientDialog(null, 'add');
        };
        
        // 编辑收件人
        vm.editRecipient = function(recipient) {
            openRecipientDialog(recipient, 'edit');
        };
        
        // 删除收件人
        vm.deleteRecipient = function(recipient) {
            openRecipientDialog(recipient, 'delete');
        };
        
        // 打开收件人操作对话框
        function openRecipientDialog(recipient, action) {
            var instance = $uibModal.open({
                templateUrl: 'app/modules/cac/emailv2/email-recipient-dialog.html',
                controller: 'CacEmailV2RecipientDialogController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    recipient: function() {
                        return recipient;
                    },
                    action: function() {
                        return action;
                    },
                    currentTemplate: function() {
                        return vm.currentTemplate;
                    },
                    templates: function() {
                        return vm.templates;
                    }
                }
            });
            
            instance.result.then(function(result) {
                if (result && result.action !== 'cancel') {
                    loadRecipients(); // 重新加载收件人列表
                }
            });
        }
    }
})();