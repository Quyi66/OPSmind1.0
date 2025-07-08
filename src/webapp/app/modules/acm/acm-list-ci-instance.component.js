/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/11/03
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name acmListHost
     * @desc Select hosts or host groups.
     * A group is identified by its path which starts with slash `/`.
     * A host is identified by its key - some recognizable value which distinguishes one host from each other,
     * generally is IP, hostname or FQDN.
     * A special value `@@` (two at) is used to indicate all servers.
     * @usage
     * ```
     * <acm-list-ci-instance asset-type="string" the-model="" options="">
     * ```
     * @param {[{key:string,value:string,assetType:string}]} theModel Two-way binding of selected CI instances, groups or tags.
     * TODO: rename format to {value:string, label:string, type:string}
     * @param {object} options
     */
    angular.module('oplus.acm').component('acmListCiInstance', {
        bindings: {
            ciType: '<ciType',
            theModel: '=',
            theHostsByCiType: '=',
            options: '<'
        },
        templateUrl: 'app/modules/acm/acm-list-ci-instance.html',
        controller: ['$element', '$timeout', '$scope', 'widgetInteraction', 'currentUser', 'acmUtil', 'acmService', AcmListCiInstanceCtrl]
    });

    /**
     *
     * @param $element
     * @param $timeout
     * @param $scope
     * @param {widgetInteraction} widgetInteraction
     * @param currentUser
     * @param {acmUtil} acmUtil
     * @param {acmService} acmService
     * @constructor
     */
    function AcmListCiInstanceCtrl($element, $timeout, $scope, widgetInteraction, currentUser, acmUtil, acmService) {
        var PAGE_PARAM_OF_SELECTED_HOSTS = '_selected_hosts_';
        var PROP_NAME_OF_GROUP_PATH = 'groups';
        var PROP_NAME_OF_TAG = 'tags';
        var PROP_NAME_OF_DYNAMIC_TAG = 'dynamicTags';
        var that = this;
        this.useOpxDatatable = !true;
        this.dataType = that.options.dataType || "auto";
        this.udpPageData = {};
        this.callbackOnLoaded = onHostListPageLoaded;
        this.onClickGroup = onClickGroup;
        this.onClickTag = onClickTag;
        this.onClickTagDynamicTag = onClickTagDynamicTag;
        this.$onInit = onInit;

        function onInit() {
            if (that.useOpxDatatable) {
                onInit_v2();
            } else {
                onInit_v1();
            }
        }

        function onInit_v2() {
            that.tableConfig = {
                columns: [],
                data: []
            };
        }

        function onInit_v1() {
            $scope.rowFields = [];
            $scope.idFields = [
                {
                    "field": "id",
                    "mcheck": true,
                    "mcheckUnionFiled": "IP",
                    "mcheckCIType": that.ciType,
                    "mcheckParam": PAGE_PARAM_OF_SELECTED_HOSTS,
                    "mcheckType": "map",
                    "hidden": false
                }
            ];
            // acmUtil.tabFields(that.ciType).then(function (result) {
            acmService.calcDynamicFieldsForTableView(that.ciType, 'selector').then(function (result) {
                // console.log('acmUtil.tabFields', that.ciType, result);
                $scope.rowFields = _.concat($scope.idFields, result);
                $scope.datatableProps = {
                    //Todo 根据CIT 自动获取fields
                    "fields": $scope.rowFields,
                    "display": {
                        "css": "mb-3",
                        "style": "simple",
                        "cardMode": true,
                        "noBorder": true,
                        "tbodyHeight": 370,
                        "exfilter": false,
                        "showrefresh": true
                    },
                    "dataset": {
                        "_type": "",
                        "params": [
                            {
                                "name": "token",
                                "initval": currentUser.authToken,
                                "format": "string",
                                // "binding": "groups",
                                "control": "hidden"
                            },
                            {
                                "name": "groups",
                                "initval": "@@",
                                "format": "string",
                                "binding": "groups",
                                "control": "text"
                            },
                            {
                                "name": "tags",
                                "initval": "@@",
                                "format": "string",
                                "binding": "tags",
                                "control": "hidden"
                            },
                            {
                                "name": "dynamicTags",
                                "initval": "@@",
                                "format": "string",
                                "binding": "dynamicTags",
                                "control": "hidden"
                            },
                            {
                                name: 'assetType',
                                initVal: that.ciType,
                                format: 'string',
                                binding: 'ciType',
                                control: 'hidden'
                            },
                            {
                                name: 'dataType',
                                initVal: that.dataType,
                                format: 'string',
                                binding: 'dataType',
                                control: 'hidden'
                            }
                        ],
                        "serverPage": true,
                        "hideParams": true,
                        "id": "ACM_GET_CI_BY_SELECTOR"
                    }
                };
            });
            var watchExp = '$ctrl.udpPageData.pageParams.' + PAGE_PARAM_OF_SELECTED_HOSTS;

            $scope.$watch(watchExp, function (newVal, oldVal) {
                if (newVal === oldVal)
                    return;

                if (_.isEqual(newVal, that.theHostsByCiType)) {
                    that.theHostsByCiType = _.groupBy(that.theModel, "assetType")[that.ciType];
                    return;
                }
                if (that.theModel && that.theModel.length > 0) {
                    that.theModel = newVal;
                    var selectedAll = _.groupBy(that.theModel, "assetType");
                    that.theHostsByCiType = selectedAll[that.ciType];
                } else {
                    that.theModel = newVal;
                    that.theHostsByCiType = newVal;
                }
            });

            $scope.$on("theHostsByCiType", function ($event, type, host) {
                if (type === "host") {
                    var widgetScope = angular.element('#datatable .dataTables_wrapper').scope();
                    var index = -1;
                    angular.forEach(that.theHostsByCiType, function (k, v) {
                        if (k.key === host.key) {
                            index = v;
                        }
                    });
                    widgetScope.removeSelectedItem(index);
                }
            })
        }


        /**
         * @param pageScope
         */
        function onHostListPageLoaded(pageScope) {
            that.pageScope = pageScope;
            var params = {};
            params[PAGE_PARAM_OF_SELECTED_HOSTS] = that.theModel;
            widgetInteraction.changePageParams(pageScope, {params: params});
        }

        function onClickGroup(groupKey) {
            var params = {};
            params[PROP_NAME_OF_GROUP_PATH] = groupKey;
            widgetInteraction.changePageParams(that.pageScope, {params: params});
        }

        function onClickTag(tagName) {
            var params = {};
            params[PROP_NAME_OF_TAG] = tagName;
            widgetInteraction.changePageParams(that.pageScope, {params: params});
        }

        function onClickTagDynamicTag(tagName) {
            var params = {};
            params[PROP_NAME_OF_DYNAMIC_TAG] = tagName;
            widgetInteraction.changePageParams(that.pageScope, {params: params});
        }
    }
})();
