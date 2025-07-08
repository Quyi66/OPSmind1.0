/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/9, created
 */
/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */
(function () {
    defineModeForLog();

    /**
     * https://codemirror.net/demo/simplemode.html
     */
    function defineModeForLog() {
        CodeMirror.defineSimpleMode("ansiblelog", {
            // Rules are matched in the order in which they appear
            // The start state contains the rules that are initially used
            start: [
                {regex: /=> /, token: "meta", mode: {spec: "javascript", end: /[\r\n]?/}},
                // You can match multiple tokens at once. Note that the captured
                // groups must span the whole string in this case
                {
                    regex: /(^ok)(: \[)(.*?)(])/,
                    token: ["opx-text-success", null, 'keyword', null]
                },
                {
                    regex: /(^changed)(: \[)(.*?)(])/,
                    token: ["opx-text-info", null, 'keyword', null]
                },
                {
                    regex: /(^fatal)(: \[)(.*?)(])/,
                    token: ["opx-bg-danger", null, 'keyword', null]
                },
                {
                    regex: /(^skipping)(: \[)(.*?)(])/,
                    token: ["opx-text-muted", null, 'keyword', null]
                },
                {
                    regex: /(FAILED!)|(UNREACHABLE!)/,
                    token: "opx-text-danger"
                },
                {
                    regex: /\.\.\.ignoring/,
                    token: 'opx-bg-muted'
                },
                {
                    // TASK [Execute playbook scripts] ************************************************
                    regex: /(^TASK)( \[)(.*)(] )(\**)/,
                    token: ['comment', 'comment', 'string', 'comment', 'comment']
                },
                {
                    // Highlight whole line
                    // Example: `[WARNING]: Consider using the file module with state=absent rather than running`
                    regex: /\[WARNING]/,
                    token: "opx-text-warning"
                },
                {
                    //b140.oplus-example.com     : ok=1    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
                    regex: /(.*?)(\s*:)(\s*ok=\d+)(\s*changed=\d+)(\s*unreachable=\d+)(\s*failed=\d+)(\s*skipped=\d+)(\s*rescued=\d+)(\s*ignored=\d+)/,
                    token: ['keyword', null, 'opx-text-success', 'opx-text-info', 'opx-text-danger', 'opx-text-danger', 'opx-text-muted', 'opx-primary', 'opx-text-muted']
                }
                // {regex: /true|false|null|undefined/, token: "atom"},
                // You can embed other modes with the mode property. This rule
                // causes all code between << and >> to be highlighted with the XML
                // mode.
            ],
            // The multi-line comment state.
            comment: [
                // {regex: /.*?\*\//, token: "comment", next: "start"},
                // {regex: /.*/, token: "comment"}
            ],
            // The meta property contains global information about the mode. It
            // can contain properties like lineComment, which are supported by
            // all modes, and also directives like dontIndentStates, which are
            // specific to simple modes.
            meta: {
                dontIndentStates: ["comment"],
                lineComment: "//"
            }
        });
    }
})();