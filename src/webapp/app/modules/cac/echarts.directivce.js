(function() {
    'use strict';

    angular
        .module('oplus.cac')
            .directive('eEchart', eEchart);
    function eEchart(){
        return {
            restrict : 'A',
            link : link
        };
    }

    function link($scope, element, attrs){
        var myChart = echarts5.init(element[0], attrs.theme);
        $scope.$watch(attrs['ecData'], function(){
            var option = $scope.$eval(attrs.ecData);
            if(angular.isObject(option)) {
                myChart.setOption(option);
            }
        }, true);

        $scope.getDom = function(){
            return {
                'height' : element[0].offsetHeight,
                'width' : element[0].offsetWidth
            }
        };

        $scope.$watch($scope.getDom, function(){
            myChart.resize();
        }, true)
    }
})();
