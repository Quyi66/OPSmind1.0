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
