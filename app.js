/*
 * Main Backend Script
 * ===================
 *
 * This script serves as the "main" script file
 * for initiating the Express backend and its
 * components. Think of this as the spinal cord
 * of the web app.
 *
 * Authors: Jose Luis, Jorge B. Nunez
 */


// Module imports.
//   Express runs as a web server instance.
//   HTTPS provides SSL security.
//   FS provides some file system utilities.
//   Path also provides file system utilities.
//   Body-Parser handles HTTP request bodies.
//   CORS faciliates cross-origin HTTP requests.
//   Passport provides web token functionality.
//   Mongoose simplifies database interactions.
//   Config defines the database doc format.
//   Users defines backend routes.
const express    = require('express');
const https      = require('https');
const fs         = require('fs');
const path       = require('path');
const bodyParser = require('body-parser');
const cors       = require('cors');
const passport   = require('passport');
const mongoose   = require('mongoose');
const config     = require('./config/database');
const users      = require('./routes/users');
const events     = require('./routes/events');


// Database initialization.
// Will refactor later.
// (2019-03-04, 12:39 p.m., JBN)
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to the database ' + config.database);
});
mongoose.connection.on('error', (err) => {
  console.log('DB Error: ' + err);
});


// Backend initialization and definition.
const app = express();                  // Initialize Express
const port = 3000;                      // Define port to listen on.
app.use(cors());                        // Initialize CORS
app.use(bodyParser.json());             // Initialize Body Parser
app.use(passport.initialize());         // Initialize Passport (1)
app.use(passport.session());            // Initialize Passport (2)
require('./config/passport')(passport); // Initialize Passport (3)
app.use('/users', users);               // Initialize router.
app.use('/events', events);


// Point to Angular component.
app.use(express.static(path.join(__dirname, 'frontend')));


// Implicitly deny access to root endpoint.
app.get('/', (req, res) => {
  res.send("invalid endpoint")
});


// Finally, start the server.
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(port, () => {
  console.log("HTTPS server started on port " + port);
});
