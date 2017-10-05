<template>
  <div class="course-page">
    <div class="course-overview-page">
      <v-layout row fill-height align-center fill-width justify-center class="is-flexbox"
                :class="{'loader-box': loading}">
        <v-progress-circular v-if="loading" indeterminate :size="50" class="primary--text"></v-progress-circular>

        <v-flex md8 sm10 xs12 fill-height v-if="!loading && course">
          <v-card class="course-card">
            <v-card-media
              class="white--text course-card-media primary"
              height="200px"
              :src="coverImage"
            >
              <v-container fill-height>
                <v-layout fill-height row align-center justify-center>
                  <v-flex align-center justify-center lg2 md2 sm12 xs12 class="is-flexbox">
                    <v-avatar class="white" size="100px">
                      <span class="blue--text headline">
                        {{courseAlias}}
                      </span>
                    </v-avatar>
                  </v-flex>
                  <v-flex align-center justify-center lg6 md6 sm12 xs12 class="is-flexbox">
                    <div>
                      <h3 class="headline">
                        {{course.name}}
                      </h3>
                      <v-avatar class="white" size="30px">
                        <img :src="course.tutor.photoUrl" :alt="course.tutor.name">
                      </v-avatar>
                      <span class="pl-2">
                        {{course.tutor.name}}
                      </span>
                    </div>
                  </v-flex>
                  <v-flex v-if="userIsStudent && !fetchingEnrollmentStatus" align-center justify-end lg2 md2 sm12 xs12
                          class="is-flexbox">
                    <v-btn v-if="!isEnrolled" primary @click="enroll" block>
                      <v-progress-circular indeterminate v-if='signingUp'></v-progress-circular>
                      <span v-if='!signingUp'>
                          <v-icon left>add</v-icon>
                          Enroll
                        </span>
                    </v-btn>

                    <v-btn v-if="isEnrolled" @click="" block>
                      <v-progress-circular indeterminate v-if='false'></v-progress-circular>
                      <span v-if='!signingUp'>
                          <v-icon left>done</v-icon>
                          Enrolled
                        </span>
                    </v-btn>

                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-media>

            <div class="course-tabs">
              <v-tabs dark v-model="selectedTab" centered>
                <v-tabs-bar class="primary darken-3">
                  <v-tabs-item
                    href="#show-course"
                    ripple
                  >
                    Overview
                  </v-tabs-item>
                  <v-tabs-item
                    href="#course-sessions"
                    ripple
                  >
                    Sessions
                  </v-tabs-item>

                  <v-tabs-item
                    href="#course-students"
                    ripple
                  >
                    Students
                  </v-tabs-item>


                  <v-tabs-slider class="white"></v-tabs-slider>
                </v-tabs-bar>
              </v-tabs>
            </div>

            <div class="card--inside">
              <router-view></router-view>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
  import courseService from '@/store/Course';
  import VCardMedia from "vuetify/src/components/VCard/VCardMedia";
  import Utils from "@/lib/Utils";
  import CourseOverview from "./course/Overview.vue";


  export default {
    components: {
      CourseOverview,
      VCardMedia
    },
    name: 'course',
    created() {
      this.fetchCourse().then((course) => {
        if (this.userIsStudent) {
          this.checkEnrollmentStatus();
        }
      });
    },
    data() {
      return {
        course: false,
        loading: false,
        fetchingEnrollmentStatus: false,
        isEnrolled: false,
        signingUp: false
      }
    },
    computed: {
      selectedTab: {
        get() {
          return this.$route.name;
        },
        set(tab) {
          this.$router.push({name: tab, params: {slug: this.course.id}});
        }
      },
      slug() {
        return this.$route.params.slug;
      },
      courseAlias() {
        if (this.course) {
          if (this.course.alias) {
            return this.course.alias;
          }

          return Utils.abbreviate(this.course.name);
        }

        return ".."
      },
      coverImage() {
        if (this.course.image) {
          return this.course.image;
        }

        return "https://images.unsplash.com/photo-1497733942558-e74c87ef89db?dpr=1&auto=compress,format&fit=crop&w=800";
      },
      userIsStudent() {
        return this.$currentUser.role === "student";
      }
    },
    methods: {
      fetchCourse() {
        this.loading = true;
        return courseService.find(this.slug, ['tutor', 'students']).then((course) => {
          this.course = course;
          this.loading = false;
        })
      },
      editCourse() {
        this.editing = true;
      },
      validateAndUpdate() {
        this.updating = true;

        this.$validator.validateAll().then((valid) => {
          if (valid) {
            this.updateCourse();
          } else {
            this.updating = false;
          }
        });
      },
      updateCourse() {
        courseService.update(this.course.id, this.course).then((course) => {
          this.course = course;
          this.editing = false;
          this.updating = false;
        });
      },
      enroll() {
        this.signingUp = true;

        courseService.enroll(this.course.id, this.$currentUser.id).then(() => {
          this.signingUp = false;
          this.isEnrolled = true;
          this.course.students.push(this.$currentUser);
        });
      },
      checkEnrollmentStatus() {
        this.fetchingEnrollmentStatus = true;
        courseService.studentIsEnrolled(this.course.id, this.$currentUser.id).then((enrolled) => {
          this.fetchingEnrollmentStatus = false;
          this.isEnrolled = enrolled;
        });
      }
    }
  }
</script>

<style lang="stylus">
  .course-page
    padding: 20px;
    .card__actions
      padding: 16px;

    .course-card-media
      .card__media__content
        background: rgba(0, 0, 0, 0.4);

    .course-tabs
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);

    .card--inside
      padding: 15px;


</style>
