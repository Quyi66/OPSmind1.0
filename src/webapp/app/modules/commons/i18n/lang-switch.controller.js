(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .controller('LangSwitchController', LangSwitchController);

    LangSwitchController.$inject = ['$state', '$translate', 'i18nService', 'tmhDynamicLocale'];

    /**
     *
     * @param $state
     * @param $translate
     * @param {i18nService} i18nService
     * @param tmhDynamicLocale
     * @constructor
     */
    function LangSwitchController($state, $translate, i18nService, tmhDynamicLocale) {
        var that = this;
        this.languages = null;
        this.currentLanguage=$translate.use();
        this.changeLanguage = changeLanguage;
        this.$onInit = onInit;

        function onInit() {
            i18nService.getAllLanguages().then(function (languages) {
                that.languages = languages;
            });
        }

        function changeLanguage(languageKey) {
            i18nService.initLanguage(languageKey).then(function(){
                // that.currentLanguage = languageKey;
                window.location.reload();
            });
            // $translate.use(languageKey);
            // tmhDynamicLocale.set(languageKey);
            // moment.locale(languageKey);
            // $state.reload();
            // window.location.reload();
        }
    }
})();
