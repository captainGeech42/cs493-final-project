// Routes for /courses
const bcrypt = require("bcryptjs");

const { CourseSchema,
      deleteCourseById,
      getStudentsByCourseid,
      getStudentsIdByCourseId,
      getInstructorIdByCourseId,
      updateEnrollmentById,
      updateUnenrollmentById} = require("../models/course");

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
      const success = await deleteCourseById(parseInt(req.params.id));
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
    res.status(403).send({
      error: "Unauthorized to delete course"
    });
  }

});

// Fetch a list of the students enrolled in the Course
router.get("/:id/students", requireAuthentication, async (req, res, next) => {
  if (req.role == "admin"){
    try {
      const success = await getStudentsIdByCourseId(parseInt(req.params.id));
      if (success) {
        res.status(200).send({
          students: success
        });
      } else {
        res.status(404).send({
          error: "Course not found"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to fetch list of students for this course"
      });
    }
  } else if (req.role == "instructor") {
    const instructorId = getInstructorIdByCourseId(id);
    console.log(instructorId);
    if (req.user == instructorId) {
      try {
        const success = await getStudentsIdByCourseId(parseInt(req.params.id));
        if (success) {
          res.status(200).send({
            students: success
          });
        } else {
          res.status(404).send({
            error: "Course not found"
          });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send({
          error: "Unable to fetch list of students for this course"
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to fetch list for this course"
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to fetch list for this course"
    });
  }
});

// Update enrollment for a Course
router.post("/:id/students", requireAuthentication, async (req, res, next) => {
  const add = req.body.add;
  const remove = req.body.remove;
  console.log(req.role);
  if (req.role == "admin"){
    try {
      const deleteSuccess = await updateUnenrollmentById(parseInt(req.params.id), remove);
      const insertSuccess = await updateEnrollmentById(parseInt(req.params.id), add);
      if ( insertSuccess && deleteSuccess) {
        res.status(200).send({
          success: "Successfule Enrollment/Unenrollment"
        });
      } else {
        res.status(404).send({
          error: "Course not found"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to add/delete students for this course"
      });
    }
  } else if (req.role == "instructor") {
    const instructorId = getInstructorIdByCourseId(id);
    console.log(instructorId);
    if (req.user == instructorId) {
      try {
        const deleteSuccess = await updateUnenrollmentById(parseInt(req.params.id), remove);
        const insertSuccess = await updateEnrollmentById(parseInt(req.params.id), add);
        if ( insertSuccess && deleteSuccess) {
          res.status(200).send({
            success: "Successfule Enrollment/Unenrollment"
          });
        } else {
          res.status(404).send({
            error: "Course not found"
          });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send({
          error: "Unable to fetch list of students for this course"
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to fetch list for this course"
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to fetch list for this course"
    });
  }
});

// Fetch a CSV file containing list of the students enrolled in the Course
router.get("/:id/roster", async (req, res, next) => {

});

// Fetch a list of the Assignments for the Course
router.get("/:id/assignments", async (req, res, next) => {

});

module.exports = router;
