import { isAny } from 'bpmnlint-utils'
import translate from '../../i18n-bpmn/customTranslate'

export default function() {
  function check(node, reporter) {
    if (!isAny(node, [
      'bpmn:Task',
      'bpmn:Gateway'
    ]) || node.triggeredByEvent) {
      return
    }

    const incoming = node.incoming || []
    const outgoing = node.outgoing || []

    if (!incoming.length || !outgoing.length) {
      reporter.report(node.id, translate('Lint-No Disconnected'))
    }
  }

  return {
    check
  }
}
