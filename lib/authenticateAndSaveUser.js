'use strict'

const google = require('googleapis')
const oauth2 = google.oauth2('v2')
const User = require('../model/user.js')

let oauth2Client = require('../lib/oauth2Client')

module.exports = function(code) {
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) return reject(err)
      oauth2Client.setCredentials(tokens)
      oauth2.userinfo.get({
        auth: oauth2Client
      }, (err, profile) => {
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
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              expiration: tokens.expiry_date,
            }
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
