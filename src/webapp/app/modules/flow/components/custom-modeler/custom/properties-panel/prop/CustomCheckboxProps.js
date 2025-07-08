/**
 * @ Author: chy
 * @ Create Time: 2023-04-10 18:00:27
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

export default function customCheckboxProps(group, element, translate, options) {
  if (!options) return;

  var label = options && options.label;
  var description = options && options.description;

  group.entries.push(entryFactory.checkbox(translate, {
    id: options.id || 'id',
    label: label && translate(label),
    description: description && translate(description),
    modelProperty: options.propName,
    get: function (element) {
      var val = getBusinessObject(element).get(options.propName),
        res = {};

      if (typeof val === 'string') val = (val === 'true');
      res[options.propName] = val;

      return res;
    }
    // setProperty: function (element, properties) {
    //   element = element.labelTarget || element;
    //   return cmdHelper.updateProperties(element, properties);
    // }
  }));
}