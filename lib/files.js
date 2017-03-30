const request = require('superagent')
const Document = require('../model/document.js')

module.exports = function(user) {


  return Promise.resolve(request.get('https://www.googleapis.com/drive/v3/files?pageSize=8&q=mimeType+%3D+"application%2Fvnd.google-apps.document"')
  .set('Authorization', `Bearer ${user.accessToken}`)
  .then(res => {

    console.log('THESE ARE the number of documents', res.body.files.length)

    res.body.files.forEach(file => {
      request.get(`https://www.googleapis.com/drive/v3/files/${file.id}/comments?fields=comments`)
      .set('Authorization', `Bearer ${user.accessToken}`)
      .then(response => {
        if(response.body.comments.length && user.documents.indexOf(file.id) === -1) {
          console.log(`THIS DOCUMENT HAS ${response.body.comments.length} COMMENTS`)
          let fileData = {
            googleID: file.id,
            name: file.name
          }
          user.documents.push(file.id)
          console.log('user documents', user.documents)
          user.save()
          return Document(fileData).save()
        }

        //       console.log('all comments', res.body.comments.length)
        //       let email = profile.emails[0].value
        //       return res.body.comments.filter(comment => {
        //         let splitContent = comment.content.split(' ')
        //         if ((splitContent.indexOf(`+${email}`) !== -1) || (splitContent.indexOf(`@${email}`) !== -1)) return comment
        //       })
        
      })
      .catch(err => {
        console.log('THIS IS THE ERROR', err)
      })
    })






  })
  .catch(err => {
    console.log('we are in the catch block', err)
  })



)}
