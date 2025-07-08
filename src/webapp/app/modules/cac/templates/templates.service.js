/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacTemplatesService', CacTemplatesService);

    CacTemplatesService.$inject = ['restUtils'];

    function CacTemplatesService(restUtils) {
        var MODULE = "cac";

        this.getAllTemplates = getAllTemplates;
        this.getTemplatesById = getTemplatesById;
        this.uniqueValidation = uniqueValidation;
        this.saveORUpdateTemplates = saveORUpdateTemplates;
        this.deleteTemplates = deleteTemplates;

        function getAllTemplates() {
            return restUtils.callApi(MODULE, 'GET','/api/cac/v3/get-templates', null);
        }

        function getTemplatesById(id) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/get-templates/{id}', {id: id})
        }

        function uniqueValidation(templates){
            return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/get-templates/unique-validation', null, templates);
        }

        function saveORUpdateTemplates(templates,id) {
            if(null == id || "" == id){
                return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/get-templates', null, templates);
            }else{
                return restUtils.callApi(MODULE, 'PUT', '/api/cac/v3/get-templates', null, templates);
            }
        }

        function deleteTemplates(id) {
            return restUtils.callApi(MODULE, 'DELETE', '/api/cac/v3/get-templates/{id}',{id: id});
        }

    }

})();