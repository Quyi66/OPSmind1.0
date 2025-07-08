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
