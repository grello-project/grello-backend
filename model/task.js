'use strict'

let mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  googleID: {type: String},
  priority: Number,
  tag: {type: mongoose.Schema.Types.ObjectId, ref: 'tags'},
  document: {type: String, ref: 'documents'},
  author: {type: String, required: true},
  quote: String,
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  comment: {type: String, required: true},
  replies: [{
    googleID: String,
    createdTime: String,
    modifiedTime: String,
    authorName: String,
    authorPic: String,
    content: String
  }],
  link: String,
  dueDate: Date,
  assignedDate: Date,
  resolved: Boolean
})

module.exports = mongoose.model('tasks', taskSchema)
