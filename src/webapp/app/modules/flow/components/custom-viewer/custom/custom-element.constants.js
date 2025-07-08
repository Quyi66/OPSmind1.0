/**
 * @ Author: chy
 * @ Create Time: 2022-07-13 10:23:18
 * @ Description:  
 */

const elementArr = [
    { name: 'JobTask', type: 'task' },
    { name: 'RebootTask', type: 'task' },
    { name: 'ManualTask', type: 'task' },
    { name: 'Connection', type: 'connection' },
]

export default {
  prefix: 'opflow',
  prefixEx: function () { return `${this.prefix}:` },
  elements: elementArr,
  elementObj: (() => {
    var obj = {};
    elementArr.map(m => obj[m.name] = m.name);
    return obj;
  })(),

  getElementsByType: function(type) {
    return this.elements.filter(f => f.type === type).map(m => `${this.prefix}:${m.name}`)
  },

  getElementsByName: function(name) {
    return this.elements.find(f => f.name === name) ? `${this.prefix}:${name}` : '';
  }
}