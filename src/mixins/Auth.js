import Auth from '@/lib/Auth'

export default {
  computed: {
    $auth() {
      return Auth
    },
    $currentUser() {
      return this.$auth.getUser()
    }
  },
};
