const { Course, User } = require("../db").models;
//HelperFunction
const { updateOrdeleteCourse } = require('./helperFunctions');

//Return a list of all the courses an user that own's them
const getAllCourses = async (req, res) => {

    const courses = await Course.findAll({
        include: {
            model: User,
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
        include: {
            model: User,
            attributes: ["firstName", "lastName", "emailAddress"]
        },
        attributes: { exclude: ["createdAt", "updatedAt"] }
    });

    if (course) {
        res.json(course);
    } else {
        res.status(404).json({ message: "Course not found" });
    }

};

//Creates a course
const createCourse = async (req, res) => {
    const newCourse = await Course.create(req.body)
    res.status(201).location(`/api/courses/${newCourse.id}`).end();
};

//Update a specific course
const updateCourse = async (req, res) => {
    const { id } = req.params;
    await updateOrdeleteCourse(req, res, id);
};

//Deletes a specific course
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    await updateOrdeleteCourse(req, res, id, "destroy");
};

//Export Courses Functions
module.exports = { getAllCourses, getOneCourse, createCourse, updateCourse, deleteCourse }