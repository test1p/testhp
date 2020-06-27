<template>
    <v-main>
        <template v-for="(homeSection, i) in homeSections">
            <template v-if="homeSection.fieldId=='section'">
                <Section :section="homeSection" />
            </template>
            <template v-else-if="homeSection.fieldId=='menu'">
                <List :menu="homeSection.menu" :sections="listsSections[homeSection.menu.params]" />
            </template>
        </template>
    </v-main>
</template>

<script>
import Section from '~/components/section.vue';
import List from '~/components/list.vue';

export default {
    components: {
        Section,
        List
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
                }
            }
            menus = menus.contents
            var listSections = []
            var listsSections = []
            menus.forEach(y => {
                listSections = sections.contents.filter(z => {
                    if (z.menu) {
                        if (z.menu.params == y.params) {
                            return true
                        }
                        else {
                            return false
                        }
                    }
                    else {
                        return false
                    }
                })
                listsSections = {...listsSections, [y.params]: listSections}
            })
            return {
                    homeSections: homeSections,
                    listsSections: listsSections,
                    menus: menus,
                    layout: layout
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
    }
}
</script>