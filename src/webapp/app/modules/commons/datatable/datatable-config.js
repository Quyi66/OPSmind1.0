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
