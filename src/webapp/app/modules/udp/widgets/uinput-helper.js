/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/9/15, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').service('uinputHelper', [uinputHelper]);
    angular.module('oplus.udp').service('ControlFactory', ControlFactory);
    ControlFactory.$inject = [];

    /**
     * @ngdoc service
     * @name ControlFactory
     */
    function ControlFactory() {
        var controlDefs = {};
        this.register = register;
        this.getDefinition = getDefinition;

        /**
         * Get control definition
         * @param {string} type Control type
         * @returns {{controller: function, templateHtml: function, transData: function}} Input control by default
         */
        function getDefinition(type) {
            var def = controlDefs[type];
            if (!def)
                def = controlDefs['input'];
            return def;
        }

        /**
         * Register a control definition
         * @param {string} type Control type
         * @param {function|{controller: function, templateHtml: function, transData: function}} def Control definition
         */
        function register(type, def) {
            if (angular.isFunction(def)) {
                controlDefs[type] = new def();
            } else {
                controlDefs[type] = def;
            }
        }
    }

    /**
     * @ngdoc service
     * @name uinputHelper
     * @description
     */
    function uinputHelper() {
        // var controlDefs={
        //     input:{label:'输入框'},
        //     select:{label:'下拉框'},
        //     typeahead:{label:'联想输入'},
        //     datepicker:{label:'日期选择'},
        //     checkbox:{label:'复选框'},
        //     radio:{label:'单选框'},
        //     textarea:{label:'多行文本'},
        //     device:{label:'设备选择'},
        //     text:{label:},
        //     file:{},
        //     password:{},
        //     hidden:{}
        // };
        this.upgrade = upgrade;
        this.DEFAULT_CIT = 'linux';

        function upgrade(props, scope) {
            [props, scope].forEach(function (o) {
                if (!o) {
                    return;
                }
                //20210821: rename format to datatype
                if (!o.datatype) {
                    if (o.format) {
                        o.datatype = o.format;
                        delete o.format;
                    }
                }
                //20210915: move devicetype to sourcedef
                if (o.devicetype) {
                    o.sourcedef = o.devicetype;
                    // delete o.devicetype;
                }
            });
        }
    }
})();
