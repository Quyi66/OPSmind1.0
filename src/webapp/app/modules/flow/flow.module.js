/**
 * @author chy, created on 2022-06-28.
 */

import flowState from './flow.state'

import flowApi from './api/flow.api'
import flowService from './flow.service'

import flowController from './flow.controller'
import flowModelerController from './widgets/modeler/flow-modeler.component'
import flowViewerController from './widgets/viewer/flow-viewer.component'
import flowParamsController from './widgets/viewer/params/flow-params.component'
import flowDetailViewerCtrl from './widgets/viewer/detail-viewer/flow-detail-viewer.component'
import flowRunViewerCtrl from './widgets/viewer/run-viewer/flow-run-viewer.component'
import flowResultViewerCtrl from './widgets/viewer/result-viewer/flow-result-viewer.component'
import flowBpmnXmlCtrl from './widgets/bpmn-xml/flow-bpmn-xml.component'
import flowProcessListCtrl from './widgets/process-list/process-list.controller'
import flowProcessEditDialogCtrl from './widgets/process-edit-dialog/process-edit-dialog.controller'
import flowProcessSelectorController from './widgets/process-selector/process-selector.component'
import flowSceneSelectorController from './widgets/scene-selector/scene-selector.component'
import flowSceneEditDialogCtrl from './widgets/scene-edit-dialog/scene-edit-dialog.controller'
import flowProcessHistoryCtrl from './widgets/process-history/process-history.controller'

import flowProcessDesignCtrl from './widgets/process-design/process-design.controller'
import flowProcessExecCtrl from './widgets/process-exec/process-exec.controller'
import flowProcessResultListCtrl from './widgets/process-result-list/process-result-list.controller'
import flowProcessResultListTableCtrl from './widgets/process-result-list/process-result-list-table.controller'
import flowProcessResultCtrl from './widgets/process-result/process-result.controller'

import extensionProps from './components/custom-modeler/custom/properties-panel/prop/ExtensionProps'

import camundaModdleDescriptor from './constants/moddle-descriptor.constants'
import customModdleDescriptor from './constants/custom-moddle-descriptor.constants'
import flowNewDiagram from './constants/new-diagram.constants'

const flowModule = angular.module('oplus.flow', [
    'oplus.commons',
    'oplus.uaa'
]);

// Config
flowModule.config(flowState);

// Services
flowModule
    .service('flow.Api', flowApi)
    .service('flow.Service', flowService)
    ;

// Controllers
flowModule
    .controller('flowController', flowController)
    .controller('flowProcessListCtrl', flowProcessListCtrl)
    .controller('flowProcessEditDialogCtrl', flowProcessEditDialogCtrl)
    .controller('flowProcessDesignCtrl', flowProcessDesignCtrl)
    .controller('flowProcessExecCtrl', flowProcessExecCtrl)
    .controller('flowProcessResultListCtrl', flowProcessResultListCtrl)
    .controller('flowProcessResultListTableCtrl', flowProcessResultListTableCtrl)
    .controller('flowProcessResultCtrl', flowProcessResultCtrl)
    .controller('flowSceneEditDialogCtrl', flowSceneEditDialogCtrl)
    .controller('flowProcessHistoryCtrl', flowProcessHistoryCtrl)


    .controller('extensionProps', extensionProps)
    ;

// Components
flowModule
    .component('flowModeler', {
        templateUrl: 'app/modules/flow/widgets/modeler/flow-modeler.html',
        controller: flowModelerController,
        controllerAs: '$ctrl',
        bindings: {
            bpmnXml: '=',
            type: '<',
            bpmnModeler: '=',
        },
    })
    .component('flowBpmnXml', {
        templateUrl: 'app/modules/flow/widgets/bpmn-xml/flow-bpmn-xml.html',
        controller: flowBpmnXmlCtrl,
        controllerAs: '$ctrl',
        bindings: {
            bpmnXml: '='
        },
    })
    .component('processDesigner', {
        templateUrl: 'app/modules/flow/widgets/process-design/process-design.html',
        controller: flowProcessDesignCtrl,
        controllerAs: '$ctrl',
        bindings: {
            processId: '<',
            options: '<'
        },
    }) 
    .component('flowViewer', {
        templateUrl: 'app/modules/flow/widgets/viewer/flow-viewer.html',
        controller: flowViewerController,
        controllerAs: '$ctrl',
        bindings: {
            bpmnXml: '=',
        },
    })
    .component('flowParams', {
        templateUrl: 'app/modules/flow/widgets/viewer/params/flow-params.html',
        controller: flowParamsController,
        controllerAs: '$ctrl',
        bindings: {
            instanceId: '<?',
            currentNode: '=',
            params: '=',
            paramsArr: '=',
            needCollapse: '<?',
            needEdit: '<',
            canEdit: '=',
            isEditingParams: '=?', // 仅用于传递到父作用域
            paramsChanged: '&?'
        },
    })
    .component('flowDetailViewer', {
        templateUrl: 'app/modules/flow/widgets/viewer/detail-viewer/flow-detail-viewer.html',
        controller: flowDetailViewerCtrl,
        controllerAs: '$ctrl',
        bindings: {
            processId: '<',
            detailId: '<',
            options: '<'
        },
    })
    .component('flowRunViewer', {
        templateUrl: 'app/modules/flow/widgets/viewer/run-viewer/flow-run-viewer.html',
        controller: flowRunViewerCtrl,
        controllerAs: '$ctrl',
        bindings: {
            processId: '<',
            detailId: '<',
            options: '<'
        },
    })
    .component('flowResultViewer', {
        templateUrl: 'app/modules/flow/widgets/viewer/result-viewer/flow-result-viewer.html',
        controller: flowResultViewerCtrl,
        controllerAs: '$ctrl',
        bindings: {
            processId: '<',
            detailId: '<',
            instanceId: '<',
            options: '<'
        },
    })
    .component('flowProcessSelector', {
        templateUrl: 'app/modules/flow/widgets/process-selector/process-selector.html',
        controller: flowProcessSelectorController,
        controllerAs: '$ctrl',
        bindings: {
            selectedProcess: '=',
            theModel: '=',
            exceptList: '<',
            disabled: '<',
        },
    })

    .component('flowSceneSelector', {
        templateUrl: 'app/modules/flow/widgets/scene-selector/scene-selector.html',
        controller: flowSceneSelectorController,
        controllerAs: '$ctrl',
        bindings: {
            processId: '=',
            selectedScene: '=',
            theModel: '=',
            disabled: '<',
        },
    })

    .component('processResultList', {
        templateUrl: 'app/modules/flow/widgets/process-result-list/process-result-list.html',
        controller: flowProcessResultListCtrl,
        controllerAs: '$ctrl',
        bindings: {
            options: '<'
        },
    })
    .component('processResultListTable', {
        templateUrl: 'app/modules/flow/widgets/process-result-list/process-result-list-table.html',
        controller: flowProcessResultListTableCtrl,
        controllerAs: '$ctrl',
        bindings: {
            processId: '<',
            options: '<'
        },
    })
    ;

// Constants
flowModule
    .constant('camundaModdleDescriptor', camundaModdleDescriptor)
    .constant('customModdleDescriptor', customModdleDescriptor)
    .constant('flowNewDiagram', flowNewDiagram)
    ;


