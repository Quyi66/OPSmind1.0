/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/5/23, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').service('processBuilder', ['$translate', processBuilder]);

    /**
     * Reference
     * @constructor
     */
    function ProcessDef() {
        this.name = '';
        this.version = '';
        this.description = '';
        this.params = {};
        this.inventory = [];
        /**
         *
         * @type {[TaskDef]}
         */
        this.tasks = [];
    }

    /**
     * Reference
     * @constructor
     */
    function TaskDef() {
        this.id = '';
        this.name = '';
        this.type = '';
        this.module = {name: '', params: {}};
        this.ignoreErrors = false;
        this.when = '';
        this.withHosts = '';
        this.outputVar = '';
        this.loop = '';
        this.runOnce = false;
    }

    /**
     *
     * @param {ProcessDef|String} pd
     * @constructor
     */
    function PlaybookProcessBuilder(pd) {
        if (typeof pd === 'string') {

        }

    }

    /**
     *
     */
    function processBuilder($translate) {
        this.toPlaybook = toPlaybook;
        this.toInventory = toInventory;
        this.getModuleDefs = function () {
            /**
             * Definition of ansible modules
             */

            return {
                script: {
                    title: $translate.instant('jao.job.process.script'),
                    icon: 'fa-file-alt',
                    desc: '',
                    params: {
                        cmd: {
                            desc: $translate.instant('jao.job.process.script_cmd'),
                            control: 'script'
                        }
                    },
                    toTask: function (params) {
                        var script = parseScript(params.cmd);
                        var fetchedFile = 'files/' + script.name;
                        var fetchTask = {
                            fetch: {
                                src: '/opt/oplus/assets/gfs/git-repos/{{OPLUS_TNT}}' + script.path,
                                dest: fetchedFile,
                                flat: true
                            },
                            delegate_to: '{{OPLUS_SERVER}}',
                            run_once: true
                        };
                        var scriptTask = {
                            script: fetchedFile + (script.args ? ' ' + script.args : '')
                        }
                        return [fetchTask, scriptTask];

                        function parseScript(script) {
                            var filePath = script.split(' ')[0];
                            var args = script.substr(filePath.length).trim();
                            var parts = filePath.split('/');
                            var fileName = parts[parts.length - 1];
                            return {
                                path: filePath,
                                name: fileName,
                                args: args
                            };
                        }
                    }
                },
                shell: {
                    title: $translate.instant('jao.job.process.shell'),
                    icon: 'fa-terminal',
                    desc: "",
                    params: {
                        cmd: {
                            desc: $translate.instant('jao.job.process.shell_cmd')
                        }
                    },
                    toTask: function (params) {
                        return {
                            shell: params.cmd
                        };
                    }
                },
                copy: {
                    title: $translate.instant('jao.job.process.copy'),
                    icon: 'fa-upload',
                    desc: "",
                    params: {
                        src: {
                            type: "path",
                            desc: $translate.instant('jao.job.process.src'),
                            control: 'file'
                        },
                        dest: {
                            type: "path",
                            desc: $translate.instant('jao.job.process.dest'),
                            required: true
                        }
                    },
                    toTask: function (params) {
                        return {
                            copy: {
                                src: params.src,
                                dest: params.dest
                            }
                        };
                    }
                },
                fetch: {
                    title: $translate.instant('jao.job.process.fetch'),
                    icon: 'fa-file-download',
                    desc: '',
                    params: {
                        dest: {
                            desc: $translate.instant('jao.job.process.dest'),
                            control: 'file'
                        },
                        src: {
                            desc: $translate.instant('jao.job.process.src')
                        }
                    },
                    toTask: function (params) {
                        return {
                            fetch: {
                                src: params.src,
                                dest: params.dest
                            }
                        };
                    }
                },
                error_handle: {
                    title: $translate.instant('jao.job.process.error_handle'),
                    icon: 'fa-exclamation-triangle',
                    desc: '',
                    params: {
                        msg: {
                            desc: $translate.instant('jao.job.process.error_handle_msg')
                        }
                    },
                    toTask: function (params) {
                        return {
                            debug: {
                                msg: params.msg
                            }
                        };
                    }
                }
            }
        }

        /**
         *
         * @param {ProcessDef} pd Process definition
         * @returns {string} Ansible playbook YAML content
         */
        function toPlaybook(pd) {
            var plays = [];
            var play = {name: pd.name || 'Process Playbook', hosts: 'all', gather_facts: true, tasks: []};
            var theTask;
            try {
                pd.tasks.forEach(function (task) {
                    theTask = task;
                    var ats = toAnsibleTask(task);
                    if (!Array.isArray(ats)) {
                        ats = [ats];
                    }
                    ats.forEach(function (at) {
                        play.tasks.push(at);
                    });
                });
            } catch (err) {
                throw new Error(theTask.id);
            }
            plays.push(play);
            return jsyaml.dump(plays);
        }

        /**
         *
         * @param {ProcessDef} pd
         * @return {string}
         */
        function toInventory(pd) {
            var result = '';
            var inventory = angular.copy(pd.inventory);
            inventory.push({group: '_oplus', hosts: [{key: 'OPLUS_SERVER ansible_host=\'{{OPLUS_SERVER}}\''}]});
            inventory.forEach(function (group) {
                result += '[' + group.group + ']\n';
                group.hosts.forEach(function (host) {
                    result += host.key + '\n';
                })
            });
            return result;
        }

        /**
         * Convert process task to Ansible playbook task
         * @param {TaskDef} processTask Process task
         * @return {[object]|object} Ansible task
         */
        function toAnsibleTask(processTask) {
            processTask.type = processTask.type || 'module';
            var tasks = [];
            if (processTask.type === 'module') {
                var moduleConfig = processTask.module;
                var moduleDef = moduleDefs[moduleConfig.name];
                if (!moduleDef) {
                    throw new Error('ProgramError: Cannot find module of "' + moduleConfig.name + '"');
                }
                tasks = moduleDef.toTask(moduleConfig.params || {});
            } else {
                throw new Error('ProgramError: Cannot recognize task type from `' + JSON.stringify(processTask) + '`');
            }
            if (!Array.isArray(tasks)) {
                tasks = [tasks];
            }
            var result = [];
            tasks.forEach(function (task, index) {
                var taskName = '[' + processTask.id + ']' + processTask.name;
                if (tasks.length > 1) {
                    taskName += '_' + (index + 1);
                }
                var ansibleTask = {name: taskName};
                if (processTask.when) {
                    ansibleTask.when = processTask.when;
                }
                if (processTask.withHosts) {
                    var groupArray = processTask.withHosts;
                    if (typeof groupArray === 'string') {
                        groupArray = [groupArray];
                    }
                    groupArray = groupArray.filter(function (o) {
                        return o.length > 0;
                    });
                    if (groupArray.length > 0) {
                        //inventory_hostname in lookup("inventory_hostnames","app:db")
                        ansibleTask.when = (ansibleTask.when ? ansibleTask.when + ' and ' : '') +
                            'inventory_hostname in lookup("inventory_hostnames", "' + groupArray.join(':') + '")';
                    }
                }
                if (processTask.outputVar) {
                    ansibleTask.register = processTask.outputVar;
                }
                if (processTask.loop) {
                    ansibleTask.loop = processTask.loop;
                }
                if (processTask.ignoreErrors === true) {
                    ansibleTask.ignore_errors = true;
                }
                if (processTask.runOnce === true && ansibleTask.run_once === undefined) {
                    ansibleTask.run_once = true;
                }
                Object.keys(task).forEach(function (key) {
                    ansibleTask[key] = task[key];
                });
                result.push(ansibleTask);
            })
            if (result.length === 1) {
                return result[0];
            } else {
                return result;
            }
        }
    }
})();
