<template>
  <div id="classroom">
    <stream v-show="tabIsActive('stream')" :course="course" :tutor="tutor"></stream>
    <slides v-show="tabIsActive('slides')" :course="course" :tutor="tutor"></slides>
    <whiteboard v-show="tabIsActive('whiteboard')" :course="course" :tutor="tutor"></whiteboard>
    <doubts v-show="tabIsActive('doubts')" :course="course" :tutor="tutor"></doubts>

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
  import courseService from '../store/Course';
  import sessionService from '../store/Session';
  import Stream from '../components/classroom/Stream'
  import Slides from '../components/classroom/Slides'
  import Doubts from '../components/classroom/Doubts'
  import Whiteboard from '../components/classroom/Whiteboard'

  export default {
    name: 'classroom',
    data() {
      return {
        drawer: false,
        activeTab: "stream",
        sessionEnded: false,
        session: false,
        loading: false
      }
    },
    created() {
      this.fetchSession();
    },
    computed: {
      userIsTutor() {
        return this.$currentUser.id === this.tutorId;
      },
      slug() {
        return this.$route.params.slug;
      },
      course() {
        if (this.session) {
          return this.session.course;
        }

        return false;
      },
      courseId() {
        if (this.course) {
          return this.course.id;
        }

        return false;
      },
      tutor() {
        if (this.course && this.course.tutor) {
          return this.course.tutor;
        }

        return false;
      },
      tutorId() {
        if (this.tutor) {
          return this.tutor.id;
        }

        return false;
      }
    },
    methods: {
      tabIsActive(tab) {
        return this.activeTab === tab;
      },
      fetchSession() {
        this.loading = true;

        sessionService.find(this.slug, ['course']).then((session) => {
          this.session = session;

          courseService.find(this.session.course.id, ['tutor', 'students']).then((course) => {
            this.session.course = course;
            this.loading = false;
          });

        });
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
