// Routes for /assignments

const router = require("express").Router();
const {insertNewAssignment, AssignmentSchema, GetAssignementbyId, replaceAssignmentById,deleteAssignmentById} = require('../models/assignment');
const { validateAgainstSchema } = require('../lib/validation');
// Create a new Assignment
router.post("/", async (req, res, next) => {
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

});

// Create a new Submission for an Assignment
router.post("/:id/submissions", async (req, res, next) => {

});

module.exports = router;
