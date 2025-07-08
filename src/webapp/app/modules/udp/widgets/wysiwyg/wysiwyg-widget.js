/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 3/31/2018
 */

(function () {
    'use strict';

    //TODO: rename to htmlWidget or richTextWidget?
    angular.module('oplus.udp')
        .run(['$translate', 'widgetFactory', 'messageService', 'dataEx', 'widgetUiHelper', wysiwygWidget]);

    /**
     *
     * @param $translate
     * @param {widgetFactory} widgetFactory
     * @param {messageService} messageService
     * @param {dataEx} dataEx
     * @param {widgetUiHelper} widgetUiHelper
     */
    function wysiwygWidget($translate, widgetFactory, messageService, dataEx, widgetUiHelper) {

        widgetFactory.defineWidget({
            type: 'wysiwyg',
            group: 'text',
            resizable: 'h',
            configController: WysiwygWidgetConfigCtrl,
            configHtmlFile: undefined,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onReloadData: onReloadData,
                onInitControl: onInitControl
            }
        });

        function getTemplateForCompilation(props) {
            var elem = angular.element('<div></div>');
            var html = props.text || $translate.instant('udp.w.wysiwyg.text_placeholder');
            var isEditMode = widgetUiHelper.isEditMode();
            html = replaceAngularVar(html, isEditMode);
            elem.html(html);
            return elem.prop('outerHTML');

            function replaceAngularVar(text, isEditMode) {
                var str = text;
                if (isEditMode) {
                    // Wrap vars with span tag
                    str = str.replace(/>([^<>]*?)\[\[(.*?)]]/g, '><span class="udp-wysiwyg-var" title="$2">$1[[$2]]</span>');
                } else {
                    // str = widgetUiHelper.replacePageParamsVar(str, {left: '{{', right: '}}'});
                    str = widgetUiHelper.replacePageParamsVar(str, {left: '<span ng-bind-html="', right: '"></span>'});
                }
                return str;
            }
        }

        function onReloadData(scope, element) {
        }

        function onInitControl(scope, element, props) {

        }
    }

    function WysiwygWidgetConfigCtrl(scope, props) {
        var cssFiles;
        cssFiles = _.map(document.querySelectorAll('head > link[type="text/css"]'), 'href');
        scope.tinymceOptions = {
            language: 'zh_CN',
            // plugins: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable export',
            plugins: 'code fullscreen table lists faicons',
            // toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
            toolbar: 'undo redo | styleselect | bold underline strikethrough | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | table charmap emoticons faicons | code fullscreen',
            // menubar: 'file edit insert view format table tools help',
            menubar:'edit insert view',
            content_css: cssFiles,
            // content_style: 'body {font-size: 0.8125rem;}',
            fontsize_formats: '10px 12px 13px 14px 16px 18px 24px 36px',
            style_formats: [
                {
                    title: 'Table', items: [
                        {name: 'table', title: 'Default Table', classes: ['table'], selector: 'table'},
                        {name: 'opx-table', title: 'Oplus Table', classes: ['opx-table'], selector: 'table'}
                    ]
                },
                {
                    title: 'Text', items: [
                        {name: 'text-primary', title: 'Text Primary', inline: 'span', classes: ['text-primary']},
                        {name: 'text-danger', title: 'Text Danger', inline: 'span', classes: ['text-danger']}
                    ]
                }
            ],
            // The following option is used to append style formats rather than overwrite the default style formats.
            style_formats_merge: false,
            skin: 'oplus-tinymce',
            statusbar: true,
            resize: true,
            branding: false
            // skin: 'bootstrap',
            // skin: 'lightgray',
            // theme: 'silver'
        };
        // scope.editorOptions = {
        //     toolbar: [
        //         // Each element is [groupName, [list of button]]
        //         ['edit', ['undo', 'redo']],
        //         ['font', ['fontsize', /* 'fontname',*/ 'color']],
        //         ['style', ['style', 'bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
        //         ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
        //         // ['height', ['height']],
        //         ['insert', ['link', 'table', 'picture', 'video', 'hr', 'faicon']],
        //         ['view', ['fullscreen', 'codeview']],
        //         // ['help', ['help']]
        //     ],
        //     dialogsinbody: true,
        //     codemirror: {
        //         theme: 'opluscode',
        //         matchTags: {bothTags: true},
        //         matchBrackets: true,
        //         lineNumbers: true,
        //         lineWrapping: true
        //     },
        //     height: 300,
        //     focus: true
        // }
    }

})();