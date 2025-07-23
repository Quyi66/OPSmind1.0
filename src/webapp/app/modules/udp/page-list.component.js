/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 * @author wuqiang , created on 2020/07/28.
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name pageList
     * @description
     * ```
     * <page-list show-applet="boolean" applet-code="string" options="{enableEdit:boolean}">
     * ```
     */
    angular.module('oplus.udp').component('pageList', {
        templateUrl: 'app/modules/udp/page-list.component.html',
        controller: PageListCtrl,
        bindings: {
            showApplet: '<',
            appletCode: '<',
            options: '<'
        }
    });

    PageListCtrl.$inject = ['$scope', '$q', '$translate', '$uibModal', 'messageService', 'pageService', 'currentUser', 'appletService', 'modalHelper','appletSecurity'];

    /**
     *
     * @param $scope
     * @param $q
     * @param $translate
     * @param $uibModal
     * @param  {messageService} messageService
     * @param {pageService} pageService
     * @param {currentUser} currentUser
     * @param {appletService} appletService
     * @param {modalHelper} modalHelper
     * @param {appletSecurity} appletSecurity
     * @constructor
     */
    function PageListCtrl($scope, $q, $translate, $uibModal, messageService, pageService, currentUser, appletService, modalHelper,appletSecurity) {
        var that = this;
        var options = this.options || {enableEdit: false};
        this.clonePage = clonePage;
        this.deletePage = deletePage;
        this.sharePage = sharePage;
        this.exportPages = exportPages;
        this.importPages = importPages;
        this.previewPage = previewPage;
        this.movePages = movePages;
        this.onAppletSelectorChange = onAppletSelectorChange;
        this.showApplet = this.showApplet === undefined ? true : this.showApplet;
        this.tableConfig = {
            tableId: 'udp-pagelist',
            data: listPages,
            columns: [
                // {data: 'id', title: 'ID'},
                {
                    data: 'title', title: $translate.instant('udp.page.attrs.title'),
                    render: function (data, type, row, meta) {
                        var html = '<a ng-click="$ctrl.previewPage(\'' + row.id + '\')">' + _.escape(data) + '</a>';
                        return html;
                    }
                },
                {data: 'appletCode', title: $translate.instant('udp.page.attrs.applet'), searchable: false},
                {data: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    data: 'modifiedAt',
                    title: $translate.instant('common.attr.updated_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                }
            ],
            order: [[4, 'desc']],
            selection: {labelData: 'title', valueData: 'id'}
        };
        if (options.enableEdit) {
            this.tableConfig.columns.push({
                title: $translate.instant('common.action.action'),
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    if (!appletSecurity.canModifyAppletResource(row['appletCode'])) {
                        return '';
                    }
                    var html = '<a class="btn btn-default opx-btn-icon opx-btn-table" ui-sref="app.appman.page.edit({pageId:\'' + row.id + '\'})" title="{{\'common.action.modify\'|translate}}"><i class="fas fa-edit"></i></a>';
                    html += '<a class="btn btn-default opx-btn-icon opx-btn-table" ng-click="$ctrl.deletePage(\'' + row.id + '\',\'' + row.title + '\')" title="{{\'common.action.delete\'|translate}}"><i class="fas fa-trash"></i><i class="fas fa-times" style="display:none;"></i></a>';
                    html += '<a class="btn btn-default opx-btn-icon opx-btn-table" ng-click="$ctrl.clonePage(\'' + row.id + '\')" title="{{\'common.action.copy\'|translate}}"><i class="fas fa-copy"></i></a>';
                    return html;
                }
            })
        }

        function movePages() {
            appletService.openAppletSelectorModal(function (applet) {
                messageService.confirm($translate.instant('udp.page.actions.move_page'),
                    $translate.instant('udp.page.actions.move_page_confirm', {
                        applet: applet.title,
                        recordNum: that.tableConfig.selectedItems.length
                    }),
                    function () {
                        pageService.movePage(that.tableConfig.selectedItems, applet.code).then(function () {
                            reloadData();
                        }).catch(function (err) {
                            throw err;
                        });
                    })
            });
        }

        function reloadData() {
            that.tableConfig.reloadData();
        }

        function listPages() {
            var d = $q.defer();
            pageService.findPages({
                page: 0,
                size: 1000,
                appletCode: that.appletCode
            }).then(function (data) {
                d.resolve(data.content);
                // d.resolve(data);
            }).catch(function (e) {
                messageService.alertError($translate.instant('common.term.error'), e.message);
                d.reject(e);
            });
            return d.promise;
        }

        function exportPages() {
            pageService.exportPages();
        }

        function previewPage(pageId) {
            var modalInstance = modalHelper.openModal({
                template: '<div class="modal-header">' +
                    '<h4 class="modal-title"></h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal" ng-click="$ctrl.close()"><i class="fa fa-times"></i></button>' +
                    '</div>' +
                    '<div class="modal-body"><udp-page-view page-id="\'' + pageId + '\'"></udp-page-view></div>',
                controller: [function () {
                    this.close = function () {
                        modalInstance.dismiss();
                    }
                }],
                controllerAs: '$ctrl',
                size: 'lg'
            }, {resizable: true});
        }

        function importPages() {
            modalHelper.openModal({
                animation: false,
                templateUrl: 'app/modules/udp/page-import.html',
                controller: 'PageImportCtrl',
                controllerAs: '$pic',
                size: 'md'
            }, {
                onOk: function () {
                    reloadData();
                }
            });
        }

        function clonePage(pageId) {
            messageService.confirm(
                $translate.instant('udp.page.actions.clone'), $translate.instant('udp.page.actions.clone_confirm'), function () {
                    pageService.clonePage(pageId).then(function (pages) {
                        messageService.toast('success', $translate.instant('udp.action.clone_success'));
                        reloadData();
                    }).catch(function (e) {
                        throw e;
                    });
                });
        }

        function deletePage(pageId, title) {
            messageService.confirmDanger(
                $translate.instant('udp.page.actions.delete'), $translate.instant('udp.page.actions.delete_confirm', {title: title}),
                function () {
                    pageService.deletePage(pageId).then(function () {
                        reloadData();
                    }).catch(function (err) {
                        throw new FatalError(err);
                    });
                }, function () {
                });
        }

        function sharePage(pageId) {
            $uibModal.open({
                templateUrl: 'app/modules/udp/page-share-modal.html',
                scope: $scope,
                size: 'md'
            });
        }

        function onAppletSelectorChange(applet) {
            that.appletCode = applet.name;
            reloadData();
        }
    }
})();
