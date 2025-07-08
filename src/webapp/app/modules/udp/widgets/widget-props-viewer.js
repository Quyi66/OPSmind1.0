/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/17/2017
 */
(function () {
    'use strict';
    angular.module('oplus.udp').component('udpWidgetPropsViewer', {
        bindings: {
            theModel: '=',
            options: '<'
        },
        templateUrl: 'app/modules/udp/widgets/widget-props-viewer.html',
        controller: ['$filter', '$scope','$translate', function ($filter, $scope,$translate) {
            var that = this;
            this.model = {};
            this.edit = edit;
            this.save = save;
            this.cancel = cancel;
            this.refresh = refresh;
            $scope.$watch('$ctrl.model.json', function (newVal, oldVal) {
                if (newVal) {
                    save();
                }
            });

            function refresh() {
                that.model.json = $filter('json')(that.theModel);
            }

            function edit() {
                if (confirm($translate.instant('udp.wc.props.edit_confirm'))) {
                    refresh();
                    // that.toRefresh = true;
                    that.editMode = true;
                }
            }

            function save() {
                var theModel = JSON.parse(that.model.json);
                // Do not use = because it will change the object reference
                // this.theModel = theModel;
                Object.keys(that.theModel).forEach(function (k) {
                    delete that.theModel[k];
                });
                _.assign(that.theModel, theModel);
            }

            function cancel() {
                that.editMode = false;
            }
        }]
    });
})();
