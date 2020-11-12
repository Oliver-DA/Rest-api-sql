'use strict';

// load modules.
const express = require('express');
const morgan = require('morgan');
const { notFoundError, globalErrorHandler } = require("./middleware/errorHandlers");
const { sequelize } = require("./db");

//Require the main routes.
const mainRoute = require("./routes");
const usersRoute = require("./routes/users");
const coursesRoute = require("./routes/courses");

// variable to enable global error logging.

// create the Express app.
const app = express();
app.use(express.json());


//Authenticate the conecction for sequelize.
(async () => {

  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the data base")

  }catch(error) {
    console.log("There was an error connecting to the data base")
  }

})();

//Synchronizing the models with the database.
(async () => {

  try {
    await sequelize.sync()
    console.log("Models successfully synchronize")

  }catch(error) {
    console.log("There was an error synchronizing the models to the data base")
  }

})();

//Using the routes
app.use(mainRoute);
app.use("/api/users", usersRoute);
app.use("/api/courses", coursesRoute)

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// send 404 if no other route matched
app.use(notFoundError)

// setup a global error handler
app.use(globalErrorHandler)

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
