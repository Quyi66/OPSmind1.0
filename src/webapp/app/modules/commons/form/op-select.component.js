/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/04/08
 * TODO: in development
 */
(function () {
    angular.module('oplus.commons').component('opSelect', {
        templateUrl: 'app/modules/commons/form/op-select.html',
        bindings: {
            theModel: '=',
            multiple: '<',
            optionGroups: '<'
        },
        controller: ['$scope', '$element', OpSelectComponentCtrl]
    });

    function OpSelectComponentCtrl($scope, $element) {
        var isMultipleSelect = $element.attr('multiple') !== undefined;
        var that = this;

        this.selectedItems = {};
        this.toggleSelect = toggleSelect;

        var preSelects = this.theModel || [];
        preSelects.forEach(function (css) {
            that.selectedItems[css] = true;
        });
        $element.on('click', '.dropdown-menu', function (e) {
            // Don't close dropdown when click inside
            // https://stackoverflow.com/questions/25089297/avoid-dropdown-menu-close-on-click-inside/25196101#25196101
            e.stopPropagation();
        });
        $scope.$watch('$ctrl.selectedItems', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                // that.theModel = _.keys(that.selectedItems).join(' ');
                that.theModel = _.keys(that.selectedItems);
            }
        }, true);
        $scope.$watch('$ctrl.theModel', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                that.selectedItems = {};
                if (!newVal) {
                } else {
                    that.theModel.forEach(function (v) {
                        that.selectedItems[v] = true;
                    });
                }
            }
        });
        $scope.$onDestroy = function () {
            $element.off('*');
        };

        function toggleSelect(css) {
            if (that.selectedItems[css]) {
                delete that.selectedItems[css];
            } else {
                that.selectedItems[css] = true;
            }
        }
    }
})();
