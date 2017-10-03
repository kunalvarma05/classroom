<template>
  <div id="classroom">
    <stream v-show="tabIsActive('stream')"></stream>
    <slides v-show="tabIsActive('slides')"></slides>
    <whiteboard v-show="tabIsActive('whiteboard')"></whiteboard>
    <doubts v-show="tabIsActive('doubts')"></doubts>

    <v-bottom-nav
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
  </div>
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
    .container
      min-height: calc(100vh - 170px)

    .bottom-nav
      height: 80px;
      left: 0;
      .btn
        .btn__content
          font-size: 16px;

          span
            margin-top: 5px;
</style>
