<template>
  <div class="stream-page section-page">
    <div class="stream-message" v-if="!room">
      <h1>Stream</h1>

      <div>
        <v-btn outline round :loading='!accessToken' @click='joinStream'
               class="cyan--text">
          <v-icon left>videocam</v-icon>
          <span>Join Stream</span>
        </v-btn>
      </div>
    </div>
    <div v-if="tutorDisconnected" class="stream-waiting">
      <h4>Don't panic kiddos...</h4>
      <h6>
        Looks like the Tutor got disconnected. Waiting for the tutor to connect...
        <v-progress-circular right indeterminate class="grey--text"></v-progress-circular>
      </h6>
    </div>

    <div v-if="room && userIsTutor" class="stream-actions">
      <h4>The session has started...</h4>
      <v-btn @click="endSession" class="red">End</v-btn>
    </div>

    <div class="stream-video">
      <div id="stream-tracks"></div>
    </div>
  </div>
</template>

<script>
  import Video from "@/lib/Video";
  import sessionSerivce from '../../store/Session';

  export default {
    name: 'stream',
    props: ['course', 'tutor'],
    data() {
      return {
        room: false,
        accessToken: false,
        tutorDisconnected: false
      };
    },
    created() {
      Video.generateAccessToken(this.currentUserId, this.courseId)
        .then((token) => {
          this.accessToken = token;
        });
    },
    computed: {
      currentUserId() {
        return this.$currentUser.id;
      },
      courseId() {
        return this.course.id;
      },
      tutorId() {
        return this.tutor.id;
      },
      userIsTutor() {
        return this.$currentUser.id === this.tutorId;
      },
      sessionStarted() {
        return true;
      }
    },
    methods: {
      joinStream() {
        // Connect to the Room
        this.connect()
          .then((room) => {
            this.room = room;
            this.attachRoomHandlers(room);
          });
      },
      connect() {
        // Only show get video track if it's a tutor
        return Video.connect(this.accessToken, this.courseId, this.userIsTutor);
      },
      attachRoomHandlers(room) {
        room.on('participantConnected', this.remoteParticipantConnected);
        room.on('participantDisconnected', this.remoteParticipantDisconnected);
        room.on('disconnected', this.localParticipantDisConnected);

        room.participants.forEach(participant => {
          this.remoteParticipantConnected(participant);
        });
      },
      localParticipantDisConnected(room) {
        // Detach the local media elements
        room.localParticipant.tracks.forEach(function (track) {
          const attachedElements = track.detach();
          attachedElements.forEach(function (element) {
            return element.remove();
          });
        });

        this.room = false;
      },
      remoteParticipantDisconnected(participant) {
        // If the participant connected is a tutor
        if (participant.identity === this.tutorId) {
          // Remove their video
          this.removeTutorVideo(participant);
        }
      },
      remoteParticipantConnected(participant) {
        // If the participant connected is a tutor
        if (participant.identity === this.tutorId) {
          // Show their video
          this.showTutorVideo(participant);
        }
      },
      showTutorVideo(participant) {
        this.tutorDisconnected = false;
        document.getElementById('stream-tracks').innerHTML = "";
        // Gotta wait for the tracks to be available
        setTimeout(() => {
          participant.tracks.forEach((track) => {
            document.getElementById('stream-tracks').appendChild(track.attach());
          });
        }, 500);
      },
      removeTutorVideo(participant) {
        this.tutorDisconnected = true;
        document.getElementById('stream-tracks').innerHTML = "";
      },
      endSession() {
        this.session.status = "ended";
        sessionSerivce.update(this.session.id, this.session).then((updatedSession) => {
          this.session = updatedSession;
          this.room.disconnect();
        });
      },
      sessionEnded() {
        const course_id = snapshot.key;

        if (this.courseId === course_id) {
          this.room.disconnect();
          this.sessionEnded = true;

          this.tutorDisconnected = false;

        }
      }
    }
  }
</script>

<style lang="stylus">
  .stream-video
    height: calc(100vh - 170px);
    margin: auto;

    #stream-tracks
      height: calc(100vh - 170px);

      video
        transform: rotateY(180deg); // Mirror ;)
        width: auto;
        height: 100%;
</style>
