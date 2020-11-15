const { Course } = require("../db").models

exports.asyncHandler = (cb) => {
    return async (req, res, next) => {

        try {
            await cb(req, res, next)

        } catch(error) {

            if (error.name == "SequelizeValidationError") {
                const errors = error.errors.map(e => e.message);
                res.status(400).json({ errors })
                
            } else {
                next(error)
            }
        }
    }
};

//Handles both routes for update or delete a course based on the action argument
exports.updateOrdeleteCourse = async (req, res, id, action) => {

    let title = req.body.title || "";
    let description = req.body.description || "";
    
    const course = await Course.findByPk(id);
    let message = "Course not found";

    if (course) {

        if (course.userId == req.currentUser.id) {

            ( action == "destroy" ) ? await course.destroy() : await course.update({ title, description });
            res.status(204).end();
            
        } else {

            ( action == "destroy" )
            ? message = "You can't delete a course that wasn't created by you"
            : message = "You can't edit a course that wasn't created by you"
            res.status(403).json({ message });
        }
    } else {
        res.status(404).json({ message });
    }
};