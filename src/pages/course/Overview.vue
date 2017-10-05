<template>
  <div class="course-overview">
    <div class="card__front" v-if="!editing">
      <v-card-text>
        <h3 class="headline">Overview</h3>
        <p>
          {{course.description}}
        </p>
      </v-card-text>
    </div>
    <v-slide-y-transition>
      <div class="card__back container fluid" v-if="editing">
        <v-form>
          <v-text-field
            label="Name"
            v-model="course.name"
            :counter="255"
            required
            :error-messages="errors.collect('name')"
            v-validate="'required'"
            data-vv-name="name"
            :disabled="updating"
          ></v-text-field>
          <v-text-field
            label="description"
            v-model="course.description"
            :counter="700"
            multiLine
            :rows="8"
            required
            :error-messages="errors.collect('description')"
            v-validate="'required'"
            data-vv-name="description"
            :disabled="updating"
          ></v-text-field>

          <v-alert error icon="warning" :value="valid">
            Please fix all the errors.
          </v-alert>

          <v-btn :loading="updating" :disabled="valid" primary @click="validateAndUpdate">Update</v-btn>
          <v-btn @click="editing = false">Cancel</v-btn>
        </v-form>
      </div>
    </v-slide-y-transition>

    <v-card-actions v-if="!editing && userIsTutor">
      <v-btn @click="editCourse">
        <v-icon left>edit</v-icon>
        Edit
      </v-btn>
      <v-spacer></v-spacer>
      <v-menu
        :close-on-content-click="false"
        :nudge-width="150"
        left
        offset-y
        top
      >
        <v-btn slot="activator" flat class="red--text">
          Delete
        </v-btn>
        <v-list>
          <v-list-tile @click="deleteCourse">
            <v-list-tile-action v-if="deleting">
              <v-progress-circular indeterminate class="red--text"></v-progress-circular>
            </v-list-tile-action>
            <v-list-tile-title>
              Delete Permanently?
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-card-actions>
  </div>
</template>

<script>
  import courseService from '@/store/Course';
  import VCardMedia from "vuetify/src/components/VCard/VCardMedia";
  import Utils from "@/lib/Utils";


  export default {
    components: {VCardMedia},
    name: 'course-overview',
    $validates: true,
    data() {
      return {
        loading: false,
        editing: false,
        updating: false,
        deleting: false
      }
    },
    computed: {
      course: {
        set(val) {
          this.$parent.course = val;
        },
        get() {
          return this.$parent.course;
        }
      },
      valid() {
        if (this.errors.count() > 0) {
          return true;
        }

        return false;
      },
      slug() {
        return this.$route.params.slug;
      },
      courseAlias() {
        if (this.course) {
          if (this.course.alias) {
            return this.course.alias;
          }

          return Utils.abbreviate(this.course.name);
        }

        return ".."
      },
      coverImage() {
        if (this.course.image) {
          return this.course.image;
        }

        return "https://images.unsplash.com/photo-1497733942558-e74c87ef89db?dpr=1&auto=compress,format&fit=crop&w=800";
      },
      userIsTutor() {
        return this.$currentUser.role === "tutor";
      },
    },
    methods: {
      editCourse() {
        this.editing = true;
      },
      validateAndUpdate() {
        this.updating = true;

        this.$validator.validateAll().then((valid) => {
          if (valid) {
            this.updateCourse();
          } else {
            this.updating = false;
          }
        });
      },
      updateCourse() {
        courseService.update(this.course.id, this.course).then((course) => {
          this.course = course;
          this.editing = false;
          this.updating = false;
        });
      },
      deleteCourse() {
        this.deleting = true;

        courseService.delete(this.course.id).then(() => {
          this.deleting = false;
          this.$router.push({name: 'courses'});
        });
      }
    }
  }
</script>

<style lang="stylus">
  .course-page
    padding: 20px;
    .card__actions
      padding: 16px;
</style>
