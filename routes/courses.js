const express = require("express");
const course = require("../db/models/course");
const { authenticateUser } = require("../middleware/auth-user");
const { asyncHandler } = require("../middleware/asyncHandler");
const router = express.Router();
const { Course, User } = require("../db").models


router.get("/", async (req, res) => {
    //returns a list of courses including the users that owns it
    const courses = await Course.findAll({ include:User});
    res.json({ courses })
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    //return a especific course
    const course = await Course.findOne({
        where: {
            id:id
        },
        include:User
    });

    if (course ) {
        res.json(course)
    } else {
        res.status(404).json({ message: "Course not found"})
    }
})

router.post("/", authenticateUser, asyncHandler(async (req, res) => {
    //creates a new course 

    try {
        const newCouse = await Course.create(req.body)
        res.json({ newCouse })

    }catch(error) {
        
        if (error.name == "SequelizeValidationError" || error.name == "SequelizeUniqueConstraintError") {
            const errors = error.errors.map(e => e.message);
            res.status(400).json({ errors })
        } else {
            throw error
        }
    }
}));

router.put("/:id", authenticateUser, asyncHandler( async (req, res) => {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    try {

        if (course) {

            await course.update(req.body)
            res.json({ course })
            
        } else {
            res.status(404).json({ message: "Course not found"})
        }

    }catch(error) {
        
        if (error.name == "SequelizeValidationError") {
            const errors = error.errors.map(e => e.message);
            res.status(400).json({ errors })
            
        } else {
            throw error
        }
    }
}));

router.delete("/:id",authenticateUser, asyncHandler(async (req, res) => {
    //Deltes a course
    const { id } = req.params;
    const courseToDelete = await Course.findByPk(id);

    if (courseToDelete) {
        
        await courseToDelete.destroy()
        res.end()

    } else {
        res.status(404).json({ message: "Course not found"})
    }
}));

module.exports = router