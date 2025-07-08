/**
 * @ Author: chy
 * @ Create Time: 2023-04-25 19:59:54
 * @ Description:  
 */

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import utils from 'bpmn-js-properties-panel/lib/Utils'
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper'

/**
 * 
 * @param {*} group 
 * @param {*} element 
 * @param {*} translate 
 * @param {
 *  id: string,
 *  label: string,
 *  description: string || undefined,
 *  propName: string
 * } options 
 * @returns 
 */

export default function customSelectProps(group, element, translate, options) {
  if (!options) return;

  var label = options && options.label;
  var description = options && options.description;

  group.entries.push(entryFactory.selectBox(translate, {
    id: options.id || 'id',
    selectOptions: options.selectOptions || [ { name: '', value: '' } ],
    label: label && translate(label),
    description: description && translate(description),
    modelProperty: options.propName,
    getProperty: function (element) {
      return getBusinessObject(element)['modelProperty'];
    },
    setProperty: function (element, properties) {
      element = element.labelTarget || element;
      return cmdHelper.updateProperties(element, properties);
    }
  }));
}