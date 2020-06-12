// Schema and DB interactions for an Course object

const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');

const CourseSchema = {
    subject: { required: true },
    number: { required: true },
    title: { required: true },
    term: { required: true },
    instructorId: { required: true }
};
exports.CourseSchema = CourseSchema;

exports.createCourse = async function(course) {
  const courseToInsert = extractValidFields(course, CourseSchema);
  const [result] = await mysqlPool.query(
    "INSERT INTO courses SET ?",
    [courseToInsert]
  );
  return result.insertId;
}

exports.getAllCourses000 = async function() {
  const [results] = await mysqlPool.query(
    "SELECT id, subject, number, title, term, instructorId FROM courses",
  );
  return results;
}

exports.getAllCourses001 = async function(term) {
  const [results] = await mysqlPool.query(
    "SELECT id, subject, number, title, term, instructorId FROM courses WHERE term = ?",
    [term]
  );
  return results;
}

exports.getAllCourses010 = async function(num) {
  const [results] = await mysqlPool.query(
    "SELECT id, subject, number, title, term, instructorId FROM courses WHERE number = ?",
    [num]
  );
  return results;
}

exports.getAllCourses100 = async function(subject) {
  const [results] = await mysqlPool.query(
    "SELECT id, subject, number, title, term, instructorId FROM courses WHERE subject = ?",
    [subject]
  );
  return results;
}

exports.getAllCourses101 = async function(subject, term) {
  const [results] = await mysqlPool.query(
    "SELECT id, subject, number, title, term, instructorId FROM courses WHERE (subject = ?) AND (term = ?)",
    [subject, term]
  );
  return results;
}

exports.getAllCourses110 = async function(subject, num) {
  const [results] = await mysqlPool.query(
    "SELECT id, subject, number, title, term, instructorId FROM courses WHERE (subject = ?) AND (number = ?)",
    [subject, num]
  );
  return results;
}

exports.getAllCourses011 = async function(num, term) {
  const [results] = await mysqlPool.query(
    "SELECT id, subject, number, title, term, instructorId FROM courses WHERE (number = ?) AND (term = ?)",
    [num, term]
  );
  return results;
}

exports.getAllCourses111 = async function(subject, num, term) {
  const [results] = await mysqlPool.query(
    "SELECT id, subject, number, title, term, instructorId FROM courses WHERE (subject = ?) AND (number = ?) AND (term = ?)",
    [subject, num, term]
  );
  return results;
}

exports.getCourseById = async function(id) {
  const [ result ] = await mysqlPool.query(
    "SELECT id, subject, number, title, term, instructorId FROM courses WHERE id = ?",
    [ id ]
  );

  const course = result[0];
  if (!course) return null;
  return course;
}

exports.updateCourseById = async function(id, course) {
  const validCourse = extractValidFields(course, CourseSchema);
  const [result] = await mysqlPool.query(
    "UPDATE courses SET ? WHERE id = ?",
    [ validCourse, id ]
  );
  return result.affectedRows > 0;
};

exports.deleteCourseById = async function(id) {
  const [ result ] = await mysqlPool.query(
      "DELETE  FROM `courses` WHERE `id` = ?",
      [ id ]
      //'INSERT INTO courses (id, subject, number, title, term, instructorId) VALUES (2, "CS", 493, "test course", "fall", 2)'
  );
  return result.affectedRows > 0;
}

 exports.getStudentsIdByCourseId = async function(id) {
  const [ results ] = await mysqlPool.query(
    "SELECT studentId FROM `student_courses` WHERE `courseId` = ?",
    [ id ]
  );
    return results;
}
exports.getStudentsByCourseId = async function(id) {
  const [ result ] = await mysqlPool.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [id]
  );
  return result[0];
}
exports.getInstructorIdByCourseId = async function(id) {
  const [ result ] = await mysqlPool.query(
    "SELECT instructorId FROM `courses` WHERE `id` = ?",
    [id]
  );
  return result[0];
}

exports.updateEnrollmentById = async function(id, add){
  console.log(add);
  const results = new Array();
  if (add){
    var i;
    for (i = 0; i < add.length; i++){
      const [result] = await mysqlPool.query(
        "INSERT INTO student_courses (courseId, studentId) VALUES (?, ?)",
        [id, add[i]]
      );
      results.push(result.insertId>0);
    }
    return results;
  }

}

exports.updateUnenrollmentById = async function(id, remove){
  console.log(remove);
  const results = new Array();
  if (remove){
    var i;
    for (i = 0; i < remove.length; i++){
      const [result] = await mysqlPool.query(
        "DELETE FROM student_courses WHERE studentId = ?",
        [remove[i]]
      );
      results.push(result.affectedRows > 0);

    }
    return results;
  }
}
exports.getAssignmentsByCourseId = async function(id) {
  const [ results ] = await mysqlPool.query(
    "SELECT id FROM assignments WHERE courseId = ?",
    [id]
  );
  return results;
}

exports.getCoursesForStudentById = async function(id) {
  const [results] = await mysqlPool.query(
    "SELECT courseId FROM student_courses WHERE studentId = ?",
    [id]
  );
  return results;
}

exports.getCoursesForInstructorById = async function(id) {
  const [results] = await mysqlPool.query(
    "SELECT id FROM courses WHERE instructorId = ?",
    [id]
  );
  return results;
}