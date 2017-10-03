import Firebase from './Firebase';

export default {

  authenticate() {
    let firebaseClient = Firebase.getClient();
    let provider = new firebaseClient.auth.GoogleAuthProvider();

    return Firebase.instance().auth().signInWithPopup(provider)
      .then(result => {
        return result.user;
      })
      .then(user => {
        return {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL
        };
      });
  },

  setUser(user) {
    window.currentUser = user

    let encodedUser = JSON.stringify(user)
    window.localStorage.setItem('user', encodedUser)
  },

  getUser() {
    if (window.currentUser) {
      return window.currentUser
    }

    let user = window.localStorage.getItem('user')

    if (user != null) {
      let decodedUser = JSON.parse(user)

      return decodedUser
    } else {
      return null
    }
  },

  destroyUser() {
    window.localStorage.removeItem('user')
    window.currentUser = undefined
  },

  isAuthenticated() {
    if (this.getUser()) {
      return true
    } else {
      return false
    }
  }
}
