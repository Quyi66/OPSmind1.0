# 开发指南

## 1. 开发环境搭建

### 1.1 环境要求
- **Node.js**: 14.x 或更高版本
- **npm**: 6.x 或更高版本
- **Git**: 2.x 或更高版本
- **浏览器**: Chrome 80+, Firefox 75+, Safari 13+

### 1.2 项目初始化
```bash
# 克隆项目
git clone <repository-url>
cd oplus-webapp

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 或使用gulp
gulp dev
```

### 1.3 开发工具配置

#### VS Code 推荐插件
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "angular.ng-template",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss"
  ]
}
```

#### ESLint 配置
```json
{
  "extends": ["eslint:recommended"],
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "globals": {
    "angular": "readonly",
    "_": "readonly",
    "$": "readonly"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "semi": ["error", "always"]
  }
}
```

## 2. 代码结构和规范

### 2.1 文件命名规范
```
控制器: *.controller.js
服务: *.service.js
指令: *.directive.js
过滤器: *.filter.js
模板: *.html
样式: *.scss
测试: *.spec.js
```

### 2.2 代码组织结构
```
src/webapp/app/modules/jao/cronJob/
├── controllers/
│   ├── cron-job-list.controller.js
│   └── cron-job-dialog.controller.js
├── services/
│   └── cron-job.service.js
├── directives/
│   └── cron-expression.directive.js
├── filters/
│   └── job-type.filter.js
├── templates/
│   ├── cron-job-list.html
│   └── cron-job-dialog.html
├── styles/
│   └── cron-job.scss
├── tests/
│   ├── cron-job-list.controller.spec.js
│   └── cron-job.service.spec.js
└── assets/
    └── images/
```

### 2.3 编码规范

#### JavaScript 规范
```javascript
// 使用严格模式
(function () {
    'use strict';
    
    // 模块定义
    angular.module('oplus.jao')
        .controller('CronJobController', CronJobController);
    
    // 依赖注入
    CronJobController.$inject = ['$scope', '$state', 'cronJobService'];
    
    // 控制器实现
    function CronJobController($scope, $state, cronJobService) {
        var vm = this; // 使用 vm 代替 this
        
        // 公共属性
        vm.tasks = [];
        vm.loading = false;
        
        // 公共方法
        vm.loadTasks = loadTasks;
        vm.deleteTask = deleteTask;
        
        // 初始化
        activate();
        
        ////////////////
        
        function activate() {
            loadTasks();
        }
        
        function loadTasks() {
            vm.loading = true;
            return cronJobService.cronRestInterface('query')
                .then(function(data) {
                    vm.tasks = data;
                    return vm.tasks;
                })
                .catch(function(error) {
                    console.error('Failed to load tasks:', error);
                })
                .finally(function() {
                    vm.loading = false;
                });
        }
        
        function deleteTask(id) {
            return cronJobService.cronRestInterface('delete', id)
                .then(function() {
                    return loadTasks();
                });
        }
    }
})();
```

#### HTML 模板规范
```html
<!-- 使用语义化标签 -->
<div class="cron-job-container">
    <!-- 页面标题 -->
    <header class="page-header">
        <h1 class="page-title">{{ 'task_scheduling.title' | translate }}</h1>
    </header>
    
    <!-- 工具栏 -->
    <nav class="toolbar">
        <button type="button" 
                class="btn btn-primary"
                ng-click="vm.openCreateDialog()"
                uaa-has-permission="jao:edit">
            <i class="fa fa-plus"></i>
            {{ 'common.action.create' | translate }}
        </button>
    </nav>
    
    <!-- 数据表格 -->
    <main class="content">
        <div class="table-container">
            <opx-datatable config="vm.tableConfig" 
                          class="table-responsive">
            </opx-datatable>
        </div>
    </main>
</div>
```

#### CSS/SCSS 规范
```scss
// 使用BEM命名规范
.cron-job {
    &__container {
        padding: 20px;
    }
    
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    &__title {
        font-size: 24px;
        font-weight: 600;
        color: $primary-color;
    }
    
    &__toolbar {
        display: flex;
        gap: 10px;
    }
    
    &__table {
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

// 响应式设计
@media (max-width: 768px) {
    .cron-job {
        &__header {
            flex-direction: column;
            align-items: stretch;
        }
        
        &__toolbar {
            margin-top: 10px;
        }
    }
}
```

## 3. 新功能开发流程

### 3.1 需求分析
1. **需求文档审查**
   - 功能需求明确
   - 技术可行性评估
   - 接口设计确认

2. **技术方案设计**
   - 架构设计
   - 数据库设计
   - API接口设计
   - 前端组件设计

### 3.2 开发步骤

#### 步骤1: 创建分支
```bash
# 从主分支创建功能分支
git checkout main
git pull origin main
git checkout -b feature/cron-job-enhancement
```

#### 步骤2: 后端开发
```java
// 1. 创建实体类
@Entity
@Table(name = "cron_job")
public class CronJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "job_desc")
    private String jobDesc;
    
    // ... 其他字段
}

// 2. 创建Repository
@Repository
public interface CronJobRepository extends JpaRepository<CronJob, Long> {
    List<CronJob> findByAppCode(String appCode);
    List<CronJob> findByTriggerStatus(String status);
}

// 3. 创建Service
@Service
public class CronJobService {
    @Autowired
    private CronJobRepository cronJobRepository;
    
    public List<CronJob> findAll() {
        return cronJobRepository.findAll();
    }
    
    public CronJob save(CronJob cronJob) {
        return cronJobRepository.save(cronJob);
    }
}

// 4. 创建Controller
@RestController
@RequestMapping("/api/jao/cron")
public class CronJobController {
    @Autowired
    private CronJobService cronJobService;
    
    @GetMapping
    public ResponseEntity<List<CronJob>> getAllCronJobs() {
        List<CronJob> jobs = cronJobService.findAll();
        return ResponseEntity.ok(jobs);
    }
    
    @PostMapping
    public ResponseEntity<CronJob> createCronJob(@RequestBody CronJob cronJob) {
        CronJob saved = cronJobService.save(cronJob);
        return ResponseEntity.ok(saved);
    }
}
```

#### 步骤3: 前端开发
```javascript
// 1. 创建服务
(function() {
    'use strict';
    
    angular.module('oplus.jao')
        .service('cronJobService', cronJobService);
    
    cronJobService.$inject = ['restUtils'];
    
    function cronJobService(restUtils) {
        var module = 'jao';
        
        this.findAll = findAll;
        this.create = create;
        this.update = update;
        this.delete = deleteJob;
        
        function findAll() {
            return restUtils.callApi(module, 'GET', '/api/jao/cron');
        }
        
        function create(job) {
            return restUtils.callApi(module, 'POST', '/api/jao/cron', null, job);
        }
        
        function update(job) {
            return restUtils.callApi(module, 'PUT', '/api/jao/cron', null, job);
        }
        
        function deleteJob(id) {
            return restUtils.callApi(module, 'DELETE', '/api/jao/cron/{id}', {id: id});
        }
    }
})();

// 2. 创建控制器
(function() {
    'use strict';
    
    angular.module('oplus.jao')
        .controller('CronJobController', CronJobController);
    
    CronJobController.$inject = ['cronJobService', 'messageService'];
    
    function CronJobController(cronJobService, messageService) {
        var vm = this;
        
        vm.jobs = [];
        vm.loading = false;
        
        vm.loadJobs = loadJobs;
        vm.createJob = createJob;
        vm.deleteJob = deleteJob;
        
        activate();
        
        function activate() {
            loadJobs();
        }
        
        function loadJobs() {
            vm.loading = true;
            return cronJobService.findAll()
                .then(function(data) {
                    vm.jobs = data;
                })
                .catch(function(error) {
                    messageService.toast('error', 'Failed to load jobs');
                })
                .finally(function() {
                    vm.loading = false;
                });
        }
        
        function createJob(job) {
            return cronJobService.create(job)
                .then(function() {
                    messageService.toast('success', 'Job created successfully');
                    return loadJobs();
                })
                .catch(function(error) {
                    messageService.toast('error', 'Failed to create job');
                });
        }
        
        function deleteJob(id) {
            return cronJobService.delete(id)
                .then(function() {
                    messageService.toast('success', 'Job deleted successfully');
                    return loadJobs();
                })
                .catch(function(error) {
                    messageService.toast('error', 'Failed to delete job');
                });
        }
    }
})();
```

#### 步骤4: 创建模板
```html
<div class="cron-job-list" ng-controller="CronJobController as vm">
    <!-- 加载状态 -->
    <div ng-if="vm.loading" class="loading-spinner">
        <i class="fa fa-spinner fa-spin"></i>
        {{ 'common.loading' | translate }}
    </div>
    
    <!-- 任务列表 -->
    <div ng-if="!vm.loading" class="job-list">
        <div class="job-item" ng-repeat="job in vm.jobs track by job.id">
            <div class="job-info">
                <h4 class="job-title">{{ job.jobDesc }}</h4>
                <p class="job-schedule">{{ job.scheduleConf }}</p>
            </div>
            <div class="job-actions">
                <button class="btn btn-sm btn-danger" 
                        ng-click="vm.deleteJob(job.id)">
                    {{ 'common.action.delete' | translate }}
                </button>
            </div>
        </div>
    </div>
    
    <!-- 空状态 -->
    <div ng-if="!vm.loading && vm.jobs.length === 0" class="empty-state">
        <p>{{ 'task_scheduling.no_jobs' | translate }}</p>
    </div>
</div>
```

### 3.3 测试开发

#### 单元测试
```javascript
describe('CronJobController', function() {
    var controller, scope, cronJobService, messageService;
    
    beforeEach(function() {
        module('oplus.jao');
        
        inject(function($controller, $rootScope, _cronJobService_, _messageService_) {
            scope = $rootScope.$new();
            cronJobService = _cronJobService_;
            messageService = _messageService_;
            
            // Mock服务方法
            spyOn(cronJobService, 'findAll').and.returnValue(
                Promise.resolve([{id: 1, jobDesc: 'Test Job'}])
            );
            spyOn(messageService, 'toast');
            
            controller = $controller('CronJobController', {
                $scope: scope,
                cronJobService: cronJobService,
                messageService: messageService
            });
        });
    });
    
    it('should load jobs on initialization', function() {
        expect(cronJobService.findAll).toHaveBeenCalled();
    });
    
    it('should create job successfully', function() {
        var job = {jobDesc: 'New Job', scheduleConf: '0 0 * * * ?'};
        spyOn(cronJobService, 'create').and.returnValue(Promise.resolve());
        
        controller.createJob(job);
        
        expect(cronJobService.create).toHaveBeenCalledWith(job);
    });
});
```

#### 集成测试
```javascript
describe('CronJob API Integration', function() {
    var $httpBackend, cronJobService;
    
    beforeEach(function() {
        module('oplus.jao');
        
        inject(function(_$httpBackend_, _cronJobService_) {
            $httpBackend = _$httpBackend_;
            cronJobService = _cronJobService_;
        });
    });
    
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should fetch all cron jobs', function() {
        var mockJobs = [{id: 1, jobDesc: 'Test Job'}];
        
        $httpBackend.expectGET('/oplus-portal/jao/api/jao/cron')
            .respond(200, mockJobs);
        
        cronJobService.findAll().then(function(jobs) {
            expect(jobs).toEqual(mockJobs);
        });
        
        $httpBackend.flush();
    });
});
```

## 4. 调试技巧

### 4.1 前端调试

#### 使用浏览器开发者工具
```javascript
// 在控制台中调试Angular应用
// 获取作用域
var scope = angular.element('[ng-controller="CronJobController"]').scope();
console.log('Controller:', scope.vm);

// 获取服务实例
var cronJobService = angular.element(document.body).injector().get('cronJobService');
console.log('Service:', cronJobService);

// 手动触发摘要循环
scope.$apply();
```

#### 添加调试日志
```javascript
// 在开发环境中启用详细日志
if (window.location.hostname === 'localhost') {
    window.DEBUG = true;
}

function debugLog(message, data) {
    if (window.DEBUG) {
        console.log('[DEBUG]', message, data);
    }
}

// 在代码中使用
debugLog('Loading tasks', {timestamp: new Date()});
```

#### 使用断点调试
```javascript
function loadTasks() {
    debugger; // 设置断点
    
    vm.loading = true;
    return cronJobService.findAll()
        .then(function(data) {
            debugger; // 检查返回数据
            vm.tasks = data;
        });
}
```

### 4.2 网络请求调试

#### 拦截HTTP请求
```javascript
angular.module('oplus.jao').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('debugInterceptor');
}]);

angular.module('oplus.jao').factory('debugInterceptor', ['$q', function($q) {
    return {
        request: function(config) {
            console.log('HTTP Request:', config);
            return config;
        },
        response: function(response) {
            console.log('HTTP Response:', response);
            return response;
        },
        responseError: function(rejection) {
            console.error('HTTP Error:', rejection);
            return $q.reject(rejection);
        }
    };
}]);
```

#### 模拟API响应
```javascript
// 使用$httpBackend模拟API
angular.module('oplus.jao').run(['$httpBackend', function($httpBackend) {
    if (window.location.hostname === 'localhost') {
        // 模拟获取任务列表
        $httpBackend.whenGET(/\/api\/jao\/cron/).respond(function() {
            return [200, [
                {id: 1, jobDesc: 'Mock Job 1', scheduleConf: '0 0 * * * ?'},
                {id: 2, jobDesc: 'Mock Job 2', scheduleConf: '0 0/5 * * * ?'}
            ]];
        });
        
        // 允许其他请求通过
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
    }
}]);
```

## 5. 性能优化

### 5.1 前端性能优化

#### 减少摘要循环
```javascript
// 使用一次性绑定
<div ng-repeat="job in ::vm.jobs">
    <span>{{ ::job.jobDesc }}</span>
</div>

// 使用track by优化ng-repeat
<div ng-repeat="job in vm.jobs track by job.id">
    <!-- 内容 -->
</div>
```

#### 懒加载和分页
```javascript
function loadTasksWithPagination(page, size) {
    var params = {
        page: page || 1,
        size: size || 20
    };
    
    return cronJobService.findAll(params)
        .then(function(response) {
            if (page === 1) {
                vm.tasks = response.data;
            } else {
                vm.tasks = vm.tasks.concat(response.data);
            }
            vm.hasMore = response.data.length === params.size;
        });
}

// 无限滚动实现
function onScroll() {
    var element = document.querySelector('.task-list');
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 100) {
        if (vm.hasMore && !vm.loading) {
            loadTasksWithPagination(vm.currentPage + 1);
        }
    }
}
```

#### 缓存策略
```javascript
// 实现简单的内存缓存
var cache = {
    data: {},
    ttl: 5 * 60 * 1000, // 5分钟
    
    get: function(key) {
        var item = this.data[key];
        if (item && Date.now() - item.timestamp < this.ttl) {
            return item.value;
        }
        return null;
    },
    
    set: function(key, value) {
        this.data[key] = {
            value: value,
            timestamp: Date.now()
        };
    },
    
    clear: function() {
        this.data = {};
    }
};

// 在服务中使用缓存
function findAll() {
    var cached = cache.get('cronJobs');
    if (cached) {
        return Promise.resolve(cached);
    }
    
    return restUtils.callApi(module, 'GET', '/api/jao/cron')
        .then(function(data) {
            cache.set('cronJobs', data);
            return data;
        });
}
```

### 5.2 代码分割和模块化

#### 按需加载模块
```javascript
// 使用ocLazyLoad实现懒加载
angular.module('oplus.jao').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('app.jao.cron_job', {
        url: '/cron-list',
        resolve: {
            loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/modules/jao/cronJob/cron-job-list.controller.js',
                    'app/modules/jao/cronJob/cron-job.service.js'
                ]);
            }]
        },
        views: {
            'jaoMainView': {
                templateUrl: 'app/modules/jao/cronJob/cron-job-list.html',
                controller: 'CronJobController',
                controllerAs: 'vm'
            }
        }
    });
}]);
```

## 6. 部署和发布

### 6.1 构建优化

#### Gulp构建任务
```javascript
// 压缩JavaScript
gulp.task('minify-js', function() {
    return gulp.src('src/webapp/app/modules/jao/cronJob/**/*.js')
        .pipe(concat('cron-job.min.js'))
        .pipe(uglify({
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }))
        .pipe(gulp.dest('dist/js/'));
});

// 压缩CSS
gulp.task('minify-css', function() {
    return gulp.src('src/webapp/app/modules/jao/cronJob/**/*.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(concat('cron-job.min.css'))
        .pipe(gulp.dest('dist/css/'));
});

// 模板缓存
gulp.task('template-cache', function() {
    return gulp.src('src/webapp/app/modules/jao/cronJob/**/*.html')
        .pipe(templateCache('cron-job-templates.js', {
            module: 'oplus.jao'
        }))
        .pipe(gulp.dest('dist/js/'));
});
```

### 6.2 版本控制

#### 语义化版本
```json
{
  "version": "1.2.3",
  "description": "1.2.3版本更新内容：修复任务调度bug，优化性能"
}
```

#### Git工作流
```bash
# 功能开发
git checkout -b feature/cron-job-enhancement
git add .
git commit -m "feat: add batch operation for cron jobs"
git push origin feature/cron-job-enhancement

# 创建Pull Request
# 代码审查
# 合并到主分支

# 发布版本
git checkout main
git pull origin main
git tag v1.2.3
git push origin v1.2.3
```

## 7. 最佳实践

### 7.1 代码质量
- 使用ESLint进行代码检查
- 编写单元测试和集成测试
- 进行代码审查
- 使用TypeScript增强类型安全

### 7.2 性能优化
- 实现数据缓存
- 使用分页和虚拟滚动
- 优化网络请求
- 减少DOM操作

### 7.3 用户体验
- 提供加载状态指示
- 实现错误处理和重试机制
- 支持键盘导航
- 确保响应式设计

### 7.4 安全性
- 验证用户输入
- 实现权限控制
- 防止XSS攻击
- 使用HTTPS传输

通过遵循这些开发指南和最佳实践，可以确保JAO任务调度模块的代码质量、性能和可维护性。