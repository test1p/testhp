<template>
    <v-sheet
        :color="(menu.bgColor)? menu.bgColor : color.menu.bg"
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
                :color="(bgImg && menu.bgColor)? menu.bgColor : 'transparent'"
                tile
                height="100%"
            >
                <v-container :class="(bread == 'true' && $route.params.menu)? 'pt-3 pb-10' : 'py-10'" style="height:100%;">
                    <Bread v-if="bread == 'true' && $route.params.menu" :menu="menu" />
                    <v-row :id="menu.id" class="justify-center align-center">
                        <v-col
                            v-if="menu.contents"
                            v-html="menu.contents"
                            cols="12"
                            sm="10"
                        ></v-col>
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
                menu: {bg: process.env.colorMenuBg},
            },
            bread: process.env.bread
        }
    },
    computed: {
        bgImg () {
            if (this.menu.bgImg) {
                var bgImg = this.menu.bgImg.url
                if (this.$vuetify.breakpoint.xs) {
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
    props: ['menu']
}
</script>