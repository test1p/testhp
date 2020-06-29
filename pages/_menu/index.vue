<template>
    <v-main :style="style">
        <Menu :menuBg="menu" :menu="menu" :layout="layout" :sections="sections" />
    </v-main>
</template>

<script>
import Menu from '~/components/menu.vue';

export default {
    components: {
        Menu
    },
    async asyncData ({ payload, app, params }) {
        if(payload) {
            return {
                menu : payload.menu,
                sections: payload.sections,
                menus: payload.menus,
                layout: payload.layout
            }
        }
        else if(process.env.NODE_ENV !== 'production') {
            var layout = await app.$axios.$get(`https://testhp.microcms.io/api/v1/layout?depth=3`, {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            var menus = await app.$axios.$get(`https://testhp.microcms.io/api/v1/menu?depth=3`, {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            menus = menus.contents
            var header = menus.filter(x => x.header)
            var footer = menus.filter(x => x.footer)
            var menu = menus.filter(x =>x.params == params.menu)
            var sections = await app.$axios.$get(`https://testhp.microcms.io/api/v1/section?filters=menu[equals]${menu[0].id}`, {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            layout = layout.contents[0]
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
            return {
                    menu: menu[0],
                    sections: sections.contents,
                    menus: {header, footer},
                    layout
            }
        }
    },
    data() {
        return {
        }
    },
    mounted () {
        this.updateData()
    },
    methods: {
        updateData () {
            this.$nuxt.$emit('updateData', {menus: this.menus, layout: this.layout})
        }
    },
    computed: {
        style () {
            if (this.$vuetify.breakpoint.mdAndUp) {
                return 'margin-top:64px;'
            }
            else {
                return 'margin-top:56px;'
            }
        }
    },
    head () {
        return {
            title: this.menu.title,
            meta: [
                { hid: 'og:title', property: 'og:title', content: this.menu.title },
            ]
        }
    }
}
</script>