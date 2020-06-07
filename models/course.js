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

exports.deleteCourseById = async function(id) {
  const [ result ] = await mysqlPool.query(
      "DELETE  FROM `courses` WHERE `id` = ?",
      [ id ]
  );
  return result.affectedRows > 0;
}

 exports.getStudentsIdByCourseId = async function(id) {
  const [ results ] = await mysqlPool.query(
      "SELECT studentId AS students FROM `student_courses` WHERE `courseId` = ?",
      [ id ]
    );
    return results;
}

exports.getStudentsByCourseid = async function(id) {
  const list = await getStudentsIdByCourseId(id);
  idList = list.students;
  const studentList = new Array();
  var i;
  for (i = 0; i < idList.length; i++){ // method to get info on each student
    const [ result ] = await mysqlPool.query(
      "SELECT id, name, email FROM `users` WHERE `id` = ?",
      [idList[i]]
    );
    studentList.push(result);                              //work in progress still need to look at how this is formatted
  }
  return studentList;
}
exports.getInstructorIdByCourseId = async function(id) {
  const [ result ] = await mysqlPool.query(
    "SELECT instructorId FROM `courses` WHERE `id` = ?",
    [id]
  );
  return result;
}
