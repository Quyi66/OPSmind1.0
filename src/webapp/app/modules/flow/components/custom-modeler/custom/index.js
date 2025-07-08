/**
 * @author chy, created on 2022-06-30.
 */

/* eslint-disable spaced-comment */
/* eslint-disable indent */
/* eslint-disable lines-around-comment */
import CustomContextPadProvider from './custom-context-pad.provider'
import CustomElementFactory from './custom-element.factory'
import CustomOrderingProvider from './custom-ordering.provider'
import CustomPalette from './custom-palette'
import CustomRenderer from './custom-renderer'
import CustomRules from './custom-rules'
import CustomUpdater from './custom-updater'
import CustomPropertiesProvider from './properties-panel/provider/CustomPropertiesProvider'

export default {
  __init__: [
    'contextPadProvider',
    'customOrderingProvider',
    'customRenderer',
    'customRules',
    'customUpdater',
    'paletteProvider',
    'propertiesProvider',
  ],
  contextPadProvider: ['type', CustomContextPadProvider],
  customOrderingProvider: ['type', CustomOrderingProvider],
  customRenderer: ['type', CustomRenderer],
  customRules: ['type', CustomRules],
  customUpdater: ['type', CustomUpdater],
  elementFactory: ['type', CustomElementFactory],
  paletteProvider: ['type', CustomPalette],
  propertiesProvider: ['type', CustomPropertiesProvider],
}
