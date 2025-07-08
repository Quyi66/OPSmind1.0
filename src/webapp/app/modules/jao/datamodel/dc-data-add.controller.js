/**
 * @author mr.kongqi@gmail.com,2021/9/3 14:00,created
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('jaodcDataCtrl', JaodcDataCtrl);

    JaodcDataCtrl.$inject = ['$scope', '$state', 'jaoJobService', '$stateParams', '$location', 'messageService', 'userPref' ];

    /**
     *
     * @param $scope
     * @param $state
     * @param {jaoJobService} jaoJobService
     * @param $stateParams
     * @param $location
     * @param {messageService} messageService
     * @param {userPref} userPref
     * @constructor
     */
    function JaodcDataCtrl($scope, $state, jaoJobService, $stateParams, $location, messageService, userPref ) {
        var that = this;
        var id = $stateParams.id;
        that.id = id;
        console.log("state is" + $state.current.name)
        that.viewMode = !id ? 'create' : ($state.current.name === 'app.appman.datamodel.edit' ? 'edit' : 'view');
    }
})();
