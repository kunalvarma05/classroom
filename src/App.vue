<template>
  <div id="app">
    <v-app dark>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="stylus">
  @require './stylus/app.styl';
</style>
