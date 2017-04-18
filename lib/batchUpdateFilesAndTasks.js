'use strict'

const Category = require('../model/category')
const Document = require('../model/document')
const Task = require('../model/task')

module.exports = function (filesAndCommentsArray, user) {
  return new Promise((resolve, reject) => {
    let uncategorizedCategory = null
    let userID = user._id
    Category
    .findOne({
      name: 'Uncategorized',
      user: userID
    })
    .then( category => {
      uncategorizedCategory = category
      return Promise.all(filesAndCommentsArray.map( file => {
        let updatedDoc = new Document({
          googleID: file.file.id,
          name: file.file.name,
          user: userID,
          link: file.file.webViewLink
        })
        return Document.findOneAndUpdate({
          googleID: file.file.id,
          user: userID,
        },updatedDoc,{
          upsert: true,
          new: true
        })
        .then( document => {
          let result = filesAndCommentsArray.find(findFileHelper, document)
          let updatedTasks = result.comments.map( comment => {
            // TODO: we should eliminate this map if we can --> we are looking at a O(n^3) run time here
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
              userID: userID,
              comment: comment.content,
              document: document.googleID,
              link: `https://docs.google.com/document/d/${document.googleID}/edit?disco=${comment.id}`,
              category: uncategorizedCategory._id,
              resolved: comment.resolved,
              quote: comment.quotedFileContent.value,
              assignedDate: comment.createdTime,
              replies: comment.replies
            }
            let updatedTask = new Task(taskData)
            return Task.findOneAndUpdate({
              googleID: updatedTask.googleID,
              userID: userID
            }, updatedTask, {
              upsert: true,
              new: true
            })
          })

          function findFileHelper (file) {
            return file.file.id === this.googleID
          }

          return Promise.all(updatedTasks)
        })
      }))
    })
    .then(() => resolve(user))
    .catch( err => reject(err))
  })
}
