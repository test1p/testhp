<template>
    <v-app>
        <v-app-bar
            fixed
            :color="(!scroll && $route.path=='/')? 'transparent' : layout.header.bgColor"
            :flat="!scroll && $route.path=='/'"
        >
            <v-toolbar-items>
                <v-btn
                    text
                    class="px-0"
                    aria-label="to-top"
                    @click="$router.push('/')"
                >
                    <v-img
                        v-if="layout.header.logo.url != ''"
                        :src="`${layout.header.logo.url}?fit=clip&h=56`"
                        alt=""
                    ></v-img>
                  
                    <v-toolbar-title
                        v-if="layout.header.title != ''"
                        :style="`color: ${layout.header.txtColor};`"
                    >
                        {{ layout.header.title }}
                    </v-toolbar-title>
                </v-btn>
            </v-toolbar-items>
          
            <v-spacer></v-spacer>
            
            <v-menu
                v-if="$vuetify.breakpoint.xs"
                right
                nudge-right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :color="layout.header.txtColor"
                  aria-label="menu"
                  v-bind="attrs"
                  v-on="on"
                  icon
                >
                    <v-icon large>mdi-menu</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(menu,i) in menus.header"
                    :key="i"
                    :to="`/${menu.id}`"
                    nuxt
                >
                  <v-list-item-title>{{ menu.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            
            <v-toolbar-items v-else>
                <template v-for="(menu,i) in menus.header">
                <v-btn
                    v-if="menu.id != 'contact'"
                    :to="`/${menu.id}`"
                    color="transparent"
                    :small="$vuetify.breakpoint.sm"
                    :style="`color: ${layout.header.txtColor};`"
                    depressed
                    nuxt
                >
                    <span>{{ menu.title }}</span>
                </v-btn>
                <div v-else class="d-flex">
                    <v-btn
                        :to="`/${menu.id}`"
                        :color="color.contact.btn"
                        :small="$vuetify.breakpoint.sm"
                        class="align-self-center"
                        rounded
                        outlined
                        nuxt
                    >
                        {{ menu.title }}
                    </v-btn>
                </div>
                </template>
            </v-toolbar-items>
            
        </v-app-bar>
        
        <nuxt v-scroll="onScroll" />
        
        <v-footer padless :color="layout.footer.bgColor">
            <v-sheet tile width="100%" color="transparent">
                <v-row no-gutters class="py-4 justify-center">
                    <v-col cols="auto"
                        v-for="menu in menus.footer"
                        :key="menu.id"
                    >
                        <v-btn
                            
                            :to="`/${menu.id}`"
                            :color="layout.footer.txtColor"
                            text
                            rounded
                            nuxt
                        >
                            {{ menu.title }}
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="mx-0 justify-center">
                    <v-col
                        cols="auto"
                        class="caption"
                        :style="`color: ${layout.footer.txtColor};`"
                    >
                        {{ layout.footer.copyright }}
                    </v-col>
                </v-row>
            </v-sheet>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    data () {
        return {
            scroll: false,
            color: {
                contact: {
                    btn: process.env.colorContactBtn
                }
            },
            menus: [],
            layout: {
                header: {
                    title: '',
                    logo: {url: ''},
                    bgColor: '',
                    txtColor: ''
                },
                footer: {
                    copyright: '',
                    bgColor: '',
                    txtColor: ''
                }
            }
        }
    },
    created () {
        this.$nuxt.$on('updateData', data =>{
            this.menus = data.menus
            this.layout = data.layout
        })
    },
    methods: {
        onScroll (e) {
            var top = window.pageYOffset ||e.target.scrollTop || 0
            if(top >= window.innerHeight) {
                this.scroll = true
            }
            else {
                this.scroll = false
            }
        }
    },
}
</script>