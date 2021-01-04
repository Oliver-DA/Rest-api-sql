# rest-api-sql brief description
 -This project is a rest-api with no interface, it's recommended to use
 -*postman* which is a collaboration platform for API development
 -in order to test the routes but you can also use the *browser* 
 -or even a *Visual Studio Code* extension if you please. 

# how to start the app 
 -On your terminal => 
 -First run *npm install* to download the project dependencies.
 -Second use the command *npm run seed* to poblate the database with some provided data.
 -Lastly run *npm start* and your app is going to be listening on port *5000*.

 # routes availables on the app 
 -GET: */api/users* returns an authenticated user. `(requires authentication)`
 -POST: */api/users* creates a user.
 -GET: */api/courses* returns a list of all the courses.
 -POST: */api/courses* creates a course `(requires authentication)`
 -GET: */api/courses/:id* returns a specific course based on *id*.
 -PUT: */api/courses/:id* updates a course based on *id*. `(requires authentication)`
 -DELETE: */api/courses/:id* deletes a course based on *id*. `(requires authentication)`

 # how to stop the app 
 -ctrl + c on the terminal runnig the app 

