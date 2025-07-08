/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/13, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name appletConfigAccess
     * @description
     * ```html
     * <applet-config-access ng-model="">
     * ```
     * @param {{}} ngModel
     */
    angular.module('oplus.commons').component('appletConfigAccess', {
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            theModel: '=ngModel'
        },
        templateUrl: 'app/modules/app/applet-config-access.component.html',
        controller: ['$scope', '$element', '$translate', 'messageService', AppletConfigAccessCtrl]
    });

    function AppletConfigAccessCtrl($scope, $element, $translate, messageService) {
        var that = this;
        var USER_BY_SYSTEM = 'SYSTEM';
        var USER_BY_MANUAL = 'MANUAL';
        // console.log('AppletConfigAccessCtrl: ngModel=%o', JSON.stringify(this.theModel));
        // this.theModel = this.theModel || {};
        this.$onInit = onInit;
        this.addRole = addRole;
        this.removeRole = removeRole;
        this.userMethods = [
            {value: USER_BY_SYSTEM, _title: $translate.instant('app.setting.ac.user_by_system')},
            {value: USER_BY_MANUAL, _title: $translate.instant('app.setting.ac.user_by_manual')}
        ]
        var defaultRoles = {
            ROLE_USER: {
                method: USER_BY_SYSTEM
            },
            ROLE_PRIVUSER: {
                method: USER_BY_SYSTEM
            },
            ROLE_DEVELOPER: {
                method: USER_BY_SYSTEM
            },
            ROLE_ADMIN: {
                method: USER_BY_SYSTEM
            }
        };

        function onInit() {
            // ngModel --> $modelValue --> Formatters --> $viewValue --> $render().
            // Widget --> $viewValue --> Parsers --> Validators? --> $modelValue --> ngModel.
            that.ngModelCtrl.$formatters.push(formatInput);
            that.ngModelCtrl.$render = renderViewValue;
            that.ngModelCtrl.$parsers.push(parseOutput);
            $scope.$watch('$ctrl.viewData', function (newVal, oldVal) {
                if (!newVal) return;
                // Custom controls might also pass objects to this method.
                // In this case, we should make a copy of the object before passing it to $setViewValue.
                // This is because ngModel does not perform a deep watch of objects,
                // it only looks for a change of identity.
                that.ngModelCtrl.$setViewValue(angular.copy(newVal));
            }, true)
        }

        function renderViewValue() {
            that.viewData = that.ngModelCtrl.$viewValue;
        }

        function formatInput(modelValue) {
            if (!modelValue) {
                return;
            }
            var allRoles = _.merge({}, defaultRoles, modelValue.roles);
            var viewValue = {roles: []};
            Object.keys(allRoles).forEach(function (roleName) {
                var role = _.merge({name: roleName}, allRoles[roleName]);
                if (defaultRoles[roleName]) {
                    role._builtin = true;
                }
                viewValue.roles.push(role);
            });
            return viewValue;
        }

        /**
         *
         * @param {{roles:[{name:string,method:string,users:[string]}]}} viewValue
         * @return {{roles: {"ROLE_NAME":{method:string,users:[string]}}}}
         */
        function parseOutput(viewValue) {
            var modelValue = {roles: {}};
            viewValue.roles.forEach(function (role) {
                modelValue.roles[role.name] = {method: role.method, users: role.users};
            });
            return modelValue;
        }

        /**
         *
         * @param {string} roleName
         */
        function removeRole(roleName) {
            messageService.confirm('Remove', 'Remove the role?', function () {
                _.remove(that.viewData.roles, {name: roleName});
            });
        }

        function addRole() {
            var role = {name: 'NEW_ROLE', method: USER_BY_MANUAL};
            var find = _.find(that.viewData.roles, {name: role.name});
            if (!find) {
                that.viewData.roles.push(role);
            }
        }
    }
})();
