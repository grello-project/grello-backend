const request = require('superagent')
// const User = require('../model/user.js')

module.exports = function(token) {
  return Promise.resolve(request.get('https://www.googleapis.com/drive/v3/files?pageSize=8&q=mimeType+%3D+"application%2Fvnd.google-apps.document"')
  .set('Authorization', `Bearer ${token}`)
  .then(res => {
    console.log('BODY FILES', res.body.files)
    return res.body.files.map(file => file.id)
    // return res.body.files.filter(file => file.mimeType === 'application/vnd.google-apps.document' || file.mimeType === 'application/vnd.google-apps.spreadsheet' ).map(file => file.id)
  })
  .then(ids => {
    console.log('THESE ARE IDS', ids)
    console.log('THESE ARE the number of documents', ids.length)

    ids.forEach(id => {
      request.get(`https://www.googleapis.com/drive/v3/files/${id}/comments?fields=comments`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        // if(res.body.comments.length) console.log('res.body.comments', res.body.comments)
        console.log('BODY COMMENTS', res.body.comments.length)

      })
      .catch(err => {
        console.log('THIS IS THE ERROR', err)
      })

    })



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
