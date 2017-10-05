<template>
  <v-container class="courses-page">
    <h4>Courses</h4>
    <v-progress-circular indeterminate v-if='loading'></v-progress-circular>
    <v-container grid-list-md v-if='!loading'>
      <v-layout wrap>
        <v-flex xs3>
          <v-card>
            <v-card-text class="text-xs-center">
              <span v-if="!addingCourse && !addCourseVisible">Create Course</span>
              <v-btn fab small class="primary" @click='addCourseVisible = true' v-if='!addCourseVisible'>
                <v-icon>add</v-icon>
              </v-btn>
              <v-text-field v-if='addCourseVisible' v-model='courseName' label="Name" required :disabled="addingCourse"
                            @keyup.enter.prevent="addCourse"></v-text-field>
            </v-card-text>
            <v-divider v-if='addCourseVisible'></v-divider>
            <v-card-actions v-if="addCourseVisible && addingCourse">
              <v-progress-circular small right indeterminate class="grey--text"></v-progress-circular>
            </v-card-actions>
            <v-card-actions v-if='addCourseVisible && !addingCourse'>
              <v-spacer></v-spacer>
              <v-btn icon @click.native='addCourse' type="submit">
                <v-icon>done</v-icon>
              </v-btn>
              <v-btn icon @click.native='addCourseVisible = false'>
                <v-icon>cancel</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs3 v-for='course in courses' :key='course.id'>
          <v-card>
            <v-card-title primary-title>
              <h6 class="mb-0">
                {{course.name}}
              </h6>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat small>
                View
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
  import Firebase from '@/lib/Firebase'
  import courseService from '../store/Course';
  import VIcon from "../../node_modules/vuetify/src/components/VIcon/VIcon.vue";

  export default {
    components: {VIcon},
    name: 'courses',
    created() {
      this.fetchCourses();
    },
    data() {
      return {
        loading: true,
        courses: null,
        addCourseVisible: false,
        addingCourse: false,
        courseName: ""
      };
    },
    methods: {
      fetchCourses() {
        courseService.getAllByTutorID(this.$currentUser.id).then((courses) => {
          this.courses = courses;
          this.loading = false;
        });
      },
      addCourse() {
        courseService.create(this.courseName, this.$currentUser.id).then((course) => {
          this.courses.unshift(course);
        });
      }
    }
  }
</script>
