'use strict'

const google = require('googleapis')
const oauth2 = google.oauth2('v2')
const User = require('../model/user.js')

let oauth2Client = require('../lib/oauth2Client')

module.exports = function(code) {
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) return reject(err)
      // console.log('tokens received:', tokens)
      oauth2Client.setCredentials(tokens)
      oauth2.userinfo.get({
        auth: oauth2Client
      }, (err, profile) => {
        if (err) return reject(err)
        // console.log('profile received:', profile)
        // console.log('profile string is of type:', typeof profile.id, ' and content =', profile.id.toString())
        User
        .findOne({'googleID': profile.id.toString()})
        .then(queryResult => {
          // console.log('heres the query result:', queryResult)
          if (!queryResult) {
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
            // console.log('User exists. Updating user.')
            return User.findByIdAndUpdate(queryResult._id, { $inc: { timesLoggedIn: 1 } }, { new: true })
          }
        })
        .then(authenticatedUser => {
          // console.log('user authenticated and saved/updated:', authenticatedUser)
          resolve(authenticatedUser)
        })
        .catch(err => reject(err))
      })
    })
  })
}
