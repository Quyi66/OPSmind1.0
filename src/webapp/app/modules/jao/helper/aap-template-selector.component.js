/**
 * @ Author: chy
 * @ Create Time: 2024-04-17 13:15:42
 * @ Description:  
 */

(function () {
    'use strict';
    
    angular.module('oplus.jao').component('aapTemplateSelector', {
        bindings: {
            theData: '=theModel',
            readonly: '=',
            _options: '<options'
        },
        templateUrl: 'app/modules/jao/helper/aap-template-selector.html',
        controller: ['$scope', 'jaoJobService', '$q', '$compile', 'cmActions', 'messageService', 'acmUtil', '$translate', 'acmService', '$uibModal', 'dcDataService', AapTemplateSelectorCtrl
        ]
    });

    function AapTemplateSelectorCtrl($scope, jaoJobService, $q, $compile, cmActions, messageService, acmUtil, $translate, acmService, $uibModal, dcDataService) {
        
        var that = this;
        var defaultOptions = {
            selector: 'multiple',
            thisLabel: $translate.instant('acm.common.selector.choose'),
            useString: false
        };

        this.theOptions = _.merge({}, defaultOptions, this._options);

        this.openSelectorDialog = openSelectorDialog;
        this.removeItem = removeItem;
        this.emptyItems = emptyItems;
        this.$onInit = onInit;

        that.getData = function () {
            return that.theData;
        }

        that.doEmpty = function () {
            that.theData = {};
        }

        that.setData = function (obj) {
            that.theData = obj;
        }

        function onInit() {
        }

        function emptyItems() {
            messageService.confirm($translate.instant('acm.common.selector.confirm'), $translate.instant('acm.common.selector.delete_confirm'), function () {
                that.doEmpty();
            });
        }

        function openSelectorDialog() {
            if (that.readonly) return;

            var preSelected = [];

            if (that.getData()) {
                preSelected.push(that.getData());
            }

            var modal = $uibModal.open({
                template: '' +
                    '<div class="modal-header">' +
                    '<h4 class="modal-title">{{\'jao.job.script.aap_template.select\' | translate}}</h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal"  ng-click="$ctrl.cancel()"><span aria-hidden="true"></span></button>' +
                    '</div>' +

                    '<div class="modal-body">' +
                    '   <opx-datatable class="d-block h-100" table-config="$ctrl.tableConfig"></opx-datatable>' +
                    '</div>' +

                    '<div class="modal-footer text-right">' +
                    // '<button type="submit" class="btn btn-primary opx-btn-ok" ng-click="$ctrl.confirm()">{{\'common.action.confirm\' | translate}}</button>' +
                    '<button type="reset" class="btn btn-default opx-btn-cancel" ng-click="$ctrl.cancel()">{{\'common.action.cancel\' | translate}}</button>' +
                    '</div>',
                controller: ['$scope', function ($scope) {
                    this.tableConfig = that.tableConfig;

                    this.cancel = function () {
                        modal.dismiss();
                    };

                    this.select = function (id) {
                        var item = _.find(this.tableConfig.getTableData(), function(f) { return f.id === id})
                        modal.close(item);
                    }

                    
                }],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg'
            });

            modal.result.then(function close(result) {
                that.setData(result);

            }, function dismiss() {});

        }

        function removeItem(index) {
            var arrTmp = that.getData();
            arrTmp.splice(index, 1);
            that.setData(arrTmp);
        }

        that.tableColumnConfig = [
            // {mData: 'id', title: 'ID'},
            {mData: 'name', title: $translate.instant('common.entity.detail.name')},
            {
                title: $translate.instant('common.entity.detail.type'),
                render: function (data, type, row, meta) {
                    if (row.type === 'job_template') return 'Job Template';
                    else if (row.type === 'workflow_job_template') return 'Workflow Job Template';
                    else return row.type;
                }
            },
            {
                title: $translate.instant('jao.job.script.aap_template.organization'),
                render: function (data, type, row, meta) {
                    return row.summary_fields.organization && row.summary_fields.organization.name || ''
                }
            },
            {
                title: $translate.instant('jao.log.jao_last_run_time'),
                render: function (data, type, row, meta) {
                    if (row.summary_fields.last_job)
                        return $$.formatDate(row.summary_fields.last_job.finished, "YYYY-MM-DD HH:mm:ss");
                }
            },
            {
                mData: 'id', title: $translate.instant('common.action.action'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var param = angular.toJson({id: row.id});
                    return '<div class="btn-group">' +
                        ' <button type="submit" class="btn btn-primary btn-sm" ng-click="$ctrl.select(' + row.id + ')">' +
                        '     <span class="hidden-sm-down" data-translate="common.entity.detail.select"></span>' +
                        ' </button>' +
                        '</div>';
                },
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
                }
            }
        ]

        that.getDataPromise = function (params) {
            var deferred = $q.defer();

            jaoJobService.finAllAapTemplate((params.start / params.length) + 1, params.length).then(function (res) {
                that.templates = res.results;
                that.selectedJob = that.theModel ? _.find(that.jobs, { id: that.theModel }) : undefined;

                var result = {
                    draw: params.draw,
                    recordsTotal: res.count,
                    recordsFiltered: res.count,
                    data: res.results
                }

                deferred.resolve(result);
            }).catch(function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        }

        that.tableConfig = {
            data: [that.getDataPromise, '', true],
            columns: that.tableColumnConfig,
            order: [],
            buttons: ['reload'],
            tableId: 'templates'
        };
    }
})();
