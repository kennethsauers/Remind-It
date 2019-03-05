/*
 * Contact Database Document Model (Legacy)
 * ========================================
 *
 * An artifact from the previous authentication
 * model set, where we'd store these "contact"
 * objects in a JSON array within the user object
 * model.
 *
 * Now, we'll instead keep the user model separate
 * from the event model, and we can use this as a
 * baseline for determining how.
 *
 * Authors: Jose Luis, Jorge B. Nunez
 */


// Module imports.
// We need Mongoose to define the document schema.
const mongoose = require('mongoose');


// Define the contact schema.
// We give the object a first name field, a last
// name field, an email, a mobile phone number,
// a home phone, and an address.
const ContactSchema = mongoose.Schema({
  firstname:
  {
    type: String,
    required: true
  },
  lastname:
  {
      type: String
  },
  email:
  {
    type: String
  },
  mobile_phone:
  {
    type: String
  },
  home_phone:
  {
    type: String
  },
  address:
  {
    type: String
  }
});


// We export this module.
// This allows us to define arrays that contain
// this kind of object in other schemas, like the
// old user schema for the contact manager.
module.exports = ContactSchema;
