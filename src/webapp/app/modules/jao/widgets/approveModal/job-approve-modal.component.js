/**
 *
 * @author chy, 2021/10/27
 */

(function () {
  'use strict';

  angular.module('oplus.jao')
    .component('jobApproveModal', {
      templateUrl: 'app/modules/jao/widgets/approveModal/job-approve-modal.html',
      controller: JobApproveModalCtrl,
      bindings: {
        // resolve:
        // --- job 作业详情
        // --- checkResult checkNeedApprove 返回实体
        // --- params 作业执行参数
        resolve: '<',
        close: '&',
        dismiss: '&'
      }
    });

  JobApproveModalCtrl.$inject = ['$state', 'jaoJobService', 'messageService', 'jaoUtil', 'currentUser', '$translate','modalHelper','$q','$http'];

  /**
   *
   * @param $scope
   * @param $state
   * @param $timeout
   * @param {jaoJobService} jaoJobService
   * @param {messageService} messageService
   * @param {jaoUtil} jaoUtil
   * @param {currentUser} currentUser
   * @constructor
   */
  function JobApproveModalCtrl($state, jaoJobService, messageService, jaoUtil, currentUser, $translate,modalHelper,$q,$http) {
    var that = this;

    that.goFile = goFile;
    that.openFileContentViewer=openFileContentViewer;

    init();
    function init() {
      if(that.resolve.approve !== undefined){
        var d = $q.defer();
        var url = window.$oplus.appConfig.apiBaseUrls.portal + '/adm/api/adm/aou/get/appName/'+that.resolve.approve.appletCode;
        $http({
          method: 'GET',
          url: url,
          transformRequest: angular.identity,
          transformResponse: function (data) {  // 转换response,这样传回来的是就是：String，默认是json
            that.appName = data.replace(/#{|}/g, '');
          }
        }).then(function (resp) {
          d.resolve(resp.data);
        }).catch(function (err) {
          d.reject(err);
        });


        jaoJobService.getScriptPath(that.resolve.approve.jobId).then(function (data) {
          that.scriptPathList = data;
        }).catch(function (err) {
          messageService.toast("warning", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('common.entity.detail.operation') }));
          throw err;
        });
      }
    }

    function goFile(scriptPath) {
       openFileContentViewer("GIT","ff808081727a047f017292d0d72e0004",scriptPath,null);
    }

    function openFileContentViewer(repoType, repo, path, saveFilename) {
      var instance = modalHelper.openModal({
        templateUrl: 'app/modules/gfs/gfile-content-modal.html',
        size: 'lg',
        controllerAs: '$ctrl',
        controller: ['$scope', function ($scope) {
          this.repoType = repoType || 'git';
          this.repo = repo;
          this.path = path;
          this.saveFilename = saveFilename;
          this.cancel = function () {
            instance.dismiss();
          }
        }]
      }, {resizable: true});
    }

    // default entity template
    var approve = {
      jobId: '',
      params: '',  // ex: [{name: '', value: ''}, {...}]
      approveMode: '', // ex: noLimitParams / limitParams
      validHour: 1,
      description: ''
    }

    that.paramsArr = Object.entries(that.resolve.params)
    that.checkResult = that.resolve.checkResult || {};
    that.job = that.resolve.job || {};
    that.params = that.resolve.params || {}
    that.approve = that.resolve.approve || approve;
    that.approveType = that.resolve.approveType || ''

    that.typeArr = {
      'my': { name: 'my', title: $translate.instant('jao.approve.type.my') },
      'approve': { name: 'approve', title: $translate.instant('jao.approve.type.approve') },
    }

    that.needApprove = (that.resolve.checkResult.needApprove && !that.resolve.checkResult.isApproving) || false;


    that.ok = function () {
      that.close({ $value: 'ok' });
    };

    that.goToMyApprove = function () {
      that.close({ $value: 'closeModal' });
      $state.go('app.jao.myApprove');
    }

    that.reApprove = function () {
      that.needApprove = true;
    }

    that.submitApprove = function () {
      if (!that.approve.approveMode) {
        messageService.alertError($translate.instant('common.messages.operation.failed'), $translate.instant('jao.messages.select_approve_mode'));
        return;
      }

      that.approve.jobId = that.job.id;
      if (that.approve.approveMode === 'limitParams')
        that.approve.params = JSON.stringify(that.paramsArr.map(function (m) { return { name: m[0], value: m[1] } }))
      else
        that.approve.params = null;

      jaoJobService.submitApprove(that.approve).then(function (res) {
        messageService.toast('success', $translate.instant('common.messages.operation.success'), $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
        that.close({ $value: 'closeModal' });
      })
    }

    that.turningApprove = function(type, id, remark, title, message) {
      messageService.confirm(title, message, function () {
        var data = {
          approveId: id,
          remark: remark
        }
        jaoJobService.turningApprove(type, data).then(function () {
          if (type === 'approve' && that.approve.approveMode === 'limitParams')
            jaoJobService.runJob(that.job.id, that.params, null, null, false);
          messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.detail.operation') }));
          that.close({ $value: 'closeModal' });
        }).catch(function (err) {
          messageService.toast("warning", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('common.entity.detail.operation') }));
          throw err;
        });
      });
    }


    that.passApprove = function () {
      if (!that.approve.id) {
        messageService.toast("warning", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('common.entity.detail.operation') }));
        return;
      }

      try {
        that.turningApprove('approve', that.approve.id, null, $translate.instant('jao.approve.pass'), $translate.instant('common.messages.operation.body', { operation: $translate.instant('jao.approve.pass'), obj: $translate.instant('jao.common.approve') }))
      }
      catch (e) {

      }
    }

    that.refuseApprove = function () {
      if (!that.approve.id) {
        messageService.toast("warning", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('common.entity.detail.operation') }));
        return;
      }

      messageService.prompt(
        $translate.instant('jao.approve.refuse'),
        $translate.instant('jao.approve.detail.refuse_reason'),
        null,
        function (res) {
          that.turningApprove('refuse', that.approve.id, res, $translate.instant('jao.approve.refuse'), $translate.instant('jao.messages.refuse_approve', {
            reason: res
          }))
        },
        null);
    }

    that.cancelApprove = function () {
      if (!that.approve.id) {
        messageService.toast("warning", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('common.entity.detail.operation') }));
        return;
      }

      that.turningApprove('cancel', that.approve.id, null, $translate.instant('jao.approve.cancel'), $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.cancel'), obj: $translate.instant('jao.common.approve') }))
    }

    that.discardApprove = function (id) {
      if (!that.approve.id) {
        messageService.toast("warning", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('common.entity.detail.operation') }));
        return;
      }

      that.turningApprove('discard', that.approve.id, null, $translate.instant('jao.approve.discard'), $translate.instant('common.messages.operation.body', {
        operation: $translate.instant('jao.approve.discard'),
        obj: $translate.instant('jao.common.approve')
      }))
    }
  }
})();
