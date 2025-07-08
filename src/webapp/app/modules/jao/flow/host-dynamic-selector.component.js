/**
 * @author chenrongji, created on 2021-04-02
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoHostSelector
     * @description
     * ```html
     * <jao-host-selector the-model="array">
     * ```
     * @param {[{key:string, hostname:string, ip:string}]} theModel Two-way binding of selected hosts
     */
    angular.module('oplus.jao').component('jaoDynamicHostSelector', {
        bindings: {
            theHosts: '=theModel',
            onSelect: '<',
            theData: '=theData'
        },
        templateUrl: 'app/modules/jao/flow/host-selector.html',
        controller: ['$scope', 'cmActions', 'messageService', '$uibModal', '$translate', HostSelector]
    });

    /**
     * @param $scope
     * @param {cmActions} cmActions
     * @param {messageService} messageService
     * @param $uibModal
     */
    function HostSelector($scope, cmActions, messageService, $uibModal, $translate) {
        var that = this;
        that.removeItem = removeItem;
        that.openSelectorDialog = openDynamicHosts;
        that.clearAll = clearAll;


        function clearAll() {
            messageService.confirm($translate.instant('common.messages.operation.title'), $translate.instant('jao.messages.remove_all_hosts'), function () {
                that.theHosts = [];
            });
        }

        function openDynamicHosts() {
            var modal = $uibModal.open({
                templateUrl: 'app/modules/jao/flow/host-dynamic-selector.html',
                controller: ['$scope', 'theData', 'theHosts', '$uibModalInstance', '$compile', '$timeout', DynamicHostSelectorCtrl],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    theData: function () {
                        return that.theData;
                    },
                    theHosts: function () {
                        return that.theHosts;
                    }
                }
            });
            modal.result.then(function close(result) {
                that.theHosts = result;
            }, function dismiss() {
            });
        }

        function DynamicHostSelectorCtrl($scope, theData, theHosts, $uibModalInstance, $compile, $timeout) {
            var _ctrl = this;
            _ctrl.theData = theData;
            console.log("theData", theData);
            _ctrl.statusList = {
                all: {
                    title: $translate.instant('jao.status.flow.all')
                },
                failed: {
                    title: $translate.instant('jao.status.flow.failed'),
                    color: 'danger',
                    icon: 'fa-times'
                },
                finished: {
                    title: $translate.instant('jao.status.flow.finished'),
                    color: 'success',
                    icon: 'fa-check'
                },
                skip: {
                    title: $translate.instant('jao.status.flow.skip'),
                    color: 'secondary',
                    icon: 'fa-equals'
                },
                unexecuted: {
                    title: $translate.instant('jao.status.flow.unexecuted'),
                    color: 'primary',
                    icon: 'fa-cog fa-spin'
                }
            };
            _ctrl.$onInit = init;

            function init() {
                initTable();
            }

            function initTable() {
                var columnDefs = [
                    {
                        mData: 'hosts', title: $translate.instant('jao.common.host'),
                        render: function (data, type, row, meta) {
                            return row.host;
                        }
                    },
                    {
                        mData: 'status', title: $translate.instant('common.entity.detail.status'),
                        _extra: {autoFilter: true},
                        render: function (data, type, row, meta) {
                            var statusObj = _ctrl.statusList[row.status];
                            if (statusObj) {
                                return '<span class="badge bg-' + statusObj.color + '">' + statusObj.title + '</span>';
                            }
                            return row.status;
                        }
                    }
                ];
                _ctrl.selectHost= []
                _ctrl.tableConfig = {
                    data: [function () {
                        return _ctrl.theData;
                    }],
                    columns: columnDefs,
                    preselected: _ctrl.selected,
                    selection: {
                        valueData: function (row) {
                            return row;
                        },
                        labelData: function (row) {
                            return row.host;
                        }
                    }
                };
                _ctrl.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                _ctrl.confirm = function () {
                    $uibModalInstance.close(_ctrl.tableConfig.selectedItems);
                };
            }
        }

        function removeItem(index) {
            that.theHosts.splice(index, 1);
        }
    }
})();
