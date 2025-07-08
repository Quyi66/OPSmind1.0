//https://www.shuzhiduo.com/A/x9J21Qonz6/

var fs = require('fs');
var rootDir = './src/webapp/app';
var outputJsonFile = './tools/i18n/oplus-cn-files.json';
var checkFileTypes = /.js$|.html$|.htm$/;
// Exclude following files/dirs
// - Customized modules: modules/cm, modules/bot
// - Dev and test only: modules/dev
// - Deprecated: modules/cm
// - Icons: fa-icons.js
// - Language files: oplus-lang.js, locales/*
var excludedFiles = /language\.constants\.js|modules\/bot|modules\/dev\/|modules\/cm\/|modules\/tm\/|oplus-lang\.js|fa-icons\.js|pivot\.zh\.js|\/locales\/.*/;

var dictionary = (function () {
    var map = {};
    return {
        outputJsonFile: './oplus-cn-files.json',
        set: function (key, val) {
            map[key] = val || '';
        },
        get: function (key) {
            return map[key] || '';
        },
        save2File: function () {
            // Sort by key
            // https://stackoverflow.com/questions/16167581/sort-object-properties-and-json-stringify
            var jsonString = JSON.stringify(map, Object.keys(map).sort(), '  ');
            fs.writeFile(this.outputJsonFile, jsonString.replace(/","/g, '",\r\n"'), {
                encoding: 'utf8',
                flag: 'w'
            }, function (err) {
                if (err) throw err;
            });
        },
        loadFile: function (callback) {
            fs.readFile(this.outputJsonFile, {encoding: 'utf8'}, function (err, data) {
                map = JSON.parse(data);
                callback();
            })
        }
    }
})();

function File() {
    var index = 0;
    var _readFile = function (pathStr, fileBack, doneBack) {
        fs.readFile(pathStr, {encoding: 'utf8'}, function (err, data) {
            index--;
            if (err) {
                data = "";
                console.log(err, pathStr)
                //throw err;
            }
            fileBack(data, pathStr);
            if (index === 0) {
                doneBack();
            }
        });
    };
    var _walkDir = function (pathStr, fileBack, doneBack) {
        if (excludedFiles.test(pathStr)) {
            return;
        }
        fs.readdir(pathStr, function (err, files) {
            files.forEach(function (file) {
                var path = pathStr + '/' + file;
                if (excludedFiles.test(path)) {
                    return;
                }
                if (fs.statSync(path).isDirectory()) {
                    _walkDir(path, fileBack, doneBack);
                } else {
                    if (checkFileTypes.test(file)) {
                        index++;
                        _readFile(path, fileBack, doneBack);
                    }
                }
            });
        });
    }
    this.walkDir = function (pathStr, fileBack, doneBack) {
        index = 0;
        _walkDir(pathStr, fileBack, doneBack);
    }
}

//第一步  获取中文
dictionary.outputJsonFile = outputJsonFile;

new File().walkDir(rootDir, function (content, path) {
    if (!!content) {
        // var chineseRegex = /[\u4e00-\u9faf]+/g;
        //https://www.cnblogs.com/hycms/p/11097924.html
        // var chineseRegex = /(?<!\/\/\s.*|\/\/.*|<!--\s.*|<!--.*|(^')(@param\s.*)|\*\s.*|\*.*|.*-->\s.*)[\u4e00-\u9fa5]+[a-zA-Z0-9_ ,.]*[\u4e00-\u9fa5]+/g;
        var chineseRegex = /(?<!\/\/\s.*|\/\/.*|<!--\s.*|<!--.*|(^')(@param\s.*)|\*\s.*|\*.*|.*-->\s.*)[^\x00-\xff]+[a-zA-Z0-9_ ,.]*[^\x00-\xff]*?/g;
        var begin = Date.now();
        var match = content.match(chineseRegex);
        var time = Date.now() - begin;
        if (time > 100) {
            console.warn(time + 'ms: Long time processing ' + path);
        }
        if (!!match) {
            dictionary.set(path.substring(rootDir.length), match.map(function (o) {
                return o.trim();
            }));
            // match.forEach(function (mat) {
            //     dictionary.set(mat);
            // })
        }
    }
}, function () {
    console.log(dictionary.outputJsonFile);
    dictionary.save2File();
})
