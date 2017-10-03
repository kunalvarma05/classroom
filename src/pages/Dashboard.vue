<template>
  <v-app id="dashboard" class="dashboard-page" toolbar dark>
    <v-navigation-drawer
      persistent
      disable-route-watcher
      v-model="drawer"
      light
      absolute
      dark
    >
      <v-list>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title">
        <img src="../assets/images/logo.svg" alt="Classroom" class="logo">
      </span>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  import Firebase from '../lib/Firebase';

  export default {
    name: 'dashboard',
    data() {
      return {
        drawer: false
      };
    }
  }
</script>

<!-- The "lang" attribute specifies the styling processor.
     Options:
     `css` (default) | `stylus` (we're using this) | `scss` | `less`
-->
<style lang="stylus">
  .dashboard-page
    height: 100%;

    .toolbar
      .logo
        width: 120px;
</style>
