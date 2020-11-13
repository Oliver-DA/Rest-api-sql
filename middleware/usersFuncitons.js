const { User } = require("../db").models;
const bcrypt = require("bcryptjs");

//Returns the current authenticated user
const getAuthenticatedUser =  async (req, res) => {

    const user = await User.findOne({
        where: {
            emailAddress: req.currentUser.emailAddress
        },
        attributes: ["firstName", "lastName", "emailAddress"]
    })
    res.json({ message:"Access granted", user });
};

//Creates a new User
const createUser = async (req, res) => {
    //If an email is provided in the request body assign it's value to emailAddress
    let emailAddress = req.body.emailAddress || null;
    //Try to find a user with the email provided to test if it already exist
    let emailValidation = await User.findOne({ where: { emailAddress} })

    if (emailValidation) {
        res.status(400).json({ message: "This email address is already in use" });

    } else {
        req.body.password = req.body.password ? bcrypt.hashSync(req.body.password, 10): null;
        await User.create(req.body)
        res.status(201).location("/").end();
    }
}

//Exporting User functions
module.exports = { getAuthenticatedUser, createUser }