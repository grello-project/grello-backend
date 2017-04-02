const request = require('superagent')
const Document = require('../model/document.js')
const Task = require('../model/task.js')


module.exports = function(user) {
  return Promise.resolve(
    request
    .get('https://www.googleapis.com/drive/v3/files?pageSize=10&q=mimeType+%3D+"application%2Fvnd.google-apps.document"')
    .set('Authorization', `Bearer ${user.accessToken}`)
    .then(res => {
      console.log('getting files')
      let promises = res.body.files.map(file => {
        let fileData = {
          googleID: file.id,
          name: file.name,
          user: user._id
        }
        return new Document(fileData).save()
      })
      return Promise.all(promises)
    })
    .then(files => {
      console.log('getting comments')
      let promises = files.map(file => {
        return request
        .get(`https://www.googleapis.com/drive/v3/files/${file.googleID}/comments?fields=comments`)
        .set('Authorization', `Bearer ${user.accessToken}`)
      })
      return Promise.all(promises)
    })
    .then(responses => {
      console.log('filtering comments')
      responses.forEach(file => {
        if(file.body.comments.length) {
          let promises = file.body.comments.map(comment => {
            let splitContent = comment.content.split(' ')
            if ((splitContent.indexOf(`+${user.email}`) !== -1) || (splitContent.indexOf(`@${user.email}`) !== -1)) {
              let taskData = {
                googleID: comment.id,
                author: comment.author.displayName,
                user: user._id,
                comment: comment.content
              }
              return new Task(taskData).save()
            }
          })
          return Promise.all(promises)
        }
      })
    })
    .then(() => Promise.resolve(user))
    .catch(err => {
      console.log('we are in the catch block', err)
    })
)}
