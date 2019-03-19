/*
 * Event Database Model
 * ====================
 *
 * The event object unique to each user.
 *
 * More to explain later.
 * (JBN: 2019-03-19 @ 3:35 p.m.)
 *
 * Authors: Jose Luis, Jorge B. Nunez
 */

 const mongoose = require('mongoose');

// Defining the schema.
const EventSchema = mongoose.Schema({
  isPublic: {
    type: Boolean
  },
  creatorID: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  location: {
    type: Number
    // All JS numbers are 64-bit floats by design.
  },
  repeats: {
    type: Boolean
  },
  dueDate: {
    type: Number
  },
  completionMethod: {
    type: String
  }
});

const Event = module.exports = mongoose.model('Event', EventSchema);
