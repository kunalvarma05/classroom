<template>
  <v-container class='dashboard-page'>
    <h1>Dashboard</h1>
    <v-btn flat @click.native='logout'>Logout</v-btn>
  </v-container>
</template>

<script>
  import Firebase from '../lib/Firebase';

  export default {
    name: 'dashboard',
    methods: {
      logout() {
        Firebase.instance().auth().signOut();
        this.$router.push('/');
      }
    }
  }
</script>

<!-- The "lang" attribute specifies the styling processor.
     Options:
     `css` (default) | `stylus` (we're using this) | `scss` | `less`
-->
<style lang="stylus">
  .dashboard-page
    display: flex;
    height: 100%;
    align-items: center;
</style>
