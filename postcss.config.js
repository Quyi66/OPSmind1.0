module.exports = {
    plugins: [
        // CSS 前缀自动添加
        require('autoprefixer')({
            overrideBrowserslist: [
                '> 1%',
                'last 2 versions',
                'ie >= 11',
                'chrome >= 60',
                'firefox >= 60',
                'safari >= 12',
                'edge >= 16'
            ],
            grid: true,
            flexbox: 'no-2009'
        }),
        
        // CSS 变量回退
        require('postcss-custom-properties')({
            preserve: false
        }),
        
        // CSS 嵌套支持
        require('postcss-nested'),
        
        // CSS 导入处理
        require('postcss-import')({
            path: ['src/webapp/content/scss']
        }),
        
        // CSS URL 处理
        require('postcss-url')({
            url: 'rebase'
        }),
        
        // 生产环境优化
        ...(process.env.NODE_ENV === 'production' ? [
            // CSS 优化
            require('cssnano')({
                preset: [
                    'default',
                    {
                        discardComments: {
                            removeAll: true
                        },
                        normalizeWhitespace: true,
                        colormin: true,
                        convertValues: true,
                        discardDuplicates: true,
                        discardEmpty: true,
                        mergeIdents: false,
                        reduceIdents: false,
                        safe: true,
                        autoprefixer: false // 避免与 autoprefixer 冲突
                    }
                ]
            })
        ] : [])
    ]
}; 