/*
 * JSON Web Token Config
 * =====================
 *
 * This script file defines the configuration for
 * how the backend assigns a web token to a user
 * who successfully authenticates their login
 * credentials with the database.
 *
 * Authors: Jose Luis, Jorge B. Nunez
 */


// Module imports.
// This script depends on some Passport functions.
// Likewise, it conforms to the user model and
// utilizes the database "secret" string.
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');


// Honestly this shit's kinda confusing.
// We just did it the way the video playlist did it.
module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserById(jwt_payload.data._id, (err, user) => {
      if(err){
        return done(err, false);
      }
      if(user){
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}
