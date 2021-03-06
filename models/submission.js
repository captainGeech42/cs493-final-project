// Schema and DB interactions for an Submission object

const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');

const SubmissionSchema = {
    assignmentId: { required: true },
    studentId: { required: true },
    timestamp: { required: true },
    file: { required: true } // maybe just base64 the file submission and stick it here? not sure the best mysql type for this
};
exports.SubmissionSchema = SubmissionSchema;