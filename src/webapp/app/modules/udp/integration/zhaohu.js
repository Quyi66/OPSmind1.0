/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 11/19/2018.
 */

(function () {
        'use strict';
        var app = angular.module('oplus.udp');

        app.service('zhaohu', zhaohu);

        zhaohu.$inject = ['$http', '$q', 'restUtils'];

        /**
         * @ngdoc service
         * @name zhaohu
         * @description
         * Service for CMB Zhaohu
         * @param $http
         * @param $q
         * @param {restUtils} restUtils
         */
        function zhaohu($http, $q, restUtils) {
            this.sendUrlCard = sendUrlCard;
            this.getUserList = getUserList;
            this.getCurrentUserOpenId = getCurrentUserOpenId;

            /**
             *
             * Get DYH openId from user agent.
             * ------------------------
             * CONNECT fdsstzh.cmbchina.corn:443 HTTP/1.1
             * Host fdsstzh.cmbchina.com
             * User-Agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_0_2 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A421 CinMessage AppVersion:2018032611 openid:9A1EF6DAA24D2F62A039138903A04C78D
             * Connection keep-alive
             * Proxy-Connection keep-alive
             * ------------------------
             * @returns {string|undefined}
             */
            function getCurrentUserOpenId() {
                var userAgent = navigator.userAgent || navigator.vendor;
                var openId;
                if (userAgent) {
                    var match = /openid:(\S*)/.exec(userAgent);
                    if (match)
                        openId = match[1];
                }
                return openId;
            }

            /**
             * Get user list from Dingyuehao
             */
            function getUserList() {
                var d = $q.defer();
                d.resolve('TODO: need call zhaohu');
                return d.promise;
            }

            /**
             * Share a URL card to Dingyuehao
             * @param {object} card
             * @param card.title
             * @param card.content
             * @param card.type
             */
            function sendUrlCard(card) {
                var d = $q.defer();
                var openId = getCurrentUserOpenId();
                // openId='EE1581E925628EC130FD1C7273F4D76A';
                var params = {
                    title: card.title,
                    url: card.content,
                    fromOpenId: openId,
                    toOpenId: openId
                };
                restUtils.callApi('bot', 'POST', '/api/bot/commander/share', {}, params).then(function (data) {
                    d.resolve(data);
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            }
        }
    }
)();