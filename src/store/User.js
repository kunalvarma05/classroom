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

  all(references = []) {
    return this.collection().get().then((collection) => {
      return FireStore.resolveCollectionItems(collection, references);
    });
  },

  find(id, references = []) {
    return this.collection().doc(id).get().then((doc) => {
      let docData = FireStore.getDocData(doc);
      return FireStore.getResolvableForItemReferences(docData, references);
    });
  },

  create(id, user) {
    return new Promise((resolve, reject) => {
      this.doc(id).set(user).then(() => {
        user.id = id;
        return resolve(user);
      });
    });
  },

  update(id, user) {
    return new Promise((resolve, reject) => {
      let userRef = this.collection().doc(id);

      userRef.update(user).then(() => {
        return resolve(user);
      });
    });
  },

  delete(id) {
    return this.collection().doc(id).delete();
  },
}
