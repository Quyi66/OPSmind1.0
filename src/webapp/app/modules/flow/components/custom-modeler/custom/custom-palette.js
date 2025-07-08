/**
 * @author chy, created on 2022-06-30.
 */

/* eslint-disable lines-around-comment */
/* eslint-disable one-var */
import {
  assign
} from 'min-dash'

var Ids = require('ids')['default']

/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
export default function PaletteProvider(bpmnFactory, palette, create, elementFactory, spaceTool, lassoTool, handTool,
  globalConnect, translate) {
  this._bpmnFactory = bpmnFactory
  this._palette = palette
  this._create = create
  this._elementFactory = elementFactory
  this._spaceTool = spaceTool
  this._lassoTool = lassoTool
  this._handTool = handTool
  this._globalConnect = globalConnect
  this._translate = translate
  palette.registerProvider(this)
}

PaletteProvider.$inject = [
  'bpmnFactory',
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
]

PaletteProvider.prototype.getPaletteEntries = function (element) {
  var actions = {},
    bpmnFactory = this._bpmnFactory,
    create = this._create,
    elementFactory = this._elementFactory,
    spaceTool = this._spaceTool,
    lassoTool = this._lassoTool,
    handTool = this._handTool,
    globalConnect = this._globalConnect,
    translate = this._translate

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options))

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded
      }

      create.start(event, shape)
    }

    var shortType = type.replace(/^bpmn:/, '')
    return {
      group: group,
      className: className,
      title: translate(title || 'Create ' + shortType),
      action: {
        dragstart: createListener,
        click: createListener
      }
    }
  }

  function createParticipant(event, collapsed) {
    create.start(event, elementFactory.createParticipantShape(collapsed))
  }

  function createSubprocess(event) {
    var subProcess = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 0,
      y: 0,
      isExpanded: true
    })

    var startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 40,
      y: 82,
      parent: subProcess
    })

    create.start(event, [subProcess, startEvent], {
      hints: {
        autoSelect: [startEvent]
      }
    })
  }

  function createTask(type) {
    return function(event) {
      const businessObject = bpmnFactory.create(type);
      const shape = elementFactory.createShape({
          type: type,
          businessObject
      });
      create.start(event, shape);
    }
  }

  function nextId(prefix) {
    var ids = new Ids([32, 32, 1])
    return ids.nextPrefixed(prefix)
  }

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate('Activate the hand tool'),
      action: {
        click: function (event) {
          handTool.activateHand(event)
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate('Activate the lasso tool'),
      action: {
        click: function (event) {
          lassoTool.activateSelection(event)
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: translate('Activate the create/remove space tool'),
      action: {
        click: function (event) {
          spaceTool.activateSelection(event)
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: translate('Activate the global connect tool'),
      action: {
        click: function (event) {
          globalConnect.toggle(event)
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none', translate('Create StartEvent')
    ),

    'create.error-boundary-event': createAction(
      'bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-error',
      translate('Create Error Boundary Event'),
      {
        eventDefinitionType: 'bpmn:ErrorEventDefinition',
        isInterrupting: true // 是否中断父流程
      }
    ),
    
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
      translate('Create EndEvent')
    ),
    'create.parallel-gateway': createAction(
      'bpmn:ParallelGateway', 'gateway', 'bpmn-icon-gateway-parallel',
      translate('Create Parallel Gateway')
    ),
    // 'create.user-task': createAction(
    //   'bpmn:UserTask', 'activity', 'bpmn-icon-user-task',
    //   translate('Create UserTask')
    // ),
    // 'create.task': createAction(
    //   'bpmn:Task', 'activity', 'bpmn-icon-task',
    //   translate('Create Task')
    // ),
    // 'create.data-object': createAction(
    //   'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
    //   translate('Create DataObjectReference')
    // ),
    // 'create.data-store': createAction(
    //   'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store',
    //   translate('Create DataStoreReference')
    // ),
    // 'create.subprocess-expanded': {
    //   group: 'activity',
    //   className: 'bpmn-icon-subprocess-expanded',
    //   title: translate('Create expanded SubProcess'),
    //   action: {
    //     dragstart: createSubprocess,
    //     click: createSubprocess
    //   }
    // },
    // 'create.participant-expanded': {
    //   group: 'collaboration',
    //   className: 'bpmn-icon-participant',
    //   title: translate('Create Pool/Participant'),
    //   action: {
    //     dragstart: createParticipant,
    //     click: createParticipant
    //   }
    // },
    'create.group': createAction(
      'bpmn:Group', 'artifact', 'bpmn-icon-group',
      translate('Create Group')
    ),
    'opflow-job-task': createAction(
      'bpmn:ServiceTask', 'opflow', 'fas fa-oplus-jao', translate('Create Job Task'), {
        "typePrefix": "JobTask",
        "camunda:type": "external",
        "camunda:topic": "JobTaskTopic",
      }
    ),
    'opflow-manual-task': createAction(
      'bpmn:ServiceTask', 'opflow', 'fad fa-user-cog', translate('Create Manual Task'), {
        "typePrefix": "ManualTask",
        "camunda:type": "external",
        "camunda:topic": "ManualTaskTopic",
      }
    ),
    'opflow-reboot-task': createAction(
      'bpmn:ServiceTask', 'opflow', 'fas fa-power-off', translate('Create Reboot Task'), {
        "typePrefix": "RebootTask",
        "camunda:type": "external",
        "camunda:topic": "RebootTaskTopic",
      }
    ),
    'opflow-java-task': createAction(
      'bpmn:ServiceTask', 'opflow', 'fab fa-java', translate('Create Java Task'), {
        "typePrefix": "JavaTask",
        "camunda:type": "external",
        "camunda:topic": "JavaTaskTopic",
      }
    ),
    'opflow-approve-task': createAction(
      'bpmn:ServiceTask', 'opflow', 'fas fa-stamp', translate('Create Approve Task'), {
        "typePrefix": "ApproveTask",
        "camunda:type": "external",
        "camunda:topic": "ApproveTaskTopic",
      }
    ),
    'opflow-subprocess-task': createAction(
      'bpmn:ServiceTask', 'opflow', 'bpmn-icon-subprocess-collapsed', translate('Create SubProcess Task'), {
        "typePrefix": "SubProcessTask",
        "camunda:type": "external",
        "camunda:topic": "SubProcessTaskTopic",
      }
    ),
  })

  return actions
}
