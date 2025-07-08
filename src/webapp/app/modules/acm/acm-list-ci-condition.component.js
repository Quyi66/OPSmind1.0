
(function () {
    'use strict';

    angular.module('oplus.acm').component('acmListCiCondition', {
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            selectedTags: '<ngModel',
            options: '<',
            assetType:'<'
        },
        templateUrl: 'app/modules/acm/acm-list-ci-condition.html',
        controller: ['$element', '$scope', 'datasetService', '$timeout', 'widgetInteraction','restUtils', AcmListCiConditionCtrl]
    });

    /**
     *
     * @param $element
     * @param $scope
     * @param {datasetService} datasetService
     * @param $timeout
     * @param {widgetInteraction} widgetInteraction
     * @param {restUtils} restUtils
     * @constructor
     */
    function AcmListCiConditionCtrl($element, $scope, datasetService, $timeout, widgetInteraction,restUtils) {
        var that = this;
        this.$onInit = onInit;
        this.setTag = setTag;
        function onInit(){
            restUtils.callApi('acm', 'GET', '/api/acm/query/dyna/tags/' + this.assetType).then(function (data) {
                that.tags = data;
                _.forEach(that.tags,function(tag,value){
                    var tagStatus = _.indexOf(that.selectedTags,'$'+tag.name) !== -1?true:false;
                    tag.status = tagStatus;
                })
            }).catch(function (err) {
                throw err;
            });
        }

        function setTag(tagName){
            var _index = _.indexOf(that.selectedTags,tagName);
            if (_index == -1) {
                that.selectedTags.push(tagName);
            }
            else {
                that.selectedTags.splice(_index,1);
            }

            $timeout(function(){
                $scope.$apply(function () {
                    var sTags = angular.element("#cm_dynamic_tag_card_div li .btn-primary");
                    var sTagsValue = _.map(sTags,"value");
                    that.ngModelCtrl.$setViewValue(sTagsValue);
                });
            },100);
        }


    }

})();
