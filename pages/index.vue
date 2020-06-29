<template>
    <v-main>
        <template v-for="(homeSection, i) in homeSections">
            <template v-if="homeSection.fieldId=='section'">
                <Section :section="homeSection.section" :layout="layout" />
            </template>
            <template v-else-if="homeSection.fieldId=='menu'">
                <Menu :menuBg="homeSection" :menu="homeSection.menu" :layout="layout" :sections="listsSections[homeSection.menu.params]" />
            </template>
        </template>
    </v-main>
</template>

<script>
import Section from '~/components/section.vue';
import Menu from '~/components/menu.vue';

export default {
    components: {
        Section,
        Menu
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
            var layout = await app.$axios.$get(`https://testhp.microcms.io/api/v1/layout?depth=3`, {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            var menus = await app.$axios.$get(`https://testhp.microcms.io/api/v1/menu?depth=3`, {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            var sections = await app.$axios.$get(`https://testhp.microcms.io/api/v1/section?depth=3`, {
                headers: { 'X-API-KEY': 'b42adfea-8d6f-472e-bb31-ca81a4e8f0a5' }
            })
            layout = layout.contents[0]
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
            menus = menus.contents
            var header = menus.filter(x => x.header)
            var footer = menus.filter(x => x.footer)
            var listSections = []
            var listsSections = []
            var num = []
            menus.forEach(y => {
                listSections = sections.contents.filter(z => {
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
            title: 'HOME',
        }
    }
}
</script>