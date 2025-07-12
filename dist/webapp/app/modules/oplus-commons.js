/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 11/7/2017
 */
(function () {
    'use strict';

    var app = angular.module('oplus.commons', ['toaster', 'ui.bootstrap', 'vs-repeat', 'ngFileUpload']);
    app.provider('commonsConfig', function CommonsConfigProvider() {
        // console.log('CommonsConfigProvider');
        var defaultUnresolvedVar;

        this.setDataExDefaultUnresolvedVar = function (value) {
            defaultUnresolvedVar = value;
            // console.log('setDataExDefaultUnresolvedVar="' + defaultUnresolvedVar + '"');
        }

        this.$get = [function () {
            return {
                getDataExDefaultUnresolvedVar: function () {
                    // console.log('getDataExDefaultUnresolvedVar="' + defaultUnresolvedVar + '"');
                    return defaultUnresolvedVar;
                }
            }
        }];
    });
})();

(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .config(localStorageConfig);

    localStorageConfig.$inject = ['$localStorageProvider', '$sessionStorageProvider'];

    function localStorageConfig($localStorageProvider, $sessionStorageProvider) {
        $localStorageProvider.setKeyPrefix('oplus-');
        $sessionStorageProvider.setKeyPrefix('oplus-');
    }
})();

/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/31/2017.
 */

(function () {
    'use strict';
    var app = angular.module('oplus.commons');

    /**
     * @memberof oplus.commons
     * @ngdoc service
     * @name localDaoFactory
     */
    app.service('localDaoFactory', localDaoFactory);

    localDaoFactory.$inject = ['$http', '$q'];

    /**
     *
     * @param $http
     * @param $q
     */
    function localDaoFactory($http, $q) {
        this.createDao = createDao;
        this.LocalStorageDao = LocalStorageDao;

        /**
         *
         * @param storageKey {string} Key of LocalStorage item
         * @returns {LocalStorageDao}
         */
        function createDao(storageKey) {
            return new LocalStorageDao(storageKey);
        }

        /**
         *
         * @param {string} key Key of local storage
         */
        function LocalStorageDao(key) {
            var storageKey = key;
            this.findAllEntities = findAllEntities;
            this.findEntity = findEntity;
            this.deleteEntity = deleteEntity;
            this.saveEntity = saveEntity;
            this.saveAllEntities = saveAllEntities;

            function findAllEntities() {
                var that = this;
                var d = $q.defer();
                var str = localStorage.getItem(storageKey) || '[]';
                var entities = [];
                try {
                    entities = JSON.parse(str);
                } catch (e) {
                    d.reject(e);
                }
                entities = entities || [];
                d.resolve(entities);
                return d.promise;
            }

            function saveAllEntities(entities) {
                return $q(function (resolve, reject) {
                    localStorage.setItem(storageKey, JSON.stringify(entities));
                    resolve();
                });
            }

            /**
             *
             * @param entity {{id:string,html:string,title:string}}
             * @return {$q<{id:string}>}
             */
            function saveEntity(entity) {
                var that = this;
                var d = $q.defer();
                entity.modifiedAt = Date.now();
                if (!entity.id) {
                    entity.id = Date.now() + '';
                    entity.createdAt = Date.now();
                }
                findAllEntities().then(function (entities) {
                    var index = 0;
                    for (; index < entities.length; index++) {
                        if (entities[index].id === entity.id) {
                            entities[index] = entity;
                            break;
                        }
                    }
                    if (index === entities.length) {
                        entities.push(entity);
                    }
                    saveAllEntities(entities);
                    d.resolve({id: entity.id});
                });
                return d.promise;
            }

            function deleteEntity(id) {
                var d = $q.defer();
                findAllEntities().then(function (entities) {
                    var idx = _.findIndex(entities, {'id': id});
                    if (idx >= 0) {
                        entities.splice(idx, 1);
                    }
                    return saveAllEntities(entities);
                }).then(function () {
                    d.resolve({});
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            }

            /**
             *
             * @param id {String} Entity ID
             * @return {promise<object>}
             */
            function findEntity(id) {
                var d = $q.defer();
                if (id) {
                    findAllEntities().then(function (entities) {
                        d.resolve(_.find(entities, {'id': id}));
                    });
                } else {
                    throw new Error('MissingParameter: id required');
                }
                return d.promise;
            }
        }
    }
})();
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/30/2017
 */
(function () {
        'use strict';

        angular.module('oplus.commons').service('dataEx', ['debugTimer', 'commonsConfig', '$translate', dataEx]);
        //
        // moment.defaultFormatUtc='YYYY-MM-HH HH:mm:ss';
        /**
         *
         * @param message
         * @constructor
         */
        function UnresolvedVarError(message, detail) {
            this.message = message;
            this.detail = detail;
        }

        UnresolvedVarError.prototype = new Error();

        window.UnresolvedVarError = UnresolvedVarError;

        /**
         * @ngdoc service
         * @name dataEx
         * @description
         * A service for evaluating string represented data.
         * The data expression may contain variables which are wrapped with `${}`.
         *
         * This service will parse the data expression and return a actual Javascript function.
         *
         * The data string expression can be one of following kinds:
         * - HTML links string like `<button>${variableName}</button>`.
         * - Javascript function body like `parseInt(${fieldName})`, `$$.formatDate(${timestamp},"YYYY-MM-DD")`.
         *   Variables `${variableName}` will be replaced with `somefunc(variableName)`
         *   and returns function like `function (somefunc){...}`
         * - YAML
         * - JSON
         * - Other expression will be returned as is with variables replaced.
         * @param {debugTimer} debugTimer  Timer to record time consumed
         * @param {commonsConfig} commonsConfig
         */
        function dataEx(debugTimer, commonsConfig, $translate) {
            var that = this,
                cachedFns = {};
            var datatypes = {
                STRING: 'string',
                NUMBER: 'number',
                BOOLEAN: 'boolean',
                ARRAY: 'array',
                DATE: 'date',
                DSV: 'dsv',
                JSON: 'json'
            };
            this.datatypes = datatypes;
            this.kindDefs = [
                {value: 'js', icon: 'fa-function'},
                {value: 'str', icon: 'fa-text'},
                {value: 'json', icon: 'fa-brackets-curly'},
                {value: 'yaml', icon: 'fa-list-ul'},
                {value: 'link', icon: 'fa-link'}
            ];

            /**
             * Supported expression kinds
             * @type {{LINK: string, JS: string, YAML: string, STR: string, JSON: string}}
             */
            this.kinds = {LINK: 'link', JS: 'js', YAML: 'yaml', STR: 'str', JSON: 'json'};
            this.evalVarJs = evalVarJs;
            this.evalVarExpr = evalVarExpr;
            this.evalVarJson = evalVarJson;
            this.strToFunc = strToFunc;
            this.getExprMeta = getExprMeta;
            this.pathValue = pathValue;
            this.replaceVars = replaceVars;
            this.convertData = convertData;
            this.transform = transform;
            this.transpose = transpose;
            this.evalVarStr = evalVarStr;
            this.extractVars = extractVars;

            /**
             * Evaluate a variable javascript expression
             * @param {string} expr Expression without "js:" prefix
             * @param {object=} values
             */
            function evalVarJs(expr, values) {
                return evalVarExpr(that.kinds.JS + ':' + expr, values);
            }

            /**
             * Evaluate a variable string.
             * @param {string} varExpr
             * @param {object} values Values to replace variables
             * @returns {string}
             */
            function evalVarStr(varExpr, values) {
                if (!varExpr) return varExpr;
                return replaceVars(varExpr, function (varName) {
                    return values[varName];
                });
            }

            /**
             * Extract variables from a var string
             * @param {string} s
             * @returns {[string]}
             */
            function extractVars(s) {
                var i = 0;
                var paramList = [];
                while (s && s.lastIndexOf("}") >= i) {
                    if (s.indexOf("${") < 0) {
                        break;
                    }
                    s = s.substring(s.indexOf("${") + 2);
                    var paramName = s.substring(0, s.indexOf("}"));
                    if (paramList.indexOf(paramName) < 0) {
                        paramList.push(paramName);
                    }
                    i = s.indexOf("}") + 1;
                }
                return paramList;
            }

            /**
             * Parse string to JS function. This can be used to interpret dynamic expression like rule, conditions.
             *
             * Example: `strToFunc('${info.age}>40 && ${department}==="IT"')`  returns:
             * ```
             * function(dataEx, values) {
             *   return dataEx.pathValue(values,'info.age')>40 && dataEx.pathValue(values,'department')==="IT";
             * }
             * ```
             * Usage example:
             * ```
             * var fn = strToFunc('${info.age}>40 && ${department}==="IT"');
             * var args = [dataEx,{info:{name:"foo",age:30},department:"HR"}];
             * fn.apply(this,args); // false
             * ```
             * @param {string} expr Expression with variables.
             * @returns {function(dataEx,object)} A function with parameters `dataEx` object, values for vars.
             */
            function strToFunc(expr) {
                var argNameOfValueObject = 'obj',
                    fnArgs = ['dataEx', argNameOfValueObject].join(',');
                var jsExpr = that.kinds.JS + ':' + expr;
                return replaceVarAndEvalExpr(jsExpr, function (varName) {
                    return 'dataEx.pathValue(' + argNameOfValueObject + ',"' + varName + '")';
                }, fnArgs);
            }

            /**
             * Parse property of a object from property path.
             * It uses lodash [`_.get()`](https://lodash.com/docs/4.17.10#get).
             * @param obj {object} Value object
             * @param path {string} Path of property
             */
            function pathValue(obj, path) {
                var b = Date.now();
                var prop = path, defaultValue;
                var pos = path.indexOf('||');
                if (pos > 0) {
                    prop = path.substring(0, pos).trim();
                    defaultValue = eval(path.substring(pos + 2).trim());
                }
                var value = _.get(obj, prop, defaultValue);
                var dataExDefaultUnresolvedVar = commonsConfig.getDataExDefaultUnresolvedVar();
                // console.log('dataExDefaultUnresolvedVar',dataExDefaultUnresolvedVar);
                if (!angular.isUndefined(dataExDefaultUnresolvedVar) && angular.isUndefined(value)) {
                    value = dataExDefaultUnresolvedVar;
                }
                debugTimer.add('dataEx.pathValue', b);
                return value;
            }

            /**
             * Get value from a object path. If value is undefined, throw UnresolvedVarError
             * @param obj
             * @param path
             * @param ignores
             * @param {object} options
             * @param {*=} options.valueOfUnresolvedVar
             * @returns {*}
             */
            function pathValueWithError(obj, path, ignores, options) {
                var val = pathValue(obj, path);
                options = options || {};
                ignores = ignores || [];
                if (typeof val === "undefined" && ignores.indexOf(path) < 0) {
                    if (angular.isDefined(options.valueOfUnresolvedVar)) {
                        return options.valueOfUnresolvedVar;
                    } else {
                        throw new UnresolvedVarError(path, $translate.instant('common.data.can_not') + JSON.stringify(obj) + $translate.instant('common.data.get_path') + path + $translate.instant('common.data.value'));
                    }
                }
                return val;
            }

            var warned = [];

            /**
             * Evaluate expression with variables.
             * @param {string} varExpr Function expression like `js:new Date()`, `yaml:- name:Oplus\n  year:2017`, `str:<button>Submit</button>`
             * @param {object=} varValues Variable values. Key is variable name, value is variable value.
             * @param {object=} options
             * @param {array=} options.ignores Array of string
             * @param {string=} options.debugKey A key for debug purpose
             * @param {boolean=} options.errorForUnresolvedVar If true, it returns an `UnresolvedVarError` object if there is unresolved variable.
             * The Error `message` property is the unresolved variable name.
             * @param {*=} options.valueOfUnresolvedVar If set, expression returns this value for unresolved var.
             * @param {boolean=} options.keepLinkAsIs Keep LINK type expr as is
             * @returns {*} Evaluated value.
             */
            function evalVarExpr(varExpr, varValues, options) {
                options = options || {};
                var result, begin = Date.now(), useDebug;
                // If to evaluate variable in link
                var toEvalVarLink = true;
                toEvalVarLink = false;

                if (toEvalVarLink) {
                    var link = evalVarLink(varExpr, varValues, options);
                    debugTimer.add('evalVarExpr', begin);
                    if (link) {
                        return link;
                    }
                }

                var meta = getExprMeta(varExpr);
                var fnToReplaceVar, argsOfEvaluatedFn;
                if (meta.kind === that.kinds.JS) {
                    //LEO@20190505: Use special unique parameter name for data and ignores
                    // to avoid parameter conflicting with user defined outer function parameters
                    // For JS, replace the var with a function `fieldOf`,
                    // and the `fieldOf` function is also a parameter passed in evaluated function.
                    fnToReplaceVar = function (varName) {
                        return 'fieldOf(_$_data,"' + varName + '",_$_ignores)';
                    };
                    argsOfEvaluatedFn = '_$_data,fieldOf,_$_ignores';
                } else {
                    // If not JS, simply replace var with path value.
                    fnToReplaceVar = function fnToReplaceVarWithPathValue(varName) {
                        return pathValueWithError(varValues, varName, options.ignores, options);
                    };
                    argsOfEvaluatedFn = '';
                }
                try {
                    var evaluatedExpr = replaceVarAndEvalExpr(varExpr, fnToReplaceVar, argsOfEvaluatedFn);
                    if (angular.isFunction(evaluatedExpr)) {
                        var fn = evaluatedExpr;
                        // result = executeFunction(evaluatedExpr, values, options);
                        // var b2 = Date.now();
                        result = fn(varValues, pathValueWithError, options.ignores || []);
                        if (angular.isFunction(result)) {
                            // To support fnBody in format of `function(){}` instead of `function(){}()`
                            result = result($translate);
                        }
                    } else {
                        result = evaluatedExpr;
                    }
                    debugTimer.add('evalVarExpr', begin);
                } catch (err) {
                    if (err instanceof UnresolvedVarError) {
                        if (options.errorForUnresolvedVar === true) {
                            var unresolvedVar = err.message;
                            result = new UnresolvedVarError(unresolvedVar);
                        } else {
                            if (angular.isDefined(options.valueOfUnresolvedVar)) {
                                result = options.valueOfUnresolvedVar;
                            } else {
                                var predicate = {expr: varExpr, variable: err.message};
                                if (!_.find(warned, predicate)) {
                                    warned.push(predicate);
                                    //2022/01/02: Prevent too many warnings
                                    console.warn('UnresolvedVarError: ${' + err.message + '} in ' + varExpr);
                                }
                                result = undefined;
                            }
                        }
                    } else {
                        console.warn('Cannot parse expression: ' + varExpr + err);
                        // Fallback to expression itself
                        result = varExpr;
                    }
                }
                return result;

                /**
                 * Execute function and get result.
                 * @param {function(object, function(object,string,[]), [])} fn Function to be evaluated.
                 * Parameters: values, function_to_get_path_value, ignored_fields
                 * @param values
                 * @param options
                 * @returns {string|UnresolvedVarError}
                 */
                function executeFunction(fn, values, options) {
                    var result;
                    // try {
                    var b2 = Date.now();
                    result = fn(values, pathValueWithError, options.ignores || []);
                    if (angular.isFunction(result)) {
                        // To support fnBody in format of `function(){}` instead of `function(){}()`
                        result = result();
                    }
                    debugTimer.add('evalVarExpr.fn()', b2);
                    // } catch (err) {
                    //     if (err instanceof UnresolvedVarError) {
                    //         if (options.errorForUnresolvedVar === true) {
                    //             var unresolvedVar = err.message;
                    //             result = new UnresolvedVarError(unresolvedVar);
                    //         } else {
                    //             result = undefined;
                    //         }
                    //     } else {
                    //         console.warn('Cannot parse expression: ' + varExpr + err);
                    //         // Fallback to expression itself
                    //         result = varExpr;
                    //     }
                    // }
                    return result;
                }

            }

            /**
             * Transpose/rotate a matrix.
             * @example
             * Original data list
             * ```
             * [
             * {host:'web01', cpu:4, mem:8, disk:128 },
             * {host:'app01', cpu:8, mem:16, disk:256 }
             * ]
             * ```
             * `transpose(records)` result:
             * ```
             * [
             * {name:'cpu', web01:4, app01:8},
             * {name:'mem', web01:8, app01:16},
             * {name:'disk', web01:128, app01:256}
             * ]
             * ```
             * @param records
             * @param propOfOldPrimaryKey
             */
            function transpose(records, propOfOldPrimaryKey, propOfNewPk) {
                var output;
                output = _.transform(records, function (result, record) {
                    _.forIn(record, function (value, prop) {
                        if (prop !== propOfOldPrimaryKey) {
                            var find;
                            var obj = _.find(result, function (o) {
                                return o[propOfNewPk] === prop;
                            });
                            if (obj === undefined) {
                                find = {};
                                find[propOfNewPk] = prop;
                                result.push(find);
                            } else {
                                find = obj;
                            }
                            find[record[propOfOldPrimaryKey]] = value;
                        }
                    });

                }, []);
                return output;
            }

            /**
             * Transform array of objects.
             * It can be used to convert key-value type data list to property type data list.
             * For example of the original data list
             * ```
             * host | item   | value | unit | desc
             * ----------------------------------
             * web01 | cpu   | 4     | core | ...
             * web01 | mem   | 8     | GB   | ...
             * web01 | disk  | 128   | GB   | ...
             * app01 | cpu   | 8     | core | ...
             * app01 | mem   | 16    | GB   | ...
             * app01 | disk  | 256   | GB   | ...
             * ```
             * with `transform(records, 'host', 'item', 'value')`, the result is:
             * ```
             * host  | cpu | mem | disk
             * --------------------------
             * web01 |  4  |  8  | 128
             * app02 |  8  |  16 | 256
             *
             * ```
             *
             * @param {[object]} records
             * @param {string} propOfNewPrimaryKey The property whose value used as primary key
             * @param {string} propOfNewColumn The property whose value used as column name
             * @param {string} propOfNewValue The property whose value used as column value
             * @returns {*}
             */
            function transform(records, propOfNewPrimaryKey, propOfNewColumn, propOfNewValue, propOfPrimaryKeyDesc) {
                var output;
                output = _.transform(records, function (result, record) {
                    var find = {};
                    find[propOfNewPrimaryKey] = record[propOfNewPrimaryKey];
                    var obj = _.find(result, find);
                    if (obj === undefined) {
                        result.push(find);
                    } else {
                        find = obj;
                    }
                    find[record[propOfNewColumn]] = record[propOfNewValue];
                    if (propOfPrimaryKeyDesc)
                        find[propOfPrimaryKeyDesc] = record[propOfPrimaryKeyDesc];
                }, []);
                return output;
            }

            /**
             * Evaluate variables in link expression.
             * @param {string} fnExp
             * @param {object} valueObj
             * @param {object} options
             * @returns {*|undefined} `undefined` if expression is not a link type
             * TODO: bad performance
             */
            function evalVarLink(fnExp, valueObj, options) {
                var result, method = 1;
                var meta = getExprMeta(fnExp);
                if (meta.kind === that.kinds.LINK) {
                    if (method === 1) {
                        result = evalWithRegex();
                    } else {
                        result = evalWithDom();
                    }
                }
                return result;

                function evalWithRegex() {
                    var reg = /(udp\-widget\-interaction)="([\s\S]*?)"/g;
                    var matches, body = meta.body;
                    var result = '';
                    var lastPos = 0;
                    while ((matches = reg.exec(body)) !== null) {
                        var match = matches[2].replace(/&quot;/g, '"');
                        var matchBeginIndex = reg.lastIndex - matches[0].length;
                        // console.log('match', beginPos, endPos, match);
                        var interaction = JSON.parse(match);
                        if (interaction && interaction.page) {
                            interaction.page.pageId = evalVarExpr(interaction.page.pageId, valueObj, options);
                            interaction.page.params = evalVarJson(interaction.page.params, valueObj);
                        }
                        var interactionPart = matches[1] + '="' + JSON.stringify(interaction).replace(/"/g, "&quot;") + '"';
                        var prevPart = body.substring(lastPos, matchBeginIndex);
                        result += prevPart + interactionPart;
                        lastPos = reg.lastIndex;
                    }
                    var lastPart = body.substring(lastPos, body.length);
                    result += lastPart;
                    return result;
                }

                function evalWithDom() {
                    var linkHelper = interactionLinkHelper();
                    var begin = Date.now();
                    var links = linkHelper.htmlToLinks(meta.body);
                    debugTimer.add('evalVarExpr.htmlToLinks', begin);
                    links.forEach(function (link) {
                        var interaction = link.interaction;
                        if (interaction && interaction.page) {
                            interaction.page.pageId = evalVarExpr(interaction.page.pageId, valueObj, options);
                            interaction.page.params = evalVarJson(interaction.page.params, valueObj);
                        }
                    });
                    begin = Date.now();
                    var result = linkHelper.linksToHtml(links);
                    debugTimer.add('evalVarExpr.linksToHtml', begin);
                    return result;
                }
            }

            function copyWithFile(varJson) {
                if (!varJson) {
                    return varJson;
                }
                // return _.cloneDeepWith(varJson,function(value){if (value instanceof File){return value;}})
                //20200925: Use copy to avoid modifying varJson itself
                var objToEval = angular.copy(varJson);
                //20210420: File type cannot copy
                //TODO: replace with _.cloneDeepWith?
                var keys = Object.keys(varJson);
                keys.forEach(function (key) {
                    if (varJson[key] instanceof File) {
                        objToEval[key] = varJson[key];
                    }
                });
                return objToEval;
            }

            /**
             * Evaluate JSON with variables.
             * Example
             * ```
             * var str = '{
             * "actions":["page","event"],
             * "page":{
             * "pageId":"js:${key}!==null?'1514646438451':'1514646438452'",
             * "params":"{\"param_passIn\":\"js:${key}\"}",
             * "target":"_dialog"
             * },
             * "event":{"name":"event_name"}
             * }';
             * ```
             * Note that `.params` is a `String` and it will be evaluated with `JSON.parse()`.
             * Result turns out:
             * ```
             * {
             *   "actions":["page","event"],
             *   "page":{
             *     "pageId":"1514646438451",
             *     "params":{
             *       "param_passIn":"AAA"
             *     },
             *     "target":"_dialog"
             *   },
             *   "event":{
             *     "name":"event_name"
             *   }
             * }';
             * ```
             * @param {string|object} varJson JSON in object or string with variables.
             * If this is a `object`, it will be returned as is by default.
             * @param {object} values Value object for variable
             * @param {object=} options
             * @param {boolean} options.toEvalObject `true` to parse `varJson` even if it is a `object`
             * @returns {*} varJson itself if varJson is an object.
             */
            function evalVarJson(varJson, values, options) {
                if (!varJson) {
                    return varJson;
                }
                options = options || {};
                var objToEval, varType = typeof varJson;
                // console.log('evalVarJson', varJson, type);
                if (varType === 'undefined') {
                    return;
                } else if (varType === 'object') {
                    if (!options.toEvalObject) {
                        return varJson;
                    }
                    objToEval = copyWithFile(varJson);
                } else if (varType === 'string') {
                    // console.log('varJson', varJson);
                    try {
                        objToEval = JSON.parse(varJson);
                    } catch (e) {
                        // console.warn('Cannot parse page params from string: ' + varJson + ', ' + e.message);
                        var str = evalVarExpr(varJson, values, {keepUndefinedVar: false});
                        // console.log('str...', varJson, str, JSON.stringify(values));
                        return str;
                        // return varJson;
                    }
                } else {
                    return varJson;
                }
                if (angular.isObject(objToEval)) {
                    Object.keys(objToEval).forEach(function (key) {
                        var value = objToEval[key];
                        // console.log('evalVarJson', key, value);
                        if (value instanceof File) {
                        } else {
                            objToEval[key] = evalVarJson(value, values, options);
                        }
                    });
                }
                return objToEval;
            }

            /**
             * Replace variables in a string.
             * @param {string} varStr A string with variables wrapped within `${}`. To escape `${}`, use `\${}`
             * @param {function(string)} fnToReplaceVar Function to replace variable. Variable name as parameter.
             * It returns the replaced variable.
             * @param {object=} options
             * @param {boolean=} options.keepUndefinedVar When a variable evaluated as undefined,
             * `true` to keep the varStr as is, `false` to set the varStr to `undefined`
             * @returns {string|undefined} A string with variable replaced. If some variable evaluated as undefined,
             * the returned value is `undefined`  if `options.keepUndefinedVar` is `false`.
             */
            function replaceVars(varStr, fnToReplaceVar, options) {
                options = options || {};
                var LEFT = '${', RIGHT = '}';
                if (!angular.isString(varStr)) {
                    throw new Error('dataEx:replaceVars(varStr) need a string type argument');
                }
                if (!fnToReplaceVar) {
                    return varStr;
                }
                // var regexp = /[^\\]?\${(.*?)}/g;
                //20210812: start with `${.*}` or contains `${.*}` but not `\${.*}`
                // var regexp = /^\${.*?}|[^\\]\${.*?}/g;
                var regexp = /\${.*?}|.\${.*?}/g;
                var params = varStr.match(regexp);
                // console.log('params', varStr, params);
                if (params) {
                    for (var i = 0; i < params.length; i++) {
                        var param = params[i];
                        // If this var is escaped with back slash
                        if (param.indexOf('\\${') === 0) {
                            continue;
                        }
                        // Replace variable `${paramName}`
                        var paramName = param.substring(param.indexOf(LEFT) + LEFT.length, param.length - 1);
                        var paramValue = fnToReplaceVar(paramName);
                        // console.log('parseFunctionWithPageParam', param, paramName, paramValue);
                        if (angular.isUndefined(paramValue)) {
                            // TODO: keep varStr as is or set it to undefined?
                            // If set varStr to undefined, any undefined var in button link (LINK) will cause the link undefined
                            // if (options.keepUndefinedVar !== true) {
                            varStr = undefined;
                            // }
                            // 20181127: setting undefined or break will cause CMB DB blank interaction in button link in datatable
                            // The cause is not deeply investigated
                            // For now just print log for debug
                            // 20181211: this bug has been fixed??
                            if (debugTimer.getDebugVar('printedUndefinedVar', []).indexOf(paramName) < 0) {
                                debugTimer.getDebugVar('printedUndefinedVar').push(paramName);
                                console.warn('dataEx.replaceVars: undefined var ' + LEFT + paramName + RIGHT);
                            }
                            // break;
                        } else if (varStr) {
                            varStr = varStr.replace(LEFT + paramName + RIGHT, paramValue);
                        }
                    }
                }
                if (varStr) {
                    // varStr = varStr.replace(/\\\${(.*?)}/g, '${$1}');
                }
                return varStr;
            }

            /**
             * Replace variables in a expression and evaluate the result. For JS expression, the result is a function.
             * @param {string} varExpr The expression with variables.
             * @param {function(string)} fnToReplaceVar A function to replace variable.
             * Variable name as parameter. Its return value is used to replace variable.
             * @param {string} argsOfEvaluatedFn Names to be used by the evaluated function as formal argument names.
             * Each must be a string that corresponds to a valid JavaScript identifier or a list
             * of such strings separated with a comma;  for example "x", "theValue", or "a,b"
             * @returns {function|string|*} function of JS; string for STR, LINK; * for JSON, YAML.
             * Default function arguments are values_object, function_fieldOf, array_of_ignores
             */
            function replaceVarAndEvalExpr(varExpr, fnToReplaceVar, argsOfEvaluatedFn) {
                if (!varExpr) return varExpr;
                var b = Date.now();
                var meta, exprBodyWithoutVars, optionsForReplaceVars;
                meta = getExprMeta(varExpr);
                if (meta.kind === that.kinds.LINK) {
                    optionsForReplaceVars = {keepUndefinedVar: true};
                }
                if (!fnToReplaceVar) {

                }
                exprBodyWithoutVars = replaceVars(meta.body, fnToReplaceVar, optionsForReplaceVars);
                // console.log('metaBody', meta.body, metaBody, fnToReplaceVar);
                debugTimer.add('replaceVarAndEvalExpr.replaceVars', b);
                if (meta.kind === that.kinds.YAML) {
                    // return function () {
                    // console.log("exprBodyWithoutVars=",exprBodyWithoutVars);
                    return jsyaml.load(exprBodyWithoutVars);
                    // };
                } else if (meta.kind === that.kinds.JSON) {
                    return JSON.parse(exprBodyWithoutVars);
                } else if (meta.kind === that.kinds.STR) {
                    return fallbackString(exprBodyWithoutVars);
                } else if (meta.kind === that.kinds.LINK) {
                    if (optionsForReplaceVars.keepLinkAsIs) {
                        // TODO: for LINK, shall we evaluate the expr on the click? i.e. keepLinkAsIs always true?
                        return meta.body;
                    }
                    return parseLink(exprBodyWithoutVars);
                } else {
                    // Use javascript function
                    var b2 = Date.now();
                    var fnBody = 'return ' + exprBodyWithoutVars + ';';
                    // var fnBody = 'try{return ' + exprBodyWithoutVars + ';}catch(err){console.warn("Error execute '+exprBodyWithoutVars+': "+ err.message);}';
                    // `Function` is time consuming, 500ms for 5000 calls
                    // var fn = Function(fnArgs, fnBody);
                    // TODO: use hashCode as key?
                    // TODO: when to clear cache?
                    var key = argsOfEvaluatedFn + '*!' + fnBody;
                    var fn = cachedFns[key];
                    if (angular.isUndefined(fn)) {
                        try {
                            fn = Function(argsOfEvaluatedFn, fnBody);
                            cachedFns[key] = fn;
                        } catch (e) {
                            console.warn($translate.instant('common.data.Unrecognized_data_expression') + varExpr
                                + $translate.instant('common.data.create_function') + 'Function(\'' + argsOfEvaluatedFn + '\', \'' + fnBody + '\') ' + $translate.instant('common.data.error_occurred') + e.message);
                            var s = fallbackString(exprBodyWithoutVars);
                            cachedFns[key] = s;
                            return s;
                        }
                    }
                    debugTimer.add('replaceVarAndEvalExpr.Function', b2);
                    return fn;
                }

                /**
                 *
                 * @param {string} body
                 * @returns {string}
                 */
                function fallbackString(body) {
                    return body;
                }

                /**
                 *
                 * @param {string} body
                 * @returns {string}
                 */
                function parseLink(body) {
                    return body;
                }
            }

            /**
             * Parse the definition of function expression.
             * @param {string|*} fnExp Function expression
             * @return {{kind:string, body:string}} Expression kind (type) and body
             * @see dataEx.kinds
             */
            function getExprMeta(fnExp) {
                var b = Date.now();
                var exp = fnExp || '', meta;
                if (!angular.isString(exp)) {
                    meta = {kind: that.kinds.JS, body: exp};
                } else {
                    var pos = exp.indexOf(':');
                    meta = {kind: exp ? that.kinds.STR : '', body: exp};
                    if (pos > 0) {
                        var kind = exp.substring(0, pos);
                        // Check if kind is defined
                        if (_.indexOf(_.values(that.kinds), kind) >= 0) {
                            meta.kind = kind;
                            meta.body = exp.substring(pos + 1);
                        }
                    }
                }
                debugTimer.add('getExprMeta', b);
                return meta;
            }


            function isInvalidDate(date) {
                // typeof new Date('aaa') is `date` but it is invalid
                return isNaN(date);
            }

            function dsvAndArray(sourceValue, targetType, delimiter) {
                var separator = {'comma': ',', 'space': ' ', 'tab': '\t'}[delimiter];
                if (angular.isDefined(separator)) {
                    if (targetType === datatypes.ARRAY) {
                        if (!sourceValue) {
                            return [];
                        }
                        if (angular.isString(sourceValue)) {
                            return sourceValue.split(separator);
                        }
                    } else if (targetType === datatypes.DSV && angular.isArray(sourceValue)) {
                        return sourceValue.join(separator);
                    }
                }
                return sourceValue;
            }

            /**
             *
             * Convert data from source to target.
             * Special conversion rules:
             * - If source is null or undefined and target type is array, result is empty array `[]`
             * @param {*} sourceValue Source data value.
             * @param {string} targetType Target data type, `date`,`number`,`string`,`array`,'dsv'
             * @param {object=} options
             * @param {string=} options.formatter Now only work for `date` format
             * @param {string=} options.dataType Data type of source value. If this is specified, data converter will use
             * this data type to parse source value. For example, a number value's actual data type may be `date`.
             * Otherwise converter will determine data type by `typeof(value)`.
             * @param {string=} options.delimiter Used when conversion between dsv and array
             * @param {boolean} options.useJsonForArray If use JSON to convert between string and array.
             * @returns {null|undefined|*} null for invalid date or data is `null`.
             */
            function convertData(sourceValue, targetType, options) {
                options = options || {};
                var result = sourceValue, dateVal;
                var mmt;
                var formatter = options.formatter;
                if (sourceValue === null || angular.isUndefined(sourceValue)) {
                    return targetType === datatypes.ARRAY ? [] : sourceValue;
                }
                var dateFormatter = options.formatter || 'YYYY-MM-DD HH:mm:ss';

                if (targetType === datatypes.DATE) {
                    toDate();
                } else if (targetType === datatypes.NUMBER) {
                    toNumber();
                } else if (targetType === datatypes.STRING) {
                    toString();
                } else if (targetType === datatypes.ARRAY) {
                    toArray();
                } else if (targetType === datatypes.BOOLEAN) {
                    toBoolean();
                } else if (targetType === datatypes.DSV) {
                    result = dsvAndArray(sourceValue, targetType, options.delimiter);
                } else if (targetType === datatypes.JSON) {
                    try {
                        result = JSON.parse(sourceValue);
                    } catch (err) {
                    }
                }
                return result;

                function toDate() {
                    if (!sourceValue) {
                        // dt = new Date();
                    } else {
                        mmt = moment(sourceValue, dateFormatter);
                    }
                    var validDate = mmt && mmt.isValid();//isInvalidDate(dateVal);
                    if (!validDate && sourceValue) {
                        // console.warn('Cannot parse date from', data);
                    }
                    result = validDate ? mmt.toDate() : null;
                }

                function toNumber() {
                    result = numeral(sourceValue).value();
                }

                function toString() {
                    if (options.dataTypes === datatypes.DATE || angular.isDate(sourceValue)) {
                        mmt = moment(sourceValue, dateFormatter);
                        result = mmt.isValid() ? mmt.format(dateFormatter) : null;
                    } else if (angular.isString(sourceValue)) {
                        result = sourceValue;
                    } else if (angular.isArray(sourceValue)) {
                        //-------- Array to String
                        var sample = '';
                        if (sourceValue.length > 0) {
                            sample = sourceValue[0];
                        }
                        if (angular.isObject(sample)) {
                            result = JSON.stringify(sourceValue);
                            // _.map(sourceValue, function (o) {
                            //     return JSON.stringify(o);
                            // }).join(',');
                        } else {
                            result = sourceValue.join(',');
                        }
                    } else {
                        result = JSON.stringify(sourceValue);
                    }
                }

                function toArray() {
                    var sep = ',';
                    if (angular.isArray(sourceValue)) {
                        result = sourceValue;
                    } else if (angular.isString(sourceValue)) {
                        //-------- String to Array
                        if (angular.isDefined(options.delimiter)) {
                            result = dsvAndArray(sourceValue, datatypes.ARRAY, options.delimiter);
                        } else {
                            // Convert string to array
                            var array;
                            if (options.useJsonForArray === true) {
                                try {
                                    // If the string is array in JSON like "['aaa','bbb','ccc']"
                                    array = JSON.parse(sourceValue);
                                } catch (err) {
                                }
                            }
                            if (array && angular.isArray(array)) {
                                result = array;
                            } else {
                                result = sourceValue === '' ? [] : sourceValue.split(sep);
                            }
                        }
                    } else if (sourceValue) {
                        result = [sourceValue];
                    } else {
                        //20200906: use empty array
                        result = [];
                    }
                }

                function toBoolean() {
                    result = sourceValue === true || sourceValue === 1 || sourceValue === 'true';
                }

            }

            function interactionLinkHelper() {
                // To improve performance, do not use jquery
                var useJquery = false;
                return {
                    linksToHtml: linksToHtml,
                    htmlToLinks: htmlToLinks
                };

                /**
                 * Build HTML from interaction links.
                 * @param {array} links Interaction links
                 * @param {object} links.display Button display config
                 * @param {object} links.interaction As described in `udp-widget-interaction`
                 * @param {function.<object>} buttonRenderer A function to render button HTML, using display config as parameter.
                 * @returns {string} HTML text
                 */
                function linksToHtml(links, buttonRenderer) {
                    var html = '';
                    links.forEach(function (link) {
                        //20180613 migrate label to display.label
                        if (link.label) {
                            link.display = {label: link.label};
                            delete link.label;
                        }
                        var button;
                        if (buttonRenderer) {
                            button = buttonRenderer(link.display);
                            if (useJquery) {
                                // button.addClass('btn-sm');
                                button.attr('data-display', JSON.stringify(link.display));
                            } else {
                                button = button[0];
                                // button.classList.add('btn-sm');
                                button.setAttribute('data-display', JSON.stringify(link.display));
                            }
                        } else if (link.__element) {
                            button = link.__element;
                        } else {
                            throw new Error('linksToHtml must have __element or buttonRenderer');
                        }
                        if (useJquery) {
                            button.attr('udp-widget-interaction', JSON.stringify(link.interaction));
                        } else {
                            button.setAttribute('udp-widget-interaction', JSON.stringify(link.interaction));
                        }
                        // Use a white space or line feed to avoid tight connection between buttons
                        if (useJquery) {
                            html += button.prop('outerHTML') + '\n';
                        } else {
                            html += button.outerHTML + '\n';
                        }
                    });
                    return html;
                }

                /**
                 * Convert HTML to interaction links
                 * @param {string} html
                 * @returns {[{interaction:object,display:object,__element:jquery}]} Interaction links
                 */
                function htmlToLinks(html) {
                    var b = Date.now();
                    var elements;
                    // html = html.replace('\n', '');
                    // console.log('html', html);
                    if (useJquery) {
                        elements = $('<div>' + html + '</div>').children();
                    } else {
                        elements = $.parseHTML(html);
                    }
                    // console.log($.parseHTML(html));
                    debugTimer.add('htmlToLinks.createDOM', b);
                    var links = [];
                    for (var i = 0; i < elements.length; i++) {
                        var elem = elements[i];
                        if (elem.nodeName !== 'BUTTON')
                            continue;
                        var btn;
                        b = Date.now();
                        if (useJquery) {
                            btn = $(elem);
                        } else {
                            btn = elem;
                        }
                        debugTimer.add('htmlToLinks.jqueryEach', b);
                        b = Date.now();
                        // jsonic poor performance
                        // var interaction = JSON.parse(btn.attr('udp-widget-interaction') || '{}');
                        var attr;
                        if (useJquery) {
                            attr = btn.attr('udp-widget-interaction');
                        } else {
                            attr = btn.getAttribute('udp-widget-interaction');
                        }
                        var interaction = JSON.parse(attr || '{}');
                        debugTimer.add('htmlToLinks.parseAttr', b);
                        b = Date.now();
                        var display = getButtonDisplayConfig(btn);
                        debugTimer.add('htmlToLinks.getDisplay', b);
                        var link = {
                            interaction: interaction,
                            display: display,
                            __element: btn
                        };
                        links.push(link);
                    }
                    return links;


                    function getButtonDisplayConfig(elem) {
                        var display;
                        if (useJquery) {
                            display = elem.data('display');
                        } else {
                            display = elem.dataset.display;
                        }
                        if (!display) {
                            if (useJquery) {
                                display = {label: elem.text()};
                            } else {
                                display = {label: elem.innerText};
                            }
                        }
                        return display;
                    }
                }
            }
        }
    }

)();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/20/2017
 */

(function () {
    /**
     * @memberof oplus.commons
     * @ngdoc service
     * @name excelMockData
     * @description
     *
     * ** Used only for development or demo purpose. **
     *
     * It reads mock data from `api-mock/data/mock-database.xlsx`.
     *
     * Excel column format: `?column_name=convertFn`
     * - `?` Indicates this column is filterable
     * - `column_name` Column name
     * - `=` Followed by a convert function
     * - `convertFn` Use this function to generate data
     *
     */
    angular.module('oplus.commons').service('excelMockData', ['$q', 'dataEx', excelMockData]);

    /**
     * Provides mock data for local development.
     * @param $q
     * @param dataEx {dataEx}
     */
    function excelMockData($q, dataEx) {
        this.readWorksheet = readWorksheet;
        this.readWorkbook = readWorkbook;
        this.getSheetColumnMeta = getSheetColumnMeta;

        /**
         * Read excel data file from `api-mock/data/mock-database.xlsx`
         * @returns {promise.<object>} A workbook
         */
        function readWorkbook() {
            var d = $q.defer();
            var url = "api-mock/data/mock-database.xlsx";
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = function (e) {
                var arraybuffer = xhr.response;
                /* convert data to binary string */
                var data = new Uint8Array(arraybuffer);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                var bstr = arr.join("");
                /* Call XLSX */
                var workbook = XLSX.read(bstr, {type: "binary"});
                d.resolve(workbook);
            };
            xhr.send();
            return d.promise;
        }

        /**
         * ?ColumnNameWithoutSpace=jsConvertFn
         * ?: can this column be queried
         * @param column
         * @returns {*}
         */
        function parseColumnDef(column) {
            var attr;
            var matches = column.match(/(\??)([^=]*)(=?)(.*)/);
            if (matches) {
                attr = {
                    oldName: column,
                    canQuery: !!matches[1],
                    newName: matches[2],
                    convertFn: matches[3] && matches[4] ? ('js:' + matches[4]) : undefined
                };
            }
            return attr;
        }

        function getColumnDefs(records) {
            var columns = Object.keys(records[0]);
            var defs = [];
            columns.forEach(function (column) {
                var def = parseColumnDef(column);
                if (def)
                    defs.push(def);
            });
            return defs;
        }

        function convertData(records, defs) {
            // console.log('converters', converters);
            if (defs.length > 0) {
                records.forEach(function (record, index) {
                    defs.forEach(function (def) {
                        if (def.convertFn) {
                            var fn = def.convertFn.replace('$index', index + '');
                            record[def.newName] = dataEx.evalVarExpr(fn, record);
                        }
                        else if (def.newName !== def.oldName)
                            record[def.newName] = record[def.oldName];
                        if (def.newName !== def.oldName) {
                            // console.log('delete', ct.oldName, ct.newName);
                            delete record[def.oldName];
                        }
                    });
                });
            }
        }

        /**
         *
         * @param {string} sheet
         * @returns {promise} {promise<{fields:[{name:string,type:string}],paramsConfig:{param_name:{defaultValue:string,required:boolean}}}>}
         */
        function getSheetColumnMeta(sheet) {
            var d = $q.defer();
            readWorkbook().then(function (workbook) {
                var fields = [], paramsConfig = {};
                var records = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {raw: true});
                var one = records[0];
                if (one) {
                    Object.keys(one).forEach(function (column) {
                        var def = parseColumnDef(column);
                        var field = {name: column, type: typeof one[column]};
                        if (def) {
                            field.name = def.newName;
                        }
                        if (def.canQuery) {
                            paramsConfig[field.name] = {required: false};
                        }
                        fields.push(field);
                    });
                }
                var meta = {fields: fields, paramsConfig: paramsConfig};
                // console.log(meta);
                d.resolve(meta);
            }).catch(function (err) {
                throw err;
            });
            return d.promise;
        }

        /**
         * Reads excel sheet and returns JSON array.
         * @param sheet {string} Sheet name
         * @param params {object=} Query parameters
         * @returns {promise.<{total:number,records:{}}>}
         */
        function readWorksheet(sheet, params) {
            var d = $q.defer();
            params = params || {};
            var records;
            readWorkbook().then(function (workbook) {
                var all = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {raw: true});
                if (all.length === 0) {
                    records = all;
                } else {
                    var defs = getColumnDefs(all);
                    // console.log('defs', defs);
                    convertData(all, defs);
                    var fieldsCanQuery;
                    fieldsCanQuery = _.map(_.filter(defs, {canQuery: true}), 'newName');
                    // console.log('fieldsCanQuery', fieldsCanQuery);
                    if (fieldsCanQuery.length === 0) {
                        records = all;
                    } else {
                        records = _.filter(all, function (record) {
                            // match one parameter is OK...just for test
                            var matched = true;
                            fieldsCanQuery.every(function (field, index) {
                                // if (!params[field]) {
                                //     matched = true;
                                //     return false;
                                // }
                                if (params[field] && (params[field] !== record[field])) {
                                    matched = false;
                                    return false;
                                }
                                return true;
                            });
                            return matched;
                        });
                    }
                }
                d.resolve({
                    total: all.length,
                    records: records
                });
            });
            return d.promise;
        }
    }
})();

/*!
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 05/15/2020
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('dateTime', dateTime);
    dateTime.$inject = ['$filter'];

    function dateTime($filter) {
        var _dateFilter = $filter('date');

        /**
         *
         * @param timeStr 时间字符串 HH:mm/HH:mm:ss
         * @description 时间字符串转Date对象，使用当前时间补全日期
         */
        this.timeToDate = function (timeStr) {
            if (timeStr) {
                return new Date(_dateFilter(new Date(), 'yyyy-MM-dd') + "T" + timeStr);
            } else {
                return;
            }
        };

        /**
         *
         * @param timeStr 时间字符串 HH:mm/HH:mm:ss
         * @description 时间字符串使用当前时间补全日期转成Date对象，然后按照指定pattern格式化
         * @example 去除秒：formatTimeStr('12:30:45','HH:mm')
         */
        this.formatTime = function (timeStr, pattern) {
            if (timeStr) {
                return _dateFilter(this.timeToDate(timeStr), pattern);
            } else {
                return '';
            }
        };

        /**
         * pattern 预定义格式有：
         * 匹配java类型的三个预定义格式：localTime(HH:mm),localDate('yyyy-MM-dd'),localDateTime('yyyy-MM-ddTHH:mm:ss').
         * 页面常用展示格式:dateTime('yyyy-MM-dd HH:mm')，date('yyyy-MM-dd'),fullTime('HH:mm:ss'),time('HH:mm')
         *
         * @param date{string|number|Date}
         * @param pattern 日期格式 yyy-MM-dd HH:mm:ss,
         * @returns {string}
         * @description 日期对象、毫秒值、字符串格式化输出。日期字符串必须带有年月日，时间不要求。
         */
        this.formatDate = function (date, pattern) {
            if (date) {
                if (pattern === 'localTime' || pattern === 'time') {
                    pattern = 'HH:mm';
                } else if (pattern === 'localDate' || pattern === 'date') {
                    pattern = 'yyyy-MM-dd';
                } else if (pattern === 'localDateTime') {
                    pattern = 'yyyy-MM-ddTHH:mm:ss';
                } else if (pattern === 'dateTime') {
                    pattern = 'yyyy-MM-dd HH:mm';
                } else if (pattern === 'fullTime') {
                    pattern = 'HH:mm:ss';
                }
                return _dateFilter(date, pattern);
            } else {
                return '';
            }
        }
    }
})();


/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/11/07
 */

(function () {
    'use strict';
    bootstrapDropdownEx();

    function bootstrapDropdownEx() {
        avoidCloseOnClickInside();
        dropdownAppendToBody();
        triggerByHover();

        /**
         * Hover to trigger bootstrap dropdown
         */
        function triggerByHover() {
            var $body = $('body');
            var timer;
            $body.on('mouseenter', '.dropdown.op-hover-dropdown .dropdown-toggle', function (e) {
                var elem = $(this);
                // Add delay to detect user intent
                //https://stackoverflow.com/questions/14818438/delay-javascript-hover-action
                timer = setTimeout(function () {
                    var dropdown = elem.closest('.dropdown');
                    dropdown.addClass('open');
                    tryAppendDropdownToBody(dropdown);
                }, 300);
            }).on('mouseleave', '.dropdown.op-hover-dropdown', function (e) {
                var dropdown = $(this).closest('.dropdown');
                if (timer)
                    clearTimeout(timer);
                dropdown.removeClass('open');
                tryRestoreDropdownFromBody(dropdown);
            }).on('click.bs.dropdown', '.op-hover-dropdown .op-dropdown-item', function (e) {
                var dropdown = $(this).closest('.dropdown');
                dropdown.removeClass('open');
                tryRestoreDropdownFromBody(dropdown);
            });
        }


        /**
         * Don't close bootstrap dropdown when click inside. The dropdown menu shall be marked `.js-inside-click` class.
         * https://stackoverflow.com/questions/25089297/avoid-dropdown-menu-close-on-click-inside/25196101#25196101
         */
        function avoidCloseOnClickInside() {
            $('body').on("click.bs.dropdown", '.dropdown-menu.js-inside-click', function (e) {
                var elem = $(e.target);
                var needClose = elem.closest('.js-dropdown-click-to-close').length > 0;
                if (needClose) {
                    // Do default
                } else {
                    e.stopPropagation();
                }
            });
        }

        function tryAppendDropdownToBody(dropdown) {
            var menu = dropdown.find('.dropdown-menu.op-append-to-body');
            if (menu.length === 0) {
                return;
            }

            // detach it and append it to the body
            $('body').append(menu.detach());

            // grab the new offset position
            var eOffset = dropdown.offset();
            // make sure to place it where it would normally go (this could be improved)
            menu.css({
                'z-index': '9999999',
                'display': 'block',
                'top': eOffset.top + dropdown.outerHeight(),
                'left': eOffset.left
            });
            dropdown.data('menu', menu);
        }

        function tryRestoreDropdownFromBody(dropdown) {
            var menu = dropdown.data('menu');
            if (menu) {
                dropdown.append(menu.detach());
                menu.hide();
            }
        }

        /**
         * Append dropdown to body
         * https://stackoverflow.com/questions/31029300/how-to-append-a-single-dropdown-menu-to-body-in-bootstrap
         */
        function dropdownAppendToBody() {
            var $body = $('body');
            $body.on('show.bs.dropdown', function (e) {
                var dropdown = $(e.target);
                tryAppendDropdownToBody(dropdown);
            });

            // and when you hide it, reattach the drop down, and hide it normally
            $body.on('hide.bs.dropdown', function (e) {
                var dropdown = $(e.target);
                tryRestoreDropdownFromBody(dropdown);
            });
        }
    }
})();
/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/17, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opxPopdrop
     * @description
     * Popover and dropdown with bootstrap 5.
     * ```html
     * <ANY data-bs-toggle="dropdown|popover" opx-popdrop>
     * ```
     * @see https://getbootstrap.com/docs/5.1/components/popovers/#options
     * @see https://getbootstrap.com/docs/5.1/components/dropdowns/#options
     */
    angular.module('oplus.commons').directive('opxPopdrop', ['$parse', opxPopdropDirective]);

    function opxPopdropDirective($parse) {
        return {
            restrict: 'A',
            scope: {
                theConfig: '<opxPopdrop',
                title: '@bsTitle'
            },
            link: linkFn
        };

        function linkFn(scope, element, attrs, ctrl) {
            var toggleType = element.data('bsToggle');
            var instance;
            var domEl = element[0];
            scope.theConfig = scope.theConfig || {};
            if (toggleType === 'dropdown') {
                instance = new bootstrap.Dropdown(domEl, {
                    popperConfig: {
                        strategy: 'fixed'
                    }
                });
            } else if (toggleType === 'popover') {
                // console.log('popover...%o',document.querySelector('.btn-info'));
                var theConfig = scope.theConfig;
                var options = {html: true, container: 'body'};
                if (theConfig.content) {
                    if (theConfig.content.startsWith('#')) {
                        var contentElem = $(theConfig.content);
                        options.content = contentElem;
                    }
                }
                instance = new bootstrap.Popover(domEl, options);
            }
            if (instance) {
                scope.$on('$destroy', function () {
                    // console.log('destroy');
                    instance.dispose();
                });
            }
        }
    }
})();

/**
 * @author Joker Liu , created on 03/04/2020
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('OpDownload', OpDownload);

    OpDownload.$inject = ['$http', 'messageService','$uibModal','$translate'];

    /**
     * @ngdoc service
     * @name OpDownload
     * @description service for file upload
     *
     * @param {$http} $http
     * @param {messageService} messageService
     */
    function OpDownload($http, messageService,$uibModal,$translate) {

        this.download = download;

        /**
         * Content-Disposition: attachment; filename="check-rhel-gmcc-latest.sh"
         *
         * @param {string} url 请求地址，分隔符为"/"
         * @param {string} [fileName] 要保存为的文件名。不传则优先跟据Content-Disposition识别，其次跟据URL识别文件名。可选
         * @param {string} [method] http 请求方式，默认GET。可选
         * @param {object} [params] 转为?param1=xx1¶m2=xx2的形式，可选
         * @param {object} [data] 包含了将被当做消息体发送给服务器的数据，通常在POST请求时使用。可选
         */
        function download(url, fileName, method, params, data) {
            var httpConfig = {
                url: url,
                method: method ? method : "GET",
                responseType: "arraybuffer"
            };
            if (params) {
                httpConfig.params = params;
            }
            if ("POST" === method) {
                httpConfig.data = data;
            }
            //大小*下载速度=进度(待定),拟态框(待优化)。
            var instance = $uibModal.open({
                template: '<div class="modal-header">'+
                    '<button type="button" class="btn-close" data-dismiss="modal" title="'+$translate.instant('common.file.close_prompt')+'" ng-click="$ctrl.cancel()" style="margin-left: 95%;"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="op-blank-slate">' +
                    '<div class="op-blank-slate-icon">' +
                    '<i class="fa fa-4x fa-pulse fa-spinner fa-fw"></i>' +
                    '</div>' +
                    '<p class="op-flashing-text">'+$translate.instant('common.file.file_downloading')+'</p>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope','$uibModalInstance',viewCtrl],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: 'static'
            });

            function viewCtrl($scope,$uibModalInstance){
                var vm = this;
                vm.cancel = cancel;
                function cancel() {
                    $uibModalInstance.close({action: "cancel"});
                }
                $http(httpConfig).then(
                    function success(response) {
                        var finalFileName = getFileName(fileName, response, url);
                        var file = new File([response.data], finalFileName, {type: response.headers("Content-Type")});
                        saveAs(file);
                        $uibModalInstance.close(true);
                        // messageService.toast('success', '下载完成','文件名：'+finalFileName);
                        // Open file
                        // var file=new Blob([response.data],{type: response.headers("Content-Type")});
                        // var fileUrl=URL.createObjectURL(file);
                        // window.open(fileUrl);
                    }, function error(err) {
                        //响应错误的处理方法体
                        messageService.toast('error', '【' + fileName + '】'+$translate.instant('common.file.download_failed'), err.message || err);
                    });
            }

            /**
             * Content-Disposition: attachment; filename="check-rhel-gmcc-latest.sh"
             *
             * 优先使用assign,其次跟据response header中的Content-Disposition识别，最后跟据URL识别文件名。可选
             *
             * @param {string} assignName
             * @param {object} response response
             * @param {string} url url
             * @returns {string} file name
             *
             */
            function getFileName(assignName, response, url) {
                var result, tempArr;
                if (assignName && assignName.length > 0) {
                    result = assignName;
                } else {
                    var contentDisposition = response.headers("Content-Disposition");
                    if (contentDisposition && contentDisposition.indexOf("filename") !== -1) {
                        tempArr = contentDisposition.split(";");
                        var fileNamePart = _.find(tempArr, function (str) {
                            return str.indexOf("filename") !== -1;
                        });
                        var fileNameStr = fileNamePart.trim().split("=")[1];
                        result = fileNameStr.substring(1, fileNameStr.length - 1);
                    } else {
                        tempArr = url.split("/");
                        result = tempArr[tempArr.length - 1];
                    }
                }
                return result;
            }

        }

    }
})();

/**
 * @author Joker Liu , created on 04/08/2019
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('OpUpload', OpUpload);

    OpUpload.$inject = ['Upload', '$q', '$http'];

    /**
     * @ngdoc service
     * @name OpUpload
     * @description service for file upload
     *
     */
    function OpUpload(Upload, $q, $http) {

        this.uploadOrReplace = uploadOrReplace;
        this.upload = upload;
        this.preUpload = preUpload;
        this.confirm = confirm;
        this.replace = replace;
        this.delete = deleteFile;
        this.getOriginalNameFromPath = getOriginalNameFromPath;

        /**
         * @description union of upload, preUpload,replace
         *
         * @param option {object} {module:'module', category:'category',action: 'preUpload' or undefined, files: file array, id: file id for replace, path: file path for replace,updateName: whether
         * update existing record's file name}
         * @returns {promise}
         */
        function uploadOrReplace(option) {
            var module = option.module;
            var category = option.category;
            var module = option.module;

            if ((option.id != undefined && option.id.length > 0) || (option.path != undefined && option.path.length > 0)) {
                return replace(module, category, option.files[0], option.id, option.path, option.updateName);
            } else if (option.action == "preUpload") {
                return preUpload(module, category, option.files);
            } else {
                return upload(module, category, option.files);
            }
        }

        /**
         * @description upload file to file server and return remote file path
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param files {Array<file>} file array
         * @param action {string} 'upload' or 'preUpload'
         * @returns {promise} promise resolve result format :
         * {
         *   data:[{
         *       id,
         *       name:originalName + '-' + milliseconds,
         *       originalName,
         *       size,
         *       module:value，
         *       category,
         *       path:'module + / + category + / + name',
         *       status:preUpload/upload/uploadFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         *
         */
        function upload(module, category, files, action) {
            var deferred = $q.defer();//声明承诺

            action = action == undefined ? "upload" : action;
            Upload.upload({
                url: 'api/upload',
                data: {action: action, module: module, category: category, params: files}
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);//请求成功
            }).error(function (data, status, headers, config) {
                deferred.reject(data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        }

        /**
         * @description upload file to file server and return remote file path, the remote file path is truly : '/temp' + file path
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param files {Array<file>} file array
         * @returns {promise} promise resolve result format : </br>
         * {
         *   data:[{
         *       id,
         *       name:originalName + '-' + milliseconds,
         *       originalName,
         *       size,
         *       module:value，
         *       category,
         *       path:'module + / + category + / + name',//the file path is accessible after confirmed
         *       status:preUpload/uploadFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         *
         */
        function preUpload(module, category, files) {
            return upload(module, category, files, "preUpload");
        }

        /**
         * @description use to confirm file upload by method preUpload
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param ids {Array<string>} array of file id
         * @returns {promise} promise resolve result format :</br>
         * {
         *   data:[{
         *       id,
         *       name,
         *       originalName,
         *       size,
         *       module,
         *       category,
         *       path:,
         *       status:upload/confirmFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         */
        function confirm(module, category, ids) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/upload/confirm", {module: module, category: category, params: ids})
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        }


        /**
         * @description replace the file content by id or path, replacement will not change exiting file name,id and path, so no need to update the existing reference
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param file {file}
         * @param id {string} id priority is greater than path
         * @param path {string}
         * @returns {promise} promise resolve result format :</br>
         * {
         *   data:[{
         *       id,
         *       name,
         *       originalName,
         *       size,
         *       module:value，
         *       category,
         *       path,
         *       status:replace/upoloadFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         */

        function replace(module, category, file, id, path, isUpdateName) {
            var action = id != undefined ? "replaceById" : "replaceByPath";
            action = isUpdateName ? (action + "AndUpdateName") : action;

            var deferred = $q.defer();//声明承诺
            Upload.upload({
                url: 'api/upload',
                method: 'put',
                data: {action: action, module: module, category: category, params: [file], id: id, path: path}
            }).success(function (data, status, headers, config) {
                // console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                deferred.resolve(data);//请求成功
            }).error(function (data, status, headers, config) {
                // console.log('error status: ' + status);
                deferred.reject(data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        }

        /**
         * @description delete file by id or path
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param ids {Array<string>}
         * @param paths {Array<string>}
         * @returns {promise} promise resolve result format :</br>
         * {
         *   data:[{
         *       id,
         *       name,
         *       originalName,
         *       size,
         *       module:value，
         *       category,
         *       path,
         *       status:delete/deleteFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         */
        function deleteFile(module, category, ids, paths) {
            var deferred = $q.defer();//声明承诺

            var action, params;
            if (ids != undefined) {
                action = "deleteById";
                params = ids;
            } else {
                action = "deleteByPath";
                params = paths;
            }

            $http.delete("api/upload?action=" + action + "&module=" + module + "&category=" + category + "&params=" + params.join(','))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });

            return deferred.promise;   // 返回承诺
        }

        /**
         * get original file name from path(/xxx/xxx/xxxx-name.type)
         * @param path
         * @returns {string}
         */
        function getOriginalNameFromPath(path) {
            var originalName = "";
            if (path) {
                var tempArr = path.split("/");
                var fileName = tempArr[tempArr.length - 1];
                originalName = fileName.slice(fileName.indexOf("-") + 1);
            }
            return originalName;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('accessDenyInterceptor', accessDenyInterceptor);

    accessDenyInterceptor.$inject = ['$q', 'messageService'];

    function accessDenyInterceptor($q, messageService) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            // Disable show 403 error
            // console.log("responseError");
            // if (response.status === 403 && response.data != null && response.data.path.indexOf("/api/account") == -1) {
            //     var title = response.data.error;
            //     var message =response.data.message +  "<br>[Path = " + response.data.path + "]";
            //     messageService.alertError(title, message);
            // }
            return $q.reject(response);
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('authExpiredInterceptor', authExpiredInterceptor);

    authExpiredInterceptor.$inject = ['$rootScope', '$q', '$injector', '$localStorage', '$sessionStorage', 'currentUser'];

    function authExpiredInterceptor($rootScope, $q, $injector, $localStorage, $sessionStorage, currentUser) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            var clearAuthIf401 = false;
            if (response.status === 401 && clearAuthIf401) {
                //LEO@20170109
                // currentUser.clearUserInfo();
            }
            return $q.reject(response);
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', 'currentUser', '$translate'];

    function authInterceptor($q, currentUser, $translate) {
        var service = {
            request: request
        };

        return service;

        function request(config) {
            if (!config || !config.url) return config;
            config.headers = config.headers || {};

            // LEO@20180108
            // The API URLs in jHipster shipped code are relative path starting with `api` or `management`
            var isJhipsterShippedUrl = /^(api)|(management)\//.test(config.url);
            // var isModuleApi = /(api\/tm\/)|(api\/cm\/)|(api\/cac\/)|(api\/udp\/)|(api\/dts\/)|(api\/pms\/)/.test(config.url);
            var isModuleApi = /(?!^)(\/api\/)/.test(config.url);//非开始位置匹配"api/"
            // console.log(config.url + ' [isPortalApi = ' + isPortalApi + ']  [isModuleApi = ' + isModuleApi + "]");

            var tenantId = window.$oplus.appConfig.tenantId;
            if (tenantId) {
                config.headers['Tenant-Id'] = tenantId;
                config.headers['Language'] = $translate.use();
            }
            // 目前暂时没有对请求参数签名校验，只是简单的防止重放攻击
            var timestamp = Date.now();
            config.headers['Timestamp'] = timestamp;
            // 生成字符串随机数，防止重复攻击
            config.headers['Nonce'] = "oplus-" + Math.random().toString(36).substr(2) + "-" + timestamp;
            // config.headers['Sign'] = generateApiSignature("oplus", "Oplus@2022!sys", {}).signature;
            // console.log("authInterceptor get tenant id is " + tenantId);

            if (isJhipsterShippedUrl) {
                config.url = window.$oplus.appConfig.apiBaseUrls.portal + '/' + config.url;
            } else if (!isModuleApi) {
                //TODO: is this local url like request of webserver JS/HTML/JSON?
                return config;
            }
            if (currentUser.isAuthenticated && config.url.indexOf("api/authenticate/refresh") > -1) {
                //update latest request time for every request
                currentUser.latestRequestTime = Date.now();
            }

            var URLS_WITHOUT_AUTH_TOKEN = [/api\/tenants\/all/, /api\/licenses\/verify/, /api\/authenticate\/otp/, /api\/authenticate/];
            var ignoreAuthToken = _.find(URLS_WITHOUT_AUTH_TOKEN, function (regex) {
                return regex.test(config.url);
            })
            if (ignoreAuthToken) {
                return config;
            }

            var token = currentUser.authToken;
            if (token) {
                // console.log("Run authInterceptor set token for  " + config.url　);
                config.headers.Authorization = 'Bearer ' + token;
            } else {
                console.warn("auth.interceptor: cannot find token...", config.url);
            }

            return config;
        }
    }

    // function generateRandomString(length) {
    //     var result = '';
    //     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (var i = 0; i < length; i++) {
    //         result += characters.charAt(Math.floor(Math.random() * characters.length));
    //     }
    //     return result;
    // }
    //
    // function generateApiSignature(apiKey, apiSecret, params) {
    //     // 生成随机字符串作为 nonce
    //     var nonce = generateRandomString(16);
    //
    //     // 按照字典序对参数进行排序
    //     var keys = Object.keys(params).sort();
    //
    //     // 拼接参数和值
    //     var data = '';
    //     for (var i = 0; i < keys.length; i++) {
    //         data += keys[i] + params[keys[i]];
    //     }
    //
    //     // 计算 HMAC-SHA256 签名
    //     var shaObj = new jsSHA('SHA-256', 'TEXT');
    //     shaObj.setHMACKey(apiSecret, 'TEXT');
    //     shaObj.update(apiKey + nonce + data);
    //     var hmac = shaObj.getHMAC('HEX');
    //
    //     // 返回 API 签名
    //     return {
    //         apiKey: apiKey,
    //         nonce: nonce,
    //         signature: hmac
    //     };
    // }

})();

(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('errorHandlerInterceptor', errorHandlerInterceptor);

    errorHandlerInterceptor.$inject = ['$q', '$rootScope'];

    function errorHandlerInterceptor ($q, $rootScope) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError (response) {
            // console.log('errorhandler.interceptor');
            if (!(response.status === 401 && (response.data === '' || (response.data.path && response.data.path.indexOf('/api/account') === 0 )))) {
                $rootScope.$emit('oplusApp.httpError', response);
            }
            return $q.reject(response);
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .config(httpConfig);

    httpConfig.$inject = ['$urlRouterProvider', '$httpProvider', 'httpRequestInterceptorCacheBusterProvider', '$urlMatcherFactoryProvider'];

    function httpConfig($urlRouterProvider, $httpProvider, httpRequestInterceptorCacheBusterProvider, $urlMatcherFactoryProvider) {
        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*\/api\/.*/, /.*protected.*/], true);

        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('accessDenyInterceptor');
        // $httpProvider.interceptors.push('notificationInterceptor');

        // jhipster-needle-angularjs-add-interceptor JHipster will add new application http interceptor here

        $urlMatcherFactoryProvider.type('boolean', {
            name : 'boolean',
            decode: function(val) { return val === true || val === 'true'; },
            encode: function(val) { return val ? 1 : 0; },
            equals: function(a, b) { return this.is(a) && a === b; },
            is: function(val) { return [true,false,0,1].indexOf(val) >= 0; },
            pattern: /bool|true|0|1/
        });
    }
})();

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

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2021/08/23
 */
(function () {
    'use strict';
    angular.module('oplus.commons')
        .config(['$httpProvider', i18nInterceptorConfig])
        .config(['$translateProvider', 'tmhDynamicLocaleProvider', i18nTranslateConfig]);

    /**
     *
     * LEO@20111118: Do NOT use $translatePartialLoaderProvider. It is an async loader which fetch data via `$http`.
     * Translation code in `run` might execute before language loaded.
     * We use sync loader instead.
     * @param {$translateProvider} $translateProvider
     * @param {tmhDynamicLocaleProvider} tmhDynamicLocaleProvider
     * @param {$translatePartialLoaderProvider} $translatePartialLoaderProvider
     */
    function i18nTranslateConfig($translateProvider, tmhDynamicLocaleProvider) {
        // console.log('i18nTranslateConfig')
        addTranslations();
        setUserLanguage();
        configTranslateProvider();

        function addTranslations() {
            Object.keys(window['@oplus/langs']).forEach(function (key) {
                $translateProvider.translations(key, window['@oplus/langs'][key]);
            });
            // Delete languages to release memory
            delete window['@oplus/langs'];
        }

        /**
         * Set preferred language for current user
         */
        function setUserLanguage() {
            var defaultLanguage = getDefaultLanguage();
            // console.log('defaultLanguage:%s',defaultLanguage);
            $translateProvider.preferredLanguage(defaultLanguage);
        }

        function getDefaultLanguage() {
            var browserLang = navigator.language.toLowerCase();
            if (angular.isDefined($translateProvider.translations()[browserLang])) {
                return browserLang;
            }
            return window.$oplus.appConfig.i18n.defaultLanguage;
        }

        function configTranslateProvider() {
            // if (window.$oplus.appConfig.i18n.isDebugLanguage) {
            //     $translateProvider.postProcess(function (translationId, translation, interpolatedTranslation, params, lang) {
            //         return '<span style="color: #cccccc">' + translationId + '(' + lang + '):</span> ' +
            //             (interpolatedTranslation ? interpolatedTranslation : translation);
            //     });
            // }
            // $translateProvider.useStorage('translationStorageProvider');
            $translateProvider.useLocalStorage();
            $translateProvider.useSanitizeValueStrategy('escaped');
            $translateProvider.storageKey('oplus.locale');
            // $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

            tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular-locale_{{locale}}.js');
            tmhDynamicLocaleProvider.useCookieStorage();
            tmhDynamicLocaleProvider.storageKey('oplus.locale');
        }
    }


    // /**
    //  *
    //  * @param {i18nService} i18nService
    //  * @param $translate
    //  */
    // function initUserLanguage(i18nService, $translate) {
    //     i18nService.getUserLastUsedLanguage().then(function (language) {
    //         console.log('initUserLanguage: use ' + language);
    //         $translate.use(language);
    //         moment.locale(language);
    //     });
    // }

    /**
     *
     * @param $httpProvider
     */
    function i18nInterceptorConfig($httpProvider) {
        // console.log('i18nInterceptorConfig');
        $httpProvider.interceptors.push(['$q', 'i18nService', i18nInterceptor]);

        /**
         *
         * @param $q
         * @param {i18nService} i18nService
         * @see https://docs.angularjs.org/api/ng/service/$http#interceptors
         */
        function i18nInterceptor($q, i18nService) {
            var TRANSLATE_STATIC_HTML = true;
            var TRANSLATE_API_DATA = true;
            var apiDataDefs = [
                {urlPattern: /api\/udp\/pages/, fields: ['html', 'title', 'content.title']},
                {urlPattern: /\/assets\/udp\/.*\.json/, fields: ['html','title']},
                {urlPattern: /api\/udp\/applets\/name\/.+/, fields: ['title', 'setting']},
                {urlPattern: /api\/udp\/applets/, fields: ['title']},
                {urlPattern: /api\/adm\/applet\/id/, fields: ['title']},
                {urlPattern: /api\/jao\/jobs\?/, fields: ['title', 'description']},
                {urlPattern: /api\/jao\/jobs\/app\?/, fields: ['title', 'description']},
                {urlPattern: /api\/jao\/jobs\/recently\?/, fields: ['jobTitle']},
                {urlPattern: /api\/jao\/jobs\?appletCode=/, fields: ['title']},
                {urlPattern: /api\/jao\/dc\/model/, fields: ['attrs', 'title']},
                {urlPattern: /api\/dts\/datasets\/findby\/applet/, fields: ['name']},
                {urlPattern: /api\/dts\/q\/data\/JAO_LIST_OPERATION_LOG\//, fields: ['action'], arrField: 'records'},
                {urlPattern: /api\/dts\/q\/data\/JAO_LIST_RUN_LOGS\//, fields: ['job_title'], arrField: 'records'},
            ];
            var htmlDefs = [
                {urlPattern: /^app\/.*\.html$/}
            ];
            var openccI18nDefs = [
                // { urlPattern: / Regex Pattern / [, dataKeys: [ Data Keys need to be translated ]](optional) }
                { urlPattern: /http[s]?:\/\/.*(\/gfs\/api\/gfs\/v2\/.*\/r\/.*\/.*)/, dataKeys: ['name', 'description'] },
                // { urlPattern: /http[s]?:\/\/.*(\/udp\/api\/udp\/pages\/.*)/, dataKeys: ['html'] }
            ];
            var noI18nPageUrl = [
                {urlPattern: /applets\/.*\/mgmt\/data\/models\/data\/model\/edit/ }
            ]

            var NO_I18N_INDICATOR = '__noi18n';
            return {
                // optional method
                request: function (config) {
                    // do something on success
                    return config;
                },
                // optional method
                requestError: function (rejection) {
                    return $q.reject(rejection);
                },
                /**
                 *
                 * @param {{status: number, statusText: string, config:{method:string,url:string, headers:{}}, data: string|*}} resp
                 * {
                 *   "data": "<div id=\"toast-container\" ng-class=\"[config.position, config.animation]\"><div ng-repeat=\"toaster in toasters\" class=\"toast\" ng-class=\"toaster.type\" ng-click=\"click($event, toaster)\" ng-mouseover=\"stopTimer(toaster)\" ng-mouseout=\"restartTimer(toaster)\"><div ng-if=\"toaster.showCloseButton\" ng-click=\"click($event, toaster, true)\" ng-bind-html=\"toaster.closeHtml\"></div><div ng-class=\"config.title\">{{toaster.title}}</div><div ng-class=\"config.message\" ng-switch on=\"toaster.bodyOutputType\"><div ng-switch-when=\"trustedHtml\" ng-bind-html=\"toaster.html\"></div><div ng-switch-when=\"template\"><div ng-include=\"toaster.bodyTemplate\"></div></div><div ng-switch-when=\"templateWithData\"><div ng-include=\"toaster.bodyTemplate\"></div></div><div ng-switch-when=\"directive\"><div directive-template directive-name=\"{{toaster.html}}\" directive-data=\"{{toaster.directiveData}}\"></div></div><div ng-switch-default >{{toaster.body}}</div></div></div></div>",
                 *   "status": 200,
                 *   "config": {
                 *      "method": "GET",
                 *      "cache": {},
                 *      "url": "angularjs-toaster/toast.html",
                 *      "headers": {
                 *      }
                 *   },
                 *   "statusText": "OK"
                 * }
                 */
                response: function (resp) {
                    var url = resp.config.url;
                    var href = location.href;
                    if (url.indexOf(NO_I18N_INDICATOR) > -1) {
                        return resp;
                    }

                    if (TRANSLATE_STATIC_HTML) {
                        for (var j = 0; j < htmlDefs.length; j++) {
                            var html = htmlDefs[j];
                            if (html.urlPattern.test(url)) {
                                resp.data = i18nService.text(resp.data);
                                return resp;
                            }
                        }
                    }
                    if (TRANSLATE_API_DATA) {
                        for (var i = 0; i < noI18nPageUrl.length; i++) {
                            var def = noI18nPageUrl[i];
                            if (def.urlPattern.test(href)) {
                                return resp;
                            }
                        }

                        for (var i = 0; i < apiDataDefs.length; i++) {
                            var def = apiDataDefs[i];
                            if (def.urlPattern.test(url)) {
                                var data = resp.data;
                                if (data && def.arrField)
                                    data = resp.data[def.arrField];

                                if (angular.isString(data)) {
                                    resp.data = i18nService.text(data);
                                } else if (angular.isArray(data)) {
                                    def.fields.forEach(function (field) {
                                        data.forEach(function (record) {
                                            updateDataField(record, field, transField);
                                        });
                                    });
                                } else if (angular.isObject(data)) {
                                    def.fields.forEach(function (field) {
                                        updateDataField(data, field, transField);
                                    });
                                }
                                break;
                            }
                        }
                    }

                    // opencc
                    _.forEach(openccI18nDefs, function (item) {
                        if (item.urlPattern.test(url)) {
                            if (item.dataKeys)
                                resp.data = i18nService.translateTwp(resp.data, item.dataKeys);
                        } else
                            resp.data = i18nService.translateTwp(resp.data);
                    })

                    return resp;
                },
                responseError: function (rejection) {
                    return $q.reject(rejection);
                }
            };

            function transField(record, field) {
                record[field] = i18nService.text(record[field]);
            }

            function updateDataField(data, field, fn) {
                if (angular.isUndefined(data)) {
                    return;
                }
                if (angular.isArray(data)) {
                    data.forEach(function (item) {
                        updateDataField(item, field, fn);
                    });
                } else if (angular.isObject(data)) {
                    var paths = field.split('.');
                    var currentPath = paths.shift();
                    var pathValue = data[currentPath];
                    if (!angular.isObject(pathValue)) {
                        fn(data, currentPath);
                    } else {
                        updateDataField(pathValue, paths.join('.'), fn);
                    }
                }
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .filter('findLanguageFromKey', ['LANGUAGES', findLanguageFromKey])

    function findLanguageFromKey(LANGUAGES) {
        return findLanguageFromKeyFilter;

        function findLanguageFromKeyFilter(lang) {
            return _.find(LANGUAGES, {code: lang}).title;
        }
    }


    angular.module('oplus.commons')
        .filter('ttt', ['$filter', tttFilter]);

    /**
     * @ngdoc filter
     * @name ttt
     */
    function tttFilter($filter) {
        return function (value, defaultValue) {
            var result = $filter("translate")(value)
            //If translate returns the same key sent we return null
            if (result === value) {
                return defaultValue;
            }
            return result;
        }
    }
})();

(function () {
    'use strict';

    angular.module('oplus.commons').service('i18nService', i18nService);
    angular.module('oplus.commons').run(['customFunctions', '$translate', function (cf, $translate) {
        cf.defineFunction('translate', {
            func: function (translationId) {
                return $translate.instant(translationId)
            },
            group: 'dev',
            sample: 'translate(translationId)',
            desc: ""
        });
    }]);
    i18nService.$inject = ['$q', '$translate', 'tmhDynamicLocale', 'LANGUAGES'];

    /**
     * @ngdoc service
     * @param $q
     * @name i18nService
     * @param {$translate} $translate
     * @param tmhDynamicLocale
     * @param {LANGUAGES} LANGUAGES
     */
    function i18nService($q, $translate, tmhDynamicLocale, LANGUAGES) {
        this.initLanguage = initLanguage;
        this.text = text;
        this.getAllLanguages = getAllLanguages;
        this.getUserLastUsedLanguage = getUserLastUsedLanguage
        this.translateWithPrefixAndKey = translateWithPrefixAndKey;
        this.addLocaleForPivot = addLocaleForPivot;
        this.translateTwp = translateTwp;


        // TODO temporary solution
        var converterZhCnToZhTwP;
        if (typeof OpenCC !== 'undefined' && OpenCC && OpenCC.Converter) {
            converterZhCnToZhTwP = OpenCC.Converter({ from: 'cn', to: 'twp' });
        } else {
            console.warn('OpenCC is not loaded yet, will retry later');
            // 延迟初始化
            setTimeout(function() {
                if (typeof OpenCC !== 'undefined' && OpenCC && OpenCC.Converter) {
                    converterZhCnToZhTwP = OpenCC.Converter({ from: 'cn', to: 'twp' });
                }
            }, 100);
        }

        /**
         * Use Opencc-Js to translate zh-CN to zh-TW(Phrases)
         * @param {*} obj Data Object to translate
         * @param {*} dataKeys Json Data Keys that need to be translated
         * @returns
         */
        function translateTwp(obj, dataKeys, force) {
            if (!obj) return obj;
            var currentLang = $translate.use();
            if (currentLang === 'zh-tw' || force === true) {
                var beginTranslateTs, res;
                beginTranslateTs = Date.now();
                if (dataKeys && angular.isArray(dataKeys) && dataKeys.length > 0) {
                    if (angular.isArray(obj))
                        obj.forEach(function (item) {
                            dataKeyHandler(item, dataKeys);
                        })
                    else if (angular.isObject(obj))
                        dataKeyHandler(obj, dataKeys);

                    res = obj;
                }
                else if (converterZhCnToZhTwP) {
                    res = JSON.parse(converterZhCnToZhTwP(JSON.stringify(obj)));
                } else {
                    console.warn('OpenCC converter not available, returning original object');
                    res = obj;
                }

                // console.log('%c[OpenccJs]%c Translate used:', 'color:teal', '', Date.now() - beginTranslateTs + 'ms');
                return res;
            }
            else return obj;

            function dataKeyHandler(objItem, dataKeys) {
                if (!converterZhCnToZhTwP) {
                    console.warn('OpenCC converter not available for dataKeyHandler');
                    return;
                }
                dataKeys.forEach(function (key) {
                    if (objItem[key]) objItem[key] = converterZhCnToZhTwP(objItem[key])
                })
            }
        }

        /**
         * Init application language from default or specified language
         * @param {string=} langKey Force to use specified language
         * @return {Promise<string>} Language key
         */
        function initLanguage(langKey) {
            var promise;
            if (langKey) {
                promise = $q.when(langKey);
            } else {
                promise = getUserLastUsedLanguage();
            }
            return $q.when(promise.then(function (language) {
                // console.log('initUserLanguage: use ' + language);
                $translate.use(language);
                tmhDynamicLocale.set(language);
                moment.locale(language);
                return language;
            }));
        }

        function addLocaleForPivot(lang, translations) {
            var theLocale = $.pivotUtilities.locales[lang] = {
                localeStrings: translations,
                aggregators: $.pivotUtilities.aggregators,
                renderers: $.pivotUtilities.renderers
            };
            var c3r = $.pivotUtilities.c3_renderers;
            if (c3r) {
                theLocale.c3_renderers = $.pivotUtilities.c3_renderers;
                theLocale.renderers = $.extend(theLocale.renderers, theLocale.c3_renderers);
            }
            return theLocale;
        }

        /**
         * Translate input data by one key field and prefix.
         * It iterates every data. It translates with prefix + key field value and assign to target field.
         * It will mutate the input data.
         * @param {array|object} data
         * @param {string} prefix  Translation prefix
         * @param {string} keyField The field whose value will be appended to prefix as translation ID
         * @param {string} targetField The field to which the translated value will be assigned
         * @return Translated data
         */
        function translateWithPrefixAndKey(data, prefix, keyField, targetField) {
            if (angular.isArray(data)) {
                data.forEach(function (o) {
                    o[targetField] = $translate.instant(prefix + o[keyField]);
                });
            } else if (angular.isObject(data)) {
                Object.keys(data).forEach(function (prop) {
                    var item = data[prop];
                    var field = keyField === '$$KEY' ? prop : data[prop][keyField];
                    data[prop][targetField] = $translate.instant(prefix + field);
                });
            }
            return data;
        }

        /**
         *
         * @return {Promise<[String]>} All language codes
         */
        function getAllLanguages() {
            var deferred = $q.defer();
            deferred.resolve(_.map(LANGUAGES, 'code'));
            return deferred.promise;
        }

        /**
         *
         * @return {Promise<string>}
         */
        function getUserLastUsedLanguage() {
            var d = $q.defer();
            var language = $translate.storage().get($translate.storageKey());
            if (!language) {
                language = navigator.language.toLowerCase();
            }
            if (!_.find(LANGUAGES, {code: language})) {
                language = window.$oplus.appConfig.i18n.defaultLanguage;
            }
            d.resolve(language);
            return d.promise;
        }

        // this.token = token;

        /**
         * Translate by key
         * @param {string} key It can be a translation id or translation id wrapped with `#{}`
         */
        function token(key) {
            if (!key) {
                return key;
            }
            var matches = /#{(.*?)}/.exec(key);
            if (matches) {
                key = matches[1];
            }
            return $translate.instant(key);
        }

        /**
         * Translate text with `#{translationId}` inside
         * @param {string} str Input string
         * @returns {string}
         */
        function text(str) {
            if (!str || !angular.isString(str)) {
                return str;
            }
            var matches = str.match(/#{(.*?)}/g);
            if (matches) {
                matches.forEach(function (match) {
                    // Extract id from `#{translationId}`

                    var translationId = match.substring(2, match.length - 1);
                    if(translationId.includes("=")){
                        console.info("i18n translation contain critical code:", translationId);
                        return;
                    }
                    str = str.replace(new RegExp(match, 'g'), $translate.instant(translationId));
                });
            }
            return str;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .controller('LangSwitchController', LangSwitchController);

    LangSwitchController.$inject = ['$state', '$translate', 'i18nService', 'tmhDynamicLocale'];

    /**
     *
     * @param $state
     * @param $translate
     * @param {i18nService} i18nService
     * @param tmhDynamicLocale
     * @constructor
     */
    function LangSwitchController($state, $translate, i18nService, tmhDynamicLocale) {
        var that = this;
        this.languages = null;
        this.currentLanguage=$translate.use();
        this.changeLanguage = changeLanguage;
        this.$onInit = onInit;

        function onInit() {
            i18nService.getAllLanguages().then(function (languages) {
                that.languages = languages;
            });
        }

        function changeLanguage(languageKey) {
            i18nService.initLanguage(languageKey).then(function(){
                // that.currentLanguage = languageKey;
                window.location.reload();
            });
            // $translate.use(languageKey);
            // tmhDynamicLocale.set(languageKey);
            // moment.locale(languageKey);
            // $state.reload();
            // window.location.reload();
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.commons')

        /*
         Languages codes are ISO_639-1 codes, see http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
         They are written in English to avoid character encoding issues (not a perfect solution)
         */
        /**
         * https://www.ruanyifeng.com/blog/2008/02/codes_for_language_names.html
         * language-region
         * language-script-region-variant-extension-privateuse
         * language: lowercase, Languages codes are ISO_639-1 codes, see http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
         * script: First letter uppercase, other lowercase
         * region: Uppercase
         *
         * Example: zh-CN, zh-Hans-CN, zh-Hant-CN, zh-HK
         */
        .constant('LANGUAGES', [
            {code: 'zh-cn', title: '中文简体'},
            {code: 'zh-tw', title: '中文正體'},
            {code: 'en', title: 'English'}
            // jhipster-needle-i18n-language-constant - JHipster will add/remove languages in this array
        ]);
})();

(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('translationErrorHandler', translationErrorHandler);

    translationErrorHandler.$inject = ['$q', '$log'];

    function translationErrorHandler($q, $log) {
        return function (part, lang, response) {
            $log.error('The "' + lang + '/' + part + '" part was not loaded.');
            return $q.when({});
        };
    }

})();

(function () {
    'use strict';

    angular.module('oplus.commons')
        .factory('translationStorageProvider', translationStorageProvider);

    translationStorageProvider.$inject = ['$cookies', '$log', 'LANGUAGES'];

    function translationStorageProvider($cookies, $log, LANGUAGES) {

        return {
            get: get,
            put: put
        };

        function get(name) {
            var code = $cookies.getObject(name);
            if (!_.find(LANGUAGES, {code: code})) {
                $log.info('Resetting invalid cookie language "' + code + '" to preferred language "' + window.$oplus.appConfig.i18n.defaultLanguage + '"');
                $cookies.putObject(name, window.$oplus.appConfig.i18n.defaultLanguage);
            }
            return code;
        }

        function put(name, value) {
            $cookies.putObject(name, value);
        }

    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('translationHandler', translationHandler);

    translationHandler.$inject = ['$rootScope', '$window', '$state', '$translate'];

    function translationHandler($rootScope, $window, $state, $translate) {
        return {
            initialize: initialize,
            updateTitle: updateTitle
        };

        function initialize() {
            // if the current translation changes, update the window title
            // var translateChangeSuccess = $rootScope.$on('$translateChangeSuccess', function() {
            //     updateTitle();
            // });

            // $rootScope.$on('$destroy', function () {
            //     if(angular.isDefined(translateChangeSuccess) && translateChangeSuccess !== null){
            //         translateChangeSuccess();
            //     }
            // });
        }


        // update the window title using params in the following
        // precedence
        // 1. titleKey parameter
        // 2. $state.$current.data.pageTitle (current state page title)
        // 3. 'global.title'
        function updateTitle(titleKey) {
            if (!titleKey && $state.$current.data && $state.$current.data.pageTitle) {
                titleKey = $state.$current.data.pageTitle;
            }
            //comment for multiple-tenant
            // $translate(titleKey || 'global.title').then(function (title) {
            //     $window.document.title = title;
            // });
        }
    }
})();

window['@oplus/icons']=[{"name":"500px","unicode":"f26e","searchTerms":[],"isBrand":true},{"name":"accessible-icon","unicode":"f368","searchTerms":["accessibility","handicap","person","wheelchair","wheelchair-alt"],"isBrand":true},{"name":"accusoft","unicode":"f369","searchTerms":[],"isBrand":true},{"name":"acquisitions-incorporated","unicode":"f6af","searchTerms":["Dungeons & Dragons","d&d","dnd","fantasy","game","gaming","tabletop"],"isBrand":true},{"name":"ad","unicode":"f641","searchTerms":["advertisement","media","newspaper","promotion","publicity"],"isBrand":false},{"name":"address-book","unicode":"f2b9","searchTerms":["contact","directory","index","little black book","rolodex"],"isBrand":false},{"name":"address-card","unicode":"f2bb","searchTerms":["about","contact","id","identification","postcard","profile"],"isBrand":false},{"name":"adjust","unicode":"f042","searchTerms":["contrast","dark","light","saturation"],"isBrand":false},{"name":"adn","unicode":"f170","searchTerms":[],"isBrand":true},{"name":"adversal","unicode":"f36a","searchTerms":[],"isBrand":true},{"name":"affiliatetheme","unicode":"f36b","searchTerms":[],"isBrand":true},{"name":"air-freshener","unicode":"f5d0","searchTerms":["car","deodorize","fresh","pine","scent"],"isBrand":false},{"name":"airbnb","unicode":"f834","searchTerms":[],"isBrand":true},{"name":"algolia","unicode":"f36c","searchTerms":[],"isBrand":true},{"name":"align-center","unicode":"f037","searchTerms":["format","middle","paragraph","text"],"isBrand":false},{"name":"align-justify","unicode":"f039","searchTerms":["format","paragraph","text"],"isBrand":false},{"name":"align-left","unicode":"f036","searchTerms":["format","paragraph","text"],"isBrand":false},{"name":"align-right","unicode":"f038","searchTerms":["format","paragraph","text"],"isBrand":false},{"name":"alipay","unicode":"f642","searchTerms":[],"isBrand":true},{"name":"allergies","unicode":"f461","searchTerms":["allergy","freckles","hand","hives","pox","skin","spots"],"isBrand":false},{"name":"amazon","unicode":"f270","searchTerms":[],"isBrand":true},{"name":"amazon-pay","unicode":"f42c","searchTerms":[],"isBrand":true},{"name":"ambulance","unicode":"f0f9","searchTerms":["covid-19","emergency","emt","er","help","hospital","support","vehicle"],"isBrand":false},{"name":"american-sign-language-interpreting","unicode":"f2a3","searchTerms":["asl","deaf","finger","hand","interpret","speak"],"isBrand":false},{"name":"amilia","unicode":"f36d","searchTerms":[],"isBrand":true},{"name":"anchor","unicode":"f13d","searchTerms":["berth","boat","dock","embed","link","maritime","moor","secure"],"isBrand":false},{"name":"android","unicode":"f17b","searchTerms":["robot"],"isBrand":true},{"name":"angellist","unicode":"f209","searchTerms":[],"isBrand":true},{"name":"angle-double-down","unicode":"f103","searchTerms":["arrows","caret","download","expand"],"isBrand":false},{"name":"angle-double-left","unicode":"f100","searchTerms":["arrows","back","caret","laquo","previous","quote"],"isBrand":false},{"name":"angle-double-right","unicode":"f101","searchTerms":["arrows","caret","forward","more","next","quote","raquo"],"isBrand":false},{"name":"angle-double-up","unicode":"f102","searchTerms":["arrows","caret","collapse","upload"],"isBrand":false},{"name":"angle-down","unicode":"f107","searchTerms":["arrow","caret","download","expand"],"isBrand":false},{"name":"angle-left","unicode":"f104","searchTerms":["arrow","back","caret","less","previous"],"isBrand":false},{"name":"angle-right","unicode":"f105","searchTerms":["arrow","care","forward","more","next"],"isBrand":false},{"name":"angle-up","unicode":"f106","searchTerms":["arrow","caret","collapse","upload"],"isBrand":false},{"name":"angry","unicode":"f556","searchTerms":["disapprove","emoticon","face","mad","upset"],"isBrand":false},{"name":"angrycreative","unicode":"f36e","searchTerms":[],"isBrand":true},{"name":"angular","unicode":"f420","searchTerms":[],"isBrand":true},{"name":"ankh","unicode":"f644","searchTerms":["amulet","copper","coptic christianity","copts","crux ansata","egypt","venus"],"isBrand":false},{"name":"app-store","unicode":"f36f","searchTerms":[],"isBrand":true},{"name":"app-store-ios","unicode":"f370","searchTerms":[],"isBrand":true},{"name":"apper","unicode":"f371","searchTerms":[],"isBrand":true},{"name":"apple","unicode":"f179","searchTerms":["fruit","ios","mac","operating system","os","osx"],"isBrand":true},{"name":"apple-alt","unicode":"f5d1","searchTerms":["fall","fruit","fuji","macintosh","orchard","seasonal","vegan"],"isBrand":false},{"name":"apple-pay","unicode":"f415","searchTerms":[],"isBrand":true},{"name":"archive","unicode":"f187","searchTerms":["box","package","save","storage"],"isBrand":false},{"name":"archway","unicode":"f557","searchTerms":["arc","monument","road","street","tunnel"],"isBrand":false},{"name":"arrow-alt-circle-down","unicode":"f358","searchTerms":["arrow-circle-o-down","download"],"isBrand":false},{"name":"arrow-alt-circle-left","unicode":"f359","searchTerms":["arrow-circle-o-left","back","previous"],"isBrand":false},{"name":"arrow-alt-circle-right","unicode":"f35a","searchTerms":["arrow-circle-o-right","forward","next"],"isBrand":false},{"name":"arrow-alt-circle-up","unicode":"f35b","searchTerms":["arrow-circle-o-up"],"isBrand":false},{"name":"arrow-circle-down","unicode":"f0ab","searchTerms":["download"],"isBrand":false},{"name":"arrow-circle-left","unicode":"f0a8","searchTerms":["back","previous"],"isBrand":false},{"name":"arrow-circle-right","unicode":"f0a9","searchTerms":["forward","next"],"isBrand":false},{"name":"arrow-circle-up","unicode":"f0aa","searchTerms":["upload"],"isBrand":false},{"name":"arrow-down","unicode":"f063","searchTerms":["download"],"isBrand":false},{"name":"arrow-left","unicode":"f060","searchTerms":["back","previous"],"isBrand":false},{"name":"arrow-right","unicode":"f061","searchTerms":["forward","next"],"isBrand":false},{"name":"arrow-up","unicode":"f062","searchTerms":["forward","upload"],"isBrand":false},{"name":"arrows-alt","unicode":"f0b2","searchTerms":["arrow","arrows","bigger","enlarge","expand","fullscreen","move","position","reorder","resize"],"isBrand":false},{"name":"arrows-alt-h","unicode":"f337","searchTerms":["arrows-h","expand","horizontal","landscape","resize","wide"],"isBrand":false},{"name":"arrows-alt-v","unicode":"f338","searchTerms":["arrows-v","expand","portrait","resize","tall","vertical"],"isBrand":false},{"name":"artstation","unicode":"f77a","searchTerms":[],"isBrand":true},{"name":"assistive-listening-systems","unicode":"f2a2","searchTerms":["amplify","audio","deaf","ear","headset","hearing","sound"],"isBrand":false},{"name":"asterisk","unicode":"f069","searchTerms":["annotation","details","reference","star"],"isBrand":false},{"name":"asymmetrik","unicode":"f372","searchTerms":[],"isBrand":true},{"name":"at","unicode":"f1fa","searchTerms":["address","author","e-mail","email","handle"],"isBrand":false},{"name":"atlas","unicode":"f558","searchTerms":["book","directions","geography","globe","map","travel","wayfinding"],"isBrand":false},{"name":"atlassian","unicode":"f77b","searchTerms":[],"isBrand":true},{"name":"atom","unicode":"f5d2","searchTerms":["atheism","chemistry","electron","ion","isotope","neutron","nuclear","proton","science"],"isBrand":false},{"name":"audible","unicode":"f373","searchTerms":[],"isBrand":true},{"name":"audio-description","unicode":"f29e","searchTerms":["blind","narration","video","visual"],"isBrand":false},{"name":"autoprefixer","unicode":"f41c","searchTerms":[],"isBrand":true},{"name":"avianex","unicode":"f374","searchTerms":[],"isBrand":true},{"name":"aviato","unicode":"f421","searchTerms":[],"isBrand":true},{"name":"award","unicode":"f559","searchTerms":["honor","praise","prize","recognition","ribbon","trophy"],"isBrand":false},{"name":"aws","unicode":"f375","searchTerms":[],"isBrand":true},{"name":"baby","unicode":"f77c","searchTerms":["child","diaper","doll","human","infant","kid","offspring","person","sprout"],"isBrand":false},{"name":"baby-carriage","unicode":"f77d","searchTerms":["buggy","carrier","infant","push","stroller","transportation","walk","wheels"],"isBrand":false},{"name":"backspace","unicode":"f55a","searchTerms":["command","delete","erase","keyboard","undo"],"isBrand":false},{"name":"backward","unicode":"f04a","searchTerms":["previous","rewind"],"isBrand":false},{"name":"bacon","unicode":"f7e5","searchTerms":["blt","breakfast","ham","lard","meat","pancetta","pork","rasher"],"isBrand":false},{"name":"bacteria","unicode":"e059","searchTerms":["antibiotic","antibody","covid-19","health","organism","sick"],"isBrand":false},{"name":"bacterium","unicode":"e05a","searchTerms":["antibiotic","antibody","covid-19","health","organism","sick"],"isBrand":false},{"name":"bahai","unicode":"f666","searchTerms":["bahai","bahá'í","star"],"isBrand":false},{"name":"balance-scale","unicode":"f24e","searchTerms":["balanced","justice","legal","measure","weight"],"isBrand":false},{"name":"balance-scale-left","unicode":"f515","searchTerms":["justice","legal","measure","unbalanced","weight"],"isBrand":false},{"name":"balance-scale-right","unicode":"f516","searchTerms":["justice","legal","measure","unbalanced","weight"],"isBrand":false},{"name":"ban","unicode":"f05e","searchTerms":["abort","ban","block","cancel","delete","hide","prohibit","remove","stop","trash"],"isBrand":false},{"name":"band-aid","unicode":"f462","searchTerms":["bandage","boo boo","first aid","ouch"],"isBrand":false},{"name":"bandcamp","unicode":"f2d5","searchTerms":[],"isBrand":true},{"name":"barcode","unicode":"f02a","searchTerms":["info","laser","price","scan","upc"],"isBrand":false},{"name":"bars","unicode":"f0c9","searchTerms":["checklist","drag","hamburger","list","menu","nav","navigation","ol","reorder","settings","todo","ul"],"isBrand":false},{"name":"baseball-ball","unicode":"f433","searchTerms":["foul","hardball","league","leather","mlb","softball","sport"],"isBrand":false},{"name":"basketball-ball","unicode":"f434","searchTerms":["dribble","dunk","hoop","nba"],"isBrand":false},{"name":"bath","unicode":"f2cd","searchTerms":["clean","shower","tub","wash"],"isBrand":false},{"name":"battery-empty","unicode":"f244","searchTerms":["charge","dead","power","status"],"isBrand":false},{"name":"battery-full","unicode":"f240","searchTerms":["charge","power","status"],"isBrand":false},{"name":"battery-half","unicode":"f242","searchTerms":["charge","power","status"],"isBrand":false},{"name":"battery-quarter","unicode":"f243","searchTerms":["charge","low","power","status"],"isBrand":false},{"name":"battery-three-quarters","unicode":"f241","searchTerms":["charge","power","status"],"isBrand":false},{"name":"battle-net","unicode":"f835","searchTerms":[],"isBrand":true},{"name":"bed","unicode":"f236","searchTerms":["lodging","mattress","rest","sleep","travel"],"isBrand":false},{"name":"beer","unicode":"f0fc","searchTerms":["alcohol","ale","bar","beverage","brewery","drink","lager","liquor","mug","stein"],"isBrand":false},{"name":"behance","unicode":"f1b4","searchTerms":[],"isBrand":true},{"name":"behance-square","unicode":"f1b5","searchTerms":[],"isBrand":true},{"name":"bell","unicode":"f0f3","searchTerms":["alarm","alert","chime","notification","reminder"],"isBrand":false},{"name":"bell-slash","unicode":"f1f6","searchTerms":["alert","cancel","disabled","notification","off","reminder"],"isBrand":false},{"name":"bezier-curve","unicode":"f55b","searchTerms":["curves","illustrator","lines","path","vector"],"isBrand":false},{"name":"bible","unicode":"f647","searchTerms":["book","catholicism","christianity","god","holy"],"isBrand":false},{"name":"bicycle","unicode":"f206","searchTerms":["bike","gears","pedal","transportation","vehicle"],"isBrand":false},{"name":"biking","unicode":"f84a","searchTerms":["bicycle","bike","cycle","cycling","ride","wheel"],"isBrand":false},{"name":"bimobject","unicode":"f378","searchTerms":[],"isBrand":true},{"name":"binoculars","unicode":"f1e5","searchTerms":["glasses","magnify","scenic","spyglass","view"],"isBrand":false},{"name":"biohazard","unicode":"f780","searchTerms":["covid-19","danger","dangerous","hazmat","medical","radioactive","toxic","waste","zombie"],"isBrand":false},{"name":"birthday-cake","unicode":"f1fd","searchTerms":["anniversary","bakery","candles","celebration","dessert","frosting","holiday","party","pastry"],"isBrand":false},{"name":"bitbucket","unicode":"f171","searchTerms":["atlassian","bitbucket-square","git"],"isBrand":true},{"name":"bitcoin","unicode":"f379","searchTerms":[],"isBrand":true},{"name":"bity","unicode":"f37a","searchTerms":[],"isBrand":true},{"name":"black-tie","unicode":"f27e","searchTerms":[],"isBrand":true},{"name":"blackberry","unicode":"f37b","searchTerms":[],"isBrand":true},{"name":"blender","unicode":"f517","searchTerms":["cocktail","milkshake","mixer","puree","smoothie"],"isBrand":false},{"name":"blender-phone","unicode":"f6b6","searchTerms":["appliance","cocktail","communication","fantasy","milkshake","mixer","puree","silly","smoothie"],"isBrand":false},{"name":"blind","unicode":"f29d","searchTerms":["cane","disability","person","sight"],"isBrand":false},{"name":"blog","unicode":"f781","searchTerms":["journal","log","online","personal","post","web 2.0","wordpress","writing"],"isBrand":false},{"name":"blogger","unicode":"f37c","searchTerms":[],"isBrand":true},{"name":"blogger-b","unicode":"f37d","searchTerms":[],"isBrand":true},{"name":"bluetooth","unicode":"f293","searchTerms":[],"isBrand":true},{"name":"bluetooth-b","unicode":"f294","searchTerms":[],"isBrand":true},{"name":"bold","unicode":"f032","searchTerms":["emphasis","format","text"],"isBrand":false},{"name":"bolt","unicode":"f0e7","searchTerms":["electricity","lightning","weather","zap"],"isBrand":false},{"name":"bomb","unicode":"f1e2","searchTerms":["error","explode","fuse","grenade","warning"],"isBrand":false},{"name":"bone","unicode":"f5d7","searchTerms":["calcium","dog","skeletal","skeleton","tibia"],"isBrand":false},{"name":"bong","unicode":"f55c","searchTerms":["aparatus","cannabis","marijuana","pipe","smoke","smoking"],"isBrand":false},{"name":"book","unicode":"f02d","searchTerms":["diary","documentation","journal","library","read"],"isBrand":false},{"name":"book-dead","unicode":"f6b7","searchTerms":["Dungeons & Dragons","crossbones","d&d","dark arts","death","dnd","documentation","evil","fantasy","halloween","holiday","necronomicon","read","skull","spell"],"isBrand":false},{"name":"book-medical","unicode":"f7e6","searchTerms":["diary","documentation","health","history","journal","library","read","record"],"isBrand":false},{"name":"book-open","unicode":"f518","searchTerms":["flyer","library","notebook","open book","pamphlet","reading"],"isBrand":false},{"name":"book-reader","unicode":"f5da","searchTerms":["flyer","library","notebook","open book","pamphlet","reading"],"isBrand":false},{"name":"bookmark","unicode":"f02e","searchTerms":["favorite","marker","read","remember","save"],"isBrand":false},{"name":"bootstrap","unicode":"f836","searchTerms":[],"isBrand":true},{"name":"border-all","unicode":"f84c","searchTerms":["cell","grid","outline","stroke","table"],"isBrand":false},{"name":"border-none","unicode":"f850","searchTerms":["cell","grid","outline","stroke","table"],"isBrand":false},{"name":"border-style","unicode":"f853","searchTerms":[],"isBrand":false},{"name":"bowling-ball","unicode":"f436","searchTerms":["alley","candlepin","gutter","lane","strike","tenpin"],"isBrand":false},{"name":"box","unicode":"f466","searchTerms":["archive","container","package","storage"],"isBrand":false},{"name":"box-open","unicode":"f49e","searchTerms":["archive","container","package","storage","unpack"],"isBrand":false},{"name":"box-tissue","unicode":"e05b","searchTerms":["cough","covid-19","kleenex","mucus","nose","sneeze","snot"],"isBrand":false},{"name":"boxes","unicode":"f468","searchTerms":["archives","inventory","storage","warehouse"],"isBrand":false},{"name":"braille","unicode":"f2a1","searchTerms":["alphabet","blind","dots","raised","vision"],"isBrand":false},{"name":"brain","unicode":"f5dc","searchTerms":["cerebellum","gray matter","intellect","medulla oblongata","mind","noodle","wit"],"isBrand":false},{"name":"bread-slice","unicode":"f7ec","searchTerms":["bake","bakery","baking","dough","flour","gluten","grain","sandwich","sourdough","toast","wheat","yeast"],"isBrand":false},{"name":"briefcase","unicode":"f0b1","searchTerms":["bag","business","luggage","office","work"],"isBrand":false},{"name":"briefcase-medical","unicode":"f469","searchTerms":["doctor","emt","first aid","health"],"isBrand":false},{"name":"broadcast-tower","unicode":"f519","searchTerms":["airwaves","antenna","radio","reception","waves"],"isBrand":false},{"name":"broom","unicode":"f51a","searchTerms":["clean","firebolt","fly","halloween","nimbus 2000","quidditch","sweep","witch"],"isBrand":false},{"name":"brush","unicode":"f55d","searchTerms":["art","bristles","color","handle","paint"],"isBrand":false},{"name":"btc","unicode":"f15a","searchTerms":[],"isBrand":true},{"name":"buffer","unicode":"f837","searchTerms":[],"isBrand":true},{"name":"bug","unicode":"f188","searchTerms":["beetle","error","insect","report"],"isBrand":false},{"name":"building","unicode":"f1ad","searchTerms":["apartment","business","city","company","office","work"],"isBrand":false},{"name":"bullhorn","unicode":"f0a1","searchTerms":["announcement","broadcast","louder","megaphone","share"],"isBrand":false},{"name":"bullseye","unicode":"f140","searchTerms":["archery","goal","objective","target"],"isBrand":false},{"name":"burn","unicode":"f46a","searchTerms":["caliente","energy","fire","flame","gas","heat","hot"],"isBrand":false},{"name":"buromobelexperte","unicode":"f37f","searchTerms":[],"isBrand":true},{"name":"bus","unicode":"f207","searchTerms":["public transportation","transportation","travel","vehicle"],"isBrand":false},{"name":"bus-alt","unicode":"f55e","searchTerms":["mta","public transportation","transportation","travel","vehicle"],"isBrand":false},{"name":"business-time","unicode":"f64a","searchTerms":["alarm","briefcase","business socks","clock","flight of the conchords","reminder","wednesday"],"isBrand":false},{"name":"buy-n-large","unicode":"f8a6","searchTerms":[],"isBrand":true},{"name":"buysellads","unicode":"f20d","searchTerms":[],"isBrand":true},{"name":"calculator","unicode":"f1ec","searchTerms":["abacus","addition","arithmetic","counting","math","multiplication","subtraction"],"isBrand":false},{"name":"calendar","unicode":"f133","searchTerms":["calendar-o","date","event","schedule","time","when"],"isBrand":false},{"name":"calendar-alt","unicode":"f073","searchTerms":["calendar","date","event","schedule","time","when"],"isBrand":false},{"name":"calendar-check","unicode":"f274","searchTerms":["accept","agree","appointment","confirm","correct","date","done","event","ok","schedule","select","success","tick","time","todo","when"],"isBrand":false},{"name":"calendar-day","unicode":"f783","searchTerms":["date","detail","event","focus","schedule","single day","time","today","when"],"isBrand":false},{"name":"calendar-minus","unicode":"f272","searchTerms":["calendar","date","delete","event","negative","remove","schedule","time","when"],"isBrand":false},{"name":"calendar-plus","unicode":"f271","searchTerms":["add","calendar","create","date","event","new","positive","schedule","time","when"],"isBrand":false},{"name":"calendar-times","unicode":"f273","searchTerms":["archive","calendar","date","delete","event","remove","schedule","time","when","x"],"isBrand":false},{"name":"calendar-week","unicode":"f784","searchTerms":["date","detail","event","focus","schedule","single week","time","today","when"],"isBrand":false},{"name":"camera","unicode":"f030","searchTerms":["image","lens","photo","picture","record","shutter","video"],"isBrand":false},{"name":"camera-retro","unicode":"f083","searchTerms":["image","lens","photo","picture","record","shutter","video"],"isBrand":false},{"name":"campground","unicode":"f6bb","searchTerms":["camping","fall","outdoors","teepee","tent","tipi"],"isBrand":false},{"name":"canadian-maple-leaf","unicode":"f785","searchTerms":["canada","flag","flora","nature","plant"],"isBrand":true},{"name":"candy-cane","unicode":"f786","searchTerms":["candy","christmas","holiday","mint","peppermint","striped","xmas"],"isBrand":false},{"name":"cannabis","unicode":"f55f","searchTerms":["bud","chronic","drugs","endica","endo","ganja","marijuana","mary jane","pot","reefer","sativa","spliff","weed","whacky-tabacky"],"isBrand":false},{"name":"capsules","unicode":"f46b","searchTerms":["drugs","medicine","pills","prescription"],"isBrand":false},{"name":"car","unicode":"f1b9","searchTerms":["auto","automobile","sedan","transportation","travel","vehicle"],"isBrand":false},{"name":"car-alt","unicode":"f5de","searchTerms":["auto","automobile","sedan","transportation","travel","vehicle"],"isBrand":false},{"name":"car-battery","unicode":"f5df","searchTerms":["auto","electric","mechanic","power"],"isBrand":false},{"name":"car-crash","unicode":"f5e1","searchTerms":["accident","auto","automobile","insurance","sedan","transportation","vehicle","wreck"],"isBrand":false},{"name":"car-side","unicode":"f5e4","searchTerms":["auto","automobile","sedan","transportation","travel","vehicle"],"isBrand":false},{"name":"caravan","unicode":"f8ff","searchTerms":["camper","motor home","rv","trailer","travel"],"isBrand":false},{"name":"caret-down","unicode":"f0d7","searchTerms":["arrow","dropdown","expand","menu","more","triangle"],"isBrand":false},{"name":"caret-left","unicode":"f0d9","searchTerms":["arrow","back","previous","triangle"],"isBrand":false},{"name":"caret-right","unicode":"f0da","searchTerms":["arrow","forward","next","triangle"],"isBrand":false},{"name":"caret-square-down","unicode":"f150","searchTerms":["arrow","caret-square-o-down","dropdown","expand","menu","more","triangle"],"isBrand":false},{"name":"caret-square-left","unicode":"f191","searchTerms":["arrow","back","caret-square-o-left","previous","triangle"],"isBrand":false},{"name":"caret-square-right","unicode":"f152","searchTerms":["arrow","caret-square-o-right","forward","next","triangle"],"isBrand":false},{"name":"caret-square-up","unicode":"f151","searchTerms":["arrow","caret-square-o-up","collapse","triangle","upload"],"isBrand":false},{"name":"caret-up","unicode":"f0d8","searchTerms":["arrow","collapse","triangle"],"isBrand":false},{"name":"carrot","unicode":"f787","searchTerms":["bugs bunny","orange","vegan","vegetable"],"isBrand":false},{"name":"cart-arrow-down","unicode":"f218","searchTerms":["download","save","shopping"],"isBrand":false},{"name":"cart-plus","unicode":"f217","searchTerms":["add","create","new","positive","shopping"],"isBrand":false},{"name":"cash-register","unicode":"f788","searchTerms":["buy","cha-ching","change","checkout","commerce","leaerboard","machine","pay","payment","purchase","store"],"isBrand":false},{"name":"cat","unicode":"f6be","searchTerms":["feline","halloween","holiday","kitten","kitty","meow","pet"],"isBrand":false},{"name":"cc-amazon-pay","unicode":"f42d","searchTerms":[],"isBrand":true},{"name":"cc-amex","unicode":"f1f3","searchTerms":["amex"],"isBrand":true},{"name":"cc-apple-pay","unicode":"f416","searchTerms":[],"isBrand":true},{"name":"cc-diners-club","unicode":"f24c","searchTerms":[],"isBrand":true},{"name":"cc-discover","unicode":"f1f2","searchTerms":[],"isBrand":true},{"name":"cc-jcb","unicode":"f24b","searchTerms":[],"isBrand":true},{"name":"cc-mastercard","unicode":"f1f1","searchTerms":[],"isBrand":true},{"name":"cc-paypal","unicode":"f1f4","searchTerms":[],"isBrand":true},{"name":"cc-stripe","unicode":"f1f5","searchTerms":[],"isBrand":true},{"name":"cc-visa","unicode":"f1f0","searchTerms":[],"isBrand":true},{"name":"centercode","unicode":"f380","searchTerms":[],"isBrand":true},{"name":"centos","unicode":"f789","searchTerms":["linux","operating system","os"],"isBrand":true},{"name":"certificate","unicode":"f0a3","searchTerms":["badge","star","verified"],"isBrand":false},{"name":"chair","unicode":"f6c0","searchTerms":["furniture","seat","sit"],"isBrand":false},{"name":"chalkboard","unicode":"f51b","searchTerms":["blackboard","learning","school","teaching","whiteboard","writing"],"isBrand":false},{"name":"chalkboard-teacher","unicode":"f51c","searchTerms":["blackboard","instructor","learning","professor","school","whiteboard","writing"],"isBrand":false},{"name":"charging-station","unicode":"f5e7","searchTerms":["electric","ev","tesla","vehicle"],"isBrand":false},{"name":"chart-area","unicode":"f1fe","searchTerms":["analytics","area","chart","graph"],"isBrand":false},{"name":"chart-bar","unicode":"f080","searchTerms":["analytics","bar","chart","graph"],"isBrand":false},{"name":"chart-line","unicode":"f201","searchTerms":["activity","analytics","chart","dashboard","gain","graph","increase","line"],"isBrand":false},{"name":"chart-pie","unicode":"f200","searchTerms":["analytics","chart","diagram","graph","pie"],"isBrand":false},{"name":"check","unicode":"f00c","searchTerms":["accept","agree","checkmark","confirm","correct","done","notice","notification","notify","ok","select","success","tick","todo","yes"],"isBrand":false},{"name":"check-circle","unicode":"f058","searchTerms":["accept","agree","confirm","correct","done","ok","select","success","tick","todo","yes"],"isBrand":false},{"name":"check-double","unicode":"f560","searchTerms":["accept","agree","checkmark","confirm","correct","done","notice","notification","notify","ok","select","success","tick","todo"],"isBrand":false},{"name":"check-square","unicode":"f14a","searchTerms":["accept","agree","checkmark","confirm","correct","done","ok","select","success","tick","todo","yes"],"isBrand":false},{"name":"cheese","unicode":"f7ef","searchTerms":["cheddar","curd","gouda","melt","parmesan","sandwich","swiss","wedge"],"isBrand":false},{"name":"chess","unicode":"f439","searchTerms":["board","castle","checkmate","game","king","rook","strategy","tournament"],"isBrand":false},{"name":"chess-bishop","unicode":"f43a","searchTerms":["board","checkmate","game","strategy"],"isBrand":false},{"name":"chess-board","unicode":"f43c","searchTerms":["board","checkmate","game","strategy"],"isBrand":false},{"name":"chess-king","unicode":"f43f","searchTerms":["board","checkmate","game","strategy"],"isBrand":false},{"name":"chess-knight","unicode":"f441","searchTerms":["board","checkmate","game","horse","strategy"],"isBrand":false},{"name":"chess-pawn","unicode":"f443","searchTerms":["board","checkmate","game","strategy"],"isBrand":false},{"name":"chess-queen","unicode":"f445","searchTerms":["board","checkmate","game","strategy"],"isBrand":false},{"name":"chess-rook","unicode":"f447","searchTerms":["board","castle","checkmate","game","strategy"],"isBrand":false},{"name":"chevron-circle-down","unicode":"f13a","searchTerms":["arrow","download","dropdown","menu","more"],"isBrand":false},{"name":"chevron-circle-left","unicode":"f137","searchTerms":["arrow","back","previous"],"isBrand":false},{"name":"chevron-circle-right","unicode":"f138","searchTerms":["arrow","forward","next"],"isBrand":false},{"name":"chevron-circle-up","unicode":"f139","searchTerms":["arrow","collapse","upload"],"isBrand":false},{"name":"chevron-down","unicode":"f078","searchTerms":["arrow","download","expand"],"isBrand":false},{"name":"chevron-left","unicode":"f053","searchTerms":["arrow","back","bracket","previous"],"isBrand":false},{"name":"chevron-right","unicode":"f054","searchTerms":["arrow","bracket","forward","next"],"isBrand":false},{"name":"chevron-up","unicode":"f077","searchTerms":["arrow","collapse","upload"],"isBrand":false},{"name":"child","unicode":"f1ae","searchTerms":["boy","girl","kid","toddler","young"],"isBrand":false},{"name":"chrome","unicode":"f268","searchTerms":["browser"],"isBrand":true},{"name":"chromecast","unicode":"f838","searchTerms":[],"isBrand":true},{"name":"church","unicode":"f51d","searchTerms":["building","cathedral","chapel","community","religion"],"isBrand":false},{"name":"circle","unicode":"f111","searchTerms":["circle-thin","diameter","dot","ellipse","notification","round"],"isBrand":false},{"name":"circle-notch","unicode":"f1ce","searchTerms":["circle-o-notch","diameter","dot","ellipse","round","spinner"],"isBrand":false},{"name":"city","unicode":"f64f","searchTerms":["buildings","busy","skyscrapers","urban","windows"],"isBrand":false},{"name":"clinic-medical","unicode":"f7f2","searchTerms":["covid-19","doctor","general practitioner","hospital","infirmary","medicine","office","outpatient"],"isBrand":false},{"name":"clipboard","unicode":"f328","searchTerms":["copy","notes","paste","record"],"isBrand":false},{"name":"clipboard-check","unicode":"f46c","searchTerms":["accept","agree","confirm","done","ok","select","success","tick","todo","yes"],"isBrand":false},{"name":"clipboard-list","unicode":"f46d","searchTerms":["checklist","completed","done","finished","intinerary","ol","schedule","tick","todo","ul"],"isBrand":false},{"name":"clock","unicode":"f017","searchTerms":["date","late","schedule","time","timer","timestamp","watch"],"isBrand":false},{"name":"clone","unicode":"f24d","searchTerms":["arrange","copy","duplicate","paste"],"isBrand":false},{"name":"closed-captioning","unicode":"f20a","searchTerms":["cc","deaf","hearing","subtitle","subtitling","text","video"],"isBrand":false},{"name":"cloud","unicode":"f0c2","searchTerms":["atmosphere","fog","overcast","save","upload","weather"],"isBrand":false},{"name":"cloud-download-alt","unicode":"f381","searchTerms":["download","export","save"],"isBrand":false},{"name":"cloud-meatball","unicode":"f73b","searchTerms":["FLDSMDFR","food","spaghetti","storm"],"isBrand":false},{"name":"cloud-moon","unicode":"f6c3","searchTerms":["crescent","evening","lunar","night","partly cloudy","sky"],"isBrand":false},{"name":"cloud-moon-rain","unicode":"f73c","searchTerms":["crescent","evening","lunar","night","partly cloudy","precipitation","rain","sky","storm"],"isBrand":false},{"name":"cloud-rain","unicode":"f73d","searchTerms":["precipitation","rain","sky","storm"],"isBrand":false},{"name":"cloud-showers-heavy","unicode":"f740","searchTerms":["precipitation","rain","sky","storm"],"isBrand":false},{"name":"cloud-sun","unicode":"f6c4","searchTerms":["clear","day","daytime","fall","outdoors","overcast","partly cloudy"],"isBrand":false},{"name":"cloud-sun-rain","unicode":"f743","searchTerms":["day","overcast","precipitation","storm","summer","sunshower"],"isBrand":false},{"name":"cloud-upload-alt","unicode":"f382","searchTerms":["cloud-upload","import","save","upload"],"isBrand":false},{"name":"cloudflare","unicode":"e07d","searchTerms":[],"isBrand":true},{"name":"cloudscale","unicode":"f383","searchTerms":[],"isBrand":true},{"name":"cloudsmith","unicode":"f384","searchTerms":[],"isBrand":true},{"name":"cloudversify","unicode":"f385","searchTerms":[],"isBrand":true},{"name":"cocktail","unicode":"f561","searchTerms":["alcohol","beverage","drink","gin","glass","margarita","martini","vodka"],"isBrand":false},{"name":"code","unicode":"f121","searchTerms":["brackets","code","development","html"],"isBrand":false},{"name":"code-branch","unicode":"f126","searchTerms":["branch","code-fork","fork","git","github","rebase","svn","vcs","version"],"isBrand":false},{"name":"codepen","unicode":"f1cb","searchTerms":[],"isBrand":true},{"name":"codiepie","unicode":"f284","searchTerms":[],"isBrand":true},{"name":"coffee","unicode":"f0f4","searchTerms":["beverage","breakfast","cafe","drink","fall","morning","mug","seasonal","tea"],"isBrand":false},{"name":"cog","unicode":"f013","searchTerms":["gear","mechanical","settings","sprocket","wheel"],"isBrand":false},{"name":"cogs","unicode":"f085","searchTerms":["gears","mechanical","settings","sprocket","wheel"],"isBrand":false},{"name":"coins","unicode":"f51e","searchTerms":["currency","dime","financial","gold","money","penny"],"isBrand":false},{"name":"columns","unicode":"f0db","searchTerms":["browser","dashboard","organize","panes","split"],"isBrand":false},{"name":"comment","unicode":"f075","searchTerms":["bubble","chat","commenting","conversation","feedback","message","note","notification","sms","speech","texting"],"isBrand":false},{"name":"comment-alt","unicode":"f27a","searchTerms":["bubble","chat","commenting","conversation","feedback","message","note","notification","sms","speech","texting"],"isBrand":false},{"name":"comment-dollar","unicode":"f651","searchTerms":["bubble","chat","commenting","conversation","feedback","message","money","note","notification","pay","sms","speech","spend","texting","transfer"],"isBrand":false},{"name":"comment-dots","unicode":"f4ad","searchTerms":["bubble","chat","commenting","conversation","feedback","message","more","note","notification","reply","sms","speech","texting"],"isBrand":false},{"name":"comment-medical","unicode":"f7f5","searchTerms":["advice","bubble","chat","commenting","conversation","diagnose","feedback","message","note","notification","prescription","sms","speech","texting"],"isBrand":false},{"name":"comment-slash","unicode":"f4b3","searchTerms":["bubble","cancel","chat","commenting","conversation","feedback","message","mute","note","notification","quiet","sms","speech","texting"],"isBrand":false},{"name":"comments","unicode":"f086","searchTerms":["bubble","chat","commenting","conversation","feedback","message","note","notification","sms","speech","texting"],"isBrand":false},{"name":"comments-dollar","unicode":"f653","searchTerms":["bubble","chat","commenting","conversation","feedback","message","money","note","notification","pay","sms","speech","spend","texting","transfer"],"isBrand":false},{"name":"compact-disc","unicode":"f51f","searchTerms":["album","bluray","cd","disc","dvd","media","movie","music","record","video","vinyl"],"isBrand":false},{"name":"compass","unicode":"f14e","searchTerms":["directions","directory","location","menu","navigation","safari","travel"],"isBrand":false},{"name":"compress","unicode":"f066","searchTerms":["collapse","fullscreen","minimize","move","resize","shrink","smaller"],"isBrand":false},{"name":"compress-alt","unicode":"f422","searchTerms":["collapse","fullscreen","minimize","move","resize","shrink","smaller"],"isBrand":false},{"name":"compress-arrows-alt","unicode":"f78c","searchTerms":["collapse","fullscreen","minimize","move","resize","shrink","smaller"],"isBrand":false},{"name":"concierge-bell","unicode":"f562","searchTerms":["attention","hotel","receptionist","service","support"],"isBrand":false},{"name":"confluence","unicode":"f78d","searchTerms":["atlassian"],"isBrand":true},{"name":"connectdevelop","unicode":"f20e","searchTerms":[],"isBrand":true},{"name":"contao","unicode":"f26d","searchTerms":[],"isBrand":true},{"name":"cookie","unicode":"f563","searchTerms":["baked good","chips","chocolate","eat","snack","sweet","treat"],"isBrand":false},{"name":"cookie-bite","unicode":"f564","searchTerms":["baked good","bitten","chips","chocolate","eat","snack","sweet","treat"],"isBrand":false},{"name":"copy","unicode":"f0c5","searchTerms":["clone","duplicate","file","files-o","paper","paste"],"isBrand":false},{"name":"copyright","unicode":"f1f9","searchTerms":["brand","mark","register","trademark"],"isBrand":false},{"name":"cotton-bureau","unicode":"f89e","searchTerms":["clothing","t-shirts","tshirts"],"isBrand":true},{"name":"couch","unicode":"f4b8","searchTerms":["chair","cushion","furniture","relax","sofa"],"isBrand":false},{"name":"cpanel","unicode":"f388","searchTerms":[],"isBrand":true},{"name":"creative-commons","unicode":"f25e","searchTerms":[],"isBrand":true},{"name":"creative-commons-by","unicode":"f4e7","searchTerms":[],"isBrand":true},{"name":"creative-commons-nc","unicode":"f4e8","searchTerms":[],"isBrand":true},{"name":"creative-commons-nc-eu","unicode":"f4e9","searchTerms":[],"isBrand":true},{"name":"creative-commons-nc-jp","unicode":"f4ea","searchTerms":[],"isBrand":true},{"name":"creative-commons-nd","unicode":"f4eb","searchTerms":[],"isBrand":true},{"name":"creative-commons-pd","unicode":"f4ec","searchTerms":[],"isBrand":true},{"name":"creative-commons-pd-alt","unicode":"f4ed","searchTerms":[],"isBrand":true},{"name":"creative-commons-remix","unicode":"f4ee","searchTerms":[],"isBrand":true},{"name":"creative-commons-sa","unicode":"f4ef","searchTerms":[],"isBrand":true},{"name":"creative-commons-sampling","unicode":"f4f0","searchTerms":[],"isBrand":true},{"name":"creative-commons-sampling-plus","unicode":"f4f1","searchTerms":[],"isBrand":true},{"name":"creative-commons-share","unicode":"f4f2","searchTerms":[],"isBrand":true},{"name":"creative-commons-zero","unicode":"f4f3","searchTerms":[],"isBrand":true},{"name":"credit-card","unicode":"f09d","searchTerms":["buy","checkout","credit-card-alt","debit","money","payment","purchase"],"isBrand":false},{"name":"critical-role","unicode":"f6c9","searchTerms":["Dungeons & Dragons","d&d","dnd","fantasy","game","gaming","tabletop"],"isBrand":true},{"name":"crop","unicode":"f125","searchTerms":["design","frame","mask","resize","shrink"],"isBrand":false},{"name":"crop-alt","unicode":"f565","searchTerms":["design","frame","mask","resize","shrink"],"isBrand":false},{"name":"cross","unicode":"f654","searchTerms":["catholicism","christianity","church","jesus"],"isBrand":false},{"name":"crosshairs","unicode":"f05b","searchTerms":["aim","bullseye","gpd","picker","position"],"isBrand":false},{"name":"crow","unicode":"f520","searchTerms":["bird","bullfrog","fauna","halloween","holiday","toad"],"isBrand":false},{"name":"crown","unicode":"f521","searchTerms":["award","favorite","king","queen","royal","tiara"],"isBrand":false},{"name":"crutch","unicode":"f7f7","searchTerms":["cane","injury","mobility","wheelchair"],"isBrand":false},{"name":"css3","unicode":"f13c","searchTerms":["code"],"isBrand":true},{"name":"css3-alt","unicode":"f38b","searchTerms":[],"isBrand":true},{"name":"cube","unicode":"f1b2","searchTerms":["3d","block","dice","package","square","tesseract"],"isBrand":false},{"name":"cubes","unicode":"f1b3","searchTerms":["3d","block","dice","package","pyramid","square","stack","tesseract"],"isBrand":false},{"name":"cut","unicode":"f0c4","searchTerms":["clip","scissors","snip"],"isBrand":false},{"name":"cuttlefish","unicode":"f38c","searchTerms":[],"isBrand":true},{"name":"d-and-d","unicode":"f38d","searchTerms":[],"isBrand":true},{"name":"d-and-d-beyond","unicode":"f6ca","searchTerms":["Dungeons & Dragons","d&d","dnd","fantasy","gaming","tabletop"],"isBrand":true},{"name":"dailymotion","unicode":"e052","searchTerms":[],"isBrand":true},{"name":"dashcube","unicode":"f210","searchTerms":[],"isBrand":true},{"name":"database","unicode":"f1c0","searchTerms":["computer","development","directory","memory","storage"],"isBrand":false},{"name":"deaf","unicode":"f2a4","searchTerms":["ear","hearing","sign language"],"isBrand":false},{"name":"deezer","unicode":"e077","searchTerms":[],"isBrand":true},{"name":"delicious","unicode":"f1a5","searchTerms":[],"isBrand":true},{"name":"democrat","unicode":"f747","searchTerms":["american","democratic party","donkey","election","left","left-wing","liberal","politics","usa"],"isBrand":false},{"name":"deploydog","unicode":"f38e","searchTerms":[],"isBrand":true},{"name":"deskpro","unicode":"f38f","searchTerms":[],"isBrand":true},{"name":"desktop","unicode":"f108","searchTerms":["computer","cpu","demo","desktop","device","imac","machine","monitor","pc","screen"],"isBrand":false},{"name":"dev","unicode":"f6cc","searchTerms":[],"isBrand":true},{"name":"deviantart","unicode":"f1bd","searchTerms":[],"isBrand":true},{"name":"dharmachakra","unicode":"f655","searchTerms":["buddhism","buddhist","wheel of dharma"],"isBrand":false},{"name":"dhl","unicode":"f790","searchTerms":["Dalsey","Hillblom and Lynn","german","package","shipping"],"isBrand":true},{"name":"diagnoses","unicode":"f470","searchTerms":["analyze","detect","diagnosis","examine","medicine"],"isBrand":false},{"name":"diaspora","unicode":"f791","searchTerms":[],"isBrand":true},{"name":"dice","unicode":"f522","searchTerms":["chance","gambling","game","roll"],"isBrand":false},{"name":"dice-d20","unicode":"f6cf","searchTerms":["Dungeons & Dragons","chance","d&d","dnd","fantasy","gambling","game","roll"],"isBrand":false},{"name":"dice-d6","unicode":"f6d1","searchTerms":["Dungeons & Dragons","chance","d&d","dnd","fantasy","gambling","game","roll"],"isBrand":false},{"name":"dice-five","unicode":"f523","searchTerms":["chance","gambling","game","roll"],"isBrand":false},{"name":"dice-four","unicode":"f524","searchTerms":["chance","gambling","game","roll"],"isBrand":false},{"name":"dice-one","unicode":"f525","searchTerms":["chance","gambling","game","roll"],"isBrand":false},{"name":"dice-six","unicode":"f526","searchTerms":["chance","gambling","game","roll"],"isBrand":false},{"name":"dice-three","unicode":"f527","searchTerms":["chance","gambling","game","roll"],"isBrand":false},{"name":"dice-two","unicode":"f528","searchTerms":["chance","gambling","game","roll"],"isBrand":false},{"name":"digg","unicode":"f1a6","searchTerms":[],"isBrand":true},{"name":"digital-ocean","unicode":"f391","searchTerms":[],"isBrand":true},{"name":"digital-tachograph","unicode":"f566","searchTerms":["data","distance","speed","tachometer"],"isBrand":false},{"name":"directions","unicode":"f5eb","searchTerms":["map","navigation","sign","turn"],"isBrand":false},{"name":"discord","unicode":"f392","searchTerms":[],"isBrand":true},{"name":"discourse","unicode":"f393","searchTerms":[],"isBrand":true},{"name":"disease","unicode":"f7fa","searchTerms":["bacteria","cancer","covid-19","illness","infection","sickness","virus"],"isBrand":false},{"name":"divide","unicode":"f529","searchTerms":["arithmetic","calculus","division","math"],"isBrand":false},{"name":"dizzy","unicode":"f567","searchTerms":["dazed","dead","disapprove","emoticon","face"],"isBrand":false},{"name":"dna","unicode":"f471","searchTerms":["double helix","genetic","helix","molecule","protein"],"isBrand":false},{"name":"dochub","unicode":"f394","searchTerms":[],"isBrand":true},{"name":"docker","unicode":"f395","searchTerms":[],"isBrand":true},{"name":"dog","unicode":"f6d3","searchTerms":["animal","canine","fauna","mammal","pet","pooch","puppy","woof"],"isBrand":false},{"name":"dollar-sign","unicode":"f155","searchTerms":["$","cost","dollar-sign","money","price","usd"],"isBrand":false},{"name":"dolly","unicode":"f472","searchTerms":["carry","shipping","transport"],"isBrand":false},{"name":"dolly-flatbed","unicode":"f474","searchTerms":["carry","inventory","shipping","transport"],"isBrand":false},{"name":"donate","unicode":"f4b9","searchTerms":["contribute","generosity","gift","give"],"isBrand":false},{"name":"door-closed","unicode":"f52a","searchTerms":["enter","exit","locked"],"isBrand":false},{"name":"door-open","unicode":"f52b","searchTerms":["enter","exit","welcome"],"isBrand":false},{"name":"dot-circle","unicode":"f192","searchTerms":["bullseye","notification","target"],"isBrand":false},{"name":"dove","unicode":"f4ba","searchTerms":["bird","fauna","flying","peace","war"],"isBrand":false},{"name":"download","unicode":"f019","searchTerms":["export","hard drive","save","transfer"],"isBrand":false},{"name":"draft2digital","unicode":"f396","searchTerms":[],"isBrand":true},{"name":"drafting-compass","unicode":"f568","searchTerms":["design","map","mechanical drawing","plot","plotting"],"isBrand":false},{"name":"dragon","unicode":"f6d5","searchTerms":["Dungeons & Dragons","d&d","dnd","fantasy","fire","lizard","serpent"],"isBrand":false},{"name":"draw-polygon","unicode":"f5ee","searchTerms":["anchors","lines","object","render","shape"],"isBrand":false},{"name":"dribbble","unicode":"f17d","searchTerms":[],"isBrand":true},{"name":"dribbble-square","unicode":"f397","searchTerms":[],"isBrand":true},{"name":"dropbox","unicode":"f16b","searchTerms":[],"isBrand":true},{"name":"drum","unicode":"f569","searchTerms":["instrument","music","percussion","snare","sound"],"isBrand":false},{"name":"drum-steelpan","unicode":"f56a","searchTerms":["calypso","instrument","music","percussion","reggae","snare","sound","steel","tropical"],"isBrand":false},{"name":"drumstick-bite","unicode":"f6d7","searchTerms":["bone","chicken","leg","meat","poultry","turkey"],"isBrand":false},{"name":"drupal","unicode":"f1a9","searchTerms":[],"isBrand":true},{"name":"dumbbell","unicode":"f44b","searchTerms":["exercise","gym","strength","weight","weight-lifting"],"isBrand":false},{"name":"dumpster","unicode":"f793","searchTerms":["alley","bin","commercial","trash","waste"],"isBrand":false},{"name":"dumpster-fire","unicode":"f794","searchTerms":["alley","bin","commercial","danger","dangerous","euphemism","flame","heat","hot","trash","waste"],"isBrand":false},{"name":"dungeon","unicode":"f6d9","searchTerms":["Dungeons & Dragons","building","d&d","dnd","door","entrance","fantasy","gate"],"isBrand":false},{"name":"dyalog","unicode":"f399","searchTerms":[],"isBrand":true},{"name":"earlybirds","unicode":"f39a","searchTerms":[],"isBrand":true},{"name":"ebay","unicode":"f4f4","searchTerms":[],"isBrand":true},{"name":"edge","unicode":"f282","searchTerms":["browser","ie"],"isBrand":true},{"name":"edge-legacy","unicode":"e078","searchTerms":[],"isBrand":true},{"name":"edit","unicode":"f044","searchTerms":["edit","pen","pencil","update","write"],"isBrand":false},{"name":"egg","unicode":"f7fb","searchTerms":["breakfast","chicken","easter","shell","yolk"],"isBrand":false},{"name":"eject","unicode":"f052","searchTerms":["abort","cancel","cd","discharge"],"isBrand":false},{"name":"elementor","unicode":"f430","searchTerms":[],"isBrand":true},{"name":"ellipsis-h","unicode":"f141","searchTerms":["dots","drag","kebab","list","menu","nav","navigation","ol","reorder","settings","ul"],"isBrand":false},{"name":"ellipsis-v","unicode":"f142","searchTerms":["dots","drag","kebab","list","menu","nav","navigation","ol","reorder","settings","ul"],"isBrand":false},{"name":"ello","unicode":"f5f1","searchTerms":[],"isBrand":true},{"name":"ember","unicode":"f423","searchTerms":[],"isBrand":true},{"name":"empire","unicode":"f1d1","searchTerms":[],"isBrand":true},{"name":"envelope","unicode":"f0e0","searchTerms":["e-mail","email","letter","mail","message","notification","support"],"isBrand":false},{"name":"envelope-open","unicode":"f2b6","searchTerms":["e-mail","email","letter","mail","message","notification","support"],"isBrand":false},{"name":"envelope-open-text","unicode":"f658","searchTerms":["e-mail","email","letter","mail","message","notification","support"],"isBrand":false},{"name":"envelope-square","unicode":"f199","searchTerms":["e-mail","email","letter","mail","message","notification","support"],"isBrand":false},{"name":"envira","unicode":"f299","searchTerms":["leaf"],"isBrand":true},{"name":"equals","unicode":"f52c","searchTerms":["arithmetic","even","match","math"],"isBrand":false},{"name":"eraser","unicode":"f12d","searchTerms":["art","delete","remove","rubber"],"isBrand":false},{"name":"erlang","unicode":"f39d","searchTerms":[],"isBrand":true},{"name":"ethereum","unicode":"f42e","searchTerms":[],"isBrand":true},{"name":"ethernet","unicode":"f796","searchTerms":["cable","cat 5","cat 6","connection","hardware","internet","network","wired"],"isBrand":false},{"name":"etsy","unicode":"f2d7","searchTerms":[],"isBrand":true},{"name":"euro-sign","unicode":"f153","searchTerms":["currency","dollar","exchange","money"],"isBrand":false},{"name":"evernote","unicode":"f839","searchTerms":[],"isBrand":true},{"name":"exchange-alt","unicode":"f362","searchTerms":["arrow","arrows","exchange","reciprocate","return","swap","transfer"],"isBrand":false},{"name":"exclamation","unicode":"f12a","searchTerms":["alert","danger","error","important","notice","notification","notify","problem","warning"],"isBrand":false},{"name":"exclamation-circle","unicode":"f06a","searchTerms":["alert","danger","error","important","notice","notification","notify","problem","warning"],"isBrand":false},{"name":"exclamation-triangle","unicode":"f071","searchTerms":["alert","danger","error","important","notice","notification","notify","problem","warning"],"isBrand":false},{"name":"expand","unicode":"f065","searchTerms":["bigger","enlarge","fullscreen","resize"],"isBrand":false},{"name":"expand-alt","unicode":"f424","searchTerms":["arrows","bigger","enlarge","fullscreen","resize"],"isBrand":false},{"name":"expand-arrows-alt","unicode":"f31e","searchTerms":["bigger","enlarge","fullscreen","move","resize"],"isBrand":false},{"name":"expeditedssl","unicode":"f23e","searchTerms":[],"isBrand":true},{"name":"external-link-alt","unicode":"f35d","searchTerms":["external-link","new","open","share"],"isBrand":false},{"name":"external-link-square-alt","unicode":"f360","searchTerms":["external-link-square","new","open","share"],"isBrand":false},{"name":"eye","unicode":"f06e","searchTerms":["look","optic","see","seen","show","sight","views","visible"],"isBrand":false},{"name":"eye-dropper","unicode":"f1fb","searchTerms":["beaker","clone","color","copy","eyedropper","pipette"],"isBrand":false},{"name":"eye-slash","unicode":"f070","searchTerms":["blind","hide","show","toggle","unseen","views","visible","visiblity"],"isBrand":false},{"name":"facebook","unicode":"f09a","searchTerms":["facebook-official","social network"],"isBrand":true},{"name":"facebook-f","unicode":"f39e","searchTerms":["facebook"],"isBrand":true},{"name":"facebook-messenger","unicode":"f39f","searchTerms":[],"isBrand":true},{"name":"facebook-square","unicode":"f082","searchTerms":["social network"],"isBrand":true},{"name":"fan","unicode":"f863","searchTerms":["ac","air conditioning","blade","blower","cool","hot"],"isBrand":false},{"name":"fantasy-flight-games","unicode":"f6dc","searchTerms":["Dungeons & Dragons","d&d","dnd","fantasy","game","gaming","tabletop"],"isBrand":true},{"name":"fast-backward","unicode":"f049","searchTerms":["beginning","first","previous","rewind","start"],"isBrand":false},{"name":"fast-forward","unicode":"f050","searchTerms":["end","last","next"],"isBrand":false},{"name":"faucet","unicode":"e005","searchTerms":["covid-19","drip","house","hygiene","kitchen","sink","water"],"isBrand":false},{"name":"fax","unicode":"f1ac","searchTerms":["business","communicate","copy","facsimile","send"],"isBrand":false},{"name":"feather","unicode":"f52d","searchTerms":["bird","light","plucked","quill","write"],"isBrand":false},{"name":"feather-alt","unicode":"f56b","searchTerms":["bird","light","plucked","quill","write"],"isBrand":false},{"name":"fedex","unicode":"f797","searchTerms":["Federal Express","package","shipping"],"isBrand":true},{"name":"fedora","unicode":"f798","searchTerms":["linux","operating system","os"],"isBrand":true},{"name":"female","unicode":"f182","searchTerms":["human","person","profile","user","woman"],"isBrand":false},{"name":"fighter-jet","unicode":"f0fb","searchTerms":["airplane","fast","fly","goose","maverick","plane","quick","top gun","transportation","travel"],"isBrand":false},{"name":"figma","unicode":"f799","searchTerms":["app","design","interface"],"isBrand":true},{"name":"file","unicode":"f15b","searchTerms":["document","new","page","pdf","resume"],"isBrand":false},{"name":"file-alt","unicode":"f15c","searchTerms":["document","file-text","invoice","new","page","pdf"],"isBrand":false},{"name":"file-archive","unicode":"f1c6","searchTerms":[".zip","bundle","compress","compression","download","zip"],"isBrand":false},{"name":"file-audio","unicode":"f1c7","searchTerms":["document","mp3","music","page","play","sound"],"isBrand":false},{"name":"file-code","unicode":"f1c9","searchTerms":["css","development","document","html"],"isBrand":false},{"name":"file-contract","unicode":"f56c","searchTerms":["agreement","binding","document","legal","signature"],"isBrand":false},{"name":"file-csv","unicode":"f6dd","searchTerms":["document","excel","numbers","spreadsheets","table"],"isBrand":false},{"name":"file-download","unicode":"f56d","searchTerms":["document","export","save"],"isBrand":false},{"name":"file-excel","unicode":"f1c3","searchTerms":["csv","document","numbers","spreadsheets","table"],"isBrand":false},{"name":"file-export","unicode":"f56e","searchTerms":["download","save"],"isBrand":false},{"name":"file-image","unicode":"f1c5","searchTerms":["document","image","jpg","photo","png"],"isBrand":false},{"name":"file-import","unicode":"f56f","searchTerms":["copy","document","send","upload"],"isBrand":false},{"name":"file-invoice","unicode":"f570","searchTerms":["account","bill","charge","document","payment","receipt"],"isBrand":false},{"name":"file-invoice-dollar","unicode":"f571","searchTerms":["$","account","bill","charge","document","dollar-sign","money","payment","receipt","usd"],"isBrand":false},{"name":"file-medical","unicode":"f477","searchTerms":["document","health","history","prescription","record"],"isBrand":false},{"name":"file-medical-alt","unicode":"f478","searchTerms":["document","health","history","prescription","record"],"isBrand":false},{"name":"file-pdf","unicode":"f1c1","searchTerms":["acrobat","document","preview","save"],"isBrand":false},{"name":"file-powerpoint","unicode":"f1c4","searchTerms":["display","document","keynote","presentation"],"isBrand":false},{"name":"file-prescription","unicode":"f572","searchTerms":["document","drugs","medical","medicine","rx"],"isBrand":false},{"name":"file-signature","unicode":"f573","searchTerms":["John Hancock","contract","document","name"],"isBrand":false},{"name":"file-upload","unicode":"f574","searchTerms":["document","import","page","save"],"isBrand":false},{"name":"file-video","unicode":"f1c8","searchTerms":["document","m4v","movie","mp4","play"],"isBrand":false},{"name":"file-word","unicode":"f1c2","searchTerms":["document","edit","page","text","writing"],"isBrand":false},{"name":"fill","unicode":"f575","searchTerms":["bucket","color","paint","paint bucket"],"isBrand":false},{"name":"fill-drip","unicode":"f576","searchTerms":["bucket","color","drop","paint","paint bucket","spill"],"isBrand":false},{"name":"film","unicode":"f008","searchTerms":["cinema","movie","strip","video"],"isBrand":false},{"name":"filter","unicode":"f0b0","searchTerms":["funnel","options","separate","sort"],"isBrand":false},{"name":"fingerprint","unicode":"f577","searchTerms":["human","id","identification","lock","smudge","touch","unique","unlock"],"isBrand":false},{"name":"fire","unicode":"f06d","searchTerms":["burn","caliente","flame","heat","hot","popular"],"isBrand":false},{"name":"fire-alt","unicode":"f7e4","searchTerms":["burn","caliente","flame","heat","hot","popular"],"isBrand":false},{"name":"fire-extinguisher","unicode":"f134","searchTerms":["burn","caliente","fire fighter","flame","heat","hot","rescue"],"isBrand":false},{"name":"firefox","unicode":"f269","searchTerms":["browser"],"isBrand":true},{"name":"firefox-browser","unicode":"e007","searchTerms":["browser"],"isBrand":true},{"name":"first-aid","unicode":"f479","searchTerms":["emergency","emt","health","medical","rescue"],"isBrand":false},{"name":"first-order","unicode":"f2b0","searchTerms":[],"isBrand":true},{"name":"first-order-alt","unicode":"f50a","searchTerms":[],"isBrand":true},{"name":"firstdraft","unicode":"f3a1","searchTerms":[],"isBrand":true},{"name":"fish","unicode":"f578","searchTerms":["fauna","gold","seafood","swimming"],"isBrand":false},{"name":"fist-raised","unicode":"f6de","searchTerms":["Dungeons & Dragons","d&d","dnd","fantasy","hand","ki","monk","resist","strength","unarmed combat"],"isBrand":false},{"name":"flag","unicode":"f024","searchTerms":["country","notice","notification","notify","pole","report","symbol"],"isBrand":false},{"name":"flag-checkered","unicode":"f11e","searchTerms":["notice","notification","notify","pole","racing","report","symbol"],"isBrand":false},{"name":"flag-usa","unicode":"f74d","searchTerms":["betsy ross","country","old glory","stars","stripes","symbol"],"isBrand":false},{"name":"flask","unicode":"f0c3","searchTerms":["beaker","experimental","labs","science"],"isBrand":false},{"name":"flickr","unicode":"f16e","searchTerms":[],"isBrand":true},{"name":"flipboard","unicode":"f44d","searchTerms":[],"isBrand":true},{"name":"flushed","unicode":"f579","searchTerms":["embarrassed","emoticon","face"],"isBrand":false},{"name":"fly","unicode":"f417","searchTerms":[],"isBrand":true},{"name":"folder","unicode":"f07b","searchTerms":["archive","directory","document","file"],"isBrand":false},{"name":"folder-minus","unicode":"f65d","searchTerms":["archive","delete","directory","document","file","negative","remove"],"isBrand":false},{"name":"folder-open","unicode":"f07c","searchTerms":["archive","directory","document","empty","file","new"],"isBrand":false},{"name":"folder-plus","unicode":"f65e","searchTerms":["add","archive","create","directory","document","file","new","positive"],"isBrand":false},{"name":"font","unicode":"f031","searchTerms":["alphabet","glyph","text","type","typeface"],"isBrand":false},{"name":"font-awesome","unicode":"f2b4","searchTerms":["meanpath"],"isBrand":true},{"name":"font-awesome-alt","unicode":"f35c","searchTerms":[],"isBrand":true},{"name":"font-awesome-flag","unicode":"f425","searchTerms":[],"isBrand":true},{"name":"font-awesome-logo-full","unicode":"f4e6","searchTerms":[],"isBrand":true},{"name":"fonticons","unicode":"f280","searchTerms":[],"isBrand":true},{"name":"fonticons-fi","unicode":"f3a2","searchTerms":[],"isBrand":true},{"name":"football-ball","unicode":"f44e","searchTerms":["ball","fall","nfl","pigskin","seasonal"],"isBrand":false},{"name":"fort-awesome","unicode":"f286","searchTerms":["castle"],"isBrand":true},{"name":"fort-awesome-alt","unicode":"f3a3","searchTerms":["castle"],"isBrand":true},{"name":"forumbee","unicode":"f211","searchTerms":[],"isBrand":true},{"name":"forward","unicode":"f04e","searchTerms":["forward","next","skip"],"isBrand":false},{"name":"foursquare","unicode":"f180","searchTerms":[],"isBrand":true},{"name":"free-code-camp","unicode":"f2c5","searchTerms":[],"isBrand":true},{"name":"freebsd","unicode":"f3a4","searchTerms":[],"isBrand":true},{"name":"frog","unicode":"f52e","searchTerms":["amphibian","bullfrog","fauna","hop","kermit","kiss","prince","ribbit","toad","wart"],"isBrand":false},{"name":"frown","unicode":"f119","searchTerms":["disapprove","emoticon","face","rating","sad"],"isBrand":false},{"name":"frown-open","unicode":"f57a","searchTerms":["disapprove","emoticon","face","rating","sad"],"isBrand":false},{"name":"fulcrum","unicode":"f50b","searchTerms":[],"isBrand":true},{"name":"funnel-dollar","unicode":"f662","searchTerms":["filter","money","options","separate","sort"],"isBrand":false},{"name":"futbol","unicode":"f1e3","searchTerms":["ball","football","mls","soccer"],"isBrand":false},{"name":"galactic-republic","unicode":"f50c","searchTerms":["politics","star wars"],"isBrand":true},{"name":"galactic-senate","unicode":"f50d","searchTerms":["star wars"],"isBrand":true},{"name":"gamepad","unicode":"f11b","searchTerms":["arcade","controller","d-pad","joystick","video","video game"],"isBrand":false},{"name":"gas-pump","unicode":"f52f","searchTerms":["car","fuel","gasoline","petrol"],"isBrand":false},{"name":"gavel","unicode":"f0e3","searchTerms":["hammer","judge","law","lawyer","opinion"],"isBrand":false},{"name":"gem","unicode":"f3a5","searchTerms":["diamond","jewelry","sapphire","stone","treasure"],"isBrand":false},{"name":"genderless","unicode":"f22d","searchTerms":["androgynous","asexual","sexless"],"isBrand":false},{"name":"get-pocket","unicode":"f265","searchTerms":[],"isBrand":true},{"name":"gg","unicode":"f260","searchTerms":[],"isBrand":true},{"name":"gg-circle","unicode":"f261","searchTerms":[],"isBrand":true},{"name":"ghost","unicode":"f6e2","searchTerms":["apparition","blinky","clyde","floating","halloween","holiday","inky","pinky","spirit"],"isBrand":false},{"name":"gift","unicode":"f06b","searchTerms":["christmas","generosity","giving","holiday","party","present","wrapped","xmas"],"isBrand":false},{"name":"gifts","unicode":"f79c","searchTerms":["christmas","generosity","giving","holiday","party","present","wrapped","xmas"],"isBrand":false},{"name":"git","unicode":"f1d3","searchTerms":[],"isBrand":true},{"name":"git-alt","unicode":"f841","searchTerms":[],"isBrand":true},{"name":"git-square","unicode":"f1d2","searchTerms":[],"isBrand":true},{"name":"github","unicode":"f09b","searchTerms":["octocat"],"isBrand":true},{"name":"github-alt","unicode":"f113","searchTerms":["octocat"],"isBrand":true},{"name":"github-square","unicode":"f092","searchTerms":["octocat"],"isBrand":true},{"name":"gitkraken","unicode":"f3a6","searchTerms":[],"isBrand":true},{"name":"gitlab","unicode":"f296","searchTerms":["Axosoft"],"isBrand":true},{"name":"gitter","unicode":"f426","searchTerms":[],"isBrand":true},{"name":"glass-cheers","unicode":"f79f","searchTerms":["alcohol","bar","beverage","celebration","champagne","clink","drink","holiday","new year's eve","party","toast"],"isBrand":false},{"name":"glass-martini","unicode":"f000","searchTerms":["alcohol","bar","beverage","drink","liquor"],"isBrand":false},{"name":"glass-martini-alt","unicode":"f57b","searchTerms":["alcohol","bar","beverage","drink","liquor"],"isBrand":false},{"name":"glass-whiskey","unicode":"f7a0","searchTerms":["alcohol","bar","beverage","bourbon","drink","liquor","neat","rye","scotch","whisky"],"isBrand":false},{"name":"glasses","unicode":"f530","searchTerms":["hipster","nerd","reading","sight","spectacles","vision"],"isBrand":false},{"name":"glide","unicode":"f2a5","searchTerms":[],"isBrand":true},{"name":"glide-g","unicode":"f2a6","searchTerms":[],"isBrand":true},{"name":"globe","unicode":"f0ac","searchTerms":["all","coordinates","country","earth","global","gps","language","localize","location","map","online","place","planet","translate","travel","world"],"isBrand":false},{"name":"globe-africa","unicode":"f57c","searchTerms":["all","country","earth","global","gps","language","localize","location","map","online","place","planet","translate","travel","world"],"isBrand":false},{"name":"globe-americas","unicode":"f57d","searchTerms":["all","country","earth","global","gps","language","localize","location","map","online","place","planet","translate","travel","world"],"isBrand":false},{"name":"globe-asia","unicode":"f57e","searchTerms":["all","country","earth","global","gps","language","localize","location","map","online","place","planet","translate","travel","world"],"isBrand":false},{"name":"globe-europe","unicode":"f7a2","searchTerms":["all","country","earth","global","gps","language","localize","location","map","online","place","planet","translate","travel","world"],"isBrand":false},{"name":"gofore","unicode":"f3a7","searchTerms":[],"isBrand":true},{"name":"golf-ball","unicode":"f450","searchTerms":["caddy","eagle","putt","tee"],"isBrand":false},{"name":"goodreads","unicode":"f3a8","searchTerms":[],"isBrand":true},{"name":"goodreads-g","unicode":"f3a9","searchTerms":[],"isBrand":true},{"name":"google","unicode":"f1a0","searchTerms":[],"isBrand":true},{"name":"google-drive","unicode":"f3aa","searchTerms":[],"isBrand":true},{"name":"google-pay","unicode":"e079","searchTerms":[],"isBrand":true},{"name":"google-play","unicode":"f3ab","searchTerms":[],"isBrand":true},{"name":"google-plus","unicode":"f2b3","searchTerms":["google-plus-circle","google-plus-official"],"isBrand":true},{"name":"google-plus-g","unicode":"f0d5","searchTerms":["google-plus","social network"],"isBrand":true},{"name":"google-plus-square","unicode":"f0d4","searchTerms":["social network"],"isBrand":true},{"name":"google-wallet","unicode":"f1ee","searchTerms":[],"isBrand":true},{"name":"gopuram","unicode":"f664","searchTerms":["building","entrance","hinduism","temple","tower"],"isBrand":false},{"name":"graduation-cap","unicode":"f19d","searchTerms":["ceremony","college","graduate","learning","school","student"],"isBrand":false},{"name":"gratipay","unicode":"f184","searchTerms":["favorite","heart","like","love"],"isBrand":true},{"name":"grav","unicode":"f2d6","searchTerms":[],"isBrand":true},{"name":"greater-than","unicode":"f531","searchTerms":["arithmetic","compare","math"],"isBrand":false},{"name":"greater-than-equal","unicode":"f532","searchTerms":["arithmetic","compare","math"],"isBrand":false},{"name":"grimace","unicode":"f57f","searchTerms":["cringe","emoticon","face","teeth"],"isBrand":false},{"name":"grin","unicode":"f580","searchTerms":["emoticon","face","laugh","smile"],"isBrand":false},{"name":"grin-alt","unicode":"f581","searchTerms":["emoticon","face","laugh","smile"],"isBrand":false},{"name":"grin-beam","unicode":"f582","searchTerms":["emoticon","face","laugh","smile"],"isBrand":false},{"name":"grin-beam-sweat","unicode":"f583","searchTerms":["embarass","emoticon","face","smile"],"isBrand":false},{"name":"grin-hearts","unicode":"f584","searchTerms":["emoticon","face","love","smile"],"isBrand":false},{"name":"grin-squint","unicode":"f585","searchTerms":["emoticon","face","laugh","smile"],"isBrand":false},{"name":"grin-squint-tears","unicode":"f586","searchTerms":["emoticon","face","happy","smile"],"isBrand":false},{"name":"grin-stars","unicode":"f587","searchTerms":["emoticon","face","star-struck"],"isBrand":false},{"name":"grin-tears","unicode":"f588","searchTerms":["LOL","emoticon","face"],"isBrand":false},{"name":"grin-tongue","unicode":"f589","searchTerms":["LOL","emoticon","face"],"isBrand":false},{"name":"grin-tongue-squint","unicode":"f58a","searchTerms":["LOL","emoticon","face"],"isBrand":false},{"name":"grin-tongue-wink","unicode":"f58b","searchTerms":["LOL","emoticon","face"],"isBrand":false},{"name":"grin-wink","unicode":"f58c","searchTerms":["emoticon","face","flirt","laugh","smile"],"isBrand":false},{"name":"grip-horizontal","unicode":"f58d","searchTerms":["affordance","drag","drop","grab","handle"],"isBrand":false},{"name":"grip-lines","unicode":"f7a4","searchTerms":["affordance","drag","drop","grab","handle"],"isBrand":false},{"name":"grip-lines-vertical","unicode":"f7a5","searchTerms":["affordance","drag","drop","grab","handle"],"isBrand":false},{"name":"grip-vertical","unicode":"f58e","searchTerms":["affordance","drag","drop","grab","handle"],"isBrand":false},{"name":"gripfire","unicode":"f3ac","searchTerms":[],"isBrand":true},{"name":"grunt","unicode":"f3ad","searchTerms":[],"isBrand":true},{"name":"guilded","unicode":"e07e","searchTerms":[],"isBrand":true},{"name":"guitar","unicode":"f7a6","searchTerms":["acoustic","instrument","music","rock","rock and roll","song","strings"],"isBrand":false},{"name":"gulp","unicode":"f3ae","searchTerms":[],"isBrand":true},{"name":"h-square","unicode":"f0fd","searchTerms":["directions","emergency","hospital","hotel","map"],"isBrand":false},{"name":"hacker-news","unicode":"f1d4","searchTerms":[],"isBrand":true},{"name":"hacker-news-square","unicode":"f3af","searchTerms":[],"isBrand":true},{"name":"hackerrank","unicode":"f5f7","searchTerms":[],"isBrand":true},{"name":"hamburger","unicode":"f805","searchTerms":["bacon","beef","burger","burger king","cheeseburger","fast food","grill","ground beef","mcdonalds","sandwich"],"isBrand":false},{"name":"hammer","unicode":"f6e3","searchTerms":["admin","fix","repair","settings","tool"],"isBrand":false},{"name":"hamsa","unicode":"f665","searchTerms":["amulet","christianity","islam","jewish","judaism","muslim","protection"],"isBrand":false},{"name":"hand-holding","unicode":"f4bd","searchTerms":["carry","lift"],"isBrand":false},{"name":"hand-holding-heart","unicode":"f4be","searchTerms":["carry","charity","gift","lift","package"],"isBrand":false},{"name":"hand-holding-medical","unicode":"e05c","searchTerms":["care","covid-19","donate","help"],"isBrand":false},{"name":"hand-holding-usd","unicode":"f4c0","searchTerms":["$","carry","dollar sign","donation","giving","lift","money","price"],"isBrand":false},{"name":"hand-holding-water","unicode":"f4c1","searchTerms":["carry","covid-19","drought","grow","lift"],"isBrand":false},{"name":"hand-lizard","unicode":"f258","searchTerms":["game","roshambo"],"isBrand":false},{"name":"hand-middle-finger","unicode":"f806","searchTerms":["flip the bird","gesture","hate","rude"],"isBrand":false},{"name":"hand-paper","unicode":"f256","searchTerms":["game","halt","roshambo","stop"],"isBrand":false},{"name":"hand-peace","unicode":"f25b","searchTerms":["rest","truce"],"isBrand":false},{"name":"hand-point-down","unicode":"f0a7","searchTerms":["finger","hand-o-down","point"],"isBrand":false},{"name":"hand-point-left","unicode":"f0a5","searchTerms":["back","finger","hand-o-left","left","point","previous"],"isBrand":false},{"name":"hand-point-right","unicode":"f0a4","searchTerms":["finger","forward","hand-o-right","next","point","right"],"isBrand":false},{"name":"hand-point-up","unicode":"f0a6","searchTerms":["finger","hand-o-up","point"],"isBrand":false},{"name":"hand-pointer","unicode":"f25a","searchTerms":["arrow","cursor","select"],"isBrand":false},{"name":"hand-rock","unicode":"f255","searchTerms":["fist","game","roshambo"],"isBrand":false},{"name":"hand-scissors","unicode":"f257","searchTerms":["cut","game","roshambo"],"isBrand":false},{"name":"hand-sparkles","unicode":"e05d","searchTerms":["clean","covid-19","hygiene","magic","soap","wash"],"isBrand":false},{"name":"hand-spock","unicode":"f259","searchTerms":["live long","prosper","salute","star trek","vulcan"],"isBrand":false},{"name":"hands","unicode":"f4c2","searchTerms":["carry","hold","lift"],"isBrand":false},{"name":"hands-helping","unicode":"f4c4","searchTerms":["aid","assistance","handshake","partnership","volunteering"],"isBrand":false},{"name":"hands-wash","unicode":"e05e","searchTerms":["covid-19","hygiene","soap","wash"],"isBrand":false},{"name":"handshake","unicode":"f2b5","searchTerms":["agreement","greeting","meeting","partnership"],"isBrand":false},{"name":"handshake-alt-slash","unicode":"e05f","searchTerms":["broken","covid-19","social distance"],"isBrand":false},{"name":"handshake-slash","unicode":"e060","searchTerms":["broken","covid-19","social distance"],"isBrand":false},{"name":"hanukiah","unicode":"f6e6","searchTerms":["candle","hanukkah","jewish","judaism","light"],"isBrand":false},{"name":"hard-hat","unicode":"f807","searchTerms":["construction","hardhat","helmet","safety"],"isBrand":false},{"name":"hashtag","unicode":"f292","searchTerms":["Twitter","instagram","pound","social media","tag"],"isBrand":false},{"name":"hat-cowboy","unicode":"f8c0","searchTerms":["buckaroo","horse","jackeroo","john b.","old west","pardner","ranch","rancher","rodeo","western","wrangler"],"isBrand":false},{"name":"hat-cowboy-side","unicode":"f8c1","searchTerms":["buckaroo","horse","jackeroo","john b.","old west","pardner","ranch","rancher","rodeo","western","wrangler"],"isBrand":false},{"name":"hat-wizard","unicode":"f6e8","searchTerms":["Dungeons & Dragons","accessory","buckle","clothing","d&d","dnd","fantasy","halloween","head","holiday","mage","magic","pointy","witch"],"isBrand":false},{"name":"hdd","unicode":"f0a0","searchTerms":["cpu","hard drive","harddrive","machine","save","storage"],"isBrand":false},{"name":"head-side-cough","unicode":"e061","searchTerms":["cough","covid-19","germs","lungs","respiratory","sick"],"isBrand":false},{"name":"head-side-cough-slash","unicode":"e062","searchTerms":["cough","covid-19","germs","lungs","respiratory","sick"],"isBrand":false},{"name":"head-side-mask","unicode":"e063","searchTerms":["breath","covid-19","filter","respirator","virus"],"isBrand":false},{"name":"head-side-virus","unicode":"e064","searchTerms":["cold","covid-19","flu","sick"],"isBrand":false},{"name":"heading","unicode":"f1dc","searchTerms":["format","header","text","title"],"isBrand":false},{"name":"headphones","unicode":"f025","searchTerms":["audio","listen","music","sound","speaker"],"isBrand":false},{"name":"headphones-alt","unicode":"f58f","searchTerms":["audio","listen","music","sound","speaker"],"isBrand":false},{"name":"headset","unicode":"f590","searchTerms":["audio","gamer","gaming","listen","live chat","microphone","shot caller","sound","support","telemarketer"],"isBrand":false},{"name":"heart","unicode":"f004","searchTerms":["favorite","like","love","relationship","valentine"],"isBrand":false},{"name":"heart-broken","unicode":"f7a9","searchTerms":["breakup","crushed","dislike","dumped","grief","love","lovesick","relationship","sad"],"isBrand":false},{"name":"heartbeat","unicode":"f21e","searchTerms":["ekg","electrocardiogram","health","lifeline","vital signs"],"isBrand":false},{"name":"helicopter","unicode":"f533","searchTerms":["airwolf","apache","chopper","flight","fly","travel"],"isBrand":false},{"name":"highlighter","unicode":"f591","searchTerms":["edit","marker","sharpie","update","write"],"isBrand":false},{"name":"hiking","unicode":"f6ec","searchTerms":["activity","backpack","fall","fitness","outdoors","person","seasonal","walking"],"isBrand":false},{"name":"hippo","unicode":"f6ed","searchTerms":["animal","fauna","hippopotamus","hungry","mammal"],"isBrand":false},{"name":"hips","unicode":"f452","searchTerms":[],"isBrand":true},{"name":"hire-a-helper","unicode":"f3b0","searchTerms":[],"isBrand":true},{"name":"history","unicode":"f1da","searchTerms":["Rewind","clock","reverse","time","time machine"],"isBrand":false},{"name":"hive","unicode":"e07f","searchTerms":[],"isBrand":true},{"name":"hockey-puck","unicode":"f453","searchTerms":["ice","nhl","sport"],"isBrand":false},{"name":"holly-berry","unicode":"f7aa","searchTerms":["catwoman","christmas","decoration","flora","halle","holiday","ororo munroe","plant","storm","xmas"],"isBrand":false},{"name":"home","unicode":"f015","searchTerms":["abode","building","house","main"],"isBrand":false},{"name":"hooli","unicode":"f427","searchTerms":[],"isBrand":true},{"name":"hornbill","unicode":"f592","searchTerms":[],"isBrand":true},{"name":"horse","unicode":"f6f0","searchTerms":["equus","fauna","mammmal","mare","neigh","pony"],"isBrand":false},{"name":"horse-head","unicode":"f7ab","searchTerms":["equus","fauna","mammmal","mare","neigh","pony"],"isBrand":false},{"name":"hospital","unicode":"f0f8","searchTerms":["building","covid-19","emergency room","medical center"],"isBrand":false},{"name":"hospital-alt","unicode":"f47d","searchTerms":["building","covid-19","emergency room","medical center"],"isBrand":false},{"name":"hospital-symbol","unicode":"f47e","searchTerms":["clinic","covid-19","emergency","map"],"isBrand":false},{"name":"hospital-user","unicode":"f80d","searchTerms":["covid-19","doctor","network","patient","primary care"],"isBrand":false},{"name":"hot-tub","unicode":"f593","searchTerms":["bath","jacuzzi","massage","sauna","spa"],"isBrand":false},{"name":"hotdog","unicode":"f80f","searchTerms":["bun","chili","frankfurt","frankfurter","kosher","polish","sandwich","sausage","vienna","weiner"],"isBrand":false},{"name":"hotel","unicode":"f594","searchTerms":["building","inn","lodging","motel","resort","travel"],"isBrand":false},{"name":"hotjar","unicode":"f3b1","searchTerms":[],"isBrand":true},{"name":"hourglass","unicode":"f254","searchTerms":["hour","minute","sand","stopwatch","time"],"isBrand":false},{"name":"hourglass-end","unicode":"f253","searchTerms":["hour","minute","sand","stopwatch","time"],"isBrand":false},{"name":"hourglass-half","unicode":"f252","searchTerms":["hour","minute","sand","stopwatch","time"],"isBrand":false},{"name":"hourglass-start","unicode":"f251","searchTerms":["hour","minute","sand","stopwatch","time"],"isBrand":false},{"name":"house-damage","unicode":"f6f1","searchTerms":["building","devastation","disaster","home","insurance"],"isBrand":false},{"name":"house-user","unicode":"e065","searchTerms":["covid-19","home","isolation","quarantine"],"isBrand":false},{"name":"houzz","unicode":"f27c","searchTerms":[],"isBrand":true},{"name":"hryvnia","unicode":"f6f2","searchTerms":["currency","money","ukraine","ukrainian"],"isBrand":false},{"name":"html5","unicode":"f13b","searchTerms":[],"isBrand":true},{"name":"hubspot","unicode":"f3b2","searchTerms":[],"isBrand":true},{"name":"i-cursor","unicode":"f246","searchTerms":["editing","i-beam","type","writing"],"isBrand":false},{"name":"ice-cream","unicode":"f810","searchTerms":["chocolate","cone","dessert","frozen","scoop","sorbet","vanilla","yogurt"],"isBrand":false},{"name":"icicles","unicode":"f7ad","searchTerms":["cold","frozen","hanging","ice","seasonal","sharp"],"isBrand":false},{"name":"icons","unicode":"f86d","searchTerms":["bolt","emoji","heart","image","music","photo","symbols"],"isBrand":false},{"name":"id-badge","unicode":"f2c1","searchTerms":["address","contact","identification","license","profile"],"isBrand":false},{"name":"id-card","unicode":"f2c2","searchTerms":["contact","demographics","document","identification","issued","profile"],"isBrand":false},{"name":"id-card-alt","unicode":"f47f","searchTerms":["contact","demographics","document","identification","issued","profile"],"isBrand":false},{"name":"ideal","unicode":"e013","searchTerms":[],"isBrand":true},{"name":"igloo","unicode":"f7ae","searchTerms":["dome","dwelling","eskimo","home","house","ice","snow"],"isBrand":false},{"name":"image","unicode":"f03e","searchTerms":["album","landscape","photo","picture"],"isBrand":false},{"name":"images","unicode":"f302","searchTerms":["album","landscape","photo","picture"],"isBrand":false},{"name":"imdb","unicode":"f2d8","searchTerms":[],"isBrand":true},{"name":"inbox","unicode":"f01c","searchTerms":["archive","desk","email","mail","message"],"isBrand":false},{"name":"indent","unicode":"f03c","searchTerms":["align","justify","paragraph","tab"],"isBrand":false},{"name":"industry","unicode":"f275","searchTerms":["building","factory","industrial","manufacturing","mill","warehouse"],"isBrand":false},{"name":"infinity","unicode":"f534","searchTerms":["eternity","forever","math"],"isBrand":false},{"name":"info","unicode":"f129","searchTerms":["details","help","information","more","support"],"isBrand":false},{"name":"info-circle","unicode":"f05a","searchTerms":["details","help","information","more","support"],"isBrand":false},{"name":"innosoft","unicode":"e080","searchTerms":[],"isBrand":true},{"name":"instagram","unicode":"f16d","searchTerms":[],"isBrand":true},{"name":"instagram-square","unicode":"e055","searchTerms":[],"isBrand":true},{"name":"instalod","unicode":"e081","searchTerms":[],"isBrand":true},{"name":"intercom","unicode":"f7af","searchTerms":["app","customer","messenger"],"isBrand":true},{"name":"internet-explorer","unicode":"f26b","searchTerms":["browser","ie"],"isBrand":true},{"name":"invision","unicode":"f7b0","searchTerms":["app","design","interface"],"isBrand":true},{"name":"ioxhost","unicode":"f208","searchTerms":[],"isBrand":true},{"name":"italic","unicode":"f033","searchTerms":["edit","emphasis","font","format","text","type"],"isBrand":false},{"name":"itch-io","unicode":"f83a","searchTerms":[],"isBrand":true},{"name":"itunes","unicode":"f3b4","searchTerms":[],"isBrand":true},{"name":"itunes-note","unicode":"f3b5","searchTerms":[],"isBrand":true},{"name":"java","unicode":"f4e4","searchTerms":[],"isBrand":true},{"name":"jedi","unicode":"f669","searchTerms":["crest","force","sith","skywalker","star wars","yoda"],"isBrand":false},{"name":"jedi-order","unicode":"f50e","searchTerms":["star wars"],"isBrand":true},{"name":"jenkins","unicode":"f3b6","searchTerms":[],"isBrand":true},{"name":"jira","unicode":"f7b1","searchTerms":["atlassian"],"isBrand":true},{"name":"joget","unicode":"f3b7","searchTerms":[],"isBrand":true},{"name":"joint","unicode":"f595","searchTerms":["blunt","cannabis","doobie","drugs","marijuana","roach","smoke","smoking","spliff"],"isBrand":false},{"name":"joomla","unicode":"f1aa","searchTerms":[],"isBrand":true},{"name":"journal-whills","unicode":"f66a","searchTerms":["book","force","jedi","sith","star wars","yoda"],"isBrand":false},{"name":"js","unicode":"f3b8","searchTerms":[],"isBrand":true},{"name":"js-square","unicode":"f3b9","searchTerms":[],"isBrand":true},{"name":"jsfiddle","unicode":"f1cc","searchTerms":[],"isBrand":true},{"name":"kaaba","unicode":"f66b","searchTerms":["building","cube","islam","muslim"],"isBrand":false},{"name":"kaggle","unicode":"f5fa","searchTerms":[],"isBrand":true},{"name":"key","unicode":"f084","searchTerms":["lock","password","private","secret","unlock"],"isBrand":false},{"name":"keybase","unicode":"f4f5","searchTerms":[],"isBrand":true},{"name":"keyboard","unicode":"f11c","searchTerms":["accessory","edit","input","text","type","write"],"isBrand":false},{"name":"keycdn","unicode":"f3ba","searchTerms":[],"isBrand":true},{"name":"khanda","unicode":"f66d","searchTerms":["chakkar","sikh","sikhism","sword"],"isBrand":false},{"name":"kickstarter","unicode":"f3bb","searchTerms":[],"isBrand":true},{"name":"kickstarter-k","unicode":"f3bc","searchTerms":[],"isBrand":true},{"name":"kiss","unicode":"f596","searchTerms":["beso","emoticon","face","love","smooch"],"isBrand":false},{"name":"kiss-beam","unicode":"f597","searchTerms":["beso","emoticon","face","love","smooch"],"isBrand":false},{"name":"kiss-wink-heart","unicode":"f598","searchTerms":["beso","emoticon","face","love","smooch"],"isBrand":false},{"name":"kiwi-bird","unicode":"f535","searchTerms":["bird","fauna","new zealand"],"isBrand":false},{"name":"korvue","unicode":"f42f","searchTerms":[],"isBrand":true},{"name":"landmark","unicode":"f66f","searchTerms":["building","historic","memorable","monument","politics"],"isBrand":false},{"name":"language","unicode":"f1ab","searchTerms":["dialect","idiom","localize","speech","translate","vernacular"],"isBrand":false},{"name":"laptop","unicode":"f109","searchTerms":["computer","cpu","dell","demo","device","mac","macbook","machine","pc"],"isBrand":false},{"name":"laptop-code","unicode":"f5fc","searchTerms":["computer","cpu","dell","demo","develop","device","mac","macbook","machine","pc"],"isBrand":false},{"name":"laptop-house","unicode":"e066","searchTerms":["computer","covid-19","device","office","remote","work from home"],"isBrand":false},{"name":"laptop-medical","unicode":"f812","searchTerms":["computer","device","ehr","electronic health records","history"],"isBrand":false},{"name":"laravel","unicode":"f3bd","searchTerms":[],"isBrand":true},{"name":"lastfm","unicode":"f202","searchTerms":[],"isBrand":true},{"name":"lastfm-square","unicode":"f203","searchTerms":[],"isBrand":true},{"name":"laugh","unicode":"f599","searchTerms":["LOL","emoticon","face","laugh","smile"],"isBrand":false},{"name":"laugh-beam","unicode":"f59a","searchTerms":["LOL","emoticon","face","happy","smile"],"isBrand":false},{"name":"laugh-squint","unicode":"f59b","searchTerms":["LOL","emoticon","face","happy","smile"],"isBrand":false},{"name":"laugh-wink","unicode":"f59c","searchTerms":["LOL","emoticon","face","happy","smile"],"isBrand":false},{"name":"layer-group","unicode":"f5fd","searchTerms":["arrange","develop","layers","map","stack"],"isBrand":false},{"name":"leaf","unicode":"f06c","searchTerms":["eco","flora","nature","plant","vegan"],"isBrand":false},{"name":"leanpub","unicode":"f212","searchTerms":[],"isBrand":true},{"name":"lemon","unicode":"f094","searchTerms":["citrus","lemonade","lime","tart"],"isBrand":false},{"name":"less","unicode":"f41d","searchTerms":[],"isBrand":true},{"name":"less-than","unicode":"f536","searchTerms":["arithmetic","compare","math"],"isBrand":false},{"name":"less-than-equal","unicode":"f537","searchTerms":["arithmetic","compare","math"],"isBrand":false},{"name":"level-down-alt","unicode":"f3be","searchTerms":["arrow","level-down"],"isBrand":false},{"name":"level-up-alt","unicode":"f3bf","searchTerms":["arrow","level-up"],"isBrand":false},{"name":"life-ring","unicode":"f1cd","searchTerms":["coast guard","help","overboard","save","support"],"isBrand":false},{"name":"lightbulb","unicode":"f0eb","searchTerms":["energy","idea","inspiration","light"],"isBrand":false},{"name":"line","unicode":"f3c0","searchTerms":[],"isBrand":true},{"name":"link","unicode":"f0c1","searchTerms":["attach","attachment","chain","connect"],"isBrand":false},{"name":"linkedin","unicode":"f08c","searchTerms":["linkedin-square"],"isBrand":true},{"name":"linkedin-in","unicode":"f0e1","searchTerms":["linkedin"],"isBrand":true},{"name":"linode","unicode":"f2b8","searchTerms":[],"isBrand":true},{"name":"linux","unicode":"f17c","searchTerms":["tux"],"isBrand":true},{"name":"lira-sign","unicode":"f195","searchTerms":["currency","money","try","turkish"],"isBrand":false},{"name":"list","unicode":"f03a","searchTerms":["checklist","completed","done","finished","ol","todo","ul"],"isBrand":false},{"name":"list-alt","unicode":"f022","searchTerms":["checklist","completed","done","finished","ol","todo","ul"],"isBrand":false},{"name":"list-ol","unicode":"f0cb","searchTerms":["checklist","completed","done","finished","numbers","ol","todo","ul"],"isBrand":false},{"name":"list-ul","unicode":"f0ca","searchTerms":["checklist","completed","done","finished","ol","todo","ul"],"isBrand":false},{"name":"location-arrow","unicode":"f124","searchTerms":["address","compass","coordinate","direction","gps","map","navigation","place"],"isBrand":false},{"name":"lock","unicode":"f023","searchTerms":["admin","lock","open","password","private","protect","security"],"isBrand":false},{"name":"lock-open","unicode":"f3c1","searchTerms":["admin","lock","open","password","private","protect","security"],"isBrand":false},{"name":"long-arrow-alt-down","unicode":"f309","searchTerms":["download","long-arrow-down"],"isBrand":false},{"name":"long-arrow-alt-left","unicode":"f30a","searchTerms":["back","long-arrow-left","previous"],"isBrand":false},{"name":"long-arrow-alt-right","unicode":"f30b","searchTerms":["forward","long-arrow-right","next"],"isBrand":false},{"name":"long-arrow-alt-up","unicode":"f30c","searchTerms":["long-arrow-up","upload"],"isBrand":false},{"name":"low-vision","unicode":"f2a8","searchTerms":["blind","eye","sight"],"isBrand":false},{"name":"luggage-cart","unicode":"f59d","searchTerms":["bag","baggage","suitcase","travel"],"isBrand":false},{"name":"lungs","unicode":"f604","searchTerms":["air","breath","covid-19","organ","respiratory"],"isBrand":false},{"name":"lungs-virus","unicode":"e067","searchTerms":["breath","covid-19","respiratory","sick"],"isBrand":false},{"name":"lyft","unicode":"f3c3","searchTerms":[],"isBrand":true},{"name":"magento","unicode":"f3c4","searchTerms":[],"isBrand":true},{"name":"magic","unicode":"f0d0","searchTerms":["autocomplete","automatic","mage","magic","spell","wand","witch","wizard"],"isBrand":false},{"name":"magnet","unicode":"f076","searchTerms":["Attract","lodestone","tool"],"isBrand":false},{"name":"mail-bulk","unicode":"f674","searchTerms":["archive","envelope","letter","post office","postal","postcard","send","stamp","usps"],"isBrand":false},{"name":"mailchimp","unicode":"f59e","searchTerms":[],"isBrand":true},{"name":"male","unicode":"f183","searchTerms":["human","man","person","profile","user"],"isBrand":false},{"name":"mandalorian","unicode":"f50f","searchTerms":[],"isBrand":true},{"name":"map","unicode":"f279","searchTerms":["address","coordinates","destination","gps","localize","location","map","navigation","paper","pin","place","point of interest","position","route","travel"],"isBrand":false},{"name":"map-marked","unicode":"f59f","searchTerms":["address","coordinates","destination","gps","localize","location","map","navigation","paper","pin","place","point of interest","position","route","travel"],"isBrand":false},{"name":"map-marked-alt","unicode":"f5a0","searchTerms":["address","coordinates","destination","gps","localize","location","map","navigation","paper","pin","place","point of interest","position","route","travel"],"isBrand":false},{"name":"map-marker","unicode":"f041","searchTerms":["address","coordinates","destination","gps","localize","location","map","navigation","paper","pin","place","point of interest","position","route","travel"],"isBrand":false},{"name":"map-marker-alt","unicode":"f3c5","searchTerms":["address","coordinates","destination","gps","localize","location","map","navigation","paper","pin","place","point of interest","position","route","travel"],"isBrand":false},{"name":"map-pin","unicode":"f276","searchTerms":["address","agree","coordinates","destination","gps","localize","location","map","marker","navigation","pin","place","position","travel"],"isBrand":false},{"name":"map-signs","unicode":"f277","searchTerms":["directions","directory","map","signage","wayfinding"],"isBrand":false},{"name":"markdown","unicode":"f60f","searchTerms":[],"isBrand":true},{"name":"marker","unicode":"f5a1","searchTerms":["design","edit","sharpie","update","write"],"isBrand":false},{"name":"mars","unicode":"f222","searchTerms":["male"],"isBrand":false},{"name":"mars-double","unicode":"f227","searchTerms":[],"isBrand":false},{"name":"mars-stroke","unicode":"f229","searchTerms":[],"isBrand":false},{"name":"mars-stroke-h","unicode":"f22b","searchTerms":[],"isBrand":false},{"name":"mars-stroke-v","unicode":"f22a","searchTerms":[],"isBrand":false},{"name":"mask","unicode":"f6fa","searchTerms":["carnivale","costume","disguise","halloween","secret","super hero"],"isBrand":false},{"name":"mastodon","unicode":"f4f6","searchTerms":[],"isBrand":true},{"name":"maxcdn","unicode":"f136","searchTerms":[],"isBrand":true},{"name":"mdb","unicode":"f8ca","searchTerms":[],"isBrand":true},{"name":"medal","unicode":"f5a2","searchTerms":["award","ribbon","star","trophy"],"isBrand":false},{"name":"medapps","unicode":"f3c6","searchTerms":[],"isBrand":true},{"name":"medium","unicode":"f23a","searchTerms":[],"isBrand":true},{"name":"medium-m","unicode":"f3c7","searchTerms":[],"isBrand":true},{"name":"medkit","unicode":"f0fa","searchTerms":["first aid","firstaid","health","help","support"],"isBrand":false},{"name":"medrt","unicode":"f3c8","searchTerms":[],"isBrand":true},{"name":"meetup","unicode":"f2e0","searchTerms":[],"isBrand":true},{"name":"megaport","unicode":"f5a3","searchTerms":[],"isBrand":true},{"name":"meh","unicode":"f11a","searchTerms":["emoticon","face","neutral","rating"],"isBrand":false},{"name":"meh-blank","unicode":"f5a4","searchTerms":["emoticon","face","neutral","rating"],"isBrand":false},{"name":"meh-rolling-eyes","unicode":"f5a5","searchTerms":["emoticon","face","neutral","rating"],"isBrand":false},{"name":"memory","unicode":"f538","searchTerms":["DIMM","RAM","hardware","storage","technology"],"isBrand":false},{"name":"mendeley","unicode":"f7b3","searchTerms":[],"isBrand":true},{"name":"menorah","unicode":"f676","searchTerms":["candle","hanukkah","jewish","judaism","light"],"isBrand":false},{"name":"mercury","unicode":"f223","searchTerms":["transgender"],"isBrand":false},{"name":"meteor","unicode":"f753","searchTerms":["armageddon","asteroid","comet","shooting star","space"],"isBrand":false},{"name":"microblog","unicode":"e01a","searchTerms":[],"isBrand":true},{"name":"microchip","unicode":"f2db","searchTerms":["cpu","hardware","processor","technology"],"isBrand":false},{"name":"microphone","unicode":"f130","searchTerms":["audio","podcast","record","sing","sound","voice"],"isBrand":false},{"name":"microphone-alt","unicode":"f3c9","searchTerms":["audio","podcast","record","sing","sound","voice"],"isBrand":false},{"name":"microphone-alt-slash","unicode":"f539","searchTerms":["audio","disable","mute","podcast","record","sing","sound","voice"],"isBrand":false},{"name":"microphone-slash","unicode":"f131","searchTerms":["audio","disable","mute","podcast","record","sing","sound","voice"],"isBrand":false},{"name":"microscope","unicode":"f610","searchTerms":["covid-19","electron","lens","optics","science","shrink"],"isBrand":false},{"name":"microsoft","unicode":"f3ca","searchTerms":[],"isBrand":true},{"name":"minus","unicode":"f068","searchTerms":["collapse","delete","hide","minify","negative","remove","trash"],"isBrand":false},{"name":"minus-circle","unicode":"f056","searchTerms":["delete","hide","negative","remove","shape","trash"],"isBrand":false},{"name":"minus-square","unicode":"f146","searchTerms":["collapse","delete","hide","minify","negative","remove","shape","trash"],"isBrand":false},{"name":"mitten","unicode":"f7b5","searchTerms":["clothing","cold","glove","hands","knitted","seasonal","warmth"],"isBrand":false},{"name":"mix","unicode":"f3cb","searchTerms":[],"isBrand":true},{"name":"mixcloud","unicode":"f289","searchTerms":[],"isBrand":true},{"name":"mixer","unicode":"e056","searchTerms":[],"isBrand":true},{"name":"mizuni","unicode":"f3cc","searchTerms":[],"isBrand":true},{"name":"mobile","unicode":"f10b","searchTerms":["apple","call","cell phone","cellphone","device","iphone","number","screen","telephone"],"isBrand":false},{"name":"mobile-alt","unicode":"f3cd","searchTerms":["apple","call","cell phone","cellphone","device","iphone","number","screen","telephone"],"isBrand":false},{"name":"modx","unicode":"f285","searchTerms":[],"isBrand":true},{"name":"monero","unicode":"f3d0","searchTerms":[],"isBrand":true},{"name":"money-bill","unicode":"f0d6","searchTerms":["buy","cash","checkout","money","payment","price","purchase"],"isBrand":false},{"name":"money-bill-alt","unicode":"f3d1","searchTerms":["buy","cash","checkout","money","payment","price","purchase"],"isBrand":false},{"name":"money-bill-wave","unicode":"f53a","searchTerms":["buy","cash","checkout","money","payment","price","purchase"],"isBrand":false},{"name":"money-bill-wave-alt","unicode":"f53b","searchTerms":["buy","cash","checkout","money","payment","price","purchase"],"isBrand":false},{"name":"money-check","unicode":"f53c","searchTerms":["bank check","buy","checkout","cheque","money","payment","price","purchase"],"isBrand":false},{"name":"money-check-alt","unicode":"f53d","searchTerms":["bank check","buy","checkout","cheque","money","payment","price","purchase"],"isBrand":false},{"name":"monument","unicode":"f5a6","searchTerms":["building","historic","landmark","memorable"],"isBrand":false},{"name":"moon","unicode":"f186","searchTerms":["contrast","crescent","dark","lunar","night"],"isBrand":false},{"name":"mortar-pestle","unicode":"f5a7","searchTerms":["crush","culinary","grind","medical","mix","pharmacy","prescription","spices"],"isBrand":false},{"name":"mosque","unicode":"f678","searchTerms":["building","islam","landmark","muslim"],"isBrand":false},{"name":"motorcycle","unicode":"f21c","searchTerms":["bike","machine","transportation","vehicle"],"isBrand":false},{"name":"mountain","unicode":"f6fc","searchTerms":["glacier","hiking","hill","landscape","travel","view"],"isBrand":false},{"name":"mouse","unicode":"f8cc","searchTerms":["click","computer","cursor","input","peripheral"],"isBrand":false},{"name":"mouse-pointer","unicode":"f245","searchTerms":["arrow","cursor","select"],"isBrand":false},{"name":"mug-hot","unicode":"f7b6","searchTerms":["caliente","cocoa","coffee","cup","drink","holiday","hot chocolate","steam","tea","warmth"],"isBrand":false},{"name":"music","unicode":"f001","searchTerms":["lyrics","melody","note","sing","sound"],"isBrand":false},{"name":"napster","unicode":"f3d2","searchTerms":[],"isBrand":true},{"name":"neos","unicode":"f612","searchTerms":[],"isBrand":true},{"name":"network-wired","unicode":"f6ff","searchTerms":["computer","connect","ethernet","internet","intranet"],"isBrand":false},{"name":"neuter","unicode":"f22c","searchTerms":[],"isBrand":false},{"name":"newspaper","unicode":"f1ea","searchTerms":["article","editorial","headline","journal","journalism","news","press"],"isBrand":false},{"name":"nimblr","unicode":"f5a8","searchTerms":[],"isBrand":true},{"name":"node","unicode":"f419","searchTerms":[],"isBrand":true},{"name":"node-js","unicode":"f3d3","searchTerms":[],"isBrand":true},{"name":"not-equal","unicode":"f53e","searchTerms":["arithmetic","compare","math"],"isBrand":false},{"name":"notes-medical","unicode":"f481","searchTerms":["clipboard","doctor","ehr","health","history","records"],"isBrand":false},{"name":"npm","unicode":"f3d4","searchTerms":[],"isBrand":true},{"name":"ns8","unicode":"f3d5","searchTerms":[],"isBrand":true},{"name":"nutritionix","unicode":"f3d6","searchTerms":[],"isBrand":true},{"name":"object-group","unicode":"f247","searchTerms":["combine","copy","design","merge","select"],"isBrand":false},{"name":"object-ungroup","unicode":"f248","searchTerms":["copy","design","merge","select","separate"],"isBrand":false},{"name":"octopus-deploy","unicode":"e082","searchTerms":[],"isBrand":true},{"name":"odnoklassniki","unicode":"f263","searchTerms":[],"isBrand":true},{"name":"odnoklassniki-square","unicode":"f264","searchTerms":[],"isBrand":true},{"name":"oil-can","unicode":"f613","searchTerms":["auto","crude","gasoline","grease","lubricate","petroleum"],"isBrand":false},{"name":"old-republic","unicode":"f510","searchTerms":["politics","star wars"],"isBrand":true},{"name":"om","unicode":"f679","searchTerms":["buddhism","hinduism","jainism","mantra"],"isBrand":false},{"name":"opencart","unicode":"f23d","searchTerms":[],"isBrand":true},{"name":"openid","unicode":"f19b","searchTerms":[],"isBrand":true},{"name":"opera","unicode":"f26a","searchTerms":[],"isBrand":true},{"name":"optin-monster","unicode":"f23c","searchTerms":[],"isBrand":true},{"name":"orcid","unicode":"f8d2","searchTerms":[],"isBrand":true},{"name":"osi","unicode":"f41a","searchTerms":[],"isBrand":true},{"name":"otter","unicode":"f700","searchTerms":["animal","badger","fauna","fur","mammal","marten"],"isBrand":false},{"name":"outdent","unicode":"f03b","searchTerms":["align","justify","paragraph","tab"],"isBrand":false},{"name":"page4","unicode":"f3d7","searchTerms":[],"isBrand":true},{"name":"pagelines","unicode":"f18c","searchTerms":["eco","flora","leaf","leaves","nature","plant","tree"],"isBrand":true},{"name":"pager","unicode":"f815","searchTerms":["beeper","cellphone","communication"],"isBrand":false},{"name":"paint-brush","unicode":"f1fc","searchTerms":["acrylic","art","brush","color","fill","paint","pigment","watercolor"],"isBrand":false},{"name":"paint-roller","unicode":"f5aa","searchTerms":["acrylic","art","brush","color","fill","paint","pigment","watercolor"],"isBrand":false},{"name":"palette","unicode":"f53f","searchTerms":["acrylic","art","brush","color","fill","paint","pigment","watercolor"],"isBrand":false},{"name":"palfed","unicode":"f3d8","searchTerms":[],"isBrand":true},{"name":"pallet","unicode":"f482","searchTerms":["archive","box","inventory","shipping","warehouse"],"isBrand":false},{"name":"paper-plane","unicode":"f1d8","searchTerms":["air","float","fold","mail","paper","send"],"isBrand":false},{"name":"paperclip","unicode":"f0c6","searchTerms":["attach","attachment","connect","link"],"isBrand":false},{"name":"parachute-box","unicode":"f4cd","searchTerms":["aid","assistance","rescue","supplies"],"isBrand":false},{"name":"paragraph","unicode":"f1dd","searchTerms":["edit","format","text","writing"],"isBrand":false},{"name":"parking","unicode":"f540","searchTerms":["auto","car","garage","meter"],"isBrand":false},{"name":"passport","unicode":"f5ab","searchTerms":["document","id","identification","issued","travel"],"isBrand":false},{"name":"pastafarianism","unicode":"f67b","searchTerms":["agnosticism","atheism","flying spaghetti monster","fsm"],"isBrand":false},{"name":"paste","unicode":"f0ea","searchTerms":["clipboard","copy","document","paper"],"isBrand":false},{"name":"patreon","unicode":"f3d9","searchTerms":[],"isBrand":true},{"name":"pause","unicode":"f04c","searchTerms":["hold","wait"],"isBrand":false},{"name":"pause-circle","unicode":"f28b","searchTerms":["hold","wait"],"isBrand":false},{"name":"paw","unicode":"f1b0","searchTerms":["animal","cat","dog","pet","print"],"isBrand":false},{"name":"paypal","unicode":"f1ed","searchTerms":[],"isBrand":true},{"name":"peace","unicode":"f67c","searchTerms":["serenity","tranquility","truce","war"],"isBrand":false},{"name":"pen","unicode":"f304","searchTerms":["design","edit","update","write"],"isBrand":false},{"name":"pen-alt","unicode":"f305","searchTerms":["design","edit","update","write"],"isBrand":false},{"name":"pen-fancy","unicode":"f5ac","searchTerms":["design","edit","fountain pen","update","write"],"isBrand":false},{"name":"pen-nib","unicode":"f5ad","searchTerms":["design","edit","fountain pen","update","write"],"isBrand":false},{"name":"pen-square","unicode":"f14b","searchTerms":["edit","pencil-square","update","write"],"isBrand":false},{"name":"pencil-alt","unicode":"f303","searchTerms":["design","edit","pencil","update","write"],"isBrand":false},{"name":"pencil-ruler","unicode":"f5ae","searchTerms":["design","draft","draw","pencil"],"isBrand":false},{"name":"penny-arcade","unicode":"f704","searchTerms":["Dungeons & Dragons","d&d","dnd","fantasy","game","gaming","pax","tabletop"],"isBrand":true},{"name":"people-arrows","unicode":"e068","searchTerms":["covid-19","personal space","social distance","space","spread","users"],"isBrand":false},{"name":"people-carry","unicode":"f4ce","searchTerms":["box","carry","fragile","help","movers","package"],"isBrand":false},{"name":"pepper-hot","unicode":"f816","searchTerms":["buffalo wings","capsicum","chili","chilli","habanero","jalapeno","mexican","spicy","tabasco","vegetable"],"isBrand":false},{"name":"perbyte","unicode":"e083","searchTerms":[],"isBrand":true},{"name":"percent","unicode":"f295","searchTerms":["discount","fraction","proportion","rate","ratio"],"isBrand":false},{"name":"percentage","unicode":"f541","searchTerms":["discount","fraction","proportion","rate","ratio"],"isBrand":false},{"name":"periscope","unicode":"f3da","searchTerms":[],"isBrand":true},{"name":"person-booth","unicode":"f756","searchTerms":["changing","changing room","election","human","person","vote","voting"],"isBrand":false},{"name":"phabricator","unicode":"f3db","searchTerms":[],"isBrand":true},{"name":"phoenix-framework","unicode":"f3dc","searchTerms":[],"isBrand":true},{"name":"phoenix-squadron","unicode":"f511","searchTerms":[],"isBrand":true},{"name":"phone","unicode":"f095","searchTerms":["call","earphone","number","support","telephone","voice"],"isBrand":false},{"name":"phone-alt","unicode":"f879","searchTerms":["call","earphone","number","support","telephone","voice"],"isBrand":false},{"name":"phone-slash","unicode":"f3dd","searchTerms":["call","cancel","earphone","mute","number","support","telephone","voice"],"isBrand":false},{"name":"phone-square","unicode":"f098","searchTerms":["call","earphone","number","support","telephone","voice"],"isBrand":false},{"name":"phone-square-alt","unicode":"f87b","searchTerms":["call","earphone","number","support","telephone","voice"],"isBrand":false},{"name":"phone-volume","unicode":"f2a0","searchTerms":["call","earphone","number","sound","support","telephone","voice","volume-control-phone"],"isBrand":false},{"name":"photo-video","unicode":"f87c","searchTerms":["av","film","image","library","media"],"isBrand":false},{"name":"php","unicode":"f457","searchTerms":[],"isBrand":true},{"name":"pied-piper","unicode":"f2ae","searchTerms":[],"isBrand":true},{"name":"pied-piper-alt","unicode":"f1a8","searchTerms":[],"isBrand":true},{"name":"pied-piper-hat","unicode":"f4e5","searchTerms":["clothing"],"isBrand":true},{"name":"pied-piper-pp","unicode":"f1a7","searchTerms":[],"isBrand":true},{"name":"pied-piper-square","unicode":"e01e","searchTerms":[],"isBrand":true},{"name":"piggy-bank","unicode":"f4d3","searchTerms":["bank","save","savings"],"isBrand":false},{"name":"pills","unicode":"f484","searchTerms":["drugs","medicine","prescription","tablets"],"isBrand":false},{"name":"pinterest","unicode":"f0d2","searchTerms":[],"isBrand":true},{"name":"pinterest-p","unicode":"f231","searchTerms":[],"isBrand":true},{"name":"pinterest-square","unicode":"f0d3","searchTerms":[],"isBrand":true},{"name":"pizza-slice","unicode":"f818","searchTerms":["cheese","chicago","italian","mozzarella","new york","pepperoni","pie","slice","teenage mutant ninja turtles","tomato"],"isBrand":false},{"name":"place-of-worship","unicode":"f67f","searchTerms":["building","church","holy","mosque","synagogue"],"isBrand":false},{"name":"plane","unicode":"f072","searchTerms":["airplane","destination","fly","location","mode","travel","trip"],"isBrand":false},{"name":"plane-arrival","unicode":"f5af","searchTerms":["airplane","arriving","destination","fly","land","landing","location","mode","travel","trip"],"isBrand":false},{"name":"plane-departure","unicode":"f5b0","searchTerms":["airplane","departing","destination","fly","location","mode","take off","taking off","travel","trip"],"isBrand":false},{"name":"plane-slash","unicode":"e069","searchTerms":["airplane mode","canceled","covid-19","delayed","grounded","travel"],"isBrand":false},{"name":"play","unicode":"f04b","searchTerms":["audio","music","playing","sound","start","video"],"isBrand":false},{"name":"play-circle","unicode":"f144","searchTerms":["audio","music","playing","sound","start","video"],"isBrand":false},{"name":"playstation","unicode":"f3df","searchTerms":[],"isBrand":true},{"name":"plug","unicode":"f1e6","searchTerms":["connect","electric","online","power"],"isBrand":false},{"name":"plus","unicode":"f067","searchTerms":["add","create","expand","new","positive","shape"],"isBrand":false},{"name":"plus-circle","unicode":"f055","searchTerms":["add","create","expand","new","positive","shape"],"isBrand":false},{"name":"plus-square","unicode":"f0fe","searchTerms":["add","create","expand","new","positive","shape"],"isBrand":false},{"name":"podcast","unicode":"f2ce","searchTerms":["audio","broadcast","music","sound"],"isBrand":false},{"name":"poll","unicode":"f681","searchTerms":["results","survey","trend","vote","voting"],"isBrand":false},{"name":"poll-h","unicode":"f682","searchTerms":["results","survey","trend","vote","voting"],"isBrand":false},{"name":"poo","unicode":"f2fe","searchTerms":["crap","poop","shit","smile","turd"],"isBrand":false},{"name":"poo-storm","unicode":"f75a","searchTerms":["bolt","cloud","euphemism","lightning","mess","poop","shit","turd"],"isBrand":false},{"name":"poop","unicode":"f619","searchTerms":["crap","poop","shit","smile","turd"],"isBrand":false},{"name":"portrait","unicode":"f3e0","searchTerms":["id","image","photo","picture","selfie"],"isBrand":false},{"name":"pound-sign","unicode":"f154","searchTerms":["currency","gbp","money"],"isBrand":false},{"name":"power-off","unicode":"f011","searchTerms":["cancel","computer","on","reboot","restart"],"isBrand":false},{"name":"pray","unicode":"f683","searchTerms":["kneel","preach","religion","worship"],"isBrand":false},{"name":"praying-hands","unicode":"f684","searchTerms":["kneel","preach","religion","worship"],"isBrand":false},{"name":"prescription","unicode":"f5b1","searchTerms":["drugs","medical","medicine","pharmacy","rx"],"isBrand":false},{"name":"prescription-bottle","unicode":"f485","searchTerms":["drugs","medical","medicine","pharmacy","rx"],"isBrand":false},{"name":"prescription-bottle-alt","unicode":"f486","searchTerms":["drugs","medical","medicine","pharmacy","rx"],"isBrand":false},{"name":"print","unicode":"f02f","searchTerms":["business","copy","document","office","paper"],"isBrand":false},{"name":"procedures","unicode":"f487","searchTerms":["EKG","bed","electrocardiogram","health","hospital","life","patient","vital"],"isBrand":false},{"name":"product-hunt","unicode":"f288","searchTerms":[],"isBrand":true},{"name":"project-diagram","unicode":"f542","searchTerms":["chart","graph","network","pert"],"isBrand":false},{"name":"pump-medical","unicode":"e06a","searchTerms":["anti-bacterial","clean","covid-19","disinfect","hygiene","medical grade","sanitizer","soap"],"isBrand":false},{"name":"pump-soap","unicode":"e06b","searchTerms":["anti-bacterial","clean","covid-19","disinfect","hygiene","sanitizer","soap"],"isBrand":false},{"name":"pushed","unicode":"f3e1","searchTerms":[],"isBrand":true},{"name":"puzzle-piece","unicode":"f12e","searchTerms":["add-on","addon","game","section"],"isBrand":false},{"name":"python","unicode":"f3e2","searchTerms":[],"isBrand":true},{"name":"qq","unicode":"f1d6","searchTerms":[],"isBrand":true},{"name":"qrcode","unicode":"f029","searchTerms":["barcode","info","information","scan"],"isBrand":false},{"name":"question","unicode":"f128","searchTerms":["help","information","support","unknown"],"isBrand":false},{"name":"question-circle","unicode":"f059","searchTerms":["help","information","support","unknown"],"isBrand":false},{"name":"quidditch","unicode":"f458","searchTerms":["ball","bludger","broom","golden snitch","harry potter","hogwarts","quaffle","sport","wizard"],"isBrand":false},{"name":"quinscape","unicode":"f459","searchTerms":[],"isBrand":true},{"name":"quora","unicode":"f2c4","searchTerms":[],"isBrand":true},{"name":"quote-left","unicode":"f10d","searchTerms":["mention","note","phrase","text","type"],"isBrand":false},{"name":"quote-right","unicode":"f10e","searchTerms":["mention","note","phrase","text","type"],"isBrand":false},{"name":"quran","unicode":"f687","searchTerms":["book","islam","muslim","religion"],"isBrand":false},{"name":"r-project","unicode":"f4f7","searchTerms":[],"isBrand":true},{"name":"radiation","unicode":"f7b9","searchTerms":["danger","dangerous","deadly","hazard","nuclear","radioactive","warning"],"isBrand":false},{"name":"radiation-alt","unicode":"f7ba","searchTerms":["danger","dangerous","deadly","hazard","nuclear","radioactive","warning"],"isBrand":false},{"name":"rainbow","unicode":"f75b","searchTerms":["gold","leprechaun","prism","rain","sky"],"isBrand":false},{"name":"random","unicode":"f074","searchTerms":["arrows","shuffle","sort","swap","switch","transfer"],"isBrand":false},{"name":"raspberry-pi","unicode":"f7bb","searchTerms":[],"isBrand":true},{"name":"ravelry","unicode":"f2d9","searchTerms":[],"isBrand":true},{"name":"react","unicode":"f41b","searchTerms":[],"isBrand":true},{"name":"reacteurope","unicode":"f75d","searchTerms":[],"isBrand":true},{"name":"readme","unicode":"f4d5","searchTerms":[],"isBrand":true},{"name":"rebel","unicode":"f1d0","searchTerms":[],"isBrand":true},{"name":"receipt","unicode":"f543","searchTerms":["check","invoice","money","pay","table"],"isBrand":false},{"name":"record-vinyl","unicode":"f8d9","searchTerms":["LP","album","analog","music","phonograph","sound"],"isBrand":false},{"name":"recycle","unicode":"f1b8","searchTerms":["Waste","compost","garbage","reuse","trash"],"isBrand":false},{"name":"red-river","unicode":"f3e3","searchTerms":[],"isBrand":true},{"name":"reddit","unicode":"f1a1","searchTerms":[],"isBrand":true},{"name":"reddit-alien","unicode":"f281","searchTerms":[],"isBrand":true},{"name":"reddit-square","unicode":"f1a2","searchTerms":[],"isBrand":true},{"name":"redhat","unicode":"f7bc","searchTerms":["linux","operating system","os"],"isBrand":true},{"name":"redo","unicode":"f01e","searchTerms":["forward","refresh","reload","repeat"],"isBrand":false},{"name":"redo-alt","unicode":"f2f9","searchTerms":["forward","refresh","reload","repeat"],"isBrand":false},{"name":"registered","unicode":"f25d","searchTerms":["copyright","mark","trademark"],"isBrand":false},{"name":"remove-format","unicode":"f87d","searchTerms":["cancel","font","format","remove","style","text"],"isBrand":false},{"name":"renren","unicode":"f18b","searchTerms":[],"isBrand":true},{"name":"reply","unicode":"f3e5","searchTerms":["mail","message","respond"],"isBrand":false},{"name":"reply-all","unicode":"f122","searchTerms":["mail","message","respond"],"isBrand":false},{"name":"replyd","unicode":"f3e6","searchTerms":[],"isBrand":true},{"name":"republican","unicode":"f75e","searchTerms":["american","conservative","election","elephant","politics","republican party","right","right-wing","usa"],"isBrand":false},{"name":"researchgate","unicode":"f4f8","searchTerms":[],"isBrand":true},{"name":"resolving","unicode":"f3e7","searchTerms":[],"isBrand":true},{"name":"restroom","unicode":"f7bd","searchTerms":["bathroom","john","loo","potty","washroom","waste","wc"],"isBrand":false},{"name":"retweet","unicode":"f079","searchTerms":["refresh","reload","share","swap"],"isBrand":false},{"name":"rev","unicode":"f5b2","searchTerms":[],"isBrand":true},{"name":"ribbon","unicode":"f4d6","searchTerms":["badge","cause","lapel","pin"],"isBrand":false},{"name":"ring","unicode":"f70b","searchTerms":["Dungeons & Dragons","Gollum","band","binding","d&d","dnd","engagement","fantasy","gold","jewelry","marriage","precious"],"isBrand":false},{"name":"road","unicode":"f018","searchTerms":["highway","map","pavement","route","street","travel"],"isBrand":false},{"name":"robot","unicode":"f544","searchTerms":["android","automate","computer","cyborg"],"isBrand":false},{"name":"rocket","unicode":"f135","searchTerms":["aircraft","app","jet","launch","nasa","space"],"isBrand":false},{"name":"rocketchat","unicode":"f3e8","searchTerms":[],"isBrand":true},{"name":"rockrms","unicode":"f3e9","searchTerms":[],"isBrand":true},{"name":"route","unicode":"f4d7","searchTerms":["directions","navigation","travel"],"isBrand":false},{"name":"rss","unicode":"f09e","searchTerms":["blog","feed","journal","news","writing"],"isBrand":false},{"name":"rss-square","unicode":"f143","searchTerms":["blog","feed","journal","news","writing"],"isBrand":false},{"name":"ruble-sign","unicode":"f158","searchTerms":["currency","money","rub"],"isBrand":false},{"name":"ruler","unicode":"f545","searchTerms":["design","draft","length","measure","planning"],"isBrand":false},{"name":"ruler-combined","unicode":"f546","searchTerms":["design","draft","length","measure","planning"],"isBrand":false},{"name":"ruler-horizontal","unicode":"f547","searchTerms":["design","draft","length","measure","planning"],"isBrand":false},{"name":"ruler-vertical","unicode":"f548","searchTerms":["design","draft","length","measure","planning"],"isBrand":false},{"name":"running","unicode":"f70c","searchTerms":["exercise","health","jog","person","run","sport","sprint"],"isBrand":false},{"name":"rupee-sign","unicode":"f156","searchTerms":["currency","indian","inr","money"],"isBrand":false},{"name":"rust","unicode":"e07a","searchTerms":[],"isBrand":true},{"name":"sad-cry","unicode":"f5b3","searchTerms":["emoticon","face","tear","tears"],"isBrand":false},{"name":"sad-tear","unicode":"f5b4","searchTerms":["emoticon","face","tear","tears"],"isBrand":false},{"name":"safari","unicode":"f267","searchTerms":["browser"],"isBrand":true},{"name":"salesforce","unicode":"f83b","searchTerms":[],"isBrand":true},{"name":"sass","unicode":"f41e","searchTerms":[],"isBrand":true},{"name":"satellite","unicode":"f7bf","searchTerms":["communications","hardware","orbit","space"],"isBrand":false},{"name":"satellite-dish","unicode":"f7c0","searchTerms":["SETI","communications","hardware","receiver","saucer","signal","space"],"isBrand":false},{"name":"save","unicode":"f0c7","searchTerms":["disk","download","floppy","floppy-o"],"isBrand":false},{"name":"schlix","unicode":"f3ea","searchTerms":[],"isBrand":true},{"name":"school","unicode":"f549","searchTerms":["building","education","learn","student","teacher"],"isBrand":false},{"name":"screwdriver","unicode":"f54a","searchTerms":["admin","fix","mechanic","repair","settings","tool"],"isBrand":false},{"name":"scribd","unicode":"f28a","searchTerms":[],"isBrand":true},{"name":"scroll","unicode":"f70e","searchTerms":["Dungeons & Dragons","announcement","d&d","dnd","fantasy","paper","script"],"isBrand":false},{"name":"sd-card","unicode":"f7c2","searchTerms":["image","memory","photo","save"],"isBrand":false},{"name":"search","unicode":"f002","searchTerms":["bigger","enlarge","find","magnify","preview","zoom"],"isBrand":false},{"name":"search-dollar","unicode":"f688","searchTerms":["bigger","enlarge","find","magnify","money","preview","zoom"],"isBrand":false},{"name":"search-location","unicode":"f689","searchTerms":["bigger","enlarge","find","magnify","preview","zoom"],"isBrand":false},{"name":"search-minus","unicode":"f010","searchTerms":["minify","negative","smaller","zoom","zoom out"],"isBrand":false},{"name":"search-plus","unicode":"f00e","searchTerms":["bigger","enlarge","magnify","positive","zoom","zoom in"],"isBrand":false},{"name":"searchengin","unicode":"f3eb","searchTerms":[],"isBrand":true},{"name":"seedling","unicode":"f4d8","searchTerms":["flora","grow","plant","vegan"],"isBrand":false},{"name":"sellcast","unicode":"f2da","searchTerms":["eercast"],"isBrand":true},{"name":"sellsy","unicode":"f213","searchTerms":[],"isBrand":true},{"name":"server","unicode":"f233","searchTerms":["computer","cpu","database","hardware","network"],"isBrand":false},{"name":"servicestack","unicode":"f3ec","searchTerms":[],"isBrand":true},{"name":"shapes","unicode":"f61f","searchTerms":["blocks","build","circle","square","triangle"],"isBrand":false},{"name":"share","unicode":"f064","searchTerms":["forward","save","send","social"],"isBrand":false},{"name":"share-alt","unicode":"f1e0","searchTerms":["forward","save","send","social"],"isBrand":false},{"name":"share-alt-square","unicode":"f1e1","searchTerms":["forward","save","send","social"],"isBrand":false},{"name":"share-square","unicode":"f14d","searchTerms":["forward","save","send","social"],"isBrand":false},{"name":"shekel-sign","unicode":"f20b","searchTerms":["currency","ils","money"],"isBrand":false},{"name":"shield-alt","unicode":"f3ed","searchTerms":["achievement","award","block","defend","security","winner"],"isBrand":false},{"name":"shield-virus","unicode":"e06c","searchTerms":["antibodies","barrier","covid-19","health","protect"],"isBrand":false},{"name":"ship","unicode":"f21a","searchTerms":["boat","sea","water"],"isBrand":false},{"name":"shipping-fast","unicode":"f48b","searchTerms":["express","fedex","mail","overnight","package","ups"],"isBrand":false},{"name":"shirtsinbulk","unicode":"f214","searchTerms":[],"isBrand":true},{"name":"shoe-prints","unicode":"f54b","searchTerms":["feet","footprints","steps","walk"],"isBrand":false},{"name":"shopify","unicode":"e057","searchTerms":[],"isBrand":true},{"name":"shopping-bag","unicode":"f290","searchTerms":["buy","checkout","grocery","payment","purchase"],"isBrand":false},{"name":"shopping-basket","unicode":"f291","searchTerms":["buy","checkout","grocery","payment","purchase"],"isBrand":false},{"name":"shopping-cart","unicode":"f07a","searchTerms":["buy","checkout","grocery","payment","purchase"],"isBrand":false},{"name":"shopware","unicode":"f5b5","searchTerms":[],"isBrand":true},{"name":"shower","unicode":"f2cc","searchTerms":["bath","clean","faucet","water"],"isBrand":false},{"name":"shuttle-van","unicode":"f5b6","searchTerms":["airport","machine","public-transportation","transportation","travel","vehicle"],"isBrand":false},{"name":"sign","unicode":"f4d9","searchTerms":["directions","real estate","signage","wayfinding"],"isBrand":false},{"name":"sign-in-alt","unicode":"f2f6","searchTerms":["arrow","enter","join","log in","login","sign in","sign up","sign-in","signin","signup"],"isBrand":false},{"name":"sign-language","unicode":"f2a7","searchTerms":["Translate","asl","deaf","hands"],"isBrand":false},{"name":"sign-out-alt","unicode":"f2f5","searchTerms":["arrow","exit","leave","log out","logout","sign-out"],"isBrand":false},{"name":"signal","unicode":"f012","searchTerms":["bars","graph","online","reception","status"],"isBrand":false},{"name":"signature","unicode":"f5b7","searchTerms":["John Hancock","cursive","name","writing"],"isBrand":false},{"name":"sim-card","unicode":"f7c4","searchTerms":["hard drive","hardware","portable","storage","technology","tiny"],"isBrand":false},{"name":"simplybuilt","unicode":"f215","searchTerms":[],"isBrand":true},{"name":"sink","unicode":"e06d","searchTerms":["bathroom","covid-19","faucet","kitchen","wash"],"isBrand":false},{"name":"sistrix","unicode":"f3ee","searchTerms":[],"isBrand":true},{"name":"sitemap","unicode":"f0e8","searchTerms":["directory","hierarchy","ia","information architecture","organization"],"isBrand":false},{"name":"sith","unicode":"f512","searchTerms":[],"isBrand":true},{"name":"skating","unicode":"f7c5","searchTerms":["activity","figure skating","fitness","ice","person","winter"],"isBrand":false},{"name":"sketch","unicode":"f7c6","searchTerms":["app","design","interface"],"isBrand":true},{"name":"skiing","unicode":"f7c9","searchTerms":["activity","downhill","fast","fitness","olympics","outdoors","person","seasonal","slalom"],"isBrand":false},{"name":"skiing-nordic","unicode":"f7ca","searchTerms":["activity","cross country","fitness","outdoors","person","seasonal"],"isBrand":false},{"name":"skull","unicode":"f54c","searchTerms":["bones","skeleton","x-ray","yorick"],"isBrand":false},{"name":"skull-crossbones","unicode":"f714","searchTerms":["Dungeons & Dragons","alert","bones","d&d","danger","dead","deadly","death","dnd","fantasy","halloween","holiday","jolly-roger","pirate","poison","skeleton","warning"],"isBrand":false},{"name":"skyatlas","unicode":"f216","searchTerms":[],"isBrand":true},{"name":"skype","unicode":"f17e","searchTerms":[],"isBrand":true},{"name":"slack","unicode":"f198","searchTerms":["anchor","hash","hashtag"],"isBrand":true},{"name":"slack-hash","unicode":"f3ef","searchTerms":["anchor","hash","hashtag"],"isBrand":true},{"name":"slash","unicode":"f715","searchTerms":["cancel","close","mute","off","stop","x"],"isBrand":false},{"name":"sleigh","unicode":"f7cc","searchTerms":["christmas","claus","fly","holiday","santa","sled","snow","xmas"],"isBrand":false},{"name":"sliders-h","unicode":"f1de","searchTerms":["adjust","settings","sliders","toggle"],"isBrand":false},{"name":"slideshare","unicode":"f1e7","searchTerms":[],"isBrand":true},{"name":"smile","unicode":"f118","searchTerms":["approve","emoticon","face","happy","rating","satisfied"],"isBrand":false},{"name":"smile-beam","unicode":"f5b8","searchTerms":["emoticon","face","happy","positive"],"isBrand":false},{"name":"smile-wink","unicode":"f4da","searchTerms":["emoticon","face","happy","hint","joke"],"isBrand":false},{"name":"smog","unicode":"f75f","searchTerms":["dragon","fog","haze","pollution","smoke","weather"],"isBrand":false},{"name":"smoking","unicode":"f48d","searchTerms":["cancer","cigarette","nicotine","smoking status","tobacco"],"isBrand":false},{"name":"smoking-ban","unicode":"f54d","searchTerms":["ban","cancel","no smoking","non-smoking"],"isBrand":false},{"name":"sms","unicode":"f7cd","searchTerms":["chat","conversation","message","mobile","notification","phone","sms","texting"],"isBrand":false},{"name":"snapchat","unicode":"f2ab","searchTerms":[],"isBrand":true},{"name":"snapchat-ghost","unicode":"f2ac","searchTerms":[],"isBrand":true},{"name":"snapchat-square","unicode":"f2ad","searchTerms":[],"isBrand":true},{"name":"snowboarding","unicode":"f7ce","searchTerms":["activity","fitness","olympics","outdoors","person"],"isBrand":false},{"name":"snowflake","unicode":"f2dc","searchTerms":["precipitation","rain","winter"],"isBrand":false},{"name":"snowman","unicode":"f7d0","searchTerms":["decoration","frost","frosty","holiday"],"isBrand":false},{"name":"snowplow","unicode":"f7d2","searchTerms":["clean up","cold","road","storm","winter"],"isBrand":false},{"name":"soap","unicode":"e06e","searchTerms":["bubbles","clean","covid-19","hygiene","wash"],"isBrand":false},{"name":"socks","unicode":"f696","searchTerms":["business socks","business time","clothing","feet","flight of the conchords","wednesday"],"isBrand":false},{"name":"solar-panel","unicode":"f5ba","searchTerms":["clean","eco-friendly","energy","green","sun"],"isBrand":false},{"name":"sort","unicode":"f0dc","searchTerms":["filter","order"],"isBrand":false},{"name":"sort-alpha-down","unicode":"f15d","searchTerms":["alphabetical","arrange","filter","order","sort-alpha-asc"],"isBrand":false},{"name":"sort-alpha-down-alt","unicode":"f881","searchTerms":["alphabetical","arrange","filter","order","sort-alpha-asc"],"isBrand":false},{"name":"sort-alpha-up","unicode":"f15e","searchTerms":["alphabetical","arrange","filter","order","sort-alpha-desc"],"isBrand":false},{"name":"sort-alpha-up-alt","unicode":"f882","searchTerms":["alphabetical","arrange","filter","order","sort-alpha-desc"],"isBrand":false},{"name":"sort-amount-down","unicode":"f160","searchTerms":["arrange","filter","number","order","sort-amount-asc"],"isBrand":false},{"name":"sort-amount-down-alt","unicode":"f884","searchTerms":["arrange","filter","order","sort-amount-asc"],"isBrand":false},{"name":"sort-amount-up","unicode":"f161","searchTerms":["arrange","filter","order","sort-amount-desc"],"isBrand":false},{"name":"sort-amount-up-alt","unicode":"f885","searchTerms":["arrange","filter","order","sort-amount-desc"],"isBrand":false},{"name":"sort-down","unicode":"f0dd","searchTerms":["arrow","descending","filter","order","sort-desc"],"isBrand":false},{"name":"sort-numeric-down","unicode":"f162","searchTerms":["arrange","filter","numbers","order","sort-numeric-asc"],"isBrand":false},{"name":"sort-numeric-down-alt","unicode":"f886","searchTerms":["arrange","filter","numbers","order","sort-numeric-asc"],"isBrand":false},{"name":"sort-numeric-up","unicode":"f163","searchTerms":["arrange","filter","numbers","order","sort-numeric-desc"],"isBrand":false},{"name":"sort-numeric-up-alt","unicode":"f887","searchTerms":["arrange","filter","numbers","order","sort-numeric-desc"],"isBrand":false},{"name":"sort-up","unicode":"f0de","searchTerms":["arrow","ascending","filter","order","sort-asc"],"isBrand":false},{"name":"soundcloud","unicode":"f1be","searchTerms":[],"isBrand":true},{"name":"sourcetree","unicode":"f7d3","searchTerms":[],"isBrand":true},{"name":"spa","unicode":"f5bb","searchTerms":["flora","massage","mindfulness","plant","wellness"],"isBrand":false},{"name":"space-shuttle","unicode":"f197","searchTerms":["astronaut","machine","nasa","rocket","space","transportation"],"isBrand":false},{"name":"speakap","unicode":"f3f3","searchTerms":[],"isBrand":true},{"name":"speaker-deck","unicode":"f83c","searchTerms":[],"isBrand":true},{"name":"spell-check","unicode":"f891","searchTerms":["dictionary","edit","editor","grammar","text"],"isBrand":false},{"name":"spider","unicode":"f717","searchTerms":["arachnid","bug","charlotte","crawl","eight","halloween"],"isBrand":false},{"name":"spinner","unicode":"f110","searchTerms":["circle","loading","progress"],"isBrand":false},{"name":"splotch","unicode":"f5bc","searchTerms":["Ink","blob","blotch","glob","stain"],"isBrand":false},{"name":"spotify","unicode":"f1bc","searchTerms":[],"isBrand":true},{"name":"spray-can","unicode":"f5bd","searchTerms":["Paint","aerosol","design","graffiti","tag"],"isBrand":false},{"name":"square","unicode":"f0c8","searchTerms":["block","box","shape"],"isBrand":false},{"name":"square-full","unicode":"f45c","searchTerms":["block","box","shape"],"isBrand":false},{"name":"square-root-alt","unicode":"f698","searchTerms":["arithmetic","calculus","division","math"],"isBrand":false},{"name":"squarespace","unicode":"f5be","searchTerms":[],"isBrand":true},{"name":"stack-exchange","unicode":"f18d","searchTerms":[],"isBrand":true},{"name":"stack-overflow","unicode":"f16c","searchTerms":[],"isBrand":true},{"name":"stackpath","unicode":"f842","searchTerms":[],"isBrand":true},{"name":"stamp","unicode":"f5bf","searchTerms":["art","certificate","imprint","rubber","seal"],"isBrand":false},{"name":"star","unicode":"f005","searchTerms":["achievement","award","favorite","important","night","rating","score"],"isBrand":false},{"name":"star-and-crescent","unicode":"f699","searchTerms":["islam","muslim","religion"],"isBrand":false},{"name":"star-half","unicode":"f089","searchTerms":["achievement","award","rating","score","star-half-empty","star-half-full"],"isBrand":false},{"name":"star-half-alt","unicode":"f5c0","searchTerms":["achievement","award","rating","score","star-half-empty","star-half-full"],"isBrand":false},{"name":"star-of-david","unicode":"f69a","searchTerms":["jewish","judaism","religion"],"isBrand":false},{"name":"star-of-life","unicode":"f621","searchTerms":["doctor","emt","first aid","health","medical"],"isBrand":false},{"name":"staylinked","unicode":"f3f5","searchTerms":[],"isBrand":true},{"name":"steam","unicode":"f1b6","searchTerms":[],"isBrand":true},{"name":"steam-square","unicode":"f1b7","searchTerms":[],"isBrand":true},{"name":"steam-symbol","unicode":"f3f6","searchTerms":[],"isBrand":true},{"name":"step-backward","unicode":"f048","searchTerms":["beginning","first","previous","rewind","start"],"isBrand":false},{"name":"step-forward","unicode":"f051","searchTerms":["end","last","next"],"isBrand":false},{"name":"stethoscope","unicode":"f0f1","searchTerms":["covid-19","diagnosis","doctor","general practitioner","hospital","infirmary","medicine","office","outpatient"],"isBrand":false},{"name":"sticker-mule","unicode":"f3f7","searchTerms":[],"isBrand":true},{"name":"sticky-note","unicode":"f249","searchTerms":["message","note","paper","reminder","sticker"],"isBrand":false},{"name":"stop","unicode":"f04d","searchTerms":["block","box","square"],"isBrand":false},{"name":"stop-circle","unicode":"f28d","searchTerms":["block","box","circle","square"],"isBrand":false},{"name":"stopwatch","unicode":"f2f2","searchTerms":["clock","reminder","time"],"isBrand":false},{"name":"stopwatch-20","unicode":"e06f","searchTerms":["ABCs","countdown","covid-19","happy birthday","i will survive","reminder","seconds","time","timer"],"isBrand":false},{"name":"store","unicode":"f54e","searchTerms":["building","buy","purchase","shopping"],"isBrand":false},{"name":"store-alt","unicode":"f54f","searchTerms":["building","buy","purchase","shopping"],"isBrand":false},{"name":"store-alt-slash","unicode":"e070","searchTerms":["building","buy","closed","covid-19","purchase","shopping"],"isBrand":false},{"name":"store-slash","unicode":"e071","searchTerms":["building","buy","closed","covid-19","purchase","shopping"],"isBrand":false},{"name":"strava","unicode":"f428","searchTerms":[],"isBrand":true},{"name":"stream","unicode":"f550","searchTerms":["flow","list","timeline"],"isBrand":false},{"name":"street-view","unicode":"f21d","searchTerms":["directions","location","map","navigation"],"isBrand":false},{"name":"strikethrough","unicode":"f0cc","searchTerms":["cancel","edit","font","format","text","type"],"isBrand":false},{"name":"stripe","unicode":"f429","searchTerms":[],"isBrand":true},{"name":"stripe-s","unicode":"f42a","searchTerms":[],"isBrand":true},{"name":"stroopwafel","unicode":"f551","searchTerms":["caramel","cookie","dessert","sweets","waffle"],"isBrand":false},{"name":"studiovinari","unicode":"f3f8","searchTerms":[],"isBrand":true},{"name":"stumbleupon","unicode":"f1a4","searchTerms":[],"isBrand":true},{"name":"stumbleupon-circle","unicode":"f1a3","searchTerms":[],"isBrand":true},{"name":"subscript","unicode":"f12c","searchTerms":["edit","font","format","text","type"],"isBrand":false},{"name":"subway","unicode":"f239","searchTerms":["machine","railway","train","transportation","vehicle"],"isBrand":false},{"name":"suitcase","unicode":"f0f2","searchTerms":["baggage","luggage","move","suitcase","travel","trip"],"isBrand":false},{"name":"suitcase-rolling","unicode":"f5c1","searchTerms":["baggage","luggage","move","suitcase","travel","trip"],"isBrand":false},{"name":"sun","unicode":"f185","searchTerms":["brighten","contrast","day","lighter","sol","solar","star","weather"],"isBrand":false},{"name":"superpowers","unicode":"f2dd","searchTerms":[],"isBrand":true},{"name":"superscript","unicode":"f12b","searchTerms":["edit","exponential","font","format","text","type"],"isBrand":false},{"name":"supple","unicode":"f3f9","searchTerms":[],"isBrand":true},{"name":"surprise","unicode":"f5c2","searchTerms":["emoticon","face","shocked"],"isBrand":false},{"name":"suse","unicode":"f7d6","searchTerms":["linux","operating system","os"],"isBrand":true},{"name":"swatchbook","unicode":"f5c3","searchTerms":["Pantone","color","design","hue","palette"],"isBrand":false},{"name":"swift","unicode":"f8e1","searchTerms":[],"isBrand":true},{"name":"swimmer","unicode":"f5c4","searchTerms":["athlete","head","man","olympics","person","pool","water"],"isBrand":false},{"name":"swimming-pool","unicode":"f5c5","searchTerms":["ladder","recreation","swim","water"],"isBrand":false},{"name":"symfony","unicode":"f83d","searchTerms":[],"isBrand":true},{"name":"synagogue","unicode":"f69b","searchTerms":["building","jewish","judaism","religion","star of david","temple"],"isBrand":false},{"name":"sync","unicode":"f021","searchTerms":["exchange","refresh","reload","rotate","swap"],"isBrand":false},{"name":"sync-alt","unicode":"f2f1","searchTerms":["exchange","refresh","reload","rotate","swap"],"isBrand":false},{"name":"syringe","unicode":"f48e","searchTerms":["covid-19","doctor","immunizations","medical","needle"],"isBrand":false},{"name":"table","unicode":"f0ce","searchTerms":["data","excel","spreadsheet"],"isBrand":false},{"name":"table-tennis","unicode":"f45d","searchTerms":["ball","paddle","ping pong"],"isBrand":false},{"name":"tablet","unicode":"f10a","searchTerms":["apple","device","ipad","kindle","screen"],"isBrand":false},{"name":"tablet-alt","unicode":"f3fa","searchTerms":["apple","device","ipad","kindle","screen"],"isBrand":false},{"name":"tablets","unicode":"f490","searchTerms":["drugs","medicine","pills","prescription"],"isBrand":false},{"name":"tachometer-alt","unicode":"f3fd","searchTerms":["dashboard","fast","odometer","speed","speedometer"],"isBrand":false},{"name":"tag","unicode":"f02b","searchTerms":["discount","label","price","shopping"],"isBrand":false},{"name":"tags","unicode":"f02c","searchTerms":["discount","label","price","shopping"],"isBrand":false},{"name":"tape","unicode":"f4db","searchTerms":["design","package","sticky"],"isBrand":false},{"name":"tasks","unicode":"f0ae","searchTerms":["checklist","downloading","downloads","loading","progress","project management","settings","to do"],"isBrand":false},{"name":"taxi","unicode":"f1ba","searchTerms":["cab","cabbie","car","car service","lyft","machine","transportation","travel","uber","vehicle"],"isBrand":false},{"name":"teamspeak","unicode":"f4f9","searchTerms":[],"isBrand":true},{"name":"teeth","unicode":"f62e","searchTerms":["bite","dental","dentist","gums","mouth","smile","tooth"],"isBrand":false},{"name":"teeth-open","unicode":"f62f","searchTerms":["dental","dentist","gums bite","mouth","smile","tooth"],"isBrand":false},{"name":"telegram","unicode":"f2c6","searchTerms":[],"isBrand":true},{"name":"telegram-plane","unicode":"f3fe","searchTerms":[],"isBrand":true},{"name":"temperature-high","unicode":"f769","searchTerms":["cook","covid-19","mercury","summer","thermometer","warm"],"isBrand":false},{"name":"temperature-low","unicode":"f76b","searchTerms":["cold","cool","covid-19","mercury","thermometer","winter"],"isBrand":false},{"name":"tencent-weibo","unicode":"f1d5","searchTerms":[],"isBrand":true},{"name":"tenge","unicode":"f7d7","searchTerms":["currency","kazakhstan","money","price"],"isBrand":false},{"name":"terminal","unicode":"f120","searchTerms":["code","command","console","development","prompt"],"isBrand":false},{"name":"text-height","unicode":"f034","searchTerms":["edit","font","format","text","type"],"isBrand":false},{"name":"text-width","unicode":"f035","searchTerms":["edit","font","format","text","type"],"isBrand":false},{"name":"th","unicode":"f00a","searchTerms":["blocks","boxes","grid","squares"],"isBrand":false},{"name":"th-large","unicode":"f009","searchTerms":["blocks","boxes","grid","squares"],"isBrand":false},{"name":"th-list","unicode":"f00b","searchTerms":["checklist","completed","done","finished","ol","todo","ul"],"isBrand":false},{"name":"the-red-yeti","unicode":"f69d","searchTerms":[],"isBrand":true},{"name":"theater-masks","unicode":"f630","searchTerms":["comedy","perform","theatre","tragedy"],"isBrand":false},{"name":"themeco","unicode":"f5c6","searchTerms":[],"isBrand":true},{"name":"themeisle","unicode":"f2b2","searchTerms":[],"isBrand":true},{"name":"thermometer","unicode":"f491","searchTerms":["covid-19","mercury","status","temperature"],"isBrand":false},{"name":"thermometer-empty","unicode":"f2cb","searchTerms":["cold","mercury","status","temperature"],"isBrand":false},{"name":"thermometer-full","unicode":"f2c7","searchTerms":["fever","hot","mercury","status","temperature"],"isBrand":false},{"name":"thermometer-half","unicode":"f2c9","searchTerms":["mercury","status","temperature"],"isBrand":false},{"name":"thermometer-quarter","unicode":"f2ca","searchTerms":["mercury","status","temperature"],"isBrand":false},{"name":"thermometer-three-quarters","unicode":"f2c8","searchTerms":["mercury","status","temperature"],"isBrand":false},{"name":"think-peaks","unicode":"f731","searchTerms":[],"isBrand":true},{"name":"thumbs-down","unicode":"f165","searchTerms":["disagree","disapprove","dislike","hand","social","thumbs-o-down"],"isBrand":false},{"name":"thumbs-up","unicode":"f164","searchTerms":["agree","approve","favorite","hand","like","ok","okay","social","success","thumbs-o-up","yes","you got it dude"],"isBrand":false},{"name":"thumbtack","unicode":"f08d","searchTerms":["coordinates","location","marker","pin","thumb-tack"],"isBrand":false},{"name":"ticket-alt","unicode":"f3ff","searchTerms":["movie","pass","support","ticket"],"isBrand":false},{"name":"tiktok","unicode":"e07b","searchTerms":[],"isBrand":true},{"name":"times","unicode":"f00d","searchTerms":["close","cross","error","exit","incorrect","notice","notification","notify","problem","wrong","x"],"isBrand":false},{"name":"times-circle","unicode":"f057","searchTerms":["close","cross","exit","incorrect","notice","notification","notify","problem","wrong","x"],"isBrand":false},{"name":"tint","unicode":"f043","searchTerms":["color","drop","droplet","raindrop","waterdrop"],"isBrand":false},{"name":"tint-slash","unicode":"f5c7","searchTerms":["color","drop","droplet","raindrop","waterdrop"],"isBrand":false},{"name":"tired","unicode":"f5c8","searchTerms":["angry","emoticon","face","grumpy","upset"],"isBrand":false},{"name":"toggle-off","unicode":"f204","searchTerms":["switch"],"isBrand":false},{"name":"toggle-on","unicode":"f205","searchTerms":["switch"],"isBrand":false},{"name":"toilet","unicode":"f7d8","searchTerms":["bathroom","flush","john","loo","pee","plumbing","poop","porcelain","potty","restroom","throne","washroom","waste","wc"],"isBrand":false},{"name":"toilet-paper","unicode":"f71e","searchTerms":["bathroom","covid-19","halloween","holiday","lavatory","prank","restroom","roll"],"isBrand":false},{"name":"toilet-paper-slash","unicode":"e072","searchTerms":["bathroom","covid-19","halloween","holiday","lavatory","leaves","prank","restroom","roll","trouble","ut oh"],"isBrand":false},{"name":"toolbox","unicode":"f552","searchTerms":["admin","container","fix","repair","settings","tools"],"isBrand":false},{"name":"tools","unicode":"f7d9","searchTerms":["admin","fix","repair","screwdriver","settings","tools","wrench"],"isBrand":false},{"name":"tooth","unicode":"f5c9","searchTerms":["bicuspid","dental","dentist","molar","mouth","teeth"],"isBrand":false},{"name":"torah","unicode":"f6a0","searchTerms":["book","jewish","judaism","religion","scroll"],"isBrand":false},{"name":"torii-gate","unicode":"f6a1","searchTerms":["building","shintoism"],"isBrand":false},{"name":"tractor","unicode":"f722","searchTerms":["agriculture","farm","vehicle"],"isBrand":false},{"name":"trade-federation","unicode":"f513","searchTerms":[],"isBrand":true},{"name":"trademark","unicode":"f25c","searchTerms":["copyright","register","symbol"],"isBrand":false},{"name":"traffic-light","unicode":"f637","searchTerms":["direction","road","signal","travel"],"isBrand":false},{"name":"trailer","unicode":"e041","searchTerms":["carry","haul","moving","travel"],"isBrand":false},{"name":"train","unicode":"f238","searchTerms":["bullet","commute","locomotive","railway","subway"],"isBrand":false},{"name":"tram","unicode":"f7da","searchTerms":["crossing","machine","mountains","seasonal","transportation"],"isBrand":false},{"name":"transgender","unicode":"f224","searchTerms":["intersex"],"isBrand":false},{"name":"transgender-alt","unicode":"f225","searchTerms":["intersex"],"isBrand":false},{"name":"trash","unicode":"f1f8","searchTerms":["delete","garbage","hide","remove"],"isBrand":false},{"name":"trash-alt","unicode":"f2ed","searchTerms":["delete","garbage","hide","remove","trash-o"],"isBrand":false},{"name":"trash-restore","unicode":"f829","searchTerms":["back","control z","oops","undo"],"isBrand":false},{"name":"trash-restore-alt","unicode":"f82a","searchTerms":["back","control z","oops","undo"],"isBrand":false},{"name":"tree","unicode":"f1bb","searchTerms":["bark","fall","flora","forest","nature","plant","seasonal"],"isBrand":false},{"name":"trello","unicode":"f181","searchTerms":["atlassian"],"isBrand":true},{"name":"trophy","unicode":"f091","searchTerms":["achievement","award","cup","game","winner"],"isBrand":false},{"name":"truck","unicode":"f0d1","searchTerms":["cargo","delivery","shipping","vehicle"],"isBrand":false},{"name":"truck-loading","unicode":"f4de","searchTerms":["box","cargo","delivery","inventory","moving","rental","vehicle"],"isBrand":false},{"name":"truck-monster","unicode":"f63b","searchTerms":["offroad","vehicle","wheel"],"isBrand":false},{"name":"truck-moving","unicode":"f4df","searchTerms":["cargo","inventory","rental","vehicle"],"isBrand":false},{"name":"truck-pickup","unicode":"f63c","searchTerms":["cargo","vehicle"],"isBrand":false},{"name":"tshirt","unicode":"f553","searchTerms":["clothing","fashion","garment","shirt"],"isBrand":false},{"name":"tty","unicode":"f1e4","searchTerms":["communication","deaf","telephone","teletypewriter","text"],"isBrand":false},{"name":"tumblr","unicode":"f173","searchTerms":[],"isBrand":true},{"name":"tumblr-square","unicode":"f174","searchTerms":[],"isBrand":true},{"name":"tv","unicode":"f26c","searchTerms":["computer","display","monitor","television"],"isBrand":false},{"name":"twitch","unicode":"f1e8","searchTerms":[],"isBrand":true},{"name":"twitter","unicode":"f099","searchTerms":["social network","tweet"],"isBrand":true},{"name":"twitter-square","unicode":"f081","searchTerms":["social network","tweet"],"isBrand":true},{"name":"typo3","unicode":"f42b","searchTerms":[],"isBrand":true},{"name":"uber","unicode":"f402","searchTerms":[],"isBrand":true},{"name":"ubuntu","unicode":"f7df","searchTerms":["linux","operating system","os"],"isBrand":true},{"name":"uikit","unicode":"f403","searchTerms":[],"isBrand":true},{"name":"umbraco","unicode":"f8e8","searchTerms":[],"isBrand":true},{"name":"umbrella","unicode":"f0e9","searchTerms":["protection","rain","storm","wet"],"isBrand":false},{"name":"umbrella-beach","unicode":"f5ca","searchTerms":["protection","recreation","sand","shade","summer","sun"],"isBrand":false},{"name":"uncharted","unicode":"e084","searchTerms":[],"isBrand":true},{"name":"underline","unicode":"f0cd","searchTerms":["edit","emphasis","format","text","writing"],"isBrand":false},{"name":"undo","unicode":"f0e2","searchTerms":["back","control z","exchange","oops","return","rotate","swap"],"isBrand":false},{"name":"undo-alt","unicode":"f2ea","searchTerms":["back","control z","exchange","oops","return","swap"],"isBrand":false},{"name":"uniregistry","unicode":"f404","searchTerms":[],"isBrand":true},{"name":"unity","unicode":"e049","searchTerms":[],"isBrand":true},{"name":"universal-access","unicode":"f29a","searchTerms":["accessibility","hearing","person","seeing","visual impairment"],"isBrand":false},{"name":"university","unicode":"f19c","searchTerms":["bank","building","college","higher education - students","institution"],"isBrand":false},{"name":"unlink","unicode":"f127","searchTerms":["attachment","chain","chain-broken","remove"],"isBrand":false},{"name":"unlock","unicode":"f09c","searchTerms":["admin","lock","password","private","protect"],"isBrand":false},{"name":"unlock-alt","unicode":"f13e","searchTerms":["admin","lock","password","private","protect"],"isBrand":false},{"name":"unsplash","unicode":"e07c","searchTerms":[],"isBrand":true},{"name":"untappd","unicode":"f405","searchTerms":[],"isBrand":true},{"name":"upload","unicode":"f093","searchTerms":["hard drive","import","publish"],"isBrand":false},{"name":"ups","unicode":"f7e0","searchTerms":["United Parcel Service","package","shipping"],"isBrand":true},{"name":"usb","unicode":"f287","searchTerms":[],"isBrand":true},{"name":"user","unicode":"f007","searchTerms":["account","avatar","head","human","man","person","profile"],"isBrand":false},{"name":"user-alt","unicode":"f406","searchTerms":["account","avatar","head","human","man","person","profile"],"isBrand":false},{"name":"user-alt-slash","unicode":"f4fa","searchTerms":["account","avatar","head","human","man","person","profile"],"isBrand":false},{"name":"user-astronaut","unicode":"f4fb","searchTerms":["avatar","clothing","cosmonaut","nasa","space","suit"],"isBrand":false},{"name":"user-check","unicode":"f4fc","searchTerms":["accept","check","person","verified"],"isBrand":false},{"name":"user-circle","unicode":"f2bd","searchTerms":["account","avatar","head","human","man","person","profile"],"isBrand":false},{"name":"user-clock","unicode":"f4fd","searchTerms":["alert","person","remind","time"],"isBrand":false},{"name":"user-cog","unicode":"f4fe","searchTerms":["admin","cog","person","settings"],"isBrand":false},{"name":"user-edit","unicode":"f4ff","searchTerms":["edit","pen","pencil","person","update","write"],"isBrand":false},{"name":"user-friends","unicode":"f500","searchTerms":["group","people","person","team","users"],"isBrand":false},{"name":"user-graduate","unicode":"f501","searchTerms":["cap","clothing","commencement","gown","graduation","person","student"],"isBrand":false},{"name":"user-injured","unicode":"f728","searchTerms":["cast","injury","ouch","patient","person","sling"],"isBrand":false},{"name":"user-lock","unicode":"f502","searchTerms":["admin","lock","person","private","unlock"],"isBrand":false},{"name":"user-md","unicode":"f0f0","searchTerms":["covid-19","job","medical","nurse","occupation","physician","profile","surgeon"],"isBrand":false},{"name":"user-minus","unicode":"f503","searchTerms":["delete","negative","remove"],"isBrand":false},{"name":"user-ninja","unicode":"f504","searchTerms":["assassin","avatar","dangerous","deadly","sneaky"],"isBrand":false},{"name":"user-nurse","unicode":"f82f","searchTerms":["covid-19","doctor","midwife","practitioner","surgeon"],"isBrand":false},{"name":"user-plus","unicode":"f234","searchTerms":["add","avatar","positive","sign up","signup","team"],"isBrand":false},{"name":"user-secret","unicode":"f21b","searchTerms":["clothing","coat","hat","incognito","person","privacy","spy","whisper"],"isBrand":false},{"name":"user-shield","unicode":"f505","searchTerms":["admin","person","private","protect","safe"],"isBrand":false},{"name":"user-slash","unicode":"f506","searchTerms":["ban","delete","remove"],"isBrand":false},{"name":"user-tag","unicode":"f507","searchTerms":["avatar","discount","label","person","role","special"],"isBrand":false},{"name":"user-tie","unicode":"f508","searchTerms":["avatar","business","clothing","formal","professional","suit"],"isBrand":false},{"name":"user-times","unicode":"f235","searchTerms":["archive","delete","remove","x"],"isBrand":false},{"name":"users","unicode":"f0c0","searchTerms":["friends","group","people","persons","profiles","team"],"isBrand":false},{"name":"users-cog","unicode":"f509","searchTerms":["admin","cog","group","person","settings","team"],"isBrand":false},{"name":"users-slash","unicode":"e073","searchTerms":["disband","friends","group","people","persons","profiles","separate","team","ungroup"],"isBrand":false},{"name":"usps","unicode":"f7e1","searchTerms":["american","package","shipping","usa"],"isBrand":true},{"name":"ussunnah","unicode":"f407","searchTerms":[],"isBrand":true},{"name":"utensil-spoon","unicode":"f2e5","searchTerms":["cutlery","dining","scoop","silverware","spoon"],"isBrand":false},{"name":"utensils","unicode":"f2e7","searchTerms":["cutlery","dining","dinner","eat","food","fork","knife","restaurant"],"isBrand":false},{"name":"vaadin","unicode":"f408","searchTerms":[],"isBrand":true},{"name":"vector-square","unicode":"f5cb","searchTerms":["anchors","lines","object","render","shape"],"isBrand":false},{"name":"venus","unicode":"f221","searchTerms":["female"],"isBrand":false},{"name":"venus-double","unicode":"f226","searchTerms":["female"],"isBrand":false},{"name":"venus-mars","unicode":"f228","searchTerms":["Gender"],"isBrand":false},{"name":"vest","unicode":"e085","searchTerms":["biker","fashion","style"],"isBrand":false},{"name":"vest-patches","unicode":"e086","searchTerms":["biker","fashion","style"],"isBrand":false},{"name":"viacoin","unicode":"f237","searchTerms":[],"isBrand":true},{"name":"viadeo","unicode":"f2a9","searchTerms":[],"isBrand":true},{"name":"viadeo-square","unicode":"f2aa","searchTerms":[],"isBrand":true},{"name":"vial","unicode":"f492","searchTerms":["experiment","lab","sample","science","test","test tube"],"isBrand":false},{"name":"vials","unicode":"f493","searchTerms":["experiment","lab","sample","science","test","test tube"],"isBrand":false},{"name":"viber","unicode":"f409","searchTerms":[],"isBrand":true},{"name":"video","unicode":"f03d","searchTerms":["camera","film","movie","record","video-camera"],"isBrand":false},{"name":"video-slash","unicode":"f4e2","searchTerms":["add","create","film","new","positive","record","video"],"isBrand":false},{"name":"vihara","unicode":"f6a7","searchTerms":["buddhism","buddhist","building","monastery"],"isBrand":false},{"name":"vimeo","unicode":"f40a","searchTerms":[],"isBrand":true},{"name":"vimeo-square","unicode":"f194","searchTerms":[],"isBrand":true},{"name":"vimeo-v","unicode":"f27d","searchTerms":["vimeo"],"isBrand":true},{"name":"vine","unicode":"f1ca","searchTerms":[],"isBrand":true},{"name":"virus","unicode":"e074","searchTerms":["bug","covid-19","flu","health","sick","viral"],"isBrand":false},{"name":"virus-slash","unicode":"e075","searchTerms":["bug","covid-19","cure","eliminate","flu","health","sick","viral"],"isBrand":false},{"name":"viruses","unicode":"e076","searchTerms":["bugs","covid-19","flu","health","multiply","sick","spread","viral"],"isBrand":false},{"name":"vk","unicode":"f189","searchTerms":[],"isBrand":true},{"name":"vnv","unicode":"f40b","searchTerms":[],"isBrand":true},{"name":"voicemail","unicode":"f897","searchTerms":["answer","inbox","message","phone"],"isBrand":false},{"name":"volleyball-ball","unicode":"f45f","searchTerms":["beach","olympics","sport"],"isBrand":false},{"name":"volume-down","unicode":"f027","searchTerms":["audio","lower","music","quieter","sound","speaker"],"isBrand":false},{"name":"volume-mute","unicode":"f6a9","searchTerms":["audio","music","quiet","sound","speaker"],"isBrand":false},{"name":"volume-off","unicode":"f026","searchTerms":["audio","ban","music","mute","quiet","silent","sound"],"isBrand":false},{"name":"volume-up","unicode":"f028","searchTerms":["audio","higher","louder","music","sound","speaker"],"isBrand":false},{"name":"vote-yea","unicode":"f772","searchTerms":["accept","cast","election","politics","positive","yes"],"isBrand":false},{"name":"vr-cardboard","unicode":"f729","searchTerms":["3d","augment","google","reality","virtual"],"isBrand":false},{"name":"vuejs","unicode":"f41f","searchTerms":[],"isBrand":true},{"name":"walking","unicode":"f554","searchTerms":["exercise","health","pedometer","person","steps"],"isBrand":false},{"name":"wallet","unicode":"f555","searchTerms":["billfold","cash","currency","money"],"isBrand":false},{"name":"warehouse","unicode":"f494","searchTerms":["building","capacity","garage","inventory","storage"],"isBrand":false},{"name":"watchman-monitoring","unicode":"e087","searchTerms":[],"isBrand":true},{"name":"water","unicode":"f773","searchTerms":["lake","liquid","ocean","sea","swim","wet"],"isBrand":false},{"name":"wave-square","unicode":"f83e","searchTerms":["frequency","pulse","signal"],"isBrand":false},{"name":"waze","unicode":"f83f","searchTerms":[],"isBrand":true},{"name":"weebly","unicode":"f5cc","searchTerms":[],"isBrand":true},{"name":"weibo","unicode":"f18a","searchTerms":[],"isBrand":true},{"name":"weight","unicode":"f496","searchTerms":["health","measurement","scale","weight"],"isBrand":false},{"name":"weight-hanging","unicode":"f5cd","searchTerms":["anvil","heavy","measurement"],"isBrand":false},{"name":"weixin","unicode":"f1d7","searchTerms":[],"isBrand":true},{"name":"whatsapp","unicode":"f232","searchTerms":[],"isBrand":true},{"name":"whatsapp-square","unicode":"f40c","searchTerms":[],"isBrand":true},{"name":"wheelchair","unicode":"f193","searchTerms":["accessible","handicap","person"],"isBrand":false},{"name":"whmcs","unicode":"f40d","searchTerms":[],"isBrand":true},{"name":"wifi","unicode":"f1eb","searchTerms":["connection","hotspot","internet","network","wireless"],"isBrand":false},{"name":"wikipedia-w","unicode":"f266","searchTerms":[],"isBrand":true},{"name":"wind","unicode":"f72e","searchTerms":["air","blow","breeze","fall","seasonal","weather"],"isBrand":false},{"name":"window-close","unicode":"f410","searchTerms":["browser","cancel","computer","development"],"isBrand":false},{"name":"window-maximize","unicode":"f2d0","searchTerms":["browser","computer","development","expand"],"isBrand":false},{"name":"window-minimize","unicode":"f2d1","searchTerms":["browser","collapse","computer","development"],"isBrand":false},{"name":"window-restore","unicode":"f2d2","searchTerms":["browser","computer","development"],"isBrand":false},{"name":"windows","unicode":"f17a","searchTerms":["microsoft","operating system","os"],"isBrand":true},{"name":"wine-bottle","unicode":"f72f","searchTerms":["alcohol","beverage","cabernet","drink","glass","grapes","merlot","sauvignon"],"isBrand":false},{"name":"wine-glass","unicode":"f4e3","searchTerms":["alcohol","beverage","cabernet","drink","grapes","merlot","sauvignon"],"isBrand":false},{"name":"wine-glass-alt","unicode":"f5ce","searchTerms":["alcohol","beverage","cabernet","drink","grapes","merlot","sauvignon"],"isBrand":false},{"name":"wix","unicode":"f5cf","searchTerms":[],"isBrand":true},{"name":"wizards-of-the-coast","unicode":"f730","searchTerms":["Dungeons & Dragons","d&d","dnd","fantasy","game","gaming","tabletop"],"isBrand":true},{"name":"wodu","unicode":"e088","searchTerms":[],"isBrand":true},{"name":"wolf-pack-battalion","unicode":"f514","searchTerms":[],"isBrand":true},{"name":"won-sign","unicode":"f159","searchTerms":["currency","krw","money"],"isBrand":false},{"name":"wordpress","unicode":"f19a","searchTerms":[],"isBrand":true},{"name":"wordpress-simple","unicode":"f411","searchTerms":[],"isBrand":true},{"name":"wpbeginner","unicode":"f297","searchTerms":[],"isBrand":true},{"name":"wpexplorer","unicode":"f2de","searchTerms":[],"isBrand":true},{"name":"wpforms","unicode":"f298","searchTerms":[],"isBrand":true},{"name":"wpressr","unicode":"f3e4","searchTerms":["rendact"],"isBrand":true},{"name":"wrench","unicode":"f0ad","searchTerms":["construction","fix","mechanic","plumbing","settings","spanner","tool","update"],"isBrand":false},{"name":"x-ray","unicode":"f497","searchTerms":["health","medical","radiological images","radiology","skeleton"],"isBrand":false},{"name":"xbox","unicode":"f412","searchTerms":[],"isBrand":true},{"name":"xing","unicode":"f168","searchTerms":[],"isBrand":true},{"name":"xing-square","unicode":"f169","searchTerms":[],"isBrand":true},{"name":"y-combinator","unicode":"f23b","searchTerms":[],"isBrand":true},{"name":"yahoo","unicode":"f19e","searchTerms":[],"isBrand":true},{"name":"yammer","unicode":"f840","searchTerms":[],"isBrand":true},{"name":"yandex","unicode":"f413","searchTerms":[],"isBrand":true},{"name":"yandex-international","unicode":"f414","searchTerms":[],"isBrand":true},{"name":"yarn","unicode":"f7e3","searchTerms":[],"isBrand":true},{"name":"yelp","unicode":"f1e9","searchTerms":[],"isBrand":true},{"name":"yen-sign","unicode":"f157","searchTerms":["currency","jpy","money"],"isBrand":false},{"name":"yin-yang","unicode":"f6ad","searchTerms":["daoism","opposites","taoism"],"isBrand":false},{"name":"yoast","unicode":"f2b1","searchTerms":[],"isBrand":true},{"name":"youtube","unicode":"f167","searchTerms":["film","video","youtube-play","youtube-square"],"isBrand":true},{"name":"youtube-square","unicode":"f431","searchTerms":[],"isBrand":true},{"name":"zhihu","unicode":"f63f","searchTerms":[],"isBrand":true}];
/*!
 * Font Awesome Icon Picker
 * https://farbelous.github.io/fontawesome-iconpicker/
 *
 * @author Javi Aguilar, itsjavi.com
 * @license MIT License
 * @see https://github.com/farbelous/fontawesome-iconpicker/blob/master/LICENSE
 */

(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (window.jQuery && !window.jQuery.fn.iconpicker) {
        factory(window.jQuery);
    }
}
(function ($) {
    'use strict';

    var _helpers = {
        isEmpty: function (val) {
            return ((val === false) || (val === '') || (val === null) || (val === undefined));
        },
        isEmptyObject: function (val) {
            return (this.isEmpty(val) === true) || (val.length === 0);
        },
        isElement: function (selector) {
            return ($(selector).length > 0);
        },
        isString: function (val) {
            return ((typeof val === 'string') || (val instanceof String));
        },
        isArray: function (val) {
            return $.isArray(val);
        },
        inArray: function (val, arr) {
            return ($.inArray(val, arr) !== -1);
        },
        throwError: function (text) {
            throw "Font Awesome Icon Picker Exception: " + text;
        }
    };

    var Iconpicker = function (element, options) {
        this._id = Iconpicker._idCounter++;
        this.element = $(element).addClass('iconpicker-element');
        this._trigger('iconpickerCreate', {
            iconpickerValue: this.iconpickerValue
        });
        this.options = $.extend({}, Iconpicker.defaultOptions, this.element.data(), options);
        this.options.templates = $.extend({}, Iconpicker.defaultOptions.templates, this.options.templates);
        this.options.originalPlacement = this.options.placement;
        // Iconpicker container element
        this.container = (_helpers.isElement(this.options.container) ? $(this.options.container) : false);
        if (this.container === false) {
            if (this.element.is('.dropdown-toggle')) {
                this.container = $('~ .dropdown-menu:first', this.element);
            } else {
                this.container = (this.element.is('input,textarea,button,.btn') ? this.element.parent() : this.element);
            }
        }
        this.container.addClass('iconpicker-container');

        if (this.isDropdownMenu()) {
            this.options.placement = 'inline';
        }

        // Is the element an input? Should we search inside for any input?
        this.input = (this.element.is('input,textarea') ? this.element.addClass('iconpicker-input') : false);
        if (this.input === false) {
            this.input = (this.container.find(this.options.input));
            if (!this.input.is('input,textarea')) {
                this.input = false;
            }
        }

        // Plugin as component ?
        this.component = this.isDropdownMenu() ? this.container.parent().find(this.options.component) : this.container.find(this.options.component);
        if (this.component.length === 0) {
            this.component = false;
        } else {
            this.component.find('i').addClass('iconpicker-component');
        }

        // Create popover and iconpicker HTML
        this._createPopover();
        this._createIconpicker();

        if (this.getAcceptButton().length === 0) {
            // disable this because we don't have accept buttons
            this.options.mustAccept = false;
        }

        // Avoid CSS issues with input-group-addon(s)
        if (this.isInputGroup()) {
            this.container.parent().append(this.popover);
        } else {
            this.container.append(this.popover);
        }

        // Bind events
        this._bindElementEvents();
        this._bindWindowEvents();

        // Refresh everything
        this.update(this.options.selected);

        if (this.isInline()) {
            this.show();
        }

        this._trigger('iconpickerCreated', {
            iconpickerValue: this.iconpickerValue
        });
    };

    // Instance identifier counter
    Iconpicker._idCounter = 0;

    Iconpicker.defaultOptions = {
        title: false, // Popover title (optional) only if specified in the template
        selected: false, // use this value as the current item and ignore the original
        defaultValue: false, // use this value as the current item if input or element value is empty
        placement: 'bottom', // (has some issues with auto and CSS). auto, top, bottom, left, right
        collision: 'none', // If true, the popover will be repositioned to another position when collapses with the window borders
        animation: true, // fade in/out on show/hide ?
        //hide iconpicker automatically when a value is picked. it is ignored if mustAccept is not false and the accept button is visible
        hideOnSelect: false,
        showFooter: false,
        searchInFooter: false, // If true, the search will be added to the footer instead of the title
        mustAccept: false, // only applicable when there's an iconpicker-btn-accept button in the popover footer
        selectedCustomClass: 'bg-primary text-white', // Appends this class when to the selected item
        icons: [], // list of icon classes (declared at the bottom of this script for maintainability)
        fullClassFormatter: function (val) {
            return val;
        },
        input: 'input,.iconpicker-input', // children input selector
        inputSearch: false, // use the input as a search box too?
        container: false, //  Appends the popover to a specific element. If not set, the selected element or element parent is used
        component: '.input-group-addon,.iconpicker-component', // children component jQuery selector or object, relative to the container element
        // Plugin templates:
        templates: {
            popover: '<div class="iconpicker-popover popover"><div class="arrow"></div>' +
                '<div class="popover-title"></div><div class="popover-content"></div></div>',
            footer: '<div class="popover-footer"></div>',
            buttons: '<button class="iconpicker-btn iconpicker-btn-cancel btn btn-default btn-sm">Cancel</button>' +
                ' <button class="iconpicker-btn iconpicker-btn-accept btn btn-primary btn-sm">Accept</button>',
            search: '<input type="search" class="form-control iconpicker-search" placeholder="Type to filter" />',
            iconpicker: '<div class="iconpicker"><div class="iconpicker-items"></div></div>',
            iconpickerItem: '<a role="button" href="javascript:;" class="iconpicker-item"><i></i></a>',
        }
    };

    Iconpicker.batch = function (selector, method) {
        var args = Array.prototype.slice.call(arguments, 2);
        return $(selector).each(function () {
            var $inst = $(this).data('iconpicker');
            if (!!$inst) {
                $inst[method].apply($inst, args);
            }
        });
    };

    Iconpicker.prototype = {
        constructor: Iconpicker,
        options: {},
        _id: 0, // instance identifier for bind/unbind events
        _trigger: function (name, opts) {
            //triggers an event bound to the element
            opts = opts || {};
            this.element.trigger($.extend({
                type: name,
                iconpickerInstance: this
            }, opts));
            //console.log(name + ' triggered for instance #' + this._id);
        },
        _createPopover: function () {
            this.popover = $(this.options.templates.popover);

            // title (header)
            var _title = this.popover.find('.popover-title');
            if (!!this.options.title) {
                _title.append($('<div class="popover-title-text">' + this.options.title + '</div>'));
            }
            if (this.hasSeparatedSearchInput() && !this.options.searchInFooter) {
                _title.append(this.options.templates.search);
            } else if (!this.options.title) {
                _title.remove();
            }

            // footer
            if (this.options.showFooter && !_helpers.isEmpty(this.options.templates.footer)) {
                var _footer = $(this.options.templates.footer);
                if (this.hasSeparatedSearchInput() && this.options.searchInFooter) {
                    _footer.append($(this.options.templates.search));
                }
                if (!_helpers.isEmpty(this.options.templates.buttons)) {
                    _footer.append($(this.options.templates.buttons));
                }
                this.popover.append(_footer);
            }

            if (this.options.animation === true) {
                this.popover.addClass('fade');
            }

            return this.popover;
        },
        _createIconpicker: function () {
            var _self = this;
            this.iconpicker = $(this.options.templates.iconpicker);

            var itemClickFn = function (e) {
                var $this = $(this);
                if ($this.is('i')) {
                    $this = $this.parent();
                }

                _self._trigger('iconpickerSelect', {
                    iconpickerItem: $this,
                    iconpickerValue: _self.iconpickerValue
                });

                if (_self.options.mustAccept === false) {
                    _self.update($this.data('iconpickerValue'));
                    _self._trigger('iconpickerSelected', {
                        iconpickerItem: this,
                        iconpickerValue: _self.iconpickerValue
                    });
                } else {
                    _self.update($this.data('iconpickerValue'), true);
                }

                if (_self.options.hideOnSelect && (_self.options.mustAccept === false)) {
                    // only hide when the accept button is not present
                    _self.hide();
                }
            };

            var $itemElementTemplate = $(this.options.templates.iconpickerItem);
            var $elementsToAppend = [];
            for (var i in this.options.icons) {
                var icon = this.options.icons[i];
                icon.title = 'fa-' + icon.name;
                if (icon.isBrand) {
                    icon.title = 'fab ' + icon.title;
                    // continue;
                }
                if (typeof icon.title === 'string') {
                    var itemElement = $itemElementTemplate.clone();
                    itemElement.find('i')
                        .addClass(this.options.fullClassFormatter(icon.title));
                    itemElement.data('iconpickerValue', icon.title)
                        .on('click.iconpicker', itemClickFn);

                    itemElement.attr('title', '.' + icon.title);
                    if (icon.searchTerms.length > 0) {
                        var searchTerms = '';
                        for (var j = 0; j < icon.searchTerms.length; j++) {
                            searchTerms = searchTerms + icon.searchTerms[j] + ' ';
                        }
                        itemElement.attr('data-search-terms', searchTerms);
                    }
                    $elementsToAppend.push(itemElement);
                }
            }
            this.iconpicker.find('.iconpicker-items').append($elementsToAppend);
            this.popover.find('.popover-content').append(this.iconpicker);

            return this.iconpicker;
        },
        _isEventInsideIconpicker: function (e) {
            var _t = $(e.target);
            if ((!_t.hasClass('iconpicker-element') ||
                (_t.hasClass('iconpicker-element') && !_t.is(this.element))) &&
                (_t.parents('.iconpicker-popover').length === 0)) {
                return false;
            }
            return true;
        },
        _bindElementEvents: function () {
            var _self = this;

            this.getSearchInput().on('keyup.iconpicker', function () {
                _self.filter($(this).val().toLowerCase());
            });

            this.getAcceptButton().on('click.iconpicker', function () {
                var _picked = _self.iconpicker.find('.iconpicker-selected').get(0);

                _self.update(_self.iconpickerValue);

                _self._trigger('iconpickerSelected', {
                    iconpickerItem: _picked,
                    iconpickerValue: _self.iconpickerValue
                });
                if (!_self.isInline()) {
                    _self.hide();
                }
            });
            this.getCancelButton().on('click.iconpicker', function () {
                if (!_self.isInline()) {
                    _self.hide();
                }
            });

            this.element.on('focus.iconpicker', function (e) {
                _self.show();
                e.stopPropagation();
            });

            //LEO@20220119: Comment out to work with bs5 dropdown
            /*
            if (this.hasComponent()) {
                this.component.on('click.iconpicker', function () {
                    _self.toggle();
                });
            }*/

            if (this.hasInput()) {
                // Bind input keyup event
                this.input.on('keyup.iconpicker', function (e) {
                    if (!_helpers.inArray(e.keyCode, [38, 40, 37, 39, 16, 17, 18, 9, 8, 91, 93, 20, 46, 186, 190, 46, 78, 188, 44, 86])) {
                        _self.update();
                    } else {
                        _self._updateFormGroupStatus(_self.getValid(this.value) !== false);
                    }
                    if (_self.options.inputSearch === true) {
                        _self.filter($(this).val().toLowerCase());
                    }
                    //_self.hide();
                });
            }

        },
        _bindWindowEvents: function () {
            var $doc = $(window.document);
            var _self = this;

            // Add a namespace to the document events so they can be identified
            // later for every instance separately
            var _eventNs = '.iconpicker.inst' + this._id;

            $(window).on('resize.iconpicker' + _eventNs + ' orientationchange.iconpicker' + _eventNs, function (e) {
                // reposition popover
                if (_self.popover.hasClass('in')) {
                    _self.updatePlacement();
                }
            });

            if (!_self.isInline()) {
                $doc.on('mouseup' + _eventNs, function (e) {
                    if (!_self._isEventInsideIconpicker(e) && !_self.isInline()) {
                        _self.hide();
                    }
                });
            }
        },
        _unbindElementEvents: function () {
            this.popover.off('.iconpicker');
            this.element.off('.iconpicker');

            if (this.hasInput()) {
                this.input.off('.iconpicker');
            }

            if (this.hasComponent()) {
                this.component.off('.iconpicker');
            }

            if (this.hasContainer()) {
                this.container.off('.iconpicker');
            }
        },
        _unbindWindowEvents: function () {
            // destroy window and window.document bound events
            $(window).off('.iconpicker.inst' + this._id);
            $(window.document).off('.iconpicker.inst' + this._id);
        },
        updatePlacement: function (placement, collision) {
            placement = placement || this.options.placement;
            this.options.placement = placement; // set new placement
            collision = collision || this.options.collision;
            collision = (collision === true ? 'flip' : collision);

            var _pos = {
                // at: Defines which position (or side) on container element to align the
                // popover element against: "horizontal vertical" alignment.
                at: "right bottom",
                // my: Defines which position (or side) on the popover being positioned to align
                // with the container element: "horizontal vertical" alignment
                my: "right top",
                // of: Which element to position against.
                of: (this.hasInput() && !this.isInputGroup()) ? this.input : this.container,
                // collision: When the positioned element overflows the window (or within element)
                // in some direction, move it to an alternative position.
                collision: (collision === true ? 'flip' : collision),
                // within: Element to position within, affecting collision detection.
                within: window
            };

            // remove previous classes
            this.popover.removeClass('inline topLeftCorner topLeft top topRight topRightCorner ' +
                'rightTop right rightBottom bottomRight bottomRightCorner ' +
                'bottom bottomLeft bottomLeftCorner leftBottom left leftTop');

            if (typeof placement === 'object') {
                // custom position ?
                return this.popover.pos($.extend({}, _pos, placement));
            }

            switch (placement) {
                case 'inline': {
                    _pos = false;
                }
                    break;
                case 'topLeftCorner': {
                    _pos.my = 'right bottom';
                    _pos.at = 'left top';
                }
                    break;

                case 'topLeft': {
                    _pos.my = 'left bottom';
                    _pos.at = 'left top';
                }
                    break;

                case 'top': {
                    _pos.my = 'center bottom';
                    _pos.at = 'center top';
                }
                    break;

                case 'topRight': {
                    _pos.my = 'right bottom';
                    _pos.at = 'right top';
                }
                    break;

                case 'topRightCorner': {
                    _pos.my = 'left bottom';
                    _pos.at = 'right top';
                }
                    break;

                case 'rightTop': {
                    _pos.my = 'left bottom';
                    _pos.at = 'right center';
                }
                    break;

                case 'right': {
                    _pos.my = 'left center';
                    _pos.at = 'right center';
                }
                    break;

                case 'rightBottom': {
                    _pos.my = 'left top';
                    _pos.at = 'right center';
                }
                    break;

                case 'bottomRightCorner': {
                    _pos.my = 'left top';
                    _pos.at = 'right bottom';
                }
                    break;

                case 'bottomRight': {
                    _pos.my = 'right top';
                    _pos.at = 'right bottom';
                }
                    break;
                case 'bottom': {
                    _pos.my = 'center top';
                    _pos.at = 'center bottom';
                }
                    break;

                case 'bottomLeft': {
                    _pos.my = 'left top';
                    _pos.at = 'left bottom';
                }
                    break;

                case 'bottomLeftCorner': {
                    _pos.my = 'right top';
                    _pos.at = 'left bottom';
                }
                    break;

                case 'leftBottom': {
                    _pos.my = 'right top';
                    _pos.at = 'left center';
                }
                    break;

                case 'left': {
                    _pos.my = 'right center';
                    _pos.at = 'left center';
                }
                    break;

                case 'leftTop': {
                    _pos.my = 'right bottom';
                    _pos.at = 'left center';
                }
                    break;

                default: {
                    return false;
                }
                    break;

            }

            this.popover.css({
                'display': (this.options.placement === 'inline') ? '' : 'block'
            });

            if (_pos !== false) {
                this.popover.pos(_pos).css('maxWidth', $(window).width() - this.container.offset().left - 5);
            } else {
                //reset position
                this.popover.css({
                    'top': 'auto',
                    'right': 'auto',
                    'bottom': 'auto',
                    'left': 'auto',
                    'maxWidth': 'none'
                });
            }
            this.popover.addClass(this.options.placement);

            return true;
        },
        _updateComponents: function () {
            // Update selected item
            this.iconpicker.find('.iconpicker-item.iconpicker-selected')
                .removeClass('iconpicker-selected ' + this.options.selectedCustomClass);

            if (this.iconpickerValue) {
                this.iconpicker.find('.' + this.options.fullClassFormatter(this.iconpickerValue).replace(/ /g, '.')).parent()
                    .addClass('iconpicker-selected ' + this.options.selectedCustomClass);
            }

            // Update component item
            if (this.hasComponent()) {
                var icn = this.component.find('i');
                if (icn.length > 0) {
                    icn.attr('class', this.options.fullClassFormatter(this.iconpickerValue));
                } else {
                    this.component.html(this.getHtml());
                }
            }

        },
        _updateFormGroupStatus: function (isValid) {
            if (this.hasInput()) {
                if (isValid !== false) {
                    // Remove form-group error class if any
                    this.input.parents('.form-group:first').removeClass('has-error');
                } else {
                    this.input.parents('.form-group:first').addClass('has-error');
                }
                return true;
            }
            return false;
        },
        getValid: function (val) {
            // here we must validate the value (you may change this validation
            // to suit your needs
            if (!_helpers.isString(val)) {
                val = '';
            }

            var isEmpty = (val === '');

            // trim string
            val = $.trim(val);
            var e = false;
            for (var i = 0; i < this.options.icons.length; i++) {
                if (this.options.icons[i].title === val) {
                    e = true;
                    break;
                }
            }

            if (e || isEmpty) {
                return val;
            }
            return false;
        },
        /**
         * Sets the internal item value and updates everything, excepting the input or element.
         * For doing so, call setSourceValue() or update() instead
         */
        setValue: function (val) {
            // sanitize first
            var _val = this.getValid(val);
            if (_val !== false) {
                this.iconpickerValue = _val;
                this._trigger('iconpickerSetValue', {
                    iconpickerValue: _val
                });
                return this.iconpickerValue;
            } else {
                this._trigger('iconpickerInvalid', {
                    iconpickerValue: val
                });
                return false;
            }
        },
        getHtml: function () {
            return '<i class="' + this.options.fullClassFormatter(this.iconpickerValue) + '"></i>';
        },
        /**
         * Calls setValue and if it's a valid item value, sets the input or element value
         */
        setSourceValue: function (val) {
            val = this.setValue(val);
            if ((val !== false) && (val !== '')) {
                if (this.hasInput()) {
                    this.input.val(this.iconpickerValue);
                } else {
                    this.element.data('iconpickerValue', this.iconpickerValue);
                }
                this._trigger('iconpickerSetSourceValue', {
                    iconpickerValue: val
                });
            }
            return val;
        },
        /**
         * Returns the input or element item value, without formatting, or defaultValue
         * if it's empty string, undefined, false or null
         * @param {type} defaultValue
         * @returns string|mixed
         */
        getSourceValue: function (defaultValue) {
            // returns the input or element value, as string
            defaultValue = defaultValue || this.options.defaultValue;
            var val = defaultValue;

            if (this.hasInput()) {
                val = this.input.val();
            } else {
                val = this.element.data('iconpickerValue');
            }
            if ((val === undefined) || (val === '') || (val === null) || (val === false)) {
                // if not defined or empty, return default
                val = defaultValue;
            }
            return val;
        },
        hasInput: function () {
            return (this.input !== false);
        },
        isInputSearch: function () {
            return (this.hasInput() && (this.options.inputSearch === true));
        },
        isInputGroup: function () {
            return this.container.is('.input-group');
        },
        isDropdownMenu: function () {
            return this.container.is('.dropdown-menu');
        },
        hasSeparatedSearchInput: function () {
            return (this.options.templates.search !== false) && (!this.isInputSearch());
        },
        hasComponent: function () {
            return (this.component !== false);
        },
        hasContainer: function () {
            return (this.container !== false);
        },
        getAcceptButton: function () {
            return this.popover.find('.iconpicker-btn-accept');
        },
        getCancelButton: function () {
            return this.popover.find('.iconpicker-btn-cancel');
        },
        getSearchInput: function () {
            return this.popover.find('.iconpicker-search');
        },
        filter: function (filterText) {
            if (_helpers.isEmpty(filterText)) {
                this.iconpicker.find('.iconpicker-item').show();
                return $(false);
            } else {
                var found = [];
                this.iconpicker.find('.iconpicker-item').each(function () {
                    var $this = $(this);
                    var text = $this.attr('title').toLowerCase();
                    var searchTerms = $this.attr('data-search-terms') ? $this.attr('data-search-terms').toLowerCase() : '';
                    text = text + ' ' + searchTerms;
                    var regex = false;
                    try {
                        regex = new RegExp('(^|\\W)' + filterText, 'g');
                    } catch (e) {
                        regex = false;
                    }
                    if ((regex !== false) && text.match(regex)) {
                        found.push($this);
                        $this.show();
                    } else {
                        $this.hide();
                    }
                });
                return found;
            }
        },
        show: function () {
            if (this.popover.hasClass('in')) {
                return false;
            }
            // hide other non-inline pickers
            $.iconpicker.batch($('.iconpicker-popover.in:not(.inline)').not(this.popover), 'hide');

            this._trigger('iconpickerShow', {
                iconpickerValue: this.iconpickerValue
            });
            this.updatePlacement();
            this.popover.addClass('in');
            setTimeout($.proxy(function () {
                this.popover.css('display', this.isInline() ? '' : 'block');
                this._trigger('iconpickerShown', {
                    iconpickerValue: this.iconpickerValue
                });
            }, this), this.options.animation ? 300 : 1); // animation duration
        },
        hide: function () {
            if (!this.popover.hasClass('in')) {
                return false;
            }
            this._trigger('iconpickerHide', {
                iconpickerValue: this.iconpickerValue
            });
            this.popover.removeClass('in');
            setTimeout($.proxy(function () {
                this.popover.css('display', 'none');
                this.getSearchInput().val('');
                this.filter(''); // clear filter
                this._trigger('iconpickerHidden', {
                    iconpickerValue: this.iconpickerValue
                });
            }, this), this.options.animation ? 300 : 1);
        },
        toggle: function () {
            if (this.popover.is(":visible")) {
                this.hide();
            } else {
                this.show(true);
            }
        },
        update: function (val, updateOnlyInternal) {
            val = (val ? val : this.getSourceValue(this.iconpickerValue));
            // reads the input or element value again and tries to update the plugin
            // fallback to the current selected item value
            this._trigger('iconpickerUpdate', {
                iconpickerValue: this.iconpickerValue
            });

            if (updateOnlyInternal === true) {
                val = this.setValue(val);
            } else {
                val = this.setSourceValue(val);
                this._updateFormGroupStatus(val !== false);
            }

            if (val !== false) {
                this._updateComponents();
            }

            this._trigger('iconpickerUpdated', {
                iconpickerValue: this.iconpickerValue
            });
            return val;
        },
        destroy: function () {
            this._trigger('iconpickerDestroy', {
                iconpickerValue: this.iconpickerValue
            });

            // unbinds events and resets everything to the initial state,
            // including component mode
            this.element.removeData('iconpicker').removeData('iconpickerValue').removeClass('iconpicker-element');

            this._unbindElementEvents();
            this._unbindWindowEvents();

            $(this.popover).remove();

            this._trigger('iconpickerDestroyed', {
                iconpickerValue: this.iconpickerValue
            });
        },
        disable: function () {
            if (this.hasInput()) {
                this.input.prop('disabled', true);
                return true;
            }
            return false;
        },
        enable: function () {
            if (this.hasInput()) {
                this.input.prop('disabled', false);
                return true;
            }
            return false;
        },
        isDisabled: function () {
            if (this.hasInput()) {
                return (this.input.prop('disabled') === true);
            }
            return false;
        },
        isInline: function () {
            return (this.options.placement === 'inline') || (this.popover.hasClass('inline'));
        }
    };

    $.iconpicker = Iconpicker;

    // jQuery plugin
    $.fn.iconpicker = function (options) {
        return this.each(function () {
            var $this = $(this);
            if (!$this.data('iconpicker')) {
                // create plugin instance (only if not exists) and expose the entire instance API
                $this.data('iconpicker', new Iconpicker(this, ((typeof options === 'object') ? options : {})));
            }
        });
    };

    // List of all Font Awesome icons without class prefix
    Iconpicker.defaultOptions = $.extend(
        Iconpicker.defaultOptions,
        //###REPLACE-WITH-FONT-AWESOME-5-FONTS###
        // LEO@20200913: sample use only
        {
            icons: [{
                name: "circle",
                searchTerms: ["circle-thin", "diameter", "dot", "ellipse", "notification", "round"]
            }, {
                name: "circle-notch",
                searchTerms: ["circle-o-notch", "diameter", "dot", "ellipse", "round", "spinner"]
            }]
        }
    );
}));

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/21/2017
 */
(function () {
    'use strict';

    /**
     * @memberof oplus.commons
     * @ngdoc directive
     * @name opIconpicker
     * @restrict E
     * @description
     * Angular wrapper for [fontawesome-iconpicker](https://github.com/farbelous/fontawesome-iconpicker)
     * @example
     * <op-iconpicker ng-model="string"
     *                options="{previewStyle:string=,excludeBrandIcon:boolean=}"></op-iconpicker>
     * @param {string} ngModel Two-way binding model
     * @param {{previewStyle:string=,excludeBrandIcon:boolean=}} options
     * @param {string} options.previewStyle Icon style for preview, "solid" (default), "regular", "light", "duotone"
     * @param {string} options.excludeBrandIcon True to exclude brand icon
     */
    angular.module('oplus.commons').directive('opIconpicker', iconPicker);

    iconPicker.$inject = ['$timeout'];

    function iconPicker($timeout) {
        var btn;
        btn = '<button type="button" class="dropdown-toggle btn btn-outline-default opx-btn-icon js-iconpicker-component" data-bs-toggle="dropdown" opx-popdrop></button>' +
            '<div class="dropdown-menu"></div>';
        return {
            restrict: 'EA',
            scope: {
                selectedIcon: '=ngModel',
                options: '<'
            },
            template: btn,
            link: function (scope, element, attrs, ctrl) {
                var $icp;
                element.addClass('dropdown');
                $icp = element.find('>.dropdown-toggle');
                var options = scope.options || {};
                var iconCss;
                var cssMap = {'solid': 'fas', 'regular': 'far', 'duotone': 'fad'};
                // if (useSelf) {
                //     element.addClass('js-iconpicker-component');
                // }
                if (options.previewStyle) {
                    iconCss = cssMap[options.previewStyle];
                }
                if (!iconCss) {
                    iconCss = 'fa';
                }
                var opts = {
                    hideOnSelect: true,
                    inputSearch: true,
                    component: '.js-iconpicker-component',
                    defaultValue: undefined,
                    fontAwesome5: true,
                    fullClassFormatter: function (e) {
                        return iconCss + ' ' + e;
                    },
                    icons: window['@oplus/icons'],
                    // container: 'body',
                    placement: 'bottomLeft'
                };
                if (options.excludeBrandIcon === true) {
                    opts.icons = _.filter(window['@oplus/icons'], {isBrand: false});
                }
                $icp.iconpicker(opts);
                $icp.on('iconpickerSelected', function (event) {
                    $timeout(function () {
                        scope.selectedIcon = event.iconpickerValue;
                    });
                });
                scope.$watch('selectedIcon', function (newVal, oldVal) {
                    if (!newVal) {
                        // To remove icon, it seems we have to
                        // 1. clear element's data `iconpickerValue`
                        // 2. clear control instance's `iconpickerValue`
                        if (angular.isUndefined(newVal)) {
                            // Use removeData since jquery.data(key,value) does not allow undefined as value.
                            $icp.removeData('iconpickerValue');
                        } else {
                            $icp.data('iconpickerValue', newVal);
                        }
                        $icp.data('iconpicker').iconpickerValue = newVal;
                        // $icp.data('iconpicker').setSourceValue(newVal);
                    }
                    $icp.data('iconpicker').update(newVal);
                    // console.log('selectedIcon', newVal, $icp.data('iconpicker').iconpickerValue);
                });
                // $icp.data('iconpicker').setSourceValue(scope.selectedIcon);//setSourceValue', 'methodArg2' /* , other args */);
                scope.$on('$destroy', function () {
                    $icp.off('iconpickerSelected');
                    var iconpicker = $icp.data('iconpicker');
                    if (iconpicker)
                        iconpicker.destroy();
                });
            }
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/4/2017
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('messageService', ['toaster', '$timeout', '$translate', messageService]);
    angular.module('oplus.commons').run(['customFunctions', 'messageService', function (cf, messageService) {
        cf.defineFunction('alert', {
            func: function (title, body, callback) {
                return messageService.alert(title, body, callback)
            },
            group: 'dev',
            sample: 'alert(title, body, callback)',
            desc: ""
        });

        cf.defineFunction('toast', {
            func: function (type, title, body) {
                return messageService.toast(type, title, body)
            },
            group: 'dev',
            sample: 'toast(type, title, body)',
            desc: ""
        });
    }]);

    /**
     * @ngdoc service
     * @name messageService
     * @param {toaster} toaster
     * @param $timeout
     * @description
     * Provides unified message and notification functions like alert, confirm, prompt, notification.
     */
    function messageService(toaster, $timeout, $translate) {
        init();
        /**
         * Display message in a modal dialog which has one OK button.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} [callback=] Callback when user clicks OK.
         */
        this.alert = function (title, body, callback) {
            callAlert(null, title, body, callback);
        };

        /**
         * Display error message in a modal dialog which has one OK button.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} [callback=] Callback when user clicks OK.
         */
        this.alertError = function (title, body, callback) {
            callAlert('danger', title, body, callback);
        };
        /**
         * Display success message in a modal dialog which has one OK button.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} [callback=] Callback when user clicks OK.
         */
        this.alertSuccess = function (title, body, callback) {
            callAlert('success', title, body, callback);
        };
        /**
         * Display warning message in a modal dialog which has one OK button.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} [callback=] Callback function called when user clicks OK.
         */
        this.alertWarning = function (title, body, callback) {
            callAlert('warning', title, body, callback);
        };

        /**
         * Display a confirmation modal dialog which has OK and cancel buttons.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} okCallback Callback when user clicks OK
         * @param {function} [cancelCallback] Callback when user clicks cancel
         */
        this.confirm = function (title, body, okCallback, cancelCallback) {
            callConfirm(null, title, body, okCallback, cancelCallback);
        };
        /**
         * Display a confirmation modal dialog in warning style which has OK and cancel buttons.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} okCallback Callback when user clicks OK
         * @param {function=} cancelCallback Callback when user clicks cancel
         */
        this.confirmWarning = function (title, body, okCallback, cancelCallback) {
            callConfirm('warning', title, body, okCallback, cancelCallback);
        };
        /**
         * Display a confirmation modal dialog in danger style which has OK and cancel buttons.
         * Use cases like deletion confirmation.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {function} okCallback Callback when user clicks OK
         * @param {function} cancelCallback Callback when user clicks cancel
         * @param {string=} okLabel Label of OK button
         */
        this.confirmDanger = function (title, body, okCallback, cancelCallback, okLabel) {
            callConfirm('danger', title, body, okCallback, cancelCallback, okLabel);
        };

        /**
         * Display a modal dialog with user input control, OK and cancel buttons.
         * @param {string} title Message title
         * @param {string} body Message body
         * @param {string} defaultValue Default value for user input
         * @param {function} okCallback Callback when user clicks OK, parameter is user input value
         * @param {function} cancelCallback Callback when user clicks cancel
         */
        this.prompt = function (title, body, defaultValue, okCallback, cancelCallback) {
            if (typeof alertify !== 'undefined' && alertify && alertify.prompt) {
                alertify.prompt(title, body, defaultValue,
                    function (evt, value) {
                        $timeout(function () {
                            okCallback(value);
                        });
                    },
                    function () {
                        $timeout(function () {
                            cancelCallback && cancelCallback();
                        });
                    });
            } else {
                console.error('alertify is not available for prompt');
            }
        };

        /**
         * Display a piece of message in floating layer.
         *
         * @param {string} type Value of `error`, `success`, `info`, `warning`
         * @param {string} title Succinct title text less than 20 characters
         * @param {string=} body Detailed message
         */
        this.toast = function (type, title, body) {
            var timeout;
            if (type === 'error' || type === 'warning') {
                timeout = 0;
            } else {
                timeout = 3;
            }
            //TODO: toaster cannot display `&nbsp;` or ` `, use full space for temp
            toaster.pop({type: type, title: title || '　', body: body, timeout: timeout * 1000});
        };

        function formatMessage(style, message) {
            if (!angular.isString(message))
                message = JSON.stringify(message);
            var css = 'd-flex align-items-center overflow-auto';//style ? 'alert alert-' + style : 'alert';
            var icon = '';
            if (style === 'danger') {
                icon = '<i class="fa fa-exclamation-triangle fa-3x text-danger me-3"></i>';
            }
            message = '<div class="' + css + '">' + icon + '<div>' + (message || '') + '</div></div>';
            return message;
        }

        function callConfirm(style, title, message, okCallback, cancelCallback, okLabel) {
            var setting = {
                'title': title || '',
                'message': formatMessage(style, message),
                'onok': function () {
                    $timeout(function () {
                        okCallback && okCallback();
                    })
                },
                'oncancel': function () {
                    $timeout(function () {
                        cancelCallback && cancelCallback();
                    })
                }
            };
            // if (okLabel) {
            setting.labels = {
                ok: okLabel ? okLabel : $translate.instant('common.action.ok'),
                cancel: $translate.instant('common.action.cancel')
            };
            // }
            if (style === 'danger') {
                setting.defaultFocus = 'cancel';
            }
            if (typeof alertify !== 'undefined' && alertify && alertify.confirm) {
                alertify.confirm().setting(setting).show(true, 'opx-' + style);
            } else {
                console.error('alertify is not available for confirm');
            }
            // return;
            // alertify.confirm(title || '', formatMessage(style, message),
            //     function () {
            //         $timeout(function () {
            //             okCallback && okCallback();
            //         });
            //     }, function () {
            //         $timeout(function () {
            //             cancelCallback && cancelCallback();
            //         })
            //     }).set('reverseButtons', true);
        }

        function callAlert(style, title, message, callback) {
            if (typeof alertify !== 'undefined' && alertify && alertify.alert) {
                alertify.alert().set({
                    label: $translate.instant('common.entity.action.close'),
                    onshow: function (e) {
                        $('.ajs-button.btn-primary').addClass('btn-default').removeClass('btn-primary');
                    }
                });
                alertify.alert(title, formatMessage(style, message), function () {
                    $timeout(function () {
                        callback && callback();
                    });
                });
            } else {
                console.error('alertify is not available for alert');
            }
        }

        function init() {
            // 确保 alertify 已经加载
            if (typeof alertify !== 'undefined' && alertify && alertify.defaults) {
                alertify.defaults.transition = "none";
                alertify.defaults.theme.ok = "btn btn-primary";
                alertify.defaults.theme.cancel = "btn btn-default";
                alertify.defaults.theme.input = "form-control";
                // console.log('messageService.init()...........',{$translate:$translate.instant('common.action.cancel')});
                // alertify.defaults.glossary.ok = $translate.instant('common.action.ok');
                // alertify.defaults.glossary.cancel = $translate.instant('common.action.cancel');
            } else {
                console.warn('alertify is not loaded yet, initialization will be retried later');
                // 延迟重试
                setTimeout(init, 100);
            }
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/06/10, created
 */
(function () {
        'use strict';

        angular.module('oplus.commons').service('modalHelper', ['$uibModal', '$timeout', '$uibModalStack', modalHelper]);

        /**
         * @ngdoc service
         * @name modalHelper
         * @param $uibModal
         * @param $timeout
         * @param $uibModalStack
         */
        function modalHelper($uibModal, $timeout, $uibModalStack) {
            var MODALESS_CSS = 'opx-modaless';
            var MAX_CSS = 'maximized';
            var ENABLE_RESIZE_CSS = 'op-enable-resize';
            this.openModal = openModal;
            this.closeTop = closeTop;
            this.maximizeOrRestoreModal = maximizeOrRestoreModal;
            // this.openSimpleModal = openSimpleModal;
            this.bringModalessToFront = bringModalessToFront;

            /**
             * Bootstrap modal structure is
             * .modal
             *   .modal-dialog
             *      .modal-content
             *        - .modal-header
             *        - .modal-body
             *        - .modal-footer
             * In modal mode, .modal is always 100% width and height, the target of drag/resize is `.modal-dialog`
             * In modaless mode, the target of drag/resize is `.modal` element
             * @param {*} any Anything inside modal or modal itself. It shall be a valid jquery selector.
             * @return {{modaless:boolean, element:jQuery}}
             */
            function getDragResizeTarget(any) {
                var modal;
                var target;
                var isModaless = false;
                if (any) {
                    modal = $(any);
                } else {
                    modal = $('.modal').eq(0);
                }
                if (modal.length === 0) {
                    console.warn('ProgramError: Cannot find .modal as draggable and resizable target');
                    return null;
                }
                if (!modal.hasClass('modal')) {
                    modal = modal.closest('.modal');
                }
                // If this is modaless, target is modal
                // If this is modal, target is modal-dialog
                if (modal.hasClass(MODALESS_CSS)) {
                    isModaless = true;
                    target = modal;
                } else {
                    target = modal.find('.modal-dialog');
                }
                return {element: target, modaless: isModaless};
            }

            /**
             *
             * @param {jQuery} theModal Modaless modal with class '.modal.opx-modaless'
             */
            function bringModalessToFront(theModal) {
                var reset = false;

                if (reset) {
                    resetAllModalessZindexFromZero(theModal);
                } else {
                    swapModalessZindex(theModal);
                }

                function swapModalessZindex(theModal) {
                    var modals = [];
                    var theZindex;
                    $('.' + MODALESS_CSS).each(function () {
                        var elem = $(this);
                        var zindex = parseInt(elem.css('z-index'));
                        modals.push({zindex: zindex, elem: elem});
                        if (elem.is(theModal)) {
                            theZindex = zindex;
                        }
                    });
                    // console.warn('swapModalessZindex: theZindex=%o', theZindex);
                    var sortedModals = _.sortBy(modals, ['zindex']);
                    var maxZindex = sortedModals[sortedModals.length - 1].zindex;
                    for (var i = 0; i < sortedModals.length; i++) {
                        var o = sortedModals[i];
                        if (o.zindex > theZindex) {
                            o.elem.css('z-index', sortedModals[i - 1].zindex);
                            o.elem.removeClass('active');
                        }
                    }
                    // sortedModals.forEach(function (o, index) {
                    //     o.elem.css('z-index', zindex++).removeClass('active');
                    // });
                    // console.log('....bringModalessToTop: ',modal);
                    theModal.css('z-index', maxZindex).addClass('active').show();
                }

                function resetAllModalessZindexFromZero(theModal) {
                    // Rewrite z-index from 0
                    // 20220109: when a modaless is opened by a modal, rewrite z-index from 0 will cause problem.
                    // Modaless z-index changed, but modal's not.
                    var modals = [];
                    $('.' + MODALESS_CSS).each(function () {
                        var elem = $(this);
                        if (!elem.is(theModal)) {
                            modals.push({zIndex: parseInt(elem.css('z-index')), elem: elem});
                        }
                    });
                    var zindex = 1;
                    _.sortBy(modals, ['zIndex']).forEach(function (o, index) {
                        o.elem.css('z-index', zindex++).removeClass('active');
                    });
                    // console.log('....bringModalessToTop: ',modal);
                    theModal.css('z-index', zindex).addClass('active').show();
                }
            }

            function openSimpleModal(config) {
                //TODO
            }

            function calcMaxLayout(isModaless) {
                var headerHeight = '40px';
                var styles = {
                    left: '0',
                    top: isModaless ? headerHeight : '0',
                    width: '100%',
                    height: 'calc(100% - ' + headerHeight + ')'
                };
                return {styles: styles};
            }

            /**
             * Maximize or restore window size.
             * @param {*} any Anything inside the modal. It shall be a valid jQuery selector.
             * @param {boolean=} forceMax true to force maximize window, otherwise toggle between maximize and restore
             * @return {boolean} true for maximized
             */
            function maximizeOrRestoreModal(any, forceMax) {
                var ret = getDragResizeTarget(any);
                var target = ret.element;
                var isModaless = ret.modaless;
                var dataKey = 'origstyles';
                if (forceMax === true || !target.hasClass(MAX_CSS)) {
                    var pos = target.position();
                    target.data(dataKey, {left: pos.left, top: pos.top, width: target.width(), height: target.height()})
                    var maxLayout = calcMaxLayout(isModaless);
                    target.addClass(MAX_CSS)
                        .addClass(ENABLE_RESIZE_CSS)
                        .css(maxLayout.styles);
                } else {
                    var styles = target.data(dataKey);
                    target.removeClass(MAX_CSS).css(styles);
                }
                var maximized = target.hasClass(MAX_CSS);
                setMaxIconAndCss(target, maximized);
                return maximized;
            }

            function setMaxIconAndCss(modalElem, maximized) {
                var iconElem = modalElem.find('.js-maxrestore i');
                console.log('setMaxIconAndCss: iconElem=%o', iconElem.length);
                if (maximized) {
                    iconElem.removeClass('fa-window').addClass('fa-window-restore');
                } else {
                    iconElem.removeClass('fa-window-restore').addClass('fa-window');
                }
            }


            function closeTop() {
                // Close top modal if exists
                var top = $uibModalStack.getTop();
                if (top) {
                    $uibModalStack.dismiss(top.key);
                }
            }

            /**
             * Open a modal dialog. By default it is static, draggable, resizable
             * @param {object} config
             * @param {string=} config.template
             * @param {string=} config.templateUrl
             * @param {*} config.controller
             * @param {string=} config.controllerAs
             * @param {string=} config.size
             * @param {boolean} config.modaless Default is false
             * @param {string=} config.position 'center'
             * @param {object=} options
             * @param {function(*)=} options.onOk Function to call when close the modal with result data. Parameter is result.
             * @param {function=} options.onCancel Function to call when close the modal with cancel. No parameter.
             * @param {boolean=} options.draggable Default is true
             * @param {boolean=} options.resizable Default is false
             * @param {string|{width:string,height:string,aspectRatio:number}} options.specSize
             * @param {function=} options.onModalessActivated Callback function executed when modaless activated
             * @returns {*} Modal instance
             */
            function openModal(config, options) {
                config = _.extend({}, {
                    backdrop: 'static',
                    // backdropClass: 'op-fixed-backdrop',
                    modaless: false
                }, config);
                // config = _.extend({}, {backdrop: false, modaless: false}, config);
                options = _.extend({}, {draggable: true, resizable: false}, options);
                if (!config.controller) {
                    config.controller = [function () {
                        this.cancel = function () {
                            modalInstance.dismiss();
                        }
                    }];
                    config.controllerAs = '$ctrl';
                }
                if (config.modaless) {
                    config.backdrop = false;
                    // Default: true - Indicates whether the dialog should be closable by hitting the ESC key.
                    config.keyboard = false;
                    config.windowClass = MODALESS_CSS + ' ' + (config.windowClass || '');
                }
                var modalInstance = $uibModal.open(config);
                modalInstance.result.then(function close(result) {
                    if (angular.isFunction(options.onOk)) {
                        options.onOk(result);
                    }
                }, function dismiss() {
                    if (angular.isFunction(options.onCancel)) {
                        options.onCancel();
                    }
                });
                modalInstance.opened.then(function () {
                    // console.log('modalHelper.opened....');
                    var target = getDragResizeTarget().element;
                    if (config.size) {
                        target.addClass('modal-' + config.size);
                    }
                    resetModalSize(options.specSize, target);
                    if (options.specSize === 'FILL_CONTENT') {
                        // setMaxIconAndCss(target,true);
                    } else if (config.modaless) {
                        resetModalPosition(target);
                    }
                });
                modalInstance.rendered.then(function () {
                    function moveModalBackdropBack() {
                        // If we open a modaless from a modal
                        // uibModal will dynamically increase z-index of the modal backdrop
                        // We need move the backdrop back
                        //TODO: still has problem
                        // modal_1 --> open modaless_1, modal_1 is still clickable
                        // open modal_2 from modal_1 or modaless_1
                        // close modal_2, modal_1 is NOT clickable
                        var modals = $('.modal:not(.opx-modaless)');
                        var zindexes = _.map(modals, function (elem) {
                            return parseInt($(elem).css('z-index'));
                        });
                        var max = _.max(zindexes);
                        $('.modal-backdrop').css('z-index', max - 10);
                    }

                    if (config.modaless) {
                        moveModalBackdropBack();
                    }
                    // console.log('modalHelper.rendered...........')
                    var target = getDragResizeTarget();
                    if (options.specSize === 'FILL_CONTENT') {
                        // maximizeOrRestoreModal(target,true);
                    }
                    var targetEl = target.element;
                    if (options.draggable) {
                        targetEl.draggable({
                            handle: '.modal-header:eq(0)',
                            start: function (event, ui) {
                                targetEl.removeClass(MAX_CSS);
                                setMaxIconAndCss(targetEl, false);
                            }
                        });
                    }
                    if (options.resizable) {
                        // targetEl.resizable({minHeight: 400, minWidth: 640, handles: 'all'});
                        targetEl.resizable({
                            minHeight: 160, minWidth: 200, handles: 'all',
                            start: function (event, ui) {
                                targetEl.removeClass(MAX_CSS);
                                setMaxIconAndCss(targetEl, false);
                            }
                        });
                        buildModalControlButtons(targetEl);
                    }
                    if (config.modaless) {
                        // targetEl.on('click', '.modal-header', function activateModaless() {
                        targetEl.on('click', '.modal-content', function activateModaless() {
                            bringModalessToFront(targetEl);
                            options.onModalessActivated && options.onModalessActivated();
                        });
                    }

                    function buildModalControlButtons(modal) {
                        // Dynamic add button
                        var modalHeader = modal.find('.modal-header');
                        var buttonClose = modalHeader.find('.btn-close');
                        if (buttonClose.length === 0) {
                            buttonClose = modalHeader.find('.op-close-window');
                        }
                        if (buttonClose.length === 0) {
                            console.warn('Cannot find close button in modal-header. `.modal-header` is %c%s', 'color:orange', modalHeader.prop('outerHTML'));
                        } else {
                            buttonClose.removeClass('btn-close').addClass('btn btn-default op-close-window opx-btn-flat opx-btn-icon').html('<i class="far fa-times"></i>');
                        }
                        if (options.minimizable) {
                            var buttonMin = $('<button type="button" class="btn btn-default opx-btn-flat opx-btn-icon js-min" ng-click="$ctrl.minimizeWindow($event)"><i class="far fa-minus"></i></button>');
                            insertButton(buttonMin);
                        }
                        if (options.resizable) {
                            var buttonMax = $('<button type="button" class="btn btn-default opx-btn-flat opx-btn-icon js-maxrestore" ng-click="$ctrl.maximizeWindow($event)"><i class="far fa-window"></i></button>');
                            buttonMax.on('click', function () {
                                var modalElem = $(this).closest('.modal');
                                var maximized = maximizeOrRestoreModal(modalElem);
                                setMaxIconAndCss(modalElem, maximized);
                            });
                            insertButton(buttonMax);
                        }

                        function insertButton(button) {
                            if (buttonClose.length > 0) {
                                button.insertBefore(buttonClose);
                            } else {
                                button.appendTo(modalHeader);
                            }
                        }
                    }
                });
                return modalInstance;

                function resetModalPosition(target) {
                    var pos = centerInContainer(target, $('body'), {top: 40});
                    target.css(pos);

                    /**
                     * Place an element in center of container
                     * @param target
                     * @param container
                     * @param {{top:number}} offset
                     * @return {{top: string, left: string}} In percent
                     */
                    function centerInContainer(target, container, offset) {
                        var containerSize = {width: container.width(), height: container.height()};
                        var SPACE = 16;
                        var tolerance = SPACE / 4;
                        var left = (containerSize.width - target.width()) / 2;
                        var top = (containerSize.height - target.height()) / 2;
                        var targetHeight = target.height();
                        if (target.height() === 0) {
                            // Content is not rendered yet
                            top = SPACE * 2;
                        }
                        // console.log('target.size: width=%s,height=%s', target.width(), target.height());
                        var refWindow = getTopModaless();
                        if (refWindow) {
                            var pos = refWindow.position();
                            if (Math.abs(pos.left - left) < tolerance) {
                                left += SPACE;
                            }
                            if (Math.abs(pos.top - top) < tolerance) {
                                top += SPACE;
                            }
                        }
                        // debugger;
                        // top = top + offset.top;
                        var leftPercent = (left / containerSize.width) * 100;
                        var topPercent = (top / containerSize.height) * 100;
                        return {left: leftPercent + '%', top: topPercent + '%'};
                    }

                    function getTopModaless() {
                        var top;
                        var max = 0;
                        $('.' + MODALESS_CSS).each(function () {
                            var elem = $(this);
                            var zIndex = parseInt(elem.css('z-index'));
                            // console.log('zindex', zIndex);
                            if (zIndex > max && !elem.is(target)) {
                                max = zIndex;
                                top = elem;
                            }
                        });
                        return top;
                    }
                }

                /**
                 *
                 * It will change target style of width and height
                 * @param {string|object} size
                 * @param target
                 * @param {string|number} size.height
                 * @param {string|number} size.width
                 * @param {number} size.aspectRatio
                 */
                function resetModalSize(size, target) {
                    if (size === 'FILL_CONTENT') {
                        var styles = calcMaxLayout(true).styles;
                        target.css(styles);
                        return;
                    }
                    if (!angular.isObject(size)) {
                        return;
                    }
                    if (!size.width && !size.height) {
                        return;
                    }
                    var result = {height: 0, width: 0, left: -1};
                    if (size.height) {
                        result.height = size.height;
                        target.css('height', result.height);
                    }
                    if (size.width) {
                        result.width = size.width;
                        target.css('width', result.width);
                    }
                    var container = $('body');
                    var containerSize = {width: container.width(), height: container.height()};
                    if (result.width && result.height) {
                        // Ignore aspect ratio
                    } else if (size.aspectRatio) {
                        var width, height;
                        if (result.height) {
                            width = target.height() * size.aspectRatio;
                            if (width > containerSize.width) {
                                width = containerSize.width;
                                height = width / size.aspectRatio;
                            }
                            target.css({width: width, height: height});
                        } else if (result.width) {
                            height = target.width() / size.aspectRatio;
                            if (height > containerSize.height) {
                                height = containerSize.height;
                                width = height * size.aspectRatio;
                            }
                            target.css({width: width, height: height});
                        }
                    }
                }
            }
        }
    }

)();

/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons'
		},
		button: {
			className: 'btn btn-default opx-btn-icon opx-btn-flat'
		},
		collection: {
			tag: 'ul',
			className: 'dt-button-collection dropdown-menu',
			button: {
				tag: 'li',
				className: 'dt-button',
				active: 'active',
				disabled: 'disabled'
			},
			buttonLiner: {
				tag: 'a',
				className: ''
			}
		}
	}
} );

DataTable.ext.buttons.collection.text = function ( dt ) {
	return dt.i18n('buttons.collection', 'Collection <span class="caret"/>');
};


return DataTable.Buttons;
}));

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/22/2017
 */
(function ($) {
    'use strict';
    angular.module('oplus.commons').run(['$translate', function ($translate) {
        initDataTables();

        /**
         * Global set datatables language
         */
        function initDataTables() {
            // console.log('initDataTables');
            $.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
                return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
                    return $('input', td).prop('checked') ? '1' : '0';
                });
            };

            $.extend(true, $.fn.dataTable.defaults, {
                //https://datatables.net/reference/option/language
                language: {
                    'emptyTable': '<p class="text-muted"><i class="fa fa-inbox"></i> ' + $translate.instant('common.datatable.empty_table') + '</p>',
                    'info': '_START_ - _END_ / _TOTAL_',
                    'infoEmpty': ' ',
                    'infoFiltered': $translate.instant('common.datatable.info_filtered'),
                    'infoPostFix': "",
                    'lengthMenu': '_MENU_',
                    // When using Ajax sourced data and during the first draw when DataTables is gathering the data, this message is shown in an empty row in the table to indicate to the end user the the data is being loaded. Note that this parameter is not used when loading data by server-side processing, just Ajax sourced data with client-side processing.
                    // 'loadingRecords': '<div class="lds-ellipsis" style="opacity: 0.25"><div></div><div></div><div></div><div></div></div>',
                    'loadingRecords': '&nbsp;',
                    // Text that is displayed when the table is processing a user action (usually a sort command or similar).
                    'processing': '<i class="fa fa-cog fa-spin"></i>',
                    // 'processing': '&nbsp;',
                    'paginate': {
                        'first': '&laquo;',
                        'previous': '&lsaquo;',
                        'next': '&rsaquo;',
                        'last': '&raquo;'
                    },
                    'search': "",
                    'searchPlaceholder': ' ', // Use non-empty placeholder to enable op-input-highlight-not-empty
                    'thousands': ',',
                    'zeroRecords': $translate.instant('common.datatable.zero_records')
                }
            });
        }
    }]);
})(jQuery);

/*!
 * HTML5 export buttons for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 *
 * FileSaver.js (1.3.3) - MIT license
 * Copyright © 2016 Eli Grey - http://eligrey.com
 */
/**
 * @author leoliaolei, 2022/01/12, modification marked as LEO@
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $, jszip, pdfmake) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document, jszip, pdfmake );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, jszip, pdfmake, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

// Allow the constructor to pass in JSZip and PDFMake from external requires.
// Otherwise, use globally defined variables, if they are available.
function _jsZip () {
	return jszip || window.JSZip;
}
function _pdfMake () {
	return pdfmake || window.pdfMake;
}

DataTable.Buttons.pdfMake = function (_) {
	if ( ! _ ) {
		return _pdfMake();
	}
	pdfmake = m_ake;
}

DataTable.Buttons.jszip = function (_) {
	if ( ! _ ) {
		return _jsZip();
	}
	jszip = _;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * FileSaver.js dependency
 */

/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

var _saveAs = (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));


// Expose file saver on the DataTables API. Can't attach to `DataTables.Buttons`
// since this file can be loaded before Button's core!
DataTable.fileSave = _saveAs;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local (private) functions
 */

/**
 * Get the sheet name for Excel exports.
 *
 * @param {object}	config Button configuration
 */
var _sheetname = function ( config )
{
	var sheetName = 'Sheet1';

	if ( config.sheetName ) {
		sheetName = config.sheetName.replace(/[\[\]\*\/\\\?\:]/g, '');
	}

	return sheetName;
};

/**
 * Get the newline character(s)
 *
 * @param {object}	config Button configuration
 * @return {string}				Newline character
 */
var _newLine = function ( config )
{
	return config.newline ?
		config.newline :
		navigator.userAgent.match(/Windows/) ?
			'\r\n' :
			'\n';
};

/**
 * Combine the data from the `buttons.exportData` method into a string that
 * will be used in the export file.
 *
 * @param	{DataTable.Api} dt		 DataTables API instance
 * @param	{object}				config Button configuration
 * @return {object}							 The data to export
 */
var _exportData = function ( dt, config )
{
	var newLine = _newLine( config );
	var data = dt.buttons.exportData( config.exportOptions );
	var boundary = config.fieldBoundary;
	var separator = config.fieldSeparator;
	var reBoundary = new RegExp( boundary, 'g' );
	var escapeChar = config.escapeChar !== undefined ?
		config.escapeChar :
		'\\';
	var join = function ( a ) {
		var s = '';

		// If there is a field boundary, then we might need to escape it in
		// the source data
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( i > 0 ) {
				s += separator;
			}

			s += boundary ?
				boundary + ('' + a[i]).replace( reBoundary, escapeChar+boundary ) + boundary :
				a[i];
		}

		return s;
	};

	var header = config.header ? join( data.header )+newLine : '';
	var footer = config.footer && data.footer ? newLine+join( data.footer ) : '';
	var body = [];

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		body.push( join( data.body[i] ) );
	}

	return {
		str: header + body.join( newLine ) + footer,
		rows: body.length
	};
};

/**
 * Older versions of Safari (prior to tech preview 18) don't support the
 * download option required.
 *
 * @return {Boolean} `true` if old Safari
 */
var _isDuffSafari = function ()
{
	var safari = navigator.userAgent.indexOf('Safari') !== -1 &&
		navigator.userAgent.indexOf('Chrome') === -1 &&
		navigator.userAgent.indexOf('Opera') === -1;

	if ( ! safari ) {
		return false;
	}

	var version = navigator.userAgent.match( /AppleWebKit\/(\d+\.\d+)/ );
	if ( version && version.length > 1 && version[1]*1 < 603.1 ) {
		return true;
	}

	return false;
};

/**
 * Convert from numeric position to letter for column names in Excel
 * @param  {int} n Column number
 * @return {string} Column letter(s) name
 */
function createCellPos( n ){
	var ordA = 'A'.charCodeAt(0);
	var ordZ = 'Z'.charCodeAt(0);
	var len = ordZ - ordA + 1;
	var s = "";

	while( n >= 0 ) {
		s = String.fromCharCode(n % len + ordA) + s;
		n = Math.floor(n / len) - 1;
	}

	return s;
}

try {
	var _serialiser = new XMLSerializer();
	var _ieExcel;
}
catch (t) {}

/**
 * Recursively add XML files from an object's structure to a ZIP file. This
 * allows the XSLX file to be easily defined with an object's structure matching
 * the files structure.
 *
 * @param {JSZip} zip ZIP package
 * @param {object} obj Object to add (recursive)
 */
function _addToZip( zip, obj ) {
	if ( _ieExcel === undefined ) {
		// Detect if we are dealing with IE's _awful_ serialiser by seeing if it
		// drop attributes
		_ieExcel = _serialiser
			.serializeToString(
				$.parseXML( excelStrings['xl/worksheets/sheet1.xml'] )
			)
			.indexOf( 'xmlns:r' ) === -1;
	}

	$.each( obj, function ( name, val ) {
		if ( $.isPlainObject( val ) ) {
			var newDir = zip.folder( name );
			_addToZip( newDir, val );
		}
		else {
			if ( _ieExcel ) {
				// IE's XML serialiser will drop some name space attributes from
				// from the root node, so we need to save them. Do this by
				// replacing the namespace nodes with a regular attribute that
				// we convert back when serialised. Edge does not have this
				// issue
				var worksheet = val.childNodes[0];
				var i, ien;
				var attrs = [];

				for ( i=worksheet.attributes.length-1 ; i>=0 ; i-- ) {
					var attrName = worksheet.attributes[i].nodeName;
					var attrValue = worksheet.attributes[i].nodeValue;

					if ( attrName.indexOf( ':' ) !== -1 ) {
						attrs.push( { name: attrName, value: attrValue } );

						worksheet.removeAttribute( attrName );
					}
				}

				for ( i=0, ien=attrs.length ; i<ien ; i++ ) {
					var attr = val.createAttribute( attrs[i].name.replace( ':', '_dt_b_namespace_token_' ) );
					attr.value = attrs[i].value;
					worksheet.setAttributeNode( attr );
				}
			}

			var str = _serialiser.serializeToString(val);

			// Fix IE's XML
			if ( _ieExcel ) {
				// IE doesn't include the XML declaration
				if ( str.indexOf( '<?xml' ) === -1 ) {
					str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+str;
				}

				// Return namespace attributes to being as such
				str = str.replace( /_dt_b_namespace_token_/g, ':' );

				// Remove testing name space that IE puts into the space preserve attr
				str = str.replace( /xmlns:NS[\d]+="" NS[\d]+:/g, '' );
			}

			// Safari, IE and Edge will put empty name space attributes onto
			// various elements making them useless. This strips them out
			str = str.replace( /<([^<>]*?) xmlns=""([^<>]*?)>/g, '<$1 $2>' );

			zip.file( name, str );
		}
	} );
}

/**
 * Create an XML node and add any children, attributes, etc without needing to
 * be verbose in the DOM.
 *
 * @param  {object} doc      XML document
 * @param  {string} nodeName Node name
 * @param  {object} opts     Options - can be `attr` (attributes), `children`
 *   (child nodes) and `text` (text content)
 * @return {node}            Created node
 */
function _createNode( doc, nodeName, opts ) {
	var tempNode = doc.createElement( nodeName );

	if ( opts ) {
		if ( opts.attr ) {
			$(tempNode).attr( opts.attr );
		}

		if ( opts.children ) {
			$.each( opts.children, function ( key, value ) {
				tempNode.appendChild( value );
			} );
		}

		if ( opts.text !== null && opts.text !== undefined ) {
			tempNode.appendChild( doc.createTextNode( opts.text ) );
		}
	}

	return tempNode;
}

/**
 * Get the width for an Excel column based on the contents of that column
 * @param  {object} data Data for export
 * @param  {int}    col  Column index
 * @return {int}         Column width
 */
function _excelColWidth( data, col ) {
	var max = data.header[col].length;
	var len, lineSplit, str;

	if ( data.footer && data.footer[col].length > max ) {
		max = data.footer[col].length;
	}

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		var point = data.body[i][col];
		str = point !== null && point !== undefined ?
			point.toString() :
			'';

		// If there is a newline character, workout the width of the column
		// based on the longest line in the string
		if ( str.indexOf('\n') !== -1 ) {
			lineSplit = str.split('\n');
			lineSplit.sort( function (a, b) {
				return b.length - a.length;
			} );

			len = lineSplit[0].length;
		}
		else {
			len = str.length;
		}

		if ( len > max ) {
			max = len;
		}

		// Max width rather than having potentially massive column widths
		if ( max > 40 ) {
			return 54; // 40 * 1.35
		}
	}

	max *= 1.35;

	// And a min width
	return max > 6 ? max : 6;
}

// Excel - Pre-defined strings to build a basic XLSX file
var excelStrings = {
	"_rels/.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
		'</Relationships>',

	"xl/_rels/workbook.xml.rels":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'+
			'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
		'</Relationships>',

	"[Content_Types].xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
			'<Default Extension="xml" ContentType="application/xml" />'+
			'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />'+
			'<Default Extension="jpeg" ContentType="image/jpeg" />'+
			'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />'+
			'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />'+
			'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />'+
		'</Types>',

	"xl/workbook.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
			'<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>'+
			'<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>'+
			'<bookViews>'+
				'<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>'+
			'</bookViews>'+
			'<sheets>'+
				'<sheet name="Sheet1" sheetId="1" r:id="rId1"/>'+
			'</sheets>'+
			'<definedNames/>'+
		'</workbook>',

	"xl/worksheets/sheet1.xml":
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<sheetData/>'+
			'<mergeCells count="0"/>'+
		'</worksheet>',

	"xl/styles.xml":
		'<?xml version="1.0" encoding="UTF-8"?>'+
		'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
			'<numFmts count="6">'+
				'<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>'+
				'<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>'+
				'<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>'+
				'<numFmt numFmtId="167" formatCode="0.0%"/>'+
				'<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>'+
				'<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>'+
			'</numFmts>'+
			'<fonts count="5" x14ac:knownFonts="1">'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<color rgb="FFFFFFFF" />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<b />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<i />'+
				'</font>'+
				'<font>'+
					'<sz val="11" />'+
					'<name val="Calibri" />'+
					'<u />'+
				'</font>'+
			'</fonts>'+
			'<fills count="6">'+
				'<fill>'+
					'<patternFill patternType="none" />'+
				'</fill>'+
				'<fill>'+ // Excel appears to use this as a dotted background regardless of values but
					'<patternFill patternType="none" />'+ // to be valid to the schema, use a patternFill
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD9D9D9" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="FFD99795" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6efce" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
				'<fill>'+
					'<patternFill patternType="solid">'+
						'<fgColor rgb="ffc6cfef" />'+
						'<bgColor indexed="64" />'+
					'</patternFill>'+
				'</fill>'+
			'</fills>'+
			'<borders count="2">'+
				'<border>'+
					'<left />'+
					'<right />'+
					'<top />'+
					'<bottom />'+
					'<diagonal />'+
				'</border>'+
				'<border diagonalUp="false" diagonalDown="false">'+
					'<left style="thin">'+
						'<color auto="1" />'+
					'</left>'+
					'<right style="thin">'+
						'<color auto="1" />'+
					'</right>'+
					'<top style="thin">'+
						'<color auto="1" />'+
					'</top>'+
					'<bottom style="thin">'+
						'<color auto="1" />'+
					'</bottom>'+
					'<diagonal />'+
				'</border>'+
			'</borders>'+
			'<cellStyleXfs count="1">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />'+
			'</cellStyleXfs>'+
			'<cellXfs count="67">'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="left"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="center"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="right"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment horizontal="fill"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment textRotation="90"/>'+
				'</xf>'+
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
					'<alignment wrapText="1"/>'+
				'</xf>'+
				'<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="1" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
				'<xf numFmtId="2" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
			'</cellXfs>'+
			'<cellStyles count="1">'+
				'<cellStyle name="Normal" xfId="0" builtinId="0" />'+
			'</cellStyles>'+
			'<dxfs count="0" />'+
			'<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />'+
		'</styleSheet>'
};
// Note we could use 3 `for` loops for the styles, but when gzipped there is
// virtually no difference in size, since the above can be easily compressed

// Pattern matching for special number formats. Perhaps this should be exposed
// via an API in future?
// Ref: section 3.8.30 - built in formatters in open spreadsheet
//   https://www.ecma-international.org/news/TC45_current_work/Office%20Open%20XML%20Part%204%20-%20Markup%20Language%20Reference.pdf
var _excelSpecials = [
	{ match: /^\-?\d+\.\d%$/,       style: 60, fmt: function (d) { return d/100; } }, // Precent with d.p.
	{ match: /^\-?\d+\.?\d*%$/,     style: 56, fmt: function (d) { return d/100; } }, // Percent
	{ match: /^\-?\$[\d,]+.?\d*$/,  style: 57 }, // Dollars
	{ match: /^\-?£[\d,]+.?\d*$/,   style: 58 }, // Pounds
	{ match: /^\-?€[\d,]+.?\d*$/,   style: 59 }, // Euros
	{ match: /^\-?\d+$/,            style: 65 }, // Numbers without thousand separators
	{ match: /^\-?\d+\.\d{2}$/,     style: 66 }, // Numbers 2 d.p. without thousands separators
	{ match: /^\([\d,]+\)$/,        style: 61, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets
	{ match: /^\([\d,]+\.\d{2}\)$/, style: 62, fmt: function (d) { return -1 * d.replace(/[\(\)]/g, ''); } },  // Negative numbers indicated by brackets - 2d.p.
	{ match: /^\-?[\d,]+$/,         style: 63 }, // Numbers with thousand separators
	{ match: /^\-?[\d,]+\.\d{2}$/,  style: 64 }  // Numbers with 2 d.p. and thousands separators
];



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */

//
// Copy to clipboard
//
DataTable.ext.buttons.copyHtml5 = {
	className: 'buttons-copy buttons-html5',

	text: function ( dt ) {
		return dt.i18n( 'buttons.copy', 'Copy' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var that = this;
		var exportData = _exportData( dt, config );
		var info = dt.buttons.exportInfo( config );
		var newline = _newLine(config);
		var output = exportData.str;
		var hiddenDiv = $('<div/>')
			.css( {
				height: 1,
				width: 1,
				overflow: 'hidden',
				position: 'fixed',
				top: 0,
				left: 0
			} );

		if ( info.title ) {
			output = info.title + newline + newline + output;
		}

		if ( info.messageTop ) {
			output = info.messageTop + newline + newline + output;
		}

		if ( info.messageBottom ) {
			output = output + newline + newline + info.messageBottom;
		}

		if ( config.customize ) {
			output = config.customize( output, config, dt );
		}

		var textarea = $('<textarea readonly/>')
			.val( output )
			.appendTo( hiddenDiv );

		// For browsers that support the copy execCommand, try to use it
		if ( document.queryCommandSupported('copy') ) {
			hiddenDiv.appendTo( dt.table().container() );
			textarea[0].focus();
			textarea[0].select();

			try {
				var successful = document.execCommand( 'copy' );
				hiddenDiv.remove();

				if (successful) {
					dt.buttons.info(
						dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ),
						dt.i18n( 'buttons.copySuccess', {
							1: 'Copied one row to clipboard',
							_: 'Copied %d rows to clipboard'
						}, exportData.rows ),
						2000
					);

					this.processing( false );
					return;
				}
			}
			catch (t) {}
		}

		// Otherwise we show the text box and instruct the user to use it
		var message = $('<span>'+dt.i18n( 'buttons.copyKeys',
				'Press <i>ctrl</i> or <i>\u2318</i> + <i>C</i> to copy the table data<br>to your system clipboard.<br><br>'+
				'To cancel, click this message or press escape.' )+'</span>'
			)
			.append( hiddenDiv );

		dt.buttons.info( dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ), message, 0 );

		// Select the text so when the user activates their system clipboard
		// it will copy that text
		textarea[0].focus();
		textarea[0].select();

		// Event to hide the message when the user is done
		var container = $(message).closest('.dt-button-info');
		var close = function () {
			container.off( 'click.buttons-copy' );
			$(document).off( '.buttons-copy' );
			dt.buttons.info( false );
		};

		container.on( 'click.buttons-copy', close );
		$(document)
			.on( 'keydown.buttons-copy', function (e) {
				if ( e.keyCode === 27 ) { // esc
					close();
					that.processing( false );
				}
			} )
			.on( 'copy.buttons-copy cut.buttons-copy', function () {
				close();
				that.processing( false );
			} );
	},

	exportOptions: {},

	fieldSeparator: '\t',

	fieldBoundary: '',

	header: true,

	footer: false,

	title: '*',

	messageTop: '*',

	messageBottom: '*'
};

//
// CSV export
//
DataTable.ext.buttons.csvHtml5 = {
	bom: false,

	className: 'buttons-csv buttons-html5',

	available: function () {
		return window.FileReader !== undefined && window.Blob;
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.csv', 'CSV' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		// Set the text
		var output = _exportData( dt, config ).str;
		var info = dt.buttons.exportInfo(config);
		var charset = config.charset;

		if ( config.customize ) {
			output = config.customize( output, config, dt );
		}

		if ( charset !== false ) {
			if ( ! charset ) {
				charset = document.characterSet || document.charset;
			}

			if ( charset ) {
				charset = ';charset='+charset;
			}
		}
		else {
			charset = '';
		}

		if ( config.bom ) {
			output = '\ufeff' + output;
		}

		_saveAs(
			new Blob( [output], {type: 'text/csv'+charset} ),
			info.filename,
			true
		);

		this.processing( false );
	},

	filename: '*',

	extension: '.csv',

	exportOptions: {},

	fieldSeparator: ',',

	fieldBoundary: '"',

	escapeChar: '"',

	charset: null,

	header: true,

	footer: false
};

//
// Excel (xlsx) export
//
DataTable.ext.buttons.excelHtml5 = {
	className: 'buttons-excel buttons-html5',

	available: function () {
		return window.FileReader !== undefined && _jsZip() !== undefined && ! _isDuffSafari() && _serialiser;
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'Excel' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var that = this;
		var rowPos = 0;
		var dataStartRow, dataEndRow;
		var getXml = function ( type ) {
			var str = excelStrings[ type ];

			//str = str.replace( /xmlns:/g, 'xmlns_' ).replace( /mc:/g, 'mc_' );

			return $.parseXML( str );
		};
		var rels = getXml('xl/worksheets/sheet1.xml');
		var relsGet = rels.getElementsByTagName( "sheetData" )[0];

		var xlsx = {
			_rels: {
				".rels": getXml('_rels/.rels')
			},
			xl: {
				_rels: {
					"workbook.xml.rels": getXml('xl/_rels/workbook.xml.rels')
				},
				"workbook.xml": getXml('xl/workbook.xml'),
				"styles.xml": getXml('xl/styles.xml'),
				"worksheets": {
					"sheet1.xml": rels
				}

			},
			"[Content_Types].xml": getXml('[Content_Types].xml')
		};

		var data = dt.buttons.exportData( config.exportOptions );
		var currentRow, rowNode;
		var addRow = function ( row ) {
			currentRow = rowPos+1;
			rowNode = _createNode( rels, "row", { attr: {r:currentRow} } );

			for ( var i=0, ien=row.length ; i<ien ; i++ ) {
				// Concat both the Cell Columns as a letter and the Row of the cell.
				var cellId = createCellPos(i) + '' + currentRow;
				var cell = null;

				// For null, undefined of blank cell, continue so it doesn't create the _createNode
				if ( row[i] === null || row[i] === undefined || row[i] === '' ) {
					if ( config.createEmptyCells === true ) {
						row[i] = '';
					}
					else {
						continue;
					}
				}
                // console.log('typeof cell=%o',typeof originalContent);
                //LEO@20220112: Prevent string be formated as scientific number, "12345678901234600000" to 1.23457E+19
                if (typeof row[i]==='string') {
					if(row[i].match(/^\d+/)){
						//http://live.datatables.net/jediqemo/1/edit
						//https://datatables.net/forums/discussion/49785/export-to-xls-not-working-for-31-character#latest
						//Unicode Character 'ZERO WIDTH NON-JOINER' (U+200C)
                   		row[i]='\u200C'+row[i];
                    }
				}
				var originalContent = row[i];
				row[i] = $.trim( row[i] );

				// Special number formatting options
				for ( var j=0, jen=_excelSpecials.length ; j<jen ; j++ ) {
					var special = _excelSpecials[j];

					// TODO Need to provide the ability for the specials to say
					// if they are returning a string, since at the moment it is
					// assumed to be a number
					if ( row[i].match && ! row[i].match(/^0\d+/) && row[i].match( special.match ) ) {
						var val = row[i].replace(/[^\d\.\-]/g, '');

						if ( special.fmt ) {
							val = special.fmt( val );
						}

						cell = _createNode( rels, 'c', {
							attr: {
								r: cellId,
								s: special.style
							},
							children: [
								_createNode( rels, 'v', { text: val } )
							]
						} );

						break;
					}
				}

				if ( ! cell ) {
					if ( typeof row[i] === 'number' || (
						row[i].match &&
						row[i].match(/^-?\d+(\.\d+)?$/) &&
						! row[i].match(/^0\d+/) )
					) {
						// Detect numbers - don't match numbers with leading zeros
						// or a negative anywhere but the start
						cell = _createNode( rels, 'c', {
							attr: {
								t: 'n',
								r: cellId
							},
							children: [
								_createNode( rels, 'v', { text: row[i] } )
							]
						} );
					}
					else {
						// String output - replace non standard characters for text output
						var text = ! originalContent.replace ?
							originalContent :
							originalContent.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

						cell = _createNode( rels, 'c', {
							attr: {
								t: 'inlineStr',
								r: cellId
							},
							children:{
								row: _createNode( rels, 'is', {
									children: {
										row: _createNode( rels, 't', {
											text: text,
											attr: {
												'xml:space': 'preserve'
											}
										} )
									}
								} )
							}
						} );
					}
				}

				rowNode.appendChild( cell );
			}

			relsGet.appendChild(rowNode);
			rowPos++;
		};

		if ( config.customizeData ) {
			config.customizeData( data );
		}

		var mergeCells = function ( row, colspan ) {
			var mergeCells = $('mergeCells', rels);

			mergeCells[0].appendChild( _createNode( rels, 'mergeCell', {
				attr: {
					ref: 'A'+row+':'+createCellPos(colspan)+row
				}
			} ) );
			mergeCells.attr( 'count', parseFloat(mergeCells.attr( 'count' ))+1 );
			$('row:eq('+(row-1)+') c', rels).attr( 's', '51' ); // centre
		};

		// Title and top messages
		var exportInfo = dt.buttons.exportInfo( config );
		if ( exportInfo.title ) {
			addRow( [exportInfo.title], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		if ( exportInfo.messageTop ) {
			addRow( [exportInfo.messageTop], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}


		// Table itself
		if ( config.header ) {
			addRow( data.header, rowPos );
			$('row:last c', rels).attr( 's', '2' ); // bold
		}

		dataStartRow = rowPos;

		for ( var n=0, ie=data.body.length ; n<ie ; n++ ) {
			// console.log('addRow:data.body[n]=%o',data.body[n])
			addRow( data.body[n], rowPos );
		}

		dataEndRow = rowPos;

		if ( config.footer && data.footer ) {
			addRow( data.footer, rowPos);
			$('row:last c', rels).attr( 's', '2' ); // bold
		}

		// Below the table
		if ( exportInfo.messageBottom ) {
			addRow( [exportInfo.messageBottom], rowPos );
			mergeCells( rowPos, data.header.length-1 );
		}

		// Set column widths
		var cols = _createNode( rels, 'cols' );
		$('worksheet', rels).prepend( cols );

		for ( var i=0, ien=data.header.length ; i<ien ; i++ ) {
			cols.appendChild( _createNode( rels, 'col', {
				attr: {
					min: i+1,
					max: i+1,
					width: _excelColWidth( data, i ),
					customWidth: 1
				}
			} ) );
		}

		// Auto filter for columns
		$('mergeCells', rels).before( _createNode( rels, 'autoFilter', {
			attr: {
				ref: 'A'+dataStartRow+':'+createCellPos(data.header.length-1)+dataEndRow
			}
		} ) );

		// Workbook modifications
		var workbook = xlsx.xl['workbook.xml'];

		$( 'sheets sheet', workbook ).attr( 'name', _sheetname( config ) );

		if ( config.autoFilter ) {
			$('definedNames', workbook).append( _createNode( workbook, 'definedName', {
				attr: {
					name: '_xlnm._FilterDatabase',
					localSheetId: '0',
					hidden: 1
				},
				text: _sheetname(config)+'!$A$'+dataStartRow+':'+createCellPos(data.header.length-1)+dataEndRow
			} ) );
		}

		// Let the developer customise the document if they want to
		if ( config.customize ) {
			config.customize( xlsx, config, dt );
		}

		// Excel doesn't like an empty mergeCells tag
		if ( $('mergeCells', rels).children().length === 0 ) {
			$('mergeCells', rels).remove();
		}

		var jszip = _jsZip();
		var zip = new jszip();
		var zipConfig = {
			type: 'blob',
			mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		};

		_addToZip( zip, xlsx );

		if ( zip.generateAsync ) {
			// JSZip 3+
			zip
				.generateAsync( zipConfig )
				.then( function ( blob ) {
					_saveAs( blob, exportInfo.filename );
					that.processing( false );
				} );
		}
		else {
			// JSZip 2.5
			_saveAs(
				zip.generate( zipConfig ),
				exportInfo.filename
			);
			this.processing( false );
		}
	},

	filename: '*',

	extension: '.xlsx',

	exportOptions: {},

	header: true,

	footer: false,

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	createEmptyCells: false,

	autoFilter: false,

	sheetName: ''
};

//
// PDF export - using pdfMake - http://pdfmake.org
//
DataTable.ext.buttons.pdfHtml5 = {
	className: 'buttons-pdf buttons-html5',

	available: function () {
		return window.FileReader !== undefined && _pdfMake();
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.pdf', 'PDF' );
	},

	action: function ( e, dt, button, config ) {
		this.processing( true );

		var that = this;
		var data = dt.buttons.exportData( config.exportOptions );
		var info = dt.buttons.exportInfo( config );
		var rows = [];

		if ( config.header ) {
			rows.push( $.map( data.header, function ( d ) {
				return {
					text: typeof d === 'string' ? d : d+'',
					style: 'tableHeader'
				};
			} ) );
		}

		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			rows.push( $.map( data.body[i], function ( d ) {
				if ( d === null || d === undefined ) {
					d = '';
				}
				return {
					text: typeof d === 'string' ? d : d+'',
					style: i % 2 ? 'tableBodyEven' : 'tableBodyOdd'
				};
			} ) );
		}

		if ( config.footer && data.footer) {
			rows.push( $.map( data.footer, function ( d ) {
				return {
					text: typeof d === 'string' ? d : d+'',
					style: 'tableFooter'
				};
			} ) );
		}

		var doc = {
			pageSize: config.pageSize,
			pageOrientation: config.orientation,
			content: [
				{
					table: {
						headerRows: 1,
						body: rows
					},
					layout: 'noBorders'
				}
			],
			styles: {
				tableHeader: {
					bold: true,
					fontSize: 11,
					color: 'white',
					fillColor: '#2d4154',
					alignment: 'center'
				},
				tableBodyEven: {},
				tableBodyOdd: {
					fillColor: '#f3f3f3'
				},
				tableFooter: {
					bold: true,
					fontSize: 11,
					color: 'white',
					fillColor: '#2d4154'
				},
				title: {
					alignment: 'center',
					fontSize: 15
				},
				message: {}
			},
			defaultStyle: {
				fontSize: 10
			}
		};

		if ( info.messageTop ) {
			doc.content.unshift( {
				text: info.messageTop,
				style: 'message',
				margin: [ 0, 0, 0, 12 ]
			} );
		}

		if ( info.messageBottom ) {
			doc.content.push( {
				text: info.messageBottom,
				style: 'message',
				margin: [ 0, 0, 0, 12 ]
			} );
		}

		if ( info.title ) {
			doc.content.unshift( {
				text: info.title,
				style: 'title',
				margin: [ 0, 0, 0, 12 ]
			} );
		}

		if ( config.customize ) {
			config.customize( doc, config, dt );
		}

		var pdf = _pdfMake().createPdf( doc );

		if ( config.download === 'open' && ! _isDuffSafari() ) {
			pdf.open();
		}
		else {
			pdf.download( info.filename );
		}

		this.processing( false );
	},

	title: '*',

	filename: '*',

	extension: '.pdf',

	exportOptions: {},

	orientation: 'portrait',

	pageSize: 'A4',

	header: true,

	footer: false,

	messageTop: '*',

	messageBottom: '*',

	customize: null,

	download: 'download'
};


return DataTable.Buttons;
}));

/**
 * Sometimes for quick navigation, it can be useful to allow an end user to
 * enter which page they wish to jump to manually. This paging control uses a
 * text input box to accept new paging numbers (arrow keys are also allowed
 * for), and four standard navigation buttons are also presented to the end
 * user.
 *
 *  @name Navigation with text input
 *  @summary Shows an input element into which the user can type a page number
 *  @author [Allan Jardine](http://sprymedia.co.uk)
 *  @author [Gordey Doronin](http://github.com/GDoronin)
 *
 *  @example
 *    $(document).ready(function() {
 *        $('#example').dataTable( {
 *            "pagingType": "input"
 *        } );
 *    } );
 */

(function ($) {
    function calcDisableClasses(oSettings) {
        var start = oSettings._iDisplayStart;
        var length = oSettings._iDisplayLength;
        var visibleRecords = oSettings.fnRecordsDisplay();
        var all = length === -1;

        // Gordey Doronin: Re-used this code from main jQuery.dataTables source code. To be consistent.
        var page = all ? 0 : Math.ceil(start / length);
        var pages = all ? 1 : Math.ceil(visibleRecords / length);

        var disableFirstPrevClass = (page > 0 ? '' : oSettings.oClasses.sPageButtonDisabled);
        var disableNextLastClass = (page < pages - 1 ? '' : oSettings.oClasses.sPageButtonDisabled);

        return {
            'first': disableFirstPrevClass,
            'previous': disableFirstPrevClass,
            'next': disableNextLastClass,
            'last': disableNextLastClass
        };
    }

    function calcCurrentPage(oSettings) {
        return Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
    }

    function calcPages(oSettings) {
        return Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength);
    }

    var firstClassName = 'first';
    var previousClassName = 'previous';
    var nextClassName = 'next';
    var lastClassName = 'last';

    var paginateClassName = 'paginate';
    var paginatePageClassName = 'paginate_page';
    var paginateInputClassName = 'paginate_input';
    var paginateTotalClassName = 'paginate_total';

    $.fn.dataTableExt.oPagination.input = {
        'fnInit': function (oSettings, nPaging, fnCallbackDraw) {
            var nFirst = document.createElement('span');
            var nPrevious = document.createElement('span');
            var nNext = document.createElement('span');
            var nLast = document.createElement('span');
            var nInput = document.createElement('input');
            var nTotal = document.createElement('span');
            var nInfo = document.createElement('span');

            var language = oSettings.oLanguage.oPaginate;
            var classes = oSettings.oClasses;
            var info = language.info || '_INPUT_ / _TOTAL_';

            // nFirst.innerHTML = language.sFirst;
            // nPrevious.innerHTML = language.sPrevious;
            // nNext.innerHTML = language.sNext;
            // nLast.innerHTML = language.sLast;
            nFirst.innerHTML = '<i class="far fa-angle-double-left"></i>';
            nPrevious.innerHTML = '<i class="far fa-angle-left"></i>';
            nNext.innerHTML = '<i class="far fa-angle-right"></i>';
            nLast.innerHTML = '<i class="far fa-angle-double-right"></i>';
            var extraCss = ' btn btn-outline-default opx-btn-icon';

            nFirst.className = firstClassName + ' ' + classes.sPageButton + ' ' + extraCss;
            nPrevious.className = previousClassName + ' ' + classes.sPageButton + ' ' + extraCss;
            nNext.className = nextClassName + ' ' + classes.sPageButton + ' ' + extraCss;
            nLast.className = lastClassName + ' ' + classes.sPageButton + ' ' + extraCss;

            nInput.className = paginateInputClassName;
            nTotal.className = paginateTotalClassName;

            if (oSettings.sTableId !== '') {
                nPaging.setAttribute('id', oSettings.sTableId + '_' + paginateClassName);
                nFirst.setAttribute('id', oSettings.sTableId + '_' + firstClassName);
                nPrevious.setAttribute('id', oSettings.sTableId + '_' + previousClassName);
                nNext.setAttribute('id', oSettings.sTableId + '_' + nextClassName);
                nLast.setAttribute('id', oSettings.sTableId + '_' + lastClassName);
            }

            nInput.type = 'text';

            info = info.replace(/_INPUT_/g, '</span>' + nInput.outerHTML + '<span>');
            info = info.replace(/_TOTAL_/g, '</span>' + nTotal.outerHTML + '<span>');
            nInfo.innerHTML = '<span>' + info + '</span>';

            $(nInfo).children().each(function (i, n) {
                nPaging.appendChild(n);
            });
            var btnGroup = $('<div class="btn-group btn-group-sm ms-3"></div>');

            btnGroup.append(nFirst);
            btnGroup.append(nPrevious);
            btnGroup.append(nNext);
            btnGroup.append(nLast);
            nPaging.appendChild(btnGroup.get(0));


            $(nFirst).click(function () {
                var iCurrentPage = calcCurrentPage(oSettings);
                if (iCurrentPage !== 1) {
                    oSettings.oApi._fnPageChange(oSettings, 'first');
                    fnCallbackDraw(oSettings);
                }
            });

            $(nPrevious).click(function () {
                var iCurrentPage = calcCurrentPage(oSettings);
                if (iCurrentPage !== 1) {
                    oSettings.oApi._fnPageChange(oSettings, 'previous');
                    fnCallbackDraw(oSettings);
                }
            });

            $(nNext).click(function () {
                var iCurrentPage = calcCurrentPage(oSettings);
                if (iCurrentPage !== calcPages(oSettings)) {
                    oSettings.oApi._fnPageChange(oSettings, 'next');
                    fnCallbackDraw(oSettings);
                }
            });

            $(nLast).click(function () {
                var iCurrentPage = calcCurrentPage(oSettings);
                if (iCurrentPage !== calcPages(oSettings)) {
                    oSettings.oApi._fnPageChange(oSettings, 'last');
                    fnCallbackDraw(oSettings);
                }
            });

            $(nPaging).find('.' + paginateInputClassName).keyup(function (e) {
                // 38 = up arrow, 39 = right arrow
                if (e.which === 38 || e.which === 39) {
                    this.value++;
                }
                // 37 = left arrow, 40 = down arrow
                else if ((e.which === 37 || e.which === 40) && this.value > 1) {
                    this.value--;
                }

                if (this.value === '' || this.value.match(/[^0-9]/)) {
                    /* Nothing entered or non-numeric character */
                    this.value = this.value.replace(/[^\d]/g, ''); // don't even allow anything but digits
                    return;
                }

                var iNewStart = oSettings._iDisplayLength * (this.value - 1);
                if (iNewStart < 0) {
                    iNewStart = 0;
                }
                if (iNewStart >= oSettings.fnRecordsDisplay()) {
                    iNewStart = (Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength;
                }

                oSettings._iDisplayStart = iNewStart;
                oSettings.oInstance.trigger("page.dt", oSettings);
                fnCallbackDraw(oSettings);
            });

            // Take the brutal approach to cancelling text selection.
            $('span', nPaging).bind('mousedown', function () {
                return false;
            });
            $('span', nPaging).bind('selectstart', function () {
                return false;
            });

            // If we can't page anyway, might as well not show it.
            var iPages = calcPages(oSettings);
            if (iPages <= 1) {
                $(nPaging).hide();
            }
        },

        'fnUpdate': function (oSettings) {
            if (!oSettings.aanFeatures.p) {
                return;
            }

            var iPages = calcPages(oSettings);
            var iCurrentPage = calcCurrentPage(oSettings);

            var an = oSettings.aanFeatures.p;
            var pagingWrapper = $(an);
            if (iPages <= 1) // hide paging when we can't page
            {
                pagingWrapper.hide();
                return;
            }

            var disableClasses = calcDisableClasses(oSettings);

            pagingWrapper.show();

            // Enable/Disable `first` button.
            pagingWrapper.find('.' + firstClassName)
                .removeClass(oSettings.oClasses.sPageButtonDisabled)
                .addClass(disableClasses[firstClassName]);

            // Enable/Disable `prev` button.
            pagingWrapper.find('.' + previousClassName)
                .removeClass(oSettings.oClasses.sPageButtonDisabled)
                .addClass(disableClasses[previousClassName]);

            // Enable/Disable `next` button.
            pagingWrapper.find('.' + nextClassName)
                .removeClass(oSettings.oClasses.sPageButtonDisabled)
                .addClass(disableClasses[nextClassName]);

            // Enable/Disable `last` button.
            pagingWrapper.find('.' + lastClassName)
                .removeClass(oSettings.oClasses.sPageButtonDisabled)
                .addClass(disableClasses[lastClassName]);

            // Paginate of N pages text
            pagingWrapper.find('.' + paginateTotalClassName).html(iPages);

            // Current page number input value
            pagingWrapper.find('.' + paginateInputClassName).val(iCurrentPage);
        }
    };
})(jQuery);
/**
 *
 * @author Joker.Liu create on 2020/03/27
 */
(function () {
    'use strict';
    /**
     * @ngdoc directive
     * @name opDatatable
     * @description
     * init <table> to jquery datatable
     * @restrict C
     * @example
     *  <table class="oplus-datatable table table-striped table-hover" columns="xxx" datas="xxx" options="xxx"></table>
     * @param {array} column define
     * @param {array} table datas, if this data is queried asynchronous, the initial value should be undefiend;  if the options.ajax.url is not empty, the directive will ignore table datas
     * @param {object} options
     */
    angular.module('oplus.commons').directive('opDatatable', ['$compile', 'dataTable', opDatatable]);

    function opDatatable($compile, dataTable) {
        return {
            restrict: 'C',
            scope: {

            },
            bindToController: {
                columns: '<',
                datas: '<',
                options: '<'
            },
            controller: function () {

            },
            controllerAs: 'opDatatableVm',
            link: function (scope, element, attrs, ctrl) {
                console.log("Run link");
                if (ctrl.options && options.ajax && options.ajax.url) {
                    dataTable.initTable(element, ctrl.columns, undefined, ctrl.options);
                } else {
                    scope.$watch('opDatatableVm.datas', function (newVal, oldVal) {
                        if (newVal) {
                            dataTable.initTable(element, ctrl.columns, ctrl.datas, ctrl.options);
                        }
                    });
                }
            }
        };

    }
})();

/**
 *
 * @author Joker.Liu create on 2020/03/27
 */
(function () {
        'use strict';

        /**
         * @memberof oplus.commons
         * @ngdoc service
         * @name dataTable
         * @description
         * Service to init jquery datatable
         */
        angular.module('oplus.commons').service('dataTable', dataTable);
        dataTable.$inject = ['$q', '$timeout', '$filter', 'currentUser','$translate'];

        function dataTable($q, $timeout, $filter, currentUser,$translate) {

            /**
             * init datatable and return api instance
             * It is recommended to call this method after getting table data by $http, but you can also set ajax url in some special case.
             * The http request send by  $http will be catch by the web framework and adding some necessary headers
             *
             * use options.buttons['colvis'] to control column selector button
             * use options.buttons['excelHtml5'] to control excel export button
             * use options.disableSearch to remove input for searching
             *
             * eg:
             * 1. none server side
             * var datatableApi = dataTable.initTable(".demo-table", columnDefines, tableDatas);
             * 2. server side
             *  var datatableApi = dataTable.initTable(".demo-table", columnDefines, {},{
             *      serverSide: true,
             *      ajax: {url: 'http://xxx/demo/table'}
             *  });
             *
             * @param selector jquery selector
             * @param columns columns define
             * @param datas table datas
             * @param options raw option of jquery dataTables, if you not have special config, let it empty,
             * @deprecated Use {OpDatatable}
             * @returns {*} instance of datatable api
             */
            function initTable(selector, columns, datas, options) {
                var deferred = $q.defer();

                options = options ? options : {};

                var defaultOptions = {
                    order: [[0, 'asc']],
                    autoWidth: true,
                    deferRender: true,
                    processing: true,
                    lengthMenu: [10, 25, 50, 100],
                    // scrollX: true,
                    // scrollY: 600,//高度最大为600px,再大就上下滚动显示
                    // scrollCollapse: true,
                    // stateSave: true,
                    colReorder: true,
                    // destroy: true,//销毁已有实例，重新创建新的实例
                    // retrieve: true,//加载已有实例
                    serverSide: false,
                    // columns: [],
                    // ordering: true,//启用或禁止排序
                    // order: [[ 0, 'asc' ], [ 1, 'asc' ]],//列默认排序
                    // "orderFixed": {//始终被排序的列
                    //     "pre": [ 0, 'asc' ],//相对于用户手动排序，具有高优先级
                    //     "post": [ 1, 'asc' ]//低优先级
                    // }
                    buttons: [],
                    pagingType: "full_numbers",
                    dom: '<"dataTables_header pt-3"<"dataTables_toolbar" <"dataTables_accurate_query pull-left m-t-sm"><"dataTables_controls" r><"dataTables_buttons pull-right m-r-sm" B>'
                        + (options.disableSearch ? '' : 'f')
                        + '>>t<"dataTables_footer row"<"col-md-6" <"pull-left" l><"pull-left" i>><"col-md-6"p>><"clearfix">',
                    createdRow: function (row, data, dataIndex) {
                    },
                    // ajaxSource: 'app/api/datatable.json',
                    // ajax: {
                    //     url: "app/api/datatable.json",
                    //     type: "GET",
                    //     dataSrc: "aaData"
                    // },
                    ajax: function (data, callback) {
                        callback(
                            {
                                totalRecords: datas.length,
                                aaData: datas
                            }
                        );
                    }
                };


                var tableOption = $.extend(true, {aoColumns: columns}, defaultOptions);

                //query table data by jquery ajax, server side must in that way
                //serverSide must be false when datas not empty
                if (typeof options.ajax === "object") {
                    //Define properties for jQuery.ajax.
                    // console.log("authToken = " + currentUser.authToken);
                    // console.log("tenantId = " + currentUser.tenantId);
                    $.extend(true, tableOption, {
                        ajax: {
                            dataSrc: "data",
                            dataType: "json",
                            headers: {
                                "Authorization": 'Bearer ' + currentUser.authToken,
                                "Tenant-id": currentUser.tenantId
                            }
                        }
                    });
                }

                $.extend(true, tableOption, options);

                //列选择
                var colvisBtn = tableOption.buttons.indexOf('colvis');
                if (colvisBtn !== -1) {
                    tableOption.buttons.splice(colvisBtn, 1,
                        {
                            extend: 'colvis',
                            className: "btn-sm",
                            text: '<i class="icon fa fa-columns" data-toggle="tooltip" data-placement="bottom" title="'+$translate.instant('common.table.select_column')+'"></i>',
                            columnText: function (dt, idx, title) {
                                return (idx + 1) + ': ' + title;
                            }
                        }
                    );
                }

                //导出表格
                var excelHtml5Btn = tableOption.buttons.indexOf('excelHtml5');
                if (excelHtml5Btn !== -1) {
                    tableOption.buttons.splice(excelHtml5Btn, 1,
                        {
                            extend: 'excelHtml5',
                            className: "btn-sm",
                            title: 'data_export_' + $filter('date')((new Date()), "yyyy-MM-dd_HH-mm-ss"),
                            text: '<i class="icon fa fa-file-excel-o" data-toggle="tooltip" data-placement="bottom" title="'+$translate.instant('common.table.table_export')+'"></i>'
                        }
                    );
                }

                $timeout(function () {
                    //the difference between $( selector ).DataTable() and $( selector ).dataTable(). The former returns a DataTables API instance, while the latter returns a jQuery object.
                    // var api = $(selector).DataTable();
                    var api = new $.fn.dataTable.Api(selector);
                    //if the target table has been initialized
                    if (api.init()) {
                        console.log("Run fnDestroy");
                        $(selector).dataTable().fnDestroy();
                    }

                    deferred.resolve(angular.element(selector).DataTable(tableOption));
                }, 100);

                return deferred.promise;
            }


            return {
                initTable: initTable
            };

        }
    }

)();

/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-xs-12 col-md-6'l><'col-xs-12 col-md-6'f>>" +
		"<'row'<'col-xs-12'tr>>" +
		"<'row'<'col-xs-12 col-md-5'i><'col-xs-12 col-md-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
    // LEO@20200324: Remove form-inline because it's flex in bs4
	// sWrapper:      "dataTables_wrapper form-inline dt-bootstrap4",
	sWrapper:      "dataTables_wrapper dt-bootstrap4",
	sFilterInput:  "js-dt-filter form-control op-input-highlight-not-empty",
	sLengthSelect: "js-dt-length form-control",
	sProcessing:   "dataTables_processing card card-default",
	sPageButton:   "paginate_button page-item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex,
								'class': 'page-link'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
};


return DataTable;
}));

/**! ColResize 2.5.4
 * ©2017 Steven Masala
 */

/**
 * @summary ColResize
 * @description Provide the ability to resize the columns in a DataTable
 * @version 2.5.4
 * @file dataTables.colResize.js
 * @author Steven Masala <me@smasala.com>
 * @copyright Copyright 2017 Steven Masala
 *
 * This source file is free software, available under the following license:
 *   MIT license - https://github.com/smasala/ColResize/blob/master/LICENSE
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // amd
        define(["jquery", "datatables.net"], function ($) {
            return factory($, window, document);
        });
    } else if (typeof exports === "object") {
        // CommonJs
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }
            if (!$ || !$.fn.dataTable) {
                $ = require("datatables.net")(root, $).$;
            }
            return factory($, root, root.document);
        };
    } else {
        factory(jQuery, window, document);
    }
}(function ($, window, document) {
    "use strict";
    var DataTable = $.fn.dataTable;

    // Sanity check that we are using DataTables 1.10 or newer
    if (!DataTable.versionCheck || !DataTable.versionCheck('1.10.15')) {
        throw 'DataTables ColResize requires DataTables 1.10.15 or newer';
    }

    var ColResize = function (dt, userOptions) {
        var dtInstance = new DataTable.Api(dt),
            settings = dtInstance.settings()[0];

        if (settings.colResize) {
            // already exists on this instance
            return;
        }
        this.options = $.extend(true, {}, this._defaults, userOptions);
        this.init(dtInstance);
        settings.colResize = this;
    };

    $.extend(ColResize.prototype, {
        /**
         * Extension version number
         * @static
         * @property version
         * @type {string} semVer
         */
        version: "2.5.4",
        /**
         * Default options for extension
         * @property _defaults
         * @type {object}
         * @private
         */
        _defaults: {
            /**
             * Determines the minimum width size a column is allowed to be
             * @property minColumnWidth
             * @public
             * @type {integer}
             * @default 20
             */
            minColumnWidth: 20,
            /**
             * Height of the table body
             * @property scrollY
             * @public
             * @type {integer|string|false}
             * @default false
             */
            scrollY: false,
            /**
             * Resizes the table instead of shrinking the next column
             * when a specific column is resized
             * @property resizeTable
             * @public
             * @type {boolean}
             * @default false
             */
            resizeTable: false
        },
        /**
         * Created during extension init
         * {} <= defaults <= userOptions
         * @property options
         * @type {object}
         * @public
         * @default {null}
         */
        options: null,
        /**
         * Wrapper which is created around the <table>
         * @property _wrapper
         * @private
         * @type {jQuery}
         * @default null
         */
        _wrapper: null,
        /**
         * Current jquery table element
         * @property _table
         * @type {jQuery}
         * @private
         * @default {null}
         */
        _table: null,
        /**
         * Current jquery table body element
         * @property _tableBody
         * @type {jQuery}
         * @private
         * @default {null}
         */
        _tableBody: null,
        /**
         * Current jquery "th" elements
         * @property _tableHeaders
         * @type {jQuery}
         * @private
         * @default null
         */
        _tableHeaders: null,
        /**
         * Datatables instance
         * @property _dtInstance
         * @type {DataTables.Api}
         * @private
         * @default {null}
         */
        _dtInstance: null,
        /**
         * Is column currently being dragged?
         * internal flag
         * @property _isDragging
         * @type {boolean}
         * @private
         * @default {false}
         */
        _isDragging: false,
        /**
         * Element cache variable.
         * @property _container
         * @type {jQuery}
         * @private
         * @default null
         */
        _container: null,
        /**
         * Scroller Wrapper div used to show y scroll bar
         * @property _scrollWrapper
         * @type {jQuery}
         * @private
         * @default null
         */
        _scrollWrapper: null,
        /**
         * Mimics the tbody height
         * @property _scrollContent
         * @type {jQuery}
         * @private
         * @default null
         */
        _scrollContent: null,
        /**
         * Array of all generated draggable columns.
         * @property _columns
         * @type {jQuery[]}
         * @private
         * @default null
         */
        _columns: null,
        /**
         * Array of index numbers of the columns which have been updated
         * this is an internal cache which is used to only update the widths
         * of the <td> element in columns that were changed by the user,
         * for example on page change.
         * @property _updatedColumns
         * @type {interger[]}
         * @private
         * @default []
         */
        _updatedColumns: [],
        /**
         * Events cache object to store registered events and listeners
         * @example
         *      {
         *          "click": [ [$el1, callbackFunction], [$el2, callbackFunction2] ]
         *      }
         * @private
         * @property _events
         * @type {object}
         * @default
         */
        _events: {},
        /**
         * Interval value used to check if the table height has changed.
         * @property _tableHeight
         * @type {integer}
         * @private
         * @default 0
         */
        _tableHeight: 0,
        /**
         * css class for container which the table is wrapped in.
         * @private
         * @property CLASS_TABLE_WRAPPER
         * @type {string}
         * @private
         * @default "dt-colresizable-table-wrapper"
         */
        CLASS_TABLE_WRAPPER: "dt-colresizable-table-wrapper",
        /**
         * css class for draggable container
         * @private
         * @property CLASS_WRAPPER
         * @type {string}
         * @private
         * @default "dt-colresizable"
         */
        CLASS_WRAPPER: "dt-colresizable",
        /**
         * css class for draggable column
         * @private
         * @property CLASS_COLUMN
         * @type {string}
         * @private
         * @default "dt-colresizable-col"
         */
        CLASS_COLUMN: "dt-colresizable-col",
        /**
         * css class for css conditional scroller identifier
         * @private
         * @property CLASS_SCROLLER_HASWRAPPER
         * @type {string}
         * @private
         * @default "dt-colresizable-with-scroller"
         */
        CLASS_SCROLLER_HASWRAPPER: "dt-colresizable-with-scroller",
        /**
         * css class for scroller wrapper div
         * @private
         * @property CLASS_SCROLLER_WRAPPER
         * @type {string}
         * @private
         * @default "dt-colresizable-scroller-wrapper"
         */
        CLASS_SCROLLER_WRAPPER: "dt-colresizable-scroller-wrapper",
        /**
         * css class for scroller content mimic div
         * @private
         * @property CLASS_SCROLLER_CONTENT_WRAPPER
         * @type {string}
         * @private
         * @default "dt-colresizable-scroller-content-wrapper"
         */
        CLASS_SCROLLER_CONTENT_WRAPPER: "dt-colresizable-scroller-content-wrapper",
        /**
         * data tag name to save the column width <th>
         * saved on the draggable col <div>
         * @private
         * @property DATA_TAG_WIDTH
         * @type {string}
         * @private
         * @default "dt-colresizable-width"
         */
        DATA_TAG_WIDTH: "dt-colresizable-width",
        /**
         * data tag name to save the column item <th>
         * saved on the draggable col <div>
         * @private
         * @property DATA_TAG_ITEM
         * @type {string}
         * @private
         * @default "dt-colresizable-item"
         */
        DATA_TAG_ITEM: "dt-colresizable-item",
        /**
         * data tag name to save the previous draggable column
         * element
         * @private
         * @property DATA_TAG_PREV_COL
         * @type {string}
         * @private
         * @default "dt-prev-col-item"
         */
        DATA_TAG_PREV_COL: "dt-prev-col-item",
        /**
         * @method init
         * @param {object} dtInstance
         */
        init: function (dtInstance) {
            var that = this;
            that._dtInstance = dtInstance;
            that._table = $(that._dtInstance.table().node());
            that._tableBody = that._table.find("tbody");
            that._tableHeaders = that._table.find("thead > tr:first-child > th");
            that.buildDom();
            that._addEvent(that._table, "destroy.dt", function () {
                that.destroy();
            }, true);
        },
        /**
         * Builds the draggable components together and places
         * them in the DOM (above the actual table)
         * @method buildDom
         * @returns null
         */
        buildDom: function () {
            var that = this,
                redraw = !!(that._wrapper);
            // wrap the table so that the overflow can be controlled when
            // resizing a big table on a small screen
            if (!redraw) {
                // wrapper check is needed for "redraw()", since this is left over and
                // the table shouldn't be "re-wrapped"
                that._table.wrap("<div class='" + that.CLASS_TABLE_WRAPPER + "'></div>");
                that._wrapper = that._table.parent();
            }

            // build the column resize container and draggable bars
            that._container = $("<div class='" + that.CLASS_WRAPPER + "'></div>");

            if (!redraw && that.options.scrollY) {
                that.initScroller();
            }
            // set the table dimensions correctly
            that.calcTableDimensions();
            // build and insert columns into container
            that._container.append(that.buildColDoms());
            // cache jQuery columns
            that._columns = $("." + that.CLASS_COLUMN, that._container);
            that._table.before(that._container);
            that.checkTableHeight();
            that.initEvents();
        },
        /**
         * Register all events needed on ColResize init
         * @method initEvents
         * @returns null
         */
        initEvents: function () {
            var that = this;
            that._addEvent(that._table, "draw.dt", function () {
                // set timeout so that table dom manipulation can be done first
                setTimeout(function () {
                    that.checkTableHeight();
                }, 0);
            });
            that._addEvent(that._dtInstance, "column-reorder", function () {
                that.redraw();
            }, true);
            that._addEvent(that._table, "column-visibility.dt", function () {
                that.redraw();
            }, true);
            if (that.options.scrollY) {
                that._addEvent(that._wrapper, "scroll", function () {
                    that._scrollWrapper.css("right", 0 - that._wrapper.scrollLeft());
                });
            }
        },
        /**
         * Initialises the table width and height
         * @method calcTableDimensions
         * @returns null
         */
        calcTableDimensions: function () {
            var that = this,
                $th,
                thWidth = 0,
                $ths = that._tableHeaders,    // get all table headers
                totalWidth = 0;
            for (var i = 0, l = $ths.length; i < l; i++) {
                $th = $ths.eq(i);   // get individual <th>
                thWidth = that._getWidth($th); // get <th> current/correct width
                $th.css("width", thWidth);
                totalWidth += thWidth;
            }
            // set the table width correctly
            that._table.css("width", totalWidth);
            // and it's container
            if (that.options.scrollY) {
                totalWidth = totalWidth + 20;
            }
            that._container.width(totalWidth);
        },
        /**
         * Creates the draggable columns, add the necessary drag events
         * @method buildColDoms
         * @return jQuery[] actual draggable columns as jquery objects
         */
        buildColDoms: function () {
            // replicate table header widths
            var that = this,
                $ths = that._tableHeaders,    // get all table headers
                $th,
                $cols = [],
                $col,
                thWidth = 0;

            for (var i = 0, l = $ths.length; i < l; i++) {
                $th = $ths.eq(i);   // get individual <th>
                thWidth = $th.outerWidth(); // get <th> current width
                $col = $("<div class='" + that.CLASS_COLUMN + "'></div>"); // create drag column item <div>
                // place the drag column at the end of the <th> and as tall as the table itself
                $col.css({
                    left: Math.ceil($th.position().left + thWidth)
                });
                // save the prev col item for speed rather than using the .prev() function
                $col.data(that.DATA_TAG_PREV_COL, $cols[i - 1]);
                // save the current width
                $col.data(that.DATA_TAG_WIDTH, thWidth);
                // save the <th> element reference for easy access later
                $col.data(that.DATA_TAG_ITEM, $th);
                // register necessary events
                that.registerEvents($col);
                // push created drag column element in array
                $cols.push($col);
            }
            return $cols;
        },
        /**
         * Get the current or correct th element width.
         * If the th element has an d-inline-block width set "style='width: 100px'" then this
         * the return value. If it doesn't, then the calculated "outerWidth()" is returned.
         *
         * minColumnWidth value always wins if greater than the calculated width.
         * @method _getWidth
         * @param $th {jQuery} th jquery element
         * @returns {integer|float}
         */
        _getWidth: function ($th) {
            var that = this,
                width;
            if (typeof $th[0].style.width === "string" && $th[0].style.width.indexOf("px") >= 1) {
                width = parseFloat($th[0].style.width);
            } else {
                width = $th.outerWidth();
            }
            return width < that.options.minColumnWidth ? that.options.minColumnWidth : width;
        },
        /**
         * Registers the required drag events on the specified column.
         * @method registerEvents
         * @param $col {jQuery}
         * @returns {null}
         */
        registerEvents: function ($col) {
            var that = this;
            $col.mousedown(that.onMouseDown());
        },
        /**
         * Returns the mousedown event function to be used by jQuery.mousedown()
         * @method onMouseDown
         * @returns {function}
         */
        onMouseDown: function () {
            var that = this;
            return function () {
                var $col = $(this),
                    mouseMoveFunc = function (event) {
                        that.onMouseMove(event, $col);
                    };
                that._isDragging = true;
                // check if the use has "let go of dragging"
                // mouse up 
                $(document).one("mouseup", function () {
                    // no longer dragging the column
                    that._isDragging = false;
                    // remove the drag (mousemove) event listener
                    $(document).off("mousemove", mouseMoveFunc);
                    $(that._table).trigger($.Event("column-resized.dt"), [$col.index(), $col.data(that.DATA_TAG_ITEM).outerWidth()]);
                }).on("mousemove", mouseMoveFunc);  //on mousemove
                return false;   // stop text highlighting
            };
        },
        /**
         * Used by jQuery.mousemove to determine the new column widths when a drag action is undertaken
         * @method onMouseMove
         * @param {MouseEvent} event
         * @param {jQuery} $col
         * @returns {null}
         */
        onMouseMove: function (event, $col) {
            var that = this,
                diff = 0,
                $nextCol,
                posPlusDiff;
            if (that._isDragging) {
                // caculate the difference between where the mouse has moved to
                // and the left position of the column that is being dragged
                diff = Math.ceil(event.clientX - $col.offset().left);
                // diff = Math.ceil(Math.abs(event.clientX - $col.offset().left));
                $nextCol = $col.next();
                posPlusDiff = Math.ceil($col.position().left + diff);
                // console.log(diff,posPlusDiff,$nextCol.position().left )
                if ($nextCol.length) {
                    // check whether neighbouring is still bigger than 10px if a resize
                    // takes place.
                    if (posPlusDiff < ($nextCol.position().left - that.options.minColumnWidth)) {
                        if (that.updateColumn($col, diff)) {
                            if (!that.options.resizeTable) {
                                // col was resized so resize the neighbouring col too.
                                that.updateColumn($nextCol, diff < 0 ? Math.abs(diff) : -Math.abs(diff), true);
                            } else {
                                that._recalcPositions();
                            }
                        }
                    }
                } else {
                    // if we are expanding the last column
                    // or when shrinking: don't allow it to shrink smaller than the minColumnWidth
                    if (diff > 0 || (posPlusDiff > $col.prev().position().left + that.options.minColumnWidth)) {
                        if (that.updateColumn($col, diff)) {
                            // very last col drag bar is being dragged here (expanded)
                            that.updateTableOnLastColumnMove($col, diff);
                        }
                    }
                }
                that.checkTableHeight();
            }
        },
        updateTableOnLastColumnMove: function ($col, diff) {
            var that = this;
            // update the table width with the next size to prevent the other columns
            // going crazy
            $col.css({
                left: Math.ceil($col.position().left + diff)
            });
            that.calcTableDimensions();
        },
        /**
         * Update the column width by a given number
         * @method updateColumn
         * @param {jQuery} $col - column that needs a size adjustment
         * @param {integer} by - width to change the column size by
         * @param {boolean} nextColumn [default=false] - set to true if the column being resized is not the original but
         * it's sibling.
         * @return {boolean} {true} if resize was possible, {false} if not;
         */
        updateColumn: function ($col, by, nextColumn) {
            var that = this,
                // calculate the new width of the column
                newWidth = Math.ceil(by + $col.data(that.DATA_TAG_WIDTH));
            //only resize to a min of 10px
            // console.log('updateColumn', newWidth);
            if (newWidth > that.options.minColumnWidth) {
                // get the actual <th> column of the table and set the new width
                $col.data(that.DATA_TAG_ITEM).css({
                    width: newWidth
                });
                // save the new width for the next mouse drag call
                $col.data(that.DATA_TAG_WIDTH, newWidth);
                if (nextColumn) {
                    // set the new let position of the dragged column (div)
                    $col.data(that.DATA_TAG_PREV_COL).css({
                        left: Math.ceil($col.data(that.DATA_TAG_ITEM).position().left)
                    });
                }
                if (that.options.scrollY) {
                    that.updateCells($col.index(), newWidth);
                }
                return true;
            }
            return false;
        },
        /**
         * Repositions all draggable columns and recalculates
         * all table dimensions
         * @method _recalcPositions
         * @returns null
         */
        _recalcPositions: function () {
            var that = this,
                //LEO@20180329: Fix error when there is h-scroll bar
                pos = 0,
                // pos = that._table.position().left,
                $th;
            //LEO@20180329: move calcTableDimension first to ensure alignment
            that.calcTableDimensions();
            for (var i = 0, l = that._tableHeaders.length; i < l; i++) {
                $th = that._tableHeaders.eq(i);
                pos = pos + $th.outerWidth();
                that._columns.eq(i).css("left", pos);
            }
            // that.calcTableDimensions();
        },
        /**
         * Checks whether the height of the table has changed,
         * if it has, then it set the draggable column items with
         * the new height values.
         * @method checkTableHeight
         * @returns null
         */
        checkTableHeight: function () {
            var that = this,
                topMarg = 0,
                newHeight = that._table.outerHeight();
            if (newHeight !== that._tableHeight) {
                that._tableHeight = newHeight;
                // convert the "px" value to just a number
                topMarg = parseFloat(that._table.css("margin-top"));
                // if the table is empty, then don't show the column bars inside the tbody
                // as they overlap the empty text which has colspan across the table.
                if (that._tableBody.find("td.dataTables_empty").length) {
                    newHeight = (newHeight - (newHeight - that._tableBody.position().top)) - topMarg;
                }
                //set the the position and height of all the draggable columns
                that._columns.css({
                    height: newHeight,
                    top: topMarg
                });
            }

        },
        /**
         * Initialise the vertical scrolling feature (scrollY)
         * @method initScroller
         * @returns null
         */
        initScroller: function () {
            var that = this;
            // Build required DOM elements.
            that.buildScrollerDom();
            // register when a scroll is performed inside the wrapping div
            // this then forces the tbody to scroll in-sync.
            that._scrollWrapper.on("scroll", that.onScroll());
            that._addEvent(that._table, "draw.dt", function () {
                // set timeout so that table dom manipulation can be done first
                setTimeout(function () {
                    that.syncRows();
                    that.syncHeight();
                }, 0);
            });
        },
        /**
         * Builds the required dom elements together for vertical scrolling
         * @method buildScrollerDom
         * @returns null
         */
        buildScrollerDom: function () {
            var that = this;
            // add class to wrapper for better css conditional selection
            that._wrapper.addClass(that.CLASS_SCROLLER_HASWRAPPER);
            // scroll wrapper container - where the scroll-y bar appears
            that._scrollWrapper = $("<div class='" + that.CLASS_SCROLLER_WRAPPER + "'></div>");
            // move it over the tbody content
            that._scrollWrapper.css("margin-top", that._tableBody.position().top);
            // create an inner div to mimic the height of the tbody content
            that._scrollContent = $("<div class='" + that.CLASS_SCROLLER_CONTENT_WRAPPER + "'></div>");
            // shrink the wrapper to the defined height so that the scroll bar appears
            that._scrollWrapper.height(that.options.scrollY);
            // fix the content to the tbody original height
            that._scrollContent.height(that._tableBody.height());
            // resize the tbody to the desired height - same as the overlapping wrapper div
            that._tableBody.height(that.options.scrollY);

            // just wide enough to show the scrollbar
            that._scrollWrapper.width(20);

            // hide the overflowing (y) tbody content
            that._tableBody.css("overflow-y", "hidden");
            // add all the new scroll controlling divs
            that._scrollWrapper.append(that._scrollContent);
            that._wrapper.prepend(that._scrollWrapper);
        },
        /**
         * Event listener function for the scroll wrapper scrolling events
         * @method onScroll
         * @returns {function}
         */
        onScroll: function () {
            var that = this,
                scrollWrapper = that._scrollWrapper;
            return function () {
                // scroll the tbody accordingly
                // i.e. keep the tbody scroll in-sync with the scrolling wrapper
                that._tableBody.scrollTop(scrollWrapper.scrollTop());
            };
        },
        /**
         * Update the cells within this column to align with the header on column resize.
         * @method updateCells
         * @param {integer} index column index which was changed
         * @param {interger} width the new width of the column in pixels
         */
        updateCells: function (index, width) {
            var that = this,
                $trs = that._tableBody.find("tr");
            for (var i = 0, l = $trs.length; i < l; i++) {
                $trs.eq(i).find("td").eq(index).css("width", width);
            }
            if (that._updatedColumns.indexOf(index) < 0) {
                that._updatedColumns.push(index);
            }
        },
        /**
         * After a pagination DataTables draws the cells new,
         * this function adjusts the cells back to the correct width
         * in sync with the headers
         * @method syncRows
         * @returns null
         */
        syncRows: function () {
            var that = this,
                $ths,
                $trs,
                index;
            if (that._updatedColumns.length) {
                $ths = that._table.find("thead th");
                $trs = that._tableBody.find("tr");
                for (var i = 0, l = $trs.length; i < l; i++) {
                    for (var ii = 0, ll = that._updatedColumns.length; ii < ll; ii++) {
                        index = that._updatedColumns[ii];
                        $trs.eq(i).find("td").eq(index).css("width", $ths.eq(index).css("width"));
                    }
                }
            }
        },
        /**
         * After a draw (like page change), the content height might not be longer
         * than the set scrollY value. Therefore the Y scroll bar might not be needed.
         * Update the content height accordingly to show or hide the scroll bar.
         * @method syncHeight
         * @returns null
         */
        syncHeight: function () {
            var that = this,
                // make the tbody full height (auto) again to get the new content height
                height = that._tableBody.css("height", "auto").height();
            // reset the tbody height back after calculation
            that._tableBody.height(that.options.scrollY);
            // adjust scroll content div to the new table height
            // this is needed if the content of the next page for example doesn't fill the entire height
            // but the scroll bar is still visible
            that._scrollContent.height(height);
        },
        /**
         * @method destroy
         * @returns null
         */
        destroy: function () {
            var that = this;
            that._container.remove();
            that._columns = [];
            that._updatedColumns = [];
            that._tableHeight = null;
            // remove al the events that were registered using the _addEvent(...) method
            for (var key in that._events) {
                if (that._events.hasOwnProperty(key)) {
                    var arr = that._events[key];
                    for (var i = 0, l = arr.length; i < l; i++) {
                        arr[i][0].off(key, arr[i][1]);
                    }
                }
            }
            that._events = {};
        },
        /**
         * Use this to add events to DOM elements that are not removed by a this.redraw() or table.empty()
         * or JS-GC, or even a DataTableInstance.destroy()
         * The events that are registered using this method are then removed on destroy or redraw so that
         * double events are created.
         * This method registers an "on" event by default
         * @example
         *     this._addEvent($("table"), "draw.dt", function() {
         *          // do something
         *     });
         * @method _addEvent
         * @param $el {jQuery} element to register on
         * @param eventName {string} name of the event to register to
         * @param callback {function} callback function to call when the event is fired
         * @param once {boolean} [default=false] if true, registeres "once" instead of "on" event listener
         * @private
         */
        _addEvent: function ($el, eventName, callback, once) {
            var that = this;
            that._events[eventName] = that._events[eventName] || [];
            that._events[eventName].push([$el, callback]);
            var obj = that._events[eventName][that._events[eventName].length - 1];
            obj[0][once ? "one" : "on"](eventName, obj[1]);
        },
        /**
         * @method redraw
         * @returns null
         */
        redraw: function () {
            var that = this;
            that.destroy();
            that.init(that._dtInstance);
        },
        /**
         * To be called instead of standard "dtInstance.column(index).visible()"
         * so that the table widths and draggable bar items can be redrawn.
         * @method visibility
         * @param index {integer} column index to change
         * @param visibility {boolean} set the column to visible or not
         * @returns null
         */
        visibility: function (index, visibility, redrawCalc) {
            var that = this,
                width = $(that._dtInstance.settings()[0].aoColumns[index].nTh).outerWidth();
            if (!visibility) {
                that._table.css("width", that._table.width() - width);
            } else {
                that._table.css("width", that._table.width() + width);
            }
            that._dtInstance.column(index).visible(visibility, redrawCalc);
        }
    });

    $.fn.dataTable.ColResize = ColResize;
    $.fn.DataTable.ColResize = ColResize;

    $(document).on("init.dt.dtr", function (e, settings) {
        if (e.namespace !== "dt") {
            return;
        }
        var init = settings.oInit.colResize,
            defaults = DataTable.defaults.colResize;
        //LEO@20180604: do not enable colResize by default
        // if (init !== false) {
        if (init) {
            var opts = $.extend({}, init, defaults);
            // next DOM tick to make sure that
            // DT really is finished, everytime!
            setTimeout(function () {
                new ColResize(settings, opts);
            }, 0);
        }
    });

    // API augmentation
    $.fn.dataTable.Api.register("colResize.redraw()", function () {
        this.context[0].colResize.redraw();
        return this;
    });

    $.fn.dataTable.Api.register("colResize.visible()", function (index, visibility, redrawCalc) {
        this.context[0].colResize.visibility(index, visibility, redrawCalc);
        return this;
    });

    return ColResize;
}));
/**
 * This data rendering helper method can be useful for cases where you have
 * potentially large data strings to be shown in a column that is restricted by
 * width. The data for the column is still fully searchable and sortable, but if
 * it is longer than a give number of characters, it will be truncated and
 * shown with ellipsis. A browser provided tooltip will show the full string
 * to the end user on mouse hover of the cell.
 *
 * This function should be used with the `dt-init columns.render` configuration
 * option of DataTables.
 *
 * It accepts three parameters:
 *
 * 1. `-type integer` - The number of characters to restrict the displayed data
 *    to.
 * 2. `-type boolean` (optional - default `false`) - Indicate if the truncation
 *    of the string should not occur in the middle of a word (`true`) or if it
 *    can (`false`). This can allow the display of strings to look nicer, at the
 *    expense of showing less characters.
 * 2. `-type boolean` (optional - default `false`) - Escape HTML entities
 *    (`true`) or not (`false` - default).
 *
 *  @name ellipsis
 *  @summary Restrict output data to a particular length, showing anything
 *      longer with ellipsis and a browser provided tooltip on hover.
 *  @author [Allan Jardine](http://datatables.net)
 *  @requires DataTables 1.10+
 *
 * @returns {Number} Calculated average
 *
 *  @example
 *    // Restrict a column to 17 characters, don't split words
 *    $('#example').DataTable( {
 *      columnDefs: [ {
 *        targets: 1,
 *        render: $.fn.dataTable.render.ellipsis( 17, true )
 *      } ]
 *    } );
 *
 *  @example
 *    // Restrict a column to 10 characters, do split words
 *    $('#example').DataTable( {
 *      columnDefs: [ {
 *        targets: 2,
 *        render: $.fn.dataTable.render.ellipsis( 10 )
 *      } ]
 *    } );
 */

jQuery.fn.dataTable.render.ellipsis = function ( cutoff, wordbreak, escapeHtml ) {
	var esc = function ( t ) {
		return t
			.replace( /&/g, '&amp;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
			.replace( /"/g, '&quot;' );
	};

	return function ( d, type, row ) {
		// Order, search and type get the original data
		if ( type !== 'display' ) {
			return d;
		}

		if ( typeof d !== 'number' && typeof d !== 'string' ) {
			return d;
		}

		d = d.toString(); // cast numbers

		if ( d.length <= cutoff ) {
			return d;
		}

		var shortened = d.substr(0, cutoff-1);

		// Find the last white space character in the string
		if ( wordbreak ) {
			shortened = shortened.replace(/\s([^\s]*)$/, '');
		}

		// Protect against uncontrolled HTML input
		if ( escapeHtml ) {
			shortened = esc( shortened );
		}

		return '<span class="ellipsis" title="'+esc(d)+'">'+shortened+'&#8230;</span>';
	};
};

/*! Responsive 2.2.3
 * 2014-2018 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Responsive
 * @description Responsive tables plug-in for DataTables
 * @version     2.2.3
 * @file        dataTables.responsive.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2014-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net'], function ($) {
            return factory($, window, document);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }

            if (!$ || !$.fn.dataTable) {
                $ = require('datatables.net')(root, $).$;
            }

            return factory($, root, root.document);
        };
    } else {
        // Browser
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    'use strict';
    var DataTable = $.fn.dataTable;


    /**
     * Responsive is a plug-in for the DataTables library that makes use of
     * DataTables' ability to change the visibility of columns, changing the
     * visibility of columns so the displayed columns fit into the table container.
     * The end result is that complex tables will be dynamically adjusted to fit
     * into the viewport, be it on a desktop, tablet or mobile browser.
     *
     * Responsive for DataTables has two modes of operation, which can used
     * individually or combined:
     *
     * * Class name based control - columns assigned class names that match the
     *   breakpoint logic can be shown / hidden as required for each breakpoint.
     * * Automatic control - columns are automatically hidden when there is no
     *   room left to display them. Columns removed from the right.
     *
     * In additional to column visibility control, Responsive also has built into
     * options to use DataTables' child row display to show / hide the information
     * from the table that has been hidden. There are also two modes of operation
     * for this child row display:
     *
     * * d-inline-block - when the control element that the user can use to show / hide
     *   child rows is displayed inside the first column of the table.
     * * Column - where a whole column is dedicated to be the show / hide control.
     *
     * Initialisation of Responsive is performed by:
     *
     * * Adding the class `responsive` or `dt-responsive` to the table. In this case
     *   Responsive will automatically be initialised with the default configuration
     *   options when the DataTable is created.
     * * Using the `responsive` option in the DataTables configuration options. This
     *   can also be used to specify the configuration options, or simply set to
     *   `true` to use the defaults.
     *
     *  @class
     *  @param {object} settings DataTables settings object for the host table
     *  @param {object} [opts] Configuration options
     *  @requires jQuery 1.7+
     *  @requires DataTables 1.10.3+
     *
     *  @example
     *      $('#example').DataTable( {
     *        responsive: true
     *      } );
     *    } );
     */
    var Responsive = function (settings, opts) {
        // Sanity check that we are using DataTables 1.10 or newer
        if (!DataTable.versionCheck || !DataTable.versionCheck('1.10.10')) {
            throw 'DataTables Responsive requires DataTables 1.10.10 or newer';
        }

        this.s = {
            dt: new DataTable.Api(settings),
            columns: [],
            current: []
        };

        // Check if responsive has already been initialised on this table
        if (this.s.dt.settings()[0].responsive) {
            return;
        }

        // details is an object, but for simplicity the user can give it as a string
        // or a boolean
        if (opts && typeof opts.details === 'string') {
            opts.details = {type: opts.details};
        } else if (opts && opts.details === false) {
            opts.details = {type: false};
        } else if (opts && opts.details === true) {
            opts.details = {type: 'inline'};
        }

        this.c = $.extend(true, {}, Responsive.defaults, DataTable.defaults.responsive, opts);
        settings.responsive = this;
        this._constructor();
    };

    $.extend(Responsive.prototype, {
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Constructor
         */

        /**
         * Initialise the Responsive instance
         *
         * @private
         */
        _constructor: function () {
            var that = this;
            var dt = this.s.dt;
            var dtPrivateSettings = dt.settings()[0];
            var oldWindowWidth = $(window).width();

            dt.settings()[0]._responsive = this;

            // Use DataTables' throttle function to avoid processor thrashing on
            // resize
            $(window).on('resize.dtr orientationchange.dtr', DataTable.util.throttle(function () {
                // iOS has a bug whereby resize can fire when only scrolling
                // See: http://stackoverflow.com/questions/8898412
                var width = $(window).width();

                if (width !== oldWindowWidth) {
                    that._resize();
                    oldWindowWidth = width;
                }
            }));

            // DataTables doesn't currently trigger an event when a row is added, so
            // we need to hook into its private API to enforce the hidden rows when
            // new data is added
            dtPrivateSettings.oApi._fnCallbackReg(dtPrivateSettings, 'aoRowCreatedCallback', function (tr, data, idx) {
                if ($.inArray(false, that.s.current) !== -1) {
                    $('>td, >th', tr).each(function (i) {
                        var idx = dt.column.index('toData', i);

                        if (that.s.current[idx] === false) {
                            $(this).css('display', 'none');
                        }
                    });
                }
            });

            //LEO@20181214: hide details in d-inline-block type
            var clickToClose = false;
            if (clickToClose) {
                dt.on('click.dtr-hide-details', 'td.child', function hideDetail(e) {
                    var elem = $(this);
                    var row = dt.row(elem.closest('tr.child').prev('tr.parent'));
                    row.child(false);
                    var $tr = $(row.node());
                    $tr.removeClass('parent').addClass('op-dtr-closing');
                    // $tr.addClass('op-dt-closing').fadeOut('slow', function () {
                    //     $tr.removeClass('op-dt-closing');
                    // });
                    setTimeout(function () {
                        $tr.removeClass('op-dtr-closing').addClass('op-dtr-closed');
                    }, 1500);
                });
            }
            //LEO@20181203: Add sort ability
            dt.on("click.dtr-sort", ".dtr-title", function () {
                var index = $(this).parent().data('dtr-index');
                var order = dt.order(), sort;
                if (order[0] && order[0][0] === index && order[0][1] === 'asc') {
                    sort = 'desc';
                } else {
                    sort = 'asc';
                }
                dt.order(index, sort);
                dt.draw();
            });

            // Destroy event handler
            dt.on('destroy.dtr', function () {
                dt.off('.dtr');
                dt.off('dbclick');
                $(dt.table().body()).off('.dtr');
                $(window).off('resize.dtr orientationchange.dtr');

                // Restore the columns that we've hidden
                $.each(that.s.current, function (i, val) {
                    if (val === false) {
                        that._setColumnVis(i, true);
                    }
                });
                //LEO@2018120
                dt.off('click.dtr-sort');
            });

            // Reorder the breakpoints array here in case they have been added out
            // of order
            this.c.breakpoints.sort(function (a, b) {
                return a.width < b.width ? 1 :
                    a.width > b.width ? -1 : 0;
            });

            this._classLogic();
            this._resizeAuto();

            // Details handler
            var details = this.c.details;

            if (details.type !== false) {
                that._detailsInit();

                // DataTables will trigger this event on every column it shows and
                // hides individually
                dt.on('column-visibility.dtr', function () {
                    // Use a small debounce to allow multiple columns to be set together
                    if (that._timer) {
                        clearTimeout(that._timer);
                    }

                    that._timer = setTimeout(function () {
                        that._timer = null;

                        that._classLogic();
                        that._resizeAuto();
                        that._resize();

                        that._redrawChildren();
                    }, 100);
                });

                // Redraw the details box on each draw which will happen if the data
                // has changed. This is used until DataTables implements a native
                // `updated` event for rows
                dt.on('draw.dtr', function () {
                    that._redrawChildren();
                });

                $(dt.table().node()).addClass('dtr-' + details.type);
            }

            dt.on('column-reorder.dtr', function (e, settings, details) {
                that._classLogic();
                that._resizeAuto();
                that._resize();
            });

            // Change in column sizes means we need to calc
            dt.on('column-sizing.dtr', function () {
                that._resizeAuto();
                that._resize();
            });

            // On Ajax reload we want to reopen any child rows which are displayed
            // by responsive
            dt.on('preXhr.dtr', function () {
                var rowIds = [];
                dt.rows().every(function () {
                    if (this.child.isShown()) {
                        //LEO@20181207: In most cases, row has no ID
                        // rowIds.push(this.id(true));
                        var id = this.id();
                        //LEO: a bug in row().id()
                        // https://datatables.net/reference/api/row().id()
                        // If the row does not have an id available,
                        // it will return string 'undefined' instead of type undefined
                        if (!id || id === 'undefined')
                            id = this.index();
                        rowIds.push(id);
                    }
                });

                dt.one('draw.dtr', function () {
                    that._resizeAuto();
                    that._resize();
                    dt.rows(rowIds).every(function () {
                        that._detailsDisplay(this, false);
                    });
                });
            });

            dt.on('init.dtr', function (e, settings, details) {
                that._resizeAuto();
                that._resize();

                // If columns were hidden, then DataTables needs to adjust the
                // column sizing
                if ($.inArray(false, that.s.current)) {
                    dt.columns.adjust();
                }
            });

            // First pass - draw the table for the current viewport size
            this._resize();
        },


        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Private methods
         */

        /**
         * Calculate the visibility for the columns in a table for a given
         * breakpoint. The result is pre-determined based on the class logic if
         * class names are used to control all columns, but the width of the table
         * is also used if there are columns which are to be automatically shown
         * and hidden.
         *
         * @param  {string} breakpoint Breakpoint name to use for the calculation
         * @return {array} Array of boolean values initiating the visibility of each
         *   column.
         *  @private
         */
        _columnsVisiblity: function (breakpoint) {
            var dt = this.s.dt;
            var columns = this.s.columns;
            var i, ien;

            // Create an array that defines the column ordering based first on the
            // column's priority, and secondly the column index. This allows the
            // columns to be removed from the right if the priority matches
            var order = columns
                .map(function (col, idx) {
                    return {
                        columnIdx: idx,
                        priority: col.priority
                    };
                })
                .sort(function (a, b) {
                    if (a.priority !== b.priority) {
                        return a.priority - b.priority;
                    }
                    return a.columnIdx - b.columnIdx;
                });

            // Class logic - determine which columns are in this breakpoint based
            // on the classes. If no class control (i.e. `auto`) then `-` is used
            // to indicate this to the rest of the function
            var display = $.map(columns, function (col, i) {
                if (dt.column(i).visible() === false) {
                    return 'not-visible';
                }
                return col.auto && col.minWidth === null ?
                    false :
                    col.auto === true ?
                        '-' :
                        $.inArray(breakpoint, col.includeIn) !== -1;
            });

            // Auto column control - first pass: how much width is taken by the
            // ones that must be included from the non-auto columns
            var requiredWidth = 0;
            for (i = 0, ien = display.length; i < ien; i++) {
                if (display[i] === true) {
                    requiredWidth += columns[i].minWidth;
                }
            }

            // Second pass, use up any remaining width for other columns. For
            // scrolling tables we need to subtract the width of the scrollbar. It
            // may not be requires which makes this sub-optimal, but it would
            // require another full redraw to make complete use of those extra few
            // pixels
            var scrolling = dt.settings()[0].oScroll;
            var bar = scrolling.sY || scrolling.sX ? scrolling.iBarWidth : 0;
            var widthAvailable = dt.table().container().offsetWidth - bar;
            var usedWidth = widthAvailable - requiredWidth;

            // Control column needs to always be included. This makes it sub-
            // optimal in terms of using the available with, but to stop layout
            // thrashing or overflow. Also we need to account for the control column
            // width first so we know how much width is available for the other
            // columns, since the control column might not be the first one shown
            for (i = 0, ien = display.length; i < ien; i++) {
                if (columns[i].control) {
                    usedWidth -= columns[i].minWidth;
                }
            }

            // Allow columns to be shown (counting by priority and then right to
            // left) until we run out of room
            var empty = false;
            for (i = 0, ien = order.length; i < ien; i++) {
                var colIdx = order[i].columnIdx;

                if (display[colIdx] === '-' && !columns[colIdx].control && columns[colIdx].minWidth) {
                    // Once we've found a column that won't fit we don't let any
                    // others display either, or columns might disappear in the
                    // middle of the table
                    if (empty || usedWidth - columns[colIdx].minWidth < 0) {
                        empty = true;
                        display[colIdx] = false;
                    } else {
                        display[colIdx] = true;
                    }

                    usedWidth -= columns[colIdx].minWidth;
                }
            }

            // Determine if the 'control' column should be shown (if there is one).
            // This is the case when there is a hidden column (that is not the
            // control column). The two loops look inefficient here, but they are
            // trivial and will fly through. We need to know the outcome from the
            // first , before the action in the second can be taken
            var showControl = false;

            for (i = 0, ien = columns.length; i < ien; i++) {
                if (!columns[i].control && !columns[i].never && display[i] === false) {
                    showControl = true;
                    break;
                }
            }

            for (i = 0, ien = columns.length; i < ien; i++) {
                if (columns[i].control) {
                    display[i] = showControl;
                }

                // Replace not visible string with false from the control column detection above
                if (display[i] === 'not-visible') {
                    display[i] = false;
                }
            }

            // Finally we need to make sure that there is at least one column that
            // is visible
            if ($.inArray(true, display) === -1) {
                display[0] = true;
            }

            return display;
        },


        /**
         * Create the internal `columns` array with information about the columns
         * for the table. This includes determining which breakpoints the column
         * will appear in, based upon class names in the column, which makes up the
         * vast majority of this method.
         *
         * @private
         */
        _classLogic: function () {
            var that = this;
            var calc = {};
            var breakpoints = this.c.breakpoints;
            var dt = this.s.dt;
            var columns = dt.columns().eq(0).map(function (i) {
                var column = this.column(i);
                var className = column.header().className;
                var priority = dt.settings()[0].aoColumns[i].responsivePriority;

                if (priority === undefined) {
                    var dataPriority = $(column.header()).data('priority');

                    priority = dataPriority !== undefined ?
                        dataPriority * 1 :
                        10000;
                }

                return {
                    className: className,
                    includeIn: [],
                    auto: false,
                    control: false,
                    never: className.match(/\bnever\b/) ? true : false,
                    priority: priority
                };
            });

            // Simply add a breakpoint to `includeIn` array, ensuring that there are
            // no duplicates
            var add = function (colIdx, name) {
                var includeIn = columns[colIdx].includeIn;

                if ($.inArray(name, includeIn) === -1) {
                    includeIn.push(name);
                }
            };

            var column = function (colIdx, name, operator, matched) {
                var size, i, ien;

                if (!operator) {
                    columns[colIdx].includeIn.push(name);
                } else if (operator === 'max-') {
                    // Add this breakpoint and all smaller
                    size = that._find(name).width;

                    for (i = 0, ien = breakpoints.length; i < ien; i++) {
                        if (breakpoints[i].width <= size) {
                            add(colIdx, breakpoints[i].name);
                        }
                    }
                } else if (operator === 'min-') {
                    // Add this breakpoint and all larger
                    size = that._find(name).width;

                    for (i = 0, ien = breakpoints.length; i < ien; i++) {
                        if (breakpoints[i].width >= size) {
                            add(colIdx, breakpoints[i].name);
                        }
                    }
                } else if (operator === 'not-') {
                    // Add all but this breakpoint
                    for (i = 0, ien = breakpoints.length; i < ien; i++) {
                        if (breakpoints[i].name.indexOf(matched) === -1) {
                            add(colIdx, breakpoints[i].name);
                        }
                    }
                }
            };

            // Loop over each column and determine if it has a responsive control
            // class
            columns.each(function (col, i) {
                var classNames = col.className.split(' ');
                var hasClass = false;

                // Split the class name up so multiple rules can be applied if needed
                for (var k = 0, ken = classNames.length; k < ken; k++) {
                    var className = $.trim(classNames[k]);

                    if (className === 'all') {
                        // Include in all
                        hasClass = true;
                        col.includeIn = $.map(breakpoints, function (a) {
                            return a.name;
                        });
                        return;
                    } else if (className === 'none' || col.never) {
                        // Include in none (default) and no auto
                        hasClass = true;
                        return;
                    } else if (className === 'control') {
                        // Special column that is only visible, when one of the other
                        // columns is hidden. This is used for the details control
                        hasClass = true;
                        col.control = true;
                        return;
                    }

                    $.each(breakpoints, function (j, breakpoint) {
                        // Does this column have a class that matches this breakpoint?
                        var brokenPoint = breakpoint.name.split('-');
                        var re = new RegExp('(min\\-|max\\-|not\\-)?(' + brokenPoint[0] + ')(\\-[_a-zA-Z0-9])?');
                        var match = className.match(re);

                        if (match) {
                            hasClass = true;

                            if (match[2] === brokenPoint[0] && match[3] === '-' + brokenPoint[1]) {
                                // Class name matches breakpoint name fully
                                column(i, breakpoint.name, match[1], match[2] + match[3]);
                            } else if (match[2] === brokenPoint[0] && !match[3]) {
                                // Class name matched primary breakpoint name with no qualifier
                                column(i, breakpoint.name, match[1], match[2]);
                            }
                        }
                    });
                }

                // If there was no control class, then automatic sizing is used
                if (!hasClass) {
                    col.auto = true;
                }
            });

            this.s.columns = columns;
        },


        /**
         * Show the details for the child row
         *
         * @param  {DataTables.Api} row    API instance for the row
         * @param  {boolean}        update Update flag
         * @private
         */
        _detailsDisplay: function (row, update) {
            var that = this;
            var dt = this.s.dt;
            var details = this.c.details;

            if (details && details.type !== false) {
                var res = details.display(row, update, function () {
                    return details.renderer(
                        dt, row[0], that._detailsObj(row[0])
                    );
                });

                if (res === true || res === false) {
                    $(dt.table().node()).triggerHandler('responsive-display.dt', [dt, row, res, update]);
                }
            }
        },


        /**
         * Initialisation for the details handler
         *
         * @private
         */
        _detailsInit: function () {
            var that = this;
            var dt = this.s.dt;
            var details = this.c.details;

            // The d-inline-block type always uses the first child as the target
            if (details.type === 'inline') {
                details.target = 'td:first-child, th:first-child';
            }

            // Keyboard accessibility
            dt.on('draw.dtr', function () {
                that._tabIndexes();
            });
            that._tabIndexes(); // Initial draw has already happened

            $(dt.table().body()).on('keyup.dtr', 'td, th', function (e) {
                if (e.keyCode === 13 && $(this).data('dtr-keyboard')) {
                    $(this).click();
                }
            });

            // type.target can be a string jQuery selector or a column index
            var target = details.target;
            var selector = typeof target === 'string' ? target : 'td, th';

            // Click handler to show / hide the details rows when they are available
            $(dt.table().body())
                .on('click.dtr mousedown.dtr mouseup.dtr', selector, function (e) {
                    // If the table is not collapsed (i.e. there is no hidden columns)
                    // then take no action
                    if (!$(dt.table().node()).hasClass('collapsed')) {
                        return;
                    }
                    //LEO@20181207: Use td:before as handler instead of the whole td
                    var _clicked = e.target.tagName.toLowerCase();
                    var tdBeforeOffsetX = 24;
                    // console.log(e.offsetX);
                    if ((_clicked !== 'th' && _clicked !== 'td') || e.offsetX > tdBeforeOffsetX) {
                        return;
                    }
                    var $td = $(this);

                    // Check that the row is actually a DataTable's controlled node
                    if ($.inArray($td.closest('tr').get(0), dt.rows().nodes().toArray()) === -1) {
                        return;
                    }

                    // For column index, we determine if we should act or not in the
                    // handler - otherwise it is already okay
                    if (typeof target === 'number') {
                        var targetIdx = target < 0 ?
                            dt.columns().eq(0).length + target :
                            target;

                        if (dt.cell(this).index().column !== targetIdx) {
                            return;
                        }
                    }

                    // $().closest() includes itself in its check
                    var row = dt.row($td.closest('tr'));

                    // Check event type to do an action
                    if (e.type === 'click') {
                        // The renderer is given as a function so the caller can execute it
                        // only when they need (i.e. if hiding there is no point is running
                        // the renderer)
                        that._detailsDisplay(row, false);
                    } else if (e.type === 'mousedown') {
                        // For mouse users, prevent the focus ring from showing
                        $td.css('outline', 'none');
                    } else if (e.type === 'mouseup') {
                        // And then re-allow at the end of the click
                        $td.blur().css('outline', '');
                    }
                });
        },


        /**
         * Get the details to pass to a renderer for a row
         * @param  {int} rowIdx Row index
         * @private
         */
        _detailsObj: function (rowIdx) {
            var that = this;
            var dt = this.s.dt;

            return $.map(this.s.columns, function (col, i) {
                // Never and control columns should not be passed to the renderer
                if (col.never || col.control) {
                    return;
                }

                //LEO@20181207: When using index (not id) as rowIdx for saving responsive state
                // it may not find node on other pages after reload()
                var node = dt.cell(rowIdx, i).node();
                if (!node) {
                    // console.log('Cannot find node', rowIdx, i);
                    return;
                }
                return {
                    title: dt.settings()[0].aoColumns[i].sTitle,
                    // LEO@20181130: use existing innerHTML as data instead of re-init cell content by `render`
                    // Because UDP datatable widget will change cell content after rendering
                    // by attribute [data-accesscontrol] and [udp-state-control]/[data-statecontrol]
                    // data: dt.cell( rowIdx, i ).render( that.c.orthogonal ),
                    data: node.innerHTML,
                    hidden: dt.column(i).visible() && !that.s.current[i],
                    columnIndex: i,
                    rowIndex: rowIdx
                };
            });
        },


        /**
         * Find a breakpoint object from a name
         *
         * @param  {string} name Breakpoint name to find
         * @return {object}      Breakpoint description object
         * @private
         */
        _find: function (name) {
            var breakpoints = this.c.breakpoints;

            for (var i = 0, ien = breakpoints.length; i < ien; i++) {
                if (breakpoints[i].name === name) {
                    return breakpoints[i];
                }
            }
        },


        /**
         * Re-create the contents of the child rows as the display has changed in
         * some way.
         *
         * @private
         */
        _redrawChildren: function () {
            var that = this;
            var dt = this.s.dt;

            dt.rows({page: 'current'}).iterator('row', function (settings, idx) {
                var row = dt.row(idx);

                that._detailsDisplay(dt.row(idx), true);
            });
        },


        /**
         * Alter the table display for a resized viewport. This involves first
         * determining what breakpoint the window currently is in, getting the
         * column visibilities to apply and then setting them.
         *
         * @private
         */
        _resize: function () {
            var that = this;
            var dt = this.s.dt;
            var width = $(window).width();
            var breakpoints = this.c.breakpoints;
            var breakpoint = breakpoints[0].name;
            var columns = this.s.columns;
            var i, ien;
            var oldVis = this.s.current.slice();

            // Determine what breakpoint we are currently at
            for (i = breakpoints.length - 1; i >= 0; i--) {
                if (width <= breakpoints[i].width) {
                    breakpoint = breakpoints[i].name;
                    break;
                }
            }

            // Show the columns for that break point
            var columnsVis = this._columnsVisiblity(breakpoint);
            this.s.current = columnsVis;

            // Set the class before the column visibility is changed so event
            // listeners know what the state is. Need to determine if there are
            // any columns that are not visible but can be shown
            var collapsedClass = false;
            for (i = 0, ien = columns.length; i < ien; i++) {
                if (columnsVis[i] === false && !columns[i].never && !columns[i].control && !dt.column(i).visible() === false) {
                    collapsedClass = true;
                    break;
                }
            }

            $(dt.table().node()).toggleClass('collapsed', collapsedClass);

            var changed = false;
            var visible = 0;

            dt.columns().eq(0).each(function (colIdx, i) {
                if (columnsVis[i] === true) {
                    visible++;
                }

                if (columnsVis[i] !== oldVis[i]) {
                    changed = true;
                    that._setColumnVis(colIdx, columnsVis[i]);
                }
            });

            if (changed) {
                this._redrawChildren();

                // Inform listeners of the change
                $(dt.table().node()).trigger('responsive-resize.dt', [dt, this.s.current]);

                // If no records, update the "No records" display element
                if (dt.page.info().recordsDisplay === 0) {
                    $('td', dt.table().body()).eq(0).attr('colspan', visible);
                }
            }
        },


        /**
         * Determine the width of each column in the table so the auto column hiding
         * has that information to work with. This method is never going to be 100%
         * perfect since column widths can change slightly per page, but without
         * seriously compromising performance this is quite effective.
         *
         * @private
         */
        _resizeAuto: function () {
            var dt = this.s.dt;
            var columns = this.s.columns;

            // Are we allowed to do auto sizing?
            if (!this.c.auto) {
                return;
            }

            // Are there any columns that actually need auto-sizing, or do they all
            // have classes defined
            if ($.inArray(true, $.map(columns, function (c) {
                return c.auto;
            })) === -1) {
                return;
            }

            // Need to restore all children. They will be reinstated by a re-render
            if (!$.isEmptyObject(_childNodeStore)) {
                $.each(_childNodeStore, function (key) {
                    var idx = key.split('-');

                    _childNodesRestore(dt, idx[0] * 1, idx[1] * 1);
                });
            }

            // Clone the table with the current data in it
            var tableWidth = dt.table().node().offsetWidth;
            var columnWidths = dt.columns;
            var clonedTable = dt.table().node().cloneNode(false);
            var clonedHeader = $(dt.table().header().cloneNode(false)).appendTo(clonedTable);
            var clonedBody = $(dt.table().body()).clone(false, false).empty().appendTo(clonedTable); // use jQuery because of IE8

            // Header
            var headerCells = dt.columns()
                .header()
                .filter(function (idx) {
                    return dt.column(idx).visible();
                })
                .to$()
                .clone(false)
                .css('display', 'table-cell')
                .css('min-width', 0);

            // Body rows - we don't need to take account of DataTables' column
            // visibility since we implement our own here (hence the `display` set)
            $(clonedBody)
                .append($(dt.rows({page: 'current'}).nodes()).clone(false))
                .find('th, td').css('display', '');

            // Footer
            var footer = dt.table().footer();
            if (footer) {
                var clonedFooter = $(footer.cloneNode(false)).appendTo(clonedTable);
                var footerCells = dt.columns()
                    .footer()
                    .filter(function (idx) {
                        return dt.column(idx).visible();
                    })
                    .to$()
                    .clone(false)
                    .css('display', 'table-cell');

                $('<tr/>')
                    .append(footerCells)
                    .appendTo(clonedFooter);
            }

            $('<tr/>')
                .append(headerCells)
                .appendTo(clonedHeader);

            // In the d-inline-block case extra padding is applied to the first column to
            // give space for the show / hide icon. We need to use this in the
            // calculation
            if (this.c.details.type === 'inline') {
                $(clonedTable).addClass('dtr-inline collapsed');
            }

            // It is unsafe to insert elements with the same name into the DOM
            // multiple times. For example, cloning and inserting a checked radio
            // clears the chcecked state of the original radio.
            $(clonedTable).find('[name]').removeAttr('name');

            // A position absolute table would take the table out of the flow of
            // our container element, bypassing the height and width (Scroller)
            $(clonedTable).css('position', 'relative')

            var inserted = $('<div/>')
                .css({
                    width: 1,
                    height: 1,
                    overflow: 'hidden',
                    clear: 'both'
                })
                .append(clonedTable);

            inserted.insertBefore(dt.table().node());

            // The cloned header now contains the smallest that each column can be
            headerCells.each(function (i) {
                var idx = dt.column.index('fromVisible', i);
                columns[idx].minWidth = this.offsetWidth || 0;
            });

            inserted.remove();
        },

        /**
         * Set a column's visibility.
         *
         * We don't use DataTables' column visibility controls in order to ensure
         * that column visibility can Responsive can no-exist. Since only IE8+ is
         * supported (and all evergreen browsers of course) the control of the
         * display attribute works well.
         *
         * @param {integer} col      Column index
         * @param {boolean} showHide Show or hide (true or false)
         * @private
         */
        _setColumnVis: function (col, showHide) {
            var dt = this.s.dt;
            var display = showHide ? '' : 'none'; // empty string will remove the attr

            $(dt.column(col).header()).css('display', display);
            $(dt.column(col).footer()).css('display', display);
            dt.column(col).nodes().to$().css('display', display);

            // If the are child nodes stored, we might need to reinsert them
            if (!$.isEmptyObject(_childNodeStore)) {
                dt.cells(null, col).indexes().each(function (idx) {
                    _childNodesRestore(dt, idx.row, idx.column);
                });
            }
        },


        /**
         * Update the cell tab indexes for keyboard accessibility. This is called on
         * every table draw - that is potentially inefficient, but also the least
         * complex option given that column visibility can change on the fly. Its a
         * shame user-focus was removed from CSS 3 UI, as it would have solved this
         * issue with a single CSS statement.
         *
         * @private
         */
        _tabIndexes: function () {
            var dt = this.s.dt;
            var cells = dt.cells({page: 'current'}).nodes().to$();
            var ctx = dt.settings()[0];
            var target = this.c.details.target;

            cells.filter('[data-dtr-keyboard]').removeData('[data-dtr-keyboard]');

            if (typeof target === 'number') {
                dt.cells(null, target, {page: 'current'}).nodes().to$()
                    .attr('tabIndex', ctx.iTabIndex)
                    .data('dtr-keyboard', 1);
            } else {
                // This is a bit of a hack - we need to limit the selected nodes to just
                // those of this table
                if (target === 'td:first-child, th:first-child') {
                    target = '>td:first-child, >th:first-child';
                }

                $(target, dt.rows({page: 'current'}).nodes())
                    .attr('tabIndex', ctx.iTabIndex)
                    .data('dtr-keyboard', 1);
            }
        }
    });


    /**
     * List of default breakpoints. Each item in the array is an object with two
     * properties:
     *
     * * `name` - the breakpoint name.
     * * `width` - the breakpoint width
     *
     * @name Responsive.breakpoints
     * @static
     */
    Responsive.breakpoints = [
        {name: 'desktop', width: Infinity},
        {name: 'tablet-l', width: 1024},
        {name: 'tablet-p', width: 768},
        {name: 'mobile-l', width: 480},
        {name: 'mobile-p', width: 320}
    ];


    /**
     * Display methods - functions which define how the hidden data should be shown
     * in the table.
     *
     * @namespace
     * @name Responsive.defaults
     * @static
     */
    Responsive.display = {
        childRow: function (row, update, render) {
            if (update) {
                if ($(row.node()).hasClass('parent')) {
                    row.child(render(), 'child').show();

                    return true;
                }
            } else {
                if (!row.child.isShown()) {
                    row.child(render(), 'child').show();
                    $(row.node()).addClass('parent').removeClass('op-dtr-closed');

                    return true;
                } else {
                    row.child(false);
                    $(row.node()).removeClass('parent');

                    return false;
                }
            }
        },

        childRowImmediate: function (row, update, render) {
            if ((!update && row.child.isShown()) || !row.responsive.hasHidden()) {
                // User interaction and the row is show, or nothing to show
                row.child(false);
                $(row.node()).removeClass('parent');

                return false;
            } else {
                // Display
                row.child(render(), 'child').show();
                $(row.node()).addClass('parent').removeClass('op-dtr-closed');

                return true;
            }
        },

        // This is a wrapper so the modal options for Bootstrap and jQuery UI can
        // have options passed into them. This specific one doesn't need to be a
        // function but it is for consistency in the `modal` name
        modal: function (options) {
            return function (row, update, render) {
                if (!update) {
                    // Show a modal
                    var close = function () {
                        modal.remove(); // will tidy events for us
                        $(document).off('keypress.dtr');
                    };

                    var modal = $('<div class="dtr-modal"/>')
                        .append($('<div class="dtr-modal-display"/>')
                            .append($('<div class="dtr-modal-content"/>')
                                .append(render())
                            )
                            .append($('<div class="dtr-modal-close"></div>')
                                .click(function () {
                                    close();
                                })
                            )
                        )
                        .append($('<div class="dtr-modal-background"/>')
                            .click(function () {
                                close();
                            })
                        )
                        .appendTo('body');

                    $(document).on('keyup.dtr', function (e) {
                        if (e.keyCode === 27) {
                            e.stopPropagation();

                            close();
                        }
                    });
                } else {
                    $('div.dtr-modal-content')
                        .empty()
                        .append(render());
                }

                if (options && options.header) {
                    $('div.dtr-modal-content').prepend(
                        '<h2>' + options.header(row) + '</h2>'
                    );
                }
            };
        }
    };


    var _childNodeStore = {};

    function _childNodes(dt, row, col) {
        var name = row + '-' + col;

        if (_childNodeStore[name]) {
            return _childNodeStore[name];
        }

        // https://jsperf.com/childnodes-array-slice-vs-loop
        var nodes = [];
        var children = dt.cell(row, col).node().childNodes;
        for (var i = 0, ien = children.length; i < ien; i++) {
            nodes.push(children[i]);
        }

        _childNodeStore[name] = nodes;

        return nodes;
    }

    function _childNodesRestore(dt, row, col) {
        var name = row + '-' + col;

        if (!_childNodeStore[name]) {
            return;
        }

        var node = dt.cell(row, col).node();
        var store = _childNodeStore[name];
        var parent = store[0].parentNode;
        var parentChildren = parent.childNodes;
        var a = [];

        for (var i = 0, ien = parentChildren.length; i < ien; i++) {
            a.push(parentChildren[i]);
        }

        for (var j = 0, jen = a.length; j < jen; j++) {
            node.appendChild(a[j]);
        }

        _childNodeStore[name] = undefined;
    }


    /**
     * Display methods - functions which define how the hidden data should be shown
     * in the table.
     *
     * @namespace
     * @name Responsive.defaults
     * @static
     */
    Responsive.renderer = {
        listHiddenNodes: function () {
            return function (api, rowIdx, columns) {
                var ul = $('<ul data-dtr-index="' + rowIdx + '" class="dtr-details"/>');
                var found = false;

                var data = $.each(columns, function (i, col) {
                    if (col.hidden) {
                        $(
                            '<li data-dtr-index="' + col.columnIndex + '" data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                            '<span class="dtr-title">' +
                            col.title +
                            '</span> ' +
                            '</li>'
                        )
                            .append($('<span class="dtr-data"/>').append(_childNodes(api, col.rowIndex, col.columnIndex)))// api.cell( col.rowIndex, col.columnIndex ).node().childNodes ) )
                            .appendTo(ul);

                        found = true;
                    }
                });

                return found ?
                    ul :
                    false;
            };
        },

        listHidden: function () {
            return function (api, rowIdx, columns) {
                //https://stackoverflow.com/questions/32598279/how-to-get-name-of-datatable-column
                // var settings = api.settings().init();
                var settings = api.init();
                //LEO@20181203: Check if a column is ordered
                var order = api.order();
                var data = $.map(columns, function (col) {
                    var sortCss;
                    var colCss = settings.columns[col.columnIndex].className;
                    colCss = colCss ? ' ' + colCss : '';
                    if (order[0] && order[0][0] === col.columnIndex)
                        sortCss = ' sorting_' + order[0][1];
                    return col.hidden ?
                        '<li data-dtr-index="' + col.columnIndex + '" data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                        '<span class="dtr-title' + (sortCss || '') + '">' +
                        col.title +
                        '</span> ' +
                        '<span class="dtr-data' + colCss + '">' +
                        col.data +
                        '</span>' +
                        '</li>' :
                        '';
                }).join('');

                return data ?
                    $('<ul data-dtr-index="' + rowIdx + '" class="dtr-details"/>').append(data) :
                    false;
            }
        },

        tableAll: function (options) {
            options = $.extend({
                tableClass: ''
            }, options);

            return function (api, rowIdx, columns) {
                var data = $.map(columns, function (col) {
                    return '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                        '<td>' + col.title + ':' + '</td> ' +
                        '<td>' + col.data + '</td>' +
                        '</tr>';
                }).join('');

                return $('<table class="' + options.tableClass + ' dtr-details" width="100%"/>').append(data);
            }
        }
    };

    /**
     * Responsive default settings for initialisation
     *
     * @namespace
     * @name Responsive.defaults
     * @static
     */
    Responsive.defaults = {
        /**
         * List of breakpoints for the instance. Note that this means that each
         * instance can have its own breakpoints. Additionally, the breakpoints
         * cannot be changed once an instance has been creased.
         *
         * @type {Array}
         * @default Takes the value of `Responsive.breakpoints`
         */
        breakpoints: Responsive.breakpoints,

        /**
         * Enable / disable auto hiding calculations. It can help to increase
         * performance slightly if you disable this option, but all columns would
         * need to have breakpoint classes assigned to them
         *
         * @type {Boolean}
         * @default  `true`
         */
        auto: true,

        /**
         * Details control. If given as a string value, the `type` property of the
         * default object is set to that value, and the defaults used for the rest
         * of the object - this is for ease of implementation.
         *
         * The object consists of the following properties:
         *
         * * `display` - A function that is used to show and hide the hidden details
         * * `renderer` - function that is called for display of the child row data.
         *   The default function will show the data from the hidden columns
         * * `target` - Used as the selector for what objects to attach the child
         *   open / close to
         * * `type` - `false` to disable the details display, `inline` or `column`
         *   for the two control types
         *
         * @type {Object|string}
         */
        details: {
            display: Responsive.display.childRow,

            renderer: Responsive.renderer.listHidden(),

            target: 0,

            type: 'inline'
        },

        /**
         * Orthogonal data request option. This is used to define the data type
         * requested when Responsive gets the data to show in the child row.
         *
         * @type {String}
         */
        orthogonal: 'display'
    };


    /*
     * API
     */
    var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
    Api.register('responsive()', function () {
        return this;
    });

    Api.register('responsive.index()', function (li) {
        li = $(li);

        return {
            column: li.data('dtr-index'),
            row: li.parent().data('dtr-index')
        };
    });

    Api.register('responsive.rebuild()', function () {
        return this.iterator('table', function (ctx) {
            if (ctx._responsive) {
                ctx._responsive._classLogic();
            }
        });
    });

    Api.register('responsive.recalc()', function () {
        return this.iterator('table', function (ctx) {
            if (ctx._responsive) {
                ctx._responsive._resizeAuto();
                ctx._responsive._resize();
            }
        });
    });

    Api.register('responsive.hasHidden()', function () {
        var ctx = this.context[0];

        return ctx._responsive ?
            $.inArray(false, ctx._responsive.s.current) !== -1 :
            false;
    });

    Api.registerPlural('columns().responsiveHidden()', 'column().responsiveHidden()', function () {
        return this.iterator('column', function (settings, column) {
            return settings._responsive ?
                settings._responsive.s.current[column] :
                false;
        }, 1);
    });


    /**
     * Version information
     *
     * @name Responsive.version
     * @static
     */
    Responsive.version = '2.2.3';


    $.fn.dataTable.Responsive = Responsive;
    $.fn.DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
    $(document).on('preInit.dt.dtr', function (e, settings, json) {
        if (e.namespace !== 'dt') {
            return;
        }

        if ($(settings.nTable).hasClass('responsive') ||
            $(settings.nTable).hasClass('dt-responsive') ||
            settings.oInit.responsive ||
            DataTable.defaults.responsive
        ) {
            var init = settings.oInit.responsive;

            if (init !== false) {
                new Responsive(settings, $.isPlainObject(init) ? init : {});
            }
        }
    });


    return Responsive;
}));

/*! SearchHighlight for DataTables v1.0.1
 * 2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     SearchHighlight
 * @description Search term highlighter for DataTables
 * @version     1.0.1
 * @file        dataTables.searchHighlight.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2014 SpryMedia Ltd.
 *
 * License      MIT - http://datatables.net/license/mit
 *
 * This feature plug-in for DataTables will highlight search terms in the
 * DataTable as they are entered into the main search input element, or via the
 * `search()` API method.
 *
 * It depends upon the jQuery Highlight plug-in by Bartek Szopka:
 * 	  http://bartaz.github.io/sandbox.js/jquery.highlight.js
 *
 * Search highlighting in DataTables can be enabled by:
 *
 * * Adding the class `searchHighlight` to the HTML table
 * * Setting the `searchHighlight` parameter in the DataTables initialisation to
 *   be true
 * * Setting the `searchHighlight` parameter to be true in the DataTables
 *   defaults (thus causing all tables to have this feature) - i.e.
 *   `$.fn.dataTable.defaults.searchHighlight = true`.
 *
 * For more detailed information please see:
 *     http://datatables.net/blog/2014-10-22
 */

(function(window, document, $){


    function highlight( body, table )
    {
        // Removing the old highlighting first
        body.unhighlight();

        // Don't highlight the "not found" row, so we get the rows using the api
        if ( table.rows( { filter: 'applied' } ).data().length ) {
            table.columns().every( function () {
                var column = this;
                column.nodes().flatten().to$().unhighlight({ className: 'column_highlight' });
                column.nodes().flatten().to$().highlight( column.search().trim().split(/\s+/), { className: 'column_highlight' } );
            } );
            body.highlight( table.search().trim().split(/\s+/) );
        }
    }


// Listen for DataTables initialisations
    $(document).on( 'init.dt.dth', function (e, settings, json) {
        if ( e.namespace !== 'dt' ) {
            return;
        }

        var table = new $.fn.dataTable.Api( settings );
        var body = $( table.table().body() );

        if (
            $( table.table().node() ).hasClass( 'searchHighlight' ) || // table has class
            settings.oInit.searchHighlight                          || // option specified
            $.fn.dataTable.defaults.searchHighlight                    // default set
        ) {
            table
                .on( 'draw.dt.dth column-visibility.dt.dth column-reorder.dt.dth', function () {
                    highlight( body, table );
                } )
                .on( 'destroy', function () {
                    // Remove event handler
                    table.off( 'draw.dt.dth column-visibility.dt.dth column-reorder.dt.dth' );
                } );

            // initial highlight for state saved conditions and initial states
            if ( table.search() ) {
                highlight( body, table );
            }
        }
    } );


})(window, document, jQuery);
/**
 * This pagination plug-in provides a `dt-tag select` menu with the list of the page
 * numbers that are available for viewing.
 *
 *  @name Select list
 *  @summary Show a `dt-tag select` list of pages the user can pick from.
 *  @author _jneilliii_
 *
 *  @example
 *    $(document).ready(function() {
 *        $('#example').dataTable( {
 *            "sPaginationType": "listbox"
 *        } );
 *    } );
 */

$.fn.dataTableExt.oPagination.listbox = {
    /*
     * Function: oPagination.listbox.fnInit
     * Purpose:  Initalise dom elements required for pagination with listbox input
     * Returns:  -
     * Inputs:   object:oSettings - dataTables settings object
     *             node:nPaging - the DIV which contains this pagination control
     *             function:fnCallbackDraw - draw function which must be called on update
     */
    "fnInit": function (oSettings, nPaging, fnCallbackDraw) {
        var nInput = document.createElement('select');
        var nPage = document.createElement('span');
        var nOf = document.createElement('span');
        nInput.className = "paginate_select";
        nOf.className = "paginate_of";
        nPage.className = "paginate_page";
        if (oSettings.sTableId !== '') {
            nPaging.setAttribute('id', oSettings.sTableId + '_paginate');
        }
        // nInput.style.display = "inline";
        // nPage.innerHTML = "Page ";
        nPage.innerHTML = "";
        nPaging.appendChild(nPage);
        nPaging.appendChild(nInput);
        nPaging.appendChild(nOf);
        $(nInput).change(function (e) { // Set DataTables page property and redraw the grid on listbox change event.
            window.scroll(0, 0); //scroll to top of page
            if (this.value === "" || this.value.match(/[^0-9]/)) { /* Nothing entered or non-numeric character */
                return;
            }
            var iNewStart = oSettings._iDisplayLength * (this.value - 1);
            if (iNewStart > oSettings.fnRecordsDisplay()) { /* Display overrun */
                oSettings._iDisplayStart = (Math.ceil((oSettings.fnRecordsDisplay() - 1) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength;
                fnCallbackDraw(oSettings);
                return;
            }
            oSettings._iDisplayStart = iNewStart;
            fnCallbackDraw(oSettings);
        });
        /* Take the brutal approach to cancelling text selection */
        $('span', nPaging).bind('mousedown', function () {
            return false;
        });
        $('span', nPaging).bind('selectstart', function () {
            return false;
        });
    },

    /*
     * Function: oPagination.listbox.fnUpdate
     * Purpose:  Update the listbox element
     * Returns:  -
     * Inputs:   object:oSettings - dataTables settings object
     *             function:fnCallbackDraw - draw function which must be called on update
     */
    "fnUpdate": function (oSettings, fnCallbackDraw) {
        if (!oSettings.aanFeatures.p) {
            return;
        }
        var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
        var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
        /* Loop over each instance of the pager */
        var an = oSettings.aanFeatures.p;
        for (var i = 0, iLen = an.length; i < iLen; i++) {
            var spans = an[i].getElementsByTagName('span');
            var inputs = an[i].getElementsByTagName('select');
            var elSel = inputs[0];
            if (elSel.options.length != iPages) {
                elSel.options.length = 0; //clear the listbox contents
                for (var j = 0; j < iPages; j++) { //add the pages
                    var oOption = document.createElement('option');
                    oOption.text = j + 1;
                    oOption.value = j + 1;
                    try {
                        elSel.add(oOption, null); // standards compliant; doesn't work in IE
                    } catch (ex) {
                        elSel.add(oOption); // IE only
                    }
                }
                // spans[1].innerHTML = "&nbsp;of&nbsp;" + iPages;
                spans[1].innerHTML = "&nbsp;/&nbsp;" + iPages;
            }
            elSel.value = iCurrentPage;
        }
    }
};
/*
 * jQuery Highlight plugin
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - has an option to highlight only entire words (wordsOnly - false by default),
 *  - has an option to be case sensitive (caseSensitive - false by default)
 *  - highlight element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrance of text 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // search for and highlight more terms at once
 *   // so you can save some time on traversing DOM
 *   $('#content').highlight(['lorem', 'ipsum']);
 *   $('#content').highlight('lorem ipsum');
 *
 *   // search only for entire word 'lorem'
 *   $('#content').highlight('lorem', { wordsOnly: true });
 *
 *   // don't ignore case during search of term 'lorem'
 *   $('#content').highlight('lorem', { caseSensitive: true });
 *
 *   // wrap every occurrance of term 'ipsum' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').unhighlight();
 *
 *   // remove custom highlight
 *   $('#content').unhighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 */

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
            !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
            !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
        return word != '';
    });
    words = jQuery.map(words, function(word, i) {
        return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};

/**
 * @author Jocker Liu, 2020/10/28, created
 * @author Leo Liao(leoliaolei@gmail.com), 2021/05/07, massive code refactor and enhancement
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('datatableUtil', datatableUtil);
    datatableUtil.$inject = [];

    /**
     * @ngdoc service
     * @name datatableUtil
     */
    function datatableUtil() {
        this.wrapText = _wrapText;
        this.customizeExcelExport = _excelCustomize;
        this.buildSingleCheckbox = buildSingleCheckbox;
        this.htmlAttrToValue = htmlAttrToValue;
        this.valueToHtmlAttr = valueToHtmlAttr;

        /**
         * Convert value to HTML attribute value
         * @param any
         * @return {string}
         */
        function valueToHtmlAttr(any) {
            return JSON.stringify(any);
        }

        /**
         * Convert HTML attribute value to actual value
         * @param {string} str
         * @return {*}
         */
        function htmlAttrToValue(str) {
            try {
                return JSON.parse(str);
            } catch (err) {
                console.error('Cannot parse value %o as JSON', str);
            }
        }


        /**
         * Build checkbox HTML for a table row
         * @param {object} row Data of table row
         * @param {function(object)|string} valueData
         * @param {function(object)|string} labelData
         * @param {function(object)} stateFn A function returns 'disabled' or 'hidden'
         * @param {{isLegacy:boolean}=} options
         * @return {string} Checkbox HTML
         */
        function buildSingleCheckbox(row, valueData, labelData, stateFn, options) {
            options = options || {isLegacy: false, checked: false};
            var value = angular.isFunction(valueData) ? valueData(row) : row[valueData];
            var label = angular.isFunction(labelData) ? labelData(row) : row[labelData];
            var disabledHtml = '';
            if (angular.isFunction(stateFn)) {
                var state = stateFn(row);
                if (state === 'disabled') {
                    disabledHtml = ' disabled ';
                } else if (state === 'hidden') {
                    return '';
                }
            }
            // 20210911: Straight string concatenation is not safe when attribute value contains quotation mark.
            // Use attr() to properly set attribute value.
            // NOT THIS: '<input type="checkbox" class="js-mcheck-single" value="' + value + '" data-label="' + label + '" ' + disabledHtml + '>'
            var htmlValue = valueToHtmlAttr(value);

            var checkbox = $('<input type="checkbox" class="js-mcheck-single" ' + disabledHtml + '>')
                .attr('data-label', label)
                .attr(options.isLegacy ? 'data-value' : 'value', htmlValue);

            //Note 202403 set checkbox is checked by selected
            if (options.checked) {
                checkbox.attr('checked', true);
            }
            // if (selectedItemsInJson.indexOf(htmlValue) > -1) {
            //     // It seems prop('checked', true) cannot populate the checked attribute in HTML
            //     checkbox.attr('checked', true);
            //     // 20210911: Strange! table instance can be accessed in render.
            //     var tr = $(builder._dtInstance.row(meta.row).node());
            //     tr.data('op_selected_value', value).addClass(TR_SELECTED_CSS);
            // }


            return '<div class="checkbox checkbox-inline checkbox-primary">' +
                checkbox.prop('outerHTML') +
                '<label></label>' +
                '</div>';
        }

        function _wrapText(data, type) {
            if (angular.isUndefined(data)) {
                return '';
            }
            if (type !== 'display' && type !== 'export')
                return data;
            if (!angular.isString(data)) {
                return data;
            }
            //https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3
            // Total number of characters that a cell can contain 32767 characters
            if (type === 'export' && data.length > 32767) {
                data = '[' + $translate.instant('common.table.length_limit_exceeded') + ']\n' + data.substr(0, 32000);
            }
            return data.replace(/\n/g, type === 'display' ? '<br>' : '\r');
        }


        /**
         * https://datatables.net/forums/discussion/41778
         * https://datatables.net/reference/button/excelHtml5
         * @param xlsx
         */
        function _excelCustomize(xlsx) {
            var sheet = xlsx.xl.worksheets['sheet1.xml'];
            //32 - Bold, grey background, thin black border
            $('row:first c', sheet).attr('s', '32');

            $('row', sheet).each(function (rowIndex) {
                var $row = $(this);
                $('c', $row).each(function (colIndex) {
                    if (rowIndex > 0) {
                        var $cell = $(this);
                        //55 - Wrapped text (since 1.2.2)
                        $cell.attr('s', 55);
                        // $cell.text($cell.text().replace('\n','<br>'));
                        // var size = $cell.text().length;
                        //https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3
                        // Total number of characters that a cell can contain 32767 characters
                        // if (size > 32767) {
                        // TODO: $cell.text() does not work
                        //     $cell.text('[数据超长]' + $cell.text().substr(0, 32000));
                        // }
                    }
                });


                // if ($('is t', this).text()) {
                //wrap text
                // $(this).attr('s', '55');

                //append the concat formula
                // $(this).append('<f>' + $('is t', this).text() + '</f>');
                //remove the inlineStr
                // $('is', this).remove();
                // }
            });
        }
    }

    angular.module('oplus.commons').service('opDatatable', opDatatable);
    opDatatable.$inject = ['currentUser', '$compile', '$filter', '$timeout', '$http', '$q', 'messageService', '$translate', 'datatableUtil'];

    /**
     * `scope[SELECTED_ITEMS_SCOPE_NAME]` stores selected items for display in dropdown, data format: `[{value:*, label:string}]`
     * `builder.selectedItems` is a reference to incoming preselected defined in `withSelection(setting.preselected)`
     * for export, data format `[*]`
     *
     * @ngdoc service
     * @name opDatatable
     * Borrowed from https://github.com/l-lin/angular-datatables/tree/angular1
     * @param {currentUser} currentUser
     * @param $compile
     * @param $filter
     * @param $timeout
     * @param $http
     * @param $q
     * @param {messageService} messageService
     * @param $translate
     * @param {datatableUtil} datatableUtil
     */
    function opDatatable(currentUser, $compile, $filter, $timeout, $http, $q, messageService, $translate, datatableUtil) {
        var TR_SELECTED_CSS = 'selected';
        var STATE_SAVE_KEY = 'oplus.datatables';
        var STATE_SAVE_LIMIT = 10;
        var STATE_SAVE_EXPIRY_MINUTES = 1 * 60;
        this.buildTable = buildTable;


        /**
         *
         * @param {string|jQuery} selector jQuery qualified selector of `table` element
         * @param {angular.scope} scope
         */
        function buildTable(selector, scope) {
            var table = $(selector);
            if (table.length === 0) {
                throw new Error('ProgramError: Cannot find table element by selector `' + selector + '`');
            }

            return {
                fromData: fromData
            };

            /**
             * Init data for table. The data can be these format:
             * 1. `fnPromise<function>` a function returning a promise of data array.
             * 2. `[fnPromise<function>, dataSrc<string>, isServerSide<boolean>]` The format of function returned promise
             * data can be data array or data object. In case of data object, use `dataSrc` indicate the path to pick data array.
             * 3. `[dataRecord<object>]` Array of concrete data record.
             * @parm data The data source for table.
             * @returns {_TheBuilder}
             */
            function fromData(data) {
                if (angular.isFunction(data)) {
                    return fromFnPromise(data);
                } else if (angular.isArray(data)) {
                    var fnPromise, dataSrc, isServerSide;
                    if (angular.isFunction(data[0])) {
                        fnPromise = data[0];
                        dataSrc = data.length > 1 ? data[1] : '';
                        isServerSide = data.length > 2 ? data[2] : false;
                    } else {
                        fnPromise = function () {
                            return $q.when(data)
                        };
                    }
                    return fromFnPromise(fnPromise, dataSrc, isServerSide);
                }
                throw new TypeError('Parameter data of `fromData` must be a function or array, it is ' + (typeof data));
            }

            /**
             * Data from promise.
             * @param fnPromise the function that returns a promise to fetch the data
             * @param {string|null|undefined=} dataSrc Defines the property from the data source object to read.
             * https://datatables.net/reference/option/ajax.dataSrc
             * @param {boolean=} isServerSide
             */
            function fromFnPromise(fnPromise, dataSrc, isServerSide) {
                var builder = new _TheBuilder(selector, scope);
                builder._dtOptions.ajax = ajaxFn;
                if (isServerSide === true) {
                    builder._dtOptions.serverSide = true;
                    // builder._dtOptions.deferRender = true;
                }
                return builder;

                function ajaxFn(dataToServer, callback, settings) {
                    // Move includes element before ajax which may take long time
                    builder._features.forEach(function (feature) {
                        if (angular.isFunction(feature.beforeData)) {
                            feature.beforeData(builder);
                        }
                    });
                    // $q.when ensure a promise
                    var promise = $q.when(fnPromise(dataToServer));
                    promise.then(function (result) {
                        if (dataSrc) {
                            result = _.get(result, dataSrc);
                        }
                        if (angular.isArray(result)) {
                            callback({data: result});
                        } else if (angular.isArray(result.data)) {
                            //TODO: why try result.data? compatible with $http?
                            console.warn('%cDEPRECATED USAGE:%c try get data from `data` property', 'color:red', '');
                            callback(result);
                        } else {
                            var error = 'Unknown data format for table. The valid data format is an array of object, or its `data` property is an array.'
                            console.warn(error, result);
                            throw new Error(error + '\nPlease check the console output.');
                        }
                    }).catch(function (err) {
                        messageService.toast('error', $translate.instant('common.table.unable_get_table_data'), err.message);
                    });
                }
            }
        }

        /**
         * Create a table builder.
         * @param selector
         * @param scope
         * @private
         */
        function _TheBuilder(selector, scope) {
            this.SELECTED_ITEMS_SCOPE_NAME = '__selected__items__';
            var builder = this;
            this._selector = selector;
            this._scope = scope;
            this._dtOptions = {buttons: []};
            /**
             * The datatable instance
             * @see {@link https://datatables.net/reference/api/}
             * @private
             */
            this._dtInstance = null;
            this._features = [];
            this.getTableApi = getTableApi;
            // this._getTableElem = _getTableElem;
            // this._addFeature = _addFeature;
            this.withOption = withOption;
            this.withOptions = withOptions;
            this.withOrder = withOrder;
            this.withColumn = withColumn;
            this.withStateSave = withStateSave;
            this.withButton = withButton;
            this.withSelection = withSelection;
            this.withCustomControl = withCustomControl;
            this.render = renderDataTable;
            this.reloadData = reloadData;
            this.reloadDataSync = reloadDataSync;
            this.getTableData = getTableData;
            this.markItemsSelected = markItemsSelected;

            function getTableApi() {
                return builder._dtInstance;
            }

            // this.api = {
            //     reloadData: reloadData,
            //     markItemsSelected: markItemsSelected
            // };

            function getCustControlElem(builder) {
                var selector = '.js-dt-custctrls';
                return _getTableWrapper().find(selector);
                // return $(builder._dtInstance.table().container()).find(selector);
            }

            /**
             * Add extra feature to table
             * @param feature
             * @param {function(_TheBuilder)} feature.beforeInit Called before `DataTable()`
             * @param {function(_TheBuilder)} feature.beforeData Called after DataTable created and before ajax data call
             * @param {function(_TheBuilder)} feature.afterInit Called in DataTable `initComplete`
             * @param {function(_TheBuilder)} feature.onDestroy Called on scope destroy
             */
            function _addFeature(feature) {
                // var builder = this;
                builder._features.push(feature);
                return builder;
            }

            function _getTableWrapper() {
                return _getTableElem().closest('.dataTables_wrapper');

            }

            function _getTableElem() {
                // var builder = this;
                return $(builder._selector);
            }

            /**
             * Add items to selected. It compares by JSON stringified item `value`
             * @param {[{value:*}]} items
             */
            function markItemsSelected(items) {
                // console.log('markItemsSelected');
                var selectedValuesInJson = _.map(items, function (o) {
                    // return JSON.stringify(o.value);
                    return JSON.stringify(o);
                });
                var checkboxes = [];
                builder._dtInstance.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var checkbox = $('.js-mcheck-single', this.node());
                    var rowValue = checkbox.attr('value');
                    var valueComparator = builder._selectionSetting.valueComparator;
                    var found = false;
                    if (angular.isFunction(valueComparator)) {
                        found = _.find(items, function (o) {
                            return valueComparator(o, datatableUtil.htmlAttrToValue(rowValue));
                        });
                    } else {
                        found = selectedValuesInJson.indexOf(rowValue) > -1;
                    }
                    if (found) {
                        checkboxes.push(checkbox);
                    }
                });
                selectRows(scope, checkboxes, true);
            }

            function reloadData() {
                builder._dtInstance.ajax.reload(function () {
                    if (builder.selectedItems instanceof Array) builder.selectedItems.length = 0;
                    if (scope[builder.SELECTED_ITEMS_SCOPE_NAME] instanceof Array) scope[builder.SELECTED_ITEMS_SCOPE_NAME].length = 0;
                }, false);
            }

            function reloadDataSync() {
                new Promise(function (resolve, reject) {
                    builder._dtInstance.ajax.reload(function () {
                        resolve();
                    }, false);
                }).then(function () {
                    if (builder.selectedItems instanceof Array) builder.selectedItems.length = 0;
                    if (scope[builder.SELECTED_ITEMS_SCOPE_NAME] instanceof Array) scope[builder.SELECTED_ITEMS_SCOPE_NAME].length = 0;
                    _reloadTable();
                });
            }

            function _reloadTable() {
                var tableElem = _getTableElem();
                $('th *', tableElem).on('click', function (event) {
                    var elem = $(event.target);
                    // If not checkbox (input)
                    if (!elem.is('input')) {
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        // event.preventDefault();
                        // return false;
                    }
                });
                // $('th .js-column-action', tableElem).on('click', function (event) {
                //     $('tr.js-cust-column-search-wrapper', tableElem).toggleClass('hidden');
                //     event.stopImmediatePropagation();
                // });
                //---- Create column auto filter
                //http://live.datatables.net/tamixov/1/edit
                // 重新渲染下拉菜单数据时，清空原有的数据
                var $tableWrapper = _getTableWrapper();
                var $select = $tableWrapper.find('.js-dt-filter-zone select');
                if ($select.length > 0) {
                    $select.remove();
                }
                builder._dtOptions.columns.forEach(function (columnDef, index) {
                    var extra = columnDef._extra || {};
                    if (extra.autoFilter) {
                        var $tableWrapper = _getTableWrapper();
                        builder._dtInstance.columns(index).every(function () {
                            var column = this;
                            var $select = $('<select class="form-select d-inline-block w-auto">' +
                                '<option value="">' + $(column.header()).text() + '</option></select>');
                            if (extra.autoFilterKey) {
                                $select.addClass('js-autofilter');
                                $select.data('filterKey', extra.autoFilterKey);
                            }
                            var ctrl = $select.prependTo($tableWrapper.find('.js-dt-filter-zone'));
                            //TODO: need remove the event listener on destroy
                            // console.log('columnDef', columnDef);
                            var select = ctrl.on('change', function () {
                                var elem = $(this);
                                var val = $.fn.dataTable.util.escapeRegex(
                                    elem.val()
                                );
                                column.search(val ? '^' + val + '$' : '', true, false).draw();
                            });
                            column.nodes().map(function (node, index) {
                                return node.innerText;
                            }).unique().sort().each(function (d, j) {
                                // Filter Option is empty
                                if (d) {
                                    select.append('<option value="' + d + '">' + d + '</option>')
                                }
                            });
                        });
                        var savedState = getSavedState();
                        if (savedState) {
                            var filters = $tableWrapper.find('.js-autofilter');
                            var autofilters = savedState.autofilters || {};
                            Object.keys(autofilters).forEach(function (key) {
                                filters.each(function () {
                                    var $select = $(this);
                                    if ($select.data('filterKey') === key) {
                                        $select.val(autofilters[key]);
                                    }
                                });
                            });
                        }
                    }
                });
            }


            function getTableData() {
                // var builder = this;
                return builder._dtInstance.data() || [];
            }

            /**
             *
             * @returns {_TheBuilder}
             */
            function renderDataTable() {
                // var builder = this;
                var tableElem = _getTableElem();
                if ($.fn.DataTable.isDataTable(tableElem)) {
                    return;
                }
                builder._features.forEach(function (feature) {
                    feature.beforeInit && feature.beforeInit(builder);
                });
                var dtOptions = _createDtOptions();

                addEventOnTableUIReady(tableElem);
                builder._dtInstance = tableElem.DataTable(dtOptions);
                // tableElem.on('destroy.dt', function (e, settings) {
                //     builder._features.forEach(function (feature) {
                //         feature.onDestroy && feature.onDestroy(builder);
                //     });
                // });
                builder._scope.$on('$destroy', function () {
                    builder._features.forEach(function (feature) {
                        feature.onDestroy && feature.onDestroy(builder);
                    });
                });

                return builder;

                function addEventOnTableUIReady(table) {
                    table.on('preInit.dt', function (event) {
                        var wrapper = _getTableWrapper();
                        addClearFilterButton(wrapper);
                    });

                    function addClearFilterButton($wrapper) {
                        var inputFilter = $wrapper.find('.dataTables_filter .js-dt-filter');
                        if (inputFilter.length > 0) {
                            var btnResetSearch = '<button type="button" class="btn btn-default opx-btn-icon opx-btn-flat op-dt-clearfilter" ng-click="clearSearch()"><i class="far fa-times"></i></button>';
                            scope.clearSearch = function () {
                                builder._dtInstance.search('').draw();
                                inputFilter.focus();
                            }
                            inputFilter.after($compile(btnResetSearch)(scope)).addClass('op-filter-with-button');
                        }
                    }
                }
            }

            function withStateSave() {
                var options = builder._dtOptions;
                if (!_getTableElem().attr('id')) {
                    options.stateSave = false;
                    return;
                }
                options.stateSave = true;
                options.stateSaveCallback = function (settings, data) {
                    var states = loadAllStates();
                    // Because we save custom data like autofilter, do not assign data to states[settings.sInstance] directly
                    states[settings.sInstance] = _.extend({}, states[settings.sInstance], data);
                    var keys = Object.keys(states);
                    if (keys.length > STATE_SAVE_LIMIT) {
                        keys.sort(function (a, b) {
                            return states[b].time - states[a].time
                        });
                        for (var i = keys.length - 1; i >= STATE_SAVE_LIMIT; i--) {
                            delete states[keys[i]];
                        }
                    }
                    if (STATE_SAVE_EXPIRY_MINUTES > 0) {
                        Object.keys(states).forEach(function (key) {
                            // Remove states if expired
                            if (Date.now() - states[key].time > STATE_SAVE_EXPIRY_MINUTES * 60 * 1000) {
                                delete states[key];
                            }
                        });
                    }
                    return saveAllStates(states);
                };
                options.stateLoadCallback = function (settings) {
                    var states = loadAllStates();
                    return states[settings.sInstance] || {};
                };
                options.stateSaveParams = function (settings, data) {
                    var filters = _getTableWrapper().find('.js-autofilter');
                    if (filters.length > 0) {
                        data.autofilters = {};
                        filters.each(function () {
                            var $select = $(this);
                            var key = $select.data('filterKey');
                            data.autofilters[key] = $select.val();
                        });
                    }
                };
                return builder;
            }

            /**
             * Add the option to the datatables options
             * @param key the key of the option
             * @param value an object or a function of the option
             */
            function withOption(key, value) {
                // var builder = this;
                if (angular.isString(key)) {
                    builder._dtOptions[key] = value;
                }
                return builder;
            }


            function withOptions(obj) {
                Object.entries(obj).forEach(function (entry) {
                    var key = entry[0], value = entry[1];
                    if (angular.isString(key)) {
                        builder._dtOptions[key] = value;
                    }
                })

                return builder;
            }

            /**
             * Create table with buttons.
             * @param {[]} buttons Supported buttons include "excel" to export table in Excel, "reload" to reload table data
             * @returns {_TheBuilder}
             */
            function withButton(buttons) {
                buttons = angular.isString(buttons) ? [buttons] : buttons;
                if (angular.isArray(buttons)) {
                    buttons.forEach(function (button) {
                        if ('colvis' === button) {
                            builder._dtOptions.buttons.push({
                                extend: 'colvis',
                                text: '<i class="far fa-columns" title="' + $translate.instant('common.table.select_column') + '"></i>',
                                className: "__btn-sm btn-default opx-btn-icon opx-btn-flat",
                                columnText: function (dt, idx, title) {
                                    return (idx + 1) + ': ' + title;
                                }
                            });
                        } else if ('excelHtml5' === button || 'excel' === button) {
                            var caption = _getTableElem().data('caption') || 'DataExport';
                            builder._dtOptions.buttons.push({
                                extend: 'excelHtml5',
                                text: '<i class="far fa-file-download" title="' + $translate.instant('common.table.data_output') + '"></i>',
                                className: "__btn-sm btn-default opx-btn-icon opx-btn-flat",
                                filename: caption + '_' + $filter('date')((new Date()), "yyyyMMdd"),
                                title: null,
                                autoFilter: true,
                                customize: datatableUtil.customizeExcelExport,
                                exportOptions: {orthogonal: 'export'}
                            });
                        } else if ('reload' === button) {
                            builder._dtOptions.buttons.push({
                                extend: '',
                                text: '<i class="far fa-sync-alt" title="' + $translate.instant('common.table.refresh_table') + '"></i>',
                                className: "__btn-sm btn-default opx-btn-icon opx-btn-flat",
                                title: $translate.instant('common.table.refresh_table'),
                                action: function (event, dt, node, cfg) {
                                    var that = this;
                                    var refreshIcon = $(node).find('i');
                                    that.disable(); // disable button
                                    refreshIcon.addClass('fa-spin');
                                    dt.ajax.reload(function () {
                                        that.enable();
                                        refreshIcon.removeClass('fa-spin');
                                    }, false);
                                }
                            });
                        } else {
                            throw new Error('UnSupported button : ' + button.toString());
                        }
                    });
                }
                return builder;
            }

            /**
             * With a checkbox in front of each row.
             * Added by Leo 20210507.
             * The value of selected items is in format of [{value:*, label:string}] and stored in element's `scope[SELECTED_ITEMS_SCOPE_NAME]`
             * @param setting
             * @param {string|function} setting.valueData Value of selected item
             * @param {string|function} setting.labelData Label of selected item
             * @param {string|function<*,*>=} setting.valueComparator  A function to compare two values if equal.
             * It is used to program select checkbox. If not specified, it will compare by JSON string.
             * Parameter 1 is self value data, parameter 2 is value taken from checkbox.
             * @param {[{value:*,label:string=}]} setting.preselected Reference of variable to hold selected items
             * @param {function} setting.stateFn A function to determine checkbox state.
             * Function support parameter `row` as row data.
             * Return value is string "disabled" to disable the checkbox, "hidden" to hide the checkbox.
             * @returns {_TheBuilder}
             */
            function withSelection(setting) {
                if (!setting) {
                    return builder;
                }
                if (!setting.valueData || (!angular.isString(setting.valueData) && !angular.isFunction(setting.valueData))) {
                    throw new TypeError('Parameter `setting.valueData` in `withSelection(setting)` must be non-empty string or function');
                }
                if (setting.labelData && (!angular.isString(setting.labelData) && !angular.isFunction(setting.labelData))) {
                    throw new TypeError('Parameter `setting.labelData` in `withSelection(setting)` is either empty, string or function');
                }
                if (setting.preselected && !angular.isArray(setting.preselected)) {
                    throw new TypeError('Parameter `setting.preselected` in withSelection(setting` must be array');
                    // if (setting.preselected.length > 0) {
                    //     var sample = setting.preselected[0];
                    //     if (!sample.hasOwnProperty('value')) {
                    //         throw new TypeError('Parameter `setting.preselected` in withSelection(setting` must be format of `[{value:*,label:string=}]`');
                    //     }
                    // }
                }
                builder.selectedItems = setting.preselected;
                var stateFn = setting.stateFn;
                builder._selectionSetting = setting;
                builder._dtOptions.columns = builder._dtOptions.columns || [];
                // scope[builder.SELECTED_ITEMS_SCOPE_NAME] = selectedItems;
                // builder.selectedItems = selectedItems;
                scope[builder.SELECTED_ITEMS_SCOPE_NAME] = [];
                builder._dtOptions.columns.unshift({
                    //https://datatables.net/forums/discussion/41269/requested-unknown-parameter-error-with-createdcell-in-conjunction-with-render
                    data: null,
                    title: '<div class="checkbox checkbox-inline checkbox-primary"><input type="checkbox" class="js-mcheck-all"><label></label></div>',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var valueData = setting.valueData;
                        var labelData = setting.labelData;
                        return datatableUtil.buildSingleCheckbox(row, valueData, labelData, stateFn);
                    }
                });
                _addFeature({
                    onDestroy: function (builder) {
                        var wrapper = _getTableWrapper();
                        wrapper.off();
                    },
                    afterInit: function () {
                        var wrapper = _getTableWrapper();
                        $compile(buildSelectionMark(scope))(scope)
                            .prependTo(wrapper.find('.js-dt-selmark'));
                        wrapper.on('click', 'input.js-mcheck-all', function (e) {
                            var checked = $(this).prop('checked');
                            $timeout(function () {
                                selectRows(builder._scope, wrapper.find('td input.js-mcheck-single').not('[disabled]'), checked);
                            });
                            e.stopPropagation();
                        }).on('click', 'input.js-mcheck-single', function (e) {
                            var checkbox = $(this);
                            $timeout(function () {
                                selectRows(builder._scope, checkbox, null);
                            });
                            e.stopPropagation();
                        }).on('click', '.js-dt-selmark .dropdown-menu', function (e) {
                            // https://stackoverflow.com/questions/44646567/keep-bootstrap-dropdown-open-when-clicked-inside
                            e.stopPropagation();
                        });
                        if (setting.preselected) {
                            // console.log('afterInit.markItemsSelected', {preselected: setting.preselected});
                            markItemsSelected(setting.preselected);
                        }

                        /**
                         * Build selection mark dropdown.
                         * @param scope
                         * @returns {string} The dropdown HTML
                         */
                        function buildSelectionMark(scope) {
                            var bulkSelectionHtml = '<div class="dropdown" ng-if="' + builder.SELECTED_ITEMS_SCOPE_NAME + '.length > 0">' +
                                '<button type="button" data-bs-toggle="dropdown" class="btn __btn-sm btn-default opx-btn-flat"><span ng-bind-html="\'common.datatable.selected_items_count\' | translate:{count:' + builder.SELECTED_ITEMS_SCOPE_NAME + '.length}"></span> <i class="fa fa-angle-down"></i></button>' +
                                '<div class="dropdown-menu" ng-if="' + builder.SELECTED_ITEMS_SCOPE_NAME + '.length>0" style="max-width:20rem;max-height:25rem;overflow-y:auto;">' +
                                '<div class="dropdown-item" ng-repeat="item in ' + builder.SELECTED_ITEMS_SCOPE_NAME + ' track by $index">' +
                                '<span class="d-flex py-2 px-3">' +
                                '<span class="me-auto text-ellipsis">{{item.label||item.value}}</span>' +
                                '<button class="ms-1 btn btn-sm btn-danger opx-btn-icon opx-btn-flat" ng-click="removeSelectedItem($index)" __style="width:1rem;text-align:center;"><i class="fa fa-times"></i></button>' +
                                '</span>' +
                                '</div>' +
                                '</div></div>';
                            scope.removeSelectedItem = function (index) {
                                var removedItem = scope[builder.SELECTED_ITEMS_SCOPE_NAME].splice(index, 1)[0];
                                // console.log('buildSelMark.dtInstance',dtInstance);
                                builder._dtInstance.rows('.' + TR_SELECTED_CSS).every(function () {
                                    var row = this;
                                    var tr = $(row.node());
                                    if (tr.data('op_selected_value') === removedItem.value) {
                                        var checkbox = tr.find('.js-mcheck-single');
                                        selectRows(scope, checkbox, false);
                                    }
                                });
                            };
                            return bulkSelectionHtml;
                        }
                    }
                });
                return builder;
            }

            /**
             * Toggle rows checkbox state and row css style.
             * Sync between checkboxes and page parameters.
             * @param scope
             * @param {angular.element|[angular.element]} checkboxes Checkbox elements to select
             * @param {boolean=} forcedState Use this value if specified, otherwise use checkbox property.
             */
            function selectRows(scope, checkboxes, forcedState) {
                var isForced = _.isBoolean(forcedState);
                if (angular.isArray(checkboxes)) {
                    checkboxes.forEach(function (checkbox) {
                        selectOne(checkbox);
                    });
                } else {
                    checkboxes.each(function () {
                        selectOne($(this));
                    });
                }
                builder.selectedItems.length = 0;
                scope[builder.SELECTED_ITEMS_SCOPE_NAME].forEach(function (o) {
                    builder.selectedItems.push(o.value);
                });

                function selectOne(checkbox) {
                    var tr = checkbox.closest('tr');
                    var isChecked;
                    var value = checkbox.attr('value');
                    var item = {
                        value: datatableUtil.htmlAttrToValue(value),
                        label: checkbox.data('label')
                    };
                    if (isForced) {
                        isChecked = forcedState;
                        checkbox.prop('checked', forcedState);
                    } else {
                        isChecked = checkbox.prop('checked');
                    }
                    _.remove(scope[builder.SELECTED_ITEMS_SCOPE_NAME], function (o) {
                        return datatableUtil.valueToHtmlAttr(o.value) === value;
                    });
                    if (isChecked) {
                        scope[builder.SELECTED_ITEMS_SCOPE_NAME].push(item);
                        tr.data('op_selected_value', item.value).addClass(TR_SELECTED_CSS);
                    } else {
                        tr.removeData('op_selected_value').removeClass(TR_SELECTED_CSS);
                    }
                }
            }

            /**
             * Create DataTable options used in `.DataTable(options)`
             * @param {{noSearch:boolean,pagination:string}}config
             */
            function _createDtOptions(config) {
                var headerDom;
                // var builder = this;
                config = config || {filter: 'right'};
                //https://datatables.net/reference/option/dom
                // l: length, f: filter, t: table, i: info, p: pagination, r: processing
                // B: buttons, R: ColReorder, S: Scroller, P: SearchPanes
                var domFilterLeft = "<'js-dt-filter-zone form-inline' fB<'js-dt-selmark'>>";
                var domFilterRight = "<'js-dt-filter-zone form-inline' <'js-dt-selmark'>fB>";
                var domCustCtrls = "<'js-dt-custctrls op-smartform form-inline flex-fill'>";
                if (config.filter === 'left') {
                    domCustCtrls = "<'js-dt-custctrls justify-content-end op-smartform form-inline flex-fill'>";
                    headerDom = "<'op-datatable-header'" + domFilterLeft + domCustCtrls + ">";
                } else {
                    headerDom = "<'op-datatable-header'" + domCustCtrls + domFilterRight + ">";
                }
                var footerDom = "<'js-dt-footer op-datatable-footer'<li><p>>";
                if (config.pagination === 'none') {
                    footerDom = "<'js-dt-footer op-datatable-footer'>";
                }
                var dom = headerDom + "<'js-dt-table table-responsive flex-fill'tr>" + footerDom;
                var dtOptions = {
                    // autoWidth: true,
                    autoWidth: false,
                    // deferRender: true,
                    lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
                    pageLength: 10,
                    // scrollX: true,
                    // scrollY: 600,//高度最大为600px,再大就上下滚动显示
                    // scrollCollapse: true,
                    serverSide: false,
                    buttons: [],
                    // pagingType: "simple_numbers",
                    // pagingType: 'listbox',
                    pagingType: 'input',
                    dom: dom,
                    renderer: 'bootstrap',
                    // processing: true,
                    //https://datatables.net/blog/2014-10-22
                    searchHighlight: true,
                    responsive: {
                        details: {
                            type: 'inline',
                            renderer: $.fn.dataTable.Responsive.renderer.listHiddenNodes()
                        }
                    },
                    drawCallback: function (settings) {
                        hideFooterWhenEmpty();

                        function hideFooterWhenEmpty() {
                            var wrapper = _getTableWrapper();
                            var isEmpty = wrapper.find('.dataTables_empty').length === 1;
                            var footer = wrapper.find('.js-dt-footer');
                            if (isEmpty) {
                                footer.hide();
                            } else {
                                footer.show();
                            }
                        }
                    },
                    createdRow: function (row, data, dataIndex) {
                        if (builder._scope) {
                            // console.log(builder._selector,builder._scope);
                            $compile(row)(builder._scope);
                        }
                    },
                    initComplete: function (settings, json) {
                        builder._features.forEach(function (feature) {
                            feature.afterInit && feature.afterInit(builder);
                        });
                    }
                };
                var allOptions = $.extend(true, {}, dtOptions, builder._dtOptions);
                return allOptions;
            }

            function loadAllStates() {
                return JSON.parse(localStorage.getItem(STATE_SAVE_KEY) || '{}');
            }

            function getSavedState() {
                if (builder._dtOptions.stateSave) {
                    var tableId = _getTableElem().attr('id');
                    if (tableId) {
                        var allStates = loadAllStates();
                        return allStates[tableId];
                    }
                }
                return null;
            }

            function saveAllStates(all) {
                if (angular.isObject(all)) {
                    localStorage.setItem(STATE_SAVE_KEY, JSON.stringify(all));
                }
            }

            /**
             * Prepend custom controls to table header.
             * Added by Leo 20210507.
             * @param {string|angular.element} ctrl HTML content or selector of custom controls.
             * If this is HTML content, it will be compiled to support angularjs.
             * @returns {*}
             */
            function withCustomControl(ctrl) {
                // var builder = this;
                _addFeature({
                    beforeData: function (builder) {
                        var container = getCustControlElem(builder);
                        var elem = $(ctrl).prependTo(container);
                        if (angular.isString(ctrl)) {
                            // Compile only if custom control is not compiled
                            $compile(elem)(scope);
                        }
                    }
                })
                return builder;
            }

            /**
             * @param {[[]]} order In format of [[0, 'asc'],[1, 'desc']]
             */
            function withOrder(order) {
                // var builder = this;
                if (!order) {
                    // Override default [[0, 'asc']]
                    builder._dtOptions.order = [];
                    return this;
                }
                if (!angular.isArray(order)) {
                    throw new Error('The parameter orders must be an array');
                }
                builder._dtOptions.order = order;
                return builder;
            }

            function withColumn(columns) {
                // var builder = this;
                if (!angular.isArray(columns)) {
                    throw new Error('ProgramError: The parameter columns must be a array');
                }
                // Do not mutate incoming columns
                builder._dtOptions.columns = angular.copy(columns);
                builder._dtOptions.columns.forEach(function (col) {
                    if (angular.isUndefined(col.defaultContent)) {
                        col.defaultContent = '';
                    }
                    if (angular.isUndefined(col.title)) {
                        col.title = col.data || '';
                    }
                    if (!col.render) {
                        var extra = _.extend({}, {linebreak: true, linelimit: false}, col._extra);
                        col.render = function (data, type, row, meta) {
                            var text = data;
                            if (extra.linebreak === true) {
                                text = datatableUtil.wrapText(data, type);
                                // console.log(text);
                            }
                            if (type === 'display' && extra.linelimit === true) {
                                return '<div class="udp-linelimit">' + text + '</div>';
                            }
                            return text;
                        }
                    }
                });
                _addFeature({
                    beforeInit: function wrapColumn(builder) {
                        var tableElem = _getTableElem();
                        var thead = '';
                        builder._dtOptions.columns.forEach(function (column, index) {
                            var action = '';
                            thead += '<th data-col-index="' + index + '"><div class="d-flex justify-content-between op-hover-trigger"><span class="js-column-label flex-fill">' + column.title + '</span>' + action + '</div></th>';
                            delete column.title;
                        });
                        thead = '<thead><tr>' + thead + '</tr></thead>';
                        tableElem.remove('thead');
                        tableElem.prepend(thead);
                    },
                    afterInit: function (builder) {
                        _reloadTable();
                    }
                });
                return builder;
            }
        }
    }
})
();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/05/12, created
 */
(function () {
    'use strict';

    angular.module('oplus.commons').directive('opxDatatable', opxDatatableDirective);
    opxDatatableDirective.$inject = ['opDatatable'];

    /**
     * @ngdoc directive
     * @name opxDatatable
     * @element E
     * @description 用于创建常用表格的指令。
     *
     * > ATTENTION: Use directive instead of component, because component scope is always isolated.
     * > We need access invoker's scope in table's row action.
     *
     * **使用方法**
     *
     * ```html
     * <opx-datatable table-config="{
     *     data: function|[],
     *     columns:[{}],
     *     order:[[]],
     *     buttons:[string],
     *     selection:{labelData:string|function, valueData:string|function, preselected:*},
     *     responsive: boolean
     *  }"></opx-datatable>
     * ```
     *
     * `tableConfig`是表格的配置，格式如下:
     * - `data` {@type function<promise>|array} 表格数据来源设定，支持以下格式
     *     - [dataArray] {@type [object]} 实际数据数组
     *     - fnPromise {@type function<promise>} 获取数据的函数，返回值为[object]格式的数据或Promise
     *     - [fnPromise, dataSrc, isServerSide] {@type []} 一个数组，包含异步函数，数据路径，是否服务端请求三个设定。
     *          - `[0]`: {function|array|object}，第一个元素为表格的数据，
     *            它可以是一个返回异步数据Promise的函数，或者是数据数组，或者数据对象（通过data[1]指定的路径来提取数据）。
     *          - `[1]`: {string}，如果data[0]的最终返回值是Object，那么第二个元素为从`data[0]`中获取表格实际数据的路径。
     *          - `[2]`: {boolean}，第三个元素表示是否为服务器端处理。
     * - `columns` {@type [object]} 表格列的定义。
     *   [数据格式参考DataTable](https://datatables.net/reference/option/columns)。最关键的属性是`data`和`title`
     *    扩展属性放在`_extra`里面，包括
     *    - linelimit: boolean, default is false. When work without render function
     *    - linebreak: boolean, default is true
     *    - autoFilter: boolean, default is false
     * - `order` {@type array} 表格的排序设定，例如`[[ 0, 'asc' ], [ 1, 'asc' ]]`
     *    [数据格式参考DataTable](https://datatables.net/reference/option/order)
     *
     * - `selection` {@type object} 表格的行选择设定。
     *   如果设定了`selection`，在表格的每行第一列会显示一个复选框。
     *   - `selection.valueData` {@type string|function} 必须，选定行的实际值。
     *     如果是`string`，代表字段名称，选定行的字段值将作为选定值。
     *     如果是`function`，代表数据获取函数，函数参数为该行的数据，函数返回值将作为选定值。
     *   - `selection.labelData` {@type string|function} 可选，选定行的显示值。
     *     在表格上方有下拉框显示已经选中的值，显示值可以与实际值不同。设置方式与`valueData`相同。
     *   - `selection.valueComparator` {@type function} 可选，用以比较两个值是否相等。例如valueData的格式是[{key:'foo',title:'foo'}]
     *     preselected是[{key:'foo',title:'foo updated'}]，如果只要`key`相同则认为数据相同，那么可以设定`valueComparator`为
     *     `function(a,b){return a.key===b.key;}`
     *   - `selection.preselected` {@type array|string} 可选，预先选定的值。
     *   - `selection.selectedDatatype` {@type string} 可选，选定值的数据格式。如果设置了数据格式，那么数据格式必须和预选值相匹配。
     *      如果没有设置格式，但设置了预选值，将根据预选值猜测数据格式。数据格式支持
     *      - Array: 简单数组（默认）
     *      - ObjectArray: 数组的每个元素为{value:string, label:string} 格式
     *      - String: 逗号分隔的字符串
     *      @see {@link ArrayConvertor#types}
     * - `buttons` {@type [string]} 按钮设置。支持reload, excel
     * - `tableId` {@type string} 可选，如果设置了tableId，分页、搜素等属性将保存
     * - `responsive` {@type boolean} 是否使用响应式，默认为true
     *
     * 表格初始化完成后，`tableConfig`中会添加以下方法和属性
     * - `reloadData` {@type function} 刷新表格记录的函数，无参数。它将重新加载`data`的设置刷新表格数据。
     * - `getTableData` {@type function} 获取表格的完整数据，返回一个数组，每个元素为一行的数据。
     * - `selectedItems` {@type array|string} 选中的数据，格式符合为`selection.selectedDatatype`中定义的数据格式
     * - `markItemsSelected` {@type function} 参数为[value] 控制选择表格记录
     * - `getTableApi` {@type function} 返回原始的DataTables API Instance
     *
     *  @param {opDatatable} opDatatable
     */
    function opxDatatableDirective(opDatatable) {
        return {
            restrict: 'E',
            // 20210911: DO NOT use isolated scope
            // scope: {
            //     tableConfig: '<'
            // },
            link: linkFn
        };

        function linkFn(scope, element, attrs, ctrl) {
            var tableConfigVar = attrs['tableConfig'];
            var unregister = scope.$watch(tableConfigVar, function (newVal, oldVal) {
                if (newVal) {
                    // Only init once
                    unregister();
                    initTable(newVal);
                }
            });

            function initTable(tableConfig) {
                //scope[NORMALIZED_SELECTED_ITEMS] format `[]`
                var NORMALIZED_SELECTED_ITEMS = '__selectedItemsInArray__';
                var children = element.children();
                var table = $('<table class="opx-table table table-hover"></table>');
                table.appendTo(element);
                if (tableConfig.tableId) {
                    table.attr('id', tableConfig.tableId);
                }
                var builder = opDatatable.buildTable(table, scope).fromData(tableConfig.data);
                var selectConfig = tableConfig.selection;
                var dataConverter;
                try {
                    builder.withColumn(tableConfig.columns)
                        .withButton(tableConfig.buttons)
                        .withCustomControl(children)
                        .withOrder(tableConfig.order)
                        .withOptions(tableConfig.options || {})
                        .withStateSave();
                    // .withOption('stateSave', tableConfig.stateSave);
                    if (selectConfig) {
                        dataConverter = new ArrayConvertor(selectConfig.selectedDatatype, selectConfig.preselected);
                        scope[NORMALIZED_SELECTED_ITEMS] = dataConverter.formatInput(selectConfig.preselected);
                        // console.log('selected',JSON.stringify(scope[NORMALIZED_SELECTED_ITEMS]));
                        builder.withSelection({
                            labelData: selectConfig.labelData,
                            valueData: selectConfig.valueData,
                            preselected: scope[NORMALIZED_SELECTED_ITEMS],
                            valueComparator: selectConfig.valueComparator,
                            stateFn: selectConfig.stateFn
                        });
                    }
                    if (!tableConfig.responsive) {
                        builder.withOption('responsive', false);
                    }
                } catch (err) {
                    //TODO: need prompt error to user
                    throw err;
                }
                var tableBuilder = builder.render();
                // console.log('DONE tableBuilder.render()', {builder: tableBuilder});
                tableConfig.reloadData = function () {
                    tableBuilder.reloadData();
                }
                tableConfig.reloadDataSync = function (){
                    tableBuilder.reloadDataSync();
                }
                tableConfig.getTableApi = function () {
                    return tableBuilder.getTableApi();
                }
                tableConfig.getTableData = function () {
                    return Array.from(tableBuilder.getTableData());
                }
                // console.log('tableConfig.selectedItems', tableConfig.selectedItems);
                if (selectConfig) {
                    tableConfig.markItemsSelected = function (values) {
                        return tableBuilder.markItemsSelected(values);
                    };
                    scope.$watch(NORMALIZED_SELECTED_ITEMS, function (newVal, oldVal) {
                        // console.log('watch __selectedItemsInArray__', {newVal: newVal});
                        tableConfig.selectedItems = dataConverter.parseOutput(newVal);
                    }, true);
                }
            }

            function ArrayConvertor(dataType, preselected) {
                var exportType = dataType;
                var that = this;
                this.types = {String: 'String', Array: 'Array'/*, ObjectArray: 'ObjectArray'*/};
                this.formatInput = formatInput;
                this.parseOutput = parseOutput;
                if (!exportType) {
                    if (angular.isString(preselected)) {
                        exportType = that.types.String;
                    } else if (angular.isArray(preselected)) {
                        exportType = that.types.Array;
                    } else if (angular.isUndefined(preselected)) {
                        exportType = that.types.Array;
                    }
                }
                if (!exportType) {
                    console.warn('preselected is ', preselected);
                    throw new TypeError('Cannot determine export typeL from ArrayConverter(dataType, preselected)');
                }

                /**
                 * Supported input value:
                 * - Default array: `["abc","xyz"]`
                 * - Default string: `"abc,xyz"`
                 * - Object array: `[{value: "abc", label: "ABC"}, {value: "xyz", label: "XYZ"}]`
                 * - Object array alt: `[{value: "abc"}, {value: "xyz"}]`
                 * - JSON: `"[{\"value\": \"abc\", \"label\": \"ABC\"}, {\"value\": \"xyz\", \"label\": \"XYZ\"}]"`
                 *
                 *
                 * Inner value is type of object array `[{value:*,label:string}]`
                 *
                 * @param exportValue
                 * @return []
                 */
                function formatInput(exportValue) {
                    var innerValue = [];
                    exportType = exportType || that.types.Array;
                    if (exportType === that.types.String) {
                        if (angular.isString(exportValue)) {
                            innerValue = _.map(exportValue.split(','), function (o) {
                                return o;
                            });
                        } else {
                            throw new TypeError('Export type is String but incoming value is not String');
                        }
                    } else if (exportType === that.types.Array) {
                        if (angular.isArray(exportValue)) {
                            innerValue = exportValue;
                        } else if (angular.isDefined(exportValue)) {
                            throw new TypeError('Export type is Array but incoming value is not array');
                        }
                    } else {
                        throw new TypeError('Unsupported export type ' + exportType);
                    }
                    return innerValue;
                }

                function parseOutput(innerValue) {
                    if (exportType === that.types.String) {
                        return innerValue.join(',');
                    } else if (exportType === that.types.Array) {
                        return innerValue;
                    } else {
                        throw new TypeError('Unsupported export type ' + exportType + ', available types are ' + _.values(that.types));
                    }
                }
            }
        }
    }
})();

(function(factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else {

        // Browser globals
        factory(jQuery);
    }
}(function($) {

    $.ui = $.ui || {};

    var version = $.ui.version = "1.12.1";


    /*!
     * jQuery UI Position 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     *
     * http://api.jqueryui.com/position/
     */

    //>>label: Position
    //>>group: Core
    //>>description: Positions elements relative to other elements.
    //>>docs: http://api.jqueryui.com/position/
    //>>demos: http://jqueryui.com/position/


    (function() {
        var cachedScrollbarWidth,
            max = Math.max,
            abs = Math.abs,
            rhorizontal = /left|center|right/,
            rvertical = /top|center|bottom/,
            roffset = /[\+\-]\d+(\.[\d]+)?%?/,
            rposition = /^\w+/,
            rpercent = /%$/,
            _position = $.fn.pos;

        function getOffsets(offsets, width, height) {
            return [
                parseFloat(offsets[0]) * (rpercent.test(offsets[0]) ? width / 100 : 1),
                parseFloat(offsets[1]) * (rpercent.test(offsets[1]) ? height / 100 : 1)
            ];
        }

        function parseCss(element, property) {
            return parseInt($.css(element, property), 10) || 0;
        }

        function getDimensions(elem) {
            var raw = elem[0];
            if (raw.nodeType === 9) {
                return {
                    width: elem.width(),
                    height: elem.height(),
                    offset: {
                        top: 0,
                        left: 0
                    }
                };
            }
            if ($.isWindow(raw)) {
                return {
                    width: elem.width(),
                    height: elem.height(),
                    offset: {
                        top: elem.scrollTop(),
                        left: elem.scrollLeft()
                    }
                };
            }
            if (raw.preventDefault) {
                return {
                    width: 0,
                    height: 0,
                    offset: {
                        top: raw.pageY,
                        left: raw.pageX
                    }
                };
            }
            return {
                width: elem.outerWidth(),
                height: elem.outerHeight(),
                offset: elem.offset()
            };
        }

        $.pos = {
            scrollbarWidth: function() {
                if (cachedScrollbarWidth !== undefined) {
                    return cachedScrollbarWidth;
                }
                var w1, w2,
                    div = $("<div " +
                        "style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" +
                        "<div style='height:100px;width:auto;'></div></div>"),
                    innerDiv = div.children()[0];

                $("body").append(div);
                w1 = innerDiv.offsetWidth;
                div.css("overflow", "scroll");

                w2 = innerDiv.offsetWidth;

                if (w1 === w2) {
                    w2 = div[0].clientWidth;
                }

                div.remove();

                return (cachedScrollbarWidth = w1 - w2);
            },
            getScrollInfo: function(within) {
                var overflowX = within.isWindow || within.isDocument ? "" :
                        within.element.css("overflow-x"),
                    overflowY = within.isWindow || within.isDocument ? "" :
                        within.element.css("overflow-y"),
                    hasOverflowX = overflowX === "scroll" ||
                        (overflowX === "auto" && within.width < within.element[0].scrollWidth),
                    hasOverflowY = overflowY === "scroll" ||
                        (overflowY === "auto" && within.height < within.element[0].scrollHeight);
                return {
                    width: hasOverflowY ? $.pos.scrollbarWidth() : 0,
                    height: hasOverflowX ? $.pos.scrollbarWidth() : 0
                };
            },
            getWithinInfo: function(element) {
                var withinElement = $(element || window),
                    isWindow = $.isWindow(withinElement[0]),
                    isDocument = !!withinElement[0] && withinElement[0].nodeType === 9,
                    hasOffset = !isWindow && !isDocument;
                return {
                    element: withinElement,
                    isWindow: isWindow,
                    isDocument: isDocument,
                    offset: hasOffset ? $(element).offset() : {
                        left: 0,
                        top: 0
                    },
                    scrollLeft: withinElement.scrollLeft(),
                    scrollTop: withinElement.scrollTop(),
                    width: withinElement.outerWidth(),
                    height: withinElement.outerHeight()
                };
            }
        };

        $.fn.pos = function(options) {
            if (!options || !options.of) {
                return _position.apply(this, arguments);
            }

            // Make a copy, we don't want to modify arguments
            options = $.extend({}, options);

            var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
                target = $(options.of),
                within = $.pos.getWithinInfo(options.within),
                scrollInfo = $.pos.getScrollInfo(within),
                collision = (options.collision || "flip").split(" "),
                offsets = {};

            dimensions = getDimensions(target);
            if (target[0].preventDefault) {

                // Force left top to allow flipping
                options.at = "left top";
            }
            targetWidth = dimensions.width;
            targetHeight = dimensions.height;
            targetOffset = dimensions.offset;

            // Clone to reuse original targetOffset later
            basePosition = $.extend({}, targetOffset);

            // Force my and at to have valid horizontal and vertical positions
            // if a value is missing or invalid, it will be converted to center
            $.each(["my", "at"], function() {
                var pos = (options[this] || "").split(" "),
                    horizontalOffset,
                    verticalOffset;

                if (pos.length === 1) {
                    pos = rhorizontal.test(pos[0]) ?
                        pos.concat(["center"]) :
                        rvertical.test(pos[0]) ? ["center"].concat(pos) : ["center", "center"];
                }
                pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
                pos[1] = rvertical.test(pos[1]) ? pos[1] : "center";

                // Calculate offsets
                horizontalOffset = roffset.exec(pos[0]);
                verticalOffset = roffset.exec(pos[1]);
                offsets[this] = [
                    horizontalOffset ? horizontalOffset[0] : 0,
                    verticalOffset ? verticalOffset[0] : 0
                ];

                // Reduce to just the positions without the offsets
                options[this] = [
                    rposition.exec(pos[0])[0],
                    rposition.exec(pos[1])[0]
                ];
            });

            // Normalize collision option
            if (collision.length === 1) {
                collision[1] = collision[0];
            }

            if (options.at[0] === "right") {
                basePosition.left += targetWidth;
            } else if (options.at[0] === "center") {
                basePosition.left += targetWidth / 2;
            }

            if (options.at[1] === "bottom") {
                basePosition.top += targetHeight;
            } else if (options.at[1] === "center") {
                basePosition.top += targetHeight / 2;
            }

            atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
            basePosition.left += atOffset[0];
            basePosition.top += atOffset[1];

            return this.each(function() {
                var collisionPosition, using,
                    elem = $(this),
                    elemWidth = elem.outerWidth(),
                    elemHeight = elem.outerHeight(),
                    marginLeft = parseCss(this, "marginLeft"),
                    marginTop = parseCss(this, "marginTop"),
                    collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") +
                        scrollInfo.width,
                    collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") +
                        scrollInfo.height,
                    position = $.extend({}, basePosition),
                    myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());

                if (options.my[0] === "right") {
                    position.left -= elemWidth;
                } else if (options.my[0] === "center") {
                    position.left -= elemWidth / 2;
                }

                if (options.my[1] === "bottom") {
                    position.top -= elemHeight;
                } else if (options.my[1] === "center") {
                    position.top -= elemHeight / 2;
                }

                position.left += myOffset[0];
                position.top += myOffset[1];

                collisionPosition = {
                    marginLeft: marginLeft,
                    marginTop: marginTop
                };

                $.each(["left", "top"], function(i, dir) {
                    if ($.ui.pos[collision[i]]) {
                        $.ui.pos[collision[i]][dir](position, {
                            targetWidth: targetWidth,
                            targetHeight: targetHeight,
                            elemWidth: elemWidth,
                            elemHeight: elemHeight,
                            collisionPosition: collisionPosition,
                            collisionWidth: collisionWidth,
                            collisionHeight: collisionHeight,
                            offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
                            my: options.my,
                            at: options.at,
                            within: within,
                            elem: elem
                        });
                    }
                });

                if (options.using) {

                    // Adds feedback as second argument to using callback, if present
                    using = function(props) {
                        var left = targetOffset.left - position.left,
                            right = left + targetWidth - elemWidth,
                            top = targetOffset.top - position.top,
                            bottom = top + targetHeight - elemHeight,
                            feedback = {
                                target: {
                                    element: target,
                                    left: targetOffset.left,
                                    top: targetOffset.top,
                                    width: targetWidth,
                                    height: targetHeight
                                },
                                element: {
                                    element: elem,
                                    left: position.left,
                                    top: position.top,
                                    width: elemWidth,
                                    height: elemHeight
                                },
                                horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                                vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                            };
                        if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
                            feedback.horizontal = "center";
                        }
                        if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
                            feedback.vertical = "middle";
                        }
                        if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
                            feedback.important = "horizontal";
                        } else {
                            feedback.important = "vertical";
                        }
                        options.using.call(this, props, feedback);
                    };
                }

                elem.offset($.extend(position, {
                    using: using
                }));
            });
        };

        $.ui.pos = {
            _trigger: function(position, data, name, triggered) {
                if (data.elem) {
                    data.elem.trigger({
                        'type': name,
                        'position': position,
                        'positionData': data,
                        'triggered': triggered
                    });
                }
            },
            fit: {
                left: function(position, data) {
                    $.ui.pos._trigger(position, data, 'posCollide', 'fitLeft');
                    var within = data.within,
                        withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                        outerWidth = within.width,
                        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                        overLeft = withinOffset - collisionPosLeft,
                        overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                        newOverRight;

                    // Element is wider than within
                    if (data.collisionWidth > outerWidth) {

                        // Element is initially over the left side of within
                        if (overLeft > 0 && overRight <= 0) {
                            newOverRight = position.left + overLeft + data.collisionWidth - outerWidth -
                                withinOffset;
                            position.left += overLeft - newOverRight;

                            // Element is initially over right side of within
                        } else if (overRight > 0 && overLeft <= 0) {
                            position.left = withinOffset;

                            // Element is initially over both left and right sides of within
                        } else {
                            if (overLeft > overRight) {
                                position.left = withinOffset + outerWidth - data.collisionWidth;
                            } else {
                                position.left = withinOffset;
                            }
                        }

                        // Too far left -> align with left edge
                    } else if (overLeft > 0) {
                        position.left += overLeft;

                        // Too far right -> align with right edge
                    } else if (overRight > 0) {
                        position.left -= overRight;

                        // Adjust based on position and margin
                    } else {
                        position.left = max(position.left - collisionPosLeft, position.left);
                    }
                    $.ui.pos._trigger(position, data, 'posCollided', 'fitLeft');
                },
                top: function(position, data) {
                    $.ui.pos._trigger(position, data, 'posCollide', 'fitTop');
                    var within = data.within,
                        withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                        outerHeight = data.within.height,
                        collisionPosTop = position.top - data.collisionPosition.marginTop,
                        overTop = withinOffset - collisionPosTop,
                        overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                        newOverBottom;

                    // Element is taller than within
                    if (data.collisionHeight > outerHeight) {

                        // Element is initially over the top of within
                        if (overTop > 0 && overBottom <= 0) {
                            newOverBottom = position.top + overTop + data.collisionHeight - outerHeight -
                                withinOffset;
                            position.top += overTop - newOverBottom;

                            // Element is initially over bottom of within
                        } else if (overBottom > 0 && overTop <= 0) {
                            position.top = withinOffset;

                            // Element is initially over both top and bottom of within
                        } else {
                            if (overTop > overBottom) {
                                position.top = withinOffset + outerHeight - data.collisionHeight;
                            } else {
                                position.top = withinOffset;
                            }
                        }

                        // Too far up -> align with top
                    } else if (overTop > 0) {
                        position.top += overTop;

                        // Too far down -> align with bottom edge
                    } else if (overBottom > 0) {
                        position.top -= overBottom;

                        // Adjust based on position and margin
                    } else {
                        position.top = max(position.top - collisionPosTop, position.top);
                    }
                    $.ui.pos._trigger(position, data, 'posCollided', 'fitTop');
                }
            },
            flip: {
                left: function(position, data) {
                    $.ui.pos._trigger(position, data, 'posCollide', 'flipLeft');
                    var within = data.within,
                        withinOffset = within.offset.left + within.scrollLeft,
                        outerWidth = within.width,
                        offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                        overLeft = collisionPosLeft - offsetLeft,
                        overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                        myOffset = data.my[0] === "left" ?
                            -data.elemWidth :
                            data.my[0] === "right" ?
                                data.elemWidth :
                                0,
                        atOffset = data.at[0] === "left" ?
                            data.targetWidth :
                            data.at[0] === "right" ?
                                -data.targetWidth :
                                0,
                        offset = -2 * data.offset[0],
                        newOverRight,
                        newOverLeft;

                    if (overLeft < 0) {
                        newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth -
                            outerWidth - withinOffset;
                        if (newOverRight < 0 || newOverRight < abs(overLeft)) {
                            position.left += myOffset + atOffset + offset;
                        }
                    } else if (overRight > 0) {
                        newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset +
                            atOffset + offset - offsetLeft;
                        if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
                            position.left += myOffset + atOffset + offset;
                        }
                    }
                    $.ui.pos._trigger(position, data, 'posCollided', 'flipLeft');
                },
                top: function(position, data) {
                    $.ui.pos._trigger(position, data, 'posCollide', 'flipTop');
                    var within = data.within,
                        withinOffset = within.offset.top + within.scrollTop,
                        outerHeight = within.height,
                        offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                        collisionPosTop = position.top - data.collisionPosition.marginTop,
                        overTop = collisionPosTop - offsetTop,
                        overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                        top = data.my[1] === "top",
                        myOffset = top ?
                            -data.elemHeight :
                            data.my[1] === "bottom" ?
                                data.elemHeight :
                                0,
                        atOffset = data.at[1] === "top" ?
                            data.targetHeight :
                            data.at[1] === "bottom" ?
                                -data.targetHeight :
                                0,
                        offset = -2 * data.offset[1],
                        newOverTop,
                        newOverBottom;
                    if (overTop < 0) {
                        newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight -
                            outerHeight - withinOffset;
                        if (newOverBottom < 0 || newOverBottom < abs(overTop)) {
                            position.top += myOffset + atOffset + offset;
                        }
                    } else if (overBottom > 0) {
                        newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset +
                            offset - offsetTop;
                        if (newOverTop > 0 || abs(newOverTop) < overBottom) {
                            position.top += myOffset + atOffset + offset;
                        }
                    }
                    $.ui.pos._trigger(position, data, 'posCollided', 'flipTop');
                }
            },
            flipfit: {
                left: function() {
                    $.ui.pos.flip.left.apply(this, arguments);
                    $.ui.pos.fit.left.apply(this, arguments);
                },
                top: function() {
                    $.ui.pos.flip.top.apply(this, arguments);
                    $.ui.pos.fit.top.apply(this, arguments);
                }
            }
        };
        // fraction support test
        (function() {
            var testElement, testElementParent, testElementStyle, offsetLeft, i,
                body = document.getElementsByTagName("body")[0],
                div = document.createElement("div");

            //Create a "fake body" for testing based on method used in jQuery.support
            testElement = document.createElement(body ? "div" : "body");
            testElementStyle = {
                visibility: "hidden",
                width: 0,
                height: 0,
                border: 0,
                margin: 0,
                background: "none"
            };
            if (body) {
                $.extend(testElementStyle, {
                    position: "absolute",
                    left: "-1000px",
                    top: "-1000px"
                });
            }
            for (i in testElementStyle) {
                testElement.style[i] = testElementStyle[i];
            }
            testElement.appendChild(div);
            testElementParent = body || document.documentElement;
            testElementParent.insertBefore(testElement, testElementParent.firstChild);

            div.style.cssText = "position: absolute; left: 10.7432222px;";

            offsetLeft = $(div).offset().left;
            $.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

            testElement.innerHTML = "";
            testElementParent.removeChild(testElement);
        })();

    })();

    var position = $.ui.position;




}));
/**
 *
 * 检测浏览器版本
 *
 *
 * @author Joker Liu (qdjoker@126.com), created on 8/6/2020
 */
(function () {
    'use strict';
    angular.module('oplus.commons').directive('opBrowserSupport', ['messageService', opBrowserSupport]);

    function opBrowserSupport(messageService) {
        return {
            restrict: 'EA',
            scope: {},
            link: function (scope, element, attrs, controller) {

                var allSupportBrowser = {
                    Chrome: {latestVersion: '52'},
                    Firefox: {latestVersion: '50'},
                    EDGE: {latestVersion: '0'},
                    IE: {latestVersion: '11'}
                };

                if (window.$oplus.appConfig.supportBrowser) {
                    allSupportBrowser = _.merge(allSupportBrowser, window.$oplus.appConfig.supportBrowser);
                }

                var currentBrowserInfo = getExploreInfo();
                var supportBrowser = allSupportBrowser[currentBrowserInfo.type];
                if (!(supportBrowser && compareVersion(currentBrowserInfo.version, supportBrowser.latestVersion))) {
                    messageService.confirm($translate.instant('common.messages.compatibility_problems'), $translate.instant('common.messages.recommend') + Object.keys(allSupportBrowser).map(function (value) {
                        var version = allSupportBrowser[value].latestVersion;
                        return value + (version === '0' ? '' : (' ' + version + '+'));
                    }).join(' , '));
                }

                /**
                 * 获取浏览器累心和版本号
                 *  {
                 *      type: 'IE',//IE|EDGE|Firefox|Opera|Chrome|Safari
                 *      version: '84.88.44'
                 *  }
                 *
                 *  所有字段解析自 window.navigator.userAgent
                 *
                 * @returns {{type: string, version: string}}
                 */
                function getExploreInfo() {
                    var userAgent = navigator.userAgent.toLowerCase();
                    var version;
                    if (version = userAgent.match(/rv:([\d.]+)\) like gecko/)) {
                        return {type: 'IE', version: version[1]};
                    } else if (version = userAgent.match(/msie ([\d\.]+)/)) {
                        return {type: 'IE', version: version[1]};
                    } else if (version = userAgent.match(/edge\/([\d\.]+)/)) {
                        return {type: 'EDGE', version: version[1]};
                    } else if (version = userAgent.match(/firefox\/([\d\.]+)/)) {
                        return {type: 'Firefox', version: version[1]};
                    } else if (version = userAgent.match(/(?:opera|opr).([\d\.]+)/)) {
                        return {type: 'Opera', version: version[1]};
                    } else if (version = userAgent.match(/chrome\/([\d\.]+)/)) {
                        return {type: 'Chrome', version: version[1]};
                    } else if (version = userAgent.match(/version\/([\d\.]+).*safari/)) {
                        return {type: 'Safari', version: version[1]};
                    } else {
                        return {type: 'Unknown', version: 'Unknown'};
                    }
                }

                function compareVersion(current, require) {
                    var currentArr = current.split('.');
                    var requireArr = require.split('.');

                    var length = Math.min(currentArr.length, requireArr.length);

                    var result = true;
                    for (var i = 0; i < length; i++) {
                        if (parseInt(currentArr[i]) < parseInt(requireArr[i])) {
                            result = false;
                            break;
                        }
                    }

                    return result;
                }
            }
        }
    }
})();

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Define search commands. Depends on find-and-replace-dialog.js

(function (mod) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object")
        // CommonJS
        mod(require("codemirror"), require("codemirror-find-and-replace-dialog"));else if (typeof define == "function" && define.amd)
        // AMD
        define(["codemirror", "codemirror-find-and-replace-dialog"], mod);
    // Plain browser env
    else mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";

    var replaceDialog = "\n      <div class=\"CodeMirror-find-and-replace-dialog--replace-container\">\n        <div class=\"CodeMirror-find-and-replace-dialog--row find\">\n          <div class=\"CodeMirror-find-and-replace-dialog--row\">\n            <input type=\"text\" autocomplete=\"off\" class=\"CodeMirror-find-and-replace-dialog--search-field\" placeholder=\"Find\" />\n            <span class=\"CodeMirror-find-and-replace-dialog--search-count\"></span>\n          </div>\n          <div class=\"CodeMirror-find-and-replace-dialog--buttons\">\n            <button class=\"CodeMirror-find-and-replace-dialog--find-previous\" title=\"Find Previous\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"9\" height=\"5\">\n                <path d=\"M3.93.223a.84.84 0 011.14 0l3.697 3.492c.31.294.31.77 0 1.065a.832.832 0 01-1.127 0L4.5 1.814 1.36 4.78a.832.832 0 01-1.127 0 .726.726 0 010-1.065L3.931.223z\" fill=\"#ACAEB1\" fill-rule=\"evenodd\"/>\n              </svg>\n            </button>\n            <button class=\"CodeMirror-find-and-replace-dialog--find-next\" title=\"Find Next\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"9\" height=\"5\">\n                <path d=\"M3.93 4.777a.84.84 0 001.14 0l3.697-3.492a.726.726 0 000-1.065.832.832 0 00-1.127 0L4.5 3.186 1.36.22a.832.832 0 00-1.127 0 .726.726 0 000 1.065l3.698 3.492z\" fill=\"#ACAEB1\" fill-rule=\"evenodd\"/>\n              </svg>\n            </button>\n            <button class=\"CodeMirror-find-and-replace-dialog--close\" title=\"Close\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\">\n                <path d=\"M.167.167a.572.572 0 01.808 0L4 3.192 7.025.167a.571.571 0 01.728-.066l.08.066a.572.572 0 010 .808L4.808 4l3.025 3.025c.198.198.22.506.066.728l-.066.08a.572.572 0 01-.808 0L4 4.808.975 7.833a.571.571 0 01-.728.066l-.08-.066a.572.572 0 010-.808L3.192 4 .167.975A.571.571 0 01.101.247z\" fill=\"#ACAEB1\" fill-rule=\"nonzero\"/>\n              </svg>\n            </button>\n          </div>\n        </div>\n\n        <div class=\"CodeMirror-find-and-replace-dialog--row replace\">\n          <div class=\"CodeMirror-find-and-replace-dialog--row\">\n            <input type=\"text\" class=\"CodeMirror-find-and-replace-dialog--search-field\" autocomplete=\"off\" placeholder=\"Replace\" />\n          </div>\n          <div class=\"CodeMirror-find-and-replace-dialog--buttons\">\n            <button class=\"CodeMirror-find-and-replace-dialog--replace\" title=\"Replace\">\n              <svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M3.221 3.739L5.482 6.008L7.7 3.784L7 3.084L5.988 4.091L5.98 2.491C5.97909 2.35567 6.03068 2.22525 6.12392 2.12716C6.21716 2.02908 6.3448 1.97095 6.48 1.965H8V1H6.48C6.28496 1.00026 6.09189 1.03902 5.91186 1.11405C5.73183 1.18908 5.56838 1.29892 5.43088 1.43725C5.29338 1.57558 5.18455 1.73969 5.11061 1.92018C5.03667 2.10066 4.99908 2.29396 5 2.489V4.1L3.927 3.033L3.221 3.739ZM9.89014 5.53277H9.90141C10.0836 5.84426 10.3521 6 10.707 6C11.0995 6 11.4131 5.83236 11.6479 5.49708C11.8826 5.1618 12 4.71728 12 4.16353C12 3.65304 11.8995 3.2507 11.6986 2.95652C11.4977 2.66234 11.2113 2.51525 10.8394 2.51525C10.4338 2.51525 10.1211 2.70885 9.90141 3.09604H9.89014V1H9V5.91888H9.89014V5.53277ZM9.87606 4.47177V4.13108C9.87606 3.88449 9.93427 3.6844 10.0507 3.53082C10.169 3.37724 10.3174 3.30045 10.4958 3.30045C10.6854 3.30045 10.831 3.37833 10.9324 3.53407C11.0357 3.68765 11.0873 3.9018 11.0873 4.17651C11.0873 4.50746 11.031 4.76379 10.9183 4.94549C10.8075 5.12503 10.6507 5.2148 10.4479 5.2148C10.2808 5.2148 10.1437 5.14449 10.0366 5.00389C9.92958 4.86329 9.87606 4.68592 9.87606 4.47177ZM9 12.7691C8.74433 12.923 8.37515 13 7.89247 13C7.32855 13 6.87216 12.8225 6.5233 12.4674C6.17443 12.1124 6 11.6543 6 11.0931C6 10.4451 6.18638 9.93484 6.55914 9.5624C6.93429 9.18747 7.43489 9.00001 8.06093 9.00001C8.49343 9.00001 8.80645 9.0596 9 9.17878V10.1769C8.76344 9.99319 8.4994 9.90132 8.20789 9.90132C7.88292 9.90132 7.62485 10.0006 7.43369 10.1993C7.24492 10.3954 7.15054 10.6673 7.15054 11.0149C7.15054 11.3526 7.24134 11.6183 7.42294 11.8119C7.60454 12.0031 7.85424 12.0987 8.17204 12.0987C8.454 12.0987 8.72999 12.0068 9 11.8231V12.7691ZM4 7L3 8V14L4 15H11L12 14V8L11 7H4ZM4 8H5H10H11V9V13V14H10H5H4V13V9V8Z\" fill=\"#C5C5C5\"/>\n              </svg>\n            </button>\n            <button class=\"CodeMirror-find-and-replace-dialog--replace-all\" title=\"Replace All\">\n              <svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.6009 2.67683C11.7474 2.36708 11.9559 2.2122 12.2263 2.2122C12.4742 2.2122 12.6651 2.32987 12.7991 2.56522C12.933 2.80056 13 3.12243 13 3.53082C13 3.97383 12.9218 4.32944 12.7653 4.59766C12.6088 4.86589 12.3997 5 12.138 5C11.9014 5 11.7224 4.87541 11.6009 4.62622H11.5934V4.93511H11V1H11.5934V2.67683H11.6009ZM11.584 3.77742C11.584 3.94873 11.6197 4.09063 11.6911 4.20311C11.7624 4.3156 11.8538 4.37184 11.9653 4.37184C12.1005 4.37184 12.205 4.30002 12.2789 4.15639C12.354 4.01103 12.3915 3.80597 12.3915 3.54121C12.3915 3.32144 12.3571 3.15012 12.2883 3.02726C12.2207 2.90266 12.1236 2.84036 11.9972 2.84036C11.8782 2.84036 11.7793 2.9018 11.7005 3.02466C11.6228 3.14752 11.584 3.30759 11.584 3.50487V3.77742ZM4.11969 7.695L2 5.56781L2.66188 4.90594L3.66781 5.90625V4.39594C3.66695 4.21309 3.70219 4.03187 3.7715 3.86266C3.84082 3.69346 3.94286 3.53961 4.07176 3.40992C4.20066 3.28023 4.3539 3.17727 4.52268 3.10692C4.69146 3.03658 4.87246 3.00024 5.05531 3H7.39906V3.90469H5.05531C4.92856 3.91026 4.8089 3.96476 4.72149 4.05672C4.63408 4.14868 4.58571 4.27094 4.58656 4.39781L4.59406 5.89781L5.54281 4.95375L6.19906 5.61L4.11969 7.695ZM9.3556 4.93017H10V3.22067C10 2.40689 9.68534 2 9.05603 2C8.92098 2 8.77083 2.02421 8.6056 2.07263C8.44181 2.12104 8.3125 2.17691 8.21767 2.24022V2.90503C8.45474 2.70205 8.70474 2.60056 8.96767 2.60056C9.22917 2.60056 9.35991 2.75698 9.35991 3.06983L8.76078 3.17318C8.25359 3.25885 8 3.57914 8 4.13408C8 4.39665 8.06106 4.60708 8.18319 4.76536C8.30675 4.92179 8.47557 5 8.68966 5C8.97989 5 9.19899 4.83985 9.34698 4.51955H9.3556V4.93017ZM9.35991 3.57542V3.76816C9.35991 3.9432 9.31968 4.08845 9.23922 4.20391C9.15876 4.3175 9.0546 4.3743 8.92672 4.3743C8.83477 4.3743 8.76149 4.34264 8.7069 4.27933C8.65374 4.21415 8.62716 4.13128 8.62716 4.03073C8.62716 3.80912 8.73779 3.6797 8.95905 3.64246L9.35991 3.57542ZM7 12.9302H6.3556V12.5196H6.34698C6.19899 12.8399 5.97989 13 5.68966 13C5.47557 13 5.30675 12.9218 5.18319 12.7654C5.06106 12.6071 5 12.3966 5 12.1341C5 11.5791 5.25359 11.2588 5.76078 11.1732L6.35991 11.0698C6.35991 10.757 6.22917 10.6006 5.96767 10.6006C5.70474 10.6006 5.45474 10.702 5.21767 10.905V10.2402C5.3125 10.1769 5.44181 10.121 5.6056 10.0726C5.77083 10.0242 5.92098 10 6.05603 10C6.68534 10 7 10.4069 7 11.2207V12.9302ZM6.35991 11.7682V11.5754L5.95905 11.6425C5.73779 11.6797 5.62716 11.8091 5.62716 12.0307C5.62716 12.1313 5.65374 12.2142 5.7069 12.2793C5.76149 12.3426 5.83477 12.3743 5.92672 12.3743C6.0546 12.3743 6.15876 12.3175 6.23922 12.2039C6.31968 12.0885 6.35991 11.9432 6.35991 11.7682ZM9.26165 13C9.58343 13 9.82955 12.9423 10 12.8268V12.1173C9.81999 12.2551 9.636 12.324 9.44803 12.324C9.23616 12.324 9.06969 12.2523 8.94863 12.1089C8.82756 11.9637 8.76702 11.7644 8.76702 11.5112C8.76702 11.2505 8.82995 11.0466 8.95579 10.8994C9.08323 10.7505 9.25528 10.676 9.47192 10.676C9.66627 10.676 9.84229 10.7449 10 10.8827V10.1341C9.87097 10.0447 9.66229 10 9.37395 10C8.95659 10 8.62286 10.1406 8.37276 10.4218C8.12425 10.7011 8 11.0838 8 11.5698C8 11.9907 8.11629 12.3343 8.34887 12.6006C8.58144 12.8669 8.8857 13 9.26165 13ZM2 9L3 8H12L13 9V14L12 15H3L2 14V9ZM3 9V14H12V9H3ZM6 7L7 6H14L15 7V12L14 13V12V7H7H6Z\" fill=\"#C5C5C5\"/>\n              </svg>\n            </button>\n          </div>\n        </div>\n      <div>\n    ";

    var findDialog = "\n      <div class=\"CodeMirror-find-and-replace-dialog--row find\">\n        <input type=\"text\" class=\"CodeMirror-find-and-replace-dialog--search-field\" autocomplete=\"off\" placeholder=\"Find\" />\n        <span class=\"CodeMirror-find-and-replace-dialog--search-count\"></span>\n      </div>\n      <div class=\"CodeMirror-find-and-replace-dialog--buttons\">\n        <button class=\"CodeMirror-find-and-replace-dialog--find-previous\" title=\"Find Previous\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"9\" height=\"5\">\n            <path d=\"M3.93.223a.84.84 0 011.14 0l3.697 3.492c.31.294.31.77 0 1.065a.832.832 0 01-1.127 0L4.5 1.814 1.36 4.78a.832.832 0 01-1.127 0 .726.726 0 010-1.065L3.931.223z\" fill=\"#ACAEB1\" fill-rule=\"evenodd\"/>\n          </svg>\n        </button>\n        <button class=\"CodeMirror-find-and-replace-dialog--find-next\" title=\"Find Next\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"9\" height=\"5\">\n            <path d=\"M3.93 4.777a.84.84 0 001.14 0l3.697-3.492a.726.726 0 000-1.065.832.832 0 00-1.127 0L4.5 3.186 1.36.22a.832.832 0 00-1.127 0 .726.726 0 000 1.065l3.698 3.492z\" fill=\"#ACAEB1\" fill-rule=\"evenodd\"/>\n          </svg>\n        </button>\n        <button class=\"CodeMirror-find-and-replace-dialog--close\" title=\"Close\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\">\n            <path d=\"M.167.167a.572.572 0 01.808 0L4 3.192 7.025.167a.571.571 0 01.728-.066l.08.066a.572.572 0 010 .808L4.808 4l3.025 3.025c.198.198.22.506.066.728l-.066.08a.572.572 0 01-.808 0L4 4.808.975 7.833a.571.571 0 01-.728.066l-.08-.066a.572.572 0 010-.808L3.192 4 .167.975A.571.571 0 01.101.247z\" fill=\"#ACAEB1\" fill-rule=\"nonzero\"/>\n          </svg>\n        </button>\n      </div>\n    ";

    var numMatches = 0;
    var searchOverlay = function searchOverlay(query, caseInsensitive) {
        if (typeof query == "string") query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");else if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

        return {
            token: function token(stream) {
                query.lastIndex = stream.pos;
                var match = query.exec(stream.string);
                if (match && match.index == stream.pos) {
                    stream.pos += match[0].length || 1;
                    return "searching";
                } else if (match) {
                    stream.pos = match.index;
                } else {
                    stream.skipToEnd();
                }
            }
        };
    };

    function SearchState() {
        this.posFrom = this.posTo = this.lastQuery = this.query = null;
        this.overlay = null;
    }

    var getSearchState = function getSearchState(cm) {
        return cm.state.search || (cm.state.search = new SearchState());
    };

    var queryCaseInsensitive = function queryCaseInsensitive(query) {
        return typeof query == "string" && query == query.toLowerCase();
    };

    var getSearchCursor = function getSearchCursor(cm, query, pos) {
        // Heuristic: if the query string is all lowercase, do a case insensitive search.
        return cm.getSearchCursor(parseQuery(query), pos, queryCaseInsensitive(query));
    };

    var parseString = function parseString(string) {
        return string.replace(/\\(.)/g, function (_, ch) {
            if (ch == "n") return "\n";
            if (ch == "r") return "\r";
            return ch;
        });
    };

    var parseQuery = function parseQuery(query) {
        if (query.exec) {
            return query;
        }
        var isRE = query.indexOf("/") === 0 && query.lastIndexOf("/") > 0;
        if (!!isRE) {
            try {
                var matches = query.match(/^\/(.*)\/([a-z]*)$/);
                query = new RegExp(matches[1], matches[2].indexOf("i") == -1 ? "" : "i");
            } catch (e) {} // Not a regular expression after all, do a string search
        } else {
            query = parseString(query);
        }
        if (typeof query == "string" ? query == "" : query.test("")) query = /x^/;
        return query;
    };

    /* Old */
    // let startSearch = (cm, state, query) => {
    //   if (!query || query === "") return;
    //   state.queryText = query;
    //   state.query = parseQuery(query);
    //   cm.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
    //   state.overlay = searchOverlay(
    //     state.query,
    //     queryCaseInsensitive(state.query)
    //   );
    //   cm.addOverlay(state.overlay);
    //   if (cm.showMatchesOnScrollbar) {
    //     if (state.annotate) {
    //       state.annotate.clear();
    //       state.annotate = null;
    //     }
    //     state.annotate = cm.showMatchesOnScrollbar(
    //       state.query,
    //       queryCaseInsensitive(state.query)
    //     );
    //   }
    // };

    /* New */
    var startSearch = function startSearch(cm, state, query) {
        if (!query || query === "") return;
        state.queryText = query;
        state.query = parseQuery(query);
        // cm.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
        cm.removeOverlay(state.overlay, true);
        state.overlay = searchOverlay(state.query,
            // queryCaseInsensitive(state.query)
            true);
        cm.addOverlay(state.overlay);
        if (cm.showMatchesOnScrollbar) {
            if (state.annotate) {
                state.annotate.clear();
                state.annotate = null;
            }
            state.annotate = cm.showMatchesOnScrollbar(state.query,
                // queryCaseInsensitive(state.query)
                true);
        }
    };

    var doSearch = function doSearch(cm, query, reverse, moveToNext) {
        var hiding = null;
        var state = getSearchState(cm);
        if (query != state.queryText) {
            startSearch(cm, state, query);
            state.posFrom = state.posTo = cm.getCursor();
        }
        if (moveToNext || moveToNext === undefined) {
            findNext(cm, reverse || false);
        }
        updateCount(cm);
    };

    var clearSearch = function clearSearch(cm) {
        cm.operation(function () {
            var state = getSearchState(cm);
            state.lastQuery = state.query;
            if (!state.query) return;
            state.query = state.queryText = null;
            cm.removeOverlay(state.overlay);
            if (state.annotate) {
                state.annotate.clear();
                state.annotate = null;
            }
        });
    };

    var findNext = function findNext(cm, reverse, callback) {
        cm.operation(function () {
            var state = getSearchState(cm);
            var cursor = getSearchCursor(cm, state.query, reverse ? state.posFrom : state.posTo);
            if (!cursor.find(reverse)) {
                cursor = getSearchCursor(cm, state.query, reverse ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
                if (!cursor.find(reverse)) return;
            }
            cm.setSelection(cursor.from(), cursor.to());
            cm.scrollIntoView({
                from: cursor.from(),
                to: cursor.to()
            }, 20);
            state.posFrom = cursor.from();
            state.posTo = cursor.to();
            if (callback) callback(cursor.from(), cursor.to());
        });
    };

    var replaceNext = function replaceNext(cm, query, text) {
        var cursor = getSearchCursor(cm, query, cm.getCursor("from"));
        var start = cursor.from();
        var match = cursor.findNext();
        if (!match) {
            cursor = getSearchCursor(cm, query);
            match = cursor.findNext();
            if (!match || start && cursor.from().line === start.line && cursor.from().ch === start.ch) return;
        }
        cm.setSelection(cursor.from(), cursor.to());
        cm.scrollIntoView({
            from: cursor.from(),
            to: cursor.to()
        });
        cursor.replace(typeof query === "string" ? text : text.replace(/\$(\d)/g, function (_, i) {
            return match[i];
        }));
    };

    var replaceAll = function replaceAll(cm, query, text) {
        cm.operation(function () {
            for (var cursor = getSearchCursor(cm, query); cursor.findNext();) {
                if (typeof query != "string") {
                    var match = cm.getRange(cursor.from(), cursor.to()).match(query);
                    cursor.replace(text.replace(/\$(\d)/g, function (_, i) {
                        return match[i];
                    }));
                } else cursor.replace(text);
            }
        });
    };

    var closeSearchCallback = function closeSearchCallback(cm, state) {
        if (state.annotate) {
            state.annotate.clear();
            state.annotate = null;
        }
        clearSearch(cm);
    };

    var getOnReadOnlyCallback = function getOnReadOnlyCallback(callback) {
        var closeFindDialogOnReadOnly = function closeFindDialogOnReadOnly(cm, opt) {
            if (opt === "readOnly" && !!cm.getOption("readOnly")) {
                callback();
                cm.off("optionChange", closeFindDialogOnReadOnly);
            }
        };
        return closeFindDialogOnReadOnly;
    };

    var updateCount = function updateCount(cm) {
        var state = getSearchState(cm);
        var value = cm.getDoc().getValue();
        var globalQuery = void 0;
        var queryText = state.queryText;

        if (!queryText || queryText === "") {
            resetCount(cm);
            return;
        }

        while (queryText.charAt(queryText.length - 1) === "\\") {
            queryText = queryText.substring(0, queryText.lastIndexOf("\\"));
        }

        if (typeof state.query === "string") {
            globalQuery = new RegExp(queryText, "ig");
        } else {
            globalQuery = new RegExp(state.query.source, state.query.flags + "g");
        }

        var matches = value.match(globalQuery);
        var count = matches ? matches.length : 0;

        var countText = count === 1 ? "1 match found." : count + " matches found.";
        cm.getWrapperElement().parentNode.querySelector(".CodeMirror-find-and-replace-dialog--search-count").innerHTML = countText;
        cm.getWrapperElement().parentNode.querySelector(".CodeMirror-find-and-replace-dialog--find-previous").disabled = count <= 0;
        cm.getWrapperElement().parentNode.querySelector(".CodeMirror-find-and-replace-dialog--find-next").disabled = count <= 0;
    };

    var resetCount = function resetCount(cm) {
        cm.getWrapperElement().parentNode.querySelector(".CodeMirror-find-and-replace-dialog--search-count").innerHTML = "";
        cm.getWrapperElement().parentNode.querySelector(".CodeMirror-find-and-replace-dialog--find-next").disabled = true;
        cm.getWrapperElement().parentNode.querySelector(".CodeMirror-find-and-replace-dialog--find-previous").disabled = true;
    };

    var getFindBehaviour = function getFindBehaviour(cm, defaultText, callback) {
        if (!defaultText) {
            defaultText = "";
        }
        var behaviour = {
            value: defaultText,
            focus: true,
            selectValueOnOpen: true,
            closeOnEnter: false,
            closeOnBlur: false,
            callback: function callback(inputs, e) {
                var query = inputs[0].value;
                if (!query) return;
                doSearch(cm, query, !!e.shiftKey);
            },
            onInput: function onInput(inputs, e) {
                var query = inputs[0].value;
                if (!query) {
                    resetCount(cm);
                    clearSearch(cm);
                    return;
                }
                doSearch(cm, query, !!e.shiftKey, false);
            }
        };
        if (!!callback) {
            behaviour.callback = callback;
        }
        return behaviour;
    };

    var getFindPrevBtnBehaviour = function getFindPrevBtnBehaviour(cm) {
        return {
            callback: function callback(inputs) {
                var query = inputs[0].value;
                if (!query) return;
                doSearch(cm, query, true);
            }
        };
    };

    var getFindNextBtnBehaviour = function getFindNextBtnBehaviour(cm) {
        return {
            callback: function callback(inputs) {
                var query = inputs[0].value;
                if (!query) return;
                doSearch(cm, query, false);
            }
        };
    };

    var closeBtnBehaviour = {
        callback: null
    };

    CodeMirror.commands.find = function (cm) {
        // if (cm.getOption("readOnly")) return;
        clearSearch(cm);
        var state = getSearchState(cm);
        var query = cm.getSelection() || getSearchState(cm).lastQuery;
        var closeDialog = cm.openFindAndReplaceDialog(findDialog, {
            shrinkEditor: true,
            inputBehaviour: [getFindBehaviour(cm, query)],
            buttonBehaviour: [getFindPrevBtnBehaviour(cm), getFindNextBtnBehaviour(cm), closeBtnBehaviour],
            onClose: function onClose() {
                closeSearchCallback(cm, state);
            }
        });

        cm.on("optionChange", getOnReadOnlyCallback(closeDialog));
        startSearch(cm, state, query);
        updateCount(cm);
    };

    CodeMirror.commands.replace = function (cm, all) {
        if (cm.getOption("readOnly")) return;
        clearSearch(cm);

        var replaceNextCallback = function replaceNextCallback(inputs) {
            var query = parseQuery(inputs[0].value);
            var text = parseString(inputs[1].value);
            if (!query) return;
            replaceNext(cm, query, text);
            doSearch(cm, query);
        };

        var state = getSearchState(cm);
        var query = cm.getSelection() || state.lastQuery;
        var closeDialog = cm.openFindAndReplaceDialog(replaceDialog, {
            shrinkEditor: true,
            inputBehaviour: [getFindBehaviour(cm, query, function (inputs) {
                inputs[1].focus();
                inputs[1].select();
            }), {
                closeOnEnter: false,
                closeOnBlur: false,
                callback: replaceNextCallback
            }],
            buttonBehaviour: [getFindPrevBtnBehaviour(cm), getFindNextBtnBehaviour(cm), closeBtnBehaviour, {
                callback: replaceNextCallback
            }, {
                callback: function callback(inputs) {
                    // Replace all
                    var query = parseQuery(inputs[0].value);
                    var text = parseString(inputs[1].value);
                    if (!query) return;
                    replaceAll(cm, query, text);
                }
            }],
            onClose: function onClose() {
                closeSearchCallback(cm, state);
            }
        });

        cm.on("optionChange", getOnReadOnlyCallback(closeDialog));
        startSearch(cm, state, query);
        updateCount(cm);
    };
});
"use strict";

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
// Open search dialogs on top of an editor. Relies on dialog.css.

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (mod) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
        mod(require("codemirror"));else if (typeof define == "function" && define.amd) // AMD
        define(["codemirror"], mod); // Plain browser env
    else mod(CodeMirror);
})(function (CodeMirror) {
    var createPanel = function createPanel(cm, template, bottom) {
        var el = document.createElement("div");
        el.className = "CodeMirror-find-and-replace-dialog";

        if (typeof template == "string") {
            el.innerHTML = template;
        } else {
            // Assuming it's a detached DOM element.
            el.appendChild(template);
        }

        var panel = cm.addPanel(el, {
            position: bottom ? "bottom" : "top"
        });
        return panel;
    };

    var closePanel = function closePanel(cm) {
        var state = cm.state.findAndReplaceDialog;

        if (!state || !state.current) {
            return;
        }

        state.current.panel.clear();
        if (state.current.onClose) state.current.onClose(state.current.panel.node);
        delete state.current;
        cm.focus();
    };

    CodeMirror.defineExtension("openFindAndReplaceDialog", function (template, options) {
        var _this = this;

        if (!this.addPanel) {
            throw "CodeMirror-FindAndReplaceDialog requires the panel addon to be included in the page.  This can usually be found in the addons folder of the default CodeMirror installation, and must be included BEFORE the FindAndReplaceDialog addon.";
        }

        if (!options) options = {};
        if (!this.state.findAndReplaceDialog) this.state.findAndReplaceDialog = {};

        if (this.state.findAndReplaceDialog.current) {
            closePanel(this);
        }

        var panel = createPanel(this, template, options.bottom);
        this.state.findAndReplaceDialog.current = {
            panel: panel,
            onClose: options.onClose
        };
        var inputs = panel.node.getElementsByTagName("input");
        var buttons = panel.node.getElementsByTagName("button");

        if (inputs && inputs.length > 0 && options.inputBehaviour) {
            var _loop = function _loop(i) {
                var behaviour = options.inputBehaviour[i];
                var input = inputs[i];

                if (behaviour.value) {
                    input.value = behaviour.value;
                }

                if (!!behaviour.focus) {
                    input.focus();
                }

                if (!!behaviour.selectValueOnOpen) {
                    input.select();
                }

                if (behaviour.onInput) {
                    CodeMirror.on(input, "input", function (e) {
                        behaviour.onInput(inputs, e);
                    });
                }

                if (behaviour.onKeyUp) {
                    CodeMirror.on(input, "keyup", function (e) {
                        behaviour.onKeyUp(inputs, e);
                    });
                }

                CodeMirror.on(input, "keydown", function (e) {
                    if (behaviour.onKeyDown && behaviour.onKeyDown(inputs, e)) {
                        return;
                    }

                    if (e.keyCode === 27 || !!behaviour.closeOnEnter && e.keyCode === 13) {
                        input.blur();
                        CodeMirror.e_stop(e);
                        closePanel(_this);
                    } else if (e.keyCode === 13 && behaviour.callback) {
                        CodeMirror.e_preventDefault(e);
                        behaviour.callback(inputs, e);
                    }
                });
                if (behaviour.closeOnBlur !== false) CodeMirror.on(input, "blur", function () {
                    closePanel(_this);
                });
            };

            for (var i = 0; i < options.inputBehaviour.length; i++) {
                _loop(i);
            }
        }

        if (buttons && buttons.length > 0 && options.buttonBehaviour) {
            var _loop2 = function _loop2(_i) {
                var behaviour = options.buttonBehaviour[_i];

                if (!!behaviour.callback) {
                    CodeMirror.on(buttons[_i], "click", function (e) {
                        CodeMirror.e_preventDefault(e);
                        behaviour.callback(inputs, e);
                    });
                } else {
                    CodeMirror.on(buttons[_i], "click", function (e) {
                        CodeMirror.e_preventDefault(e);
                        closePanel(_this);
                    });
                }
            };

            for (var _i = 0; _i < options.buttonBehaviour.length; _i++) {
                _loop2(_i);
            }
        }

        return function () {
            closePanel(_this);
        };
    });
});
/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/9, created
 */
/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */
(function () {
    defineModeForLog();

    /**
     * https://codemirror.net/demo/simplemode.html
     */
    function defineModeForLog() {
        CodeMirror.defineSimpleMode("ansiblelog", {
            // Rules are matched in the order in which they appear
            // The start state contains the rules that are initially used
            start: [
                {regex: /=> /, token: "meta", mode: {spec: "javascript", end: /[\r\n]?/}},
                // You can match multiple tokens at once. Note that the captured
                // groups must span the whole string in this case
                {
                    regex: /(^ok)(: \[)(.*?)(])/,
                    token: ["opx-text-success", null, 'keyword', null]
                },
                {
                    regex: /(^changed)(: \[)(.*?)(])/,
                    token: ["opx-text-info", null, 'keyword', null]
                },
                {
                    regex: /(^fatal)(: \[)(.*?)(])/,
                    token: ["opx-bg-danger", null, 'keyword', null]
                },
                {
                    regex: /(^skipping)(: \[)(.*?)(])/,
                    token: ["opx-text-muted", null, 'keyword', null]
                },
                {
                    regex: /(FAILED!)|(UNREACHABLE!)/,
                    token: "opx-text-danger"
                },
                {
                    regex: /\.\.\.ignoring/,
                    token: 'opx-bg-muted'
                },
                {
                    // TASK [Execute playbook scripts] ************************************************
                    regex: /(^TASK)( \[)(.*)(] )(\**)/,
                    token: ['comment', 'comment', 'string', 'comment', 'comment']
                },
                {
                    // Highlight whole line
                    // Example: `[WARNING]: Consider using the file module with state=absent rather than running`
                    regex: /\[WARNING]/,
                    token: "opx-text-warning"
                },
                {
                    //b140.oplus-example.com     : ok=1    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
                    regex: /(.*?)(\s*:)(\s*ok=\d+)(\s*changed=\d+)(\s*unreachable=\d+)(\s*failed=\d+)(\s*skipped=\d+)(\s*rescued=\d+)(\s*ignored=\d+)/,
                    token: ['keyword', null, 'opx-text-success', 'opx-text-info', 'opx-text-danger', 'opx-text-danger', 'opx-text-muted', 'opx-primary', 'opx-text-muted']
                }
                // {regex: /true|false|null|undefined/, token: "atom"},
                // You can embed other modes with the mode property. This rule
                // causes all code between << and >> to be highlighted with the XML
                // mode.
            ],
            // The multi-line comment state.
            comment: [
                // {regex: /.*?\*\//, token: "comment", next: "start"},
                // {regex: /.*/, token: "comment"}
            ],
            // The meta property contains global information about the mode. It
            // can contain properties like lineComment, which are supported by
            // all modes, and also directives like dontIndentStates, which are
            // specific to simple modes.
            meta: {
                dontIndentStates: ["comment"],
                lineComment: "//"
            }
        });
    }
})();
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/05/23, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opCodeEditor
     * @description
     * A code viewer or editor.
     * ```html
     * <op-code-editor
     *     the-model="string"
     *     on-loaded="function"
     *     options="{readonly:boolean=,syntax:string,toolbar:boolean}"/>
     * @param {string} theModel Two-way binding model
     * @param {function(object)} onLoaded Parameter is codemirror instance
     * @param {object} options
     * - options.syntax: "shell","xml","json"
     * - options.toolbar
     * ```
     * NOTE:
     * In the case the codemirror is added to the hidden dom element,
     * you can use the addon [autorefresh]((https://codemirror.net/doc/manual.html#addon_autorefresh)
     * to make the codemirror visible at the first time it becomes visible.
     */
    angular.module('oplus.commons').component('opCodeEditor', {
        transclude: true,
        templateUrl: 'app/modules/commons/editor/op-code-editor.component.html',
        bindings: {
            theModel: '=',
            onLoaded: '<',
            options: '<'
        },
        controller: ['$scope', '$element', OpCodeEditorCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     */
    function OpCodeEditorCtrl($scope, $element) {
        var that = this;
        // console.log('height=%o', $element.css('height'));
        // if (!$element.css('height')) {
        //     $element.css('height', '20rem');
        // }
        this.cmInstance;
        this.options = this.options || {readonly: false, syntax: ''};
        this.cmOptions = {
            theme: this.options.theme ? this.options.theme : (this.options.readonly ? 'default' : 'opluscode'),
            lineNumbers: true,
            lineWrapping: true,
            autoRefresh: true,
            searchbox: true,
            onLoad: function (cm) {
                that.cmInstance = cm;
                if (angular.isFunction(that.onLoaded)) {
                    that.onLoaded(cm);
                }
                // Hack to get the cm instance
                that.modeChanged = function () {
                    cm.setOption('mode', that.mode.toLowerCase());
                }
                //https://github.com/codemirror/CodeMirror/issues/3098#issuecomment-147021890
                cm.refresh();
            }
        };
        this.toggleLineWrap = toggleLineWrap;
        this.execCommand = execCommand;
        buildCmOptions();

        $scope.$watch('$ctrl.options', function (newVal, oldVal) {
            if (newVal) {
                buildCmOptions();
                that.refreshCm = true;
                // console.log(that.cmOptions);
            }
        }, true);

        function execCommand(command) {
            that.cmInstance.execCommand(command);
        }

        function toggleLineWrap() {
            that.cmOptions.lineWrapping = !that.cmOptions.lineWrapping;
        }

        function buildCmOptions() {
            that.cmOptions.mode = that.options.syntax;
            that.cmOptions.readOnly = that.options.readonly === true;
            that.cmOptions.foldGutter = true;
            that.cmOptions.gutters = ["CodeMirror-linenumbers", "CodeMirror-foldgutter"];
            if (angular.isDefined(that.options.linewrap)) {
                that.cmOptions.lineWrapping = that.options.linewrap;
            }
        }
    }
})();

/**
 *
 * 点击指令，在新标签打开帮助文档
 *
 * 跟据浏览器url识别当前所处功能模块，假如此模块存在帮助文档，则跳转模块帮助文档，否则打开当前租户的默认帮助文档
 *
 * @author Joker Liu (qdjoker@126.com), created on 8/6/2020
 */
(function () {
    'use strict';
    angular.module('oplus.commons').directive('opHelpDoc', ['$http', opHelpDoc]);

    function opHelpDoc($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                if (!window.$oplus.appConfig.ui.enableHelpDoc) {
                    $(element).addClass('hidden');
                    return;
                }

                $(element).on('click', function () {
                    var helpPath = window.$oplus.appConfig.ui.help;
                    var helpHash = getHelpDocHash();
                    //console.log('hash', window.location.hash);

                    // console.log('helpHash', helpHash);
                    if (helpHash) {
                        //   help/#/udp/index
                        //   help/#/admin/tenant/index
                        window.open(helpPath.split('#/')[0] + helpHash);
                    } else {
                        //console.log('Open default');
                        window.open(helpPath);
                    }
                });

                /**
                 * http://localhost/oplus-admin/#/
                 * http://localhost/oplus-admin/#/dts
                 * http://localhost/oplus-admin/#/admin/tenant
                 *
                 * 跟据浏览器url获取帮助文档内部导航路径(hash路径)
                 */
                function getHelpDocHash() {
                    //has of home page is '/'
                    var hashArr = window.location.hash.split('/');

                    if (hashArr.length > 1 && hashArr[1]) {
                        var module = hashArr[1];
                        //系统管理功能为两级目录：/admin/user、/admin/data-permission
                        var secondPart = '';
                        if ('admin' === module) {
                            secondPart += ('/' + hashArr[2]);
                        }

                        return '#/' + module + secondPart + '/overview'
                    } else {
                        return '';
                    }
                }
            }
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/8/2017
 */
(function () {
    'use strict';
    /**
     * @memberof oplus.commons
     * @ngdoc directive
     * @name opHelpInfo
     * @description
     * Append an d-inline-block icon to the element to provide simple help information in popover.
     * @restrict A
     * @example
     * <ANY op-help-info="string"/>
     * @attr {string} op-help-info Text to display in popover. It can be:
     * - plain text
     * - a dom selector in format of "DOM:jquery_selector"
     */
    angular.module('oplus.commons').directive('opHelpInfo', ['$compile', '$translate', opHelpInfo]);

    function opHelpInfo($compile, $translate) {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                var info = attrs['opHelpInfo'] || '';
                // 1. 直接 Hack translate 如果当前直接使用 i18n 的 key 直接翻译
                info = $translate.instant(info);
                // 2. 如果当前使用 filter 的方式 translate
                var translateReg = /{{\s*['|"](.*)['|"]\s*\|\s*translate\s*}}/
                if (translateReg.test(info) && translateReg.exec(info).length === 2)
                    info = $translate.instant(translateReg.exec(info)[1])

                var content = info.replace(/'/g, "\\'");
                $('<i class="fa fa-info-circle text-black-50 ms-2" data-bs-toggle="popover" data-bs-trigger="hover" opx-popdrop></i>')
                    .attr('data-bs-content', content).appendTo(element);
                element.removeAttr('op-help-info')
                return {
                    pre: function preLink(scope, element, attrs, controller) {
                        // scope.helpInfo = info;
                        // console.log('compile.pre', scope.helpInfo);
                    },
                    post: function postLink(scope, element, attrs, controller) {
                        $compile(element)(scope);
                    }
                };
            }
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/11/22
 */
(function () {
    'use strict';
    /**
     * @memberof oplus.commons
     * @ngdoc directive
     * @name opLoading
     * @description
     * Show loading indicator.
     * @restrict A
     * @example
     * <ANY op-loading="object"/>
     * @param {object} opLoading
     */
    angular.module('oplus.commons').directive('opLoading', ['$compile', opLoading]);

    function opLoading($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var defaultConfig = {style: 'ellipsis'};
                var config = angular.extend({}, defaultConfig, scope.$eval(attrs['opLoading']));
                // console.log(config);
                var html;
                if (config.style === 'spinner') {
                    html = '<i class="fa fa-3x fa-pulse fa-spinner"></i>';
                } else {
                    html = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
                }
                element.append(html);
            }
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/5/25, created
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name opParamTable
     * @description
     * ```html
     * <op-param-table param-list="">
     * ```
     */
    angular.module('oplus.commons').component('opParamTable', {
        bindings: {
            paramList: '='
        },
        templateUrl: 'app/modules/commons/ui/op-param-table.html',
        controller: ['$scope', '$element', opParamTableCtrl]
    });


    /**
     *
     */
    function opParamTableCtrl($scope, $element) {
        var that = this;
        this.addParam = addParam;
        this.removeParam = removeParam;
        this.isArray = angular.isArray(this.paramList);
        this.theParamList = unifyData(this.paramList);
        this.paramTypeList = [
            {type: 'string', title: $translate.instant('common.entity.variable.string')},
            {type: 'string_pwd', title: $translate.instant('common.entity.variable.string_pwd')},
            {type: 'number', title: $translate.instant('common.entity.variable.number')},
            {type: 'date', title: $translate.instant('common.entity.variable.date')},
            {type: 'boolean', title: $translate.instant('common.entity.variable.boolean')},
            {type: 'array', title: $translate.instant('common.entity.variable.array')},
            {type: 'host', title: $translate.instant('common.entity.variable.host')}
        ];
        if (!this.isArray) {
            $scope.$watch('$ctrl.theParamList', function (newVal, oldVal) {
                if (newVal) {
                    that.paramList = {};
                    newVal.forEach(function (param) {
                        var copy = angular.copy(param);
                        delete copy.name;
                        that.paramList[param.name] = copy;
                    });
                }
            },true);
        }

        function unifyData(paramList) {
            if (angular.isArray(paramList)) {
                return paramList;
            } else if (angular.isObject(paramList)) {
                var list = [];
                Object.keys(paramList).forEach(function (key) {
                    var param = angular.copy(paramList[key]);
                    param.name = key;
                    list.push(param);
                });
                return list;
            }
            throw new Error('ProgramError: Unsupported param ' + JSON.stringify(paramList));
        }

        function addParam() {
            that.theParamList.push({});
        }

        function removeParam(index) {
            that.theParamList.splice(index,1);
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 5/30/2018
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opSearchbox
     * @description
     * A combo input box to filter display results.
     * @usage
     * ```html
     * <op-searchbox on-search="function()" search-text="string" options="object"/>
     * ```
     * @param {function} onSearch Function to do search with parameter of searchText. An empty search text shall clear the filter and display default un-filtered results.
     * @param {string} searchText Text to search. Two-way binding to the input control.
     * @param {string=} id A global unique id must exist if options.keepHistory or rememberLast
     * @param {object=} options
     * @param {boolean=} options.autoExpand
     * @param {boolean=} options.keepHistory Save last search in session storage
     * @param {boolean=} options.rememberLast Remember and auto load last search in session storage. id must exist.
     */
    angular.module('oplus.commons').component('opSearchbox', {
        templateUrl: 'app/modules/commons/ui/op-searchbox.html',
        transclude: true,
        bindings: {
            onSearch: '&?',
            // id: '@',
            searchText: '=',
            options: '<'
            // // https://juristr.com/blog/2015/02/learning-ng-verify-presence-of-directive-props/
            // // Define your function to be optional: &?. This way the function will only be defined if it actually has been passed in the HTML.
            // onClear: '&?'
        },
        controller: ['$scope', '$element', '$timeout', OpSearchBoxCtrl]
    });

    /**
     *
     * @param {string} key
     * @param {boolean} useSession
     * @constructor
     */
    function LocalCache(key, useSession) {
        var storage = useSession ? sessionStorage : localStorage;
        this.read = read;
        this.write = write;
        this.clear = clear;
        this.save = save;

        function save(property, value) {
            var item = read({});
            item[property] = value;
            storage.setItem(key, JSON.stringify(item));
        }

        function read(defaults) {
            var obj;
            try {
                obj = JSON.parse(storage.getItem(key));
            } catch (err) {
            }
            if (!obj || _.isEmpty(obj)) {
                obj = defaults;
            }
            return obj;
        }

        /**
         *
         * @param {object} value
         */
        function write(value) {
            var item = read({});
            _.assign(item, value);
            storage.setItem(key, JSON.stringify(item));
        }

        function clear() {
            storage.removeItem(key);
        }
    }

    /**
     *
     * @param $scope
     * @param $element
     * @param $timeout
     */
    function OpSearchBoxCtrl($scope, $element, $timeout) {
        var that = this;
        this.inputId = _.uniqueId('searchbox_');
        this.options = this.options || {};
        this.setFocus = setFocus;
        this.selectHistory = selectHistory;
        this.clearHistory = clearHistory;
        this.checkFocus = checkFocus;
        var elemId = $element.attr('id');
        var toRememberLast = this.options.rememberLast && elemId,
            toKeepHistory = this.options.keepHistory && elemId;
        var input = $element.find('input.form-control');
        var STORAGE_KEY = 'oplus.op-searchbox',
            sessionCache = new LocalCache(STORAGE_KEY, true),
            historyCache = new LocalCache(STORAGE_KEY),
            lastSearch = sessionCache.read({});
        this.searchHistory = historyCache.read({})[elemId] || [];

        if (toRememberLast) {
            var last = lastSearch[elemId];
            if (last) {
                that.searchText = last;
            }
        }
        input.on('keydown', function (event) {
            if (event.which === 27) { // 27 = esc key
                $scope.$apply(function () {
                    that.searchText = undefined;
                    if (toRememberLast) {
                        saveLastSearch(undefined);
                    }
                });
                event.preventDefault();
            }
        }).on('blur', function (event) {
            // that.isFocused = false;
            if (toKeepHistory) {
                addSearchHistory(that.searchText);
            }
        });

        if (that.onSearch) {
            var timer;
            $scope.$watch('$ctrl.searchText', function (newVal, oldVal) {
                // if (newVal) {
                //     that.isFocused = true;
                // }
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function () {
                    that.onSearch();
                    if (toRememberLast) {
                        saveLastSearch(newVal);
                    }
                }, 500);
            });
        }
        $scope.$on('$destroy', function () {
            input.off('keydown').off('blur');
        });

        function checkFocus() {
            // that.isFocused = false;
            // var find = $element.find('.input-group');
            // console.log('checkFocus',find.hasClass('focused'));
        }

        function saveLastSearch(text) {
            lastSearch[elemId] = text ? text : undefined;
            sessionCache.write(lastSearch);
        }

        function addSearchHistory(text) {
            if (!text) return;
            _.remove(that.searchHistory, function (o) {
                return o === text;
            });
            that.searchHistory.unshift(text);
            that.searchHistory.length = Math.min(that.searchHistory.length, 10);
            historyCache.save(elemId, that.searchHistory);
        }

        function clearHistory() {
            that.searchHistory = [];
            historyCache.save(elemId, undefined);
        }

        function selectHistory(selected) {
            that.searchText = selected;
            addSearchHistory(selected);
            saveLastSearch(selected);
        }

        function setFocus() {
            that.isFocused = true;
            // https://stackoverflow.com/questions/15859113/focus-not-working
            setTimeout(function () {
                input.focus();
            }, 500);
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/07/03, created
 */
(function () {
    'use strict';
    /**
     * @ngdoc directive
     * @name opSectionedForm
     * @restrict A
     * @description
     * This directive turns `fieldset` to navigatable section.
     * @example
     * ```html
     * <ANY op-sectioned-form/>
     * ```
     */
    angular.module('oplus.commons').directive('opSectionedForm', ['$compile','$timeout', '$interval', opSectionedForm]);

    function opSectionedForm($compile,$timeout, $interval) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.wrap('<div class="d-flex scroll-y h-100"></div>');
                var parent = element.parent();
                var navMode = 'tab';
                var checkInterval = 500, checkTimes = 0, checkCount = 0;
                // $timeout(function () {
                //     buildElement();
                // }, 2000);
                buildElement();
                //TODO: need optimize the delay interval
                var stop = $interval(function () {
                    checkCount++;
                    buildElement();
                    if (checkCount > checkTimes) {
                        $interval.cancel(stop);
                    }
                }, checkInterval)
                parent.on('click', '.js-navitem', function () {
                    var link = $(this);
                    var linkId = link.data('id');
                    if (navMode === 'scroll') {
                        document.getElementById(linkId).scrollIntoView();
                    } else if (navMode === 'tab') {
                        parent.find('.js-navitem').removeClass('active');
                        link.addClass('active');
                        var selector = '#' + linkId;
                        $('fieldset', element).not(selector).hide();
                        $(selector).show();
                    }
                });
                scope.$on('$destroy', function () {
                    parent.off('click');
                });

                function buildElement() {
                    // console.log('buildElement',element.prop('outerHTML'));
                    var navItems = [];
                    var legends = $('fieldset>legend', element);
                    if (legends.length === element.data('items')) {
                        return;
                    }
                    element.data('items', legends.length);
                    if (legends.length === 0) {
                        return;
                    }
                    legends.each(function (index, elem) {
                        var legend = $(this);
                        var section = legend.parent();
                        var sectionId = section.attr('id');
                        if (!sectionId) {
                            sectionId = _.uniqueId('formsection');
                            section.attr('id', sectionId);
                        }
                        var label = legend.text();
                        navItems.push({label: label, id: sectionId});
                    });
                    var html = '';
                    var navMenu = $('<ul class="nav nav-pills flex-column px-3 bg-light js-navmenu" style="width:10rem;min-width: 10rem;"></ul>');
                    navItems.forEach(function (item) {
                        html += '<li class="nav-item"><a class="nav-link js-navitem" data-id="' + item.id + '">' + item.label + '</a></li>';
                    });
                    navMenu.html(html);
                    element.addClass('flex-fill scroll-y px-3');
                    var find = parent.find('>.js-navmenu');
                    if (find.length === 0) {
                        parent.prepend(navMenu);
                    } else {
                        find.replaceWith(navMenu);
                    }
                }
            }
        }
    }
})();

/**
 * https://stackoverflow.com/questions/36134187/how-to-use-jquery-select2-with-angularjs
 * https://embed.plnkr.co/plunk/Mn99Pq
 * https://gist.github.com/vedovelli/3742804
 * https://stackoverflow.com/q/29644310/1524900
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/09/04
 */
(function () {
    'use strict';
    angular.module('oplus.commons').directive('opSelect', ['$timeout', '$compile', opSelect]);

    /**
     * @ngdoc directive
     * @name op-select
     * @description
     * Add select2 features to a standard <select> control.
     * @usage
     * ```
     * <select op-select="{datatype:string|array}" multiple ng-model="" ng-options=""></select>
     * ```
     *
     * @param $timeout
     * @param $compile
     */
    function opSelect($timeout, $compile) {
        return {
            restrict: 'A',
            //require: 'ngModel' gives you the controller for the ngModel directive, which is an ngModelController.
            // https://stackoverflow.com/questions/20930592/whats-the-meaning-of-require-ngmodel
            // https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#custom-control-example
            require: 'ngModel',
            scope: {ngModel: '='},
            link: function (scope, element, attrs, ngModelCtrl) {
                var tagName = element[0].tagName;
                var type = element.attr('type');
                var directiveOptions;
                if (tagName === 'SELECT') {
                    linkForSelect();
                } else if (tagName === 'INPUT' && type === 'checkbox') {
                    linkForCheckbox();
                }

                function linkForSelect() {
                    $timeout(function () {
                        var props = attrs['opSelect'];
                        directiveOptions = scope.$eval(props) || {};
                        // console.log('directiveOptions', directiveOptions);
                        if (directiveOptions.datatype === 'string' && element[0].hasAttribute('multiple')) {
                            // ngModel --> $modelValue --> Formatters --> $viewValue --> $render().
                            ngModelCtrl.$formatters.push(function (value) {
                                if(value) {
                                    return value.split(',');
                                }
                                return '';

                            });
                            ngModelCtrl.$render = function () {
                                // fix multiple select not work
                                element.find('option').each(function() {
                                    var $option = $(this);
                                    // Note: $option.val() like string:simple、number：11
                                    var optionValue = $option.val().split(":")[1];
                                    if (_.indexOf(ngModelCtrl.$modelValue,optionValue) !== -1) {
                                        $option.prop('selected', true);
                                    }
                                })
                            };
                            // Widget --> $viewValue --> Parsers --> Validators? --> $modelValue --> ngModel.
                            ngModelCtrl.$parsers.push(function (value) {
                                return value.join(',');
                            });
                        }

                        if (directiveOptions.tags === true && (scope.ngModel || []).length > 0) {
                            if (element[0].hasAttribute('multiple')) {
                                directiveOptions.data = _.merge(directiveOptions.data || [],
                                    _.map(scope.ngModel, function (m) {
                                        return {
                                            id: m,
                                            text: m,
                                            selected: true
                                        }
                                    }))
                            }
                            else {
                                directiveOptions.data = _.merge(directiveOptions.data || [], [{
                                    id: scope.ngModel,
                                    text: scope.ngModel,
                                    selected: true
                                }])
                            }
                        }
                        var options = _.assign({theme: 'bootstrap4'}, directiveOptions);
                        // select2 width配置默认值为'resole'，会根据下拉框值计算宽度，导致组件设置的宽度失效
                        // 参考： https://select2.org/appearance#container-width
                        // options.width = '100%';

                        if ($(element).parents('fieldset').attr('disabled') === 'disabled') {
                            options['disabled'] = true;
                        }

                        element.select2(options);
                    });

                    // UI control to model
                    // ngModel.$render = function (asd, dsa) {
                    // }

                    // Model to UI control
                    scope.$watch('ngModel', function (newVal, oldVal) {
                        if (newVal === oldVal) return;
                        element.trigger('change.select2');
                    }, true);

                    if ((scope.$eval(attrs['opSelect']) || { tags: false }).tags === true) {
                        element.on('select2:select select2:unselect select2:clear', function (event) {
                            scope.$apply(function () {
                                ngModelCtrl.$setViewValue(element.val());
                            });
                        })
                    }

                    scope.$on('$destroy', function () {
                        if (element.hasClass("select2-hidden-accessible"))
                            element.select2('destroy');
                    });
                }

                function linkForCheckbox() {
                }
            }
        }
    }

    /**
     * @ngdoc directive
     * @name checkboxModel
     * @description
     * This directive uses with `checkbox` input. It supports array as model value.
     * https://github.com/Vikasg7/checkbox-select
     * @usage
     * `<input type="checkbox" checkbox-model="array" checkbox-value="">`
     */
    angular.module("oplus.commons").directive("checkboxModel", ["$compile", checkboxModel]);

    function checkboxModel($compile) {
        return {
            restrict: "A",
            // require:'checkboxModel',
            link: function (scope, element, attrs) {
                // Defining updateSelection function on the parent scope
                if (!scope.$parent.updateSelections) {
                    // Using splice and push methods to make use of
                    // the same "selections" object passed by reference to the
                    // addOrRemove function as using "selections = []"
                    // creates a new object within the scope of the
                    // function which doesn't help in two way binding.
                    scope.$parent.updateSelections = function (selectedItems, item, isMultiple) {
                        if (!selectedItems) {
                            throw new Error('Cannot find model property "' + attrs.checkboxModel + '" in scope for directive `checkbox-model`.');
                        }
                        var itemIndex = selectedItems.indexOf(item);
                        var isPresent = (itemIndex > -1);
                        if (isMultiple) {
                            if (isPresent) {
                                selectedItems.splice(itemIndex, 1);
                            } else {
                                selectedItems.push(item);
                            }
                        } else {
                            if (isPresent) {
                                selectedItems.splice(0, 1);
                            } else {
                                selectedItems.splice(0, 1, item);
                            }
                        }

                    }
                }

                // Adding or removing attributes
                element.attr("ng-checked", attrs.checkboxModel + ".indexOf(" + attrs.checkboxValue + ") > -1");
                var multiple = attrs.multiple ? "true" : "false";
                element.attr("ng-click", "updateSelections(" + [attrs.checkboxModel, attrs.checkboxValue, multiple].join(",") + ")");

                // Removing the checkbox-model attribute,
                // it will avoid recompiling the element infinitly
                element.removeAttr("checkbox-model")
                    .removeAttr("checkbox-value")
                    .removeAttr("multiple");

                //Need recompile because we set ng-model, ng-click...
                $compile(element)(scope);
            }
        }
    }

})();

/**
 *
 * @author Joker liu, created on 4/1/2020
 */

(function () {
    'use strict';
    angular.module('oplus.commons').directive('opxSidebar', ['$timeout','$translate', opSidebar]);

    function opSidebar($timeout,$translate) {
        return {
            restrict: 'C',
            link: linkFn
        };


        function linkFn(scope, element, attrs, ctrl) {
            $timeout(function () {
                initSideBarItems(element);
                initSideBarEvent(element);
            });
        }

        function initSideBarItems(element) {
            //生成折叠按钮
            if ($(element).hasClass("opx-collapsible")) {
                $(".opx-sidebar-header", element).prepend(
                    ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-sidebar-toggler">'
                    + '<i class="fa fa-chevron-right expand-btn" title="'+$translate.instant('common.menu.expand_menu')+'"></i>'
                    + '<i class="fa fa-chevron-left collapse-btn" title="'+$translate.instant('common.menu.collapse_menu')+'"></i>'
                    + ' </button>'
                );
            }

            //生成搜索按钮
            if ($(".opx-sidebar-search", element).length > 0 && $(".opx-sidebar-title", element).length > 0) {
                $(' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-sidebar-search-btn">'
                    + '<i class="fa fa-search enter-search-btn" title="'+$translate.instant('common.menu.search')+'"></i>'
                    + '<i class="fa fa-reply exit-search-btn" title="'+$translate.instant('common.menu.exit_search')+'"></i>'
                    + ' </button>').insertAfter($(".opx-sidebar-search", element));
                // $(".opx-sidebar-header", element).appendAf(
                //     ' <button type="button" class="btn btn-default opx-btn-icon opx-sidebar-search-btn">'
                //     + '<i class="fa fa-search enter-search-btn" title="搜索"></i>'
                //     + '<i class="fa fa-reply exit-search-btn" title="退出搜索"></i>'
                //     + ' </button>'
                // );

                if (!$(".opx-sidebar-header", element).hasClass("opx-sidebar-header-mode-title") && !$(".opx-sidebar-header", element).hasClass("opx-sidebar-header-mode-form")) {
                    $(".opx-sidebar-header", element).addClass("opx-sidebar-header-mode-title")
                }
            }

            //处理opx-sidebar-header-fixed类
            if ($(".opx-sidebar-header", element).hasClass("opx-sidebar-header-fixed") && !$(element).hasClass("opx-sidebar-header-fixed")) {
                $(element).addClass("opx-sidebar-header-fixed")
            }
        }


        function initSideBarEvent(element) {
            //添加折叠事件
            $(".opx-sidebar-header", element).on("click", '.opx-sidebar-toggler', function () {
                if ($(element).hasClass("opx-sidebar-collapsed")) {
                    $(element).removeClass("opx-sidebar-collapsed");
                } else {
                    $(element).addClass("opx-sidebar-collapsed");
                }
            });

            //添加模式切换事件
            $(".opx-sidebar-header", element).on("click", '.opx-sidebar-search-btn', function () {
                if ($(".opx-sidebar-header", element).hasClass("opx-sidebar-header-mode-title")) {
                    $(".opx-sidebar-header", element).removeClass("opx-sidebar-header-mode-title");
                    $(".opx-sidebar-header", element).addClass("opx-sidebar-header-mode-form");
                } else {
                    $(".opx-sidebar-header", element).removeClass("opx-sidebar-header-mode-form");
                    $(".opx-sidebar-header", element).addClass("opx-sidebar-header-mode-title");
                }
            });
        }
    }
})();
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/09/19, Created
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opSmartSelect
     * @description
     * This provides a unified way for selection within definite options.
     * It behaves like checkbox, select.
     * Why reinvent a wheel besides native checkbox and select? Native checkbox does not support array type output.
     *
     * This component intends to
     * - support array output of checkboxes
     * - support ngModel
     * @usage
     * ```html
     * <op-smart-select ng-model="[]" the-items="[array|object]|Promise<array>"
     *                 options="{valueData:string,labelData:string=,viewAs:string=}"/>
     * ```
     * @param {[array|object]|Promise<array>} theItems List of selectable items. Each item can be an array or object.
     * If array, the first element is value, second element is label.
     * If object, the value and label data are determined by `options.valueData` and `options.labelData`.
     * It can be a promise of data.
     * @param {string=} options.valueData The path of item to pick value data from.
     * @param {string=} options.labelData The path of item to pick label data from.
     * @param {string=} options.viewAs "checkbox" (default), "chip"
     */
    angular.module('oplus.commons').component('opSmartSelect', {
        templateUrl: 'app/modules/commons/ui/op-smart-select.html',
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            ngModel: '=',
            theItems: '<',
            options: '<'
        },
        controller: ['$scope', '$element', '$timeout', OpSmartSelectCtrl]
    });


    /**
     *
     * @param $scope
     * @param $element
     * @param $timeout
     */
    function OpSmartSelectCtrl($scope, $element, $timeout) {
        var that = this;
        this.options = this.options || {};
        this.selectedItems = [];
        this.$onInit = onInit;
        this.itemList = [];
        var viewAs = this.options.viewAs = this.options.viewAs || 'checkbox';
        this.extraCss = viewAs === 'chip' ? 'checkbox-inline op-select-chip' : 'checkbox-inline';
        var datatype = this.options.datatype;

        function onInit() {
            initNgModelCtrl();
            $scope.$watch('$ctrl.theItems', function (newVal, oldVal) {
                if (!newVal) {
                    return;
                }
                initItemList();
            });

            function initNgModelCtrl() {
                that.ngModelCtrl.$parsers.push(function parseInput(modelValue) {
                    // if (datatype === 'csv') {
                    //     return modelValue ? modelValue.split(',') : [];
                    // }
                    return modelValue;
                });
                that.ngModelCtrl.$formatters.push(function formatOutput(selectedItems) {
                    // if (datatype === 'csv') {
                    //     return selectedItems.join(',');
                    // }
                    return selectedItems;
                });
                that.ngModelCtrl.$render = function renderView() {
                    that.selectedItems = that.ngModelCtrl.$viewValue;
                };
                $scope.$watch('$ctrl.selectedItems', function (newVal, oldVal) {
                    if (!newVal) return;

                    that.ngModelCtrl.$setViewValue(angular.copy(that.selectedItems));
                }, true);

            }

            function initItemList() {
                if (!angular.isArray(that.theItems)) {
                    throw new Error('ProgramError: <op-smart-select> `the-items` must be array')
                }
                if (that.theItems.length === 0) {
                    return;
                }
                var sampleItem = that.theItems[0];
                var itemType = 'array';
                if (angular.isArray(sampleItem)) {
                } else if (angular.isObject(sampleItem)) {
                    itemType = 'object';
                    if (!that.options.valueData) {
                        throw new Error('ProgramError: <op-smart-select> options.valueData cannot be empty for object type item');
                    }
                }
                that.itemList = _.map(that.theItems, function (o) {
                    var value, label;
                    if (itemType === 'array') {
                        value = o[0];
                        label = o[1];
                    } else {
                        value = o[that.options.valueData];
                        label = o[that.options.labelData];
                    }
                    return {value: value, label: label, id: Date.now() + _.uniqueId('-')};
                });
            }
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 1/2/2019
 */

(function () {
    'use strict';
    angular.module('oplus.commons').directive('opTabBar', ['$timeout', opTabBar]);

    function opTabBar($timeout) {
        return {
            restrict: 'A',
            link: linkFn
        };
    }

    function linkFn(scope, element, attrs, ctrl) {
        setTimeout(function () {
            element.responsiveTabs();
        });
    }
})();
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/08/30, created
 */
(function () {
    'use strict';
    /**
     * @ngdoc directive
     * @name opxFoldable
     * @description
     * Make element expandable and collapsible.
     * @restrict A
     * @example
     * ```html
     * <ANY opx-foldable/>
     * ```
     */
    angular.module('oplus.commons').directive('opxFoldable', [opxFoldable]);

    function opxFoldable() {
        var defs = {collapsed: {icon: 'fa-chevron-up'}, expanded: {icon: 'fa-chevron-down'}};
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                if (element.is('fieldset')) {
                    foldableFieldset(scope, element);
                } else if (element.hasClass('opx-sidebar')) {
                    foldableSidebar(scope, element);
                }
            }
        }

        function foldableSidebar(scope, element) {
            var collapsedCss = 'opx-sidebar-collapsed';
            var position = 'bottom';
            var style = '';
            if (position === 'bottom') {
            } else if (position === 'top') {
                style = 'position:absolute; top:40px; right:0; z-index:1;'
            }
            var button = $('<button class="op-foldable-toggle btn btn-outline-default" style="' + style + '">EXP</button>');
            if (position === 'bottom') {
                button.appendTo(element);
            } else if (position === 'top') {
                button.prependTo(element);
            }
            button.on('click', function () {
                var isCollapsed = element.hasClass(collapsedCss);
                if (isCollapsed) {
                    element.removeClass(collapsedCss);
                    element.find('.opx-treenav-item').each(function(){
                        var el=$(this);
                        el.text(el.attr('title').trim());
                    });
                } else {
                    element.addClass(collapsedCss);
                    // element.find('.opx-treenav-item').each(function(){
                    //   var el=$(this);
                    //   el.attr('title',el.find('.opx-treenav-item-title').text().trim());
                    // });
                }
            });
            scope.$on('$destroy', function () {
                button.off('click');
                button.remove();
            });
        }

        function foldableFieldset(scope, element) {
            var isFieldset = true;
            var handle = $('<button class="btn btn-default btn-sm opx-btn-flat opx-btn-icon pull-right">' +
                '<i class="fa ' + defs.expanded.icon + '"></i></button>');
            var legend = element.find('>legend').append(handle);
            var children = element.find('>*').not('legend');
            var wrapper = $('<div></div>').append(children).insertAfter(legend);
            handle.on('click', function () {
                if (wrapper.is(':visible')) {
                    wrapper.hide();
                    handle.find('i').removeClass(defs.expanded.icon).addClass(defs.collapsed.icon);
                } else {
                    wrapper.show();
                    handle.find('i').removeClass(defs.collapsed.icon).addClass(defs.expanded.icon);
                }
            });
            scope.$on('$destroy', function () {
                handle.off('click')
            });
        }
    }
})();

/**
 *
 * Modified based on
 * https://github.com/gabrieltomescu/bootstrap-responsive-tabs
 * http://home.golden.net/~tomescu/bootstrap-responsive-tabs/demo/
 * @author Leo Liao (leoliaolei@gmail.com), created on 1/2/2019
 */
(function ($) {
    $.fn.responsiveTabs = function (options) {
        var settings = $.extend({
            // These are the defaults.
            minTabWidth: "80",
            maxTabWidth: "150"
        }, options);
        var methods = {destroy: destroy, setActive: setActive};

        function destroy() {
            //TODO
        }

        function setActive(index) {
            //TODO
        }

        // Main functions for each instantiated responsive tabs
        this.each(function () {
            initElement($(this));
        });

        function initElement(ulElem) {
            var THIS = {
                activeTabIndex: 0,
                $ddMenu: undefined,
                $tabMenu: $(ulElem)
            };
            var $container = $('<div class="rt-tabs-container"></div>');
            THIS.$tabMenu.addClass("rt-tabs").wrap($container).wrap('<div class="rt-tabs-wrapper"></div>');
            // Wait some time for element rendering to get correct width
            setTimeout(function () {
                setup();
            }, 50);

            function updateTabs() {
                var totalWidth = THIS.$tabMenu.width();
                // Determine which tabs to show/hide
                var $tabItems = THIS.$tabMenu.children('li');
                var usedWidth = 0, numVisibleVerticalTabs = 0;
                var activeTabWidth = $tabItems.eq(THIS.activeTabIndex).outerWidth();
                for (var i = 0; i < $tabItems.length; i++) {
                    var thisTab = $tabItems.eq(i);
                    var tabIndex = i;// horizontalTab.index();//attr("tab-id");
                    var ddTab = THIS.$ddMenu.find(".js-tab[tab-index=" + tabIndex + "]");
                    var visible;
                    // isVisible = i < numVisibleHorizontalTabs;
                    var tabWidth = thisTab.outerWidth();
                    usedWidth += tabWidth;
                    // console.log('check', usedWidth, tabWidth, totalWidth, thisTab.prop('outerHTML'));

                    if (tabIndex < THIS.activeTabIndex) {
                        visible = usedWidth + activeTabWidth <= totalWidth;
                    } else if (tabIndex === THIS.activeTabIndex) {
                        visible = true;
                    } else {
                        visible = usedWidth <= totalWidth;
                    }
                    if (visible === false) {
                        numVisibleVerticalTabs++;
                    }
                    // console.log('activeId', TABS_OBJECT.activeTabId, tabId, isVisible, horizontalTab.text());
                    // console.log('usedWidth', menuWidth, horizontalTab.width(), horizontalTab.text(), usedWidth, isVisible);


                    thisTab.toggleClass('invisible', !visible);
                    ddTab.toggleClass('invisible', visible);
                }

                // Toggle the Tabs dropdown if there are more tabs than can fit in the tabs horizontal container
                var hasVerticalTabs = (numVisibleVerticalTabs > 0);
                THIS.$tabMenu.closest('.rt-tabs-container').toggleClass('rt-has-more', hasVerticalTabs);
                if (hasVerticalTabs)
                    THIS.$ddMenu.siblings(".dropdown-toggle").find(".count").html('<span class="badge bg-secondary">' + numVisibleVerticalTabs + '</span>');

                // Make 'active' tab always visible in horizontal container
                // and hidden in vertical container
                var activeTab = THIS.$tabMenu.find(".js-tab[tab-index=" + THIS.activeTabIndex + "]");
                var activeTabCurrentIndex = activeTab.index();
                var activeTabDefaultIndex = activeTab.attr("tab-index");
                var lastVisibleHorizontalTab = THIS.$tabMenu.find(".js-tab:visible").last();
                var lastVisibleTabIndex = lastVisibleHorizontalTab.index();

                if ((activeTabCurrentIndex < activeTabDefaultIndex) && (activeTabCurrentIndex < lastVisibleTabIndex)) {
                    activeTab.insertAfter(lastVisibleHorizontalTab);
                }
            }

            function setup() {
                // Reset all tabs for calc function
                var $tabs = THIS.$tabMenu.children('li');

                // Stop function if there are no tabs in container
                if ($tabs.length === 0) {
                    return;
                }

                // Mark each tab with a 'tab-id' for easy access
                $tabs.each(function (i) {
                    var tabIndex = $(this).index();
                    $(this)
                        .addClass("js-tab")
                        // .attr("tab-id", i + 1)
                        .attr("tab-index", tabIndex);
                });

                // Attach a dropdown to the right of the tabs bar
                // This will be toggled if tabs can't fit in a given viewport size

                // $tabsWrapper used
                var $tabsWrapper = THIS.$tabMenu.parent();
                $tabsWrapper.after('<div class="dropdown rt-tabs-dropdown js-rt-tabs-dropdown"> \
              <a href="javascript:void(0);" class="dropdown-toggle" data-bs-toggle="dropdown"><i class="fa fa-chevron-circle-right"></i></a> \
              <ul class="dropdown-menu dropdown-menu-end" role="menu"> \
              <div class="dropdown-header visible-xs">\
                <p class="count">Tabs</p> \
                <button type="button" class="btn-close" data-dismiss="dropdown"><span aria-hidden="true"></span></button> \
                <div class="divider visible-xs"></div> \
              </div> \
              </ul> \
            </div>');

                // Clone each tab into the dropdown
                // TABS_OBJECT.tabsVerticalContainer = TABS_OBJECT.tabsHorizontalContainer.siblings(".rt-tabs-dropdown").find(".dropdown-menu");
                var cloned = $tabs.clone();
                THIS.$ddMenu = $tabsWrapper.siblings(".rt-tabs-dropdown").find(".dropdown-menu").append(cloned);
                // cloned.appendTo(THIS.$ddMenu);
                // LEO:Mimic click
                cloned.on('click', 'a', function (e) {
                    var $li = $(this).parent();
                    var tabIndex = parseInt($li.attr('tab-index'));
                    var $tabItem = $tabs.eq(tabIndex);
                    $tabItem.find('a').trigger('click');
                    e.preventDefault();
                });

                // Update tabs
                updateTabs();
            }


            /**
             * Change Tab
             */
            change_tab();

            function change_tab(e) {
                var $container = THIS.$tabMenu.closest(".rt-tabs-container");
                // console.log('$container',$container);
                $container.on("click", ".rt-tabs .js-tab", function (e) {
                    var target = $(e.target);
                    THIS.activeTabIndex = parseInt($(this).attr('tab-index'));

                    // Update tab 'active' class for horizontal container if tab is clicked
                    // from dropdown. Otherwise Bootstrap handles the normal 'active' class placement.
                    var verticalTabSelected = target.parents(".dropdown-menu").length > 0;
                    if (verticalTabSelected) {
                        THIS.$tabMenu.find(".js-tab").removeClass("active");
                        var activeH = THIS.$tabMenu.find(".js-tab[tab-index=" + THIS.activeTabIndex + "]");
                        // console.log('activeH', activeH);
                        activeH.addClass("active");
                    }

                    THIS.$ddMenu.find(".js-tab").removeClass("active");

                    // Call 'sort_tabs' to re-arrange tabs based on their original index positions
                    // Call 'update_tabs' to resize tabs and determine which one to show/hide
                    // sortTabs(THIS.$tabMenu);
                    // sortTabs(THIS.$ddMenu);
                    updateTabs();
                });
            }

            // Update tabs on window resize
            var timer;
            $(window).resize(function () {
                // wait_for_repeating_events(function () {
                timer = setTimeout(function () {
                    updateTabs();
                    clearTimeout(timer);
                }, 500);
                // /*}, 300, "Resize Tabs"*/);
            });

            // Helper function to sort tabs base on their original index positions
            function sortTabs($tabsContainer) {
                var $tabs = $tabsContainer.find(".js-tab");
                $tabs.sort(function (a, b) {
                    return +a.getAttribute('tab-index') - +b.getAttribute('tab-index');
                });
                $tabsContainer.detach(".js-tab").append($tabs);
            }
        }
    };
})(jQuery);

// Generated by CoffeeScript 1.4.0
(function() {
    var SingleShadowScroll, addEvent, extend, setStyles,
        __slice = [].slice,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    extend = function() {
        var ext, extensions, key, obj, value, _i, _len;
        obj = arguments[0], extensions = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        for (_i = 0, _len = extensions.length; _i < _len; _i++) {
            ext = extensions[_i];
            for (key in ext) {
                value = ext[key];
                obj[key] = value;
            }
        }
        return obj;
    };

    addEvent = function(element, event, fn, useCapture) {
        if (useCapture == null) {
            useCapture = false;
        }
        return element.addEventListener(event, fn, useCapture);
    };

    setStyles = function(element, styles) {
        var key, _results;
        _results = [];
        for (key in styles) {
            _results.push(element.style[key] = styles[key]);
        }
        return _results;
    };

    SingleShadowScroll = (function() {

        SingleShadowScroll.prototype.options = {
            prefix: 'shadowScroll',
            noStyles: false
        };

        function SingleShadowScroll(element, options) {
            this.scroll = __bind(this.scroll, this);
            extend(this.options, options);
            this.cont = element;
            this.elements = {
                top: document.createElement('div'),
                bottom: document.createElement('div')
            };
            this.defaultStyles = {
                top: {
                    width: '100%',
                    height: '4px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0))',
                    '-webkit-transition': 'opacity 0.2s'
                },
                bottom: {
                    width: '100%',
                    height: '4px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.05), rgba(0,0,0,0))',
                    '-webkit-transition': 'opacity 0.2s'
                }
            };
            this.createElement(this.cont, 'top');
            this.createElement(this.cont, 'bottom');
            addEvent(this.cont, 'scroll', this.scroll);
            if (this.cont.style.position === '') {
                this.cont.style.position = 'relative';
            }
            this.scroll();
        }

        SingleShadowScroll.prototype.createElement = function(context, element) {
            this.elements[element].setAttribute('class', "" + this.options.prefix + "_" + element);
            this.elements[element] = context.appendChild(this.elements[element]);
            if (!this.options.noStyles) {
                return setStyles(this.elements[element], this.defaultStyles[element]);
            }
        };

        SingleShadowScroll.prototype.scroll = function() {
            var clientHeight, scrollHeight, scrollTop, shadowHeight;
            scrollTop = this.cont.scrollTop;
            clientHeight = this.cont.clientHeight;
            scrollHeight = this.cont.scrollHeight;
            shadowHeight = this.elements.top.offsetHeight;
            this.elements.top.style.top = "" + scrollTop + "px";
            this.elements.bottom.style.top = "" + (scrollTop + clientHeight - shadowHeight) + "px";
            this.elements.top.style.opacity = scrollTop;
            return this.elements.bottom.style.opacity = scrollTop + clientHeight >= scrollHeight ? 0 : 1;
        };

        return SingleShadowScroll;

    })();

    this.ShadowScroll = (function() {

        function ShadowScroll(selector, options) {
            var cont, _i, _len;
            for (_i = 0, _len = selector.length; _i < _len; _i++) {
                cont = selector[_i];
                new SingleShadowScroll(cont, options);
            }
        }

        return ShadowScroll;

    })();

}).call(this);
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 1/18/2019
 */

// var previousScrollY = 0;
(function () {
    'use strict';

    // fixModalScrollOnIOS();

    /**
     * https://stackoverflow.com/questions/43563795/bootstrap-modal-background-scroll-on-ios
     */
    // function fixModalScrollOnIOS() {
    //     $(document).on('show.bs.modal', function () {
    //         previousScrollY = window.scrollY;
    //         $('html').addClass('modal-open').css({
    //             marginTop: -previousScrollY,
    //             overflow: 'hidden',
    //             left: 0,
    //             right: 0,
    //             top: 0,
    //             bottom: 0,
    //             position: 'fixed'
    //         });
    //     }).on('hidden.bs.modal', function () {
    //         $('html').removeClass('modal-open').css({
    //             marginTop: 0,
    //             overflow: 'visible',
    //             left: 'auto',
    //             right: 'auto',
    //             top: 'auto',
    //             bottom: 'auto',
    //             position: 'static'
    //         });
    //         window.scrollTo(0, previousScrollY);
    //     });
    // }

    window.$oplus = window.$oplus || {};
    window.$oplus.fancytreeDefault = {
        extensions: ['wide', 'glyph', 'filter'],
        // LEO@20201008: set toggleEffect=false to avoid title movement during animation with "wide" extension
        // line 5500 in jquery.fancytree-all.js
        toggleEffect: false,
        strings: {noData: 'no data'},
        //https://github.com/mar10/fancytree/wiki/ExtGlyph
        glyph: {
            preset: "awesome5",
            map: {
                doc: "fas fa-file",
                docOpen: "fas fa-file",
                folder: "fas fa-folder text-muted",
                folderOpen: "fas fa-folder-open text-muted",
                expanderClosed: "far fa-angle-right",
                expanderOpen: "far fa-angle-down",
                nodata: "far fa-inbox"
            }
        },
        filter: {
            counter: false,
            autoExpand: true,
            mode: "hide",
            highlight: false
        }
    };
})();
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2022/01/08
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name opxTree
     * @description
     * A generic tree builder
     * @usage
     * ```
     * <opx-tree ng-model="array"
     *           tree-config="{data:[],selector:string,onClickNode:function,nodeRender:function}">
     * @param {[string]=} ngModel Two-way binding model of selected nodes.
     * Array of node path or CSV string of node path
     * @param {object} treeConfig Config of the tree
     * @param {*} treeConfig.data Data for the tree. It can be one of following format:
     * - a function returns array, object or promise. If it returns promise, the promise result should be array or object as well.
     * - an array:  each item is a node
     * - an object: only support dts query result format object, i.e. `{total:number, records:[{}]}`. Each item in `records` is a node
     * @param {function(string)} treeConfig.onClickNode Callback function when activate/click a node. Argument is node key.
     * @param {function(object)} treeConfig.nodeRender
     * @param {string} treeConfig.selector "multiple" or "single"
     * @param {function} selectionData
     * ```
     */
    angular.module('oplus.commons').component('opxTree', {
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            treeConfig: '<',
            selectedNodes: '=ngModel'
        },
        templateUrl: 'app/modules/commons/tree/opx-tree.component.html',
        controller: ['$q', '$scope', '$translate', OpxTreeCtrl]
    });

    /**
     *
     * @param $q
     * @param $scope
     * @param {$translate} $translate
     * @constructor
     */
    function OpxTreeCtrl($q, $scope, $translate) {
        var that = this;
        this.treeId = _.uniqueId('js-group-tree-');
        var defaultConfig = {
            rootNodeTitle: '~',
            dataAlgorithm: 'ByPath',
            algorithmConfig: {
                pathField: 'path',
                pathSeparator: '/'
            },
            selector: '',
        };
        that.treeConfig = _.merge({}, defaultConfig, that.treeConfig);
        var pathConfig = that.treeConfig.algorithmConfig;
        var normPathField = '__path';

        function getTreeElem() {
            return $('#' + that.treeId);
        }

        $scope.$watch('$ctrl.treeConfig', function (newVal, oldVal) {
            if (!newVal) {
                return;
            }
            onInit(newVal);
        }, true);
        $scope.$on('$destroy', function () {
            var tree = $.ui.fancytree.getTree(getTreeElem());
            if (tree) {
                // console.log('Destroy tree: %o', tree);
                tree.destroy();
            }
        });

        /**
         *
         * @param {function|[]|object} dataFn
         * @return {Promise<[object]>} Actual data for tree nodes
         */
        function loadAndNormalizeData(dataFn) {
            var d = $q.defer();
            if (angular.isFunction(dataFn)) {
                var result = dataFn();
                // Data is a function returning promise
                if (result && angular.isFunction(result.then)) {
                    result.then(function (data) {
                        d.resolve(normalizeData(data));
                    }).catch(function (err) {
                        d.reject(err);
                    })
                } else {
                    d.resolve(normalizeData(result));
                }
            } else {
                d.resolve(normalizeData(dataFn));
            }
            return d.promise;

            function normalizeData(data) {
                // data = [
                //     {"title": "Node 1", "key": "1", "folder": true, "path": "/Node1"},
                //     {
                //         "title": "Folder 2",
                //         "key": "2",
                //         "folder": true,
                //         "path": "/Folder2",
                //         "children": [
                //             {"title": "Node 2.1", "key": "3", "path": "/Folder2/Node2.1",},
                //             {"title": "Node 2.2", "key": "4", "path": "/Folder2/Node2.2",}
                //         ]
                //     },
                //     {
                //         "title": "Folder3",
                //         "key": "3",
                //         "folder": true,
                //         "path": "/Folder2/Folder3",
                //         "children": [
                //             {"title": "Node 2.1", "key": "3", "path": "/Folder2/Node2.1",},
                //             {"title": "Node 2.2", "key": "4", "path": "/Folder2/Node2.2",}
                //         ]
                //     }
                // ];

                if (angular.isArray(data)) {
                    return data;
                } else if (isOplusDtsFormat(data)) {
                    return data.records;
                }
                throw new TypeError('Unsupported data format for tree');
            }

            /**
             *
             * @param {records:[],total:number} data
             * @return {boolean}
             */
            function isOplusDtsFormat(data) {
                return angular.isObject(data) && angular.isArray(data.records) && angular.isNumber(data.total);
            }
        }

        function onInit(treeConfig) {
            loadAndNormalizeData(treeConfig.data).then(function (data) {
                // console.log('loadData: data=%o', data);
                createTree(data);
                if (that.ngModelCtrl) {
                    // Specify how UI should be updated. Triggered by $modelValue change
                    // $modelValue -> $formatters -> $viewValue -> $render
                    that.ngModelCtrl.$render = function () {
                        // Use $modelValue instead when need detect model change from outside.
                        // Use that.selectedNodes can not reflect chagne immediately. Maybe there is delay to digest?
                        var tree = $.ui.fancytree.getTree(getTreeElem());
                        if (tree) {
                            tree.visit(function (node) {
                                node.setSelected(_.indexOf(that.ngModelCtrl.$modelValue, node.key) > -1);
                            });
                        }
                    };
                }
            }).catch(function (err) {
                throw err;
            });
        }

        /**
         *
         * @param {[{"pathField":string}]} records With path key
         */
        function createTree(records) {
            console.log("records : ", records);
            var treeNodes;
            if (that.treeConfig.dataAlgorithm === 'ByPath') {
                treeNodes = buildTreeNodesFromRecordsByPath(records);
            }
            else if (that.treeConfig.dataAlgorithm === 'Normal') {
                treeNodes = records;
            }
            else {
                throw new Error('ProgramError: Unsupported tree data algorithm "' + that.treeConfig.dataAlgorithm + '"');
            }
            var addAll = !!that.treeConfig.insertAllNode;
            if (addAll) {
                var keyOfAll = '@@';
                var nodeOfAll = {
                    title: $translate.instant('acm.common.list.all'),
                    key: keyOfAll,
                    value: keyOfAll,
                    // assetType: that.assetType,
                    icon: 'fa fa-folders text-muted',
                    directory: false
                };
                treeNodes.unshift(nodeOfAll);
            }
            var treeElem = getTreeElem();
            if (that.treeConfig.selector === 'multiple' || that.treeConfig.selector === 'single') {
                treeElem.addClass('op-as-selector');
            }
            renderFancytree(treeElem, treeNodes);
        }

        /**
         * Convert to fancytree data
         * [Pass Data with the 'source' Option](https://github.com/mar10/fancytree/wiki/TutorialLoadData#pass-data-with-the-source-option)
         * @param {[]} records
         * @return {[NodeData]} Array of Fancytree [NodeData](https://wwwendt.de/tech/fancytree/doc/jsdoc/global.html#NodeData)
         */
        function buildTreeNodesFromRecordsByPath(records) {
            var leadingSeparator = pathConfig.leadingSeparator;
            var pathField = pathConfig.pathField;

            console.log("leadingSeparator: ", leadingSeparator);
            console.log("pathField: ", pathField);
            var absPaths = _.map(records, function (o) {
                // Assign path to another field, avoid modifying original path value
                o[normPathField] = o[pathField];
                return o[normPathField];
            });
            console.log("absPaths: ", absPaths);
            if (angular.isUndefined(leadingSeparator)) {
                if (absPaths.length > 0) {
                    pathConfig.leadingSeparator = absPaths[0].indexOf(pathConfig.pathSeparator) === 0;
                }
            }
            if (leadingSeparator) {
                records.forEach(function (o) {
                    // Normalize path. If path has leading separator, the root path (e.g., `/`) shall be normalized as ''
                    if (o[normPathField] === pathConfig.pathSeparator) {
                        o[normPathField] = '';
                    }
                });
            }
            var treeUtil = new TreeDataUtil(pathConfig.pathSeparator);
            var treeNodes = treeUtil.pathToHierarchy(absPaths, {
                    segmentField: '__pathPart',
                    childrenField: 'children',
                    leadingSeparator: leadingSeparator
                },
                function dataRender(node, pathSegment, fullPath) {
                    node['data'] = _.find(records, function (o) {
                        return o[normPathField] === fullPath;
                    })
                });
            console.log('treeNodes=%o', treeNodes);
            // debugger;
            // debugger;
            treeUtil.traverse(treeNodes, 'children', null,
                function nodeRender(self, parent) {
                    self.expanded = true;
                    self.folder = true;
                    var pathSegment = self['__pathPart'];
                    self.title = pathSegment;
                    if (!parent) {
                        // self.title = that.treeConfig.rootNodeTitle;
                        if (leadingSeparator) {
                            self.key = pathConfig.pathSeparator;
                        } else {
                            self.key = pathSegment;
                        }
                    } else {
                        self.key = parent.key + (parent.key !== pathConfig.pathSeparator ? pathConfig.pathSeparator : '') + pathSegment;
                    }
                    if (angular.isFunction(that.treeConfig.nodeRender)) {
                        that.treeConfig.nodeRender(self);
                    }
                    if (that.ngModelCtrl) {
                        //Todo list map 类型判断是否包含
                        if (_.indexOf(that.ngModelCtrl.$modelValue, self.key) > -1) {
                            self.selected = true;
                        }
                    }
                });

            return treeNodes;
        }

        function renderFancytree(elem, treeNodes) {
            var autoSelectChildren = true;
            var config = {
                source: treeNodes,
                // checkbox: !!that.treeConfig.selector,
                click: function onClick(event, data) {
                    if (data.targetType !== 'title') {
                        return;
                    }
                    var node = data.node;
                    var param = {
                        key: node.key,
                        data: node.data
                    };
                    that.treeConfig.onClickNode && that.treeConfig.onClickNode(param);
                    if (that.treeConfig.selector === 'multiple' || that.treeConfig.selector === 'single') {
                        if (that.treeConfig.selector === 'multiple') {
                            node.toggleSelected();
                            if (autoSelectChildren) {
                                if (node.isSelected()) {
                                    node.visit(function (childNode) {
                                        childNode.setSelected(true);
                                    });
                                }
                            }
                        } else {
                            data.tree.selectAll(false);
                            node.setSelected(true);
                        }
                        var selectedNodes = data.tree.getSelectedNodes();
                        var selResult = [];
                        selectedNodes.forEach(function (node) {
                            var obj;
                            if (angular.isFunction(that.treeConfig.selectionData)) {
                                obj = that.treeConfig.selectionData(node);
                            } else {
                                obj = {
                                    value: node.key,
                                    label: node.title
                                };
                            }
                            selResult.push(obj);
                        });

                        $scope.$apply(function () {
                            // $setViewValue -> $viewValue -> $parsers -> $modelValue
                            if (!that.treeConfig.mcheckType || that.treeConfig.mcheckType === 'jsonarray') {
                                that.ngModelCtrl.$setViewValue(_.map(selResult, "value"));
                            } else {
                                that.ngModelCtrl.$setViewValue(selResult);
                            }
                        });
                    } else {
                        console.log('This is not selector, do nothing');
                    }
                }
            };
            // console.log('fancytree: config=%o', config);
            elem.fancytree(_.merge({}, window.$oplus.fancytreeDefault, config));
        }
    }

    function TreeDataUtil(pathSeparator) {
        this.traverse = traverse;
        this.pathToHierarchy = pathToHierarchy;

        /**
         * Traverse tree data
         * @param treeNodes
         * @param {string} childrenField Name of children property.
         * @param {object} parent
         * @param {function(object,object)} nodeRender A function to render node. First parameter is self node, second is parent node
         */
        function traverse(treeNodes, childrenField, parent, nodeRender) {
            treeNodes.forEach(function (self) {
                // console.log('....traverse: self=%o',JSON.stringify(self));
                if (self !== null && self !== undefined) {
                    nodeRender(self, parent);
                    var children = self[childrenField];
                    if (angular.isArray(children)) {
                        traverse(children, childrenField, self, nodeRender);
                    }
                }
            });
        }

        /**
         * Convert flat paths to hierarchy tree data.
         * https://gist.github.com/stephanbogner/4b590f992ead470658a5ebf09167b03d
         * @param {[string]} absPaths Array of paths.
         * @param {object=} options How to generate the hierarchy
         * @param {string=} options.segmentField The field to save value of path segment. Default is "title"
         * @param {string=} options.childrenField The field to save values of children. Default is "children"
         * @param {boolean=} options.leadingSeparator
         * @param {function(object,string,string)=} dataRender Render the node data
         * @return {[{"<segmentField>":string, "<childrenField>":[{'<segmentField>':string,'<childrenField>':[{}]}]}]} Array of tree nodes
         */
        function pathToHierarchy(absPaths, options, dataRender) {
            // Adapted from http://brandonclapp.com/arranging-an-array-of-flat-paths-into-a-json-tree-like-structure/
            var treeNodes = [];
            options = _.merge({}, {
                segmentField: 'title',
                childrenField: 'children'
            }, options);
            var segmentedPaths = [];
            absPaths.forEach(function (path) {
                var segments;
                var isRoot = path === pathSeparator || path === '';
                if (isRoot) {
                    segmentedPaths.push({path: '', segments: ['']});
                } else if (path) {
                    segments = path.split(pathSeparator);
                    segmentedPaths.push({path: path, segments: segments});
                } /*else {
                    console.warn('Illegal path of %s. Path cannot be empty and must start with slash `%s`', path, pathSeparator);
                }*/
            });
            var leadingSeparator = options.leadingSeparator;
            for (var i = 0; i < segmentedPaths.length; i++) {
                var pathSegments = segmentedPaths[i].segments;
                var currentLevel = treeNodes;
                var fullPath = '';
                for (var j = 0; j < pathSegments.length; j++) {
                    var segment = pathSegments[j];
                    if (segment !== '') {
                        if (leadingSeparator) {
                            fullPath += pathSeparator + segment;
                        } else {
                            // Do not prepend leading path separator
                            fullPath += (j > 0 ? pathSeparator : '') + segment;
                        }
                    }
                    var existingPath = _.find(currentLevel, function (o) {
                        return o[options.segmentField] === segment;
                    })
                    if (existingPath) {
                        currentLevel = existingPath.children;
                    } else {
                        var newNode = {};
                        newNode[options.segmentField] = segment;
                        // newNode[options.propOfValue] = segment;
                        newNode[options.childrenField] = [];
                        if (angular.isFunction(dataRender)) {
                            dataRender(newNode, segment, fullPath);
                        }
                        currentLevel.push(newNode);
                        currentLevel = newNode[options.childrenField];
                    }
                }
            }
            // console.log('flatPathToHierarchy: result=%o', JSON.stringify(resultTree));
            return treeNodes;
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/29, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name tableColumnsConfig
     * @description
     * Configure view for model.
     * ```html
     * ```
     */
    angular.module('oplus.commons').component('tableColumnsConfig', {
        bindings: {
            theModel:'=',
            theFields: '<',
            options:'<'
        },
        templateUrl: 'app/modules/commons/umd/table-columns-config.html',
        controller: ['$scope', '$element', 'udmUtil', udmModelCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {udmUtil} udmUtil
     */
    function udmModelCtrl($scope, $element, udmUtil) {
        var that = this;
        this.$onInit = onInit;
        this.attrsByCode = {};

        function onInit() {


        }
    }
})();

/**
 * @ Author: chy
 * @ Create Time: 2023-05-30 14:30:43
 * @ Description:  
 */

(function () {
    'use strict';

    angular.module('oplus.commons').component('umdSelector', {
        bindings: {
            appletCode: '<?',
            selectedData: '=',
            theModel: '='
        },
        templateUrl: 'app/modules/commons/umd/umd-selector.html',
        controller: umdSelectorCtrl
    });

    umdSelectorCtrl.$inject = ['$scope', '$stateParams', 'dcDataService']

    function umdSelectorCtrl($scope, $stateParams, dcDataService) {
        var that = this;
        that.appletCode = that.appletCode || $stateParams.appletCode || '';

        $scope.$watch('$ctrl.theModel', function (newVal, oldVal) {
            that.selectedData = newVal ? _.find(that.dataList, { code: newVal }) : undefined;
        });

        dcDataService.dcModelList(that.appletCode).then(function (dataList) {
            that.dataList = angular.isArray(dataList) ? dataList : dataList.records;
            that.dataList = _.orderBy(that.dataList, ['title']);
            that.selectedData = that.theModel ? _.find(that.dataList, { code: that.theModel }) : undefined;
        }).catch(function (err) {
            //TODO: need notify error
            throw err;
        });
    }
})();
/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/28, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdDataView
     * @description
     * View UMD data.
     * ```html
     * <umd-data-view the-data="object"
     *                model-def="{attrs:[]}"
     *                view-type="string"
     *                options="{selectionConfig:{}}" />
     * @param {string} viewType  View type (list, detail, selector, editor), default is 'detail'
     * @param {[]|{}} theData Two-way binding of model data.
     * @param {{attrs:[]}} theModel Model definition
     * @param {[]} theModel.attrs Definition of model attributes
     * @param {object=} options
     * @param {object=} options.selectionConfig Used with table format view. See opxDatatable selection config.
     * @param {function(object)} options.onTableLoaded Used with table format view. Parameter is table config.
     * @param {boolean=} options.editMode Used with `detail` view Type, default is false
     *
     * ```
     */
    angular.module('oplus.commons').component('umdDataView', {
        bindings: {
            viewType: '<',
            theData: '=',
            modelDef: '<',
            options: '<'
        },
        templateUrl: 'app/modules/commons/umd/umd-data-view.component.html',
        controller: ['$scope', '$element', '$q', 'udmUtil', 'dataEx', 'widgetInteraction', 'modalHelper', umdDataViewCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {udmUtil} udmUtil
     * @param {dataEx} dataEx
     * @param {widgetInteraction} widgetInteraction
     * @param {modalHelper} modalHelper
     */
    function umdDataViewCtrl($scope, $element, $q, udmUtil, dataEx, widgetInteraction, modalHelper) {
        var that = this;
        this.$onInit = onInit;
        this.viewType = this.viewType || 'detail';
        this.options = this.options || {};
        this.clickOperation = clickOperation;
        this.clickTableItem = clickTableItem;
        var inited = false;

        function onInit() {
            // prepareView(that.theData,that.modelDef);
            $scope.$watch('$ctrl.theData', function (n, o) {
                // console.log('watch theData', that.theData, that.modelDef)
                that.viewData = n;
                if (!that.options.editMode)
                    that.viewData = angular.copy(n);
            });
            
            $scope.$watch('$ctrl.modelDef', function (newVal, oldVal) {
                // console.log('watch modelDef', that.theData, that.modelDef)
                prepareView();
            }, true);
        }

        function clickTableItem(action, rowIndex, column) {
            // console.log('clickTableItem: action=%o, rowIndex=%o', action, rowIndex);
            var modalInstance = modalHelper.openModal({
                template: '<div class="modal-header"><h4 class="modal-title">{{$ctrl.title}}</h4>' +
                    '<button type="button" ng-click="$ctrl.close()" class="btn btn-default opx-btn-flat opx-btn-icon op-close-window"><i class="far fa-times"></i></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<umd-data-view view-type="\'detail\'" the-data="$ctrl.theData" model-def="$ctrl.modelDef"></umd-data-view>' +
                    '</div>',
                controller: [function () {
                    var self = this;
                    //TODO: rowData is NOT always the whole data for this record. How to get full data?
                    var rowData = that.tableConfig.getTableData()[rowIndex];
                    this.title = rowData[column];
                    // Get full data
                    var detailView = _.find(that.modelDef.views, {type: 'detail'});
                    $q.when(dataEx.evalVarExpr(detailView.data, rowData)).then(function (data) {
                        self.theData = data;
                        self.modelDef = that.modelDef;
                    });
                    this.close = function () {
                        modalInstance.dismiss();
                    }
                }],
                controllerAs: '$ctrl'
            });
        }

        /**
         *
         * @param operation
         * @param {string} operation.type
         * @param {object} operation.config
         * @param {Event} event
         */
        function clickOperation(operation, event) {
            var config = operation.config;
            var values = that.theData;
            var options = {element: $(event.currentTarget)};
            widgetInteraction.handleInteraction($scope, config, values, options);
        }

        function prepareView(data, model) {
            // if (inited || !data || !model) {
            if (inited || !that.modelDef) {
                return;
            }
            // console.log('prepareView', {data: data, model: model, viewType: that.viewType});
            inited = true;
            if (that.viewType === 'detail' || that.viewType === 'editor') {
                detailView();
                return;
            }
            tableView();

            function tableView() {
                var columns = [];
                var viewDef = _.find(that.modelDef.views, {type: that.viewType});
                if (!viewDef.config.columns || viewDef.config.columns.length === 0) {
                    that.error = 'No column defined';
                    return;
                }
                viewDef.config.columns.forEach(function (col) {
                    var code = angular.isString(col) ? col : col.attr;
                    var attr = _.find(that.modelDef.attrs, {code: code});
                    if (!attr) {
                        return;
                    }
                    var column = {
                        data: code,
                        title: attr ? (attr.title || code) : code
                    };
                    if (attr.display) {
                        if (attr.display.onclick || attr.display.converter) {
                            column.render = function (data, type, row, meta) {
                                var html = data;
                                if (attr.display.converter) {
                                    html = dataEx.evalVarExpr(attr.display.converter, row);
                                }
                                if (attr.display.onclick) {
                                    html = '<a class="text-primary" ng-click="$ctrl.clickTableItem(\'' + attr.display.onclick + '\',' + meta.row + ',\'' + attr.code + '\')">' + html + '</a>'
                                }
                                return html;
                            };
                        }
                    }
                    columns.push(column);
                });
                if (that.viewType === 'list') {
                    that.tableConfig = {columns: columns, data: that.theData, buttons: ['reload', 'excel']};
                } else if (that.viewType === 'selector') {
                    var selection = that.options.selectionConfig;
                    that.tableConfig = { columns: columns, data: that.theData, selection: selection };
                    that.options.tableInstance = that.tableConfig;
                }
                if (angular.isFunction(that.options.onTableLoaded)) {
                    that.options.onTableLoaded(that.tableConfig);
                }
            }

            function detailView() {
                $q.when(that.theData).then(function (data) {
                    that.theData = data;
                    that.viewData = that.theData;
                    that.operations = that.modelDef.operations;
                    that.groupedAttrs = udmUtil.groupModelAttrs(that.modelDef.attrs);
                    if (!that.options.editMode) {
                        that.viewData = angular.copy(that.theData);
                        that.groupedAttrs.forEach(function (ga) {
                            _.forEach(ga.attrs, function (attr) {
                                if (attr.display && attr.display.converter) {
                                    that.viewData[attr.code] = dataEx.evalVarExpr(attr.display.converter, data);
                                }
                            });
                        });
                    }
                });
            }
        }
    }
})();

/**
 * @ Author: chy
 * @ Create Time: 2023-05-30 13:55:32
 * @ Description:  
 */


(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdDataView
     * @description
     * Edit UMD data.
     * ```html
     * <umd-data-edit model-code="string"
     *                options="{}" />
     * @param {string} modelCode  Data Model Code
     * @param {object=} options
     *
     * ```
     */
    angular.module('oplus.commons').component('umdDataEdit', {
        bindings: {
            modelCode: '<',
            dataId: '<?',
            options: '<'
        },
        templateUrl: 'app/modules/commons/umd/umd-data-edit.component.html',
        controller: ['$scope', '$stateParams', 'udmUtil', 'dataEx', 'widgetInteraction',
            'modalHelper', 'dcDataService', 'messageService', '$translate',
            umdDataEditCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {udmUtil} udmUtil
     * @param {dataEx} dataEx
     * @param {widgetInteraction} widgetInteraction
     * @param {modalHelper} modalHelper
     */
    function umdDataEditCtrl($scope, $stateParams, udmUtil, dataEx, widgetInteraction,
        modalHelper, dcDataService, messageService, $translate) {
        var that = this;
        this.$onInit = onInit;
        this.options = this.options || {};
        this.data = {};
        this.allChecked = true;

        this.dataId = this.dataId || $scope.$parent.$widget.$pageScope.pageParams._dataId || undefined;
        var inited = false;

        function onInit() {
            prepareView();
            $scope.$watch('$ctrl.data', function (n, o) {
                if (!n || !that.model || !that.model['attrs'] || n === o) return;
                that.allChecked = _.every(_.filter(that.model.attrs,
                    function (f) { return f.type !== 'group' && f.required }),
                    function (e) {
                        return that.data[e.code] !== null && that.data[e.code] !== undefined;
                    })
            }, true);
        }

        function prepareView() {
            if (inited) return;
            inited = true;

            dcDataService.queryModelByCode(that.modelCode).then(function (data) {
                that.model = {
                    attrs: angular.fromJson(data.attrs)
                };

                if (that.dataId) {
                    dcDataService.queryDataById(that.dataId).then(function (data) {
                        if (!data) return;
                        that.data = angular.extend(data.dataJson && angular.fromJson(data.dataJson) || {});
                    })
                }
            });

            that.save = function () {
                var data = {
                    dataModel: that.modelCode,
                    dataOwner: $stateParams.appletCode,
                    dataOwnerId: $stateParams.appletCode,
                    dataJson: angular.toJson(that.data),
                }

                if (that.dataId) {
                    data.id = that.dataId;
                    data.updateTime = new Date()
                }

                messageService.confirm(
                    $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.action.save')}),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.action.save'), obj: $translate.instant('common.table.config.data') }),
                    function() {
                        dcDataService.saveDcData(data).then(function (data) {
                            messageService.toast("success", $translate.instant('common.messages.operation.success', {
                                operation: $translate.instant('common.action.save')
                            }));

                            that.close();
                        })
                    }
                )
            }

            that.close = function () {
                var method = that.recursionBack($scope);
                if (method) method[0].call(that, method[1]);
            }

            that.recursionBack = function (scope) { 
                if (!scope.$parent) return [window.history.go, [-1]];
                if (scope.$close) return [scope.$close, [true]];
                return that.recursionBack(scope.$parent);
            }
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/25, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdModelAttr
     * @description
     * ```html
     * <umd-model-attr the-attr="={code:string,title:string,input:{control:string}}"
     *                 options="{readonly:boolean}" />
     * @param theAttr Two-way binding of attribute
     * ```
     */
    angular.module('oplus.commons').component('umdModelAttr', {
        bindings: {
            theAttr: '=',
            options: '<'
        },
        templateUrl: 'app/modules/commons/umd/umd-model-attr.html',
        controller: ['$scope', '$element', '$compile', udmModelAttrCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param $compile
     */
    function udmModelAttrCtrl($scope, $element, $compile) {
        var that = this;
        this.options = this.options || {};
        if (!that.theAttr.input) {
            that.theAttr.input = {};
        }
        $scope.$watch('$ctrl.theAttr.input', function (newVal, oldVal) {
            var inputConfig = newVal;
            if (!inputConfig) {
                return;
            }
            var props = calcChangedProps(newVal, oldVal);
            // Do not redraw if changed property is like `_active`
            if (props.length === 1 && props[0].indexOf('_') === 0) {
                return;
            }
            // console.log('Rerender uinput')
            var input = $('<udp-input ng-model="$ctrl.__empty" $controlonly="true" class="flex-fill"></udp-input>');
            Object.keys(inputConfig).forEach(function (prop) {
                var value = '{{$ctrl.theAttr.input.' + prop + '}}';
                input.attr(prop, value);
            });
            if (that.options.readonly) {
                input.attr('readonly', true);
            }
            $element.find('.form-control-wrapper')
                .empty()
                .html($compile(input)($scope));
        }, true);

        function calcChangedProps(newVal, oldVal) {
            if (newVal && !oldVal) {
                return Object.keys(newVal);
            }
            var result = [];
            Object.keys(newVal).forEach(function (key) {
                if (newVal[key] !== oldVal[key]) {
                    result.push(key);
                }
            });
            return result;
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/28, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').service('udmUtil', [udmUtil]);

    /**
     * @ngdoc service
     * @name udmUtil
     * @description
     */
    function udmUtil() {
        var that = this;
        this.groupModelAttrs = groupModelAttrs;
        this.defaultGroup = 'Default';

        /**
         * Group attributes.
         * @param {[{code:string=, title:string=, type:string=}]} modelAttrs
         * @returns {[{group:string, attrs:[{}]}]}
         */
        function groupModelAttrs(modelAttrs) {
            // console.log('groupModelAttrs',modelAttrs);
            // if (!angular.isArray(modelAttrs)) {
            //     throw new Error('ProgramError: modelAttrs must be an array');
            // }
            var result = [];
            if (modelAttrs.length === 0 || modelAttrs[0].type !== 'group') {
                modelAttrs.unshift({title: that.defaultGroup, type: 'group'});
            }
            var currentGroup = that.defaultGroup;
            modelAttrs.forEach(function (attr) {
                if (attr.type === 'group') {
                    currentGroup = attr.title;
                    result.push({group: currentGroup, attrs: []});
                } else {
                    _.find(result, {group: currentGroup}).attrs.push(attr);
                }
            });
            return result;
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/25, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdConfigAttrs
     * @description
     * Term umd stands for Universal Modeled Data.
     * This component is to configure model attributes.
     *
     * - [Custom component develop reference](https://www.bennadel.com/blog/2964-formatting-and-parsing-custom-ngmodel-bindings-in-angularjs.htm)
     * - [ngModel.NgModelController](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController)
     *
     * ```html
     * <umd-config-attrs ng-model="[{code:string,title:string,input:{}}]"
     *                   options="{placement:string}"/>
     * @param {[]} ngModel Two-way binding of array of attributes
     * ```
     * TODO:
     * - Always allowInvalid
     *
     */
    angular.module('oplus.commons').component('umdConfigAttrs', {
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            modelAttrs: '=ngModel',
            options: '<',
            registerInstance: '&'
        },
        templateUrl: 'app/modules/commons/umd/umd-config-attrs.component.html',
        controller: ['$scope', '$element', 'messageService', 'udmUtil', '$translate', UmdConfigAttrsCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {messageService} messageService
     * @param {udmUtil} udmUtil
     */
    function UmdConfigAttrsCtrl($scope, $element, messageService, udmUtil, $translate) {
        var that = this;
        var USE_NGMODEL_CTRL = true;
        var USE_DEBUG = false;
        this.clickAttr = clickAttr;
        this.addAttr = addAttr;
        this.deleteAttr = deleteAttr;
        this.addAttrGroup = addAttrGroup;
        this.deleteAttrGroup = deleteAttrGroup;
        this.renameAttrGroup = renameAttrGroup;
        this.doRenameAttrGroup = doRenameAttrGroup;
        this.cancelRenameAttrGroup = cancelRenameAttrGroup;
        this.sortableOptions = {connectWith: '.js-sortable-container', handle: '.js-attr-sort-handle'}
        this.$onInit = onInit;
        this.$onDestroy = onDestroy;
        if (!USE_NGMODEL_CTRL) {
            this.registerInstance({
                $instance: {
                    validateData: function () {
                        return validateAttrCode(that.modelAttrs, that.groupedAttrs);
                    }
                }
            });
        }

        function onInit() {
            if (USE_NGMODEL_CTRL) {
                // When the ngModel / $modelValue value needs to be synchronized
                // into the $viewValue / input control, it is passed through a
                // collection of formatters (in reverse order) before the $render()
                // method is invoked.
                // --
                // ngModel --> $modelValue --> Formatters --> $viewValue --> $render().
                that.ngModelCtrl.$formatters.push(formatInput);
                that.ngModelCtrl.$render = renderViewValue;
                // When the $viewValue change is emitted, it is run through a
                // collection of parsers (in order) before the value is saved to the
                // $modelValue and synchronized out to the ngModel binding.
                // --
                // Widget --> $viewValue --> Parsers --> Validators? --> $modelValue --> ngModel.
                that.ngModelCtrl.$parsers.unshift(parseOutput);
                // If the validity changes to invalid, the model will be set to undefined, unless ngModelOptions.allowInvalid is true.
                // that.ngModelCtrl.$options = that.ngModelCtrl.$options || {};
                // that.ngModelCtrl.$$setOptions({allowInvalid:true});
                // console.log('========',that.ngModelCtrl);
                // $element.attr('ng-model-options',{allowInvalid:true});
                // Always allow invalid, NOT work
                // that.ngModelCtrl.$options.allowInvalid = true;
                // console.log('........',that.ngModelCtrl);
                // If invalid, css class `ng-invalid ng-invalid-attr-code` will be added to element
                that.ngModelCtrl.$validators.attrCode = function (modelValue, viewValue) {
                    return validateAttrCode(modelValue, viewValue);
                };
                $scope.$watch('$ctrl.groupedAttrs', function (newVal, oldVal) {
                    if (USE_DEBUG)
                        console.log('watch_groupedAttrs');
                    if (newVal === oldVal) return;
                    // LEO: Use copy to break the reference and provide new reference for viewValue.
                    // Thus $viewValue change is emitted then parsers will be called.
                    that.ngModelCtrl.$setViewValue(angular.copy(newVal));
                    // if (that.options.placement) {
                    // var placement = $(that.options.placement);
                    // if (placement.length > 0)
                    //     $element.find('#js-uac-attr-card').appendTo(placement);
                    // }
                }, true);
            } else {
                var inited = false;
                var unregister = $scope.$watch('$ctrl.modelAttrs', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    if (!newVal) {
                        return;
                    }
                    unregister();
                    inited = true;
                    that.groupedAttrs = udmUtil.groupModelAttrs(that.modelAttrs);
                });
                $scope.$watch('$ctrl.groupedAttrs', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    if (!inited || !newVal) {
                        return;
                    }
                    validateAttrCode(that.modelAttrs, that.groupedAttrs);
                    that.modelAttrs = parseOutput(that.groupedAttrs);
                }, true);
            }
            // $(document).on('click.attrsconfig', function (e) {
            //     var target = $(e.target);
            //     var isOutside = target.closest('umd-config-attrs').length < 1;
            //     if (isOutside) {
            //         return;
            //     }
            //     //https://stackoverflow.com/a/7385673/1524900
            //     var container = $element;
            //     // if the target of the click isn't the container nor a descendant of the container
            //     if (!container.is(e.target) && container.has(e.target).length === 0) {
            //         $scope.$apply(function () {
            //             removeActive();
            //             that.activeModelAttr = undefined;
            //         });
            //     }
            // });
        }

        function onDestroy() {
            $(document).off('click.attrsconfig');
        }

        /**
         * https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#$render
         * Called when the view needs to be updated.
         * The $render() method is invoked in the following situations:
         * The value referenced by ng-model is changed programmatically and both the $modelValue and
         * the $viewValue are different from last time.
         * Since ng-model does not do a deep watch, $render() is only invoked if the values of $modelValue
         * and $viewValue are actually different from their previous values. If $modelValue or $viewValue
         * are objects (rather than a string or number) then $render() will not be invoked if you only change
         * a property on the objects.
         */
        function renderViewValue() {
            if (USE_DEBUG)
                console.log('renderViewValue()...');
            that.groupedAttrs = that.ngModelCtrl.$viewValue;
        }

        function formatInput(modelValue) {
            if (USE_DEBUG)
                console.log('formatInput()...', {modelValue: modelValue});
            if (!modelValue) return modelValue;
            return udmUtil.groupModelAttrs(modelValue);
        }

        function parseOutput(groupedAttrs) {
            if (USE_DEBUG)
                console.log('parseOutput()...');

            // that.ngModelCtrl.$validate();
            var result = [];
            var array = groupedAttrs;
            // if (!USE_NGMODEL_CTRL) {
            array = angular.copy(groupedAttrs);
            // }
            array.forEach(function (ga) {
                result.push({type: 'group', title: ga.group});
                ga.attrs.forEach(function (attr) {
                    Object.keys(attr).forEach(function (key) {
                        if (key.indexOf('__') === 0) {
                            delete attr[key];
                        }
                    });
                    result.push(attr);
                });
            });
            return result;
        }

        function renameAttrGroup(group) {
            that.groupInEdit = group;
            that.newGroupName = group;
        }

        function cancelRenameAttrGroup(group) {
            that.groupInEdit = undefined;
        }

        function doRenameAttrGroup(group) {
            var theGroup = _.find(that.groupedAttrs, {group: group});
            theGroup.group = that.newGroupName;
            that.groupInEdit = undefined;
        }

        function deleteAttr(attr) {
            that.groupedAttrs.forEach(function (ga) {
                _.remove(ga.attrs, function (o) {
                    return attr.code === o.code || (!attr.code && !o.code);
                });
            });
        }

        function deleteAttrGroup(group) {
            var theGroup = _.find(that.groupedAttrs, {group: group});
            var error;
            if (theGroup.attrs) {
                var internals = _.filter(theGroup.attrs, {internal: true});
                if (internals.length > 0) {
                    error = _.map(internals, function (o) {
                        return '<code>' + (o.title || o.code) + '[' + o.code + ']' + '</code>';
                    }).join(',')
                    error = $translate.instant('common.umd_config.internal_properties') + error + $translate.instant('common.umd_config.move_group')
                }
            }
            if (error) {
                messageService.alertError($translate.instant('common.umd_config.unable_to_delete'), error);
            } else {
                messageService.confirm($translate.instant('common.umd_config.delete_group'), $translate.instant('common.umd_config.delete_group_properties'), function () {
                    _.remove(that.groupedAttrs, function (o) {
                        return o.group === group;
                    })
                })
            }
        }

        function removeActive() {
            that.groupedAttrs.forEach(function (ga) {
                ga.attrs.forEach(function (o) {
                    delete o.__active;
                });
            });
        }

        function clickAttr(attr) {
            removeActive();
            attr.__active = true;
            that.activeModelAttr = attr;
        }

        /**
         *
         * @returns {boolean} True if data is valid
         */
        function validateAttrCode(modelAttrs, groupedAttrs) {
            if (USE_DEBUG)
                console.log('validateData');
            if (!groupedAttrs) {
                return true;
            }
            var codes = [];
            that.errorsByAttr = {};
            groupedAttrs.forEach(function (ga) {
                ga.attrs.forEach(function (attr) {
                    if (!attr.code) {
                        setAttrError(attr.code, 'code', $translate.instant('common.umd_config.input_properties_code'))
                    } else if (codes.indexOf(attr.code) > -1) {
                        setAttrError(attr.code, 'code', $translate.instant('common.umd_config.properties_code_not_unique'));
                    }
                    codes.push(attr.code);
                });
            });
            return _.isEmpty(that.errorsByAttr);

            /**
             * Add an attribute error.
             * @param {string} attrCode Code of attribute
             * @param {string} errorField Field name with error
             * @param {string} errorMsg Error message
             */
            function setAttrError(attrCode, errorField, errorMsg) {
                var error = that.errorsByAttr[attrCode];
                if (!error) {
                    error = {};
                    that.errorsByAttr[attrCode] = error;
                }
                error[errorField] = errorMsg;
            }
        }

        /**
         * Add attribute to group
         * @param {string} group
         */
        function addAttr(group) {
            var theGroup = _.find(that.groupedAttrs, {group: group});
            that.activeModelAttr = {code: null, title: null, input: {}};
            theGroup.attrs.push(that.activeModelAttr);
            clickAttr(that.activeModelAttr);
        }

        /**
         *
         * @param {string=} groupName
         */
        function addAttrGroup(groupName) {
            groupName = groupName || $translate.instant('common.umd_config.new_group');
            var allGroupNames = _.map(that.groupedAttrs, 'group');
            var count = 0;
            var postfix = '';
            var newGroupName;
            while (true) {
                if (count > 0) {
                    postfix = '(' + count + ')';
                }
                newGroupName = groupName + postfix;
                if (allGroupNames.indexOf(newGroupName) < 0) {
                    break;
                }
                count++;
            }
            that.groupedAttrs.forEach(function (ga) {
                ga.__collapsed = true;
            });
            that.groupedAttrs.push({group: newGroupName, attrs: [], __isNew: true});
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/28, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdConfigView
     * @description
     * Configure view of model.
     * ```html
     * <umd-config-view model-def="{views:[],attrs:[]}"/>
     * @param modelDef Model definition
     * @param modelDef.theViews Config of views. This will be modified.
     * @param modelDef.theAttrs Config of attributes
     * ```
     */
    angular.module('oplus.commons').component('umdConfigView', {
        bindings: {
            modelDef: '<'
        },
        templateUrl: 'app/modules/commons/umd/umd-config-view.component.html',
        controller: ['$scope', '$element', 'modalHelper', '$translate', UmdConfigViewCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {modalHelper} modalHelper
     * @param {$translate} $translate
     */
    function UmdConfigViewCtrl($scope, $element, modalHelper, $translate) {
        var that = this;
        this.attrsByCode = {};
        this.availAttrs = [];
        this.VIEW_DEFS = {
            list: {title: $translate.instant('umd.view.summary_list'), icon: 'fa-th-list', format: 'table'},
            selector: {title: $translate.instant('umd.view.selector_list'), icon: 'fa-tasks', format: 'table'},
            detail: {title: $translate.instant('umd.view.detail'), icon: 'fa-list-alt', format: 'form'},
            editor: {title: $translate.instant('umd.view.editor'), icon: 'fa-pen-square', format: 'form'}
        };
        this.attrsSortableOptions = {helper: "clone"};
        this.$onInit = onInit;
        this.clickView = clickView;
        this.previewView = previewView;
        this.toggleSelectionOfAttr = toggleSelectionOfAttr;
        this.toggleSelectionOfAllAttrs = toggleSelectionOfAllAttrs;

        /**
         * Select or unselect all attributes
         * @param {boolean} status
         */
        function toggleSelectionOfAllAttrs(status) {
            if (status === false) {
                that.currentView.config.columns = [];
                that.availAttrs.forEach(function (attr) {
                    delete attr._selected;
                });
            } else {
                that.availAttrs.forEach(function (attr) {
                    var col = _.find(that.currentView.config.columns, {attr: attr.code});
                    if (!col) {
                        that.currentView.config.columns.push({attr: attr.code});
                        attr._selected = true;
                    }
                });
            }
        }

        /**
         * Select or unselect an attribute
         * @param {string} attrCode
         */
        function toggleSelectionOfAttr(attrCode) {
            var columns = that.currentView.config.columns;
            var attr = _.find(that.availAttrs, {code: attrCode});
            var colIndex = _.findIndex(columns, {attr: attrCode});
            if (colIndex > -1) {
                columns.splice(colIndex, 1);
                delete attr._selected;
            } else {
                columns.push({attr: attr.code});
                attr._selected = true;
            }
        }

        function previewView(viewType) {
            var records = mockPreviewData();
            // var viewType = that.currentView.type;
            var component, data;
            if (viewType === 'detail') {
                component = '<umd-data-view the-data="$ctrl.data" model-def="$ctrl.model" view-type="\'detail\'" options="{editMode:!true}"></umd-data-view>';
                data = records[0];
            } else if (viewType === 'editor') {
                component = '<umd-data-view the-data="$ctrl.data" model-def="$ctrl.model" view-type="\'editor\'" options="{editMode:true}"></umd-data-view>';
                data = records[0];
            } else if (viewType === 'list') {
                component = '<umd-data-view the-data="$ctrl.data" model-def="$ctrl.model" view-type="\'list\'"></umd-data-view>';
                data = records;
            } else if (viewType === 'selector') {
                component = '<umd-data-view the-data="$ctrl.data" model-def="$ctrl.model" view-type="\'selector\'" options="$ctrl.viewOptions"></umd-data-view>';
                data = records;
            }

            var modal = modalHelper.openModal({
                template: '<div class="modal-header"><h4 class="modal-title">{{ \'umd.view.preview\' | translate}}</h4>' +
                    '<button type="button" class="btn-close" data-dismiss="modal" ng-click="$ctrl.cancel()"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    component +
                    '</div>',
                controller: [function () {
                    this.data = data;
                    this.model = that.modelDef;
                    this.viewOptions = {
                        selectionConfig: {
                            valueData: 'ip'
                        }
                    };
                    this.cancel = function () {
                        modal.dismiss();
                    }
                }],
                controllerAs: '$ctrl'
            }, {resizable: true});
        }

        function mockPreviewData() {
            var result = [];
            for (var i = 0; i < 10; i++) {
                var rec = {};
                result.push(rec);
                that.modelDef.attrs.forEach(function (attr) {
                    var value;
                    if (attr.type === 'group') {
                        return;
                    }
                    var datatype = 'string';
                    var control = 'input';
                    if (attr.input) {
                        control = attr.input.control || 'input';
                        datatype = attr.input.datatype;
                    }
                    if (datatype === 'number') {
                        value = 123;
                    } else if (datatype === 'datetime' || control === 'datepicker') {
                        value = new Date();
                    } else if (datatype === 'boolean') {
                        value = true;
                    } else if (datatype === 'json') {
                        value = {foo: 'foo', bar: 'bar2'};
                    } else {
                        value = 'ABCD';
                    }
                    rec[attr.code] = value;
                });
            }
            return result;
        }

        /**
         * Click one view by type.
         * @param {string} type View type
         */
        function clickView(type) {
            var view = _.find(that.modelDef.views, {type: type});
            if (!view) {
                view = {type: type, config: {}};
                // if (that.VIEW_DEFS[type].format === 'table') {
                //     view.config = {columns: []};
                // }
                that.modelDef.views.push(view);
            }
            view.config = view.config || {};
            if (that.VIEW_DEFS[type].format === 'table') {
                view.config.columns = view.config.columns || [];
                view.config.columns.forEach(function (col, index) {
                    if (angular.isString(col)) {
                        view.config.columns[index] = {attr: col};
                    }
                });
            }
            that.currentView = view;
            // that.viewConfigJson = JSON.stringify(that.currentView.config, null, "  ");
        }

        function onInit() {
            // $scope.$watch('$ctrl.viewConfigJson', function (newVal, oldVal) {
            //     var configJson = newVal;
            //     if (!configJson) return;
            //     try {
            //         that.currentView.config = JSON.parse(configJson);
            //     } catch (ex) {
            //         console.error(ex.message);
            //     }
            // });
            $scope.$watch('$ctrl.currentView', function (newVal, oldVal) {
                if (!newVal) {
                    return;
                }
                initAttrs();
            }, false);
            $scope.$watch('$ctrl.modelDef.attrs', function (newVal, oldVal) {
                if (!newVal) {
                    return;
                }
                that.attrsByCode = {};
                that.modelDef.attrs.forEach(function (attr) {
                    if (attr.type !== 'group') {
                        that.attrsByCode[attr.code] = attr;
                    }
                });
                initAttrs();

                if (!that.modelDef.views) {
                    that.modelDef.views = [];
                }
            }, true);

            function initAttrs() {
                if (!that.currentView || !that.modelDef.attrs) {
                    return;
                }
                that.availAttrs = [];
                that.modelDef.attrs.forEach(function (attr) {
                    if (attr.type !== 'group') {
                        that.availAttrs.push(angular.copy(attr));
                    }
                });
                that.modelDef.views.forEach(function (view) {
                    var config = view.config;
                    if (config && config.columns) {
                        // Remove non-exist attrs
                        var removed = _.remove(config.columns, function (col) {
                            return !_.find(that.availAttrs, {code: col.attr});
                        });
                    }
                });
                that.availAttrs.forEach(function (attr) {
                    attr._selected = !!_.find(that.currentView.config.columns, function (col) {
                        return col.attr === attr.code;
                    });
                });
            }
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/01/14, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdConfigOperation
     * @description
     * Configure operations of a model.
     * ```html
     * <umd-config-operation
     *      operation-defs="[{icon:string,title:string,disabled:boolean=,config:{}}]"/>
     * @param {[{icon:string,title:string,disabled:boolean=,config:{}}]} operationDefs Two-way binding of operation definition list
     * ```
     */
    angular.module('oplus.commons').component('umdConfigOperation', {
        bindings: {
            operationDefs: '='
        },
        templateUrl: 'app/modules/commons/umd/umd-config-operation.component.html',
        controller: ['$scope', '$element', 'modalHelper', '$translate', 'messageService', UmdConfigOperationCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {modalHelper} modalHelper
     * @param {$translate} $translate
     * @param {messageService} messageService
     */
    function UmdConfigOperationCtrl($scope, $element, modalHelper, $translate, messageService) {
        var that = this;
        this.operationDefs = this.operationDefs || [];
        this.addOperation = addOperation;
        this.removeOperation = removeOperation;
        this.editOperation = editOperation;
        this.$onInit = onInit;

        function editOperation(index) {
            openEditModal(index);
        }

        function addOperation() {
            openEditModal(-1);
        }

        /**
         * Open edit modal for an operation
         * @param {number} index Zero-based index in the operation list
         */
        function openEditModal(index) {
            var operation = index < 0 ? {} : that.operationDefs[index];
            // console.log('openEditModal:operation=%o',operation);
            var modalInstance = modalHelper.openModal({
                templateUrl: 'app/modules/commons/umd/umd-edit-operation-modal.html',
                controller: [function UmdEditOperationCtrl() {
                    var self = this;
                    this.theOperation = angular.copy(operation);
                    this.cancel = function () {
                        modalInstance.dismiss();
                    }
                    this.submit = function () {
                        modalInstance.close(self.theOperation);
                        if (index < 0) {
                            that.operationDefs.push(self.theOperation);
                        } else {
                            that.operationDefs[index] = self.theOperation;
                        }
                    }
                }],
                controllerAs: '$ctrl'
            });
        }

        function removeOperation(index) {
            messageService.confirm('Delete', 'Delete this operation?', function () {
                that.operationDefs.splice(index, 1);
            });
        }

        function onInit() {
        }
    }
})();

(function () {
    'use strict';


    angular.module('oplus.commons').component('teamResTablePermission', {
        bindings: {
            moduleData: '=',
            appModule: '<appModule',
            showPermissionRWX: '='
        },
        templateUrl: 'app/modules/commons/umd/team-res-table-permission.html',
        controller: ['$scope', '$state', '$q', 'opDatatable', 'messageService', '$translate', '$window', 'restUtils', teamResTablePermissionController]
    });

    teamResTablePermissionController.$inject = ['$scope', '$state', '$q', 'opDatatable', 'messageService', '$translate', '$window', 'restUtils'];


    function teamResTablePermissionController($scope, $state, $q, opDatatable, messageService, $translate, $window, restUtils) {
        var vm = this;
        this.changePermissions = changePermissions;
        var r = 'r';
        var w = 'w';
        var x = 'x';
        vm.$onInit = onInit;
        var tableHeaderExtra = [];
        var tableData = [];
        var permissionData = [];

        vm.cancel = cancel;

        function onInit() {
            $scope.$watch('$ctrl.moduleData', function (newVal, oldVal) {
                if (undefined !== newVal) {
                    vm.moduleData = newVal;
                    init();
                }
            }, true);
        }


        function constructCheckboxHtml(data, teamName, row) {
            var id = row.id;
            // 凭借唯一id
            var input_id_prefix = id + teamName;
            var input_idr = input_id_prefix + r;
            var input_idw = input_id_prefix + w;
            var input_idx = input_id_prefix + x;
            var check_r = _.includes(data, r);
            var check_w = _.includes(data, w);
            var check_x = _.includes(data, x);

            var ng_show_r = _.includes(vm.showPermissionRWX, r);
            var ng_show_w = _.includes(vm.showPermissionRWX, w);
            var ng_show_x = _.includes(vm.showPermissionRWX, x);


            // debugger;
            // '"' + ' ng-show="'+ ng_show_rwx +'"' +

            var html = '<div class="">\n' +
                '        <div class="form-control-wrapper d-inline-block">\n' +
                '            <div class="opx-check-group opx-secondary btn-group">\n' +
                '    <input type="checkbox"  name="r"' +
                '  id="' + input_idr + '"  ng-checked="' + check_r + '"' + ' ng-show="' + ng_show_r + '"' + +'>' +
                '           ng-click="$ctrl.changePermissions(\'' + teamName + '\',' + '\'' + id + '\',' + '\'' + input_id_prefix + '\',\'' + r + '\')"' + ' >' +
                '                <label for="' + input_idr + '"' + ' ng-show="' + ng_show_r + '"' + +'>' + '>R</label>&nbsp;\n' +
                '    <input type="checkbox"  name="w"' +
                '  id="' + input_idw + '"  ng-checked="' + check_w + '"' + ' ng-show="' + ng_show_w + '"' + +'>' +
                '           ng-click="$ctrl.changePermissions(\'' + teamName + '\',' + '\'' + id + '\',' + '\'' + input_id_prefix + '\',\'' + w + '\')"' + ' >' +
                '                <label for="' + input_idw + '"' + ' ng-show="' + ng_show_w + '"' + +'>' + '>W</label>&nbsp;\n' +
                '    <input type="checkbox"  name="x"' + ' ng-show="' + ng_show_x + '"' + +'>' +
                '  id="' + input_idx + '"  ng-checked="' + check_x + '"' +
                '           ng-click="$ctrl.changePermissions(\'' + teamName + '\',' + '\'' + id + '\',' + '\'' + input_id_prefix + '\',\'' + x + '\')"' + ' >' +
                '                <label for="' + input_idx + '"' + ' ng-show="' + ng_show_x + '"' + +'>' + '>X</label>&nbsp;\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </div>';
            return html;
        }


        function changePermissions(teamName, id, input_id_prefix, per) {
            //1. 找到对应的id， 拿出对应的团队值
            //2. 如果有则pull掉，没有则增加进来
            var input_idr = input_id_prefix + r;
            var input_idw = input_id_prefix + w;
            var input_idx = input_id_prefix + x;
            // 校验当前开关状态
            var is_checked = angular.element('#' + input_id_prefix + per).is(":checked");
            var rowData = _.find(permissionData, function (o) {
                return o.id === id;
            });
            _.forIn(rowData, function (value, key) {
                if (key === 'teamInfo') {
                    // 判断是否有这个obj， 如果没有则push一个新的进来
                    var find_obj = _.find(value, function (o) {
                        return o.teamName === teamName;
                    });
                    if (undefined === find_obj) {
                        value.push({"teamName": teamName, "permission": [per]});
                    } else {
                        for (var i in value) {
                            var te = value[i];
                            if (te.teamName === teamName) {
                                // var findPer = _.find(te.permission, function (o) {
                                //     return o === per;
                                // });
                                if (is_checked) {
                                    if (per === r) {
                                        te.permission.push(r);
                                    } else if (per === w) {
                                        $("#" + input_idr).prop("checked", "checked");
                                        te.permission.push(r);
                                        te.permission.push(w);
                                    } else {
                                        $("#" + input_idr).prop("checked", "checked");
                                        // $("#" + input_idw).prop("checked", "checked");
                                        te.permission.push(r);
                                        // te.permission.push(w);
                                        te.permission.push(x);
                                    }
                                } else {
                                    if (per === r) {
                                        $("#" + input_idw).prop("checked", "");
                                        $("#" + input_idx).prop("checked", "");
                                        _.pull(te.permission, r);
                                        _.pull(te.permission, w);
                                        _.pull(te.permission, x);
                                    } else if (per === w) {
                                        // $("#" + input_idx).prop("checked", "");
                                        _.pull(te.permission, w);
                                        // _.pull(te.permission, x);
                                    } else {
                                        _.pull(te.permission, x);
                                    }
                                }
                            }
                        }
                    }
                }
            });
            // 调用保存接口
            $scope.save();
        }


        function init() {
            prepareColumn().then(function (teamNames) {
                // 处理表头数据
                var tableColumnConfig = [{
                    data: 'id',
                    title: "id",
                    visible: false
                }, {
                    data: 'groupInfo',
                    title: "info"
                }];
                // 处理通用逻辑
                var uniqExtra = _.uniq(tableHeaderExtra);
                for (var k in uniqExtra) {
                    var extraName = uniqExtra[k];
                    tableColumnConfig.push({data: extraName, title: extraName});
                }

                for (var i in teamNames) {
                    var teamName = teamNames[i];
                    (function (teamName) {
                        tableColumnConfig.push({
                            data: teamName, title: teamName, class: 'text-center', orderable: false,
                            render: function (data, type, user, meta) {
                                return constructCheckboxHtml(data, teamName, user);
                            }
                        });
                    })(teamName);
                }
                // 处理data数据
                vm.tableConfig = {
                    data: tableData,
                    columns: tableColumnConfig
                };
            });
        }


        function prepareColumn() {
            var defer = $q.defer();
            // var tableData = [];
            var teamNames = [];
            vm.moduleData.map(function (g) {
                var cloneG = _.cloneDeep(g);
                var extra_param = cloneG.extra_param;
                for (var i in extra_param) {
                    var param = extra_param[i];
                    tableHeaderExtra.push(param.name);
                    cloneG[param.name] = param.data;
                }
                // teamInfo
                var teamInfo = cloneG.teamInfo;
                for (var j in teamInfo) {
                    var team = teamInfo[j];
                    cloneG[team.teamName] = team.permission;
                    teamNames.push(team.teamName);
                }
                tableData.push(cloneG);
            });
            defer.resolve(_.uniq(teamNames));
            permissionData = _.cloneDeep(vm.moduleData);
            return defer.promise;
        }

        $scope.save = _.debounce(function () {
            saveTablePermission(JSON.stringify(permissionData)).then(function () {
                // todo: 同步保存，不用再点击保存按钮
                // messageService.toast("success", $translate.instant('common.messages.operation.success'));
                // $state.reload();
            }).catch(function (err) {
                messageService.toast("error", $translate.instant('common.messages.operation.failed'), err.message);
            });
            // 保存逻辑
        }, 2000);




        function saveTablePermission(data) {
            return restUtils.callApi('portal', 'POST', '/api/team/permission/table/permission/{module}', {module: vm.appModule}, data);
        }


        function cancel() {
            $state.reload();
        }

    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/25/2017
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('userPref', userPref);

    /**
     * @ngdoc service
     * @name userPref
     * @description
     * Read and write user preference data.
     * @example
     * var setting = userPref.readItem('udp.someParamForUdp');
     * setting.bar="abc123"
     * userPref.saveItem('udp.someParamForUdp',setting.bar)
     */
    function userPref() {
        var STORAGE_KEY = 'oplus.userpref';
        var pref;
        load();
        this.load = load;
        this.merge = merge;
        this.saveItem = saveItem;
        this.readItem = readItem;

        /**
         * Merge incoming preference with existing.
         * @param {object} obj Preference items to merge
         */
        function merge(obj) {
            angular.extend(pref, obj);
            save();
        }

        /**
         * Save one preference item.
         * @param {string} name Item name
         * @param {*} value Item value
         */
        function saveItem(name, value) {
            pref[name] = value;
            save();
        }

        /**
         * Read one preference item
         * @param {string} name Item name
         * @param {*} defaultValue Default value if not found this item
         * @returns {*} Item value
         */
        function readItem(name, defaultValue) {
            return pref[name] || defaultValue;
        }

        /**
         * Load user preference from local storage
         * @returns {object} User preference object
         * @private
         */
        function load() {
            pref = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return pref;
        }

        /**
         * Persist preference data to local storage.
         * @private
         */
        function save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/31/2017
 */
(function () {
    angular.module('oplus.commons').service('debugTimer', debugTimer);

    /**
     * @ngdoc service
     * @name debugTimer
     * @description
     * Timer for debug
     */
    function debugTimer() {
        var timers = {}, counters = {}, debugVars = {};
        this.add = add;
        this.reset = rest;
        this.print = print;
        this.newDebugVar = newDebugVar;
        this.getDebugVar = getDebugVar;

        /**
         * Initialize a map object for debug.
         * @param {string} name The identity of the map
         */
        function newDebugVar(name, val) {
            debugVars[name] = val;
        }

        function getDebugVar(name, defaultVal) {
            var val = debugVars[name];
            if (angular.isUndefined(val)) {
                debugVars[name]=defaultVal;
            }
            return debugVars[name];
        }

        /**
         * Add current time to timer.
         * @param timerName
         * @param {number} begin Begin timestamp in millsecond
         */
        function add(timerName, begin) {
            timers[timerName] = (timers[timerName] || 0) + Date.now() - begin;
            counters[timerName] = (counters[timerName] || 0) + 1;
        }

        /**
         * Clear all timers and counters.
         */
        function rest() {
            timers = {};
            counters = {};
        }

        /**
         * Print current timer info including time consumed and count of calls.
         * @param {string=} level `info` for `console.log`, other for `console.debug`
         */
        function print(level) {
            if (level === 'info')
                console.log('debugTimer: timers', timers, "counters", counters);
            else
                console.debug('debugTimer: timers', timers, "counters", counters);
            return this;
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .constant('errorConstants', (function() {
            var problemBaseUrl = 'http://www.jhipster.tech/problem';
            return {
                EMAIL_ALREADY_USED_TYPE: problemBaseUrl + '/email-already-used',
                LOGIN_ALREADY_USED_TYPE: problemBaseUrl + '/login-already-used',
                EMAIL_NOT_FOUND_TYPE: problemBaseUrl + '/email-not-found'
            }
        })());
})();

(function () {
    'use strict';
    angular.module('oplus.commons')
        .filter('fromNow', function () {
            return fromNow;
        })
        .filter('isEmpty', function () {
            return isEmpty;
        })
        .filter('isNotEmpty', function () {
            return isNotEmpty;
        })
        .filter("filesize", function () {
            return filesize;
        })
        .filter('anysize', function () {
            return anysize;
        })
        .filter('replace', function () {
            return replace;
        })
        .filter('length', function () {
            return length;
        })
        .filter('diff', ['utils', function (utils) {
            return function diff(now, before) {
                return utils.formatDuration(before, now);
            };
        }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (html) {
                if (angular.isString(html))
                    return $sce.trustAsHtml(html);
                return html;
            }
        }])
        .filter('filterAny', function () {
            return filterAny;
        });

    /**
     * @ngdoc filter
     * @name filesize
     * https://github.com/meyfa/angular-filesize-filter/blob/master/angular-filesize-filter.js
     * @param bytes
     * @param precision
     * @returns {string}
     */
    function filesize(bytes, precision) {
        /**
         * An array of units, starting at bytes and ending with yottabytes.
         */
        var units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        // validate 'bytes'
        if (isNaN(parseFloat(bytes))) {
            return "-";
        }
        if (bytes < 1) {
            return "0 B";
        }
        // validate 'precision'
        if (isNaN(precision)) {
            precision = 1;
        }
        var unitIndex = Math.floor(Math.log(bytes) / Math.log(1000)),
            value = bytes / Math.pow(1000, unitIndex);
        return value.toFixed(precision) + " " + units[unitIndex];
    }

    /**
     * @ngdoc filter
     * @name fromNow
     * @description
     * Calculate time span from specified date to now.
     * @param {date|string} date A date or parsable date string
     * @returns {*}
     */
    function fromNow(date) {
        if (!date) {
            return '';
        }
        return moment(date).fromNow();
    }

    /**
     * @ngdoc filter
     * @description
     * If an object is not empty.
     * @param {object} object
     * @returns {boolean}
     */
    function isNotEmpty(object) {
        return !_.isEmpty(object);
    }

    /**
     * @ngdoc filter
     * @description
     * If an object is empty.
     * @param {object} object
     * @returns {boolean}
     */
    function isEmpty(object) {
        return _.isEmpty(object);
    }

    /**
     * @ngdoc filter
     * @name anysize
     * @description
     * Calculate size of anything in terms of:
     * - array: length of array
     * - object: number of keys
     * - string: length of string
     * - other: 0
     *
     * @param any
     * @returns {number|*}
     */
    function anysize(any) {
        if (!any) {
            return 0;
        } else if (angular.isDate(any)) {
            return 0;
        } else if (angular.isObject(any)) {
            return Object.keys(any).length;
        } else if (angular.isArray(any)) {
            return any.length;
        } else if (angular.isString(any)) {
            return any.length;
        }
        return 0;
    }

    /**
     *
     * @param {string} str
     * @param {string|RegExp} pattern
     * @param {string} replacement
     * @returns {*}
     */
    function replace(str, pattern, replacement) {
        if (!str) {
            return str;
        }
        return str.replace(pattern, replacement);
    }

    /**
     *  length of array 、 string  or object`s keys
     * @param source {array|string|object}
     */
    function length(source) {
        //[object Number]
        var sourceType = Object.prototype.toString.call(source).match(/\[object\s+(\w+)\]/)[1];
        if (sourceType === 'Array' || sourceType === 'String') {
            return source.length;
        } else if (sourceType === 'Object') {
            return _.keys(source).length;
        } else {
            return -1;
        }
    }

    /**
     * now - before
     * @param now
     * @param before
     * @param unit
     * https://stackoverflow.com/questions/18623783/get-the-time-difference-between-two-datetimes
     * @return {String} in hh:mm:ss
     */
    function diff(now, before, unit) {
        if (now <= 0) {
            return '';
        }
        var mEnd = moment(now <= 0 ? Date.now() : now);
        var mStart = moment(before <= 0 ? Date.now() : before);
        if (mEnd.isValid() && mStart.isValid()) {
            var ms = mEnd.diff(mStart);
            var d = moment.duration(ms);
            return Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        }
        return now - before;
    }

    /**
     *
     * @param array
     * @param {string} fieldsToFilter Comma separated fields
     * @param textToFilter
     * @return {array}
     */
    function filterAny(array, fieldsToFilter, textToFilter) {
        // console.log(fieldsToFilter, textToFilter);
        if (!textToFilter) {
            return array;
        }
        var fields = fieldsToFilter.split(',');
        return _.filter(array, function (o) {
            return _.findIndex(fields, function (f) {
                if (angular.isDefined(o[f]) && o[f] !== null) {
                    return (o[f] + '').indexOf(textToFilter) > -1;
                }
                return false;
            }) > -1;
        });
    }
})();

(function() {
    'use strict';

    /**
     * @deprecated
     */
    var jhiItemCount = {
        template: '<div class="info" data-translate="global.item-count" ' +
        'translate-value-first="{{(($ctrl.page - 1) * $ctrl.itemsPerPage) === 0 ? 1 : (($ctrl.page - 1) * $ctrl.itemsPerPage + 1)}}" ' +
        'translate-value-second="{{($ctrl.page * $ctrl.itemsPerPage) < $ctrl.queryCount ? ($ctrl.page * $ctrl.itemsPerPage) : $ctrl.queryCount}}" ' +
        'translate-value-total="{{$ctrl.queryCount}}">' +
        'Showing {{(($ctrl.page - 1) * $ctrl.itemsPerPage) == 0 ? 1 : (($ctrl.page - 1) * $ctrl.itemsPerPage + 1)}} - ' +
        '{{($ctrl.page * $ctrl.itemsPerPage) < $ctrl.queryCount ? ($ctrl.page * $ctrl.itemsPerPage) : $ctrl.queryCount}} ' +
        'of {{$ctrl.queryCount}} items.' +
        '</div>',
        bindings: {
            page: '<',
            queryCount: '<total',
            itemsPerPage: '<'
        }
    };

    angular
        .module('oplus.commons')
        .component('jhiItemCount', jhiItemCount);
})();

/**
 * JQuery extension
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/04/20
 */
(function ($) {
    /**
     * Check if an element class match an expression
     * @param {RegExp|String} regex
     * @returns {boolean}
     */
    $.fn.hasClassMatch = function (regex) {
        var classes = $(this).attr('class');
        if (!classes || !regex) return false;
        classes = classes.split(/\s+/);

        for (var i = 0, len = classes.length; i < len; i++)
            if (classes[i].match(regex)) return true;

        return false;
    };
    /**
     * Remove element class matching an expression
     * @param {RegExp|String} regex
     */
    $.fn.removeClassMatch = function (regex) {
        return this.each(function () {
            var classes = $(this).attr('class');
            if (!classes || !regex) return false;

            var classArray = [];
            classes = classes.split(/\s+/);

            for (var i = 0, len = classes.length; i < len; i++)
                if (!classes[i].match(regex)) classArray.push(classes[i]);

            $(this).attr('class', classArray.join(' '));
        });
    }
})(jQuery);
(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('PaginationUtil', PaginationUtil);

    function PaginationUtil () {

        var service = {
            parseAscending : parseAscending,
            parsePage : parsePage,
            parsePredicate : parsePredicate
        };

        return service;

        function parseAscending (sort) {
            var sortArray = sort.split(',');
            if (sortArray.length > 1){
                return sort.split(',').slice(-1)[0] === 'asc';
            } else {
                // default to true if no sort defined
                return true;
            }
        }

        // query params are strings, and need to be parsed
        function parsePage (page) {
            return parseInt(page);
        }

        // sort can be in the format `id,asc` or `id`
        function parsePredicate (sort) {
            var sortArray = sort.split(',');
            if (sortArray.length > 1){
                sortArray.pop();
            }
            return sortArray.join(',');
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .directive('showValidation', showValidation);

    function showValidation () {
        return {
            restrict: 'A',
            require: 'form',
            link: linkFunc
        };

        function linkFunc (scope, element, attrs, formCtrl) {
            element.find('.form-group').each(function() {
                var $formGroup = angular.element(this);
                var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

                if ($inputs.length > 0) {
                    $inputs.each(function() {
                        var $input = angular.element(this);
                        var inputName = $input.attr('name');
                        scope.$watch(function() {
                            return formCtrl[inputName].$invalid && formCtrl[inputName].$dirty;
                        }, function(isInvalid) {
                            $formGroup.toggleClass('has-error', isInvalid);
                        });
                    });
                }
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .directive('jhSortBy', jhSortBy);
    /**
     * @deprecated
     */
    function jhSortBy() {
        var directive = {
            restrict: 'A',
            scope: false,
            require: '^jhSort',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs, parentCtrl) {
            element.bind('click', function () {
                parentCtrl.sort(attrs.jhSortBy);
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .directive('jhSort', jhSort);

    /**
     * @deprecated
     */
    function jhSort () {
        var directive = {
            restrict: 'A',
            scope: {
                predicate: '=jhSort',
                ascending: '=',
                callback: '&'
            },
            controller: SortController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    SortController.$inject = ['$scope', '$element'];

    function SortController ($scope, $element) {
        var vm = this;

        vm.applyClass = applyClass;
        vm.resetClasses = resetClasses;
        vm.sort = sort;
        vm.triggerApply = triggerApply;

        $scope.$watchGroup(['vm.predicate', 'vm.ascending'], vm.triggerApply);
        vm.triggerApply();

        function applyClass (element) {
            var thisIcon = element.find('span.glyphicon'),
                sortIcon = 'glyphicon-sort',
                sortAsc = 'glyphicon-sort-by-attributes',
                sortDesc = 'glyphicon-sort-by-attributes-alt',
                remove = sortIcon + ' ' + sortDesc,
                add = sortAsc;
            if (!vm.ascending) {
                remove = sortIcon + ' ' + sortAsc;
                add = sortDesc;
            }
            vm.resetClasses();
            thisIcon.removeClass(remove);
            thisIcon.addClass(add);
        }

        function resetClasses () {
            var allThIcons = $element.find('span.glyphicon'),
                sortIcon = 'glyphicon-sort',
                sortAsc = 'glyphicon-sort-by-attributes',
                sortDesc = 'glyphicon-sort-by-attributes-alt';
            allThIcons.removeClass(sortAsc + ' ' + sortDesc);
            allThIcons.addClass(sortIcon);
        }

        function sort (field) {
            if (field !== vm.predicate) {
                vm.ascending = true;
            } else {
                vm.ascending = !vm.ascending;
            }
            vm.predicate = field;
            $scope.$apply();
            vm.callback();
        }

        function triggerApply (values)  {
            vm.resetClasses();
            if (values && values[0] !== '_score') {
                vm.applyClass($element.find('th[jh-sort-by=\'' + values[0] + '\']'));
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .filter('characters', characters);

    function characters () {
        return charactersFilter;

        function charactersFilter(input, chars, breakOnWord) {
            if (isNaN(chars)) {
                return input;
            }
            if (chars <= 0) {
                return '';
            }
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    // Get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                } else {
                    while (input.charAt(input.length-1) === ' ') {
                        input = input.substr(0, input.length - 1);
                    }
                }
                return input + '...';
            }
            return input;
        }
    }
})();

/**
 * Created by chenshubin on 2017/12/25.
 */
(function () {

    /**
     * @ngdoc service
     * @name utils
     * @memberof oplus.commons
     * @description
     * common method for utils
     * TODO: rename to more specific name like timeUtils
     */
    angular.module('oplus.commons').service('utils', utils);

    function utils() {
        this.formatDuration = formatDuration;

        /**
         * Convert a duration or a diff of two time to format of `hh:mm:ss`
         * Example:
         * ```
         * formatDuration(125) === '0:02:05'
         * formatDuration('2021-04-17 11:00:00', '2021-04-17 11:01:23') === '0:01:23'
         * ```
         * @param {number|Date|String} start A duration (in seconds) or a start time (format supported by moment)
         * @param {number|Date|String=} end A end time
         * @return {String}
         */
        function formatDuration(start, end) {
            // console.log('formatDuration',start,end);
            var durationMs, duration;
            if (angular.isNumber(start) && !angular.isNumber(end)) {
                durationMs = start * 1000;
            } else if (start === 0 || end === 0) {
                return '';
            } else {
                var endMm = moment(end);
                var startMm = moment(start);
                if (endMm.isValid() && startMm.isValid()) {
                    durationMs = endMm.diff(startMm);
                } else {
                    return 'NA';
                }
            }
            duration = moment.duration(durationMs);
            return Math.floor(duration.hours()) + moment.utc(durationMs).format(":mm:ss");
        }

        // /**
        //  * TODO: move to ui utils
        //  * @param data
        //  * @return {[]}
        //  */
        // this.toFancyTreeData = function (data) {
        //     data.forEach(function (item) {
        //         item["title"] = item.name;
        //         item["key"] = item.id;
        //         item["folder"] = true;
        //     });
        //     var map = {};
        //     data.forEach(function (item) {
        //         map[item.id] = item;
        //     });
        //     var val = [];
        //     data.forEach(function (item) {
        //         var parent = map[item.pId];
        //         if (parent) {
        //             (parent.children || (parent.children = [])).push(item);
        //         } else {
        //             val.push(item);
        //         }
        //     });
        //     return val;
        // }


    }

})();
/**
 * AES encryption/decryption
 */
(function () {
    'use strict';
    var app = angular.module('oplus.commons');

    app.service('securityUtils', securityUtils);

    function securityUtils() {

        this.encrypt = encrypt;
        this.decrypt = decrypt;

        function encrypt(word) {
            if (!word) return "";
            var key = CryptoJS.enc.Utf8.parse('Oplus@2022!!sys@');
            var iv = CryptoJS.enc.Utf8.parse('Oplus@2022!!sys@');
            return CryptoJS.AES.encrypt(word, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Iso10126
            }).toString();
        }

        function decrypt(word) {
            if (!word) return "";
            var key = CryptoJS.enc.Utf8.parse('Oplus@2022!!sys@');
            var iv = CryptoJS.enc.Utf8.parse('Oplus@2022!!sys@');
            var result = CryptoJS.AES.decrypt(word, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Iso10126
            });
            return result.toString(CryptoJS.enc.Utf8);
        }
    }
})();