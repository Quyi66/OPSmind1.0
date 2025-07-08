// Packaged by app/mudules/jao/job-list.component.js
// chy -- 2021-10-25 16:02:07

// /**
//  *
//  * @author chenrongji, created on 2020-2-20
//  * @author leoliaolei, 2021/05/06, extracted from job.controller.js
//  */
// (function () {
//     'use strict';

//     angular.module('oplus.jao').controller('jaoJobListCtrl', JaoJobListCtrl);

//     JaoJobListCtrl.$inject = ['$scope', '$state', '$timeout', 'jaoJobService', 'messageService', 'opDatatable', 'jaoUtil', 'currentUser', 'jaoDemo'];

//     /**
//      *
//      * @param $scope
//      * @param $state
//      * @param $timeout
//      * @param {jaoJobService} jaoJobService
//      * @param {messageService} messageService
//      * @param {opDatatable} opDatatable
//      * @param {jaoUtil} jaoUtil
//      * @param {currentUser} currentUser
//      * @param {jaoDemo} jaoDemo
//      * @constructor
//      */
//     function JaoJobListCtrl($scope, $state, $timeout, jaoJobService, messageService, opDatatable, jaoUtil, currentUser, jaoDemo) {
//         var that = this;
//         this.appletCode = '';
//         this.jobsData = [];
//         this.jobTypeList = jaoUtil.jobTypeList;
//         this.listJobs = listJobs;
//         this.quickRunJob = quickRunJob;
//         this.deleteJob = deleteJob;
//         this.onAppletSelectorChange = onAppletSelectorChange;
//         var columnDefs = [
//             {
//                 data: 'title',
//                 title: '作业',
//                 render: function (data, type, row, meta) {
//                     var html = data;
//                     html += '<div><span class="badge bg-secondary text-muted">' + row.id + '</span>';
//                     if (row.description) {
//                         html += '<span class="help-block ms-1">' + row.description + '</span>';
//                     }
//                     html += '</div>';
//                     return '<a class="d-block text-wrap" ui-sref="app.jao.job_view({id:\'' + row.id + '\'})">' + html + '</a>';
//                 }
//             },
//             {
//                 data: 'type',
//                 title: '类型',
//                 render: function (data) {
//                     var def = jaoUtil.jobTypeList[data];
//                     return '<div __style="width:1.5rem;height:1.5rem;" __class="text-center rounded-circle bg-secondary text-white"><i class="far fa-fw ' + def.icon + '"></i> ' + def.title + '</div>';
//                 },
//                 _extra: {autoFilter: true}
//             },
//             {
//                 data: 'updatedBy',
//                 title: '修改人'
//             },
//             {
//                 data: 'updatedAt',
//                 title: '更新时间',
//                 render: function (data, type, row, meta) {
//                     return $$.formatDate(data, 'YYYY-MM-DD hh:mm:ss');
//                 }
//             },
//             {
//                 title: '操作',
//                 class: 'text-left',
//                 searchable: false,
//                 orderable: false,
//                 render: function (data, type, row, meta) {
//                     var html = '<div>';
//                     if (currentUser.hasPermission('jao:run:*')) {
//                         html += '<button type="button" ng-click="$ctrl.quickRunJob(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="运行"><i class="fa fa-play-circle"></i></button>\n';
//                     }
//                     html += '</div>';
//                     return html;
//                 }
//             }
//         ];
//         // this.selectedJobs = [];
//         this.tableConfig = {
//             columns: columnDefs,
//             data: listJobs,
//             selection: {valueData: 'id', labelData: 'title', selectedDatatype: 'Array'},
//             order: [[4, 'desc']],
//             buttons: ['excel', 'reload']
//         }

//         // console.log('this.tableConfig',JSON.stringify(this.tableConfig),$scope);
//         function listJobs() {
//             return jaoJobService.findAllJobs(that.jobTypeFilter, that.appletCode);
//         }

//         function quickRunJob(jobId) {
//             jaoJobService.quickRunJob(jobId);
//         }

//         //批量删除作业
//         function deleteJob() {
//             var ids = angular.toJson(that.tableConfig.selectedItems);
//             messageService.confirm('删除作业', '点击确定将删除选中的' + that.tableConfig.selectedItems.length + '个作业', function () {
//                 jaoJobService.batchDeleteJob(ids).then(function () {
//                     messageService.toast("success", "删除成功");
//                     $timeout(function () {
//                         that.tableConfig.markItemsSelected([]);
//                         that.tableConfig.selectedItems.length = 0;
//                         that.tableConfig.reloadData();
//                     });
//                 }).catch(function (err) {
//                     messageService.toast("warning", "操作失败");
//                     throw err;
//                 });
//             });
//         }

//         function onAppletSelectorChange(applet) {
//             that.appletCode = applet.name;
//             that.tableConfig.reloadData();
//         }
//     }
// })();
