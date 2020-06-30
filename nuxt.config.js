import colors from 'vuetify/es5/util/colors';
const axios = require("axios"); 
const basePath = 'https://romantic-payne-342f37.netlify.app/';
const siteName = '奥三河OUTDOOR';
const siteDesc = '秘境"奥三河"のアウトドアを楽しもう';
const siteKeywords = '奥三河,アウトドア,イベント,オリエンテーリング,自然';
const ogpImages = basePath + 'ogp/';

export default {
    /*
    ** Nuxt rendering mode
    ** See https://nuxtjs.org/api/configuration-mode
    */
    mode: 'universal',
    /*
    ** Nuxt target
    ** See https://nuxtjs.org/api/configuration-target
    */
    target: 'static',
    /*
    ** Headers of the page
    ** See https://nuxtjs.org/api/configuration-head
    */
    head: {
        htmlAttrs: {
            prefix: 'og: http://ogp.me/ns#',
            lang: 'ja'
        },
        titleTemplate: `${siteName} - %s`,
        meta: [
            // 設定関連
            { charset: 'utf-8' },
            { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          
            // SEO関連
            { hid: 'description', name: 'description', content: siteDesc },
            { hid: 'keywords', name: 'keywords', content: siteKeywords },
            
            // ogp関連
            { hid: 'og:site_name', property: 'og:site_name', content: siteName },
            { hid: 'og:type', property: 'og:type', content: 'website' },
            { hid: 'og:url', property: 'og:url', content: basePath },
            { hid: 'og:title', property: 'og:title', content: siteName },
            { hid: 'og:description', property: 'og:description', content: siteDesc },
            { hid: 'og:image', property: 'og:image', content: `${ogpImages}home.jpg` },
            { name: 'twitter:card', content: 'summary_large_image' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
  /*
  ** Global CSS
  */
  css: [
    '~~/font/dist/css/materialdesignicons.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
      '~plugins/day.js',
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  },
  generate: {
        routes: async function () {
            var layout = await axios.get('https://testhp.microcms.io/api/v1/layout', {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            var menus = await axios.get('https://testhp.microcms.io/api/v1/menu', {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            var sections = await axios.get('https://testhp.microcms.io/api/v1/section', {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            var routes = []
            layout = layout.data.contents[0]
            menus = menus.data.contents
            var header = menus.filter(x => x.header)
            var footer = menus.filter(x => x.footer)
            sections = sections.data.contents
            var homeSections = layout.layout
            layout = {
                header: {
                    title: (layout.title)? layout.title: '',
                    logo: (layout.logo)? layout.logo : {url: ''},
                    bgColor: (layout.bgColorH)? layout.bgColorH : 'blue',
                    txtColor: (layout.txtColorH)? layout.txtColorH : 'white'
                },
                footer: {
                    copyright: layout.copyright,
                    bgColor: (layout.bgColorF)? layout.bgColorF : 'blue',
                    txtColor: (layout.txtColorF)? layout.txtColorF : 'white'
                },
                bread: layout.bread
            }
            var listSections = []
            var listsSections = []
            var num = []
            menus.forEach(y => {
                listSections = sections.filter(z => {
                    if (z.menu) {
                        if (z.menu.id == y.id) {
                            return true
                        }
                    }
                })
                num = homeSections.filter(v => {
                    if (v.menu && v.num) {
                        if (v.menu.id == y.id) {
                            return true
                        }
                    }
                })
                if (num != '') {
                    listSections = listSections.filter((w,i) => i < num[0].num)
                }
                listsSections = {...listsSections, [y.id]: listSections}
            })
            routes = [
                {
                    route: '/',
                    payload: {
                        homeSections,
                        listsSections,
                        menus: {header, footer},
                        layout
                    }
                }
            ]
            
            menus.forEach(p => {
                routes = [
                    ...routes,
                    {
                        route: `/${p.id}`,
                        payload: {
                            menu: p,
                            sections: listsSections[p.id],
                            menus: {header, footer},
                            layout
                        }
                    }
                ]
            })
            
            sections.forEach(q => {
                if (q.menu) {
                    routes = [
                        ...routes,
                        {
                            route: `/${q.menu.id}/${q.id}`,
                            payload: {
                                section: q,
                                menus: {header, footer},
                                layout
                            }
                        }
                    ]
                }
            })
            
            return routes
        }
    }
}
