<template>
  <div class="course-students container fluid">
    <h6 v-if="!hasStudents">
      No Students have enrolled yet.
    </h6>
    <div v-if="hasStudents">
      <h3 class="headline mb-3">
        Students
      </h3>
      <v-list>
        <v-list-tile avatar v-for="student in course.students" :key="student.id" @click="">
          <v-list-tile-avatar>
            <img :src="student.photoUrl" :alt="student.name"/>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="student.name"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>
  </div>
</template>

<script>
  import Utils from "../../lib/Utils";

  export default {
    name: 'students',
    computed: {
      course() {
        return this.$parent.course;
      },
      hasStudents() {
        return Utils.isArray(this.course.students) && this.course.students && this.course.students.length;
      }
    }
  }
</script>
