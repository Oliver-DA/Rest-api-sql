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

    let emailAddress = req.body.emailAddress || null;
    let emailValidation = await User.findOne({ where: { emailAddress} })

    if (emailValidation) {
        res.status(400).json({ message: "This email address is already in use" });

    } else {
        req.body.password = req.body.password ? bcrypt.hashSync(req.body.password, 10): null;
        await User.create(req.body)
        res.status(201).location("/").end();
    }
}


module.exports = { getAuthenticatedUser, createUser }