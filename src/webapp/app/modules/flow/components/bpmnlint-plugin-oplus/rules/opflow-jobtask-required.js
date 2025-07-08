const {
  is,
  isAny
} = require('bpmnlint-utils')/** * A rule that checks for the presence of a start event per scope. */
const find = require('lodash/find')

module.exports = function() {
  function hasOpflowTask(node) {
    const flowElements = node.flowElements || []
    return flowElements.some(node => {
      if (is(node, 'bpmn:ServiceTask') && node.type === 'external' && node.topic) {
        return true
      }
    })

  }

  function check(node, reporter) {
    if (!isAny(node, [
      'bpmn:Process'
    ])) {
      return
    }

    if (!hasOpflowTask(node)) {
      const type = 'Process'
      reporter.report(node.id, type + ' 缺少任务节点')
    }
  }

  return { check }
}
