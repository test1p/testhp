<template>
    <v-row class="justify-center align-center">
        <v-col
            v-if="menu.card"
            cols="12"
            sm="10"
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
                        <v-card-title>{{ section.title }}</v-card-title>
                        <v-card-subtitle v-if="menu.date">
                            {{ (section.date)? section.date : section.updatedAt }}
                        </v-card-subtitle>
                        
                        <v-divider v-if="menu.overview && section.overview"></v-divider>
                        
                        <v-card-text
                            v-if="menu.overview && section.overview"
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
                        <v-list-item-subtitle v-if="menu.date">
                            {{ (section.date)? section.date : section.updatedAt }}
                        </v-list-item-subtitle>
                        
                        <v-list-item-title class="font-weight-bold">{{ section.title }}</v-list-item-title>
                        
                        <v-list-item-subtitle v-if="menu.overview && section.overview">{{ section.overview }}</v-list-item-subtitle>
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
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: ['menu', 'sections']
}
</script>