'use strict'

const Category = require('../model/category')
const Document = require('../model/document')
const Task = require('../model/task')

module.exports = function (filesAndCommentsArray, user) {
  return new Promise((resolve, reject) => {
    let uncategorizedCategory = null
    let userID = user._id
    new Category({
      name: 'Uncategorized',
      user: userID,
      priority: 1
    })
    .save()
    .then( category => {
      uncategorizedCategory = category
      return new Task({
        author: 'system',
        category: uncategorizedCategory._id,
        userID: userID,
        comment: 'placeholder'
      }).save()
    })
    .then( () => {
      let filteredFileArray = filesAndCommentsArray.reduce(function (arr, file) {
        if (file.comments.length > 0) {
          arr.push(new Document({
            googleID: file.file.id,
            name: file.file.name,
            user: userID,
            link: file.file.webViewLink
          }))
        }
        return arr
      }, [])
      return Document.insertMany(filteredFileArray)
    })
    .then( documents => {
      // return Promise.all()
      let savedTasks = documents.map( document => {
        let result = filesAndCommentsArray.find(findFileHelper, document)
        let tasks = result.comments.map( comment => {
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
          return new Task(taskData)
        })
        return Task.insertMany(tasks)
      })

      function findFileHelper (file) {
        return file.file.id === this.googleID
      }

      return Promise.all(savedTasks)
    })
    .then(() => resolve(user))
    .catch( err => reject(err))
  })
}
