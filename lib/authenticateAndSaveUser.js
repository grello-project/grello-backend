'use strict'

const google = require('googleapis')
const oauth2 = google.oauth2('v2')
const User = require('../model/user.js')

let oauth2Client = require('../lib/oauth2Client')

module.exports = function(code, testUser) {
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, (err, tokens) => {

      // if(process.env.NODE_ENV === 'testing') {
      //   console.log('TESTINGS IN authenticateAndSaveUser')
      //   return resolve(testUser)
      // }
      if(process.env.NODE_ENV === 'testing') {
        err = null
        tokens = testUser.tokens
      }
      if (err) return reject(err)
      oauth2Client.setCredentials(tokens)
      oauth2.userinfo.get({
        auth: oauth2Client
      }, (err, profile) => {
        if(process.env.NODE_ENV === 'testing') {
          err = null
          profile = testUser
        }
        if (err) return reject(err)
        User
        .findOne({googleID: profile.id})
        .then(user => {
          if (!user) {
            let userData = {
              googleID: profile.id,
              name: profile.name,
              email: profile.email,
              profilePic: profile.picture,
              lastLogin: Date.now(),
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              expiration: tokens.expiry_date,
            }
            console.log('OUR USERDATA', userData)
            return new User(userData).save()
          } else {
            console.log('User exists. Updating user.')
            return User.findOneAndUpdate(user._id, { $inc: { timesLoggedIn: 1 } }, { new: true })
          }
        })
        .then(user => {
          console.log('user authenticated and saved/updated:', user)
          resolve(user)
        })
        .catch(err => reject(err))
      })
    })
  })
}
