<template>
  <div class="course-sessions container fluid">
    <div class="is-flexbox align-center justify-space-between section-heading mb-4">
      <h3 class="headline mb-0">
        Sessions
      </h3>

      <v-btn primary @click="">
        <v-icon left>add</v-icon>
        Create
      </v-btn>
    </div>

    <v-layout v-if="loading" row fill-height align-center fill-width justify-center class="is-flexbox"
              :class="{'loader-box': loading}">
      <v-progress-circular indeterminate :size="50" class="primary--text"></v-progress-circular>
    </v-layout>

    <v-layout v-if="!loading" row fill-height class="is-flexbox">
      <v-flex lg6 md6 sm6 xs12 v-for='session in sessions' :key='session.id'>
        <v-card>
          <v-card-title primary-title>
            <h6 class="mb-0">
              {{session.name}}
            </h6>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat small @click="$router.push({ name: 'show-session', params: { slug: session.id } })">
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

    </v-layout>


  </div>
</template>

<script>
  import sessionService from '../../store/Session';
  import VIcon from "../../../node_modules/vuetify/src/components/VIcon/VIcon.vue";

  export default {
    components: {VIcon},
    name: 'course-sessions',
    created() {
      this.fetchSessions();
    },
    data() {
      return {
        sessions: false,
        loading: false
      }
    },
    computed: {
      course() {
        return this.$parent.course;
      }
    },
    methods: {
      fetchSessions() {
        this.loading = true;
        sessionService.getAllByCourseID(this.course.id, []).then((sessions) => {
          this.loading = false;
          this.sessions = sessions;
        })
      }
    }
  }
</script>
