<template>
  <div class="dashboard-main-page">
    <h1>Dashboard</h1>
    <v-btn flat @click.native='logout'>Logout</v-btn>
  </div>
</template>

<script>
  import Firebase from '../lib/Firebase';

  export default {
    name: 'dashboard-main',
    methods: {
      logout() {
        Firebase.instance().auth().signOut();
        this.$auth.destroyUser();
        this.$router.push('/');
      }
    }
  }
</script>
