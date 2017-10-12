import courseService from './Course';
import FireStore from "../lib/FireStore";
import BaseStore from "./BaseStore";

export class SessionStore extends BaseStore {

  constructor() {
    super();
    this.collectionName = "sessions";
    SessionStore.instanceObj = false;
  }

  static instance() {
    if (!SessionStore.instanceObj) {
      SessionStore.instanceObj = new SessionStore();
    }

    return SessionStore.instanceObj;
  }

  all(references = ['course']) {
    return super.all(references);
  }

  getAllByCourseID(course_id, references = ['course']) {
    return this.collection().where('course', '==', courseService.doc(course_id))
      .get().then((collection) => {
        return FireStore.resolveCollectionItems(collection, references);
      });
  }

  find(id, references = ['course']) {
    return super.find(id, references);
  }


  create(name, description, scheduled_at, uploadFile, course_id) {

    var obj=this;
    return FireStore.storage().ref().child('session/'+uploadFile.name).put(uploadFile).then(function(snap){
      console.log(snap);

      return new Promise((resolve, reject) => {
        let courseRef = courseService.doc(course_id);
        let sessionRef = obj.collection().doc();
        let sessionId = sessionRef.id;

        let sessionObj = {
          id: sessionId,
          name: name,
          description: description,
          scheduled_at: scheduled_at,
          status: "scheduled",
          course: courseRef,
          documentUrl: snap.downloadURL
        };

        sessionRef.set(sessionObj).then(() => {
          return resolve(sessionObj);
        });
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
  
//   create(name, description, scheduled_at, link, course_id) {
//     let courseRef = courseService.doc(course_id);
//
//     let sessionObj = {
//       name: name,
//       link: link,
//       description: description,
//       scheduled_at: scheduled_at,
//       status: "scheduled",
//       course: courseRef
//     };
//
//     return super.create(sessionObj);
//   }

  start(id) {
    return this.update(id, {status: "started"});
  }

  end(id) {
    return this.update(id, {status: "ended"});
  }
}

export default SessionStore.instance();
