/**
 * @ Author: chy
 * @ Create Time: 2022-12-14 10:25:50
 * @ Description:  
 */

'use strict';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
var escapeHTML = require('bpmn-js-properties-panel/lib/Utils').escapeHTML;

var domify = require('min-dom').domify,
  domQuery = require('min-dom').query;

var entryFieldDescription = require('bpmn-js-properties-panel/lib/factory/EntryFieldDescription');
var cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

var jobField = function (translate, options) {

  function ensureNotNull(prop) {
    if (!prop) {
      throw new Error(prop + ' must be set.');
    }

    return prop;
  }
    
  var setDefaultParameters = function (options) {

    // default method to fetch the current value of the input field
    var defaultGet = function (element) {
      var bo = getBusinessObject(element),
        res = {},
        prop = ensureNotNull(options.modelProperty);
      res[prop] = bo.get(prop);

      return res;
    };

    // default method to set a new value to the input field
    var defaultSet = function (element, values) {
      var res = {},
        prop = ensureNotNull(options.modelProperty);
      if (values[prop] !== '') {
        res[prop] = values[prop];
      } else {
        res[prop] = undefined;
      }

      return cmdHelper.updateProperties(element, res);
    };

    // default validation method
    var defaultValidate = function () {
      return {};
    };

    return {
      id: options.id,
      description: (options.description || ''),
      get: (options.get || defaultGet),
      set: (options.set || defaultSet),
      validate: (options.validate || defaultValidate),
      html: ''
    };
  };
  
  // Default action for the button next to the input-field
  var defaultButtonAction = function (element, inputNode) {
    var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
    input.value = '';

    return true;
  };

  // default method to determine if the button should be visible
  var defaultButtonShow = function (element, inputNode) {
    var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);

    return input.value !== '';
  };

  var resource = setDefaultParameters(options),
    label = options.label || resource.id,
    dataValueLabel = options.dataValueLabel,
    buttonLabel = (options.buttonLabel || 'X'),
    actionName = (typeof options.buttonAction != 'undefined') ? options.buttonAction.name : 'clear',
    actionMethod = (typeof options.buttonAction != 'undefined') ? options.buttonAction.method : defaultButtonAction,
    showName = (typeof options.buttonShow != 'undefined') ? options.buttonShow.name : 'canClear',
    showMethod = (typeof options.buttonShow != 'undefined') ? options.buttonShow.method : defaultButtonShow,
    canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
    canBeHidden = !!options.hidden && typeof options.hidden === 'function',
    description = options.description;

  resource.html =
    domify('<label for="camunda-' + escapeHTML(resource.id) + '" ' +
      (canBeDisabled ? 'data-disable="isDisabled" ' : '') +
      (canBeHidden ? 'data-show="isHidden" ' : '') +
      (dataValueLabel ? 'data-value="' + escapeHTML(dataValueLabel) + '"' : '') + '>' + escapeHTML(label) + '</label>' +
      '<div class="bpp-field-wrapper" ' +
      (canBeDisabled ? 'data-disable="isDisabled"' : '') +
      (canBeHidden ? 'data-show="isHidden"' : '') +
      '>' +
      `<jao-job-selector the-model="$ctrl.jobId" show-edit="false"></jao-job-selector>` +
      `<button ng-click="$ctrl.clear()" class="btn btn-default">X</button>` +
      // `<input ng-model="$ctrl.jobId" id="camunda-${escapeHTML(resource.id)}" type="hidden" name="${escapeHTML(options.modelProperty)}"/>` +
      // '<button class="action-button ' + escapeHTML(actionName) + '" data-action="' + escapeHTML(actionName) + '" data-show="' + escapeHTML(showName) + '" ' +
      // (canBeDisabled ? 'data-disable="isDisabled"' : '') +
      // (canBeHidden ? ' data-show="isHidden"' : '') + '>' +
      // '<span>' + escapeHTML(buttonLabel) + '</span>' +
      // '</button>' +
      '</div>');

  // add description below text input entry field
  if (description) {
    resource.html.appendChild(entryFieldDescription(translate, description, {
      show: canBeHidden && 'isHidden'
    }));
  }

  resource[actionName] = actionMethod;
  resource[showName] = showMethod;

  if (canBeDisabled) {
    resource.isDisabled = function () {
      return options.disabled.apply(resource, arguments);
    };
  }

  if (canBeHidden) {
    resource.isHidden = function () {
      return !options.hidden.apply(resource, arguments);
    };
  }

  resource.cssClasses = ['bpp-textfield'];

  return resource;
};

module.exports = jobField;
