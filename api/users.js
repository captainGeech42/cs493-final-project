// Routes for /users

const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { UserSchema, UserLoginSchema, insertNewUser, getUserByEmail, getUserByID } = require("../models/user");

const { validateAgainstSchema } = require("../lib/validation");
const { generateAuthToken, requireAuthentication, parseAuthToken } = require("../lib/auth");

// Create a new User
router.post("/", async (req, res) => {
    try {
        if (validateAgainstSchema(req.body, UserSchema)) {
            // make sure role is valid
            if (!["admin", "instructor", "student"].includes(req.body.role)) {
                res.status(400).send({
                    error: "Invalid role specified"
                });
                return;
            }

            // make sure authed as admin if creating non-student
            if (req.body.role !== "student") {
                const jwt = parseAuthToken(req.get("Authorization"));
                if (jwt.role !== "admin") {
                    res.status(403).send({
                        error: "Not logged in as admin, unable to create instructor or admin user"
                    });
                    return;
                }
            }

            // check if email already exists
            const userExists = await getUserByEmail(req.body.email);
            if (userExists) {
                res.status(400).send({
                    error: "A user already exists with this email"
                });
                return;
            }

            // add the user
            const id = await insertNewUser(req.body);
            res.status(201).send({
                id: id
            });
        } else {
            res.status(400).send({
                error: "Request body does not contain a valid User."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Unable to register user. Please try again later."
        });
    }
});

// Log in a User
router.post("/login", async (req, res) => {
    try {
        if (validateAgainstSchema(req.body, UserLoginSchema)) {
            const user = await getUserByEmail(req.body.email);

            if (user && bcrypt.compare(req.body.password, user.password)) {
                // creds are valid, send JWT
                const token = generateAuthToken(user.id, user.role);
                res.status(200).send({
                    token: token
                });
            } else {
                // creds are invalid, send 401
                res.status(401).send({
                    error: "Invalid user credentials"
                });
            }
        } else {
            res.status(400).send({
                error: "Request body does not contain a valid User Login."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Unable to login user. Please try again later."
        });
    }
});

// Fetch data about a specific User
router.get("/:id", requireAuthentication, async (req, res, next) => {
    try {
        if (req.params.id != req.user) {
            res.status(403).send({
                error: "Unauthorized access to requested resource"
            });
            return;
        }

        const user = await getUserByID(req.params.id, false);

        // TODO: get courses for instructor and student users

        if (user) {
            res.status(200).send({ user: user });
        } else {
            next();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Unable to fetch user. Please try again later."
        });
    }
});

module.exports = router;
