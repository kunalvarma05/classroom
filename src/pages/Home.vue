<template>
  <v-app id="homepage" class="home-page text-xs-center fill-height" dark>
    <div class="home-pattern-overlay"></div>
    <v-container fluid class="inner-wrapper">
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
    display: flex
    height: 100%
    align-items: center
    background: url(/static/homepage.jpg) no-repeat
    background-size: cover
    background-position: center center

    .inner-wrapper
      z-index: 20

    .home-pattern-overlay
      position: fixed
      height: 100%
      width: 100%
      top: 0
      left: 0
      right: 0
      bottom: 0
      background-image: linear-gradient(to left, black 0%, #222 100%);
      opacity: 0.8
      z-index: 10
</style>
