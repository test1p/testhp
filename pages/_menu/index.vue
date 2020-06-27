<template>
    <v-main :style="style">
        <template v-if="section">
            <Section :section="section" />
        </template>
        <template v-else>
            <v-container>
                <v-row class="justify-center align-center">
                    <v-col
                        cols="12"
                        sm="10"
                        md="8"
                        v-html="menu.contents"
                    >
                    </v-col>
                    <v-col
                        v-if="menu.card"
                        cols="12"
                        sm="10"
                        md="8"
                    >
                        <v-row>
                            <v-col
                                v-for="section in sections"
                                :key="section.id"
                                cols="12"
                                sm="6"
                                lg="4"
                                class="align-self-stretch"
                            >
                                <v-card
                                    :to="(!section.contents && section.item == '') ? undefined : `/${section.menu.params}/${section.id}/`"
                                    height="100%"
                                    nuxt
                                >
                                    <v-sheet tile>
                                        <v-card-title>{{ section.title }}</v-card-title>
                                        <v-card-subtitle>
                                            {{ (section.date)? section.date : section.updatedAt | format-date }}
                                        </v-card-subtitle>
                                    </v-sheet>
                                    
                                    <v-divider></v-divider>
                                    
                                    <v-card-text
                                        v-if="section.overview"
                                    >
                                        {{ section.overview }}
                                    </v-card-text>
                                    
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-chip
                                            v-if="section.category"
                                            :small="!$vuetify.breakpoint.xs"
                                            :x-small="$vuetify.breakpoint.xs":color="(section.category.bgColor)? section.category.bgColor : 'transparent'"
                                            :class="(section.category.txtColor)? `${section.category.txtColor}--text` : ''"
                                            class="mb-2 mr-2"
                                        >
                                            {{ section.category.title }}
                                        </v-chip>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col
                        v-else
                        cols="12"
                        sm="10"
                        md="8"
                    >
                        <v-divider></v-divider>
                        <template v-for="section in sections">
                            <v-list-item
                                :key="section.id"
                                three-line
                                @click="$router.push(`/${section.menu.params}/${section.id}/`)"
                                :disabled="!section.contents && section.item == ''"
                            >
                                <v-list-item-content>
                                    <v-list-item-subtitle>
                                        {{ (section.date)? section.date : section.updatedAt | format-date }}
                                    </v-list-item-subtitle>
                                    
                                    <v-list-item-title class="font-weight-bold">{{ section.title }}</v-list-item-title>
                                    
                                    <v-list-item-subtitle>{{ section.overview}}</v-list-item-subtitle>
                                </v-list-item-content>
                                
                                <v-list-item-action class="align-self-center">
                                    <v-chip
                                        v-if="section.category"
                                        :small="!$vuetify.breakpoint.xs"
                                        :x-small="$vuetify.breakpoint.xs"
                                        :color="(section.category.bgColor)? section.category.bgColor : 'transparent'"
                                        :class="(section.category.txtColor)? `${section.category.txtColor}--text` : ''"
                                    >
                                        {{ section.category.title }}
                                    </v-chip>
                                </v-list-item-action>
                            </v-list-item>
                            <v-divider></v-divider>
                        </template>
                    </v-col>
                </v-row>
            </v-container>
        </template>
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
                section : payload.section,
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
            var menu = menus.contents.filter(x =>x.params == params.menu)
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
                }
            }
            sections = sections.contents
            var section = null
            if (sections.length == 1) {
                section = {section : sections[0]}
                sections = null
            }
            return {
                    section: section,
                    menu: menu[0],
                    sections: sections,
                    menus: menus.contents,
                    layout: layout
            }
        }
    },
    data() {
        return {
            name: '',
            email: '',
            content: '' ,
            botField: ''
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
    }
}
</script>