'use strict'

let mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  googleID: {type: String, required: true, unique: true},
  priority: Number,
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'projects'},
  author: {type: String, required: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  comment: {type: String, required: true},
  dueDate: Date,
  assignedDate: Date,
  done: Boolean
})

module.exports = mongoose.model('tasks', taskSchema)
