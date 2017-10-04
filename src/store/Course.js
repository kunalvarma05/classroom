import userService from './User';
import FireStore from "../lib/FireStore";

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

  create(id, course) {
    return new Promise((resolve, reject) => {
      this.collection().doc(id).set(course).then(() => {
        course.id = id;
        return resolve(course);
      });
    });
  },
}
