const { Course, User } = require("../db").models;

//Return a list of all the courses an user that own's them
const getAllCourses = async (req, res) => {

    const courses = await Course.findAll({
        include:{
            model:User,
            attributes: ["firstName", "lastName", "emailAddress"]
        },
        attributes: { exclude: ["createdAt", "updatedAt"] }
    });
    res.json({ courses })

};

//Returns a especific course
const getOneCourse = async (req, res) => {

    const { id } = req.params
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
};


//Creates a course
const createCourse = async (req, res) => {
    
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
};

//Update a specific course
const updateCourse = async (req, res) => {

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
};

//Deletes a specific course
const deleteCourse = async (req, res) => {

    const { id } = req.params;
    const courseToDelete = await Course.findByPk(id);

    if (courseToDelete) {

        if (courseToDelete.userId == req.currentUser.id) {
                
            await courseToDelete.destroy(req.body)
            res.status(204).json({ message: "Course deleted" })
            
        } else {
            res.status(403).json({ message:"You can't delete a course that wasn't created by you"})
        }
        
    } else {
        res.status(404).json({ message: "Course not found"})
    }
}

module.exports = { getAllCourses, getOneCourse, createCourse, updateCourse, deleteCourse}