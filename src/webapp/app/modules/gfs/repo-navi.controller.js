/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-01-06
 */
(function () {
    'use strict';

    angular.module('oplus.gfs').controller('GfsRepoNavCtrl', GfsRepoNavCtrl);

    GfsRepoNavCtrl.$inject = ['$state', '$stateParams', 'repoType'];

    /**
     * Navigation through a repository.
     * @param $state
     * @param $stateParams
     * @param {string} repoType "git" or "staticfs"
     * @constructor
     */
    function GfsRepoNavCtrl($state, $stateParams, repoType) {
        this.repo = $stateParams.repo;
        this.dir = $stateParams.dir;
        this.repoType = repoType;
        this.options = {
            base: '',
            showStatus: repoType === 'git',
            showStageIndicator: repoType === 'git',
            showStageStatus: repoType === 'git',
            includeStage: repoType === 'git',
            jumpToApprove: repoType === 'git',
            canApprove: false,
            canTestRun: true,
            changeUrl: true,
            showActions: true,
            allowAddFile: true,
            useSelector: true,
            multipleSelect: true,
            canSelectDirectory: true
        }
    }
})();
