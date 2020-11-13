const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth-user");
const { asyncHandler } = require("../middleware/helperFunctions");
//UsersFunction
const { getAuthenticatedUser, createUser } = require("../middleware/usersFuncitons");

//Gets a user
router.get("/", authenticateUser, asyncHandler(getAuthenticatedUser));

//Creates a user
router.post("/", asyncHandler(createUser));

//Export users router
module.exports = router;
  