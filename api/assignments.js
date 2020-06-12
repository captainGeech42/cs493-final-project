// Routes for /assignments

const router = require("express").Router();
const {insertNewAssignment, AssignmentSchema, GetAssignementbyId, replaceAssignmentById,deleteAssignmentById, uploadSubmissionById, SubmissionSchema, getSubmissions, GetAssignements} = require('../models/assignment');
const { validateAgainstSchema } = require('../lib/validation');
const multer = require('multer');
//const {}
const crypto = require('crypto');
const fs = require('fs');
const {requireAuthentication} = require('../lib/auth');
const imageTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/pdf': 'pdf',
  'image/doc': 'doc'
};

const upload = multer({
  // dest: `${__dirname}/uploads`
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      const filename = crypto.pseudoRandomBytes(16).toString('hex');
      const extension = imageTypes[file.mimetype];
      callback(null, `${filename}.${extension}`);
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!imageTypes[file.mimetype]);
  }
});




// Create a new Assignment
router.post("/", requireAuthentication, async (req, res, next) => {
  var str1 = 'admin';
  var str2 = 'instructor';
  var str3 = req.role

  if(str1 == str3|| str2 == str3){
    console.log("sucess auth");
  }
  else{
    res.status(403).send({
      err: 'not an admin or instructor'
    });
  }
  console.log(req.role);
  console.log("  -- req.body:", req.body);
  if (validateAgainstSchema(req.body, AssignmentSchema)) {
   try {
     const id = await insertNewAssignment(req.body);
     res.status(201).send({
       id: id
     });
   } catch (err) {
      console.error(" -- error:", err);
      res.status(500).send({
        error: "Error inserting assignment into DB.  Try again later."
      });
    }
  } else {
    res.status(400).send({
      err: "Request body does not contain a valid assignment."
    });
  }
});

//get all assignments
router.get("/", async (req, res, next) => {
  var str1 = 'admin';
  var str2 = 'instructor';
  var str3 = req.role

  if(str1 == str3|| str2 == str3){
    console.log("sucess auth");
  }
  else{
    res.status(403).send({
      err: 'not an admin or instructor'
    });
  }

  try {
    const assignment = await GetAssignements();
    if (assignment) {
      res.status(200).send(assignment);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch assignment.  Please try again later."
    });
  }
});



// Fetch data about a specific Assignment
router.get("/:id", async (req, res, next) => {
  try {
    const assignment = await GetAssignementbyId(parseInt(req.params.id));
    if (assignment) {
      res.status(200).send(assignment);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch assignment.  Please try again later."
    });
  }

});

// Update data for a specific Assignment
router.patch("/:id", async (req, res, next) => {
  var str1 = 'admin';
  var str2 = 'instructor';
  var str3 = req.role

  if(str1 == str3|| str2 == str3){
    console.log("sucess auth");
  }
  else{
    res.status(403).send({
      err: 'not an admin or instructor'
    });
  }
  if (validateAgainstSchema(req.body,AssignmentSchema)) {
    try {
      const id = parseInt(req.params.id)
      const updateSuccessful = await replaceAssignmentById(id, req.body);
      if (updateSuccessful) {
        res.status(200).send({
          links: {
            assignment: `/assignment/${id}`
          }
        });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to update specified assignment.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid assignment object"
    });
  }
});

// Remove a specific Assignment from the database
router.delete("/:id", async (req, res, next) => {
  var str1 = 'admin';
  var str2 = 'instructor';
  var str3 = req.role

  if(str1 == str3|| str2 == str3){
    console.log("sucess auth");
  }
  else{
    res.status(403).send({
      err: 'not an admin or instructor'
    });
  }
  try {
    const deleteSuccessful = await deleteAssignmentById(parseInt(req.params.id));
    if (deleteSuccessful) {
      res.status(204).end();
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete business.  Please try again later."
    });
  }
});

// Fetch the list of all Submissions for an Assignment
router.get("/:id/submissions", async (req, res, next) => {
  //var str1 = 'admin';
  //var str2 = 'instructor';
//  var str3 = req.body.role

//    console.log("sucess auth");
  //}
//  else{
///    res.status(403).send({
//      err: 'not an admin or instructor'
//    });
//  }

  const id = await getSubmissions(req.params.id);

  var page = parseInt(req.query.page) || 1;
	var numPerPage = 1;
	var lastPage = Math.ceil(id.length/ numPerPage);
	page = page < 1 ? 1 : page;
	page = page > lastPage ? lastPage : page;
	var start = (page - 1) * numPerPage;
	var end = start + numPerPage;
	var pagesub = id.slice(start, end);
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
	totalCount: id.length,
	submissionData: pagesub,
	links: links
});


  //res.status(200).send({
  //  id: id
  //});
});

// Create a new Submission for an Assignment
router.post("/:id/submissions", upload.single('file'), requireAuthentication, async (req, res) => {
  var str2 = 'student';
  var str3 = req.role

  if(str2 == str3){
    console.log("sucess auth");
  }
  else{
    res.status(403).send({
      err: 'not a student'
    });
  }


   try {
   const id = await uploadSubmissionById(req.body, req.params.id, req.file);
     res.status(201).send({
       id: id
     });
   } catch (err) {
      console.error(" -- error:", err);
      res.status(500).send({
        error: "Error inserting assignment into DB.  Try again later."
      });
    }
});

module.exports = router;
