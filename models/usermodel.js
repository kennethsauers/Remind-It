const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//var ContactSchema = require('./contactmodel');

// Define schema for User object
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accountCreationDate: {
    type: Date
  },
  birthday: {
    type: Date
  }
}, { collection: 'users' });

const User = module.exports = mongoose.model('User', UserSchema);

// Find a user by id wrapper
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}

// Find a user by username wrapper
module.exports.getUserByUsername = function (username, callback) {
  const query = { username: username }
  User.findOne(query, callback);
}

// add user to db wrapper
module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.accountCreationDate = new Date();
      newUser.save(callback);
    });
  });
}

// Compare candidatePassword with password
module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}

// Delete a User account
module.exports.deleteUser = function (user, callback) {
  User.deleteOne({ _id: user._id }, callback);
}
