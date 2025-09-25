/**
 * 巡检模版分配 控制器
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('PatrolAssignController', PatrolAssignController);

    PatrolAssignController.$inject = ['$scope', '$q', '$translate', '$compile', 'cacTemplateService', 'messageService'];

    function PatrolAssignController($scope, $q, $translate, $compile, cacTemplateService, messageService) {
        var vm = this;
        vm.teamOptions = [];
        vm.teamOptionsMap = {};
        vm.selectedTeam = {}; // { templateId: teamId }
        vm.onTeamChange = onTeamChange;

        // 预加载团队下拉选项（首项为空，表示清除关联；其后为不重复的团队名称）
        var teamOptionsPromise = loadTeamOptions();
        initTable();

        function loadTeamOptions() {
            return cacTemplateService.getTeamsInfo().then(function (map) {
                vm.teamOptions = [{id: '', name: ''}];
                vm.teamOptionsMap = {};
                vm.teamNameToId = {};
                // 预置空白占位，后续忽略所有空白名称，避免出现多个空白选项
                var usedNames = {'': true};
                if (map) {
                    Object.keys(map).forEach(function (id) {
                        var raw = map[id];
                        var name = (raw == null ? '' : ('' + raw)).trim().replace(/\s+/g, ' ');
                        // 空白名称跳过（已添加了顶部空白项用于清除关联）
                        if (!name) {
                            vm.teamOptionsMap[id] = '';
                            return;
                        }
                        // 跳过重复名称（保留第一个）
                        if (!usedNames[name]) {
                            usedNames[name] = true;
                            vm.teamOptions.push({id: id, name: name});
                            if (!vm.teamNameToId[name]) vm.teamNameToId[name] = id;
                        }
                        vm.teamOptionsMap[id] = name;
                    });
                }
            }).catch(function (err) {
                messageService.toast('error', '加载团队列表失败', err && err.message ? err.message : '');
            });
        }

        function initTable() {
            var columns = [
                {
                    mData: 'templateName',
                    title: $translate.instant('common.entity.detail.name'),
                    render: function (data, type, row) {
                        var name = row.templateName || '';
                        var descHtml = row.description ? '<p class="help-block">' + row.description + '</p>' : '';
                        return '<div class="d-block">' + name + descHtml + '</div>';
                    }
                },
                {
                    mData: 'templateId',
                    title: '关联团队',
                    render: function (data, type, row) {
                        var tid = row.templateId;
                        var html = '' +
                            '<select class="form-control form-control-sm" ' +
                            'ng-model="vm.selectedTeam[\'' + tid + '\']" ' +
                            'ng-change="vm.onTeamChange(\'' + tid + '\')" ' +
                            'ng-options="opt.id as opt.name for opt in vm.teamOptions track by opt.id">' +
                            '</select>';
                        return html;
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                },
                {
                    mData: 'updatedAt',
                    title: $translate.instant('team.update_time'),
                    render: function (data) {
                        return data ? $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss') : '';
                    }
                }
            ];

            $scope.tableConfig = {
                data: [getAssignments, ''],
                columns: columns,
                order: [[2, 'desc']],
                buttons: ['reload']
            };

            function getAssignments() {
                var d = $q.defer();
                cacTemplateService.getTemplates().then(function (templates) {
                    if (!templates || !templates.length) {
                        d.resolve([]);
                        return;
                    }
                    var tasks = templates.map(function (tpl) {
                        return cacTemplateService.getCacTeamConfig(tpl.id).then(function (teamMap) {
                            var selectedId = '';
                            if (teamMap && Object.keys(teamMap).length) {
                                // 取第一个已关联团队作为默认选中
                                selectedId = Object.keys(teamMap)[0] || '';
                            }
                            // 使用去重后的选项（按名称映射到保留的ID）；若未加载完选项或未命中则回退到原ID
                            var mappedId = (vm.teamNameToId && teamMap && selectedId) ? (vm.teamNameToId[teamMap[selectedId]] || selectedId) : selectedId;
                            vm.selectedTeam[tpl.id] = mappedId;
                            return {
                                templateId: tpl.id,
                                templateName: tpl.templateName,
                                description: tpl.description,
                                updatedAt: tpl.updatedAt || tpl.executedAt || tpl.createdAt
                            };
                        });
                    });
                    $q.all(tasks).then(function (rows) {
                        d.resolve(rows);
                    }).catch(function (err) {
                        messageService.toast('error', '加载巡检模版分配失败', err && err.message ? err.message : '');
                        d.resolve([]);
                    });
                }).catch(function (err) {
                    messageService.toast('error', '加载巡检模版失败', err && err.message ? err.message : '');
                    d.resolve([]);
                });
                return d.promise;
            }

            // 切换团队：保证单选（清空=取消所有关联；选择某一团队=移除其他、保留/添加该团队）
        }

        // 切换团队：保证单选（清空=取消所有关联；选择某一团队=移除其他、保留/添加该团队）
        function onTeamChange(templateId) {
            var newTeamId = vm.selectedTeam[templateId] || '';
            // 读取当前关联
            cacTemplateService.getCacTeamConfig(templateId).then(function (teamMap) {
                teamMap = teamMap || {};
                var currentIds = Object.keys(teamMap);

                var ops = $q.when();

                if (!newTeamId) {
                    // 清空：逐个移除已有关联
                    currentIds.forEach(function (id) {
                        var payload = { templateId: templateId, teamId: id, teamName: teamMap[id] };
                        ops = ops.then(function () { return cacTemplateService.saveTeamsInfo(payload); });
                    });
                } else {
                    // 先移除除新选择外的所有关联
                    currentIds.filter(function (id) { return id !== newTeamId; }).forEach(function (id) {
                        var payload = { templateId: templateId, teamId: id, teamName: teamMap[id] };
                        ops = ops.then(function () { return cacTemplateService.saveTeamsInfo(payload); });
                    });
                    // 如未关联所选团队，则添加
                    if (currentIds.indexOf(newTeamId) === -1) {
                        var name = vm.teamOptionsMap[newTeamId] || '';
                        var addPayload = { templateId: templateId, teamId: newTeamId, teamName: name };
                        ops = ops.then(function () { return cacTemplateService.saveTeamsInfo(addPayload); });
                    }
                }

                ops.then(function () {
                    messageService.toast('success', '保存成功');
                }).catch(function (err) {
                    messageService.toast('error', '保存失败', err && err.message ? err.message : '');
                });
            }).catch(function (err) {
                messageService.toast('error', '获取当前关联失败', err && err.message ? err.message : '');
            });
        }
    }
})();
