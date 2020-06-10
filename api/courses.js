// Routes for /courses
const bcrypt = require("bcryptjs");

const { CourseSchema,
      createCourse,
      getCourseById,
      updatecourseById,
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
router.post("/", requireAuthentication, async (req, res) => {
  if (req.role == "admin") {
    try {
      if (validateAgainstSchema(req.body, CourseSchema)) {
        const id = await createCourse(req.body);
        res.status(201).send({
          id: id
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: "Invalid request body"
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to create a course"
    });
  }
});

// Fetch data about a specific Course
router.get("/:id", async (req, res, next) => {
  try {
    const course = await getCourseById(parseInt(req.params.id));
    
    if (course) {
      res.status(200).send({ course: course })
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({
      error: "Could not find specified course"
    });
  }
});

// Update data for a specific Course
router.patch("/:id", requireAuthentication, async (req, res) => {
  if (req.role == "admin") {
    try {
      const success = await updateCourseById(parseInt(req.params.id));
      if (success) {
        res.status(200).send();
      } else {
        res.status(400).send({
          error: "The request body was invalid for updating course info, or the course could not be found"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to update data for this course"
      });
    }

  } else if (req.role == "instructor") {
    try {
      const instructorId = await getInstructorIdByCourseId(parseInt(req.params.id));
      if (typeof instructorId !== 'undefined') {
        if (req.user == instructorId.instructorId) {
          const success = await updateCourseById(parseInt(req.params.id));
          if (success) {
            res.status(200).send()
          } else {
            res.status(400).send({
              error: "Th request body was invalid for updating course info"
            });
          } 
        } else {
          res.status(403).send({
            error: "Unauthorized to update course info"
          });
        }
      } else {
        res.status(404).send({
          error: "The course could not be found or there is no associated instructor with it"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to update data for this course"
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to update data on this course"
    });
  }
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
    try {
      const instructorId = await getInstructorIdByCourseId(parseInt(req.params.id));
      if (typeof instructorId !== 'undefined') {
        if (req.user == instructorId.instructorId) {
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
  console.log(req.role);
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
            error: "Unauthorized to fetch list for this course"
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
        error: "Unable to fetch list of students for this course"
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to fetch list for this course"
    });
  }
});

// Fetch a CSV file containing list of the students enrolled in the Course
router.get("/:id/roster", requireAuthentication, async (req, res, next) => {
  if (req.role == "admin"){
    try {
      const ids = await getStudentsIdByCourseId(parseInt(req.params.id));
      var csvData = "id, name, email \r\n";
      var i;
      for (i = 0; i < ids.length; i++) {
        const student = await getStudentsByCourseId(ids[i].studentId);
        csvData = csvData.concat(`${student.id}, "${student.name}", ${student.email}\r\n`);
      }
      console.log(csvData);
      if (csvData) {
        res.setHeader('Content-Type', 'text/csv');
        res.status(200).send(csvData);
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
          var csvData = "id, name, email \r\n";
          var i;
          for (i = 0; i < ids.length; i++) {
            const student = await getStudentsByCourseId(ids[i].studentId);
            csvData = csvData.concat(`${student.id}, "${student.name}", ${student.email}\r\n`);
          }
          console.log(csvData);
          if (csvData) {
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).send(csvData);
          } else {
            res.status(404).send({
              error: "Course not found"
            });
          }
      } else {
        res.status(404).send({
          error: "Course not found"
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
      error: "Unable to fetch list of students for this course"
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
    if (ids) {
      res.status(200).send({
        assignments: ids
      });
    }
    else {
      res.status(404).send({
        error: "Course not found"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({
      error: "Course not found"
    });
  }
});

module.exports = router;
