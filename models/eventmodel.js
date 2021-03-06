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
  userID: {
    type: String
  },
  isPublic: {
    type: Boolean
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
  },
  repeats: {
    type: Boolean
  },
  repeatUnit: {
    type: String
  },
  repeatConst: {
    type: Number
  },
  dueDate: {
    type: Date
  },
  mustBeNear: {
    type: Boolean
  },
  isComplete: {
    type: Boolean
  }
}, { collection: 'events' });

const Event = module.exports = mongoose.model('Event', EventSchema);

// CREATE: Generate and store a given event in the database.
module.exports.addEvent = function (newEvent, callback) {
  newEvent.save(callback);
}

// READ: Find an event by id wrapper
module.exports.getEventByID = function (id, callback) {
  Event.findById(id, callback);
}

// READ: Find subset of events by user id
module.exports.getEventsByUserID = function (userID, callback) {
  const query = { userID: userID, isComplete: false };
  Event.find(query, callback);
}

// READ: Find subset of events by user id and sort by due date
module.exports.getUserEventsOrdered = function (userIDcallback) {
  const query = { userID: userID, isComplete: false };
  const options = { sort: { dueDate: 1 } };
  Event.find(query, null, options, callback);
}

// READ: Find all public events
module.exports.getPublicEvents = function (callback) {
  const query = { isPublic: true, isComplete: false };
  Event.find(query, callback);
}

// UPDATE: Overwrite data in a given event.
module.exports.updateEvent = function (eventID, newEvent, callback) {
  Event.findOneAndUpdate({ _id: eventID }, newEvent, { new: true }, callback);
}

// DELETE: Remove an event from the database.
module.exports.deleteEvent = function (eventID, callback) {
  Event.deleteOne({ _id: eventID }, callback);
}

// DELETE: Remove all events associated with a given userID.
module.exports.deleteAllEventsByUserID = function (userID, callback) {
  Event.deleteMany({ userID: userID }, callback);
}
