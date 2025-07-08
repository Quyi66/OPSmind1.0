(function () {
    'use strict';
    angular
        .module('oplus.uaa')
        .factory('UserHabit', UserHabit);

    UserHabit.$inject = ['$resource', '$q', '$http', 'currentUser'];

    function UserHabit($resource, $q, $http, currentUser) {
        var resourceUrl = 'api/userHabits/:id';

        var resource = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: true},
            'update': {method: 'PUT'}
        });


        function getUserHabit(module, _function) {
            var deferred = $q.defer();

            $http.get('api/userHabits/' + currentUser.loginId + '?module=' + module + '&function=' + _function).then(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        return {
            query: resource.query,
            get: resource.get,
            save: resource.save,
            update: resource.update,
            getUserHabit: getUserHabit
        }
    }
})();
