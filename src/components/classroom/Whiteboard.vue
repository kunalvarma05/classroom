<template>
  <div class="whiteboard-page section-page"
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

  #aww-toolbar-window
    display: none;

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
