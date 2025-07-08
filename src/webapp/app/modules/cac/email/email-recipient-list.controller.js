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

    }
})
();
