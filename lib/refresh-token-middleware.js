'use strict'

const request = require('superagent')

module.exports = function(req, res, next){
  console.log('CHECKING REFRESH TOKEN')
  if(req.user.expiration < Date.now() / 1000) {
    console.log('THE TOKEN HAS EXPIRED')
    request
    .post(`https://www.googleapis.com/oauth2/v4/token?refresh_token=${req.user.refreshToken}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .type('form')
    .then(resp => {
      req.user.accessToken = resp.body.access_token
      req.user.tokenTTL = resp.body.expires_in
      req.user.tokenTimestamp = Date.now() / 1000
      req.user.expiration = (Date.now() / 1000) + resp.body.expires_in
      req.user.save()
      return next()
    })
  }
  console.log('THE TOKEN IS GOOD')
  next()
}
