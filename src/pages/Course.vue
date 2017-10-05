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
                <v-layout fill-height>
                  <v-flex flexbox align-center justify-space-around class="is-flexbox">
                    <v-flex justify-center class="is-flexbox">
                      <v-avatar class="white" size="100px">
                      <span class="blue--text headline">
                        {{courseAlias}}
                      </span>
                      </v-avatar>
                    </v-flex>
                    <v-flex justify-center class="is-flexbox">
                      <h3 class="headline">
                        {{course.name}}
                      </h3>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-media>

            <div class="card--inside">

              <div>
                <v-tabs v-model="selectedTab" centered class="course-tabs">
                  <v-tabs-bar class="white">
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

                    <v-tabs-slider class="primary"></v-tabs-slider>
                  </v-tabs-bar>
                </v-tabs>
              </div>

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
      this.fetchCourse();
    },
    data() {
      return {
        course: false,
        loading: false
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
      }
    },
    methods: {
      fetchCourse() {
        this.loading = true;
        courseService.find(this.slug).then((course) => {
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
      }
    }
  }
</script>

<style lang="stylus">
  .course-page
    padding: 20px;
    .card__actions
      padding: 16px;

  .course-tabs
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
</style>

