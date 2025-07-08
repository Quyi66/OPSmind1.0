/**
 * @author chy, created on 2022-06-28.
 */

import './flow-modeler.scss'

import BpmnModeler from '../../components/custom-modeler'

import customControlsModule from '../../components/custom-modeler/custom'
import eleConst from '../../components/custom-modeler/custom/custom-element.constants'
import minimapModule from '../../components/minimap'
import customTranslate from '../../components/i18n-bpmn/customTranslate'

// Camunda
import camundaModules from '../../components/camunda-bpmn-moddle/lib/index'

// 校验
import transactionBoundariesModule from 'bpmn-js-transaction-boundaries'
import lintModule from '../../components/bpmn-js-bpmnlint/lib'
import bpmnlintConfig from '../../.bpmnlintrc'
import tokenSimulation from '../../components/bpmn-js-token-simulation/lib/viewer'

import newDiagram from '../../constants/new-diagram.constants'
import customModdleDescriptor from '../../constants/custom-moddle-descriptor.constants'
import camundaModdleDescriptor from '../../constants/moddle-descriptor.constants'

flowModelerController.$inject = ['$scope']
export default function flowModelerController($scope) {
    var that = this;
    that.bpmnModeler = null;

    const modelerTypes = {
        edit: "edit",
        add: "add"
    }

    const customTranslateModule = {
        translate: ['value', customTranslate]
    }

    that.bpmnModeler = new BpmnModeler({
        container: angular.element('#canvas'),
        // 添加控制板
        propertiesPanel: {
            parent: '#js-properties-panel'
        },
        additionalModules: [
            customTranslateModule,
            customControlsModule,
            // 缩略图工具栏
            minimapModule,
            // alignToOriginModule,
            // 显示事务边界
            transactionBoundariesModule,
            lintModule,
            tokenSimulation,
            camundaModules
        ],
        moddleExtensions: {
            oplus: customModdleDescriptor,
            // flowable: flowModdleDescriptor,
            camunda: camundaModdleDescriptor,
        },
        linting: {
            active: true,
            bpmnlint: bpmnlintConfig
        },
        keyboard: {
            bindTo: document.body
        }
    });

    angular.element('.bjs-powered-by')[0].remove();
    // angular.element('.djs-palette')[0].style.display = 'inline-block'

    that.$initWatch = $scope.$watch('$ctrl.bpmnXml', function (n, o) {
        if (that.type === modelerTypes.edit) {
            if (n) {
                that.init();
                that.$initWatch(); //Deregister
            }
        }
        else {
            that.init();
            that.$initWatch(); //Deregister
        }
    })

    $scope.$on('refreshBpmnXml.opflow', function (event, callback) {
        that.getDiagramXml(callback);
    })

    that.renderDiagram = function (xml) {
        that.bpmnModeler.importXML(xml, err => {
            if (err) {
                console.log('init diagram error' + err)
                return;
            } else {
                //console.log('init diagram success!')
                // 让图能自适应屏幕
                that.bpmnModeler.get('canvas').zoom('fit-viewport', "auto")
                that.bpmnModeler.get('animation').setAnimationSpeed(1.5)
                angular.element('.toggle-mode')[0].innerHTML = `${customTranslate('Token Simulation')} <span class="toggle"><i class="fa fa-toggle-off"></i></span>`;
            }
        })
    }

    that.getDiagramXml = function (callback) {
        var customElements = that.bpmnModeler._customElements;
        if (customElements && customElements.length > 0) {
            // 将自定义的元素 加入到 _definitions
            var flowElements = that.bpmnModeler._definitions.rootElements[0].flowElements;

            that.bpmnModeler._definitions.rootElements[0].flowElements = flowElements.concat(customElements.filter(function (f) {
                return !flowElements.find(function (fd) {
                    return fd.id === f.id
                })
            }))
        }

        that.bpmnModeler.saveXML({ format: true }, (err, xml) => {
            if (err) {
                console.error(err);
                // messageService.alert(err);
            } else {
                that.bpmnXml = xml.replace(/ns0:/g, eleConst.prefixEx())
                if (callback && callback instanceof Function) {
                    callback(xml, that.bpmnModeler.getDefinitions().rootElements[0].id);
                }
            }
        })
    }

    that.init = function () {
        if (that.isInit) return;
        that.isInit = true;

        if (that.type === modelerTypes.add) 
            that.bpmnXml = newDiagram();
        
        that.renderDiagram(that.bpmnXml)
    }
}
