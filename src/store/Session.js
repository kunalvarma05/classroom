import courseService from './Course';
import userService from './User';
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

  subCreate(name, description, scheduled_at, downloadURL, course_id) {
    let courseRef = courseService.doc(course_id);
    let sessionObj = {
      name: name,
      description: description,
      scheduled_at: scheduled_at,
      status: "scheduled",
      course: courseRef,
      documentUrl: downloadURL
    };
    return super.create(sessionObj);
  }

  create(name, description, scheduled_at, uploadFile, course_id) {
    if (uploadFile && uploadFile.name) {
      var obj = this;
      return FireStore.storage().ref().child('session/' + uploadFile.name).put(uploadFile).then(function(snap) {
        return obj.subCreate(name, description, scheduled_at, snap.downloadURL, course_id);
      });
    } else {
      return this.subCreate(name, description, scheduled_at, null, course_id);
    }
  }

  createDoubt(question,user_id,session,cb) {
      let userRef=userService.doc(user_id);
      let doubtObj={
        question:question,
        status:false,
        user:userRef
      };
      let sessionRef = this.doc(session.id);
      let obj=this;
      this.find(sessionRef.id).then(function(data){
        if(data['doubt']){
          console.log('inside if data');
          data['doubt'].push(doubtObj);
          console.log('inside if session');
          session['doubt'].push(doubtObj);
        }else{
          data['doubt']=[];
          session['doubt']=[];
          console.log('inside else data');
          data['doubt'].push(doubtObj);
          console.log('inside else session');
          session['doubt'].push(doubtObj);
          console.log('inside else after session');
        }
        obj.update(session.id,data);
        cb(session);
      });

  }

  update(id, session) {
    return new Promise((resolve, reject) => {
      let sessionRef = this.collection().doc(id);

      sessionRef.update(session).then(() => {
        return resolve(session);
      });
    });
  }

  delete(id) {
    return this.collection().doc(id).delete();
  }

  start(id) {
    return this.update(id, {
      status: "started"
    });
  }

  end(id) {
    return this.update(id, {
      status: "ended"
    });
  }
}

export default SessionStore.instance();
