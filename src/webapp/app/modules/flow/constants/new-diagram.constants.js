/**
 * @author chy, created on 2022-06-28.
 */

var Ids = require('ids')['default']

export default function newDiagram() {
    function nextId(prefix) {
        var ids = new Ids([32, 32, 1])
        return ids.nextPrefixed(prefix)
    }


    var processId = nextId('Process_');
    var startId = nextId('StartEvent_');
    var seqFlowId = nextId('SequenceFlow_');
    var endId = nextId('EndEvent_');

return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
    xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:flowable="http://flowable.org/bpmn"
    xmlns:oplus="http://famessoft.com/schema/1.0/bpmn"
    xmlns:ns0="undefined" 
    targetNamespace="http://www.flowable.org/processdef">
    <bpmn:process id="${processId}" isExecutable="true">
        <bpmn:startEvent id="${startId}">
            <bpmn:outgoing>${seqFlowId}</bpmn:outgoing>
        </bpmn:startEvent>
        <bpmn:sequenceFlow id="${seqFlowId}" sourceRef="${startId}" targetRef="${endId}"></bpmn:sequenceFlow>
        <bpmn:endEvent id="${endId}">
            <bpmn:incoming>${seqFlowId}</bpmn:incoming>
        </bpmn:endEvent>
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_${processId}">
        <bpmndi:BPMNPlane id="BPMNPlane_${processId}" bpmnElement="${processId}">
            <bpmndi:BPMNShape id="BPMNShape_${startId}" bpmnElement="${startId}">
                <omgdc:Bounds x="150" y="200" width="36" height="36" />
                <bpmndi:BPMNLabel>
                    <omgdc:Bounds x="146" y="243" width="43" height="14" />
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge id="BPMNEdge_${seqFlowId}" bpmnElement="${seqFlowId}">
                <omgdi:waypoint x="186" y="218" />
                <omgdi:waypoint x="760" y="218" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNShape id="BPMNShape_${endId}" bpmnElement="${endId}">
                <omgdc:Bounds x="760" y="200" width="36" height="36" />
                <bpmndi:BPMNLabel>
                    <omgdc:Bounds x="756" y="243" width="43" height="14" />
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn:definitions>`

}