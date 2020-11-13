const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User } = require("../db").models;

exports.authenticateUser = async (req, res, next) => {
    let message;
    //Credentials is an object with a name key and a pass key containing
    //The username and password typed on the fields with basic-auth
    const credentials = auth(req)
    
    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name }});

        if (user) {
            //Compare the password provided by the user with the  password
            //on the database using bcrypt
            const authenticated = bcrypt
            .compareSync(credentials.pass, user.password)

            if (authenticated) {
                //Add the authenticated user to the request body as currentUser
                req.currentUser = user

            } else {
                message = "Incorrect password";
            }

        } else {
            message = "Authentication falied";
        }

    } else {
        message = "Auth header not found";
    }

    if (message) {
        res.status(401).json({ status: "Access denied", message });
        
    } else {
        next();
    }
}
