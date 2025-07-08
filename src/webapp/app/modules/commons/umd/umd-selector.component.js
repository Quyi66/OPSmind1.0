/**
 * @ Author: chy
 * @ Create Time: 2023-05-30 14:30:43
 * @ Description:  
 */

(function () {
    'use strict';

    angular.module('oplus.commons').component('umdSelector', {
        bindings: {
            appletCode: '<?',
            selectedData: '=',
            theModel: '='
        },
        templateUrl: 'app/modules/commons/umd/umd-selector.html',
        controller: umdSelectorCtrl
    });

    umdSelectorCtrl.$inject = ['$scope', '$stateParams', 'dcDataService']

    function umdSelectorCtrl($scope, $stateParams, dcDataService) {
        var that = this;
        that.appletCode = that.appletCode || $stateParams.appletCode || '';

        $scope.$watch('$ctrl.theModel', function (newVal, oldVal) {
            that.selectedData = newVal ? _.find(that.dataList, { code: newVal }) : undefined;
        });

        dcDataService.dcModelList(that.appletCode).then(function (dataList) {
            that.dataList = angular.isArray(dataList) ? dataList : dataList.records;
            that.dataList = _.orderBy(that.dataList, ['title']);
            that.selectedData = that.theModel ? _.find(that.dataList, { code: that.theModel }) : undefined;
        }).catch(function (err) {
            //TODO: need notify error
            throw err;
        });
    }
})();