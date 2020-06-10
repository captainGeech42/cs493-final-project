// Schema and DB interactions for an Assignment object

const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');

exports.AssignmentSchema = {
    courseId: { required: true },
    title: { required: true },
    points: { required: true },
    due: { required: true },
};
exports.SubmissionSchema ={
  //assignmentId: { required: true},
  studentId: { required: true},
  submittedTime : { required : true},
  AssignmentId: { required : true},
};

exports.insertNewAssignment = async function (assignment){
  const validatedAssignment = extractValidFields(
    assignment,
    exports.AssignmentSchema
  );
  const [results] = await mysqlPool.query(
    "INSERT INTO assignments SET ?",
    validatedAssignment
  );
  return results.insertId;
}

exports.GetAssignementbyId = async function (id) {
  const [ results ] = await mysqlPool.query(
    'SELECT * FROM assignments WHERE id = ?',
    [ id ]
  );
  return results[0];
}
exports.replaceAssignmentById = async function (id, assignment){
  assignment = extractValidFields(assignment, exports.AssignmentSchema);
  const [ result ] = await mysqlPool.query(
    'UPDATE assignments SET ? WHERE id = ?',
    [ assignment, id ]
  );
  return result.affectedRows > 0;

}
exports.deleteAssignmentById = async function(id){
  const [ result ] = await mysqlPool.query(
    'DELETE FROM assignments WHERE id = ?',
    [ id ]
  );
  return result.affectedRows > 0;
}

exports.uploadSubmissionById = async function (submission, id, file){
  const validatedAssignment = extractValidFields(
    submission,
   exports.SubmissionSchema
  );
  validatedAssignment.file = file;
  validatedAssignment.assignmentId = id;
  const [results] = await mysqlPool.query(
    "INSERT INTO submissions SET ?",
    validatedAssignment
  );
  return results.insertId;

}
