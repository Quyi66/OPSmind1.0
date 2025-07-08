/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2021/12/07
 */
(function () {
    var app = angular.module('oplus.udp');

    app.run(['customFunctions', init]);

    /**
     *
     * @param {customFunctions} customFunctions
     */
    function init(customFunctions) {
        customFunctions.locale('zh-tw', {
            'toDate': {
                desc: '將值轉換成日期，例如<code>toDate("2017-11-01-00.50","YYYY-MM-DD-HH.mm")</code>\n' +
                    '@param value {string} 字串表示的日期\n' +
                    '@param format {string} 日期的格式\n' +
                    '@return {date} 轉換後日期，如果是無效日期，返回空值'
            },
            'formatDate': {
                desc: '格式化日期\n' +
                    '@param date {*} 可以是字串、日期、整數。具體支援格式見 <a href="https://momentjs.com/docs/#/parsing/" class="btn-link" target="_blank">Moment.js</a>\n' +
                    '@return {string} 日期字串'
            },
            'addDate': {
                desc: '在日期上偏移一個時間段\n' +
                    '@param date {*} 日期，如果為null或者空字串，則為當前時刻\n' +
                    '@param span {number} 偏移的時間量，如果為負值則為向前推，如果為正數則向後推\n' +
                    '@param unit {string} 時間單位，支援"years","months","weeks","days","hours","minutes","seconds"\n' +
                    '@return {date} 偏移後的日期'
            },
            'timeDiff': {
                desc: '計算兩個時間點之間的時長\n' +
                    '@param before {date|string|number} 開始時間，可以是日期、字串日期、或微秒數\n' +
                    '@param now {date|string|number} 結束時間\n' +
                    '@return {string} 用`hh:mm:ss`表示兩個時間點之間的時長'
            },
            'toNumber': {
                desc: '轉換為數值\n' +
                    '@param data {*} 支援的格式見 <a class="btn-link" href="http://numeraljs.com/#create" target="_blank">Numeral.js</a>\n' +
                    '@return {number} 數值'
            },
            'formatNumber': {
                desc: '格式化數值，返回字串\n' +
                    '@param value {number} \n' +
                    '@param format {string} 支援的格式見<a class=btn-link" href="http://numeraljs.com/#format" target="_blank">Numeral.js</a>\n' +
                    '@return {string} 格式化後的字串'
            },
            'qdata': {
                desc: '查詢資料集，非同步返回一個值、一維陣列、或者二維陣列。二維陣列可以用於構建下拉列表的資料。資料處理順序：' +
                    '(1)查詢資料集（code+params） - (2)過濾資料（filter） - (3)抽取欄位（fields） 或\n' +
                    '(1)查詢資料集（code+params） - (2)資料處理（transformFn） \n' +
                    '@param code {string} 資料集程式碼\n' +
                    '@param params {object} 資料集查詢引數，格式為<code>{引數名1:引數值1,引數名2:引數值2}</code>\n' +
                    '@param fields {[string]|string} 需要從結果集中取哪些欄位作為資料項。' +
                    '<li>如果是一個字串，資料項為該欄位的值</li>' +
                    '<li>如果是一個字串陣列，資料項為一個數組，其中每個元素為對應欄位的值。如果是空的陣列<code>[]</code>，資料項包含所有欄位的值。</li>' +
                    '<li>如果是<code>null</code>、<code>""</code>，資料項包含所有欄位</li>\n' +
                    '@param filter {null|number} 返回結果的過濾。' +
                    '<li>如果為空，返回陣列</li>' +
                    '<li>如果是一個整數，代表返回第幾個資料項，0代表第一項</li>\n' +
                    '@param transformFn {function(data)?} 資料處理函式，可以對資料集的資料進行任意處理，函式的返回值為最終得到的資料。' +
                    '如果定義了處理函式，前面的<code>fields</code>、<code>filter</code>將無效。' +
                    '函式引數<code>data</code>為查詢結果<code>{total:number,records:[]}</code>, ' +
                    '也可以使用簡化形式<code>qdata("code",{param1:value1},transformFn)</code>\n' +
                    '@return {Promise} 非同步返回資料'
            },
            'callApi': {
                desc: '呼叫RESTful API\n' +
                    '@param module {string} 模組名\n' +
                    '@param method {string} 可以是GET POST DELETE PUT\n' +
                    '@param apiPath {string} 要呼叫的URL，可以用{}包含變數\n' +
                    '@param apiPathVars {object=} URL的變數值\n' +
                    '@param apiParams {object=} JSON格式提交的資料\n' +
                    '@param onSuccess {function=} 資料處理函式，返回值將作為非同步處理的最終結果\n' +
                    '@return {Promise} 非同步返回Ajax請求結果資料'
            },
            'ajax': {
                desc: '呼叫Ajax\n' +
                    '@param method {string} 可以是GET POST DELETE PUT\n' +
                    '@param url {string} 要呼叫的URL，可以用{}包含變數\n' +
                    '@param urlVars {object=} URL的變數值\n' +
                    '@param params {object=} JSON格式提交的資料\n' +
                    '@return {Promise} 非同步返回Ajax請求結果資料'
            },
            'downloadFile': {
                desc: '下載檔案\n' +
                    '@param type {string} 下載的檔案庫型別，目前支援`staticfs`指檔案庫\n' +
                    '@param path {string} 要下載的檔案相對檔案庫的路徑\n' +
                    '@param saveFilename {string=} 可選，下載後另存的檔名'
            },
            '_rand': {
                desc: '用於測試，生成一個0到指定上限的隨機整數\n' +
                    '@param range {number|array} 如果是整數，為隨機數值的上限；如果是陣列，則為隨機的內容\n' +
                    '@return {*} 0到指定上限的隨機整數，或者陣列中的隨機值'
            },
            '_mocker': {
                desc: '用於測試，生成一個模擬資料\n' +
                    '@return {string} '
            },
            '_timeout': {
                desc: '用於測試，生成一個延時的promise'
            },
            'joinDs': {
                desc: '(dev) 查詢多個數據集，並對結果按欄位進行關聯\n' +
                    '@param datasets {array} 資料集列表，每個元素為{id:string, params:object, filter:number|null, fields:string|[string]}\n' +
                    '@param joinFields {[string]} 關聯欄位\n' +
                    '@return {Promise} 非同步返回資料陣列'
            },
            'runJob': {
                desc: '執行一個作業\n' +
                    '@param jobId {string} 作業ID\n' +
                    '@param option {object} 作業執行設定選項\n' +
                    '@param option.callId {string} 呼叫ID\n' +
                    '@param option.params {object} 作業執行引數\n' +
                    '@param success {function(res)} 作業成功後的回撥函式，其中res為作業執行結果\n' +
                    '@return {Promise} 非同步返回callback處理後的資料，如果沒有定義callback，直接返回作業結果'
            }
        });
    }
})();
