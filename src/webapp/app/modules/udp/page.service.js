/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */

(function () {
        'use strict';
        var app = angular.module('oplus.udp');

        app.service('pageService', pageService);

        pageService.$inject = ['$http', '$q', '$state', '$controller', '$location', '$rootScope', '$compile', '$templateRequest',
            '$translate', '$uibModal', '$uibModalStack', '$timeout',
            'pageDao', 'themeService', 'restUtils', 'messageService', 'widgetUiHelper', 'currentUser', 'widgetFactory', 'devel'];

        /**
         * @ngdoc service
         * @name pageService
         * @param $http
         * @param $q
         * @param $state
         * @param $controller
         * @param $location
         * @param $rootScope
         * @param pageDao {pageDao}
         * @param themeService {themeService}
         * @param $uibModal
         * @param $timeout
         * @param restUtils {restUtils}
         * @param $compile
         * @param $uibModalStack
         * @param $templateRequest
         * @param messageService {messageService}
         * @param widgetUiHelper {widgetUiHelper}
         * @param currentUser {currentUser}
         * @param widgetFactory {widgetFactory}
         * @param {devel} devel
         */
        function pageService($http, $q, $state, $controller, $location, $rootScope, $compile, $templateRequest,
                             $translate, $uibModal, $uibModalStack, $timeout,
                             pageDao, themeService, restUtils, messageService, widgetUiHelper, currentUser, widgetFactory, devel) {
            var that = this, clipboards = [];
            var pageInEdit = undefined;
            this.PAGE_WRAPPER_SELECTOR = '.js-page-content';

            var module = "udp";

            // CRUD
            this.findPage = findPage;
            this.findPageByCode = findPageByCode;//pageDao.findPageByCode;
            this.findAllPages = pageDao.findAllPages;
            this.findNotInFolderPages = pageDao.findNotInFolderPages;
            this.findPages = pageDao.findPages;
            this.findPageByFolderId = pageDao.findPageByFolderId;
            this.findPageByFolder = pageDao.findPageByFolder;
            this.savePage = savePage;
            this.updatePagesFolderId = pageDao.updatePagesFolderId;
            this.deletePage = pageDao.deletePage;
            this.movePage = movePage;
            this.importPages = pageDao.importPages;
            this.exportPages = pageDao.exportPages;
            this.clonePage = pageDao.clonePage;
            this.beginEditPage = beginEditPage;
            this.endEditPage = endEditPage;
            this.checkUnsavedChange = checkUnsavedChange;
            // Load
            this.loadPageTemplate = loadPageTemplate;
            // Display helpers
            this.tidyHtml = tidyHtml;
            this.isDarkTheme = isDarkTheme;
            this.genSourceCode = genSourceCode;
            /**
             *
             * @deprecated
             */
            this.dismissModal = dismissModal;
            // Export
            this.parseExportFile = parseExportFile;
            this.exportCurrentView = exportCurrentView;
            this.makePagePrintable = makePagePrintable;
            this.emailPage = emailPage;
            // Page designer
            this.copyWidget = copyWidget;
            this.pasteWidget = pasteWidget;
            this.cutWidget = cutWidget;

            function findPageByCode(code) {
                return restUtils.callApi(module, 'GET', '/api/udp/pages/code/{code}', {code: code});
            }

            /**
             * Move pages to applet
             * @param {[string]} pageIds Array of page IDs
             * @param {string} appletCode Code of target applet
             */
            function movePage(pageIds, appletCode) {
                return restUtils.callApi(module, 'PUT', '/api/udp/pages/move/{appletCode}', {"appletCode": appletCode}, pageIds);
            }

            /**
             * Dismiss page opened in modal.
             * Cannot use $uibModalInstance, because this controller is also used
             * for normal page display (not in modal).
             * In non-modal display, it throws exception:`Unknown provider: $uibModalInstanceProvider`
             * @deprecated This method is too brutal, need reconsider the use case.
             */
            function dismissModal() {
                var top = $uibModalStack.getTop();
                if (top) {
                    $uibModalStack.dismiss(top.key);
                }
            }

            function savePage(page) {
                assertAuthentication();
                /*  if (!page.createdBy) {
                      page.createdBy = currentUser.loginId;
                  }*/
                page.modifiedBy = currentUser.loginId;
                page.modifiedName = currentUser.displayName;
                if (!page.id) {
                    page.createdBy = currentUser.loginId;
                    page.createdName = currentUser.displayName;
                    return restUtils.callApi(module,'POST', '/api/udp/pages', null, page);
                } else {
                    return restUtils.callApi(module,'PUT', '/api/udp/pages', null, page);
                }
            }

            /**
             *
             * @param {{id:string, code:string, setting:{}, html:string}} page Page object
             */
            function beginEditPage(page) {
                pageInEdit = page;
            }

            function endEditPage() {
                pageInEdit = undefined;
            }

            /**
             * If there are unsaved changes
             * @returns {boolean}
             */
            function checkUnsavedChange() {
                if (!pageInEdit) return false;
                var newVal = genSourceCode();
                var oldVal = pageInEdit.html;
                if (oldVal !== newVal) {
                    console.debug('checkUnsavedChange', {oldVal: oldVal, newVal: newVal});
                    return true;
                } else {
                    return false;
                }
            }

            function assertAuthentication() {
                if (!currentUser.isAuthenticated) {
                    messageService.alertError($translate.instant('common.uaa.no_permission'), $translate.instant('common.uaa.no_permission_desc'));
                    throw new Error('401');
                }
            }

            /**
             * Find page definition by ID. It supports local and remote page.
             * A local page is a JSON file saved as a physical file with webapp. The local page id format is `path/to/app-modules/page-id`.
             * The method will look up local page under the dir of `app/modules`.
             * A remote page is saved in remote database. The remote page id is a unique ID.
             * @param {string} pageId
             * @param {object=} options
             * @param {boolean=} options.alertIfFail Show error if fail to load page
             * @param {boolean=} options.disableI18n
             * @returns {promise<object>} A page object
             */
            function findPage(pageId, options) {
                options = options || {};
                var isLocalPage = pageId.indexOf('/') > -1;
                var url;
                if (isLocalPage) {
                    var slash = pageId.charAt(0) === '/' ? '' : '/';
                    url = 'app/modules' + slash + pageId + '.json';
                    if (options.disableI18n) {
                        url += '?__noi18n';
                    }
                    return restUtils.callAjax('GET', url);
                } else {
                    url = '/api/udp/pages/{id}';
                    if (options.disableI18n) {
                        url += '?__noi18n';
                    }
                    return restUtils.callApi('udp', 'GET', url, {id: pageId});
                }
            }

            function cutWidget(element) {
                clipboards[0] = element;
                console.log('cutWidget', element);
                //TODO: is it good to put in rootScope?
                $rootScope['pasteWidgetEnabled'] = 'cut';
            }

            function emptyClipboard() {
                clipboards = [];
                $rootScope['pasteWidgetEnabled'] = false;
            }

            /**
             *
             * @param element {angular.element} Element to copy
             */
            function copyWidget(element) {
                var clone = element.clone();
                var content = clone.removeAttr('id').removeAttr('class').prop('outerHTML');
                clipboards[0] = content;
                //TODO: is it good to put in rootScope?
                $rootScope['pasteWidgetEnabled'] = 'copy';
            }

            /**
             *
             * @param element {angular.element} Target position inside/beside which the copy should be placed
             * @param scope
             */
            function pasteWidget(element, scope, isCut) {
                var content;
                if (clipboards.length > 0) {
                    content = clipboards[0];
                    if (!content) {
                        return;
                    }
                }

                if (!isCut) {
                    var el = $compile(content)(scope);
                    placeElement(el);
                } else {
                    placeElement(content);
                    emptyClipboard();
                }

                function placeElement(el) {
                    var type = element.attr('uw-type');
                    if (!widgetUiHelper.isLayoutWidget(type)) {
                        // Append a new line to avoid element align tightly
                        element.after(el).after('\n');
                    } else if (widgetUiHelper.isColWidget(type)) {
                        element.find('.uw-column, .uw-float').append(el);
                    }
                }

            }

            function emailPage(to, subject, callback) {
                var options = {embedStyle: true, removeGrid: true, includeUrl: true};
                makePagePrintable(options).then(function (content) {
                    return restUtils.sendEmail(to, subject, content);
                }).then(function () {
                    messageService.toast('success', $translate.instant('udp.page.email.send_mail_success', {to: to}));
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant('udp.page.email.send_mail_error', {message: err.message}));
                }).finally(function () {
                    callback();
                });
            }

            /**
             * Export current view to file
             * @param format {string} File format, `pdf`,`excel`,`word`,`html`
             * @param title {string} Use as file name
             */
            function exportCurrentView(format, title) {
                var content;
                var options;
                if (format === 'pdf') {
                    options = {embedStyle: true, removeGrid: true};
                    makePagePrintable(options).then(function (content) {
                        exportPdf(title, content);
                    }).catch(function (err) {
                        showExportError(err);
                    });
                } else if (format === 'word') {
                    options = {embedStyle: true, removeGrid: true};
                    makePagePrintable(options).then(function (content) {
                        saveAs(htmlDocx.asBlob(content), title + ".docx");
                    }).catch(function (err) {
                        showExportError(err);
                    });
                } else if (format === 'excel') {
                    options = {fulldata: true};
                    makePagePrintable(options).then(function (content) {
                        exportExcel(title, content);
                    }).catch(function (err) {
                        showExportError(err);
                    });
                } else if (format === 'html') {
                    options = {embedStyle: true, removeGrid: true, includeUrl: true};
                    makePagePrintable(options).then(function (content) {
                        var showNewWin = !true;
                        if (showNewWin) {
                            var w = window.open();
                            if (!w) {
                                showExportError(new Error($translate.instant('udp.page.export.open_window_error')));
                            } else {
                                w.document.write(content);
                            }
                        } else {
                            saveAs(new Blob([content]), title + ".html");
                        }
                    }).catch(function (err) {
                        showExportError(err);
                    })
                } else
                    throw new Error('Unsupported export file format ' + format);

                function showExportError(err) {
                    messageService.toast('error', $translate.instant('udp.page.export.error', {message: err.message}));
                }
            }

            /**
             *
             * Export page in current view to PDF
             * @param title
             * @param html
             */
            function exportExcel(title, html) {
                var $elem = $(html);
                var workbook = {SheetNames: [], Sheets: {}};
                var worksheet;
                var tables = $elem.find('table');
                if (tables.length === 0) {
                    messageService.alert($translate.instant('udp.page.actions.export_excel'), $translate('udp.page.export.no_datatable_error'));
                    return;
                }
                tables.each(function (i, table) {
                    if (!$(table).hasClass('js-table-for-grid')) {
                        worksheet = XLSX.utils.table_to_sheet(table);
                        var sheetName = 'Sheet' + (i + 1);
                        workbook.SheetNames.push(sheetName);
                        workbook.Sheets[sheetName] = worksheet;
                    }
                });
                // Save file
                // http://sheetjs.com/demos/writexlsx.html
                var wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};
                var wbout = XLSX.write(workbook, wopts);

                function s2ab(s) {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }

                /* the saveAs call downloads a file on the local machine */
                saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), title + ".xlsx")
            }


            /**
             * Parse content of exported pages file
             * @param content {string} File content
             * @return [object] Array of page objects
             */
            function parseExportFile(content) {
                return JSON.parse(content);
            }

            function getBaseUrl() {
                var url = $location.absUrl();
                return url.substring(0, url.indexOf('/index.html') + 1);
            }

            /**
             * Export page in current view to PDF
             * @param title {string} Page title
             * @param content {string} HTML content
             */
            function exportPdf(title, content) {
                var pageId = 'unused';
                var url = restUtils.getApiUrl('pdf', '/api/udp/page/{pageId}/export/{type}', {
                    pageId: pageId,
                    type: 'pdf'
                });
                var data = {html: content, baseUrl: getBaseUrl()};
                $http({method: 'POST', url: url, data: data, responseType: 'arraybuffer'})
                    .then(function (resp) {
                        saveAs(new File([resp.data], title + '.pdf', {type: 'application/pdf'}));
                    }, function (resp) {
                        console.error(resp);
                    });
            }

            /**
             * Make a printable page.
             * @param {object=} options Printable options
             * @param {boolean=} options.embedStyle - Embed CSS in HTML
             * @param {boolean=} options.fulldata
             * @param {boolean=} options.removeGrid - Replace grid layout with table
             * @param {boolean=} options.includeUrl
             * @param {boolean=} options.modifySelf Modify page self
             * @returns {promise.<string>} HTML content for printable display
             */
            function makePagePrintable(options) {
                options = options || {};
                var d = $q.defer(), promises = [], $clone;
                if (options.modifySelf) {
                    $clone = $('html');
                    // console.log('clone',$clone);
                    // $clone = $('html').clone();
                } else {
                    $clone = $('html').clone();
                }
                var $body = $clone.find('body');

                // handleDataTable().then(function () {
                var widgets = $clone.find('uwidget');
                // console.log('widgets',$body.length,widgets.length);
                widgets.each(function () {
                    var elem = $(this);
                    var type = elem.attr('uw-type'), props = JSON.parse(elem.attr('uw-props') || '{}');
                    var def = widgetFactory.lookupWidgetDef(type);
                    var cb = def.controlRenderer;
                    if (cb && angular.isFunction(cb.makePrintable)) {
                        // elem.replaceWith();
                        promises.push($q.when(cb.makePrintable(elem, props, options)));
                    }
                });
                $q.all(promises).then(function () {
                    removeNonPrintableElements();
                    replaceFormControls();
                    keepDisplayContentOnly();
                    convertCanvasToImage();
                    if (options.removeGrid)
                        convertGridToTable();
                    addHeaderAndFooter();
                    removeAttributes();
                    $http.get('content/css/oplus-udp-printable.css').then(function success(resp) {
                        var styles = resp.data;
                        if (options.embedStyle) {
                            $clone.find('head > link').remove();
                            $clone.find('body').prepend('<style type="text/css">' + styles + '</style>');
                        }
                        var html = '<!DOCTYPE html>' + $clone[0].outerHTML;
                        html = removeBlankLines(html);
                        d.resolve(html);
                    }, function error(resp) {
                        var err = restUtils.guessError(resp);
                        d.reject(err);
                    });
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;

                function removeAttributes() {
                    var attrs = ['uw-props', 'ng-repeat', 'ng-if', 'ng-click'];
                    var all = $clone.find('*');
                    attrs.forEach(function (attr) {
                        all.removeAttr(attr);
                    });

                    // var widgets = $clone.find('uwidget');
                    // widgets.each(function (e) {
                    //     var elem = $(this);
                    //     elem.replaceWith(elem.html());
                    // });
                }

                function removeBlankLines(html) {
                    html = html.replace(/^\s*\n/gm, '');
                    return html;
                }

                function replaceFormControls() {
                    $clone.find('input')./*unwrap('.form-control-wrapper').*/each(function () {
                        var elem = $(this);
                        var text = elem.val();
                        elem.replaceWith('<span class="control-input">' + text + '</span>')
                    });
                    $clone.find('select')./*unwrap('.form-control-wrapper').*/each(function () {
                        var elem = $(this);
                        var text = elem.find("option:selected").text();
                        elem.replaceWith('<span class="control-input">' + text + '</span>')
                    });
                    // $clone.find('.form-control-wrapper')
                }

                function removeNonPrintableElements() {
                    // Remove non-printable elements
                    var toRemove = 'script, style, iframe' +
                        ', .alert button.close' +
                        ', .ui-resizable-handle, #toast-container' +
                        ', button' +
                        ', .dropdown-menu, dropdown-toggle' +
                        ', .uw-buttons, .uw-params, .uwtype-timer';
                    $clone.find(toRemove).remove();
                    // Remove unnecessary attributes, class, comments
                    // https://stackoverflow.com/questions/2364601/is-it-possible-to-remove-an-html-comment-from-dom-using-jquery
                    var $all = $clone.find('*');
                    $all.removeAttr('ng-init ng-class ng-controller')
                        .removeClass('ng-binding ng-scope ng-isolate-scope');
                    removeComments($all);

                    function removeComments(elem) {
                        elem.contents().each(function () {
                            if (this.nodeType === Node.COMMENT_NODE) {
                                $(this).remove();
                            }
                        });
                    }
                }

                function keepDisplayContentOnly() {
                    // 3. Keep page display content only
                    var temp = '<div></div>';
                    $body.children().wrapAll(temp);
                    $body.find('> div').replaceWith($clone.find('udp-page-view').eq(0));
                }

                function convertCanvasToImage() {
                    // 4. Convert canvas to image
                    // https://stackoverflow.com/questions/923885/capture-html-canvas-as-gif-jpg-png-pdf
                    var originalCanvas = $('udp-page-view canvas');
                    $body.find('canvas').each(function (i, e) {
                        var elem = $(this);
                        var width = elem.width(), height = elem.height();
                        var img = $('<img src="' + originalCanvas[i].toDataURL('image/png') + '"/>');
                        img.attr('width', width).attr('height', height);
                        elem.replaceWith(img);
                    });
                }

                /**
                 * .col-sm-xx replaced with tr-td
                 * .row replaced with table
                 */
                function convertGridToTable() {
                    // js-table-for-grid
                    var rows = $clone.find('.row');
                    rows.each(function (e) {
                            var row = $(this);
                            var cols = row.find('> div');
                            var wrapper = $('<div class="js-wrapper"></div>');
                            var table;// = newTable();
                            var tr, sumWidthOfCols = 0;
                            cols.each(function (e) {
                                var td;
                                var col = $(this);
                                var matches = col.attr('class').match(/col-sm-(e?)([0-9]+)/);
                                // var span = matches ? parseInt(matches[2]) : 12;
                                var width = 100;
                                if (matches) {
                                    if (matches[1] === 'e') {
                                        // Width by percent
                                        width = _.floor(100 / matches[2], 2);
                                    } else {
                                        // Width by grid
                                        width = _.floor(100 / 12 * matches[2], 2);
                                    }
                                }
                                // Replace col with td
                                td = $('<td></td>')
                                    .attr('valign', 'top')
                                    .css('width', width + '%')
                                    // .css('max-width', width + '%')
                                    // .css('overflow','hidden')
                                    // .css('text-overflow', 'ellipsis')
                                    .append(col.children());
                                col.remove();
                                sumWidthOfCols += width;
                                // If total width of all tds greater than 100% width,
                                // create a new table (instead of a solely new tr)
                                if (!tr || sumWidthOfCols > 100) {
                                    table = newTable().appendTo(wrapper);
                                    tr = $('<tr></tr>').appendTo(table);
                                    sumWidthOfCols = width;
                                }
                                tr.append(td);
                            });
                            if (!table) {
                                table = newTable().appendTo(wrapper);
                            }
                            // table.attr('width', sumWidthOfCols + '%');
                            row.replaceWith(wrapper);
                        }
                    );

                    function newTable() {
                        // Do not use css('width'), it will make two 10% td to evenly 50%
                        // Use table-layout:fixed to prevent table cell stretches with its content
                        // https://stackoverflow.com/questions/9789723/css-text-overflow-in-a-table-cell
                        return $('<table></table>').addClass('js-table-for-grid')
                            .attr('width', '100%')
                            .css('table-layout', 'fixed')
                            .css('border-collapse', 'unset');
                    }
                }

                function addHeaderAndFooter() {
                    if (options.includeUrl) {
                        var url = window.location.href;
                        var a = angular.element('<a></a>')
                            .attr('href', url)
                            .attr('target', '_blank').text(url);
                        $('<p></p>').append(a).prependTo($body);
                    }
                    if (options.header)
                        $body.prepend('<div id="pageHeader" style="height:60px;background-color: lightblue">Oplus</div>')
                    if (options.footer)
                        $body.append('<div id="pageFooter" style="height:50px;background-color: lightgray">' + new Date() + '</div>');
                }
            }

            /**
             * Generate source code
             * @returns {*}
             */
            function genSourceCode() {
                var html = tidyHtml($('#globally-only-one-page-designer ' + that.PAGE_WRAPPER_SELECTOR).html(), false);
                var opts = {};
                return html_beautify(html, opts);
            }

            /**
             *
             * @param {string} themeId Theme ID
             * @returns {boolean} CSS class
             */
            function isDarkTheme(themeId) {
                return themeId === 'dark';
            }


            /**
             * Cleanup HTML for persistence
             * @param html {string} Page HTML content
             * @param forPageView {boolean} true for page view, false for page designer
             * @returns {*}
             */
            function tidyHtml(html, forPageView) {
                var clonedHtml = $('<div>' + html + '</div>');
                clonedHtml.find('.uwidget, .widget-layout').each(function (e) {
                    // clonedHtml.find('[uw-type]').each(function (e) {
                    var widgetElem = $(this);
                    // Upgrade old jquery-ui uniqueId to new Id
                    var id = widgetElem.attr('id');
                    if (id && id.indexOf('ui-id-') === 0) {
                        widgetElem.removeAttr('id').widgetUid();
                    }
                    cleanupAttrs(this);
                    widgetElem.find('.ui-resizable-handle').remove();
                    // uw-buttons can be safely removed because they will be regenerated
                    widgetElem.find('.uw-buttons').remove();
                    widgetElem.removeClass('ng-isolate-scope ui-draggable ng-scope');
                    // elem.removeClass('container-fluid');
                    var type = widgetElem.attr('uw-type') || '';
                    var widgetDef = widgetFactory.lookupWidgetDef(type);
                    if (angular.isFunction(widgetDef.cleanupForSave)) {
                        widgetDef.cleanupForSave(widgetElem);
                    } else {
                        //TODO: optimize it
                        if (type && type.indexOf('layout-') < 0 && type.indexOf('text-') < 0) {
                            widgetElem.empty();
                        }
                    }
                });
                clonedHtml.find('.uw-content[ng-dblclick]').removeAttr('ng-dblclick');
                // TODO: quick and dirty way to remove generated datepicker
                clonedHtml.find('.uw-column > .daterangepicker.dropdown-menu').remove();

                replaceTranscludeInLayouts();

                if (forPageView) {
                    clonedHtml.find('.uw-buttons,.uw-symbol').remove();
                }
                return clonedHtml.html();

                /**
                 *
                 * @param {HTMLElement} htmlElem
                 */
                function cleanupAttrs(htmlElem) {
                    // .attributes returns a NamedNodeMap, not a real Array
                    var attrArray = [];
                    var attrsToPreserve = ['uw-type', 'uw-props', 'id', 'widget-layout'];
                    // if (htmlElem.classList.contains('op-custom-styles')){
                    //     console.log(htmlElem);
                    //    return;
                    // }
                    if (htmlElem.classList.contains('uwtype-layout-float')) {
                        attrsToPreserve.push('style');
                    }
                    var elemAttrs = htmlElem.attributes;
                    for (var i = 0; i < elemAttrs.length; i++) {
                        var attrName = elemAttrs[i].name;
                        attrArray.push(attrName);
                    }
                    attrArray.forEach(function (attrName) {
                        if (attrsToPreserve.indexOf(attrName) < 0) {
                            htmlElem.removeAttribute(attrName);
                        }
                    });
                }

                /**
                 * Replace transclude content in widget layout
                 * @see {widgetLayout}
                 */
                function replaceTranscludeInLayouts() {
                    // <div class="uw-row row" ng-transclude>
                    // or using clone.find('[ng-transclude]')
                    var transcludes = clonedHtml.find('.uw-row, .uw-column, .uw-float');
                    transcludes.each(function (e) {
                        var wrapper = $(this);
                        var hasContent = wrapper.html();
                        var content = wrapper.children();
                        // If this is a uw-column in card mode
                        if (wrapper.parent().hasClass('card-body')) {
                            wrapper = wrapper.parent().parent();
                        }
                        if (hasContent) {
                            try {
                                wrapper.replaceWith(content);
                            } catch (err) {
                                console.error(err.message);
                                wrapper.remove();
                            }
                        } else {
                            wrapper.remove();
                        }
                    });
                }
            }

            /**
             * Load a page template.
             * @param template {string} Template name.
             * @return {$q<string>}
             */
            function loadPageTemplate(template) {
                var d = $q.defer();
                template = template || 'default';
                var url = 'app/modules/udp/assets/templates/' + template + '.html';
                $http.get(url).success(function (html) {
                    d.resolve(html)
                }).error(function (err) {
                    d.reject(err);
                });
                return d.promise;
            }
        }
    }
)();
