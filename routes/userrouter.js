/*
 * Authentication Router
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

// Register user
router.post('/reg', (req, res, next) => {
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  User.getUserByUsername(req.body.username, (err, user) => {
    if (err) throw err;
    if (user) {
      res.json({ success: false, msg: "User already exists." });
    } else {
      User.addUser(newUser, (err, user) => {
        if (err) {
          res.json({ success: false, msg: "Failed to register user" });
          console.log("Failed to register user: " + err);
        } else {
          res.json({ success: true, msg: "User registered", user: { id: user._id, username: user.username } });
        }
      });
    }
  });
});

// Authenticate
router.post('/auth', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const isMobile = req.body.mobile != null;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: 604800 // 1 week
        });

        if (isMobile) {
          Event.getEventsByUserID(user._id, (err, events) => {
            if (!err) {
              res.json({
                success: true,
                token: 'Bearer ' + token,
                user: {
                  id: user._id,
                  username: user.username,
                  reminders: events
                }
              });
            }
          });
        } else {
          res.json({
            success: true,
            token: 'Bearer ' + token,
            user: {
              id: user._id,
              username: user.username
            }
          });
        }
      } else {
        return res.json({ success: false, msg: 'Wrong password' });
      }
    });
  });
});

// Delete account
router.delete('/del', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user) {
    Event.deleteAllEventsByUserID(req.body.userID, (err) => {
      if (err) {
        console.log("Error deleting all of the user's events: " + err);
        res.json({ success: false, msg: "Failed to delete user's events." });
      }
    });
    User.deleteUser(req.user, (err) => {
      if (err) {
        console.log("Error deleting user: " + err);
        res.json({ success: false, msg: "Failed to delete user." });
      } else {
        res.json({ success: true, msg: "Deleted user successfully." });
      }
    });
  }
  else {
    res.json({ success: false, msg: "Error deleting user: insufficient parameters." });
  }
});

module.exports = router;
