// FullCalendar 中文本地化文件
(function() {
    'use strict';
    
    // 延迟加载本地化配置，确保 FullCalendar 已经加载
    function loadLocale() {
        if (typeof window.FullCalendar !== 'undefined' && 
            window.FullCalendar.globalLocales && 
            Array.isArray(window.FullCalendar.globalLocales)) {
            
            window.FullCalendar.globalLocales.push({
                code: 'zh-cn',
                buttonText: {
                    prev: '上月',
                    next: '下月',
                    today: '今天',
                    month: '月',
                    week: '周',
                    day: '日',
                    list: '列表'
                },
                weekText: '周',
                allDayText: '全天',
                moreLinkText: '更多',
                noEventsText: '没有事件显示'
            });
            console.log('✅ FullCalendar zh-cn locale loaded');
        } else {
            // 如果 FullCalendar 还没加载，等待一段时间后重试
            setTimeout(loadLocale, 100);
        }
    }
    
    // 立即尝试加载，如果失败则延迟重试
    loadLocale();
})();