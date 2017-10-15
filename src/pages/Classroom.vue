<template>
  <div id="classroom">
    <v-container fluid fill-height v-if="!isReady">
      <v-layout row fill-height align-center fill-width justify-center class="is-flexbox">
        <v-progress-circular indeterminate :size="50" class="primary--text"></v-progress-circular>
      </v-layout>
    </v-container>

    <v-container fill-height v-if="isReady" class="pa-0">
      <v-layout v-if="isScheduled">
        <div>
          <v-avatar class="white" size="30px">
            <img :src="photoUrl" :alt="tutorName">
          </v-avatar>
          <span class="pl-2">
            {{tutorName}}
          </span>
          <h2>{{session.name}}</h2>
          <div>
            <h5 v-if="!userIsTutor">Waiting for the tutor to start the session.</h5>
            <v-btn v-if="userIsTutor" primary @click="startSession">Start Session</v-btn>
          </div>
        </div>
      </v-layout>

      <v-layout v-if="hasEnded">
        <v-avatar class="white" size="30px">
          <img :src="course.tutor.photoUrl" :alt="course.tutor.name">
        </v-avatar>
        <span class="pl-2">
            {{course.tutor.name}}
          </span>
        <h2>{{session.name}}</h2>
        <h5>This session has ended.</h5>
      </v-layout>

      <v-layout v-if="hasStarted">
        <stream v-show="tabIsActive('stream')" :course="course" :tutor="tutor"></stream>
        <slides v-if="hasSlides" v-show="tabIsActive('slides')" :course="course" :tutor="tutor"></slides>
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
          <v-btn dark value="slides" v-if="hasSlides">
            <span>Slides</span>
            <v-icon>slideshow</v-icon>
          </v-btn>
          <v-btn dark value="whiteboard">
            <span>Whiteboard</span>
            <v-icon>panorama</v-icon>
          </v-btn>
          <v-btn dark value="doubts">
            <span>Doubts</span>
            <v-icon>panorama</v-icon>
          </v-btn>
        </v-bottom-nav>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import courseService from '../store/Course';
  import sessionService from '../store/Session';
  import Stream from '../components/classroom/Stream'
  import Slides from '../components/classroom/Slides'
  import Doubts from '../components/classroom/Doubts'
  import FireStore from "../lib/FireStore";
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
    watch: {
      session: "subscribeToSession",
      hasStarted: "hideUI"
    },
    computed: {
      isReady() {
        return this.session && this.course && this.tutor;
      },
      hasSlides() {
        return this.session.documentUrl ? this.session.documentUrl : false;
      },
      isScheduled() {
        return this.session.status === "scheduled";
      },
      hasStarted() {
        return this.session.status === "started";
      },
      hasEnded() {
        return this.session.status === "ended";
      },
      userIsTutor() {
        return this.$currentUser.id === this.tutorId;
      },
      slug() {
        return this.$route.params.slug;
      },
      photoUrl() {
        if (this.tutor) {
          return this.tutor.photoUrl;
        }

        return "";
      },
      tutorName() {
        if (this.tutor) {
          return this.tutor.name;
        }

        return "";
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
      startSession() {
        this.session.status = "started";
        sessionService.start(this.session.id).then((updatedSession) => {
          //
        })
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
      },
      subscribeToSession() {
        sessionService.doc(this.session.id).onSnapshot((sessionRef) => {
          let session = sessionRef.data();
          this.session.status = session.status;
        });
      },
      hideUI() {
        this.$root.$emit('hide-ui');
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

  .section-page
    display: flex;
    width: 100%;
    align-items: center;
    height: calc(100vh - 170px);

  .slide-show
    height: calc(100vh - 50px);
    width: calc(100vw - 250px);
    margin-top: 1.5rem;
</style>
