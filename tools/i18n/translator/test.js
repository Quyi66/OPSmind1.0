var fs = require('fs');
var path = require('path');
var rootDir = 'src/webapp/i18n';
var transDao = require('./trans-dao').transDao;
var transFinder = require('./trans-finder').transFinder;
var moment=require('moment');

function testLoadAllTrans(){
    transDao.loadAllTrans();
}
function testFindAllRefs() {
    transFinder.findAllRefs().then(function (data) {
        writeFile(JSON.stringify(data, null, '  '));
    }).catch(function (err) {
        console.error(err);
    });
}

function testUnflatten() {
    var testFile = getPath('./test/transtosave.json');
    var content = fs.readFileSync(testFile);
    var trans = JSON.parse(content);
    transDao.saveAllTrans(trans).then(function (result) {
        writeFile(JSON.stringify(result, null, '  '));
    }).catch(function (err) {
        console.error(err);
    });
}

function getPath(relPath) {
    return path.join(__dirname, relPath);
}

function writeFile(content) {
    var file = getPath('./test/result.json');
    fs.writeFile(file, content, (err) => {
        if (err) throw err;
        console.log('File saved to %s', file);
    });
}
console.log(moment().format('yyyyMMDDHHmmss'))
// testUnflatten();