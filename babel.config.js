module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    // 支持的浏览器版本
                    browsers: [
                        '> 1%',
                        'last 2 versions',
                        'ie >= 11',
                        'chrome >= 60',
                        'firefox >= 60',
                        'safari >= 12',
                        'edge >= 16'
                    ]
                },
                // 使用 polyfill
                useBuiltIns: 'usage',
                corejs: {
                    version: 3,
                    proposals: true
                },
                // 模块转换设置
                modules: false, // 保留 ES6 模块语法，让 webpack 处理
                debug: false,
                // 不转换 ES6 模块语法（保持 import/export）
                exclude: ['transform-es2015-modules-commonjs']
            }
        ]
    ],
    
    plugins: [
        // 对象扩展运算符支持
        '@babel/plugin-proposal-object-rest-spread',
        
        // 类属性支持
        '@babel/plugin-proposal-class-properties',
        
        // 可选链操作符
        '@babel/plugin-transform-optional-chaining',
        
        // 空值合并操作符
        '@babel/plugin-transform-nullish-coalescing-operator',
        
        // 动态导入
        '@babel/plugin-syntax-dynamic-import',
        
        // 运行时助手
        [
            '@babel/plugin-transform-runtime',
            {
                corejs: false,
                helpers: true,
                regenerator: true,
                useESModules: false,
                absoluteRuntime: false,
                version: '^7.0.0'
            }
        ]
    ],
    
    // 环境特定配置
    env: {
        development: {
            plugins: [
                // 开发环境下保留函数名
                ['@babel/plugin-transform-runtime', { helpers: false }]
            ]
        },
        production: {
            plugins: [
                // 生产环境下移除 console 和 debugger
                [
                    'transform-remove-console',
                    {
                        exclude: ['error', 'warn']
                    }
                ]
            ]
        },
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: { node: 'current' },
                        modules: 'commonjs'
                    }
                ]
            ]
        }
    },
    
    // 忽略某些文件
    ignore: [
        'node_modules/**',
        'src/webapp/lib/**',
        'src/webapp/content/fonts/**',
        'src/webapp/content/images/**'
    ],
    
    // 源码映射
    sourceMaps: true,
    
    // 保留注释（在生产环境中会被覆盖）
    comments: true
}; 