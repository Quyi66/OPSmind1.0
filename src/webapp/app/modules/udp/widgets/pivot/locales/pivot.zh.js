(function () {
    'use strict';
    angular.module('oplus.udp').run(['i18nService', addPivotLocale]);
    var zh_cn = {
        renderError: "展示结果时出错。",
        computeError: "计算结果时出错。",
        uiRenderError: "展示界面时出错。",
        selectAll: "选择全部",
        selectNone: "全部不选",
        tooMany: "(因数据过多而无法列出)",
        filterResults: "筛选",
        apply: "确定",
        cancel: "取消",
        totals: "合计",
        vs: "于",
        by: "分组于",
        renderers: {
            // Default renderers
            "Table": "表格",
            "Table Barchart": "表格内柱状图",
            "Heatmap": "热图",
            "Row Heatmap": "行热图",
            "Col Heatmap": "列热图",
            // C3 renderers
            "Line Chart": "折线图",
            "Bar Chart": "柱状图",
            "Area Chart": "面积图",
            "Stacked Bar Chart": "堆栈柱状图",
            "Horizontal Bar Chart": "水平柱状图",
            "Horizontal Stacked Bar Chart": "水平堆叠柱状图",
            "Scatter Chart": "散点图"
        },
        aggregators: {
            "Count": "频数",
            "Count Unique Values": "非重复值的个数",
            "List Unique Values": "列出非重复值",
            "Sum": "求和",
            "Integer Sum": "求和后取整",
            "Average": "平均值",
            "Median": "中位数",
            "Sample Variance": "方差",
            "Sample Standard Deviation": "样本标准偏差",
            "Minimum": "最小值",
            "Maximum": "最大值",
            "First": "第一",
            "Last": "最后",
            "Sum over Sum": "两和之比",
            "80% Upper Bound": "二项分布：置信度为80%时的区间上限",
            "80% Lower Bound": "二项分布：置信度为80%时的区间下限",
            "Sum as Fraction of Total": "和在总计中的比例",
            "Sum as Fraction of Rows": "和在行合计中的比例",
            "Sum as Fraction of Columns": "和在列合计中的比例",
            "Count as Fraction of Total": "频数在总计中的比例",
            "Count as Fraction of Rows": "频数在行合计中的比例",
            "Count as Fraction of Columns": "频数在列合计中的比例"
        }
    };
    var zh_tw = {
        renderError: "展示結果時出錯。",
        computeError: "計算結果時出錯。",
        uiRenderError: "展示介面時出錯。",
        selectAll: "選擇全部",
        selectNone: "全部不選",
        tooMany: "(因資料過多而無法列出)",
        filterResults: "篩選",
        apply: "確定",
        cancel: "取消",
        totals: "合計",
        vs: "於",
        by: "分組於",
        renderers: {
            // Default renderers
            "Table": "表格",
            "Table Barchart": "表格內柱狀圖",
            "Heatmap": "熱圖",
            "Row Heatmap": "行熱圖",
            "Col Heatmap": "列熱圖",
            // C3 renderers
            "Line Chart": "折線圖",
            "Bar Chart": "柱狀圖",
            "Area Chart": "面積圖",
            "Stacked Bar Chart": "堆疊柱狀圖",
            "Horizontal Bar Chart": "水平柱狀圖",
            "Horizontal Stacked Bar Chart": "水平堆疊柱狀圖",
            "Scatter Chart": "散點圖"
        },
        aggregators: {
            "Count": "頻數",
            "Count Unique Values": "非重複值的個數",
            "List Unique Values": "列出非重複值",
            "Sum": "求和",
            "Integer Sum": "求和後取整",
            "Average": "平均值",
            "Median": "中位數",
            "Sample Variance": "方差",
            "Sample Standard Deviation": "樣本標準偏差",
            "Minimum": "最小值",
            "Maximum": "最大值",
            "First": "第一",
            "Last": "最後",
            "Sum over Sum": "兩和之比",
            "80% Upper Bound": "二項分佈：置信度為80%時的區間上限",
            "80% Lower Bound": "二項分佈：置信度為80%時的區間下限",
            "Sum as Fraction of Total": "和在總計中的比例",
            "Sum as Fraction of Rows": "和在行合計中的比例",
            "Sum as Fraction of Columns": "和在列合計中的比例",
            "Count as Fraction of Total": "頻數在總計中的比例",
            "Count as Fraction of Rows": "頻數在行合計中的比例",
            "Count as Fraction of Columns": "頻數在列合計中的比例"
        }
    };
    var zh_hk = {
        renderError: "展示結果時出錯。",
        computeError: "計算結果時出錯。",
        uiRenderError: "展示界面時出錯。",
        selectAll: "選擇全部",
        selectNone: "全部不選",
        tooMany: "(因數據過多而無法列出)",
        filterResults: "篩選",
        apply: "確定",
        cancel: "取消",
        totals: "合計",
        vs: "於",
        by: "分組於",
        renderers: {
            // Default renderers
            "Table": "表格",
            "Table Barchart": "表格內柱狀圖",
            "Heatmap": "熱圖",
            "Row Heatmap": "行熱圖",
            "Col Heatmap": "列熱圖",
            // C3 renderers
            "Line Chart": "折線圖",
            "Bar Chart": "柱狀圖",
            "Area Chart": "面積圖",
            "Stacked Bar Chart": "堆棧柱狀圖",
            "Horizontal Bar Chart": "水平柱狀圖",
            "Horizontal Stacked Bar Chart": "水平堆疊柱狀圖",
            "Scatter Chart": "散點圖"
        },
        aggregators: {
            "Count": "頻數",
            "Count Unique Values": "非重複值的個數",
            "List Unique Values": "列出非重複值",
            "Sum": "求和",
            "Integer Sum": "求和後取整",
            "Average": "平均值",
            "Median": "中位數",
            "Sample Variance": "方差",
            "Sample Standard Deviation": "樣本標準偏差",
            "Minimum": "最小值",
            "Maximum": "最大值",
            "First": "第一",
            "Last": "最後",
            "Sum over Sum": "兩和之比",
            "80% Upper Bound": "二項分佈：置信度為80%時的區間上限",
            "80% Lower Bound": "二項分佈：置信度為80%時的區間下限",
            "Sum as Fraction of Total": "和在總計中的比例",
            "Sum as Fraction of Rows": "和在行合計中的比例",
            "Sum as Fraction of Columns": "和在列合計中的比例",
            "Count as Fraction of Total": "頻數在總計中的比例",
            "Count as Fraction of Rows": "頻數在行合計中的比例",
            "Count as Fraction of Columns": "頻數在列合計中的比例"
        }
    };

    /**
     *
     * @param {i18nService} i18nService
     */
    function addPivotLocale(i18nService) {
        i18nService.addLocaleForPivot('zh-cn', zh_cn);
        i18nService.addLocaleForPivot('zh-tw', zh_tw);
        i18nService.addLocaleForPivot('zh-hk', zh_hk);
    }
})();