/*! Asset Batch Delete Extension - Dynamic Button Injection for UDP Pages */
(function() {
    'use strict';

    var buttonsInjected = false;

    // 等待元素出现
    function waitForElement(selector, callback, maxAttempts = 50) {
        var attempts = 0;
        var checkInterval = setInterval(function() {
            attempts++;
            var element = document.querySelector(selector);
            if (element) {
                clearInterval(checkInterval);
                callback(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
            }
        }, 200);
    }

    // 检查是否在数据管理页面
    function isDataManagementPage() {
        // 必须同时满足：有"资产模版下载"或"资产导入"按钮
        var buttons = document.querySelectorAll('button, uwidget[uw-type="button"]');
        var hasAssetDownload = false;
        var hasAssetImport = false;

        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            var text = btn.textContent || btn.innerText || '';
            if (text.indexOf('资产模版下载') !== -1) {
                hasAssetDownload = true;
            }
            if (text.indexOf('资产导入') !== -1 || text.indexOf('资产信息导入') !== -1) {
                hasAssetImport = true;
            }
        }

        return hasAssetDownload || hasAssetImport;
    }

    // 查找"数据管理"页面中的按钮容器
    function findDataManagementButtonContainer() {
        // 首先检查是否在数据管理页面
        if (!isDataManagementPage()) {
            return null;
        }

        var buttons = document.querySelectorAll('button, uwidget[uw-type="button"]');

        // 方法1：查找包含"资产模版下载"按钮的容器
        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            var text = btn.textContent || btn.innerText || '';
            if (text.indexOf('资产模版下载') !== -1 || text.indexOf('资产导入') !== -1) {
                // 找到父容器
                var container = btn.closest('.op-pageheader-actions, .uw-include-container, .form-inline, div[class*="action"]');
                if (container) {
                    return container;
                }
            }
        }

        // 方法2：查找 pageheader 中的 actions 容器
        var pageheader = document.querySelector('uwidget[uw-type="pageheader"]');
        if (pageheader) {
            var actionsContainer = pageheader.querySelector('.op-pageheader-actions, .uw-include-container[data-uw-placeholder="actions"], .form-inline');
            if (actionsContainer) {
                return actionsContainer;
            }
        }

        // 方法3：直接查找包含多个按钮的容器
        var containers = document.querySelectorAll('.op-pageheader-actions, .uw-include-container, .form-inline');
        for (var j = 0; j < containers.length; j++) {
            var btns = containers[j].querySelectorAll('button, uwidget[uw-type="button"]');
            if (btns.length >= 2) {
                return containers[j];
            }
        }

        return null;
    }

    // 创建批量删除按钮
    function injectBatchDeleteButtons() {
        // 先检查是否在数据管理页面
        if (!isDataManagementPage()) {
            return;
        }

        // 延迟执行，等待 UDP 页面完全渲染
        setTimeout(function() {
            // 再次检查，因为页面可能已经切换
            if (!isDataManagementPage()) {
                return;
            }

            var container = findDataManagementButtonContainer();

            if (!container) {
                // 备用方案：查找任何 pageheader
                waitForElement('uwidget[uw-type="pageheader"]', function(pageheader) {
                    var fallbackContainer = pageheader.querySelector('.form-inline, div[class*="ms-auto"]');
                    if (fallbackContainer) {
                        insertButtons(fallbackContainer);
                    }
                });
                return;
            }

            insertButtons(container);
        }, 800);
    }

    // 插入按钮到容器
    function insertButtons(container) {
        // 检查按钮是否已存在
        if (container.querySelector('.acm-batch-delete-btn')) {
            buttonsInjected = true;
            return;
        }

        // 创建下载模板按钮
        var downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-sm btn-outline-secondary me-3 acm-batch-delete-btn';
        downloadBtn.style.height = '29px';
        downloadBtn.style.fontSize = '13px';
        downloadBtn.innerHTML = '<i class="fa fa-download"></i> 资产批量删除模版下载';
        downloadBtn.onclick = function() {
            var link = document.createElement('a');
            link.href = 'content/template/acm/批量删除资产模版.xlsx';
            link.download = '批量删除资产模板.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // 创建上传导入按钮
        var uploadBtn = document.createElement('button');
        uploadBtn.className = 'btn btn-sm btn-primary me-3 acm-batch-delete-btn';
        uploadBtn.style.height = '29px';
        uploadBtn.style.fontSize = '13px';
        uploadBtn.innerHTML = '<i class="fa fa-upload"></i> 资产删除导入';
        uploadBtn.onclick = function() {
            var fileInput = document.getElementById('acmBatchDeleteFileInput');
            if (!fileInput) {
                fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.id = 'acmBatchDeleteFileInput';
                fileInput.accept = '.xlsx,.xls';
                fileInput.style.display = 'none';
                fileInput.onchange = function() {
                    handleFileUpload(this.files);
                };
                document.body.appendChild(fileInput);
            }
            fileInput.click();
        };

        // 在容器末尾插入按钮（和其他按钮并排）
        container.appendChild(downloadBtn);
        container.appendChild(uploadBtn);

        buttonsInjected = true;
    }

    // 显示消息提示
    function showMessage(message, type) {
        var injector = angular.element(document.body).injector();
        if (injector) {
            try {
                var messageService = injector.get('messageService');
                if (messageService && messageService.toast) {
                    messageService.toast(type || 'info', message);
                    return;
                }
            } catch (e) {
                // messageService 不可用
            }

            try {
                var toaster = injector.get('toaster');
                if (toaster && toaster.pop) {
                    toaster.pop(type || 'info', '', message);
                    return;
                }
            } catch (e) {
                // toaster 不可用
            }
        }

        // 备用方案：创建自定义通知
        var notification = document.createElement('div');
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; ' +
            'padding: 15px 20px; background: ' +
            (type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196f3') +
            '; color: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); max-width: 400px;';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(function() {
            notification.style.transition = 'opacity 0.3s';
            notification.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 显示详细结果弹窗
    function showDetailedResult(data) {
        var message = '批量删除完成\n\n' +
            '成功: ' + (data.successCount || 0) + ' 条\n' +
            '失败: ' + (data.failedCount || 0) + ' 条';

        if (data.successIps && data.successIps.length > 0) {
            message += '\n\n成功删除的资产IP:\n' + data.successIps.join('\n');
        }

        if (data.failedIps && data.failedIps.length > 0) {
            message += '\n\n失败的资产IP:\n' + data.failedIps.join('\n');
        }

        // 创建模态框显示详细结果
        var modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; ' +
            'background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;';

        var dialog = document.createElement('div');
        dialog.style.cssText = 'background: white; padding: 20px; border-radius: 8px; ' +
            'max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 4px 16px rgba(0,0,0,0.3);';

        dialog.innerHTML = '<h4 style="margin-top: 0;">批量删除结果</h4>' +
            '<pre style="white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 13px;">' +
            message + '</pre>' +
            '<div style="text-align: right; margin-top: 15px;">' +
            '<button class="btn btn-primary" onclick="this.closest(\'[style*=fixed]\').remove()">确定</button>' +
            '</div>';

        modal.appendChild(dialog);
        document.body.appendChild(modal);

        modal.onclick = function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    // 处理文件上传
    function handleFileUpload(files) {

        if (!files || files.length === 0) {
            showMessage('请选择要上传的文件', 'warning');
            return;
        }

        var file = files[0];
        if (!file.name.toLowerCase().match(/\.(xlsx|xls)$/)) {
            showMessage('只支持Excel文件格式（.xlsx 或 .xls）', 'error');
            return;
        }

        var injector = angular.element(document.body).injector();
        if (!injector) {
            showMessage('无法获取 Angular 服务', 'error');
            return;
        }

        var $http = injector.get('$http');
        var formData = new FormData();
        formData.append('file', file);

        showMessage('正在上传文件，请稍候...', 'info');

        $http({
            method: 'POST',
            url: '/oplus-portal/acm/api/acm/ci/batch-delete-by-excel',
            data: formData,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(response) {
            var data = response.data;

            // 显示简短提示
            if (data.successCount > 0 && data.failedCount === 0) {
                showMessage('批量删除全部成功！共 ' + data.successCount + ' 条', 'success');
            } else if (data.successCount > 0 && data.failedCount > 0) {
                showMessage('部分资产删除成功，成功 ' + data.successCount + ' 条，失败 ' + data.failedCount + ' 条', 'warning');
            } else if (data.failedCount > 0) {
                showMessage('资产删除全部失败，失败 ' + data.failedCount + ' 条', 'error');
            }

            // 显示详细结果
            showDetailedResult(data);

            // 清空文件选择器，允许再次选择同一文件
            var fileInput = document.getElementById('acmBatchDeleteFileInput');
            if (fileInput) {
                fileInput.value = '';
            }
        }).catch(function(error) {
            var errorMsg = '上传失败: ' +
                (error.data && error.data.message ? error.data.message :
                 error.statusText || '未知错误');
            showMessage(errorMsg, 'error');

            var fileInput = document.getElementById('acmBatchDeleteFileInput');
            if (fileInput) {
                fileInput.value = '';
            }
        });
    }

    // 监听 DOM 变化，处理 UDP 页面的动态渲染
    function setupMutationObserver() {
        var observer = new MutationObserver(function(mutations) {
            // 检查是否有新的 pageheader 或按钮容器被添加
            var shouldInject = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // 检查是否添加了包含资产按钮的容器
                            var text = node.textContent || node.innerText || '';
                            if (text.indexOf('资产模版下载') !== -1 ||
                                text.indexOf('资产导入') !== -1 ||
                                text.indexOf('资产信息导入') !== -1) {
                                shouldInject = true;
                            }

                            // 或者检查是否添加了 pageheader
                            if (node.matches && (
                                node.matches('uwidget[uw-type="pageheader"]') ||
                                node.querySelector('uwidget[uw-type="pageheader"]')
                            )) {
                                // 延迟检查，确保内容已渲染，并且必须是数据管理页面
                                setTimeout(function() {
                                    if (isDataManagementPage()) {
                                                shouldInject = true;
                                        buttonsInjected = false;
                                        setTimeout(injectBatchDeleteButtons, 500);
                                    }
                                }, 300);
                            }
                        }
                    });
                }
            });

            if (shouldInject) {
                buttonsInjected = false;
                setTimeout(injectBatchDeleteButtons, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        // 等待 Angular 初始化
        if (angular && angular.element(document.body).injector()) {
            var $rootScope = angular.element(document.body).injector().get('$rootScope');

            // 监听路由变化
            $rootScope.$on('$stateChangeSuccess', function(event, toState) {
                buttonsInjected = false;
                // 延迟检查页面，只在数据管理页面注入
                setTimeout(function() {
                    if (isDataManagementPage()) {
                        injectBatchDeleteButtons();
                    }
                }, 800);
            });

            // 监听 UDP 页面加载完成事件
            $rootScope.$on('udpPageLoaded', function() {
                buttonsInjected = false;
                setTimeout(injectBatchDeleteButtons, 500);
            });

            // 立即尝试注入
            setTimeout(injectBatchDeleteButtons, 1000);

            // 启动 DOM 监听
            setupMutationObserver();
        } else {
            setTimeout(init, 500);
        }
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
