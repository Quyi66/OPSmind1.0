(function () {
    'use strict';

    angular.module('oplus.acm').component('acmListCiTag', {
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            selectedTags: '=ngModel',
            theHostsByCiType: '=',
            options: '<',
            assetType: '<ciType',
            mcheckType: '<'
        },
        templateUrl: 'app/modules/acm/acm-list-ci-tag.html',
        controller: ['$element', '$scope', 'datasetService', '$timeout', 'widgetInteraction', 'restUtils', AcmListCiTagCtrl]
    });

    /**
     *
     * @param $element
     * @param $scope
     * @param {datasetService} datasetService
     * @param $timeout
     * @param {widgetInteraction} widgetInteraction
     * @param restUtils
     * @constructor
     */
    function AcmListCiTagCtrl($element, $scope, datasetService, $timeout, widgetInteraction, restUtils) {
        var that = this;
        this.$onInit = onInit;
        this.setTag = setTag;

        function onInit() {
            restUtils.callApi('acm', 'GET', '/api/acm/query/tag/view/' + this.assetType).then(function (data) {
                that.tags = data;
                _.forEach(that.tags, function (tag, value) {
                    var finds = _.findKey(that.selectedTags, function (o) {
                        return o.key === '#' + tag.name;
                    });
                    if (finds) {
                        tag.status = true;
                    }
                })
            }).catch(function (err) {
                throw err;
            });


            $scope.$on("theHostsByCiType", function ($event, type, tag) {
                if (type === "tag") {
                    angular.forEach(that.tags, function (v, k) {
                        var tagName = "#" + v.name;
                        if (tagName === tag.key) {
                            v.status = false;
                            _.remove(that.selectedTags, function (data) {
                                return data.key === tagName;
                            });
                            that.ngModelCtrl.$setViewValue(that.selectedTags);
                        }
                    })
                }
            })
        }

        function setTag(tagName, assetType) {
            var tagsList = [];
            if (that.mcheckType === 'jsonarray') {
                tagsList = that.selectedTags;
            } else {
                tagsList = _.compact(_.map(that.selectedTags, "key"));
            }
            var tagParam = {key: tagName, value: tagName, assetType: assetType};
            if (tagsList.length > 0) {
                var _index = _.indexOf(tagsList, tagName);
                if (_index === -1) {
                    if (angular.isString(that.selectedTags)) {
                        that.selectedTags += JSON.stringify(tagParam);
                    } else {
                        that.selectedTags.push(tagParam);
                    }
                } else {
                    if (angular.isString(that.selectedTags)) {
                        var removeList = JSON.parse(that.selectedTags);
                        _.remove(removeList, function (data) {
                            return data.key === tagName;
                        });
                        that.selectedTags = removeList;
                    } else {
                        _.remove(that.selectedTags, function (data) {
                            return data.key === tagName;
                        });
                        _.remove(that.theHostsByCiType, function (data) {
                            return data.key === tagName;
                        });
                    }
                }
            } else {
                if (angular.isString(that.selectedTags)) {
                    that.selectedTags += JSON.stringify(tagParam);
                } else {
                    that.selectedTags.push(tagParam);
                    that.theHostsByCiType.push(tagParam);
                }
            }
            if (that.mcheckType === undefined || that.mcheckType === 'jsonarray') {
                that.ngModelCtrl.$setViewValue(_.map(that.selectedTags, "value"));
            } else {
                $timeout(function () {
                    $scope.$apply(function () {
                        that.ngModelCtrl.$setViewValue(that.selectedTags);
                    })
                }, 100);
            }
        }
    }

})();
