<template>
  <div class="stream-page">
    <div class="stream-message">
      <h1>Stream</h1>
      <v-btn outline round v-if="!streamJoined" :loading='!accessToken' @click='joinStream' class="cyan--text">
        <v-icon left>videocam</v-icon>
        <span>Join Stream</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
  import Video from "../../lib/Video";

  export default {
    name: 'stream',
    data() {
      return {
        roomName: "general",
        room: false,
        accessToken: false,
        streamJoined: false
      };
    },
    created() {
      Video.generateAccessToken(this.$route.params.slug, this.roomName)
        .then((token) => {
          this.accessToken = token;
        });
    },
    methods: {
      joinStream() {
        this.connect()
          .then((room) => {
            this.room = room;

            this.attachRoomHandlers(room);
          });
      },
      connect() {
        return Video.connect(this.accessToken, this.roomName);
      },
      attachRoomHandlers(room) {
        room.on('participantConnected', this.remoteParticipantConnected);
      },
      remoteParticipantConnected(participant) {
        console.log(participant);
      }
    }
  }
</script>

<style lang="stylus">
  .stream-page
    display: flex;
    align-items: center;
</style>
