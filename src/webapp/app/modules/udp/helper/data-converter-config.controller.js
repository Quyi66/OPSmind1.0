/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/30/2017
 */

(function () {
    'use strict';

    angular.module('oplus.udp').controller('DataConverterConfigCtrl', DataConverterConfigCtrl);

    DataConverterConfigCtrl.$inject = ['$scope', '$translate', 'messageService', '$uibModalInstance', 'dataEx', 'customFunctions', 'convertFn', 'widgetUiHelper', 'widgetSecurity'];

    /**
     *
     * @param $scope
     * @param $uibModalInstance
     * @param messageService {messageService}
     * @param dataEx {dataEx}
     * @param convertFn {string}
     * @param customFunctions {customFunctions}
     * @param {widgetUiHelper} widgetUiHelper
     * @param {widgetSecurity} widgetSecurity
     * @constructor
     */
    function DataConverterConfigCtrl($scope, $translate, messageService, $uibModalInstance, dataEx, customFunctions, convertFn, widgetUiHelper, widgetSecurity) {
        var that = this;
        this.editor;
        var meta = dataEx.getExprMeta(convertFn);
        var linkHelper = interactionLinkHelper(widgetSecurity);
        upgradeMeta(meta);
        this.kind = meta.kind;
        this.convertFn = meta.body;
        this.funcList = customFunctions.getAllFunctions();
        this.pageLinks = [];
        this.kinds = dataEx.kinds;
        this.cancel = cancel;
        this.save = save;
        this.addPageLink = addPageLink;
        this.removePageLink = removePageLink;
        this.selectPageLink = selectPageLink;
        this.codemirrorLoaded = codemirrorLoaded;
        this.insertFunction = insertFunction;
        this.enabledKinds = getEnabledKinds();
        this.enabledVarTypes = getEnabledVarTypes();
        this.current = {index: -1, item: undefined};

        $scope.$watch('vm.kind', function (newVal, oldVal) {
            if (newVal === that.kinds.LINK) {
                that.pageLinks = linkHelper.htmlToLinks(that.convertFn);
                if (that.pageLinks.length > 0)
                    selectPageLink(0);
            }
        });

        $scope.$watch('vm.pageLinks', function (newVal, oldVal) {
            if (that.kind === that.kinds.LINK) {
                var links = newVal;
                if (links) {
                    // console.log('vm.pageLinks');
                    that.convertFn = linkHelper.linksToHtml(links, widgetUiHelper.buildButton);
                    // linksToHtml(links);
                }
            }
        }, true);

        $scope.$on('$destroy', function () {
            if (that.editor) {
                that.editor.off('blur');
                that.editor = null;
            }
        });

        // function registerEditor($editor) {
        //     that.editor = $editor;
        //     that.editor.on('blur', function () {
        //         $(".CodeMirror-cursors").css('visibility', 'visible');
        //     });
        // }

        function getEnabledVarTypes() {
            var options = $scope.$ctrl.options || {};
            var result = [];
            if (options['varTypes']) {
                result = options['varTypes'].split(',');
            }
            return result;
        }

        function upgradeMeta(meta) {
            var kind = meta.kind, convertFn = meta.body;
            if (kind === 'link') {
                // 20180608: Convert udp-page-link to udp-widget-interaction
                var pageLinks = [];
                var elem = angular.element('<div>' + convertFn + '</div>');
                elem.children().each(function () {
                    var el = $(this), newLink, oldPageLink = el.attr('udp-page-link');
                    if (oldPageLink) {
                        var link = JSON.parse(oldPageLink);
                        link.label = el.html();
                        newLink = {
                            label: el.html(),
                            interaction: {
                                actions: ['page'],
                                page: {
                                    pageId: link.pageId,
                                    params: link.params,
                                    target: link.target
                                }
                            }
                        };
                        pageLinks.push(newLink);
                    }
                });
                if (pageLinks.length > 0)
                    meta.body = linkHelper.linksToHtml(pageLinks, widgetUiHelper.buildButton);
            }
        }

        function getEnabledKinds() {
            var options = $scope.$ctrl.options || {};
            var result = {};
            var all = [];
            if (options.kinds) {
                all = options.kinds.split(',');
            }
            if (all.length === 0) {
                all = _.values(that.kinds);
            }
            all.forEach(function (s) {
                result[s.trim()] = true;
            });
            return result;
        }

        function codemirrorLoaded(_editor) {
            that.editor = _editor;
            that.editor.on('blur', function () {
                $(".CodeMirror-cursors").css('visibility', 'visible');
            });
        }

        function insertFunction() {
            var doc = that.editor.getDoc();
            var cursor = doc.getCursor();
            that.editor.replaceRange('$$.' + (that.selectedFn.sample || that.selectedFn.name), cursor);
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }

        function save() {
            var result = (that.kind === dataEx.kinds.STR ? '' : (that.kind + ':')) + that.convertFn;
            $uibModalInstance.close(result);
        }

        function addPageLink() {
            that.pageLinks.push({label: 'Button'});
            selectPageLink(that.pageLinks.length - 1);
        }

        function selectPageLink(index) {
            that.current = {index: index, item: that.pageLinks[index]};
        }

        function removePageLink(index) {
            messageService.confirm($translate.instant('common.action.delete'), $translate.instant('udp.dataex.link.delete_confirm'), function () {
                that.pageLinks.splice(index, 1);
                var prev = index - 1 < 0 ? 0 : index - 1;
                selectPageLink(prev);
            });
        }
    }

    /**
     *
     * @param {widgetSecurity} widgetSecurity
     */
    function interactionLinkHelper(widgetSecurity) {
        return {
            linksToHtml: linksToHtml,
            htmlToLinks: htmlToLinks
        };

        /**
         * Build HTML from interaction links.
         * @param {array} links Interaction links
         * @param {object} links.display Button display config
         * @param {object} links.interaction As described in `udp-widget-interaction`
         * @param {object} links.accesscontrol Access control config
         * @param {function.<object>} buttonRenderer A function to render button HTML, using display config as parameter.
         * @returns {string} HTML text
         */
        function linksToHtml(links, buttonRenderer) {
            var html = '';
            links.forEach(function (link) {
                // console.log(link);
                //20180613 migrate label to display.label
                if (link.label) {
                    link.display = {label: link.label};
                    delete link.label;
                }
                var button = buttonRenderer(link.display);
                button.addClass('btn-sm')
                    .attr('data-display', JSON.stringify(link.display))
                    .attr('udp-widget-interaction', JSON.stringify(link.interaction));
                // console.log('accesscontrol',link.accesscontrol);
                if (!_.isEmpty(link.accesscontrol)) {
                    // `data-accesscontrol` is deprecated by `data-udp-accesscontrol`
                    button.attr('data-accesscontrol', JSON.stringify(link.accesscontrol));
                    button.attr('data-udp-accesscontrol', JSON.stringify(link.accesscontrol));
                    widgetSecurity.addUaaAttribute(button, link.accesscontrol);
                }
                if (!_.isEmpty(link.statecontrol)) {
                    button.attr('udp-state-control', JSON.stringify(link.statecontrol));
                }
                // Use a white space or line feed to avoid tight connection between buttons
                html += button.prop('outerHTML') + '\n';
            });
            return html;
        }

        /**
         * Convert HTML to interaction links
         * @param {string} html
         * @returns {Array.<object>} Interacdtion links
         */
        function htmlToLinks(html) {
            var elem = angular.element('<div>' + html + '</div>');
            var links = [];
            elem.children().each(function () {
                var btn = $(this);
                var statecontrol;
                var str = btn.attr('udp-state-control');
                // New `udp-state-control` to be compatible with deprecated `data-statecontrol`
                if (str) {
                    statecontrol = JSON.parse(str);
                } else {
                    statecontrol = btn.data('statecontrol');
                }
                var link = {
                    interaction: JSON.parse(btn.attr('udp-widget-interaction') || '{}'),
                    display: getButtonDisplayConfig(btn),
                    accesscontrol: btn.data('accesscontrol'),
                    statecontrol: statecontrol
                };
                links.push(link);
            });
            return links;


            function getButtonDisplayConfig(elem) {
                var display = elem.data('display');
                if (!display) {
                    display = {label: elem.text()};
                }
                return display;
            }
        }
    }
})();
