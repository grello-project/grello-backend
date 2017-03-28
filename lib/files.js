const request = require('superagent')
// const User = require('../model/user.js')

module.exports = function(token) {
  return Promise.resolve(request.get('https://www.googleapis.com/drive/v3/files')
  .set('Authorization', `Bearer ${token}`)
  .then(res => {
    console.log('res', res.body.files[0])
    return res.body.files[0].id
  })
)}
  // .then(id => {
  //   request.get(`https://www.googleapis.com/drive/v3/files/${id}/comments?fields=comments`)
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .then(res => {
  //       console.log('all comments', res.body.comments.length)
  //       let email = profile.emails[0].value
  //       return res.body.comments.filter(comment => {
  //         let splitContent = comment.content.split(' ')
  //         if ((splitContent.indexOf(`+${email}`) !== -1) || (splitContent.indexOf(`@${email}`) !== -1)) return comment
  //       })
  //     })
  //     .then(result => console.log('comments', result))
  //     .catch(err => console.error(err))
  // })
  // .catch(err => {
  //   console.error(err)
  // })
