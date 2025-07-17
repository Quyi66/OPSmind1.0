// FullCalendar 繁体中文本地化文件
(function() {
    'use strict';
    
    // 延迟加载本地化配置，确保 FullCalendar 已经加载
    function loadLocale() {
        if (typeof window.FullCalendar !== 'undefined' && 
            window.FullCalendar.globalLocales && 
            Array.isArray(window.FullCalendar.globalLocales)) {
            
            window.FullCalendar.globalLocales.push({
                code: 'zh-tw',
                buttonText: {
                    prev: '上月',
                    next: '下月',
                    today: '今天',
                    month: '月',
                    week: '週',
                    day: '日',
                    list: '列表'
                },
                weekText: '週',
                allDayText: '全天',
                moreLinkText: '更多',
                noEventsText: '沒有事件顯示'
            });
            console.log('✅ FullCalendar zh-tw locale loaded');
        } else {
            // 如果 FullCalendar 还没加载，等待一段时间后重试
            setTimeout(loadLocale, 100);
        }
    }
    
    // 立即尝试加载，如果失败则延迟重试
    loadLocale();
})();