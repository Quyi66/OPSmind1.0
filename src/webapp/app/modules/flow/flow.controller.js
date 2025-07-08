/**
 * @ Author: chy
 * @ Create Time: 2022-06-28 16:06:14
 * @ Description:  
 */

flowController.$inject = ['$scope', '$state'];
export default function flowController($scope, $state) {
  var that = this;

  that.$onInit = function () {
    if ($state.current && $state.current.name === 'app.flow')
      $state.go('app.flow.list');
  };
}
