// Routes for /courses
const bcrypt = require("bcryptjs");

const { CourseSchema,
      deleteCourseById,
      getStudentsByCourseid,
      getStudentsIdByCourseId,
      getInstructorIdByCourseId} = require("../models/course");

const { validateAgainstSchema } = require("../lib/validation");
const { generateAuthToken, requireAuthentication, parseAuthToken } = require("../lib/auth");
const router = require("express").Router();

// Fetch the list of all Courses
router.get("/", async (req, res) => {

});

// Create a new course
router.post("/", async (req, res) => {

});

// Fetch data about a specific Course
router.get("/:id", async (req, res, next) => {

});

// Update data for a specific Course
router.patch("/:id", async (req, res, next) => {

});

// Remove a specific Course from the database
router.delete("/:id", requireAuthentication, async (req, res, next) => {
  if (req.role == "admin"){
    try {
      const success = await deleteCourseById(paresInt(req.params.id));
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).send({
          error: "Course not found"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to delete course"
      });
    }
  } else {
    res.send(403).send({
      error: "Unauthorized to delete course"
    });
  }

});

// Fetch a list of the students enrolled in the Course
router.get("/:id/students", async (req, res, next) => {

});

// Update enrollment for a Course
router.post("/:id/students", async (req, res, next) => {

});

// Fetch a CSV file containing list of the students enrolled in the Course
router.get("/:id/roster", async (req, res, next) => {

});

// Fetch a list of the Assignments for the Course
router.get("/:id/assignments", async (req, res, next) => {

});

module.exports = router;
