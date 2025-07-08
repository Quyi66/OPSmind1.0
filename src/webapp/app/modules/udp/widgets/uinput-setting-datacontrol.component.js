/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/08/28, extracted from `uinput-setting-basic.component.js`
 */
(function () {
    /**
     * @ngdoc component
     * @description
     * Configure data and view control.
     * ```html
     * <uinput-setting-datacontrol ng-model="" options={}/>
     * ```
     * @param {object} props Two-way binding
     */
    angular.module('oplus.udp').component('uinputSettingDatacontrol', {
        bindings: {
            props: '=ngModel',
            options: '<'
        },
        templateUrl: 'app/modules/udp/widgets/uinput-setting-datacontrol.html',
        controller: ['$scope', '$translate', '$element', 'restUtils', 'messageService', '$timeout', 'uinputHelper', UinputSettingDctCtrl]
    });

    /**
     * @param $scope
     * @param $element
     * @param {restUtils} restUtils
     * @param {messageService} messageService
     * @param $timeout
     */
    function UinputSettingDctCtrl($scope, $translate, $element, restUtils, messageService, $timeout, uinputHelper) {
        var that = this;
        uinputHelper.upgrade();
        that.hasControlOptions = false;
        this.$onInit = onInit;

        function datatypesByControl(control, ismultiple) {
            var datatypes = [];
            datatypes.push({value: ''});
            datatypes.push({value: 'string'});
            datatypes.push({value: 'json'});
            if (control === 'input') {
                datatypes.push({value: 'number'});
            }
            if (control === 'input' || control === 'datepicker') {
                datatypes.push({value: 'date'});
            }
            var isMultiSelect = control === 'checkbox' || (control === 'select' && ismultiple);
            if (control === 'input' || control === 'device' || isMultiSelect) {
                datatypes.push({value: 'array'});
            }
            datatypes.forEach(function (o) {
                o.label = $translate.instant(!o.value ? 'common.term.default' : 'common.datatype.' + o.value);
            })
            return datatypes;
        }

        function onInit() {

            $scope.$watch('$ctrl.props', function (newVal, oldVal) {
                if (!newVal) return;
                that.availDatatypes = datatypesByControl(newVal.control, newVal.ismultiple);
            }, true);
            $scope.$watch('$ctrl.props.control', function (newVal, oldVal) {
                // if (!newVal) return;
                $timeout(function () {
                    var elem = $('.js-control-options', $element);
                    if (elem) {
                        that.hasControlOptions = elem.text().trim().length > 0;
                    }
                });
                if (newVal === 'device' && !that.cits) {
                    initAutoCIType('select');
                }
            });

            //TODO: 紧耦合代码
            function initAutoCIType(type) {
                restUtils.callApi('acm', 'GET', '/api/acm/cit/get/all/{type}', {type: type}).then(function (data) {
                    that.ciTypes = data;
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant('common.term.error'), err.message);
                })
            }
        }
    }
})();