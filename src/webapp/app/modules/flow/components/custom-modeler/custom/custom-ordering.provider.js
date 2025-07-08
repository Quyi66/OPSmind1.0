/**
 * @author chy, created on 2022-06-30.
 */

/* eslint-disable lines-around-comment */
/* eslint-disable consistent-return */
import inherits from 'inherits'

import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider'
import eleConst from './custom-element.constants'

/**
 * a simple ordering provider that ensures that custom
 * connections are always rendered on top.
 */
export default function CustomOrderingProvider(eventBus, canvas) {
  OrderingProvider.call(this, eventBus)

  this.getOrdering = function (element, newParent) {
    if (eleConst.getElementsByType('connection').indexOf(element.type) > -1) {
      // always move to end of root element
      // to display always on top
      return {
        parent: canvas.getRootElement(),
        index: -1
      }
    }
  }
}

CustomOrderingProvider.$inject = ['eventBus', 'canvas']

inherits(CustomOrderingProvider, OrderingProvider)
