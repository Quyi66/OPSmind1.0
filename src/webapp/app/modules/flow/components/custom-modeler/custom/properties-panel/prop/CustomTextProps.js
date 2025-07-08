/**
 * @ Author: chy
 * @ Create Time: 2022-12-02 17:40:32
 * @ Description:  
 */

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import utils from 'bpmn-js-properties-panel/lib/Utils'
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper'

export default function customTextProps(group, element, translate, options) {
  if (!options) {
    options = {};
  }

  var label = options && options.label;
  var description = options && options.description;

  // Id
  group.entries.push(entryFactory.textField(translate, {
    id: options.id || '',
    label: label && translate(label),
    description: description && translate(description),
    modelProperty: options.propName,
    disabled: function (shape, element) {
      options.disabled && $(element).find('button.action-button').remove();
      return options.disabled || false;
    },
    // getProperty: function (element) {
    //   return getBusinessObject(element)['modelProperty'];
    // },
    // setProperty: function (element, properties) {
    //   element = element.labelTarget || element;
    //   return cmdHelper.updateProperties(element, properties);
    // },

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return { [options.propName]: bo.get(options.propName) };
    },

    set: function(element, values, node) {
      var bo = getBusinessObject(element);
      return cmdHelper.updateBusinessObject(element, bo, {
        [options.propName]: values[options.propName]
      });
    },

    validate: options.validate || (() => true),
    // validate: function (element, values) {
    //   var value = values[model];
    //   var bo = getBusinessObject(element);
    //   var error = utils.isIdValid(bo, value, translate);

    //   return error && { id: idError } || {};
    // }
  }));
}