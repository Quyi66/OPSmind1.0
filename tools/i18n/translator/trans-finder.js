/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/4, created
 */
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const request = require('request');
const read = require('fs-readdir-recursive');
const $q = require('q');
const appConfig = require('./config.js').appConfig;
const cacheFile = path.join(appConfig.cacheDir, 'oplus-refsd.json');
const DB_RESOURCE_URL = appConfig.oplusPortalUrl + '/adm/api/adm/appres';
const EXCLUDED_DIRS = /bower_components|webapp[\\/]lib|webapp[\\/]help|webapp[\\/]content|webapp[\\/]i18n|webapp[\\/]app[\\/]modules[\\/]flow[\\/]dist/;
const EXCLUDED_FILES = /oplus-lang\.js/;


/**
 * Count the occurrences of translation key from input content
 * @param {string} content
 * @return {{key:string, count:number}[]} Array of translation key and occurrence of its reference
 */
function countTransRefs(content) {

    // HTML REGEX: \(\s*[\\]?['"](.*?)[\\]?['"]\s*\|\s*translate\s*((?=:).*|\s*)\)|{{.*[\\]?['"](.*?)[\\]?['"].*\|.*translate\s*((?=:).*|\s*)}}
    // data-translate=['"](.*?)['"]
    // JS REGEX: \$translate\.instant\(\s*['"](.*?)['"]((?=\s*,\s*{).*|\s*)\)

    var regex = /#{\s*([^{}]*?)\s*}|data-translate=['"](.*?)['"]|\(\s*[\\]?['"](.*?)[\\]?['"]\s*\|\s*translate\s*((?=:).*|\s*)\)|{{.*[\\]?['"](.*?)[\\]?['"].*\|.*translate\s*((?=:).*|\s*)}}|\$translate\.instant\(\s*['"](.*?)['"]((?=\s*,\s*{).*|\s*)\)/g;
    var matches;
    var result = [];
    while (matches = regex.exec(content)) {
        for (var i = 1; i < matches.length; i++) {
            var key = matches[i];
            if (key) {
                var find = _.find(result, {key: key});
                if (!find) {
                    find = {key: key, count: 0};
                    result.push(find);
                }
                find.count++;
            }
        }
    }
    return result;
}


/**
 *
 * @param {{"<translation_key>":{refs:{count:number,referer:string,refererType:string}[]}}} result Result be merged into
 * @param {{key:string,count:number}[]} matches Matched reference
 * @param {string} referer Referer ID, like file path, item ID
 * @param {string} refererType Referer type
 */
function mergeTransRefs(result, matches, referer, refererType) {
    if (matches.length > 0) {
        matches.forEach(function (o) {
            var key = o.key;
            if (!result[key]) {
                result[key] = {refs: []};
            }
            result[key].refs.push({count: o.count, referer: referer, refererType: refererType});
        });
    }
}

/**
 * Find translation referenced by HTML and JS files.
 * @param {string} dir It will scan all .html and .js files in the dir and its sub-dir
 * @return {Promise<{"<translation_key>": {refs:{count:number,referer:string,refererType:string}[]}}>}
 */
function findFileRefs(dir) {
    var d = $q.defer();
    var begin = Date.now();
    console.log('findFileRefs: Read files in dir [%s]', path.resolve(dir));
    var files = read(dir, function (name, index, dir) {
        return !EXCLUDED_DIRS.test(dir);
    });
    // var regex = /jao/gi;
    var result = {};
    var fileCount = 0;
    files.forEach(function (file) {
        if (!file.endsWith('.html') && !file.endsWith('.js')) {
            return;
        }
        var filePath = path.join(dir, file);
        if (EXCLUDED_FILES.test(filePath)) {
            return;
        }
        fileCount++;
        var content = fs.readFileSync(filePath, {encoding: 'utf-8'});
        var matches = countTransRefs(content);
        mergeTransRefs(result, matches, filePath, 'file');
    });
    console.log('findFileRefs: Processed %d files in %d ms', fileCount, (Date.now() - begin));
    d.resolve(result);
    return d.promise;
}

/**
 * Find translation references in database.
 * @return {Promise<{"<translation_key>": {refs:{referer:string,count:number}[]}}>}
 */
function findDbRefs(auth) {
    var d = $q.defer();
    var resTypeDefs = [
        {type: 'udp_page', fields: 'html,title'},
        {type: 'udp_applet', fields: 'setting,title'},
        {type: 'dts_dataset', fields: 'query,name,description'},
        {type: 'jao_job_definition', fields: 'configJson,title,description'},
    ];
    request(DB_RESOURCE_URL, {
        json: true,
        headers: {
            'Authorization':  auth
        }
    }, (err, res, data) => {
        if (err) return d.reject(err);
        if (res.statusCode !== 200) return d.reject(data.message);

        var result = {};
        data.forEach(function (resource) {
            var resDef = _.find(resTypeDefs, {type: resource.type});
            var fields = resDef.fields.split(',');
            resource.records.forEach(function (record) {
                //TODO: now only check first (most important) field
                var matches = countTransRefs(record[fields[0]]);
                mergeTransRefs(result, matches, record.id, resource.type)
            });
        });
        d.resolve(result);
    });
    return d.promise;
}

function loadCacheData() {
    if (fs.existsSync(cacheFile)) {
        var content = fs.readFileSync(cacheFile, {encoding: 'utf-8', flag: 'r'});
        return JSON.parse(content);
    }
    return null;
}

function saveCacheData(content) {
    fs.writeFileSync(cacheFile, content);
}

/**
 * Find usage references of translation keys from database and files.
 *
 * @param {boolean=} forceReload Force to reload data from files and database.
 * By default the value is `false` and it will load data from file cache.
 * @return {Promise<{"translation_key":{refs:[{count:number,referer:string,refererType:string}]}}>}
 */
function findAllRefs(forceReload, auth) {
    var dir = appConfig.htmlJsDir;
    var d = $q.defer();
    var all = {};
    if (!forceReload) {
        var cache = loadCacheData();
        if (cache) {
            d.resolve(cache);
            return d.promise;
        }
    }
    findDbRefs(auth).then(function (dbRefs) {
        mergeRefs(all, dbRefs);
        return findFileRefs(dir);
    }).then(function (fileRefs) {
        mergeRefs(all, fileRefs);
        saveCacheData(JSON.stringify(all));
        d.resolve(all);
    }).catch(function (err) {
        d.reject(err);
    });
    return d.promise;

    function mergeRefs(target, refs) {
        Object.keys(refs).forEach(function (key) {
            if (!target[key]) {
                target[key] = {refs: []};
            }
            refs[key].refs.forEach(function (item) {
                target[key].refs.push(item);
            });
        });
    }
}


exports.transFinder = {findAllRefs: findAllRefs};