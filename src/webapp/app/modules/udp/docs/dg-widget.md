# 组件开发

## 组件HTML组成

一个组件由下面的HTML构成
     
```
<uwidget uw-type="" uw-props="" id="" class="uwidget uwtype-[type]">
    <div class="uw-buttons">
        [组件的编辑按钮，在编辑状态显示]
    </div>
    <div class="uw-body">
      <form class="uw-params">
          [组件的参数组件]
      </form>
      <div class="uw-content">
          [组件实际内容显示区域]
          [高度保存在uwProps.display.height中]
      </div>
    </div>
</uwidget>
```

## 组件尺寸

### 宽度 display.width

`全能输入input`、`按钮button`和`定时器timer`组件的显示形式为`inline-block`，宽度由里面的输入控件决定。

其它组件有两种显示形式：

1. 在uw-column，显示为`block`，占满整个内容格宽度，
内容格通过bootstrap的`col-sm-{1~12}`（格子）和扩展的`col-even-{1~12}`（均分）来控制宽度
2. 在uw-flex的内容格中，显示为flex，由CSS flexbox布局，组件通过`udp-wpct-{5的倍数}`来控制占内容格宽度百分比

这两种形式，组件都是采用**基于CSS的相对宽度**，使用相对宽度，可以自适应屏幕，基于CSS，可以灵活调整响应式布局。

### 高度 display.height

组件的高度由`uw-content`区域的高度决定

## 组件缩放

如果组件内容不能自适应容器，需要在`controlRender`中实现`onResize`方法。

```
function onResize(widgetElem, options){}
```

在以下场景，会广播`WIDGET_RESIZE`事件：

* 编辑模式，拖拉缩放组件大小，在组件`scope`广播。
`{from:'RESIZE_WIDGET', reHeight:true, height:number, oldHeight:number}`
框架会将content区的高度、宽度写入uwProps。
* 编辑模式，剪切或者复制粘贴组件，在组件`scope`广播。
`{from:'RESIZE_COLUMN',  reHeight:true}`
* 编辑模式，缩放column，在内容格或浮动格`scope`广播，对浮动格内所有组件有效。
`{from:'RESIZE_FLOAT', reHeight:true}`
* 查看模式，在box mode下放大/恢复组件窗口。
`{from:'ZOOM_OPEN', reHeight:true, contentElem:'#js-zoommodal-id'}`
`{from:'ZOOM_RESTORE', reHeight:true}`

* 编辑模式，切换左侧的工具栏，通过页面的`rootScope`广播，对所有组件有效。
`{from:'TOGGLE_TOOLBOX'}`
* 查看模式，调整浏览器大小，通过页面的`scope`广播（`page-display`）。
`{from:'RESIZE_BROWSER'}`

事件`WIGET_RESIZE`的参数包括以下属性：

- `from`: 事件来源，仅用于描述，方便程序调试 
- `reHeight`: 是否需要处理高度变化
- `contentElem`: uw-content元素
- `needSave`: 

以下属性只在`RESIZE_WIDGET`事件中存在。
- `height`: 组件高度
- `width`: 组件宽度
- `oldHeight`: 组件原始高度
- `oldWidth`: 组件原始宽度


需要调整高度的时候，框架会将content的高度写入props，并设定content DOM的height


## Widget的z-index

* 编辑状态widget高亮显示：9
* Float Widget: 19
* uinput directive: 29
* 拖拉时显示尺寸：39

## 组件异常处理
组件有以下异常：
1. 如果属性没有定义完整，应`throw new WidgetNotConfiguredError`
2. 如果在`onInitControl`中出现异常，例如连不上数据源，应`throw new WidgetDataError`

## 组件内容加载指示

如果组件的`onInitControl`返回是一个`promise`，那么在加载组件数据的时候，显示一个加载的动画指示。
动画指示的显示位置可以通过以下方式指定：
1. 组件的内容HTML中有`.uw-content-data`样式的位置
2. 组件的`.uw-content`位置

可以参考`kpi-widget.js`
