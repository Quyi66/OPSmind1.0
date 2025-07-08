var fs = require('fs');
var _ = require('lodash');
var JSON5 = require('json5');

var jsonFile1 = '../src/webapp/i18n/zh-cn/common.json';
var jsonFile2 = '../tmp/common.json';
var targetJsonFile = '../tmp/result.json';
// mergeJsonFiles(jsonFile1, jsonFile2, targetJsonFile);
var test = fs.readFileSync('../src/webapp/i18n/zh-cn/funcs.json5');
var str=JSON.stringify(JSON5.parse(test),null,'  ');
console.log(str);


/**
 * Stringify an object to JSON string with sorted keys.
 * @param {object} obj
 * @return {string}
 */
function stringifyJsonWithSortedKey(obj) {
    return JSON.stringify(obj, replacer, '  ');

    //https://gist.github.com/davidfurlong/463a83a33b70a3b6618e97ec9679e490
    function replacer(key, value) {
        return value instanceof Object && !(value instanceof Array) ?
            Object.keys(value)
                .sort()
                .reduce(function (sorted, key) {
                    sorted[key] = value[key];
                    return sorted
                }, {}) :
            value;
    }
}

/**
 * Merge two JSON files and output to target file
 * @param {string} srcFile1
 * @param {string} srcFile2
 * @param {string} destFile
 */
function mergeJsonFiles(srcFile1, srcFile2, destFile) {
    var obj1 = require(srcFile1);
    var obj2 = require(srcFile2);
    var result = _.merge({}, obj1, obj2);
    var jsonString = stringifyJsonWithSortedKey(result);
    fs.writeFileSync(destFile, jsonString);
}

