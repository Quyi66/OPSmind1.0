(function () {
    angular.module('oplus.cac').controller('CacEmailRecipientController', CacEmailRecipientController);

    CacEmailRecipientController.$inject = ['$scope', '$state', '$http', 'messageService', 'currentUser', '$translate', 'sscEmailService', '$uibModal'];

    function CacEmailRecipientController($scope, $state, $http, messageService, currentUser, $translate, sscEmailService, $uibModal) {
        var vm = this;

        sscEmailService.getCacEmailSwitch().then(function (data) {
            vm.s = data;
            vm.isTheEmailEnabled = data.isTheEmailEnabled === "yes";
        });

        $scope.on_off = function () {
            vm.s.isTheEmailEnabled = vm.isTheEmailEnabled ? "yes" : "no";
            sscEmailService.saveCacEmailSwitch(vm.s);
        }

        // 初始化时添加按钮拦截逻辑
        $scope.$on('$viewContentLoaded', function() {
            setTimeout(function() {
                // 拦截"收件人列表"按钮点击事件
                $(document).off('click', '[data-action="recipient-manage-v2"]').on('click', '[data-action="recipient-manage-v2"]', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var templateId = $(this).data('template-id');
                    if (templateId) {
                        $state.go('app.cac.emailv2.recipient-manage', { templateId: templateId });
                        $scope.$apply();
                    }
                });
            }, 100);
        });

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
                        $uibModalInstance.close({ action: "cancel" });
                    }

                    function save() {
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

    }
})();