<template>
  <v-container class="courses-page">
    <h4>Courses</h4>
    <v-progress-circular indeterminate v-if='loading'></v-progress-circular>
    <v-container grid-list-md v-if='!loading'>
      <v-layout wrap>
        <v-flex xs3 v-for='course in courses' :key='course.id'>
          <form @submit.prevent="updateCourse(course)">
            <v-card>
              <v-card-title primary-title v-if="!course.visible">
                <h6 class="mb-0">{{course.courseName}}</h6>
              </v-card-title>
              <v-card-text v-if="course.visible">
                <v-text-field v-model='course.courseName' label="Name" required></v-text-field>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon @click.native='toggleCourseVisible(course)' v-if="!course.visible">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn icon @click.native='removeCourse(course)' v-if="!course.visible">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-btn icon @click.native='updateCourse(course)' v-if="course.visible" type="submit">
                  <v-icon>done</v-icon>
                </v-btn>
                <v-btn icon @click.native='toggleCourseVisible(course)' v-if="course.visible">
                  <v-icon>cancel</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </form>
        </v-flex>
        <v-flex xs3>
          <v-card>
            <v-card-text class="text-xs-center">
              <v-btn fab small class="primary" @click='toggleAddCourseVisible' v-if='!addCourseVisible'>
                <v-icon>add</v-icon>
              </v-btn>
              <v-text-field v-if='addCourseVisible' v-model='courseName' label="Name" required
                            @keyup.enter.prevent="addCourse"></v-text-field>
            </v-card-text>
            <v-divider v-if='addCourseVisible'></v-divider>
            <v-card-actions v-if='addCourseVisible'>
              <v-spacer></v-spacer>
              <v-btn icon @click.native='addCourse' type="submit">
                <v-icon>done</v-icon>
              </v-btn>
              <v-btn icon @click.native='toggleAddCourseVisible'>
                <v-icon>cancel</v-icon>
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

  export default {
    name: 'courses',
    created() {
      Firebase.instance().database().ref('courses').child(this.$currentUser.id).on('value', (snapshot) => {
        let courses = [];
        let data = snapshot.val();

        for (let key in data) {
          let course = data[key];
          course.id = key;
          course.visible = false;
          courses.push(course);
        }

        this.courses = courses;
        this.loading = false;
      });
    },
    data() {
      return {
        loading: true,
        courses: null,
        courseName: null,
        addCourseVisible: false
      };
    },
    methods: {
      addCourse() {
        Firebase.instance().database().ref('courses').child(this.$currentUser.id).push({
          courseName: this.courseName
        });
        this.courseName = null;
        this.toggleAddCourseVisible();
      },
      updateCourse(course) {
        let updatedCourse = Object.assign({}, course);
        delete updatedCourse.id;
        delete updatedCourse.visible;
        Firebase.instance().database().ref('courses').child(this.$currentUser.id).child(course.id).set(updatedCourse);
      },
      editCourse(course) {
        this.courseName = course.courseName;
      },
      removeCourse(course) {
        Firebase.instance().database().ref('courses').child(this.$currentUser.id).child(course.id).remove();
      },
      toggleCourseVisible(course) {
        course.visible = !course.visible;
        this.$set(this.courses, this.courses.indexOf(course), course);
      },
      toggleAddCourseVisible() {
        this.addCourseVisible = !this.addCourseVisible;
      }
    }
  }
</script>
