import courseService from './Course';
import FireStore from "../lib/FireStore";

export default {
  db() {
    return FireStore.instance();
  },

  collection() {
    return this.db().collection('sessions');
  },

  all(references = ['course']) {
    return this.collection().get().then((collection) => {
      return FireStore.resolveCollectionItems(collection, references);
    });
  },

  getAllByCourseID(course_id, references = ['course']) {
    return this.collection().where('course', '==', courseService.doc(course_id))
      .get().then((collection) => {
        return FireStore.resolveCollectionItems(collection, references);
      });
  },

  find(id, references = ['course']) {
    return this.collection().doc(id).get().then((doc) => {
      let docData = FireStore.getDocData(doc);
      return FireStore.getResolvableForItemReferences(docData, references);
    });
  },

  create(name, description, scheduled_at, course_id) {
    return new Promise((resolve, reject) => {
      let courseRef = courseService.doc(course_id);
      let sessionRef = this.collection().doc();
      let sessionId = sessionRef.id;

      let sessionObj = {
        id: sessionId,
        name: name,
        description: description,
        scheduled_at: scheduled_at,
        course: courseRef
      };

      sessionRef.set(sessionObj).then(() => {
        return resolve(sessionObj);
      });
    });
  },

  update(id, session) {
    return new Promise((resolve, reject) => {
      let sessionRef = this.collection().doc(id);

      sessionRef.update(session).then(() => {
        return resolve(session);
      });
    });
  },

  delete(id) {
    return this.collection().doc(id).delete();
  }
}
