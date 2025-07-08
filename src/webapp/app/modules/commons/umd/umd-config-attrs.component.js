/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/25, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdConfigAttrs
     * @description
     * Term umd stands for Universal Modeled Data.
     * This component is to configure model attributes.
     *
     * - [Custom component develop reference](https://www.bennadel.com/blog/2964-formatting-and-parsing-custom-ngmodel-bindings-in-angularjs.htm)
     * - [ngModel.NgModelController](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController)
     *
     * ```html
     * <umd-config-attrs ng-model="[{code:string,title:string,input:{}}]"
     *                   options="{placement:string}"/>
     * @param {[]} ngModel Two-way binding of array of attributes
     * ```
     * TODO:
     * - Always allowInvalid
     *
     */
    angular.module('oplus.commons').component('umdConfigAttrs', {
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            modelAttrs: '=ngModel',
            options: '<',
            registerInstance: '&'
        },
        templateUrl: 'app/modules/commons/umd/umd-config-attrs.component.html',
        controller: ['$scope', '$element', 'messageService', 'udmUtil', '$translate', UmdConfigAttrsCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {messageService} messageService
     * @param {udmUtil} udmUtil
     */
    function UmdConfigAttrsCtrl($scope, $element, messageService, udmUtil, $translate) {
        var that = this;
        var USE_NGMODEL_CTRL = true;
        var USE_DEBUG = false;
        this.clickAttr = clickAttr;
        this.addAttr = addAttr;
        this.deleteAttr = deleteAttr;
        this.addAttrGroup = addAttrGroup;
        this.deleteAttrGroup = deleteAttrGroup;
        this.renameAttrGroup = renameAttrGroup;
        this.doRenameAttrGroup = doRenameAttrGroup;
        this.cancelRenameAttrGroup = cancelRenameAttrGroup;
        this.sortableOptions = {connectWith: '.js-sortable-container', handle: '.js-attr-sort-handle'}
        this.$onInit = onInit;
        this.$onDestroy = onDestroy;
        if (!USE_NGMODEL_CTRL) {
            this.registerInstance({
                $instance: {
                    validateData: function () {
                        return validateAttrCode(that.modelAttrs, that.groupedAttrs);
                    }
                }
            });
        }

        function onInit() {
            if (USE_NGMODEL_CTRL) {
                // When the ngModel / $modelValue value needs to be synchronized
                // into the $viewValue / input control, it is passed through a
                // collection of formatters (in reverse order) before the $render()
                // method is invoked.
                // --
                // ngModel --> $modelValue --> Formatters --> $viewValue --> $render().
                that.ngModelCtrl.$formatters.push(formatInput);
                that.ngModelCtrl.$render = renderViewValue;
                // When the $viewValue change is emitted, it is run through a
                // collection of parsers (in order) before the value is saved to the
                // $modelValue and synchronized out to the ngModel binding.
                // --
                // Widget --> $viewValue --> Parsers --> Validators? --> $modelValue --> ngModel.
                that.ngModelCtrl.$parsers.unshift(parseOutput);
                // If the validity changes to invalid, the model will be set to undefined, unless ngModelOptions.allowInvalid is true.
                // that.ngModelCtrl.$options = that.ngModelCtrl.$options || {};
                // that.ngModelCtrl.$$setOptions({allowInvalid:true});
                // console.log('========',that.ngModelCtrl);
                // $element.attr('ng-model-options',{allowInvalid:true});
                // Always allow invalid, NOT work
                // that.ngModelCtrl.$options.allowInvalid = true;
                // console.log('........',that.ngModelCtrl);
                // If invalid, css class `ng-invalid ng-invalid-attr-code` will be added to element
                that.ngModelCtrl.$validators.attrCode = function (modelValue, viewValue) {
                    return validateAttrCode(modelValue, viewValue);
                };
                $scope.$watch('$ctrl.groupedAttrs', function (newVal, oldVal) {
                    if (USE_DEBUG)
                        console.log('watch_groupedAttrs');
                    if (newVal === oldVal) return;
                    // LEO: Use copy to break the reference and provide new reference for viewValue.
                    // Thus $viewValue change is emitted then parsers will be called.
                    that.ngModelCtrl.$setViewValue(angular.copy(newVal));
                    // if (that.options.placement) {
                    // var placement = $(that.options.placement);
                    // if (placement.length > 0)
                    //     $element.find('#js-uac-attr-card').appendTo(placement);
                    // }
                }, true);
            } else {
                var inited = false;
                var unregister = $scope.$watch('$ctrl.modelAttrs', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    if (!newVal) {
                        return;
                    }
                    unregister();
                    inited = true;
                    that.groupedAttrs = udmUtil.groupModelAttrs(that.modelAttrs);
                });
                $scope.$watch('$ctrl.groupedAttrs', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    if (!inited || !newVal) {
                        return;
                    }
                    validateAttrCode(that.modelAttrs, that.groupedAttrs);
                    that.modelAttrs = parseOutput(that.groupedAttrs);
                }, true);
            }
            // $(document).on('click.attrsconfig', function (e) {
            //     var target = $(e.target);
            //     var isOutside = target.closest('umd-config-attrs').length < 1;
            //     if (isOutside) {
            //         return;
            //     }
            //     //https://stackoverflow.com/a/7385673/1524900
            //     var container = $element;
            //     // if the target of the click isn't the container nor a descendant of the container
            //     if (!container.is(e.target) && container.has(e.target).length === 0) {
            //         $scope.$apply(function () {
            //             removeActive();
            //             that.activeModelAttr = undefined;
            //         });
            //     }
            // });
        }

        function onDestroy() {
            $(document).off('click.attrsconfig');
        }

        /**
         * https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#$render
         * Called when the view needs to be updated.
         * The $render() method is invoked in the following situations:
         * The value referenced by ng-model is changed programmatically and both the $modelValue and
         * the $viewValue are different from last time.
         * Since ng-model does not do a deep watch, $render() is only invoked if the values of $modelValue
         * and $viewValue are actually different from their previous values. If $modelValue or $viewValue
         * are objects (rather than a string or number) then $render() will not be invoked if you only change
         * a property on the objects.
         */
        function renderViewValue() {
            if (USE_DEBUG)
                console.log('renderViewValue()...');
            that.groupedAttrs = that.ngModelCtrl.$viewValue;
        }

        function formatInput(modelValue) {
            if (USE_DEBUG)
                console.log('formatInput()...', {modelValue: modelValue});
            if (!modelValue) return modelValue;
            return udmUtil.groupModelAttrs(modelValue);
        }

        function parseOutput(groupedAttrs) {
            if (USE_DEBUG)
                console.log('parseOutput()...');

            // that.ngModelCtrl.$validate();
            var result = [];
            var array = groupedAttrs;
            // if (!USE_NGMODEL_CTRL) {
            array = angular.copy(groupedAttrs);
            // }
            array.forEach(function (ga) {
                result.push({type: 'group', title: ga.group});
                ga.attrs.forEach(function (attr) {
                    Object.keys(attr).forEach(function (key) {
                        if (key.indexOf('__') === 0) {
                            delete attr[key];
                        }
                    });
                    result.push(attr);
                });
            });
            return result;
        }

        function renameAttrGroup(group) {
            that.groupInEdit = group;
            that.newGroupName = group;
        }

        function cancelRenameAttrGroup(group) {
            that.groupInEdit = undefined;
        }

        function doRenameAttrGroup(group) {
            var theGroup = _.find(that.groupedAttrs, {group: group});
            theGroup.group = that.newGroupName;
            that.groupInEdit = undefined;
        }

        function deleteAttr(attr) {
            that.groupedAttrs.forEach(function (ga) {
                _.remove(ga.attrs, function (o) {
                    return attr.code === o.code || (!attr.code && !o.code);
                });
            });
        }

        function deleteAttrGroup(group) {
            var theGroup = _.find(that.groupedAttrs, {group: group});
            var error;
            if (theGroup.attrs) {
                var internals = _.filter(theGroup.attrs, {internal: true});
                if (internals.length > 0) {
                    error = _.map(internals, function (o) {
                        return '<code>' + (o.title || o.code) + '[' + o.code + ']' + '</code>';
                    }).join(',')
                    error = $translate.instant('common.umd_config.internal_properties') + error + $translate.instant('common.umd_config.move_group')
                }
            }
            if (error) {
                messageService.alertError($translate.instant('common.umd_config.unable_to_delete'), error);
            } else {
                messageService.confirm($translate.instant('common.umd_config.delete_group'), $translate.instant('common.umd_config.delete_group_properties'), function () {
                    _.remove(that.groupedAttrs, function (o) {
                        return o.group === group;
                    })
                })
            }
        }

        function removeActive() {
            that.groupedAttrs.forEach(function (ga) {
                ga.attrs.forEach(function (o) {
                    delete o.__active;
                });
            });
        }

        function clickAttr(attr) {
            removeActive();
            attr.__active = true;
            that.activeModelAttr = attr;
        }

        /**
         *
         * @returns {boolean} True if data is valid
         */
        function validateAttrCode(modelAttrs, groupedAttrs) {
            if (USE_DEBUG)
                console.log('validateData');
            if (!groupedAttrs) {
                return true;
            }
            var codes = [];
            that.errorsByAttr = {};
            groupedAttrs.forEach(function (ga) {
                ga.attrs.forEach(function (attr) {
                    if (!attr.code) {
                        setAttrError(attr.code, 'code', $translate.instant('common.umd_config.input_properties_code'))
                    } else if (codes.indexOf(attr.code) > -1) {
                        setAttrError(attr.code, 'code', $translate.instant('common.umd_config.properties_code_not_unique'));
                    }
                    codes.push(attr.code);
                });
            });
            return _.isEmpty(that.errorsByAttr);

            /**
             * Add an attribute error.
             * @param {string} attrCode Code of attribute
             * @param {string} errorField Field name with error
             * @param {string} errorMsg Error message
             */
            function setAttrError(attrCode, errorField, errorMsg) {
                var error = that.errorsByAttr[attrCode];
                if (!error) {
                    error = {};
                    that.errorsByAttr[attrCode] = error;
                }
                error[errorField] = errorMsg;
            }
        }

        /**
         * Add attribute to group
         * @param {string} group
         */
        function addAttr(group) {
            var theGroup = _.find(that.groupedAttrs, {group: group});
            that.activeModelAttr = {code: null, title: null, input: {}};
            theGroup.attrs.push(that.activeModelAttr);
            clickAttr(that.activeModelAttr);
        }

        /**
         *
         * @param {string=} groupName
         */
        function addAttrGroup(groupName) {
            groupName = groupName || $translate.instant('common.umd_config.new_group');
            var allGroupNames = _.map(that.groupedAttrs, 'group');
            var count = 0;
            var postfix = '';
            var newGroupName;
            while (true) {
                if (count > 0) {
                    postfix = '(' + count + ')';
                }
                newGroupName = groupName + postfix;
                if (allGroupNames.indexOf(newGroupName) < 0) {
                    break;
                }
                count++;
            }
            that.groupedAttrs.forEach(function (ga) {
                ga.__collapsed = true;
            });
            that.groupedAttrs.push({group: newGroupName, attrs: [], __isNew: true});
        }
    }
})();
