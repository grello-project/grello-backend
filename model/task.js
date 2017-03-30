'use strict'

let mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  googleID: {type: String, required: true, unique: true},
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'projects'},
  author: {type: String, required: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  comment: {type: String, required: true},
  dueDate: Date,
  assignedDate: Date,
  done: Boolean
})

module.exports = mongoose.model('tasks', taskSchema)
//
// { kind: 'drive#comment',
//   id: 'AAAABCTsxV8',
//   createdTime: '2017-03-28T03:16:17.310Z',
//   modifiedTime: '2017-03-28T03:16:17.310Z',
//   author:
//    { kind: 'drive#user',
//      displayName: 'Kyle Winckler',
//      photoLink: '//lh5.googleusercontent.com/-23jvsOusgJ8/AAAAAAAAAAI/AAAAAAAAAEk/6uIfpzgPaLs/s96-k-no/photo.jpg',
//      me: false },
//   htmlContent: '+<a href="mailto:jmichellevs@gmail.com" target="_blank">jmichellevs@gmail.com</a>',
//   content: '@jmichellevs@gmail.com',
//   deleted: false,
//   resolved: false,
//   quotedFileContent: { mimeType: 'text/html', value: '_id' },
//   anchor: 'kix.qwjw7xif3yv9',
//   replies: [] }
