<template>
  <v-app id="dashboard" class="dashboard-page" toolbar :dark="darkTheme">
    <v-navigation-drawer
      persistent
      disable-route-watcher
      v-model="drawer"
      absolute
      mini-variant
      floating
      clipped
      :dark="darkTheme"
    >
      <v-list>
        <v-list-tile @click="$router.push({ name: 'dashboard' })">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="$router.push({ name: 'courses' })">
          <v-list-tile-action>
            <v-icon>book</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Courses</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :dark="darkTheme" fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title">
        <img src="../assets/images/logo.svg" alt="Classroom" class="logo" v-if="darkTheme">
        <img src="../assets/images/logo-blue.svg" alt="Classroom" class="logo" v-if="!darkTheme">
      </span>

      <v-spacer></v-spacer>
      <v-menu
        offset-y
        left
        down
        :close-on-content-click="false"
        :nudge-width="150"
        v-model="accountMenu"
        class="account-menu"
      >
        <v-avatar class="white" slot="activator" size="36px">
          <img :src="$currentUser.photoUrl" :alt="$currentUser.name">
        </v-avatar>
        <v-card>
          <v-list>
            <v-list-tile avatar @click="">
              <v-list-tile-avatar>
                <img :src="$currentUser.photoUrl" :alt="$currentUser.name">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{$currentUser.name}}</v-list-tile-title>
                <v-list-tile-sub-title v-if="!userIsTutor">Student</v-list-tile-sub-title>
                <v-list-tile-sub-title v-if="userIsTutor">Tutor</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-tile>
              <v-list-tile-action>
                <v-switch v-model="darkTheme" color="primary"></v-switch>
              </v-list-tile-action>
              <v-list-tile-title>Dark Mode</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>settings</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>Log out</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>

    <div v-if="showNotification">
      <v-snackbar
        :key="notification.course.id"
        :timeout="10000"
        :top="true"
        v-model="showNotification"
        :multi-line="true"
        dark
      >
        {{notification.message}}
        <v-btn @click.native="goToSession" primary>Attend</v-btn>
        <v-btn flat class="grey--text" @click.native="showNotification = false">Close</v-btn>
      </v-snackbar>
    </div>

  </v-app>
</template>

<script>
  import Firebase from '../lib/Firebase';

  export default {
    name: 'dashboard',
    created() {
      if (!this.userIsTutor && this.$router.currentRoute.name !== "classroom") {
        this.listenToNotifications();
      }
    },
    data() {
      return {
        drawer: true,
        notification: false,
        showNotification: false,
        darkTheme: false,
        accountMenu: false
      };
    },
    computed: {
      userIsTutor() {
        return this.$currentUser.role === "tutor";
      },
    },
    methods: {
      goToSession() {
        this.showNotification = false;
        this.$router.push({
          name: 'classroom',
          params: {tutor_id: this.notification.tutor.id, course_id: this.notification.course.id}
        });
      },
      listenToNotifications() {
        Firebase.instance().database().ref('/sessions').on('child_added', (snapshot) => {
          const notification = snapshot.val();
          const course = notification.course;
          const tutor = notification.tutor;

          this.notification = notification;
          this.showNotification = true
        });
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
    height: 100%;

    .toolbar
      .logo
        width: 120px;

    .account-menu
      padding: 0 15px;
</style>
