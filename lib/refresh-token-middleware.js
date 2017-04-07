'use strict'

module.exports = function(req, res, next){
  console.log('CHECKING REFRESH TOKEN')
  if(req.user.expiration < Date.now() / 1000) {
    // request.post('https://www.googleapis.com/oauth2/v4/token')
    // .type('form')
    // .set('refresh_token', req.user.refreshToken)
    // .set('client_id', process.env.CLIENT_ID)
    // .set('client_secret', process.env.CLIENT_SECRET)
    // .set('grant_type', 'refresh_token')
    // .then(res => {
    //   console.log('WE TRADING FOR AN ACCESS TOKEN YO', res.access_token)
    //   req.user.accessToken = res.access_token
    //   res.json(res.access_token)
    // })
    console.log('THE TOKEN HAS EXPIRED')
    return next()
  }
  console.log('THE TOKEN IS GOOD')
  next()
}



// .catch(next)
// }
// To refresh an access token, your application sends an HTTPS POST request
// to Google's authorization server
// (https://www.googleapis.com/oauth2/v4/token) that includes the following
// parameters:
// refresh_token The refresh token returned from the authorization code exchange.
// client_id
// client_secret
// grant_type this field must contain a value of refresh_token.
// SAMPLE request
// POST /oauth2/v4/token HTTP/1.1
// Host: www.googleapis.com
// Content-Type: application/x-www-form-urlencoded
//
// client_id=<your_client_id>&
// client_secret=<your_client_secret>&
// refresh_token=<refresh_token>&
// grant_type=refresh_token

// SAMPLE response
// {
//   "access_token":"1/fFAGRNJru1FTz70BzhT3Zg",
//   "expires_in":3920,
//   "token_type":"Bearer"
// }

// PATCH / PUT https://www.googleapis.com/drive/v3/files/fileId/comments/commentId
