import FireStore from "../lib/FireStore";

export default {
  db() {
    return FireStore.instance();
  },

  collection() {
    return this.db().collection('users');
  },

  doc(id) {
    return this.collection().doc(id);
  },

  find(id) {
    return this.doc(id).get().then((doc) => {
      return FireStore.getDocData(doc);
    });
  },

  create(id, user) {
    return new Promise((resolve, reject) => {
      this.doc(id).set(user).then(() => {
        user.id = id;
        return resolve(user);
      });
    });
  }
}
