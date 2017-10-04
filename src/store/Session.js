import Firebase from "../lib/Firebase";

export default {
  db() {
    return Firebase.instance().database();
  },

  notifyStudents(tutor, course) {
    return this.db().ref('/sessions').child(course.id).set({
      message: tutor.name + " has started a session for the course: " + course.courseName,
      course: course,
      tutor: tutor,
      type: "session_start"
    });
  },

  endSession(id) {
    return this.db().ref('/sessions').child(id).remove();
  }
}
