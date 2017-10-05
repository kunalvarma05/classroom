<template>
  <div class="course-students container fluid">
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
</template>

<script>
  export default {
    name: 'students',
    computed: {
      course() {
        return this.$parent.course;
      }
    }
  }
</script>
