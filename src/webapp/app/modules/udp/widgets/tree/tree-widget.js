/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/11/02
 */

(function () {
    'use strict';

    angular.module('oplus.udp')
      .run(['$timeout', 'widgetFactory', 'messageService', 'widgetDataUtil', 'widgetUiHelper', 'i18nService', 'widgetInteraction', treeWidget]);

    /**
     *
     * Widget属性定义在uw-props里面，规范
     *
     *
     * @param {$timeout} $timeout
     * @param {widgetFactory} widgetFactory
     * @param {messageService} messageService
     * @param {widgetDataUtil} widgetDataUtil
     * @param {widgetUiHelper} widgetUiHelper
     */
    function treeWidget($timeout, widgetFactory, messageService, widgetDataUtil, widgetUiHelper, i18nService, widgetInteraction) {
      widgetFactory.defineWidget({
        type: 'tree',
        group: 'data',
        // tag: 'dev',
        resizable: null,
        configController: TreeWidgetConfigCtrl,
        configHtmlFile: '',
        controlRenderer: {
          getTemplateForCompilation: getTemplateForCompilation,
          onReloadData: onReloadData,
          onInitControl: onInitControl
        }
      });

      function getModelName(props) {
        if (props.name)
          return '$widget.wParams["' + props.name + '"]';
        return '_unnamed_';
      }

      function getTemplateForCompilation(props) {
        var html = '<div>Please config tree</div>';
        if (!props.fields)
          return html;

        var el = angular.element('<opx-tree></opx-tree>');

        var attrs = angular.extend({}, props, {
          'ng-model': getModelName(props),
          'tree-config': 'treeConfig',
        });
        el.attr(attrs);

        el.after('<div ng-if="error">Tree nodes initialize failed, please check</div>');
        return el.prop('outerHTML');
      }

      function convertData(data, props) {
        var fields = props.fields;
        var map = {};
        var tree = [];
      
        for (var i = 0; i < data.length; i++) {
          var node = data[i];
          map[node[fields.id.field]] = Object.assign(
            {
              title: fields.text ? node[fields.text.field] : null,
              key: fields.value ? node[fields.value.field] : null,
              expanded: props.expanded || false
            }, node, { children: [] });
        }
      
        var values = Object.values(map);
        for (var i = 0; i < values.length; i++) {
          var node = values[i];
          if (node[fields.parent.field] == (props.root || null)) {
            tree.push(node);
          } else {
            map[node[fields.parent.field]].children.push(node);
          }
        }
      
        return tree;
      }

      /**
       * 可选的
       * 控件会监听widgetValues.events.WidgetEvent事件，
       * 当事件名称和控件的eventtorefresh或者dataset.eventtorefresh属性相同时，将调用此方法
       * @param {Scope} scope 当前Widget所在的scope
       * @param {jQuery} element 当前Widget的元素
       * @param {object} props 当前Widget的属性
       */
      function onReloadData(scope, element, props) {
        if (!props.fields) return;
        scope.treeConfig.data = getPromise(scope, element, props);
      }

      function getPromise(scope, element, props) {
        return function () { 
          return widgetDataUtil.queryData(element, props, scope).then(function (data) {
            return convertData(data.records, props);
          }).catch(function (err) {
            scope.error = true;
            console.error(err);
          });
        }
      }

      /**
       * 在这个方法中，可以做以下的事：
       * - 获取数据
       * - 初始化控件，比如jQuery控件
       * - 监听事件
       * @param {Scope} scope 当前Widget所在的scope
       * @param {jQuery} element 当前Widget的元素
       * @param {Object} props 当前Widget的配置属性
       */
      function onInitControl(scope, element, props) {
        scope.treeConfig = {
          dataAlgorithm: 'Normal',
          selector: props.selector || 'single',
          onClickNode: function (param) {
            
          }
        }
        var modelName = getModelName(props);

        scope.$watch(modelName, function (newVal, oldVal) {
          // console.log('>>>$watch', {modelName: modelName, newVal: newVal, oldVal: oldVal});
          if (_.isEqual(newVal, oldVal))
            return;
          var paramName = props.name,
            paramValue = !props.selector ? newVal[0] : newVal;
          if (angular.isDefined(paramName)) {
            scope.$widget.$pageScope.pageParams[paramName] = paramValue;
            //20200427 TODO: there is problem with file type with ngf-select: Illegal Invocation
            if (paramValue instanceof File) {
              return;
            }
            var params = {};
            params[paramName] = paramValue;
            // console.log('changePageParams', {newVal: newVal, oldVal: oldVal});
            widgetInteraction.changePageParams(scope, {
              changeUrl: props.changeUrl,
              _source: element.attr('id'),
              event: props.eventbychange,
              // LEO@20210722: Do not evaluate parameter value,
              // otherwise params {"foo:"1"} will be evaluated to `{"foo":1}`
              paramValueAsJson: false,
              params: params
            }, null);
            if (props.eventbychange) {
              scope.$widget.fireWidgetEvent(props.eventbychange);
            }
          }
        });

        return onReloadData(scope, element, props);
      }

      /**
       *
       * @param {Scope} scope  配置页面的Scope
       * @param {Object} props Widget的配置属性
       */
      function TreeWidgetConfigCtrl(scope, props) {
        var attrs = [
          { name: 'id' },
          { name: 'parent' },
          { name: 'text' },
          { name: 'value' },
        ];
        i18nService.translateWithPrefixAndKey(attrs, 'udp.w.tree.config.', 'name', 'title');
        scope.attrs = attrs;
      }
    }
  }

)();