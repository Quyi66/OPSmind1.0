/**
 * @author chy, created on 2021-10-20.
 */

(function () {
        'use strict';
        var app = angular.module('oplus.mac');

        app.service('macService', macService);

        macService.$inject = ['currentUser', '$uibModal', 'messageApi', 'i18nService'];

        /**
         * @ngdoc service
         * @name MacService
         * @param currentUser {currentUser}
         * @param $uibModal
         * @param MessageApi
         */
        function macService(currentUser, $uibModal, messageApi, i18nService) {
            var that = this;

            // Data operation
            this.fetchNewMessagesCount = messageApi.fetchNewMessagesCount;
            this.fetchMessages = messageApi.fetchMessages;
            this.handleMessage = messageApi.handleMessage;
            this.convertToZhTWP = i18nService.translateTwp;
        }
    }
)();
