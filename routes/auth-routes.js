'use strict'

const Router = require('express').Router
const passport = require('passport')

const router = module.exports = new Router()

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive'], accessType: 'offline'}))

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {

    console.log('WE ARE IN AUTH GOOGLE/CALLBACK')
    console.log('USER TO TOTOTOTO', req.user)
    res.redirect('https://wattle.io')
  })
