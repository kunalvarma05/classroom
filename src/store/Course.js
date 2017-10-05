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

  doc(id) {
    return this.collection().doc(id);
  },

  all(references = ['tutor']) {
    return this.collection().get().then((collection) => {
      return FireStore.resolveCollectionItems(collection, references);
    });
  },

  getAllByTutorID(tutor_id, references = ['tutor']) {
    return this.collection().where('tutor', '==', userService.doc(tutor_id))
      .get().then((collection) => {
        return FireStore.resolveCollectionItems(collection, references);
      });
  },

  getAllByStudentID(student_id) {
    return new Promise((resolve, reject) => {
      userService.find(student_id, ['courses']).then((student) => {
        resolve(student.courses);
      });
    });
  },

  find(id, references = ['tutor']) {
    return this.collection().doc(id).get().then((doc) => {
      let docData = FireStore.getDocData(doc);
      return FireStore.getResolvableForItemReferences(docData, references);
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
  },

  delete(id) {
    return this.collection().doc(id).delete();
  },

  enroll(course_id, student_id) {
    return new Promise((resolve, reject) => {
      let studentRef = userService.doc(student_id);
      this.find(course_id, ['students']).then((course) => {
        let courseStudents = course.students;

        if (!courseStudents || !courseStudents.length) {
          courseStudents = [];
        }

        courseStudents.push(studentRef);
        course.students = courseStudents;

        this.update(course_id, course).then((course) => {
          let courseRef = this.doc(course_id);

          // Add the course to the list of the student's courses
          userService.find(student_id, ['courses']).then((student) => {
            let studentCourses = student.courses;

            if (!studentCourses || !studentCourses.length) {
              studentCourses = [];
            }

            studentCourses.push(courseRef);
            student.courses = studentCourses;

            userService.update(student_id, student).then((user) => {
              resolve(course);
            })
          });
        });
      });
    });
  }
}
