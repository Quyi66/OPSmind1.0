/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/29/2017
 */
(function () {
    /**
     * @ngdoc component
     * @description
     * Configuration for widget interaction.
     *
     * ````html
     * <udp-widget-config-interaction the-model="" param-vars="" options=""/>
     * ````
     * @param {object} theModel Two-way binding to interaction properties
     * @param {{var_name:string}=} paramVars Names and descriptions for allowed variables
     * @param {object} options
     * @param {string} options.label
     * @param {string} options.supports Supported actions in comma separated string.
     * See  {@link widgetInteraction#ACTIONS}
     */
    angular.module('oplus.udp').component('udpWidgetConfigInteraction', {
        bindings: {
            props: '=theModel',
            paramVars: '<',
            options: '<'
        },
        templateUrl: 'app/modules/udp/widgets/widget-config-interaction.html',
        controller: ['$scope', '$element', '$translate', 'widgetDataInterface', 'widgetInteraction', 'messageService', WidgetConfigInteractionCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param $translate
     * @param {widgetDataInterface} widgetDataInterface
     * @param {widgetInteraction} widgetInteraction
     * @param {messageService} messageService
     */
    function WidgetConfigInteractionCtrl($scope, $element, $translate, widgetDataInterface, widgetInteraction, messageService) {
        var that = this,
            actions;
        this.props = this.props || {};
        this.varList = [];
        this.actionDefs = widgetInteraction.actionDefs;
        this.availableActions = [];
        this.options = this.options || {};
        this.removeAction = removeAction;
        this.addAction = addAction;
        this.sortableOptions = {
            handle: '.op-drag-handle',
            placehodler: 'ui-sortable-placeholder',
            'ui-floating': true
        };
        var supports = this.options.supports || '';
        this.$onInit = onInit;

        function onInit() {
            $element.addClass('h-100 d-block form-horizontal op-smartform')
            // console.log('supports',supports,this.actionDefs);
            Object.keys(that.actionDefs).forEach(function (action) {
                if (supports.indexOf(action) >= 0)
                    that.availableActions.push({
                        key: action,
                        title: that.actionDefs[action].title,
                        icon: that.actionDefs[action].icon,
                        isUsed: false
                    });
            });

            actions = that.props.actions;
            if (actions && actions.length > 0) {
                that.currentAction = actions[0];
            }
            Object.keys(that.paramVars || {}).forEach(function (k) {
                that.varList.push({name: k, desc: that.paramVars[k]});
            });
            // console.log(this.supportedVars);
            widgetDataInterface.findAllPagesInfo().then(function (pages) {
                that.pages = pages;
            }).catch(function (err) {
                throw err;
            });

            $scope.$watch('$ctrl.props.actions', function (newVal, oldVal) {
                that.availableActions.forEach(function (action) {
                    action.isUsed = !!(that.props.actions && that.props.actions.indexOf(action.key) >= 0);
                });
                that.hasAvailableAction = !!(_.find(that.availableActions, {isUsed: false}));
            }, true);
        }

        function removeAction(action) {
            messageService.confirmDanger($translate.instant('common.action.delete'), $translate.instant('udp.wc.intx.remove_action_confirm'), function () {
                var index = _.findIndex(that.props.actions, function (o) {
                    return o === action;
                });
                if (index > -1) {
                    that.props.actions.splice(index, 1);
                    delete that.props[action];
                    if (that.props.actions.length === 0) {
                        that.currentAction = undefined;
                    } else {
                        that.currentAction = that.props.actions[Math.max(0, index - 1)];
                    }
                }
            });
        }

        function addAction(action) {
            that.currentAction = action;
            that.props.actions = that.props.actions || [];
            that.props.actions.push(action);
        }
    }
})();
