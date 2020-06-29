<template>
    <v-main :style="style">
        <Section :section="section" :layout="layout" />
    </v-main>
</template>

<script>
import Section from '~/components/section.vue';

export default {
    components: {
        Section
    },
    async asyncData ({ payload, app, params }) {
        if(payload) {
            return {
                section: payload.section,
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
            var section = await app.$axios.$get(`https://testhp.microcms.io/api/v1/section/${params.id}`, {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            menus = menus.contents
            var header = menus.filter(x => x.header)
            var footer = menus.filter(x => x.footer)
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
                    section,
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
            title: this.section.title,
            meta: [
                { hid: 'og:title', property: 'og:title', content: this.section.title },
            ]
        }
    }
}
</script>