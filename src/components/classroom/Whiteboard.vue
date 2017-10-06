<template>
  <div class="whiteboard-page">
    <h1>Whiteboard</h1>
  </div>
</template>

<script>
  export default {
    name: 'whiteboard',
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
