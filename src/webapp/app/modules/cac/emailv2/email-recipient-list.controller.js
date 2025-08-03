(function () {
    angular.module('oplus.cac').controller('CacEmailV2RecipientController', CacEmailV2RecipientController);

    CacEmailV2RecipientController.$inject = ['$scope', '$state', '$http', 'messageService', 'currentUser', '$translate', 'sscEmailService', '$uibModal'];

    function CacEmailV2RecipientController($scope, $state, $http, messageService, currentUser, $translate, sscEmailService, $uibModal) {
        var vm = this;

        // 初始化UDP页面交互事件
        initUdpPageInteractions();

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
        
        // 初始化UDP页面交互事件
        function initUdpPageInteractions() {
            // 监听UDP页面的收件人管理事件
            $scope.$on('udp-page-interaction', function(event, data) {
                if (data.action === 'recipient-manage-v2' && data.templateId) {
                    vm.openRecipientManage(data.templateId);
                }
            });
            
            // 延迟执行，等待UDP页面加载完成
            setTimeout(function() {
                vm.interceptRecipientButtons();
                
                // 监听表格刷新事件，重新绑定按钮
                $scope.$on('refresh_table', function() {
                    setTimeout(function() {
                        vm.interceptRecipientButtons();
                    }, 500);
                });
            }, 1500);
        }
        
        // 拦截收件人列表按钮
        vm.interceptRecipientButtons = function() {
            // 使用jQuery查找收件人列表按钮
            $(document).off('click.recipient-manage-v2').on('click.recipient-manage-v2', 'button[data-action="recipient-manage-v2"]', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                var templateId = $(this).data('template-id');
                if (templateId) {
                    $scope.$apply(function() {
                        vm.openRecipientManage(templateId);
                    });
                }
                
                return false;
            });
        };
        
        // 打开收件人管理页面
        vm.openRecipientManage = function(templateId) {
            $state.go('app.cac.emailv2.recipient-manage', {templateId: templateId});
        };
    }
})();