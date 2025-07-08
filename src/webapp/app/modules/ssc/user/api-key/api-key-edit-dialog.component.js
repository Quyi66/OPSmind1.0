/**
 * @ Author: chy
 * @ Create Time: 2023-03-27 17:45:45
 * @ Description:  
 */
(function () {
  'use strict';

  angular
    .module('oplus.ssc')
    .controller('apiKeyEditDialogCtrl', apiKeyEditDialogCtrl);
  
  apiKeyEditDialogCtrl.$inject = ['$translate', '$uibModalInstance', 'apiKey'];
  function apiKeyEditDialogCtrl($translate, $uibModalInstance, apiKey) {
    var that = this;
  
    that.apiKey = apiKey;
    that.isEdit = !!apiKey;

    if (that.apiKey && !that.apiKey.isEternal)
    {
      that.apiKey.expireCount = Number(that.apiKey.expireCount) >= 0 ? Number(that.apiKey.expireCount) : 0;
      that.apiKey.expireTime = new Date(that.apiKey.expireTime);
    }

    that.cancel = function () {
      $uibModalInstance.dismiss();
    };

    that.confirm = function () {
      $uibModalInstance.close(that.apiKey);
    }
  }
})();