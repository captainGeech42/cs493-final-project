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
    "SELECT studentId FROM `student_courses` WHERE `courseId` = ?",
    [ id ]
  );
    return results;
}

exports.getStudentsByCourseid = async function(id) {
  const list = await getStudentsIdByCourseId(id);
  idList = list.studentId;
  console.log(studentId)
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
      results.push(result.insertId);
    }
    console.log(results);
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
      results.push(result.affectedRows);

    }
    console.log(results);
    return results;
  }

}
