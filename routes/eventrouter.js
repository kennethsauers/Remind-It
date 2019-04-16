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
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let newEvent = new Event({
    userID:           req.body.userID,
    isPublic:         req.body.isPublic,
    name:             req.body.name,
    description:      req.body.description,
    lat:              req.body.lat,
    lng:              req.body.lng,
    repeats:          req.body.repeats,
    repeatUnit:       req.body.repeatUnit,
    repeatConst:      req.body.repeatConst,
    dueDate:          req.body.dueDate,
    mustBeNear:       req.body.mustBeNear,
    isComplete:       req.body.isComplete
  });
  Event.addEvent(newEvent, (err, event) => {
    if (err) {
      res.json({ success: false, msg: "Error adding event" });
      console.log("Error adding event:" + err);
    } else {
      res.json({ success: true, msg: "Event added", event: event });
    }
  });
});

router.get('/get/my', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Event.getEventsByUserID(req.user._id, (err, events) => {
    if (err) {
      res.json({ success: false, msg: "Failed to get events by user ID." });
    } else {
      res.json(events)
    }
  });
});

router.get('/get/all', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Event.getPublicEvents((err, events) => {
    if (err)
      res.json({ success: false, msg: "Failed to get public events." });
    else
      res.json(events)
  });
});

router.get('/get/id/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Event.getEventByID(req.params.id, (err, event) => {
    if (err) {
      res.json({})
    } else {
      res.json(event)
    }
  });
});

// Read event
router.get('/read', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.body.userID) {
    Event.getEventsByUserID(req.body.userID, (err, events) => {
      if (err) {
        res.json({ success: false, msg: "Failed to get events by user ID." })
        console.log("Error getting events by user ID: " + err);
      } else {
        res.json({ success: true, msg: events });
      }
    });
  }
  else if (req.body.isPublic) {
    Event.getPublicEvents(req.body.isPublic, (err, events) => {
      if (err) {
        console.log("Error getting public events: " + err);
        res.json({ success: false, msg: "Failed to get public events." });
      } else {
        res.json({ success: true, msg: events })
      }
    });
  }
  else {
    res.json({ success: false, msg: "Error reading event: insufficient parameters" });
  }
});

// Redundant read event code for mobile access
router.get('/read/:userID', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const userID = req.params.userID;
  Event.getEventsByUserID(userID, (err, events) => {
    if (err) {
      res.json({ success: false, msg: "Failed to get events by user ID." })
      console.log("Error getting events by user ID: " + err);
    } else {
      res.json(events);
    }
  });
});

// Update event
router.put('/update/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const eventID = req.params.id;
  const newEvent = req.body;
  Event.updateEvent(eventID, newEvent, (err, updatedEvent) => {
    if (err) {
      console.log("Error updating event: " + err);
      res.json({ success: false, msg: "Failed to update event." });
    } else {
      res.json({ success: true, event: updatedEvent });
    }
  });
});


// Delete event
router.delete('/delete', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.body._id) {
    const eventID = req.body._id;
    Event.deleteEvent(req.body._id, (err) => {
      if (err) {
        console.log("Error deleting event: " + err);
        res.json({ success: false, msg: "Failed to delete event." });
      } else {
        res.json({ success: true, msg: "Deleted event successfully." });
      }
    });
  }
  else {
    res.json({ success: false, msg: "Error deleting event: insufficient parameters." });
  }
});


module.exports = router;
