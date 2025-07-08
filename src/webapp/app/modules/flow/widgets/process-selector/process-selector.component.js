/**
 * @ Author: chy
 * @ Create Time: 2023-04-06 19:28:47
 * @ Description:  
 */

processSelectorCtrl.$inject = ['$scope', 'messageService', 'flow.Service']

export default function processSelectorCtrl($scope, messageService, flowService) {
    var that = this;

    $scope.$watch('$ctrl.theModel', function (newVal, oldVal) {
        that.selectedProcess = newVal ? _.find(that.processList, {id: newVal}) : undefined;
    });

    flowService.fetchProcesses().then(function (processList) {
        that.processList = angular.isArray(processList) ? processList : processList.records;
        if (that.exceptList && that.exceptList.length > 0)
            that.processList = that.processList.filter(f => that.exceptList.indexOf(f.id) < 0)
        that.processList = _.orderBy(that.processList, ['processName']);
        that.selectedProcess = that.theModel ? _.find(that.processList, {id: that.theModel.id}) : undefined;
    }).catch(function (err) {
        //TODO: need notify error
        throw err;
    });
}