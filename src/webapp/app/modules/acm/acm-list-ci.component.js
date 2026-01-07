/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/11/03
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name acmListCi
     * @description
     * List CI by instance, group, tag or condition. It supports multiple CI types.
     * @usage
     * ```
     * <acm-list-ci ci-type="string" the-model="" select-mode="@string" options="">
     * ```
     * @param {[string]} theModel Two-way binding of selected asset list
     * @param {string|[string]} Array or CSV of CI types
     * @param {object} options
     * @param {string} options.selectMode Combination of "instance,group,tag,condition"
     * @param {boolean=} options.selector "multiple", "single"
     */
    angular.module('oplus.acm').component('acmListCi', {
        bindings: {
            //TODO rename to ciTypes
            ciTypes: '<assetTypes',
            theModel: '=',
            options: '<',
            mcheckType: '<'
        },
        templateUrl: 'app/modules/acm/acm-list-ci.html',
        controller: ['$scope', '$timeout', 'acmUtil', 'acmService', AcmListCiCtrl]
    });

    /**
     *
     * @param $scope
     * @param $timeout
     * @param {acmUtil} acmUtil
     * @param {acmService} acmService
     * @constructor
     */
    function AcmListCiCtrl($scope, $timeout, acmUtil, acmService) {
        var that = this;
        this.selectModeDefs = {};
        var defaultOptions = { selectMode: 'group,tag,input,recently', selector: 'multiple' };
        this.options = _.merge({}, defaultOptions, this.options);
        this.ciTypeDefs = [];
        this.activeCiType = '';
        that.showHosts = false;


        that.theHosts = this.theModel || [];
        that.theHostsByCiType = [];

        this.changeShowHosts = changeShowHosts;
        this.removeItem = removeItem;

        function changeShowHosts() {
            that.showHosts = !that.showHosts;
        }

        function removeItem(host, index) {
            that.theHostsByCiType.splice(index, 1);
            var type = undefined;
            if (host.key.indexOf("/") === 0) {
                type = "group";
            } else if (host.key.indexOf("#") === 0) {
                type = "tag";
            } else {
                type = "host";
            }
            $scope.$broadcast("theHostsByCiType", type, host);
        }


        this.$onInit = onInit;

        function onInit() {
            initCiTypeDefs();
            initSelectMode();
        }


        function initSelectMode() {
            var selectMode = that.options.selectMode;
            if (!selectMode || selectMode.indexOf('all') > -1) {
                selectMode = Object.keys(acmUtil.selectModeDefs).join(',');
            }
            selectMode.split(',').forEach(function (mode, index) {
                if (index === 0) {
                    that._currentMode = mode;
                }
                that.selectModeDefs[mode] = acmUtil.selectModeDefs[mode];
            });
        }

        function initCiTypeDefs() {
            var ciTypes = that.ciTypes;
            ciTypes = angular.isArray(ciTypes) ? ciTypes : ciTypes.split(',');
            if (ciTypes.length === 0) {
                throw new Error('Must specify at least one ci-type in component `<acm-list-ci ci-types>`')
            }
            var useAllTypes = ciTypes.indexOf('[all]') > -1;
            var useAutomationTypes = !useAllTypes && ciTypes.indexOf('[auto]') > -1;
            if (useAutomationTypes) {
                acmService.tabTitleAuto('list').then(function (citMap) {
                    Object.keys(citMap).forEach(function (cit) {
                        that.ciTypeDefs.push({ code: cit, title: citMap[cit].title, icon: citMap[cit].icon });
                    });
                    if (that.ciTypeDefs.length > 0) {
                        that.activeCiType = that.ciTypeDefs[0].code;
                        if (that.theModel) {
                            that.theHostsByCiType = _.groupBy(that.theModel, "assetType")[that.activeCiType];
                        }
                    }
                });
            } else {
                acmService.tabTitle('list').then(function (citMap) {
                    if (useAllTypes) {
                        Object.keys(citMap).forEach(function (cit) {
                            that.ciTypeDefs.push({ code: cit, title: citMap[cit].title, icon: citMap[cit].icon });
                        });
                    } else {
                        _.forIn(citMap, function (value, key) {
                            // 使用不区分大小写的匹配
                            if (_.find(ciTypes, function (o) {
                                return o.toLowerCase() === key.toLowerCase();
                            })) {
                                if (value) {
                                    that.ciTypeDefs.push({ code: key, title: value.title, icon: value.icon });
                                }
                            }
                        });
                    }
                    // 如果 ciTypeDefs 为空，使用传入的 ciTypes 作为 fallback
                    if (that.ciTypeDefs.length === 0 && ciTypes.length > 0) {
                        ciTypes.forEach(function (type) {
                            that.ciTypeDefs.push({ code: type, title: type, icon: 'fa-server' });
                        });
                    }
                    if (that.ciTypeDefs.length > 0) {
                        that.activeCiType = that.ciTypeDefs[0].code;
                        if (that.theModel) {
                            that.theHostsByCiType = _.groupBy(that.theModel, "assetType")[that.activeCiType];
                        }
                    }
                });
            }

        }

        $scope.$watch('$ctrl.activeCiType', function (newVal, oldVal) {
            if (!newVal) return;
            if (oldVal && newVal) {
                // TODO: brute way to refresh <acm-list-ci>
                that.activeCiType = '';
                $timeout(function () {
                    that.activeCiType = newVal;
                });
            }
        });


    }
})();
