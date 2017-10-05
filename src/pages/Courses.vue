<template>
  <v-container class="courses-page">
    <div class="is-flexbox align-center justify-space-between section-heading mb-4">
      <h3 class="headline mb-0">
        <span v-if="!viewingMyCourses">
          All Courses
        </span>
        <span v-if="viewingMyCourses">
          My Courses
        </span>
        <v-btn @click='fetchCourses' v-if="!viewingMyCourses" flat>My courses</v-btn>
        <v-btn @click='getAllCourses' v-if="viewingMyCourses" flat>All courses</v-btn>
      </h3>
    </div>
    <v-progress-circular indeterminate v-if='loading'></v-progress-circular>
    <p v-if='!loading && !userIsTutor && !courses'>Seems like you have not enrolled in any courses.</p>
    <v-container grid-list-md v-if='!loading'>
      <v-layout wrap>
        <v-flex lg3 md4 sm12 xs12 v-if='userIsTutor && viewingMyCourses'>
          <v-card class="add-course-card">
            <v-card-text class="text-xs-center">
              <span v-if="!addingCourse && !addCourseVisible">Create Course</span>
              <v-btn fab small class="primary white--text" @click='addCourseVisible = true' v-if='!addCourseVisible'>
                <v-icon>add</v-icon>
              </v-btn>
              <v-text-field v-if='addCourseVisible' v-model='courseName' label="Name" required :disabled="addingCourse"
                            @keyup.enter="addCourse"></v-text-field>
            </v-card-text>
            <v-divider v-if='addCourseVisible'></v-divider>
            <v-card-actions v-if="addCourseVisible && addingCourse">
              <v-progress-circular small right indeterminate class="grey--text"></v-progress-circular>
            </v-card-actions>
            <v-card-actions v-if='addCourseVisible && !addingCourse'>
              <v-btn icon @click.native='addCourseVisible = false'>
                <v-icon>cancel</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex lg3 md4 sm6 xs12 v-for='course in courses' :key='course.id'>
          <v-card>
            <v-card-title primary-title>
              <h6 class="mb-0">
                {{course.name}}
              </h6>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat small @click="$router.push({ name: 'show-course', params: { slug: course.id } })">
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
        courseName: "",
        viewingMyCourses: true
      };
    },
    computed: {
      userIsTutor() {
        return this.$currentUser.role === "tutor";
      },
    },
    methods: {
      fetchCourses() {
        this.loading = true;

        let id = this.$currentUser.id;
        let request = this.userIsTutor ? courseService.getAllByTutorID(id) : courseService.getAllByStudentID(id);

        request.then((courses) => {
          this.courses = courses;
          this.viewingMyCourses = true;
          this.loading = false;
        });
      },
      addCourse() {
        this.addingCourse = true;
        courseService.create(this.courseName, this.$currentUser.id).then((course) => {
          this.courses.unshift(course);
          this.addingCourse = false;
          this.courseName = "";
          this.addCourseVisible = false;
        });
      },
      getAllCourses() {
        this.loading = true;
        courseService.all().then(courses => {
          this.viewingMyCourses = false;
          this.courses = courses;
          this.loading = false;
        })
      }
    }
  }
</script>

<style lang="stylus">
  .add-course-card
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100% !important;
    width: 100%;
</style>
