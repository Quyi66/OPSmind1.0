# TODO

1. Widget 控件
    * 时间段控件
    * 文本内容可视化编辑WYSIHTML5或TextAngular
    * ~~打开页面参数编辑器~~
    * ~~DataTable自定义按钮编辑器~~
2. 页面集成
    * 页面通过iframe嵌入外部系统
    * 通过JS嵌入外部系统
3. 页面管理
    * 页面列表改为树形，参考有道，Wunderlist
    * 页面支持tag
    * 分页
4. 表格控件
    * ~~表格按条件背景高亮~~
    * 支持COUNT、SUM等常用统计
    * ~~有两个及以上自定义内容列（或者同名列）的时候会重复内容，要使用类似chart里面的ofield~~
5. 导入导出
    * ~~PDF不支持`col-`样式，需要用表格来布局~~
    * Word和HTML导出，需要将CSS内嵌到页面
	* 导入后页面ID改变，导致页面链接失效
6. 后台数据服务接口
7. less改sass
8. 页面编辑未保存时提醒
9. 图标：button-widget、nav-widget、page-link等支持图标
10. ~~KPI控件修改后页面空白~~
11. datatable如果有一个字段没有加入列，那么该字段不会放在datatable行的data对象中，导致在createdRow的规则判断中无法被引用此字段，Workaround是增加一个该字段的隐藏列。
12. 数据集的刷新事件支持list的点击，做成通用的
13: ~~Copy widget~~
