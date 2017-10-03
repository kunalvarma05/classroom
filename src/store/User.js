import Firebase from "../lib/Firebase";

export default {
  db() {
    return Firebase.instance().database();
  },

  get() {
    return this.db().ref('/name').once('value').then((snapshot) => {
      return snapshot.val();
    });
  },

  create(id, user) {
    return this.db().ref('/users/' + id).set(user);
  }
}
