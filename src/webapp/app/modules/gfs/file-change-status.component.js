/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-07-26
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name gfsFileChangeStatus
     * @description
     * Change file status.
     * ```html
     * <gfs-file-change-status repo-type="" file="" after-change="function">
     * ```
     * @param {String} repoType .
     * @param {Object|Array} file File or files to modify status.
     * @param {function} afterChange Callback function after change submit
     */
    angular.module('oplus.gfs').component('gfsFileChangeStatus', {
        templateUrl: 'app/modules/gfs/file-change-status.html',
        controller: ['$scope', '$state', '$element', '$uibModal', '$timeout', '$translate', 'gfileService', 'gfsActionHelper', 'messageService', 'currentUser', FileChangeStatusCtrl],
        bindings: {
            repoType: '<',
            file: '<',
            afterChange: '<',
            watchRefresh: '<',
            showDiff: '<',
            options: '<'
        }
    });
    var index = 0;

    /**
     * Used with component.
     *
     * @param $scope
     * @param {$element} $element
     * @param $uibModal
     * @param {gfileService} gfileService
     * @param {gfsActionHelper} gfsActionHelper
     * @param {messageService} messageService
     */
    function FileChangeStatusCtrl($scope, $state, $element, $uibModal, $timeout, $translate, gfileService, gfsActionHelper, messageService, currentUser) {
        var that = this;
        this.isSaving = false;
        this.compareFile = compareFile;
        this.shellCheck = shellCheck;
        this.submit = submit;
        this.cancel = cancel;
        this.shellCheckResult = '';

        that.files = Array.isArray(that.file) ? that.file : [that.file];

        this.$onInit = function () {
            //use as dropdown menu or modal content
            that.isUseAsDrownMenu = useAsDropdownMenu();
            if (that.isUseAsDrownMenu) {
                refreshWhenDropdownShown();
            } else {
                refresh();
            }
        };

        function shellCheck() {
            gfileService.shellCheck('stage', that.files[0].repo, that.files).then(function (result) {
                if (result["_status"] === "OK") {
                    that.shellCheckResult = result["result"];
                }
            }).catch(function (err) {
                submitFail(err);
            })
        }

        function compareFile() {
            $timeout(function () {
                $('.compareArea', $element).mergely({
                    license: 'gpl',
                    cmsettings: {
                        readOnly: true
                    },
                    autoresize: true,
                    lhs: function (setValue) {
                        setValue(that.file.fileContent.historyContent || '');
                    },
                    rhs: function (setValue) {
                        setValue(that.file.fileContent.content || '');
                    }
                });
            }, 100);
        }

        function refresh() {
            // console.log('refresh....')
            that.model = {status: undefined, comment: undefined};

            if (Array.isArray(that.file)) {
                //patch
                that._availActions = gfileService.getWholeActionsByRepoType(that.repoType);
                that._availActions.forEach(function (action) {
                    action.hasPermission = true;
                });
            } else if (that.file.path) {
                //single
                gfileService.getFileInfo(that.repoType, that.file.repo, that.file.path, true).then(function (file) {
                    that._availActions = gfileService.detectActions(that.file);
                    that.file = file;

                    var isOwner = currentUser.loginId === file.createdBy;
                    that._availActions.forEach(function (action) {
                        var permission = action.permission;
                        action.hasPermission = (permission.owner && isOwner) || (permission.codes && currentUser.hasAnyPermission(permission.codes));
                    });

                    console.dir(that._availActions);
                }).catch(function (err) {
                    throw err;
                });
            }
        }


        function submit() {
            that.isSaving = true;
            if (that.model.status === 'REVERT') {
                var filePaths = that.files.map(function (file) {
                    return file.path;
                });
                gfileService.deleteFiles('STAGE', that.files[0].repo, filePaths)
                    .then(function (data) {
                        submitSuccess();
                    })
                    .catch(function (err) {
                        submitFail(err);
                    });
            } else {
                var repoType = (that.model.name === 'APPROVE' || that.model.name === 'REJECT') ? 'STAGE' : that.repoType;
                gfileService.changeFileStatus(repoType, that.files[0].repo, that.files, that.model.status, that.comment)
                    .then(function (data) {
                        // goTopDir(data);
                        submitSuccess();
                    })
                    .catch(function (err) {
                        submitFail(err);
                    });
            }
        }

        function goTopDir(data) {
            $state.go('app.gfs.git_repo_dir_approve', {repo: '$tnt', dir: data.topDir})
        }

        function submitSuccess() {
            if (that.isUseAsDrownMenu) {
                closeDropdown();
            }
            that.isSaving = false;
            angular.isFunction(that.afterChange) && that.afterChange('success');

            messageService.toast('success', $translate.instant("gfs.common.operation_success"));
        }

        function submitFail(error) {
            that.isSaving = false;
            messageService.confirmDanger($translate.instant("gfs.common.operation_fail"), error.toString());
        }

        function refreshWhenDropdownShown() {
            // $scope.$watch(function () {
            //     var visible = $element.is(':visible');
            //     console.log('$watch...visible', visible);
            //     return visible;
            // }, function (newVal, oldVal) {
            //     if (newVal)
            //         refresh();
            // });
            $scope.$watch('$ctrl.watchRefresh', function (newVal, oldVal) {
                // console.log('watchRefresh', newVal, oldVal);
                refresh();
            });
        }

        function cancel() {
            if (that.isUseAsDrownMenu) {
                closeDropdown();
            } else {
                angular.isFunction(that.afterChange) && that.afterChange('cancel');
            }
        }

        function useAsDropdownMenu() {
            return $element.closest('.dropdown-menu').length > 0;
        }

        function closeDropdown() {
            var $menu = $element.closest('.dropdown-menu');
            if ($menu.length > 0) {
                $menu.removeClass('show');
                // $menu.parent().removeClass('open');
            }
        }

    }
})();
