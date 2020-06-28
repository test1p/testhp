<template>
    <v-row no-gutters class="justify-center align-center">
        <v-col
            cols="12"
            sm="10"
            class="pt-0 pb-1 px-4"
        >
            <v-breadcrumbs
                :items="items"
                class="pa-0"
                divider=">"
            >
                <template v-slot:item="props">
                    <v-breadcrumbs-item>
                        <v-btn
                        :disabled="props.item.disabled"
                        :to="props.item.to"
                        :small="!$vuetify.breakpoint.xs"
                        :x-small="$vuetify.breakpoint.xs"
                        color="grey"
                        class="px-1"
                        :text="!props.item.icon"
                        :rounded="!props.item.icon"
                        :icon="props.item.icon"
                        exact
                        nuxt
                        >
                            <v-icon v-if="props.item.icon">
                                {{ props.item.icon }}
                            </v-icon>
                            <span v-if="props.item.text">
                                {{ props.item.text }}    
                            </span>
                        </v-btn>
                    </v-breadcrumbs-item>
                </template>
            </v-breadcrumbs>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            originItems: [
                {
                    icon: 'mdi-home',
                    disabled: false,
                    to: '/'
                },
                {
                    text: (this.menu)? this.menu.title : this.section.menu.title,
                    disabled: (this.menu)? true : false,
                    to: (this.menu)? `/${this.menu.params}` : `/${this.section.menu.params}`
                }
            ]
        }
    },
    computed: {
        items () {
            var originItems = this.originItems
            if (this.section) {
                originItems = [
                    ...originItems,
                    {
                        text: this.section.title,
                        disabled: true,
                        to: `/${this.section.menu.params}/${this.section.id}`
                    }
                ]
            }
            return originItems
        }
    },
    props: ['menu', 'section']
}
</script>