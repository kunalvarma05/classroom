import Firebase from "../lib/Firebase";

export default {
  db() {
    return Firebase.instance().firestore();
  },

  collection() {
    return this.db().collection('courses');
  },

  all() {
    return this.collection().get().then((collection) => {
      if (!collection.empty) {
        const courses = [];
        collection.forEach((doc) => {
          courses.push(doc.data());
        });

        return courses;
      }

      return [];
    });
  },

  find(id) {
    return this.collection().doc(id).get().then((document) => {
      if (document.exists) {
        return document.data();
      }

      return false;
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
