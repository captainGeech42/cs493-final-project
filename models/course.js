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