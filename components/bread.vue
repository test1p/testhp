<template>
    <v-row no-gutters class="justify-center align-center">
        <v-col
            cols="12"
            sm="10"
            class="pt-0 pb-1 pb-sm-3"
        >
            <v-breadcrumbs
                :items="items"
                class="pa-0"
            ></v-breadcrumbs>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            originItems: [
                {
                    text:'ホーム',
                    disabled: false,
                    href: '/'
                },
                {
                    text: (this.menu)? this.menu.title : this.section.menu.title,
                    disabled: false,
                    href:(this.menu)? `/${this.menu.params}` : `/${this.section.menu.params}`
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
                        href: `/${this.section.menu.params}/${this.section.params}`
                    }
                ]
            }
            return originItems
        }
    },
    props: ['menu', 'section']
}
</script>