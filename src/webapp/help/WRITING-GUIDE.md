# Oplus帮助文件编写规范

## 重点！重点！重点！

### 一、遵守规范

### 二、尽可能少用截图

虽然图片很直观，但是在目前人力资源状况下，在帮助文档使用图片有以下两个问题：

1. 功能的UI经常变化，如果要保持文档同步，那就意味这每次改UI都要重新截图
2. Oplus要支持多语言，帮助文档同样也要多语言。文字可以直接翻译，但同时也必须为所有的图片准备多个语言版本。这个工作量太大了。

## 整体文件结构

```
help/
 |--_media/               -> 存放全局的css、js、图片等
 |--udp/                  -> 每个模块一个文件夹
 |--cac/
 |--gfs/
 |--jao/
 |    |--images/          -> 本模块的图片
 |    |--_sidebar.md      -> 侧栏导航二级目录  （必须）
 |    |--index.md         -> 模块简介        （必须）
 |    |--quickstart.md    -> 快速入门        （可选）
 |    |--guide.md         -> 使用指南        （必须）
 |    |--config.md        -> 设置和管理       （可选）
 |    |--dev.md           -> 开发指南        （可选）
 |    |--faq.md           -> 常见问题        （可选）
 |    +--...
 |
 |--_sidebar.md           -> 主目录 
 +--index.html
```

## 模块文件结构

每个模块文件夹下，需要按照文档的内容拆分成不同的文件。把内容拆分成多个文件，方便后续的文档扩展和维护。

**可以从`help/example`目录下复制一个模块模板。**

通过目录和文件来定义文件大纲。

- `/help/_sidebar.md`：定义一级目录，每个功能模块为一个一级目录
- `/help/<module>/_sidebar.md`：定义二级目录，功能模块的二级目录至少包含以下二级条目：
  * `index.md`: 模块简介
  * `quickstart.md`: 快速入门（可选）
  * `guide.md`: 使用指南
  * `config.md`: 设置和管理（可选）
  * `faq.md`: 常见问题（可选）
  
  如果和开发相关，例如涉及脚本开发、java开发、函数开发，还可以包含
  
  * `dev.md`: 开发指南（可选）

如果二级目录项下内容很多，可以增加三级目录，三级目录文件的命名规范是：`<二级目录>__三级文件名.md`

**注意是两条下划线**，例如`config__dataset.md`、`quickstart__ex01.md`

**不要把所有的帮助内容都写在一个index.md文件里面。**

所有内容写在一个文件中的缺点：

1. 层级不能折叠
2. 所有内容在一个文件里，如果内容多，不方便修改。

### 简介（index.md）

概括性的介绍当前的功能模块，包括
1. 用途：用来做什么的
2. 结构组成：包括架构，由哪些组件/模块组成，和外部系统的关系，可以用一张图来表示
3. 专用术语：如果用到了一些术语，在这里定义好，比如什么是巡检，什么是模板

### 快速入门 （quickstart.md）

快速入门，通过几个实际演示示例，手把手的指导用户“无脑”操作，目的是**最快速**、**最直接**的让用户看到这个模块的效果。
用户按照快速入门操作之后，应该有“哦，原来是做这个的”感觉。
所以快速入门的内容，有以下要求：
1. 如果操作中涉及参数，要告诉用户哪个框要填什么参数，都要明确列出来。让用户直接copy paste就可以。
2. 操作步骤，根据演示示例的目的，选择**最短路径**、**最简介绍**。
例如演示审批功能，如果我们的目的是演示审批通过，那就只要告诉用户点击审批通过按钮。而无需介绍拒绝的按钮操作。
通过、拒绝这些选项的详细介绍可以放到使用指南里面去。

### 使用指南（index.md）

内容包括：
1. 各个页面的用途、页面上控件和参数的设置方法
2. 这个模块的最佳实践和我们的一些使用建议

### 常见问题（faq.md）

以问答的形式，罗列经常会遇到的问题和解答。

## 添加新模块

1. 从`oplus-portal-web/src/main/webapp/help/example`目录下复制一个模块模板到help目录下，例如`help/vap`。
2. 按写作规范修改`help/vap`下面的各个md文件内容。
3. 修改`oplus-portal-web/.docsifycombine.js`中的`modules`，将`vap`放入`modules`
4. 修改`oplus-portal-web/src/main/webapp/help/_sidebar.md`，添加一项`- [补丁管理](vap/index.md)`

## 写作规范

### 图片规范

1. 静态图片必须是png格式
2. 图片文件命名规范：`所属文档-图片简称.png`，例如`quickstart-job-edit.png`，`guide-job-edit.png`
3. 通过`![](images/filename.png)`的形式引用图片。图片默认会加阴影边框。
如果不希望给图片增加阴影，在图片文件名后面加` ':class=raw'`，例如`![](images/filename.png ':class=raw')`

**截图规范**
1. 截图时不要截取导航条：因为导航条包含logo，而每个客户的logo可能都不同
2. 尽量只截图所需要表达的部分图片。比如想说明一个菜单，或者几个控件的使用，就不要把整个浏览器全屏截图（这样要关注的地方太小了，可能看不清楚）。**务必要让截图的部分能够看的清楚**。
3. 不一定每个功能选项都要有截图。如果能够可以通过文字把内容写清楚，宁可**尽量少**的截图。
截图和界面UI紧耦合，如果UI修改了，截图也要修改，如果大量截图，修改的工作量很大。
4. 截图最好截取所需要的局部，这样即使改版，也不至于全部影响

### 样式和用词规范

1. 按钮和菜单用中括号`【】`包起来，例如：
  - 点击按钮【按钮名称】
  - 选择菜单【菜单1 / 菜单选项1.1 / 菜单子选项1.1.3】
2. 不要出现六级标题（`######` 开头）
3. `?>`仅用于强调注意事项，慎用

### Markdown格式兼容性

docsify用于在线展示文档，Typora用于将文档导出成PDF，所以markdown格式要尽可能同时兼容docsify和Typora。

比如docsify的[扩展标识](https://docsify.js.org/#/helpers?id=important-content)`!>`和`?>`不能在Typora展示，就不要使用。

### Emoji

docsify和Typora都支持emoji。少量使用emoji可以为文档增色，但不要滥用。可用的emoji列表：

- 技巧：:bulb: 
- 备注、说明、提示信息： :pencil: 
- 重点内容：:star:
- 警告：:warning:
- 不允许、禁止的操作：:no_entry: 
- ~~待办TODO：:question:~~​
- ~~新特性： :new:~~​
- ~~公告：:loudspeaker:~~

## 生成PDF文件

**第一步**：通过docsify-combine（改写自[docsify-pdf-converter](https://github.com/meff34/docsify-to-pdf-converter)）
把多个md文件合并成一个md文件，合并后的文件放在`docs/OplusUserGuide_版本号.md`

1. 修改`.docsifycombinerc.js`中的`docVer`和`modules`
2. 执行命令

```sh
cd oplus-modules
npm run combine
```

>! docsify-combine存在的问题：
> 1. 不能正确处理`image.png#raw`形式的路径转换
> 2. ~~md文件中如果有下划线`_`，必须包含在“\`”里面。这好像是markd的缺陷。~~（nodejs v8~v9存在这个问题，通过`--harmony`模式解决）
> 3. 不能识别docsify的`:include`内嵌文件。

**第二步**：将合并后的md文件转换成pdf。md文件转换成PDF文件有两种方案：

**方案1：使用Typora打开md，手工另存为PDF**

- 优点：
  * 支持CSS定制样式
  * 支持PDF bookmark
  * 支持代码块背景色
- 缺点：
  * 使用Typora的样式，和网页显示有出入

**方案2：使用`puppeteer`转成PDF文件**

- 优点：
  * 和网页完全一致，包括图片格式
- 缺点：
  * 不支持代码块的背景色
  * [PDF不支持bookmark](https://github.com/puppeteer/puppeteer/issues/3625)，这个问题**大大降低了文档阅读的便利性**

## 参考

- [Emoji List](https://gist.github.com/rxaviers/7360908)
- [Emoji Cheat Sheet](https://www.webfx.com/tools/emoji-cheat-sheet/)
- [docsify-pdf-converter](https://github.com/meff34/docsify-to-pdf-converter)