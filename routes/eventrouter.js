/*
 * Event Creation Router
 * =====================
 *
 * This script defines the backend auth routes and
 * their associated behaviors. This is responsible
 * for determining what does what, and where.
 * If app.js is the backbone, think of this as the
 * cardiovascular system.
 *
 * Authors: Jose Luis, Jorge B. Nunez
 */


const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/databaseconfig');
const User = require('../models/usermodel');
const Event = require('../models/eventmodel');


// Create event
router.post('/create', (req, res, next) => {
  let newEvent = new Event({
    userID:           req.body.userID,
    isPublic:         req.body.isPublic,
    name:             req.body.name,
    description:      req.body.description,
    location:         req.body.location,
    repeats:          req.body.repeats,
    dueDate:          req.body.dueDate,
    completionMethod: req.body.completionMethod
  });
  Event.addEvent(newEvent, (err, event) => {
    if (err) {
      res.json({success: false, msg: "Error adding event"});
      console.log("Error adding event:" + err);
    } else {
      res.json({success: true, msg: "Event added", userID: newEvent.userID});
    }
  });
});


// Read event
router.get('/read', (req, res, next) => {
  if (req.body.userID) {
    Event.getEventsByUserID(req.body.userID, (err, events) => {
      if (err) {
        res.json({success: false, msg: "Failed to get events by user ID."})
        console.log("Error getting events by user ID: " + err);
      } else {
        console.log("Events: " + events);
        res.json({success: true, msg: events});
      }
    });
  }
  else if (req.body.isPublic) {
    Event.getPublicEvents(req.body.isPublic, (err, events) => {
      if (err) {
        console.log("Error getting public events: " + err);
        res.json({success: false, msg: "Failed to get public events."});
      } else {
        console.log("Events: " + events);
        res.json({success: true, msg: events})
      }
    });
  }
  else {
    res.json({success: false, msg: "Error reading event: insufficient parameters"});
  }
});


// Update event
router.put('/update', (req, res, next) => {
  if (req.body._id) {
    const eventID = req.body._id;
    const newEvent = req.body;
    Event.updateEvent(req.body._id, req.body, (err, newEvent) => {
      if (err) {
        console.log("Error updating event: " + err);
        res.json({success: false, msg: "Failed to update event."});
      } else {
        console.log("New event: " + newEvent);
        res.json({success: true, msg: newEvent});
      }
    });
  }
  else {
    res.json({success: false, msg: "Error updating event: insufficient parameters."});
  }
});


// Delete event
router.delete('/delete', (req, res, next) => {
  if (req.body._id) {
    const eventID = req.body._id;
    Event.deleteEvent(req.body._id, (err) => {
      if (err) {
        console.log("Error deleting event: " + err);
        res.json({success: false, msg: "Failed to delete event."});
      } else {
        console.log("Deleted event.");
        res.json({success: true, msg: "Deleted event successfully."});
      }
    });
  }
  else {
    res.json({success: false, msg: "Error deleting event: insufficient parameters."});
  }
});


module.exports = router;
