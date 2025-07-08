/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('udpTagsService', udpTagsService);

    udpTagsService.$inject = ['$q', 'restUtils'];

    function udpTagsService($q, restUtils) {
        var module = "udp";
        this.findTagsByTenantId = findTagsByTenantId;
        this.findTagsByTenantIdAndTotal = findTagsByTenantIdAndTotal;
        this.findAppletByTagId = findAppletByTagId;
        this.findTagById = findTagById;
        this.findTagByName = findTagByName;
        this.saveTag = saveTag;
        this.deleteTagById = deleteTagById;
        this.deleteAppletMapperByTagId = deleteAppletMapperByTagId;

        /**
         * param tagId, appletIds.
         * @param param
         */
        function deleteAppletMapperByTagId(param){
            return restUtils.callApi(module, 'POST', '/api/udp/tags/mapper/remove', null, param);
        }

        function findTagsByTenantIdAndTotal() {
            return restUtils.callApi(module, 'GET', '/api/udp/tags/total');
        }

        function findAppletByTagId(tagId) {
            return restUtils.callApi('udp', 'GET', '/api/udp/tags/applet/{id}', {id:tagId});
        }

        function findTagsByTenantId() {
            return restUtils.callApi(module, 'GET', '/api/udp/tags');
        }

        function saveTag(tag) {
            if (!tag.id) {
                return restUtils.callApi(module, 'POST', '/api/udp/tags', null, tag);
            } else {
                return restUtils.callApi(module, 'PUT', '/api/udp/tags', null, tag);
            }
        }

        function findTagById(id) {
            return restUtils.callApi(module, 'GET', '/api/udp/tags/id/{id}', {id: id});
        }

        function findTagByName(name) {
            return restUtils.callApi(module, 'GET', '/api/udp/tags/name/{name}', {name: name});
        }

        function deleteTagById(id) {
            return restUtils.callApi(module, 'DELETE', '/api/udp/tags/{id}', {id: id});
        }
    }

})();

