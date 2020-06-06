// Schema and DB interactions for an Assignment object

const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');

const AssignmentSchema = {
    courseId: { required: true },
    title: { required: true },
    points: { required: true },
    due: { required: true },
};
exports.AssignmentSchema = AssignmentSchema;