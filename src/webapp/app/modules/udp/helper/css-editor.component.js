/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 11/17/2017
 */
(function () {
    /**
     * @ngdoc component
     * @name udpCssEditor
     * @description
     * ```
     * <udp-css-editor the-model="string" options="{groups:string}"></udp-css-editor>
     * @param {string} theModel CSS list separated by space
     * @param {object} options
     * @param {string} options.groups Supported CSS groups separated by comma
     *
     * ```
     */
    angular.module('oplus.udp').component('udpCssEditor', {
        templateUrl: 'app/modules/udp/helper/css-editor.html',
        bindings: {
            theModel: '=',
            options: '<'
        },
        controller: ['$scope', '$element', 'themeService', CssEditorComponentCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {themeService} themeService
     * @constructor
     */
    function CssEditorComponentCtrl($scope, $element, themeService) {
        var that = this;
        var options = this.options || {};
        var cssDefs = themeService.getNamedCssDefs();
        this.selectedCss = {};
        this.toggleCss = toggleCss;
        this.availCssGroups = {};
        if (options.groups) {
            var groups = _.split(options.groups, ',');
            that.availCssGroups = _.filter(cssDefs, function (e) {
                return _.indexOf(groups, e.group) >= 0;
            });
        } else {
            that.availCssGroups = cssDefs;
        }

        if (this.theModel) {
            var cssList = this.theModel.split(' ');
            cssList.forEach(function (css) {
                that.selectedCss[css] = true;
            });
        }
        $scope.$watch('$ctrl.selectedCss', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                that.theModel = _.keys(that.selectedCss).join(' ');
            }
        }, true);
        $scope.$watch('$ctrl.theModel', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                that.selectedCss = {};
                if (!newVal) {
                } else {
                    that.theModel.split(' ').forEach(function (v) {
                        that.selectedCss[v] = true;
                    });
                }
            }
        });
        $scope.$onDestroy = function () {
            $element.off('*');
        };

        function toggleCss(css) {
            if (that.selectedCss[css]) {
                delete that.selectedCss[css];
            } else {
                that.selectedCss[css] = true;
            }
        }
    }
})();
