<template>
    <v-row class="justify-center align-center">
        <v-col
            cols="12"
            sm="10"
            class="py-0"
        >
            <v-img
                :src="(menuBg.titleBgImg)? menuBg.titleBgImg.url : undefined"
                :height ="(menuBg.titleBgHeight)? menuBg.titleBgHeight : undefined"
            >
                <v-sheet
                    :color="(menuBg.titleBgColor)? menuBg.titleBgColor : 'transparent'"
                    height="100%"
                    tile
                >
                    <v-row no-gutters class="justify-center align-center" style="height:100%;">
                        <v-col
                            cols="12"
                            class="px-4 py-2"
                            v-html="menu.contents"
                        ></v-col>
                    </v-row>
                </v-sheet>
            </v-img>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: ['menuBg', 'menu']
}
</script>