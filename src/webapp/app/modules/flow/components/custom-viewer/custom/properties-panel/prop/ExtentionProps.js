import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

export default function (group, element) {
  if (is(element, 'bpmn:ServiceTask')) {
    group.entries.push(entryFactory.textField(null, {
      id: 'name',
      description: '权限的标题',
      label: '标题',
      modelProperty: 'name'
    }));
  }
}