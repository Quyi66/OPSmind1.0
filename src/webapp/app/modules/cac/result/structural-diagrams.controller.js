/**
 * @author luohuanjiang@famessoft.com, created on 2024/06/26
 */
(function () {
    'use strict';

    angular.module('oplus.cac').controller('structuralDiagramCtrls', structuralDiagramCtrls);

    structuralDiagramCtrls.$inject = ['$scope', 'cacResultService', '$stateParams', '$uibModal', '$q', '$translate', 'currentUser', '$timeout'];

    function structuralDiagramCtrls($scope, cacResultService, $stateParams, $uibModal, $q, $translate, currentUser, $timeout) {
        var vm = this;
        vm.$onInit = onInit;
        var jobId = $stateParams.jobId;
        var biaoji = "";

        vm.views = {
            job: {},
            exportExcel: exportExcel,
            downloadBtn: downloadBtn
        }
        vm.params = {
            "job_id": $stateParams.jobId
        }

        function onInit() {
            if (jobId != null) {
                getJob(jobId);
                cacResultService.getStructuralDiagram(jobId).then(function (_data) {
                    let towCounts = 0;

                    function recursionFun(data) {
                        for (let i = 0; i < data.length; i++) {
                            // 根据type标识符判断当前阶段是否需要竖向
                            if (data[i].type == 'item') {
                                // let kuan = 35;
                                // let output = getEnglishIndices(data[i].name);
                                // data[i].name = '\n\n' + output.processedString;
                                // if (output.englishLengths > 5) {
                                //     kuan = (output.englishLengths * 8);
                                // }
                                let jieQu = 10;
                                if (data[i].name.length > jieQu) {
                                    //data[i].name = '\n\n' + data[i].name.substr(0, jieQu) + '..';
                                    data[i].name = '\n\n' + getJoinStr(data[i].name);
                                } else {
                                    data[i].name = '\n\n' + data[i].name;
                                }
                                data[i].symbolSize = 30;
                                //data[i].itemStyle = {color: '#dc3545'}; //单独设置节点样式'
                                towCounts++;//获取二级业务数量
                            }
                            if (data[i].type == 'sub') {
                                data[i].symbolSize = 30;
                                //data[i].itemStyle = {color: '#dc3545'}; //单独设置节点样式'
                                // let width = getTextWidth(data[i].name, '13px Arial');
                                // width = width < 50 ? 50 : (width + 20);
                                // data[i].symbolSize = [width, 50];
                            }
                            if (data[i].type == 'root') {
                                let width = getTextWidth(data[i].name, '13px Arial');
                                data[i].symbolSize = [width, 50];
                                data[i].itemStyle = {color: '#259662'}; //单独设置节点样式'
                                data[i].symbol = 'rect'; // 节点标记形状
                            }

                            if (data[i].children.length > 0) {
                                recursionFun(data[i].children);
                            }
                        }
                        return data;
                    }

                    function getLeaveData(data, leaveData) {
                        for (let i = 0; i < data.length; i++) {
                            const item = data[i];
                            if (item.children.length > 0) getLeaveData(item.children, leaveData);
                            else {
                                leaveData.push(item);
                            }
                        }
                    }

                    function getTextWidth(text, font) {
                        // 创建一个canvas元素
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        // 设置字体
                        ctx.font = font;
                        // 测量文本宽度
                        const width = ctx.measureText(text).width;
                        // 返回宽度
                        return width;
                    }

                    function getJoinStr(originalString) {
                        //let indicesToInsert = [6, 8, 10, 12, 14];
                        let indicesToInsert = [10, 10, 10, 10];
                        let resultString = "";
                        let dangQianStr = "";
                        for (let i = 0; i < indicesToInsert.length; i++) {
                            if (i !== 0 && dangQianStr === "") {
                                continue
                            }
                            resultString += i === 0 ? originalString.slice(i, indicesToInsert[i]) : "\n" + dangQianStr.slice(0, indicesToInsert[i]);
                            dangQianStr = i === 0 ? originalString.slice(indicesToInsert[i], originalString.length) : dangQianStr.slice(indicesToInsert[i], dangQianStr.length);
                        }
                        return resultString;
                    }

                    function getEnglishIndices(str) {
                        let indices = []; // 用于存储英文单词的起始和结束下标
                        let startIndex = null; // 英文单词的起始下标
                        for (let i = 0; i < str.length; i++) {
                            const char = str[i];
                            if (/[A-Za-z]/.test(char) && startIndex === null) {
                                startIndex = i;
                            } else if (!/[A-Za-z]/.test(char) && startIndex !== null) {
                                indices.push({start: startIndex, end: i - 1}); // 结束下标是上一个英文字符的索引
                                startIndex = null; // 重置起始下标以寻找下一个英文单词
                            } else if (i === str.length - 1 && /[A-Za-z]/.test(char) && startIndex !== null) {
                                indices.push({start: startIndex, end: i}); // 结束下标是当前索引
                            }
                        }
                        let result = processString(str, indices);
                        return result;
                    }

                    function processString(str, indices) {
                        let englishLengths = 0;
                        for (let i = 0; i < indices.length; i++) {
                            let index = indices[i].end + i + 1;
                            let temp = (indices[i].end + 1) - indices[i].start;
                            englishLengths = englishLengths > temp ? englishLengths : temp;
                            str = str.slice(0, index) + '\n' + str.slice(index);
                        }
                        let newStr = str.replace(/[\u4e00-\u9fa5]/g, function (match) {
                            return match + '\n';
                        });
                        newStr = newStr.trim();
                        return {
                            processedString: newStr,
                            englishLengths: englishLengths
                        };
                    }


                    var dom = document.getElementById("eechart5");
                    var tooltip = document.getElementById('tooltip');
                    var myChart = echarts5.init(dom);

                    // let debouncedMouseMove = _.debounce(function (params) {
                    //     // 编写逻辑
                    //     if (params.data.type === "item") {
                    //         if (params.data.name != biaoji) {
                    //             biaoji = params.data.name;
                    //         } else {
                    //             biaoji = "";
                    //             return;
                    //         }
                    //         tooltip.style.display = 'block';
                    //         tooltip.style.left = (params.event.event.clientX - 145) + "px"; // 偏移一些距离，以便 tooltip 不会紧贴着鼠标指针
                    //         tooltip.style.top = (params.event.event.clientY - 260) + "px"; // 考虑到 tooltip 的高度，以便它不会超出容器
                    //         tooltip.textContent = params.data.title;
                    //     }
                    // }, 100); // 500 毫秒内只执行一次

                    // myChart.on('mousemove', function (event) {
                    //     debouncedMouseMove(event); // 传递 ECharts 的 mousemove 事件参数给防抖函数
                    // });
                    //
                    // dom.addEventListener('mouseleave', function () {
                    //     tooltip.style.display = 'none';
                    // });

                    function calculateWidth(data) {
                        let leaveData = [];
                        getLeaveData(data, leaveData);
                        let font = '20px Arial';

                        return 150 * leaveData.length;

                        // return _.reduce(leaveData, function (prev, curr, idx) {
                        //     if (idx === 1) prev = getTextWidth(curr.title, font)
                        //     return prev + getTextWidth(curr.title, font)

                        // })
                    }

                    myChart.on('dblclick', function (params) {
                        if ("sub" === params.data.type) {
                            var instance = $uibModal.open({
                                templateUrl: 'app/modules/cac/result/structural-one-desc.html',
                                controller: ['$scope', '$uibModalInstance', '$q', function ($scope, $uibModalInstance, $q) {
                                    var that = this;
                                    that.cancel = cancel;
                                    that.counts = [];
                                    that.maps = {
                                        jobId: jobId,
                                        primaryService: params.data.name
                                    };

                                    var tableColumns = [
                                        {
                                            data: 'name',
                                            title: $translate.instant("cac.structural.secondary_service_name")
                                        },
                                        {data: 'contItem', title: $translate.instant("cac.structural.item_err_count")},
                                        {data: 'contHost', title: $translate.instant("cac.structural.item_host_count")},
                                    ];

                                    that.tableConfig = {
                                        data: [getPromise],
                                        columns: tableColumns,
                                        order: [[0, 'desc']],
                                        buttons: ['reload']
                                    }

                                    function cancel() {
                                        $uibModalInstance.close({action: "cancel"});
                                    }

                                    function getPromise() {
                                        let deferred = $q.defer();
                                        cacResultService.structuralDiagramPrimaryInfo(that.maps).then(function (data) {
                                            that.counts[0] = data.primaryData.length;
                                            that.counts[1] = data.itemTotal;
                                            that.counts[2] = data.hostTotal;
                                            deferred.resolve(data.primaryData);
                                        }).catch(function (err) {
                                            throw err;
                                        });
                                        return deferred.promise;
                                    }
                                }],
                                controllerAs: '$ctrl',
                                size: 'lg',
                                backdrop: true
                            });

                        }
                    })

                    myChart.on('click', function (params) {
                        if ("item" === params.data.type) {
                            var instance = $uibModal.open({
                                templateUrl: 'app/modules/cac/result/structural-two-desc.html',
                                controller: ['$scope', '$uibModalInstance', '$q', function ($scope, $uibModalInstance, $q) {
                                    var that = this;
                                    that.cancel = cancel;
                                    that.counts = [];
                                    that.maps = {
                                        jobId: jobId,
                                        primaryService: params.data.value.split("::")[0],
                                        secondaryService: params.data.value.split("::")[1]
                                    };
                                    that.descYW = descYW;

                                    var tableColumnsItem = [
                                        {data: 'item', title: $translate.instant("cac3.table_fields.patrol_item_name")},
                                        {
                                            data: 'count',
                                            title: $translate.instant("common.term.failed") + $translate.instant("app_um.scan_host_count"),
                                            render: function (data, type, row, meta) {
                                                var html = '<div class="btn-group">' +
                                                    '    <button class="btn btn-danger btn-sm" ng-click="$ctrl.descYW(\'' + row.host + '\',\'' + $translate.instant("app_uim.user.table.header.hostname") + '\')">' + row.count + '</button>' +
                                                    '</div>'
                                                return html
                                            }
                                        }
                                    ];
                                    var tableColumnsHost = [
                                        {data: 'host', title: $translate.instant("app_uim.user.table.header.hostname")},
                                        {
                                            data: 'count',
                                            title: $translate.instant("common.term.failed") + $translate.instant("cac.result.detail.check_item"),
                                            render: function (data, type, row, meta) {
                                                var html = '<div class="btn-group">' +
                                                    '    <button class="btn btn-danger btn-sm" ng-click="$ctrl.descYW(\'' + row.item + '\',\'' + $translate.instant("cac3.table_fields.patrol_item_name") + '\')">' + row.count + '</button>' +
                                                    '</div>'
                                                return html
                                            }
                                        }
                                    ];
                                    that.tableConfigItem = {
                                        data: [getPromiseItem],
                                        columns: tableColumnsItem,
                                        order: [[1, 'desc']],
                                        buttons: ['reload']
                                    }

                                    that.tableConfigHost = {
                                        data: [getPromiseHost],
                                        columns: tableColumnsHost,
                                        order: [[1, 'desc']],
                                        buttons: ['reload']
                                    }

                                    function cancel() {
                                        $uibModalInstance.close({action: "cancel"});
                                    }

                                    function getPromiseItem() {
                                        let deferred = $q.defer();
                                        cacResultService.structuralDiagramHostItemInfo(that.maps).then(function (data) {
                                            that.counts[0] = data.itemLists.length;
                                            deferred.resolve(data.itemLists);
                                        }).catch(function (err) {
                                            throw err;
                                        });
                                        return deferred.promise;
                                    }

                                    function getPromiseHost() {
                                        let deferred = $q.defer();
                                        cacResultService.structuralDiagramHostItemInfo(that.maps).then(function (data) {
                                            that.counts[1] = data.hostLists.length;
                                            deferred.resolve(data.hostLists);
                                        }).catch(function (err) {
                                            throw err;
                                        });
                                        return deferred.promise;
                                    }

                                    function descYW(hostAndItem, name) {
                                        var results = hostAndItem.split(",");
                                        let hostAndItemData = results.map(item => ({name: item}));
                                        var instance = $uibModal.open({
                                            template: '' +
                                                '<div class="modal-header">' +
                                                '   <h3 class="modal-title">' + name + '{{ \'common.entity.action.list\' | translate}}</h3>' +
                                                '   <a ng-click="$ctrlItemAndHost.cancel()">' +
                                                '       <i class="fa fa-times" style="font-size: 20px;"></i>' +
                                                '   </a>' +
                                                '</div>' +
                                                '<div class="modal-body">' +
                                                '       <opx-datatable table-config="$ctrlItemAndHost.tableConfig">' +
                                                '       </opx-datatable>' +
                                                '</div>',
                                            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                                var ctrlThat = this;
                                                ctrlThat.cancel = cancel;

                                                function cancel() {
                                                    $uibModalInstance.close({action: "cancel"});
                                                }

                                                var tableColumns = [
                                                    {data: 'name', title: name},
                                                ];

                                                ctrlThat.tableConfig = {
                                                    data: hostAndItemData,
                                                    columns: tableColumns
                                                }

                                            }],
                                            controllerAs: '$ctrlItemAndHost',
                                            size: 'sm',
                                            backdrop: true
                                        });

                                    }

                                }],
                                controllerAs: '$ctrl',
                                size: 'lg',
                                backdrop: true
                            });
                        }
                    });


                    $scope.option = {
                        // tooltip 不生效（手动实现效果）
                        //  tooltip: {
                        //      show: true,
                        //      trigger: 'item',
                        //      triggerOn: 'mousemove',
                        //  },
                        series: [
                            {
                                type: 'tree',
                                data: recursionFun(_data),
                                initialTreeDepth: 2, //默认树展开的层数
                                // width: calculateWidth(_data),
                                left: '0%',
                                right: '0%',
                                top: '5%',
                                bottom: '20%',
                                // roam: true, //移动+缩放  'scale' 或 'zoom'：只能够缩放。 'move' 或 'pan'：只能够平移。
                                // scaleLimit: { //缩放比例
                                //     min: 0.7,//最小的缩放值
                                //     max: 4,//最大的缩放值
                                // },
                                //symbolSize: [100, 60], //设置框的大小
                                symbol: 'circle', // 节点标记形状
                                // symbolOffset: function (text, obj) { 
                                //     if (obj.data.children.length > 0) return [];
                                //     return [0, obj.dataIndex % 2 == 0 ? 20 : -15];
                                // },
                                // emphasis: {
                                //     focus: 'descendant'
                                // },
                                edgeShape: 'polyline', //设置连接线曲线还是折线，默认情况下是曲线，curve曲线 polyline直线
                                orient: 'vertical', //树整体的方向horizontal横向 vertical竖向
                                expandAndCollapse: true,
                                itemStyle: {
                                    color: '#dc3545',//节点颜色 全局
                                    borderColor: '#333',
                                    borderWidth: 0.1,
                                    overflow: 'truncate',
                                },
                                //lable 设置含有子节点的样式
                                label: {
                                    show: true,
                                    position: 'inside',
                                    textStyle: {
                                        fontSize: 10,
                                        color: '#fff',
                                        //fontWeight: 'bold'
                                    },
                                    verticalAlign: 'middle',
                                    align: 'center',
                                    height: 10,//控制1 2级节点的行高间距
                                    // width: 210,
                                    formatter: function (params) {
                                        if ("root" === params.data.type) {
                                            return [`{root_name|${params.data.name}\n}`,, `{root_count|${params.data.count}\n\n}`].join('');
                                        }
                                        if ("sub" === params.data.type) {
                                            return [`{sub_count|${params.data.count}\n\n}`, `{sub_name|${params.data.name}}`].join('');
                                        }
                                        if ("item" === params.data.type || "sub" === params.data.type) {
                                            return [`{count|${params.data.count}}`, `{name|${params.data.name}}`].join('');
                                        }
                                    },
                                    rich: {
                                        root_name:{
                                          fontSize: 10,
                                          padding: [2, 5, 6, 5],
                                          height:10,
                                          lineHeight: 12
                                        },
                                        root_count: {
                                            padding: [2, 5, 2, 5],
                                            marginTop:10,
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: 12,
                                            backgroundColor: '#BF221F',
                                            borderRadius: 5,
                                            lineHeight: 12
                                        },
                                        count: {
                                            //padding: [2, 5, 2, 5],
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: 12,
                                            //backgroundColor: '#BF221F',
                                            //borderRadius: 5,
                                            lineHeight: 12//todo
                                        },
                                        name: {
                                            color: 'black',
                                            fontSize: 10,
                                        },
                                        sub_count: {
                                            padding: [2, 5, 2, 5],
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: 12,
                                            lineHeight: 12//todo
                                        },
                                        sub_name: {
                                            lineHeight: 12,//todo
                                            align: 'left',
                                            fontSize: 10,
                                            borderColor: '#99512F',
                                            borderWidth: 0.6,
                                            borderRadius: 6,
                                            padding: [3, 6, 3, 6],
                                            backgroundColor: '#ffffff',
                                            color: 'black',
                                            distance: 10
                                        },
                                    }
                                },
                                leaves: {
                                    // 设置末节点的样式
                                    label: {
                                        position: 'inside',
                                        color: '#fff',
                                        // verticalAlign: 'middle',
                                        // align: 'center',
                                        height: 10,
                                        //width: 100,
                                        //fontWeight: 'bold'
                                    },

                                },
                                lineStyle: {
                                    color: '#99512F', //连接线的颜色
                                    width: 2,
                                },
                                animationDurationUpdate: 750,
                            },
                        ],
                    };

                    (function initAfterSetOption() {
                        let critical_value = 10;
                        if (towCounts >= critical_value) {
                            //二级业务超过critical_value,echarts生成完成后设置总宽度
                            let a_count = towCounts > critical_value ? (towCounts - critical_value) : (critical_value - towCounts);
                            let b_count = a_count * 150;
                            dom.style.width = (b_count + window.innerWidth) + 'px'; // 设置宽度
                            // 调用resize方法以确保echarts图表适配新的容器大小
                            myChart.resize();
                        }
                    })();

                }).catch(function (err) {
                    throw err;
                });
            }
        }

        function downloadBtn(event, type) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL（防止跳转页面）
            var dom = document.getElementById("eechart5");
            var myChart = echarts5.init(dom);
            var url = myChart.getDataURL({
                type: 'png',
                pixelRatio: 2,
                backgroundColor: '#fff'
            });
            var link = document.createElement('a');
            link.href = url;
            link.download = vm.views.job.templateName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        function getJob(jobId) {
            cacResultService.getJob(jobId).then(function (data) {
                vm.views.job = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function exportExcel(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL（防止跳转页面）
            var instance = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<button type="button" class="btn-close" data-dismiss="modal" title="' + $translate.instant('common.file.close_prompt') + '" ng-click="$ctrl.cancel()" style="margin-left: 95%;"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="op-blank-slate">' +
                    '<div class="op-blank-slate-icon">' +
                    '<i class="fa fa-4x fa-pulse fa-spinner fa-fw"></i>' +
                    '</div>' +
                    '<p class="op-flashing-text">' + $translate.instant('common.file.file_downloading') + '</p>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope', '$uibModalInstance', downloadExcel],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: 'static'
            });

            function downloadExcel($scope, $uibModalInstance) {
                var _downloadExcel = this;

                _downloadExcel.$onInit = initDownloadExcel;
                _downloadExcel.cancel = cancel;

                function cancel() {
                    $uibModalInstance.close({action: "cancel"});
                }

                function initDownloadExcel() {
                    var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/results/export/' + jobId;//请求的URl
                    var xhr = new XMLHttpRequest();//定义http请求对象
                    xhr.open("GET", url, true);
                    var token = currentUser.authToken;
                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.setRequestHeader("Language", $translate.use());
                    xhr.send();
                    xhr.responseType = "blob";  // 返回类型blob
                    xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                        if (this.status === 200) {
                            var blob = this.response;
                            var reader = new FileReader();
                            reader.readAsDataURL(blob);
                            $timeout(function () {
                                var d = new Date();
                                var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                                var a = document.createElement('a');
                                a.download = vm.views.job.templateName + datetime + ".xlsx";
                                a.href = reader.result;
                                $("body").append(a);
                                a.click();
                                $uibModalInstance.close(true);
                            }, 100);
                        } else {
                            $uibModalInstance.close(true);
                            messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                        }
                    }
                }

            }
        }
    }
})();
