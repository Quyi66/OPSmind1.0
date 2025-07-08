/**
 * @author luohuanjiang@famessoft.com, created on 2024/06/26
 */
(function () {
    'use strict';

    angular.module('oplus.cac').controller('structuralDiagramCtrl', structuralDiagramCtrl);

    structuralDiagramCtrl.$inject = ['$scope', 'cacResultService', '$stateParams', '$uibModal', '$q', '$translate', 'currentUser', '$timeout'];

    function structuralDiagramCtrl($scope, cacResultService, $stateParams, $uibModal, $q, $translate, currentUser, $timeout) {
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
                    let oneCounts = 0;
                    let towCounts = 0;
                    let rootCounts = 0;//根目录下有多少一级目录
                    let pd = true;

                    var dom = document.getElementById("eechart5");
                    var myChart = echarts5.init(dom);

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

                    function recursionFun(data) {

                        for (let i = 0; i < data.length; i++) {
                            if (data[i].type == 'root') {
                                rootCounts = data[i].children.length;//根目录
                            }
                            if (data[i].type == 'sub') {
                                oneCounts++;//获取一级业务数量
                            }
                            if (data[i].type == 'item') {
                                // data[i].symbolSize = 20;
                                // data[i].itemStyle = {color: '#dc3545'};
                                towCounts++;//获取二级业务数量
                            }

                            if (data[i].children.length > 0) {
                                recursionFun(data[i].children);
                            }
                        }

                        if (rootCounts === oneCounts && pd && towCounts > 20) {
                            const compareHeight = 40 * (towCounts - 20);
                            const customHeight = 620
                            var currentHeight = compareHeight + customHeight;
                            dom.style.height = currentHeight + 'px';
                            myChart.resize();
                            pd = false;
                        }
                        return data;
                    }

                    $scope.option = {
                        toolbox: {
                            show: true,
                            feature: {
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        series: [
                            {
                                type: 'tree',
                                data: recursionFun(_data),
                                top: '2%',
                                left: '33%',
                                bottom: '2%',
                                right: '40%',
                                itemStyle: {
                                    borderColor: '#99512F',
                                    borderWidth: 2,
                                    backgroundColor: '#ffffff'
                                },
                                lineStyle: {
                                    color: '#99512F',
                                    width: 2,
                                    curveness: 0.3
                                },
                                symbolSize: 7,
                                label: {
                                    position: 'left',
                                    formatter: function (params) {
                                        if ("root" === params.data.type) {
                                            return [`{root_name|${params.data.name}}`, ' ', `{root_count|${params.data.count}}`].join('');
                                        }
                                        if ("sub" === params.data.type) {
                                            return [`{sub_name|${params.data.name}}`, ' ', `{sub_count|${params.data.count}}`].join('');
                                        }
                                    },
                                    rich: {
                                        root_name: {
                                            verticalAlign: 'middle',
                                            align: 'right',
                                            borderColor: '#000000',
                                            borderWidth: 0,
                                            borderRadius: 6,
                                            padding: [5, 10, 5, 10],
                                            backgroundColor: '#ff5e63',
                                            color: '#ffffff',
                                            distance: 10,
                                        },
                                        root_count: {
                                            padding: [7, 10, 4, 8],
                                            color: '#ffffff',
                                            backgroundColor: '#dc3545',
                                            fontWeight: 'bold',
                                            borderRadius: 50,
                                        },
                                        sub_count: {
                                            padding: [7, 10, 4, 8],
                                            color: '#ffffff',
                                            backgroundColor: '#dc3545',
                                            fontWeight: 'bold',
                                            borderRadius: 50,
                                        },
                                        sub_name: {
                                            verticalAlign: 'middle',
                                            align: 'right',
                                            borderColor: '#000000',
                                            borderWidth: 0,
                                            borderRadius: 6,
                                            padding: [5, 10, 5, 10],
                                            backgroundColor: '#ff5e63',
                                            color: '#ffffff',
                                        },
                                    }
                                },
                                leaves: {
                                    label: {
                                        //position: ['-20%', '-70%'],
                                        position: 'right',
                                        formatter: function (params) {
                                            return [`{count|${params.data.count}}`, ' ', `{name|${params.data.name}}`].join('');
                                        },
                                        rich: {
                                            count: {
                                                padding: [7, 10, 4, 8],
                                                color: '#ffffff',
                                                backgroundColor: '#dc3545',
                                                fontWeight: 'bold',
                                                borderRadius: 50,
                                            },
                                            name: {
                                                verticalAlign: 'middle',
                                                align: 'left',
                                                show: true,
                                                fontSize: 10,
                                                fontWeight: 400,
                                                borderColor: '#99512F',
                                                borderWidth: 1,
                                                borderRadius: 6,
                                                padding: [5, 10, 5, 10],
                                                backgroundColor: '#ffffff',
                                                color: 'black',
                                                distance: 10,
                                            },
                                        },
                                    }
                                },
                                animationDurationUpdate: 750
                            }
                        ],
                    };
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
