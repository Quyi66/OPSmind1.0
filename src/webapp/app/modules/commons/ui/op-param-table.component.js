/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/5/25, created
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name opParamTable
     * @description
     * ```html
     * <op-param-table param-list="">
     * ```
     */
    angular.module('oplus.commons').component('opParamTable', {
        bindings: {
            paramList: '='
        },
        templateUrl: 'app/modules/commons/ui/op-param-table.html',
        controller: ['$scope', '$element', opParamTableCtrl]
    });


    /**
     *
     */
    function opParamTableCtrl($scope, $element) {
        var that = this;
        this.addParam = addParam;
        this.removeParam = removeParam;
        this.isArray = angular.isArray(this.paramList);
        this.theParamList = unifyData(this.paramList);
        this.paramTypeList = [
            {type: 'string', title: $translate.instant('common.entity.variable.string')},
            {type: 'string_pwd', title: $translate.instant('common.entity.variable.string_pwd')},
            {type: 'number', title: $translate.instant('common.entity.variable.number')},
            {type: 'date', title: $translate.instant('common.entity.variable.date')},
            {type: 'boolean', title: $translate.instant('common.entity.variable.boolean')},
            {type: 'array', title: $translate.instant('common.entity.variable.array')},
            {type: 'host', title: $translate.instant('common.entity.variable.host')}
        ];
        if (!this.isArray) {
            $scope.$watch('$ctrl.theParamList', function (newVal, oldVal) {
                if (newVal) {
                    that.paramList = {};
                    newVal.forEach(function (param) {
                        var copy = angular.copy(param);
                        delete copy.name;
                        that.paramList[param.name] = copy;
                    });
                }
            },true);
        }

        function unifyData(paramList) {
            if (angular.isArray(paramList)) {
                return paramList;
            } else if (angular.isObject(paramList)) {
                var list = [];
                Object.keys(paramList).forEach(function (key) {
                    var param = angular.copy(paramList[key]);
                    param.name = key;
                    list.push(param);
                });
                return list;
            }
            throw new Error('ProgramError: Unsupported param ' + JSON.stringify(paramList));
        }

        function addParam() {
            that.theParamList.push({});
        }

        function removeParam(index) {
            that.theParamList.splice(index,1);
        }
    }
})();
