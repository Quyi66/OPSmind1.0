(function (window) {
    'use strict';

    var config = {
        name: 'OPsMind Usage',//<img src="_media/images/logo-default.png" style="height:4rem">',
        coverpage: false,
        loadNavbar: false,
        loadSidebar: true,
        notFoundPage: true,
        auto2top: true,
        maxLevel: 3,
        subMaxLevel: 3,
        sidebarDisplayLevel: 3,
        search: {
            paths: 'auto',
            placeholder: {
                '/': '搜索'
            }
        },
        themeable: {
            readyTransition: true, // default
            responsiveTables: true  // default
        },
        tabs: {
            persist: true,      // default
            sync: true,      // default
            theme: 'material', // default is 'classic'
            tabComments: true,      // default
            tabHeadings: true       // default
        },
        'flexible-alerts': {
            style: 'flat'
        },
        copyCode: {
            buttonText: {
                '/': '点击复制'
            },
            errorText: {
                '/': '错误'
            },
            successText: {
                '/': '已复制'
            }
        }
    };

    var category = getCategory();
    if (category) {
        config.nameLink = window.location.href.split('#/')[0];
        config.basepath = '../';
        config.alias = {
            '/_sidebar.md': '/env/' + category + '/_sidebar.md',
            '/README.md': '/env/' + category + '/README.md'
        }
    }

    window.$docsify = config;

    /**
     * 从url中提取帮助文档分组
     * gmcc: http://localhost/oplus/demo/help/?category=gmcc#/tm/index
     * @returns {String}
     */
    function getCategory() {
        return (new URLSearchParams(window.location.search)).get('category');
    }

    if (localStorage['oplus.locale'] && localStorage['oplus.locale'] === 'zh-tw')
    {
        var converterZhCnToZhTwP = OpenCC.Converter({ from: 'cn', to: 'twp' });

        window.onload = function (e) {
            document.body.innerHTML = converterZhCnToZhTwP(document.body.innerHTML)
        }

        window.onhashchange = function (e) {
            if (e.newURL.split('?')[0] !== e.oldURL.split('?')[0]) {
                location.reload()
            }
        }
    }


})(typeof window !== 'undefined' ? window : this);
