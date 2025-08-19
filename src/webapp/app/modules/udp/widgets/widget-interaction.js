/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/30/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').service('widgetInteraction', widgetInteraction);
    angular.module('oplus.udp').run(['customFunctions', 'widgetInteraction', function (cf, widgetInteraction) {
        cf.defineFunction('openPage', {
            func: function (config, values, options) {
                return widgetInteraction.openPage(config, values, options)
            },
            group: 'dev',
            sample: 'openPage(config, values, options)',
            desc: ""
        });
    }]);

    widgetInteraction.$inject = ['$q', '$translate', '$state', '$timeout', '$uibModalStack', '$uibModal', '$rootScope',
        '$templateRequest', '$controller', '$compile', 'i18nService', 'pageService', 'pageDataUtil', 'widgetValues',
        'widgetUiHelper', 'messageService', 'dataEx', '$location', '$http', '$filter', 'jaoJobService', 'restUtils',
        'widgetDataUtil', 'devel', 'jaoUtil', 'modalHelper', 'runningState', 'uaaUserService', 'appletHelper'];

    /**
     *
     * @ngdoc
     * @name widgetInteraction
     * @description
     * Handle widget interaction
     * @param $q
     * @param $translate
     * @param $state
     * @param $timeout
     * @param $uibModalStack
     * @param $uibModal
     * @param $rootScope
     * @param $templateRequest
     * @param $controller
     * @param $compile
     * @param {i18nService} i18nService
     * @param {pageService} pageService
     * @param {pageDataUtil} pageDataUtil
     * @param {widgetUiHelper} widgetUiHelper
     * @param {widgetValues} widgetValues
     * @param {messageService} messageService
     * @param {dataEx} dataEx
     * @param $location
     * @param $http
     * @param $filter
     * @param {jaoJobService} jaoJobService
     * @param {restUtils} restUtils
     * @param {widgetDataUtil} widgetDataUtil
     * @param {devel} devel
     * @param {jaoUtil} jaoUtil
     * @param {modalHelper} modalHelper
     * @param {runningState} runningState
     */
    function widgetInteraction($q, $translate, $state, $timeout, $uibModalStack, $uibModal, $rootScope, $templateRequest, $controller, $compile,
                               i18nService, pageService, pageDataUtil, widgetValues, widgetUiHelper, messageService, dataEx, $location, $http, 
                               $filter, jaoJobService, restUtils, widgetDataUtil, devel, jaoUtil, modalHelper, runningState, uaaUserService, appletHelper) {
        var ACTIONS = this.ACTIONS = {
            PAGE: 'page',
            LINK: 'link',
            AJAX: 'ajax',
            JOB: 'job',
            EVENT: 'event',
            FUNC: 'func',
            PARAM: 'param',
            CODE: 'code'
        };
        var that = this;
        this.POST_PROCS = {
            msg: {key: 'ca_msg', title: $translate.instant('udp.wc.intx.postproc.ca_msg.title')},
            params: {key: 'ca_param', title: $translate.instant('udp.wc.intx.postproc.ca_param.title')},
            event: {key: 'ca_event', title: $translate.instant('udp.wc.intx.event.title')}
        };
        this.actionDefs = {
            'page': {icon: 'fa-browser'},
            'link': {icon: 'fa-link'},
            'event': {icon: 'fa-bolt'},
            'ajax': {icon: 'fa-globe'},
            'param': {icon: 'fa-brackets-curly'},
            'func': {icon: 'fa-function'},
            'job': {icon: 'fa-rocket'},
            'code': {icon: 'fa-code'}
        };

        // console.log('[i18n] TEST sync call: udp.title='+ $translate.instant('udp.title'));
        Object.keys(that.actionDefs).forEach(function (key) {
            that.actionDefs[key].title = $translate.instant('udp.wc.intx.' + key + '.title');
        });
        this.upgradeWidgetProps = upgradeWidgetProps;
        this.handleInteraction = handleInteraction;
        this.openPage = openPage;
        this.openUrlLink = openUrlLink;
        this.changePageParams = changePageParams;
        this.evalPageConfig = evalPageConfig;
        this.isActionConfigured = isActionConfigured;

        /**
         *
         * @param config Widget interaction properties.
         */
        function isActionConfigured(config) {
            return config && angular.isObject(config) && config.actions && config.actions.length > 0;

        }

        /**
         * Upgrade interaction config properties
         * @param {{interaction:object}} props Mutable
         */
        function upgradeWidgetProps(props) {
            var interaction = (props || {}).interaction;
            if (!interaction)
                return;
            up180606_migrate_interacdtion_click();
            up180622_fix_page_params();

            /**
             * Fix bug of 180606. It put page.params in param.params
             */
            function up180622_fix_page_params() {
                interaction.actions = interaction.actions || [];
                var params = (interaction.param || {}).params;
                if (interaction.actions.length === 1
                    && interaction.actions.indexOf('page') === 0
                    && interaction.page.params === "{}"
                    && params) {
                    interaction.page.params = params;
                }
            }

            /**
             * Remove interaction.click. User new interacdtion.actions
             */
            function up180606_migrate_interacdtion_click() {
                if (interaction.click) {
                    // console.log('interaction',interaction);
                    if (interaction.click === 'pageparam' || interaction.click === 'assignparam') {
                        interaction.click = 'param';
                        interaction.param = {params: interaction.params};
                        delete interaction.params;
                    } else if (interaction.click === 'pagelink') {
                        interaction.click = 'page';
                    }
                    interaction.actions = [interaction.click];
                    if (interaction.pageId) {
                        interaction.page = {
                            pageId: interaction.pageId,
                            params: interaction.params,
                            target: interaction.target
                        };
                        delete interaction.pageId;
                        delete interaction.params;
                        delete interaction.target;
                        delete interaction.url;
                        delete interaction.pageParams;
                        delete interaction.pageTarget;
                    }
                    // if (angular.isString(interaction.event)) {
                    //     interaction.actions.push('event');
                    //     interaction.event = {name: interaction.event};
                    // }
                    delete interaction.click;
                }
                // Button has only event
                if (angular.isString(interaction.event)) {
                    interaction.actions = interaction.actions || [];
                    interaction.actions.push('event');
                    interaction.event = {name: interaction.event};
                }
                if (interaction.eventbyclick) {
                    interaction.actions = interaction.actions || [];
                    interaction.actions.push(interaction.eventbyclick);
                    delete interaction.eventbyclick;
                }
            }


        }

        /**
         * Handle widget interaction.
         * @param {scope} scope Widget scope
         * @param {object} config Interaction config
         * @param {[string]} config.actions Actions array {@link ACTIONS}
         * @param {boolean} config.confirm If need confirmation before action
         * @param {string} config.confirmText Text displayed in confirmation dialog
         * @param {{name:string}=} config.event Action config for fire event
         * @param {{url:string}=} config.link Action config for open URL link
         * @param {{id:string=,params:string=,target:string=}=} config.page Action config for opening udp page
         * @param {{params:string}=} config.param Action config for changing page parameters
         * @param {{method:string, url:string, params:string, callback:string}} config.ajax Config for call Ajax
         * @param {{code:string,params:object=}} config.job Specific config for job
         * @param {object} values Values object for replacing variables in interaction params
         * @param {object=} options Options
         * @param {jQuery=} options.element Widget element
         */
        function handleInteraction(scope, config, values, options) {
            // console.log('handleInteraction: config=%o',config);
            removeUnneededActionConfig(config);
            options = options || {};
            var valueObj;
            valueObj = _.assign({}, values, widgetDataUtil.getPageScopeValues(scope));
            if (!config || !angular.isObject(config)) {
                return;
            }
            /**
             * 执行前双人复核确认
             */
            if (config.doubleReview) {
                uaaUserService.openUserDoubleReviewDialog().then(function(){
                    process();
                });
            } else if (config.confirm) {
                messageService.confirm($translate.instant('common.action.confirm'), config.confirmText, function () {
                    process();
                });
            } else {
                process();
            }

            function removeUnneededActionConfig(config) {
                if (config) {
                    _.difference(_.values(ACTIONS), config.actions).forEach(function (action) {
                        delete config[action];
                    });
                }
            }

            function process() {
                var actions = config.actions || [],
                    isEditMode = widgetUiHelper.isEditMode();
                if (isEditMode || actions.length === 0) {
                    return;
                }
                // Stop on failure
                var stopOnFailure = false;
                var promise = $q.when(),
                    hasError = false,
                    stopNext = false,
                    inProcess = true,
                    element;
                if (options.element) {
                    element = angular.element(options.element);
                }
                toggleStatus(true);
                // Run actions sequentially
                // https://stackoverflow.com/questions/25704745/how-do-i-sequentially-chain-promises-with-angularjs-q/25704747#25704747
                actions.forEach(function (action, i) {
                    var actionConfig = config[action] || {};
                    // console.log('actions.forEach: action=%o, config=%o', action, actionConfig);
                    promise = promise.then(doActionFactory(action, i))
                        .then(function (data) {
                            postActionFactory(i, {data: data});
                        })
                        .catch(function (err) {
                            hasError = true;
                            toggleStatus(false);
                            postActionFactory(i, {err: err});
                            if (actionConfig.stopFail) {
                                stopNext = true;
                            }
                        });
                });

                function toggleStatus(isInProcess) {
                    inProcess = isInProcess;
                    if (element) {
                        if (isInProcess) {
                            element.attr('disabled', 'disabled')
                                .addClass('op-in-process');
                        } else {
                            element.attr('disabled', null)
                                .removeClass('disabled op-in-process');
                        }
                    }
                }

                function postActionFactory(i, data) {
                    var actionConfig = config[actions[i]];
                    if (actionConfig && actionConfig.postproc) {
                        doPostproc(actions[i], actionConfig.postproc, scope, data);
                    }
                    if (i === actions.length - 1) {
                        toggleStatus(false);
                    }
                }

                /**
                 *
                 * @param action
                 * @param i
                 * @return {(function(): (Promise))|*}
                 */
                function doActionFactory(action, i) {
                    return function doAction() {
                        if (!stopNext && (!hasError || !stopOnFailure)) {
                            var actionConfig = config[action];
                            if (action === ACTIONS.PAGE) {
                                return openPage(actionConfig, valueObj, {current: element, scope: scope});
                            } else if (action === ACTIONS.PARAM) {
                                return changePageParams(scope, actionConfig, valueObj);
                            } else if (action === ACTIONS.LINK) {
                                return openUrlLink(actionConfig, valueObj, {scope: scope});
                            } else if (action === ACTIONS.JOB) {
                                return executeJob(actionConfig, scope, valueObj, element);
                            } else if (action === ACTIONS.AJAX) {
                                return callAjax(actionConfig, scope, valueObj, element);
                            } else if (action === ACTIONS.FUNC) {
                                return executeFunc(actionConfig, scope);
                            } else if (action === ACTIONS.EVENT) {
                                return fireEvent(actionConfig, scope);
                            } else if (action === ACTIONS.CODE) {
                                return executeCode(actionConfig, scope, valueObj);
                            }
                        }
                        inProcess = false;
                        return $q.resolve();
                    }
                }
            }
        }

        /**
         *
         * @param {object} func
         * @param {string} func.name Now only supports
         * - `closeme`: close top modal and pass `func.params` to modal caller
         * @param {string=} func.params
         * @param scope
         * @return {Promise}
         */
        function executeFunc(func, scope) {
            // console.log('executeFunc: func=%o', func);
            if (func.name === 'closeme') {
                // Close top modal if exists
                var top = $uibModalStack.getTop();
                if (top) {
                    var modalElem = $(top.value.modalDomEl);
                    var isAppletWindowModal = modalElem.hasClassMatch('op-applet-window');
                    if (isAppletWindowModal) {
                        // Applet window cannot be closed
                        return $q.resolve();
                    }
                    var paramStr = func.params;
                    if (paramStr) {
                        // var pageScope = widgetUiHelper.findPageScope(scope);
                        var params = parseParams(paramStr, widgetDataUtil.getPageScopeValues(scope));
                        $uibModalStack.close(top.key, params);
                    } else {
                        $uibModalStack.dismiss(top.key);
                    }
                }
            }
            return $q.resolve();
        }

        /**
         * Execute Javascript code
         * @param {{expr:string}} code Code definition with vars
         * @param scope
         * @param {object} varValues
         * @returns {*}
         */
        function executeCode(code, scope, varValues) {
            // console.log('executeCode', {code: code, varValues: varValues});
            if (code.expr) {
                varValues._scope = scope;
                dataEx.evalVarJs(code.expr, varValues);
            }
            return $q.resolve();
        }

        /**
         *
         * @param {{name:string,scope:string=}} event
         * @param scope
         * @return {Promise}
         */
        function fireEvent(event, scope) {
            if (event.scope === 'root') {
                scope.$root.$broadcast(widgetValues.events.WidgetEvent, {eventName: event.name});
            } else {
                if (!scope || !scope.$widget) {
                    console.warn('Cannot find scope.$widget. Is this widget in a udp page?');
                } else {
                    scope.$widget.fireWidgetEvent(event.name);
                }
            }
            return $q.resolve();
        }

        /**
         *
         * @param {object} config
         * @param {object} config.params Params with vars
         * @param {string} config.code Job code
         * @param {boolean=} config.showOutput Show realtime job output. Default is false
         * @param {object} config.postproc Post process after success call
         * @param scope
         * @param {object} varValues Values to replace vars in config.params
         * @param {angular.element} element Element trigger the job. In most case this is a button.
         * @return {Promise<{runId:string,status:string}>}
         */
        function executeJob(config, scope, varValues, element) {
            console.log('executeJob: config=%o, varValues=%o', config, varValues);
            if (config.showOutput) {
                config.waitJobCompletion = false;
            }
            var d = $q.defer();
            jaoJobService.executeJob(config, scope, varValues, element).then(function (data) {
                // console.log('executeJob: data=%o',data);
                // TODO: need handle REST job which cannot view realtime console
                if (config.showOutput && data.runId) {
                    jaoJobService.openRealtimeConsole({runId: data.runId});
                }
                d.resolve(data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        /**
         * Do post process after main action.
         * @param {string} mainAction Main action
         * @param {object} postProc Post process configuration
         * @param {string} postProc.action
         * @param {object=} postProc.ca_msg
         * @param {string} postProc.ca_msg.message
         * @param {object=} postProc.ca_param
         * @param {object=} postProc.ca_msg
         * @param {string=} postProc.ca_msg.expr Message content in format of var expression.
         * @param {string=} postProc.ca_msg.style How to display message
         * @param {{data:object=,err:Error=}} data Used for `ca_msg` and `ca_param`.
         * @param {$scope} scope Angular scope for changing page params in `ca_param` type process
         */
        function doPostproc(mainAction, postProc, scope, data) {
            var postAction = postProc.action;
            var isHandled = false;
            if (postAction === 'ca_msg') {
                var caMsg = postProc.ca_msg || {expr: '', style: 'toast'};
                var custExpr = caMsg.expr;
                var title, content, method, type;
                if (custExpr) {
                    content = dataEx.evalVarExpr(custExpr, {
                        '@data': data.data,
                        '@error': data.err
                    });
                } else {
                    content = $filter('json')(data.data || data.err);
                }
                if (data.err) {
                    method = messageService.alertError;
                    type = 'error';
                    title = $translate.instant('common.term.failed');
                } else {
                    method = messageService.alertSuccess;
                    type = 'success';
                    title = $translate.instant('common.term.completed');
                }
                if (caMsg.style === 'toast') {
                    messageService.toast(type, null, content);
                } else {
                    method(title, '<pre style="background:transparent;border:none;overflow:auto;">' + content + '</pre>');
                }
            } else if (postAction === 'ca_param') {
                var paramsConfig = postProc.ca_param;
                if (data.err) {
                    messageService.toast('error', $translate.instant('common.term.failed'), data.err.message);
                } else {
                    changePageParams(scope, {params: paramsConfig}, data);
                }
            }
            else if (postAction === 'ca_event') {
                var paramsConfig = postProc.ca_event;
                if (data.err) {
                    messageService.toast('error', $translate.instant('common.term.failed'), data.err.message);
                } else {
                    fireEvent(paramsConfig, scope);
                }
            }
        }

        /**
         *
         * @param {object} config
         * @param scope
         * @param {object} values Values object to replacing variables in string type `config.params`
         * @param {element} element
         * @param {string} config.params Params with variable in JSON string
         * @param {string} config.url Ajax URL
         * @param {string} config.method Ajax method
         * @param {object=} config.repeat If repeat calling ajax according to a variable
         * @param {boolean} config.repeat.enabled If repeat is enabled.
         * @param {string} config.repeat.var A variable whose value is array or csv string.
         * @param {string} config.callback Callback action after success call
         * It will iterate every item. repeatVar defined as string `${repeatVarName}`
         * @return {Promise}
         */
        function callAjax(config, scope, values, element) {
            if (!config.url) {
                messageService.alertError($translate.instant('common.term.error'), $translate.instant('udp.wc.intx.ajax.empty_url_error'));
            }
            var repeatConf = config.repeat || {},
                repeatVar = repeatConf.var,
                needRepeat = false;
            // console.log('callAjax', config, values, 'repeatVar', repeatVar);
            if (repeatConf.enabled && repeatVar) {
                // Values to iterate
                var varValues,
                    repeatVarName = repeatVar.substring(2, repeatVar.length - 1),
                    value = dataEx.evalVarExpr(repeatVar, values);
                // Get repeat var name without `${}`
                if (angular.isArray(value)) {
                    varValues = value;
                } else if (angular.isString(value)) {
                    varValues = value.split(',');
                }
                if (varValues && varValues.length > 0) {
                    needRepeat = true;
                    // var clonedValues = angular.copy(values);
                    var promises = [];
                    // Clone values to mutate repeat vars
                    var clonedValues = _.cloneDeep(values);
                    varValues.forEach(function (value) {
                        var url, params;
                        // Replace all repeat variables in url and params
                        // https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
                        // url = config.url.split(repeatVar).join(value);
                        // params = config.params.split(repeatVar).join(value);
                        _.set(clonedValues, repeatVarName, value);
                        url = dataEx.evalVarExpr(config.url, clonedValues);
                        params = JSON.parse(config.params);
                        Object.keys(params).forEach(function (key) {
                            params[key] = dataEx.evalVarExpr(params[key], clonedValues);
                        });
                        promises.push(callOneAjax(url, params, values));
                    });
                    return $q.all(promises);
                }
            }
            if (!needRepeat) {
                return callOneAjax(config.url, config.params, values);
            }

            function callOneAjax(varUrl, varParams, values) {
                var d = $q.defer();
                // console.debug('callOneAjax', varUrl, varParams, values);
                var url = dataEx.evalVarExpr(varUrl, values);
                var cnf = {method: config.method || 'GET', url: url};
                var params = parseParams(varParams, values);
                if (cnf.method === 'GET') {
                    cnf.params = params;
                } else if (cnf.method === 'POST' || cnf.method === 'PUT') {
                    cnf.data = params;
                }
                $http(cnf).then(function onSuccess(resp) {
                    d.resolve(resp.data);
                }, function onError(resp) {
                    var err = restUtils.guessError(resp);
                    d.reject(err);
                });
                return d.promise;
            }
        }

        /**
         * Change page scope parameters in `pageScope.pageParams`
         * and broadcast param change event in page scope.
         * @param {$scope} scope Will lookup parent `pageScope` on top of this scope
         * @param {object} config Interaction config
         * @param {string=} config._source
         * @param {string=} config.event Event name
         * @param {boolean=} config.changeUrl If change url query
         * @param {string|object} config.params The key-value pairs of parameters to change.
         * Key is parameter name, value is parameter value.
         * It can also be object JSON string expression.
         * @param {boolean=} config.paramValueAsJson Use `JSON.parse()` to evaluate parameter value. Default is false
         * @param {object=} values Values object to replacing variables in string type `config.params`
         * @return {Promise}
         */
        function changePageParams(scope, config, values) {
            config = config || {};
            var eventName = config.event,
                params = config.params;
            // var pageParams = parseParams(params, values, {paramValueAsJson: config.paramValueAsJson});
            var pageParams = dataEx.evalVarJson(params, values, {toEvalObject: config.paramValueAsJson !== false});
            var usePageScope = true;
            if (usePageScope) {
                // Restrict broadcast scope within page
                var pageScope = pageDataUtil.findPageScope(scope);// scope['$widget']['$pageScope'];
                if (!pageScope) {
                    console.warn('Cannot find $pageScope for widget. Maybe the widget is not rendered in a page view controller.');
                    pageScope = scope.$parent;
                } else {
                    // NOTE: _.merge({a:[1]},{a:[]}) --> {a:[1]}, this is not we want
                    // _.merge(theScope.pageParams, pageParams);
                    _.assign(pageScope.pageParams, pageParams);
                }
                // Change $location
                if (config.changeUrl === true) {
                    Object.keys(pageParams).forEach(function (p) {
                        var value = pageParams[p];
                        // if (p === 'nav') {
                        //     console.log('nav', value, params, pageParams, theScope.pageParams);
                        // }
                        if (angular.isArray(value)) {
                            $location.search(p, value.join(','));
                        } else if (angular.isDate(value)) {
                            $location.search(p, value.toJSON());
                        } else if (angular.isObject(value)) {
                            $location.search(p, undefined);
                        } else {
                            $location.search(p, value);
                        }
                        // console.log('changePageParam.changeUrl: %s', $location.url());
                        runningState.urlByWidgetInteraction = $location.url();
                    });
                }
            } else {
                pageScope = scope.$root;
            }

            var args2 = {
                _source: config._source,
                eventName: eventName,
                // paramValueAsJson: config.paramValueAsJson,
                params: pageParams
            };
            console.debug('>> Broadcast event %s with args %o', widgetValues.events.PageParamChanged, args2);
            pageScope.$broadcast(widgetValues.events.PageParamChanged, args2);
            // $location.query()
            return $q.resolve();
        }

        /**
         * Open a URL link
         * @param {{url:string,target:string=}} config
         * @paream {string} config.url URL to open. This can be an external link like http://www.google.com
         * or relative path `/option.html` or
         * @param {string=} config.target Values of `dialog` for popup modal,
         * `_blank` or blank for new window, others for selector
         * @param {object} values
         * @param {object=} options
         * @param {object=} options.scope
         */
        function openUrlLink(config, values, options) {
            var d = $q.defer();
            var url = dataEx.evalVarExpr(config.url, values);
            var target = config.target;
            if (!target || (target === '_blank')) {
                // Open URL in new window
                window.open(url);
                d.resolve();
            } else if (target === 'dialog') {
                // Open URL in a dialog div
                openUrlInDialog(url, options, function () {
                    d.resolve();
                });
            } /*else if (target === '_self') {
                window.open(url);
                d.resolve();
            }*/ else {
                // Open URL in a dom container
                var container = $(target);
                if (container.length === 0) {
                    d.reject(new Error($translate.instant('udp.wc.intx.link.cannot_find_target_error', {target: target})));
                    return;
                }
                var parsed = parseUrl(url);
                var isResolved = false;
                // console.log('url=' + url + ', parsed ', parsed);
                // console.log($state.get());
                // tplUrl = false;
                if (parsed.isState) {
                    var stateTo, stateParams;
                    // https://stackoverflow.com/a/30926025/1524900
                    var states = $state.get();
                    for (var i = 0; i < states.length; i++) {
                        var state = states[i];
                        var privatePortion = state.$$state();
                        if (privatePortion.url) {
                            var match = privatePortion.url.exec(parsed.path, parsed.search);
                            if (match) {
                                stateTo = state.name;
                                stateParams = angular.merge({}, parsed.search, match);
                                // console.log("Matched state: ", state.name, "parameters: ", stateParams);
                                break;
                            }
                        } else {
                            // console.log('Cannot find URL definition for state', privatePortion);
                        }
                    }
                    if (stateTo) {
                        isResolved = true;
                        d.resolve();
                        // console.log('State goes to [' + stateTo + '] with parameters ', stateParams);
                        $state.go(stateTo, stateParams);
                    }
                    // container.html('').append($compile('<div ng-include="\''+tplUrl+'\'"></div>')($rootScope));
                    // d.resolve();
                    // $location.url(tplUrl);
                    // $templateRequest(url).then(function (data) {
                    //     // console.log('data', data);
                    //     // container.html('').append($compile(data)($rootScope));
                    //     d.resolve();
                    // }).catch(function (err) {
                    //     d.reject(err);
                    // })
                }
                if (!isResolved) {
                    var iframe = $('<iframe class="udp-page-iframe" style="border:0;width:100%;"></iframe>');
                    iframe.attr('src', url);
                    container.html('').append(iframe);
                    d.resolve();
                }
            }
            return d.promise;

            /**
             *
             * @param {String} url The hash and search portions of URL, like "#/foo/bar?param1=abc&param2=xyz"
             * @returns {{path: string, search: {}, isState: boolean}}
             */
            function parseUrl(url) {
                var result = {path: '', search: {}, isState: false};
                var matches = url.match(/#([^\?]+)(\??)(.*)/);
                if (matches) {
                    // https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object
                    var str = matches[3];
                    var search = {};
                    if (str) {
                        search = JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
                    }
                    result = {path: matches[1], search: search, isState: true};
                }
                return result;
            }

            function openUrlInDialog(url, options, callback) {
                var modalConfig = {
                    templateUrl: 'app/modules/udp/url-iframe-dialog.html',
                    controller: ['$scope', '$sce', function ($scope, $sce) {
                        var that = this;
                        that.url = $sce.trustAsResourceUrl(url);

                        that.dismissModal = function () {
                            modalInstance.dismiss();
                        }

                        that.openInNewWindow = function () {
                            window.open(url);
                        }
                    }],
                    controllerAs: '$ctrl',
                };

                var modalOptions = {};

                if (options && options.applet) {
                    modalConfig.modaless = true;
                    modalConfig.windowClass = 'op-applet-window';
                    modalConfig.controller = 'AppletModalCtrl';
                    modalConfig.resolve = {
                        theApplet: function () {
                            return options.applet;
                        }
                    }

                    modalOptions = appletHelper.buildOptions(options.applet);
                }
                else {
                    modalConfig.size = 'lg';
                }

                var modalInstance = modalHelper.openModal(modalConfig, modalOptions);

                if (options && options.applet) {
                    modalInstance.opened.then(function () {
                        appletHelper.appletModalOpened(options.applet.code, false);
                    });
                    modalInstance.rendered.then(function () {
                        appletHelper.appletModalRendered(options.applet.code);
                        callback();
                    });
                }
                else {
                    modalInstance.rendered.then(function () {
                        $('.modal-dialog').eq(0)
                            .draggable({handle: '.modal-header:eq(0)'})
                            .resizable({});
                        callback();
                    });
                }

            }
        }

        /**
         * Open udp page in a DOM, new window, self window or dialog.
         * @param {object} config Mandatory page configuration
         * @param {string} config.pageId ID of page to open
         * @param {string|object} [config.params] Page parameters. A string with `${}` wrapped variables or an object.
         * @param {string} config.target Where the page will be displayed. DOM selector or '_dialog','_self','_blank'.
         * @param {string=} config.size Used with "_dialog" target: "lg","sm","md","lg","xl","full"
         * @param {boolean=} config.ignoreMobileView If true it will open page in target regardless mobile browser
         * @param {object=} values Parameter value object to interpolate variable if config.params is a var string.
         * @param {object=} options Optional configs
         * @param {jQuery=} options.current Current element to trigger the page open
         * @param {scope=} options.scope Current scope to trigger the page open
         * @param {boolean=} options.forceReplace Use with selector target. Default is false. True to replace existing content in the selector.
         * @param {string=} options.updateLocation If update browser location (now only work with open in selector). "absUrl" for full URL, "url" for path+search+hash
         * @return {Promise}
         */
        function openPage(config, values, options) {
            // console.log('openPage: config=%o', config);
            var err = validateConfig(config);
            if (err) {
                return $q.reject(err);
            }
            var editMode = widgetUiHelper.isEditMode();
            if (!editMode) {
                var cfg = evalPageConfig(config, values);
                doOpenPage(cfg, options);
            }
            return $q.resolve();

            function validateConfig(config) {
                var errmsg;
                if (!config.pageId) {
                    errmsg = $translate.instant('udp.wc.intx.page.no_page_error');
                    messageService.alertError($translate.instant('udp.wc.intx.page.error'), errmsg);
                    return new Error(errmsg);
                }
                if (!config.target) {
                    errmsg = $translate.instant('udp.wc.intx.page.no_target_error');
                    messageService.alertError($translate.instant('udp.wc.intx.page.error'), errmsg);
                    return new Error(errmsg);
                }
            }

            function doOpenPage(config, options) {
                var pageId = config.pageId,
                    params = config.params,
                    target = config.target,
                    result = config.result,
                    dialog_event = config.dialog_event;
                options = options || {};
                if (!pageId) {
                    return;
                }
                var forceSelf = devel.needMobileView() && config.ignoreMobileView !== true;
                forceSelf = false;
                if (target === '_dialog') {
                    openPageInDialog(config.size || 'xl');
                } else if (target === '_self' || !target) {
                    openPageInSelf();
                } else if (target === '_blank') {
                    if (devel.needMobileView()) {
                        openPageInDialog(config.size || 'xl');
                    } else {
                        openPageInBlank();
                    }
                } else if (!forceSelf) {
                    // console.log('openPageInSelector', {config: config, options: options});
                    openPageInSelector(target, 'child', {
                        forceReplace: options.forceReplace,
                        updateLocation: options.updateLocation
                    });
                } else {
                    throw new Error('Unknown page target "' + target + '"');
                }

                function openPageInDialog(size) {
                    var modalConfig = {
                        templateUrl: 'app/modules/udp/page-view-dialog.html',
                        controller: 'PageViewCtrl',
                        controllerAs: '$ctrl',
                        resolve: {
                            pageId: function () {
                                return pageId;
                            },
                            pageParams: function () {
                                return params;
                            }
                        },
                        backdrop: 'static',//disables modal closing by click on the backdrop
                        size: size,
                        windowClass: 'udp-scrollable-modal'
                    };
                    var modalInstance = modalHelper.openModal(modalConfig, {resizable: true});
                    if (!devel.needMobileView()) {
                        modalInstance.rendered.then(function () {
                            var modal = $('.modal-dialog').eq(0);
                            // console.log('height', modal.height() + 'px');
                            // modal.css('height', modal.height() + 'px');
                            modal.draggable({handle: '.modal-header:eq(0)'})
                                .resizable({
                                    minHeight: 400,
                                    minWidth: 740,
                                    handles: "n, e, s, w"
                                });
                        });
                    }
                    // Merge result data with current page
                    if (result === 'merge' && options.scope) {
                        var pageScope = widgetUiHelper.findPageScope(options.scope);
                        modalInstance.result.then(function (data) {
                            if (data) {
                                _.assign(pageScope.pageParams, data);
                            }
                        });
                    }
                    // Merge result data with current page
                    else if (result === 'trigger' && options.scope) {
                        var pageScope = widgetUiHelper.findPageScope(options.scope);
                        modalInstance.result.then(function (data) {
                            if (data) {
                                fireEvent(dialog_event, options.scope);
                            }
                        });
                    }
                }

                function openPageInBlank() {
                    var url = pageDataUtil.constructUrl(pageId, params, true);
                    window.open(url);
                }


                function openPageInSelf() {
                    var elem = options.current;
                    if (elem) {
                        var modal = elem.closest('.modal:not(.op-applet-window)');
                        if (modal.length > 0) {
                            // This is in a modal
                            openPageInSelector(modal.find('.modal-body'), 'dialog', {forceReplace: true});
                            return;
                        }
                        //LEO@20211216: problem. restrict in udp will prevent state change in applet window mode.
                        var restrictPageInUdp = !true;
                        if (restrictPageInUdp) {
                            var udpPage = elem.closest('udp-page-view');
                            if (udpPage) {
                                openPageInSelector(udpPage, 'normal', {forceReplace: true});
                                return;
                            }
                        }
                    }
                    var url = pageDataUtil.constructUrl(pageId, params);
                    // console.log('openPageInSelf', url);
                    // Use $timeout because most action is called outside angular framework like jquery on click
                    // https://stackoverflow.com/questions/11784656/angularjs-location-not-changing-the-path
                    $timeout(function () {
                        runningState.urlByWidgetInteraction = url;
                        console.log('openPageInSelf: $location.url=%s', url);
                        $location.url(url);
                    });
                }

                /**
                 * Open page in an element
                 * @param {string|jQuery} target Selector for target element to open page
                 * LEO@20211214: strange, if the target is jQuery, the element is invisible. Debug in Chrome console,
                 * it says: "Node cannot be found in the current page"
                 * @param {string} viewMode Page view mode in page controller
                 * @param {{forceReplace:boolean=,updateLocation:string=}=} opts
                 */
                function openPageInSelector(target, viewMode, opts) {
                    // console.log('openPageInSelector', {target: target});
                    opts = opts || {forceReplace: false};
                    var pageScope = getCurrentPageScope();
                    if (!pageScope) {
                        pageScope = $rootScope;
                        console.warn('Cannot find page scope and use rootScope instead. This page probably is not a udp page.');
                    }
                    var childPageScope = pageScope.$new();
                    // 20181214: In CMB DB project. some child pages get params from parent URL.
                    // This is a bad design, since we suggest every page should have its own params.
                    // In some cases, parent page is open as _blank by widget interaction
                    // and child pages can get URL params successfully.
                    // But in mobile app mode, we change all `_blank` target to `dialog`
                    // and parent page in dialog mode does not have its own URL params.
                    // As a result, the child pages cannot get params.
                    // Though getting params from parent URL is a bad design, to be compatible with
                    // existing pages, we pass parent pageParams to child.
                    var pageParams = _.assign({}, pageScope.pageParams, params);
                    var resolvePromise;
                    resolvePromise = $q.when({
                        pageId: pageId,
                        pageParams: pageParams
                    });
                    var config = {
                        templateUrl: 'app/modules/udp/page-view-child.html',
                        controller: 'PageViewCtrl'
                    };
                    var templateAndResolvePromise = $q.all([
                        getTemplatePromise(config),
                        resolvePromise
                    ]);

                    templateAndResolvePromise.then(function (tplAndVars) {
                        var targetElem = findFirstVisibleTargetElement(target), msg;
                        if (!targetElem) {
                            console.error('Cannot find visible target when open page', {
                                pageId: pageId,
                                pageParams: pageParams,
                                target: target,
                                options: options
                            });
                            // 20220105: temp disable the error alert
                            // msg = $translate.instant('udp.wc.intx.page.cannot_find_target_error', {target: target.selector || target});
                            // messageService.alertError($translate.instant('udp.wc.error.config_error'), msg);
                            return;
                        }
                        var ctrlLocals = constructLocals(childPageScope, tplAndVars[1], true);
                        // Initiate controller instance
                        $controller(config.controller, ctrlLocals);
                        var useCache = true;
                        if (useCache) {
                            targetElem.css('display', 'block');
                            var childDivs = targetElem.find('>div.js-cache');
                            var cacheKey = JSON.stringify({p: pageId, param: params});
                            var existing;
                            childDivs.each(function () {
                                var div = $(this);
                                // console.log(div.data('key'));
                                if (div.data('key') === cacheKey) {
                                    existing = div;
                                    existing.show();
                                } else {
                                    div.hide();
                                }
                            });
                            if (!existing) {
                                if (opts.forceReplace === true) {
                                    targetElem.empty();
                                }
                                existing = $('<div class="js-cache"></div>').data('key', cacheKey).appendTo(targetElem);
                                existing.addClass('udp-openpage-container');
                                existing.html($compile(tplAndVars[0])(childPageScope));
                            }
                        } else {
                            targetElem.addClass('udp-openpage-container');
                            // Hide parent float actions and content
                            // 20180806: per CMB request, do not hide previous float actions
                            // elem.closest('.udp-page-view').prev('.udp-float-actions').hide();
                            // 20190124: remove children instead of hide them
                            // targetElem.children().hide();
                            targetElem.empty();
                            targetElem.append($compile(tplAndVars[0])(childPageScope));
                        }
                    }, function (err) {
                        throw err;
                    });

                    /**
                     * Find first visible target element.
                     * @param {string|jQuery} target Target selector
                     * @returns {angular.element|null} Target element or null
                     */
                    function findFirstVisibleTargetElement(target) {
                        var elements;
                        if (viewMode === 'popover') {
                            elements = angular.element('<div class="udp-page-popover"></div>').appendTo('body');
                            //TODO: find popover
                        } else {
                            elements = $(target);
                        }
                        if (elements && elements.length > 0) {
                            var found = false;
                            for (var i = 0; i < elements.length; i++) {
                                var e = elements.eq(i);
                                if (e.is(':visible')) {
                                    found = true;
                                    return e;
                                }
                            }
                            if (!found) {
                                return null;
                            }
                        }
                        return null;
                    }

                    /**
                     * Try finding parent page scope of current widget.
                     * Child page should be created with child scope of parent page,
                     * so widgets in child page can listen to page param change event broadcast in parent page
                     * @returns {*}
                     */
                    function getCurrentPageScope() {
                        // return $rootScope;
                        var providedScope, _scope;
                        if (options.scope) {
                            _scope = options.scope;
                        }
                        if (!_scope) {
                            if (options.current) {
                                _scope = angular.element(options.current).scope();
                            }
                        }
                        if (_scope) {
                            providedScope = widgetUiHelper.findPageScope(_scope);
                        } else {
                            console.log('Cannot find pageScope, use $rootScope');
                            providedScope = $rootScope;
                        }
                        return providedScope;
                    }

                    function getTemplatePromise(options) {
                        return options.template ? $q.when(options.template) :
                            $templateRequest(angular.isFunction(options.templateUrl) ?
                                options.templateUrl() : options.templateUrl);
                    }

                    function constructLocals(scope, resolves, injectable) {
                        var obj = {};
                        obj.$scope = scope;
                        obj.$scope.$resolve = {};
                        angular.forEach(resolves, function (value, key) {
                            // console.log(key, value);
                            if (injectable) {
                                obj[key] = value;
                            }
                            obj.$scope.$resolve[key] = value;
                        });
                        return obj;
                    }
                }
            }
        }

        /**
         * Evaluate variable expressed pageId and params to constant string and object.
         * @param {{pageId:string,params:object|string,target:string}} config Immutable
         * @param {object} values Values for variables
         * @return {object} Evaluated config
         */
        function evalPageConfig(config, values) {
            if (!config) {
                return null;
            }
            var result = angular.copy(config);
            var pageId = config.pageId;
            //TODO: a temp solution to handle when pageId is number
            if (angular.isString(pageId)) {
                result.pageId = dataEx.evalVarExpr(pageId, values);
            }
            result.params = parseParams(config.params, values);
            // console.log('evalPageConfig', config.params, values,result.params);
            return result;
        }


        /**
         * Parse parameters
         * @param {object|string} paramsJson A parameters mapping object with variables or its JSON representation
         * @param {object} values Variable values
         * @returns {object|string}
         */
        function parseParams(paramsJson, values) {
            return dataEx.evalVarJson(paramsJson, values, {toEvalObject: true});
        }
    }
})();
