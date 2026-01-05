/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/9, created
 * @modified Performance optimization, 2024
 */
/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */
(function () {
    defineModeForLog();

    /**
     * https://codemirror.net/demo/simplemode.html
     * 
     * 性能优化说明：
     * 1. 移除了嵌入式 JavaScript 模式（=> 后的JSON），避免复杂模式切换
     * 2. 简化正则表达式，减少回溯
     * 3. 将最常匹配的规则放在前面
     * 4. 避免贪婪匹配，使用非贪婪或固定模式
     */
    function defineModeForLog() {
        // 预编译正则表达式以提升性能
        var REGEX = {
            // 使用非捕获组和固定字符匹配提升性能
            ok: /^(ok)(: \[)([^\]]+)(\])/,
            changed: /^(changed)(: \[)([^\]]+)(\])/,
            fatal: /^(fatal)(: \[)([^\]]+)(\])/,
            skipping: /^(skipping)(: \[)([^\]]+)(\])/,
            failed: /FAILED!|UNREACHABLE!/,
            ignoring: /\.\.\.ignoring/,
            // 简化 TASK 匹配，使用固定长度的星号匹配
            task: /^(TASK)( \[)([^\]]+)(\] )(\*+)/,
            warning: /\[WARNING\]/,
            // 优化 PLAY RECAP 正则，减少分组数量
            recap: /^([^\s:]+)(\s*:)(\s*ok=\d+)(\s*changed=\d+)(\s*unreachable=\d+)(\s*failed=\d+)(\s*skipped=\d+)(\s*rescued=\d+)(\s*ignored=\d+)/,
            // Play 标题行
            play: /^PLAY \[/,
            playRecap: /^PLAY RECAP /
        };

        CodeMirror.defineSimpleMode("ansiblelog", {
            // Rules are matched in the order in which they appear
            // 将最常见的匹配放在前面以提升性能
            start: [
                // 最常见的执行结果状态 - 放在最前面
                {
                    regex: REGEX.ok,
                    token: ["opx-text-success", null, 'keyword', null]
                },
                {
                    regex: REGEX.changed,
                    token: ["opx-text-info", null, 'keyword', null]
                },
                {
                    regex: REGEX.fatal,
                    token: ["opx-bg-danger", null, 'keyword', null]
                },
                {
                    regex: REGEX.skipping,
                    token: ["opx-text-muted", null, 'keyword', null]
                },
                // 错误标记
                {
                    regex: REGEX.failed,
                    token: "opx-text-danger"
                },
                {
                    regex: REGEX.ignoring,
                    token: 'opx-bg-muted'
                },
                // TASK 行
                {
                    regex: REGEX.task,
                    token: ['comment', 'comment', 'string', 'comment', 'comment']
                },
                // PLAY 行
                {
                    regex: REGEX.play,
                    token: 'comment'
                },
                {
                    regex: REGEX.playRecap,
                    token: 'comment'
                },
                // WARNING
                {
                    regex: REGEX.warning,
                    token: "opx-text-warning"
                },
                // PLAY RECAP 统计行
                {
                    regex: REGEX.recap,
                    token: ['keyword', null, 'opx-text-success', 'opx-text-info', 'opx-text-danger', 'opx-text-danger', 'opx-text-muted', 'opx-primary', 'opx-text-muted']
                }
                // 注意：移除了 => 后的 JavaScript 嵌入模式
                // 原因：嵌入式模式会导致每行都进行复杂的模式切换，严重影响大文件性能
                // 如果需要查看 JSON 详情，用户可以双击该行弹出解析窗口
            ],
            // The multi-line comment state.
            comment: [],
            // The meta property contains global information about the mode.
            meta: {
                dontIndentStates: ["comment"],
                lineComment: "//"
            }
        });
    }
})();