/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict'

    angular.module('oplus.ssc').controller('sscEmailCtrl', sscEmailCtrl);

    sscEmailCtrl.$inject = ['$scope', '$state', 'messageService', '$translate', 'sscEmailService', '$uibModal'];

    function sscEmailCtrl($scope, $state, messageService, $translate, sscEmailService, $uibModal) {
        var vm = this;

        vm.emails = {};
        vm.change = {};//变更对比

        sscEmailService.getEmailConfig().then(function (data) {
            vm.emails = data;
            vm.change = angular.copy(data);

            vm.port = parseInt(data.port);
            vm.debug_on_off = "yes" === data.debug_on_off;
            vm.ssl_on_off = "yes" === data.ssl_on_off;


        });

        $scope.recipientTypes = [
            {label: "TO", value: 'to'},
            {label: "CC", value: 'cc'},
            {label: "BCC", value: 'bcc'}
        ];
        //to 表示发送，表示期望得到该收件人的响应。
        //cc 表示抄送,表示没有期待对邮件做出回复
        //bcc 表示密件抄送。在群发邮件时，收信人彼此不认识，为了保护收信人的隐私，可以在地址栏To中填上自己，然后将所有收信人都填在Bcc中

        $scope.submitForm = function () {
            messageService.confirm($translate.instant('adm.prompt.change_operation'), $translate.instant('adm.prompt.cwtstc'), function () {
                vm.emails.port = vm.port + "";
                vm.emails.debug_on_off = vm.debug_on_off ? "yes" : "no";
                vm.emails.ssl_on_off = vm.ssl_on_off ? "yes" : "no";

                sscEmailService.saveEmailConfig(vm.emails).then(function (data) {
                    if ("200" === data.code) {
                        messageService.toast('success', $translate.instant('adm.prompt.success_change'));
                        vm.change = angular.copy(vm.emails);
                    } else {
                        messageService.toast('error', data.msg);
                    }
                }).catch(function (err) {
                    messageService.toast('error', err);
                });
            });
        }

        $scope.testEmail = function () {
            vm.emails.port = vm.port + "";
            vm.emails.debug_on_off = vm.debug_on_off ? "yes" : "no";
            vm.emails.ssl_on_off = vm.ssl_on_off ? "yes" : "no";

            let changeBoolean = true;

            _.mapKeys(vm.emails, function (val, key) {
                if(vm.emails[key] !== vm.change[key]){
                    changeBoolean = false;
                }
            });

            if(changeBoolean){
                var instance = $uibModal.open({
                    template: '' +
                        '<div class="modal-header">' +
                        '   <h3 class="modal-title">{{ \'adm.prompt.petrea\' | translate}}</h3>' +
                        '   <a ng-click="$ctrl.cancel()">' +
                        '       <i class="fa fa-times" style="font-size: 20px;"></i>' +
                        '   </a>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '   <form class="op-smartform form-vertical" ng-submit="$ctrl.recipientSubmit()">' +
                        '       <div class="form-group">\n' +
                        '           <label class="control-label">{{ \'adm.prompt.recipient_email_address\' | translate}}</label>\n' +
                        '           <input type="email" class="form-control" ng-model="$ctrl.recipientAddress" required>\n' +
                        '       </div>' +
                        '       <div class="form-group">\n' +
                        '           <button type="submit" class="btn btn-default me-3">{{ \'adm.prompt.send\' | translate}}</button>' +
                        '       </div>' +
                        '   </form>' +
                        '</div>',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        var that = this;
                        that.cancel = cancel;
                        that.recipientSubmit = recipientSubmit;
                        that.recipientAddress = "";

                        function recipientSubmit(){
                            sscEmailService.runEmailConfig(that.recipientAddress).then(function(data){
                                if("200" === data.code){
                                    messageService.toast('success', $translate.instant('adm.prompt.sent_success'));
                                    cancel();
                                }else{
                                    messageService.toast('error', data.msg);
                                }
                            }).catch(function(err){
                                throw err;
                            })
                        }

                        function cancel() {
                            $uibModalInstance.close({action: "cancel"});
                        }
                    }],
                    controllerAs: '$ctrl',
                    size: 'sm',
                    backdrop: true
                });
            }else{
                messageService.alertWarning($translate.instant('adm.prompt.save_change'), $translate.instant('adm.prompt.techcpstecf'));
            }
        }

    }
})();
