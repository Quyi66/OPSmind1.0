# Oplus Modules

这是Oplus各模块的前端开发项目，最终输出是各模块的JS和CSS。
各模块的内容放在 `src/webapp/app/modules` 下面，其它目录都是为了模块的开发调试使用的。

## 🚀 快速开始

### 环境要求
- Node.js (推荐 v14+)
- npm (推荐 v6+)

### 安装依赖
```bash
npm install
```

### 开发模式

```bash
# 开发模式 + 热重载（推荐）
npm start
# 或
npm run watch

# 仅开发模式（构建 + 启动服务器）
npm run dev

# 仅构建开发版本
npm run build

# 仅启动服务器
npm run serve
```

### 生产构建

```bash
# 构建生产版本
npm run build:prod

# 构建并部署
npm run deploy
```

### 其他命令

```bash
# 清理构建文件
npm run clean

# 查看所有可用命令
npm run

# 启动翻译服务
npm run translator
```

### 开发流程

1. **开发调试**：`npm start` - 启动开发服务器+热重载
2. **构建测试**：`npm run build` - 构建开发版本
3. **生产部署**：`npm run build:prod` - 构建生产版本

访问地址：`http://localhost:3000`

### 热重载功能

开发模式下支持以下文件的热重载：
- 🎨 CSS/SCSS 文件变化自动重新编译
- 📄 HTML 模板变化自动重新构建
- 📜 JavaScript 文件变化自动重新构建  
- 🌐 i18n 文件变化自动更新
- ⚙️ 配置文件变化自动同步
- 🔄 浏览器自动刷新

## 🚀 开发服务器

### 快速启动
```bash
npm run dev-simple    # 快速启动（推荐）
npm run dev           # 完整构建启动
npm start             # 启动 + 热重载
```

### 🔄 代理配置

现在所有开发命令都自动支持代理功能！配置非常简单，类似 Vite/webpack-dev-server：

**配置文件**: `gulp/proxy-config.js`

```javascript
module.exports = {
    // 简单配置 - 字符串形式
    '/api': 'http://localhost:8080',
    '/auth': 'http://localhost:8081',
    '/upload': 'http://localhost:8082',
    
    // 高级配置 - 对象形式
    '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true
    },
    
    // 路径重写
    '/admin': {
        target: 'http://localhost:8080',
        pathRewrite: {
            '^/admin': '/api/admin'
        }
    }
};
```

### 代理示例

启动开发服务器后，所有匹配的请求会自动代理：

```bash
# 前端请求                          后端目标
http://localhost:3001/api/users  →  http://localhost:8080/api/users
http://localhost:3001/auth/login →  http://localhost:8081/auth/login
http://localhost:3001/upload     →  http://localhost:8082/upload
```

### 开发命令对比

| 命令 | 构建时间 | 功能完整性 | 适用场景 |
|------|----------|------------|----------|
| `npm run dev-simple` | ⚡ 快 | 90% | 日常开发 |
| `npm run dev` | 🐌 慢 | 100% | 功能测试 |
| `npm start` | ⚡ 快 + 热重载 | 90% | 开发调试 |

## Oplus模块使用

你可以建立一个应用，然后引入Oplus模块，例如建立一个应用叫`oplusdemoapp`，引入Oplus模块的步骤如下。

### 1. 在 `index.html` 中引入 Javascript 和 CSS

```html
<link rel="stylesheet" href="content/css/oplus-vendors.css">
<link rel="stylesheet" href="content/css/oplus-commons.css">
<link rel="stylesheet" href="content/css/oplus-udp.css">
<link rel="stylesheet" href="content/css/oplus-dts.css">
<link rel="stylesheet" href="content/css/oplusdemoapp.css">

<script src="config.js"></script>                     <!-- config.js 必须放在最前面 -->
<script src="app/modules/oplus-vendors.js"></script>  <!-- 打包好的第三方库 -->
<script src="app/modules/oplus-commons.js"></script>  <!-- Oplus的通用库 -->
<script src="app/oplusdemoapp.js"></script>           <!-- 应用自己的主js -->
<script src="app/modules/oplus-uaa.js"></script>
<script src="app/modules/oplus-dts.js"></script>
<script src="app/modules/oplus-udp.js"></script>
<script src="app/modules/oplus-dev.js"></script>
```

### 2. 在 `oplusdemoapp.js` 中引入模块

```javascript
angular.module('oplusdemoapp', [
    'ngAnimate',
    'ngSanitize', 
    'ui.router',
    'oplus.commons',
    'oplus.main',
    'oplus.udp',
    'oplus.dev',
    'oplus.dts'
]);
```

### 3. 模块配置（可选）

```javascript
angular.module('oplusdemoapp')
    .config(['pageDaoProvider', function (pageDaoProvider) {
        pageDaoProvider.useLocalDb(window.$oplus.appConfig.modules.udp.useLocalDb);
    }])
    .config(['datasetDaoProvider', 'datasourceDaoProvider', 
        function (datasetDaoProvider, datasourceDaoProvider) {
            datasetDaoProvider.useLocalDb(window.$oplus.appConfig.modules.dts.useLocalDb);
            datasourceDaoProvider.useLocalDb(window.$oplus.appConfig.modules.dts.useLocalDb);
    }]);
```

## 项目结构

```
oplus-modules/
├── src/webapp/              # 源代码
│   ├── app/modules/         # 各模块源码
│   ├── content/             # 样式和静态资源
│   ├── i18n/               # 国际化文件
│   └── index.html          # 主页面
├── dist/                   # 构建输出
├── gulpfile.js            # 构建配置
├── package.json           # 项目配置
└── README.md              # 说明文档
```

## 开发指引

### 规范

1. `src/webapp/app/modules` 下面建立模块目录，该模块所有的CSS、HTML、JS都放目录下
2. 使用 npm 管理第三方依赖
3. 遵循 Angular 1.x 最佳实践

### 注意事项

1. 不要使用 `const`，因为它在某些环境下不兼容
2. jQuery 使用 2.x 版本，避免与 jQuery UI 冲突
3. 导出 Word 采用 `html-docx-js`，CSS 多个 class 时只认第一个

### 技术栈

- **框架**：AngularJS 1.5.8
- **构建工具**：Gulp 3.9.1
- **样式**：SCSS + Bootstrap 3.3.7
- **包管理**：npm

## 发布流程

1. 提交代码并打标签
```bash
git commit -m "Release version x.x.x"
git tag -a vx.x.x -m "version x.x.x"
git push origin --tags
```

2. 构建生产版本
```bash
npm run build:prod
```

3. 部署
```bash
npm run deploy
```