const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
    const commonConfig = common(env, { ...argv, mode: 'production' });
    const isAnalyze = process.env.ANALYZE === 'true';

    return merge(commonConfig, {
        mode: 'production',
        
        devtool: 'source-map',
        
        optimization: {
            ...commonConfig.optimization,
            minimize: true,
            minimizer: [
                // JavaScript 压缩
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log', 'console.info', 'console.debug']
                        },
                        mangle: {
                            reserved: ['angular', 'jQuery', '$', 'window', 'document']
                        },
                        format: {
                            comments: false,
                            preamble: `/*! oplus-modules v${require('./package.json').version} */`
                        }
                    },
                    extractComments: false,
                    parallel: true
                }),
                
                // CSS 压缩
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: { removeAll: true },
                                normalizeWhitespace: true,
                                colormin: true,
                                convertValues: true,
                                discardDuplicates: true,
                                discardEmpty: true,
                                mergeIdents: false,
                                reduceIdents: false,
                                safe: true
                            }
                        ]
                    }
                })
            ],
            
            splitChunks: {
                chunks: 'all',
                minSize: 20000,
                minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    // 第三方库
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10,
                        reuseExistingChunk: true
                    },
                    // Angular 相关
                    angular: {
                        test: /[\\/]node_modules[\\/](angular|@angular)[\\/]/,
                        name: 'angular',
                        chunks: 'all',
                        priority: 20,
                        reuseExistingChunk: true
                    },
                    // jQuery 和工具库
                    utils: {
                        test: /[\\/]node_modules[\\/](jquery|lodash|moment|luxon)[\\/]/,
                        name: 'utils',
                        chunks: 'all',
                        priority: 15,
                        reuseExistingChunk: true
                    },
                    // 通用模块
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 5,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    // 默认组
                    default: {
                        minChunks: 2,
                        priority: -10,
                        reuseExistingChunk: true
                    }
                }
            },
            
            runtimeChunk: {
                name: 'runtime'
            },
            
            moduleIds: 'deterministic',
            chunkIds: 'deterministic'
        },

        plugins: [
            ...commonConfig.plugins,
            
            // Gzip 压缩
            new CompressionPlugin({
                filename: '[path][base].gz',
                algorithm: 'gzip',
                test: /\.(js|css|html|svg)$/,
                threshold: 8192,
                minRatio: 0.8,
                compressionOptions: {
                    level: 9
                }
            }),
            
            // Brotli 压缩
            new CompressionPlugin({
                filename: '[path][base].br',
                algorithm: 'brotliCompress',
                test: /\.(js|css|html|svg)$/,
                threshold: 8192,
                minRatio: 0.8,
                compressionOptions: {
                    level: 11
                }
            }),
            
            // 包分析器（可选）
            ...(isAnalyze ? [
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: false,
                    reportFilename: 'bundle-analyzer-report.html',
                    defaultSizes: 'gzip',
                    generateStatsFile: true,
                    statsFilename: 'webpack-stats.json'
                })
            ] : [])
        ],

        performance: {
            hints: 'warning',
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
            }
        },

        stats: {
            ...commonConfig.stats,
            assets: true,
            builtAt: true,
            timings: true,
            performance: true,
            warnings: true,
            errors: true,
            errorDetails: true
        }
    });
}; 