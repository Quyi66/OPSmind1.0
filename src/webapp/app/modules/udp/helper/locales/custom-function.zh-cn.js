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
        customFunctions.locale('zh-cn', {
            'toDate': {
                desc: '将值转换成日期，例如<code>toDate("2017-11-01-00.50","YYYY-MM-DD-HH.mm")</code>\n' +
                    '@param value {string} 字符串表示的日期\n' +
                    '@param format {string} 日期的格式\n' +
                    '@return {date} 转换后日期，如果是无效日期，返回空值'
            },
            'formatDate': {
                desc: '格式化日期\n' +
                    '@param date {*} 可以是字符串、日期、整数。具体支持格式见 <a href="https://momentjs.com/docs/#/parsing/" class="btn-link" target="_blank">Moment.js</a>\n' +
                    '@return {string} 日期字符串'
            },
            'addDate': {
                desc: '在日期上偏移一个时间段\n' +
                    '@param date {*} 日期，如果为null或者空字符串，则为当前时刻\n' +
                    '@param span {number} 偏移的时间量，如果为负值则为向前推，如果为正数则向后推\n' +
                    '@param unit {string} 时间单位，支持"years","months","weeks","days","hours","minutes","seconds"\n' +
                    '@return {date} 偏移后的日期'
            },
            'timeDiff': {
                desc: '计算两个时间点之间的时长\n' +
                    '@param before {date|string|number} 开始时间，可以是日期、字符串日期、或微秒数\n' +
                    '@param now {date|string|number} 结束时间\n' +
                    '@return {string} 用`hh:mm:ss`表示两个时间点之间的时长'
            },
            'toNumber': {
                desc: '转换为数值\n' +
                    '@param data {*} 支持的格式见 <a class="btn-link" href="http://numeraljs.com/#create" target="_blank">Numeral.js</a>\n' +
                    '@return {number} 数值'
            },
            'formatNumber': {
                desc: '格式化数值，返回字符串\n' +
                    '@param value {number} \n' +
                    '@param format {string} 支持的格式见<a class=btn-link" href="http://numeraljs.com/#format" target="_blank">Numeral.js</a>\n' +
                    '@return {string} 格式化后的字符串'
            },
            'qdata': {
                desc: '查询数据集，异步返回一个值、一维数组、或者二维数组。二维数组可以用于构建下拉列表的数据。数据处理顺序：' +
                    '(1)查询数据集（code+params） - (2)过滤数据（filter） - (3)抽取字段（fields） 或\n' +
                    '(1)查询数据集（code+params） - (2)数据处理（transformFn） \n' +
                    '@param code {string} 数据集代码\n' +
                    '@param params {object} 数据集查询参数，格式为<code>{参数名1:参数值1,参数名2:参数值2}</code>\n' +
                    '@param fields {[string]|string} 需要从结果集中取哪些字段作为数据项。' +
                    '<li>如果是一个字符串，数据项为该字段的值</li>' +
                    '<li>如果是一个字符串数组，数据项为一个数组，其中每个元素为对应字段的值。如果是空的数组<code>[]</code>，数据项包含所有字段的值。</li>' +
                    '<li>如果是<code>null</code>、<code>""</code>，数据项包含所有字段</li>\n' +
                    '@param filter {null|number} 返回结果的过滤。' +
                    '<li>如果为空，返回数组</li>' +
                    '<li>如果是一个整数，代表返回第几个数据项，0代表第一项</li>\n' +
                    '@param transformFn {function(data)?} 数据处理函数，可以对数据集的数据进行任意处理，函数的返回值为最终得到的数据。' +
                    '如果定义了处理函数，前面的<code>fields</code>、<code>filter</code>将无效。' +
                    '函数参数<code>data</code>为查询结果<code>{total:number,records:[]}</code>, ' +
                    '也可以使用简化形式<code>qdata("code",{param1:value1},transformFn)</code>\n' +
                    '@return {Promise} 异步返回数据'
            },
            'callApi': {
                desc: '调用RESTful API\n' +
                    '@param module {string} 模块名\n' +
                    '@param method {string} 可以是GET POST DELETE PUT\n' +
                    '@param apiPath {string} 要调用的URL，可以用{}包含变量\n' +
                    '@param apiPathVars {object=} URL的变量值\n' +
                    '@param apiParams {object=} JSON格式提交的数据\n' +
                    '@param onSuccess {function=} 数据处理函数，返回值将作为异步处理的最终结果\n' +
                    '@return {Promise} 异步返回Ajax请求结果数据'
            },
            'ajax': {
                desc: '调用Ajax\n' +
                    '@param method {string} 可以是GET POST DELETE PUT\n' +
                    '@param url {string} 要调用的URL，可以用{}包含变量\n' +
                    '@param urlVars {object=} URL的变量值\n' +
                    '@param params {object=} JSON格式提交的数据\n' +
                    '@return {Promise} 异步返回Ajax请求结果数据'
            },
            'downloadFile': {
                desc: '下载文件\n' +
                    '@param type {string} 下载的文件库类型，目前支持`staticfs`指文件库\n' +
                    '@param path {string} 要下载的文件相对文件库的路径\n' +
                    '@param saveFilename {string=} 可选，下载后另存的文件名'
            },
            '_rand': {
                desc: '用于测试，生成一个0到指定上限的随机整数\n' +
                    '@param range {number|array} 如果是整数，为随机数值的上限；如果是数组，则为随机的内容\n' +
                    '@return {*} 0到指定上限的随机整数，或者数组中的随机值'
            },
            '_mocker': {
                desc: '用于测试，生成一个模拟数据\n' +
                    '@return {string} '
            },
            '_timeout': {
                desc: '用于测试，生成一个延时的promise'
            },
            'joinDs': {
                desc: '(dev) 查询多个数据集，并对结果按字段进行关联\n' +
                    '@param datasets {array} 数据集列表，每个元素为{id:string, params:object, filter:number|null, fields:string|[string]}\n' +
                    '@param joinFields {[string]} 关联字段\n' +
                    '@return {Promise} 异步返回数据数组'
            },
            'runJob': {
                desc: '执行一个作业\n' +
                    '@param jobId {string} 作业ID\n' +
                    '@param option {object} 作业运行设置选项\n' +
                    '@param option.callId {string} 调用ID\n' +
                    '@param option.params {object} 作业运行参数\n' +
                    '@param success {function(res)} 作业成功后的回调函数，其中res为作业执行结果\n' +
                    '@return {Promise} 异步返回callback处理后的数据，如果没有定义callback，直接返回作业结果'
            }
        });
    }
})();
