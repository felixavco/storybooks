const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

//Load user model 
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(
    new FacebookStrategy({
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['displayName', 'name', 'picture.type(large)','emails'],
      proxy:true
    }, (accessToken, refreshToken, profile, done) => {
      const newUser = {
        facebookID: profile._json.id,
        firstName: profile._json.first_name,
        lastName: profile._json.last_name,
        email: profile._json.email,
        image: '/img/default.png'
      }


      User.findOne({
        facebookID: profile._json.id
      }).then(user => {
        if(user){
          done(null, user);
        }
        else{
          new User(newUser)
          .save()
          .then(user => done(null, user));
        }
      })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });

}