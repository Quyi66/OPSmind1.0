/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/27/2017
 */
(function () {
    'use strict';

    // TODO: Move udpFileBrowser out of here and make it common use.
    angular.module('oplus.udp')
        .controller('PageImportCtrl', PageImportCtrl)
        .directive('udpFileBrowser', fileBrowserDirective);

    PageImportCtrl.$inject = ['$scope', 'pageService', '$q', '$timeout', '$window', '$uibModalInstance'];

    fileBrowserDirective.$inject = ['$timeout'];

    /**
     *
     * @param $scope
     * @param pageService {pageService}
     * @param $q
     * @param $window
     * @param $uibModalInstance
     * @constructor
     */
    function PageImportCtrl($scope, pageService, $q, $timeout, $window, $uibModalInstance) {
        var vm = this;
        vm.doImport = doImport;
        vm.cancelImport = cancelImport;
        vm.parseFile = parseFile;
        vm.selectAll = selectAll;
        vm.selectedFile = {};
        // vm.files = [];
        vm.pages = [];

        function doImport() {
            var pages = _.filter(vm.pages, {_selected: true});
            pages.forEach(function (p) {
                delete p._selected;
            });
            pageService.importPages("same", pages).then(function (data) {
                alert('import in background');
                $uibModalInstance.close();
                console.log(data);
            }).catch(function (err) {
                console.error(err);
            })
        }

        function cancelImport() {
            $uibModalInstance.dismiss();
        }

        function selectAll() {
            vm.pages.forEach(function (page) {
                page._selected = vm.isAll;
            });
        }

        function parseFile(file) {
            // var d = $q.defer();
            // var file = vm.selectedFile['_0_'];
            // console.log('parseFile', vm.selectedFile);
            var reader = new $window.FileReader();
            reader.onload = function (ev) {
                var content = ev.target.result;
                // d.resolve(content);
                $timeout(function () {
                    vm.pages = pageService.parseExportFile(content);
                });
            };
            reader.readAsText(file);
            // return d.promise;
        }
    }

    function fileBrowserDirective($timeout) {
        'use strict';
        return {
            template: '<input type="file" style="display: none;" /><ng-transclude></ng-transclude>',
            transclude: true,
            scope: {
                file: '=ngModel',
                onChange: '<'
            },
            link: function (scope, element) {
                var fileInput = element.children('input[type="file"]');
                fileInput.on('change', function (event) {
                    $timeout(function () {
                        var file = event.target.files[0];
                        scope.file['_0_'] = file;
                        scope.onChange && scope.onChange(file);
                    });
                });

                element.on('click', function () {
                    fileInput[0].click();
                });
            }
        };
    }
})();
