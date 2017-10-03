<template>
  <div class="hello">
    <h4>{{message}}</h4>
    <v-btn primary :loading='inProgress' @click='signIn'>Sign in with Google</v-btn>
    <v-snackbar v-model='signInFail' error top right>Unable to sign in. Please try again later.</v-snackbar>
  </div>
</template>

<script>
  import userService from '../store/User';
  import Auth from '../lib/Auth';

  export default {
    name: 'hello',
    created() {
      userService.get()
        .then((name) => {
          this.username = name;
        })
    },
    data() {
      return {
        username: false,
        inProgress: false,
        signInFail: false
      }
    },
    computed: {
      message() {
        return "Hello " + this.username;
      }
    },
    methods: {
      signIn() {
        this.inProgress = true;

        Auth()
          .then(user => {
            this.username = user.name;
            return userService.create(user.id, user)
          })
          .then(() => {
            this.inProgress = false;
          })
          .catch(err => {
            this.signInFail = true;
            this.inProgress = false;
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
  .hello {
    h1 {
      color: $primary;
    }
  }
</style>
