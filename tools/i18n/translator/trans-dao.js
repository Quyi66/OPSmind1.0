/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/4, created
 */
const fs = require('fs');
const $q = require('q');
const path = require('path');
const flat = require('flat');
const _ = require('lodash');
const { escape, unescape } = require('lodash');
const { flatten, unflatten } = require('flat');
const moment = require('moment');
const AdmZip = require('adm-zip');
const appConfig = require('./config.js').appConfig;
const { transHandler } = require('./trans-handler.js');

const BingTranslate = require('bing-translate-api');
const GoogleTranslate = require('@imlinhanchao/google-translate-api');
// const GoogleApiKey = 'AIzaSyD2suCe2ivZ853XAp-UWE81ginceHPfdB4';
const GoogleProjectId = 'oplus-349806';
const { Translate } = require('@google-cloud/translate').v2;
const GoogleTranslateV2 = new Translate({
    projectId: GoogleProjectId,
    keyFilename: 'tools/i18n/translator/auth/oplus-349806-6686cff98ea7.json'
})

const BaiduTranslate = require('@opentranslate/baidu').Baidu;
const BaiduConfig = new BaiduTranslate({
    config: {
        appid: "20220512001213352",
        key: "Y_YJQYd8nsUQyBgMMhTB"
    }
})

const TranslateEngine = {
    Google: 'google', // Free and unlimited but the result will not be very precise
    GoogleV2: 'googleV2', // Need Vpn to get Google Token, Only once (Best Translated)
    Baidu: 'baidu',    // ... Indescribable, not recommended to use
    Bing: 'bing'    // Free 2M characters per month, no need vpn
}

/**
 * Use Google Translate Web Api to translate
 * @param {text:string, to:string, (type:string[TranslateEngine])} params 
 * @returns translated_text:string
 */
async function translate(params) {
    var defer = $q.defer();
    if (!params || !params.text || !params.to) {
        defer.reject('Empty Params');
    }
    else {
        params.type = params.type || TranslateEngine.Google;
        if (params.type !== TranslateEngine.GoogleV2 && params.text.length > 5000) {
            var times = Math.ceil(params.text.length / 5000);
            var translated = '';
            for (var i = 0; i < times; i++) {
                try {
                    var res = await translateFunctionFactory(params.type).apply(translateScopeFactory(params.type), translateParamFactory(params.type, params.text.substr(i * 5000, 5000), params.to));
                    translated += translateRespFactory(params.type, res)
                }
                catch (e) {
                    defer.reject('ERROR')
                }
            }

            defer.resolve(translated);
        }
        else {
            translateFunctionFactory(params.type).apply(translateScopeFactory(params.type), translateParamFactory(params.type, params.text, params.to)).then(function (res) {
                var translated = translateRespFactory(params.type, res);
                if (translated.split(' ').length <= 3) translated = translated.replace(/\b(\w)(?![^{{]*}})/g, function($0) { return $0.toUpperCase()})
                defer.resolve(translated);
            }).catch(function (e) {
                defer.reject(e)
            })
        }

    }
    return defer.promise;

    function translateScopeFactory(type) {
        if (type === TranslateEngine.GoogleV2) return GoogleTranslateV2;
        else if (type === TranslateEngine.Baidu) return BaiduConfig;
        else if (type === TranslateEngine.Bing) return BingTranslate;
        else return this;
    }

    function translateParamFactory(type, text, to) {
        if (type === TranslateEngine.Google) return [text, { from: appConfig.primaryLang, to: to, url: "https://translate.google.com.hk" }];
        else if (type === TranslateEngine.GoogleV2) return [text, { from: appConfig.primaryLang, to: to }];
        else if (type === TranslateEngine.Baidu) return [text, appConfig.primaryLang, to];
        else if (type === TranslateEngine.Bing) return [text, null, to];
        else return [];
    }

    function translateFunctionFactory(type) {
        if (type === TranslateEngine.Google) return GoogleTranslate;
        else if (type === TranslateEngine.GoogleV2) return GoogleTranslateV2.translate;
        else if (type === TranslateEngine.Baidu) return BaiduConfig.translate;
        else if (type === TranslateEngine.Bing) return BingTranslate.translate;
        else return void (0);
    }

    function translateRespFactory(type, res) {
        if (type === TranslateEngine.Google) return res.text || (res.candidates ? res.candidates[0] : null);
        else if (type === TranslateEngine.GoogleV2) return res[0] || null;
        else if (type === TranslateEngine.Baidu) return res.trans.paragraphs[0] || null;
        else if (type === TranslateEngine.Bing) return res.translation || null;
        else return this;
    }
}

/**
 * Read translations from i18n JSON files.
 * @return {[{language:string,translations:{"translation-id":string}}]}
 * @private
 */
function readI18nFiles() {
    var result = [];
    iterateLangDir(function (dirPath) {
        var lang = {language: path.parse(dirPath).name, translations: {}};
        result.push(lang);
        var files = fs.readdirSync(dirPath);
        files.forEach(function (file) {
            if (!file.endsWith('.json')) {
                return;
            }
            var filePath = path.join(dirPath, file);
            var json = fs.readFileSync(filePath, { encoding: 'utf-8' });
            _.merge(lang.translations, JSON.parse(json));
        });
    });
    return result;
}

/**
 * Load all translations from i18n JSON files and flatten the keys.
 * @return {[{key:string,trans:{"zh-cn":string,"zh-tw":string}}]}
 */
function loadAllTrans() {
    var languages = readI18nFiles();
    var result = [];
    var allTrans = {};
    languages.forEach(function (lang) {
        var langTrans = flat.flatten(lang.translations);
        var theLang = {};
        Object.keys(langTrans).forEach(function (key) {
            var o = {trans: {}};
            o.trans[lang.language] = langTrans[key];
            theLang[key] = o;
        });
        _.merge(allTrans, theLang);
    });
    Object.keys(allTrans).forEach(function (key) {
        var item = allTrans[key];
        item.key = key;
        result.push(item);
    });
    return result;
}

/**
 *
 * @param {[{key:string,trans:{'zh-cn':string,'zh-tw':string,'en':string}}]} trans All translation data
 * @return {Promise<{langs:[string], keyCount:number, fileCount:number}>}
 */
function saveAllTrans(trans) {
    var d = $q.defer();
    var parsed = parseTrans(trans);
    backupFiles();
    deleteFiles();
    var result = {langs: [], keyCount: trans.length, fileCount: parsed.length};
    parsed.forEach(function (item) {
        if (result.langs.indexOf(item.lang) < 0) {
            result.langs.push(item.lang);
        }
        var dir = path.dirname(item.file);
        fs.mkdirSync(dir, {recursive: true});
        fs.writeFileSync(item.file, item.content);
    });
    d.resolve(result);
    return d.promise;
}

/**
 * 
 * @param {key: string, trans:{langCode: string}}
 */
function save(key, trans) {
    var defer = $q.defer();
    var fileName = `${key.substr(0, key.indexOf('.'))}.json`;
    var resPaths = '';

    Object.keys(trans).forEach(function (langCode) {
        resPaths += saveHandler(langCode) + '\n';
    })

    if (resPaths)
        defer.resolve(`<div style='white-space: pre-line;'>Saved Successfully, Please double check the changes correctly \n File Path: \n ${resPaths}</div>`);
    else defer.reject('Save Failed')

    return defer.promise;

    function saveHandler(langCode) {
        var filePath = `${appConfig.i18nDir}/${langCode}/${fileName}`;
        transHandler.saveI18nFile([{ key: key, value: trans[langCode], action: transHandler.ACTIONS.EDIT }], filePath);
        return filePath;
    }
}

async function rename(oldKey, newKey) {
    var defer = $q.defer();
    var allTrans = loadAllTrans();
    var findNewTrans = _.find(allTrans, function (f) { return f.key === newKey })
    var findOldTrans = _.find(allTrans, function (f) { return f.key === oldKey })
    if (findNewTrans || !findOldTrans) {
        defer.reject('Failed. The key is invalid.')
        return defer.promise;
    }

    var oldFileName = `${oldKey.substr(0, oldKey.indexOf('.'))}.json`;
    var newFileName = `${newKey.substr(0, newKey.indexOf('.'))}.json`;
    var resPaths = '';
    if (oldFileName === newFileName) {
        new Map(Object.entries(findOldTrans.trans)).forEach(function (v, k) {
            var renameParams = [
                { key: oldKey, value: v, action: transHandler.ACTIONS.DELETE },
                { key: newKey, value: v, action: transHandler.ACTIONS.ADD },
            ]
            resPaths += saveHandler(k, oldFileName, renameParams) + '\n';
        })
    }
    else {
        new Map(Object.entries(findOldTrans.trans)).forEach(function (v, k) {
            var renameParams = [
                { key: oldKey, value: v, action: transHandler.ACTIONS.DELETE },
            ]
            resPaths += saveHandler(k, oldFileName, renameParams) + '\n';
        })

        new Map(Object.entries(findOldTrans.trans)).forEach(function (v, k) {
            var renameParams = [
                { key: newKey, value: v, action: transHandler.ACTIONS.ADD },
            ]
            resPaths += saveHandler(k, newFileName, renameParams) + '\n';
        })
    }

    resPaths += await transHandler.changeRefs(oldKey, newKey);

    if (resPaths)
        defer.resolve(`<div style='white-space: pre-line;'>Saved Successfully, Please double check the changes correctly \n File Path: \n ${resPaths}</div>`);
    else defer.reject('Save Failed')

    return defer.promise;


    function saveHandler(langCode, fileName, params) {
        var filePath = `${appConfig.i18nDir}/${langCode}/${fileName}`;
        transHandler.saveI18nFile(params, filePath);
        return filePath;
    }
}

async function merge(oldKey, newKey) {
    var defer = $q.defer();
    var allTrans = loadAllTrans();
    var findNewTrans = _.find(allTrans, function (f) { return f.key === newKey })
    var findOldTrans = _.find(allTrans, function (f) { return f.key === oldKey })
    if (!findNewTrans && !findOldTrans) {
        defer.reject('Failed. The key is invalid.')
        return defer.promise;
    }

    var oldFileName = `${oldKey.substr(0, oldKey.indexOf('.'))}.json`;
    var resPaths = '';

    new Map(Object.entries(findOldTrans.trans)).forEach(function (v, k) {
        var renameParams = [
            { key: oldKey, value: v, action: transHandler.ACTIONS.DELETE },
        ]
        resPaths += saveHandler(k, oldFileName, renameParams) + '\n';
    })

    resPaths += await transHandler.changeRefs(oldKey, newKey);

    if (resPaths)
        defer.resolve(`<div style='white-space: pre-line;'>Merged Successfully, Please double check the changes correctly \n File Path: \n ${resPaths}</div>`);
    else defer.reject('Merge Failed')

    return defer.promise;


    function saveHandler(langCode, fileName, params) {
        var filePath = `${appConfig.i18nDir}/${langCode}/${fileName}`;
        transHandler.saveI18nFile(params, filePath);
        return filePath;
    }
}

function remove(key) {
    var defer = $q.defer();
    var allTrans = loadAllTrans();
    var findTrans = _.find(allTrans, function (f) { return f.key === key })
    if (!findTrans) {
        defer.reject('Failed. The key is not exist.')
        return defer.promise;
    }

    var fileName = `${key.substr(0, key.indexOf('.'))}.json`;
    var resPaths = '';
    
    Object.keys(findTrans.trans).forEach(function (langCode) {
        var removeParams = [
            { key: key, value: findTrans.trans[langCode], action: transHandler.ACTIONS.DELETE },
        ]
        resPaths += saveHandler(langCode, fileName, removeParams) + '\n';
    })

    if (resPaths)
        defer.resolve(`<div style='white-space: pre-line;'>Remove Successfully, Please double check the changes correctly \n File Path: \n ${resPaths}</div>`);
    else defer.reject('Remove Failed')

    return defer.promise;


    function saveHandler(langCode, fileName, params) {
        var filePath = `${appConfig.i18nDir}/${langCode}/${fileName}`;
        transHandler.saveI18nFile(params, filePath);
        return filePath;
    }
}

/**
 *
 * @param {[{key:string,trans:{'zh-cn':string,'zh-tw':string,'en':string}}]} trans All translation data
 * @return {[{lang:string,module:string,file:string,content:string}]}
 */
function parseTrans(trans) {
    var allTrans = {};
    trans.forEach(function (item) {
        var langs = item.trans;
        Object.keys(langs).forEach(function (lang) {
            if (!allTrans[lang]) {
                allTrans[lang] = {};
            }
            allTrans[lang][item.key] = langs[lang];
        });
    });
    var result = [];
    Object.keys(allTrans).forEach(function (lang) {
        var langTrans = flat.unflatten(allTrans[lang]);
        Object.keys(langTrans).forEach(function (module) {
            var file = path.join(appConfig.i18nDir, lang, module + '.json');
            result.push({
                lang: lang,
                module: module,
                file: file,
                content: JSON.stringify({[module]: langTrans[module]}, null, '  ')
            });
        });
    });
    return result;
}

/**
 *
 * @param {function(string)} callback Parameter is language dir path
 */
function iterateLangDir(callback) {
    var subDirs = fs.readdirSync(appConfig.i18nDir);
    subDirs.forEach(function (subDirname) {
        var dirPath = path.join(appConfig.i18nDir, subDirname);
        if (fs.statSync(dirPath).isDirectory()) {
            callback(dirPath);
        }
    });
}

function deleteFiles() {
    iterateLangDir(function (dir) {
        fs.readdirSync(dir)
            .filter(f => /.+\.json$/.test(f))
            .map(f => fs.unlinkSync(path.join(dir, f)));
    });
}

function backupFiles() {
    var timestamp = moment().format('yyyyMMDDHHmmss');
    var zip = new AdmZip();
    zip.addLocalFolder(appConfig.i18nDir);
    zip.writeZip(path.join(appConfig.i18nDir, '..', 'i18n-' + timestamp + '.zip'));
}

function convertPrimaryToOthers(langCode, translateCode) {
  var primaryLangDirPath = appConfig.i18nDir + '/' + appConfig.primaryLang;
  var convertDirPath = appConfig.i18nDir + '/' + langCode;

  if (!fs.existsSync(convertDirPath)) fs.mkdirSync(convertDirPath);

  var files = fs.readdirSync(primaryLangDirPath);
  files.forEach(async function (file) {
    if (!file.endsWith('.json')) return;
    // if (!file.startsWith('udp.json')) return;
    var content = fs.readFileSync(path.join(primaryLangDirPath, file), { encoding: 'utf-8' });
    var convertedFilePath = convertDirPath + '/' + file;
    var res = await translate({ text: escape(content), to: translateCode, type: TranslateEngine.GoogleV2 });
    var unescapeRes = unescape(res
      .replace(/\\\s?&\s*q\s*u\s*o\s*t\s*;/g, '\\"')
      .replace(/&\s*q\s*u\s*o\s*t\s*;/g, '"')
      .replace(/\s*q\s*u\s*o\s*t\s*;/g, '')
      .replace(/&([a-zA-Z\s]*?);/g, function ($0) {
      return $0.replace(/\s/g, '')
    }))
    fs.writeFileSync(convertedFilePath, resultFormatter(unescapeRes));
    console.log('convert [%s] to [%s] file [%s] successfully', appConfig.primaryLang, langCode, file);

    function resultFormatter(res) {
      var flatArr = flatten(JSON.parse(res));
      Object.keys(flatArr).forEach(item => {
        if (flatArr[item].split(' ').length <= 3) flatArr[item] = flatArr[item].replace(/\b(\w)(?![^{{]*}})/g, function ($0) { return $0.toUpperCase() });
      })
      // return JSON.stringify(unflatten(flatArr), null, 4);
      return JSON.stringify(flatArr, null, 4);
    }
  });

  return true;
}

exports.transDao = {
    loadAllTrans: loadAllTrans,
    saveAllTrans: saveAllTrans,
    convertPrimaryToOthers: convertPrimaryToOthers,
    TranslateEngine: TranslateEngine,
    translate: translate,
    save: save,
    rename: rename,
    merge: merge,
    remove: remove,
}