// 核心库 - 使用一致的导入方式
import $ from 'jquery';
import _ from 'lodash';

// Angular 1.x 正确导入方式 - 兼容 Webpack 5
import angular from 'angular';
window.angular = angular;  // 关键：让 AngularJS 全局可见

// Angular 扩展
import 'angular-animate';
import 'angular-aria';
import 'angular-cookies';
import 'angular-resource';
import 'angular-sanitize';
import 'angular-touch';

// UI 路由
import '@uirouter/angularjs';

// Angular 插件
import 'angular-translate';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';
import 'angular-translate-loader-static-files';
import 'angular-loading-bar';
import 'angular-file-upload';
import 'angular-marked';
import 'angularjs-toaster';
import 'angular-ui-calendar';
import 'angular-ui-codemirror';
import 'angular-ui-sortable';
import 'angular-ui-tinymce';
import 'angular-vs-repeat';
import 'ngstorage';
import 'angular-cache-buster';
import 'angular-dynamic-locale';
import 'ng-infinite-scroll';
import 'ngclipboard';

// UI Router (本地文件)
import '../webapp/lib/ui-router/ui-router-core.js';
import '../webapp/lib/ui-router/ui-router-angularjs.js';
import '../webapp/lib/ui-router/stateEvents.js';
import '../webapp/lib/ui-router/ui-router-sticky-states.js';

// 密码强度检测 (本地文件)
import '../webapp/lib/ng-password-meter/ng-password-meter.js';
import '../webapp/lib/ng-password-meter/ng-password-meter.css';

// UI 组件
import 'bootstrap';
import 'jquery-ui';
import 'select2';
import 'bootstrap-daterangepicker';

// 数据可视化
import 'echarts';
import c3 from 'c3';
import 'd3';
import 'fullcalendar';
import FullCalendar from 'fullcalendar';

// 编辑器
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/mode/simple';

// 数据表格 - 确保正确的加载顺序
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-scroller';
import 'datatables.net-select';

// 树形控件
import 'jquery.fancytree';
import 'jquery-contextmenu';

// 工具库
import 'moment';
import 'file-saver';
import 'clipboard';
import 'js-beautify';
import 'js-yaml';
import 'diff2html';
import 'crypto-js';
// alertify.js 已在 index.html 中通过 script 标签加载

// Excel 相关
import 'xlsx';

// 动画
import 'animate.css';

// 样式
import 'bootstrap/dist/css/bootstrap.css';
import 'select2/dist/css/select2.css';
import 'fullcalendar/dist/fullcalendar.css';
import 'angularjs-toaster/toaster.css';
import 'angular-loading-bar/build/loading-bar.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'jquery.fancytree/dist/skin-awesome/ui.fancytree.css';
import 'jquery-contextmenu/dist/jquery.contextMenu.css';
import 'diff2html/dist/diff2html.css';
// alertify.css 样式文件保留，因为需要通过webpack处理

// FontAwesome
import '@fortawesome/fontawesome-free/css/all.css';

// 导入其他依赖
import moment from 'moment';

// 设置全局变量（兼容旧代码，确保所有模块都可以全局访问）
window.jQuery = window.$ = $;
window.angular = angular;
window._ = window.lodash = _;
window.moment = moment;
window.CodeMirror = CodeMirror;
window.c3 = c3;
window.FullCalendar = FullCalendar;

// 导入并设置其他全局变量
import numeral from 'numeral';
import { saveAs } from 'file-saver';
import ClipboardJS from 'clipboard';
import jsyaml from 'js-yaml';
import marked from 'marked';
import echarts from 'echarts';
import d3 from 'd3';
import CryptoJS from 'crypto-js';
import tinycolor from 'tinycolor2';
import * as XLSX from 'xlsx';
import { html as beautifyHtml } from 'js-beautify';
import diff2html from 'diff2html';
import Sortable from 'sortablejs';

// 设置为全局变量
window.numeral = numeral;
window.saveAs = saveAs;
window.ClipboardJS = ClipboardJS;
window.yaml = window.jsyaml = jsyaml;
window.marked = marked;
window.echarts = echarts;
window.d3 = d3;
window.CryptoJS = CryptoJS;
window.tinycolor = tinycolor;
window.XLSX = XLSX;
window.beautify = { html: beautifyHtml };
window.diff2html = diff2html;
window.Sortable = Sortable;

// alertify 已在 index.html 中通过 script 标签加载，无需重复导入

// Summernote 富文本编辑器 (只导入JS，CSS已经在项目中)
import 'summernote/dist/summernote-bs4.min.js';
console.log('✅ Summernote loaded');

// 验证 angular 对象
if (typeof angular !== 'object' || typeof angular.module !== 'function') {
    console.error('❌ Angular module loading failed! angular.module is not a function');
    console.error('Angular object:', angular);
    console.error('typeof angular:', typeof angular);
    console.error('angular.module:', angular.module);
} else {
    console.log('✅ Angular loaded successfully, module function available');
    console.log('Angular version:', angular.version);
}

console.log('✅ Vendors loaded successfully'); 