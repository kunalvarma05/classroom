<template>
  <div class="slides-page section-page">
    <div v-if="!started">
      <h1>Slides</h1>
      <v-btn grey @click="startShow">
        <span v-if="userIsTutor">Start</span>
        <span v-if="!userIsTutor">Watch</span>
      </v-btn>
    </div>
    <div v-if="started" class="section-page">
      <iframe
        class="slide-show"
        :src="link"
        frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true"
        webkitallowfullscreen="true"></iframe>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'slides',
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
      link() {
        if (this.$parent.session.link) {
          let id = this.$parent.session.link;
          return 'https://docs.google.com/presentation/d/e/' + id + '/embed?start=false&loop=false&delayms=60000'
        }

        return false;
      }
    },
    methods: {
      startShow() {
        this.started = true;
      }
    }
  }
</script>
