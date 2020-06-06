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

exports.insertNewUser = async function(user) {
    const userToInsert = extractValidFields(user, UserSchema);
    userToInsert.password = await bcrypt.hash(userToInsert.password, 8);
    const [ result ] = await mysqlPool.query(
        "INSERT INTO `users` SET ?",
        [ userToInsert ]
    );
    return result.insertId;
}

exports.getUserByEmail = async function(email, includePassword = true) {
    const [ result ] = await mysqlPool.query(
        "SELECT * FROM `users` WHERE `email` = ?",
        [ email ]
    );

    const user = result[0];
    if (!user) return null;

    if (!includePassword) {
        delete user.password;
    }

    return user;
}

exports.getUserByID = async function(id, includePassword = true) {
    const [ result ] = await mysqlPool.query(
        "SELECT * FROM `users` WHERE `id` = ?",
        [ id ]
    );

    const user = result[0];
    if (!user) return null;

    if (!includePassword) {
        delete user.password;
    }

    return user;
}