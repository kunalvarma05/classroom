<template>
  <v-app id="homepage" class="home-page text-xs-center fill-height" dark>
    <v-container fluid>
      <!-- :alt is an equivalent (shorthand) of writing v-bind:alt -->
      <img src="../assets/images/logo.svg" :alt="title">
      <signup v-if='!loading'/>
      <div>
        <v-progress-circular indeterminate class="primary--text" v-if='loading'></v-progress-circular>
      </div>
    </v-container>
  </v-app>
</template>

<script>
  import Signup from '../components/Signup';
  import userService from '../store/User';
  import Firebase from '../lib/Firebase';
  import VApp from "../../node_modules/vuetify/src/components/VApp/VApp.vue";

  export default {
    name: 'home',
    data() {
      return {
        title: 'Classroom',
        loading: false
      }
    },
    components: {
      VApp,
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
    display: flex
    height: 100%
    align-items: center
</style>
