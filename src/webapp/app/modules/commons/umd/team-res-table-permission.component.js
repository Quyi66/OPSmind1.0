(function () {
    'use strict';


    angular.module('oplus.commons').component('teamResTablePermission', {
        bindings: {
            moduleData: '=',
            appModule: '<appModule',
            showPermissionRWX: '='
        },
        templateUrl: 'app/modules/commons/umd/team-res-table-permission.html',
        controller: ['$scope', '$state', '$q', 'opDatatable', 'messageService', '$translate', '$window', 'restUtils', teamResTablePermissionController]
    });

    teamResTablePermissionController.$inject = ['$scope', '$state', '$q', 'opDatatable', 'messageService', '$translate', '$window', 'restUtils'];


    function teamResTablePermissionController($scope, $state, $q, opDatatable, messageService, $translate, $window, restUtils) {
        var vm = this;
        this.changePermissions = changePermissions;
        var r = 'r';
        var w = 'w';
        var x = 'x';
        vm.$onInit = onInit;
        var tableHeaderExtra = [];
        var tableData = [];
        var permissionData = [];

        vm.cancel = cancel;

        function onInit() {
            $scope.$watch('$ctrl.moduleData', function (newVal, oldVal) {
                if (undefined !== newVal) {
                    vm.moduleData = newVal;
                    init();
                }
            }, true);
        }


        function constructCheckboxHtml(data, teamName, row) {
            var id = row.id;
            // 凭借唯一id
            var input_id_prefix = id + teamName;
            var input_idr = input_id_prefix + r;
            var input_idw = input_id_prefix + w;
            var input_idx = input_id_prefix + x;
            var check_r = _.includes(data, r);
            var check_w = _.includes(data, w);
            var check_x = _.includes(data, x);

            var ng_show_r = _.includes(vm.showPermissionRWX, r);
            var ng_show_w = _.includes(vm.showPermissionRWX, w);
            var ng_show_x = _.includes(vm.showPermissionRWX, x);


            // debugger;
            // '"' + ' ng-show="'+ ng_show_rwx +'"' +

            var html = '<div class="">\n' +
                '        <div class="form-control-wrapper d-inline-block">\n' +
                '            <div class="opx-check-group opx-secondary btn-group">\n' +
                '    <input type="checkbox"  name="r"' +
                '  id="' + input_idr + '"  ng-checked="' + check_r + '"' + ' ng-show="' + ng_show_r + '"' + +'>' +
                '           ng-click="$ctrl.changePermissions(\'' + teamName + '\',' + '\'' + id + '\',' + '\'' + input_id_prefix + '\',\'' + r + '\')"' + ' >' +
                '                <label for="' + input_idr + '"' + ' ng-show="' + ng_show_r + '"' + +'>' + '>R</label>&nbsp;\n' +
                '    <input type="checkbox"  name="w"' +
                '  id="' + input_idw + '"  ng-checked="' + check_w + '"' + ' ng-show="' + ng_show_w + '"' + +'>' +
                '           ng-click="$ctrl.changePermissions(\'' + teamName + '\',' + '\'' + id + '\',' + '\'' + input_id_prefix + '\',\'' + w + '\')"' + ' >' +
                '                <label for="' + input_idw + '"' + ' ng-show="' + ng_show_w + '"' + +'>' + '>W</label>&nbsp;\n' +
                '    <input type="checkbox"  name="x"' + ' ng-show="' + ng_show_x + '"' + +'>' +
                '  id="' + input_idx + '"  ng-checked="' + check_x + '"' +
                '           ng-click="$ctrl.changePermissions(\'' + teamName + '\',' + '\'' + id + '\',' + '\'' + input_id_prefix + '\',\'' + x + '\')"' + ' >' +
                '                <label for="' + input_idx + '"' + ' ng-show="' + ng_show_x + '"' + +'>' + '>X</label>&nbsp;\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </div>';
            return html;
        }


        function changePermissions(teamName, id, input_id_prefix, per) {
            //1. 找到对应的id， 拿出对应的团队值
            //2. 如果有则pull掉，没有则增加进来
            var input_idr = input_id_prefix + r;
            var input_idw = input_id_prefix + w;
            var input_idx = input_id_prefix + x;
            // 校验当前开关状态
            var is_checked = angular.element('#' + input_id_prefix + per).is(":checked");
            var rowData = _.find(permissionData, function (o) {
                return o.id === id;
            });
            _.forIn(rowData, function (value, key) {
                if (key === 'teamInfo') {
                    // 判断是否有这个obj， 如果没有则push一个新的进来
                    var find_obj = _.find(value, function (o) {
                        return o.teamName === teamName;
                    });
                    if (undefined === find_obj) {
                        value.push({"teamName": teamName, "permission": [per]});
                    } else {
                        for (var i in value) {
                            var te = value[i];
                            if (te.teamName === teamName) {
                                // var findPer = _.find(te.permission, function (o) {
                                //     return o === per;
                                // });
                                if (is_checked) {
                                    if (per === r) {
                                        te.permission.push(r);
                                    } else if (per === w) {
                                        $("#" + input_idr).prop("checked", "checked");
                                        te.permission.push(r);
                                        te.permission.push(w);
                                    } else {
                                        $("#" + input_idr).prop("checked", "checked");
                                        // $("#" + input_idw).prop("checked", "checked");
                                        te.permission.push(r);
                                        // te.permission.push(w);
                                        te.permission.push(x);
                                    }
                                } else {
                                    if (per === r) {
                                        $("#" + input_idw).prop("checked", "");
                                        $("#" + input_idx).prop("checked", "");
                                        _.pull(te.permission, r);
                                        _.pull(te.permission, w);
                                        _.pull(te.permission, x);
                                    } else if (per === w) {
                                        // $("#" + input_idx).prop("checked", "");
                                        _.pull(te.permission, w);
                                        // _.pull(te.permission, x);
                                    } else {
                                        _.pull(te.permission, x);
                                    }
                                }
                            }
                        }
                    }
                }
            });
            // 调用保存接口
            $scope.save();
        }


        function init() {
            prepareColumn().then(function (teamNames) {
                // 处理表头数据
                var tableColumnConfig = [{
                    data: 'id',
                    title: "id",
                    visible: false
                }, {
                    data: 'groupInfo',
                    title: "info"
                }];
                // 处理通用逻辑
                var uniqExtra = _.uniq(tableHeaderExtra);
                for (var k in uniqExtra) {
                    var extraName = uniqExtra[k];
                    tableColumnConfig.push({data: extraName, title: extraName});
                }

                for (var i in teamNames) {
                    var teamName = teamNames[i];
                    (function (teamName) {
                        tableColumnConfig.push({
                            data: teamName, title: teamName, class: 'text-center', orderable: false,
                            render: function (data, type, user, meta) {
                                return constructCheckboxHtml(data, teamName, user);
                            }
                        });
                    })(teamName);
                }
                // 处理data数据
                vm.tableConfig = {
                    data: tableData,
                    columns: tableColumnConfig
                };
            });
        }


        function prepareColumn() {
            var defer = $q.defer();
            // var tableData = [];
            var teamNames = [];
            vm.moduleData.map(function (g) {
                var cloneG = _.cloneDeep(g);
                var extra_param = cloneG.extra_param;
                for (var i in extra_param) {
                    var param = extra_param[i];
                    tableHeaderExtra.push(param.name);
                    cloneG[param.name] = param.data;
                }
                // teamInfo
                var teamInfo = cloneG.teamInfo;
                for (var j in teamInfo) {
                    var team = teamInfo[j];
                    cloneG[team.teamName] = team.permission;
                    teamNames.push(team.teamName);
                }
                tableData.push(cloneG);
            });
            defer.resolve(_.uniq(teamNames));
            permissionData = _.cloneDeep(vm.moduleData);
            return defer.promise;
        }

        $scope.save = _.debounce(function () {
            saveTablePermission(JSON.stringify(permissionData)).then(function () {
                // todo: 同步保存，不用再点击保存按钮
                // messageService.toast("success", $translate.instant('common.messages.operation.success'));
                // $state.reload();
            }).catch(function (err) {
                messageService.toast("error", $translate.instant('common.messages.operation.failed'), err.message);
            });
            // 保存逻辑
        }, 2000);




        function saveTablePermission(data) {
            return restUtils.callApi('portal', 'POST', '/api/team/permission/table/permission/{module}', {module: vm.appModule}, data);
        }


        function cancel() {
            $state.reload();
        }

    }
})();
