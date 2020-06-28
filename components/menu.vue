<template>
    <v-img
        :src="(menuBg.bgImg)? menuBg.bgImg.url : undefined"
    >
        <v-sheet
            :color="(menuBg.bgColor)? menuBg.bgColor : 'transparent'"
            height="100%"
            tile
        >
            <v-container :class="($route.path == '/')? 'py-10' : 'pt-2 pb-16'">
                <Bread v-if="layout.bread && $route.path !='/'" :menu="menu" />
                <Title :menuBg="menuBg" :menu="menu" />
                <template v-if="menu.section">
                    <Section v-for="section in sections" :key="section.id" :section="section" :layout="layout" />
                </template>
                <template v-else>
                    <List :menu="menu" :sections="sections" />
                </template>
            </v-container>
        </v-sheet>
    </v-img>
</template>

<script>
import Title from '~/components/title.vue';
import Bread from '~/components/bread.vue';
import Section from '~/components/section.vue';
import List from '~/components/list.vue';

export default {
    components: {
        Title,
        Bread,
        Section,
        List
    },
    data() {
        return {
        }
    },
    props: ['menuBg', 'menu', 'layout', 'sections']
}
</script>