// 'use strict'
//
// const Category = require('../model/category')
// const Document = require('../model/document')
// const Task = require('../model/task')
//
// module.exports = function (filesAndCommentsArray) {
//   return new Promise((resolve, reject) => {
//     let uncategorizedCategory = null
//     let userID = filesAndCommentsArray[0].user._id
//     Category.findOneAndUpdate({
//       name: 'Uncategorized',
//       user: userID,
//       priority: 1
//     }, {
//       upsert: true,
//       new: true
//     })
//     .then( category => {
//       uncategorizedCategory = category
//       return Task.findOneAndUpdate({
//         author: 'system',
//         category: uncategorizedCategory._id,
//         userID: userID,
//         comment: 'placeholder'
//       },{
//         upsert: true,
//         new: true
//       })
//     })
//     .then( () => {
//       return Promise.all(filesAndCommentsArray.map( file => {
//         return Document.findOneAndUpdate({
//           googleID: file.file.id,
//           name: file.file.name,
//           user: userID,
//           link: file.file.webViewLink
//         },{
//           upsert: true,
//           new: true
//         })
//       }))
//     })
//     .then( documents => {
//
//     })
//   })
// }
