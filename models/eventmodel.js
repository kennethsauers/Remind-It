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
  userID: {
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
}, { collection: 'events' });

const Event = module.exports = mongoose.model('Event', EventSchema);

// CREATE: Generate and store a given event in the database.
module.exports.addEvent = function(newEvent, callback) {
  newEvent.save(callback);
}

// READ: Find an event by id wrapper
module.exports.getEventByID = function(id, callback) {
  Event.findById(id, callback);
}

// READ: Find subset of events by user id
module.exports.getEventsByUserID = function(userID, callback) {
  const query = { userID: userID };
  Event.find(query, callback);
}

// READ: Find all public events
module.exports.getPublicEvents = function(isPublic, callback) {
  const query = { isPublic: isPublic };
  Event.find(query, callback);
}
