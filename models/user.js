// Schema and DB interactions for an User object

const bcrypt = require("bcryptjs");

const mysqlPool = require("../lib/mysqlPool");
const { extractValidFields } = require("../lib/validation");

// this is the data in the DB
const UserSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: false }
};
exports.UserSchema = UserSchema;

// this is what we are expected for POST /users/login
const UserLoginSchema = {
    email: { required: true },
    password: { required: true}
};
exports.UserLoginSchema = UserLoginSchema;