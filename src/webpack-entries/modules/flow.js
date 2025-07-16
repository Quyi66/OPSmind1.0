/**
 * Flow 模块入口文件
 * 
 * 使用简化版本，避免导入可能导致问题的文件
 */

// 首先创建一个空的 oplus.flow 模块，确保它在其他模块引用它之前就已经存在
(function () {
  'use strict';

  // 创建 flow 模块，只依赖基础模块
  angular.module('oplus.flow', [
    'oplus.commons',
    'oplus.uaa'
  ]);

  // 注册基本服务和控制器
  angular.module('oplus.flow')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('flow', {
          parent: 'app',
          url: '/flow',
          views: {
            'content@': {
              templateUrl: 'app/modules/flow/flow-index.html',
              controller: 'flowController',
              controllerAs: '$ctrl'
            }
          },
          resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
              $translatePartialLoader.addPart('flow');
              return $translate.refresh();
            }]
          }
        });
    }])
    .service('flow.Api', ['$http', '$q', function ($http, $q) {
      // 基本 API 服务
      this.getProcessList = function () {
        return $http.get('/api/flow/processes');
      };
    }])
    .service('flow.Service', ['flow.Api', '$q', function (flowApi, $q) {
      // 基本服务
      this.getProcessList = function () {
        return flowApi.getProcessList();
      };
    }])
    .controller('flowController', ['$scope', 'flow.Service', function ($scope, flowService) {
      var vm = this;
      vm.processes = [];

      vm.init = function () {
        flowService.getProcessList().then(function (response) {
          vm.processes = response.data;
        });
      };

      vm.init();
    }]);

  console.log('✅ FLOW module registered');
})();

console.log('✅ FLOW module loaded');