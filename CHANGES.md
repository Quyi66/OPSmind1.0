# Known Issues

- Table widget: table header not aligned when scroll bar presents in edit mode

# Change Log

**Legend:** 
`(+)` new, `(c)` changed, `(e)` `(^)` enhanced, `(*)` bug fixed

### 2.1.0 (20220110)
- (+) `opx-tree` component
- (+) Ansible实时输出

### 2.0.0 (20211225)
- (+) 增加Window多窗口模式
- (c) 与oplus-portal-web代码合并

### 1.2.5 (20211015)
- (+) 新增页头组件

### 1.2.4 (20210913)
- (e) UMD增加视图定义、显示数据
- (e) 优化表格动态列

### 1.2.3 (20210831)
- (e) Widget Interaction在指定区域打开页面，支持页面缓存。
- (+) 增加Universal Modeled Data

### 1.2.2 (20210820)
- (e) 小应用的页面连接支持Javascript
### 1.2.1 (20210811)
- (e) 优化表格动态列

### 1.2.0 (20210610)
- (+) 参数显示增加dropdown选项
- (e) Textarea支持单行显示

### 1.1.0 (20210530)
- (+) Ansible Playbook可视化设计器
- (*) 表格很多列响应式显示下的过滤框问题

### 1.0.0 (20210520)
- 重新标记版本

### 0.16.0 (20210422)
- (*) 表格内按钮交互参数值为多行文本的问题
- (+) Ansible执行进度，终止单台主机或者整个任务
- (+) Ansible表格输出
- (+) 按钮增加大小属性  
- (e) 大量UI优化

### 0.15.0 (20200913)
- (*) Datatables高度问题

### 0.14.0 (20200913)
- (+) Datatables增加列过滤
- (+) Datatables增加服务端分页、搜索
- (+) 支持引入本地的udp页面
- (e) 优化全能输入
- (e) 富文本编辑器增加图标选择

### 0.13.0 (20200905)
- (+) 引入select2，准备替代chosen，因为chosen无法append to body，在对话框中会被剪裁
- (+) 按钮增加文本链接样式
- (e) 作业和日志组件优化
- (e) 大量UI优化

### 0.12.1 (20200430)
- (+) 富文本组件：变量支持markdown 

### 0.12.0 (20200430)
- (+) 新增文件选择、主机选择组件
- (+) 按钮组件：增加图标在上排列，可以改变图标大小，可以改变按钮大小
- (e) 优化CSS
- (e) 重构PageView，`udp-page-content`改为`udp-page-view`，删除不必要的`udpBreadcrumb`
- (e) 意外解决Page Designer源码修改后无法将修改效果同步到可视化编辑器的问题
- (e) 重构Page Designer的scope处理

### 0.11.0 (20200416)
- (+) 新flex内容格
- (e) 使用Sortable替换jQuery-UI Sortable
- (e) 优化widget拖拽

### 0.10.0 (20200325)
- (e) 使用bootstrap4
- (e) CSS重构

### 0.9.0 (20200305)
- (+) 数据集支持行列转换
- (+) 自定义数据集支持参数
- (*) Select组件自定义宽度
- (c) Select组件删除默认的Select an option文字
- (e) dataEx 代码优化
- (e) 表格组件代码优化

### 0.8.3 (20190610)
- (e) 页面编辑时组件高亮延迟300毫秒以避免鼠标快速移动时闪动，当前组件边框增加渐变

### 0.8.2 (20190505)
- (e) KPI组件：支持懒加载模式获取详情，减少开销
- (*) `dataEx.fieldOf`可能和外部用户自定义函数参数名称冲突 
- (e) KPI组件：优化详情弹出框对鼠标的响应
- (e) 自定义函数：增加`_timeout`函数

### 0.8.1 (20190430)
- (+) 表格：内容过滤支持模糊匹配
- (+) 表格：可以对显示内容进行截断，点击弹出对话框显示完整内容，便于显示很长的内容
- (e) 优化导入对话框UI
- (c) 表格：编辑状态去除拖拽设定列宽的功能，原因是colResize插件不能完美适配宽度，还需要很多代码微调的工作。

### 0.8.0 (20190420)
- (c) 修改`config.js`配置规则
- (e) 下拉框的下拉数据支持二维数组只有一个元素的情况，例如`[["value1"],["value2"]]`
- (e) 找不到页面时在页面进行错误提示
- (+) 增加单独的dfv.html页面，减小了第三方包的体积，用于自定义页面通过iframe嵌入其它系统。

### 0.7.6 (20190313)
- (*) 内容格条件控制修复

### 0.7.5 (20190225)
- (+) 表格控件增加汇总行

### 0.7.4 (20190131)
- (e) 富文本编辑：编辑状态给变量增加提示

### 0.7.3 (20190124)
- (*) KPI和列表组件：将隐藏目标DOM改为删除目标DOM，避免出现多个重复ID的内容格
- (e) 表格：优化UI加载

### 0.7.2 (20190118)
- (*) 交互打开页面：当页面存在多个相同ID的目标位置时，选择可见的那个
- (e) KPI和列表组件：自定义数据支持qdata

### 0.7.1 (20190108)
- (+) KPI组件：支持自定义文字和标题大小

### 0.7.0 (20190103)
- 猪年快乐~
- (e) 菜单导航组件：优化响应式布局

### 0.6.8 (20181231)
- (+) 导航菜单：支持打开任意URL

### 0.6.7 (20181225)
- (*) KPI组件：避免视觉混乱，悬浮信息改用右下角图标，点击可以复制。
- (*) iOS下对话框无法滚动
- (e) 表格组件：移动模式下分页改为下拉框
- (e) 增加`WidgetDataError`和`WidgetNotConfiguredError`来规范Widget的异常处理
- (e) 在加载KPI、图表等组件时显示旋转的加载指示图标
- (*) 列表组件：在移动状态下长按可以弹出菜单内容复制

### 0.6.6 (20181218)
- (e) 表格组件：移动模式下单击隐藏详细列
- (*) 移动模式下对话框打开新页面无法传送参数
- (*) 环形组件：缩放之后显示属性丢失
- (+) 新增脚本组件，可以自由定义组件内容
- (*) 打开页面丢失URL参数

### 0.6.5 (20181214)
- (e) 优化组件状态控制：按钮可以和表格多选结合，当未选中时禁用按钮
- (*) 新窗口打开，在移动模式下改为在对话框打开
- (e) 表格组件：优化移动模式下复选框的显示

### 0.6.4 (20181212)
- (+) 表格组件：增加批量过滤，增加手动刷新按钮
- (e) 表格移动模式：刷新保持节点展开，优化展开按钮
- (+) 交互：表格中的按钮参数支持函数
- (*) 表格组件：数据转换支持页面和全局参数

### 0.6.3 (20181206)
- (e) 移动模式：表格控件增加排序
- (e) Ajax交互：URL和参数支持函数。注意，表格中的按钮不支持函数
- (*) 表格组件：复选框全选错误，优化复选框
- (e) 页面导航优化
- (+) 菜单导航组件：新增样式

### 0.6.2 (20181127)
- (c) 避免歧义，`udp-page-display`改名为`udp-page-content`
- (*) Bug：列表控件无法使用全局参数
- (e) 增加`/udp/page/:pageId/print`用于可打印页面

### 0.6.1 (20181120)
- (e) 为适应移动端优化
- (c) 去掉了jsonic
- (*) Bug：如果一个参数不存在，表格中的按钮链接将无法显示

### 0.6.0 (20181106)
- (!) 不兼容更新：全能输入默认不更新URL，属性`nochangeUrl`改为`changeUrl`。
- (*) Bug fix in dataEx

### 0.5.3 (20181101)
- (+) 全能输入支持textarea

### 0.5.2 (20181026)
- (+) 支持动态数据集(datax)和关联数据集(joinx)

### 0.5.1 (20181020)
- (+) 关联数据集初始版本
- (*) 修复：Button不支持全局参数`${#.xxx}`

### 0.5.0 (20181010)
- (+) 新增数据透视组件，支持表格和图形
- (*) 组件交互：
  - URL支持参数
  - 可以在对话框嵌入iframe打开URL
- (+) 全能输入组件：增加单选和复选框

### 0.4.26 (20180912)
- (+) Link in data converter supports state control by expression
- (+) New flex column with enhanced drag resize
- (+) Column layout widget supports form layout
- (e) Optimize widget z-index
- (e) Enhanced form layout with class `op-smartform`

### 0.4.25 (20180906)
- (+) New gauge widget by Yongwang
- (+) New Rose widget by Bobing
- (+) Ajax interaction supports repeat
- (^) Widget property viewer

### 0.4.24 (20180829)
- (+) New circle widget
- (+) New font size selector

### 0.4.23 (20180816)
- (+) Support global params with `${#.user.loginId/displayName}`
- (+) New access control supports button and datatable
- (e) Use `deferRender` for datatable to improve performance by 10 times

### 0.4.22 (20180806)
- (e) Do not hide float actions on parent page

### 0.4.21 (20180726)
- (e) Datatable: sortable mcheck column and display selected items
- (*) Nav widget: fix updating location problem
- (*) Prompt export error

### 0.4.20 (20180723)
- (*) Input widget: do not sync widget wparams
- (c) Disable nav widget updating location

### 0.4.19 (20180717)
- (e) Datatable limits records to 100 in edit mode to improve performance
- (+) Able to handle result when open page in dialog
- (e) Nav widget supports navigation backward and forward.
- (e) Uinput supports array type.

### 0.4.18 (20180710)
- (+) Datatable supports dynamic dataset
- (e) Datatable field formatter
- (+) New interaction: func
- (e) Interaction event can be root

### 0.4.17 (20180627)
- (+) Datatable supports dynamic fields
- (e) Update udp CSS

### 0.4.16 (20180622)
- (*) Cannot display dataset error in widget
- (*) Missing parameter for interaction page link
- (e) Prompt for unsaved page in page designer
- (e) Optimize widget error info

### 0.4.15 (20180620)
- (e) Beautify widget buttons and config dialog header
- (*) Put widget config dropdown right to avoid clipping by palette zone

### 0.4.14 (20180611)
- (e) Greatly enhanced widget interaction!
 
### 0.4.13 (20180601)
- (c) Remove less

### 0.4.12 (20180531)
- (+) Search in KPI widget
- (e) List generator for KPI and list widget
- (+) New component `opSearchbox`

### 0.4.11 (20180403)
- (+) Double click to config widget
- (+) New WYSIWYG editor widget

### 0.4.10 (20180331)
- (e) Datatable: enhanced column resize
- (+) Mock rest dataset 

### 0.4.9 (20180323)
- (e) Chart Widget: enhanced y-axis settings for line chart and bar chart

### 0.4.8 (20180314)
- (c) Version for SZ branch

### 0.4.7 (20180310)
- (*) Datatable widget: no default sorting for first column
- (e) Datatable widget: option to auto column width

### 0.4.6 (20180228)
- (e) Update bower
- (e) Update CSS
- (e) New javascript demo dataset
- (*) Page navigation breadcrumb. New `_nopagehist`

### 0.4.5 (20180201)
- (+) Line/bar/pie/radar/map widgets: drag to resize height
- (c) Timer widgets: stop timer when invisible, attempt to fix an unreproducible bug of infinite events when JS error
- (c) Display data query error within widget
- (e) Enhanced general error handle
- (e) Continuous dataset query error is limited to 3

### 0.4.4 (20180131)
- (+) Line chart: add option to break line for noncontinuous points
- (c) Use new default chart theme. Removed echarts 3 theme. Add Tableau and Splunk theme
- (+) Table Widget: drag to adjust column width in edit mode
- (*) Table Widget: change sort icons

### 0.4.3 (20180126)
- (*) Nav widget supports `${@.page_param}` as page link parameter

### 0.4.2 (20180111)
- (*) Page customized color
- (e) Update oplus-commons to 0.2.1
- (e) Improved theme selector
- (*) Error determine edit mode when switch from page edit to page view
- (+) Support open page in blank

### 0.4.1 (20171231)
- (+) Directly resize column width on canvas, super flexible!
- (e) Upgrade echarts to 3.8.5 to fix bug of color of `axisLabel`
- (e) Consistent color calculation
- (e) Improved drag and drop experience
- (*) Disable point style for pie chart

### 0.4.0 (20171229)
- (+) New `oplus.uaa` module
- (+) Initial access control
- (e) Gulp: add version number to module js
- (e) Dataset list and field list order by name

### 0.3.5 (20171222)
- (+) New scatter point for map
- (+) New theme selector
- (+) New color picker
- (+) New palette
- (*) Page background image
 
### 0.3.4 (20171215)
- (+) Card mode supports customized background and font colors
- (e) Widget `configController` supports function. Do not need extra controller, yeah!
- (e) Widget form layout
- (c) Child page can listen on changes of parent page paramters
- (*) Bug fix: Last KPI card cannot open by default
- (*) Bug fix: Open child page in same div

### 0.3.3 (20171207)
- (+) New: date range picker widget

### 0.3.2 (20171201)
- (+) Card mode support zoom in
- (e) Enable yaxis auto scale for chart

### 0.3.1 (20171123)
- (+) New param widget
- (e) Tuning datatable performance
- (e) Add css `m-b` to nav widget
- (e) Text widgets support page variables in format of `${@.param.path}`

### 0.3.0 (20171116)
- (e) Reorganize code for modules
- (e) Ready for integration with jhipster
- (+) Page drill down: able to go back (experimental feature)
- (+) Text widgets support page variables
- (+) Open page link supports function as page id

### 0.2.8 (20171107)
- (*) Chart: category X axis does not reload data
- (+) Page design: copy and paste widget
- (+) Input directive supports function as initial value
- (+) Data converter function `qdata` supports single value, and result transformer. 
Signature is  `qdata("code",{param1:value1},["field1","field2"],filter,transformFn)`,
- (e) Page designer: fixed pallet zone
- (*) KPI widget: fix bad layout when title is empty

### 0.2.7 (20171101)
- (+) Share page with email
- (c) API changes. To support metadata of elasticsearch, mongodb whose data may contains object.
Return type of `queryDatasetMeta` changed from `{fields:[{name:string,type:string}],paramsConfig:{}}` 
to  `{fields:{field_name:string|object}, paramsConfig:{}}`
- (e) Sample in KPI widget config
- (e) Use field variable in KPI widget open page.
- (+) Datatable widget: add interaction
- (e) Datepicker update on blur

### 0.2.6 (20171030)
- (e) Support grid layout in PDF export
- (+) New even layout css: col-even-1 ~ col-even-12

### 0.2.5 (20171026)
- (+) New features: stream data for chart
- (*) Bug fixes: excel export
- (e) Removable page links in convert function builder
- (e) Input widget: datepicker supports hour, minute, second
- (*) Duplicate rendering widget dynamic content
- (e) Can remove default value for input directive
- (c) KPI widget: change title and text position
- (e) Input widget: update value on blur

### 0.2.4 (20171017)
- (+) New features for bar chart: horizontal and data stack
- (*) Some bug fixes

### 0.2.3 (20171015)
- (+) New features in KPI: conditional format, hover detail
- (e) Use echarts as charting tool for line, pie and bar widgets
- (*) Bug fixes: KPI is blank after configuration
- (e) Hover to show widget config buttons

### 0.2.2 (20171009)
- (+) New list widget
- (c) Change event properties

### 0.2.1 (20171008)
- (+) Support multiple data conversions in one datatable
- (c) Remove `const` for compatibility with phantomjs

### 0.2.0 (20171005)
**BREAKING CHANGE**: `params` in dataset config is changed from object to array for enabling sort

- (e) Improved UX for data converter
- (+) Data converter supports YAML
- (e) Sortable parameter controls for dataset
- (*) Some bug fixes

### 0.1.6 (20170930)
- (*) Fix bug of float layout
- (e) Job widget
- (e) Add tooltip for widget palette 

### 0.1.5 (20170929)
- (+) Add icon for KPI widget
- (*) Fix excel export bug

### 0.1.4 (20170913)
- (+) DataTable widget: page link builder (alpha)
- (c) Code refactor
- (e) Optimize page link target selector

### 0.1.3 (20170912)
- (e) Extract data access from `page.service.js` to `page-dao.js` for support preparation of remote db.
- (e) Prompt error message when page not found
- (f) Route widget error

### 0.1.2 (20170912)
- (+) DataTable widget: conditional rule for row background color

### 0.1.1 (20170911)
- (+) DataTable widget: sort fields in configuration
- (f) Page full height
- (e) Draggable and resizable widget configuration dialog

### 0.1.0 (20170908)
前端基本可用版本，支持：

- WYSIWYG可视化页面编辑
- 组件：菜单导航、Datatables、线图、直方图、饼图、柱线混合图、地图、路线图
- 布局：网格布局，浮动布局
- 组件参数联动、页面嵌套

