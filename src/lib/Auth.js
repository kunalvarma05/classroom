import Firebase from './Firebase';

const Auth = () => {
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
}

export default Auth;
