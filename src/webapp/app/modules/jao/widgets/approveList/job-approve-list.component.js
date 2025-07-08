/**
 *
 * @author chy, 2021/10/25
 */
(function () {
  'use strict';

  angular.module('oplus.jao')
    .component('jobApproveList', {
      templateUrl: 'app/modules/jao/widgets/approveList/job-approve-list.html',
      controller: JobApproveListCtrl,
      bindings: {
        // 'my' -- 我的申请
        // 'approve' -- 审批列表
        approveType: '<',
      }
    });

  JobApproveListCtrl.$inject = ['$timeout', '$uibModal', 'jaoJobService', 'messageService', 'jaoUtil', 'currentUser', '$translate'];

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
  function JobApproveListCtrl($timeout, $uibModal, jaoJobService, messageService, jaoUtil, currentUser, $translate) {
    var that = this;

    that.typeArr = {
      'my': { name: 'my', title: $translate.instant('jao.approve.type.my') },
      'approve': { name: 'approve', title: $translate.instant('jao.approve.type.approve') },
    }

    that.statusArr = [
      { code: 0, title: $translate.instant('jao.approve.status.0'), theme: 'primary' },
      { code: 1, title: $translate.instant('jao.approve.status.1'), theme: 'success' },
      { code: 2, title: $translate.instant('jao.approve.status.2'), theme: 'danger' },
      { code: 3, title: $translate.instant('jao.approve.status.3'), theme: 'secondary' },
    ]

    that.approveMode = {
      limitParams: { name: "limitParams", text: $translate.instant('jao.approve.detail.limit_params') },
      noLimitParams: { name: "noLimitParams", text: $translate.instant('jao.approve.detail.no_limit_params') }
    }

    that.approveType = that.approveType || '';
    that.title = (that.typeArr[that.approveType] || { title: '' }).title;

    that.approveType = that.approveType || '';

    var columnDefs = [
      // {
      //   title: $translate.instant('common.entity.detail.operation'),
      //   class: 'text-left',
      //   searchable: false,
      //   orderable: false,
      //   render: function (data, type, row, meta) {
      //     var html = '<div>';
      //     if (row.status === 0) {
      //       if (that.approveType === that.typeArr.my.name)
      //         html += '<button type="button" ng-click="$ctrl.cancelApprove(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'jao.approve.cancel\' | translate}}"><i class="fa fa-times-circle"></i></button>\n';
      //       if (that.approveType === that.typeArr.approve.name) {
      //         html += '<button type="button" ng-click="$ctrl.approve(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'jao.approve.pass_approve\' | translate}}"><i class="fa fa-check-circle"></i></button>\n';
      //         html += '<button type="button" ng-click="$ctrl.refuseApprove(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'jao.approve.refuse\' | translate}}"><i class="fa fa-minus-octagon"></i></button>\n';
      //       }
      //     }
      //     if (row.status === 1) {
      //       if (that.approveType === that.typeArr.my.name && !row.needReApprove && currentUser.hasPermission('jao:run:*'))
      //         html += '<button type="button" ng-click="$ctrl.quickRunJob(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'jao.common.run\' | translate}}"><i class="fa fa-play-circle"></i></button>\n';
      //       if (that.approveType === that.typeArr.approve.name && row.canCanceled)
      //         html += '<button type="button" ng-click="$ctrl.discardApprove(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'jao.approve.discard\' | translate}}"><i class="fa fa-times-circle"></i></button>\n';
      //     }
      //     if (row.needReApprove) {
      //       html += '<button type="button" ng-click="$ctrl.reApprove(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'jao.approve.re_approve\' | translate}}"><i class="fa fa-redo-alt"></i></button>\n';
      //     }
      //     html += '</div>';
      //     return html;
      //   }
      // },
      {
        data: 'jobName',
        title: $translate.instant('jao.common.job'),
        render: function (data, type, row, meta) {
          var html = data;

          var def = jaoUtil.jobTypeList[row.jobType];
          html += '<div __style="width:1.5rem;height:1.5rem;" __class="text-center rounded-circle bg-secondary text-muted"><i class="far fa-fw ' + def.icon + '"></i> ' + def.title + '</div>';

          html += '<div><span class="badge bg-light text-muted">' + row.jobId + '</span>';
          if (that.approveType === that.typeArr.approve.name && row.description) {
            html += '<span class="help-block ms-1">' + row.description + '</span>';
          }

          html += '</div>';
          return '<a class="d-block text-wrap" ng-click="$ctrl.approveModal(\'' + row.id + '\')">' + html + '</a>';
        }
      },
      {
        data: 'approveMode',
        title: $translate.instant('jao.approve.detail.approve_mode'),
        render: function (data) {
          return that.approveMode[data] ? that.approveMode[data].text : '-----';
        }
      },
      // {
      //   data: 'params',
      //   title: $translate.instant('jao.approve.detail.params'),
      //   render: function (data) {
      //     if (data && data instanceof Array && data.length > 0) {
      //       var html = "";
      //       data.forEach(function (item) {
      //         html += '<div style="max-width:20em;"><span class="badge bg-secondary text-light align-left" style="white-space:break-spaces;">' + item.name + ':' + JSON.stringify(item.value) + '</span></div>';
      //       });
      //       return html;
      //     }
      //     else return '-----'
      //   }
      // },
      {
        data: 'validHour',
        title: $translate.instant('jao.approve.detail.valid_hour'),
        render: function (data, type, row, meta) {
          return data && row.approveMode !== 'limitParams' ? data + ' ' + $translate.instant('common.term.hour') : '-----';
        }
      },
      {
        data: that.approveType === that.typeArr.my.name ? 'approver' : 'applicant',
        title: that.approveType === that.typeArr.my.name ? $translate.instant('jao.approve.detail.approver') : $translate.instant('jao.approve.detail.applicant'),
        render: function (data) {
          return data || '-----';
        }
      },
      {
        data: that.approveType === that.typeArr.my.name ? 'approveTime' : 'applyTime',
        title: that.approveType === that.typeArr.my.name ? $translate.instant('jao.approve.detail.approve_time') : $translate.instant('jao.approve.detail.apply_time'),
        render: function (data) {
          return data ? $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss') : '-----';
        }
      },
      {
        data: 'status',
        title: $translate.instant('common.entity.detail.status'),
        render: function (data) {
          var status = that.statusArr.find(function (f) { return f.code === data });
          if (!status) return '-----'
          
          return '<span class="badge bg-' + status.theme + '">' + status.title + '</span>'
        },
        _extra: {
          autoFilter: true
        }
      },
      {
        data: 'expirationTime',
        title: $translate.instant('jao.approve.detail.expiration_time'),
        render: function (data) {
          return !isNaN(Date.parse(data)) ? $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss') : (data === 'expired') ? $translate.instant('jao.approve.detail.expired') : '-----';
        }
      },
    ];

    this.tableConfig = {
      columns: columnDefs,
      data: listJobs,
      buttons: ['reload']
    }

    that.approveModal = function (id) {
      var data = that.tableConfig.getTableData().find(function(f) { return f.id === id });
      if (data) {
        var params = {};
        if (data.params) data.params.forEach(function (item) { params[item.name] = item.value })
        jaoJobService.checkNeedApproveHandler({ id: data.jobId, title: data.jobName }, params, data, that.approveType).then(function (res) {
          if (res === 'closeModal') that.reloadData();
          if (res === 'run') messageService.toast("warning", $translate.instant('jao.messages.approve_can_run'));
        });
      }
    }

    // console.log('this.tableConfig',JSON.stringify(this.tableConfig),$scope);
    function listJobs() {
      if (that.approveType === that.typeArr.my.name)
        return jaoJobService.findMyApproveJobs();
      else if (that.approveType === that.typeArr.approve.name)
        return jaoJobService.findApproveJobsByStatus();
      else
        return []
    }

    that.quickRunJob = function (id) {
      var data = that.tableConfig.getTableData().find(function(f) { return f.id === id });
      if (data) {
        if (Date.parse(data.expirationTime) > Date.now())
          jaoJobService.quickRunJob(data.jobId, 'approveLimitParams', { approveParams: data.params });
        else {
          messageService.toast("danger", $translate.instant('jao.messages.approve_expired'));
          that.reloadData();
        }
      } 
    }

    that.turningApprove = function(type, id, remark, title, message) {
      messageService.confirm(title, message, function () {
        var data = {
          approveId: id,
          remark: remark
        }
        jaoJobService.turningApprove(type, data).then(function () {
          messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.detail.operation') }));
          that.reloadData();
        }).catch(function (err) {
          messageService.toast("warning", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('common.entity.detail.operation') }));
          throw err;
        });
      });
    }

    that.approve = function (id) {
      var job = that.tableConfig.getTableData().find(function (f) { return f.id === id });
      try {
        that.turningApprove('approve', id, null, $translate.instant('jao.approve.pass'), $translate.instant('common.messages.operation.body', { operation: $translate.instant('jao.approve.pass'), obj: $translate.instant('jao.common.approve') }))
        if (job.approveMode === that.approveMode.limitParams.name)
          jaoJobService.runJob(id, job.params, null, null, true);
      }
      catch (e) {

      }
    }

    that.refuseApprove = function (id) {
      messageService.prompt(
        $translate.instant('jao.approve.refuse'),
        $translate.instant('jao.approve.detail.refuse_reason'),
        null,
        function (res) {
          that.turningApprove('refuse', id, res, $translate.instant('jao.approve.refuse'), $translate.instant('jao.messages.refuse_approve', {
            reason: res
          }))
        },
        null);
    }

    that.cancelApprove = function (id) {
      that.turningApprove('cancel', id, null, $translate.instant('jao.approve.cancel'), $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.cancel'), obj: $translate.instant('jao.common.approve') }))
    }

    that.discardApprove = function (id) {
      that.turningApprove('discard', id, null, $translate.instant('jao.approve.discard'), $translate.instant('common.messages.operation.body', { operation: $translate.instant('jao.approve.discard'), obj: $translate.instant('jao.common.approve') }))
    }

    that.reApprove = function (id) {
      var data = that.tableConfig.getTableData().find(function (f) { return f.id === id });
      if (data) {
        var params = {};
        if (data.params) data.params.forEach(function (item) { params[item.name] = item.value })
        jaoJobService.checkNeedApproveHandler({ id: data.jobId, title: data.jobName }, params).then(function (res) {
          if (res === 'closeModal') that.reloadData();
          if (res === 'run') messageService.toast("warning", $translate.instant('jao.messages.approve_can_run'));
        });
      }
    }

    that.reloadData = function () {
      $timeout(function () {
        that.tableConfig.reloadData()
      });
    }
  }
})();
