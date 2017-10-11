import FireStore from "../lib/FireStore";

export default class BaseStore {

  constructor() {
    this.collectionName = "";
  }

  db() {
    return FireStore.instance();
  }

  collection() {
    return this.db().collection(this.collectionName);
  }

  doc(id) {
    return this.collection().doc(id);
  }

  all(references = []) {
    return this.collection().get().then((collection) => {
      return FireStore.resolveCollectionItems(collection, references);
    });
  }

  find(id, references = []) {
    return this.collection().doc(id).get().then((doc) => {
      let docData = FireStore.getDocData(doc);
      return FireStore.getResolvableForItemReferences(docData, references);
    });
  }

  create(id, docObj) {
    return new Promise((resolve, reject) => {
      this.doc(id).set(docObj).then(() => {
        docObj.id = id;
        return resolve(docObj);
      });
    });
  }

  update(id, docObj) {
    return new Promise((resolve, reject) => {
      let docRef = this.doc(id);

      docRef.update(docObj).then(() => {
        return resolve(docObj);
      });
    });
  }

  delete(id) {
    return this.collection().doc(id).delete();
  }
}
