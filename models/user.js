'use strict';
var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
// var userQuestSchema = new Schema({
//   quest: {
//     type: Schema.Types.ObjectId,
//     ref: 'Quest'
//   },
//   progress: [{
//     objective: String,
//     value: Number
//   }]
// });
var userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  group: String
});
userSchema.pre('save', function (cb) {
  var user = this;

  //only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return cb();
  }
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return cb(err);
    }
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return cb(err);
      }
      // override the cleartext password with the hashed one
      user.password = hash;

      cb();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    console.log(isMatch);
    cb(null, isMatch);
  });
};
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});
module.exports = mongoose.model('User', userSchema);
