/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-01-10
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name gfsGfileRev
     * @description Show revisions of a file
     * <gfs-gfile-rev params="object" options="">
     * @param {{repo:string,path:string}} params Necessary parameters
     * @param {string} params.repo
     * @param {string} params.path
     * @param {string=} params.commit Current commit name
     * @param {object} options
     * @param {string} options.mode 'list-only' for simple revision list
     * @param {number} options.limit Number of revisions to display
     * @param {string} options.detailTarget Where to show revision detail.
     * 'url' - open revision as new URL. i.e. refresh current page
     * 'dialog' - open revision in a modal dialog box
     * @param {function(*)} options.onClickFn Callback function on click a revision
     * @param {*} options.onClickArg Parameter for callback function
     *
     */
    angular.module('oplus.gfs').component('gfsGfileRev', {
        bindings: {
            params: '<',
            options: '<'
        },
        templateUrl: 'app/modules/gfs/gfile-rev.html',
        controller: ['$scope', '$state', 'gfileService', '$uibModal', '$translate', 'messageService', GfileRevCtrl]
    });

    function GfileRevCtrl($scope, $state, gfileService, $uibModal, $translate, messageService) {
        var that = this;
        var params = that.params, commit = params.commit;
        this.changeUrl = false;
        this.options = this.options || {};
        this.clickRev = clickRev;
        this.rollback = rollback;
        getFileRevs(params.id, params.repo, params.path);
        $scope.$watch('$ctrl.currentRev.change', function (newVal, oldVal) {
            if (newVal)
                showDiff(newVal);
        });

        function clickRev(rev) {
            // Bug fix：ng-show load delay https://www.imooc.com/qadetail/104318
            that.currentRev = rev
            that.fileRevs.forEach(function (rev_new) {
                rev_new.rollback = rev_new.name === rev.name;
            });
            // console.log(that.options.onClickFn,that.options.onClickArg);
            if (that.options.onClickFn) {
                that.options.onClickFn(that.options.onClickArg);
            }
            if (that.options.detailTarget === 'url') {
                $state.transitionTo('app.gfs.file_rev', {
                    id: params.id,
                    repo: params.repo,
                    path: params.path,
                    commit: rev.name
                });
            } else if (that.options.detailTarget === 'dialog') {
                openRevsModal(params.repo, params.path, rev ? rev.name : '');
            } else if (that.options.detailTarget === 'self') {
            }
        }

        function showDiff(changes) {
            var diffHtml = Diff2Html.getPrettyHtml(changes, {
                inputFormat: 'diff',
                // showFiles:true,
                // drawFileList: true,
                matching: 'lines'
                // outputFormat: 'side-by-side'
            });
            angular.element('#diff').html(diffHtml);
        }

        function openRevsModal(repo, path, commit) {
            var modal = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<h4 class="modal-title">' + $translate.instant("gfs.rev.modify_record") + '</h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal" ng-click="$ctrl.close()"></button>' +
                    '</div>' +
                    '<div class="modal-body p-0">' +
                    '<gfs-gfile-rev params="$ctrl.params" options="$ctrl.options" class="h-100"></gfs-gfile-rev>' +
                    '</div>',
                size: 'lg',
                controller: ['params', function (params) {
                    this.params = params;
                    this.options = {detailTarget: 'self'};
                    this.close = function () {
                        modal.dismiss();
                    }
                }],
                controllerAs: '$ctrl',
                resolve: {
                    params: function () {
                        return {
                            repo: repo,
                            path: path,
                            commit: commit
                        }
                    }
                }
            });
        }

        function rollback(rev) {
            messageService.confirm($translate.instant("gfs.rev.back_confirm"), $translate.instant("gfs.rev.back_confirm_desc"), function () {
                gfileService.fileRevusions(rev.repo, rev.name, params.path).then(function (data) {
                    messageService.toast('success', $translate.instant("gfs.rev.back_success"));
                    getFileRevs(params.id, params.repo, params.path);
                    // $state.go("app.gfs.git_repo_dir")
                }).catch(function (err) {
                    messageService.confirmDanger($translate.instant("gfs.rev.back_fail"), err.toString());
                });
            });
        }


        function getFileRevs(id, repo, path) {
            var map = {
                'ADD': {name: $translate.instant("gfs.common.add"), icon: 'text-success fa-plus-square'},
                'DELETE': {name: $translate.instant("gfs.common.delete"), icon: 'text-danger fa-minus-square'},
                'MODIFY': {name: $translate.instant("gfs.common.edit"), icon: 'text-primary fa-pen-square'}
            };
            gfileService.getFileRevisions(id, repo, path)
                .then(function (data) {
                    that.fileRevs = data;
                    that.fileRevs.forEach(function (rev) {
                        rev._change = map[rev.changeType];
                        if (commit && commit === rev.name) {
                            that.currentRev = rev;
                            rev.rollback = true;
                        } else {
                            rev.rollback = false;
                        }
                    });
                    if (!that.currentRev && that.fileRevs.length > 0) {
                        that.currentRev = that.fileRevs[0];
                    }
                }).catch(function (err) {
                throw err;
            });
        }
    }
})();
