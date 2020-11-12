const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();;
const { User } = require("../db").models;
const { asyncHandler } = require("../middleware/asyncHandler")
const { authenticateUser } = require("../middleware/auth-user")


router.get("/", authenticateUser, asyncHandler( async (req, res) => {
    //Retunrs the currently authenticated user
    const user = await User.findOne({
        where:{
            emailAddress:req.currentUser.emailAddress
        },
        attributes: ["firstName", "lastName", "emailAddress"]
    })

    res.json({ message:"Access granted", user })
}));
  
router.post("/", asyncHandler( async (req, res) => {
    //creates a new user sets the location header to "/" and returns no content
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


}));

module.exports = router
  