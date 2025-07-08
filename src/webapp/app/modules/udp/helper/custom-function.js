/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/30/2017
 */
(function () {
    var app = angular.module('oplus.udp');

    app.run(['$q', "gfileService", 'datasetService', 'customFunctions', 'dataEx', '$timeout', '$http', 'restUtils', 'OpDownload', 'messageService', '$translate', initFunctions]);

    app.service('customFunctions', ['devel', '$translate', customFunctions]);

    /**
     * @ngdoc service
     * @name customFunctions
     * @param {devel} devel
     * @param $translate
     */
    function customFunctions(devel, $translate) {
        var registry = {};
        var translations = {};
        window.$$ = window.$$ || {};
        this.defineFunction = defineFunction;
        this.getAllFunctions = getAllFunctions;
        this.locale = locale;

        function locale(langKey, trans) {
            if (!translations [langKey]) {
                translations[langKey] = {};
            }
            _.merge(translations[langKey], trans);
        }

        /**
         * Define a custom function
         * @param name {string}
         * @param def {object}
         * @param def.func {function} Function body
         * @param def.desc {string} Description
         * @param def.group {string} Group
         * @param def.name {string} Name
         * @param def.sample {string} Sample code placeholder
         */
        function defineFunction(name, def) {
            if (!devel.isClientInDevMode() && def.group === 'dev') {
            } else {
                def.name = name;
                var desc = parseFuncDesc(def.desc);
                registry[name] = _.merge({name: name, func: def.func, sample: def.sample}, desc);
            }
            window.$$[name] = def.func;
        }

        /**
         * Get all function definitions
         * @returns {{function_name:{sample:string}}}
         */
        function getAllFunctions() {
            var result = angular.copy(registry);
            Object.keys(result).forEach(function (name) {
                var trans = translations[$translate.use()];
                if (trans && trans[name]) {
                    var desc = parseFuncDesc(trans[name].desc);
                    _.merge(result[name], desc);
                } else {
                }
            });
            return result;
        }

        /**
         *
         * @param desc
         * @return {{returns: string, params: [{name:string,type:string,desc:string}], desc: string}}
         */
        function parseFuncDesc(desc) {
            var result = {desc: '', params: [], returns: ''};
            var descs = [];
            (desc || '').split('\n').forEach(function (str) {
                var matches = str.match(/@param\s+?([^\s]*)\s*([^\s]*)\s*(.*)/);
                if (matches) {
                    result.params.push({name: matches[1], type: matches[2], desc: matches[3]});
                } else {
                    matches = str.match(/@return\s+?([^\s]*)\s*(.*)/);
                    if (matches) {
                        result.returns = {type: matches[1], desc: matches[2]};
                    }
                }
                if (!matches) {
                    descs.push(str);
                }
            });
            result.desc = descs.join('<br/>');
            return result;
        }
    }

    /**
     *
     * @param {$q} $q
     * @param {gfileService} gfileService
     * @param {datasetService} datasetService
     * @param {customFunctions} cf
     * @param {dataEx} dataEx
     * @param $timeout
     * @param $http
     * @param {restUtils} restUtils
     * @param {OpDownload} OpDownload
     * @param {messageService} messageService
     * @param $translate
     */
    function initFunctions($q, gfileService, datasetService, cf, dataEx, $timeout, $http, restUtils, OpDownload, messageService, $translate) {
        // cf.defineFunction('excelDate', {
        //     func: function (number) {
        //         return new Date((number - (25567 + 1)) * 86400 * 1000);
        //     },
        //     group: 'dev',
        //     sample: 'excelDate(date)',
        //     desc: '将Excel的日期（整数）转换为Javascript日期'
        // });
        cf.defineFunction('toDate', {
            func: function (value, format) {
                return moment(value, format).toDate();
            },
            group: 'conversion',
            sample: 'toDate(value,"YYYY-MM-DD HH:mm:ss")'
        });
        cf.defineFunction('translate', {
            func: function (value) {
                return $translate.instant(value);
            },
            group: 'conversion',
            sample: 'translate(value)'
        });
        cf.defineFunction('formatDate', {
            func: function (value, format) {
                var result = moment(value).format(format);
                if (result === 'Invalid date') {
                    result = '';
                }
                return result;
            },
            group: 'conversion',
            sample: 'formatDate(date,"YYYY-MM-DD HH:mm:ss")'
        });
        cf.defineFunction('addDate', {
            func: function (date, span, unit) {
                date = date || new Date();
                return moment(date).add(span, unit).toDate();
            },
            group: 'conversion',
            sample: 'addDate(date,length,unit)'
        });
        cf.defineFunction('timeDiff', {
            func: function (before, now, unit) {
                var end = moment(now);
                var start = moment(before);
                if (end.isValid() && start.isValid()) {
                    var ms = end.diff(start);
                    var d = moment.duration(ms);
                    return Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
                }
                return now - before;
            },
            group: 'conversion',
            sample: 'timeDiff(before,now)'
        });
        cf.defineFunction('toNumber', {
            func: function (data) {
                return numeral(data).value();
            },
            sample: 'toNumber(data)',
            group: 'conversion'
        });
        cf.defineFunction('formatNumber', {
            func: function (value, format) {
                return numeral(value).format(format);
            },
            group: 'conversion',
            sample: 'formatNumber(value,format)'
        });
        cf.defineFunction('qdata', {
            func: function qdata(code, params, fields, filter, transformFn) {
                var d = $q.defer();
                // console.log(code,params);
                datasetService.queryDataset(code, params).then(function (data) {
                    var result;
                    if (angular.isFunction(fields)) {
                        transformFn = fields;
                    }
                    if (angular.isFunction(transformFn)) {
                        var res = transformFn(data);
                        d.resolve(res);
                    } else {
                        if (angular.isNumber(filter)) {
                            result = pickItem(data, filter);
                            // console.log('result', result);
                        } else {
                            result = [];
                            var records = angular.isArray(data) ? data : data.records;
                            if (angular.isArray(records)) {
                                data.records.forEach(function (o, i) {
                                    result.push(pickItem(data, i));
                                });
                            }
                        }
                        d.resolve(result);
                    }
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;

                function pickItem(data, i) {
                    var record = data.records[i];
                    // if (angular.isFunction(transformFn)) {
                    //     transformFn(record);
                    // }
                    var obj;
                    if (!fields || _.isEmpty(fields)) {
                        obj = record;
                    } else {
                        obj = [];
                        if (angular.isArray(fields)) {
                            // If fields is array, return value array of these fields
                            // If fields not specified, try get all fields
                            // if (i === 0 && (!fields || fields.length === 0)) {
                            //     fields = Object.keys(record);
                            // }
                        } else if (angular.isString(fields)) {
                            // If fields is a string, return value of this field
                            // console.log('pathValue===', fields);
                            return parseValue(record, fields);
                        }
                        fields.forEach(function (f) {
                            obj.push(parseValue(record, f));
                        });
                    }
                    return obj;
                }

                function parseValue(item, field) {
                    var value = dataEx.pathValue(item, field);
                    // if (angular.isFunction(transformFn)) {
                    //     return transformFn(value);
                    // }
                    return value;
                }

            },
            sample: 'qdata("code",{param1:value1},["field1","field2"],filter,transformFn)',
            desc: 'Query dataset and return result asynchronously. \n' +
                '@param code {string} Dataset code\n',
            group: 'query'
        });
        cf.defineFunction('callApi', {
            func: function callApi(module, method, apiPath, apiPathVars, apiParams, onSuccess) {
                var d = $q.defer();
                restUtils.callApi(module, method, apiPath, apiPathVars, apiParams).then(function success(data) {
                    var result = data;
                    if (angular.isFunction(onSuccess)) {
                        try {
                            result = onSuccess(data);
                            d.resolve(result);
                        } catch (err) {
                            d.reject(err);
                        }
                    } else {
                        d.resolve(result);
                    }
                }).catch(function error(err) {
                    d.reject(err);
                });
                return d.promise;
            },
            sample: 'callApi("acm","/api/acm/cit/code/{code}",{code:"linux"},null,function(data){return data;})',
            group: 'query'
        });
        cf.defineFunction('download', {
            func: function download(module, url, fileName, method, params, data) {
                OpDownload.download(restUtils.getApiUrl(module, url), fileName, method, params, data)
            },
            sample: '',
            group: 'query'
        });
        cf.defineFunction('ajax', {
            func: function ajax(method, url, urlVars, params, onSuccess) {
                var d = $q.defer();
                if (!(/^http(s)?:\/\//.test(url))) {
                    url = restUtils.getApiUrl('_default', url, urlVars);
                }
                restUtils.callAjax(method, url, urlVars, params).then(function success(data) {
                    var result = data;
                    if (angular.isFunction(onSuccess)) {
                        result = onSuccess(data);
                    }
                    d.resolve(result);
                }).catch(function error(err) {
                    d.reject(err);
                });
                return d.promise;
            },
            sample: 'ajax("GET","http://example.host/users/{user}/repos/{repo}",{user:"foo",repo:"bar"},null,function(data){return data.videos;})',
            group: 'query'
        });
        cf.defineFunction('downloadFile', {
            func: function (type, path, saveFilename, repo) {
                //注意（repo）：本地获取不到81的tenantId，如果测试请手动填写tenantId
                restUtils.callApi('gfs', 'GET', '/api/gfs/v2/{type}/f/{repo}/file/{path}', {
                    type: type || 'GIT',
                    repo: repo,
                    path: path
                }, {isContent: true}).then(function (data) {
                    var InterceptValue = saveFilename.substring(saveFilename.length - 4);
                    //TODO: why only xlsx?
                    if ('xlsx' === InterceptValue) {
                        var url = restUtils.getApiUrl('gfs', '/api/gfs/{type}/r/$tnt/download/{path}', {
                            type: type,
                            path: path
                        });
                        OpDownload.download(url, saveFilename);
                    } else {
                        gfileService.openFileContentViewer(type, repo, path, saveFilename);
                    }
                }).catch(function (err) {
                    if (err.message.indexOf("FileNotFoundException") != -1) {
                        messageService.toast('info', $translate.instant('common.action.download'), $translate.instant('gfs.download.wait_message'));
                    } else {
                        messageService.toast('error', $translate.instant('common.action.download'), err.message);
                    }
                });
            },
            group: 'file',
            sample: 'downloadFile("staticfs","","")'
        })
        cf.defineFunction('_rand', {
            func: function (range) {
                if (angular.isArray(range)) {
                    var index = Math.round(Math.random() * 10) % range.length;
                    return range[index];
                }
                var max = parseInt(range);
                return _.random(max);
            },
            group: 'dev',
            sample: '_rand(option)'
        });
        cf.defineFunction('_mocker', {
            func: function () {
                return {
                    mockIp: function () {
                        return _.random(10, 255) + '.' + _.random(10, 255) + '.' + _.random(10, 255) + '.' + _.random(10, 255);
                    }
                }
            },
            group: 'dev',
            sample: '_rand(option)'
        });
        cf.defineFunction('_timeout', {
            func: function _timeout(fn, delay) {
                return $timeout(fn, delay);
            },
            group: 'dev',
            sample: '_timeout(fn,0)'
        });
        cf.defineFunction('joinDs', {
            func: function joinDs(datasets, joinFields) {
                var d = $q.defer(), promises = [];
                datasets.forEach(function (ds) {
                    promises.push($$.qdata(ds.id, ds.params, ds.fields, ds.filter));
                });
                $q.all(promises).then(function (results) {
                    d.resolve(joinArrays(results, joinFields));
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;

                function joinArrays(arrays, fields) {
                    if (!angular.isArray(arrays)) {
                        throw new Error('Argument arrays must be array, now is ' + JSON.stringify(arrays));
                    }
                    var pkMap = {};
                    for (var i = 0; i < arrays.length; i++) {
                        var array = arrays[i];
                        if (!angular.isArray(array)) {
                            if (angular.isDefined(array))
                                console.warn('Each item of arrays must be array, now is ' + JSON.stringify(array), arrays);
                        } else {
                            for (var j = 0; j < array.length; j++) {
                                var pk = {}, item = array[j];
                                if (angular.isObject(item)) {
                                    fields.forEach(function (f) {
                                        pk[f] = item[f];
                                    });
                                    var key = JSON.stringify(pk);
                                    if (!pkMap[key]) {
                                        pkMap[key] = {};
                                    }
                                    Object.keys(item).forEach(function (f) {
                                        pkMap[key][f] = item[f];
                                    });
                                }
                            }
                        }
                    }
                    // console.log(arrays,pkMap);
                    return _.values(pkMap);
                }
            },
            sample: 'joinDs([{id:"",params:{}}]},["field1","field2"])',
            group: 'query'
        });
        cf.defineFunction('runJob', {
            func: function runJob(jobId, option, callback) {
                var d = $q.defer();
                // console.log('runJob', jobId, option);
                restUtils.callApi('jao', 'POST', '/api/jao/jobs/{id}/run', {id: jobId}, {
                    callId: option.callId,
                    params: option.params
                }).then(function (res) {
                    // console.log('res', res);
                    if (angular.isFunction(callback)) {
                        d.resolve(callback(res, undefined));
                    } else {
                        d.resolve(res);
                    }
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            },
            group: 'data',
            sample: 'runJob(' +
                '"job12345",' +
                '{callId:"pms-1",params:{server:"server1"}},' +
                'function(res){' +
                '  return res.data;' +
                '}' +
                ')'
        });
        cf.defineFunction('toTableHtml', {
            func: function (data, columnDefs, options) {
                var defaultOptions = {style: '', header: false};
                options = _.extend({}, defaultOptions, options);
                if (angular.isUndefined(data)) {
                    return '';
                }
               // if (angular.isArray(data) && data.length>0) {
               //      var first=data[0];
               //      if (angular.isObject(first)){
               //
               //      }else if (angular.isArray(first)){
               //          // data = _.map(data,function(o){return })
               //      }
               //
               //  } else if (angular.isObject(data)) {
               //
               //  }
                if (angular.isArray(data) && data.length > 0) {
                    var sampleItem = data[0];
                    if (!columnDefs || columnDefs.length === 0) {
                        columnDefs = _.map(Object.keys(sampleItem), function (o) {
                            return {field: o};
                        });
                    }
                    var thead = '';
                    if (options.header === true) {
                        thead = '<thead><tr>';
                        columnDefs.forEach(function (header) {
                            thead += '<th>' + (header.title || header.field || '') + '</th>';
                        });
                        thead += '</tr></thead>';
                    }
                    var tbody = '<tbody>';
                    data.forEach(function (item) {
                        tbody += '<tr>';
                        columnDefs.forEach(function (header) {
                            tbody += '<td>' + (item[header.field] || '') + '</td>';
                        });
                        tbody += '</tr>';
                    });
                    tbody += '</tbody>';
                    var html = '<table class="table-borderless table-sm">' + thead + tbody + '</table>';
                    return html;
                } else if (angular.isObject(data)) {
                    return JSON.stringify(data);
                }
                return data;
            },
            group: 'data',
            sample: 'toTableHtml(' +
                '${array_data} /* List of object data item */,' +
                '[{field:"ip",title:"IP"},{field:"mac",title:"MAC"]/* Optional, column definitions */,' +
                '{header:false} /* Optional, show table header or not*/' +
                ')'
        });
    }
})();
