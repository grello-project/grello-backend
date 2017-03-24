'use strict'

let mongoose = require('mongoose')

let taskSchema = mongoose.Schema({
  googleID: {type: String, required: true, unique: true},
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'projects'},
  taskName: {type: String, required: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  email: {type: String, required: true},
  dueDate: Date,
  assignedDate: Date,
  done: Boolean
})

module.exports = mongoose.model('tasks', taskSchema)
