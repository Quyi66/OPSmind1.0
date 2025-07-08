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
