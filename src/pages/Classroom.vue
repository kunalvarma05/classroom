<template>
  <v-app id="classroom" toolbar dark>
    <v-navigation-drawer
      persistent
      disable-route-watcher
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

        <stream v-show="tabIsActive('stream')"></stream>
        <slides v-show="tabIsActive('slides')"></slides>
        <whiteboard v-show="tabIsActive('whiteboard')"></whiteboard>
        <doubts v-show="tabIsActive('doubts')"></doubts>


      </v-container>
    </main>
    <v-bottom-nav
      shift
      :value="true"
      :active.sync="activeTab"
      :class="{
        'cyan': tabIsActive('stream'),
        'blue': tabIsActive('slides'),
        'pink': tabIsActive('whiteboard'),
        'blue-grey': tabIsActive('doubts')
      }">
      <v-btn dark value="stream">
        <span>Stream</span>
        <v-icon>videocam</v-icon>
      </v-btn>
      <v-btn dark value="slides">
        <span>Slides</span>
        <v-icon>slideshow</v-icon>
      </v-btn>
      <v-btn dark value="whiteboard">
        <span>Whiteboard</span>
        <v-icon>panorama</v-icon>
      </v-btn>
      <v-btn dark value="doubts">
        <span>Doubts</span>
        <v-icon>insert_comment</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
  import Stream from '../components/classroom/Stream'
  import Slides from '../components/classroom/Slides'
  import Doubts from '../components/classroom/Doubts'
  import Whiteboard from '../components/classroom/Whiteboard'

  export default {
    name: 'classroom',
    data() {
      return {
        drawer: false,
        activeTab: "stream"
      }
    },
    computed: {
      slug() {
        return this.$route.params.slug;
      },
    },
    methods: {
      tabIsActive(tab) {
        return this.activeTab === tab;
      }
    },
    components: {
      Stream,
      Slides,
      Doubts,
      Whiteboard
    }
  }
</script>

<style lang="stylus">
  #classroom
    .toolbar
      .logo
        width: 120px;
    .container
      min-height: calc(100vh - 150px)
</style>
