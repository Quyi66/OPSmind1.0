/**
 * @author chy, created on 2022-06-30.
 */

/* eslint-disable one-var */
import Viewer from '../bpmn-js/lib/Viewer'
// import ContextPadModule from '../bpmn-js/lib/features/context-pad';

import MoveModule from 'diagram-js/lib/features/move'
import ModelingModule from '../../components/bpmn-js/lib/features/modeling'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import ZoomScroll from './custom/zoom-scroll/CustomZoomScroll'
import Overlays from 'diagram-js/lib/features/overlays/Overlays.js'

import {
  assign,
  isArray
} from 'min-dash'

import inherits from 'inherits'

import CustomModule from './custom'
import eleConst from './custom/custom-element.constants'

export default function CustomViewer(options) {
  Viewer.call(this, options)

  this._customElements = []
}

inherits(CustomViewer, Viewer)

CustomViewer.prototype._modules = [].concat(
  CustomViewer.prototype._modules,
  [
    // CustomModule,
    // MoveModule,
    ModelingModule,
    MoveCanvasModule,
    ZoomScroll,
    Overlays,
  ]
)

/**
 * Add a single custom element to the underlying diagram
 *
 * @param {Object} customElement
 */
CustomViewer.prototype._addCustomShape = function (customElement) {
  this._customElements.push(customElement)

  var canvas = this.get('canvas'),
    elementFactory = this.get('elementFactory')

  var customAttrs = assign({
    businessObject: customElement
  }, customElement)

  var customShape = elementFactory.create('shape', customAttrs)
  return canvas.addShape(customShape)
}

CustomViewer.prototype._addCustomConnection = function (customElement) {
  this._customElements.push(customElement)

  var canvas = this.get('canvas'),
    elementFactory = this.get('elementFactory'),
    elementRegistry = this.get('elementRegistry')

  var customAttrs = assign({
    businessObject: customElement
  }, customElement)

  var connection = elementFactory.create('connection', assign(customAttrs, {
      source: elementRegistry.get(customElement.source),
      target: elementRegistry.get(customElement.target)
    }),
    elementRegistry.get(customElement.source).parent)
  return canvas.addConnection(connection)
}

/**
 * Add a number of custom elements and connections to the underlying diagram.
 *
 * @param {Array<Object>} customElements
 */
CustomViewer.prototype.addCustomElements = function (customElements) {
  if (!isArray(customElements)) {
    throw new Error('argument must be an array')
  }

  var shapes = [],
    connections = []
  customElements.forEach(function (customElement) {
    if (isCustomConnection(customElement)) {
      connections.push(customElement)
    } else {
      shapes.push(customElement)
    }
  })

  // add shapes before connections so that connections
  // can already rely on the shapes being part of the diagram
  shapes.forEach(this._addCustomShape, this)

  connections.forEach(this._addCustomConnection, this)
}

/**
 * Get custom elements with their current status.
 *
 * @return {Array<Object>} custom elements on the diagram
 */
CustomViewer.prototype.getCustomElements = function () {
  return this._customElements
}

function isCustomConnection(element) {
  return eleConst.getElementsByType('task').indexOf(element.type) > -1
}
