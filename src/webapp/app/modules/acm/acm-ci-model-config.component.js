/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/30, created
 */
(function () {
        'use strict';

        /**
         * @ngdoc component
         * @name acmCiModelEditor
         * @description
         * ```html
         * <acm-ci-model-editor cit-code="">
         * ```
         */
        angular.module('oplus.acm').component('acmCiModelEditor', {
            bindings: {
                citId: '=citId',
                pageId: '=pageId'
            },
            templateUrl: 'app/modules/acm/acm-ci-model-config.html',
            controller: ['$scope', '$element', '$http', 'restUtils', '$state', 'messageService', 'acmService', '$translate', acmCiModelEditorCtrl]
        });

        acmCiModelEditorCtrl.$inject = ['$scope', '$element', '$http', 'restUtils', '$state', 'messageService', '$translate', 'acmService'];

        /**
         *
         * @param $scope
         * @param $element
         * @param $http
         * @param restUtils
         * @param $state
         * @param messageService
         * @param acmService
         */
        function acmCiModelEditorCtrl($scope, $element, $http, restUtils, $state, messageService, acmService, $translate) {
            var that = this;
            var module = 'acm';
            that.save = save;
            that.go_back = go_back;
            that.internalAttr = internalAttr;
            that.SHOW_TEMPLATE = true;
            that.SHOW_DIV = true;
            that.DISABLE_CODE = false;

            that.CIT_LIST = [{"id": "0", "title": $translate.instant('acm.common.text.not_using_templates')}];
            that.VALIDATE_CODE_ERROR = true;

            acmService.getCitByTenant().then(function (result) {
                that.CIT_LIST = _.union(that.CIT_LIST, result);
            });

            that.IS_AUTO_MAP = [{'value': 1, 'label': $translate.instant('acm.common.text.support')}, {
                'value': 0,
                'label': $translate.instant('acm.common.text.not_support')
            }];
            if (that.citId) {
                that.SHOW_TEMPLATE = false;
                that.DISABLE_CODE = true;
                acmService.getCitByCITid(that.citId).then(function (result) {
                    that.modelConfig = result;
                });
            } else {
                that.modelConfig = {attrs: [], isAuto: 0, template_id: "0"};
            }

            function save(data) {
                acmService.saveAcmCIData(JSON.stringify(data)).then(function (result) {
                    go_back();
                    messageService.toast("success", $translate.instant('common.messages.operation.success'));
                }).catch(function (err) {
                    messageService.toast("error", $translate.instant('common.messages.operation.failed'), err);
                });
            }

            function go_back() {
                $state.go('app.appletwindow_acm.open_page', {pageId: that.pageId});
            }

            function internalAttr(isAuto) {
                if (isAuto === 1) {
                    $http.get('app/modules/acm/assets/internal-attrs.json').success(function (data) {
                        var inner_group = $translate.instant('acm.common.text.inner_group');
                        //console.log("inner_group", inner_group);
                        var find = _.find(that.modelConfig.attrs, function (a) {
                            return a.type === "group" && a.title === inner_group;
                        });
                        if (find) {
                            var result = [];
                            _.forEach(that.modelConfig.attrs, function (d) {
                                if (d.type === "group" && d.title === inner_group) {
                                    result = _.union(result, data);
                                } else {
                                    result.push(d);
                                }
                            });
                            that.modelConfig.attrs = result;
                        } else {
                            that.modelConfig.attrs = _.union(data, that.modelConfig.attrs)
                        }
                    }).error(function (err) {
                        throw err;
                    });
                } else {
                    $http.get('app/modules/acm/assets/internal-attrs.json').success(function (data) {
                        that.modelConfig.attrs = _.differenceWith(that.modelConfig.attrs, data, function (a, b) {
                            if (a.code && b.code) {
                                return a.code === b.code
                            }
                            return false;
                        });
                    }).error(function (err) {
                        throw err;
                    });
                }
            }

            function validation_code(code) {
                var reg = new RegExp("^[a-zA-Z0-9_]+$");
                return !reg.test(code);
            }

            $scope.$watch('$ctrl.modelConfig.template_id', function (newVal, oldVal) {
                if (!newVal) {
                    that.SHOW_DIV = true;
                } else {
                    that.SHOW_DIV = newVal === "0";
                }
            }, false);

            $scope.$watch('$ctrl.modelConfig.code', function (newVal, oldVal) {
                if (!newVal) {
                    that.VALIDATE_CODE_ERROR = true;
                } else {
                    that.VALIDATE_CODE_ERROR = validation_code(newVal);
                }
            }, false);

        }
    }

)();
