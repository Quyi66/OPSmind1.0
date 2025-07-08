/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-01-04
 */
(function () {
    'use strict';
    angular.module('oplus.gfs').controller('GfsExampleCtrl', GfsExampleCtrl);

    GfsExampleCtrl.$inject = ['$scope', '$translate', 'gfsActionHelper'];

    /**
     *
     * @param $scope
     * @param $translate
     * @param {gfsActionHelper} gfsActionHelper
     */
    function GfsExampleCtrl($scope, $translate, gfsActionHelper) {
        var that = this;
        this.repo = 'redcap';
        this.dir = 'scripts';
        this.currentDir = this.dir;
        this.selectedFiles = {
            location: $translate.instant('gfs.dev.test'),
            icon: 'icon attr not exists in file'
        };
        // this.selectedFiles = ['system-check-cust.zip'];
        var fileSelectorConfig = {
            // repoType: 'staticfs',
            repoType: 'git',
            dir: '',
            // modelConverter: {type: 'singleattr', singleattr: 'path',modelType:'string'},
            // modelConverter: {type: 'single-attr', attr: 'path',modelType:'array'},
            // modelConverter: {
            //     type: 'function',
            //     toFileFn: function (model) {
            //         return {path: model.location, config: model.argline};
            //     },
            //     toModelFn: function (file) {
            //         return {location: file.path, argline: file.config};
            //     }
            // },
            multipleSelect: false
        };
        this.dialogFileSelectorConfig = _.extend({}, fileSelectorConfig, {viewMode: 'dialog'});
        this.browserFileSelectorConfig = _.extend({}, fileSelectorConfig, {viewMode: 'browser'});
        this.openFileSelectorDialog = function () {
            var config = that.dialogFileSelectorConfig;
            config.multipleSelect = that.multipleSelect;
            gfsActionHelper.openFileSelector($scope, config);
        };
        this.onConfirmSelection = onConfirmSelection;
        // this.addFileAction = {
        //     action: 'NEW_FILE', repo: this.repo, dir: this.currentDir, callback: function () {
        //         // $state.reload();
        //     }
        // };

        function onConfirmSelection(files) {
            console.log('onConfirmSelection', files);
            that.selectedFiles = files;
        }
    }
})();
