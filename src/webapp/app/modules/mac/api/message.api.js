/**
 *
 * @author chy, created on 22/10/2021
 */

(function () {
    'use strict';

    /**
     * Data Access Object for page.
     */
    angular.module('oplus.mac').service('messageApi', messageApi);

    messageApi.$inject = ['restUtils']

    function messageApi(restUtils) {

        var module = "mac";
        
        /**
         * 获取新消息数量
         */
        this.fetchNewMessagesCount = function (lastTimestamp) {
            return restUtils.callApi(module, 'GET',
                '/api/mac/messages/count?lastTimestamp={lastTimestamp}',
                { lastTimestamp: lastTimestamp },
                null,
                { ignoreLoadingBar: true });
        }
        /**
         * 分页获取消息
         */
        this.fetchMessages = function (pageNum, pageSize) {
            return restUtils.callApi(module, 'GET',
                '/api/mac/messages?pageNum={pageNum}&pageSize={pageSize}',
                { pageNum: pageNum, pageSize: pageSize },
                null,
                { ignoreLoadingBar: true });
        }

        /**
         * 加载页面
         * @param params
         */
        this.handleMessage = function (messageId) {
            return restUtils.callApi(module, 'PUT',
                '/api/mac/messages/{messageId}',
                { messageId: messageId });
        }
    }
})();
