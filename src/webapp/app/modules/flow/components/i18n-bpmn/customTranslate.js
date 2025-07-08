import * as translations from './translations'
import { isNullOrUndefined } from 'util'

export default function customTranslate(template, replacements) {
  replacements = replacements || {}
  var locale = localStorage['oplus.locale'] && localStorage['oplus.locale'].replace('-', '_');
  template = translations[locale][template] || template

  return template.replace(/{([^}]+)}/g, function(_, key) {
    var str = replacements[key]
    if (!isNullOrUndefined(translations[locale][replacements[key]])) {
      str = translations[locale][replacements[key]]
    }
    return str || '{' + key + '}'
  })
}
