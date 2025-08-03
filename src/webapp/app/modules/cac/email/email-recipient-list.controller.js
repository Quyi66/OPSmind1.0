(function () {
    angular.module('oplus.cac').controller('CacEmailRecipientController', CacEmailRecipientController);

    CacEmailRecipientController.$inject = ['$scope', '$state', '$http', 'messageService', 'currentUser', '$translate', 'sscEmailService', '$uibModal'];

    function CacEmailRecipientController($scope, $state, $http, messageService, currentUser, $translate, sscEmailService, $uibModal) {
        var vm = this;

        // 初始化数据
        vm.templates = [];
        vm.loading = false;
        vm.searchText = '';
        vm.error = null;
        vm.lastUpdateTime = new Date();

        // 方法定义
        vm.loadTemplates = loadTemplates;
        vm.openRecipientListDialog = openRecipientListDialog;
        vm.goToCustomContent = goToCustomContent;
        vm.formatDate = formatDate;
        vm.refresh = refresh;

        sscEmailService.getCacEmailSwitch().then(function (data) {
            vm.s = data;
            vm.isTheEmailEnabled = data.isTheEmailEnabled === "yes";
        });

        $scope.on_off = function () {
            vm.s.isTheEmailEnabled = vm.isTheEmailEnabled ? "yes" : "no";
            sscEmailService.saveCacEmailSwitch(vm.s);
        }

        // 初始化加载模版列表
        activate();

        function activate() {
            loadTemplates();
        }

        function loadTemplates() {
            vm.loading = true;
            vm.error = null;
            
            var apiUrl = '/oplus-portal/dts/api/dts/q/data/CAC_QUERY_TEMPLATE/';
            var params = {
                cacheBuster: new Date().getTime(),
                tenantId: window.tenantId || 'ff808081727a047f017292d0d72e0004'
            };

            $http.get(apiUrl, { params: params })
                .then(function(response) {
                    if (response.data && response.data.records) {
                        vm.templates = response.data.records;
                        vm.lastUpdateTime = new Date();
                        vm.error = null;
                    } else {
                        vm.templates = [];
                        vm.error = '返回数据格式异常';
                    }
                })
                .catch(function(error) {
                    console.error('加载模版列表失败:', error);
                    vm.error = error.data && error.data.message ? error.data.message : '网络请求失败，请检查网络连接';
                    vm.templates = [];
                    messageService.alertError("danger", '加载模版列表失败: ' + vm.error);
                })
                .finally(function() {
                    vm.loading = false;
                });
        }

        function openRecipientListDialog(templateId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/modules/cac/emailv2/email-recipient-list-dialog.html',
                controller: 'CacEmailV2RecipientListDialogController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    templateId: function() {
                        return templateId;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                if (result && result.action === 'refresh') {
                    refresh();
                }
            }).catch(function() {
                // 用户取消对话框
            });
        }

        function goToCustomContent(templateId) {
            vm.customContent();
        }

        function formatDate(dateStr) {
            if (!dateStr) return '-----';
            try {
                return $$.formatDate(dateStr, 'YYYY-MM-DD HH:mm:ss');
            } catch (e) {
                return dateStr;
            }
        }

        function refresh() {
            loadTemplates();
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