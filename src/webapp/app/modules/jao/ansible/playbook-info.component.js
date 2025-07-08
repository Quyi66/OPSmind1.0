/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/11/07
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name jaoPlaybookView
     * @desc View ansible playbook
     * @usage
     * ```
     * <jao-playbook-view playbook="string">
     * ```
     * @param {string} playbook Path of playbook
     */
    angular.module('oplus.jao').component('jaoPlaybookView', {
        bindings: {
            playbook: '<'
        },
        templateUrl: 'app/modules/jao/ansible/playbook-info.html',
        controller: ['restUtils', '$http', '$element', '$scope', '$filter', '$timeout', '$compile', 'messageService', PlaybookViewCtrl]
    });


    /**
     *
     * @param {restUtils} restUtils
     * @param $http
     * @param $element
     * @param $scope
     * @param $filter
     * @param $timeout
     * @param $compile
     * @param {messageService} messageService
     */
    function PlaybookViewCtrl(restUtils, $http, $element, $scope, $filter, $timeout, $compile, messageService) {
        var that = this;
        var TYPE_PLAY = 'play', TYPE_TASKGROUP = 'taskgroup', TYPE_TASK = 'task';
        var playbookPath = parsePath(that.playbook);
        var yamlContents;
        restUtils.callApi('gfs', 'GET', '/api/gfs/task/git/f/v2/{repo}/file/{path}', {
            repo: '$tnt',
            path: that.playbook
        }).then(function (data) {
            yamlContents = data.result;
            try {
                var nodes = parseYaml(playbookPath.filename, jsyaml.load(yamlContents[playbookPath.filename]));
                buildChart(nodes);
            } catch (e) {
                console.log("parse playbook error,cause is " + e.message)
            }
        }).catch(function (err) {
            throw err;
        });
        $scope.$on('$destroy', function () {
            $element.off('click.jao');
        });

        function parsePath(filepath) {
            var parts = filepath.split('/');
            var filename = parts.pop();
            return {dir: parts.join('/'), filename: filename, filepath: filepath};
        }

        function buildChart(nodes) {
            var html = recBuildChart(nodes);
            $element.append(html);
            $element.on('click.jao', '.op-flowchart-node > .card-header', function () {
                var parent = $(this).parent();
                $element.find('.op-flowchart-node.detail-expanded').not(parent).removeClass('detail-expanded');
                parent.toggleClass('detail-expanded');
            });
        }

        function recBuildChart(nodes) {
            if (!nodes) {
                return '';
            }
            var html = '<ul class="list-unstyled op-flowchart-nodelist">';
            nodes.forEach(function (node, index) {
                var childHtml = recBuildChart(node._tasks);
                var nodeDefHtml = generateNodeDef(node);
                html += '<li class="card op-flowchart-node node-type-' + node._type + '">' +
                    '<div class="card-header op-flowchart-node-title" title="' + node.name + '">' + node.name + '</div>' +
                    '<div class="card-body op-flowchart-node-detail">' + nodeDefHtml + '</div> ' +
                    (childHtml ? '<div class="card-body">' + childHtml + '</div>' : '') +
                    (index < nodes.length - 1 ? '<div class="op-flowchart-shape-arrow long-arrow"></div>' : '') +
                    '</li>';
            });
            html += '</ul>';
            return html;
        }

        function generateNodeDef(node) {
            var html = '';
            if (node._type !== TYPE_PLAY) {
                var clone = angular.copy(node);
                Object.keys(clone).forEach(function (key) {
                    if (key.startsWith('_') || key === 'name') {
                        delete clone[key];
                    }
                });
                html = jsyaml.dump(clone);
            }
            return html;
        }

        /**
         * Parse play or task items from YAML file
         * @param {string} currentFile
         * @param {[object]} playOrTaskItemList
         * @return {[]|null} Node list. Null if input is not array
         */
        function parseYaml(currentFile, playOrTaskItemList, roleName) {
            if (!angular.isArray(playOrTaskItemList)) {
                return null;
            }
            var fileType = TYPE_PLAY;
            var first = playOrTaskItemList[0];
            if (first['hosts'] || first['roles']) {
                fileType = TYPE_PLAY;
            } else {
                fileType = TYPE_TASK;
            }
            var nodeList = [];
            playOrTaskItemList.forEach(function (playOrTaskItem) {
                var node = {};
                nodeList.push(node);
                node.name = /*(roleName ? roleName + ':' : '') +*/ playOrTaskItem.name;
                node._type = fileType;
                if (fileType === TYPE_PLAY) {
                    node['hosts'] = playOrTaskItem['hosts'];
                    node._tasks = [];
                } else {
                    _.extend(node, playOrTaskItem);
                }
                var children = parseChildrenTasksFrom(playOrTaskItem, currentFile);
                if (children) {
                    node._tasks = parseYaml(children.childYaml, children.childItems, children.childName);
                }
                if (node._type === TYPE_TASK && node._tasks && node._tasks.length > 0) {
                    node._type = TYPE_TASKGROUP;
                }
                calcNodeName(node);
            });
            return nodeList;

            /**
             * Parse children tasks included or imported from a specified play or task item.
             * @param {object} playOrTask A play or task item from which parse children
             * @param {string} selfYaml The YAML file path of the play or task object
             * @return {{childYaml: string, childItems: []}|null} Null if no children found
             */
            function parseChildrenTasksFrom(playOrTask, selfYaml) {
                if (playOrTask.tasks) {
                    // This is a play's tasks
                    return {
                        childYaml: selfYaml,
                        childItems: parseYaml(selfYaml, angular.copy(playOrTask.tasks))
                    };
                } else if (playOrTask.roles) {
                    return null;
                    //TODO: not implemented
                    playOrTask.roles.forEach(function (role) {
                        var roleName = angular.isString(role) ? role : role.role;
                        var roleYaml = 'roles/' + roleName + '/tasks/main.yml';
                        parseYaml(roleYaml, jsyaml.load(yamlContents[roleYaml]));
                    });
                }
                var included = playOrTask['include_role'] || playOrTask['import_role'] || playOrTask['include_tasks'] || playOrTask['import_tasks'] || playOrTask['include'];
                if (included) {
                    var childName;
                    // Guess included YAML file to include tasks
                    // import_role: !name, ?tasks_from(main)
                    // include_role: !name, ?tasks_from(main)
                    // include_tasks: free-form or file
                    // import_tasks: free-form
                    // include: free-form
                    var childYamlFile;
                    if (angular.isString(included)) {
                        // For free-form
                        childYamlFile = included;
                    } else if (included['file']) {
                        childYamlFile = included['file'];
                    } else if (included['name']) {
                        var roleName = included['name'];
                        var taskFilename = included['tasks_from'] || 'main';
                        childYamlFile = 'roles/' + roleName + '/tasks/' + taskFilename;
                        childName = roleName;
                    }
                    if (childYamlFile) {
                        var checkFilenames = [childYamlFile, childYamlFile + '.yml', childYamlFile + '.yaml'];
                        var yamlContent, yamlToCheck;
                        var baseDir = parsePath(selfYaml).dir;
                        for (var i = 0; i < checkFilenames.length; i++) {
                            yamlToCheck = (baseDir ? baseDir + '/' : '') + checkFilenames[i];
                            yamlContent = yamlContents[yamlToCheck];
                            if (yamlContent) {
                                break;
                            }
                        }
                        if (yamlContent) {
                            return {
                                childYaml: yamlToCheck,
                                childItems: jsyaml.load(yamlContent),
                                childName: childName
                            };
                        }
                    }
                }
                return null;
            }

            function calcNodeName(node) {
                if (node.name) {
                    return;
                }
                node.name = _.find(Object.keys(node), function (key) {
                    return !/_type|name|ignore.*|when|run_once/g.test(key);
                });
            }
        }
    }
})();