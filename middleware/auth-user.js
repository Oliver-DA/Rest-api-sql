const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User } = require("../db").models;


exports.authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req)
    
    if (credentials) {
        
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        })

        if (user) {
            const authenticated = bcrypt
            .compareSync(credentials.pass, user.password)

            if (authenticated) {
                req.currentUser = user
            } else {
                message = `Authentication successful for username: ${user.firstName}`;
            }

        } else {
            message = `Authentication falied:`
        }

    } else {
        message = "Auth header not found"
    }

    if (message) {
        console.warn(message)
        res.status(401).json({ message: "Access denied"})
    } else {
        next()
    }
}
