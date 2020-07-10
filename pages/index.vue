<template>
    <v-main>
        <template v-for="(homeSection, i) in homeSections">
            <template v-if="homeSection.fieldId=='menu'">
                <Menu :menu="homeSection.menu" />
                <template v-if="homeSection.menu.list != null">
                    <List :list="homeSection.menu.list" :sections="listsSections[homeSection.menu.id]" />
                </template>
                <template v-else>
                    <Section
                        v-for="section in listsSections[homeSection.menu.id]"
                        :key="section.id"
                        :section="section"
                    />
                </template>
            </template>
            <template v-else>
                <Section :section="homeSection.section" />
            </template>
        </template>
    </v-main>
</template>

<script>
import Menu from '~/components/menu.vue';
import Section from '~/components/section.vue';

export default {
    components: {
        Menu,
        Section
    },
    async asyncData ({ payload, app }) {
        if(payload) {
            return {
                homeSections: payload.homeSections,
                listsSections: payload.listsSections,
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
            var sections = await app.$axios.$get(`https://${serviceId}.microcms.io/api/v1/section`, {
                headers: { 'X-API-KEY': apiKey }
            })
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
                }
            }
            menus = menus.contents
            var header = menus.filter(x => x.header)
            var footer = menus.filter(x => x.footer)
            var listSections = []
            var listsSections = []
            menus.forEach(y => {
                listSections = sections.contents.filter(z => {
                    if (z.menu) {
                        if (z.menu.id == y.id) {
                            return true
                        }
                    }
                })
                if (y.list != null) {
                    if (y.list.num) {
                    listSections = listSections.filter((w,i) => i < y.list.num)
                    }
                }
                listsSections = {...listsSections, [y.id]: listSections}
            })
            return {
                    homeSections,
                    listsSections,
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
    head () {
        return {
            title: process.env.topTitle,
            titleTemplate: (process.env.topTemplate != '')? process.env.topTemplate : `${process.env.siteName} - %s`
        }
    }
}
</script>