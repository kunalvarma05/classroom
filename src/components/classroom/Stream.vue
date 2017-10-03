<template>
  <div class="stream-page">
    <div class="stream-message" v-if="!room">
      <h1>Stream</h1>
      <v-btn outline round :loading='!accessToken' @click='joinStream' class="cyan--text">
        <v-icon left>videocam</v-icon>
        <span>Join Stream</span>
      </v-btn>
    </div>

    <div class="stream-video">
      <div id="stream-tracks">

      </div>
    </div>
  </div>
</template>

<script>
  import Video from "../../lib/Video";

  export default {
    name: 'stream',
    data() {
      return {
        room: false,
        accessToken: false,
        tutor_id: "TRJsqKtTZoWynelMLqYE3YfEfef2"
      };
    },
    created() {
      Video.generateAccessToken(this.currentUserId, this.roomName)
        .then((token) => {
          this.accessToken = token;
        });
    },
    computed: {
      currentUserId() {
        return this.$currentUser.id;
      },
      roomName() {
        return this.$route.params.slug.toString();
      },
      userIsTutor() {
        return this.$currentUser.id === this.tutor_id;
      }
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
        // Only show the video if it's a tutor
        return Video.connect(this.accessToken, this.roomName, this.userIsTutor);
      },
      attachRoomHandlers(room) {
        room.participants.forEach(participant => {
          this.remoteParticipantConnected(participant);
        });
        room.on('participantConnected', this.remoteParticipantConnected);
      },
      remoteParticipantConnected(participant) {
        // Gotta wait
        setTimeout(() => {
          this.showTutorVideo(participant);
        }, 500);

//        // If the participant connected is a tutor
//        if (participant.identity === this.tutor_id) {
//          // Show it's video
//          this.showTutorVideo(participant);
//        }
      },
      showTutorVideo(participant) {
        participant.tracks.forEach((track) => {
          document.getElementById('stream-tracks').appendChild(track.attach());
        });
      }
    }
  }
</script>

<style lang="stylus">
  .stream-page
    display: flex;
    align-items: center;
    height: calc(100vh - 150px);

  .stream-video
    height: calc(100vh - 150px);
    margin: auto;

    #stream-tracks
      height: calc(100vh - 150px);

      video
        transform: rotateY(180deg); // Mirror ;)
        width: auto;
        height: 100%;
</style>
