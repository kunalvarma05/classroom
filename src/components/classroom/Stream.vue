<template>
  <div class="stream-page section-page">
    <div class="stream-message" v-if="!room">
      <h1>Stream</h1>

      <div>
        <v-btn outline round :loading='!accessToken || joining' @click='joinStream'
               class="cyan--text">
          <v-icon v-if="!joining" left>videocam</v-icon>
          <span v-if="!joining">Join Stream</span>
        </v-btn>
      </div>
    </div>
    <div v-if=" tutorDisconnected" class="stream-waiting">
      <h4>Don't panic kiddos...</h4>
      <h6>
        Looks like the Tutor got disconnected. Waiting for the tutor to connect...
        <v-progress-circular right indeterminate class="grey--text"></v-progress-circular>
      </h6>
    </div>

    <div v-if="room && userIsTutor" class="stream-actions container fluid">
      <v-layout>
        <v-flex md5>
          <h5>
            The session has started...
            <v-btn @click="endSession" error dark>End</v-btn>
          </h5>
          <div id="video-preview"></div>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex md6>
          <h3 class="headline mb-3">
            Attendees
          </h3>
          <h6 v-if="!attendees.length" class="grey--text">No students have joined yet.</h6>
          <v-list v-if="attendees.length">
            <v-list-tile avatar v-for="student in attendees" :key="student.id" @click="">
              <v-list-tile-avatar>
                <img :src="student.photoUrl" :alt="student.name"/>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="student.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </div>

    <div class="stream-video">
      <div id="stream-tracks"></div>
    </div>

    <template v-if="room && !userIsTutor">
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-card>
              <v-toolbar color="indigo" class="cyan" dark>
                <v-toolbar-title>Raise Doubt</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-text-field
                color="cyan"
                  label="Type your doubt here"
                  class="mt-5"
                  v-model="question"
                  required
                ></v-text-field>
                <v-btn v-if="question" @click="raiseDoubt(question)">Raise</v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </template>

    <template v-if="userIsTutor">
      <v-card color="grey lighten-4">
        <v-snackbar
          :timeout="4000"
          :top="y === 'top'"
          v-model="snackbar"
        >
          {{ notification }}
          <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-card>
    </template>

  </div>
</template>

<script>
  import Video from "../../lib/Video";
  import sessionSerivce from '../../store/Session';
  import userSerivce from '../../store/User';

  export default {
    name: 'stream',
    props: ['course', 'tutor'],
    data() {
      return {
        room: false,
        attendees: [],
        accessToken: false,
        tutorDisconnected: false,
        question:'',
        currentid:'',
        sessionid:'',
        joining: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 6000,
        snackbar : false,
        notification : "A doubt has been raised"
      };
    },
    created() {
      Video.generateAccessToken(this.currentUserId, this.courseId)
        .then((token) => {
          this.accessToken = token;
        });

        //Subscribe to the doubts field
        let that=this;
        sessionSerivce.doc(this.sessionId.id).onSnapshot(function(doc) {
          if(doc.data().doubt) {
            that.snackbar = true;
          }
        }) ;

    },
    computed: {
      enable(){
        return "enabled";
      },
      disable(){
        return "disable";
      },
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
      },
      sessionId() {
        return this.$parent.session;
      }
    },
    methods: {
      raiseDoubt(question){
        let obj=this.$parent.session;
        sessionSerivce.createDoubt( question, this.currentUserId, this.sessionId ,function(session){
          obj=session;
          console.log('success');
        });
        this.$parent.session=obj;
        console.log("raise");
        console.log(this);
        // console.log(this.$parent.session);
      },
      joinStream() {
        this.joining = true;
        // Connect to the Room
        this.connect()
          .then((room) => {
            this.joining = false;
            this.room = room;
            this.attachRoomHandlers(room);
          });
      },
      connect() {
        // Only show get video track if it's a tutor
        return Video.connect(this.accessToken, this.courseId, this.userIsTutor);
      },
      attachRoomHandlers(room) {
        // Show tutor, their stream preview
        if (this.userIsTutor) {
          this.showVideoPreview();
        }

        room.on('participantConnected', this.remoteParticipantConnected);
        room.on('participantDisconnected', this.remoteParticipantDisconnected);
        room.on('disconnected', this.localParticipantDisConnected);

        room.participants.forEach(participant => {
          this.remoteParticipantConnected(participant);
        });
      },
      showVideoPreview() {
        Video.getLocalVideoTrack().then(track => {
          let localMediaContainer = document.getElementById('video-preview');
          localMediaContainer.appendChild(track.attach());
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
        } else {
          userSerivce.find(participant.identity).then((attendee) => {
            this.attendees.push(attendee);
          })
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
      removeVideoPreview() {
        document.getElementById('video-preview').innerHTML = "";
      },
      endSession() {
        this.$parent.session.status = "ended";
        sessionSerivce.end(this.$parent.session.id).then((updatedSession) => {
          this.$parent.session = updatedSession;
          this.room.disconnect();
          this.removeVideoPreview();
          this.sessionEnded = true;
          this.tutorDisconnected = false;
        });
      },
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

  #video-preview
    width: 100%;
    height: auto;

    video
      transform: rotateY(180deg); // Mirror ;)
      width: 100%;
      height: auto;
</style>
