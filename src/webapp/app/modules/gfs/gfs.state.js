/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-01-03.
 */
(function () {
    'use strict';

    angular.module('oplus.gfs').config(['$stateProvider',
        function ($stateProvider) {
            configRoutes($stateProvider);
        }]);

    function configRoutes($stateProvider) {
        $stateProvider
            .state('app.gfs', {
                url: '/gfs',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/gfs/gfs-index.html'
                    }
                },
                useAsApplet: {
                    code: 'gfs',
                    title: 'app.nav.gfs',
                    icon: 'fa-oplus-gfs',
                    color: '#607D8B',
                    showIn: {desktop: 2}
                }
            });
        $stateProvider
            // .state('app.gfs.git_repo', {
            //     url: '/r/{repo}',
            //     views: {
            //         'gfs_main': {
            //             templateUrl: 'app/modules/gfs/repo-navi.html',
            //             controller: 'GfsRepoNavCtrl',
            //             controllerAs: '$ctrl'
            //         }
            //     },
            //     resolve: {
            //         repoType: function () {
            //             return 'git';
            //         }
            //     }
            // })
            .state('app.gfs.git_repo_dir', {
                //https://github.com/angular-ui/ui-router/issues/2598#issuecomment-312525643
                // Use {dir:any} instead of {dir:.*}. The later will change slash `/` in param to `~2F`
                // e.g., dir 'a/b/c' to `a~2Fb~2Fc`
                url: '/r/{repo}/dir/{dir:any}',
                views: {
                    'gfs_main': {
                        templateUrl: 'app/modules/gfs/repo-navi.html',
                        controller: 'GfsRepoNavCtrl',
                        controllerAs: '$ctrl'
                    }
                },
                resolve: {
                    repoType: function () {
                        return 'git';
                    }
                }
            })
            .state('app.gfs.git_repo_dir_approve', {
                url: '/r/{repo}/approve/{dir:any}',
                views: {
                    'gfs_main': {
                        templateUrl: 'app/modules/gfs/repo-approve.html',
                        controller: 'GfsRepoApproveCtrl',
                        controllerAs: '$ctrl'
                    }
                },
                resolve: {
                    repoType: function () {
                        return 'stage';
                    }
                }
            })
            .state('app.gfs.staticfs_dir', {
                url: '/staticfs/{repo}/dir/{dir:any}',
                views: {
                    'gfs_main': {
                        templateUrl: 'app/modules/gfs/repo-navi.html',
                        controller: 'GfsRepoNavCtrl',
                        controllerAs: '$ctrl'
                    }
                },
                resolve: {
                    repoType: function () {
                        return 'staticfs';
                    }
                }
            })


            .state('app.gfs.file_rev', {
                url: '/file/rev?id&repo&path&commit',
                //https://stackoverflow.com/a/24624479/1524900
                reloadOnSearch: false,
                views: {
                    'gfs_main': {
                        template: '<gfs-gfile-rev params="$ctrl.params" options="{detailTarget:\'url\'}" class="h-100" style="overflow:hidden"></gfs-gfile-rev>',
                        controller: ['$stateParams', '$state', function ($stateParams, $state) {
                            this.params = {
                                id: $stateParams.id,
                                repo: $stateParams.repo,
                                path: $stateParams.path,
                                commit: $stateParams.commit
                            };
                        }],
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.gfs.example', {
                url: '/example',
                views: {
                    'gfs_main': {
                        templateUrl: 'app/modules/gfs/gfs-example.html',
                        controller: 'GfsExampleCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
        ;
    }
})();
