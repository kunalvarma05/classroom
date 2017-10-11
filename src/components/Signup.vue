<template>
  <v-container>
    <v-layout row>
      <v-flex md4 offset-md4>
        <v-stepper v-model='step' class="transparent elevation-0">
          <v-stepper-content step='1'>
            <v-btn primary @click='signIn' :loading='inProgress'>Continue with Google</v-btn>
          </v-stepper-content>
          <v-stepper-content step='2'>
            <div class='elevation-0'>
              <h5>Select your role</h5>
              <v-card-text>
                <v-radio-group v-model='role' row>
                  <v-radio label='Tutor' value='tutor'></v-radio>
                  <v-radio label='Student' value='student'></v-radio>
                </v-radio-group>
              </v-card-text>
            </div>
            <v-btn block primary @click='selectRole' :disabled="!role" :loading='inProgress'>Proceed</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  import userService from '../store/User';
  import Auth from '../lib/Auth';

  export default {
    name: 'signup',
    data() {
      return {
        step: 1,
        user: null,
        role: false,
        inProgress: false,
        signInFail: false
      }
    },
    methods: {
      signIn() {
        this.inProgress = true;

        Auth.authenticate()
          .then(user => {
            userService.find(user.id)
              .then(existingUser => {
                if (existingUser) {
                  this.$auth.setUser(existingUser);
                  this.$router.push({name: 'dashboard'});
                } else {
                  this.user = user;
                  this.step = 2;
                  this.inProgress = false;
                }
              })
          })
          .catch(err => {
            this.signInFail = true;
            this.inProgress = false;
          });
      },
      selectRole() {
        this.inProgress = true;

        let user = Object.assign({}, this.user);
        user.role = this.role;
        userService.create(user.id, user)
          .then((createdUser) => {
            this.$auth.setUser(createdUser);
            this.inProgress = false;
            this.$router.push({name: 'dashboard'});
          })
          .catch(err => {
            this.signInFail = true;
            this.inProgress = false;
          });
      }
    }
  }
</script>

<!-- The 'lang' attribute specifies the styling processor.
     Options:
     `css` (default) | `stylus` (we're using this) | `scss` | `less`
-->
<style lang='stylus'>
  .hello {
    h1 {
      color: $primary;
    }
  }
</style>
