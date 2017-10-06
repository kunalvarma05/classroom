import courseService from './Course';
import FireStore from "../lib/FireStore";

export default {
  db() {
    return FireStore.instance();
  },

  collection() {
    return this.db().collection('sessions');
  },

  doc(id) {
    return this.collection().doc(id);
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

  create(name, description, scheduled_at, link, course_id) {
    return new Promise((resolve, reject) => {
      let courseRef = courseService.doc(course_id);
      let sessionRef = this.collection().doc();
      let sessionId = sessionRef.id;

      let sessionObj = {
        id: sessionId,
        name: name,
        link: link,
        description: description,
        scheduled_at: scheduled_at,
        status: "scheduled",
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
  },

  start(id) {
    return new Promise((resolve, reject) => {
      this.find(id).then((session) => {
        session.status = "started";

        this.update(id, session).then((sess) => {
          resolve(sess);
        });
      });
    });
  },

  end(id) {
    return new Promise((resolve, reject) => {
      this.find(id).then((session) => {
        session.status = "ended";

        this.update(id, session).then((sess) => {
          resolve(sess);
        });
      });
    });
  }
}
