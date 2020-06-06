// Routes for /assignments

const router = require("express").Router();

// Create a new Assignment
router.post("/", async (req, res) => {

});

// Fetch data about a specific Assignment
router.get("/:id", async (req, res, next) => {

});

// Update data for a specific Assignment
router.patch("/:id", async (req, res, next) => {

});

// Remove a specific Assignment from the database
router.delete("/:id", async (req, res, next) => {

});

// Fetch the list of all Submissions for an Assignment
router.get("/:id/submissions", async (req, res, next) => {

});

// Create a new Submission for an Assignment
router.post("/:id/submissions", async (req, res, next) => {

});