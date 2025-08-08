#!/usr/bin/env node

/**
 * 复制HTML中引用的node_modules文件到dist目录
 */

const fs = require('fs');
const path = require('path');

// HTML中引用的所有node_modules文件
const requiredFiles = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/lodash/lodash.min.js',
    'node_modules/angular-animate/angular-animate.min.js',
    'node_modules/angular-aria/angular-aria.js',
    'node_modules/angular-cache-buster/angular-cache-buster.js',
    'node_modules/angular-cookies/angular-cookies.js',
    'node_modules/angular-dynamic-locale/src/tmhDynamicLocale.js',
    'node_modules/angular-file-upload/dist/angular-file-upload.min.js',
    'node_modules/angular-i18n/angular-locale_zh-cn.js',
    'node_modules/angular-legacy-sortablejs-maintained/angular-legacy-sortable.js',
    'node_modules/angular-loading-bar/build/loading-bar.css',
    'node_modules/angular-loading-bar/build/loading-bar.js',
    'node_modules/angular-resource/angular-resource.js',
    'node_modules/angular-sanitize/angular-sanitize.min.js',
    'node_modules/angular-translate-handler-log/angular-translate-handler-log.js',
    'node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
    'node_modules/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
    'node_modules/angular-translate/dist/angular-translate-storage-local/angular-translate-storage-local.js',
    'node_modules/angular-translate/dist/angular-translate.js',
    'node_modules/angular-ui-calendar/src/calendar.js',
    'node_modules/angular-ui-codemirror/src/ui-codemirror.js',
    'node_modules/angular-ui-sortable/dist/sortable.min.js',
    'node_modules/angular-ui-tinymce/src/tinymce.js',
    'node_modules/angular-vs-repeat/dist/angular-vs-repeat.js',
    'node_modules/angularjs-toaster/toaster.min.css',
    'node_modules/angularjs-toaster/toaster.min.js',
    'node_modules/animate.css/animate.min.css',
    'node_modules/bootstrap-daterangepicker/daterangepicker.css',
    'node_modules/bootstrap-daterangepicker/daterangepicker.js',
    'node_modules/c3/c3.js',
    'node_modules/clipboard/dist/clipboard.min.js',
    'node_modules/codemirror/lib/codemirror.css',
    'node_modules/codemirror/lib/codemirror.js',
    'node_modules/codemirror/mode/meta.js',
    'node_modules/codemirror/mode/css/css.js',
    'node_modules/codemirror/mode/htmlmixed/htmlmixed.js',
    'node_modules/codemirror/mode/javascript/javascript.js',
    'node_modules/codemirror/mode/markdown/markdown.js',
    'node_modules/codemirror/mode/perl/perl.js',
    'node_modules/codemirror/mode/powershell/powershell.js',
    'node_modules/codemirror/mode/properties/properties.js',
    'node_modules/codemirror/mode/python/python.js',
    'node_modules/codemirror/mode/shell/shell.js',
    'node_modules/codemirror/mode/sql/sql.js',
    'node_modules/codemirror/mode/vbscript/vbscript.js',
    'node_modules/codemirror/mode/xml/xml.js',
    'node_modules/codemirror/mode/yaml/yaml.js',
    'node_modules/codemirror/addon/mode/simple.js',
    'node_modules/codemirror/addon/edit/matchbrackets.js',
    'node_modules/codemirror/addon/edit/matchtags.js',
    'node_modules/codemirror/addon/fold/foldcode.js',
    'node_modules/codemirror/addon/fold/foldgutter.css',
    'node_modules/codemirror/addon/fold/foldgutter.js',
    'node_modules/codemirror/addon/fold/brace-fold.js',
    'node_modules/codemirror/addon/fold/xml-fold.js',
    'node_modules/codemirror/addon/fold/indent-fold.js',
    'node_modules/codemirror/addon/fold/markdown-fold.js',
    'node_modules/codemirror/addon/fold/comment-fold.js',
    'node_modules/codemirror/addon/display/autorefresh.js',
    'node_modules/codemirror/addon/display/panel.js',
    'node_modules/codemirror/addon/search/searchcursor.js',
    'node_modules/codemirror/addon/search/jump-to-line.js',
    'node_modules/codemirror/addon/search/match-highlighter.js',
    'node_modules/crypto-js/crypto-js.js',
    'node_modules/d3/d3.js',
    'node_modules/datatables.net/js/jquery.dataTables.js',
    'node_modules/datatables.net-buttons/js/dataTables.buttons.js',
    'node_modules/datatables.net-buttons/js/buttons.colVis.js',
    'node_modules/datatables.net-select/js/dataTables.select.js',
    'node_modules/diff2html/dist/diff2html.css',
    'node_modules/diff2html/dist/diff2html.js',
    'node_modules/echarts/dist/echarts.min.js',
    'node_modules/file-saver/FileSaver.min.js',
    'node_modules/fullcalendar/dist/fullcalendar.css',
    'node_modules/fullcalendar/dist/fullcalendar.min.js',
    'node_modules/html-docx-js/dist/html-docx.js',
    'node_modules/jquery-contextmenu/dist/jquery.contextMenu.css',
    'node_modules/jquery-contextmenu/dist/jquery.contextMenu.js',
    'node_modules/jquery-ui/dist/jquery-ui.js',
    'node_modules/jquery-ui/themes/base/resizable.css',
    'node_modules/jquery.fancytree/dist/jquery.fancytree-all.js',
    'node_modules/jquery.fancytree/dist/skin-awesome/ui.fancytree.css',
    'node_modules/js-beautify/js/lib/beautify-html.js',
    'node_modules/js-yaml/dist/js-yaml.min.js',
    'node_modules/leader-line/leader-line.min.js',
    'node_modules/marked/marked.min.js',
    'node_modules/moment/moment.js',
    'node_modules/moment/locale/zh-cn.js',
    'node_modules/moment/locale/zh-tw.js',
    'node_modules/ng-file-upload/dist/ng-file-upload.js',
    'node_modules/ng-infinite-scroll/build/ng-infinite-scroll.js',
    'node_modules/ngclipboard/dist/ngclipboard.min.js',
    'node_modules/ngstorage/ngStorage.js',
    'node_modules/numeral/numeral.js',
    'node_modules/opencc-js/dist/umd/full.js',
    'node_modules/select2/dist/css/select2.min.css',
    'node_modules/select2/dist/js/select2.full.js',
    'node_modules/sortablejs/Sortable.js',
    'node_modules/spectrum-colorpicker/spectrum.js',
    'node_modules/spectrum-colorpicker/i18n/jquery.spectrum-zh-cn.js',
    'node_modules/tinycolor2/tinycolor.js',
    'node_modules/xlsx/dist/xlsx.full.min.js',
    'node_modules/alertify.js/dist/js/alertify.js'
];

function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyFile(src, dest) {
    try {
        if (fs.existsSync(src)) {
            ensureDir(dest);
            fs.copyFileSync(src, dest);
            console.log(`✅ Copied: ${src}`);
        } else {
            console.log(`⚠️  Not found: ${src}`);
        }
    } catch (error) {
        console.error(`❌ Error copying ${src}:`, error.message);
    }
}

function main() {
    console.log('🔄 开始复制node_modules文件到dist目录...');
    
    let copiedCount = 0;
    let notFoundCount = 0;
    
    for (const file of requiredFiles) {
        const src = file;
        const dest = path.join('dist', file);
        
        if (fs.existsSync(src)) {
            copyFile(src, dest);
            copiedCount++;
        } else {
            console.log(`⚠️  文件不存在: ${src}`);
            notFoundCount++;
        }
    }
    
    console.log(`\n📊 复制完成:`);
    console.log(`  ✅ 成功复制: ${copiedCount} 个文件`);
    console.log(`  ⚠️  未找到: ${notFoundCount} 个文件`);
    console.log(`  📁 总计: ${requiredFiles.length} 个文件`);
}

if (require.main === module) {
    main();
}

module.exports = { requiredFiles, copyFile, main };
