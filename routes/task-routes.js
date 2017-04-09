'use strict'

const request = require('superagent')

const Task = require('../model/task')
const Category = require('../model/category')
const Document = require('../model/document')
const bearerAuth = require('../lib/bearer-auth-middleware')
const refreshToken = require('../lib/refresh-token-middleware')

const Router = require('express').Router
const router = module.exports = new Router()

router.get('/api/tasks', bearerAuth, (req, res, next) => {
  Task
  .find({userID: req.user._id})
  .populate('category')
  .then(tasks => res.json(tasks))
  .catch(next)
})

router.put('/api/tasks/:id', bearerAuth, (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(task => res.json(task))
  .catch(next)
})

// this route will update our database with data from users drive
router.put('/api/google/tasks', bearerAuth, refreshToken, (req, res, next) => {
  console.log('WE ARE IN THIS EXTERNAL SYNC ROUTE')
  request
  .get('https://www.googleapis.com/drive/v3/files?fields=files&pageSize=5&q=mimeType+%3D+"application%2Fvnd.google-apps.document"')
  .set('Authorization', `Bearer ${req.user.accessToken}`)
  .then(resp => {
    let promises = resp.body.files.map(file => {
      return Document.findOne({googleID: file.id})
      .then(document => {
        if(!document) {
          console.log('WE HAVE A NEW DOC FROM SYNC')
          let docData = {
            googleID: file.id,
            name: file.id,
            user: req.user._id,
            createdTime: file.createdTime,
            modifiedTime: file.modifiedTime,
            link: file.webViewLink
          }
          return new Document(docData).save()
        }
        console.log('WE ARE UPDATING A DOC FROM SYNC')
        document.name = file.name
        return document.save()
      })
      .catch(err => {
        console.log('ERR TRYING TO SYNC', err)
      })
    })
    return Promise.all(promises)
  })
  .then(files => {
    let promises = files.map(file => {
      return request
      .get(`https://www.googleapis.com/drive/v3/files/${file.googleID}/comments?fields=comments`)
      .set('Authorization', `Bearer ${req.user.accessToken}`)
    })
    return Promise.all(promises)
  })
  .then(files => {
    files.forEach(file => {
      if(file.body.comments.length) {
        let promises = file.body.comments.map(comment => {
          let splitContent = comment.content.split(' ')
          if ((splitContent.indexOf(`+${req.user.email}`) !== -1) || (splitContent.indexOf(`@${req.user.email}`) !== -1)) {

            return Task.findOne({googleID: comment.id})
            .then(task => {
              if(!task) {
                console.log('WE HAVE NEW TASKS')
                return Category.findOne({name: 'uncategorized', user: req.user._id})
                .then(uncat => {
                  comment.replies = comment.replies.map(reply => {
                    return {
                      googleID: reply.id,
                      createdTime: reply.createdTime,
                      modifiedTime: reply.modifiedTime,
                      authorName: reply.author.displayName,
                      authorPic: reply.author.photoLink.slice(2),
                      content: reply.content
                    }
                  })

                  let taskData = {
                    googleID: comment.id,
                    author: comment.author.displayName,
                    userID: req.user._id,
                    comment: comment.content,
                    document: file.res.socket._httpMessage.path.substring(16, 60),
                    link: `https://docs.google.com/document/d/${file.res.socket._httpMessage.path.substring(16, 60)}/edit?disco=${comment.id}`,
                    category: uncat._id,
                    resolved: comment.resolved,
                    quote: comment.quotedFileContent.value,
                    assignedDate: comment.createdTime,
                    replies: comment.replies
                  }
                  return new Task(taskData).save()
                })
              }
              console.log('WE ARE UPDATING TASKS')
              // replies: [{
              //   googleID: String,
              //   createdTime: String,
              //   modifiedTime: String,
              //   authorName: String,
              //   authorPic: String,
              //   content: String
              // }],

              // comment.replies = comment.replies.map(reply => {
              //   return {
              //     googleID: reply.id,
              //     createdTime: reply.createdTime,
              //     modifiedTime: reply.modifiedTime,
              //     authorName: reply.author.displayName,
              //     authorPic: reply.author.photoLink.slice(2),
              //     content: reply.content
              //   }
              // })
              task.comment = comment.content
              task.resolved = comment.resolved
              task.quote = comment.quotedFileContent.value
              // task.replise = comment.replies
              return task.save()
            })
          }
        })
        return Promise.all(promises)
      }
    })
  })
  .then(() => {
    res.json({'msg': 'successfully synced google drive data'})
  })
  .catch(next)
})
