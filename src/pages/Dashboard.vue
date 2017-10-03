<template>
  <v-container class='dashboard-page'>
    <router-view></router-view>
  </v-container>
</template>

<script>
  import Firebase from '../lib/Firebase';

  export default {
    name: 'dashboard',
    methods: {
      logout() {
        Firebase.instance().auth().signOut();
        this.$auth.destroyUser();
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
