'use strict'

let mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  googleID: {type: String, unique: true},
  priority: Number,
  tag: {type: mongoose.Schema.Types.ObjectId, ref: 'tags'},
  doc: {type: mongoose.Schema.ObjectId, ref: 'documents'},
  author: {type: String, required: true},
  quote: String,
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  comment: {type: String, required: true},
  dueDate: Date,
  assignedDate: Date,
  resolved: Boolean
})

module.exports = mongoose.model('tasks', taskSchema)
