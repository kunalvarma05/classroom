<template>
  <div class="course-sessions container fluid">
    <div class="is-flexbox align-center justify-space-between section-heading mb-4">
      <h3 class="headline mb-0">
        Sessions
      </h3>

      <div v-if="userIsTutor">
        <v-btn primary @click="showForm = true" v-if="!showForm">
          <v-icon left>add</v-icon>
          Create
        </v-btn>
        <v-btn @click="showForm = false" v-if="showForm">
          Cancel
        </v-btn>
      </div>
    </div>

    <div class="card__front" v-show="!showForm">

      <v-layout v-if="loading" row fill-height align-center fill-width justify-center class="is-flexbox">
        <v-progress-circular indeterminate :size="50" class="primary--text"></v-progress-circular>
      </v-layout>

      <h6 v-if="!loading && !hasSessions">No sessions have been created yet.</h6>

      <div v-if="hasSessions">
        <v-layout v-if="!loading" row fill-height class="is-flexbox" wrap>
          <v-flex pa-2 lg6 md6 sm6 xs12 v-for='session in sessions' :key='session.id'>
            <v-card>
              <v-card-title primary-title>
                <h6 class="mb-0">
                  {{session.name}}
                </h6>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat small @click="$router.push({ name: 'classroom', params: { slug: session.id } })">
                  View
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </div>

    <div class="card__back" v-show="showForm">
      <v-form>
        <v-text-field
          label="Name"
          v-model="newSession.name"
          :counter="255"
          required
          :error-messages="errors.collect('name')"
          v-validate="'required'"
          data-vv-name="name"
          :disabled="creating"
        ></v-text-field>
        <v-text-field
          label="description"
          v-model="newSession.description"
          :counter="700"
          multiLine
          required
          :error-messages="errors.collect('description')"
          v-validate="'required'"
          data-vv-name="description"
          :disabled="creating"
        ></v-text-field>

        <br />
        <v-layout row>
          <v-flex>
            <v-btn raised @click="onPickFile">Upload File</v-btn>
            <input type="file" style="display: none" @change="onFileUploadClick" ref="fileInput" accept="application/pdf, .ppt, .pptx" >
          </v-flex>

          <v-flex>
            <v-subheader ref="subHead">
            </v-subheader>
          </v-flex>

        </v-layout>
        <br /> <br />

        <v-layout row>
          <v-flex>
            <v-text-field
              class="hidden"
              slot="activator"
              label="Select Date"
              v-model="scheduled_date"
              prepend-icon="event"
              v-validate="'required'"
              :error-messages="errors.collect('scheduled_date')"
              data-vv-name="scheduled_date"
            ></v-text-field>
            <v-date-picker v-model="scheduled_date" :allowedDates="allowedDates"
            ></v-date-picker>
          </v-flex>

          <v-flex>
            <v-text-field
              class="hidden"
              label="Select Time"
              v-model="scheduled_time"
              prepend-icon="watch_later"
              v-validate="'required'"
              :error-messages="errors.collect('scheduled_time')"
              data-vv-name="scheduled_time"
            ></v-text-field>

            <v-time-picker v-model="scheduled_time" :allowedHours="allowedHours"
                           :allowedMinutes="allowedMinutes" format="24hr"></v-time-picker>
          </v-flex>
        </v-layout>

        <v-alert error icon="warning" :value="valid">
          Please fix all the errors.
        </v-alert>

        <div class="pt-5">
          <v-btn :loading="creating" :disabled="valid" primary @click="validateAndCreate">Create</v-btn>
          <v-btn @click="showForm = false">Cancel</v-btn>
        </div>
      </v-form>
    </div>

  </div>
</template>

<script>
  import sessionService from '../../store/Session';
  import Utils from "../../lib/Utils";

  export default {
    name: 'course-sessions',
    $validates: true,
    created() {
      this.fetchSessions();
    },
    data() {
      return {
        sessions: false,
        loading: false,
        showDatePicker: false,
        showTimePicker: false,
        scheduled_date: null,
        scheduled_time: null,
        newSession: {
          name: "",
          description: "",
          uploadFile: null
        },
        showForm: false,
        creating: false
      }
    },
    computed: {
      userIsTutor() {
        return this.$currentUser.id === this.course.tutor.id;
      },
      course() {
        return this.$parent.course;
      },
      hasSessions() {
        return Utils.isArray(this.sessions) && this.sessions && this.sessions.length;
      },
      valid() {
        if (this.errors.count() > 0) {
          return true;
        }

        return false;
      }
    },
    methods: {
      scheduledDateTime() {
        let date = this.scheduled_date;
        let time = this.scheduled_time;
        let convertedTime = time;
        let dateTime = date + " " + convertedTime;
        return new Date(Date.parse(dateTime));
      },
      allowedDates(date) {
        // Only future dates
        return date > (new Date());
      },
      allowedHours(val) {
        return true;
      },
      allowedMinutes(val) {
        return true;
      },
      fetchSessions() {
        this.loading = true;
        sessionService.getAllByCourseID(this.course.id, []).then((sessions) => {
          this.loading = false;
          this.sessions = sessions;
        })
      },

      validateAndCreate() {
        this.creating = true;

        this.$validator.validateAll().then((valid) => {
          if (valid) {
            this.createSession();
          } else {
            this.creating = false;
          }
        });
      },

      createSession() {
        sessionService.create(this.newSession.name, this.newSession.description, this.scheduledDateTime(), this.newSession.uploadFile, this.course.id)
          .then((session) => {
            this.creating = false;
            this.sessions.unshift(session);
            this.showForm = false;
          });
      },

      onPickFile() {
        this.$refs.fileInput.click()
      },

      onFileUploadClick(event) {
        const file = event.target.files
        this.newSession.uploadFile = file[0]
        this.$refs.subHead.innerHTML = this.newSession.uploadFile.name;
      }
    }
  }
</script>
