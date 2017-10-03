<template>
  <div class="stream-page">
    <h1>Stream</h1>
    <v-btn outline round v-if="!streamJoined" :loading='!accessToken' @click='joinStream' class="green--text">
      <v-icon left>videocam</v-icon>
      <span>Join Stream</span>
    </v-btn>
  </div>
</template>

<script>
  export default {
    name: 'stream',
    data() {
      return {
        roomName: "general",
        accessToken: false,
        streamJoined: false
      };
    },
    created() {

    },
    methods: {
      joinStream() {
        this.streamJoined = true
      },
      connect(token) {

      }
    }
  }
</script>
