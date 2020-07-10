<template>
    <v-sheet
        :color="(list.bgColor)? list.bgColor : color.list.bg"
        tile
        width="100%"
        class="d-flex justify-center"
    >
        <v-img
            :src="(bgImg)? bgImg : undefined"
            :style="(bgImg)? 'background: white;' : undefined"
            :max-width="($vuetify.breakpoint.lgAndUp)? '1264px' : '100vw'"
        >
            <v-sheet
                :color="(bgImg && list.bgColor)? list.bgColor : 'transparent'"
                tile
                height="100%"
            >
                <v-container :class="(!$route.params.id)? 'py-10' : 'pt-2 pb-10 px-sm-0'" style="height:100%;">
                    <v-row class="justify-center align-center">
                        <v-col
                            v-if="list.card"
                            cols="12"
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
                                        :to="(!section.contents && section.item == '') ? undefined : `/${section.menu.id}/${section.id}/`"
                                        :color="color.list.bg"
                                        height="100%"
                                        nuxt
                                    >
                                        <v-card-title
                                            :style="`color: ${color.list.title};`"
                                            class="font-weight-bold"
                                        >
                                            {{ section.title }}
                                        </v-card-title>
                                        
                                        <v-card-subtitle
                                            v-if="list.date"
                                            :style="`color: ${color.list.date};`"
                                        >
                                            {{ (section.date)? $dayjs(section.date).format('YYYY年M月D日(ddd)') : $dayjs(section.updatedAt).format('YYYY年M月D日(ddd)') }}
                                        </v-card-subtitle>
                                        
                                        <v-divider v-if="list.overview && section.overview"></v-divider>
                                        
                                        <v-card-text
                                            v-if="list.overview && section.overview"
                                            :style="`color: ${color.list.overview};`"
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
                        >
                            <v-list class="py-0" :color="color.list.bg">
                                <v-divider></v-divider>
                                <template v-for="section in sections">
                                    <v-list-item
                                        :key="section.id"
                                        three-line
                                        @click="$router.push(`/${section.menu.id}/${section.id}/`)"
                                        :disabled="!section.contents && section.item == ''"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-subtitle
                                                v-if="list.date"
                                                :style="`color: ${color.list.date};`"
                                            >
                                                {{ (section.date)? $dayjs(section.date).format('YYYY年M月D日(ddd)') : $dayjs(section.updatedAt).format('YYYY年M月D日(ddd)') }}
                                            </v-list-item-subtitle>
                                            
                                            <v-list-item-title
                                                :style="`color: ${color.list.title};`"
                                                class="font-weight-bold"
                                            >
                                                {{ section.title }}
                                            </v-list-item-title>
                                            
                                            <v-list-item-subtitle
                                                v-if="list.overview && section.overview"
                                                :style="`color: ${color.list.overview};`"
                                            >
                                                {{ section.overview }}
                                            </v-list-item-subtitle>
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
                            </v-list>
                        </v-col>
                    </v-row>
                </v-container>
            </v-sheet>
        </v-img>
    </v-sheet>
</template>

<script>
export default {
    data() {
        return {
            color: {
                list: {
                    bg: process.env.colorListBg,
                    title: process.env.colorListTitle,
                    date: process.env.colorListDate,
                    overview: process.env.colorListOverview
                }
            }
        }
    },
    computed: {
        bgImg () {
            if (this.list.bgImg) {
                var bgImg = this.section.bgImg.url
                if (this.$vuetify.breakpoint.xs) {
                    if (this.section.bgImgS) {
                        bgImg = this.section.bgImgS.url
                    }
                    return `${bgImg}?auto=compress&fit=clip&w=600`
                }
                else if (this.$vuetify.breakpoint.sm) {
                    return `${bgImg}?auto=compress&fit=clip&w=960`
                }
                else {
                    return `${bgImg}?auto=compress&fit=clip&w=1264`
                }
            }
        }
    },
    props: ['list', 'sections']
}
</script>