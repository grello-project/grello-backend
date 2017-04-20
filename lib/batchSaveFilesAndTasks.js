'use strict'

const Category = require('../model/category')
const Document = require('../model/document')
const Task = require('../model/task')

module.exports = function (filesAndCommentsArray, user) {
  return new Promise((resolve, reject) => {
    let uncategorizedCategory = null
    let userID = user._id
    new Category({
      name: 'uncategorized',
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
        console.log('DO WE GET IN THIS BATCHY')
        if (file.comments.length > 0) {
          console.log('HOW ABOUT HERE')
          arr.push(new Document({
            googleID: file.file.id,
            name: file.file.name,
            user: userID,
            link: file.file.webViewLink
          }))
          console.log('DOCUMENT YEAH', arr)
        }
        return arr
      }, [])
      return Document.insertMany(filteredFileArray)
    })
    .then( documents => {
      // return Promise.all()
      console.log('WE ARE HERE', documents)
      let savedTasks = documents.map( document => {
        console.log('we are mapping yo')
        let result = filesAndCommentsArray.find(findFileHelper, document)



  //   { user:
  //  { __v: 0,
  //    googleID: '100743838787327751178',
  //    name: 'Jessica Vasquez-Soltero',
  //    email: 'jmichellevs@gmail.com',
  //    profilePic: 'https://lh4.googleusercontent.com/-vkjVT_PWQ80/AAAAAAAAAAI/AAAAAAAAg-I/tadCWu98CN4/photo.jpg',
  //    lastLogin: 2017-04-20T22:54:41.457Z,
  //    accessToken: 'ya29.GlwyBDbI9lEv1GDZWyk1vw8O19oBSYjGIs5Dzeq3mrXxMdt2tOdj2uBeZD5QeQu0NIjjpMhRO3nnbWZAkN7CORrHOlhGUKTJcgKIdmr13tKYDeR90WFfDVpYyUA7Lg',
  //    expiration: 1492732481328,
  //    _id: 58f93c3166a4f411c6e1fde0,
  //    timesLoggedIn: 0 },
  // file:
  //  { id: '13NixmC29d18rDcmT1KJHTa28LX4wbG_cCQ5GYPdofmE',
  //    name: 'hydroflask',
  //    webViewLink: 'https://docs.google.com/document/d/13NixmC29d18rDcmT1KJHTa28LX4wbG_cCQ5GYPdofmE/edit?usp=drivesdk' },
  // comments:
  //  [ { id: 'AAAAA-rJC48',
  //      createdTime: '2017-04-14T18:37:17.438Z',
  //      modifiedTime: '2017-04-14T18:37:17.438Z',
  //      author: [Object],
  //      content: '+jmichellevs@gmail.com',
  //      deleted: false,
  //      resolved: false,
  //      quotedFileContent: [Object],
  //      replies: [] },
  //    { id: 'AAAAA-rJC44',
  //      createdTime: '2017-04-14T18:36:34.792Z',
  //      modifiedTime: '2017-04-14T18:36:34.792Z',
  //      author: [Object],
  //      content: 'Please say yes +jmichellevs@gmail.com',
  //      deleted: false,
  //      resolved: false,
  //      quotedFileContent: [Object],
  //      replies: [] },
  //    { id: 'AAAAA-rJC4o',
  //      createdTime: '2017-04-14T18:32:20.242Z',
  //      modifiedTime: '2017-04-14T18:32:20.242Z',
  //      author: [Object],
  //      content: '+jmichellevs@gmail.com',
  //      deleted: false,
  //      resolved: false,
  //      quotedFileContent: [Object],
  //      replies: [] } ] }












        console.log('the result', result.comments)
        let tasks = result.comments.map( comment => {
          console.log('MAPPING THROOUGH COMMENTS')
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
