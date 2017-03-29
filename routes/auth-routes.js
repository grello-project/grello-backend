'use strict'

const Router = require('express').Router
const googleOAUTH = require('../lib/google-oauth-middleware')
// const passport = require('passport')

const router = module.exports = new Router()

router.get('/auth/google', (req, res) => {
  console.log('AT /AUTH/GOOGLE')
  const googleAuthBase = 'https://accounts.google.com/o/oauth2/v2/auth'
  const googleAuthResponseType = 'response_type=code'
  const googleAuthClientID = `client_id=${process.env.CLIENT_ID}`
  const googleAuthScope = 'scope=profile%20email%20openid%20https://www.googleapis.com/auth/drive'
  const googleAuthRedirectURI = 'redirect_uri=http://localhost:3000/auth/google/callback'
  const googleAuthAccessType = 'access_type=offline'
  const googleAuthPrompt = 'prompt=consent'

  const googleAuthURL = `${googleAuthBase}?${googleAuthResponseType}&${googleAuthClientID}&${googleAuthScope}&${googleAuthRedirectURI}&${googleAuthAccessType}&${googleAuthPrompt}`

  res.redirect(googleAuthURL)
})

router.get('/auth/google/callback', googleOAUTH, (req, res) => {
  console.log('AT /auth/google/callback')
  // console.log('REQ.GOOGLEOAUTH', req.googleOAUTH)

  res.end()
  // should have either req.googleError or req.googleOAUTH
  // console.log('googleError', req.googleError);
  // console.log('googleOAUTH', req.googleOAUTH);
  //
  // // if googleError deal with google Error
  // if(req.googleError){
  //   return res.redirect('/');
  // }
  //
  // // check if user allreay exists
  // User.findOne({email: req.googleOAUTH.email})
  // .then(user => {
  //   if (!user) return Promise.reject(new Error('user not found'));
  //   return user;
  // })
  // .catch(err => {
  //   if (err.message === 'user not found'){
  //     let userData = {
  //       username: req.googleOAUTH.email,
  //       email: req.googleOAUTH.email,
  //       google: {
  //         googleID: req.googleOAUTH.googleID,
  //         tokenTTL: req.googleOAUTH.tokenTTL,
  //         tokenTimestamp: Date.now(),
  //         refreshToken: req.googleOAUTH.refreshToken,
  //         accessToken: req.googleOAUTH.accessToken,
  //       }
  //     }
  //     return new User(userData).save()
  //   }
  //   return Promise.reject(err);
  // })
  // .then(user => user.generateToken())
  // .then(token => {
  //   res.redirect(`/?token=${token}`);
  // })
  // .catch(err => {
  //   console.error(err);
  //   console.log('user not found');
  //   res.redirect('/');
  // })
  //res.send('lulwat');
  //return new User(userData).save();
  //})
  //.then(user => user.generateToken())
  //.then(token => {
  //res.send(token);
  //})
  //.catch((err) => {
  //console.error(err);
  //res.send('boo hoo')
  //});

})





//
// (req, res) => {
//   console.log('WE ARE IN AUTH GOOGLE/CALLBACK')
//   console.log('USER TO TOTOTOTO', req.user)
//   res.redirect('https://wattle.io')
// })
