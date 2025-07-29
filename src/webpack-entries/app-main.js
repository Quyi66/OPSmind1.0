/**
 * 主应用入口文件 - 启动Angular应用
 */

// 导入主应用模块和初始化脚本
import '../webapp/app/modules/main/appconfig-init.js';
import '../webapp/app/modules/main/main.module.js';
import '../webapp/app/modules/main/app.module.js';
import '../webapp/app/modules/main/tenant-config-init.js';
import '../webapp/app/modules/main/main-init.js';
import '../webapp/app/modules/main/main.state.js';
import '../webapp/app/modules/main/main-config.js';
import '../webapp/app/modules/main/main.controller.js';
import '../webapp/app/modules/main/tenant-util.js';

console.log('✅ Main app modules loaded');

// 确保Angular应用在DOM加载完成后启动
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, Angular app should bootstrap');
    
    // 检查Angular是否已加载
    if (typeof angular !== 'undefined') {
        console.log('✅ Angular is available');
        
        // 手动启动Angular应用（如果需要）
        try {
            // 检查应用是否已经启动
            const appElement = document.querySelector('[ng-app="OplusApp"]');
            if (appElement && !angular.element(appElement).scope()) {
                console.log('🔄 Manually bootstrapping Angular app...');
                angular.bootstrap(appElement, ['OplusApp']);
            }
        } catch (error) {
            console.warn('⚠️ Angular bootstrap error (may be normal if already bootstrapped):', error);
        }
    } else {
        console.error('❌ Angular is not loaded!');
    }
});
