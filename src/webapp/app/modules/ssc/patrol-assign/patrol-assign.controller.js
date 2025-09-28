/**
 * 巡检模版分配 控制器
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('PatrolAssignController', PatrolAssignController);

    PatrolAssignController.$inject = ['$scope', '$q', '$translate', '$compile', '$timeout', 'cacTemplateService', 'messageService', 'Team'];

    function PatrolAssignController($scope, $q, $translate, $compile, $timeout, cacTemplateService, messageService, Team) {
        var vm = this;
        vm.teamOptions = [];
        vm.teamOptionsMap = {};
        vm.teamLabelMap = {};
        vm.selectedTeam = {}; // { templateId: teamId }
        vm.onTeamChange = onTeamChange;
        vm._saving = {}; // 防重复提交标记：{templateId: boolean}

        // 不在页面进入时加载团队列表；仅在用户点击下拉时加载
        vm._teamsLoaded = false;
        vm._teamsPromise = null;
        // 页面打开即拉取团队信息，后续下拉点击仅展示
        ensureTeamsLoaded();
        initTable();

        function ensureTeamsLoaded() {
            if (vm._teamsLoaded && vm.teamOptions && vm.teamOptions.length) {
                return $q.when(vm.teamOptions);
            }
            if (vm._teamsPromise) return vm._teamsPromise;
            vm._teamsPromise = Team.findTeams().then(function (teams) {
                function clean(s) {
                    return (s == null ? '' : ('' + s))
                        .replace(/[\u200B-\u200D\uFEFF]/g, '')
                        .replace(/\u00A0/g, ' ')
                        .trim()
                        .replace(/\s+/g, ' ');
                }
                vm.teamOptions = [];
                vm.teamOptionsMap = {};
                vm.teamLabelMap = {};
                if (teams && teams.length) {
                    teams.forEach(function (t) {
                        var id = t.id;
                        var rawName = clean(t.name);
                        var code = clean(t.code);
                        var label = code ? (rawName + ' (' + code + ')') : rawName;
                        vm.teamOptions.push({ id: id, name: label });
                        vm.teamOptionsMap[id] = rawName;
                        vm.teamLabelMap[id] = label;
                    });
                }
                vm._teamsLoaded = true;
                return vm.teamOptions;
            }).catch(function (err) {
                messageService.toast('error', '加载团队列表失败', err && err.message ? err.message : '');
            }).finally(function () {
                vm._teamsPromise = null;
            });
            return vm._teamsPromise;
        }

        function normalizeTeamId(raw) {
            if (!raw) return '';
            if (Array.isArray(raw)) {
                return raw.length ? (raw[0] || '') : '';
            }
            var parts = ('' + raw).split(',').map(function (piece) {
                return piece ? piece.trim() : '';
            }).filter(function (piece) { return !!piece; });
            return parts.length ? parts[0] : '';
        }

        function normalizeTeamName(raw, teamIdRaw) {
            if (!raw) return '';
            var targetId = normalizeTeamId(teamIdRaw);
            if (!targetId) return raw;
            var parts = ('' + raw).split(',').map(function (piece) { return piece ? piece.trim() : ''; }).filter(Boolean);
            if (parts.length <= 1) {
                return parts[0] || raw;
            }
            // 如果名称数量跟ID一样，可以尝试匹配同序元素
            var idParts = ('' + (teamIdRaw || '')).split(',').map(function (piece) { return piece ? piece.trim() : ''; }).filter(Boolean);
            if (idParts.length === parts.length) {
                var index = idParts.findIndex(function (idPart) { return normalizeTeamId(idPart) === targetId; });
                if (index > -1 && parts[index]) {
                    return parts[index];
                }
            }
            return parts[0] || '';
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
                        // 不使用 ng-options，改为 createdCell 动态填充，避免重复编译导致的重复项
                        return '<select class="form-control form-control-sm patrol-team-select" data-tid="' + tid + '"></select>';
                    },
                    createdCell: function (nTd) {
                        var $cell = angular.element(nTd);
                        var sel = $cell.find('select.patrol-team-select');
                        var tid = sel.attr('data-tid');
                        var loadingPromise = null;
                        sel.empty();
                        sel.append(angular.element('<option value=""></option>'));
                        sel.data('loaded', false);

                        function updateHighlight(val) {
                            if (val) sel.addClass('bg-associated'); else sel.removeClass('bg-associated');
                        }

                        function populateOptions() {
                            if (loadingPromise) {
                                return loadingPromise;
                            }
                            loadingPromise = ensureTeamsLoaded().then(function (list) {
                                sel.empty();
                                sel.append(angular.element('<option value=""></option>'));
                                (list || []).forEach(function (o) {
                                    var opt = angular.element('<option></option>');
                                    opt.attr('value', o.id);
                                    opt.text(o.name);
                                    sel.append(opt);
                                });
                                var cur = vm.selectedTeam[tid] || '';
                                sel.val(cur);
                                updateHighlight(cur);
                                sel.data('loaded', Array.isArray(list));
                            }).finally(function () {
                                loadingPromise = null;
                            });
                            return loadingPromise;
                        }

                        populateOptions();
                        sel.on('focus', function () {
                            if (!sel.data('loaded')) {
                                populateOptions();
                            }
                        });
                        sel.on('click', function () {
                            if (!sel.data('loaded')) {
                                populateOptions();
                            }
                        });
                        // 变更事件：写入选中并保存
                        sel.on('change', function () {
                            var val = this.value;
                            $scope.$applyAsync(function () {
                                vm.selectedTeam[tid] = val;
                                updateHighlight(val);
                                onTeamChange(tid);
                            });
                        });
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
                $q.all([
                    cacTemplateService.getTemplates(),
                    ensureTeamsLoaded().catch(function () { return []; })
                ]).then(function (results) {
                    var templates = results[0] || [];
                    if (!templates.length) {
                        d.resolve([]);
                        return;
                    }

                    function buildRow(tpl, teamId, explicitName) {
                        var tid = teamId || '';
                        vm.selectedTeam[tpl.id] = tid;
                        var name = tid ? (explicitName || tpl.teamName || (vm.teamLabelMap && vm.teamLabelMap[tid]) || (vm.teamOptionsMap && vm.teamOptionsMap[tid]) || '') : '';
                        return {
                            templateId: tpl.id,
                            templateName: tpl.templateName,
                            description: tpl.description,
                            updatedAt: tpl.updatedAt || tpl.executedAt || tpl.createdAt,
                            teamId: tid,
                            teamName: name
                        };
                    }

                    var rowMap = {};
                    var pending = [];

                    templates.forEach(function (tpl) {
                        var teamId = tpl.assignedToTeam ? normalizeTeamId(tpl.teamId) : '';
                        if (tpl.assignedToTeam && !teamId) {
                            pending.push(
                                cacTemplateService.getCacTeamConfig(tpl.id).then(function (teamMap) {
                                    teamMap = teamMap || {};
                                    var ids = Object.keys(teamMap).sort();
                                    var selectedId = ids.length ? ids[0] : '';
                                    rowMap[tpl.id] = buildRow(tpl, selectedId, selectedId ? teamMap[selectedId] : '');
                                }).catch(function () {
                                    rowMap[tpl.id] = buildRow(tpl, '', '');
                                })
                            );
                        } else {
                            rowMap[tpl.id] = buildRow(tpl, teamId, normalizeTeamName(tpl.teamName, tpl.teamId));
                        }
                    });

                    if (!pending.length) {
                        var rows = templates.map(function (tpl) { return rowMap[tpl.id]; });
                        d.resolve(rows);
                        return;
                    }

                    $q.all(pending).finally(function () {
                        var rows = templates.map(function (tpl) { return rowMap[tpl.id]; });
                        d.resolve(rows);
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
            if (vm._saving[templateId]) return; // 防抖
            var newTeamId = vm.selectedTeam[templateId] || '';
            vm._saving[templateId] = true;

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

                return ops;
            }).then(function () {
                messageService.toast('success', '保存成功');
            }).catch(function (err) {
                messageService.toast('error', '保存失败', err && err.message ? err.message : '');
            }).finally(function () {
                vm._saving[templateId] = false;
            });
        }
    }
})();
