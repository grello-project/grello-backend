'use strict'

let mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  googleID: {type: String, unique: true},
  priority: Number,
  tag: {type: mongoose.Schema.Types.ObjectId, ref: 'tags'},
  document: {type: mongoose.Schema.ObjectId, ref: 'documents'},
  author: {type: String, required: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  comment: {type: String, required: true},
  dueDate: Date,
  assignedDate: Date,
  done: Boolean
})

module.exports = mongoose.model('tasks', taskSchema)
