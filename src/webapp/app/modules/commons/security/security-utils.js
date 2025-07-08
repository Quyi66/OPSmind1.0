/**
 * AES encryption/decryption
 */
(function () {
    'use strict';
    var app = angular.module('oplus.commons');

    app.service('securityUtils', securityUtils);

    function securityUtils() {

        this.encrypt = encrypt;
        this.decrypt = decrypt;

        function encrypt(word) {
            if (!word) return "";
            var key = CryptoJS.enc.Utf8.parse('Oplus@2022!!sys@');
            var iv = CryptoJS.enc.Utf8.parse('Oplus@2022!!sys@');
            return CryptoJS.AES.encrypt(word, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Iso10126
            }).toString();
        }

        function decrypt(word) {
            if (!word) return "";
            var key = CryptoJS.enc.Utf8.parse('Oplus@2022!!sys@');
            var iv = CryptoJS.enc.Utf8.parse('Oplus@2022!!sys@');
            var result = CryptoJS.AES.decrypt(word, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Iso10126
            });
            return result.toString(CryptoJS.enc.Utf8);
        }
    }
})();