/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2021/04/06
 */
(function () {
    'use strict';

    angular.module('oplus.jao').service('jaoUtil', jaoUtil);
    angular.module('oplus.jao').run(['customFunctions', 'jaoUtil', '$translate', function (cf, jaoUtil, $translate) {
        cf.defineFunction('_jaoFormatJobStats', {
            func: function (stats) {
                return jaoUtil.formatStats(stats);
            },
            group: 'dev',
            sample: '_jaoFormatJobStats()',
            desc: $translate.instant('jao.messages.format_job_status')
        });
    }]);

    jaoUtil.$inject = ['$q', '$translate', 'devel'];

    /**
     * @ngdoc service
     * @name jaoUtil
     * @description Ansible utility
     * @param {$q} $q
     * @param {$translate} $translate
     * @param {devel} devel
     */
    function jaoUtil($q, $translate, devel) {
        var that = this;
        this.taskStatusDefs = {
            ok: {color: 'success', text: 'OK', icon: 'fa fa-map-marker-check'},
            failed: {
                color: 'danger',
                text: $translate.instant('jao.status.task.failed'),
                tooltip: $translate.instant('jao.status.task.failed.tooltip'),
                icon: 'fa fa-map-marker-times'
            },
            unreachable: {
                color: 'danger',
                text: $translate.instant('jao.status.task.unreachable'),
                tooltip: $translate.instant('jao.status.task.unreachable.tooltip'),
                icon: 'fa fa-ban'
            },
            ignored: {
                color: 'secondary',
                text: $translate.instant('jao.status.task.ignored'),
                tooltip: $translate.instant('jao.status.task.ignored.tooltip'),
                icon: 'fa fa-map-marker-minus'
            },
            skipped: {
                color: 'secondary',
                text: $translate.instant('jao.status.task.skipped'),
                tooltip: $translate.instant('jao.status.task.skipped.tooltip'),
                icon: 'fa fa-map-marker-minus'
            },
            changed: {
                color: 'info',
                text: $translate.instant('jao.status.task.changed'),
                tooltip: $translate.instant('jao.status.task.changed.tooltip'),
                icon: 'fa fa-map-marker-alt'
            }
        };
        this.hostStatusDefs = {
            ok: {color: 'success', text: 'OK', icon: 'fa fa-check-square'},
            failed: {
                color: 'warning',
                text: $translate.instant('jao.status.host.failed'),
                tooltip: $translate.instant('jao.status.host.failed'),
                icon: 'fa fa-times-square'
            },
            unreachable: {
                color: 'danger',
                text: $translate.instant('jao.status.host.unreachable'),
                tooltip: $translate.instant('jao.status.host.unreachable'),
                icon: 'fa fa-ban'
            }
        };
        this.jobStatusDefs = {
            RUNNING: {
                name: 'running',
                color: 'primary',
                title: $translate.instant('jao.status.job.running'),
                icon: 'fa-cog fa-spin',
                _fa: ''
            },
            COMPLETED: {
                name: 'completed',
                color: 'success',
                title: $translate.instant('jao.status.job.completed'),
                icon: 'fa-check',
                _isFinished: true,
                _fa: 'f00c'
            },
            ERROR: {
                name: 'error',
                color: 'warning',
                title: $translate.instant('jao.status.job.error'),
                icon: 'fa-exclamation',
                _isError: true,
                _isFinished: true,
                _fa: 'f12a'
            },
            INTERRUPTED: {
                name: 'interrupted',
                color: 'dark',
                title: $translate.instant('jao.status.job.interrupted'),
                icon: 'fa-hand-paper',
                _isError: true,
                _isFinished: true,
                _fa: 'f256'
            },
            FAILED: {
                name: 'failed',
                color: 'danger',
                title: $translate.instant('jao.status.job.failed'),
                icon: 'fa-times',
                styleStatus: 'error',
                _isFinished: true,
                _isError: true,
                _fa: 'f00d'
            },
            CALLBACK: {
                name: 'running',
                color: 'primary',
                title: $translate.instant('jao.status.job.running'),
                icon: 'fa-cog fa-spin',
                _fa: ''
            },
            WAITING: {
                name: 'waiting',
                color: 'secondary',
                title: $translate.instant('jao.status.job.waiting'),
                styleStatus: 'default',
                icon: 'fa-equals',
                _fa: 'f52c'
            }
        };
        this.jobType = {SCRIPT: 'script', COMMAND: 'command', REST: 'rest', PROCESS: 'process'};

        this.jobTypeList = {
            script: {title: $translate.instant('jao.job.type.script'), icon: 'fa-file-alt'},
            rest: {title: $translate.instant('jao.job.type.rest'), icon: 'fa-cloud-upload'},
            command: {title: $translate.instant('jao.job.type.command'), icon: 'fa fa-terminal'},
            process: {title: $translate.instant('jao.job.type.process'), icon: 'fa fa-random'}
        };
        if (!devel.isClientInDevMode()) {
            delete this.jobTypeList.process;
        }
        this.parseHostStatus = parseHostStatus;
        this.parseHost = parseHost;
        this.formatStats = formatStats;
        this.changeRunStatusStyle = changeRunStatusStyle;
        this.parseResultStatus = parseResultStatus;


        /**
         * Change element style by run status.
         * @param {jQuery} elem
         * @param {string} runStatus {@link jobStatusDefs}
         * @param {*} options
         */
        function changeRunStatusStyle(elem, runStatus, options) {
            options = options || {style: "OUTLINE"};
            // console.log('changeRunStatusStyle', {status: runStatus, options: options});
            var statusDef = that.jobStatusDefs[runStatus];
            var status;
            // if (options.style === 'OUTLINE') {
            status = statusDef.styleStatus || statusDef.name;
            elem.removeClassMatch(/^status-.*/)
                .addClass('status-' + status);
            // }
            /* else if (options.style === 'GLOW') {
                 status = statusDef.styleStatus || statusDef.name;
                 elem.removeClassMatch(/^status-.*!/)
                     .addClass('status-' + status)
                     .addClass('jao-jobrun-status-btn ani-glow');
             }*/ /*else if (options.style === 'INNER_ICON') {
                var original = elem.data('original');
                if (!original) {
                    original = {height: elem.height(), width: elem.width(), html: elem.html()};
                }
                if (runStatus === 'default') {
                    elem.html(original.html);
                } else {
                    elem.data('original', original);
                    elem.height(original.height).width(original.width);
                    var icon = elem.find('> i.fa');
                    var iconCss = statusDef.icon + ' fa-fw';
                    if (icon.length > 0) {
                        icon.attr('class', iconCss);
                    } else {
                        elem.html('<i class="' + iconCss + '"></i>');
                    }
                }
            }*/
        }

        /**
         * Format job stats to HTML
         * @param {string} statsJson
         * @return {string}
         */
        function formatStats(statsJson) {
            var stats = JSON.parse(statsJson || '{}');
            var html = '';
            var defs = {
                unreachableHosts: that.hostStatusDefs.unreachable,
                failedHosts: that.hostStatusDefs.failed,
                failedTasks: that.taskStatusDefs.failed
            };
            Object.keys(defs).forEach(function (key) {
                if (stats[key] > 0) {
                    var def = defs[key];
                    html += '<span class="me-2 text-' + def.color + '" title="' + def.tooltip + '"><i class="fa ' + def.icon + '"></i> ' + stats[key] + '</span> ';
                }
            });
            return html;
        }

        /**
         * Guess ansible module from host result.
         * @param host
         * @return {{module:String, cmd:String?}}
         */
        function guessModule(host) {
            if (host.cmd) {
                return {module: 'cmd', cmd: host.cmd};
            } else if (host.shell) {
                return {module: 'shell', cmd: host.shell};
            } else if (host.script) {
                return {module: 'script', cmd: host.script};
            }
            return {module: 'unknown'};
        }

        /**
         * Parse input host to two parts: target host and delegate host.
         * ```
         * parseHost('172.31.0.77 -> 10.253.172.117') --> {targetHost: "172.31.0.77", delegateHost: "10.253.172.117"}
         * ```
         * @param {string} hostKey Host in ansible format
         * @return {{targetHost:String, delegateHost:String}}
         */
        function parseHost(hostKey) {
            var matches = /(\S*)( -> )?(.*)?/.exec(hostKey);
            return {targetHost: matches[1], delegateHost: matches[3]};
        }

        /**
         * Determine task result status of a host.
         * @param {{unreachable:boolean?,failed:boolean?,changed:boolean?,ok:boolean?,ignored:boolean?,skipped:boolean?,skipping:boolean?}}host
         * @return {string}
         */
        function parseHostStatus(host) {
            var status = '';
            if (host.unreachable === true) {
                status = 'unreachable';
            } else if (host.failed === true) {
                status = 'failed';
            } else if (host.changed === true) {
                status = 'changed';
            } else if (host.ok === true) {
                status = 'ok';
            } else if (host.ignored === true) {
                status = 'ignored';
            } else if (host.skipped === true || host.skipping === true) {
                status = 'skipped';
            }
            return status;
        }

        /**
         * Parse result status
         * @param {{status:string}} result Job result
         * @returns {{isError: boolean, isFinished: boolean, name: string}}
         */
        function parseResultStatus(result) {
            var out = {name: 'running', isFinished: false, isError: false};
            if (result.status === 'COMPLETED') {
                out.name = 'completed';
                out.isFinished = true;
            } else if (result.status === 'ERROR' || result.status === 'FAILED' || result.status === 'INTERRUPTED') {
                out.name = 'error';
                out.isError = true;
                out.isFinished = true;
            }
            return out;
        }
    }
})();
