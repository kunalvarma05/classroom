<template>
  <div class="course-page">
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

          <div class="card__front" v-if="!editing">
            <v-card-actions>
              <v-btn @click="editCourse">
                <v-icon left>edit</v-icon>
                Edit
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn primary>
                <v-icon left>add</v-icon>
                Create new Session
              </v-btn>
            </v-card-actions>
            <v-card-text>
              {{course.description}}
            </v-card-text>
          </div>
          <v-slide-y-transition>
            <div class="card__back container fluid" v-if="editing">
              <v-form v-model="valid">
                <v-text-field
                  label="Name"
                  v-model="course.name"
                  :counter="255"
                  required
                ></v-text-field>
                <v-text-field
                  label="description"
                  v-model="course.description"
                  :counter="700"
                  multiLine
                  :rows="8"
                  required
                ></v-text-field>

                <v-btn :loading="updating" primary @click="updateCourse">Update</v-btn>
              </v-form>
            </div>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import courseService from '../store/Course';
  import VCardMedia from "vuetify/src/components/VCard/VCardMedia";
  import Utils from "../lib/Utils";


  export default {
    components: {VCardMedia},
    name: 'course',
    created() {
      this.fetchCourse();
    },
    data() {
      return {
        course: false,
        loading: false,
        editing: false,
        updating: false,
        valid: false
      }
    },
    computed: {
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
      updateCourse() {
        this.updating = true;
        courseService.update(this.course.id, this.course).then((course) => {
          this.course = course;
          this.updating = false;
          this.editing = false;
        })
      }
    }
  }
</script>

<style lang="stylus">
  .course-page
    padding: 20px;
    .card__actions
      padding: 16px;
</style>

