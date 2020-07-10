<template>
    <v-main :style="style">
        <Menu :menu="menu" />
        <template v-if="menu.list != null">
            <List :list="menu.list" :sections="sections" />
        </template>
        <template v-else>
            <Section
                v-for="section in sections"
                :key="section.id"
                :section="section"
            />
        </template>
    </v-main>
</template>

<script>
import Menu from '~/components/menu.vue';
import List from '~/components/list.vue';
import Section from '~/components/section.vue';

export default {
    components: {
        Menu,
        List,
        Section
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
            var serviceId = process.env.serviceId
            var apiKey = process.env.apiKey
            var layout = await app.$axios.$get(`https://${serviceId}.microcms.io/api/v1/layout/layout`, {
                headers: { 'X-API-KEY': apiKey }
            })
            var menus = await app.$axios.$get(`https://${serviceId}.microcms.io/api/v1/menu`, {
                headers: { 'X-API-KEY': apiKey }
            })
            menus = menus.contents
            var header = menus.filter(x => x.header)
            var footer = menus.filter(x => x.footer)
            var menu = menus.filter(x =>x.id == params.menu)
            var sections = await app.$axios.$get(`https://${serviceId}.microcms.io/api/v1/section?filters=menu[equals]${params.menu}`, {
                headers: { 'X-API-KEY': apiKey }
            })
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
                }
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