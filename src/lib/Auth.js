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
    let userObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      role: user.role
    };

    window.currentUser = userObj

    let encodedUser = JSON.stringify(userObj)
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
