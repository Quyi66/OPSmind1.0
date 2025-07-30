(function () {
    /**
     * Define distribution profiles
     */
    window['@oplus/init'].profiles = [
        {
            // This is the default profile whose ID must be '$DEFAULT_PROFILE$'
            profileId: '$DEFAULT_PROFILE$',
            name: "OPSmind",
            apiBaseUrls: {
                portal: '/local-portal',
                com: '/oplus-portal/com',
                adm: '/oplus-portal/adm',
                dts: '/oplus-portal/dts',
                vap: '/oplus-portal/vap',
                udp: '/oplus-portal/udp',
                tm: '/oplus-portal/tm',
                jao: '/oplus-portal/jao',
                cm: '/oplus-portal/cm',
                acm: '/oplus-portal/acm',
                cac: '/oplus-portal/cac',
                gfs: '/oplus-portal/gfs',
                upload: '/oplus-upload',
                upm: '/oplus-portal/upm',
                mac: '/oplus-portal/mac',
                search: '/oplus-portal/es',
                flow: '/oplus-portal/flow',
                vcm: '/oplus-portal/vcm',
                vsm: '/oplus-portal/vsm',
                email: '',
                pdf: '/oplus-njs',
                // WebSocket
                ws: '/oplus-ws',
                url: '',
                agent: '/oplus-portal/agent',
            },
            ui: {
                help: 'help/',
                home: "app/modules/layout/home/home.html",
                homeType: 'default',
                logo: "content/images/logo-default.png",
                headerLogo: "content/images/logo-default-full.png",
                enableHelpDoc: true,
                // Wallpapers are placed in dir `content/images/wallpaper`
                wallpapers: ['oplus-wallpaper-1.jpg','oplus-wallpaper-4.jpg'],
                wallpaperChangeInterval: 60 * 15,
                wallpaperEnabled: true,
                backgroundColor: '#1D2939'
            },
            useWindowUI: true,
            useMultiTenant: true,//is in multi-tenant mode
            i18n: {
                defaultLanguage: "zh-cn"
            },
            //TODO: rename to more intuitive meaning
            certification: {
                enable: false
            },
            modules: {
                udp: {
                    // enabled: true
                },
                dts: {
                    sourceTypes: ['jdbc', 'rest', 'join']
                    // sourceTypes: [] //'jdbc','join','es','file','mongo','hbase','rest','orientdb',
                },
                mac: {
                    poll: false
                }
            }
        },
        {
            profileId: 'dev',
            name: "O.P.L.U.S"
        },
        {
            profileId: 'prod',
            name: "OPSmind",
            ui: {
                help: 'help/',
                home: "app/modules/layout/home/home.html",
                homeType: 'default',
                logo: "content/images/opsmind/logo-opsmind.png",
                headerLogo: "content/images/opsmind/logo-opsmind-full.png"
            }
        },
        {
            profileId: 'vivo',
            name: "OPLUS",
            ui: {
                help: 'help/',
                home: "app/modules/layout/home/home.html",
                homeType: 'default',
                logo: "content/images/vivo/logo-vivo-header.ico",
                headerLogo: "content/images/vivo/logo-vivo.png"
            },
        },
        {
            profileId: 'migu',
            name: "OPLUS",
            ui: {
                help: 'help/',
                home: "app/modules/layout/home/home.html",
                homeType: 'default',
                logo: "content/images/migu/logo-migu-header.ico",
                headerLogo: "content/images/migu/logo-migu.png"
            },
        },
        {
            profileId: 'csdc',
            name: "OPLUS",
            ui: {
                help: 'help/',
                home: "app/modules/layout/home/home.html",
                homeType: 'default',
                logo: "content/images/csdc/logo-csdc-header.ico",
                headerLogo: "content/images/csdc/logo-csdc.png"
            },
        },
        {
            profileId: 'crc',
            name: "OPLUS",
            ui: {
                help: 'help/',
                home: "app/modules/layout/home/home.html",
                homeType: 'default',
                logo: "content/images/crc/logo-crc-header.png",
                headerLogo: "content/images/crc/logo-crc.png"
            }
        },
        {
            profileId: 'bcs',
            name: "OPLUS",
            ui: {
                help: 'help/',
                home: "app/modules/layout/home/home.html",
                homeType: 'default',
                logo: "content/images/bcs/logo-bcs-header.png",
                headerLogo: "content/images/bcs/logo-bcs.png"
            }
        },
        {
            profileId: 'kylin',
            name: "OPLUS",
            ui: {
                help: 'help/',
                home: "app/modules/layout/home/home.html",
                homeType: 'default',
                logo: "content/images/kylin/logo-kylin.png",
                headerLogo: "content/images/kylin/logo-kylin.png",
                enableHelpDoc: true,
                wallpaperEnabled: false
            }
        },
        {
            profileId: 'famessoft',
            name: "OPLUS",
            ui: {
                help: 'help/',
                home: "app/modules/layout/home/home.html",
                homeType: 'default',
                logo: "content/images/famessoft/logo-famessoft.png",
                headerLogo: "content/images/famessoft/logo-famessoft.png",
                enableHelpDoc: true,
                wallpaperEnabled: false
            }
        }
    ];
})
();
