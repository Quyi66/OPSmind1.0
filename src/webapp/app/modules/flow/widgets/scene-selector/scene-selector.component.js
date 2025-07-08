/**
 * @ Author: chy
 * @ Create Time: 2023-04-06 19:28:47
 * @ Description:  
 */

processSelectorCtrl.$inject = ['$scope', 'messageService', 'flow.Service']

export default function processSelectorCtrl($scope, messageService, flowService) {
    var that = this;

    $scope.$watch('$ctrl.theModel', (newVal, oldVal) => {
        that.selectedScene = newVal ? _.find(that.sceneList, { id: newVal }) : undefined;
    });


    $scope.$watch('$ctrl.processId', function (newVal, oldVal) {
        flowService.fetchScenes(newVal).then(function (sceneList) {
            that.sceneList = angular.isArray(sceneList) ? sceneList : sceneList.records;
            that.sceneList = _.orderBy(that.sceneList, ['name']);

            var defaultScene = that.sceneList.find(s => s.isDefault);

            if (that.theModel && that.sceneList.some(s => s.id === that.theModel)) {
                that.selectedScene = that.sceneList.find(f => f.id === that.theModel);
            }
            else if (defaultScene) {
                that.theModel = defaultScene.id;
            }
            else that.theModel = undefined;

        }).catch(function (err) {
            //TODO: need notify error
            throw err;
        });
    });

    
}