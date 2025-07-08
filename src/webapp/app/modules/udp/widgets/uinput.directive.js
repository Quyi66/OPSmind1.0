/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/14/2017
 */
(function () {
    'use strict';
    var USE_NGMODEL_CTRL = true;
    var
        CTRL_CHECKBOX = 'checkbox',
        CTRL_DATEPICKER = 'datepicker',
        CTRL_ICONPICKER = 'iconpicker',
        CTRL_FILE = 'file',
        CTRL_HIDDEN = 'hidden',
        CTRL_INPUT = 'input',
        CTRL_PASSWORD = 'password',
        CTRL_RADIO = 'radio',
        CTRL_SELECT = 'select',
        CTRL_SWITCH = 'switch',
        CTRL_TEXT = 'text',
        CTRL_TEXTAREA = 'textarea',
        CTRL_TYPEAHEAD = 'typeahead',
        // CTRL_HOST = 'host',
        CTRL_DEVICE = 'device',
        CTRL_FLOW_LAYOUT = 'flowLayout',
        CTRL_ASSET_SELECTOR = 'assetSelector';

    angular.module('oplus.udp').run(['$timeout', '$translate', 'modalHelper', 'ControlFactory', 'dataEx', 'userPref', 'messageService', 'widgetDataUtil', 'udpModuleConfig', 'widgetUiHelper', 'uinputHelper', 'pageDataUtil', initControls]);

    /**
     *
     * @param $timeout
     * @param $translate
     * @param {modalHelper} modalHelper
     * @param {ControlFactory} ControlFactory
     * @param {dataEx} dataEx
     * @param {userPref} userPref
     * @param {messageService} messageService
     * @param {widgetDataUtil} widgetDataUtil
     * @param {udpModuleConfig} udpModuleConfig
     * @param {widgetUiHelper} widgetUiHelper
     * @param {uinputHelper} uinputHelper
     * @param {pageDataUtil} pageDataUtil
     */
    function initControls($timeout, $translate, modalHelper, ControlFactory, dataEx, userPref, messageService, widgetDataUtil, udpModuleConfig, widgetUiHelper, uinputHelper, pageDataUtil) {
        var attrHelper = new ControlHelper($translate, $timeout, dataEx, messageService, widgetDataUtil);
        //TODO: any other efficient way?
        ControlFactory.register(CTRL_CHECKBOX, checkbox);
        ControlFactory.register(CTRL_DATEPICKER, datepicker);
        ControlFactory.register(CTRL_ICONPICKER, iconpicker);
        ControlFactory.register(CTRL_FILE, file);
        ControlFactory.register(CTRL_HIDDEN, hidden);
        ControlFactory.register(CTRL_INPUT, input);
        ControlFactory.register(CTRL_PASSWORD, password);
        ControlFactory.register(CTRL_RADIO, radio);
        ControlFactory.register(CTRL_SELECT, select);
        ControlFactory.register(CTRL_SWITCH, switchControl);
        ControlFactory.register(CTRL_TEXT, text);
        ControlFactory.register(CTRL_TEXTAREA, textarea);
        ControlFactory.register(CTRL_TYPEAHEAD, typeahead);
        // ControlFactory.register(CTRL_HOST, host);
        ControlFactory.register(CTRL_DEVICE, device);
        ControlFactory.register(CTRL_FLOW_LAYOUT, flowLayout);
        ControlFactory.register(CTRL_ASSET_SELECTOR, assetSelector);

        function input() {
            this.templateHtml = function (attrs) {
                var html, useTagInput = false;
                // if (attrs.datatype === dataEx.datatypes.JSON) {
                //     html = '<udp-data-converter the-model="ctrlValue" options="{kinds:\'json\'}"></udp-data-converter>';
                // } else
                if (attrs.datatype === dataEx.datatypes.ARRAY && useTagInput) {
                    html = '<ul class="list list-inline"><li ng-repeat="item in theModel track by $index"><span class="badge bg-secondary">{{item}}</span> </li></ul>';
                } else {
                    // var restricted = udpModuleConfig.restrictedMode && (attrs.isrestricted === true || attrs.isrestricted === 'true');
                    var restricted = attrs.isrestricted === true || attrs.isrestricted === 'true';
                    // console.log('input',attrs.datatype,JSON.stringify(attrs));
                    html = '<input '
                        + ' class="form-control" type="' + (restricted ? 'password' : (attrs.datatype || 'text')) + '"'
                        + attrHelper.attrNgModel(attrs, 'ctrlValue')
                        + attrHelper.attrAccessKey(attrs)
                        + attrHelper.attrStyle(attrs)
                        + attrHelper.attrCommon(attrs)
                        + attrHelper.attrTooltip(attrs)
                        // + attrPlaceholder(attrs)
                        + '>';
                }
                return attrHelper.wrapWithLabel(attrs, html);
            };
            this.controller = function (scope, attrs) {
            };
            this.dataConfig = {
                ctrlDatatype: function (attrs) {
                    if (attrs.datatype === dataEx.datatypes.JSON) {
                        return dataEx.datatypes.STRING;
                    }
                }
            }
        }

        function password() {
            this.templateHtml = function (attrs) {
                var html = '<input '
                    + ' class="form-control" type="password"'
                    + attrHelper.attrNgModel(attrs, 'ctrlValue')
                    + attrHelper.attrAccessKey(attrs)
                    + attrHelper.attrStyle(attrs)
                    + attrHelper.attrCommon(attrs)
                    + attrHelper.attrTooltip(attrs)
                    + '>';
                return attrHelper.wrapWithLabel(attrs, html);
            };
            this.controller = function (scope, attrs) {
            }
        }

        function device() {
            this.templateHtml = function (attrs) {
                var selector = attrs.ismultiple === 'true' ? 'multiple' : 'single';
                var html;
                var viewAs = attrs.viewas || 'dropdown';
                html = '<acm-device-selector the-model="ctrlValue" view-as="' + viewAs + ' " ci-types="assetType"  mcheck-type="mcheckType" class="w-100"></acm-device-selector>';
                return attrHelper.wrapWithLabel(attrs, html);
            };

            this.controller = function (scope, attrs) {
                scope.ctrlValue = scope.ctrlValue || [];
                scope._currentMode = 'group';
                var values = _.merge({}, pageDataUtil.getPageScopeValues(scope));
                var evaluated = dataEx.evalVarExpr(attrs.devicetype, values);
                if (evaluated && angular.isFunction(evaluated.then)) {
                    evaluated.then(function (result) {
                        scope.assetType = result;
                    }).catch(function (err) {
                        throw err;
                    });
                } else {
                    scope.assetType = evaluated;
                }
                // console.log('device.controller', attrs.devicetype, scope.assetType);
                // scope.mcheckType = 'jsonarray';
            };

            this.dataConfig = {
                ctrlDatatype: dataEx.datatypes.ARRAY
            }
        }

        function flowLayout() {
            this.templateHtml = function (attrs) {
                var selector = attrs.ismultiple === 'true' ? 'multiple' : 'single';
                var html;
                var viewAs = attrs.viewas || 'dropdown';
                html = '<flow-layout the-model="ctrlValue" view-as="' + viewAs + ' " ci-types="assetType"  mcheck-type="mcheckType" class="w-100"></flow-layout>';
                return attrHelper.wrapWithLabel(attrs, html);
            };

            this.controller = function (scope, attrs) {
                scope.ctrlValue = scope.ctrlValue || [];
                scope._currentMode = 'group';
                var values = _.merge({}, pageDataUtil.getPageScopeValues(scope));
                var evaluated = dataEx.evalVarExpr(attrs.devicetype, values);
                if (evaluated && angular.isFunction(evaluated.then)) {
                    evaluated.then(function (result) {
                        scope.assetType = result;
                    }).catch(function (err) {
                        throw err;
                    });
                } else {
                    scope.assetType = evaluated;
                }

            };

            this.dataConfig = {
                ctrlDatatype: dataEx.datatypes.ARRAY
            }
        }

        function assetSelector() {
            this.templateHtml = function (attrs) {
                return attrHelper.wrapWithLabel(attrs, '<acm-device-selector the-model="ctrlValue" ci-types="\'[auto]\'" mcheck-type="\'map\'"></acm-device-selector>');
            };
            this.controller = function (scope, attrs) {
            };
        }

        function text() {
            this.templateHtml = function (attrs) {
                var html;
                if (widgetUiHelper.isEditMode()) {
                    html = '<span class=""' + attrHelper.attrTooltip(attrs) + '>' + $translate.instant('udp.uinput.text_placeholder') + '</span>';
                } else {
                    // html = '<input type="text" ng-model="ctrlValue"><span class=""' + attrHelper.attrTooltip(attrs) + '>{{ctrlValue}}</span>';
                    html = '<span class=""' + attrHelper.attrTooltip(attrs) + '>{{ctrlValue}}</span>';
                }
                return attrHelper.wrapWithLabel(attrs, html);
            };
        }

        function textarea() {
            this.templateHtml = function (attrs) {
                var html, useTagInput = false;
                if (attrs.datatype === dataEx.datatypes.ARRAY && useTagInput) {
                    html = '<ul class="list list-inline"><li ng-repeat="item in theModel track by $index"><span class="badge bg-secondary">{{item}}</span> </li></ul>';
                } else {
                    if (attrs.viewas === 'inputbtn') {
                        html = '<div class="input-group" ' + attrHelper.attrStyle(attrs) + '>'
                            + '<span class="form-control text-nowrap text-ellipsis" '
                            // + attrHelper.attrNgModel(attrs, 'ctrlValue')
                            // + attrHelper.attrAccessKey(attrs)
                            + attrHelper.attrCommon(attrs)
                            + attrHelper.attrTooltip(attrs)
                            + '>{{ctrlValue}}</span>'
                            + '<div class="input-group-append">'
                            + '<button class="btn btn-outline-default" ng-click="popup()"><i class="far fa-comment-alt-edit"></i></button>'
                            + '</div>'
                            + '</div>';
                    } else {
                        html = '<textarea '
                            + ' class="form-control" '
                            + (attrs.rows ? ' rows="' + attrs.rows + '" ' : ' ')
                            + attrHelper.attrNgModel(attrs, 'ctrlValue')
                            + attrHelper.attrAccessKey(attrs)
                            + attrHelper.attrStyle(attrs)
                            + attrHelper.attrCommon(attrs)
                            + attrHelper.attrTooltip(attrs)
                            // + attrPlaceholder(attrs)
                            + '></textarea>';
                    }
                }
                return attrHelper.wrapWithLabel(attrs, html);
            };

            this.controller = function (scope, attrs) {
                if (attrs.viewas === 'inputbtn') {
                    scope.popup = function () {
                        var modal = modalHelper.openModal({
                            template: '<div class="modal-header"></div>' +
                                '<div class="modal-body">' +
                                '<textarea class="form-control h-100" rows="10" ng-model="$ctrl.editContent"></textarea></div>' +
                                '<div class="modal-footer">' +
                                '<button type="button" class="btn btn-primary opx-btn-ok" ng-click="$ctrl.ok()">' + $translate.instant('common.action.ok') + '</button> ' +
                                '<button type="button" class="btn btn-default opx-btn-cancel" ng-click="$ctrl.cancel()">' + $translate.instant('common.action.cancel') + '</button> ' +
                                '</div>',
                            controller: [function () {
                                var that = this;
                                this.editContent = angular.copy(scope['ctrlValue']);
                                this.ok = function () {
                                    modal.close(that.editContent);
                                };
                                this.cancel = function () {
                                    modal.dismiss();
                                }
                            }],
                            backdrop: 'static',
                            controllerAs: '$ctrl',
                            size: 'md'
                        }, {
                            onOk: function (data) {
                                scope['ctrlValue'] = data;
                            }
                        });
                    }
                }
            };
            this.dataConfig = {
                ctrlDatatype: dataEx.datatypes.STRING
            }
        }

        function typeahead() {
            this.templateHtml = function (attrs) {
                attrs._modeloptions = undefined;
                var main =
                    '<input type="text" ${accessKey} ${attrCommon}' +
                    ' class="form-control" ng-model="ctrlValue" ' +
                    ' uib-typeahead="opt.value as opt.label for opt in getTaOptions($viewValue) | safefilter:$viewValue"' +
                    // 20200911: Array not well supported
                    // ' uib-typeahead="opt[0] as opt[1] for opt in getTaOptions($viewValue) | filter:$viewValue"' +
                    ' typeahead-wait-ms="500"' +
                    ' typeahead-on-select="selectTaItem($item,$model,$label,$event)"' +
                    ' typeahead-loading="taLoading"' +
                    ' typeahead-select-on-blur="true"' +
                    '>';
                main = dataEx.evalVarStr(main, {
                    accessKey: attrHelper.attrAccessKey(attrs),
                    attrCommon: attrHelper.attrCommon(attrs)
                });
                // options = JSON.parse(attrs.options || '{}');
                // options.history = true;
                // if (options.history) {
                var spinner = '<i class="fa fa-spinner fa-spin" ng-if="taLoading" style="position: absolute; top: 10px; display: block; color: #ccc; z-index: 29; right: 50px;"></i>';
                var html = '<div class="input-group" ${style}>${spinner} ${main}' +
                    '<div class="input-group-append">' +
                    '<button type="button" class="btn btn-outline-default dropdown-toggle opx-btn-icon" data-bs-toggle="dropdown" ng-click="toggleTypeahead()"><i class="fa fa-angle-down"></i></button>' +
                    '<div class="dropdown-menu dropdown-menu-end" style="max-height:480px;overflow-y:auto">' +
                    '<div class="dropdown-item" ng-repeat="item in tahistory track by $index">' +
                    '<a><i ng-class="item.star?\'fa fa-star text-primary\':\'far fa-star text-muted\'" ng-click="starTaItem(item)"></i> <span ng-click="selectTaHistoryItem(item)">{{item.label}}</span></a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                // }
                html = dataEx.evalVarStr(html, {
                    main: main,
                    spinner: spinner,
                    style: attrHelper.attrStyle(attrs)
                });
                return attrHelper.wrapWithLabel(attrs, html);
            };
            this.controller = function (scope, attrs) {
                userPref.load();
                initTypeahead();

                function initTypeahead() {
                    var options = JSON.parse(attrs.options || '{}');
                    options.history = true;
                    var controlId = options.refid;
                    var userPrefKey = 'udp.tahistory';
                    scope.selectTaHistoryItem = selectTaHistoryItem;
                    scope.starTaItem = starTaItem;
                    scope.selectTaItem = selectTaItem;
                    scope.getTaOptions = getTaOptions;
                    loadTaHistory();

                    function getTaOptions(input) {
                        var extra = {'_query_': input};
                        var itemList = attrHelper.initItemList(scope, {
                            objKeys: ['value', 'label'],
                            extraValues: extra
                        });
                        return itemList;
                    }

                    function selectTaItem(item, model, label, event) {
                        scope.theModel = model;
                        if (options.history) {
                            addTaHistory(item);
                        }
                    }

                    function starTaItem(item) {
                        item.star = !item.star;
                        saveTaHistory();
                    }

                    function selectTaHistoryItem(item) {
                        scope.theModel = item.value;
                        addTaHistory(item);
                    }

                    function loadTaHistory() {
                        var all = userPref.readItem(userPrefKey, {});
                        scope.tahistory = all[controlId] || [];
                    }

                    function saveTaHistory() {
                        var all = userPref.readItem(userPrefKey, {});
                        all[controlId] = scope.tahistory;
                        userPref.saveItem(userPrefKey, all);
                    }

                    /**
                     *
                     * @param {{label:string, value:string}} selected
                     */
                    function addTaHistory(selected) {
                        _.remove(scope.tahistory, function (o) {
                            return o.value === selected.value;
                        });
                        scope.tahistory.unshift(selected);
                        saveTaHistory();
                    }
                }
            }
        }

        function hidden() {
            this.templateHtml = function hiddenTpl(attrs) {
                if (widgetUiHelper.isEditMode()) {
                    return attrHelper.wrapWithLabel(attrs, '<span><i class="fa"></i> ' + $translate.instant('udp.uinput.hidden.placeholder') + '</span>');
                }
                return '<input ' + attrHelper.attrNgModel(attrs) +
                    ' class="form-control" ' + 'type="hidden"' +
                    attrHelper.attrTooltip(attrs) + attrHelper.attrPlaceholder(attrs) + '>';
            }
        }

        function checkbox() {
            this.templateHtml = function (attrs) {
                var html;
                attrs._modeloptions = undefined;
                var layout = attrs.layout;
                var css = 'checkbox-inline';
                if (layout && layout.indexOf('even-') > -1) {
                    css = 'col-' + layout;
                }
                if (USE_NGMODEL_CTRL) {
                    html = '<op-smart-select ng-model="ctrlValue" the-items="itemList"></op-smart-select>';
                } else {
                    //TODO: not work because it does not use ng-model!!
                    html =
                        '<div class="row no-gutters">' +
                        '<div class="checkbox ${css}" ng-repeat="item in itemList track by $index">' +
                        '<input type="checkbox" multiple checkbox-model="ctrlValue" checkbox-value="item[0]" ${attrCommon}' +
                        ' id="${idPrefix}-{{$index}}"><label for="${idPrefix}-{{$index}}" ng-bind-html="item[1]"></label>' +
                        '</div>' +
                        '</div>';
                    html = dataEx.evalVarStr(html, {
                        css: css,
                        idPrefix: _.uniqueId(Date.now() + '-'),
                        attrCommon: attrHelper.attrCommon(attrs)
                    });
                }
                return attrHelper.wrapWithLabel(attrs, html);
            };
            this.controller = function (scope, attrs) {
                // attrHelper.initItemList(scope);
                scope.ctrlValue = scope.ctrlValue || [];
            };
            this.dataConfig = {
                allowedDatatypes: [dataEx.datatypes.ARRAY, dataEx.datatypes.DSV],
                ctrlDatatype: dataEx.datatypes.ARRAY,
                initSourceDef: function (scope) {
                    attrHelper.initItemList(scope);
                }
            }
        }

        function select() {
            var that = this;
            this.templateHtml = function (attrs) {
                var html = '<select op-select="${op-select}" class="form-select"' +
                    ' ng-options="item.value as item.label for item in itemList"' +
                    ' ${common} ${multiple}></select>';
                // 20200905: Important: {updateOn:"blur"} will make chosen not work
                attrs._modeloptions = undefined;
                html = dataEx.evalVarStr(html, {
                    common: attrHelper.commonAttrs(attrs),
                    multiple: attrs.ismultiple === 'true' ? 'multiple' : '',
                    'op-select': attrs.istags === 'true' ? '{tags: true}' : ''
                });
                html = attrHelper.wrapWithLabel(attrs, html);
                return html;
            };
            this.controller = function (scope, attrs) {
                // console.log('select.controller()....', scope.control, scope.sourcedef, JSON.stringify(scope.ismultiple), JSON.stringify(attrs.ismultiple));
                // scope.$watch('sourcedef', function (newVal, oldVal) {
                //     if (newVal) {
                //         that.dataConfig.initSourceDef(scope);
                //     }
                // });
            };
            this.dataConfig = {
                ctrlDatatype: function (attrs) {
                    if (attrs.ismultiple === 'true') return dataEx.datatypes.ARRAY;
                },
                initSourceDef: function (scope) {
                    attrHelper.initItemList(scope, {objKeys: ['value', 'label']});
                }
            };
        }

        function radio() {
            this.templateHtml = function (attrs) {
                var html;
                attrs._modeloptions = undefined;
                // Use $parent.ctrlValue because ng-repeat creates its own scope
                //https://stackoverflow.com/questions/18594196/ng-model-not-working-for-radio-button-in-angularjs
                html = '<div class="radio radio-inline" ng-repeat="val in itemList track by $index">' +
                    '<input type="radio" id="${idPrefix}-{{$index}}" name="${name}" ' +
                    ' ${attrCommon} ${ngmodel} ng-value="val[0]"><label for="${idPrefix}-{{$index}}">{{val[1]}}</label></div>';
                html = dataEx.evalVarStr(html, {
                    idPrefix: Date.now(),
                    ngmodel: attrHelper.attrNgModel(attrs, '$parent.ctrlValue'),
                    name: (attrs.name || 'noname'),
                    attrCommon: attrHelper.attrCommon(attrs)
                });
                return attrHelper.wrapWithLabel(attrs, html);
            };
            this.controller = function (scope, attrs) {
                // scope.$watch('sourcedef', function (newVal, oldVal) {
                //     if (newVal) {
                //         attrHelper.initItemList(scope);
                //     }
                // });
            };
            this.dataConfig = {
                initSourceDef: function (scope) {
                    attrHelper.initItemList(scope);
                }
            };
        }

        function file() {
            this.templateHtml = function (attrs) {
                return '<label class="btn btn-outline-primary">' +
                    '<input type="file" name="' + (attrs.name || 'file') + '" style="display: none" ngf-select ng-model="theModel">'
                    + $translate.instant('udp.uinput.file.button_label')
                    + '</label> '
                    + '<strong>{{theModel.name}}</strong>\n'
                    + '';
                var html = '<input '
                    + ' class="form-control" type="file"'
                    + attrHelper.attrNgModel(attrs, 'ctrlValue')
                    + attrHelper.attrAccessKey(attrs)
                    + attrHelper.attrStyle(attrs)
                    + attrHelper.attrCommon(attrs)
                    + attrHelper.attrTooltip(attrs)
                    // + attrPlaceholder(attrs)
                    + '>';
                return html;
            }
        }

        function switchControl() {
            this.templateHtml = function (attrs) {
                var content = '<label class="i-switch bg-info m-t-xs m-r">\n' +
                    '<input type="checkbox" ${common} ' + attrHelper.attrNgModel(attrs) + ' >' +
                    '<i></i>' +
                    '</label>';
                
                content = dataEx.evalVarStr(content, {
                    common: attrHelper.attrCommon(attrs),
                });
                
                return attrHelper.wrapWithLabel(attrs, content);
            };
        }

        function datepicker() {
            this.templateHtml = function (attrs) {
                var formatter = momentToDpFormatter(attrs.formatter || 'YYYY-MM-DD HH:mm:ss');
                // NOTE: do not use datepicker-append-to-body="true", it will be hidden by modal
                var content = '<span class="input-group op-datepicker" ${tooltip} ${style}>' +
                    '<input ${ngmodel} ${common} class="form-control" ' +
                    //20200914: append-to-body=true to avoid expand in modal
                    'uib-datepicker-popup="${format}" datepicker-append-to-body="true"  ' +
                    'datepicker-options="{showWeeks:false, showSecond: true，timePicker: true, timePicker24Hour:true}" is-open="popup1.opened" ' +
                    'clear-text="' + $translate.instant('common.action.cancel') +
                    '" current-text="' + $translate.instant('common.datetime.today') +
                    '" close-text="' + $translate.instant('common.action.close') + '" />' +
                    '<span class="input-group-append">' +
                    '<button type="button" class="btn btn-outline-default opx-btn-icon" ng-click="popup1.opened=!popup1.opened"><i class="fa fa-calendar-alt"></i></button>' +
                    '</span>' +
                    '</span>';
                content = '<input ${ngmodel} ${common} class="form-control" type="date">';
                if (attrs.formatter && attrs.formatter === 'YYYY-MM-DD HH:mm:ss') {
                    content = '<input ${ngmodel} ${common} class="form-control" type="datetime-local" step="1">';
                }
                content = dataEx.evalVarStr(content, {
                    style: attrHelper.attrStyle(attrs),
                    tooltip: attrHelper.attrTooltip(attrs),
                    format: momentToDpFormatter(attrs.formatter || 'YYYY-MM-DD HH:mm:ss'),
                    common: attrHelper.attrCommon(attrs),
                    ngmodel: attrHelper.attrNgModel(attrs, 'ctrlValue')
                });
                console.log("html: ", attrHelper.wrapWithLabel(attrs, content));
                return attrHelper.wrapWithLabel(attrs, content);

                function momentToDpFormatter(formatter) {
                    var mapping = {'YYYY-MM-DD HH:mm:ss': 'yyyy-MM-dd HH:mm:ss', 'YYYY-MM-DD': 'yyyy-MM-dd'};
                    return mapping[formatter] || formatter;
                }
            };
            this.controller = function (scope, attrs) {
                console.log("attrs ; ", attrs);
            };
        }

        function iconpicker() {
            this.templateHtml = function (attrs) {

                var content = '' +
                '<div class="input-group op-iconpicker" ${tooltip} ${style}>' +
                    '<op-iconpicker ${ngmodel} ${common}></op-iconpicker> ' +
                    // '<button type="button" class="btn btn-default" ng-click="ctrlValue=undefined" title="Clear the icon">' +
                    //     '<i class="far fa-trash-alt"></i>' +
                    // '</button>' +
                '</div>';

                content = dataEx.evalVarStr(content, {
                    style: attrHelper.attrStyle(attrs),
                    tooltip: attrHelper.attrTooltip(attrs),
                    common: attrHelper.attrCommon(attrs),
                    ngmodel: attrHelper.attrNgModel(attrs, 'ctrlValue')
                });
                console.log("html: ", attrHelper.wrapWithLabel(attrs, content));
                return attrHelper.wrapWithLabel(attrs, content);
            };
            this.controller = function (scope, attrs) {
                console.log("attrs ; ", attrs);
            };
        }
    }

    /**
     * Helper for common control operations.
     * @param $translate
     * @param $timeout
     * @param {dataEx} dataEx
     * @param {messageService} messageService
     * @param {widgetDataUtil} widgetDataUtil
     * @constructor
     */
    function ControlHelper($translate, $timeout, dataEx, messageService, widgetDataUtil) {
        this.attrCommon = attrCommon;
        this.attrAccessKey = attrAccessKey;
        this.attrNgModel = attrNgModel;
        this.attrTooltip = attrTooltip;
        this.attrPlaceholder = attrPlaceholder;
        this.attrStyle = attrStyle;
        this.wrapWithLabel = wrapWithLabel;
        this.initItemList = initItemList;
        this.commonAttrs = commonAttrs;

        function commonAttrs(attrs) {
            return attrNgModel(attrs) + attrAccessKey(attrs) +
                attrTooltip(attrs) + attrCommon(attrs) + attrStyle(attrs);
        }

        function wrapWithLabel(attrs, content, scope) {
            if (attrs.$controlonly) {
                return content;
            }
            if (scope) {
                return content;
            }
            var showLabel = attrs.label && attrs.showlabel === 'true';
            var showDesc = attrs.desc && attrs.showdesc === 'true';
            var html = '<div class="form-control-wrapper">' + content +
                (showDesc ? ('<p class="help-block">' + attrs.desc + '</p>') : '') +
                '</div>';
            if (showLabel) {
                html = '<label class="control-label">' + (attrs.label || '') + '</label>' + html;
                // html = html + '<label class="control-label">' + (attrs.label || '') + '</label>';
            }
            return html;
        }

        function attrCommon(attrs) {
            var html = '';
            if (attrs.readonly &&
                ((typeof attrs.readonly === 'boolean' && attrs.readonly) ||
                 (typeof attrs.readonly === 'string' && (attrs.readonly === 'true' || attrs.readonly === 'readonly')))) {
                html += ' ng-disabled="true" ';
            }

            if (attrs._required &&
                ((typeof attrs._required === 'boolean' && attrs._required) ||
                 (typeof attrs._required === 'string' && attrs._required === 'true'))) {
                html += ' required '
            }
            return html;
        }

        function attrAccessKey(attrs) {
            if (attrs.accesskey)
                return ' accesskey="' + attrs.accesskey + '"';
            return '';
        }

        function attrNgModel(attrs, modelName) {
            var name = modelName || 'ctrlValue';
            // NOTE: use the same name defined in directive scope
            // https://stackoverflow.com/questions/27797316/create-custom-input-directive-in-angular
            var str = ' ng-model="' + name + '" ';
            if (attrs['_modeloptions']) {
                str += ' ng-model-options=\'' + attrs['_modeloptions'] + '\' ';
            }
            return str;
        }

        function attrTooltip(attrs) {
            // if (!attrs.tooltip) {
            //     return '';
            // }
            var text = '';
            if (attrs.label) {
                text = attrs.label;
            }
            if (attrs.name) {
                text += ' (' + attrs.name + ' ' + (attrs.datatype || '') + ')';
            }
            if (text) {
                // return ' title="' + text + '" ';
                return ' title="' + text + '" ';
            }
            return '';
        }

        function attrPlaceholder(attrs) {
            return ' placeholder="' + _.escape(attrs.label || attrs.name || '') + '"';
        }

        function attrStyle(attrs) {
            if (attrs.width) {
                var w = parseInt(attrs.width);
                if (w) {
                    return ' style="width:' + w + 'em" ';
                }
            }
            return '';
        }

        /**
         * Initialize item list for selectable control like select, checkbox, typeahead.
         * This method will change `scope.itemList` which is a list of array `[string,string]`
         * or a list of object `{label:string, value:string}`
         * @param scope
         * @param {string} scope.sourcedef Definition for source of item list
         * @param {[]} scope.itemList Result item list
         * @param {string} scope.errorMessage
         * @param {object=} options
         * @param {object=} options.extraValues Extra values for evaluation
         * @param {[string]=} options.objKeys Array with 2 elements. If specified, each entry of the item list is an object.
         * objKeys[0] used as key for item value.
         * objKeys[1] used as key for item label.
         * @returns {promise.<scope.itemList>|scope.itemList|[]}
         */
        function initItemList(scope, options) {
            options = options || {};
            // var listExpr = attrs.sourcedef;
            var listExpr = scope.sourcedef;
            if (!listExpr) return [];
            var values = _.merge({}, widgetDataUtil.getPageScopeValues(scope), options.extraValues);
            var result = dataEx.evalVarExpr(listExpr, values);
            // console.log('initItemList', {sourcedef: listExpr, options: options, result: result});
            if (!result) return [];
            // LEO@20180401: Use `scope.itemList=[]` will cause select control flicking
            // because there is delay between the promise;
            scope.itemList = scope.itemList || [];
            scope.errorMessage = undefined;
            //TODO: make a utility like outil.isPromise(result)
            if (angular.isFunction(result.then)) {
                // This is a promise
                return result.then(function (data) {
                    if (angular.isArray(data)) {
                        scope.itemList = toResult(data);
                    } else {
                        // console.warn('Promise result should be array ' + strFn);
                        messageService.alertWarning($translate.instant('common.term.error'), $translate.instant('udp.uinput.error.dropdown_source_must_be_array', {expr: listExpr}));
                        scope.itemList = [];//toResult([['', data + '']]);
                    }
                    return scope.itemList;
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant('udp.uinput.error.dropdown_cannot_get_data'), err.message);
                })
            } else if (angular.isArray(result)) {
                if (angular.isArray(result[0])) {
                    // This is a 2D array, i.e. each element in the result is also an array
                    scope.itemList = toResult(result);
                } else {
                    // This is a 1D array
                    scope.itemList = _.map(result, function (o) {
                        return toResult([o, o]);
                    });
                }
            } else {
                console.warn('Unsupported result type for select control. Only support `promise.Array` or `Array`. Current result is `' + result + '`');
                scope.itemList = toResult([['', result]]);
            }
            return scope.itemList;

            function toResult(listOfArray) {
                var objKeys = options.objKeys;
                if (angular.isArray(objKeys) && objKeys.length === 2) {
                    var result = [];
                    listOfArray.forEach(function (arr) {
                        var obj = {};
                        obj[objKeys[0]] = arr[0];
                        obj[objKeys[1]] = arr[1];
                        result.push(obj);
                    });
                    return result;
                }
                return listOfArray;
            }
        }
    }

    angular.module('oplus.udp').directive('udpInput', inputDirective);

    /**
     * @ngdoc directive
     * @name udpInput
     * @description
     * Universal input control like text input, select, datepicker.
     * It will create an isolated scope.
     *
     * ```html
     * <udp-input ng-model="string"
     *            the-config="object"
     *            control="string" datatype="string"
     *            formatter="string" formatdsv="string"
     *            name="string" label="string" showlabel="boolean" desc="string" showdesc="boolean'
     *            initval="string" sourcedef="string"
     *            ismultiple="" isrestricted=""
     *            layout="" viewas="" width=""
     *            readonly="boolean"
     *            options="object" _modeloptions="">
     * </udp-input>
     * ```
     * ============= Properties for basic ===============
     * @param {string} ngModel         Two-way binding of model data
     * @param {object=} theConfig      This is an optional combination configuration of attributes.
     * @param {string} name            Input data name.
     * @param {string} label           Text shown as control label
     * @param {boolean} showlabel      If show control label
     * @param {string} desc            Text shown as help text
     * @param {boolean} showdesc       If show control help text
     * ============= Properties for data and control ===============
     * @param {string} control         HTML control used for data input, `hidden`, `text`, `input`, `textarea`,`datepicker`.
     * @param {string} datatype        Data type like `number`, `date`, `string`, 'dsv', default is `string`.
     * @param {string} initval         Initial (default) value.
     * @param {string} sourcedef       The items for selectable control like select, checkbox/radio, typeahead. TODO: change to validvals?
     * @param {string} formatter       How the data display, for date like 'yyyy-MM-dd'
     * @param {string} formatdsv       Delimiter for dsv: 'comma','space', when format is 'dsv'
     * @param {boolean} ismultiple     Allow multiple selection, applied to device, select
     * @param {boolean} isrestricted   Hide secret information
     * ---- Control Specific
     * @param {string} devicetype      Limit device types in device selector
     * @param {string} options         Options for specific control type TODO: rename
     * ---- Appearance
     * @param {string} layout          TODO: Only for radio and checkbox, how many items displayed per row
     * @param {string} viewas          View mode
     * @param {string} width           Width of the control (in em)
     * @param {string} readonly        Read only
     * ============= Properties for interaction ===============
     * @param {string} eventtorefresh  Event listened to refresh data. Deprecated: use `etosource` and `etovalue`
     * @param {string} etosource       Event listened to refresh sourcedef
     * @param {string} etovalue        Event listened to refresh value
     * @param {string} eventbychange   Event triggered on value change. TODO: not used?
     * @param {string} _modeloptions   Model options (not configurable)
     * @param {boolean} _required      If required (not configurable*
     *
     * Logic
     * -------
     *
     * Model initialization
     *
     * 1. if model value is assigned, use this value as model
     * 2. if `initval` is defined, try evaluation of `initval`
     *    1). when succeeds, assign the evaluation result as model
     *    2). when fails, evaluation result is `undefined` and keep model as `undefined`
     * 3. a input with defined `name` keeps listening on `PageParamsChanged`,
     *    1). if param name is same as input name, use the param value as model
     *    2). if model is `undefined`, try evaluation of `initval`
     *    3). if input is select and its options is `undefined`, try evaluation of select options
     *    4). do nothing for other conditions
     *
     * @param {string} ngModel
     * @param {string} control
     * @param {object} theConfig A complete config object contains all attributes like format, desc, label, initval...
     * @see InputControlAttrsRef
     */
    inputDirective.$inject = ['$translate', '$compile', '$timeout', '$q', '$http', 'widgetUiHelper', 'widgetValues', 'dataEx', 'messageService',
        'widgetDataUtil', 'pageDataUtil', 'udpModuleConfig', 'ControlFactory', 'uinputHelper'];

    /**
     *
     * @param $compile
     * @param $timeout
     * @param $q
     * @param $http
     * @param {widgetUiHelper} widgetUiHelper
     * @param {widgetValues} widgetValues
     * @param {dataEx} dataEx
     * @param {messageService} messageService
     * @param {widgetDataUtil} widgetDataUtil
     * @param {pageDataUtil} pageDataUtil
     * @param {udpModuleConfig} udpModuleConfig
     * @param {ControlFactory} ControlFactory
     * @param {uinputHelper} uinputHelper
     */
    function inputDirective($translate, $compile, $timeout, $q, $http, widgetUiHelper, widgetValues, dataEx, messageService,
                            widgetDataUtil, pageDataUtil, udpModuleConfig, ControlFactory, uinputHelper) {
        return {
            restrict: 'E',
            require: '?ngModel',
            //TODO: define all attrs here
            scope: {
                theModel: '=ngModel',
                theConfig: '<',
                control: '@',
                sourcedef: '@',
                ismultiple: '@'
            },
            controller: ['$scope', '$element', '$attrs', InputControlCtrl],
            // controller executed before pre and post link
            link: linkFn
        };

        function needDebug(attrs) {
            return false;
            // return attrs.control === 'device' && attrs.name === 'devices_str';
            // return attrs.control === 'select';
            // return attrs.name === 'date_1monlater_string';
            // return attrs.name === 'date_initFromDsAndCalc';
            // return attrs.name === 'date_monthForNav';
        }


        /**
         *
         * @param scope
         * @param {jQuery} elem
         * @param {InputControlAttrsRef} attrs
         * @param ngModelCtrl
         *
         */
        function linkFn(scope, elem, attrs, ngModelCtrl) {
            // if (scope.theConfig) {
            //     Object.keys(scope.theConfig).forEach(function (key) {
            //         if (!attrs[key])
            //             attrs[key] = scope.theConfig[key];
            //     });
            // }
            uinputHelper.upgrade(scope, attrs);
            if (needDebug(attrs)) {
                console.log('linkFn');
            }
            var datatype = attrs.datatype;
            scope.$watch('control', function (newVal, oldVal) {
                if (needDebug(attrs)) {
                    console.log('watch:attrs.control', {newVal: newVal, oldVal: oldVal});
                }
                var template = templateFactory(elem, attrs);
                // elem.replaceWith($compile(template)(scope));
                elem.empty().html($compile(template)(scope));
                elem.removeClassMatch(/uinput-control-.*/).addClass('uinput-control-' + newVal);
            });

            // Initial model value may come from page scope parameters
            if (USE_NGMODEL_CTRL) {

                // Determine datatype of ctrlValue
                var ctrlDatatype;
                var dataConfig = ngModelCtrl.controlDef.dataConfig || {};
                if (dataConfig.ctrlDatatype) {
                    if (angular.isFunction(dataConfig.ctrlDatatype)) {
                        ctrlDatatype = dataConfig.ctrlDatatype(attrs);
                    } else {
                        ctrlDatatype = dataConfig.ctrlDatatype;
                    }
                }
                ctrlDatatype = ctrlDatatype || attrs.datatype;


                // ngModel --> $modelValue --> Formatters --> $viewValue --> $render()
                // Widget --> $viewValue --> Parsers --> $modelValue --> ngModel.
                ngModelCtrl.$parsers.push(function parseInput(value) {
                    if (needDebug(attrs)) {
                        console.log('$parsers.parseInput', {targetDatatype: attrs.datatype});
                    }

                    return transData(value, attrs.datatype, attrs);
                });

                if (ctrlDatatype) {
                    ngModelCtrl.$formatters.push(function formatOutput(value) {
                        if (needDebug(attrs)) {
                            console.log('$formatters.formatOutput', {ctrlDatatype: ctrlDatatype});
                        }
                        return transData(value, ctrlDatatype, attrs);
                    });
                }
                ngModelCtrl.$render = function () {
                    if (needDebug(attrs)) {
                        console.log('$render');
                    }
                    scope.ctrlValue = ngModelCtrl.$viewValue;
                }
                scope.$watch('ctrlValue', function (newVal, oldVal) {
                    if (needDebug(attrs)) {
                        console.log('watch:ctrlValue', {newVal: newVal, oldVal: oldVal});
                    }
                    ngModelCtrl.$setViewValue(newVal);
                });
                if (needDebug(attrs)) {
                    console.log('evaluateModelValue with initval');
                }
                assignModelValue(scope.theModel);
            } else {
                assignModelValue(scope.theModel);
                if (!ngModelCtrl.noCtrlToModel) {
                    convertCtrlToModel();
                }
            }
            onDataRefresh();

            function onDataRefresh() {
                if (attrs.name) {
                    // Listen to PageParamChanged if name specified
                    scope.$on(widgetValues.events.PageParamChanged, onPageParamChange);
                }
                if (attrs.eventtorefresh || attrs.etovalue || attrs.etosource) {
                    // Listen to refresh event
                    scope.$on(widgetValues.events.WidgetEvent, onRefreshEvent);
                }
            }

            function assignModelValue(value) {
                evaluateModelValue(value, attrs.initval, attrs.name,
                    {keepundefined: attrs.keepundefined}).then(function (result) {
                    scope.errorMessage = undefined;
                    if (angular.isDefined(result)) {
                        // We should set model to null for undefined value,
                        // otherwise widget controller cannot check parameter ready when input used as parameter control
                        scope.theModel = transData(result, datatype, attrs);
                        // console.log('assingModelValue.convertModelToCtrl', scope.theModel);
                        if (!USE_NGMODEL_CTRL) {
                            convertModelToCtrl(scope.theModel);
                        }
                    }
                    if (needDebug(attrs)) {
                        console.log('assignModelValue', {
                            'initModel': value,
                            'evalResult': result,
                            'theModel': scope.theModel
                        });
                    }
                }).catch(function (err) {
                    scope.errorMessage = $translate.instant('udp.uniput.error.cannot_resolve_expr', {expr: attrs.initval}) + ': ' + err.message;
                });
            }

            /**
             * Assign value from model data to control view data.
             * Instead of watching model value change, update control value by manual call of `convertModelToCtrl`.
             * @param {*} modelValue Model data value.
             */
            function convertModelToCtrl(modelValue) {
                var control = attrs.control;
                if (control === CTRL_DATEPICKER) {
                    // Datepicker's ctrlValue is in `date` format
                    scope.ctrlValue = transData(modelValue, dataEx.datatypes.DATE, attrs);
                } else if (control === CTRL_INPUT && attrs.datatype === dataEx.datatypes.ARRAY) {
                    scope.ctrlValue = transData(modelValue, dataEx.datatypes.STRING, attrs);
                } else if (control === CTRL_CHECKBOX || (control === CTRL_SELECT && attrs.ismultiple === 'true')
                    || (control === CTRL_HOST) || (control === CTRL_DEVICE)) {
                    // ctrlValue is array
                    scope.ctrlValue = transData(modelValue, dataEx.datatypes.ARRAY, attrs);
                } else {
                    scope.ctrlValue = transData(modelValue, attrs.datatype, attrs);
                }
                if (needDebug(attrs)) {
                    console.log('convertModelToCtrl', {modelValue: modelValue});
                }
            }

            function isSameValue(newVal, oldVal) {
                // if (newVal === oldVal || JSON.stringify(newVal)===JSON.stringify(oldVal)||_.isEqual(newVal, oldVal))
                if (newVal === oldVal)
                    return true;
                return angular.isDate(newVal) && angular.isDate(oldVal) && newVal.valueOf() === oldVal.valueOf();
            }


            /**
             * Watch UI control value and assign it to model value.
             */
            function convertCtrlToModel() {
                scope.$watch('ctrlValue', function (newVal, oldVal) {
                    // Prevent initial case when oldVal and newVal are undefined
                    // console.log(newVal, oldVal, _.isEqual(newVal, oldVal), scope.theModel);
                    if (isSameValue(newVal, oldVal)) {
                        return;
                    }
                    /*if (ctrl.ctrlToModel) {
                        scope.theModel = ctrl.ctrlToModel(newVal, format, attrs);
                    } else*/
                    if (newVal !== scope.theModel) {
                        if (needDebug(attrs)) {
                            console.log('ctrlValueChanged:convertCtrlToModel', {ctrlValue: newVal, datatype: datatype});
                        }
                        var theModel = transData(newVal, datatype, attrs);
                        scope.theModel = theModel;
                        return;
                    }
                }, true);
            }


            /**
             * Evaluate model value from pass-in model and initval.
             * @param {*} value Pass-in model value. If defined, use this as model value.
             * @param {string=} initval A data expression {@see dataEx} for evaluation if model is not specified.
             * @param {string} name Name of control
             * @param {object} options
             * @param {boolean=} options.keepundefined
             * @returns {promise.<*|undefined|null>} Promise of evaluated value. Undefined for failed initval evaluation (due to fnexp)
             */
            function evaluateModelValue(value, initval, name, options) {
                var d = $q.defer();
                options = options || {};
                if (angular.isDefined(value)) {
                    // Defined means that the model has passed in value, just use it
                    d.resolve(value);
                } else if (angular.isDefined(initval)) {
                    // Ignore self
                    var ignores = [name, '@.' + name];
                    var debugKey = '';
                    var valueObj = pageDataUtil.getPageScopeValues(scope);
                    var result = dataEx.evalVarExpr(initval, valueObj, {
                        ignores: ignores,
                        debugKey: debugKey
                    });

                    if (result && angular.isFunction(result.then)) {
                        // This is a promise
                        result.then(function (data) {
                            d.resolve(data);
                        }).catch(function (err) {
                            d.reject(err);
                        });
                    } else if (angular.isDefined(result)) {
                        d.resolve(result);
                    } else {
                        // undefined means this is a failed evaluation, keep it as undefined
                        d.resolve(undefined);
                    }
                } else {
                    d.resolve(options.keepundefined ? undefined : null);
                }
                return d.promise;
            }

            function onRefreshEvent(event, args) {
                console.debug('[onRefreshEvent] ', {event: event, args: args, controlName: attrs.name, attrs: attrs});
                if (args.eventName === attrs.eventtorefresh || args.eventName === attrs.etovalue) {
                    assignModelValue(undefined);
                } else if (args.eventName === attrs.etosource) {
                    var dataConfig = ngModelCtrl.controlDef.dataConfig || {};
                    dataConfig.initSourceDef && dataConfig.initSourceDef(scope);
                }
                // if (attrs.eventName === attrs.eventtorefresh || args.eventName === attrs.etosource)
                //     ngModelCtrl.initSourceDef && ngModelCtrl.initSourceDef();
            }

            /**
             *
             * @param event
             * @param {object} args
             * @param {string} args._source Where the event comes from
             * @param {string} args.eventName
             * @param {{param_name:string}} args.params
             */
            function onPageParamChange(event, args) {
                var params = args.params || {}, paramValue;
                if (attrs.binding) {
                    paramValue = params[attrs.binding];
                } else {
                    paramValue = params[attrs.name];
                }
                if (angular.isDefined(paramValue)) {
                    // If event contains param of this control, assign model value
                    if (needDebug(attrs)) {
                        console.log('onPageParamChange', {event: event, args: args});
                    }
                    scope.theModel = transData(paramValue, datatype, attrs);
                    // convertModelToCtrl(scope.theModel);
                    // TODO: need prevent input-widget change its inner uinput
                } else if (angular.isUndefined(scope.theModel)) {
                    // Else try re-evaluate model value (may contains variable)
                    // console.log('Find unresolved value for "%s"', attrs.name);
                    assignModelValue(undefined);
                }
                if (!USE_NGMODEL_CTRL) {
                    $timeout(function () {
                        //20201103: update ctrl value immediately by triggering updateOn=blur
                        // Use timeout to update ctrlValue
                        convertModelToCtrl(scope.theModel);
                        // elem.find('[ng-model]').blur();
                    });
                }

                // if (attrs.control === CTRL_SELECT &&
                //     (needRefresh() || angular.isUndefined(scope.itemList))) {
                //     ngModelCtrl.initSourceDef && ngModelCtrl.initSourceDef();
                // }

                function needRefresh() {
                    return args.eventName && ((args.eventName === attrs.eventtorefresh) || (args.eventName === attrs.etosource));
                }
            }
        }

        /**
         * Transform data from original value to target type.
         * @param value Original data value
         * @param {string} targetDatatype Target data type
         * @param {InputControlAttrsRef} attrs Element attributes
         * @returns {*}
         */
        function transData(value, targetDatatype, attrs) {

            if (needDebug(attrs)) {
                console.log('transData', {value: value, targetDatatype: targetDatatype, name: attrs.name});
            }
            var options = {formatter: attrs.formatter};
            if (attrs.control === CTRL_DATEPICKER) {
                options.dataType = dataEx.datatypes.DATE;
            } else if (attrs.control === CTRL_DEVICE) {
                options.useJsonForArray = true;
            }
            if (targetDatatype === dataEx.datatypes.ARRAY || targetDatatype === dataEx.datatypes.DSV) {
                options.delimiter = attrs.formatdsv;
            }

            var result = dataEx.convertData(value, targetDatatype, options);

            return result;
        }

        function templateFactory(elem, attrs) {
            var controlType = attrs.control;
            var controlDef = ControlFactory.getDefinition(controlType);
            var ctrlTpl = controlDef.templateHtml(attrs);
            var isShown = controlType === 'hidden' ? 'udp-hidden' : '';
            if (attrs.$controlonly) {
                return ctrlTpl;
            }
            var html = '<div class="form-group udp-input ' + isShown + '"' +
                ' ng-class="{\'has-error\':errorMessage}"' +
                ' data-bs-toggle="popover" data-bs-content="{{errorMessage}}" data-bs-trigger="hover">'
                + ctrlTpl + '</div>';
            return html;
        }

        function InputControlCtrl($scope, $element, $attrs) {
            var that = this;
            this.$onInit = onInit;

            function onInit() {
                //TODO: need refactor
                if ($scope.theConfig) {
                    Object.keys($scope.theConfig).forEach(function (key) {
                        if (!$attrs[key])
                            $attrs[key] = $scope.theConfig[key];
                        if ($scope.theConfig.control) {
                            $scope.control = $scope.theConfig.control;
                        }
                    });
                }
                uinputHelper.upgrade($attrs, $scope);
                // https://stackoverflow.com/questions/27786854/how-to-pass-ngmodelcontroller-to-directive-controller
                var ngModelCtrl = $element.controller('ngModel');
                //LEO@20210830: Use `scope.control` instead of `attrs.control`, it does not support <uinput control="{{$ctrl.input.control}}">
                var controlType = $attrs.control;
                controlType = $scope.control;
                ngModelCtrl.controlDef = ControlFactory.getDefinition(controlType);
                var controller = ngModelCtrl.controlDef.controller;
                // console.log('onInit', {controlType: controlType, controlDef: ngModelCtrl.controlDef});
                if (angular.isFunction(controller)) {
                    controller($scope, $attrs);
                }
                if (ngModelCtrl.controlDef.dataConfig && ngModelCtrl.controlDef.dataConfig.initSourceDef) {
                    $scope.$watch('sourcedef', function (newVal, oldVal) {
                        if (newVal) {
                            ngModelCtrl.controlDef.dataConfig.initSourceDef($scope);
                        }
                    });
                }

                if (!USE_NGMODEL_CTRL) {
                    if (controlType === CTRL_TYPEAHEAD) {
                        // For typeahead, do not convert ctrl value (in input box) to model automatically.
                        // Model value is assign when user selects one suggestion item
                        ngModelCtrl.noCtrlToModel = true;
                    }
                }
            }
        }
    }

    /**
     * This constructor is for IDE API reference and not directly used.
     * @constructor
     */
    function InputControlAttrsRef(attrs) {
        this.ngModel = '';
        this.control = '';
        this.initval = '';
        this.datatype = '';
        /**
         * @deprecated
         * @type {string}
         */
        this.format = '';
        this.formatdsv = '';
        this.formatter = undefined;
        this.name = '';
        this.label = '';
        this.layout = '';
        this.showlabel = '';
        this.readonly = false;
        this._required = false;
        this.isrestricted = false;
        this.ismultiple = "false";
        this.sourcedef = '';
        this.options = undefined;
        this.eventbychange = '';
        this.etosource = '';
        this.etovalue = '';
        /**
         * @deprecated split to etosource and etovalue
         * @type {string}
         */
        this.eventtorefresh = '';
    }
})();
