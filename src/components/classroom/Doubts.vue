<template>
  <div class="doubts-page section-page">
    <h1>Doubts</h1>
  </div>
</template>

<script>
  export default {
    name: 'doubts',
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
