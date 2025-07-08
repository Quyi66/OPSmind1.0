/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    var app = angular.module('oplus.dts');

    app.run(['mockJsDataset', 'localDatasetRepo','$translate', function (mockJsDataset, localDatasetRepo,$translate) {
        // if (window.$oplus.appConfig.modules.dts.useLocalDb) {
        //     localDatasetRepo.defineLocalDataset('JS_MOCK_DATASET', 'JS_MOCK_DATASET', 'mockJsDataset');
        // }
        if (window.$oplus.appConfig.modules.dts && window.$oplus.appConfig.modules.dts.enableDemoDataset) {
            localDatasetRepo.defineLocalDataset('DEMO_CATEGORY_DS', '[DEMO]' + $translate.instant('dts.mock.indicator_data'), 'mockJsDataset');
            localDatasetRepo.defineLocalDataset('DEMO_TIME_DS', '[DEMO]' + $translate.instant('dts.mock.time_series_data'), 'mockJsDataset');
            localDatasetRepo.defineLocalDataset('DEMO_REST_DS', '[DEMO]REST' + $translate.instant('dts.mock.datasource'), 'mockJsDataset');
        }
    }]);

    app.service('mockJsDataset', mockJsDataset);

    mockJsDataset.$inject = ['$q', '$http', 'dataEx', 'restUtils', '$translate'];

    /**
     * @ngdoc
     * @name mockJsDataset
     * @description
     * Generate mock data with javascript.
     * @param $q
     * @param $http
     * @param {dataEx} dataEx
     * @param {restUtils} restUtils
     */
    function mockJsDataset($q, $http, dataEx, restUtils, $translate) {
        this.queryDatasetMeta = queryMeta;
        this.queryDataset = queryData;

        function queryMeta(code, params) {
            // if (code === 'JS_MOCK_DATASET') {
            //     return new MockDevData().getMeta();
            // } else
            if (code === 'DEMO_CATEGORY_DS') {
                return new MockCategoryData().getMeta();
            } else if (code === 'DEMO_TIME_DS') {
                return new MockTimeSeriesData().getMeta();
            } else if (code === 'DEMO_REST_DS') {
                return new LocalRestCallDs().getMeta(code, params);
            }
            throw new ReferenceError('Cannot find dataset ' + code);
        }

        function queryData(datasetCode, params) {
            // if (datasetCode === 'JS_MOCK_DATASET') {
            //     return new MockDevData().getData(params);
            // } else
            if (datasetCode === 'DEMO_TIME_DS') {
                return new MockTimeSeriesData().getData(params);
            } else if (datasetCode === 'DEMO_CATEGORY_DS') {
                return new MockCategoryData().getData(params);
            } else if (datasetCode === 'DEMO_REST_DS') {
                return new LocalRestCallDs().getData(params);
            }
            throw new ReferenceError('Cannot find dataset ' + datasetCode);
        }

        function newDate(ms) {
            return moment().add(ms, 'ms');
        }

        function randomIp() {
            return (Math.floor(Math.random() * 255) + 1) + "." + (Math.floor(Math.random() * 255) + 0) + "." + (Math.floor(Math.random() * 255) + 0) + "." + (Math.floor(Math.random() * 255) + 0);
        }

        function randomNumber(baseline, range) {
            return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * range) + baseline;
        }


        /**
         * Dataset calls REST from browser
         * @constructor
         */
        function LocalRestCallDs() {
            this.getData = getData;
            this.getMeta = getMeta;

            function getMeta(code, params) {
                var d = $q.defer();
                var paramsConfig = {
                    'url': {
                        type: 'string',
                        desc: $translate.instant('dts.mock.to_request') + 'HTTP URL。' + $translate.instant('dts.mock.request_from_browser') + '，' + $translate.instant('dts.mock.this') + URL + $translate.instant('dts.mock.must_support_cross'),
                        required: true
                    },
                    'method': {
                        type: 'string',
                        desc: 'HTTP' + $translate.instant('dts.mock.request_method') + '，' + $translate.instant('dts.mock.default_is') + 'GET',
                        required: false

                    },
                    // 'metaUrl': {
                    //     type: 'string',
                    //     desc: '用于解析结果集字段的URL。这个参数目前无法通用。如果设置了sampleResultItem，那么不用metaUrl。',
                    //     required: false
                    // },
                    'sampleResultItem': {
                        type: 'string',
                        desc: 'JSON' + $translate.instant('dts.mock.format_represents_result_set') + '，' + $translate.instant('dts.mock.parse_result_filed') + '。' + $translate.instant('dts.mock.if_field_not_set') + '，' + $translate.instant('dts.mock.automatically_called_once') + URL + $translate.instant('dts.mock.parse_result') + '。',
                        required: false
                    },
                    'resultPath': {
                        type: 'string',
                        desc: $translate.instant('dts.mock.extract') + 'REST' + $translate.instant('dts.mock.return_path_result'),
                        required: false
                    }
                    // 'p1': {type: 'string', desc: '参数{p1}', required: false},
                    // 'p2': {type: 'string', desc: '参数{p2}', required: false},
                    // 'p3': {type: 'string', desc: '参数{p3}', required: false}
                };
                var fields = {};
                if (params.sampleResultItem) {
                    var obj = JSON.parse(params.sampleResultItem);
                    Object.keys(obj).forEach(function (key) {
                        fields[key] = typeof obj[key];
                    });
                    d.resolve({fields: fields, paramsConfig: paramsConfig});
                } else {
                    // Do a test ajax call to get meta info of fields
                    var config = params;
                    config.url = params.url;
                    restUtils.callAjax(config.method, config.url).then(function (data) {
                        var record = {};
                        if (data._fields) {
                            fields = data._fields;
                        } else {
                            if (data.records.length > 0) {
                                record = data.records[0];
                            }
                            Object.keys(record).forEach(function (key) {
                                fields[key] = typeof record[key];
                            });
                        }
                        d.resolve({fields: fields, paramsConfig: paramsConfig});
                    }).catch(function (err) {
                        d.reject(err);
                    });
                }
                return d.promise;
            }

            function getData(params) {
                // return callAjax(params);
                var d = $q.defer();
                var b = Date.now();
                restUtils.callAjax(params.method, params.url, null, null, {
                    successCallback: function (data) {
                        console.log('js.getData@callback', Date.now() - b);
                        d.resolve(data);
                    },
                    errorCallback: function (err) {
                        d.reject(err);
                    }
                })/*.then(function (data) {
                    console.log('js.getData', Date.now() - b);
                    d.resolve(data);
                }).catch(function (err) {
                    d.reject(err);
                })*/;
                return d.promise;
            }
        }

        /**
         * @constructor
         */
        function MockTimeSeriesData() {
            this.getData = getData;
            this.getMeta = getMeta;


            function getMeta() {
                var fields;
                fields = {
                    'timestamp': 'date',
                    'logins': 'number',
                    'randnum': 'number',
                    'time': {
                        'connection': 'number',
                        'server': 'number',
                        'download': 'number'
                    },
                    'ip': 'string',
                    'cpu': {
                        'server_01': 'number',
                        'server_02': 'number',
                        'server_03': 'number'
                    },
                    'memory': {
                        'server_01': 'number',
                        'server_02': 'number',
                        'server_03': 'number'
                    },
                    'request': {
                        'server_01': 'number',
                        'server_02': 'number',
                        'server_03': 'number'
                    }
                };
                var paramsConfig = {
                    'startTime': {
                        type: 'date',
                        desc: $translate.instant('dts.mock.start_time'),
                        required: false
                    },
                    'endTime': {
                        type: 'date',
                        desc: $translate.instant('dts.mock.end_time'),
                        required: false
                    },
                    'interval': {
                        type: 'number',
                        desc: $translate.instant('dts.mock.interval_seconds') + '，' + $translate.instant('dts.mock.default') + '（' + $translate.instant('dts.mock.least') + '）' +
                            $translate.instant('dts.mock.for') + 10,
                        required: false
                    },
                    'numOfRec': {
                        type: 'number',
                        desc: $translate.instant('dts.mock.from') + 'endTime' + $translate.instant('dts.mock.counted_sampling_points') + '，' + $translate.instant('dts.mock.if_set_then') + 'interval' + $translate.instant('dts.mock.and') + 'startTime' + $translate.instant('dts.mock.dot_work'),
                        required: false
                    },
                };
                return $q(function (resolve, reject) {
                    resolve({
                        fields: fields,
                        paramsConfig: paramsConfig
                    });
                });
            }

            function getData(params) {
                var result = {
                    total: 0,
                    records: []
                };
                var MAX_NUM_OF_POINTS = 10000,
                    START_TIME_OFFSET_MINUTES = 2 * 60;
                var numOfPoints = params.numOfRec;
                var intervalSecs, startTime, endTime;
                startTime = params.startTime ? moment(params.startTime) : moment().subtract(START_TIME_OFFSET_MINUTES, 'minutes');
                endTime = params.endTime ? moment(params.endTime) : moment();
                var spanSecs = (endTime.valueOf() - startTime.valueOf()) / 1000;
                if (numOfPoints > 0) {
                    intervalSecs = Math.ceil(spanSecs / numOfPoints);
                } else {
                    intervalSecs = params.interval || 10;
                    numOfPoints = Math.floor(spanSecs / intervalSecs);
                }

                if (numOfPoints > MAX_NUM_OF_POINTS) {
                    numOfPoints = MAX_NUM_OF_POINTS;
                    intervalSecs = Math.floor(spanSecs / numOfPoints);
                }

                for (var i = 0; i < numOfPoints; i++) {
                    result.records.push({
                        timestamp: startTime.toDate(),
                        logins: randomNumber(60, 10),
                        randnum: Math.floor(Math.random() * 10),
                        ip: randomIp(),
                        cpu: {
                            'server_01': randomNumber(10, 3),
                            'server_02': randomNumber(15, 3),
                            'server_03': randomNumber(20, 3)
                        },
                        memory: {
                            'server_01': randomNumber(30, 5),
                            'server_02': randomNumber(40, 5),
                            'server_03': randomNumber(50, 5)
                        },
                        request: {
                            'server_01': randomNumber(100, 10),
                            'server_02': randomNumber(150, 10),
                            'server_03': randomNumber(200, 10)
                        },
                        time: {
                            'connection': randomNumber(30, 2),
                            'server': randomNumber(130, 10),
                            'download': randomNumber(200, 10)
                        }
                    });
                    startTime.add(intervalSecs, 's');
                }
                result.total = result.records.length;
                return $q(function (resolve, reject) {
                    resolve(result);
                });
            }


        }

        /**
         * @constructor
         */
        function MockCategoryData() {
            this.getData = getData;
            this.getMeta = getMeta;

            function getMeta() {
                var fields;
                fields = {
                    'key': 'string',
                    'number': 'number',
                    'status': 'string'
                };
                var paramsConfig = {
                    'keys': {
                        type: 'string',
                        desc: $translate.instant('dts.mock.separated_keywords'),
                        required: true
                    }
                };
                return $q(function (resolve, reject) {
                    resolve({
                        fields: fields,
                        paramsConfig: paramsConfig
                    });
                });
            }

            function getData(params) {
                var result = {
                    total: 0,
                    records: []
                };
                var keys = params.keys;
                if (keys) {
                    keys.split(',').forEach(function (k) {
                        var item = {
                            key: k,
                            number: randomNumber(50, 50),
                            status: 'OK'
                        };
                        result.records.push(item);
                    });
                    result.total = result.records.length;
                }
                return $q(function (resolve, reject) {
                    resolve(result);
                });
            }


        }

        function MockDevData() {
            this.getData = getData;
            this.getMeta = getMeta;

            function getMeta() {
                var fields = [{
                    name: 'timestamp',
                    type: 'date'
                },
                    {
                        name: 'message',
                        type: 'string'
                    },
                    {
                        name: 'ip',
                        type: 'string'
                    },
                    {
                        name: 'cpu',
                        type: 'number'
                    },
                    {
                        name: 'memory',
                        type: 'number'
                    },
                    {
                        name: 'passIn',
                        type: 'string'
                    },
                    {
                        name: 'number',
                        type: 'number'
                    },
                    {
                        name: 'object',
                        type: 'object'
                    },
                    {
                        name: 'constantString',
                        type: 'string'
                    },
                    {
                        name: 'user',
                        type: {
                            name: 'string',
                            age: 'number',
                            friends: [{}]
                        }
                    }
                ];
                fields = {
                    'timestamp': 'date',
                    'message': 'string',
                    'ip': 'string',
                    'passIn': 'string',
                    'number': 'number',
                    'cpu': 'number',
                    'memory': 'number',
                    'tags': [{
                        name: 'string',
                        weight: 'number'
                    }],
                    'store': {
                        books: [{
                            title: 'string',
                            author: 'string',
                            price: 'number'
                        }],
                        bicycle: {
                            color: 'string',
                            price: 'number'
                        }
                    }
                };
                var paramsConfig = {
                    'param_date': {
                        defaultValue: '',
                        desc: 'fake parameter',
                        required: true
                    },
                    'param_query': {
                        desc: 'User input query',
                        required: false
                    },
                    'param_passIn': {
                        desc: $translate.instant('dts.mock.input_parameters_returned') + "," + $translate.instant('dts.mock.verify_parameters')
                    },
                    'param_numOfRecord': {
                        defaultValue: 1,
                        type: 'number',
                        desc: $translate.instant('dts.mock.number_of_data_return'),
                        required: true
                    }
                };
                return $q(function (resolve, reject) {
                    resolve({
                        fields: fields,
                        paramsConfig: paramsConfig
                    });
                });
            }

            function getData(params) {
                if (params['_streamLastUpdate']) {
                    return genDataForStream(params);
                }
                if (params['param_query'] === 'SIMULATE_QUERY_ERROR') {
                    return $q(function (resolve, reject) {
                        reject(new Error('SIMULATE_QUERY_ERROR'));
                    });
                }
                return genDataByNum(params);

                function genDataByNum(params) {
                    var numOfRec = params.param_numOfRecord || 10;
                    var result = {
                        total: 0,
                        records: []
                    };
                    var intervalSec = 10;
                    var start = moment().subtract(numOfRec * intervalSec, 's');
                    for (var i = numOfRec; i > 0; i--) {
                        result.records.push({
                            timestamp: start.toDate(),
                            passIn: params.param_passIn,
                            message: Date.now() + '',
                            ip: randomIp(),
                            cpu: randomNumber(60, 20),
                            memory: randomNumber(80, 10),
                            number: randomNumber(100, 100),
                            constantString: 'constant',
                            store: {
                                bicycle: {
                                    color: 'red',
                                    price: randomNumber()
                                }
                            }
                        });
                        start.add(intervalSec, 's');
                    }
                    result.total = result.records.length;
                    // console.log(result.records);
                    return $q(function (resolve, reject) {
                        resolve(result);
                    });
                }

                function genDataForStream(params) {
                    var intervalSec = 1;
                    var streamLastUpdate = params['_streamLastUpdate'];
                    var span = (Date.now() - streamLastUpdate);
                    // console.log('gap', gap);
                    var numOfRec = Math.floor(span / (intervalSec * 1000));
                    var result = {
                        total: numOfRec,
                        records: []
                    };
                    var now = moment(streamLastUpdate);
                    for (var i = 0; i < result.total; i++) {
                        now.add(intervalSec, 's');
                        // now = now.subtract( delaySec, 's');
                        result.records.push({
                            timestamp: now.toDate(),
                            passIn: params.param_passIn,
                            message: params.param_passIn + ' message',
                            ip: randomIp(),
                            number: randomNumber(100, 100)
                        })
                    }
                    return $q(function (resolve, reject) {
                        resolve(result);
                    });
                }
            }

        }
    }
})();