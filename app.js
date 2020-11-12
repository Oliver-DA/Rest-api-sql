'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require("./db");

//load routes
const mainRoute = require("./routes");
const usersRoute = require("./routes/users");
const coursesRoute = require("./routes/courses");

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();
app.use(express.json());


//Authenticate the conecction for sequelize

(async () => {

  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the data base")

  }catch(error) {
    console.log("There was an error connecting to the data base")
  }

})();


(async () => {

  try {
    await sequelize.sync()
    console.log("Models successfully synchronize")

  }catch(error) {
    console.log("There was an error synchronizing the models to the data base")
  }

})();

//Routes
app.use(mainRoute);
app.use("/api/users", usersRoute);
app.use("/api/courses", coursesRoute)

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
