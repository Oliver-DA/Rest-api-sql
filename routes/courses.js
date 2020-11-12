const express = require("express");
const course = require("../db/models/course");
const { authenticateUser } = require("../middleware/auth-user");
const { asyncHandler } = require("../middleware/asyncHandler");
const router = express.Router();
const { Course, User } = require("../db").models


router.get("/", async (req, res) => {
    //returns a list of courses including the users that owns it
    const courses = await Course.findAll({
        include:{
            model:User,
            attributes: ["firstName", "lastName", "emailAddress"]
        },
        attributes: { exclude: ["createdAt", "updatedAt"] }
    });
    res.json({ courses })
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    //return a especific course
    const course = await Course.findOne({
        where: { id },
        include:{
            model:User,
            attributes: ["firstName", "lastName", "emailAddress"]
        },
        attributes: { exclude: ["createdAt", "updatedAt"] }
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
        res.status(201).json({ newCouse })

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

            if (course.userId == req.currentUser.id) {
                
                await course.update(req.body)
                res.status(204).json({ course })
                
            } else {
                res.status(403).json({ message:"You can't edit a course that wasn't created by you"})
            }
            
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

        if (courseToDelete.userId == req.currentUser.id) {
                
            await courseToDelete.destroy(req.body)
            res.status(204).json({ message: "Course deleted" })
            
        } else {
            res.status(403).json({ message:"You can't delete a course that wasn't created by you"})
        }
        
        await courseToDelete.destroy()
        res.end()

    } else {
        res.status(404).json({ message: "Course not found"})
    }
}));

module.exports = router