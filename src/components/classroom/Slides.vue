<template>
  <div class="slides-page">
    <h1>Slides</h1>
  </div>
</template>

<script>
  export default {
    name: 'slides',
    props: ['course', 'tutor'],
    computed: {
      currentUserId() {
        return this.$currentUser.id;
      },
      courseId() {
        return this.course.id;
      },
      tutorId() {
        return this.tutor.id;
      },
      userIsTutor() {
        return this.$currentUser.id === this.tutorId;
      },
    }
  }
</script>
