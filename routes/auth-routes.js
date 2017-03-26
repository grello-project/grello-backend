'use strict'

const Router = require('express').Router
const passport = require('passport')
const User = require('../model/user.js')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const router = module.exports = new Router()


passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
function(accessToken, refreshToken, profile, cb) {
  console.log('accessToken', accessToken)
  console.log('PROFILE', profile)

  User.findOne({email: profile.emails[0].value})
  .then(user => {
    if (!user) return Promise.reject(new Error('user not found'))
    return user
  })
  .catch(err => {
    if (err.message === 'user not found'){
      let userData = {
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

  return cb(null, profile)

  // .then(user => user.generateToken())
  // .then(token => {
  //   res.redirect(`/?token=${token}`);
  // })
  // .catch(err => {
  //   console.error(err);
  //   console.log('user not found');
  //   res.redirect('/');
  // })
}))

passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'email', 'https://www.googleapis.com/auth/drive'] }))

router.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }),
  function(req, res) {
    // console.log(WTFFFDFDS);
    console.log(('REQ.USER', req.user))
    // Successful authentication, redirect home.
    res.send('HELLO')
    // res.redirect('/')
  })
