/**
 * @ Author: chy
 * @ Create Time: 2022-11-15 15:02:02
 * @ Description:  
 */
import './flow-viewer.scss'

import BpmnViewer from '../../components/custom-viewer'
import viewerEvents from '../../constants/viewer-events.constants'

import customModdleDescriptor from '../../constants/custom-moddle-descriptor.constants'
import camundaModdleDescriptor from '../../constants/moddle-descriptor.constants'

flowViewerController.$inject = ['$scope']
export default function flowViewerController($scope) {
  var that = this;

  that.bpmnViewer = new BpmnViewer({
    container: angular.element('#canvas'),
    additionalModules: [

    ],
    moddleExtensions: {
      oplus: customModdleDescriptor,
      // flowable: flowModdleDescriptor,
      camunda: camundaModdleDescriptor,
    },
    linting: {
      // bpmnlint: bpmnlintConfig
    },
    keyboard: {
      bindTo: document.body
    }
  });

  angular.element('.bjs-powered-by')[0].remove();
  // angular.element('.djs-palette')[0].style.display = 'inline-block'

  that.$initWatch = $scope.$watch('$ctrl.bpmnXml', function (n, o) {
    if (n) {
      that.init();
      that.$initWatch(); //Deregister
    }
  })

  that.renderDiagram = function (xml, defer) {
    that.bpmnViewer.importXML(xml, err => {
      if (err) {
        //console.log('init diagram error' + err)
        if (defer) defer.reject(err);
        return;
      }
      else
      {
        //console.log('init diagram success!')
        // 让图能自适应屏幕
        that.bpmnViewer.get('canvas').zoom('fit-viewport', "auto")
        if (!that.isInit) {
          that.emit(viewerEvents.emitBpmnViewer, that.bpmnViewer)
          that.emit(viewerEvents.emitProcessAttrs, that.bpmnViewer.get('canvas').getRootElement().businessObject)
        }

        if (defer) defer.resolve();
      }

      that.isInit = true;
    })
  }


  that.init = function () {
    if (that.isInit) return;
    that.renderDiagram(that.bpmnXml)
  }

  that.genNodeDetailBox = function (e, overlays) {
    let tempDiv = document.createElement("div");
    //this.detailInfo = detail;
    let popoverEl = document.querySelector('.flowMsgPopover');
    //let popoverEl = this.$refs.flowMsgPopover;
    //console.log(this.detailInfo);
    tempDiv.innerHTML = popoverEl.innerHTML;
    tempDiv.className = 'tipBox';
    tempDiv.style.width = '260px';
    tempDiv.style.background = 'rgba(255, 255, 255, .6)';
    overlays.add(e.element.id, {
      position: {
        top: e.element.height,
        left: 0
      },
      html: tempDiv
    });
  }

  that.emit = (name, args) => {
    $scope.$emit(name, args);
  }

  $scope.$on(viewerEvents.broadcastReRender, (e, bpmnXml, defer) => {
    e.preventDefault();
    that.bpmnViewer.clear();
    that.renderDiagram(bpmnXml || that.bpmnXml, defer)
  })
}