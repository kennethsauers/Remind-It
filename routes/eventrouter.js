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
  if (req.body.isPublic != null && req.body.isPublic == true) {
    const publicEvents = Event.getPublicEvents(true, (err, events) => {
      if (err) {
        res.json({success: false, msg: "Error reading public events"});
        console.log("Error reading public events: " + err);
      }
    })
    res.json({success: true, msg: "Public events found", events: publicEvents});
  }
  else if (req.body.userID != null) {
    res.json({success: false, msg: "Reading events by userID not ready."});
  }
  else {
    res.json({success: false, msg: "Error reading event"})

  }
});

module.exports = router;
