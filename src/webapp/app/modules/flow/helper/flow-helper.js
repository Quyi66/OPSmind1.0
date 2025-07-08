const { is, isAny } = require('bpmnlint-utils')

import taskTypeConstants from '../constants/task-type.constants'

var _is = (ele, type) => { return is(ele, type) || is(ele.businessObject, type) }

function hasOpflowTask(element) {
  return element.businessObject &&
    _is(element, 'bpmn:ServiceTask') &&
    element.businessObject.type === 'external' &&
    element.businessObject.topic
}

function getOpflowTaskType(element) {
  return Object.values(taskTypeConstants).find(f => element.id.indexOf(f) > -1);
}

function isTask(element, taskName) {
  return element.businessObject &&
    _is(element, 'bpmn:ServiceTask') &&
    element.businessObject.type === 'external' &&
    element.businessObject.topic &&
    element.id.indexOf(taskName) > -1
}

export default {
  is: _is,
  hasOpflowTask: hasOpflowTask,
  getOpflowTaskType: getOpflowTaskType,
  isTask: isTask,
};