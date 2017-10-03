<template>
  <div class="home-page text-xs-center">
    <v-container fluid>
      <!-- :alt is an equivalent (shorthand) of writing v-bind:alt -->
      <img src="../assets/images/logo-blue.svg" :alt="title">
      <signup v-if='!loading' />
    </v-container>
  </div>
</template>

<script>
  import Signup from '../components/Signup';
  import userService from '../store/User';
  import Firebase from '../lib/Firebase';

  export default {
    name: 'home',
    data() {
      return {
        title: 'Classroom',
        loading: false
      }
    },
    components: {
      Signup
    }
  }
</script>

<!-- The "lang" attribute specifies the styling processor.
     Options:
     `css` (default) | `stylus` (we're using this) | `scss` | `less`
-->
<style lang="stylus">
  .home-page
    display: flex;
    height: 100%;
    align-items: center;
</style>
