<template>
  <v-container>
    <v-layout row>
      <v-flex md4 offset-md4>
        <v-stepper v-model='step'>
          <v-stepper-header>
            <v-stepper-step step='1' :complete='step > 1'>Login</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step='2' :complete='step > 2'>Select role</v-stepper-step>
          </v-stepper-header>
          <v-stepper-content step='1'>
            <v-btn primary @click='signIn' :loading='inProgress'>Sign in with Google</v-btn>
          </v-stepper-content>
          <v-stepper-content step='2'>
            <v-card class='elevation-0'>
              <v-card-text>
                <v-radio-group v-model='role' row>
                  <v-radio label='Tutor' value='tutor' ></v-radio>
                  <v-radio label='Student' value='student'></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
            <v-btn primary @click='selectRole' :loading='inProgress'>Proceed</v-btn>
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
        role: null,
        inProgress: false,
        signInFail: false
      }
    },
    methods: {
      signIn() {
        this.inProgress = true;

        Auth.authenticate()
          .then(user => {
            this.$auth.setUser(user);

            userService.get(user.id)
              .then(existingUser => {
                if (existingUser) {
                  this.$router.push('/dashboard');
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
          .then(() => {
            this.inProgress = false;
            this.$router.push('/dashboard');
          })
          .catch(err => {
            console.log(err);
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
