const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth-user");
const { asyncHandler } = require("../middleware/helperFunctions");
//Courses functions
const {
    getAllCourses,
    getOneCourse,
    createCourse,
    deleteCourse, 
    updateCourse } = require("../middleware/coursesFuntions");

//Returns a list of all courses and their users
router.get("/", asyncHandler(getAllCourses));

//Returns a especific course
router.get("/:id", asyncHandler(getOneCourse));

//Creates a new course
router.post("/", authenticateUser, asyncHandler(createCourse));

//Updates a specific course
router.put("/:id", authenticateUser, asyncHandler(updateCourse));

//Deletes a specific course
router.delete("/:id", authenticateUser, asyncHandler(deleteCourse));

//Exports courses router
module.exports = router;