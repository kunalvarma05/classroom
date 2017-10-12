import userService from './User';
import Utils from "../lib/Utils";
import BaseStore from "./BaseStore";
import FireStore from "../lib/FireStore";

class CourseStore extends BaseStore {
  constructor() {
    super();
    this.collectionName = "courses";
    CourseStore.instanceObj = false;
  }

  static instance() {
    if (!CourseStore.instanceObj) {
      CourseStore.instanceObj = new CourseStore();
    }

    return CourseStore.instanceObj;
  }

  all(references = ['tutor']) {
    return super.all(references);
  }

  getAllByTutorID(tutor_id, references = ['tutor']) {
    return this.collection().where('tutor', '==', userService.doc(tutor_id))
      .get().then((collection) => {
        return FireStore.resolveCollectionItems(collection, references);
      });
  }

  getAllByStudentID(student_id) {
    return new Promise((resolve, reject) => {
      userService.find(student_id, ['courses']).then((student) => {
        resolve(student.courses);
      });
    });
  }

  find(id, references = ['tutor']) {
    return super.find(id, references);
  }

  create(name, tutor_id) {
    let tutorRef = userService.doc(tutor_id);
    let alias = Utils.abbreviate(name, 3);

    let courseObj = {
      name: name,
      alias: alias,
      tutor: tutorRef
    };

    return super.create(courseObj);
  }

  update(id, course) {
    course.alias = Utils.abbreviate(course.name, 3);
    return super.update(id, course);
  }

  enroll(course_id, student_id) {
    return new Promise((resolve, reject) => {
      // Student Reference
      let studentRef = userService.doc(student_id);
      // Find the Course
      this.find(course_id, []).then((course) => {
        // Students already enrolled in the course
        let courseStudents = course.students;

        // No students. Initialize
        if (!courseStudents || !courseStudents.length) {
          courseStudents = [];
        }

        // Add the student to the course
        courseStudents.push(studentRef);

        // Update the reference
        course.students = courseStudents;

        // Update the course with the new details
        this.update(course_id, course).then((course) => {
          // Course reference
          let courseRef = this.doc(course_id);

          // Find the Student (User)
          userService.find(student_id, []).then((student) => {
            // Courses the student is already enrolled in
            let studentCourses = student.courses;

            // No courses. Initialize
            if (!studentCourses || !studentCourses.length) {
              studentCourses = [];
            }

            // Add the course to the list of the student's courses
            studentCourses.push(courseRef);
            // Update the reference
            student.courses = studentCourses;

            // Update the Student
            userService.update(student_id, student).then((user) => {
              // Resolve the updated course
              resolve(course);
            })
          });
        });
      });
    });
  }

  unroll(course_id, student_id) {
    return new Promise((resolve, reject) => {
      // Student reference
      let studentRef = userService.doc(student_id);

      // Find the Course
      this.find(course_id, []).then((course) => {
        // Students already enrolled in the course
        let courseStudents = course.students;

        if (courseStudents && courseStudents.length) {
          // Filter and remove the student
          course.students = courseStudents.filter((student) => {
            return student.id !== student_id;
          });
        }

        // Update the Course
        this.update(course_id, course).then((course) => {
          // Course Reference
          let courseRef = this.doc(course_id);

          // Find the Student (User)
          userService.find(student_id, []).then((student) => {
            // Courses the student is enrolled in
            let studentCourses = student.courses;

            if (studentCourses && studentCourses.length) {
              // Filter and Remove the course
              student.courses = studentCourses.filter((course) => {
                return course.id !== course_id;
              });
            }

            // Update the User
            userService.update(student_id, student).then((user) => {
              // Resolve the updated Course
              resolve(course);
            })
          });
        });
      });
    });
  }

  studentIsEnrolled(course_id, student_id) {
    return new Promise((resolve, reject) => {
      // Find the Course, with the reference
      // to all it's students resolved.
      this.find(course_id, ['students']).then((course) => {
        let isEnrolled = false;

        // Find the Student in the list of enrolled students
        if (course.students && course.students.length) {
          // Search for the Student in the list
          isEnrolled = course.students.some((student) => {
            return student.id === student_id;
          });
        }

        // Resolve
        resolve(isEnrolled);
      });
    });
  }

}

export default CourseStore.instance();
