import colors from 'vuetify/es5/util/colors'
const axios = require("axios"); 

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
    title: '奥三河OUTDOOR',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
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
      '~/plugins/moment-filter.js',
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
    ['@nuxtjs/moment', ['ja']],
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
            var layout = await axios.get(`https://testhp.microcms.io/api/v1/layout?depth=3`, {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            var menus = await axios.get(`https://testhp.microcms.io/api/v1/menu?depth=3`, {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            var sections = await axios.get(`https://testhp.microcms.io/api/v1/section?depth=3`, {
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
                        if (z.menu.params == y.params) {
                            return true
                        }
                    }
                })
                num = homeSections.filter(v => {
                    if (v.menu && v.num) {
                        if (v.menu.params == y.params) {
                            return true
                        }
                    }
                })
                if (num != '') {
                    listSections = listSections.filter((w,i) => i < num[0].num)
                }
                listsSections = {...listsSections, [y.params]: listSections}
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
                        route: `/${p.params}`,
                        payload: {
                            menu: p,
                            sections: listsSections[p.params],
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
                            route: `/${q.menu.params}/${q.id}`,
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
