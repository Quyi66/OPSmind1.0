/**
 * @ Author: chy
 * @ Create Time: 2022-07-14 11:07:46
 * @ Description:  
 */

flowBpmnXmlCtrl.$inject = []
export default function flowBpmnXmlCtrl() {
  var that = this;

  that.codemirrorLoaded = function (_editor) {
    _editor.on("change", function () {
      setTimeout(function() { _editor.refresh(); }, 200);
    });
  };

  that.codeOption = {
    value: '',
    mode: 'application/xml',
    readOnly: true,
    styleActiveLine: true, // 当前行背景高亮
    lineNumbers: true, // 显示行数
    line: true,
    tabSize: 4, // tab字符的宽度，默认为4,
    autoRefresh: true,
    theme: 'opluscode',
    lineWrapping: true,
    autofocus: true,
    onLoad: that.codemirrorLoaded
  }
  
}