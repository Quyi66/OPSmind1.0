/**
 *
 * 检测浏览器版本
 *
 *
 * @author Joker Liu (qdjoker@126.com), created on 8/6/2020
 */
(function () {
    'use strict';
    angular.module('oplus.commons').directive('opBrowserSupport', ['messageService', opBrowserSupport]);

    function opBrowserSupport(messageService) {
        return {
            restrict: 'EA',
            scope: {},
            link: function (scope, element, attrs, controller) {

                var allSupportBrowser = {
                    Chrome: {latestVersion: '52'},
                    Firefox: {latestVersion: '50'},
                    EDGE: {latestVersion: '0'},
                    IE: {latestVersion: '11'}
                };

                if (window.$oplus.appConfig.supportBrowser) {
                    allSupportBrowser = _.merge(allSupportBrowser, window.$oplus.appConfig.supportBrowser);
                }

                var currentBrowserInfo = getExploreInfo();
                var supportBrowser = allSupportBrowser[currentBrowserInfo.type];
                if (!(supportBrowser && compareVersion(currentBrowserInfo.version, supportBrowser.latestVersion))) {
                    messageService.confirm($translate.instant('common.messages.compatibility_problems'), $translate.instant('common.messages.recommend') + Object.keys(allSupportBrowser).map(function (value) {
                        var version = allSupportBrowser[value].latestVersion;
                        return value + (version === '0' ? '' : (' ' + version + '+'));
                    }).join(' , '));
                }

                /**
                 * 获取浏览器累心和版本号
                 *  {
                 *      type: 'IE',//IE|EDGE|Firefox|Opera|Chrome|Safari
                 *      version: '84.88.44'
                 *  }
                 *
                 *  所有字段解析自 window.navigator.userAgent
                 *
                 * @returns {{type: string, version: string}}
                 */
                function getExploreInfo() {
                    var userAgent = navigator.userAgent.toLowerCase();
                    var version;
                    if (version = userAgent.match(/rv:([\d.]+)\) like gecko/)) {
                        return {type: 'IE', version: version[1]};
                    } else if (version = userAgent.match(/msie ([\d\.]+)/)) {
                        return {type: 'IE', version: version[1]};
                    } else if (version = userAgent.match(/edge\/([\d\.]+)/)) {
                        return {type: 'EDGE', version: version[1]};
                    } else if (version = userAgent.match(/firefox\/([\d\.]+)/)) {
                        return {type: 'Firefox', version: version[1]};
                    } else if (version = userAgent.match(/(?:opera|opr).([\d\.]+)/)) {
                        return {type: 'Opera', version: version[1]};
                    } else if (version = userAgent.match(/chrome\/([\d\.]+)/)) {
                        return {type: 'Chrome', version: version[1]};
                    } else if (version = userAgent.match(/version\/([\d\.]+).*safari/)) {
                        return {type: 'Safari', version: version[1]};
                    } else {
                        return {type: 'Unknown', version: 'Unknown'};
                    }
                }

                function compareVersion(current, require) {
                    var currentArr = current.split('.');
                    var requireArr = require.split('.');

                    var length = Math.min(currentArr.length, requireArr.length);

                    var result = true;
                    for (var i = 0; i < length; i++) {
                        if (parseInt(currentArr[i]) < parseInt(requireArr[i])) {
                            result = false;
                            break;
                        }
                    }

                    return result;
                }
            }
        }
    }
})();
