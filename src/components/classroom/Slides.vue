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
      session() {
        return this.$parent.session ? this.$parent.session : false;
      },
      link() {
        if (this.$parent.session.documentUrl) {
          let id = this.$parent.session.documentUrl;


		// url VARIABLE IS CONSTANT.
      		var url="http://docs.google.com/gview?url=";
      		url+=escape(id);
      		url+="&embedded=true";
          return url;
          // return 'https://docs.google.com/presentation/d/e/' + id + '/embed?start=false&loop=false&delayms=60000'

        // if (this.session.link) {
        //   return this.session.link.replace(/(\/pub)/g, ($1) => {
        //     return '/embed';
        //   });
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
