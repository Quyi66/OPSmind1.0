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
        vm.sendSms = {}; // { templateId: boolean }
        vm.onTeamChange = onTeamChange;
        vm.onSendSmsToggle = onSendSmsToggle;
        vm._saving = {}; // 防重复提交标记：{templateId: boolean}
        vm._savingSms = {}; // 防重复提交标记（短信开关）：{templateId: boolean}
        vm._sendSmsPrev = {}; // 上次成功保存的sendSms值
        vm._sendSmsDefault = {}; // 模版默认sendSms（仅在有关联团队时应用）
        vm._teamPrev = {}; // 上次成功保存的团队选择

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

                        // 防重复绑定：使用命名空间清理旧事件
                        sel.off('.patrolTeam');

                        populateOptions();
                        sel.on('focus.patrolTeam', function () {
                            if (!sel.data('loaded')) {
                                populateOptions();
                            }
                        });
                        sel.on('click.patrolTeam', function () {
                            if (!sel.data('loaded')) {
                                populateOptions();
                            }
                        });
                        // 变更事件：写入选中并保存
                        sel.on('change.patrolTeam', function (e) {
                            // 忽略非用户触发的变更，避免初始化或程序性设置触发
                            if (!e || !e.originalEvent) return;
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
                    mData: 'sendSms',
                    title: '是否发送SMS',
                    className: 'text-start',
                    render: function (data, type, row) {
                        var tid = row.templateId;
                        return '<div class="form-check form-switch">' +
                            '<input class="form-check-input patrol-sendSms-checkbox" style="width:4rem;height:1.4rem;cursor: pointer;" type="checkbox" data-tid="' + tid + '">' +
                            '</div>';
                    },
                    createdCell: function (nTd) {
                        var $cell = angular.element(nTd);
                        var cb = $cell.find('input.patrol-sendSms-checkbox');
                        var tid = cb.attr('data-tid');
                        // 初始化勾选状态
                        var checked = !!vm.sendSms[tid];
                        cb.prop('checked', checked);
                        // 未关联团队时，不允许开关，且默认关闭
                        var hasTeam = !!(vm.selectedTeam[tid]);
                        cb.prop('disabled', !hasTeam);

                        cb.on('change', function () {
                            var val = this.checked;
                            $scope.$applyAsync(function () {
                                vm.sendSms[tid] = val;
                                onSendSmsToggle(tid, cb);
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
                order: [[3, 'desc']],
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
                        vm._teamPrev[tpl.id] = tid;
                        var defaultSms = !!tpl.sendSms;
                        vm._sendSmsDefault[tpl.id] = defaultSms;
                        // 仅对已有关联团队的模版应用默认sendSms；无团队时默认关闭
                        var sms = (tpl.assignedToTeam && tid) ? defaultSms : false;
                        vm.sendSms[tpl.id] = sms;
                        vm._sendSmsPrev[tpl.id] = sms;
                        var name = tid ? (explicitName || tpl.teamName || (vm.teamLabelMap && vm.teamLabelMap[tid]) || (vm.teamOptionsMap && vm.teamOptionsMap[tid]) || '') : '';
                        return {
                            templateId: tpl.id,
                            templateName: tpl.templateName,
                            description: tpl.description,
                            updatedAt: tpl.updatedAt || tpl.executedAt || tpl.createdAt,
                            teamId: tid,
                            teamName: name,
                            sendSms: sms
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
            var prevTeamId = vm._teamPrev[templateId] || '';

            // 若无变化则不调用接口
            if ((prevTeamId || '') === (newTeamId || '')) {
                return;
            }
            vm._saving[templateId] = true;

            // 只发送一次：选择新团队 => 仅发送新团队；清空 => 仅发送上次团队（用于移除）
            var singleOp;
            if (!newTeamId) {
                if (prevTeamId) {
                    var prevName = vm.teamOptionsMap[prevTeamId] || '';
                    singleOp = cacTemplateService.saveTeamsInfo({ templateId: templateId, teamId: prevTeamId, teamName: prevName });
                } else {
                    singleOp = $q.when();
                }
            } else {
                var newName = vm.teamOptionsMap[newTeamId] || '';
                singleOp = cacTemplateService.saveTeamsInfo({ templateId: templateId, teamId: newTeamId, teamName: newName });
            }

            singleOp.then(function () {
                messageService.toast('success', '保存成功');
                // 根据是否已关联团队，启用/禁用短信开关，并设置该模版的默认值；不影响其他模版
                var cb = angular.element(document.querySelector('input.patrol-sendSms-checkbox[data-tid="' + templateId + '"]'));
                if (newTeamId) {
                    var defVal = !!vm._sendSmsDefault[templateId];
                    vm.sendSms[templateId] = defVal;
                    vm._sendSmsPrev[templateId] = defVal;
                    vm._teamPrev[templateId] = newTeamId;
                    try { cb.prop('disabled', false); cb.prop('checked', defVal); } catch (e) {}
                } else {
                    vm.sendSms[templateId] = false;
                    vm._sendSmsPrev[templateId] = false;
                    vm._teamPrev[templateId] = '';
                    try { cb.prop('checked', false); cb.prop('disabled', true); } catch (e) {}
                }
            }).catch(function (err) {
                messageService.toast('error', '保存失败', err && err.message ? err.message : '');
            }).finally(function () {
                vm._saving[templateId] = false;
            });
        }

        // 切换短信开关：调用模板更新接口，仅更新sendSms
        function onSendSmsToggle(templateId, $checkboxEl) {
            if (vm._savingSms[templateId]) return;
            var newVal = !!vm.sendSms[templateId];
            var prevVal = !!vm._sendSmsPrev[templateId];
            vm._savingSms[templateId] = true;
            try { if ($checkboxEl) { $checkboxEl.prop('disabled', true); } } catch (e) {}

            cacTemplateService.updateTemplateSendSms(templateId, newVal).then(function () {
                vm._sendSmsPrev[templateId] = newVal;
                messageService.toast('success', '保存成功');
            }).catch(function (err) {
                // 失败则回滚UI
                vm.sendSms[templateId] = prevVal;
                try { if ($checkboxEl) { $checkboxEl.prop('checked', prevVal); } } catch (e) {}
                messageService.toast('error', '保存失败', err && err.message ? err.message : '');
            }).finally(function () {
                vm._savingSms[templateId] = false;
                try { if ($checkboxEl) { $checkboxEl.prop('disabled', false); } } catch (e) {}
            });
        }
    }
})();
