(function () {
    'use strict';

    angular
        .module('oplus.cac')
        .controller('EmailTemplateListController', EmailTemplateListController);

    EmailTemplateListController.$inject = ['$scope', '$http', '$state', '$translate', 'toastr'];

    function EmailTemplateListController($scope, $http, $state, $translate, toastr) {
        var vm = this;

        // 初始化
        vm.templates = [];
        vm.loading = false;
        vm.searchText = '';

        // 方法
        vm.loadTemplates = loadTemplates;
        vm.goToRecipientManage = goToRecipientManage;
        vm.goToCustomContent = goToCustomContent;
        vm.formatDate = formatDate;
        vm.refresh = refresh;

        // 初始化加载
        activate();

        function activate() {
            loadTemplates();
        }

        function loadTemplates() {
            vm.loading = true;
            
            var apiUrl = '/oplus-portal/dts/api/dts/q/data/CAC_QUERY_TEMPLATE/';
            var params = {
                cacheBuster: new Date().getTime(),
                tenantId: window.tenantId || 'ff808081727a047f017292d0d72e0004'
            };

            $http.get(apiUrl, { params: params })
                .then(function(response) {
                    if (response.data && response.data.records) {
                        vm.templates = response.data.records;
                    } else {
                        vm.templates = [];
                    }
                })
                .catch(function(error) {
                    console.error('加载模版列表失败:', error);
                    toastr.error($translate.instant('common.message.load_failed'));
                    vm.templates = [];
                })
                .finally(function() {
                    vm.loading = false;
                });
        }

        function goToRecipientManage(templateId) {
            $state.go('app.cac.emailv2.recipient-manage', { 
                templateId: templateId 
            });
        }

        function goToCustomContent(templateId) {
            // 这里可以跳转到自定义内容页面
            console.log('跳转到自定义内容页面, templateId:', templateId);
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

        // 监听搜索
        $scope.$watch('vm.searchText', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                // 这里可以添加搜索逻辑
            }
        });
    }
})();