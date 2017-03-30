const request = require('superagent')
const Document = require('../model/document.js')
const Task = require('../model/task.js')
module.exports = function(user) {


  return Promise.resolve(request.get('https://www.googleapis.com/drive/v3/files?pageSize=8&q=mimeType+%3D+"application%2Fvnd.google-apps.document"')
  .set('Authorization', `Bearer ${user.accessToken}`)
  .then(res => {

    console.log('THESE ARE the number of documents', res.body.files.length)

    res.body.files.forEach(file => {
      let resp
      request.get(`https://www.googleapis.com/drive/v3/files/${file.id}/comments?fields=comments`)
      .set('Authorization', `Bearer ${user.accessToken}`)
      .then(response => {
        resp = response
        if(!response.body.comments.length) return
        if(user.documents.indexOf(file.id) === -1) {
          console.log(`THIS DOCUMENT HAS ${response.body.comments.length} COMMENTS`)
          let fileData = {
            googleID: file.id,
            name: file.name
          }
          user.documents.push(file.id)
          console.log('user documents', user.documents)
          user.save()
          return new Document(fileData).save()
        }
      })
      .then(file => {
        if (file) {
          let email = user.email
          return resp.body.comments.filter(comment => {
            let splitContent = comment.content.split(' ')
            if ((splitContent.indexOf(`+${email}`) !== -1) || (splitContent.indexOf(`@${email}`) !== -1)) {
              console.log(comment)
              let taskData = {
                googleID: comment.id,
                author: comment.author.displayName,
                user: user._id,
                comment: comment.content
              }
              return new Task(taskData).save()
              // file.tasks.push(comment.id)
              // file.save()
            }
          })
        }
      })
      .catch(err => console.error(err))

    })



    .catch(err => {
      console.log('THIS IS THE ERROR', err)
    })



  })
  .catch(err => {
    console.log('we are in the catch block', err)
  })



)}
