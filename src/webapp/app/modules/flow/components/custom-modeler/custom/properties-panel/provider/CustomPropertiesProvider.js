import inherits from 'inherits';
import flowHelper from '../../../../../helper/flow-helper';
import taskTypeConstants from '../../../../../constants/task-type.constants';

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import customTextProps from '../prop/CustomTextProps';
import customCheckboxProps from '../prop/CustomCheckboxProps';
import customSelectProps from '../prop/CustomSelectProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';
import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';

import ExtensionProps from '../prop/ExtensionProps';

function createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate) {

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };

  // customIdProps(generalGroup, element, translate, {disabled: true});
  nameProps(generalGroup, element, bpmnFactory, canvas, translate);

  if (flowHelper.is(element, 'bpmn:Process')) {
    customCheckboxProps(generalGroup, element, translate, {
      id: 'oplus:singleton',
      label: 'Singleton Process',
      description: 'Singleton Process Description',
      propName: 'oplus:singleton'
    });
  }

  if (flowHelper.isTask(element, taskTypeConstants.JavaTask)) {
    customTextProps(generalGroup, element, translate, {
      id: 'oplus:javaDelegate',
      label: 'Java Class',
      description: 'Java Delegate Description',
      propName: 'oplus:javaDelegate',
    });
  }

  if (flowHelper.isTask(element, taskTypeConstants.JobTask)) {
    customCheckboxProps(generalGroup, element, translate, {
      id: 'oplus:forceJob',
      label: 'Force Job',
      description: 'Force Job Description',
      propName: 'oplus:forceJob',
    });
  }

  // processProps(generalGroup, element, translate);

  // var detailsGroup = {
  //   id: 'details',
  //   label: 'Details',
  //   entries: []
  // };
  // linkProps(detailsGroup, element, translate);
  // eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

  var documentationGroup = {
    id: 'documentation',
    label: translate('Documentation'),
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory, translate);

  return [
    generalGroup,
    // detailsGroup,
    documentationGroup
  ];
}

function createJobTabGroups(element, modeling, eventBus) {
  var editJobGroup = {
    id: 'edit-job',
    label: 'Job',
    entries: []
  }

  // 每个属性都有自己的props方法
  ExtensionProps(editJobGroup, element, modeling, eventBus);
  // OtherProps1(editAuthorityGroup, element);
  // OtherProps2(editAuthorityGroup, element);

  return [
    editJobGroup
  ];
}

CustomPropertiesProvider.$inject = ['eventBus', 'bpmnFactory', 'canvas', 'elementRegistry', 'translate', 'modeling']
export default function CustomPropertiesProvider(
  eventBus, bpmnFactory, canvas,
  elementRegistry, translate, modeling
) {
  PropertiesActivator.call(this, eventBus);

  this.getTabs = function (element) {
    var tabs = [];

    tabs.push({
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate)
    });

    // if (flowHelper.isTask(element, taskTypeConstants.JobTask)) {
    //   tabs.push({
    //     id: 'job',
    //     label: 'Job',
    //     groups: createJobTabGroups(element, modeling, eventBus)
    //   });
    // }

    return tabs;
  }
}

inherits(CustomPropertiesProvider, PropertiesActivator);