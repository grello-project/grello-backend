'use strict'

const request = require('superagent')
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
  User.findOne({email: profile.emails[0].value})
  .then(user => {
    if (!user) return Promise.reject(new Error('user not found'))
    return user
  })
  .catch(err => {
    if (err.message === 'user not found') {
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
  .then(() => {
    request.get('https://www.googleapis.com/drive/v3/files')
      .set('Authorization', `Bearer ${accessToken}`)
      .then(res => {
        console.log('res', res.body.files[0])
      })
      .catch(err => {
        console.error(err)
      })
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
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'email', 'https://www.googleapis.com/auth/drive'], accessType: 'offline'}))

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {

    console.log(('REQ.USER', req.user))
    // Successful authentication, redirect home.
    res.send(`<img src="${req.user.photos[0].value}">`)
    // res.redirect('/')
  })
