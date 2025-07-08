/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/31/2017.
 */

(function () {
    'use strict';
    var app = angular.module('oplus.commons');

    /**
     * @memberof oplus.commons
     * @ngdoc service
     * @name localDaoFactory
     */
    app.service('localDaoFactory', localDaoFactory);

    localDaoFactory.$inject = ['$http', '$q'];

    /**
     *
     * @param $http
     * @param $q
     */
    function localDaoFactory($http, $q) {
        this.createDao = createDao;
        this.LocalStorageDao = LocalStorageDao;

        /**
         *
         * @param storageKey {string} Key of LocalStorage item
         * @returns {LocalStorageDao}
         */
        function createDao(storageKey) {
            return new LocalStorageDao(storageKey);
        }

        /**
         *
         * @param {string} key Key of local storage
         */
        function LocalStorageDao(key) {
            var storageKey = key;
            this.findAllEntities = findAllEntities;
            this.findEntity = findEntity;
            this.deleteEntity = deleteEntity;
            this.saveEntity = saveEntity;
            this.saveAllEntities = saveAllEntities;

            function findAllEntities() {
                var that = this;
                var d = $q.defer();
                var str = localStorage.getItem(storageKey) || '[]';
                var entities = [];
                try {
                    entities = JSON.parse(str);
                } catch (e) {
                    d.reject(e);
                }
                entities = entities || [];
                d.resolve(entities);
                return d.promise;
            }

            function saveAllEntities(entities) {
                return $q(function (resolve, reject) {
                    localStorage.setItem(storageKey, JSON.stringify(entities));
                    resolve();
                });
            }

            /**
             *
             * @param entity {{id:string,html:string,title:string}}
             * @return {$q<{id:string}>}
             */
            function saveEntity(entity) {
                var that = this;
                var d = $q.defer();
                entity.modifiedAt = Date.now();
                if (!entity.id) {
                    entity.id = Date.now() + '';
                    entity.createdAt = Date.now();
                }
                findAllEntities().then(function (entities) {
                    var index = 0;
                    for (; index < entities.length; index++) {
                        if (entities[index].id === entity.id) {
                            entities[index] = entity;
                            break;
                        }
                    }
                    if (index === entities.length) {
                        entities.push(entity);
                    }
                    saveAllEntities(entities);
                    d.resolve({id: entity.id});
                });
                return d.promise;
            }

            function deleteEntity(id) {
                var d = $q.defer();
                findAllEntities().then(function (entities) {
                    var idx = _.findIndex(entities, {'id': id});
                    if (idx >= 0) {
                        entities.splice(idx, 1);
                    }
                    return saveAllEntities(entities);
                }).then(function () {
                    d.resolve({});
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            }

            /**
             *
             * @param id {String} Entity ID
             * @return {promise<object>}
             */
            function findEntity(id) {
                var d = $q.defer();
                if (id) {
                    findAllEntities().then(function (entities) {
                        d.resolve(_.find(entities, {'id': id}));
                    });
                } else {
                    throw new Error('MissingParameter: id required');
                }
                return d.promise;
            }
        }
    }
})();