## README

这是Oplus各模块的前端开发项目，最终输出是各模块的JS和CSS。
各模块的内容放在src\webapp\app\modules下面，其它目录都是为了模块的开发调试使用的。


## Oplus模块使用

你可以建立一个应用，然后引入Oplus模块，例如建立一个应用叫`oplusdemoapp`，引入Oplus模块的步骤如下。

1. 在`index.html`中引入Javascript和CSS

```html
    <link rel="stylesheet" href="content/css/oplus-vendors.css">
    <link rel="stylesheet" href="content/css/oplus-angulr.css">
    <link rel="stylesheet" href="content/css/oplus-commons.css">
    <link rel="stylesheet" href="content/css/oplus-udp.css">
    <link rel="stylesheet" href="content/css/oplus-dts.css">
    <link rel="stylesheet" href="content/css/oplusdemoapp.css">
    <script src="config.js"></script>                  <!-- config.js 必须放在最前面 -->
    <script src="lib/oplus-vendors.js"></script>       <!-- 打包好的第三方库，也可以自行引入 -->
    <script src="lib/oplus-commons.js"></script>       <!-- Oplus的通用库 -->
    <script src="app/oplusdemoapp.js"></script>        <!-- 应用自己的主js -->
    <script src="app/modules/main-config.js"></script>  <!-- Oplus各种模块 -->
    <script src="app/modules/oplus-uaa.js"></script>
    <script src="app/modules/oplus-dts.js"></script>
    <script src="app/modules/oplus-udp.js"></script>
    <script src="app/modules/oplus-dev.js"></script>
    <script src="app/modules/oplus-jat.js"></script>
```
- oplus-vendors.css 第三方的CSS，例如bootstrap
- oplus-angulr.css 基于angulr的bootstrap增强CSS
- oplus-common.css Oplus公用的自定义样式
- oplus-udp.css UDP模块的样式
- oplus-dts.css DTS模块的样式
- oplusdemoapp.css 应用的样式

2. 在`oplusdemoapp.js`中引入模块

```javascript
angular.module('oplusdemoapp', [
        'ngAnimate',
        'ngSanitize',
        'ui.router',
        'oplus.commons',
        'oplus.main',
        'oplus.udp',
        'oplus.dev',
        'oplus.dts',
        'oplus.jat'
    ]);
```
如果需要，可以初始化配置

```javascript
angular.module('oplusdemoapp')
    .config(['pageDaoProvider', function (pageDaoProvider) {
        pageDaoProvider.useLocalDb(window.$oplus.appConfig.modules.udp.useLocalDb);
    }])
    .config(['datasetDaoProvider', 'datasourceDaoProvider', 'jobDaoProvider', 'templateDaoProvider',
        function (datasetDaoProvider, datasourceDaoProvider, jobDaoProvider, templateDaoProvider) {
            datasetDaoProvider.useLocalDb(window.$oplus.appConfig.modules.dts.useLocalDb);
            datasourceDaoProvider.useLocalDb(window.$oplus.appConfig.modules.dts.useLocalDb);
            templateDaoProvider.useLocalDb(window.$oplus.appConfig.modules.jat.useLocalDb);
    }])
    .config(['uaaServiceProvider', function (uaaServiceProvider) {
    }]);
```
3. 后续如果需要修改模块配置，可以在`config.js`中修改

## Oplus模块依赖关系
```sequence
udp->dts:
udp-->jat: 作业控件使用
udp->uaa:
udp->commons:
dts->uaa:
jat->commons: 
jat->uaa:
uaa->commons:
```

## 开发指引

20200324

bootstrap升级到了4.4.1，部分组件popover, dropdown, modal, pagination, grid不兼容，还是用的bootstrap 3.3.7

angularjs的bootstrap组件uib-bootstrap对bootstrap4的支持不足。目前使用到了它的tabs,modal,pagination组件。
grid系统在自定义页面中用到，还不能改。

### 规范

1. `src/webapp/app/modules`下面建立模块目录，该模块所有的CSS、HTML、JS都放目录下
2. Use bower to manage third party js and css library

### 注意事项
1. Do not use `const` because it breaks PhantomJS. 
Using `const` will make phantomjs silent. Phantomjs does not support `const`

- https://github.com/karma-runner/karma/issues/1621
- https://github.com/webpack/webpack/issues/2407
- https://stackoverflow.com/questions/32497378/variable-declared-as-const-within-page-evaluate-is-not-being-used-in-phantomjs

### 控件选择

1. [angular-ui-calendar](https://github.com/angular-ui/ui-calendar) does not work
2. 20170908: [ng-sortable](http://a5hik.github.io/ng-sortable/) 简单试用，发现拖出范围容易消失。
  采用jquery UI的[ui-sortable](https://github.com/angular-ui/ui-sortable)
3. Do not use jquery 3.x because it conflicts with jquery ui ，参考[link](https://github.com/swisnl/jQuery-contextMenu/issues/423)，[link](
  https://stackoverflow.com/questions/37914869/jquery-ui-error-f-getclientrects-is-not-a-function)
4. 下拉框暂定使用修改过的[chosen](https://github.com/leocaseiro/angular-chosen)，使用简单，兼容常规的select和ng-options语法。[ui-select](https://github.com/angular-ui/ui-select)的标记太复杂。
5. 导出Word采用`html-docx-js`，对于css，如果有多个class，貌似只认第一个


## Bower发布

注册


1. 提交代码，打标签

````
git commit .
git tag -a V1.2 -m 'version1.2'
git push origin --tags
````
删除 Tag
````
git tag -d V1.2
git push origin :refs/tags/V1.2
````

bower清除缓存
````
bower cache clean oplus-modules
````