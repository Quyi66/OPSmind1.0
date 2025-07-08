/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-07-18
 */
(function () {
    'use strict';

    angular.module('oplus.gfs').controller('GfsRepoApproveCtrl', GfsRepoApproveCtrl);

    GfsRepoApproveCtrl.$inject = ['$state', '$stateParams', 'repoType'];

    /**
     * Navigation through a repository.
     * @param $state
     * @param $stateParams
     * @param {string} repoType "git" or "staticfs"
     * @constructor
     */
    function GfsRepoApproveCtrl($state, $stateParams, repoType) {
        this.repo = $stateParams.repo;
        this.dir = $stateParams.dir;
        this.repoType = 'stage';
        this.options = {
            base: '',
            dirSize: 'children',
            canApprove: true,
            showStatus: false,
            showActions: true,
            showStageStatus: true,
            useSelector: true,
            multipleSelect: true,
            changeUrl: true,
            canSelectDirectory: true,
            // showActions: true,
            // allowAddFile: true
        }
    }
})();
