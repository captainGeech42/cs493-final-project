// Routes for /courses
const bcrypt = require("bcryptjs");
const fs = require("fs");

const { CourseSchema,
      deleteCourseById,
      getStudentsByCourseId,
      getStudentsIdByCourseId,
      getInstructorIdByCourseId,
      updateEnrollmentById,
      updateUnenrollmentById,
      getAssignmentsByCourseId} = require("../models/course");

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
      if (success[0]) {
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
    try {
      const instructorId = await getInstructorIdByCourseId(parseInt(req.params.id));
      if (typeof instructorId !== 'undefined') {
        if (req.user == instructorId.instructorId) {
          const success = await getStudentsIdByCourseId(parseInt(req.params.id));
          if (success[0]) {
            res.status(200).send({
              students: success
            });
          } else {
            res.status(404).send({
              error: "Course not found"
            });
          }
        } else {
          res.status(403).send({
            error: "Unauthorized to fetch list for this course"
          });
        }
      } else {
        res.status(403).send({
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
});

// Update enrollment for a Course
router.post("/:id/students", requireAuthentication, async (req, res, next) => {
  const add = req.body.add;
  const remove = req.body.remove;
  if (req.body && req.body.add && req.body.remove) {

    if (req.role == "admin"){
      try {
        const deleteSuccess = await updateUnenrollmentById(parseInt(req.params.id), remove);
        const insertSuccess = await updateEnrollmentById(parseInt(req.params.id), add);
        console.log(insertSuccess, deleteSuccess);
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
      try {
        const instructorId = await getInstructorIdByCourseId(parseInt(req.params.id));
        if (typeof instructorId !== 'undefined') {
          if (req.user == instructorId.instructorId) {
            const deleteSuccess = await updateUnenrollmentById(parseInt(req.params.id), remove);
            const insertSuccess = await updateEnrollmentById(parseInt(req.params.id), add);
            console.log(insertSuccess, deleteSuccess);
            if ( insertSuccess && deleteSuccess) {
              res.status(200).send({
                success: "Successfule Enrollment/Unenrollment"
              });
            } else {
              res.status(404).send({
                error: "Course not found"
              });
            }
          } else {
            res.status(403).send({
              error: "Unauthorized to update list for this course"
            });
          }
        } else {
          res.status(404).send({
            error: "Course not found"
          });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send({
          error: "Unable to update list of students for this course"
        });
      }
    } else {
      res.status(403).send({
        error: "Unauthorized to update list for this course"
      });
    }
  } else {
    res.status(400).send({
      error: "invalid/missing fields"
    });
  }
});

// Fetch a CSV file containing list of the students enrolled in the Course
router.get("/:id/roster", requireAuthentication, async (req, res, next) => {
  if (req.role == "admin"){
    try {
      const ids = await getStudentsIdByCourseId(parseInt(req.params.id));

      if (ids[0]) {
        var csvData = "id, name, email \r\n";
        var i;
        for (i = 0; i < ids.length; i++) {
          const student = await getStudentsByCourseId(ids[i].studentId);
          csvData = csvData.concat(`${student.id}, "${student.name}", ${student.email}\r\n`);
        }
        fs.writeFile(`${__dirname}/roster.csv`, csvData, 'utf8', function (err,data) {
          if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
          } else{
            console.log('It\'s saved!');
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).sendFile(`${__dirname}/roster.csv`)
          }
        });
      } else {
        res.status(404).send({
          error: "Course not found"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to fetch roster for this course"
      });
    }
  } else if (req.role == "instructor") {
    try {
      const instructorId = await getInstructorIdByCourseId(parseInt(req.params.id));
      if (typeof instructorId !== 'undefined') {
        if (req.user == instructorId.instructorId) {
          const ids = await getStudentsIdByCourseId(parseInt(req.params.id));

          if (ids[0]) {
            var csvData = "id, name, email \r\n";
            var i;
            for (i = 0; i < ids.length; i++) {
              const student = await getStudentsByCourseId(ids[i].studentId);
              csvData = csvData.concat(`${student.id}, "${student.name}", ${student.email}\r\n`);
            }
            fs.writeFile(`${__dirname}/roster.csv`, csvData, 'utf8', function (err,data) {
              if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.');
              } else{
                console.log('It\'s saved!');
                res.setHeader('Content-Type', 'text/csv');
                res.status(200).sendFile(`${__dirname}/roster.csv`)
              }
            });
          } else {
            res.status(404).send({
              error: "Course not found"
            });
          }
      } else {
        res.status(404).send({
          error: "Not authorized to fetch csv list"
        });
      }
    } else {
      res.status(404).send({
        error: "Course not found"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Unable to fetch list"
    });
  }
  } else {
    res.status(403).send({
      error: "Unauthorized to fetch roster for this course"
    });
  }
});

// Fetch a list of the Assignments for the Course
router.get("/:id/assignments", async (req, res, next) => {
  try {
    const ids = await getAssignmentsByCourseId(parseInt(req.params.id));
    if (ids[0]) {
      res.status(200).send({
        assignments: ids
      });
    }
    else {
      res.status(404).send({
        error: "Assignments not found"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Unable to fetch assignments"
    });
  }
});

module.exports = router;
