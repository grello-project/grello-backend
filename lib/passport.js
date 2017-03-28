const User = require('../model/user.js')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const getFiles = require('../lib/google-data-middleware.js')

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user)
    })
  })

  passport.use(new GoogleStrategy({
    clientID        : process.env.CLIENT_ID,
    clientSecret    : process.env.CLIENT_SECRET,
    callbackURL     : 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('WE ARE IN PASS USE')

    User.findOne({email: profile.emails[0].value})
      .then(user => {
        console.log('WHO IS OUR USER', user)
        if(!user) return Promise.reject(new Error('user not found'))

        return Promise.resolve(user)
      })
      .catch(err => {
        console.log('WE DONT HAVE YOU IN DB, LET\'S ADD YOU!')
        if(err.message === 'user not found') {

          const userData = {
            name: profile.name.givenName,
            email: profile.emails[0].value,
            googleID: profile.id,
            refreshToken: refreshToken,
            accessToken: accessToken,
            profilePic: profile.photos[0].value
          }

          return new User(userData).save()
        }

        return Promise.reject(err)
      })
      .then(user => {
        console.log('WE HAVE A USER YO', user)
        profile = user
        return Promise.resolve(profile)
      })
      .then(profile => {
        getFiles(accessToken)
        return cb(null, profile)
      })

  })
)}
