<template>
  <div class="doubts-page section-page">



    <template>
      <v-layout row style="height: 100%">
        <v-flex xs12 sm12 >
          <v-card>
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>Doubts</v-toolbar-title>
              <v-spacer></v-spacer>

            </v-toolbar>
            <v-list two-line>
              <template v-for="item in doubts">
                <v-list-tile>
                  <v-list-tile-avatar>
                    <img v-bind:src="item.photoUrl" />
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.question"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.name"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </template>



  </div>
</template>

<script>

  import sessionSerivce from '../../store/Session';

  export default {
    data() {
      console.log('data method');

      return {
        doubts: []
      }
    },
    created() {

      let that = this;
      var temp = [];
      console.log('created method');
      sessionSerivce.doc(this.$parent.session.id).onSnapshot(function(doc) {
        that.doubts = [];
        let doubts=doc.data().doubt;
        console.log(doubts);
        var buffer=[],i=0;
        for(var j=doubts.length-1;j>=0;j--) {
          var itemm=j;
          var uobj = {};
          uobj.question = doubts[itemm].question;
          uobj.photoUrl="";
          that.doubts.push(uobj);
          buffer.push(i);
          i++;

          doubts[itemm].user.get().then(function(doc){
            that.doubts[buffer[0]].photoUrl=doc.data().photoUrl;
            that.doubts[buffer[0]].name=doc.data().name;
            buffer.shift();

            if(buffer.length==0){
              console.log(this);
              console.log(that);
            }

          })
        }
      });
    }
    ,
    name: 'doubts',
    props: ['course', 'tutor'],
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
    },
    methods: {
      printSession() {
        this.temp = sessionSerivce.doc(this.$parent.session.id);
      },
      getUserInfo() {
        console.log('ss');
      }
    }
  }
</script>
