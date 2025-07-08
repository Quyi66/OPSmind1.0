/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {

    "use strict";

    angular.module("oplus.cac").factory("cacService", cacService);

    cacService.$inject = ["$http", "cacDao", 'currentUser'];

    function cacService($http, cacDao, currentUser) {

        function prepareDatatable(selector, options) {
            var defaultOptions = {
                autoWidth: false,
                deferRender: true,
                processing: true,
                lengthMenu: [10, 25, 50, 100],
                colReorder: true,
                stateSave: true,//datatable分页刷新后 固定在当前页
                retrieve: true,//和destroy一起，用于屏蔽Cannot reinitialise DataTable提示的
                destroy: true,
                serverSide: false,//true表示服务器端分页，false表示前端分页
                pagingType: "full_numbers",
                //dom: '<"dataTables_header"<"dataTables_toolbar" <"dataTables_controls" r>f>>t<"dataTables_footer row"<"col-md-6" <"pull-left" l><"pull-left" i>><"col-md-6"p>><"clearfix">',
                dom: '<"dataTables_header"<"dataTables_toolbar" <"dataTables_controls" >f>>t<"dataTables_footer row"<"col-md-6" <"pull-left" l><"pull-left" i>><"col-md-6"p>><"clearfix">',
                createdRow: function (row, data, dataIndex) {
                },
                initComplete: function () {
                }
            };

            var tableOption = $.extend(true, {}, defaultOptions);
            if (options != null) {
                $.extend(true, tableOption, options);
            }
            return angular.element(selector).DataTable(tableOption);
        }

        function deleteAuditJsonAttr(json) {
            //删除json的属性
            for (var i = 0; i < json.length; i++) {
                delete json[i].templateRuleNames;
                delete json[i].templateHostNames;
                delete json[i].templateScriptNames;
                delete json[i].isExpanded;
                delete json[i].expandField;
            }
            return json;
        }

        //将后台返回的List数据组装成datatable要求的数据格式
        function assembleTable(ciList) {
            var tableObj = {
                aaData: [],
                totalRecords: 0
            };
            tableObj.aaData = ciList;
            tableObj.totalRecords = ciList.length;
            return tableObj
        }

        //组装datatable的url地址
        function assembleDataTableUrl(apiUrl) {
            var token = currentUser.authToken;
            //dataSrc处理服务器返回的数据格式，如果服务器返回的是数组类型，dataSrc就设为""
            var ajaxObj = {
                url: window.$oplus.appConfig.apiBaseUrls.cac + apiUrl,
                dataSrc: "",
                headers: {
                    "Authorization": 'Bearer ' + token
                    // "X-JWT-Authorization": 'Bearer ' + token
                }
            };
            return ajaxObj;
        }

        //更新auditParams
        function updateAuditParams(auditParams) {
            return cacDao.updateAuditParams(auditParams);
        }

        //查询巡检项白名单
        function getCheckWhiteList(templateId) {
            return cacDao.getCheckWhiteList(templateId);
        }

        //删除巡检项白名单
        function deleteCheckWhiteList(id) {
            return cacDao.deleteCheckWhiteList(id);
        }

        //校验检项白名单
        function findByCheckWhiteList(checkWhiteList) {
            return cacDao.findByCheckWhiteList(checkWhiteList);
        }

        //增加巡检项白名单
        function saveCheckWhiteList(checkWhiteList) {
            return cacDao.saveCheckWhiteList(checkWhiteList);
        }

        //判读字符串是否包含中文
        function isChinese(str) {
            var regex = /.*[\u4e00-\u9fa5]+.*$/;
            if (regex.test(str)) {
                return true;
            }
            return false;
        }

        // 计算文件大小函数(保留两位小数),Size为字节大小
        // size：初始文件大小
        function getFileSize(size) {
            if (!size)
                return "";

            var num = 1024.00; //byte

            if (size < num) {
                return size + "B";
            }
            if (size < Math.pow(num, 2)) {
                return (size / num).toFixed(2) + "K"; //kb
            }
            if (size < Math.pow(num, 3)) {
                return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
            }
            if (size < Math.pow(num, 4)) {
                return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
            }
            return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T

        }


        var service = {
            prepareDatatable: prepareDatatable,
            deleteAuditJsonAttr: deleteAuditJsonAttr,
            assembleTable: assembleTable,
            assembleDataTableUrl: assembleDataTableUrl,
            updateAuditParams: updateAuditParams,
            getCheckWhiteList: getCheckWhiteList,
            deleteCheckWhiteList: deleteCheckWhiteList,
            findByCheckWhiteList: findByCheckWhiteList,
            saveCheckWhiteList: saveCheckWhiteList,
            // getFileSize: getFileSize,
            isChinese: isChinese,
            playbookScripType: 'playbook',
            otherScriptType: 'adhoc',
            scriptZipType: 'zip' //区分脚本类型
        };
        return service;
    }


})();
