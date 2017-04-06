const request = require('superagent')
const Document = require('../model/document.js')
const Task = require('../model/task.js')
const Category = require('../model/category')


module.exports = function(user) {
  if(process.env.NODE_ENV === 'testing') {
    return Promise.resolve(user)
  }

  return Promise.resolve(
    new Category({name: 'uncategorized', user: user._id})
      .save()
      .then( uncatCategory => {
        console.log('created uncategory:', uncatCategory)
        return request
          .get('https://www.googleapis.com/drive/v3/files?pageSize=5&q=mimeType+%3D+"application%2Fvnd.google-apps.document"')
          .set('Authorization', `Bearer ${user.accessToken}`)
          .then(res => {
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
                      userID: user._id,
                      comment: comment.content,
                      category: uncatCategory._id
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
      })
      .catch( err => console.error(err))
)}
