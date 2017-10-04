import Firebase from "../lib/Firebase";

export default {
  db() {
    return Firebase.instance().firestore();
  },

  collection() {
    return this.db().collection('users');
  },

  find(id) {
    return this.collection().doc(id).get().then((document) => {
      if (document.exists) {
        return document.data();
      }

      return false;
    });
  },

  create(id, user) {
    return new Promise((resolve, reject) => {
      this.collection().doc(id).set(user).then(() => {
        user.id = id;
        return resolve(user);
      });
    });
  }
}
