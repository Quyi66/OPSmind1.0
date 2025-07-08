/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/1/2017
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('restUtils', ['$q', '$http', '$state', 'Upload', 'messageService', '$translate','currentUser', restUtils]);
    angular.module('oplus.commons').run(['restUtils', function (restUtils) {
        // console.log('restUtils.initApiBaseUrls...');
        Object.keys(window.$oplus.appConfig.apiBaseUrls).forEach(function (module) {
            restUtils.registerModuleApi(module, window.$oplus.appConfig.apiBaseUrls[module]);
        });
    }]);

    /**
     * @ngdoc service
     * @name restUtils
     * @description
     * A wrapper service for easily calling RESTful APIs.
     * The API base URL for different modules may vary.
     * Before calling API, your app should initialize module base URL
     * by [restUtils.registerModuleApi](#registerModuleApi).
     * @param $q
     * @param {$http} $http
     * @param Upload
     * @param {messageService} messageService
     */
    function restUtils($q, $http, $state, Upload, messageService, $translate,currentUser) {
        // API base URLs for modules
        var prefix = window.location.protocol + "//" + window.location.host + window.location.pathname;

        var moduleApiBaseUrls = {
            '_default': prefix.substr(0, prefix.length - 1)
        };

        this.callApi = callApi;
        this.callUpload = callUpload;
        this.getApiUrl = getApiUrl;
        this.sendEmail = sendEmail;
        this.guessError = guessError;
        this.registerModuleApi = registerModuleApi;
        this.callAjax = callAjax;
        this.containsMultipart = containsMultipart;
        this.addErrorTranslator = addErrorTranslator;
        var errorTranslators = {};

        function addErrorTranslator(module, fnTranslator) {
            errorTranslators[module] = fnTranslator;
        }

        /**
         * Register API base URL for module
         * @example
         * restUtils.registerModuleApi('foo','http://192.168.1.111:8080/foo')
         * @memberOf restUtils
         * @param module {string} Module name
         * @param baseUrl {string} Base URL for module API
         */
        function registerModuleApi(module, baseUrl) {
            var value = moduleApiBaseUrls[module];
            if (value && value !== baseUrl) {
                throw new Error('API of module ' + module + ' has been registered to ' + value);
            }
            moduleApiBaseUrls[module] = baseUrl;
        }

        /**
         *
         * @param to
         * @param subject
         * @param content
         * @param options
         * @returns {promise}
         */
        function sendEmail(to, subject, content, options) {
            return callApi('email', 'POST', '/api/email', null, {
                to: to,
                subject: subject,
                content: content
            });
        }

        function replaceVarsInUrl(url, apiPathVars) {
            var result = url;
            if (apiPathVars) {
                Object.keys(apiPathVars).forEach(function (name) {
                    var value = apiPathVars[name];
                    if (value === null || value === undefined) {
                        throw new TypeError('Parameter "{' + name + '}" is missing in URL "' + url + '"');
                    }
                    result = result.replace('{' + name + '}', value);
                });
            }
            return result;
        }

        /**
         * A utility method to get API URL, avoiding concatenate string.
         * Example, assuming base URL for `foo` module is http://some.host:8080/foo, then
         * ```javascript
         * restUtils.getApiUrl('foo','/api/test/{aa}/{bb}',{aa:'1',bb:'2'})
         * // ==> "http://some.host:8080/udp/api/test/1/2"
         * ```
         * @memberOf restUtils
         * @param module {string}
         * @param apiPath {string} API path with variables wrapped within `{}`.
         * If path starts with `http(s)://`, return itself
         * @param apiPathVars {object=} Values used for replacing variables in API path
         * @returns {string} Actual URL for API path
         */
        function getApiUrl(module, apiPath, apiPathVars) {
            if (/http(s)?:\/\//.test(apiPath)) {
                return replaceVarsInUrl(apiPath, apiPathVars);
            }
            var baseUrl = moduleApiBaseUrls[module] || moduleApiBaseUrls['_default'];
            if (!baseUrl)
                throw new Error('Cannot find base URL for module "' + module + '"');

            // baseUrl = module === "portal" ? "" : baseUrl;
            var url = baseUrl + apiPath;
            url = replaceVarsInUrl(url, apiPathVars);
            return url;
        }

        /**
         * Call Rest API
         * @memberof restUtils
         * @param module {string} Module name to determine base URL
         * @param method {string} HTTP method
         * @param apiPath {string} API path with variables wrapped within `{}`
         * @param apiPathVars {object=} Values used for replacing variables in API path
         * @param apiParams {object=} Query or body parameters for HTTP request
         * @param extras
         * @return {Promise} A promise
         */
        function callApi(module, method, apiPath, apiPathVars, apiParams, extras) {
            return _callApiWithAngular(module, method, apiPath, apiPathVars, apiParams, extras || {});
        }

        function _callApiWithAngular(module, method, apiPath, apiPathVars, apiParams, extras) {
            var url = getApiUrl(module, apiPath, apiPathVars);
            return callAjax(method, url, apiPathVars, apiParams, null, extras);
        }

        /**
         * @param url
         * @param {*} fileInfo {@link https://github.com/danialfarid/ng-file-upload}
         * Specify the file and optional data to be sent to the server.
         * Each field including nested objects will be sent as a form data multipart.
         * Samples: {pic: file, username: username}
         * {files: files, otherInfo: {id: id, person: person,...}} multiple files (html5)
         * {profiles: {[{pic: file1, username: username1}, {pic: file2, username: username2}]} nested array multiple files (html5)
         * {file: file, info: Upload.json({id: id, name: name, ...})} send fields as json string
         * {file: file, info: Upload.jsonBlob({id: id, name: name, ...})} send fields as json blob, 'application/json' content_type
         * {picFile: Upload.rename(file, 'profile.jpg'), title: title} send file with picFile key and profile.jpg file name
         * @param {function(number)=} progressCallback
         * @return {Promise}
         */
        function callUpload(url, fileInfo, progressCallback) {
            console.log('callUpload', {url: url, fileInfo: fileInfo});
            var d = $q.defer();
            Upload.upload({
                url: url,
                data: fileInfo
            }).then(function (resp) {
                d.resolve(resp.data);
            }, function (resp) {
                var error = guessError(resp);
                d.reject(error);
            }, function (evt) {
                if (angular.isFunction(progressCallback)) {
                    var progressPct = parseInt(100.0 * evt.loaded / evt.total);
                    progressCallback(progressPct);
                }
            });
            return d.promise;
        }

        function containsMultipart(params) {
            if (!params) return false;
            var keys = Object.keys(params);
            for (var i = 0; i < keys.length; i++) {
                var param = params[keys[i]];
                if (param instanceof File)
                    return true;
            }
            return false;
        }

        /**
         *
         * @param {string} method HTTP method, default is "GET"
         * @param {string} url URL with variables in `{}`
         * @param {object=} vars Values to replace variables in URL
         * @param {object=} params Request data for POST/PUT, parameters for GET
         * @param {object=} options
         * @param {function=} options.successCallback
         * @param {function<Error>=} options.errorCallback
         * @returns {Promise|Promise<any>}
         */
        function callAjax(method, url, vars, params, options, extras) {
            var d = $q.defer();
            options = options || {};
            method = (method || 'GET').toUpperCase();
            var config = {method: method, url: replaceVarsInUrl(url, vars)};

            if (method === 'GET') {
                config.params = params;
            } else if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
                config.data = params;
            }

            config = $.extend(true, {}, extras, config);
            // config.transformResponse = customTransformResponse;
            var b = Date.now();
            // https://code.angularjs.org/1.5.11/docs/api/ng/service/$http
            // The response object has these properties:
            //
            // data – {string|Object} – The response body transformed with the transform functions.
            // status – {number} – HTTP status code of the response.
            // headers – {function([headerName])} – Header getter function.
            // config – {Object} – The configuration object that was used to generate the request.
            // statusText – {string} – HTTP status text of the response.
            $http(config).then(function (resp) {
                // console.log('restUtils.callAjax', Date.now() - b, url, config);
                // For API not use standard HTTP status code
                var err = guessError(resp);
                if (err) {
                    options.errorCallback && options.errorCallback(err);
                    return d.reject(err);
                }
                options.successCallback && options.successCallback(resp.data);
                d.resolve(resp.data);
            }, function (resp) {
                var err = guessError(resp);
                options.errorCallback && options.errorCallback(err);
                d.reject(err);
            })/*.catch(function (err) {
                options.errorCallback && options.errorCallback(err);
                d.reject(err);
            })*/;
            return d.promise;

            /**
             *
             * In some cases, malformed API returns invalid JSON which
             * cannot be converted to JSON by angular `$httpProvider.defaults.transformResponse`.
             * Example, one 'application/json' API is expected to return a
             * string like `"a-string-result"` but returns `a-string-result`,
             * in which double-quotes `"` is missing.
             * angular `defaultTransformResponse` will complain error:
             * `SyntaxError: Unexpected token s in JSON at position 0`
             * and returns nothing.
             * @param {string} data
             * @param {function.<string>} header angulars {@link #headersGetter}
             * @returns {*}
             */
            function customTransformResponse(data, header) {
                var b = Date.now();
                var result = data;
                if (result) {
                    try {
                        result = angular.fromJson(data);
                    } catch (err) {
                        console.warn('Cannot parse response data `' + data + '` with Content-Type `' + header('Content-Type') +
                            '` from [' + config.method + '](' + config.url + '): ' + err.message);
                        result = data;
                    }
                }
                console.log('customTransformResponse', Date.now() - b);
                return result;
            }
        }

        /**
         * Guess error from angular $http response
         * @param {object} resp Response of $http
         * @returns {Error<{message:string, _errorCode:string, _errorName:string, _errorData:*}>|undefined} Error if this is an error response.
         */
        function guessError(resp) {
            var data = resp.data || {};
            var errMsg;
            if (data.success === false) {
                // This is kind of old customized spring AjaxJson
                errMsg = data.msg || '';
            } else if (resp.status < 0) {
                errMsg = resp.statusText || ($translate.instant('common.rest.connect_failed') + resp.config.url);
            } else if (resp.status === 404) {
                errMsg = '[' + resp.status + '] ' + $translate.instant('common.rest.can_not_find_resource') + resp.config.url;
            } else if (resp.status === 405) {
                errMsg = '[' + resp.status + '] ' + $translate.instant('common.rest.not_support') + resp.config.method + $translate.instant('common.rest.access') + resp.config.url;
            } else if (resp.status >= 400) {
                var isHtml = (resp.headers('Content-Type') || '').indexOf('text/html') > -1;
                errMsg = resp.status;
                // Handle verbose error format in `resp.data`
                // if (data) {
                if (angular.isString(data)) {
                    if (isHtml) {
                        //20200912: In some case like nginx gateway 504/502 error
                        errMsg = $(data).find('body').text();
                    } else {
                        errMsg = data;
                    }
                } else if (resp.headers('content-type') === 'application/problem+json') {
                    //https://datatracker.ietf.org/doc/html/draft-nottingham-http-problem-07
                    //https://www.jianshu.com/p/55d648443ce1
                    errMsg = data.detail || data.title || data.message;
                } else {
                    if (data.title) {
                        // Original jhipster format: {detail:string,message:string,status:number,title:string,type:string}
                        errMsg = data.detail || data.message || data.statusText;
                    } else {
                        // Normal error format {message:string}
                        errMsg = data.message;
                    }
                    // oplus-jao format: {detail:string, error:string, runId:string, status:string, data:*}
                    if (!errMsg) {
                        errMsg = data.error;
                        if (angular.isString(errMsg)) {
                            try {
                                var errObj = JSON.parse(errMsg);
                                if (errObj.message) {
                                    errMsg = errObj.message;
                                }
                            } catch (err) {
                            }
                        }
                    }
                    if (resp.status === 401 && errMsg.indexOf('JWT expired at') > -1) {
                        errMsg = $translate.instant('common.rest.login_expired');
                    }
                    else if (resp.status === 402) {
                        errMsg = "Invalid License";
                    }
                    else if (data.detail === 'MalformedJwtException'
                        || (data.message || '').indexOf('JWT strings must contain exactly 2 period characters') > -1) {
                        errMsg = $translate.instant('common.rest.malformed_jwt_error');
                    } else if (angular.isString(data.detail)) {
                        errMsg += (errMsg ? ': ' : '') + (angular.isString(data.detail) ? data.detail : JSON.stringify(data.detail));
                    }
                    errMsg = errMsg || data.statusText;
                }
                // }
                // resp.statusText and resp.status for angular
                errMsg = errMsg || resp.statusText || resp.status;
            }
            if (angular.isDefined(errMsg)) {
                var error = new Error(errMsg);
                error._errorCode = resp.status;
                error._errorName = resp.statusText;
                if (data) {
                    error._errorData = data;
                }
                if (resp.status === 401 || resp.status === 402) {
                    // console.log('state=',$state);
                    // if ($state.current.name !== 'login_main') {
                    messageService.toast('error', $translate.instant('common.rest.no_access'), errMsg);
                    currentUser.clearUserInfo();
                    $state.go('app.login_main');
                    // }
                }
                return translateError(error);
            }

            /**
             * Translate error with custom translator.
             * @param {Error} err
             * @returns {Error}
             */
            function translateError(err) {
                //TODO: need translate by module
                Object.keys(errorTranslators).forEach(function (module) {
                    var fn = errorTranslators[module];
                    fn(err);
                });
                return err;
            }
        }

        function callApiWithJquery(module, method, apiPath, apiPathVars, apiParams, ajaxOptions) {
            var d = $q.defer();
            var apiUrl = getApiUrl(module, apiPath, apiPathVars);
            var options = {url: apiUrl, method: method};
            if (apiParams) {
                options.data = apiParams || {};
            }
            $.ajax(options).done(function (data) {
                d.resolve(data);
            }).fail(function (xhr) {
                var data = xhr.responseJSON || {}, statusCode = xhr.status;
                var error = data.error;
                var message;
                if (statusCode === 0) {
                    message = $translate.instant('common.rest.connect_failed') + options.url;
                } else {
                    message = xhr.message || ('[' + error.code + '] ' + error.message);
                }
                d.reject(new Error(message));
            });
            return d.promise;
        }
    }
})();
