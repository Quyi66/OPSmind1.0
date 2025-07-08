/**
 * @author chy, created on 2022-06-28.
 */

import constants from '../components/custom-modeler/custom/custom-element.constants'

export default {
  "name": "OPlus-flow",
  "uri": "http://famessoft.com/schema/1.0/bpmn",
  "prefix": 'oplus',
  "xml": {
    "tagAlias": "lowerCase"
  },
  "types": [
    {
      "name": "Process",
      "isAbstract": true,
      "extends": [
        "bpmn:Process"
      ],
      "properties": [
        {
          "name": "singleton",
          "isAttr": true,
          "type": "String"
        },
      ]
    },
    
    {
      "name": "ServiceTaskLike",
      "extends": [
        "bpmn:ServiceTask"
      ],
      "properties": [
        {
          "name": "javaDelegate",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "forceJob",
          "isAttr": true,
          "type": "String"
        }
      ]
    },

  ],
  "emumerations": [],
  "associations": []
}