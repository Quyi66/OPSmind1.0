/**
 * @author chy, 2022/5/11, created
 */
const fs = require('fs');
const $q = require('q');

const { flatten, unflatten } = require('flat');
const { transFinder } = require('./trans-finder.js');

const ACTIONS =  {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete'
}

/**
 * 
 * @param {[key: string, value: string, action: Action]} kvPair 
 * @param {string} filePath 
 */
function saveI18nFile(kvPair, filePath) {
  var fileJsonContent = {};
  if (fs.existsSync(filePath)) {
    var fileContent = fs.readFileSync(filePath, {encoding: 'utf-8', flag: 'r'});
    fileJsonContent = flatten(JSON.parse(fileContent));
  }
  
  kvPair.forEach(item => {
    if (item.action === ACTIONS.ADD || item.action === ACTIONS.EDIT) fileJsonContent[item.key] = item.value;
    else if (item.action === ACTIONS.DELETE) delete fileJsonContent[item.key];
  })

  if (Object.values(fileJsonContent).length === 0) 
    fs.unlinkSync(filePath);
  else
    fs.writeFileSync(filePath, JSON.stringify(fileJsonContent, null, 2));
    // fs.writeFileSync(filePath, JSON.stringify(unflatten(fileJsonContent), null, 2));
}

function changeRefs(oldKey, newKey) {
  var defer = $q.defer();
  transFinder.findAllRefs(false).then(function (refs) {
    var oldRefs = refs[oldKey];
    if (oldRefs) {
      var refererStr = '';
      oldRefs.refs.forEach(item => {
        var { referer, count, refererType } = item;
        if (refererType === 'file') changeFileRefs(referer);
        else changeDbRefs(referer);

        refererStr += `${referer}\n`;
      })
      defer.resolve(refererStr);
    }
    defer.resolve('');
  });

  return defer.promise;

  function changeFileRefs(referer) {
    if (fs.existsSync(referer)) {
      var fileContent = fs.readFileSync(referer, { encoding: 'utf-8', flag: 'r' });
      fileContent = fileContent.replace(new RegExp(oldKey, 'g'), newKey);
      fs.writeFileSync(referer, fileContent);
    }
  }

  function changeDbRefs(referer) {
    // TODO
  }
}

exports.transHandler = {
  ACTIONS: ACTIONS,
  saveI18nFile: saveI18nFile,
  changeRefs: changeRefs,
}