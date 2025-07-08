/**
 *
 * @author chy, 2021/10/25
 */
(function () {
  'use strict';

  angular.module('oplus.jao')
    .component('jaoJobParam', {
      templateUrl: 'app/modules/jao/widgets/jobParam/job-param.html',
      controller: JaoJobParamCtrl,
      bindings: {
        params: '=',
        theModel: '=',
        readonly: '=?',
      }
    });

  JaoJobParamCtrl.$inject = ['$scope', '$timeout'];
  function JaoJobParamCtrl($scope, $timeout) {
    var that = this;
    that.paramsFake = [];
    if (!that.theModel) that.theModel = {};

    $scope.$watch('$ctrl.params', function (n, o) {
      that.paramsFake = [];

      $timeout(function () {
        that.paramsFake = n;

        that.paramsFake.forEach(param => {
          var desc = param.description || param.desc || "";
          if (desc.startsWith('uw-prop=')) {
            var uwProp = angular.fromJson(desc.substr('uw-prop='.length).replaceAll('&quot;', '"'));
            param.uWidgetProp = uwProp;
          }
          else if (desc.startsWith('dc-selector=')) { 
            var dcSelector = angular.fromJson(desc.substr('dc-selector='.length).replaceAll('&quot;', '"'));
            dcSelector.valueType = param.type === 'string' ? 'string' : 'array';
            param.dcSelector = dcSelector;
          }
        })

        that.theModel = Object.fromEntries(_.map(n, function (m) { return [m.name, that.theModel[m.name] || m.defaultValue] }));
      }, 50)
    }, true);
  }
})();
