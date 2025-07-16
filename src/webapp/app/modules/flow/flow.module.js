/**
 * @author chy, created on 2022-06-28.
 * 修改于 2025-07-17: 转换为传统 Angular 1.x 模块格式
 */

(function() {
    'use strict';

    // 注意：模块已经在入口文件中创建，这里只是获取引用
    var flowModule = angular.module('oplus.flow');

    // 配置模块
    flowModule.config(['$stateProvider', function($stateProvider) {
        // 这里会在 flow.state.js 中进行详细配置
    }]);

    // 注册常量
    // 这些常量会在各自的文件中定义和注册
    
    // 注册控制器和组件
    // 这些控制器和组件会在各自的文件中定义和注册
    
    // 注册服务
    // 这些服务会在各自的文件中定义和注册
    
    console.log('Flow module configured');
})();

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


