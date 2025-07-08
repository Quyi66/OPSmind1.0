/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/04/14, created
 */
const fs = require('fs');
const appConfig = {
    // Root dir for i18n files. The names of its subdirs are language name.
    i18nDir: 'src/webapp/i18n',
    // Root dir for HTML and JS files
    htmlJsDir: 'src/webapp',
    // Dir to save cached translation references
    cacheDir: './.i18n',
    // Dir to save i18n backup files
    backupDir: './.i18n',
    oplusPortalUrl: 'http://oplus-dev/oplus-portal',
    primaryLang: 'zh-cn'
};

[appConfig.cacheDir, appConfig.backupDir].forEach(function (dir) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, {recursive: true});
})

exports.appConfig = appConfig;