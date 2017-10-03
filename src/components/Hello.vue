<template>
  <div class="hello">
    <h4>{{message}}</h4>
    <v-btn primary>Get Started</v-btn>
  </div>
</template>

<script>
  import userService from '../store/User';

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
        username: false
      }
    },
    computed: {
      message() {
        return "Hello " + this.username;
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
