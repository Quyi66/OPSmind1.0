/**
 * @author chy, created on 2022-06-30.
 */

/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable standard/array-bracket-even-spacing */
/* eslint-disable one-var */
import inherits from 'inherits'

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import eleConst from './custom-element.constants'

import {
  componentsToPath,
  createLine
} from 'diagram-js/lib/util/RenderUtil'

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'

// eslint-disable-next-line one-var
var COLOR_GREEN = '#52B415',
  COLOR_RED = '#cc0000',
  COLOR_YELLOW = '#ffc800'
  
/** * A renderer that knows how to render custom elements. */
export default function CustomRenderer(eventBus, styles) {
  BaseRenderer.call(this, eventBus, 2000)

  var computeStyle = styles.computeStyle
  this.drawTriangle = function (p, side) {
    var halfSide = side / 2,
      points,
      attrs
    points = [halfSide, 0, side, side, 0, side]

    attrs = computeStyle(attrs, {
      stroke: COLOR_GREEN,
      strokeWidth: 2,
      fill: COLOR_GREEN
    })

    var polygon = svgCreate('polygon')
    svgAttr(polygon, {
      points: points
    })

    svgAttr(polygon, attrs)

    svgAppend(p, polygon)

    return polygon
  }

  this.getTrianglePath = function (element) {
    var x = element.x,
      y = element.y,
      width = element.width,
      height = element.height

    var trianglePath = [
      ['M', x + width / 2, y],
      ['l', width / 2, height],
      ['l', -width, 0],
      ['z']
    ]
    return componentsToPath(trianglePath)
  }

  this.drawCircle = function (p, width, height) {
    var cx = width / 2,
      cy = height / 2

    var attrs = computeStyle(attrs, {
      stroke: COLOR_YELLOW,
      strokeWidth: 4,
      fill: COLOR_YELLOW
    })

    var circle = svgCreate('circle')
    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width + height) / 4)
    })

    svgAttr(circle, attrs)

    svgAppend(p, circle)

    return circle
  }

  this.getCirclePath = function (shape) {
    var cx = shape.x + shape.width / 2,
      cy = shape.y + shape.height / 2,
      radius = shape.width / 2

    var circlePath = [
      ['M', cx, cy],
      ['m', 0, -radius],
      ['a', radius, radius, 0, 1, 1, 0, 2 * radius],
      ['a', radius, radius, 0, 1, 1, 0, -2 * radius],
      ['z']
    ]
    return componentsToPath(circlePath)
  }

  this.drawCustomConnection = function (p, element) {
    var attrs = computeStyle(attrs, {
      stroke: COLOR_RED,
      strokeWidth: 2
    })
    return svgAppend(p, createLine(element.waypoints, attrs))
  }

  this.getCustomConnectionPath = function (connection) {
    var waypoints = connection.waypoints.map(function (p) {
      return p.original || p
    })

    var connectionPath = [
      ['M', waypoints[0].x, waypoints[0].y]
    ]
    waypoints.forEach(function (waypoint, index) {
      if (index !== 0) {
        connectionPath.push(['L', waypoint.x, waypoint.y])
      }
    })

    return componentsToPath(connectionPath)
  }
}

inherits(CustomRenderer, BaseRenderer)

CustomRenderer.$inject = ['eventBus', 'styles']

CustomRenderer.prototype.canRender = function (element) {
  return new RegExp(`^${eleConst.prefixEx()}`).test(element.type)
}

CustomRenderer.prototype.drawShape = function (p, element) {
  var type = element.type
  if (eleConst.getElementsByType('task').indexOf(type) > -1) {
    return this.drawTriangle(p, element.width)
  }
}

CustomRenderer.prototype.getShapePath = function (shape) {
  var type = shape.type
  if (eleConst.getElementsByType('task').indexOf(type) > -1) {
    return this.getTrianglePath(shape)
  }
}

CustomRenderer.prototype.drawConnection = function (p, element) {
  var type = element.type
  if (eleConst.getElementsByType('connection').indexOf(type) > -1) {
    return this.drawCustomConnection(p, element)
  }
}

CustomRenderer.prototype.getConnectionPath = function (connection) {
  var type = connection.type
  if (eleConst.getElementsByType('connection').indexOf(type) > -1) {
    return this.getCustomConnectionPath(connection)
  }
}
