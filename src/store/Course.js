import userService from './User';
import FireStore from "../lib/FireStore";
import Utils from "../lib/Utils";

export default {
  db() {
    return FireStore.instance();
  },

  collection() {
    return this.db().collection('courses');
  },

  all() {
    return this.collection().get().then((collection) => {
      return FireStore.resolveCollectionItems(collection);
    });
  },

  getAllByTutorID(tutor_id, references = ['tutor']) {
    return this.collection().where('tutor', '==', userService.doc(tutor_id))
      .get().then((collection) => {
        return FireStore.resolveCollectionItems(collection, references);
      });
  },

  getAllByStudentID(student_id, references = ['tutor']) {
    return this.collection().where(`students.${student_id}`, '==', userService.doc(student_id))
      .get().then((collection) => {
        return FireStore.resolveCollectionItems(collection, references);
      });
  },

  find(id) {
    return this.collection().doc(id).get().then((doc) => {
      return FireStore.getDocData(doc);
    });
  },

  create(name, tutor_id) {
    return new Promise((resolve, reject) => {
      let tutorRef = userService.doc(tutor_id);
      let courseRef = this.collection().doc();
      let courseId = courseRef.id;
      let alias = Utils.abbreviate(name, 3);
      let courseObj = {
        id: courseId,
        name: name,
        alias: alias,
        tutor: tutorRef
      };

      courseRef.set(courseObj).then(() => {
        return resolve(courseObj);
      });
    });
  },

  update(id, course) {
    return new Promise((resolve, reject) => {
      let courseRef = this.collection().doc(id);
      course.alias = Utils.abbreviate(course.name, 3);

      courseRef.update(course).then(() => {
        return resolve(course);
      });
    });
  }
}
