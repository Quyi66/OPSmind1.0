const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 传统构建配置 - 回退到script标签方式
 * 这个配置只处理HTML生成，不处理JS模块化
 */
module.exports = (env = {}, argv = {}) => {
    const isProduction = argv.mode === 'production';
    
    console.log('🔄 传统构建模式启动');
    console.log('📄 使用传统script标签，webpack仅用于HTML服务');
    console.log(`🔧 环境: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

    return {
        // 禁用所有JS入口点
        entry: {},
        
        // 输出配置
        output: {
            path: path.resolve(__dirname, 'dist'),
            clean: true
        },
        
        // 解析配置（保留基本配置以支持静态资源）
        resolve: {
            extensions: ['.js', '.json'],
            alias: {
                '@': path.resolve(__dirname, 'src/webapp'),
                'app': path.resolve(__dirname, 'src/webapp/app'),
                'content': path.resolve(__dirname, 'src/webapp/content'),
                'lib': path.resolve(__dirname, 'src/webapp/lib')
            }
        },
        
        // 模块处理（只处理静态资源）
        module: {
            rules: [
                // CSS文件处理
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                // 静态资源处理
                {
                    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/[name][ext]'
                    }
                }
            ]
        },
        
        // 插件配置
        plugins: [
            // 只生成HTML，不注入任何JS
            new HtmlWebpackPlugin({
                template: './src/webapp/index.html',
                filename: 'index.html',
                inject: false, // 关键：禁用自动注入
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true
                } : false
            })
        ],
        
        // 开发服务器配置
        devServer: {
            static: {
                directory: path.join(__dirname, 'src/webapp'),
                publicPath: '/'
            },
            port: 8080,
            host: 'localhost',
            hot: false, // 禁用热更新
            liveReload: true, // 启用实时刷新
            open: false,
            compress: true,
            historyApiFallback: {
                index: '/index.html'
            },
            client: {
                logging: 'info',
                overlay: {
                    errors: true,
                    warnings: false
                }
            }
        },
        
        // 开发工具
        devtool: isProduction ? false : 'eval-source-map',
        
        // 性能配置
        performance: {
            hints: false // 禁用性能提示，因为我们不打包JS
        },
        
        // 统计信息
        stats: {
            children: false,
            chunks: false,
            modules: false,
            reasons: false,
            usedExports: false,
            providedExports: false,
            optimizationBailout: false,
            errorDetails: true,
            colors: true,
            assets: false,
            builtAt: true,
            timings: true
        }
    };
};
