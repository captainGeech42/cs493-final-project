// Routes for /courses
const bcrypt = require("bcryptjs");
const fs = require("fs");

const { CourseSchema,
      createCourse,
      getAllCourses000,
      getAllCourses001,
      getAllCourses010,
      getAllCourses100,
      getAllCourses101,
      getAllCourses110,
      getAllCourses011,
      getAllCourses111,
      getCourseById,
      updateCourseById,
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
  //setting all query params
  var page = 1;
  var subject = '';
  var num = '';
  var term = '';
  if(req.query.page) {
    page = parseInt(req.query.page);
  }
  if(req.query.subject) {
    subject = req.query.subject;
  }
  if(req.query.number) {
    num = parseInt(req.query.number);
  }
  if(req.query.term) {
    term = req.query.term;
  }
  //query now that we have all the params needed
  //NOTE: I'm sure there is a better way to do this but I could not figure it out
  //Hence, bruteforcing 8 different query functions
  //const values must be instantiated when declared and the try-catch would get an error...
  //...when referencing the const courses, which is why the pagination code is duplicated inside every if-else clause
  //Also, pagination could not be placed into a separate function because it must return multiple values and javascript...
  //...cannot return multiple values from a function except from when returning a list/array
  try {
    if (subject == '' && num == '' && term == '') {
      const courses = await getAllCourses000();
      var numPerPage = 5;
      var lastPage = Math.ceil(courses.length / numPerPage);
      page = page < 1 ? 1 : page;
      page = page > lastPage ? lastPage : page;
      var start = (page - 1) * numPerPage;
      var end = start + numPerPage;
      var pagecourse = courses.slice(start, end);
      var links = {};
      if (page < lastPage) {
        links.nextPage = '/submissions?page=' + (page + 1);
        links.lastPage = '/submissions?page=' + lastPage;
      }
      if (page > 1) {
        links.prevPage = '/submissions?page=' + (page - 1);
        links.firstPage = '/submissions?page=1';
      }
      res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: courses.length,
        courses: pagecourse,
        links: links
      });
    } else if (subject == '' && num == '') {
      const courses = await getAllCourses001(term);
      var numPerPage = 5;
      var lastPage = Math.ceil(courses.length / numPerPage);
      page = page < 1 ? 1 : page;
      page = page > lastPage ? lastPage : page;
      var start = (page - 1) * numPerPage;
      var end = start + numPerPage;
      var pagecourse = courses.slice(start, end);
      var links = {};
      if (page < lastPage) {
        links.nextPage = '/submissions?page=' + (page + 1);
        links.lastPage = '/submissions?page=' + lastPage;
      }
      if (page > 1) {
        links.prevPage = '/submissions?page=' + (page - 1);
        links.firstPage = '/submissions?page=1';
      }
      res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: courses.length,
        courses: pagecourse,
        links: links
      });
    } else if (subject == '' && term == '') {
      const courses = await getAllCourses010(num);
      var numPerPage = 5;
      var lastPage = Math.ceil(courses.length / numPerPage);
      page = page < 1 ? 1 : page;
      page = page > lastPage ? lastPage : page;
      var start = (page - 1) * numPerPage;
      var end = start + numPerPage;
      var pagecourse = courses.slice(start, end);
      var links = {};
      if (page < lastPage) {
        links.nextPage = '/submissions?page=' + (page + 1);
        links.lastPage = '/submissions?page=' + lastPage;
      }
      if (page > 1) {
        links.prevPage = '/submissions?page=' + (page - 1);
        links.firstPage = '/submissions?page=1';
      }
      res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: courses.length,
        courses: pagecourse,
        links: links
      });
    } else if (num == '' && term == '') {
      const courses = await getAllCourses100(subject);
      var numPerPage = 5;
      var lastPage = Math.ceil(courses.length / numPerPage);
      page = page < 1 ? 1 : page;
      page = page > lastPage ? lastPage : page;
      var start = (page - 1) * numPerPage;
      var end = start + numPerPage;
      var pagecourse = courses.slice(start, end);
      var links = {};
      if (page < lastPage) {
        links.nextPage = '/submissions?page=' + (page + 1);
        links.lastPage = '/submissions?page=' + lastPage;
      }
      if (page > 1) {
        links.prevPage = '/submissions?page=' + (page - 1);
        links.firstPage = '/submissions?page=1';
      }
      res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: courses.length,
        courses: pagecourse,
        links: links
      });
    } else if (num == '') {
      const courses = await getAllCourses101(subject, term);
      var numPerPage = 5;
      var lastPage = Math.ceil(courses.length / numPerPage);
      page = page < 1 ? 1 : page;
      page = page > lastPage ? lastPage : page;
      var start = (page - 1) * numPerPage;
      var end = start + numPerPage;
      var pagecourse = courses.slice(start, end);
      var links = {};
      if (page < lastPage) {
        links.nextPage = '/submissions?page=' + (page + 1);
        links.lastPage = '/submissions?page=' + lastPage;
      }
      if (page > 1) {
        links.prevPage = '/submissions?page=' + (page - 1);
        links.firstPage = '/submissions?page=1';
      }
      res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: courses.length,
        courses: pagecourse,
        links: links
      });
    } else if (term == '') {
      const courses = await getAllCourses110(subject, num);
      var numPerPage = 5;
      var lastPage = Math.ceil(courses.length / numPerPage);
      page = page < 1 ? 1 : page;
      page = page > lastPage ? lastPage : page;
      var start = (page - 1) * numPerPage;
      var end = start + numPerPage;
      var pagecourse = courses.slice(start, end);
      var links = {};
      if (page < lastPage) {
        links.nextPage = '/submissions?page=' + (page + 1);
        links.lastPage = '/submissions?page=' + lastPage;
      }
      if (page > 1) {
        links.prevPage = '/submissions?page=' + (page - 1);
        links.firstPage = '/submissions?page=1';
      }
      res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: courses.length,
        courses: pagecourse,
        links: links
      });
    } else if (subject == '') {
      const courses = await getAllCourses011(num, term);
      var numPerPage = 5;
      var lastPage = Math.ceil(courses.length / numPerPage);
      page = page < 1 ? 1 : page;
      page = page > lastPage ? lastPage : page;
      var start = (page - 1) * numPerPage;
      var end = start + numPerPage;
      var pagecourse = courses.slice(start, end);
      var links = {};
      if (page < lastPage) {
        links.nextPage = '/submissions?page=' + (page + 1);
        links.lastPage = '/submissions?page=' + lastPage;
      }
      if (page > 1) {
        links.prevPage = '/submissions?page=' + (page - 1);
        links.firstPage = '/submissions?page=1';
      }
      res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: courses.length,
        courses: pagecourse,
        links: links
      });
    } else {
      const courses = await getAllCourses111(subject, num, term);
      var numPerPage = 5;
      var lastPage = Math.ceil(courses.length / numPerPage);
      page = page < 1 ? 1 : page;
      page = page > lastPage ? lastPage : page;
      var start = (page - 1) * numPerPage;
      var end = start + numPerPage;
      var pagecourse = courses.slice(start, end);
      var links = {};
      if (page < lastPage) {
        links.nextPage = '/submissions?page=' + (page + 1);
        links.lastPage = '/submissions?page=' + lastPage;
      }
      if (page > 1) {
        links.prevPage = '/submissions?page=' + (page - 1);
        links.firstPage = '/submissions?page=1';
      }
      res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: courses.length,
        courses: pagecourse,
        links: links
      });
    } 
  } catch (err) {
    res.status(500).send({
      error: "Error fetching course list"
    });
  }
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
router.patch("/:id", requireAuthentication, async (req, res, next) => {
  if (req.role == "admin") {
    try {
      if (validateAgainstSchema(req.body, CourseSchema)) {
        const success = await updateCourseById(parseInt(req.params.id), req.body);
        if (success) {
          res.status(200).send();
        } else {
          next();
        }        
      } else {
      res.status(403).send({
        error: "Invalid request body"
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
          if (validateAgainstSchema(req.body, CourseSchema)) {
            const success = await updateCourseById(parseInt(req.params.id), req.body);
            if (success) {
              res.status(200).send()
            } else {
              res.status(500).send({
              error: "Could not update course info"
              });
            } 
          } else {
            res.status(403).send({
              error: "Invalid request body"
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
