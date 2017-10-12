<template>
  <div class="whiteboard-page section-page full-height-page"
       :class="{ 'whiteboard-is-writeable': !started || ($parent.hasStarted && userIsTutor) }">
    <div v-if="!started">
      <h1>Whiteboard</h1>
      <v-btn grey @click="startDrawing">
        <span v-if="userIsTutor">Start</span>
        <span v-if="!userIsTutor">Watch</span>
      </v-btn>
    </div>
    <div v-show="started" style="width: 100%; height: 100%;" id="aww-wrapper"></div>
    <div class="aww--overlay"></div>
  </div>
</template>

<script>

  export default {
    name: 'whiteboard',
    props: ['course', 'tutor'],
    data() {
      return {
        started: false
      }
    },
    computed: {
      currentUserId() {
        return this.$currentUser.id;
      },
      courseId() {
        return this.course.id;
      },
      tutorId() {
        return this.tutor.id;
      },
      userIsTutor() {
        return this.$currentUser.id === this.tutorId;
      },
    },
    methods: {
      startDrawing() {
        this.started = true;

        setTimeout(() => {
          const board = new AwwBoard('#aww-wrapper', {
            apiKey: 'e3fcad98-511f-4473-9752-d54cb28c15b9',
            autoJoin: true,
            boardLink: this.$parent.slug,
            menuOrder: ['colors', 'sizes', 'tools'],
          });
        }, 500);
      }
    }
  }
</script>

<style lang="stylus">
  .full-height-page
    height: calc(100vh - 170px);

  #aww-wrapper
    height: calc(100vh - 0px) !important;
    position: absolute;
    left: 0;
    right: 0;

  #aww-toolbar-window
    display: none;
    top: 70px !important;
    border-radius: 4px !important;
    background: #222 !important;
    max-height: 60% !important;
    margin: 20px !important;

  .aww--overlay
    position: fixed;
    top: 64px;
    left: 80px;
    height: calc(100vh - 170px);
    width: 100%;
    background: transparent;

  .whiteboard-is-writeable
    #aww-toolbar-window
      display: block;
    .aww--overlay
      display: none;
</style>
