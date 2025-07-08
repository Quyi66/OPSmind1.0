(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('DictApiCtrl', DictApiCtrl);

    DictApiCtrl.$inject = ['$scope','$uibModalInstance','Dict','dict'];

    function DictApiCtrl( $scope, $uibModalInstance,Dict,dict) {

        $scope.folder = "";
        var prefix = window.$oplus.appConfig.apiBaseUrls.portal;
        if (prefix) {
            prefix += "/";
        } else {
            prefix = window.location.protocol + "//" + window.location.host + window.location.pathname;
        }

        $scope.restApi = prefix + "api/dicts/"+dict.value;

        var getUrl = $scope.restApi;

        $scope.getUrl = getUrl;

        $scope.curlGetUrl = 'curl -X GET --header "Accept: */*"  "' + encodeURI(getUrl) + '"';

        $scope.dismissModal = function () {
            $uibModalInstance.close();
        }

        $scope.getDictByCode = function () {
            Dict.getDictByCode(dict.value).then(
                function (data) {
                    $scope.folder = JSON.stringify(data, null, 2);
                },function () {

                }
            )

        }

    }

})();
