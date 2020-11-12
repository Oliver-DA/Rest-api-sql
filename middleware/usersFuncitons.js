const { User } = require("../db").models;
const bcrypt = require("bcryptjs");

//Returns the current authenticated user
const getAuthenticatedUser =  async (req, res) => {

    const user = await User.findOne({
        where:{
            emailAddress:req.currentUser.emailAddress
        },
        attributes: ["firstName", "lastName", "emailAddress"]
    })
    res.json({ message:"Access granted", user })
};

//Creates a new User
const createUser = async (req, res) => {
    let emailAddress = req.body.emailAddress || null;
    let emailValidation = await User.findOne({ where: { emailAddress }})

    if (emailValidation) {
        res.status(400).json({ message: "This email address is already in use" })

    } else {

        try {

            req.body.password = req.body.password ? bcrypt.hashSync(req.body.password, 10): null;
            const user = await User.create(req.body)
            res.json({ user })
    
        }catch(error) {
            
            if (error.name == "SequelizeValidationError" || error.name == "SequelizeUniqueConstraintError") {
                const errors = error.errors.map(e => e.message);
                res.status(400).json({ errors })
            } else {
                throw error
            }
        }
    }
}


module.exports = { getAuthenticatedUser, createUser }