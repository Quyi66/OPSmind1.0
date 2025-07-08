'use strict';

module.exports = {
    app: 'src/webapp/',
    dist: 'dist/www/',
    i18nDir: 'src/webapp/i18n',
    // Watch all scss, no exclusion
    sassSrc: ['src/webapp/content/**/*.scss', 'src/webapp/app/**/*.scss'],
    // LEO@20210411: Exclude bootstrap*.scss and file starts with _
    sassMain: ['!src/webapp/content/**/bootstrap*.scss', 'src/webapp/content/**/[^_]*.scss', 'src/webapp/app/**/[^_]*.scss'],
    lessSrc: ['src/webapp/content/**/*.less'],
    lessMain: ['src/webapp/content/**/[^_]*.less'],
    cssDir: 'src/webapp/content/css',
    bower: 'src/webapp/bower_components/',
    tmp: 'dist/tmp'
};
