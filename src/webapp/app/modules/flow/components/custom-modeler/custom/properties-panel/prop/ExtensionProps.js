import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import jobField from '../entryFactory/JobEntryFactory'

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

var propName = 'opflow:jobId';
var scope = undefined;

export default function ExtensionProps(group, element, modeling, eventBus) {
  if (is(element, 'bpmn:ServiceTask')) {
    var options = {
      id: propName,
      description: '定义作业',
      label: '作业',
      modelProperty: propName
    }
    var field = jobField(null, options);

    group.entries.push(field);

    angular.element(document).injector().invoke(['$rootScope', '$compile', '$timeout', function ($rootScope, $compile, $timeout) {
      if (!scope) scope = $rootScope.$new();
      $compile(field.html)(scope);

      scope.$ctrl = {
        jobId: element.businessObject.$attrs[propName]
      }

      scope.$watch('$ctrl.jobId', function (n, o) {
        if (n && n !== o) modeling.updateProperties(element, {
          [propName]: n
        })
      })

      eventBus.on('element.click', (e) => {
      })
      
      scope.$on('$destroy', function (e) {
      })
    }]);

  }
}
