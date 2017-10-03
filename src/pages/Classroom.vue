<template>
  <v-app id="classroom" toolbar dark>
    <v-navigation-drawer
      persistent
      v-model="drawer"
      light
      absolute
      dark
    >
      <v-list>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title">
        <img src="../assets/images/logo.svg" alt="Classroom" class="logo">
      </span>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
    <v-bottom-nav
      shift
      :value="true"
      :active.sync="activeTab"
      :class="{
        'cyan': activeTab === 0,
        'blue': activeTab === 1,
        'pink': activeTab === 2,
        'blue-grey': activeTab === 3
      }">
      <v-btn dark value="classroom-stream">
        <span>Stream</span>
        <v-icon>videocam</v-icon>
      </v-btn>
      <v-btn dark value="classroom-slides">
        <span>Slides</span>
        <v-icon>slideshow</v-icon>
      </v-btn>
      <v-btn dark value="classroom-whiteboard">
        <span>Whiteboard</span>
        <v-icon>panorama</v-icon>
      </v-btn>
      <v-btn dark value="classroom-doubts">
        <span>Doubts</span>
        <v-icon>insert_comment</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
  export default {
    name: 'classroom',
    data() {
      return {
        drawer: false,
        activeTab: "classroom-stream"
      }
    },
    computed: {
      slug() {
        return this.$route.params.slug;
      }
    },
    "watch": {
      activeTab: 'switchTab'
    },
    methods: {
      switchTab(routeName) {
        this.$router.push({name: routeName, params: {slug: this.slug}});
      }
    }
  }
</script>

<style lang="stylus">
  #classroom
    .toolbar
      .logo
        width: 120px;
</style>
